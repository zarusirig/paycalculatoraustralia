// Public hospital pay by state (23 October 2026). Spot checks are against the
// raw source text each figure was copied from; see each state file's header
// and the instrument's `proof` quote.

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  ALLIED_PROFESSIONS,
  NOT_VERIFIED,
  PUBLIC_HEALTH_PAY,
  PUBLIC_HEALTH_PAY_VERIFIED_ON,
  annualOf,
  fortnightlyOf,
  notVerifiedFor,
  publicAnnual,
  publicPayFor,
  publicPaySources,
  stepOf,
} from "../index";
import { OCCUPATIONS, getOccupation } from "../../job-pay-rates";
import { hospitalSalaryTitle, medianAnnual } from "../../job-pay-rates/public-hospital-common";

const OFFICIAL_HOSTS = [
  "www.health.nsw.gov.au",
  "www.fwc.gov.au",
  "westernhealth.org.au",
  "www.premier.vic.gov.au",
  "www.qirc.qld.gov.au",
  "www.health.qld.gov.au",
  "downloads.wairc.wa.gov.au",
  "www.wairc.wa.gov.au",
  "www.saet.sa.gov.au",
];

const EM_DASH = /—/;

/** Every reader-facing string in the module. */
function readerText(): string[] {
  const out: string[] = [];
  for (const st of PUBLIC_HEALTH_PAY) {
    out.push(st.name, st.employer);
    for (const i of st.instruments) out.push(i.name, i.ratesFrom, i.status, i.source.title, i.nextIncrease ?? "");
    for (const sc of st.scales) {
      out.push(sc.title, sc.entryRule, sc.topNote, ...(sc.notes ?? []), ...Object.values(sc.professionNotes ?? {}));
      for (const s of sc.steps) out.push(s.label, s.note ?? "");
    }
  }
  for (const n of NOT_VERIFIED) out.push(n.state, n.reason);
  return out;
}

test("five states, each verified on 23 October 2026 from an official host, with a proof quote", () => {
  assert.deepEqual(
    PUBLIC_HEALTH_PAY.map((s) => s.code),
    ["NSW", "VIC", "QLD", "WA", "SA"],
  );
  assert.equal(PUBLIC_HEALTH_PAY_VERIFIED_ON, "23 October 2026");
  for (const st of PUBLIC_HEALTH_PAY) {
    for (const i of st.instruments) {
      assert.equal(i.verifiedOn, "23 October 2026", i.id);
      assert.ok(i.proof.length > 80, `${i.id} needs a proof quote`);
      assert.ok(i.column.length > 0, `${i.id} needs its source column`);
      for (const src of [i.source, ...(i.extraSources ?? [])]) {
        const host = new URL(src.url).host;
        assert.ok(OFFICIAL_HOSTS.includes(host), `${i.id}: ${src.url} is not an official host`);
      }
    }
  }
});

test("every scale resolves: instrument, entry and top steps exist, every step has a figure", () => {
  for (const st of PUBLIC_HEALTH_PAY) {
    const ids = new Set<string>();
    for (const sc of st.scales) {
      assert.equal(sc.state, st.state, sc.id);
      assert.ok(!ids.has(sc.id), `duplicate scale id ${sc.id}`);
      ids.add(sc.id);
      assert.ok(st.instruments.some((i) => i.id === sc.instrumentId), `${sc.id} instrument`);
      stepOf(sc, sc.entry);
      stepOf(sc, sc.top);
      const labels = new Set<string>();
      for (const s of sc.steps) {
        assert.ok(!labels.has(s.label), `${sc.id}: duplicate step ${s.label}`);
        labels.add(s.label);
        assert.ok(annualOf(s) > 50_000 && annualOf(s) < 300_000, `${sc.id} ${s.label}: ${annualOf(s)}`);
        if (sc.annualBasis === "published") assert.equal(typeof s.annual, "number", `${sc.id} ${s.label} annual`);
        else assert.equal(typeof s.weekly, "number", `${sc.id} ${s.label} weekly`);
      }
      // The top step is the highest figure on the scale.
      assert.equal(annualOf(stepOf(sc, sc.top)), Math.max(...sc.steps.map(annualOf)), `${sc.id} top`);
    }
  }
});

