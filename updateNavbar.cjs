const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', 'utf8');

code = code.replace(
  "{ name: 'My Pets', path: '/dashboard', icon: PawPrint }",
  "{ name: 'My Pets', path: '/my-pets', icon: PawPrint }"
);

fs.writeFileSync('d:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', code);
