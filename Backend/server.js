const app = require('./app');
const http = require('http');
const { connectRedis } = require('./config/Redis');
const { initializesocket } = require('./socket');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

(async () => {
  try {
    const redisclient = await connectRedis();
    
    await initializesocket(server,redisclient);

    server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
})();
