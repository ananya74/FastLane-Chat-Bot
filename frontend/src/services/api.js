/**
 * API Service
 * Single Responsibility: Handles all API communication
 */

import { API_BASE } from '../constants';

/**
 * Send a chat message and get AI reply
 */
export async function sendChatMessage(message, sessionId) {
  const response = await fetch(`${API_BASE}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, sessionId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to send message');
  }

  return data;
}

/**
 * Load conversation history by session ID
 */
export async function loadConversation(sessionId) {
  const response = await fetch(`${API_BASE}/${sessionId}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to load conversation');
  }

  return response.json();
}

