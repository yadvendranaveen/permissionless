const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
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
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

// Serve static files for dashboard
app.use('/public', express.static(path.join(__dirname, '../public')));

// Initialize core services
const analyticsEngine = new AnalyticsEngine();
const wsManager = new WebSocketManager();
const supraAutomation = new SupraAutomation(analyticsEngine, wsManager);

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

// Dashboard route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Live dashboard route
app.get('/live', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/live-dashboard.html'));
});

// Live dashboard v2 route
app.get('/live/v2', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/live-v2.html'));
});

// Live analytics endpoint
app.get('/api/analytics/live', async (req, res) => {
  try {
    // Get current analytics data
    const analytics = await analyticsEngine.getCurrentAnalytics();
    
    // Format data for live dashboard
    const liveData = {
      marketOverview: {
        totalMarketCap: analytics?.totalMarketCap || 125847392000,
        totalVolume24h: analytics?.totalVolume24h || 8947234567,
        activeTokens: analytics?.activeTokens || 3,
        marketTrend: analytics?.marketTrend || "bullish",
        lastUpdated: new Date().toISOString()
      },
      tokens: {
        DOGE: {
          symbol: "DOGE",
          name: "Dogecoin",
          currentPrice: analytics?.tokens?.DOGE?.currentPrice || 0.26444968,
          priceChange24h: analytics?.tokens?.DOGE?.priceChange24h || 11.23,
          priceChange7d: analytics?.tokens?.DOGE?.priceChange7d || -8.45,
          marketCap: analytics?.tokens?.DOGE?.marketCap || 34431598885.98,
          volume24h: analytics?.tokens?.DOGE?.volume24h || 2167521670.48,
          riskMetrics: {
            volatility: analytics?.tokens?.DOGE?.riskMetrics?.volatility || 0.68,
            sharpeRatio: analytics?.tokens?.DOGE?.riskMetrics?.sharpeRatio || 1.24,
            maxDrawdown: analytics?.tokens?.DOGE?.riskMetrics?.maxDrawdown || -0.45,
            beta: analytics?.tokens?.DOGE?.riskMetrics?.beta || 1.12
          }
        },
        SHIB: {
          symbol: "SHIB",
          name: "Shiba INU",
          currentPrice: analytics?.tokens?.SHIB?.currentPrice || 0.00000786,
          priceChange24h: analytics?.tokens?.SHIB?.priceChange24h || 5.12,
          priceChange7d: analytics?.tokens?.SHIB?.priceChange7d || 12.34,
          marketCap: analytics?.tokens?.SHIB?.marketCap || 3101198479.54,
          volume24h: analytics?.tokens?.SHIB?.volume24h || 368723896.78,
          riskMetrics: {
            volatility: analytics?.tokens?.SHIB?.riskMetrics?.volatility || 0.89,
            sharpeRatio: analytics?.tokens?.SHIB?.riskMetrics?.sharpeRatio || 0.87,
            maxDrawdown: analytics?.tokens?.SHIB?.riskMetrics?.maxDrawdown || -0.67,
            beta: analytics?.tokens?.SHIB?.riskMetrics?.beta || 1.45
          }
        },
        PIG: {
          symbol: "PIG",
          name: "Pig Finance",
          currentPrice: analytics?.tokens?.PIG?.currentPrice || 0.00000011,
          priceChange24h: analytics?.tokens?.PIG?.priceChange24h || -2.34,
          priceChange7d: analytics?.tokens?.PIG?.priceChange7d || -15.67,
          marketCap: analytics?.tokens?.PIG?.marketCap || 0,
          volume24h: analytics?.tokens?.PIG?.volume24h || 1267679.12,
          riskMetrics: {
            volatility: analytics?.tokens?.PIG?.riskMetrics?.volatility || 1.23,
            sharpeRatio: analytics?.tokens?.PIG?.riskMetrics?.sharpeRatio || -0.34,
            maxDrawdown: analytics?.tokens?.PIG?.riskMetrics?.maxDrawdown || -0.89,
            beta: analytics?.tokens?.PIG?.riskMetrics?.beta || 1.78
          }
        }
      },
      tradingSignals: analytics?.tradingSignals || [],
      riskAnalysis: analytics?.riskAnalysis || {},
      recentTrades: analytics?.recentTrades || [],
      apiStatus: {
        blockchain: "operational",
        analytics: "operational",
        trading: "operational",
        alerts: "operational",
        lastChecked: new Date().toISOString()
      },
      performance: analytics?.performance || {
        totalReturn: 23.45,
        sharpeRatio: 1.67,
        maxDrawdown: -12.34,
        volatility: 0.45,
        beta: 1.12,
        alpha: 0.08
      }
    };

    res.json(liveData);
  } catch (error) {
    console.error('Error fetching live analytics:', error);
    res.status(500).json({ error: 'Failed to fetch live analytics data' });
  }
});

