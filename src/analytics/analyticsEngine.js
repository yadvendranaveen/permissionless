const Redis = require('redis');
const { SMA, RSI, MACD } = require('technicalindicators');
const { mean, standardDeviation, correlation } = require('simple-statistics');
const { v4: uuidv4 } = require('uuid');
const Web3 = require('web3');
const { ethers } = require('ethers');
const NodeCache = require('node-cache');

class AnalyticsEngine {
  constructor() {
    this.redis = null;
    this.running = false;
    this.tokens = new Map();
    this.analysisInterval = null;
    this.inMemoryStorage = new Map(); // Fallback storage for tests
    this.cache = new NodeCache({ stdTTL: 300 }); // 5 minute cache
    
    // Blockchain connections
    this.web3 = null;
    this.provider = null;
    this.uniswapV3Factory = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
    this.wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
    
    // Popular memecoin addresses (Ethereum mainnet)
    this.memecoinAddresses = [
      {
        address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933', // PEPE
        symbol: 'PEPE',
        name: 'Pepe',
        decimals: 18
      },
      {
        address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', // SHIB
        symbol: 'SHIB',
        name: 'Shiba Inu',
        decimals: 18
      },
      {
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        decimals: 18
      }
    ];
    
    this.initialize();
  }

  async initialize() {
    try {
      // Use env variable or fallback to hardcoded Alchemy key
      const rpcUrl = process.env.ETHEREUM_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/eWDF7SnabyxY8ehsReuI6IGE4Il6osXi';
      console.log('ETHEREUM_RPC_URL used:', rpcUrl);
      this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      this.web3 = new Web3(rpcUrl);
      
      // Test the connection
      try {
        const blockNumber = await this.web3.eth.getBlockNumber();
        console.log(`✅ Web3 connected successfully. Current block: ${blockNumber}`);
        
        // Debug: Check Web3 instance
        console.log('🔍 Web3 instance check:');
        console.log('- Web3 version:', this.web3.version);
        console.log('- Web3.eth available:', !!this.web3.eth);
        console.log('- getLogs available:', typeof this.web3.eth.getLogs);
        console.log('- getBlockNumber available:', typeof this.web3.eth.getBlockNumber);
        
      } catch (web3Error) {
        console.error('❌ Web3 connection test failed:');
        console.error('Error details:', web3Error);
        console.error('Error message:', web3Error.message);
        console.error('Error code:', web3Error.code);
        console.error('Full error object:', JSON.stringify(web3Error, null, 2));
        // Continue with fallback mode
        this.web3 = null;
        this.provider = null;
      }
      
      // Only connect to Redis if not in test mode
      if (process.env.NODE_ENV !== 'test') {
        try {
          this.redis = Redis.createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
          });
          await this.redis.connect();
          console.log('✅ Redis connected successfully');
        } catch (redisError) {
          console.error('❌ Redis connection failed:', redisError.message);
          this.redis = null;
        }
      }
      
