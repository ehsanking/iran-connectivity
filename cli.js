#!/usr/bin/env node
/**
 * Iran Internet Access Analysis Tool - Main CLI Interface
 * Comprehensive tool for analyzing data center connectivity to Iranian servers
 * For maintaining internet freedom in restricted environments
 */
const { program } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');
const path = require('path');
const http = require('http');
const net = require('net');
const dgram = require('dgram');
const { spawnSync } = require('child_process');
const IranConnectivityAnalyzer = require('./iran_connectivity');
const { TunnelRecommendationEngine } = require('./tunnel_recommendations');
const { getAllProviders, IP_RANGES } = require('./ip_ranges');
const { ConfigManager } = require('./config_manager');
const { runPipeline } = require('./src/core/pipeline');
const { startAgentServer } = require('./src/core/agent');
const { runDistributed } = require('./src/core/controller');
const THEME = {
    primary: chalk.hex('#7C3AED'),
    secondary: chalk.hex('#06B6D4'),
    success: chalk.hex('#10B981'),
    muted: chalk.gray
};

function renderPanel(title, lines = []) {
    const width = 64;
    const top = THEME.primary(`╭${'─'.repeat(width - 2)}╮`);
    const bottom = THEME.primary(`╰${'─'.repeat(width - 2)}╯`);
    const paddedTitle = ` ${title}`.padEnd(width - 1, ' ');
    const body = lines.map((line) => `│ ${line}`.padEnd(width - 1, ' ') + '│');
    return [top, THEME.primary(`│${paddedTitle}│`), ...body.map((line) => THEME.secondary(line)), bottom].join('\n');
}
// ASCII Art Banner
const BANNER = `
${THEME.primary('╭──────────────────────────────────────────────────────────╮')}
${THEME.primary('│')}${chalk.white.bold('                      IRAN CHECK                          ')}${THEME.primary('│')}
${THEME.primary('│')}${THEME.muted('       Modern connectivity intelligence for operators      ')}${THEME.primary('│')}
${THEME.primary('╰──────────────────────────────────────────────────────────╯')}
`;
const PROVIDER_PRESETS = {
    famous: [
        'cloudflare',
        'aws',
        'google_cloud',
        'azure',
        'gcore_frankfurt_general',
        'gcore_amsterdam_general',
        'gcore_istanbul_general',
        'hetzner_falkenstein_cx22',
        'ovh_gravelines_starter',
        'leaseweb_amsterdam_general',
        'contabo_nuremberg_vps_s',
        'scaleway_paris_dev1s',
        'digitalocean_fra1_basic',
        'vultr_fremont_regular'
    ]
};
// Progress bar and spinner utilities
class ProgressManager {
    constructor() {
        this.spinner = null;
        this.progress = 0;
        this.total = 0;
    }
    start(message) {
        this.spinner = ora({
            text: chalk.blue(message),
            spinner: 'dots12'
        }).start();
    }
    update(message) {
        if (this.spinner) {
            this.spinner.text = chalk.blue(message);
        }
    }
    succeed(message) {
        if (this.spinner) {
            this.spinner.succeed(chalk.green(message));
        }
    }
    fail(message) {
        if (this.spinner) {
            this.spinner.fail(chalk.red(message));
        }
    }
    stop() {
        if (this.spinner) {
            this.spinner.stop();
        }
    }
    setProgress(current, total) {
        this.progress = current;
        this.total = total;
        const percentage = Math.round((current / total) * 100);
        
        if (this.spinner) {
            this.spinner.text = chalk.blue(`Progress: ${percentage}% (${current}/${total})`);
        }
    }
}
// CLI Interface Class
class IranCheckCLI {
    constructor() {
        this.progressManager = new ProgressManager();
        this.analyzer = null;
        this.recommendationEngine = new TunnelRecommendationEngine();
        this.ipApiCache = new Map();
    }
    printBanner(enabled = true) {
        if (enabled) {
            console.log(BANNER);
        }
    }
    printWelcome() {
        console.log(chalk.green.bold('\n🌐 Welcome to the Iran Internet Connectivity Analyzer!'));
        console.log(chalk.white('This tool identifies data centers that can reach Iranian networks.'));
        console.log(chalk.yellow('🎯 Goal: improve observability for resilient and open internet access.\n'));
    }
    async runAnalysis(targetIp, options) {
        try {
            this.printBanner(options.banner !== false);
            this.printWelcome();
            // Validate target IP
            if (!this.validateIp(targetIp)) {
                console.error(chalk.red('❌ Invalid IP address'));
                console.log(chalk.yellow('💡 Example: 185.185.123.45'));
                process.exit(1);
            }
            console.log(chalk.blue(`🎯 Starting analysis for target IP: ${chalk.bold(targetIp)}`));
            console.log(chalk.gray(`⏱️ Timeout: ${options.timeout}s | 📊 Max concurrent tests: ${options.concurrent}`));
            console.log();
            this.printWhoisInfo(targetIp);
            await this.printIpApiSummary('Target IP', targetIp);
            this.printLookingGlassReferences();
            const selectedProviders = this.resolveSelectedProviders(options.providers, options.preset);
            if (selectedProviders.length > 0) {
                console.log(chalk.cyan(`🎯 Selected providers for testing: ${selectedProviders.length}`));
                selectedProviders.forEach((providerKey) => {
                    const provider = IP_RANGES[providerKey];
                    if (provider) {
                        console.log(`   • ${provider.name}`);
                    }
                });
                console.log();
            }
            // Initialize analyzer
            this.analyzer = new IranConnectivityAnalyzer({
                targetIp: targetIp,
                timeout: options.timeout,
                maxConcurrent: options.concurrent,
                outputFile: options.output,
                verbose: options.verbose,
                providerKeys: selectedProviders
            });
            // Override analyzer's log method to use progress manager
            this.analyzer.log = (message, level = 'info') => {
                if (level === 'success') {
                    this.progressManager.succeed(message);
                } else if (level === 'error') {
                    this.progressManager.fail(message);
                } else {
                    this.progressManager.update(message);
                }
            };
            // Run analysis
            this.progressManager.start('🔬 Running connectivity checks...');
            const results = await this.analyzer.runAnalysis();
            await this.attachIpApiMetadata(results);
            
            this.progressManager.stop();
            // Generate recommendations
            if (results.successfulProviders.length > 0) {
                console.log(chalk.green('\n✅ Analysis completed successfully!'));
                await this.generateRecommendations(results, options);
            } else {
                console.log(chalk.red('\n❌ No successful connectivity paths were found.'));
                console.log(chalk.yellow('💡 Suggestions:'));
                console.log('   • Verify the Iranian target IP');
                console.log('   • Increase timeout');
                console.log('   • Retry at another time window');
            }
            // Print detailed report
            if (options.detailed) {
                await this.printDetailedReport(results);
            }
            // Export results
            if (options.export) {
                await this.exportResults(results, options.export);
            }
        } catch (error) {
            this.progressManager.stop();
            console.error(chalk.red(`\n❌ Error: ${error.message}`));
            if (options.verbose) {
                console.error(error.stack);
            }
            process.exit(1);
        }
    }
    fetchIpApiInfo(ip) {
        if (!this.validateIp(ip)) {
            return Promise.resolve(null);
        }
        if (this.ipApiCache.has(ip)) {
            return Promise.resolve(this.ipApiCache.get(ip));
        }
        const url = `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,message,query,country,city,regionName,timezone,isp,org,as,lat,lon,mobile,proxy,hosting`;
        return new Promise((resolve) => {
            const req = http.get(url, { timeout: 5000 }, (res) => {
                if (res.statusCode !== 200) {
                    this.ipApiCache.set(ip, null);
                    res.resume();
                    resolve(null);
                    return;
                }
                let raw = '';
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    raw += chunk;
                });
                res.on('end', () => {
                    try {
                        const payload = JSON.parse(raw);
                        if (payload.status !== 'success') {
                            this.ipApiCache.set(ip, null);
                            resolve(null);
                            return;
                        }
                        this.ipApiCache.set(ip, payload);
                        resolve(payload);
                    } catch (_error) {
                        this.ipApiCache.set(ip, null);
                        resolve(null);
                    }
                });
            });
            req.on('timeout', () => {
                req.destroy();
                this.ipApiCache.set(ip, null);
                resolve(null);
            });
            req.on('error', () => {
                this.ipApiCache.set(ip, null);
                resolve(null);
            });
        });
    }
    async printIpApiSummary(label, ip) {
        const info = await this.fetchIpApiInfo(ip);
        if (!info) {
            console.log(chalk.yellow(`🌍 ${label} GeoIP (ip-api): unavailable`));
            console.log();
            return;
        }
        console.log(chalk.blue(`🌍 ${label} GeoIP (ip-api):`));
        console.log(`   • Query: ${info.query}`);
        console.log(`   • Location: ${info.city || 'Unknown'}, ${info.country || 'Unknown'}`);
        console.log(`   • ISP: ${info.isp || 'Unknown'}`);
        console.log(`   • AS: ${info.as || 'Unknown'}`);
        console.log();
    }
    async attachIpApiMetadata(results) {
        if (!results || !Array.isArray(results.detailedResults)) return;
        results.targetIpInfo = await this.fetchIpApiInfo(results.targetIp);
        for (const provider of results.detailedResults) {
            if (!provider || !provider.bestConnection || !provider.bestConnection.ip) continue;
            const info = await this.fetchIpApiInfo(provider.bestConnection.ip);
            if (!info) continue;
            provider.bestConnection.ipApi = info;
            if (!provider.bestConnection.location) {
                provider.bestConnection.location = {
                    city: info.city || null,
                    country: info.country || null
                };
            }
        }
    }
    async generateRecommendations(results, options) {
        console.log(chalk.blue('\n🔧 Generating tunnel recommendations...'));
        
        const recommendations = this.recommendationEngine.analyzeConnectivityResults(results);
        
        console.log(chalk.green('\n📋 Tunnel recommendations based on analysis results:'));
        console.log(chalk.gray('═'.repeat(80)));
        recommendations.forEach((rec, index) => {
            this.printRecommendation(rec, index + 1);
        });
        console.log(chalk.gray('═'.repeat(80)));
    }
    printRecommendation(recommendation, number) {
        const sanitize = (value, fallback) => {
            if (typeof value !== 'string') return fallback;
            return /[\u0600-\u06FF]/.test(value) ? fallback : value;
        };
        const sanitizeList = (values, fallbackPrefix) => {
            if (!Array.isArray(values) || values.length === 0) return [];
            return values.map((value, index) => sanitize(value, `${fallbackPrefix} ${index + 1}`));
        };

        const isPrimary = recommendation.type === 'primary';
        const titleColor = isPrimary ? chalk.green.bold : chalk.blue;
        const prefix = isPrimary ? '⭐' : '🔸';
        const protocolName = sanitize(recommendation.protocol?.name, `Protocol option ${number}`);
        console.log(`\n${prefix} ${titleColor(`${number}. ${protocolName}`)}`);
        
        if (recommendation.confidence) {
            console.log(chalk.yellow(`   Confidence: ${recommendation.confidence}%`));
        }
        console.log(chalk.white(`   ${sanitize(recommendation.protocol?.description, 'Recommended tunnel protocol based on measured network behavior.')}`));
        if (recommendation.reasoning && recommendation.reasoning.length > 0) {
            console.log(chalk.cyan('   Why:'));
            sanitizeList(recommendation.reasoning, 'Reason').forEach(reason => {
                console.log(`     • ${reason}`);
            });
        }
        if (recommendation.useCase) {
            console.log(chalk.magenta(`   Use case: ${sanitize(recommendation.useCase, 'Use when you need stable and resilient connectivity.')}`));
        }
        // Print advantages and disadvantages
        console.log(chalk.green('   ✅ Advantages:'));
        sanitizeList(recommendation.protocol?.advantages, 'Advantage').forEach(advantage => {
            console.log(`     ✓ ${advantage}`);
        });
        console.log(chalk.red('   ⚠️ Trade-offs:'));
        sanitizeList(recommendation.protocol?.disadvantages, 'Trade-off').forEach(disadvantage => {
            console.log(`     ✗ ${disadvantage}`);
        });
        // Print implementation guide for primary recommendation
        if (isPrimary && recommendation.implementation) {
            console.log(chalk.blue('\n   📖 Implementation guide:'));
            const impl = recommendation.implementation;
            
            if (impl.requirements && impl.requirements.length > 0) {
                console.log(chalk.yellow('   Prerequisites:'));
                sanitizeList(impl.requirements, 'Prerequisite').forEach(req => {
                    console.log(`     • ${req}`);
                });
            }
            if (impl.steps && impl.steps.length > 0) {
                console.log(chalk.yellow('   Steps:'));
                sanitizeList(impl.steps, 'Step').forEach((step, i) => {
                    console.log(`     ${i + 1}. ${step}`);
                });
            }
        }
        // Print next steps
        if (recommendation.nextSteps && recommendation.nextSteps.length > 0) {
            console.log(chalk.cyan('\n   Next steps:'));
            sanitizeList(recommendation.nextSteps, 'Next step').forEach((step, i) => {
                console.log(`     ${i + 1}. ${step}`);
            });
        }
    }
    async printDetailedReport(results) {
        const mtrBadge = (connection) => {
            if (!connection) return '✗';
            if (!connection.mtrAvailable) return '✗';
            if (typeof connection.mtrLossPercent !== 'number') return '✗';
            return connection.mtrLossPercent <= 20 ? '✓' : '✗';
        };

        console.log(chalk.blue('\n📊 Detailed report:'));
        console.log(chalk.gray('═'.repeat(80)));
        // Summary statistics
        console.log(chalk.green('\n📈 Summary stats:'));
        console.log(`   • Total providers tested: ${results.summary.totalTested}`);
        console.log(`   • Successful paths: ${results.summary.successfulConnections}`);
        console.log(`   • Failed connections: ${results.summary.failedConnections}`);
        console.log(`   • Success rate: ${results.summary.successRate}%`);
        // Successful providers
        if (results.successfulProviders.length > 0) {
            console.log(chalk.green('\n✅ Successful providers:'));
            results.successfulProviders.forEach((provider, index) => {
                const badge = mtrBadge(provider.bestConnection);
                const loss = typeof provider.bestConnection?.mtrLossPercent === 'number' ? `${provider.bestConnection.mtrLossPercent}%` : 'N/A';
                console.log(`   ${index + 1}. ${provider.name} (MTR: ${badge}, loss: ${loss})`);
            });
        }
        // Failed providers
        if (results.failedProviders.length > 0) {
            console.log(chalk.red('\n❌ Failed providers:'));
            results.failedProviders.forEach((provider, index) => {
                console.log(`   ${index + 1}. ${provider.name}`);
            });
        }
        // Detailed results
        if (results.detailedResults && results.detailedResults.length > 0) {
            console.log(chalk.blue('\n🔍 Per-provider details:'));
            results.detailedResults.forEach(provider => {
                if (provider.successfulConnections.length > 0) {
                    console.log(chalk.green(`\n   ${provider.name}:`));
                    console.log(`     • Successful paths: ${provider.successfulConnections.length}`);
                    const badge = mtrBadge(provider.bestConnection);
                    const loss = typeof provider.bestConnection?.mtrLossPercent === 'number' ? `${provider.bestConnection.mtrLossPercent}%` : 'N/A';
                    console.log(`     • MTR test result: ${badge} (loss: ${loss})`);
                    const groupedByRange = provider.successfulConnections.reduce((acc, conn) => {
                        const range = conn.testedCidr || 'Unknown range';
                        if (!acc[range]) acc[range] = 0;
                        acc[range] += 1;
                        return acc;
                    }, {});
                    console.log('     • Results by tested range:');
                    Object.entries(groupedByRange).forEach(([range, count]) => {
                        console.log(`       - ${range}: ${count} successful path(s)`);
                    });
                    
                    if (provider.bestConnection) {
                        const conn = provider.bestConnection;
                        console.log(`     • Best IP: ${conn.ip}`);
                        if (conn.testedCidr) {
                            console.log(`     • Tested range: ${conn.testedCidr}`);
                        }
                        if (conn.location && (conn.location.city || conn.location.country)) {
                            const city = conn.location.city || 'Unknown';
                            const country = conn.location.country || 'Unknown';
                            console.log(`     • IP location: ${city}, ${country}`);
                        }
                        if (conn.ipApi) {
                            console.log(`     • IP-API ISP/ORG: ${conn.ipApi.isp || 'Unknown'} / ${conn.ipApi.org || 'Unknown'}`);
                            console.log(`     • IP-API AS/Timezone: ${conn.ipApi.as || 'Unknown'} / ${conn.ipApi.timezone || 'Unknown'}`);
                            console.log(`     • IP-API Flags: hosting=${Boolean(conn.ipApi.hosting)} proxy=${Boolean(conn.ipApi.proxy)} mobile=${Boolean(conn.ipApi.mobile)}`);
                        }
                        console.log(`     • Source ping: ${conn.sourcePing ? '✓' : '✗'}`);
                        console.log(`     • Target ping (${results.targetIp}): ${conn.targetPing ? '✓' : '✗'}`);
                        if (conn.stageResults) {
                            console.log(`     • Stage 1 (Ping): ${conn.stageResults.ping}`);
                            console.log(`     • Stage 2 (Traceroute): ${conn.stageResults.traceroute}`);
                            console.log(`     • Stage 3 (BGP): ${conn.stageResults.bgp}`);
                        }
                        console.log(`     • Target port 80: ${conn.port80 ? '✓' : '✗'}`);
                        console.log(`     • Target port 443: ${conn.port443 ? '✓' : '✗'}`);
                        if (conn.tracerouteAvailable) {
                            console.log(`     • Traceroute to target: ${conn.tracerouteReachedTarget ? '✓' : '✗'} (hop: ${conn.tracerouteHops ?? 'N/A'})`);
                        }
                        if (conn.bgpCheckAvailable) {
                            console.log(`     • BGP origin ASN: ${conn.bgpOriginAsn ?? 'N/A'}`);
                            console.log(`     • BGP prefix: ${conn.bgpPrefix ?? 'N/A'}`);
                            console.log(`     • BGP registry: ${conn.bgpRegistry ?? 'N/A'}`);
                        }
                        console.log(`     • Stage 4 (MTR): ${conn.stageResults?.mtr || 'skipped'}`);
                        console.log(`     • Target reachability: ${conn.targetReachability || 0}%`);
                    }
                }
            });
        }
        console.log(chalk.gray('═'.repeat(80)));
    }
    async exportResults(results, format) {
        console.log(chalk.blue(`\n📤 Exporting output as ${format}...`));
        
        let filename;
        let content;
        switch (format.toLowerCase()) {
            case 'json':
                filename = `iran_analysis_${Date.now()}.json`;
                content = JSON.stringify(results, null, 2);
                break;
            case 'csv':
                filename = `iran_analysis_${Date.now()}.csv`;
                content = this.convertToCsv(results);
                break;
            case 'txt':
                filename = `iran_analysis_${Date.now()}.txt`;
                content = this.convertToText(results);
                break;
            default:
                console.error(chalk.red(`❌ Format ${format} is not supported`));
                return;
        }
        try {
            fs.writeFileSync(filename, content);
            console.log(chalk.green(`✅ Results saved to ${filename} `));
        } catch (error) {
            console.error(chalk.red(`❌ Failed to save file: ${error.message}`));
        }
    }
    convertToCsv(results) {
        let csv = 'Provider,Type,Success Rate,Best Score,Best IP,Tested Range,Best IP Location,IP-API ISP,IP-API AS,Ping Stage,Traceroute Stage,BGP Stage,Port 80,Port 443,Port 22,Port 53,Traceroute Reached Target,BGP ASN,BGP Prefix,BGP Registry\n';
        
        results.detailedResults.forEach(provider => {
            const successRate = provider.ranges.length > 0 
                ? Math.round((provider.successfulConnections.length / provider.ranges.length) * 100)
                : 0;
            
            const bestConn = provider.bestConnection || {};
            const bestLocation = bestConn.location
                ? `${bestConn.location.city || 'Unknown City'}, ${bestConn.location.country || 'Unknown Country'}`
                : 'N/A';
            
            csv += `${provider.name},${provider.provider},${successRate},${provider.connectivityScore},${bestConn.ip || 'N/A'},${bestConn.testedCidr || 'N/A'},${bestLocation},${bestConn.ipApi?.isp || 'N/A'},${bestConn.ipApi?.as || 'N/A'},${bestConn.stageResults?.ping || 'N/A'},${bestConn.stageResults?.traceroute || 'N/A'},${bestConn.stageResults?.bgp || 'N/A'},${bestConn.port80 || false},${bestConn.port443 || false},${bestConn.port22 || false},${bestConn.port53 || false},${bestConn.tracerouteReachedTarget ?? 'N/A'},${bestConn.bgpOriginAsn ?? 'N/A'},${bestConn.bgpPrefix ?? 'N/A'},${bestConn.bgpRegistry ?? 'N/A'}\n`;
        });
        
        return csv;
    }
    convertToText(results) {
        let text = `Iran Internet Access Analysis Report\n`;
        text += `Generated: ${new Date().toISOString()}\n`;
        text += `Target IP: ${results.targetIp}\n\n`;
        
        text += `SUMMARY\n`;
        text += `Total Providers Tested: ${results.summary.totalTested}\n`;
        text += `Successful Connections: ${results.summary.successfulConnections}\n`;
        text += `Failed Connections: ${results.summary.failedConnections}\n`;
        text += `Success Rate: ${results.summary.successRate}%\n\n`;
        
        text += `SUCCESSFUL PROVIDERS\n`;
        results.successfulProviders.forEach((provider, index) => {
            text += `${index + 1}. ${provider.name} (Score: ${provider.bestScore})\n`;
        });
        
        return text;
    }
    validateIp(ip) {
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipRegex.test(ip);
    }
    resolveSelectedProviders(providerList, preset) {
        const fromProviders = (providerList || '')
            .split(',')
            .map(item => item.trim().toLowerCase())
            .filter(Boolean);
        const fromPreset = preset && PROVIDER_PRESETS[preset] ? PROVIDER_PRESETS[preset] : [];
        const merged = [...new Set([...fromProviders, ...fromPreset])];
        return merged.filter((providerKey) => Boolean(IP_RANGES[providerKey]));
    }
    printWhoisInfo(targetIp) {
        console.log(chalk.blue('🔎 Target IP WHOIS snapshot:'));
        const whoisResult = spawnSync('whois', [targetIp], {
            encoding: 'utf8',
            timeout: 8000
        });
        if (whoisResult.error || whoisResult.status !== 0 || !whoisResult.stdout) {
            console.log(chalk.yellow('   ⚠️ WHOIS lookup unavailable (whois is missing or no response).'));
            console.log();
            return;
        }
        const summary = this.extractWhoisSummary(whoisResult.stdout);
        if (summary.length === 0) {
            console.log(chalk.yellow('   ⚠️ WHOIS was returned but no concise summary fields were found.'));
            console.log();
            return;
        }
        summary.forEach(line => console.log(`   • ${line}`));
        console.log();
    }
    extractWhoisSummary(rawWhois) {
        const wantedKeys = [
            'netname', 'orgname', 'org-name', 'descr', 'country', 'route', 'originas', 'origin', 'aut-num'
        ];
        const lines = rawWhois
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('%') && !line.startsWith('#'));
        const summary = [];
        const seenKeys = new Set();
        for (const line of lines) {
            const separator = line.indexOf(':');
            if (separator === -1) continue;
            const key = line.slice(0, separator).trim().toLowerCase();
            const value = line.slice(separator + 1).trim();
            if (!value || !wantedKeys.includes(key) || seenKeys.has(key)) continue;
            seenKeys.add(key);
            summary.push(`${key.toUpperCase()}: ${value}`);
            if (summary.length >= 7) break;
        }
        return summary;
    }
    printLookingGlassReferences() {
        const providersWithLg = Object.values(IP_RANGES)
            .filter(provider => Array.isArray(provider.lookingGlass) && provider.lookingGlass.length > 0);
        if (providersWithLg.length === 0) {
            return;
        }
        console.log(chalk.blue('🌐 Suggested Looking Glass endpoints for path/latency checks:'));
        providersWithLg.forEach(provider => {
            console.log(`   • ${provider.name}`);
            provider.lookingGlass.forEach(url => {
                console.log(`     - ${url}`);
            });
        });
        console.log();
    }
    printHelpfulTools(targetIp = '') {
        const safeIp = this.validateIp(targetIp) ? targetIp : '1.1.1.1';
        console.log(chalk.blue('🧰 Recommended external observability tools:'));
        const tools = [
            { name: 'BGP HE', url: `https://bgp.he.net/ip/${safeIp}`, reason: 'Inspect ASN, prefix, and BGP paths' },
            { name: 'RIPEstat', url: `https://stat.ripe.net/${safeIp}`, reason: 'Analyze routing, ASN, and visibility' },
            { name: 'Cloudflare Radar', url: 'https://radar.cloudflare.com/', reason: 'Regional outage and network status' },
            { name: 'RIPE Atlas', url: 'https://atlas.ripe.net/', reason: 'Run multi-vantage latency/reachability measurements' },
            { name: 'OONI Explorer', url: 'https://explorer.ooni.org/', reason: 'Check censorship/network interference measurements' },
            { name: 'Nmap / Nping', url: 'https://nmap.org/book/nping-man.html', reason: 'Higher-fidelity TCP/UDP latency and packet-loss probing' },
            { name: 'Paris Traceroute', url: 'https://github.com/libparistraceroute/libparistraceroute', reason: 'Reduce traceroute bias under load balancing' },
            { name: 'PeeringDB', url: 'https://www.peeringdb.com/', reason: 'Check operator peering and IX presence' }
        ];
        tools.forEach(tool => {
            console.log(`   • ${tool.name}: ${tool.url}`);
            console.log(`     - ${tool.reason}`);
        });
        console.log();
    }
    printProviders() {
        console.log(chalk.blue('\n📋 Provider list:'));
        console.log(chalk.gray('═'.repeat(80)));
        
        const providers = getAllProviders();
        providers.forEach((provider, index) => {
            const providerInfo = IP_RANGES[provider.key] || {};
            const locationLabel = providerInfo.city ? `  | City: ${providerInfo.city}` : '';
            const countryLabel = providerInfo.country ? `  | Country: ${providerInfo.country}` : '';
            const packageLabel = providerInfo.package ? `  | Package: ${providerInfo.package}` : '';
            console.log(`${chalk.yellow((index + 1).toString().padStart(2))}. ${chalk.green.bold(provider.name.padEnd(30))} ${chalk.gray(`(${provider.rangeCount} ranges${countryLabel}${locationLabel}${packageLabel})`)}`);
        });
        
        console.log(chalk.gray('═'.repeat(80)));
        console.log(chalk.cyan(`🧾 Total providers: ${providers.length}`));
    }
}

