import Redis from "ioredis";

// Clients are created on first use, not at import time, so builds and
// pages that never touch Redis work without REDIS_URL.
let publisher: Redis | null = null;
let subscriber: Redis | null = null;

function createClient(role: "Publisher" | "Subscriber"): Redis {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error("REDIS_URL environment variable is not set");
  }

  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      return Math.min(times * 50, 2000);
    },
  });

  client.on("error", (err) => {
    console.error(`Redis ${role} Error:`, err);
  });
  client.on("connect", () => {
    console.log(`Redis ${role} connected`);
  });

  return client;
}

export function getPublisher(): Redis {
  if (!publisher) publisher = createClient("Publisher");
  return publisher;
}

export function getSubscriber(): Redis {
  if (!subscriber) subscriber = createClient("Subscriber");
  return subscriber;
}
