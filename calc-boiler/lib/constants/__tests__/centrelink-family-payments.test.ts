// =============================================================================
// Parenting Payment, Family Tax Benefit and Rent Assistance tests.
//
// Run with: npm test
//
// Each published cut-off / income limit on Services Australia (read 23 Sep
// 2026) is a consequence of a stored rate and taper. These tests rebuild every
// one of them from the stored figures, so a rate that drifts from its source
// fails here rather than on the page.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  FORTNIGHTS_PER_YEAR,
  FTB_A,
  FTB_B,
  PARENTING_PAYMENT,
  RENT_ASSISTANCE,
  RENT_ASSISTANCE_SITUATIONS,
  ftbA,
  ftbABaseRateIncome,
  ftbANilIncome,
  ftbB,
  ftbBSecondaryLimit,
  ppsCutOff,
  ppsFreeArea,
  ppsFortnightly,
  pppCombinedReduction,
  pppFortnightly,
  pppOwnReduction,
  rentAssistanceFortnightly,
  rentForMaxAssistance,
  rentToFortnightly,
} from "../centrelink-family-payments";
import { JOBSEEKER_RATES, SEPTEMBER_2026 } from "../centrelink-income-test";

const near = (a: number, b: number, tol: number, msg?: string) =>
  assert.ok(Math.abs(a - b) <= tol, `${msg ?? ""} ${a} vs ${b} (±${tol})`);

// ---------------------------------------------------------------------------
// Parenting Payment Single
// ---------------------------------------------------------------------------

test("PPS maximum = basic + pension supplement, and matches the JobSeeker exempt-carer construction", () => {
  const s = PARENTING_PAYMENT.single;
  assert.equal(Math.round((s.basic + s.pensionSupplement) * 100) / 100, s.maxFortnightly);
  // centrelink-income-test.ts builds the exempt principal carer JobSeeker rate
  // the same way — the two files must agree.
  assert.equal(JOBSEEKER_RATES[SEPTEMBER_2026].maxFortnightly.principalCarerExempt, s.maxFortnightly);
});

test("PPS free area: $232.60 for one child, plus $24.60 per extra child", () => {
  assert.equal(ppsFreeArea(1), 232.60);
  assert.equal(ppsFreeArea(2), 257.20);
  assert.equal(ppsFreeArea(3), 281.80);
  assert.equal(ppsFreeArea(4), 306.40);
  assert.equal(ppsFreeArea(0), 232.60, "treated as one child");
});

test("PPS taper: nothing under the free area, 40c per $1 above it", () => {
  const max = PARENTING_PAYMENT.single.maxFortnightly;
  assert.equal(ppsFortnightly(0, 1), max);
  assert.equal(ppsFortnightly(232.60, 1), max);
  assert.equal(ppsFortnightly(332.60, 1), Math.round((max - 40) * 100) / 100);
  assert.equal(ppsFortnightly(1_000, 1), 761.24); // 1068.20 − 0.4 × 767.40
  assert.equal(ppsFortnightly(1_000, 2), 771.08); // free area 257.20
  assert.equal(ppsFortnightly(5_000, 1), 0);
});

test("PPS published cut-off ($2,950.60, one child) reconciles to the typical total and taper", () => {
  assert.equal(ppsCutOff(1), PARENTING_PAYMENT.single.publishedCutOffOneChild);
  // "The cut-off point increases by $24.60 per child"
  assert.equal(ppsCutOff(2), 2_975.20);
  // The basic + PS rate alone reaches $0 below the published cut-off by exactly
  // (Energy Supplement + Pharmaceutical Allowance) ÷ 0.4.
  const zeroAt = 232.60 + PARENTING_PAYMENT.single.maxFortnightly / 0.4;
  near(ppsCutOff(1) - zeroAt, (12 + 7) / 0.4, 0.01);
});

// ---------------------------------------------------------------------------
// Parenting Payment Partnered
// ---------------------------------------------------------------------------

test("PPP maximum equals JobSeeker partnered from 20 Sep 2026", () => {
  assert.equal(PARENTING_PAYMENT.partnered.maxFortnightly, JOBSEEKER_RATES[SEPTEMBER_2026].maxFortnightly.partnered);
});

test("PPP own income: $150 free, 50c to $256, then $53 + 60c", () => {
  assert.equal(pppOwnReduction(150), 0);
  assert.equal(pppOwnReduction(256), 53);
  assert.equal(pppOwnReduction(356), 113);
  assert.equal(pppFortnightly(0, 0), 755.10);
  assert.equal(pppFortnightly(500, 0), 755.10 - 53 - 0.6 * 244);
});

