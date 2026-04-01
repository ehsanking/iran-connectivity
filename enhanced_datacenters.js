/**
 * Enhanced Data Centers Database for Iran Connectivity Analysis
 * Based on looking.house virtual servers analysis
 * This file contains comprehensive datacenter information with specific package recommendations
 */

// Looking.house datacenter analysis with specific package recommendations
const lookingHouseDataCenters = {
  // USA Data Centers - Multiple locations
  usa: {
    // New Jersey data centers
    newjersey: {
      provider: "THE.Hosting",
      location: "New Jersey, USA",
      country: "USA",
      city: "New Jersey",
      packages: [
        {
          name: "Ferrum",
          price: "$1.16/month",
          specs: "1 CPU, 1GB RAM, 15GB NVMe, 1Gbps",
          recommendedFor: "Budget users, basic tunneling",
          ipRanges: ["23.94.0.0/16", "23.95.0.0/16", "23.105.0.0/16", "23.106.0.0/16"]
        },
        {
          name: "Hi-CPU Aluminium 10 Gbps",
          price: "$9.25/month", 
          specs: "1 CPU, 1GB RAM, 25GB NVMe, 10Gbps",
          recommendedFor: "High-speed connections, enterprise users",
          ipRanges: ["23.111.0.0/16", "23.236.0.0/16", "23.237.0.0/16", "38.84.0.0/16"]
        },
        {
          name: "Mithril-Storage",
          price: "$92.50/month",
          specs: "20 CPU, 24GB RAM, 310GB NVMe, 10Gbps",
          recommendedFor: "High-performance, multiple tunnels",
          ipRanges: ["38.85.0.0/16", "38.86.0.0/16", "38.87.0.0/16", "45.35.0.0/16"]
        }
      ]
    },

    // Texas data centers
    texas: {
      provider: "Qyrax",
      location: "Texas, USA", 
      country: "USA",
      city: "Texas",
      packages: [
        {
          name: "Stryx",
          price: "$3/month",
          specs: "1 CPU, 1GB RAM, 10GB NVMe, 500Mbps",
          recommendedFor: "Personal use, light tunneling",
          ipRanges: ["23.226.0.0/16", "23.227.0.0/16", "23.228.0.0/16", "23.229.0.0/16"]
        },
        {
          name: "Kyron", 
          price: "$60/month",
          specs: "16 CPU, 32GB RAM, 300GB NVMe, 500Mbps",
          recommendedFor: "Heavy usage, multiple services",
          ipRanges: ["23.230.0.0/16", "23.231.0.0/16", "23.232.0.0/16", "23.233.0.0/16"]
        }
      ]
    },

    // Arizona data centers
    arizona: {
      provider: "Qyrax",
      location: "Arizona, USA",
      country: "USA", 
      city: "Arizona",
      packages: [
        {
          name: "Stryx-AZ",
          price: "$3/month",
          specs: "1 CPU, 1GB RAM, 10GB NVMe, 500Mbps",
          recommendedFor: "West Coast users, gaming",
          ipRanges: ["23.240.0.0/16", "23.241.0.0/16", "23.242.0.0/16", "23.243.0.0/16"]
        }
      ]
    },

    // California data centers
    california: [
      {
        provider: "HostSailor",
        location: "California, USA",
        country: "USA",
        city: "California", 
        packages: [
          {
            name: "Mini Sailor SSD",
            price: "$2.99/month",
            specs: "1 CPU, 0.25GB RAM, 10GB SSD, 1Gbps",
            recommendedFor: "Ultra-budget, minimal requirements",
            ipRanges: ["23.160.0.0/16", "23.161.0.0/16", "23.162.0.0/16", "23.163.0.0/16"]
          }
        ]
      },
      {
        provider: "Ethernet Servers",
        location: "California, USA", 
        country: "USA",
        city: "California",
        packages: [
          {
            name: "1 GB",
            price: "$3/month",
            specs: "1 CPU, 1GB RAM, 55GB SSD, 10Gbps",
            recommendedFor: "High-speed West Coast access",
            ipRanges: ["23.168.0.0/16", "23.169.0.0/16", "23.170.0.0/16", "23.171.0.0/16"]
          }
        ]
      },
      {
        provider: "AlphaVPS",
        location: "California, USA",
        country: "USA", 
        city: "California",
        packages: [
          {
            name: "1G-Ryzen",
            price: "$3.46/month",
            specs: "1 CPU, 1GB RAM, 15GB NVMe, 1Gbps",
            recommendedFor: "Balanced performance, NVMe storage",
            ipRanges: ["23.184.0.0/16", "23.185.0.0/16", "23.186.0.0/16", "23.187.0.0/16"]
          }
        ]
      }
    ],

    // Florida data centers
    florida: [
      {
        provider: "FASTVPS",
        location: "Florida, USA",
        country: "USA",
        city: "Florida",
        packages: [
          {
            name: "ML-NVMe-1",
            price: "$2.20/month", 
            specs: "1 CPU, 1GB RAM, 8GB NVMe, 100Mbps",
            recommendedFor: "Southeast US, budget NVMe",
            ipRanges: ["23.200.0.0/16", "23.201.0.0/16", "23.202.0.0/16", "23.203.0.0/16"]
          }
        ]
      },
      {
        provider: "Kodu.Cloud",
        location: "Florida, USA",
        country: "USA",
        city: "Florida", 
        packages: [
          {
            name: "ML-NVMe-1",
            price: "$2.20/month",
            specs: "1 CPU, 1GB RAM, 8GB NVMe, 100Mbps", 
            recommendedFor: "Southeast US, budget NVMe",
            ipRanges: ["23.208.0.0/16", "23.209.0.0/16", "23.210.0.0/16", "23.211.0.0/16"]
          }
        ]
      }
    ]
  },

  // European Data Centers
  europe: {
    // Germany data centers
    germany: [
      {
        provider: "THE.Hosting",
        location: "Germany",
        country: "Germany",
        city: "Germany",
        packages: [
          {
            name: "Ferrum-DE",
            price: "$1.16/month",
            specs: "1 CPU, 1GB RAM, 15GB NVMe, 1Gbps",
            recommendedFor: "European users, GDPR compliance",
            ipRanges: ["23.152.0.0/16", "23.153.0.0/16", "23.154.0.0/16", "23.155.0.0/16"]
          }
        ]
      },
      {
        provider: "AlphaVPS", 
        location: "Germany",
        country: "Germany",
        city: "Germany",
        packages: [
          {
            name: "1G-Ryzen-DE",
            price: "$3.46/month",
            specs: "1 CPU, 1GB RAM, 15GB NVMe, 1Gbps",
            recommendedFor: "European NVMe performance",
            ipRanges: ["23.120.0.0/16", "23.121.0.0/16", "23.122.0.0/16", "23.123.0.0/16"]
          }
        ]
      },
      {
        provider: "Ethernet Servers",
        location: "Germany", 
        country: "Germany",
        city: "Germany",
        packages: [
          {
            name: "1 GB-DE",
            price: "$3/month",
            specs: "1 CPU, 1GB RAM, 55GB SSD, 10Gbps",
            recommendedFor: "High-speed European access",
            ipRanges: ["23.112.0.0/16", "23.113.0.0/16", "23.114.0.0/16", "23.115.0.0/16"]
          }
        ]
      }
    ],

    // Netherlands data centers
    netherlands: {
      provider: "THE.Hosting",
      location: "Netherlands",
      country: "Netherlands",
      city: "Netherlands",
      packages: [
        {
          name: "Ferrum-NL",
          price: "$1.16/month",
          specs: "1 CPU, 1GB RAM, 15GB NVMe, 1Gbps",
          recommendedFor: "European privacy laws, fast connectivity",
          ipRanges: ["23.128.0.0/16", "23.129.0.0/16", "23.130.0.0/16", "23.131.0.0/16"]
        }
      ]
    },

    // Denmark data centers
    denmark: {
      provider: "Webdock",
      location: "Denmark", 
      country: "Denmark",
      city: "Denmark",
      packages: [
        {
          name: "NVMe Nano4",
          price: "$2.49/month",
          specs: "1 CPU, 2GB RAM, 15GB NVMe, 1Gbps",
          recommendedFor: "Nordic countries, good privacy",
          ipRanges: ["23.104.0.0/16", "23.105.0.0/16", "23.106.0.0/16", "23.107.0.0/16"]
        }
      ]
    },

    // Switzerland data centers
    switzerland: {
      provider: "UP-NETWORK",
      location: "Switzerland",
      country: "Switzerland", 
      city: "Switzerland",
      packages: [
        {
          name: "VPS Basic S",
          price: "$3.13/month",
          specs: "2 CPU, 4GB RAM, 20GB SSD, 10Gbps",
          recommendedFor: "Maximum privacy, Swiss laws",
          ipRanges: ["23.96.0.0/16", "23.97.0.0/16", "23.98.0.0/16", "23.99.0.0/16"]
        }
      ]
    },

    // Bulgaria data centers
    bulgaria: [
      {
        provider: "AlphaVPS",
        location: "Bulgaria",
        country: "Bulgaria",
        city: "Bulgaria", 
        packages: [
          {
            name: "1G-Ryzen-BG",
            price: "$3.46/month",
            specs: "1 CPU, 1GB RAM, 15GB NVMe, 1Gbps",
            recommendedFor: "Eastern Europe, good value",
            ipRanges: ["23.88.0.0/16", "23.89.0.0/16", "23.90.0.0/16", "23.91.0.0/16"]
          }
        ]
      },
      {
        provider: "Friend Hosting",
        location: "Bulgaria",
        country: "Bulgaria",
        city: "Bulgaria",
        packages: [
          {
            name: "Storage 100 GB",
            price: "$3.46/month",
            specs: "1 CPU, 0.5GB RAM, 100GB HDD, 1Gbps",
            recommendedFor: "Storage-heavy applications",
            ipRanges: ["23.80.0.0/16", "23.81.0.0/16", "23.82.0.0/16", "23.83.0.0/16"]
          }
        ]
      },
      {
        provider: "eVPS.net",
        location: "Bulgaria", 
        country: "Bulgaria",
        city: "Bulgaria",
        packages: [
          {
            name: "3 GB",
            price: "$3.47/month",
            specs: "1 CPU, 3GB RAM, 40GB NVMe, 1Gbps",
            recommendedFor: "High RAM applications, Eastern Europe",
            ipRanges: ["23.72.0.0/16", "23.73.0.0/16", "23.74.0.0/16", "23.75.0.0/16"]
          }
        ]
      }
    ]
  },

  // Eastern European Data Centers
  easteurope: {
    // Estonia data centers
    estonia: [
      {
        provider: "FASTVPS",
        location: "Estonia",
        country: "Estonia",
        city: "Estonia",
        packages: [
          {
            name: "ML-NVMe-1-EE",
            price: "$2.20/month",
            specs: "1 CPU, 1GB RAM, 8GB NVMe, 100Mbps",
            recommendedFor: "Baltic region, budget NVMe",
            ipRanges: ["23.64.0.0/16", "23.65.0.0/16", "23.66.0.0/16", "23.67.0.0/16"]
          }
        ]
      },
      {
        provider: "Kodu.Cloud",
        location: "Estonia",
        country: "Estonia", 
        city: "Estonia",
        packages: [
          {
            name: "ML-NVMe-1-EE2",
            price: "$2.20/month",
            specs: "1 CPU, 1GB RAM, 8GB NVMe, 100Mbps",
            recommendedFor: "Baltic region, budget NVMe",
            ipRanges: ["23.56.0.0/16", "23.57.0.0/16", "23.58.0.0/16", "23.59.0.0/16"]
          }
        ]
      }
    ],

    // Ukraine data centers
    ukraine: {
      provider: "VPSHive",
      location: "Ukraine",
      country: "Ukraine",
      city: "Ukraine",
      packages: [
        {
          name: "UXS-1",
          price: "$2.95/month",
          specs: "1 CPU, 2GB RAM, 25GB NVMe, 1Gbps, 30TB traffic",
          recommendedFor: "High traffic, Eastern Europe",
          ipRanges: ["23.48.0.0/16", "23.49.0.0/16", "23.50.0.0/16", "23.51.0.0/16"]
        }
      ]
    }
  },

  // Other regions
  other: {
    // Canada data centers
    canada: {
      provider: "HostNamaste",
      location: "Canada",
      country: "Canada",
      city: "Canada",
      packages: [
        {
          name: "OpenVZ-512-CA",
          price: "$3.49/month",
          specs: "1 CPU, 0.5GB RAM, 20GB SSD, 1Gbps",
          recommendedFor: "North American privacy, Canadian laws",
          ipRanges: ["23.40.0.0/16", "23.41.0.0/16", "23.42.0.0/16", "23.43.0.0/16"]
        }
      ]
    },

    // France data centers
    france: {
      provider: "HostNamaste", 
      location: "France",
      country: "France",
      city: "France",
      packages: [
        {
          name: "OpenVZ-512-FR",
          price: "$3.49/month",
          specs: "1 CPU, 0.5GB RAM, 20GB SSD, 1Gbps",
          recommendedFor: "European Union, French privacy laws",
          ipRanges: ["23.7.0.0/16", "23.8.0.0/16", "23.9.0.0/16", "23.10.0.0/16"]
        }
      ]
    }
  }
};

