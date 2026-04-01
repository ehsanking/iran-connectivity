# Iran Connectivity Analysis Tool
# ابزار تحلیل اتصال اینترنت ایران

> A critical tool for internet freedom activists to analyze connectivity to Iranian servers during internet restrictions
> 
> ابزاری حیاتی برای فعالان آزادی اینترنت جهت تحلیل اتصال به سرورهای ایرانی در زمان محدودیت‌های اینترنتی

---

## 🌍 English | فارسی 🇮🇷

### Overview | مرور کلی

**English:**
This tool helps identify data centers, CDNs, and DNS providers that can still connect to Iranian servers during international internet restrictions. It provides comprehensive analysis and tunnel recommendations for maintaining connectivity.

**فارسی:**
این ابزار به شما کمک می‌کند دیتاسنترها، CDNها و ارائه‌دهندگان DNS را شناسایی کنید که در زمان محدودیت‌های اینترنت بین‌المللی همچنان می‌توانند به سرورهای ایرانی متصل شوند. تحلیل جامع و پیشنهادهای تونل‌زنی برای حفظ ارتباط ارائه می‌دهد.

---

## 🚀 Quick Start | شروع سریع

### Installation | نصب

```bash
git clone https://github.com/ehsanking/iran-connectivity.git
cd iran-connectivity
apt install npm -y
```

### Basic Usage | استفاده پایه

**English:**
```bash
# Analyze connectivity to an Iranian IP
node cli.js analyze 185.185.123.45

# List all available providers
node cli.js providers

# Get tunnel recommendations
node cli.js recommend connectivity_report.json
```

**فارسی:**
```bash
# تحلیل اتصال به یک IP ایرانی
node cli.js analyze 185.185.123.45

# لیست تمام ارائه‌دهندگان
node cli.js providers

# دریافت پیشنهادهای تونل‌زنی
node cli.js recommend connectivity_report.json
```

### 📚 Tutorials | آموزش‌ها

**English:** 📖 [Detailed English Tutorial](TUTORIAL_EN.md) - Complete guide with examples

**فارسی:** 📖 [آموزش جامع فارسی](TUTORIAL_FA.md) - راهنمای کامل با مثال

---

## 📖 Detailed Usage Guide | راهنمای جامع

### 1. Connectivity Analysis | تحلیل اتصال

**English:**
```bash
# Basic analysis
node cli.js analyze <Iranian_IP>

# Detailed analysis with custom timeout
node cli.js analyze 185.185.123.45 --timeout 10 --detailed

# Export results to CSV
node cli.js analyze 185.185.123.45 --export csv --output results.csv

# Test with specific providers
node cli.js analyze 185.185.123.45 --providers "AWS,Google Cloud,Cloudflare"
```

**فارسی:**
```bash
# تحلیل پایه
node cli.js analyze <IP_ایرانی>

# تحلیل دقیق با زمان انتظار سفارشی
node cli.js analyze 185.185.123.45 --timeout 10 --detailed

# خروجی گرفتن نتایج به CSV
node cli.js analyze 185.185.123.45 --export csv --output results.csv

# تست با ارائه‌دهندگان خاص
node cli.js analyze 185.185.123.45 --providers "AWS,Google Cloud,Cloudflare"
```

### 2. Provider Information | اطلاعات ارائه‌دهندگان

**English:**
```bash
# List all providers with IP ranges
node cli.js providers

# Filter by region
node cli.js providers --region "middle-east"

# Get provider statistics
node cli.js providers --stats
```

**فارسی:**
```bash
# لیست تمام ارائه‌دهندگان با رنج‌های IP
node cli.js providers

# فیلتر بر اساس منطقه
node cli.js providers --region "middle-east"

# دریافت آمار ارائه‌دهندگان
node cli.js providers --stats
```

### 3. Configuration Management | مدیریت پیکربندی

