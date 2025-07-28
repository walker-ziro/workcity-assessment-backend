const request = require('supertest');
const app = require('./test-server');

describe('Test Server Functionality', () => {
  test('should respond to health check', async () => {
    const response = await request(app)
      .get('/api/health');
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.message).toBe('Server is running successfully!');
  });

  test('should validate required fields', async () => {
    const response = await request(app)
      .post('/api/test-validation')
      .send({});
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation Error');
    expect(response.body.errors).toContain('Name is required');
    expect(response.body.errors).toContain('Email is required');
  });

  test('should validate email format', async () => {
    const response = await request(app)
      .post('/api/test-validation')
      .send({
        name: 'Test User',
        email: 'invalid-email'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation Error');
    expect(response.body.errors).toContain('Please provide a valid email address');
  });

  test('should accept valid data', async () => {
    const response = await request(app)
      .post('/api/test-validation')
      .send({
        name: 'Test User',
        email: 'test@example.com'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Validation passed!');
    expect(response.body.data.name).toBe('Test User');
    expect(response.body.data.email).toBe('test@example.com');
  });

  test('should return 404 for non-existent routes', async () => {
    const response = await request(app)
      .get('/api/non-existent');
    
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Route not found');
  });
});
