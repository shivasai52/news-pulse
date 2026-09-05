---
name: news-source-audit
description: Audit the News Pulse RSS sources and write a health report. Use when asked to audit the feeds, check source health, investigate why articles are missing or stale, verify article metadata quality, or before a demo or deploy.
---

# News Source Audit

Check that every News Pulse source is alive and returning usable articles,
then write the findings to a dated report file.

This is deeper than the `/check-feeds` command. That command answers
"is it up right now?". This skill answers "is the data good enough to ship?".

## When to use this

- Before a demo or a deploy.
- When the app shows fewer articles than expected.
- When headlines look old or repeated.
- When a source needs to be added or removed.

## Step 1 — Read the current config

Read `backend/services/newsService.js` and take the feed list from there.

Never hardcode feed URLs in this skill. The config file is the single source
of truth, so the audit stays correct when the list changes.

Note the per-feed article cap (currently 10). It matters when judging counts.

## Step 2 — Fetch every feed

For each source, record:

| Field | Meaning |
|---|---|
| Reachable | Did the request succeed at all? |
| Response time | Milliseconds from request to parse |
| Article count | How many items came back |
| Titles present | Items with a non-empty title |
| Links present | Items with a usable URL |
| Dates present | Items with `pubDate` or `isoDate` |
| Newest article age | Hours since the most recent item |

Fetch each feed once. Do not hammer a source that already failed.

## Step 3 — Check quality, not just uptime

A source can respond and still be unusable. Flag these:

| Problem | Threshold |
|---|---|
| 🔴 Dead | No response, or 0 articles |
| 🟠 Thin | Fewer than 5 articles |
| 🟠 Stale | Newest article older than 24 hours |
| 🟠 Incomplete | Any item missing a title or a link |
| 🟡 Slow | Response over 3000 ms |
| 🟡 No dates | Items missing publication dates |

Also check across sources:

- Duplicate URLs appearing in more than one feed.
- Identical headlines from different sources.
- Whether any source dominates because others are failing.

## Step 4 — Write the report

Save to `reports/source-audit-YYYY-MM-DD.md`. Create the folder if needed.

Use this structure:

```markdown
# Source Audit — <date>

## Summary
<one plain-English line, e.g. "4 of 5 sources healthy. NPR is stale.">

## Source table
| Source | Status | Articles | Titles | Links | Dates | Newest | Time |

## Problems found
<numbered list, worst first, each with a suggested fix>

## Duplicates
<count and examples, or "none">

## Verdict
<safe to demo / fix before demo>
```

## Rules

- Never invent numbers. If a fetch fails, record 0 and the real error text.
- A failing source is a finding, not a crash. Audit the rest and continue.
- Do not describe this as fact-checking. It checks reachability and metadata
  only, exactly as stated on the report page and in `CLAUDE.md`.
- If every source fails, suspect the network before blaming the code, and say so.
- Keep the report under one page.

## Follow-up

If a source is dead for two audits in a row, recommend removing it from
`newsService.js` and `reportService.js` — and note that the feed list is
currently duplicated across both files, so any change must be made twice
until that is fixed.
