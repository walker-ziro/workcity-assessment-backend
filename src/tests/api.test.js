const request = require('supertest');

// Mock the database connection for testing
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(true),
  connection: {
    dropDatabase: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true),
    collections: {}
  },
  Schema: function(definition) {
    this.definition = definition;
    this.pre = jest.fn();
    this.methods = {};
    return this;
  },
  model: jest.fn().mockReturnValue({
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
  }),
  Types: {
    ObjectId: function() {}
  }
}));

// Add Schema.Types to the mock
jest.mock('mongoose', () => {
  const mockSchema = function(definition) {
    this.definition = definition;
    this.pre = jest.fn();
    this.methods = {};
    this.index = jest.fn();
    return this;
  };
  
  mockSchema.Types = {
    ObjectId: function() {}
  };
  
  return {
    connect: jest.fn().mockResolvedValue(true),
    connection: {
      dropDatabase: jest.fn().mockResolvedValue(true),
      close: jest.fn().mockResolvedValue(true),
      collections: {}
    },
    Schema: mockSchema,
    model: jest.fn().mockReturnValue({
      find: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn()
    }),
    Types: {
      ObjectId: function() {}
    }
  };
});

// Import app after mocking mongoose
const app = require('../../server');

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
