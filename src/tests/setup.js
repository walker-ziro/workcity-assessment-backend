const { connectDB, closeDB, clearDB } = require('./utils/database');

// Set test environment variables first
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing';
process.env.JWT_EXPIRES_IN = '24h';

// Setup before all tests
beforeAll(async () => {
  await connectDB();
}, 30000); // 30 second timeout

// Clean up after each test
afterEach(async () => {
  await clearDB();
});

// Close database connection after all tests
afterAll(async () => {
  await closeDB();
}, 30000); // 30 second timeout
