// =============================================================================
// Centrelink wave 3 (H3): the pension assets test, deeming, Disability Support
// Pension, the Commonwealth Seniors Health Card and the Pensioner Concession
// Card.
//
// Every figure below was read on 24 September 2026, after the 20 September
// 2026 indexation, from the pages in MEANS_TEST_SOURCES:
//   - Services Australia assets test pages (Age Pension and DSP) — limits,
//     cut-offs and the $3 / $1.50 per $1,000 taper (stated on the DSP page;
//     both payments use the same pension assets test).
//   - The DSS rates list for the 20 September 2026 indexation — the previous
//     and new assets cut-offs and the CSHC income limits (cross-check).
//   - Services Australia's deeming page and the DSS Social Security Guide
//     4.4.1.10, which carries the full history of deeming rates and
//     thresholds, including the 20 September 2026 change to 1.75% / 3.75%.
//   - Services Australia DSP rates, income test and work pages.
//   - Services Australia CSHC income test and adjusted taxable income pages.
//
// What is DERIVED rather than published, and says so on the pages:
//   - The assets-test RATE (maximum rate less the taper). Services Australia
//     publishes limits, cut-offs and the taper, not a rate for a given asset
//     value. assetsTestCutOff() rebuilds every published cut-off from the
//     maximum rate, the full-pension limit and the taper (rounded up to the
//     next $250, as the published figures are) — the tests assert all of them.
//   - Deemed income per fortnight = annual deemed income ÷ 26.
//
// Known source discrepancy (not used): the Services Australia DSP rates page
// shows a couple's Pension Supplement as $65.50 each / $131.00 combined but a
// total of $933.00 each. The DSS rates list and the Age Pension rates page both
// give $66.50 / $133.00, which is what adds up to $933.00. We use $66.50.
//
// Not modelled: Rent Assistance (raises the cut-offs), transitional-rate
// pensioners in the calculators, non-residents, the $250 steps inside the
// assets taper, granny flat and gifting rules, grandfathered income streams.
// =============================================================================

import { AGE_PENSION_RATES, SEPTEMBER_2026, type AgePensionRateSet } from "./centrelink-income-test";

export const MEANS_TEST_SOURCES = {
  verifiedOn: "24 September 2026",
  verifiedOnISO: "2026-09-24",
  // Age Pension
  agePensionAssetsTest: "https://www.servicesaustralia.gov.au/assets-test-for-age-pension",
  agePensionRates: "https://www.servicesaustralia.gov.au/how-much-age-pension-you-can-get",
  agePensionIncomeTest: "https://www.servicesaustralia.gov.au/income-test-for-age-pension",
  agePensionWorking: "https://www.servicesaustralia.gov.au/working-while-youre-getting-age-pension",
  assetTypes: "https://www.servicesaustralia.gov.au/asset-types",
  workBonusWho: "https://www.servicesaustralia.gov.au/who-can-get-work-bonus",
  // Deeming
  deeming: "https://www.servicesaustralia.gov.au/deeming?context=22526",
  deemingHistory: "https://guides.dss.gov.au/social-security-guide/4/4/1/10",
  // DSP
  dsp: "https://www.servicesaustralia.gov.au/disability-support-pension",
  dspRates: "https://www.servicesaustralia.gov.au/payment-rates-for-disability-support-pension",
  dspIncomeTest: "https://www.servicesaustralia.gov.au/income-test-for-disability-support-payment",
  dspAssetsTest: "https://www.servicesaustralia.gov.au/assets-test-for-disability-support-pension",
  dspWork: "https://www.servicesaustralia.gov.au/working-while-you-get-disability-support-pension-dsp",
  dspNonMedical: "https://www.servicesaustralia.gov.au/non-medical-rules-for-disability-support-pension",
  // CSHC / PCC
  cshc: "https://www.servicesaustralia.gov.au/commonwealth-seniors-health-card",
  cshcWho: "https://www.servicesaustralia.gov.au/who-can-get-commonwealth-seniors-health-card",
  cshcIncomeTest: "https://www.servicesaustralia.gov.au/income-test-for-commonwealth-seniors-health-card",
  cshcBenefits: "https://www.servicesaustralia.gov.au/benefits-commonwealth-seniors-health-card",
  adjustedTaxableIncome: "https://www.servicesaustralia.gov.au/what-adjusted-taxable-income",
  pccWho: "https://www.servicesaustralia.gov.au/who-can-get-pensioner-concession-card",
  // DSS
  dssRatesList: "https://www.dss.gov.au/system/files/documents/2026-08/rates-list-20-september-2026.pdf",
  dssRatesListTitle: "Social Security Payment Parameters — 20 September 2026 indexation",
} as const;

