import { useState } from 'react';
import { 
  Filter, 
  X, 
  AlertTriangle, 
  Recycle, 
  RefreshCw,
  Search
} from 'lucide-react';

const CategoryFilter = ({ onFilterChange, onSearch }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Items', icon: Filter, color: 'text-gray-600' },
    { id: 'hazardous', label: 'Hazardous', icon: AlertTriangle, color: 'text-red-600' },
    { id: 'recyclable', label: 'Recyclable', icon: Recycle, color: 'text-green-600' },
    { id: 'reusable', label: 'Reusable', icon: RefreshCw, color: 'text-blue-600' },
  ];

  const statusOptions = [
    { id: 'all', label: 'All Status' },
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'recycled', label: 'Recycled' },
  ];

  const handleCategoryToggle = (categoryId) => {
    let newCategories;
    if (categoryId === 'all') {
      newCategories = ['all'];
    } else {
      newCategories = selectedCategories.includes(categoryId)
        ? selectedCategories.filter(id => id !== categoryId)
        : [...selectedCategories.filter(id => id !== 'all'), categoryId];
      
      if (newCategories.length === 0) newCategories = ['all'];
    }
    
    setSelectedCategories(newCategories);
    onFilterChange({ categories: newCategories });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const clearFilters = () => {
    setSelectedCategories(['all']);
    setSearchQuery('');
    onFilterChange({ categories: ['all'] });
    onSearch('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search items by name, model, or department..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          <X className="w-4 h-4 mr-1" />
          Clear Filters
        </button>
      </div>

      {/* Category Filters */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filter by Category
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategories.includes(category.id);
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryToggle(category.id)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? '!bg-blue-100 text-blue-700 border border-blue-200'
                    : '!bg-gray-100 text-gray-700 hover:!bg-gray-200 border border-gray-200'
                }`}
              >
                <IconComponent className={`w-4 h-4 mr-2 ${category.color}`} />
                {category.label}
                {isSelected && category.id !== 'all' && (
                  <X className="w-3 h-3 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filters */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Status</h3>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <button
              key={status.id}
              className="px-4 py-2 !bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 border border-gray-200 transition-colors"
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Indicator */}
      {selectedCategories.length > 0 && (
        <div className="mt-4 flex items-center">
          <span className="text-xs text-gray-500 mr-2">
            Active filters: {selectedCategories.filter(cat => cat !== 'all').join(', ')}
          </span>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;