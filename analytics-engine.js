const Web3 = require('web3');
const { ethers } = require('ethers');

class AnalyticsEngine {
    constructor(web3Provider, tokens) {
        this.web3 = new Web3(web3Provider);
        this.tokens = tokens;
        this.analyticsCache = new Map();
        this.lastUpdate = null;
    }

    async analyzeToken(token) {
        try {
            console.log(`📈 Starting analysis for ${token.symbol}...`);
            
            // Get current price and market data
            const currentPrice = await this.getCurrentPrice(token);
            const marketData = await this.getMarketData(token);
            
            // Get historical data for analysis
            const historicalData = await this.getHistoricalData(token);
            
            // Calculate technical indicators
            const technicalIndicators = this.calculateTechnicalIndicators(historicalData);
            
            // Generate trading signals
            const tradingSignals = this.generateTradingSignals(technicalIndicators, marketData);
            
            // Calculate risk metrics
            const riskMetrics = this.calculateRiskMetrics(historicalData, marketData);
            
            // Get holder analysis
            const holderAnalysis = await this.getHolderAnalysis(token);
            
            // Compile analytics
            const analytics = {
                symbol: token.symbol,
                name: token.name,
                currentPrice,
                priceChange24h: marketData.priceChange24h,
                priceChange7d: marketData.priceChange7d,
                marketCap: marketData.marketCap,
                volume24h: marketData.volume24h,
                circulatingSupply: marketData.circulatingSupply,
                maxSupply: marketData.maxSupply,
                allTimeHigh: marketData.allTimeHigh,
                allTimeLow: marketData.allTimeLow,
                priceHistory: historicalData,
                tradingSignals,
                riskMetrics,
                holderAnalysis,
                lastUpdated: new Date().toISOString()
            };
            
            // Cache the results
            this.analyticsCache.set(token.symbol, analytics);
            this.lastUpdate = new Date();
            
            console.log(`📈 Analysis completed for ${token.symbol}: ${tradingSignals.current}`);
            return analytics;
            
        } catch (error) {
            console.error(`Error analyzing ${token.symbol}:`, error);
            return null;
        }
    }

    async getCurrentPrice(token) {
        try {
            // Simulate price fetching - in real implementation, this would call price APIs
            const basePrice = {
                'DOGE': 0.26444968,
                'SHIB': 0.00000786,
                'PIG': 0.00000011
            };
            
            // Add some random variation to simulate live data
            const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
            return basePrice[token.symbol] * (1 + variation);
        } catch (error) {
            console.error(`Error getting current price for ${token.symbol}:`, error);
            return 0;
        }
    }

    async getMarketData(token) {
        try {
            // Simulate market data - in real implementation, this would call market APIs
            const marketData = {
                'DOGE': {
                    priceChange24h: 11.23,
                    priceChange7d: -8.45,
                    marketCap: 34431598885.98,
                    volume24h: 2167521670.48,
                    circulatingSupply: 130000000000,
                    maxSupply: null,
                    allTimeHigh: 0.7375666,
                    allTimeLow: 0.00008690
                },
                'SHIB': {
                    priceChange24h: 5.12,
                    priceChange7d: 12.34,
                    marketCap: 3101198479.54,
                    volume24h: 368723896.78,
                    circulatingSupply: 394796000000000,
                    maxSupply: 1000000000000000,
                    allTimeHigh: 0.00008616,
                    allTimeLow: 0.0000000000000001
                },
                'PIG': {
                    priceChange24h: -2.34,
                    priceChange7d: -15.67,
                    marketCap: 0,
                    volume24h: 1267679.12,
                    circulatingSupply: 1000000000000000,
                    maxSupply: 1000000000000000,
                    allTimeHigh: 0.00000551,
                    allTimeLow: 0.0000000000000001
                }
            };
            
            return marketData[token.symbol] || {};
        } catch (error) {
            console.error(`Error getting market data for ${token.symbol}:`, error);
            return {};
        }
    }

