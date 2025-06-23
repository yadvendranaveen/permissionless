const request = require('supertest');
const app = require('../src/index');
const AnalyticsEngine = require('../src/analytics/analyticsEngine');

let analyticsEngine;

describe('AutoTrading Analytics API', () => {
  beforeAll(async () => {
    // Get the analytics engine instance from the app (or create a new one)
    analyticsEngine = app.locals?.analyticsEngine || new AnalyticsEngine();
    // Wait for initialization
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Manually trigger analysis to ensure data is available
    await analyticsEngine.performAnalysis();
    // Wait for analysis to complete
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.services).toBeDefined();
    });
  });

  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('AutoTrading Analytics Bot');
      expect(response.body.endpoints).toBeDefined();
    });
  });

  describe('GET /api/status', () => {
    it('should return API status', async () => {
      const response = await request(app).get('/api/status');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.service).toBe('AutoTrading Analytics API');
    });
  });

  describe('GET /api/tokens', () => {
    it('should return active tokens', async () => {
      const response = await request(app).get('/api/tokens');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/signals', () => {
    it('should return all trading signals', async () => {
      const response = await request(app).get('/api/signals');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/market/overview', () => {
    it('should return market overview', async () => {
      const response = await request(app).get('/api/market/overview');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.totalTokens).toBeDefined();
      expect(response.body.data.totalTokens).toBeGreaterThan(0);
    });
  });

  describe('GET /api/analysis/:tokenAddress', () => {
    it('should return analysis for valid token', async () => {
      const tokenAddress = '0x1234567890abcdef';
      const response = await request(app).get(`/api/analysis/${tokenAddress}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.tokenAddress).toBe(tokenAddress);
    });

    it('should return 404 for invalid token', async () => {
      const tokenAddress = '0xinvalid';
      const response = await request(app).get(`/api/analysis/${tokenAddress}`);
      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/risk/:tokenAddress', () => {
    it('should return risk analysis for valid token', async () => {
      const tokenAddress = '0x1234567890abcdef';
      const response = await request(app).get(`/api/risk/${tokenAddress}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.riskScore).toBeDefined();
    });
  });

  describe('GET /api/market/top-performers', () => {
    it('should return top performers by volume', async () => {
      const response = await request(app).get('/api/market/top-performers?metric=volume24h&limit=5');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
}); 