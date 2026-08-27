const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/VetHub.jsx', 'utf8');

code = code.replace("import { useAuth } from '../context/AuthContext';", "import { AuthContext } from '../context/AuthContext';\nimport { useContext } from 'react';");
code = code.replace("const { user } = useAuth();", "const { user } = useContext(AuthContext);");

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/VetHub.jsx', code);
