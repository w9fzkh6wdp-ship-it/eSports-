import Anthropic from "@anthropic-ai/sdk";
import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join(process.cwd(), "data", "app.db"));

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY,
    phone_number TEXT UNIQUE NOT NULL,
    api_id TEXT NOT NULL,
    api_hash TEXT NOT NULL,
    session_data TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY,
    account_id INTEGER NOT NULL,
    group_id TEXT NOT NULL,
    group_name TEXT NOT NULL,
    group_username TEXT,
    member_count INTEGER DEFAULT 0,
    is_selected INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
  );

  CREATE TABLE IF NOT EXISTS broadcasts (
    id INTEGER PRIMARY KEY,
    account_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    delay_seconds INTEGER DEFAULT 5,
    repeat_count INTEGER DEFAULT 1,
    auto_repeat INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    sent_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    started_at DATETIME,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
  );

  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY,
    broadcast_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    group_id TEXT NOT NULL,
    group_name TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending',
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (broadcast_id) REFERENCES broadcasts(id),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
  );
`);

export default db;
