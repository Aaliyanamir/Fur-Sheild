const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/server.js', 'utf8');

if (!code.includes("startCronJobs")) {
  code = code.replace(
    "const connectDB = require('./config/db');",
    "const connectDB = require('./config/db');\nconst startCronJobs = require('./utils/cronJobs');"
  );
  code = code.replace(
    "connectDB();",
    "connectDB();\n\n// Start Background Jobs\nstartCronJobs();"
  );
  fs.writeFileSync('d:/Pet-Care/server/server.js', code);
}
