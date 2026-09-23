import assert from "node:assert/strict";
import { test } from "node:test";

import {
  OCCUPATIONS,
  OCCUPATION_SLUGS,
  afterTax,
  annualFromWeekly,
  getOccupation,
  headlineRow,
  isOccupationSlug,
  nearestTakeHomeAmount,
  weeklyRange,
} from "../index";
import { REAL_ESTATE_ROWS } from "../real-estate-common";
import { SCHADS_SACS } from "../../../constants/schads-award";
import { EMPLOYMENT } from "../../../constants/australian-tax";

const cents = (x: number) => Math.round(x * 100);

test("every slug is registered exactly once and resolves", () => {
  assert.equal(new Set(OCCUPATION_SLUGS).size, OCCUPATION_SLUGS.length);
  assert.equal(OCCUPATIONS.length, OCCUPATION_SLUGS.length);
  for (const slug of OCCUPATION_SLUGS) {
    const occ = getOccupation(slug);
    assert.ok(occ, slug);
    assert.equal(occ.slug, slug);
  }
  assert.equal(isOccupationSlug("astronaut"), false);
  assert.equal(getOccupation("astronaut"), undefined);
});

test("slugs are URL-safe", () => {
  for (const slug of OCCUPATION_SLUGS) assert.match(slug, /^[a-z]+(-[a-z]+)*$/);
});

// ---------------------------------------------------------------------------
// Internal consistency of every published rate. These catch transcription
// slips: a weekly and hourly from different rows, or a casual rate typed from
// the wrong column.
// ---------------------------------------------------------------------------

test("hourly rate is the weekly rate over 38 hours, to the cent", () => {
  for (const occ of OCCUPATIONS) {
    for (const table of occ.tables) {
      for (const row of table.rows) {
        const derived = Math.round((row.weekly / 38) * 100);
        assert.ok(
          Math.abs(derived - cents(row.hourly)) <= 1,
          `${occ.slug} / ${row.label}: ${row.weekly}/38 = ${derived / 100}, table says ${row.hourly}`,
        );
      }
    }
  }
});

test("casual rate is the hourly rate plus 25%, to the cent", () => {
  for (const occ of OCCUPATIONS) {
    for (const table of occ.tables) {
      for (const row of table.rows) {
        if (row.casualHourly === null) continue; // the award sets no casual rate (asserted separately)
        const derived = cents(row.hourly) * 1.25;
        assert.ok(
          Math.abs(derived - cents(row.casualHourly)) <= 1,
          `${occ.slug} / ${row.label}: ${row.hourly} x 1.25 vs casual ${row.casualHourly}`,
        );
      }
    }
  }
});

test("rates sit at or above the National Minimum Wage", () => {
  for (const occ of OCCUPATIONS) {
    for (const table of occ.tables) {
      if (table.belowMinimumWage) continue; // apprentice/trainee tables — asserted separately
      for (const row of table.rows) {
        assert.ok(row.weekly >= EMPLOYMENT.minimumWageWeekly, `${occ.slug} / ${row.label}`);
        assert.ok(row.hourly >= EMPLOYMENT.minimumWageHourly, `${occ.slug} / ${row.label}`);
      }
    }
  }
});

test("rows within a table never decrease", () => {
  for (const occ of OCCUPATIONS) {
    for (const table of occ.tables) {
      for (let i = 1; i < table.rows.length; i += 1) {
        assert.ok(
          table.rows[i].weekly >= table.rows[i - 1].weekly,
          `${occ.slug} / ${table.id}: ${table.rows[i].label} is below ${table.rows[i - 1].label}`,
        );
      }
    }
  }
});

// ---------------------------------------------------------------------------
// Spot checks against the published award figures (1 July 2026 consolidations).
// ---------------------------------------------------------------------------

function row(slug: string, label: string) {
  const occ = getOccupation(slug);
  assert.ok(occ);
  const r = occ.tables.flatMap((t) => t.rows).find((x) => x.label === label);
  assert.ok(r, `${slug} / ${label}`);
  return r;
}

