---
name: explain-file
description: Explain what a file in this project does, in simple English. Use when asked what a file does, how a file works, to explain code, to walk through a file, or when preparing to present or demo this project.
---

# Explain File

Explain any file in the News Pulse project in plain, simple English,
so that someone who did not write it can understand it.

## When to use this

- Someone asks what a file does or how it works.
- Someone is preparing to present or demo the project.
- A new person needs to understand the project quickly.

## Step 1 — Read the file

Read the whole file before explaining anything. Never guess from the
file name.

If the file connects to others, read those too. For example, a service
file is used by `server.js`, and a route is used by `App.jsx`.

## Step 2 — Explain it in this order

Answer these five questions, in this order, and nothing else:

1. **What is it?** One sentence. No jargon.
2. **Why does it exist?** What would break without it.
3. **What does it do, step by step?** Use a numbered list.
4. **What connects to it?** Which files use it, and which files it uses.
5. **Anything to watch out for?** Bugs, limits, or known issues.

## Step 3 — Rules for the writing

- Use short sentences. One idea per sentence.
- Use simple words. Say "checks" instead of "validates". Say "list"
  instead of "array" the first time, then the real word in brackets.
- Explain every technical word the first time it appears.
- Give the real line numbers so the reader can follow along.
- Do not copy large blocks of code. Quote at most three lines at a time,
  and only when the code makes the point clearer than words.
- Keep the whole explanation under one page.

## Step 4 — Add a simple comparison

End with one everyday comparison that makes the file's job obvious.
For example, a route file is like a receptionist who takes a request
and passes it to the right person.

Keep the comparison short and do not stretch it.

## Rules

- Be honest. If a file contains a bug or a known issue, say so plainly.
  The known issues for this project are listed in `CLAUDE.md`.
- Never say a file is good or clever. Just explain what it does.
- If the file is very large, explain the main parts and say clearly
  which parts you skipped.
- If you are unsure what a piece of code does, say you are unsure
  rather than guessing.
