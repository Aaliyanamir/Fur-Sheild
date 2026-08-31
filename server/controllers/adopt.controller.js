const ShelterAnimal = require('../models/ShelterAnimal');
const AdoptionRequest = require('../models/AdoptionRequest');
const notificationEngine = require('../utils/notificationEngine');
const User = require('../models/User');

const getAdoptableAnimals = async (req, res) => {
  try {
    const animals = await ShelterAnimal.find({ status: 'ADOPTABLE' }).populate('shelterId', 'name email');
    res.status(200).json({ success: true, count: animals.length, data: animals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitPublicAdoptionRequest = async (req, res) => {
  try {
    const { animalId, applicantName, email, phone, livingSituation, experience, message } = req.body;
    
    const animal = await ShelterAnimal.findById(animalId);
    if (!animal) return res.status(404).json({ success: false, message: 'Animal not found' });

    const userId = req.user ? req.user._id : null;

    const request = await AdoptionRequest.create({
      animalId,
      shelterId: animal.shelterId,
      userId,
      applicantName,
      email,
      phone,
      livingSituation,
      experience,
      message,
      status: 'PENDING'
    });

    // Also link user and update status to ADOPTED if instant adoption requested
    animal.status = 'ADOPTED';
    animal.adoptedBy = userId;
    await animal.save();

    // Notify the Shelter Admins
    const admins = await User.find({ role: 'SHELTER_ADMIN' });
    for (const admin of admins) {
      await notificationEngine.createNotification({
        recipient: admin._id,
        type: 'ADOPTION',
        title: 'New Adoption Registered',
        message: `${applicantName} has adopted ${animal.name}.`,
        actionUrl: '/shelter'
      });
    }

    res.status(201).json({ success: true, data: request, animal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adoptPetDirect = async (req, res) => {
  try {
    const { petId } = req.params;
    const animal = await ShelterAnimal.findById(petId);
    if (!animal) return res.status(404).json({ success: false, message: 'Pet not found' });

    animal.status = 'ADOPTED';
    if (req.user) {
      animal.adoptedBy = req.user._id;
    }
    await animal.save();

    res.status(200).json({ success: true, message: `${animal.name} successfully adopted!`, data: animal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAdoptableAnimals, submitPublicAdoptionRequest, adoptPetDirect };

