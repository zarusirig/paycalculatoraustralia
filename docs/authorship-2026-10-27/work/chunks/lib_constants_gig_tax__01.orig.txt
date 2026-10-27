// =============================================================================
// Sole-trader tax arithmetic for rideshare and delivery work, behind
// /rideshare-delivery-earnings-after-tax/ and the tax section of
// /delivery-driver-pay-rate/.
//
// This module makes NO claim about what anyone earns. Every input is the
// reader's own figure; the output is arithmetic on it.
//
// SOURCES (ato.gov.au, read 5 October 2026 via Firecrawl):
//   - "Ride-sourcing" (last updated 9 October 2025): ride-sourcing drivers "must
//     be registered for an ABN and GST from the day you start providing ride
//     sourcing services, regardless of how much you earn. The only exception is
//     if you're an employee." Report all income in your tax return; claim only
//     deductions related to transporting passengers; apportion expenses; issue a
//     tax invoice for fares over $82.50 if a passenger asks.
//   - "Registering for GST" (last updated 14 September 2026): register when GST
//     turnover is $75,000 or more; also "when you provide taxi or limousine
//     travel for passengers (including ride-sourcing) regardless of your GST
//     turnover". GST turnover is gross business income, not profit, less GST.
//   - "Providing services" (sharing economy, last updated 20 August 2025): for
//     delivering goods through a platform "what you earn is assessable income
//     and needs to be reported in your tax return", whether employee,
//     contractor or business.
//   - "Preparing for a potential tax bill" (20 August 2025): income from the
//     sharing economy may not have tax withheld, so you might end up with a tax
//     bill; prepayments and PAYG instalments are options.
// Rates: lib/constants/australian-tax.ts (FY2026-27 resident scale, LITO,
// Medicare levy). A sole trader pays no Super Guarantee on their own income.
// =============================================================================

import { calculatePayBreakdown } from "./australian-tax";

export const GIG_TAX_VERIFIED_ON = "5 October 2026";

export const GIG_TAX_SOURCES = {
  rideSourcing:
    "https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/sharing-economy-and-tax/ride-sourcing",
  registeringGst: "https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst",
  providingServices:
    "https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/sharing-economy-and-tax/providing-services",
  taxBill:
    "https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/sharing-economy-and-tax/preparing-for-a-potential-tax-bill",
  sharingEconomy: "https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/sharing-economy-and-tax",
} as const;

export const GST_REGISTRATION_THRESHOLD = 75_000;
export const RIDE_SOURCING_TAX_INVOICE_THRESHOLD = 82.5;

export type GigWorkType = "rideshare" | "delivery";

export interface GstStatus {
  /** Must the person be registered for GST? */
  mustRegister: boolean;
  /** Plain-English reason. */
  reason: string;
}

/**
 * Whether GST registration is compulsory. Rideshare: from the first dollar.
 * Delivery: only once GST turnover (gross business income less GST) reaches $75,000.
 * `turnover` is the reader's gross takings for the year, GST included.
 */
