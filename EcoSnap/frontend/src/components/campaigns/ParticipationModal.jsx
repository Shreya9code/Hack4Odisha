import { useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Users,
  Award,
  CheckCircle,
  User,
  Mail,
  Phone,
  Building
} from 'lucide-react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { format } from 'date-fns';

const ParticipationModal = ({ isOpen, onClose, campaign, onParticipate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    participationType: 'individual',
    teamName: '',
    teamMembers: '',
    notes: ''
  });

  const departments = [
    'IT Department',
    'Science Department',
    'Company',
    'Student',
    'Faculty',
    'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onParticipate({
      ...formData,
      campaignId: campaign.id,
      participationDate: new Date().toISOString()
    });
    onClose();
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      department: '',
      participationType: 'individual',
      teamName: '',
      teamMembers: '',
      notes: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
            {/* Header */}
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-white text-center">
                  <Award className="w-8 h-8 mx-auto mb-2" />
                  <h2 className="text-xl font-bold">Join Campaign</h2>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Campaign Info */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{campaign.title}</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  {format(new Date(campaign.startDate), 'MMM dd, yyyy')}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" />
                  {campaign.location}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-green-500" />
                  {campaign.currentParticipants} participants
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-2 text-yellow-500" />
                  {campaign.difficulty}
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department/Group *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Participation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Participation Type *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                    <input
                      type="radio"
                      name="participationType"
                      value="individual"
                      checked={formData.participationType === 'individual'}
                      onChange={handleChange}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900">Individual</span>
                  </label>
                  
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                    <input
                      type="radio"
                      name="participationType"
                      value="team"
                      checked={formData.participationType === 'team'}
                      onChange={handleChange}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900">Team</span>
                  </label>
                </div>
              </div>

              {/* Team Fields */}
              {formData.participationType === 'team' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team Name
                    </label>
                    <input
                      type="text"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter team name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team Members
                    </label>
                    <input
                      type="number"
                      name="teamMembers"
                      value={formData.teamMembers}
                      onChange={handleChange}
                      min="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Number of members"
                    />
                  </div>
                </div>
              )}

              {/* Additional Notes */}
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
                  placeholder="Any special requirements or comments..."
                />
              </div>

              {/* Terms */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to participate in this campaign and will follow all guidelines
                </label>
              </div>
            </form>

            {/* Footer Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Participation
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ParticipationModal;