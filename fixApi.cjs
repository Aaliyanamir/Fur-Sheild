const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/services/api.js', 'utf8');
code = code.replace(`  headers: {\r\n    'Content-Type': 'application/json'\r\n  }`, ``);
code = code.replace(`  headers: {\n    'Content-Type': 'application/json'\n  }`, ``);
fs.writeFileSync('d:/Pet-Care/frontend/src/services/api.js', code);
