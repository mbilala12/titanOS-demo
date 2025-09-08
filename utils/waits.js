/**
 * Wait for any candidate locator factory to be visible.
 * @param {import('@playwright/test').Page} page
 * @param {Array<() => import('@playwright/test').Locator>} factories
 * @param {number} timeout default 5000ms
 * @param {number} pollMs default 120ms
 */
async function waitAnyVisible(page, factories, timeout = 5000, pollMs = 120) {
  const start = Date.now();
  let lastError = null;
  while (Date.now() - start < timeout) {
    for (const f of factories) {
      try {
        const loc = f();
        await loc.first().waitFor({ state: 'visible', timeout: Math.min(300, pollMs * 2) });
        return loc;
      } catch (e) { lastError = e; }
    }
    await page.waitForTimeout(pollMs);
  }
  throw new Error('waitAnyVisible timeout: none visible' + (lastError ? `; last: ${lastError}` : ''));
}
module.exports = { waitAnyVisible };
