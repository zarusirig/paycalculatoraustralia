// =============================================================================
// Low Income Superannuation Tax Offset (LISTO)
// Run tests with: npm test
//
// Sources, read 5 October 2026 via Firecrawl:
//  - ATO, "Low income super tax offset" (QC26138, last updated 2 Aug 2023; the
//    rules it states are the current ones until the 2027 boost): "If you earn
//    up to $37,000 a year, you may be eligible to receive a ... payment of up
//    to $500." "The LISTO is 15% of the concessional (before tax) super
//    contributions you or your employer pays into your super fund up to a
//    maximum of $500." Eligibility, all of: concessional contributions
//    (including super guarantee) paid to a complying fund; adjusted taxable
//    income of $37,000 or less; no temporary resident visa at any time in the
//    income year (New Zealand citizens are eligible); "you lodge a tax return
//    and 10% or more of your total income comes from business and/or
//    employment, or you don't lodge a tax return and 10% or more of your
//    total income comes from your employment". "The maximum payment you can
//    receive for a financial year is $500 and the minimum is $10 - but if
//    you're eligible for less than $10, we will round this up to $10." Your
//    fund needs your TFN. Paid by the ATO into your fund, based on your tax
//    return (or, if you do not lodge, on fund and other data).
//  - ATO, "Low Income Superannuation Tax Offset (LISTO)" new-legislation page
//    (QC105616, last updated 17 Mar 2026): "From 1 July 2027 the government is
//    boosting LISTO by increasing the income threshold and payment cap ... the
//    income threshold will increase from $37,000 to $45,000 ... The maximum
//    payment will also increase to $810 ... This measure is now law."
//    Treasury fact sheet (13 Oct 2025) says the same. Law: Treasury Laws
//    Amendment (Building a Stronger and Fairer Super System) Act 2026.
//
// What is NOT confirmed from an official page: whether the 15% rate and the $10
// minimum carry over unchanged into 2027-28 (the official wording changes only
// the threshold and the maximum). $810 is exactly 15% of 12% of $45,000, which
// is consistent with an unchanged 15% rate; the page says so as an assumption.
// =============================================================================

import { SUPER_GUARANTEE } from "./australian-tax";

export interface ListoRules {
  incomeYear: string;
  /** Adjusted taxable income must be at or below this. */
  incomeThreshold: number;
  maxPayment: number;
  minPayment: number;
  rate: number;
}

/** Current rules: $37,000 / $500. Unchanged for years before 2027-28. */
export const LISTO_CURRENT: ListoRules = {
  incomeYear: "2026-27",
  incomeThreshold: 37_000,
  maxPayment: 500,
  minPayment: 10,
  rate: 0.15,
};

/** The boosted rules from 1 July 2027. */
export const LISTO_2027_28: ListoRules = {
  incomeYear: "2027-28",
  incomeThreshold: 45_000,
  maxPayment: 810,
  minPayment: 10,
  rate: 0.15,
};

export const LISTO_SOURCES = {
  ato: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/how-to-save-more-in-your-super/government-super-contributions/low-income-super-tax-offset",
  atoBoost: "https://www.ato.gov.au/about-ato/new-legislation/in-detail/superannuation/low-income-superannuation-tax-offset-listo",
  treasury: "https://treasury.gov.au/publication/p2025-709385-listo",
  atoLegislation: "https://www.ato.gov.au/about-ato/new-legislation/latest-news-on-tax-law-and-policy",
} as const;

export interface ListoInput {
  /** Adjusted taxable income (for most employees: taxable income). */
  adjustedTaxableIncome: number;
  /** Concessional (before-tax) contributions for the year, including employer super guarantee. */
  concessionalContributions: number;
  /** Held a temporary resident visa at any time in the income year (NZ citizens do not count). */
  temporaryResident?: boolean;
  /** At least 10% of total income comes from employment or business. */
  tenPercentFromWork?: boolean;
}

export interface ListoResult {
  eligible: boolean;
  /** Plain-English reasons you are not eligible; empty when eligible. */
  reasons: string[];
  /** The offset before the cap and the $10 floor. */
  uncapped: number;
  payment: number;
  hitCap: boolean;
  usedMinimum: boolean;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function listoPayment(input: ListoInput, rules: ListoRules = LISTO_CURRENT): ListoResult {
  const income = Math.max(0, input.adjustedTaxableIncome || 0);
  const contributions = Math.max(0, input.concessionalContributions || 0);
  const reasons: string[] = [];
  if (income > rules.incomeThreshold) reasons.push(`Adjusted taxable income is above $${rules.incomeThreshold.toLocaleString("en-AU")}.`);
  if (input.temporaryResident) reasons.push("Held a temporary resident visa during the year (New Zealand citizens are not excluded).");
  if (input.tenPercentFromWork === false) reasons.push("Less than 10% of total income came from employment or business.");
  if (contributions <= 0) reasons.push("No concessional contributions were paid to a complying super fund.");
  const uncapped = round2(contributions * rules.rate);
  if (reasons.length > 0) return { eligible: false, reasons, uncapped, payment: 0, hitCap: false, usedMinimum: false };
  const hitCap = uncapped > rules.maxPayment;
  const usedMinimum = uncapped < rules.minPayment;
  const payment = hitCap ? rules.maxPayment : usedMinimum ? rules.minPayment : uncapped;
  return { eligible: true, reasons, uncapped, payment, hitCap, usedMinimum };
}

/** LISTO for an employee on `salary` whose only concessional contributions are 12% super guarantee. */
export function listoFromSalary(salary: number, rules: ListoRules = LISTO_CURRENT): number {
  return listoPayment(
    { adjustedTaxableIncome: salary, concessionalContributions: Math.max(0, salary) * SUPER_GUARANTEE.rate },
    rules,
  ).payment;
}

/** Lowest salary at which super guarantee alone earns the full maximum payment. */
export function salaryForFullListo(rules: ListoRules): number {
  return Math.ceil(Math.round((rules.maxPayment / (rules.rate * SUPER_GUARANTEE.rate)) * 1e6) / 1e6);
}
