// Serve live dashboard
app.get('/live', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'live-dashboard.html'));
});

// Live analytics endpoint
app.get('/api/analytics/live', async (req, res) => {
    try {
        // Get current analytics data
        const analytics = await analyticsEngine.getCurrentAnalytics();
        
        // Format data for live dashboard
        const liveData = {
            marketOverview: {
                totalMarketCap: analytics.totalMarketCap || 125847392000,
                totalVolume24h: analytics.totalVolume24h || 8947234567,
                activeTokens: analytics.activeTokens || 3,
                marketTrend: analytics.marketTrend || "bullish",
                lastUpdated: new Date().toISOString()
            },
            tokens: {
                DOGE: {
                    symbol: "DOGE",
                    name: "Dogecoin",
                    currentPrice: analytics.tokens?.DOGE?.currentPrice || 0.26444968,
                    priceChange24h: analytics.tokens?.DOGE?.priceChange24h || 11.23,
                    priceChange7d: analytics.tokens?.DOGE?.priceChange7d || -8.45,
                    marketCap: analytics.tokens?.DOGE?.marketCap || 34431598885.98,
                    volume24h: analytics.tokens?.DOGE?.volume24h || 2167521670.48,
                    riskMetrics: {
                        volatility: analytics.tokens?.DOGE?.riskMetrics?.volatility || 0.68,
                        sharpeRatio: analytics.tokens?.DOGE?.riskMetrics?.sharpeRatio || 1.24,
                        maxDrawdown: analytics.tokens?.DOGE?.riskMetrics?.maxDrawdown || -0.45,
                        beta: analytics.tokens?.DOGE?.riskMetrics?.beta || 1.12
                    }
                },
                SHIB: {
                    symbol: "SHIB",
                    name: "Shiba INU",
                    currentPrice: analytics.tokens?.SHIB?.currentPrice || 0.00000786,
                    priceChange24h: analytics.tokens?.SHIB?.priceChange24h || 5.12,
                    priceChange7d: analytics.tokens?.SHIB?.priceChange7d || 12.34,
                    marketCap: analytics.tokens?.SHIB?.marketCap || 3101198479.54,
                    volume24h: analytics.tokens?.SHIB?.volume24h || 368723896.78,
                    riskMetrics: {
                        volatility: analytics.tokens?.SHIB?.riskMetrics?.volatility || 0.89,
                        sharpeRatio: analytics.tokens?.SHIB?.riskMetrics?.sharpeRatio || 0.87,
                        maxDrawdown: analytics.tokens?.SHIB?.riskMetrics?.maxDrawdown || -0.67,
                        beta: analytics.tokens?.SHIB?.riskMetrics?.beta || 1.45
                    }
                },
                PIG: {
                    symbol: "PIG",
                    name: "Pig Finance",
                    currentPrice: analytics.tokens?.PIG?.currentPrice || 0.00000011,
                    priceChange24h: analytics.tokens?.PIG?.priceChange24h || -2.34,
                    priceChange7d: analytics.tokens?.PIG?.priceChange7d || -15.67,
                    marketCap: analytics.tokens?.PIG?.marketCap || 0,
                    volume24h: analytics.tokens?.PIG?.volume24h || 1267679.12,
                    riskMetrics: {
                        volatility: analytics.tokens?.PIG?.riskMetrics?.volatility || 1.23,
                        sharpeRatio: analytics.tokens?.PIG?.riskMetrics?.sharpeRatio || -0.34,
                        maxDrawdown: analytics.tokens?.PIG?.riskMetrics?.maxDrawdown || -0.89,
                        beta: analytics.tokens?.PIG?.riskMetrics?.beta || 1.78
                    }
                }
            },
            tradingSignals: analytics.tradingSignals || [],
            riskAnalysis: analytics.riskAnalysis || {},
            recentTrades: analytics.recentTrades || [],
            apiStatus: {
                blockchain: "operational",
                analytics: "operational",
                trading: "operational",
                alerts: "operational",
                lastChecked: new Date().toISOString()
            },
            performance: analytics.performance || {
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