// Shared FAQ copy for /tax-refund-guide/ — rendered by the page's accordion and
// turned into FAQPage JSON-LD in app/tax-refund-guide/page.tsx, so the
// structured data cannot drift from the page. Every figure comes from
// lib/constants (sources cited there).

import {
  GENERAL_INTEREST_CHARGE,
  HECS_HELP,
  HECS_HELP_2025_26,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_FREE_THRESHOLD,
  formatAUD,
  formatPercent,
} from "@/lib/constants";
import { MLS_2025_26_SINGLE, RETURN_2026 } from "@/lib/constants/tax-return-2025-26";
import { FTL_MAX_INDIVIDUAL, PENALTY_UNIT } from "@/lib/constants/tax-calendar-2026-27";
import { PHI_REBATE, formatMlsRate } from "@/lib/constants/medicare-levy-surcharge";
import type { FaqItem } from "@/lib/faq";

const RY = RETURN_2026.incomeYear;
const FY = SITE_CONFIG.financialYear;
const WFH_RATE = RETURN_2026.wfhFixedRateCents / 100;
const WFH_EXAMPLE_HOURS = 1_100;
const MLS_BASE_2025_26 = MLS_2025_26_SINGLE[0].min - 1;
const MLS_BASE_SINGLE = MEDICARE_LEVY.surcharge.tier1.min - 1;
const MLS_BASE_FAMILY = MEDICARE_LEVY.surcharge.familyTier1.min - 1;
const PHI_REBATE_NIL_ABOVE = MEDICARE_LEVY.surcharge.tier3.min - 1;
const [, helpB1, helpB2, helpB3] = HECS_HELP_2025_26.bands;

