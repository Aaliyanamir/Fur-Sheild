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
    let walkInDetails = req.body.walkInDetails;
    
    // If sent via FormData, walkInDetails might be a stringified JSON
    if (typeof walkInDetails === 'string') {
      try { walkInDetails = JSON.parse(walkInDetails); } catch(e) {}
    }
    
    // Fallback if frontend sends flat fields for walkin (FormData doesn't nest easily)
    if (!walkInDetails && req.body.petName) {
      walkInDetails = {
        petName: req.body.petName,
        breed: req.body.breed,
        species: req.body.species,
        age: req.body.age,
        ownerName: req.body.ownerName
      };
    }

    if (req.file && walkInDetails) {
      walkInDetails.petAvatarUrl = `/uploads/${req.file.filename}`;
    }

    const mongoose = require('mongoose');
    let ownerId = reqOwnerId;
    
    if (petId) {
      const Pet = mongoose.model('Pet');
      const pet = await Pet.findById(petId);
      if (pet) ownerId = pet.ownerId;
    }

    // if no petId, it's a pure walkin
    if (!ownerId && !walkInDetails) ownerId = req.user.id; 

    const appointment = await Appointment.create({
      petId: petId || undefined,
      ownerId: ownerId || undefined,
      walkInDetails,
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


// @desc    Update Walk-in / Pet details
// @route   PATCH /api/v1/vethub/queue/:id/walkin
// @access  Private/Vet
const updateWalkin = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    let walkInDetails = req.body.walkInDetails;
    if (typeof walkInDetails === 'string') {
      try { walkInDetails = JSON.parse(walkInDetails); } catch(e) {}
    }
    
    if (!walkInDetails && req.body.petName) {
      walkInDetails = {
        petName: req.body.petName,
        breed: req.body.breed,
        species: req.body.species,
        age: req.body.age,
        ownerName: req.body.ownerName
      };
    }

    if (appointment.walkInDetails) {
      appointment.walkInDetails = { ...appointment.walkInDetails, ...walkInDetails };
      if (req.file) {
        appointment.walkInDetails.petAvatarUrl = '/uploads/' + req.file.filename;
      }
      await appointment.save();
    } else if (appointment.petId) {
      // If it's a registered pet, we update the Pet model
      const mongoose = require('mongoose');
      const Pet = mongoose.model('Pet');
      const pet = await Pet.findById(appointment.petId);
      if (pet) {
        pet.name = walkInDetails.petName || pet.name;
        pet.breed = walkInDetails.breed || pet.breed;
        pet.species = walkInDetails.species || pet.species;
        pet.age = walkInDetails.age || pet.age;
        if (req.file) {
          pet.avatarUrl = '/uploads/' + req.file.filename;
        }
        await pet.save();
      }
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { updateWalkin,  getQueue, updateAppointmentStatus, updateVitalsAndNotes, createAppointment, deleteAppointment };
