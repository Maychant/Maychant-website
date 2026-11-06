const {chromium}=require('/private/tmp/maychant-visual-review/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const out='research/qa-neighborhood/simple-waitlist';fs.mkdirSync(out,{recursive:true});
 const payloads=[];let fail=true;
 await page.route('**/api/waitlist',route=>{payloads.push(route.request().postDataJSON());return route.fulfill({status:fail?400:200,contentType:'application/json',body:JSON.stringify(fail?{ok:false,error:'Please check the highlighted fields.',fields:{contact:'Enter a valid email or phone number.'}}:{ok:true})});});
 await page.goto(process.env.MAYCHANT_CHECK_URL||'http://localhost:5178',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.querySelector('#waitlist-form')?.dataset.ready==='true');
 await page.locator('.seller-cta').click();
 assert.equal(await page.locator('[name="role"]:checked').inputValue(),'seller');
 assert.equal(await page.locator('#waitlist-form input:not([type="radio"]):not([name="website"])').count(),2);
 assert.equal(await page.locator('#waitlist-form input[type="checkbox"], #waitlist-location').count(),0);
 await page.locator('#waitlist-name').fill('Q');await page.locator('#waitlist-contact').fill('not a contact');
 await page.locator('.submit-button').click();await page.locator('#contact-error').getByText('Enter a valid email or phone number.').waitFor();
 assert.equal(await page.evaluate(()=>document.activeElement.id),'waitlist-contact');assert.equal(await page.locator('#waitlist-name').inputValue(),'Q');
 fail=false;await page.locator('#waitlist-contact').fill('(202) 555-0123');await page.locator('.submit-button').click();await page.locator('#waitlist-success').waitFor({state:'visible'});
 assert.deepEqual(payloads.at(-1),{name:'Q',contact:'(202) 555-0123',role:'seller',consent:true,website:''});
 await page.locator('#add-another').click();await page.locator('#waitlist-name').fill('Example');await page.locator('#waitlist-contact').fill('check@example.invalid');
 await page.screenshot({path:out+'/desktop.png'});
 await page.locator('.submit-button').click();await page.locator('#waitlist-success').waitFor({state:'visible'});assert.equal(payloads.at(-1).contact,'check@example.invalid');
 await page.locator('#add-another').click();
 for(const width of [390,320]){
  await page.setViewportSize({width,height:844});await page.waitForTimeout(450);
  const d=await page.locator('#waitlist-dialog').boundingBox();assert(d.x>=0&&d.x+d.width<=width);assert(d.y>=0&&d.y+d.height<=844);
  assert(await page.locator('#waitlist-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth));
  await page.screenshot({path:out+'/mobile-'+width+'.png'});
 }
 await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('seller-cta')),true);
 assert.deepEqual(errors,[]);await browser.close();
 console.log('Simple waitlist checks passed: two inputs plus role; no location or checkbox; email/phone payloads; validation, preserved values, success, focus restoration; 1440/390/320 layouts. All submissions mocked.');
})().catch(e=>{console.error(e);process.exit(1)});
