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
    keywords: ['order','orders', 'order id', 'order number'],
    response: `I can help with your order. Please share your order number so I can check the status.`,
  },
  {
    keywords: ['order status', 'status of my order'],
    response: `Sure! Please provide your order number and I’ll check the current status for you.`,
  },
  {
    keywords: ['cancel', 'cancellation'],
    response: `You can cancel an order before it ships. Share your order number and I’ll help check if cancellation is possible.`,
  },
  {
    keywords: ['modify', 'change order', 'update order'],
    response: `If your order hasn’t shipped yet, changes may be possible. Please share your order number.`,
  },
  // ---- Shipping & Address ----
  {
    keywords: ['change address', 'update address','address'],
    response: `Address updates are possible before shipment. Please share your order number and the new address.`,
  },
  {
    keywords: ['late', 'delayed', 'delay'],
    response: `Sorry about the delay! Please share your order number and I’ll look into it right away.`,
  },
  {
    keywords: ['missed delivery', 'not delivered'],
    response: `That’s frustrating — let me help. Please share your order number so I can check delivery details.`,
  },
  {
    keywords: ['return', 'refund'],
    response: `Our return policy allows 30-day returns for a full refund. Items must be unused and in original packaging. Need help starting a return?`,
  },
  {
    keywords: ['return status', 'refund status'],
    response: `Refunds usually process within 5–7 business days after approval. Share your order number and I’ll check the status.`,
  },
  {
    keywords: ['ship', 'delivery', 'international'],
    response: `Free shipping on orders over $50 (USA, 5-7 days). We ship to Canada, UK, and EU (10-15 days). Questions about a specific order?`,
  },
  {
    keywords: ['hours', 'support', 'contact'],
    response: `Live Chat: Mon-Fri 9AM-8PM, Sat-Sun 10AM-6PM EST. Email: support@fastlane.com. Phone: 1-800-FAST-LANE.`,
  },
  {
    keywords: ['payment', 'pay', 'card'],
    response: `We accept Visa, Mastercard, Amex, Discover, PayPal, Apple Pay, and Google Pay.`,
  },
  {
    keywords: ['damaged', 'broken', 'wrong'],
    response: `Sorry about that! Contact us within 48 hours with photos and we'll arrange a replacement or refund.`,
  },
  {
    keywords: ['track', 'where', 'status'],
    response: `Check your shipping confirmation email for tracking. Can't find it? Share your order number and I'll help!`,
  },
  {
    keywords: ['hello', 'hi', 'hey'],
    response: `Hi! 👋 I'm ${AGENT_NAME} from ${STORE_NAME}. How can I help you today?`,
  },
  {
    keywords: ['thank'],
    response: `You're welcome! 😊 Anything else I can help with?`,
  },
   // ---- Payments & Billing ----
  {
    keywords: ['charged', 'double charged', 'payment issue'],
    response: `Sorry about the billing issue. Please share your order number or payment reference so I can assist.`,
  },
  {
    keywords: ['invoice', 'receipt', 'bill'],
    response: `I can help with invoices and receipts. Please share your order number.`,
  },
  {
    keywords: ['promo', 'coupon', 'discount', 'offer'],
    response: `Promo codes can be applied at checkout. If a code didn’t work, share the code and your order details.`,
  },
  // ---- Warranty & Product Issues ----
  {
    keywords: ['warranty', 'guarantee'],
    response: `Most products come with a manufacturer warranty. Share the product name or order number for details.`,
  },
  {
    keywords: ['defective', 'not working', 'faulty'],
    response: `Sorry about that! Please share photos and your order number so we can arrange a replacement or refund.`,
  },

  // ---- Account & Support ----
  {
    keywords: ['account', 'login', 'sign in'],
    response: `If you’re having account issues, please tell me what’s happening and I’ll guide you.`,
  },
  {
    keywords: ['talk to agent', 'human', 'representative'],
    response: `I can connect you with a support agent during our live chat hours. Would you like me to do that?`,
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

