const fs = require('fs');
let code = fs.readFileSync('D:/Pet-Care/server/config/db.js', 'utf8');

if (!code.includes("family: 4")) {
  code = code.replace(
    "const conn = await mongoose.connect(process.env.MONGO_URI);",
    "const conn = await mongoose.connect(process.env.MONGO_URI, {\n      family: 4,\n      serverSelectionTimeoutMS: 10000,\n    });"
  );
  fs.writeFileSync('D:/Pet-Care/server/config/db.js', code);
}