test("spot checks: headline award figures", () => {
  assert.deepEqual(
    [row("pharmacist", "Pharmacist").weekly, row("pharmacist", "Pharmacist").hourly, row("pharmacist", "Pharmacist").casualHourly],
    [1586.3, 41.74, 52.18],
  );
  assert.equal(row("electrician", "Electrical worker grade 5").hourly, 31.13); // Schedule B.2.1, incl. allowances
  assert.equal(row("electrician", "Electrical worker grade 5").casualHourly, 38.91);
  assert.equal(row("truck-driver", "Transport Worker Grade 6").weekly, 1102);
  assert.equal(row("bus-driver", "Grade 4").hourly, 30.59);
  assert.equal(row("security-guard", "Security Officer Level 1").casualHourly, 35.53);
  assert.equal(row("medical-receptionist", "Level 3").weekly, 1106.2);
  assert.equal(row("real-estate-agent", "Level 2 (Representative)").casualHourly, 36.81);
});

test("casual rates derived from shared award constants match the award's published schedules", () => {
  // Pharmacy Schedule B.2.1 (Mon–Fri 8am–7pm) and Security Schedule B.3 (Day), 1 July 2026.
  const published: [string, string, number][] = [
    ["pharmacist", "Pharmacist", 52.18],
    ["pharmacist", "Experienced pharmacist", 57.15],
    ["pharmacist", "Pharmacist in charge", 58.5],
    ["pharmacist", "Pharmacist manager", 65.19],
    ["pharmacist", "Pharmacy student — 1st year of course", 34.76],
    ["pharmacist", "Pharmacy intern — 2nd half of training", 43.93],
    ["security-guard", "Security Officer Level 1", 35.53],
    ["security-guard", "Security Officer Level 2", 36.55],
    ["security-guard", "Security Officer Level 3", 37.16],
    ["security-guard", "Security Officer Level 4", 37.79],
    ["security-guard", "Security Officer Level 5", 39.0],
  ];
  for (const [slug, label, casual] of published) assert.equal(row(slug, label).casualHourly, casual, `${slug} ${label}`);
});

test("electrician weekly = cl 16.2 minimum + industry allowance (+ tool allowance from grade 5)", () => {
  const base = [1004.9, 1013.1, 1046.9, 1080.6, 1119.1, 1154.3, 1221.1, 1283.1, 1309.5, 1415.0];
  const rows = getOccupation("electrician")!.tables[0].rows;
  assert.equal(rows.length, 10);
  rows.forEach((r, i) => {
    const expected = base[i] + 41.41 + (i >= 4 ? 22.31 : 0);
    assert.equal(cents(r.weekly), cents(expected), r.label);
  });
});

test("dental assistant rates are the transitional cl 16.2(b) table, not the general Level 6", () => {
  const l6 = row("dental-assistant", "Level 6 — Certificate III or 4+ years' experience");
  assert.equal(l6.weekly, 1163.9);
  assert.notEqual(l6.weekly, 1219.5); // the general Support Services Level 6
});

test("disability support worker rates come from the SCHADS constants, not a copy", () => {
  const dsw = getOccupation("disability-support-worker")!;
  const sacs = dsw.tables.find((t) => t.id === "sacs")!;
  for (const r of sacs.rows) {
    const source = SCHADS_SACS.find((s) => s.classification === r.label);
    assert.ok(source, r.label);
    assert.equal(r.weekly, source.weekly);
    assert.equal(r.hourly, source.hourly);
  }
  assert.equal(row("disability-support-worker", "Level 2 pay point 1").casualHourly, 45.28);
});

test("property manager and real estate agent share one rate table", () => {
  assert.equal(getOccupation("property-manager")!.tables[0].rows, REAL_ESTATE_ROWS);
  assert.equal(getOccupation("real-estate-agent")!.tables[0].rows, REAL_ESTATE_ROWS);
});

test("accountant is award-free and shows only the National Minimum Wage", () => {
  const acc = getOccupation("accountant")!;
  assert.equal(acc.award, null);
  assert.equal(acc.headline, null);
  const nmw = acc.tables[0].rows[0];
  assert.equal(nmw.weekly, EMPLOYMENT.minimumWageWeekly);
  assert.equal(nmw.hourly, EMPLOYMENT.minimumWageHourly);
  assert.ok(acc.median, "an award-free page must carry a market median");
});

// ---------------------------------------------------------------------------
// Page plumbing.
// ---------------------------------------------------------------------------

test("every headline pointer resolves to a real row", () => {
  for (const occ of OCCUPATIONS) {
    if (occ.headline) assert.ok(headlineRow(occ), occ.slug);
    else assert.equal(headlineRow(occ), null);
  }
});