test("PPP partner not on a pension: 60c per $1 over $1,440", () => {
  assert.equal(pppFortnightly(0, 1_440), 755.10);
  assert.equal(pppFortnightly(0, 1_540), 695.10);
  assert.equal(pppFortnightly(300, 1_540), Math.round((755.10 - (53 + 0.6 * 44) - 60) * 100) / 100);
});

test("PPP own-income cut-off reconciles to the published $1,439.34", () => {
  const p = PARENTING_PAYMENT.partnered;
  const typical = p.maxFortnightly + p.energySupplement;
  const derived = (typical - 53) / 0.6 + 256;
  near(derived, p.publishedOwnCutOff, 0.01);
});

test("PPP partner on a pension: combined income, 25c over $300, $53 + 30c over $512, cut-off $2,878.68", () => {
  assert.equal(pppCombinedReduction(300), 0);
  assert.equal(pppCombinedReduction(512), 53);
  assert.equal(pppFortnightly(400, 112, "pension"), 702.10);
  assert.equal(pppFortnightly(400, 212, "pension"), 672.10); // $53 + 30c × $100
  const p = PARENTING_PAYMENT.partnered;
  const typical = p.maxFortnightly + p.energySupplement;
  // $2,878.667 by the arithmetic; Services Australia publishes $2,878.68.
  near((typical - 53) / 0.3 + 512, p.combined.publishedCutOff, 0.02);
});

// ---------------------------------------------------------------------------
// Family Tax Benefit Part A
// ---------------------------------------------------------------------------

test("FTB A: full maximum at or under the lower threshold", () => {
  const r = ftbA(60_000, { age0to12: 1, age13to19: 0 });
  assert.equal(r.fortnightly, 235.48);
  assert.equal(r.method, "max");
  // Under $80,000, so the full supplement is estimated.
  assert.equal(r.supplement, FTB_A.supplementAnnual);
});

test("FTB A: base-rate income limits reconcile to Services Australia within $1", () => {
  const p = FTB_A.publishedBaseRateLimit;
  near(ftbABaseRateIncome({ age0to12: 1, age13to19: 0 }), p.oneChild0to12, 1, "one child 0–12");
  near(ftbABaseRateIncome({ age0to12: 0, age13to19: 1 }), p.oneChild13to19, 1, "one child 13–19");
  near(ftbABaseRateIncome({ age0to12: 2, age13to19: 0 }), p.twoChildren0to12, 1, "two children 0–12");
  near(ftbABaseRateIncome({ age0to12: 1, age13to19: 1 }), p.oneEach, 1, "one of each");
});

test("FTB A: nil income limits reconcile to Services Australia within $1", () => {
  const p = FTB_A.publishedNilLimit;
  near(ftbANilIncome({ age0to12: 1, age13to19: 0 }), p.oneChild, 1, "one child");
  near(ftbANilIncome({ age0to12: 0, age13to19: 1 }), p.oneChild, 1, "one teen");
  near(ftbANilIncome({ age0to12: 2, age13to19: 0 }), p.twoChildren0to12, 1, "two 0–12");
  near(ftbANilIncome({ age0to12: 0, age13to19: 2 }), p.twoChildren13to19, 1, "two 13–19");
  near(ftbANilIncome({ age0to12: 3, age13to19: 0 }), p.threeChildren0to12, 1, "three 0–12");
  near(ftbANilIncome({ age0to12: 0, age13to19: 3 }), p.threeChildren13to19, 1, "three 13–19");
  near(ftbANilIncome({ age0to12: 3, age13to19: 1 }), p.fourChildren3and1, 1, "3 + 1");
  near(ftbANilIncome({ age0to12: 3, age13to19: 3 }), p.sixChildren3and3, 1, "3 + 3");
});

test("FTB A: base rate is held between the base-rate limit and the higher threshold", () => {
  const kids = { age0to12: 1, age13to19: 0 };
  const r = ftbA(100_000, kids);
  assert.equal(r.fortnightly, FTB_A.baseFortnightly);
  assert.equal(r.method, "method2");
  assert.equal(r.supplement, 0, "no supplement over $80,000");
  // …then 30c per $1 over $123,078.
  const over = ftbA(FTB_A.higherThreshold + 1_000, kids);
  near(over.annualExSupplement, FTB_A.baseFortnightly * FORTNIGHTS_PER_YEAR - 300, 0.01);
  assert.equal(ftbA(140_000, kids).fortnightly, 0);
});

