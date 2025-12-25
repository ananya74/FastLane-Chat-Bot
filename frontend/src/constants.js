/**
 * Application constants
 * Single source of truth for frontend configuration
 */

// Use /api for Vercel, /chat for local backend
export const API_BASE = import.meta.env.PROD ? '/api/chat' : '/chat';
export const MAX_MESSAGE_LENGTH = 2000;
export const STORAGE_KEY = 'chatSessionId';

export const STORE_NAME = 'FastLane';
export const AGENT_NAME = 'Ella';

export const QUICK_ACTIONS = [
  { label: 'Return Policy', question: "What's your return policy?" },
  { label: 'Shipping Info', question: 'Do you ship internationally?' },
  { label: 'Support Hours', question: 'What are your support hours?' },
];