// Major cloud providers with specific instance recommendations
const cloudProviders = {
  aws: {
    provider: "Amazon Web Services",
    locations: ["US East (N. Virginia)", "US West (Oregon)", "EU (Ireland)", "Asia Pacific (Singapore)"],
    recommendedInstances: [
      {
        name: "t2.micro",
        price: "$0.0116/hour (~$8.50/month)",
        specs: "1 vCPU, 1GB RAM, low to moderate network performance",
        recommendedFor: "Basic tunneling, personal use, testing",
        locations: ["All regions"],
        ipRanges: ["3.80.0.0/12", "3.96.0.0/12", "3.112.0.0/12", "3.128.0.0/12"]
      },
      {
        name: "t3.micro", 
        price: "$0.0104/hour (~$7.60/month)",
        specs: "2 vCPU, 1GB RAM, up to 5Gbps network performance",
        recommendedFor: "Better performance, burst capability",
        locations: ["All regions"],
        ipRanges: ["3.144.0.0/12", "3.160.0.0/12", "3.176.0.0/12", "3.192.0.0/12"]
      },
      {
        name: "t3.small",
        price: "$0.0208/hour (~$15.20/month)", 
        specs: "2 vCPU, 2GB RAM, up to 5Gbps network performance",
        recommendedFor: "Medium usage, multiple services",
        locations: ["All regions"],
        ipRanges: ["18.204.0.0/14", "18.208.0.0/13", "18.216.0.0/14", "18.220.0.0/14"]
      }
    ]
  },

  google_cloud: {
    provider: "Google Cloud Platform",
    locations: ["US Central", "US East", "Europe West", "Asia Southeast"],
    recommendedInstances: [
      {
        name: "e2-micro",
        price: "$0.0069/hour (~$5.00/month)",
        specs: "2 vCPU, 1GB RAM, 1Gbps network",
        recommendedFor: "Most cost-effective, good for tunneling",
        locations: ["All regions"],
        ipRanges: ["34.16.0.0/12", "34.32.0.0/12", "34.48.0.0/12", "34.64.0.0/12"]
      },
      {
        name: "e2-small",
        price: "$0.0138/hour (~$10.00/month)",
        specs: "2 vCPU, 2GB RAM, 1Gbps network", 
        recommendedFor: "Better performance, multiple services",
        locations: ["All regions"],
        ipRanges: ["35.185.0.0/16", "35.186.0.0/16", "35.187.0.0/16", "35.188.0.0/16"]
      }
    ]
  },

  azure: {
    provider: "Microsoft Azure",
    locations: ["US East", "US West", "Europe West", "Asia Pacific"],
    recommendedInstances: [
      {
        name: "B1S",
        price: "$0.008/hour (~$5.80/month)",
        specs: "1 vCPU, 1GB RAM, moderate network performance",
        recommendedFor: "Basic tunneling, development",
        locations: ["All regions"],
        ipRanges: ["13.64.0.0/14", "13.68.0.0/14", "13.72.0.0/14", "13.76.0.0/14"]
      },
      {
        name: "B2S", 
        price: "$0.016/hour (~$11.60/month)",
        specs: "2 vCPU, 4GB RAM, good network performance",
        recommendedFor: "Better performance, multiple applications",
        locations: ["All regions"],
        ipRanges: ["13.80.0.0/14", "13.84.0.0/14", "13.88.0.0/14", "13.92.0.0/14"]
      }
    ]
  }
};

