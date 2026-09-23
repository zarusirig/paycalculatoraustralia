// =============================================================================
// Centrelink family payments — Parenting Payment, Family Tax Benefit (Parts A
// and B) and Rent Assistance.
//
// Every figure below was read on the live Services Australia page named in
// FAMILY_PAYMENT_SOURCES on 23 September 2026 (the pages were already showing
// the 20 September 2026 indexation). Where a published cut-off or income limit
// exists, the tests in __tests__/centrelink-family-payments.test.ts reconcile
// it back to the rate and taper stored here, so a figure that drifts from its
// source fails the build rather than the reader.
//
// WHEN EACH SET MOVES
//   - Parenting Payment maximum rates and Rent Assistance: 20 March and
//     20 September (CPI). Next change: 20 March 2027.
//   - Parenting Payment Single income free area ($232.60 + $24.60 per extra
//     child): 1 July. The allowance free area ($150/$256) and the tapers are
//     set in legislation.
//   - Family Tax Benefit rates, supplements and income thresholds: 1 July,
//     per financial year. These are the 2026–27 figures.
//
// SCOPE — deliberately income test only:
//   - Parenting Payment: assets test, working credits, Energy Supplement and
//     Pharmaceutical Allowance are not modelled (the published cut-offs include
//     the last two, which is why they sit a little above where the basic rate
//     reaches $0 — the tests assert that exact gap).
//   - Family Tax Benefit: shared care, the Maintenance Income Test, Rent
//     Assistance and Energy Supplement paid with FTB, the newborn supplement,
//     and grandparent carers are not modelled. Annual amounts are the
//     fortnightly rate × 365 ÷ 14, which reproduces every published income
//     limit to within $1 (asserted in the tests).
//   - Rent Assistance: the maximum before any income test. When the income
//     test reduces an income support payment, Services Australia reduces the
//     basic rate first and Rent Assistance last.
// =============================================================================

export const FAMILY_PAYMENT_SOURCES = {
  verifiedOn: "23 September 2026",
  verifiedOnISO: "2026-09-23",
  parentingPaymentRates: "https://www.servicesaustralia.gov.au/how-much-parenting-payment-you-can-get",
  parentingPaymentIncomeTest: "https://www.servicesaustralia.gov.au/income-and-assets-tests-for-parenting-payment",
  parentingPaymentEligibility: "https://www.servicesaustralia.gov.au/who-can-get-parenting-payment",
  ftbARates: "https://www.servicesaustralia.gov.au/family-tax-benefit-part-payment-rates",
  ftbAIncomeTest: "https://www.servicesaustralia.gov.au/income-test-for-family-tax-benefit-part",
  ftbBRates: "https://www.servicesaustralia.gov.au/family-tax-benefit-part-b-payment-rates",
  ftbBIncomeTest: "https://www.servicesaustralia.gov.au/income-test-for-family-tax-benefit-part-b",
  ftbEligibility: "https://www.servicesaustralia.gov.au/who-can-get-family-tax-benefit",
  rentAssistanceRates: "https://www.servicesaustralia.gov.au/how-much-rent-assistance-you-can-get",
} as const;

/** Fortnights in a year as family assistance law counts them (365 ÷ 14). */
export const FORTNIGHTS_PER_YEAR = 365 / 14;

const r2 = (n: number) => Math.round(n * 100) / 100;

// -----------------------------------------------------------------------------
// Parenting Payment
// -----------------------------------------------------------------------------