    async getHistoricalData(token) {
        try {
            // Use the real historical data from CSV files
            const historicalData = {
                'DOGE': [
                    { date: "2021-06-27", price: 0.26444968, volume: 2167521670.48 },
                    { date: "2021-06-26", price: 0.2447839, volume: 2649457301.97 },
                    { date: "2021-06-25", price: 0.23915293, volume: 5542163262.31 },
                    { date: "2021-06-24", price: 0.26278229, volume: 3844648059.04 },
                    { date: "2021-06-23", price: 0.23217351, volume: 5098674891.27 },
                    { date: "2021-06-22", price: 0.19103065, volume: 5992850344.48 },
                    { date: "2021-06-21", price: 0.17869117, volume: 5640232166.5 },
                    { date: "2021-06-20", price: 0.28090031, volume: 1963503799.66 },
                    { date: "2021-06-19", price: 0.28735578, volume: 1003248257.66 },
                    { date: "2021-06-18", price: 0.29347221, volume: 1846213588.84 },
                    { date: "2021-06-17", price: 0.30649565, volume: 1120766442.26 },
                    { date: "2021-06-16", price: 0.30776119, volume: 1391720787.82 },
                    { date: "2021-06-15", price: 0.32838122, volume: 1687965229.59 },
                    { date: "2021-06-14", price: 0.33208479, volume: 1613812022.94 },
                    { date: "2021-06-13", price: 0.32438177, volume: 1484851447.18 }
                ],
                'SHIB': [
                    { date: "2021-06-27", price: 0.00000786, volume: 368723896.78 },
                    { date: "2021-06-26", price: 0.00000748, volume: 506208121.8 },
                    { date: "2021-06-25", price: 0.00000706, volume: 809551821.87 },
                    { date: "2021-06-24", price: 0.00000721, volume: 374340895.34 },
                    { date: "2021-06-23", price: 0.00000683, volume: 538227669.2 },
                    { date: "2021-06-22", price: 0.00000633, volume: 798815194.99 },
                    { date: "2021-06-21", price: 0.00000622, volume: 719083156.19 },
                    { date: "2021-06-20", price: 0.0000078, volume: 644943958.52 },
                    { date: "2021-06-19", price: 0.00000762, volume: 800211654.51 },
                    { date: "2021-06-18", price: 0.00000725, volume: 560685269.04 },
                    { date: "2021-06-17", price: 0.00000796, volume: 645884625.48 },
                    { date: "2021-06-16", price: 0.00000831, volume: 1147441099.88 },
                    { date: "2021-06-15", price: 0.00000721, volume: 464565251.02 },
                    { date: "2021-06-14", price: 0.00000699, volume: 484227038.41 },
                    { date: "2021-06-13", price: 0.00000687, volume: 479855598.38 }
                ],
                'PIG': [
                    { date: "2021-06-27", price: 0.00000011, volume: 1267679.12 },
                    { date: "2021-06-26", price: 0.00000011, volume: 1592616.11 },
                    { date: "2021-06-25", price: 0.00000011, volume: 3974683.54 },
                    { date: "2021-06-24", price: 0.00000012, volume: 3158206.08 },
                    { date: "2021-06-23", price: 0.00000011, volume: 4177699.79 },
                    { date: "2021-06-22", price: 0.0000001, volume: 5303342.8 },
                    { date: "2021-06-21", price: 0.0000001, volume: 4882615.34 },
                    { date: "2021-06-20", price: 0.00000016, volume: 4123757.59 },
                    { date: "2021-06-19", price: 0.00000016, volume: 4367057.83 },
                    { date: "2021-06-18", price: 0.00000018, volume: 3205882.94 },
                    { date: "2021-06-17", price: 0.0000002, volume: 3060363.32 },
                    { date: "2021-06-16", price: 0.00000022, volume: 3272290.8 },
                    { date: "2021-06-15", price: 0.00000023, volume: 3192711.37 },
                    { date: "2021-06-14", price: 0.00000024, volume: 23002166.76 },
                    { date: "2021-06-13", price: 0.00000024, volume: 22071971.98 }
                ]
            };
            
            return historicalData[token.symbol] || [];
        } catch (error) {
            console.error(`Error getting historical data for ${token.symbol}:`, error);
            return [];
        }
    }

    calculateTechnicalIndicators(historicalData) {
        if (historicalData.length < 2) return {};
        
        const prices = historicalData.map(d => d.price);
        const volumes = historicalData.map(d => d.volume);
        
        // Calculate moving averages
        const sma5 = this.calculateSMA(prices, 5);
        const sma10 = this.calculateSMA(prices, 10);
        
        // Calculate RSI
        const rsi = this.calculateRSI(prices, 14);
        
        // Calculate MACD
        const macd = this.calculateMACD(prices);
        
        // Calculate Bollinger Bands
        const bb = this.calculateBollingerBands(prices, 20, 2);
        
        return {
            sma5,
            sma10,
            rsi,
            macd,
            bollingerBands: bb,
            volumeSMA: this.calculateSMA(volumes, 10)
        };
    }

