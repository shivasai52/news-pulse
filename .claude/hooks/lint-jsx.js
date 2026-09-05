#!/usr/bin/env node
/**
 * News Pulse - PostToolUse hook
 *
 * Runs after Claude edits or writes a file.
 * If the file is a .jsx file inside frontend/src, it runs ESLint on that one
 * file and feeds any problems straight back to Claude so they get fixed now,
 * instead of piling up until the next commit.
 *
 * Exit codes:
 *   0 = nothing to say, stay quiet
 *   2 = problems found; the stderr message is shown to Claude
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

let input = "";

process.stdin.on("data", (chunk) => {
  input += chunk;
});

process.stdin.on("end", () => {
  let payload;

  try {
    payload = JSON.parse(input || "{}");
  } catch {
    process.exit(0);
  }

  const filePath =
    payload?.tool_input?.file_path || "";

  // Only JSX files
  if (!filePath.endsWith(".jsx")) {
    process.exit(0);
  }

  // Only inside the frontend source folder
  const normalised = filePath.replace(/\\/g, "/");

  if (!normalised.includes("frontend/src")) {
    process.exit(0);
  }

  const projectRoot = process.cwd();

  const frontendDir = path.join(
    projectRoot,
    "frontend"
  );

  // ESLint runs with cwd = frontend/, so a project-relative path
  // such as "frontend/src/App.jsx" would not resolve. Make it absolute.
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(projectRoot, filePath);

  // Call the ESLint entry point directly. This skips the npx lookup,
  // which is slow and can time out on a network or cloud-synced drive.
  const eslintBin = path.join(
    frontendDir,
    "node_modules",
    "eslint",
    "bin",
    "eslint.js"
  );

  // If dependencies were never installed, say so once and stop.
  if (!fs.existsSync(eslintBin)) {
    console.error(
      "Skipping lint: ESLint is not installed. Run `npm install` inside frontend/."
    );
    process.exit(0);
  }

  try {
    execFileSync(
      process.execPath,
      [eslintBin, absolutePath],
      {
        cwd: frontendDir,
        stdio: "pipe",
        timeout: 180000
      }
    );

    // Clean file
    process.exit(0);

  } catch (error) {

    // Killed by the timeout rather than finished with findings
    if (error.signal || error.status === null) {
      console.error(
        "Skipping lint: ESLint did not finish in time on " +
        path.basename(filePath) + "."
      );
      process.exit(0);
    }

    const output = (
      (error.stdout || "").toString() +
      (error.stderr || "").toString()
    ).trim();

    if (!output) {
      process.exit(0);
    }

    console.error(
      "ESLint found problems in " +
      path.basename(filePath) +
      ":\n\n" +
      output +
      "\n\nFix these before moving on."
    );

    process.exit(2);
  }
});
