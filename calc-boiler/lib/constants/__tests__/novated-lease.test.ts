// =============================================================================
// Novated lease tests.
//
// The four figures that decide whether this page is right or wrong:
//   - the statutory formula taxable value and the FBT it produces,
//   - the point at which the employee contribution method stops paying,
//   - the electric car exemption boundary at the LCT fuel-efficient threshold,
//   - the 1 April 2025 plug-in hybrid cut-off and its transitional rule.
//
// Plus the one that is quietly wrong on most novated lease calculators: an
// FBT-EXEMPT electric car still produces a reportable fringe benefits amount,
// which raises HECS-HELP repayment income and Medicare levy surcharge income.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { calculateHECS, calculatePayBreakdown } from "../australian-tax";
import {
  EV_EXEMPTION,
  FBT,
  FBT_COST_PER_DOLLAR,
  LUXURY_CAR_TAX,
  NOVATED_LEASE_SOURCES,
  NOVATED_LEASE_UNVERIFIED,
  RESIDUAL_MINIMUM_PCT,
  calculateNovatedLease,
  ecmBreakEvenMarginalRate,
  fbtPayable,
  isFbtExempt,
  minimumResidual,
  reportableFringeBenefitsAmount,
  statutoryTaxableValue,
  type NovatedLeaseInputs,
} from "../novated-lease";

const r2 = (n: number) => Math.round(n * 100) / 100;
const r4 = (n: number) => Math.round(n * 10_000) / 10_000;

// ---------- statutory formula ----------

test("statutory formula: taxable value is 20% of the GST-inclusive base value", () => {
  assert.equal(statutoryTaxableValue(60_000), 12_000);
  assert.equal(statutoryTaxableValue(91_661), 91_661 * 0.2);
  assert.equal(statutoryTaxableValue(0), 0);
  assert.equal(statutoryTaxableValue(-5_000), 0);
});

test("statutory formula: (A x B x C / D) - E apportions by days and nets off the contribution", () => {
  // Half an FBT year of availability halves the taxable value.
  assert.equal(r2(statutoryTaxableValue(60_000, 182.5)), 6_000);
  // The employee contribution comes off last, and cannot push the value below nil.
  assert.equal(statutoryTaxableValue(60_000, FBT.daysInYear, 5_000), 7_000);
  assert.equal(statutoryTaxableValue(60_000, FBT.daysInYear, 20_000), 0);
});

test("FBT payable grosses up at the type 1 rate and taxes at 47%", () => {
  assert.equal(r4(FBT_COST_PER_DOLLAR), r4(2.0802 * 0.47));
  assert.equal(r2(fbtPayable(12_000)), r2(12_000 * 2.0802 * 0.47));
  assert.equal(r2(fbtPayable(12_000)), 11_732.33);
  assert.equal(fbtPayable(0), 0);
});

test("a full ECM contribution equal to the taxable value leaves no FBT", () => {
  const sv = statutoryTaxableValue(60_000);
  assert.equal(fbtPayable(statutoryTaxableValue(60_000, FBT.daysInYear, sv)), 0);
});

// ---------- ECM break-even ----------

test("ECM break-even marginal rate is 49.4%, above the 47% top rate", () => {
  const breakEven = ecmBreakEvenMarginalRate();
  assert.equal(r4(breakEven), r4(1 - 1 / (1 + 2.0802 * 0.47)));
  assert.equal(r2(breakEven * 100), 49.44);
  // Top marginal rate including the Medicare levy is 47%: ECM always wins.
  assert.ok(breakEven > 0.47, "break-even must sit above the top marginal rate");
});

test("ECM leaves more take-home than the statutory method at the top marginal rate", () => {
  const base: NovatedLeaseInputs = {
    salary: 300_000,
    vehiclePrice: 60_000,
    termYears: 4,
    annualRunningCosts: 6_000,
    vehicleType: "other",
    fbtMethod: "ecm",
  };
  const ecm = calculateNovatedLease(base);
  const stat = calculateNovatedLease({ ...base, fbtMethod: "statutory" });
  assert.ok(ecm.after.takeHome > stat.after.takeHome);
  // And at an ordinary 30% + 2% rate.
  const mid = calculateNovatedLease({ ...base, salary: 90_000 });
  const midStat = calculateNovatedLease({ ...base, salary: 90_000, fbtMethod: "statutory" });
  assert.ok(mid.after.takeHome > midStat.after.takeHome);
});

