// Occupational therapist — Health Professionals and Support Services Award
// 2020 [MA000027]. Penalties live in health-professionals-common.ts; the rate
// tables are the 1 October 2026 structure in health-professionals-oct-2026.ts.
//
// Rolled 9 October 2026 to determination PR814029 (operative from the first
// full pay period starting on or after 1 October 2026), read 9 October 2026:
// https://www.fwc.gov.au/documents/awardsandorders/pdf/pr814029.pdf
// Schedule B.3 lists Occupational Therapist at AQF Level 7 only, so a new
// graduate is "AQF Level 7—1st year": $1,308.80 a week, $34.44 an hour,
// casual $43.05 (cl 17.1(c), Schedule C.2.3). The old pay points 2–4 (by
// degree length) no longer set a new graduate's rate.
//
// Median: Jobs and Skills Australia, ANZSCO 2524 Occupational Therapists,
// $1,913 a week / $50 an hour (ABS SEEH May 2025), read 23 September 2026.

import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, jsaUrl } from "./common";
import { hpssOct2026Occupation } from "./health-professionals-oct-2026";
import type { MedianEarnings } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2524",
  anzscoTitle: "Occupational Therapists",
  medianWeekly: 1_913,
  medianHourly: 50,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2524-occupational-therapists"),
};

export const OCCUPATIONAL_THERAPIST = hpssOct2026Occupation(7, {
  slug: "occupational-therapist",
  name: "Occupational Therapist",
  plural: "occupational therapists",
  headlineLabel: "Level 1 — AQF 7 — 1st year",
  why: "a first-year occupational therapist (AQF Level 7, the award's standard qualification for the profession)",
  coverage: [
    "Occupational therapists employed in private practice, private hospitals, NDIS providers and other health businesses are covered by the Health Professionals and Support Services Award 2020 [MA000027]. The award's Schedule B lists occupational therapist as one of the health professionals it covers.",
    "From the first full pay period starting on or after 1 October 2026, Level 1 pay depends on the AQF level of the profession's standard minimum qualification and your years of experience in the profession at Level 1. Schedule B sets occupational therapy at AQF Level 7, so a new graduate starts on the AQF Level 7 1st-year rate and moves to the 2nd–3rd year, 4th–6th year and 7th year+ rates with experience. An employer that requires a higher qualification must pay at that qualification's AQF level (cl B.2(d)).",
    "Level 2 is a senior clinician, specialist, supervisor or educator (Level 2.1 with under 5 years in that role, 2.2 with 5 or more); Level 3 is an advanced clinician, senior specialist or section manager; Level 4 is a manager.",
    "Occupational therapists employed by a state public health service are paid under that state's allied health award or enterprise agreement instead, which generally pays more than this award.",
  ],
  median: MEDIAN,
  notices: [
    "These are the rates from the first full pay period starting on or after 1 October 2026, under Fair Work Commission determination PR814029. They are the first stage of the Commission's gender undervaluation increases; further stages are due from 30 June 2027, 2028, 2029 and 2030.",
    "If you were employed under this award on 30 September 2026, clause J.4 translates you into the new structure and clause J.4.3 keeps your old minimum rate if it was higher. Our Health Professionals Award rates page covers the full award.",
  ],
  faqs: [
    {
      q: "What is the award rate for an occupational therapist in 2026?",
      a: "A first-year occupational therapist must be paid at least $34.44 an hour, or $1,308.80 a week, under the Health Professionals and Support Services Award from the first full pay period starting on or after 1 October 2026. That is $68,058 a year full-time before tax. The award sets occupational therapy at AQF Level 7, so the starting rate no longer depends on whether your degree took three, four or more years.",
    },
    {
      q: "What is the casual rate for an occupational therapist?",
      a: "A casual first-year (AQF Level 7) occupational therapist earns at least $43.05 an hour, the award rate plus the 25% casual loading. On a Saturday or Sunday a casual gets 175% of the minimum hourly rate and on a public holiday 275%.",
    },
    {
      q: "How fast does an occupational therapist's pay go up?",
      a: "At Level 1 the rate rises with years of experience in the profession: $34.44 an hour in the 1st year, $37.08 in the 2nd and 3rd years, $41.19 in the 4th to 6th years and $44.46 from the 7th year. Moving to Level 2 ($51.19 an hour at Level 2.1) depends on taking on a senior clinician, specialist, supervisor or educator role, not just time served.",
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
    { href: "/health-professionals-award-rates/", label: "Health Professionals Award Rates" },
  ],
});
