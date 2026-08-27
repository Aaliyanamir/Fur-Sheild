const fs = require('fs');
const path = 'd:/Pet-Care/server/routes/notification.routes.js';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  "const { protect } = require('../middleware/auth');",
  "const { protect } = require('../middlewares/auth.middleware');"
);

fs.writeFileSync(path, code);
console.log("Fixed auth middleware path in notification.routes.js");
