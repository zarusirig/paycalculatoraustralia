// =============================================================================
// Health salary pages — every published figure, asserted against the value
// read from its official source on 9 October 2026, plus the plumbing that
// keeps the six pages distinct, linked and inside the site's borders.
// =============================================================================

import assert from "node:assert/strict";
import { test } from "node:test";

import { ATO_15A, ATO_15B, ATO_15D, ATO_INCOME_YEAR } from "../ato-2023-24";
import {
  HEALTH_SALARY_PAGES,
  HEALTH_SALARY_SLUGS,
  HOSPITAL_PACKAGING,
  STAFF_SPECIALIST_SCALES,
  getHealthSalaryPage,
  isHealthSalarySlug,
  takeHome,
  takeHomePageFor,
  type AtoRow,
} from "../index";
import { AWARD_REGISTRAR_RANGE, AWARD_SPECIALIST_MINIMUM, COMMUNITY_MEDICAL_PRACTITIONER } from "../pages";
import { VIC_WEEKLY } from "../staff-specialists";
import { OCCUPATION_SLUGS, getOccupation } from "../../job-pay-rates";
import { calculatePayBreakdown } from "../../../constants/australian-tax";

/** [individuals, avg taxable, median taxable, avg salary/wages, median salary/wages, avg total, median total] */
type Seven = [number, number, number, number, number, number, number];

function seven(r: AtoRow): Seven {
  return [
    r.individuals,
    r.averageTaxableIncome,
    r.medianTaxableIncome,
    r.averageSalaryOrWages,
    r.medianSalaryOrWages,
    r.averageTotalIncome,
    r.medianTotalIncome,
  ];
}

function expectRows(rows: readonly AtoRow[], expected: [string, Seven][]) {
  assert.equal(rows.length, expected.length);
  expected.forEach(([label, values], i) => {
    assert.equal(rows[i].label, label);
    assert.deepEqual(seven(rows[i]), values, label);
  });
}

// ---------------------------------------------------------------------------
// ATO Taxation statistics 2023–24, Individuals Table 15 (data.gov.au).
// ---------------------------------------------------------------------------

test("ATO income year is 2023–24", () => {
  assert.equal(ATO_INCOME_YEAR, "2023–24");
});

test("Table 15A by occupation and sex, verbatim", () => {
  expectRows(ATO_15A.dentist, [
    ["Total", [8_859, 162_722, 131_588, 108_448, 95_289, 174_021, 143_097]],
    ["Female", [4_858, 136_824, 117_693, 93_631, 81_727, 146_641, 126_073]],
    ["Male", [4_001, 194_166, 156_393, 126_704, 111_957, 207_267, 168_565]],
  ]);
  expectRows(ATO_15A.radiologist, [
    ["Total", [2_525, 500_262, 430_250, 383_218, 271_780, 525_048, 451_335]],
    ["Female", [998, 327_963, 209_418, 255_044, 146_504, 344_837, 226_917]],
    ["Male", [1_527, 612_871, 567_330, 467_867, 390_965, 642_828, 595_209]],
  ]);
  expectRows(ATO_15A.anaesthetist, [
    ["Total", [3_735, 475_455, 457_287, 269_923, 235_037, 494_998, 479_642]],
    ["Female", [1_380, 386_868, 368_375, 238_465, 216_977, 406_431, 386_248]],
    ["Male", [2_355, 527_366, 516_292, 288_600, 248_966, 546_897, 534_374]],
  ]);
  expectRows(ATO_15A.optometrist, [
    ["Total", [5_540, 107_824, 100_818, 86_992, 92_133, 114_240, 105_993]],
    ["Female", [3_426, 98_911, 94_689, 82_211, 87_058, 104_431, 99_461]],
    ["Male", [2_114, 122_270, 109_838, 94_773, 100_551, 130_139, 116_655]],
  ]);
  expectRows(ATO_15A.gp, [
    ["Total", [27_776, 196_060, 156_733, 145_370, 122_319, 207_790, 168_497]],
    ["Female", [14_191, 169_131, 139_401, 129_322, 112_830, 180_323, 150_953]],
    ["Male", [13_585, 224_191, 176_809, 162_301, 137_500, 236_483, 187_869]],
  ]);
  assert.deepEqual(seven(ATO_15A.dentalSpecialist), [1_045, 265_110, 154_164, 126_764, 89_440, 278_961, 167_165]);
  assert.deepEqual(seven(ATO_15A.radiationOncologist), [614, 412_937, 347_443, 294_812, 172_875, 433_207, 360_396]);
  assert.deepEqual(seven(ATO_15A.orthoptist), [1_068, 76_095, 73_881, 70_736, 72_732, 79_634, 77_095]);
  assert.deepEqual(seven(ATO_15A.residentMedicalOfficer), [21_380, 140_129, 123_992, 129_927, 122_625, 149_588, 133_824]);
});

