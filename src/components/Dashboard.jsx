import React, { useState } from 'react';
import { Download, Filter, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { exportDashboardData, exportChartData } from '../utils/exportHelpers';
import { KPICardsGrid } from './KPICard';
import ChartContainer from './ChartContainer';

/**
 * Main Dashboard Component
 */
const Dashboard = () => {
  // Real-time data hook
  const {
    salesData,
    trafficData,
    productData,
    kpis,
    isRealTime,
    lastUpdated,
    updateCount,
    isLoading,
    error,
    toggleRealTime,
    refreshData,
    getDashboardData
  } = useRealTimeData({
    updateInterval: 5000,
    autoStart: true,
    enablePersistence: true
  });

  // Local state
  const [filters, setFilters] = useState({
    dateRange: '6months',
    category: 'all',
    metric: 'revenue'
  });

  const [visibleCharts, setVisibleCharts] = useState({
    sales: true,
    traffic: true,
    products: true,
    kpis: true
  });

  const [fullscreenChart, setFullscreenChart] = useState(null);

  // Export handlers
  const handleExportJSON = () => {
    const dashboardData = getDashboardData();
    exportDashboardData(dashboardData, 'json');
  };

  const handleExportCSV = () => {
    const dashboardData = getDashboardData();
    exportDashboardData(dashboardData, 'csv');
  };

  const handleChartExport = (data, chartName) => {
    exportChartData(data, chartName, 'json');
  };

  const handleFullscreenToggle = (chartName) => {
    setFullscreenChart(fullscreenChart === chartName ? null : chartName);
  };

  // Handle KPI click
  const handleKPIClick = (kpi, index) => {
    console.log('KPI clicked:', kpi);
    // You can add navigation or modal logic here
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Dashboard Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="inline w-4 h-4 mr-2" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Business Intelligence Dashboard
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                <span>Updates: {updateCount}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    isRealTime ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  <span>{isRealTime ? 'Live' : 'Paused'}</span>
                </div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={toggleRealTime}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isRealTime 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
                disabled={isLoading}
              >
                <RefreshCw className={`inline w-4 h-4 mr-2 ${
                  isRealTime ? 'animate-spin' : ''
                }`} />
                {isRealTime ? 'Real-time On' : 'Real-time Off'}
              </button>
              
              <button
                onClick={refreshData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isLoading}
              >
                <RefreshCw className={`inline w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <div className="relative">
                <select 
                  value={filters.dateRange}
                  onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1month">Last Month</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="1year">Last Year</option>
                </select>
              </div>
              
              <button 
                onClick={handleExportJSON}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isLoading}
              >
                <Download className="inline w-4 h-4 mr-2" />
                Export JSON
              </button>
              
              <button 
                onClick={handleExportCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                disabled={isLoading}
              >
                <Download className="inline w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Chart Visibility Controls */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="font-medium text-gray-700">Show/Hide Charts:</span>
            {Object.entries(visibleCharts).map(([key, visible]) => (
              <button
                key={key}
                onClick={() => setVisibleCharts({...visibleCharts, [key]: !visible})}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  visible 
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        {visibleCharts.kpis && (
          <KPICardsGrid 
            kpis={kpis}
            isLoading={isLoading}
            onKPIClick={handleKPIClick}
          />
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Revenue Chart */}
          {visibleCharts.sales && (
            <ChartContainer
              title="Revenue & Orders Trend"
              type="line"
              data={salesData}
              dataKeys={['revenue', 'orders']}
              xAxisKey="month"
              colors={{
                revenue: '#3b82f6',
                orders: '#10b981'
              }}
              height={300}
              isLoading={isLoading}
              onExport={handleChartExport}
              onRefresh={refreshData}
              isFullscreen={fullscreenChart === 'sales'}
              onToggleFullscreen={() => handleFullscreenToggle('sales')}
            />
          )}

          {/* Traffic Analytics */}
          {visibleCharts.traffic && (
            <ChartContainer
              title="Website Traffic (24h)"
              type="area"
              data={trafficData}
              dataKeys={['visitors']}
              xAxisKey="time"
              colors={{
                visitors: '#8b5cf6'
              }}
              height={300}
              isLoading={isLoading}
              onExport={handleChartExport}
              onRefresh={refreshData}
              isFullscreen={fullscreenChart === 'traffic'}
              onToggleFullscreen={() => handleFullscreenToggle('traffic')}
            />
          )}

          {/* Product Categories */}
          {visibleCharts.products && (
            <ChartContainer
              title="Sales by Category"
              type="pie"
              data={productData}
              dataKeys={['value']}
              height={300}
              isLoading={isLoading}
              onExport={handleChartExport}
              onRefresh={refreshData}
              isFullscreen={fullscreenChart === 'products'}
              onToggleFullscreen={() => handleFullscreenToggle('products')}
            />
          )}

          {/* Customer Metrics */}
          <ChartContainer
            title="Customer Growth"
            type="bar"
            data={salesData}
            dataKeys={['customers']}
            xAxisKey="month"
            colors={{
              customers: '#f59e0b'
            }}
            height={300}
            isLoading={isLoading}
            onExport={handleChartExport}
            onRefresh={refreshData}
            isFullscreen={fullscreenChart === 'customers'}
            onToggleFullscreen={() => handleFullscreenToggle('customers')}
          />
        </div>

        {/* Data Summary Table */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Sales Performance Summary</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversion Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  [...Array(6)].map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-300 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-300 rounded w-12"></div>
                      </td>
                    </tr>
                  ))
                ) : (
                  salesData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${row.revenue?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.orders?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.customers?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.conversion}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Real-Time Business Intelligence Dashboard</p>
          <p>Built with React, Recharts, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;