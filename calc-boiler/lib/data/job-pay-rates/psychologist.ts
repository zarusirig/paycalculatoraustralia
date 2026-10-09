// Psychologist — Health Professionals and Support Services Award 2020
// [MA000027]. Penalties live in health-professionals-common.ts; the rate
// tables are the 1 October 2026 structure in health-professionals-oct-2026.ts.
//
// Rolled 9 October 2026 to determination PR814029 (operative from the first
// full pay period starting on or after 1 October 2026), read 9 October 2026:
// https://www.fwc.gov.au/documents/awardsandorders/pdf/pr814029.pdf
// Schedule B.3 lists Psychologist at AQF Level 9 only (a masters-level
// qualification), so a newly qualified psychologist is "AQF Level 9—1st
// year": $1,444.90 a week, $38.02 an hour, casual $47.53 (cl 17.1(e),
// Schedule C.2.3).
//
// Median: Jobs and Skills Australia, ANZSCO 2723 Psychologists and
// Psychotherapists, $2,204 a week / $60 an hour (ABS SEEH May 2025), read
// 23 September 2026. The page slug on JSA is 2723-psychologists-and-psychotherapists.

import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, jsaUrl } from "./common";
import { hpssOct2026Occupation } from "./health-professionals-oct-2026";
import type { MedianEarnings } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2723",
  anzscoTitle: "Psychologists and Psychotherapists",
  medianWeekly: 2_204,
  medianHourly: 60,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2723-psychologists-and-psychotherapists"),
};

export const PSYCHOLOGIST = hpssOct2026Occupation(9, {
  slug: "psychologist",
  name: "Psychologist",
  plural: "psychologists",
  headlineLabel: "Level 1 — AQF 9 — 1st year",
  why: "a first-year psychologist (AQF Level 9, the award's standard qualification for the profession)",
  coverage: [
    "Psychologists employed in private practice, private hospitals, community health, NDIS and EAP providers are covered by the Health Professionals and Support Services Award 2020 [MA000027], which lists psychologist in Schedule B.",
    "From the first full pay period starting on or after 1 October 2026, Level 1 pay depends on the AQF level of the profession's standard minimum qualification and your years of experience in the profession at Level 1. Schedule B sets psychology at AQF Level 9, so a newly qualified psychologist starts on the AQF Level 9 1st-year rate and moves to the 2nd–3rd year, 4th–6th year and 7th year+ rates with experience.",
    "Level 2 is a senior clinician, specialist, supervisor or educator (Level 2.1 with under 5 years in that role, 2.2 with 5 or more); Level 3 is an advanced clinician, senior specialist or section manager; Level 4 is a manager.",
    "Psychologists employed by a state health service, education department or the Australian Public Service are paid under their employer's agreement instead. Psychologists who bill Medicare as contractors or sole traders have no award minimum.",
  ],
  median: MEDIAN,
  notices: [
    "These are the rates from the first full pay period starting on or after 1 October 2026, under Fair Work Commission determination PR814029. They are the first stage of the Commission's gender undervaluation increases; further stages are due from 30 June 2027, 2028, 2029 and 2030.",
    "If you were employed under this award on 30 September 2026, clause J.4 translates you into the new structure and clause J.4.3 keeps your old minimum rate if it was higher. Our Health Professionals Award rates page covers the full award.",
    "The award does not set a separate rate for clinical psychologists or other area-of-practice endorsements. An endorsed psychologist's classification depends on the duties and responsibility of the role under Schedule A.2.",
  ],
  faqs: [
    {
      q: "What is the award rate for a psychologist in 2026?",
      a: "A first-year psychologist must be paid at least $38.02 an hour, or $1,444.90 a week, under the Health Professionals and Support Services Award from the first full pay period starting on or after 1 October 2026. That is $75,135 a year full-time before tax. The rate rises to $40.66 an hour in the 2nd and 3rd years, $43.67 in the 4th to 6th years and $46.18 from the 7th year.",
    },
    {
      q: "What is the casual rate for a psychologist?",
      a: "A casual first-year (AQF Level 9) psychologist earns at least $47.53 an hour including the 25% casual loading, rising to 175% of the minimum hourly rate on weekends and 275% on public holidays.",
    },
    {
      q: "Is there a separate award rate for clinical psychologists?",
      a: "No. The award classifies health professionals by level, not by endorsement. An experienced clinical psychologist working as a senior clinician or specialist would typically fit Level 2 ($51.19 to $52.19 an hour) or, as an advanced clinician, Level 3 ($52.19), but the classification depends on the role's duties.",
    },
    {
      q: "Are psychologists covered by an award if they work in private practice?",
      a: "Employed psychologists in a private practice are covered by this award. Psychologists who work as independent contractors in a practice, billing their own clients or Medicare, are not employees and have no award minimum.",
    },
    {
      q: "What do psychologists actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $2,204 a week for psychologists and psychotherapists (ABS, May 2025), about $114,608 a year — well above the award minimum, because many work under public sector agreements or above-award salaries.",
    },
  ],
  related: [
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    { href: "/public-service-pay-scales/", label: "Public Service Pay Scales" },
    { href: "/salary-packaging-guide/", label: "Salary Packaging Guide" },
    { href: "/health-professionals-award-rates/", label: "Health Professionals Award Rates" },
  ],
});
