// =============================================================================
// Australian Tax Constants & Calculator Functions — FY2026-27
// Single source of truth for the whole site.
//
// From 1 July 2026 the second marginal rate fell from 16% to 15% (Treasury
// Laws Amendment (Cost of Living Tax Cuts) Act 2025). TAX_BRACKETS is the
// current year; TAX_BRACKETS_2025_26 is retained for /tax-bracket-history/
// and year-over-year comparisons ONLY — do not compute current figures with it.
// =============================================================================

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  base: number;
  label: string;
}

// ---------- Income Tax Brackets (FY2026-27, Residents) — CURRENT ----------
export const TAX_BRACKETS_2026_27: readonly TaxBracket[] = [
  { min: 0, max: 18_200, rate: 0, base: 0, label: "Tax-free threshold" },
  { min: 18_201, max: 45_000, rate: 0.15, base: 0, label: "15c for each $1 over $18,200" },
  { min: 45_001, max: 135_000, rate: 0.30, base: 4_020, label: "30c for each $1 over $45,000" },
  { min: 135_001, max: 190_000, rate: 0.37, base: 31_020, label: "37c for each $1 over $135,000" },
  { min: 190_001, max: Infinity, rate: 0.45, base: 51_370, label: "45c for each $1 over $190,000" },
] as const;

/** Alias for the current financial year's scale. Prefer this in new code. */
export const TAX_BRACKETS = TAX_BRACKETS_2026_27;

/** The second-bracket marginal rate, used to derive LITO's effective threshold. */
export const SECOND_BRACKET_RATE = 0.15;

// ---------- Income Tax Brackets (FY2025-26) — HISTORICAL ONLY ----------
export const TAX_BRACKETS_2025_26: readonly TaxBracket[] = [
  { min: 0, max: 18_200, rate: 0, base: 0, label: "Tax-free threshold" },
  { min: 18_201, max: 45_000, rate: 0.16, base: 0, label: "16c for each $1 over $18,200" },
  { min: 45_001, max: 135_000, rate: 0.30, base: 4_288, label: "30c for each $1 over $45,000" },
  { min: 135_001, max: 190_000, rate: 0.37, base: 31_288, label: "37c for each $1 over $135,000" },
  { min: 190_001, max: Infinity, rate: 0.45, base: 51_638, label: "45c for each $1 over $190,000" },
] as const;

export const TAX_FREE_THRESHOLD = 18_200;

// ---------- Non-Resident Tax Brackets (FY2025-26) ----------
export const NON_RESIDENT_TAX_BRACKETS: readonly TaxBracket[] = [
  { min: 0, max: 135_000, rate: 0.30, base: 0, label: "30c for each $1" },
  { min: 135_001, max: 190_000, rate: 0.37, base: 40_500, label: "37c for each $1 over $135,000" },
  { min: 190_001, max: Infinity, rate: 0.45, base: 60_850, label: "45c for each $1 over $190,000" },
] as const;

// ---------- Low Income Tax Offset (LITO) ----------
export const LITO = {
  maxOffset: 700,
  fullOffsetCeiling: 37_500,
  phaseOut1: { start: 37_501, end: 45_000, rate: 0.05 },
  phaseOut2: { start: 45_001, end: 66_667, rate: 0.015 },
  nilOffsetIncome: 66_667,
  // Derived, never hardcoded: the income at which LITO exactly cancels the tax
  // on the second bracket. It moves whenever that rate moves — at 16% it was
  // $22,575, at 15% (FY2026-27) it is $22,867.
  effectiveTaxFreeThreshold:
    TAX_FREE_THRESHOLD + Math.round(700 / SECOND_BRACKET_RATE),
} as const;

