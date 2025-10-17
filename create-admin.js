require('dotenv').config();
const readline = require('readline');
const User = require('./src/models/user.model'); // User 모델 경로
const { connectDB, closeDB } = require('./src/config/db'); // DB 연결 함수

// 터미널에서 사용자 입력을 받기 위한 설정
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 질문을 하고 답변을 Promise로 반환하는 헬퍼 함수
const askQuestion = (query) => {
  return new Promise(resolve => rl.question(query, resolve));
};

// 메인 실행 함수
async function createAdmin() {
  console.log('--- 👑 관리자 계정 생성 스크립트 ---');
  try {
    // 1. 데이터베이스 연결
    await connectDB(process.env.MONGODB_URI, process.env.DB_NAME);

    // 2. 사용자로부터 정보 입력받기
    const email = await askQuestion('관리자 이메일을 입력하세요: ');
    const name = await askQuestion('관리자 이름을 입력하세요: ');
    const password = await askQuestion('관리자 비밀번호를 입력하세요: ');

    if (!email || !name || !password) {
      throw new Error('이메일, 이름, 비밀번호는 모두 필수입니다.');
    }

    // 3. 이미 존재하는 사용자인지 확인
    const existingUser = await User.findOne({ email, provider: 'local' });
    if (existingUser) {
      throw new Error('이미 존재하는 이메일입니다.');
    }

    // 4. 관리자 계정 생성
    await User.create({
      email,
      name,
      password, // 비밀번호 해싱은 User 모델에서 자동으로 처리됩니다.
      provider: 'local',
      userType: 'admin', // 권한을 'admin'으로 설정
    });

    console.log(`✅ 관리자 계정 생성이 완료되었습니다. (이메일: ${email})`);

  } catch (error) {
    console.error('❌ 관리자 생성 중 오류 발생:', error.message);
  } finally {
    // 5. 작업 완료 후 DB 연결 및 입력기 종료
    await closeDB();
    rl.close();
  }
}

// 스크립트 실행
createAdmin();