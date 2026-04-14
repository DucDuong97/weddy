# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Vietnamese wedding invitation website for "Dương Đức & Thanh Hằng". Two components:

| Component | Path | Purpose |
|-----------|------|---------|
| **Frontend** | `/workspace/` (root) | Static HTML/CSS/JS wedding site — no build step required |
| **Backend** | `/workspace/server/` | Express.js RSVP server using Notion API as the database |

### Running the frontend

Serve the root directory with any static file server on port 5501:

```bash
serve -l 5501 /workspace
```

- On `localhost`, the letter-seal loading screen is auto-skipped for faster dev iteration.
- Static assets (images, fonts) are loaded from BunnyNet CDN via `<base href="https://beourguest.b-cdn.net/">` in `index.html`. This means images load from the CDN even in local dev.
- Guest names are passed via URL query parameters: `?name=Name`, `?g=Name`, or `?n=<base64>`.

### Running the backend

```bash
cd server
NOTION_TOKEN=<token> NOTION_DATABASE_ID=<id> npm run dev
```

- Requires `NOTION_TOKEN` and `NOTION_DATABASE_ID` environment variables. The server exits immediately without them.
- `npm run dev` uses `node --watch index.js` for auto-reload on file changes.
- Runs on port 3000 by default (`PORT` env var to override).
- The frontend works fully without the backend — RSVP submission fails silently.
- `NOTION_TOKEN` and `NOTION_DATABASE_ID` secrets are only needed if you are working on the backend RSVP/admin features. For frontend-only work, skip them entirely.

### No lint/test/build tooling

This project has no linter, test framework, or build pipeline configured. The frontend is vanilla HTML/CSS/JS with no bundler. The backend is a single `index.js` Express file. `scripts/build-cdn.js` rewrites asset URLs for CDN deployment but is not part of the dev workflow.
