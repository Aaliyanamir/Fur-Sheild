const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', 'utf8');

code = code.replace(
  "{ name: 'Rescue Pipeline', path: '/shelter', icon: ClipboardList },",
  "{ name: 'Rescue Pipeline', path: '/pipeline', icon: ClipboardList },"
);

fs.writeFileSync('d:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', code);
