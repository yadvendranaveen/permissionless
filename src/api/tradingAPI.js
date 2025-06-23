const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Trading Analytics
 *     description: API for trading analytics and signals
 *   - name: Demo
 *     description: Demo data endpoints for presentation
 */

/**
 * @swagger
 * /api/tokens:
 *   get:
 *     summary: Get all active tokens
 *     tags: [Trading Analytics]
 *     responses:
 *       200:
 *         description: List of active tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       address:
 *                         type: string
 *                         example: 0x6982508145454Ce325dDbE47a25d4ec3d2311933
 *                       symbol:
 *                         type: string
 *                         example: PEPE
 *                       name:
 *                         type: string
 *                         example: Pepe
 *                       price:
 *                         type: number
 *                         example: 0.00000123
 *                       supply:
 *                         type: number
 *                         example: 1000000000000
 *                       decimals:
 *                         type: integer
 *                         example: 18
 *                 timestamp:
 *                   type: string
 *                   example: 2024-06-23T12:00:00.000Z
 */

/**
 * @swagger
 * /api/analysis/{tokenAddress}:
 *   get:
 *     summary: Get latest analysis for a specific token
 *     tags: [Trading Analytics]
 *     parameters:
 *       - in: path
 *         name: tokenAddress
 *         schema:
 *           type: string
 *         required: true
 *         description: Token contract address
 *     responses:
 *       200:
 *         description: Latest analysis for the token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                 timestamp:
 *                   type: string
 *       404:
 *         description: Analysis not found for this token
 *
 * /api/analysis/{tokenAddress}/history:
 *   get:
 *     summary: Get analysis history for a token
 *     tags: [Trading Analytics]
 *     parameters:
 *       - in: path
 *         name: tokenAddress
 *         schema:
 *           type: string
 *         required: true
 *         description: Token contract address
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of history records to return
 *     responses:
 *       200:
 *         description: Analysis history for the token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                 count:
 *                   type: integer
 *                 timestamp:
 *                   type: string
 *
 * /api/signals/{tokenAddress}:
 *   get:
 *     summary: Get trading signals for a token
 *     tags: [Trading Analytics]
 *     parameters:
 *       - in: path
 *         name: tokenAddress
 *         schema:
 *           type: string
 *         required: true
 *         description: Token contract address
 *     responses:
 *       200:
 *         description: Trading signals for the token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                 timestamp:
 *                   type: string
 *       404:
 *         description: No signals available for this token
 *
 * /api/signals:
 *   get:
 *     summary: Get trading signals for all tokens
 *     tags: [Trading Analytics]
 *     responses:
 *       200:
 *         description: Trading signals for all tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                 count:
 *                   type: integer
 *                 timestamp:
 *                   type: string
 *
 * /api/market/overview:
 *   get:
 *     summary: Get market overview
 *     tags: [Trading Analytics]
 *     responses:
 *       200:
 *         description: Market overview
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                 timestamp:
 *                   type: string
 *
 * /api/market/top-performers:
 *   get:
 *     summary: Get top performing tokens by metric
 *     tags: [Trading Analytics]
 *     parameters:
 *       - in: query
 *         name: metric
 *         schema:
 *           type: string
 *         required: false
 *         description: Metric to sort by (e.g. volume24h, marketCap)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of top performers to return
 *     responses:
 *       200:
 *         description: Top performing tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                 metric:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *
 * /api/risk/{tokenAddress}:
 *   get:
 *     summary: Get risk analysis for a token
 *     tags: [Trading Analytics]
 *     parameters:
 *       - in: path
 *         name: tokenAddress
 *         schema:
 *           type: string
 *         required: true
 *         description: Token contract address
 *     responses:
 *       200:
 *         description: Risk analysis for the token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                 timestamp:
 *                   type: string
 *       404:
 *         description: Risk analysis not available for this token
 *
 * /api/status:
 *   get:
 *     summary: Get API status and metrics
 *     tags: [Trading Analytics]
 *     responses:
 *       200:
 *         description: API status and metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *
 * /api/analyze:
 *   post:
 *     summary: Run analytics for all tokens on demand
 *     tags: [Trading Analytics]
 *     responses:
 *       200:
 *         description: Analytics performed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *
 * /api/analyze/{tokenAddress}:
 *   post:
 *     summary: Run analytics for a specific token on demand
 *     tags: [Trading Analytics]
 *     parameters:
 *       - in: path
 *         name: tokenAddress
 *         schema:
 *           type: string
 *         required: true
 *         description: Token contract address
 *     responses:
 *       200:
 *         description: Analytics performed successfully for the token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 */

