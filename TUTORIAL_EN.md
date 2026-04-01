# Iran Connectivity Analysis Tool - English Tutorial

## 🎯 What This Tool Does

This tool helps internet freedom activists identify data centers, CDNs, and DNS providers that can still connect to Iranian servers during international internet restrictions. It provides comprehensive analysis and tunnel recommendations for maintaining connectivity.

## 🚀 Quick Start Guide

### Step 1: Installation
```bash
git clone https://github.com/ehsanking/iran-connectivity.git
cd iran-connectivity
npm install
```

### Step 2: Basic Analysis
```bash
# Test connectivity to an Iranian IP
node cli.js analyze 185.185.123.45
```

### Step 3: Understanding Results
The tool will show you:
- Which providers can reach the Iranian IP
- Connection quality scores (0-100)
- Recommended tunnel protocols
- Port availability (80, 443, 22, 53)

## 📊 Available Commands

### 1. Analyze Connectivity
```bash
# Basic analysis
node cli.js analyze <Iranian_IP>

# Detailed analysis with custom timeout
node cli.js analyze 185.185.123.45 --timeout 10 --detailed

# Export results to CSV
node cli.js analyze 185.185.123.45 --export csv --output results.csv
```

### 2. List Providers
```bash
# Show all available providers
node cli.js providers

# Filter by region
node cli.js providers --region "middle-east"
```

### 3. Get Tunnel Recommendations
```bash
# Generate tunnel recommendations
node cli.js recommend connectivity_report.json
```

### 4. Configuration Management
```bash
# Show current settings
node cli.js config show

# Set custom timeout
node cli.js config set timeout 15

# Add custom IP ranges
node cli.js config add-range "192.168.1.0/24" "My Provider"
```

## 🌍 Provider Coverage

### Cloud Providers
- **Amazon Web Services**: 65 IP ranges
- **Google Cloud Platform**: 39 IP ranges  
- **Microsoft Azure**: 60 IP ranges

### CDN Services
- **Cloudflare**: 93 IP ranges
- **Akamai**: 70 IP ranges
- **Fastly**: 52 IP ranges

### DNS Services
- **Google DNS**: 3 IP ranges
- **Cloudflare DNS**: 3 IP ranges
- **OpenDNS**: 8 IP ranges
- **Quad9**: 2 IP ranges

### Regional Data Centers
- **Iranian**: 14 IP ranges
- **Turkish**: 20 IP ranges
- **UAE**: 18 IP ranges
- **Qatari**: 16 IP ranges
- **Russian**: 486 IP ranges
- **Chinese**: 72 IP ranges

## 🔒 Security Features

- **Local Testing**: All tests run locally on your server
- **Encrypted Logs**: Sensitive data is encrypted
- **Rate Limiting**: Prevents detection
- **Stealth Operation**: Minimal network footprint

## 🛠️ Tunnel Protocols Supported

### Recommended Protocols
1. **WireGuard** - Fast and secure
2. **OpenVPN** - Reliable and widely supported
3. **SSH** - Simple and effective
4. **Shadowsocks** - Good for bypassing restrictions
5. **V2Ray** - Advanced obfuscation

### Transport Methods
- **TCP-over-TCP**: Reliable but slower
- **UDP-over-TCP**: Better for streaming
- **WebSocket over TLS**: Hard to detect

## 📈 Understanding Scores

### Connectivity Score (0-100)
- **90-100**: Excellent connection
- **70-89**: Good connection
- **50-69**: Fair connection
- **30-49**: Poor connection
- **0-29**: No/blocked connection

### Port Status
- **✅ Port 80 (HTTP)**: Basic web access
- **✅ Port 443 (HTTPS)**: Secure web access
- **✅ Port 22 (SSH)**: Secure shell access
- **✅ Port 53 (DNS)**: Domain name resolution

## 🚨 Important Notes

### Safety Guidelines
1. Always test in a safe environment first
2. Use encrypted connections for sensitive operations
3. Monitor your network traffic
4. Keep logs secure and encrypted
5. Test during low-traffic periods

### Legal Disclaimer
This tool is designed for legitimate internet freedom research. Users are responsible for complying with local laws. Developers assume no responsibility for misuse.

## 📞 Support

For questions and support:
- Open an issue on GitHub
- Check the troubleshooting section in README.md
- Review the Persian tutorial for additional guidance

## 🤝 Contributing

We welcome contributions:
- Submit bug reports
- Suggest new features
- Add new IP ranges
- Improve documentation
- Translate to other languages

## 🙏 Acknowledgments

This tool is dedicated to all internet freedom activists fighting for free access to information, especially those working under difficult conditions in Iran.

---

**⭐ Star this repository if you find it helpful!**