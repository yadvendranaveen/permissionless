const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const AnalyticsEngine = require('./analytics/analyticsEngine');
const SupraAutomation = require('./automation/supraAutomation');
const TradingAPI = require('./api/tradingAPI');
const WebSocketManager = require('./websocket/websocketManager');

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger setup
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'AutoTrading Analytics Bot API',
    version: '1.0.0',
    description: 'API documentation for the AI-powered trading analytics microservice',
  },
  servers: [
    { url: 'http://localhost:3001' }
  ],
};
const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/api/tradingAPI.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

// Initialize core services
const analyticsEngine = new AnalyticsEngine();
const supraAutomation = new SupraAutomation(analyticsEngine);
const wsManager = new WebSocketManager();

// API Routes
app.use('/api', TradingAPI(analyticsEngine));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    services: {
      analytics: analyticsEngine.isRunning(),
      automation: supraAutomation.isRunning(),
      websocket: wsManager.isRunning()
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'AutoTrading Analytics Bot',
    description: 'AI-powered trading analytics with Supra automation',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      websocket: '/ws'
    }
  });
});

// Only start the server if this is the main module (not when imported for testing)
if (require.main === module) {
  // Start server
  const server = app.listen(PORT, () => {
    console.log(`🚀 AutoTrading Analytics Bot running on port ${PORT}`);
    console.log(`📊 Analytics Engine: ${analyticsEngine.isRunning() ? '✅ Running' : '❌ Stopped'}`);
    console.log(`⚡ Supra Automation: ${supraAutomation.isRunning() ? '✅ Running' : '❌ Stopped'}`);
  });

  // WebSocket server
  const wss = new WebSocket.Server({ server });
  wsManager.initialize(wss, analyticsEngine);

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 Shutting down gracefully...');
    server.close(() => {
      analyticsEngine.shutdown();
      supraAutomation.shutdown();
      wsManager.shutdown();
      process.exit(0);
    });
  });
}

module.exports = app; 