export const PARENTING_PAYMENT = {
  ratesFrom: "20 September 2026",
  effectiveFrom: "2026-09-20",
  indexedOn: "20 March and 20 September",

  single: {
    /** "$1,037.50 Parenting Payment plus a pension supplement of $30.70". */
    basic: 1_037.50,
    pensionSupplement: 30.70,
    /** basic + pension supplement — the maximum the calculator applies. */
    maxFortnightly: 1_068.20,
    /**
     * Energy Supplement ($12.00) and Pharmaceutical Allowance ($7.00) that the
     * published cut-off is built on. Not indexed on 20 September. Same values
     * as the JobSeeker single-principal-carer "typical total" in
     * centrelink-income-test.ts.
     */
    energySupplement: 12.00,
    pharmaceuticalAllowance: 7.00,
    /** Income free area per fortnight for ONE child. Indexes 1 July. */
    freeAreaOneChild: 232.60,
    /** Added to the free area (and the cut-off) for each child after the first. */
    freeAreaPerExtraChild: 24.60,
    taper: 0.4,
    /** "If your income is over the cut-off point of $2,950.60 a fortnight" (1 child). */
    publishedCutOffOneChild: 2_950.60,
  },

  partnered: {
    maxFortnightly: 755.10,
    /** Energy Supplement for a partnered recipient — the JobSeeker partnered figure. */
    energySupplement: 7.90,
    /** Own income: same allowance test as JobSeeker. */
    freeArea: 150,
    band1End: 256,
    taper1: 0.5,
    taper2: 0.6,
    /** Partner NOT on a pension: 60c per $1 of partner income over this. */
    partnerIncomeFreeArea: 1_440.00,
    partnerTaper: 0.6,
    /**
     * Partner gets a pension (Age, DSP, Carer Payment): combined income test.
     * 25c per $1 between $300 and $512, then $53 plus 30c per $1 over $512.
     */
    combined: { freeArea: 300, band1End: 512, taper1: 0.25, taper2: 0.3, publishedCutOff: 2_878.68 },
    /**
     * Own-income cut-off with a partner earning under their free area. Published
     * on the JobSeeker income test page ("$1,439.34 − your income"), which uses
     * the same partnered rate and test.
     */
    publishedOwnCutOff: 1_439.34,
  },

  /** Principal carer of a child under this age (single) — then JobSeeker. */
  singleYoungestChildUnder: 14,
  /** Principal carer of a child under this age (partnered). */
  partneredYoungestChildUnder: 6,
  /** Mutual obligations apply for singles once the youngest child turns this age. */
  singleMutualObligationFromAge: 6,

  /** Allowance assets test — the Parenting Payment income and assets page. */
  assetLimits: {
    singleHomeowner: 333_000,
    singleNonHomeowner: 600_000,
    coupleHomeowner: 499_000,
    coupleNonHomeowner: 766_000,
  },
} as const;

/** Parenting Payment Single income free area for a number of children (min 1). */
export function ppsFreeArea(children: number): number {
  const n = Math.max(1, Math.floor(children));
  const s = PARENTING_PAYMENT.single;
  return r2(s.freeAreaOneChild + (n - 1) * s.freeAreaPerExtraChild);
}

/** Fortnightly reduction of Parenting Payment Single from the recipient's income. */
export function ppsReduction(income: number, children: number): number {
  return Math.max(0, Math.max(0, income) - ppsFreeArea(children)) * PARENTING_PAYMENT.single.taper;
}

/** Parenting Payment Single after the income test, basic + pension supplement. */
export function ppsFortnightly(income: number, children: number): number {
  return Math.max(0, r2(PARENTING_PAYMENT.single.maxFortnightly - ppsReduction(income, children)));
}

/**
 * The income at which PPS reaches $0, built the way Services Australia builds
 * its published cut-off: from the typical total (maximum + Energy Supplement +
 * Pharmaceutical Allowance) and the 40c taper.
 */
export function ppsCutOff(children: number): number {
  const s = PARENTING_PAYMENT.single;
  const typicalTotal = s.maxFortnightly + s.energySupplement + s.pharmaceuticalAllowance;
  return r2(typicalTotal / s.taper + ppsFreeArea(children));
}

/** Reduction of Parenting Payment Partnered from the recipient's OWN income. */
export function pppOwnReduction(income: number): number {
  const p = PARENTING_PAYMENT.partnered;
  const i = Math.max(0, income);
  return Math.min(Math.max(0, i - p.freeArea), p.band1End - p.freeArea) * p.taper1 + Math.max(0, i - p.band1End) * p.taper2;
}

