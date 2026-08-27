const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/controllers/shelter.controller.js', 'utf8');

// Add AdoptionRequest import
code = code.replace(
  "const ShelterAnimal = require('../models/ShelterAnimal');",
  "const ShelterAnimal = require('../models/ShelterAnimal');\nconst AdoptionRequest = require('../models/AdoptionRequest');"
);

const newMethods = `
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
`;

// Insert new methods before module.exports
code = code.replace("module.exports = {", newMethods + "\nmodule.exports = {");

// Add to exports
code = code.replace(
  "module.exports = { getPipeline, updateAnimalStatus, addIntake, updateAnimal, deleteAnimal };",
  "module.exports = { getPipeline, updateAnimalStatus, addIntake, updateAnimal, deleteAnimal, addDailyLog, submitAdoptionRequest, getAdoptionRequests, updateAdoptionRequestStatus };"
);

// Update addIntake to capture Age
code = code.replace(
  "const { name, species, breed, status, medicalHolds, behaviorNotes } = req.body;",
  "const { name, species, breed, age, status, medicalHolds, behaviorNotes } = req.body;"
);
code = code.replace(
  "name,\n      species,\n      breed,",
  "name,\n      species,\n      breed,\n      age,"
);

fs.writeFileSync('d:/Pet-Care/server/controllers/shelter.controller.js', code);
