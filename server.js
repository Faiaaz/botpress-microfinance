const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const bot = require('./src/bot');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the web interface
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Botpress webhook endpoint
app.post('/webhook', async (req, res) => {
    try {
        const { message, sender } = req.body;
        
        // Process the message through the bot
        const response = await bot.processMessage(message, sender);
        
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
                    
                    // Process message through bot
                    const response = await bot.processMessage(message_text, sender_psid);
                    
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

    // Send quick replies if available
    if (botResponse.quick_replies && botResponse.quick_replies.length > 0) {
        const quick_replies = botResponse.quick_replies.map(reply => ({
            content_type: 'text',
            title: reply,
            payload: reply
        }));
        
        messageData.message.quick_replies = quick_replies;
    }

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

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Botpress Microfinance Bot running on port ${PORT}`);
    console.log(`📱 Web interface: http://localhost:${PORT}`);
    console.log(`🔗 Webhook endpoint: http://localhost:${PORT}/webhook`);
    console.log(`📘 Facebook webhook: http://localhost:${PORT}/facebook/webhook`);
});

module.exports = app; 