#!/usr/bin/env node

/**
 * Iran Internet Access Analysis Tool
 * Network connectivity analyzer for finding accessible data centers
 * For maintaining internet freedom in restricted environments
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const { IP_RANGES, getAllProviders } = require('./ip_ranges');

const execAsync = promisify(exec);

class IranConnectivityAnalyzer {
    constructor(options = {}) {
        if (!IranConnectivityAnalyzer.deprecationWarningShown) {
            process.emitWarning('iran_connectivity.js is deprecated. Please use the src/core/pipeline verify flow.', { code: 'IRAN_CONNECTIVITY_DEPRECATED' });
            IranConnectivityAnalyzer.deprecationWarningShown = true;
        }
        this.targetIp = options.targetIp || process.argv[2];
        this.timeout = options.timeout || 5; // seconds
        this.maxConcurrent = options.maxConcurrent || 50;
        this.outputFile = options.outputFile || 'connectivity_report.json';
        this.verbose = options.verbose || false;
        this.providerKeys = Array.isArray(options.providerKeys) ? options.providerKeys : [];
        
        this.results = {
            timestamp: new Date().toISOString(),
            targetIp: this.targetIp,
            summary: {
                totalTested: 0,
                successfulConnections: 0,
                failedConnections: 0,
                successRate: 0
            },
            successfulProviders: [],
            failedProviders: [],
            detailedResults: []
        };
        
        this.activeTests = 0;
        this.testQueue = [];
        this.isRunning = false;
    }

    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        
        if (level === 'error') {
            console.error(logMessage);
        } else if (this.verbose || level === 'success') {
            console.log(logMessage);
        }
    }

    parsePingMetrics(output) {
        const normalized = String(output || '');
        const packetLine = normalized.match(/(\d+)\s+packets transmitted,\s*(\d+)\s+(?:packets\s+)?received/i);
        const lossLine = normalized.match(/(\d+(?:\.\d+)?)%\s+packet loss/i);
        const avgLine = normalized.match(/=\s*([\d.]+)\/([\d.]+)\/([\d.]+)\/([\d.]+)\s*ms/i);
        const timeLine = normalized.match(/time[=<]\s*([\d.]+)\s*ms/i);

        const transmitted = packetLine ? Number(packetLine[1]) : null;
        const received = packetLine ? Number(packetLine[2]) : null;
        const packetLossPercent = lossLine ? Number(lossLine[1]) : null;
        const averageLatencyMs = avgLine ? Number(avgLine[2]) : (timeLine ? Number(timeLine[1]) : null);

        return {
            transmitted,
            received,
            packetLossPercent,
            averageLatencyMs
        };
    }

    async runShellCheck(command) {
        try {
            const { stdout } = await execAsync(command, { timeout: this.timeout * 1000 + 1200 });
            return { ok: true, output: String(stdout || '') };
        } catch (error) {
            const combinedOutput = `${error.stdout || ''}
${error.stderr || ''}`;
            return { ok: false, output: combinedOutput };
        }
    }

    async testConnectivity(sourceCandidateIp, targetIp, testedCidr = null) {
        const startTime = Date.now();
        const finalTarget = targetIp || this.targetIp;

        const results = {
            ip: sourceCandidateIp,
            testedCidr,
            targetIp: finalTarget,
            sourcePing: false,
            sourcePort443: false,
            targetPing: false,
            port80: false,
            port443: false,
            port22: false,
            port53: false,
            tracerouteAvailable: false,
            tracerouteHops: null,
            tracerouteReachedTarget: null,
            bgpCheckAvailable: false,
            bgpOriginAsn: null,
            bgpPrefix: null,
            bgpRegistry: null,
            mtrAvailable: false,
            mtrLossPercent: null,
            mtrRawSample: null,
            responseTime: 0,
            targetReachability: 0,
            connectivityScore: 0,
            stageResults: {
                ping: 'failed',
                traceroute: 'skipped',
                bgp: 'skipped',
                mtr: 'skipped'
            },
            sourcePingStats: null,
            targetPingStats: null
        };

        // Baseline checks (kept lightweight for performance scoring)
        const sourcePing = await this.runShellCheck(`ping -c 1 -W ${this.timeout} ${sourceCandidateIp}`);
        const sourcePingOutput = sourcePing.output.toLowerCase();
        results.sourcePing = sourcePingOutput.includes('1 received') || sourcePingOutput.includes('0% packet loss');
        results.sourcePingStats = this.parsePingMetrics(sourcePing.output);

        const source443 = await this.runShellCheck(`timeout ${this.timeout} bash -c "</dev/tcp/${sourceCandidateIp}/443" 2>/dev/null && echo "SOURCE_443_OPEN" || echo "SOURCE_443_CLOSED"`);
        results.sourcePort443 = source443.output.toLowerCase().includes('source_443_open');

        const targetPing = await this.runShellCheck(`ping -c 1 -W ${this.timeout} ${finalTarget}`);
        const targetPingOutput = targetPing.output.toLowerCase();
        results.targetPing = targetPingOutput.includes('1 received') || targetPingOutput.includes('0% packet loss');
        results.stageResults.ping = results.targetPing ? 'passed' : 'failed';
        results.targetPingStats = this.parsePingMetrics(targetPing.output);

        const target80 = await this.runShellCheck(`timeout ${this.timeout} bash -c "</dev/tcp/${finalTarget}/80" 2>/dev/null && echo "TARGET_80_OPEN" || echo "TARGET_80_CLOSED"`);
        results.port80 = target80.output.toLowerCase().includes('target_80_open');

        const target443 = await this.runShellCheck(`timeout ${this.timeout} bash -c "</dev/tcp/${finalTarget}/443" 2>/dev/null && echo "TARGET_443_OPEN" || echo "TARGET_443_CLOSED"`);
        results.port443 = target443.output.toLowerCase().includes('target_443_open');

        const target22 = await this.runShellCheck(`timeout ${this.timeout} bash -c "</dev/tcp/${finalTarget}/22" 2>/dev/null && echo "TARGET_22_OPEN" || echo "TARGET_22_CLOSED"`);
        results.port22 = target22.output.toLowerCase().includes('target_22_open');

        const target53 = await this.runShellCheck(`timeout ${this.timeout} bash -c "</dev/tcp/${finalTarget}/53" 2>/dev/null && echo "TARGET_53_OPEN" || echo "TARGET_53_CLOSED"`);
        results.port53 = target53.output.toLowerCase().includes('target_53_open');

        // Stage 2: traceroute only if ping is successful
        if (results.targetPing) {
            const traceroute = await this.runShellCheck(`command -v traceroute >/dev/null 2>&1 && traceroute -n -w 1 -q 1 -m 8 ${finalTarget} 2>/dev/null || echo "TRACEROUTE_UNAVAILABLE"`);
            const tracerOutput = traceroute.output.toLowerCase();
            if (!tracerOutput.includes('traceroute_unavailable')) {
                results.tracerouteAvailable = true;
                const tracerLines = traceroute.output.split('\n').filter((line) => /^\s*\d+\s+/.test(line));
                results.tracerouteHops = tracerLines.length;
                const lastHop = tracerLines[tracerLines.length - 1] || '';
                results.tracerouteReachedTarget = lastHop.includes(finalTarget);
                results.stageResults.traceroute = 'passed';
            } else {
                results.stageResults.traceroute = 'unavailable';
            }

            // Stage 3: BGP lookup only after traceroute stage runs
            const bgp = await this.runShellCheck(`command -v whois >/dev/null 2>&1 && whois -h whois.cymru.com " -v ${finalTarget}" 2>/dev/null || echo "BGP_UNAVAILABLE"`);
            const bgpOutput = bgp.output;
            if (!bgpOutput.toLowerCase().includes('bgp_unavailable')) {
                const lines = bgpOutput.split('\n').map((line) => line.trim()).filter(Boolean);
                const dataLine = lines.find((line) => /^\d+\s*\|/.test(line));
                if (dataLine) {
                    const parts = dataLine.split('|').map((item) => item.trim());
                    results.bgpCheckAvailable = true;
                    results.bgpOriginAsn = parts[0] || null;
                    results.bgpPrefix = parts[2] || null;
                    results.bgpRegistry = parts[3] || null;
                    results.stageResults.bgp = 'passed';
                } else {
                    results.stageResults.bgp = 'no-data';
                }
            } else {
                results.stageResults.bgp = 'unavailable';
            }

            const mtr = await this.runShellCheck(`command -v mtr >/dev/null 2>&1 && mtr -n -r -c 3 --report ${finalTarget} 2>/dev/null || echo "MTR_UNAVAILABLE"`);
            const mtrOutput = mtr.output || '';
            if (!mtrOutput.toLowerCase().includes('mtr_unavailable')) {
                results.mtrAvailable = true;
                const mtrLines = mtrOutput
                    .split('\n')
                    .map((line) => line.trim())
                    .filter((line) => line && !line.toLowerCase().startsWith('start:') && !line.toLowerCase().startsWith('host:') && !line.toLowerCase().includes('loss%'));
                const lastHop = mtrLines[mtrLines.length - 1] || '';
                results.mtrRawSample = lastHop || null;
                const lossMatch = lastHop.match(/(\d+(?:\.\d+)?)%/);
                if (lossMatch) {
                    results.mtrLossPercent = Number(lossMatch[1]);
                    results.stageResults.mtr = results.mtrLossPercent <= 20 ? 'passed' : 'failed';
                } else {
                    results.stageResults.mtr = 'no-data';
                }
            } else {
                results.stageResults.mtr = 'unavailable';
            }
        }

        results.responseTime = Date.now() - startTime;
        results.connectivityScore = this.calculateConnectivityScore(results);
        return results;
    }

    calculateConnectivityScore(results) {
        let score = 0;
        if (results.sourcePing) score += 10;
        if (results.sourcePort443) score += 10;
        if (results.targetPing) {
            score += 20;
            if (results.port80) score += 20;
            if (results.port443) score += 25;
            if (results.port22) score += 7;
            if (results.port53) score += 8;
            if (results.tracerouteAvailable && results.tracerouteReachedTarget) score += 5;
            if (results.mtrAvailable && results.mtrLossPercent !== null) {
                if (results.mtrLossPercent <= 5) score += 5;
                else if (results.mtrLossPercent <= 20) score += 2;
            }
        }
        results.targetReachability = Math.min(
            100,
            (results.targetPing ? 30 : 0) +
            (results.port80 ? 20 : 0) +
            (results.port443 ? 30 : 0) +
            (results.port22 ? 10 : 0) +
            (results.port53 ? 10 : 0) +
            (results.tracerouteAvailable && results.tracerouteReachedTarget ? 10 : 0)
        );
        return score;
    }

    getProviderCategoryPriority(providerKey) {
        const datacenterProviders = new Set([
            'iranian_data_centers', 'turkish_data_centers', 'emirati_data_centers', 'qatari_data_centers',
            'russian_data_centers', 'chinese_data_centers', 'hetzner_falkenstein_cx22', 'ovh_gravelines_starter',
            'leaseweb_amsterdam_general', 'contabo_nuremberg_vps_s', 'scaleway_paris_dev1s',
            'gcore_frankfurt_general', 'gcore_amsterdam_general', 'gcore_istanbul_general',
            'vultr_fremont_regular', 'digitalocean_fra1_basic'
        ]);
        const cdnProviders = new Set(['cloudflare', 'akamai', 'fastly']);
        const dnsProviders = new Set(['google_dns', 'cloudflare_dns', 'opendns', 'quad9']);

        if (datacenterProviders.has(providerKey)) return 0;
        if (cdnProviders.has(providerKey)) return 1;
        if (dnsProviders.has(providerKey)) return 2;
        return 3;
    }

    async runWithConcurrency(tasks, limit) {
        const concurrency = Math.max(1, limit || this.maxConcurrent);
        const results = [];
        let index = 0;

        const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, async () => {
            while (true) {
                const current = index++;
                if (current >= tasks.length) return;
                results[current] = await tasks[current]();
            }
        });

        await Promise.all(workers);
        return results;
    }

    async testProviderConnectivity(providerKey, providerInfo) {
        const providerResults = {
            provider: providerKey,
            name: providerInfo.name,
            ranges: providerInfo.ranges,
            successfulConnections: [],
            failedConnections: [],
            bestConnection: null,
            connectivityScore: 0
        };

        this.log(`Testing connectivity to ${providerInfo.name} (${providerInfo.ranges.length} ranges)`);

        const sampleTargets = this.buildSampleTargets(providerInfo);
        const tasks = sampleTargets.map((sampleTarget) => async () => {
            if (!this.isRunning) return null;
            try {
                const connectivityResult = await this.testConnectivity(sampleTarget.ip, this.targetIp, sampleTarget.cidr || null);
                if (sampleTarget.location) {
                    connectivityResult.location = sampleTarget.location;
                }
                return connectivityResult;
            } catch (error) {
                this.log(`Error testing ${sampleTarget.ip}: ${error.message}`, 'error');
                return null;
            }
        });

        const testResults = await this.runWithConcurrency(tasks, this.maxConcurrent);
        testResults.filter(Boolean).forEach((result) => {
            const isMtrPassed = result.stageResults?.mtr === 'passed';
            const pingStats = result.targetPingStats || {};
            const pingBadge = (pingStats.transmitted !== null && pingStats.received !== null)
                ? `{ping ${pingStats.received}/${pingStats.transmitted}}`
                : '{ping N/A}';
            const latencyBadge = pingStats.averageLatencyMs !== null
                ? `{latency ${pingStats.averageLatencyMs} ms}`
                : '{latency N/A}';

            if (isMtrPassed) {
                providerResults.successfulConnections.push(result);
                if (!providerResults.bestConnection ||
                    result.connectivityScore > providerResults.bestConnection.connectivityScore) {
                    providerResults.bestConnection = result;
                }
                this.log(`✓ Connection path score ${result.ip} -> ${this.targetIp} (${result.connectivityScore}) ${pingBadge} ${latencyBadge} {mtr ✓}`, 'success');
            } else {
                providerResults.failedConnections.push(result);
                const mtrState = result.stageResults?.mtr || 'skipped';
                this.log(`✗ Connection path failed ${result.ip} -> ${this.targetIp} ${pingBadge} ${latencyBadge} {mtr ${mtrState}}`, 'error');
            }
        });

        // Calculate overall provider connectivity score
        if (providerResults.successfulConnections.length > 0) {
            const avgScore = providerResults.successfulConnections.reduce((sum, conn) => sum + conn.connectivityScore, 0) / providerResults.successfulConnections.length;
            providerResults.connectivityScore = Math.round(avgScore);
        }

        return providerResults;
    }

    buildSampleTargets(providerInfo) {
        const sampleTargets = [];
        const seenIps = new Set();

        if (Array.isArray(providerInfo.testLocations)) {
            providerInfo.testLocations.forEach((testLocation) => {
                const sampleIp = this.getSampleIpsFromCidr(testLocation.cidr, 1)[0];
                if (sampleIp && !seenIps.has(sampleIp)) {
                    sampleTargets.push({
                        ip: sampleIp,
                        location: {
                            country: testLocation.country,
                            city: testLocation.city,
                            cidr: testLocation.cidr
                        }
                    });
                    seenIps.add(sampleIp);
                }
            });
        }

        providerInfo.ranges.forEach((cidrRange) => {
            this.getSampleIpsFromCidr(cidrRange, 2).forEach((ip) => {
                if (!seenIps.has(ip)) {
                    sampleTargets.push({ ip, cidr: cidrRange });
                    seenIps.add(ip);
                }
            });
        });

        return sampleTargets;
    }

    getSampleIpsFromCidr(cidr, count) {
        const [network, prefix] = cidr.split('/');
        const networkIp = this.ipToNumber(network);
        const mask = Math.pow(2, 32 - parseInt(prefix)) - 1;
        const broadcast = (networkIp | mask) >>> 0;
        const usableHosts = Math.max(1, broadcast - networkIp - 1);
        
        const ips = [];
        const step = Math.max(1, Math.floor(usableHosts / count));
        
        for (let i = 1; i <= count && i < usableHosts; i += step) {
            const ipNum = (networkIp + i) >>> 0;
            if (ipNum < broadcast) {
                ips.push(this.numberToIp(ipNum));
            }
        }
        
        return ips;
    }

    ipToNumber(ip) {
        const parts = ip.split('.');
        return parts.reduce((acc, part, index) => {
            return acc + (parseInt(part) << (8 * (3 - index)));
        }, 0) >>> 0;
    }

    numberToIp(num) {
        return [
            (num >>> 24) & 255,
            (num >>> 16) & 255,
            (num >>> 8) & 255,
            num & 255
        ].join('.');
    }

    async runAnalysis() {
        if (!this.targetIp) {
            console.error('Usage: node iran_connectivity.js <target-ip>');
            console.error('Example: node iran_connectivity.js 185.185.123.45');
            process.exit(1);
        }

        console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                        Iran Internet Access Analysis Tool                    ║
║                For resilient internet access and observability              ║
╚══════════════════════════════════════════════════════════════════════════════╝

Goal: identify datacenters and CDNs that can reach the Iranian target (${this.targetIp})

`);

        this.isRunning = true;
        const providers = getAllProviders().filter((provider) => {
            if (this.providerKeys.length === 0) return true;
            return this.providerKeys.includes(provider.key);
        }).sort((a, b) => {
            const aPriority = this.getProviderCategoryPriority(a.key);
            const bPriority = this.getProviderCategoryPriority(b.key);
            if (aPriority !== bPriority) return aPriority - bPriority;
            return a.name.localeCompare(b.name);
        });
        
        this.log(`Starting connectivity tests across ${providers.length} providers...`);
        this.log(`Target IP: ${this.targetIp}`);
        this.log(`Timeout: ${this.timeout} seconds`);
        this.log(`Maximum concurrent tests: ${this.maxConcurrent}`);
        
        let testedProviders = 0;
        
        for (const provider of providers) {
            if (!this.isRunning) break;
            
            try {
                const providerInfo = IP_RANGES[provider.key];
                const result = await this.testProviderConnectivity(provider.key, providerInfo);
                
                this.results.detailedResults.push(result);
                this.results.summary.totalTested++;
                
                if (result.successfulConnections.length > 0) {
                    this.results.successfulProviders.push({
                        provider: provider.key,
                        name: provider.name,
                        successfulConnections: result.successfulConnections.length,
                        bestScore: result.connectivityScore
                    });
                    this.results.summary.successfulConnections++;
                    this.log(`✓ ${provider.name}: ${result.successfulConnections.length} successful paths (score: ${result.connectivityScore})`, 'success');
                } else {
                    this.results.failedProviders.push({
                        provider: provider.key,
                        name: provider.name,
                        reason: 'No successful connections'
                    });
                    this.results.summary.failedConnections++;
                    this.log(`✗ ${provider.name}: no successful paths found`, 'error');
                }
                
                testedProviders++;
                
                // Progress indicator
                const progress = Math.round((testedProviders / providers.length) * 100);
                process.stdout.write(`\rProgress: ${progress}% (${testedProviders}/${providers.length})`);
                
            } catch (error) {
                this.log(`Error while testing ${provider.name}: ${error.message}`, 'error');
                this.results.failedProviders.push({
                    provider: provider.key,
                    name: provider.name,
                    reason: error.message
                });
            }
        }
        
        console.log('\n'); // New line after progress
        
        // Calculate final statistics
        this.results.summary.successRate = this.results.summary.totalTested > 0 
            ? Math.round((this.results.summary.successfulConnections / this.results.summary.totalTested) * 100)
            : 0;
        
        await this.generateReport();
        this.printSummary();
        
        return this.results;
    }

    async generateReport() {
        try {
            fs.writeFileSync(this.outputFile, JSON.stringify(this.results, null, 2));
            this.log(`Detailed report saved to ${this.outputFile}`, 'success');
        } catch (error) {
            this.log(`Failed to save report: ${error.message}`, 'error');
        }
    }

    printSummary() {
        console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                                Results Summary                               ║
╚══════════════════════════════════════════════════════════════════════════════╝

📊 Overall stats:
   • Total providers tested: ${this.results.summary.totalTested}
   • Successful providers: ${this.results.summary.successfulConnections}
   • Failed providers: ${this.results.summary.failedConnections}
   • Success rate: ${this.results.summary.successRate}%

✅ Successful providers (${this.results.successfulProviders.length}):
`);

        this.results.successfulProviders.forEach((provider, index) => {
            console.log(`   ${index + 1}. ${provider.name} (score: ${provider.bestScore})`);
        });

        if (this.results.successfulProviders.length > 0) {
            console.log(`
🔧 Tunnel suggestions:
`);
            this.printTunnelRecommendations();
        }

        console.log(`
📁 Full report file: ${this.outputFile}
🌐 Built for resilient and open internet access
`);
    }

    printTunnelRecommendations() {
        const bestProviders = this.results.successfulProviders
            .sort((a, b) => b.bestScore - a.bestScore)
            .slice(0, 3);

        console.log('   Best options for reverse tunneling:');
        bestProviders.forEach((provider, index) => {
            console.log(`   ${index + 1}. ${provider.name}`);
        });

        console.log(`
   🔐 Suggested protocols for current conditions:
   • SSH Tunnel: suitable for stable links with strong security
   • WireGuard: fast and modern, suitable for UDP
   • OpenVPN TCP: suitable for restrictive firewalls
   • Shadowsocks: lightweight and fast proxy option
   • V2Ray/Vmess: advanced evasion capabilities under DPI
   
   📡 Suggested transport types:
   • TCP over TCP: higher stability
   • UDP over TCP: better throughput
   • WebSocket over TLS: stronger traffic blending
   • HTTP/2 over TLS: web-traffic blending
        `);
    }

    stop() {
        this.isRunning = false;
        this.log('Test stopped', 'info');
    }
}

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nStopping tests...');
    if (analyzer) {
        analyzer.stop();
    }
    process.exit(0);
});

let analyzer;

if (require.main === module) {
    const targetIp = process.argv[2];
    
    if (!targetIp) {
        console.error('Please provide the Iranian target server IP:');
        console.error('Usage: node iran_connectivity.js <target-ip>');
        console.error('Example: node iran_connectivity.js 185.185.123.45');
        process.exit(1);
    }

    // Validate IP format
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(targetIp)) {
        console.error('The provided IP is not valid');
        process.exit(1);
    }

    analyzer = new IranConnectivityAnalyzer({
        targetIp: targetIp,
        timeout: 5,
        maxConcurrent: 50,
        verbose: true
    });

    analyzer.runAnalysis().catch(error => {
        console.error('Failed to run analysis:', error);
        process.exit(1);
    });
}

IranConnectivityAnalyzer.deprecationWarningShown = false;

module.exports = IranConnectivityAnalyzer;
