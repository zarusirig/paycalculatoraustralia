// =============================================================================
// Disability Support Pension (DSP) — rates, income test, work rules. Feeds
// /disability-support-pension-calculator/ (G3, wave 4).
//
// Keyword demand (DataForSEO Labs, AU, 24 Sep 2026): disability pension 8,100
// (KD 4), centrelink disability pension 2,900 (KD 5), dsp rates 1,300 (KD 0),
// disability pension amount 390, disability pension assets test 390.
//
// SOURCES — Services Australia, read 24 September 2026 (Firecrawl scrape):
//   - Payment rates for DSP (page last updated 20 September 2026):
//     21+ (or under 21 with a child): single $1,135.40 basic + Pension
//     Supplement $88.20 + Energy Supplement $14.10 = $1,237.70; couple each
//     $855.90 basic, total $933.00; couple combined total $1,866.00. These are
//     the Age Pension figures in centrelink-income-test.ts (20 September 2026
//     set), which the tests assert.
//     NOTE: the DSP page prints the couple Pension Supplement as $65.50 each /
//     $131.00 combined, but its own totals ($933.00 / $1,866.00) only add up
//     with $66.50 / $133.00 — the figures carried in centrelink-income-test.ts
//     from the DSS 20 September 2026 rates list (re-verified at Services
//     Australia 23 Sep 2026). We use $66.50 / $133.00 (the totals are
//     unaffected) and assert the arithmetic in the tests.
//     Under 21 without children (include Youth Disability Supplement, exclude
//     Pharmaceutical Allowance and Energy Supplement): single under 18 at home
//     $581.50; single under 18 independent $839.80; single 18–20 at home
//     $645.00; single 18–20 independent $839.80; couple under 21 $839.80.
//   - Income test for DSP ("We use the pension income test"; last updated 20
//     September 2026): single free area $226/fn, 50c taper; couple $396
//     combined, 25c off each; cut-offs 21+ single $2,701.40, couple
//     $4,128.00 combined, apart due to ill health $5,346.80 combined; under-21
//     cut-offs 18–20 single at home $1,543.20, 16–17 single at home $1,414.80,
//     16–20 single independent $1,937.80, 16–20 couple $3,805.60 combined.
//     Permanently blind: no income test unless getting Rent Assistance.
//   - Assets test for DSP (limits from 20 September 2026): full pension up to
//     $333,000 single homeowner / $600,000 non-homeowner, $499,000 / $766,000
//     couple combined; part pension cut-offs $745,750 / $1,012,750 single,
//     $1,121,000 / $1,388,000 couple; taper $3 a fortnight per $1,000 single,
//     $1.50 each for couples.
//   - Working while you get DSP (last updated 18 June 2026): paid work up to
//     29 hours a week without losing DSP (income test still applies); DSP can
//     be suspended for up to 2 years if you work 30+ hours a week on an ongoing
//     basis or income is over the cut-off for more than 12 fortnights in a
//     row; exceptions for Australian Disability Enterprises, the Supported
//     Wage System and ongoing Inclusive Employment Australia support; Working
//     Credit applies; Work Bonus only at Age Pension age.
//   - Non-medical rules: at least 15 years 9 months and under Age Pension age
//     when you claim; residence rules; income and assets tests.
//   - How much you can get: "Disability Support Pension if you're Age Pension
//     age is a taxable Centrelink payment."
// =============================================================================

import { AGE_PENSION_INCOME_TEST, AGE_PENSION_RATES, SEPTEMBER_2026, agePensionFortnightly, type AgePensionRateSet, type PensionSituation } from "./centrelink-income-test";

export const DSP_VERIFIED_ON = "24 September 2026";

export const DSP_SOURCES = {
  hub: "https://www.servicesaustralia.gov.au/disability-support-pension",
  rates: "https://www.servicesaustralia.gov.au/payment-rates-for-disability-support-pension",
  howMuch: "https://www.servicesaustralia.gov.au/how-much-you-can-get-disability-support-pension",
  incomeTest: "https://www.servicesaustralia.gov.au/income-test-for-disability-support-payment",
  assetsTest: "https://www.servicesaustralia.gov.au/assets-test-for-disability-support-pension",
  working: "https://www.servicesaustralia.gov.au/working-while-you-get-disability-support-pension-dsp",
  whoCanGet: "https://www.servicesaustralia.gov.au/who-can-get-disability-support-pension",
  nonMedical: "https://www.servicesaustralia.gov.au/non-medical-rules-for-disability-support-pension",
} as const;

/**
 * DSP for people 21 and over (or under 21 with a child) is paid at the pension
 * rate: the Age Pension 20 September 2026 set, identical to the DSP rates page
 * totals (asserted in the tests).
 */
export const DSP_RATES_21_PLUS: AgePensionRateSet = AGE_PENSION_RATES[SEPTEMBER_2026];

export const DSP = {
  ratesFrom: "20 September 2026",
  /** 21+ indexes 20 March and 20 September; under-21 without children on 1 January. */
  indexation: { adult: "20 March and 20 September", youth: "1 January" },
  /** Paid work allowed each week without losing DSP (income test still applies). */
  maxWeeklyWorkHours: 29,
  /** Working this many hours a week on an ongoing basis can suspend DSP. */
  suspensionWeeklyHours: 30,
  suspensionYears: 2,
  /** Fortnights in a row over the cut-off before suspension. */
  nilRateFortnights: 12,
  /** Youngest age you can claim (15 years 9 months); paid from 16. */
  minClaimAge: "15 years and 9 months",
} as const;

