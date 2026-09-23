// Audiologist — Health Professionals and Support Services Award 2020 [MA000027]
// (G3, wave 4). Keywords (DataForSEO, AU): audiologist salary 880; audiologist pay rate 880.
// Coverage, headline choice and sources: see allied-health-g3.ts and
// health-professionals-common.ts.
//
// Median: Jobs and Skills Australia, ANZSCO 2527 Audiologists and Speech Pathologists \ Therapists, $2,003 a week /
// $53 an hour (ABS SEEH May 2025), read 24 September 2026.

import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, jsaUrl } from "./common";
import { PP2, entryParagraph, levelsParagraph, sharedFaqs } from "./allied-health-g3";
import { hpssOccupation } from "./health-professionals-common";
import type { MedianEarnings } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2527",
  anzscoTitle: "Audiologists and Speech Pathologists \\ Therapists",
  medianWeekly: 2_003,
  medianHourly: 53,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2527-audiologists-and-speech-pathologists-therapists"),
};

export const AUDIOLOGIST = hpssOccupation({
  slug: "audiologist",
  name: "Audiologist",
  plural: "audiologists",
  metaTitle: `Audiologist Salary Australia 2026 — ${PP2.hourly}/hr Award Minimum`,
  headlineLabel: "Level 1 pay point 2",
  why: "a new-graduate audiologist entering on a three-year degree, the lowest degree-entry pay point; four-year, masters and PhD graduates start higher",
  coverage: [
    "Audiologists employed by private hearing clinics, private hospitals and other national-system health employers are covered by the Health Professionals and Support Services Award 2020 [MA000027], which lists \"Audiologist\" in Schedule B.",
    entryParagraph(),
    levelsParagraph("audiologists"),
    "Audiologists employed by a state health service under its own award or agreement are paid under that instrument, not this award.",
  ],
  median: MEDIAN,
  notices: [
    "Check your pay point, not just your level: a audiologist who graduated with a four-year degree must start at level 1 pay point 3, and a masters graduate at pay point 4, both above the headline figure on this page.",
  ],
  faqs: [
    ...sharedFaqs("Audiologist", "audiologists"),
    {
      q: "What do audiologists actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $2,003 a week ($53 an hour) for audiologists and speech pathologists combined (ABS, May 2025), about $104,156 a year. JSA does not publish a separate audiologist figure.",
    },
  ],
  related: [
    { href: "/job-pay-rates/speech-pathologist/", label: "Speech Pathologist Pay Rates" },
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    { href: "/commission-tax-calculator/", label: "Commission Tax Calculator" },
  ],
});
