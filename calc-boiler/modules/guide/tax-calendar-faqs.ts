// The tax calendar FAQ: one array renders the visible questions (modules/guide/
// tax-calendar.tsx) and emits the FAQPage JSON-LD (app/tax-calendar/page.tsx),
// so the two cannot drift (npm run check:faq). Every date and amount comes from
// lib/constants/tax-calendar-2026-27.ts, tax-return-2025-26.ts and
// australian-tax.ts — nothing is typed here.
import type { FaqItem } from "@/lib/faq";
import { formatAUD } from "@/lib/constants";
import { SUPER_GUARANTEE, SUPER_GUARANTEE_CHARGE } from "@/lib/constants/australian-tax";
import { RETURN_2026 } from "@/lib/constants/tax-return-2025-26";
import { CALENDAR_YEAR, FTL_MAX_INDIVIDUAL, PENALTY_UNIT, QUARTERS_2026_27, RETURN_DATES_2026, formatIso } from "@/lib/constants/tax-calendar-2026-27";

const R = RETURN_2026;
const Y = CALENDAR_YEAR;
const SGC = SUPER_GUARANTEE_CHARGE;
const q = QUARTERS_2026_27;
const self = RETURN_DATES_2026.selfLodge;
const pct = (r: number) => `${Math.round(r * 10_000) / 100}%`;

export const TAX_CALENDAR_FAQS: readonly FaqItem[] = [
  {
    q: "When does the Australian financial year start and end?",
    a: `The Australian financial (income) year runs from 1 July to 30 June. ${Y.incomeYear} started on ${Y.start} and ends on ${Y.end}. The return you lodge in 2026 is for ${R.incomeYear}, which ended on ${R.incomeYearEnd}.`,
  },
  {
    q: `When is the ${R.incomeYear} tax return due?`,
    a: `If you lodge it yourself, by ${R.selfLodgeDueDate}${self.effectiveIso !== self.iso ? ` — it falls on a weekend, so the ATO accepts it on ${formatIso(self.effectiveIso, "long")}` : ""}. With a registered tax agent, most people have until ${R.agentDueDateMostPeople} if they are on the agent's list by ${R.selfLodgeDueDate}.`,
  },
  {
    q: "Can I lodge my tax return before 14 July?",
    a: `Yes, you can lodge from 1 July, but it is safer to wait until your income statement shows as "tax ready". Employers have until 14 July to finalise it, and the ATO has most other pre-fill data by ${R.prefillReady}.`,
  },
  {
    q: "What is the penalty for not lodging a tax return?",
    a: `The ATO can charge a failure-to-lodge penalty of ${formatAUD(PENALTY_UNIT.amount)} for every ${PENALTY_UNIT.ftlDaysPerUnit} days or part of that the return is overdue, up to ${formatAUD(FTL_MAX_INDIVIDUAL)} (${PENALTY_UNIT.ftlMaxUnits} penalty units) for an individual. The ATO usually writes to you first.`,
  },
  {
    q: `When are quarterly BAS due in ${Y.incomeYear}?`,
    a: `Quarterly BAS is due on ${q.map((row) => formatIso(row.iso, "long")).join(", ")}.${q[1].effectiveIso !== q[1].iso ? ` The quarter 2 date falls on a Sunday and the next day is a public holiday in WA, so you can lodge and pay on ${formatIso(q[1].effectiveIso, "long")}.` : ""} Monthly BAS is due on the 21st of the following month. Lodging online may give you 2 extra weeks for quarters 1, 3 and 4.`,
  },
  {
    q: "Are there still quarterly super due dates?",
    a: `No. The last quarterly payment was due ${SGC.legacy.finalQuarterSGDue}, for April to June 2026. Since ${SUPER_GUARANTEE.paydaySuperStart}, super must reach the fund within ${SGC.current.businessDaysToPay} business days of each payday under Payday Super.`,
    links: { "Payday Super": "/payday-super/" },
  },
  {
    q: "What happens if my employer pays super late?",
    a: `They are liable for the Super Guarantee Charge. From ${SUPER_GUARANTEE.paydaySuperStart}, it is made up of the shortfall, notional earnings at the general interest charge rate compounded daily, an administrative uplift of up to ${pct(SGC.current.administrativeUpliftMax)}, and a choice loading where it applies. The charge is now tax-deductible. For earnings paid up to 30 June 2026 the old quarterly rules still apply.`,
  },
  {
    q: "How long does the ATO take to process a tax refund?",
    a: `The ATO says most myTax returns are processed in ${R.onlineProcessingBusinessDays} business days and most refunds are issued within ${R.onlineRefundTypical}. For paper returns, most refunds are issued within ${R.paperRefundBusinessDays} business days. It takes longer if the ATO needs to check your return.`,
  },
  {
    q: "Do PAYG instalments reduce my end-of-year tax bill?",
    a: "Yes. PAYG instalments are prepayments of your expected tax. They are credited against your final assessment, so you usually get a smaller bill, or a refund, when you lodge.",
  },
  {
    q: `What is the maximum super contribution base for ${Y.incomeYear}?`,
    a: `It is ${formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} for the year. Under Payday Super it became an annual figure instead of a quarterly one. Employers don't have to pay SG on qualifying earnings above it, so the most SG owed for one employee is ${formatAUD(SUPER_GUARANTEE.maxSGAnnual, 2)}.`,
  },
  {
    q: `What is the concessional super contributions cap for ${Y.incomeYear}?`,
    a: `The concessional (before-tax) cap is ${formatAUD(SUPER_GUARANTEE.concessionalCap)}. It includes employer SG, salary sacrifice and personal contributions you claim a deduction for. Contributions above the cap are added to your income and taxed at your marginal rate.`,
  },
];
