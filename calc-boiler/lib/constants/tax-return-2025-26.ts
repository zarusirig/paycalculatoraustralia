// =============================================================================
// The 2025-26 tax return (lodged in 2026) — dates and a refund estimate
// Run tests with: npm test
//
// WHY THIS FILE EXISTS. The sitewide engine (calculatePayBreakdown in
// australian-tax.ts) is FY2026-27: its second bracket is 15%. A return lodged
// between July and October 2026 covers FY2025-26, when that bracket was 16%.
// Running a 2026 return through the current engine understates tax by up to
// $268 and overstates the refund by the same amount. This file composes the
// EXISTING 2025-26 constants — it defines no new rates:
//   TAX_BRACKETS_2025_26, LITO (unchanged since 2020-21), MEDICARE_LEVY's
//   low-income thresholds (which are the 2025-26 figures — see the comment on
//   MEDICARE_LEVY), HECS_HELP_2025_26.
// The only figures added are the 2025-26 Medicare levy surcharge tiers, which
// MEDICARE_LEVY does not hold because its surcharge block is 2026-27.
//
// Verified 23 Sep 2026 via Firecrawl:
//  - Lodge online with myTax (updated 22 Sep 2026):
//    https://www.ato.gov.au/individuals-and-families/your-tax-return/how-to-lodge-your-tax-return/lodge-your-tax-return-online-with-mytax
//    "The due date to lodge your tax return is 31 October and most refunds
//    issue within 2 weeks." / "We can pre-fill most information ... by late
//    July." / "Most process in 12 business days."
//  - Lodge with a registered tax agent (updated 24 Apr 2026):
//    https://www.ato.gov.au/individuals-and-families/your-tax-return/how-to-lodge-your-tax-return/lodge-your-tax-return-with-a-registered-tax-agent
//    "If you're using a tax agent for the first time, or using a different tax
//    agent, you should contact them before 31 October to be part of their
//    lodgment program."
//  - Registered agent lodgment program, individuals and trusts (updated
//    1 Jul 2026): 15 May 2027 for remaining individuals; 31 October 2026 where
//    a prior-year return was outstanding at 30 June 2026; 31 March 2027 where
//    the latest return had a liability of $20,000 or more; 5 June concession.
//    https://www.ato.gov.au/tax-and-super-professionals/for-tax-professionals/prepare-and-lodge/registered-agent-lodgment-program/due-dates-for-tax-returns-by-client-type/individuals-and-trusts
//  - Paper returns: "most refunds issue within 50 business days".
//    https://www.ato.gov.au/individuals-and-families/your-tax-return/how-to-lodge-your-tax-return
//  - WFH fixed rate (updated 8 Jun 2026): "2024–25 and 2025–26: use 70 cents
//    per work hour".
//    https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/work-related-deductions/working-from-home-expenses/fixed-rate-method
//  - Study loans what's new (updated 30 Jun 2026): the 20% reduction for all
//    debts that existed on 1 June 2025 is fully processed; from 2025-26
//    compulsory repayments apply only above $67,000 and only on the income
//    above it.
//    https://www.ato.gov.au/individuals-and-families/study-and-training-support-loans/study-and-training-loans-what-s-new
//  - MLS thresholds (updated 22 Jun 2026), 2025-26 singles: base $101,000 or
//    less; tier 1 $101,001–$118,000 (1%); tier 2 $118,001–$158,000 (1.25%);
//    tier 3 $158,001+ (1.5%).
//    https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge/medicare-levy-surcharge-income-thresholds-and-rates
// =============================================================================

import {
  HECS_HELP_2025_26,
  LITO,
  MEDICARE_LEVY,
  TAX_BRACKETS_2025_26,
} from "./australian-tax";

export const RETURN_2026 = {
  incomeYear: "2025-26",
  incomeYearStart: "1 July 2025",
  incomeYearEnd: "30 June 2026",
  selfLodgeDueDate: "31 October 2026",
  agentDueDateMostPeople: "15 May 2027",
  agentConcessionDate: "5 June 2027",
  agentDueDateLargeLiability: "31 March 2027",
  prefillReady: "late July",
  onlineRefundTypical: "2 weeks",
  onlineProcessingBusinessDays: 12,
  paperRefundBusinessDays: 50,
  wfhFixedRateCents: 70,
  helpReductionPercent: 20,
  helpReductionDebtsAsAt: "1 June 2025",
} as const;

export const RETURN_2026_SOURCES = {
  myTax:
    "https://www.ato.gov.au/individuals-and-families/your-tax-return/how-to-lodge-your-tax-return/lodge-your-tax-return-online-with-mytax",
  taxAgent:
    "https://www.ato.gov.au/individuals-and-families/your-tax-return/how-to-lodge-your-tax-return/lodge-your-tax-return-with-a-registered-tax-agent",
  agentProgram:
    "https://www.ato.gov.au/tax-and-super-professionals/for-tax-professionals/prepare-and-lodge/registered-agent-lodgment-program/due-dates-for-tax-returns-by-client-type/individuals-and-trusts",
  howToLodge: "https://www.ato.gov.au/individuals-and-families/your-tax-return/how-to-lodge-your-tax-return",
  progress: "https://www.ato.gov.au/individuals-and-families/your-tax-return/check-the-progress-of-your-tax-return",
  wfh:
    "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/work-related-deductions/working-from-home-expenses/fixed-rate-method",
  studyLoans:
    "https://www.ato.gov.au/individuals-and-families/study-and-training-support-loans/study-and-training-loans-what-s-new",
  mls:
    "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge/medicare-levy-surcharge-income-thresholds-and-rates",
  rates: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents",
} as const;

