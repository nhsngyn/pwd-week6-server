// 로그인한 상태인지 확인하는 미들웨어
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) { // Passport가 제공하는 메서드, 로그인 되어 있으면 true
    next(); // 다음 미들웨어로 진행
  } else {
    res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
  }
};

// 로그인하지 않은 상태인지 확인하는 미들웨어
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(400).json({ success: false, message: '이미 로그인한 상태입니다.' });
  }
};

// 관리자 권한인지 확인하는 미들웨어
exports.isAdmin = (req, res, next) => {
  // isLoggedIn이 먼저 실행되어 req.user가 보장된 상태에서 사용
  if (req.user && req.user.userType === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: '관리자 권한이 필요합니다.' });
  }
};