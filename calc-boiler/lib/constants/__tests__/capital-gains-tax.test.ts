// =============================================================================
// Capital gains tax — ATO conformance tests
//
// Run with: npm test
//
// Every anchor below is one of the ATO's own named worked examples, taken from
// the raw page text retrieved 28 July 2026:
//
//   "Rhi"    — single asset, and the two-asset variant   (QC104071)
//   "Justin" — 18-month land sale, 50% discount           (QC104071)
//   "Maree"  — 6-month share sale, no discount            (QC69844)
//   "Danuta" — capital works deduction, reduced cost base (QC66022)
//   "Roya"   — 6-year rule exceeded, day apportionment    (QC66030)
//   "Helen"  — income-producing share of a home           (QC66030)
//
// The two-asset Rhi example is the important one: it pins that capital losses
// are subtracted BEFORE the 50% discount is applied. Applying the discount
// first would give $70,000 × 50% − $4,500 = $30,500 instead of the ATO's
// $32,750, understating the gain by $2,250.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  ABSENCE_RULE,
  CGT_AFFORDABLE_HOUSING,
  CGT_DISCOUNT_RATES,
  CGT_MINIMUM_OWNERSHIP_MONTHS,
  CGT_REFORM_2027,
  COST_BASE_ELEMENTS,
  apportionMainResidenceGain,
  calculateCGT,
  calculateCostBase,
  discountRateFor,
  marginalRateFor,
} from "../capital-gains-tax";

// ---------------------------------------------------------------------------
// Published discount rates
// ---------------------------------------------------------------------------

test("ATO discount rates: 50% individuals and trusts, 33.33% super funds, nil companies", () => {
  assert.equal(CGT_DISCOUNT_RATES.individual, 0.5);
  assert.equal(CGT_DISCOUNT_RATES.trust, 0.5);
  assert.equal(CGT_DISCOUNT_RATES.superFund, 0.3333);
  assert.equal(CGT_DISCOUNT_RATES.company, 0);
});

test("the ownership requirement is 12 months", () => {
  assert.equal(CGT_MINIMUM_OWNERSHIP_MONTHS, 12);
});

test("affordable rental housing lifts the discount to a maximum of 60%", () => {
  assert.equal(CGT_AFFORDABLE_HOUSING.extraDiscount, 0.1);
  assert.equal(CGT_AFFORDABLE_HOUSING.maxDiscount, 0.6);
});

test("cost base has exactly five elements, numbered 1 to 5", () => {
  assert.equal(COST_BASE_ELEMENTS.length, 5);
  assert.deepEqual(
    COST_BASE_ELEMENTS.map((e) => e.element),
    [1, 2, 3, 4, 5],
  );
});

// ---------------------------------------------------------------------------
// Discount eligibility
// ---------------------------------------------------------------------------

test("no discount when the asset was held under 12 months", () => {
  assert.equal(discountRateFor("individual", false), 0);
  assert.equal(discountRateFor("trust", false), 0);
  assert.equal(discountRateFor("superFund", false), 0);
});

test("companies cannot use the CGT discount even after 12 months", () => {
  assert.equal(discountRateFor("company", true), 0);
});

test("non-residents do not get the full discount", () => {
  assert.equal(discountRateFor("individual", true, false), 0);
  assert.equal(discountRateFor("individual", true, true), 0.5);
});

// ---------------------------------------------------------------------------
// ATO worked example: Rhi — single asset (QC104071)
// ---------------------------------------------------------------------------
//
// "Rhi buys an investment property for $500,000 and sells it 5 years later for
//  $600,000." Cost base $530,000 = $500,000 + $15,000 stamp duty + $1,200
//  conveyancing + $1,300 conveyancing on sale + $12,500 agent's commission.
//  Capital gain $70,000. Discount $70,000 × 50% = $35,000.

test("ATO 'Rhi': cost base of the investment property is $530,000", () => {
  const costBase = calculateCostBase({
    purchasePrice: 500_000,
    buyingCosts: 15_000 + 1_200,
    sellingCosts: 1_300 + 12_500,
  });
  assert.equal(costBase, 530_000);
});

test("ATO 'Rhi': single asset → $70,000 gain, $35,000 net capital gain", () => {
  const r = calculateCGT({
    purchasePrice: 500_000,
    buyingCosts: 15_000 + 1_200,
    sellingCosts: 1_300 + 12_500,
    salePrice: 600_000,
    ownedAtLeast12Months: true,
    otherIncome: 0,
  });
  assert.equal(r.costBase, 530_000);
  assert.equal(r.grossGain, 70_000);
  assert.equal(r.discountRate, 0.5);
  assert.equal(r.discountAmount, 35_000);
  assert.equal(r.netCapitalGain, 35_000);
});

