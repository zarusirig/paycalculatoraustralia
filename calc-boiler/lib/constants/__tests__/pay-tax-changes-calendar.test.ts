import { test } from "node:test";
import assert from "node:assert/strict";
import { CHANGE_DATES, calendarEvents, changesCitation, icsCalendar } from "../pay-tax-changes-calendar";
import { JUNIOR_TRANSITION_SCHEDULES } from "../junior-rates";

test("dates are in order and unique", () => {
  const isos = CHANGE_DATES.map((c) => c.iso);
  assert.deepEqual([...isos].sort(), isos);
  assert.equal(new Set(isos).size, isos.length);
});

test("1 December 2026 is the junior phase-in, never an adult-rate jump", () => {
  const dec = CHANGE_DATES.find((c) => c.iso === "2026-12-01")!;
  const text = dec.items.map((i) => i.text).join(" ");
  assert.match(text, /phase-in/);
  assert.match(text, /18 year olds go from 70% to 75%/);
  assert.match(text, /fast food 20 year olds from 90% to 95%/);
  assert.equal(JUNIOR_TRANSITION_SCHEDULES.fastFood.rows[0].effective, "1 December 2026");
  assert.doesNotMatch(text, /adult rate on 1 December/i);
});

test("1 July 2026 reflects current constants", () => {
  const jul = CHANGE_DATES.find((c) => c.iso === "2026-07-01")!;
  const text = jul.items.map((i) => i.text).join(" ");
  assert.match(text, /from 16% to 15%/);
  assert.match(text, /\$26\.44 an hour, \$1,004\.90/);
});

test("1 January 2027 makes no rate-change claim", () => {
  const jan = CHANGE_DATES.find((c) => c.iso === "2027-01-01")!;
  assert.equal(jan.status, "none-verified");
});

test("1 July 2027 carries the legislated 14% cut", () => {
  const jul = CHANGE_DATES.find((c) => c.iso === "2027-07-01")!;
  assert.match(jul.items[0].text, /from 15% to 14%/);
});

test("ics is valid RFC 5545 shaped, CRLF, folded, deterministic", () => {
  const ics = icsCalendar();
  assert.ok(ics.startsWith("BEGIN:VCALENDAR\r\n"));
  assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
  const begins = ics.match(/BEGIN:VEVENT/g)!.length;
  assert.equal(begins, ics.match(/END:VEVENT/g)!.length);
  assert.equal(begins, calendarEvents().length);
  for (const line of ics.split("\r\n")) assert.ok(Buffer.byteLength(line) <= 75, line);
  assert.ok(ics.includes("DTSTART;VALUE=DATE:20261201"));
  assert.ok(ics.includes("DTEND;VALUE=DATE:20261202"));
  assert.ok(!ics.includes("DTSTART;VALUE=DATE:20270101"));
  assert.equal(icsCalendar(), ics);
});

test("calendar events are future-dated and include lodgment dates", () => {
  const ev = calendarEvents();
  assert.ok(ev.every((e) => e.iso >= "2026-10-05"));
  assert.ok(ev.some((e) => e.iso === "2026-10-31" || e.iso === "2026-11-02"));
});

test("citation names the page", () => {
  assert.match(changesCitation(), /pay-and-tax-changes-calendar/);
});
