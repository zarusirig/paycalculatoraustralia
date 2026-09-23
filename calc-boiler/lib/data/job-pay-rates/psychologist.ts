// Psychologist — Health Professionals and Support Services Award 2020
// [MA000027]. Rates, penalties and sources live in
// health-professionals-common.ts; see that file's header for the clauses.
//
// Headline: Level 1 pay point 4, "Masters degree entry" (cl 17.2). General
// registration as a psychologist follows at least a 4-year accredited sequence
// plus further study or supervised practice; we lead with the masters entry
// point and state the 4-year entry point (pay point 3) alongside it rather than
// asserting which route a given employee took. Provisional psychologists and
// psychology graduates without a masters are paid by their qualification.
//
// Median: Jobs and Skills Australia, ANZSCO 2723 Psychologists and
// Psychotherapists, $2,204 a week / $60 an hour (ABS SEEH May 2025), read
// 23 September 2026. The page slug on JSA is 2723-psychologists-and-psychotherapists.

import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, jsaUrl } from "./common";
import { hpssOccupation } from "./health-professionals-common";
import type { MedianEarnings } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2723",
  anzscoTitle: "Psychologists and Psychotherapists",
  medianWeekly: 2_204,
  medianHourly: 60,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2723-psychologists-and-psychotherapists"),
};

export const PSYCHOLOGIST = hpssOccupation({
  slug: "psychologist",
  name: "Psychologist",
  plural: "psychologists",
  headlineLabel: "Level 1 pay point 4",
  why: "a newly qualified psychologist with a masters degree",
  coverage: [
    "Psychologists employed in private practice, private hospitals, community health, NDIS and EAP providers are covered by the Health Professionals and Support Services Award 2020 [MA000027], which lists psychologist in Schedule B.",
    "Level 1 is the entry level for new graduates, and the starting pay point depends on the qualification: pay point 3 for a 4-year degree, pay point 4 for a masters degree and pay point 5 for a PhD. Full-time employees then move up one pay point a year until pay point 6.",
    "Level 2 is a psychologist who works independently on routine matters; level 3 is an experienced psychologist doing complex work or holding extra responsibility; level 4 is a senior or management role.",
    "Psychologists employed by a state health service, education department or the Australian Public Service are paid under their employer's agreement instead. Psychologists who bill Medicare as contractors or sole traders have no award minimum.",
  ],
  median: MEDIAN,
  notices: [
    "The award does not set a separate rate for clinical psychologists or other area-of-practice endorsements. An endorsed psychologist's classification depends on the duties and responsibility of the role under Schedule A.2.",
  ],
  faqs: [
    {
      q: "What is the award rate for a psychologist in 2026?",
      a: "A newly qualified psychologist with a masters degree must be paid at least $34.66 an hour, or $1,317.20 a week, under the Health Professionals and Support Services Award from the first full pay period on or after 1 July 2026. That is $68,494 a year full-time before tax. A 4-year degree entrant starts at $33.51 an hour.",
    },
    {
      q: "What is the casual rate for a psychologist?",
      a: "A casual Level 1 pay point 4 psychologist earns at least $43.33 an hour including the 25% casual loading, rising to 175% of the minimum hourly rate on weekends and 275% on public holidays.",
    },
    {
      q: "Is there a separate award rate for clinical psychologists?",
      a: "No. The award classifies health professionals by level and pay point, not by endorsement. An experienced clinical psychologist doing specialist work would typically fit level 3 ($45.89 to $52.19 an hour), but the classification depends on the role's duties.",
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
  ],
});
