// Shared FAQ copy for /tech-salary-guide-australia/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in
// app/tech-salary-guide-australia/page.tsx, so the structured data cannot drift
// from the page. CGT figures come from lib/constants/capital-gains-tax.ts; the
// contractor day rates are computed in ./tech-salary-guide-australia-data.ts.

import {
  CGT_DISCOUNT_RATES,
  CGT_MINIMUM_OWNERSHIP_MONTHS,
  CGT_REFORM_2027,
} from "@/lib/constants/capital-gains-tax";
import { EMPLOYMENT, SUPER_GUARANTEE, formatAUD } from "@/lib/constants/australian-tax";
import { DEFAULT_CONTRACTOR_ASSUMPTIONS } from "@/lib/constants/contractor-rate";
import { CYBER_SECURITY_ATO } from "@/lib/data/job-pay-rates/cyber-security";
import { PROJECT_MANAGER_ATO } from "@/lib/data/job-pay-rates/project-manager";
import { SOFTWARE_ENGINEER_ATO } from "@/lib/data/job-pay-rates/software-engineer";
import type { FaqItem } from "@/lib/faq";
import { DAY_RATE_EXAMPLES, DAY_RATE_EXAMPLES_DEFAULT_DAYS } from "./tech-salary-guide-australia-data";

// Role-level pay now lives on the /job-pay-rates/ spokes (Oct 2026), which
// carry ATO Taxation statistics 2023–24 figures. These answers summarise and
// link down; the numbers are read from the spokes' data so they cannot drift.
const SWE = SOFTWARE_ENGINEER_ATO.rows[0];
const CYBER_ANALYST = CYBER_SECURITY_ATO.rows.find((r) => r.code === "262116")!;
const CYBER_ARCHITECT = CYBER_SECURITY_ATO.rows.find((r) => r.code === "262117")!;
const ICT_PM = PROJECT_MANAGER_ATO.rows.find((r) => r.code === "135112")!;

const DISCOUNT = `${CGT_DISCOUNT_RATES.individual * 100}%`;
const SG = `${Math.round(SUPER_GUARANTEE.rate * 100)}%`;
const [R110, R150] = DAY_RATE_EXAMPLES;
const D150 = DAY_RATE_EXAMPLES_DEFAULT_DAYS[1];

/**
 * Base rate entity company tax rate. ATO "Tax rates 2025–26" (companies),
 * last updated 24 June 2026, read 10 October 2026: base rate entities 25%,
 * otherwise 30%. 2025–26 is the latest year the ATO has published.
 */
export const BASE_RATE_ENTITY_TAX = "25%";

