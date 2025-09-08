const { test } = require('@playwright/test');
const { ChannelsPage } = require('../pages/channelsPage');

test.describe('Channels — Page is usable', () => {

  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL);
    // Wait for left menu to be ready per DOM attributes
    const HomePage = require('../pages/homePage').HomePage;
    const _homeTmp = new HomePage(page);
    await _homeTmp.waitForAppReady();
  });

  test('Open channels page and interact', async ({ page }) => {
    const channels = new ChannelsPage(page);
    await channels.open();
    await channels.verifyUsable();
  });

});