// Speech Pathologist — Health Professionals and Support Services Award 2020 [MA000027]
// (G3, wave 4). Keywords (DataForSEO, AU): speech pathologist salary 3,600; speech therapist salary 480.
// Coverage, headline choice and sources: see allied-health-g3.ts and
// health-professionals-oct-2026.ts. Rates rolled 9 October 2026 to PR814029
// (from 1 October 2026); Schedule B.3 AQF level(s): 7, 8, 9.
//
// Median: Jobs and Skills Australia, ANZSCO 2527 Audiologists and Speech Pathologists \ Therapists, $2,003 a week /
// $53 an hour (ABS SEEH May 2025), read 24 September 2026.

import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, jsaUrl } from "./common";
import { entryParagraph, firstYear, levelsParagraph, multiAqfNotice, sharedFaqs } from "./allied-health-g3";
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
const AQF: readonly HpssAqfLevel[] = [7, 8, 9];

export const SPEECH_PATHOLOGIST = hpssOct2026Occupation(AQF, {
  slug: "speech-pathologist",
  name: "Speech Pathologist",
  plural: "speech pathologists",
  metaTitle: `Speech Pathologist Salary Australia 2026 — ${firstYear(AQF[0]).hourly}/hr Minimum`,
  headlineLabel: hpssOct2026Label(AQF[0]),
  why: "a first-year speech pathologist at AQF Level 7, the lowest AQF level the award lists for the profession",
  coverage: [
    "Speech pathologists employed by private practices, private hospitals, NDIS and community health providers are covered by the Health Professionals and Support Services Award 2020 [MA000027], which lists \"Speech Pathologist\" in Schedule B.",
    entryParagraph("speech pathologists", AQF),
    levelsParagraph("speech pathologists"),
    "Speech pathologists employed by a state health or education department are paid under that state's award or enterprise agreement. A self-employed speech pathologist has no award minimum.",
  ],
  median: MEDIAN,
  notices: [
    ...HPSS_OCT_2026_NOTICES,
    multiAqfNotice("speech pathologist", AQF),
  ],
  faqs: [
    ...sharedFaqs("Speech Pathologist", "speech pathologists", AQF),
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
