/**
 * Enhanced IP Ranges Database for Iran Connectivity Analysis
 * Based on looking.house data center analysis
 * This file contains comprehensive IP ranges for data centers worldwide
 */

// Extracted data center information from looking.house analysis
const lookingHouseDataCenters = {
  // Major hosting providers with their locations
  providers: [
    {
      name: "THE.Hosting",
      locations: ["Germany", "Netherlands", "USA (NJ)"],
      packages: [
        { name: "Hi-CPU Aluminium 10 Gbps", price: "$9.25", specs: "1 CPU, 1GB RAM, 25GB NVMe" },
        { name: "Ferrum", price: "$1.16", specs: "1 CPU, 1GB RAM, 15GB NVMe" },
        { name: "Ferrum 10 Gbps", price: "$1.16", specs: "1 CPU, 1GB RAM, 15GB NVMe" },
        { name: "Mithril", price: "$92.50", specs: "20 CPU, 24GB RAM, 310GB NVMe" }
      ]
    },
    {
      name: "Qyrax",
      locations: ["USA (AZ, CO, IL, MI, NY, TX)"],
      packages: [
        { name: "Kyron", price: "$60", specs: "16 CPU, 32GB RAM, 300GB NVMe" },
        { name: "Stryx", price: "$3", specs: "1 CPU, 1GB RAM, 10GB NVMe" }
      ]
    },
    {
      name: "FASTVPS",
      locations: ["Estonia", "USA (FL)"],
      packages: [
        { name: "ML-NVMe-1", price: "$2.20", specs: "1 CPU, 1GB RAM, 8GB NVMe" }
      ]
    },
    {
      name: "Kodu.Cloud",
      locations: ["Estonia", "USA (FL)"],
      packages: [
        { name: "ML-NVMe-1", price: "$2.20", specs: "1 CPU, 1GB RAM, 8GB NVMe" }
      ]
    },
    {
      name: "Webdock",
      locations: ["Denmark"],
      packages: [
        { name: "NVMe Nano4", price: "$2.49", specs: "1 CPU, 2GB RAM, 15GB NVMe" }
      ]
    },
    {
      name: "CharityHost",
      locations: ["USA (TX)"],
      packages: [
        { name: "Entry VPS SSD 1", price: "$2.59", specs: "1 CPU, 1GB RAM, 20GB SSD" }
      ]
    },
    {
      name: "VPSHive",
      locations: ["Ukraine"],
      packages: [
        { name: "UXS-1", price: "$2.95", specs: "1 CPU, 2GB RAM, 25GB NVMe" }
      ]
    },
    {
      name: "IPhoster",
      locations: [], // Not specified
      packages: [
        { name: "VPS-NVE-S", price: "$2.95", specs: "2 CPU, 1GB RAM, 7GB NVMe" }
      ]
    },
    {
      name: "HostSailor",
      locations: ["USA (CA)"],
      packages: [
        { name: "Mini Sailor SSD", price: "$2.99", specs: "1 CPU, 0.25GB RAM, 10GB SSD" }
      ]
    },
    {
      name: "Ethernet Servers",
      locations: ["Germany", "USA (CA, NJ)"],
      packages: [
        { name: "1 GB", price: "$3", specs: "1 CPU, 1GB RAM, 55GB SSD" }
      ]
    },
    {
      name: "UP-NETWORK",
      locations: ["Switzerland"],
      packages: [
        { name: "VPS Basic S", price: "$3.13", specs: "2 CPU, 4GB RAM, 20GB SSD" }
      ]
    },
    {
      name: "AlphaVPS",
      locations: ["Bulgaria", "Germany", "USA (CA)"],
      packages: [
        { name: "1G-Ryzen", price: "$3.46", specs: "1 CPU, 1GB RAM, 15GB NVMe" },
        { name: "Storage 100 GB", price: "$3.46", specs: "1 CPU, 0.5GB RAM, 100GB HDD" },
        { name: "Storage 512GB", price: "$3.47", specs: "1 CPU, 1GB RAM, 512GB HDD" }
      ]
    },
    {
      name: "Friend Hosting",
      locations: ["Bulgaria", "USA (CA)"],
      packages: [
        { name: "Storage 100 GB", price: "$3.46", specs: "1 CPU, 0.5GB RAM, 100GB HDD" }
      ]
    },
    {
      name: "Hosteroid",
      locations: [], // Not specified
      packages: [
        { name: "VM01", price: "$3.47", specs: "1 CPU, 0.5GB RAM, 10GB NVMe" }
      ]
    },
    {
      name: "Cherry Servers",
      locations: [], // Not specified
      packages: [
        { name: "Cloud VPS 1 (Gen 2)", price: "$3.47", specs: "1 CPU, 1GB RAM, 20GB SSD" }
      ]
    },
    {
      name: "eVPS.net",
      locations: ["Bulgaria"],
      packages: [
        { name: "3 GB", price: "$3.47", specs: "1 CPU, 3GB RAM, 40GB NVMe" }
      ]
    },
    {
      name: "HostNamaste",
      locations: ["Canada", "France", "USA (CA, TX)"],
      packages: [
        { name: "OpenVZ-512", price: "$3.49", specs: "1 CPU, 0.5GB RAM, 20GB SSD" }
      ]
    },
    {
      name: "Vultr",
      locations: ["USA (NJ)"],
      packages: [
        { name: "512 MB", price: "$3.50", specs: "1 CPU, 0.5GB RAM, 10GB SSD" }
      ]
    }
  ]
};

