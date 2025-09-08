const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/homePage');
const data = require('../locators/testData');

test.describe('Home — Favourites row', () => {

  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL);
    // Wait for left menu to be ready per DOM attributes
    const HomePage = require('../pages/homePage').HomePage;
    const _homeTmp = new HomePage(page);
    await _homeTmp.waitForAppReady();
  });

  test('Delete app from favourites (skip Watch TV))', async ({ page }) => {
    const home = new HomePage(page);
    await test.step('Focus favourites row', async () => {
      await home.focusFavouritesRow();
    });

    await test.step('Delete app from favourites (skip Watch TV))', async () => {
  const removedName = await home.deleteFirstDeletable();
      if (removedName) {
        await expect(home.favs.visibleTileByNameOrId({ name: removedName })).toHaveCount(0);
      }
});

    await test.step(`Assert '${data.nonDeletableApp.name}' cannot be deleted`, async () => {
      await home.expectWatchTvNotDeletable(data.nonDeletableApp);
    });
  });

});