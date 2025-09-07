/*
For viewing and managing e-waste items. Behavior changes depending on whether the user is a donor, vendor, or company.
State Variables
- isModalOpen → controls whether the "Add Item" modal is open.
- filter → stores selected categories for filtering.
- searchQuery → stores the search input.
- items → array of e-waste items fetched from the backend.
- isLoading → shows loading spinner when fetching items.
- userRole → stores the role (donor, vendor, or company) from localStorage.
- error → stores any API or fetch error message.
- user → fetched from useUser() (Clerk), contains ID and email.

Fetching Items
- On mount (useEffect), it reads the user role from local storage.

Then another useEffect fetches items based on role:
- Donor: fetches only items they submitted (getByDonorId).
- Vendor/Company: fetches all items (getAll).

Transforms items to a standardized structure for the UI (maps fields like itemType, weightValue, status, vendorNotes, etc.).

Security check: ensures donors only see their own items even if backend returns more.

Item Operations
- handleAddItem(newItem) → adds a new item to the top of the list after creation.
- handleItemUpdate(updatedItem) → updates an existing item in the state when its status changes (vendor accepted, in-transit, done, etc.).
- handleRefresh() → refetches items from the backend (like a manual "reload").

Filtering & Search

Filters items by:
- Category selected in CategoryFilter component.
- Search query matching name, model, brand, serial, pickupAddress, or donorId.

Rendering
- Header: shows title based on role and buttons:

Refresh button
- Add New Item button (only for vendors/companies)
- Error Display: shows API errors with a retry button.
- CategoryFilter component: lets user filter by category or search.
- Loading State: spinner + message while fetching.
- Items Grid: renders ItemCard for each filtered item.
- Empty State: shows a friendly message when no items exist.

Add Item Modal: modal to add new items, opens/closes via isModalOpen.

Summary
- Dashboard for e-waste items. It:
- Fetches items from the backend.
- Transforms and filters them.
- Handles adding/updating items in real-time.
- Shows loading, error, or empty states based on situation.
- Adapts the UI based on user role.*/
import { useState, useEffect } from 'react';
import CategoryFilter from '../components/inventory/CategoryFilter';
import ItemCard from '../components/inventory/ItemCard';
import AddItemModal from '../components/inventory/AddItemModal';
import { Plus, RefreshCw } from 'lucide-react';
import { ewasteAPI } from '../services/api';
import { useUser } from '@clerk/clerk-react';

