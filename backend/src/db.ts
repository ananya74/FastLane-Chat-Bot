import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(__dirname, '..', 'chat.db');

let db: SqlJsDatabase;

// Initialize the database
export async function initDatabase(): Promise<void> {
  const SQL = await initSqlJs();
  
  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id TEXT NOT NULL,
      sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
      text TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    )
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)`);
  
  saveDatabase();
}

// Save database to file
function saveDatabase(): void {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  conversation_id: string;
  sender: 'user' | 'ai';
  text: string;
  created_at: string;
}

// Create a new conversation
export function createConversation(id: string): Conversation {
  const now = new Date().toISOString();
  db.run('INSERT INTO conversations (id, created_at, updated_at) VALUES (?, ?, ?)', [id, now, now]);
  saveDatabase();
  
  return { id, created_at: now, updated_at: now };
}

// Get conversation by ID
export function getConversation(id: string): Conversation | undefined {
  const result = db.exec('SELECT id, created_at, updated_at FROM conversations WHERE id = ?', [id]);
  
  if (result.length === 0 || result[0].values.length === 0) {
    return undefined;
  }
  
  const row = result[0].values[0];
  return {
    id: row[0] as string,
    created_at: row[1] as string,
    updated_at: row[2] as string,
  };
}

// Update conversation timestamp
export function updateConversationTimestamp(id: string): void {
  const now = new Date().toISOString();
  db.run('UPDATE conversations SET updated_at = ? WHERE id = ?', [now, id]);
  saveDatabase();
}

// Add a message to a conversation
export function addMessage(
  conversationId: string,
  sender: 'user' | 'ai',
  text: string
): Message {
  const now = new Date().toISOString();
  db.run(
    'INSERT INTO messages (conversation_id, sender, text, created_at) VALUES (?, ?, ?, ?)',
    [conversationId, sender, text, now]
  );
  saveDatabase();
  
  // Get the last inserted ID
  const result = db.exec('SELECT last_insert_rowid()');
  const id = result[0].values[0][0] as number;
  
  return {
    id,
    conversation_id: conversationId,
    sender: sender as 'user' | 'ai',
    text,
    created_at: now,
  };
}

// Get all messages for a conversation
export function getMessages(conversationId: string): Message[] {
  const result = db.exec(
    'SELECT id, conversation_id, sender, text, created_at FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
    [conversationId]
  );
  
  if (result.length === 0) {
    return [];
  }
  
  return result[0].values.map((row) => ({
    id: row[0] as number,
    conversation_id: row[1] as string,
    sender: row[2] as 'user' | 'ai',
    text: row[3] as string,
    created_at: row[4] as string,
  }));
}

// Get recent messages for context (limited count)
export function getRecentMessages(conversationId: string, limit: number): Message[] {
  const result = db.exec(
    'SELECT id, conversation_id, sender, text, created_at FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT ?',
    [conversationId, limit]
  );
  
  if (result.length === 0) {
    return [];
  }
  
  // Reverse to get chronological order
  return result[0].values.reverse().map((row) => ({
    id: row[0] as number,
    conversation_id: row[1] as string,
    sender: row[2] as 'user' | 'ai',
    text: row[3] as string,
    created_at: row[4] as string,
  }));
}

export { db };
