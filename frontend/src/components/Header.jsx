import React from 'react';
import { Bot, Trash2 } from 'lucide-react';
import { AGENT_NAME } from '../constants';

export function Header({ onClear }) {
  return (
    <header className="chat-header">
      <div className="header-left">
        <div className="agent-avatar">
          <Bot size={18} />
        </div>

        <div className="header-text">
          <h1>{AGENT_NAME}</h1>
          <span className="status">
            <span className="status-dot" />
            Online
          </span>
        </div>
      </div>

      <button
        className="clear-btn"
        onClick={onClear}
        title="New conversation"
        aria-label="Clear conversation"
      >
        <Trash2 size={16} />
      </button>
    </header>
  );
}
