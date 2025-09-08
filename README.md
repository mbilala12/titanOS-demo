# TitanOS — Automated UI Tests (Playwright + Allure, JS)

This repo contains a **JavaScript** Playwright test suite using **Page Object Model (POM)** and **keyboard "remote control" events** (arrows, enter, and long‑press). Reporting is configured with **Allure**.

> **Note on URL**: The live URL is **not** committed. Set it locally via `.env` (see below).

---

## Quick start

1) **Prereqs**
- Node.js >= 18
- Java (required by Allure CLI wrapper)
- (Optional) Google Chrome (Playwright will download browsers on first run)

2) **Install**
```bash
npm i
```

3) **Configure URL**
Create a `.env` from the sample, and set your local URL:
```bash
cp .env.example .env
# edit .env
TITANOS_BASE_URL=https://app.titanos.tv/
```

4) **Run tests (with Allure results)**
```bash
npm run test:allure
```

5) **Open Allure report**
```bash
npm run report:allure
npm run open:allure
```

(You can also view Playwright's built‑in HTML report via `npm run report:html`.)

---

## Project layout

```
/tests
  home.spec.js         # delete from favourites; Watch TV not deletable
  apps.spec.js         # add to favourites from Apps page
  search.spec.js       # open a category from Search
  channels.spec.js     # channels page is usable
/pages
  homePage.js
  appsPage.js
  searchPage.js
  channelsPage.js
/components
  favouritesRow.js
  contextMenu.js
/utils
  rc.js                # remote-control helpers (arrows, enter, long-press)
  env.js
/locators
  testIds.js           # central test-id constants
  testData.js          # app/category names + id suffixes to target
playwright.config.js
```

---

## Remote‑control actions

All interactions in content areas use **keyboard events** via `utils/rc.js`.  
Long‑press is simulated by holding **Enter** for `ms`:

```js
const { rc } = require('./utils/rc');
const remote = rc(page);

await remote.longOk(1200);
```


Page Objects will prefer exact test‑ids when available (e.g., `app-tile-youtube`), and gracefully fall back to **within‑tile text** if needed.

---

## CI

A minimal GitHub Actions workflow is provided under `.github/workflows/ci.yml` to run tests and upload the Allure results as an artifact.

---
