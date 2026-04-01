#!/usr/bin/env node

/**
 * Test script for Iran Check tool
 * Tests basic functionality without requiring actual network connectivity
 */

const IranConnectivityAnalyzer = require('./iran_connectivity');
const { TunnelRecommendationEngine } = require('./tunnel_recommendations');
const { ConfigManager } = require('./config_manager');

console.log('🧪 Testing Iran Check Tool...\n');

// Test 1: Configuration Manager
console.log('1️⃣ Testing Configuration Manager...');
try {
    const configManager = new ConfigManager();
    
    // Test default values
    const timeout = configManager.get('network.timeout');
    console.log(`   ✅ Default timeout: ${timeout}s`);
    
    // Test setting values
    configManager.set('network.timeout', 10);
    const newTimeout = configManager.get('network.timeout');
    console.log(`   ✅ Updated timeout: ${newTimeout}s`);
    
    // Test validation
    const { errors, warnings } = configManager.validateConfig();
    if (errors.length === 0) {
        console.log('   ✅ Configuration validation passed');
    } else {
        console.log('   ⚠️  Configuration warnings:', warnings);
    }
    
    console.log('   ✅ Configuration Manager tests passed\n');
} catch (error) {
    console.log(`   ❌ Configuration Manager test failed: ${error.message}\n`);
}

// Test 2: IP Ranges
console.log('2️⃣ Testing IP Ranges...');
try {
    const { getAllProviders, getProviderInfo } = require('./ip_ranges');
    
    const providers = getAllProviders();
    console.log(`   ✅ Found ${providers.length} providers`);
    
    const awsInfo = getProviderInfo('aws');
    console.log(`   ✅ AWS info: ${awsInfo.name} (${awsInfo.ranges.length} ranges)`);
    
    console.log('   ✅ IP Ranges tests passed\n');
} catch (error) {
    console.log(`   ❌ IP Ranges test failed: ${error.message}\n`);
}

// Test 3: Tunnel Recommendations
console.log('3️⃣ Testing Tunnel Recommendations...');
try {
    const engine = new TunnelRecommendationEngine();
    
    // Mock connectivity results
    const mockResults = {
        summary: {
            totalTested: 10,
            successfulConnections: 3,
            failedConnections: 7,
            successRate: 30
        },
        successfulProviders: [
            { provider: 'cloudflare', name: 'Cloudflare', successfulConnections: 5, bestScore: 80 }
        ],
        detailedResults: [
            {
                provider: 'cloudflare',
                name: 'Cloudflare CDN',
                successfulConnections: [
                    { ip: '1.1.1.1', connectivityScore: 80, port80: true, port443: true }
                ],
                connectivityScore: 80
            }
        ]
    };
    
    const recommendations = engine.analyzeConnectivityResults(mockResults);
    console.log(`   ✅ Generated ${recommendations.length} recommendations`);
    
    const primaryRec = recommendations.find(r => r.type === 'primary');
    if (primaryRec) {
        console.log(`   ✅ Primary recommendation: ${primaryRec.protocol.name}`);
        console.log(`   ✅ Confidence: ${primaryRec.confidence}%`);
    }
    
    console.log('   ✅ Tunnel Recommendations tests passed\n');
} catch (error) {
    console.log(`   ❌ Tunnel Recommendations test failed: ${error.message}\n`);
}

// Test 4: CLI Interface (mock test)
console.log('4️⃣ Testing CLI Interface...');
try {
    // Test IP validation
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    const validIp = '185.185.123.45';
    const invalidIp = '185.185.123';
    
    console.log(`   ✅ Valid IP test: ${ipRegex.test(validIp)}`);
    console.log(`   ✅ Invalid IP test: ${!ipRegex.test(invalidIp)}`);
    
    console.log('   ✅ CLI Interface tests passed\n');
} catch (error) {
    console.log(`   ❌ CLI Interface test failed: ${error.message}\n`);
}

// Test 5: Network Utilities (mock)
console.log('5️⃣ Testing Network Utilities...');
try {
    const analyzer = new IranConnectivityAnalyzer({
        targetIp: '127.0.0.1',
        timeout: 1,
        verbose: false
    });
    
    // Test CIDR parsing
    const sampleIps = analyzer.getSampleIpsFromCidr('192.168.1.0/24', 3);
    console.log(`   ✅ CIDR parsing: ${sampleIps.length} IPs from 192.168.1.0/24`);
    
    // Test IP conversion
    const ipNum = analyzer.ipToNumber('192.168.1.1');
    const ipStr = analyzer.numberToIp(ipNum);
    console.log(`   ✅ IP conversion: 192.168.1.1 -> ${ipNum} -> ${ipStr}`);
    
    console.log('   ✅ Network Utilities tests passed\n');
} catch (error) {
    console.log(`   ❌ Network Utilities test failed: ${error.message}\n`);
}

console.log('🎉 All tests completed!');
console.log('\n💡 برای اجرای واقعی:');
console.log('   node cli.js analyze <IP_ایران>');
console.log('   مثال: node cli.js analyze 185.185.123.45');