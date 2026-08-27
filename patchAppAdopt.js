const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/App.jsx', 'utf8');

if (!code.includes("import AdoptionCatalog")) {
    code = code.replace(
      "import Settings from './pages/Settings';",
      "import Settings from './pages/Settings';\nimport AdoptionCatalog from './pages/AdoptionCatalog';"
    );
    code = code.replace(
      /<Route path="\/signup" element=\{<Signup \/>\} \/>/g,
      `<Route path="/signup" element={<Signup />} />\n        <Route path="/adopt" element={<AdoptionCatalog />} />`
    );
    fs.writeFileSync('d:/Pet-Care/frontend/src/App.jsx', code);
}
