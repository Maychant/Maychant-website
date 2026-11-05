const { chromium } = require('/private/tmp/maychant-visual-review/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  const warnings = [];
  const failedRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
    if (message.type() === 'warning') warnings.push(message.text());
  });
  page.on('requestfailed', request => failedRequests.push(request.url()));
  const response = await page.goto('http://127.0.0.1:8787/', { waitUntil: 'networkidle', timeout: 30000 });
  assert.equal(response.status(), 200);
  await page.waitForFunction(() => document.querySelector('#waitlist-form')?.dataset.ready === 'true');
  const initialized = await page.evaluate(() => ({
    ready: document.querySelector('#waitlist-form').dataset.ready,
    gsap: Boolean(window.gsap),
    scrollTrigger: Boolean(window.ScrollTrigger),
    appScripts: [...document.scripts].filter(script => new URL(script.src || location.href).pathname === '/app.js').length,
    heroBuildings: document.querySelectorAll('.street-building').length,
  }));
  assert.equal(initialized.appScripts, 1);
  assert.ok(initialized.gsap && initialized.scrollTrigger && initialized.heroBuildings > 0);
  const toggle = page.locator('.street-footer .motion-toggle');
  const before = await toggle.getAttribute('aria-pressed');
  await toggle.click();
  assert.notEqual(await toggle.getAttribute('aria-pressed'), before);
  const readAttempt = await page.request.get('http://127.0.0.1:8787/api/waitlist');
  assert.equal(readAttempt.status(), 405);
  const invalidAttempt = await page.request.post('http://127.0.0.1:8787/api/waitlist', {
    data: { name: '', email: 'invalid', role: 'buyer', consent: false },
  });
  assert.equal(invalidAttempt.status(), 400);
  assert.equal((await invalidAttempt.json()).ok, false);
  assert.deepEqual(errors, []);
  assert.deepEqual(failedRequests, []);
  assert.ok(!warnings.some(message => /hydrat|didn.t match/i.test(message)));
  const result = { checkedAt: new Date().toISOString(), http: response.status(), initialized,
    apiReadStatus: readAttempt.status(), apiInvalidStatus: invalidAttempt.status(),
    errors, warnings, failedRequests, signupsCreated: 0 };
  fs.writeFileSync('.sites-runtime/final-built-check.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
