/**
 * Iran Internet Access Analysis Tool
 * Advanced tunneling protocol recommendation engine
 * For maintaining internet freedom in restricted environments
 */

const TUNNEL_PROTOCOLS = {
    ssh: {
        name: 'SSH Tunnel',
        description: 'Secure Shell tunnel with port forwarding',
        advantages: [
            'راهاندازی ساده و سریع',
            'امنیت بالا با رمزنگاری قوی',
            'پایدار و قابل اطمینان',
            'پشتیبانی گسترده در سرورها'
        ],
        disadvantages: [
            'ممکن است توسط DPI شناسایی شود',
            'سرعت محدود در شبکههای شلوغ',
            'نیاز به کانفیگ دقیق برای دور زدن فایروال'
        ],
        bestFor: ['اتصالات پایدار', 'امنیت بالا', 'سرورهای معمولی'],
        difficulty: 'متوسط',
        detectionRisk: 'متوسط',
        speed: 'متوسط',
        stability: 'بالا'
    },
    
    wireguard: {
        name: 'WireGuard VPN',
        description: 'پروتکل VPN مدرن و سریع',
        advantages: [
            'سرعت بسیار بالا',
            'کد باز و شفاف',
            'مصرف منابع پایین',
            'امنیت مدرن با رمزنگاری پیشرفته'
        ],
        disadvantages: [
            'نیاز به کرنل لینوکس 3.1+ یا پشتیبانی کاربر',
            'ممکن است توسط DPI شناسایی شود',
            'پیکربندی پیچیدهتر از SSH'
        ],
        bestFor: ['سرعت بالا', 'امنیت مدرن', 'کاربران پیشرفته'],
        difficulty: 'پیشرفته',
        detectionRisk: 'متوسط',
        speed: 'بسیار بالا',
        stability: 'بالا'
    },
    
    openvpn_tcp: {
        name: 'OpenVPN TCP',
        description: 'VPN سنتی با قابلیتهای گسترده',
        advantages: [
            'سازگاری عالی با فایروالها',
            'قابلیت اطمینان بالا در شبکههای ناپایدار',
            'پیکربندی بسیار انعطافپذیر',
            'پشتیبانی از پروتکلهای مختلف'
        ],
        disadvantages: [
            'سرعت پایینتر نسبت به UDP',
            'مصرف منابع بالاتر',
            'پیکربندی پیچیده'
        ],
        bestFor: ['شبکههای ناپایدار', 'فایروالهای سختگیر', 'اتصالات TCP'],
        difficulty: 'پیشرفته',
        detectionRisk: 'پایین',
        speed: 'پایین',
        stability: 'بسیار بالا'
    },
    
    shadowsocks: {
        name: 'Shadowsocks',
        description: 'پروکسی سبک و سریع برای دور زدن سانسور',
        advantages: [
            'سرعت بسیار بالا',
            'مصرف منابع بسیار پایین',
            'سخت شناسایی توسط DPI',
            'راهاندازی سریع و آسان'
        ],
        disadvantages: [
            'امنیت نسبتاً پایینتر از VPN',
            'ممکن است توسط DPI پیشرفته شناسایی شود',
            'نیاز به کلاینت خاص برای هر دستگاه'
        ],
        bestFor: ['سرعت بالا', 'دور زدن سانسور ساده', 'مصرف منابع پایین'],
        difficulty: 'آسان',
        detectionRisk: 'پایین',
        speed: 'بسیار بالا',
        stability: 'متوسط'
    },
    
    v2ray: {
        name: 'V2Ray/Vmess',
        description: 'پروتکل پیشرفته با قابلیتهای گسترده',
        advantages: [
            'قابلیتهای پیشرفته برای دور زدن DPI',
            'پشتیبانی از پروتکلهای متعدد',
            'قابلیت ماسکه کردن ترافیک',
            'امنیت بسیار بالا'
        ],
        disadvantages: [
            'پیکربندی بسیار پیچیده',
            'نیاز به دانش فنی بالا',
            'مصرف منابع بالا',
            'ممکن است نیاز به اپدیت مکرر داشته باشد'
        ],
        bestFor: ['DPI پیشرفته', 'امنیت بالا', 'کاربران حرفهای'],
        difficulty: 'حرفهای',
        detectionRisk: 'بسیار پایین',
        speed: 'بالا',
        stability: 'بالا'
    },
    
    openvpn_udp: {
        name: 'OpenVPN UDP',
        description: 'OpenVPN با پروتکل UDP برای سرعت بالاتر',
        advantages: [
            'سرعت بالاتر از TCP',
            'کارایی بهتر در شبکههای پایدار',
            'قابلیت اطمینان خوب',
            'پیکربندی انعطافپذیر'
        ],
        disadvantages: [
            'ممکن است در شبکههای ناپایدار مشکل داشته باشد',
            'ممکن است توسط فایروالها مسدود شود',
            'پیکربندی پیچیده'
        ],
        bestFor: ['شبکههای پایدار', 'سرعت بالا', 'کاربران با تجربه'],
        difficulty: 'پیشرفته',
        detectionRisk: 'متوسط',
        speed: 'بالا',
        stability: 'متوسط'
    }
};

