// Shared pieces for the Oct 2026 professional salary pages (civil, electrical
// and mechanical engineer; software engineer; cyber security; and the
// award-free or coverage-depends roles).
//
// Professional Employees Award 2020 [MA000065] rows are read from the engineer
// page's table, which was transcribed from awards.fairwork.gov.au/MA000065.html
// ("incorporates all amendments up to and including 1 July 2026 (PR799345 and
// PR799501)"), re-read 9 October 2026: cl 14.1 annual wages and Schedule C.1 /
// C.2 hourly and casual rates are unchanged. Reading them from ENGINEER means a
// discipline page and its parent can never disagree.
//
// Clauses the payslip notes rely on, all read 9 October 2026:
//   cl 16.3  vehicle allowance — at least $1.00 per km for agreed private-car use
//   cl 16    NOTE — Fair Work Regulations 3.33(3) and 3.46(1)(g) require any
//            allowance to be separately identified on the payslip
//   cl 18.2(a) overtime beyond 38 hours at the minimum hourly rate
//   cl 18.5  hours records (over 38 a week; before 6 am / after 10 pm; Sundays and public holidays)
//   cl 18.6  cl 18.2–18.5 do not apply where the contractual annual salary
//            exceeds the classification's cl 14.1 minimum annual wage by 25% or more
//   cl 19.2  17.5% annual leave loading (capped; no extra if an equivalent benefit is paid)
//   Sch A.1.3 graduates progress one pay point on each anniversary, confirmed in writing
//   cl 4.1(a) engineers and scientists covered in any industry; cl 4.1(b) IT
//            professionals only where the employer is principally engaged in the
//            IT, telecommunications services or quality auditing industry
//   cl 4.2   excluded: employees covered by the Airport Employees, Black Coal
//            Mining, Electrical Power Industry, Nurses, Port Authorities, Rail
//            Industry, State Government Agencies and Water Industry awards
//   cl 4.3   excluded: local government employees covered by another award

import { EMPLOYMENT, calculatePayBreakdown, formatAUD } from "../../constants/australian-tax";
import { casualFromHourly, toCents } from "./common";
import { ENGINEER } from "./engineer";
import type { Allowance, AwardRef, OccupationSource, PenaltyRow, RateRow, RateTable } from "./types";

export const PROFESSIONAL_AWARD: AwardRef = ENGINEER.award!;

/** Classification labels exactly as the engineer table carries them (cl 14.1 wording). */
export const PEA = {
  grad3: "Level 1 Graduate professional — pay point 1.1 (3 year degree)",
  grad45: "Level 1 Graduate professional — pay point 1.1 (4 or 5 year degree)",
  pp12: "Level 1 Graduate professional — pay point 1.2",
  pp13: "Level 1 Graduate professional — pay point 1.3",
  pp14: "Level 1 Graduate professional — pay point 1.4",
  level2: "Level 2 Experienced professional",
  level3: "Level 3 Professional",
  level4: "Level 4 Professional",
} as const;

/** A Professional Employees Award row from the engineer table, with this page's own note (or none). */
export function peaRow(label: string, note?: string): RateRow {
  const row = ENGINEER.tables[0].rows.find((r) => r.label === label);
  if (!row) throw new Error(`peaRow: no Professional Employees Award row "${label}"`);
  const out: RateRow = { label: row.label, weekly: row.weekly, hourly: row.hourly, casualHourly: row.casualHourly };
  if (row.annual !== undefined) out.annual = row.annual;
  if (note) out.note = note;
  return out;
}

/** Penalty rates are the award's, so every Professional Employees Award page shows the same three lines. */
export const PEA_PENALTIES: PenaltyRow[] = ENGINEER.penalties;
export const PEA_PENALTIES_NOTE = ENGINEER.penaltiesNote;

/**
 * cl 18.6: the overtime, time-off, penalty and record-keeping clauses stop
 * applying when the contractual salary exceeds the classification's minimum
 * annual wage by 25% or more. This is that salary: minimum x 1.25, to the cent.
 */
export function exemptionThreshold(annualMinimum: number): number {
  return toCents(annualMinimum * 1.25);
}

/** Take-home a year on a salary: 2026–27 resident rates, LITO, Medicare levy, no HECS, no surcharge (the site's engine). */
export function netAnnual(gross: number): number {
  return calculatePayBreakdown({ grossSalary: gross, includeHECS: false, hasPrivateHealth: true }).takeHomePay;
}

/** Take-home a fortnight on a salary, as the engine reports it. */
export function netFortnightly(gross: number): number {
  return calculatePayBreakdown({ grossSalary: gross, includeHECS: false, hasPrivateHealth: true }).fortnightly;
}

