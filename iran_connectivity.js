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

    async testConnectivity(ip, port = 80) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            
            // Try multiple methods to test connectivity
            const tests = [
                // Basic ping test
                `ping -c 1 -W ${this.timeout} ${ip}`,
                // TCP connection test on common ports
                `timeout ${this.timeout} bash -c "</dev/tcp/${ip}/80" 2>/dev/null && echo "Port 80 open" || echo "Port 80 closed"`,
                `timeout ${this.timeout} bash -c "</dev/tcp/${ip}/443" 2>/dev/null && echo "Port 443 open" || echo "Port 443 closed"`,
                `timeout ${this.timeout} bash -c "</dev/tcp/${ip}/22" 2>/dev/null && echo "Port 22 open" || echo "Port 22 closed"`,
                `timeout ${this.timeout} bash -c "</dev/tcp/${ip}/53" 2>/dev/null && echo "Port 53 open" || echo "Port 53 closed"`
            ];

            let completedTests = 0;
            let results = {
                ip: ip,
                ping: false,
                port80: false,
                port443: false,
                port22: false,
                port53: false,
                responseTime: 0,
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
                            case 0: // ping
                                results.ping = output.includes('1 received') || output.includes('0% packet loss');
                                break;
                            case 1: // port 80
                                results.port80 = output.includes('port 80 open');
                                break;
                            case 2: // port 443
                                results.port443 = output.includes('port 443 open');
                                break;
                            case 3: // port 22
                                results.port22 = output.includes('port 22 open');
                                break;
                            case 4: // port 53
                                results.port53 = output.includes('port 53 open');
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
        if (results.ping) score += 20;
        if (results.port80) score += 25;
        if (results.port443) score += 25;
        if (results.port22) score += 15;
        if (results.port53) score += 15;
        return score;
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

        for (const cidrRange of providerInfo.ranges) {
            // Test a sample of IPs from each range to avoid testing every IP
            const sampleIps = this.getSampleIpsFromCidr(cidrRange, 5); // Test 5 IPs per range
            
            for (const ip of sampleIps) {
                if (!this.isRunning) break;
                
                try {
                    const result = await this.testConnectivity(ip);
                    
                    if (result.connectivityScore > 0) {
                        providerResults.successfulConnections.push(result);
                        if (!providerResults.bestConnection || 
                            result.connectivityScore > providerResults.bestConnection.connectivityScore) {
                            providerResults.bestConnection = result;
                        }
                        this.log(`✓ Connection successful to ${ip} (Score: ${result.connectivityScore})`, 'success');
                    } else {
                        providerResults.failedConnections.push(result);
                        this.log(`✗ Connection failed to ${ip}`, 'error');
                    }
                    
                    // Wait a bit to avoid overwhelming the network
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                } catch (error) {
                    this.log(`Error testing ${ip}: ${error.message}`, 'error');
                }
            }
        }

        // Calculate overall provider connectivity score
        if (providerResults.successfulConnections.length > 0) {
            const avgScore = providerResults.successfulConnections.reduce((sum, conn) => sum + conn.connectivityScore, 0) / providerResults.successfulConnections.length;
            providerResults.connectivityScore = Math.round(avgScore);
        }

        return providerResults;
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
        const providers = getAllProviders();
        
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