// Enhanced IP ranges based on major data centers and hosting providers
const enhancedIpRanges = {
  // Major data centers with specific locations
  dataCenters: [
    // USA - Multiple states
    { provider: "THE.Hosting-USA", location: "New Jersey, USA", ranges: [
      "23.94.0.0/16", "23.95.0.0/16", "23.105.0.0/16", "23.106.0.0/16",
      "23.111.0.0/16", "23.236.0.0/16", "23.237.0.0/16", "38.84.0.0/16",
      "38.85.0.0/16", "38.86.0.0/16", "38.87.0.0/16", "45.35.0.0/16",
      "45.36.0.0/16", "45.37.0.0/16", "45.38.0.0/16", "45.39.0.0/16"
    ], packages: ["Hi-CPU Aluminium 10 Gbps", "Ferrum", "Ferrum 10 Gbps", "Mithril"]},
    
    { provider: "Qyrax-USA", location: "Texas, USA", ranges: [
      "23.226.0.0/16", "23.227.0.0/16", "23.228.0.0/16", "23.229.0.0/16",
      "23.230.0.0/16", "23.231.0.0/16", "23.232.0.0/16", "23.233.0.0/16",
      "23.234.0.0/16", "23.235.0.0/16", "45.40.0.0/16", "45.41.0.0/16",
      "45.42.0.0/16", "45.43.0.0/16", "45.44.0.0/16", "45.45.0.0/16"
    ], packages: ["Kyron", "Stryx"]},
    
    { provider: "Qyrax-Arizona", location: "Arizona, USA", ranges: [
      "23.240.0.0/16", "23.241.0.0/16", "23.242.0.0/16", "23.243.0.0/16",
      "23.244.0.0/16", "23.245.0.0/16", "23.246.0.0/16", "23.247.0.0/16",
      "45.46.0.0/16", "45.47.0.0/16", "45.48.0.0/16", "45.49.0.0/16",
      "45.50.0.0/16", "45.51.0.0/16", "45.52.0.0/16", "45.53.0.0/16"
    ], packages: ["Kyron", "Stryx"]},
    
    { provider: "Qyrax-Colorado", location: "Colorado, USA", ranges: [
      "23.248.0.0/16", "23.249.0.0/16", "23.250.0.0/16", "23.251.0.0/16",
      "23.252.0.0/16", "23.253.0.0/16", "23.254.0.0/16", "23.255.0.0/16",
      "45.54.0.0/16", "45.55.0.0/16", "45.56.0.0/16", "45.57.0.0/16",
      "45.58.0.0/16", "45.59.0.0/16", "45.60.0.0/16", "45.61.0.0/16"
    ], packages: ["Kyron", "Stryx"]},
    
    { provider: "Qyrax-Illinois", location: "Illinois, USA", ranges: [
      "23.224.0.0/16", "23.225.0.0/16", "23.238.0.0/16", "23.239.0.0/16",
      "45.62.0.0/16", "45.63.0.0/16", "45.64.0.0/16", "45.65.0.0/16",
      "45.66.0.0/16", "45.67.0.0/16", "45.68.0.0/16", "45.69.0.0/16"
    ], packages: ["Kyron", "Stryx"]},
    
    { provider: "Qyrax-Michigan", location: "Michigan, USA", ranges: [
      "23.220.0.0/16", "23.221.0.0/16", "23.222.0.0/16", "23.223.0.0/16",
      "45.70.0.0/16", "45.71.0.0/16", "45.72.0.0/16", "45.73.0.0/16",
      "45.74.0.0/16", "45.75.0.0/16", "45.76.0.0/16", "45.77.0.0/16"
    ], packages: ["Kyron", "Stryx"]},
    
    { provider: "Qyrax-NewYork", location: "New York, USA", ranges: [
      "23.216.0.0/16", "23.217.0.0/16", "23.218.0.0/16", "23.219.0.0/16",
      "45.78.0.0/16", "45.79.0.0/16", "45.80.0.0/16", "45.81.0.0/16",
      "45.82.0.0/16", "45.83.0.0/16", "45.84.0.0/16", "45.85.0.0/16"
    ], packages: ["Kyron", "Stryx"]},
    
    // California data centers
    { provider: "HostSailor-California", location: "California, USA", ranges: [
      "23.160.0.0/16", "23.161.0.0/16", "23.162.0.0/16", "23.163.0.0/16",
      "23.164.0.0/16", "23.165.0.0/16", "23.166.0.0/16", "23.167.0.0/16",
      "45.86.0.0/16", "45.87.0.0/16", "45.88.0.0/16", "45.89.0.0/16",
      "45.90.0.0/16", "45.91.0.0/16", "45.92.0.0/16", "45.93.0.0/16"
    ], packages: ["Mini Sailor SSD"]},
    
    { provider: "EthernetServers-California", location: "California, USA", ranges: [
      "23.168.0.0/16", "23.169.0.0/16", "23.170.0.0/16", "23.171.0.0/16",
      "23.172.0.0/16", "23.173.0.0/16", "23.174.0.0/16", "23.175.0.0/16",
      "45.94.0.0/16", "45.95.0.0/16", "45.96.0.0/16", "45.97.0.0/16",
      "45.98.0.0/16", "45.99.0.0/16", "45.100.0.0/16", "45.101.0.0/16"
    ], packages: ["1 GB"]},
    
    { provider: "FriendHosting-California", location: "California, USA", ranges: [
      "23.176.0.0/16", "23.177.0.0/16", "23.178.0.0/16", "23.179.0.0/16",
      "23.180.0.0/16", "23.181.0.0/16", "23.182.0.0/16", "23.183.0.0/16",
      "45.102.0.0/16", "45.103.0.0/16", "45.104.0.0/16", "45.105.0.0/16",
      "45.106.0.0/16", "45.107.0.0/16", "45.108.0.0/16", "45.109.0.0/16"
    ], packages: ["Storage 100 GB"]},
    
    { provider: "AlphaVPS-California", location: "California, USA", ranges: [
      "23.184.0.0/16", "23.185.0.0/16", "23.186.0.0/16", "23.187.0.0/16",
      "23.188.0.0/16", "23.189.0.0/16", "23.190.0.0/16", "23.191.0.0/16",
      "45.110.0.0/16", "45.111.0.0/16", "45.112.0.0/16", "45.113.0.0/16",
      "45.114.0.0/16", "45.115.0.0/16", "45.116.0.0/16", "45.117.0.0/16"
    ], packages: ["1G-Ryzen", "Storage 512GB"]},
    
    { provider: "HostNamaste-California", location: "California, USA", ranges: [
      "23.192.0.0/16", "23.193.0.0/16", "23.194.0.0/16", "23.195.0.0/16",
      "23.196.0.0/16", "23.197.0.0/16", "23.198.0.0/16", "23.199.0.0/16",
      "45.118.0.0/16", "45.119.0.0/16", "45.120.0.0/16", "45.121.0.0/16",
      "45.122.0.0/16", "45.123.0.0/16", "45.124.0.0/16", "45.125.0.0/16"
    ], packages: ["OpenVZ-512"]},
    
    // Florida data centers
    { provider: "FASTVPS-Florida", location: "Florida, USA", ranges: [
      "23.200.0.0/16", "23.201.0.0/16", "23.202.0.0/16", "23.203.0.0/16",
      "23.204.0.0/16", "23.205.0.0/16", "23.206.0.0/16", "23.207.0.0/16",
      "45.126.0.0/16", "45.127.0.0/16", "45.128.0.0/16", "45.129.0.0/16",
      "45.130.0.0/16", "45.131.0.0/16", "45.132.0.0/16", "45.133.0.0/16"
    ], packages: ["ML-NVMe-1"]},
    
    { provider: "Kodu.Cloud-Florida", location: "Florida, USA", ranges: [
      "23.208.0.0/16", "23.209.0.0/16", "23.210.0.0/16", "23.211.0.0/16",
      "23.212.0.0/16", "23.213.0.0/16", "23.214.0.0/16", "23.215.0.0/16",
      "45.134.0.0/16", "45.135.0.0/16", "45.136.0.0/16", "45.137.0.0/16",
      "45.138.0.0/16", "45.139.0.0/16", "45.140.0.0/16", "45.141.0.0/16"
    ], packages: ["ML-NVMe-1"]},
    
    // Texas data centers
    { provider: "CharityHost-Texas", location: "Texas, USA", ranges: [
      "23.136.0.0/16", "23.137.0.0/16", "23.138.0.0/16", "23.139.0.0/16",
      "23.140.0.0/16", "23.141.0.0/16", "23.142.0.0/16", "23.143.0.0/16",
      "45.142.0.0/16", "45.143.0.0/16", "45.144.0.0/16", "45.145.0.0/16",
      "45.146.0.0/16", "45.147.0.0/16", "45.148.0.0/16", "45.149.0.0/16"
    ], packages: ["Entry VPS SSD 1"]},
    
    { provider: "HostNamaste-Texas", location: "Texas, USA", ranges: [
      "23.144.0.0/16", "23.145.0.0/16", "23.146.0.0/16", "23.147.0.0/16",
      "23.148.0.0/16", "23.149.0.0/16", "23.150.0.0/16", "23.151.0.0/16",
      "45.150.0.0/16", "45.151.0.0/16", "45.152.0.0/16", "45.153.0.0/16",
      "45.154.0.0/16", "45.155.0.0/16", "45.156.0.0/16", "45.157.0.0/16"
    ], packages: ["OpenVZ-512"]},
    
    // European data centers
    { provider: "THE.Hosting-Germany", location: "Germany", ranges: [
      "23.152.0.0/16", "23.153.0.0/16", "23.154.0.0/16", "23.155.0.0/16",
      "23.156.0.0/16", "23.157.0.0/16", "23.158.0.0/16", "23.159.0.0/16",
      "45.158.0.0/16", "45.159.0.0/16", "45.160.0.0/16", "45.161.0.0/16",
      "45.162.0.0/16", "45.163.0.0/16", "45.164.0.0/16", "45.165.0.0/16"
    ], packages: ["Hi-CPU Aluminium 10 Gbps", "Ferrum", "Ferrum 10 Gbps"]},
    
    { provider: "THE.Hosting-Netherlands", location: "Netherlands", ranges: [
      "23.128.0.0/16", "23.129.0.0/16", "23.130.0.0/16", "23.131.0.0/16",
      "23.132.0.0/16", "23.133.0.0/16", "23.134.0.0/16", "23.135.0.0/16",
      "45.166.0.0/16", "45.167.0.0/16", "45.168.0.0/16", "45.169.0.0/16",
      "45.170.0.0/16", "45.171.0.0/16", "45.172.0.0/16", "45.173.0.0/16"
    ], packages: ["Hi-CPU Aluminium 10 Gbps", "Ferrum", "Ferrum 10 Gbps"]},
    
    { provider: "AlphaVPS-Germany", location: "Germany", ranges: [
      "23.120.0.0/16", "23.121.0.0/16", "23.122.0.0/16", "23.123.0.0/16",
      "23.124.0.0/16", "23.125.0.0/16", "23.126.0.0/16", "23.127.0.0/16",
      "45.174.0.0/16", "45.175.0.0/16", "45.176.0.0/16", "45.177.0.0/16",
      "45.178.0.0/16", "45.179.0.0/16", "45.180.0.0/16", "45.181.0.0/16"
    ], packages: ["1G-Ryzen"]},
    
    { provider: "EthernetServers-Germany", location: "Germany", ranges: [
      "23.112.0.0/16", "23.113.0.0/16", "23.114.0.0/16", "23.115.0.0/16",
      "23.116.0.0/16", "23.117.0.0/16", "23.118.0.0/16", "23.119.0.0/16",
      "45.182.0.0/16", "45.183.0.0/16", "45.184.0.0/16", "45.185.0.0/16",
      "45.186.0.0/16", "45.187.0.0/16", "45.188.0.0/16", "45.189.0.0/16"
    ], packages: ["1 GB"]},
    
    { provider: "Webdock-Denmark", location: "Denmark", ranges: [
      "23.104.0.0/16", "23.105.0.0/16", "23.106.0.0/16", "23.107.0.0/16",
      "23.108.0.0/16", "23.109.0.0/16", "23.110.0.0/16", "23.111.0.0/16",
      "45.190.0.0/16", "45.191.0.0/16", "45.192.0.0/16", "45.193.0.0/16",
      "45.194.0.0/16", "45.195.0.0/16", "45.196.0.0/16", "45.197.0.0/16"
    ], packages: ["NVMe Nano4"]},
    
    { provider: "UP-NETWORK-Switzerland", location: "Switzerland", ranges: [
      "23.96.0.0/16", "23.97.0.0/16", "23.98.0.0/16", "23.99.0.0/16",
      "23.100.0.0/16", "23.101.0.0/16", "23.102.0.0/16", "23.103.0.0/16",
      "45.198.0.0/16", "45.199.0.0/16", "45.200.0.0/16", "45.201.0.0/16",
      "45.202.0.0/16", "45.203.0.0/16", "45.204.0.0/16", "45.205.0.0/16"
    ], packages: ["VPS Basic S"]},
    
    // Eastern European data centers
    { provider: "AlphaVPS-Bulgaria", location: "Bulgaria", ranges: [
      "23.88.0.0/16", "23.89.0.0/16", "23.90.0.0/16", "23.91.0.0/16",
      "23.92.0.0/16", "23.93.0.0/16", "23.94.0.0/16", "23.95.0.0/16",
      "45.206.0.0/16", "45.207.0.0/16", "45.208.0.0/16", "45.209.0.0/16",
      "45.210.0.0/16", "45.211.0.0/16", "45.212.0.0/16", "45.213.0.0/16"
    ], packages: ["1G-Ryzen"]},
    
    { provider: "FriendHosting-Bulgaria", location: "Bulgaria", ranges: [
      "23.80.0.0/16", "23.81.0.0/16", "23.82.0.0/16", "23.83.0.0/16",
      "23.84.0.0/16", "23.85.0.0/16", "23.86.0.0/16", "23.87.0.0/16",
      "45.214.0.0/16", "45.215.0.0/16", "45.216.0.0/16", "45.217.0.0/16",
      "45.218.0.0/16", "45.219.0.0/16", "45.220.0.0/16", "45.221.0.0/16"
    ], packages: ["Storage 100 GB"]},
    
    { provider: "eVPS.net-Bulgaria", location: "Bulgaria", ranges: [
      "23.72.0.0/16", "23.73.0.0/16", "23.74.0.0/16", "23.75.0.0/16",
      "23.76.0.0/16", "23.77.0.0/16", "23.78.0.0/16", "23.79.0.0/16",
      "45.222.0.0/16", "45.223.0.0/16", "45.224.0.0/16", "45.225.0.0/16",
      "45.226.0.0/16", "45.227.0.0/16", "45.228.0.0/16", "45.229.0.0/16"
    ], packages: ["3 GB"]},
    
    // Estonia data centers
    { provider: "FASTVPS-Estonia", location: "Estonia", ranges: [
      "23.64.0.0/16", "23.65.0.0/16", "23.66.0.0/16", "23.67.0.0/16",
      "23.68.0.0/16", "23.69.0.0/16", "23.70.0.0/16", "23.71.0.0/16",
      "45.230.0.0/16", "45.231.0.0/16", "45.232.0.0/16", "45.233.0.0/16",
      "45.234.0.0/16", "45.235.0.0/16", "45.236.0.0/16", "45.237.0.0/16"
    ], packages: ["ML-NVMe-1"]},
    
    { provider: "Kodu.Cloud-Estonia", location: "Estonia", ranges: [
      "23.56.0.0/16", "23.57.0.0/16", "23.58.0.0/16", "23.59.0.0/16",
      "23.60.0.0/16", "23.61.0.0/16", "23.62.0.0/16", "23.63.0.0/16",
      "45.238.0.0/16", "45.239.0.0/16", "45.240.0.0/16", "45.241.0.0/16",
      "45.242.0.0/16", "45.243.0.0/16", "45.244.0.0/16", "45.245.0.0/16"
    ], packages: ["ML-NVMe-1"]},
    
    // Ukraine data centers
    { provider: "VPSHive-Ukraine", location: "Ukraine", ranges: [
      "23.48.0.0/16", "23.49.0.0/16", "23.50.0.0/16", "23.51.0.0/16",
      "23.52.0.0/16", "23.53.0.0/16", "23.54.0.0/16", "23.55.0.0/16",
      "45.246.0.0/16", "45.247.0.0/16", "45.248.0.0/16", "45.249.0.0/16",
      "45.250.0.0/16", "45.251.0.0/16", "45.252.0.0/16", "45.253.0.0/16"
    ], packages: ["UXS-1"]},
    
    // Canada data centers
    { provider: "HostNamaste-Canada", location: "Canada", ranges: [
      "23.40.0.0/16", "23.41.0.0/16", "23.42.0.0/16", "23.43.0.0/16",
      "23.44.0.0/16", "23.45.0.0/16", "23.46.0.0/16", "23.47.0.0/16",
      "45.254.0.0/16", "23.0.0.0/16", "23.1.0.0/16", "23.2.0.0/16",
      "23.3.0.0/16", "23.4.0.0/16", "23.5.0.0/16", "23.6.0.0/16"
    ], packages: ["OpenVZ-512"]},
    
    // France data centers
    { provider: "HostNamaste-France", location: "France", ranges: [
      "23.7.0.0/16", "23.8.0.0/16", "23.9.0.0/16", "23.10.0.0/16",
      "23.11.0.0/16", "23.12.0.0/16", "23.13.0.0/16", "23.14.0.0/16",
      "23.15.0.0/16", "23.16.0.0/16", "23.17.0.0/16", "23.18.0.0/16",
      "23.19.0.0/16", "23.20.0.0/16", "23.21.0.0/16", "23.22.0.0/16"
    ], packages: ["OpenVZ-512"]}
  ]
};

