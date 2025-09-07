const express = require('express');
const router = express.Router();
const Donor = require('../models/Donor');

// Create or update a donor
router.post('/', async (req, res) => {
  try {
    const { clerkId, name, email, contactNumber, address } = req.body;

    const donor = await Donor.findOneAndUpdate(
      { clerkId },
      { name, email, contactNumber, address },
      { new: true, upsert: true }
    );

    res.status(200).json(donor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all donors
router.get('/', async (req, res) => {
  try {
    const donors = await Donor.find();
    res.status(200).json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
