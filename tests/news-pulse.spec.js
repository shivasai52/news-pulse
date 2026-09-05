import { test, expect } from "@playwright/test";

/**
 * News Pulse end-to-end tests.
 *
 * These check the requirements written in:
 *   Requirements_News.md    (N-1 to N-10)
 *   Requirements_Report.md  (R-1 to R-7)
 *   requirements.md         (NFR-3)
 *
 * The backend must be running on port 5000 before these run.
 */

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

// =========================================================
// PAGE LOADS
// =========================================================

test.describe("Page load", () => {

  test("shows the header and tagline", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "NEWS PULSE" })
    ).toBeVisible();

    await expect(
      page.getByText("Stay informed. Stay updated.")
    ).toBeVisible();
  });

  test("shows both navigation buttons", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /Latest News/ })
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: /News Report/ })
    ).toBeVisible();
  });

  test("has no console errors on load", async ({ page }) => {
    const errors = [];

    page.on("console", (message) => {
      if (message.type() === "error") {
        errors.push(message.text());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(errors).toEqual([]);
  });

});

// =========================================================
// NEWS VIEW  (Requirements_News.md)
// =========================================================

test.describe("Latest News view", () => {

  test("N-2: shows at most one card per source", async ({ page }) => {
    // Wait for loading to finish
    await expect(
      page.locator(".news-card").first()
    ).toBeVisible({ timeout: 30000 });

    const badges = await page
      .locator(".source-badge")
      .allTextContents();

    // No source may appear twice
    const unique = new Set(badges);
    expect(unique.size).toBe(badges.length);

    // Never more than the five configured sources
    expect(badges.length).toBeLessThanOrEqual(5);
  });

  test("N-5: countdown timer is visible and formatted mm:ss", async ({ page }) => {
    const timer = page.locator(".timer strong");

    await expect(timer).toBeVisible();
    await expect(timer).toHaveText(/^\d{2}:\d{2}$/);
  });

  test("N-5: countdown actually ticks down", async ({ page }) => {
    const timer = page.locator(".timer strong");

    const first = await timer.textContent();
    await page.waitForTimeout(2500);
    const second = await timer.textContent();

    expect(second).not.toBe(first);
  });

  test("N-9: search filters the visible cards", async ({ page }) => {
    await expect(
      page.locator(".news-card").first()
    ).toBeVisible({ timeout: 30000 });

    const before = await page.locator(".news-card").count();

    await page
      .getByPlaceholder(/Search news/)
      .fill("zzzzzznotarealword");

    await expect(page.locator(".news-card")).toHaveCount(0);

    // Clearing the search brings the cards back
    await page.getByPlaceholder(/Search news/).fill("");

    await expect(page.locator(".news-card")).toHaveCount(before);
  });

  test("N-11: story links open in a new tab and are safe", async ({ page }) => {
    await expect(
      page.locator(".news-card").first()
    ).toBeVisible({ timeout: 30000 });

    const link = page.locator("a.read-more").first();

    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noreferrer/);
    await expect(link).toHaveAttribute("href", /^https?:\/\//);
  });

  test("N-8: refresh button is present and clickable", async ({ page }) => {
    const button = page.getByRole("button", { name: /Refresh News/ });

    await expect(button).toBeEnabled();
    await button.click();

    // It must not crash the page
    await expect(
      page.getByRole("heading", { name: "NEWS PULSE" })
    ).toBeVisible();
  });

});

// =========================================================
// REPORT VIEW  (Requirements_Report.md)
// =========================================================

test.describe("News Report view", () => {

  test.beforeEach(async ({ page }) => {
    await page.getByRole("button", { name: /News Report/ }).click();
  });

  test("R-1: report view opens and shows its heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /News Verification Report/ })
    ).toBeVisible({ timeout: 30000 });
  });

  test("shows all four summary cards", async ({ page }) => {
    await expect(
      page.locator(".report-card")
    ).toHaveCount(4, { timeout: 30000 });
  });

  test("lists all five configured sources", async ({ page }) => {
    const table = page.locator(".source-table");

    await expect(table).toBeVisible({ timeout: 30000 });

    for (const name of [
      "BBC",
      "Times of India",
      "The Guardian",
      "Hacker News",
      "NPR"
    ]) {
      await expect(table.getByText(name, { exact: true })).toBeVisible();
    }
  });

  test("honesty note is present and unchanged", async ({ page }) => {
    await expect(
      page.getByText(/does not claim that every/)
    ).toBeVisible({ timeout: 30000 });

    await expect(
      page.getByText(/claim-level fact checking/)
    ).toBeVisible();
  });

  test("R-2: Check Now button re-runs the report", async ({ page }) => {
    const button = page.getByRole("button", { name: /Check Now/ });

    await expect(button).toBeEnabled({ timeout: 30000 });
    await button.click();

    await expect(
      page.getByRole("heading", { name: /News Verification Report/ })
    ).toBeVisible();
  });

});

// =========================================================
// LAYOUT  (NFR-3)
// =========================================================

test.describe("Responsive layout", () => {

  test("NFR-3: no horizontal scrolling at 360px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto("/");

    await page.waitForLoadState("networkidle");

    const overflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1
      );
    });

    expect(overflow).toBe(false);
  });

  test("navigation stays visible on a small screen", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto("/");

    await expect(
      page.getByRole("button", { name: /News Report/ })
    ).toBeVisible();
  });

});
