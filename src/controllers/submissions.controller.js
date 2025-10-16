// POST /api/submissions (새로운 제보 생성)
exports.createSubmission = (req, res, next) => {
  res.status(201).json({ success: true, message: '제보가 성공적으로 접수되었습니다.', submission: req.body });
};

// --- 관리자 전용 ---
// GET /api/submissions (모든 제보 조회)
exports.getSubmissions = (req, res, next) => {
  // TODO: 쿼리 파라미터(status)로 필터링하는 로직 구현
  res.status(200).json({ success: true, submissions: [] });
};

// PUT /api/submissions/:id (제보 상태 변경)
exports.updateSubmissionStatus = (req, res, next) => {
  res.status(200).json({ success: true, message: `제보 ${req.params.id}의 상태가 변경되었습니다.` });
};