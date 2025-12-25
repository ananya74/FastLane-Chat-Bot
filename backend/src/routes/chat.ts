/**
 * Chat Routes
 * Single Responsibility: HTTP request handling for chat endpoints
 */

import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import {
  createConversation,
  getConversation,
  updateConversationTimestamp,
  addMessage,
  getMessages,
  getRecentMessages,
} from '../db';
import { generateReply } from '../llm';

const router = Router();

// Types
interface ChatMessageRequest {
  message: string;
  sessionId?: string;
}

interface ChatMessageResponse {
  reply: string;
  sessionId: string;
}

interface ErrorResponse {
  error: string;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: string;
}

/**
 * Validate and sanitize user message
 */
function validateMessage(message: unknown): ValidationResult {
  if (typeof message !== 'string') {
    return { valid: false, error: 'Message must be a string' };
  }

  const trimmed = message.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  if (trimmed.length > config.maxMessageLength) {
    // Truncate instead of rejecting for better UX
    return {
      valid: true,
      sanitized: trimmed.substring(0, config.maxMessageLength),
    };
  }

  return { valid: true, sanitized: trimmed };
}

/**
 * Get or create a conversation session
 */
function getOrCreateSession(sessionId?: string): string {
  if (sessionId) {
    const existing = getConversation(sessionId);
    if (!existing) {
      createConversation(sessionId);
    }
    return sessionId;
  }

  const newSessionId = uuidv4();
  createConversation(newSessionId);
  return newSessionId;
}

/**
 * POST /chat/message - Send a message and get AI reply
 */
router.post('/message', async (req: Request, res: Response) => {
  try {
    const { message, sessionId } = req.body as ChatMessageRequest;

    // Validate message
    const validation = validateMessage(message);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error } as ErrorResponse);
    }

    const sanitizedMessage = validation.sanitized!;
    const conversationId = getOrCreateSession(sessionId);

    // Save user message
    addMessage(conversationId, 'user', sanitizedMessage);
    updateConversationTimestamp(conversationId);

    // Get conversation history (excluding current message)
    const history = getRecentMessages(conversationId, config.maxHistoryMessages);
    const historyWithoutCurrent = history.slice(0, -1);

    // Generate AI reply
    let aiReply: string;
    try {
      aiReply = await generateReply(historyWithoutCurrent, sanitizedMessage);
    } catch (llmError: any) {
      aiReply =
        llmError.message ||
        "I'm sorry, I couldn't process your request. Please try again.";
    }

    // Save AI message
    addMessage(conversationId, 'ai', aiReply);
    updateConversationTimestamp(conversationId);

    return res.json({
      reply: aiReply,
      sessionId: conversationId,
    } as ChatMessageResponse);
  } catch (error) {
    console.error('Chat message error:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred. Please try again.',
    } as ErrorResponse);
  }
});

/**
 * GET /chat/:sessionId - Get conversation history
 */
router.get('/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId || typeof sessionId !== 'string') {
      return res
        .status(400)
        .json({ error: 'Session ID is required' } as ErrorResponse);
    }

    const conversation = getConversation(sessionId);

    if (!conversation) {
      return res
        .status(404)
        .json({ error: 'Conversation not found' } as ErrorResponse);
    }

    const messages = getMessages(sessionId);

    return res.json({
      sessionId,
      messages: messages.map((m) => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        timestamp: m.created_at,
      })),
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred. Please try again.',
    } as ErrorResponse);
  }
});

export default router;
