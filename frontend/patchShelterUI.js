const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/ShelterHub.jsx', 'utf8');

code = code.replace(
  /\\`http:\/\/localhost:5000\\\$\{pet\.avatarUrl\}\\`/g,
  "`http://localhost:5000${pet.avatarUrl}`"
);

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/ShelterHub.jsx', code);