// ---------- Medicare Levy ----------
//
// ⚠️ TWO DIFFERENT INCOME YEARS LIVE IN THIS OBJECT. Corrected 28 July 2026
// after re-verification; the block was previously headed "FY2026-27", which
// was wrong for half of it.
//
//  - The low-income THRESHOLDS below are the 2025-26 figures. The ATO has not
//    published 2026-27 levy thresholds: QC27031, last updated 30 June 2026,
//    still reads "In 2025-26, you don't have to pay the Medicare levy if...".
//    They are correct, and they are correctly labelled 2025-26 on the page.
//  - The SURCHARGE tiers are genuinely 2026-27, per ATO "Medicare levy
//    surcharge income, thresholds and rates", last updated 22 June 2026.
//
// Label them separately wherever they are rendered. This mirrors how
// sapto.ts and zone-tax-offset.ts handle the same lag — the ATO publishes
// offset and levy thresholds well after the income year starts, and asserting
// the current year for them would be inventing data.
//
// Seniors and pensioners levy thresholds are NOT here — they live in
// lib/constants/medicare-levy-extra.ts alongside the family/seniors engine.
export const MEDICARE_LEVY = {
  rate: 0.02,
  lowIncomeThreshold: 28_011,
  shadeInThreshold: 35_013,
  shadeInRate: 0.10,
  familyThreshold: 47_238,
  additionalChild: 4_338,
  surcharge: {
    tier1: { min: 105_001, max: 123_000, rate: 0.01 },
    tier2: { min: 123_001, max: 164_000, rate: 0.0125 },
    tier3: { min: 164_001, max: Infinity, rate: 0.015 },
    familyTier1: { min: 210_001, max: 246_000, rate: 0.01 },
    familyTier2: { min: 246_001, max: 328_000, rate: 0.0125 },
    familyTier3: { min: 328_001, max: Infinity, rate: 0.015 },
  },
} as const;

// ---------- Superannuation Guarantee (FY2026-27) ----------
// Source: ATO "Super guarantee" key rates and thresholds, last updated
// 17 April 2026, and ATO "Contributions caps".
//
// 12% is the legislated ceiling — there are no further general step-ups. The
// only remaining escalation is Norfolk Island's transitional rate (11% for
// FY2026-27, reaching 12% on 1 July 2027).
//
// Payday Super commenced 1 July 2026: SG is owed each payday, calculated on
// QUALIFYING EARNINGS rather than ordinary time earnings, and the maximum
// contribution base became an ANNUAL figure instead of a quarterly one.
export const SUPER_GUARANTEE = {
  rate: 0.12,
  effectiveDate: "1 July 2025",
  previousRate: 0.115,
  norfolkIslandRate: 0.11,
  /** Annual from 1 July 2026 (Payday Super). Formula: cap × 100 ÷ 12. */
  maxContributionBaseAnnual: 270_830,
  maxSGAnnual: 32_499.60,
  /** Quarterly base applied only to quarters ending on or before 30 June 2026. */
  maxContributionBasePerQuarterUntil2026: 62_500,
  maxSGPerQuarterUntil2026: 7_500,
  concessionalCap: 32_500,
  concessionalCapPrevious: 30_000,
  nonConcessionalCap: 130_000,
  nonConcessionalCapPrevious: 120_000,
  bringForwardCap: 390_000,
  transferBalanceCap: 2_100_000,
  paydaySuperStart: "1 July 2026",
} as const;