/** 2025-26 MLS tiers, singles (ATO, updated 22 Jun 2026). */
export const MLS_2025_26_SINGLE = [
  { min: 101_001, max: 118_000, rate: 0.01 },
  { min: 118_001, max: 158_000, rate: 0.0125 },
  { min: 158_001, max: Infinity, rate: 0.015 },
] as const;

export function incomeTax2025_26(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  for (let i = TAX_BRACKETS_2025_26.length - 1; i >= 0; i--) {
    const b = TAX_BRACKETS_2025_26[i];
    if (taxableIncome >= b.min) {
      const floor = b.min === 0 ? 0 : b.min - 1;
      return b.base + (taxableIncome - floor) * b.rate;
    }
  }
  return 0;
}

/** LITO has used the same $700 / $37,500 / $45,000 / $66,667 settings since 2020-21. */
export function lito2025_26(taxableIncome: number): number {
  if (taxableIncome <= LITO.fullOffsetCeiling) return LITO.maxOffset;
  if (taxableIncome <= LITO.phaseOut1.end) {
    return LITO.maxOffset - (taxableIncome - LITO.fullOffsetCeiling) * LITO.phaseOut1.rate;
  }
  if (taxableIncome <= LITO.phaseOut2.end) {
    const r1 = (LITO.phaseOut1.end - LITO.fullOffsetCeiling) * LITO.phaseOut1.rate;
    return Math.max(0, LITO.maxOffset - r1 - (taxableIncome - LITO.phaseOut1.end) * LITO.phaseOut2.rate);
  }
  return 0;
}

/** Singles Medicare levy with low-income shade-in (2025-26 thresholds). */
export function medicareLevy2025_26(taxableIncome: number): number {
  if (taxableIncome <= MEDICARE_LEVY.lowIncomeThreshold) return 0;
  const shaded = (taxableIncome - MEDICARE_LEVY.lowIncomeThreshold) * MEDICARE_LEVY.shadeInRate;
  return Math.min(taxableIncome * MEDICARE_LEVY.rate, shaded);
}

/**
 * Singles MLS on taxable income only. Real MLS income also adds reportable
 * fringe benefits, reportable super contributions and net investment losses.
 */
export function mls2025_26(taxableIncome: number, hasPrivateHospitalCover: boolean): number {
  if (hasPrivateHospitalCover) return 0;
  const tier = MLS_2025_26_SINGLE.find((t) => taxableIncome >= t.min && taxableIncome <= t.max);
  return tier ? taxableIncome * tier.rate : 0;
}

/**
 * Compulsory study-loan repayment for 2025-26. Uses taxable income as a proxy
 * for repayment income (which also adds RFBA, RESC, net investment losses and
 * exempt foreign income).
 */
export function helpRepayment2025_26(repaymentIncome: number): number {
  const bands = HECS_HELP_2025_26.bands;
  if (repaymentIncome <= HECS_HELP_2025_26.minimumThreshold) return 0;
  const top = bands[bands.length - 1];
  if (repaymentIncome >= top.min) return repaymentIncome * top.marginalRate;
  for (let i = bands.length - 2; i >= 1; i--) {
    const b = bands[i];
    if (repaymentIncome >= b.min) return b.base + (repaymentIncome - (b.min - 1)) * b.marginalRate;
  }
  return 0;
}

export interface Return2026Inputs {
  grossIncome: number;
  deductions: number;
  taxWithheld: number;
  hasPrivateHospitalCover: boolean;
  hasStudyLoan: boolean;
}

export interface Return2026Result {
  taxableIncome: number;
  incomeTax: number;
  lito: number;
  medicareLevy: number;
  mls: number;
  helpRepayment: number;
  totalLiability: number;
  /** Positive = refund, negative = amount owing. */
  refund: number;
  /** Average rate of total liability on taxable income. */
  averageRate: number;
}

/** Whole-dollar estimate for a single Australian resident, full year, no dependants. */
export function estimateReturn2025_26(i: Return2026Inputs): Return2026Result {
  const taxableIncome = Math.max(0, Math.round(i.grossIncome - i.deductions));
  const gross = incomeTax2025_26(taxableIncome);
  const lito = Math.min(gross, lito2025_26(taxableIncome));
  const incomeTax = gross - lito;
  const medicareLevy = medicareLevy2025_26(taxableIncome);
  const mls = mls2025_26(taxableIncome, i.hasPrivateHospitalCover);
  const helpRepayment = i.hasStudyLoan ? helpRepayment2025_26(taxableIncome) : 0;
  const totalLiability = Math.round(incomeTax + medicareLevy + mls + helpRepayment);
  return {
    taxableIncome,
    incomeTax: Math.round(gross),
    lito: Math.round(lito),
    medicareLevy: Math.round(medicareLevy),
    mls: Math.round(mls),
    helpRepayment: Math.round(helpRepayment),
    totalLiability,
    refund: Math.round(i.taxWithheld) - totalLiability,
    averageRate: taxableIncome > 0 ? totalLiability / taxableIncome : 0,
  };
}
