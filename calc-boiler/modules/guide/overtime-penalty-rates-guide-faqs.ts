// Shared FAQ copy for /overtime-penalty-rates-guide/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in
// app/overtime-penalty-rates-guide/page.tsx, so the structured data cannot
// drift from the page. Award rates come from lib/constants/hospitality-award.ts,
// brackets/SG/HECS from lib/constants, TOIL rules from lib/constants/time-in-lieu.ts.

import { EMPLOYMENT, formatAUD, HECS_HELP, SITE_CONFIG, SUPER_GUARANTEE, TAX_BRACKETS } from "@/lib/constants";
import { HOSPITALITY_PENALTIES, RETAIL_PENALTIES, RETAIL_RATES } from "@/lib/constants/hospitality-award";
import { PENALTY_UNIT } from "@/lib/constants/tax-calendar-2026-27";
import type { FaqItem } from "@/lib/faq";

const pct = (v: number) => `${(v * 100).toFixed((v * 100) % 1 === 0 ? 0 : 1)}%`;
const RETAIL_L1 = RETAIL_RATES.find((r) => r.level === "Level 1")!;
const MID = TAX_BRACKETS[2];
const HECS_FIRST = HECS_HELP.bands.find((b) => b.marginalRate > 0)!;
const CASUAL = pct(EMPLOYMENT.casualLoading);
// Fair Work Act s 539/s 546: 60 penalty units per civil contravention for an
// individual, five times that for a body corporate.
const FW_UNITS_INDIVIDUAL = 60;
const FW_UNITS_COMPANY = FW_UNITS_INDIVIDUAL * 5;

