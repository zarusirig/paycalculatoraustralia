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
  rowAnnual,
  weeklyRange,
} from "../index";
import { REAL_ESTATE_ROWS } from "../real-estate-common";
import { dailyHireHourly } from "../building-construction-common";
import { SCHADS_SACS } from "../../../constants/schads-award";
import { EMPLOYMENT } from "../../../constants/australian-tax";
import { HOSPITALITY_RATES, RETAIL_RATES } from "../../../constants/hospitality-award";
import { RESTAURANT_TABLE_3 } from "../hospitality-common";

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

test("W4: carpenter minimum = CW3 + industry allowance + tool allowance, all purposes", () => {
  const general = row("carpenter", "Carpenter (CW3) — general building and construction");
  assert.equal(cents(general.weekly), cents(1119.1 + 67.15 + 41.22));
  assert.deepEqual([general.hourly, general.casualHourly], [32.3, 40.38]);
  const residential = row("carpenter", "Carpenter (CW3) — residential building");
  assert.equal(cents(residential.weekly), cents(1119.1 + 53.72 + 41.22));
  assert.equal(residential.hourly, 31.95);
  assert.equal(dailyHireHourly(general.weekly), 33.33); // cl 19.3(a): x 52/50.4, / 38
});

test("W4: plumber weekly sums reproduce Schedule C.1.3 hourly rates to the cent", () => {
  const plumber = getOccupation("plumber")!;
  for (const table of plumber.tables) {
    for (const r of table.rows) {
      assert.equal(Math.round((r.weekly / 38) * 100), cents(r.hourly), `${r.label}: ${r.weekly}/38 vs ${r.hourly}`);
    }
  }
  const h = headlineRow(plumber)!;
  assert.deepEqual([h.weekly, h.hourly, h.casualHourly], [1246.54, 32.8, 41.0]);
});

test("W4: crane operator — Mobile Crane Hiring Award Schedule B and building award CW levels", () => {
  assert.deepEqual(
    [row("crane-operator", "Mobile crane employee level 2 (MCE2)").hourly, row("crane-operator", "Mobile crane employee level 2 (MCE2)").casualHourly],
    [32.06, 40.08],
  );
  assert.equal(row("crane-operator", "Mobile crane employee level 1 (MCE1)").weekly, 1182.89); // 1119.10 + 63.79
  assert.equal(row("crane-operator", "CW7 — tower crane; mobile cranes over 180 tonnes").hourly, 34.83); // (1256.30 + 67.15)/38
});

test("W4: apprentice electrician rates reproduce Schedule B.4 from the cl 16.4 formula", () => {
  const app = getOccupation("apprentice-electrician")!;
  for (const table of app.tables) {
    assert.ok(table.belowMinimumWage, table.id);
    for (const r of table.rows) {
      assert.equal(r.casualHourly, null, `${r.label}: the award sets no casual apprentice rate`);
      assert.equal(Math.round((r.weekly / 38) * 100), cents(r.hourly), `${r.label}: ${r.weekly}/38 vs ${r.hourly}`);
    }
  }
  assert.equal(row("apprentice-electrician", "1st year — completed Year 12").hourly, 17.97);
  assert.equal(row("apprentice-electrician", "1st year — not completed Year 12").hourly, 16.39);
  assert.equal(row("apprentice-electrician", "Adult apprentice — 2nd to 4th year").hourly, 28.9);
});

test("W4: only apprentice tables may sit below the National Minimum Wage, and only with a reason", () => {
  for (const occ of OCCUPATIONS) {
    for (const table of occ.tables) {
      if (!table.belowMinimumWage) continue;
      assert.equal(occ.slug, "apprentice-electrician", `${occ.slug}/${table.id} claims a below-NMW exemption`);
      assert.match(table.belowMinimumWage, /apprentice/i);
    }
  }
});

test("W4: engineer — annual wage, the award's weekly conversion and Schedule C hourly agree", () => {
  const eng = getOccupation("engineer")!;
  for (const r of eng.tables[0].rows) {
    assert.ok(r.annual, r.label);
    assert.equal(cents(r.weekly), Math.round(((r.annual! * 6) / 313) * 100), r.label); // cl 14.2
    assert.equal(Math.round(((r.annual! * 6) / 313 / 38) * 100), cents(r.hourly), r.label); // cl 14.2 hourly
  }
  const h = headlineRow(eng)!;
  assert.deepEqual([h.annual, h.hourly, h.casualHourly], [68_538, 34.57, 43.21]);
  assert.equal(rowAnnual(h), 68_538); // the page shows the award's annual wage, not weekly x 52
});

