// Personal trainer — Fitness Industry Award 2020 [MA000094] (J8, 9 Oct 2026).
// Search demand: "personal trainer salary" 480 a month (AU).
//
// Rates come from FITNESS_AWARD in lib/constants/modern-awards-oct.ts, the data
// /fitness-industry-award-rates/ renders, re-read against the consolidated
// award on 9 October 2026 (awards.fairwork.gov.au/MA000094.html, "incorporates
// all amendments up to and including 1 July 2026 (PR799280 …)"):
//   - cl 15.1: Level 3 $1,062.90 / $27.97; 3A $1,119.10 / $29.45; Level 4
//     $1,165.10 / $30.66; 4A $1,221.10 / $32.13; Level 5 $1,287.20 / $33.87.
//   - Schedule B.2 casual: 125% Monday to Friday ($36.81 at 3A, $40.16 at 4A,
//     $42.34 at Level 5) and 130% on Saturday, Sunday and public holidays
//     ($38.29, $41.77, $44.03). Schedule B.1.1 permanent: Saturday 125%,
//     Sunday 150%, public holiday 250% ($40.16, $48.20, $80.33 at 4A).
//   - The award never uses the words "personal trainer". Schedule A.4 Level 3A:
//     performs Level 3 duties and holds a "Fitness Industry … AQF Certificate
//     Level III qualification relevant to the classification". A.6 Level 4A:
//     performs Level 4 duties (limited supervision, initiative and judgment,
//     A.5.1) and holds a "Fitness Industry … AQF Certificate Level IV
//     qualification relevant to the classification". A.7 Level 5: an AQF
//     Diploma, employed as "Fitness Trainer, Fitness Specialist …", able to
//     develop programs for special groups.
//   - cl 12.1: casual loading 25% Monday–Friday, 30% Saturday, Sunday, public
//     holiday; cl 12.2: no casual loading on overtime; cl 12.3(b): a casual
//     Level 2–5 instructor or trainer can be engaged for a minimum of 1 hour.
//   - cl 13.1: ordinary hours 5 am–11 pm Monday to Friday, 6 am–9 pm weekends.
//   - cl 19.2 / Schedule B.1.2: overtime 150% first 2 hours, then 200%; Sunday
//     200%; public holiday 250%.
//
// training.gov.au, SIS40221 Certificate IV in Fitness (read 9 October 2026):
// "This qualification reflects the role of personal trainers who develop,
// instruct and evaluate personalised exercise programs…" — the basis for
// treating Level 4A as the personal trainer row.
//
// The casual public holiday rate is not published, following the site's
// treatment on /fitness-industry-award-rates/ (cl 26.3(c) points casuals to the
// 30% loading; we do not print a dollar figure for it).
//
// Median: Jobs and Skills Australia, ANZSCO 4521 Fitness Instructors (includes
// personal trainers), $1,500 a week / $38 an hour (ABS SEEH May 2025); the
// same profile reports only 32% of workers are full-time. Read 9 October 2026.

import { FITNESS_AWARD } from "../../constants/modern-awards-oct";
import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  CONSOLIDATED_TO,
  FWO_PAY_GUIDES,
  awardTextUrl,
  jsaSource,
  jsaUrl,
  rowFromModernAward,
} from "./common";
import { annual52, atPercent, money0, money2 } from "./j8-common";
import type { MedianEarnings, Occupation } from "./types";

const PT_MEDIAN: MedianEarnings = {
  anzscoCode: "4521",
  anzscoTitle: "Fitness Instructors",
  medianWeekly: 1_500,
  medianHourly: 38,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("4521-fitness-instructors"),
};

const fit = (level: string, label: string, note: string) => rowFromModernAward(FITNESS_AWARD, level, label, note);

export const PT_L3 = fit("Level 3", "Level 3", "General supervision; centre operations");
export const PT_L3A = fit("Level 3A", "Level 3A", "Level 3 duties plus a Fitness Certificate III (fitness instructor)");
export const PT_L4 = fit("Level 4", "Level 4", "Limited supervision; initiative and judgment");
export const PT_L4A = fit("Level 4A", "Level 4A", "Level 4 duties plus a Fitness Certificate IV (personal trainer)");
export const PT_L5 = fit("Level 5", "Level 5", "Diploma; fitness trainer or fitness specialist for special groups");

