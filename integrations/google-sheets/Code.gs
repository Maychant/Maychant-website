/**
 * @OnlyCurrentDoc
 *
 * Maychant's private waitlist mirror. No web app or public Sheet is required.
 * Set MAYCHANT_SHEET_ID and MAYCHANT_SYNC_TOKEN in Script Properties, then run
 * setupWaitlistSync once. The token must never be pasted into a spreadsheet cell.
 */
const MAYCHANT_HEADERS = ['Signup ID', 'Joined at (UTC)', 'Name', 'Interest', 'Email', 'Phone', 'Notes'];

function setupWaitlistSync() {
  const properties = PropertiesService.getScriptProperties();
  if (!properties.getProperty('MAYCHANT_SHEET_ID') || !properties.getProperty('MAYCHANT_SYNC_TOKEN')) {
    throw new Error('Add the Maychant sheet ID and sync token in Script Properties.');
  }
  const alreadyInstalled = ScriptApp.getProjectTriggers().some(function (trigger) {
    return trigger.getHandlerFunction() === 'syncWaitlist';
  });
  if (!alreadyInstalled) ScriptApp.newTrigger('syncWaitlist').timeBased().everyMinutes(5).create();
  // Install before the first fetch so an initial outage still gets a retry.
  syncWaitlist();
  console.log('Maychant waitlist sync is ready. It checks for new signups every five minutes.');
}

function syncWaitlist() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return;
  try {
    const properties = PropertiesService.getScriptProperties();
    const sheetId = properties.getProperty('MAYCHANT_SHEET_ID');
    const token = properties.getProperty('MAYCHANT_SYNC_TOKEN');
    if (!sheetId || !token) throw new Error('Add the Maychant sheet ID and sync token in Script Properties.');
    const book = SpreadsheetApp.getActiveSpreadsheet();
    if (!book || book.getId() !== sheetId) throw new Error('Open this script from the configured Maychant Waitlist spreadsheet.');
    const sheet = book.getSheetByName('Waitlist');
    if (!sheet || JSON.stringify(sheet.getRange(1, 1, 1, 7).getValues()[0]) !== JSON.stringify(MAYCHANT_HEADERS)) {
      throw new Error('The Waitlist tab or its column headings changed. Restore the original headings before syncing.');
    }
    book.setSpreadsheetTimeZone('Etc/UTC');
    const lastRow = sheet.getLastRow();
    const seen = new Set(lastRow > 1 ? sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues().map(function (row) { return row[0]; }) : []);
    let cursor = null;
    let added = 0;
    let page = 0;
    do {
      // Full passes plus stable-ID deduplication also recover after a missed run.
      // A signup committed during pagination is picked up on the next full pass.
      const url = 'https://maychant.com/api/waitlist/sync' + (cursor ? '?after=' + encodeURIComponent(cursor) : '');
      const response = UrlFetchApp.fetch(url, {
        method: 'get', headers: { Authorization: 'Bearer ' + token },
        muteHttpExceptions: true, followRedirects: false,
      });
      if (response.getResponseCode() !== 200) throw new Error('Maychant sync is temporarily unavailable. The next scheduled run will retry.');
      const payload = JSON.parse(response.getContentText());
      if (!payload.ok || !Array.isArray(payload.entries)) throw new Error('Unexpected sync response. No further rows were added.');
      const rows = [];
      payload.entries.forEach(function (entry) {
        if (seen.has(entry.id)) return;
        const joined = new Date(entry.joinedAt);
        if (!entry.id || Number.isNaN(joined.getTime())) throw new Error('Invalid signup in the sync response.');
        rows.push([safeText_(entry.id), joined, safeText_(entry.name), safeText_(entry.interest), safeText_(entry.email), safeText_(entry.phone)]);
        seen.add(entry.id);
      });
      if (rows.length) {
        const start = sheet.getLastRow() + 1;
        const requiredRows = start + rows.length - 1;
        if (requiredRows > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), requiredRows - sheet.getMaxRows());
        sheet.getRange(start, 1, rows.length, 1).setNumberFormat('@');
        sheet.getRange(start, 3, rows.length, 4).setNumberFormat('@');
        sheet.getRange(start, 2, rows.length, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
        sheet.getRange(start, 1, rows.length, 6).setValues(rows);
        // Notes are user-owned. Never clear, reorder, or overwrite that column.
        SpreadsheetApp.flush();
        added += rows.length;
      }
      cursor = payload.nextCursor;
      page += 1;
      if (cursor && page >= 20) throw new Error('The waitlist now exceeds this sync batch limit. Review the integration capacity before continuing.');
    } while (cursor);
    sheet.getRange('A1').setNote('Private Maychant waitlist mirror. Last successful check: ' + new Date().toISOString() + '. New rows added: ' + added + '. Notes in column G are yours to edit.');
    console.log('Waitlist sync completed. New rows: ' + added + '.');
  } finally {
    lock.releaseLock();
  }
}

// User-supplied content must stay text, never a spreadsheet formula.
function safeText_(value) {
  const text = String(value || '');
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
