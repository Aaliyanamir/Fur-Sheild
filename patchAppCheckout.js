const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/App.jsx', 'utf8');

if (!code.includes("import Checkout")) {
  code = code.replace(
    "import ShopCatalog from './pages/ShopCatalog';",
    "import ShopCatalog from './pages/ShopCatalog';\nimport Checkout from './pages/Checkout';"
  );
  
  code = code.replace(
    /<Route path="\/shop" element=\{<ShopCatalog \/>\} \/>/g,
    `<Route path="/shop" element={<ShopCatalog />} />\n        <Route path="/checkout" element={<Checkout />} />`
  );
  
  fs.writeFileSync('d:/Pet-Care/frontend/src/App.jsx', code);
}
