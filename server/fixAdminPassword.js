const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("DB Connected");
    
    // Check if admin exists
    let admin = await User.findOne({ email: 'admin@furshield.com' });
    if (admin) {
      admin.role = 'SUPER_ADMIN';
      admin.password = 'admin123'; // pre('save') will hash this
      await admin.save();
      console.log("Admin updated with correct password");
    } else {
      await User.create({
        name: 'Super Admin',
        email: 'admin@furshield.com',
        password: 'admin123', // pre('save') will hash this
        role: 'SUPER_ADMIN',
        isVerified: true
      });
      console.log("Admin created with correct password");
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
