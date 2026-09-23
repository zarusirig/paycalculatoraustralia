// =============================================================================
// Centrelink wave 2 (W3): Carer Payment, Carer Allowance, advance payments,
// Crisis Payment and the Income Apportionment Resolution Scheme.
//
// Every figure below was read at Services Australia on 23 September 2026
// (after the 20 September 2026 indexation). Source URLs are in
// CARER_SUPPORT_SOURCES and are cited on each page.
//
// What is DERIVED rather than published, and says so on the page:
//   - Crisis Payment dollar amounts. Services Australia states the rule ("equal
//     to a week's pay at the maximum basic rate of your income support payment
//     … It doesn't include other allowances or supplements") but not a dollar
//     figure per payment. crisisPaymentAmount() applies that rule — half the
//     fortnightly maximum basic rate — to the basic rates this site already
//     holds (lib/constants/centrelink-income-test.ts and
//     centrelink-family-payments.ts).
//   - The Carer Payment calculator reuses the Age Pension income test code,
//     because Services Australia says "We use the pension income test to
//     assess Carer Payment", and the Carer Payment rates page carries exactly
//     the Age Pension figures. The tests assert both.
//
// Not modelled: the assets test taper (only the published limits and cut-offs
// are shown), deeming, transitional rates, Rent Assistance, the care-receiver
// tests beyond their published limits, Carer Allowance part-payment
// percentages (entered by the user).
// =============================================================================

import { AGE_PENSION_RATES, SEPTEMBER_2026, type AgePensionRateSet } from "./centrelink-income-test";

export const CARER_SUPPORT_SOURCES = {
  verifiedOn: "23 September 2026",
  verifiedOnISO: "2026-09-23",
  // Carer Payment
  carerPayment: "https://www.servicesaustralia.gov.au/carer-payment",
  carerPaymentWho: "https://www.servicesaustralia.gov.au/who-can-get-carer-payment",
  carerPaymentRates: "https://www.servicesaustralia.gov.au/how-much-carer-payment-you-can-get",
  carerPaymentIncomeTest: "https://www.servicesaustralia.gov.au/income-test-for-carer-payment",
  carerPaymentAssetsTest: "https://www.servicesaustralia.gov.au/assets-test-for-carer-payment",
  carerPaymentIncomeAndAssets: "https://www.servicesaustralia.gov.au/income-and-assets-test-for-carer-payment",
  carerPaymentWork: "https://www.servicesaustralia.gov.au/working-while-you-get-carer-payment",
  carerPaymentCareReceiver: "https://www.servicesaustralia.gov.au/rules-for-person-you-care-for-to-get-carer-payment",
  carerPaymentFirstPayment: "https://www.servicesaustralia.gov.au/when-youll-get-your-first-carer-payment",
  workBonusWho: "https://www.servicesaustralia.gov.au/who-can-get-work-bonus",
  // Carer Allowance / Supplement
  carerAllowance: "https://www.servicesaustralia.gov.au/carer-allowance",
  carerAllowanceRates: "https://www.servicesaustralia.gov.au/how-much-carer-allowance-you-can-get",
  carerAllowanceWho: "https://www.servicesaustralia.gov.au/who-can-get-carer-allowance",
  carerSupplement: "https://www.servicesaustralia.gov.au/carer-supplement",
  // Advance payments
  advancePayment: "https://www.servicesaustralia.gov.au/advance-payment",
  advancePaymentHowToApply: "https://www.servicesaustralia.gov.au/centrelink-online-account-help-apply-for-advance-payment",
  // Crisis Payment
  crisisPayment: "https://www.servicesaustralia.gov.au/crisis-payment",
  crisisFdvWho: "https://www.servicesaustralia.gov.au/who-can-get-crisis-payment-for-extreme-circumstances-family-and-domestic-violence",
  crisisFdvAmount: "https://www.servicesaustralia.gov.au/how-much-crisis-payment-for-extreme-circumstances-family-and-domestic-violence-you-can-get",
  crisisFdvClaim: "https://www.servicesaustralia.gov.au/how-to-claim-crisis-payment-for-extreme-circumstances-family-and-domestic-violence",
  crisisOtherWho: "https://www.servicesaustralia.gov.au/who-can-get-crisis-payment-for-other-extreme-circumstances",
  crisisOtherAmount: "https://www.servicesaustralia.gov.au/how-much-crisis-payment-for-other-extreme-circumstances-you-can-get",
  crisisHumanitarianWho: "https://www.servicesaustralia.gov.au/who-can-get-crisis-payment-for-humanitarian-entrants",
  crisisPrisonWho: "https://www.servicesaustralia.gov.au/who-can-get-crisis-payment-for-release-from-prison-or-psychiatric-confinement",
  // Debts
  debtsHub: "https://www.servicesaustralia.gov.au/centrelink-debts-and-overpayments",
  debtOverpaid: "https://www.servicesaustralia.gov.au/what-happens-when-youre-overpaid-centrelink",
  debtAvoid: "https://www.servicesaustralia.gov.au/how-to-avoid-overpayment",
  debtRepay: "https://www.servicesaustralia.gov.au/how-to-repay-money-you-owe-to-centrelink",
  debtRefund: "https://www.servicesaustralia.gov.au/what-happens-if-youve-overpaid-centrelink-debt",
  incomeApportionment: "https://www.servicesaustralia.gov.au/information-about-income-apportionment",
  resolutionScheme: "https://www.servicesaustralia.gov.au/income-apportionment-resolution-scheme",
  robodebtSettlement: "https://www.servicesaustralia.gov.au/new-robodebt-class-action-settlement",
  // Cost of living
  costOfLivingPayment: "https://www.servicesaustralia.gov.au/cost-living-payment",
  energyBillRelief: "https://www.energy.gov.au/energy-bill-relief-fund",
  energyRebates: "https://www.energy.gov.au/rebates",
  saCostOfLivingConcession: "https://www.sa.gov.au/topics/care-and-support/concessions/household-concessions/cost-of-living-concessions",
} as const;

