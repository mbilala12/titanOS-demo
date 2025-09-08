const { expect } = require('@playwright/test');

class FavouritesRow {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  root() {
    return this.page.getByTestId('favourite-apps').first()
      .or(this.page.getByTestId('favorite-apps').first())
      .or(this.page.locator('[aria-label="Favourite Apps"], [aria-label="Favorite Apps"]').first())
      .or(this.page.getByRole('heading', { name: /favourite apps|favorite apps/i }).locator('xpath=following::*[self::section or self::div][1]').first());
  }

  tiles() {
    const root = this.root();
    return root.locator('[role="listitem"], [role="button"], [role="link"]');
  }

  visibleTiles() {
    const root = this.root();
    return root.locator('[role="listitem"][aria-hidden="false"], [role="listitem"][data-focused="focused"], [role="button"][aria-hidden="false"], [role="link"][aria-hidden="false"]');
  }

  tileByNameOrId(param) {
    const root = this.root();
    const name = typeof param === 'string' ? param : (param?.name || param?.id || '');
    const byId = root.locator(`[data-testid="${name}"]`).first();
    const safe = (name || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const byText = root.locator('[role="listitem"], [role="button"], [role="link"]').filter({ hasText: new RegExp(safe, 'i') }).first();
    return byId.or(byText);
  }

  visibleTileByNameOrId(param) {
    const v = this.visibleTiles();
    const name = typeof param === 'string' ? param : (param?.name || param?.id || '');
    const byId = v.locator(`[data-testid="${name}"]`).first();
    const safe = (name || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const byText = v.filter({ hasText: new RegExp(safe, 'i') }).first();
    return byId.or(byText);
  }

  async pickFirstDeletableName(nonDeletable = []) {
    const v = this.visibleTiles();
    const n = await v.count();
    for (let i = 0; i < n; i++) {
      const el = v.nth(i);
      const id = await el.getAttribute('data-testid').catch(() => null);
      const aria = await el.getAttribute('aria-label').catch(() => null);
      const txt = await el.innerText().catch(() => null);
      const name = (id || aria || txt || '').trim();
      if (!name) continue;
      if (nonDeletable.some(nd => new RegExp(nd, 'i').test(name))) continue;
      return name;
    }
    return null;
  }
}

module.exports = { FavouritesRow };
