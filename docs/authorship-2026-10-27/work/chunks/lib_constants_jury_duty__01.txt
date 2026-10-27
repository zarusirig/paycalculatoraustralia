// =============================================================================
// Jury duty pay — NES community service leave (Fair Work Act ss 108–112).
// Feeds /jury-duty-pay/ (G3, wave 4).
//
// Keyword demand (DataForSEO Labs, AU, 24 Sep 2026): jury duty pay 1,300
// (KD 0); community service leave 390 (KD 0).
//
// SOURCE — Fair Work Ombudsman, "Jury duty"
// (fairwork.gov.au/leave/community-service-leave/jury-duty), read 24 Sep 2026:
//   - All employees, including casuals, can take leave for jury duty,
//     including jury selection and reasonable travel and rest time.
//   - Notice as soon as possible; evidence of attendance if requested.
//   - Full-time and part-time: the employer must pay the base pay rate for the
//     ordinary hours they would have worked for the first 10 days absent from
//     work because of jury duty.
//   - The employer can ask for evidence of the court payment. If asked and not
//     given: no employer pay for those 10 days. If given: only "make-up pay" —
//     the base pay for the ordinary hours minus the court payment (excluding
//     expense-related allowances).
//   - Worked examples: Julie (full-time, $300/day, court $90/day, 15 days)
//     gets $210/day make-up pay for the first 10 days, nothing from the
//     employer for the last 5, and $90/day from the court for all 15. Samuel
//     (part-time Mon–Wed, $250/day) misses 9 workdays and gets $160/day for
//     all 9, plus $90/day from the court for all 15 days.
//   - Casuals: no NES pay; an award, agreement, contract or state law may pay.
//   - State and territory jury laws apply where more beneficial.
// =============================================================================

export const JURY_DUTY_VERIFIED_ON = "24 September 2026";

export const JURY_DUTY_SOURCES = {
  fwo: "https://www.fairwork.gov.au/leave/community-service-leave/jury-duty",
  communityServiceLeave: "https://www.fairwork.gov.au/leave/community-service-leave",
  fwAct: "https://www.legislation.gov.au/C2009A00028/latest/text",
} as const;

/** State and territory jury information pages, as the FWO lists them. */
export const STATE_JURY_PAGES = [
  { state: "ACT", name: "ACT Supreme Court", url: "https://www.courts.act.gov.au/supreme" },
  { state: "NSW", name: "NSW Communities and Justice", url: "https://courts.nsw.gov.au/" },
  { state: "NT", name: "Supreme Court of the Northern Territory", url: "https://supremecourt.nt.gov.au/jurors" },
  { state: "QLD", name: "Queensland Government", url: "http://www.qld.gov.au/law/court/jury-duty/" },
  { state: "SA", name: "Courts Administration Authority of South Australia", url: "https://www.courts.sa.gov.au/going-to-court/jurors/" },
  { state: "TAS", name: "Supreme Court of Tasmania", url: "http://www.supremecourt.tas.gov.au/jurors" },
  { state: "WA", name: "Western Australian Government", url: "https://www.wa.gov.au/service/justice/civil-law/jury-duty-western-australia" },
  { state: "VIC", name: "Juries Victoria", url: "https://www.juriesvictoria.vic.gov.au/" },
] as const;

/** Employer-paid days under the NES. */
export const JURY_DUTY_PAID_DAYS = 10;

export type JuryEmployment = "permanent" | "casual";
/** Whether the employer asked for evidence of the court payment, and whether it was given. */
export type CourtEvidence = "not-requested" | "requested-given" | "requested-not-given";

export interface JuryDutyInput {
  employment: JuryEmployment;
  /** Base pay for the ordinary hours of one workday. */
  baseDailyPay: number;
  /** Court payment per day of jury service, excluding expense allowances. */
  courtPerDay: number;
  /** Days of jury service (the court pays for each). */
  juryDays: number;
  /** Workdays you would have worked that you miss. */
  workdaysMissed: number;
  evidence: CourtEvidence;
}

export interface JuryDutyResult {
  employerPaidDays: number;
  employerPerDay: number;
  employerTotal: number;
  courtTotal: number;
  total: number;
  /** Base pay you would have earned on the missed workdays. */
  normalPay: number;
}

export function juryDutyPay(i: JuryDutyInput): JuryDutyResult {
  const base = Math.max(0, i.baseDailyPay);
  const court = Math.max(0, i.courtPerDay);
  const missed = Math.max(0, Math.floor(i.workdaysMissed));
  const paidDays = i.employment === "casual" ? 0 : Math.min(missed, JURY_DUTY_PAID_DAYS);
  const perDay =
    i.employment === "casual" || i.evidence === "requested-not-given" ? 0
      : i.evidence === "requested-given" ? Math.max(0, base - court)
        : base;
  const employerTotal = round2(paidDays * perDay);
  const courtTotal = round2(Math.max(0, Math.floor(i.juryDays)) * court);
  return {
    employerPaidDays: perDay > 0 ? paidDays : 0,
    employerPerDay: round2(perDay),
    employerTotal,
    courtTotal,
    total: round2(employerTotal + courtTotal),
    normalPay: round2(missed * base),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