function startProbeListener(options = {}) {
    const host = options.host || '0.0.0.0';
    const port = Number(options.port || 9000);
    const protocol = String(options.protocol || 'both').toLowerCase();
    const tcpEnabled = protocol === 'tcp' || protocol === 'both';
    const udpEnabled = protocol === 'udp' || protocol === 'both';

    if (!tcpEnabled && !udpEnabled) {
        throw new Error('Protocol must be tcp, udp, or both');
    }

    if (tcpEnabled) {
        const tcpServer = net.createServer((socket) => {
            socket.setEncoding('utf8');
            socket.on('data', (data) => {
                const payload = String(data || '').trim();
                socket.write(`OK TCP port=${port} payload="${payload || 'empty'}"\n`);
            });
            socket.on('error', () => {});
        });
        tcpServer.listen(port, host, () => {
            console.log(chalk.green(`✅ TCP listener active on ${host}:${port}`));
        });
    }

    if (udpEnabled) {
        const udpServer = dgram.createSocket('udp4');
        udpServer.on('message', (msg, rinfo) => {
            const payload = String(msg || '').trim();
            const response = Buffer.from(`OK UDP port=${port} payload="${payload || 'empty'}"`);
            udpServer.send(response, rinfo.port, rinfo.address);
        });
        udpServer.bind(port, host, () => {
            console.log(chalk.green(`✅ UDP listener active on ${host}:${port}`));
        });
    }

    console.log(chalk.cyan(`ℹ️ Listener running (protocol=${protocol}). Press Ctrl+C to stop.`));
}
// Commander.js setup
program
    .name('iran-check')
    .description('Iran Internet Access Analysis Tool - for resilient internet access')
    .version('1.0.0');
