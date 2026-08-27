const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/VetHub.jsx', 'utf8');

code = code.replace(
  "if (dispatch) dispatch({ type: 'LOGIN_SUCCESS', payload: res });",
  "window.location.reload();"
);

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/VetHub.jsx', code);
