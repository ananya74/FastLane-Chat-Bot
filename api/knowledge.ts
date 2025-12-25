/**
 * Store knowledge and fallback responses
 */

export const STORE_NAME = 'FastLane';
export const AGENT_NAME = 'Ella';

export const STORE_KNOWLEDGE = `
## About ${STORE_NAME} Store

${STORE_NAME} is a modern e-commerce store specializing in electronics, home goods, and lifestyle products.

### Shipping Policy
- **Domestic Shipping (USA)**: Free shipping on orders over $50. Standard shipping (5-7 business days) costs $5.99. Express shipping (2-3 business days) costs $12.99.
- **International Shipping**: We ship to Canada, UK, and EU countries. International orders typically take 10-15 business days.
- **Tracking**: All orders include tracking.

### Return & Refund Policy
- **30-Day Returns**: Return any item within 30 days for a full refund.
- **Condition**: Items must be unused, in original packaging.
- **Refunds**: Processed within 5-7 business days.

### Support Hours
- **Live Chat**: Monday-Friday, 9 AM - 8 PM EST; Saturday-Sunday, 10 AM - 6 PM EST
- **Email**: support@fastlane.com
- **Phone**: 1-800-FAST-LANE

### Payment Methods
Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, Google Pay.
`;

export const SYSTEM_PROMPT = `You are a friendly customer support agent for ${STORE_NAME}. Your name is ${AGENT_NAME}.

Be concise (1-3 sentences), warm, and professional. Never make up order information.

Store policies:
${STORE_KNOWLEDGE}`;

// Fallback responses
interface ResponsePattern {
  keywords: string[];
  response: string;
}

const patterns: ResponsePattern[] = [
  {
    keywords: ['return', 'refund'],
    response: `Our return policy allows 30-day returns for a full refund. Items must be unused and in original packaging. Need help starting a return?`,
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
];

export function getFallbackResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const p of patterns) {
    if (p.keywords.some((k) => lower.includes(k))) {
      return p.response;
    }
  }
  return `Hi! I'm ${AGENT_NAME} from ${STORE_NAME}. I can help with shipping, returns, orders, and policies. What do you need?`;
}

