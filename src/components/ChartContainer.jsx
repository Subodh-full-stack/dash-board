import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { Filter, Download, Maximize2, Minimize2, RefreshCw } from 'lucide-react';

/**
 * Custom Tooltip Component
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * Chart Container Component
 * @param {Object} props - Component props
 * @param {string} props.title - Chart title
 * @param {string} props.type - Chart type ('line', 'area', 'bar', 'pie')
 * @param {Array} props.data - Chart data
 * @param {Array} props.dataKeys - Data keys to display
 * @param {Object} props.colors - Color configuration
 * @param {number} props.height - Chart height
 * @param {boolean} props.isLoading - Loading state
 * @param {Function} props.onExport - Export handler
 * @param {Function} props.onRefresh - Refresh handler
 * @param {boolean} props.showFilters - Show filter controls
 * @param {boolean} props.isFullscreen - Fullscreen state
 * @param {Function} props.onToggleFullscreen - Toggle fullscreen
 * @returns {JSX.Element}
 */
const ChartContainer = ({
  title,
  type = 'line',
  data = [],
  dataKeys = [],
  colors = {},
  height = 300,
  isLoading = false,
  onExport,
  onRefresh,
  showFilters = true,
  isFullscreen = false,
  onToggleFullscreen,
  xAxisKey = 'name',
  showLegend = true,
  showGrid = true,
  className = ''
}) => {
  const [selectedFilters, setSelectedFilters] = useState({});

  // Default colors
  const defaultColors = {
    primary: '#3b82f6',
    secondary: '#10b981',
    tertiary: '#f59e0b',
    quaternary: '#ef4444',
    ...colors
  };

  // Filter data based on selected filters
  const filteredData = data.filter(item => {
    return Object.entries(selectedFilters).every(([key, value]) => {
      if (!value || value === 'all') return true;
      return item[key] === value;
    });
  });

  // Loading state
  if (isLoading) {
    return (
      <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 ${className}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="w-48 h-6 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-24 h-6 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="w-full bg-gray-200 rounded animate-pulse" style={{ height: height }}>
          <div className="flex items-center justify-center h-full">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!data || data.length === 0) {
    return (
      <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 ${className}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <div className="flex gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <div 
          className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-500"
          style={{ height: height }}
        >
          <div className="text-center">
            <div className="text-lg font-medium">No data available</div>
            <div className="text-sm mt-1">Check your data source or try refreshing</div>
          </div>
        </div>
      </div>
    );
  }

  // Render chart based on type
  const renderChart = () => {
    const commonProps = {
      data: filteredData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis dataKey={xAxisKey} stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={Object.values(defaultColors)[index % Object.values(defaultColors).length]}
                strokeWidth={2}
                dot={{ fill: Object.values(defaultColors)[index % Object.values(defaultColors).length], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: Object.values(defaultColors)[index % Object.values(defaultColors).length], strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis dataKey={xAxisKey} stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId={1}
                stroke={Object.values(defaultColors)[index % Object.values(defaultColors).length]}
                fill={Object.values(defaultColors)[index % Object.values(defaultColors).length]}
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis dataKey={xAxisKey} stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={Object.values(defaultColors)[index % Object.values(defaultColors).length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              paddingAngle={5}
              dataKey={dataKeys[0] || 'value'}
            >
              {filteredData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || Object.values(defaultColors)[index % Object.values(defaultColors).length]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
          </PieChart>
        );

      default:
        return <div>Unsupported chart type: {type}</div>;
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${isFullscreen ? 'fixed inset-4 z-50' : 'p-6'} ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 p-6">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-2">
          {showFilters && (
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}
          {onExport && (
            <button
              onClick={() => onExport(filteredData, title)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Export data"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className={isFullscreen ? 'p-6 h-full' : ''}>
        <ResponsiveContainer 
          width="100%" 
          height={isFullscreen ? '90%' : height}
        >
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Chart Info */}
      <div className="mt-4 pt-4 border-t border-gray-100 px-6 pb-6">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>
            Showing {filteredData.length} of {data.length} data points
          </span>
          <span>
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;