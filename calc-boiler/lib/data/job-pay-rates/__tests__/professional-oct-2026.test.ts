import assert from "node:assert/strict";
import { test } from "node:test";

import { EMPLOYMENT, calculatePayBreakdown } from "../../../constants/australian-tax";
import { ATO_TABLE_15_URL, ATO_TAXSTATS_INCOME_YEAR } from "../common";
import { OCCUPATION_SECTOR } from "../sectors";
import { getOccupation, headlineRow, rowAnnual, type Occupation } from "../index";
import { ENGINEER } from "../engineer";
import { PEA, exemptionThreshold, peaRow } from "../professional-common";

// P1 (9 Oct 2026): professional and corporate salary pages. Every figure below
// was read on 9 October 2026 from:
//   ATO Taxation statistics 2023–24, Individuals Table 15A (data.gov.au xlsx);
//   Jobs and Skills Australia ANZSCO occupation profiles (ABS SEEH May 2025);
//   awards.fairwork.gov.au MA000065, MA000066 and MA000116 (to 1 July 2026).

const P1 = [
  "civil-engineer",
  "electrical-engineer",
  "mechanical-engineer",
  "software-engineer",
  "cyber-security",
  "project-manager",
  "data-analyst",
  "business-analyst",
  "actuary",
  "mortgage-broker",
  "paralegal",
  "surveyor",
] as const;

const occ = (slug: string): Occupation => {
  const o = getOccupation(slug);
  assert.ok(o, slug);
  return o;
};

/** [code, title, individuals, avg taxable income, median taxable income, avg salary or wages, median salary or wages] */
type AtoTuple = [string, string, number, number, number, number, number];
const atoTuples = (slug: string): AtoTuple[] =>
  occ(slug).ato!.rows.map((r) => [r.code, r.title, r.individuals, r.avgTaxableIncome, r.medianTaxableIncome, r.avgSalary, r.medianSalary]);

test("P1: every page is registered, sourced and dated 9 October 2026", () => {
  for (const slug of P1) {
    const o = occ(slug);
    assert.equal(o.slug, slug);
    assert.equal(o.verifiedOn, "9 October 2026");
    assert.equal(o.dateModified, "2026-10-09");
    assert.equal(OCCUPATION_SECTOR[o.slug], "office");
    assert.ok(o.faqs.length >= 5, `${slug} faqs`);
    assert.ok(o.ato, `${slug} must carry ATO figures`);
    assert.equal(o.ato!.incomeYear, ATO_TAXSTATS_INCOME_YEAR);
    assert.equal(ATO_TAXSTATS_INCOME_YEAR, "2023–24");
    assert.ok(o.sources.some((s) => s.url === ATO_TABLE_15_URL), `${slug} cites ATO Table 15`);
    assert.ok(o.lede && o.heading && o.metaDescription && o.metaTitle, `${slug} salary-page fields`);
    assert.ok(o.metaTitle!.length <= 65, `${slug} title ${o.metaTitle!.length}: ${o.metaTitle}`);
    assert.ok(o.metaDescription!.length <= 160, `${slug} description ${o.metaDescription!.length}`);
    assert.ok((o.payslipNotes ?? []).length >= 2, `${slug} payslip notes`);
  }
});

