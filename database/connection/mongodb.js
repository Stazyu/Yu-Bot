const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);
client.connect(async (err, client) => {
    if (err) {
        console.log("Error connecting to MongoDB! ", { err });
        process.exit(1);
    }
    console.log('Connected to MongoDB..');
    await client.close();
});