/** Schedule B.2: 130% on Saturday, Sunday and public holidays; Schedule B.1.1 permanent weekend rates. */
const CASUAL_WEEKEND_4A = atPercent(PT_L4A.hourly, 1.3);
const SAT_4A = atPercent(PT_L4A.hourly, 1.25);
const SUN_4A = atPercent(PT_L4A.hourly, 1.5);

export const PERSONAL_TRAINER: Occupation = {
  slug: "personal-trainer",
  name: "Personal Trainer",
  plural: "personal trainers",
  metaTitle: `Personal Trainer Salary Australia 2026 — ${money2(PT_L4A.hourly)}/hr Award`,
  award: {
    name: FITNESS_AWARD.meta.name,
    code: FITNESS_AWARD.meta.code,
    url: awardTextUrl(FITNESS_AWARD.meta.code),
    consolidatedTo: CONSOLIDATED_TO,
    awardPageHref: FITNESS_AWARD.meta.href,
  },
  headline: {
    tableId: "personal-trainer",
    label: PT_L4A.label,
    why: "an employed personal trainer who holds a Fitness Certificate IV and works at Level 4, the award's Level 4A",
  },
  coverage: [
    "Personal trainers employed by gyms, fitness centres, leisure centres and aquatic centres are covered by the Fitness Industry Award 2020 [MA000094]. The award has no classification called personal trainer: it grades by the qualification you hold and the level of supervision you work under.",
    "A trainer who performs Level 4 duties — working under limited supervision and exercising initiative and judgment — and holds a Fitness Industry AQF Certificate IV relevant to the job is Level 4A (Schedule A.5–A.6). The Certificate IV in Fitness is the qualification training.gov.au describes as reflecting the role of personal trainers. A trainer with a Diploma who is employed as a fitness trainer or fitness specialist and can develop programs for special groups is Level 5 (A.7).",
    "A fitness instructor with a Fitness Certificate III doing Level 3 work is Level 3A (A.4). If you hold a Certificate IV but are only given Level 3 duties under general supervision, the employer may classify you at 3A rather than 4A; the award ties each level to both the qualification and the work.",
    "A personal trainer who is genuinely self-employed — for example, running their own business or paying rent to a gym to train their own clients — is not an employee, so no award minimum applies. Check how you are engaged before relying on these rates.",
  ],
  tables: [
    {
      id: "personal-trainer",
      title: "Personal trainer and fitness instructor pay rates, 2026–27",
      intro:
        "Fitness Industry Award cl 15.1, from the first full pay period on or after 1 July 2026. Casual is the weekday rate: the hourly rate plus the 25% casual loading (cl 12.1(a)). On weekends and public holidays the casual loading is 30% (cl 12.1(b)).",
      rows: [PT_L3, PT_L3A, PT_L4, PT_L4A, PT_L5],
    },
  ],
  penalties: [
    { when: "Monday–Friday, 5 am–11 pm (ordinary hours)", permanent: "100%", casual: "125%" },
    { when: "Saturday, 6 am–9 pm", permanent: "125%", casual: "130%" },
    { when: "Sunday, 6 am–9 pm", permanent: "150%", casual: "130%" },
    { when: "Public holiday (minimum 4 hours)", permanent: "250%", casual: "Not published" },
  ],
  penaltiesNote:
    "Percentages of the minimum hourly rate (cl 12.1, 20.1 and 26.3; Schedule B.1.1 and B.2). A casual's weekend rate is the 30% casual loading on its own, so a casual Sunday (130%) pays less than a permanent Sunday (150%). The award sends casuals working a public holiday to the same 30% loading (cl 26.3(c)); because that sits so far below the permanent 250%, we do not print a casual public holiday figure — check it with the Fair Work Ombudsman.",
  overtime: [
    "Overtime is work outside 5 am–11 pm on weekdays or 6 am–9 pm on weekends, over 10 hours in a day, or over an average of 38 hours a week across 4 weeks (cl 13.1–13.3, 19.1).",
    "Monday to Saturday: 150% for the first 2 hours, then 200%. Sunday: 200%. Public holiday: 250% (cl 19.2, Schedule B.1.2).",
    "No casual loading is paid on overtime hours (cl 12.2). Starting again without a 10-hour break between shifts is paid at 200% until you get the break (cl 19.3).",
  ],
  allowances: FITNESS_AWARD.allowances
    .filter((a) => /Broken shift|First aid|Meal allowance|own motor vehicle|1 to 5 employees/.test(a.name))
    .map((a) => ({ name: a.name, amount: `${money2(a.amount)} ${a.unit}`, note: `${a.note ? `${a.note} ` : ""}(${a.clause})` })),
  median: PT_MEDIAN,
  notices: [
    "A casual trainer at Level 2 to 5 can be engaged for as little as 1 hour, so a single paid session is lawful (cl 12.3(b)). Other casual work has a 3-hour minimum.",
    "Only 32% of fitness instructors work full-time, according to Jobs and Skills Australia, so most trainers' pay depends on hours booked, not the full-time figures on this page.",
  ],
  notShown: [
    "Levels 1, 2, 6 and 7 — see the Fitness Industry Award rates page.",
    "The casual public holiday rate in dollars (see the penalty note).",
    "Commission, session splits and rent arrangements for self-employed trainers, which are business terms, not award pay.",
  ],
  faqs: [
    {
      q: "What is the award rate for a personal trainer in 2026?",
      a: `An employed personal trainer with a Fitness Certificate IV doing Level 4 work is Level 4A under the Fitness Industry Award: at least ${money2(PT_L4A.hourly)} an hour or ${money2(PT_L4A.weekly)} a week from the first full pay period on or after 1 July 2026, about ${money0(annual52(PT_L4A.weekly))} a year full-time before tax. A Diploma-qualified fitness trainer at Level 5 gets at least ${money2(PT_L5.hourly)} an hour.`,
    },
    {
      q: "What is the casual rate for a personal trainer?",
      a: `A casual Level 4A trainer earns at least ${money2(PT_L4A.casualHourly ?? 0)} an hour on weekdays (25% loading) and ${money2(CASUAL_WEEKEND_4A)} on Saturdays and Sundays (30% loading). A casual trainer can be booked for as little as 1 hour.`,
    },
    {
      q: "Do personal trainers get weekend penalty rates?",
      a: `Permanent trainers do: a Level 4A trainer gets 125% on Saturday (${money2(SAT_4A)} an hour) and 150% on Sunday (${money2(SUN_4A)}). Casuals get the 30% weekend casual loading instead, which is ${money2(CASUAL_WEEKEND_4A)} an hour at Level 4A on both days.`,
    },
    {
      q: "What is the award rate for a fitness instructor with a Certificate III?",
      a: `A fitness instructor with a Fitness Certificate III doing Level 3 work is Level 3A: at least ${money2(PT_L3A.hourly)} an hour or ${money2(PT_L3A.weekly)} a week, and ${money2(PT_L3A.casualHourly ?? 0)} an hour as a weekday casual.`,
    },
    {
      q: "What do personal trainers actually earn?",
      a: `Jobs and Skills Australia reports median full-time earnings of $1,500 a week for fitness instructors, the group that includes personal trainers (ABS, May 2025), about ${money0(annual52(1_500))} a year before tax. Only about a third of the group works full-time.`,
    },
  ],
  sources: [
    { title: "Fitness Industry Award 2020 [MA000094] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000094") },
    { title: "SIS40221 — Certificate IV in Fitness", publisher: "training.gov.au", url: "https://training.gov.au/training/details/SIS40221" },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(PT_MEDIAN),
  ],
  verifiedOn: "9 October 2026",
  related: [
    { href: "/fitness-industry-award-rates/", label: "Fitness Industry Award Rates" },
    { href: "/casual-loading-calculator/", label: "Casual Loading Calculator" },
    { href: "/contractor-vs-employee-calculator/", label: "Contractor vs Employee Calculator" },
  ],
};
