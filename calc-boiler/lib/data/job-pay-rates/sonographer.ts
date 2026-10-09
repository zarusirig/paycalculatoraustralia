// Sonographer — Health Professionals and Support Services Award 2020 [MA000027]
// (G3, wave 4). Keywords (DataForSEO, AU): sonographer salary 3,600; sonographer pay 3,600; sonographer salary australia 1,300.
// Coverage, headline choice and sources: see allied-health-g3.ts and
// health-professionals-oct-2026.ts. Rates rolled 9 October 2026 to PR814029
// (from 1 October 2026); Schedule B.3 AQF level(s): 8.
//
// Median: Jobs and Skills Australia, ANZSCO 2512 Medical Imaging Professionals, $2,360 a week /
// $60 an hour (ABS SEEH May 2025), read 24 September 2026.

import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, jsaUrl } from "./common";
import { IMAGING_HOURS_NOTICE, entryParagraph, firstYear, levelsParagraph, sharedFaqs } from "./allied-health-g3";
import {
  HPSS_OCT_2026_NOTICES,
  hpssOct2026Label,
  hpssOct2026Occupation,
  type HpssAqfLevel,
} from "./health-professionals-oct-2026";
import type { MedianEarnings } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2512",
  anzscoTitle: "Medical Imaging Professionals",
  medianWeekly: 2_360,
  medianHourly: 60,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2512-medical-imaging-professionals"),
};

/** Schedule B.3 of the award as varied by PR814029 (read 9 October 2026). */
const AQF: readonly HpssAqfLevel[] = [8];

export const SONOGRAPHER = hpssOct2026Occupation(AQF, {
  slug: "sonographer",
  name: "Sonographer",
  plural: "sonographers",
  metaTitle: `Sonographer Salary Australia 2026 — ${firstYear(AQF[0]).hourly}/hr Award Minimum`,
  headlineLabel: hpssOct2026Label(AQF[0]),
  why: "a first-year sonographer at AQF Level 8, the award's standard qualification level for the profession",
  coverage: [
    "Sonographers employed by private ultrasound and medical imaging practices, private hospitals and other national-system health employers are covered by the Health Professionals and Support Services Award 2020 [MA000027]. Schedule B lists \"Sonographer\" at AQF Level 8.",
    entryParagraph("sonographers", AQF),
    levelsParagraph("sonographers"),
    "Sonographers in state public hospitals are paid under that state's award or enterprise agreement, not this award. A sonographer engaged as a genuine contractor has no award minimum.",
  ],
  median: MEDIAN,
  notices: [
    ...HPSS_OCT_2026_NOTICES,
    IMAGING_HOURS_NOTICE,
  ],
  faqs: [
    ...sharedFaqs("Sonographer", "sonographers", AQF),
    {
      q: "What do sonographers actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $2,360 a week ($60 an hour) for medical imaging professionals, the ANZSCO group that includes sonographers (ABS, May 2025), about $122,720 a year. That is a market figure, far above the award minimum, and includes above-award pay.",
    },
  ],
  related: [
    { href: "/job-pay-rates/radiographer/", label: "Radiographer Pay Rates" },
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    { href: "/contractor-vs-employee-calculator/", label: "Contractor vs Employee Calculator" },
  ],
});