export function gstRegistrationStatus(workType: GigWorkType, grossTakings: number): GstStatus {
  if (workType === "rideshare") {
    return {
      mustRegister: true,
      reason: "Ride-sourcing drivers must be registered for GST from the first trip, whatever they earn (ATO).",
    };
  }
  const turnover = gstTurnover(grossTakings);
  if (turnover >= GST_REGISTRATION_THRESHOLD) {
    return {
      mustRegister: true,
      reason: `GST turnover is at or over the $${GST_REGISTRATION_THRESHOLD.toLocaleString("en-AU")} threshold, so registration is required (within 21 days of passing it).`,
    };
  }
  return {
    mustRegister: false,
    reason: `Under the $${GST_REGISTRATION_THRESHOLD.toLocaleString("en-AU")} GST threshold, so registration is optional for delivery work.`,
  };
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/** GST turnover for a GST-inclusive takings figure: takings less the GST in them. */
export function gstTurnover(grossTakingsInclGst: number): number {
  return r2((Math.max(0, grossTakingsInclGst) * 10) / 11);
}

export interface GigTaxInput {
  /** Gross payments for the year as paid to you (GST included if you charge GST). */
  grossPayments: number;
  /** Business expenses for the year. */
  expenses: number;
  /** Do the expenses include GST (most fuel, phone and servicing costs do)? Only matters if registered. */
  expensesIncludeGst: boolean;
  /** Registered for GST? */
  gstRegistered: boolean;
  /** Other taxable income in the year (wages etc.), dollars. */
  otherIncome?: number;
  /** Compulsory HELP/HECS repayment on the combined income. */
  hasHelpDebt?: boolean;
  /** Private hospital cover (avoids the Medicare levy surcharge). */
  hasPrivateHealth?: boolean;
}

export interface GigTaxResult {
  /** Business income that counts for income tax (GST taken out when registered). */
  assessableIncome: number;
  /** Deductible expenses (GST credits taken out when registered). */
  deductibleExpenses: number;
  netBusinessIncome: number;
  /** Extra income tax from the gig profit, over and above tax on other income alone. */
  extraIncomeTax: number;
  extraMedicare: number;
  extraHelp: number;
  gstCollected: number;
  gstCredits: number;
  gstPayable: number;
  /** Income tax + Medicare + HELP + GST payable: what to put aside. */
  setAside: number;
  /** Cash left after expenses and every tax above. */
  inPocketAfterTax: number;
  /** setAside as a share of gross payments. */
  setAsideShare: number;
  /** Combined taxable income (gig profit + other income). */
  totalTaxableIncome: number;
}

/**
 * Tax on the gig profit, worked as the difference between tax on (other income
 * + profit) and tax on other income alone, so a second income does not distort
 * the marginal result. Uses the FY2026-27 resident scale, LITO and Medicare levy.
 */
export function gigTax(input: GigTaxInput): GigTaxResult {
  const gross = Math.max(0, input.grossPayments);
  const exp = Math.max(0, input.expenses);
  const other = Math.max(0, input.otherIncome ?? 0);

  let assessableIncome = gross;
  let deductibleExpenses = exp;
  let gstCollected = 0;
  let gstCredits = 0;
  if (input.gstRegistered) {
    gstCollected = r2(gross / 11);
    assessableIncome = r2(gross - gstCollected);
    if (input.expensesIncludeGst) {
      gstCredits = r2(exp / 11);
      deductibleExpenses = r2(exp - gstCredits);
    }
  }
  const gstPayable = r2(gstCollected - gstCredits);
  const netBusinessIncome = r2(assessableIncome - deductibleExpenses);

  const combined = Math.max(0, other + netBusinessIncome);
  const calc = (income: number) =>
    calculatePayBreakdown({
      grossSalary: Math.round(income),
      includeHECS: input.hasHelpDebt ?? false,
      hasPrivateHealth: input.hasPrivateHealth ?? true,
    });
  const withGig = calc(combined);
  const without = calc(other);

  const extraIncomeTax = Math.max(0, withGig.netIncomeTax - without.netIncomeTax);
  const extraMedicare = Math.max(0, withGig.medicareLevy + withGig.medicareSurcharge - without.medicareLevy - without.medicareSurcharge);
  const extraHelp = Math.max(0, withGig.hecsRepayment - without.hecsRepayment);

  const setAside = r2(extraIncomeTax + extraMedicare + extraHelp + Math.max(0, gstPayable));
  const inPocketAfterTax = r2(gross - exp - gstPayable - extraIncomeTax - extraMedicare - extraHelp);

  return {
    assessableIncome,
    deductibleExpenses,
    netBusinessIncome,
    extraIncomeTax,
    extraMedicare,
    extraHelp,
    gstCollected,
    gstCredits,
    gstPayable,
    setAside,
    inPocketAfterTax,
    setAsideShare: gross > 0 ? setAside / gross : 0,
    totalTaxableIncome: combined,
  };
}
