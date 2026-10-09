// Physiotherapist — Health Professionals and Support Services Award 2020
// [MA000027]. Penalties live in health-professionals-common.ts; the rate
// tables are the 1 October 2026 structure in health-professionals-oct-2026.ts.
//
// Rolled 9 October 2026 to determination PR814029 (operative from the first
// full pay period starting on or after 1 October 2026), read 9 October 2026:
// https://www.fwc.gov.au/documents/awardsandorders/pdf/pr814029.pdf
// Schedule B.3 lists Physiotherapist at AQF Level 7 only, so a new graduate —
// bachelor, entry-level masters or Doctor of Physiotherapy — is "AQF Level
// 7—1st year": $1,308.80 a week, $34.44 an hour, casual $43.05, unless the
// employer requires a higher qualification (cl B.2(d)).
//
// Median: Jobs and Skills Australia, ANZSCO 2525 Physiotherapists, $1,888 a
// week / $50 an hour (ABS SEEH May 2025), read 23 September 2026.

import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, jsaUrl } from "./common";
import { hpssOct2026Occupation } from "./health-professionals-oct-2026";
import type { MedianEarnings } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2525",
  anzscoTitle: "Physiotherapists",
  medianWeekly: 1_888,
  medianHourly: 50,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2525-physiotherapists"),
};

export const PHYSIOTHERAPIST = hpssOct2026Occupation(7, {
  slug: "physiotherapist",
  name: "Physiotherapist",
  plural: "physiotherapists",
  headlineLabel: "Level 1 — AQF 7 — 1st year",
  why: "a first-year physiotherapist (AQF Level 7, the award's standard qualification for the profession)",
  coverage: [
    "Physiotherapists employed in private practice, private hospitals, sports clinics, aged care and NDIS providers are covered by the Health Professionals and Support Services Award 2020 [MA000027]. The award lists physiotherapist in Schedule B and specifically sets ordinary hours for physiotherapy practices (cl 13.2).",
    "From the first full pay period starting on or after 1 October 2026, Level 1 pay depends on the AQF level of the profession's standard minimum qualification and your years of experience in the profession at Level 1. Schedule B sets physiotherapy at AQF Level 7, so a new graduate starts on the AQF Level 7 1st-year rate whether they hold a bachelor degree, an entry-level masters or a Doctor of Physiotherapy, then moves to the 2nd–3rd year, 4th–6th year and 7th year+ rates with experience.",
    "Level 2 is a senior clinician, specialist, supervisor or educator (Level 2.1 with under 5 years in that role, 2.2 with 5 or more); Level 3 is an advanced clinician, senior specialist or section manager; Level 4 is a manager.",
    "Physiotherapists employed by a state public hospital are paid under that state's allied health award or enterprise agreement, not this award. A self-employed or contractor physiotherapist has no award minimum at all.",
  ],
  median: MEDIAN,
  notices: [
    "These are the rates from the first full pay period starting on or after 1 October 2026, under Fair Work Commission determination PR814029. They are the first stage of the Commission's gender undervaluation increases; further stages are due from 30 June 2027, 2028, 2029 and 2030.",
    "If you were employed under this award on 30 September 2026, clause J.4 translates you into the new structure and clause J.4.3 keeps your old minimum rate if it was higher. Our Health Professionals Award rates page covers the full award.",
  ],
  faqs: [
    {
      q: "What is the award rate for a physiotherapist in 2026?",
      a: "A first-year physiotherapist must be paid at least $34.44 an hour, or $1,308.80 a week, under the Health Professionals and Support Services Award from the first full pay period starting on or after 1 October 2026 — $68,058 a year full-time before tax. The award sets physiotherapy at AQF Level 7, so a masters or Doctor of Physiotherapy graduate starts on the same rate unless the employer requires the higher qualification.",
    },
    {
      q: "What is the casual rate for a physiotherapist?",
      a: "A casual first-year (AQF Level 7) physiotherapist earns at least $43.05 an hour including the 25% casual loading. Casuals get 175% on weekends and 275% on public holidays.",
    },
    {
      q: "Do physiotherapists get paid more on Saturdays?",
      a: "Yes. Ordinary hours between midnight Friday and midnight Sunday are paid at 150% of the minimum hourly rate for full-time and part-time physiotherapists, which is $51.66 an hour for a first-year physiotherapist (Schedule C.2.1).",
    },
    {
      q: "How much does a senior physiotherapist earn under the award?",
      a: "A Level 2 senior clinician, specialist, supervisor or educator earns at least $51.19 an hour ($1,945.40 a week) with under 5 years in the role and $52.19 ($1,983.20) with 5 years or more. Level 3, an advanced clinician, senior specialist or section manager, is $52.19 an hour, and Level 4 managers $65.77 ($2,499.10 a week).",
    },
    {
      q: "What do physiotherapists actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,888 a week for physiotherapists (ABS, May 2025), about $98,176 a year. That is a market figure that includes public hospital agreements and above-award pay.",
    },
  ],
  related: [
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    { href: "/salary-packaging-guide/", label: "Salary Packaging Guide" },
    { href: "/employee-vs-sole-trader-vs-company/", label: "Employee vs Sole Trader vs Company" },
    { href: "/health-professionals-award-rates/", label: "Health Professionals Award Rates" },
  ],
});
