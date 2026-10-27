import {
  LITO,
  MEDICARE_LEVY,
  NON_RESIDENT_TAX_BRACKETS,
  SITE_CONFIG,
  TAX_BRACKETS_2025_26,
  TAX_BRACKETS_2026_27,
  TAX_FREE_THRESHOLD,
  formatAUD,
  formatPercent,
} from "@/lib/constants";
import {
  LEGISLATED_CUT_2027_28,
  TAX_BRACKETS_2027_28,
  WHM_TAX_BRACKETS_2025_26,
  analyseIncome,
  nilTaxIncomeOnScale,
} from "@/lib/constants/tax-rates-reference";

// Shared by the page body and the FAQPage JSON-LD so the two cannot disagree.
// Every figure is derived from lib/constants; sources are cited there.

const FY = SITE_CONFIG.financialYear;
const PREV = SITE_CONFIG.previousFinancialYear;
const B = TAX_BRACKETS_2026_27;
const P = TAX_BRACKETS_2025_26;
const pct = (r: number) => formatPercent(r, 0);
const money = (n: number) => formatAUD(n);

/** Largest annual saving from the 1 July 2026 cut: the whole second band × 1 point. */
export const MAX_SAVING_2026_27 = Math.round((B[1].max - TAX_FREE_THRESHOLD) * (P[1].rate - B[1].rate));
/** Largest annual saving from the legislated 1 July 2027 cut. */
export const MAX_SAVING_2027_28 = Math.round((B[1].max - TAX_FREE_THRESHOLD) * (B[1].rate - TAX_BRACKETS_2027_28[1].rate));

const a100 = analyseIncome(100_000);
const a80 = analyseIncome(80_000);
const NIL = nilTaxIncomeOnScale(B);
const top = B[B.length - 1];
const thresholds = B.slice(0, -1).map((b) => money(b.max)).join(", ");

export const TAX_BRACKETS_FAQS: readonly { q: string; a: string }[] = [
  {
    q: `What are the Australian tax brackets for ${FY}?`,
    a: `For ${FY} (1 July 2026 to 30 June 2027) Australian residents pay: nil on the first ${money(B[0].max)}; ${pct(B[1].rate)} on income from ${money(B[1].min)} to ${money(B[1].max)}; ${pct(B[2].rate)} from ${money(B[2].min)} to ${money(B[2].max)}; ${pct(B[3].rate)} from ${money(B[3].min)} to ${money(B[3].max)}; and ${pct(top.rate)} on income over ${money(top.min - 1)}. The 2% Medicare levy is charged on top.`,
  },
  {
    q: `What are the tax thresholds for 2026?`,
    a: `The thresholds are ${thresholds}. They have not moved since 1 July 2024. What changed on 1 July 2026 is the rate on the second band, which fell from ${pct(P[1].rate)} to ${pct(B[1].rate)}. Income up to ${money(TAX_FREE_THRESHOLD)} is tax-free, and with the low income tax offset a resident pays no income tax up to ${money(NIL)}.`,
  },
  {
    q: `What were the tax brackets for ${PREV}?`,
    a: `For ${PREV}: nil to ${money(P[0].max)}; ${pct(P[1].rate)} to ${money(P[1].max)}; ${money(P[2].base)} plus ${pct(P[2].rate)} over ${money(P[1].max)}; ${money(P[3].base)} plus ${pct(P[3].rate)} over ${money(P[2].max)}; ${money(P[4].base)} plus ${pct(P[4].rate)} over ${money(P[3].max)}. Use these for the ${PREV} tax return you lodge in 2026.`,
  },
  {
    q: "How much tax do I pay on $100,000 in Australia?",
    a: `On a taxable income of $100,000 in ${FY} you pay ${money(a100.incomeTax)} income tax plus ${money(a100.medicareLevy)} Medicare levy, ${money(a100.totalTax)} in total. That is an average rate of ${formatPercent(a100.averageTotalRate)}, although your marginal rate is ${pct(a100.bracketRate)} (${pct(a100.marginalWithMedicare)} with Medicare). Take-home is ${money(a100.takeHome)} a year.`,
  },
  {
    q: "What is my marginal tax rate?",
    a: `Your marginal tax rate is the rate on your last (and next) dollar of taxable income: the rate of the bracket your income finishes in. In ${FY} it is 0%, ${pct(B[1].rate)}, ${pct(B[2].rate)}, ${pct(B[3].rate)} or ${pct(top.rate)}, or 2 points more once you add the Medicare levy. Between ${money(LITO.fullOffsetCeiling)} and ${money(LITO.nilOffsetIncome)} the low income tax offset is being withdrawn, so each extra dollar actually costs more than the bracket rate.`,
  },
  {
    q: "What is the difference between marginal and average tax rate?",
    a: `The marginal rate applies only to income inside your top bracket. The average (effective) rate is total tax divided by total income, and it is always lower. On $80,000 in ${FY} the marginal rate is ${pct(a80.bracketRate)} but the average income tax rate is ${formatPercent(a80.averageIncomeTaxRate)} (${formatPercent(a80.averageTotalRate)} including Medicare).`,
  },
  {
    q: "What is the highest tax rate in Australia?",
    a: `${pct(top.rate)} on taxable income over ${money(top.min - 1)}. With the 2% Medicare levy the top marginal rate is ${pct(top.rate + MEDICARE_LEVY.rate)}. A single person over ${money(MEDICARE_LEVY.surcharge.tier3.min - 1)} without private hospital cover also pays the Medicare levy surcharge at ${formatPercent(MEDICARE_LEVY.surcharge.tier3.rate)} (${FY} tiers).`,
  },
  {
    q: "Will a pay rise push me into a higher tax bracket and leave me worse off?",
    a: `No. Only the dollars above a threshold are taxed at the higher rate; everything below it is taxed exactly as before. A rise that takes you from ${money(B[2].max - 1_000)} to ${money(B[2].max + 1_000)} means $1,000 is taxed at ${pct(B[2].rate)} and $1,000 at ${pct(B[3].rate)}. You always keep more of a pay rise than you lose in tax.`,
  },
  {
    q: "Are the tax brackets changing in 2027?",
    a: `Yes. The ${LEGISLATED_CUT_2027_28.act} (${LEGISLATED_CUT_2027_28.actNumber}) cuts the ${pct(B[1].rate)} rate to ${pct(TAX_BRACKETS_2027_28[1].rate)} from ${LEGISLATED_CUT_2027_28.effectiveDate}. The thresholds stay the same, so anyone earning over ${money(B[1].max)} saves ${money(MAX_SAVING_2027_28)} a year compared with ${FY}.`,
  },
  {
    q: "Do the tax brackets include the Medicare levy?",
    a: `No. The ATO's rates do not include the 2% Medicare levy, which is worked out separately on your whole taxable income. Low-income earners pay a reduced levy or none: for a single person the levy starts above ${money(MEDICARE_LEVY.lowIncomeThreshold)} (the ATO's latest published threshold, for ${PREV}).`,
  },
  {
    q: "Do non-residents and working holiday makers use these brackets?",
    a: `No. Foreign residents pay ${pct(NON_RESIDENT_TAX_BRACKETS[0].rate)} from the first dollar up to ${money(NON_RESIDENT_TAX_BRACKETS[0].max)} with no tax-free threshold, no low income tax offset and no Medicare levy. Working holiday makers on visa subclass 417 or 462 pay ${pct(WHM_TAX_BRACKETS_2025_26[0].rate)} on the first ${money(WHM_TAX_BRACKETS_2025_26[0].max)}, then the same rates as foreign residents.`,
  },
];
