// =============================================================================
// Payday Super — per-pay super guarantee and the payday due-date rule
// Run tests with: npm test
//
// Figures are NOT defined here. The SG rate, the annual maximum contribution
// base and the 7/20 business-day deadlines all come from australian-tax.ts
// (SUPER_GUARANTEE, SUPER_GUARANTEE_CHARGE), which is the single source of
// truth. This file only adds the per-payday arithmetic and a business-day
// counter.
//
// Verified 23 Sep 2026 via Firecrawl:
//  - https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-on-payday/payment-deadlines-for-payday-super
//    (last updated 10 Aug 2026): "on time if it is received by your employee's
//    super fund ... within 7 business days after paying your employee";
//    20 business days for the first contribution for a new employee or to a
//    new fund. "A business day is any day other than a Saturday or Sunday [or]
//    a day that is a public holiday for the whole of any Australian state or
//    territory" — so a state-wide holiday ANYWHERE removes a day nationally.
//  - https://www.ato.gov.au/businesses-and-organisations/super-for-employers/about-payday-super
//    (last updated 10 Aug 2026): SG is 12% of qualifying earnings, paid for
//    each payday from 1 July 2026. "The SBSCH closed to new users on
//    1 October 2025. Existing users had access to the service until
//    30 June 2026 ... SBSCH is no longer accessible."
//
// PUBLIC HOLIDAYS ARE DELIBERATELY NOT MODELLED. Any whole-of-state holiday in
// any state or territory pushes the deadline out a day, and the list differs
// every year (e.g. NT Picnic Day, WA Day, Labour Day on four different dates).
// addBusinessDays() skips weekends only, so the date it returns is the
// EARLIEST the deadline can be — never later than the real one. The page says
// so beside every date it prints.
// =============================================================================

import { SUPER_GUARANTEE, SUPER_GUARANTEE_CHARGE } from "./australian-tax";

export type PayFrequency = "weekly" | "fortnightly" | "monthly";

export const PAYS_PER_YEAR: Readonly<Record<PayFrequency, number>> = {
  weekly: 52,
  fortnightly: 26,
  monthly: 12,
};

/** Small Business Superannuation Clearing House closure — ATO, about-payday-super. */
export const SBSCH_CLOSURE = {
  closedToNewUsers: "1 October 2025",
  lastDayForExistingUsers: "30 June 2026",
  sourceUrl:
    "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/about-payday-super",
} as const;

/**
 * The legislative package, as named in the instruments themselves. The
 * Regulations' commencement table ties them to the Superannuation Guarantee
 * Charge Amendment Act 2025 commencing 1 July 2026.
 */
export const PAYDAY_SUPER_LAW = {
  act: "Treasury Laws Amendment (Payday Superannuation) Act 2025",
  actNumber: "No. 57 of 2025",
  companionAct: "Superannuation Guarantee Charge Amendment Act 2025",
  regulations: "Treasury Laws Amendment (Payday Superannuation) Regulations 2026",
  commencement: SUPER_GUARANTEE.paydaySuperStart,
} as const;

export const PAYDAY_SUPER_SOURCES = {
  about: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/about-payday-super",
  deadlines:
    "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-on-payday/payment-deadlines-for-payday-super",
  qualifyingEarnings:
    "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-on-payday/what-payments-are-qualifying-earnings",
  /** Treasury Laws Amendment (Payday Superannuation) Act 2025, No. 57 of 2025 (ATO legal database copy). */
  act: "https://www.ato.gov.au/law/view/pdf/acts/20250057.pdf",
  /** Bill homepage — second reading, explanatory memorandum, passage history. */
  bill: "https://www.aph.gov.au/Parliamentary_Business/Bills_Legislation/Bills_Search_Results/Result?bId=r7373",
  /** Treasury Laws Amendment (Payday Superannuation) Regulations 2026 — commence 1 July 2026. */
  regulations: "https://www.legislation.gov.au/F2026L00133/asmade",
} as const;

export interface PerPaySuper {
  payFrequency: PayFrequency;
  paysPerYear: number;
  /** Qualifying earnings in one pay. */
  qualifyingEarningsPerPay: number;
  /** SG owed for that payday, before any annual cap. */
  sgPerPay: number;
  /** SG across a full year (capped at the annual maximum contribution base). */
  sgAnnual: number;
  /** True when annual qualifying earnings exceed the maximum contribution base. */
  aboveMaxContributionBase: boolean;
}

/**
 * Super guarantee owed for each payday on a steady annual salary.
 * Rounded to the cent. Assumes the whole salary is qualifying earnings.
 */
export function perPaySuper(annualQualifyingEarnings: number, payFrequency: PayFrequency): PerPaySuper {
  const salary = Math.max(0, annualQualifyingEarnings);
  const paysPerYear = PAYS_PER_YEAR[payFrequency];
  const qePerPay = salary / paysPerYear;
  const cappedAnnual = Math.min(salary, SUPER_GUARANTEE.maxContributionBaseAnnual);
  return {
    payFrequency,
    paysPerYear,
    qualifyingEarningsPerPay: round2(qePerPay),
    sgPerPay: round2(qePerPay * SUPER_GUARANTEE.rate),
    sgAnnual: round2(cappedAnnual * SUPER_GUARANTEE.rate),
    aboveMaxContributionBase: salary > SUPER_GUARANTEE.maxContributionBaseAnnual,
  };
}

/**
 * Parse "YYYY-MM-DD" as a UTC date. Returns null for anything invalid,
 * including impossible dates such as 2026-02-30.
 */
export function parseIsoDate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d) return null;
  return date;
}

/** Add n business days, skipping Saturdays and Sundays ONLY (see header). */
export function addBusinessDays(start: Date, n: number): Date {
  const d = new Date(start.getTime());
  let added = 0;
  while (added < n) {
    d.setUTCDate(d.getUTCDate() + 1);
    const dow = d.getUTCDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return d;
}

/**
 * Earliest possible "must be received by" date for SG paid on `payday`.
 * The real deadline is this date plus one business day for every whole-of-
 * state public holiday (in any state or territory) that falls in between.
 */
export function earliestSgDueDate(payday: Date, newEmployeeOrFund = false): Date {
  const days = newEmployeeOrFund
    ? SUPER_GUARANTEE_CHARGE.current.businessDaysNewEmployee
    : SUPER_GUARANTEE_CHARGE.current.businessDaysToPay;
  return addBusinessDays(payday, days);
}

export function formatDateAU(d: Date): string {
  return d.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
