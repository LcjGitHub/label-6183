import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'feeding.db');
const db = new DatabaseSync(dbPath);

db.exec('PRAGMA journal_mode = WAL');

/**
 * 初始化数据库表结构
 */
export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS feeding_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      feeding_date TEXT NOT NULL,
      location TEXT NOT NULL,
      cat_food_type TEXT NOT NULL,
      quantity TEXT NOT NULL,
      remark TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS health_followups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cat_nickname TEXT NOT NULL,
      followup_date TEXT NOT NULL,
      weight REAL NOT NULL,
      mental_status TEXT NOT NULL,
      went_doctor INTEGER NOT NULL DEFAULT 0,
      remark TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS cat_sightings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cat_nickname TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      sighting_time TEXT NOT NULL,
      location_description TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS adoption_intentions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      applicant_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      cat_nickname TEXT NOT NULL,
      application_date TEXT NOT NULL,
      application_status TEXT NOT NULL DEFAULT '待审核',
      remark TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS volunteer_schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      volunteer_name TEXT NOT NULL,
      duty_date TEXT NOT NULL,
      area TEXT NOT NULL,
      phone TEXT NOT NULL,
      is_arrived INTEGER NOT NULL DEFAULT 0,
      remark TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

export default db;