const TRANSPORT_METHODS = {
    tcp_over_tcp: {
        name: 'TCP over TCP',
        description: 'تونل TCP داخل TCP برای پایداری بالا',
        advantages: ['پایداری بسیار بالا', 'سازگاری عالی', 'قابل اطمینان'],
        disadvantages: ['سرعت پایین', 'overhead بالا', 'ممکن است مشکل TCP-over-TCP داشته باشد'],
        bestFor: ['شبکههای ناپایدار', 'فایروالهای سختگیر', 'اتصالات مهم']
    },
    
    udp_over_tcp: {
        name: 'UDP over TCP',
        description: 'UDP داخل TCP برای سرعت بالاتر',
        advantages: ['سرعت بالاتر', 'overhead کمتر', 'مناسب برای VoIP و استریمینگ'],
        disadvantages: ['ممکن است توسط فایروالها مسدود شود', 'نیاز به تنظیمات خاص'],
        bestFor: ['VoIP', 'استریمینگ', 'برنامههای realtime']
    },
    
    websocket_tls: {
        name: 'WebSocket over TLS',
        description: 'WebSocket روی TLS برای مخفیسازی کامل',
        advantages: ['مخفیسازی کامل', 'سازگاری با HTTPS', 'دور زدن DPI پیشرفته'],
        disadvantages: ['سرعت پایینتر', 'overhead بالا', 'پیکربندی پیچیده'],
        bestFor: ['DPI پیشرفته', 'مخفیسازی کامل', 'شبکههای سانسور شده']
    },
    
    http2_tls: {
        name: 'HTTP/2 over TLS',
        description: 'HTTP/2 روی TLS برای ادغام با ترافیک وب',
        advantages: ['ادغام کامل با ترافیک وب', 'مخفیسازی عالی', 'سرعت خوب'],
        disadvantages: ['پیکربندی پیچیده', 'نیاز به سرتیفیکیت SSL', 'مصرف منابع بالا'],
        bestFor: ['مخفیسازی کامل', 'ادغام با وب', 'DPI پیشرفته']
    }
};

class TunnelRecommendationEngine {
    constructor() {
        this.recommendations = [];
    }

    analyzeConnectivityResults(connectivityResults) {
        const analysis = {
            networkConditions: this.analyzeNetworkConditions(connectivityResults),
            threatLevel: this.assessThreatLevel(connectivityResults),
            userRequirements: this.determineUserRequirements(connectivityResults),
            availableOptions: []
        };

        this.generateRecommendations(analysis);
        return this.recommendations;
    }

    analyzeNetworkConditions(results) {
        const conditions = {
            stability: 'unknown',
            speed: 'unknown',
            packetLoss: 'unknown',
            latency: 'unknown',
            firewallType: 'unknown'
        };

        // Analyze based on connectivity patterns
        const successfulConnections = results.successfulConnections || [];
        const totalTested = results.summary?.totalTested || 0;
        const successRate = totalTested > 0 ? (successfulConnections.length / totalTested) * 100 : 0;

        if (successRate > 70) {
            conditions.stability = 'high';
            conditions.firewallType = 'permissive';
        } else if (successRate > 30) {
            conditions.stability = 'medium';
            conditions.firewallType = 'moderate';
        } else {
            conditions.stability = 'low';
            conditions.firewallType = 'strict';
        }

        // Analyze port accessibility
        const portAnalysis = this.analyzePortAccessibility(results);
        conditions.portAnalysis = portAnalysis;

        return conditions;
    }