// ---------- Super Guarantee Charge (SGC) ----------
//
// Verified at ato.gov.au 28 July 2026. Sources: QC105848 (what happens if you
// don't pay super correctly), QC107591 (penalties), QC33743 (the legacy
// quarterly SGC), QC105846 (payment deadlines).
//
// TWO REGIMES RUN IN PARALLEL and conflating them is the accuracy risk here.
// Payday Super commenced 1 July 2026 (Treasury Laws Amendment (Payday
// Superannuation) Act 2025, Act No. 57 of 2025, assent 6 November 2025), and
// rebuilt the SGC completely. The old quarterly charge still governs earnings
// paid up to 30 June 2026, so both sets of figures remain live — the last
// quarterly statement is due 28 August 2026.
export const SUPER_GUARANTEE_CHARGE = {
  /** Regime for qualifying earnings paid from 1 July 2026. */
  current: {
    /** Contributions must be RECEIVED by the fund within this many business days of payday. */
    businessDaysToPay: 7,
    /**
     * Extended deadline. Covers TWO cases, not one: a new employee, AND a
     * first contribution to a new complying fund for an existing employee
     * after you stopped contributing to another fund.
     */
    businessDaysNewEmployee: 20,
    /** Interest accrues at the general interest charge rate, compounded daily. */
    interestBasis: "general interest charge, compounded daily",
    /**
     * The SGC has exactly FOUR components per QE day. The late payment
     * penalty is NOT one of them — see latePayment below.
     */
    components: [
      "individual final super guarantee shortfall",
      "notional earnings",
      "administrative uplift",
      "choice loading",
    ],
    /** Administrative uplift, before reductions. */
    administrativeUpliftMax: 0.6,
    administrativeUpliftMin: 0,
    /**
     * Two INDEPENDENT reductions that stack — not one all-or-nothing test.
     * No ATO-initiated assessment in the 2 years to the QE day: −20 points.
     * Voluntary disclosure before assessment: up to −40 points, by speed.
     * Percentages below are the resulting uplift.
     */
    upliftSchedule: [
      { disclosure: "Within 30 days", noPriorAssessment: 0, priorAssessment: 20 },
      { disclosure: "31–60 days", noPriorAssessment: 5, priorAssessment: 25 },
      { disclosure: "61–120 days", noPriorAssessment: 10, priorAssessment: 30 },
      { disclosure: "More than 120 days", noPriorAssessment: 25, priorAssessment: 45 },
      { disclosure: "Not lodged", noPriorAssessment: 40, priorAssessment: 60 },
    ],
    /**
     * Loading where choice-of-fund rules were not followed. NOTE: 25% of the
     * VALUE OF CONTRIBUTIONS, not of the shortfall, and the cap is per NOTICE
     * PERIOD — not per QE day, per year or per employee.
     */
    choiceLoading: 0.25,
    choiceLoadingCap: 1_200,
    choiceLoadingBasis: "value of contributions",
    choiceLoadingCapBasis: "notice period",
    /**
     * NOT an SGC component. A separate penalty that arises only after the SGC
     * is assessed, goes unpaid 28 days, a Notice to Pay issues, and it is
     * still unpaid a further 28 days.
     */
    latePayment: {
      penalty: 0.25,
      penaltyRepeatWithin24Months: 0.5,
      /** The ATO's literal wording — but see exceptionalCircumstances. */
      cannotBeRemitted: true,
      /** A 0% pathway does exist, so never write "no way out". */
      exceptionalCircumstances: true,
    },
    /** The charge became deductible for QE days from 1 July 2026. */
    taxDeductible: true,
    /** Deductible components. */
    deductibleComponents: [
      "individual final super guarantee shortfall",
      "notional earnings",
      "administrative uplift",
      "choice loading",
    ],
    /** Still NOT deductible even under the new regime. */
    nonDeductible: [
      "general interest charge accruing on a late SGC payment",
      "the late payment penalty",
      "SGC relating to quarterly periods before 1 July 2026",
    ],
    /** Employers no longer lodge a statement; the ATO assesses. */
    requiresStatement: false,
  },
  /** Regime for earnings paid up to 30 June 2026. Still live for the June quarter. */
  legacy: {
    nominalInterestRate: 0.1,
    adminFeePerEmployeePerQuarter: 20,
    choiceLiabilityCap: 500,
    taxDeductible: false,
    requiresStatement: true,
    /** Final quarterly SG due date, and the statement deadline that follows it. */
    finalQuarterSGDue: "28 July 2026",
    finalQuarterStatementDue: "28 August 2026",
    /** Nominal interest here cannot be reduced or waived, by law. */
    nominalInterestCanBeRemitted: false,
    /** The late payment offset is NOT available for the final June quarter. */
    latePaymentOffsetAvailableFinalQuarter: false,
    /** Contributions received on or after this date cannot be applied to the June quarter. */
    tooLateForJuneQuarter: "29 July 2026",
  },
} as const;