test("P1: ATO Table 15A rows, Total (all sexes), exactly as published", () => {
  const expected: Record<(typeof P1)[number], AtoTuple[]> = {
    "civil-engineer": [
      ["233211", "Civil engineer", 50_761, 136_604, 120_637, 131_274, 120_000],
      ["233212", "Engineer - geotechnical", 4_127, 138_695, 120_396, 130_823, 118_380],
      ["233214", "Engineer - structural", 8_190, 126_275, 113_704, 120_847, 113_231],
      ["233215", "Engineer - transport", 3_179, 139_020, 125_789, 132_594, 124_537],
    ],
    "electrical-engineer": [
      ["233311", "Electrical engineer", 34_797, 141_415, 132_349, 134_110, 130_630],
      ["233411", "Electronics engineer", 7_595, 130_290, 115_546, 118_230, 113_202],
    ],
    "mechanical-engineer": [
      ["233512", "Engineer - mechanical", 42_582, 129_531, 116_735, 123_198, 115_872],
      ["233511", "Engineer - industrial", 3_716, 128_624, 112_798, 121_194, 111_613],
      ["233513", "Engineer - production or plant", 7_395, 115_643, 100_030, 109_115, 100_176],
      ["312512", "Mechanical engineering technician or associate", 8_193, 110_740, 100_591, 106_439, 100_450],
    ],
    "software-engineer": [
      ["261313", "Computing professional - software engineer", 84_585, 148_516, 134_370, 135_788, 132_758],
      ["261312", "Applications programmer", 47_545, 130_623, 119_893, 122_258, 117_992],
      ["261311", "Computing professional - analyst programmer", 8_581, 131_497, 123_030, 126_060, 122_234],
      ["261314", "Computing professional - software tester", 7_771, 108_021, 105_729, 107_317, 106_142],
      ["261316", "Devops engineer", 666, 110_170, 108_541, 108_034, 109_093],
    ],
    "cyber-security": [
      ["262116", "Cyber security analyst", 4_070, 113_408, 100_511, 108_663, 99_733],
      ["261315", "Cyber security engineer", 2_003, 145_753, 132_485, 135_653, 133_128],
      ["262115", "Cyber security advice and assessment specialist", 1_454, 160_984, 148_824, 153_217, 147_590],
      ["262114", "Cyber governance risk and compliance specialist", 1_404, 138_649, 127_182, 136_572, 127_109],
      ["262117", "Cyber security architect", 664, 186_239, 179_676, 181_966, 180_327],
      ["262118", "Cyber security operations coordinator", 531, 138_173, 125_750, 133_502, 124_224],
      ["261317", "Penetration tester", 121, 104_473, 95_756, 104_205, 99_239],
    ],
    "project-manager": [
      ["133111", "Builder - construction project manager", 74_999, 141_215, 122_139, 131_433, 120_744],
      ["135112", "Computing professional - project manager", 34_693, 157_401, 145_302, 150_394, 145_168],
      ["511112", "Administrator - program", 284_325, 81_887, 74_287, 77_095, 72_911],
    ],
    "data-analyst": [
      ["224114", "Data analyst", 14_837, 92_904, 89_839, 90_970, 89_634],
      ["224115", "Data scientist", 3_332, 113_326, 105_640, 107_277, 105_143],
      ["224116", "Statistician", 2_345, 132_219, 114_300, 119_835, 111_413],
    ],
    "business-analyst": [
      ["261111", "Business analyst - IT", 46_789, 127_551, 119_408, 123_441, 119_229],
      ["261112", "Computing professional - systems analyst", 13_055, 132_331, 120_585, 125_940, 119_204],
    ],
    actuary: [
      ["224111", "Actuary", 2_927, 208_520, 172_265, 193_788, 166_678],
      ["224116", "Statistician", 2_345, 132_219, 114_300, 119_835, 111_413],
      ["224112", "Mathematician", 680, 136_970, 117_730, 122_478, 115_374],
    ],
    "mortgage-broker": [
      ["222112", "Broker - finance", 11_049, 107_599, 84_652, 97_205, 81_587],
      ["222113", "Broker - insurance", 9_005, 137_597, 99_309, 119_714, 96_439],
    ],
    paralegal: [
      ["599214", "Clerk - law", 13_221, 71_193, 63_617, 66_297, 62_615],
      ["599112", "Legal executive", 12_004, 75_872, 61_205, 69_848, 60_265],
      ["521212", "Legal secretary", 12_072, 66_205, 64_413, 62_076, 63_448],
    ],
    surveyor: [
      ["232212", "Scientist - surveyor", 9_869, 126_763, 117_972, 116_834, 114_639],
      ["232214", "Geographic information systems manager", 1_855, 110_845, 105_351, 106_771, 104_899],
      ["232213", "Cartographer", 661, 107_029, 101_425, 101_028, 98_416],
      ["233213", "Quantity surveyor", 4_991, 136_623, 117_714, 129_708, 115_999],
    ],
  };
  for (const slug of P1) assert.deepEqual(atoTuples(slug), expected[slug], slug);
  // The same ATO code carries the same figures wherever it appears.
  assert.deepEqual(atoTuples("actuary")[1], atoTuples("data-analyst")[2]);
});

