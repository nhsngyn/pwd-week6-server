// src/config/passport.config.js

// 로컬 전략 설정
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email, provider: 'local' });
    if (!user || !await user.comparePassword(password)) {
      return done(null, false, { message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Google OAuth 전략
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  // Google 프로필 정보로 사용자 생성/조회
}));