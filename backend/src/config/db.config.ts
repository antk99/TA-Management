require('dotenv').config()
import mongoose from 'mongoose';
import { ConnectionOptions } from 'tls';

if (!process.env.MONGO_CONNECTION_STRING)
    console.log("MONGO_CONNECTION_STRING not set in env file, using default connection string");
const MongoConnectionString = process.env.MONGO_CONNECTION_STRING as string || "mongodb://localhost:27017/comp307";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(MongoConnectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4,
        } as ConnectionOptions);
        console.log("Database is connected!");
    } catch (error: any) {
        console.log(error.message);
    }
}

export default connectDB;