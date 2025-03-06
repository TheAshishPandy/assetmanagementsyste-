import { NextResponse } from "next/server";
import Redis from "./lib/config/redisDB"; // Import Redis instance

const REQUEST_LIMIT = 50; // Max requests allowed
const WINDOW_DURATION = 60; // Time window in seconds (1 minute)

export async function middleware(request) { // Removed TypeScript annotation
    const ip = request.ip || "127.0.0.1"; // Get user IP
    const key = `rate_limit:${ip}`; // Create Redis key

    const currentCount = (await Redis.get(key)) || 0; // Get request count

    if (currentCount >= REQUEST_LIMIT) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    await Redis.setex(key, WINDOW_DURATION, currentCount + 1); // Increment count with expiry
    return NextResponse.next(); // Allow request
}

export const config = {
    matcher: "/api/:path*",
};