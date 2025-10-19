// create-admin.js
require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const User = require('./src/models/user.model'); // User 모델 경로
const { connectDB, closeDB } = require('./src/config/db');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => {
  return new Promise(resolve => rl.question(query, resolve));
};

async function createAdmin() {
  console.log('--- 관리자 계정 생성 스크립트 ---');
  try {
    await connectDB(process.env.MONGODB_URI, process.env.DB_NAME);

    const email = await askQuestion('관리자 이메일을 입력하세요: ');
    const name = await askQuestion('관리자 이름을 입력하세요: ');
    const password = await askQuestion('관리자 비밀번호를 입력하세요: ');

    if (!email || !name || !password) {
      throw new Error('이메일, 이름, 비밀번호는 모두 필수입니다.');
    }

    const existingUser = await User.findOne({ email, provider: 'local' });
    if (existingUser) {
      throw new Error('이미 존재하는 이메일입니다.');
    }

    await User.create({
      email,
      name,
      password, // 해싱은 모델에서 자동으로 처리됩니다.
      provider: 'local',
      userType: 'admin', // 관리자로 설정
    });

    console.log(`✅ 관리자 계정 생성이 완료되었습니다. (이메일: ${email})`);

  } catch (error) {
    console.error('❌ 관리자 생성 중 오류 발생:', error.message);
  } finally {
    await closeDB();
    rl.close();
  }
}

createAdmin();