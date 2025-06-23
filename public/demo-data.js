// Static Demo Data for Memecoin Trading Analytics Dashboard
// Based on real historical data from Dogecoin, Shiba INU, and Pig Finance

const DEMO_DATA = {
  // Current market overview
  marketOverview: {
    totalMarketCap: 125847392000,
    totalVolume24h: 8947234567,
    activeTokens: 3,
    marketTrend: "bullish",
    lastUpdated: "2024-01-15T10:30:00Z"
  },

  // Token data based on real historical data
  tokens: {
    DOGE: {
      symbol: "DOGE",
      name: "Dogecoin",
      currentPrice: 0.26444968,
      priceChange24h: 11.23,
      priceChange7d: -8.45,
      marketCap: 34431598885.98,
      volume24h: 2167521670.48,
      circulatingSupply: 130000000000,
      maxSupply: null,
      allTimeHigh: 0.7375666,
      allTimeLow: 0.00008690,
      priceHistory: [
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
      tradingSignals: {
        current: "BUY",
        confidence: 0.75,
        reasoning: "Strong volume increase and positive momentum indicators",
        lastUpdated: "2024-01-15T10:30:00Z"
      },
      riskMetrics: {
        volatility: 0.68,
        sharpeRatio: 1.24,
        maxDrawdown: -0.45,
        beta: 1.12
      },
      holderAnalysis: {
        totalHolders: 4567890,
        top10Holders: 23.4,
        top50Holders: 45.6,
        averageHoldingTime: 45
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
      circulatingSupply: 394796000000000,
      maxSupply: 1000000000000000,
      allTimeHigh: 0.00008616,
      allTimeLow: 0.0000000000000001,
      priceHistory: [
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
      tradingSignals: {
        current: "HOLD",
        confidence: 0.45,
        reasoning: "Mixed signals with moderate volatility",
        lastUpdated: "2024-01-15T10:30:00Z"
      },
      riskMetrics: {
        volatility: 0.89,
        sharpeRatio: 0.87,
        maxDrawdown: -0.67,
        beta: 1.45
      },
      holderAnalysis: {
        totalHolders: 1234567,
        top10Holders: 18.9,
        top50Holders: 38.7,
        averageHoldingTime: 28
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
      circulatingSupply: 1000000000000000,
      maxSupply: 1000000000000000,
      allTimeHigh: 0.00000551,
      allTimeLow: 0.0000000000000001,
      priceHistory: [
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
      ],
      tradingSignals: {
        current: "SELL",
        confidence: 0.82,
        reasoning: "Declining volume and negative price momentum",
        lastUpdated: "2024-01-15T10:30:00Z"
      },
      riskMetrics: {
        volatility: 1.23,
        sharpeRatio: -0.34,
        maxDrawdown: -0.89,
        beta: 1.78
      },
      holderAnalysis: {
        totalHolders: 89012,
        top10Holders: 67.8,
        top50Holders: 89.2,
        averageHoldingTime: 12
      }
    }
  },

  // Trading signals summary
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

  // Risk analysis
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

  // Recent trades (simulated)
  recentTrades: [
    {
      token: "DOGE",
      type: "buy",
      amount: 50000,
      price: 0.26444968,
      timestamp: "2024-01-15T10:25:00Z",
      txHash: "0x1234...5678"
    },
    {
      token: "SHIB",
      type: "sell",
      amount: 1000000000,
      price: 0.00000786,
      timestamp: "2024-01-15T10:20:00Z",
      txHash: "0x8765...4321"
    },
    {
      token: "PIG",
      type: "sell",
      amount: 5000000000000,
      price: 0.00000011,
      timestamp: "2024-01-15T10:15:00Z",
      txHash: "0xabcd...efgh"
    },
    {
      token: "DOGE",
      type: "buy",
      amount: 25000,
      price: 0.26444968,
      timestamp: "2024-01-15T10:10:00Z",
      txHash: "0x9876...5432"
    },
    {
      token: "SHIB",
      type: "buy",
      amount: 500000000,
      price: 0.00000786,
      timestamp: "2024-01-15T10:05:00Z",
      txHash: "0xdcba...hgfe"
    }
  ],

  // API status (simulated)
  apiStatus: {
    blockchain: "operational",
    analytics: "operational",
    trading: "operational",
    alerts: "operational",
    lastChecked: "2024-01-15T10:30:00Z"
  },

  // Performance metrics
  performance: {
    totalReturn: 23.45,
    sharpeRatio: 1.67,
    maxDrawdown: -12.34,
    volatility: 0.45,
    beta: 1.12,
    alpha: 0.08
  }
};

// Export for use in dashboard
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DEMO_DATA;
} else {
  window.DEMO_DATA = DEMO_DATA;
} 