test("W4: lawyer — law graduate is Legal Services Award level 5; admitted lawyers get the NMW", () => {
  const h = headlineRow(getOccupation("lawyer")!)!;
  assert.deepEqual([h.weekly, h.hourly, h.casualHourly], [1291.8, 33.99, 42.49]);
  const nmw = row("lawyer", "National Minimum Wage (adult)");
  assert.equal(nmw.hourly, EMPLOYMENT.minimumWageHourly);
  assert.equal(nmw.casualHourly, 33.05);
});

test("W4: doctor rates are cl 16.1 verbatim (annual = weekly x 52 to the dollar)", () => {
  const doc = getOccupation("doctor")!;
  for (const t of doc.tables) {
    for (const r of t.rows) assert.ok(Math.abs(r.annual! - r.weekly * 52) < 1, `${r.label}: ${r.annual} vs ${r.weekly} x 52`);
  }
  assert.deepEqual([row("doctor", "Intern").weekly, row("doctor", "Intern").hourly, row("doctor", "Intern").casualHourly], [1277.54, 33.62, 42.03]);
  assert.equal(row("doctor", "Specialist").annual, 121_535);
});

test("W4: teacher aide — cl 17.1 rates, annual = weekly x 52.18, Schedule B.2.1 casuals", () => {
  const ta = getOccupation("teacher-aide")!;
  for (const r of ta.tables[0].rows) assert.equal(r.annual, Math.round(r.weekly * 52.18), r.label);
  const h = headlineRow(ta)!;
  assert.deepEqual([h.weekly, h.hourly, h.casualHourly], [1073.1, 28.24, 35.3]);
});

test("W4: early childhood teacher — long day care is 4% above preschool, casual = 2-hour rate / 2", () => {
  const h = headlineRow(getOccupation("early-childhood-teacher")!)!;
  assert.deepEqual([h.weekly, h.annual, h.hourly, h.casualHourly], [1513.6, 78_979, 39.83, 49.79]);
  const pre = row("early-childhood-teacher", "Level 1 — preschool");
  assert.equal(Math.round(pre.weekly * 1.04 * 10) / 10, h.weekly);
  assert.equal(pre.casualHourly, 47.88);
});

test("W4: a metaTitle override still states the headline hourly rate", () => {
  for (const occ of OCCUPATIONS) {
    if (!occ.metaTitle) continue;
    const r = headlineRow(occ);
    assert.ok(r, occ.slug);
    assert.ok(occ.metaTitle.includes(`$${r.hourly.toFixed(2)}`), `${occ.slug}: ${occ.metaTitle}`);
  }
});

// ---------------------------------------------------------------------------
// T5 (wave 3) occupations — spot checks against the consolidated award text
// and the Fair Work Ombudsman pay guides, read 23 September 2026.
// ---------------------------------------------------------------------------

function checkPublished(slug: string, published: [string, number, number, number | null][]) {
  for (const [label, weekly, hourly, casual] of published) {
    const r = row(slug, label);
    assert.deepEqual([r.weekly, r.hourly, r.casualHourly], [weekly, hourly, casual], `${slug} / ${label}`);
  }
}

test("T5: midwife is paid on the Nurses Award RN ladder — identical rows to the nurse page", () => {
  const h = headlineRow(getOccupation("midwife")!)!;
  assert.deepEqual([h.weekly, h.hourly, h.casualHourly], [1219.5, 32.09, 40.11]);
  assert.deepEqual(getOccupation("midwife")!.tables[0].rows, getOccupation("nurse")!.tables[0].rows);
  assert.equal(getOccupation("midwife")!.award!.code, "MA000034");
});

test("T5: childcare worker — post-March 2026 CSE levels, cl 14.1(b), pay guide casuals", () => {
  checkPublished("childcare-worker", [
    ["Level 1 — Introductory Educator", 1094.8, 28.81, 36.01],
    ["Level 2 — Educator", 1128.4, 29.69, 37.11],
    ["Level 3 — Qualified Educator", 1233.9, 32.47, 40.59],
    ["Level 5 — Advanced Educator", 1389.5, 36.57, 45.71],
    ["Level 8 — Director", 1752.7, 46.12, 57.65],
    ["Support Worker Level 1.1 — on commencement", 1004.9, 26.44, 33.05],
  ]);
  assert.equal(headlineRow(getOccupation("childcare-worker")!)!.label, "Level 3 — Qualified Educator");
});

