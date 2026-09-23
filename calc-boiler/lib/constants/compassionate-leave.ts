// =============================================================================
// Compassionate (bereavement) leave and paid family and domestic violence
// leave — NES rules behind /compassionate-leave/ (G3, wave 4).
//
// Keyword demand (DataForSEO Labs, AU, 24 Sep 2026): compassionate leave 9,900
// (KD 0); family and domestic violence leave 720 (KD 2).
//
// SOURCES — read at fairwork.gov.au on 24 September 2026 (Firecrawl scrape):
//   - Compassionate and bereavement leave (Fair Work Act ss 12, 16, 104–106):
//     2 days "each time they meet the criteria"; all employees including
//     casuals; taken as one 2-day period, two 1-day periods or as agreed;
//     doesn't accumulate and isn't part of sick and carer's leave; can replace
//     other leave already being taken; full-time/part-time paid at base pay
//     rate for ordinary hours they would have worked (no bonuses, loadings,
//     allowances, overtime, penalties); casuals unpaid; can't be cashed out;
//     notice as soon as possible; employer may ask for reasonable evidence
//     (e.g. death or funeral notice, statutory declaration).
//     Triggers: death, or life-threatening illness or injury, of an immediate
//     family or household member; stillbirth of a baby in the immediate family
//     or household; the employee's miscarriage or their current spouse's or de
//     facto partner's miscarriage. Other relatives (cousins, aunts, uncles)
//     only if in the household or the employer agrees.
//   - Family and domestic violence leave: 10 days of paid leave each year for
//     all employees including casuals; available in full immediately; resets
//     on the work anniversary; doesn't accumulate; standalone (separate from
//     other leave).
// =============================================================================

export const COMPASSIONATE_VERIFIED_ON = "24 September 2026";

export const COMPASSIONATE_SOURCES = {
  compassionate: "https://www.fairwork.gov.au/leave/compassionate-and-bereavement-leave",
  factSheet: "https://www.fairwork.gov.au/tools-and-resources/fact-sheets/minimum-workplace-entitlements/sick-and-carers-leave-and-compassionate-leave",
  fdv: "https://www.fairwork.gov.au/leave/family-and-domestic-violence-leave",
  fwAct: "https://www.legislation.gov.au/C2009A00028/latest/text",
} as const;

export const COMPASSIONATE_LEAVE = {
  /** Days per permissible occasion (Fair Work Act s 104). */
  daysPerOccasion: 2,
  /** Paid FDV leave per 12 months, all employees including casuals. */
  fdvDaysPerYear: 10,
} as const;

export type CompassionateEmployment = "permanent" | "casual";

/**
 * Pay for compassionate leave: base hourly rate × the ordinary hours the
 * employee would have worked on the leave days. Casuals are unpaid.
 * `ordinaryHoursPerDay` is the hours rostered on each of the (up to 2) days.
 */
export function compassionateLeavePay(
  employment: CompassionateEmployment,
  baseHourlyRate: number,
  ordinaryHoursPerDay: number,
  days: number = COMPASSIONATE_LEAVE.daysPerOccasion,
  occasions = 1,
): number {
  if (employment === "casual") return 0;
  const d = Math.min(Math.max(0, days), COMPASSIONATE_LEAVE.daysPerOccasion);
  return Math.round(Math.max(0, baseHourlyRate) * Math.max(0, ordinaryHoursPerDay) * d * Math.max(0, occasions) * 100) / 100;
}
