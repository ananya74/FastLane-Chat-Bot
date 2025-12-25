/**
 * App Component
 * Single Responsibility: Composes UI components and manages layout
 */

import React, { useEffect, useRef } from 'react';
import './App.css';
import { useChat } from './hooks/useChat';
import {
  Header,
  WelcomeScreen,
  Message,
  TypingIndicator,
  MessageInput,
  ErrorBanner,
} from './components';

function App() {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearConversation,
    clearError,
  } = useChat();

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="chat-container">
      <Header onClear={clearConversation} />

      <div className="messages-area">
        {messages.length === 0 ? (
          <WelcomeScreen onQuickAction={sendMessage} />
        ) : (
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))
        )}

        {isLoading && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      <ErrorBanner message={error} onDismiss={clearError} />

      <MessageInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}

export default App;
