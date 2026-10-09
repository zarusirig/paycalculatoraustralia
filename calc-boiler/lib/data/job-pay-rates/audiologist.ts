// Audiologist — Health Professionals and Support Services Award 2020 [MA000027]
// (G3, wave 4). Keywords (DataForSEO, AU): audiologist salary 880; audiologist pay rate 880.
// Coverage, headline choice and sources: see allied-health-g3.ts and
// health-professionals-oct-2026.ts. Rates rolled 9 October 2026 to PR814029
// (from 1 October 2026); Schedule B.3 AQF level(s): 9.
//
// Median: Jobs and Skills Australia, ANZSCO 2527 Audiologists and Speech Pathologists \ Therapists, $2,003 a week /
// $53 an hour (ABS SEEH May 2025), read 24 September 2026.

import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, jsaUrl } from "./common";
import { entryParagraph, firstYear, levelsParagraph, sharedFaqs } from "./allied-health-g3";
import {
  HPSS_OCT_2026_NOTICES,
  hpssOct2026Label,
  hpssOct2026Occupation,
  type HpssAqfLevel,
} from "./health-professionals-oct-2026";
import type { MedianEarnings } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2527",
  anzscoTitle: "Audiologists and Speech Pathologists \\ Therapists",
  medianWeekly: 2_003,
  medianHourly: 53,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2527-audiologists-and-speech-pathologists-therapists"),
};

/** Schedule B.3 of the award as varied by PR814029 (read 9 October 2026). */
const AQF: readonly HpssAqfLevel[] = [9];

export const AUDIOLOGIST = hpssOct2026Occupation(AQF, {
  slug: "audiologist",
  name: "Audiologist",
  plural: "audiologists",
  metaTitle: `Audiologist Salary Australia 2026 — ${firstYear(AQF[0]).hourly}/hr Award Minimum`,
  headlineLabel: hpssOct2026Label(AQF[0]),
  why: "a first-year audiologist at AQF Level 9, the award's standard qualification level for the profession",
  coverage: [
    "Audiologists employed by private hearing clinics, private hospitals and other national-system health employers are covered by the Health Professionals and Support Services Award 2020 [MA000027], which lists \"Audiologist\" in Schedule B.",
    entryParagraph("audiologists", AQF),
    levelsParagraph("audiologists"),
    "Audiologists employed by a state health service under its own award or agreement are paid under that instrument, not this award.",
  ],
  median: MEDIAN,
  notices: [
    ...HPSS_OCT_2026_NOTICES,
  ],
  faqs: [
    ...sharedFaqs("Audiologist", "audiologists", AQF),
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