test("Table 15A surgical specialties, verbatim", () => {
  expectRows(ATO_15A.surgicalSpecialties, [
    ["Surgeon (general)", [1_900, 438_505, 335_144, 239_669, 208_000, 460_978, 356_883]],
    ["Cardiothoracic surgeon", [143, 607_511, 425_275, 337_953, 274_213, 630_688, 442_349]],
    ["Neurosurgeon", [176, 678_611, 537_049, 258_504, 216_904, 705_327, 567_926]],
    ["Orthopaedic surgeon", [981, 554_839, 434_435, 228_289, 183_864, 583_064, 456_699]],
    ["Otorhinolaryngologist (ENT surgeon)", [133, 631_559, 539_017, 213_933, 165_438, 668_856, 558_116]],
    ["Paediatric surgeon", [109, 386_014, 328_980, 276_946, 242_442, 404_022, 347_066]],
    ["Plastic and reconstructive surgeon", [352, 660_492, 525_793, 216_342, 171_845, 686_038, 548_165]],
    ["Urologist", [340, 586_462, 526_801, 206_390, 165_648, 621_021, 550_156]],
    ["Vascular surgeon", [146, 574_393, 504_690, 285_106, 239_809, 596_891, 526_029]],
  ]);
  // The nine specialties are the whole of unit group 2535.
  const people = ATO_15A.surgicalSpecialties.reduce((s, r) => s + r.individuals, 0);
  assert.equal(people, ATO_15B.surgeon[0].individuals);
});

test("Table 15B unit groups, verbatim, and the ATO release's surgeon figure", () => {
  expectRows(ATO_15B.surgeon, [
    ["Total", [4_280, 519_998, 403_069, 238_223, 200_000, 545_548, 427_081]],
    ["Female", [912, 338_220, 255_879, 203_492, 182_675, 358_950, 279_842]],
    ["Male", [3_368, 569_221, 463_301, 247_739, 206_385, 596_076, 487_555]],
  ]);
  // Media release, 17 June 2026: "4,280 individuals reporting an average taxable income of $519,998".
  assert.equal(ATO_15B.surgeon[0].individuals, 4_280);
  assert.equal(ATO_15B.surgeon[0].averageTaxableIncome, 519_998);
  assert.deepEqual(seven(ATO_15B.dentalPractitioner), [9_904, 173_525, 133_248, 110_386, 94_643, 185_094, 144_637]);
  assert.deepEqual(seven(ATO_15B.optometristOrOrthoptist), [6_608, 102_696, 94_689, 84_345, 87_688, 108_647, 99_823]);
  assert.deepEqual(seven(ATO_15B.generalMedicalPractitioner), [49_156, 171_734, 138_205, 138_539, 122_497, 182_476, 149_282]);
  assert.deepEqual(seven(ATO_15B.otherMedicalPractitioners), [32_087, 277_728, 179_192, 202_843, 151_270, 293_872, 193_188]);
  // Unit groups are the sum of their occupations.
  assert.equal(ATO_15A.dentist[0].individuals + ATO_15A.dentalSpecialist.individuals, ATO_15B.dentalPractitioner.individuals);
  assert.equal(ATO_15A.optometrist[0].individuals + ATO_15A.orthoptist.individuals, ATO_15B.optometristOrOrthoptist.individuals);
  assert.equal(ATO_15A.gp[0].individuals + ATO_15A.residentMedicalOfficer.individuals, ATO_15B.generalMedicalPractitioner.individuals);
});

