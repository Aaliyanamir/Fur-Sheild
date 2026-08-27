const fs = require('fs');
const file = 'd:/Pet-Care/server/routes/order.routes.js';
let code = fs.readFileSync(file, 'utf8');
code = code.replace("require('../middleware/auth.middleware')", "require('../middlewares/auth.middleware')");
fs.writeFileSync(file, code);
