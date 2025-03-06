import { MongoClient, ObjectId } from "mongodb"; // MongoDB client
import Redis from "../../../lib/config/redisDB"; // Redis instance
import clientPromise from "../../../lib/config/mongodb"; // MongoDB client

// Fetch all users from MongoDB
async function fetchAllUsersFromMongoDB() {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("user");
    const users = await collection.find().toArray();
    return users;
}

// Fetch a specific user by ID from MongoDB
async function fetchUserByIdFromMongoDB(userId) {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("user");
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    return user;
}

// Store data in Redis with expiry (1 hour)
async function storeInRedis(key, data, expiration = 3600) {
    await Redis.setex(key, expiration, JSON.stringify(data)); // Set data with expiration
}

// Fetch users from Redis or DB (for all users)
async function fetchAllUsersFromCacheOrDB() {
    const redisKey = "users"; // Cache key for all users
    const cachedUsers = await Redis.get(redisKey);

    if (cachedUsers) {
        console.log("Fetching all users from Redis cache...");
        return JSON.parse(cachedUsers);
    }

    console.log("Fetching all users from MongoDB...");
    const users = await fetchAllUsersFromMongoDB();

    if (users) {
        await storeInRedis(redisKey, users); // Cache all users in Redis
    }

    return users;
}

// Fetch a user from Redis or MongoDB (specific user)
async function fetchUserFromCacheOrDB(userId) {
    const redisKey = `user:${userId}`;

    // Check if the user exists in Redis cache
    const cachedUser = await Redis.get(redisKey);

    if (cachedUser) {
        console.log("Fetching user from Redis cache...");
        return JSON.parse(cachedUser); // Return cached data
    }

    console.log("Fetching user from MongoDB...");
    const user = await fetchUserByIdFromMongoDB(userId);

    if (user) {
        await storeInRedis(redisKey, user); // Cache user in Redis if found in DB
    }

    return user;
}

// Handle POST request for creating a new user
export async function POST(req) {
    const userData = await req.json(); // Parse the request body

    if (!userData.name || !userData.email || !userData.password) {
        return new Response(JSON.stringify({ error: "User data is incomplete" }), { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection("user");

        // Insert the new user into MongoDB
        const result = await collection.insertOne(userData);

        const insertedUser = {
            ...userData,
            _id: result.insertedId.toString(),
        };

        // Cache the inserted user in Redis
        await storeInRedis(`user:${insertedUser._id}`, insertedUser);

        return new Response(
            JSON.stringify({
                message: "User created successfully",
                user: insertedUser,
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error inserting user:", error);
        return new Response(JSON.stringify({ error: "Error creating user" }), { status: 500 });
    }
}

// Handle GET request for fetching all users or a specific user
export async function GET(req, { params }) {
    const { userId } = params; // Get userId from the params (if any)

    if (userId) {
        // If userId is provided, fetch specific user
        if (!userId) {
            return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
        }

        try {
            const user = await fetchUserFromCacheOrDB(userId);

            if (!user) {
                return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
            }

            return new Response(
                JSON.stringify({ user }),
                { status: 200 }
            );
        } catch (error) {
            console.error("Error fetching user:", error);
            return new Response(JSON.stringify({ error: "Error fetching user" }), { status: 500 });
        }
    }

    // If no userId is provided, fetch all users
    try {
        const users = await fetchAllUsersFromCacheOrDB();
        return new Response(
            JSON.stringify({ users }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response(JSON.stringify({ error: "Error fetching users" }), { status: 500 });
    }
}
