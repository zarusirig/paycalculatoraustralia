import assert from "node:assert/strict";
import { test } from "node:test";

import {
  PH_STATE_SLUGS,
  PUBLIC_HOLIDAY_AWARD_RATES,
  STATE_PUBLIC_HOLIDAYS,
  getAwardPublicHolidayRate,
  getStatePublicHolidays,
  publicHolidayPay,
  publicHolidayRateRange,
  pctLabel,
  stateFaqs,
  statewideDays,
  yearOf,
} from "../index";
import { formatHolidayDate, isValidIsoDate, parseSourceDate, sourceMismatch, weekdayOf } from "../dates";
import { STATE_PROFILES } from "../../state-employee";
import { MODERN_AWARDS } from "../../../constants/modern-awards";

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

test("weekdayOf is anchored to known calendar facts", () => {
  assert.equal(weekdayOf("2026-01-01"), "Thursday");
  assert.equal(weekdayOf("2026-04-03"), "Friday"); // Good Friday 2026
  assert.equal(weekdayOf("2026-12-26"), "Saturday");
  assert.equal(weekdayOf("2027-03-26"), "Friday"); // Good Friday 2027
  assert.equal(weekdayOf("2027-12-25"), "Saturday");
  assert.equal(weekdayOf("2028-02-29"), "Tuesday");
  assert.equal(formatHolidayDate("2026-04-27"), "Monday 27 April 2026");
});

test("parseSourceDate reads every format the official pages use", () => {
  assert.deepEqual(parseSourceDate("Monday 27 April"), [{ weekday: "Monday", day: 27, month: 4, year: undefined }]);
  assert.deepEqual(parseSourceDate("Friday 1 January 2027"), [{ weekday: "Friday", day: 1, month: 1, year: 2027 }]);
  assert.deepEqual(parseSourceDate("Saturday 25 and Monday 27 April"), [
    { weekday: "Saturday", day: 25, month: 4, year: undefined },
    { weekday: "Monday", day: 27, month: 4, year: undefined },
  ]);
  assert.deepEqual(parseSourceDate("Saturday 26 December and Monday 28 December"), [
    { weekday: "Saturday", day: 26, month: 12, year: undefined },
    { weekday: "Monday", day: 28, month: 12, year: undefined },
  ]);
  assert.deepEqual(parseSourceDate("28 December"), [{ weekday: undefined, day: 28, month: 12, year: undefined }]);
  assert.deepEqual(parseSourceDate("27 March 2026"), [{ weekday: undefined, day: 27, month: 3, year: 2026 }]);
  assert.throws(() => parseSourceDate("Monday 27"));
  assert.throws(() => parseSourceDate("sometime in April"));
});

test("sourceMismatch catches a wrong weekday, day, month or year", () => {
  assert.equal(sourceMismatch("2026-04-27", "Monday 27 April"), null);
  assert.equal(sourceMismatch("2026-04-27", "Saturday 25 and Monday 27 April"), null);
  assert.equal(sourceMismatch("2026-12-28", "Saturday 26 December and Monday 28 December"), null);
  assert.match(sourceMismatch("2026-04-27", "Tuesday 27 April") ?? "", /Tuesday/);
  assert.match(sourceMismatch("2026-04-27", "Monday 28 April") ?? "", /not in/);
  assert.match(sourceMismatch("2026-04-27", "Monday 27 May") ?? "", /not in/);
  assert.match(sourceMismatch("2026-04-27", "Monday 27 April 2027") ?? "", /year/);
});

// ---------------------------------------------------------------------------
// Every date against its source
// ---------------------------------------------------------------------------

test("every built state is a known slug, once, with 2026 and 2027", () => {
  const slugs = STATE_PUBLIC_HOLIDAYS.map((s) => s.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const s of STATE_PUBLIC_HOLIDAYS) {
    assert.ok((PH_STATE_SLUGS as readonly string[]).includes(s.slug));
    assert.deepEqual(
      s.years.map((y) => y.year),
      [2026, 2027],
      `${s.code} years`,
    );
    assert.ok(s.sources.length > 0 && s.sources.every((x) => x.url.startsWith("https://")), `${s.code} sources`);
  }
});

