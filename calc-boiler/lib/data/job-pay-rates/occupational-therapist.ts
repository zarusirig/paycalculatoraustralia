// Occupational therapist — Health Professionals and Support Services Award
// 2020 [MA000027]. Rates, penalties and sources live in
// health-professionals-common.ts; see that file's header for the clauses.
//
// Headline: Level 1 pay point 3, "4 year degree entry" (cl 17.2). Most
// Australian occupational therapy degrees are four-year bachelor programs;
// 3-year degree entrants start at pay point 2 and masters entrants at pay
// point 4, which the page says.
//
// Median: Jobs and Skills Australia, ANZSCO 2524 Occupational Therapists,
// $1,913 a week / $50 an hour (ABS SEEH May 2025), read 23 September 2026.

import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, jsaUrl } from "./common";
import { hpssOccupation } from "./health-professionals-common";
import type { MedianEarnings } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2524",
  anzscoTitle: "Occupational Therapists",
  medianWeekly: 1_913,
  medianHourly: 50,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2524-occupational-therapists"),
};

export const OCCUPATIONAL_THERAPIST = hpssOccupation({
  slug: "occupational-therapist",
  name: "Occupational Therapist",
  plural: "occupational therapists",
  headlineLabel: "Level 1 pay point 3",
  why: "a new-graduate occupational therapist with a four-year degree",
  coverage: [
    "Occupational therapists employed in private practice, private hospitals, NDIS providers and other health businesses are covered by the Health Professionals and Support Services Award 2020 [MA000027]. The award's Schedule B lists occupational therapist as one of the health professionals it covers.",
    "Health professionals are graded from level 1 to level 4. Level 1 is the entry level for new graduates, and the pay point you start on depends on your qualification: pay point 2 for a 3-year degree, pay point 3 for a 4-year degree and pay point 4 for a masters degree. Full-time employees then move up one pay point each year until pay point 6.",
    "Level 2 is an occupational therapist who works independently on routine matters; level 3 is an experienced clinician handling novel or complex work or practising as a sole therapist in a rural setting; level 4 is a senior or management role.",
    "Occupational therapists employed by a state public health service are paid under that state's allied health award or enterprise agreement instead, which generally pays more than this award.",
  ],
  median: MEDIAN,
  notices: [
    "A masters-qualified graduate starts at Level 1 pay point 4 — $34.66 an hour or $1,317.20 a week — not pay point 3.",
  ],
  faqs: [
    {
      q: "What is the award rate for an occupational therapist in 2026?",
      a: "A new-graduate occupational therapist with a four-year degree must be paid at least $33.51 an hour, or $1,273.40 a week, under the Health Professionals and Support Services Award from the first full pay period on or after 1 July 2026. That is $66,217 a year full-time before tax. A 3-year degree graduate starts at $32.09 an hour and a masters graduate at $34.66.",
    },
    {
      q: "What is the casual rate for an occupational therapist?",
      a: "A casual Level 1 pay point 3 occupational therapist earns at least $41.89 an hour, the award rate plus the 25% casual loading. On a Saturday or Sunday a casual gets 175% of the minimum hourly rate and on a public holiday 275%.",
    },
    {
      q: "How fast does an occupational therapist's pay go up?",
      a: "Level 1 has six pay points, and a full-time employee moves up one each year (part-time and casual staff after 1,824 hours). Level 1 pay point 6 is $39.10 an hour. Moving to level 2 ($39.31 to $43.98 an hour) depends on working independently, not just time served.",
    },
    {
      q: "Do occupational therapists get penalty rates?",
      a: "Yes, under the award. Ordinary hours worked between midnight Friday and midnight Sunday are paid at 150%, shiftwork at 115% and public holidays at 250%. Overtime is 150% for the first 2 hours, then 200%.",
    },
    {
      q: "What do occupational therapists actually earn in Australia?",
      a: "Jobs and Skills Australia reports a median of $1,913 a week for full-time occupational therapists (ABS Survey of Employee Earnings and Hours, May 2025), about $99,476 a year. That includes therapists on state health agreements and above-award salaries, so it is a market figure, not an entitlement.",
    },
  ],
  related: [
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    { href: "/salary-packaging-guide/", label: "Salary Packaging Guide" },
    { href: "/overtime-penalty-rates-guide/", label: "Overtime & Penalty Rates Guide" },
  ],
});
