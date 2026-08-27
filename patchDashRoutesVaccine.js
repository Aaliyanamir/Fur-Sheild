const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/routes/dashboard.routes.js', 'utf8');

code = code.replace(
  "const { getMyPets, addPet, updateVitals, updatePet, deletePet, getVets, bookAppointment, getMyAppointments } = require('../controllers/dashboard.controller');",
  "const { getMyPets, addPet, updateVitals, updatePet, deletePet, getVets, bookAppointment, getMyAppointments, addVaccine, addDocument } = require('../controllers/dashboard.controller');"
);

const routesToAdd = `
router.post('/pets/:id/vaccinations', addVaccine);
router.post('/pets/:id/documents', upload.single('document'), addDocument);
`;

code = code.replace(
  "router.route('/pets/:id').put(upload.single('avatar'), updatePet).delete(deletePet);",
  "router.route('/pets/:id').put(upload.single('avatar'), updatePet).delete(deletePet);\n" + routesToAdd
);

fs.writeFileSync('d:/Pet-Care/server/routes/dashboard.routes.js', code);
