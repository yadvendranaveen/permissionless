# AutoTrading Analytics Bot

🤖 **AI-powered trading analytics microservice with Supra automation for memecoin analysis**

A real-time trading analytics platform that combines Supra's block-by-block automation with AI-powered trading signals for memecoin analysis. **Now with real on-chain data integration!** Built for the Permissionless IV Hackathon.

## 🏆 Bounty Alignment

### Supra Bounty: "AI Agents + Supra: Smarter Contracts"
- ✅ **AI-powered trading signals** using multi-factor analysis
- ✅ **Block-by-block automation** simulating Supra's automation framework
- ✅ **Real-time market monitoring** with automated alerts
- ✅ **AI agents** that make intelligent trading decisions
- ✅ **Real on-chain data** from Ethereum blockchain and Uniswap V3

### Trojan Trading Bounty: "Microservice for Memecoin Trading Analytics"
- ✅ **REST API** with comprehensive trading analytics endpoints
- ✅ **WebSocket streaming** for real-time data
- ✅ **Docker deployment** with production-ready configuration
- ✅ **Token-level metrics** including market cap, velocity, concentration ratios, and paperhand ratio
- ✅ **Live blockchain data** from real memecoin transactions

## 🚀 Features

### Core Analytics
- **Market Cap Tracking** - Real-time market capitalization calculations from on-chain data
- **Token Velocity** - Trades per hour analysis from blockchain events
- **Concentration Ratios** - Top holder distribution analysis from transfer events
- **Paperhand Ratio** - Short-term holder behavior tracking
- **Volatility Analysis** - Price stability metrics from Uniswap V3 pools
- **Technical Indicators** - RSI, MACD, SMA calculations from real price data

### AI-Powered Trading Signals
- **Multi-factor Analysis** - Combines technical, volume, and behavioral metrics
- **Confidence Scoring** - Weighted decision making with reasoning
- **Real-time Alerts** - High-confidence signal notifications
- **Risk Assessment** - Comprehensive risk scoring system

### Supra Automation Integration
- **Block-by-block Execution** - Continuous market monitoring
- **Automated Jobs** - Market monitoring, volatility alerts, concentration tracking
- **AI Signal Generation** - Automated trading signal creation
- **Real Sentiment Analysis** - Market mood tracking from multiple sources

### Real-time Streaming
- **WebSocket Support** - Live data streaming
- **Channel Subscriptions** - Market overview, trading signals, price alerts
- **Connection Management** - Robust client handling with ping/pong

### Real Blockchain Data Sources
- **Ethereum Mainnet** - Direct blockchain connection via Web3
- **Uniswap V3** - Real-time price feeds from liquidity pools
- **Transfer Events** - On-chain transaction monitoring
- **Holder Analysis** - Real wallet balance tracking
- **Market Sentiment** - Crypto Fear & Greed Index, CoinGecko, Reddit

## 📊 API Endpoints

### REST API
```
GET  /api/tokens                    # Get all active tokens with real prices
GET  /api/analysis/:tokenAddress    # Get latest analysis for token
GET  /api/signals/:tokenAddress     # Get trading signals for token
GET  /api/signals                   # Get all trading signals
GET  /api/market/overview           # Get market overview
GET  /api/market/top-performers     # Get top performing tokens
GET  /api/risk/:tokenAddress        # Get risk analysis for token
GET  /api/status                    # Get API status
```

### WebSocket Channels
```
market-overview     # Real-time market statistics
trading-signals     # Live trading signal updates
price-alerts        # High-confidence signal alerts
risk-alerts         # High-risk token notifications
```

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Redis (included in docker-compose)
- **Ethereum RPC URL** (Alchemy, Infura, or Ankr)

### Environment Setup
```bash
# Copy environment template
cp env.example .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables:**
```bash
# Blockchain Configuration
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Optional APIs for enhanced features
COINGECKO_API_KEY=your_coingecko_api_key
```

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd autotrading-analytics-bot

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your RPC URL

# Start Redis (if not using Docker)
redis-server

# Start the application
npm start
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f autotrading-analytics

# Stop services
docker-compose down
```

### Manual Docker Build
```bash
# Build the image
docker build -t autotrading-analytics .

# Run the container with environment variables
docker run -p 3000:3000 \
  -e ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY \
  --name autotrading-analytics autotrading-analytics
```

## 📈 Usage Examples

### Get Real Trading Signals
```bash
curl http://localhost:3000/api/signals/0x6982508145454Ce325dDbE47a25d4ec3d2311933
```

