// =============================================================================
// Tax calendar 2026-27 — every date /tax-calendar/ prints
// Run tests with: npm test
//
// The return dates are NOT redefined here: they come from RETURN_2026
// (tax-return-2025-26.ts), and the last quarterly super dates come from
// SUPER_GUARANTEE_CHARGE.legacy (australian-tax.ts). This file adds the
// quarterly BAS / PAYG instalment cycle, STP finalisation, the annual
// instalment and GST dates, the penalty unit, and the ATO's list of
// whole-of-state public holidays used to work out the next business day.
//
// Verified 23 Sep 2026 via Firecrawl:
//  - BAS due dates (last updated 17 Sep 2026): quarterly 28 Oct / 28 Feb /
//    28 Apr / 28 Jul; monthly "21st day of the month following"; annual GST
//    return 31 October; 2-week online concession "does not apply for
//    quarter 2"; "If the due date is on a weekend or public holiday, you have
//    until the next business day".
//    https://www.ato.gov.au/businesses-and-organisations/preparing-lodging-and-paying/business-activity-statements-bas/due-dates-for-lodging-and-paying-your-bas
//  - PAYG instalments (last updated 3 Mar 2026): quarterly 28 Oct / 28 Feb /
//    28 Apr / 28 Jul; two-instalment payers 75% by 28 April, rest by 28 July;
//    annual instalment "pay your annual instalment by 21 October" if you use
//    a tax agent (self-preparers just lodge the return by 31 October).
//    https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/payg-instalments/when-are-payg-instalments-due
//  - STP end-of-year finalisation: "by 14 July each year"; closely held payees
//    of employers with 20+ employees "30 September each year".
//    https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/single-touch-payroll/start-reporting/end-of-year-finalisation-through-stp
//  - Penalty units (last updated 26 Jun 2026): $364 on or after 1 July 2026;
//    $330 from 7 Nov 2024 to 30 Jun 2026.
//    https://www.ato.gov.au/individuals-and-families/paying-the-ato/interest-and-penalties/penalties/penalty-units
//  - Failure to lodge penalty (last updated 22 Jun 2026): one penalty unit for
//    every 28 days or part, maximum 5; x2 medium withholder, x5 large.
//    https://www.ato.gov.au/individuals-and-families/paying-the-ato/interest-and-penalties/penalties/failure-to-lodge-on-time-penalty
//  - Weekends and public holidays (last updated 1 Jul 2026, QC34577): lodge or
//    pay on the next business day; a public holiday for the whole of ANY
//    state or territory counts nationally. Holiday list below is the ATO's.
//    https://www.ato.gov.au/tax-and-super-professionals/for-tax-professionals/prepare-and-lodge/registered-agent-lodgment-program/lodgment-and-payment-dates-on-weekends-or-public-holidays
//  - Payday Super: SG must be received by the fund within 7 business days of
//    each payday from 1 July 2026 — see payday-super.ts for its sources.
// =============================================================================

import { SUPER_GUARANTEE_CHARGE, TAX_BRACKETS_2026_27 } from "./australian-tax";
import { RETURN_2026, RETURN_2026_SOURCES } from "./tax-return-2025-26";

export const TAX_CALENDAR_SOURCES = {
  bas: "https://www.ato.gov.au/businesses-and-organisations/preparing-lodging-and-paying/business-activity-statements-bas/due-dates-for-lodging-and-paying-your-bas",
  paygInstalments:
    "https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/payg-instalments/when-are-payg-instalments-due",
  stp: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/single-touch-payroll/start-reporting/end-of-year-finalisation-through-stp",
  penaltyUnits:
    "https://www.ato.gov.au/individuals-and-families/paying-the-ato/interest-and-penalties/penalties/penalty-units",
  failureToLodge:
    "https://www.ato.gov.au/individuals-and-families/paying-the-ato/interest-and-penalties/penalties/failure-to-lodge-on-time-penalty",
  weekends:
    "https://www.ato.gov.au/tax-and-super-professionals/for-tax-professionals/prepare-and-lodge/registered-agent-lodgment-program/lodgment-and-payment-dates-on-weekends-or-public-holidays",
  paydaySuper:
    "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-on-payday/payment-deadlines-for-payday-super",
  agentProgram: RETURN_2026_SOURCES.agentProgram,
  myTax: RETURN_2026_SOURCES.myTax,
} as const;

