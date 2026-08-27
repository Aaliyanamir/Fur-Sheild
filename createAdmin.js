const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./server/models/User');

dotenv.config({ path: './server/.env' });

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("DB Connected");
    
    // Check if admin exists
    let admin = await User.findOne({ email: 'admin@furshield.com' });
    if (admin) {
      admin.role = 'SUPER_ADMIN';
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash('admin123', salt);
      await admin.save();
      console.log("Admin updated");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await User.create({
        name: 'Super Admin',
        email: 'admin@furshield.com',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isVerified: true
      });
      console.log("Admin created");
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
