// server.js
const mongoose = require('mongoose');
require('dotenv').config();
const { connectDB, closeDB } = require('./src/config/db');
const createApp = require('./src/app');
const { ensureSeededOnce } = require('./src/services/restaurants.service');

const PORT = process.env.PORT || 5000;

const app = createApp();

async function start() {
  try {
    await connectDB(process.env.MONGODB_URI, process.env.DB_NAME);
    console.log('[MongoDB] connected: ' + mongoose.connection.name);
    // await ensureSeededOnce();
    if (require.main === module) {
      app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    }
  } catch (err) {
    console.error('Failed to start server:', err);
     console.error('-----------------------------------------');
    console.error('[MongoDB] Connection Failed!');
    console.error(err);
    console.error('-----------------------------------------');
    process.exit(1); // 연결 실패 시 서버 종료
  }
}

start();

// graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down...');
  await closeDB();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down...');
  await closeDB();
  process.exit(0);
});

module.exports = app;
