import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'cats.db');
const db = new DatabaseSync(dbPath);

db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

/**
 * 初始化数据库表结构
 */
export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nickname TEXT NOT NULL,
      fur_color TEXT NOT NULL,
      location TEXT NOT NULL,
      personality TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS observation_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cat_id INTEGER NOT NULL,
      observed_at TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (cat_id) REFERENCES cats(id) ON DELETE CASCADE
    );
  `);
}

export default db;
