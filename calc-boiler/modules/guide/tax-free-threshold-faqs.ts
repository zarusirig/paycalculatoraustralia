import { LITO, MEDICARE_LEVY, SITE_CONFIG, TAX_FREE_THRESHOLD, formatAUD } from "@/lib/constants";
import { MEDICARE_LEVY_INCOME_YEAR } from "@/lib/constants/medicare-levy-extra";
import {
  PART_YEAR_TFT,
  TFT_PER_PERIOD,
  effectiveNilTaxIncome,
  tftWithholdingRow,
} from "@/lib/constants/tax-free-threshold";

// Shared by the page body and the FAQPage JSON-LD so the two cannot disagree.
// Every figure is derived from lib/constants; sources are cited there.

const T = formatAUD(TAX_FREE_THRESHOLD);
const NIL = formatAUD(effectiveNilTaxIncome());
const FY = SITE_CONFIG.financialYear;
const w900 = tftWithholdingRow(900, "weekly");

export const TAX_FREE_THRESHOLD_FAQS: readonly { q: string; a: string }[] = [
  {
    q: `What is the tax-free threshold for ${FY}?`,
    a: `${T}. It has been ${T} since 1 July 2012 and is unchanged for ${FY}. Australian residents pay no income tax on the first ${T} of taxable income, which works out to ${formatAUD(TFT_PER_PERIOD.weekly)} a week, ${formatAUD(TFT_PER_PERIOD.fortnightly)} a fortnight or about ${formatAUD(TFT_PER_PERIOD.monthly)} a month.`,
  },
  {
    q: "How much can I earn before paying tax in Australia?",
    a: `${T} is the tax-free threshold, but the low income tax offset (up to ${formatAUD(LITO.maxOffset)}) cancels the tax on the next slice of income too. At the ${FY} rates a resident pays no income tax up to ${NIL}. The Medicare levy is separate: it starts above ${formatAUD(MEDICARE_LEVY.lowIncomeThreshold)} for a single person (the ATO's latest published threshold, for ${MEDICARE_LEVY_INCOME_YEAR}).`,
  },
  {
    q: "Should I claim the tax-free threshold?",
    a: `Yes, if you are an Australian resident for tax purposes and this is your only job, or your highest-paying one. If someone else is also paying you at the same time, claim it from one payer only, usually the one that pays the most. The exception: if you're certain your total income from all payers will be ${T} or less, you can claim it from each.`,
  },
  {
    q: "Can I claim the tax-free threshold on two jobs?",
    a: `Generally no. Claim it on one job and answer "No" on the other, which then withholds at the higher "no tax-free threshold" rate. Claiming it twice means too little tax is withheld, and the ATO collects the shortfall as a bill when you lodge. The only exception is where your total income from every payer will be ${T} or less for the year.`,
  },
  {
    q: "What happens if I don't claim the tax-free threshold?",
    a: `Your employer withholds more tax each pay. On ${formatAUD(900)} a week that is ${formatAUD(w900.notClaimed)} instead of ${formatAUD(w900.claimed)} — ${formatAUD(w900.difference)} more a week. The money isn't lost: when you lodge your return the ATO applies the threshold anyway and refunds any tax overpaid.`,
  },
  {
    q: "Do I get the tax-free threshold if I arrived in Australia part-way through the year?",
    a: `You get a part-year threshold instead: a flat ${formatAUD(PART_YEAR_TFT.flat)} plus up to ${formatAUD(PART_YEAR_TFT.proRata)} pro-rated by the months you were a resident, counting the month you arrived. Someone resident for 6 months gets ${formatAUD(PART_YEAR_TFT.flat + PART_YEAR_TFT.proRata / 2)}.`,
  },
  {
    q: "Can working holiday makers or non-residents claim the tax-free threshold?",
    a: "Generally no. A foreign resident for the whole year pays tax from the first dollar; the only exception on the TFN declaration is a foreign resident receiving an Australian Government pension or allowance, who can claim it from that payer. Working holiday makers on visa subclass 417 or 462 must answer No: they pay 15% from the first dollar on their working holiday income.",
  },
  {
    q: "Is the tax-free threshold the same as the Medicare levy threshold?",
    a: `No. The tax-free threshold (${T}) applies to income tax. The Medicare levy has its own low-income threshold of ${formatAUD(MEDICARE_LEVY.lowIncomeThreshold)} for singles (${MEDICARE_LEVY_INCOME_YEAR}, the latest the ATO has published), with a shade-in above it. For a single person with no other offsets, income between ${NIL} and ${formatAUD(MEDICARE_LEVY.lowIncomeThreshold)} attracts income tax but no Medicare levy.`,
  },
];
