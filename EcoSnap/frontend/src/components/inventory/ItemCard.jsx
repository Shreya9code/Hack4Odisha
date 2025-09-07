import { useState } from 'react';
import { 
  Cpu, 
  Smartphone, 
  Monitor, 
  Battery, 
  FlaskRound, 
  Headphones,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  QrCode,
  CheckCircle,
  Clock,
  AlertTriangle,
  Check,
  User,
  Truck,
  Scan,
  Building
} from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ewasteAPI } from '../../services/api';
import { useUser } from '@clerk/clerk-react';
import QRScanModal from './QRScanModal';

const ItemCard = ({ item, userRole, onItemUpdate }) => {
  const [showQR, setShowQR] = useState(false);
  const [showQRScanModal, setShowQRScanModal] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isUpdatingToInTransit, setIsUpdatingToInTransit] = useState(false);
  const [isMarkingAsDone, setIsMarkingAsDone] = useState(false);
  const { user } = useUser();

  const getIcon = (category) => {
    const icons = {
      'computer': Cpu,
      'mobile': Smartphone,
      'monitor': Monitor,
      'battery': Battery,
      'lab-equipment': FlaskRound,
      'accessories': Headphones
    };
    return icons[category] || Cpu;
  };

  const getStatusInfo = (status) => {
    switch(status) {
      case 'done':
        return { color: 'text-green-600', bg: '!bg-green-100', icon: CheckCircle, label: 'Completed' };
      case 'waiting for pickup':
        return { color: 'text-yellow-600', bg: '!bg-yellow-100', icon: Clock, label: 'Waiting for Pickup' };
      case 'in transit':
        return { color: 'text-blue-600', bg: '!bg-blue-100', icon: Clock, label: 'In Transit' };
      case 'processing':
        return { color: 'text-purple-600', bg: '!bg-purple-100', icon: Clock, label: 'Processing' };
      case 'reported':
        return { color: 'text-orange-600', bg: '!bg-orange-100', icon: Clock, label: 'Reported' };
      default:
        return { color: 'text-gray-600', bg: '!bg-gray-100', icon: Clock, label: status || 'Unknown' };
    }
  };

  const handleAcceptItem = async () => {
    if (!user || !item.id) return;
    
    setIsAccepting(true);
    try {
      const updatedItem = await ewasteAPI.acceptItem(item.id, user.id, 'Item accepted by vendor');
      console.log('✅ Item accepted successfully by vendor:', updatedItem);
      
      // Call the parent callback to update the item in the inventory
      if (onItemUpdate) {
        onItemUpdate(updatedItem);
      }
    } catch (error) {
      console.error('❌ Error accepting item:', error);
      alert('Failed to accept item. Please try again.');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleUpdateToInTransit = async () => {
    if (!user || !item.id) return;
    
    setIsUpdatingToInTransit(true);
    try {
      const updatedItem = await ewasteAPI.updateToInTransit(item.id, user.id, 'Item picked up and in transit');
      console.log('✅ Item status updated to in transit successfully:', updatedItem);
      
      // Call the parent callback to update the item in the inventory
      if (onItemUpdate) {
        onItemUpdate(updatedItem);
      }
    } catch (error) {
      console.error('❌ Error updating item to in transit:', error);
      alert('Failed to update item status. Please try again.');
    } finally {
      setIsUpdatingToInTransit(false);
    }
  };

  const handleMarkAsDone = async () => {
    if (!user || !item.id) return;
    
    setIsMarkingAsDone(true);
    try {
      const updatedItem = await ewasteAPI.markAsDone(item.id, user.id, 'Item collected and processed by company');
      console.log('✅ Item marked as done successfully:', updatedItem);
      
      // Call the parent callback to update the item in the inventory
      if (onItemUpdate) {
        onItemUpdate(updatedItem);
      }
    } catch (error) {
      console.error('❌ Error marking item as done:', error);
      alert('Failed to mark item as done. Please try again.');
    } finally {
      setIsMarkingAsDone(false);
    }
  };

  const handleScanQR = () => {
    setShowQRScanModal(true);
  };

  const handleQRScanModalClose = () => {
    setShowQRScanModal(false);
  };

  const IconComponent = getIcon(item.category);
  const StatusInfo = getStatusInfo(item.status);
  const StatusIcon = StatusInfo.icon;

  return (
    <div className="!bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full !bg-blue-100 flex items-center justify-center`}>
            <IconComponent className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.model}</p>
          </div>
        </div>
        
        <Menu as="div" className="relative">
          <MenuButton className="p-1 rounded-lg hover:!bg-gray-100 transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </MenuButton>
          <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
            <MenuItem>
              {({ active }) => (
                <button className={`flex items-center w-full px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}>
                  <Eye className="w-4 h-4 mr-2" /> View Details
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button className={`flex items-center w-full px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}>
                  <Edit className="w-4 h-4 mr-2" /> Edit Item
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button className={`flex items-center w-full px-4 py-2 text-sm text-red-600 ${active ? '!bg-red-50' : ''}`}>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Classification</p>
            <p className="text-sm font-medium capitalize">{item.category}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Brand</p>
            <p className="text-sm font-medium">{item.brand}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Weight</p>
            <p className="text-sm font-medium">{item.weight}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Condition</p>
            <p className="text-sm font-medium">{item.condition}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Submitted On</p>
            <p className="text-sm font-medium">{item.dateAdded}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Est. Price</p>
            <p className="text-sm font-medium">₹{item.estimatedPrice || '0'}</p>
          </div>
        </div>

        {/* Serial Number */}
        {item.serial && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Serial Number</p>
            <p className="text-sm font-mono font-medium">{item.serial}</p>
          </div>
        )}

        {/* Pickup Address */}
        {item.pickupAddress && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Pickup Address</p>
            <p className="text-sm font-medium">{item.pickupAddress}</p>
          </div>
        )}

        {/* Notes */}
        {item.shortNote && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Notes</p>
            <p className="text-sm font-medium">{item.shortNote}</p>
          </div>
        )}

        {/* Donor ID (for vendors and companies) */}
        {item.donorId && (
          <div className="mb-4 p-3 !bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Donor ID</p>
            <p className="text-sm font-mono font-medium text-blue-700">{item.donorId}</p>
          </div>
        )}

        {/* Vendor Acceptance Info */}
        {item.vendorAcceptedBy && (
          <div className="mb-4 p-3 !bg-green-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Accepted By Vendor</p>
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-green-600" />
              <p className="text-sm font-medium text-green-700">{item.vendorAcceptedBy}</p>
            </div>
            {item.vendorAcceptedAt && (
              <p className="text-xs text-green-600 mt-1">
                {new Date(item.vendorAcceptedAt).toLocaleDateString()}
              </p>
            )}
            {item.vendorNotes && (
              <p className="text-xs text-green-600 mt-1">{item.vendorNotes}</p>
            )}
          </div>
        )}

        {/* In Transit Info */}
        {item.inTransitBy && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">In Transit By</p>
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <p className="text-sm font-medium text-blue-700">{item.inTransitBy}</p>
            </div>
            {item.inTransitAt && (
              <p className="text-xs text-blue-600 mt-1">
                {new Date(item.inTransitAt).toLocaleDateString()}
              </p>
            )}
            {item.inTransitNotes && (
              <p className="text-xs text-blue-600 mt-1">{item.inTransitNotes}</p>
            )}
          </div>
        )}

        {/* Completion Info */}
        {item.completedBy && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Completed By Company</p>
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-green-600" />
              <p className="text-sm font-medium text-green-700">{item.completedBy}</p>
            </div>
            {item.completedAt && (
              <p className="text-xs text-green-600 mt-1">
                {new Date(item.completedAt).toLocaleDateString()}
              </p>
            )}
            {item.completionNotes && (
              <p className="text-xs text-green-600 mt-1">{item.completionNotes}</p>
            )}
          </div>
        )}

        {/* Gemini AI Classification Results */}
        {item.geminiClassification && (
          <div className="mb-4 p-3 !bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-gray-500 mb-2">🤖 AI Analysis Results</p>
            
            {/* Classification Breakdown */}
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700">Hazardous:</span>
                <span className="text-xs font-bold text-red-600">
                  {item.geminiClassification.classification?.hazardous?.percentage || 0}%
                </span>
              </div>
              <div className="w-full !bg-gray-200 rounded-full h-1">
                <div 
                  className="!bg-red-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${item.geminiClassification.classification?.hazardous?.percentage || 0}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700">Recyclable:</span>
                <span className="text-xs font-bold text-green-600">
                  {item.geminiClassification.classification?.recyclable?.percentage || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="!bg-green-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${item.geminiClassification.classification?.recyclable?.percentage || 0}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700">Reusable:</span>
                <span className="text-xs font-bold text-blue-600">
                  {item.geminiClassification.classification?.reusable?.percentage || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="!bg-blue-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${item.geminiClassification.classification?.reusable?.percentage || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Recommendations */}
            {item.geminiClassification.recommendations && (
              <div className="text-xs text-gray-600">
                <p><strong>Disposal:</strong> {item.geminiClassification.recommendations.disposal_method}</p>
                <p><strong>Value:</strong> {item.geminiClassification.recommendations.value_estimate}</p>
              </div>
            )}
          </div>
        )}

        {/* Status and Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full ${StatusInfo.bg}`}>
            <StatusIcon className={`w-4 h-4 mr-1 ${StatusInfo.color}`} />
            <span className={`text-xs font-medium ${StatusInfo.color}`}>{StatusInfo.label}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Accept Button for Vendors */}
            {userRole === 'vendor' && item.status === 'reported' && (
              <button
                onClick={handleAcceptItem}
                disabled={isAccepting}
                className="flex items-center px-3 py-1 !bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-3 h-3 mr-1" />
                {isAccepting ? 'Accepting...' : 'Accept'}
              </button>
            )}
            
            {/* Scan QR Button for Vendors (only on accepted items) */}
            {userRole === 'vendor' && item.status === 'waiting for pickup' && (
              <button
                onClick={handleScanQR}
                className="flex items-center px-3 py-1 !bg-blue-600 text-white text-xs font-medium rounded-lg hover:!bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Scan className="w-3 h-3 mr-1" />
                Pick Up Item
              </button>
            )}
            
            {/* Scan QR Button for Companies (only on in transit items) */}
            {userRole === 'company' && item.status === 'in transit' && (
              <button
                onClick={handleScanQR}
                className="flex items-center px-3 py-1 !bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Scan className="w-3 h-3 mr-1" />
                Complete Item
              </button>
            )}
            
            <button 
              onClick={() => setShowQR(!showQR)}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <QrCode className="w-4 h-4 mr-1" />
              {showQR ? 'Hide QR' : 'Show QR'}
            </button>
          </div>
        </div>

        {/* QR Code */}
        {showQR && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
            <div className="w-32 h-32 mx-auto bg-white p-2 rounded">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${item.serial || item.id}`} 
                alt="QR Code" 
                className="w-full h-full" 
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {item.serial ? `Serial: ${item.serial}` : 'Scan to view item details'}
            </p>
          </div>
        )}
      </div>

              {/* QR Scan Modal */}
        {showQRScanModal && (
          <QRScanModal
            isOpen={showQRScanModal}
            onClose={handleQRScanModalClose}
            item={item}
            onItemUpdate={onItemUpdate}
          />
        )}
    </div>
  );
};

export default ItemCard;