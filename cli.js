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
const { spawnSync } = require('child_process');

const IranConnectivityAnalyzer = require('./iran_connectivity');
const { TunnelRecommendationEngine } = require('./tunnel_recommendations');
const { getAllProviders, IP_RANGES } = require('./ip_ranges');

// ASCII Art Banner
const BANNER = `
${chalk.cyan.bold(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║     ██  █████  ██    ██  ██████  ████████  ██████  ██    ██  ██████       ║
║     ██ ██   ██ ██    ██ ██    ██    ██    ██   ██  ██  ██  ██            ║
║     ██ ███████ ██    ██ ██    ██    ██    ██████    ████   ███████        ║
║ ██   ██ ██   ██  ██  ██  ██    ██    ██    ██   ██    ██     ██   ██      ║
║  █████  ██   ██   ████    ██████     ██    ██   ██    ██     ██   ██      ║
║                                                                              ║
║                  ${chalk.white.bold('Internet Access Analysis Tool for Iran')}                      ║
║                                                                              ║
║  ${chalk.yellow('برای حفظ آزادی اینترنت در ایران - For maintaining internet freedom')}   ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
`)}`;

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
    }

    printBanner() {
        console.log(BANNER);
    }

    printWelcome() {
        console.log(chalk.green.bold('\nبه ابزار تحلیل دسترسی اینترنت ایران خوش آمدید!'));
        console.log(chalk.white('این ابزار برای یافتن دیتاسنترهایی طراحی شده که به سرورهای ایران متصل میشوند.'));
        console.log(chalk.yellow('هدف: حفظ آزادی اینترنت و کمک به دسترسی آزاد به اطلاعات\n'));
    }

    async runAnalysis(targetIp, options) {
        try {
            this.printBanner();
            this.printWelcome();

            // Validate target IP
            if (!this.validateIp(targetIp)) {
                console.error(chalk.red('❌ آی‌پی وارد شده معتبر نیست'));
                console.log(chalk.yellow('💡 مثال: 185.185.123.45'));
                process.exit(1);
            }

            console.log(chalk.blue(`🎯 شروع تحلیل برای آی‌پی: ${chalk.bold(targetIp)}`));
            console.log(chalk.gray(`⏱️  تایماوت: ${options.timeout}s | 📊 حداکثر تست همزمان: ${options.concurrent}`));
            console.log();

            this.printWhoisInfo(targetIp);
            this.printLookingGlassReferences();

            // Initialize analyzer
            this.analyzer = new IranConnectivityAnalyzer({
                targetIp: targetIp,
                timeout: options.timeout,
                maxConcurrent: options.concurrent,
                outputFile: options.output,
                verbose: options.verbose
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
            this.progressManager.start('در حال آزمایش اتصالات...');
            const results = await this.analyzer.runAnalysis();
            
            this.progressManager.stop();

            // Generate recommendations
            if (results.successfulProviders.length > 0) {
                console.log(chalk.green('\n✅ تحلیل با موفقیت انجام شد!'));
                await this.generateRecommendations(results, options);
            } else {
                console.log(chalk.red('\n❌ متأسفانه هیچ اتصال موفقی پیدا نشد.'));
                console.log(chalk.yellow('💡 پیشنهادها:'));
                console.log('   • آی‌پی سرور ایران را بررسی کنید');
                console.log('   • تایماوت را افزایش دهید');
                console.log('   • در زمان دیگری امتحان کنید');
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
            console.error(chalk.red(`\n❌ خطا: ${error.message}`));
            if (options.verbose) {
                console.error(error.stack);
            }
            process.exit(1);
        }
    }

    async generateRecommendations(results, options) {
        console.log(chalk.blue('\n🔧 در حال تولید پیشنهادات تونل...'));
        
        const recommendations = this.recommendationEngine.analyzeConnectivityResults(results);
        
        console.log(chalk.green('\n📋 پیشنهادات تونل بر اساس نتایج تحلیل:'));
        console.log(chalk.gray('═'.repeat(80)));

        recommendations.forEach((rec, index) => {
            this.printRecommendation(rec, index + 1);
        });

        console.log(chalk.gray('═'.repeat(80)));
    }

    printRecommendation(recommendation, number) {
        const isPrimary = recommendation.type === 'primary';
        const titleColor = isPrimary ? chalk.green.bold : chalk.blue;
        const prefix = isPrimary ? '⭐' : '🔸';

        console.log(`\n${prefix} ${titleColor(`${number}. ${recommendation.protocol.name}`)}`);
        
        if (recommendation.confidence) {
            console.log(chalk.yellow(`   اطمینان: ${recommendation.confidence}%`));
        }

        console.log(chalk.white(`   ${recommendation.protocol.description}`));

        if (recommendation.reasoning && recommendation.reasoning.length > 0) {
            console.log(chalk.cyan('   دلایل:'));
            recommendation.reasoning.forEach(reason => {
                console.log(`     • ${reason}`);
            });
        }

        if (recommendation.useCase) {
            console.log(chalk.magenta(`   کاربرد: ${recommendation.useCase}`));
        }

        // Print advantages and disadvantages
        console.log(chalk.green('   مزایا:'));
        recommendation.protocol.advantages.forEach(advantage => {
            console.log(`     ✓ ${advantage}`);
        });

        console.log(chalk.red('   معایب:'));
        recommendation.protocol.disadvantages.forEach(disadvantage => {
            console.log(`     ✗ ${disadvantage}`);
        });

        // Print implementation guide for primary recommendation
        if (isPrimary && recommendation.implementation) {
            console.log(chalk.blue('\n   📖 راهنمای پیادهسازی:'));
            const impl = recommendation.implementation;
            
            if (impl.requirements && impl.requirements.length > 0) {
                console.log(chalk.yellow('   پیشنیازها:'));
                impl.requirements.forEach(req => {
                    console.log(`     • ${req}`);
                });
            }

            if (impl.steps && impl.steps.length > 0) {
                console.log(chalk.yellow('   مراحل:'));
                impl.steps.forEach((step, i) => {
                    console.log(`     ${i + 1}. ${step}`);
                });
            }
        }

        // Print next steps
        if (recommendation.nextSteps && recommendation.nextSteps.length > 0) {
            console.log(chalk.cyan('\n   گامهای بعدی:'));
            recommendation.nextSteps.forEach((step, i) => {
                console.log(`     ${i + 1}. ${step}`);
            });
        }
    }

    async printDetailedReport(results) {
        console.log(chalk.blue('\n📊 گزارش دقیق:'));
        console.log(chalk.gray('═'.repeat(80)));

        // Summary statistics
        console.log(chalk.green('\n📈 آمار کلی:'));
        console.log(`   • کل ارائهدهندگان آزمایش شده: ${results.summary.totalTested}`);
        console.log(`   • اتصالات موفق: ${results.summary.successfulConnections}`);
        console.log(`   • اتصالات ناموفق: ${results.summary.failedConnections}`);
        console.log(`   • نرخ موفقیت: ${results.summary.successRate}%`);

        // Successful providers
        if (results.successfulProviders.length > 0) {
            console.log(chalk.green('\n✅ ارائهدهندگان موفق:'));
            results.successfulProviders.forEach((provider, index) => {
                console.log(`   ${index + 1}. ${provider.name} (امتیاز: ${provider.bestScore})`);
            });
        }

        // Failed providers
        if (results.failedProviders.length > 0) {
            console.log(chalk.red('\n❌ ارائهدهندگان ناموفق:'));
            results.failedProviders.forEach((provider, index) => {
                console.log(`   ${index + 1}. ${provider.name}`);
            });
        }

        // Detailed results
        if (results.detailedResults && results.detailedResults.length > 0) {
            console.log(chalk.blue('\n🔍 نتایج دقیق:'));
            results.detailedResults.forEach(provider => {
                if (provider.successfulConnections.length > 0) {
                    console.log(chalk.green(`\n   ${provider.name}:`));
                    console.log(`     • اتصالات موفق: ${provider.successfulConnections.length}`);
                    console.log(`     • بهترین امتیاز: ${provider.connectivityScore}`);
                    
                    if (provider.bestConnection) {
                        const conn = provider.bestConnection;
                        console.log(`     • بهترین آی‌پی: ${conn.ip}`);
                        console.log(`     • پینگ: ${conn.ping ? '✓' : '✗'}`);
                        console.log(`     • پورت 80: ${conn.port80 ? '✓' : '✗'}`);
                        console.log(`     • پورت 443: ${conn.port443 ? '✓' : '✗'}`);
                    }
                }
            });
        }

        console.log(chalk.gray('═'.repeat(80)));
    }

    async exportResults(results, format) {
        console.log(chalk.blue(`\n📤 در حال خروجی با فرمت ${format}...`));
        
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
                console.error(chalk.red(`❌ فرمت ${format} پشتیبانی نمیشود`));
                return;
        }

        try {
            fs.writeFileSync(filename, content);
            console.log(chalk.green(`✅ نتایج در فایل ${filename} ذخیره شد`));
        } catch (error) {
            console.error(chalk.red(`❌ خطا در ذخیره فایل: ${error.message}`));
        }
    }

    convertToCsv(results) {
        let csv = 'Provider,Type,Success Rate,Best Score,Best IP,Port 80,Port 443,Port 22,Port 53\n';
        
        results.detailedResults.forEach(provider => {
            const successRate = provider.ranges.length > 0 
                ? Math.round((provider.successfulConnections.length / provider.ranges.length) * 100)
                : 0;
            
            const bestConn = provider.bestConnection || {};
            
            csv += `${provider.name},${provider.provider},${successRate},${provider.connectivityScore},${bestConn.ip || 'N/A'},${bestConn.port80 || false},${bestConn.port443 || false},${bestConn.port22 || false},${bestConn.port53 || false}\n`;
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

    printWhoisInfo(targetIp) {
        console.log(chalk.blue('🔎 اطلاعات WHOIS آی‌پی هدف:'));
        const whoisResult = spawnSync('whois', [targetIp], {
            encoding: 'utf8',
            timeout: 8000
        });

        if (whoisResult.error || whoisResult.status !== 0 || !whoisResult.stdout) {
            console.log(chalk.yellow('   ⚠️ امکان دریافت WHOIS از سیستم وجود ندارد (whois نصب نیست یا پاسخ نداد).'));
            console.log();
            return;
        }

        const summary = this.extractWhoisSummary(whoisResult.stdout);
        if (summary.length === 0) {
            console.log(chalk.yellow('   ⚠️ خروجی WHOIS دریافت شد اما خلاصه قابل‌نمایش پیدا نشد.'));
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

        console.log(chalk.blue('🌐 Looking Glassهای پیشنهادی برای بررسی مسیر/latency:'));
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
        console.log(chalk.blue('🧰 ابزارهای کمکی پیشنهادی:'));
        const tools = [
            { name: 'BGP HE', url: `https://bgp.he.net/ip/${safeIp}`, reason: 'مشاهده ASN، Prefix و مسیرهای BGP' },
            { name: 'RIPEstat', url: `https://stat.ripe.net/${safeIp}`, reason: 'تحلیل routing, ASN, visibility' },
            { name: 'IPInfo', url: `https://ipinfo.io/${safeIp}`, reason: 'خلاصه سریع provider/location/ASN' },
            { name: 'PeeringDB', url: 'https://www.peeringdb.com/', reason: 'بررسی اتصال و حضور اپراتورها/IXها' },
            { name: 'Cloudflare Radar', url: 'https://radar.cloudflare.com/', reason: 'وضعیت اختلال/شبکه در سطح منطقه‌ای' }
        ];

        tools.forEach(tool => {
            console.log(`   • ${tool.name}: ${tool.url}`);
            console.log(`     - ${tool.reason}`);
        });
        console.log();
    }

    printProviders() {
        console.log(chalk.blue('\n📋 لیست ارائهدهندگان:'));
        console.log(chalk.gray('═'.repeat(80)));
        
        const providers = getAllProviders();
        providers.forEach((provider, index) => {
            const providerInfo = IP_RANGES[provider.key] || {};
            const locationLabel = providerInfo.city ? ` | شهر: ${providerInfo.city}` : '';
            const packageLabel = providerInfo.package ? ` | پکیج: ${providerInfo.package}` : '';
            console.log(`${chalk.yellow((index + 1).toString().padStart(2))}. ${chalk.green.bold(provider.name.padEnd(30))} ${chalk.gray(`(${provider.rangeCount} ranges${locationLabel}${packageLabel})`)}`);
        });
        
        console.log(chalk.gray('═'.repeat(80)));
        console.log(chalk.cyan(`مجموع: ${providers.length} ارائهدهنده`));
    }
}

