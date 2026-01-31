const { createClient } = require("redis");

let redis;

async function connectRedis() {
  // ✅ If already connected, reuse
  if (redis) {
    return redis;
  }

  redis = createClient({
    url: process.env.REDIS_URL,
    socket: {
      tls: true,
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
