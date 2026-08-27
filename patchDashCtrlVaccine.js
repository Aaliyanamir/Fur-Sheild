const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/controllers/dashboard.controller.js', 'utf8');

const newMethods = `
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
      fileUrl: req.file ? \`/uploads/\${req.file.filename}\` : req.body.fileUrl // Fallback for dummy URLs
    };

    pet.documents.push(newDoc);
    await pet.save();
    res.status(200).json({ success: true, data: pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
`;

code = code.replace(
  "module.exports = {",
  newMethods + "\nmodule.exports = {"
);

code = code.replace(
  "module.exports = { getMyPets, addPet, updateVitals, updatePet, deletePet, getVets, bookAppointment, getMyAppointments };",
  "module.exports = { getMyPets, addPet, updateVitals, updatePet, deletePet, getVets, bookAppointment, getMyAppointments, addVaccine, addDocument };"
);

fs.writeFileSync('d:/Pet-Care/server/controllers/dashboard.controller.js', code);