test("each profession has at most one scale per state, so one anchor per state on its page", () => {
  for (const p of ALLIED_PROFESSIONS) {
    for (const st of PUBLIC_HEALTH_PAY) {
      assert.ok(st.scales.filter((s) => s.professions.includes(p)).length <= 1, `${st.code} ${p}`);
    }
  }
  for (const p of ["pharmacist", "radiographer", "physiotherapist", "psychologist", "occupational-therapist"] as const) {
    assert.deepEqual(publicPayFor(p).map((r) => r.state.code), ["NSW", "VIC", "QLD", "WA", "SA"], p);
  }
  assert.deepEqual(publicPayFor("sonographer").map((r) => r.state.code), ["VIC", "QLD", "WA", "SA"]);
  assert.ok(notVerifiedFor("sonographer").some((n) => n.state === "NSW"));
  assert.ok(!notVerifiedFor("pharmacist").some((n) => n.state === "NSW"));
});

test("annual and fortnightly rules: weekly x 52 to the dollar, weekly x 2 to the cent, published figures as printed", () => {
  const nswPharm = publicPayFor("pharmacist")[0].scale;
  assert.equal(annualOf(stepOf(nswPharm, "Grade 1, year 1")), 86_785); // 1,668.95 x 52 = 86,785.40
  assert.equal(fortnightlyOf(stepOf(nswPharm, "Grade 1, year 1")), 3337.9);
  const qld = publicPayFor("physiotherapist")[2].scale;
  assert.equal(fortnightlyOf(stepOf(qld, "HP3.0")), 3213);
  assert.equal(annualOf(stepOf(qld, "HP3.0")), 83_824);
  // QLD's reference annual salary is the fortnightly rate x 26.089, rounded (award note 3).
  for (const s of qld.steps) assert.ok(Math.abs(s.fortnightly! * 26.089 - s.annual!) <= 1, s.label);
  const sa = publicPayFor("psychologist")[4].scale;
  assert.equal(fortnightlyOf(stepOf(sa, "AHP-6")), null);
});

test("spot checks against the source tables", () => {
  // NSW, ffppoa 1 July 2026 column.
  assert.equal(publicAnnual("pharmacist", "NSW", "Grade 7, Group B, year 2"), Math.round(3768.65 * 52));
  assert.equal(stepOf(publicPayFor("radiographer")[0].scale, "Level 1, year 1").weekly, 1522.26);
  assert.equal(stepOf(publicPayFor("radiographer")[0].scale, "Level 6, year 3").weekly, 3768.55);
  assert.equal(publicAnnual("physiotherapist", "NSW", "Level 1, year 1"), 79_419);
  assert.equal(publicAnnual("physiotherapist", "NSW", "Level 8, grade 4"), 197_370);
  assert.equal(publicAnnual("psychologist", "NSW", "Psychologist, year 1"), 83_670);
  assert.equal(publicAnnual("psychologist", "NSW", "Principal clinical psychologist, year 1 and after"), 180_666);
  // VIC: AHP 1-MAR-25 column; MSPP FFPPOA 1-Dec-24 column.
  assert.equal(stepOf(publicPayFor("physiotherapist")[1].scale, "Grade 1, year 1").weekly, 1357.5);
  assert.equal(stepOf(publicPayFor("physiotherapist")[1].scale, "Grade 7").weekly, 3660.3);
  assert.equal(stepOf(publicPayFor("pharmacist")[1].scale, "Grade 1, year 1").weekly, 1312.4);
  assert.equal(stepOf(publicPayFor("pharmacist")[1].scale, "Pharmacist intern").weekly, 1049.9);
  // Intern = 80% of Grade 1, year 1, to the nearest 10 cents (Schedule 3 cl 7.2).
  assert.equal(Math.round(1312.4 * 0.8 * 10) / 10, 1049.9);
  assert.equal(stepOf(publicPayFor("psychologist")[1].scale, "Grade 2, year 1").weekly, 1816.9);
  assert.equal(stepOf(publicPayFor("sonographer")[0].scale, "Grade 3, year 1").weekly, 2002.6);
  // QLD: award reprint as at 1 September 2026.
  assert.equal(stepOf(publicPayFor("pharmacist")[2].scale, "HP8.5").fortnightly, 9721);
  assert.ok(!publicPayFor("pharmacist")[2].scale.steps.some((s) => s.label === "HP3.8"), "HP3.8 is transitional");
  // WA: On and from 1 July 2026.
  assert.equal(publicAnnual("radiographer", "WA", "P-1.1"), 91_726);
  assert.equal(publicAnnual("radiographer", "WA", "P-9"), 213_729);
  // SA: ffpp on or after 1/5/2026, next column 1/5/2027.
  const saFirst = stepOf(publicPayFor("radiographer")[4].scale, "AHP-1, increment 1 (3-year degree start)");
  assert.deepEqual([saFirst.annual, saFirst.nextAnnual], [73_710, 76_290]);
  assert.deepEqual(
    [stepOf(publicPayFor("radiographer")[4].scale, "AHP-6").annual, stepOf(publicPayFor("radiographer")[4].scale, "AHP-6").nextAnnual],
    [164_617, 170_379],
  );
});

