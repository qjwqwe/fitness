const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const User = require('../models/User');
const HealthRecord = require('../models/HealthRecord');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

describe('Health Record API Tests', () => {
  let testUser;
  let token;
  let testHealthRecordId;

  beforeAll(async () => {
    // Sync database before tests
    await sequelize.sync({ force: true });
    
    // Create a test user
    testUser = await User.create({
      username: 'healthtestuser',
      email: 'healthtest@example.com',
      password: 'password123'
    });
    
    // Generate JWT token
    token = jwt.sign({ userId: testUser.id }, JWT_SECRET);
  });

  afterAll(async () => {
    // Close database connection after tests
    await sequelize.close();
  });

  // Test 1: Create a health record with weight only
  test('1. Create health record with only weight', async () => {
    const response = await request(app)
      .post('/api/health')
      .set('Authorization', `Bearer ${token}`)
      .send({
        weight: 75.5,
        date: '2026-04-17'
      });
    
    expect(response.statusCode).toBe(201);
    expect(response.body.weight).toBe(75.5);
    expect(response.body.userId).toBe(testUser.id);
    expect(response.body.id).toBeDefined();
    
    testHealthRecordId = response.body.id;
  });

  // Test 2: Create a health record with multiple metrics
  test('2. Create health record with multiple metrics', async () => {
    const response = await request(app)
      .post('/api/health')
      .set('Authorization', `Bearer ${token}`)
      .send({
        weight: 75.0,
        bodyFatPercentage: 15.5,
        waistCircumference: 84.0,
        chestCircumference: 100.0,
        armCircumference: 32.0,
        notes: 'Feeling good today',
        date: '2026-04-16'
      });
    
    expect(response.statusCode).toBe(201);
    expect(response.body.weight).toBe(75.0);
    expect(response.body.bodyFatPercentage).toBe(15.5);
    expect(response.body.waistCircumference).toBe(84.0);
    expect(response.body.chestCircumference).toBe(100.0);
    expect(response.body.armCircumference).toBe(32.0);
    expect(response.body.notes).toBe('Feeling good today');
  });

  // Test 3: Reject health record with no metrics
  test('3. Reject health record with no metrics', async () => {
    const response = await request(app)
      .post('/api/health')
      .set('Authorization', `Bearer ${token}`)
      .send({
        notes: 'No metrics here',
        date: '2026-04-15'
      });
    
    expect(response.statusCode).toBe(400); // Bad request
    expect(response.body.message).toContain('At least one health metric');
  });

  // Test 4: Get all health records for authenticated user
  test('4. Get all health records with pagination', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.healthRecords).toHaveLength(2);
    expect(response.body.pagination.total).toBe(2);
    // Should be sorted by date descending
    expect(response.body.healthRecords[0].date.split('T')[0]).toBe('2026-04-17');
  });

  // Test 5: Get health records with date range filtering
  test('5. Get health records with date range filtering', async () => {
    const response = await request(app)
      .get('/api/health?startDate=2026-04-16&endDate=2026-04-16')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.healthRecords).toHaveLength(1);
    expect(response.body.healthRecords[0].date.split('T')[0]).toBe('2026-04-16');
  });

  // Test 6: Get latest health record
  test('6. Get latest health record', async () => {
    const response = await request(app)
      .get('/api/health/latest')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.date.split('T')[0]).toBe('2026-04-17');
    expect(response.body.weight).toBe(75.5);
  });

  // Test 7: Get latest N health records with limit parameter
  test('7. Get latest 2 health records', async () => {
    const response = await request(app)
      .get('/api/health/latest?limit=2')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(2);
  });

  // Test 8: Get specific health record by ID
  test('8. Get specific health record by ID', async () => {
    const response = await request(app)
      .get(`/api/health/${testHealthRecordId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(testHealthRecordId);
    expect(response.body.weight).toBe(75.5);
  });

  // Test 9: Return 404 for non-existent health record
  test('9. Return 404 for non-existent health record', async () => {
    const response = await request(app)
      .get('/api/health/999')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Health record not found');
  });

  // Test 10: Update existing health record
  test('10. Update health record', async () => {
    const response = await request(app)
      .put(`/api/health/${testHealthRecordId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        weight: 74.8,
        bodyFatPercentage: 16.0,
        notes: 'Updated weight after morning weigh-in'
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.weight).toBe(74.8);
    expect(response.body.bodyFatPercentage).toBe(16.0);
    expect(response.body.notes).toBe('Updated weight after morning weigh-in');
    // Date should remain unchanged
    expect(response.body.date.split('T')[0]).toBe('2026-04-17');
  });

  // Test 11: Prevent access to health records from other users
  test('11. Prevent access to health records from other users', async () => {
    // Create another user
    const otherUser = await User.create({
      username: 'otheruser',
      email: 'other@example.com',
      password: 'password123'
    });
    
    // Create health record for other user
    const otherRecord = await HealthRecord.create({
      userId: otherUser.id,
      weight: 80.0,
      date: '2026-04-17'
    });
    
    // Try to access it with original user's token
    const response = await request(app)
      .get(`/api/health/${otherRecord.id}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Health record not found');
  });

  // Test 12: Reject authentication without token
  test('12. Reject request without authentication token', async () => {
    const response = await request(app)
      .get('/api/health');
    
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('No token, authorization denied');
  });

  // Test 13: Reject authentication with invalid token
  test('13. Reject request with invalid token', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Authorization', 'Bearer invalid_token');
    
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Token is not valid');
  });

  // Test 14: Delete health record
  test('14. Delete health record', async () => {
    const response = await request(app)
      .delete(`/api/health/${testHealthRecordId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Health record deleted');
    
    // Verify it's actually deleted
    const deletedRecord = await HealthRecord.findByPk(testHealthRecordId);
    expect(deletedRecord).toBeNull();
  });

  // Test 15: Return 404 when deleting non-existent health record
  test('15. Return 404 when deleting non-existent health record', async () => {
    const response = await request(app)
      .delete('/api/health/999')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Health record not found');
  });

  // Test 16: Validate body fat percentage is between 0-100
  test('16. Validate body fat percentage between 0-100', async () => {
    const response = await request(app)
      .post('/api/health')
      .set('Authorization', `Bearer ${token}`)
      .send({
        weight: 75.0,
        bodyFatPercentage: 150, // Invalid - over 100
        date: '2026-04-14'
      });
    
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toContain('Validation error');
  });
});