program
    .command('analyze <targetIp>')
    .description('Analyze connectivity to an Iranian target')
    .option('-t, --timeout <seconds>', 'Timeout per check', '5')
    .option('-c, --concurrent <number>', 'Maximum concurrent checks', '80')
    .option('-o, --output <file>', 'JSON output file', 'connectivity_report.json')
    .option('-e, --export <format>', 'Export format (json, csv, txt)')
    .option('-d, --detailed', 'Show detailed report')
    .option('-v, --verbose', 'Show verbose logs')
    .option('--providers <list>', 'Comma-separated provider keys (e.g. cloudflare,aws)')
    .option('--preset <name>', 'Provider preset (famous)')
    .option('--no-banner', 'Hide banner')
    .action(async (targetIp, options) => {
        const cli = new IranCheckCLI();
        await cli.runAnalysis(targetIp, {
            timeout: parseInt(options.timeout),
            concurrent: parseInt(options.concurrent),
            output: options.output,
            export: options.export,
            detailed: options.detailed,
            verbose: options.verbose,
            providers: options.providers,
            preset: options.preset,
            banner: options.banner
        });
    });
program
    .command('listener')
    .description('Start local TCP/UDP echo listener for Iranian-side port/protocol testing')
    .option('--host <host>', 'Bind host', '0.0.0.0')
    .option('--port <port>', 'Bind port', '9000')
    .option('--protocol <protocol>', 'tcp | udp | both', 'both')
    .action((options) => {
        startProbeListener(options);
    });

