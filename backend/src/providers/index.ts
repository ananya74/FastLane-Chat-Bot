/**
 * LLM Provider Registry
 * Single Responsibility: Manages provider registration and exports
 */

import { LLMProvider } from '../types';
import { openaiProvider } from './openai';
import { geminiProvider } from './gemini';
import { anthropicProvider } from './anthropic';

// Providers in order of preference
export const providers: LLMProvider[] = [
  openaiProvider,
  geminiProvider,
  anthropicProvider,
];

export { openaiProvider, geminiProvider, anthropicProvider };

