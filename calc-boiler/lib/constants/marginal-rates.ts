// =============================================================================
// Marginal tax rates — what the NEXT dollar of income really costs, and what a
// raise or bonus actually adds to take-home pay (/marginal-tax-rates/).
//
// This file defines NO rate of its own. Everything is composed from the single
// sources of truth in australian-tax.ts:
//   TAX_BRACKETS_2026_27   ATO "Tax rates – Australian resident", last updated
//                          13 August 2026: 15c over $18,200; $4,020 + 30c over
//                          $45,000; $31,020 + 37c over $135,000; $51,370 + 45c
//                          over $190,000. Excludes the Medicare levy.
//   LITO                   ATO QC105020: $700 to $37,500; minus 5c per $1 to
//                          $45,000; then $325 minus 1.5c per $1 to $66,667.
//   MEDICARE_LEVY          2% levy, with the low-income shade-in at 10c per $1
//                          (the 2025-26 thresholds, the latest the ATO has
//                          published — see australian-tax.ts).
//   HECS_HELP              the marginal repayment system from 1 July 2025.
//
// How this differs from tax-rates-reference.ts analyseIncome(): that answers
// "what is the rate at this one income" for the /tax-brackets/ table. This file
// answers the raise question: given a salary and a raise, what share does the
// tax system take of the raise itself, and which bands of the scale are the
// expensive ones.
// =============================================================================

import {
  LITO,
  MEDICARE_LEVY,
  TAX_BRACKETS_2026_27,
  TAX_FREE_THRESHOLD,
  calculateIncomeTax,
  calculateLITO,
  calculatePayBreakdown,
} from "./australian-tax";

export const MARGINAL_RATES_VERIFIED_ON = "23 September 2026";

export const MARGINAL_RATES_SOURCES = {
  atoResidentRates: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents",
  atoLitoPage: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/offsets-and-rebates/low-income-tax-offset",
  atoMedicareLevy: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy/medicare-levy-reduction-for-low-income-earners",
  atoWithholding: "https://www.ato.gov.au/tax-rates-and-codes/payg-withholding-schedule-1-statement-of-formulas-for-calculating-amounts-to-be-withheld",
} as const;

/** Tax and Medicare levy on an income (resident, single, no HELP, no surcharge). Unrounded so slopes are exact. */
function taxAndLevy(income: number): number {
  const x = Math.max(0, income);
  const incomeTax = Math.max(0, calculateIncomeTax(x) - calculateLITO(x));
  const shaded = Math.max(0, (x - MEDICARE_LEVY.lowIncomeThreshold) * MEDICARE_LEVY.shadeInRate);
  const levy = x <= MEDICARE_LEVY.lowIncomeThreshold ? 0 : Math.min(x * MEDICARE_LEVY.rate, shaded);
  return incomeTax + levy;
}

/** The rate on the dollar after `income`: tax plus levy on $1 more than `income`. */
export function marginalRateAt(income: number): number {
  return Math.round((taxAndLevy(income + 1) - taxAndLevy(income)) * 1000) / 1000;
}

export interface MarginalBand {
  /** Taxable income above this (exclusive) ... */
  from: number;
  /** ... up to and including this. Infinity for the top band. */
  to: number;
  /** Scale rate (0, 15, 30, 37, 45) in force across the band. */
  scaleRate: number;
  /** All-in rate on the next dollar: scale + levy + LITO withdrawal. */
  effectiveRate: number;
  /** What explains any gap between the scale rate and the all-in rate. */
  why: string;
}

/**
 * Every band where the all-in marginal rate is constant, built from the
 * breakpoints in the constants. Ten bands from nil to 47%, so the bands
 * that differ from the headline scale are visible: the LITO-absorbed band near
 * $18,200, the Medicare shade-in, and the LITO phase-outs.
 */
export function marginalBands(): MarginalBand[] {
  const brackets = TAX_BRACKETS_2026_27;
  const points = [
    TAX_FREE_THRESHOLD,
    LITO.effectiveTaxFreeThreshold,
    MEDICARE_LEVY.lowIncomeThreshold,
    MEDICARE_LEVY.shadeInThreshold,
    LITO.fullOffsetCeiling,
    brackets[2].min - 1,
    LITO.nilOffsetIncome,
    brackets[3].min - 1,
    brackets[4].min - 1,
  ].sort((a, b) => a - b);

  const edges = [0, ...points, Infinity];
  const out: MarginalBand[] = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const from = edges[i];
    const to = edges[i + 1];
    const effectiveRate = marginalRateAt(from + 1);
    const scale = [...brackets].reverse().find((b) => from + 1 >= b.min)?.rate ?? 0;
    out.push({ from, to, scaleRate: scale, effectiveRate, why: bandReason(from, scale, effectiveRate) });
  }
  return out;
}

