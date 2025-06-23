// Dashboard JavaScript for AI-Powered Memecoin Analytics
class Dashboard {
    constructor() {
        this.apiBase = '/api';
        this.tokens = [];
        this.analysisData = {};
        this.charts = {};
        this.isDemoMode = false;
        this.demoData = null;
        this.init();
    }

    async init() {
        console.log('🚀 Initializing AI-Powered Memecoin Analytics Dashboard...');
        await this.loadInitialData();
        this.startAutoRefresh();
        this.updateUptime();
        this.updateModeDisplay();
    }

    async loadInitialData() {
        try {
            if (this.isDemoMode) {
                await this.loadDemoData();
            } else {
                await Promise.all([
                    this.loadTokens(),
                    this.loadMarketOverview(),
                    this.loadAPIStatus()
                ]);
            }
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.showMessage('Error loading data. Please try again.', 'error');
        }
    }

    async loadDemoData() {
        try {
            const response = await fetch(`${this.apiBase}/demo/data`);
            const data = await response.json();
            
            if (data.success) {
                this.demoData = data.data;
                this.tokens = this.demoData.tokens;
                this.renderTokenAnalytics();
                this.updateMarketOverview(this.demoData.marketOverview);
                this.updateAPIStatus({
                    uptime: process.uptime ? process.uptime() : 3600,
                    activeTokens: this.tokens.length,
                    lastAnalysis: new Date().toISOString()
                });
                this.updateActiveTokensCount();
            }
        } catch (error) {
            console.error('Error loading demo data:', error);
            this.showMessage('Error loading demo data. Please try again.', 'error');
        }
    }

    async loadTokens() {
        try {
            const response = await fetch(`${this.apiBase}/tokens`);
            const data = await response.json();
            
            if (data.success) {
                this.tokens = data.data;
                this.renderTokenAnalytics();
                this.updateActiveTokensCount();
            }
        } catch (error) {
            console.error('Error loading tokens:', error);
        }
    }

    async loadMarketOverview() {
        try {
            const response = await fetch(`${this.apiBase}/market/overview`);
            const data = await response.json();
            
            if (data.success) {
                this.updateMarketOverview(data.data);
            }
        } catch (error) {
            console.error('Error loading market overview:', error);
        }
    }

    async loadAPIStatus() {
        try {
            const response = await fetch(`${this.apiBase}/status`);
            const data = await response.json();
            
            if (data.success) {
                this.updateAPIStatus(data.data);
            }
        } catch (error) {
            console.error('Error loading API status:', error);
        }
    }

