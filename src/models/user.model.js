const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      // unique 속성은 단독 인덱스이므로 아래 복합 인덱스로 대체합니다.
    },
    password: {
      type: String,
      // provider가 'local'(자체 회원가입)일 때만 password 필드를 필수로 지정
      required: function () {
        return this.provider === 'local';
      },
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'naver'],
      default: 'local',
    },
    providerId: {
      // 소셜 로그인 시 제공되는 고유 ID
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userType: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// 1. 복합 인덱스: email과 provider 조합의 유니크 제약
userSchema.index({ email: 1, provider: 1 }, { unique: true });

// 2. 비밀번호 해싱: save 이벤트가 발생하기 전에 실행되는 미들웨어
userSchema.pre('save', async function (next) {
  // 비밀번호가 변경되었거나, 새로운 'local' 유저일 때만 해싱 실행
  if (!this.isModified('password') || this.provider !== 'local') {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 3. 비밀번호 검증 메서드
userSchema.methods.comparePassword = function (candidatePassword) {
  // 'local' 유저가 아니면 비밀번호 비교가 의미 없으므로 false 반환
  if (this.provider !== 'local') return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// 4. JSON 직렬화: 응답 시 비밀번호 필드 자동 제거
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password; // 응답 객체에서 password 필드 삭제
    delete ret.__v;
    delete ret._id; // 필요 시 _id도 제거
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;