// Test setup file
process.env.NODE_ENV = 'test';
process.env.REDIS_URL = 'redis://localhost:6379';

// Increase timeout for tests
jest.setTimeout(10000);

// Global test cleanup
afterAll(async () => {
  // Give time for any pending operations to complete
  await new Promise(resolve => setTimeout(resolve, 1000));
}); 