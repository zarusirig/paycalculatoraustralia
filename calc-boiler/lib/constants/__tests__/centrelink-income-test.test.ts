// =============================================================================
// Centrelink income test tests.
//
// Run with: npm test
//
// Every published cut-off on Services Australia is a consequence of a maximum
// rate and a taper. These tests pin the tapers at their boundaries and then
// reconcile each cut-off back to the "typical total" rate, so a figure that has
// drifted from the source fails here rather than on the page.
//
// The file now carries TWO dated rate sets (20 March 2026, in force to 19 Sep
// 2026; 20 September 2026, from the DSS rates list). So the tests also cover:
//   - the ratesOnDate selector at the changeover boundary,
//   - coupleCombined === 2 × coupleEach in both sets,
//   - every DERIVED September cut-off reconciling to its rate and taper —
//     using the same arithmetic that reproduces the PUBLISHED March cut-offs,
//   - that the income tests, the Work Bonus and the student payments (which
//     index on 1 January) were left alone by the September indexation.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  AGE_PENSION,
  AGE_PENSION_INCOME_TEST,
  AGE_PENSION_RATES,
  AUSTUDY,
  CENTRELINK_SOURCES,
  DEFAULT_RATE_SET_KEY,
  JOBSEEKER,
  JOBSEEKER_INCOME_TEST,
  JOBSEEKER_RATES,
  MARCH_2026,
  RATE_SET_KEYS,
  SEPTEMBER_2026,
  WORK_BONUS,
  YOUTH_ALLOWANCE_STUDENT,
  agePensionCutOff,
  agePensionFortnightly,
  agePensionRatesOnDate,
  assessableAfterWorkBonus,
  jobseekerCutOff,
  jobseekerFortnightly,
  jobseekerRatesOnDate,
  jobseekerReduction,
  pensionReduction,
  rateSetKeyOnDate,
  ratesOnDate,
  studentFortnightly,
  studentReduction,
} from "../centrelink-income-test";

const r2 = (n: number) => Math.round(n * 100) / 100;
const MAR = JOBSEEKER_RATES[MARCH_2026];
const SEP = JOBSEEKER_RATES[SEPTEMBER_2026];
const MAR_P = AGE_PENSION_RATES[MARCH_2026];
const SEP_P = AGE_PENSION_RATES[SEPTEMBER_2026];

// ---------------------------------------------------------------------------
// The dated-set machinery
// ---------------------------------------------------------------------------

test("ratesOnDate picks the set in force, switching on 20 September 2026", () => {
  // The day before the changeover: still the March rates.
  assert.equal(rateSetKeyOnDate("2026-09-19"), MARCH_2026);
  assert.equal(ratesOnDate("2026-09-19").jobseeker.maxFortnightly.single, 808.70);
  assert.equal(ratesOnDate("2026-09-19").agePension.maxFortnightly.single.total, 1_200.90);

  // The changeover day itself: the September rates.
  assert.equal(rateSetKeyOnDate("2026-09-20"), SEPTEMBER_2026);
  assert.equal(ratesOnDate("2026-09-20").jobseeker.maxFortnightly.single, 824.90);
  assert.equal(ratesOnDate("2026-09-20").agePension.maxFortnightly.single.total, 1_237.70);

  // Today (28 Aug 2026) and any other day inside the March window.
  assert.equal(rateSetKeyOnDate("2026-08-28"), MARCH_2026);
  assert.equal(rateSetKeyOnDate("2026-03-20"), MARCH_2026);
  assert.equal(rateSetKeyOnDate("2026-12-31"), SEPTEMBER_2026);

  // Before the earliest set we carry: fall back to it rather than throw.
  assert.equal(rateSetKeyOnDate("2026-03-19"), MARCH_2026);
  assert.equal(rateSetKeyOnDate("2025-07-01"), MARCH_2026);

  // Date objects work the same way, on the local calendar day.
  assert.equal(rateSetKeyOnDate(new Date(2026, 8, 19)), MARCH_2026);
  assert.equal(rateSetKeyOnDate(new Date(2026, 8, 20)), SEPTEMBER_2026);

  assert.deepEqual(jobseekerRatesOnDate("2026-09-20"), SEP);
  assert.deepEqual(agePensionRatesOnDate("2026-09-19"), MAR_P);
});

