// Shared FAQ copy for /take-home-pay-on/[salary]/ — rendered by the
// TakeHomePayOnSalary accordion and turned into FAQPage JSON-LD by the page,
// so the structured data cannot drift from the visible answers.
//
// Oct 2026: three or four questions whose answers depend on the salary, and
// the questions themselves change with the band (lib/data/salary-pages/
// take-home-sections.ts): tax, hours and who earns it full-time at low
// salaries; HECS-HELP, salary sacrifice and jobs in the middle; the surcharge,
// Division 293 and jobs at the top. The take-home figures themselves are in
// the hero and the breakdown table, so no question restates them.

import { formatAUD, LITO, SITE_CONFIG, TAX_BRACKETS, TAX_BRACKETS_2025_26 } from "@/lib/constants/australian-tax";
import { salaryFacts } from "@/lib/data/salary-pages";
import {
  apprenticesOnPage,
  div293Effect,
  hoursRows,
  jobsOnPage,
  lowIncomeHelp,
  minimumWageOnPage,
  mlsEffect,
  sacrificeEffect,
  takeHomeBand,
  yearChange,
  type PublicPayOnPage,
} from "@/lib/data/salary-pages/take-home-sections";
import { groupName } from "@/lib/data/occupation-medians";
import type { FaqItem } from "@/lib/faq";

const pct = (r: number, d = 1) => `${Number((r * 100).toFixed(d))}%`;
const money2 = (v: number) => formatAUD(v, 2);

