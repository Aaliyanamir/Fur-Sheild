const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/controllers/shelter.controller.js', 'utf8');

code = code.replace(
  "const { name, species, breed, behaviorNotes, aiTriageLog } = req.body;",
  "const { name, species, breed, age, behaviorNotes, aiTriageLog } = req.body;"
);

fs.writeFileSync('d:/Pet-Care/server/controllers/shelter.controller.js', code);
