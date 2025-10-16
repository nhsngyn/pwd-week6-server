// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const { isLoggedIn, isNotLoggedIn } = require('../middleware/auth.middleware');

// POST /api/auth/register (회원가입)
router.post('/register', isNotLoggedIn, authController.register);

// POST /api/auth/login (로컬 로그인)
router.post('/login', isNotLoggedIn, authController.login);

// POST /api/auth/logout (로그아웃)
router.post('/logout', isLoggedIn, authController.logout);

// GET /api/auth/me (현재 로그인된 사용자 정보)
router.get('/me', isLoggedIn, authController.checkCurrentUser);

// --- 소셜 로그인 ---

// GET /api/auth/google (Google 로그인 시작)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET /api/auth/google/callback (Google 로그인 콜백)
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.socialLoginCallback
);

// GET /api/auth/naver (네이버 로그인 시작)
router.get('/naver', passport.authenticate('naver', { authType: 'reprompt' }));

// GET /api/auth/naver/callback (네이버 로그인 콜백)
router.get(
  '/naver/callback',
  passport.authenticate('naver', { failureRedirect: '/login' }),
  authController.socialLoginCallback
);

module.exports = router;