const { expect } = require('@playwright/test');
const testIds = require('../locators/testIds');

class ContextMenu {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.menu = page.getByTestId(testIds.home.contextMenu).first().or(page.getByRole('menu'));
  }

  optionDelete() {
    const byId = this.menu.getByTestId(testIds.home.menuItemDelete);
    const byRole = this.menu.getByRole('menuitem', { name: /delete/i });
    const byText = this.menu.locator('text=/^\s*Delete\s*$/i');
    return byId.first().or(byRole.first()).or(byText.first());
  }

  async chooseDeleteIfVisible() {
    const opt = this.optionDelete();
    if (await opt.count() > 0 && await opt.isVisible()) {
      await opt.click();
      return true;
    }
    return false;
  }

  async expectDeleteAbsentOrDisabled() {
    const opt = this.optionDelete();
    if (await opt.count() === 0) {
      // If no option, consider it absent.
      await expect(opt).toHaveCount(0);
    } else {
      try {
        await expect(opt).toBeDisabled();
      } catch {
        // If it's visible and enabled, fail explicitly.
        throw new Error('Delete option is present and enabled, but should be absent/disabled for Watch TV.');
      }
    }
  }
}

module.exports = { ContextMenu };