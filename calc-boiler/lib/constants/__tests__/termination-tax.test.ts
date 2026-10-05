// =============================================================================
// Termination payment tax: genuine redundancy vs other ETPs, whole-of-income cap
// (ATO "Working out the whole-of-income cap amount" worked examples)
// Run with: npm test
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { WHOLE_OF_INCOME_CAP, terminationTax } from "../termination-tax";
import { redundancyTax } from "../redundancy";

const c = (n: number) => Math.round(n * 100) / 100;
const base = { completedYears: 0, ageAtEndOfIncomeYear: 45, ageAtDismissal: 45, otherTaxableIncome: 0 };

test("genuine redundancy agrees with redundancyTax() (5 years, $150,000, under preservation age)", () => {
  const t = terminationTax({ ...base, kind: "genuine-redundancy", payment: 150_000, completedYears: 5 });
  const r = redundancyTax({ grossPayment: 150_000, completedYears: 5, genuine: true, reachedPreservationAge: false });
  assert.equal(t.taxFreeLimit, 47_603); // 13,598 + 5 x 6,801
  assert.equal(t.taxFree, r.taxFree);
  assert.equal(c(t.tax), c(r.tax));
  assert.equal(c(t.tax), 32_767.04); // 102,397 x 32%
  assert.equal(t.excluded, true);
  assert.equal(t.wholeOfIncomeCapRemaining, null);
});

test("a genuine redundancy at or below the tax-free limit is not taxed", () => {
  const t = terminationTax({ ...base, kind: "genuine-redundancy", payment: 40_000, completedYears: 5 });
  assert.equal(c(t.tax), c(0));
  assert.equal(t.net, 40_000);
});

test("excluded ETP ignores other income: only the $270,000 ETP cap applies", () => {
  const t = terminationTax({ ...base, kind: "genuine-redundancy", payment: 400_000, completedYears: 10, otherTaxableIncome: 150_000 });
  // limit 13,598 + 68,010 = 81,608; taxable 318,392; 270,000 at 32% + 48,392 at 47%.
  assert.equal(t.etpTaxable, 318_392);
  assert.equal(t.withinCap, 270_000);
  assert.equal(t.aboveCap, 48_392);
  assert.equal(t.capBinding, "etp-cap");
  assert.equal(c(t.tax), 109_144.24); // 86,400 + 22,744.24
});

test("ATO example, Emilio: ETP $50,000, other income $100,000, preservation age -> all at 17%", () => {
  const t = terminationTax({ ...base, kind: "other-etp", payment: 50_000, ageAtEndOfIncomeYear: 61, ageAtDismissal: 61, otherTaxableIncome: 100_000 });
  assert.equal(t.wholeOfIncomeCapRemaining, 80_000);
  assert.equal(t.aboveCap, 0);
  assert.equal(t.rateWithinCap, 0.17);
  assert.equal(c(t.tax), c(8_500));
});

test("ATO example, Tyrone: $100,000 gratuity, $25,000 other income, under preservation age -> $32,000", () => {
  const t = terminationTax({ ...base, kind: "other-etp", payment: 100_000, otherTaxableIncome: 25_000 });
  assert.equal(t.wholeOfIncomeCapRemaining, 155_000);
  assert.equal(c(t.tax), c(32_000));
  // Later in the year he earns $60,000 more: cap falls to $95,000 and $5,000 is taxed at 47%.
  const later = terminationTax({ ...base, kind: "other-etp", payment: 100_000, otherTaxableIncome: 85_000 });
  assert.equal(later.wholeOfIncomeCapRemaining, 95_000);
  assert.equal(later.aboveCap, 5_000);
  assert.equal(later.capBinding, "whole-of-income-cap");
  assert.equal(c(later.tax), c(32_750)); // 95,000 x 32% + 5,000 x 47%
});

test("whole-of-income cap is $180,000 less other income, never below nil", () => {
  assert.equal(WHOLE_OF_INCOME_CAP, 180_000);
  const t = terminationTax({ ...base, kind: "other-etp", payment: 20_000, otherTaxableIncome: 200_000 });
  assert.equal(t.wholeOfIncomeCapRemaining, 0);
  assert.equal(t.aboveCap, 20_000);
  assert.equal(c(t.tax), c(9_400)); // 47%
});

test("other ETPs get no tax-free part, even with long service", () => {
  const t = terminationTax({ ...base, kind: "other-etp", payment: 30_000, completedYears: 20 });
  assert.equal(t.taxFree, 0);
  assert.equal(c(t.tax), c(9_600)); // 32%
});

test("dismissal at 67 or over is not a genuine redundancy", () => {
  const t = terminationTax({ ...base, kind: "genuine-redundancy", payment: 60_000, completedYears: 8, ageAtEndOfIncomeYear: 67, ageAtDismissal: 67 });
  assert.equal(t.genuine, false);
  assert.ok(t.downgradedReason);
  assert.equal(t.taxFree, 0);
  assert.equal(c(t.tax), c(60_000 * 0.17));
});

test("preservation age is 60 at the end of the income year", () => {
  assert.equal(c(terminationTax({ ...base, kind: "other-etp", payment: 10_000, ageAtEndOfIncomeYear: 59 }).tax), 3_200);
  assert.equal(c(terminationTax({ ...base, kind: "other-etp", payment: 10_000, ageAtEndOfIncomeYear: 60 }).tax), 1_700);
});
