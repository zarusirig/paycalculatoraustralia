// Shared FAQ copy for /stage-3-tax-cuts/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in app/stage-3-tax-cuts/page.tsx, so the
// structured data cannot drift from the page.
//
// Savings are computed, not typed: the revised Stage 3 scale is
// TAX_BRACKETS_2025_26 (identical rates for 2024-25 and 2025-26). The 2023-24
// scale and the original (legislated 2019) Stage 3 plan exist nowhere else in
// lib/constants, so they are defined here as historical reference scales.

import { TAX_BRACKETS, TAX_BRACKETS_2025_26, TAX_FREE_THRESHOLD, TAX_HISTORY, formatAUD, type TaxBracket } from "@/lib/constants";
import { CONTRIBUTIONS_TAX_RATE } from "@/lib/constants/super-contributions";
import { LEGISLATED_CUT_2027_28, taxOnScale } from "@/lib/constants/tax-rates-reference";
import type { FaqItem } from "@/lib/faq";

/** FY2023-24 resident scale (ATO), the baseline Stage 3 is measured against. */
const SCALE_2023_24: readonly TaxBracket[] = [
  { min: 0, max: 18_200, rate: 0, base: 0, label: "Tax-free threshold" },
  { min: 18_201, max: 45_000, rate: 0.19, base: 0, label: "19c for each $1 over $18,200" },
  { min: 45_001, max: 120_000, rate: 0.325, base: 5_092, label: "32.5c for each $1 over $45,000" },
  { min: 120_001, max: 180_000, rate: 0.37, base: 29_467, label: "37c for each $1 over $120,000" },
  { min: 180_001, max: Infinity, rate: 0.45, base: 51_667, label: "45c for each $1 over $180,000" },
];

/** The original Stage 3 plan (legislated 2019, replaced before it started). */
const SCALE_ORIGINAL_STAGE_3: readonly TaxBracket[] = [
  { min: 0, max: 18_200, rate: 0, base: 0, label: "Tax-free threshold" },
  { min: 18_201, max: 45_000, rate: 0.19, base: 0, label: "19c for each $1 over $18,200" },
  { min: 45_001, max: 200_000, rate: 0.30, base: 5_092, label: "30c for each $1 over $45,000" },
  { min: 200_001, max: Infinity, rate: 0.45, base: 51_592, label: "45c for each $1 over $200,000" },
];

const REVISED = TAX_BRACKETS_2025_26;
const saving = (income: number, scale: readonly TaxBracket[] = REVISED) =>
  Math.round(taxOnScale(income, SCALE_2023_24) - taxOnScale(income, scale));
const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const pts = (r: number) => `${Math.round(r * 1000) / 10} percentage point`;

// Income above which the original plan would have given the bigger cut.
let crossover = 45_000;
while (saving(crossover) >= saving(crossover, SCALE_ORIGINAL_STAGE_3)) crossover += 1_000;
const CROSSOVER = Math.round(crossover / 1_000) * 1_000;

const OLD_LOW = SCALE_2023_24[1];
const OLD_MID = SCALE_2023_24[2];
const NEW_LOW = REVISED[1];
const NEW_MID = REVISED[2];
const LOW_CUT = OLD_LOW.rate - NEW_LOW.rate;
const MID_CUT = OLD_MID.rate - NEW_MID.rate;
const SACRIFICE = 10_000;