program
    .command('providers')
    .description('Show provider list')
    .action(() => {
        const cli = new IranCheckCLI();
        cli.printProviders();
    });
program
    .command('precheck <targetIp>')
    .description('Run WHOIS + Looking Glass + external tool hints before analysis')
    .action((targetIp) => {
        const cli = new IranCheckCLI();
        if (!cli.validateIp(targetIp)) {
            console.error(chalk.red('❌ Invalid IP address'));
            process.exit(1);
        }
        cli.printBanner();
        console.log(chalk.cyan(`\n🧪 Precheck for: ${targetIp}\n`));
        cli.printWhoisInfo(targetIp);
        cli.printLookingGlassReferences();
        cli.printHelpfulTools(targetIp);
    });
program
    .command('toolkit')
    .description('Show external tools that improve test accuracy')
    .action(() => {
        const cli = new IranCheckCLI();
        cli.printBanner();
        cli.printHelpfulTools();
    });
program
    .command('recommend <reportFile>')
    .description('Generate recommendations from a saved report')
    .option('-f, --format <format>', 'Output format (text, json)', 'text')
    .action(async (reportFile, options) => {
        try {
            const fs = require('fs');
            const results = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
            const engine = new TunnelRecommendationEngine();
            
            const cli = new IranCheckCLI();
            const recommendations = engine.analyzeConnectivityResults(results);
            
            if (options.format === 'json') {
                console.log(JSON.stringify(recommendations, null, 2));
            } else {
                recommendations.forEach((rec, index) => {
                    cli.printRecommendation(rec, index + 1);
                });
            }
        } catch (error) {
            console.error(chalk.red(`❌ Failed to read report: ${error.message}`));
            process.exit(1);
        }
    });

