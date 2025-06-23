# 🚀 AI-Powered Memecoin Analytics Dashboard

## Overview

This is a **real-time, interactive dashboard** for the AI-powered memecoin analytics microservice built for the Permissionless Hackathon. The dashboard provides a beautiful, modern interface to visualize blockchain data, trading signals, and market analytics for popular memecoins (PEPE, SHIB, DAI).

## 🎯 Features for Hackathon Presentation

### 1. **Real-Time Blockchain Data**
- Live price feeds from Uniswap V3
- Real-time market cap calculations
- On-chain transaction analysis
- Holder concentration metrics

### 2. **AI-Powered Trading Signals**
- Machine learning-based buy/sell/hold recommendations
- Confidence scoring for each signal
- Detailed reasoning for trading decisions
- Risk assessment and volatility analysis

### 3. **Interactive Analytics**
- On-demand analysis triggers
- Individual token analysis
- Market overview with aggregate metrics
- Real-time data refresh

### 4. **Professional UI/UX**
- Modern, responsive design
- Glassmorphism effects
- Real-time status indicators
- Mobile-friendly interface

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js for data visualization
- **Icons**: Font Awesome 6
- **Backend**: Node.js, Express.js
- **Blockchain**: Web3.js, Ethers.js
- **Data**: Alchemy API, Uniswap V3
- **Storage**: Redis (optional), in-memory fallback

## 🚀 Quick Start

### 1. Start the Application
```bash
npm start
```

### 2. Access the Dashboard
Open your browser and navigate to:
```
http://localhost:3000
```

### 3. API Documentation
Access the Swagger API docs at:
```
http://localhost:3000/api-docs
```

## 📊 Dashboard Sections

### **Analytics Controls**
- **Analyze All Tokens**: Run comprehensive analysis on all supported tokens
- **Market Overview**: Get aggregate market statistics
- **Trading Signals**: View AI-generated trading recommendations
- **Refresh Data**: Update all data in real-time

### **Market Overview**
- Total market capitalization
- Average volatility across all tokens
- Bullish vs bearish token distribution
- Real-time market sentiment

### **Token Analytics**
- Individual token cards with live data
- Price, market cap, and supply information
- Trading signal indicators (BUY/SELL/HOLD)
- Individual token analysis buttons

### **AI Trading Signals**
- Detailed trading recommendations
- Confidence scores and reasoning
- Risk metrics and volatility analysis
- Historical signal performance

### **Risk Analysis**
- Token-specific risk assessments
- Concentration ratio analysis
- Volatility risk scoring
- Market manipulation detection

### **API Status**
- Real-time service health monitoring
- Uptime tracking
- Active token count
- Last analysis timestamp

## 🎨 Design Features

### **Modern UI Elements**
- Gradient backgrounds and glassmorphism effects
- Smooth animations and hover effects
- Responsive grid layout
- Professional color scheme

### **Interactive Components**
- Real-time data updates
- Loading states and progress indicators
- Success/error message handling
- Auto-refresh functionality

### **Mobile Responsive**
- Optimized for all screen sizes
- Touch-friendly interface
- Adaptive layout for mobile devices

## 🔧 API Integration

The dashboard integrates with the following API endpoints:

- `GET /api/tokens` - Get all active tokens
- `GET /api/market/overview` - Get market overview
- `GET /api/signals/:tokenAddress` - Get trading signals
- `POST /api/analyze` - Run analysis on all tokens
- `POST /api/analyze/:tokenAddress` - Run analysis on specific token
- `GET /api/status` - Get API status

## 📈 Presentation Tips

### **Demo Flow**
1. **Introduction**: Show the dashboard loading with live data
2. **Market Overview**: Highlight the real-time market statistics
3. **Token Analysis**: Demonstrate individual token analysis
4. **AI Signals**: Show the AI-powered trading recommendations
5. **Risk Assessment**: Display risk analysis features
6. **API Integration**: Show the Swagger documentation

### **Key Talking Points**
- **Real-time Data**: Emphasize live blockchain data integration
- **AI-Powered**: Highlight machine learning and automation
- **Professional UI**: Showcase the modern, production-ready design
- **Scalability**: Mention the microservice architecture
- **Hackathon Fit**: Connect to Trojan Trading and Supra bounties

### **Technical Highlights**
- On-demand analytics (no background processing)
- Real-time blockchain data from Alchemy
- Uniswap V3 price feeds
- Redis caching with fallback
- Docker containerization
- Comprehensive API documentation

## 🏆 Hackathon Alignment

### **Trojan Trading Bounty**
- ✅ Memecoin analytics microservice
- ✅ Real-time blockchain data
- ✅ AI-powered trading signals
- ✅ Professional dashboard interface

### **Supra Automation/AI Agent Tracks**
- ✅ AI-driven analytics engine
- ✅ Automated signal generation
- ✅ Real-time data processing
- ✅ Scalable microservice architecture

## 🔍 Troubleshooting

### **Dashboard Not Loading**
- Ensure the server is running on port 3000
- Check browser console for JavaScript errors
- Verify API endpoints are accessible

### **No Data Displayed**
- Check if Alchemy API key is configured
- Verify blockchain connection status
- Run "Analyze All Tokens" to generate initial data

### **API Errors**
- Check server logs for detailed error messages
- Verify Redis connection (optional)
- Ensure all dependencies are installed

## 📝 Development Notes

- The dashboard uses fallback/mock data when blockchain connections fail
- All analytics are on-demand (no background processing)
- Real-time updates occur every 30 seconds
- Mobile-responsive design with touch support
- Professional error handling and user feedback

---

**Built with ❤️ for the Permissionless Hackathon** 