const User = require('../../models/User');
const Client = require('../../models/Client');
const jwt = require('jsonwebtoken');

const createTestUser = async (userData = {}) => {
  const defaultUserData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'TestPass123',
    role: 'user'
  };

  const user = new User({ ...defaultUserData, ...userData });
  await user.save();
  return user;
};

const createTestAdmin = async (adminData = {}) => {
  const defaultAdminData = {
    username: 'testadmin',
    email: 'admin@example.com',
    password: 'AdminPass123',
    role: 'admin'
  };

  const admin = new User({ ...defaultAdminData, ...adminData });
  await admin.save();
  return admin;
};

const createTestClient = async (createdBy, clientData = {}) => {
  const defaultClientData = {
    name: 'Test Client',
    email: 'client@example.com',
    phone: '+1234567890',
    company: 'Test Company',
    industry: 'Technology'
  };

  const client = new Client({
    ...defaultClientData,
    ...clientData,
    createdBy
  });
  
  await client.save();
  return client;
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '24h'
  });
};

const getAuthHeaders = (token) => {
  return {
    Authorization: `Bearer ${token}`
  };
};

module.exports = {
  createTestUser,
  createTestAdmin,
  createTestClient,
  generateToken,
  getAuthHeaders
};