test("P1: Jobs and Skills Australia medians (ABS SEEH May 2025) and the pages that publish none", () => {
  const expected: Record<string, [string, string, number, number] | null> = {
    "civil-engineer": ["2332", "Civil Engineering Professionals", 2_217, 59],
    "electrical-engineer": ["2333", "Electrical Engineers", 2_553, 67],
    "mechanical-engineer": ["2335", "Industrial, Mechanical and Production Engineers", 2_614, 67],
    "software-engineer": ["2613", "Software and Applications Programmers", 2_537, 67],
    "cyber-security": ["2621", "Database and Systems Administrators, and ICT Security Specialists", 2_461, 66],
    "business-analyst": ["2611", "ICT Business and Systems Analysts", 2_697, 72],
    actuary: ["2241", "Actuaries, Mathematicians and Statisticians", 2_072, 56],
    "mortgage-broker": ["2221", "Financial Brokers", 2_576, 70],
    paralegal: ["5992", "Court and Legal Clerks", 1_345, 35],
    surveyor: ["2322", "Surveyors and Spatial Scientists", 2_300, 56],
    // JSA's ANZSCO 2013 profiles have no data analyst code, and the project
    // manager title spans three wider unit groups: no median is presented.
    "data-analyst": null,
    "project-manager": null,
  };
  for (const [slug, want] of Object.entries(expected)) {
    const m = occ(slug).median;
    if (want === null) {
      assert.equal(m, null, slug);
      continue;
    }
    assert.ok(m, slug);
    assert.deepEqual([m.anzscoCode, m.anzscoTitle, m.medianWeekly, m.medianHourly], want, slug);
    assert.equal(m.allOccupationsWeekly, 1_852);
    assert.match(m.url, new RegExp(`/occupations-anzsco/${m.anzscoCode}-`));
  }
  // The civil engineer spoke and the engineer parent quote the same JSA group.
  assert.deepEqual(occ("civil-engineer").median, ENGINEER.median);
});

test("P1: Professional Employees Award rows are the engineer page's rows (cl 14.1, Schedule C)", () => {
  const engineerRows = ENGINEER.tables[0].rows;
  for (const slug of ["civil-engineer", "electrical-engineer", "mechanical-engineer", "software-engineer", "cyber-security"]) {
    const o = occ(slug);
    assert.equal(o.award!.code, "MA000065", slug);
    for (const r of o.tables[0].rows) {
      const src = engineerRows.find((e) => e.label === r.label)!;
      assert.ok(src, `${slug} ${r.label}`);
      assert.deepEqual([r.annual, r.weekly, r.hourly, r.casualHourly], [src.annual, src.weekly, src.hourly, src.casualHourly], `${slug} ${r.label}`);
    }
  }
  // Engineers: 4 or 5-year graduate entry; IT stream: the lower 3-year rate.
  for (const slug of ["civil-engineer", "electrical-engineer", "mechanical-engineer"]) {
    const h = headlineRow(occ(slug))!;
    assert.deepEqual([rowAnnual(h), h.hourly, h.casualHourly], [68_538, 34.57, 43.21], slug);
  }
  for (const slug of ["software-engineer", "cyber-security"]) {
    const h = headlineRow(occ(slug))!;
    assert.deepEqual([rowAnnual(h), h.hourly, h.casualHourly], [66_825, 33.71, 42.14], slug);
  }
  // cl 18.6 salary lines: 125% of the classification's annual minimum.
  assert.equal(exemptionThreshold(peaRow(PEA.grad45).annual!), 85_672.5);
  assert.equal(exemptionThreshold(peaRow(PEA.grad3).annual!), 83_531.25);
  assert.equal(exemptionThreshold(peaRow(PEA.pp14).annual!), 95_333.75);
  assert.equal(exemptionThreshold(peaRow(PEA.level2).annual!), 98_545);
  assert.equal(exemptionThreshold(peaRow(PEA.level3).annual!), 107_696.25);
  assert.equal(exemptionThreshold(peaRow(PEA.level4).annual!), 121_466.25);
});