test("ECM zeroes the FBT and the reportable amount; the statutory method does not", () => {
  const base: NovatedLeaseInputs = {
    salary: 120_000,
    vehiclePrice: 45_000,
    termYears: 5,
    annualRunningCosts: 5_000,
    vehicleType: "other",
    fbtMethod: "ecm",
    includeHECS: true,
  };
  const ecm = calculateNovatedLease(base);
  assert.equal(ecm.employeeContribution, 9_000); // 20% of $45,000
  assert.equal(ecm.fbt, 0);
  assert.equal(ecm.reportableFringeBenefits, 0);

  const stat = calculateNovatedLease({ ...base, fbtMethod: "statutory" });
  assert.equal(stat.employeeContribution, 0);
  assert.equal(r2(stat.fbt), r2(9_000 * FBT_COST_PER_DOLLAR));
  assert.equal(stat.reportableFringeBenefits, Math.floor(9_000 * FBT.grossUpType2));
  // The statutory method's reportable amount is what the HECS test runs on:
  // repayment income is taxable income PLUS the grossed-up benefit, so the
  // repayment is higher than the taxable income alone would produce.
  assert.equal(stat.after.incomeTestIncome, stat.after.taxableIncome + stat.reportableFringeBenefits);
  assert.equal(stat.after.hecsRepayment, calculateHECS(stat.after.incomeTestIncome));
  assert.ok(stat.after.hecsRepayment > calculateHECS(stat.after.taxableIncome));
  // Under full ECM there is nothing to report, so repayment income is just
  // taxable income.
  assert.equal(ecm.after.incomeTestIncome, ecm.after.taxableIncome);
});

// ---------- electric car exemption boundary ----------

test("EV exemption boundary sits at the LCT fuel-efficient threshold", () => {
  assert.equal(LUXURY_CAR_TAX.fuelEfficientThreshold, 91_661);
  assert.equal(isFbtExempt("bev", 91_661), true);
  assert.equal(isFbtExempt("bev", 91_662), false);
  assert.equal(isFbtExempt("bev", 91_661.01), false);
  // Not the "other vehicles" threshold, and not the income tax car limit.
  assert.equal(isFbtExempt("bev", LUXURY_CAR_TAX.otherVehiclesThreshold + 1), true);
});

test("a petrol or diesel car is never exempt, at any price", () => {
  assert.equal(isFbtExempt("other", 30_000), false);
  assert.equal(isFbtExempt("other", 91_661), false);
});

test("an exempt EV pays no FBT and needs no employee contribution", () => {
  const ev = calculateNovatedLease({
    salary: 120_000,
    vehiclePrice: 65_000,
    termYears: 4,
    annualRunningCosts: 4_000,
    vehicleType: "bev",
    fbtMethod: "ecm",
  });
  assert.equal(ev.exempt, true);
  assert.equal(ev.methodApplied, "exempt");
  assert.equal(ev.fbt, 0);
  assert.equal(ev.postTaxDeduction, 0);

  const overThreshold = calculateNovatedLease({
    salary: 120_000,
    vehiclePrice: 95_000,
    termYears: 4,
    annualRunningCosts: 4_000,
    vehicleType: "bev",
    fbtMethod: "ecm",
  });
  assert.equal(overThreshold.exempt, false);
  assert.ok(overThreshold.postTaxDeduction > 0);
});

// ---------- PHEV cut-off ----------