test("Table 15D by state, verbatim (overseas rows left out)", () => {
  expectRows(ATO_15D.dentalPractitioner, [
    ["NSW", [2_930, 174_487, 135_288, 114_395, 100_000, 185_681, 145_971]],
    ["VIC", [2_389, 159_963, 119_285, 89_190, 72_365, 171_506, 129_021]],
    ["QLD", [2_394, 181_632, 138_994, 121_115, 107_770, 192_880, 148_658]],
    ["WA", [1_022, 177_131, 139_727, 106_488, 84_351, 190_049, 154_084]],
    ["SA", [681, 162_493, 141_788, 113_090, 97_808, 175_113, 151_290]],
    ["TAS", [179, 201_371, 162_637, 139_435, 129_999, 213_382, 173_974]],
    ["ACT", [217, 220_242, 169_121, 155_455, 122_500, 231_160, 174_155]],
    ["NT", [69, 195_788, 169_829, 136_200, 139_257, 207_825, 190_087]],
  ]);
  expectRows(ATO_15D.anaesthetist, [
    ["NSW", [724, 424_496, 385_733, 185_670, 157_661, 440_366, 397_370]],
    ["VIC", [1_075, 519_317, 517_732, 290_699, 265_616, 538_965, 532_359]],
    ["QLD", [836, 512_400, 501_644, 320_550, 311_480, 532_150, 522_675]],
    ["WA", [525, 461_954, 427_328, 274_683, 264_372, 487_925, 465_555]],
    ["SA", [306, 429_798, 426_448, 276_182, 250_628, 447_205, 444_626]],
    ["TAS", [132, 426_781, 438_159, 241_393, 226_406, 448_569, 457_867]],
    ["ACT", [66, 478_133, 423_470, 326_291, 243_237, 495_308, 429_733]],
    ["NT", [34, 469_876, 477_836, 220_999, 201_081, 490_468, 489_960]],
  ]);
  expectRows(ATO_15D.surgeon, [
    ["NSW", [951, 409_785, 272_842, 203_083, 180_346, 430_084, 291_978]],
    ["VIC", [1_368, 526_742, 412_684, 217_555, 189_235, 553_604, 433_082]],
    ["QLD", [915, 567_453, 492_536, 285_145, 223_504, 597_206, 517_718]],
    ["WA", [449, 609_719, 477_728, 274_917, 224_750, 636_690, 508_764]],
    ["SA", [360, 519_666, 427_674, 223_129, 205_765, 539_526, 446_499]],
    ["TAS", [94, 723_047, 592_445, 285_660, 223_986, 759_223, 608_352]],
    ["ACT", [73, 587_796, 430_034, 331_323, 271_457, 610_917, 462_143]],
    ["NT", [33, 574_020, 447_906, 244_396, 245_407, 618_972, 483_588]],
  ]);
  expectRows(ATO_15D.optometristOrOrthoptist, [
    ["NSW", [2_185, 102_356, 92_063, 82_643, 85_036, 108_210, 96_772]],
    ["VIC", [1_954, 93_214, 86_418, 79_351, 81_078, 98_910, 91_658]],
    ["QLD", [1_264, 107_810, 102_860, 89_803, 92_643, 114_009, 108_147]],
    ["WA", [503, 116_272, 109_460, 88_792, 94_544, 122_828, 116_680]],
    ["SA", [430, 109_869, 104_021, 91_713, 98_766, 115_855, 108_343]],
    ["TAS", [108, 109_888, 105_468, 88_590, 95_159, 116_995, 110_845]],
    ["ACT", [112, 120_671, 104_349, 88_010, 94_137, 126_684, 110_041]],
    ["NT", [39, 127_037, 120_615, 104_477, 106_349, 133_002, 134_747]],
  ]);
  // States plus the omitted overseas lodgers (23, 37, 37, 13) make the unit-group totals.
  const sum = (rows: readonly AtoRow[]) => rows.reduce((s, r) => s + r.individuals, 0);
  assert.equal(sum(ATO_15D.dentalPractitioner) + 23, ATO_15B.dentalPractitioner.individuals);
  assert.equal(sum(ATO_15D.anaesthetist) + 37, ATO_15A.anaesthetist[0].individuals);
  assert.equal(sum(ATO_15D.surgeon) + 37, ATO_15B.surgeon[0].individuals);
  assert.equal(sum(ATO_15D.optometristOrOrthoptist) + 13, ATO_15B.optometristOrOrthoptist.individuals);
});

