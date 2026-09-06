# Demo Guide — News Pulse

Read this off the screen during the presentation.
Run the five demos in the order below. Keep the hook for last.

---

## Before you start

1. Open **VS Code**
2. **File → Open Folder** → pick `NEWS-PULSE - 2`
3. **Terminal → New Terminal**
4. Type `claude` and press Enter

Claude Code reads `CLAUDE.md` automatically. You never have to mention it.

**Also do this before presenting:**

- Open https://newspulse06.netlify.app once, a minute early.
  The free Render backend sleeps, so the first load takes about 50 seconds.

---

## Quick reference

| # | Feature | Who triggers it | What to type |
|---|---|---|---|
| 1 | Slash command | You | `/check-feeds BBC` |
| 2 | Subagent | You, by name | `Use the code-reviewer subagent...` |
| 3 | Skill | Claude decides | `Audit the news sources...` |
| 4 | Hook | Automatic | `Add a comment to NewsCard.jsx` |
| 5 | Tests | You | `npm run test:e2e` |

---

# 1. Slash Command

**Definition:** A saved prompt you run by typing `/name`. You trigger it.

**File:** `.claude/commands/check-feeds.md`

**Type this:**

```
/check-feeds BBC
```

**Then type this:**

```
/check-feeds
```

**What you will see:** a table of feed status — one source first, then all five.

**What to say:**

> "It accepts an argument. `BBC` checks one source. Empty checks all five.
> It reads the feed list from `newsService.js`, so it never goes stale."

---

# 2. Subagent

**Definition:** A second Claude with its own memory and limited tools.
Mine can only read and report — it cannot edit files.

**File:** `.claude/agents/code-reviewer.md`

**Type this:**

```
Use the code-reviewer subagent to review backend/services/reportService.js
```

**What you will see:** problems listed worst first, including the fake
`refreshStatus: "Working"`.

**What to say:**

> "It reviews against the rules in my `CLAUDE.md`. It reports only —
> it never changes my code. It starts with a clean context, so it judges
> the code as written, not the conversation."

---

# 3. Skill

**Definition:** A folder of instructions. Claude decides to load it when
your request matches its description.

**File:** `.claude/skills/news-source-audit/SKILL.md`

**Type this:**

```
Audit the news sources and tell me if any are unhealthy
```

**Do NOT type the skill's name.** That is the whole point.

**What you will see:** Claude loads the skill and writes a dated report
into a `reports/` folder.

**What to say:**

> "I never named the skill. Claude matched my words to its description
> and loaded it on its own."

---

# 4. Hook — keep this for last

**Definition:** A command that runs automatically at a fixed moment.
Nobody chooses. Not me, not Claude.

**Files:** `.claude/settings.json` and `.claude/hooks/lint-jsx.js`

**Type this:**

```
Add a comment at the top of frontend/src/components/NewsCard.jsx
```

**What you will see:** Claude edits the file, then ESLint runs by itself
and the results come back.

**What to say:**

> "I never asked for linting. It runs on every `.jsx` edit whether Claude
> wants it or not. That is the difference between a hook and a skill —
> a hook is not a suggestion."

---

# 5. Playwright Tests

**Definition:** A robot that opens the site in a real browser and checks
it works.

**This needs two terminals.**

**Terminal 1 — start the backend:**

```
cd backend
node server.js
```

Wait for: `News Pulse Backend running on port 5000`.
Leave this window open.

**Terminal 2 — run the tests:**

```
npm run test:e2e
npm run test:report
```

**What you will see:** `32 passed`, then an HTML report opens in the browser.

**What to say:**

> "16 tests on two screen sizes — desktop and 360px mobile. Each test is
> named after the requirement it proves, like `N-2` or `NFR-3`, so every
> test traces back to a requirement file."

---

# If someone asks a hard question

**"What mistake did Claude make that you caught?"**

> The ESLint hook used `--format compact`, a formatter removed in ESLint 10.
> ESLint errored instead of linting, the hook saw no output, and exited 0.
> It looked like it was working. I tested it against `App.jsx`, a file I
> already knew had two errors. It reported nothing. That mismatch exposed it.
> A quality gate that always says "fine" is worse than no gate at all.

**"How do you know the deployment actually works?"**

> Netlify said the deploy succeeded but the site showed no news. I downloaded
> the deployed JavaScript bundle and searched it. It still contained
> `localhost:5000` and not my backend URL. The environment variable had not
> been applied. A green deploy badge is not evidence.

**"Does this app fact-check the news?"**

> No. It checks that the sources are reachable and that each article has a
> title, a URL, and a date. It does not verify that any story is true.
> That limitation is written on the report page and in `CLAUDE.md`.

**"What is still broken?"**

> Three things, all logged in `CLAUDE.md`, not hidden. `App_backup.jsx` is
> dead code. The feed list is duplicated across two services. And R-7 —
> the refresh status is a hardcoded string, so it shows green even when
> every feed fails.

---

# Live links

| What | URL |
|---|---|
| Live site | https://newspulse06.netlify.app |
| Backend API | https://news-pulse-api-vc00.onrender.com |
| GitHub repo | https://github.com/shivasai52/news-pulse |
