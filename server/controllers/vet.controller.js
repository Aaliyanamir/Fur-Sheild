const Appointment = require('../models/Appointment');

// @desc    Get active veterinary queue (excluding discharged)
// @route   GET /api/v1/vethub/queue
// @access  Private/Vet
const getQueue = async (req, res) => {
  try {
    const queue = await Appointment.find({ status: { $ne: 'DISCHARGED' } })
      .populate('petId', 'name species breed avatarUrl')
      .populate('ownerId', 'name phone')
      .sort({ severity: -1, scheduledAt: 1 }); // Sort by severity, then time

    res.status(200).json({ success: true, count: queue.length, data: queue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment status
// @route   PATCH /api/v1/vethub/queue/:id/status
// @access  Private/Vet
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate enum
    if (!['WAITING', 'EXAM', 'DISCHARGED', 'CANCELLED'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, vetId: req.user.id }, // Assign the current vet
      { new: true, runValidators: true }
    ).populate('petId', 'name species breed avatarUrl').populate('ownerId', 'name phone');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add medical notes and vitals to appointment
// @route   PATCH /api/v1/vethub/queue/:id/vitals
// @access  Private/Vet
const updateVitalsAndNotes = async (req, res) => {
  try {
    const { medicalNotes, vitals } = req.body;
    let updateFields = {};
    if (medicalNotes !== undefined) updateFields.medicalNotes = medicalNotes;
    if (vitals !== undefined) updateFields.vitals = vitals;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate('petId', 'name species breed avatarUrl').populate('ownerId', 'name phone');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new appointment (Walk-in)
// @route   POST /api/v1/vethub/queue
// @access  Private/Vet
const createAppointment = async (req, res) => {
  try {
    const { petId, reason, severity, ownerId: reqOwnerId } = req.body;
    const mongoose = require('mongoose');
    let ownerId = reqOwnerId;
    
    if (petId) {
      const Pet = mongoose.model('Pet');
      const pet = await Pet.findById(petId);
      if (pet) ownerId = pet.ownerId;
    }

    if (!ownerId) ownerId = req.user.id; 

    const appointment = await Appointment.create({
      petId,
      ownerId,
      vetId: req.user.id,
      status: 'WAITING',
      severity: severity || 'ROUTINE',
      reason: reason || 'Walk-in',
      scheduledAt: new Date()
    });

    const populatedAppt = await Appointment.findById(appointment._id)
      .populate('petId', 'name species breed avatarUrl')
      .populate('ownerId', 'name phone');

    res.status(201).json({ success: true, data: populatedAppt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete/Cancel appointment
// @route   DELETE /api/v1/vethub/queue/:id
// @access  Private/Vet
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    await appointment.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getQueue, updateAppointmentStatus, updateVitalsAndNotes, createAppointment, deleteAppointment };
