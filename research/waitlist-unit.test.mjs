import test from 'node:test';
import assert from 'node:assert/strict';
import { handleWaitlist, WAITLIST_MAX_BYTES, WAITLIST_REQUEST_LIMIT, WAITLIST_WINDOW_SECONDS } from '../lib/waitlist.ts';

const valid = {name:'Local Test',email:'local-test@example.com',role:'buyer',location:'Ann Arbor',consent:true,website:''};
const request = (body=valid, headers={}) => new Request('http://localhost/api/waitlist', {
  method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body),
});
const noAccess = {
  consumeRateLimit(){assert.fail('Validation must not access storage');},
  save(){assert.fail('Validation must not access storage');},
};

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
  const db={consumeRateLimit(){throw new Error('Sensitive email local-test@example.com SQL details');}};
  const response=await handleWaitlist(request(),db);
  assert.equal(response.status,503);
  assert.ok(!(await response.text()).includes('local-test@example.com'));
});
test('failed final save cannot report success',async()=>{
  const db={consumeRateLimit:async()=>1,save:async()=>{throw new Error('insert failed');}};
  const response=await handleWaitlist(request(),db);
  assert.equal(response.status,503);
  assert.equal((await response.json()).ok,false);
});
test('rate limit returns 429, retry guidance, and never inserts a signup',async()=>{
  let inserted=false;
  const db={consumeRateLimit:async()=>13,save:async()=>{inserted=true;}};
  const response=await handleWaitlist(request(),db,{now:1_800_000_001_000});
  assert.equal(response.status,429);
  assert.ok(Number(response.headers.get('Retry-After'))>0);
  assert.equal(inserted,false);
});
test('valid request is normalized and only then acknowledged',async()=>{
  let entry;
  const db={consumeRateLimit:async()=>1,save:async(value)=>{entry=value;}};
  const response=await handleWaitlist(request({...valid,name:'  Local Test  ',email:' LOCAL-TEST@EXAMPLE.COM ',role:'both'}),db);
  assert.equal(response.status,200);
  assert.deepEqual((await response.json()),{ok:true,message:'You’re on the Maychant waitlist.'});
  assert.equal(entry.name,'Local Test');assert.equal(entry.email,'local-test@example.com');assert.equal(entry.role,'both');
  assert.equal(entry.consentVersion,'maychant-waitlist-v1');
  assert.equal(entry.createdAt,entry.consentedAt);
  assert.equal(response.headers.get('Cache-Control'),'no-store');
});

test('acknowledgement waits until durable save resolves',async()=>{
  let finish;
  const saved=new Promise(resolve=>{finish=resolve;});
  let saveStarted;
  const started=new Promise(resolve=>{saveStarted=resolve;});
  const db={consumeRateLimit:async()=>1,save:async()=>{saveStarted();await saved;}};
  let acknowledged=false;
  const response=handleWaitlist(request(),db).then(value=>{acknowledged=true;return value;});
  await started;
  await Promise.resolve();
  assert.equal(acknowledged,false);
  finish();
  assert.equal((await response).status,200);
});

test('malformed rate results fail closed without inserting',async()=>{
  for(const count of [undefined,null,NaN,0,-1,1.5,'1']){
    const db={consumeRateLimit:async()=>count,save(){assert.fail('Invalid counter must not insert');}};
    assert.equal((await handleWaitlist(request(),db)).status,503);
  }
});

test('legacy and arbitrary forwarded headers cannot select rate-limit identities',async()=>{
  const observed=[];
  const db={consumeRateLimit:async input=>{observed.push(input);return 1;},save:async()=>{}};
  const now=1_800_000_001_000;
  for(const ip of ['192.0.2.1','192.0.2.2']){
    await handleWaitlist(request(valid,{'CF-Connecting-IP':ip,'OAI-Authenticated-User-ID':ip,'X-Forwarded-For':ip}),db,{now});
  }
  assert.equal(observed[0].key,observed[1].key);
  assert.match(observed[0].key,/^[a-f0-9]{64}$/u);
  assert.equal(observed[0].limit,WAITLIST_REQUEST_LIMIT);
  assert.equal(observed[0].expiresAt,Math.floor(now/1000/WAITLIST_WINDOW_SECONDS)*WAITLIST_WINDOW_SECONDS+WAITLIST_WINDOW_SECONDS);
  await handleWaitlist(request(),db,{now,clientIdentity:'192.0.2.1'});
  await handleWaitlist(request(),db,{now:now+WAITLIST_WINDOW_SECONDS*1000,clientIdentity:'192.0.2.1'});
  assert.notEqual(observed[0].key,observed[2].key);
  assert.notEqual(observed[2].key,observed[3].key);
  assert.ok(!JSON.stringify(observed).includes('192.0.2.1'));
});

test('all roles are accepted, optional location defaults empty, unicode becomes NFC',async()=>{
  const entries=[];
  const db={consumeRateLimit:async()=>1,save:async entry=>{entries.push(entry);}};
  for(const role of ['buyer','seller','both']){
    assert.equal((await handleWaitlist(request({...valid,role,name:'Jose\u0301 Test',location:undefined}),db)).status,200);
  }
  assert.deepEqual(entries.map(entry=>entry.role),['buyer','seller','both']);
  assert.ok(entries.every(entry=>entry.name==='José Test'&&entry.location===''));
});

test('equivalent single-character names fail field validation before storage',async()=>{
  for(const name of ['é','e\u0301']){
    const response=await handleWaitlist(request({...valid,name}),noAccess);
    assert.equal(response.status,400);
    const result=await response.json();
    assert.equal(result.ok,false);
    assert.deepEqual(Object.keys(result.fields),['name']);
  }
});

test('name and location maximum lengths apply after NFC normalization',async()=>{
  let saved;
  const db={consumeRateLimit:async()=>1,save:async entry=>{saved=entry;}};
  const response=await handleWaitlist(request({...valid,name:'e\u0301'.repeat(100),location:'e\u0301'.repeat(120)}),db);
  assert.equal(response.status,200);
  assert.equal(saved.name,'é'.repeat(100));
  assert.equal(saved.location,'é'.repeat(120));
});
