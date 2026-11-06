// Explicit real-Postgres verification. Uses synthetic contacts only, then deletes
// only this run's exact UUIDs and hashed rate keys. Never calls an email service.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { handleWaitlist, WAITLIST_REQUEST_LIMIT } from '../lib/waitlist.ts';
import { createNeonWaitlistStore } from '../lib/waitlist-store.ts';

assert.equal(process.env.WAITLIST_DB_TEST,'1','Set WAITLIST_DB_TEST=1 to permit temporary synthetic database writes.');
assert.ok(process.env.DATABASE_URL,'DATABASE_URL is required.');
const sql=neon(process.env.DATABASE_URL);
const adapter=createNeonWaitlistStore(process.env.DATABASE_URL);
const ids=new Set();
const keys=new Set();
const store={
  async consumeRateLimit(input){keys.add(input.key);return adapter.consumeRateLimit(input);},
  async save(entry){ids.add(entry.id);await adapter.save(entry);},
};
const run=randomUUID();
const now=Date.now();
const email=`maychant-qa-${run}@example.invalid`;
const entry={name:'Synthetic QA Buyer',email,role:'buyer',location:'Synthetic test',consent:true,website:''};
const post=(body,identity='roles')=>handleWaitlist(new Request('https://waitlist-test.invalid/api/waitlist',{
  method:'POST',headers:{'Content-Type':'application/json',Origin:'https://waitlist-test.invalid'},body:JSON.stringify(body),
}),store,{clientIdentity:`test-${run}-${identity}`,now});

try{
  const first=await post(entry);
  assert.equal(first.status,200);
  const duplicate=await post({...entry,email:email.toUpperCase(),name:'Must not replace name',role:'seller'});
  assert.equal(duplicate.status,200);
  assert.deepEqual(await duplicate.json(),await first.json());
  const saved=await sql.query('SELECT name, role, consent_version FROM waitlist_entries WHERE email = $1',[email]);
  assert.equal(saved.length,1);
  assert.equal(saved[0].name,entry.name);
  assert.equal(saved[0].role,'buyer');
  assert.equal(saved[0].consent_version,'maychant-waitlist-v1');
  for(const role of ['seller','both']){
    assert.equal((await post({...entry,email:`maychant-qa-${run}-${role}@example.invalid`,role})).status,200);
  }
  assert.equal((await post({...entry,consent:false})).status,400);
  assert.equal((await post({...entry,website:'bot'})).status,400);

  const concurrentEmail=`maychant-qa-${run}-concurrent@example.invalid`;
  const responses=await Promise.all(Array.from({length:WAITLIST_REQUEST_LIMIT+4},()=>post({...entry,email:concurrentEmail},'concurrent')));
  assert.equal(responses.filter(response=>response.status===200).length,WAITLIST_REQUEST_LIMIT);
  assert.equal(responses.filter(response=>response.status===429).length,4);
  assert.ok(responses.filter(response=>response.status===429).every(response=>Number(response.headers.get('Retry-After'))>0));
  const counts=await sql.query('SELECT count(*)::integer AS count FROM waitlist_entries WHERE email = $1',[concurrentEmail]);
  assert.equal(counts[0].count,1);
  console.log('Postgres verification passed: saved roles, normalized duplicate, preserved consent, validation, atomic concurrent limit, one unique contact.');
}finally{
  await sql.query('DELETE FROM waitlist_entries WHERE id = ANY($1::uuid[])',[[...ids]]);
  await sql.query('DELETE FROM waitlist_rate_limits WHERE key = ANY($1::text[])',[[...keys]]);
  const remaining=await sql.query('SELECT count(*)::integer AS count FROM waitlist_entries WHERE id = ANY($1::uuid[])',[[...ids]]);
  assert.equal(remaining[0].count,0);
  console.log('Removed only this verification run’s synthetic contacts and rate keys.');
}