test("P1: paralegal — Legal Services Award cl 15.1 and Schedule B.2.1, law clerk headline", () => {
  const p = occ("paralegal");
  assert.equal(p.award!.code, "MA000116");
  assert.equal(p.award!.awardPageHref, "/legal-services-award-rates/");
  assert.deepEqual(
    p.tables[0].rows.map((r) => [r.weekly, r.hourly, r.casualHourly]),
    [
      [1073.1, 28.24, 35.3],
      [1119.1, 29.45, 36.81],
      [1182.1, 31.11, 38.89],
      [1241.4, 32.67, 40.84],
      [1291.8, 33.99, 42.49],
      [1369.2, 36.03, 45.04],
    ],
  );
  const h = headlineRow(p)!;
  assert.equal(h.label, "Level 6 — Law clerk");
  assert.equal(rowAnnual(h), 71_198);
  // The law graduate rate on the lawyer page is the same Level 5 dollars.
  assert.equal(getOccupation("lawyer")!.tables[0].rows[0].weekly, p.tables[0].rows[4].weekly);
  assert.deepEqual(p.allowances.map((a) => a.amount), ["$20.75, then $16.54", "$3.75 per week", "$1.00 per km"]);
});

test("P1: surveyor — Surveying Award cl 17.1, Schedule B.2 casuals, cl 21 penalties", () => {
  const s = occ("surveyor");
  assert.equal(s.award!.code, "MA000066");
  assert.equal(s.award!.url, "https://awards.fairwork.gov.au/MA000066.html");
  assert.deepEqual(
    s.tables[0].rows.map((r) => [r.weekly, r.hourly, r.casualHourly]),
    [
      [1283.1, 33.77, 42.21],
      [1309.5, 34.46, 43.08],
      [1344.5, 35.38, 44.23],
      [1415, 37.24, 46.55],
      [1450.2, 38.16, 47.7],
      [1513.7, 39.83, 49.79],
      [1654.4, 43.54, 54.43],
      [1865.6, 49.09, 61.36],
    ],
  );
  assert.equal(headlineRow(s)!.label, "Level 8 — Survey Technician Level II");
  assert.deepEqual(
    s.penalties.map((p) => [p.permanent, p.casual]),
    [
      ["150%", "187.5%"],
      ["200%", "250%"],
      ["200%", "250%"],
      ["250%", "312.5%"],
    ],
  );
});

test("P1: coverage-depends pages name no award and show the National Minimum Wage floor", () => {
  for (const slug of ["project-manager", "data-analyst", "business-analyst", "actuary", "mortgage-broker"]) {
    const o = occ(slug);
    assert.equal(o.coverageMode, "depends", slug);
    assert.equal(o.award, null, slug);
    assert.equal(o.headline, null, slug);
    const nmw = o.tables[0].rows[0];
    assert.deepEqual([nmw.weekly, nmw.hourly, nmw.casualHourly], [EMPLOYMENT.minimumWageWeekly, EMPLOYMENT.minimumWageHourly, 33.05], slug);
    // Never call a coverage-depends job "award-free" outright ("if no award
    // applies, you are award-free" is fine; "<plural> are award-free" is not).
    const text = [o.lede, ...o.coverage, ...o.faqs.map((f) => f.a)].join(" ").toLowerCase();
    assert.ok(!text.includes(`${o.plural} are award-free`), slug);
  }
});

test("P1: engineer links down to its three disciplines and each links back up", () => {
  const spokes = ENGINEER.spokes!.map((s) => s.href);
  assert.deepEqual(spokes, ["/job-pay-rates/civil-engineer/", "/job-pay-rates/electrical-engineer/", "/job-pay-rates/mechanical-engineer/"]);
  for (const href of spokes) {
    const o = occ(href.split("/")[2]);
    assert.equal(o.parent!.href, "/job-pay-rates/engineer/");
  }
});

// ---------------------------------------------------------------------------
// Every dollar figure in the prose traces to a sourced value or to the site's
// tax engine applied to one. Nothing typed into a sentence can drift.
// ---------------------------------------------------------------------------

const cents = (n: number) => Math.round(n * 100);
const net = (gross: number) => calculatePayBreakdown({ grossSalary: gross, includeHECS: false, hasPrivateHealth: true });

