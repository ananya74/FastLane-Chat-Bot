/**
 * OpenAI LLM Provider
 * Single Responsibility: Handles only OpenAI API interactions
 */

import OpenAI from 'openai';
import { config } from '../config';
import { ChatMessage, LLMProvider } from '../types';
import { SYSTEM_PROMPT } from '../knowledge/store-knowledge';

let client: OpenAI | null = null;

function getClient(): OpenAI | null {
  if (!config.openai.apiKey) return null;
  if (!client) {
    client = new OpenAI({ apiKey: config.openai.apiKey });
  }
  return client;
}

async function generate(
  history: ChatMessage[],
  userMessage: string,
  maxTokens: number
): Promise<string> {
  const openaiClient = getClient();
  if (!openaiClient) throw new Error('OpenAI client not available');

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history,
    { role: 'user', content: userMessage },
  ];

  const response = await openaiClient.chat.completions.create({
    model: config.openai.model,
    messages,
    max_tokens: maxTokens,
    temperature: config.llm.temperature,
  });

  const reply = response.choices[0]?.message?.content?.trim();
  if (!reply) throw new Error('Empty response from OpenAI');
  return reply;
}

export const openaiProvider: LLMProvider = {
  name: 'openai',
  isAvailable: () => !!config.openai.apiKey,
  generate,
};

