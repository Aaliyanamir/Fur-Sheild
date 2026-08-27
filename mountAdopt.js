const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/server.js', 'utf8');

if (!code.includes("adopt.routes")) {
  code = code.replace(
    "const notificationRoutes = require('./routes/notification.routes');",
    "const notificationRoutes = require('./routes/notification.routes');\nconst adoptRoutes = require('./routes/adopt.routes');"
  );
  code = code.replace(
    "app.use('/api/v1/notifications', notificationRoutes);",
    "app.use('/api/v1/notifications', notificationRoutes);\napp.use('/api/v1/adopt', adoptRoutes);"
  );
  fs.writeFileSync('d:/Pet-Care/server/server.js', code);
}