**English:**
```bash
# Show current configuration
node cli.js config show

# Set custom timeout
node cli.js config set timeout 15

# Add custom IP ranges
node cli.js config add-range "192.168.1.0/24" "Custom Provider"

# Reset to defaults
node cli.js config reset
```

**فارسی:**
```bash
# نمایش پیکربندی فعلی
node cli.js config show

# تنظیم زمان انتظار سفارشی
node cli.js config set timeout 15

# افزودن رنج‌های IP سفارشی
node cli.js config add-range "192.168.1.0/24" "Custom Provider"

# بازگشت به تنظیمات پیش‌فرض
node cli.js config reset
```

---

## 📊 Features | ویژگی‌ها

### Database Coverage | پوشش پایگاه داده

**English:**
- **16+ Providers**: AWS (65 ranges), Google Cloud (39), Azure (60), Cloudflare (93), Akamai (70), Fastly (52)
- **DNS Services**: Google DNS, Cloudflare DNS, OpenDNS, Quad9
- **Regional Coverage**: Iranian, Turkish, UAE, Qatari, Russian, Chinese data centers
- **Total**: 1000+ IP ranges

**فارسی:**
- **۱۶+ ارائه‌دهنده**: AWS (۶۵ رنج)، Google Cloud (۳۹)، Azure (۶۰)، Cloudflare (۹۳)، Akamai (۷۰)، Fastly (۵۲)
- **سرویس‌های DNS**: Google DNS، Cloudflare DNS، OpenDNS، Quad9
- **پوشش منطقه‌ای**: دیتاسنترهای ایرانی، ترکیه‌ای، اماراتی، قطری، روسی، چینی
- **مجموع**: بیش از ۱۰۰۰ رنج IP

### Testing Capabilities | قابلیت‌های تست

**English:**
- **Port Testing**: 80, 443, 22, 53
- **Connection Quality**: Response time, packet loss, stability
- **Network Analysis**: Firewall detection, routing paths
- **Scoring System**: 0-100 connectivity score

**فارسی:**
- **تست پورت**: ۸۰، ۴۴۳، ۲۲، ۵۳
- **کیفیت اتصال**: زمان پاسخ، از دست دادن بسته، پایداری
- **تحلیل شبکه**: تشخیص فایروال، مسیرهای مسیریابی
- **سیستم امتیازدهی**: امتیاز اتصال ۰-۱۰۰

### Tunnel Recommendations | پیشنهادهای تونل‌زنی

**English:**
- **Protocols**: SSH, WireGuard, OpenVPN, Shadowsocks, V2Ray
- **Transport Methods**: TCP-over-TCP, UDP-over-TCP, WebSocket over TLS
- **Confidence Scoring**: 0-100% recommendation confidence
- **Step-by-step Guides**: Detailed setup instructions

**فارسی:**
- **پروتکل‌ها**: SSH، WireGuard، OpenVPN، Shadowsocks، V2Ray
- **روش‌های انتقال**: TCP-over-TCP، UDP-over-TCP، WebSocket over TLS
- **امتیاز اطمینان**: ۰-۱۰۰٪ اطمینان پیشنهاد
- **راهنماهای گام‌به‌گام**: دستورالعمل‌های دقیق راه‌اندازی

---

## 🔒 Security Features | ویژگی‌های امنیتی

**English:**
- **Local Testing**: All tests run locally on your server
- **Encrypted Logs**: Sensitive data is encrypted
- **Rate Limiting**: Prevents detection through excessive requests
- **Minimal Footprint**: Designed for stealth operation

**فارسی:**
- **تست محلی**: تمام تست‌ها به‌صورت محلی روی سرور شما اجرا می‌شود
- **لاگ‌های رمزنگاری شده**: داده‌های حساس رمزنگاری می‌شوند
- **محدودیت نرخ**: جلوگیری از شناسایی از طریق درخواست‌های زیاد
- **ردپای کم**: طراحی شده برای عملیات مخفی

---

## 📋 Command Reference | مرجع دستورات