test("the default (server-rendered) set is the one in force on the verified date", () => {
  assert.equal(CENTRELINK_SOURCES.verifiedOn, "28 August 2026");
  assert.equal(DEFAULT_RATE_SET_KEY, rateSetKeyOnDate(CENTRELINK_SOURCES.verifiedOnISO));
  assert.equal(DEFAULT_RATE_SET_KEY, MARCH_2026);
  // The back-compatible aliases follow the default set, not the clock.
  assert.equal(JOBSEEKER.maxFortnightly.single, MAR.maxFortnightly.single);
  assert.equal(JOBSEEKER.ratesFrom, "20 March 2026");
  assert.equal(AGE_PENSION.maxFortnightly.single.total, MAR_P.maxFortnightly.single.total);
  assert.equal(AGE_PENSION.ratesFrom, "20 March 2026");
  assert.deepEqual([...RATE_SET_KEYS], ["2026-03-20", "2026-09-20"]);
});

test("March cut-offs are published, September cut-offs are labelled derived", () => {
  assert.equal(MAR.cutOffSource, "published");
  assert.equal(MAR_P.cutOffSource, "published");
  assert.equal(SEP.cutOffSource, "derived");
  assert.equal(SEP_P.cutOffSource, "derived");
});

// ---------------------------------------------------------------------------
// JobSeeker
// ---------------------------------------------------------------------------

test("JobSeeker taper: $0 to $150 free, 50c to $256, 60c above — unchanged in September", () => {
  assert.equal(JOBSEEKER_INCOME_TEST.freeArea, 150);
  assert.equal(JOBSEEKER_INCOME_TEST.band1End, 256);
  assert.equal(JOBSEEKER_INCOME_TEST.taper1, 0.5);
  assert.equal(JOBSEEKER_INCOME_TEST.taper2, 0.6);
  assert.equal(JOBSEEKER_INCOME_TEST.principalCarerTaper, 0.4);
  assert.equal(JOBSEEKER_INCOME_TEST.workingCreditThreshold, 48);
  assert.equal(jobseekerReduction(150), 0);
  assert.equal(jobseekerReduction(256), 53);
  assert.equal(r2(jobseekerReduction(600)), 259.4);
  // principal carer: 40c over $150
  assert.equal(jobseekerReduction(600, true), 180);
});

test("JobSeeker single, no children: $600 earned keeps $549.30 of $808.70, $565.50 from 20 Sep", () => {
  assert.equal(r2(jobseekerFortnightly(MAR.maxFortnightly.single, 600)), r2(808.7 - 259.4));
  assert.equal(r2(jobseekerFortnightly(SEP.maxFortnightly.single, 600)), r2(824.9 - 259.4));
  // The September increase flows straight through: same test, $16.20 more.
  assert.equal(
    r2(jobseekerFortnightly(SEP.maxFortnightly.single, 600) - jobseekerFortnightly(MAR.maxFortnightly.single, 600)),
    16.2,
  );
});

test("JobSeeker partner income reduces by 60c over the partner limit, in both sets", () => {
  for (const set of [MAR, SEP]) {
    const limit = set.partnerIncomeLimit.partner22ToPensionAge;
    const p = jobseekerFortnightly(set.maxFortnightly.partnered, 0, false, limit + 100, limit, set.partnerIncomeLimit.taper);
    assert.equal(r2(p), r2(set.maxFortnightly.partnered - 60));
  }
  // Only the 22-to-pension-age limit moved on 20 September 2026.
  assert.equal(MAR.partnerIncomeLimit.partner22ToPensionAge, 1_415.00);
  assert.equal(SEP.partnerIncomeLimit.partner22ToPensionAge, 1_440.00);
  assert.equal(SEP.partnerIncomeLimit.partnerUnder22NoChildren, MAR.partnerIncomeLimit.partnerUnder22NoChildren);
  assert.equal(SEP.partnerIncomeLimit.partnerUnder22WithChildren, MAR.partnerIncomeLimit.partnerUnder22WithChildren);
  assert.equal(SEP.partnerIncomeLimit.taper, 0.6);
});

