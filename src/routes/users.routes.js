const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { isLoggedIn, isAdmin } = require('../middleware/auth.middleware');

// GET /api/users/profile (내 프로필 조회)
router.get('/profile', isLoggedIn, usersController.getMyProfile);

// PUT /api/users/profile (프로필 수정)
router.put('/profile', isLoggedIn, usersController.updateMyProfile);

// PUT /api/users/password (비밀번호 변경)
router.put('/password', isLoggedIn, usersController.changePassword);

// DELETE /api/users/account (계정 삭제)
router.delete('/account', isLoggedIn, usersController.deleteAccount);

// --- 관리자 전용 ---

// GET /api/users/all (모든 사용자 조회 - 관리자)
router.get('/all', isLoggedIn, isAdmin, usersController.getAllUsers);

// PUT /api/users/:userId/type (사용자 권한 변경 - 관리자)
router.put('/:userId/type', isLoggedIn, isAdmin, usersController.changeUserType);

module.exports = router;