// Shared FAQ copy for /contractor-pay-calculator/.
//
// Read by BOTH the rendered accordion (plus its sr-only crawlable mirror) in
// modules/calculator/contractor-pay-calculator.tsx and the FAQPage JSON-LD in
// app/contractor-pay-calculator/page.tsx. Before this file the two held
// overlapping but different question sets; this is their union plus People
// Also Ask questions from the live Google AU SERP for "contractor pay
// calculator" and "contractor rate calculator australia"
// (docs/seo/2026-09-24-paa-optimisation.md).
//
// The 80% rule wording was checked on 24 Sep 2026 against the ATO's "Working
// out if the PSI rules apply": "To self-assess as a PSB, you must either meet
// the results test, or meet another PSB test and pass the 80% rule."

import {
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareLevy,
  EMPLOYMENT,
  formatAUD,
  formatPercent,
  GENERAL_INTEREST_CHARGE,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SUPER_GUARANTEE,
} from "@/lib/constants";
import { bracketRateList } from "@/modules/calculator/fy-rate-copy";

export interface ContractorFaq {
  q: string;
  a: string;
}

const FY = SITE_CONFIG.financialYear;
const SG = formatPercent(SUPER_GUARANTEE.rate, 0);
const MEDICARE = formatPercent(MEDICARE_LEVY.rate, 0);
const H = EMPLOYMENT.standardWeeklyHours;

export const annualTaxAndMedicare = (income: number) =>
  Math.max(0, Math.round(calculateIncomeTax(income, true) - calculateLITO(income))) + calculateMedicareLevy(income);

/** Billable weeks assumed across the page (52 less 4 weeks' unpaid leave). */
export const BILLABLE_WEEKS = 48;
const DAY_GROSS = 1_000 * 5 * BILLABLE_WEEKS;
const DAY_NET = DAY_GROSS - annualTaxAndMedicare(DAY_GROSS);

// Floor rate to replace a $100,000 salary: salary + SG over the billable hours.
const TARGET_SALARY = 100_000;
const BILLABLE_HOURS = H * BILLABLE_WEEKS;
const FLOOR_RATE = (TARGET_SALARY * (1 + SUPER_GUARANTEE.rate)) / BILLABLE_HOURS;
const EMPLOYEE_HOURLY = TARGET_SALARY / EMPLOYMENT.hoursPerYear;

export const CONTRACTOR_FAQS: readonly ContractorFaq[] = [
  {
    q: "How much do I take home as a contractor in Australia?",
    a: `A contractor charging $1,000 a day grosses ${formatAUD(DAY_GROSS)} over ${BILLABLE_WEEKS} working weeks and takes home roughly ${formatAUD(Math.round(DAY_NET / 1_000) * 1_000)} after income tax and the ${MEDICARE} Medicare levy (${FY}). Take-home varies with your rate, hours, GST treatment, deductions and whether you set aside the ${SG} super you would get as an employee.`,
  },
  {
    q: "What rate should I charge as a contractor?",
    a: `Start from the salary you want to replace. To match ${formatAUD(TARGET_SALARY)} plus ${SG} super over ${BILLABLE_WEEKS} billable weeks of ${H} hours, you need at least ${formatAUD(FLOOR_RATE, 2)} an hour, against ${formatAUD(EMPLOYEE_HOURLY, 2)} an hour as an employee. That is the floor: unbilled time, insurance and sick days are why many contractors charge 1.4 to 1.6 times the employee rate.`,
  },
  {
    q: "What is the 80% rule for contractors?",
    a: "It is part of the ATO's personal services income (PSI) rules. If 80% or more of your PSI in a year comes from one client and its associates, you can only self-assess as a personal services business by passing the results test. If you fail it and have no personal services business determination from the ATO, the PSI rules apply, which limit the deductions you can claim and stop you splitting that income with others.",
  },
  {
    q: "How do I calculate my contractor hourly rate?",
    a: `Your contractor rate should cover the benefits you lose compared to employment: super (${SG}), annual leave (4 weeks), sick leave, public holidays, insurance and admin time. A common rule of thumb is to multiply an equivalent employee hourly rate by 1.4 to 1.6.`,
  },
  {
    q: "What is a contractor for tax purposes?",
    a: "A contractor (independent contractor or ABN worker) runs their own business and invoices clients for work. Unlike employees, contractors handle their own tax, super and insurance. Whether someone is genuinely a contractor depends on the whole working relationship, not just holding an ABN.",
  },
  {
    q: "What's the difference between ABN and PAYG income tax?",
    a: `ABN contractors and PAYG employees pay the same marginal income tax rates (${bracketRateList()}) plus the ${MEDICARE} Medicare levy in ${FY}. The difference is collection: employees have tax withheld every pay, while ABN contractors invoice gross and pay through quarterly PAYG instalments or at year-end. Contractors also handle GST once turnover reaches $75,000.`,
  },
  {
    q: "Do I need to charge GST as a contractor?",
    a: "If your business turnover is $75,000 a year or more, you must register for GST and add 10% to your invoices. The GST you collect is paid to the ATO, usually quarterly, and is not your income. Below $75,000, GST registration is optional.",
  },
  {
    q: "Do contractors need to pay super?",
    a: `If you're an independent contractor working under your own ABN, super is optional but recommended. However, if a business hires you mainly for your labour rather than to achieve a result, it may have to pay ${SG} super on your behalf. Use the "Includes Super" toggle to model either case.`,
  },
  {
    q: "Can contractors claim business deductions?",
    a: "Yes. Contractors can deduct legitimate business expenses such as equipment, home office, vehicle, phone, software, professional development and insurance. This calculator estimates tax on gross income, so your actual tax may be lower after deductions. If the PSI rules apply to you, some deductions are limited.",
  },
  {
    q: "How do PAYG instalments work for contractors?",
    a: `The ATO works out your quarterly PAYG instalment from your most recent tax return. Instalments are due on 28 October, 28 February, 28 April and 28 July. You can pay the ATO-calculated amount or use the instalment rate method. Late instalments attract the general interest charge, ${formatPercent(GENERAL_INTEREST_CHARGE.annualRate, 2)} a year for ${GENERAL_INTEREST_CHARGE.quarter}, reset every quarter.`,
  },
  {
    q: "Do I need both an ABN and a TFN as a contractor?",
    a: "Yes. Your tax file number (TFN) is used for your personal income tax return, and your Australian Business Number (ABN) goes on every invoice. A client who pays you without a valid ABN on the invoice must withhold 47% of the payment and send it to the ATO.",
  },
  {
    q: "What insurance do contractors need in Australia?",
    a: "Most contractors carry public liability insurance, professional indemnity insurance (often required for consultants, accountants and IT professionals) and income protection, which replaces part of your income if illness or injury stops you working. Workers' compensation can be compulsory if you employ others.",
  },
];
