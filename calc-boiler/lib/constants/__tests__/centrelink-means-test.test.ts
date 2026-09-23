// =============================================================================
// H3 Centrelink wave 3 tests: pension assets test, deeming, DSP, CSHC, and
// both pension tests together.
//
// Run with: npm test
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  CSHC,
  DEEMING,
  DEEMING_HISTORY,
  DSP,
  PENSION_ASSETS_TEST,
  PENSION_RATES_NOW,
  applyingTest,
  assetsTaper,
  assetsTestCutOff,
  assetsTestRate,
  assetsTestReduction,
  cshcIncomeTest,
  cshcLimit,
  deemedIncomeAnnual,
  deemedIncomeFortnightly,
  dspHoursStatus,
  dspMaxRate,
  pensionMaxRate,
  type AssetsSituation,
  type Homeownership,
} from "../centrelink-means-test";
import { AGE_PENSION_RATES, SEPTEMBER_2026, agePensionFortnightly, pensionReduction } from "../centrelink-income-test";
import { CARER_PAYMENT } from "../centrelink-carer-and-support";

const SITUATIONS: AssetsSituation[] = ["single", "couple", "coupleIllness"];
const HOMES: Homeownership[] = ["homeowner", "nonHomeowner"];

// --- Assets test ------------------------------------------------------------

test("pension rates used here are the 20 September 2026 set", () => {
  assert.equal(PENSION_RATES_NOW, AGE_PENSION_RATES[SEPTEMBER_2026]);
  assert.equal(pensionMaxRate("single"), 1_237.70);
  assert.equal(pensionMaxRate("couple"), 933.00);
  assert.equal(pensionMaxRate("coupleIllness"), 1_237.70);
});

test("assets taper: $3 per $1,000 single, $1.50 each for couples", () => {
  assert.equal(assetsTaper("single"), 3);
  assert.equal(assetsTaper("couple"), 1.5);
  assert.equal(assetsTaper("coupleIllness"), 1.5);
});

test("every published part-pension cut-off is rebuilt from rate, limit and taper", () => {
  for (const s of SITUATIONS) {
    for (const h of HOMES) {
      const built = assetsTestCutOff(pensionMaxRate(s), PENSION_ASSETS_TEST.fullPensionLimit[s][h], assetsTaper(s));
      assert.equal(built, PENSION_ASSETS_TEST.partPensionCutOff[s][h], `${s}/${h}`);
    }
  }
});

test("every published transitional cut-off is rebuilt from the transitional rate", () => {
  const T = PENSION_RATES_NOW.transitional;
  for (const h of HOMES) {
    const lim = (s: AssetsSituation) => PENSION_ASSETS_TEST.fullPensionLimit[s][h];
    assert.equal(assetsTestCutOff(T.singleTotal, lim("single"), 3), PENSION_ASSETS_TEST.transitionalCutOff.single[h]);
    assert.equal(assetsTestCutOff(T.partneredEachTotal, lim("couple"), 1.5), PENSION_ASSETS_TEST.transitionalCutOff.couple[h]);
    assert.equal(assetsTestCutOff(T.singleTotal, lim("coupleIllness"), 1.5), PENSION_ASSETS_TEST.transitionalCutOff.coupleIllness[h]);
  }
});

test("the March 2026 cut-offs (DSS 'previous amount') also rebuild from the March rates", () => {
  const MAR = AGE_PENSION_RATES["2026-03-20"];
  for (const h of HOMES) {
    assert.equal(assetsTestCutOff(MAR.maxFortnightly.single.total, PENSION_ASSETS_TEST.fullPensionLimit.single[h], 3), PENSION_ASSETS_TEST.previousPartPensionCutOff.single[h]);
    assert.equal(assetsTestCutOff(MAR.maxFortnightly.coupleEach.total, PENSION_ASSETS_TEST.fullPensionLimit.couple[h], 1.5), PENSION_ASSETS_TEST.previousPartPensionCutOff.couple[h]);
  }
});

