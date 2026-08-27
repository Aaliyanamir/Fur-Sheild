const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/models/User.js', 'utf8');
code = code.replace(
  "enum: ['OWNER', 'VET', 'SHELTER_ADMIN', 'SYSTEM_ADMIN']",
  "enum: ['OWNER', 'VET', 'SHELTER_ADMIN', 'SYSTEM_ADMIN', 'SUPER_ADMIN']"
);
fs.writeFileSync('d:/Pet-Care/server/models/User.js', code);
