const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const User = require('../models/User');
const Workout = require('../models/Workout');

describe('Workout Endpoints', () => {
  let testUser;
  let token;
  let workoutId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    // Create a test user
    testUser = await User.create({
      username: 'workoutuser',
      email: 'workout@example.com',
      password: 'password123'
    });
    
    // Login to get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'workout@example.com',
        password: 'password123'
      });
    
    token = res.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/workouts - Authentication', () => {
    it('should deny access without token', async () => {
      const res = await request(app)
        .get('/api/workouts');
      
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('No token, authorization denied');
    });

    it('should deny access with invalid token', async () => {
      const res = await request(app)
        .get('/api/workouts')
        .set('Authorization', 'Bearer invalidtoken');
      
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('Token is not valid');
    });
  });

  describe('POST /api/workouts', () => {
    it('should create a new strength workout with all fields', async () => {
      const workoutData = {
        name: 'Upper Body Workout',
        type: 'strength',
        duration: 45,
        caloriesBurned: 300,
        sets: 4,
        reps: 8,
        weight: 80,
        notes: 'Felt strong today',
        date: new Date().toISOString(),
        completed: true
      };

      const res = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${token}`)
        .send(workoutData);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toEqual(workoutData.name);
      expect(res.body.type).toEqual(workoutData.type);
      expect(res.body.sets).toEqual(workoutData.sets);
      expect(res.body.reps).toEqual(workoutData.reps);
      expect(res.body.weight).toEqual(workoutData.weight);
      expect(res.body.userId).toEqual(testUser.id);
      
      workoutId = res.body.id;
    });

    it('should create a new cardio workout with minimal fields', async () => {
      const workoutData = {
        name: 'Morning Run',
        type: 'cardio',
        date: new Date().toISOString()
      };

      const res = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${token}`)
        .send(workoutData);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toEqual(workoutData.name);
      expect(res.body.type).toEqual(workoutData.type);
      expect(res.body.completed).toEqual(true); // default value
      expect(res.body.userId).toEqual(testUser.id);
    });

    it('should not create a workout without required fields', async () => {
      const workoutData = {
        duration: 30
      };

      const res = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${token}`)
        .send(workoutData);
      
      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error');
    });

    it('should not allow access without token', async () => {
      const res = await request(app)
        .post('/api/workouts')
        .send({
          name: 'Test',
          type: 'strength',
          date: new Date().toISOString()
        });
      
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/workouts', () => {
    it('should get all workouts for the authenticated user', async () => {
      const res = await request(app)
        .get('/api/workouts')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('workouts');
      expect(res.body).toHaveProperty('pagination');
      expect(Array.isArray(res.body.workouts)).toBe(true);
      expect(res.body.pagination.total).toBeGreaterThan(0);
      expect(res.body.workouts.length).toBeGreaterThan(0);
    });

    it('should return pagination metadata', async () => {
      const res = await request(app)
        .get('/api/workouts?page=1&limit=10')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.pagination).toHaveProperty('total');
      expect(res.body.pagination).toHaveProperty('page', 1);
      expect(res.body.pagination).toHaveProperty('limit', 10);
      expect(res.body.pagination).toHaveProperty('pages');
    });

    it('should filter by workout type', async () => {
      const res = await request(app)
        .get('/api/workouts?type=strength')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.workouts.every(w => w.type === 'strength')).toBe(true);
    });
  });

  describe('GET /api/workouts/:id', () => {
    it('should get a specific workout by ID', async () => {
      const res = await request(app)
        .get(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', workoutId);
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('type');
      expect(res.body.userId).toEqual(testUser.id);
    });

    it('should return 404 for non-existent workout', async () => {
      const res = await request(app)
        .get('/api/workouts/9999')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Workout not found');
    });

    it('should not allow access to another user\'s workout', async () => {
      // Create another user and workout
      const anotherUser = await User.create({
        username: 'anotheruser',
        email: 'another@example.com',
        password: 'password123'
      });

      const anotherWorkout = await Workout.create({
        name: 'Another User\'s Workout',
        type: 'flexibility',
        date: new Date(),
        userId: anotherUser.id
      });

      const res = await request(app)
        .get(`/api/workouts/${anotherWorkout.id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Workout not found');
    });
  });

  describe('PUT /api/workouts/:id', () => {
    it('should update an existing workout', async () => {
      const updateData = {
        name: 'Updated Upper Body Workout',
        duration: 50,
        completed: false
      };

      const res = await request(app)
        .put(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toEqual(updateData.name);
      expect(res.body.duration).toEqual(updateData.duration);
      expect(res.body.completed).toEqual(updateData.completed);
      // Type should remain unchanged
      expect(res.body.type).toEqual('strength');
    });

    it('should return 404 when updating non-existent workout', async () => {
      const res = await request(app)
        .put('/api/workouts/9999')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated' });
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Workout not found');
    });

    it('should not allow updating another user\'s workout', async () => {
      // Create another user and workout
      const anotherUser = await User.create({
        username: 'user2',
        email: 'user2@example.com',
        password: 'password123'
      });

      const anotherWorkout = await Workout.create({
        name: 'User 2 Workout',
        type: 'cardio',
        date: new Date(),
        userId: anotherUser.id
      });

      const res = await request(app)
        .put(`/api/workouts/${anotherWorkout.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Hacked' });
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Workout not found');
    });
  });

  describe('DELETE /api/workouts/:id', () => {
    it('should delete an existing workout', async () => {
      const res = await request(app)
        .delete(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Workout deleted');

      // Verify it's gone
      const checkRes = await request(app)
        .get(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(checkRes.statusCode).toEqual(404);
    });

    it('should return 404 when deleting non-existent workout', async () => {
      const res = await request(app)
        .delete('/api/workouts/9999')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Workout not found');
    });

    it('should not allow deleting another user\'s workout', async () => {
      // Create another user and workout
      const anotherUser = await User.create({
        username: 'user3',
        email: 'user3@example.com',
        password: 'password123'
      });

      const anotherWorkout = await Workout.create({
        name: 'User 3 Workout',
        type: 'flexibility',
        date: new Date(),
        userId: anotherUser.id
      });

      const res = await request(app)
        .delete(`/api/workouts/${anotherWorkout.id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Workout not found');
    });
  });

  describe('Date filtering', () => {
    it('should filter workouts by date range', async () => {
      // Create workouts with different dates
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-15');
      const date3 = new Date('2024-02-01');

      await Workout.create({
        name: 'Jan 1 Workout',
        type: 'strength',
        date: date1,
        userId: testUser.id
      });

      await Workout.create({
        name: 'Jan 15 Workout',
        type: 'strength',
        date: date2,
        userId: testUser.id
      });

      await Workout.create({
        name: 'Feb 1 Workout',
        type: 'strength',
        date: date3,
        userId: testUser.id
      });

      const res = await request(app)
        .get('/api/workouts?startDate=2024-01-01&endDate=2024-01-31')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.workouts.length).toEqual(2);
      expect(res.body.workouts.some(w => w.name === 'Jan 1 Workout')).toBe(true);
      expect(res.body.workouts.some(w => w.name === 'Jan 15 Workout')).toBe(true);
      expect(res.body.workouts.some(w => w.name === 'Feb 1 Workout')).toBe(false);
    });
  });
});