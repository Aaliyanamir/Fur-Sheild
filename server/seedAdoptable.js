const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ShelterAnimal = require('./models/ShelterAnimal');
const User = require('./models/User');

dotenv.config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    // Check if shelter admin exists, or get any
    let shelterAdmin = await User.findOne({ role: 'SHELTER_ADMIN' });
    if (!shelterAdmin) {
      console.log('No shelter admin found. Generating one.');
      shelterAdmin = await User.create({
        name: 'Happy Paws Rescue',
        email: 'rescue@furshield.com',
        password: 'password123',
        role: 'SHELTER_ADMIN',
        isVerified: true
      });
    }

    const exists = await ShelterAnimal.findOne({ status: 'ADOPTABLE' });
    if (!exists) {
      await ShelterAnimal.create({
        name: 'Luna',
        species: 'Dog',
        breed: 'Golden Retriever Mix',
        age: '2 Years',
        gender: 'Female',
        weight: 45,
        intakeDate: new Date(),
        status: 'ADOPTABLE',
        shelterId: shelterAdmin._id,
        avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
        medicalNotes: 'Fully vaccinated, spayed, and microchipped. Extremely friendly with kids.',
        dailyLogs: []
      });
      console.log('Seeded an adoptable animal!');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
