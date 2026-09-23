// =============================================================================
// Concessional contributions — cap history, carry-forward, contributions tax,
// Division 293, and a cap-aware salary sacrifice check.
//
// The current cap is SUPER_GUARANTEE.concessionalCap in australian-tax.ts (the
// single source of truth); this file adds the history and the rules around it.
//
// Sources, all ato.gov.au, read 23 September 2026:
//   QC19749 "Concessional contributions cap" (last updated 2 July 2026):
//     "From 1 July 2026, the concessional contributions cap is $32,500";
//     $30,000 from 1 July 2024 to 30 June 2026; $27,500 from 1 July 2021 to
//     30 June 2024; $25,000 from 1 July 2017 to 30 June 2021. Carry-forward:
//     "a total super balance of less than $500,000 at 30 June of the previous
//     financial year" and "unused concessional contributions cap amounts from
//     up to 5 previous years", "starting from 2018–19"; unused amounts "expire"
//     after 5 years; "The oldest available unused cap amounts are carried
//     forward first"; "applied automatically once you exceed the cap". Excess:
//     "included in your assessable income", "taxed at your marginal tax rate
//     less a 15% tax offset"; "From 1 July 2021, the ECC charge no longer
//     applies"; you can release "up to 85% of your ECC".
//   "Key superannuation rates and thresholds – contributions caps" (last
//     updated 11 September 2026): Table 1.1 caps by income year.
//   QC23227 "Salary sacrificing super" (last updated 21 April 2026):
//     concessional contributions "are taxed in the super fund at a rate of
//     15%"; salary sacrifice does not "reduce the amount that your employer
//     calculates your super entitlement on"; Division 293 "applies ... when
//     your combined income and concessional super contributions for Division
//     293 purposes is more than $250,000".
//   "Division 293 tax on concessional contributions by high-income earners"
//     (last updated 24 August 2026): "15% of the excess over the threshold or
//     the taxable super contributions, whichever is less"; example "Jan":
//     income $240,000 + contributions $15,000 -> 15% x $5,000 = $750. Div 293
//     income is the MLS income test without reportable super contributions.
//   "Super guarantee" key rates (last updated 17 April 2026): 12% from
//     1 July 2025; maximum contribution base annual from 1 July 2026.
// =============================================================================

import { SITE_CONFIG, SUPER_GUARANTEE } from "./australian-tax";

/** General concessional contributions cap by income year. ATO Table 1.1. */
export const CONCESSIONAL_CAP_BY_YEAR: Readonly<Record<string, number>> = {
  "2017-18": 25_000,
  "2018-19": 25_000,
  "2019-20": 25_000,
  "2020-21": 25_000,
  "2021-22": 27_500,
  "2022-23": 27_500,
  "2023-24": 27_500,
  "2024-25": 30_000,
  "2025-26": 30_000,
  "2026-27": SUPER_GUARANTEE.concessionalCap,
};

export const CARRY_FORWARD = {
  /** Total super balance must be BELOW this at 30 June of the previous year. */
  totalSuperBalanceLimit: 500_000,
  /** Unused amounts are available for this many later years, then expire. */
  years: 5,
  /** First year whose unused cap can be carried forward. */
  firstYear: "2018-19",
} as const;

/** Tax on concessional contributions inside the fund. */
export const CONTRIBUTIONS_TAX_RATE = 0.15;

export const DIVISION_293 = {
  /** Income + concessional contributions above this attract Division 293. */
  threshold: 250_000,
  /** Extra tax on the lesser of the excess and the concessional contributions. */
  rate: 0.15,
} as const;

/** Non-refundable offset on excess concessional contributions, as a rate. */
export const ECC_TAX_OFFSET_RATE = 0.15;
/** Share of excess concessional contributions you can elect to release. */
export const ECC_MAX_RELEASE = 0.85;

/** "2026-27" -> "2025-26". */
export function previousIncomeYear(fy: string): string {
  const start = Number(fy.slice(0, 4)) - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
}

/**
 * The (up to) five previous years whose unused cap can be carried into `fy`,
 * oldest first — the order the ATO applies them in. Never earlier than 2018-19.
 */
export function carryForwardWindow(fy: string = SITE_CONFIG.financialYear): { year: string; cap: number }[] {
  const out: { year: string; cap: number }[] = [];
  let y = fy;
  for (let i = 0; i < CARRY_FORWARD.years; i++) {
    y = previousIncomeYear(y);
    if (y < CARRY_FORWARD.firstYear) break;
    const cap = CONCESSIONAL_CAP_BY_YEAR[y];
    if (cap === undefined) break;
    out.unshift({ year: y, cap });
  }
  return out;
}

/** Employer SG for a year on a salary, limited by the annual maximum contribution base. */
export function annualSuperGuarantee(salary: number): number {
  const base = Math.min(Math.max(0, salary), SUPER_GUARANTEE.maxContributionBaseAnnual);
  return Math.round(base * SUPER_GUARANTEE.rate * 100) / 100;
}

