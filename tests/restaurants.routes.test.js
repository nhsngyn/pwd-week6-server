// tests/restaurants.routes.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const session = require('supertest-session'); // 👈 [1] 세션 라이브러리 가져오기
const Restaurant = require('../src/models/restaurant.model');
const User = require('../src/models/user.model'); // 👈 [2] User 모델 가져오기
const createApp = require('../src/app');

describe('Restaurant routes', () => {
  let app;
  let server;
  let testSession; // 👈 [3] 로그인된 세션을 담을 변수

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'test-db' });
    app = createApp();
    server = app.listen(4004); // 테스트용 전용 포트 사용
  });

  // 👇 [4] 각 테스트가 시작되기 전에, 관리자 유저를 만들고 로그인합니다.
  beforeEach(async () => {
    // 임시 관리자 유저 생성
    await User.create({
      email: 'admin@test.com',
      password: 'testpassword', // 모델에서 자동으로 암호화됩니다.
      name: 'Test Admin',
      userType: 'admin',
      provider: 'local',
    });

    // 세션을 만들고 관리자 유저로 로그인합니다.
    testSession = session(app);
    await testSession.post('/api/auth/login').send({
      email: 'admin@test.com',
      password: 'testpassword',
    });
  });

  // 각 테스트가 끝난 후, 데이터베이스를 깨끗하게 비웁니다.
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
      // 'id'는 서비스에서 생성하므로 보내지 않습니다.
    };

    // 👇 [5] 로그인된 'testSession'을 사용해 요청을 보냅니다.
    const response = await testSession
      .post('/api/restaurants')
      .send(payload)
      .set('Content-Type', 'application/json');

    // 이제 관리자로 로그인했으므로 상태 코드는 201이 되어야 합니다.
    expect(response.status).toBe(201);
    expect(response.body.restaurant.name).toBe(payload.name);
  });

  test('GET /api/restaurants/:id returns an item', async () => {
    const newRestaurant = await Restaurant.create({
      id: 1, // 테스트 데이터에 필요한 'id' 필드 추가
      name: 'ID 조회용 식당',
      category: '일식',
      location: '테스트 위치',
    });

    // GET 요청은 로그인이 필요 없으므로 일반 'request'를 사용합니다.
    const response = await request(app).get(`/api/restaurants/${newRestaurant.id}`);

    expect(response.status).toBe(200);
    expect(response.body.restaurant.name).toBe('ID 조회용 식당');
  });
});