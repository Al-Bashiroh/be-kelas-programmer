const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');

const is_local = process.env.APP_ENV == 'local';
const is_production = process.env.APP_ENV == 'production';
const database = process.env.MONGO_DATABASE || 'test';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_PRODUCTION_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const connectDB = async () => {
    try {
        if (is_local) {
            console.log('load development db');
            mongoose.set('strictQuery', false);
            const conn = await mongoose.connect(process.env.MONGODB_URI + database);
            console.log(`Database connected: ${conn.connection.host}`);
        } else if (is_production) {
            console.log('load production db');
            
            // Connect the client to the server	(optional starting in v4.7)
            await client.connect();
            // Send a ping to confirm a successful connection
            await client.db(process.env.MONGO_DATABASE).command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");

        } else {
            throw new Error('The build is not in production');
        }
    } catch (error) {
        console.log("Database failed to connect")
        console.log(error);
        return {
            statusCode: 500,
            body: error.toString()
        };
    } finally {
        if (is_production) {
            await client.close();
        }
    }
};

module.exports = connectDB;