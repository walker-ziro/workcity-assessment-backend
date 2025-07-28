// Simple validation test without database
const Joi = require('joi');
const { clientSchema } = require('../../src/validation/schemas');

describe('Client Validation Tests', () => {
  test('should validate client data correctly', () => {
    const validClient = {
      name: 'Test Client',
      email: 'test@example.com',
      phone: '+1234567890',
      company: 'Test Company'
    };

    const { error, value } = clientSchema.validate(validClient);
    
    expect(error).toBeUndefined();
    expect(value.name).toBe('Test Client');
    expect(value.email).toBe('test@example.com');
  });

  test('should reject invalid email', () => {
    const invalidClient = {
      name: 'Test Client',
      email: 'invalid-email'
    };

    const { error } = clientSchema.validate(invalidClient);
    
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('valid email');
  });

  test('should reject missing required fields', () => {
    const invalidClient = {};

    const { error } = clientSchema.validate(invalidClient);
    
    expect(error).toBeDefined();
    expect(error.details.length).toBeGreaterThan(0);
  });

  test('should reject name that is too long', () => {
    const invalidClient = {
      name: 'a'.repeat(101), // exceeds 100 character limit
      email: 'test@example.com'
    };

    const { error } = clientSchema.validate(invalidClient);
    
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('100 characters');
  });

  test('should validate phone number format', () => {
    const invalidClient = {
      name: 'Test Client',
      email: 'test@example.com',
      phone: 'invalid-phone'
    };

    const { error } = clientSchema.validate(invalidClient);
    
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('valid phone number');
  });
});