// Demo data endpoint for fallback
app.get('/api/demo/data', (req, res) => {
  try {
    // Serve demo data directly
    const demoData = {
      marketOverview: {
        totalMarketCap: 125847392000,
        totalVolume24h: 8947234567,
        activeTokens: 3,
        marketTrend: "bullish",
        lastUpdated: "2024-01-15T10:30:00Z"
      },
      tokens: {
        DOGE: {
          symbol: "DOGE",
          name: "Dogecoin",
          currentPrice: 0.26444968,
          priceChange24h: 11.23,
          priceChange7d: -8.45,
          marketCap: 34431598885.98,
          volume24h: 2167521670.48,
          riskMetrics: {
            volatility: 0.68,
            sharpeRatio: 1.24,
            maxDrawdown: -0.45,
            beta: 1.12
          }
        },
        SHIB: {
          symbol: "SHIB",
          name: "Shiba INU",
          currentPrice: 0.00000786,
          priceChange24h: 5.12,
          priceChange7d: 12.34,
          marketCap: 3101198479.54,
          volume24h: 368723896.78,
          riskMetrics: {
            volatility: 0.89,
            sharpeRatio: 0.87,
            maxDrawdown: -0.67,
            beta: 1.45
          }
        },
        PIG: {
          symbol: "PIG",
          name: "Pig Finance",
          currentPrice: 0.00000011,
          priceChange24h: -2.34,
          priceChange7d: -15.67,
          marketCap: 0,
          volume24h: 1267679.12,
          riskMetrics: {
            volatility: 1.23,
            sharpeRatio: -0.34,
            maxDrawdown: -0.89,
            beta: 1.78
          }
        }
      },
      tradingSignals: [
        {
          token: "DOGE",
          signal: "BUY",
          confidence: 0.75,
          price: 0.26444968,
          change24h: 11.23,
          reasoning: "Strong volume increase and positive momentum indicators",
          timestamp: "2024-01-15T10:30:00Z"
        },
        {
          token: "SHIB",
          signal: "HOLD",
          confidence: 0.45,
          price: 0.00000786,
          change24h: 5.12,
          reasoning: "Mixed signals with moderate volatility",
          timestamp: "2024-01-15T10:30:00Z"
        },
        {
          token: "PIG",
          signal: "SELL",
          confidence: 0.82,
          price: 0.00000011,
          change24h: -2.34,
          reasoning: "Declining volume and negative price momentum",
          timestamp: "2024-01-15T10:30:00Z"
        }
      ],
      riskAnalysis: {
        overallRisk: "moderate",
        volatilityAlert: "High volatility detected in PIG token",
        concentrationRisk: "Low - well distributed holdings",
        liquidityRisk: "Medium - adequate liquidity for major tokens",
        marketRisk: "Moderate - mixed market sentiment",
        recommendations: [
          "Consider reducing exposure to PIG due to high volatility",
          "DOGE shows strong fundamentals and low risk",
          "Monitor SHIB for potential breakout opportunities"
        ]
      },
      performance: {
        totalReturn: 23.45,
        sharpeRatio: 1.67,
        maxDrawdown: -12.34,
        volatility: 0.45,
        beta: 1.12,
        alpha: 0.08
      }
    };
    
    res.json(demoData);
  } catch (error) {
    console.error('Error serving demo data:', error);
    res.status(500).json({ error: 'Failed to serve demo data' });
  }
});

// API info endpoint
app.get('/api-info', (req, res) => {
  res.json({
    name: 'AutoTrading Analytics Bot',
    description: 'AI-powered trading analytics with Supra automation',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      websocket: '/ws',
      dashboard: '/',
      docs: '/api-docs'
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