import test from 'node:test';
import assert from 'node:assert/strict';
import { createPostgresWaitlistStore, createNeonWaitlistStore } from '../lib/waitlist-store.ts';
import { setupWaitlistDatabase, WAITLIST_SCHEMA_STATEMENTS, main } from '../scripts/setup-waitlist-db.mjs';
import { migrateWaitlistContact, WAITLIST_CONTACT_MIGRATION_STATEMENTS, main as migrateMain } from '../scripts/migrate-waitlist-contact.mjs';

const entry={id:'00000000-0000-4000-8000-000000000001',name:"O'Reilly <script>",email:'test@example.invalid',phone:null,role:'both',location:'Ann Arbor',consentVersion:'maychant-waitlist-v1',consentedAt:1800000001,createdAt:1800000001};
const inserted={command:'INSERT',rowCount:1,rows:[]};

test('contacts remain parameters; a duplicate is acknowledged without reading or changing the contact',async()=>{
  for(const contact of [{email:entry.email,phone:null},{email:null,phone:'+12025550123'}]){
  const candidate={...entry,...contact};
  for(const rowCount of [1,0]){
    const calls=[];
    const store=createPostgresWaitlistStore(async(text,values)=>{calls.push({text,values});return {...inserted,rowCount};});
    assert.equal(await store.save(candidate),undefined);
    assert.equal(calls.length,1);
    assert.match(calls[0].text,/ON CONFLICT DO NOTHING/u);
    assert.doesNotMatch(calls[0].text,/SELECT|UPDATE|CREATE|ALTER/u);
    assert.ok(!calls[0].text.includes(entry.name));
    assert.ok(!calls[0].text.includes(entry.email));
    if(candidate.phone)assert.ok(!calls[0].text.includes(candidate.phone));
    assert.deepEqual(calls[0].values,Object.values(candidate));
  }
  }
});

test('unexpected save results and provider failures cannot become a success',async()=>{
  for(const result of [{...inserted,rowCount:null},{...inserted,rowCount:2},{...inserted,command:'SELECT'}]){
    await assert.rejects(createPostgresWaitlistStore(async()=>result).save(entry),/waitlist-write-failed/u);
  }
  await assert.rejects(createPostgresWaitlistStore(async()=>{throw new Error('provider-error');}).save(entry),/provider-error/u);
});

test('rate limit uses one atomic capped increment after bounded expired-key cleanup',async()=>{
  const calls=[];
  const store=createPostgresWaitlistStore(async(text,values)=>{
    calls.push({text,values});
    return text.startsWith('DELETE')?{command:'DELETE',rowCount:0,rows:[]}:{...inserted,rows:[{count:13}]};
  });
  const count=await store.consumeRateLimit({key:'a'.repeat(64),now:1800000001,expiresAt:1800000600,limit:12});
  assert.equal(count,13);
  assert.equal(calls.length,2);
  assert.match(calls[0].text,/expires_at <= \$1[\s\S]*LIMIT 50/u);
  assert.deepEqual(calls[0].values,[1800000001]);
  assert.match(calls[1].text,/ON CONFLICT \(key\) DO UPDATE[\s\S]*LEAST\(waitlist_rate_limits.count \+ 1, \$3\)[\s\S]*RETURNING count/u);
  assert.deepEqual(calls[1].values,['a'.repeat(64),1800000600,13]);
  assert.doesNotMatch(calls[1].text,/SELECT|CREATE|ALTER/u);
});

test('empty, non-integer, or impossible returned rate counts are rejected',async()=>{
  for(const rows of [[],[{count:'1'}],[{count:0}],[{count:14}],[{count:1},{count:2}]]){
    const store=createPostgresWaitlistStore(async text=>text.startsWith('DELETE')?{command:'DELETE',rowCount:0,rows:[]}:{...inserted,rows});
    await assert.rejects(store.consumeRateLimit({key:'test',now:1,expiresAt:600,limit:12}),/rate-write-failed/u);
  }
});

test('unconfigured Neon storage stays unavailable without any network request',()=>{
  assert.equal(createNeonWaitlistStore(undefined),undefined);
  assert.equal(createNeonWaitlistStore(''),undefined);
});

