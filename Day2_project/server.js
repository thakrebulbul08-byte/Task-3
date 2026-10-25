
const express = require("express");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(express.json());

// Test the database connection and users table
app.get("/health", (req, res) => {
  db.get(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users'",
    (err, row) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: err.message
        });
      }

      if (!row) {
        return res.status(500).json({
          status: "error",
          message: "Users table not found"
        });
      }

      res.json({
        status: "success",
        message: "Backend and database are connected!",
        table: row.name
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
