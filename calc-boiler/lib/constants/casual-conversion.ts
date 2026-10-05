// =============================================================================
// Casual conversion (the "employee choice pathway") — rules and the pay
// comparison behind /casual-conversion/.
//
// SOURCES, read 5 October 2026 (Firecrawl):
//  - Fair Work Ombudsman, "Becoming a permanent employee" (fairwork.gov.au/
//    starting-employment/types-of-employees/casual-employees/becoming-a-
//    permanent-employee; content last updated 7 August 2026; Fair Work Act
//    ss 66A-66M):
//      * A casual can change to permanent at any time if employer and employee
//        agree. The NES also gives the "employee choice pathway".
//      * Eligible if employed at least 6 months (12 months for a small
//        business) AND the employee believes they no longer meet the casual
//        definition. Written notice to the employer.
//      * Cannot give notice while in an ongoing dispute about it, or if in the
//        last 6 months the employer refused a previous notice or a dispute was
//        resolved.
//      * Employer must consult, then respond in writing within 21 days:
//        accept (status full-time or part-time, new hours, start date) or
//        refuse, with reasons.
//      * Change takes effect from the first day of the first full pay period
//        starting after the employer's response, unless otherwise agreed.
//      * Refusal reasons are limited to: the employee still meets the casual
//        definition; fair and reasonable operational grounds (substantial
//        changes to work organisation, significant impact on operations,
//        substantial changes to conditions needed to comply with an award or
//        agreement); or the change would breach a legally required recruitment
//        process.
//      * The pathway replaced "casual conversion" on 26 August 2024; employment
//        before that date is not counted for the 6/12 month test. Eligible
//        casuals employed immediately before that date could give notice from
//        26 February 2025 (not small business) or 26 August 2025 (small
//        business).
//      * Employers cannot reduce or vary hours, change the pattern of work or
//        terminate to avoid the right; adverse action is prohibited.
//  - FWO, "Casual employees": a casual has no firm advance commitment to
//    ongoing work and is entitled to a casual loading or specific casual rate.
//    A regular pattern of work alone does not make someone permanent. Under the
//    NES casuals get a pathway to permanent employment, 2 days unpaid carer's
//    leave and 2 days unpaid compassionate leave per occasion, 10 days paid
//    family and domestic violence leave a year, and unpaid community service
//    leave. Full-time and part-time employees get paid leave and must give or
//    receive notice.
//  - Casual loading: 25% (EMPLOYMENT.casualLoading; most modern awards).
// =============================================================================

import { EMPLOYMENT } from "./australian-tax";

export const CASUAL_CONVERSION_VERIFIED_ON = "5 October 2026";

export const CASUAL_CONVERSION_SOURCES = {
  becoming: "https://www.fairwork.gov.au/starting-employment/types-of-employees/casual-employees/becoming-a-permanent-employee",
  casual: "https://www.fairwork.gov.au/starting-employment/types-of-employees/casual-employees",
  fwAct: "https://www.legislation.gov.au/C2009A00028/latest/text",
} as const;

export const EMPLOYEE_CHOICE = {
  /** Months of employment needed, employer not a small business. */
  minMonths: 6,
  /** Months needed when employed by a small business. */
  minMonthsSmallBusiness: 12,
  /** Days the employer has to respond in writing. */
  responseDays: 21,
  /** Date the employee choice pathway replaced casual conversion. */
  startDate: "26 August 2024",
} as const;

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export interface ConversionCompare {
  /** Hourly base rate the permanent employee would be paid. */
  baseRate: number;
  /** Casual hourly rate = base × (1 + loading). */
  casualRate: number;
  hoursPerWeek: number;
  /** Permanent annual pay: 52 paid weeks (including paid leave). */
  permanentAnnual: number;
  /** Casual annual pay if paid for every week of the year. */
  casualAnnualFullYear: number;
  /** Weeks a casual must be paid for in the year to match the permanent annual pay. */
  breakEvenWeeks: number;
  /** Casual annual pay at the chosen number of paid weeks. */
  casualAnnualAtWeeks: number;
  paidWeeks: number;
  /** casualAnnualAtWeeks − permanentAnnual (negative: permanent is ahead). */
  difference: number;
}

/**
 * Casual vs permanent gross pay for the same base rate and hours. The permanent
 * employee is paid for all 52 weeks, with annual leave, sick leave and public
 * holidays inside it. The casual is paid loaded rate × hours for the weeks
 * actually worked. Gross figures only: both receive super guarantee and the
 * same tax scale applies to each.
 */
export function compareCasualToPermanent(baseRate: number, hoursPerWeek: number, paidWeeks: number, loading = EMPLOYMENT.casualLoading): ConversionCompare {
  const base = Math.max(0, baseRate);
  const hours = Math.max(0, hoursPerWeek);
  const weeks = Math.min(52, Math.max(0, paidWeeks));
  const casualRate = round2(base * (1 + loading));
  const permanentAnnual = round2(base * hours * EMPLOYMENT.weeksPerYear);
  const weeklyCasual = casualRate * hours;
  return {
    baseRate: base,
    casualRate,
    hoursPerWeek: hours,
    permanentAnnual,
    casualAnnualFullYear: round2(weeklyCasual * EMPLOYMENT.weeksPerYear),
    breakEvenWeeks: weeklyCasual > 0 ? round2(permanentAnnual / weeklyCasual) : 0,
    casualAnnualAtWeeks: round2(weeklyCasual * weeks),
    paidWeeks: weeks,
    difference: round2(weeklyCasual * weeks - permanentAnnual),
  };
}

/** The permanent base rate that corresponds to a casual rate that already includes the loading. */
export function baseRateFromCasual(casualRate: number, loading = EMPLOYMENT.casualLoading): number {
  return round2(Math.max(0, casualRate) / (1 + loading));
}