/** The pension rate set these pages use: the one in force from 20 September 2026. */
export const PENSION_RATES_NOW: AgePensionRateSet = AGE_PENSION_RATES[SEPTEMBER_2026];

// -----------------------------------------------------------------------------
// Pension assets test (Age Pension, DSP 21+, Carer Payment)
// -----------------------------------------------------------------------------

export type AssetsSituation = "single" | "couple" | "coupleIllness";
export type Homeownership = "homeowner" | "nonHomeowner";

type ByHome = Record<Homeownership, number>;

export const PENSION_ASSETS_TEST = {
  ratesFrom: "20 September 2026",
  /** DSS reviews the limits in March, July and September (Services Australia). */
  reviewedIn: "March, July and September",
  /** Full pension up to these (couples combined). Unchanged on 20 Sep 2026 — they index on 1 July. */
  fullPensionLimit: {
    single: { homeowner: 333_000, nonHomeowner: 600_000 },
    couple: { homeowner: 499_000, nonHomeowner: 766_000 },
    coupleIllness: { homeowner: 499_000, nonHomeowner: 766_000 },
  } satisfies Record<AssetsSituation, ByHome>,
  /** Part pension cancels above these, from 20 September 2026 (published). */
  partPensionCutOff: {
    single: { homeowner: 745_750, nonHomeowner: 1_012_750 },
    couple: { homeowner: 1_121_000, nonHomeowner: 1_388_000 },
    coupleIllness: { homeowner: 1_324_500, nonHomeowner: 1_591_500 },
  } satisfies Record<AssetsSituation, ByHome>,
  /** The cut-offs in force to 19 September 2026 (DSS rates list, "Previous Amount"). */
  previousPartPensionCutOff: {
    single: { homeowner: 733_500, nonHomeowner: 1_000_500 },
    couple: { homeowner: 1_102_500, nonHomeowner: 1_369_500 },
    coupleIllness: { homeowner: 1_300_000, nonHomeowner: 1_567_000 },
  } satisfies Record<AssetsSituation, ByHome>,
  /** Transitional-rate pensions cancel above these, from 20 September 2026. */
  transitionalCutOff: {
    single: { homeowner: 665_500, nonHomeowner: 932_500 },
    couple: { homeowner: 1_035_500, nonHomeowner: 1_302_500 },
    coupleIllness: { homeowner: 1_164_000, nonHomeowner: 1_431_000 },
  } satisfies Record<AssetsSituation, ByHome>,
  /** Fortnightly reduction per $1,000 over the full-pension limit. Couples: each, on combined assets. */
  taperPerThousand: { single: 3, coupleEach: 1.5 },
  /** The published cut-offs sit on $250 steps. */
  cutOffStep: 250,
} as const;

/** Per-$1,000 taper for a situation: $3 single, $1.50 each for either kind of couple. */
export function assetsTaper(situation: AssetsSituation): number {
  return situation === "single" ? PENSION_ASSETS_TEST.taperPerThousand.single : PENSION_ASSETS_TEST.taperPerThousand.coupleEach;
}

/** Maximum fortnightly pension for ONE person in the situation. */
export function pensionMaxRate(situation: AssetsSituation, rates: AgePensionRateSet = PENSION_RATES_NOW): number {
  if (situation === "single") return rates.maxFortnightly.single.total;
  if (situation === "coupleIllness") return rates.maxFortnightly.coupleApartIllHealth.total;
  return rates.maxFortnightly.coupleEach.total;
}

/** Fortnightly reduction of ONE person's pension under the assets test. Couples: pass combined assets. */
export function assetsTestReduction(assets: number, situation: AssetsSituation, home: Homeownership): number {
  const limit = PENSION_ASSETS_TEST.fullPensionLimit[situation][home];
  const excess = Math.max(0, assets - limit);
  return (excess / 1_000) * assetsTaper(situation);
}

