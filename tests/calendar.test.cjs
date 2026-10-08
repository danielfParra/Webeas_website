const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = html.match(/<script\b[^>]*data-dc-script[^>]*>([\s\S]*?)<\/script>/)[1];
const context = vm.createContext({ TextEncoder, window: { innerWidth: 1200 }, DCLogic: class {} });
vm.runInContext(script, context);
const seminar = { iso: '2026-10-26', speaker: '', title: '' };
const unfold = text => text.replace(/\r\n[ \t]/g, '');

test('calendar includes timezone rules and a complete event', () => {
  const calendar = context.buildICS(seminar);
  assert(calendar.endsWith('END:VCALENDAR\r\n'));
  assert.match(calendar, /BEGIN:VTIMEZONE\r\nTZID:America\/New_York/);
  assert.match(calendar, /RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU/);
  assert.match(calendar, /RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU/);
  assert.match(calendar, /DTSTART;TZID=America\/New_York:20261026T120000/);
  assert.match(calendar, /DTEND;TZID=America\/New_York:20261026T130000/);
  assert.match(calendar, /SUMMARY:WEBEAS seminar\r\n/);
  const stamp = calendar.match(/DTSTAMP:(\d{8}T\d{6}Z)/)[1];
  const current = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  assert.equal(stamp.slice(0, 13), current.slice(0, 13));
});

test('long Unicode text folds at 75 bytes without damaging characters', () => {
  const speaker = 'María 😀 '.repeat(40);
  const calendar = context.buildICS({ ...seminar, speaker });
  for (const line of calendar.split('\r\n')) {
    assert(Buffer.byteLength(line, 'utf8') <= 75);
  }
  assert(!calendar.includes('\uFFFD'));
  assert(unfold(calendar).includes('SUMMARY:WEBEAS — ' + speaker + '\r\n'));
});

test('calendar text escapes punctuation, backslashes, and newlines', () => {
  const calendar = unfold(context.buildICS({
    ...seminar, speaker: 'Name, Jr.; Team\\Lab', title: 'First\r\nSecond\nThird\rFourth',
  }));
  assert(calendar.includes('SUMMARY:WEBEAS — Name\\, Jr.\\; Team\\\\Lab\r\n'));
  assert(calendar.includes('DESCRIPTION:First\\nSecond\\nThird\\nFourth'));
  assert.equal(calendar.match(/BEGIN:VEVENT/g).length, 1);
});
