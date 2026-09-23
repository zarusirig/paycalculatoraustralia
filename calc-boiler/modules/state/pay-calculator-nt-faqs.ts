// Shared FAQ copy for /pay-calculator-nt/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in app/pay-calculator-nt/page.tsx.

import { MEDICARE_LEVY, STATE_PAYROLL_TAX, formatAUD, formatPercent } from "@/lib/constants";
import { STATE_PROFILES } from "@/lib/data/state-employee";
import type { FaqItem } from "@/lib/faq";
import { ABS_PERIOD, awoteLine } from "./state-faqs-shared";

const PROFILE = STATE_PROFILES.NT;

export const NT_FAQS: readonly FaqItem[] = [
  {
    q: "Is income tax different in the Northern Territory?",
    a: `No. The Medicare levy is a federal charge of ${formatPercent(MEDICARE_LEVY.rate, 0)} of taxable income, applied uniformly across Australia, and income tax brackets and HECS-HELP thresholds are federal too. NT residents pay the same rates as everyone else — the zone tax offset is the only NT-linked adjustment, and it is claimed in your tax return rather than withheld from your pay.`,
  },
  {
    q: "What is the take-home pay on the average NT salary?",
    a: `Full-time adults in the NT earn ${awoteLine(PROFILE)} (ABS, ${ABS_PERIOD}). The worked example above shows the net figure before any zone tax offset.`,
  },
  {
    q: "Why isn't the zone tax offset in the calculator?",
    a: "Because it depends on the exact locality you live in and on a residency test — more than half the income year in the zone. It is a rebate against tax payable, claimed in your return, so it does not change your fortnightly withholding. See the zone tax offset guide for the amounts by zone.",
    links: { "zone tax offset guide": "/zone-tax-offset/" },
  },
  {
    q: "What is Picnic Day?",
    a: "Picnic Day is a Northern Territory public holiday held on the first Monday in August — 3 August in 2026. It is observed nowhere else in Australia and attracts full public holiday entitlements, including penalty rates under most awards if you work it.",
  },
  {
    q: "When do I get long service leave in the NT?",
    a: "After 10 years of continuous service you may be eligible for 13 weeks, calculated at 1.3 weeks for each year of employment. Part years do not count. Between 7 and 10 years a pro-rata payment is owed only if you reach retirement age, the employer ends the job for something other than serious misconduct, or you resign for illness, incapacity or pressing necessity.",
  },
  {
    q: "Are district allowances included in my long service leave pay?",
    a: "No. NT long service leave is paid at your usual rate of pay, which excludes overtime, penalties, and district and site allowances. If a large part of your income comes from allowances, your leave pay will be noticeably lower than your normal fortnightly pay.",
  },
  {
    q: "Do NT employees pay payroll tax?",
    a: `No. It is charged to employers whose Australian wages exceed ${formatAUD(STATE_PAYROLL_TAX.NT.threshold)} — the highest threshold in Australia — and it never appears on an employee's payslip.`,
  },
];
