import { MongoClient, ObjectId } from "mongodb"; // MongoDB client
import Redis from "../../../lib/config/redisDB"; // Redis instance
import clientPromise from "../../../lib/config/mongodb"; // MongoDB client
import bcrypt from 'bcrypt'; // bcrypt for password hashing

// Fetch all users from MongoDB
async function fetchAllUsersFromMongoDB() {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("user");
    return await collection.find().toArray();
}

// Fetch a specific user by ID from MongoDB
async function fetchUserByIdFromMongoDB(userId) {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("user");
    return await collection.findOne({ _id: new ObjectId(userId) });
}

// Store data in Redis with expiry (1 hour)
async function storeInRedis(key, data, expiration = 3600) {
    try {
        const jsonData = JSON.stringify(data); // Convert to JSON string
        await Redis.setex(key, expiration, jsonData);
    } catch (error) {
        console.error("Error storing data in Redis:", error);
    }
}

// Fetch users from Redis or DB (for all users)
async function fetchAllUsersFromCacheOrDB() {
    try {
        const redisKey = "users";
        const cachedUsers = await Redis.get(redisKey);

        if (cachedUsers) {
            console.log("Fetching all users from Redis cache...");
            if (typeof cachedUsers === "string") {
                return JSON.parse(cachedUsers); // Parse only if it's a string
            }
        }

        console.log("Fetching all users from MongoDB...");
        const users = await fetchAllUsersFromMongoDB();

        if (users.length > 0) {
            await storeInRedis(redisKey, users); // Cache the users in Redis
        }

        return users;
    } catch (error) {
        console.error("Error fetching users from cache or DB:", error);
        throw new Error("Error fetching users");
    }
}

// Fetch a user from Redis or MongoDB (specific user)
async function fetchUserFromCacheOrDB(userId) {
    try {
        const redisKey = `user:${userId}`;
        const cachedUser = await Redis.get(redisKey);

        if (cachedUser) {
            console.log(`Fetching user ${userId} from Redis cache...`);
            return JSON.parse(cachedUser);
        }

        console.log(`Fetching user ${userId} from MongoDB...`);
        const user = await fetchUserByIdFromMongoDB(userId);

        if (user) {
            await storeInRedis(redisKey, user); // Cache user in Redis
        }

        return user;
    } catch (error) {
        console.error("Error fetching user from cache or DB:", error);
        throw new Error("Error fetching user");
    }
}

// Handle POST request for creating a new user
export async function POST(req) {
    try {
        const userData = await req.json(); // Parse the request body

        if (!userData.name || !userData.email || !userData.password) {
            return new Response(JSON.stringify({ error: "User data is incomplete" }), { status: 400 });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const userWithHashedPassword = { ...userData, password: hashedPassword };

        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection("user");

        // Insert the new user into MongoDB
        const result = await collection.insertOne(userWithHashedPassword);

        const insertedUser = {
            ...userWithHashedPassword,
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
export async function GET(req) {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId"); // Extract userId from query parameters

        if (userId) {
            console.log("Fetching user with ID:", userId);
            const user = await fetchUserFromCacheOrDB(userId);

            if (!user) {
                return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
            }

            return new Response(JSON.stringify({ user }), { status: 200 });
        }

        // If no userId is provided, fetch all users
        console.log("Fetching all users...");
        const users = await fetchAllUsersFromCacheOrDB();
        return new Response(JSON.stringify({ users }), { status: 200 });

    } catch (error) {
        console.error("GET /api/user error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
