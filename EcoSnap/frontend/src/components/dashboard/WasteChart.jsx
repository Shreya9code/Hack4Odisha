import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WasteChart = () => {
  const [activeTab, setActiveTab] = useState('trends');

  const trendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Collected',
        data: [120, 150, 180, 90, 130, 200, 240, 190],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: 'Recycled',
        data: [80, 100, 120, 70, 110, 150, 180, 160],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderRadius: 4,
      }
    ],
  };

  const categoriesData = {
    labels: ['Computers', 'Mobile Devices', 'Monitors', 'Lab Equipment', 'Batteries', 'Accessories'],
    datasets: [
      {
        data: [35, 25, 15, 12, 8, 5],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ],
        borderWidth: 0,
      },
    ],
  };

  const departmentData = {
    labels: ['IT Dept', 'Science Block', 'Company', 'Library', 'Classrooms'],
    datasets: [
      {
        label: 'E-Waste Contribution',
        data: [45, 25, 15, 10, 5],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
    cutout: '70%',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">E-Waste Analytics</h3>
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          {['trends', 'categories', 'departments'].map((tab) => (
            <button
              key={tab}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        {activeTab === 'trends' && (
          <Bar data={trendsData} options={options} />
        )}
        {activeTab === 'categories' && (
          <div className="flex items-center justify-center h-full">
            <div className="w-64">
              <Doughnut data={categoriesData} options={doughnutOptions} />
            </div>
          </div>
        )}
        {activeTab === 'departments' && (
          <Line data={departmentData} options={options} />
        )}
      </div>
    </div>
  );
};

export default WasteChart;