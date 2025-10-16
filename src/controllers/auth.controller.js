const passport = require('passport');
const User = require('../models/user.model'); // User 모델 경로

// 회원가입
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // TODO: 실제 회원가입 로직 구현 (user.service.js를 통해)
    // 예: const user = await authService.registerUser({ email, password, name });

    const newUser = {
      email,
      name,
      provider: 'local',
      userType: 'user',
    };

    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      user: newUser
    });
  } catch (error) {
    next(error);
  }
};

// 로컬 로그인
exports.login = (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      // 비밀번호 필드 제거 후 응답
      const userWithoutPassword = user.toJSON();
      return res.status(200).json({ success: true, message: '로그인 성공!', user: userWithoutPassword });
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

// 로그아웃
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(); // 세션 파괴
    res.status(200).json({ success: true, message: '로그아웃되었습니다.' });
  });
};

// 현재 로그인된 사용자 정보 확인
exports.checkCurrentUser = (req, res, next) => {
  if (req.user) {
    res.status(200).json({ success: true, user: req.user });
  } else {
    res.status(401).json({ success: false, message: '로그인 상태가 아닙니다.' });
  }
};

// 소셜 로그인 성공 후 콜백 처리
exports.socialLoginCallback = (req, res) => {
  // 소셜 로그인 성공 후 리디렉션할 프론트엔드 페이지
  // TODO: .env 파일 등으로 관리하는 것이 좋음
  const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  res.redirect(frontendUrl);
};