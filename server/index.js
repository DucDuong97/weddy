const express = require("express");
const cors = require("cors");
const { Client } = require("@notionhq/client");

const app = express();
const PORT = process.env.PORT || 3000;
const INVITE_BASE_URL = (process.env.INVITE_BASE_URL || "https://beourguest.space").replace(/\/$/, "");
const DB_ID = process.env.NOTION_DATABASE_ID;

const notion = new Client({ auth: process.env.NOTION_TOKEN });

app.use(cors());
app.use(express.json());

// ── Notion helpers ────────────────────────────────────────────────────────────
const pageToInvitation = (page) => {
  const props = page.properties;
  const status = props.Attending?.select?.name ?? "Pending";
  return {
    id: page.id,
    name: props.Name?.title?.[0]?.plain_text ?? "",
    url: props.URL?.url ?? "",
    createdAt: page.created_time,
    rsvp: status === "Pending" ? null : {
      attending: status === "Yes",
      message: props.Message?.rich_text?.[0]?.plain_text ?? "",
      respondedAt: props.RespondedAt?.date?.start ?? null,
    },
  };
};

const getInvitations = async () => {
  const res = await notion.databases.query({
    database_id: DB_ID,
    sorts: [{ timestamp: "created_time", direction: "descending" }],
  });
  return res.results.map(pageToInvitation);
};

const findByName = async (name) => {
  const res = await notion.databases.query({
    database_id: DB_ID,
    filter: { property: "Name", title: { equals: name } },
  });
  return res.results[0] ? pageToInvitation(res.results[0]) : null;
};

const createInvitation = async (name, url) => {
  const page = await notion.pages.create({
    parent: { database_id: DB_ID },
    properties: {
      Name: { title: [{ text: { content: name } }] },
      URL: { url },
      Attending: { select: { name: "Pending" } },
      Message: { rich_text: [] },
    },
  });
  return pageToInvitation(page);
};

const updateRsvp = async (pageId, attending, message, respondedAt) => {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      Attending: { select: { name: attending ? "Yes" : "No" } },
      Message: { rich_text: [{ text: { content: message } }] },
      RespondedAt: { date: { start: respondedAt } },
    },
  });
};

const archivePage = async (pageId) => {
  await notion.pages.update({ page_id: pageId, archived: true });
};

// ── RSVP endpoint (called by the wedding site) ────────────────────────────────
app.post("/rsvp", async (req, res) => {
  try {
    const { attending, name, message } = req.body;
    const respondedAt = new Date().toISOString();
    const existing = await findByName(name || "");
    if (existing) {
      await updateRsvp(existing.id, !!attending, message || "", respondedAt);
    } else {
      const url = `${INVITE_BASE_URL}/?name=${encodeURIComponent(name || "")}`;
      const inv = await createInvitation(name || "(unknown)", url);
      await updateRsvp(inv.id, !!attending, message || "", respondedAt);
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save RSVP" });
  }
});

// ── Admin API ─────────────────────────────────────────────────────────────────
app.get("/admin/invitations", async (_req, res) => {
  try {
    res.json(await getInvitations());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load invitations" });
  }
});

app.post("/admin/invitations", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "name required" });
    const trimmed = name.trim();
    const url = `${INVITE_BASE_URL}/?name=${encodeURIComponent(trimmed)}`;
    const inv = await createInvitation(trimmed, url);
    res.json(inv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create invitation" });
  }
});

