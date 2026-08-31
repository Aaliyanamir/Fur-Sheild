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

    // 2. Seed Users (SuperAdmin, User, Owner, Vet, Shelter Admin)
    const users = await User.create([
      { name: 'System Admin', email: 'admin@furshield.com', password: 'password123', role: 'SUPER_ADMIN', isVerified: true },
      { name: 'John User', email: 'user@furshield.com', password: 'password123', role: 'USER', isVerified: true },
      { name: 'Raza Hussain', email: 'raza@furshield.com', password: 'password123', role: 'OWNER', isVerified: true },
      { name: 'Dr. Sarah Smith', email: 'vet@furshield.com', password: 'password123', role: 'VET', isVerified: true },
      { name: 'Rescue Shelter Admin', email: 'shelter@furshield.com', password: 'password123', role: 'SHELTER_ADMIN', isVerified: true }
    ]);
    const ownerId = users[2]._id;

    // 3. Seed Owner Pets
    await Pet.create([
      { ownerId, name: 'Buddy', species: 'Dog', breed: 'Golden Retriever', weightHistory: [{ weight: 65 }], avatarUrl: '/images/dash-dog-1.jpg' },
      { ownerId, name: 'Luna', species: 'Cat', breed: 'Maine Coon', weightHistory: [{ weight: 12 }], avatarUrl: '/images/dash-cat-1.jpg' }
    ]);

    // 4. Seed Products (Shop) with All Categories including Birds
    await Product.create([
      { name: 'Premium Salmon Kibble', description: 'High protein nutrition for healthy active dogs.', price: 45.99, category: 'Food', stock: 50, image: '/images/food.jpg', rating: 4.8, reviewsCount: 12 },
      { name: 'Orthopedic Pet Bed', description: 'Memory foam bed for ultimate joint and back support.', price: 89.99, category: 'Accessories', stock: 15, image: '/images/bed.jpg', rating: 4.5, reviewsCount: 8 },
      { name: 'Flea & Tick Treatment', description: 'Fast-acting monthly preventative formula.', price: 29.99, category: 'Health', stock: 100, image: '/images/meds.jpg', rating: 4.9, reviewsCount: 45, isPrescriptionRequired: false },
      { name: 'Interactive Laser Toy', description: 'Automatic multi-angle laser toy for playful cats.', price: 24.99, category: 'Toys', stock: 30, image: '/images/toy.jpg', rating: 4.2, reviewsCount: 22 },
      { name: 'Tropical Bird Seed Mix', description: 'Nutrient-rich seed, nut and fruit blend for parrots and cockatiels.', price: 18.50, category: 'Birds', stock: 40, image: '/images/signup-bird.jpg', rating: 4.9, reviewsCount: 15 },
      { name: 'Bird Playground Stand', description: 'Interactive wooden perch with ladder and swing.', price: 34.99, category: 'Birds', stock: 20, image: '/images/signup-bird.jpg', rating: 4.7, reviewsCount: 9 },
      { name: 'Crunchy Dental Chews', description: 'Keeps dog teeth clean and breath fresh.', price: 15.99, category: 'Food', stock: 75, image: '/images/shop-chews.jpg', rating: 4.6, reviewsCount: 31 },
      { name: 'Multivitamin Supplement Powder', description: 'Essential daily vitamins and minerals for pets.', price: 22.00, category: 'Health', stock: 60, image: '/images/shop-supplements.jpg', rating: 4.8, reviewsCount: 18 }
    ]);

    // 5. Seed Shelter Animals (Adoptable & Kanban Pipeline)
    await ShelterAnimal.create([
      { name: 'Max', species: 'Dog', breed: 'Beagle', age: '2 Years', status: 'ADOPTABLE', avatarUrl: '/images/pet-1.jpg', behaviorNotes: 'Friendly, playful, loves kids and long walks.' },
      { name: 'Cleo', species: 'Cat', breed: 'Persian', age: '1 Year', status: 'ADOPTABLE', avatarUrl: '/images/pet-2.jpg', behaviorNotes: 'Calm and affectionate lap cat.' },
      { name: 'Sunny', species: 'Bird', breed: 'Sun Conure', age: '3 Years', status: 'ADOPTABLE', avatarUrl: '/images/signup-bird.jpg', behaviorNotes: 'Vibrant, vocal, and hand-trained parrot.' },
      { name: 'Rio', species: 'Bird', breed: 'Cockatiel', age: '1.5 Years', status: 'ADOPTABLE', avatarUrl: '/images/signup-bird.jpg', behaviorNotes: 'Loves whistling melodies and perching on shoulders.' },
      { name: 'Oliver', species: 'Dog', breed: 'Labrador Mix', age: '6 Months', status: 'INTAKE', avatarUrl: '/images/dash-dog-1.jpg', behaviorNotes: 'Shy puppy rescued near suburban park.' },
      { name: 'Daisy', species: 'Cat', breed: 'Siamese', age: '3 Years', status: 'VET_HOLD', avatarUrl: '/images/pet-3.jpg', medicalHolds: ['Spay Surgery Recovery'], behaviorNotes: 'Under vet observation post-op.' }
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