/** One person's fortnightly pension under the assets test alone. */
export function assetsTestRate(
  assets: number,
  situation: AssetsSituation,
  home: Homeownership,
  rates: AgePensionRateSet = PENSION_RATES_NOW,
): number {
  const r = pensionMaxRate(situation, rates) - assetsTestReduction(assets, situation, home);
  return Math.max(0, Math.round(r * 100) / 100);
}

/**
 * The assets value at which the pension reaches $0: the full-pension limit
 * plus the excess that uses up one person's maximum rate at $3 per $1,000,
 * rounded UP to the next $250 — doubled for a couple (whose $1.50 taper is
 * half of $3). Rounding per person before doubling is what reproduces the
 * published ill-health-separated couple cut-offs; every published cut-off is
 * rebuilt this way in the tests.
 */
export function assetsTestCutOff(maxRate: number, fullPensionLimit: number, taperPerThousand: number): number {
  const single = PENSION_ASSETS_TEST.taperPerThousand.single;
  const step = PENSION_ASSETS_TEST.cutOffStep;
  // Round to cents first so float noise (e.g. 311000.00000000006) cannot push a step.
  const perPerson = Math.round((maxRate / single) * 1_000 * 100) / 100;
  const stepped = Math.ceil(perPerson / step) * step;
  return fullPensionLimit + stepped * (single / taperPerThousand);
}

// -----------------------------------------------------------------------------
// Deeming
// -----------------------------------------------------------------------------

export type DeemingKind = "single" | "pensionerCouple" | "nonPensionerCouple";

export const DEEMING = {
  ratesFrom: "20 September 2026",
  thresholdsFrom: "1 July 2026",
  lowerRate: 0.0175,
  upperRate: 0.0375,
  /** Combined for a pensioner couple; EACH person's own and share of joint assets for a non-pensioner couple. */
  thresholds: { single: 66_800, pensionerCouple: 110_600, nonPensionerCouple: 55_300 } satisfies Record<DeemingKind, number>,
  /** Rates are set by the Minister for Social Services; thresholds index on 1 July. */
  setBy: "the Minister for Social Services",
} as const;

export interface DeemingHistoryRow {
  from: string;
  lower: number;
  upper: number;
  single: number;
  pensionerCouple: number;
  nonPensionerCoupleEach: number;
}

/** DSS Social Security Guide 4.4.1.10 — the most recent rows, newest last. */
export const DEEMING_HISTORY: readonly DeemingHistoryRow[] = [
  { from: "1 July 2019", lower: 0.01, upper: 0.03, single: 51_800, pensionerCouple: 86_200, nonPensionerCoupleEach: 43_100 },
  { from: "1 May 2020", lower: 0.0025, upper: 0.0225, single: 51_800, pensionerCouple: 86_200, nonPensionerCoupleEach: 43_100 },
  { from: "1 July 2020", lower: 0.0025, upper: 0.0225, single: 53_000, pensionerCouple: 88_000, nonPensionerCoupleEach: 44_000 },
  { from: "1 July 2021", lower: 0.0025, upper: 0.0225, single: 53_600, pensionerCouple: 89_000, nonPensionerCoupleEach: 44_500 },
  { from: "1 July 2022", lower: 0.0025, upper: 0.0225, single: 56_400, pensionerCouple: 93_600, nonPensionerCoupleEach: 46_800 },
  { from: "1 July 2023", lower: 0.0025, upper: 0.0225, single: 60_400, pensionerCouple: 100_200, nonPensionerCoupleEach: 50_100 },
  { from: "1 July 2024", lower: 0.0025, upper: 0.0225, single: 62_600, pensionerCouple: 103_800, nonPensionerCoupleEach: 51_900 },
  { from: "1 July 2025", lower: 0.0025, upper: 0.0225, single: 64_200, pensionerCouple: 106_200, nonPensionerCoupleEach: 53_100 },
  { from: "20 September 2025", lower: 0.0075, upper: 0.0275, single: 64_200, pensionerCouple: 106_200, nonPensionerCoupleEach: 53_100 },
  { from: "20 March 2026", lower: 0.0125, upper: 0.0325, single: 64_200, pensionerCouple: 106_200, nonPensionerCoupleEach: 53_100 },
  { from: "1 July 2026", lower: 0.0125, upper: 0.0325, single: 66_800, pensionerCouple: 110_600, nonPensionerCoupleEach: 55_300 },
  { from: "20 September 2026", lower: 0.0175, upper: 0.0375, single: 66_800, pensionerCouple: 110_600, nonPensionerCoupleEach: 55_300 },
];