// Commander.js setup
program
    .name('iran-check')
    .description('Iran Internet Access Analysis Tool - برای حفظ آزادی اینترنت')
    .version('1.0.0');

program
    .command('analyze <targetIp>')
    .description('تحلیل اتصال به سرور ایران')
    .option('-t, --timeout <seconds>', 'تایماوت برای هر تست', '5')
    .option('-c, --concurrent <number>', 'حداکثر تستهای همزمان', '50')
    .option('-o, --output <file>', 'فایل خروجی JSON', 'connectivity_report.json')
    .option('-e, --export <format>', 'خروجی با فرمت خاص (json, csv, txt)')
    .option('-d, --detailed', 'نمایش گزارش دقیق')
    .option('-v, --verbose', 'نمایش لاگهای کامل')
    .action(async (targetIp, options) => {
        const cli = new IranCheckCLI();
        await cli.runAnalysis(targetIp, {
            timeout: parseInt(options.timeout),
            concurrent: parseInt(options.concurrent),
            output: options.output,
            export: options.export,
            detailed: options.detailed,
            verbose: options.verbose
        });
    });

program
    .command('providers')
    .description('نمایش لیست ارائهدهندگان')
    .action(() => {
        const cli = new IranCheckCLI();
        cli.printProviders();
    });

program
    .command('precheck <targetIp>')
    .description('نمایش WHOIS + Looking Glass + ابزارهای کمکی قبل از تحلیل اصلی')
    .action((targetIp) => {
        const cli = new IranCheckCLI();
        if (!cli.validateIp(targetIp)) {
            console.error(chalk.red('❌ آی‌پی وارد شده معتبر نیست'));
            process.exit(1);
        }

        cli.printBanner();
        console.log(chalk.cyan(`\nپیش‌بررسی برای: ${targetIp}\n`));
        cli.printWhoisInfo(targetIp);
        cli.printLookingGlassReferences();
        cli.printHelpfulTools(targetIp);
    });

program
    .command('recommend <reportFile>')
    .description('تولید پیشنهادات بر اساس گزارش قبلی')
    .option('-f, --format <format>', 'فرمت خروجی (text, json)', 'text')
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
            console.error(chalk.red(`❌ خطا در خواندن گزارش: ${error.message}`));
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
        console.error(chalk.red('❌ خطا در اجرای دستور'));
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
