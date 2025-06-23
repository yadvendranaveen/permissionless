const { v4: uuidv4 } = require('uuid');

class SupraAutomation {
  constructor(analyticsEngine) {
    this.analyticsEngine = analyticsEngine;
    this.running = false;
    this.automationJobs = new Map();
    this.blockNumber = 0;
    this.automationInterval = null;
    this.isTestMode = process.env.NODE_ENV === 'test';
    
    this.initialize();
  }

  async initialize() {
    try {
      console.log('⚡ Supra Automation initialized');
      this.running = true;
      this.startBlockAutomation();
      this.registerDefaultJobs();
    } catch (error) {
      console.error('❌ Failed to initialize Supra Automation:', error);
    }
  }

  startBlockAutomation() {
    // In test mode, run less frequently to avoid interference
    const interval = this.isTestMode ? 60000 : 15000; // 1 minute in test, 15 seconds in production
    
    this.automationInterval = setInterval(async () => {
      this.blockNumber++;
      await this.executeBlockAutomation();
    }, interval);
  }

  async executeBlockAutomation() {
    try {
      if (!this.isTestMode) {
        console.log(`🔗 Block ${this.blockNumber}: Executing automation jobs...`);
      }
      
      // Execute all registered automation jobs
      for (const [jobId, job] of this.automationJobs) {
        if (job.isActive && this.shouldExecuteJob(job, this.blockNumber)) {
          await this.executeJob(job);
        }
      }

      // Trigger analytics engine analysis
      await this.analyticsEngine.performAnalysis();
      
    } catch (error) {
      console.error(`❌ Block ${this.blockNumber} automation failed:`, error);
    }
  }

  registerDefaultJobs() {
    // Job 1: Continuous Market Monitoring
    this.registerJob({
      id: 'market-monitor',
      name: 'Market Monitor',
      description: 'Continuously monitor market conditions and trigger alerts',
      type: 'continuous',
      interval: 1, // Every block
      isActive: true,
      execute: async () => {
        const tokens = await this.analyticsEngine.getActiveTokens();
        for (const token of tokens) {
          const analysis = await this.analyticsEngine.getLatestAnalysis(token.address);
          if (analysis && analysis.signals.confidence > 0.8) {
            if (!this.isTestMode) {
              console.log(`🚨 High confidence signal for ${token.symbol}: ${analysis.signals.recommendation}`);
            }
            this.triggerAlert(token, analysis);
          }
        }
      }
    });

    // Job 2: Volatility Alert
    this.registerJob({
      id: 'volatility-alert',
      name: 'Volatility Alert',
      description: 'Monitor for extreme volatility and trigger risk alerts',
      type: 'conditional',
      interval: 2, // Every 2 blocks
      isActive: true,
      execute: async () => {
        const tokens = await this.analyticsEngine.getActiveTokens();
        for (const token of tokens) {
          const analysis = await this.analyticsEngine.getLatestAnalysis(token.address);
          if (analysis && analysis.metrics.volatility > 0.8) {
            if (!this.isTestMode) {
              console.log(`⚠️ High volatility detected for ${token.symbol}: ${analysis.metrics.volatility}`);
            }
            this.triggerVolatilityAlert(token, analysis);
          }
        }
      }
    });

    // Job 3: Concentration Risk Monitor
    this.registerJob({
      id: 'concentration-monitor',
      name: 'Concentration Risk Monitor',
      description: 'Monitor token concentration and alert on whale movements',
      type: 'conditional',
      interval: 3, // Every 3 blocks
      isActive: true,
      execute: async () => {
        const tokens = await this.analyticsEngine.getActiveTokens();
        for (const token of tokens) {
          const analysis = await this.analyticsEngine.getLatestAnalysis(token.address);
          if (analysis && analysis.metrics.concentrationRatio > 0.9) {
            if (!this.isTestMode) {
              console.log(`🐋 High concentration detected for ${token.symbol}: ${analysis.metrics.concentrationRatio}`);
            }
            this.triggerConcentrationAlert(token, analysis);
          }
        }
      }
    });

    // Job 4: AI Trading Signal Generator
    this.registerJob({
      id: 'ai-signal-generator',
      name: 'AI Trading Signal Generator',
      description: 'Generate AI-powered trading signals based on market analysis',
      type: 'continuous',
      interval: 1, // Every block
      isActive: true,
      execute: async () => {
        await this.generateAITradingSignals();
      }
    });

    // Job 5: Market Sentiment Analysis
    this.registerJob({
      id: 'sentiment-analyzer',
      name: 'Market Sentiment Analyzer',
      description: 'Analyze market sentiment and social signals',
      type: 'periodic',
      interval: 10, // Every 10 blocks
      isActive: true,
      execute: async () => {
        await this.analyzeMarketSentiment();
      }
    });
  }

