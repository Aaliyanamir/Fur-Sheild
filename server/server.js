const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const startCronJobs = require('./utils/cronJobs');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to database
connectDB();

// Start Background Jobs
startCronJobs();

const app = express();

// Enterprise Middlewares
app.use(helmet({ crossOriginResourcePolicy: false })); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Body parser
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
const orderRoutes = require('./routes/order.routes');
const shelterRoutes = require('./routes/shelter.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const adminRoutes = require('./routes/admin.routes');
const notificationRoutes = require('./routes/notification.routes');
const adoptRoutes = require('./routes/adopt.routes');
const chatRoutes = require('./routes/chat.routes');
const articleRoutes = require('./routes/article.routes');

// Mount Routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vet', vetRoutes);
app.use('/api/v1/shop', shopRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/shelter', shelterRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/adopt', adoptRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/articles', articleRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});


