/**
 * Iran Internet Access Analysis Tool
 * Configuration management system
 * For maintaining internet freedom in restricted environments
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_CONFIG = {
    // Network settings
    network: {
        timeout: 5,                    // seconds for each test
        maxConcurrent: 50,         // maximum concurrent tests
        retryAttempts: 3,            // retry failed connections
        retryDelay: 1000,           // ms between retries
        pingTimeout: 3,             // seconds for ping timeout
        tcpTimeout: 5,              // seconds for TCP connection timeout
        dnsTimeout: 3,              // seconds for DNS resolution timeout
        packetSize: 56,           // bytes for ping packet size
        maxPacketLoss: 50,        // percentage threshold for packet loss
    },

    // Test configuration
    testing: {
        sampleSize: 5,              // number of IPs to test per CIDR range
        testAllPorts: true,       // test all common ports
        testPing: true,           // include ping tests
        testTcp: true,            // include TCP connection tests
        testDns: true,            // include DNS resolution tests
        testTraceroute: false,    // include traceroute (slower)
        saveRawData: false,       // save raw test data
        enableLogging: true,      // enable detailed logging
        logLevel: 'info',         // debug, info, warn, error
    },

    // Provider settings
    providers: {
        // Enable/disable specific provider categories
        enableCloudProviders: true,      // AWS, Google Cloud, Azure
        enableCDNProviders: true,       // Cloudflare, Akamai, Fastly
        enableDNSProviders: true,       // Google DNS, Cloudflare DNS, etc.
        enableRegionalProviders: true,  // Iranian, Turkish, UAE, etc.
        enableCustomProviders: true,      // User-defined providers
        
        // Priority order for testing
        priorityOrder: [
            'iranian_data_centers',
            'turkish_data_centers', 
            'emirati_data_centers',
            'qatari_data_centers',
            'russian_data_centers',
            'chinese_data_centers',
            'hetzner_falkenstein_cx22',
            'ovh_gravelines_starter',
            'scaleway_paris_dev1s',
            'vultr_fremont_regular',
            'digitalocean_fra1_basic',
            'cloudflare',
            'aws',
            'google_cloud',
            'azure',
            'akamai',
            'fastly'
        ]
    },

    // Custom IP ranges
    customIps: {
        enabled: false,
        ranges: [],
        description: 'Custom IP ranges for testing'
    },

    // Output settings
    output: {
        format: 'json',           // json, csv, txt, html
        filename: 'iran_analysis',
        includeTimestamp: true,
        includeSummary: true,
        includeDetails: true,
        includeRecommendations: true,
        compressOutput: false,     // gzip compression
        maxFileSize: 100,        // MB
    },

    // Security settings
    security: {
        enableEncryption: false,    // encrypt sensitive data
        encryptionKey: '',         // encryption key (auto-generated if empty)
        hashAlgorithm: 'sha256', // hashing algorithm for data integrity
        enableIntegrityCheck: true, // verify data integrity
    },

    // Performance settings
    performance: {
        memoryLimit: 512,         // MB memory limit
        cpuLimit: 80,             // percentage CPU limit
        maxTestDuration: 3600,    // seconds (1 hour)
        enableRateLimiting: true, // prevent overwhelming targets
        rateLimit: {
            maxRequests: 100,      // requests per minute per IP
            windowMs: 60000,      // 1 minute window
            delayMs: 1000         // delay between requests
        }
    },

    // Alert settings
    alerts: {
        enabled: false,
        email: {
            enabled: false,
            smtp: {
                host: '',
                port: 587,
                secure: true,
                user: '',
                password: ''
            },
            recipients: [],
            subject: 'Iran Connectivity Analysis Report',
            onComplete: true,
            onFailure: true
        },
        webhook: {
            enabled: false,
            url: '',
            method: 'POST',
            headers: {},
            onComplete: true,
            onFailure: true
        }
    },

    // Advanced settings
    advanced: {
        enableIPv6: false,          // test IPv6 addresses
        enableProxy: false,       // use proxy for testing
        proxy: {
            host: '',
            port: 8080,
            protocol: 'http',       // http, https, socks5
            auth: {
                username: '',
                password: ''
            }
        },
        userAgent: 'IranCheck/1.0', // user agent for HTTP requests
        enableDebugging: false,     // enable debug mode
        debugPort: 9229,          // Node.js debug port
        enableProfiling: false    // enable performance profiling
    }
};

class ConfigManager {
    constructor(configPath = null) {
        this.configPath = configPath || this.getDefaultConfigPath();
        this.config = this.loadConfig();
        this.isDirty = false;
    }

    getDefaultConfigPath() {
        // Try to find config in multiple locations
        const possiblePaths = [
            path.join(process.cwd(), 'irancheck.config.json'),
            path.join(process.cwd(), 'config.json'),
            path.join(require('os').homedir(), '.irancheck', 'config.json'),
            '/etc/irancheck/config.json'
        ];

        for (const configPath of possiblePaths) {
            if (fs.existsSync(configPath)) {
                return configPath;
            }
        }

        // Return default path in current directory
        return path.join(process.cwd(), 'irancheck.config.json');
    }

    loadConfig() {
        try {
            if (fs.existsSync(this.configPath)) {
                const fileConfig = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
                // Merge with default config to ensure all properties exist
                return this.deepMerge(DEFAULT_CONFIG, fileConfig);
            }
        } catch (error) {
            console.warn(`Warning: Could not load config from ${this.configPath}: ${error.message}`);
        }

        // Return default config if file doesn't exist or is invalid
        return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    }

    saveConfig() {
        if (!this.isDirty) {
            return;
        }

        try {
            // Ensure directory exists
            const dir = path.dirname(this.configPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Backup existing config
            if (fs.existsSync(this.configPath)) {
                const backupPath = `${this.configPath}.backup.${Date.now()}`;
                fs.copyFileSync(this.configPath, backupPath);
            }

            // Save new config
            fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
            this.isDirty = false;

            console.log(`Configuration saved to: ${this.configPath}`);
        } catch (error) {
            throw new Error(`Failed to save configuration: ${error.message}`);
        }
    }

    get(path) {
        return this.getNestedValue(this.config, path);
    }

    set(path, value) {
        this.setNestedValue(this.config, path, value);
        this.isDirty = true;
    }

    getNestedValue(obj, path) {
        const keys = this.parsePath(path);
        if (keys.length === 0) {
            return undefined;
        }

        return keys.reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    }

    setNestedValue(obj, path, value) {
        const keys = this.parsePath(path);
        if (keys.length === 0) {
            throw new Error('Invalid configuration path');
        }

        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => {
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {};
            }
            return current[key];
        }, obj);
        target[lastKey] = value;
    }

    deepMerge(target, source) {
        const result = JSON.parse(JSON.stringify(target));
        
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key) && !this.isUnsafeKey(key)) {
                if (this.isPlainObject(source[key])) {
                    result[key] = this.deepMerge(result[key] || {}, source[key]);
                } else {
                    result[key] = source[key];
                }
            }
        }
        
        return result;
    }

    parsePath(pathValue) {
        if (typeof pathValue !== 'string') {
            throw new Error('Configuration path must be a string');
        }

        const keys = pathValue.split('.').map(k => k.trim()).filter(Boolean);
        if (keys.some(key => this.isUnsafeKey(key))) {
            throw new Error('Unsafe configuration path');
        }

        return keys;
    }

    isUnsafeKey(key) {
        return key === '__proto__' || key === 'constructor' || key === 'prototype';
    }

    isPlainObject(value) {
        return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
    }

    validateConfig() {
        const errors = [];
        const warnings = [];

        // Validate network settings
        if (this.config.network.timeout < 1 || this.config.network.timeout > 30) {
            errors.push('Network timeout must be between 1 and 30 seconds');
        }

        if (this.config.network.maxConcurrent < 1 || this.config.network.maxConcurrent > 1000) {
            errors.push('Max concurrent tests must be between 1 and 1000');
        }

        // Validate testing settings
        if (this.config.testing.sampleSize < 1 || this.config.testing.sampleSize > 100) {
            errors.push('Sample size must be between 1 and 100');
        }

        // Validate output settings
        const validFormats = ['json', 'csv', 'txt', 'html'];
        if (!validFormats.includes(this.config.output.format)) {
            errors.push(`Output format must be one of: ${validFormats.join(', ')}`);
        }

        // Validate security settings
        if (this.config.security.enableEncryption && !this.config.security.encryptionKey) {
            warnings.push('Encryption enabled but no encryption key provided (will be auto-generated)');
        }

        // Validate alert settings
        if (this.config.alerts.enabled) {
            if (this.config.alerts.email.enabled && !this.config.alerts.email.smtp.host) {
                warnings.push('Email alerts enabled but no SMTP server configured');
            }
            if (this.config.alerts.webhook.enabled && !this.config.alerts.webhook.url) {
                warnings.push('Webhook alerts enabled but no webhook URL configured');
            }
        }

        // Validate proxy settings
        if (this.config.advanced.enableProxy && !this.config.advanced.proxy.host) {
            errors.push('Proxy enabled but no proxy host configured');
        }

        return { errors, warnings };
    }

    resetToDefaults() {
        this.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
        this.isDirty = true;
    }

    getAllProviders() {
        return this.config.providers.priorityOrder;
    }

    enableProvider(providerKey) {
        if (!this.config.providers.priorityOrder.includes(providerKey)) {
            this.config.providers.priorityOrder.push(providerKey);
            this.isDirty = true;
        }
    }

    disableProvider(providerKey) {
        const index = this.config.providers.priorityOrder.indexOf(providerKey);
        if (index > -1) {
            this.config.providers.priorityOrder.splice(index, 1);
            this.isDirty = true;
        }
    }

    addCustomIpRange(range, description = '') {
        if (!this.config.customIps.ranges.find(r => r.range === range)) {
            this.config.customIps.ranges.push({
                range: range,
                description: description,
                enabled: true
            });
            this.config.customIps.enabled = true;
            this.isDirty = true;
        }
    }

    removeCustomIpRange(range) {
        const index = this.config.customIps.ranges.findIndex(r => r.range === range);
        if (index > -1) {
            this.config.customIps.ranges.splice(index, 1);
            this.isDirty = true;
        }
    }

    getCustomIpRanges() {
        return this.config.customIps.enabled ? this.config.customIps.ranges : [];
    }

    generateEncryptionKey() {
        const crypto = require('crypto');
        return crypto.randomBytes(32).toString('hex');
    }

    createSampleConfig() {
        const sampleConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
        
        // Add some sample custom IP ranges
        sampleConfig.customIps.enabled = true;
        sampleConfig.customIps.ranges = [
            {
                range: '192.168.1.0/24',
                description: 'Sample local network',
                enabled: true
            },
            {
                range: '10.0.0.0/8',
                description: 'Sample private network',
                enabled: false
            }
        ];

        // Enable some advanced features for demo
        sampleConfig.advanced.enableDebugging = true;
        sampleConfig.testing.logLevel = 'debug';
        
        return sampleConfig;
    }

    toString() {
        return JSON.stringify(this.config, null, 2);
    }
}

// CLI interface for configuration management
class ConfigCLI {
    constructor() {
        this.configManager = new ConfigManager();
    }

    async runCommand(command, args = {}) {
        try {
            switch (command) {
                case 'show':
                    return this.showConfig();
                case 'get':
                    return this.getValue(args.path);
                case 'set':
                    return this.setValue(args.path, args.value);
                case 'validate':
                    return this.validateConfig();
                case 'reset':
                    return this.resetConfig();
                case 'create-sample':
                    return this.createSampleConfig();
                case 'add-ip':
                    return this.addCustomIp(args.range, args.description);
                case 'remove-ip':
                    return this.removeCustomIp(args.range);
                case 'list-ips':
                    return this.listCustomIps();
                default:
                    throw new Error(`Unknown command: ${command}`);
            }
        } catch (error) {
            throw new Error(`Configuration error: ${error.message}`);
        }
    }

    showConfig() {
        return this.configManager.toString();
    }

    getValue(path) {
        const value = this.configManager.get(path);
        return value !== undefined ? JSON.stringify(value, null, 2) : 'undefined';
    }

    setValue(path, value) {
        // Try to parse as JSON first, otherwise treat as string
        let parsedValue;
        try {
            parsedValue = JSON.parse(value);
        } catch {
            parsedValue = value;
        }
        
        this.configManager.set(path, parsedValue);
        this.configManager.saveConfig();
        return `Value set successfully: ${path} = ${JSON.stringify(parsedValue)}`;
    }

    validateConfig() {
        const { errors, warnings } = this.configManager.validateConfig();
        
        let result = '';
        
        if (errors.length > 0) {
            result += '❌ Errors:\n';
            errors.forEach(error => {
                result += `  - ${error}\n`;
            });
        }
        
        if (warnings.length > 0) {
            result += '⚠️  Warnings:\n';
            warnings.forEach(warning => {
                result += `  - ${warning}\n`;
            });
        }
        
        if (errors.length === 0 && warnings.length === 0) {
            result = '✅ Configuration is valid!';
        }
        
        return result;
    }

    resetConfig() {
        this.configManager.resetToDefaults();
        this.configManager.saveConfig();
        return 'Configuration reset to defaults successfully';
    }

    createSampleConfig() {
        const sampleConfig = this.configManager.createSampleConfig();
        const samplePath = 'irancheck.config.sample.json';
        
        fs.writeFileSync(samplePath, JSON.stringify(sampleConfig, null, 2));
        return `Sample configuration created at: ${samplePath}`;
    }

    addCustomIp(range, description = '') {
        this.configManager.addCustomIpRange(range, description);
        this.configManager.saveConfig();
        return `Custom IP range added: ${range}`;
    }

    removeCustomIp(range) {
        this.configManager.removeCustomIpRange(range);
        this.configManager.saveConfig();
        return `Custom IP range removed: ${range}`;
    }

    listCustomIps() {
        const ranges = this.configManager.getCustomIpRanges();
        if (ranges.length === 0) {
            return 'No custom IP ranges configured';
        }
        
        let result = 'Custom IP ranges:\n';
        ranges.forEach(range => {
            result += `  ${range.range} - ${range.description} ${range.enabled ? '(enabled)' : '(disabled)'}\n`;
        });
        
        return result;
    }
}

module.exports = {
    ConfigManager,
    ConfigCLI,
    DEFAULT_CONFIG
};
