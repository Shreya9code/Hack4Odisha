const express = require('express');
const router = express.Router();
const Donor = require('../models/Donor');
const Vendor = require('../models/Vendor');
const Company = require('../models/Company');

// Unified route to create or update user based on role
router.post('/:role', async (req, res) => {
    try {
        const { role } = req.params;
        const { clerkId, name, email, contactNumber, address, licenseNumber, registrationNumber } = req.body;

        // Validate required fields
        if (!clerkId || !name || !email) {
            return res.status(400).json({ error: 'clerkId, name, and email are required' });
        }

        // Role-specific validation
        if (role === 'vendor' && !licenseNumber) {
            return res.status(400).json({ error: 'licenseNumber is required for vendors' });
        }

        if (role === 'company' && !registrationNumber) {
            return res.status(400).json({ error: 'registrationNumber is required for companies' });
        }

        let user;
        let existingUser;

        switch (role) {
            case 'donor':
                // Check if user already exists
                existingUser = await Donor.findOne({ clerkId });
                if (existingUser) {
                    // Update existing user
                    user = await Donor.findOneAndUpdate(
                        { clerkId },
                        { name, email, contactNumber, address },
                        { new: true, runValidators: true }
                    );
                } else {
                    // Create new user
                    user = new Donor({
                        clerkId,
                        name,
                        email,
                        contactNumber,
                        address
                    });
                    await user.save();
                }
                break;

            case 'vendor':
                // Check if user already exists
                existingUser = await Vendor.findOne({ clerkId });
                if (existingUser) {
                    // Update existing user
                    user = await Vendor.findOneAndUpdate(
                        { clerkId },
                        { name, email, licenseNumber, contactNumber, address },
                        { new: true, runValidators: true }
                    );
                } else {
                    // Create new user
                    user = new Vendor({
                        clerkId,
                        name,
                        email,
                        licenseNumber,
                        contactNumber,
                        address
                    });
                    await user.save();
                }
                break;

            case 'company':
                // Check if user already exists
                existingUser = await Company.findOne({ clerkId });
                if (existingUser) {
                    // Update existing user
                    user = await Company.findOneAndUpdate(
                        { clerkId },
                        { name, email, registrationNumber, contactNumber, address },
                        { new: true, runValidators: true }
                    );
                } else {
                    // Create new user
                    user = new Company({
                        clerkId,
                        name,
                        email,
                        registrationNumber,
                        contactNumber,
                        address
                    });
                    await user.save();
                }
                break;

            default:
                return res.status(400).json({ error: 'Invalid role. Must be donor, vendor, or company' });
        }

        res.status(200).json({
            success: true,
            message: existingUser ? 'User updated successfully' : 'User created successfully',
            user: {
                id: user._id,
                clerkId: user.clerkId,
                name: user.name,
                email: user.email,
                role: role,
                contactNumber: user.contactNumber,
                address: user.address,
                ...(role === 'vendor' && { licenseNumber: user.licenseNumber }),
                ...(role === 'company' && { registrationNumber: user.registrationNumber })
            }
        });

    } catch (error) {
        console.error('Error creating/updating user:', error);
        console.error('Request body:', req.body);
        console.error('Role:', req.params.role);

        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                error: `${field} already exists`
            });
        }

        res.status(500).json({
            error: 'processing...',
            details: error.message
        });
    }
});

// Get user by Clerk ID across all collections
router.get('/clerk/:clerkId', async (req, res) => {
    try {
        const { clerkId } = req.params;

        // Check all collections for the user
        const [donor, vendor, company] = await Promise.all([
            Donor.findOne({ clerkId }),
            Vendor.findOne({ clerkId }),
            Company.findOne({ clerkId })
        ]);

        let user = null;
        let role = null;

        if (donor) {
            user = donor;
            role = 'donor';
        } else if (vendor) {
            user = vendor;
            role = 'vendor';
        } else if (company) {
            user = company;
            role = 'company';
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                clerkId: user.clerkId,
                name: user.name,
                email: user.email,
                role: role,
                contactNumber: user.contactNumber,
                address: user.address,
                ...(role === 'vendor' && { licenseNumber: user.licenseNumber }),
                ...(role === 'company' && { registrationNumber: user.registrationNumber })
            }
        });

    } catch (error) {
        console.error('Error fetching user:', error);
        console.error('Clerk ID:', clerkId);
        res.status(500).json({
            error: 'processing...',
            details: error.message
        });
    }
});

module.exports = router;
