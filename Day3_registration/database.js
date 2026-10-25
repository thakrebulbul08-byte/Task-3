
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const db = new sqlite3.Database(
  path.join(__dirname, "users.db"),
  (err) => {
    if (err) {
      console.error("Database error:", err.message);
    } else {
      console.log("Database connected!");
    }
  }
);

const sql = fs.readFileSync(
  path.join(__dirname, "migrations", "001_create_users.sql"),
  "utf8"
);

db.exec(sql, (err) => {
  if (err) {
    console.error("Table creation failed:", err.message);
  } else {
    console.log("Users table created!");
  }
});

module.exports = db;
