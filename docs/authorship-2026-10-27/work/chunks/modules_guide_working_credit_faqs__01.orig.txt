import { formatAUD } from "@/lib/constants";
import { JOBSEEKER_INCOME_TEST } from "@/lib/constants/centrelink-income-test";
import { WORKING_CREDIT, fortnightsToMaxBalance } from "@/lib/constants/working-credit";
import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Sources: Services
// Australia "Working Credit" and DSS Social Security Guide 3.1.11 (read
// 23 September 2026) — cited in lib/constants/working-credit.ts.

const T = formatAUD(WORKING_CREDIT.accrualThreshold);
const FREE = formatAUD(JOBSEEKER_INCOME_TEST.freeArea);

export const WORKING_CREDIT_FAQS: Faq[] = [
  {
    q: "What is Centrelink Working Credit?",
    a: `Working Credit lets you keep more of your income support payment when you start work. You build credits in fortnights when your income is under ${T}, and each credit then offsets $1 of employment income, so your payment isn't reduced until the credits run out.`,
  },
  {
    q: "How do you build Working Credit?",
    a: `You earn credits in any fortnight your total income (work and investments, not Centrelink payments) is under ${T}: ${T} minus your income, so up to ${WORKING_CREDIT.maxPerFortnight} credits a fortnight. It happens automatically when you report your income.`,
  },
  {
    q: "What is the maximum Working Credit balance?",
    a: `${WORKING_CREDIT.maxBalance.toLocaleString("en-AU")} credits for JobSeeker Payment, Parenting Payment, Disability Support Pension and Carer Payment, and ${WORKING_CREDIT.maxBalanceYouthAllowanceJobSeeker.toLocaleString("en-AU")} for Youth Allowance as a job seeker. With no income it takes ${fortnightsToMaxBalance()} fortnights to reach ${WORKING_CREDIT.maxBalance.toLocaleString("en-AU")}.`,
  },
  {
    q: "How are Working Credits used?",
    a: `When you have employment income, Centrelink uses credits to cancel out the income above your income free area (${FREE} a fortnight for JobSeeker). The amount used each fortnight is the smallest of your employment income, your income above the free area, and your balance.`,
  },
  {
    q: "Can students get Working Credit?",
    a: "No. Full-time students and apprentices on Youth Allowance, Austudy or ABSTUDY Living Allowance have the Income Bank instead, which works in a similar way.",
  },
  {
    q: "What happens when my payment stops because I'm working?",
    a: "Once your income is over the cut-off and your credits have run out, your payment stops. You may keep your concession card and some other benefits for up to 12 fortnights.",
  },
];