// ---------------------------------------------------------------------------
// ATO worked example: Rhi — multiple assets (QC104071)
// ---------------------------------------------------------------------------
//
// Shares bought for $10,000 sold for $5,500 → capital loss of $4,500.
// "$70,000 (gain from property) − $4,500 (losses from share) = $65,500",
// then "$65,500 × 50% = $32,750".

test("ATO 'Rhi': losses are subtracted BEFORE the discount → $32,750", () => {
  const r = calculateCGT({
    purchasePrice: 500_000,
    buyingCosts: 15_000 + 1_200,
    sellingCosts: 1_300 + 12_500,
    salePrice: 600_000,
    ownedAtLeast12Months: true,
    otherIncome: 0,
    currentYearLosses: 4_500,
  });
  assert.equal(r.grossGain, 70_000);
  assert.equal(r.lossesApplied, 4_500);
  assert.equal(r.gainAfterLosses, 65_500);
  assert.equal(r.netCapitalGain, 32_750);

  // Guard against the classic inversion (discount first, then losses).
  assert.notEqual(r.netCapitalGain, 70_000 * 0.5 - 4_500);
});

test("ATO 'Rhi': the share leg on its own is a $4,500 capital loss", () => {
  const r = calculateCGT({
    purchasePrice: 10_000,
    salePrice: 5_500,
    ownedAtLeast12Months: true,
    otherIncome: 0,
  });
  assert.equal(r.grossGain, -4_500);
  assert.equal(r.isCapitalLoss, true);
  assert.equal(r.netCapitalGain, 0);
  assert.equal(r.totalTaxOnGain, 0);
});

// ---------------------------------------------------------------------------
// ATO worked example: Justin (QC104071) and Maree (QC69844)
// ---------------------------------------------------------------------------

test("ATO 'Justin': 18 months, $10,000 profit → declares $5,000", () => {
  const r = calculateCGT({
    purchasePrice: 100_000,
    salePrice: 110_000,
    ownedAtLeast12Months: true,
    otherIncome: 0,
  });
  assert.equal(r.grossGain, 10_000);
  assert.equal(r.netCapitalGain, 5_000);
});

test("ATO 'Maree': shares held 6 months, $500 gain → no discount, declares $500", () => {
  const r = calculateCGT({
    purchasePrice: 5_000,
    salePrice: 5_500,
    ownedAtLeast12Months: false,
    otherIncome: 0,
  });
  assert.equal(r.grossGain, 500);
  assert.equal(r.discountRate, 0);
  assert.equal(r.netCapitalGain, 500);
});

// ---------------------------------------------------------------------------
// ATO worked example: Danuta — capital works reduce the cost base (QC66022)
// ---------------------------------------------------------------------------
//
// Cost base $100,000, less $7,500 capital works deductions → reduced cost base
// $92,500. Sold for $90,000 → capital loss $2,500.

test("ATO 'Danuta': capital works deductions cut the cost base to $92,500", () => {
  const reducedCostBase = calculateCostBase({ purchasePrice: 100_000 }) - 7_500;
  assert.equal(reducedCostBase, 92_500);

  const r = calculateCGT({
    purchasePrice: reducedCostBase,
    salePrice: 90_000,
    ownedAtLeast12Months: true,
    otherIncome: 0,
  });
  assert.equal(r.grossGain, -2_500);
  assert.equal(r.isCapitalLoss, true);
});

// ---------------------------------------------------------------------------
// ATO worked example: Roya — 6-year rule exceeded (QC66030)
// ---------------------------------------------------------------------------
//
// "$555,000 − ($220,000 + $15,000) = $320,000"
// Non-main residence days 6,940; ownership days 9,133.
// "$320,000 × (6,940 days ÷ 9,133 days) = $243,162", then × 50% = $121,581.

test("ATO 'Roya': gain from the deemed acquisition cost base is $320,000", () => {
  const r = calculateCGT({
    purchasePrice: 220_000,
    sellingCosts: 15_000,
    salePrice: 555_000,
    ownedAtLeast12Months: true,
    otherIncome: 0,
  });
  assert.equal(r.costBase, 235_000);
  assert.equal(r.grossGain, 320_000);
});

test("ATO 'Roya': day apportionment gives an assessable gain of $243,162", () => {
  assert.equal(apportionMainResidenceGain(320_000, 6_940, 9_133), 243_162);
});

test("ATO 'Roya': net capital gain after the 50% discount is $121,581", () => {
  const assessable = apportionMainResidenceGain(320_000, 6_940, 9_133);
  const r = calculateCGT({
    purchasePrice: 0,
    salePrice: assessable,
    ownedAtLeast12Months: true,
    otherIncome: 0,
  });
  assert.equal(r.netCapitalGain, 121_581);
});

