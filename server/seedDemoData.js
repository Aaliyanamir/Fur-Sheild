const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Pet = require('./models/Pet');
const ShelterAnimal = require('./models/ShelterAnimal');

dotenv.config({ path: './.env' });

const DEMO_PASSWORD = 'admin123';

const upsertUser = async (user) => {
  const plainPassword = user.password || DEMO_PASSWORD;
  const payload = {
    ...user,
    password: plainPassword,
    isVerified: true,
  };

  const existing = await User.findOne({ email: user.email });

  if (existing) {
    existing.name = user.name;
    existing.role = user.role;
    existing.isVerified = true;
    existing.password = plainPassword;
    await existing.save();
    return existing;
  }

  const created = new User(payload);
  await created.save();
  return created;
};

const upsertProduct = async (product) => {
  return Product.findOneAndUpdate(
    { name: product.name },
    product,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

const upsertPet = async (pet) => {
  return Pet.findOneAndUpdate(
    { ownerId: pet.ownerId, name: pet.name },
    pet,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

const upsertShelterAnimal = async (animal) => {
  return ShelterAnimal.findOneAndUpdate(
    { name: animal.name, species: animal.species },
    animal,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const usersToCreate = [
      { name: 'System Admin', email: 'admin@furshield.com', password: DEMO_PASSWORD, role: 'SUPER_ADMIN' },
      { name: 'Rescue Shelter Admin', email: 'shelter@furshield.com', password: DEMO_PASSWORD, role: 'SHELTER_ADMIN' },
      { name: 'Dr. Sarah Smith', email: 'vet@furshield.com', password: DEMO_PASSWORD, role: 'VET', specialty: 'General Practice', avatarUrl: '/images/dash-dog-1.jpg' },
      { name: 'Dr. Ayesha Khan', email: 'vet2@furshield.com', password: DEMO_PASSWORD, role: 'VET', specialty: 'Surgery & Orthopedics', avatarUrl: '/images/pet-1.jpg' },
      { name: 'Dr. Daniel Park', email: 'vet3@furshield.com', password: DEMO_PASSWORD, role: 'VET', specialty: 'Internal Medicine', avatarUrl: '/images/pet-2.jpg' },
      { name: 'Raza Hussain', email: 'raza@furshield.com', password: DEMO_PASSWORD, role: 'OWNER' },
      { name: 'Ayesha Ali', email: 'owner2@furshield.com', password: DEMO_PASSWORD, role: 'OWNER' },
      { name: 'Hassan Mehmood', email: 'owner3@furshield.com', password: DEMO_PASSWORD, role: 'OWNER' },
      { name: 'John User', email: 'user@furshield.com', password: DEMO_PASSWORD, role: 'USER' },
      { name: 'Maria Noor', email: 'user2@furshield.com', password: DEMO_PASSWORD, role: 'USER' },
    ];

    const createdUsers = [];
    for (const u of usersToCreate) {
      const user = await upsertUser(u);
      createdUsers.push(user);
    }

    const ownerIds = createdUsers.filter(u => u.role === 'OWNER').map(u => u._id);
    const shelterAdmin = createdUsers.find(u => u.role === 'SHELTER_ADMIN');

    const products = [
      { name: 'Premium Salmon Kibble', description: 'High-protein salmon kibble for healthy dogs and active pets.', price: 32.99, category: 'Food', stock: 42, image: '/images/food.jpg', rating: 4.8, reviewsCount: 18 },
      { name: 'Orthopedic Pet Bed', description: 'Memory foam bed for extra comfort and joint support.', price: 89.99, category: 'Accessories', stock: 16, image: '/images/bed.jpg', rating: 4.7, reviewsCount: 12 },
      { name: 'Flea & Tick Treatment', description: 'Monthly protection for dogs and cats against fleas and ticks.', price: 29.50, category: 'Health', stock: 64, image: '/images/meds.jpg', rating: 4.9, reviewsCount: 27 },
      { name: 'Interactive Laser Toy', description: 'Fun laser toy that keeps cats and dogs engaged and active.', price: 21.99, category: 'Toys', stock: 31, image: '/images/toy.jpg', rating: 4.5, reviewsCount: 15 },
      { name: 'Tropical Bird Seed Mix', description: 'Nutrient-rich seed blend for parrots, cockatiels and seed-loving birds.', price: 18.75, category: 'Birds', stock: 28, image: '/images/signup-bird.jpg', rating: 4.9, reviewsCount: 21 },
      { name: 'Bird Playground Stand', description: 'Wooden perch and play stand for active birds.', price: 34.99, category: 'Birds', stock: 19, image: '/images/signup-bird.jpg', rating: 4.6, reviewsCount: 11 },
      { name: 'Crunchy Dental Chews', description: 'Natural chew treats that help reduce plaque and freshen breath.', price: 15.99, category: 'Food', stock: 58, image: '/images/shop-chews.jpg', rating: 4.6, reviewsCount: 24 },
      { name: 'Multivitamin Supplement Powder', description: 'Daily vitamins and minerals for active pets.', price: 24.00, category: 'Health', stock: 39, image: '/images/shop-supplements.jpg', rating: 4.8, reviewsCount: 20 },
      { name: 'Gentle Puppy Shampoo', description: 'Foaming puppy-safe shampoo for soft, clean coats.', price: 17.50, category: 'Accessories', stock: 22, image: '/images/shop-puppy.jpg', rating: 4.4, reviewsCount: 9 },
      { name: 'Heartworm Prevention', description: 'Vet-recommended monthly protection for heartworm prevention.', price: 26.90, category: 'Health', stock: 47, image: '/images/shop-heartworm.jpg', rating: 4.9, reviewsCount: 16 },
    ];

    for (const p of products) {
      await upsertProduct(p);
    }

    const petSeed = [
      { ownerId: ownerIds[0], name: 'Buddy', species: 'Dog', breed: 'Golden Retriever', gender: 'Male', age: 4, weightHistory: [{ weight: 32, date: new Date() }], avatarUrl: '/images/dash-dog-1.jpg' },
      { ownerId: ownerIds[0], name: 'Luna', species: 'Cat', breed: 'Maine Coon', gender: 'Female', age: 2, weightHistory: [{ weight: 6.5, date: new Date() }], avatarUrl: '/images/dash-cat-1.jpg' },
      { ownerId: ownerIds[1], name: 'Milo', species: 'Dog', breed: 'Labrador Mix', gender: 'Male', age: 3, weightHistory: [{ weight: 26, date: new Date() }], avatarUrl: '/images/pet-1.jpg' },
      { ownerId: ownerIds[1], name: 'Coco', species: 'Bird', breed: 'Cockatiel', gender: 'Female', age: 1, weightHistory: [{ weight: 0.9, date: new Date() }], avatarUrl: '/images/signup-bird.jpg' },
      { ownerId: ownerIds[2], name: 'Daisy', species: 'Cat', breed: 'Siamese', gender: 'Female', age: 5, weightHistory: [{ weight: 5.2, date: new Date() }], avatarUrl: '/images/pet-3.jpg' },
    ];

    for (const pet of petSeed) {
      await upsertPet(pet);
    }

    const shelterAnimals = [
      { name: 'Max', species: 'Dog', breed: 'Beagle', age: '2 Years', status: 'ADOPTABLE', avatarUrl: '/images/pet-1.jpg', behaviorNotes: 'Friendly, playful, loves children and long walks.' },
      { name: 'Cleo', species: 'Cat', breed: 'Persian', age: '1 Year', status: 'ADOPTABLE', avatarUrl: '/images/pet-2.jpg', behaviorNotes: 'Calm and affectionate lap cat.' },
      { name: 'Sunny', species: 'Bird', breed: 'Sun Conure', age: '3 Years', status: 'ADOPTABLE', avatarUrl: '/images/signup-bird.jpg', behaviorNotes: 'Social, cheerful, and hand-trained.' },
      { name: 'Nova', species: 'Dog', breed: 'German Shepherd Mix', age: '8 Months', status: 'ADOPTABLE', avatarUrl: '/images/dash-dog-1.jpg', behaviorNotes: 'Young and energetic, needs gentle socialization.' },
      { name: 'Bella', species: 'Cat', breed: 'Tabby', age: '2 Years', status: 'ADOPTABLE', avatarUrl: '/images/pet-3.jpg', behaviorNotes: 'Playful and curious, loves interactive toys.' },
      { name: 'Rocky', species: 'Dog', breed: 'Boxer', age: '3 Years', status: 'ADOPTABLE', avatarUrl: '/images/pet-1.jpg', behaviorNotes: 'Muscular and loyal, excellent family companion.' },
      { name: 'Whiskers', species: 'Cat', breed: 'Siamese Mix', age: '4 Months', status: 'ADOPTABLE', avatarUrl: '/images/pet-2.jpg', behaviorNotes: 'Tiny kitten, very affectionate and playful.' },
      { name: 'Charlie', species: 'Dog', breed: 'Poodle Mix', age: '1 Year', status: 'ADOPTABLE', avatarUrl: '/images/dash-dog-1.jpg', behaviorNotes: 'Smart and trainable, loves outdoor activities.' },
      { name: 'Tweety', species: 'Bird', breed: 'Canary', age: '2 Years', status: 'ADOPTABLE', avatarUrl: '/images/signup-bird.jpg', behaviorNotes: 'Beautiful singer, requires spacious cage.' },
      { name: 'Shadow', species: 'Cat', breed: 'Black Domestic', age: '6 Months', status: 'ADOPTABLE', avatarUrl: '/images/pet-3.jpg', behaviorNotes: 'Shy but warming up, needs patient family.' },
    ];

    for (const animal of shelterAnimals) {
      await upsertShelterAnimal(animal);
    }

    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const petCount = await Pet.countDocuments();
    const shelterCount = await ShelterAnimal.countDocuments();

    console.log('Seed completed successfully');
    console.log(JSON.stringify({
      users: userCount,
      products: productCount,
      ownerPets: petCount,
      shelterAnimals: shelterCount,
      credentials: [
        'admin@furshield.com / admin123',
        'shelter@furshield.com / admin123',
        'vet@furshield.com / admin123',
        'vet2@furshield.com / admin123',
        'vet3@furshield.com / admin123',
        'raza@furshield.com / admin123',
        'owner2@furshield.com / admin123',
        'owner3@furshield.com / admin123',
        'user@furshield.com / admin123',
        'user2@furshield.com / admin123',
      ]
    }, null, 2));

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

main();
