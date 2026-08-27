const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', 'utf8');

if (!code.includes("BookOpen")) {
  code = code.replace(
    "import { LayoutDashboard,",
    "import { BookOpen, LayoutDashboard,"
  );
  
  code = code.replace(
    "{ name: 'Shop', path: '/shop', icon: ShoppingBag },",
    "{ name: 'Shop', path: '/shop', icon: ShoppingBag },\n        { name: 'Care Hub', path: '/care-hub', icon: BookOpen },"
  );
  fs.writeFileSync('d:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', code);
}