test("PHEV: not exempt from 1 April 2025 unless the pre-existing arrangement is asserted", () => {
  assert.equal(EV_EXEMPTION.phevExcludedFrom, "1 April 2025");
  // Default: a PHEV taken out today is NOT exempt, whatever it cost.
  assert.equal(isFbtExempt("phev", 60_000), false);
  assert.equal(isFbtExempt("phev", 60_000, false), false);
  // Transitional: used or available before 1 April 2025 under a binding commitment.
  assert.equal(isFbtExempt("phev", 60_000, true), true);
  // The LCT test still applies to the transitional case.
  assert.equal(isFbtExempt("phev", 95_000, true), false);
});

test("PHEV: the calculator charges FBT on a new plug-in hybrid lease", () => {
  const inputs: NovatedLeaseInputs = {
    salary: 110_000,
    vehiclePrice: 55_000,
    termYears: 4,
    annualRunningCosts: 5_000,
    vehicleType: "phev",
    fbtMethod: "statutory",
  };
  const now = calculateNovatedLease(inputs);
  assert.equal(now.exempt, false);
  assert.equal(r2(now.fbt), r2(11_000 * FBT_COST_PER_DOLLAR));

  const grandfathered = calculateNovatedLease({
    ...inputs,
    phevCommittedBefore1April2025: true,
  });
  assert.equal(grandfathered.exempt, true);
  assert.equal(grandfathered.fbt, 0);
});

// ---------- reportable fringe benefits ----------

test("RFBA is grossed up at the type 2 rate, only above $2,000", () => {
  assert.equal(reportableFringeBenefitsAmount(2_000), 0);
  // The ATO's own worked figure: $2,000.01 of taxable value reports as $3,773.
  assert.equal(reportableFringeBenefitsAmount(2_000.01), FBT.reportableMinimumGrossedUp);
  assert.equal(reportableFringeBenefitsAmount(12_000), Math.floor(12_000 * 1.8868));
  assert.equal(reportableFringeBenefitsAmount(0), 0);
});

test("an FBT-EXEMPT electric car still reports, and still raises HECS repayment income", () => {
  const inputs: NovatedLeaseInputs = {
    salary: 120_000,
    vehiclePrice: 65_000,
    termYears: 4,
    annualRunningCosts: 4_000,
    vehicleType: "bev",
    fbtMethod: "ecm",
    includeHECS: true,
  };
  const ev = calculateNovatedLease(inputs);
  assert.equal(ev.exempt, true);
  // Notional taxable value is still 20% of base value, grossed up at type 2.
  assert.equal(ev.reportableFringeBenefits, Math.floor(13_000 * FBT.grossUpType2));
  assert.equal(ev.after.incomeTestIncome, ev.after.taxableIncome + ev.reportableFringeBenefits);
  // The HECS repayment is worked out on the RFBA-inclusive income, not on
  // taxable income — the whole point of the warning on the page.
  assert.equal(ev.after.hecsRepayment, calculateHECS(ev.after.incomeTestIncome));
  assert.ok(ev.after.hecsRepayment > calculateHECS(ev.after.taxableIncome));
});

test("an RFBA also drives the Medicare levy surcharge income test", () => {
  const inputs: NovatedLeaseInputs = {
    salary: 104_000,
    vehiclePrice: 70_000,
    termYears: 5,
    annualRunningCosts: 4_000,
    vehicleType: "bev",
    fbtMethod: "ecm",
    privateHospitalCover: false,
  };
  const ev = calculateNovatedLease(inputs);
  // Taxable income falls below the tier 1 floor, but the RFBA pushes the
  // surcharge income back over it.
  assert.ok(ev.after.taxableIncome < 105_001);
  assert.ok(ev.after.incomeTestIncome > 105_001);
  assert.ok(ev.after.medicareSurcharge > 0);
});

// ---------- residual values ----------

test("minimum residuals match TD 93/142 (8-year effective life)", () => {
  const expected: Record<number, number> = { 1: 0.6563, 2: 0.5625, 3: 0.4688, 4: 0.375, 5: 0.2813 };
  for (const term of [1, 2, 3, 4, 5]) {
    assert.equal(RESIDUAL_MINIMUM_PCT[term], expected[term]);
    // 75% - [(75% / 8) x total leased period], rounded to four places.
    assert.equal(RESIDUAL_MINIMUM_PCT[term], r4(0.75 - (0.75 / 8) * term));
  }
  assert.equal(r2(minimumResidual(40_000, 3)), 18_752);
  assert.equal(minimumResidual(40_000, 7), 0);
});

