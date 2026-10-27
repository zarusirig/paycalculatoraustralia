// Helpers for the /pay-calculator-<state>/ FAQ arrays. Kept out of
// state-sections.tsx because that file is "use client": the page files build
// FAQPage JSON-LD on the server from the same arrays the accordion renders.

import { EMPLOYMENT, calculatePayBreakdown, formatAUD } from "@/lib/constants";
import { STATE_EMPLOYEE_SOURCES, weeklyToAnnualSalary, type StateEmployeeProfile } from "@/lib/data/state-employee";

/** Same figure as typicalSalary() in state-sections.tsx: the state's ABS AWOTE over a year. */
export function stateTypicalSalary(profile: StateEmployeeProfile): number {
  return weeklyToAnnualSalary(profile.awote.personsFullTime, EMPLOYMENT.weeksPerYear);
}

/** "$1,234.50 a week in ordinary time earnings, about $64,194 a year" */
export function awoteLine(profile: StateEmployeeProfile): string {
  return `${formatAUD(profile.awote.personsFullTime, 2)} a week in ordinary time earnings, about ${formatAUD(stateTypicalSalary(profile))} a year`;
}

/**
 * "$79,146 a year ($3,044.08 a fortnight)": take-home pay on stateTypicalSalary(),
 * the same engine call as the WorkedExample on each state page.
 */
export function takeHomeLine(profile: StateEmployeeProfile): string {
  const r = calculatePayBreakdown({ grossSalary: stateTypicalSalary(profile) });
  return `${formatAUD(r.takeHomePay)} a year (${formatAUD(r.fortnightly, 2)} a fortnight)`;
}

export const ABS_PERIOD = STATE_EMPLOYEE_SOURCES.absReferencePeriod;

/** 10_000_000 → "$10 million" */
export const millions = (n: number): string => `$${n / 1_000_000} million`;