    async analyzeAllTokens() {
        this.showLoading(true);
        this.showMessage('', '');
        
        try {
            if (this.isDemoMode) {
                // Simulate demo analysis
                await new Promise(resolve => setTimeout(resolve, 2000));
                this.showMessage('✅ Demo analysis completed successfully for all tokens!', 'success');
                this.updateLastAnalysis();
            } else {
                const response = await fetch(`${this.apiBase}/analyze`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                
                if (data.success) {
                    this.showMessage('✅ Analytics completed successfully for all tokens!', 'success');
                    await this.loadMarketOverview();
                    await this.loadTokens();
                    this.updateLastAnalysis();
                } else {
                    this.showMessage(`❌ Analysis failed: ${data.error}`, 'error');
                }
            }
        } catch (error) {
            console.error('Error analyzing tokens:', error);
            this.showMessage('❌ Network error during analysis', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async getMarketOverview() {
        this.showLoading(true);
        this.showMessage('', '');
        
        try {
            if (this.isDemoMode) {
                this.updateMarketOverview(this.demoData.marketOverview);
                this.showMessage('✅ Demo market overview updated!', 'success');
            } else {
                await this.loadMarketOverview();
                this.showMessage('✅ Market overview updated!', 'success');
            }
        } catch (error) {
            this.showMessage('❌ Error loading market overview', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async getTradingSignals() {
        this.showLoading(true);
        this.showMessage('', '');
        
        try {
            if (this.isDemoMode) {
                this.renderTradingSignals(this.demoData.tradingSignals);
                this.showMessage('✅ Demo trading signals loaded!', 'success');
            } else {
                const signals = [];
                
                for (const token of this.tokens) {
                    try {
                        const response = await fetch(`${this.apiBase}/signals/${token.address}`);
                        const data = await response.json();
                        
                        if (data.success) {
                            signals.push(data.data);
                        }
                    } catch (error) {
                        console.error(`Error loading signals for ${token.symbol}:`, error);
                    }
                }
                
                this.renderTradingSignals(signals);
                this.showMessage('✅ Trading signals loaded!', 'success');
            }
        } catch (error) {
            this.showMessage('❌ Error loading trading signals', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async refreshData() {
        this.showLoading(true);
        this.showMessage('', '');
        
        try {
            await this.loadInitialData();
            this.showMessage('✅ Data refreshed successfully!', 'success');
        } catch (error) {
            this.showMessage('❌ Error refreshing data', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    renderTokenAnalytics() {
        const container = document.getElementById('tokenAnalytics');
        container.innerHTML = '';
        
        this.tokens.forEach(token => {
            const tokenCard = this.createTokenCard(token);
            container.appendChild(tokenCard);
        });
    }

    createTokenCard(token) {
        const card = document.createElement('div');
        card.className = 'token-card';
        
        const signalClass = this.getSignalClass(token.symbol);
        const signalText = this.getSignalText(token.symbol);
        
        card.innerHTML = `
            <div class="token-header">
                <div>
                    <div class="token-symbol">${token.symbol}</div>
                    <div style="font-size: 0.9rem; opacity: 0.8;">${token.name}</div>
                </div>
                <div>
                    <div class="token-price">$${(token.price || 0).toFixed(8)}</div>
                    <div class="signal-badge ${signalClass}">${signalText}</div>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9rem;">
                <div>
                    <div style="opacity: 0.8;">Market Cap</div>
                    <div style="font-weight: 600;">$${(token.price * token.supply / 1e9).toFixed(2)}B</div>
                </div>
                <div>
                    <div style="opacity: 0.8;">Supply</div>
                    <div style="font-weight: 600;">${(token.supply / 1e9).toFixed(2)}B</div>
                </div>
            </div>
            <div style="margin-top: 10px;">
                <button class="btn btn-primary" style="width: 100%; padding: 8px; font-size: 0.8rem;" 
                        onclick="dashboard.analyzeSingleToken('${token.address}')">
                    <i class="fas fa-chart-line"></i> Analyze ${token.symbol}
                </button>
            </div>
        `;
        
        return card;
    }

    async analyzeSingleToken(tokenAddress) {
        this.showLoading(true);
        this.showMessage('', '');
        
        try {
            if (this.isDemoMode) {
                // Simulate demo analysis
                await new Promise(resolve => setTimeout(resolve, 1500));
                this.showMessage(`✅ Demo analysis completed for token!`, 'success');
                this.updateLastAnalysis();
            } else {
                const response = await fetch(`${this.apiBase}/analyze/${tokenAddress}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                
                if (data.success) {
                    this.showMessage(`✅ Analysis completed for token!`, 'success');
                    await this.loadTokens();
                    this.updateLastAnalysis();
                } else {
                    this.showMessage(`❌ Analysis failed: ${data.error}`, 'error');
                }
            }
        } catch (error) {
            console.error('Error analyzing token:', error);
            this.showMessage('❌ Network error during analysis', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    renderTradingSignals(signals) {
        const container = document.getElementById('tradingSignals');
        container.innerHTML = '';
        
        if (signals.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No trading signals available. Run analysis first.</p>';
            return;
        }
        
        signals.forEach(signal => {
            const signalCard = this.createSignalCard(signal);
            container.appendChild(signalCard);
        });
    }

    createSignalCard(signal) {
        const card = document.createElement('div');
        card.className = 'token-card';
        card.style.marginBottom = '15px';
        
        const signalClass = this.getSignalClassByRecommendation(signal.recommendation);
        
        card.innerHTML = `
            <div class="token-header">
                <div>
                    <div class="token-symbol">${signal.symbol || signal.tokenAddress.slice(0, 8)}...</div>
                    <div style="font-size: 0.9rem; opacity: 0.8;">Trading Signal</div>
                </div>
                <div>
                    <div class="signal-badge ${signalClass}">${signal.recommendation}</div>
                    <div style="font-size: 0.9rem; opacity: 0.8;">Confidence: ${(signal.confidence * 100).toFixed(1)}%</div>
                </div>
            </div>
            <div style="font-size: 0.9rem; line-height: 1.4;">
                <div style="margin-bottom: 10px;"><strong>Reasoning:</strong></div>
                <div style="opacity: 0.9;">${signal.reasoning || 'No reasoning provided'}</div>
            </div>
            <div style="margin-top: 15px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 0.8rem;">
                <div>
                    <div style="opacity: 0.8;">Market Cap</div>
                    <div style="font-weight: 600;">$${(signal.metrics?.marketCap / 1e9 || 0).toFixed(2)}B</div>
                </div>
                <div>
                    <div style="opacity: 0.8;">Volatility</div>
                    <div style="font-weight: 600;">${((signal.metrics?.volatility || 0) * 100).toFixed(1)}%</div>
                </div>
                <div>
                    <div style="opacity: 0.8;">Volume 24h</div>
                    <div style="font-weight: 600;">$${(signal.metrics?.volume24h / 1e6 || 0).toFixed(1)}M</div>
                </div>
            </div>
        `;
        
        return card;
    }

    updateMarketOverview(data) {
        document.getElementById('totalMarketCap').textContent = `$${(data.totalMarketCap / 1e9).toFixed(2)}B`;
        document.getElementById('avgVolatility').textContent = `${((data.averageVolatility || 0) * 100).toFixed(1)}%`;
        document.getElementById('bullishTokens').textContent = data.bullishTokens || 0;
        document.getElementById('bearishTokens').textContent = data.bearishTokens || 0;
    }

    updateAPIStatus(data) {
        document.getElementById('uptime').textContent = this.formatUptime(data.uptime);
        document.getElementById('activeTokens').textContent = data.activeTokens || 0;
        document.getElementById('lastAnalysis').textContent = data.lastAnalysis || 'Never';
    }

    updateActiveTokensCount() {
        document.getElementById('activeTokens').textContent = this.tokens.length;
    }

    updateLastAnalysis() {
        document.getElementById('lastAnalysis').textContent = new Date().toLocaleString();
    }

    updateModeDisplay() {
        const modeIndicator = document.getElementById('modeIndicator');
        const modeToggle = document.getElementById('modeToggle');
        const modeDescription = document.getElementById('modeDescription');
        
        if (this.isDemoMode) {
            modeIndicator.innerHTML = '<i class="fas fa-play-circle"></i> Demo Mode';
            modeIndicator.style.background = 'linear-gradient(45deg, #fdcb6e, #e17055)';
            modeToggle.innerHTML = '<i class="fas fa-toggle-off"></i> Switch to Live Mode';
            modeDescription.textContent = 'Using historical demo data for presentation purposes';
        } else {
            modeIndicator.innerHTML = '<i class="fas fa-circle"></i> Live Blockchain Data';
            modeIndicator.style.background = 'linear-gradient(45deg, #00b894, #00cec9)';
            modeToggle.innerHTML = '<i class="fas fa-toggle-on"></i> Switch to Demo Mode';
            modeDescription.textContent = 'Connected to live Ethereum blockchain data via Alchemy API';
        }
    }

    toggleDemoMode() {
        this.isDemoMode = !this.isDemoMode;
        this.updateModeDisplay();
        this.loadInitialData();
        
        const message = this.isDemoMode 
            ? '🎭 Switched to Demo Mode - Using historical data for presentation'
            : '🔗 Switched to Live Mode - Connected to real blockchain data';
        
        this.showMessage(message, 'success');
    }

    updateUptime() {
        setInterval(() => {
            const uptimeElement = document.getElementById('uptime');
            if (uptimeElement) {
                const currentUptime = parseFloat(uptimeElement.textContent) || 0;
                uptimeElement.textContent = this.formatUptime(currentUptime + 1);
            }
        }, 1000);
    }

    formatUptime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }

    getSignalClass(symbol) {
        // Mock signal classes for demonstration
        const signals = {
            'PEPE': 'signal-buy',
            'SHIB': 'signal-hold',
            'DAI': 'signal-sell'
        };
        return signals[symbol] || 'signal-hold';
    }

    getSignalText(symbol) {
        // Mock signal text for demonstration
        const signals = {
            'PEPE': 'BUY',
            'SHIB': 'HOLD',
            'DAI': 'SELL'
        };
        return signals[symbol] || 'HOLD';
    }

    getSignalClassByRecommendation(recommendation) {
        const classes = {
            'BUY': 'signal-buy',
            'SELL': 'signal-sell',
            'HOLD': 'signal-hold'
        };
        return classes[recommendation] || 'signal-hold';
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        loading.style.display = show ? 'block' : 'none';
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById('message');
        
        if (!message) {
            messageDiv.innerHTML = '';
            return;
        }
        
        const className = type === 'error' ? 'error' : 'success';
        messageDiv.innerHTML = `<div class="${className}">${message}</div>`;
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.innerHTML = '';
            }, 5000);
        }
    }

    startAutoRefresh() {
        // Refresh data every 30 seconds
        setInterval(() => {
            if (!this.isDemoMode) {
                this.loadTokens();
                this.loadMarketOverview();
            }
        }, 30000);
    }
}

// Global functions for button clicks
function analyzeAllTokens() {
    dashboard.analyzeAllTokens();
}

function getMarketOverview() {
    dashboard.getMarketOverview();
}

function getTradingSignals() {
    dashboard.getTradingSignals();
}

function refreshData() {
    dashboard.refreshData();
}

function toggleDemoMode() {
    dashboard.toggleDemoMode();
}

// Initialize dashboard when page loads
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new Dashboard();
});

// Add some mock data for demonstration
setTimeout(() => {
    if (dashboard) {
        dashboard.showMessage('🎉 Dashboard loaded successfully! Click "Analyze All Tokens" to start.', 'success');
    }
}, 1000); 