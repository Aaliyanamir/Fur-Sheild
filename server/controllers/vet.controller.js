const Appointment = require('../models/Appointment');
const User = require('../models/User');
const notificationEngine = require('../utils/notificationEngine');

// @desc    Get vet's appointments
const getVetAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ vet: req.user._id }).populate('user', 'name email').populate('pet', 'name species');
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment status & add prescription/labs
const updateAppointment = async (req, res) => {
  try {
    const { status, prescription, labResults, notes, meetingLink } = req.body;
    
    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    if (appointment.vet.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    appointment.status = status || appointment.status;
    appointment.notes = notes || appointment.notes;
    appointment.meetingLink = meetingLink || appointment.meetingLink;
    
    if (prescription) {
      appointment.prescription = { ...prescription, issuedAt: Date.now() };
      // Notify user
      await notificationEngine.createNotification({
        recipient: appointment.user, type: 'SYSTEM', title: 'New E-Prescription',
        message: `Your vet has issued a new digital prescription.`, actionUrl: '/dashboard'
      });
    }
    
    if (labResults) {
      appointment.labResults = { ...labResults, date: Date.now() };
      // Notify user
      await notificationEngine.createNotification({
        recipient: appointment.user, type: 'SYSTEM', title: 'Lab Results Ready',
        message: `Your pet's lab results are available for review.`, actionUrl: '/dashboard'
      });
    }

    await appointment.save();
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public: Get all verified Vets
const getVerifiedVets = async (req, res) => {
  try {
    const vets = await User.find({ role: 'VET', isVerified: true }).select('name email avatarUrl specialty');
    res.status(200).json({ success: true, count: vets.length, data: vets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User: Book an appointment
const bookAppointment = async (req, res) => {
  try {
    const { vetId, petId, date, timeSlot, reason, type } = req.body;
    
    const appointment = await Appointment.create({
      user: req.user._id,
      vet: vetId,
      pet: petId,
      date,
      timeSlot,
      reason,
      type
    });

    const vet = await User.findById(vetId);

    await notificationEngine.notifyAppointmentBooked(req.user._id, vet.name, date);
    await notificationEngine.createNotification({
      recipient: vetId, type: 'APPOINTMENT', title: 'New Appointment Booking',
      message: `You have a new appointment scheduled for ${new Date(date).toLocaleDateString()}.`, actionUrl: '/vet'
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User: Get own appointments
const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id }).populate('vet', 'name email').populate('pet', 'name');
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getVetAppointments, updateAppointment, getVerifiedVets, bookAppointment, getUserAppointments };
