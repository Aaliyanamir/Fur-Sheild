const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/App.jsx', 'utf8');

if (!code.includes("import MyPets")) {
  code = code.replace(
    "import OwnerDashboard from './pages/OwnerDashboard';", 
    "import OwnerDashboard from './pages/OwnerDashboard';\nimport MyPets from './pages/MyPets';"
  );
}

if (!code.includes('path="/my-pets"')) {
  code = code.replace(
    `<Route path="/dashboard" element={<OwnerDashboard />} />`,
    `<Route path="/dashboard" element={<OwnerDashboard />} />\n              <Route path="/my-pets" element={<MyPets />} />`
  );
}

fs.writeFileSync('d:/Pet-Care/frontend/src/App.jsx', code);
