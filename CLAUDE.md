# CLAUDE.md — News Pulse

Project-level instructions for Claude Code. Read this before changing any file.

---

## 1. What this project is

News Pulse is a full-stack news aggregator.

- A Node/Express backend reads 5 public RSS feeds and exposes them as JSON.
- A React frontend shows the headlines and a source-health report.
- No database, no login, no API keys. Everything is public RSS.

---

## 2. Folder structure

```
NEWS-PULSE - 2/
├── CLAUDE.md               <- this file
├── requirements.md         <- master requirement index
├── Requirements_News.md    <- news page requirements
├── Requirements_Report.md  <- report page requirements
├── START-NEWS-PULSE.bat    <- one-click launcher (Windows)
│
├── backend/                <- Express API (CommonJS)
│   ├── server.js           <- routes only, no business logic
│   └── services/
│       ├── newsService.js  <- fetches + de-duplicates articles
│       └── reportService.js<- checks feed health
│
└── frontend/               <- React 19 + Vite 8 (ESM)
    └── src/
        ├── App.jsx         <- all pages and state
        ├── App.css         <- all styling
        └── components/
            └── NewsCard.jsx
```

---

## 3. Tech stack

| Layer | Tech | Notes |
|---|---|---|
| Backend | Node + Express 5 | CommonJS (`require`) |
| RSS | `rss-parser` | no API key needed |
| Frontend | React 19 + Vite 8 | ESM (`import`) |
| HTTP | Axios | |
| Styling | Plain CSS | no Tailwind, no UI library |

**Do not add** Tailwind, TypeScript, Redux, or a database. Keep the stack as-is.

---

## 4. How to run

Two terminals are required.

```bash
# Terminal 1 - backend on port 5000
cd backend
node server.js

# Terminal 2 - frontend on port 5173
cd frontend
npm run dev
```

Or double-click `START-NEWS-PULSE.bat`.

---

## 5. API contract

| Route | Returns |
|---|---|
| `GET /` | Plain text health check |
| `GET /api/news` | `{ success, articles: [...] }` |
| `GET /api/report` | `{ success, report: {...} }` |

Article shape — **never change these field names**, the frontend depends on them:

```js
{ source, title, description, url, publishedAt }
```

Every route must return `{ success: false, message }` on error, never a raw stack trace.

---

## 6. News sources

BBC · Times of India · The Guardian · Hacker News · NPR

- Max 10 articles per feed.
- A failing feed must be logged and skipped — **one dead feed must never crash the app**.
- Duplicate URLs are removed before returning.

---

## 7. Design system

| Token | Value | Used for |
|---|---|---|
| Primary blue | `#2563eb` | buttons, links, badges |
| Dark blue | `#1d4ed8` | hover states |
| Text dark | `#172033` | body text |
| Text muted | `#718096` | timestamps, captions |
| Page background | `#eef3f8` | app background |
| Card background | `#f8fafc` | cards, panels |
| Border | `#dce5ef` | dividers, card edges |

- Headings font: **Space Grotesk**
- Body font: **Inter**
- Border radius: **12–16px** on cards and buttons
- Emoji are used as icons on purpose. Keep them.

---

## 8. Code conventions

- Double quotes, 2-space indent, semicolons.
- Backend uses `require`. Frontend uses `import`. Do not mix.
- Routes stay thin — all logic lives in `services/`.
- Descriptive names: `handleNewsChange`, not `hnc`.
- Section comments use the `// ====` banner style already in the files.
- Keep comments short and in simple English.

---

## 9. Known issues — fix these, don't repeat them

1. `App_backup.jsx` is dead code and should be deleted.
2. The feed list is duplicated in `newsService.js` and `reportService.js`. It belongs in one shared `config/feeds.js`.
3. `refreshStatus: "Working"` in `reportService.js` is hardcoded — it stays green even when all 5 feeds fail.
4. The API URL `http://localhost:5000` is hardcoded in `App.jsx`. It must move to a Vite env variable before deploying.
5. `backend/juj` is an accidental terminal log. Delete it.
6. ESLint reports React Hook errors in `App.jsx` (lines 173 and 223).

---

## 10. Rules for Claude

- Ask before installing any new dependency.
- Never commit `.env` or `node_modules`.
- Never invent news data — if a feed fails, show the failure honestly.
- Do not claim the app fact-checks news. It only checks that feeds are reachable and that titles, URLs, and dates exist.
- After editing `App.jsx`, run `npm run build` to confirm it still compiles.
