const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const dbPath = path.join(__dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath);

// Initialize schema
const init = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT
      );
    `);

    // OTP table removed — OTP flow has been replaced by a direct login endpoint
    // (otps were previously used to store one-time codes)

    db.run(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        item_id INTEGER,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        item_id INTEGER,
        name TEXT,
        price REAL,
        quantity INTEGER,
        image TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);
  });
};

module.exports = { db, init };