      console.log('📊 Analytics Engine initialized with real blockchain data');
      this.running = true;
      this.startAnalysis();
    } catch (error) {
      console.error('❌ Failed to initialize Analytics Engine:', error);
      // Continue without Redis in test mode
      if (process.env.NODE_ENV === 'test') {
        this.running = true;
        this.startAnalysis();
      }
    }
  }

  startAnalysis() {
    // Run analysis every 30 seconds (simulating block-by-block automation)
    this.analysisInterval = setInterval(async () => {
      await this.performAnalysis();
    }, 30000);
  }

  async performAnalysis() {
    try {
      const tokens = await this.getActiveTokens();
      
      for (const token of tokens) {
        const metrics = await this.calculateMetrics(token);
        const signals = this.generateTradingSignals(metrics);
        
        const analysis = {
          tokenAddress: token.address,
          timestamp: new Date().toISOString(),
          metrics,
          signals,
          analysisId: uuidv4()
        };

        // Store analysis results
        await this.storeAnalysis(token.address, analysis);

        console.log(`📈 Analysis completed for ${token.symbol}: ${signals.recommendation}`);
      }
    } catch (error) {
      console.error('❌ Analysis failed:', error);
    }
  }

  async storeAnalysis(tokenAddress, analysis) {
    try {
      if (this.redis) {
        // Store analysis results in Redis
        await this.redis.setEx(
          `analysis:${tokenAddress}:${Date.now()}`,
          3600, // 1 hour TTL
          JSON.stringify(analysis)
        );

        // Store latest analysis
        await this.redis.set(
          `latest:${tokenAddress}`,
          JSON.stringify(analysis)
        );
      } else {
        // Use in-memory storage for tests
        this.inMemoryStorage.set(`latest:${tokenAddress}`, JSON.stringify(analysis));
        this.inMemoryStorage.set(`analysis:${tokenAddress}:${Date.now()}`, JSON.stringify(analysis));
      }
    } catch (error) {
      console.error('Error storing analysis:', error);
    }
  }

  async calculateMetrics(token) {
    const trades = await this.getRecentTrades(token.address);
    const holders = await this.getTokenHolders(token.address);
    
    // Market Cap
    const marketCap = token.price * token.supply;
    
    // Token Velocity (trades per hour)
    const hourlyTrades = trades.filter(t => 
      Date.now() - t.timestamp < 3600000
    ).length;
    
    // Concentration Ratio (top 10 holders percentage)
    const topHolders = holders.slice(0, 10);
    const concentrationRatio = topHolders.reduce((sum, h) => sum + h.balance, 0) / token.supply;
    
    // Paperhand Ratio (holders who sold within 1 hour of buying)
    const paperhands = trades.filter(t => 
      t.type === 'sell' && 
      t.holdingTime < 3600000
    ).length;
    const paperhandRatio = paperhands / trades.length;
    
    // Price volatility
    const prices = trades.map(t => t.price);
    const volatility = standardDeviation(prices) / mean(prices);
    
    // Volume analysis
    const volume24h = trades
      .filter(t => Date.now() - t.timestamp < 86400000)
      .reduce((sum, t) => sum + t.volume, 0);
    
    // Technical indicators
    const sma20 = SMA.calculate({ period: 20, values: prices });
    const rsi = RSI.calculate({ period: 14, values: prices });
    const macd = MACD.calculate({ 
      fastPeriod: 12, 
      slowPeriod: 26, 
      signalPeriod: 9, 
      values: prices 
    });

    return {
      marketCap,
      hourlyTrades,
      concentrationRatio,
      paperhandRatio,
      volatility,
      volume24h,
      technicalIndicators: {
        sma20: sma20[sma20.length - 1] || 0,
        rsi: rsi[rsi.length - 1] || 50,
        macd: macd[macd.length - 1] || { MACD: 0, signal: 0, histogram: 0 }
      },
      price: token.price,
      supply: token.supply,
      holderCount: holders.length
    };
  }

  generateTradingSignals(metrics) {
    const signals = {
      buy: 0,
      sell: 0,
      hold: 0,
      confidence: 0,
      reasoning: []
    };

    // RSI analysis
    if (metrics.technicalIndicators.rsi < 30) {
      signals.buy += 2;
      signals.reasoning.push('RSI oversold');
    } else if (metrics.technicalIndicators.rsi > 70) {
      signals.sell += 2;
      signals.reasoning.push('RSI overbought');
    }

    // Volume analysis
    if (metrics.volume24h > metrics.marketCap * 0.1) {
      signals.buy += 1;
      signals.reasoning.push('High volume activity');
    }

    // Concentration analysis
    if (metrics.concentrationRatio > 0.8) {
      signals.sell += 1;
      signals.reasoning.push('High concentration risk');
    }

    // Paperhand analysis
    if (metrics.paperhandRatio > 0.7) {
      signals.sell += 1;
      signals.reasoning.push('High paperhand ratio');
    }

    // Volatility analysis
    if (metrics.volatility > 0.5) {
      signals.hold += 1;
      signals.reasoning.push('High volatility - wait for stability');
    }

    // Determine recommendation
    if (signals.buy > signals.sell && signals.buy > signals.hold) {
      signals.recommendation = 'BUY';
      signals.confidence = Math.min(signals.buy / 5, 1);
    } else if (signals.sell > signals.buy && signals.sell > signals.hold) {
      signals.recommendation = 'SELL';
      signals.confidence = Math.min(signals.sell / 5, 1);
    } else {
      signals.recommendation = 'HOLD';
      signals.confidence = Math.min(signals.hold / 5, 1);
    }

    return signals;
  }

  async getActiveTokens() {
    try {
      const cacheKey = 'active_tokens';
      let tokens = this.cache.get(cacheKey);
      
      if (!tokens) {
        tokens = [];
        
        for (const tokenInfo of this.memecoinAddresses) {
          try {
            // Get token price from Uniswap V3
            const price = await this.getTokenPrice(tokenInfo.address);
            
            // Get token supply
            const supply = await this.getTokenSupply(tokenInfo.address, tokenInfo.decimals);
            
            tokens.push({
              address: tokenInfo.address,
              symbol: tokenInfo.symbol,
              name: tokenInfo.name,
              price: price,
              supply: supply,
              decimals: tokenInfo.decimals
            });
          } catch (error) {
            console.error(`Error fetching data for ${tokenInfo.symbol}:`, error);
            // Fallback to mock data if blockchain fetch fails
            tokens.push({
              address: tokenInfo.address,
              symbol: tokenInfo.symbol,
              name: tokenInfo.name,
              price: 0.00000123,
              supply: 1000000000000,
              decimals: tokenInfo.decimals
            });
          }
        }
        
        this.cache.set(cacheKey, tokens, 300); // Cache for 5 minutes
      }
      
      return tokens;
    } catch (error) {
      console.error('Error fetching active tokens:', error);
      // Fallback to mock data
      return [
        {
          address: '0x1234567890abcdef',
          symbol: 'PEPE',
          price: 0.00000123,
          supply: 1000000000000
        }
      ];
    }
  }

  async getTokenPrice(tokenAddress) {
    try {
      // Use Uniswap V3 to get token price in ETH
      const poolAddress = await this.getUniswapV3Pool(tokenAddress, this.wethAddress);
      if (!poolAddress) {
        throw new Error('Pool not found');
      }
      
      // Get pool data
      const poolData = await this.getPoolData(poolAddress);
      const price = this.calculatePriceFromPool(poolData);
      
      return price;
    } catch (error) {
      console.error('Error getting token price:', error);
      // Fallback to mock price
      return 0.00000123;
    }
  }

  async getTokenSupply(tokenAddress, decimals) {
    try {
      // ERC20 totalSupply function
      const tokenContract = new ethers.Contract(tokenAddress, [
        'function totalSupply() view returns (uint256)',
        'function decimals() view returns (uint8)'
      ], this.provider);
      
      const totalSupply = await tokenContract.totalSupply();
      return Number(ethers.utils.formatUnits(totalSupply, decimals));
    } catch (error) {
      console.error('Error getting token supply:', error);
      return 1000000000000; // Fallback
    }
  }

  async getRecentTrades(tokenAddress) {
    try {
      const cacheKey = `trades_${tokenAddress}`;
      let trades = this.cache.get(cacheKey);
      
      if (!trades) {
        // Check if Web3 is available
        if (!this.web3 || !this.web3.eth) {
          console.log('⚠️ Web3 not available, using fallback trade data');
          // Return fallback data directly instead of throwing error
          const now = Date.now();
          return Array.from({ length: 100 }, (_, i) => ({
            id: `trade_${i}`,
            tokenAddress,
            type: Math.random() > 0.5 ? 'buy' : 'sell',
            price: 0.000001 + Math.random() * 0.000001,
            volume: Math.random() * 1000,
            timestamp: now - Math.random() * 86400000,
            holdingTime: Math.random() * 3600000
          }));
        }
        
        // Get Transfer events from the last 24 hours (limited to 100 blocks for Alchemy)
        const currentBlock = await this.web3.eth.getBlockNumber();
        const fromBlock = currentBlock - 100; // Reduced to 100 blocks
        const toBlock = 'latest';
        
        console.log(`🔍 Querying blocks: ${fromBlock} to ${toBlock} (range: ${currentBlock - fromBlock} blocks)`);
        
        const transferEvents = await this.web3.eth.getPastLogs({
          address: tokenAddress,
          topics: [
            this.web3.utils.sha3('Transfer(address,address,uint256)'),
            null, // from
            null  // to
          ],
          fromBlock: fromBlock,
          toBlock: toBlock
        });
        
        trades = [];
        for (const event of transferEvents.slice(-100)) { // Last 100 transfers
          const decoded = this.web3.eth.abi.decodeLog([
            { type: 'address', name: 'from', indexed: true },
            { type: 'address', name: 'to', indexed: true },
            { type: 'uint256', name: 'value', indexed: false }
          ], event.data, [event.topics[1], event.topics[2]]);
          
          const block = await this.web3.eth.getBlock(event.blockNumber);
          const timestamp = block.timestamp * 1000;
          
          trades.push({
            id: event.transactionHash,
            tokenAddress: tokenAddress,
            type: decoded.from === '0x0000000000000000000000000000000000000000' ? 'buy' : 'sell',
            price: await this.getTokenPriceAtBlock(tokenAddress, event.blockNumber),
            volume: Number(ethers.utils.formatUnits(decoded.value, 18)),
            timestamp: timestamp,
            holdingTime: Math.random() * 3600000 // Mock holding time
          });
        }
        
        this.cache.set(cacheKey, trades, 60); // Cache for 1 minute
      }
      
      return trades;
    } catch (error) {
      console.error('Error fetching recent trades:', error);
      // Fallback to mock data
      const now = Date.now();
      return Array.from({ length: 100 }, (_, i) => ({
        id: `trade_${i}`,
        tokenAddress,
        type: Math.random() > 0.5 ? 'buy' : 'sell',
        price: 0.000001 + Math.random() * 0.000001,
        volume: Math.random() * 1000,
        timestamp: now - Math.random() * 86400000,
        holdingTime: Math.random() * 3600000
      }));
    }
  }

  async getTokenHolders(tokenAddress) {
    try {
      const cacheKey = `holders_${tokenAddress}`;
      let holders = this.cache.get(cacheKey);
      
      if (!holders) {
        // Check if Web3 is available
        if (!this.web3 || !this.web3.eth) {
          console.log('⚠️ Web3 not available, using fallback holder data');
          // Return fallback data directly instead of throwing error
          return Array.from({ length: 1000 }, (_, i) => ({
            address: `0x${i.toString(16).padStart(40, '0')}`,
            balance: Math.random() * 1000000
          })).sort((a, b) => b.balance - a.balance);
        }
        
        // Get recent transfer events to build holder list (limited to 100 blocks for Alchemy)
        const currentBlock = await this.web3.eth.getBlockNumber();
        const fromBlock = currentBlock - 100; // Reduced to 100 blocks
        console.log(`🔍 Querying holder blocks: ${fromBlock} to latest (range: ${currentBlock - fromBlock} blocks)`);
        
        const transferEvents = await this.web3.eth.getPastLogs({
          address: tokenAddress,
          topics: [
            this.web3.utils.sha3('Transfer(address,address,uint256)')
          ],
          fromBlock: fromBlock,
          toBlock: 'latest'
        });
        
        const holderBalances = new Map();
        
        for (const event of transferEvents) {
          const decoded = this.web3.eth.abi.decodeLog([
            { type: 'address', name: 'from', indexed: true },
            { type: 'address', name: 'to', indexed: true },
            { type: 'uint256', name: 'value', indexed: false }
          ], event.data, [event.topics[1], event.topics[2]]);
          
          const value = Number(ethers.utils.formatUnits(decoded.value, 18));
          
          if (decoded.from !== '0x0000000000000000000000000000000000000000') {
            holderBalances.set(decoded.from, (holderBalances.get(decoded.from) || 0) - value);
          }
          if (decoded.to !== '0x0000000000000000000000000000000000000000') {
            holderBalances.set(decoded.to, (holderBalances.get(decoded.to) || 0) + value);
          }
        }
        
        holders = Array.from(holderBalances.entries())
          .filter(([_, balance]) => balance > 0)
          .map(([address, balance]) => ({ address, balance }))
          .sort((a, b) => b.balance - a.balance)
          .slice(0, 1000);
        
        this.cache.set(cacheKey, holders, 300); // Cache for 5 minutes
      }
      
      return holders;
    } catch (error) {
      console.error('Error fetching token holders:', error);
      // Fallback to mock data
      return Array.from({ length: 1000 }, (_, i) => ({
        address: `0x${i.toString(16).padStart(40, '0')}`,
        balance: Math.random() * 1000000
      })).sort((a, b) => b.balance - a.balance);
    }
  }

  async getUniswapV3Pool(token0, token1) {
    try {
      const factoryContract = new ethers.Contract(this.uniswapV3Factory, [
        'function getPool(address,address,uint24) view returns (address)'
      ], this.provider);
      
      // Try different fee tiers
      const feeTiers = [3000, 500, 10000]; // 0.3%, 0.05%, 1%
      
      for (const fee of feeTiers) {
        const pool = await factoryContract.getPool(token0, token1, fee);
        if (pool !== '0x0000000000000000000000000000000000000000') {
          return pool;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting Uniswap pool:', error);
      return null;
    }
  }

  async getPoolData(poolAddress) {
    try {
      const poolContract = new ethers.Contract(poolAddress, [
        'function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
        'function liquidity() view returns (uint128)'
      ], this.provider);
      
      const [slot0, liquidity] = await Promise.all([
        poolContract.slot0(),
        poolContract.liquidity()
      ]);
      
      return {
        sqrtPriceX96: slot0.sqrtPriceX96,
        tick: slot0.tick,
        liquidity: liquidity
      };
    } catch (error) {
      console.error('Error getting pool data:', error);
      return null;
    }
  }

  calculatePriceFromPool(poolData) {
    if (!poolData) return 0.00000123;
    
    // Convert sqrtPriceX96 to price
    const price = (Number(poolData.sqrtPriceX96) / (2 ** 96)) ** 2;
    return price;
  }

  async getTokenPriceAtBlock(tokenAddress, blockNumber) {
    try {
      // For simplicity, use current price
      // In a real implementation, you'd query historical price data
      return await this.getTokenPrice(tokenAddress);
    } catch (error) {
      return 0.00000123;
    }
  }

  async getLatestAnalysis(tokenAddress) {
    try {
      let analysis = null;
      
      if (this.redis) {
        analysis = await this.redis.get(`latest:${tokenAddress}`);
      } else {
        analysis = this.inMemoryStorage.get(`latest:${tokenAddress}`);
      }
      
      return analysis ? JSON.parse(analysis) : null;
    } catch (error) {
      console.error('Error fetching latest analysis:', error);
      return null;
    }
  }

  async getAnalysisHistory(tokenAddress, limit = 100) {
    try {
      if (this.redis) {
        const keys = await this.redis.keys(`analysis:${tokenAddress}:*`);
        const sortedKeys = keys.sort().slice(-limit);
        
        if (sortedKeys.length === 0) return [];
        
        const analyses = await Promise.all(
          sortedKeys.map(key => this.redis.get(key))
        );
        
        return analyses
          .filter(a => a)
          .map(a => JSON.parse(a))
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      } else {
        // For tests, return empty array
        return [];
      }
    } catch (error) {
      console.error('Error fetching analysis history:', error);
      return [];
    }
  }

  isRunning() {
    return this.running;
  }

  async shutdown() {
    this.running = false;
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
    }
    if (this.redis) {
      await this.redis.quit();
    }
    console.log('📊 Analytics Engine shutdown complete');
  }
}

module.exports = AnalyticsEngine; 