/** Date every figure on the Oct 2026 professional pages was read from its source. */
export const PROFESSIONAL_VERIFIED_ON = "9 October 2026";

/**
 * Fair Work Ombudsman, "Pay slips" (fairwork.gov.au/pay-and-wages/paying-wages/pay-slips),
 * read 9 October 2026: pay slips within 1 working day of pay day; must show
 * gross and net pay, any loadings, allowances, bonuses, incentive-based
 * payments or penalty rates that can be separated out, each deduction with the
 * fund or account it went to, and super contributions with the fund's name.
 */
export const FWO_PAY_SLIPS: OccupationSource = {
  title: "Pay slips",
  publisher: "Fair Work Ombudsman",
  url: "https://www.fairwork.gov.au/pay-and-wages/paying-wages/pay-slips",
};

export const NMW_ORDER_2026: OccupationSource = {
  title: "National Minimum Wage Order 2026 (PR799279)",
  publisher: "Fair Work Commission",
  url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr799279.pdf",
};

/** The payslip line every professional page shares, from the FWO pay slips page. */
export const PAYSLIP_SUPER_AND_DEDUCTIONS =
  "Super and deductions: each payslip must show the super your employer paid, or will pay, for the period and the fund it goes to, and every deduction — salary sacrifice included — with the fund or account it was paid into (Fair Work Ombudsman, pay slips).";

/** Professional Employees Award cl 16.2 and 16.3, 1 July 2026. */
export const PEA_ALLOWANCES: Allowance[] = [
  {
    name: "Vehicle allowance",
    amount: "At least $1.00 per km",
    note: "When you and your employer agree that you will use your own vehicle on the employer's business (cl 16.3).",
  },
  {
    name: "Travelling expenses",
    amount: "Reasonable costs",
    note: "All reasonable expenses, including accommodation and meals, incurred while travelling on the employer's business (cl 16.2).",
  },
];

/**
 * The National Minimum Wage row an award-free or coverage-depends page shows
 * as the legal floor: NMW Order 2026 (PR799279), $1,004.90 a week, $26.44 an
 * hour, casual $33.05 — the same figures as EMPLOYMENT.minimumWage*.
 */
export function nmwRow(note: string): RateRow {
  return {
    label: "National Minimum Wage (adult)",
    weekly: EMPLOYMENT.minimumWageWeekly,
    hourly: EMPLOYMENT.minimumWageHourly,
    casualHourly: casualFromHourly(EMPLOYMENT.minimumWageHourly),
    note,
  };
}

/** Fair Work Ombudsman, pay slips: timing and the gross/net requirement. */
export const PAYSLIP_TIMING =
  "Timing: a payslip must reach you within 1 working day of pay day, even when you are on leave, and must show your gross and net pay for the period (Fair Work Ombudsman, pay slips).";

/** Fair Work Ombudsman, pay slips: separately identifiable payments. */
export const PAYSLIP_BONUSES =
  "Bonuses and incentive payments: any bonus, commission or other incentive-based payment that can be separated from your ordinary pay must be shown as its own amount on the payslip (Fair Work Ombudsman, pay slips).";

/**
 * The legal floor shown on a page whose job title no award names: the
 * National Minimum Wage, labelled so it reads as a floor, not a salary.
 */
export function nmwTable(plural: string): RateTable {
  return {
    id: "minimum-wage",
    title: `The legal floor for award-free ${plural}`,
    intro:
      "The National Minimum Wage Order 2026 (PR799279), from the first full pay period starting on or after 1 July 2026. It is the floor for an award-free adult employee, not a typical salary for this job.",
    rows: [nmwRow("Award-free employees aged 21 and over")],
  };
}

export const DEPENDS_PENALTIES_NOTE =
  "No award sets penalty rates for this job title. If an award covers you through your employer's industry, its penalty rates apply; if none does, penalty, overtime and time-in-lieu terms come from your contract or enterprise agreement.";

export const DEPENDS_OVERTIME: string[] = [
  "Award-free employees have no award overtime rate. The National Employment Standards let an employer require reasonable additional hours; whether they are paid, banked as time in lieu or absorbed into a salary depends on your contract.",
  "Your pay for ordinary hours must still be at least the National Minimum Wage.",
];

/** Whole dollars, "$131,274". */
export function aud(n: number): string {
  return formatAUD(n);
}

/** Dollars and cents, "$34.57". */
export function aud2(n: number): string {
  return formatAUD(n, 2);
}
