const express = require("express");
const { db, init } = require("./db");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

init();

// POST /api/login - create or fetch user by Gmail (no password required)
app.post("/api/login", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(422).json({ error: "Missing email" });
  if (!email.toLowerCase().endsWith("@gmail.com")) return res.status(422).json({ error: "Please use your Gmail address" });

  db.serialize(() => {
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!user) {
        db.run("INSERT INTO users (email, updated_at) VALUES (?, datetime('now'))", [email], function (err) {
          if (err) return res.status(500).json({ error: err.message });
          db.get("SELECT id, email FROM users WHERE id = ?", [this.lastID], (err, newUser) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.json({ ok: true, user: newUser });
          });
        });
      } else {
        db.get("SELECT id, email FROM users WHERE email = ?", [email], (err, updatedUser) => {
          if (err) return res.status(500).json({ error: err.message });
          return res.json({ ok: true, user: updatedUser });
        });
      }
    });
  });
});

// Favorites endpoints
app.get("/api/favorites", (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(422).json({ error: "Missing userId" });

  db.all("SELECT * FROM favorites WHERE user_id = ?", [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ ok: true, favorites: rows });
  });
});

app.post("/api/favorites", (req, res) => {
  const { userId, itemId } = req.body;
  if (!userId || !itemId) return res.status(422).json({ error: "Missing userId or itemId" });

  db.run("INSERT INTO favorites (user_id, item_id) VALUES (?, ?)", [userId, itemId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ ok: true, id: this.lastID });
  });
});

app.delete("/api/favorites", (req, res) => {
  const { userId, itemId } = req.body;
  if (!userId || !itemId) return res.status(422).json({ error: "Missing userId or itemId" });

  db.run("DELETE FROM favorites WHERE user_id = ? AND item_id = ?", [userId, itemId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ ok: true, deleted: this.changes });
  });
});

// Cart endpoints
app.get("/api/cart", (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(422).json({ error: "Missing userId" });

  db.all("SELECT * FROM cart_items WHERE user_id = ?", [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ ok: true, items: rows });
  });
});

app.post("/api/cart", (req, res) => {
  const { userId, itemId, name, price, quantity = 1, image } = req.body;
  if (!userId || !itemId) return res.status(422).json({ error: "Missing userId or itemId" });

  // If item exists for user, update quantity
  db.get("SELECT * FROM cart_items WHERE user_id = ? AND item_id = ?", [userId, itemId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      db.run("UPDATE cart_items SET quantity = quantity + ? WHERE id = ?", [quantity, row.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ ok: true });
      });
    } else {
      db.run("INSERT INTO cart_items (user_id, item_id, name, price, quantity, image) VALUES (?, ?, ?, ?, ?, ?)", [userId, itemId, name, price, quantity, image], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ ok: true, id: this.lastID });
      });
    }
  });
});

app.put("/api/cart/:id", (req, res) => {
  const id = req.params.id;
  const { quantity } = req.body;
  if (typeof quantity === 'undefined') return res.status(422).json({ error: "Missing quantity" });

  db.run("UPDATE cart_items SET quantity = ? WHERE id = ?", [quantity, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ ok: true });
  });
});

app.delete("/api/cart/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM cart_items WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ ok: true, deleted: this.changes });
  });
});

// Health
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
