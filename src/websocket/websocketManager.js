const { v4: uuidv4 } = require('uuid');

class WebSocketManager {
  constructor() {
    this.wss = null;
    this.clients = new Map();
    this.analyticsEngine = null;
    this.broadcastInterval = null;
    this.running = false;
  }

  initialize(wss, analyticsEngine) {
    this.wss = wss;
    this.analyticsEngine = analyticsEngine;
    this.running = true;

    this.wss.on('connection', (ws, req) => {
      this.handleConnection(ws, req);
    });

    this.startBroadcasting();
    console.log('🔌 WebSocket Manager initialized');
  }

  handleConnection(ws, req) {
    const clientId = uuidv4();
    const clientInfo = {
      id: clientId,
      ws,
      connectedAt: new Date().toISOString(),
      subscriptions: new Set(),
      lastPing: Date.now()
    };

    this.clients.set(clientId, clientInfo);

    console.log(`🔗 WebSocket client connected: ${clientId}`);

    // Send welcome message
    this.sendToClient(clientId, {
      type: 'welcome',
      clientId,
      message: 'Connected to AutoTrading Analytics WebSocket',
      timestamp: new Date().toISOString()
    });

    // Handle incoming messages
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        this.handleMessage(clientId, message);
      } catch (error) {
        console.error('❌ Invalid WebSocket message:', error);
        this.sendToClient(clientId, {
          type: 'error',
          error: 'Invalid message format',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Handle client disconnect
    ws.on('close', () => {
      this.handleDisconnect(clientId);
    });

    // Handle ping/pong for connection health
    ws.on('pong', () => {
      const client = this.clients.get(clientId);
      if (client) {
        client.lastPing = Date.now();
      }
    });

    // Set up ping interval
    const pingInterval = setInterval(() => {
      if (this.clients.has(clientId)) {
        ws.ping();
      } else {
        clearInterval(pingInterval);
      }
    }, 30000); // Ping every 30 seconds
  }

  handleMessage(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (message.type) {
      case 'subscribe':
        this.handleSubscribe(clientId, message);
        break;
      case 'unsubscribe':
        this.handleUnsubscribe(clientId, message);
        break;
      case 'ping':
        this.sendToClient(clientId, {
          type: 'pong',
          timestamp: new Date().toISOString()
        });
        break;
      default:
        this.sendToClient(clientId, {
          type: 'error',
          error: 'Unknown message type',
          timestamp: new Date().toISOString()
        });
    }
  }

  handleSubscribe(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;

    const { channels = [] } = message;

    for (const channel of channels) {
      client.subscriptions.add(channel);
    }

    this.sendToClient(clientId, {
      type: 'subscribed',
      channels: Array.from(client.subscriptions),
      timestamp: new Date().toISOString()
    });

    console.log(`📡 Client ${clientId} subscribed to: ${channels.join(', ')}`);
  }

  handleUnsubscribe(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;

    const { channels = [] } = message;

    for (const channel of channels) {
      client.subscriptions.delete(channel);
    }

    this.sendToClient(clientId, {
      type: 'unsubscribed',
      channels: Array.from(client.subscriptions),
      timestamp: new Date().toISOString()
    });

    console.log(`📡 Client ${clientId} unsubscribed from: ${channels.join(', ')}`);
  }

  handleDisconnect(clientId) {
    this.clients.delete(clientId);
    console.log(`🔌 WebSocket client disconnected: ${clientId}`);
  }

  startBroadcasting() {
    // Broadcast updates every 10 seconds
    this.broadcastInterval = setInterval(async () => {
      await this.broadcastUpdates();
    }, 10000);
  }

  async broadcastUpdates() {
    if (this.clients.size === 0) return;

    try {
      // Get latest market data
      const marketData = await this.getMarketData();
      
      // Broadcast to all subscribed clients
      for (const [clientId, client] of this.clients) {
        for (const subscription of client.subscriptions) {
          const data = await this.getChannelData(subscription);
          if (data) {
            this.sendToClient(clientId, {
              type: 'update',
              channel: subscription,
              data,
              timestamp: new Date().toISOString()
            });
          }
        }
      }
    } catch (error) {
      console.error('❌ Broadcast update failed:', error);
    }
  }

  async getMarketData() {
    try {
      const tokens = await this.analyticsEngine.getActiveTokens();
      const marketOverview = {
        totalTokens: tokens.length,
        totalMarketCap: 0,
        averageVolatility: 0,
        bullishTokens: 0,
        bearishTokens: 0,
        neutralTokens: 0
      };

      let totalVolatility = 0;
      let analyzedTokens = 0;

      for (const token of tokens) {
        const analysis = await this.analyticsEngine.getLatestAnalysis(token.address);
        if (analysis) {
          marketOverview.totalMarketCap += analysis.metrics.marketCap;
          totalVolatility += analysis.metrics.volatility;
          analyzedTokens++;

          if (analysis.signals.recommendation === 'BUY') {
            marketOverview.bullishTokens++;
          } else if (analysis.signals.recommendation === 'SELL') {
            marketOverview.bearishTokens++;
          } else {
            marketOverview.neutralTokens++;
          }
        }
      }

      if (analyzedTokens > 0) {
        marketOverview.averageVolatility = totalVolatility / analyzedTokens;
      }

      return marketOverview;
    } catch (error) {
      console.error('Error getting market data:', error);
      return null;
    }
  }

  async getChannelData(channel) {
    try {
      switch (channel) {
        case 'market-overview':
          return await this.getMarketData();
        
        case 'trading-signals':
          const tokens = await this.analyticsEngine.getActiveTokens();
          const signals = [];
          
          for (const token of tokens) {
            const analysis = await this.analyticsEngine.getLatestAnalysis(token.address);
            if (analysis) {
              signals.push({
                tokenAddress: token.address,
                symbol: token.symbol,
                recommendation: analysis.signals.recommendation,
                confidence: analysis.signals.confidence,
                timestamp: analysis.timestamp
              });
            }
          }
          return signals;
        
        case 'price-alerts':
          // Return high-confidence signals
          const tokens2 = await this.analyticsEngine.getActiveTokens();
          const alerts = [];
          
          for (const token of tokens2) {
            const analysis = await this.analyticsEngine.getLatestAnalysis(token.address);
            if (analysis && analysis.signals.confidence > 0.8) {
              alerts.push({
                tokenAddress: token.address,
                symbol: token.symbol,
                signal: analysis.signals.recommendation,
                confidence: analysis.signals.confidence,
                reasoning: analysis.signals.reasoning,
                timestamp: analysis.timestamp
              });
            }
          }
          return alerts;
        
        case 'risk-alerts':
          // Return high-risk tokens
          const tokens3 = await this.analyticsEngine.getActiveTokens();
          const riskAlerts = [];
          
          for (const token of tokens3) {
            const analysis = await this.analyticsEngine.getLatestAnalysis(token.address);
            if (analysis && analysis.metrics.volatility > 0.7) {
              riskAlerts.push({
                tokenAddress: token.address,
                symbol: token.symbol,
                riskLevel: 'HIGH',
                volatility: analysis.metrics.volatility,
                concentrationRatio: analysis.metrics.concentrationRatio,
                timestamp: analysis.timestamp
              });
            }
          }
          return riskAlerts;
        
        default:
          return null;
      }
    } catch (error) {
      console.error(`Error getting channel data for ${channel}:`, error);
      return null;
    }
  }

  sendToClient(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client || client.ws.readyState !== 1) return; // 1 = WebSocket.OPEN

    try {
      client.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error(`Error sending message to client ${clientId}:`, error);
      this.handleDisconnect(clientId);
    }
  }

  broadcastToChannel(channel, message) {
    for (const [clientId, client] of this.clients) {
      if (client.subscriptions.has(channel)) {
        this.sendToClient(clientId, {
          type: 'channel-update',
          channel,
          data: message,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  getClientCount() {
    return this.clients.size;
  }

  getSubscriptionStats() {
    const stats = {};
    
    for (const client of this.clients.values()) {
      for (const subscription of client.subscriptions) {
        stats[subscription] = (stats[subscription] || 0) + 1;
      }
    }
    
    return stats;
  }

  isRunning() {
    return this.running;
  }

  shutdown() {
    this.running = false;
    
    if (this.broadcastInterval) {
      clearInterval(this.broadcastInterval);
    }
    
    // Close all client connections
    for (const [clientId, client] of this.clients) {
      try {
        client.ws.close();
      } catch (error) {
        console.error(`Error closing client ${clientId}:`, error);
      }
    }
    
    this.clients.clear();
    
    if (this.wss) {
      this.wss.close();
    }
    
    console.log('🔌 WebSocket Manager shutdown complete');
  }
}

module.exports = WebSocketManager; 