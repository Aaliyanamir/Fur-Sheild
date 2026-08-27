const User = require('../models/User');
const Pet = require('../models/Pet');
const ShelterAnimal = require('../models/ShelterAnimal');
const Appointment = require('../models/Appointment');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVets = await User.countDocuments({ role: 'VET' });
    const totalShelters = await User.countDocuments({ role: 'SHELTER_ADMIN' });
    const totalOwners = await User.countDocuments({ role: 'OWNER' });
    
    const totalPets = await Pet.countDocuments();
    const totalShelterAnimals = await ShelterAnimal.countDocuments();
    const totalAppointments = await Appointment.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        users: totalUsers,
        owners: totalOwners,
        vets: totalVets,
        shelters: totalShelters,
        pets: totalPets + totalShelterAnimals,
        appointments: totalAppointments
      }
    });
  } catch (error) {
    console.error("Stats Error: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error("Users Error: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { action } = req.body;
    let updateFields = {};

    if (action === 'VERIFY') updateFields.isVerified = true;
    else if (action === 'BAN') updateFields.status = 'BANNED';
    else if (action === 'ACTIVATE') updateFields.status = 'ACTIVE';

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Update User Error: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats, getAllUsers, updateUserStatus };
