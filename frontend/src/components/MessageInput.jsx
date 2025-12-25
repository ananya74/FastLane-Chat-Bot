/**
 * MessageInput Component
 * Single Responsibility: Handles message input and submission
 */

import React, { useRef, useEffect } from 'react';
import { MAX_MESSAGE_LENGTH } from '../constants';

export function MessageInput({ onSend, disabled }) {
  const [value, setValue] = React.useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSend(value);
      setValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const charCountWarning = value.length > MAX_MESSAGE_LENGTH * 0.9;

  return (
    <div className="input-area">
      <div className="input-container">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows="1"
          disabled={disabled}
          maxLength={MAX_MESSAGE_LENGTH}
        />
        <button
          className="send-btn"
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 2L11 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 2L15 22L11 13L2 9L22 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="input-footer">
        <span className={`char-count ${charCountWarning ? 'warning' : ''}`}>
          {value.length}/{MAX_MESSAGE_LENGTH}
        </span>
      </div>
    </div>
  );
}

