// Shared FAQ copy for /tax-return-2026/ — read by the rendered accordion and
// the FAQPage JSON-LD. Dates and rates come from
// lib/constants/tax-return-2025-26.ts (sources cited there, verified
// 23 Sep 2026) and TAX_BRACKETS_2025_26.

import { formatAUD } from "@/lib/constants";
import { HECS_HELP_2025_26, TAX_BRACKETS_2025_26 } from "@/lib/constants/australian-tax";
import { RETURN_2026, estimateReturn2025_26 } from "@/lib/constants/tax-return-2025-26";

const R = RETURN_2026;
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
    a: `For ${R.incomeYear}, residents pay nothing on the first $18,200, then ${TAX_BRACKETS_2025_26[1].rate * 100}% up to $45,000, ${TAX_BRACKETS_2025_26[2].rate * 100}% up to $135,000, ${TAX_BRACKETS_2025_26[3].rate * 100}% up to $190,000 and ${TAX_BRACKETS_2025_26[4].rate * 100}% above that, plus the 2% Medicare levy. On a taxable income of ${formatAUD(80_000)}, that works out to ${formatAUD(EX.incomeTax)} income tax plus ${formatAUD(EX.medicareLevy)} Medicare levy.`,
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
    a: `The tax rates changed on 1 July 2026. The second bracket fell from 16% to 15%. Your 2026 return uses the older ${R.incomeYear} rates, so a calculator set to 2026-27 will show slightly less tax, up to $268 less, than your return actually works out.`,
  },
];