    analyzePortAccessibility(results) {
        const portStats = {
            port80: { open: 0, closed: 0 },
            port443: { open: 0, closed: 0 },
            port22: { open: 0, closed: 0 },
            port53: { open: 0, closed: 0 }
        };

        const detailedResults = results.detailedResults || [];
        
        detailedResults.forEach(provider => {
            provider.successfulConnections.forEach(conn => {
                if (conn.port80) portStats.port80.open++;
                if (conn.port443) portStats.port443.open++;
                if (conn.port22) portStats.port22.open++;
                if (conn.port53) portStats.port53.open++;
            });
        });

        return portStats;
    }

    assessThreatLevel(results) {
        // Assess the level of censorship and surveillance
        const threatLevel = {
            censorship: 'low',
            surveillance: 'low',
            dpiCapability: 'none'
        };

        // Base assessment on connectivity patterns
        const successRate = results.summary?.successRate || 0;
        
        if (successRate < 20) {
            threatLevel.censorship = 'high';
            threatLevel.dpiCapability = 'advanced';
        } else if (successRate < 50) {
            threatLevel.censorship = 'medium';
            threatLevel.dpiCapability = 'basic';
        } else {
            threatLevel.censorship = 'low';
            threatLevel.dpiCapability = 'none';
        }

        return threatLevel;
    }

    determineUserRequirements(results) {
        // Determine what the user needs based on their situation
        const requirements = {
            priority: 'speed', // or 'security', 'stability', 'stealth'
            technicalLevel: 'intermediate', // or 'beginner', 'advanced'
            deviceCount: 1,
            usageType: 'general' // or 'streaming', 'voice', 'file-transfer'
        };

        // This would ideally come from user input or usage patterns
        return requirements;
    }

    generateRecommendations(analysis) {
        this.recommendations = [];

        // Generate primary recommendation
        const primaryRec = this.generatePrimaryRecommendation(analysis);
        this.recommendations.push(primaryRec);

        // Generate alternative recommendations
        const alternatives = this.generateAlternativeRecommendations(analysis);
        this.recommendations.push(...alternatives);

        // Generate transport method recommendations
        const transportRecs = this.generateTransportRecommendations(analysis);
        this.recommendations.push(...transportRecs);
    }

    generatePrimaryRecommendation(analysis) {
        let bestProtocol = null;
        let confidence = 0;
        let reasoning = [];

        // Decision tree based on network conditions
        if (analysis.networkConditions.stability === 'high') {
            if (analysis.threatLevel.censorship === 'low') {
                bestProtocol = TUNNEL_PROTOCOLS.wireguard;
                confidence = 90;
                reasoning.push('شبکه پایدار با سانسور کم - WireGuard انتخاب عالی');
            } else {
                bestProtocol = TUNNEL_PROTOCOLS.v2ray;
                confidence = 85;
                reasoning.push('شبکه پایدار اما سانسور بالا - V2Ray برای دور زدن DPI');
            }
        } else if (analysis.networkConditions.stability === 'medium') {
            if (analysis.networkConditions.firewallType === 'strict') {
                bestProtocol = TUNNEL_PROTOCOLS.openvpn_tcp;
                confidence = 80;
                reasoning.push('شبکه ناپایدار با فایروال سختگیر - OpenVPN TCP قابل اطمینان');
            } else {
                bestProtocol = TUNNEL_PROTOCOLS.ssh;
                confidence = 85;
                reasoning.push('شبکه متوسط با فایروال مناسب - SSH ساده و موثر');
            }
        } else {
            // Low stability network
            bestProtocol = TUNNEL_PROTOCOLS.openvpn_tcp;
            confidence = 75;
            reasoning.push('شبکه ناپایدار - OpenVPN TCP برای اطمینان بالا');
        }

        return {
            type: 'primary',
            protocol: bestProtocol,
            confidence: confidence,
            reasoning: reasoning,
            implementation: this.generateImplementationGuide(bestProtocol, analysis),
            nextSteps: this.generateNextSteps(bestProtocol, analysis)
        };
    }

