function rc(page) {
  return {
    left:  () => page.keyboard.press('ArrowLeft'),
    right: () => page.keyboard.press('ArrowRight'),
    up:    () => page.keyboard.press('ArrowUp'),
    down:  () => page.keyboard.press('ArrowDown'),
    ok:    () => page.keyboard.press('Enter'),
    async longOk(ms = 1200) {
      await page.keyboard.down('Enter'); await page.waitForTimeout(ms); await page.keyboard.up('Enter');
    }
  };
}
module.exports = { rc };