test('schema setup submits idempotent DDL as one transaction and preserves existing entries',async()=>{
  let transactions=0;
  const sql={query:text=>({text}),transaction:async statements=>{
    transactions++;
    assert.deepEqual(statements.map(item=>item.text),WAITLIST_SCHEMA_STATEMENTS);
  }};
  await setupWaitlistDatabase(sql);
  await setupWaitlistDatabase(sql);
  assert.equal(transactions,2);
  assert.ok(WAITLIST_SCHEMA_STATEMENTS[0].includes('pg_advisory_xact_lock'));
  for(const statement of WAITLIST_SCHEMA_STATEMENTS.slice(1)){
    assert.match(statement,/CREATE (?:UNIQUE )?(?:TABLE|INDEX) IF NOT EXISTS/u);
    assert.doesNotMatch(statement,/DELETE|TRUNCATE|DROP/u);
  }
  assert.ok(WAITLIST_SCHEMA_STATEMENTS.some(sql=>/UNIQUE INDEX.*\(email\)/u.test(sql)));
});

test('schema setup failure propagates and CLI never prints a credential or provider error',async()=>{
  await assert.rejects(setupWaitlistDatabase({query:text=>text,transaction:async()=>{throw new Error('failed');}}),/failed/u);
  const previous=process.env.DATABASE_URL;
  const logs=[];
  const oldError=console.error;
  try{
    console.error=(...parts)=>logs.push(parts.join(' '));
    delete process.env.DATABASE_URL;
    assert.equal(await main(),1);
    process.env.DATABASE_URL='invalid-private-credential';
    assert.equal(await main(),1);
    assert.ok(!logs.join('\n').includes('invalid-private-credential'));
  }finally{
    console.error=oldError;
    if(previous===undefined)delete process.env.DATABASE_URL;else process.env.DATABASE_URL=previous;
  }
});

test('contact migration keeps DDL in one transaction and retains legacy data and indexes',async()=>{
  let transactions=0;
  const sql={query:text=>({text}),transaction:async statements=>{
    transactions++;
    assert.deepEqual(statements.map(item=>item.text),WAITLIST_CONTACT_MIGRATION_STATEMENTS);
  }};
  await migrateWaitlistContact(sql);
  await migrateWaitlistContact(sql);
  assert.equal(transactions,2);
  const ddl=WAITLIST_CONTACT_MIGRATION_STATEMENTS.join('\n');
  assert.equal(WAITLIST_CONTACT_MIGRATION_STATEMENTS[0],WAITLIST_SCHEMA_STATEMENTS[0]);
  assert.match(ddl,/ADD COLUMN IF NOT EXISTS phone text/u);
  assert.match(ddl,/ALTER COLUMN email DROP NOT NULL/u);
  assert.match(ddl,/CHECK \(\(email IS NOT NULL\) <> \(phone IS NOT NULL\)\)/u);
  assert.match(ddl,/char_length\(name\) BETWEEN 1 AND 100/u);
  assert.match(ddl,/CREATE UNIQUE INDEX IF NOT EXISTS waitlist_phone_unique/u);
  assert.doesNotMatch(ddl,/DELETE|TRUNCATE|DROP TABLE|DROP COLUMN|DROP INDEX|UPDATE waitlist_entries/u);
});

test('contact migration errors propagate and its CLI cannot reveal provider details',async()=>{
  await assert.rejects(migrateWaitlistContact({query:text=>text,transaction:async()=>{throw new Error('failed');}}),/failed/u);
  const previous=process.env.DATABASE_URL;
  const logs=[];
  const oldError=console.error;
  try{
    console.error=(...parts)=>logs.push(parts.join(' '));
    delete process.env.DATABASE_URL;
    assert.equal(await migrateMain(),1);
    process.env.DATABASE_URL='invalid-private-credential';
    assert.equal(await migrateMain(),1);
    assert.ok(!logs.join('\n').includes('invalid-private-credential'));
  }finally{
    console.error=oldError;
    if(previous===undefined)delete process.env.DATABASE_URL;else process.env.DATABASE_URL=previous;
  }
});
