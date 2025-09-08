const { expect } = require('@playwright/test');
const testIds = require('../locators/testIds');
const { rc } = require('../utils/rc');
const { waitAnyVisible } = require('../utils/waits');

class AppsPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.remote = rc(page);
    this.testIds = testIds;
  }


  async openViaTopNav(home) {

    await this.page.waitForLoadState('networkidle');
    for (let i = 0; i < 2; i++) await this.remote.up();
    for (let i = 0; i < 5; i++) await this.remote.right();
    await this.remote.ok();

   
    await waitAnyVisible(
      this.page,
      [
        () => this.page.locator('[data-testid^="list-item-app_list-"]').first(),
        () => this.page.getByRole('list', { name: /featured/i }).first(),
        () => this.page.getByText(/featured apps?/i).first(),
        () => this.page.locator('[role="list"]').first(),
      ],
      7000
    );
  }


  async addFromFeaturedIfPossible(home) {
    const start = Date.now();
    const budgetMs = 7000;
    const maxRails = 3;
    const maxTiles = 6;
    const timedOut = () => Date.now() - start > budgetMs;

    // Find a first rail we can enter
    let rail = this.page
      .locator('[data-testid^="list-item-app_list-"]').first()
      .or(this.page.getByRole('list', { name: /featured/i }).first())
      .or(this.page.getByText(/featured/i).first().locator('xpath=following::*[@role="list"][1]'))
      .or(this.page.locator('[role="list"]').first());

    try {
      await rail.first().waitFor({ state: 'visible', timeout: 1500 });
    } catch {
      return '';
    }

    await this.remote.ok();

    for (let r = 0; r < maxRails; r++) {
      if (timedOut()) return '';

      rail = this.page
        .locator('[data-testid^="list-item-app_list-"]').nth(r)
        .or(this.page.locator('[role="list"]').nth(r));

      try {
        await rail.first().waitFor({ state: 'visible', timeout: 800 });
      } catch {
        await this.remote.down();
        continue;
      }
      await this.remote.ok();

      for (let i = 0; i < maxTiles; i++) {
        if (timedOut()) return '';
        if (i > 0) { await this.remote.right(); await this.page.waitForTimeout(50); }

        // Best-effort name of the focused tile
        let candidateName = '';
        try {
          const tile = rail.locator('[data-focused="focused"]').first()
            .or(rail.locator('[role="listitem"][aria-hidden="false"]').first())
            .or(rail.locator('[role="listitem"]').nth(i));
          if (await tile.count() > 0) {
            candidateName =
              (await tile.getAttribute('data-testid').catch(() => '')) ||
              (await tile.innerText().catch(() => ''));
            candidateName = (candidateName || '').trim();
          }
        } catch {}

        await this.remote.ok();

        const addBtn = this.page
          .locator('#' + this.testIds.appDetails.addToFavouritesBtn)
          .or(this.page.getByRole('button', { name: /add to favou?rites?/i }))
          .first();
        const removeBtn = this.page.getByRole('button', { name: /remove from favou?rites?/i }).first();
        const detailsHeader = this.page.locator('[data-testid="app-title"], h1, h2').first();

        const settleStart = Date.now();
        while (Date.now() - settleStart < 250) {
          const seen =
            (await addBtn.count()) > 0 ||
            (await removeBtn.count()) > 0 ||
            (await detailsHeader.count()) > 0;
          if (seen) break;
          await this.page.waitForTimeout(40);
        }

        // If we can add, do it
        if ((await addBtn.count()) > 0 && (await addBtn.isVisible().catch(() => false))) {
          let detailsName = await detailsHeader.innerText().catch(() => '');
          detailsName = (detailsName || '').trim();
          const chosen = detailsName || candidateName || '';

          await addBtn.click().catch(async () => { await this.remote.ok(); });

          // Either redirects to Home (favourites row visible) or the button flips to Remove.
          const favRow = this.page.getByTestId('favourite-apps').first()
            .or(this.page.getByTestId('favorite-apps').first())
            .or(this.page.locator('[aria-label="Favourite Apps"], [aria-label="Favorite Apps"]').first());

          let homeSeen = false;
          const homeStart = Date.now();
          while (Date.now() - homeStart < 4000) {
            if ((await favRow.count()) > 0 && await favRow.first().isVisible().catch(() => false)) {
              homeSeen = true; break;
            }
            await this.page.waitForTimeout(60);
          }

          if (!homeSeen) {
            const removeNow = this.page.getByRole('button', { name: /remove from favou?rites?/i }).first();
            if ((await removeNow.count()) > 0 && home) {
              await home.openTopNav('home'); // go Home explicitly if still on details
              await home.waitForAppReady();
            }
          }
          return chosen;
        }

        // Not addable: back out to rail and continue
        await this.remote.left();
        await this.page.waitForTimeout(60);
      }

      // Next rail down
      await this.remote.down();
      await this.page.waitForTimeout(60);
    }

    return '';
  }
}

module.exports = { AppsPage };
