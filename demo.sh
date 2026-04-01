#!/bin/bash

# Quick demo script for Iran Check tool
# This demonstrates the tool's capabilities

echo "🚀 Iran Check Tool - Quick Demo"
echo "================================"
echo

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Show help
echo "📖 Showing help..."
node cli.js --help
echo

# Show providers
echo "📋 Showing available providers..."
node cli.js providers
echo

# Run basic test
echo "🧪 Running basic test..."
node test.js
echo

# Show configuration example
echo "⚙️  Configuration example:"
cat > demo.config.json << EOF
{
  "network": {
    "timeout": 5,
    "maxConcurrent": 50
  },
  "testing": {
    "sampleSize": 5,
    "logLevel": "info"
  },
  "output": {
    "format": "json"
  }
}
EOF

echo "Created demo.config.json"
echo

# Show usage examples
echo "💡 Usage Examples:"
echo
echo "1. Basic analysis:"
echo "   node cli.js analyze 185.185.123.45"
echo
echo "2. Analysis with custom settings:"
echo "   node cli.js analyze 185.185.123.45 --timeout 10 --concurrent 100 --detailed"
echo
echo "3. Export results:"
echo "   node cli.js analyze 185.185.123.45 --export csv --output results.csv"
echo
echo "4. Generate recommendations from report:"
echo "   node cli.js recommend connectivity_report.json"
echo
echo "5. Configuration management:"
echo "   node cli.js config show"
echo "   node cli.js config set network.timeout 10"
echo

echo "✅ Demo completed!"
echo "برای استفاده واقعی، آی‌پی یک سرور ایران را وارد کنید."
echo "This tool is for maintaining internet freedom in Iran."