// Shared FAQ copy for /pay-rise-calculator/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in app/pay-rise-calculator/page.tsx, so the
// structured data cannot drift from the page. Every figure is computed from
// the tax engine and lib/constants.

import {
  calculateMedicareSurcharge,
  calculatePayBreakdown,
  formatAUD,
  HECS_HELP,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_BRACKETS,
} from "@/lib/constants";
import { DIVISION_293 } from "@/lib/constants/super-contributions";
import { hecsBandsSentence } from "@/modules/calculator/fy-rate-copy";
import type { FaqItem } from "@/lib/faq";

const FY = SITE_CONFIG.financialYear;
const net = (gross: number, includeHECS = false) => calculatePayBreakdown({ grossSalary: gross, includeHECS }).takeHomePay;
const raiseNet = (base: number, raise: number) => net(base + raise) - net(base);
const pct0 = (r: number) => `${Math.round(r * 100)}%`;
const pct = (r: number) => `${Math.round(r * 10_000) / 100}%`;

const B2 = TAX_BRACKETS[2];
const B3 = TAX_BRACKETS[3];
const B4 = TAX_BRACKETS[4];
const MLS = MEDICARE_LEVY.surcharge;
const SG_RAISE = 10_000;
const RAISE_5K_ON_80K = raiseNet(80_000, 5_000);
const RAISE_5K_ON_150K = raiseNet(150_000, 5_000);
const HECS_65_TO_70 =
  calculatePayBreakdown({ grossSalary: 70_000, includeHECS: true }).hecsRepayment -
  calculatePayBreakdown({ grossSalary: 65_000, includeHECS: true }).hecsRepayment;
const MLS_110K = calculateMedicareSurcharge(110_000, false);

// Salary sacrifice: $5,000 taxed at 15% in the fund instead of the marginal
// rate plus Medicare levy, for the 30% bracket up to the top bracket.
const SACRIFICE = 5_000;
const CONTRIB_TAX = 0.15;
const sacrificeSaving = (rate: number) => SACRIFICE * (rate + MEDICARE_LEVY.rate - CONTRIB_TAX);

// Stage 3: before 1 July 2024 the 37% bracket started at $120,001.
const PRE_STAGE3_37_FROM = 120_000;
const STAGE3_RAISE = 10_000;
const STAGE3_EXAMPLE = 125_000;
const STAGE3_GAIN = STAGE3_RAISE * (B3.rate - B2.rate);

const CROSS_FROM = B2.max - 1_000;
const CROSS_TO = B2.max + 1_000;

