// Pathology collector — Health Professionals and Support Services Award 2020
// [MA000027] (T5, wave 3; "pathology collector pay rate" 1,000/mo AU, found in
// the T5 keyword check).
//
// Source: FWC consolidated award text, awards.fairwork.gov.au/MA000027.html,
// "incorporates all amendments up to and including 1 July 2026", read
// 23 September 2026.
//
// ⚠️ PATHOLOGY COLLECTORS HAVE THEIR OWN TABLE UNTIL 31 DECEMBER 2026.
// PR795400 (ppc 1 April 2026) reclassified pathology collectors into Support
// Services Levels 5–7 by qualification and experience. Clause 16.2(c), headed
// "Pathology collectors—until 31 December 2026" (varied by PR799308 ppc
// 01Jul26), sets their rates; Levels 6 and the unqualified Level 7 are LOWER
// than the general 16.2(a) rates for those levels. Schedule J translates
// collectors classified on 31 March 2026.
//   - Casual: Schedule C.1.9 (125%), matched to the cent below.
//   - Penalties: Schedule C.1.3 / C.1.9 (150% / 175% weekends, 250% / 275%
//     public holidays, 115% / 140% shiftwork) — the same percentages as the
//     shared HPSS_PENALTIES. Overtime: cl 25.
// What replaces the 16.2(c) table on 1 January 2027 is not stated in the
// consolidated text we read, so the page does not predict it.
//
// Median: Jobs and Skills Australia, ANZSCO 3112 Medical Technicians (which
// includes Pathology Collectors, 311216), $1,539 a week / $39 an hour (ABS SEEH
// May 2025), read 23 September 2026.

import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  jsaSource,
  jsaUrl,
} from "./common";
import { HPSS_AWARD, HPSS_OVERTIME, HPSS_PENALTIES, HPSS_PENALTIES_NOTE, HPSS_SOURCE_TITLE } from "./health-professionals-common";
import type { MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "3112",
  anzscoTitle: "Medical Technicians",
  medianWeekly: 1_539,
  medianHourly: 39,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("3112-medical-technicians"),
};

export const PATHOLOGY_COLLECTOR: Occupation = {
  slug: "pathology-collector",
  name: "Pathology Collector",
  plural: "pathology collectors",
  award: HPSS_AWARD,
  headline: {
    tableId: "collectors",
    label: "Level 6 — qualified (Certificate III)",
    why: "a pathology collector with a Certificate III in pathology collection and less than 12 months' experience",
  },
  coverage: [
    "Pathology collectors employed by private pathology companies, private hospitals and other national-system health employers are covered by the Health Professionals and Support Services Award 2020 [MA000027], in the Support Services stream.",
    "Since 1 April 2026 the award classifies pathology collectors by qualification and experience: Level 5 (entry — unqualified, under 12 months' experience); Level 6 (qualified — Certificate III in pathology collection with under 12 months' experience, or unqualified with 12 months to 2 years); and Level 7 (experienced — Certificate III with 12 months or more, or unqualified with 2 years or more).",
    "Until 31 December 2026 pathology collectors are paid from their own table in clause 16.2(c). An unqualified Level 7 collector is paid less than a qualified one unless they were already Support Services Level 6 on 31 March 2026.",
    "Collectors employed by state public health pathology services are paid under state agreements, not this award.",
  ],
  tables: [
    {
      id: "collectors",
      title: "Pathology collector pay rates (until 31 December 2026)",
      intro:
        "Clause 16.2(c) of the award, which the Fair Work Commission headed \"Pathology collectors—until 31 December 2026\", from the first full pay period on or after 1 July 2026. Casual rates are the award's Schedule C.1.9.",
      rows: [
        { label: "Level 5 — entry (unqualified)", weekly: 1157.2, hourly: 30.45, casualHourly: 38.06, note: "Under 12 months' experience" },
        { label: "Level 6 — qualified (Certificate III)", weekly: 1163.9, hourly: 30.63, casualHourly: 38.29, note: "Cert III under 12 months, or unqualified 12 months–2 years" },
        { label: "Level 7 — experienced (unqualified, not previously Level 6)", weekly: 1203.5, hourly: 31.67, casualHourly: 39.59, note: "Unqualified, 2 years' or more experience" },
        { label: "Level 7 — experienced (qualified or previously Level 6)", weekly: 1241.4, hourly: 32.67, casualHourly: 40.84, note: "Cert III with 12 months' or more experience" },
      ],
    },
  ],
  penalties: HPSS_PENALTIES,
  penaltiesNote: `${HPSS_PENALTIES_NOTE} The pathology collector dollar rates are in Schedule C.1.3 (full-time and part-time) and C.1.9 (casual).`,
  overtime: HPSS_OVERTIME,
  allowances: [],
  median: MEDIAN,
  notices: [
    "The pathology collector table in the award is labelled \"until 31 December 2026\". Check the award again from 1 January 2027 — we will update this page when the replacement rates are published.",
    "If you were a pathology collector under this award on 31 March 2026, Schedule J sets your new level and says you are paid the higher of your old rate and your new one.",
  ],
  notShown: [
    "The rates that replace the pathology collector table from 1 January 2027, which we could not confirm from the consolidated award.",
    "Junior rates in the Support Services stream (cl 16.3).",
  ],
  faqs: [
    {
      q: "What is the award rate for a pathology collector in 2026?",
      a: "A qualified pathology collector with a Certificate III and less than 12 months' experience (Level 6) must be paid at least $30.63 an hour, or $1,163.90 a week, from the first full pay period on or after 1 July 2026 — $60,523 a year full-time before tax. An unqualified new starter (Level 5) gets $30.45 an hour, and an experienced qualified collector (Level 7) $32.67.",
    },
    {
      q: "What is the casual rate for a pathology collector?",
      a: "A casual Level 6 pathology collector earns at least $38.29 an hour (Schedule C.1.9). On weekends a casual gets 175% of the minimum hourly rate ($53.60) and on public holidays 275% ($84.23).",
    },
    {
      q: "Does a Certificate III in pathology collection increase your pay?",
      a: "Yes, once you have 12 months' experience. A collector with a Certificate III and 12 months' or more experience is Level 7 (qualified) at $32.67 an hour, while an unqualified collector with 2 years' experience is Level 7 (unqualified) at $31.67 — unless they were already Support Services Level 6 on 31 March 2026.",
    },
    {
      q: "Do pathology collectors get weekend penalty rates?",
      a: "Yes. Full-time and part-time collectors get 150% for ordinary hours between midnight Friday and midnight Sunday — $45.95 an hour at Level 6 — and 250% on public holidays.",
    },
    {
      q: "What do pathology collectors actually earn?",
      a: "Jobs and Skills Australia does not publish a separate median for pathology collectors. The median for medical technicians, the group that includes them, is $1,539 a week (ABS, May 2025).",
    },
  ],
  sources: [
    { title: HPSS_SOURCE_TITLE, publisher: "Fair Work Commission", url: HPSS_AWARD.url },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/job-pay-rates/lab-technician/", label: "Lab Technician Pay Rates" },
    { href: "/job-pay-rates/dental-assistant/", label: "Dental Assistant Pay Rates" },
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
  ],
};
