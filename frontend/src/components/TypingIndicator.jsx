/**
 * TypingIndicator Component
 * Single Responsibility: Shows typing animation when AI is responding
 */

import React from 'react';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="message ai">
      <div className="message-content">
        <div className="avatar">
          <Bot size={18} />
        </div>
        <div className="bubble typing">
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

