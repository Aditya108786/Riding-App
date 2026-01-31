const app = require('./app');
const http = require('http');
const { connectRedis } = require('./config/Redis');
const { initializesocket } = require('./socket');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

(async () => {
  try {
    await connectRedis();
    await initializesocket(server);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
})();
