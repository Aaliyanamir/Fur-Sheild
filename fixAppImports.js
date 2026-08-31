const fs = require('fs');
let code = fs.readFileSync('D:/Pet-Care/frontend/src/App.jsx', 'utf8');

const importsToAdd = `
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
`;

if (!code.includes("import About from")) {
  code = code.replace(
    "import CareArticles from './pages/CareArticles';",
    "import CareArticles from './pages/CareArticles';\n" + importsToAdd
  );
  fs.writeFileSync('D:/Pet-Care/frontend/src/App.jsx', code);
}
console.log("Fixed App.jsx imports");
