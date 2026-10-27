// Shared FAQ copy for /contractor-pay-calculator/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in app/contractor-pay-calculator/
// page.tsx, so the structured data cannot drift from the page. Figures come
// from the tax engine and lib/constants.

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
  TAX_BRACKETS,
} from "@/lib/constants";
import { contractorRateToEquivalentSalary } from "@/lib/constants/contractor-rate";
import { GST_REGISTRATION_THRESHOLD } from "@/lib/constants/gig-tax";
import type { FaqItem } from "@/lib/faq";
import { bracketRateList } from "@/modules/calculator/fy-rate-copy";

const FY = SITE_CONFIG.financialYear;
const SG = formatPercent(SUPER_GUARANTEE.rate, 0);
const ML = formatPercent(MEDICARE_LEVY.rate, 0);
/** No-ABN withholding: top marginal rate plus Medicare levy. */
const NO_ABN_RATE = formatPercent(TAX_BRACKETS[TAX_BRACKETS.length - 1].rate + MEDICARE_LEVY.rate, 0);
/** ATO GST registration threshold (GST turnover), rendered from lib/constants/gig-tax. */
const GST_T = formatAUD(GST_REGISTRATION_THRESHOLD);
/** Billable weeks assumed across the page (52 less 4 weeks' unpaid leave). */
export const BILLABLE_WEEKS = 48;

/** Income tax (after LITO) plus Medicare levy on a full year's income. */
export const annualTaxAndMedicare = (income: number) =>
  Math.max(0, Math.round(calculateIncomeTax(income, true) - calculateLITO(income))) + calculateMedicareLevy(income);
/** $1,000 a day, 5 days a week, BILLABLE_WEEKS (48) working weeks. */
export const DAY_RATE_GROSS = 1_000 * 5 * BILLABLE_WEEKS;
export const DAY_RATE_NET = DAY_RATE_GROSS - annualTaxAndMedicare(DAY_RATE_GROSS);

// People Also Ask (Google AU, Sept 2026) for "contractor pay calculator" and
// "contractor rate calculator australia": docs/seo/2026-09-24-paa-optimisation.md.
// The 80% rule wording was checked on 24 Sep 2026 against the ATO's "Working
// out if the PSI rules apply": "To self-assess as a PSB, you must either meet
// the results test, or meet another PSB test and pass the 80% rule."
const H = EMPLOYMENT.standardWeeklyHours;
const TARGET_SALARY = 100_000;
const FLOOR_RATE = (TARGET_SALARY * (1 + SUPER_GUARANTEE.rate)) / (H * BILLABLE_WEEKS);
const EMPLOYEE_HOURLY = TARGET_SALARY / EMPLOYMENT.hoursPerYear;

/** PAA answer reused as the lead of the "What Rate Should I Charge?" section. */
export const CONTRACTOR_RATE_ANSWER: FaqItem = {
  q: "What rate should I charge as a contractor?",
  a: `To replace a ${formatAUD(TARGET_SALARY)} salary plus ${SG} super over ${BILLABLE_WEEKS} billable weeks of ${H} hours, you need to charge at least ${formatAUD(FLOOR_RATE, 2)} an hour, against ${formatAUD(EMPLOYEE_HOURLY, 2)} an hour as an employee. That hourly rate is the floor, worked out from the salary you want to replace. Charge above that floor to cover time you can't bill, your insurance and sick days, which are unpaid for a contractor.`,
};

/** Worked example for "How do I convert a contractor rate to a salary?". */
export const SALARY_EXAMPLE_RATE = 100;
export const SALARY_EXAMPLE = contractorRateToEquivalentSalary(SALARY_EXAMPLE_RATE, "hour");
const SG_DIVISOR = (1 + SUPER_GUARANTEE.rate).toFixed(2);

/** PAA answer reused as the lead of the "What Contractor Hourly Rate Equals a Salary?" section. */
export const CONTRACTOR_SALARY_ANSWER: FaqItem = {
  q: "How do I convert a contractor rate to a salary?",
  a: `Multiply the rate by the hours you can actually bill, take off the costs an employer would pay, then divide by ${SG_DIVISOR} for super. At ${formatAUD(SALARY_EXAMPLE_RATE)} an hour, ${SALARY_EXAMPLE.billableDays} billable days (${SALARY_EXAMPLE.billableHours.toLocaleString("en-AU")} hours) earn ${formatAUD(SALARY_EXAMPLE.billedIncome)}. Less ${formatAUD(SALARY_EXAMPLE.insurance + SALARY_EXAMPLE.admin)} insurance and admin, that equals a ${formatAUD(SALARY_EXAMPLE.equivalentSalary)} salary plus ${SG} super.`,
};