const Inventory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState({ categories: ['all'] });
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [error, setError] = useState('');
  const { user } = useUser();

  // Get user role on component mount
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  // Fetch e-waste items based on user role
  useEffect(() => {
    const fetchItems = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError('');
      
      console.log('🔍 Fetching items for user:', {
        userId: user.id,
        userRole: userRole,
        userEmail: user.primaryEmailAddress?.emailAddress
      });
      
      try {
        let fetchedItems;
        
        if (userRole === 'donor') {
          // For donors, fetch their own items using Clerk ID
          console.log('👤 Fetching items for donor with ID:', user.id);
          fetchedItems = await ewasteAPI.getByDonorId(user.id);
          console.log('📦 Received items for donor:', fetchedItems.length);
        } else {
          // For vendors and companies, fetch all items
          console.log('🏭 Fetching all items for vendor/company');
          fetchedItems = await ewasteAPI.getAll();
          console.log('📦 Received all items:', fetchedItems.length);
        }
        
        // Transform the data to match the expected format
        const transformedItems = fetchedItems.map(item => ({
          id: item._id,
          name: item.itemType,
          model: item.model || 'N/A',
          brand: item.brand || 'N/A',
          category: item.classification || 'recyclable',
          weight: `${item.weightValue} ${item.weightUnit}`,
          condition: item.condition || 'Unknown',
          status: item.status,
          dateAdded: new Date(item.createdAt).toLocaleDateString(),
          serial: item.serial,
          pickupAddress: item.pickupAddress,
          estimatedPrice: item.estimatedPrice,
          shortNote: item.shortNote,
          age: item.age,
          donorId: item.donorId, // Include donor ID for vendor/company view
          // Vendor acceptance fields
          vendorAcceptedBy: item.vendorAcceptedBy,
          vendorAcceptedAt: item.vendorAcceptedAt,
          vendorNotes: item.vendorNotes,
          // In transit fields
          inTransitBy: item.inTransitBy,
          inTransitAt: item.inTransitAt,
          inTransitNotes: item.inTransitNotes,
          // Completion fields
          completedBy: item.completedBy,
          completedAt: item.completedAt,
          completionNotes: item.completionNotes,
          // Gemini AI classification
          geminiClassification: item.geminiClassification
        }));
        
        // SECURITY CHECK: For donors, ensure they only see their own items
        let finalItems = transformedItems;
        if (userRole === 'donor') {
          const userItems = transformedItems.filter(item => item.donorId === user.id);
          const otherItems = transformedItems.filter(item => item.donorId !== user.id);
          
          if (otherItems.length > 0) {
            console.warn('⚠️  SECURITY WARNING: Backend returned items from other donors!');
            console.warn('Filtering out items from other donors:', otherItems.map(item => ({ serial: item.serial, donorId: item.donorId })));
            console.warn('User ID:', user.id);
            console.warn('Items that should not be shown:', otherItems.length);
          }
          
          finalItems = userItems;
          console.log('🔒 Security check: Showing only user items:', finalItems.length);
        }
        
        console.log('🔄 Transformed items:', finalItems.map(item => ({ 
          serial: item.serial, 
          donorId: item.donorId,
          name: item.name 
        })));
        
        setItems(finalItems);
      } catch (error) {
        console.error('Error fetching items:', error);
        setError('Failed to fetch items. Please try again.');
        setItems([]); // Set empty array instead of fallback to localStorage
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [user, userRole]);

  const handleAddItem = (newItem) => {
    setItems(prev => [newItem, ...prev]);
  };

  const handleItemUpdate = (updatedItem) => {
    setItems(prev => prev.map(item => 
      item.id === updatedItem._id ? {
        ...item,
        status: updatedItem.status,
        vendorAcceptedBy: updatedItem.vendorAcceptedBy,
        vendorAcceptedAt: updatedItem.vendorAcceptedAt,
        vendorNotes: updatedItem.vendorNotes,
        // In transit fields
        inTransitBy: updatedItem.inTransitBy,
        inTransitAt: updatedItem.inTransitAt,
        inTransitNotes: updatedItem.inTransitNotes,
        // Completion fields
        completedBy: updatedItem.completedBy,
        completedAt: updatedItem.completedAt,
        completionNotes: updatedItem.completionNotes,
        // Gemini AI classification
        geminiClassification: updatedItem.geminiClassification
      } : item
    ));
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    // Trigger a re-fetch of items
    const fetchItems = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        let fetchedItems;
        
        if (userRole === 'donor') {
          fetchedItems = await ewasteAPI.getByDonorId(user.id);
        } else {
          fetchedItems = await ewasteAPI.getAll();
        }
        
        const transformedItems = fetchedItems.map(item => ({
          id: item._id,
          name: item.itemType,
          model: item.model || 'N/A',
          brand: item.brand || 'N/A',
          category: item.classification || 'recyclable',
          weight: `${item.weightValue} ${item.weightUnit}`,
          condition: item.condition || 'Unknown',
          status: item.status,
          dateAdded: new Date(item.createdAt).toLocaleDateString(),
          serial: item.serial,
          pickupAddress: item.pickupAddress,
          estimatedPrice: item.estimatedPrice,
          shortNote: item.shortNote,
          age: item.age,
          donorId: item.donorId,
          // Vendor acceptance fields
          vendorAcceptedBy: item.vendorAcceptedBy,
          vendorAcceptedAt: item.vendorAcceptedAt,
          vendorNotes: item.vendorNotes,
          // In transit fields
          inTransitBy: item.inTransitBy,
          inTransitAt: item.inTransitAt,
          inTransitNotes: item.inTransitNotes,
          // Completion fields
          completedBy: item.completedBy,
          completedAt: item.completedAt,
          completionNotes: item.completionNotes
        }));
        
        // SECURITY CHECK: For donors, ensure they only see their own items
        let finalItems = transformedItems;
        if (userRole === 'donor') {
          const userItems = transformedItems.filter(item => item.donorId === user.id);
          const otherItems = transformedItems.filter(item => item.donorId !== user.id);
          
          if (otherItems.length > 0) {
            console.warn('⚠️  SECURITY WARNING: Backend returned items from other donors during refresh!');
            console.warn('Filtering out items from other donors:', otherItems.map(item => ({ serial: item.serial, donorId: item.donorId })));
          }
          
          finalItems = userItems;
        }
        
        setItems(finalItems);
      } catch (error) {
        console.error('Error refreshing items:', error);
        setError('Failed to refresh items. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  };

  // Filter items based on selected categories and search query
  const filteredItems = items.filter(item => {
    const matchesCategory = filter.categories.includes('all') || 
                           filter.categories.includes(item.category);
    const matchesSearch = searchQuery === '' || 
                         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.model && item.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (item.serial && item.serial.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (item.pickupAddress && item.pickupAddress.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (item.donorId && item.donorId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {userRole === 'donor' ? 'My E-Waste Items' : 'All E-Waste Items'}
          </h2>
          <p className="text-gray-600 mt-1">
            {userRole === 'donor' 
              ? 'View all your submitted e-waste items' 
              : userRole === 'vendor'
                ? 'View all reported e-waste items from all donors'
                : 'Manage all e-waste items reported by donors'
            }
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {userRole !== 'donor' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="!bg-blue-600 text-white px-4 py-2 rounded-lg hover:!bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Item
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Filters */}
      <CategoryFilter 
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <RefreshCw className="w-12 h-12 text-gray-400 animate-spin" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading items...</h3>
          <p className="text-gray-500">Please wait while we fetch your e-waste items</p>
        </div>
      )}

      {/* Items Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <ItemCard 
              key={item.id} 
              item={item} 
              userRole={userRole}
              onItemUpdate={handleItemUpdate}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No items found' : userRole === 'donor' ? 'No e-waste items submitted yet' : 'No e-waste items reported yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery 
              ? 'Try adjusting your search query' 
              : userRole === 'donor' 
                ? 'Start by generating a QR code for your e-waste item' 
                : 'No donors have submitted e-waste items yet'
            }
          </p>
          {userRole === 'donor' ? (
            <button
              onClick={() => window.location.href = '/qr-generator'}
              className="!bg-emerald-600 text-white px-4 py-2 rounded-lg hover:!bg-emerald-700 transition-colors"
            >
              Generate QR Code
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="!bg-blue-600 text-white px-4 py-2 rounded-lg hover:!bg-blue-700 transition-colors"
            >
              Add Your First Item
            </button>
          )}
        </div>
      )}

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddItem={handleAddItem}
      />
    </div>
  );
};

export default Inventory;