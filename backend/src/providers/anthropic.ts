/**
 * Anthropic Claude LLM Provider
 * Single Responsibility: Handles only Anthropic API interactions
 */

import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config';
import { ChatMessage, LLMProvider } from '../types';
import { SYSTEM_PROMPT } from '../knowledge/store-knowledge';

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!config.anthropic.apiKey) return null;
  if (!client) {
    client = new Anthropic({ apiKey: config.anthropic.apiKey });
  }
  return client;
}

async function generate(
  history: ChatMessage[],
  userMessage: string,
  maxTokens: number
): Promise<string> {
  const anthropicClient = getClient();
  if (!anthropicClient) throw new Error('Anthropic client not available');

  // Convert history to Anthropic format (no system role in messages)
  const messages = [
    ...history.map((m) => ({
      role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
      content: m.content,
    })),
    { role: 'user' as const, content: userMessage },
  ];

  const response = await anthropicClient.messages.create({
    model: config.anthropic.model,
    max_tokens: maxTokens,
    system: SYSTEM_PROMPT,
    messages,
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  const reply = textBlock?.type === 'text' ? textBlock.text.trim() : '';
  if (!reply) throw new Error('Empty response from Anthropic');
  return reply;
}

export const anthropicProvider: LLMProvider = {
  name: 'anthropic',
  isAvailable: () => !!config.anthropic.apiKey,
  generate,
};