/**
 * Qualifying earnings — what Payday Super calculates SG on from 1 July 2026.
 *
 * ⚠️ THE POPULAR SUMMARY OF THIS IS WRONG, and the ATO's own overview page
 * invites the error by describing QE as "ordinary time earnings, all
 * commissions, salary sacrifice contributions and other amounts…". Competitors
 * paraphrase that into "super now applies to overtime and bonuses". It does not.
 *
 * Verified 28 July 2026 at QC105843, which states plainly: "The only additional
 * payment type is commissions for work done entirely outside ordinary hours."
 * Everything included in SG up to 30 June 2026 continues to be included, and
 * the ATO confirms "There are no changes to what payments are considered
 * ordinary time earnings under Payday Super."
 */
export const QUALIFYING_EARNINGS = {
  onlyChangeFromOTE: "commissions for work done entirely outside ordinary hours",
  /** Still excluded, despite widespread claims to the contrary. */
  stillExcluded: [
    "overtime, where ordinary hours are clearly identified in an award or agreement",
    "bonuses solely for work performed entirely outside ordinary hours",
    "annual leave loading linked to a lost opportunity to work overtime",
    "expense allowances expected to be fully expended",
  ],
  stillIncluded: [
    "ordinary time earnings",
    "ordinary commissions",
    "performance, Christmas, sign-on and referral bonuses",
    "annual leave loading other than the lost-overtime kind",
    "task allowances for skill, adverse conditions or retention",
    "salary sacrificed amounts that would otherwise be qualifying earnings",
  ],
  sourceUrl:
    "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-on-payday/what-payments-are-qualifying-earnings",
} as const;

/**
 * Concessional cap relief for the Payday Super changeover.
 *
 * ⚠️ ANNOUNCED BUT NOT LAW. The ATO's changeover page, last updated 27 July
 * 2026, says in terms: "This is not yet law." Treasury's February 2026 media
 * release is in the future tense ("We will introduce technical amendments").
 * No bill located as at 28 July 2026.
 *
 * Do not write "relief is available". Do not write "relief was abandoned".
 * The defensible line is: announced, not legislated, no bill located.
 */
export const PAYDAY_SUPER_CAP_RELIEF = {
  announced: true,
  isLaw: false,
  announcedBy: "Treasury, 24 February 2026",
  atoWording: "This is not yet law.",
  purpose:
    "to avoid employees exceeding their concessional contributions cap in 2026-27 because Payday Super shifted the timing of contributions",
} as const;

/**
 * General interest charge — the rate that drives SGC notional earnings under
 * Payday Super, compounded daily.
 *
 * ⚠️ THIS RESETS EVERY QUARTER. It is the fastest-staling figure on the site.
 * The quarter label is rendered next to the rate wherever it appears so a
 * stale value is visible to a reader rather than silently wrong, and a test
 * asserts the label is non-empty. Re-check at the start of each quarter at
 * ato.gov.au (General interest charge rates).
 */
export const GENERAL_INTEREST_CHARGE = {
  annualRate: 0.1143,
  /**
   * The ATO publishes the daily rate explicitly. QUOTE IT — do not derive it
   * by dividing the annual rate, which lands on a different last digit.
   */
  dailyRatePercent: 0.03131507,
  quarter: "July–September 2026",
  previousQuarter: { label: "April–June 2026", annualRate: 0.1096 },
  resetsQuarterly: true,
  /** Next quarter's rate is generally announced ~2 weeks before it starts. */
  nextRateDue: "mid-September 2026",
  sourceUrl: "https://www.ato.gov.au/tax-rates-and-codes/general-interest-charge-rates",
} as const;

// ---------- HECS-HELP Repayment (FY2025-26 — New Marginal System) ----------
export interface HECSBand {
  min: number;
  max: number;
  marginalRate: number;
  base: number;
  label: string;
}

