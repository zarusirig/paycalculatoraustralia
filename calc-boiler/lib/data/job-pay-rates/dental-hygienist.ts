// Dental hygienist — Health Professionals and Support Services Award 2020
// [MA000027] (T5, wave 3; "dental hygienist salary" 1,600/mo AU, found in the
// T5 keyword check). Rates, penalties and sources live in
// health-professionals-common.ts; see that file's header for the clauses.
//
// Schedule B of the consolidated award lists "Dental Hygienist" (inserted by
// PR724589 ppc 01Jul21) among the common health professionals, read
// 23 September 2026. Headline: Level 1 pay point 2, "3 year degree entry"
// (cl 17.2); a diploma-qualified hygienist would enter at pay point 1 (UG 2).
//
// Median: Jobs and Skills Australia, ANZSCO 4112 Dental Hygienists,
// Technicians and Therapists, $2,210 a week / $55 an hour (ABS SEEH May 2025),
// read 23 September 2026. The unit group also includes dental technicians,
// prosthetists and therapists; the page says so.

import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, jsaUrl } from "./common";
import { hpssOccupation } from "./health-professionals-common";
import type { MedianEarnings } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "4112",
  anzscoTitle: "Dental Hygienists, Technicians and Therapists",
  medianWeekly: 2_210,
  medianHourly: 55,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("4112-dental-hygienists-technicians-and-therapists"),
};

export const DENTAL_HYGIENIST = hpssOccupation({
  slug: "dental-hygienist",
  name: "Dental Hygienist",
  plural: "dental hygienists",
  headlineLabel: "Level 1 pay point 2",
  why: "a newly registered dental hygienist entering with a three-year degree, which the award starts at level 1 pay point 2",
  coverage: [
    "Dental hygienists employed by private dental practices, dental groups and other national-system health employers are covered by the Health Professionals and Support Services Award 2020 [MA000027], which lists Dental Hygienist among its health professionals (Schedule B).",
    "Health professionals are graded from level 1 to level 4. Level 1 is the entry level for new graduates: a diploma-level qualification starts at pay point 1, a three-year degree at pay point 2 and a four-year degree at pay point 3. Full-time employees then move up one pay point each year until pay point 6.",
    "Level 2 is a hygienist who works independently on routine matters; level 3 is experienced and handles novel or complex work; level 4 carries senior or management responsibility (Schedule A.2).",
    "Dental hygienists in public dental services are paid under state awards or enterprise agreements, and a hygienist working as a contractor on a percentage of billings has no award minimum.",
  ],
  median: MEDIAN,
  notices: [
    "Dental assistants are covered by the same award but in the Support Services stream, on much lower rates — see the dental assistant page.",
  ],
  faqs: [
    {
      q: "What is the award rate for a dental hygienist in 2026?",
      a: "A new dental hygienist with a three-year degree must be paid at least $32.09 an hour, or $1,219.50 a week, under the Health Professionals and Support Services Award from the first full pay period on or after 1 July 2026 — $63,414 a year full-time before tax. Pay rises one pay point a year, to $39.10 an hour at level 1 pay point 6.",
    },
    {
      q: "What is the casual rate for a dental hygienist?",
      a: "A casual dental hygienist at level 1 pay point 2 earns at least $40.11 an hour including the 25% casual loading. Casuals get 175% of the minimum hourly rate on weekends and 275% on public holidays.",
    },
    {
      q: "Do dental hygienists get paid more on Saturdays?",
      a: "Yes. Ordinary hours between midnight Friday and midnight Sunday are paid at 150% of the minimum hourly rate for full-time and part-time staff — $48.14 an hour at level 1 pay point 2.",
    },
    {
      q: "Can a dental hygienist be paid a percentage of billings?",
      a: "If you are an employee, whatever the pay arrangement you must still receive at least the award minimum for the hours you work. A genuine contractor is not covered by the award.",
    },
    {
      q: "What do dental hygienists actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $2,210 a week for dental hygienists, technicians and therapists (ABS, May 2025). That unit group also includes dental technicians, prosthetists and therapists, so it is a guide rather than a hygienist-only figure.",
    },
  ],
  related: [
    { href: "/job-pay-rates/dental-assistant/", label: "Dental Assistant Pay Rates" },
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    { href: "/contractor-vs-employee-calculator/", label: "Contractor vs Employee Calculator" },
  ],
});
