import React from 'react';
import { DollarSign, ShoppingCart, Users, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Icon mapping for KPI cards
 */
const iconMap = {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown
};

/**
 * KPI Card Component
 * @param {Object} props - Component props
 * @param {string} props.title - KPI title
 * @param {string} props.value - KPI value
 * @param {string} props.change - Change percentage
 * @param {string} props.trend - Trend direction ('up' or 'down')
 * @param {string} props.icon - Icon name
 * @param {string} props.color - Text color class
 * @param {string} props.bgColor - Background color class
 * @param {boolean} props.isLoading - Loading state
 * @param {Function} props.onClick - Click handler
 * @returns {JSX.Element}
 */
const KPICard = ({
  title,
  value,
  change,
  trend = 'up',
  icon = 'TrendingUp',
  color = 'text-blue-600',
  bgColor = 'bg-blue-100',
  isLoading = false,
  onClick
}) => {
  const IconComponent = iconMap[icon] || TrendingUp;
  const isPositiveTrend = trend === 'up';

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${bgColor} opacity-50`}>
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
          </div>
          <div className="w-16 h-4 bg-gray-300 rounded"></div>
        </div>
        <div>
          <div className="w-20 h-8 bg-gray-300 rounded mb-2"></div>
          <div className="w-24 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
      role={onClick ? 'button' : 'presentation'}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${bgColor} transition-all duration-300 hover:scale-110`}>
          <IconComponent className={`w-6 h-6 ${color}`} />
        </div>
        <div className={`text-sm font-medium flex items-center gap-1 ${
          isPositiveTrend ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositiveTrend ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {change}
        </div>
      </div>
      
      <div>
        <div className="text-2xl font-bold text-gray-900 mb-1 transition-all duration-300">
          {value}
        </div>
        <div className="text-sm text-gray-600 font-medium">
          {title}
        </div>
      </div>
      
      {/* Optional trend indicator */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>vs last period</span>
          <div className={`flex items-center gap-1 ${
            isPositiveTrend ? 'text-green-600' : 'text-red-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isPositiveTrend ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}></div>
            <span className="font-medium">
              {isPositiveTrend ? 'Improving' : 'Declining'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * KPI Cards Grid Component
 * @param {Object} props - Component props
 * @param {Array} props.kpis - Array of KPI objects
 * @param {boolean} props.isLoading - Loading state
 * @param {Function} props.onKPIClick - KPI click handler
 * @returns {JSX.Element}
 */
export const KPICardsGrid = ({ kpis = [], isLoading = false, onKPIClick }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <KPICard key={index} isLoading={true} />
        ))}
      </div>
    );
  }

  if (!kpis.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="col-span-full bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="text-gray-500 text-lg">No KPI data available</div>
          <div className="text-gray-400 text-sm mt-2">
            Check your data connection or refresh the dashboard
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <KPICard
          key={kpi.title || index}
          title={kpi.title}
          value={kpi.value}
          change={kpi.change}
          trend={kpi.trend}
          icon={kpi.icon}
          color={kpi.color}
          bgColor={kpi.bgColor}
          onClick={onKPIClick ? () => onKPIClick(kpi, index) : undefined}
        />
      ))}
    </div>
  );
};

export default KPICard;