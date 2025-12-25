/**
 * GET /api/chat/[sessionId] - Get conversation history
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getConversation } from '../storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.query;

    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const conversation = getConversation(sessionId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    return res.status(200).json({
      sessionId,
      messages: conversation.messages,
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
}