test("full main residence exemption leaves nothing assessable", () => {
  assert.equal(apportionMainResidenceGain(320_000, 0, 9_133), 0);
});

// ---------------------------------------------------------------------------
// ATO worked example: Helen — income-producing portion (QC66030)
// ---------------------------------------------------------------------------
//
// "$400,000 × 25% = $100,000" assessable, because 25% of the house was a
// doctor's surgery before she moved out.

test("ATO 'Helen': 25% income-producing share of a $400,000 gain is assessable", () => {
  const r = calculateCGT({
    purchasePrice: 0,
    salePrice: 400_000,
    ownedAtLeast12Months: true,
    otherIncome: 0,
    exemptProportion: 0.75,
  });
  assert.equal(r.exemptAmount, 300_000);
  assert.equal(r.assessableGain, 100_000);
  assert.equal(r.netCapitalGain, 50_000);
});

// ---------------------------------------------------------------------------
// Marginal rates — there is no separate CGT rate
// ---------------------------------------------------------------------------

test("the gain is taxed at marginal rates, not a flat CGT rate", () => {
  // Same $100,000 gross gain, three different incomes → three different bills.
  const low = calculateCGT({
    purchasePrice: 100_000,
    salePrice: 200_000,
    ownedAtLeast12Months: true,
    otherIncome: 30_000,
  });
  const mid = calculateCGT({
    purchasePrice: 100_000,
    salePrice: 200_000,
    ownedAtLeast12Months: true,
    otherIncome: 100_000,
  });
  const high = calculateCGT({
    purchasePrice: 100_000,
    salePrice: 200_000,
    ownedAtLeast12Months: true,
    otherIncome: 250_000,
  });

  assert.equal(low.netCapitalGain, 50_000);
  assert.equal(mid.netCapitalGain, 50_000);
  assert.equal(high.netCapitalGain, 50_000);

  // Identical net gains, materially different tax — the whole point of the page.
  assert.ok(low.totalTaxOnGain < mid.totalTaxOnGain);
  assert.ok(mid.totalTaxOnGain < high.totalTaxOnGain);
  assert.notEqual(low.effectiveRateOnGain, high.effectiveRateOnGain);
});

test("top-bracket taxpayer: $100,000 gain held 12 months is taxed on $50,000 at 45%", () => {
  const r = calculateCGT({
    purchasePrice: 100_000,
    salePrice: 200_000,
    ownedAtLeast12Months: true,
    otherIncome: 250_000,
  });
  assert.equal(r.netCapitalGain, 50_000);
  assert.equal(r.marginalRate, 0.45);
  // Wholly inside the top bracket: 45% income tax + 2% Medicare levy.
  assert.equal(r.incomeTaxOnGain, 22_500);
  assert.equal(r.totalTaxOnGain, 23_500);
  // Effective rate on the GROSS gain is half the marginal rate plus levy.
  assert.equal(Number(r.effectiveRateOnGain.toFixed(4)), 0.235);
});

test("selling one day early costs the whole discount", () => {
  const held = calculateCGT({
    purchasePrice: 100_000,
    salePrice: 200_000,
    ownedAtLeast12Months: true,
    otherIncome: 250_000,
  });
  const sold = calculateCGT({
    purchasePrice: 100_000,
    salePrice: 200_000,
    ownedAtLeast12Months: false,
    otherIncome: 250_000,
  });
  assert.equal(sold.netCapitalGain, 100_000);
  assert.equal(sold.totalTaxOnGain, 47_000);
  assert.equal(held.discountSaving, 23_500);
  assert.equal(sold.discountSaving, 0);
});

test("marginal rate lookup matches the shared FY2026-27 brackets", () => {
  assert.equal(marginalRateFor(15_000), 0);
  assert.equal(marginalRateFor(30_000), 0.15);
  assert.equal(marginalRateFor(100_000), 0.3);
  assert.equal(marginalRateFor(150_000), 0.37);
  assert.equal(marginalRateFor(250_000), 0.45);
});

// ---------------------------------------------------------------------------
// Capital losses
// ---------------------------------------------------------------------------

test("carried-forward losses reduce the gain and the excess carries on", () => {
  const r = calculateCGT({
    purchasePrice: 100_000,
    salePrice: 150_000,
    ownedAtLeast12Months: true,
    otherIncome: 90_000,
    carriedForwardLosses: 80_000,
  });
  assert.equal(r.grossGain, 50_000);
  assert.equal(r.lossesApplied, 50_000);
  assert.equal(r.gainAfterLosses, 0);
  assert.equal(r.netCapitalGain, 0);
  assert.equal(r.totalTaxOnGain, 0);
  // $30,000 of unused losses survive to future years.
  assert.equal(r.lossesCarriedForward, 30_000);
});

