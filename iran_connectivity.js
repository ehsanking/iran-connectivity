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

    async testConnectivity(sourceCandidateIp, targetIp) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            
            const finalTarget = targetIp || this.targetIp;
            // Run both source-reachability checks and target reachability checks
            const tests = [
                `ping -c 1 -W ${this.timeout} ${sourceCandidateIp}`,
                `timeout ${this.timeout} bash -c "</dev/tcp/${sourceCandidateIp}/443" 2>/dev/null && echo "SOURCE_443_OPEN" || echo "SOURCE_443_CLOSED"`,
                `ping -c 1 -W ${this.timeout} ${finalTarget}`,
                `timeout ${this.timeout} bash -c "</dev/tcp/${finalTarget}/80" 2>/dev/null && echo "TARGET_80_OPEN" || echo "TARGET_80_CLOSED"`,
                `timeout ${this.timeout} bash -c "</dev/tcp/${finalTarget}/443" 2>/dev/null && echo "TARGET_443_OPEN" || echo "TARGET_443_CLOSED"`,
                `timeout ${this.timeout} bash -c "</dev/tcp/${finalTarget}/22" 2>/dev/null && echo "TARGET_22_OPEN" || echo "TARGET_22_CLOSED"`,
                `timeout ${this.timeout} bash -c "</dev/tcp/${finalTarget}/53" 2>/dev/null && echo "TARGET_53_OPEN" || echo "TARGET_53_CLOSED"`
            ];

            let completedTests = 0;
            let results = {
                ip: sourceCandidateIp,
                targetIp: finalTarget,
                sourcePing: false,
                sourcePort443: false,
                targetPing: false,
                port80: false,
                port443: false,
                port22: false,
                port53: false,
                responseTime: 0,
                targetReachability: 0,
                connectivityScore: 0
            };

            const checkCompletion = () => {
                completedTests++;
                if (completedTests >= tests.length) {
                    results.responseTime = Date.now() - startTime;
                    // Calculate connectivity score
                    results.connectivityScore = this.calculateConnectivityScore(results);
                    resolve(results);
                }
            };

            // Execute all tests
            tests.forEach((command, index) => {
                execAsync(command)
                    .then(({ stdout, stderr }) => {
                        const output = stdout.toString().toLowerCase();
                        switch (index) {
                            case 0:
                                results.sourcePing = output.includes('1 received') || output.includes('0% packet loss');
                                break;
                            case 1:
                                results.sourcePort443 = output.includes('source_443_open');
                                break;
                            case 2:
                                results.targetPing = output.includes('1 received') || output.includes('0% packet loss');
                                break;
                            case 3:
                                results.port80 = output.includes('target_80_open');
                                break;
                            case 4:
                                results.port443 = output.includes('target_443_open');
                                break;
                            case 5:
                                results.port22 = output.includes('target_22_open');
                                break;
                            case 6:
                                results.port53 = output.includes('target_53_open');
                                break;
                        }
                        checkCompletion();
                    })
                    .catch(() => {
                        // Test failed
                        checkCompletion();
                    });
            });
        });
    }

    calculateConnectivityScore(results) {
        let score = 0;
        if (results.sourcePing) score += 10;
        if (results.sourcePort443) score += 10;
        if (results.targetPing) score += 20;
        if (results.port80) score += 20;
        if (results.port443) score += 25;
        if (results.port22) score += 7;
        if (results.port53) score += 8;
        results.targetReachability = Math.min(
            100,
            (results.targetPing ? 30 : 0) +
            (results.port80 ? 20 : 0) +
            (results.port443 ? 30 : 0) +
            (results.port22 ? 10 : 0) +
            (results.port53 ? 10 : 0)
        );
        return score;
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
                const connectivityResult = await this.testConnectivity(sampleTarget.ip, this.targetIp);
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
            if (result.connectivityScore > 0) {
                providerResults.successfulConnections.push(result);
                if (!providerResults.bestConnection ||
                    result.connectivityScore > providerResults.bestConnection.connectivityScore) {
                    providerResults.bestConnection = result;
                }
                this.log(`✓ Connection path score ${result.ip} -> ${this.targetIp} (${result.connectivityScore})`, 'success');
            } else {
                providerResults.failedConnections.push(result);
                this.log(`✗ Connection path failed ${result.ip} -> ${this.targetIp}`, 'error');
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
                    sampleTargets.push({ ip });
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
║                              برای حفظ آزادی اینترنت                        ║
╚══════════════════════════════════════════════════════════════════════════════╝

هدف: یافتن دیتاسنترها و CDNهایی که به سرور ایران (${this.targetIp}) متصل میشوند

`);

        this.isRunning = true;
        const providers = getAllProviders().filter((provider) => {
            if (this.providerKeys.length === 0) return true;
            return this.providerKeys.includes(provider.key);
        });
        
        this.log(`شروع آزمایش اتصال به ${providers.length} ارائهدهنده مختلف...`);
        this.log(`آی‌پی هدف: ${this.targetIp}`);
        this.log(`تایماوت: ${this.timeout} ثانیه`);
        this.log(`حداکثر تست همزمان: ${this.maxConcurrent}`);
        
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
                    this.log(`✓ ${provider.name}: ${result.successfulConnections.length} اتصال موفق (امتیاز: ${result.connectivityScore})`, 'success');
                } else {
                    this.results.failedProviders.push({
                        provider: provider.key,
                        name: provider.name,
                        reason: 'No successful connections'
                    });
                    this.results.summary.failedConnections++;
                    this.log(`✗ ${provider.name}: هیچ اتصال موفقیتی پیدا نشد`, 'error');
                }
                
                testedProviders++;
                
                // Progress indicator
                const progress = Math.round((testedProviders / providers.length) * 100);
                process.stdout.write(`\rپیشرفت: ${progress}% (${testedProviders}/${providers.length})`);
                
            } catch (error) {
                this.log(`خطا در آزمایش ${provider.name}: ${error.message}`, 'error');
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
            this.log(`گزارش کامل در فایل ${this.outputFile} ذخیره شد`, 'success');
        } catch (error) {
            this.log(`خطا در ذخیره گزارش: ${error.message}`, 'error');
        }
    }

    printSummary() {
        console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                                خلاصه نتایج                                   ║
╚══════════════════════════════════════════════════════════════════════════════╝

📊 آمار کلی:
   • کل ارائهدهندگان آزمایش شده: ${this.results.summary.totalTested}
   • اتصالات موفق: ${this.results.summary.successfulConnections}
   • اتصالات ناموفق: ${this.results.summary.failedConnections}
   • نرخ موفقیت: ${this.results.summary.successRate}%

✅ ارائهدهندگان موفق (${this.results.successfulProviders.length}):
`);

        this.results.successfulProviders.forEach((provider, index) => {
            console.log(`   ${index + 1}. ${provider.name} (امتیاز: ${provider.bestScore})`);
        });

        if (this.results.successfulProviders.length > 0) {
            console.log(`
🔧 پیشنهادات تونل:
`);
            this.printTunnelRecommendations();
        }

        console.log(`
📁 گزارش کامل در فایل: ${this.outputFile}
🌐 برای حفظ آزادی اینترنت - برای بشریت
`);
    }

    printTunnelRecommendations() {
        const bestProviders = this.results.successfulProviders
            .sort((a, b) => b.bestScore - a.bestScore)
            .slice(0, 3);

        console.log('   بهترین گزینهها برای تونل ریورس:');
        bestProviders.forEach((provider, index) => {
            console.log(`   ${index + 1}. ${provider.name}`);
        });

        console.log(`
   🔐 پروتکلهای پیشنهادی بر اساس وضعیت فعلی:
   • SSH Tunnel: مناسب برای اتصالات پایدار با امنیت بالا
   • WireGuard: سریع و مدرن، مناسب برای UDP
   • OpenVPN TCP: برای عبور از فایروالهای سختگیرانه
   • Shadowsocks: سبک و سریع برای پروکسی
   • V2Ray/Vmess: با قابلیتهای پیشرفته برای دور زدن DPI
   
   📡 نوع ترنزیشن پیشنهادی:
   • TCP over TCP: برای اتصالات پایدار
   • UDP over TCP: برای سرعت بالاتر
   • WebSocket over TLS: برای مخفیسازی کامل
   • HTTP/2 over TLS: برای ادغام با ترافیک وب
        `);
    }

    stop() {
        this.isRunning = false;
        this.log('تست متوقف شد', 'info');
    }
}

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nدر حال توقف تست...');
    if (analyzer) {
        analyzer.stop();
    }
    process.exit(0);
});

let analyzer;

if (require.main === module) {
    const targetIp = process.argv[2];
    
    if (!targetIp) {
        console.error('لطفاً آی‌پی سرور ایران را وارد کنید:');
        console.error('استفاده: node iran_connectivity.js <target-ip>');
        console.error('مثال: node iran_connectivity.js 185.185.123.45');
        process.exit(1);
    }

    // Validate IP format
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(targetIp)) {
        console.error('آی‌پی وارد شده معتبر نیست');
        process.exit(1);
    }

    analyzer = new IranConnectivityAnalyzer({
        targetIp: targetIp,
        timeout: 5,
        maxConcurrent: 50,
        verbose: true
    });

    analyzer.runAnalysis().catch(error => {
        console.error('خطا در اجرای تحلیل:', error);
        process.exit(1);
    });
}

module.exports = IranConnectivityAnalyzer;
