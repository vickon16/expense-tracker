export const databaseName = "expense-tracker.db";

export const categoryTableQuery = `
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS category (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name VARCHAR(100) NOT NULL,
    createdAt TEXT DEFAULT (datetime('now', 'localtime'))
  );
`;

export const transactionTableQuery = `
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
  categoryId INTEGER NOT NULL,
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  createdAt TEXT DEFAULT (datetime('now', 'localtime')),

  FOREIGN KEY (categoryId) REFERENCES category(id)
  );
`;

// db.execSync("DROP TABLE IF EXISTS transactions");
// db.execSync("DROP TABLE IF EXISTS category");
