// app.js (수정 완료)

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const passportConfig = require('./config/passport.config');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const { getCorsConfig } = require('../cors-config');

function createApp() {
  const app = express();
  passportConfig(); // Passport 설정 초기화

  // 프록시 환경 대응 (Render, Vercel 등)
  app.set('trust proxy', 1);

  // 👇 [수정됨] 잘못된 하드코딩 CORS 설정을 삭제하고,
  //            cors-config.js를 사용하는 올바른 설정만 남깁니다.
  app.use(cors(getCorsConfig()));
  
  // 미들웨어 설정
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 세션 설정
  const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
  };

  // 프록시 환경에서 set-cookie 처리 안정화
  if (process.env.NODE_ENV === 'production') {
    sessionConfig.proxy = true;
  }

  // MongoDB 세션 저장소 설정
  if (mongoose.connection.readyState === 1) {
    sessionConfig.store = MongoStore.create({
      client: mongoose.connection.getClient(),
      touchAfter: 24 * 3600 // 24시간
    });
  } else if (process.env.MONGODB_URI) {
    sessionConfig.store = MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      dbName: process.env.DB_NAME,
      touchAfter: 24 * 3600
    });
  }

  app.use(session(sessionConfig));

  // Passport 초기화
  app.use(passport.initialize());
  app.use(passport.session());

  // --- 라우트 설정 ---

  // 1. 라우트 파일들을 불러옵니다.
  const authRoutes = require('./routes/auth.routes');
  const restaurantRoutes = require('./routes/restaurants.routes');
  const submissionRoutes = require('./routes/submissions.routes');
  const userRoutes = require('./routes/users.routes');

  // 2. 서버 상태 확인(Health Check) API를 등록합니다.
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      message: 'Server is running healthily',
    });
  });

  // 3. '/api' 경로에 각 라우터를 직접 연결합니다.
  app.use('/api/auth', authRoutes);
  app.use('/api/restaurants', restaurantRoutes);
  app.use('/api/submissions', submissionRoutes);
  app.use('/api/users', userRoutes);

  return app;
}

module.exports = createApp;