export const PAY_RISE_FAQS: readonly FaqItem[] = [
  {
    q: "Why is my pay rise taxed so highly?",
    a: `Your pay rise is taxed at your "marginal tax rate", which is the highest tax bracket your income falls into. This is often much higher than your average tax rate, meaning a larger percentage of your extra pay goes to the ATO. Between ${formatAUD(B2.min)} and ${formatAUD(B2.max)}, your marginal rate is ${pct0(B2.rate)} plus ${pct0(MEDICARE_LEVY.rate)} Medicare levy, totalling ${pct0(B2.rate + MEDICARE_LEVY.rate)}. Between ${formatAUD(B3.min)} and ${formatAUD(B3.max)}, the combined marginal rate rises to ${pct0(B3.rate + MEDICARE_LEVY.rate)}.`,
  },
  {
    q: "Does my employer pay extra super on my pay rise?",
    a: `Yes. Under the "Superannuation Guarantee", your employer pays ${pct0(SUPER_GUARANTEE.rate)} super on your qualifying earnings for FY${FY}. A ${formatAUD(SG_RAISE)} base pay rise generates an extra ${formatAUD(SG_RAISE * SUPER_GUARANTEE.rate)} deposited into your super fund per year. Under Payday Super the "maximum super contribution base" is an annual ${formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}.`,
  },
  {
    q: "Can a pay rise push me into a higher tax bracket and leave me worse off?",
    a: `No. This is the most common tax myth in Australia. Progressive taxation means only the portion of income above each threshold is taxed at the higher rate. A pay rise that crosses from ${formatAUD(CROSS_FROM)} to ${formatAUD(CROSS_TO)} applies the ${pct0(B3.rate)} rate only to the ${formatAUD(CROSS_TO - B2.max)} above ${formatAUD(B2.max)}, not to the entire salary. You always take home more money after a pay rise.`,
  },
  {
    q: "Can salary sacrifice boost my pay rise benefit?",
    a: `Yes. Salary sacrificing part of your pay rise into super before tax avoids the marginal rate on that portion. Inside your super fund, contributions are taxed at only ${pct0(CONTRIB_TAX)} (or ${pct0(CONTRIB_TAX + DIVISION_293.rate)} for earners above ${formatAUD(DIVISION_293.threshold)} under "Division 293" tax). Sacrificing ${formatAUD(SACRIFICE)} of a ${formatAUD(SACRIFICE * 2)} pay rise saves roughly ${formatAUD(sacrificeSaving(B2.rate))} to ${formatAUD(sacrificeSaving(B4.rate))} in tax depending on your bracket, while boosting retirement savings. The concessional contributions cap is ${formatAUD(SUPER_GUARANTEE.concessionalCap)} for FY${FY}. Use our Salary Sacrifice Calculator to model the benefit.`,
    links: { "Salary Sacrifice Calculator": "/salary-sacrifice-calculator/" },
  },
  {
    q: "How does a pay rise affect my HECS-HELP repayments?",
    a: `A pay rise increases your repayment income, which determines HECS-HELP obligations. The repayment threshold for FY${FY} is ${formatAUD(HECS_HELP.minimumThreshold)}. Below this threshold, no repayment is required. Above it, you repay ${hecsBandsSentence()}. A pay rise from $65,000 to $70,000 triggers a HECS repayment of ${formatAUD(HECS_65_TO_70)} per year.`,
  },
  {
    q: "How much extra per week is a $5,000 pay rise?",
    a: `The net weekly increase from a $5,000 pay rise depends on your current salary and marginal tax rate. On an $80,000 salary (${pct0(B2.rate + MEDICARE_LEVY.rate)} combined marginal rate), a $5,000 raise yields ${formatAUD(RAISE_5K_ON_80K)} extra after tax, or ${formatAUD(RAISE_5K_ON_80K / 52, 2)} per week. On a $150,000 salary (${pct0(B3.rate + MEDICARE_LEVY.rate)} combined marginal rate), the same $5,000 raise yields ${formatAUD(RAISE_5K_ON_150K)} after tax, or ${formatAUD(RAISE_5K_ON_150K / 52, 2)} per week.`,
  },
  {
    q: "Does a pay rise affect the Medicare Levy Surcharge?",
    a: `Yes, if you do not hold private hospital cover. The "Medicare Levy Surcharge" applies to singles earning ${formatAUD(MLS.tier1.min)} or more in FY${FY}. A pay rise crossing this threshold triggers an additional ${pct(MLS.tier1.rate)} surcharge on total income (${formatAUD(MLS.tier1.min)}-${formatAUD(MLS.tier1.max)}), increasing to ${pct(MLS.tier2.rate)} (${formatAUD(MLS.tier2.min)}-${formatAUD(MLS.tier2.max)}) and ${pct(MLS.tier3.rate)} (above ${formatAUD(MLS.tier3.min - 1)}). On a $110,000 salary without private health insurance, the MLS adds ${formatAUD(MLS_110K)} per year in additional deductions.`,
  },
  {
    q: "Did the Stage 3 tax cuts change how pay rises are taxed?",
    a: `Yes. The Stage 3 tax cuts, effective 1 July 2024, reduced the first bracket rate from 19% to 16% (and it fell again to ${pct0(TAX_BRACKETS[1].rate)} from 1 July 2026) and expanded the ${pct0(B2.rate)} bracket ceiling from ${formatAUD(PRE_STAGE3_37_FROM)} to ${formatAUD(B2.max)}. Employees earning between ${formatAUD(PRE_STAGE3_37_FROM + 1)} and ${formatAUD(B2.max)} now keep more of a pay rise because their marginal rate dropped from ${pct0(B3.rate)} to ${pct0(B2.rate)}. A ${formatAUD(STAGE3_RAISE)} raise for someone on ${formatAUD(STAGE3_EXAMPLE)} now yields ${formatAUD(STAGE3_GAIN)} more in take-home pay compared to pre-Stage 3 rates.`,
  },
];
