const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enterprise Middlewares
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Body parser
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // HTTP request logging
}

// Basic Health Check Route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: 'FurShield Enterprise API is running.' });
});

// Route Files
const authRoutes = require('./routes/auth.routes');
const vetRoutes = require('./routes/vet.routes');
const shopRoutes = require('./routes/shop.routes');
const shelterRoutes = require('./routes/shelter.routes');

// Mount Routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vethub', vetRoutes);
app.use('/api/v1/shop', shopRoutes);
app.use('/api/v1/shelter', shelterRoutes);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(Server running in  mode on port );
});