/**
 * Annual deemed income on financial assets. For a pensioner couple pass the
 * COMBINED assets; for a non-pensioner couple pass ONE person's assets (the
 * threshold is per person). Optional rates let the page show earlier settings.
 */
export function deemedIncomeAnnual(
  financialAssets: number,
  kind: DeemingKind,
  rates: { lower: number; upper: number; threshold?: number } = { lower: DEEMING.lowerRate, upper: DEEMING.upperRate },
): number {
  const a = Math.max(0, financialAssets);
  const threshold = rates.threshold ?? DEEMING.thresholds[kind];
  const below = Math.min(a, threshold) * rates.lower;
  const above = Math.max(0, a - threshold) * rates.upper;
  return Math.round((below + above) * 100) / 100;
}

/** Fortnightly deemed income = annual ÷ 26, to the cent. */
export function deemedIncomeFortnightly(financialAssets: number, kind: DeemingKind): number {
  return Math.round((deemedIncomeAnnual(financialAssets, kind) / 26) * 100) / 100;
}

// -----------------------------------------------------------------------------
// Disability Support Pension
// -----------------------------------------------------------------------------

export type DspUnder21Kind = "under18Dependent" | "under18Independent" | "age18to20Dependent" | "age18to20Independent" | "coupleUnder21";

export const DSP = {
  ratesFrom: "20 September 2026",
  /** 21+ (and under 21 with a child) is paid at the pension rate — the same figures as the Age Pension. */
  rates21Plus: PENSION_RATES_NOW,
  /**
   * Under 21, no children. Include Youth Disability Supplement; EXCLUDE
   * Pharmaceutical Allowance and Energy Supplement (as the source states).
   * Index on 1 January.
   */
  under21: {
    under18Dependent: 581.50,
    under18Independent: 839.80,
    age18to20Dependent: 645.00,
    age18to20Independent: 839.80,
    coupleUnder21: 839.80,
  } satisfies Record<DspUnder21Kind, number>,
  under21IndexedOn: "1 January",
  /** Published income cut-offs, from 20 September 2026. */
  publishedCutOff: {
    single21Plus: 2_701.40,
    couple21PlusCombined: 4_128.00,
    coupleApartIllHealthCombined: 5_346.80,
    age18to20SingleAtHome: 1_543.20,
    age16to17SingleAtHome: 1_414.80,
    age16to20SingleIndependent: 1_937.80,
    age16to20CoupleCombined: 3_805.60,
  },
  /** Assets cut-offs for under 21s with no children, from 20 September 2026. */
  under21AssetsCutOff: {
    age16to17Dependent: { homeowner: 531_250, nonHomeowner: 798_250 },
    age18to20Dependent: { homeowner: 552_750, nonHomeowner: 819_750 },
    age16to20Independent: { homeowner: 618_500, nonHomeowner: 885_500 },
    age16to20CoupleCombined: { homeowner: 1_067_500, nonHomeowner: 1_334_500 },
  },
  /** Paid work allowed per week without losing DSP (income test still applies). */
  maxWorkHoursPerWeek: 29,
  /** Working this many hours a week on an ongoing basis → suspended (not cancelled). */
  suspensionHoursPerWeek: 30,
  suspensionYears: 2,
  /** Consecutive fortnights at $0 from income before suspension/cancellation. */
  nilRateFortnights: 12,
  /** Minimum claim age and the condition duration test. */
  minClaimAge: "15 years and 9 months",
  conditionYears: 2,
  /** Participation requirements apply under this age (with an assessed work capacity). */
  participationUnderAge: 35,
} as const;

/** Maximum fortnightly DSP for a person. Under-21 rates exclude supplements. */
export function dspMaxRate(kind: "single21Plus" | "couple21PlusEach" | DspUnder21Kind): number {
  if (kind === "single21Plus") return DSP.rates21Plus.maxFortnightly.single.total;
  if (kind === "couple21PlusEach") return DSP.rates21Plus.maxFortnightly.coupleEach.total;
  return DSP.under21[kind];
}

export type DspHoursStatus = "ok" | "over" | "suspend";