test("every page has FAQs, sources, coverage and a verified date", () => {
  for (const occ of OCCUPATIONS) {
    assert.ok(occ.faqs.length >= 4, `${occ.slug} faqs`);
    assert.ok(occ.coverage.length >= 1, `${occ.slug} coverage`);
    assert.ok(occ.sources.length >= 2, `${occ.slug} sources`);
    for (const s of occ.sources) assert.match(s.url, /^https:\/\//, `${occ.slug} source ${s.title}`);
    assert.match(occ.verifiedOn, /\d{1,2} [A-Z][a-z]+ \d{4}/);
    for (const link of occ.related) assert.match(link.href, /^\/.*\/$/, `${occ.slug} related ${link.href}`);
  }
});

test("award pages cite a consolidated award text on awards.fairwork.gov.au", () => {
  for (const occ of OCCUPATIONS) {
    if (!occ.award) continue;
    assert.match(occ.award.code, /^MA\d{6}$/);
    assert.equal(occ.award.url, `https://awards.fairwork.gov.au/${occ.award.code}.html`);
  }
});

test("annual and after-tax figures link to a take-home page that exists", () => {
  for (const occ of OCCUPATIONS) {
    const r = headlineRow(occ);
    const weekly = r ? r.weekly : occ.median!.medianWeekly;
    const annual = annualFromWeekly(weekly);
    const target = nearestTakeHomeAmount(annual);
    assert.ok(target >= 30_000 && target <= 200_000 && target % 5_000 === 0, `${occ.slug} -> ${target}`);
    const t = afterTax(annual);
    assert.ok(t.netAnnual < annual && t.netAnnual > annual * 0.6, `${occ.slug} net ${t.netAnnual}`);
    assert.ok(weeklyRange(occ));
  }
});

test("annualFromWeekly uses 52 weeks", () => {
  assert.equal(annualFromWeekly(1586.3), 82_488);
  assert.equal(annualFromWeekly(1102), 57_304);
});

// ---------------------------------------------------------------------------
// W4 (wave 2) occupations — spot checks against the consolidated award text
// read 23 September 2026.
// ---------------------------------------------------------------------------

test("W4: HPSS health professional rates match cl 17.2 and Schedule C.2.3", () => {
  // [label, weekly, hourly, casual] exactly as the award prints them.
  const published: [string, number, number, number][] = [
    ["Level 1 pay point 1", 1174.0, 30.89, 38.61],
    ["Level 1 pay point 3", 1273.4, 33.51, 41.89],
    ["Level 1 pay point 4", 1317.2, 34.66, 43.33],
    ["Level 2 pay point 1", 1493.9, 39.31, 49.14],
    ["Level 4 pay point 4", 2705.1, 71.19, 88.99],
  ];
  for (const slug of ["occupational-therapist", "physiotherapist", "psychologist"]) {
    for (const [label, weekly, hourly, casual] of published) {
      const r = row(slug, label);
      assert.deepEqual([r.weekly, r.hourly, r.casualHourly], [weekly, hourly, casual], `${slug} ${label}`);
    }
    assert.equal(getOccupation(slug)!.award!.code, "MA000027");
  }
  assert.equal(headlineRow(getOccupation("occupational-therapist")!)!.hourly, 33.51); // 4-year degree entry
  assert.equal(headlineRow(getOccupation("psychologist")!)!.hourly, 34.66); // masters entry
});

test("W4: social worker rates are the SCHADS constants, headline is the 4-year graduate entry", () => {
  const sw = getOccupation("social-worker")!;
  for (const r of sw.tables[0].rows) {
    const source = SCHADS_SACS.find((s) => s.classification === r.label);
    assert.ok(source, r.label);
    assert.equal(r.weekly, source.weekly);
  }
  const h = headlineRow(sw)!;
  assert.equal(h.label, "Level 3 pay point 4");
  assert.deepEqual([h.weekly, h.hourly, h.casualHourly], [1649.97, 43.42, 54.28]);
});

test("W4: nurse rates are the Nurses Award constants and match Schedule B casual rates", () => {
  const h = headlineRow(getOccupation("nurse")!)!;
  assert.deepEqual([h.weekly, h.hourly, h.casualHourly], [1219.5, 32.09, 40.11]); // Schedule B.1.3(c)
  assert.equal(row("nurse", "Nursing assistant — 1st year").casualHourly, 34.56); // Schedule B.1.1(c)
  assert.equal(row("nurse", "Aged care RN level 1 — First year at this level").hourly, 41.36);
});
