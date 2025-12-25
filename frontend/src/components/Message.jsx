/**
 * Message Component
 * Single Responsibility: Renders a single chat message
 */

import React from 'react';
import { Bot } from 'lucide-react';

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function Message({ message }) {
  const { sender, text, timestamp } = message;

  return (
    <div className={`message ${sender}`}>
      <div className="message-content">
        {sender === 'ai' && (
          <div className="avatar">
            <Bot size={18} />
          </div>
        )}
        <div className="bubble">
          <p>{text}</p>
          <span className="timestamp">{formatTime(timestamp)}</span>
        </div>
      </div>
    </div>
  );
}

