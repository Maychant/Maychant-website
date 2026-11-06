import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../integrations/google-sheets/Code.gs', import.meta.url), 'utf8');
const headers = ['Signup ID', 'Joined at (UTC)', 'Name', 'Interest', 'Email', 'Phone', 'Notes'];
const entry = (n, extra = {}) => ({ id: `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`,
  joinedAt: '2026-11-06T12:00:00.000Z', name: 'Test name', interest: 'buyer', email: 'test@example.invalid', phone: '', ...extra });
const page = (entries = [], nextCursor = null) => ({ code: 200, body: { ok: true, entries, nextCursor } });

function harness(options = {}) {
  const state = { rows: [headers.slice(), ...(options.rows || []).map(row => row.slice())],
    responses: [...(options.responses || [page()])], requests: [], formats: [], writes: 0, notes: [], logs: [],
    maxRows: options.maxRows || 1000, growth: 0, releases: 0, opens: 0, triggers: [],
    failFlush: options.failFlush || 0, failWrite: options.failWrite || 0 };
  const sheet = {
    getLastRow: () => state.rows.length,
    getMaxRows: () => state.maxRows,
    insertRowsAfter: (at, count) => { assert.equal(at, state.maxRows); state.maxRows += count; state.growth += count; },
    getRange: (row, column, count, width) => {
      if (row === 'A1') return { setNote: note => state.notes.push(note) };
      const values = () => Array.from({ length: count }, (_, i) =>
        Array.from({ length: width }, (_, j) => state.rows[row + i - 1]?.[column + j - 1] ?? ''));
      return {
        getValues: values,
        getDisplayValues: () => values().map(cells => cells.map(value => String(value))),
        setNumberFormat: format => state.formats.push({ row, column, count, width, format }),
        setValues: rows => {
          if (state.failWrite > 0) { state.failWrite--; throw Error('Temporary spreadsheet write failure'); }
          assert.equal(rows.length, count);
          rows.forEach((cells, i) => {
            assert.equal(cells.length, width);
            const target = state.rows[row + i - 1] ||= Array(7).fill('');
            cells.forEach((value, j) => { target[column + j - 1] = value; });
          });
          state.writes++;
        },
      };
    },
  };
  const properties = { MAYCHANT_SHEET_ID: 'private-test-sheet', MAYCHANT_SYNC_TOKEN: 'test-token-that-must-not-be-logged', ...options.properties };
  const context = vm.createContext({
    console: { log: (...parts) => state.logs.push(parts.join(' ')) },
    LockService: { getScriptLock: () => ({ tryLock: () => options.locked !== true, releaseLock: () => state.releases++ }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: key => properties[key] }) },
    SpreadsheetApp: {
      getActiveSpreadsheet: () => { state.opens++; return options.unbound ? null : {
        getId: () => options.parentSheetId || properties.MAYCHANT_SHEET_ID,
        getSheetByName: name => { assert.equal(name, 'Waitlist'); return options.missingTab ? null : sheet; },
        setSpreadsheetTimeZone: zone => assert.equal(zone, 'Etc/UTC'),
      }; },
      flush: () => { if (state.failFlush > 0) { state.failFlush--; throw Error('Temporary flush acknowledgement failure'); } },
    },
    UrlFetchApp: { fetch: (url, options) => {
      state.requests.push({ url, options });
      const response = state.responses.shift();
      assert.ok(response, 'Unexpected HTTP request');
      return { getResponseCode: () => response.code, getContentText: () => JSON.stringify(response.body) };
    } },
    ScriptApp: {
      getProjectTriggers: () => state.triggers.map(handler => ({ getHandlerFunction: () => handler })),
      newTrigger: handler => ({ timeBased: () => ({ everyMinutes: interval => {
        assert.equal(interval, 5);
        return { create: () => state.triggers.push(handler) };
      } }) }),
    },
  });
  vm.runInContext(source, context);
  return { state, sync: () => vm.runInContext('syncWaitlist()', context), setup: () => vm.runInContext('setupWaitlistSync()', context) };
}

