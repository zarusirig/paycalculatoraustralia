// Sonographer — Health Professionals and Support Services Award 2020 [MA000027]
// (G3, wave 4). Keywords (DataForSEO, AU): sonographer salary 3,600; sonographer pay 3,600; sonographer salary australia 1,300.
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

export const SONOGRAPHER = hpssOccupation({
  slug: "sonographer",
  name: "Sonographer",
  plural: "sonographers",
  metaTitle: `Sonographer Salary Australia 2026 — ${PP2.hourly}/hr Award Minimum`,
  headlineLabel: "Level 1 pay point 2",
  why: "a new-graduate sonographer entering on a three-year degree, the lowest degree-entry pay point; four-year, masters and PhD graduates start higher",
  coverage: [
    "Sonographers employed by private ultrasound and medical imaging practices, private hospitals and other national-system health employers are covered by the Health Professionals and Support Services Award 2020 [MA000027]. Schedule B lists \"Sonographer\" and, under Medical Imaging Technologist, the ultrasonographer.",
    entryParagraph(),
    levelsParagraph("sonographers"),
    "Sonographers in state public hospitals are paid under that state's award or enterprise agreement, not this award. A sonographer engaged as a genuine contractor has no award minimum.",
  ],
  median: MEDIAN,
  notices: [
    IMAGING_HOURS_NOTICE,
    "Check your pay point, not just your level: a sonographer who graduated with a four-year degree must start at level 1 pay point 3, and a masters graduate at pay point 4, both above the headline figure on this page.",
  ],
  faqs: [
    ...sharedFaqs("Sonographer", "sonographers"),
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
