// src/config/db.js
const mongoose = require('mongoose');

async function connectDB(uri, dbName) {
  if (!uri) {
    throw new Error('MONGODB_URI가 환경 변수에 설정되지 않았습니다.');
  }

  // 👇 이 한 줄을 추가하여 변수를 선언합니다.
  const effectiveDbName = dbName || process.env.DB_NAME;

  try {
    await mongoose.connect(uri, {
      dbName: effectiveDbName, // 선언된 변수를 여기서 사용
      autoIndex: process.env.NODE_ENV !== 'production',
      maxPoolSize: 10,                // 연결 풀 최대 크기
      serverSelectionTimeoutMS: 10000,    // 서버 선택 타임아웃
      family: 4,                        // IPv4 우선 사용
    });
    
    // 연결 성공 시 한 번만 로그를 출력합니다.
    console.log(`✅ MongoDB에 성공적으로 연결되었습니다: ${effectiveDbName}`);

  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error);
    process.exit(1); // 연결 실패 시 서버 프로세스를 종료합니다.
  }
}

async function closeDB() {
  try {
    await mongoose.connection.close(false);
    console.log('MongoDB 연결이 종료되었습니다.');
  } catch (err) {
    console.error('MongoDB 연결 종료 중 오류 발생:', err);
  }
}

// 연결 후 발생하는 이벤트에 대한 리스너 설정
mongoose.connection.on('error', (err) => {
  console.error('[MongoDB] 연결 에러 발생:', err);
});

module.exports = { connectDB, closeDB };