test('paged full passes append each ID once and retain existing values and notes', () => {
  const existing = entry(1), a = entry(2), b = entry(3);
  const pages = [page([existing, a, a], a.id), page([a, b])];
  const h = harness({ maxRows: 2, rows: [[existing.id, 'Original date', 'Original name', 'seller', 'original@example.invalid', '', 'Keep this note']], responses: [...pages, ...pages] });
  h.sync(); h.sync();
  assert.equal(h.state.rows.length, 4);
  assert.deepEqual(h.state.rows[1].slice(2), ['Original name', 'seller', 'original@example.invalid', '', 'Keep this note']);
  assert.deepEqual(h.state.rows.slice(1).map(row => row[0]), [existing.id, a.id, b.id]);
  assert.equal(h.state.writes, 2);
  assert.equal(h.state.growth, 2);
  assert.equal(h.state.requests[0].url, h.state.requests[2].url);
  assert.match(h.state.requests[1].url, new RegExp('after=' + a.id));
  for (const request of h.state.requests) {
    assert.match(request.options.headers.Authorization, /^Bearer /u);
    assert.equal(request.options.followRedirects, false);
    assert.ok(!request.url.includes('test-token'));
  }
  assert.equal(h.state.releases, 2);
  assert.ok(h.state.logs.every(line => !line.includes('test-token') && !line.includes('example.invalid')));
});

test('a failed later page retries from the start without losing or duplicating saved rows', () => {
  const a = entry(1), b = entry(2);
  const h = harness({ responses: [page([a], a.id), { code: 503 }, page([a], a.id), page([b])] });
  assert.throws(h.sync, /temporarily unavailable/u);
  assert.equal(h.state.rows.length, 2);
  assert.equal(h.state.notes.length, 0);
  h.sync();
  assert.deepEqual(h.state.rows.slice(1).map(row => row[0]), [a.id, b.id]);
  assert.equal(h.state.notes.length, 1);
  assert.equal(h.state.releases, 2);
});

test('an uncertain flush result is recovered by rereading committed IDs', () => {
  const a = entry(1);
  const h = harness({ responses: [page([a]), page([a])], failFlush: 1 });
  assert.throws(h.sync, /flush acknowledgement/u);
  assert.equal(h.state.rows.length, 2);
  h.sync();
  assert.equal(h.state.rows.length, 2);
  assert.equal(h.state.writes, 1);
  assert.equal(h.state.notes.length, 1);
});

test('a failed write is retried rather than remembering unsaved IDs', () => {
  const a = entry(1);
  const h = harness({ responses: [page([a]), page([a])], failWrite: 1 });
  assert.throws(h.sync, /spreadsheet write failure/u);
  assert.equal(h.state.rows.length, 1);
  h.sync();
  assert.equal(h.state.rows.length, 2);
  assert.equal(h.state.rows[1][0], a.id);
});

test('formula prefixes are escaped, phones remain text, and only six columns are written', () => {
  const entries = ['=IMPORTXML("https://invalid")', '+SUM(1,2)', '-1+1', '@name'].map((name, i) => entry(i, { name, phone: '+12025550123', email: '' }));
  const h = harness({ responses: [page(entries)] });
  h.sync();
  entries.forEach((value, i) => {
    assert.equal(h.state.rows[i + 1][2], "'" + value.name);
    assert.equal(h.state.rows[i + 1][5], "'" + value.phone);
    assert.equal(h.state.rows[i + 1][6], '');
  });
  assert.ok(h.state.formats.some(range => range.column === 3 && range.width === 4 && range.format === '@'));
});

test('overlap, missing configuration and changed headers fail before exporting contacts', () => {
  const busy = harness({ locked: true }); busy.sync();
  assert.equal(busy.state.opens, 0); assert.equal(busy.state.requests.length, 0); assert.equal(busy.state.releases, 0);
  const missing = harness({ properties: { MAYCHANT_SYNC_TOKEN: '' } });
  assert.throws(missing.sync, /Script Properties/u);
  assert.equal(missing.state.requests.length, 0); assert.equal(missing.state.releases, 1);
  const changed = harness(); changed.state.rows[0][0] = 'Changed header';
  assert.throws(changed.sync, /column headings/u);
  assert.equal(changed.state.requests.length, 0); assert.equal(changed.state.writes, 0);
});

test('an unbound script or the wrong parent spreadsheet cannot receive contacts', () => {
  for (const options of [{ unbound: true }, { parentSheetId: 'unrelated-private-sheet' }]) {
    const h = harness(options);
    assert.throws(h.sync, error => error.name === 'Error' && /bound|spreadsheet|sheet/iu.test(error.message));
    assert.equal(h.state.requests.length, 0);
    assert.equal(h.state.writes, 0);
    assert.equal(h.state.notes.length, 0);
    assert.equal(h.state.releases, 1);
  }
});

test('setup installs exactly one retry trigger even when the first fetch fails', () => {
  const h = harness({ responses: [{ code: 503 }, page()] });
  assert.throws(h.setup, /temporarily unavailable/u);
  assert.deepEqual(h.state.triggers, ['syncWaitlist']);
  h.setup();
  assert.deepEqual(h.state.triggers, ['syncWaitlist']);
});