/** Reduction from a partner who is NOT on a pension (assessed separately). */
export function pppPartnerReduction(partnerIncome: number): number {
  const p = PARENTING_PAYMENT.partnered;
  return Math.max(0, partnerIncome - p.partnerIncomeFreeArea) * p.partnerTaper;
}

/** Reduction when the partner gets a pension: combined income, 25c then 30c. */
export function pppCombinedReduction(combinedIncome: number): number {
  const c = PARENTING_PAYMENT.partnered.combined;
  const i = Math.max(0, combinedIncome);
  return Math.min(Math.max(0, i - c.freeArea), c.band1End - c.freeArea) * c.taper1 + Math.max(0, i - c.band1End) * c.taper2;
}

export type PartnerPensionStatus = "notPension" | "pension";

/** Parenting Payment Partnered after the income test. */
export function pppFortnightly(income: number, partnerIncome: number, partner: PartnerPensionStatus = "notPension"): number {
  const reduction = partner === "pension"
    ? pppCombinedReduction(Math.max(0, income) + Math.max(0, partnerIncome))
    : pppOwnReduction(income) + pppPartnerReduction(partnerIncome);
  return Math.max(0, r2(PARENTING_PAYMENT.partnered.maxFortnightly - reduction));
}

// -----------------------------------------------------------------------------
// Family Tax Benefit — 2026–27 financial year
// -----------------------------------------------------------------------------

export const FTB_A = {
  financialYear: "2026–27",
  indexedOn: "1 July",
  /** Maximum rate per child per fortnight. */
  maxFortnightly: { age0to12: 235.48, age13to19: 306.46 },
  /** Base rate per child per fortnight. */
  baseFortnightly: 75.60,
  /** Yearly supplement per child, paid after balancing. */
  supplementAnnual: 970.90,
  /** The supplement is only paid when family ATI is at or under this. */
  supplementIncomeLimit: 80_000,
  /** 20c per $1 over the lower threshold, until the base rate is reached. */
  lowerThreshold: 69_131,
  lowerTaper: 0.2,
  /** 30c per $1 over the higher threshold, until the payment is nil. */
  higherThreshold: 123_078,
  higherTaper: 0.3,
  /** Published income limits, used by the tests to reconcile the model. */
  publishedBaseRateLimit: {
    oneChild0to12: 89_973,
    oneChild13to19: 99_226,
    twoChildren0to12: 110_814,
    oneEach: 120_067,
  },
  publishedNilLimit: {
    oneChild: 129_648,
    twoChildren0to12: 136_218,
    twoChildren13to19: 140_379,
    threeChildren0to12: 148_507,
    threeChildren13to19: 167_012,
    fourChildren3and1: 175_140,
    sixChildren3and3: 228_405,
  },
} as const;

export const FTB_B = {
  financialYear: "2026–27",
  indexedOn: "1 July",
  /** Per family per fortnight, by age of the youngest child. */
  maxFortnightly: { youngestUnder5: 200.34, youngest5to18: 139.86 },
  /** Yearly supplement per family, paid after balancing. */
  supplementAnnual: 478.15,
  /** No FTB Part B if the primary (or single) earner's ATI is over this. */
  primaryEarnerLimit: 124_327,
  /** Secondary earner can earn this much a year before FTB B reduces. */
  secondaryFreeArea: 7_154,
  secondaryTaper: 0.2,
  /** Published secondary-earner limits (include the supplement). */
  publishedSecondaryLimit: { youngestUnder5: 35_661, youngest5to12: 27_777 },
  /** Couples: youngest child must be under this age. */
  coupleYoungestUnder: 13,
  /** Singles: until the end of the calendar year the youngest turns 18. */
  singleYoungestMaxAge: 18,
} as const;

export interface FtbAChildren {
  /** Children aged 0–12. */
  age0to12: number;
  /** Children aged 13–15, or 16–19 and in full-time secondary study. */
  age13to19: number;
}