test("JobSeeker typical totals are the basic rate plus supplements that do not index", () => {
  // Energy Supplement and Pharmaceutical Allowance are flat, so the gap between
  // the basic rate and the typical total must be identical in both sets.
  const keys = ["single", "singleWithChildren", "principalCarer", "singleOver55LongTerm", "partialCapacity", "partnered", "principalCarerExempt"] as const;
  const basicFor = (set: typeof MAR, k: (typeof keys)[number]) =>
    k === "principalCarer" ? set.maxFortnightly.singleWithChildren : set.maxFortnightly[k];
  for (const k of keys) {
    const marGap = r2(MAR.typicalTotal[k] - basicFor(MAR, k));
    const sepGap = r2(SEP.typicalTotal[k] - basicFor(SEP, k));
    assert.equal(sepGap, marGap, `supplement for ${k} should not index: ${marGap} vs ${sepGap}`);
    assert.ok(marGap >= 0 && marGap < 20, `implied supplements ${marGap} out of range for ${k}`);
  }
  assert.equal(r2(MAR.typicalTotal.single - MAR.maxFortnightly.single), 8.80); // Energy Supplement
  assert.equal(r2(MAR.typicalTotal.principalCarer - MAR.maxFortnightly.singleWithChildren), 16.50); // $9.50 + $7.00
});

test("the principal-carer-exempt rate is Parenting Payment Single basic + Pension Supplement basic", () => {
  // 20 Mar 2026: $1,017.20 + $30.10. 20 Sep 2026: $1,037.50 + $30.70 (DSS list).
  assert.equal(r2(1_017.20 + 30.10), MAR.maxFortnightly.principalCarerExempt);
  assert.equal(r2(1_037.50 + 30.70), SEP.maxFortnightly.principalCarerExempt);
  assert.equal(SEP.maxFortnightly.principalCarerExempt, 1_068.20);
});

test("published March JobSeeker cut-offs reconcile to the typical total and the taper", () => {
  const exact: [number, number, boolean][] = [
    [MAR.typicalTotal.single, MAR.publishedCutOff.single, false],
    [MAR.typicalTotal.singleOver55LongTerm, MAR.publishedCutOff.singleOver55LongTerm, false],
    [MAR.typicalTotal.partialCapacity, MAR.publishedCutOff.partialCapacity, false],
    [MAR.typicalTotal.principalCarer, MAR.publishedCutOff.principalCarer, true],
    [MAR.typicalTotal.principalCarerExempt, MAR.publishedCutOff.principalCarerExempt, true],
  ];
  for (const [rate, cut, carer] of exact) {
    assert.equal(jobseekerCutOff(rate, carer), cut, `cut-off for rate ${rate}`);
  }
  // Services Australia rounds this one UP to the next cent ($1,626.8333 is
  // published as $1,626.84), so allow a cent either way on this row alone.
  const withChild = jobseekerCutOff(MAR.typicalTotal.singleWithChildren);
  assert.ok(Math.abs(withChild - MAR.publishedCutOff.singleWithChildNotCarer) <= 0.01,
    `single-with-child cut-off ${withChild} vs published ${MAR.publishedCutOff.singleWithChildNotCarer}`);
});

