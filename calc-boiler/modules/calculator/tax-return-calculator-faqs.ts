// Shared FAQ copy for /tax-return-calculator/ — read by the rendered accordion
// and the FAQPage JSON-LD so the two can never disagree. Every figure comes
// from lib/constants (sources cited there): RETURN_2026 and the 2025-26
// engine in tax-return-2025-26.ts, the year switch in tax-return-estimator.ts,
// and the dates in tax-calendar-2026-27.ts.

import { formatAUD } from "@/lib/constants";
import { HECS_HELP_2025_26 } from "@/lib/constants/australian-tax";
import { MLS_2025_26_SINGLE, RETURN_2026, helpRepayment2025_26 } from "@/lib/constants/tax-return-2025-26";
import { RETURN_YEARS, estimateReturn } from "@/lib/constants/tax-return-estimator";
import { RETURN_DATES_2026, formatIso, weekdayOf } from "@/lib/constants/tax-calendar-2026-27";

const R = RETURN_2026;
const THIS = RETURN_YEARS["2025-26"];
const NEXT = RETURN_YEARS["2026-27"];
const pct = (r: number) => `${Math.round(r * 10_000) / 100}%`;

/** The worked example used in the FAQ, the page copy and the tests. */
export const EXAMPLE_INPUTS = {
  grossIncome: 85_000,
  deductions: 2_500,
  taxWithheld: 20_000,
  hasPrivateHospitalCover: true,
  hasStudyLoan: false,
} as const;
export const EXAMPLE_THIS_YEAR = estimateReturn("2025-26", EXAMPLE_INPUTS);
export const EXAMPLE_NEXT_YEAR = estimateReturn("2026-27", EXAMPLE_INPUTS);

const selfLodge = RETURN_DATES_2026.selfLodge;
const selfLodgeNote =
  selfLodge.effectiveIso !== selfLodge.iso
    ? ` It falls on a ${weekdayOf(selfLodge.iso)} this year, so the ATO accepts lodgment on the next business day, ${formatIso(selfLodge.effectiveIso, "long")}.`
    : "";

export const TAX_RETURN_CALCULATOR_FAQS: readonly { q: string; a: string }[] = [
  {
    q: "How much will my tax refund be?",
    a: `Your refund is the tax withheld from your pay minus the tax you actually owe for the year. For example, ${formatAUD(EXAMPLE_INPUTS.grossIncome)} of income, ${formatAUD(EXAMPLE_INPUTS.deductions)} of deductions and ${formatAUD(EXAMPLE_INPUTS.taxWithheld)} withheld gives an estimated ${THIS.incomeYear} refund of ${formatAUD(EXAMPLE_THIS_YEAR.refund)}. The same figures at ${NEXT.incomeYear} rates would show ${formatAUD(EXAMPLE_NEXT_YEAR.refund)}, which is why the calculator asks which year you are lodging for.`,
  },
  {
    q: "Which income year should I choose?",
    a: `Choose ${THIS.incomeYear} for the return you lodge now. It covers ${THIS.incomeYearStart} to ${THIS.incomeYearEnd} and is due ${R.selfLodgeDueDate} if you lodge it yourself, or usually ${R.agentDueDateMostPeople} through a registered tax agent. Choose ${NEXT.incomeYear} only to plan next year's return on the income you are earning now. That year's second tax rate is ${pct(NEXT.secondBracketRate)} instead of ${pct(THIS.secondBracketRate)}.`,
  },
  {
    q: "When will I get my tax refund?",
    a: `The ATO says most returns lodged online through myTax are processed in ${R.onlineProcessingBusinessDays} business days and most refunds are issued within ${R.onlineRefundTypical}. Paper returns take longer: most refunds are issued within ${R.paperRefundBusinessDays} business days. It can take longer if the ATO needs to check something, or if your refund is used to pay another debt.`,
  },
  {
    q: "What if I owe money to the ATO?",
    a: `If less tax was withheld than you owe, you get a bill with your notice of assessment. Common causes are two or more jobs, investment income with no tax withheld, or claiming the tax-free threshold from more than one employer. If you owe $200,000 or less, you may be able to set up a payment plan in ATO online services. The general interest charge keeps building until the debt is paid.`,
  },
  {
    q: "Does HECS-HELP reduce my tax refund?",
    a: `Yes. Your compulsory study loan repayment is added to your tax bill, so it reduces your refund dollar for dollar. For ${THIS.incomeYear}, repayments start above ${formatAUD(HECS_HELP_2025_26.minimumThreshold)} and are worked out only on income above that amount. At ${formatAUD(EXAMPLE_INPUTS.grossIncome)} the repayment is ${formatAUD(helpRepayment2025_26(EXAMPLE_INPUTS.grossIncome))}. For ${NEXT.incomeYear} the threshold rises to ${formatAUD(NEXT.studyLoanThreshold)}.`,
  },
  {
    q: "How does private health insurance affect my tax return?",
    a: `If you are single, earn more than ${formatAUD(THIS.mlsSinglesThreshold)} in ${THIS.incomeYear} and don't hold private hospital cover, you pay the Medicare levy surcharge of ${pct(MLS_2025_26_SINGLE[0].rate)} to ${pct(MLS_2025_26_SINGLE[2].rate)}, depending on your income. The singles threshold is ${formatAUD(NEXT.mlsSinglesThreshold)} for ${NEXT.incomeYear}. Family thresholds are higher. Having the right hospital cover for the whole year means you don't pay it.`,
  },
  {
    q: "Why do I owe tax when I have two jobs?",
    a: "Each employer works out withholding as if its job were your only income. Only one employer should apply the $18,200 tax-free threshold. If you claim it from both, too little tax is withheld and you get a bill at tax time. Claim the threshold from your main job only and tick \"no\" on the tax file number declaration for the others.",
  },
  {
    q: "Is it better to lodge my tax return early or wait?",
    a: `Wait until your income statement shows as "tax ready". The ATO says it has pre-filled most employer, bank, health fund and government information by ${R.prefillReady}. If you lodge before then, you risk missing income and having to amend your return. The ${THIS.incomeYear} self-lodgment deadline is ${R.selfLodgeDueDate}.${selfLodgeNote}`,
  },
];
