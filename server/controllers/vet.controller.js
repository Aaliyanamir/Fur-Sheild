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
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add medical notes to appointment
// @route   PATCH /api/v1/vethub/queue/:id/notes
// @access  Private/Vet
const addMedicalNotes = async (req, res) => {
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
};

module.exports = { getQueue, updateAppointmentStatus, addMedicalNotes };