    generateAlternativeRecommendations(analysis) {
        const alternatives = [];

        // Always provide Shadowsocks as a lightweight alternative
        alternatives.push({
            type: 'alternative',
            protocol: TUNNEL_PROTOCOLS.shadowsocks,
            confidence: 70,
            reasoning: ['راهاندازی سریع', 'مصرف منابع پایین', 'سرعت بالا'],
            useCase: 'برای مواقعی که پروتکل اصلی شناسایی شد یا نیاز به سرعت بالا دارید'
        });

        // Add SSH for simplicity
        alternatives.push({
            type: 'alternative',
            protocol: TUNNEL_PROTOCOLS.ssh,
            confidence: 75,
            reasoning: ['ساده و سریع', 'امنیت مناسب', 'در دسترس بودن سرورها'],
            useCase: 'برای شروع سریع یا مواقع اضطراری'
        });

        return alternatives;
    }

    generateTransportRecommendations(analysis) {
        const transportRecs = [];

        // Recommend transport methods based on threat level
        if (analysis.threatLevel.dpiCapability === 'advanced') {
            transportRecs.push({
                type: 'transport',
                method: TRANSPORT_METHODS.websocket_tls,
                confidence: 90,
                reasoning: ['مخفیسازی کامل', 'دور زدن DPI پیشرفته', 'سازگاری با وب'],
                useCase: 'برای مخفیسازی کامل در برابر DPI پیشرفته'
            });
        } else if (analysis.networkConditions.stability === 'low') {
            transportRecs.push({
                type: 'transport',
                method: TRANSPORT_METHODS.tcp_over_tcp,
                confidence: 85,
                reasoning: ['پایداری بالا', 'سازگاری عالی', 'قابل اطمینان'],
                useCase: 'برای شبکههای ناپایدار که نیاز به اطمینان بالا دارند'
            });
        } else {
            transportRecs.push({
                type: 'transport',
                method: TRANSPORT_METHODS.udp_over_tcp,
                confidence: 80,
                reasoning: ['سرعت بالا', 'overhead کم', 'مناسب برای VoIP'],
                useCase: 'برای سرعت بالا در شبکههای پایدار'
            });
        }

        return transportRecs;
    }

    generateImplementationGuide(protocol, analysis) {
        const guide = {
            requirements: [],
            steps: [],
            configuration: {},
            troubleshooting: []
        };

        // Generate specific implementation guide based on protocol
        switch (protocol) {
            case TUNNEL_PROTOCOLS.ssh:
                guide.requirements = ['سرور SSH با دسترسی root', 'کلاینت SSH', 'دانش مقدماتی لینوکس'];
                guide.steps = [
                    'نصب SSH در سرور خارجی',
                    'پیکربندی SSH tunnel با پورت فورواردینگ',
                    'راهاندازی کلاینت در دستگاه کاربر',
                    'تست اتصال و بهینهسازی'
                ];
                guide.configuration = {
                    port: '2222',
                    encryption: 'AES-256',
                    keepAlive: '60'
                };
                break;

            case TUNNEL_PROTOCOLS.wireguard:
                guide.requirements = ['کرنل لینوکس 3.1+', 'ماژول WireGuard', 'کلاینت WireGuard'];
                guide.steps = [
                    'نصب WireGuard در سرور',
                    'تولید کلیدهای عمومی و خصوصی',
                    'پیکربندی اینترفیس WireGuard',
                    'راهاندازی کلاینت در دستگاهها'
                ];
                guide.configuration = {
                    interface: 'wg0',
                    port: '51820',
                    encryption: 'ChaCha20'
                };
                break;

            case TUNNEL_PROTOCOLS.shadowsocks:
                guide.requirements = ['سرور با پایتون یا نود', 'کلاینت Shadowsocks'];
                guide.steps = [
                    'نصب Shadowsocks در سرور',
                    'پیکربندی سرور با رمزنگاری مناسب',
                    'راهاندازی سرویس بهصورت daemon',
                    'پیکربندی کلاینت در دستگاهها'
                ];
                guide.configuration = {
                    port: '8388',
                    method: 'aes-256-gcm',
                    timeout: '300'
                };
                break;

            case TUNNEL_PROTOCOLS.v2ray:
                guide.requirements = ['سرور با دسترسی root', 'دانش شبکههای پیشرفته', 'کلاینت V2Ray'];
                guide.steps = [
                    'نصب V2Ray در سرور',
                    'پیکربندی پروتکل Vmess با تنظیمات پیشرفته',
                    'راهاندازی WebSocket یا gRPC transport',
                    'پیکربندی TLS برای مخفیسازی',
                    'راهاندازی کلاینت با تنظیمات مشابه'
                ];
                guide.configuration = {
                    protocol: 'vmess',
                    port: '443',
                    transport: 'websocket',
                    security: 'tls'
                };
                break;

            default:
                guide.requirements = ['سرور VPS', 'دانش مقدماتی شبکه', 'کلاینت مناسب'];
                guide.steps = ['نصب نرمافزار', 'پیکربندی اولیه', 'تست اتصال'];
        }

        return guide;
    }