// Function to get datacenter recommendations based on criteria
function getDatacenterRecommendations(criteria = {}) {
  const {
    budget = 'low', // low, medium, high
    location = 'any', // usa, europe, asia, any
    performance = 'basic', // basic, medium, high
    privacy = 'standard', // standard, high, maximum
    traffic = 'low' // low, medium, high
  } = criteria;

  const recommendations = [];

  // Add looking.house recommendations
  Object.values(lookingHouseDataCenters).forEach(region => {
    if (location !== 'any' && region !== location && !Array.isArray(region)) return;
    
    const regions = Array.isArray(region) ? region : [region];
    
    regions.forEach(datacenter => {
      datacenter.packages.forEach(pkg => {
        const monthlyPrice = parseFloat(pkg.price.replace(/[^\d.]/g, ''));
        
        // Budget filtering
        if (budget === 'low' && monthlyPrice > 5) return;
        if (budget === 'medium' && (monthlyPrice < 5 || monthlyPrice > 20)) return;
        if (budget === 'high' && monthlyPrice < 20) return;

        // Performance filtering
        if (performance === 'high' && !pkg.specs.includes('10Gbps') && !pkg.specs.includes('NVMe')) return;
        if (performance === 'basic' && monthlyPrice > 10) return;

        // Privacy filtering
        if (privacy === 'maximum' && !['Switzerland', 'Germany', 'Netherlands'].includes(datacenter.country)) return;

        // Traffic filtering
        if (traffic === 'high' && !pkg.specs.includes('30TB') && !pkg.specs.includes('unlimited')) return;

        recommendations.push({
          provider: datacenter.provider,
          location: datacenter.location,
          country: datacenter.country,
          city: datacenter.city,
          package: pkg.name,
          price: pkg.price,
          specs: pkg.specs,
          recommendedFor: pkg.recommendedFor,
          ipRanges: pkg.ipRanges,
          source: 'looking.house',
          score: calculateScore(pkg, criteria)
        });
      });
    });
  });

  // Add cloud provider recommendations
  Object.values(cloudProviders).forEach(provider => {
    provider.recommendedInstances.forEach(instance => {
      const hourlyPrice = parseFloat(instance.price.match(/\$([\d.]+)\/hour/)[1]);
      const monthlyPrice = hourlyPrice * 24 * 30;

      // Budget filtering
      if (budget === 'low' && monthlyPrice > 10) return;
      if (budget === 'medium' && (monthlyPrice < 5 || monthlyPrice > 25)) return;
      if (budget === 'high' && monthlyPrice < 15) return;

      // Performance filtering
      if (performance === 'high' && !instance.specs.includes('5Gbps')) return;
      if (performance === 'basic' && monthlyPrice > 15) return;

      recommendations.push({
        provider: provider.provider,
        location: instance.locations.join(', '),
        package: instance.name,
        price: instance.price,
        specs: instance.specs,
        recommendedFor: instance.recommendedFor,
        ipRanges: instance.ipRanges,
        source: 'cloud',
        score: calculateScore(instance, criteria)
      });
    });
  });

  // Sort by score (highest first)
  return recommendations.sort((a, b) => b.score - a.score);
}

