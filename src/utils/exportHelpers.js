// Export utilities for dashboard data

/**
 * Convert data to CSV format
 * @param {Array} data - Array of objects to convert
 * @param {string} filename - Name of the file (without extension)
 * @returns {void}
 */
export const exportToCSV = (data, filename = 'dashboard-data') => {
  if (!data || data.length === 0) {
    console.error('No data provided for CSV export');
    return;
  }

  try {
    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      // Headers row
      headers.join(','),
      // Data rows
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle values that contain commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  } catch (error) {
    console.error('Error exporting to CSV:', error);
  }
};

/**
 * Convert data to JSON format and download
 * @param {Object} data - Data object to export
 * @param {string} filename - Name of the file (without extension)
 * @returns {void}
 */
export const exportToJSON = (data, filename = 'dashboard-data') => {
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}.json`, 'application/json');
  } catch (error) {
    console.error('Error exporting to JSON:', error);
  }
};

/**
 * Export comprehensive dashboard data
 * @param {Object} dashboardData - Complete dashboard data object
 * @param {string} format - Export format ('csv' or 'json')
 * @returns {void}
 */
export const exportDashboardData = (dashboardData, format = 'json') => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `dashboard-export-${timestamp}`;

  const exportData = {
    exportDate: new Date().toISOString(),
    summary: {
      totalKPIs: dashboardData.kpis?.length || 0,
      dataPoints: {
        sales: dashboardData.salesData?.length || 0,
        traffic: dashboardData.trafficData?.length || 0,
        products: dashboardData.productData?.length || 0
      }
    },
    ...dashboardData
  };

  if (format === 'csv') {
    // For CSV, we'll export each dataset separately
    if (dashboardData.salesData) {
      exportToCSV(dashboardData.salesData, `${filename}-sales`);
    }
    if (dashboardData.trafficData) {
      exportToCSV(dashboardData.trafficData, `${filename}-traffic`);
    }
    if (dashboardData.productData) {
      exportToCSV(dashboardData.productData, `${filename}-products`);
    }
    if (dashboardData.kpis) {
      exportToCSV(dashboardData.kpis, `${filename}-kpis`);
    }
  } else {
    exportToJSON(exportData, filename);
  }
};

/**
 * Generic file download function
 * @param {string} content - File content
 * @param {string} filename - Name of the file
 * @param {string} mimeType - MIME type of the file
 * @returns {void}
 */
const downloadFile = (content, filename, mimeType) => {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};

/**
 * Format data for chart export
 * @param {Array} chartData - Chart data array
 * @param {string} chartType - Type of chart (line, bar, pie, etc.)
 * @returns {Object} Formatted chart data
 */
export const formatChartDataForExport = (chartData, chartType) => {
  return {
    chartType,
    exportDate: new Date().toISOString(),
    dataPoints: chartData.length,
    data: chartData
  };
};

/**
 * Export specific chart data
 * @param {Array} chartData - Chart data to export
 * @param {string} chartName - Name of the chart
 * @param {string} format - Export format
 * @returns {void}
 */
export const exportChartData = (chartData, chartName, format = 'json') => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${chartName}-${timestamp}`;

  if (format === 'csv') {
    exportToCSV(chartData, filename);
  } else {
    const formattedData = formatChartDataForExport(chartData, chartName);
    exportToJSON(formattedData, filename);
  }
};

/**
 * Create a summary report of all dashboard data
 * @param {Object} dashboardData - Complete dashboard data
 * @returns {Object} Summary report object
 */
export const createSummaryReport = (dashboardData) => {
  const { salesData, trafficData, productData, kpis } = dashboardData;
  
  // Calculate summary statistics
  const salesSummary = salesData ? {
    totalRevenue: salesData.reduce((sum, item) => sum + (item.revenue || 0), 0),
    totalOrders: salesData.reduce((sum, item) => sum + (item.orders || 0), 0),
    avgRevenue: salesData.length > 0 ? (salesData.reduce((sum, item) => sum + (item.revenue || 0), 0) / salesData.length) : 0
  } : {};

  const trafficSummary = trafficData ? {
    totalVisitors: trafficData.reduce((sum, item) => sum + (item.visitors || 0), 0),
    totalPageViews: trafficData.reduce((sum, item) => sum + (item.pageViews || 0), 0),
    avgBounceRate: trafficData.length > 0 ? (trafficData.reduce((sum, item) => sum + parseFloat(item.bounceRate || 0), 0) / trafficData.length) : 0
  } : {};

  const productSummary = productData ? {
    totalCategories: productData.length,
    topCategory: productData.reduce((max, item) => (item.value > max.value ? item : max), { value: 0 }),
    totalValue: productData.reduce((sum, item) => sum + (item.value || 0), 0)
  } : {};

  return {
    reportDate: new Date().toISOString(),
    period: 'Current Period',
    sales: salesSummary,
    traffic: trafficSummary,
    products: productSummary,
    kpis: kpis || []
  };
};

/**
 * Export summary report
 * @param {Object} dashboardData - Complete dashboard data
 * @param {string} format - Export format
 * @returns {void}
 */
export const exportSummaryReport = (dashboardData, format = 'json') => {
  const report = createSummaryReport(dashboardData);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `dashboard-summary-${timestamp}`;

  if (format === 'json') {
    exportToJSON(report, filename);
  } else {
    // For CSV, flatten the nested object structure
    const flattenedData = [
      { metric: 'Report Date', value: report.reportDate },
      { metric: 'Total Revenue', value: report.sales.totalRevenue || 'N/A' },
      { metric: 'Total Orders', value: report.sales.totalOrders || 'N/A' },
      { metric: 'Average Revenue', value: report.sales.avgRevenue || 'N/A' },
      { metric: 'Total Visitors', value: report.traffic.totalVisitors || 'N/A' },
      { metric: 'Total Page Views', value: report.traffic.totalPageViews || 'N/A' },
      { metric: 'Average Bounce Rate', value: report.traffic.avgBounceRate || 'N/A' },
      { metric: 'Total Categories', value: report.products.totalCategories || 'N/A' },
      { metric: 'Top Category', value: report.products.topCategory?.name || 'N/A' }
    ];
    
    exportToCSV(flattenedData, filename);
  }
};