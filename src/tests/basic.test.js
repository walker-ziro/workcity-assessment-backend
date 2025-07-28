const mongoose = require('mongoose');
const { connectDB, closeDB, clearDB } = require('./utils/database');

describe('Database Connection Test', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  test('should connect to database', () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  test('should clear database', async () => {
    await clearDB();
    expect(mongoose.connection.readyState).toBe(1);
  });
});