### Main Commands | دستورات اصلی

| Command | Description | توضیح فارسی |
|---------|-------------|-------------|
| `analyze <IP>` | Analyze connectivity to Iranian IP | تحلیل اتصال به IP ایرانی |
| `providers` | List all providers | لیست تمام ارائه‌دهندگان |
| `recommend <file>` | Get tunnel recommendations | دریافت پیشنهادهای تونل‌زنی |
| `config` | Configuration management | مدیریت پیکربندی |

### Options | گزینه‌ها

| Option | Description | توضیح فارسی |
|--------|-------------|-------------|
| `--timeout <seconds>` | Set timeout (default: 5) | تنظیم زمان انتظار (پیش‌فرض: ۵) |
| `--detailed` | Show detailed results | نمایش نتایج دقیق |
| `--export <format>` | Export format (json/csv/txt) | قالب خروجی |
| `--output <file>` | Output file path | مسیر فایل خروجی |
| `--providers <list>` | Filter providers | فیلتر ارائه‌دهندگان |
| `--region <region>` | Filter by region | فیلتر بر اساس منطقه |

---

## 🛠️ Advanced Usage | استفاده پیشرفته

### Custom Testing | تست سفارشی

**English:**
```bash
# Test with multiple custom parameters
node cli.js analyze 185.185.123.45 \
  --timeout 15 \
  --detailed \
  --providers "AWS,Google Cloud,Cloudflare" \
  --export json \
  --output custom_test.json

# Batch testing
for ip in 185.185.123.45 185.185.123.46 185.185.123.47; do
  node cli.js analyze $ip --export csv --output "test_$ip.csv"
done
```

**فارسی:**
```bash
# تست با چندین پارامتر سفارشی
node cli.js analyze 185.185.123.45 \
  --timeout 15 \
  --detailed \
  --providers "AWS,Google Cloud,Cloudflare" \
  --export json \
  --output custom_test.json

# تست گروهی
for ip in 185.185.123.45 185.185.123.46 185.185.123.47; do
  node cli.js analyze $ip --export csv --output "test_$ip.csv"
done
```

### Integration with Other Tools | ادغام با ابزارهای دیگر

**English:**
```bash
# Pipe to other tools
node cli.js analyze 185.185.123.45 --export json | jq '.results[] | select(.score > 70)'

# Use with cron for monitoring
echo "0 2 * * * cd /path/to/irancheck && node cli.js analyze 185.185.123.45 --export json --output daily_\$(date +\%Y\%m\%d).json" | crontab -
```

**فارسی:**
```bash
# اتصال به ابزارهای دیگر
node cli.js analyze 185.185.123.45 --export json | jq '.results[] | select(.score > 70)'

# استفاده با cron برای نظارت
echo "0 2 * * * cd /path/to/irancheck && node cli.js analyze 185.185.123.45 --export json --output daily_\$(date +\%Y\%m\%d).json" | crontab -
```

---

## 📊 Example Output | نمونه خروجی

### Analysis Report | گزارش تحلیل

**English:**
```json
{
  "targetIp": "185.185.123.45",
  "timestamp": "2024-01-15T10:30:00Z",
  "summary": {
    "totalProviders": 16,
    "reachableProviders": 8,
    "bestScore": 85,
    "recommendedProvider": "Cloudflare"
  },
  "results": [
    {
      "provider": "Cloudflare",
      "region": "Global",
      "score": 85,
      "status": "REACHABLE",
      "ports": {
        "80": true,
        "443": true,
        "22": false,
        "53": true
      },
      "latency": 45,
      "recommendedTunnel": "WireGuard-UDP"
    }
  ]
}
```

