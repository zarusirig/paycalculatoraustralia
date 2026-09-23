// Health Professionals and Support Services Award 2020 [MA000027] — the
// health professional stream, shared by the occupational therapist,
// physiotherapist and psychologist pages (and quoted on the social worker page).
//
// Source: FWC consolidated award text, awards.fairwork.gov.au/MA000027.html,
// "incorporates all amendments up to and including 1 July 2026 (PR799280 …)".
// Read 23 September 2026 via the Firecrawl scrape of the consolidated text.
//
// Weekly and hourly minimums: clauses 17.2–17.5 (varied by PR799308 ppc
// 01Jul26). Casual ordinary hourly rates: Schedule C.2.3 exactly (125% of the
// minimum hourly rate). Penalties: cl 26.1 (weekend 150%, casual 175% without
// the loading), cl 26.3 (shiftwork 115%, casual 140%), Schedule C.2.1/C.2.3
// (public holiday 250% / 275%). Overtime: cl 25.2 and 25.3.
//
// Schedule B lists occupational therapists, physiotherapists, psychologists and
// social workers as "common health professionals" covered by the Schedule A.2
// definitions. Level 1 is "the entry level for new graduates"; the pay point
// on entry depends on the qualification (cl 17.2 table labels).
//
// This award only binds national-system employers in the health industry
// (cl 4.1–4.2): private practices, private hospitals, NDIS and community health
// providers. State public hospital allied health staff are paid under state
// awards or enterprise agreements, which are not reproduced here.

import type {
  Allowance,
  AwardRef,
  MedianEarnings,
  Occupation,
  OccupationFaq,
  OccupationSlug,
  PenaltyRow,
  RateTable,
} from "./types";
import { ANNUAL_WAGE_REVIEW_2026, FWO_PAY_GUIDES, JOB_PAY_VERIFIED_ON, awardTextUrl, jsaSource } from "./common";

export const HPSS_AWARD: AwardRef = {
  name: "Health Professionals and Support Services Award 2020",
  code: "MA000027",
  url: awardTextUrl("MA000027"),
  consolidatedTo: "1 July 2026",
};

export const HPSS_SOURCE_TITLE =
  "Health Professionals and Support Services Award 2020 [MA000027] — consolidated to 1 July 2026";

/** Clause 17.2–17.5 weekly and hourly minimums; casual = Schedule C.2.3 ordinary hours column. */
export const HPSS_TABLES: RateTable[] = [
  {
    id: "level-1",
    title: "Health professional level 1 — graduates and early career",
    intro:
      "Clause 17.2. New graduates enter at the pay point matching their qualification and move up one pay point a year (full-time) or every 1,824 hours (part-time and casual) until pay point 6. Casual rates are Schedule C.2.3 exactly.",
    rows: [
      { label: "Level 1 pay point 1", weekly: 1174.0, hourly: 30.89, casualHourly: 38.61, note: "Diploma (UG 2) qualification" },
      { label: "Level 1 pay point 2", weekly: 1219.5, hourly: 32.09, casualHourly: 40.11, note: "3-year degree entry" },
      { label: "Level 1 pay point 3", weekly: 1273.4, hourly: 33.51, casualHourly: 41.89, note: "4-year degree entry" },
      { label: "Level 1 pay point 4", weekly: 1317.2, hourly: 34.66, casualHourly: 43.33, note: "Masters degree entry" },
      { label: "Level 1 pay point 5", weekly: 1435.0, hourly: 37.76, casualHourly: 47.2, note: "PhD entry" },
      { label: "Level 1 pay point 6", weekly: 1485.9, hourly: 39.1, casualHourly: 48.88 },
    ],
  },
  {
    id: "levels-2-4",
    title: "Health professional levels 2 to 4 — experienced, senior and management",
    intro:
      "Clauses 17.3 to 17.5. Level 2 works independently on routine matters; level 3 is experienced and handles novel or complex work; level 4 carries senior or management responsibility (Schedule A.2). Casual rates are Schedule C.2.3 exactly.",
    rows: [
      { label: "Level 2 pay point 1", weekly: 1493.9, hourly: 39.31, casualHourly: 49.14 },
      { label: "Level 2 pay point 2", weekly: 1548.3, hourly: 40.74, casualHourly: 50.93 },
      { label: "Level 2 pay point 3", weekly: 1607.4, hourly: 42.3, casualHourly: 52.88 },
      { label: "Level 2 pay point 4", weekly: 1671.4, hourly: 43.98, casualHourly: 54.98 },
      { label: "Level 3 pay point 1", weekly: 1743.9, hourly: 45.89, casualHourly: 57.36 },
      { label: "Level 3 pay point 2", weekly: 1792.8, hourly: 47.18, casualHourly: 58.98 },
      { label: "Level 3 pay point 3", weekly: 1831.3, hourly: 48.19, casualHourly: 60.24 },
      { label: "Level 3 pay point 4", weekly: 1912.6, hourly: 50.33, casualHourly: 62.91 },
      { label: "Level 3 pay point 5", weekly: 1983.2, hourly: 52.19, casualHourly: 65.24 },
      { label: "Level 4 pay point 1", weekly: 2111.6, hourly: 55.57, casualHourly: 69.46 },
      { label: "Level 4 pay point 2", weekly: 2253.3, hourly: 59.3, casualHourly: 74.13 },
      { label: "Level 4 pay point 3", weekly: 2450.4, hourly: 64.48, casualHourly: 80.6 },
      { label: "Level 4 pay point 4", weekly: 2705.1, hourly: 71.19, casualHourly: 88.99 },
    ],
  },
];

