// =============================================================================
// Centrelink income test tests.
//
// Run with: npm test
//
// Every published cut-off on Services Australia is a consequence of a maximum
// rate and a taper. These tests pin the tapers at their boundaries and then
// reconcile each published cut-off back to the maximum rate, so a figure that
// has drifted from the source fails here rather than on the page. The
// JobSeeker / student cut-offs include an Energy Supplement the rates page
// does not list; the tests recover it and check it is a small, plausible
// amount, while the Age Pension cut-offs reconcile to the cent.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  AGE_PENSION,
  AUSTUDY,
  JOBSEEKER,
  WORK_BONUS,
  YOUTH_ALLOWANCE_STUDENT,
  agePensionFortnightly,
  assessableAfterWorkBonus,
  jobseekerFortnightly,
  jobseekerReduction,
  pensionReduction,
  studentFortnightly,
  studentReduction,
} from "../centrelink-income-test";

const r2 = (n: number) => Math.round(n * 100) / 100;

test("JobSeeker taper: $0 to $150 free, 50c to $256, 60c above", () => {
  assert.equal(jobseekerReduction(150), 0);
  assert.equal(jobseekerReduction(256), 53);
  assert.equal(r2(jobseekerReduction(600)), 259.4);
  // principal carer: 40c over $150
  assert.equal(jobseekerReduction(600, true), 180);
});

test("JobSeeker single, no children: $600 earned keeps $549.30 of $808.70", () => {
  const p = jobseekerFortnightly(JOBSEEKER.maxFortnightly.single, 600);
  assert.equal(r2(p), r2(808.7 - 259.4));
});

test("JobSeeker partner income reduces by 60c over the partner limit", () => {
  const limit = JOBSEEKER.partnerIncomeLimit.partner22ToPensionAge;
  const p = jobseekerFortnightly(JOBSEEKER.maxFortnightly.partnered, 0, false, limit + 100, limit);
  assert.equal(r2(p), r2(740.3 - 60));
});

test("published JobSeeker cut-offs reconcile to max rate + a small energy supplement", () => {
  // cut-off − income at which (rate + ES) reaches zero ⇒ ES = 0.6·(cutoff − 256) + 53 − rate
  const cases: [number, number][] = [
    [JOBSEEKER.maxFortnightly.single, JOBSEEKER.publishedCutOff.single],
    [JOBSEEKER.maxFortnightly.singleOver55LongTerm, JOBSEEKER.publishedCutOff.singleOver55LongTerm],
  ];
  // Single: $8.80 Energy Supplement. 55+ long-term: $8.80 plus the $7.70
  // Pharmaceutical Allowance — the page says the cut-off "may be higher if
  // you get the Pharmaceutical Allowance". Both recover from the figures.
  for (const [rate, cut] of cases) {
    const supplements = jobseekerReduction(cut) - rate;
    assert.ok(supplements > 0 && supplements < 20, `implied supplements ${supplements.toFixed(2)} out of range`);
  }
});

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

test("Age Pension taper and cut-offs reconcile exactly", () => {
  assert.equal(pensionReduction(226, "single"), 0);
  assert.equal(pensionReduction(426, "single"), 100);
  // couple: each person's pension reduces 25c per combined dollar over $396
  assert.equal(pensionReduction(796, "couple"), 100);
  const singleCut = AGE_PENSION.incomeTest.single.freeArea + AGE_PENSION.maxFortnightly.single.total / 0.5;
  assert.equal(r2(singleCut), AGE_PENSION.publishedCutOff.single);
  const coupleCut = AGE_PENSION.incomeTest.couple.freeArea + AGE_PENSION.maxFortnightly.coupleEach.total / 0.25;
  assert.equal(r2(coupleCut), AGE_PENSION.publishedCutOff.coupleCombined);
  assert.equal(agePensionFortnightly(0, "single"), AGE_PENSION.maxFortnightly.single.total);
  assert.equal(agePensionFortnightly(AGE_PENSION.publishedCutOff.single, "single"), 0);
});

test("Work Bonus offsets the first $300 of employment income, then the balance", () => {
  assert.equal(WORK_BONUS.fortnightlyCredit, 300);
  assert.equal(assessableAfterWorkBonus(250, 0), 0);
  assert.equal(assessableAfterWorkBonus(1_000, 0), 700);
  assert.equal(assessableAfterWorkBonus(1_000, 500), 200);
  assert.equal(assessableAfterWorkBonus(1_000, WORK_BONUS.maxBalance), 0);
});
