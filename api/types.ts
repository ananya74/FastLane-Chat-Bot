/**
 * Shared types for serverless functions
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
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

