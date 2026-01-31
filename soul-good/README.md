# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Local backend (SQLite) — development

This project now includes a local Express + SQLite backend (in `/server`) used for authentication, favorites, and cart storage.

- Start the backend: cd ../server && npm install && npm run dev
- Start the frontend: npm install && npm run dev (in `soul-good`)

Important notes:
- Users sign in by providing their Gmail address only (no password). The backend requires a Gmail address (example@gmail.com).
- Passwords are stored in plain text (by design, and may be null for Gmail-only sign-ins).
- Session persistence ("One-Time Login") is handled client-side using `localStorage` — once logged in the user info is stored locally and remains until manually removed.

Refer to `/server/README.md` for API details.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