test("every holiday date agrees with the official source string (day, month, year, weekday)", () => {
  let checked = 0;
  for (const s of STATE_PUBLIC_HOLIDAYS) {
    for (const y of s.years) {
      let prev = "";
      for (const h of y.holidays) {
        assert.ok(isValidIsoDate(h.date), `${s.code} ${h.name}: ${h.date} is not a real date`);
        assert.equal(Number(h.date.slice(0, 4)), y.year, `${s.code} ${h.name} ${h.date} filed under ${y.year}`);
        assert.equal(sourceMismatch(h.date, h.source), null, `${s.code} ${y.year} ${h.name}`);
        assert.ok(h.date >= prev, `${s.code} ${y.year}: ${h.name} out of date order`);
        prev = h.date;
        if (h.kind === "part-day") assert.ok(h.hours, `${s.code} ${h.name} part-day needs hours`);
        if (h.kind === "regional" || h.kind === "limited") assert.ok(h.note, `${s.code} ${h.name} needs an area note`);
        checked++;
      }
      for (const o of y.omitted ?? []) assert.ok(o.reason.length > 20, `${s.code} ${o.name} omission needs a reason`);
    }
    for (const t of s.regional) {
      assert.ok(t.sourceUrl.startsWith("https://"), `${s.code} ${t.id} source`);
      for (const r of t.rows) {
        assert.ok(r.dates.length > 0, `${s.code} ${r.name} has no date`);
        for (const d of r.dates) {
          assert.ok(isValidIsoDate(d.date), `${s.code} ${r.name} ${d.date}`);
          assert.equal(sourceMismatch(d.date, d.source), null, `${s.code} regional ${r.name}`);
          checked++;
        }
      }
    }
  }
  assert.ok(checked > 0);
});

test("Easter and the fixed-date holidays agree across every state", () => {
  const fixed: Record<string, string[]> = {
    "Good Friday": ["2026-04-03", "2027-03-26"],
    "Easter Monday": ["2026-04-06", "2027-03-29"],
    "New Year's Day": ["2026-01-01", "2027-01-01"],
  };
  for (const s of STATE_PUBLIC_HOLIDAYS) {
    for (const [name, dates] of Object.entries(fixed)) {
      const found = s.years.flatMap((y) => y.holidays.filter((h) => h.name === name).map((h) => h.date));
      assert.deepEqual(found, dates, `${s.code} ${name}`);
    }
    // Australia Day: 26 Jan 2026 is a Monday, 26 Jan 2027 a Tuesday — no substitute either year.
    const aus = s.years.flatMap((y) => y.holidays.filter((h) => h.name === "Australia Day").map((h) => h.date));
    assert.deepEqual(aus, ["2026-01-26", "2027-01-26"], `${s.code} Australia Day`);
  }
});

test("every 2026 date in the Fair Work Ombudsman list on the state pay pages is on the state government list too", () => {
  for (const s of STATE_PUBLIC_HOLIDAYS) {
    const profile = STATE_PROFILES[s.code];
    assert.ok(profile, `${s.code} profile`);
    const ours = new Set([
      ...(yearOf(s, 2026)?.holidays ?? []).map((h) => formatHolidayDate(h.date, false)),
      ...s.regional.flatMap((t) => t.rows.flatMap((r) => r.dates.filter((d) => d.date.startsWith("2026")).map((d) => formatHolidayDate(d.date, false)))),
    ]);
    for (const fwo of profile.publicHolidays2026) {
      assert.ok(ours.has(fwo.date), `${s.code}: FWO lists ${fwo.name} on ${fwo.date}, the state list does not`);
    }
  }
});

test("state FAQs are unique and non-empty (one array feeds the page and the JSON-LD)", () => {
  for (const s of STATE_PUBLIC_HOLIDAYS) {
    const faqs = stateFaqs(s);
    assert.ok(faqs.length >= 4, `${s.code} faqs`);
    assert.equal(new Set(faqs.map((f) => f.q)).size, faqs.length, `${s.code} duplicate FAQ`);
    for (const f of faqs) assert.ok(f.a.length > 40, `${s.code}: ${f.q}`);
    assert.ok(statewideDays(yearOf(s, 2026)!).length >= 9, `${s.code} whole-day count`); // Tasmania: 9
  }
});

test("holiday counts quoted in each standfirst match the data", () => {
  for (const s of STATE_PUBLIC_HOLIDAYS) {
    const m = /(\d+) (?:state-wide |whole-day )?public holidays in 2026(?: and (\d+) in 2027)?/.exec(s.standfirst);
    if (!m) continue;
    assert.equal(Number(m[1]), statewideDays(yearOf(s, 2026)!).length, `${s.code} 2026 count in standfirst`);
    if (m[2]) assert.equal(Number(m[2]), statewideDays(yearOf(s, 2027)!).length, `${s.code} 2027 count in standfirst`);
  }
});

