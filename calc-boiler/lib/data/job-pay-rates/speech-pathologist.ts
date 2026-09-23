// Speech Pathologist — Health Professionals and Support Services Award 2020 [MA000027]
// (G3, wave 4). Keywords (DataForSEO, AU): speech pathologist salary 3,600; speech therapist salary 480.
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

export const SPEECH_PATHOLOGIST = hpssOccupation({
  slug: "speech-pathologist",
  name: "Speech Pathologist",
  plural: "speech pathologists",
  metaTitle: `Speech Pathologist Salary Australia 2026 — ${PP2.hourly}/hr Minimum`,
  headlineLabel: "Level 1 pay point 2",
  why: "a new-graduate speech pathologist entering on a three-year degree, the lowest degree-entry pay point; four-year, masters and PhD graduates start higher",
  coverage: [
    "Speech pathologists employed by private practices, private hospitals, NDIS and community health providers are covered by the Health Professionals and Support Services Award 2020 [MA000027], which lists \"Speech Pathologist\" in Schedule B.",
    entryParagraph(),
    levelsParagraph("speech pathologists"),
    "Speech pathologists employed by a state health or education department are paid under that state's award or enterprise agreement. A self-employed speech pathologist has no award minimum.",
  ],
  median: MEDIAN,
  notices: [
    "Check your pay point, not just your level: a speech pathologist who graduated with a four-year degree must start at level 1 pay point 3, and a masters graduate at pay point 4, both above the headline figure on this page.",
  ],
  faqs: [
    ...sharedFaqs("Speech Pathologist", "speech pathologists"),
    {
      q: "What do speech pathologists actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $2,003 a week ($53 an hour) for audiologists and speech pathologists (ABS, May 2025), about $104,156 a year. That is a market figure that includes public sector agreements and above-award pay.",
    },
  ],
  related: [
    { href: "/job-pay-rates/occupational-therapist/", label: "Occupational Therapist Pay Rates" },
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    { href: "/salary-packaging-guide/", label: "Salary Packaging Guide" },
  ],
});
