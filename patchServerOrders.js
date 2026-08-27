const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/server.js', 'utf8');

code = code.replace(
  "const shopRoutes = require('./routes/shop.routes');",
  "const shopRoutes = require('./routes/shop.routes');\nconst orderRoutes = require('./routes/order.routes');"
);

code = code.replace(
  "app.use('/api/v1/shop', shopRoutes);",
  "app.use('/api/v1/shop', shopRoutes);\napp.use('/api/v1/orders', orderRoutes);"
);

fs.writeFileSync('d:/Pet-Care/server/server.js', code);
