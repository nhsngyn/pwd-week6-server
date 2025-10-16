const express = require('express');
const router = express.Router();
const submissionsController = require('../controllers/submissions.controller');
const { isLoggedIn, isAdmin } = require('../middleware/auth.middleware');

// POST /api/submissions (새로운 제보 생성)
router.post('/', submissionsController.createSubmission);

// --- 관리자 전용 ---
// GET /api/submissions (모든 제보 조회)
router.get('/', isLoggedIn, isAdmin, submissionsController.getSubmissions);

// PUT /api/submissions/:id (제보 상태 변경)
router.put('/:id', isLoggedIn, isAdmin, submissionsController.updateSubmissionStatus);

module.exports = router;