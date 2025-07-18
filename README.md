# Women's Empowerment Microfinance Chatbot

A conversational AI chatbot built with Botpress to assist women entrepreneurs with microfinance loan applications and information.

## 🌟 Features

- **Loan Application Assistance**: Guides users through the loan application process
- **Program Information**: Provides details about different loan programs
- **Document Requirements**: Explains what documents are needed
- **Repayment Information**: Answers questions about loan repayment
- **Quick Reply Buttons**: Easy-to-use interface with predefined options
- **Multi-channel Support**: Web interface and Facebook Messenger integration ready
- **Natural Language Understanding**: Understands user intent and responds appropriately

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd botpress-microfinance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the web interface**
   - Navigate to `http://localhost:3000`
   - Start chatting with the bot!

## 📁 Project Structure

```
botpress-microfinance/
├── src/
│   ├── bot.js                 # Main bot logic and conversation flow
│   └── nlu/
│       └── intents.json       # NLU training data for intent recognition
├── public/
│   └── index.html             # Web interface for the chatbot
├── package.json               # Project dependencies and scripts
├── botpress.config.json       # Botpress configuration
└── README.md                  # This file
```

## 💬 Conversation Flow

The chatbot handles the following conversation paths:

1. **Welcome & Initial Options**
   - Apply for a loan
   - Learn about loan programs
   - Check document requirements
   - Ask about repayment

2. **Loan Application Process**
   - Business/income information collection
   - Loan amount determination
   - Loan type recommendation
   - Connection to loan officer

3. **Program Information**
   - Small Business Loans ($500 - $5,000)
   - Emergency Loans ($200 - $1,000)
   - Education Loans ($1,000 - $3,000)
   - Interest rates and terms

4. **Document Assistance**
   - Required documents list
   - Help with missing documents
   - Alternative document options

## 🔧 Configuration

### Botpress Configuration

Edit `botpress.config.json` to customize:

- **Port**: Change the server port (default: 3000)
- **Secret**: Set a secure secret key
- **Logging**: Configure log levels and file paths
- **Modules**: Enable/disable Botpress modules

### NLU Training

To improve intent recognition, add more training examples to `src/nlu/intents.json`:

```json
{
  "name": "apply_loan",
  "utterances": [
    "I want to apply for a loan",
    "I need a loan",
    "Can I get a loan?",
    // Add more examples here
  ]
}
```

## 🌐 Deployment

### Local Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Railway Deployment

1. **Create a Railway account** at [railway.app](https://railway.app)

2. **Connect your GitHub repository**

3. **Add environment variables**:
   ```
   NODE_ENV=production
   PORT=3000
   ```

4. **Deploy automatically** - Railway will build and deploy your bot

### Facebook Messenger Integration

1. **Create a Facebook App** at [developers.facebook.com](https://developers.facebook.com)

2. **Add Messenger Product** to your app

3. **Configure Webhook**:
   - URL: `https://your-domain.com/webhook`
   - Verify Token: `your-verify-token`

4. **Subscribe to Events**:
   - `messages`
   - `messaging_postbacks`

5. **Generate Page Access Token** and add it to your bot configuration

## 🎨 Customization

### Styling the Web Interface

Edit `public/index.html` to customize:
- Colors and gradients
- Layout and spacing
- Typography
- Animations

### Adding New Intents

1. **Add training data** to `src/nlu/intents.json`
2. **Create intent handler** in `src/bot.js`
3. **Test with the bot**

### Extending Conversation Flow

Modify `src/bot.js` to add:
- New conversation steps
- Additional quick replies
- Custom logic for specific scenarios

## 📊 Analytics & Monitoring

The bot includes built-in logging for:
- User interactions
- Intent recognition accuracy
- Conversation completion rates
- Error tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the Botpress documentation
- Review the conversation flow examples

## 🔄 Updates

To update the bot:
1. Pull the latest changes
2. Install new dependencies: `npm install`
3. Restart the bot: `npm restart`

---

**Built with ❤️ for women's empowerment and financial inclusion** 