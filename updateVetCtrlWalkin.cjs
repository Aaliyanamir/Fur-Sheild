const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/controllers/vet.controller.js', 'utf8');

code = code.replace(
  `const createAppointment = async (req, res) => {
  try {
    const { petId, reason, severity, ownerId: reqOwnerId } = req.body;
    const mongoose = require('mongoose');
    let ownerId = reqOwnerId;
    
    if (petId) {
      const Pet = mongoose.model('Pet');
      const pet = await Pet.findById(petId);
      if (pet) ownerId = pet.ownerId;
    }

    if (!ownerId) ownerId = req.user.id; 

    const appointment = await Appointment.create({
      petId,
      ownerId,
      vetId: req.user.id,
      status: 'WAITING',
      severity: severity || 'ROUTINE',
      reason: reason || 'Walk-in',
      scheduledAt: new Date()
    });`,
  `const createAppointment = async (req, res) => {
  try {
    const { petId, reason, severity, ownerId: reqOwnerId, walkInDetails } = req.body;
    const mongoose = require('mongoose');
    let ownerId = reqOwnerId;
    
    if (petId) {
      const Pet = mongoose.model('Pet');
      const pet = await Pet.findById(petId);
      if (pet) ownerId = pet.ownerId;
    }

    // if no petId, it's a pure walkin
    if (!ownerId && !walkInDetails) ownerId = req.user.id; 

    const appointment = await Appointment.create({
      petId: petId || undefined,
      ownerId: ownerId || undefined,
      walkInDetails,
      vetId: req.user.id,
      status: 'WAITING',
      severity: severity || 'ROUTINE',
      reason: reason || 'Walk-in',
      scheduledAt: new Date()
    });`
);

fs.writeFileSync('d:/Pet-Care/server/controllers/vet.controller.js', code);
