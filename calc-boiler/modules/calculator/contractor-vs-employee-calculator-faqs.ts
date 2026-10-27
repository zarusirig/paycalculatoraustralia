// Shared FAQ copy for /contractor-vs-employee-calculator/ — rendered by the
// page's accordion and turned into FAQPage JSON-LD in
// app/contractor-vs-employee-calculator/page.tsx, so the structured data
// cannot drift from the page. Figures come from lib/constants.

import { EMPLOYMENT, formatAUD, formatPercent, GENERAL_INTEREST_CHARGE, MEDICARE_LEVY, SITE_CONFIG, SUPER_GUARANTEE, TAX_BRACKETS } from "@/lib/constants";
import { GST_RATE } from "@/lib/constants/company-tax";
import { GST_REGISTRATION_THRESHOLD } from "@/lib/constants/gig-tax";
import { PENALTY_UNIT } from "@/lib/constants/tax-calendar-2026-27";
import type { FaqItem } from "@/lib/faq";

const FY = SITE_CONFIG.financialYear;
const CC_CAP = formatAUD(SUPER_GUARANTEE.concessionalCap);
const SG_PCT = formatPercent(SUPER_GUARANTEE.rate, 0);
const GIC_PCT = formatPercent(GENERAL_INTEREST_CHARGE.annualRate, 2);
const GST_THRESHOLD = formatAUD(GST_REGISTRATION_THRESHOLD);
const GST_PCT = formatPercent(GST_RATE, 0);
// NES leave as a share of a 52-week, 260-weekday year: 4 weeks / 52, 10 days / 260.
const ANNUAL_LEAVE_PCT = formatPercent(EMPLOYMENT.annualLeaveWeeks / EMPLOYMENT.weeksPerYear, 1);
const PERSONAL_LEAVE_PCT = formatPercent(EMPLOYMENT.personalLeaveDays / (EMPLOYMENT.weeksPerYear * 5), 1);
// No-ABN withholding is the top rate plus Medicare levy (47% from 1 July 2017).
// https://www.ato.gov.au/forms-and-instructions/statement-by-supplier-not-quoting-an-abn
const NO_ABN_PCT = formatPercent(TAX_BRACKETS[TAX_BRACKETS.length - 1].rate + MEDICARE_LEVY.rate, 0);

// Sham contracting maximums, Fair Work Act ss 357–359, 539: 60 penalty units
// (individual), 300 (business with fewer than 15 employees), 1,500 (15 or
// more). FWO "Sham contracting" (updated 6 July 2026) lists $21,840 / $109,200
// / $546,000 — i.e. the $364 penalty unit from 1 July 2026.
// https://www.fairwork.gov.au/find-help-for/independent-contractors/sham-contracting
export const SHAM_MAX_INDIVIDUAL = formatAUD(60 * PENALTY_UNIT.amount);
export const SHAM_MAX_SMALL_BUSINESS = formatAUD(300 * PENALTY_UNIT.amount);
export const SHAM_MAX_BUSINESS = formatAUD(1_500 * PENALTY_UNIT.amount);