export const HPSS_PENALTIES: PenaltyRow[] = [
  { when: "Saturday or Sunday (midnight Friday to midnight Sunday)", permanent: "150%", casual: "175%" },
  { when: "Shiftwork (starts 6 pm–6 am or finishes 6 pm–8 am)", permanent: "115%", casual: "140%" },
  { when: "Public holiday", permanent: "250%", casual: "275%" },
];

export const HPSS_PENALTIES_NOTE =
  "Percentages of the minimum hourly rate (cl 26 and Schedule C.2). A casual's weekend and shiftwork rates replace the 25% loading rather than adding to it (cl 26.1(b), 26.3(b)), and the shift penalty does not apply on weekends or public holidays where those rates are paid instead (cl 26.3(c)).";

export const HPSS_OVERTIME: string[] = [
  "Full-time and part-time: 150% for the first 2 hours Monday to Saturday, then 200%; Sunday 200%; public holiday 250% (cl 25.2).",
  "Casual: 187.5% for the first 2 hours Monday to Saturday, then 250%; Sunday 250%; public holiday 312.5% (cl 25.3).",
  "Overtime is triggered by work beyond ordinary hours or beyond 10 hours in a shift (cl 25.1), and replaces rather than adds to weekend and shift penalties.",
];

export const HPSS_ALLOWANCES: Allowance[] = [
  { name: "On-call allowance (Monday–Saturday)", amount: "$26.34 per 24 hours", note: "When you are required to be on call (cl 23.2(d)(i))." },
  { name: "On-call allowance (Sunday or public holiday)", amount: "$52.56 per 24 hours", note: "Cl 23.2(d)(ii)." },
];

export const HPSS_NOT_SHOWN: string[] = [
  "State public hospital and health service pay scales, which are set by state awards and enterprise agreements, not this award.",
  "Rates under enterprise agreements, which replace the award for employers that have one.",
  "Annualised salary arrangements under clause 22, available by written agreement from level 2 up.",
];

// ---------------------------------------------------------------------------
// One builder for the three HPSS occupation pages, so the rate tables,
// penalties and sources can only be written once.
// ---------------------------------------------------------------------------


export interface HpssOccupationInput {
  slug: OccupationSlug;
  name: string;
  plural: string;
  headlineLabel: string;
  why: string;
  coverage: string[];
  median: MedianEarnings;
  notices: string[];
  faqs: OccupationFaq[];
  related: { href: string; label: string }[];
}

export function hpssOccupation(input: HpssOccupationInput): Occupation {
  return {
    slug: input.slug,
    name: input.name,
    plural: input.plural,
    award: HPSS_AWARD,
    headline: { tableId: "level-1", label: input.headlineLabel, why: input.why },
    coverage: input.coverage,
    tables: HPSS_TABLES,
    penalties: HPSS_PENALTIES,
    penaltiesNote: HPSS_PENALTIES_NOTE,
    overtime: HPSS_OVERTIME,
    allowances: HPSS_ALLOWANCES,
    median: input.median,
    notices: input.notices,
    notShown: HPSS_NOT_SHOWN,
    faqs: input.faqs,
    sources: [
      { title: HPSS_SOURCE_TITLE, publisher: "Fair Work Commission", url: HPSS_AWARD.url },
      FWO_PAY_GUIDES,
      ANNUAL_WAGE_REVIEW_2026,
      jsaSource(input.median),
    ],
    verifiedOn: JOB_PAY_VERIFIED_ON,
    related: input.related,
  };
}