// -----------------------------------------------------------------------------
// Carer Payment
// -----------------------------------------------------------------------------

/**
 * Carer Payment is paid at the pension rate. The Services Australia rates page
 * (read 23 Sep 2026) shows single $1,237.70 and couple $933.00 each — the
 * Age Pension 20 September 2026 set, byte for byte (asserted in the tests).
 */
export const CARER_PAYMENT_RATES: AgePensionRateSet = AGE_PENSION_RATES[SEPTEMBER_2026];

export const CARER_PAYMENT = {
  ratesFrom: "20 September 2026",
  indexedOn: "20 March and 20 September",
  /** Paid work or self-employment allowed while keeping the payment. */
  workHoursLimit: 100,
  workHoursPeriodWeeks: 4,
  /** Respite days available per calendar year (can cover weeks over 100 hours). */
  respiteDaysPerYear: 63,
  /** Payment can be suspended (not cancelled) for up to this many months. */
  suspensionMonths: 6,
  /** Minimum expected duration of the care need. */
  careNeedMonths: 6,
  /** Care receiver's own tests (if they don't get an income support payment). Index 1 January. */
  careReceiverIncomeLimit: 143_752,
  careReceiverAssetsLimit: 886_750,
  /** Published assets limits for a full pension (from the carer's assets test page). */
  assetsFullPension: {
    singleHomeowner: 333_000,
    singleNonHomeowner: 600_000,
    coupleHomeowner: 499_000,
    coupleNonHomeowner: 766_000,
  },
  /** Part pension cancels above these, from 20 September 2026. */
  assetsCutOff: {
    singleHomeowner: 745_750,
    singleNonHomeowner: 1_012_750,
    coupleHomeowner: 1_121_000,
    coupleNonHomeowner: 1_388_000,
    coupleIllnessHomeowner: 1_324_500,
    coupleIllnessNonHomeowner: 1_591_500,
  },
  /** Carer Supplement, paid each year to people getting Carer Payment on 1 July. */
  carerSupplementAnnual: 600,
} as const;

/** True when the hours worked in a 4-week period are within the Carer Payment limit. */
export function carerPaymentWithinHoursLimit(hoursIn4Weeks: number): boolean {
  return Math.max(0, hoursIn4Weeks) <= CARER_PAYMENT.workHoursLimit;
}

/** Average weekly hours implied by the 100-hours-in-4-weeks rule. */
export const CARER_PAYMENT_AVERAGE_WEEKLY_HOURS = CARER_PAYMENT.workHoursLimit / CARER_PAYMENT.workHoursPeriodWeeks;

// -----------------------------------------------------------------------------
// Carer Allowance
// -----------------------------------------------------------------------------

export const CARER_ALLOWANCE = {
  /** Per fortnight. Indexed on 1 January each year. Not taxable. */
  fortnightly: 162.60,
  indexedOn: "1 January",
  /** Combined adjusted taxable income must be LESS THAN this, per financial year. */
  incomeLimit: 250_000,
  carerSupplementAnnual: 600,
} as const;

/**
 * Carer Allowance for a fortnight. Services Australia: "Your work income won't
 * affect how much Carer Allowance you get if you and your partner earn less
 * than $250,000 a year. This is a set rate." Shared care with a carer who is
 * not your partner is paid as a percentage of care.
 */
export function carerAllowanceFortnightly(combinedAdjustedTaxableIncome: number, careSharePercent = 100): number {
  if (combinedAdjustedTaxableIncome >= CARER_ALLOWANCE.incomeLimit) return 0;
  const share = Math.min(100, Math.max(0, careSharePercent)) / 100;
  return Math.round(CARER_ALLOWANCE.fortnightly * share * 100) / 100;
}

// -----------------------------------------------------------------------------
// Advance payments
// -----------------------------------------------------------------------------

export type AdvanceKind = "pensionSingle" | "pensionCouple" | "allowance" | "ftb" | "specialEmployment";

/**
 * Lowest and highest advance, read 23 Sep 2026. The pension figures "change
 * along with pension amounts each March and September". The FTB figure is a
 * cap on all FTB advances combined; the lowest FTB advance is not published.
 */
