// Physiotherapist — Health Professionals and Support Services Award 2020
// [MA000027]. Rates, penalties and sources live in
// health-professionals-common.ts; see that file's header for the clauses.
//
// Headline: Level 1 pay point 3, "4 year degree entry" (cl 17.2) — the
// four-year Bachelor of Physiotherapy. Graduates of an entry-level masters or
// Doctor of Physiotherapy start at pay point 4 ("Masters degree entry"); the
// award does not rank a professional doctorate separately from a masters, and
// pay point 5 is expressly "PhD entry", so we say only what the labels say.
//
// Median: Jobs and Skills Australia, ANZSCO 2525 Physiotherapists, $1,888 a
// week / $50 an hour (ABS SEEH May 2025), read 23 September 2026.

import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, jsaUrl } from "./common";
import { hpssOccupation } from "./health-professionals-common";
import type { MedianEarnings } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2525",
  anzscoTitle: "Physiotherapists",
  medianWeekly: 1_888,
  medianHourly: 50,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2525-physiotherapists"),
};

export const PHYSIOTHERAPIST = hpssOccupation({
  slug: "physiotherapist",
  name: "Physiotherapist",
  plural: "physiotherapists",
  headlineLabel: "Level 1 pay point 3",
  why: "a new-graduate physiotherapist with a four-year bachelor degree",
  coverage: [
    "Physiotherapists employed in private practice, private hospitals, sports clinics, aged care and NDIS providers are covered by the Health Professionals and Support Services Award 2020 [MA000027]. The award lists physiotherapist in Schedule B and specifically sets ordinary hours for physiotherapy practices (cl 13.2).",
    "Health professionals are graded from level 1 to level 4. Level 1 is the entry level for new graduates: a four-year bachelor degree starts at pay point 3 and a masters degree at pay point 4. Full-time employees then move up one pay point each year until pay point 6.",
    "Level 2 is a physiotherapist who works independently on routine matters; level 3 an experienced clinician in a specialist area or practising as the sole physiotherapist in a region; level 4 a senior or management role.",
    "Physiotherapists employed by a state public hospital are paid under that state's allied health award or enterprise agreement, not this award. A self-employed or contractor physiotherapist has no award minimum at all.",
  ],
  median: MEDIAN,
  notices: [
    "A graduate of an entry-level masters or Doctor of Physiotherapy program starts at Level 1 pay point 4 — $34.66 an hour or $1,317.20 a week.",
  ],
  faqs: [
    {
      q: "What is the award rate for a physiotherapist in 2026?",
      a: "A new-graduate physiotherapist with a four-year degree must be paid at least $33.51 an hour, or $1,273.40 a week, under the Health Professionals and Support Services Award from the first full pay period on or after 1 July 2026 — $66,217 a year full-time before tax. A masters graduate starts at $34.66 an hour.",
    },
    {
      q: "What is the casual rate for a physiotherapist?",
      a: "A casual Level 1 pay point 3 physiotherapist earns at least $41.89 an hour including the 25% casual loading. Casuals get 175% on weekends and 275% on public holidays.",
    },
    {
      q: "Do physiotherapists get paid more on Saturdays?",
      a: "Yes. Ordinary hours between midnight Friday and midnight Sunday are paid at 150% of the minimum hourly rate for full-time and part-time physiotherapists, which is $50.27 an hour at Level 1 pay point 3.",
    },
    {
      q: "How much does a senior physiotherapist earn under the award?",
      a: "Level 3, for experienced physiotherapists working in a specialist area or with extra responsibilities, runs from $45.89 to $52.19 an hour ($1,743.90 to $1,983.20 a week). Level 4 senior and management roles run from $55.57 to $71.19 an hour.",
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
  ],
});
