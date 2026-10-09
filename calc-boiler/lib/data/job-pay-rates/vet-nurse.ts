// Vet nurse — Animal Care and Veterinary Services Award 2020 [MA000118]
// (J8, 9 Oct 2026). Search demand: "vet nurse salary" 2,400 a month (AU).
//
// Source: awards.fairwork.gov.au/MA000118.html, "incorporates all amendments up
// to and including 1 July 2026 (PR799280 …)", read 9 October 2026, and the
// Fair Work Ombudsman pay guide for MA000118 (published 24 June 2026, rates from
// the first full pay period starting on or after 1 July 2026), read the same
// day. The two agree to the cent.
//   - cl 15.2 (varied by PR799398 ppc 01Jul26) — "Practice managers, Veterinary
//     nurses, Receptionists, Animal attendants and Assistants": Introductory
//     $978.10 / $25.74; Level 1 $1,004.90 / $26.44; Level 2 $1,073.10 / $28.24;
//     Level 3 $1,119.10 / $29.45; Level 4 $1,221.10 / $32.13; Level 5—Practice
//     manager $1,283.10 / $33.77.
//   - Schedule B.2.3 casual hourly: $32.18, $33.05, $35.30, $36.81, $40.16,
//     $42.21. The pay guide labels the rows "Veterinary nurse - level 1" to
//     "level 4".
//   - Schedule A.2.4: Level 3 "will possess an AQF Level 3 or other equivalent
//     qualification"; A.2.5: Level 4 "will possess competencies of AQF 4 or
//     other equivalent qualifications", indicative tasks include "providing
//     veterinary nursing care", "monitoring patient anaesthesia", "applying
//     radiographic routines", "preparing and provide support for surgical
//     procedures". A.2.1: Introductory level for no more than 3 months.
//   - cl 4.2–4.3: covers private veterinary surgery practices and community-
//     based animal welfare charities.
//   - cl 13.2: ordinary hours 6.00 am to 9.00 pm, Monday to Sunday.
//   - cl 21.1: Saturday first 3 hours (after 1 pm) 150% / casual 175%, after 3
//     hours 200% / 225%; Sunday 200% / 225%; public holiday 250% / 275%
//     (minimum 4 hours, cl 27.2). cl 21.2: shift finishing after 8 pm or
//     starting at or before 6.30 am 115%; night 130% (casual 140% / 155%,
//     Schedule B.2.4). cl 21.3: Saturday/Sunday/public holiday shifts 150% /
//     200% / 250%.
//   - cl 20.1: overtime 150% first 3 hours then 200% (Mon–Sat), Sunday 200% with
//     3-hour minimum; casual 175% / 225%; recall minimum 3 hours.
//   - cl 16.2 and 16.4–16.5 allowances (varied ppc 01Jul26).
//   - cl 15.4 junior rates: 50% under 17, 60% at 17, 70% at 18, 80% at 19,
//     90% at 20.
// The Introductory level is below the $1,004.90 National Minimum Wage figure the
// rest of the site uses, so it is described in a notice rather than the table.
//
// Median: Jobs and Skills Australia, ANZSCO 3613 Veterinary Nurses, $1,667 a
// week / $37 an hour (ABS SEEH May 2025), read 9 October 2026.

import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  CONSOLIDATED_TO,
  FWO_PAY_GUIDES,
  awardTextUrl,
  jsaSource,
  jsaUrl,
} from "./common";
import { annual52, atPercent, money0, money2 } from "./j8-common";
import type { MedianEarnings, Occupation, RateRow } from "./types";

const CODE = "MA000118";

export const VET_NURSE_MEDIAN: MedianEarnings = {
  anzscoCode: "3613",
  anzscoTitle: "Veterinary Nurses",
  medianWeekly: 1_667,
  medianHourly: 37,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("3613-veterinary-nurses"),
};

/** cl 15.2 weekly and hourly; casual from Schedule B.2.3, transcribed. */
function vn(label: string, weekly: number, hourly: number, casualHourly: number, note: string): RateRow {
  return { label, weekly, hourly, casualHourly, note };
}

export const VN_L1 = vn("Level 1", 1004.9, 26.44, 33.05, "Direct supervision: basic animal care, feeding, cleaning and restraint");
export const VN_L2 = vn("Level 2", 1073.1, 28.24, 35.3, "Clinic routines, daily treatment of patients, clinic hygiene");
export const VN_L3 = vn("Level 3", 1119.1, 29.45, 36.81, "AQF Certificate III or equivalent; routine patient monitoring");
export const VN_L4 = vn("Level 4", 1221.1, 32.13, 40.16, "AQF Certificate IV competencies; anaesthetic, surgical and radiography support");
export const VN_L5 = vn("Level 5 — Practice manager", 1283.1, 33.77, 42.21, "Runs the day-to-day operations of the practice");