export interface FtbAResult {
  /** Fortnightly instalment rate (excludes the yearly supplement). */
  fortnightly: number;
  /** Annual FTB A excluding the supplement. */
  annualExSupplement: number;
  /** Supplement estimate for the year (0 when family ATI is over $80,000). */
  supplement: number;
  /** annualExSupplement + supplement. */
  annualTotal: number;
  /** Which method set the rate. */
  method: "max" | "method1" | "method2" | "nil";
}

function childCount(c: FtbAChildren) {
  return Math.max(0, Math.floor(c.age0to12)) + Math.max(0, Math.floor(c.age13to19));
}

function ftbAMaxAnnual(c: FtbAChildren): number {
  return (Math.max(0, Math.floor(c.age0to12)) * FTB_A.maxFortnightly.age0to12
    + Math.max(0, Math.floor(c.age13to19)) * FTB_A.maxFortnightly.age13to19) * FORTNIGHTS_PER_YEAR;
}

function ftbABaseAnnual(c: FtbAChildren): number {
  return childCount(c) * FTB_A.baseFortnightly * FORTNIGHTS_PER_YEAR;
}

/**
 * Annual FTB Part A on a given family adjusted taxable income, as the higher of
 * the two income-test methods:
 *   Method 1: maximum rate − 20c per $1 between the lower and higher
 *             thresholds − 30c per $1 over the higher threshold.
 *   Method 2: base rate − 30c per $1 over the higher threshold.
 * `supplement` adds the yearly supplement to both rates (only valid when ATI is
 * at or under $80,000); the income test then reduces the whole amount.
 */
function ftbAAnnualByTest(ati: number, c: FtbAChildren, supplement: boolean): { annual: number; method: FtbAResult["method"] } {
  const n = childCount(c);
  if (n === 0) return { annual: 0, method: "nil" };
  const supp = supplement ? n * FTB_A.supplementAnnual : 0;
  const i = Math.max(0, ati);
  const lowerExcess = Math.min(Math.max(0, i - FTB_A.lowerThreshold), FTB_A.higherThreshold - FTB_A.lowerThreshold);
  const higherExcess = Math.max(0, i - FTB_A.higherThreshold);
  const m1 = ftbAMaxAnnual(c) + supp - lowerExcess * FTB_A.lowerTaper - higherExcess * FTB_A.higherTaper;
  const m2 = ftbABaseAnnual(c) + supp - higherExcess * FTB_A.higherTaper;
  if (m1 <= 0 && m2 <= 0) return { annual: 0, method: "nil" };
  if (i <= FTB_A.lowerThreshold) return { annual: m1, method: "max" };
  return m1 >= m2 ? { annual: m1, method: "method1" } : { annual: m2, method: "method2" };
}

/**
 * FTB Part A estimate for a family.
 *
 * `incomeSupport` — you or your partner get an income support payment (such as
 * Parenting Payment or JobSeeker) that is not reduced to $0 by employment
 * income: Services Australia pays the maximum rate without the income test.
 *
 * Fortnightly instalments exclude the supplement, which is paid after the year
 * is balanced; the estimate reduces the supplement last.
 */
export function ftbA(ati: number, children: FtbAChildren, incomeSupport = false): FtbAResult {
  const n = childCount(children);
  const suppEligible = Math.max(0, ati) <= FTB_A.supplementIncomeLimit;
  if (n === 0) return { fortnightly: 0, annualExSupplement: 0, supplement: 0, annualTotal: 0, method: "nil" };
  if (incomeSupport) {
    const annual = ftbAMaxAnnual(children);
    const supplement = suppEligible ? n * FTB_A.supplementAnnual : 0;
    return { fortnightly: r2(annual / FORTNIGHTS_PER_YEAR), annualExSupplement: r2(annual), supplement: r2(supplement), annualTotal: r2(annual + supplement), method: "max" };
  }
  const ex = ftbAAnnualByTest(ati, children, false);
  const withSupp = suppEligible ? ftbAAnnualByTest(ati, children, true) : ex;
  const annualEx = Math.max(0, ex.annual);
  const total = Math.max(annualEx, withSupp.annual);
  return {
    fortnightly: r2(annualEx / FORTNIGHTS_PER_YEAR),
    annualExSupplement: r2(annualEx),
    supplement: r2(total - annualEx),
    annualTotal: r2(total),
    method: ex.method,
  };
}

