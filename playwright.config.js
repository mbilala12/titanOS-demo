/** @type {import('@playwright/test').PlaywrightTestConfig} */
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

const baseURL = process.env.TITANOS_BASE_URL || 'https://app.titanos.tv/';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: 1,
  reporter: [['line'], ['allure-playwright']],
  use: {
    baseURL,
    headless: true,
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    testIdAttribute: 'data-testid',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ]
});