**فارسی:**
```json
{
  "targetIp": "185.185.123.45",
  "timestamp": "2024-01-15T10:30:00Z",
  "summary": {
    "totalProviders": 16,
    "reachableProviders": 8,
    "bestScore": 85,
    "recommendedProvider": "Cloudflare"
  },
  "results": [
    {
      "provider": "Cloudflare",
      "region": "Global",
      "score": 85,
      "status": "REACHABLE",
      "ports": {
        "80": true,
        "443": true,
        "22": false,
        "53": true
      },
      "latency": 45,
      "recommendedTunnel": "WireGuard-UDP"
    }
  ]
}
```

---

## ⚠️ Important Notes | نکات مهم

### Legal Disclaimer | منع قانونی

**English:**
This tool is designed for legitimate internet freedom research and activism. Users are responsible for complying with local laws and regulations. The developers assume no responsibility for misuse.

**فارسی:**
این ابزار برای تحقیقات و فعالیت‌های مشروع آزادی اینترنت طراحی شده است. کاربران مسئول رعایت قوانین و مقررات محلی هستند. توسعه‌دهندگان هیچ مسئولیتی در قبال سوءاستفاده نمی‌پذیرند.

### Safety Guidelines | راهنمای ایمنی

**English:**
- Always test in a safe environment first
- Use encrypted connections for sensitive operations
- Monitor your network traffic
- Keep logs secure and encrypted
- Test during low-traffic periods

**فارسی:**
- همیشه ابتدا در یک محیط امن تست کنید
- برای عملیات حساس از اتصالات رمزنگاری شده استفاده کنید
- ترافیک شبکه خود را نظارت کنید
- لاگ‌ها را امن و رمزنگاری شده نگه دارید
- در زمان‌های کم‌ترافیک تست کنید

---

## 🆘 Troubleshooting | عیب‌یابی

### Common Issues | مشکلات رایج

**Git merge conflict (`<<<<<<<`, `=======`, `>>>>>>>`)**

**English:** merge fails when unresolved conflict markers remain in source files (for example `cli.js`). Keep one final version of the conflicted block, remove all markers, then run:

```bash
npm test
node -c cli.js
```

**فارسی:** اگر markerهای conflict داخل کد باقی مانده باشند (مثلاً در `cli.js`) عملیات merge شکست می‌خورد. فقط نسخه نهایی بلاک را نگه دارید، markerها را کامل حذف کنید، سپس اجرا کنید:

```bash
npm test
node -c cli.js
```

**English:**
```bash
# Permission denied
chmod +x cli.js

# Module not found
npm install

# Timeout errors
node cli.js analyze <IP> --timeout 20

# No connectivity
Check your server's internet connection
```

**فارسی:**
```bash
# مجوز دسترسی
chmod +x cli.js

# ماژول یافت نشد
npm install

# خطاهای تایم‌اوت
node cli.js analyze <IP> --timeout 20

# بدون اتصال
اتصال اینترنت سرور خود را بررسی کنید
```

---

## 🤝 Contributing | مشارکت

**English:**
We welcome contributions from the community. Please submit pull requests or open issues for bugs and feature requests.

**فارسی:**
ما از مشارکت جامعه استقبال می‌کنیم. لطفاً درخواست‌های pull ارسال کنید یا برای باگ‌ها و درخواست‌های ویژگی، issues باز کنید.

---

## 📞 Support | پشتیبانی

**English:**
For questions and support, please open an issue on GitHub.

**فارسی:**
برای سوالات و پشتیبانی، لطفاً در GitHub یک issue باز کنید.

---

## 📄 License | مجوز

**English:**
This project is licensed under the MIT License - see the LICENSE file for details.

**فارسی:**
این پروژه تحت مجوز MIT منتشر شده است - برای جزئیات فایل LICENSE را ببینید.

---

## 🙏 Acknowledgments | قدردانی

**English:**
This tool is dedicated to all internet freedom activists for free access to information.

**فارسی:**
این ابزار به تمام فعالان آزادی اینترنت تقدیم شده است.

---

**⭐ Star this repository if you find it helpful!**
**⭐ اگر این مخزن برای شما مفید بود، آن را ستاره‌دار کنید!**
