import { RateLimit } from "@upstash/ratelimit";
import Redis from "./redisDB";

const ratelimit = new RateLimit({
    redis: Redis
});

export default ratelimit;
