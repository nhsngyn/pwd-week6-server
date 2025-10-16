// src/config/db.js
const mongoose = require('mongoose');

async function connectDB(uri, dbName) {
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Set it in environment variables.');
  }
  await mongoose.connect(uri, {
    dbName: effectiveDbName,
    autoIndex: process.env.NODE_ENV !== 'production',
    maxPoolSize: 10,                    // 연결 풀 최대 크기
    serverSelectionTimeoutMS: 10000,    // 서버 선택 타임아웃
    family: 4,                          // IPv4 우선 사용
  });
  mongoose.connection.on('connected', () => {
    console.log(`[MongoDB] connected: ${mongoose.connection.name}`);
  });
  mongoose.connection.on('error', (err) => {
    console.error('[MongoDB] connection error:', err);
  });
}

async function closeDB() {
  try {
    await mongoose.connection.close(false);
    console.log('[MongoDB] connection closed');
  } catch (err) {
    console.error('[MongoDB] error on close:', err);
  }
}

module.exports = { connectDB, closeDB };