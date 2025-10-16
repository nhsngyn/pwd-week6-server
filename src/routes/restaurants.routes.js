const express = require('express');
const router = express.Router();
const restaurantsController = require('../controllers/restaurants.controller');
const { isLoggedIn, isAdmin } = require('../middleware/auth.middleware');

// GET /api/restaurants (모든 맛집 조회)
router.get('/', restaurantsController.getAllRestaurants);

// GET /api/restaurants/popular (인기 맛집 조회)
router.get('/popular', restaurantsController.getPopularRestaurants);

// GET /api/restaurants/:id (특정 맛집 조회)
router.get('/:id', restaurantsController.getRestaurantById);

// --- 관리자 전용 ---
// POST /api/restaurants (맛집 생성)
router.post('/', isLoggedIn, isAdmin, restaurantsController.createRestaurant);

// PUT /api/restaurants/:id (맛집 수정)
router.put('/:id', isLoggedIn, isAdmin, restaurantsController.updateRestaurant);

// DELETE /api/restaurants/:id (맛집 삭제)
router.delete('/:id', isLoggedIn, isAdmin, restaurantsController.deleteRestaurant);

module.exports = router;