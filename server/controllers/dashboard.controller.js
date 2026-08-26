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
    const { name, species, breed, dob, gender, age, microchipId } = req.body;
    let avatarUrl = req.body.avatarUrl;
    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`;
    }
    
    const pet = await Pet.create({
        ownerId: req.user.id,
        name,
        species,
        breed,
        dob,
        gender,
        age,
        microchipId,
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


// @desc    Update a pet profile
// @route   PUT /api/v1/dashboard/pets/:id
// @access  Private
const updatePet = async (req, res) => {
  try {
    let pet = await Pet.findOne({ _id: req.params.id, ownerId: req.user.id });
    
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    if (req.file) {
      req.body.avatarUrl = `/uploads/${req.file.filename}`;
    }

    pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a pet profile
// @route   DELETE /api/v1/dashboard/pets/:id
// @access  Private
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, ownerId: req.user.id });
    
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    await pet.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get all Vets
// @route   GET /api/v1/dashboard/vets
// @access  Private
const getVets = async (req, res) => {
  try {
    const vets = await User.find({ role: 'VET' }).select('name email avatarUrl');
    res.status(200).json({ success: true, count: vets.length, data: vets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Book an appointment
// @route   POST /api/v1/dashboard/appointments
// @access  Private
const bookAppointment = async (req, res) => {
  try {
    const { petId, vetId, scheduledAt, reason, severity } = req.body;
    
    const appointment = await Appointment.create({
      ownerId: req.user.id,
      petId,
      vetId,
      scheduledAt,
      reason,
      severity: severity || 'ROUTINE',
      status: 'WAITING'
    });
    
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Owner Appointments
// @route   GET /api/v1/dashboard/appointments
// @access  Private
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ ownerId: req.user.id })
      .populate('petId', 'name avatarUrl species')
      .populate('vetId', 'name avatarUrl')
      .sort({ scheduledAt: 1 });
      
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Add a vaccine record
// @route   POST /api/v1/dashboard/pets/:id/vaccinations
// @access  Private
const addVaccine = async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, ownerId: req.user.id });
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });

    pet.medicalPassport.vaccinations.push(req.body);
    await pet.save();
    res.status(200).json({ success: true, data: pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a document record
// @route   POST /api/v1/dashboard/pets/:id/documents
// @access  Private
const addDocument = async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, ownerId: req.user.id });
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });

    const newDoc = {
      title: req.body.title,
      docType: req.body.docType || 'Other',
      fileUrl: req.file ? `/uploads/${req.file.filename}` : req.body.fileUrl // Fallback for dummy URLs
    };

    pet.documents.push(newDoc);
    await pet.save();
    res.status(200).json({ success: true, data: pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMyPets, addPet, updateVitals, updatePet, deletePet, getVets, bookAppointment, getMyAppointments, addVaccine, addDocument };





