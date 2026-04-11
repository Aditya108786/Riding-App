const { createClient } = require("redis");

let redis;

async function connectRedis() {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error("REDIS_URL is required to start the service");
  }

  if (redis) {
    return redis;
  }

  redis = createClient({
    url: redisUrl,
    socket: {
      tls: process.env.REDIS_TLS === "true" || redisUrl.startsWith("rediss://"),
      keepAlive: 10000,
      reconnectStrategy: (retries) => Math.min(retries * 100, 3000)
    }
  });

  redis.on("connect", () => console.log("✅ Redis connected"));
  redis.on("error", (err) => console.error("❌ Redis error", err));

  await redis.connect();
  return redis;
}

function getRedis() {
  if (!redis) {
    throw new Error("Redis not initialised");
  }
  return redis;
}

module.exports = { connectRedis, getRedis };
