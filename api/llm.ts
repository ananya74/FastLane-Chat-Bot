/**
 * LLM Service with automatic fallback
 */

import { ChatMessage, Message } from './types';
import { config } from './config';
import { providers } from './providers';
import { getFallbackResponse } from './knowledge';

const failedProviders = new Set<string>();

function isPermanentError(error: any): boolean {
  const status = error?.status;
  const msg = error?.message?.toLowerCase() || '';
  return status === 401 || status === 403 || (msg.includes('key') && msg.includes('invalid'));
}

export async function generateReply(
  history: Message[],
  userMessage: string
): Promise<string> {
  const chatHistory: ChatMessage[] = history.map((m) => ({
    role: m.sender === 'user' ? 'user' : 'assistant',
    content: m.text,
  }));

  for (const provider of providers) {
    if (!provider.isAvailable() || failedProviders.has(provider.name)) continue;

    try {
      console.log(`Trying ${provider.name}...`);
      const reply = await provider.generate(chatHistory, userMessage, config.maxTokens);
      if (reply) {
        console.log(`✅ ${provider.name} success`);
        return reply;
      }
    } catch (error: any) {
      console.error(`❌ ${provider.name}:`, error.message);
      if (isPermanentError(error)) {
        failedProviders.add(provider.name);
      }
    }
  }

  console.log('Using fallback response');
  return getFallbackResponse(userMessage);
}

