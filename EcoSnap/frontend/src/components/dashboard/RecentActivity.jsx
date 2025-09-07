import { useState } from 'react';
import { 
  Plus, 
  Recycle, 
  Truck, 
  QrCode, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react';

const RecentActivity = () => {
  const [filter, setFilter] = useState('all');

  const activities = [
    {
      id: 1,
      type: 'addition',
      title: 'New item added',
      description: '5 Laptops from IT Department',
      time: '2 hours ago',
      icon: Plus,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 2,
      type: 'recycling',
      title: 'Recycling completed',
      description: '20 Mobile phones processed',
      time: '5 hours ago',
      icon: Recycle,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 3,
      type: 'pickup',
      title: 'Item accepted',
      description: 'Lab equipment from Science Block',
      time: 'Yesterday',
      icon: Truck,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      id: 4,
      type: 'qr',
      title: 'QR codes generated',
      description: 'For 15 new inventory items',
      time: '2 days ago',
      icon: QrCode,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 5,
      type: 'alert',
      title: 'Maintenance required',
      description: 'Battery disposal unit needs service',
      time: '3 days ago',
      icon: AlertCircle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  const filterOptions = [
    { value: 'all', label: 'All Activities', icon: Clock },
    { value: 'addition', label: 'Additions', icon: Plus },
    { value: 'recycling', label: 'Recycling', icon: Recycle },
    { value: 'pickup', label: 'Acceptances', icon: Truck },
    { value: 'qr', label: 'QR Codes', icon: QrCode },
    { value: 'alert', label: 'Alerts', icon: AlertCircle },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Recent Activity</h3>
        <div className="flex space-x-1">
          {filterOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.value}
                className={`p-2 rounded-lg transition-colors flex items-center ${
                  filter === option.value
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setFilter(option.value)}
                title={option.label}
              >
                <IconComponent className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {filteredActivities.map((activity) => {
          const IconComponent = activity.icon;
          return (
            <div key={activity.id} className="flex items-start group hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className={`w-10 h-10 rounded-full ${activity.bgColor} flex items-center justify-center mt-1 flex-shrink-0`}>
                <IconComponent className={`w-5 h-5 ${activity.iconColor}`} />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                <div className="flex items-center mt-1">
                  <Clock className="w-3 h-3 text-gray-400 mr-1" />
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity p-1">
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No activities found</p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t">
        <button className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center">
          <Calendar className="w-4 h-4 mr-2" />
          View All Activities
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;