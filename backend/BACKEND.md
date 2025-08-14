# Backend - Google ID token verifier

## What it does
- Exposes POST /auth/google that accepts `{ id_token }` from the frontend.
- Verifies the token with Google (using the configured `GOOGLE_CLIENT_ID`).
- Upserts a user record in a SQLite database (`DB_PATH` environment variable).

## Run locally (without Docker)
1. Install dependencies: `npm ci`
2. Set environment variables (see project `.env`)
3. Run: `node src/app.js`

## Environment variables
- `GOOGLE_CLIENT_ID` (required)
- `BACKEND_PORT` (defaults to 3000)
- `DB_PATH` (defaults to `./data/database.sqlite`)
- `FRONTEND_ORIGIN` (allowed origin for CORS)