// FY2026-27 thresholds per ATO "Study and training loan repayment thresholds
// and rates", last updated 30 June 2026. Indexation applied 1 June 2026: 2.8%.
// The $9,028 base is the ATO's published figure — its own worked example
// reconciles to it ($137,064 → $9,028 + $1,248.99 = $10,276.99).
export const HECS_HELP = {
  minimumThreshold: 69_528,
  repaymentSystem: "Marginal" as const,
  previousThreshold: 67_000,
  indexationDate: "1 June 2026",
  indexationRate: 0.028,
  bands: [
    { min: 0, max: 69_528, marginalRate: 0, base: 0, label: "Below threshold" },
    { min: 69_529, max: 129_717, marginalRate: 0.15, base: 0, label: "15c per $1 over $69,528" },
    { min: 129_718, max: 186_050, marginalRate: 0.17, base: 9_028, label: "$9,028 + 17c per $1 over $129,717" },
    { min: 186_051, max: Infinity, marginalRate: 0.10, base: 0, label: "10% of total repayment income" },
  ] as readonly HECSBand[],
} as const;

/** FY2025-26 bands, retained for year-over-year comparison only. */
export const HECS_HELP_2025_26 = {
  minimumThreshold: 67_000,
  bands: [
    { min: 0, max: 67_000, marginalRate: 0, base: 0, label: "Below threshold" },
    { min: 67_001, max: 125_000, marginalRate: 0.15, base: 0, label: "15c per $1 over $67,000" },
    { min: 125_001, max: 179_285, marginalRate: 0.17, base: 8_700, label: "$8,700 + 17c per $1 over $125,000" },
    { min: 179_286, max: Infinity, marginalRate: 0.10, base: 0, label: "10% of total repayment income" },
  ] as readonly HECSBand[],
} as const;

// ---------- Employment ----------
// National Minimum Wage from 1 July 2026 (Fair Work Commission Annual Wage
// Review 2026; award minimums rose 4.75%). FY2025-26 was $24.95 / $948.00.
export const EMPLOYMENT = {
  minimumWageHourly: 26.44,
  minimumWageWeekly: 1_004.90,
  minimumWageHourlyPrevious: 24.95,
  minimumWageWeeklyPrevious: 948.00,
  standardWeeklyHours: 38,
  // 52, not 52.18. Every other Australian pay site — wagecalculator, payly,
  // salaryadviser, fairworkmate — and the AI Overview divide by 52. On $80,000
  // the 52.18 basis gave $40.35 against their $40.49; being the only site with
  // a different number reads as an error rather than precision.
  weeksPerYear: 52,
  /** 38 × 52 = 1,976. Single source of truth for salary↔hourly conversion. */
  hoursPerYear: 1_976,
  casualLoading: 0.25,
  annualLeaveWeeks: 4,
  personalLeaveDays: 10,
  penaltyRates: {
    saturdayMin: 1.25,
    saturdayMax: 1.5,
    sundayMin: 1.5,
    sundayMax: 2.0,
    publicHolidayMin: 2.0,
    publicHolidayMax: 2.5,
  },
} as const;

// ---------- Redundancy Pay (NES) ----------
export const REDUNDANCY_WEEKS: readonly { years: string; weeks: number }[] = [
  { years: "1", weeks: 4 },
  { years: "2", weeks: 6 },
  { years: "3", weeks: 7 },
  { years: "4", weeks: 8 },
  { years: "5", weeks: 10 },
  { years: "6", weeks: 11 },
  { years: "7", weeks: 13 },
  { years: "8", weeks: 14 },
  { years: "9", weeks: 16 },
  { years: "10+", weeks: 12 },
] as const;

// ---------- Notice Period (NES) ----------
export const NOTICE_PERIODS: readonly { years: string; weeks: number }[] = [
  { years: "Up to 1 year", weeks: 1 },
  { years: "1–3 years", weeks: 2 },
  { years: "3–5 years", weeks: 3 },
  { years: "5+ years", weeks: 4 },
] as const;

// ---------- State Payroll Tax ----------
export const STATE_PAYROLL_TAX = {
  NSW: { rate: 0.0545, threshold: 1_200_000, name: "New South Wales" },
  VIC: { rate: 0.0485, threshold: 900_000, name: "Victoria" },
  QLD: { rate: 0.0475, threshold: 1_300_000, name: "Queensland" },
  WA: { rate: 0.055, threshold: 1_000_000, name: "Western Australia" },
} as const;