function list(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function yearFaq(salary: number): FaqItem {
  const s = formatAUD(salary);
  const y = yearChange(salary);
  return {
    q: `How much more is ${s} after tax than last year?`,
    a:
      y.change === 0
        ? `Nothing: no income tax is payable on ${s} in ${y.lastYear} or ${SITE_CONFIG.financialYear}.`
        : `${formatAUD(y.change)} a year (${money2(y.changeFortnight)} a fortnight), because the ${pct(TAX_BRACKETS_2025_26[1].rate, 0)} rate fell to ${pct(TAX_BRACKETS[1].rate, 0)} on 1 July 2026.${
            y.hecsChange > 0 ? ` With a HECS-HELP debt, ${formatAUD(y.hecsChange)} more again.` : ""
          }`,
  };
}

function hecsFaq(salary: number): FaqItem {
  const s = formatAUD(salary);
  const f = salaryFacts(salary);
  const w = f.withHecs;
  return {
    q: `How much is ${s} after tax with a HECS debt?`,
    a:
      w.hecsRepayment > 0
        ? `${formatAUD(w.takeHomePay)} a year, ${formatAUD(w.fortnightly)} a fortnight, after a ${formatAUD(w.hecsRepayment)} compulsory repayment (${pct(w.hecsRepayment / salary)} of ${s}).`
        : `The same, ${formatAUD(f.breakdown.takeHomePay)}: ${s} is under the ${SITE_CONFIG.financialYear} repayment threshold.`,
  };
}

function payName(p: PublicPayOnPage): string {
  if (p.point === "step" || p.point === "allowance") {
    return `a ${p.code} public hospital ${p.classification.toLowerCase()}${p.point === "allowance" ? " with the special allowance" : ""}`;
  }
  if (p.point === "scale") return `${p.service} ${p.classification}`;
  if (p.point === "adult" || p.point === "junior") return `${p.service} ${p.classification}${p.point === "junior" ? " full-time" : ""}`;
  if (p.point === "paid") return `the ${p.detail.replace(" actually paid", "").replace(" of base salaries paid", "")} for ${p.service} ${p.code}`;
  if (p.point === "rank") return `an ADF ${p.classification.split(" (")[0]} on ${p.code}`;
  const level = `${p.service} ${p.code}`;
  return p.point === "floor" ? `the ${level} starting floor` : p.point === "top" ? `the top of ${level}` : `the start of ${level}`;
}

function jobsFaq(salary: number): FaqItem | null {
  const { occupations, publicPay, apprentices, show } = jobsOnPage(salary);
  if (!show) return null;
  const s = formatAUD(salary);
  const names = [
    ...occupations.map((o) => ({ d: Math.abs(o.diff), t: `${groupName(o.anzscoTitle)} (median ${formatAUD(o.annual)})` })),
    ...publicPay.map((p) => ({ d: Math.abs(p.diff), t: `${payName(p)} (${formatAUD(p.annual)})` })),
    ...apprentices.map((a) => ({ d: Math.abs(a.diff), t: `${a.stageLabel.split(" (")[0]} ${a.track} ${a.trades[0].name.toLowerCase()} apprentices (${formatAUD(a.annual)})` })),
  ]
    .sort((a, b) => a.d - b.d)
    .slice(0, 5)
    .map((n) => n.t);
  return {
    q: `What jobs pay about ${s} in Australia?`,
    a: `The closest published figures are ${list(names)}. More in pay rates by job.`,
    links: { "pay rates by job": "/job-pay-rates/" },
  };
}

function lowFaqs(salary: number): FaqItem[] {
  const s = formatAUD(salary);
  const [nmw, retail] = hoursRows(salary);
  const h = lowIncomeHelp(salary);
  const total = h.incomeTax + h.medicare;
  const medicare =
    h.medicareStage === "exempt" ? "no Medicare levy" : h.medicareStage === "shade-in" ? `a reduced ${formatAUD(h.medicare)} Medicare levy` : `${formatAUD(h.medicare)} of Medicare levy`;
  const out: FaqItem[] = [
    {
      q: `Do you pay tax on ${s}?`,
      a:
        h.incomeTax === 0
          ? `No income tax: the ${formatAUD(LITO.maxOffset)} Low Income Tax Offset cancels it. You pay ${medicare}.`
          : `Yes: ${formatAUD(h.incomeTax)} of income tax after the Low Income Tax Offset, and ${medicare}, ${pct(total / salary)} of ${s} in all.`,
    },
    {
      q: `How many hours a week is ${s}?`,
      a: `${nmw.hours} hours at the ${money2(nmw.hourly)} minimum wage (${nmw.casualHours} as a casual), or ${retail.hours} on the ${retail.label} ${retail.classification} rate, over 52 weeks.`,
    },
  ];
  const { juniors } = minimumWageOnPage(salary);
  const apprentices = apprenticesOnPage(salary);
  if (juniors.length > 0 || apprentices.length > 0) {
    const who = [
      ...juniors.map((j) => `${j.years < 16 ? "an employee under 16" : `a ${j.age}-year-old`} on the junior minimum wage (${formatAUD(j.annual)})`),
      ...apprentices
        .filter((a, i, all) => all.findIndex((b) => b.stage === a.stage && b.track === a.track && b.trades[0].slug === a.trades[0].slug) === i)
        .slice(0, 2)
        .map((a) => `a ${a.stageLabel.split(" (")[0]} ${a.track} ${a.trades[0].name.toLowerCase()} apprentice (${formatAUD(a.annual)})`),
    ];
    out.push({ q: `Who earns ${s} full-time?`, a: `At the legal or award minimum, ${list(who)} ${who.length > 1 ? "earn" : "earns"} about ${s} full-time.` });
  } else {
    out.push(yearFaq(salary));
  }
  return out;
}

function middleFaqs(salary: number): FaqItem[] {
  const s = formatAUD(salary);
  const e = sacrificeEffect(salary);
  const out: FaqItem[] = [
    hecsFaq(salary),
    {
      q: `How much does salary sacrificing ${formatAUD(e.amount)} save on ${s}?`,
      a: `${formatAUD(e.saved)} of tax a year: take-home falls by ${formatAUD(e.takeHomeCost)} and super gains ${formatAUD(e.intoSuper)} after contributions tax.`,
    },
  ];
  out.push(jobsFaq(salary) ?? yearFaq(salary));
  return out;
}

function highFaqs(salary: number): FaqItem[] {
  const s = formatAUD(salary);
  const m = mlsEffect(salary);
  const d = div293Effect(salary);
  const out: FaqItem[] = [];
  if (m) {
    out.push({
      q: `How much less is ${s} after tax without private health insurance?`,
      a: `${formatAUD(m.amount)} a year (${money2(m.amountFortnight)} a fortnight): the Medicare levy surcharge is ${pct(m.rate, 2)} of income at ${s} for a single person without hospital cover (${m.incomeYear}).`,
    });
  }
  const jobs = jobsFaq(salary);
  // Three questions: Division 293 takes the last slot only where no jobs list does.
  if (d && !jobs) {
    out.push({
      q: `Does Division 293 tax apply on ${s}?`,
      a: `Yes, about ${formatAUD(d.amount)} a year: income plus employer super (${formatAUD(d.incomePlusSuper)}) is over ${formatAUD(d.threshold)}. It is billed after your return, not withheld from pay.`,
    });
  }
  out.push(hecsFaq(salary));
  if (jobs) out.push(jobs);
  else if (!d) out.push(yearFaq(salary));
  return out;
}

export function takeHomePayOnSalaryFaqs(salary: number): FaqItem[] {
  const band = takeHomeBand(salary);
  if (band === "low") return lowFaqs(salary);
  if (band === "middle") return middleFaqs(salary);
  return highFaqs(salary);
}