export const TAX_REFUND_FAQS: readonly FaqItem[] = [
  {
    q: "What is a tax refund?",
    a: "A tax refund is the amount the ATO returns to you when your employer withheld more PAYG tax during the year than your actual assessed tax liability. The refund represents over-withheld income, not a government payment.",
  },
  {
    q: "What is the average tax refund in Australia?",
    a: "There is no reliable single figure: averages reported early in tax time are snapshots that shift as more returns are processed. Your own refund depends mainly on your deductions, your marginal rate, and whether you worked part of the year. Our Tax Return Estimator gives a personal estimate.",
    links: { "Tax Return Estimator": "/tax-return-calculator/" },
  },
  {
    q: "What happens if I don't lodge a tax return?",
    a: `Individuals who earn above the ${formatAUD(TAX_FREE_THRESHOLD)} tax-free threshold are generally required to lodge. Failure to lodge can attract a penalty of ${formatAUD(PENALTY_UNIT.amount)} per ${PENALTY_UNIT.ftlDaysPerUnit}-day period (up to ${formatAUD(FTL_MAX_INDIVIDUAL)}). Even if you earned less than ${formatAUD(TAX_FREE_THRESHOLD)}, lodging is beneficial when tax was withheld — you receive a full refund of all PAYG tax paid.`,
  },
  {
    q: "What if I owe the ATO money?",
    a: `The ATO issues a Notice of Assessment showing the amount owed. Common causes include holding multiple jobs, earning investment income, or incorrectly claiming the tax-free threshold at more than one employer. Payment plans are available — the ATO charges interest at the General Interest Charge rate (${formatPercent(GENERAL_INTEREST_CHARGE.annualRate, 2)} per annum for ${GENERAL_INTEREST_CHARGE.quarter}) on overdue amounts.`,
  },
  {
    q: "How long does a tax refund take to arrive?",
    a: `The ATO says most returns lodged online through myTax process in ${RETURN_2026.onlineProcessingBusinessDays} business days and most refunds issue within ${RETURN_2026.onlineRefundTypical}. For paper returns, most refunds issue within ${RETURN_2026.paperRefundBusinessDays} business days. Returns selected for review take longer.`,
  },
  {
    q: "Can I claim deductions without receipts?",
    a: "The ATO requires records for all deduction claims. For work-related expenses under $300 in total, you are not required to provide written evidence, but you must be able to show how you calculated the amount. Laundry of eligible work clothing allows claims up to $150 without written records. All claims above these thresholds require receipts, invoices, or bank/credit card statements.",
  },
  {
    q: "How do I claim working from home expenses?",
    a: `For FY${RY}, the ATO's fixed rate method allows a deduction of ${RETURN_2026.wfhFixedRateCents} cents per hour worked from home. This rate covers electricity, phone, internet, stationery, and computer consumables. You must keep a record of hours worked from home — either a timesheet, roster, diary, or similar document for the entire income year. An employee who records ${WFH_EXAMPLE_HOURS.toLocaleString("en-AU")} hours worked from home in the year claims ${formatAUD(WFH_EXAMPLE_HOURS * WFH_RATE)}.`,
  },
  {
    q: "Do I owe tax if I have two jobs?",
    a: "Holding 2 or more jobs does not automatically create a tax debt, but it increases the risk. Claim the tax-free threshold at only one employer (usually the highest-paying job). Your second employer should withhold tax at the \"no tax-free threshold\" rate. If both employers apply the tax-free threshold, you accumulate under-withheld tax that results in a debt at lodgment.",
  },
  {
    q: "Can I amend a tax return after lodging?",
    a: "Yes. You can amend a tax return within 2 years of the original assessment date for individuals (4 years for more complex affairs). Amendments are lodged through myTax or your tax agent. The ATO reprocesses your return and issues an amended assessment.",
  },
  {
    q: "Does HECS-HELP affect my tax refund?",
    a: `HECS-HELP compulsory repayments reduce your tax refund. Repayments are calculated on your "HELP repayment income" — essentially your taxable income plus certain other amounts. For the FY${RY} return, repayments apply only once that income exceeds ${formatAUD(HECS_HELP_2025_26.minimumThreshold)}, and only on the income above it: ${formatPercent(helpB1.marginalRate, 0)} of the excess up to ${formatAUD(helpB1.max)}, then ${formatAUD(helpB2.base)} plus ${formatPercent(helpB2.marginalRate, 0)} above that, until ${formatPercent(helpB3.marginalRate, 0)} of total repayment income applies from ${formatAUD(helpB3.min)}. The threshold rises to ${formatAUD(HECS_HELP.minimumThreshold)} for FY${FY}. Your employer may already withhold HELP repayments from each pay, in which case the impact on your refund is already accounted for.`,
  },
  {
    q: "Does private health insurance affect my tax refund?",
    a: `Private hospital cover affects your tax in two ways. First, holding appropriate hospital cover exempts you from the "Medicare Levy Surcharge" (MLS) of ${formatMlsRate(MEDICARE_LEVY.surcharge.tier1.rate)}–${formatMlsRate(MEDICARE_LEVY.surcharge.tier3.rate)}. For FY${FY} it applies on income for MLS purposes above ${formatAUD(MLS_BASE_SINGLE)} (singles) or ${formatAUD(MLS_BASE_FAMILY)} (families); on the FY${RY} return you are lodging now, the singles threshold is ${formatAUD(MLS_BASE_2025_26)}. Second, the private health insurance rebate reduces your premium cost. You can receive the rebate as a reduction in premiums during the year or as a refundable tax offset at lodgment. The rebate is income-tested on the same tiers and falls to 0% in the top tier — above ${formatAUD(PHI_REBATE_NIL_ABOVE)} for singles in FY${FY} (rates for ${PHI_REBATE.period}). Check your own position with the Medicare levy surcharge calculator.`,
    links: { "Medicare levy surcharge calculator": "/medicare-levy-surcharge-calculator/" },
  },
  {
    q: "Can I get a tax deduction for superannuation contributions?",
    a: `Employees can claim a tax deduction for personal super contributions made from after-tax income by submitting a "Notice of Intent to Claim" to their super fund before lodging. The total of employer SG contributions (${formatPercent(SUPER_GUARANTEE.rate, 0)}), salary sacrifice, and personal deductible contributions counts toward the concessional contributions cap: ${formatAUD(SUPER_GUARANTEE.concessionalCapPrevious)} for FY${RY} and ${formatAUD(SUPER_GUARANTEE.concessionalCap)} from 1 July 2026 (see the concessional cap guide), plus any unused carry-forward amounts. Contributions above the cap are taxed at your marginal rate, less a 15% offset, instead of the concessional 15% rate.`,
    links: { "concessional cap guide": "/concessional-contributions-cap/" },
  },
];