export const CONTRACTOR_PAY_FAQS: readonly FaqItem[] = [
  {
    q: "How much do I take home as a contractor in Australia?",
    a: `A contractor charging $1,000 per day grosses ${formatAUD(DAY_RATE_GROSS)} over ${BILLABLE_WEEKS} working weeks and takes home roughly ${formatAUD(Math.round(DAY_RATE_NET / 1_000) * 1_000)} after income tax and the ${ML} Medicare levy (FY${FY}). Take-home varies with hourly or daily rate, hours worked, GST treatment, and whether you set aside the ${SG} Super Guarantee for yourself. ABN contractors need to charge more than an equivalent PAYG hourly rate to cover lost leave, super, and insurance.`,
  },
  CONTRACTOR_RATE_ANSWER,
  CONTRACTOR_SALARY_ANSWER,
  {
    q: "What is the 80% rule for contractors?",
    a: "The rule is part of the ATO's personal services income (PSI) rules. If 80% or more of your PSI in a year comes from one client and its associates, you can only self-assess as a personal services business by passing the results test. If you fail it and have no personal services business determination from the ATO, the PSI rules apply, which limit the deductions you can claim and stop you splitting that income with others.",
  },
  {
    q: "What is a contractor for tax purposes?",
    a: "A contractor (also called an independent contractor or ABN worker) operates their own business and invoices clients for work performed. Unlike employees, contractors handle their own tax, super, and insurance. The ATO uses a multi-factor test to determine if someone is genuinely a contractor. See our contractor vs employee guide.",
    links: { "contractor vs employee guide": "/contractor-vs-employee-calculator/" },
  },
  {
    q: "What's the difference between ABN and PAYG income tax?",
    a: `ABN contractors and PAYG employees pay the same marginal income tax brackets (${bracketRateList()}) plus the ${ML} Medicare levy in FY${FY}. The difference is in how it's collected: PAYG employees have tax withheld every pay cycle by their employer, while ABN contractors invoice gross and pay tax through quarterly PAYG instalments or at year-end. Contractors also handle GST (10%) once GST turnover reaches ${GST_T}.`,
  },
  {
    q: "Do I need to charge GST as a contractor?",
    a: `If your GST turnover (gross business income less GST) is ${GST_T} or more a year, you must register for GST within 21 days and charge 10% on your invoices. Taxi, limousine and ride-sourcing drivers must register whatever their turnover, and so must anyone who wants to claim fuel tax credits. The GST you collect is remitted to the ATO, usually quarterly on your BAS. It's not your income. Below ${GST_T}, registration is optional unless another ATO registration rule applies to you.`,
  },
  {
    q: "Do contractors need to pay super?",
    a: `If you're an independent contractor working under your own ABN, paying super for yourself is optional. If a business pays you mainly for your labour (more than half the contract's value is for your labour, you're paid for your own skills rather than to achieve a result, and you must do the work yourself), you count as its employee for super guarantee purposes, even with an ABN. The business must then pay the ${SG} super guarantee for you, on top of your pay. This does not apply if the contract is with your company, trust or partnership. Tick "Includes Superannuation" in the calculator if your rate already includes super, or leave it unticked to see the super you would set aside yourself.`,
  },
  {
    q: "How do I calculate my contractor hourly rate?",
    a: `Your contractor rate should cover the benefits you lose compared to employment: super (${SG}), annual leave (4 weeks), sick leave, public holidays, insurance, and admin time. To find your floor rate, add ${SG} super to the salary you want to replace, then divide by the hours you can bill in a year (${H} hours a week over ${BILLABLE_WEEKS} weeks is ${(H * BILLABLE_WEEKS).toLocaleString("en-AU")} hours). Charge above that floor to cover your insurance and admin costs.`,
  },
  {
    q: "Can contractors claim business deductions?",
    a: "Yes. Contractors can deduct legitimate business expenses from their assessable income, including equipment, home office, vehicle, phone, software, professional development, and insurance. This calculator estimates tax on your gross income; your actual tax may be lower after claiming deductions on your tax return.",
  },
  {
    q: "How do PAYG instalments work for contractors?",
    a: `The ATO calculates your quarterly PAYG instalment amount based on your most recent tax return. Instalments are due on 28 October, 28 February, 28 April, and 28 July. You can choose the instalment amount method (ATO-calculated) or the instalment rate method (percentage of income). Paying a PAYG instalment late attracts the general interest charge: ${formatPercent(GENERAL_INTEREST_CHARGE.annualRate, 2)} a year for ${GENERAL_INTEREST_CHARGE.quarter}, reset every quarter.`,
  },
  {
    q: "Do I need both an ABN and a TFN as a contractor?",
    a: `Yes. Your Tax File Number (TFN) is used for your personal income tax return. Your Australian Business Number (ABN) is required on every invoice you issue. Clients who pay contractors without a valid ABN on the invoice must withhold ${NO_ABN_RATE} of the payment and remit it to the ATO.`,
  },
  {
    q: "What insurance do contractors need in Australia?",
    a: "Workers' compensation does not cover you as a sole trader, so income protection insurance is how you cover part of your income if sickness or an accident stops you working. Public liability insurance covers you if someone is injured or their property is damaged because of your negligence; some states and territories require it for certain occupations. Professional indemnity insurance covers claims that your advice or services caused a client a loss, and it is mandatory for some professions. If you employ staff, workers' compensation insurance is compulsory in every state and territory.",
  },
];