// ---------- Tax Year History (for Stage 3 context) ----------
export const TAX_HISTORY = {
  stage3TaxCuts: {
    effectiveDate: "1 July 2024",
    changes: [
      "Bracket 1 rate reduced from 19% to 16%",
      "Bracket 2 upper limit expanded from $120K to $135K",
    ],
  },
  upcomingFY2026_27: {
    changes: ["Bracket 1 rate reduces from 16% to 15%"],
    effectiveDate: "1 July 2026",
  },
} as const;

// ---------- SG Rate History ----------
export const SG_RATE_HISTORY: readonly { year: string; rate: number }[] = [
  { year: "FY2021-22", rate: 0.10 },
  { year: "FY2022-23", rate: 0.105 },
  { year: "FY2023-24", rate: 0.11 },
  { year: "FY2024-25", rate: 0.115 },
  { year: "FY2025-26", rate: 0.12 },
] as const;

// ---------- Institutional References ----------
export const SOURCES = {
  ato: { name: "Australian Taxation Office", url: "https://www.ato.gov.au", abbr: "ATO" },
  fwc: { name: "Fair Work Commission", url: "https://www.fwc.gov.au", abbr: "FWC" },
  fwo: { name: "Fair Work Ombudsman", url: "https://www.fairwork.gov.au", abbr: "FWO" },
  servicesAustralia: { name: "Services Australia", url: "https://www.servicesaustralia.gov.au" },
  abs: { name: "Australian Bureau of Statistics", url: "https://www.abs.gov.au", abbr: "ABS" },
} as const;

// ---------- Site Config ----------
export const SITE_CONFIG = {
  financialYear: "2026-27",
  financialYearStart: "1 July 2026",
  financialYearEnd: "30 June 2027",
  previousFinancialYear: "2025-26",
  lastVerified: "28 July 2026",
  domain: "pay-calculator-australia.com",
  baseUrl: "https://pay-calculator-australia.com",
  email: "hello@pay-calculator-australia.com",
  name: "Pay Calculator Australia",
} as const;


// =============================================================================
// CALCULATOR FUNCTIONS
// =============================================================================

/**
 * Calculate income tax for a given taxable income (FY2025-26, resident).
 * Uses progressive marginal rates per EAV Knowledge Base.
 */
export function calculateIncomeTax(income: number, resident = true): number {
  if (income <= 0) return 0;
  const brackets = resident ? TAX_BRACKETS : NON_RESIDENT_TAX_BRACKETS;

  for (let i = brackets.length - 1; i >= 0; i--) {
    const bracket = brackets[i];
    if (income >= bracket.min) {
      return bracket.base + (income - (bracket.min - 1)) * bracket.rate;
    }
  }
  return 0;
}

/**
 * Calculate Low Income Tax Offset.
 * Non-refundable — can reduce tax to zero, not below.
 */
export function calculateLITO(income: number): number {
  if (income <= LITO.fullOffsetCeiling) return LITO.maxOffset;
  if (income <= LITO.phaseOut1.end) {
    return LITO.maxOffset - (income - LITO.fullOffsetCeiling) * LITO.phaseOut1.rate;
  }
  if (income <= LITO.phaseOut2.end) {
    const reduction1 = (LITO.phaseOut1.end - LITO.fullOffsetCeiling) * LITO.phaseOut1.rate;
    const reduction2 = (income - LITO.phaseOut1.end) * LITO.phaseOut2.rate;
    return Math.max(0, LITO.maxOffset - reduction1 - reduction2);
  }
  return 0;
}

/**
 * Calculate Medicare Levy (standard 2%).
 */
