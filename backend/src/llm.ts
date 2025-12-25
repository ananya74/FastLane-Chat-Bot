/**
 * LLM Service
 * Single Responsibility: Orchestrates LLM provider fallback logic
 */

import { Message } from './db';
import { config } from './config';
import { ChatMessage, ProviderName } from './types';
import { providers } from './providers';
import { getFallbackResponse } from './knowledge/fallback-responses';

// Track providers that have permanently failed (invalid API key)
const failedProviders: Set<ProviderName> = new Set();

/**
 * Convert database messages to LLM chat format
 */
function formatMessagesForLLM(messages: Message[]): ChatMessage[] {
  return messages.map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text,
  }));
}

/**
 * Check if an error indicates a permanent failure (invalid API key)
 */
function isPermanentError(error: any): boolean {
  const status = error?.status || error?.response?.status;
  const message = error?.message?.toLowerCase() || '';

  // HTTP 401/403 = authentication/authorization failure
  if (status === 401 || status === 403) return true;

  // Check error messages for API key issues
  const keyErrorPatterns = [
    'invalid',
    'api key not valid',
    'incorrect api key',
    'authentication',
  ];
  return keyErrorPatterns.some(
    (pattern) => message.includes(pattern) && message.includes('key')
  );
}

/**
 * Generate a reply using available LLM providers with automatic fallback
 */
export async function generateReply(
  conversationHistory: Message[],
  userMessage: string
): Promise<string> {
  const history = formatMessagesForLLM(conversationHistory);

  // Try each provider in order
  for (const provider of providers) {
    // Skip if provider is unavailable or has permanently failed
    if (!provider.isAvailable() || failedProviders.has(provider.name)) {
      continue;
    }

    console.log(`Trying LLM provider: ${provider.name}`);

    try {
      const reply = await provider.generate(history, userMessage, config.maxTokens);
      console.log(`Success with ${provider.name}`);
      return reply;
    } catch (error: any) {
      console.error(`${provider.name} failed:`, error.message || error);

      // Mark provider as permanently failed if it's an API key issue
      if (isPermanentError(error)) {
        console.log(`Marking ${provider.name} as permanently failed`);
        failedProviders.add(provider.name);
      }
    }
  }

  // All providers failed - use fallback responses
  console.log('All LLM providers failed, using fallback responses');
  return getFallbackResponse(userMessage);
}

/**
 * Reset failed providers list (useful when API keys are updated)
 */
export function resetFailedProviders(): void {
  failedProviders.clear();
  console.log('Reset failed providers list');
}