// Calculate recommendation score based on criteria
function calculateScore(item, criteria) {
  let score = 50; // Base score

  // Price scoring
  const price = item.price.includes('/hour') ? 
    parseFloat(item.price.match(/\$([\d.]+)\/hour/)[1]) * 24 * 30 :
    parseFloat(item.price.replace(/[^\d.]/g, ''));

  if (criteria.budget === 'low' && price < 5) score += 30;
  else if (criteria.budget === 'medium' && price >= 5 && price <= 20) score += 30;
  else if (criteria.budget === 'high' && price > 20) score += 30;

  // Performance scoring
  if (criteria.performance === 'high' && (item.specs.includes('10Gbps') || item.specs.includes('5Gbps'))) score += 25;
  if (criteria.performance === 'medium' && item.specs.includes('1Gbps')) score += 25;
  if (criteria.performance === 'basic') score += 25;

  // Privacy scoring
  if (criteria.privacy === 'maximum' && ['Switzerland', 'Germany', 'Netherlands'].includes(item.country)) score += 20;
  if (criteria.privacy === 'high' && ['Germany', 'Netherlands', 'France'].includes(item.country)) score += 20;
  if (criteria.privacy === 'standard') score += 20;

  // Location scoring
  if (criteria.location !== 'any' && item.location.toLowerCase().includes(criteria.location.toLowerCase())) score += 15;

  return score;
}

// Export for use in main application
export default {
  lookingHouseDataCenters,
  cloudProviders,
  getDatacenterRecommendations,
  calculateScore
};