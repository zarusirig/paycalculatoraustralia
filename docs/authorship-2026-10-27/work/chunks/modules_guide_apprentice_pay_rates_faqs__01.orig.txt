import { formatAUD } from "@/lib/constants";
import { APPRENTICE_TRADES, apprenticeRate, getTrade } from "@/lib/data/apprentice-pay";
import { getSpoke, headlineRate } from "@/lib/data/apprentice-pay/spokes";
import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Rates come from
// lib/data/apprentice-pay (modern awards, read 5 October 2026).

const firstYear = APPRENTICE_TRADES.flatMap((t) =>
  (["completed", "not-completed"] as const).map((y) => apprenticeRate(t, "junior", 1, y)!.hourly),
);
const FIRST_MIN = Math.min(...firstYear);
const FIRST_MAX = Math.max(...firstYear);
const fourth = APPRENTICE_TRADES.map((t) => apprenticeRate(t, "junior", 4, "completed")!.hourly);
const FOURTH_MIN = Math.min(...fourth);
const FOURTH_MAX = Math.max(...fourth);

const bld = getTrade("building")!;
const bld1y = apprenticeRate(bld, "junior", 1, "completed")!;
const bld1n = apprenticeRate(bld, "junior", 1, "not-completed")!;
// FWO MA000020 pay guide (2 July 2026): carpenter group, general building site, wage + tool + industry allowance.
const carp1 = headlineRate(getSpoke("carpenter")!, 1, "completed");
const ckr = getTrade("cookery")!;
const ckr1 = apprenticeRate(ckr, "junior", 1, "completed")!;
const elec = getTrade("electrical")!;
const e1 = apprenticeRate(elec, "junior", 1, "completed")!;
const e1n = apprenticeRate(elec, "junior", 1, "not-completed")!;

export const APPRENTICE_PAY_FAQS: Faq[] = [
  {
    q: "How much do apprentices get paid in Australia?",
    a: `It depends on the trade's award and the year of the apprenticeship. From the first full pay period on or after 1 July 2026, the first-year minimums across the trades on this page run from ${formatAUD(FIRST_MIN, 2)} to ${formatAUD(FIRST_MAX, 2)} an hour, rising to between ${formatAUD(FOURTH_MIN, 2)} and ${formatAUD(FOURTH_MAX, 2)} in fourth year. Those are award minimums, so employers and enterprise agreements can pay more, and the electrical and plumbing figures include allowances that the other trades add on top.`,
  },
  {
    q: "Do apprentices get paid minimum wage?",
    a: "No. Apprentice wages are set by the award as a percentage of the qualified tradesperson's rate, which is why a first-year apprentice can lawfully be paid less than the adult National Minimum Wage of $26.44 an hour. The National Minimum Wage order does not bind apprentice rates under a training contract.",
  },
  {
    q: "What is a first-year apprentice carpenter paid in 2026?",
    a: `Under the Building and Construction General On-site Award a first-year apprentice who completed Year 12 must be paid at least ${formatAUD(bld1y.hourly, 2)} an hour (${formatAUD(bld1y.weekly, 2)} a week, 55% of the $1,119.10 standard rate), or ${formatAUD(bld1n.hourly, 2)} an hour (${formatAUD(bld1n.weekly, 2)}) if they did not complete Year 12. The award adds the $41.22 carpenter tool allowance and the industry allowance on top for all purposes, so on a general building site the Fair Work Ombudsman pay guide puts the first-year minimum with Year 12 at ${formatAUD(carp1.hourly, 2)} an hour (${formatAUD(carp1.weekly, 2)} a week).`,
  },
  {
    q: "What is a first-year apprentice chef paid?",
    a: `Under the Hospitality Industry (General) Award, a first-year apprentice cook must be paid at least ${formatAUD(ckr1.hourly, 2)} an hour, which is ${formatAUD(ckr1.weekly, 2)} a week for a 38-hour week (55% of the standard rate). This award does not split rates by Year 12 completion. An apprentice who has to supply their own tools also gets $2.03 a day, up to $9.94 a week.`,
  },
  {
    q: "What is a first-year apprentice electrician paid?",
    a: `Under the Electrical, Electronic and Communications Contracting Award, a first-year apprentice who completed Year 12 must be paid at least ${formatAUD(e1.hourly, 2)} an hour, or ${formatAUD(e1n.hourly, 2)} an hour without Year 12. Those figures already include the tool, industry and electrician's licence allowances.`,
  },
  {
    q: "Does finishing Year 12 change an apprentice's pay?",
    a: "In most of these awards, yes. An apprentice who completed Year 12 starts at 55% of the standard rate instead of 50% in first year and 65% instead of 60% in second year, and the rates meet again in third year in carpentry, automotive, plumbing and hairdressing. The Hospitality Award's cook rates do not split by Year 12.",
  },
  {
    q: "When does an apprentice get a pay rise?",
    a: "Apprentices move up a stage each year of the apprenticeship or, where the award allows competency-based progression, when they complete a set share of their training units, whichever is earlier. The 1 July wage review also lifts every award minimum from the first full pay period on or after 1 July, and employers and enterprise agreements can pay more at any time.",
  },
  {
    q: "What do adult apprentices get paid?",
    a: "Adult apprentices, who start over 21, get higher minimums in some awards. In the Electrical award it is 80% of the grade 5 rate in first year, then at least the grade 1 rate. In the Vehicle Repair award it is 80% of the tradesperson rate in first year, then fixed weekly rates for later years. An employee who becomes an adult apprentice with the same employer cannot have their rate cut. The other trades on this page have adult rules that are not tabulated.",
  },
  {
    q: "Do apprentices get paid for TAFE or training?",
    a: "Time spent at training required by the training contract counts as time worked and is paid under the awards read for this page (for example the Electrical, Building and Hospitality awards). Several awards also make the employer reimburse required training fees. Check the apprentice clauses of your own award.",
  },
  {
    q: "How much tax does an apprentice pay?",
    a: "Apprentices are taxed like other employees. The first $18,200 of income a year is tax-free for residents, then 15% to $45,000, so a first-year apprentice on the award minimum pays little income tax and the low income tax offset can cancel the rest. Use the calculator on this page to see the estimated take-home pay for your trade and year.",
  },
  {
    q: "Which trades are not on this page?",
    a: "Awards for other trades (for example bricklayers outside the building award, roof tilers, horticulture and retail) were not checked for this page, so no rate is shown. Apprentices who started before 1 January 2014, school-based apprentices, trainees and apprentices on enterprise agreements are also not covered. Check your pay guide at fairwork.gov.au.",
  },
];
