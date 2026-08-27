const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/routes/vet.routes.js', 'utf8');

code = code.replace(
  "const { getQueue, updateAppointmentStatus, addMedicalNotes } = require('../controllers/vet.controller');",
  "const { getQueue, updateAppointmentStatus, updateVitalsAndNotes, createAppointment, deleteAppointment } = require('../controllers/vet.controller');"
);

code = code.replace("router.patch('/queue/:id/notes', addMedicalNotes);", "router.patch('/queue/:id/vitals', updateVitalsAndNotes);\nrouter.post('/queue', createAppointment);\nrouter.delete('/queue/:id', deleteAppointment);");

fs.writeFileSync('d:/Pet-Care/server/routes/vet.routes.js', code);
