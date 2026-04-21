const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const User = require('../models/User');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toEqual('test@example.com');
      expect(res.body.user.username).toEqual('testuser');
      expect(res.body.user).toHaveProperty('id');
    });

    it('should not register a user with duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser2',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('User already exists with this email');
    });

    it('should not register a user with duplicate username', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test2@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('User already exists with this username');
    });

    it('should not register a user with invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'invaliduser',
          email: 'not-an-email',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error');
    });

    it('should not register a user with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'shortpassuser',
          email: 'short@example.com',
          password: '1234'
        });
      
      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error');
    });

    it('should not register a user with password without number', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'nonumuser',
          email: 'nonum@example.com',
          password: 'password'
        });
      
      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toEqual('test@example.com');
    });

    it('should not login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Invalid credentials');
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'doesnotexist@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    let token;

    beforeAll(async () => {
      // Login to get token
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      token = res.body.token;
    });

    it('should get current user info with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toEqual('test@example.com');
      expect(res.body.user.username).toEqual('testuser');
    });

    it('should deny access without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');
      
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('No token, authorization denied');
    });

    it('should deny access with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken123');
      
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('Token is not valid');
    });
  });

  describe('POST /api/auth/logout', () => {
    let token;

    beforeAll(async () => {
      // Login to get token
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      token = res.body.token;
    });

    it('should logout successfully with valid token', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Logged out successfully');
    });

    it('should deny logout without token', async () => {
      const res = await request(app)
        .post('/api/auth/logout');
      
      expect(res.statusCode).toEqual(401);
    });

    it('should deny logout with invalid token', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer invalidtoken');
      
      expect(res.statusCode).toEqual(401);
    });
  });
});
