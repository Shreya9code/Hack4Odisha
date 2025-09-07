import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Admin Dashboard Component (for company users)
function CompanyDashboard() {
  const [systemStats] = useState({
    totalUsers: 1247,
    totalDonations: 8923,
    totalVendors: 45,
    totalRevenue: '$45,230',
    activeCampaigns: 8,
    complianceRate: '94.2%'
  });

  const [topVendors] = useState([
    { id: 1, name: 'EcoTech Solutions', pickups: 234, rating: 4.8, revenue: '$8,450' },
    { id: 2, name: 'Green Recycling Co.', pickups: 189, rating: 4.6, revenue: '$6,230' },
    { id: 3, name: 'Sustainable Waste', pickups: 156, rating: 4.9, revenue: '$5,890' },
  ]);

  /*const [pendingPickups] = useState([
    { id: 1, item: 'Laptop', donor: 'John Doe', location: 'IT Department', priority: 'High', time: '2 hours ago' },
    { id: 2, item: 'Monitor', donor: 'Jane Smith', location: 'Science Block', priority: 'Medium', time: '4 hours ago' },
    { id: 3, item: 'Printer', donor: 'Mike Johnson', location: 'Admin Office', priority: 'Low', time: '6 hours ago' },
  ]);

  const [processingItems] = useState([
    { id: 1, item: 'Desktop Computer', weight: '5.2 kg', status: 'Disassembly', progress: 75 },
    { id: 2, item: 'Mobile Phones', weight: '0.8 kg', status: 'Testing', progress: 45 },
    { id: 3, item: 'Batteries', weight: '2.1 kg', status: 'Recycling', progress: 90 },
  ]);*/

  const recentActivity = [
    { id: 1, type: 'Item', user: 'vendor', action: 'Accepted e-waste item #EW001', time: '5 minutes ago' },
    { id: 2, type: 'Item', user: 'donor', action: 'Submitted new e-waste item', time: '15 minutes ago' },
    { id: 3, type: 'Campaign', user: 'admin', action: 'Launched "Green January" campaign', time: '1 hour ago' },
    { id: 4, type: 'Item', user: 'vendor', action: 'Picked up item #EW002', time: '2 hours ago' },
    { id: 5, type: 'Item', user: 'admin', action: 'Completed processing item #EW003', time: '3 hours ago' }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Administrator!</h1>
        <p className="text-gray-600">Here's what's happening with your e-waste management system today.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/analytics"
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-purple-600 text-xl">📊</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600">View system metrics</p>
            </div>
          </div>
        </Link>

        <Link
          to="/campaigns"
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-pink-600 text-xl">🎯</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Campaigns</h3>
              <p className="text-sm text-gray-600">Manage initiatives</p>
            </div>
          </div>
        </Link>

        <Link
          to="/compliance"
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-indigo-600 text-xl">📋</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Compliance</h3>
              <p className="text-sm text-gray-600">Monitor regulations</p>
            </div>
          </div>
        </Link>

        <Link
          to="/users"
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-teal-600 text-xl">👥</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Users</h3>
              <p className="text-sm text-gray-600">Manage accounts</p>
            </div>
          </div>
        </Link>
      </div>

      {/* System Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalDonations}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-emerald-600 text-xl">♻</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalVendors}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">🏭</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalRevenue}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 text-xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.activeCampaigns}</p>
            </div>
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <span className="text-pink-600 text-xl">🎯</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.complianceRate}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Top Vendors */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activity.type === 'New User' ? 'bg-green-100' :
                    activity.type === 'Pickup' ? 'bg-blue-100' :
                    activity.type === 'Campaign' ? 'bg-pink-100' :
                    'bg-purple-100'
                  }`}>
                    <span className={`text-sm ${
                      activity.type === 'New User' ? 'text-green-600' :
                      activity.type === 'Pickup' ? 'text-blue-600' :
                      activity.type === 'Campaign' ? 'text-pink-600' :
                      'text-purple-600'
                    }`}>
                      {activity.type === 'New User' ? '👤' :
                       activity.type === 'Pickup' ? '📦' :
                       activity.type === 'Campaign' ? '🎯' : '⚙'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Vendors */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Vendors</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {topVendors.map((vendor, index) => (
                <div key={vendor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-sm font-bold">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{vendor.name}</p>
                      <p className="text-sm text-gray-600">{vendor.pickups} pickups • ⭐ {vendor.rating}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{vendor.revenue}</p>
                    <p className="text-xs text-gray-600">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
        </div>
        <div className="p-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 text-2xl">✅</span>
              </div>
              <p className="font-semibold text-gray-900">Database</p>
              <p className="text-sm text-green-600">Healthy</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 text-2xl">✅</span>
              </div>
              <p className="font-semibold text-gray-900">API Services</p>
              <p className="text-sm text-green-600">Online</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-yellow-600 text-2xl">⚠</span>
              </div>
              <p className="font-semibold text-gray-900">Storage</p>
              <p className="text-sm text-yellow-600">75% Used</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 text-2xl">✅</span>
              </div>
              <p className="font-semibold text-gray-900">Security</p>
              <p className="text-sm text-green-600">Protected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Donor Dashboard Component
function DonorDashboard() {
  const [recentDonations] = useState([
    { id: 1, item: 'Laptop', status: 'Picked up', date: '2024-01-15', weight: '2.5 kg' },
    { id: 2, item: 'Mobile Phone', status: 'In transit', date: '2024-01-14', weight: '0.2 kg' },
    { id: 3, item: 'Printer', status: 'Processing', date: '2024-01-13', weight: '8.0 kg' },
  ]);

  const [stats] = useState({
    totalDonations: 24,
    itemsRecycled: 18,
    co2Saved: '12.5 kg',
    activePickups: 2
  });

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Donor!</h1>
        <p className="text-emerald-100">Thank you for contributing to a sustainable future through e-waste recycling.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/qr-generator"
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-emerald-600 text-xl">📱</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Generate QR</h3>
              <p className="text-sm text-gray-600">Create labels for new items</p>
            </div>
          </div>
        </Link>

        <Link
          to="/inventory"
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-purple-600 text-xl">📦</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">My Inventory</h3>
              <p className="text-sm text-gray-600">View all your donations</p>
            </div>
          </div>
        </Link>

        <Link
          to="/campaigns"
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-orange-600 text-xl">🎯</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Campaigns</h3>
              <p className="text-sm text-gray-600">Join recycling initiatives</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-emerald-600 text-xl">♻</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Items Recycled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.itemsRecycled}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CO₂ Saved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.co2Saved}</p>
            </div>
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <span className="text-teal-600 text-xl">🌱</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Pickups</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activePickups}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">🚚</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Donations</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {recentDonations.map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-emerald-600 text-sm">📱</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{donation.item}</p>
                    <p className="text-sm text-gray-600">{donation.date} • {donation.weight}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  donation.status === 'Picked up' ? 'bg-green-100 text-green-800' :
                  donation.status === 'In transit' ? 'bg-blue-100 text-blue-800' :
                  donation.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {donation.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Vendor Dashboard Component
function VendorDashboard() {
  const [pendingPickups] = useState([
    { id: 1, donor: 'John Doe', item: 'Laptop', address: '123 Main St, City', date: '2024-01-16', priority: 'High' },
    { id: 2, donor: 'Jane Smith', item: 'Printer', address: '456 Oak Ave, Town', date: '2024-01-17', priority: 'Medium' },
    { id: 3, donor: 'Mike Johnson', item: 'Mobile Phone', address: '789 Pine Rd, Village', date: '2024-01-18', priority: 'Low' },
  ]);

  const [processingItems] = useState([
    { id: 1, item: 'Desktop Computer', status: 'Disassembling', progress: 75, weight: '5.2 kg' },
    { id: 2, item: 'Monitor', status: 'Testing', progress: 45, weight: '3.8 kg' },
    { id: 3, item: 'Keyboard', status: 'Cleaning', progress: 90, weight: '0.5 kg' },
  ]);

  const [stats] = useState({
    totalPickups: 156,
    itemsProcessed: 142,
    revenue: '$2,450',
    activePickups: 8
  });

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Vendor!</h1>
        <p className="text-blue-100">Manage your e-waste collection and processing operations efficiently.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/inventory"
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-600 text-xl">📦</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Inventory</h3>
              <p className="text-sm text-gray-600">Manage collected items</p>
            </div>
          </div>
        </Link>

        <Link
          to="/analytics"
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-purple-600 text-xl">📊</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600">View performance data</p>
            </div>
          </div>
        </Link>


      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pickups</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPickups}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">🚚</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Items Processed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.itemsProcessed}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">⚙</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{stats.revenue}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 text-xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Pickups</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activePickups}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-indigo-600 text-xl">📋</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pending Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Pending Items</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {pendingPickups.map((pickup) => (
              <div key={pickup.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm">📦</span>
        </div>
        <div>
                    <p className="font-medium text-gray-900">{pickup.item}</p>
                    <p className="text-sm text-gray-600">{pickup.donor} • {pickup.location}</p>
                    <p className="text-xs text-gray-500">Requested: {pickup.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pickup.priority === 'High' ? 'bg-red-100 text-red-800' :
                    pickup.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {pickup.priority}
                  </span>
                  <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Processing Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Currently Processing</h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {processingItems.map((item) => (
              <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-green-600 text-sm">⚙</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.item}</p>
                      <p className="text-sm text-gray-600">{item.weight}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    {item.status}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.progress}% complete</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
const Dashboard = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  // Show loading while determining role
  if (!userRole) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Render appropriate dashboard based on user role
  switch (userRole) {
    case 'company':
      return <CompanyDashboard />;
    case 'donor':
      return <DonorDashboard />;
    case 'vendor':
      return <VendorDashboard />;
    default:
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Invalid user role. Please contact support.</p>
          </div>
    </div>
  );
  }
};

export default Dashboard;