test("female and male rows add up to the total (the ATO counts unknown sex as male)", () => {
  for (const rows of [ATO_15A.dentist, ATO_15A.radiologist, ATO_15A.anaesthetist, ATO_15A.optometrist, ATO_15A.gp, ATO_15B.surgeon]) {
    assert.equal(rows[1].individuals + rows[2].individuals, rows[0].individuals, rows[0].label);
  }
});

// ---------------------------------------------------------------------------
// Jobs and Skills Australia (ABS SEEH May 2025), awards, state schedules.
// ---------------------------------------------------------------------------

test("Jobs and Skills Australia medians, verbatim", () => {
  const jsa = (slug: (typeof HEALTH_SALARY_SLUGS)[number]) => getHealthSalaryPage(slug).jsa;
  const expected: [(typeof HEALTH_SALARY_SLUGS)[number], string, number, number, number, number][] = [
    ["dentist", "2523", 3_232, 85, 0.6, 42],
    ["radiologist", "2539", 5_013, 101, 0.77, 46],
    ["anaesthetist", "2532", 8_293, 218, 0.9, 46],
    ["gp", "2531", 2_446, 60, 0.77, 45],
    ["surgeon", "2535", 3_905, 80, 0.93, 54],
  ];
  for (const [slug, code, weekly, hourly, ft, hours] of expected) {
    const j = jsa(slug);
    assert.ok(j, slug);
    assert.deepEqual([j.anzscoCode, j.medianWeekly, j.medianHourly, j.fullTimeShare, j.averageFullTimeHours], [code, weekly, hourly, ft, hours], slug);
    assert.match(j.url, new RegExp(`/occupations-anzsco/${code}-`));
  }
  // JSA publishes N/A for 2514 Optometrists and Orthoptists: no median on that page.
  assert.equal(jsa("optometrist"), null);
  // The GP page's median is the same JSA figure the doctor award page uses.
  assert.equal(getOccupation("doctor")!.median!.medianWeekly, jsa("gp")!.medianWeekly);
});

test("Medical Practitioners Award figures, verbatim (cl 16.1(c), (g), (h))", () => {
  assert.equal(AWARD_SPECIALIST_MINIMUM, 121_535);
  assert.deepEqual(AWARD_REGISTRAR_RANGE, { low: 80_248, high: 90_018 });
  assert.deepEqual(
    COMMUNITY_MEDICAL_PRACTITIONER.map((r) => [r.annual, r.weekly, r.hourly]),
    [
      [105_932, 2_037.15, 53.61],
      [109_803, 2_111.6, 55.57],
      [113_348, 2_179.77, 57.36],
      [116_183, 2_234.29, 58.8],
      [119_833, 2_304.48, 60.64],
      [123_617, 2_377.25, 62.56],
      [127_752, 2_456.77, 64.65],
      [131_623, 2_531.21, 66.61],
    ],
  );
  for (const r of COMMUNITY_MEDICAL_PRACTITIONER) {
    assert.ok(Math.abs(r.annual - r.weekly * 52) < 1, `${r.label}: annual vs weekly x 52`);
    assert.ok(Math.abs(Math.round((r.weekly / 38) * 100) - Math.round(r.hourly * 100)) <= 1, `${r.label}: hourly vs weekly / 38`);
  }
  // The doctor page carries the same specialist and registrar minimums.
  const doctorRows = getOccupation("doctor")!.tables.flatMap((t) => t.rows);
  assert.equal(doctorRows.find((r) => r.label === "Specialist")!.annual, AWARD_SPECIALIST_MINIMUM);
  assert.equal(doctorRows.find((r) => r.label === "Registrar pay point 1")!.annual, AWARD_REGISTRAR_RANGE.low);
  assert.equal(doctorRows.find((r) => r.label === "Registrar pay point 4")!.annual, AWARD_REGISTRAR_RANGE.high);
});

test("NSW staff specialist rates, IB2026_006 from July 2025", () => {
  const nsw = STAFF_SPECIALIST_SCALES.find((s) => s.state === "NSW")!;
  assert.deepEqual(
    nsw.steps.map((s) => [s.annual, s.withAllowance]),
    [
      [197_583, 231_962],
      [209_137, 245_527],
      [220_686, 259_085],
      [232_267, 272_681],
      [243_822, 286_247],
      [266_942, 313_390],
    ],
  );
  // Attachment B prints the award rate + 17.4% special allowance; check it is that sum.
  for (const s of nsw.steps) assert.ok(Math.abs(s.annual * 1.174 - s.withAllowance!) <= 1, s.label);
});

