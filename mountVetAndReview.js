const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/server.js', 'utf8');

if (!code.includes("vetRoutes")) {
  code = code.replace(
    "const adoptRoutes = require('./routes/adopt.routes');",
    "const adoptRoutes = require('./routes/adopt.routes');\nconst vetRoutes = require('./routes/vet.routes');\nconst reviewRoutes = require('./routes/review.routes');"
  );
  code = code.replace(
    "app.use('/api/v1/adopt', adoptRoutes);",
    "app.use('/api/v1/adopt', adoptRoutes);\napp.use('/api/v1/vet', vetRoutes);\napp.use('/api/v1/reviews', reviewRoutes);"
  );
  fs.writeFileSync('d:/Pet-Care/server/server.js', code);
}
