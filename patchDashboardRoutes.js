const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/routes/dashboard.routes.js', 'utf8');

code = code.replace(
  "const { getMyPets, addPet, updateVitals, updatePet, deletePet } = require('../controllers/dashboard.controller');",
  "const { getMyPets, addPet, updateVitals, updatePet, deletePet, getVets, bookAppointment, getMyAppointments } = require('../controllers/dashboard.controller');"
);

const routesToAdd = `
router.get('/vets', getVets);
router.route('/appointments')
  .get(getMyAppointments)
  .post(bookAppointment);
`;

code = code.replace(
  "module.exports = router;",
  routesToAdd + "\nmodule.exports = router;"
);

fs.writeFileSync('d:/Pet-Care/server/routes/dashboard.routes.js', code);
