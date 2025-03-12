import { MongoClient, ObjectId } from "mongodb"; // MongoDB client
import Redis from "../../../lib/config/redisDB"; // Redis instance
import clientPromise from "../../../lib/config/mongodb"; // MongoDB client connection

// Fetch all ports from MongoDB
async function fetchAllPortsFromMongoDB() {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("ports");
    return await collection.find().toArray();
}

// Fetch a specific port by ID from MongoDB
async function fetchPortByIdFromMongoDB(portId) {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("ports");
    return await collection.findOne({ _id: new ObjectId(portId) });
}

// Store data in Redis with expiry (1 hour)
async function storeInRedis(key, data, expiration = 3600) {
    try {
        const jsonData = JSON.stringify(data); // Convert to JSON string
        await Redis.setex(key, expiration, jsonData);
    } catch (error) {
        console.error("Error storing data in Redis:", error);
        throw new Error("Error storing data in Redis");
    }
}

// Fetch ports from Redis or DB (for all ports)
async function fetchAllPortsFromCacheOrDB() {
    try {
        const redisKey = "ports";
        const cachedPorts = await Redis.get(redisKey);

        if (cachedPorts) {
            console.log("Fetching all ports from Redis cache...");
            // Parse the cached string only if it is a valid string
            if (typeof cachedPorts === "string") {
                return JSON.parse(cachedPorts);
            }
            return cachedPorts; // Return the object directly if already parsed
        }

        console.log("Fetching all ports from MongoDB...");
        const ports = await fetchAllPortsFromMongoDB();

        if (ports.length > 0) {
            await storeInRedis(redisKey, ports); // Cache the ports in Redis
        }

        return ports;
    } catch (error) {
        console.error("Error fetching ports from cache or DB:", error);
        throw new Error("Error fetching ports");
    }
}

// Fetch a port from Redis or MongoDB (specific port)
async function fetchPortFromCacheOrDB(portId) {
    try {
        const redisKey = `port:${portId}`;
        const cachedPort = await Redis.get(redisKey);

        if (cachedPort) {
            console.log(`Fetching port ${portId} from Redis cache...`);
            // Parse the cached string only if it is a valid string
            if (typeof cachedPort === "string") {
                return JSON.parse(cachedPort);
            }
            return cachedPort; // Return the object directly if already parsed
        }

        console.log(`Fetching port ${portId} from MongoDB...`);
        const port = await fetchPortByIdFromMongoDB(portId);

        if (port) {
            await storeInRedis(redisKey, port); // Cache port in Redis
        }

        return port;
    } catch (error) {
        console.error("Error fetching port from cache or DB:", error);
        throw new Error("Error fetching port");
    }
}

// Handle POST request for creating a new port or updating an existing port
export async function POST(req) {
    try {
        const portData = await req.json(); // Parse the request body

        if (!portData.portCode || !portData.portName || !portData.connectionType) {
            return new Response(JSON.stringify({ error: "Port data is incomplete" }), { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection("ports");

        // Check if the port exists, and update if necessary
        const existingPort = await collection.findOne({ portCode: portData.portCode });
        
        if (existingPort) {
            // If port exists, update the data
            const updatedPort = {
                ...portData,
                _id: existingPort._id, // Keep the existing ID for update
            };

            await collection.updateOne(
                { _id: existingPort._id },
                { $set: updatedPort }
            );

            // Cache the updated port
            await storeInRedis(`port:${updatedPort._id}`, updatedPort);

            return new Response(
                JSON.stringify({ message: "Port updated successfully", port: updatedPort }),
                { status: 200 }
            );
        }

        // If port doesn't exist, insert the new port
        const result = await collection.insertOne(portData);
        const insertedPort = {
            ...portData,
            _id: result.insertedId.toString(),
        };

        // Cache the inserted port
        await storeInRedis(`port:${insertedPort._id}`, insertedPort);

        return new Response(
            JSON.stringify({ message: "Port created successfully", port: insertedPort }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error saving port:", error);
        return new Response(JSON.stringify({ error: "Error saving port" }), { status: 500 });
    }
}

// Handle GET request for fetching all ports or a specific port
export async function GET(req) {
    try {
        const url = new URL(req.url);
        const portId = url.searchParams.get("id"); // Extract portId from query parameters

        if (portId) {
            console.log("Fetching port with ID:", portId);
            const port = await fetchPortFromCacheOrDB(portId);

            if (!port) {
                return new Response(JSON.stringify({ error: "Port not found" }), { status: 404 });
            }

            return new Response(JSON.stringify({ port }), { status: 200 });
        }

        // If no portId is provided, fetch all ports
        console.log("Fetching all ports...");
        const ports = await fetchAllPortsFromCacheOrDB();
        return new Response(JSON.stringify({ ports }), { status: 200 });
    } catch (error) {
        console.error("GET /api/port error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}

// Handle DELETE request for deleting a port by ID
export async function DELETE(req) {
    try {
        const url = new URL(req.url);
        const portId = url.searchParams.get("id"); // Extract portId from query parameters

        if (!portId) {
            return new Response(
                JSON.stringify({ error: "Port ID is required" }),
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection("ports");

        // Delete the port from MongoDB
        const result = await collection.deleteOne({ _id: new ObjectId(portId) });

        if (result.deletedCount === 1) {
            // Clear the port from Redis cache
            await Redis.del(`port:${portId}`);

            return new Response(JSON.stringify({ message: "Port deleted successfully" }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "Port not found" }), { status: 404 });
        }
    } catch (error) {
        console.error("Error deleting port:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
