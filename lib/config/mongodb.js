import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI; // Add this in your .env file
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

let client;
let clientPromise;

if (!MONGO_URI) {
    throw new Error("Please add your MongoDB URI to .env file");
}

if (process.env.NODE_ENV === "development") {
    // Use a global variable to prevent multiple connections in development
    if (!global._mongoClientPromise) {
        client = new MongoClient(MONGO_URI, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production, create a new client
    client = new MongoClient(MONGO_URI, options);
    clientPromise = client.connect();
}

export default clientPromise;
