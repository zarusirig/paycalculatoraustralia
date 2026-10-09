// Dietitian — Health Professionals and Support Services Award 2020 [MA000027]
// (G3, wave 4). Keywords (DataForSEO, AU): dietitian salary 720.
// Coverage, headline choice and sources: see allied-health-g3.ts and
// health-professionals-oct-2026.ts. Rates rolled 9 October 2026 to PR814029
// (from 1 October 2026); Schedule B.3 AQF level(s): 7, 8, 9.
//
// Median: Jobs and Skills Australia, ANZSCO 2511 Nutrition Professionals, $1,667 a week /
// $45 an hour (ABS SEEH May 2025), read 24 September 2026.

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
  anzscoCode: "2511",
  anzscoTitle: "Nutrition Professionals",
  medianWeekly: 1_667,
  medianHourly: 45,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2511-nutrition-professionals"),
};

/** Schedule B.3 of the award as varied by PR814029 (read 9 October 2026). */
const AQF: readonly HpssAqfLevel[] = [7, 8, 9];

export const DIETITIAN = hpssOct2026Occupation(AQF, {
  slug: "dietitian",
  name: "Dietitian",
  plural: "dietitians",
  metaTitle: `Dietitian Salary Australia 2026 — ${firstYear(AQF[0]).hourly}/hr Award Minimum`,
  headlineLabel: hpssOct2026Label(AQF[0]),
  why: "a first-year dietitian at AQF Level 7, the lowest AQF level the award lists for the profession",
  coverage: [
    "Dietitians employed by private practices, private hospitals, aged care and NDIS providers are covered by the Health Professionals and Support Services Award 2020 [MA000027], which lists \"Dietitian\" in Schedule B.",
    entryParagraph("dietitians", AQF),
    levelsParagraph("dietitians"),
    "Dietitians in state public hospitals are paid under that state's award or enterprise agreement, not this award.",
  ],
  median: MEDIAN,
  notices: [
    ...HPSS_OCT_2026_NOTICES,
    multiAqfNotice("dietitian", AQF),
  ],
  faqs: [
    ...sharedFaqs("Dietitian", "dietitians", AQF),
    {
      q: "What do dietitians actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,667 a week ($45 an hour) for nutrition professionals (ABS, May 2025), about $86,684 a year, below the all-occupations median of $1,852. Only 53% of the group work full-time.",
    },
  ],
  related: [
    { href: "/job-pay-rates/speech-pathologist/", label: "Speech Pathologist Pay Rates" },
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    { href: "/pro-rata-salary-calculator/", label: "Pro-Rata Salary Calculator" },
  ],
});
