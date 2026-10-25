

const session = require("express-session");
const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./database");

const app = express();
app.use(session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: false
}));
const PORT = 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  db.get(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users'",
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      res.json({
        status: row ? "success" : "error",
        message: row ? "Database connected!" : "Users table missing"
      });
    }
  );
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required."
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters."
    });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name.trim(), email.trim().toLowerCase(), hash],
      function (err) {
        if (err) {
          if (err.message.includes("UNIQUE")) {
            return res.status(409).json({
              message: "Email is already registered."
            });
          }

          return res.status(500).json({
            message: "Could not register user."
          });
        }

        res.status(201).json({
          message: "Registration successful!",
          userId: this.lastID
        });
      }
    );
  } catch {
    res.status(500).json({ message: "Password processing failed." });
  }
});
// Protected dashboard
app.get("/dashboard", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    db.get(
        "SELECT id, name, email FROM users WHERE id = ?",
        [req.session.userId],
        (err, user) => {
            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (!user) {
                return res.status(401).json({
                    message: "User not found. Please login again."
                });
            }

            res.json({
                message: "Welcome to your dashboard!",
                user: user
            });
        }
    );
});
// Logout API
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                message: "Logout failed"
            });
        }

        res.clearCookie("connect.sid", {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: false
        });

        res.json({
            message: "Logout successful!"
        });
    });
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
