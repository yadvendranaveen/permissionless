const { v4: uuidv4 } = require('uuid');

class DemoDataService {
    constructor() {
        this.demoData = this.generateDemoData();
    }

    generateDemoData() {
        const now = new Date();
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        
        // Generate realistic historical data for PEPE, SHIB, DAI
        const tokens = [
            {
                address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
                symbol: 'PEPE',
                name: 'Pepe',
                decimals: 18,
                price: 0.00000123,
                supply: 420690000000000,
                historicalData: this.generateHistoricalData('PEPE', 0.00000123, oneYearAgo, now)
            },
            {
                address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
                symbol: 'SHIB',
                name: 'Shiba Inu',
                decimals: 18,
                price: 0.00002456,
                supply: 549000000000000,
                historicalData: this.generateHistoricalData('SHIB', 0.00002456, oneYearAgo, now)
            },
            {
                address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
                symbol: 'DAI',
                name: 'Dai Stablecoin',
                decimals: 18,
                price: 1.0001,
                supply: 5000000000,
                historicalData: this.generateHistoricalData('DAI', 1.0001, oneYearAgo, now)
            }
        ];

        return {
            tokens,
            marketOverview: this.generateMarketOverview(tokens),
            tradingSignals: this.generateTradingSignals(tokens),
            riskAnalysis: this.generateRiskAnalysis(tokens),
            analysisHistory: this.generateAnalysisHistory(tokens, oneYearAgo, now)
        };
    }

