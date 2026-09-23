// =============================================================================
// W3 Centrelink wave 2 tests: Carer Payment, Carer Allowance, advances, Crisis
// Payment, Income Apportionment Resolution Scheme, Paid Parental Leave.
//
// Run with: npm test
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  ADVANCE_LIMITS,
  CARER_ALLOWANCE,
  CARER_PAYMENT,
  CARER_PAYMENT_AVERAGE_WEEKLY_HOURS,
  CARER_PAYMENT_RATES,
  advanceRepayment,
  carerAllowanceFortnightly,
  carerPaymentWithinHoursLimit,
  clampAdvance,
  crisisPaymentAmount,
  jobseekerOverpayment,
  paymentWhileRepaying,
  resolutionSchemePayment,
} from "../centrelink-carer-and-support";
import {
  AGE_PENSION_RATES,
  JOBSEEKER_RATES,
  SEPTEMBER_2026,
  agePensionCutOff,
  agePensionFortnightly,
} from "../centrelink-income-test";
import {
  PPL_ENTITLEMENT,
  PPL_INCOME_TEST,
  PPL_RATES,
  pplEntitlementFor,
  pplGross,
  pplMeetsIncomeTest,
  pplSplit,
  pplSuperEstimate,
} from "../paid-parental-leave";

// --- Carer Payment ------------------------------------------------------------

test("Carer Payment rates are the pension rates published on the Carer Payment page (from 20 Sep 2026)", () => {
  assert.equal(CARER_PAYMENT_RATES, AGE_PENSION_RATES[SEPTEMBER_2026]);
  // As shown on how-much-carer-payment-you-can-get, read 23 Sep 2026.
  assert.equal(CARER_PAYMENT_RATES.maxFortnightly.single.basic, 1_135.40);
  assert.equal(CARER_PAYMENT_RATES.maxFortnightly.single.supplement, 88.20);
  assert.equal(CARER_PAYMENT_RATES.maxFortnightly.single.energy, 14.10);
  assert.equal(CARER_PAYMENT_RATES.maxFortnightly.single.total, 1_237.70);
  assert.equal(CARER_PAYMENT_RATES.maxFortnightly.coupleEach.total, 933.00);
  assert.equal(CARER_PAYMENT_RATES.maxFortnightly.coupleCombined.total, 1_866.00);
});

test("Carer Payment income test cut-offs reconcile with the published figures", () => {
  // income-test-for-carer-payment: single $2,701.40; couple $4,128.00 combined.
  assert.equal(agePensionCutOff(CARER_PAYMENT_RATES.maxFortnightly.single.total, "single"), 2_701.40);
  assert.equal(agePensionCutOff(CARER_PAYMENT_RATES.maxFortnightly.coupleEach.total, "coupleCombined"), 4_128.00);
  assert.equal(agePensionFortnightly(226, "single", CARER_PAYMENT_RATES), 1_237.70);
  assert.equal(agePensionFortnightly(626, "single", CARER_PAYMENT_RATES), 1_037.70);
  assert.equal(agePensionFortnightly(2_701.40, "single", CARER_PAYMENT_RATES), 0);
});

test("Carer Payment 100-hours-in-4-weeks work rule", () => {
  assert.equal(carerPaymentWithinHoursLimit(100), true);
  assert.equal(carerPaymentWithinHoursLimit(100.5), false);
  assert.equal(CARER_PAYMENT_AVERAGE_WEEKLY_HOURS, 25);
});

test("Carer Payment assets cut-offs sit above the full-pension limits", () => {
  const a = CARER_PAYMENT.assetsFullPension;
  const c = CARER_PAYMENT.assetsCutOff;
  assert.ok(c.singleHomeowner > a.singleHomeowner);
  assert.ok(c.coupleNonHomeowner > a.coupleNonHomeowner);
  // Non-homeowner limits are the homeowner limits plus the same gap.
  assert.equal(a.singleNonHomeowner - a.singleHomeowner, c.singleNonHomeowner - c.singleHomeowner);
});

// --- Carer Allowance ------------------------------------------------------------

test("Carer Allowance is a set rate under the $250,000 combined income limit", () => {
  assert.equal(carerAllowanceFortnightly(0), 162.60);
  assert.equal(carerAllowanceFortnightly(249_999.99), 162.60);
  assert.equal(carerAllowanceFortnightly(250_000), 0);
  assert.equal(carerAllowanceFortnightly(100_000, 50), 81.30);
  assert.equal(carerAllowanceFortnightly(100_000, 150), CARER_ALLOWANCE.fortnightly);
});

// --- Advances --------------------------------------------------------------------

test("advance repayment is the advance divided by 13", () => {
  assert.equal(advanceRepayment(500), 38.46);
  assert.equal(advanceRepayment(1_764.15), 135.70);
  assert.equal(advanceRepayment(1_300), 100);
  assert.equal(advanceRepayment(-5), 0);
  assert.equal(paymentWhileRepaying(833.70, 500), 795.24);
  assert.equal(paymentWhileRepaying(20, 500), 0);
});

