// =============================================================================
// 2025-26 tax return estimate (lodged in 2026)
// Run with: npm test
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { calculateIncomeTax } from "../australian-tax";
import {
  estimateReturn2025_26,
  helpRepayment2025_26,
  incomeTax2025_26,
  lito2025_26,
  medicareLevy2025_26,
  mls2025_26,
} from "../tax-return-2025-26";

test("2025-26 resident tax uses the 16% second bracket", () => {
  assert.equal(incomeTax2025_26(18_200), 0);
  assert.equal(incomeTax2025_26(45_000), 4_288);
  assert.equal(incomeTax2025_26(135_000), 31_288);
  assert.equal(incomeTax2025_26(190_000), 51_638);
  assert.equal(incomeTax2025_26(80_000), 14_788);
});

test("the 2025-26 return costs $268 more than FY2026-27 once past $45,000", () => {
  assert.equal(incomeTax2025_26(100_000) - calculateIncomeTax(100_000), 268);
});

test("LITO, Medicare levy and MLS", () => {
  assert.equal(lito2025_26(30_000), 700);
  assert.equal(lito2025_26(45_000), 325);
  assert.equal(lito2025_26(66_667), 0);
  assert.equal(medicareLevy2025_26(80_000), 1_600);
  assert.equal(medicareLevy2025_26(20_000), 0);
  assert.equal(mls2025_26(101_000, false), 0);
  assert.equal(mls2025_26(110_000, false), 1_100);
  assert.equal(mls2025_26(110_000, true), 0);
});

test("study loan repayments start above $67,000 on the marginal system", () => {
  assert.equal(helpRepayment2025_26(67_000), 0);
  assert.equal(helpRepayment2025_26(100_000), 4_950);
});

test("refund estimate", () => {
  const r = estimateReturn2025_26({
    grossIncome: 82_000,
    deductions: 2_000,
    taxWithheld: 17_000,
    hasPrivateHospitalCover: true,
    hasStudyLoan: false,
  });
  assert.equal(r.taxableIncome, 80_000);
  assert.equal(r.totalLiability, 16_388);
  assert.equal(r.refund, 612);
  const low = estimateReturn2025_26({ grossIncome: 45_000, deductions: 0, taxWithheld: 5_000, hasPrivateHospitalCover: true, hasStudyLoan: false });
  assert.equal(low.totalLiability, 4_863);
});
