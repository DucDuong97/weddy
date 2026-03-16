# Wedding Server

Simple Node.js/Express server with:
- `POST /rsvp` — receives RSVP responses from the wedding site
- `GET /admin` — UI to manage invitations (create, view responses, copy URLs)

Data is stored in a **Notion database**.

## Notion setup (one-time)

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations) → **New integration** → give it a name → **Submit**.  
   Copy the **Internal Integration Token** → this is your `NOTION_TOKEN`.

2. In Notion, create a new **database** (full-page or inline) with these exact properties:

   | Property name | Type |
   |---|---|
   | Name | Title |
   | URL | URL |
   | Attending | Select (options: `Pending`, `Yes`, `No`) |
   | Message | Text |
   | RespondedAt | Date |

3. Open the database, click **Share** (top-right) → **Invite** your integration.

4. Copy the database ID from its URL:  
   `https://notion.so/yourworkspace/<DATABASE_ID>?v=...`  
   This is your `NOTION_DATABASE_ID`.

## Local dev

```bash
cd server
npm install

NOTION_TOKEN=secret_xxx NOTION_DATABASE_ID=xxx npm run dev
```

Or create a `.env` file (use `dotenv` or export vars in your shell).  
Open http://localhost:3000/admin

## Deployment — Railway (simplest)

1. Push the repo to GitHub.
2. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo**.
3. Set **Root Directory** to `server`.
4. In **Variables**, add:
   - `NOTION_TOKEN` = your integration token
   - `NOTION_DATABASE_ID` = your database ID
   - `INVITE_BASE_URL` = `https://beourguest.space`
5. Copy the generated Railway URL → set it as `SERVER_URL` in `script.js` line 1.

Free tier, auto-deploys on every push.
