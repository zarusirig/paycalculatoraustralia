// Pharmacy assistant — Pharmacy Industry Award 2020 [MA000012] (T5, wave 3;
// "pharmacy assistant pay rate" 1,300/mo AU, KD n/a — found in the T5 keyword
// check).
//
// Rates READ FROM lib/constants/modern-awards.ts (PHARMACY_AWARD), shared with
// /pharmacy-award-rates/ and /job-pay-rates/pharmacist/. Penalties and overtime
// are the same award clauses as the pharmacist page, so they are taken from
// that object rather than re-typed.
//
// Classifications: Schedule A.1–A.4 of the consolidated award ("incorporates
// all amendments up to and including 1 July 2026"), read 23 September 2026:
// level 1 has not acquired Community Pharmacy competencies; level 2 has the
// Certificate II competencies; level 3 (also "Dispensary assistant level 3")
// has the Certificate III competencies AND is required by the employer to work
// at that level; level 4 the same for Certificate IV.
//
// Juniors: cl 16.2, Table 4 applies to levels 1 and 2 only; the 18–20 bands
// phase up from 1 December 2026 (PR813656) — see JUNIOR_TRANSITION_SCHEDULES.
//
// Median: Jobs and Skills Australia, ANZSCO 6214 Pharmacy Sales Assistants,
// $1,112 a week / $30 an hour (ABS SEEH May 2025), read 23 September 2026.

import { PHARMACY_AWARD } from "../../constants/modern-awards";
import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  CONSOLIDATED_TO,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  jsaSource,
  jsaUrl,
  rowFromModernAward,
} from "./common";
import { PHARMACIST } from "./pharmacist";
import type { MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "6214",
  anzscoTitle: "Pharmacy Sales Assistants",
  medianWeekly: 1_112,
  medianHourly: 30,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("6214-pharmacy-sales-assistants"),
};

export const PHARMACY_ASSISTANT: Occupation = {
  slug: "pharmacy-assistant",
  name: "Pharmacy Assistant",
  plural: "pharmacy assistants",
  award: {
    name: PHARMACY_AWARD.meta.name,
    code: PHARMACY_AWARD.meta.code,
    url: awardTextUrl(PHARMACY_AWARD.meta.code),
    consolidatedTo: CONSOLIDATED_TO,
    awardPageHref: PHARMACY_AWARD.meta.href,
  },
  headline: {
    tableId: "assistants",
    label: "Pharmacy assistant level 1",
    why: "a pharmacy assistant who has not yet gained the Certificate II in Community Pharmacy competencies — where most assistants start",
  },
  coverage: [
    "Pharmacy assistants and dispensary assistants in community pharmacies (retail chemists) are covered by the Pharmacy Industry Award 2020 [MA000012], not the General Retail Award.",
    "The level depends on Community Pharmacy qualifications. Level 1 has not yet acquired the competencies for a Community Pharmacy qualification. Level 2 has the Certificate II competencies. Level 3 — also called Dispensary assistant level 3 — has the Certificate III competencies and is required by the employer to work at that level, which can include dispensing under a pharmacist's direct supervision or supervising level 1 and 2 assistants. Level 4 has the Certificate IV competencies and is required to work at that level (Schedule A.1–A.4).",
    "Holding a higher certificate does not by itself move a level 3 or 4 assistant up: the award also requires that the employer requires you to work at that level.",
  ],
  tables: [
    {
      id: "assistants",
      title: "Pharmacy assistant pay rates by level, 2026–27",
      intro:
        "Pharmacy Industry Award cl 16.1, Table 3, from the first full pay period on or after 1 July 2026. Casual is the hourly rate plus the 25% casual loading, for ordinary weekday hours between 8 am and 7 pm.",
      rows: [
        rowFromModernAward(PHARMACY_AWARD, "Pharmacy assistant level 1", undefined, "No Community Pharmacy qualification yet"),
        rowFromModernAward(PHARMACY_AWARD, "Pharmacy assistant level 2", undefined, "Certificate II in Community Pharmacy competencies"),
        rowFromModernAward(PHARMACY_AWARD, "Pharmacy assistant level 3", undefined, "Certificate III; dispensary assistant or supervisor"),
        rowFromModernAward(PHARMACY_AWARD, "Pharmacy assistant level 4", undefined, "Certificate IV; may supervise levels 1–3"),
      ],
    },
  ],
  penalties: PHARMACIST.penalties,
  penaltiesNote: PHARMACIST.penaltiesNote,
  overtime: PHARMACIST.overtime,
  allowances: [
    { name: "Laundry allowance", amount: "$6.42 per week", note: "Full-time; $1.28 a shift for part-time and casual staff, where the laundry conditions in cl 19.5 apply (cl 19.5(b))." },
    { name: "Meal allowance", amount: "$24.72", note: "Overtime without notice on or before the previous day (cl 19.3(b)(i)); a further $22.15 if the overtime exceeds 4 hours." },
  ],
  median: MEDIAN,
  notices: [
    "Junior rates apply only to pharmacy assistant levels 1 and 2 (cl 16.2), and the percentages for 18- to 20-year-olds with more than 6 months with their employer rise in steps from the first full pay period on or after 1 December 2026. See the junior pay rates page.",
  ],
  notShown: [
    "Junior pharmacy assistant percentages and the phase-in schedule — see the junior pay rates page.",
    "Pharmacy student, intern and pharmacist rates — see the pharmacist page.",
  ],
  faqs: [
    {
      q: "What is the award rate for a pharmacy assistant in 2026?",
      a: "A pharmacy assistant level 1 must be paid at least $27.81 an hour, or $1,056.80 a week, under the Pharmacy Industry Award from the first full pay period on or after 1 July 2026 — $54,954 a year full-time before tax. With Certificate II competencies (level 2) the minimum is $28.45 an hour.",
    },
    {
      q: "What is the casual rate for a pharmacy assistant?",
      a: "A casual level 1 pharmacy assistant earns at least $34.76 an hour for weekday hours between 8 am and 7 pm, the $27.81 rate plus the 25% casual loading. On Saturday between 8 am and 6 pm a casual gets 150% ($41.72) and on Sunday between 7 am and 9 pm 175% ($48.67).",
    },
    {
      q: "What does a dispensary assistant get paid?",
      a: "A dispensary assistant is pharmacy assistant level 3 under the award — Certificate III competencies and required to work at that level — with a minimum of $29.45 an hour or $1,119.10 a week.",
    },
    {
      q: "Is a pharmacy assistant covered by the retail award?",
      a: "No. Community pharmacies are covered by the Pharmacy Industry Award, and the General Retail Award expressly excludes them. The level 1 rate happens to be the same as Retail Employee Level 1, but the penalty rates differ — pharmacy penalties depend on the time of day.",
    },
    {
      q: "What do pharmacy assistants actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,112 a week for pharmacy sales assistants (ABS Survey of Employee Earnings and Hours, May 2025), about $57,824 a year.",
    },
  ],
  sources: [
    { title: "Pharmacy Industry Award 2020 [MA000012] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl(PHARMACY_AWARD.meta.code) },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/pharmacy-award-rates/", label: "Pharmacy Award Pay Rates" },
    { href: "/job-pay-rates/pharmacist/", label: "Pharmacist Pay Rates" },
    { href: "/job-pay-rates/retail-worker/", label: "Retail Worker Pay Rates" },
    { href: "/junior-pay-rates/", label: "Junior Pay Rates" },
  ],
};
