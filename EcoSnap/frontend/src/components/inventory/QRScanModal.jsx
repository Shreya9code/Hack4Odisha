import { useState } from 'react';
import { X, Truck, Building, AlertCircle, CheckCircle, QrCode } from 'lucide-react';
import { ewasteAPI } from '../../services/api';

const QRScanModal = ({ isOpen, onClose, item, onItemUpdate }) => {
  const [role, setRole] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages
    setError('');
    setSuccess('');

    // Validate form
    if (!role) {
      setError('Please select a role');
      return;
    }

    if (role === 'vendor' && !licenseNo.trim()) {
      setError('License number is required for vendor role');
      return;
    }

    if (role === 'company' && !registrationNo.trim()) {
      setError('Registration number is required for company role');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await ewasteAPI.updateStatusWithRole(
        item.id,
        role,
        role === 'vendor' ? licenseNo : undefined,
        role === 'company' ? registrationNo : undefined
      );

      if (response.success) {
        setSuccess(response.message);

        // Update the item in the parent component
        if (onItemUpdate) {
          const updatedItem = {
            ...item,
            status: response.newStatus === 'In Transit' ? 'in transit' : 'done',
            ...(role === 'vendor' && {
              inTransitBy: 'vendor',
              inTransitAt: new Date().toISOString(),
              inTransitNotes: `Item picked up by vendor (${licenseNo})`
            }),
            ...(role === 'company' && {
              completedBy: 'company',
              completedAt: new Date().toISOString(),
              completionNotes: `Item processed by company (${registrationNo})`
            })
          };
          onItemUpdate(updatedItem);
        }

        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          setRole('');
          setLicenseNo('');
          setRegistrationNo('');
          setSuccess('');
        }, 2000);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRole('');
      setLicenseNo('');
      setRegistrationNo('');
      setError('');
      setSuccess('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden border border-emerald-200">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Update Item Status</h2>
              <p className="text-emerald-100 text-sm">Scan QR and update tracking</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 disabled:opacity-50"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Item Info Card */}
          <div className="mb-6 p-4 bg-white rounded-xl border border-emerald-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-gray-800">Item Details</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-800 truncate max-w-[60%]">{item.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Serial:</span>
                <span className="font-mono font-medium text-emerald-700">{item.serial}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium capitalize text-gray-800">{item.status}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Select Your Role *
              </label>
              <div className="space-y-3">
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="vendor"
                    checked={role === 'vendor'}
                    onChange={(e) => setRole(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    role === 'vendor' 
                      ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-25'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        role === 'vendor' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                      }`}>
                        {role === 'vendor' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 !bg-blue-100 rounded-lg flex items-center justify-center">
                          <Truck className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">Vendor</div>
                          <div className="text-xs text-gray-500">Pick up and transport items</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>

                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="company"
                    checked={role === 'company'}
                    onChange={(e) => setRole(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    role === 'company' 
                      ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-25'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        role === 'company' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                      }`}>
                        {role === 'company' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Building className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">Company</div>
                          <div className="text-xs text-gray-500">Process and complete items</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* License Number (Vendor) */}
            {role === 'vendor' && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  License Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={licenseNo}
                    onChange={(e) => setLicenseNo(e.target.value)}
                    placeholder="Enter your vendor license number"
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Truck className="w-3 h-3 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Number (Company) */}
            {role === 'company' && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Registration Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={registrationNo}
                    onChange={(e) => setRegistrationNo(e.target.value)}
                    placeholder="Enter your company registration number"
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Building className="w-3 h-3 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-start space-x-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-800">Success!</p>
                  <p className="text-sm text-emerald-700 mt-1">{success}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 text-sm font-medium border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !role ||
                  (role === 'vendor' && !licenseNo.trim()) ||
                  (role === 'company' && !registrationNo.trim())
                }
                className="flex-1 px-4 py-3 text-sm font-medium bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QRScanModal;