// --- G6: HPSS health professional classification structure from 1 October 2026 ---
/**
 * Determination PR814029 (Expert Panel, 7 September 2026, AM2024/20), issued
 * with decision [2026] FWCFB 231; read in full on 24 September 2026. It
 * replaces clause 17 for Health Professional employees with a structure keyed
 * to the AQF level of the profession's standard minimum qualification
 * (Schedule B) and years of experience, and "comes into operation on
 * 1 October 2026" — per employee from the first full pay period starting on or
 * after that date. These are the FIRST-STAGE rates: [2026] FWCFB 123 [80]
 * (26 May 2026) phases the rest in "from 30 June in each of 2027, 2028, 2029
 * and 2030". Translation: clause J.4.1 (old Levels 1 and 2) and J.4.2 (old
 * Levels 3 and 4); J.4.3 keeps anyone on their old rate if it is higher.
 * Weekly (full-time) and hourly exactly as clauses 17.1 and 17.2 print them.
 */
export interface HpssNewRate {
  label: string;
  weekly: number;
  hourly: number;
}

const band = (aqf: number, w: [number, number, number, number], h: [number, number, number, number]): HpssNewRate[] =>
  ["1st year", "2nd – 3rd year", "4th – 6th year", "7th year+"].map((y, i) => ({
    label: `Level 1 — AQF ${aqf} — ${y}`,
    weekly: w[i],
    hourly: h[i],
  }));

export const HPSS_OCT_2026_LEVEL_1: Record<5 | 6 | 7 | 8 | 9, HpssNewRate[]> = {
  5: band(5, [1232.7, 1308.8, 1426.0, 1541.3], [32.44, 34.44, 37.53, 40.56]),
  6: band(6, [1232.7, 1308.8, 1483.3, 1659.3], [32.44, 34.44, 39.03, 43.67]),
  7: band(7, [1308.8, 1409.0, 1565.3, 1689.5], [34.44, 37.08, 41.19, 44.46]),
  8: band(8, [1337.1, 1444.9, 1584.9, 1721.4], [35.19, 38.02, 41.71, 45.3]),
  9: band(9, [1444.9, 1545.2, 1659.3, 1755.0], [38.02, 40.66, 43.67, 46.18]),
};

export const HPSS_OCT_2026_SENIOR: HpssNewRate[] = [
  { label: "Level 2.1 — Senior Clinician, Specialist, Supervisor or Educator (under 5 years at Level 2)", weekly: 1945.4, hourly: 51.19 },
  { label: "Level 2.2 — Senior Clinician, Specialist, Supervisor or Educator (5 years or more)", weekly: 1983.2, hourly: 52.19 },
  { label: "Level 3 — Advanced Clinician, Senior Specialist or Section Manager", weekly: 1983.2, hourly: 52.19 },
  { label: "Level 4 — Manager", weekly: 2499.1, hourly: 65.77 },
];

/** Schedule B.3 standard minimum qualification, for the professions our pages cover. */
export const HPSS_PROFESSION_AQF: Record<string, readonly number[]> = {
  Physiotherapist: [7],
  "Occupational Therapist": [7],
  Pharmacist: [7],
  "Exercise Physiologist": [7],
  Psychologist: [9],
  Dietitian: [7, 8, 9],
  "Social Worker": [7, 8, 9],
  "Speech Pathologist": [7, 8, 9],
};

export const HPSS_OCT_2026 = {
  determination: "PR814029",
  decision: "[2026] FWCFB 231",
  decidedOn: "7 September 2026",
  structureDecision: "[2026] FWCFB 123",
  structureDecidedOn: "26 May 2026",
  operativeFrom: "1 October 2026",
  laterStages: ["30 June 2027", "30 June 2028", "30 June 2029", "30 June 2030"],
  determinationUrl: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr814029.pdf",
  decisionUrl: "https://www.fwc.gov.au/documents/decisionssigned/pdf/2026fwcfb231.pdf",
  structureDecisionUrl: "https://www.fwc.gov.au/documents/decisionssigned/pdf/2026fwcfb123.pdf",
  reviewUrl: "https://www.fwc.gov.au/hearings-decisions/major-cases/gender-based-undervaluation-priority-awards-review",
  /**
   * Clause J.4.1(e): an AQF Level 7 profession with 3-year-degree entry
   * (e.g. physiotherapy, occupational therapy). Old label → new band index.
   */
  translationAqf7ThreeYear: [
    { from: "Level 1 pay point 2", to: 0 },
    { from: "Level 1 pay point 3", to: 1 },
    { from: "Level 1 pay point 4", to: 1 },
    { from: "Level 1 pay point 5", to: 2 },
    { from: "Level 1 pay point 6", to: 2 },
    { from: "Level 2 pay point 1", to: 2 },
    { from: "Level 2 pay point 2", to: 3 },
    { from: "Level 2 pay point 3", to: 3 },
    { from: "Level 2 pay point 4", to: 3 },
  ],
} as const;
// --- end G6 ---
