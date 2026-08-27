const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/ShopCatalog.jsx', 'utf8');

code = code.replace(
  /product\.image\.startsWith/g,
  "(product.image || '').startsWith"
);

code = code.replace(
  /item\.image\.startsWith/g,
  "(item.image || '').startsWith"
);

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/ShopCatalog.jsx', code);
