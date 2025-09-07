const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

// Create or update a company
router.post('/', async (req, res) => {
  try {
    const { name, email, registrationNumber, contactNumber, address } = req.body;

    const company = await Company.findOneAndUpdate(
      { registrationNumber },
      { name, email, contactNumber, address },
      { new: true, upsert: true }
    );

    res.status(200).json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