test("pension advance limits are half and one-and-a-half fortnights of the same base", () => {
  // Lowest = highest ÷ 3 for both pension rows, as published.
  for (const k of ["pensionSingle", "pensionCouple"] as const) {
    const { min, max } = ADVANCE_LIMITS[k];
    assert.ok(min !== null);
    assert.ok(Math.abs(max / 3 - (min as number)) < 0.01, k);
  }
  assert.equal(clampAdvance("allowance", 1_000), 500);
  assert.equal(clampAdvance("allowance", 10), 250);
  assert.equal(clampAdvance("ftb", 5_000), 1_430.46);
});

// --- Crisis Payment ---------------------------------------------------------------

test("Crisis Payment is a week of the maximum basic rate (half the fortnightly basic)", () => {
  const js = JOBSEEKER_RATES[SEPTEMBER_2026].maxFortnightly;
  assert.equal(crisisPaymentAmount(js.single), 412.45);
  assert.equal(crisisPaymentAmount(js.partnered), 377.55);
  assert.equal(crisisPaymentAmount(AGE_PENSION_RATES[SEPTEMBER_2026].maxFortnightly.single.basic), 567.70);
  assert.equal(crisisPaymentAmount(677.20), 338.60);
});

// --- Resolution Scheme -------------------------------------------------------------

test("Income Apportionment Resolution Scheme payment bands", () => {
  assert.equal(resolutionSchemePayment(150), 150);
  assert.equal(resolutionSchemePayment(199.99), 199.99);
  assert.equal(resolutionSchemePayment(200), 200);
  assert.equal(resolutionSchemePayment(1_999), 200);
  assert.equal(resolutionSchemePayment(2_000), 400);
  assert.equal(resolutionSchemePayment(4_999.99), 400);
  assert.equal(resolutionSchemePayment(5_000), 600);
  assert.equal(resolutionSchemePayment(80_000), 600);
});

test("under-reporting income creates an overpayment equal to the missed income-test reduction", () => {
  const max = JOBSEEKER_RATES[SEPTEMBER_2026].maxFortnightly.single;
  // $600 reported, $800 earned: extra $200 all in the 60c band = $120.
  assert.equal(jobseekerOverpayment(max, 600, 800), 120);
  // Reporting net ($520) instead of gross ($650): 60c × $130 = $78.
  assert.equal(jobseekerOverpayment(max, 520, 650), 78);
  assert.equal(jobseekerOverpayment(max, 800, 800), 0);
  // Payment can't go below $0, so the overpayment caps at the payment made.
  assert.equal(jobseekerOverpayment(max, 0, 5_000), max);
});

// --- Paid Parental Leave ------------------------------------------------------------

test("PPL rates: 5-day week is five daily rates", () => {
  for (const r of Object.values(PPL_RATES)) assert.equal(Math.round(r.daily * 5 * 100) / 100, r.weekly);
});

test("PPL days and reserved partner days by birth date", () => {
  assert.equal(pplEntitlementFor("2026-07-01").days, 130);
  assert.equal(pplEntitlementFor("2026-06-30").days, 120);
  assert.equal(pplEntitlementFor("2025-07-01").reservedForPartner, 15);
  assert.equal(pplEntitlementFor("2023-01-01").days, 110);
  for (const e of PPL_ENTITLEMENT) assert.equal(e.days, e.weeks * 5);
});

test("PPL gross and super estimate", () => {
  assert.equal(pplGross(130, "2026-27"), 26_122.20);
  assert.equal(pplGross(120, "2025-26"), 22_754.40);
  assert.equal(pplSuperEstimate(26_122.20), 3_134.66);
});

test("PPL income test: individual first, then family", () => {
  const t = PPL_INCOME_TEST["2025-26"];
  assert.deepEqual(pplMeetsIncomeTest("2025-26", t.individual), { meets: true, via: "individual" });
  assert.deepEqual(pplMeetsIncomeTest("2025-26", 190_000, 190_000), { meets: true, via: "family" });
  assert.deepEqual(pplMeetsIncomeTest("2025-26", 200_000, 190_000), { meets: false, via: null });
  assert.deepEqual(pplMeetsIncomeTest("2025-26", 386_525), { meets: true, via: "family" });
});

test("PPL split: reserved days are lost if the partner doesn't use them", () => {
  const e = pplEntitlementFor("2026-08-01");
  assert.deepEqual(pplSplit(e, false, 0), { claimantDays: 130, partnerDays: 0, forfeitedDays: 0 });
  assert.deepEqual(pplSplit(e, true, 0), { claimantDays: 110, partnerDays: 0, forfeitedDays: 20 });
  assert.deepEqual(pplSplit(e, true, 20), { claimantDays: 110, partnerDays: 20, forfeitedDays: 0 });
  assert.deepEqual(pplSplit(e, true, 50), { claimantDays: 80, partnerDays: 50, forfeitedDays: 0 });
});