export const ADVANCE_LIMITS: Record<AdvanceKind, { label: string; min: number | null; max: number }> = {
  pensionSingle: { label: "Age Pension, Carer Payment or DSP — single", min: 588.05, max: 1_764.15 },
  pensionCouple: { label: "Age Pension, Carer Payment or DSP — member of a couple", min: 443.30, max: 1_329.90 },
  allowance: { label: "JobSeeker, Parenting Payment, Youth Allowance, Austudy or ABSTUDY", min: 250, max: 500 },
  ftb: { label: "Family Tax Benefit Part A (all advances combined)", min: null, max: 1_430.46 },
  specialEmployment: { label: "Special Employment Advance", min: 50, max: 500 },
};

export const ADVANCE_RULES = {
  /** Repaid over this many fortnights: repayment = advance ÷ 13. */
  repaymentFortnights: 13,
  /** Months on the payment before pensions, JobSeeker, Parenting Payment etc can apply. */
  monthsOnPaymentBeforeApplying: 3,
  /** FTB regular advance = 3.75% of the standard rate for one child under 13. */
  ftbRegularAdvancePercent: 3.75,
  /** FTB one-off advance cap = 7.5% of your annual rate. */
  ftbOneOffPercent: 7.5,
} as const;

/** Clamp a requested advance to the published range for its kind. */
export function clampAdvance(kind: AdvanceKind, amount: number): number {
  const { min, max } = ADVANCE_LIMITS[kind];
  return Math.min(max, Math.max(min ?? 0, amount));
}

/** Fortnightly repayment Services Australia deducts: the advance divided by 13, to the cent. */
export function advanceRepayment(advance: number): number {
  return Math.round((Math.max(0, advance) / ADVANCE_RULES.repaymentFortnights) * 100) / 100;
}

/**
 * The fortnightly payment you receive while repaying. Floors at $0 — if the
 * payment is smaller than the repayment, Services Australia deals with the
 * shortfall; we don't model that.
 */
export function paymentWhileRepaying(fortnightlyPayment: number, advance: number): number {
  return Math.max(0, Math.round((fortnightlyPayment - advanceRepayment(advance)) * 100) / 100);
}

// -----------------------------------------------------------------------------
// Crisis Payment
// -----------------------------------------------------------------------------

export const CRISIS_PAYMENT = {
  /** Up to this many extreme-circumstances payments (FDV + other combined) in 12 months. */
  maxExtremeCircumstancesPer12Months: 4,
  /** Contact Services Australia within this many days of the change. */
  contactWithinDays: 7,
  /** After making contact, the claim must be lodged within this many days. */
  claimWithinDaysOfContact: 14,
  /** Prison / psychiatric confinement: minimum days in custody. */
  minDaysInCustody: 14,
  /** Prison release: may contact up to this many days before release. */
  prisonContactDaysBeforeRelease: 21,
  humanitarianVisas: ["200 Refugee", "201 In-Country Special Humanitarian", "202 Global Special Humanitarian", "203 Emergency Rescue", "204 Woman at Risk"],
} as const;

/**
 * "Equal to a week's pay at the maximum basic rate of your income support
 * payment" — i.e. half the fortnightly maximum basic rate, rounded to the cent.
 * Supplements are excluded, so pass the BASIC rate, not the total.
 */
export function crisisPaymentAmount(maxBasicFortnightly: number): number {
  return Math.round((Math.max(0, maxBasicFortnightly) / 2) * 100) / 100;
}

// -----------------------------------------------------------------------------
// Income Apportionment Resolution Scheme
// -----------------------------------------------------------------------------

export const RESOLUTION_SCHEME = {
  opened: "30 January 2026",
  closes: "29 January 2027",
  debtPeriodFrom: "20 September 2003",
  debtPeriodTo: "6 December 2020",
  /** Debt value is measured as at this date. */
  valuedAt: "30 January 2026",
  maxPayment: 600,
} as const;

/** Payment for one eligible debt, from its total value on 30 January 2026. */
export function resolutionSchemePayment(debtValue: number): number {
  const v = Math.max(0, debtValue);
  if (v < 200) return Math.round(v * 100) / 100;
  if (v < 2_000) return 200;
  if (v < 5_000) return 400;
  return 600;
}

// -----------------------------------------------------------------------------
// Cost of living (what exists in 2026)
// -----------------------------------------------------------------------------

export const COST_OF_LIVING_FACTS = {
  /** Services Australia: "The Cost of Living Payment has stopped from 30 June 2023." */
  cwthCostOfLivingPaymentEnded: "30 June 2023",
  /** energy.gov.au: "The Energy Bill Relief Fund ended on 31 December 2025." */
  energyBillReliefEnded: "31 December 2025",
  energyBillRelief2025Extension: 150,
  energyBillRelief2024_25: 300,
  /** SA Cost of Living Concession, 2026-27, paid August–December. */
  saCostOfLivingConcession2026_27: 270.60,
} as const;