export interface CapPositionInput {
  /** Salary before any sacrifice — SG is calculated on this. */
  salary: number;
  salarySacrifice: number;
  /** Personal contributions you will claim a tax deduction for. */
  personalDeductible: number;
  /** Any other employer concessional contributions (e.g. above-SG, fund fees paid by employer). */
  otherEmployer: number;
  /** Unused cap amounts still available from the previous five years, total. */
  unusedCarryForward: number;
  /** Total super balance at 30 June of the previous year. */
  totalSuperBalance: number;
}

export interface CapPosition {
  superGuarantee: number;
  totalConcessional: number;
  generalCap: number;
  carryForwardEligible: boolean;
  carryForwardAvailable: number;
  availableCap: number;
  /** Room left under the available cap. */
  headroom: number;
  /** Amount over the available cap. */
  excess: number;
  /** Largest salary sacrifice that keeps you within the available cap. */
  maxSalarySacrifice: number;
}

export function concessionalCapPosition(i: CapPositionInput): CapPosition {
  const nn = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);
  const superGuarantee = annualSuperGuarantee(i.salary);
  const fixed = superGuarantee + nn(i.personalDeductible) + nn(i.otherEmployer);
  const totalConcessional = Math.round((fixed + nn(i.salarySacrifice)) * 100) / 100;
  const generalCap = SUPER_GUARANTEE.concessionalCap;
  const carryForwardEligible = nn(i.totalSuperBalance) < CARRY_FORWARD.totalSuperBalanceLimit;
  const carryForwardAvailable = carryForwardEligible ? nn(i.unusedCarryForward) : 0;
  const availableCap = generalCap + carryForwardAvailable;
  return {
    superGuarantee,
    totalConcessional,
    generalCap,
    carryForwardEligible,
    carryForwardAvailable,
    availableCap,
    headroom: Math.max(0, Math.round((availableCap - totalConcessional) * 100) / 100),
    excess: Math.max(0, Math.round((totalConcessional - availableCap) * 100) / 100),
    maxSalarySacrifice: Math.max(0, Math.floor(availableCap - fixed)),
  };
}

/**
 * Division 293 estimate on the two items most people have: taxable income and
 * concessional contributions. The ATO's full income test also adds reportable
 * fringe benefits and net investment losses, so this is a floor, not a ruling.
 */
export function division293Estimate(taxableIncome: number, concessional: number): number {
  const excess = Math.max(0, taxableIncome) + Math.max(0, concessional) - DIVISION_293.threshold;
  if (excess <= 0) return 0;
  return Math.round(Math.min(excess, Math.max(0, concessional)) * DIVISION_293.rate * 100) / 100;
}

// ---------- Non-concessional bring-forward, transfer balance cap, low rate cap, Division 296 ----------
//
// Sources, all ato.gov.au, read 23 September 2026 via Firecrawl:
//   "Non-concessional contributions cap" (last updated 7 May 2026): from
//     1 July 2026 a TSB "less than $1.84 million" allows $390,000 over 3
//     years; "$1.84 million or above but less than $1.97 million" allows
//     $260,000 over 2 years; "$1.97 million or above" no bring-forward; nil
//     cap at or above the general transfer balance cap ($2.1 million from
//     2026-27). "These limits are based on the non-concessional contributions
//     cap being $130,000 ... and the general transfer balance cap being $2.1
//     million" — i.e. TBC − 2 × cap and TBC − cap, which is how they are
//     derived below.
//   "Key superannuation rates and thresholds – contributions caps" (last
//     updated 11 September 2026): "1 July 2025 to 30 June 2026, the general
//     transfer balance cap was $2 million".
//   "Key superannuation rates and thresholds – payments from super" (last
//     updated 16 September 2026): "From 1 July 2026, the low rate cap is
//     $260,000." "Before 1 July 2026, the low rate cap amount was indexed
//     each year" — its table shows 2025-26 also $260,000 (2024-25 $245,000),
//     so the cap did not move this year.
//   "Division 296 tax on large super balances" (last updated 29 June 2026):
//     from 1 July 2026, 15% on taxable super earnings above the large super
//     balance threshold, an additional 10% above the very large threshold;
//     "For the 2026–27 income year, the LSBT is $3 million and the VLSBT is
//     $10 million"; 2026-27 assessments issue in the later half of 2027-28.

/** General transfer balance cap for the previous income year (2025-26). */
export const TRANSFER_BALANCE_CAP_PREVIOUS = 2_000_000;

/** Tax-free taxable-component limit for lump sums between preservation age and 59. */
export const LOW_RATE_CAP = { amount: 260_000, incomeYear: "2026-27", previousAmount: 260_000 } as const;

export const DIVISION_296 = {
  start: "1 July 2026",
  largeBalanceThreshold: 3_000_000,
  veryLargeBalanceThreshold: 10_000_000,
  rate: 0.15,
  additionalRate: 0.10,
  incomeYear: "2026-27",
} as const;

/**
 * Total-super-balance limits for the non-concessional bring-forward in the
 * current year, derived from the cap and the general transfer balance cap.
 */
export function bringForwardThresholds(): { threeYear: number; twoYear: number; nilCap: number } {
  const tbc = SUPER_GUARANTEE.transferBalanceCap;
  const ncc = SUPER_GUARANTEE.nonConcessionalCap;
  return { threeYear: tbc - 2 * ncc, twoYear: tbc - ncc, nilCap: tbc };
}