test("Victorian specialist rates, AE517968 Appendix 2 Table 1.1 from March 2025", () => {
  assert.deepEqual(
    VIC_WEEKLY.map(([, w]) => w),
    [5_040.37, 5_377.83, 5_586.72, 5_805.54, 6_031.48, 6_266.71, 6_389.99, 6_767.82, 6_930.61],
  );
  const vic = STAFF_SPECIALIST_SCALES.find((s) => s.state === "VIC")!;
  assert.deepEqual(
    vic.steps.map((s) => s.annual),
    [262_099, 279_647, 290_509, 301_888, 313_637, 325_869, 332_279, 351_927, 360_392],
  );
});

test("Queensland staff specialist rates, MOCA7 Schedule 1 from 1 July 2026", () => {
  const qld = STAFF_SPECIALIST_SCALES.find((s) => s.state === "QLD")!;
  assert.deepEqual(qld.steps.map((s) => s.annual), [222_059, 228_007, 234_835, 239_901]);
  assert.match(qld.note, /50% of base salary/);
});

test("staff specialist scales only rise, and every scale cites an official https source", () => {
  for (const scale of STAFF_SPECIALIST_SCALES) {
    for (let i = 1; i < scale.steps.length; i++) assert.ok(scale.steps[i].annual > scale.steps[i - 1].annual, scale.state);
    assert.match(scale.url, /^https:\/\/(www1\.health\.nsw\.gov\.au|westernhealth\.org\.au|www\.qirc\.qld\.gov\.au)\//);
  }
});

test("public hospital salary packaging uses the site's FBT cap constants", () => {
  assert.equal(HOSPITAL_PACKAGING.grossedUpCap, 17_000);
  assert.equal(HOSPITAL_PACKAGING.faceValue, 9_010);
});

// ---------------------------------------------------------------------------
// Take-home figures come from the site's tax engine.
// ---------------------------------------------------------------------------

test("take-home is the site's tax engine on the same figure", () => {
  for (const page of HEALTH_SALARY_PAGES) {
    for (const s of page.scenarios) {
      const t = takeHome(s.gross);
      const b = calculatePayBreakdown({ grossSalary: s.gross, includeHECS: false, hasPrivateHealth: true });
      assert.equal(t.net, b.takeHomePay, `${page.slug} ${s.label}`);
      assert.equal(t.tax + t.medicare, s.gross - t.net, `${page.slug} ${s.label}`);
      assert.ok(t.net > s.gross * 0.5 && t.net < s.gross, `${page.slug} ${s.label}`);
      assert.ok(t.help > 0, `${page.slug} ${s.label}: every figure here is above the HELP threshold`);
    }
  }
});

test("scenarios quote the published figures they name", () => {
  for (const page of HEALTH_SALARY_PAGES) {
    const byLabel = Object.fromEntries(page.scenarios.map((s) => [s.label, s.gross]));
    assert.equal(byLabel["Median taxable income"], page.ato.medianTaxableIncome, page.slug);
    assert.equal(byLabel["Average taxable income"], page.ato.averageTaxableIncome, page.slug);
    assert.equal(byLabel["Median salary or wages"], page.ato.medianSalaryOrWages, page.slug);
    if (byLabel["Full-time employee median"] !== undefined) {
      assert.equal(byLabel["Full-time employee median"], page.jsa!.medianWeekly * 52, page.slug);
    }
    if (page.staffSpecialist) assert.equal(byLabel["NSW staff specialist, year 1"], 231_962, page.slug);
  }
  assert.equal(getHealthSalaryPage("gp").scenarios[0].gross, 105_932);
});

test("take-home links land on a published take-home page", () => {
  assert.deepEqual(takeHomePageFor(131_588), { amount: 130_000, href: "/take-home-pay-on/130000/" });
  assert.deepEqual(takeHomePageFor(457_287), { amount: 500_000, href: "/take-home-pay-on/500000/" });
});

// ---------------------------------------------------------------------------
// Page plumbing: registry, metadata, uniqueness and links.
// ---------------------------------------------------------------------------

test("registry: six slugs, none shared with the award occupation route", () => {
  assert.deepEqual([...HEALTH_SALARY_SLUGS], ["dentist", "radiologist", "anaesthetist", "optometrist", "gp", "surgeon"]);
  for (const slug of HEALTH_SALARY_SLUGS) {
    assert.ok(isHealthSalarySlug(slug));
    assert.equal(getHealthSalaryPage(slug).slug, slug);
    assert.ok(!(OCCUPATION_SLUGS as readonly string[]).includes(slug), `${slug} would clash with /job-pay-rates/[occupation]/`);
  }
  assert.equal(isHealthSalarySlug("doctor"), false);
});

test("each page leads with its own ATO occupation", () => {
  assert.equal(getHealthSalaryPage("dentist").ato, ATO_15A.dentist[0]);
  assert.equal(getHealthSalaryPage("radiologist").ato, ATO_15A.radiologist[0]);
  assert.equal(getHealthSalaryPage("anaesthetist").ato, ATO_15A.anaesthetist[0]);
  assert.equal(getHealthSalaryPage("optometrist").ato, ATO_15A.optometrist[0]);
  assert.equal(getHealthSalaryPage("gp").ato, ATO_15A.gp[0]);
  assert.equal(getHealthSalaryPage("surgeon").ato, ATO_15B.surgeon[0]);
});

test("titles and descriptions fit, and the title states the ATO average", () => {
  for (const p of HEALTH_SALARY_PAGES) {
    assert.ok(p.metaTitle.length <= 65, `${p.slug} title ${p.metaTitle.length}`);
    assert.ok(p.metaDescription.length <= 165, `${p.slug} description ${p.metaDescription.length}`);
    assert.ok(p.metaTitle.includes(`$${p.ato.averageTaxableIncome.toLocaleString("en-AU")}`), p.slug);
    assert.match(p.metaTitle, /Salary Australia 2026/);
  }
});

test("pages are substantively unique: no shared heading, FAQ, coverage paragraph or ATO table", () => {
  const seen = new Map<string, string>();
  const once = (key: string, slug: string) => {
    assert.ok(!seen.has(key), `"${key.slice(0, 60)}…" on ${slug} and ${seen.get(key)}`);
    seen.set(key, slug);
  };
  for (const p of HEALTH_SALARY_PAGES) {
    once(p.heading, p.slug);
    once(p.metaDescription, p.slug);
    for (const f of p.faqs) {
      once(f.q, p.slug);
      once(f.a, p.slug);
    }
    for (const c of p.coverage) once(c, p.slug);
    for (const t of p.atoTables) once(JSON.stringify(t.rows), p.slug);
  }
});

test("every page has FAQs, sources, notices and related links in the site's format", () => {
  for (const p of HEALTH_SALARY_PAGES) {
    assert.ok(p.faqs.length >= 5, `${p.slug} faqs`);
    assert.ok(p.sources.length >= 3, `${p.slug} sources`);
    for (const s of p.sources) assert.match(s.url, /^https:\/\//, `${p.slug} ${s.title}`);
    assert.ok(p.sources.some((s) => s.url.includes("data.gov.au")), `${p.slug} cites ATO Table 15`);
    for (const r of p.related) assert.match(r.href, /^\/.*\/$/, `${p.slug} ${r.href}`);
    assert.match(p.verifiedOn, /^\d{1,2} [A-Z][a-z]+ \d{4}$/);
    assert.match(p.dateModified, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test("doctor links down to the medical pages, and they link up to doctor", () => {
  const doctorRelated = getOccupation("doctor")!.related.map((r) => r.href);
  for (const slug of ["radiologist", "anaesthetist", "surgeon", "gp"] as const) {
    assert.ok(doctorRelated.includes(`/job-pay-rates/${slug}/`), `doctor -> ${slug}`);
    assert.equal(getHealthSalaryPage(slug).upLink.href, "/job-pay-rates/doctor/", `${slug} -> doctor`);
  }
});

test("salary packaging is only discussed on public hospital (staff specialist) pages", () => {
  for (const p of HEALTH_SALARY_PAGES) {
    const text = JSON.stringify([p.coverage, p.payslip, p.faqs, p.notices]);
    if (!p.staffSpecialist) assert.ok(!/packag/i.test(text), `${p.slug} mentions salary packaging`);
  }
});
