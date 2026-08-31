const fs = require('fs');
let code = fs.readFileSync('D:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', 'utf8');

code = code.replace(
  /<button className="p-1\.5 lg:p-2 text-espresso-500 hover:text-camel-700 transition-colors rounded-full \n?hover:bg-white\/50">/g,
  "<button onClick={() => setIsSearchOpen(true)} className=\"p-1.5 lg:p-2 text-espresso-500 hover:text-camel-700 transition-colors rounded-full hover:bg-white/50\">"
);

code = code.replace(
  /<button className="p-3 bg-white text-espresso-600 hover:text-camel-800 hover:bg-camel-50 \n?transition-colors rounded-xl shadow-sm border border-camel-100">\s*<Search size={18} \/>\s*<\/button>/g,
  "<button onClick={() => setIsSearchOpen(true)} className=\"p-3 bg-white text-espresso-600 hover:text-camel-800 hover:bg-camel-50 transition-colors rounded-xl shadow-sm border border-camel-100\">\n  <Search size={18} />\n</button>"
);

fs.writeFileSync('D:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', code);
