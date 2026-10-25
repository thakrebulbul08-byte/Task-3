
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

// Create or open the database file
const db = new sqlite3.Database(
  path.join(__dirname, "users.db"),
  (err) => {
    if (err) {
      console.error("Database connection failed:", err.message);
    } else {
      console.log("Database connected successfully!");
    }
  }
);

// Execute the schema migration
const migration = fs.readFileSync(
  path.join(__dirname, "migrations", "001_create_users.sql"),
  "utf8"
);

db.exec(migration, (err) => {
  if (err) {
    console.error("Migration failed:", err.message);
  } else {
    console.log("Users table created successfully!");
  }
});

module.exports = db;
