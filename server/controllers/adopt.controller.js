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

    // Optional: bind to logged in user if available
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

    // Notify the Shelter Admins
    // We can find all shelter admins (or specific shelter admin if we have one)
    const admins = await User.find({ role: 'SHELTER_ADMIN' });
    for (const admin of admins) {
      await notificationEngine.createNotification({
        recipient: admin._id,
        type: 'ADOPTION',
        title: 'New Adoption Request',
        message: `${applicantName} has applied to adopt ${animal.name}.`,
        actionUrl: '/shelter'
      });
    }

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAdoptableAnimals, submitPublicAdoptionRequest };