program
    .command('verify <target>')
    .description('Run pipeline verification L1..L7 for a target')
    .option('-t, --timeout <seconds>', 'Timeout per check', '5')
    .option('-o, --output <file>', 'Output file path')
    .action(async (target, options) => {
        try {
            const configManager = new ConfigManager();
            const timeoutSeconds = Number(options.timeout || configManager.get('network.timeout') || 5);
            console.log(renderPanel('🔎 VERIFY PIPELINE', [
                `Target: ${chalk.white(target)}`,
                `Timeout: ${chalk.white(`${timeoutSeconds}s`)}`,
                'Stages: L1 → L7'
            ]));
            const report = await runPipeline(target, { timeoutSeconds });
            const successfulPorts = [...new Set(
                report.pipeline.levels
                    .filter((item) => item.ok && Number.isInteger(item.port))
                    .map((item) => item.port)
            )].sort((a, b) => a - b);
            console.log(renderPanel('🧪 STAGE RESULTS', report.pipeline.levels.map((item) => {
                const status = item.ok ? chalk.green('PASS') : chalk.red('FAIL');
                const portLabel = item.ok && Number.isInteger(item.port)
                    ? ` ${THEME.success(`(port ${item.port} ✅)`)}` : '';
                return `${chalk.white(item.level)} ${THEME.muted(item.name)}: ${status}${portLabel}`;
            })));
            const body = JSON.stringify(report, null, 2);
            if (options.output) {
                fs.writeFileSync(options.output, body);
                console.log(THEME.success(`\n✅ Verify report saved to ${options.output}`));
            } else {
                console.log(body);
            }
            console.log(renderPanel('✅ VERIFY SUMMARY', [
                `Passed levels: ${chalk.white(report.pipeline.summary.passedLevels)}/${chalk.white(report.pipeline.summary.totalLevels)}`,
                `Pass rate: ${chalk.white(`${report.pipeline.summary.passRate}%`)}`,
                `Successful ports: ${chalk.white(successfulPorts.length > 0 ? successfulPorts.join(', ') : '-')}`,
                `Generated: ${THEME.muted(report.generatedAt)}`
            ]));
        } catch (error) {
            console.error(chalk.red(`❌ Verify failed: ${error.message}`));
            process.exit(1);
        }
    });

