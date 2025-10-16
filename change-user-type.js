// change-user-type.js
require('dotenv').config();
const User = require('./src/models/user.model'); // User 모델 경로
const { connectDB, closeDB } = require('./src/config/db');

async function changeUserType() {
  console.log('--- 사용자 권한 변경 스크립트 ---');
  try {
    const args = process.argv.slice(2); // node와 파일명을 제외한 인자
    const [email, userType] = args;

    if (!email || !userType) {
      console.log('사용법: node change-user-type.js <이메일> <권한>');
      console.log('예시: node change-user-type.js user@example.com admin');
      throw new Error('이메일과 변경할 권한을 모두 입력해야 합니다.');
    }

    if (!['user', 'admin'].includes(userType)) {
      throw new Error("권한은 'user' 또는 'admin' 중 하나여야 합니다.");
    }

    await connectDB(process.env.MONGODB_URI, process.env.DB_NAME);

    const user = await User.findOne({ email, provider: 'local' });
    if (!user) {
      throw new Error(`'${email}' 이메일을 가진 사용자를 찾을 수 없습니다.`);
    }

    user.userType = userType;
    await user.save();

    console.log(`✅ 사용자(${email})의 권한이 '${userType}'(으)로 성공적으로 변경되었습니다.`);

  } catch (error) {
    console.error('❌ 권한 변경 중 오류 발생:', error.message);
  } finally {
    await closeDB();
  }
}

changeUserType();