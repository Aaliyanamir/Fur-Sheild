const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/models/User.js', 'utf8');

if (!code.includes("status: {")) {
  code = code.replace(
    "active: { type: Boolean, default: true }",
    "active: { type: Boolean, default: true },\n  status: { type: String, enum: ['ACTIVE', 'BANNED', 'PENDING'], default: 'ACTIVE' },\n  isVerified: { type: Boolean, default: false }"
  );
  fs.writeFileSync('d:/Pet-Care/server/models/User.js', code);
}