export const CONTRACTOR_VS_EMPLOYEE_FAQS: readonly FaqItem[] = [
  {
    q: "Should I be a contractor or employee?",
    a: "It depends on the rate differential. If contracting pays 30%+ more than the equivalent employee salary, the financial benefit usually outweighs the loss of entitlements. Below that, employment is typically better value. Use the calculator above to compare your specific scenario.",
  },
  {
    q: "Do contractors have to pay super?",
    a: `Contractors are not legally required to pay their own super (unlike employers who must pay the SG). Setting aside ${SG_PCT} of your income for super yourself matches what an employer would contribute under the SG. You can claim a tax deduction for personal super contributions up to the ${CC_CAP} concessional cap (FY${FY}) in your tax return.`,
  },
  {
    q: "Do I need to register for GST as a contractor?",
    a: `You must register for GST if your annual business turnover is ${GST_THRESHOLD} or more. If it's below ${GST_THRESHOLD}, registration is optional. When registered, you charge clients an additional ${GST_PCT} GST on your invoices and remit it to the ATO quarterly via your Business Activity Statement (BAS).`,
  },
  {
    q: "Can I just decide to be a contractor?",
    a: "No. For tax and super, the ATO looks at the legal rights and obligations in your contract as a whole (who controls the work, whether you can delegate it, who bears the commercial risk and who supplies the tools), not the label the contract uses (Taxation Ruling TR 2023/4). For Fair Work purposes, from 26 August 2024 companies use the whole of relationship test, which looks at the real substance, practical reality and true nature of the working relationship. Sham contracting penalties apply to a business that tells an employee they are a contractor, unless it proves it reasonably believed they were one.",
  },
  {
    q: "How much more should a contractor charge than an employee salary?",
    a: `A contractor should charge 30 to 45% above the equivalent employee salary to cover the superannuation guarantee (${SG_PCT}), annual leave (${ANNUAL_LEAVE_PCT}), personal leave (${PERSONAL_LEAVE_PCT}), insurance ($1,000 to $3,000), and admin costs ($2,000 to $4,000). On a $100,000 employee salary, the equivalent contractor rate is approximately $135,000 to $145,000 before GST.`,
  },
  {
    q: "Do contractors need income protection insurance?",
    a: "Income protection insurance is strongly recommended for contractors. Unlike employees who are covered by their employer's workers' compensation insurance, contractors must arrange their own coverage. Income protection insurance typically costs 1 to 3% of your annual income and replaces up to 70% of your earnings if you are unable to work due to illness or injury. The premiums are tax-deductible.",
  },
  {
    q: "What tax deductions can contractors claim?",
    a: "Contractors can deduct business expenses such as home office costs, equipment and tools, professional insurance premiums, accounting fees, travel between work sites, software subscriptions, and professional development. These deductions reduce your taxable income, and the calculator above subtracts them before it works out your tax. Keep detailed records and receipts for every claim.",
  },
  {
    q: "Do independent contractors pay their own tax?",
    a: `Yes, independent contractors are responsible for managing their own tax affairs through their ABN. Clients do not withhold PAYG tax from a contractor's invoices the way an employer withholds it from an employee's pay, unless a voluntary withholding agreement is in place. If you don't quote your ABN and a payment is more than $75 excluding GST, the client must withhold ${NO_ABN_PCT} and send it to the ATO, unless an exception applies.`,
  },
  {
    q: "Do contractors pay PAYG instalments?",
    a: `Only once the ATO enters you, or you enter voluntarily. The ATO automatically enters an individual or sole trader whose latest tax return shows instalment income of $4,000 or more, whose latest notice of assessment shows tax payable of $1,000 or more, and whose estimated (notional) tax is $500 or more. Instalments are due quarterly (or once or twice a year if you use the annual or two-instalment option) and pre-pay your expected income tax liability. The ATO calculates the instalment amount based on your most recent tax return or you can choose to pay based on actual quarterly income. Failure to pay PAYG instalments on time incurs the general interest charge (GIC), which was ${GIC_PCT} a year for ${GENERAL_INTEREST_CHARGE.quarter} and resets every quarter.`,
  },
  {
    q: "What is the main difference between an employee and a contractor?",
    a: "An employee works inside the employer's business under the employer's direction and control. A contractor operates their own independent business and is engaged to deliver a specific result. The distinction determines tax obligations, super entitlements, leave rights, and insurance coverage.",
  },
  {
    q: "Does having an ABN automatically make me a contractor?",
    a: "No. The ATO explicitly states that merely possessing an ABN or issuing invoices does not make a worker an independent contractor. The legal rights and obligations of the whole arrangement, including control, tools, risk, and integration, determine the true classification.",
  },
  {
    q: "Are contractors entitled to superannuation?",
    a: `Genuine independent contractors manage their own super. However, if a contractor is hired "wholly or principally for their personal labour and skills" (for example, a sole-trader IT consultant billing hourly), the hiring business must pay the ${SG_PCT} Super Guarantee on top of the contractor's invoices under the Superannuation Guarantee (Administration) Act 1992, even if the contractor quotes an ABN.`,
  },
  {
    q: "What are the penalties for sham contracting?",
    a: `Courts can impose maximum penalties of ${SHAM_MAX_INDIVIDUAL} per contravention for individuals, ${SHAM_MAX_SMALL_BUSINESS} for businesses with fewer than 15 employees and ${SHAM_MAX_BUSINESS} for larger businesses. The employer must also backpay all lost entitlements including super (plus the Superannuation Guarantee Charge), annual leave, sick leave, and any Award underpayments, often spanning several years of accumulated liability.`,
  },
  {
    q: "Can I convert from contractor to employee?",
    a: "Yes, but it requires a formal transition. Your employer must issue a new employment contract, register you in their PAYG system, start paying super, and enrol you in workers' compensation insurance. Your hourly rate will typically decrease because the employer now bears additional on-costs (super, leave, WorkCover). Use our Contractor vs Employee Calculator to model the exact financial impact.",
    links: { "Contractor vs Employee Calculator": "/contractor-vs-employee-calculator/" },
  },
  {
    q: "Do contractors have to charge GST?",
    a: `GST registration is mandatory once a contractor's annual turnover reaches ${GST_THRESHOLD}. Below that threshold, registration is optional. Registered contractors charge ${GST_PCT} GST on every invoice and can claim GST credits on business purchases. Employees do not charge GST on their wages.`,
  },
  {
    q: "Do contractors pay more tax than employees?",
    a: `Contractors and employees earning the same taxable income pay the same income tax rates: the FY${FY} tax brackets and Medicare levy apply identically. One exception: a sole trader whose business has an aggregated turnover under $5 million can claim the small business income tax offset, 16% of the tax on their net small business income, up to $1,000 a year. The difference is timing and administration: employees have tax withheld automatically, while contractors must set aside funds and pay the ATO directly. Contractors can reduce their taxable income through business deductions that employees cannot claim.`,
  },
  {
    q: "Is it legal to work for only one client as a contractor?",
    a: "Working for a single client does not automatically make you an employee, but it is one of the strongest indicators the ATO examines. A genuine contractor working for one client must demonstrate independence in other areas: owning their tools, controlling their schedule, bearing commercial risk, and having the contractual right to take on other clients. Exclusive long-term arrangements with fixed hours attract heavy ATO scrutiny.",
  },
  {
    q: "Do contractors receive payslips?",
    a: "No. Contractors issue tax invoices to their clients and receive payment against those invoices. Only employees receive payslips, which employers must provide within 1 business day of each pay. Read our Understanding Your Payslip guide for a full breakdown of payslip components.",
    links: { "Understanding Your Payslip": "/understanding-your-payslip/" },
  },
  {
    q: "What insurance does a contractor need?",
    a: "Contractors typically require 3 types of insurance: public liability insurance ($400 to $1,500 per year) covering third-party injury or property damage, professional indemnity insurance ($500 to $2,000 per year) covering errors in professional advice or work, and income protection insurance ($800 to $2,500 per year) replacing income during illness or injury. Premiums are tax-deductible as business expenses.",
  },
];