export const PENALTY_UNIT = {
  /** For failures on or after 1 July 2026 — includes a 2025-26 return lodged late. */
  amount: 364,
  from: "1 July 2026",
  previousAmount: 330,
  previousPeriod: "7 November 2024 to 30 June 2026",
  ftlDaysPerUnit: 28,
  ftlMaxUnits: 5,
  mediumWithholderMultiplier: 2,
  largeWithholderMultiplier: 5,
} as const;

/** Maximum failure-to-lodge penalty for an individual or small withholder. */
export const FTL_MAX_INDIVIDUAL = PENALTY_UNIT.amount * PENALTY_UNIT.ftlMaxUnits;

/**
 * Whole-of-state-or-territory public holidays from the ATO's QC34577 tables
 * for 2026 and 2027 (to 30 June 2027). Any of these moves a due date
 * nationally.
 */
export const WHOLE_STATE_PUBLIC_HOLIDAYS: readonly string[] = [
  "2026-08-03", "2026-09-25", "2026-09-28", "2026-10-05", "2026-11-03",
  "2026-12-24", "2026-12-25", "2026-12-28", "2026-12-31",
  "2027-01-01", "2027-01-26", "2027-03-01", "2027-03-08", "2027-03-26",
  "2027-03-29", "2027-04-26", "2027-05-03", "2027-05-31", "2027-06-07",
  "2027-06-14",
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

function toIso(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** "31 October 2026" -> "2026-10-31". Throws on anything else, so a bad constant fails the build/tests. */
export function longDateToIso(s: string): string {
  const m = /^(\d{1,2}) ([A-Z][a-z]+) (\d{4})$/.exec(s);
  const month = m ? MONTHS.indexOf(m[2] as (typeof MONTHS)[number]) : -1;
  if (!m || month < 0) throw new Error(`Unparseable date: ${s}`);
  return toIso(Number(m[3]), month + 1, Number(m[1]));
}

function isoToUtc(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function isBusinessDay(iso: string): boolean {
  const dow = isoToUtc(iso).getUTCDay();
  return dow !== 0 && dow !== 6 && !WHOLE_STATE_PUBLIC_HOLIDAYS.includes(iso);
}

/** The date itself if it is a business day, otherwise the next business day. */
export function nextBusinessDay(iso: string): string {
  const d = isoToUtc(iso);
  let cur = iso;
  while (!isBusinessDay(cur)) {
    d.setUTCDate(d.getUTCDate() + 1);
    cur = toIso(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
  }
  return cur;
}

/** "2026-10-31" -> "31 Oct 2026" (short) or "31 October 2026" (long). */
export function formatIso(iso: string, style: "short" | "long" = "short"): string {
  const [y, m, d] = iso.split("-").map(Number);
  const name = MONTHS[m - 1];
  return `${d} ${style === "short" ? name.slice(0, 3) : name} ${y}`;
}

export function weekdayOf(iso: string): string {
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][isoToUtc(iso).getUTCDay()];
}

export type CalendarAudience = "Everyone" | "Individuals" | "Employers" | "Businesses" | "Tax agent clients" | "PAYG instalment payers";

export interface CalendarEvent {
  /** Standard due date as the ATO states it. */
  iso: string;
  /** Next business day when the standard date is a weekend or holiday; equal to iso otherwise. */
  effectiveIso: string;
  title: string;
  who: CalendarAudience;
  key?: boolean;
}

/** `deadline: false` for markers such as the start and end of the year, which never move. */
function ev(iso: string, title: string, who: CalendarAudience, key = false, deadline = true): CalendarEvent {
  return { iso, effectiveIso: deadline ? nextBusinessDay(iso) : iso, title, who, key };
}

export const CALENDAR_YEAR = {
  incomeYear: "2026-27",
  start: "1 July 2026",
  end: "30 June 2027",
  /** The return lodged during this calendar. */
  returnIncomeYear: RETURN_2026.incomeYear,
} as const;

/** Quarterly BAS and PAYG instalments share the same four dates. */
export const QUARTERS_2026_27 = [
  { q: "Q1", period: "July – September 2026", ...pick("2026-10-28") },
  { q: "Q2", period: "October – December 2026", ...pick("2027-02-28") },
  { q: "Q3", period: "January – March 2027", ...pick("2027-04-28") },
  { q: "Q4", period: "April – June 2027", ...pick("2027-07-28") },
] as const;

function pick(iso: string) {
  return { iso, effectiveIso: nextBusinessDay(iso) };
}

export const RETURN_DATES_2026 = {
  selfLodge: pick(longDateToIso(RETURN_2026.selfLodgeDueDate)),
  agentLargeLiability: pick(longDateToIso(RETURN_2026.agentDueDateLargeLiability)),
  agentMostPeople: pick(longDateToIso(RETURN_2026.agentDueDateMostPeople)),
  agentConcession: pick(longDateToIso(RETURN_2026.agentConcessionDate)),
  annualPaygInstalment: pick("2026-10-21"),
  annualGstReturn: pick("2026-10-31"),
} as const;

export const LEGACY_SUPER_DATES = {
  finalQuarterSG: pick(longDateToIso(SUPER_GUARANTEE_CHARGE.legacy.finalQuarterSGDue)),
  finalQuarterStatement: pick(longDateToIso(SUPER_GUARANTEE_CHARGE.legacy.finalQuarterStatementDue)),
} as const;

const MONTHLY_BAS: CalendarEvent[] = Array.from({ length: 13 }, (_, i) => {
  // Due 21 July 2026 (June BAS) through 21 July 2027 (June 2027 BAS).
  const month = ((6 + i) % 12) + 1;
  const year = 2026 + Math.floor((6 + i) / 12);
  const prev = MONTHS[(month + 10) % 12];
  return ev(toIso(year, month, 21), `Monthly BAS for ${prev} due`, "Businesses");
});

/** Every dated event from July 2026 to July 2027, in date order. */
export const TAX_CALENDAR_2026_27: readonly CalendarEvent[] = [
  ev("2026-07-01", `2026-27 income year starts. Payday Super begins; second tax bracket falls to ${Math.round(TAX_BRACKETS_2026_27[1].rate * 100)}%; penalty unit rises to $${PENALTY_UNIT.amount}`, "Everyone", true, false),
  ev("2026-07-14", "STP finalisation declaration for 2025-26", "Employers"),
  ev(LEGACY_SUPER_DATES.finalQuarterSG.iso, "Q4 2025-26 BAS and PAYG instalment; last-ever quarterly super guarantee payment (April–June 2026)", "Employers"),
  ev(LEGACY_SUPER_DATES.finalQuarterStatement.iso, "SGC statement due if the April–June 2026 super was paid late", "Employers"),
  ev("2026-09-30", "STP finalisation for closely held payees (employers with 20 or more employees)", "Employers"),
  ev(RETURN_DATES_2026.annualPaygInstalment.iso, "Annual PAYG instalment for 2025-26 (if a tax agent lodges your return)", "PAYG instalment payers"),
  ev(QUARTERS_2026_27[0].iso, "Q1 2026-27 BAS and PAYG instalment (July–September)", "Businesses"),
  ev(RETURN_DATES_2026.selfLodge.iso, `${RETURN_2026.incomeYear} tax return due if you lodge it yourself; annual GST return due`, "Individuals", true),
  ev(QUARTERS_2026_27[1].iso, "Q2 2026-27 BAS and PAYG instalment (October–December)", "Businesses"),
  ev(RETURN_DATES_2026.agentLargeLiability.iso, `${RETURN_2026.incomeYear} return for agent clients whose latest return had a liability of $20,000 or more`, "Tax agent clients"),
  ev(QUARTERS_2026_27[2].iso, "Q3 2026-27 BAS and PAYG instalment (January–March); 75% for two-instalment payers", "Businesses"),
  ev(RETURN_DATES_2026.agentMostPeople.iso, `${RETURN_2026.incomeYear} tax return due for most tax agent clients`, "Tax agent clients", true),
  ev(RETURN_DATES_2026.agentConcession.iso, "Concession date for 15 May agent returns, if any payment is also made by then", "Tax agent clients"),
  ev("2027-06-30", "2026-27 income year ends: last day for deductible spending, super contributions and donations this year", "Everyone", true, false),
  ev("2027-07-14", "STP finalisation declaration for 2026-27", "Employers"),
  ev(QUARTERS_2026_27[3].iso, "Q4 2026-27 BAS and PAYG instalment (April–June)", "Businesses"),
  ...MONTHLY_BAS,
].sort((a, b) => a.iso.localeCompare(b.iso) || (a.key === b.key ? 0 : a.key ? -1 : 1));