test("Carer Payment carries the same assets limits and cut-offs", () => {
  assert.equal(CARER_PAYMENT.assetsFullPension.singleHomeowner, PENSION_ASSETS_TEST.fullPensionLimit.single.homeowner);
  assert.equal(CARER_PAYMENT.assetsFullPension.coupleNonHomeowner, PENSION_ASSETS_TEST.fullPensionLimit.couple.nonHomeowner);
  assert.equal(CARER_PAYMENT.assetsCutOff.singleNonHomeowner, PENSION_ASSETS_TEST.partPensionCutOff.single.nonHomeowner);
  assert.equal(CARER_PAYMENT.assetsCutOff.coupleIllnessHomeowner, PENSION_ASSETS_TEST.partPensionCutOff.coupleIllness.homeowner);
});

test("assets test rate: full pension at the limit, $3 less per $1,000 above it", () => {
  assert.equal(assetsTestRate(333_000, "single", "homeowner"), 1_237.70);
  assert.equal(assetsTestRate(334_000, "single", "homeowner"), 1_234.70);
  assert.equal(assetsTestRate(433_000, "single", "homeowner"), 937.70);
  assert.equal(assetsTestReduction(433_000, "single", "homeowner"), 300);
  // Non-homeowner limit is $267,000 higher.
  assert.equal(assetsTestRate(700_000, "single", "nonHomeowner"), 937.70);
  // Couple: $1.50 each per $1,000 of combined assets.
  assert.equal(assetsTestRate(599_000, "couple", "homeowner"), 783.00);
  // At and beyond the published cut-off the rate is nil.
  assert.equal(assetsTestRate(745_750, "single", "homeowner"), 0);
  assert.equal(assetsTestRate(2_000_000, "couple", "nonHomeowner"), 0);
  // Just under the cut-off a small part pension is left.
  assert.ok(assetsTestRate(745_000, "single", "homeowner") > 0);
});

// --- Deeming -----------------------------------------------------------------

test("deeming settings from 20 September 2026 are the last history row", () => {
  const last = DEEMING_HISTORY[DEEMING_HISTORY.length - 1];
  assert.equal(last.from, "20 September 2026");
  assert.equal(last.lower, DEEMING.lowerRate);
  assert.equal(last.upper, DEEMING.upperRate);
  assert.equal(last.single, DEEMING.thresholds.single);
  assert.equal(last.pensionerCouple, DEEMING.thresholds.pensionerCouple);
  assert.equal(last.nonPensionerCoupleEach, DEEMING.thresholds.nonPensionerCouple);
  assert.equal(DEEMING.lowerRate, 0.0175);
  assert.equal(DEEMING.upperRate, 0.0375);
});

test("deemed income: lower rate to the threshold, upper rate above", () => {
  assert.equal(deemedIncomeAnnual(0, "single"), 0);
  assert.equal(deemedIncomeAnnual(66_800, "single"), 1_169);
  assert.equal(deemedIncomeAnnual(100_000, "single"), 1_169 + 33_200 * 0.0375);
  assert.equal(deemedIncomeAnnual(110_600, "pensionerCouple"), 1_935.5);
  assert.equal(deemedIncomeAnnual(200_000, "pensionerCouple"), 1_935.5 + 3_352.5);
  assert.equal(deemedIncomeAnnual(55_300, "nonPensionerCouple"), 967.75);
  assert.equal(deemedIncomeFortnightly(100_000, "single"), Math.round(((1_169 + 1_245) / 26) * 100) / 100);
});

test("deemed income can be recomputed on older settings for comparison", () => {
  const march = DEEMING_HISTORY.find((r) => r.from === "20 March 2026")!;
  assert.equal(deemedIncomeAnnual(100_000, "single", { lower: march.lower, upper: march.upper, threshold: march.single }), Math.round((64_200 * 0.0125 + 35_800 * 0.0325) * 100) / 100);
});

