const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/App.jsx', 'utf8');

code = code.replace(
  "<Route path=\"/adopt\" element={<AdoptionCatalog />} />\n          \n          {/* App Routes wrapped in the Global Layout */}\n          <Route element={<GlobalLayout />}>",
  "          {/* App Routes wrapped in the Global Layout */}\n          <Route element={<GlobalLayout />}>\n            <Route path=\"/adopt\" element={<AdoptionCatalog />} />"
);

fs.writeFileSync('d:/Pet-Care/frontend/src/App.jsx', code);
