const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/ShelterDashboard.jsx', 'utf8');
code = code.replace(/\\`/g, '`');
fs.writeFileSync('d:/Pet-Care/frontend/src/pages/ShelterDashboard.jsx', code);
