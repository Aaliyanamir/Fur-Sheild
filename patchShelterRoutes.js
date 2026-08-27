const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/routes/shelter.routes.js', 'utf8');

const imports = "const { getPipeline, updateAnimalStatus, addIntake, updateAnimal, deleteAnimal, addDailyLog, submitAdoptionRequest, getAdoptionRequests, updateAdoptionRequestStatus } = require('../controllers/shelter.controller');";
code = code.replace(/const \{ getPipeline.*\} = require\('\.\.\/controllers\/shelter\.controller'\);/, imports);

const newRoutes = `
router.route('/pipeline/:id/logs').post(addDailyLog);
router.route('/adoption-requests').post(submitAdoptionRequest).get(getAdoptionRequests);
router.route('/adoption-requests/:id/status').patch(updateAdoptionRequestStatus);
`;

code = code.replace(
  "module.exports = router;",
  newRoutes + "\nmodule.exports = router;"
);

fs.writeFileSync('d:/Pet-Care/server/routes/shelter.routes.js', code);
