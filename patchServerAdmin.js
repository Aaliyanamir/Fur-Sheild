const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/server.js', 'utf8');

if (!code.includes("admin.routes")) {
  code = code.replace(
    "const dashboardRoutes = require('./routes/dashboard.routes');",
    "const dashboardRoutes = require('./routes/dashboard.routes');\nconst adminRoutes = require('./routes/admin.routes');"
  );
  code = code.replace(
    "app.use('/api/v1/dashboard', dashboardRoutes);",
    "app.use('/api/v1/dashboard', dashboardRoutes);\napp.use('/api/v1/admin', adminRoutes);"
  );
  fs.writeFileSync('d:/Pet-Care/server/server.js', code);
}
