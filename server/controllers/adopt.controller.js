const ShelterAnimal = require('../models/ShelterAnimal');
const AdoptionRequest = require('../models/AdoptionRequest');
const notificationEngine = require('../utils/notificationEngine');
const User = require('../models/User');

const seedFallbackAnimals = async () => {
  const defaultAnimals = [
    { name: 'Max', species: 'Dog', breed: 'Beagle', age: '2 Years', status: 'ADOPTABLE', adoptionFee: 0, pickupAddress: 'Gulberg III, Lahore', avatarUrl: '/images/pet-1.jpg', behaviorNotes: 'Friendly, playful, loves children and long walks.' },
    { name: 'Cleo', species: 'Cat', breed: 'Persian', age: '1 Year', status: 'ADOPTABLE', adoptionFee: 15, pickupAddress: 'DHA Phase 5, Karachi', avatarUrl: '/images/pet-2.jpg', behaviorNotes: 'Calm and affectionate lap cat.' },
    { name: 'Sunny', species: 'Bird', breed: 'Sun Conure', age: '3 Years', status: 'ADOPTABLE', adoptionFee: 0, pickupAddress: 'F-7/2, Islamabad', avatarUrl: '/images/signup-bird.jpg', behaviorNotes: 'Social, cheerful, and hand-trained.' },
    { name: 'Nova', species: 'Dog', breed: 'German Shepherd Mix', age: '8 Months', status: 'ADOPTABLE', adoptionFee: 20, pickupAddress: 'Johar Town, Lahore', avatarUrl: '/images/dash-dog-1.jpg', behaviorNotes: 'Young and energetic, needs gentle socialization.' },
    { name: 'Bella', species: 'Cat', breed: 'Tabby', age: '2 Years', status: 'ADOPTABLE', adoptionFee: 0, pickupAddress: 'Clifton Block 4, Karachi', avatarUrl: '/images/pet-3.jpg', behaviorNotes: 'Playful and curious, loves interactive toys.' },
    { name: 'Whiskers', species: 'Cat', breed: 'Siamese Mix', age: '4 Months', status: 'ADOPTED', adoptionFee: 0, pickupAddress: 'F-6, Islamabad', avatarUrl: '/images/pet-2.jpg', behaviorNotes: 'Tiny kitten, very affectionate.', adopterInfo: { applicantName: 'Amina Sheikh', email: 'amina@gmail.com', phone: '+92 300 9876543', paymentStatus: 'Paid' } }
  ];

  const existingCount = await ShelterAnimal.countDocuments();
  if (existingCount === 0) {
    await ShelterAnimal.insertMany(defaultAnimals);
  }
};