/** Under-21, no dependent children. Include Youth Disability Supplement; exclude Pharmaceutical Allowance and Energy Supplement. */
export const DSP_UNDER_21 = [
  { situation: "Single, under 18, living at home (dependent)", maxFortnightly: 581.5, cutOff: 1_414.8, cutOffLabel: "16 to 17, single, no children, at home" },
  { situation: "Single, under 18, independent", maxFortnightly: 839.8, cutOff: 1_937.8, cutOffLabel: "16 to 20, single, no children, independent" },
  { situation: "Single, 18 to 20, living at home (dependent)", maxFortnightly: 645.0, cutOff: 1_543.2, cutOffLabel: "18 to 20, single, no children, at home" },
  { situation: "Single, 18 to 20, independent", maxFortnightly: 839.8, cutOff: 1_937.8, cutOffLabel: "16 to 20, single, no children, independent" },
  { situation: "Couple, under 21", maxFortnightly: 839.8, cutOff: 3_805.6, cutOffLabel: "16 to 20, couple, no children (combined)" },
] as const;

/** Published cut-offs for DSP 21+ (same as Age Pension from 20 September 2026). */
export const DSP_CUT_OFFS_21_PLUS = {
  single: 2_701.4,
  coupleCombined: 4_128.0,
  coupleApartIllHealthCombined: 5_346.8,
} as const;

/** Assets test, from 20 September 2026. Couples combined. */
export const DSP_ASSETS = {
  fullPension: { singleHomeowner: 333_000, singleNonHomeowner: 600_000, coupleHomeowner: 499_000, coupleNonHomeowner: 766_000 },
  cutOff: { singleHomeowner: 745_750, singleNonHomeowner: 1_012_750, coupleHomeowner: 1_121_000, coupleNonHomeowner: 1_388_000 },
  /** Reduction per $1,000 over the full-pension limit, per fortnight. */
  taperPer1000: { single: 3, coupleEach: 1.5 },
} as const;

export { AGE_PENSION_INCOME_TEST as DSP_INCOME_TEST };

export interface DspResult {
  max: number;
  reductionIncome: number;
  pay: number;
  /** Hours flag: within 29 hours, or at/over the 30-hour suspension line. */
  hoursStatus: "ok" | "over";
}

/**
 * DSP (21+) after the pension income test. Income is fortnightly; for couples,
 * pass combined income. Assets test not applied (see page).
 */
export function dspFortnightly(income: number, situation: PensionSituation, weeklyHours = 0): DspResult {
  const max = situation === "single" ? DSP_RATES_21_PLUS.maxFortnightly.single.total : DSP_RATES_21_PLUS.maxFortnightly.coupleEach.total;
  const pay = agePensionFortnightly(income, situation, DSP_RATES_21_PLUS);
  return {
    max,
    reductionIncome: Math.round((max - pay) * 100) / 100,
    pay,
    hoursStatus: weeklyHours >= DSP.suspensionWeeklyHours ? "over" : "ok",
  };
}

/**
 * Fortnightly reduction from the assets test (21+ rules), per person.
 *
 * Services Australia states the taper as "$3 per fortnight for every $1,000"
 * over the limit (single; $1.50 each for couples). Applied in whole $250 steps
 * ($0.75 single / $0.375 each per $250) it reproduces every published cut-off
 * exactly — e.g. single homeowner $333,000 + 1,651 × $250 = $745,750, couple
 * homeowner $499,000 + 2,488 × $250 = $1,121,000 — which the tests assert. The
 * $250 step is therefore DERIVED from the published figures, not quoted.
 */
export function dspAssetsReduction(assets: number, situation: PensionSituation, homeowner: boolean): number {
  const limit = situation === "single"
    ? homeowner ? DSP_ASSETS.fullPension.singleHomeowner : DSP_ASSETS.fullPension.singleNonHomeowner
    : homeowner ? DSP_ASSETS.fullPension.coupleHomeowner : DSP_ASSETS.fullPension.coupleNonHomeowner;
  const steps = Math.floor(Math.max(0, assets - limit) / 250);
  const perStep = (situation === "single" ? DSP_ASSETS.taperPer1000.single : DSP_ASSETS.taperPer1000.coupleEach) / 4;
  return Math.round(steps * perStep * 100) / 100;
}

/** DSP (21+) after both tests: the lower result is paid. */
export function dspAfterBothTests(income: number, assets: number, situation: PensionSituation, homeowner: boolean): { incomeTest: number; assetsTest: number; pay: number } {
  const max = situation === "single" ? DSP_RATES_21_PLUS.maxFortnightly.single.total : DSP_RATES_21_PLUS.maxFortnightly.coupleEach.total;
  const incomeTest = dspFortnightly(income, situation).pay;
  const assetsTest = Math.max(0, Math.round((max - dspAssetsReduction(assets, situation, homeowner)) * 100) / 100);
  return { incomeTest, assetsTest, pay: Math.min(incomeTest, assetsTest) };
}
