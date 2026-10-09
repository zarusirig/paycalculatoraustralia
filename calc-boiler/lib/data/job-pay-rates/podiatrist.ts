// Podiatrist — Health Professionals and Support Services Award 2020 [MA000027]
// (G3, wave 4). Keywords (DataForSEO, AU): podiatrist salary 1,000; podiatrist pay rate 1,000.
// Coverage, headline choice and sources: see allied-health-g3.ts and
// health-professionals-oct-2026.ts. Rates rolled 9 October 2026 to PR814029
// (from 1 October 2026); Schedule B.3 AQF level(s): 7.
//
// Median: Jobs and Skills Australia, ANZSCO 2526 Podiatrists, shows "N/A" for
// median full-time weekly and hourly earnings (read 24 September 2026), so no
// median is shown.

import { entryParagraph, firstYear, levelsParagraph, sharedFaqs } from "./allied-health-g3";
import {
  HPSS_OCT_2026_NOTICES,
  hpssOct2026Label,
  hpssOct2026Occupation,
  type HpssAqfLevel,
} from "./health-professionals-oct-2026";

/** Schedule B.3 of the award as varied by PR814029 (read 9 October 2026). */
const AQF: readonly HpssAqfLevel[] = [7];

export const PODIATRIST = hpssOct2026Occupation(AQF, {
  slug: "podiatrist",
  name: "Podiatrist",
  plural: "podiatrists",
  metaTitle: `Podiatrist Salary Australia 2026 — ${firstYear(AQF[0]).hourly}/hr Award Minimum`,
  headlineLabel: hpssOct2026Label(AQF[0]),
  why: "a first-year podiatrist at AQF Level 7, the award's standard qualification level for the profession",
  coverage: [
    "Podiatrists employed by private podiatry clinics, private hospitals, aged care and NDIS providers are covered by the Health Professionals and Support Services Award 2020 [MA000027], which lists \"Podiatrist\" in Schedule B.",
    entryParagraph("podiatrists", AQF),
    levelsParagraph("podiatrists"),
    "Podiatrists employed in state public health services are paid under that state's award or enterprise agreement. A podiatrist who is a genuine contractor to a clinic has no award minimum.",
  ],
  median: null,
  notices: [
    ...HPSS_OCT_2026_NOTICES,
  ],
  faqs: [
    ...sharedFaqs("Podiatrist", "podiatrists", AQF),
    {
      q: "Is there a median salary for podiatrists?",
      a: "Not a published one. Jobs and Skills Australia shows \"N/A\" for podiatrists' median earnings, because it does not publish medians where the ABS survey estimate is unreliable, so this page shows only the award minimum. What matters for your pay is your classification level and pay point.",
    },
  ],
  related: [
    { href: "/job-pay-rates/physiotherapist/", label: "Physiotherapist Pay Rates" },
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    { href: "/contractor-vs-employee-calculator/", label: "Contractor vs Employee Calculator" },
  ],
});
