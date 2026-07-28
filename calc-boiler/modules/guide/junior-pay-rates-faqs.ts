// Shared FAQ copy for /junior-pay-rates/.
//
// Read by both the rendered accordion and the FAQPage JSON-LD so the
// structured data cannot drift from the visible page.
//
// Every dollar figure is interpolated from lib/constants/junior-rates.ts, and
// the hourly/casual figures there are regression-tested against Fair Work's
// own published dollars.

import { formatAUD } from "@/lib/constants";
import {
  ADULT_AGE,
  AWARD_JUNIOR_SCALES,
  CASUAL_LOADING,
  JUNIOR_RATES,
  MINIMUM_WORKING_AGE,
  NMW_ORDER,
  PENDING_JUNIOR_CHANGE,
} from "@/lib/constants/junior-rates";
import { EMPLOYMENT } from "@/lib/constants";

const byAge = (age: string) => JUNIOR_RATES.find((r) => r.age === age)!;
const U16 = byAge("Under 16");
const A16 = byAge("16");
const A17 = byAge("17");
const A18 = byAge("18");
const A19 = byAge("19");
const A20 = byAge("20");

const pctOf = (v: number) => `${(v * 100).toFixed(1)}%`;
const noMinimum = MINIMUM_WORKING_AGE.filter((j) => j.summary === "No minimum age")
  .map((j) => j.jurisdiction)
  .join(", ");

export interface JuniorFaq {
  q: string;
  a: string;
}

