// Shared FAQ copy for /pay-calculator-act/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in app/pay-calculator-act/page.tsx.

import { STATE_PAYROLL_TAX, SUPER_GUARANTEE, formatAUD, formatPercent } from "@/lib/constants";
import { STATE_PROFILES } from "@/lib/data/state-employee";
import type { FaqItem } from "@/lib/faq";
import { ABS_PERIOD, awoteLine } from "./state-faqs-shared";

const PROFILE = STATE_PROFILES.ACT;
const SG = formatPercent(SUPER_GUARANTEE.rate, 0);

export const ACT_FAQS: readonly FaqItem[] = [
  {
    q: "Is income tax different in the ACT?",
    a: "No. Your income tax, Medicare levy, and HECS-HELP obligations are determined by the ATO at the federal level and do not change based on your residential address. Cross-border commuters from Queanbeyan, Yass, or Bungendore pay the same taxation as Canberra residents.",
  },
  {
    q: "What is the take-home pay on the average Canberra salary?",
    a: `Full-time adults in the ACT earn ${awoteLine(PROFILE)} — the highest in Australia (ABS, ${ABS_PERIOD}). The worked example above shows what is left after tax.`,
  },
  {
    q: "Which public holidays are unique to the ACT?",
    a: "Canberra Day, held on the second Monday in March, and Reconciliation Day, held on the first Monday on or after 27 May. Neither is observed in NSW, so a worker based in Canberra gets two penalty-rate days a Queanbeyan colleague does not.",
  },
  {
    q: "I live in Queanbeyan but work in Canberra. Which public holidays do I get?",
    a: "The ones where you are based for work. Public holiday entitlements follow the location your job is based in, not where you live or where you happen to be on the day, so an ACT-based role gets the ACT calendar.",
  },
  {
    q: "When do I get long service leave in the ACT?",
    a: "After 7 years of continuous service you are entitled to 6.0667 weeks of paid leave under the Long Service Leave Act 1976, plus a further fifth of a month for each subsequent year. A pro-rata payment can be owed from 5 years in defined circumstances. Public sector employees and portable-scheme industries are covered separately.",
  },
  {
    q: "Does 15.4% super change my take-home pay?",
    a: `No. Superannuation is paid on top of your salary, not deducted from it, so a higher scheme rate raises your total package without changing your net pay. Federal public servants under PSSap receive 15.4% against the standard ${SG} guarantee. The calculator above uses the statutory ${SG}; adjust the package figure if you are on the APS rate.`,
  },
  {
    q: "Do ACT employees pay payroll tax?",
    a: `No. It is charged to employers whose Australia-wide wages exceed ${formatAUD(STATE_PAYROLL_TAX.ACT.threshold)}. It is never deducted from wages and never appears on a payslip.`,
  },
];
