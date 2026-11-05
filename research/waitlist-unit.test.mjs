import test from 'node:test';
import assert from 'node:assert/strict';
import { handleWaitlist, WAITLIST_MAX_BYTES } from '../lib/waitlist.ts';

const valid = {name:'Local Test',email:'local-test@example.com',role:'buyer',location:'Ann Arbor',consent:true,website:''};
const request = (body=valid, headers={}) => new Request('http://localhost/api/waitlist', {
  method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body),
});
const noAccess = {prepare(){throw new Error('Validation must not access storage');}};

test('invalid fields fail before storage and identify relevant fields', async()=>{
  const response=await handleWaitlist(request({name:'A',email:'invalid',role:'admin',consent:false,location:'x'.repeat(121)}),noAccess);
  assert.equal(response.status,400);
  const result=await response.json();
  assert.equal(result.ok,false);
  assert.deepEqual(Object.keys(result.fields).sort(),['consent','email','location','name','role']);
});
test('control characters in name are rejected',async()=>{
  const response=await handleWaitlist(request({...valid,name:'Test\u0000Name'}),noAccess);
  assert.equal(response.status,400);
});
test('cross-origin browser submissions are rejected',async()=>{
  assert.equal((await handleWaitlist(request(valid,{Origin:'https://other.example'}),noAccess)).status,403);
  assert.equal((await handleWaitlist(request(valid,{'Sec-Fetch-Site':'cross-site'}),noAccess)).status,403);
});
test('content type and malformed JSON are rejected',async()=>{
  assert.equal((await handleWaitlist(request(valid,{'Content-Type':'text/plain'}),noAccess)).status,415);
  const malformed=new Request('http://localhost/api/waitlist',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'});
  assert.equal((await handleWaitlist(malformed,noAccess)).status,400);
});
test('both declared and streamed oversized bodies are rejected',async()=>{
  assert.equal((await handleWaitlist(request(valid,{'Content-Length':String(WAITLIST_MAX_BYTES+1)}),noAccess)).status,413);
  assert.equal((await handleWaitlist(request({...valid,location:'x'.repeat(WAITLIST_MAX_BYTES)}),noAccess)).status,413);
});
test('honeypot does not report a successful registration',async()=>{
  const response=await handleWaitlist(request({...valid,website:'https://spam.invalid'}),noAccess);
  assert.equal(response.status,400);
  assert.equal((await response.json()).ok,false);
});
test('missing database cannot report success',async()=>{
  const response=await handleWaitlist(request(),undefined);
  assert.equal(response.status,503);
  assert.equal((await response.json()).ok,false);
});
test('database exceptions fail closed without leaking contact or SQL detail',async()=>{
  const db={prepare(){throw new Error('Sensitive email local-test@example.com SQL details');}};
  const response=await handleWaitlist(request(),db);
  assert.equal(response.status,503);
  assert.ok(!(await response.text()).includes('local-test@example.com'));
});
test('unsuccessful final database result cannot report success',async()=>{
  const db={prepare(sql){return {bind(){return {run:async()=>({success:!sql.startsWith('INSERT INTO waitlist_entries')}),first:async()=>({count:1})};}};}};
  const response=await handleWaitlist(request(),db);
  assert.equal(response.status,503);
  assert.equal((await response.json()).ok,false);
});
test('rate limit returns 429, retry guidance, and never inserts a signup',async()=>{
  let inserted=false;
  const db={prepare(sql){if(sql.startsWith('INSERT INTO waitlist_entries'))inserted=true;return {bind(){return {run:async()=>({success:true}),first:async()=>({count:13})};}};}};
  const response=await handleWaitlist(request(),db,1_800_000_001_000);
  assert.equal(response.status,429);
  assert.ok(Number(response.headers.get('Retry-After'))>0);
  assert.equal(inserted,false);
});
test('valid request is normalized, parameterized and only then acknowledged',async()=>{
  let params;
  const db={prepare(sql){return {bind(...values){if(sql.startsWith('INSERT INTO waitlist_entries'))params=values;return {run:async()=>({success:true}),first:async()=>({count:1})};}};}};
  const response=await handleWaitlist(request({...valid,name:'  Local Test  ',email:' LOCAL-TEST@EXAMPLE.COM ',role:'both'}),db);
  assert.equal(response.status,200);
  assert.deepEqual((await response.json()),{ok:true,message:'You’re on the Maychant waitlist.'});
  assert.equal(params[1],'Local Test');assert.equal(params[2],'local-test@example.com');assert.equal(params[3],'both');
  assert.equal(response.headers.get('Cache-Control'),'no-store');
});
