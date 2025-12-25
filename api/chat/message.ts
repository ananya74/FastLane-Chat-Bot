/**
 * POST /api/chat/message - Serverless function
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { generateReply } from '../llm';
import {
  getConversation,
  createConversation,
  addMessage,
  getRecentMessages,
} from '../storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId } = req.body || {};

    // Validate message
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let text = message.trim();
    if (text.length > config.maxMessageLength) {
      text = text.substring(0, config.maxMessageLength);
    }

    // Get or create session
    let conversationId = sessionId;
    if (conversationId) {
      if (!getConversation(conversationId)) {
        createConversation(conversationId);
      }
    } else {
      conversationId = uuidv4();
      createConversation(conversationId);
    }

    // Save user message
    addMessage(conversationId, 'user', text);

    // Get history (without current message)
    const history = getRecentMessages(conversationId, config.maxHistoryMessages);
    const historyWithoutCurrent = history.slice(0, -1);

    // Generate reply
    let reply: string;
    try {
      reply = await generateReply(historyWithoutCurrent, text);
    } catch (err: any) {
      reply = err.message || "Sorry, I couldn't process that. Please try again.";
    }

    // Save AI message
    addMessage(conversationId, 'ai', reply);

    return res.status(200).json({
      reply,
      sessionId: conversationId,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
}

