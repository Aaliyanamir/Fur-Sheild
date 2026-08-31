require('dotenv').config({ path: 'D:/Pet-Care/server/.env' });
const mongoose = require('mongoose');

const directUri = 'mongodb://raza:Wh5U6kL1NyPW7J6U@ac-wqirn1i-shard-00-00.yxxc7b4.mongodb.net:27017,ac-wqirn1i-shard-00-01.yxxc7b4.mongodb.net:27017,ac-wqirn1i-shard-00-02.yxxc7b4.mongodb.net:27017/furshield_db?ssl=true&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(directUri).then(async () => {
    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();
    
    for (const p of products) {
        let localImg = `http://localhost:3000/images/product-1.jpg`; // default fallback
        
        const name = p.name.toLowerCase();
        
        if (name.includes('salmon') || name.includes('food') || name.includes('diet') || p.category === 'Food') {
            localImg = `http://localhost:3000/images/food.jpg`;
        } else if (name.includes('bed') || name.includes('collar') || p.category === 'Accessories') {
            localImg = `http://localhost:3000/images/bed.jpg`;
        } else if (name.includes('flea') || name.includes('tick') || name.includes('treatment') || name.includes('joint') || p.category === 'Health' || p.category === 'PRESCRIPTIONS') {
            localImg = `http://localhost:3000/images/meds.jpg`;
        } else if (name.includes('toy') || name.includes('laser') || p.category === 'Toys') {
            localImg = `http://localhost:3000/images/toy.jpg`;
        }
        
        await db.collection('products').updateOne(
            { _id: p._id },
            { $set: { image: localImg, imageUrl: localImg } }
        );
        console.log(`Updated ${p.name} -> ${localImg}`);
    }
    
    console.log("Updated products correctly!");
    process.exit(0);
}).catch(console.error);