test("every DERIVED September JobSeeker cut-off reconciles to its rate and taper", () => {
  assert.equal(jobseekerCutOff(SEP.typicalTotal.single), 1_557.17);
  assert.equal(jobseekerCutOff(SEP.typicalTotal.singleOver55LongTerm), 1_667.33);
  assert.equal(jobseekerCutOff(SEP.typicalTotal.partialCapacity), 1_667.33);
  assert.equal(jobseekerCutOff(SEP.typicalTotal.singleWithChildren), 1_655.67);
  assert.equal(jobseekerCutOff(SEP.typicalTotal.principalCarer, true), 2_399.50);
  assert.equal(jobseekerCutOff(SEP.typicalTotal.principalCarerExempt, true), 2_868.00);

  // …and those are exactly the figures stored in the file.
  assert.equal(SEP.publishedCutOff.single, jobseekerCutOff(SEP.typicalTotal.single));
  assert.equal(SEP.publishedCutOff.singleOver55LongTerm, jobseekerCutOff(SEP.typicalTotal.singleOver55LongTerm));
  assert.equal(SEP.publishedCutOff.partialCapacity, jobseekerCutOff(SEP.typicalTotal.partialCapacity));
  assert.equal(SEP.publishedCutOff.singleWithChildNotCarer, jobseekerCutOff(SEP.typicalTotal.singleWithChildren));
  assert.equal(SEP.publishedCutOff.principalCarer, jobseekerCutOff(SEP.typicalTotal.principalCarer, true));
  assert.equal(SEP.publishedCutOff.principalCarerExempt, jobseekerCutOff(SEP.typicalTotal.principalCarerExempt, true));

  // Every September cut-off must be above its March counterpart.
  for (const k of Object.keys(SEP.publishedCutOff) as (keyof typeof SEP.publishedCutOff)[]) {
    assert.ok(SEP.publishedCutOff[k] > MAR.publishedCutOff[k], `${k} should rise on 20 Sep`);
  }
});

test("every JobSeeker rate rises on 20 September 2026 by the DSS increase", () => {
  const increases: Record<keyof typeof MAR.maxFortnightly, number> = {
    single: 16.20,
    singleWithChildren: 17.30,
    singleOver55LongTerm: 17.30,
    partialCapacity: 17.30,
    partnered: 14.80,
    principalCarerExempt: 20.90,
  };
  for (const k of Object.keys(increases) as (keyof typeof increases)[]) {
    assert.equal(r2(SEP.maxFortnightly[k] - MAR.maxFortnightly[k]), increases[k], `${k} increase`);
  }
});

// ---------------------------------------------------------------------------
// Student payments — index on 1 January, untouched by the September indexation
// ---------------------------------------------------------------------------

test("student taper: free to $539, 50c to $646 ($53.50), 60c above", () => {
  assert.equal(studentReduction(539), 0);
  assert.equal(r2(studentReduction(646)), 53.5);
  assert.equal(r2(studentReduction(1_000)), r2(53.5 + 0.6 * 354));
});

test("published Austudy and Youth Allowance cut-offs reconcile to their max rates", () => {
  const cases: [number, number][] = [
    [AUSTUDY.maxFortnightly.singleNoChildren, AUSTUDY.publishedCutOff.singleOrCoupleNoChildren],
    [AUSTUDY.maxFortnightly.singleWithChildren, AUSTUDY.publishedCutOff.singleWithChildren],
    [YOUTH_ALLOWANCE_STUDENT.maxFortnightly.under18AtHome, YOUTH_ALLOWANCE_STUDENT.publishedCutOff.under18AtHome],
    [YOUTH_ALLOWANCE_STUDENT.maxFortnightly.over18AtHome, YOUTH_ALLOWANCE_STUDENT.publishedCutOff.over18AtHome],
    [YOUTH_ALLOWANCE_STUDENT.maxFortnightly.awayFromHome, YOUTH_ALLOWANCE_STUDENT.publishedCutOff.awayFromHome],
  ];
  for (const [rate, cut] of cases) {
    const es = studentReduction(cut) - rate;
    assert.ok(es >= 0 && es < 15, `implied energy supplement ${es.toFixed(2)} out of range for rate ${rate}`);
  }
  assert.equal(r2(studentFortnightly(AUSTUDY.maxFortnightly.singleNoChildren, 800)), r2(677.2 - (53.5 + 0.6 * 154)));
});

test("student payments still hold their 1 January 2026 rates — September did not touch them", () => {
  assert.equal(AUSTUDY.ratesFrom, "1 January 2026");
  assert.equal(AUSTUDY.indexedOn, "1 January");
  assert.equal(AUSTUDY.maxFortnightly.singleNoChildren, 677.20);
  assert.equal(AUSTUDY.maxFortnightly.singleWithChildren, 854.20);
  assert.equal(YOUTH_ALLOWANCE_STUDENT.ratesFrom, "1 January 2026");
  assert.equal(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.under18AtHome, 418.90);
  assert.equal(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.over18AtHome, 482.40);
  assert.equal(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.awayFromHome, 677.20);
});