function allowedCents(): Set<number> {
  const allowed = new Set<number>();
  const add = (n: number) => allowed.add(cents(n));
  const addGross = (g: number) => {
    add(g);
    const b = net(g);
    add(Math.round(b.takeHomePay));
    add(Math.round(b.fortnightly));
  };
  for (const slug of [...P1, "engineer"]) {
    const o = occ(slug);
    for (const r of o.ato?.rows ?? []) {
      [r.avgTaxableIncome, r.medianTaxableIncome].forEach(add);
      addGross(r.avgSalary);
      addGross(r.medianSalary);
    }
    if (o.median) {
      add(o.median.medianWeekly);
      add(o.median.medianHourly);
      addGross(o.median.medianWeekly * 52);
    }
    for (const t of o.tables) {
      for (const r of t.rows) {
        add(r.weekly);
        add(r.hourly);
        if (r.casualHourly !== null) add(r.casualHourly);
        addGross(rowAnnual(r));
        if (r.annual !== undefined) add(exemptionThreshold(r.annual));
      }
    }
  }
  // Read from the award schedules and the FWO pay slips page, not derived:
  //   MA000065 Schedule C.1 125%/150% (pay point 1.1 4/5-yr; 3-yr), cl 16.3 $1.00/km
  //   MA000116 Schedule B.1.3 150% law clerk $54.05; cl 18.2 $20.75 / $16.54; cl 18.3 $3.75; cl 18.4 $1.00 / $0.34
  //   MA000066 Schedule B.1.2 Level 8 $50.66 / $67.54; cl 19.2 $16.62; cl 19.7 $1.00
  [43.21, 51.86, 42.14, 50.57, 54.05, 20.75, 16.54, 3.75, 1.0, 0.34, 50.66, 67.54, 16.62].forEach(add);
  // National Minimum Wage Order 2026.
  [EMPLOYMENT.minimumWageHourly, EMPLOYMENT.minimumWageWeekly].forEach(add);
  return allowed;
}

function prose(o: Occupation): string[] {
  return [
    o.lede ?? "",
    o.metaTitle ?? "",
    o.metaDescription ?? "",
    o.heading ?? "",
    o.penaltiesNote,
    o.ato?.intro ?? "",
    ...o.coverage,
    ...o.overtime,
    ...o.notices,
    ...o.notShown,
    ...(o.payslipNotes ?? []),
    ...o.allowances.flatMap((a) => [a.amount, a.note]),
    ...o.faqs.flatMap((f) => [f.q, f.a]),
  ];
}

test("P1: every dollar figure in the page text is a sourced figure or the engine's take-home on one", () => {
  const allowed = allowedCents();
  for (const slug of P1) {
    for (const text of prose(occ(slug))) {
      for (const m of text.matchAll(/\$([\d,]+(?:\.\d{2})?)/g)) {
        const value = Number(m[1].replace(/,/g, ""));
        assert.ok(allowed.has(cents(value)), `${slug}: "${m[0]}" in "${text.slice(0, 90)}…" is not a sourced figure`);
      }
    }
  }
});

test("P1: headline sentences carry the figures they claim", () => {
  const civil = occ("civil-engineer");
  assert.match(civil.lede!, /\$120,000/);
  assert.match(civil.lede!, /\$131,274/);
  assert.match(civil.lede!, /\$68,538/);
  assert.match(civil.lede!, /\$34\.57/);
  // The electrical lede compares against the civil and mechanical medians.
  const elec = occ("electrical-engineer").lede!;
  assert.match(elec, /\$130,630/);
  assert.match(elec, /\(\$120,000\)/);
  assert.match(elec, /\(\$115,872\)/);
  assert.match(occ("paralegal").lede!, /\$36\.03 an hour — \$1,369\.20 a week, \$71,198 a year/);
  assert.match(occ("surveyor").lede!, /\$33\.77 an hour \(\$66,721 a year\)/);
  assert.match(occ("surveyor").lede!, /\$39\.83 \(\$78,712 a year\)/);
  assert.match(occ("cyber-security").metaTitle!, /\$99,733–\$180,327/);
  // A metaTitle on an award page still states the headline hourly rate.
  for (const slug of ["civil-engineer", "electrical-engineer", "mechanical-engineer", "software-engineer", "cyber-security", "paralegal", "surveyor"]) {
    const o = occ(slug);
    assert.ok(o.metaTitle!.includes(`$${headlineRow(o)!.hourly.toFixed(2)}`), slug);
  }
});
