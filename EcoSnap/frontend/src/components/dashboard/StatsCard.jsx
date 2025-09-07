import { TrendingUp, TrendingDown, Box, Recycle, Calendar, Users } from 'lucide-react';

const StatsCard = ({ title, value, change, icon, trend = 'up' }) => {
  const IconComponent = {
    'box': Box,
    'recycle': Recycle,
    'calendar': Calendar,
    'users': Users
  }[icon] || Box;

  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  const bgColor = trend === 'up' ? 'bg-green-100' : 'bg-red-100';
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          <div className="flex items-center mt-2">
            {trend === 'up' ? (
              <TrendingUp className={`w-4 h-4 ${trendColor} mr-1`} />
            ) : (
              <TrendingDown className={`w-4 h-4 ${trendColor} mr-1`} />
            )}
            <span className={`text-sm ${trendColor}`}>{change}</span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center`}>
          <IconComponent className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;