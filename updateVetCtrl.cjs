const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/controllers/vet.controller.js', 'utf8');

// Replace addMedicalNotes with updateVitalsAndNotes
const oldAddNotes = `const addMedicalNotes = async (req, res) => {
  try {
    const { medicalNotes } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { medicalNotes },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};`;

const newVitalsAndNotes = `const updateVitalsAndNotes = async (req, res) => {
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
    // For walk-ins, we can assign it to a dummy owner or fetch owner from petId.
    // If petId is provided, we fetch ownerId from Pet.
    const { petId, reason, severity, ownerId: reqOwnerId } = req.body;
    const mongoose = require('mongoose');
    let ownerId = reqOwnerId;
    
    if (petId) {
      const Pet = mongoose.model('Pet');
      const pet = await Pet.findById(petId);
      if (pet) ownerId = pet.ownerId;
    }

    // fallback to a dummy objectId if ownerId is completely missing for walk-ins (not recommended but avoids crash)
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
    
    // Instead of actually deleting, we can cancel it or delete it.
    await appointment.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};`;

code = code.replace(oldAddNotes, newVitalsAndNotes);
code = code.replace("module.exports = { getQueue, updateAppointmentStatus, addMedicalNotes };", "module.exports = { getQueue, updateAppointmentStatus, updateVitalsAndNotes, createAppointment, deleteAppointment };");

// Fix updateAppointmentStatus to populate petId and ownerId so frontend gets the full object on return
code = code.replace(
  `const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, vetId: req.user.id }, // Assign the current vet
      { new: true, runValidators: true }
    );`,
  `const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, vetId: req.user.id }, // Assign the current vet
      { new: true, runValidators: true }
    ).populate('petId', 'name species breed avatarUrl').populate('ownerId', 'name phone');`
);

fs.writeFileSync('d:/Pet-Care/server/controllers/vet.controller.js', code);
