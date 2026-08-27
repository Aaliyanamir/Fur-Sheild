const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/VetHub.jsx');

// Remove null bytes
let clean = Buffer.from(code.filter(b => b !== 0)).toString('utf8');
clean = clean.replace(/\ufffd/g, '');

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/VetHub.jsx', clean);
