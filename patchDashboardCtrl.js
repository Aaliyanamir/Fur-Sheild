const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/controllers/dashboard.controller.js', 'utf8');

const newControllers = `
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get all Vets
// @route   GET /api/v1/dashboard/vets
// @access  Private
const getVets = async (req, res) => {
  try {
    const vets = await User.find({ role: 'VET' }).select('name email avatarUrl');
    res.status(200).json({ success: true, count: vets.length, data: vets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Book an appointment
// @route   POST /api/v1/dashboard/appointments
// @access  Private
const bookAppointment = async (req, res) => {
  try {
    const { petId, vetId, scheduledAt, reason, severity } = req.body;
    
    const appointment = await Appointment.create({
      ownerId: req.user.id,
      petId,
      vetId,
      scheduledAt,
      reason,
      severity: severity || 'ROUTINE',
      status: 'WAITING'
    });
    
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Owner Appointments
// @route   GET /api/v1/dashboard/appointments
// @access  Private
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ ownerId: req.user.id })
      .populate('petId', 'name avatarUrl species')
      .populate('vetId', 'name avatarUrl')
      .sort({ scheduledAt: 1 });
      
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMyPets, addPet, updateVitals, updatePet, deletePet, getVets, bookAppointment, getMyAppointments };
`;

code = code.replace("module.exports = { getMyPets, addPet, updateVitals, updatePet, deletePet };", newControllers);
fs.writeFileSync('d:/Pet-Care/server/controllers/dashboard.controller.js', code);