/** 0–29 hours: keep DSP (income test applies). 30+ ongoing: suspended for up to 2 years. */
export function dspHoursStatus(hoursPerWeek: number): DspHoursStatus {
  const h = Math.max(0, hoursPerWeek);
  if (h <= DSP.maxWorkHoursPerWeek) return "ok";
  return h >= DSP.suspensionHoursPerWeek ? "suspend" : "over";
}

// -----------------------------------------------------------------------------
// Commonwealth Seniors Health Card
// -----------------------------------------------------------------------------

export type CshcSituation = "single" | "couple" | "coupleSeparated";

export const CSHC = {
  limitsFrom: "20 September 2026",
  /** Reviewed on 20 September each year in line with CPI. */
  indexedOn: "20 September",
  /** Annual adjusted taxable income (+ deemed account-based income streams) must be LESS THAN these. */
  incomeLimit: { single: 105_048, couple: 168_076, coupleSeparated: 210_096 } satisfies Record<CshcSituation, number>,
  /** The limits to 19 September 2026 (DSS rates list, "Previous Amount"). */
  previousIncomeLimit: { single: 101_105, couple: 161_768 },
  perChild: 639.60,
  /** Employer fringe benefits count for the CSHC only above this amount. */
  fringeBenefitsThreshold: 1_000,
  assetsTest: false,
} as const;

/** The CSHC income limit for a situation and number of children in your care. */
export function cshcLimit(situation: CshcSituation, children = 0): number {
  return Math.round((CSHC.incomeLimit[situation] + Math.max(0, Math.floor(children)) * CSHC.perChild) * 100) / 100;
}

export interface CshcInput {
  situation: CshcSituation;
  /** Annual adjusted taxable income (couples: combined). */
  adjustedTaxableIncome: number;
  /** Account-based income stream balances subject to deeming — one per person. */
  accountBasedBalances: number[];
  children?: number;
}

export interface CshcResult {
  deemed: number;
  assessed: number;
  limit: number;
  eligible: boolean;
  headroom: number;
}

/**
 * CSHC income test: adjusted taxable income plus deemed income on
 * account-based income streams, which must be less than the limit. Deeming
 * here uses the non-pensioner thresholds ($66,800 single; $55,300 for each
 * member of a couple) because card holders do not get a pension.
 */
export function cshcIncomeTest(input: CshcInput): CshcResult {
  const kind: DeemingKind = input.situation === "single" ? "single" : "nonPensionerCouple";
  const deemed = input.accountBasedBalances.reduce((s, b) => s + deemedIncomeAnnual(b, kind), 0);
  const assessed = Math.round((Math.max(0, input.adjustedTaxableIncome) + deemed) * 100) / 100;
  const limit = cshcLimit(input.situation, input.children ?? 0);
  return { deemed: Math.round(deemed * 100) / 100, assessed, limit, eligible: assessed < limit, headroom: Math.round((limit - assessed) * 100) / 100 };
}

// -----------------------------------------------------------------------------
// Pensioner Concession Card — who gets it automatically (no income limit of its own)
// -----------------------------------------------------------------------------

export const PCC = {
  automaticWith: ["Age Pension", "Carer Payment", "Disability Support Pension", "Parenting Payment Single"],
  /** 55+ and on one of these for more than 9 months. */
  age55After9Months: ["JobSeeker Payment", "Parenting Payment Partnered", "Special Benefit (Australian residents)"],
  partialCapacity: ["JobSeeker Payment", "Parenting Payment Partnered", "Youth Allowance as a job seeker"],
  singlePrincipalCarer: ["JobSeeker Payment", "Youth Allowance as a job seeker"],
  keepWeeksAfterPpsEnds: 12,
  /** Kept for up to 2 years while an Age Pension or DSP is suspended for work. */
  keepYearsWhileSuspended: 2,
} as const;

// -----------------------------------------------------------------------------
// Both tests together
// -----------------------------------------------------------------------------

export type ApplyingTest = "income" | "assets" | "both" | "nil";

/** Which test sets the rate: the lower result is paid. */
export function applyingTest(incomeRate: number, assetsRate: number): ApplyingTest {
  if (incomeRate <= 0 && assetsRate <= 0) return "nil";
  if (Math.abs(incomeRate - assetsRate) < 0.005) return "both";
  return incomeRate < assetsRate ? "income" : "assets";
}
