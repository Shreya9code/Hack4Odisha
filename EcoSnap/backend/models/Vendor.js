const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const vendorSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true }, // Clerk user ID to link frontend login
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  licenseNumber: { type: String, required: true, unique: true },
  contactNumber: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Vendor', vendorSchema);