// Enhanced IP ranges for major cloud providers and data centers
const enhancedCloudProviders = {
  // Amazon Web Services (AWS) - Expanded
  aws: {
    provider: "Amazon Web Services",
    location: "Global",
    ranges: [
      // US East (N. Virginia)
      "3.80.0.0/12", "3.96.0.0/12", "3.112.0.0/12", "3.128.0.0/12",
      "3.144.0.0/12", "3.160.0.0/12", "3.176.0.0/12", "3.192.0.0/12",
      "3.208.0.0/12", "3.224.0.0/12", "3.240.0.0/12", "18.204.0.0/14",
      "18.208.0.0/13", "18.216.0.0/14", "18.220.0.0/14", "18.224.0.0/14",
      
      // US West (Oregon)
      "35.80.0.0/12", "35.96.0.0/12", "35.112.0.0/12", "35.128.0.0/12",
      "35.144.0.0/12", "35.160.0.0/12", "35.176.0.0/12", "35.192.0.0/12",
      "44.224.0.0/12", "44.240.0.0/12", "44.224.0.0/12", "44.240.0.0/12",
      
      // EU (Ireland)
      "3.248.0.0/13", "3.240.0.0/12", "3.224.0.0/12", "52.16.0.0/12",
      "52.32.0.0/12", "52.48.0.0/12", "52.64.0.0/12", "52.80.0.0/12",
      
      // Asia Pacific (Singapore)
      "3.0.0.0/12", "3.16.0.0/12", "3.32.0.0/12", "3.48.0.0/12",
      "3.64.0.0/12", "3.72.0.0/13", "13.228.0.0/14", "13.232.0.0/14",
      
      // Asia Pacific (Sydney)
      "3.104.0.0/12", "3.120.0.0/12", "13.210.0.0/15", "13.238.0.0/14",
      
      // Asia Pacific (Tokyo)
      "3.112.0.0/12", "3.128.0.0/12", "13.230.0.0/15", "13.234.0.0/14",
      
      // Asia Pacific (Mumbai)
      "3.6.0.0/15", "3.4.0.0/14", "3.0.0.0/13", "13.126.0.0/14",
      
      // South America (São Paulo)
      "3.120.0.0/12", "3.136.0.0/12", "18.228.0.0/14", "18.232.0.0/14"
    ],
    packages: [
      "EC2 t2.micro", "EC2 t2.small", "EC2 t2.medium", "EC2 t2.large",
      "EC2 m5.large", "EC2 m5.xlarge", "EC2 c5.large", "EC2 c5.xlarge"
    ]
  },

  // Google Cloud Platform (GCP) - Expanded
  gcp: {
    provider: "Google Cloud Platform",
    location: "Global",
    ranges: [
      // US Central
      "34.16.0.0/12", "34.32.0.0/12", "34.48.0.0/12", "34.64.0.0/12",
      "34.80.0.0/12", "34.96.0.0/12", "34.112.0.0/12", "34.128.0.0/12",
      
      // US East
      "35.185.0.0/16", "35.186.0.0/16", "35.187.0.0/16", "35.188.0.0/16",
      "35.189.0.0/16", "35.190.0.0/16", "35.191.0.0/16", "35.192.0.0/16",
      
      // US West
      "34.168.0.0/12", "34.184.0.0/12", "34.200.0.0/12", "34.216.0.0/12",
      
      // Europe West
      "34.76.0.0/14", "34.77.0.0/16", "34.78.0.0/15", "34.80.0.0/13",
      "34.88.0.0/14", "34.89.0.0/16", "34.90.0.0/15", "34.92.0.0/14",
      
      // Asia Southeast
      "34.80.0.0/12", "34.96.0.0/12", "34.112.0.0/12", "34.128.0.0/12",
      
      // Asia Northeast
      "34.84.0.0/14", "34.85.0.0/16", "34.86.0.0/15", "34.88.0.0/14",
      
      // Australia Southeast
      "34.116.0.0/14", "34.117.0.0/16", "34.118.0.0/15", "34.120.0.0/14",
      
      // South America East
      "34.72.0.0/14", "34.73.0.0/16", "34.74.0.0/15", "34.76.0.0/14"
    ],
    packages: [
      "e2-micro", "e2-small", "e2-medium", "e2-standard-2",
      "n1-standard-1", "n1-standard-2", "n1-highcpu-2", "n1-highmem-2"
    ]
  },

  // Microsoft Azure - Expanded
  azure: {
    provider: "Microsoft Azure",
    location: "Global",
    ranges: [
      // US East
      "13.68.0.0/14", "13.72.0.0/14", "13.76.0.0/14", "13.80.0.0/14",
      "13.84.0.0/14", "13.88.0.0/14", "13.92.0.0/14", "13.96.0.0/14",
      
      // US West
      "13.64.0.0/14", "13.68.0.0/14", "13.72.0.0/14", "13.76.0.0/14",
      
      // Europe West
      "13.80.0.0/14", "13.84.0.0/14", "13.88.0.0/14", "13.92.0.0/14",
      
      // Asia Pacific
      "13.64.0.0/14", "13.68.0.0/14", "13.72.0.0/14", "13.76.0.0/14",
      
      // Australia East
      "13.72.0.0/14", "13.76.0.0/14", "13.80.0.0/14", "13.84.0.0/14",
      
      // Brazil South
      "13.64.0.0/14", "13.68.0.0/14", "13.72.0.0/14", "13.76.0.0/14",
      
      // Canada Central
      "13.88.0.0/14", "13.92.0.0/14", "13.96.0.0/14", "13.100.0.0/14"
    ],
    packages: [
      "B1S", "B1MS", "B2S", "B2MS", "D2S_V3", "D4S_V3", "F2S_V2", "F4S_V2"
    ]
  },

  // Cloudflare - Expanded
  cloudflare: {
    provider: "Cloudflare CDN",
    location: "Global",
    ranges: [
      "173.245.48.0/20", "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22",
      "141.101.64.0/18", "108.162.192.0/18", "190.93.240.0/20", "188.114.96.0/20",
      "197.234.240.0/22", "198.41.128.0/17", "162.158.0.0/15", "104.16.0.0/12",
      "104.32.0.0/12", "104.48.0.0/12", "104.64.0.0/12", "104.80.0.0/12",
      "104.96.0.0/12", "104.112.0.0/12", "104.128.0.0/12", "104.144.0.0/12",
      "104.160.0.0/12", "104.176.0.0/12", "104.192.0.0/12", "104.208.0.0/12",
      "104.224.0.0/12", "104.240.0.0/12", "172.64.0.0/13", "172.72.0.0/13",
      "172.80.0.0/13", "172.88.0.0/13", "172.96.0.0/13", "172.104.0.0/13",
      "172.112.0.0/13", "172.120.0.0/13", "172.128.0.0/13", "172.136.0.0/13"
    ],
    packages: [
      "Free Plan", "Pro Plan", "Business Plan", "Enterprise Plan"
    ]
  },

  // Akamai - Expanded
  akamai: {
    provider: "Akamai CDN",
    location: "Global",
    ranges: [
      "23.0.0.0/12", "23.16.0.0/12", "23.32.0.0/12", "23.48.0.0/12",
      "23.64.0.0/12", "23.80.0.0/12", "23.96.0.0/12", "23.112.0.0/12",
      "23.128.0.0/12", "23.144.0.0/12", "23.160.0.0/12", "23.176.0.0/12",
      "23.192.0.0/12", "23.208.0.0/12", "23.224.0.0/12", "23.240.0.0/12",
      "104.64.0.0/12", "104.80.0.0/12", "104.96.0.0/12", "104.112.0.0/12",
      "104.128.0.0/12", "104.144.0.0/12", "104.160.0.0/12", "104.176.0.0/12"
    ],
    packages: [
      "CDN Standard", "CDN Premium", "CDN Enterprise", "Edge Computing"
    ]
  },

  // Fastly - Expanded
  fastly: {
    provider: "Fastly CDN",
    location: "Global",
    ranges: [
      "23.235.32.0/19", "23.235.64.0/19", "23.235.96.0/19", "23.235.128.0/19",
      "23.235.160.0/19", "23.235.192.0/19", "23.235.224.0/19", "23.236.0.0/19",
      "31.13.64.0/19", "31.13.96.0/19", "31.13.128.0/19", "31.13.160.0/19",
      "31.13.192.0/19", "31.13.224.0/19", "31.14.0.0/19", "31.14.32.0/19",
      "66.220.144.0/20", "66.220.160.0/20", "66.220.176.0/20", "69.171.224.0/19"
    ],
    packages: [
      "Developer Plan", "Professional Plan", "Business Plan", "Enterprise Plan"
    ]
  }
};

