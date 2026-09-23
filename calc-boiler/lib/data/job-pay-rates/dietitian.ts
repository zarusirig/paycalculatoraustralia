// Dietitian — Health Professionals and Support Services Award 2020 [MA000027]
// (G3, wave 4). Keywords (DataForSEO, AU): dietitian salary 720.
// Coverage, headline choice and sources: see allied-health-g3.ts and
// health-professionals-common.ts.
//
// Median: Jobs and Skills Australia, ANZSCO 2511 Nutrition Professionals, $1,667 a week /
// $45 an hour (ABS SEEH May 2025), read 24 September 2026.

import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, jsaUrl } from "./common";
import { PP2, entryParagraph, levelsParagraph, sharedFaqs } from "./allied-health-g3";
import { hpssOccupation } from "./health-professionals-common";
import type { MedianEarnings } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2511",
  anzscoTitle: "Nutrition Professionals",
  medianWeekly: 1_667,
  medianHourly: 45,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2511-nutrition-professionals"),
};

export const DIETITIAN = hpssOccupation({
  slug: "dietitian",
  name: "Dietitian",
  plural: "dietitians",
  metaTitle: `Dietitian Salary Australia 2026 — ${PP2.hourly}/hr Award Minimum`,
  headlineLabel: "Level 1 pay point 2",
  why: "a new-graduate dietitian entering on a three-year degree, the lowest degree-entry pay point; four-year, masters and PhD graduates start higher",
  coverage: [
    "Dietitians employed by private practices, private hospitals, aged care and NDIS providers are covered by the Health Professionals and Support Services Award 2020 [MA000027], which lists the profession in Schedule B (spelled \"Dietician\").",
    entryParagraph(),
    levelsParagraph("dietitians"),
    "Dietitians in state public hospitals are paid under that state's award or enterprise agreement, not this award.",
  ],
  median: MEDIAN,
  notices: [
    "Check your pay point, not just your level: a dietitian who graduated with a four-year degree must start at level 1 pay point 3, and a masters graduate at pay point 4, both above the headline figure on this page.",
  ],
  faqs: [
    ...sharedFaqs("Dietitian", "dietitians"),
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
