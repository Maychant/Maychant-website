import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

assert.equal(process.env.WAITLIST_DB_TEST, '1', 'Set WAITLIST_DB_TEST=1 for synthetic signup verification.');
assert.ok(process.env.MAYCHANT_CHECK_URL, 'Set MAYCHANT_CHECK_URL to the deployment being checked.');
const origin = new URL(process.env.MAYCHANT_CHECK_URL).origin;
const sql = neon(process.env.DATABASE_URL);
const email = `maychant-deployment-check-${randomUUID()}@example.invalid`;
const payload = { name: 'Synthetic Deployment Check', email, role: 'both', location: 'Synthetic test', consent: true, website: '' };
const post = body => fetch(`${origin}/api/waitlist`, {
  method: 'POST', headers: { 'content-type': 'application/json', origin }, body: JSON.stringify(body),
});
try {
  const response = await post(payload);
  assert.equal(response.status, 200, `Live API status ${response.status}`);
  assert.equal((await response.json()).ok, true);
  const rows = await sql.query('SELECT role, consent_version FROM waitlist_entries WHERE email=$1', [email]);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].role, 'both');
  assert.equal(rows[0].consent_version, 'maychant-waitlist-v1');
  const duplicate = await post({ ...payload, role: 'buyer' });
  assert.equal(duplicate.status, 200);
  const preserved = await sql.query('SELECT role FROM waitlist_entries WHERE email=$1', [email]);
  assert.equal(preserved.length, 1);
  assert.equal(preserved[0].role, 'both');
  const invalid = await post({ ...payload, consent: false });
  assert.equal(invalid.status, 400);
  console.log('Live API passed: signup persisted, consent recorded, duplicate preserved, invalid consent rejected.');
} finally {
  await sql.query('DELETE FROM waitlist_entries WHERE email=$1', [email]);
  console.log('Removed this run’s unique synthetic signup. No email was sent.');
}
