const mongoose = require('mongoose');
const Restaurant = require('../src/models/restaurant.model');
const restaurantService = require('../src/services/restaurants.service');

describe('RestaurantService', () => {
  // 1. 모든 테스트 시작 전 DB에 한 번만 연결합니다.
  beforeAll(async () => {
    // 테스트용 DB를 명시적으로 사용하는 것이 안전합니다.
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'test-db' });
  });

  // 2. 각 테스트가 끝난 후 DB를 깨끗하게 비웁니다.
  afterEach(async () => {
    await Restaurant.deleteMany({});
  });

  // 3. 모든 테스트가 끝난 후 DB 연결을 끊습니다.
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('getAllRestaurants resolves with data', async () => {
    // given: 테스트를 위한 데이터를 먼저 생성합니다.
    await Restaurant.create({
      id: 1, // <<< 픽스 1: 필수 필드인 'id'를 추가합니다.
      name: '임시 식당',
      category: '한식',
      location: '테스트 캠퍼스',
      rating: 5,
    });

    // when: 서비스 함수를 호출합니다.
    const restaurants = await restaurantService.getAllRestaurants();

    // then: 결과를 검증합니다.
    expect(Array.isArray(restaurants)).toBe(true);
    expect(restaurants.length).toBe(1);
    expect(restaurants[0].id).toBe(1); // id가 잘 들어갔는지 확인
  });

  test('createRestaurant appends a new entry', async () => {
    const payload = {
      name: '테스트 식당',
      category: '테스트',
      location: '가상 캠퍼스',
      rating: 4.5,
    };

    // createRestaurant는 내부적으로 id를 생성하므로 payload에는 id가 없습니다.
    const created = await restaurantService.createRestaurant(payload);

    expect(created.id).toBeDefined();
    expect(created.name).toBe(payload.name);

    const all = await restaurantService.getAllRestaurants();
    const found = all.find((item) => item.id === created.id);
    
    expect(found).toBeTruthy();
  });

  test('createRestaurant rejects invalid payloads', async () => {
    // <<< 픽스 2: 서비스가 실제로 던지는 에러 메시지와 일치시킵니다.
    // Mongoose의 긴 오류 메시지가 아닌, 서비스 로직에서 직접 만든 짧은 오류 메시지를 기대해야 합니다.
    await expect(
      restaurantService.createRestaurant({ name: '누락된 식당' })
    ).rejects.toThrow("'category' is required");
  });
});