/**
 * Income at which FTB A stops (both methods at nil), excluding the supplement
 * — the figure Services Australia publishes as "income limits where we won't
 * pay FTB Part A".
 */
export function ftbANilIncome(children: FtbAChildren): number {
  const n = childCount(children);
  if (n === 0) return 0;
  const m1Room = ftbAMaxAnnual(children) - (FTB_A.higherThreshold - FTB_A.lowerThreshold) * FTB_A.lowerTaper;
  const room = Math.max(m1Room, ftbABaseAnnual(children));
  return Math.round(FTB_A.higherThreshold + room / FTB_A.higherTaper);
}

/**
 * Income at which Method 1 reaches the base rate (the "base rate income
 * limit"). Only meaningful when that point falls below the higher threshold.
 */
export function ftbABaseRateIncome(children: FtbAChildren): number {
  return Math.round(FTB_A.lowerThreshold + (ftbAMaxAnnual(children) - ftbABaseAnnual(children)) / FTB_A.lowerTaper);
}

export type FamilyType = "single" | "couple";

export interface FtbBInput {
  family: FamilyType;
  /** Age of the youngest child, in whole years. */
  youngestAge: number;
  /** Single parent's ATI, or the HIGHER earner's ATI in a couple. */
  primaryIncome: number;
  /** Couples only: the LOWER earner's ATI. Ignored for singles. */
  secondaryIncome?: number;
}

export interface FtbBResult {
  eligible: boolean;
  /** Why not, when eligible is false. */
  reason?: string;
  maxFortnightly: number;
  fortnightly: number;
  annualExSupplement: number;
  supplement: number;
  annualTotal: number;
}

/** FTB Part B for a family, with the two-part test for couples. */
export function ftbB(input: FtbBInput): FtbBResult {
  const age = Math.max(0, Math.floor(input.youngestAge));
  const max = age < 5 ? FTB_B.maxFortnightly.youngestUnder5 : FTB_B.maxFortnightly.youngest5to18;
  const none = (reason: string): FtbBResult => ({ eligible: false, reason, maxFortnightly: max, fortnightly: 0, annualExSupplement: 0, supplement: 0, annualTotal: 0 });

  if (input.family === "couple" && age >= FTB_B.coupleYoungestUnder) return none("For couples, the youngest child must be under 13.");
  if (input.family === "single" && age > FTB_B.singleYoungestMaxAge) return none("The youngest child is over 18.");
  if (Math.max(0, input.primaryIncome) > FTB_B.primaryEarnerLimit) return none(`The ${input.family === "single" ? "" : "higher earner's "}income is over $${FTB_B.primaryEarnerLimit.toLocaleString("en-AU")} a year.`);

  const maxAnnual = max * FORTNIGHTS_PER_YEAR;
  const reduction = input.family === "couple"
    ? Math.max(0, (input.secondaryIncome ?? 0) - FTB_B.secondaryFreeArea) * FTB_B.secondaryTaper
    : 0;
  const annualEx = Math.max(0, maxAnnual - reduction);
  const total = Math.max(0, maxAnnual + FTB_B.supplementAnnual - reduction);
  return {
    eligible: total > 0,
    reason: total > 0 ? undefined : "The lower earner's income is over the limit for your youngest child's age.",
    maxFortnightly: max,
    fortnightly: r2(annualEx / FORTNIGHTS_PER_YEAR),
    annualExSupplement: r2(annualEx),
    supplement: r2(total - annualEx),
    annualTotal: r2(total),
  };
}

/** Secondary-earner income at which FTB B (including the supplement) reaches nil. */
export function ftbBSecondaryLimit(youngestAge: number): number {
  const max = youngestAge < 5 ? FTB_B.maxFortnightly.youngestUnder5 : FTB_B.maxFortnightly.youngest5to18;
  return Math.round(FTB_B.secondaryFreeArea + (max * FORTNIGHTS_PER_YEAR + FTB_B.supplementAnnual) / FTB_B.secondaryTaper);
}