export const TECH_SALARY_FAQS: readonly FaqItem[] = [
  {
    q: "How much do software developers earn in Australia?",
    a: `On 2023–24 tax returns, people who gave their occupation as software engineer had a median salary or wage income of ${formatAUD(SWE.medianSalary)} (ATO). The software engineer salary page compares developers, programmers and testers, and shows take-home pay on each figure.`,
    links: { "software engineer salary page": "/job-pay-rates/software-engineer/" },
  },
  {
    q: "Is it better to be a contractor or permanent employee in tech?",
    a: `Neither is better in itself. A contractor has to bill enough to fund what an employee gets on top of pay: the Super Guarantee (${SG}), paid leave and public holidays, and costs such as insurance and accounting. On our calculation, matching a ${formatAUD(R110.salary)} salary takes ${formatAUD(R110.dayRate)} a day, excluding GST, over ${R110.billableDays} billable days. The answer moves with your day rate, the days you actually bill, and whether you work as a sole trader or through a company. Use the Contractor vs Employee Calculator to compare the two at your own rate.`,
    links: { "Contractor vs Employee Calculator": "/contractor-vs-employee-calculator/" },
  },
  {
    q: "What day rate equals a $150K permanent salary?",
    a: `On our calculation, ${formatAUD(R150.dayRate)} a day, excluding GST, over ${R150.billableDays} billable days. That bills ${formatAUD(R150.billedIncomeNeeded)} a year: the ${formatAUD(R150.salary)} salary, ${formatAUD(R150.superGuarantee)} Super Guarantee at ${SG}, and ${formatAUD(R150.insurance + R150.admin)} for insurance and accounting. The ${EMPLOYMENT.annualLeaveWeeks} weeks' annual leave and ${DEFAULT_CONTRACTOR_ASSUMPTIONS.publicHolidayDays} public holidays an employee is paid for are days a contractor cannot bill, so they are already priced in. It assumes no sick days and no gap between contracts; at ${D150.billableDays} billable days, the default in our Contractor Pay Calculator, the rate is ${formatAUD(D150.dayRate)}. Leave loading, workers' compensation and income protection are not included. Use the Contractor vs Employee Calculator to compare take-home pay at your own rate.`,
    links: {
      "Contractor Pay Calculator": "/contractor-pay-calculator/",
      "Contractor vs Employee Calculator": "/contractor-vs-employee-calculator/",
    },
  },
  {
    q: "How do tech salaries vary by city in Australia?",
    a: "This guide does not give a city premium for tech pay. The ATO occupation figures it uses are national and do not separate city, regional or remote workers. For earnings by state and territory across all industries, from ABS data, see Average Salary Australia.",
    links: { "Average Salary Australia": "/average-salary-australia/" },
  },
  {
    q: "How are RSUs taxed in Australia?",
    a: `RSUs are rights to shares under an employee share scheme (ESS). The ATO taxes the discount on ESS interests, their market value less anything you paid for them, as assessable income at your marginal rate, and your employer reports the amount on your ESS statement. Under a taxed-upfront scheme that happens in the year you receive the RSUs. Under a tax-deferred scheme, such as one where you lose unvested units if you leave, it happens at the deferred taxing point: for RSUs that convert on vesting into shares you are free to sell, that is the vesting date, and it is never later than 15 years after you received them. If you sell within 30 days of the deferred taxing point, the sale date becomes the taxing point. Otherwise the shares are treated as acquired at their market value at the taxing point, so any later gain is a capital gain, with the ${DISCOUNT} CGT discount if you own them for at least ${CGT_MINIMUM_OWNERSHIP_MONTHS} months from then. From ${CGT_REFORM_2027.startDate}, the discount is replaced by cost base indexation and a ${CGT_REFORM_2027.minimumTaxRate * 100}% minimum tax rate for gains accruing from that date.`,
  },
  {
    q: "Should I contract through ABN or Pty Ltd?",
    a: `As a sole trader (ABN), business income is yours and taxed at your personal marginal rates. A company has its own tax rate, ${BASE_RATE_ENTITY_TAX} for a base rate entity in 2025–26, but income earned mainly from your own skills or effort is personal services income (PSI). If the PSI rules apply, the company must attribute that income to you, so it is taxed at your marginal rates anyway. A company also carries its own accounting and reporting costs. Model both in the Entity Structure Comparison on this site.`,
    links: { "Entity Structure Comparison": "/employee-vs-sole-trader-vs-company/" },
  },
  {
    q: "How much do cybersecurity professionals earn?",
    a: `It depends on the role: on 2023–24 tax returns the median salary was ${formatAUD(CYBER_ANALYST.medianSalary)} for cyber security analysts and ${formatAUD(CYBER_ARCHITECT.medianSalary)} for cyber security architects (ATO). The cyber security salary page lists all seven cyber roles with take-home pay.`,
    links: { "cyber security salary page": "/job-pay-rates/cyber-security/" },
  },
  {
    q: "How much do IT project managers earn?",
    a: `IT project managers had a median salary of ${formatAUD(ICT_PM.medianSalary)} on 2023–24 tax returns (ATO). The project manager salary page compares IT, construction and program roles.`,
    links: { "project manager salary page": "/job-pay-rates/project-manager/" },
  },
];
