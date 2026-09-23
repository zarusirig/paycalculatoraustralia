// Podiatrist — Health Professionals and Support Services Award 2020 [MA000027]
// (G3, wave 4). Keywords (DataForSEO, AU): podiatrist salary 1,000; podiatrist pay rate 1,000.
// Coverage, headline choice and sources: see allied-health-g3.ts and
// health-professionals-common.ts.
//
// Median: Jobs and Skills Australia, ANZSCO 2526 Podiatrists, shows "N/A" for
// median full-time weekly and hourly earnings (read 24 September 2026), so no
// median is shown.

import { PP2, entryParagraph, levelsParagraph, sharedFaqs } from "./allied-health-g3";
import { hpssOccupation } from "./health-professionals-common";

export const PODIATRIST = hpssOccupation({
  slug: "podiatrist",
  name: "Podiatrist",
  plural: "podiatrists",
  metaTitle: `Podiatrist Salary Australia 2026 — ${PP2.hourly}/hr Award Minimum`,
  headlineLabel: "Level 1 pay point 2",
  why: "a new-graduate podiatrist entering on a three-year degree, the lowest degree-entry pay point; four-year, masters and PhD graduates start higher",
  coverage: [
    "Podiatrists employed by private podiatry clinics, private hospitals, aged care and NDIS providers are covered by the Health Professionals and Support Services Award 2020 [MA000027], which lists \"Podiatrist\" in Schedule B.",
    entryParagraph(),
    levelsParagraph("podiatrists"),
    "Podiatrists employed in state public health services are paid under that state's award or enterprise agreement. A podiatrist who is a genuine contractor to a clinic has no award minimum.",
  ],
  median: null,
  notices: [
    "Check your pay point, not just your level: a podiatrist who graduated with a four-year degree must start at level 1 pay point 3, and a masters graduate at pay point 4, both above the headline figure on this page.",
  ],
  faqs: [
    ...sharedFaqs("Podiatrist", "podiatrists"),
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
