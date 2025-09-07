const Donor = require('../models/Donor');

const createOrUpdateDonor = async (req, res) => {
  try {
    const { clerkId, email, name } = req.user;
    const { contactNumber, address } = req.body;

    // Check if donor already exists
    let donor = await Donor.findOne({ clerkId });

    if (donor) {
      // Update existing donor
      donor.contactNumber = contactNumber || donor.contactNumber;
      donor.address = address || donor.address;
      await donor.save();
    } else {
      // Create new donor
      donor = new Donor({
        clerkId,
        email,
        name,
        contactNumber,
        address
      });
      await donor.save();
    }

    res.status(200).json(donor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDonorProfile = async (req, res) => {
  try {
    const donor = await Donor.findOne({ clerkId: req.user.clerkId });
    if (!donor) {
      return res.status(404).json({ error: 'Donor not found' });
    }
    res.status(200).json(donor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createOrUpdateDonor, getDonorProfile };