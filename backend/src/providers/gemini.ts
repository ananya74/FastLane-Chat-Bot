/**
 * Google Gemini LLM Provider
 * Single Responsibility: Handles only Gemini API interactions
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';
import { ChatMessage, LLMProvider } from '../types';
import { SYSTEM_PROMPT } from '../knowledge/store-knowledge';

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI | null {
  if (!config.gemini.apiKey) return null;
  if (!client) {
    client = new GoogleGenerativeAI(config.gemini.apiKey);
  }
  return client;
}

async function generate(
  history: ChatMessage[],
  userMessage: string,
  maxTokens: number
): Promise<string> {
  const geminiClient = getClient();
  if (!geminiClient) throw new Error('Gemini client not available');

  const model = geminiClient.getGenerativeModel({ model: config.gemini.model });

  // Convert history to Gemini format
  const formattedHistory = history.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: 'System: ' + SYSTEM_PROMPT }] },
      {
        role: 'model',
        parts: [
          {
            text: 'Understood! I am Ella, the FastLane support agent. How can I help you today?',
          },
        ],
      },
      ...formattedHistory,
    ],
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: config.llm.temperature,
    },
  });

  const result = await chat.sendMessage(userMessage);
  const reply = result.response.text().trim();
  if (!reply) throw new Error('Empty response from Gemini');
  return reply;
}

export const geminiProvider: LLMProvider = {
  name: 'gemini',
  isAvailable: () => !!config.gemini.apiKey,
  generate,
};