  registerJob(jobConfig) {
    const job = {
      ...jobConfig,
      id: jobConfig.id || uuidv4(),
      createdAt: new Date().toISOString(),
      lastExecuted: null,
      executionCount: 0,
      isActive: jobConfig.isActive || true
    };

    this.automationJobs.set(job.id, job);
    if (!this.isTestMode) {
      console.log(`📋 Registered automation job: ${job.name}`);
    }
    return job.id;
  }

  shouldExecuteJob(job, blockNumber) {
    switch (job.type) {
      case 'continuous':
        return true;
      case 'periodic':
        return blockNumber % job.interval === 0;
      case 'conditional':
        return blockNumber % job.interval === 0;
      default:
        return false;
    }
  }

  async executeJob(job) {
    try {
      job.lastExecuted = new Date().toISOString();
      job.executionCount++;
      
      await job.execute();
      
      if (!this.isTestMode) {
        console.log(`✅ Job ${job.name} executed successfully (Block ${this.blockNumber})`);
      }
    } catch (error) {
      console.error(`❌ Job ${job.name} execution failed:`, error);
    }
  }

  async generateAITradingSignals() {
    try {
      const tokens = await this.analyticsEngine.getActiveTokens();
      
      for (const token of tokens) {
        const analysis = await this.analyticsEngine.getLatestAnalysis(token.address);
        if (!analysis) continue;

        // Enhanced AI signal generation
        const aiSignal = this.generateEnhancedAISignal(analysis);
        
        // Store AI signal
        await this.storeAISignal(token.address, aiSignal);
        
        if (!this.isTestMode) {
          console.log(`🤖 AI Signal for ${token.symbol}: ${aiSignal.action} (Confidence: ${aiSignal.confidence})`);
        }
      }
    } catch (error) {
      console.error('❌ AI signal generation failed:', error);
    }
  }

  generateEnhancedAISignal(analysis) {
    const { metrics, signals } = analysis;
    
    // Multi-factor analysis
    let score = 0;
    let factors = [];

    // Technical analysis (40% weight)
    if (metrics.technicalIndicators.rsi < 30) {
      score += 40;
      factors.push('RSI oversold');
    } else if (metrics.technicalIndicators.rsi > 70) {
      score -= 40;
      factors.push('RSI overbought');
    }

    // Volume analysis (20% weight)
    if (metrics.volume24h > metrics.marketCap * 0.15) {
      score += 20;
      factors.push('High volume');
    }

    // Volatility analysis (15% weight)
    if (metrics.volatility < 0.3) {
      score += 15;
      factors.push('Low volatility');
    } else if (metrics.volatility > 0.7) {
      score -= 15;
      factors.push('High volatility');
    }

    // Concentration analysis (15% weight)
    if (metrics.concentrationRatio < 0.5) {
      score += 15;
      factors.push('Good distribution');
    } else if (metrics.concentrationRatio > 0.8) {
      score -= 15;
      factors.push('High concentration');
    }

    // Paperhand analysis (10% weight)
    if (metrics.paperhandRatio < 0.3) {
      score += 10;
      factors.push('Strong holders');
    } else if (metrics.paperhandRatio > 0.7) {
      score -= 10;
      factors.push('High paperhands');
    }

    // Determine action based on score
    let action = 'HOLD';
    let confidence = Math.abs(score) / 100;

    if (score > 30) {
      action = 'STRONG_BUY';
    } else if (score > 10) {
      action = 'BUY';
    } else if (score < -30) {
      action = 'STRONG_SELL';
    } else if (score < -10) {
      action = 'SELL';
    }

    return {
      action,
      confidence: Math.min(confidence, 1),
      score,
      factors,
      timestamp: new Date().toISOString(),
      signalId: uuidv4()
    };
  }

