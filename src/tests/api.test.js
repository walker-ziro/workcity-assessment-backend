const request = require('supertest');

// Mock the database connection for testing
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(true),
  connection: {
    dropDatabase: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true),
    collections: {}
  }
}));

// Import app after mocking mongoose
const app = require('../../../server');

describe('API Basic Tests', () => {
  test('should respond to health check', async () => {
    const response = await request(app)
      .get('/api/health');
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  test('should return 404 for non-existent routes', async () => {
    const response = await request(app)
      .get('/api/non-existent-route');
    
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Route not found');
  });
});