export function calculateMedicareLevy(income: number): number {
  if (income <= 0) return 0;
  // Low-income shading: nil below the threshold, then phasing in at 10c per $1
  // over it until the full 2% applies. Previously this returned a flat 2% from
  // the first dollar, which overstated the levy for every low-income earner.
  if (income <= MEDICARE_LEVY.lowIncomeThreshold) return 0;
  const shaded = (income - MEDICARE_LEVY.lowIncomeThreshold) * MEDICARE_LEVY.shadeInRate;
  return Math.round(Math.min(income * MEDICARE_LEVY.rate, shaded));
}

/**
 * Calculate Medicare Levy Surcharge (if no private health insurance).
 */
export function calculateMedicareSurcharge(income: number, hasPrivateHealth: boolean): number {
  if (hasPrivateHealth || income <= MEDICARE_LEVY.surcharge.tier1.min - 1) return 0;
  if (income <= MEDICARE_LEVY.surcharge.tier1.max) return Math.round(income * MEDICARE_LEVY.surcharge.tier1.rate);
  if (income <= MEDICARE_LEVY.surcharge.tier2.max) return Math.round(income * MEDICARE_LEVY.surcharge.tier2.rate);
  return Math.round(income * MEDICARE_LEVY.surcharge.tier3.rate);
}

/**
 * Calculate HECS-HELP repayment under the NEW marginal system (FY2025-26).
 */
export function calculateHECS(income: number): number {
  if (income <= HECS_HELP.minimumThreshold) return 0;

  // Driven entirely by HECS_HELP.bands. Previously the band boundaries were
  // hardcoded here ($125,000) and silently disagreed with the band data once
  // the thresholds were indexed, producing $11,079 where the ATO's own worked
  // example gives $10,276.99.
  const bands = HECS_HELP.bands;

  // Top band: a flat percentage of total repayment income, not a marginal rate.
  const top = bands[bands.length - 1];
  if (income >= top.min) {
    return Math.round(income * top.marginalRate);
  }

  // Marginal bands: base plus the rate applied to income above the band floor.
  for (let i = bands.length - 2; i >= 1; i--) {
    const band = bands[i];
    if (income >= band.min) {
      return Math.round(band.base + (income - (band.min - 1)) * band.marginalRate);
    }
  }

  return 0;
}

/**
 * Calculate employer superannuation contribution (SG).
 * This does NOT reduce take-home — it's paid ON TOP of salary.
 */
export function calculateSuper(income: number): number {
  if (income <= 0) return 0;
  return Math.round(income * SUPER_GUARANTEE.rate);
}

/**
 * Full pay breakdown — the core calculator.
 */
export interface PayBreakdown {
  grossSalary: number;
  taxableIncome: number;
  incomeTax: number;
  litoOffset: number;
  netIncomeTax: number;
  medicareLevy: number;
  medicareSurcharge: number;
  hecsRepayment: number;
  totalDeductions: number;
  takeHomePay: number;
  superContribution: number;
  totalPackage: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  daily: number;
  weekly: number;
  fortnightly: number;
  monthly: number;
  bonus: number;
  overtimeEarnings: number;
  novatedLease: number;
}

export interface CalculatorInputs {
  grossSalary: number;
  includeHECS?: boolean;
  hasPrivateHealth?: boolean;
  salarySacrifice?: number;
  resident?: boolean;
  superIncluded?: boolean;
  proRataHours?: number;
  bonus?: number;
  overtimeHours?: number;
  overtimeRate?: number;
  novatedLease?: number;
  includeBonusInSG?: boolean;
  includeOvertimeInSG?: boolean;
}

