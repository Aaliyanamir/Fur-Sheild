const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/controllers/shelter.controller.js', 'utf8');

// Update addIntake to handle breed, avatarUrl
code = code.replace(
  "const { name, species, behaviorNotes, aiTriageLog } = req.body;",
  "const { name, species, breed, behaviorNotes, aiTriageLog } = req.body;"
);

code = code.replace(
  /const animal = await ShelterAnimal\.create\(\{[\s\S]*?\}\);/,
  `const animal = await ShelterAnimal.create({
      name,
      species,
      breed,
      behaviorNotes,
      aiTriageLog: aiTriageLog ? [aiTriageLog] : [],
      avatarUrl: req.file ? '/uploads/' + req.file.filename : undefined
    });`
);

// Add updateAnimal and deleteAnimal
const newControllers = `
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

module.exports = { getPipeline, updateAnimalStatus, addIntake, updateAnimal, deleteAnimal };
`;

code = code.replace("module.exports = { getPipeline, updateAnimalStatus, addIntake };", newControllers);

fs.writeFileSync('d:/Pet-Care/server/controllers/shelter.controller.js', code);
