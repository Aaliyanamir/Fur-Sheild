const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/controllers/vet.controller.js', 'utf8');

const updateWalkinStr = `
// @desc    Update Walk-in / Pet details
// @route   PATCH /api/v1/vethub/queue/:id/walkin
// @access  Private/Vet
const updateWalkin = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    let walkInDetails = req.body.walkInDetails;
    if (typeof walkInDetails === 'string') {
      try { walkInDetails = JSON.parse(walkInDetails); } catch(e) {}
    }
    
    if (!walkInDetails && req.body.petName) {
      walkInDetails = {
        petName: req.body.petName,
        breed: req.body.breed,
        species: req.body.species,
        age: req.body.age,
        ownerName: req.body.ownerName
      };
    }

    if (appointment.walkInDetails) {
      appointment.walkInDetails = { ...appointment.walkInDetails, ...walkInDetails };
      if (req.file) {
        appointment.walkInDetails.petAvatarUrl = '/uploads/' + req.file.filename;
      }
      await appointment.save();
    } else if (appointment.petId) {
      // If it's a registered pet, we update the Pet model
      const mongoose = require('mongoose');
      const Pet = mongoose.model('Pet');
      const pet = await Pet.findById(appointment.petId);
      if (pet) {
        pet.name = walkInDetails.petName || pet.name;
        pet.breed = walkInDetails.breed || pet.breed;
        pet.species = walkInDetails.species || pet.species;
        pet.age = walkInDetails.age || pet.age;
        if (req.file) {
          pet.avatarUrl = '/uploads/' + req.file.filename;
        }
        await pet.save();
      }
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
`;

code = code.replace(/module\.exports = \{/, updateWalkinStr + '\nmodule.exports = { updateWalkin, ');

fs.writeFileSync('d:/Pet-Care/server/controllers/vet.controller.js', code);
