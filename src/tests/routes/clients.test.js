const request = require('supertest');
const app = require('../../../server');
const { createTestUser, createTestAdmin, generateToken, getAuthHeaders } = require('../utils/helpers');

describe('POST /api/clients - Create Client', () => {
  let user, admin, userToken, adminToken;

  beforeEach(async () => {
    user = await createTestUser();
    admin = await createTestAdmin();
    userToken = generateToken(user._id);
    adminToken = generateToken(admin._id);
  });

  describe('Authentication Tests', () => {
    test('should reject request without token', async () => {
      const clientData = {
        name: 'Test Client',
        email: 'client@example.com'
      };

      const response = await request(app)
        .post('/api/clients')
        .send(clientData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Access denied. No token provided.');
    });

    test('should reject request with invalid token', async () => {
      const clientData = {
        name: 'Test Client',
        email: 'client@example.com'
      };

      const response = await request(app)
        .post('/api/clients')
        .set('Authorization', 'Bearer invalid-token')
        .send(clientData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid token.');
    });
  });

  describe('Validation Tests', () => {
    test('should reject request with missing required fields', async () => {
      const response = await request(app)
        .post('/api/clients')
        .set(getAuthHeaders(userToken))
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation Error');
      expect(response.body.errors).toContain('Name is required');
      expect(response.body.errors).toContain('Email is required');
    });

    test('should reject request with invalid email format', async () => {
      const clientData = {
        name: 'Test Client',
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/clients')
        .set(getAuthHeaders(userToken))
        .send(clientData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation Error');
      expect(response.body.errors).toContain('Please provide a valid email address');
    });

    test('should reject request with name exceeding maximum length', async () => {
      const clientData = {
        name: 'a'.repeat(101), // exceeds 100 character limit
        email: 'client@example.com'
      };

      const response = await request(app)
        .post('/api/clients')
        .set(getAuthHeaders(userToken))
        .send(clientData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation Error');
      expect(response.body.errors).toContain('Name must not exceed 100 characters');
    });

    test('should reject request with invalid phone number format', async () => {
      const clientData = {
        name: 'Test Client',
        email: 'client@example.com',
        phone: 'invalid-phone'
      };

      const response = await request(app)
        .post('/api/clients')
        .set(getAuthHeaders(userToken))
        .send(clientData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation Error');
      expect(response.body.errors).toContain('Please provide a valid phone number');
    });
  });

  describe('Success Cases', () => {
    test('should create client with minimum required data as regular user', async () => {
      const clientData = {
        name: 'Test Client',
        email: 'client@example.com'
      };

      const response = await request(app)
        .post('/api/clients')
        .set(getAuthHeaders(userToken))
        .send(clientData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Client created successfully');
      expect(response.body.client).toMatchObject({
        name: clientData.name,
        email: clientData.email,
        isActive: true
      });
      expect(response.body.client.createdBy._id).toBe(user._id.toString());
    });

    test('should create client with all fields as admin user', async () => {
      const clientData = {
        name: 'Complete Test Client',
        email: 'complete@example.com',
        phone: '+1234567890',
        address: {
          street: '123 Main St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'Test Country'
        },
        company: 'Test Company Inc',
        industry: 'Technology'
      };

      const response = await request(app)
        .post('/api/clients')
        .set(getAuthHeaders(adminToken))
        .send(clientData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Client created successfully');
      expect(response.body.client).toMatchObject({
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        company: clientData.company,
        industry: clientData.industry,
        isActive: true
      });
      expect(response.body.client.createdBy._id).toBe(admin._id.toString());
    });

    test('should trim whitespace from string fields', async () => {
      const clientData = {
        name: '  Test Client  ',
        email: '  CLIENT@EXAMPLE.COM  ',
        company: '  Test Company  '
      };

      const response = await request(app)
        .post('/api/clients')
        .set(getAuthHeaders(userToken))
        .send(clientData);

      expect(response.status).toBe(201);
      expect(response.body.client.name).toBe('Test Client');
      expect(response.body.client.email).toBe('client@example.com');
      expect(response.body.client.company).toBe('Test Company');
    });

    test('should set default values for optional fields', async () => {
      const clientData = {
        name: 'Test Client',
        email: 'client@example.com'
      };

      const response = await request(app)
        .post('/api/clients')
        .set(getAuthHeaders(userToken))
        .send(clientData);

      expect(response.status).toBe(201);
      expect(response.body.client.isActive).toBe(true);
      expect(response.body.client.createdAt).toBeDefined();
      expect(response.body.client.updatedAt).toBeDefined();
    });

    test('should include createdBy user information in response', async () => {
      const clientData = {
        name: 'Test Client',
        email: 'client@example.com'
      };

      const response = await request(app)
        .post('/api/clients')
        .set(getAuthHeaders(userToken))
        .send(clientData);

      expect(response.status).toBe(201);
      expect(response.body.client.createdBy).toMatchObject({
        _id: user._id.toString(),
        username: user.username,
        email: user.email
      });
      expect(response.body.client.createdBy.password).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    test('should handle duplicate email addresses gracefully', async () => {
      const clientData = {
        name: 'Test Client',
        email: 'duplicate@example.com'
      };

      // Create first client
      await request(app)
        .post('/api/clients')
        .set(getAuthHeaders(userToken))
        .send(clientData);

      // Try to create second client with same email
      const response = await request(app)
        .post('/api/clients')
        .set(getAuthHeaders(userToken))
        .send({
          name: 'Another Test Client',
          email: 'duplicate@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('email already exists');
    });

    test('should allow different users to create clients with same name', async () => {
      const clientData = {
        name: 'Same Name Client',
        email: 'user1@example.com'
      };

      // First user creates client
      await request(app)
        .post('/api/clients')
        .set(getAuthHeaders(userToken))
        .send(clientData);

      // Admin creates client with same name but different email
      const response = await request(app)
        .post('/api/clients')
        .set(getAuthHeaders(adminToken))
        .send({
          name: 'Same Name Client',
          email: 'admin@example.com'
        });

      expect(response.status).toBe(201);
      expect(response.body.client.name).toBe('Same Name Client');
    });

    test('should strip unknown fields from request', async () => {
      const clientData = {
        name: 'Test Client',
        email: 'client@example.com',
        unknownField: 'should be ignored',
        hackerField: 'malicious data'
      };

      const response = await request(app)
        .post('/api/clients')
        .set(getAuthHeaders(userToken))
        .send(clientData);

      expect(response.status).toBe(201);
      expect(response.body.client.unknownField).toBeUndefined();
      expect(response.body.client.hackerField).toBeUndefined();
    });
  });
});
