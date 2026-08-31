require('dotenv').config();
const mongoose = require('mongoose');

const directUri = 'mongodb://raza:Wh5U6kL1NyPW7J6U@ac-wqirn1i-shard-00-00.yxxc7b4.mongodb.net:27017,ac-wqirn1i-shard-00-01.yxxc7b4.mongodb.net:27017,ac-wqirn1i-shard-00-02.yxxc7b4.mongodb.net:27017/furshield_db?ssl=true&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(directUri)
  .then(() => {
    console.log("SUCCESS");
    process.exit(0);
  })
  .catch(err => {
    console.log("FAILED: " + err.message);
    process.exit(1);
  });
