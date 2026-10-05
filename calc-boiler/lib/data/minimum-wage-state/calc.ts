// Take-home at the minimum wage — pure arithmetic, no page copy, so the client
// calculator can import it without pulling in the public holiday data.
import { calculatePayBreakdown, EMPLOYMENT } from "../../constants/australian-tax";
import { CASUAL_LOADING, JUNIOR_BANDS, juniorCasualHourlyRate, juniorHourlyRate, juniorWeeklyRate } from "../../constants/junior-rates";
import { LSL_JURISDICTIONS, type JurisdictionCode } from "../../constants/long-service-leave";
import { NMW, QLD_STATE_WAGE_CASE_2026, WA_STATE_MINIMUM_WAGE, roundCents } from "../../constants/minimum-wage";

export type MwStateSlug = "nsw" | "vic" | "wa" | "sa" | "tas" | "qld" | "act" | "nt";

// -----------------------------------------------------------------------------
// Wage basis
// -----------------------------------------------------------------------------

export type MwBasisKey = "nmw" | "wa-state" | "qld-state";

export interface MwBasis {
  key: MwBasisKey;
  label: string;
  hourly: number;
  weekly: number;
  /** Adult rate only: the state figure has no junior table we can read. */
  adultOnly: boolean;
  note: string;
}

const NMW_BASIS: MwBasis = {
  key: "nmw",
  label: "National Minimum Wage (national system)",
  hourly: NMW.hourly,
  weekly: NMW.weekly,
  adultOnly: false,
  note: `The National Minimum Wage of $${NMW.hourly.toFixed(2)} an hour ($${NMW.weekly.toFixed(2)} for ${EMPLOYMENT.standardWeeklyHours} hours), operative from the first full pay period on or after 1 July 2026.`,
};

/** The wage bases the calculator offers for a state: the national one, plus a state minimum where one exists. */
export function basesFor(slug: MwStateSlug): MwBasis[] {
  if (slug === "wa") {
    return [
      NMW_BASIS,
      {
        key: "wa-state",
        label: "WA State Minimum Wage (WA state system, adults 21+)",
        hourly: WA_STATE_MINIMUM_WAGE.hourly,
        weekly: WA_STATE_MINIMUM_WAGE.weekly,
        adultOnly: true,
        note: `The WA State Minimum Wage of $${WA_STATE_MINIMUM_WAGE.hourly.toFixed(2)} an hour ($${WA_STATE_MINIMUM_WAGE.weekly.toFixed(2)} a week) from ${WA_STATE_MINIMUM_WAGE.operativeFrom}, for employees in the WA state system.`,
      },
    ];
  }
  if (slug === "qld") {
    return [
      NMW_BASIS,
      {
        key: "qld-state",
        label: "Queensland minimum wage (Queensland state system)",
        hourly: roundCents(QLD_STATE_WAGE_CASE_2026.qmwWeekly / EMPLOYMENT.standardWeeklyHours),
        weekly: QLD_STATE_WAGE_CASE_2026.qmwWeekly,
        adultOnly: true,
        note: `The Queensland minimum wage of $${QLD_STATE_WAGE_CASE_2026.qmwWeekly.toFixed(2)} a week from ${QLD_STATE_WAGE_CASE_2026.operativeFrom}. The hourly figure is our arithmetic: the weekly rate over ${EMPLOYMENT.standardWeeklyHours} hours.`,
      },
    ];
  }
  return [NMW_BASIS];
}

// -----------------------------------------------------------------------------
// Take-home calculation
// -----------------------------------------------------------------------------

export type MwEmployment = "permanent" | "casual";

export interface MwTakeHomeInput {
  basis: MwBasisKey;
  state: MwStateSlug;
  /** Age band label from JUNIOR_BANDS ("21 and over", "20", ...). Ignored for adult-only bases. */
  age: string;
  employment: MwEmployment;
  hoursPerWeek: number;
}

