// 내 프로필 조회
exports.getMyProfile = (req, res, next) => {
  // req.user는 isLoggedIn 미들웨어에서 로그인된 사용자 정보를 넣어줍니다.
  res.status(200).json({ success: true, user: req.user });
};

// 프로필 수정
exports.updateMyProfile = (req, res, next) => {
  // TODO: 사용자 정보(이름 등)를 수정하는 로직을 구현해야 합니다.
  res.status(200).json({ success: true, message: '프로필이 성공적으로 수정되었습니다.' });
};

// 비밀번호 변경
exports.changePassword = (req, res, next) => {
  // TODO: 현재 비밀번호를 확인하고 새 비밀번호로 변경하는 로직을 구현해야 합니다.
  res.status(200).json({ success: true, message: '비밀번호가 성공적으로 변경되었습니다.' });
};

// 계정 삭제
exports.deleteAccount = (req, res, next) => {
  // TODO: 사용자 계정을 비활성화하거나 삭제하는 로직을 구현해야 합니다.
  res.status(200).json({ success: true, message: '계정이 성공적으로 삭제되었습니다.' });
};

// --- 관리자 전용 기능 ---

// 모든 사용자 조회
exports.getAllUsers = (req, res, next) => {
  // TODO: 모든 사용자 목록을 조회하는 로직을 구현해야 합니다.
  res.status(200).json({ success: true, users: [] });
};

// 사용자 권한 변경
exports.changeUserType = (req, res, next) => {
  const { userId } = req.params;
  const { userType } = req.body;
  // TODO: 특정 사용자의 userType을 변경하는 로직을 구현해야 합니다.
  res.status(200).json({ success: true, message: `사용자 ${userId}의 권한이 ${userType}(으)로 변경되었습니다.` });
};