function createApp() {
  const app = express();
  
  // 프록시 환경 대응 (Render, Vercel)
  app.set('trust proxy', 1);

  // CORS 설정 - 환경별 자동 설정
  app.use(cors(getCorsConfig()));
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

  // MongoDB 연결 상태에 따른 세션 저장소 설정
  if (mongoose.connection.readyState === 1) {
    sessionConfig.store = MongoStore.create({
      client: mongoose.connection.getClient(),
      touchAfter: 24 * 3600 // 24시간 동안 세션 업데이트 방지
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
  
// 1. 각 API 라우트 파일을 모두 불러옵니다.
const authRoutes = require('./routes/auth.routes');
const restaurantRoutes = require('./routes/restaurants.routes');
const submissionRoutes = require('./routes/submissions.routes');
const userRoutes = require('./routes/users.routes');

// 2. '/api'로 시작하는 경로에 각 라우터를 직접 연결합니다.
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/users', userRoutes);

  return app;
}