    generateNextSteps(protocol, analysis) {
        const nextSteps = [];

        // Common next steps
        nextSteps.push('تست اتصال کامل با تمام دستگاهها');
        nextSteps.push('مانیتورینگ عملکرد و ثبت لاگها');
        nextSteps.push('پیکربندی DNS برای جلوگیری از نشت اطلاعات');

        // Protocol-specific next steps
        if (protocol === TUNNEL_PROTOCOLS.v2ray) {
            nextSteps.push('بررسی آپدیتهای V2Ray برای دور زدن DPI جدید');
            nextSteps.push('تنظیمات پیشرفته برای بهینهسازی سرعت');
        } else if (protocol === TUNNEL_PROTOCOLS.wireguard) {
            nextSteps.push('بررسی ماژولهای کرنل برای بهینهسازی');
            nextSteps.push('پیکربندی مسیریابی برای بهترین مسیر');
        }

        // Network-specific next steps
        if (analysis.networkConditions.stability === 'low') {
            nextSteps.push('راهاندازی مکانیزم اتصال مجدد خودکار');
            nextSteps.push('پیکربندی backup connections');
        }

        if (analysis.threatLevel.censorship === 'high') {
            nextSteps.push('بررسی منظم برای شناسایی نشدن تونل');
            nextSteps.push('آمادهسازی پلنهای جایگزین برای مواقع اضطراری');
        }

        return nextSteps;
    }

    generateConfigurationTemplate(protocol, analysis) {
        const template = {
            server: {},
            client: {},
            network: {},
            security: {}
        };

        // Generate configuration template based on protocol and network conditions
        switch (protocol) {
            case TUNNEL_PROTOCOLS.ssh:
                template.server = {
                    port: 2222,
                    protocol: 'ssh',
                    keepAlive: 60,
                    maxAuthTries: 3
                };
                template.client = {
                    compression: true,
                    cipher: 'aes256-ctr',
                    mac: 'hmac-sha2-256'
                };
                break;

            case TUNNEL_PROTOCOLS.wireguard:
                template.server = {
                    interface: 'wg0',
                    port: 51820,
                    addresses: ['10.0.0.1/24'],
                    dns: ['1.1.1.1', '8.8.8.8']
                };
                template.client = {
                    persistentKeepalive: 25,
                    mtu: 1420
                };
                break;

            case TUNNEL_PROTOCOLS.shadowsocks:
                template.server = {
                    port: 8388,
                    method: 'aes-256-gcm',
                    timeout: 300
                };
                template.client = {
                    fastOpen: true,
                    workers: 4
                };
                break;

            case TUNNEL_PROTOCOLS.v2ray:
                template.server = {
                    protocol: 'vmess',
                    port: 443,
                    transport: 'websocket',
                    path: '/ws',
                    security: 'tls'
                };
                template.client = {
                    allowInsecure: false,
                    disableSystemRoot: false
                };
                break;
        }

        return template;
    }

    formatRecommendation(recommendation) {
        const formatted = {
            summary: '',
            details: {},
            configuration: {},
            commands: []
        };

        // Format recommendation for display
        if (recommendation.type === 'primary') {
            formatted.summary = `پیشنهاد اصلی: ${recommendation.protocol.name}`;
            formatted.details = {
                confidence: `اطمینان: ${recommendation.confidence}%`,
                reasoning: recommendation.reasoning,
                implementation: recommendation.implementation,
                nextSteps: recommendation.nextSteps
            };
        } else if (recommendation.type === 'alternative') {
            formatted.summary = `جایگزین: ${recommendation.protocol.name}`;
            formatted.details = {
                useCase: recommendation.useCase,
                reasoning: recommendation.reasoning
            };
        } else if (recommendation.type === 'transport') {
            formatted.summary = `ترنسپورت: ${recommendation.method.name}`;
            formatted.details = {
                useCase: recommendation.useCase,
                reasoning: recommendation.reasoning
            };
        }

        return formatted;
    }
}

module.exports = {
    TunnelRecommendationEngine,
    TUNNEL_PROTOCOLS,
    TRANSPORT_METHODS
};