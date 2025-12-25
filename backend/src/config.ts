/**
 * Centralized configuration for the application
 * Single source of truth for all configurable values
 */

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3001', 10),

  // Chat
  maxMessageLength: 2000,
  maxHistoryMessages: parseInt(process.env.MAX_HISTORY_MESSAGES || '10', 10),
  maxTokens: parseInt(process.env.MAX_TOKENS || '500', 10),

  // LLM Models
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

  // LLM Settings
  llm: {
    temperature: 0.7,
  },
} as const;

export type Config = typeof config;