const SAT_AFTER_1PM = atPercent(VN_L4.hourly, 1.5);
const SUNDAY = atPercent(VN_L4.hourly, 2);
const PUBLIC_HOLIDAY = atPercent(VN_L4.hourly, 2.5);

export const VET_NURSE: Occupation = {
  slug: "vet-nurse",
  name: "Vet Nurse",
  plural: "vet nurses",
  metaTitle: `Vet Nurse Salary Australia 2026 — ${money2(VN_L4.hourly)}/hr Award Minimum`,
  award: {
    name: "Animal Care and Veterinary Services Award 2020",
    code: CODE,
    url: awardTextUrl(CODE),
    consolidatedTo: CONSOLIDATED_TO,
  },
  headline: {
    tableId: "vet-nurse",
    label: VN_L4.label,
    why: "a vet nurse working at AQF Certificate IV level, which the award grades at Level 4",
  },
  coverage: [
    "Vet nurses employed by private veterinary practices and by community-based animal welfare charities are covered by the Animal Care and Veterinary Services Award 2020 [MA000118] (cl 4.2–4.3). Clause 15.2 puts veterinary nurses on one pay scale with receptionists, animal attendants, assistants and practice managers, so the level depends on your skills and duties, not your job title.",
    "A vet nurse working at AQF Certificate IV level is Level 4. The award's indicative Level 4 tasks are the core of veterinary nursing: providing veterinary nursing care, preparing and supporting surgical procedures, monitoring patient anaesthesia, applying radiographic routines, performing pathology procedures and nursing hospitalised animals (Schedule A.2.5).",
    "Level 3 needs an AQF Certificate III or equivalent qualification, or the knowledge and experience to work at trade level. It covers animal care under limited supervision, routine monitoring of patients, basic animal first aid and supervising Level 1 staff (A.2.4). Levels 1 and 2 are assistant work under direct supervision, and Level 5 is the practice manager.",
    "Vets themselves are on a separate annual salary scale in the same award — see the veterinarian page. The award covers private practices and animal welfare charities only, so a vet nurse employed by a university or a government agency is paid under a different instrument, and an enterprise agreement replaces the award where one applies.",
  ],
  tables: [
    {
      id: "vet-nurse",
      title: "Vet nurse pay rates by level, 2026–27",
      intro:
        "Animal Care and Veterinary Services Award cl 15.2, from the first full pay period on or after 1 July 2026. Casual rates are the award's own Schedule B.2.3 column: the hourly rate plus the 25% casual loading (cl 11.1).",
      rows: [VN_L1, VN_L2, VN_L3, VN_L4, VN_L5],
    },
  ],
  penalties: [
    { when: "Monday–Friday, and Saturday before 1 pm (ordinary hours, 6 am–9 pm)", permanent: "100%", casual: "125%" },
    { when: "Saturday after 1 pm — first 3 hours", permanent: "150%", casual: "175%" },
    { when: "Saturday after 1 pm — after 3 hours", permanent: "200%", casual: "225%" },
    { when: "Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday (minimum 4 hours)", permanent: "250%", casual: "275%" },
    { when: "Shift finishing after 8 pm, or starting at or before 6.30 am", permanent: "115%", casual: "140%" },
    { when: "Night shift (most hours between midnight and 8 am)", permanent: "130%", casual: "155%" },
  ],
  penaltiesNote:
    "Percentages of the minimum hourly rate (cl 21.1–21.2; Schedule B.1.4–B.1.5 and B.2.3–B.2.4). Ordinary hours can fall between 6 am and 9 pm on any day (cl 13.2), so a Saturday morning is paid at the ordinary rate and the Saturday penalty starts at 1 pm. Where most of a rostered shift falls on a Saturday, Sunday or public holiday, a shiftworker gets 150%, 200% or 250% instead of the shift loading (cl 21.3). Casual percentages include the 25% loading.",
  overtime: [
    "Full-time and part-time: 150% for the first 3 hours Monday to Saturday, then 200%; Sunday 200% with a 3-hour minimum (cl 20.1(b)).",
    "Casual: 175% for the first 3 hours Monday to Saturday, then 225%; Sunday 225% (cl 20.1(c)). Overtime is any work outside ordinary hours, and for a shiftworker anything over 8 hours in a shift (cl 20.1(a)).",
    "Called back to work after finishing for the day: overtime rates with a minimum of 3 hours' pay (cl 20.1(e)). Each day's overtime is worked out separately (cl 20.1(d)).",
  ],
  allowances: [
    { name: "On-call allowance", amount: "$23.17 per 24 hours", note: "Rostered on call between weekday shifts; $34.80 on a Saturday and $40.51 on a Sunday, public holiday or rostered day off, each per 24 hours or part (cl 16.2(c))." },
    { name: "Broken shift allowance", amount: "$17.91 per shift", note: "Ordinary hours worked in more than one shift, paid once per 24 hours (cl 16.2(a))." },
    { name: "First aid allowance", amount: "$21.93 per week", note: "A qualified first aid attendant appointed to first aid duties (cl 16.2(b))." },
    { name: "Laundry allowance", amount: "$6.68 per week", note: "If you must wear a uniform and launder it yourself; the employer also covers the cost of the uniform (cl 16.4(a))." },
    { name: "Meal allowance", amount: "$15.61", note: "Overtime of more than 1.5 hours without notice the day before; $13.41 for each later meal per 4 hours of overtime (cl 16.5(a))." },
    { name: "Vehicle allowance", amount: "$1.00 per km", note: "Using your own car for work; $0.34 per km for a motorcycle (cl 16.4(b))." },
  ],
  median: VET_NURSE_MEDIAN,
  notices: [
    "Someone new to the industry can be paid the Introductory level — $978.10 a week, $25.74 an hour — for no more than 3 months before moving to Level 1 (cl 15.2, Schedule A.2.1).",
    "Junior employees are paid a percentage of the adult rate for their level: 50% under 17, 60% at 17, 70% at 18, 80% at 19 and 90% at 20 (cl 15.4).",
  ],
  notShown: [
    "Junior rates in dollars and National Training Wage trainee rates (cl 15.4, 15.6).",
    "Animal care industry inspector rates (cl 15.1) and veterinary surgeon salaries (cl 15.3), which are on the veterinarian page.",
    "Enterprise agreement rates at corporate veterinary groups, which can pay more than these minimums.",
  ],
  faqs: [
    {
      q: "What is the award rate for a vet nurse in 2026?",
      a: `A vet nurse working at AQF Certificate IV level is Level 4 under the Animal Care and Veterinary Services Award: at least ${money2(VN_L4.hourly)} an hour or ${money2(VN_L4.weekly)} a week from the first full pay period on or after 1 July 2026, about ${money0(annual52(VN_L4.weekly))} a year full-time before tax. A Certificate III vet nurse at Level 3 gets at least ${money2(VN_L3.hourly)} an hour.`,
    },
    {
      q: "What is the casual rate for a vet nurse?",
      a: `A casual Level 4 vet nurse earns at least ${money2(VN_L4.casualHourly ?? 0)} an hour, the ${money2(VN_L4.hourly)} rate plus the 25% casual loading. A casual Level 3 earns ${money2(VN_L3.casualHourly ?? 0)}, and casuals must be paid for at least 3 hours each time they work (cl 11.4).`,
    },
    {
      q: "Do vet nurses get paid more on weekends?",
      a: `Yes, but not on Saturday mornings. Ordinary hours run from 6 am to 9 pm every day, so Saturday is paid at the ordinary rate until 1 pm. After 1 pm a Level 4 vet nurse gets 150% for the first 3 hours (${money2(SAT_AFTER_1PM)} an hour), then 200%. Sunday is 200% (${money2(SUNDAY)}) and a public holiday 250% (${money2(PUBLIC_HOLIDAY)}).`,
    },
    {
      q: "How much is the on-call allowance for vet nurses?",
      a: "$23.17 for each 24 hours on call between weekday shifts, $34.80 on a Saturday and $40.51 on a Sunday, public holiday or rostered day off (cl 16.2(c)). If you are called back to work, you are paid overtime rates for at least 3 hours.",
    },
    {
      q: "What do vet nurses actually earn?",
      a: `Jobs and Skills Australia reports median full-time earnings of $1,667 a week for veterinary nurses (ABS Survey of Employee Earnings and Hours, May 2025), about ${money0(annual52(1_667))} a year before tax. That is a market figure that includes above-award pay, not a minimum.`,
    },
  ],
  sources: [
    { title: "Animal Care and Veterinary Services Award 2020 [MA000118] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl(CODE) },
    {
      title: "Pay Guide — Animal Care and Veterinary Services Award [MA000118], published 24 June 2026",
      publisher: "Fair Work Ombudsman",
      url: "https://calculate.fairwork.gov.au/ArticleDocuments/872/animal-care-and-veterinary-services-award-ma000118-pay-guide.pdf.aspx",
    },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(VET_NURSE_MEDIAN),
  ],
  verifiedOn: "9 October 2026",
  related: [
    { href: "/job-pay-rates/veterinarian/", label: "Veterinarian Pay Rates" },
    { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator" },
    { href: "/casual-loading-calculator/", label: "Casual Loading Calculator" },
  ],
};
