const Pet = require('../models/Pet');

// @desc    Get all pets for the logged-in owner
// @route   GET /api/v1/dashboard/pets
// @access  Private
const getMyPets = async (req, res) => {
  try {
    // Only fetch pets belonging to the authenticated user
    const pets = await Pet.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: pets.length, data: pets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a new pet profile
// @route   POST /api/v1/dashboard/pets
// @access  Private
const addPet = async (req, res) => {
  try {
    const { name, species, breed, dob, avatarUrl } = req.body;
    
    const pet = await Pet.create({
      ownerId: req.user.id, // Securely link pet to the active user
      name,
      species,
      breed,
      dob,
      avatarUrl
    });
    
    res.status(201).json({ success: true, data: pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update pet vitals (append to weight history)
// @route   PATCH /api/v1/dashboard/pets/:id/vitals
// @access  Private
const updateVitals = async (req, res) => {
  try {
    const { weight } = req.body;
    
    // Find the pet and ensure it belongs to the logged-in user
    const pet = await Pet.findOne({ _id: req.params.id, ownerId: req.user.id });
    
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found or unauthorized access' });
    }

    if (weight) {
      pet.weightHistory.push({ weight, date: Date.now() });
    }

    await pet.save();
    res.status(200).json({ success: true, data: pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMyPets, addPet, updateVitals };
