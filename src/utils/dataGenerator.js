// Data generation utilities for the dashboard

/**
 * Generate random sales data for the specified number of months
 * @param {number} months - Number of months to generate data for
 * @returns {Array} Array of sales data objects
 */
export const generateSalesData = (months = 6) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  return Array.from({ length: months }, (_, i) => {
    const monthIndex = (currentMonth - months + i + 1 + 12) % 12;
    return {
      month: monthNames[monthIndex],
      revenue: Math.floor(Math.random() * 50000) + 30000,
      orders: Math.floor(Math.random() * 500) + 200,
      customers: Math.floor(Math.random() * 300) + 150,
      conversion: (Math.random() * 5 + 2).toFixed(1)
    };
  });
};

/**
 * Generate hourly traffic data for 24 hours
 * @returns {Array} Array of traffic data objects
 */
export const generateTrafficData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    visitors: Math.floor(Math.random() * 1000) + 100,
    pageViews: Math.floor(Math.random() * 3000) + 500,
    bounceRate: (Math.random() * 30 + 20).toFixed(1)
  }));
};

/**
 * Generate product category data
 * @returns {Array} Array of product category objects
 */
export const generateProductData = () => {
  const categories = [
    { name: 'Electronics', color: '#8884d8' },
    { name: 'Clothing', color: '#82ca9d' },
    { name: 'Books', color: '#ffc658' },
    { name: 'Home & Garden', color: '#ff7300' },
    { name: 'Sports', color: '#00ff88' }
  ];

  return categories.map(category => ({
    ...category,
    value: Math.floor(Math.random() * 40) + 10
  }));
};

/**
 * Generate geographic sales data
 * @returns {Array} Array of geographic data objects
 */
export const generateGeographicData = () => {
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'];
  
  return regions.map(region => ({
    region,
    sales: Math.floor(Math.random() * 100000) + 50000,
    growth: (Math.random() * 20 - 5).toFixed(1) // -5% to +15%
  }));
};

/**
 * Generate customer demographics data
 * @returns {Array} Array of demographic data objects
 */
export const generateDemographicsData = () => {
  const ageGroups = ['18-25', '26-35', '36-45', '46-55', '55+'];
  
  return ageGroups.map(ageGroup => ({
    ageGroup,
    percentage: Math.floor(Math.random() * 25) + 10,
    count: Math.floor(Math.random() * 5000) + 1000
  }));
};

/**
 * Generate random color palette
 * @param {number} count - Number of colors to generate
 * @returns {Array} Array of hex color strings
 */
export const generateColorPalette = (count = 5) => {
  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88',
    '#ff8042', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'
  ];
  
  return colors.slice(0, count);
};

/**
 * Generate time series data for any metric
 * @param {string} metric - Name of the metric
 * @param {number} days - Number of days to generate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {Array} Array of time series data
 */
export const generateTimeSeriesData = (metric = 'value', days = 30, min = 0, max = 100) => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      [metric]: Math.floor(Math.random() * (max - min)) + min
    });
  }

  return data;
};

/**
 * Add realistic trends to data (growth, seasonality, etc.)
 * @param {Array} data - Base data array
 * @param {Object} options - Trend options
 * @returns {Array} Modified data with trends
 */
export const addTrends = (data, options = {}) => {
  const { growth = 0.02, volatility = 0.1, seasonal = false } = options;
  
  return data.map((item, index) => {
    let multiplier = 1 + (growth * index); // Linear growth
    
    if (seasonal) {
      // Add seasonal variation (simplified sine wave)
      multiplier += Math.sin((index / data.length) * 2 * Math.PI) * 0.2;
    }
    
    // Add random volatility
    multiplier += (Math.random() - 0.5) * volatility;
    
    const modifiedItem = { ...item };
    Object.keys(item).forEach(key => {
      if (typeof item[key] === 'number' && key !== 'month') {
        modifiedItem[key] = Math.round(item[key] * multiplier);
      }
    });
    
    return modifiedItem;
  });
};

/**
 * Generate KPI data with realistic trends
 * @returns {Array} Array of KPI objects
 */
export const generateKPIData = () => {
  const kpis = [
    {
      title: 'Total Revenue',
      icon: 'DollarSign',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Orders',
      icon: 'ShoppingCart',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Customers',
      icon: 'Users',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Conversion Rate',
      icon: 'TrendingUp',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return kpis.map((kpi, index) => {
    let value, change;
    
    switch (index) {
      case 0: // Revenue
        value = `$${(Math.random() * 500 + 200).toFixed(0)}K`;
        change = `+${(Math.random() * 15 + 5).toFixed(1)}%`;
        break;
      case 1: // Orders
        value = (Math.random() * 5000 + 2000).toFixed(0);
        change = `+${(Math.random() * 20 + 5).toFixed(1)}%`;
        break;
      case 2: // Customers
        value = (Math.random() * 2000 + 1000).toFixed(0);
        change = `+${(Math.random() * 25 + 10).toFixed(1)}%`;
        break;
      case 3: // Conversion Rate
        value = `${(Math.random() * 5 + 2).toFixed(1)}%`;
        change = Math.random() > 0.5 ? `+${(Math.random() * 3).toFixed(1)}%` : `-${(Math.random() * 2).toFixed(1)}%`;
        break;
      default:
        value = '0';
        change = '0%';
    }

    return {
      ...kpi,
      value,
      change,
      trend: change.startsWith('+') ? 'up' : 'down'
    };
  });
};