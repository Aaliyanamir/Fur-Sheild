const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', 'utf8');

if (!code.includes("Admin Hub")) {
  code = code.replace(
    "case 'SHELTER_ADMIN':",
    "case 'SUPER_ADMIN':\n        return [\n          { name: 'Admin Hub', path: '/admin', icon: LayoutDashboard },\n          { name: 'Shop', path: '/shop', icon: ShoppingBag },\n        ];\n      case 'SHELTER_ADMIN':"
  );
  fs.writeFileSync('d:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', code);
}
