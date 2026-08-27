const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/BookAppointment.jsx', 'utf8');

code = code.replace(/\\`http:\/\/localhost:5000\\\$\{(.*?)\}\\`/g, "`http://localhost:5000${$1}`");

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/BookAppointment.jsx', code);
