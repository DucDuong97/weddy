# Wedding Server

Simple Node.js/Express server with:
- `POST /rsvp` — receives RSVP responses from the wedding site
- `GET /admin` — UI to manage invitations (create, view responses, copy URLs)

Data is stored in `data.json` (auto-created, gitignore it in prod).

## Local dev

```bash
cd server
npm install
npm run dev        # uses --watch (Node 18+)
```

Open http://localhost:3000/admin

Set `INVITE_BASE_URL` env var if needed (default: `https://beourguest.space`).

---

## Deployment — Railway (simplest)

1. Push the repo to GitHub (the whole `wedding/` repo is fine).
2. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo**.
3. Pick your repo, then set **Root Directory** to `server`.
4. Railway auto-detects Node and runs `npm start`.
5. (Optional) In **Variables**, set `INVITE_BASE_URL=https://beourguest.space`.
6. Copy the generated Railway URL and set it as `SERVER_URL` in the wedding site's `script.js`.

That's it — free tier, zero config, auto-deploys on every push.