test("FTB A: 20c taper between the thresholds", () => {
  const kids = { age0to12: 1, age13to19: 0 };
  const r = ftbA(79_131, kids); // $10,000 over the lower threshold
  near(r.annualExSupplement, 235.48 * FORTNIGHTS_PER_YEAR - 2_000, 0.01);
  assert.equal(r.method, "method1");
  // Supplement still within the $80,000 test — reduced last, so paid in full here.
  assert.equal(r.supplement, FTB_A.supplementAnnual);
});

test("FTB A: an income support payment means the maximum rate regardless of income", () => {
  const r = ftbA(95_000, { age0to12: 2, age13to19: 0 }, true);
  assert.equal(r.fortnightly, 470.96);
  assert.equal(r.supplement, 0, "supplement still needs ATI ≤ $80,000");
});

test("FTB A: no children, no payment", () => {
  assert.equal(ftbA(30_000, { age0to12: 0, age13to19: 0 }).annualTotal, 0);
});

// ---------------------------------------------------------------------------
// Family Tax Benefit Part B
// ---------------------------------------------------------------------------

test("FTB B: secondary-earner limits reconcile to Services Australia within $1 (supplement included)", () => {
  near(ftbBSecondaryLimit(2), FTB_B.publishedSecondaryLimit.youngestUnder5, 1, "youngest under 5");
  near(ftbBSecondaryLimit(8), FTB_B.publishedSecondaryLimit.youngest5to12, 1, "youngest 5–12");
});

test("FTB B: single parent at or under $124,327 gets the maximum", () => {
  const r = ftbB({ family: "single", youngestAge: 3, primaryIncome: 124_327 });
  assert.equal(r.eligible, true);
  assert.equal(r.fortnightly, 200.34);
  assert.equal(r.supplement, FTB_B.supplementAnnual);
  assert.equal(ftbB({ family: "single", youngestAge: 3, primaryIncome: 124_328 }).eligible, false);
  assert.equal(ftbB({ family: "single", youngestAge: 16, primaryIncome: 50_000 }).fortnightly, 139.86);
});

test("FTB B: couples — youngest under 13, primary earner test, 20c secondary taper", () => {
  assert.equal(ftbB({ family: "couple", youngestAge: 13, primaryIncome: 80_000, secondaryIncome: 0 }).eligible, false);
  assert.equal(ftbB({ family: "couple", youngestAge: 4, primaryIncome: 130_000, secondaryIncome: 0 }).eligible, false);
  const full = ftbB({ family: "couple", youngestAge: 4, primaryIncome: 90_000, secondaryIncome: 7_154 });
  assert.equal(full.fortnightly, 200.34);
  const part = ftbB({ family: "couple", youngestAge: 4, primaryIncome: 90_000, secondaryIncome: 17_154 });
  near(part.annualExSupplement, 200.34 * FORTNIGHTS_PER_YEAR - 2_000, 0.01);
  assert.equal(part.supplement, FTB_B.supplementAnnual);
  const gone = ftbB({ family: "couple", youngestAge: 4, primaryIncome: 90_000, secondaryIncome: 36_000 });
  assert.equal(gone.eligible, false);
  assert.equal(gone.annualTotal, 0);
});

// ---------------------------------------------------------------------------
// Rent Assistance
// ---------------------------------------------------------------------------

test("Rent Assistance: every published 'rent for the maximum' reconciles within a cent", () => {
  for (const s of RENT_ASSISTANCE_SITUATIONS) {
    near(rentForMaxAssistance(s), RENT_ASSISTANCE.rows[s].publishedMaxRent, 0.01, s);
  }
});

test("Rent Assistance: 75c per $1 over the threshold, capped at the maximum", () => {
  assert.equal(rentAssistanceFortnightly(157.80, "single"), 0);
  assert.equal(rentAssistanceFortnightly(257.80, "single"), 75);
  assert.equal(rentAssistanceFortnightly(1_000, "single"), 223.80);
  assert.equal(rentAssistanceFortnightly(1_000, "singleSharer"), 149.20);
  assert.equal(rentAssistanceFortnightly(1_000, "coupleFamily3plus"), 297.36);
  assert.equal(rentAssistanceFortnightly(100, "couple"), 0);
});

test("Rent period conversion", () => {
  assert.equal(rentToFortnightly(300, "week"), 600);
  assert.equal(rentToFortnightly(600, "fortnight"), 600);
  assert.equal(rentToFortnightly(1_300, "month"), 600);
});
