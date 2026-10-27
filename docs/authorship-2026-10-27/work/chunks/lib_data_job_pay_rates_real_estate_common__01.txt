// Real Estate Industry Award 2020 [MA000106] — shared by the real estate agent
// and property manager pages.
//
// Source: FWC consolidated award text, awards.fairwork.gov.au/MA000106.html,
// "incorporates all amendments up to and including 1 July 2026 (PR799280,
// PR799386 and PR799541)". Read 23 September 2026.
//   - Weekly: cl 14.1 (varied by PR799386 ppc 01Jul26). The award prints no
//     hourly column in cl 14.1.
//   - Hourly: Schedule B.1.1 "Ordinary hours" (100%).
//   - Casual: Schedule B.2.2 "Ordinary hours" (the casual hourly rate).
//   - Overtime: Schedule B.1.1 (150% first 2 hours, then 200%, Monday–Sunday;
//     200% on a public holiday).
//   - Ordinary hours may be worked on any day of the week (cl 13.1), so the
//     award has no Saturday or Sunday penalty.
//   - Commission-only: cl 16.7. Stand-by/call-out for property management:
//     cl 17 (must be agreed in writing).

import type { AwardRef, RateRow } from "./types";
import { CONSOLIDATED_TO, awardTextUrl } from "./common";

export const REAL_ESTATE_AWARD: AwardRef = {
  name: "Real Estate Industry Award 2020",
  code: "MA000106",
  url: awardTextUrl("MA000106"),
  consolidatedTo: CONSOLIDATED_TO,
};

export const REAL_ESTATE_ROWS: RateRow[] = [
  {
    label: "Level 1 (Associate) — first 12 months",
    weekly: 1010.6,
    hourly: 26.59,
    casualHourly: 33.24,
    note: "Sales or property management assistant/associate",
  },
  {
    label: "Level 1 (Associate) — after 12 months",
    weekly: 1063.9,
    hourly: 28.0,
    casualHourly: 35.0,
  },
  {
    label: "Level 2 (Representative)",
    weekly: 1119.1,
    hourly: 29.45,
    casualHourly: 36.81,
    note: "Lists and sells, or manages rentals",
  },
  {
    label: "Level 3 (Supervisory)",
    weekly: 1231.0,
    hourly: 32.39,
    casualHourly: 40.49,
  },
  {
    label: "Level 4 (In-Charge)",
    weekly: 1287.3,
    hourly: 33.88,
    casualHourly: 42.35,
  },
];

export const REAL_ESTATE_PENALTIES = [
  { when: "Ordinary hours, any day of the week", permanent: "100%", casual: "125%" },
  { when: "Public holiday", permanent: "200%", casual: "250%" },
];

export const REAL_ESTATE_PENALTIES_NOTE =
  "Ordinary hours can be worked on any day of the week (cl 13.1), so there is no Saturday or Sunday penalty under this award. Public holiday work is 200% of the minimum hourly rate for permanent staff and 200% of the casual hourly rate for casuals (Schedule B), shown here as 250% of the minimum hourly rate.";

export const REAL_ESTATE_OVERTIME = [
  "Overtime, any day: 150% for the first 2 hours, then 200% (Schedule B.1.1).",
  "Overtime on a public holiday: 200%.",
  "Overtime on a rostered day off: 150%.",
];
