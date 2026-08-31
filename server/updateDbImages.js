require('dotenv').config({ path: 'D:/Pet-Care/server/.env' });
const mongoose = require('mongoose');

// Use the robust connection string we figured out earlier to bypass DNS issues
const directUri = 'mongodb://raza:Wh5U6kL1NyPW7J6U@ac-wqirn1i-shard-00-00.yxxc7b4.mongodb.net:27017,ac-wqirn1i-shard-00-01.yxxc7b4.mongodb.net:27017,ac-wqirn1i-shard-00-02.yxxc7b4.mongodb.net:27017/furshield_db?ssl=true&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(directUri).then(async () => {
    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();
    
    let counter = 1;
    for (const p of products) {
        const localImg = `http://localhost:3000/images/product-${counter}.jpg`;
        await db.collection('products').updateOne(
            { _id: p._id },
            { $set: { image: localImg, imageUrl: localImg } }
        );
        counter = counter > 2 ? 1 : counter + 1; // cycle 1,2,3
    }
    console.log("Updated products successfully.");
    process.exit(0);
}).catch(console.error);
