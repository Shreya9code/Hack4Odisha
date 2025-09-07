import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Filter,
  Download,
  Calendar,
  Eye,
  RefreshCw,
  Recycle,
  Leaf,
  Battery,
  Cpu,
  Smartphone,
  Cloud,
  Zap,
  Droplets
} from 'lucide-react';
//import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('last-6-months');
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data - in a real app, this would come from your backend
  const wasteTrends = [
    { month: 'Jan', collected: 1200, recycled: 800, hazardous: 150 },
    { month: 'Feb', collected: 1350, recycled: 950, hazardous: 180 },
    { month: 'Mar', collected: 1100, recycled: 750, hazardous: 130 },
    { month: 'Apr', collected: 1650, recycled: 1200, hazardous: 210 },
    { month: 'May', collected: 1800, recycled: 1400, hazardous: 250 },
    { month: 'Jun', collected: 1950, recycled: 1600, hazardous: 280 },
    { month: 'Jul', collected: 2100, recycled: 1750, hazardous: 310 },
    { month: 'Aug', collected: 2250, recycled: 1900, hazardous: 340 },
    { month: 'Sep', collected: 2400, recycled: 2050, hazardous: 370 }
  ];

  const categoryData = [
    { name: 'Computers', value: 35, color: '#10B981' },
    { name: 'Mobile Devices', value: 25, color: '#3B82F6' },
    { name: 'Monitors', value: 15, color: '#F59E0B' },
    { name: 'Lab Equipment', value: 12, color: '#8B5CF6' },
    { name: 'Batteries', value: 8, color: '#EC4899' },
    { name: 'Accessories', value: 5, color: '#6B7280' }
  ];

  const departmentData = [
    { name: 'IT Department', value: 45, color: '#3B82F6' },
    { name: 'Science Block', value: 25, color: '#10B981' },
    { name: 'Company Office', value: 15, color: '#F59E0B' },
    { name: 'Library', value: 10, color: '#8B5CF6' },
    { name: 'Classrooms', value: 5, color: '#EC4899' }
  ];

  const environmentalImpact = [
    { month: 'Jan', co2: 1200, water: 800, energy: 1500 },
    { month: 'Feb', co2: 1150, water: 750, energy: 1450 },
    { month: 'Mar', co2: 1100, water: 700, energy: 1400 },
    { month: 'Apr', co2: 1050, water: 650, energy: 1350 },
    { month: 'May', co2: 1000, water: 600, energy: 1300 },
    { month: 'Jun', co2: 950, water: 550, energy: 1250 },
    { month: 'Jul', co2: 900, water: 500, energy: 1200 },
    { month: 'Aug', co2: 850, water: 450, energy: 1150 },
    { month: 'Sep', co2: 800, water: 400, energy: 1100 }
  ];

  const complianceData = [
    { month: 'Jan', rate: 82 },
    { month: 'Feb', rate: 85 },
    { month: 'Mar', rate: 88 },
    { month: 'Apr', rate: 90 },
    { month: 'May', rate: 92 },
    { month: 'Jun', rate: 94 },
    { month: 'Jul', rate: 95 },
    { month: 'Aug', rate: 96 },
    { month: 'Sep', rate: 97 }
  ];

  // Key metrics
  const metrics = {
    totalCollected: 15700,
    recyclingRate: 83,
    co2Reduced: 8500, // in kg
    waterSaved: 4500, // in liters
    energySaved: 11000, // in kWh
    complianceRate: 97
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name === 'complianceRate' ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
          <p className="text-gray-600">Deep data insights and environmental impact reports</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="last-3-months">Last 3 Months</option>
            <option value="last-6-months">Last 6 Months</option>
            <option value="last-year">Last Year</option>
            <option value="ytd">Year to Date</option>
            <option value="custom">Custom Range</option>
          </select>
          
          <button className="flex items-center px-4 py-2 !bg-blue-600 text-white rounded-lg hover:!bg-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-5">
        <div className="!bg-white p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Collected</p>
              <h3 className="text-2xl font-bold text-gray-800">{metrics.totalCollected.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 !bg-blue-100 rounded-full flex items-center justify-center">
              <Cpu className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            +12% from last period
          </p>
        </div>
        
        <div className="!bg-white p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Recycling Rate</p>
              <h3 className="text-2xl font-bold text-gray-800">{metrics.recyclingRate}%</h3>
            </div>
            <div className="w-12 h-12 !bg-green-100 rounded-full flex items-center justify-center">
              <Recycle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            +5% from last period
          </p>
        </div>
        
        <div className="!bg-white p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">CO₂ Reduced</p>
              <h3 className="text-2xl font-bold text-gray-800">{metrics.co2Reduced} kg</h3>
            </div>
            <div className="w-12 h-12 !bg-yellow-100 rounded-full flex items-center justify-center">
              <Cloud className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            Equivalent to 180 trees
          </p>
        </div>
        
        <div className="!bg-white p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Water Saved</p>
              <h3 className="text-2xl font-bold text-gray-800">{metrics.waterSaved} L</h3>
            </div>
            <div className="w-12 h-12 !bg-blue-100 rounded-full flex items-center justify-center">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            +15% from last period
          </p>
        </div>
        
        <div className="!bg-white p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Energy Saved</p>
              <h3 className="text-2xl font-bold text-gray-800">{metrics.energySaved} kWh</h3>
            </div>
            <div className="w-12 h-12 !bg-purple-100 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            Powers 12 homes for a month
          </p>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Compliance Rate</p>
              <h3 className="text-2xl font-bold text-gray-800">{metrics.complianceRate}%</h3>
            </div>
            <div className="w-12 h-12 !bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            +3% from last period
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['overview', 'environmental', 'trends', 'department', 'category'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="!bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">E-Waste Collection Trends</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={wasteTrends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="collected" fill="#3B82F6" name="Collected" />
                      <Bar dataKey="recycled" fill="#10B981" name="Recycled" />
                      <Bar dataKey="hazardous" fill="#F59E0B" name="Hazardous" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="!bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Rate Trend</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={complianceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="rate" stroke="#8B5CF6" name="Compliance Rate %" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Environmental Impact Tab */}
          {activeTab === 'environmental' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="!bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Impact Reduction</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={environmentalImpact} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area type="monotone" dataKey="co2" stackId="1" stroke="#EF4444" fill="#FECACA" name="CO₂ Reduced (kg)" />
                      <Area type="monotone" dataKey="water" stackId="1" stroke="#3B82F6" fill="#BFDBFE" name="Water Saved (L)" />
                      <Area type="monotone" dataKey="energy" stackId="1" stroke="#10B981" fill="#A7F3D0" name="Energy Saved (kWh)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="!bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Impact Summary</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                          <Cloud className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold">Carbon Footprint Reduction</p>
                          <p className="text-sm text-gray-600">Equivalent to planting 180 trees</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-2xl">{metrics.co2Reduced} kg</p>
                        <p className="text-sm text-green-600">CO₂ saved</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <Droplets className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold">Water Conservation</p>
                          <p className="text-sm text-gray-600">Equivalent to 15,000 showers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-2xl">{metrics.waterSaved} L</p>
                        <p className="text-sm text-green-600">Water saved</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <Zap className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold">Energy Savings</p>
                          <p className="text-sm text-gray-600">Powers 12 homes for a month</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-2xl">{metrics.energySaved} kWh</p>
                        <p className="text-sm text-green-600">Energy saved</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div className="grid grid-cols-1 gap-6">
              <div className="!bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Collection Trends</h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={wasteTrends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="collected" stroke="#3B82F6" name="Collected" strokeWidth={2} />
                      <Line type="monotone" dataKey="recycled" stroke="#10B981" name="Recycled" strokeWidth={2} />
                      <Line type="monotone" dataKey="hazardous" stroke="#F59E0B" name="Hazardous" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-3">Projected Growth</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Collection Rate</span>
                      <span className="font-semibold text-green-600">+15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recycling Efficiency</span>
                      <span className="font-semibold text-green-600">+8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hazardous Handling</span>
                      <span className="font-semibold text-green-600">+12%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-3">Seasonal Trends</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Q1 (Jan-Mar)</span>
                      <span className="font-semibold">18% of annual total</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Q2 (Apr-Jun)</span>
                      <span className="font-semibold">25% of annual total</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Q3 (Jul-Sep)</span>
                      <span className="font-semibold">32% of annual total</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Q4 (Oct-Dec)</span>
                      <span className="font-semibold">25% of annual total</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Department Analysis Tab */}
          {activeTab === 'department' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="!bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">E-Waste by Department</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="!bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
                <div className="space-y-4">
                  {departmentData.map((dept, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{dept.name}</span>
                        <span className="text-sm px-2 py-1 !bg-blue-100 text-blue-800 rounded-full">
                          {dept.value}% of total
                        </span>
                      </div>
                      <div className="w-full !bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${dept.value}%`, backgroundColor: dept.color }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Recycling Rate: {85 + index * 3}%</span>
                        <span>Compliance: {90 + index * 2}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Category Analysis Tab */}
          {activeTab === 'category' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="!bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">E-Waste by Category</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="!bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Insights</h3>
                <div className="space-y-4">
                  {categoryData.map((category, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-2">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="font-semibold">{category.name}</span>
                        <span className="ml-auto text-sm text-gray-500">{category.value}% of total</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Recycling Rate</p>
                          <p className="font-semibold">{75 + index * 4}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Hazardous Content</p>
                          <p className="font-semibold">{index * 5 + 10}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Monthly Avg.</p>
                          <p className="font-semibold">{Math.round((category.value / 100) * 1800)} units</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Value Recovery</p>
                          <p className="font-semibold">Rs{index * 50 + 100}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Insights Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 !bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-semibold">Positive Trend</span>
            </div>
            <p className="text-sm text-gray-700">
              Recycling rates have increased by 15% over the last 6 months, exceeding targets.
            </p>
          </div>

          <div className="p-4 !bg-yellow-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Eye className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="font-semibold">Area to Watch</span>
            </div>
            <p className="text-sm text-gray-700">
              Hazardous waste from the Science Department has increased by 8% month-over-month.
            </p>
          </div>

          <div className="p-4 !bg-green-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Leaf className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-semibold">Environmental Impact</span>
            </div>
            <p className="text-sm text-gray-700">
              Your efforts have saved approximately 180 trees worth of CO₂ emissions this year.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;