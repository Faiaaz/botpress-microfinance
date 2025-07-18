class MicrofinanceBot {
    constructor() {
        this.intents = this.loadIntents();
    }

    loadIntents() {
        // Load intents from the JSON file
        const intentsData = require('./nlu/intents.json');
        return intentsData.intents;
    }

    // Simple intent recognition
    recognizeIntent(message) {
        const lowerMessage = message.toLowerCase();
        
        for (const intent of this.intents) {
            for (const utterance of intent.utterances) {
                if (lowerMessage.includes(utterance.toLowerCase()) || 
                    this.calculateSimilarity(lowerMessage, utterance.toLowerCase()) > 0.7) {
                    return intent.name;
                }
            }
        }
        
        return null;
    }

    // Simple similarity calculation
    calculateSimilarity(str1, str2) {
        const words1 = str1.split(' ');
        const words2 = str2.split(' ');
        const commonWords = words1.filter(word => words2.includes(word));
        return commonWords.length / Math.max(words1.length, words2.length);
    }

    // Process message and return response
    async processMessage(message, sender = 'user') {
        const intent = this.recognizeIntent(message);
        return this.generateResponse(intent, message, sender);
    }

    generateResponse(intent, message, sender) {
        const context = this.getUserContext(sender);
        
        switch (intent) {
            case 'apply_loan':
                context.step = 'business_info';
                return {
                    text: "Great! I'd be happy to help you apply for a loan. To get started, could you tell me a bit about your business or income source?",
                    quick_replies: [
                        "I have a small business",
                        "I work for someone", 
                        "I need emergency funds"
                    ]
                };

            case 'loan_programs':
                return {
                    text: "We offer several loan programs designed specifically for women entrepreneurs:\n\n• Small Business Loans: $500 - $5,000\n• Emergency Loans: $200 - $1,000\n• Education Loans: $1,000 - $3,000\n\nAll loans have flexible repayment terms and low interest rates. Would you like to apply?",
                    quick_replies: [
                        "Yes, I want to apply",
                        "Tell me more about requirements",
                        "What are the interest rates?"
                    ]
                };

            case 'documents_needed':
                return {
                    text: "For loan applications, you'll need:\n\n• Valid ID (passport, driver's license)\n• Proof of income (pay stubs, business records)\n• Bank statements (last 3 months)\n• Two references\n• Business plan (for business loans)\n\nDo you have these documents ready?",
                    quick_replies: [
                        "Yes, I have them",
                        "I need help getting some documents",
                        "Let me apply anyway"
                    ]
                };

            case 'repayment_questions':
                return {
                    text: "Our repayment terms are very flexible:\n\n• Weekly, bi-weekly, or monthly payments\n• Grace period of 2 weeks for emergencies\n• No penalties for early repayment\n• We work with you if you face difficulties\n\nWould you like to speak with someone about your specific situation?",
                    quick_replies: [
                        "Yes, connect me with someone",
                        "Tell me more about loan programs"
                    ]
                };

            case 'documents_ready':
                context.step = 'business_info';
                return {
                    text: "Excellent! Since you have your documents ready, let's get started with your loan application. Could you tell me a bit about your business or income source?",
                    quick_replies: [
                        "I have a small business",
                        "I work for someone",
                        "I need emergency funds"
                    ]
                };

            case 'help_with_documents':
                return {
                    text: "No worries! We understand that getting documents can be challenging. Here's how we can help:\n\n• **ID Documents**: We accept expired IDs up to 6 months past expiry\n• **Income Proof**: We can work with verbal income verification for small amounts\n• **Bank Statements**: We accept mobile money statements or cash deposit records\n• **References**: Family members or community leaders can serve as references\n• **Business Plan**: We can help you create a simple business plan\n\nWould you like to speak with a loan officer who can guide you through getting these documents?",
                    quick_replies: [
                        "Yes, connect me with someone",
                        "Let me apply anyway"
                    ]
                };

            case 'apply_anyway':
                context.step = 'business_info';
                return {
                    text: "I understand you want to proceed with the application. We can start the process and work on getting the documents together. Could you tell me a bit about your business or income source?",
                    quick_replies: [
                        "I have a small business",
                        "I work for someone",
                        "I need emergency funds"
                    ]
                };

            case 'interest_rates':
                return {
                    text: "Our interest rates are very competitive:\n\n• Small Business Loans: 8-12% annually\n• Emergency Loans: 10-15% annually\n• Education Loans: 6-10% annually\n\nThese rates are much lower than traditional lenders and designed to be affordable for women entrepreneurs. Would you like to apply?",
                    quick_replies: [
                        "Yes, I want to apply",
                        "Tell me about requirements"
                    ]
                };

            case 'connect_loan_officer':
                context.step = 'completed';
                return {
                    text: "I'm connecting you with one of our loan officers now. They will call you within the next 24 hours to discuss your application and answer any questions. Thank you for choosing Women's Empowerment Microfinance! 🌟",
                    quick_replies: []
                };

            default:
                // Handle conversation flow based on context
                if (context.step === 'business_info') {
                    context.step = 'loan_amount';
                    return {
                        text: "Thank you for sharing that information. Now, could you tell me approximately how much you're looking to borrow? This will help me guide you to the right loan program.",
                        quick_replies: []
                    };
                } else if (context.step === 'loan_amount') {
                    // Extract amount from message
                    const amount = message.replace(/[^0-9]/g, '');
                    let loanType = "Custom Loan";
                    
                    if (amount >= 500 && amount <= 5000) {
                        loanType = "Small Business Loan";
                    } else if (amount >= 200 && amount < 500) {
                        loanType = "Emergency Loan";
                    } else if (amount >= 1000 && amount <= 3000) {
                        loanType = "Education Loan";
                    }
                    
                    context.step = 'completed';
                    return {
                        text: `Perfect! Based on the amount you mentioned, I'd recommend our ${loanType} program. I have all the information I need to help you get started. Let me connect you with one of our experienced loan officers who will guide you through the application process and answer any specific questions you may have.`,
                        quick_replies: []
                    };
                } else {
                    return {
                        text: "I understand you're interested in our services. Let me connect you with one of our loan officers who can provide personalized assistance.",
                        quick_replies: [
                            "Connect me with someone",
                            "Tell me about loan programs"
                        ]
                    };
                }
        }
    }

    // Simple user context management (in production, use a database)
    getUserContext(sender) {
        if (!this.userContexts) {
            this.userContexts = {};
        }
        
        if (!this.userContexts[sender]) {
            this.userContexts[sender] = { step: 'welcome' };
        }
        
        return this.userContexts[sender];
    }

    // Get welcome message
    getWelcomeMessage() {
        return {
            text: "Hello! Welcome to Women's Empowerment Microfinance. I'm here to help you with loan information and applications. How can I assist you today?",
            quick_replies: [
                "I want to apply for a loan",
                "Tell me about your loan programs",
                "What documents do I need?",
                "I have questions about repayment"
            ]
        };
    }
}

module.exports = new MicrofinanceBot(); 