    calculateSMA(data, period) {
        if (data.length < period) return data[data.length - 1];
        const sum = data.slice(-period).reduce((a, b) => a + b, 0);
        return sum / period;
    }

    calculateRSI(prices, period = 14) {
        if (prices.length < period + 1) return 50;
        
        let gains = 0;
        let losses = 0;
        
        for (let i = 1; i <= period; i++) {
            const change = prices[prices.length - i] - prices[prices.length - i - 1];
            if (change > 0) {
                gains += change;
            } else {
                losses += Math.abs(change);
            }
        }
        
        const avgGain = gains / period;
        const avgLoss = losses / period;
        
        if (avgLoss === 0) return 100;
        
        const rs = avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
    }

    calculateMACD(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
        if (prices.length < slowPeriod) return { macd: 0, signal: 0, histogram: 0 };
        
        const ema12 = this.calculateEMA(prices, fastPeriod);
        const ema26 = this.calculateEMA(prices, slowPeriod);
        const macd = ema12 - ema26;
        
        // For simplicity, we'll use a simple average for signal line
        const signal = macd; // In real implementation, this would be EMA of MACD
        
        return {
            macd,
            signal,
            histogram: macd - signal
        };
    }

    calculateEMA(data, period) {
        if (data.length < period) return data[data.length - 1];
        
        const multiplier = 2 / (period + 1);
        let ema = data[0];
        
        for (let i = 1; i < data.length; i++) {
            ema = (data[i] * multiplier) + (ema * (1 - multiplier));
        }
        
        return ema;
    }

    calculateBollingerBands(prices, period = 20, stdDev = 2) {
        if (prices.length < period) {
            const currentPrice = prices[prices.length - 1];
            return { upper: currentPrice, middle: currentPrice, lower: currentPrice };
        }
        
        const sma = this.calculateSMA(prices, period);
        const variance = prices.slice(-period).reduce((sum, price) => {
            return sum + Math.pow(price - sma, 2);
        }, 0) / period;
        
        const standardDeviation = Math.sqrt(variance);
        
        return {
            upper: sma + (standardDeviation * stdDev),
            middle: sma,
            lower: sma - (standardDeviation * stdDev)
        };
    }

    generateTradingSignals(indicators, marketData) {
        let signal = 'HOLD';
        let confidence = 0.5;
        let reasoning = 'Mixed signals detected';
        
        // Analyze RSI
        if (indicators.rsi < 30) {
            signal = 'BUY';
            confidence += 0.2;
            reasoning = 'Oversold conditions detected (RSI < 30)';
        } else if (indicators.rsi > 70) {
            signal = 'SELL';
            confidence += 0.2;
            reasoning = 'Overbought conditions detected (RSI > 70)';
        }
        
        // Analyze moving averages
        if (indicators.sma5 > indicators.sma10) {
            if (signal === 'BUY') {
                confidence += 0.1;
                reasoning += ' with bullish moving average crossover';
            } else if (signal === 'HOLD') {
                signal = 'BUY';
                confidence = 0.6;
                reasoning = 'Bullish moving average crossover';
            }
        } else if (indicators.sma5 < indicators.sma10) {
            if (signal === 'SELL') {
                confidence += 0.1;
                reasoning += ' with bearish moving average crossover';
            } else if (signal === 'HOLD') {
                signal = 'SELL';
                confidence = 0.6;
                reasoning = 'Bearish moving average crossover';
            }
        }
        
        // Analyze price momentum
        const priceChange = marketData.priceChange24h || 0;
        if (Math.abs(priceChange) > 10) {
            if (priceChange > 0 && signal === 'BUY') {
                confidence += 0.1;
                reasoning += ' and strong positive momentum';
            } else if (priceChange < 0 && signal === 'SELL') {
                confidence += 0.1;
                reasoning += ' and strong negative momentum';
            }
        }
        
        // Cap confidence at 0.95
        confidence = Math.min(confidence, 0.95);
        
        return {
            current: signal,
            confidence,
            reasoning,
            lastUpdated: new Date().toISOString()
        };
    }