app.delete("/admin/invitations/:id", async (req, res) => {
  try {
    await archivePage(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete invitation" });
  }
});

// ── Admin UI ──────────────────────────────────────────────────────────────────
const ADMIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Wedding Invitations</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, sans-serif; background: #faf9f7; color: #2d2d2d; padding: 2rem; }
  h1 { font-size: 1.5rem; margin-bottom: 1.5rem; color: #7a5c4f; }
  .card { background: #fff; border: 1px solid #e8e0d8; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem; }
  .card h2 { font-size: 1rem; margin-bottom: 1rem; color: #555; }
  form { display: flex; gap: .75rem; }
  input[type=text] { flex: 1; border: 1px solid #d0c8c0; border-radius: 6px; padding: .5rem .75rem; font-size: .95rem; }
  button { border: none; border-radius: 6px; padding: .5rem 1.1rem; cursor: pointer; font-size: .9rem; }
  .btn-primary { background: #c9a87c; color: #fff; }
  .btn-primary:hover { background: #b8956a; }
  .btn-danger { background: transparent; color: #c0392b; border: 1px solid #c0392b; padding: .25rem .6rem; font-size: .8rem; }
  .btn-danger:hover { background: #fdecea; }
  .btn-copy { background: transparent; color: #7a5c4f; border: 1px solid #c9a87c; padding: .25rem .6rem; font-size: .8rem; }
  .btn-copy:hover { background: #fdf5ec; }
  table { width: 100%; border-collapse: collapse; font-size: .9rem; }
  th { text-align: left; padding: .6rem .75rem; border-bottom: 2px solid #e8e0d8; color: #888; font-weight: 600; font-size: .8rem; text-transform: uppercase; letter-spacing: .04em; }
  td { padding: .6rem .75rem; border-bottom: 1px solid #f0ebe4; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  .badge { display: inline-block; padding: .2rem .55rem; border-radius: 99px; font-size: .78rem; font-weight: 600; }
  .badge-yes { background: #d4edda; color: #256f40; }
  .badge-no  { background: #fdecea; color: #952828; }
  .badge-pending { background: #f0ebe4; color: #888; }
  .url-cell { max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #7a5c4f; font-size: .82rem; }
  .actions { display: flex; gap: .4rem; }
  .stats { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
  .stat { background: #fff; border: 1px solid #e8e0d8; border-radius: 8px; padding: .9rem 1.25rem; flex: 1; text-align: center; }
  .stat .n { font-size: 1.8rem; font-weight: 700; color: #7a5c4f; }
  .stat .l { font-size: .8rem; color: #888; margin-top: .15rem; }
  #msg { font-size: .85rem; color: #256f40; padding: .4rem 0; min-height: 1.4rem; }
</style>
</head>
<body>
<h1>💌 Wedding Invitations</h1>

<div class="stats" id="stats"></div>

<div class="card">
  <h2>New invitation</h2>
  <form id="form">
    <input type="text" id="nameInput" placeholder="Guest name" required autocomplete="off">
    <button type="submit" class="btn-primary">Create &amp; get URL</button>
  </form>
  <div id="msg"></div>
</div>

<div class="card">
  <h2>All invitations</h2>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Status</th>
        <th>Message</th>
        <th>Responded</th>
        <th>URL</th>
        <th></th>
      </tr>
    </thead>
    <tbody id="tbody"></tbody>
  </table>
</div>

<script>
let invitations = [];

const fmt = (iso) => iso ? new Date(iso).toLocaleString() : '—';

const renderStats = () => {
  const total = invitations.length;
  const yes = invitations.filter(i => i.rsvp?.attending === true).length;
  const no  = invitations.filter(i => i.rsvp?.attending === false).length;
  const pending = total - yes - no;
  document.getElementById('stats').innerHTML = \`
    <div class="stat"><div class="n">\${total}</div><div class="l">Total</div></div>
    <div class="stat"><div class="n" style="color:#256f40">\${yes}</div><div class="l">Attending ✓</div></div>
    <div class="stat"><div class="n" style="color:#952828">\${no}</div><div class="l">Declined ✗</div></div>
    <div class="stat"><div class="n">\${pending}</div><div class="l">Pending</div></div>
  \`;
};

const renderTable = () => {
  const tbody = document.getElementById('tbody');
  if (!invitations.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#aaa;padding:2rem">No invitations yet</td></tr>';
    return;
  }
  tbody.innerHTML = invitations.map((inv, i) => {
    const badge = inv.rsvp === null
      ? '<span class="badge badge-pending">Pending</span>'
      : inv.rsvp.attending
        ? '<span class="badge badge-yes">Attending ✓</span>'
        : '<span class="badge badge-no">Declined ✗</span>';
    return \`<tr>
      <td>\${i + 1}</td>
      <td><strong>\${esc(inv.name)}</strong></td>
      <td>\${badge}</td>
      <td>\${esc(inv.rsvp?.message || '—')}</td>
      <td style="font-size:.8rem;color:#888">\${fmt(inv.rsvp?.respondedAt)}</td>
      <td class="url-cell" title="\${esc(inv.url)}">\${esc(inv.url)}</td>
      <td>
        <div class="actions">
          <button class="btn-copy" onclick="copy('\${esc(inv.url)}', this)">Copy URL</button>
          <button class="btn-danger" onclick="del('\${inv.id}')">Delete</button>
        </div>
      </td>
    </tr>\`;
  }).join('');
};

const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const load = async () => {
  const res = await fetch('/admin/invitations');
  invitations = await res.json();
  renderStats();
  renderTable();
};

const copy = (url, btn) => {
  navigator.clipboard.writeText(url).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = orig, 1500);
  });
};

const del = async (id) => {
  if (!confirm('Delete this invitation?')) return;
  await fetch('/admin/invitations/' + id, { method: 'DELETE' });
  load();
};

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('nameInput').value.trim();
  if (!name) return;
  const res = await fetch('/admin/invitations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const inv = await res.json();
  document.getElementById('nameInput').value = '';
  document.getElementById('msg').textContent = 'Created! URL: ' + inv.url;
  navigator.clipboard.writeText(inv.url).catch(() => {});
  setTimeout(() => document.getElementById('msg').textContent = '', 4000);
  load();
});

load();
</script>
</body>
</html>`;

app.get("/admin", (_req, res) => res.send(ADMIN_HTML));
app.get("/", (_req, res) => res.redirect("/admin"));

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