test("a net capital loss never reduces tax on ordinary income", () => {
  const r = calculateCGT({
    purchasePrice: 200_000,
    salePrice: 120_000,
    ownedAtLeast12Months: true,
    otherIncome: 90_000,
  });
  assert.equal(r.grossGain, -80_000);
  assert.equal(r.netCapitalGain, 0);
  assert.equal(r.totalTaxOnGain, 0);
  // Taxable income is unchanged by the loss.
  assert.equal(r.taxableIncomeWithGain, 90_000);
});

// ---------------------------------------------------------------------------
// The legislated 2027 reform
// ---------------------------------------------------------------------------

test("2027 reform is recorded as law but starts 1 July 2027", () => {
  assert.equal(CGT_REFORM_2027.startDate, "1 July 2027");
  assert.equal(CGT_REFORM_2027.firstAffectedYear, "2027-28");
  assert.equal(CGT_REFORM_2027.minimumTaxRate, 0.3);
  assert.equal(CGT_REFORM_2027.assentDate, "26 June 2026");
  assert.equal(CGT_REFORM_2027.actNumber, "Act No. 49 of 2026");
});

test("the engine still applies the 50% discount for the 2026-27 year", () => {
  // The reform does not touch gains accruing before 1 July 2027, so nothing
  // here should change until the ATO publishes indexation factors.
  const r = calculateCGT({
    purchasePrice: 100_000,
    salePrice: 200_000,
    ownedAtLeast12Months: true,
    otherIncome: 100_000,
  });
  assert.equal(r.discountRate, 0.5);
});

// ---------------------------------------------------------------------------
// Absence rule constants
// ---------------------------------------------------------------------------

test("absence rule: 6 years while income-producing, 6-month move overlap, 2 hectares", () => {
  assert.equal(ABSENCE_RULE.incomeProducingYears, 6);
  assert.equal(ABSENCE_RULE.overlapMonths, 6);
  assert.equal(ABSENCE_RULE.landLimitHectares, 2);
});

// =============================================================================
// The 2027 reform. Independently re-verified 28 July 2026 against the Act as
// hosted on the ATO's own legal database (Act No. 49, 2026, assent 26 June
// 2026) and the Parliamentary Library bills digest.
//
// The trap this guards: the ATO's CGT pages still describe the change as
// "announced in the 2026-27 Federal Budget" even after assent. It is law with
// a deferred start, and it must not be presented as a mere proposal — nor as
// something affecting the current year.
// =============================================================================

test("the 2027 reform is law, but does not touch the current income year", () => {
  assert.equal(CGT_REFORM_2027.actNumber, "Act No. 49 of 2026");
  assert.equal(CGT_REFORM_2027.assentDate, "26 June 2026");
  assert.equal(CGT_REFORM_2027.startDate, "1 July 2027");
  assert.equal(CGT_REFORM_2027.firstAffectedYear, "2027-28");
  assert.equal(CGT_REFORM_2027.minimumTaxRate, 0.3);
  // The current-year engine must be untouched by it.
  assert.equal(CGT_DISCOUNT_RATES.individual, 0.5);
});

test("the reform is not a clean switch-off of the 50% discount", () => {
  // Three carve-outs survive, and five entity types never enter indexation.
  assert.equal(CGT_REFORM_2027.discountSurvivesFor.length, 3);
  assert.ok(CGT_REFORM_2027.discountSurvivesFor.some((x) => /before 1 July 2027/.test(x)));
  assert.ok(CGT_REFORM_2027.discountSurvivesFor.some((x) => /new residential dwellings/.test(x)));
  assert.equal(CGT_REFORM_2027.indexationExcludes.length, 5);
  const excluded: readonly string[] = CGT_REFORM_2027.indexationExcludes;
  for (const e of ["companies", "foreign residents", "temporary residents"]) {
    assert.ok(excluded.includes(e), `${e} must be listed as excluded`);
  }
});

test("the deemed disposal date is the day before the new regime starts", () => {
  assert.equal(CGT_REFORM_2027.deemedDisposalDate, "30 June 2027");
  assert.equal(CGT_REFORM_2027.splitsGainsAcrossRegimes, true);
});

test("the reform cites the Act, not just the bill page", () => {
  // The ATO still calls this "announced"; linking the bill invites the same
  // misreading. The Act PDF on the ATO legal database is the authority.
  assert.match(CGT_REFORM_2027.actUrl, /ato\.gov\.au\/law\/view\/pdf\/acts\/20260049\.pdf/);
});
