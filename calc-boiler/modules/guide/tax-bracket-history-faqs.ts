// Shared FAQ copy for /tax-bracket-history/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in app/tax-bracket-history/page.tsx, so the
// structured data cannot drift from the page. Current and FY2025-26 scales come
// from lib/constants; the pre-Stage 3 scale (FY2020-21 to FY2023-24) is
// historical and not held there, so it is defined here.

import { TAX_BRACKETS_2025_26, TAX_BRACKETS_2026_27, formatAUD, type TaxBracket } from "@/lib/constants";
import type { FaqItem } from "@/lib/faq";

/** FY2020-21 to FY2023-24 resident scale (Stage 2), per the ATO rate tables. */
const PRE_STAGE3_BRACKETS: readonly TaxBracket[] = [
  { min: 0, max: 18_200, rate: 0, base: 0, label: "" },
  { min: 18_201, max: 45_000, rate: 0.19, base: 0, label: "" },
  { min: 45_001, max: 120_000, rate: 0.325, base: 5_092, label: "" },
  { min: 120_001, max: 180_000, rate: 0.37, base: 29_467, label: "" },
  { min: 180_001, max: Infinity, rate: 0.45, base: 51_667, label: "" },
];

function taxOn(income: number, brackets: readonly TaxBracket[]): number {
  for (let i = brackets.length - 1; i >= 0; i--) {
    const b = brackets[i];
    if (income >= b.min) return b.base + (income - (b.min - 1)) * b.rate;
  }
  return 0;
}

const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const EXAMPLE = 80_000;
const before = taxOn(EXAMPLE, PRE_STAGE3_BRACKETS);
const after = taxOn(EXAMPLE, TAX_BRACKETS_2025_26);
const saving = before - after;
const scale = (bs: readonly TaxBracket[]) =>
  bs
    .map((b, i) =>
      i === 0
        ? `0% up to ${formatAUD(b.max)}`
        : b.max === Infinity
          ? `${pct(b.rate)} above ${formatAUD(b.min - 1)}`
          : `${pct(b.rate)} from ${formatAUD(b.min)} to ${formatAUD(b.max)}`,
    )
    .join(", ");
const [, s2526, m2526] = TAX_BRACKETS_2025_26;
const [, s2627] = TAX_BRACKETS_2026_27;

export const TAX_BRACKET_HISTORY_FAQS: readonly FaqItem[] = [
  {
    q: "When did the Stage 3 tax cuts take effect?",
    a: `The revised Stage 3 tax cuts took effect on 1 July 2024, applying from FY2024-25 onwards. They lowered the 19% rate to ${pct(s2526.rate)}, replaced the 32.5% rate with ${pct(m2526.rate)} and extended that bracket to ${formatAUD(m2526.max)}, and raised the 45% threshold to ${formatAUD(TAX_BRACKETS_2025_26[4].min - 1)}. The original plan was significantly amended in January 2024, with the revised version receiving Royal Assent in March 2024.`,
  },
  {
    q: "What was the LMITO and when was it removed?",
    a: "The Low and Middle Income Tax Offset was a temporary offset worth up to $1,500 (in its final year). It applied from FY2018-19 to FY2021-22 and was claimed at lodgement. It was not extended beyond FY2021-22, so from FY2022-23 onwards taxpayers no longer received this reduction.",
  },
  {
    q: "How much do I save at $80,000 under Stage 3?",
    a: `At ${formatAUD(EXAMPLE)} taxable income, income tax (before the Medicare levy and offsets) dropped from ${formatAUD(before)} under the FY2023-24 rates to ${formatAUD(after)} in FY2024-25 — a saving of ${formatAUD(saving)} per year or about ${formatAUD(saving / 52)} per week. This comes from the lower 16% rate (previously 19%) on income from $18,201 to $45,000 and the lower 30% rate (previously 32.5%) on income from $45,001 to $80,000.`,
  },
  {
    q: "Have tax brackets changed for FY2025-26?",
    a: "No. The FY2025-26 tax brackets are identical to FY2024-25. The next change took effect on 1 July 2026 — see the FY2026-27 Tax Changes guide.",
    links: { "FY2026-27 Tax Changes guide": "/tax-changes-2026-27/" },
  },
  {
    q: "Have tax brackets changed for FY2026-27?",
    a: `Yes. From 1 July 2026 the second rate fell from ${pct(s2526.rate)} to ${pct(s2627.rate)}; the thresholds did not move. The FY2026-27 resident scale is ${scale(TAX_BRACKETS_2026_27)}.`,
  },
  {
    q: "What was the original Stage 3 plan?",
    a: "The original Stage 3 plan would have created a flat 30% rate for all income between $45,001 and $200,000, eliminating the 32.5% and 37% brackets entirely. This would have disproportionately benefited higher earners. The revised version retained progressive brackets while still delivering cuts across all income levels.",
  },
  {
    q: "What are the 4 stages of the Personal Income Tax Plan?",
    a: "The Personal Income Tax Plan was legislated in three stages, and the 1 July 2026 rate cut is often counted as a fourth. Stage 1 (FY2018-19) introduced the Low and Middle Income Tax Offset. Stage 2 (from FY2020-21) raised the top of the 19% bracket from $37,000 to $45,000 and the top of the 32.5% bracket from $90,000 to $120,000. Stage 3 (revised, from FY2024-25) cut the 19% rate to 16% and the 32.5% rate to 30%, instead of the original flat 30% rate from $45,001 to $200,000. The 1 July 2026 cut from 16% to 15% came later, under separate Cost of Living Tax Cuts legislation.",
  },
];
