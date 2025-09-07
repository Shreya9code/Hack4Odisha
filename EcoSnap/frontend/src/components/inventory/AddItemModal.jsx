import { useState } from 'react';
import { 
  X, 
  Upload, 
  Cpu, 
  Smartphone, 
  Monitor, 
  Battery, 
  FlaskRound, 
  Headphones,
  AlertCircle
} from 'lucide-react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

const AddItemModal = ({ isOpen, onClose, onAddItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    category: '',
    department: '',
    quantity: 1,
    status: 'pending',
    hazardous: false,
    notes: ''
  });

  const categories = [
    { id: 'computer', label: 'Computer', icon: Cpu },
    { id: 'mobile', label: 'Mobile Device', icon: Smartphone },
    { id: 'monitor', label: 'Monitor', icon: Monitor },
    { id: 'battery', label: 'Battery', icon: Battery },
    { id: 'lab-equipment', label: 'Lab Equipment', icon: FlaskRound },
    { id: 'accessories', label: 'Accessories', icon: Headphones },
  ];

  const departments = [
    'IT Department',
    'Science Block',
    'Company Office',
    'Computer Lab',
    'Library',
    'Classroom'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      ...formData,
      id: Date.now().toString(),
      dateAdded: new Date().toLocaleDateString()
    };
    onAddItem(newItem);
    onClose();
    setFormData({
      name: '',
      model: '',
      category: '',
      department: '',
      quantity: 1,
      status: 'pending',
      hazardous: false,
      notes: ''
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Add New E-Waste Item
              </DialogTitle>
              <button
                onClick={onClose}
                className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Dell Laptop"
                  />
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model/Serial Number
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Latitude E5450"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <label
                          key={category.id}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            formData.category === category.id
                              ? 'border-blue-500 !bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="category"
                            value={category.id}
                            checked={formData.category === category.id}
                            onChange={handleChange}
                            required
                            className="sr-only"
                          />
                          <IconComponent className="w-4 h-4 mr-2 text-gray-600" />
                          <span className="text-sm">{category.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending Pickup</option>
                    <option value="processing">In Process</option>
                    <option value="recycled">Recycled</option>
                  </select>
                </div>
              </div>

              {/* Hazardous Material */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hazardous"
                  name="hazardous"
                  checked={formData.hazardous}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="hazardous" className="ml-2 flex items-center text-sm text-gray-700">
                  <AlertCircle className="w-4 h-4 mr-1 text-yellow-500" />
                  Contains hazardous materials
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional information about this item..."
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 !bg-gray-100 rounded-lg hover:!bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white !bg-blue-600 rounded-lg hover:!bg-blue-700 transition-colors flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Add Item
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default AddItemModal;