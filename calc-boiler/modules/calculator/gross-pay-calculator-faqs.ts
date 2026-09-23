// Shared FAQ copy for /gross-pay-calculator/ — rendered by the calculator's
// accordion and turned into FAQPage JSON-LD in the page file, so the structured
// data cannot drift from the page. Kept out of the "use client" module so the
// server page reads real values. Every figure comes from the tax engine.

import {
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
  LITO,
  MEDICARE_LEVY,
  NON_RESIDENT_TAX_BRACKETS,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_BRACKETS,
  TAX_BRACKETS_2025_26,
  TAX_FREE_THRESHOLD,
} from "@/lib/constants";
import type { FaqItem } from "@/lib/faq";
import { findGrossForNet } from "@/modules/calculator/gross-for-net";

const FY = SITE_CONFIG.financialYear;
const SG_PCT = formatPercent(SUPER_GUARANTEE.rate, 0);
const FIRST_RATE = formatPercent(TAX_BRACKETS[1].rate, 0);
const STAGE3_RATE = formatPercent(TAX_BRACKETS_2025_26[1].rate, 0);
const THIRTY_CEILING = formatAUD(TAX_BRACKETS[2].max);
const EX_90K_HECS = calculatePayBreakdown({ grossSalary: 90_000, includeHECS: true });
const WEEKLY_NET = 1_000;
const GROSS_FOR_1000_WK = Math.round(findGrossForNet(WEEKLY_NET * 52));

export const GROSS_PAY_FAQS: readonly FaqItem[] = [
  {
    q: "What is the difference between gross and net pay?",
    a: "Gross pay is the total amount you earn before any taxes or deductions are taken out. This is the big number on your employment contract. Net pay (or take-home pay) is the amount that actually lands in your bank account after income tax, Medicare levy, and other deductions are withheld by your employer.",
  },
  {
    q: "How do you calculate gross from net in Australia?",
    a: "Because Australia has a progressive tax system with different marginal rates (increasing as you earn more), you cannot just multiply your net pay by a single fixed percentage. You have to \"reverse engineer\" the calculation by figuring out which tax brackets your required gross income falls into and adding the appropriate tax back on top of your net amount. Our calculator automates this complex math.",
  },
  {
    q: "Does gross pay include superannuation?",
    a: `Generally, no. When negotiating a salary in Australia, "Gross Pay" or "Base Salary" usually excludes the compulsory employer superannuation guarantee (currently ${SG_PCT} for FY${FY}). If a package includes super, it is normally called a "Total Remuneration Package" (TRP) or salary "inclusive of super".`,
  },
  {
    q: "How does a HECS debt affect my gross pay target?",
    a: `If you have a HECS-HELP loan, your employer withholds additional money on top of income tax to cover your compulsory repayment. This means you need a higher gross salary to achieve the same take-home pay. For example, at $90,000 the FY${FY} compulsory repayment of ${formatAUD(EX_90K_HECS.hecsRepayment)} reduces your weekly take-home by ${formatAUD(EX_90K_HECS.hecsRepayment / 52)}. Use our HECS-HELP calculator to model the exact impact.`,
    links: { "HECS-HELP calculator": "/hecs-help-calculator/" },
  },
  {
    q: "What is a Total Remuneration Package (TRP)?",
    a: `A TRP includes your base salary plus the employer's ${SG_PCT} superannuation guarantee contribution. So a $100,000 base salary equates to a ${formatAUD(100_000 * (1 + SUPER_GUARANTEE.rate))} TRP. Some job ads quote TRP instead of base salary, which can be misleading — always clarify which figure is being used during salary negotiations.`,
  },
  {
    q: `What is the tax-free threshold in Australia for FY${FY}?`,
    a: `The statutory tax-free threshold is ${formatAUD(TAX_FREE_THRESHOLD)} per year. Australian residents who earn below this amount pay zero income tax. The Low Income Tax Offset (LITO) effectively raises this to ${formatAUD(LITO.effectiveTaxFreeThreshold)} for eligible taxpayers, as the ${formatAUD(LITO.maxOffset)} offset fully eliminates the ${FIRST_RATE} tax on income between ${formatAUD(TAX_FREE_THRESHOLD + 1)} and ${formatAUD(LITO.effectiveTaxFreeThreshold)}. Non-residents do not receive the tax-free threshold and pay ${formatPercent(NON_RESIDENT_TAX_BRACKETS[0].rate, 0)} from the first dollar earned.`,
  },
  {
    q: `What gross salary do I need to take home ${formatAUD(WEEKLY_NET)} per week?`,
    a: `To take home ${formatAUD(WEEKLY_NET)} per week after tax in FY${FY}, you need a gross annual salary of ${formatAUD(GROSS_FOR_1000_WK)}. This assumes you are an Australian resident, have no HECS-HELP debt, and claim the tax-free threshold. Your employer withholds income tax and the ${formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy from this gross amount, leaving ${formatAUD(WEEKLY_NET * 52)} net annually.`,
  },
  {
    q: "Did recent tax changes affect gross pay calculations?",
    a: `Yes. The Stage 3 tax cuts (effective 1 July 2024) lowered the second bracket rate from 19% to ${STAGE3_RATE} and expanded the 30% bracket ceiling from $120,000 to ${THIRTY_CEILING}, and from 1 July 2026 that rate fell again to ${FIRST_RATE}. These changes mean you now need a slightly lower gross salary to achieve the same net take-home pay than in earlier years. The SG rate reached ${SG_PCT} on ${SUPER_GUARANTEE.effectiveDate}, raising total remuneration packages without affecting your take-home calculation directly.`,
  },
];
