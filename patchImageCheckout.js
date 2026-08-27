const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/Checkout.jsx', 'utf8');

code = code.replace(
  /item\.image\.startsWith/g,
  "(item.image || '').startsWith"
);

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/Checkout.jsx', code);
