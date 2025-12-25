/**
 * Shared types for the application
 * Single Responsibility: Contains only type definitions
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type ProviderName = 'openai' | 'gemini' | 'anthropic';

export interface LLMProvider {
  name: ProviderName;
  isAvailable: () => boolean;
  generate: (
    history: ChatMessage[],
    message: string,
    maxTokens: number
  ) => Promise<string>;
}