test("only an instrument that schedules a next rise carries next-rise figures", () => {
  for (const st of PUBLIC_HEALTH_PAY) {
    for (const sc of st.scales) {
      const inst = st.instruments.find((i) => i.id === sc.instrumentId)!;
      const anyNext = sc.steps.some((s) => typeof s.nextAnnual === "number");
      if (inst.nextIncrease === null) assert.ok(!anyNext, sc.id);
      else {
        assert.ok(sc.steps.every((s) => typeof s.nextAnnual === "number" && s.nextAnnual > annualOf(s)), sc.id);
      }
    }
  }
  assert.deepEqual(
    PUBLIC_HEALTH_PAY.flatMap((s) => s.instruments).filter((i) => i.nextIncrease !== null).map((i) => i.id),
    ["sa-ahp-2025"],
  );
});

test("no em dashes in reader-facing text", () => {
  for (const t of readerText()) assert.ok(!EM_DASH.test(t), t);
});

test("sources are de-duplicated and include each instrument's text", () => {
  const src = publicPaySources("pharmacist");
  assert.equal(new Set(src.map((s) => s.url)).size, src.length);
  for (const r of publicPayFor("pharmacist")) assert.ok(src.some((s) => s.url === r.instrument.source.url));
});

// ---------------------------------------------------------------------------
// The job pages that use these tables.
// ---------------------------------------------------------------------------

const HOSPITAL_SLUGS = ["pharmacist", "radiographer", "physiotherapist", "psychologist", "occupational-therapist", "sonographer"];

test("hospital pages: salary-led title within 65 characters, built from the median, and a description within 160", () => {
  for (const slug of HOSPITAL_SLUGS) {
    const occ = getOccupation(slug)!;
    assert.ok(occ.publicHospital, slug);
    assert.ok(occ.metaTitle && occ.metaTitle.includes("Salary") && occ.metaTitle.length <= 65, `${slug}: ${occ.metaTitle}`);
    assert.equal(occ.metaTitle, hospitalSalaryTitle(occ.name, occ.median), slug);
    for (const fig of occ.metaTitle!.match(/\$\d{1,3}(?:,\d{3})*/g) ?? []) {
      assert.equal(fig, `$${medianAnnual(occ.median!).toLocaleString("en-AU")}`, `${slug} title figure`);
    }
    assert.ok(occ.metaDescription && occ.metaDescription.length <= 160, `${slug}: ${occ.metaDescription?.length}`);
    assert.ok(occ.heading?.includes("Salary"), slug);
    assert.ok(occ.ato && occ.ato.rows.length > 0, `${slug} ATO rows`);
    assert.equal(occ.dateModified, "2026-10-23", slug);
  }
  assert.equal(getOccupation("pharmacist")!.metaTitle, "Pharmacist Salary Australia 2026: $101,712 Median, Pay by State");
  assert.equal(getOccupation("radiographer")!.metaTitle, "Radiographer Salary Australia 2026: $122,720 Median, Pay by State");
  assert.equal(getOccupation("physiotherapist")!.metaTitle, "Physiotherapist Salary Australia 2026: Hospital Pay by State");
  assert.equal(getOccupation("psychologist")!.metaTitle, "Psychologist Salary Australia 2026: $114,608 Median, Pay by State");
});