### Subscribe to WebSocket Updates
```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'subscribe',
    channels: ['trading-signals', 'price-alerts']
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received real-time data:', data);
};
```

### Market Overview with Real Data
```bash
curl http://localhost:3000/api/market/overview
```

## 🔧 Configuration

### Environment Variables
```bash
NODE_ENV=production          # Environment mode
PORT=3000                    # Server port
REDIS_URL=redis://localhost:6379  # Redis connection URL
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY  # Blockchain RPC
COINGECKO_API_KEY=your_api_key  # Optional: Enhanced sentiment analysis
```

### Supported Memecoins
The system currently tracks these real memecoins on Ethereum mainnet:
- **PEPE** (`0x6982508145454Ce325dDbE47a25d4ec3d2311933`)
- **SHIB** (`0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE`)
- **DAI** (`0x6B175474E89094C44Da98b954EedeAC495271d0F`) - For price reference

### Customization
- **Analysis Interval**: Modify `startAnalysis()` in `analyticsEngine.js`
- **Automation Jobs**: Add new jobs in `supraAutomation.js`
- **API Endpoints**: Extend `tradingAPI.js` with new routes
- **WebSocket Channels**: Add new channels in `websocketManager.js`
- **Token List**: Add new memecoins in `analyticsEngine.js`

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WebSocket     │    │   REST API      │    │   Analytics     │
│   Manager       │    │   Endpoints     │    │   Engine        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Supra         │
                    │   Automation    │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Redis Cache   │
                    └─────────────────┘
                                 │
         ┌─────────────────────────────────────────┐
         │           Real Data Sources             │
         ├─────────────────┬───────────────────────┤
         │   Ethereum      │   External APIs       │
         │   Mainnet       │                       │
         │   • Web3        │   • CoinGecko         │
         │   • Uniswap V3  │   • Fear & Greed      │
         │   • Transfer    │   • Reddit            │
         │     Events      │   • Social Sentiment  │
         └─────────────────┴───────────────────────┘
```

## 🧪 Testing

```bash
# Run tests
npm test

# Test API endpoints
curl http://localhost:3000/health
curl http://localhost:3000/api/status

# Test real data endpoints
curl http://localhost:3000/api/tokens
curl http://localhost:3000/api/signals
```

## 📊 Performance

- **Analysis Frequency**: Every 30 seconds
- **Automation Blocks**: Every 15 seconds
- **WebSocket Updates**: Every 10 seconds
- **Redis TTL**: 1 hour for analysis data
- **Cache TTL**: 5 minutes for blockchain data
- **Concurrent Clients**: Unlimited WebSocket connections
- **Real Data Sources**: Ethereum + Uniswap V3 + External APIs

## 🔒 Security

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Input Validation** - Request sanitization
- **Rate Limiting** - API protection (can be added)
- **Non-root Docker** - Container security
- **Environment Variables** - Secure configuration management

## 🚀 Deployment

### Production Deployment
```bash
# Set production environment
export NODE_ENV=production
export ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Start with PM2
npm install -g pm2
pm2 start src/index.js --name autotrading-analytics

# Or with Docker
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY \
  autotrading-analytics
```

### Monitoring
```bash
# Check application health
curl http://localhost:3000/health

# Monitor logs
pm2 logs autotrading-analytics

# Check blockchain connection
curl http://localhost:3000/api/status
```

## 🔄 Data Flow

### Real Data Pipeline:
1. **Blockchain Events** → Web3 → Transfer Events
2. **Uniswap V3** → Pool Data → Real-time Prices
3. **External APIs** → Market Sentiment → Social Signals
4. **Analytics Engine** → Technical Indicators → Trading Signals
5. **Supra Automation** → Block-by-block Processing → AI Decisions
6. **WebSocket** → Real-time Broadcasting → Client Updates

### Fallback Strategy:
- **Primary**: Real blockchain data
- **Secondary**: Cached data (5-minute TTL)
- **Tertiary**: Mock data (for testing/development)

## 🎯 Real Data Benefits

✅ **Live Market Prices** - Real-time from Uniswap V3 pools  
✅ **Actual Trading Volume** - From blockchain transfer events  
✅ **Real Holder Distribution** - Based on actual wallet balances  
✅ **Market Sentiment** - From Fear & Greed Index and social media  
✅ **Technical Indicators** - Calculated from real price data  
✅ **Risk Assessment** - Based on actual market conditions  

*Combining the power of Supra automation with real blockchain data for the future of memecoin trading analytics.*