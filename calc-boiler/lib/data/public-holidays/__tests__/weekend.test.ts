import assert from "node:assert/strict";
import { test } from "node:test";

import { STATE_PUBLIC_HOLIDAYS, getStatePublicHolidays, stateFaqs, stateOwnDays } from "../index";
import { WEEKEND_EVENTS, WEEKEND_RATES, WEEKEND_RATES_MATCH_HOSPITALITY, ordinaryWeekendDays, weekendHolidayRows } from "../weekend";
import { weekdayOf } from "../dates";

const st = (slug: string) => getStatePublicHolidays(slug)!;
const row = (slug: string, date: string) => weekendHolidayRows(st(slug)).find((r) => r.date === date)!;

test("the five weekend events really fall on a weekend", () => {
  assert.equal(WEEKEND_EVENTS.length, 5);
  for (const e of WEEKEND_EVENTS) assert.ok(["Saturday", "Sunday"].includes(weekdayOf(e.date)), e.date);
});

test("Retail and Hospitality weekend and public holiday rates are the same, so one column serves both", () => {
  assert.ok(WEEKEND_RATES_MATCH_HOSPITALITY);
  assert.equal(WEEKEND_RATES.Saturday.permanent, 1.25);
  assert.equal(WEEKEND_RATES.Sunday.casual, 1.75);
  assert.equal(WEEKEND_RATES.publicHoliday.permanent, 2.25);
});

test("every row agrees with the state's own verified holiday list", () => {
  for (const s of STATE_PUBLIC_HOLIDAYS) {
    const days = s.years.flatMap((y) => y.holidays.filter((h) => h.kind === "statewide" || h.kind === "additional"));
    for (const r of weekendHolidayRows(s)) {
      if (!r.weekendIsHoliday) assert.ok(!days.some((h) => h.date === r.date), `${s.code} ${r.date} listed but marked ordinary`);
      if (r.extra) assert.ok(days.includes(r.extra), `${s.code} extra ${r.extra.date}`);
      const expect = r.weekendIsHoliday ? WEEKEND_RATES.publicHoliday : WEEKEND_RATES[r.weekday];
      assert.equal(r.permanent, expect.permanent);
      assert.equal(r.casual, expect.casual);
    }
  }
});

test("state differences the official pages state", () => {
  // Tasmania: Boxing Day on a Saturday moves to the Monday; the Saturday is not a holiday.
  assert.equal(row("tas", "2026-12-26").weekendIsHoliday, false);
  assert.equal(row("tas", "2026-12-26").permanent, 1.25);
  assert.equal(row("tas", "2026-12-26").extra?.date, "2026-12-28");
  // Tasmania 2027: the rule text makes Saturday 25 December a holiday too.
  assert.equal(row("tas", "2027-12-25").weekendIsHoliday, true);
  assert.ok(row("tas", "2027-12-25").note);
  // Queensland and the NT move a Sunday Anzac Day to the Monday.
  for (const slug of ["qld", "nt"]) {
    assert.equal(row(slug, "2027-04-25").weekendIsHoliday, false, slug);
    assert.equal(row(slug, "2027-04-25").permanent, 1.5, slug);
    assert.equal(row(slug, "2027-04-25").extra?.date, "2027-04-26", slug);
  }
  // Victoria and SA keep Anzac Day on the weekend with no weekday added.
  for (const slug of ["vic", "sa"]) {
    assert.equal(row(slug, "2026-04-25").weekendIsHoliday, true, slug);
    assert.equal(row(slug, "2026-04-25").extra, undefined, slug);
  }
  // NSW, WA and the ACT keep the weekend day and add a Monday.
  for (const slug of ["nsw", "wa", "act"]) {
    assert.equal(row(slug, "2026-04-25").weekendIsHoliday, true, slug);
    assert.equal(row(slug, "2026-04-25").extra?.date, "2026-04-27", slug);
  }
  // SA names its 26 December holiday Proclamation Day.
  assert.match(row("sa", "2026-12-26").name, /Proclamation Day/);
  assert.deepEqual(ordinaryWeekendDays(st("nsw")), []);
  assert.equal(ordinaryWeekendDays(st("tas")).length, 2);
});

test("state-own days are each state's own and FAQs stay unique", () => {
  for (const s of STATE_PUBLIC_HOLIDAYS) {
    const own = stateOwnDays(s, 2026).map((h) => h.name);
    assert.ok(!own.includes("Good Friday"), s.code);
    assert.ok(!own.includes("Christmas Day"), s.code);
    const faqs = stateFaqs(s);
    assert.equal(new Set(faqs.map((f) => f.q)).size, faqs.length, s.code);
  }
  assert.ok(stateOwnDays(st("act"), 2026).some((h) => h.name === "Canberra Day"));
  assert.ok(stateOwnDays(st("nt"), 2026).some((h) => h.name === "Picnic Day"));
  assert.ok(stateOwnDays(st("vic"), 2026).some((h) => h.name === "Melbourne Cup"));
});
