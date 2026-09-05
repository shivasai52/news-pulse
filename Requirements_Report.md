# Requirements — News Report Page

Screen: second tab. File: `frontend/src/App.jsx` (`view === "report"`).
Data source: `backend/services/reportService.js`.

---

## 1. Purpose

Prove the headlines come from real, reachable sources. This page checks the
plumbing — it does **not** check whether the news itself is true.

## 2. Sections

| Section | Shows |
|---|---|
| Summary cards | Total articles, sources checked, sources working, duplicates |
| Refresh monitoring | Refresh interval, refresh status, last checked time |
| Source verification | A table with one row per source |
| Article checks | Titles, URLs, publication dates, duplicates |
| Explanation note | Plain-English statement of what the report does and does not prove |

## 3. Source table columns

`Source` · `Status` · `Articles` · `Verification`

- Working sources show 🟢 Working and ✅ Verified Source
- Failed sources show 🔴 Failed and ❌ Not Available

## 4. Behaviour

| ID | Rule |
|---|---|
| R-1 | Load the report on first page load and when the tab is opened |
| R-2 | "Check Now" re-runs the check on demand |
| R-3 | The button is disabled and shows "🔄 Checking..." while running |
| R-4 | A failed feed reports 0 articles instead of crashing |
| R-5 | Duplicates are counted by comparing article URLs |
| R-6 | "Last Checked" is shown in the reader's local time |
| R-7 | Refresh status must reflect real feed health, not a fixed string |

> ⚠️ **R-7 is currently not met.** `refreshStatus` is hardcoded to `"Working"`,
> so the page shows green even when all five feeds fail. This must be fixed.

## 5. Honesty requirement

The explanation note must stay on the page. It must state that:

- The system checks that sources are reachable and that titles, URLs, and dates exist.
- It does **not** verify that any news statement is factually true.

Removing or softening this note is not allowed.

## 6. Acceptance criteria

- [ ] All four summary cards show real numbers from the API.
- [ ] The table lists all five sources with the correct status colour.
- [ ] "Check Now" updates the "Last Checked" time.
- [ ] With the network off, every row shows 🔴 Failed and the page still renders.
- [ ] The explanation note is visible without scrolling past the table.
