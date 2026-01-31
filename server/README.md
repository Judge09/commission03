# Soul Good Server (Express + SQLite)

This is a lightweight backend for the Soul Good PWA used in development.

Features:
- SQLite DB (file: `database.sqlite`)
- Tables: `users`, `favorites`, `cart_items`
- Endpoints:
  - POST `/api/login` { email } - create or fetch a user by Gmail and return `{ user }` (Gmail-only login)
  - GET `/api/favorites?userId=` - list favorites
  - POST `/api/favorites` { userId, itemId } - add favorite
  - DELETE `/api/favorites` { userId, itemId } - remove favorite
  - GET `/api/cart?userId=` - list cart items
  - POST `/api/cart` { userId, itemId, name, price, quantity, image } - add/update cart
  - PUT `/api/cart/:id` { quantity } - update qty
  - DELETE `/api/cart/:id` - delete

Notes:
- Passwords are stored in plain text (by design for this refactor task).
- The server no longer uses OTPs; authentication is performed directly via `/api/login`.

To run:
1. cd server
2. npm install
3. npm run dev   # or `npm start` to run without nodemon

The frontend (Vite) expects the server at http://localhost:3001 by default.
