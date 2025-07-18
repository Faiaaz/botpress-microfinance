const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    port: PORT,
    env: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint for Railway (simplified)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: PORT
  });
});

// Root endpoint
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Simple webhook endpoint
app.post('/webhook', async (req, res) => {
    try {
        const { message, sender } = req.body;
        
        // Simple response for now
        const response = {
            text: "Thank you for your message! I'm here to help with microfinance services.",
            quick_replies: [
                "Apply for loan",
                "Loan programs",
                "Requirements"
            ]
        };
        
        res.json(response);
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Facebook Messenger Webhook Verification
app.get('/facebook/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const verify_token = 'shakti_webhook_2024';

    if (mode === 'subscribe' && token === verify_token) {
        console.log('Facebook webhook verified successfully');
        res.status(200).send(challenge);
    } else {
        console.log('Facebook webhook verification failed');
        res.sendStatus(403);
    }
});

// Facebook Messenger Message Handler
app.post('/facebook/webhook', async (req, res) => {
    try {
        const body = req.body;

        if (body.object === 'page') {
            for (const entry of body.entry) {
                const webhook_event = entry.messaging[0];
                const sender_psid = webhook_event.sender.id;

                if (webhook_event.message) {
                    const message_text = webhook_event.message.text;
                    console.log(`Received message from ${sender_psid}: ${message_text}`);
                    
                    // Simple response
                    const response = {
                        text: "Thank you for your message! I'm here to help with microfinance services."
                    };
                    
                    // Send response back to Facebook
                    await sendFacebookMessage(sender_psid, response);
                }
            }
            res.status(200).send('EVENT_RECEIVED');
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Facebook webhook error:', error);
        res.sendStatus(500);
    }
});

// Function to send message to Facebook
async function sendFacebookMessage(recipient_id, botResponse) {
    const page_access_token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || 'YOUR_PAGE_ACCESS_TOKEN_HERE';
    
    const messageData = {
        recipient: { id: recipient_id },
        message: { text: botResponse.text }
    };

    try {
        const response = await fetch(`https://graph.facebook.com/v18.0/me/messages?access_token=${page_access_token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData)
        });

        const result = await response.json();
        console.log('Facebook API response:', result);
        
        return result;
    } catch (error) {
        console.error('Error sending Facebook message:', error);
        throw error;
    }
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Botpress Microfinance Bot starting...`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Port: ${PORT}`);
    console.log(`📱 Web interface: http://localhost:${PORT}`);
    console.log(`🔗 Webhook endpoint: http://localhost:${PORT}/webhook`);
    console.log(`📘 Facebook webhook: http://localhost:${PORT}/facebook/webhook`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
    console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
    console.log(`✅ Server is ready!`);
});

// Handle process errors
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

module.exports = app; 