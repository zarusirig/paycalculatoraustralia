// =============================================================================
// Paid Parental Leave (Parental Leave Pay) — rates, days, income and work tests.
//
// Read at Services Australia on 23 September 2026:
//   - how-much-parental-leave-pay-you-can-get (page updated 1 July 2026)
//   - meeting-income-test-for-parental-leave-pay
//   - work-requirements-for-parental-leave-pay
//   - claiming-timeframes-for-parental-leave-pay
//   - getting-your-parental-leave-pay
//   - paid-parental-leave-scheme-changes (updated 14 September 2026)
// and the ATO "Paid Parental Leave Superannuation Contribution" page
// (updated 24 July 2026).
//
// Two rules the calculator depends on, both stated by Services Australia:
//   1. DAYS depend on the child's date of birth or adoption.
//   2. The RATE depends on the financial year each day is TAKEN in, not the
//      birth date — so a block that crosses 1 July is paid at two rates.
//
// The super contribution estimate is 12% of the Parental Leave Pay. The ATO
// adds an interest component and pays after the financial year ends; we do
// not model the interest, and say so on the page.
// =============================================================================

export const PPL_SOURCES = {
  verifiedOn: "23 September 2026",
  verifiedOnISO: "2026-09-23",
  overview: "https://www.servicesaustralia.gov.au/parental-leave-pay",
  howMuch: "https://www.servicesaustralia.gov.au/how-much-parental-leave-pay-you-can-get",
  whoCanGet: "https://www.servicesaustralia.gov.au/who-can-get-parental-leave-pay",
  incomeTest: "https://www.servicesaustralia.gov.au/meeting-income-test-for-parental-leave-pay",
  workTest: "https://www.servicesaustralia.gov.au/work-requirements-for-parental-leave-pay",
  claiming: "https://www.servicesaustralia.gov.au/claiming-timeframes-for-parental-leave-pay",
  gettingPaid: "https://www.servicesaustralia.gov.au/getting-your-parental-leave-pay",
  chooseDays: "https://www.servicesaustralia.gov.au/how-to-choose-and-share-your-parental-leave-pay-days",
  workingOnADay: "https://www.servicesaustralia.gov.au/if-you-work-day-parental-leave-pay",
  schemeChanges: "https://www.servicesaustralia.gov.au/paid-parental-leave-scheme-changes",
  atoSuper: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/how-to-save-more-in-your-super/government-super-contributions/paid-parental-leave-superannuation-contribution",
} as const;

export type PplFinancialYear = "2025-26" | "2026-27";

/** Rate by the financial year the day is taken in. 5-day week = daily × 5. */
export const PPL_RATES: Record<PplFinancialYear, { daily: number; weekly: number }> = {
  "2025-26": { daily: 189.62, weekly: 948.10 },
  "2026-27": { daily: 200.94, weekly: 1_004.70 },
};

export const PPL_CURRENT_FY: PplFinancialYear = "2026-27";

/** Days for the family, days reserved for a partner, by birth/adoption date (ISO, first day it applies). */
export const PPL_ENTITLEMENT = [
  { from: "2024-07-01", label: "1 July 2024", days: 110, weeks: 22, reservedForPartner: 10, maxConcurrentDays: 10 },
  { from: "2025-07-01", label: "1 July 2025", days: 120, weeks: 24, reservedForPartner: 15, maxConcurrentDays: 20 },
  { from: "2026-07-01", label: "1 July 2026", days: 130, weeks: 26, reservedForPartner: 20, maxConcurrentDays: 20 },
] as const;

export type PplEntitlement = (typeof PPL_ENTITLEMENT)[number];

/** Entitlement for a child born or adopted on the given ISO date. Earliest set for older dates. */
export function pplEntitlementFor(birthDateISO: string): PplEntitlement {
  let e: PplEntitlement = PPL_ENTITLEMENT[0];
  for (const row of PPL_ENTITLEMENT) if (birthDateISO.slice(0, 10) >= row.from) e = row;
  return e;
}

/**
 * Income test. The financial year assessed is the one before the birth/adoption
 * or the claim date, whichever date is EARLIER. Individual test first; if that
 * fails, the family (combined) test. A single person uses their own income
 * against the family limit.
 */
export const PPL_INCOME_TEST: Record<"2024-25" | "2025-26", { individual: number; family: number }> = {
  "2024-25": { individual: 180_007, family: 373_094 },
  "2025-26": { individual: 186_487, family: 386_525 },
};

export function pplMeetsIncomeTest(
  fy: keyof typeof PPL_INCOME_TEST,
  ownAti: number,
  partnerAti = 0,
): { meets: boolean; via: "individual" | "family" | null } {
  const t = PPL_INCOME_TEST[fy];
  if (ownAti <= t.individual) return { meets: true, via: "individual" };
  if (ownAti + Math.max(0, partnerAti) <= t.family) return { meets: true, via: "family" };
  return { meets: false, via: null };
}

