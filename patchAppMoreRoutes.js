const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/App.jsx', 'utf8');

// Add imports
const importsToAdd = `
import BookAppointment from './pages/BookAppointment';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
`;
if (!code.includes("BookAppointment")) {
  code = code.replace(
    "import AppLayout from './components/AppLayout';",
    "import AppLayout from './components/AppLayout';\n" + importsToAdd
  );
}

// Add Routes to GlobalLayout
const routesToAdd = `
            <Route path="/book-vet" element={<BookAppointment />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
`;
if (!code.includes('path="/book-vet"')) {
  code = code.replace(
    "<Route path=\"/adopt\" element={<AdoptionCatalog />} />",
    "<Route path=\"/adopt\" element={<AdoptionCatalog />} />\n" + routesToAdd
  );
}

fs.writeFileSync('d:/Pet-Care/frontend/src/App.jsx', code);
