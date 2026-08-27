const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/App.jsx', 'utf8');

if (!code.includes("CareArticles")) {
  code = code.replace(
    "import NotFound from './pages/NotFound';",
    "import NotFound from './pages/NotFound';\nimport CareArticles from './pages/CareArticles';"
  );
  code = code.replace(
    "<Route path=\"/shop\" element={<ShopCatalog />} />",
    "<Route path=\"/shop\" element={<ShopCatalog />} />\n              <Route path=\"/care-hub\" element={<CareArticles />} />"
  );
  fs.writeFileSync('d:/Pet-Care/frontend/src/App.jsx', code);
}
