/**
 * Simple in-memory storage for serverless
 * Note: Data persists only within the same function instance
 * For production, use Vercel KV, Upstash Redis, or a database
 */

import { Conversation, Message } from './types';

// In-memory store (reset on cold start)
const conversations = new Map<string, Conversation>();

export function getConversation(id: string): Conversation | undefined {
  return conversations.get(id);
}

export function createConversation(id: string): Conversation {
  const conversation: Conversation = {
    id,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  conversations.set(id, conversation);
  return conversation;
}

export function addMessage(
  conversationId: string,
  sender: 'user' | 'ai',
  text: string
): Message {
  let conversation = conversations.get(conversationId);
  if (!conversation) {
    conversation = createConversation(conversationId);
  }

  const message: Message = {
    id: Date.now(),
    sender,
    text,
    timestamp: new Date().toISOString(),
  };

  conversation.messages.push(message);
  conversation.updatedAt = new Date().toISOString();
  conversations.set(conversationId, conversation);

  return message;
}

export function getMessages(conversationId: string): Message[] {
  return conversations.get(conversationId)?.messages || [];
}

export function getRecentMessages(conversationId: string, limit: number): Message[] {
  const messages = getMessages(conversationId);
  return messages.slice(-limit);
}

