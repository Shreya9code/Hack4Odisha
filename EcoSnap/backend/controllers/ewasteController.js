const Ewaste = require('../models/EWaste');
const Donor = require('../models/Donor');
const Vendor = require('../models/Vendor');
const Company = require('../models/Company');

// Donor reports e-waste
exports.createEwaste = async (req, res) => {
  try {
    const donorId = req.body.donorId;
    
    // Validate that donorId (Clerk ID) is provided
    if (!donorId) {
      return res.status(400).json({ error: 'Donor ID (Clerk ID) is required' });
    }
    
    const ewasteData = { ...req.body, donorId };
    const ewaste = await Ewaste.create(ewasteData);
    res.status(201).json(ewaste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all e-waste for vendors
exports.getAllEwastes = async (req, res) => {
  try {
    const ewastes = await Ewaste.find();
    res.status(200).json(ewastes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//for removing item.js dont know if its needed
// Get all e-waste items with donor info
exports.getAllItems = async (req, res) => {
  try {
    const items = await Ewaste.find().populate('donorId', 'name email');
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new e-waste item (simpler version)
exports.addItem = async (req, res) => {
  try {
    const item = await Ewaste.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get item by ID with donor info
exports.getItemByIdWithDonor = async (req, res) => {
  try {
    const item = await Ewaste.findById(req.params.id).populate('donorId', 'name email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get e-waste items by donor ID (Clerk ID)
exports.getEwasteByDonorId = async (req, res) => {
  try {
    const { donorId } = req.params;
    console.log('🔍 Fetching e-waste items for donor ID:', donorId);
    
    // First, let's see what's in the database
    const allEwastes = await Ewaste.find();
    console.log('📊 Total e-waste items in database:', allEwastes.length);
    
    // Check for items without donorId
    const itemsWithoutDonorId = allEwastes.filter(item => !item.donorId);
    if (itemsWithoutDonorId.length > 0) {
      console.log('⚠️  WARNING: Found items without donorId:', itemsWithoutDonorId.map(item => ({ serial: item.serial, _id: item._id })));
    }
    
    console.log('📋 All items donor IDs:', allEwastes.map(item => ({ serial: item.serial, donorId: item.donorId })));
    
    // Try multiple filtering approaches to ensure we get the right results
    
    // Method 1: Direct MongoDB query
    const mongoQuery = { donorId: donorId };
    console.log('🔍 MongoDB query being used:', JSON.stringify(mongoQuery));
    const ewastesFromMongo = await Ewaste.find(mongoQuery);
    console.log('📦 MongoDB query returned:', ewastesFromMongo.length, 'items');
    
    // Method 2: Manual JavaScript filtering (exact match)
    const exactMatch = allEwastes.filter(item => item.donorId === donorId);
    console.log('🔍 Exact match found:', exactMatch.length, 'items');
    
    // Method 3: Case-insensitive matching (in case there are case differences)
    const caseInsensitiveMatch = allEwastes.filter(item => 
      item.donorId && item.donorId.toLowerCase() === donorId.toLowerCase()
    );
    console.log('🔍 Case-insensitive match found:', caseInsensitiveMatch.length, 'items');
    
    // Method 4: Trimmed matching (in case there are whitespace issues)
    const trimmedMatch = allEwastes.filter(item => 
      item.donorId && item.donorId.trim() === donorId.trim()
    );
    console.log('🔍 Trimmed match found:', trimmedMatch.length, 'items');
    
    // Use the most restrictive result to ensure we don't show other donors' items
    let finalResults = exactMatch;
    
    // If exact match is empty but we have other matches, log a warning
    if (exactMatch.length === 0 && (caseInsensitiveMatch.length > 0 || trimmedMatch.length > 0)) {
      console.log('⚠️  WARNING: Exact match failed but found matches with other methods!');
      console.log('This suggests there might be data inconsistency in the database.');
      console.log('Using exact match (empty result) to ensure security.');
    }
    
    // If we still have no results, double-check by logging all donor IDs
    if (finalResults.length === 0) {
      console.log('🔍 No items found for donor ID:', donorId);
      console.log('🔍 All unique donor IDs in database:', [...new Set(allEwastes.map(item => item.donorId).filter(Boolean))]);
    }
    
    console.log('✅ Final result - items for donor', donorId, ':', finalResults.length);
    console.log('📦 Final items:', finalResults.map(item => ({ serial: item.serial, donorId: item.donorId })));
    
    res.status(200).json(finalResults);
  } catch (err) {
    console.error('❌ Error in getEwasteByDonorId:', err);
    res.status(500).json({ error: err.message });
  }
};
// Get single e-waste by ID (for QR code scan)
exports.getEwasteById = async (req, res) => {
  try {
    const ewaste = await Ewaste.findById(req.params.id);
    if (!ewaste) return res.status(404).json({ message: 'E-waste not found' });
    res.status(200).json(ewaste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single e-waste by serial number (for QR code scan)
exports.getEwasteBySerial = async (req, res) => {
  try {
    const ewaste = await Ewaste.findOne({ serial: req.params.serial });
    if (!ewaste) return res.status(404).json({ message: 'E-waste not found' });
    res.status(200).json(ewaste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update status
exports.updateStatus = async (req, res) => {
  try {
    const ewaste = await Ewaste.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.status(200).json(ewaste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update status by serial number
exports.updateStatusBySerial = async (req, res) => {
  try {
    const ewaste = await Ewaste.findOneAndUpdate(
      { serial: req.params.serial }, 
      { 
        status: req.body.status,
        updatedAt: new Date()
      }, 
      { new: true }
    );
    if (!ewaste) return res.status(404).json({ message: 'E-waste not found' });
    res.status(200).json(ewaste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Accept e-waste item (vendor function) - change status to "waiting for pickup"
exports.acceptEwasteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { vendorId, notes } = req.body;
    
    console.log('🏭 Vendor accepting e-waste item:', { itemId: id, vendorId, notes });
    
    // Find and update the item status
    const ewaste = await Ewaste.findByIdAndUpdate(
      id,
      { 
        status: 'waiting for pickup',
        vendorAcceptedBy: vendorId,
        vendorAcceptedAt: new Date(),
        vendorNotes: notes,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!ewaste) {
      return res.status(404).json({ message: 'E-waste item not found' });
    }
    
    console.log('✅ Item accepted by vendor successfully:', ewaste.serial, 'Status:', ewaste.status);
    res.status(200).json(ewaste);
  } catch (err) {
    console.error('❌ Error accepting e-waste item:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update item status to "in transit" when vendor scans QR (for accepted items)
exports.updateToInTransit = async (req, res) => {
  try {
    const { id } = req.params;
    const { vendorId, notes } = req.body;
    
    console.log('🚚 Vendor updating item to in transit:', { itemId: id, vendorId, notes });
    
    // First check if the item exists and is in "waiting for pickup" status
    const existingEwaste = await Ewaste.findById(id);
    if (!existingEwaste) {
      return res.status(404).json({ message: 'E-waste item not found' });
    }
    
    if (existingEwaste.status !== 'waiting for pickup') {
      return res.status(400).json({ 
        message: 'Item cannot be updated to in transit. Only items with status "waiting for pickup" can be updated.' 
      });
    }
    
    // Update the item status to "in transit"
    const ewaste = await Ewaste.findByIdAndUpdate(
      id,
      { 
        status: 'in transit',
        inTransitBy: vendorId,
        inTransitAt: new Date(),
        inTransitNotes: notes,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    console.log('✅ Item status updated to in transit successfully:', ewaste.serial, 'Status:', ewaste.status);
    res.status(200).json(ewaste);
  } catch (err) {
    console.error('❌ Error updating item to in transit:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update item status to "done" when company marks as completed (for in transit items)
exports.updateToDone = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId, notes } = req.body;
    
    console.log('🏢 Company marking item as done:', { itemId: id, companyId, notes });
    
    // First check if the item exists and is in "in transit" status
    const existingEwaste = await Ewaste.findById(id);
    if (!existingEwaste) {
      return res.status(404).json({ message: 'E-waste item not found' });
    }
    
    if (existingEwaste.status !== 'in transit') {
      return res.status(400).json({ 
        message: 'Item cannot be marked as done. Only items with status "in transit" can be completed.' 
      });
    }
    
    // Update the item status to "done"
    const ewaste = await Ewaste.findByIdAndUpdate(
      id,
      { 
        status: 'done',
        completedBy: companyId,
        completedAt: new Date(),
        completionNotes: notes,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    console.log('✅ Item marked as done successfully:', ewaste.serial, 'Status:', ewaste.status);
    res.status(200).json(ewaste);
  } catch (err) {
    console.error('❌ Error marking item as done:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update status with role-based validation
exports.updateStatusWithRole = async (req, res) => {
  try {
    const { qrId, role, licenseNo, registrationNo } = req.body;
    
    console.log('🔄 Role-based status update request:', { qrId, role, licenseNo, registrationNo });
    
    // Validate required fields
    if (!qrId || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'QR ID and role are required' 
      });
    }
    
    // Find the e-waste item
    const ewaste = await Ewaste.findById(qrId);
    if (!ewaste) {
      return res.status(404).json({ 
        success: false, 
        message: 'E-waste item not found' 
      });
    }
    
    console.log('📦 Found e-waste item:', { serial: ewaste.serial, status: ewaste.status });
    
    if (role === 'vendor') {
      // Vendor flow: validate license number and update to "In Transit"
      if (!licenseNo) {
        return res.status(400).json({ 
          success: false, 
          message: 'License number is required for vendor role' 
        });
      }
      
      // Check if item status is "Waiting for Pick Up"
      if (ewaste.status !== 'waiting for pickup') {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid status transition. Only items with status "Waiting for Pick Up" can be updated by vendors.' 
        });
      }
      
      // Validate vendor license number
      const vendor = await Vendor.findOne({ licenseNumber: licenseNo });
      if (!vendor) {
        return res.status(404).json({ 
          success: false, 
          message: 'No vendor found with that license number' 
        });
      }
      
      console.log('✅ Vendor validated:', vendor.name);
      
      // Update e-waste status to "In Transit"
      const updatedEwaste = await Ewaste.findByIdAndUpdate(
        qrId,
        { 
          status: 'in transit',
          inTransitBy: vendor.clerkId,
          inTransitAt: new Date(),
          inTransitNotes: `Item picked up by vendor ${vendor.name} (${licenseNo})`,
          updatedAt: new Date()
        },
        { new: true }
      );
      
      console.log('✅ Status updated to In Transit for vendor');
      res.status(200).json({ 
        success: true, 
        newStatus: 'In Transit',
        message: 'Status updated to In Transit'
      });
      
    } else if (role === 'company') {
      // Company flow: validate registration number and update to "Done"
      if (!registrationNo) {
        return res.status(400).json({ 
          success: false, 
          message: 'Registration number is required for company role' 
        });
      }
      
      // Check if item status is "In Transit"
      if (ewaste.status !== 'in transit') {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid status transition. Only items with status "In Transit" can be completed by companies.' 
        });
      }
      
      // Validate company registration number
      const company = await Company.findOne({ registrationNumber: registrationNo });
      if (!company) {
        return res.status(404).json({ 
          success: false, 
          message: 'No company found with that registration number' 
        });
      }
      
      console.log('✅ Company validated:', company.name);
      
      // Update e-waste status to "Done"
      const updatedEwaste = await Ewaste.findByIdAndUpdate(
        qrId,
        { 
          status: 'done',
          completedBy: company.clerkId,
          completedAt: new Date(),
          completionNotes: `Item processed by company ${company.name} (${registrationNo})`,
          updatedAt: new Date()
        },
        { new: true }
      );
      
      console.log('✅ Status updated to Done for company');
      res.status(200).json({ 
        success: true, 
        newStatus: 'Done',
        message: 'Status updated to Done'
      });
      
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid role. Must be either "vendor" or "company"' 
      });
    }
    
  } catch (err) {
    console.error('❌ Error in updateStatusWithRole:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};
