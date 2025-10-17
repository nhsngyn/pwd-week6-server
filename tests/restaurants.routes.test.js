const request = require('supertest');
const mongoose = require('mongoose');
const session = require('supertest-session'); // <<< 픽스 3-1: 세션 관리를 위해 추가
const Restaurant = require('../src/models/restaurant.model');
const User = require('../src/models/user.model'); // <<< 픽스 3-2: User 모델 추가
const createApp = require('../src/app');
const bcrypt = require('bcrypt');

describe('Restaurant routes', () => {
  let app;
  let server;
  let testSession; // <<< 픽스 3-3: 로그인된 세션을 저장할 변수

  beforeAll(async () => {
    // 테스트용 DB를 명시적으로 사용하는 것이 안전합니다.
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'test-db' });
    app = createApp();
    server = app.listen(4004);
  });
  
  // <<< 픽스 3-4: 각 테스트 전에 관리자로 로그인하는 로직 추가
  beforeEach(async () => {
    // 테스트용 관리자 생성
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    await User.create({
      email: 'admin@test.com',
      password: hashedPassword,
      name: 'Test Admin',
      userType: 'admin',
      provider: 'local',
    });

    // supertest-session을 사용해 로그인 세션 생성
    testSession = session(app);
    await testSession.post('/api/auth/login').send({
      email: 'admin@test.com',
      password: 'testpassword',
    });
  });

  afterEach(async () => {
    await Restaurant.deleteMany({});
    await User.deleteMany({}); // User 컬렉션도 비워줍니다.
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test('POST /api/restaurants creates a restaurant', async () => {
    const payload = {
      name: '새로운 식당',
      category: '카페',
      location: '캠퍼스 타운',
      rating: 5,
    };

    // <<< 픽스 3-5: request(app) 대신 로그인된 testSession으로 요청
    const response = await testSession
      .post('/api/restaurants')
      .send(payload)
      .set('Content-Type', 'application/json');

    // 이제 401이 아닌 201이 나와야 합니다.
    expect(response.status).toBe(201);
    // 서비스 로직에 따라 응답 형식이 다를 수 있으므로, body 전체 또는 주요 값만 확인합니다.
    expect(response.body.restaurant.name).toBe(payload.name);
  });

  test('GET /api/restaurants/:id returns an item', async () => {
    const newRestaurant = await Restaurant.create({
      id: 2, // <<< 픽스 1: 필수 필드인 'id'를 추가합니다.
      name: 'ID 조회용 식당',
      category: '일식',
      location: '테스트 위치',
      rating: 4,
    });
    
    // 서비스 로직은 숫자 id를 사용하므로, id로 조회합니다.
    const restaurantId = newRestaurant.id;

    // request(app)는 비로그인 상태이지만 GET은 로그인 없이 가능해야 합니다.
    const response = await request(app).get(`/api/restaurants/${restaurantId}`);

    expect(response.status).toBe(200);
    expect(response.body.restaurant.name).toBe('ID 조회용 식당');
  });
});