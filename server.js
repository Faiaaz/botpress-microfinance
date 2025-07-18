const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic test endpoint - this should be the main route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Botpress Microfinance Bot is running!',
        timestamp: new Date().toISOString(),
        port: PORT,
        env: process.env.NODE_ENV || 'development'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ 
        message: 'Test endpoint working!', 
        timestamp: new Date().toISOString()
    });
});

// Simple webhook endpoint
app.post('/webhook', (req, res) => {
    res.json({ 
        message: 'Webhook received',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server starting on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ Server ready!`);
});

module.exports = app; 