  async analyzeMarketSentiment() {
    try {
      // Real sentiment analysis from multiple sources
      const sentiment = await this.getRealMarketSentiment();
      
      if (!this.isTestMode) {
        console.log(`📊 Market sentiment: ${sentiment.overall} (${Math.round(sentiment.confidence * 100)}%)`);
      }
      
      // Store sentiment data
      await this.storeSentimentData(sentiment);
      
    } catch (error) {
      console.error('❌ Sentiment analysis failed:', error);
      // Fallback to mock sentiment
      const fallbackSentiment = {
        overall: Math.random() > 0.5 ? 'bullish' : 'bearish',
        confidence: Math.random(),
        sources: ['fallback'],
        timestamp: new Date().toISOString()
      };
      await this.storeSentimentData(fallbackSentiment);
    }
  }

  async getRealMarketSentiment() {
    try {
      const axios = require('axios');
      const sentiment = {
        overall: 'neutral',
        confidence: 0.5,
        sources: [],
        timestamp: new Date().toISOString(),
        details: {}
      };

      // 1. Crypto Fear & Greed Index
      try {
        const fearGreedResponse = await axios.get('https://api.alternative.me/fng/', {
          timeout: 5000
        });
        
        if (fearGreedResponse.data && fearGreedResponse.data.data && fearGreedResponse.data.data[0]) {
          const fearGreedValue = parseInt(fearGreedResponse.data.data[0].value);
          sentiment.details.fearGreed = fearGreedValue;
          sentiment.sources.push('fear_greed');
          
          // Convert to sentiment
          if (fearGreedValue >= 75) {
            sentiment.overall = 'bullish';
            sentiment.confidence = Math.min(fearGreedValue / 100, 1);
          } else if (fearGreedValue <= 25) {
            sentiment.overall = 'bearish';
            sentiment.confidence = Math.min((100 - fearGreedValue) / 100, 1);
          }
        }
      } catch (error) {
        console.log('Fear & Greed API failed, skipping...');
      }

      // 2. CoinGecko Market Sentiment
      try {
        const coingeckoResponse = await axios.get('https://api.coingecko.com/api/v3/global', {
          timeout: 5000
        });
        
        if (coingeckoResponse.data && coingeckoResponse.data.data) {
          const marketData = coingeckoResponse.data.data;
          sentiment.details.marketCapChange24h = marketData.market_cap_change_percentage_24h_usd;
          sentiment.sources.push('coingecko');
          
          // Adjust sentiment based on market cap change
          if (marketData.market_cap_change_percentage_24h_usd > 5) {
            sentiment.overall = 'bullish';
            sentiment.confidence = Math.min(Math.abs(marketData.market_cap_change_percentage_24h_usd) / 20, 1);
          } else if (marketData.market_cap_change_percentage_24h_usd < -5) {
            sentiment.overall = 'bearish';
            sentiment.confidence = Math.min(Math.abs(marketData.market_cap_change_percentage_24h_usd) / 20, 1);
          }
        }
      } catch (error) {
        console.log('CoinGecko API failed, skipping...');
      }

      // 3. Social Media Sentiment (simulated with Reddit API)
      try {
        const redditResponse = await axios.get('https://www.reddit.com/r/cryptocurrency/hot.json?limit=10', {
          headers: {
            'User-Agent': 'AutoTradingAnalytics/1.0'
          },
          timeout: 5000
        });
        
        if (redditResponse.data && redditResponse.data.data && redditResponse.data.data.children) {
          const posts = redditResponse.data.data.children;
          let positivePosts = 0;
          let totalPosts = posts.length;
          
          // Simple keyword-based sentiment analysis
          const bullishKeywords = ['bullish', 'moon', 'pump', 'buy', 'hodl', 'diamond', 'rocket'];
          const bearishKeywords = ['bearish', 'dump', 'sell', 'crash', 'fud', 'scam'];
          
          posts.forEach(post => {
            const title = post.data.title.toLowerCase();
            const bullishCount = bullishKeywords.filter(keyword => title.includes(keyword)).length;
            const bearishCount = bearishKeywords.filter(keyword => title.includes(keyword)).length;
            
            if (bullishCount > bearishCount) positivePosts++;
          });
          
          const redditSentiment = positivePosts / totalPosts;
          sentiment.details.redditSentiment = redditSentiment;
          sentiment.sources.push('reddit');
          
          // Combine with existing sentiment
          if (sentiment.sources.length > 1) {
            const avgConfidence = (sentiment.confidence + redditSentiment) / 2;
            sentiment.confidence = avgConfidence;
          }
        }
      } catch (error) {
        console.log('Reddit API failed, skipping...');
      }

      // 4. Memecoin-specific sentiment
      try {
        const memecoinResponse = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=pepe,shiba-inu,dogecoin&order=market_cap_desc&per_page=3&page=1&sparkline=false&price_change_percentage=24h', {
          timeout: 5000
        });
        
        if (memecoinResponse.data && memecoinResponse.data.length > 0) {
          const memecoinChanges = memecoinResponse.data.map(coin => coin.price_change_percentage_24h);
          const avgMemecoinChange = memecoinChanges.reduce((sum, change) => sum + change, 0) / memecoinChanges.length;
          
          sentiment.details.memecoinChange24h = avgMemecoinChange;
          sentiment.sources.push('memecoin_tracking');
          
          // Adjust sentiment based on memecoin performance
          if (avgMemecoinChange > 10) {
            sentiment.overall = 'bullish';
            sentiment.confidence = Math.min(Math.abs(avgMemecoinChange) / 50, 1);
          } else if (avgMemecoinChange < -10) {
            sentiment.overall = 'bearish';
            sentiment.confidence = Math.min(Math.abs(avgMemecoinChange) / 50, 1);
          }
        }
      } catch (error) {
        console.log('Memecoin tracking failed, skipping...');
      }

