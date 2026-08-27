const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/App.jsx', 'utf8');

code = code.replace(
  "import VetHub from './pages/VetHub';",
  "import VetHub from './pages/VetHub';\nimport VetAppointments from './pages/VetAppointments';"
);

code = code.replace(
  /<Route path="\/vet" element=\{<VetHub \/>\} \/>/g,
  `<Route path="/vet" element={<VetHub />} />\n              <Route path="/appointments" element={<VetAppointments />} />`
);

fs.writeFileSync('d:/Pet-Care/frontend/src/App.jsx', code);