// ---------------------------------------------------------------------------
// Age Pension
// ---------------------------------------------------------------------------

test("Age Pension free areas and tapers are unchanged on 20 September", () => {
  assert.equal(AGE_PENSION_INCOME_TEST.single.freeArea, 226);
  assert.equal(AGE_PENSION_INCOME_TEST.single.taper, 0.5);
  assert.equal(AGE_PENSION_INCOME_TEST.couple.freeArea, 396);
  assert.equal(AGE_PENSION_INCOME_TEST.couple.taper, 0.25);
  assert.equal(AGE_PENSION_INCOME_TEST.transitional.single.taper, 0.4);
  assert.equal(AGE_PENSION_INCOME_TEST.transitional.couple.taper, 0.2);
  assert.equal(pensionReduction(226, "single"), 0);
  assert.equal(pensionReduction(426, "single"), 100);
  // couple: each person's pension reduces 25c per combined dollar over $396
  assert.equal(pensionReduction(796, "couple"), 100);
});

test("Age Pension components add to the total, and couple combined is exactly 2x couple each", () => {
  for (const [label, set] of [["March", MAR_P], ["September", SEP_P]] as const) {
    for (const k of ["single", "coupleEach", "coupleCombined", "coupleApartIllHealth"] as const) {
      const c = set.maxFortnightly[k];
      assert.equal(r2(c.basic + c.supplement + c.energy), c.total, `${label} ${k} components should add to the total`);
    }
    const each = set.maxFortnightly.coupleEach;
    const combined = set.maxFortnightly.coupleCombined;
    assert.equal(r2(each.basic * 2), combined.basic, `${label} combined basic`);
    assert.equal(r2(each.supplement * 2), combined.supplement, `${label} combined supplement`);
    assert.equal(r2(each.energy * 2), combined.energy, `${label} combined energy`);
    assert.equal(r2(each.total * 2), combined.total, `${label} combined total`);
    // A couple living apart due to ill health each get the single rate.
    assert.deepEqual(set.maxFortnightly.coupleApartIllHealth, set.maxFortnightly.single, `${label} ill-health = single`);
  }
});

test("published March Age Pension cut-offs reconcile exactly", () => {
  assert.equal(agePensionCutOff(MAR_P.maxFortnightly.single.total, "single"), MAR_P.publishedCutOff.single);
  assert.equal(agePensionCutOff(MAR_P.maxFortnightly.coupleEach.total, "coupleCombined"), MAR_P.publishedCutOff.coupleCombined);
  assert.equal(agePensionCutOff(MAR_P.maxFortnightly.single.total, "coupleCombined"), MAR_P.publishedCutOff.coupleApartIllHealthCombined);
  assert.equal(agePensionCutOff(MAR_P.transitional.singleTotal, "transitionalSingle"), MAR_P.publishedCutOff.transitionalSingle);
  assert.equal(agePensionCutOff(MAR_P.transitional.partneredEachTotal, "transitionalCoupleCombined"), MAR_P.publishedCutOff.transitionalCoupleCombined);
  assert.equal(agePensionFortnightly(0, "single", MAR_P), MAR_P.maxFortnightly.single.total);
  assert.equal(agePensionFortnightly(MAR_P.publishedCutOff.single, "single", MAR_P), 0);
});

