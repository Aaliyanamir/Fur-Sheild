const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/components/organisms/GlobalLayout.jsx', 'utf8');

if (!code.includes("ChatAssistant")) {
  code = code.replace(
    "import Footer from '../molecules/Footer';",
    "import Footer from '../molecules/Footer';\nimport ChatAssistant from './ChatAssistant';"
  );
  code = code.replace(
    "<Footer />",
    "<Footer />\n      <ChatAssistant />"
  );
  fs.writeFileSync('d:/Pet-Care/frontend/src/components/organisms/GlobalLayout.jsx', code);
}
