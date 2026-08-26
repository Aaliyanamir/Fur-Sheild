const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const ShelterAnimal = require('./models/ShelterAnimal');
const Pet = require('./models/Pet');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // 1. Wipe Existing Data
    await User.deleteMany();
    await Product.deleteMany();
    await ShelterAnimal.deleteMany();
    await Pet.deleteMany();

    // 2. Seed Users (1 Admin/Owner, 1 Vet, 1 Shelter Admin)
    const users = await User.create([
      { name: 'Raza Hussain', email: 'raza@furshield.com', password: 'password123', role: 'OWNER' },
      { name: 'Dr. Sarah', email: 'vet@furshield.com', password: 'password123', role: 'VET' },
      { name: 'Admin Shelter', email: 'shelter@furshield.com', password: 'password123', role: 'SHELTER_ADMIN' }
    ]);
    const ownerId = users[0]._id;

    // 3. Seed Pets
    await Pet.create([
      { ownerId, name: 'Buddy', species: 'Dog', breed: 'Golden Retriever', weightHistory: [{ weight: 65 }] },
      { ownerId, name: 'Luna', species: 'Cat', breed: 'Maine Coon', weightHistory: [{ weight: 12 }] }
    ]);

    // 4. Seed Products (Shop)
    await Product.create([
      { name: 'Advanced Joint Support', category: 'SUPPLEMENTS', price: 45.00, stock: 100, rxRequired: false, imageUrl: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=400&q=80' },
      { name: 'Flea & Tick Prevention', category: 'PRESCRIPTIONS', price: 85.00, stock: 50, rxRequired: true, autoShipEligible: true, imageUrl: 'https://images.unsplash.com/photo-1628544498308-3cb96716a5ec?auto=format&fit=crop&w=400&q=80' },
      { name: 'Hypoallergenic Salmon Diet', category: 'NUTRITION', price: 65.50, stock: 30, rxRequired: false, autoShipEligible: true, imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=400&q=80' }
    ]);

    // 5. Seed Shelter Animals (Kanban)
    await ShelterAnimal.create([
      { name: 'Oliver', species: 'Dog', status: 'INTAKE', behaviorNotes: 'Very shy, found near highway' },
      { name: 'Daisy', species: 'Cat', status: 'VET_HOLD', medicalHolds: ['Spay Surgery'] },
      { name: 'Milo', species: 'Dog', status: 'ADOPTABLE' }
    ]);

    console.log('Data Imported Successfully! 🌱');
    process.exit();
  } catch (error) {
    console.error(`Error with Seeder: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await ShelterAnimal.deleteMany();
    await Pet.deleteMany();
    console.log('Data Destroyed! 💥');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
