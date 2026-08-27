const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/components/molecules/Footer.jsx', 'utf8');

code = code.replace(/href="#"/g, 'href="/about"'); // quick hack to make them point somewhere

fs.writeFileSync('d:/Pet-Care/frontend/src/components/molecules/Footer.jsx', code);