      // Ensure we have at least some sentiment data
      if (sentiment.sources.length === 0) {
        sentiment.overall = 'neutral';
        sentiment.confidence = 0.5;
        sentiment.sources = ['fallback'];
      }

      return sentiment;
      
    } catch (error) {
      console.error('Error getting real market sentiment:', error);
      throw error;
    }
  }

  triggerAlert(token, analysis) {
    // In real implementation, this would send notifications
    if (!this.isTestMode) {
      console.log(`🚨 ALERT: ${token.symbol} - ${analysis.signals.recommendation} signal with ${Math.round(analysis.signals.confidence * 100)}% confidence`);
    }
  }

  triggerVolatilityAlert(token, analysis) {
    if (!this.isTestMode) {
      console.log(`⚠️ VOLATILITY ALERT: ${token.symbol} showing extreme volatility (${analysis.metrics.volatility})`);
    }
  }

  triggerConcentrationAlert(token, analysis) {
    if (!this.isTestMode) {
      console.log(`🐋 CONCENTRATION ALERT: ${token.symbol} has high whale concentration (${Math.round(analysis.metrics.concentrationRatio * 100)}%)`);
    }
  }

  async storeAISignal(tokenAddress, signal) {
    // Store AI signal in Redis or memory
    try {
      if (this.analyticsEngine.redis) {
        await this.analyticsEngine.redis.setEx(
          `ai_signal:${tokenAddress}:${Date.now()}`,
          7200, // 2 hours TTL
          JSON.stringify(signal)
        );
      } else {
        // Store in memory for tests
        this.analyticsEngine.inMemoryStorage.set(`ai_signal:${tokenAddress}:${Date.now()}`, JSON.stringify(signal));
      }
    } catch (error) {
      console.error('Error storing AI signal:', error);
    }
  }

  async storeSentimentData(sentiment) {
    // Store sentiment data in Redis or memory
    try {
      if (this.analyticsEngine.redis) {
        await this.analyticsEngine.redis.setEx(
          `sentiment:${Date.now()}`,
          3600, // 1 hour TTL
          JSON.stringify(sentiment)
        );
      } else {
        // Store in memory for tests
        this.analyticsEngine.inMemoryStorage.set(`sentiment:${Date.now()}`, JSON.stringify(sentiment));
      }
    } catch (error) {
      console.error('Error storing sentiment data:', error);
    }
  }

  getJobStatus() {
    return Array.from(this.automationJobs.values()).map(job => ({
      id: job.id,
      name: job.name,
      type: job.type,
      isActive: job.isActive,
      lastExecuted: job.lastExecuted,
      executionCount: job.executionCount
    }));
  }

  isRunning() {
    return this.running;
  }

  async shutdown() {
    this.running = false;
    if (this.automationInterval) {
      clearInterval(this.automationInterval);
    }
    console.log('⚡ Supra Automation shutdown complete');
  }
}

module.exports = SupraAutomation; 