    calculateRiskMetrics(historicalData, marketData) {
        if (historicalData.length < 2) {
            return {
                volatility: 0,
                sharpeRatio: 0,
                maxDrawdown: 0,
                beta: 1
            };
        }
        
        const prices = historicalData.map(d => d.price);
        const returns = [];
        
        for (let i = 1; i < prices.length; i++) {
            returns.push((prices[i] - prices[i-1]) / prices[i-1]);
        }
        
        // Calculate volatility
        const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
        const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (returns.length - 1);
        const volatility = Math.sqrt(variance);
        
        // Calculate Sharpe ratio (assuming risk-free rate of 0)
        const sharpeRatio = volatility > 0 ? mean / volatility : 0;
        
        // Calculate max drawdown
        let maxDrawdown = 0;
        let peak = prices[0];
        
        for (const price of prices) {
            if (price > peak) {
                peak = price;
            }
            const drawdown = (peak - price) / peak;
            if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
            }
        }
        
        return {
            volatility,
            sharpeRatio,
            maxDrawdown: -maxDrawdown,
            beta: 1 // Simplified - in real implementation, this would be calculated against market index
        };
    }

    async getHolderAnalysis(token) {
        try {
            // Simulate holder analysis - in real implementation, this would analyze blockchain data
            const holderData = {
                'DOGE': {
                    totalHolders: 4567890,
                    top10Holders: 23.4,
                    top50Holders: 45.6,
                    averageHoldingTime: 45
                },
                'SHIB': {
                    totalHolders: 1234567,
                    top10Holders: 18.9,
                    top50Holders: 38.7,
                    averageHoldingTime: 28
                },
                'PIG': {
                    totalHolders: 89012,
                    top10Holders: 67.8,
                    top50Holders: 89.2,
                    averageHoldingTime: 12
                }
            };
            
            return holderData[token.symbol] || {};
        } catch (error) {
            console.error(`Error getting holder analysis for ${token.symbol}:`, error);
            return {};
        }
    }

    async getTokenAnalytics(token) {
        // Return cached analytics if available and recent
        const cached = this.analyticsCache.get(token.symbol);
        if (cached && this.lastUpdate && (new Date() - this.lastUpdate) < 300000) { // 5 minutes
            return cached;
        }
        
        // Otherwise, perform fresh analysis
        return await this.analyzeToken(token);
    }

    // Get current analytics data for live dashboard
    async getCurrentAnalytics() {
        try {
            const currentData = {
                totalMarketCap: 0,
                totalVolume24h: 0,
                activeTokens: this.tokens.length,
                marketTrend: "neutral",
                tokens: {},
                tradingSignals: [],
                riskAnalysis: {},
                recentTrades: [],
                performance: {
                    totalReturn: 0,
                    sharpeRatio: 0,
                    maxDrawdown: 0,
                    volatility: 0,
                    beta: 0,
                    alpha: 0
                }
            };

            // Get latest data for each token
            for (const token of this.tokens) {
                const tokenData = await this.getTokenAnalytics(token);
                if (tokenData) {
                    currentData.tokens[token.symbol] = tokenData;
                    currentData.totalMarketCap += tokenData.marketCap || 0;
                    currentData.totalVolume24h += tokenData.volume24h || 0;
                    
                    // Add trading signal
                    if (tokenData.tradingSignals) {
                        currentData.tradingSignals.push({
                            token: token.symbol,
                            signal: tokenData.tradingSignals.current,
                            confidence: tokenData.tradingSignals.confidence,
                            price: tokenData.currentPrice,
                            change24h: tokenData.priceChange24h,
                            reasoning: tokenData.tradingSignals.reasoning,
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            }

            // Determine market trend
            const bullishTokens = currentData.tradingSignals.filter(s => s.signal === 'BUY').length;
            const bearishTokens = currentData.tradingSignals.filter(s => s.signal === 'SELL').length;
            
            if (bullishTokens > bearishTokens) {
                currentData.marketTrend = "bullish";
            } else if (bearishTokens > bullishTokens) {
                currentData.marketTrend = "bearish";
            } else {
                currentData.marketTrend = "neutral";
            }

            // Calculate performance metrics
            const returns = currentData.tradingSignals.map(s => s.change24h);
            if (returns.length > 0) {
                currentData.performance.totalReturn = returns.reduce((a, b) => a + b, 0);
                currentData.performance.volatility = this.calculateVolatility(returns);
                currentData.performance.sharpeRatio = this.calculateSharpeRatio(returns);
                currentData.performance.maxDrawdown = this.calculateMaxDrawdown(returns);
            }

            // Risk analysis
            currentData.riskAnalysis = {
                overallRisk: this.calculateOverallRisk(currentData.tokens),
                volatilityAlert: this.getVolatilityAlert(currentData.tokens),
                concentrationRisk: this.calculateConcentrationRisk(currentData.tokens),
                liquidityRisk: this.calculateLiquidityRisk(currentData.tokens),
                marketRisk: currentData.marketTrend,
                recommendations: this.generateRecommendations(currentData.tokens)
            };

            return currentData;
        } catch (error) {
            console.error('Error getting current analytics:', error);
            return null;
        }
    }

    // Calculate volatility
    calculateVolatility(returns) {
        if (returns.length < 2) return 0;
        const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
        const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (returns.length - 1);
        return Math.sqrt(variance);
    }

    // Calculate Sharpe ratio
    calculateSharpeRatio(returns) {
        if (returns.length < 2) return 0;
        const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
        const volatility = this.calculateVolatility(returns);
        return volatility > 0 ? mean / volatility : 0;
    }

    // Calculate max drawdown
    calculateMaxDrawdown(returns) {
        let maxDrawdown = 0;
        let peak = 0;
        let runningTotal = 0;

        for (const ret of returns) {
            runningTotal += ret;
            if (runningTotal > peak) {
                peak = runningTotal;
            }
            const drawdown = peak - runningTotal;
            if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
            }
        }

        return -maxDrawdown;
    }

    // Calculate overall risk
    calculateOverallRisk(tokens) {
        const volatilities = Object.values(tokens).map(t => t.riskMetrics?.volatility || 0);
        const avgVolatility = volatilities.reduce((a, b) => a + b, 0) / volatilities.length;
        
        if (avgVolatility > 1.0) return "high";
        if (avgVolatility > 0.6) return "moderate";
        return "low";
    }

    // Get volatility alert
    getVolatilityAlert(tokens) {
        const highVolTokens = Object.entries(tokens)
            .filter(([symbol, data]) => (data.riskMetrics?.volatility || 0) > 1.0)
            .map(([symbol]) => symbol);
        
        if (highVolTokens.length > 0) {
            return `High volatility detected in ${highVolTokens.join(', ')}`;
        }
        return "Normal volatility levels";
    }

    // Calculate concentration risk
    calculateConcentrationRisk(tokens) {
        const marketCaps = Object.values(tokens).map(t => t.marketCap || 0);
        const totalCap = marketCaps.reduce((a, b) => a + b, 0);
        const maxCap = Math.max(...marketCaps);
        
        const concentration = totalCap > 0 ? maxCap / totalCap : 0;
        
        if (concentration > 0.7) return "High - concentrated holdings";
        if (concentration > 0.4) return "Medium - moderate concentration";
        return "Low - well distributed";
    }

    // Calculate liquidity risk
    calculateLiquidityRisk(tokens) {
        const volumes = Object.values(tokens).map(t => t.volume24h || 0);
        const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
        
        if (avgVolume > 1e9) return "Low - high liquidity";
        if (avgVolume > 1e6) return "Medium - adequate liquidity";
        return "High - low liquidity";
    }

    // Generate recommendations
    generateRecommendations(tokens) {
        const recommendations = [];
        
        Object.entries(tokens).forEach(([symbol, data]) => {
            const volatility = data.riskMetrics?.volatility || 0;
            const change = data.priceChange24h || 0;
            
            if (volatility > 1.2) {
                recommendations.push(`Consider reducing exposure to ${symbol} due to high volatility`);
            } else if (change > 10) {
                recommendations.push(`${symbol} shows strong momentum - monitor for continuation`);
            } else if (change < -10) {
                recommendations.push(`${symbol} experiencing significant decline - assess fundamentals`);
            }
        });
        
        if (recommendations.length === 0) {
            recommendations.push("Market conditions are stable - maintain current positions");
        }
        
        return recommendations;
    }
}

module.exports = AnalyticsEngine; 