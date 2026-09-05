# Requirements — Latest News Page

Screen: default view. File: `frontend/src/App.jsx` (`view === "news"`).

---

## 1. Purpose

Show the reader a small, balanced set of current headlines — one story from
each source — so no single outlet dominates the page.

## 2. Layout

| Area | Contains |
|---|---|
| Header | 📰 logo, "NEWS PULSE", tagline, two nav buttons |
| Toolbar | "Latest News" title, last-updated time, countdown timer, refresh button |
| Search bar | Text input plus a live article count |
| Grid | Article cards, responsive |
| Footer | App name and a short note |

## 3. Article card

Each card must show, in this order:

1. Source badge (e.g. BBC) and card number
2. Headline
3. Short description
4. 🕒 Published date and time, in the reader's local format
5. "Read Full Story →" link opening in a new tab

## 4. Behaviour

| ID | Rule |
|---|---|
| N-1 | On load, call `GET /api/news` once |
| N-2 | Show exactly one article per source (5 cards maximum) |
| N-3 | Each refresh advances to the next article from every source |
| N-4 | Cycle back to the first article when a source runs out |
| N-5 | Countdown starts at 10:00 and ticks down every second |
| N-6 | At 00:00, headlines change automatically and the timer resets |
| N-7 | The manual refresh button does the same thing immediately |
| N-8 | The refresh button is disabled while a refresh is running |
| N-9 | Search filters on title, description, and source, case-insensitive |
| N-10 | The article count updates as the reader types |

## 5. States

| State | What the reader sees |
|---|---|
| Loading | Spinner and "Loading latest news..." |
| Error | ⚠️ box, plain-English message, "Try Again" button |
| Empty search | Grid is empty, count shows 0 |
| Normal | Up to 5 article cards |

## 6. Acceptance criteria

- [ ] Five cards appear, one per source, when all feeds are healthy.
- [ ] The timer counts down and resets correctly at zero.
- [ ] Clicking refresh shows different headlines than before.
- [ ] Typing "bbc" leaves only the BBC card visible.
- [ ] Stopping the backend shows the error box, not a blank screen.
- [ ] "Read Full Story" opens the real article in a new tab.
- [ ] The grid stays readable at 360px width.
