/**
 * LLM Providers for serverless
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from './config';
import { ChatMessage, LLMProvider } from './types';
import { SYSTEM_PROMPT } from './knowledge';

// Lazy clients
let openaiClient: OpenAI | null = null;
let anthropicClient: Anthropic | null = null;
let geminiClient: GoogleGenerativeAI | null = null;

// OpenAI Provider
async function generateOpenAI(
  history: ChatMessage[],
  message: string,
  maxTokens: number
): Promise<string> {
  if (!openaiClient && config.openai.apiKey) {
    openaiClient = new OpenAI({ apiKey: config.openai.apiKey });
  }
  if (!openaiClient) throw new Error('OpenAI not configured');

  const response = await openaiClient.chat.completions.create({
    model: config.openai.model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: message },
    ],
    max_tokens: maxTokens,
    temperature: config.llm.temperature,
  });

  return response.choices[0]?.message?.content?.trim() || '';
}

// Gemini Provider
async function generateGemini(
  history: ChatMessage[],
  message: string,
  maxTokens: number
): Promise<string> {
  if (!geminiClient && config.gemini.apiKey) {
    geminiClient = new GoogleGenerativeAI(config.gemini.apiKey);
  }
  if (!geminiClient) throw new Error('Gemini not configured');

  const model = geminiClient.getGenerativeModel({ model: config.gemini.model });
  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: 'System: ' + SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: 'Understood! How can I help?' }] },
      ...history.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    ],
    generationConfig: { maxOutputTokens: maxTokens, temperature: config.llm.temperature },
  });

  const result = await chat.sendMessage(message);
  return result.response.text().trim();
}

// Anthropic Provider
async function generateAnthropic(
  history: ChatMessage[],
  message: string,
  maxTokens: number
): Promise<string> {
  if (!anthropicClient && config.anthropic.apiKey) {
    anthropicClient = new Anthropic({ apiKey: config.anthropic.apiKey });
  }
  if (!anthropicClient) throw new Error('Anthropic not configured');

  const response = await anthropicClient.messages.create({
    model: config.anthropic.model,
    max_tokens: maxTokens,
    system: SYSTEM_PROMPT,
    messages: [
      ...history.map((m) => ({
        role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: m.content,
      })),
      { role: 'user', content: message },
    ],
  });

  const block = response.content.find((b) => b.type === 'text');
  return block?.type === 'text' ? block.text.trim() : '';
}

export const providers: LLMProvider[] = [
  { name: 'openai', isAvailable: () => !!config.openai.apiKey, generate: generateOpenAI },
  { name: 'gemini', isAvailable: () => !!config.gemini.apiKey, generate: generateGemini },
  { name: 'anthropic', isAvailable: () => !!config.anthropic.apiKey, generate: generateAnthropic },
];

