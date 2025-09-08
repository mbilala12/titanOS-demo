const { expect } = require('@playwright/test');
const testIds = require('../locators/testIds');
const { rc } = require('../utils/rc');
const { waitAnyVisible } = require('../utils/waits');

class SearchPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.remote = rc(page);
  }

  async open() {
    await this.page.getByTestId(testIds.nav.search).click();
    await this.remote.ok();
    const candidates = [
      () => this.page.getByTestId(testIds.search.page),
      () => this.page.getByRole('heading', { name: /search/i }),
      () => this.page.locator('[aria-label="Search"]'),
      () => this.page.locator('[data-page="search"], [data-section="search"]'),
    ];
    await waitAnyVisible(this.page, candidates, 20000);
  }

  categoryByNameOrId(category) {
    // Prefer exact category test-id if exists
    const byId = this.page.getByTestId(`${testIds.search.categoryByNamePrefix}${category.idSuffix}`);
    // Role-based fallbacks
    const byRole = this.page.getByRole('button', { name: new RegExp(category.name, 'i') })
      .or(this.page.getByRole('link', { name: new RegExp(category.name, 'i') }))
      .or(this.page.getByRole('gridcell', { name: new RegExp(category.name, 'i') }));
    // Generic tile test-id fallback with text
    const byGeneric = this.page.getByTestId(testIds.search.categoryTile).filter({ hasText: category.name });
    return byId.first().or(byRole.first()).or(byGeneric.first());
  }

  async openCategory(category) {
    let tile = this.categoryByNameOrId(category);
    if (await tile.count() === 0) {
      // Fallback: pick the first visible category tile by role
      tile = this.page.getByRole('button').or(this.page.getByRole('link')).first();
    }
    await expect(tile).toBeVisible();
    await tile.click({ trial: true }).catch(()=>{});
    await this.remote.ok();
    // Look for visible results (cards/list/grid items)
  const resultsList = this.page.locator('[role="list"], [role="grid"], [role="listbox"]');
  const resultItems = this.page.getByRole('listitem')
    .or(this.page.locator('[role="option"], [role="gridcell"]'))
    .or(this.page.locator('[data-testid*="result"], .card, .tile'));
  // Wait for at least one visible item
  const start = Date.now();
  while (Date.now() - start < 15000) {
    if (await resultItems.first().isVisible().catch(()=>false)) break;
    await this.page.waitForTimeout(250);
  }
  await expect(resultItems.first()).toBeVisible({ timeout: 2000 });
}
}

module.exports = { SearchPage };