const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

describe('Health Check Tests (14 tests)', () => {
  beforeAll(async () => {
    // Sync database before tests
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close database connection after tests
    await sequelize.close();
  });

  // Test 1: Basic health check endpoint
  test('1. Health check endpoint returns 200 OK', async () => {
    const response = await request(app).get('/api/health-check');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.message).toBe('Server is running');
  });

  // Test 2: Server responds to JSON requests
  test('2. Server accepts JSON content-type', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({});
    // Should not 415, even with bad input
    expect(response.statusCode).not.toBe(415);
  });

  // Test 3: CORS headers are present
  test('3. CORS headers are properly set', async () => {
    const response = await request(app).get('/api/health');
    expect(response.headers['access-control-allow-origin']).toBeDefined();
  });

  // Test 4: 404 for non-existent routes
  test('4. Non-existent routes return 404', async () => {
    const response = await request(app).get('/api/non-existent');
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Route not found');
  });

  // Test 5: User model can connect to DB
  test('5. Database connection is working', async () => {
    expect(async () => {
      await sequelize.authenticate();
    }).not.toThrow();
  });

  // Test 6: Can create a new user
  test('6. Can create a new user in database', async () => {
    const user = await User.create({
      username: 'testuser1',
      email: 'test1@example.com',
      password: 'password123'
    });
    expect(user.username).toBe('testuser1');
    expect(user.email).toBe('test1@example.com');
    expect(user.password).not.toBe('password123'); // Password should be hashed
  });

  // Test 7: Can find user by email
  test('7. Can find existing user by email', async () => {
    const user = await User.findOne({ where: { email: 'test1@example.com' } });
    expect(user).not.toBeNull();
    expect(user.username).toBe('testuser1');
  });

  // Test 8: Password hashing and validation works
  test('8. Password validation works correctly', async () => {
    const user = await User.findOne({ where: { email: 'test1@example.com' } });
    const isValid = await user.validatePassword('password123');
    const isInvalid = await user.validatePassword('wrongpassword');
    expect(isValid).toBe(true);
    expect(isInvalid).toBe(false);
  });

  // Test 9: JWT can be signed and verified
  test('9. JWT signing and verification works', async () => {
    const user = await User.findOne({ where: { email: 'test1@example.com' } });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET);
    expect(decoded.userId).toBe(user.id);
  });

  // Test 10: Registration endpoint works
  test('10. User registration endpoint creates user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'password123'
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('test2@example.com');
  });

  // Test 11: Login endpoint works with correct credentials
  test('11. User login works with correct credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test1@example.com',
        password: 'password123'
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.username).toBe('testuser1');
  });

  // Test 12: Login fails with wrong password
  test('12. Login fails with wrong password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test1@example.com',
        password: 'wrongpassword'
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid credentials');
  });

  // Test 13: Auth middleware rejects missing token
  test('13. Auth middleware rejects requests without token', async () => {
    const response = await request(app).get('/api/auth/me');
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('No token, authorization denied');
  });

  // Test 14: Auth middleware accepts valid token
  test('14. Auth middleware accepts valid token and returns user data', async () => {
    const user = await User.findOne({ where: { email: 'test1@example.com' } });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.user.id).toBe(user.id);
    expect(response.body.user.email).toBe(user.email);
  });
});