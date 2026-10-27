// Shared FAQ copy for /tax-return-2026/ — read by the rendered accordion and
// the FAQPage JSON-LD. Dates and rates come from
// lib/constants/tax-return-2025-26.ts (sources cited there, verified
// 23 Sep 2026) and TAX_BRACKETS_2025_26.

import { formatAUD, formatPercent } from "@/lib/constants";
import { HECS_HELP_2025_26, MEDICARE_LEVY, TAX_BRACKETS_2025_26, TAX_BRACKETS_2026_27, TAX_FREE_THRESHOLD } from "@/lib/constants/australian-tax";
import { RETURN_2026, estimateReturn2025_26 } from "@/lib/constants/tax-return-2025-26";

const R = RETURN_2026;
const B = TAX_BRACKETS_2025_26;
const pc = (rate: number) => formatPercent(rate, 0);
// Largest gap between the 2025-26 and 2026-27 scales: the second-bracket rate cut across the whole bracket.
const MAX_SCALE_GAP = Math.round((B[1].rate - TAX_BRACKETS_2026_27[1].rate) * (B[1].max - TAX_FREE_THRESHOLD));
const EX = estimateReturn2025_26({ grossIncome: 80_000, deductions: 0, taxWithheld: 0, hasPrivateHospitalCover: true, hasStudyLoan: false });

export const TAX_RETURN_2026_FAQS: readonly { q: string; a: string }[] = [
  {
    q: "When is the tax return deadline in 2026?",
    a: `If you lodge your own return, the deadline is ${R.selfLodgeDueDate}. It covers the ${R.incomeYear} income year (${R.incomeYearStart} to ${R.incomeYearEnd}). If you use a registered tax agent, you usually get until ${R.agentDueDateMostPeople}. To get that later date you need to be on the agent's client list before ${R.selfLodgeDueDate}.`,
  },
  {
    q: "What year does my 2026 tax return cover?",
    a: `The "2026 tax return" covers the ${R.incomeYear} financial year, from ${R.incomeYearStart} to ${R.incomeYearEnd}. The ATO calls it the 2026 return because the year ends in 2026. Income you earn from 1 July 2026 goes in next year's return.`,
  },
  {
    q: "How much tax will I pay on my 2025-26 income?",
    a: `For ${R.incomeYear}, residents pay nothing on the first ${formatAUD(TAX_FREE_THRESHOLD)}, then ${pc(B[1].rate)} up to ${formatAUD(B[1].max)}, ${pc(B[2].rate)} up to ${formatAUD(B[2].max)}, ${pc(B[3].rate)} up to ${formatAUD(B[3].max)} and ${pc(B[4].rate)} above that, plus the ${pc(MEDICARE_LEVY.rate)} Medicare levy. On a taxable income of ${formatAUD(80_000)}, that works out to ${formatAUD(EX.incomeTax)} income tax plus ${formatAUD(EX.medicareLevy)} Medicare levy.`,
  },
  {
    q: "How long does a tax refund take in 2026?",
    a: `The ATO says most returns lodged online with myTax are processed in ${R.onlineProcessingBusinessDays} business days, and most refunds are issued within ${R.onlineRefundTypical}. Paper returns take longer: most refunds are issued within ${R.paperRefundBusinessDays} business days. You can track your return in ATO online services through myGov or in the ATO app.`,
  },
  {
    q: "When should I lodge my 2026 tax return?",
    a: `You can lodge from 1 July, but the ATO pre-fills most employer, bank, health fund and government information by ${R.prefillReady}. If you wait until then, your return is less likely to need an amendment.`,
  },
  {
    q: "What is the working from home rate for 2025-26?",
    a: `The fixed rate method is ${R.wfhFixedRateCents} cents for each hour you work from home in ${R.incomeYear}, the same as 2024-25. You need a record of your actual hours for the whole year. An estimate is not accepted.`,
  },
  {
    q: "Does the 20% HECS cut change my 2026 tax return?",
    a: `The one-off ${R.helpReductionPercent}% reduction applied to study loan debts as at ${R.helpReductionDebtsAsAt}, and the ATO has finished processing it. Separately, from ${R.incomeYear} compulsory repayments only apply above ${formatAUD(HECS_HELP_2025_26.minimumThreshold)} of repayment income. The repayment is also worked out only on the income above that threshold, so many people repay less on this return.`,
  },
  {
    q: "Why is my 2026 refund different from a 2026-27 tax calculator?",
    a: `The tax rates changed on 1 July 2026. The second bracket fell from ${pc(B[1].rate)} to ${pc(TAX_BRACKETS_2026_27[1].rate)}. Your 2026 return uses the older ${R.incomeYear} rates, so a calculator set to 2026-27 will show slightly less tax, up to ${formatAUD(MAX_SCALE_GAP)} less, than your return actually works out.`,
  },
  {
    q: "Do I need to lodge a tax return for 2025-26?",
    a: `You do if any of the ATO's reasons to lodge apply to you. The ATO says you must lodge if you were an Australian resident and had tax withheld from your pay or paid tax in instalments during ${R.incomeYear}. You also must lodge if your taxable income was above ${formatAUD(TAX_FREE_THRESHOLD)} as a resident for the full year, you carried on a business, you made a loss, or you had reportable fringe benefits or reportable employer super contributions on your income statement. If none of the ATO's reasons apply you can lodge a non-lodgment advice instead. The ATO's "Do I need to lodge a tax return?" tool, in ATO online services or on its website, works it out from your own details.`,
  },
  {
    q: "Should I lodge a tax return if I earned under $18,200?",
    a: `Often yes. If tax was withheld from your pay during ${R.incomeYear}, the ATO lists that as a reason to lodge, and lodging is how you get the withheld tax back as a refund. Income under the tax-free threshold of ${formatAUD(TAX_FREE_THRESHOLD)} for a full-year resident is not taxed, so a refund is likely. Different thresholds apply to people under 18 with income that is not salary or wages ($416), part-year residents and foreign residents, so check the ATO tool.`,
  },
  {
    q: "How do I lodge my tax return?",
    a: `You can lodge online with myTax. Link the ATO to your myGov account, sign in, check the pre-filled employer, bank, health fund and government information, add your deductions, then submit and keep the confirmation. Or use a registered tax agent. Paper returns are possible but slower: most refunds issue within ${R.paperRefundBusinessDays} business days.`,
  },
  {
    q: "When do I have to lodge my tax return?",
    a: `If you lodge yourself, your tax return is due by ${R.selfLodgeDueDate} for the ${R.incomeYear} year. With a registered tax agent you usually get until ${R.agentDueDateMostPeople}, provided you are on the agent's client list by ${R.selfLodgeDueDate}. Some agent clients have an earlier date (${R.agentDueDateLargeLiability} if the latest return had a tax liability of ${formatAUD(R.agentLargeLiabilityThreshold)} or more, or ${R.selfLodgeDueDate} if a prior-year return was outstanding at ${R.incomeYearEnd}). You can lodge any time from 1 July, and the ATO says it pre-fills most information by ${R.prefillReady}.`,
  },
];