export function calculatePayBreakdown(inputs: CalculatorInputs): PayBreakdown {
  const {
    grossSalary: rawGrossSalary,
    includeHECS = false,
    hasPrivateHealth = true,
    salarySacrifice = 0,
    resident = true,
    superIncluded = false,
    proRataHours,
    bonus = 0,
    overtimeHours = 0,
    overtimeRate = 1.5,
    novatedLease = 0,
    includeBonusInSG = false,
    includeOvertimeInSG = false,
  } = inputs;

  // Step 1: Handle super-inclusive salary
  const baseSalary = superIncluded
    ? Math.round(rawGrossSalary / (1 + SUPER_GUARANTEE.rate))
    : rawGrossSalary;

  // Step 2: Handle pro-rata / part-time
  const proRataMultiplier =
    proRataHours != null && proRataHours > 0 && proRataHours < EMPLOYMENT.standardWeeklyHours
      ? proRataHours / EMPLOYMENT.standardWeeklyHours
      : 1;
  const grossSalary = Math.round(baseSalary * proRataMultiplier);

  // Step 3: Calculate overtime earnings
  const baseHourlyRate = grossSalary / (52 * EMPLOYMENT.standardWeeklyHours);
  const overtimeEarnings = Math.round(overtimeHours * baseHourlyRate * overtimeRate * 52);

  // Step 4: Calculate taxable income
  const taxableIncome = Math.max(
    0,
    grossSalary + bonus + overtimeEarnings - salarySacrifice - novatedLease
  );

  // Income tax
  const rawTax = calculateIncomeTax(taxableIncome, resident);
  const litoOffset = resident ? calculateLITO(taxableIncome) : 0;
  const netIncomeTax = Math.max(0, Math.round(rawTax - litoOffset));

  // Medicare
  const medicareLevy = calculateMedicareLevy(taxableIncome);
  const medicareSurcharge = calculateMedicareSurcharge(taxableIncome, hasPrivateHealth);

  // HECS
  const hecsRepayment = includeHECS ? calculateHECS(taxableIncome) : 0;

  // Totals
  const totalDeductions = netIncomeTax + medicareLevy + medicareSurcharge + hecsRepayment;
  const takeHomePay = taxableIncome - totalDeductions;

  // Super (employer-paid, not deducted from salary)
  let superBase = grossSalary;
  if (includeBonusInSG) superBase += bonus;
  if (includeOvertimeInSG) superBase += overtimeEarnings;
  const superContribution = superIncluded
    ? Math.round(rawGrossSalary - baseSalary) // super was embedded in the original figure
    : calculateSuper(superBase);
  const totalPackage = grossSalary + bonus + overtimeEarnings + superContribution;

  // Rates
  const effectiveTaxRate = taxableIncome > 0 ? totalDeductions / taxableIncome : 0;

  // Find marginal rate
  let marginalTaxRate = 0;
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome >= bracket.min) {
      marginalTaxRate = bracket.rate + MEDICARE_LEVY.rate;
    }
  }

  return {
    grossSalary,
    taxableIncome,
    incomeTax: Math.round(rawTax),
    litoOffset: Math.round(litoOffset),
    netIncomeTax,
    medicareLevy,
    medicareSurcharge,
    hecsRepayment,
    totalDeductions,
    takeHomePay,
    superContribution,
    totalPackage,
    effectiveTaxRate,
    marginalTaxRate,
    daily: Math.round((takeHomePay / 260) * 100) / 100,
    weekly: Math.round((takeHomePay / 52) * 100) / 100,
    fortnightly: Math.round((takeHomePay / 26) * 100) / 100,
    monthly: Math.round((takeHomePay / 12) * 100) / 100,
    bonus,
    overtimeEarnings,
    novatedLease,
  };
}

// ---------- Formatting Utilities ----------
export function formatAUD(value: number, decimals = 0): string {
  return value.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatAUDCompact(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return formatAUD(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

// ---------- Salary Conversion Utilities ----------
export function annualToWeekly(annual: number): number {
  return Math.round((annual / 52) * 100) / 100;
}

export function annualToFortnightly(annual: number): number {
  return Math.round((annual / 26) * 100) / 100;
}

export function annualToMonthly(annual: number): number {
  return Math.round((annual / 12) * 100) / 100;
}

export function hourlyToAnnual(hourly: number, hoursPerWeek = 38): number {
  return Math.round(hourly * hoursPerWeek * 52);
}

export function weeklyToAnnual(weekly: number): number {
  return Math.round(weekly * 52);
}

export function fortnightlyToAnnual(fortnightly: number): number {
  return Math.round(fortnightly * 26);
}

export function monthlyToAnnual(monthly: number): number {
  return Math.round(monthly * 12);
}
