# Spur AI Live Chat Agent

A mini AI support agent for a live chat widget, built with clean architecture and SOLID principles.

## Features

- **Multi-Provider LLM Support**: OpenAI, Gemini, Anthropic with automatic fallback
- **Real-time Chat UI**: Modern glassmorphism design with React
- **Conversation Persistence**: SQLite database stores all conversations
- **Clean Architecture**: Follows SRP, DRY, and SOLID principles
- **Robust Error Handling**: Graceful degradation with fallback responses

## Tech Stack

- **Backend**: Node.js + TypeScript + Express
- **Frontend**: React + Vite
- **Database**: SQLite (via sql.js)
- **LLM**: OpenAI / Google Gemini / Anthropic Claude

## Project Structure

```
spur/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server entry
│   │   ├── config.ts             # Centralized configuration
│   │   ├── types.ts              # Shared type definitions
│   │   ├── db.ts                 # Database operations
│   │   ├── llm.ts                # LLM orchestration service
│   │   ├── providers/            # LLM Provider implementations
│   │   │   ├── index.ts          # Provider registry
│   │   │   ├── openai.ts         # OpenAI provider
│   │   │   ├── gemini.ts         # Google Gemini provider
│   │   │   └── anthropic.ts      # Anthropic Claude provider
│   │   ├── knowledge/            # Domain knowledge
│   │   │   ├── store-knowledge.ts    # Store info & prompts
│   │   │   └── fallback-responses.ts # Fallback responses
│   │   └── routes/
│   │       └── chat.ts           # Chat API endpoints
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── main.jsx              # React entry point
│   │   ├── App.jsx               # Main app component
│   │   ├── App.css               # App styles
│   │   ├── index.css             # Global styles
│   │   ├── constants.js          # Shared constants
│   │   ├── services/
│   │   │   └── api.js            # API service layer
│   │   ├── hooks/
│   │   │   └── useChat.js        # Chat state management
│   │   └── components/
│   │       ├── index.js          # Component exports
│   │       ├── Header.jsx        # Chat header
│   │       ├── WelcomeScreen.jsx # Welcome & quick actions
│   │       ├── Message.jsx       # Chat message bubble
│   │       ├── TypingIndicator.jsx # Typing animation
│   │       ├── MessageInput.jsx  # Input field
│   │       └── ErrorBanner.jsx   # Error display
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Architecture Principles

### Backend

| Principle | Implementation |
|-----------|----------------|
| **SRP** | Each file has one responsibility (config, types, providers, routes) |
| **DRY** | Centralized config, shared types, reusable provider interface |
| **Open/Closed** | New providers can be added without modifying existing code |
| **Dependency Inversion** | LLM service depends on Provider interface, not concrete implementations |

### Frontend

| Principle | Implementation |
|-----------|----------------|
| **SRP** | Separate components, hooks, services, constants |
| **DRY** | Shared constants, reusable components |
| **Composition** | App composes smaller, focused components |
| **Custom Hooks** | Business logic separated from UI in `useChat` hook |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- At least one LLM API key (OpenAI, Gemini, or Anthropic)

### 1. Backend Setup

```bash
cd backend
npm install

# Create .env file with your API keys
cp env.example .env
# Edit .env with your actual API keys

npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Open http://localhost:5173

## Environment Configuration

```env
# LLM API Keys (at least one required)
# System tries: OpenAI → Gemini → Anthropic → Fallback

OPENAI_API_KEY=sk-your-key
GEMINI_API_KEY=your-gemini-key        # Free tier available!
ANTHROPIC_API_KEY=sk-ant-your-key

# Optional model overrides
OPENAI_MODEL=gpt-3.5-turbo
GEMINI_MODEL=gemini-pro
ANTHROPIC_MODEL=claude-3-haiku-20240307

# Server config
PORT=3001
MAX_TOKENS=500
MAX_HISTORY_MESSAGES=10
```

## API Endpoints

### POST /chat/message

Send a message and get AI reply.

```json
// Request
{ "message": "What's your return policy?", "sessionId": "optional" }

// Response
{ "reply": "Our return policy...", "sessionId": "uuid" }
```

### GET /chat/:sessionId

Get conversation history.

## LLM Fallback System

The system automatically tries providers in order:

```
1. OpenAI (if OPENAI_API_KEY set)
   ↓ (on failure)
2. Gemini (if GEMINI_API_KEY set)
   ↓ (on failure)
3. Anthropic (if ANTHROPIC_API_KEY set)
   ↓ (on failure)
4. Fallback responses (keyword-based)
```
### LLM Integration Notes

#### Prompting Strategy

#### System prompt:

You are a helpful customer support agent for an e-commerce store.
Answer clearly, concisely, and politely.

#### Context included:

Recent conversation history
Store FAQ / policies (shipping, returns, support hours)

#### Guardrails:

Max message length enforced on client & server
Limited conversation history to control token usage
Graceful fallback on API errors or timeouts

- **Permanent failures** (invalid API key) are remembered to avoid retries
- **Temporary failures** (rate limits) will retry on next request

## Project Structure for Vercel

```
spur/
├── api/                    # Serverless functions
│   ├── chat/
│   │   ├── message.ts      # POST /api/chat/message
│   │   └── [sessionId].ts  # GET /api/chat/:sessionId
│   ├── health.ts           # GET /api/health
│   ├── config.ts
│   ├── llm.ts
│   ├── providers.ts
│   ├── knowledge.ts
│   ├── storage.ts
│   └── types.ts
├── frontend/               # React app (Vite)
├── backend/                # Local dev server (not deployed)
├── vercel.json
└── package.json
```

### Trade-offs

-SQLite used locally instead of managed Postgres
-Prompt-based knowledge instead of RAG/vector search
-No authentication (intentionally kept simple)

#### If I had more time…

-Add Postgres (Neon/Supabase) for production
-Introduce RAG with embeddings for richer knowledge
-Add streaming responses (token-by-token)
-Improve analytics (response time, resolution rate)