export const PENALTY_RATES_FAQS: readonly FaqItem[] = [
  {
    q: "What are the penalty rates in Australia?",
    a: `Penalty rates are set by each modern award. Under the General Retail Industry Award a permanent employee receives ${pct(RETAIL_PENALTIES.saturday)} of the ordinary rate on Saturday, ${pct(RETAIL_PENALTIES.sunday)} on Sunday and ${pct(RETAIL_PENALTIES.publicHoliday)} on a public holiday; casuals receive ${pct(RETAIL_PENALTIES.casualSaturday)}, ${pct(RETAIL_PENALTIES.casualSunday)} and ${pct(RETAIL_PENALTIES.casualPublicHoliday)}. On the level 1 rate of ${formatAUD(RETAIL_L1.hourly, 2)} an hour, Sunday is ${formatAUD(RETAIL_L1.hourly * RETAIL_PENALTIES.sunday, 2)}. Other awards differ, and nursing weekend penalties in particular are higher.`,
  },
  {
    q: "How is overtime taxed in Australia?",
    a: `Overtime and penalty rate income is added to your regular income and taxed at your marginal rate. There is no separate tax rate for overtime or penalty rate income, and the ATO treats all employment earnings identically for PAYG withholding. Income between ${formatAUD(MID.min)} and ${formatAUD(MID.max)} is taxed at ${pct(MID.rate)} — the 32.5% bracket many guides still quote has not existed since the Stage 3 changes. Use our Overtime Pay Calculator to see the after-tax amount.`,
    links: { "Overtime Pay Calculator": "/overtime-pay-calculator/" },
  },
  {
    q: "Do I get super on overtime pay?",
    a: `Generally no. Overtime is not "Ordinary Time Earnings" (OTE) and does not attract the ${pct(SUPER_GUARANTEE.rate)} superannuation guarantee. Penalty-loaded ordinary hours, unlike overtime, do count as ordinary time earnings and do attract super. Some enterprise agreements specifically include overtime in the super calculation base. Check your agreement or ask your employer's payroll department.`,
  },
  {
    q: "How do I find my exact penalty rates?",
    a: "Use the Fair Work Ombudsman's Find My Award tool. It will identify your specific award and show the exact penalty rate multipliers that apply to your role. You can also check your employment contract or payslip for the applicable award name.",
    links: { "Find My Award": "https://calculate.fairwork.gov.au/FindYourAward" },
  },
  {
    q: "Is casual loading paid on top of penalty rates?",
    a: `Casual penalty rates are additive, not compounded. In the retail award, casual Sunday is ${pct(RETAIL_PENALTIES.casualSunday)} of the base rate — the ${pct(RETAIL_PENALTIES.sunday)} Sunday rate plus the ${CASUAL} casual loading — not ${pct(RETAIL_PENALTIES.sunday)} multiplied by 1.25, which would give ${pct(RETAIL_PENALTIES.sunday * 1.25)}. The award's casual column already includes the loading, so it is not added again. Compounding is one of the most common payroll errors.`,
  },
  {
    q: "How do hospitality evening and night rates work?",
    a: `They are flat cash amounts per hour, not multipliers. The Hospitality Industry (General) Award adds ${formatAUD(HOSPITALITY_PENALTIES.eveningPerHour, 2)} an hour for evening work and ${formatAUD(HOSPITALITY_PENALTIES.nightPerHour, 2)} an hour at night on top of the ordinary rate. Guides that print a 1.15x multiplier for hospitality late-night work are wrong. The retail award does use a percentage for evening work after 6pm.`,
  },
  {
    q: "Can penalty rates stack on top of each other?",
    a: "Usually not. Most awards pay only the highest applicable penalty where more than one could apply to the same hours. Under SCHADS, weekend rates substitute for shift loadings rather than adding to them, and public holiday pay replaces both.",
  },
  {
    q: "What is the difference between penalty rates and overtime?",
    a: `Penalty rates compensate for when you work (weekends, public holidays, evenings). Overtime compensates for working more than your standard hours (beyond ${EMPLOYMENT.standardWeeklyHours} hours per week for full-time employees). A shift can attract both penalties -- for example, overtime worked on a Sunday receives the higher applicable rate under most modern awards.`,
  },
  {
    q: "Can I refuse to work on a public holiday?",
    a: "Yes. Under section 114 of the Fair Work Act, an employee can refuse a request to work on a public holiday if the refusal is reasonable. Factors include whether the workplace is normally open on public holidays, the employee's personal circumstances, and the notice provided. Employees who do work public holidays receive penalty rates of 2.0x to 2.75x depending on their award.",
  },
  {
    q: "Do salaried employees get penalty rates?",
    a: "It depends on the employment arrangement. Award-covered salaried employees must receive penalty rates unless their salary is high enough to \"absorb\" all applicable penalties and overtime (an \"annualised salary\" arrangement). The annualised salary must exceed the total of base pay plus all penalties the employee would otherwise receive. Employers must conduct annual reconciliations to verify this.",
  },
  {
    q: "What should I do if my employer is not paying penalty rates?",
    a: `Contact the Fair Work Ombudsman on 13 13 94 or lodge a complaint online at fairwork.gov.au. The FWO investigates underpayment claims and underpaid wages can be recovered for up to 6 years. A standard civil penalty under the Fair Work Act is up to ${FW_UNITS_INDIVIDUAL} penalty units per contravention for individuals and ${FW_UNITS_COMPANY} for companies (${formatAUD(FW_UNITS_INDIVIDUAL * PENALTY_UNIT.amount)} and ${formatAUD(FW_UNITS_COMPANY * PENALTY_UNIT.amount)} at the ${formatAUD(PENALTY_UNIT.amount)} penalty unit from ${PENALTY_UNIT.from}), and serious contraventions attract up to ten times that.`,
  },
  {
    q: "Can my employer offer time off instead of penalty rates?",
    a: "Time Off in Lieu (TOIL) replaces overtime pay, not weekend or public holiday penalties, and only where your award, enterprise agreement or contract allows it and you agree. The ratio depends on the award: the Clerks, Hospitality, Manufacturing, Security and SCHADS awards give time off hour for hour, while the General Retail, Fast Food and Pharmacy awards give time equal to the overtime payment (1 hour at 1.5x = 1.5 hours off). TOIL not taken within the award's window (usually 6 months) must be paid out at the overtime rate.",
  },
  {
    q: "Do penalty rates affect my HECS-HELP repayment?",
    a: `Yes. Penalty rate income increases your "Repayment Income" for HECS-HELP purposes, which includes taxable income, reportable fringe benefits, and net investment losses. For FY${SITE_CONFIG.financialYear}, compulsory repayments start once repayment income exceeds ${formatAUD(HECS_HELP.minimumThreshold)}, at ${Math.round(HECS_FIRST.marginalRate * 100)}c for each dollar above the threshold. Higher penalty rate earnings raise the repayment. See our HECS-HELP Repayment Calculator for details.`,
    links: { "HECS-HELP Repayment Calculator": "/hecs-help-calculator/" },
  },
  {
    q: "Does the Right to Disconnect affect overtime and penalties?",
    a: "The \"Right to Disconnect\" provisions (effective August 2024 for employers with 15+ employees, August 2025 for small employers) allow employees to refuse out-of-hours contact unless the refusal is unreasonable. This does not eliminate overtime or penalty rates but reinforces that work performed outside rostered hours must be compensated. Employees who are contacted and required to perform work outside their scheduled shift are entitled to applicable overtime or penalty rates.",
  },
  {
    q: "How do I check penalty rates on my payslip?",
    a: "Your payslip must itemise each pay rate separately under the Fair Work Regulations. Look for line items labelled \"Saturday loading,\" \"Sunday penalty,\" \"Public holiday,\" or \"Overtime\" with the applicable multiplier. If your payslip bundles all hours at a single rate, request a breakdown from your employer. Learn more about payslip requirements in our Understanding Your Payslip guide.",
    links: { "Understanding Your Payslip": "/understanding-your-payslip/" },
  },
];
