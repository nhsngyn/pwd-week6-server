// src/config/passport.config.js

// ----------------- [ 1. 필요한 모듈 불러오기 ] -----------------
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const NaverStrategy = require('passport-naver').Strategy; // 네이버 로그인 시 필요
const User = require('../models/user.model');
const authService = require('../services/auth.service');


// ----------------- [ 2. 전체 설정을 함수로 감싸서 내보내기 ] -----------------
module.exports = () => {

  // --- 로컬 로그인 전략 ---
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email, provider: 'local' });
      if (!user || !(await user.comparePassword(password))) {
        return done(null, false, { message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // --- Google OAuth 전략 ---
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Google 프로필 정보로 사용자를 찾거나 새로 생성합니다.
      const user = await authService.findOrCreateUser(profile);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // TODO: Naver OAuth 전략도 여기에 추가할 수 있습니다.


  // ----------------- [ 3. 세션 관리 (매우 중요!) ] -----------------
  // 로그인 성공 시, 사용자 정보 중 'id'만 세션에 저장합니다.
  // 이렇게 하면 세션 크기가 작아져 효율적입니다.
  passport.serializeUser((user, done) => {
    done(null, user.id); // user.id는 MongoDB의 _id 값입니다.
  });

  // 매 요청마다 세션에 저장된 사용자 id를 이용해 전체 사용자 정보를 DB에서 조회합니다.
  // 조회된 정보는 req.user에 저장되어 API 전반에서 사용됩니다.
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};