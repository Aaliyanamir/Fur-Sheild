const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/server.js', 'utf8');

if (!code.includes("notification.routes")) {
  code = code.replace(
    "const adminRoutes = require('./routes/admin.routes');",
    "const adminRoutes = require('./routes/admin.routes');\nconst notificationRoutes = require('./routes/notification.routes');"
  );
  code = code.replace(
    "app.use('/api/v1/admin', adminRoutes);",
    "app.use('/api/v1/admin', adminRoutes);\napp.use('/api/v1/notifications', notificationRoutes);"
  );
  fs.writeFileSync('d:/Pet-Care/server/server.js', code);
}
