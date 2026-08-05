// Shared FAQ copy for /tax-changes-2026-27/.
//
// Deliberately NOT inside the "use client" module: both the rendered
// accordion (via an sr-only crawlable mirror) and the FAQPage JSON-LD in
// app/tax-changes-2026-27/page.tsx read from this one array, so the
// structured data cannot drift from the visible page. Mirrors the pattern in
// modules/guide/schads-award-faqs.ts and modules/calculator/leave-calculator-faqs.ts.
//
// This replaces two previously separate, hand-maintained copies: 3 questions
// hardcoded into the page's JSON-LD and 6 different questions rendered in the
// module's accordion (with no sr-only mirror, so none of the 6 answers ever
// reached crawlable HTML). This array is the deduped superset of both.
//
// Every dollar figure is interpolated from lib/constants — nothing is typed
// as a literal.

import { formatAUD, EMPLOYMENT, HECS_HELP, LITO, SUPER_GUARANTEE, TAX_BRACKETS, TAX_BRACKETS_2025_26 } from "@/lib/constants";

const PCT = (rate: number) => `${Math.round(rate * 100)}%`;

/** Max annual saving from the 1 July 2026 second-bracket cut (16% → 15%). */
const RATE_CUT_MAX_SAVING = Math.round(
  (TAX_BRACKETS_2025_26[1].rate - TAX_BRACKETS[1].rate) * (TAX_BRACKETS[1].max - TAX_BRACKETS[0].max)
);

export interface TaxChangesFaq {
  q: string;
  a: string;
}

export const TAX_CHANGES_2026_27_FAQS: readonly TaxChangesFaq[] = [
  {
    q: "What are the main tax changes for FY2026-27?",
    a: `The headline change is the legislated cost-of-living tax cut: the rate on income between ${formatAUD(TAX_BRACKETS[1].min - 1)} and ${formatAUD(TAX_BRACKETS[1].max)} drops from ${PCT(TAX_BRACKETS_2025_26[1].rate)} to ${PCT(TAX_BRACKETS[1].rate)} on 1 July 2026, worth up to ${formatAUD(RATE_CUT_MAX_SAVING)} a year once you earn ${formatAUD(TAX_BRACKETS[1].max)} or more. The super guarantee stays at ${PCT(SUPER_GUARANTEE.rate)} while Payday Super begins, and the HECS-HELP repayment threshold rises to ${formatAUD(HECS_HELP.minimumThreshold)}.`,
  },
  {
    q: "Will tax brackets change in 2026-27?",
    a: `Yes. The legislated cost-of-living tax cuts reduce the rate on income between ${formatAUD(TAX_BRACKETS[1].min - 1)} and ${formatAUD(TAX_BRACKETS[1].max)} from ${PCT(TAX_BRACKETS_2025_26[1].rate)} to ${PCT(TAX_BRACKETS[1].rate)} on 1 July 2026 — worth up to ${formatAUD(RATE_CUT_MAX_SAVING)} a year — with a further cut to 14% on 1 July 2027. Bracket thresholds themselves are unchanged.`,
  },
  {
    q: "What is the super guarantee rate for 2026-27, and is it going up again?",
    a: `No. The super guarantee rate remains at ${PCT(SUPER_GUARANTEE.rate)} for FY2026-27 — it reached its legislated ceiling of ${PCT(SUPER_GUARANTEE.rate)} on 1 July 2025 after a decade-long increase from 9.5%, and no further increases are currently scheduled. Any additional rise would require new legislation from Parliament.`,
  },
  {
    q: "What will the HECS threshold be in 2026-27?",
    a: `The FY2026-27 HECS-HELP threshold is ${formatAUD(HECS_HELP.minimumThreshold)}, up from ${formatAUD(HECS_HELP.previousThreshold)} in FY2025-26. Above it you repay ${(HECS_HELP.bands[1].marginalRate * 100).toFixed(0)}c per $1 up to ${formatAUD(HECS_HELP.bands[1].max)}, then ${formatAUD(HECS_HELP.bands[2].base)} plus ${(HECS_HELP.bands[2].marginalRate * 100).toFixed(0)}c per $1 up to ${formatAUD(HECS_HELP.bands[2].max)}, and ${(HECS_HELP.bands[3].marginalRate * 100).toFixed(0)}% of total repayment income beyond that.`,
  },
  {
    q: "When is the 2026 federal budget?",
    a: `The 2026-27 federal budget was delivered on 12 May 2026. Its headline tax measures — including the CGT reforms that apply from 1 July 2027 — have since passed Parliament and are now law.`,
  },
  {
    q: "Will LITO change in 2026-27?",
    a: `The Low Income Tax Offset is not automatically indexed. It currently provides up to ${formatAUD(LITO.maxOffset)} for incomes up to ${formatAUD(LITO.fullOffsetCeiling)}, phasing out completely at ${formatAUD(LITO.nilOffsetIncome)}. The May 2026 budget made no change to LITO, so these settings carry over unchanged for FY2026-27.`,
  },
  {
    q: "When will the new minimum wage be announced?",
    a: `The Fair Work Commission typically announces the new minimum wage in June each year, effective from the first full pay period on or after 1 July. The FWC's 2 June 2026 Annual Wage Review decision set the current minimum wage at ${formatAUD(EMPLOYMENT.minimumWageHourly, 2)} per hour (${formatAUD(EMPLOYMENT.minimumWageWeekly, 2)} per week for a ${EMPLOYMENT.standardWeeklyHours}-hour week), effective 1 July 2026.`,
  },
] as const;