    generateHistoricalData(symbol, currentPrice, startDate, endDate) {
        const data = [];
        const days = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));
        
        let basePrice = currentPrice;
        if (symbol === 'PEPE') basePrice = 0.0000008;
        if (symbol === 'SHIB') basePrice = 0.000015;
        if (symbol === 'DAI') basePrice = 0.98;

        for (let i = 0; i <= days; i++) {
            const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
            
            // Generate realistic price movements
            const volatility = symbol === 'DAI' ? 0.001 : 0.15;
            const change = (Math.random() - 0.5) * volatility;
            basePrice = basePrice * (1 + change);
            
            // Ensure DAI stays close to $1
            if (symbol === 'DAI') {
                basePrice = Math.max(0.98, Math.min(1.02, basePrice));
            }
            
            // Generate volume data
            const volume = this.generateVolume(symbol, basePrice);
            
            data.push({
                date: date.toISOString(),
                price: basePrice,
                volume: volume,
                marketCap: basePrice * this.getSupply(symbol),
                volatility: Math.abs(change) * 100
            });
        }
        
        return data;
    }

    generateVolume(symbol, price) {
        const baseVolume = {
            'PEPE': 5000000,
            'SHIB': 8000000,
            'DAI': 20000000
        };
        
        const randomFactor = 0.5 + Math.random();
        return baseVolume[symbol] * randomFactor * price;
    }

    getSupply(symbol) {
        const supplies = {
            'PEPE': 420690000000000,
            'SHIB': 549000000000000,
            'DAI': 5000000000
        };
        return supplies[symbol];
    }

    generateMarketOverview(tokens) {
        const totalMarketCap = tokens.reduce((sum, token) => sum + (token.price * token.supply), 0);
        const avgVolatility = tokens.reduce((sum, token) => {
            const recentData = token.historicalData.slice(-30);
            const volatility = recentData.reduce((v, d) => v + d.volatility, 0) / recentData.length;
            return sum + volatility;
        }, 0) / tokens.length;

        return {
            totalMarketCap,
            averageVolatility: avgVolatility / 100,
            bullishTokens: 2,
            bearishTokens: 1,
            neutralTokens: 0,
            timestamp: new Date().toISOString()
        };
    }

    generateTradingSignals(tokens) {
        return tokens.map(token => {
            const recentData = token.historicalData.slice(-7);
            const priceChange = (recentData[recentData.length - 1].price - recentData[0].price) / recentData[0].price;
            
            let recommendation = 'HOLD';
            let confidence = 0.5;
            
            if (priceChange > 0.1) {
                recommendation = 'BUY';
                confidence = 0.7 + Math.random() * 0.2;
            } else if (priceChange < -0.1) {
                recommendation = 'SELL';
                confidence = 0.6 + Math.random() * 0.3;
            }
            
            const reasoning = this.generateReasoning(token.symbol, recommendation, priceChange);
            
            return {
                tokenAddress: token.address,
                symbol: token.symbol,
                recommendation,
                confidence,
                reasoning,
                timestamp: new Date().toISOString(),
                metrics: {
                    marketCap: token.price * token.supply,
                    volatility: recentData.reduce((v, d) => v + d.volatility, 0) / recentData.length / 100,
                    volume24h: recentData[recentData.length - 1].volume * 24,
                    concentrationRatio: 0.3 + Math.random() * 0.4,
                    paperhandRatio: 0.1 + Math.random() * 0.3
                }
            };
        });
    }

    generateReasoning(symbol, recommendation, priceChange) {
        const reasons = {
            'PEPE': {
                'BUY': 'Strong community sentiment and increasing social media activity. Recent partnerships and meme culture resurgence driving demand.',
                'SELL': 'High volatility and potential market correction. Consider taking profits after recent pump.',
                'HOLD': 'Stable trading pattern with moderate volatility. Monitor for breakout opportunities.'
            },
            'SHIB': {
                'BUY': 'Ecosystem expansion with new developments. Growing adoption and community engagement.',
                'SELL': 'Technical indicators showing overbought conditions. Risk of correction.',
                'HOLD': 'Consolidation phase with balanced risk/reward. Wait for clearer direction.'
            },
            'DAI': {
                'BUY': 'Stablecoin maintaining peg with slight premium. Good for risk management.',
                'SELL': 'Minimal upside potential as stablecoin. Consider higher-yield alternatives.',
                'HOLD': 'Stable value preservation. Ideal for portfolio stability.'
            }
        };
        
        return reasons[symbol][recommendation] || 'Analysis based on technical indicators and market sentiment.';
    }

    generateRiskAnalysis(tokens) {
        return tokens.map(token => {
            const recentData = token.historicalData.slice(-30);
            const volatility = recentData.reduce((v, d) => v + d.volatility, 0) / recentData.length;
            
            let riskScore = 0;
            let riskLevel = 'LOW';
            const riskFactors = [];
            
            // Volatility risk
            if (volatility > 50) {
                riskScore += 30;
                riskFactors.push('High volatility');
            } else if (volatility > 20) {
                riskScore += 15;
                riskFactors.push('Moderate volatility');
            }
            
            // Concentration risk (mock data)
            const concentrationRatio = 0.3 + Math.random() * 0.4;
            if (concentrationRatio > 0.7) {
                riskScore += 25;
                riskFactors.push('High whale concentration');
            } else if (concentrationRatio > 0.5) {
                riskScore += 15;
                riskFactors.push('Moderate concentration');
            }
            
            // Market cap risk
            const marketCap = token.price * token.supply;
            if (marketCap < 10000000) {
                riskScore += 20;
                riskFactors.push('Low market cap');
            }
            
            if (riskScore > 50) riskLevel = 'HIGH';
            else if (riskScore > 25) riskLevel = 'MEDIUM';
            
            return {
                tokenAddress: token.address,
                symbol: token.symbol,
                riskScore,
                riskLevel,
                riskFactors,
                volatility: volatility / 100,
                concentrationRatio,
                marketCap,
                timestamp: new Date().toISOString()
            };
        });
    }

    generateAnalysisHistory(tokens, startDate, endDate) {
        const history = [];
        const days = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));
        
        for (let i = 0; i < Math.min(days, 100); i++) {
            const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
            
            tokens.forEach(token => {
                const historicalData = token.historicalData[i];
                if (historicalData) {
                    history.push({
                        analysisId: uuidv4(),
                        tokenAddress: token.address,
                        symbol: token.symbol,
                        timestamp: date.toISOString(),
                        metrics: {
                            price: historicalData.price,
                            volume: historicalData.volume,
                            marketCap: historicalData.marketCap,
                            volatility: historicalData.volatility / 100
                        },
                        signals: {
                            recommendation: ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)],
                            confidence: 0.5 + Math.random() * 0.4,
                            reasoning: 'Historical analysis data'
                        }
                    });
                }
            });
        }
        
        return history;
    }

    getTokens() {
        return this.demoData.tokens;
    }

    getMarketOverview() {
        return this.demoData.marketOverview;
    }

    getTradingSignals() {
        return this.demoData.tradingSignals;
    }

    getRiskAnalysis() {
        return this.demoData.riskAnalysis;
    }

    getAnalysisHistory(tokenAddress, limit = 100) {
        return this.demoData.analysisHistory
            .filter(analysis => analysis.tokenAddress.toLowerCase() === tokenAddress.toLowerCase())
            .slice(-limit);
    }

    getLatestAnalysis(tokenAddress) {
        const history = this.getAnalysisHistory(tokenAddress, 1);
        return history.length > 0 ? history[0] : null;
    }

    async analyzeToken(tokenAddress) {
        const token = this.demoData.tokens.find(t => t.address.toLowerCase() === tokenAddress.toLowerCase());
        if (!token) throw new Error('Token not found');
        
        const signal = this.demoData.tradingSignals.find(s => s.tokenAddress.toLowerCase() === tokenAddress.toLowerCase());
        const risk = this.demoData.riskAnalysis.find(r => r.tokenAddress.toLowerCase() === tokenAddress.toLowerCase());
        
        return {
            tokenAddress: token.address,
            symbol: token.symbol,
            timestamp: new Date().toISOString(),
            metrics: {
                price: token.price,
                supply: token.supply,
                marketCap: token.price * token.supply,
                volatility: risk?.volatility || 0.1,
                volume24h: token.historicalData[token.historicalData.length - 1]?.volume * 24 || 0,
                concentrationRatio: risk?.concentrationRatio || 0.3,
                paperhandRatio: 0.1 + Math.random() * 0.2
            },
            signals: {
                recommendation: signal?.recommendation || 'HOLD',
                confidence: signal?.confidence || 0.5,
                reasoning: signal?.reasoning || 'Demo analysis'
            },
            analysisId: uuidv4()
        };
    }

    async performAnalysis() {
        // Simulate analysis delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            success: true,
            message: 'Demo analysis completed successfully',
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = DemoDataService; 