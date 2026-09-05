---
description: Check the health of one news source, or all of them
argument-hint: [source name, e.g. BBC. Leave empty to check all]
allowed-tools: Bash(node:*), Bash(curl:*), Read
---

# Check Feeds

Check whether the News Pulse RSS sources are alive and returning usable articles.

## Requested source

$ARGUMENTS

## What to do

1. Read `backend/services/newsService.js` to get the current feed list.
   Never hardcode the URLs in this command — always read them from the file,
   so this command stays correct when the feed list changes.

2. Decide the scope:
   - If a source name was given above, check **only** that source.
     Match the name case-insensitively (`bbc` must match `BBC`).
     If the name matches no source, list the valid names and stop.
   - If nothing was given above, check **all** sources.

3. For each source in scope, fetch the feed and measure:
   - Did it respond at all?
   - How long did it take, in milliseconds?
   - How many articles came back?
   - How many have a title, a link, and a publication date?

4. Report the result as a table:

   | Source | Status | Articles | Titles | URLs | Dates | Time |
   |---|---|---|---|---|---|---|

   Use 🟢 for a working source and 🔴 for a failed one.

## Rules

- A failing feed is a normal result, not a crash. Report it and move on.
- Never invent article counts. If a fetch fails, report 0 and show the error.
- Flag any source slower than 3000 ms as ⚠️ slow.
- Finish with one plain-English line, for example:
  "4 of 5 sources healthy. NPR timed out."

## Example runs

- `/check-feeds BBC` — checks BBC only
- `/check-feeds guardian` — checks The Guardian
- `/check-feeds` — checks all five sources
