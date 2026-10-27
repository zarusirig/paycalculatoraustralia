// =============================================================================
// Tax return estimator — one entry point for BOTH income years the
// /tax-return-calculator/ offers.
// Run tests with: npm test
//
// WHY. The calculator used to run every estimate through calculatePayBreakdown
// (the sitewide FY2026-27 engine, second bracket 15%) while its UI said
// 2025-26. Returns lodged from July 2026 to May 2027 are for FY2025-26, when
// that bracket was 16%, so it overstated refunds by up to $268.
//
//  - "2025-26" delegates to estimateReturn2025_26 (tax-return-2025-26.ts),
//    which composes the existing 2025-26 constants. No figures are redefined.
//  - "2026-27" composes the sitewide engine's component functions
//    (calculateIncomeTax, calculateLITO, calculateMedicareLevy,
//    calculateMedicareSurcharge, calculateHECS). Its Medicare levy low-income
//    thresholds are still the 2025-26 figures because the ATO has not
//    published 2026-27 ones — see the comment on MEDICARE_LEVY. The UI says so.
//
// This file defines no rates, thresholds or dates of its own.
// =============================================================================

import {
  HECS_HELP,
  HECS_HELP_2025_26,
  MEDICARE_LEVY,
  TAX_BRACKETS_2025_26,
  TAX_BRACKETS_2026_27,
  calculateHECS,
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareLevy,
  calculateMedicareSurcharge,
  type TaxBracket,
} from "./australian-tax";
import {
  MLS_2025_26_SINGLE,
  RETURN_2026,
  estimateReturn2025_26,
  type Return2026Inputs,
  type Return2026Result,
} from "./tax-return-2025-26";

export type ReturnIncomeYear = "2025-26" | "2026-27";

export type ReturnInputs = Return2026Inputs;

export interface ReturnEstimate extends Return2026Result {
  /** Top marginal income-tax rate reached, plus the 2% Medicare levy. */
  marginalRate: number;
}

export interface ReturnYearConfig {
  incomeYear: ReturnIncomeYear;
  /** "2026" — the calendar year the return is lodged in (ATO naming). */
  returnName: string;
  incomeYearStart: string;
  incomeYearEnd: string;
  /** When this return can first be lodged. */
  lodgeFrom: string;
  selfLodgeDueDate: string;
  brackets: readonly TaxBracket[];
  secondBracketRate: number;
  studyLoanThreshold: number;
  mlsSinglesThreshold: number;
  /** Plain-English note on what this option is for. */
  purpose: string;
}

export const RETURN_YEARS: Readonly<Record<ReturnIncomeYear, ReturnYearConfig>> = {
  "2025-26": {
    incomeYear: RETURN_2026.incomeYear,
    returnName: "2026",
    incomeYearStart: RETURN_2026.incomeYearStart,
    incomeYearEnd: RETURN_2026.incomeYearEnd,
    lodgeFrom: "1 July 2026",
    selfLodgeDueDate: RETURN_2026.selfLodgeDueDate,
    brackets: TAX_BRACKETS_2025_26,
    secondBracketRate: TAX_BRACKETS_2025_26[1].rate,
    studyLoanThreshold: HECS_HELP_2025_26.minimumThreshold,
    mlsSinglesThreshold: MLS_2025_26_SINGLE[0].min - 1,
    purpose: `The return you lodge now (due ${RETURN_2026.selfLodgeDueDate}, or ${RETURN_2026.agentDueDateMostPeople} for most tax agent clients)`,
  },
  "2026-27": {
    incomeYear: "2026-27",
    returnName: "2027",
    incomeYearStart: "1 July 2026",
    incomeYearEnd: "30 June 2027",
    lodgeFrom: "1 July 2027",
    selfLodgeDueDate: "31 October 2027",
    brackets: TAX_BRACKETS_2026_27,
    secondBracketRate: TAX_BRACKETS_2026_27[1].rate,
    studyLoanThreshold: HECS_HELP.minimumThreshold,
    mlsSinglesThreshold: MEDICARE_LEVY.surcharge.tier1.min - 1,
    purpose: "Planning next year's return, on the income you are earning now",
  },
};

/** The year people are lodging right now. The calculator defaults to it. */
export const DEFAULT_RETURN_YEAR: ReturnIncomeYear = "2025-26";

function marginalRate(brackets: readonly TaxBracket[], taxableIncome: number): number {
  let rate = 0;
  for (const b of brackets) if (taxableIncome >= b.min) rate = b.rate;
  return Math.round((rate + MEDICARE_LEVY.rate) * 10_000) / 10_000;
}

function estimate2026_27(i: ReturnInputs): Return2026Result {
  const taxableIncome = Math.max(0, Math.round(i.grossIncome - i.deductions));
  const gross = calculateIncomeTax(taxableIncome);
  const lito = Math.min(gross, calculateLITO(taxableIncome));
  const incomeTax = gross - lito;
  const medicareLevy = calculateMedicareLevy(taxableIncome);
  const mls = calculateMedicareSurcharge(taxableIncome, i.hasPrivateHospitalCover);
  const helpRepayment = i.hasStudyLoan ? calculateHECS(taxableIncome) : 0;
  const totalLiability = Math.round(incomeTax + medicareLevy + mls + helpRepayment);
  return {
    taxableIncome,
    incomeTax: Math.round(gross),
    lito: Math.round(lito),
    medicareLevy: Math.round(medicareLevy),
    mls: Math.round(mls),
    helpRepayment: Math.round(helpRepayment),
    totalLiability,
    refund: Math.round(i.taxWithheld) - totalLiability,
    averageRate: taxableIncome > 0 ? totalLiability / taxableIncome : 0,
  };
}

/** Whole-dollar estimate for a single Australian resident, full year, no dependants. */
export function estimateReturn(year: ReturnIncomeYear, i: ReturnInputs): ReturnEstimate {
  const r = year === "2025-26" ? estimateReturn2025_26(i) : estimate2026_27(i);
  return { ...r, marginalRate: marginalRate(RETURN_YEARS[year].brackets, r.taxableIncome) };
}
