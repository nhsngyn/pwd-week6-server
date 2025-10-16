// GET /api/restaurants (모든 맛집 조회)
exports.getAllRestaurants = (req, res, next) => {
  // TODO: 쿼리 파라미터(category, location)로 필터링하는 로직 구현
  res.status(200).json({ success: true, restaurants: [] });
};

// GET /api/restaurants/popular (인기 맛집 조회)
exports.getPopularRestaurants = (req, res, next) => {
  res.status(200).json({ success: true, restaurants: [] });
};

// GET /api/restaurants/:id (특정 맛집 조회)
exports.getRestaurantById = (req, res, next) => {
  res.status(200).json({ success: true, restaurant: { id: req.params.id, name: 'Sample Restaurant' } });
};

// --- 관리자 전용 ---
// POST /api/restaurants (맛집 생성)
exports.createRestaurant = (req, res, next) => {
  res.status(201).json({ success: true, message: '맛집이 생성되었습니다.', restaurant: req.body });
};

// PUT /api/restaurants/:id (맛집 수정)
exports.updateRestaurant = (req, res, next) => {
  res.status(200).json({ success: true, message: `맛집 ${req.params.id}이(가) 수정되었습니다.` });
};

// DELETE /api/restaurants/:id (맛집 삭제)
exports.deleteRestaurant = (req, res, next) => {
  res.status(200).json({ success: true, message: `맛집 ${req.params.id}이(가) 삭제되었습니다.` });
};