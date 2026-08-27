const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/VetHub.jsx', 'utf8');

code = code.replace(/\ufffd/g, '');

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/VetHub.jsx', code);
