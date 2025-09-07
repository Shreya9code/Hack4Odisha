const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');

// Create or update vendor
router.post('/', async (req, res) => {
  try {
    const { clerkId, name, email, licenseNumber, contactNumber, address } = req.body;

    // Upsert: if vendor exists, update; else create
    const vendor = await Vendor.findOneAndUpdate(
      { clerkId },
      { name, email, licenseNumber, contactNumber, address },
      { new: true, upsert: true }
    );

    res.status(200).json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
