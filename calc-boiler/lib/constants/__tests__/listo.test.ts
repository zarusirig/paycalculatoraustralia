// =============================================================================
// LISTO: 15% of concessional contributions, $500 cap at $37,000 now, $810 at
// $45,000 from 1 July 2027 (ATO QC26138 / QC105616, Treasury fact sheet)
// Run with: npm test
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { LISTO_2027_28, LISTO_CURRENT, listoFromSalary, listoPayment, salaryForFullListo } from "../listo";

test("ATO worked example: $3,360 super guarantee, income $31,000 -> $500 (15% = $504, capped)", () => {
  const r = listoPayment({ adjustedTaxableIncome: 31_000, concessionalContributions: 3_360 });
  assert.equal(r.eligible, true);
  assert.equal(r.uncapped, 504);
  assert.equal(r.payment, 500);
  assert.equal(r.hitCap, true);
});

test("below the cap the payment is 15% of contributions, rounded to the cent", () => {
  const r = listoPayment({ adjustedTaxableIncome: 20_000, concessionalContributions: 2_400 });
  assert.equal(r.payment, 360);
  assert.equal(r.hitCap, false);
  assert.equal(listoPayment({ adjustedTaxableIncome: 20_000, concessionalContributions: 2_333.33 }).payment, 350);
});

test("a tiny entitlement is rounded up to the $10 minimum", () => {
  const r = listoPayment({ adjustedTaxableIncome: 12_000, concessionalContributions: 20 });
  assert.equal(r.uncapped, 3);
  assert.equal(r.payment, 10);
  assert.equal(r.usedMinimum, true);
});

test("income threshold is inclusive: $37,000 qualifies, $37,001 does not (current rules)", () => {
  assert.equal(listoPayment({ adjustedTaxableIncome: 37_000, concessionalContributions: 4_440 }).eligible, true);
  const over = listoPayment({ adjustedTaxableIncome: 37_001, concessionalContributions: 4_440 });
  assert.equal(over.eligible, false);
  assert.equal(over.payment, 0);
});

test("2027-28 boost: threshold $45,000, cap $810", () => {
  assert.equal(LISTO_2027_28.incomeThreshold, 45_000);
  assert.equal(LISTO_2027_28.maxPayment, 810);
  // $42,000 earner: ineligible now, eligible in 2027-28 with 12% SG = $5,040 -> $756.
  assert.equal(listoPayment({ adjustedTaxableIncome: 42_000, concessionalContributions: 5_040 }, LISTO_CURRENT).eligible, false);
  assert.equal(listoPayment({ adjustedTaxableIncome: 42_000, concessionalContributions: 5_040 }, LISTO_2027_28).payment, 756);
  // $45,000 earner reaches exactly the new maximum on super guarantee alone.
  assert.equal(listoFromSalary(45_000, LISTO_2027_28), 810);
  assert.equal(listoPayment({ adjustedTaxableIncome: 45_001, concessionalContributions: 5_400 }, LISTO_2027_28).eligible, false);
});

test("salary at which super guarantee alone earns the full amount", () => {
  assert.equal(salaryForFullListo(LISTO_CURRENT), 27_778); // 500 / (0.15 x 0.12)
  assert.equal(salaryForFullListo(LISTO_2027_28), 45_000);
});

test("eligibility conditions other than income", () => {
  const tmp = listoPayment({ adjustedTaxableIncome: 30_000, concessionalContributions: 3_600, temporaryResident: true });
  assert.equal(tmp.eligible, false);
  assert.equal(tmp.reasons.length, 1);
  assert.equal(listoPayment({ adjustedTaxableIncome: 30_000, concessionalContributions: 3_600, tenPercentFromWork: false }).eligible, false);
  assert.equal(listoPayment({ adjustedTaxableIncome: 30_000, concessionalContributions: 0 }).eligible, false);
});