export const JUNIOR_FAQS: readonly JuniorFaq[] = [
  {
    q: "What is the minimum wage for a 16 year old in Australia?",
    a: `For an employee covered by no award or agreement, a 16-year-old receives ${pctOf(A16.percentage)} of the National Minimum Wage — ${formatAUD(A16.hourly, 2)} an hour, or ${formatAUD(A16.casualHourly, 2)} an hour as a casual. Most 16-year-olds, though, work in retail or fast food and are covered by an award, which sets its own junior percentage against the award classification rate rather than against the National Minimum Wage. Under the General Retail Industry Award a 16-year-old gets 50% of the adult rate; under the Fast Food Industry Award, also 50%. Check which award covers you before using the national figure.`,
  },
  {
    q: "What is the minimum wage for a 15 year old in Australia?",
    a: `A 15-year-old falls in the "under 16" band: ${pctOf(U16.percentage)} of the National Minimum Wage, which is ${formatAUD(U16.hourly, 2)} an hour, or ${formatAUD(U16.casualHourly, 2)} as a casual. That is the award-free rate. If an award applies, the under-16 percentage of the award rate applies instead — 45% under the retail award and 40% under fast food, which is one of the few places those two awards genuinely differ.`,
  },
  {
    q: "What is the minimum wage for a 14 year old in Australia?",
    a: `The same "under 16" band applies: ${formatAUD(U16.hourly, 2)} an hour award-free, or ${formatAUD(U16.casualHourly, 2)} casual. There is no separate 14-year-old rate. The more important question is usually whether a 14-year-old can legally be employed at all, and that depends entirely on the state or territory — there is no national minimum working age. NSW, South Australia and Tasmania set no minimum age; Victoria and Queensland set 13 for most work; Western Australia and the Northern Territory restrict what under-15s may do rather than setting a floor. Every jurisdiction separately prohibits work during school hours.`,
  },
  {
    q: "What is the minimum working age in Australia?",
    a: `There is no national minimum working age. The Fair Work Ombudsman says directly that the minimum age depends on the state or territory. ${noMinimum} set no minimum age at all. Victoria sets 13 for most work and 11 for delivering newspapers or advertising material; Queensland sets 13, or 11 for supervised delivery work. Western Australia and the Northern Territory instead restrict which jobs under-15s may do — in WA a 13 or 14-year-old may work in a shop, cafe or fast food outlet with written parental permission. The often-repeated claim that "the minimum age in Australia is 15" appears only in secondary sources and is not stated on any government page.`,
  },
  {
    q: "What are the junior pay rates for 2026-27?",
    a: `For award-free employees, as a percentage of the National Minimum Wage: under 16 ${pctOf(U16.percentage)} (${formatAUD(U16.hourly, 2)}/hr), 16 ${pctOf(A16.percentage)} (${formatAUD(A16.hourly, 2)}), 17 ${pctOf(A17.percentage)} (${formatAUD(A17.hourly, 2)}), 18 ${pctOf(A18.percentage)} (${formatAUD(A18.hourly, 2)}), 19 ${pctOf(A19.percentage)} (${formatAUD(A19.hourly, 2)}) and 20 ${pctOf(A20.percentage)} (${formatAUD(A20.hourly, 2)}). From ${ADULT_AGE} the full National Minimum Wage of ${formatAUD(EMPLOYMENT.minimumWageHourly, 2)} an hour applies. These come from the ${NMW_ORDER.citation} (${NMW_ORDER.reference}) and apply from the first full pay period starting on or after ${NMW_ORDER.operativeFrom}.`,
  },
  {
    q: "What is the casual minimum wage in Australia?",
    a: `For an adult award-free employee, ${formatAUD(EMPLOYMENT.minimumWageHourly * (1 + CASUAL_LOADING), 2)} an hour — the ${(CASUAL_LOADING * 100).toFixed(0)}% casual loading on top of the ${formatAUD(EMPLOYMENT.minimumWageHourly, 2)} National Minimum Wage. For juniors the loading applies to the junior rate, giving ${formatAUD(U16.casualHourly, 2)} under 16, ${formatAUD(A16.casualHourly, 2)} at 16, ${formatAUD(A17.casualHourly, 2)} at 17, ${formatAUD(A18.casualHourly, 2)} at 18, ${formatAUD(A19.casualHourly, 2)} at 19 and ${formatAUD(A20.casualHourly, 2)} at 20. The loading compensates for having no paid annual leave, personal leave or notice of termination. If an award covers you, the loading applies to the award rate instead.`,
  },
  {
    q: "At what age do you get full adult pay in Australia?",
    a: `It depends on the instrument. Under the National Minimum Wage the full adult rate applies from ${ADULT_AGE}. But awards set their own ages, and they differ sharply: the Hair and Beauty Industry Award reaches the adult rate at 18, the earliest of any common award; the Hospitality Industry (General) Award pays 100% from 20; the General Retail Industry Award reaches 100% at 20 but only after more than six months with the same employer; and the Fast Food Industry Award holds juniors at 90% until 21. There is no single national answer.`,
  },
  {
    q: "Do junior rates apply to every job?",
    a: `No. A junior rate only applies where the instrument covering you actually contains one. Some awards have no junior rates at all — the SCHADS award, which covers social, community, home care and disability work, contains no junior clause, so an 18-year-old disability support worker is paid the full adult rate for their classification. Under the retail award junior rates are confined to employee levels 1 to 3, so a junior doing level 4 work gets the full level 4 rate. And juniors in hospitality with a trade qualification, or working as liquor service employees, must be paid the adult rate regardless of age.`,
  },
  {
    q: "Are junior rates being abolished?",
    a: `Not currently, and nothing has changed yet. In decision ${PENDING_JUNIOR_CHANGE.decision} of ${PENDING_JUNIOR_CHANGE.decidedOn}, the Fair Work Commission decided to raise junior rates for 18 to 20-year-olds under the Retail, Fast Food and Pharmacy awards who have ${PENDING_JUNIOR_CHANGE.serviceQualifier}. Two things are widely misreported about it. First, no determination has been made — the Commission said it will hear the parties on timing first, and the schedule it published is expressly a provisional view. Second, it is a gradual phase-in of about five percentage points every six months, not a jump to the adult rate. On 1 December 2026, if adopted, an eligible 19-year-old would move from 80% to 85% — not to 100%. Full adult rates would arrive in July 2027 for 20-year-olds, July 2028 for 19-year-olds and July 2029 for 18-year-olds. Rates for under-18s are unchanged.`,
  },
  {
    q: "How are junior rates calculated?",
    a: `The percentage is applied to the weekly rate, and the hourly figure is then that weekly amount divided by ${EMPLOYMENT.standardWeeklyHours} ordinary hours. The order matters: applying the percentage directly to the hourly minimum instead produces a figure a cent lower at ages 17, 19 and 20. The casual rate is then the rounded junior hourly rate plus the ${(CASUAL_LOADING * 100).toFixed(0)}% loading — at 19 that gives ${formatAUD(A19.casualHourly, 2)}, where working from the unrounded figure would give a cent less. Every hourly and casual figure on this page matches Fair Work's own published dollars exactly.`,
  },
  {
    q: "Can an employer pay a junior less than these rates?",
    a: `No. These are legal minimums, not guidelines, and paying below them is underpayment regardless of whether the employee agreed to it. Since 1 January 2025 intentional underpayment has been a federal criminal offence. Junior rates are also the wrong place to be casual about classification: an employee wrongly placed a level down, or given a junior rate under an award that has none, can be owed thousands over a year. Underpayments can generally be recovered for up to six years.`,
  },
];

export const AWARD_SCALE_COUNT = AWARD_JUNIOR_SCALES.length;
