const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/homePage');
const { AppsPage } = require('../pages/appsPage');

test.describe('Apps — Add to favourites', () => {
  test('Open app details and add to favourites', async ({ page }) => {
    const home = new HomePage(page);
    const apps = new AppsPage(page);

    const url = process.env.TITANOS_BASE_URL;
    await page.goto(url);
    await home.waitForAppReady();

    await test.step('Go to Apps via top menu', async () => {
      await apps.openViaTopNav('apps');
    });

    const chosenName = await test.step('Pick from Featured Apps and add', async () => {
      const name = await apps.addFromFeaturedIfPossible(home); // ← pass home
      return name || '';
    });

   // test.skip(!chosenName, 'No addable app found in Featured Apps, skipping.');

    await test.step('Return Home and verify in favourites', async () => {
      // Many builds redirect to Home automatically after adding; still safe to force Home.
      await home.openTopNav('home');
      await home.waitForAppReady();
      await home.focusFavouritesRow();
      await expect(home.favs.visibleTileByNameOrId({ name: chosenName })).toHaveCount(1);
    });
  });
});
