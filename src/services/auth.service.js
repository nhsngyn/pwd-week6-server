// src/services/auth.service.js

const User = require('../models/user.model');

/**
 * 로컬 계정 사용자를 생성합니다.
 * @param {object} userData - { email, password, name }
 * @returns {Promise<Document>} 생성된 사용자 문서
 */
async function registerUser(userData) {
  const { email, password, name } = userData;

  // 이미 가입된 로컬 이메일인지 확인
  const existingUser = await User.findOne({ email, provider: 'local' });
  if (existingUser) {
    const error = new Error('이미 가입된 이메일입니다.');
    error.statusCode = 409; // 409 Conflict: 리소스 충돌
    throw error;
  }

  // 새로운 사용자 생성 (비밀번호 해싱은 User 모델의 pre-save hook에서 처리)
  const newUser = new User({
    email,
    password,
    name,
    provider: 'local',
  });

  try {
    // 👇 [로그 1] 저장 시도 로그
    console.log(`[DEBUG] Saving new user to DB: ${newUser.email}`);
    
    const savedUser = await newUser.save();

    // 👇 [로그 2] 저장 성공 로그
    console.log(`[DEBUG] User successfully saved with ID: ${savedUser._id}`);
    
    return savedUser;
  } catch (error) {
    // 👇 [로그 3] 저장 실패 에러 로그
    console.error('[DEBUG] Error while saving user:', error);
    throw error;
  }
}

/**
 * 소셜 로그인 프로필을 기반으로 사용자를 찾거나 생성합니다.
 * @param {object} profile - Passport.js에서 받은 프로필 객체
 * @returns {Promise<Document>} 찾거나 생성한 사용자 문서
 */
async function findOrCreateUser(profile) {
  const { provider, id: providerId, displayName: name, emails } = profile;
  const email = emails && emails[0] ? emails[0].value : null;

  if (!email) {
    // 소셜 계정에서 이메일 정보를 제공하지 않을 경우의 예외 처리
    const error = new Error('소셜 프로필에서 이메일 정보를 얻을 수 없습니다.');
    error.statusCode = 400;
    throw error;
  }

  // 1. provider와 providerId로 기존 사용자가 있는지 찾습니다.
  let user = await User.findOne({ provider, providerId });

  if (user) {
    return user; // 사용자를 찾았으면 바로 반환
  }

  // 2. 없다면, 같은 이메일을 가진 다른 소셜 계정 사용자가 있는지 확인 (선택사항)
  user = await User.findOne({ email });
  if (user) {
    // 동일 이메일, 다른 provider인 경우 -> 계정 통합 로직을 구현하거나 에러 처리
    // 여기서는 간단하게 에러를 발생시킵니다.
    const error = new Error(`이미 ${user.provider}(으)로 가입된 이메일입니다.`);
    error.statusCode = 409;
    throw error;
  }

  // 3. 완전히 새로운 사용자라면 새로 생성합니다.
  const newUser = await User.create({
    email,
    name,
    provider,
    providerId,
  });

  return newUser;
}


module.exports = {
  registerUser,
  findOrCreateUser,
};