export const PPL_WORK_TEST = {
  monthsWorked: 10,
  monthsWindow: 13,
  /** Services Australia counts 10 months as 295 days and 13 months as 392 days. */
  daysWorkedPeriod: 295,
  daysWindow: 392,
  minHours: 330,
  /** No more than a 12-week gap between work days within the 10 months. */
  maxGapWeeks: 12,
} as const;

export const PPL_RULES = {
  /** Claim up to 3 months before the expected birth or adoption. */
  claimMonthsBefore: 3,
  /** Paid from the birth date if claim + proof are in within 14 weeks (100 days). */
  backdateDays: 100,
  /** At least one parent must claim within 52 weeks; all days used within 2 years. */
  firstClaimWeeks: 52,
  useWithinYears: 2,
  /** Employer pays if you've worked for them 12 months and take a continuous block of 8+ weeks. */
  employerMinBlockWeeks: 8,
  /** Services Australia withholds tax at this rate by default when it pays you. */
  defaultWithholding: 0.15,
  /** Working 1 hour or more on a PPL day counts as working that day. */
  workingDayHours: 1,
  /** Birth mother must not work within 14 days after the birth, even for an allowable reason. */
  birthMotherNoWorkDays: 14,
  /** PPL super contribution rate (ATO): the SG rate. */
  superRate: 0.12,
} as const;

/** Gross Parental Leave Pay for a number of days at a financial year's daily rate. */
export function pplGross(days: number, fy: PplFinancialYear = PPL_CURRENT_FY): number {
  return Math.round(Math.max(0, days) * PPL_RATES[fy].daily * 100) / 100;
}

/** Estimated super contribution (12%), excluding the ATO's interest component. */
export function pplSuperEstimate(grossPpl: number): number {
  return Math.round(Math.max(0, grossPpl) * PPL_RULES.superRate * 100) / 100;
}

/** Australian financial year label ("2026-27") for an ISO date. */
export function financialYearOf(iso: string): string {
  const y = Number(iso.slice(0, 4));
  const m = Number(iso.slice(5, 7));
  const start = m >= 7 ? y : y - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
}

/**
 * Lay a continuous block of weekday PPL days from a start date (Mon–Fri, the
 * way a 5-day week is counted) and count how many fall in each financial year.
 * Pure: UTC date arithmetic on ISO strings, no clock.
 */
export function pplDaysByFinancialYear(startISO: string, days: number): Record<string, number> {
  const out: Record<string, number> = {};
  const d = new Date(`${startISO.slice(0, 10)}T00:00:00Z`);
  let left = Math.max(0, Math.round(days));
  let guard = 0;
  while (left > 0 && guard < 5_000) {
    const dow = d.getUTCDay();
    if (dow !== 0 && dow !== 6) {
      const fy = financialYearOf(d.toISOString().slice(0, 10));
      out[fy] = (out[fy] ?? 0) + 1;
      left -= 1;
    }
    d.setUTCDate(d.getUTCDate() + 1);
    guard += 1;
  }
  return out;
}

/**
 * Gross PPL for a block, each day at the rate for the financial year it falls
 * in. Days in a year whose rate isn't published yet are priced at the latest
 * published rate and reported back as `unpublishedDays`.
 */
export function pplBlockGross(startISO: string, days: number): { gross: number; byYear: Record<string, number>; unpublishedDays: number } {
  const byYear = pplDaysByFinancialYear(startISO, days);
  let gross = 0;
  let unpublishedDays = 0;
  for (const [fy, n] of Object.entries(byYear)) {
    const rate = (PPL_RATES as Record<string, { daily: number }>)[fy];
    if (rate) gross += n * rate.daily;
    else {
      unpublishedDays += n;
      gross += n * PPL_RATES[PPL_CURRENT_FY].daily;
    }
  }
  return { gross: Math.round(gross * 100) / 100, byYear, unpublishedDays };
}

/**
 * Split a family's days between the claimant and a partner. The partner's
 * reserved days can only be used by the partner; if the partner takes fewer,
 * the unused reserved days are lost (the claimant cannot take them). A single
 * parent gets all days.
 */
export function pplSplit(
  entitlement: PplEntitlement,
  partnered: boolean,
  partnerDaysRequested: number,
): { claimantDays: number; partnerDays: number; forfeitedDays: number } {
  if (!partnered) return { claimantDays: entitlement.days, partnerDays: 0, forfeitedDays: 0 };
  const partnerDays = Math.min(entitlement.days, Math.max(0, Math.round(partnerDaysRequested)));
  const claimantMax = entitlement.days - entitlement.reservedForPartner;
  const claimantDays = Math.min(claimantMax, entitlement.days - partnerDays);
  const forfeitedDays = entitlement.days - claimantDays - partnerDays;
  return { claimantDays, partnerDays, forfeitedDays };
}
