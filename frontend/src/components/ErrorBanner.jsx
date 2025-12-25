/**
 * ErrorBanner Component
 * Single Responsibility: Displays error messages
 */

import React from 'react';

export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="error-banner">
      <span>{message}</span>
      <button onClick={onDismiss}>×</button>
    </div>
  );
}

