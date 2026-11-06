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
  const response=await handleWaitlist(request({name:' ',email:'invalid',role:'admin',consent:false,location:'x'.repeat(121)}),noAccess);
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
  assert.equal(entry.phone,null);
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

test('one-character names are accepted and canonically equivalent names normalize identically',async()=>{
  const entries=[];
  const db={consumeRateLimit:async()=>1,save:async entry=>{entries.push(entry);}};
  for(const name of ['A','é','e\u0301']){
    assert.equal((await handleWaitlist(request({...valid,name}),db)).status,200);
  }
  assert.deepEqual(entries.map(entry=>entry.name),['A','é','é']);
});

test('name and location maximum lengths apply after NFC normalization',async()=>{
  let saved;
  const db={consumeRateLimit:async()=>1,save:async entry=>{saved=entry;}};
  const response=await handleWaitlist(request({...valid,name:'e\u0301'.repeat(100),location:'e\u0301'.repeat(120)}),db);
  assert.equal(response.status,200);
  assert.equal(saved.name,'é'.repeat(100));
  assert.equal(saved.location,'é'.repeat(120));
});

const newSignup={name:'K',contact:'contact-test@example.com',role:'buyer',consent:true,website:''};

test('new email contacts are normalized with v2 consent and no phone',async()=>{
  let saved;
  const db={consumeRateLimit:async()=>1,save:async entry=>{saved=entry;}};
  assert.equal((await handleWaitlist(request({...newSignup,contact:' CONTACT-TEST@EXAMPLE.COM '}),db)).status,200);
  assert.equal(saved.email,'contact-test@example.com');
  assert.equal(saved.phone,null);
  assert.equal(saved.location,'');
  assert.equal(saved.consentVersion,'maychant-waitlist-v2');
});

test('formatted US contacts and international contacts normalize to E.164',async()=>{
  const entries=[];
  const db={consumeRateLimit:async()=>1,save:async entry=>{entries.push(entry);}};
  const contacts=[['(202) 555-0123','+12025550123'],['+1 202.555.0123','+12025550123'],['+44 20 7946 0018','+442079460018']];
  for(const [contact,expected] of contacts){
    assert.equal((await handleWaitlist(request({...newSignup,contact}),db)).status,200);
    assert.equal(entries.at(-1).phone,expected);
    assert.equal(entries.at(-1).email,null);
    assert.equal(entries.at(-1).consentVersion,'maychant-waitlist-v2');
  }
});

test('new contact supports every role and the same rate-limit identity as legacy submissions',async()=>{
  const entries=[],limits=[];
  const db={consumeRateLimit:async value=>{limits.push(value);return 1;},save:async entry=>{entries.push(entry);}};
  const context={clientIdentity:'192.0.2.1',now:1_800_000_001_000};
  for(const role of ['buyer','seller','both']){
    assert.equal((await handleWaitlist(request({...newSignup,role}),db,context)).status,200);
  }
  await handleWaitlist(request(valid),db,context);
  assert.deepEqual(entries.slice(0,3).map(entry=>entry.role),['buyer','seller','both']);
  assert.ok(limits.every(value=>value.key===limits[0].key));
});

test('invalid contacts fail before storage and cannot fall back to a legacy email',async()=>{
  for(const contact of ['',null,123,'not-an-email','a@@example.com','12345','+1 111 111 1111',
    '202-555-0123 ext 5','Call +1 202 555 0123','+1 202\u0000555 0123','x'.repeat(255)]){
    const response=await handleWaitlist(request({...newSignup,contact,email:valid.email}),noAccess);
    assert.equal(response.status,400);
    assert.deepEqual(Object.keys((await response.json()).fields),['contact']);
  }
});

test('missing contact in the new form reports the contact field',async()=>{
  const response=await handleWaitlist(request({...newSignup,contact:undefined}),noAccess);
  assert.equal(response.status,400);
  assert.deepEqual(Object.keys((await response.json()).fields),['contact']);
});

test('new and cached payloads require true consent before storage',async()=>{
  for(const base of [newSignup,valid]){
    for(const consent of [false,undefined,'true']){
      const response=await handleWaitlist(request({...base,consent}),noAccess);
      assert.equal(response.status,400);
      assert.deepEqual(Object.keys((await response.json()).fields),['consent']);
    }
  }
});

test('names are 1–100 Unicode characters, without controls or empty values',async()=>{
  let saved;
  const db={consumeRateLimit:async()=>1,save:async entry=>{saved=entry;}};
  const name='𐐀'.repeat(100);
  assert.equal((await handleWaitlist(request({...newSignup,name}),db)).status,200);
  assert.equal(saved.name,name);
  for(const name of ['', '   ', 'A'.repeat(101), '𐐀'.repeat(101),'K\u0000']){
    const response=await handleWaitlist(request({...newSignup,name}),noAccess);
    assert.equal(response.status,400);
    assert.deepEqual(Object.keys((await response.json()).fields),['name']);
  }
});