test("hospital pages: ATO rows are the Table 15A Total rows as printed", () => {
  const row = (slug: string, code: string) => getOccupation(slug)!.ato!.rows.find((r) => r.code === code)!;
  assert.deepEqual(Object.values(row("pharmacist", "251511")).slice(2), [6_939, 97_458, 96_680, 92_327, 94_928]);
  assert.deepEqual(Object.values(row("pharmacist", "251513")).slice(2), [23_316, 90_162, 79_868, 72_910, 71_507]);
  assert.deepEqual(Object.values(row("radiographer", "251211")).slice(2), [13_566, 104_270, 103_256, 101_067, 102_607]);
  assert.deepEqual(Object.values(row("physiotherapist", "252511")).slice(2), [32_906, 84_900, 80_635, 75_302, 76_527]);
  assert.deepEqual(Object.values(row("psychologist", "272311")).slice(2), [8_342, 103_071, 97_043, 80_283, 77_858]);
  assert.deepEqual(Object.values(row("psychologist", "272399")).slice(2), [14_141, 91_250, 84_065, 75_902, 74_152]);
  assert.deepEqual(Object.values(row("occupational-therapist", "252411")).slice(2), [25_828, 80_845, 77_046, 72_306, 72_861]);
  assert.deepEqual(Object.values(row("sonographer", "251214")).slice(2), [4_749, 112_903, 111_487, 108_440, 109_756]);
});

test("hospital pages: every dollar figure in the lede and the new FAQs is a figure the data holds", () => {
  for (const slug of HOSPITAL_SLUGS) {
    const occ = getOccupation(slug)!;
    const allowed = new Set<string>();
    const add = (n: number, decimals = 0) =>
      allowed.add(n.toLocaleString("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: decimals, maximumFractionDigits: decimals }));
    for (const r of publicPayFor(occ.publicHospital!.profession)) {
      for (const s of r.scale.steps) {
        add(annualOf(s));
        if (typeof s.weekly === "number") add(s.weekly, 2);
      }
    }
    if (occ.median) {
      add(occ.median.medianWeekly);
      add(occ.median.medianHourly);
      add(medianAnnual(occ.median));
    }
    for (const r of occ.ato!.rows) [r.avgTaxableIncome, r.medianTaxableIncome, r.avgSalary, r.medianSalary].forEach((n) => add(n));
    for (const t of occ.tables) for (const r of t.rows) {
      add(r.hourly, 2);
      add(r.weekly, 2);
      add(Math.round(r.weekly * 52));
      if (r.casualHourly !== null) add(r.casualHourly, 2);
    }
    const text = occ.lede!;
    for (const fig of text.match(/\$\d{1,3}(?:,\d{3})*(?:\.\d\d)?/g) ?? []) assert.ok(allowed.has(fig), `${slug} lede figure ${fig}`);
    // The query-led FAQs come first; take-home answers are checked by the engine, not here.
    for (const f of occ.faqs.slice(0, 4)) {
      if (/after tax/i.test(f.q)) continue;
      for (const fig of f.a.match(/\$\d{1,3}(?:,\d{3})*(?:\.\d\d)?/g) ?? []) {
        assert.ok(allowed.has(fig), `${slug} FAQ "${f.q}" figure ${fig}`);
      }
    }
  }
});

test("hospital pages: no em dashes in the new reader-facing copy", () => {
  for (const slug of HOSPITAL_SLUGS) {
    const occ = getOccupation(slug)!;
    for (const t of [occ.metaTitle!, occ.metaDescription!, occ.heading!, occ.lede!, occ.answerQuestion!, occ.publicHospital!.intro]) {
      assert.ok(!EM_DASH.test(t), `${slug}: ${t}`);
    }
    for (const f of occ.faqs.slice(0, 4)) assert.ok(!EM_DASH.test(f.q + f.a), `${slug}: ${f.q}`);
  }
  // Pages without public hospital data are untouched.
  assert.ok(OCCUPATIONS.filter((o) => o.publicHospital).length === HOSPITAL_SLUGS.length);
});
