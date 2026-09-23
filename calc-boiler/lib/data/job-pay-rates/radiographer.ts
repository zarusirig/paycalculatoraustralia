// Radiographer — Health Professionals and Support Services Award 2020 [MA000027]
// (G3, wave 4). Keywords (DataForSEO, AU): radiographer salary 3,600; radiographer salary australia 1,000.
// Coverage, headline choice and sources: see allied-health-g3.ts and
// health-professionals-common.ts.
//
// Median: Jobs and Skills Australia, ANZSCO 2512 Medical Imaging Professionals, $2,360 a week /
// $60 an hour (ABS SEEH May 2025), read 24 September 2026.

import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, jsaUrl } from "./common";
import { IMAGING_HOURS_NOTICE, PP2, entryParagraph, levelsParagraph, sharedFaqs } from "./allied-health-g3";
import { hpssOccupation } from "./health-professionals-common";
import type { MedianEarnings } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2512",
  anzscoTitle: "Medical Imaging Professionals",
  medianWeekly: 2_360,
  medianHourly: 60,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2512-medical-imaging-professionals"),
};

export const RADIOGRAPHER = hpssOccupation({
  slug: "radiographer",
  name: "Radiographer",
  plural: "radiographers",
  metaTitle: `Radiographer Salary Australia 2026 — ${PP2.hourly}/hr Award Minimum`,
  headlineLabel: "Level 1 pay point 2",
  why: "a new-graduate radiographer entering on a three-year degree, the lowest degree-entry pay point; four-year, masters and PhD graduates start higher",
  coverage: [
    "Radiographers employed by private radiology and medical imaging practices, private hospitals and other national-system health employers are covered by the Health Professionals and Support Services Award 2020 [MA000027]. Schedule B lists the Medical Imaging Technologist, expressly including the medical radiographer.",
    entryParagraph(),
    levelsParagraph("radiographers"),
    "Radiographers in state public hospitals and health services are paid under that state's award or enterprise agreement, not this award.",
  ],
  median: MEDIAN,
  notices: [
    IMAGING_HOURS_NOTICE,
    "Check your pay point, not just your level: a radiographer who graduated with a four-year degree must start at level 1 pay point 3, and a masters graduate at pay point 4, both above the headline figure on this page.",
  ],
  faqs: [
    ...sharedFaqs("Radiographer", "radiographers"),
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
