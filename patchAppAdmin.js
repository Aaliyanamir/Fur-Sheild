const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/App.jsx', 'utf8');

if (!code.includes("import SuperAdmin")) {
  code = code.replace(
    "import Checkout from './pages/Checkout';",
    "import Checkout from './pages/Checkout';\nimport SuperAdmin from './pages/SuperAdmin';"
  );
  
  code = code.replace(
    /<Route path="\/dashboard" element=\{/g,
    `<Route path="/admin" element={\n          <ProtectedRoute>\n            <SuperAdmin />\n          </ProtectedRoute>\n        } />\n        <Route path="/dashboard" element={`
  );
  
  fs.writeFileSync('d:/Pet-Care/frontend/src/App.jsx', code);
}
