// Radiographer — Health Professionals and Support Services Award 2020 [MA000027]
// (G3, wave 4). Keywords (DataForSEO, AU): radiographer salary 3,600; radiographer salary australia 1,000.
// Coverage, headline choice and sources: see allied-health-g3.ts and
// health-professionals-oct-2026.ts. Rates rolled 9 October 2026 to PR814029
// (from 1 October 2026); Schedule B.3 AQF level(s): 7.
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
const AQF: readonly HpssAqfLevel[] = [7];

export const RADIOGRAPHER = hpssOct2026Occupation(AQF, {
  slug: "radiographer",
  name: "Radiographer",
  plural: "radiographers",
  metaTitle: `Radiographer Salary Australia 2026 — ${firstYear(AQF[0]).hourly}/hr Award Minimum`,
  headlineLabel: hpssOct2026Label(AQF[0]),
  why: "a first-year radiographer at AQF Level 7, the award's standard qualification level for the profession",
  coverage: [
    "Radiographers employed by private radiology and medical imaging practices, private hospitals and other national-system health employers are covered by the Health Professionals and Support Services Award 2020 [MA000027]. Schedule B lists the Medical Imaging Technologist, expressly including the medical radiographer.",
    entryParagraph("radiographers", AQF),
    levelsParagraph("radiographers"),
    "Radiographers in state public hospitals and health services are paid under that state's award or enterprise agreement, not this award.",
  ],
  median: MEDIAN,
  notices: [
    ...HPSS_OCT_2026_NOTICES,
    IMAGING_HOURS_NOTICE,
  ],
  faqs: [
    ...sharedFaqs("Radiographer", "radiographers", AQF),
    {
      q: "What do radiographers actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $2,360 a week ($60 an hour) for medical imaging professionals (ABS, May 2025), about $122,720 a year. The group includes radiographers, sonographers, nuclear medicine technologists and radiation therapists, and the figure includes public hospital agreements and above-award pay.",
    },
  ],
  related: [
    { href: "/job-pay-rates/sonographer/", label: "Sonographer Pay Rates" },
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    { href: "/salary-packaging-guide/", label: "Salary Packaging Guide" },
  ],
});