program
    .command('agent')
    .description('Agent operations')
    .command('serve')
    .description('Start verify listener agent')
    .option('--host <host>', 'Bind host', '127.0.0.1')
    .option('--port <port>', 'Bind port', '9090')
    .action(async (options) => {
        const agent = await startAgentServer({ host: options.host, port: Number(options.port) });
        console.log(renderPanel('🤖 AGENT ONLINE', [
            `Endpoint: ${chalk.white(`http://${agent.host}:${agent.port}`)}`,
            'Health check: GET /health',
            'Verification: POST /verify'
        ]));
    });

program
    .command('controller')
    .description('Controller operations')
    .command('run')
    .description('Run distributed checks from an inventory file')
    .requiredOption('--inventory <file>', 'Inventory JSON file')
    .option('-t, --timeout <seconds>', 'Timeout per check', '5')
    .option('-o, --output <file>', 'Output file path', 'controller_report.json')
    .action(async (options) => {
        try {
            console.log(renderPanel('🧭 CONTROLLER RUN', [
                `Inventory: ${chalk.white(options.inventory)}`,
                `Timeout: ${chalk.white(`${options.timeout}s`)}`,
                `Output: ${chalk.white(options.output)}`
            ]));
            const report = await runDistributed(options.inventory, { timeoutSeconds: Number(options.timeout) });
            fs.writeFileSync(options.output, JSON.stringify(report, null, 2));
            console.log(THEME.success(`\n✅ Controller report saved to ${options.output}`));
            console.log(renderPanel('📦 CONTROLLER SUMMARY', [
                `Targets processed: ${chalk.white(report.count)}`,
                `Generated at: ${THEME.muted(report.generatedAt)}`
            ]));
        } catch (error) {
            console.error(chalk.red(`❌ Controller run failed: ${error.message}`));
            process.exit(1);
        }
    });