const getAdoptableAnimals = async (req, res) => {
  try {
    await seedFallbackAnimals();

    const animals = await ShelterAnimal.find({ status: { $in: ['ADOPTABLE', 'ADOPTED'] } })
      .populate('postedBy', 'name email phone')
      .populate('adoptedBy', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: animals.length, data: animals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const listUserPetForAdoption = async (req, res) => {
  try {
    const { name, species, breed, age, gender, behaviorNotes, pickupAddress, adoptionFee, phone } = req.body;
    
    if (!name || !species) {
      return res.status(400).json({ success: false, message: 'Pet name and species are required' });
    }

    const animal = await ShelterAnimal.create({
      name,
      species,
      breed: breed || species,
      age: age || 'Young',
      gender: gender || 'Male',
      behaviorNotes: behaviorNotes || 'Looking for a safe and loving home.',
      pickupAddress: pickupAddress || 'Contact owner for pickup address',
      adoptionFee: Number(adoptionFee) || 0,
      avatarUrl: req.body.avatarUrl || (req.file ? '/uploads/' + req.file.filename : undefined),
      postedBy: req.user._id,
      ownerContact: {
        name: req.user.name,
        email: req.user.email,
        phone: phone || req.user.phone || ''
      },
      status: 'ADOPTABLE'
    });

    res.status(201).json({ success: true, message: 'Pet successfully listed for adoption!', data: animal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyAdoptionListings = async (req, res) => {
  try {
    const animals = await ShelterAnimal.find({ postedBy: req.user._id })
      .populate('adoptedBy', 'name email phone')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: animals.length, data: animals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateMyListingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const animal = await ShelterAnimal.findOne({ _id: req.params.id, postedBy: req.user._id });
    if (!animal) return res.status(404).json({ success: false, message: 'Adoption listing not found or unauthorized' });

    if (status) animal.status = status;
    await animal.save();

    res.status(200).json({ success: true, message: 'Listing status updated', data: animal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMyListing = async (req, res) => {
  try {
    const animal = await ShelterAnimal.findOne({ _id: req.params.id, postedBy: req.user._id });
    if (!animal) return res.status(404).json({ success: false, message: 'Adoption listing not found or unauthorized' });

    await animal.deleteOne();
    res.status(200).json({ success: true, message: 'Adoption listing removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitPublicAdoptionRequest = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    let { animalId, applicantName, email, phone, livingSituation, experience, message, paymentMethod, paymentAmount } = req.body;

    let animal = null;
    if (animalId && mongoose.Types.ObjectId.isValid(animalId)) {
      animal = await ShelterAnimal.findById(animalId);
    }

    if (!animal) {
      animal = await ShelterAnimal.findOne({ status: 'ADOPTABLE' });
    }

    if (!animal) {
      await seedFallbackAnimals();
      animal = await ShelterAnimal.findOne({ status: 'ADOPTABLE' });
    }

    if (!animal) {
      return res.status(404).json({ success: false, message: 'Animal not found. Please try again later.' });
    }

    if (animal.status === 'ADOPTED') {
      return res.status(400).json({ success: false, message: 'This pet has already been adopted!' });
    }

    const userId = req.user ? req.user._id : null;
    const safeApplicantName = applicantName || (req.user ? req.user.name : 'Adopter');
    const safeEmail = email || (req.user ? req.user.email : '');
    const safePhone = phone || (req.user ? req.user.phone : '');
    const chosenPaymentMethod = paymentMethod || 'Cash on Pickup';
    const chosenPaymentAmount = Number(paymentAmount) || Number(animal.adoptionFee || 0);

    const request = await AdoptionRequest.create({
      animalId: animal._id,
      user: userId,
      shelterId: animal.postedBy || animal.shelterId || undefined,
      applicantName: safeApplicantName,
      email: safeEmail,
      phone: safePhone,
      livingSituation: livingSituation || 'N/A',
      experience: experience || 'N/A',
      message: message || '',
      paymentMethod: chosenPaymentMethod,
      paymentAmount: chosenPaymentAmount,
      paymentStatus: 'Paid',
      status: 'Approved',
      petSnapshot: {
        name: animal.name,
        species: animal.species,
        breed: animal.breed,
        age: animal.age,
        adoptionFee: Number(animal.adoptionFee || 0),
        pickupAddress: animal.pickupAddress
      }
    });

    animal.status = 'ADOPTED';
    animal.adoptedBy = userId;
    animal.adoptedAt = new Date();
    animal.adopterInfo = {
      applicantName: safeApplicantName,
      email: safeEmail,
      phone: safePhone,
      livingSituation: livingSituation || 'N/A',
      experience: experience || 'N/A',
      paymentMethod: chosenPaymentMethod,
      paymentStatus: 'Paid',
      paymentAmount: chosenPaymentAmount,
      message: message || ''
    };
    await animal.save();

    if (animal.postedBy) {
      await notificationEngine.createNotification({
        recipient: animal.postedBy,
        type: 'ADOPTION',
        title: 'Pet Adopted!',
        message: `Great news! ${safeApplicantName} has adopted your pet ${animal.name}. Contact phone: ${safePhone || 'See details'}.`,
        actionUrl: '/dashboard'
      });
    }

    if (userId) {
      await notificationEngine.createNotification({
        recipient: userId,
        type: 'ADOPTION',
        title: 'Adoption Confirmed!',
        message: `Your adoption of ${animal.name} has been completed! Please check pickup details.`,
        actionUrl: '/adoption'
      });
    }

    const admins = await User.find({ role: 'SHELTER_ADMIN' });
    for (const admin of admins) {
      await notificationEngine.createNotification({
        recipient: admin._id,
        type: 'ADOPTION',
        title: 'New Adoption Completed',
        message: `${safeApplicantName} has adopted ${animal.name}.`,
        actionUrl: '/shelter'
      });
    }

    res.status(201).json({ success: true, data: request, animal, message: 'Adoption completed successfully!' });
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
    animal.adoptedAt = new Date();
    if (req.user) {
      animal.adoptedBy = req.user._id;
      animal.adopterInfo = {
        applicantName: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '',
        paymentStatus: 'Paid',
        paymentMethod: 'Instant Direct Adoption'
      };
    }
    await animal.save();

    res.status(200).json({ success: true, message: `${animal.name} successfully adopted!`, data: animal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdoptableAnimals,
  listUserPetForAdoption,
  getMyAdoptionListings,
  updateMyListingStatus,
  deleteMyListing,
  submitPublicAdoptionRequest,
  adoptPetDirect
};