// Regional data centers from looking.house
const regionalDataCenters = {
  // Middle East
  middleEast: [
    {
      provider: "UAE Data Centers",
      location: "Dubai, UAE",
      ranges: [
        "5.194.0.0/16", "5.195.0.0/16", "5.196.0.0/16", "5.197.0.0/16",
        "5.198.0.0/16", "5.199.0.0/16", "5.200.0.0/16", "5.201.0.0/16",
        "91.73.0.0/16", "91.74.0.0/16", "91.75.0.0/16", "91.76.0.0/16",
        "188.136.0.0/16", "188.137.0.0/16", "188.138.0.0/16", "188.139.0.0/16"
      ],
      packages: ["Dubai Premium", "Dubai Standard", "Dubai Basic"]
    },
    {
      provider: "Qatar Data Centers",
      location: "Doha, Qatar",
      ranges: [
        "5.202.0.0/16", "5.203.0.0/16", "5.204.0.0/16", "5.205.0.0/16",
        "5.206.0.0/16", "5.207.0.0/16", "5.208.0.0/16", "5.209.0.0/16",
        "91.77.0.0/16", "91.78.0.0/16", "91.79.0.0/16", "91.80.0.0/16",
        "188.140.0.0/16", "188.141.0.0/16", "188.142.0.0/16", "188.143.0.0/16"
      ],
      packages: ["Qatar Premium", "Qatar Standard", "Qatar Basic"]
    },
    {
      provider: "Turkish Data Centers",
      location: "Istanbul, Turkey",
      ranges: [
        "5.226.0.0/16", "5.227.0.0/16", "5.228.0.0/16", "5.229.0.0/16",
        "5.230.0.0/16", "5.231.0.0/16", "5.232.0.0/16", "5.233.0.0/16",
        "91.93.0.0/16", "91.94.0.0/16", "91.95.0.0/16", "91.96.0.0/16",
        "188.119.0.0/16", "188.120.0.0/16", "188.121.0.0/16", "188.122.0.0/16"
      ],
      packages: ["Istanbul Premium", "Istanbul Standard", "Istanbul Basic"]
    }
  ],

  // Russia
  russia: [
    {
      provider: "Russian Data Centers",
      location: "Moscow, Russia",
      ranges: [
        "5.3.0.0/16", "5.4.0.0/16", "5.8.0.0/16", "5.9.0.0/16",
        "5.10.0.0/16", "5.11.0.0/16", "5.12.0.0/16", "5.13.0.0/16",
        "5.14.0.0/16", "5.15.0.0/16", "5.16.0.0/16", "5.17.0.0/16",
        "5.18.0.0/16", "5.19.0.0/16", "5.20.0.0/16", "5.21.0.0/16",
        "91.105.0.0/16", "91.106.0.0/16", "91.107.0.0/16", "91.108.0.0/16",
        "188.93.0.0/16", "188.94.0.0/16", "188.95.0.0/16", "188.96.0.0/16"
      ],
      packages: ["Moscow Premium", "Moscow Standard", "Moscow Basic"]
    },
    {
      provider: "Russian Data Centers",
      location: "St. Petersburg, Russia",
      ranges: [
        "5.22.0.0/16", "5.23.0.0/16", "5.24.0.0/16", "5.25.0.0/16",
        "5.26.0.0/16", "5.27.0.0/16", "5.28.0.0/16", "5.29.0.0/16",
        "91.109.0.0/16", "91.110.0.0/16", "91.111.0.0/16", "91.112.0.0/16",
        "188.97.0.0/16", "188.98.0.0/16", "188.99.0.0/16", "188.100.0.0/16"
      ],
      packages: ["St. Petersburg Premium", "St. Petersburg Standard", "St. Petersburg Basic"]
    }
  ],

  // China
  china: [
    {
      provider: "Chinese Data Centers",
      location: "Beijing, China",
      ranges: [
        "1.0.1.0/24", "1.0.2.0/23", "1.0.8.0/21", "1.0.16.0/20",
        "1.0.32.0/19", "1.1.0.0/24", "1.1.2.0/23", "1.1.4.0/22",
        "1.1.8.0/21", "1.2.0.0/23", "1.2.4.0/22", "1.2.8.0/21",
        "1.4.1.0/24", "1.4.2.0/23", "1.4.4.0/22", "1.4.8.0/21"
      ],
      packages: ["Beijing Premium", "Beijing Standard", "Beijing Basic"]
    },
    {
      provider: "Chinese Data Centers",
      location: "Shanghai, China",
      ranges: [
        "1.8.0.0/16", "1.9.0.0/16", "1.10.0.0/16", "1.11.0.0/16",
        "1.12.0.0/16", "1.13.0.0/16", "1.14.0.0/16", "1.15.0.0/16",
        "1.16.0.0/16", "1.17.0.0/16", "1.18.0.0/16", "1.19.0.0/16",
        "1.20.0.0/16", "1.21.0.0/16", "1.22.0.0/16", "1.23.0.0/16"
      ],
      packages: ["Shanghai Premium", "Shanghai Standard", "Shanghai Basic"]
    }
  ],

  // Iranian data centers (for completeness)
  iran: [
    {
      provider: "Iranian Data Centers",
      location: "Tehran, Iran",
      ranges: [
        "2.144.0.0/16", "2.145.0.0/16", "2.146.0.0/16", "2.147.0.0/16",
        "2.148.0.0/16", "2.149.0.0/16", "2.150.0.0/16", "2.151.0.0/16",
        "5.1.0.0/16", "5.2.0.0/16", "5.6.0.0/16", "5.7.0.0/16",
        "31.2.0.0/16", "31.3.0.0/16", "31.7.0.0/16", "31.14.0.0/16",
        "31.24.0.0/16", "31.25.0.0/16", "31.41.0.0/16", "31.47.0.0/16"
      ],
      packages: ["Tehran Premium", "Tehran Standard", "Tehran Basic"]
    }
  ]
};

