const { expect } = require('@playwright/test');
const testIds = require('../locators/testIds');
const { rc } = require('../utils/rc');
const { waitAnyVisible } = require('../utils/waits');

class ChannelsPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.remote = rc(page);
  }

  async open() {
    await this.page.getByTestId(testIds.nav.channels).click();
    await this.remote.ok();
    const candidates = [
      () => this.page.getByTestId(testIds.channels.page),
      () => this.page.getByRole('heading', { name: /channels|tv guide/i }),
      () => this.page.locator('[aria-label="Channels"], [aria-label="TV Guide"]'),
      () => this.page.locator('[data-page="channels"], [data-section="channels"]'),
    ];
    await waitAnyVisible(this.page, candidates, 20000);
  }

  async verifyUsable() {
    // list/grid candidates
    const list = this.page.getByTestId(testIds.channels.list)
      .or(this.page.locator('[role="list"], [role="listbox"], [role="grid"], [role="table"]'));
    await expect(list.first()).toBeVisible({ timeout: 15000 });
    // Try moving focus in the list using keyboard arrows
    for (let i = 0; i < 3; i++) await this.remote.down();
    // Check at least one item
    const item = this.page.getByTestId(testIds.channels.item)
      .or(this.page.getByRole('listitem'))
      .or(this.page.getByRole('option'))
      .or(this.page.locator('[role="row"], [role="gridcell"]'));
    await expect(item.first()).toBeVisible({ timeout: 15000 });
  }
}

module.exports = { ChannelsPage };