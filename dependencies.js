// dependencies.js - Store your API keys and configuration here
const CONFIG = {
    token: '',  // Your actual YouTube API key
    // You can add other config variables here
    appName: 'David Colonia Portfolio',
    version: '1.0.0'
};

// Make config available globally
window.PORTFOLIO_CONFIG = CONFIG;

// Confirm loading
console.log('✅ Dependencies.js loaded successfully!');
console.log('📋 Config:', CONFIG.appName);
console.log('🔑 API Key present:', !!CONFIG.token);