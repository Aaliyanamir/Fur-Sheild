const ShelterAnimal = require('../models/ShelterAnimal');
const AdoptionRequest = require('../models/AdoptionRequest');

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
    const { name, species, breed, behaviorNotes, aiTriageLog } = req.body;

    const animal = await ShelterAnimal.create({
      name,
      species,
      breed,
      age,
      behaviorNotes,
      aiTriageLog: aiTriageLog ? [aiTriageLog] : [],
      avatarUrl: req.file ? '/uploads/' + req.file.filename : undefined
    });

    res.status(201).json({ success: true, data: animal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Update animal details (Name, Breed, Photo, etc)
// @route   PATCH /api/v1/shelter/pipeline/:id
// @access  Private/ShelterAdmin
const updateAnimal = async (req, res) => {
  try {
    const { name, species, breed, behaviorNotes } = req.body;
    
    let animal = await ShelterAnimal.findById(req.params.id);
    if (!animal) {
      return res.status(404).json({ success: false, message: 'Animal not found' });
    }

    if (name) animal.name = name;
    if (species) animal.species = species;
    if (breed) animal.breed = breed;
    if (behaviorNotes) animal.behaviorNotes = behaviorNotes;
    if (req.file) animal.avatarUrl = '/uploads/' + req.file.filename;

    await animal.save();
    res.status(200).json({ success: true, data: animal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete animal
// @route   DELETE /api/v1/shelter/pipeline/:id
// @access  Private/ShelterAdmin
const deleteAnimal = async (req, res) => {
  try {
    const animal = await ShelterAnimal.findById(req.params.id);
    if (!animal) {
      return res.status(404).json({ success: false, message: 'Animal not found' });
    }
    
    await animal.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Add daily log
const addDailyLog = async (req, res) => {
  try {
    const animal = await ShelterAnimal.findById(req.params.id);
    if (!animal) return res.status(404).json({ success: false, message: 'Animal not found' });
    
    animal.dailyLogs.push({ ...req.body, loggedBy: req.user ? req.user.name : 'Staff' });
    await animal.save();
    res.status(200).json({ success: true, data: animal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit adoption request
const submitAdoptionRequest = async (req, res) => {
  try {
    const { animalId, applicantName, email, phone, livingSituation, experience, message } = req.body;
    const request = await AdoptionRequest.create({
      animalId,
      user: req.user ? req.user.id : null,
      applicantName,
      email,
      phone,
      livingSituation,
      experience,
      message
    });
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get adoption requests
const getAdoptionRequests = async (req, res) => {
  try {
    const requests = await AdoptionRequest.find().populate('animalId').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update adoption request status
const updateAdoptionRequestStatus = async (req, res) => {
  try {
    const request = await AdoptionRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    
    request.status = req.body.status;
    await request.save();
    
    // If approved, update animal status
    if (req.body.status === 'Approved') {
      const animal = await ShelterAnimal.findById(request.animalId);
      if (animal) {
        animal.status = 'ADOPTED';
        await animal.save();
      }
    }
    
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPipeline, updateAnimalStatus, addIntake, updateAnimal, deleteAnimal, addDailyLog, submitAdoptionRequest, getAdoptionRequests, updateAdoptionRequestStatus };

