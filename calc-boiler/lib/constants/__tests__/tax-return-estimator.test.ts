// =============================================================================
// /tax-return-calculator/ — refund estimates pinned for both income years
// Run with: npm test
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_RETURN_YEAR, RETURN_YEARS, estimateReturn } from "../tax-return-estimator";
import { estimateReturn2025_26 } from "../tax-return-2025-26";

const base = { hasPrivateHospitalCover: true, hasStudyLoan: false };

test("defaults to 2025-26, the return being lodged now", () => {
  assert.equal(DEFAULT_RETURN_YEAR, "2025-26");
  assert.equal(RETURN_YEARS["2025-26"].secondBracketRate, 0.16);
  assert.equal(RETURN_YEARS["2026-27"].secondBracketRate, 0.15);
  assert.equal(RETURN_YEARS["2025-26"].selfLodgeDueDate, "31 October 2026");
});

test("2025-26 delegates to the 2025-26 engine unchanged", () => {
  const i = { grossIncome: 73_400, deductions: 1_900, taxWithheld: 15_000, hasPrivateHospitalCover: false, hasStudyLoan: true };
  const { marginalRate, ...rest } = estimateReturn("2025-26", i);
  assert.deepEqual(rest, estimateReturn2025_26(i));
  assert.equal(marginalRate, 0.32);
});

test("$85,000 income, $2,500 deductions, $20,000 withheld", () => {
  const i = { grossIncome: 85_000, deductions: 2_500, taxWithheld: 20_000, ...base };
  const a = estimateReturn("2025-26", i);
  assert.equal(a.taxableIncome, 82_500);
  assert.equal(a.incomeTax, 15_538);
  assert.equal(a.medicareLevy, 1_650);
  assert.equal(a.totalLiability, 17_188);
  assert.equal(a.refund, 2_812);

  const b = estimateReturn("2026-27", i);
  assert.equal(b.incomeTax, 15_270);
  assert.equal(b.refund, 3_080);
  // The bug this module fixes: the 2026-27 engine overstated a 2025-26 refund by $268.
  assert.equal(b.refund - a.refund, 268);
});

test("$40,000 income: LITO phase-out and the 1-point bracket cut", () => {
  const i = { grossIncome: 40_000, deductions: 0, taxWithheld: 4_000, ...base };
  const a = estimateReturn("2025-26", i);
  assert.equal(a.incomeTax, 3_488);
  assert.equal(a.lito, 575);
  assert.equal(a.medicareLevy, 800);
  assert.equal(a.refund, 287);
  assert.equal(a.marginalRate, 0.18);

  const b = estimateReturn("2026-27", i);
  assert.equal(b.incomeTax, 3_270);
  assert.equal(b.refund, 505);
  assert.equal(b.marginalRate, 0.17);
});

test("$120,000 with no hospital cover and a study loan uses each year's MLS and HELP settings", () => {
  const i = { grossIncome: 120_000, deductions: 0, taxWithheld: 30_000, hasPrivateHospitalCover: false, hasStudyLoan: true };
  const a = estimateReturn("2025-26", i);
  assert.equal(a.mls, 1_500); // 2025-26 tier 2 (1.25%)
  assert.equal(a.helpRepayment, 7_950); // 15% over $67,000
  assert.equal(a.totalLiability, 38_638);
  assert.equal(a.refund, -8_638);

  const b = estimateReturn("2026-27", i);
  assert.equal(b.mls, 1_200); // 2026-27 tier 1 (1%)
  assert.equal(b.helpRepayment, 7_571); // 15% over $69,528
  assert.equal(b.totalLiability, 37_691);
  assert.equal(b.refund, -7_691);
});
