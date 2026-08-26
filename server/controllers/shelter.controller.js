const ShelterAnimal = require('../models/ShelterAnimal');

// @desc    Get all shelter animals for the Kanban pipeline
// @route   GET /api/v1/shelter/pipeline
// @access  Private/ShelterAdmin
const getPipeline = async (req, res) => {
  try {
    const animals = await ShelterAnimal.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: animals.length, data: animals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update animal Kanban status
// @route   PATCH /api/v1/shelter/pipeline/:id/status
// @access  Private/ShelterAdmin
const updateAnimalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['INTAKE', 'VET_HOLD', 'FOSTER', 'ADOPTABLE', 'ADOPTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const animal = await ShelterAnimal.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!animal) {
      return res.status(404).json({ success: false, message: 'Animal not found' });
    }

    res.status(200).json({ success: true, data: animal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Intake new rescue with AI Triage log
// @route   POST /api/v1/shelter/intake
// @access  Private/ShelterAdmin
const addIntake = async (req, res) => {
  try {
    const { name, species, behaviorNotes, aiTriageLog } = req.body;

    const animal = await ShelterAnimal.create({
      name,
      species,
      behaviorNotes,
      aiTriageLog: aiTriageLog ? [aiTriageLog] : [] // If AI triage data is provided, push it as the first log
    });

    res.status(201).json({ success: true, data: animal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPipeline, updateAnimalStatus, addIntake };
