const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/App.jsx', 'utf8');

if (!code.includes("import ShelterDashboard")) {
    code = code.replace(
      "import ShelterHub from './pages/ShelterHub';",
      "import ShelterHub from './pages/ShelterHub';\nimport ShelterDashboard from './pages/ShelterDashboard';"
    );
}

code = code.replace(
  /<Route path="\/shelter" element=\{<ShelterHub \/>\} \/>/g,
  `<Route path="/shelter" element={<ShelterDashboard />} />\n              <Route path="/pipeline" element={<ShelterHub />} />`
);

fs.writeFileSync('d:/Pet-Care/frontend/src/App.jsx', code);
