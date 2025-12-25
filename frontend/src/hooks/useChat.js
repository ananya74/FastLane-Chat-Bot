/**
 * useChat Hook
 * Single Responsibility: Manages chat state and business logic
 */

import { useState, useEffect, useCallback } from 'react';
import { MAX_MESSAGE_LENGTH, STORAGE_KEY } from '../constants';
import { sendChatMessage, loadConversation } from '../services/api';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);

  // Load session on mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem(STORAGE_KEY);
    if (savedSessionId) {
      setSessionId(savedSessionId);
      loadExistingConversation(savedSessionId);
    }
  }, []);

  // Load existing conversation
  const loadExistingConversation = async (id) => {
    try {
      const data = await loadConversation(id);
      if (data) {
        setMessages(
          data.messages.map((m) => ({
            id: m.id,
            sender: m.sender,
            text: m.text,
            timestamp: new Date(m.timestamp),
          }))
        );
      } else {
        // Conversation not found, clear session
        localStorage.removeItem(STORAGE_KEY);
        setSessionId(null);
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  };

  // Send message
  const sendMessage = useCallback(
    async (messageText) => {
      const trimmed = messageText.trim();

      if (!trimmed || isLoading) return false;

      if (trimmed.length > MAX_MESSAGE_LENGTH) {
        setError(`Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.`);
        return false;
      }

      setError(null);

      const userMessage = {
        id: Date.now(),
        sender: 'user',
        text: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const data = await sendChatMessage(trimmed, sessionId);

        // Update session ID if new
        if (data.sessionId && data.sessionId !== sessionId) {
          setSessionId(data.sessionId);
          localStorage.setItem(STORAGE_KEY, data.sessionId);
        }

        const aiMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          text: data.reply,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        return true;
      } catch (err) {
        setError(err.message || 'Failed to send message. Please try again.');
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, sessionId]
  );

  // Clear conversation
  const clearConversation = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    localStorage.removeItem(STORAGE_KEY);
    setError(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearConversation,
    clearError,
  };
}