// -----------------------------------------------------------------------------
// Rent Assistance — rates from 20 September 2026
// -----------------------------------------------------------------------------

export type RentAssistanceSituation =
  | "single"
  | "singleSharer"
  | "couple"
  | "coupleSeparatedIllness"
  | "coupleTemporarilySeparated"
  | "singleFamily1or2"
  | "singleFamily3plus"
  | "coupleFamily1or2"
  | "coupleFamily3plus";

export interface RentAssistanceRow {
  label: string;
  /** Paid with an income support payment, or with FTB Part A (families). */
  paidWith: "incomeSupport" | "ftb";
  /** Fortnightly rent must be more than this before any Rent Assistance is paid. */
  threshold: number;
  /** Maximum fortnightly Rent Assistance. */
  max: number;
  /** "To get the maximum payment your fortnightly rent is at least" — as published. */
  publishedMaxRent: number;
}

export const RENT_ASSISTANCE = {
  ratesFrom: "20 September 2026",
  effectiveFrom: "2026-09-20",
  indexedOn: "20 March and 20 September",
  /** 75c for each $1 of rent above the threshold. */
  rate: 0.75,
  rows: {
    single: { label: "Single, no children", paidWith: "incomeSupport", threshold: 157.80, max: 223.80, publishedMaxRent: 456.20 },
    singleSharer: { label: "Single, no children, sharing accommodation", paidWith: "incomeSupport", threshold: 157.80, max: 149.20, publishedMaxRent: 356.74 },
    couple: { label: "Couple, no children (combined)", paidWith: "incomeSupport", threshold: 255.80, max: 211.00, publishedMaxRent: 537.14 },
    coupleSeparatedIllness: { label: "Couple separated by illness, respite care or prison, no children", paidWith: "incomeSupport", threshold: 157.80, max: 223.80, publishedMaxRent: 456.20 },
    coupleTemporarilySeparated: { label: "Couple temporarily separated, no children", paidWith: "incomeSupport", threshold: 157.80, max: 211.00, publishedMaxRent: 439.14 },
    singleFamily1or2: { label: "Single, 1 or 2 children", paidWith: "ftb", threshold: 207.34, max: 263.06, publishedMaxRent: 558.09 },
    singleFamily3plus: { label: "Single, 3 or more children", paidWith: "ftb", threshold: 207.34, max: 297.36, publishedMaxRent: 603.82 },
    coupleFamily1or2: { label: "Couple, 1 or 2 children", paidWith: "ftb", threshold: 306.60, max: 263.06, publishedMaxRent: 657.35 },
    coupleFamily3plus: { label: "Couple, 3 or more children", paidWith: "ftb", threshold: 306.60, max: 297.36, publishedMaxRent: 703.08 },
  } satisfies Record<RentAssistanceSituation, RentAssistanceRow>,
} as const;

export const RENT_ASSISTANCE_SITUATIONS = Object.keys(RENT_ASSISTANCE.rows) as RentAssistanceSituation[];

/** Fortnightly Rent Assistance before any income test: 75c per $1 over the threshold, capped. */
export function rentAssistanceFortnightly(rent: number, situation: RentAssistanceSituation): number {
  const row = RENT_ASSISTANCE.rows[situation];
  return r2(Math.min(row.max, Math.max(0, rent - row.threshold) * RENT_ASSISTANCE.rate));
}

/** Rent at which the maximum is reached (threshold + max ÷ 0.75). */
export function rentForMaxAssistance(situation: RentAssistanceSituation): number {
  const row = RENT_ASSISTANCE.rows[situation];
  return r2(row.threshold + row.max / RENT_ASSISTANCE.rate);
}

/** Convert a rent amount to fortnightly. */
export function rentToFortnightly(amount: number, period: "week" | "fortnight" | "month"): number {
  if (period === "week") return amount * 2;
  if (period === "month") return (amount * 12) / 26;
  return amount;
}
