/**
 * WelcomeScreen Component
 * Single Responsibility: Renders welcome message and quick actions
 */

import React from 'react';
import { Bot } from 'lucide-react';
import { STORE_NAME, AGENT_NAME, QUICK_ACTIONS } from '../constants';

export function WelcomeScreen({ onQuickAction }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-hero">
        <div className="welcome-icon">
          <Bot size={28} />
        </div>

        <h2>Hi, I’m {AGENT_NAME}</h2>
        <p>
          I can help with orders, returns, shipping, and general questions.
        </p>
      </div>

      <div className="quick-actions">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => onQuickAction(action.question)}
            className="quick-action"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

