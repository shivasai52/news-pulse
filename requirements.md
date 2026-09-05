# News Pulse — Requirements (Master Index)

This is the top-level requirement file. Detailed rules are split into
separate files so each screen can be reviewed on its own.

| File | Covers |
|---|---|
| `Requirements_News.md` | Latest News page |
| `Requirements_Report.md` | News Report page |

**Why split the files?**

- Each file is small enough to read in one sitting.
- A reviewer can approve one screen without reading the whole document.
- In Claude Code I can point at exactly one file with `@Requirements_News.md`,
  so Claude only loads the context it actually needs.
- Changes to one screen do not create merge conflicts on the other.

---

## 1. Goal

Build a single-page web app that collects headlines from several public news
sources and shows them in one clean place, plus an honest report on whether
those sources are actually working.

## 2. Users

- A reader who wants a quick overview of world news without visiting 5 sites.
- A reviewer who wants proof the data is coming from real, live sources.

## 3. Scope

**In scope**

- Read 5 public RSS feeds.
- Show headlines with source, title, description, date, and a link.
- Auto-refresh every 10 minutes.
- Search across loaded headlines.
- A report page showing feed health.

**Out of scope**

- User accounts or login.
- Saving or bookmarking articles.
- Comments or sharing.
- Real fact-checking of news claims.
- A database.

## 4. Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-1 | Fetch articles from 5 RSS feeds | Must |
| FR-2 | Limit each feed to 10 articles | Must |
| FR-3 | Remove duplicate article URLs | Must |
| FR-4 | Expose `GET /api/news` | Must |
| FR-5 | Expose `GET /api/report` | Must |
| FR-6 | Show one article per source at a time | Must |
| FR-7 | Auto-refresh every 10 minutes with countdown | Must |
| FR-8 | Manual refresh button | Must |
| FR-9 | Search by title, description, or source | Must |
| FR-10 | Switch between News and Report views | Must |
| FR-11 | Open the full story in a new tab | Must |
| FR-12 | Show a clear message when a feed fails | Must |

## 5. Non-functional requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-1 | First load time | Under 3 seconds |
| NFR-2 | One failing feed must not crash the app | Always |
| NFR-3 | Works on mobile, tablet, and desktop | 360px and up |
| NFR-4 | No API keys or secrets in the frontend | Always |
| NFR-5 | Production JS bundle | Under 300 KB |
| NFR-6 | All links open safely | `rel="noreferrer"` |

## 6. Acceptance criteria

- [ ] Backend starts on port 5000 and prints a confirmation line.
- [ ] Frontend starts on port 5173 and loads without console errors.
- [ ] `GET /api/news` returns `success: true` and a non-empty array.
- [ ] Killing the backend shows an error box in the UI, not a blank page.
- [ ] The countdown reaches 00:00 and the headlines change.
- [ ] Search filters the visible cards live.
- [ ] `npm run build` completes with no errors.

## 7. Open items

- [ ] Move the API URL into a Vite environment variable.
- [ ] Make `refreshStatus` reflect real feed health instead of a fixed string.
- [ ] Delete `App_backup.jsx` and `backend/juj`.
- [ ] Move the shared feed list into one config file.
