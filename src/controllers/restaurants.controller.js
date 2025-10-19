// src/controllers/restaurants.controller.js
const restaurantService = require('../services/restaurants.service');

// GET /api/restaurants (모든 맛집 조회)
exports.getAllRestaurants = async (req, res, next) => {
  try {
    // 👇 서비스 로직을 호출하여 실제 데이터를 가져옵니다.
    const restaurants = await restaurantService.getAllRestaurants(req.query);
    res.status(200).json({ success: true, restaurants });
  } catch (error) {
    next(error);
  }
};

// GET /api/restaurants/popular (인기 맛집 조회)
exports.getPopularRestaurants = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const restaurants = await restaurantService.getPopularRestaurants(limit);
    res.status(200).json({ success: true, restaurants });
  } catch (error) {
    next(error);
  }
};

// GET /api/restaurants/:id (특정 맛집 조회)
exports.getRestaurantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // 👇 서비스 로직을 호출하여 실제 데이터를 가져옵니다.
    const restaurant = await restaurantService.getRestaurantById(id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: '맛집을 찾을 수 없습니다.' });
    }
    res.status(200).json({ success: true, restaurant });
  } catch (error) {
    next(error);
  }
};

// --- 관리자 전용 ---
// POST /api/restaurants (맛집 생성)
exports.createRestaurant = async (req, res, next) => {
  try {
    const newRestaurant = await restaurantService.createRestaurant(req.body);
    res.status(201).json({ success: true, message: '맛집이 생성되었습니다.', restaurant: newRestaurant });
  } catch (error) {
    next(error);
  }
};

// PUT /api/restaurants/:id (맛집 수정)
exports.updateRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedRestaurant = await restaurantService.updateRestaurant(id, req.body);
    if (!updatedRestaurant) {
      return res.status(404).json({ success: false, message: '맛집을 찾을 수 없습니다.' });
    }
    res.status(200).json({ success: true, message: `맛집 ${id}이(가) 수정되었습니다.`, restaurant: updatedRestaurant });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/restaurants/:id (맛집 삭제)
exports.deleteRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedRestaurant = await restaurantService.deleteRestaurant(id);
    if (!deletedRestaurant) {
      return res.status(404).json({ success: false, message: '맛집을 찾을 수 없습니다.' });
    }
    res.status(200).json({ success: true, message: `맛집 ${id}이(가) 삭제되었습니다.` });
  } catch (error) {
    next(error);
  }
};