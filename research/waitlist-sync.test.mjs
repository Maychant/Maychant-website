import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { handleWaitlistSync, WAITLIST_SYNC_PAGE_SIZE } from '../lib/waitlist-sync.ts';

const token='a'.repeat(43);
const hash=createHash('sha256').update(token).digest('hex');
const request=(suffix='',authorization=`Bearer ${token}`)=>new Request('https://maychant.com/api/waitlist/sync'+suffix,{headers:{authorization}});
const never=()=>assert.fail('Unauthorized or malformed requests must not read contacts');
test('missing, wrong, malformed and unconfigured credentials never read the database',async()=>{
  for(const authorization of ['',`Bearer ${'b'.repeat(43)}`,'Basic abc',`Bearer ${'a'.repeat(200)}`])assert.equal((await handleWaitlistSync(request('',authorization),never,hash)).status,401);
  for(const stored of [undefined,'', 'not-a-hash'])assert.equal((await handleWaitlistSync(request(),never,stored)).status,401);
  assert.equal((await handleWaitlistSync(request('?token='+token,''),never,hash)).status,401);
});
test('cursor validation happens before SQL and parameters stay separate',async()=>{
  assert.equal((await handleWaitlistSync(request('?after=bad'),never,hash)).status,400);
  const after='00000000-0000-4000-8000-000000000001';let parameters;
  const response=await handleWaitlistSync(request('?after='+after),async(text,values)=>{assert(!text.includes(after));parameters=values;return [];},hash);
  assert.equal(response.status,200);assert.deepEqual(parameters,[after,WAITLIST_SYNC_PAGE_SIZE+1]);
});
test('feed provides only the sheet fields with bounded pagination and no cache',async()=>{
  const rows=Array.from({length:501},(_,i)=>({id:`00000000-0000-4000-8000-${String(i).padStart(12,'0')}`,created_at:'1800000001',name:'Example',role:'buyer',email:i%2?'test@example.invalid':null,phone:i%2?null:'+12025550123',consent_version:'private',location:'private'}));
  const response=await handleWaitlistSync(request(),async()=>rows,hash);
  const data=await response.json();assert.equal(data.entries.length,500);assert.equal(data.nextCursor,rows[499].id);
  assert.deepEqual(Object.keys(data.entries[0]),['id','joinedAt','name','interest','email','phone']);
  assert.equal(data.entries[0].joinedAt,new Date(1800000001000).toISOString());assert.equal(data.entries[0].email,'');
  assert.match(response.headers.get('cache-control'),/no-store/);assert.equal(response.headers.get('access-control-allow-origin'),null);
});
test('last page ends the scan, and outages reveal no contacts or provider details',async()=>{
  const response=await handleWaitlistSync(request(),async()=>[],hash);assert.deepEqual(await response.json(),{ok:true,entries:[],nextCursor:null});
  for(const query of [undefined,async()=>{throw Error('secret contact test@example.invalid');}]){
    const result=await handleWaitlistSync(request(),query,hash);assert.equal(result.status,503);assert(!(await result.text()).includes('test@example.invalid'));
  }
});
