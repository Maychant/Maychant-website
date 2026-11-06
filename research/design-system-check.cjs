const { chromium } = require('/private/tmp/maychant-visual-review/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

let browser;
(async () => {
  browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  const apiRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (request.url().includes('/api/waitlist')) apiRequests.push(request.url()); });
  const base = process.env.MAYCHANT_CHECK_URL || 'http://localhost:5178';
  const out = path.join(__dirname, 'qa-neighborhood/design-system');
  fs.mkdirSync(out, { recursive: true });
  await page.goto(`${base}/design-system`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.title(), 'Maychant — Design system');
  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, nofollow');
  assert.equal(await page.locator('.ds-section').count(), 8);
  await page.screenshot({ path: path.join(out, 'desktop-top.png') });
  for (const id of [1, 2, 3, 4, 5, 6, 7, 8]) {
    await page.locator(`#system-${id}`).screenshot({ path: path.join(out, `section-${id}.png`) });
  }
  await page.getByRole('button', { name: 'Try dark behind it' }).click();
  assert.equal(await page.locator('.ds-glass-demo').getAttribute('class'), 'ds-glass-demo is-night');
  await page.waitForTimeout(700);
  await page.locator('.ds-glass-demo').screenshot({ path: path.join(out, 'glass-dark.png') });
  await page.getByRole('button', { name: 'For business owners', exact: true }).click();
  assert.equal(await page.locator('.ds-pathways').getAttribute('data-active'), 'seller');
  assert.equal(await page.locator('.ds-pathway-buyer .ds-pathway-detail').evaluate(el => el.inert), true);
  assert.equal(await page.getByRole('button', { name: 'For business owners', exact: true }).getAttribute('aria-expanded'), 'true');
  await page.getByRole('button', { name: 'Open sample dialog' }).click();
  assert.equal(await page.locator('.ds-demo-dialog').evaluate(el => el.open), true);
  await page.getByRole('button', { name: 'Preview confirmation' }).click();
  const email = page.locator('.ds-demo-dialog input');
  assert.equal(await email.getAttribute('aria-invalid'), 'true');
  assert.equal(await email.evaluate(el => document.activeElement === el), true);
  await page.locator('.ds-demo-dialog').screenshot({ path: path.join(out, 'dialog-error.png') });
  await email.fill('preview@example.invalid');
  await page.getByRole('button', { name: 'Preview confirmation' }).click();
  await page.getByText('Preview complete. Nothing was sent or stored.').waitFor();
  assert.equal(await page.locator('.ds-dialog-result').evaluate(el => document.activeElement === el), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.ds-demo-dialog').evaluate(el => el.open), false);
  assert.equal(await page.getByRole('button', { name: 'Open sample dialog' }).evaluate(el => document.activeElement === el), true);
  assert.equal(apiRequests.length, 0, 'Reference previews must not send waitlist requests');
  for (const width of [390, 320, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 0); });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Overflow at ${width}px`);
    await page.screenshot({ path: path.join(out, `mobile-${width}.png`), fullPage: true });
    if (width === 320) {
      await page.screenshot({ path: path.join(out, 'mobile-guide-top.png') });
      await page.locator('#system-5').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(out, 'mobile-components.png') });
      await page.getByRole('button', { name: 'Open sample dialog' }).click();
      await page.waitForTimeout(350);
      assert.equal(await page.locator('.ds-demo-dialog').evaluate(el => getComputedStyle(el).opacity), '1');
      await page.screenshot({ path: path.join(out, 'mobile-dialog.png') });
      await page.keyboard.press('Escape');
    }
  }
  // A 1440px display at 200% browser zoom has a 720 CSS-pixel viewport.
  // CSS body zoom does not reproduce browser media-query reflow.
  await page.setViewportSize({ width: 720, height: 500 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Overflow at 200% equivalent viewport reflow');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Replay entrance' }).click();
  assert.equal(await page.locator('.ds-motion-piece').first().evaluate(el => getComputedStyle(el).animationName), 'none');
  assert.equal(await page.locator('.ds-motion-piece').first().evaluate(el => getComputedStyle(el).opacity), '1');
  const tokenResponse = await context.request.get(`${base}/brand/tokens.css`);
  assert.equal(tokenResponse.status(), 200);
  assert.ok((await tokenResponse.text()).includes('--mc-glass-fill'));
  assert.equal((await context.request.get(`${base}/brand/design-guide.md`)).status(), 200);
  await page.locator('.ds-site-link').click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForFunction(() => document.querySelector('#waitlist-form')?.dataset.ready === 'true');
  await page.locator('.nav-cta').click();
  assert.equal(await page.locator('#waitlist-dialog').evaluate(el => el.open), true, 'Homepage modal initializes after guide navigation');
  await page.keyboard.press('Escape');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(out, 'landing-desktop.png') });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.waitForTimeout(600);
  assert.equal(await page.locator('.site-header').count(), 1);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Homepage 320px overflow');
  await page.screenshot({ path: path.join(out, 'landing-mobile.png') });
  assert.deepEqual(errors, []);
  assert.equal(apiRequests.length, 0);
  await browser.close();
  console.log('Design system passes: eight sections, responsive layout, popup validation/success/Escape/focus restoration, panel expansion, glass theme, reduced motion, asset downloads, no API writes, and working homepage navigation.');
})().catch(async error => { console.error(error); if (browser) await browser.close(); process.exit(1); });
