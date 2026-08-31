const fs = require('fs');
let code = fs.readFileSync('D:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', 'utf8');

code = code.replace(
  /<button className="p-3 bg-white text-espresso-600 hover:text-camel-800 hover:bg-camel-50 \s+transition-colors rounded-xl shadow-sm border border-camel-100">/g,
  "<button onClick={() => setIsSearchOpen(true)} className=\"p-3 bg-white text-espresso-600 hover:text-camel-800 hover:bg-camel-50 transition-colors rounded-xl shadow-sm border border-camel-100\">"
);

fs.writeFileSync('D:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', code);