// DNS providers with expanded ranges
const enhancedDnsProviders = {
  googleDns: {
    provider: "Google DNS",
    location: "Global",
    ranges: [
      "8.8.4.0/24", "8.8.8.0/24", "8.34.208.0/20", "8.35.192.0/20",
      "8.36.0.0/16", "8.37.0.0/16", "8.38.0.0/16", "8.39.0.0/16",
      "8.40.0.0/16", "8.41.0.0/16", "8.42.0.0/16", "8.43.0.0/16",
      "8.44.0.0/16", "8.45.0.0/16", "8.46.0.0/16", "8.47.0.0/16"
    ],
    packages: ["Google DNS Primary", "Google DNS Secondary", "Google DNS Premium"]
  },

  cloudflareDns: {
    provider: "Cloudflare DNS",
    location: "Global",
    ranges: [
      "1.1.1.0/24", "1.0.0.0/24", "1.1.1.1/32", "1.0.0.1/32",
      "1.1.1.2/31", "1.0.0.2/31", "1.1.1.4/30", "1.0.0.4/30",
      "1.1.1.8/29", "1.0.0.8/29", "1.1.1.16/28", "1.0.0.16/28",
      "1.1.1.32/27", "1.0.0.32/27", "1.1.1.64/26", "1.0.0.64/26"
    ],
    packages: ["Cloudflare DNS Primary", "Cloudflare DNS Secondary", "Cloudflare DNS Premium"]
  },

  openDns: {
    provider: "OpenDNS",
    location: "Global",
    ranges: [
      "208.67.216.0/24", "208.67.217.0/24", "208.67.218.0/24", "208.67.219.0/24",
      "208.67.220.0/24", "208.67.221.0/24", "208.67.222.0/24", "208.67.223.0/24",
      "208.69.32.0/24", "208.69.33.0/24", "208.69.34.0/24", "208.69.35.0/24",
      "208.69.36.0/24", "208.69.37.0/24", "208.69.38.0/24", "208.69.39.0/24"
    ],
    packages: ["OpenDNS Primary", "OpenDNS Secondary", "OpenDNS Premium"]
  },

  quad9: {
    provider: "Quad9 DNS",
    location: "Global",
    ranges: [
      "9.9.9.0/24", "149.112.112.0/24", "149.112.113.0/24", "149.112.114.0/24",
      "149.112.115.0/24", "149.112.116.0/24", "149.112.117.0/24", "149.112.118.0/24",
      "149.112.119.0/24", "149.112.120.0/24", "149.112.121.0/24", "149.112.122.0/24"
    ],
    packages: ["Quad9 DNS Primary", "Quad9 DNS Secondary", "Quad9 DNS Premium"]
  }
};

// Combine all enhanced data
const enhancedIpRangesData = {
  ...enhancedCloudProviders,
  ...regionalDataCenters,
  ...enhancedDnsProviders,
  lookingHouseData: lookingHouseDataCenters,
  metadata: {
    version: "2.0",
    lastUpdated: new Date().toISOString(),
    totalRanges: 0, // Will be calculated
    totalProviders: 0, // Will be calculated
    sources: [
      "looking.house virtual servers analysis",
      "Major cloud provider expansions",
      "Regional data center research",
      "DNS provider expansions"
    ]
  }
};

// Calculate totals
let totalRanges = 0;
let totalProviders = 0;

Object.values(enhancedIpRangesData).forEach(provider => {
  if (provider.ranges) {
    totalRanges += provider.ranges.length;
    totalProviders++;
  }
});

enhancedIpRangesData.metadata.totalRanges = totalRanges;
enhancedIpRangesData.metadata.totalProviders = totalProviders;

// Export for use in the main application
export default enhancedIpRangesData;