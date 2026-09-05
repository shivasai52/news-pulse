# AI Fluency — News Pulse

How the 4D framework was applied while building this project.
Every example below points at a real file or a real commit.

---

## 1. Delegation

What I handed to Claude, and what I kept.

| Task | Who | Why |
|---|---|---|
| Reading the codebase and finding issues | Claude | Faster across 26 files than reading by hand |
| Writing `CLAUDE.md` and requirements | Claude | I reviewed and corrected the output |
| Playwright test suite | Claude | I decided *what* to test, Claude wrote the syntax |
| Deploy config (`netlify.toml`, `render.yaml`) | Claude | Boilerplate I would have copied anyway |
| GitHub, Render, Netlify accounts | **Me** | Claude cannot and should not handle my logins |
| Choosing the hosting platforms | **Me** | A cost and ownership decision, not a coding one |
| Deciding which issues to fix now vs later | **Me** | Depends on my deadline, which Claude doesn't know |

**The line I drew:** Claude does work I can verify. I keep decisions that
involve my accounts, my money, or my judgement.

---

## 2. Description

Communicating clearly instead of vaguely.

**Example — the API contract in `CLAUDE.md`:**

> Article shape — **never change these field names**, the frontend depends on them:
> `{ source, title, description, url, publishedAt }`

A vague version would be "keep the code consistent". This version names the
exact fields and the exact consequence, so the rule cannot be misread.

**Other specific instructions I wrote:**

| File | The instruction | Why it is specific |
|---|---|---|
| `CLAUDE.md` | "Do not add Tailwind, TypeScript, Redux, or a database" | Names what is banned, not "keep it simple" |
| `CLAUDE.md` | Design tokens listed as real hex values from `App.css` | No room to invent new colours |
| `.claude/agents/code-reviewer.md` | A "do not report these" list of known issues | Stops the reviewer repeating noise every run |
| `.claude/commands/check-feeds.md` | "Read the feed list from the file, never hardcode it" | The command stays correct when sources change |

---

## 3. Discernment

Mistakes Claude made that I caught.

### 3a. The hook silently passed on broken files 🔴 the important one

The ESLint hook used `--format compact`. That formatter was **removed in
ESLint 10**, which this project uses. ESLint errored out instead of linting,
the hook found no output, and it exited `0`.

- **What it looked like:** the hook "worked" — no complaints, ever.
- **Why that is worse than crashing:** a quality gate that always says
  "fine" is more dangerous than no gate at all.
- **How it was caught:** I tested the hook against `App.jsx`, a file I
  already knew had 2 real ESLint errors. It reported nothing. That mismatch
  between *known bad input* and *clean result* is what exposed it.
- **Fix:** dropped the flag, and added a branch so a lint that cannot run
  says so instead of staying quiet.

### 3b. Wrong working directory in the same hook

The hook passed a project-relative path (`frontend/src/App.jsx`) while
running ESLint with `cwd = frontend/`, so the file was never found.
Fixed by resolving to an absolute path.

### 3c. A green status that was a hardcoded string

`reportService.js` returns `refreshStatus: "Working"` as a fixed value.
When all five feeds failed, the dashboard still showed **✅ Working**.
Logged as **R-7** in `Requirements_Report.md` and marked as not met.

### 3d. "Deploy succeeded" did not mean the site worked

Netlify reported a successful deploy, but the live site showed
"Unable to load latest news." Rather than trusting the green tick, I
downloaded the deployed JavaScript bundle and searched it:

| Check | Result |
|---|---|
| contains `onrender.com` | ❌ no |
| contains `localhost:5000` | ✅ yes |

The environment variable had not been applied at build time. A green
deploy badge is not evidence that the app works.

---

## 4. Diligence

How each claim was verified before being called done.

| Claim | How it was checked | Evidence |
|---|---|---|
| Backend runs | Started it and called the routes | `News Pulse Backend running on port 8080` |
| `PORT` env works | Ran with `PORT=8080` and hit that port | Responded correctly |
| Frontend compiles | `npm run build` after every `App.jsx` edit | `✓ 72 modules transformed` |
| Tests are real | `playwright test --list`, then a full run | **32 passed in 42.6s** |
| Feeds work in production | Called the live `/api/report` | **5 of 5 sources, 161 articles, 100% metadata** |
| Env var applied | Searched the deployed JS bundle | `onrender.com` present, `localhost` gone |
| Mobile layout | Measured `scrollWidth` vs viewport at 360px | 360 = 360, zero overflowing elements |
| No secrets committed | `git ls-files` filtered for `.env` | `.env` untracked, `.env.example` committed |

**Rule I followed:** a task is not done because a tool said "success".
It is done when I have looked at the actual output.

---

## Honest limitations

- `App_backup.jsx`, `backend/juj`, and the duplicated feed list are still
  present. They are logged in `CLAUDE.md`, not silently ignored.
- **R-7 is still not met.** The fake "Working" status remains in the code.
- This app checks that sources are reachable and that titles, URLs, and
  dates exist. It does **not** verify that any news story is true.
