const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/OwnerDashboard.jsx', 'utf8');

const badStr = "\\http://localhost:5000\\\\";
const goodStr = "`http://localhost:5000${activePet.avatarUrl}`";

code = code.replace(badStr, goodStr);
// Let's just do a regex replace to be safe.
code = code.replace(/\\http:\/\/localhost:5000\\\\/g, "`http://localhost:5000${activePet.avatarUrl}`");

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/OwnerDashboard.jsx', code);
