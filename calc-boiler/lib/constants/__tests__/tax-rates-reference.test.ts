// =============================================================================
// Tax rates reference — ATO conformance tests (T1, 23 September 2026)
//
// Anchors, read 23 September 2026 via Firecrawl (full quotes in
// tax-rates-reference.ts):
//   ATO resident rates page: 2026-27 bases $4,020 / $31,020 / $51,370;
//     2025-26 bases $4,288 / $31,288 / $51,638.
//   ATO QC104015 + APH r7331 (Act No. 28 of 2025): 14% from 1 July 2027.
//   ATO QC73322: WHM bases $6,750 / $33,750 / $54,100.
//   ATO QC105020: LITO $700 to $37,500, $325 at $45,000, nil at $66,667.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  LITO,
  TAX_BRACKETS_2025_26,
  TAX_BRACKETS_2026_27,
  calculateIncomeTax,
} from "../australian-tax";
import { calculatePAYGWithholding } from "../payg-withholding";
import { effectiveNilTaxIncome } from "../tax-free-threshold";
import {
  TAX_BRACKETS_2027_28,
  WHM_TAX_BRACKETS_2025_26,
  analyseIncome,
  bracketRateAt,
  deriveResidentScale,
  estimateYearEnd,
  litoBreakdown,
  nilTaxIncomeOnScale,
  taxOnScale,
  thresholdTax,
} from "../tax-rates-reference";

const bases = (s: readonly { base: number }[]) => s.map((b) => b.base);

test("deriveResidentScale reproduces the ATO's 2025-26 and 2026-27 tables", () => {
  assert.deepEqual(bases(deriveResidentScale(TAX_BRACKETS_2026_27, 0.16)), bases(TAX_BRACKETS_2025_26));
  assert.deepEqual(bases(deriveResidentScale(TAX_BRACKETS_2026_27, 0.15)), bases(TAX_BRACKETS_2026_27));
  assert.deepEqual(bases(TAX_BRACKETS_2026_27), [0, 0, 4_020, 31_020, 51_370]);
  assert.deepEqual(bases(TAX_BRACKETS_2025_26), [0, 0, 4_288, 31_288, 51_638]);
});

test("2027-28 legislated scale: 14% second rate, thresholds unchanged", () => {
  assert.equal(TAX_BRACKETS_2027_28[1].rate, 0.14);
  assert.deepEqual(bases(TAX_BRACKETS_2027_28), [0, 0, 3_752, 30_752, 51_102]);
  assert.deepEqual(
    TAX_BRACKETS_2027_28.map((b) => [b.min, b.max]),
    TAX_BRACKETS_2026_27.map((b) => [b.min, b.max])
  );
});

test("taxOnScale agrees with calculateIncomeTax on the current scale", () => {
  for (const inc of [0, 18_200, 18_201, 30_000, 45_000, 80_000, 135_000, 190_000, 250_000]) {
    assert.equal(taxOnScale(inc, TAX_BRACKETS_2026_27), calculateIncomeTax(inc));
  }
});

test("tax at each threshold matches the ATO base amounts", () => {
  assert.deepEqual(
    thresholdTax(TAX_BRACKETS_2026_27).map((r) => r.tax),
    [0, 4_020, 31_020, 51_370]
  );
});

test("WHM bases are internally consistent with the rates", () => {
  const derived = [0, 45_000 * 0.15];
  derived.push(derived[1] + 90_000 * 0.3, derived[1] + 90_000 * 0.3 + 55_000 * 0.37);
  assert.deepEqual(bases(WHM_TAX_BRACKETS_2025_26), derived.map(Math.round));
});

