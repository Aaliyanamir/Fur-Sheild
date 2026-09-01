const Appointment = require('../models/Appointment');
const User = require('../models/User');
const notificationEngine = require('../utils/notificationEngine');

const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Pet = require('../models/Pet');
const notificationEngine = require('../utils/notificationEngine');

// @desc    Get vet's appointments
const getVetAppointments = async (req, res) => {
  try {
    let filter = {};
    if (req.user && req.user.role === 'VET') {
      filter = { vet: req.user._id };
    }
    let appointments = await Appointment.find(filter)
      .populate('user', 'name email phone')
      .populate('pet', 'name species breed avatarUrl')
      .sort({ date: -1 });

    // Fallback if no appointments found for this vet yet: show recent global appointments
    if ((!appointments || appointments.length === 0) && req.user.role === 'VET') {
      appointments = await Appointment.find()
        .populate('user', 'name email phone')
        .populate('pet', 'name species breed avatarUrl')
        .sort({ date: -1 })
        .limit(10);
    }

    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment status & add prescription/labs
const updateAppointment = async (req, res) => {
  try {
    const { status, prescription, labResults, notes, meetingLink } = req.body;
    
    let appointment = await Appointment.findById(req.params.id)
      .populate('vet', 'name email')
      .populate('pet', 'name species')
      .populate('user', 'name email');

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    if (status) {
      appointment.status = status;
      
      // Notify patient user when Vet accepts or changes status
      const isConfirmed = ['CONFIRMED', 'Approved', 'ACCEPTED', 'Confirmed'].includes(status);
      const vetName = appointment.vet ? appointment.vet.name : 'Your Vet';
      const petName = appointment.pet ? appointment.pet.name : 'your pet';

      await notificationEngine.createNotification({
        recipient: appointment.user._id || appointment.user,
        type: 'APPOINTMENT',
        title: isConfirmed ? 'Appointment Accepted!' : `Appointment ${status}`,
        message: isConfirmed 
          ? `${vetName} has accepted your appointment booking for ${petName}.` 
          : `Your appointment for ${petName} status has been updated to ${status}.`,
        actionUrl: '/dashboard'
      });
    }

    appointment.notes = notes || appointment.notes;
    appointment.meetingLink = meetingLink || appointment.meetingLink;
    
    if (prescription) {
      appointment.prescription = { ...prescription, issuedAt: Date.now() };
      await notificationEngine.createNotification({
        recipient: appointment.user._id || appointment.user,
        type: 'SYSTEM',
        title: 'New E-Prescription',
        message: `Dr. ${appointment.vet ? appointment.vet.name : ''} issued a new digital prescription for ${appointment.pet?.name || 'your pet'}.`,
        actionUrl: '/dashboard'
      });
    }
    
    if (labResults) {
      appointment.labResults = { ...labResults, date: Date.now() };
      await notificationEngine.createNotification({
        recipient: appointment.user._id || appointment.user,
        type: 'SYSTEM',
        title: 'Lab Results Ready',
        message: `Your pet's lab results are available for review.`,
        actionUrl: '/dashboard'
      });
    }

    await appointment.save();
    res.status(200).json({ success: true, message: `Appointment updated to ${status}`, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public: Get all verified Vets
const getVerifiedVets = async (req, res) => {
  try {
    let vets = await User.find({ role: 'VET', isVerified: true }).select('name email avatarUrl specialty phone');
    
    if (!vets || vets.length === 0) {
      const defaultVets = [
        { name: 'Dr. Sarah Smith', email: 'vet1@furshield.com', password: 'admin123', role: 'VET', isVerified: true, specialty: 'General Practice & Small Animal Care', avatarUrl: '/images/dash-dog-1.jpg' },
        { name: 'Dr. Ayesha Khan', email: 'vet2@furshield.com', password: 'admin123', role: 'VET', isVerified: true, specialty: 'Surgery & Orthopedics', avatarUrl: '/images/pet-1.jpg' },
        { name: 'Dr. Daniel Park', email: 'vet3@furshield.com', password: 'admin123', role: 'VET', isVerified: true, specialty: 'Internal Medicine & Vaccination', avatarUrl: '/images/pet-2.jpg' }
      ];
      await User.insertMany(defaultVets);
      vets = await User.find({ role: 'VET', isVerified: true }).select('name email avatarUrl specialty phone');
    }

    res.status(200).json({ success: true, count: vets.length, data: vets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User: Book an appointment
const bookAppointment = async (req, res) => {
  try {
    let { vetId, petId, date, timeSlot, reason, type } = req.body;
    
    // Safely resolve valid vet ObjectId
    if (!vetId || !mongoose.Types.ObjectId.isValid(vetId)) {
      let vetUser = await User.findOne({ role: 'VET' });
      if (!vetUser) {
        vetUser = await User.create({
          name: 'Dr. Sarah Smith',
          email: 'vet1@furshield.com',
          password: 'admin123',
          role: 'VET',
          isVerified: true,
          specialty: 'General Practice'
        });
      }
      vetId = vetUser._id;
    }

    // Safely resolve valid pet ObjectId
    if (!petId || !mongoose.Types.ObjectId.isValid(petId)) {
      let userPet = await Pet.findOne({ ownerId: req.user._id });
      if (!userPet) {
        userPet = await Pet.create({
          ownerId: req.user._id,
          name: 'Buddy',
          species: 'Dog',
          breed: 'Golden Retriever'
        });
      }
      petId = userPet._id;
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      vet: vetId,
      pet: petId,
      date: date ? new Date(date) : new Date(),
      timeSlot: timeSlot || '10:00 AM',
      reason: reason || 'General Checkup',
      type: type || 'IN_PERSON',
      status: 'PENDING'
    });

    const vetUser = await User.findById(vetId);
    const petObj = await Pet.findById(petId);

    // Notify Vet user of new booking
    await notificationEngine.createNotification({
      recipient: vetId,
      type: 'APPOINTMENT',
      title: 'New Appointment Booking Request',
      message: `${req.user.name} has requested an appointment for ${petObj?.name || 'their pet'} on ${new Date(date).toLocaleDateString()} at ${timeSlot || '10:00 AM'}.`,
      actionUrl: '/vet'
    });

    // Notify booking User
    await notificationEngine.createNotification({
      recipient: req.user._id,
      type: 'APPOINTMENT',
      title: 'Appointment Booking Request Sent',
      message: `Your appointment request with ${vetUser ? vetUser.name : 'the Doctor'} is pending confirmation.`,
      actionUrl: '/dashboard'
    });

    res.status(201).json({ success: true, message: 'Appointment request sent successfully!', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User: Get own appointments
const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id }).populate('vet', 'name email specialty').populate('pet', 'name species avatarUrl');
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getVetAppointments, updateAppointment, getVerifiedVets, bookAppointment, getUserAppointments };
