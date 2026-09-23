// Server-safe content helpers for the payroll tax cluster. FAQ text lives here
// (not in a "use client" module) so the page.tsx files can build FAQPage
// JSON-LD from exactly the same strings the pages render.

import { formatAUD } from "@/lib/constants";
import {
  PAYROLL_TAX_FY,
  PAYROLL_TAX_STATE_CODES,
  PAYROLL_TAX_STATES,
  calculatePayrollTax,
  type PayrollTaxResult,
  type PayrollTaxStateCode,
} from "@/lib/constants/payroll-tax";
import { millions, pctTrim } from "./format";

export interface Faq {
  q: string;
  a: string;
}

/** Wage bills used in each state's worked-example table (single-state employer). */
export const EXAMPLE_BILLS = [1_500_000, 3_000_000, 5_000_000, 10_000_000] as const;

/** Interstate example: $2m in the state out of $5m Australia-wide. */
export const INTERSTATE_EXAMPLE = { stateWages: 2_000_000, australianWages: 5_000_000 } as const;

export function exampleRows(code: PayrollTaxStateCode): PayrollTaxResult[] {
  return EXAMPLE_BILLS.map((w) => calculatePayrollTax({ state: code, stateWages: w }));
}

export function interstateExample(code: PayrollTaxStateCode): PayrollTaxResult {
  return calculatePayrollTax({ state: code, ...INTERSTATE_EXAMPLE });
}

/** The payroll tax on a $3m single-state wage bill in every state, sorted high to low. */
export function comparisonAt(wages: number) {
  return PAYROLL_TAX_STATE_CODES.map((c) => ({ code: c, r: calculatePayrollTax({ state: c, stateWages: wages }) })).sort(
    (a, b) => b.r.total - a.r.total,
  );
}

export function stateFaqs(code: PayrollTaxStateCode): Faq[] {
  const s = PAYROLL_TAX_STATES[code];
  const ex = calculatePayrollTax({ state: code, stateWages: 3_000_000 });
  return [
    {
      q: `What is the ${s.abbr} payroll tax rate for ${PAYROLL_TAX_FY}?`,
      a: s.rateSummary,
    },
    {
      q: `What is the ${s.abbr} payroll tax threshold?`,
      a: `${formatAUD(s.annualThreshold)} a year of Australian taxable wages; the monthly figure is ${s.monthlyThresholdText}. ${s.thresholdSummary}`,
    },
    {
      q: `How much ${s.abbr} payroll tax is payable on a $3 million wage bill?`,
      a: `For an employer paying ${formatAUD(3_000_000)} of taxable wages, all in ${s.name}, for the full ${PAYROLL_TAX_FY} year: the threshold or deduction is ${formatAUD(ex.deduction)}, leaving ${formatAUD(ex.taxableWages)} taxed, and the payroll tax is ${formatAUD(ex.total)} (${pctTrim(ex.effectiveRate, 2)} of the wage bill).`,
    },
    {
      q: `When do I have to register for ${s.abbr} payroll tax?`,
      a: s.registration,
    },
    {
      q: `When is ${s.abbr} payroll tax due?`,
      a: `Monthly returns: ${s.monthlyDue} Annual return for ${PAYROLL_TAX_FY}: ${s.annualDue}.`,
    },
    {
      q: `Does ${s.abbr} payroll tax come out of an employee's pay?`,
      a: `No. Payroll tax is paid by the employer to the ${s.revenueOffice} on top of wages. It is not withheld from pay and does not appear on a payslip, so it does not change an employee's take-home pay.`,
    },
  ];
}

export const CALCULATOR_FAQS: Faq[] = [
  {
    q: "How is payroll tax calculated?",
    a: "Take the taxable wages you paid in the state, subtract the threshold or deduction you are entitled to (reduced for interstate wages, and in VIC, QLD, WA and NT for larger payrolls), then multiply what is left by the state's rate. Victoria and Queensland add a surcharge or levy once Australian wages pass $10 million.",
  },
  {
    q: "Do employees pay payroll tax?",
    a: "No. Payroll tax is a state and territory tax on employers. Nothing is deducted from an employee's pay for it.",
  },
  {
    q: "Is superannuation included in payroll tax?",
    a: "Yes. Employer super contributions count as taxable wages in every state, alongside salaries, bonuses, commissions, allowances, director's fees and fringe benefits. Many payments to contractors count too unless an exemption applies.",
  },
  {
    q: "What if my business pays wages in more than one state?",
    a: "You register and pay in each state where you pay wages, and each state gives you only its share of its threshold: the threshold multiplied by that state's wages divided by your total Australian wages. Whether you are over a threshold at all is tested on your total Australian wages.",
  },
  {
    q: "What is payroll tax grouping?",
    a: "Related businesses — for example companies that are related corporations, businesses under common control, or businesses that share employees — are grouped. The group's wages are added together to test the threshold, and only one member, the designated group employer, claims it.",
  },
  {
    q: "Which state has the highest payroll tax threshold?",
    a: `The Northern Territory at ${formatAUD(PAYROLL_TAX_STATES.nt.annualThreshold)}, although it tapers away completely at $7.5 million. Victoria and Western Australia have the lowest, at ${formatAUD(PAYROLL_TAX_STATES.vic.annualThreshold)}.`,
  },
];

export const HUB_FAQS: Faq[] = [
  {
    q: "What is payroll tax?",
    a: "A state and territory tax on the wages employers pay. Each state sets its own rate and tax-free threshold, and only employers whose total Australian wages (including any group they belong to) exceed the threshold pay it.",
  },
  ...CALCULATOR_FAQS.slice(1, 5),
  {
    q: "Which state has the lowest payroll tax?",
    a: lowestAnswer(),
  },
];

function lowestAnswer(): string {
  const at = (w: number) => comparisonAt(w);
  const low10 = at(10_000_000).slice(-1)[0];
  const high10 = at(10_000_000)[0];
  const nil15 = at(1_500_000)
    .filter((x) => x.r.total === 0)
    .map((x) => PAYROLL_TAX_STATES[x.code].abbr);
  return `It depends on the size of the payroll, because thresholds, tapers and rates interact. On a $1.5 million wage bill paid in one state, ${nil15.join(", ")} charge nothing. On $10 million, ${PAYROLL_TAX_STATES[low10.code].name} is cheapest (${formatAUD(low10.r.total)}) and ${PAYROLL_TAX_STATES[high10.code].name} the most expensive (${formatAUD(high10.r.total)}), before any regional concession.`;
}

/** "$1.5m" style labels for the example table. */
export const billLabel = millions;
