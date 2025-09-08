const { expect } = require('@playwright/test');
const testIds = require('../locators/testIds');
const { FavouritesRow } = require('../components/favouritesRow');
const { rc } = require('../utils/rc');

class HomePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.favs = new FavouritesRow(page);
    this.remote = rc(page);
  }

  // Permissive readiness: don't throw if neither appears.
  async waitForAppReady() {
    await this.page.waitForLoadState('domcontentloaded');
    const skip = process.env.SKIP_HOME_READY === '1' || process.env.SKIP_READY === '1';
    if (skip) return;

    const favRow = this.favs.root().first();
    const topNavAny = this.page.locator('[data-testid^="main-menu-item-"]').first()
      .or(this.page.getByRole('menuitem').first())
      .or(this.page.locator('[role="menubar"] [role="menuitem"]').first());

    const deadline = Date.now() + 8000;
    while (Date.now() < deadline) {
      try { if ((await favRow.count()) > 0 && await favRow.isVisible()) return; } catch {}
      try { if ((await topNavAny.count()) > 0 && await topNavAny.isVisible()) return; } catch {}
      await this.page.waitForTimeout(150);
    }
    return;
  }

  async openTopNav(name) {
    for (let i = 0; i < 2; i++) await this.remote.up();
    const id = (testIds.nav && testIds.nav[name]) || null;
    const fallbackLabel = name ? new RegExp(`^${name}$`, 'i') : /.*/i;

    for (let i = 0; i < 6; i++) await this.remote.left();
    for (let i = 0; i < 10; i++) {
      const isTarget =
        (id && (await this.page.getByTestId(id).first().getAttribute('aria-selected').catch(() => null)) === 'true') ||
        (await this.page.getByRole('menuitem', { name: fallbackLabel }).first().getAttribute('aria-selected').catch(() => null)) === 'true';
      if (isTarget) break;
      await this.remote.right();
      await this.page.waitForTimeout(40);
    }
    if (id) {
      const el = this.page.getByTestId(id).first();
      try { await el.scrollIntoViewIfNeeded(); await el.click({ timeout: 500 }); } catch {}
    }
    await this.remote.ok();
  }

  async focusFavouritesRow() {
    const row = this.favs.root();
    await row.waitFor({ state: 'visible', timeout: 50000 });
    await this.remote.right();
    await this.remote.ok();
    return row;
  }

  focussedTile() {
    const root = this.favs.root();
    return root.locator('[data-focused="focused"], [aria-selected="true"], [role="listitem"][aria-hidden="false"], [tabindex="0"]').first();
  }

  async focussedName() {
    const t = this.focussedTile();
    try {
      let name = await t.getAttribute('data-testid').catch(() => null);
      if (!name) name = await t.getAttribute('aria-label').catch(() => null);
      if (!name) name = await t.innerText().catch(() => null);
      return name ? name.trim() : null;
    } catch { return null; }
  }

  async gotoTileByName(name, maxSteps = 24) {
    for (let i = 0; i < 6; i++) await this.remote.left();
    for (let i = 0; i < maxSteps; i++) {
      const n = await this.focussedName();
      if (n && n.toLowerCase().includes(String(name).toLowerCase())) return true;
      await this.remote.right();
      await this.page.waitForTimeout(60);
    }
    return false;
  }

  async expectWatchTvNotDeletable(app = { name: 'Watch TV' }) {
    await this.focusFavouritesRow();
    await this.gotoTileByName(app.name);
    const before = await this.favs.visibleTiles().count();
    await this.remote.longOk(1200);
    await this.remote.down();
    await this.remote.ok();
    await this.page.waitForTimeout(400);
    await expect(this.favs.visibleTiles()).toHaveCount(before);
  }

  async deleteFirstDeletable() {
    await this.focusFavouritesRow();
    const nonDeletable = ['Watch TV'];
    let name = null;
    if (this.favs.pickFirstDeletableName) {
      try { name = await this.favs.pickFirstDeletableName(nonDeletable); } catch {}
    }
    if (!name) {
      for (let i = 0; i < 8; i++) {
        const cur = (await this.focussedName()) || '';
        if (!/watch\s*tv/i.test(cur)) { name = cur || null; break; }
        await this.remote.right();
        await this.page.waitForTimeout(80);
      }
    }
    const before = await this.favs.visibleTiles().count();
    const tryPatterns = [
      async () => { await this.remote.longOk(1200); await this.remote.down(); await this.remote.ok(); },
      async () => { await this.remote.longOk(1200); await this.remote.down(); await this.remote.down(); await this.remote.ok(); },
      async () => { await this.remote.longOk(1200); await this.remote.ok(); },
      async () => { await this.remote.longOk(1200); await this.remote.down(); await this.remote.right(); await this.remote.ok(); }
    ];
    let gone = false;
    for (const attempt of tryPatterns) {
      await attempt();
      const start = Date.now();
      while (Date.now() - start < 1200) {
        const byNameGone = name ? (await this.favs.visibleTileByNameOrId({ name }).count()) === 0 : false;
        const countNow = await this.favs.visibleTiles().count();
        if (byNameGone || countNow < before) { gone = true; break; }
        await this.page.waitForTimeout(80);
      }
      if (gone) break;
      await this.remote.right();
      await this.page.waitForTimeout(120);
    }
    if (!gone) throw new Error('Delete did not complete via long-press → down → ok.');
    if (name) await expect(this.favs.visibleTileByNameOrId({ name })).toHaveCount(0);
    return name || '';
  }
}

module.exports = { HomePage };