function bandReason(from: number, scale: number, effective: number): string {
  if (effective === 0) {
    return from === 0
      ? "Tax-free threshold: nothing is payable on the first $18,200"
      : "The 15c scale rate is cancelled by the $700 low income tax offset, so the tax stays at nil";
  }
  if (from >= MEDICARE_LEVY.lowIncomeThreshold && from < MEDICARE_LEVY.shadeInThreshold) {
    return "Medicare levy phases in at 10c per $1 instead of 2c, on top of the scale rate";
  }
  if (from >= LITO.fullOffsetCeiling && from < LITO.phaseOut1.end) {
    return "Scale rate + 2c Medicare + 5c as the low income tax offset is withdrawn";
  }
  if (from >= LITO.phaseOut1.end && from < LITO.nilOffsetIncome) {
    return "Scale rate + 2c Medicare + 1.5c as the low income tax offset is withdrawn";
  }
  if (Math.abs(effective - scale - MEDICARE_LEVY.rate) < 0.0006) return "Scale rate + 2c Medicare levy";
  if (Math.abs(effective - scale) < 0.0006) return `Scale rate only: the Medicare levy does not start until $${MEDICARE_LEVY.lowIncomeThreshold.toLocaleString("en-AU")}`;
  return "Scale rate plus levy";
}

export interface RaiseInput {
  /** Current taxable salary. */
  salary: number;
  /** Extra taxable income: a permanent raise, a bonus, overtime. */
  raise: number;
  /** Include the compulsory HELP repayment on both incomes. */
  hasHelpDebt?: boolean;
  /** No private hospital cover: adds the Medicare levy surcharge. */
  noPrivateHealth?: boolean;
}

export interface RaiseResult {
  salary: number;
  raise: number;
  newSalary: number;
  /** Tax + Medicare + HELP on the salary alone. */
  taxBefore: number;
  taxAfter: number;
  /** taxAfter - taxBefore: the cost of the raise. */
  extraTax: number;
  /** raise - extraTax: what lands in your pocket. */
  netGain: number;
  /** Share of the raise taken: extraTax / raise. The marginal rate on THIS raise. */
  marginalRateOnRaise: number;
  /** Total tax / income before and after: the average (effective) rates. */
  averageBefore: number;
  averageAfter: number;
  /** Scale rate of the bracket the new salary finishes in. */
  scaleRateAfter: number;
  /** Net gain per pay, for the common cycles. */
  perFortnight: number;
  perWeek: number;
  /** The raise is below the point where tax even starts. */
  raiseIsTaxFree: boolean;
}

function totalDeductions(income: number, hasHelpDebt: boolean, noPrivateHealth: boolean): number {
  return calculatePayBreakdown({
    grossSalary: income,
    includeHECS: hasHelpDebt,
    hasPrivateHealth: !noPrivateHealth,
  }).totalDeductions;
}

/**
 * Tax on a raise, the difference between the full engine run at the old and
 * the new income, so the bracket-crossing, LITO withdrawal, Medicare shade-in,
 * surcharge cliffs and HELP all land where they really fall. The rows always
 * add up: netGain + extraTax = raise.
 */
export function raiseOutcome(input: RaiseInput): RaiseResult {
  const salary = Math.max(0, Math.round(Number.isFinite(input.salary) ? input.salary : 0));
  const raise = Math.max(0, Math.round(Number.isFinite(input.raise) ? input.raise : 0));
  const help = !!input.hasHelpDebt;
  const noPhi = !!input.noPrivateHealth;
  const newSalary = salary + raise;
  const taxBefore = totalDeductions(salary, help, noPhi);
  const taxAfter = totalDeductions(newSalary, help, noPhi);
  const extraTax = taxAfter - taxBefore;
  const netGain = raise - extraTax;
  const scaleRateAfter = [...TAX_BRACKETS_2026_27].reverse().find((b) => newSalary >= b.min)?.rate ?? 0;
  return {
    salary,
    raise,
    newSalary,
    taxBefore,
    taxAfter,
    extraTax,
    netGain,
    marginalRateOnRaise: raise > 0 ? extraTax / raise : 0,
    averageBefore: salary > 0 ? taxBefore / salary : 0,
    averageAfter: newSalary > 0 ? taxAfter / newSalary : 0,
    scaleRateAfter,
    perFortnight: Math.round((netGain / 26) * 100) / 100,
    perWeek: Math.round((netGain / 52) * 100) / 100,
    raiseIsTaxFree: raise > 0 && extraTax === 0,
  };
}
