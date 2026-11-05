import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';

const base = new URL(process.argv[2] || 'http://127.0.0.1:8787');
assert.ok(['127.0.0.1','localhost','[::1]'].includes(base.hostname), 'Synthetic signup tests are local-only.');
const prefix = `qa-${Date.now()}`;
const responseLog=[];
const post=async(payload,ip='192.0.2.10')=>{
  const response=await fetch(new URL('/api/waitlist',base),{
    method:'POST',headers:{'Content-Type':'application/json','Origin':base.origin,'CF-Connecting-IP':ip},
    body:JSON.stringify(payload),
  });
  const body=await response.json();
  responseLog.push({status:response.status,body,retryAfter:response.headers.get('Retry-After')});
  return {response,body};
};
const entry={name:'Local QA Buyer',email:`${prefix}@example.com`,role:'buyer',location:'Test location',consent:true,website:''};
const first=await post(entry);
assert.equal(first.response.status,200);assert.equal(first.body.ok,true);
const duplicate=await post({...entry,name:'Do not overwrite',email:entry.email.toUpperCase(),role:'seller'});
assert.equal(duplicate.response.status,200);assert.deepEqual(duplicate.body,first.body);
const seller=await post({...entry,name:'Local QA Seller',email:`${prefix}-seller@example.com`,role:'seller'},'192.0.2.11');
assert.equal(seller.response.status,200);
const both=await post({...entry,name:'Local QA Both',email:`${prefix}-both@example.com`,role:'both',location:undefined},'192.0.2.12');
assert.equal(both.response.status,200);
const concurrent=await Promise.all(Array.from({length:4},()=>post({...entry,email:`${prefix}-concurrent@example.com`},'192.0.2.13')));
assert.ok(concurrent.every(item=>item.response.status===200&&item.body.ok));
const invalid=await post({...entry,consent:false});assert.equal(invalid.response.status,400);
const trapped=await post({...entry,website:'bot'});assert.equal(trapped.response.status,400);
const listing=await fetch(new URL('/api/waitlist',base));assert.equal(listing.status,405);
const rateStatuses=[];
for(let i=0;i<13;i++)rateStatuses.push((await post({...entry,email:`${prefix}-rate@example.com`},'192.0.2.14')).response.status);
assert.equal(rateStatuses[12],429);assert.ok(rateStatuses.some(status=>status===200));
const record={prefix,firstEmail:entry.email,expectedUniqueEntries:5,responseLog,checks:{durablePost:true,duplicateSameResponse:true,threeRoles:true,concurrentRetry:true,noConsentRejected:true,honeypotRejected:true,noReadEndpoint:true,rateLimit:true}};
writeFileSync('.sites-runtime/waitlist-test-results.json',JSON.stringify(record,null,2));
console.log(JSON.stringify({prefix,firstEmail:entry.email,expectedUniqueEntries:5,checks:record.checks},null,2));