// ---------- whole-model consistency ----------

test("take-home identity: nothing is counted twice", () => {
  const res = calculateNovatedLease({
    salary: 95_000,
    vehiclePrice: 50_000,
    termYears: 4,
    annualRunningCosts: 5_500,
    vehicleType: "other",
    fbtMethod: "ecm",
    includeHECS: true,
  });
  const expectedTakeHome =
    res.after.taxableIncome -
    res.after.incomeTax -
    res.after.medicareLevy -
    res.after.medicareSurcharge -
    res.after.hecsRepayment -
    res.postTaxDeduction;
  assert.equal(r2(res.after.takeHome), r2(expectedTakeHome));
  assert.equal(r2(res.annualCostToYou), r2(res.before.takeHome - res.after.takeHome));
  // The pre-tax deduction is the year's lease cost, less the post-tax
  // contribution, plus any FBT the employer has to fund.
  assert.equal(
    r2(res.preTaxDeduction),
    r2(res.annualLeaseCost - res.employeeContribution + res.fbt)
  );
  // Taxable income falls by exactly the pre-tax deduction.
  assert.equal(r2(res.after.taxableIncome), r2(res.before.taxableIncome - res.preTaxDeduction));
});

test("no lease means no change to the payslip", () => {
  const res = calculateNovatedLease({
    salary: 85_000,
    vehiclePrice: 0,
    termYears: 3,
    annualRunningCosts: 0,
    vehicleType: "other",
    fbtMethod: "ecm",
    includeHECS: true,
  });
  const plain = calculatePayBreakdown({ grossSalary: 85_000, includeHECS: true });
  assert.equal(res.preTaxDeduction, 0);
  assert.equal(res.postTaxDeduction, 0);
  assert.equal(res.fbt, 0);
  assert.equal(res.reportableFringeBenefits, 0);
  assert.equal(res.after.takeHome, plain.takeHomePay);
});

test("the pre-tax deduction is capped at the salary and flagged", () => {
  const res = calculateNovatedLease({
    salary: 40_000,
    vehiclePrice: 90_000,
    termYears: 1,
    annualRunningCosts: 20_000,
    vehicleType: "other",
    fbtMethod: "statutory",
  });
  assert.equal(res.exceedsSalary, true);
  assert.equal(res.preTaxDeduction, 40_000);
});

test("the buy-outright comparison covers the same term and ends with the same car", () => {
  const res = calculateNovatedLease({
    salary: 110_000,
    vehiclePrice: 60_000,
    termYears: 4,
    annualRunningCosts: 6_000,
    vehicleType: "bev",
    fbtMethod: "ecm",
  });
  assert.equal(res.buyTotalCost, 60_000 + 6_000 * 4);
  assert.equal(r2(res.leaseTotalCost), r2(res.annualCostToYou * 4 + res.residual));
  assert.equal(r2(res.difference), r2(res.buyTotalCost - res.leaseTotalCost));
});

// ---------- sources ----------

test("every source is an ato.gov.au URL and the verification date is stated", () => {
  assert.equal(NOVATED_LEASE_SOURCES.verifiedOn, "28 August 2026");
  for (const [key, value] of Object.entries(NOVATED_LEASE_SOURCES)) {
    if (key === "verifiedOn") continue;
    assert.ok(value.startsWith("https://www.ato.gov.au/"), `${key} must cite ato.gov.au`);
  }
  assert.ok(NOVATED_LEASE_UNVERIFIED.length > 0);
});

test("FBT year is not the income year", () => {
  assert.equal(FBT.yearStart, "1 April");
  assert.equal(FBT.yearEnd, "31 March");
  assert.equal(FBT.rate, 0.47);
  assert.equal(FBT.grossUpType1, 2.0802);
  assert.equal(FBT.grossUpType2, 1.8868);
  assert.equal(FBT.statutoryRate, 0.2);
});
