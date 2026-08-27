const User = require('../models/User');
const Pet = require('../models/Pet');
const ShelterAnimal = require('../models/ShelterAnimal');
const Appointment = require('../models/Appointment');

// @desc    Get dashboard stats for Super Admin
// @route   GET /api/v1/admin/stats
// @access  Private/SuperAdmin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVets = await User.countDocuments({ role: 'VET' });
    const totalShelters = await User.countDocuments({ role: 'SHELTER_ADMIN' });
    const totalPets = await Pet.countDocuments();
    const totalShelterAnimals = await ShelterAnimal.countDocuments();
    const totalAppointments = await Appointment.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        users: totalUsers,
        vets: totalVets,
        shelters: totalShelters,
        pets: totalPets + totalShelterAnimals,
        appointments: totalAppointments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users (with pagination and search)
// @route   GET /api/v1/admin/users
// @access  Private/SuperAdmin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user status (e.g. verify, ban)
// @route   PATCH /api/v1/admin/users/:id/status
// @access  Private/SuperAdmin
const updateUserStatus = async (req, res) => {
  try {
    const { action } = req.body; // e.g., 'VERIFY', 'BAN', 'ACTIVATE'
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (action === 'VERIFY') {
      user.isVerified = true;
    } else if (action === 'BAN') {
      user.status = 'BANNED'; // Assuming you have or can add a status field
    } else if (action === 'ACTIVATE') {
      user.status = 'ACTIVE';
    }

    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats, getAllUsers, updateUserStatus };