test("every DERIVED September Age Pension cut-off reconciles to its rate and taper", () => {
  assert.equal(agePensionCutOff(SEP_P.maxFortnightly.single.total, "single"), 2_701.40);
  assert.equal(agePensionCutOff(SEP_P.maxFortnightly.coupleEach.total, "coupleCombined"), 4_128.00);
  assert.equal(agePensionCutOff(SEP_P.maxFortnightly.single.total, "coupleCombined"), 5_346.80);
  assert.equal(agePensionCutOff(SEP_P.transitional.singleTotal, "transitionalSingle"), 2_718.50);
  assert.equal(agePensionCutOff(SEP_P.transitional.partneredEachTotal, "transitionalCoupleCombined"), 4_418.00);

  // …and those are exactly the figures stored in the file.
  assert.equal(SEP_P.publishedCutOff.single, agePensionCutOff(SEP_P.maxFortnightly.single.total, "single"));
  assert.equal(SEP_P.publishedCutOff.coupleCombined, agePensionCutOff(SEP_P.maxFortnightly.coupleEach.total, "coupleCombined"));
  assert.equal(SEP_P.publishedCutOff.coupleApartIllHealthCombined, agePensionCutOff(SEP_P.maxFortnightly.single.total, "coupleCombined"));
  assert.equal(SEP_P.publishedCutOff.transitionalSingle, agePensionCutOff(SEP_P.transitional.singleTotal, "transitionalSingle"));
  assert.equal(SEP_P.publishedCutOff.transitionalCoupleCombined, agePensionCutOff(SEP_P.transitional.partneredEachTotal, "transitionalCoupleCombined"));

  assert.equal(agePensionFortnightly(0, "single", SEP_P), 1_237.70);
  assert.equal(agePensionFortnightly(0, "couple", SEP_P), 933.00);
  assert.equal(agePensionFortnightly(SEP_P.publishedCutOff.single, "single", SEP_P), 0);
  assert.equal(agePensionFortnightly(SEP_P.publishedCutOff.coupleCombined, "couple", SEP_P), 0);

  for (const k of Object.keys(SEP_P.publishedCutOff) as (keyof typeof SEP_P.publishedCutOff)[]) {
    assert.ok(SEP_P.publishedCutOff[k] > MAR_P.publishedCutOff[k], `${k} should rise on 20 Sep`);
  }
});

test("Age Pension rates rise on 20 September 2026 by the DSS increases", () => {
  assert.equal(r2(SEP_P.maxFortnightly.single.basic - MAR_P.maxFortnightly.single.basic), 35.10);
  assert.equal(r2(SEP_P.maxFortnightly.single.total - MAR_P.maxFortnightly.single.total), 36.80);
  assert.equal(r2(SEP_P.maxFortnightly.coupleEach.basic - MAR_P.maxFortnightly.coupleEach.basic), 26.50);
  assert.equal(r2(SEP_P.maxFortnightly.coupleEach.total - MAR_P.maxFortnightly.coupleEach.total), 27.80);
  // The Energy Supplement is flat — it does not index.
  assert.equal(SEP_P.maxFortnightly.single.energy, MAR_P.maxFortnightly.single.energy);
  assert.equal(SEP_P.maxFortnightly.coupleEach.energy, MAR_P.maxFortnightly.coupleEach.energy);
  assert.equal(r2(SEP_P.transitional.singleTotal - MAR_P.transitional.singleTotal), 19.30);
  assert.equal(r2(SEP_P.transitional.partneredEachTotal - MAR_P.transitional.partneredEachTotal), 15.60);
});

test("agePensionFortnightly defaults to the verified-date set and honours an explicit one", () => {
  assert.equal(agePensionFortnightly(1_000, "single"), agePensionFortnightly(1_000, "single", MAR_P));
  assert.equal(agePensionFortnightly(1_000, "single", MAR_P), r2(1_200.90 - (1_000 - 226) * 0.5));
  assert.equal(agePensionFortnightly(1_000, "single", SEP_P), r2(1_237.70 - (1_000 - 226) * 0.5));
});

// ---------------------------------------------------------------------------
// Work Bonus — not in the September rates list
// ---------------------------------------------------------------------------

test("Work Bonus offsets the first $300 of employment income, then the balance", () => {
  assert.equal(WORK_BONUS.fortnightlyCredit, 300);
  assert.equal(WORK_BONUS.maxBalance, 11_800);
  assert.equal(assessableAfterWorkBonus(250, 0), 0);
  assert.equal(assessableAfterWorkBonus(1_000, 0), 700);
  assert.equal(assessableAfterWorkBonus(1_000, 500), 200);
  assert.equal(assessableAfterWorkBonus(1_000, WORK_BONUS.maxBalance), 0);
});