program
    .command('config <subcommand> [key] [value]')
    .description('Manage runtime configuration via config_manager')
    .action((subcommand, key, value) => {
        const config = new ConfigManager();
        try {
            console.log(renderPanel('⚙️ CONFIG', [
                `Command: ${chalk.white(subcommand)}`,
                key ? `Key: ${chalk.white(key)}` : 'Key: -'
            ]));
            if (subcommand === 'show') {
                console.log(config.toString());
                return;
            }
            if (subcommand === 'get') {
                console.log(JSON.stringify(config.get(key), null, 2));
                return;
            }
            if (subcommand === 'set') {
                const parsed = value ? JSON.parse(value) : value;
                config.set(key, parsed);
                config.saveConfig();
                console.log(chalk.green('✅ Config updated'));
                return;
            }
            if (subcommand === 'validate') {
                const result = config.validateConfig();
                console.log(JSON.stringify(result, null, 2));
                return;
            }
            console.error(chalk.red('❌ Unknown config subcommand'));
            process.exit(1);
        } catch (error) {
            if (subcommand === 'set' && value) {
                config.set(key, value);
                config.saveConfig();
                console.log(chalk.green('✅ Config updated'));
                return;
            }
            console.error(chalk.red(`❌ Config command failed: ${error.message}`));
            process.exit(1);
        }
    });

// Error handling
try {
    program.parse(process.argv);
} catch (err) {
    if (err.code === 'commander.help') {
        process.exit(0);
    } else if (err.code === 'commander.version') {
        process.exit(0);
    } else {
        console.error(chalk.red('❌ Command execution failed'));
        if (process.argv.includes('--verbose')) {
            console.error(err);
        }
        process.exit(1);
    }
}
// If no command specified, show help
if (!process.argv.slice(2).length) {
    const cli = new IranCheckCLI();
    cli.printBanner();
    cli.printWelcome();
    program.outputHelp();
}
