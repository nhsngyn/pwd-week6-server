// src/middleware/auth.middleware.js)

// 로그인 확인
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: '로그인이 필요합니다.' });
};

// 관리자 권한 확인
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.userType === 'admin') {
    return next();
  }
  return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
};

//로컬 계정 확인
const isLocalAccount = (req, res, next) => {
  if (req.isAuthenticated() && req.user.provider === 'local') {
    return next();
  }
  return res.status(400).json({ message: '로컬 계정이 아닙니다.' });
};