export interface MwTakeHomeResult {
  hourly: number;
  weeklyGross: number;
  fortnightlyGross: number;
  annualGross: number;
  incomeTax: number;
  medicareLevy: number;
  annualNet: number;
  weeklyNet: number;
  fortnightlyNet: number;
  superAnnual: number;
  /** Long service leave weeks that accrue per year of service in this state, as the state publishes it. */
  lslWeeksPerYear: number;
  /** The dollar value of a year's accrual at this weekly pay (permanent employees only). */
  lslValuePerYear: number;
  /** One day's base pay for a public holiday you do not work (permanent staff on a normal working day). */
  publicHolidayDayPay: number;
}

const WEEKS_PER_YEAR = EMPLOYMENT.weeksPerYear;

function clampHours(h: number): number {
  if (!Number.isFinite(h)) return 0;
  return Math.min(Math.max(h, 0), 80);
}

export function hourlyFor(basis: MwBasis, age: string, employment: MwEmployment): number {
  let base = basis.hourly;
  if (basis.key === "nmw" && age !== "21 and over") {
    const band = JUNIOR_BANDS.find((b) => b.age === age);
    if (band) {
      return employment === "casual" ? juniorCasualHourlyRate(band.percentage) : juniorHourlyRate(band.percentage);
    }
  }
  if (basis.key === "nmw") {
    // The NMW constant already carries the published casual rate.
    return employment === "casual" ? NMW.casualHourly : base;
  }
  base = roundCents(base);
  return employment === "casual" ? roundCents(base * (1 + CASUAL_LOADING)) : base;
}

/** The published full-time weekly rate for a basis and age (the 38-hour week), before any casual loading. */
export function weeklyFor(basis: MwBasis, age: string): number {
  if (basis.key === "nmw" && age !== "21 and over") {
    const band = JUNIOR_BANDS.find((b) => b.age === age);
    if (band) return juniorWeeklyRate(band.percentage);
  }
  return basis.weekly;
}

export function minimumWageTakeHome(input: MwTakeHomeInput): MwTakeHomeResult {
  const basis = basesFor(input.state).find((b) => b.key === input.basis) ?? NMW_BASIS;
  const hours = clampHours(input.hoursPerWeek);
  const hourly = hourlyFor(basis, basis.adultOnly ? "21 and over" : input.age, input.employment);
  const effAge = basis.adultOnly ? "21 and over" : input.age;
  // Permanent staff: the published 38-hour weekly rate, scaled by hours. Casuals: the casual hourly rate x hours.
  const weeklyGross =
    input.employment === "casual"
      ? roundCents(hourly * hours)
      : roundCents((weeklyFor(basis, effAge) * hours) / EMPLOYMENT.standardWeeklyHours);
  const annualGross = Math.round(weeklyGross * WEEKS_PER_YEAR);
  const b = calculatePayBreakdown({ grossSalary: annualGross, includeHECS: false, hasPrivateHealth: true });
  const lsl = LSL_JURISDICTIONS[input.state as JurisdictionCode];
  const lslWeeksPerYear = lsl.weeksPerYear;
  return {
    hourly,
    weeklyGross,
    fortnightlyGross: roundCents(weeklyGross * 2),
    annualGross,
    incomeTax: b.netIncomeTax,
    medicareLevy: b.medicareLevy,
    annualNet: b.takeHomePay,
    weeklyNet: roundCents(b.takeHomePay / WEEKS_PER_YEAR),
    fortnightlyNet: roundCents(b.takeHomePay / 26),
    superAnnual: b.superContribution,
    lslWeeksPerYear,
    lslValuePerYear: input.employment === "casual" ? 0 : roundCents(lslWeeksPerYear * weeklyGross),
    publicHolidayDayPay: input.employment === "casual" ? 0 : roundCents(hourly * (hours / 5)),
  };
}

/** Full-time adult NMW take-home in a state: the headline figure on every page. */
export function fullTimeAdultTakeHome(state: MwStateSlug): MwTakeHomeResult {
  return minimumWageTakeHome({ basis: "nmw", state, age: "21 and over", employment: "permanent", hoursPerWeek: EMPLOYMENT.standardWeeklyHours });
}