module.exports = function(analyticsEngine) {
  
  // Get all active tokens
  router.get('/tokens', async (req, res) => {
    try {
      const tokens = await analyticsEngine.getActiveTokens();
      res.json({
        success: true,
        data: tokens,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Get latest analysis for a specific token
  router.get('/analysis/:tokenAddress', async (req, res) => {
    try {
      const { tokenAddress } = req.params;
      const analysis = await analyticsEngine.getLatestAnalysis(tokenAddress);
      
      if (!analysis) {
        return res.status(404).json({
          success: false,
          error: 'Analysis not found for this token'
        });
      }

      res.json({
        success: true,
        data: analysis,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Get analysis history for a token
  router.get('/analysis/:tokenAddress/history', async (req, res) => {
    try {
      const { tokenAddress } = req.params;
      const { limit = 100 } = req.query;
      
      const history = await analyticsEngine.getAnalysisHistory(tokenAddress, parseInt(limit));
      
      res.json({
        success: true,
        data: history,
        count: history.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Get trading signals for a token
  router.get('/signals/:tokenAddress', async (req, res) => {
    try {
      const { tokenAddress } = req.params;
      const analysis = await analyticsEngine.getLatestAnalysis(tokenAddress);
      
      if (!analysis) {
        return res.status(404).json({
          success: false,
          error: 'No signals available for this token'
        });
      }

      const signals = {
        tokenAddress,
        recommendation: analysis.signals.recommendation,
        confidence: analysis.signals.confidence,
        reasoning: analysis.signals.reasoning,
        timestamp: analysis.timestamp,
        metrics: {
          marketCap: analysis.metrics.marketCap,
          volatility: analysis.metrics.volatility,
          concentrationRatio: analysis.metrics.concentrationRatio,
          paperhandRatio: analysis.metrics.paperhandRatio,
          volume24h: analysis.metrics.volume24h
        }
      };

      res.json({
        success: true,
        data: signals,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Get all trading signals
  router.get('/signals', async (req, res) => {
    try {
      const tokens = await analyticsEngine.getActiveTokens();
      const allSignals = [];

      for (const token of tokens) {
        const analysis = await analyticsEngine.getLatestAnalysis(token.address);
        if (analysis) {
          allSignals.push({
            tokenAddress: token.address,
            symbol: token.symbol,
            recommendation: analysis.signals.recommendation,
            confidence: analysis.signals.confidence,
            timestamp: analysis.timestamp
          });
        }
      }

      res.json({
        success: true,
        data: allSignals,
        count: allSignals.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Get market overview
  router.get('/market/overview', async (req, res) => {
    try {
      const tokens = await analyticsEngine.getActiveTokens();
      const overview = {
        totalTokens: tokens.length,
        totalMarketCap: 0,
        averageVolatility: 0,
        bullishTokens: 0,
        bearishTokens: 0,
        neutralTokens: 0,
        timestamp: new Date().toISOString()
      };

      let totalVolatility = 0;
      let analyzedTokens = 0;

      for (const token of tokens) {
        const analysis = await analyticsEngine.getLatestAnalysis(token.address);
        if (analysis) {
          overview.totalMarketCap += analysis.metrics.marketCap;
          totalVolatility += analysis.metrics.volatility;
          analyzedTokens++;

          if (analysis.signals.recommendation === 'BUY') {
            overview.bullishTokens++;
          } else if (analysis.signals.recommendation === 'SELL') {
            overview.bearishTokens++;
          } else {
            overview.neutralTokens++;
          }
        }
      }

      if (analyzedTokens > 0) {
        overview.averageVolatility = totalVolatility / analyzedTokens;
      }

      res.json({
        success: true,
        data: overview,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Get top performers (by volume or market cap)
  router.get('/market/top-performers', async (req, res) => {
    try {
      const { metric = 'volume24h', limit = 10 } = req.query;
      const tokens = await analyticsEngine.getActiveTokens();
      const performers = [];

      for (const token of tokens) {
        const analysis = await analyticsEngine.getLatestAnalysis(token.address);
        if (analysis) {
          performers.push({
            tokenAddress: token.address,
            symbol: token.symbol,
            price: analysis.metrics.price,
            marketCap: analysis.metrics.marketCap,
            volume24h: analysis.metrics.volume24h,
            volatility: analysis.metrics.volatility,
            recommendation: analysis.signals.recommendation,
            confidence: analysis.signals.confidence
          });
        }
      }

      // Sort by the specified metric
      performers.sort((a, b) => b[metric] - a[metric]);
      
      res.json({
        success: true,
        data: performers.slice(0, parseInt(limit)),
        metric,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Get risk analysis for a token
  router.get('/risk/:tokenAddress', async (req, res) => {
    try {
      const { tokenAddress } = req.params;
      const analysis = await analyticsEngine.getLatestAnalysis(tokenAddress);
      
      if (!analysis) {
        return res.status(404).json({
          success: false,
          error: 'Risk analysis not available for this token'
        });
      }

      const riskAnalysis = {
        tokenAddress,
        riskScore: 0,
        riskFactors: [],
        riskLevel: 'LOW',
        timestamp: analysis.timestamp
      };

      // Calculate risk score based on various factors
      let riskScore = 0;

      // Volatility risk (0-30 points)
      if (analysis.metrics.volatility > 0.8) {
        riskScore += 30;
        riskAnalysis.riskFactors.push('Extreme volatility');
      } else if (analysis.metrics.volatility > 0.5) {
        riskScore += 20;
        riskAnalysis.riskFactors.push('High volatility');
      } else if (analysis.metrics.volatility > 0.3) {
        riskScore += 10;
        riskAnalysis.riskFactors.push('Moderate volatility');
      }

      // Concentration risk (0-25 points)
      if (analysis.metrics.concentrationRatio > 0.9) {
        riskScore += 25;
        riskAnalysis.riskFactors.push('Extreme concentration');
      } else if (analysis.metrics.concentrationRatio > 0.7) {
        riskScore += 15;
        riskAnalysis.riskFactors.push('High concentration');
      } else if (analysis.metrics.concentrationRatio > 0.5) {
        riskScore += 10;
        riskAnalysis.riskFactors.push('Moderate concentration');
      }

      // Paperhand risk (0-20 points)
      if (analysis.metrics.paperhandRatio > 0.8) {
        riskScore += 20;
        riskAnalysis.riskFactors.push('Very high paperhand ratio');
      } else if (analysis.metrics.paperhandRatio > 0.6) {
        riskScore += 15;
        riskAnalysis.riskFactors.push('High paperhand ratio');
      } else if (analysis.metrics.paperhandRatio > 0.4) {
        riskScore += 10;
        riskAnalysis.riskFactors.push('Moderate paperhand ratio');
      }

      // Volume risk (0-15 points)
      if (analysis.metrics.volume24h < analysis.metrics.marketCap * 0.01) {
        riskScore += 15;
        riskAnalysis.riskFactors.push('Very low volume');
      } else if (analysis.metrics.volume24h < analysis.metrics.marketCap * 0.05) {
        riskScore += 10;
        riskAnalysis.riskFactors.push('Low volume');
      }

      // Technical indicator risk (0-10 points)
      if (analysis.metrics.technicalIndicators.rsi > 80 || analysis.metrics.technicalIndicators.rsi < 20) {
        riskScore += 10;
        riskAnalysis.riskFactors.push('Extreme RSI levels');
      }

      riskAnalysis.riskScore = Math.min(riskScore, 100);

      // Determine risk level
      if (riskScore >= 70) {
        riskAnalysis.riskLevel = 'EXTREME';
      } else if (riskScore >= 50) {
        riskAnalysis.riskLevel = 'HIGH';
      } else if (riskScore >= 30) {
        riskAnalysis.riskLevel = 'MEDIUM';
      } else {
        riskAnalysis.riskLevel = 'LOW';
      }

      res.json({
        success: true,
        data: riskAnalysis,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Get API status and metrics
  router.get('/status', async (req, res) => {
    try {
      const tokens = await analyticsEngine.getActiveTokens();
      const status = {
        service: 'AutoTrading Analytics API',
        version: '1.0.0',
        status: 'operational',
        uptime: process.uptime(),
        activeTokens: tokens.length,
        lastAnalysis: new Date().toISOString(),
        endpoints: {
          tokens: '/api/tokens',
          analysis: '/api/analysis/:tokenAddress',
          signals: '/api/signals',
          market: '/api/market/overview',
          risk: '/api/risk/:tokenAddress'
        },
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Run analytics for all tokens on demand
  router.post('/analyze', async (req, res) => {
    try {
      await analyticsEngine.performAnalysis();
      res.json({ success: true, message: 'Analytics performed for all tokens.' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Run analytics for a specific token on demand
  router.post('/analyze/:tokenAddress', async (req, res) => {
    try {
      const { tokenAddress } = req.params;
      const analysis = await analyticsEngine.analyzeToken(tokenAddress);
      res.json({ success: true, data: analysis, message: 'Analytics performed for token.' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Demo data endpoints
  const DemoDataService = require('../services/demoDataService');
  const demoDataService = new DemoDataService();

  /**
   * @swagger
   * /api/demo/data:
   *   get:
   *     summary: Get demo data for presentation
   *     tags: [Demo]
   *     responses:
   *       200:
   *         description: Demo data for all tokens and analytics
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     tokens:
   *                       type: array
   *                     marketOverview:
   *                       type: object
   *                     tradingSignals:
   *                       type: array
   *                     riskAnalysis:
   *                       type: array
   *                 timestamp:
   *                   type: string
   */
  router.get('/demo/data', async (req, res) => {
    try {
      const demoData = {
        tokens: demoDataService.getTokens(),
        marketOverview: demoDataService.getMarketOverview(),
        tradingSignals: demoDataService.getTradingSignals(),
        riskAnalysis: demoDataService.getRiskAnalysis()
      };
      
      res.json({
        success: true,
        data: demoData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * @swagger
   * /api/demo/analyze:
   *   post:
   *     summary: Run demo analysis for all tokens
   *     tags: [Demo]
   *     responses:
   *       200:
   *         description: Demo analysis completed
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 timestamp:
   *                   type: string
   */
  router.post('/demo/analyze', async (req, res) => {
    try {
      const result = await demoDataService.performAnalysis();
      res.json({
        success: true,
        message: 'Demo analysis completed successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * @swagger
   * /api/demo/analyze/{tokenAddress}:
   *   post:
   *     summary: Run demo analysis for a specific token
   *     tags: [Demo]
   *     parameters:
   *       - in: path
   *         name: tokenAddress
   *         schema:
   *           type: string
   *         required: true
   *         description: Token contract address
   *     responses:
   *       200:
   *         description: Demo analysis for the token
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                 message:
   *                   type: string
   *                 timestamp:
   *                   type: string
   */
  router.post('/demo/analyze/:tokenAddress', async (req, res) => {
    try {
      const { tokenAddress } = req.params;
      const analysis = await demoDataService.analyzeToken(tokenAddress);
      res.json({
        success: true,
        data: analysis,
        message: 'Demo analysis completed for token',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  return router;
}; 