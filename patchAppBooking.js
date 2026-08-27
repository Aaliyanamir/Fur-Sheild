const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/App.jsx', 'utf8');

if (!code.includes("import BookAppointment")) {
    code = code.replace(
      "import Settings from './pages/Settings';",
      "import Settings from './pages/Settings';\nimport BookAppointment from './pages/BookAppointment';"
    );
}

code = code.replace(
  /<Route path="\/orders" element=\{<MyOrders \/>\} \/>/g,
  `<Route path="/orders" element={<MyOrders />} />\n              <Route path="/book-appointment" element={<BookAppointment />} />`
);

fs.writeFileSync('d:/Pet-Care/frontend/src/App.jsx', code);
