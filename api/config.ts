/**
 * Serverless configuration
 */

export const config = {
  maxMessageLength: 2000,
  maxHistoryMessages: 10,
  maxTokens: parseInt(process.env.MAX_TOKENS || '500', 10),

  openai: {
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    apiKey: process.env.OPENAI_API_KEY,
  },
  gemini: {
    model: process.env.GEMINI_MODEL || 'gemini-pro',
    apiKey: process.env.GEMINI_API_KEY,
  },
  anthropic: {
    model: process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307',
    apiKey: process.env.ANTHROPIC_API_KEY,
  },

  llm: {
    temperature: 0.7,
  },
} as const;