test("T5: aged care worker — direct care cl 14.3 and general cl 14.1 match the 1 Sep 2026 pay guide", () => {
  checkPublished("aged-care-worker", [
    ["Direct care level 1 — Introductory", 1239.0, 32.61, 40.76],
    ["Direct care level 3 — Qualified", 1376.7, 36.23, 45.29],
    ["Direct care level 6 — Team Leader", 1541.9, 40.58, 50.73],
    ["General level 1", 1055.4, 27.77, 34.71],
    ["General level 7", 1278.6, 33.65, 42.06],
  ]);
});

test("T5: cleaner — Table 2 rates; pay guide casual and part-time (15% allowance) figures", () => {
  checkPublished("cleaner", [
    ["Cleaning Services Employee Level 1", 1028.9, 27.08, 33.85],
    ["Cleaning Services Employee Level 3", 1119.1, 29.45, 36.81],
  ]);
  const l1 = row("cleaner", "Cleaning Services Employee Level 1");
  assert.equal(Math.round(cents(l1.hourly) * 1.15) / 100, 31.14); // cl 10.2 part-time allowance
});

test("T5: Restaurant Award Table 3 is the same dollars as the Hospitality Award at every level", () => {
  for (const r of RESTAURANT_TABLE_3) {
    const h = HOSPITALITY_RATES.find((x) => x.level === r.level);
    assert.ok(h, r.level);
    assert.deepEqual([r.weekly, r.hourly], [h.weekly, h.hourly], r.level);
  }
});

test("T5: chef, bartender and barista headline rows", () => {
  checkPublished("chef", [
    ["Cook grade 3 (tradesperson) — commis chef", 1119.1, 29.45, 36.81],
    ["Cook grade 5 (tradesperson) — chef de partie", 1221.1, 32.13, 40.16],
    ["Restaurant — Cook grade 3 (tradesperson)", 1119.1, 29.45, 36.81],
  ]);
  checkPublished("bartender", [["Food and beverage attendant grade 2", 1029.1, 27.08, 33.85]]);
  checkPublished("barista", [
    ["Food and beverage attendant grade 2", 1029.1, 27.08, 33.85],
    ["Fast Food Level 1", 1056.8, 27.81, 34.76],
  ]);
  assert.equal(getOccupation("barista")!.award!.code, "MA000119");
});

test("T5: mechanic — Vehicle award cl 16.2 and the pay guide's casual daytime rate", () => {
  checkPublished("mechanic", [
    ["R6 — Tradesperson Level I (motor mechanic)", 1119.1, 29.45, 36.81],
    ["R7 — Tradesperson Level II (master technician)", 1224.4, 32.22, 40.28],
    ["R5 — Vehicle RS&R industry employee Level 5", 1088.2, 28.64, 35.8],
  ]);
});

test("T5: hairdresser — Table 4 levels and the cl 18.6 graduate rate (92.5% of the standard rate)", () => {
  checkPublished("hairdresser", [
    ["Level 3", 1119.1, 29.45, 36.81],
    ["Level 5", 1174.0, 30.89, 38.61],
    ["Hairdressing graduate — first 12 months", 1035.17, 27.24, null],
  ]);
  assert.equal(Math.round(1119.1 * 0.925 * 100) / 100, 1035.17);
});

test("T5: lab technician — HPSS level 1 shared rows, support services lab assistant, Manufacturing C9–C5", () => {
  checkPublished("lab-technician", [
    ["Level 1 pay point 1", 1174.0, 30.89, 38.61],
    ["Support Services level 1 — laboratory assistant", 1024.7, 26.97, 33.71],
    ["Support Services level 3 — laboratory assistant", 1106.2, 29.11, 36.39],
    ["C9 — Laboratory Technician Level I", 1154.3, 30.38, 37.98],
    ["C5 — Laboratory Technician Level V", 1309.5, 34.46, 43.08],
  ]);
});

test("T5: pharmacy assistant reads the shared Pharmacy Award constants", () => {
  checkPublished("pharmacy-assistant", [
    ["Pharmacy assistant level 1", 1056.8, 27.81, 34.76],
    ["Pharmacy assistant level 4", 1165.1, 30.66, 38.33],
  ]);
  assert.equal(getOccupation("pharmacy-assistant")!.penalties, getOccupation("pharmacist")!.penalties);
});

test("T5: retail worker reads the shared retail constants", () => {
  const rows = getOccupation("retail-worker")!.tables[0].rows;
  assert.equal(rows.length, RETAIL_RATES.length);
  checkPublished("retail-worker", [
    ["Retail Employee Level 1", 1056.8, 27.81, 34.76],
    ["Retail Employee Level 8", 1291.8, 33.99, 42.49],
  ]);
});