// --- DSP ---------------------------------------------------------------------

test("DSP 21+ is paid at the pension rate", () => {
  assert.equal(dspMaxRate("single21Plus"), 1_237.70);
  assert.equal(dspMaxRate("couple21PlusEach"), 933.00);
  assert.equal(DSP.publishedCutOff.single21Plus, AGE_PENSION_RATES[SEPTEMBER_2026].publishedCutOff.single);
  assert.equal(DSP.publishedCutOff.couple21PlusCombined, AGE_PENSION_RATES[SEPTEMBER_2026].publishedCutOff.coupleCombined);
  // The pension income test hits $0 exactly at the published 21+ cut-off.
  assert.equal(agePensionFortnightly(DSP.publishedCutOff.single21Plus, "single"), 0);
  assert.equal(pensionReduction(1_000, "single"), 387);
});

test("DSP under-21 rates exclude supplements, so the payment ends just below the published cut-offs", () => {
  // Rate ÷ 50c + $226 sits below the published cut-off (which includes supplements).
  const derived = (rate: number) => rate / 0.5 + 226;
  assert.ok(derived(DSP.under21.under18Dependent) < DSP.publishedCutOff.age16to17SingleAtHome);
  assert.ok(derived(DSP.under21.age18to20Dependent) < DSP.publishedCutOff.age18to20SingleAtHome);
  assert.ok(derived(DSP.under21.age18to20Independent) < DSP.publishedCutOff.age16to20SingleIndependent);
});

test("DSP hours: up to 29 a week is fine, 30+ ongoing means suspension", () => {
  assert.equal(dspHoursStatus(0), "ok");
  assert.equal(dspHoursStatus(29), "ok");
  assert.equal(dspHoursStatus(29.5), "over");
  assert.equal(dspHoursStatus(30), "suspend");
  assert.equal(dspHoursStatus(38), "suspend");
});

// --- CSHC --------------------------------------------------------------------

test("CSHC limits and the per-child addition", () => {
  assert.equal(cshcLimit("single"), 105_048);
  assert.equal(cshcLimit("couple"), 168_076);
  assert.equal(cshcLimit("coupleSeparated"), 210_096);
  assert.equal(cshcLimit("single", 2), 105_048 + 1_279.2);
  assert.equal(CSHC.assetsTest, false);
});

test("CSHC income test: ATI plus deemed account-based income must be LESS THAN the limit", () => {
  const r = cshcIncomeTest({ situation: "single", adjustedTaxableIncome: 90_000, accountBasedBalances: [300_000] });
  const deemed = 66_800 * 0.0175 + (300_000 - 66_800) * 0.0375;
  assert.equal(r.deemed, Math.round(deemed * 100) / 100);
  assert.equal(r.eligible, 90_000 + deemed < 105_048);
  // Exactly at the limit is NOT eligible.
  assert.equal(cshcIncomeTest({ situation: "single", adjustedTaxableIncome: 105_048, accountBasedBalances: [] }).eligible, false);
  assert.equal(cshcIncomeTest({ situation: "single", adjustedTaxableIncome: 105_047.99, accountBasedBalances: [] }).eligible, true);
  // Couples: each person's balance is deemed on the $55,300 threshold.
  const c = cshcIncomeTest({ situation: "couple", adjustedTaxableIncome: 150_000, accountBasedBalances: [55_300, 55_300] });
  assert.equal(c.deemed, 967.75 * 2);
  assert.equal(c.eligible, true);
});

// --- Both tests --------------------------------------------------------------

test("the lower of the two tests is paid", () => {
  assert.equal(applyingTest(900, 1_000), "income");
  assert.equal(applyingTest(1_000, 700), "assets");
  assert.equal(applyingTest(1_237.70, 1_237.70), "both");
  assert.equal(applyingTest(0, 0), "nil");
});