test("effective nil-tax income with LITO: $22,575 (16%), $22,866 (15%), $23,200 (14%)", () => {
  assert.equal(nilTaxIncomeOnScale(TAX_BRACKETS_2025_26), 22_575);
  assert.equal(nilTaxIncomeOnScale(TAX_BRACKETS_2026_27), 22_866);
  assert.equal(nilTaxIncomeOnScale(TAX_BRACKETS_2027_28), 23_200);
  // Same answer as the tax-free-threshold module's engine.
  assert.equal(nilTaxIncomeOnScale(TAX_BRACKETS_2026_27), effectiveNilTaxIncome());
});

test("LITO breakdown follows QC105020 and is non-refundable", () => {
  assert.equal(litoBreakdown(37_500).offset, LITO.maxOffset);
  assert.equal(litoBreakdown(40_000).offset, 575);
  assert.equal(litoBreakdown(45_000).offset, 325);
  assert.equal(litoBreakdown(50_000).offset, 250);
  assert.equal(litoBreakdown(66_667).offset, 0);
  const low = litoBreakdown(20_000);
  assert.equal(low.taxBeforeLito, 270);
  assert.equal(low.offsetUsed, 270);
  assert.equal(low.taxAfterLito, 0);
  assert.equal(low.offsetWasted, 430);
  assert.equal(litoBreakdown(60_000).phase, "phase2");
});

test("analyseIncome: $100,000 pays $20,520 + $2,000 Medicare, 32% at the margin", () => {
  const a = analyseIncome(100_000);
  assert.equal(a.incomeTax, 20_520);
  assert.equal(a.medicareLevy, 2_000);
  assert.equal(a.totalTax, 22_520);
  assert.equal(a.bracketRate, 0.3);
  assert.equal(a.marginalWithMedicare, 0.32);
  assert.equal(a.taxOnNext1000, 320);
});

test("analyseIncome exposes LITO withdrawal: $40,000 pays 22c on the next dollar, not 17c", () => {
  const a = analyseIncome(40_000);
  assert.equal(a.incomeTax, 2_695);
  assert.equal(a.bracketRate, 0.15);
  assert.equal(a.marginalWithMedicare, 0.17);
  assert.equal(a.taxOnNext1000, 220);
  assert.equal(bracketRateAt(18_200), 0);
  assert.equal(analyseIncome(15_000).marginalWithMedicare, 0);
});

test("estimateYearEnd annualises the Schedule 1/8 engine and compares to the liability", () => {
  const e = estimateYearEnd({ grossPerPeriod: 2_000, frequency: "fortnightly", claimsTaxFreeThreshold: true, hasStudyLoan: false });
  const w = calculatePAYGWithholding(2_000, "fortnightly");
  assert.equal(e.annualWithheld, w.totalWithheld * 26);
  assert.equal(e.annualIncome, 52_000);
  assert.equal(e.liability, analyseIncome(52_000).totalTax);
  assert.equal(e.difference, e.annualWithheld - e.liability);

  // Not claiming the threshold on your only job over-withholds → refund.
  const noTft = estimateYearEnd({ grossPerPeriod: 2_000, frequency: "fortnightly", claimsTaxFreeThreshold: false, hasStudyLoan: false });
  assert.ok(noTft.difference > e.difference);

  // Study loan: STSL withholding is included, and the repayment in the liability.
  const help = estimateYearEnd({ grossPerPeriod: 3_500, frequency: "fortnightly", claimsTaxFreeThreshold: true, hasStudyLoan: true });
  assert.ok(help.annualStslWithheld > 0);
  assert.ok(help.studyLoanRepayment > 0);
  assert.equal(help.liability, help.incomeTax + help.medicareLevy + help.studyLoanRepayment);

  // Foreign residents: no LITO, no Medicare levy.
  const fr = estimateYearEnd({ grossPerPeriod: 1_000, frequency: "weekly", claimsTaxFreeThreshold: true, hasStudyLoan: false, foreignResident: true });
  assert.equal(fr.medicareLevy, 0);
  assert.equal(fr.lito, 0);
  assert.equal(fr.incomeTax, Math.round(52_000 * 0.3));
});
