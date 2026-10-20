import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL environment variable is not set");
}

export const publisher = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

export const subscriber = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// Error handling
publisher.on("error", (err) => {
  console.error("Redis Publisher Error:", err);
});

subscriber.on("error", (err) => {
  console.error("Redis Subscriber Error:", err);
});

publisher.on("connect", () => {
  console.log("Redis Publisher connected");
});

subscriber.on("connect", () => {
  console.log("Redis Subscriber connected");
});