test("calculator presets point at a real award", () => {
  for (const s of STATE_PUBLIC_HOLIDAYS) {
    assert.ok(getAwardPublicHolidayRate(s.calculatorPreset.awardKey), `${s.code} preset award`);
    assert.ok(s.calculatorPreset.hours > 0 && s.calculatorPreset.hours <= 12);
  }
});

test("getStatePublicHolidays finds built states only", () => {
  assert.equal(getStatePublicHolidays("nsw")?.code, "NSW");
  assert.equal(getStatePublicHolidays("xyz"), undefined);
});

// ---------------------------------------------------------------------------
// Award public holiday rates — derived from the award constants
// ---------------------------------------------------------------------------

test("all 14 awards are covered, each once", () => {
  assert.equal(PUBLIC_HOLIDAY_AWARD_RATES.length, Object.keys(MODERN_AWARDS).length + 3);
  assert.equal(PUBLIC_HOLIDAY_AWARD_RATES.length, 14);
  const keys = PUBLIC_HOLIDAY_AWARD_RATES.map((r) => r.key);
  assert.equal(new Set(keys).size, keys.length);
});

test("public holiday multiples match the award tables", () => {
  const expected: Record<string, [number, number]> = {
    "fast-food": [2.25, 2.5],
    pharmacy: [2.25, 2.5],
    security: [2.5, 2.75],
    clerks: [2.5, 2.75],
    manufacturing: [2.5, 3.125], // 250% of the casual rate (compounded)
    restaurant: [2.25, 2.5],
    nurses: [2.0, 2.5], // 200% of the casual rate (compounded)
    "aged-care": [2.5, 2.75],
    "hair-and-beauty": [2.5, 2.5], // casual loading not added (Table 15)
    cleaning: [2.5, 2.75],
    "road-transport": [2.5, 2.75],
    retail: [2.25, 2.5],
    hospitality: [2.25, 2.5],
    schads: [2.5, 2.75],
  };
  for (const r of PUBLIC_HOLIDAY_AWARD_RATES) {
    assert.deepEqual([r.permanent, r.casual], expected[r.key], r.key);
  }
  assert.equal(getAwardPublicHolidayRate("manufacturing")?.casualCompounded, true);
  assert.equal(getAwardPublicHolidayRate("manufacturing")?.casualAsPrinted, 2.5);
  assert.equal(getAwardPublicHolidayRate("retail")?.casualCompounded, false);
  assert.deepEqual(publicHolidayRateRange(), { permanentMin: 2, permanentMax: 2.5, casualMin: 2.5, casualMax: 3.125 });
});

// ---------------------------------------------------------------------------
// Calculator arithmetic
// ---------------------------------------------------------------------------

test("publicHolidayPay: permanent retail Level 1, 8 hours", () => {
  const r = publicHolidayPay({ baseHourly: 27.81, hours: 8, employment: "permanent", permanentMultiple: 2.25, casualMultiple: 2.5 });
  assert.equal(r.holidayHourly, 62.57); // 27.81 x 2.25 = 62.5725
  assert.equal(r.holidayPay, 500.56);
  assert.equal(r.ordinaryPay, 222.48);
  assert.equal(r.extra, 278.08);
  assert.equal(r.dayOffPay, 222.48);
});

test("publicHolidayPay: casual gets the casual multiple, no pay for a day not worked", () => {
  const r = publicHolidayPay({ baseHourly: 30, hours: 5, employment: "casual", permanentMultiple: 2.5, casualMultiple: 2.75 });
  assert.equal(r.holidayHourly, 82.5);
  assert.equal(r.holidayPay, 412.5);
  assert.equal(r.ordinaryHourly, 37.5);
  assert.equal(r.ordinaryPay, 187.5);
  assert.equal(r.dayOffPay, 0);
});

test("publicHolidayPay clamps negative input and pctLabel formats", () => {
  const r = publicHolidayPay({ baseHourly: -5, hours: -1, employment: "permanent", permanentMultiple: 2.5, casualMultiple: 2.75 });
  assert.equal(r.holidayPay, 0);
  assert.equal(pctLabel(2.25), "225%");
  assert.equal(pctLabel(3.125), "312.5%");
});
