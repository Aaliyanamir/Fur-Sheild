const fs = require('fs');
['d:/Pet-Care/frontend/src/pages/ShopCatalog.jsx', 'd:/Pet-Care/frontend/src/pages/Checkout.jsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/\\`/g, '`');
  fs.writeFileSync(file, code);
});
