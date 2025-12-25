/**
 * Fallback responses when LLM providers are unavailable
 * Single Responsibility: Contains only fallback response logic
 */

import { STORE_NAME, AGENT_NAME } from './store-knowledge';

interface ResponsePattern {
  keywords: string[];
  response: string;
}

const responsePatterns: ResponsePattern[] = [
  {
    keywords: ['return', 'refund'],
    response: `Hi! I'm ${AGENT_NAME} from ${STORE_NAME}. Our return policy allows you to return any item within 30 days of delivery for a full refund. Items must be unused and in original packaging. Would you like me to help you start a return?`,
  },
  {
    keywords: ['ship', 'delivery', 'international'],
    response: `Great question! We offer free shipping on orders over $50 within the USA (5-7 business days). We also ship internationally to Canada, UK, and EU countries - those orders typically take 10-15 business days. Is there anything specific about shipping I can help with?`,
  },
  {
    keywords: ['hours', 'support', 'contact'],
    response: `Our support hours are: Live Chat Monday-Friday 9 AM - 8 PM EST, Saturday-Sunday 10 AM - 6 PM EST. You can also email us at support@quickmart.com or call 1-800-QUICK-MT. How can I help you today?`,
  },
  {
    keywords: ['payment', 'pay', 'card'],
    response: `We accept Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, and Google Pay. Is there a specific payment question I can help with?`,
  },
  {
    keywords: ['damaged', 'broken', 'wrong item'],
    response: `I'm sorry to hear about the issue with your order! For damaged or wrong items, please contact us within 48 hours with photos if possible. We'll arrange a replacement or refund right away. Can you tell me more about what happened?`,
  },
  {
    keywords: ['track', 'where', 'order status'],
    response: `You can track your order using the tracking link in your shipping confirmation email. If you can't find it, please provide your order number and I'll help you locate it!`,
  },
  {
    keywords: ['cancel'],
    response: `To cancel an order, please contact us as soon as possible. If the order hasn't shipped yet, we can cancel it for a full refund. If it has shipped, you can refuse delivery or return it once received. What's your order number?`,
  },
  {
    keywords: ['hello', 'hi', 'hey'],
    response: `Hi there! 👋 I'm ${AGENT_NAME}, your ${STORE_NAME} support assistant. How can I help you today? Feel free to ask about shipping, returns, orders, or anything else!`,
  },
  {
    keywords: ['thank'],
    response: `You're welcome! 😊 Is there anything else I can help you with today?`,
  },
];

const defaultResponse = `Thanks for reaching out! I'm ${AGENT_NAME} from ${STORE_NAME} support. I can help you with questions about shipping, returns, orders, and our policies. What would you like to know?`;

/**
 * Get a fallback response based on keyword matching
 */
export function getFallbackResponse(userMessage: string): string {
  const messageLower = userMessage.toLowerCase();

  for (const pattern of responsePatterns) {
    if (pattern.keywords.some((keyword) => messageLower.includes(keyword))) {
      return pattern.response;
    }
  }

  return defaultResponse;
}