export const STAGE_3_FAQS: readonly FaqItem[] = [
  {
    q: "When did the Stage 3 tax cuts start?",
    a: `The revised Stage 3 tax cuts took effect on ${TAX_HISTORY.stage3TaxCuts.effectiveDate}, applying from FY2024-25 onwards. If you are employed, your employer should have adjusted your PAYG withholding from your first pay in July 2024. The same rates continued in FY2025-26, and from ${TAX_HISTORY.upcomingFY2026_27.effectiveDate} the ${pct(NEW_LOW.rate)} rate fell to ${pct(TAX_BRACKETS[1].rate)}.`,
  },
  {
    q: "How much do the Stage 3 tax cuts save me?",
    a: `Every taxpayer earning above ${formatAUD(TAX_FREE_THRESHOLD)} receives a tax cut under the revised plan, starting at ${Math.round(LOW_CUT * 100)}c for each dollar over ${formatAUD(TAX_FREE_THRESHOLD)}. Compared with FY2023-24 rates, at $30,000 you save ${formatAUD(saving(30_000))}, at $50,000 you save ${formatAUD(saving(50_000))}, at $100,000 you save ${formatAUD(saving(100_000))}, and at $190,000+ you save ${formatAUD(saving(190_000))}. The ${pct(NEW_LOW.rate)} to ${pct(TAX_BRACKETS[1].rate)} cut from ${TAX_HISTORY.upcomingFY2026_27.effectiveDate} adds up to ${formatAUD((TAX_BRACKETS[1].max - TAX_BRACKETS[1].min + 1) * (NEW_LOW.rate - TAX_BRACKETS[1].rate))} more. The exact saving depends on your taxable income — use the comparison table above or our Income Tax Calculator.`,
    links: { "Income Tax Calculator": "/income-tax-calculator/" },
  },
  {
    q: "Do I need to do anything to receive the tax cuts?",
    a: "No. The tax cuts are automatic. Your employer updates their payroll software to use the new PAYG withholding tables, and you receive more take-home pay each pay period. No forms to fill out, no application required.",
  },
  {
    q: "Am I better or worse off under the revised plan vs the original?",
    a: `Taxpayers earning under approximately ${formatAUD(CROSSOVER)} are better off under the revised plan. Those earning above ${formatAUD(CROSSOVER)} receive a smaller tax cut than the original plan would have delivered. The maximum difference is at $200,000, where the original plan would have saved ${formatAUD(saving(200_000, SCALE_ORIGINAL_STAGE_3))} compared to ${formatAUD(saving(200_000))} under the revised plan.`,
  },
  {
    q: "What happened to the 32.5% tax rate?",
    a: `The ${pct(OLD_MID.rate)} rate was abolished under both the original and revised Stage 3 plans. It was replaced by a ${pct(NEW_MID.rate)} rate. Under the revised plan, the ${pct(NEW_MID.rate)} rate applies from ${formatAUD(NEW_MID.min)} to ${formatAUD(NEW_MID.max)}. The ${pts(MID_CUT)} reduction is worth up to ${formatAUD((OLD_MID.max - OLD_MID.min + 1) * MID_CUT)} across the old ${formatAUD(OLD_MID.min)}–${formatAUD(OLD_MID.max)} band, and income from ${formatAUD(OLD_MID.max + 1)} to ${formatAUD(NEW_MID.max)} dropped from the ${pct(SCALE_2023_24[3].rate)} rate to ${pct(NEW_MID.rate)}.`,
  },
  {
    q: "Why was the 19% rate reduced to 16%?",
    a: `The government reduced the bottom marginal rate to deliver tax relief to all taxpayers, including those earning between ${formatAUD(NEW_LOW.min)} and ${formatAUD(NEW_LOW.max)} who would have received no benefit under the original Stage 3 plan. The ${pts(LOW_CUT)} cut saves up to ${formatAUD((NEW_LOW.max - NEW_LOW.min + 1) * LOW_CUT)} per year for this group.`,
  },
  {
    q: "Are there more tax changes coming?",
    a: `Yes. The ${pct(NEW_LOW.rate)} rate fell to ${pct(LEGISLATED_CUT_2027_28.fromRate)} on ${TAX_HISTORY.upcomingFY2026_27.effectiveDate} — read our news coverage of the next tax cut from 1 July 2026 for what it means for your pay — and a further legislated cut lowers it to ${pct(LEGISLATED_CUT_2027_28.toRate)} from ${LEGISLATED_CUT_2027_28.effectiveDate}. Check our Tax Changes 2026-27 Guide for the latest announced changes and our Tax Brackets Guide for the current rates.`,
    links: {
      "next tax cut from 1 July 2026": "/news/tax-cut-july-2026/",
      "Tax Changes 2026-27 Guide": "/tax-changes-2026-27/",
      "Tax Brackets Guide": "/tax-brackets/",
    },
  },
  {
    q: "Do the Stage 3 cuts affect superannuation?",
    a: `Not directly. Superannuation contributions continue to be taxed at ${pct(CONTRIBUTIONS_TAX_RATE)} in the fund. However, the Stage 3 cuts change the tax savings from salary sacrifice. At the ${pct(NEW_MID.rate)} marginal rate, sacrificing ${formatAUD(SACRIFICE)} into super saves ${formatAUD(SACRIFICE * (NEW_MID.rate - CONTRIBUTIONS_TAX_RATE))} (${pct(NEW_MID.rate)} minus ${pct(CONTRIBUTIONS_TAX_RATE)}). Under the old ${pct(OLD_MID.rate)} rate, the same sacrifice saved ${formatAUD(SACRIFICE * (OLD_MID.rate - CONTRIBUTIONS_TAX_RATE))}. The cuts slightly reduce the tax advantage of salary sacrifice for incomes between ${formatAUD(NEW_MID.min)} and ${formatAUD(NEW_MID.max)}.`,
  },
];
