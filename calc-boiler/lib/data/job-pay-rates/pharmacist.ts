// Pharmacist — Pharmacy Industry Award 2020 [MA000012].
//
// Source: FWC consolidated award text, awards.fairwork.gov.au/MA000012.html,
// "incorporates all amendments up to and including 1 July 2026 (PR810422,
// PR799280, PR799293 and PR799450)". Read 23 September 2026.
//   - Weekly and hourly: cl 16.1 Table 3 (varied by PR799293 ppc 01Jul26),
//     READ FROM lib/constants/modern-awards.ts (PHARMACY_AWARD) so this page
//     and /pharmacy-award-rates/ share one copy. Independently re-read on
//     23 September 2026 and identical.
//   - Casual ordinary hourly: hourly + 25%, which matches Schedule B.2.1's
//     "Ordinary hours Monday to Friday between 8.00 am and 7.00 pm" column to
//     the cent (asserted in tests: Pharmacist $52.18).
//   - Penalties: cl 22.3 Table 6. Overtime: cl 21.4 Table 5.
//   - HMR/RMMR allowance: cl 19 ($106.40 per week).
//
// The award covers community pharmacy only. Hospital pharmacists are paid under
// state public-sector instruments and are deliberately not on this page.
//
// Junior rates in this award apply to pharmacy assistants levels 1 and 2 only
// (cl 16.2) and are changing from 1 December 2026 (PR813656). They do not apply
// to pharmacists and are covered on the pharmacy award page, not here.

import { PHARMACY_AWARD } from "../../constants/modern-awards";
import {
  ANNUAL_WAGE_REVIEW_2026,
  CONSOLIDATED_TO,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  jsaSource,
  jsaUrl,
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  rowFromModernAward,
} from "./common";
import type { MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2515",
  anzscoTitle: "Pharmacists",
  medianWeekly: 1_956,
  medianHourly: 52,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2515-pharmacists"),
};

export const PHARMACIST: Occupation = {
  slug: "pharmacist",
  name: "Pharmacist",
  plural: "pharmacists",
  award: {
    name: "Pharmacy Industry Award 2020",
    code: "MA000012",
    url: awardTextUrl("MA000012"),
    consolidatedTo: CONSOLIDATED_TO,
    awardPageHref: "/pharmacy-award-rates/",
  },
  headline: {
    tableId: "pharmacists",
    label: "Pharmacist",
    why: "a registered pharmacist with less than 4 years' community pharmacy experience",
  },
  coverage: [
    "Pharmacists employed in community (retail) pharmacies are covered by the Pharmacy Industry Award 2020 [MA000012]. The award has four pharmacist classifications, and which one you are on depends on experience and responsibility, not on your job title.",
    "A Pharmacist is registered under the Health Practitioner Regulation National Law. An Experienced pharmacist has at least 4 years' full-time (or part-time equivalent) experience in a community pharmacy. A Pharmacist in charge assumes responsibility for the day-to-day supervision and functioning of the pharmacy, and a Pharmacist manager is responsible to the owner for all aspects of the business (award Schedule A, A.7–A.10).",
    "Hospital pharmacists are not covered by this award. Public hospital pharmacists are paid under state health enterprise agreements, which have their own classifications and rates.",
  ],
  tables: [
    {
      id: "pharmacists",
      title: "Pharmacist minimum pay rates 2026–27",
      intro:
        "Clause 16.1, Table 3 of the award. Casual rates are the award's own Schedule B figures for ordinary hours between 8 am and 7 pm, Monday to Friday.",
      rows: [
        rowFromModernAward(PHARMACY_AWARD, "Pharmacist", "Pharmacist", "Registered pharmacist"),
        rowFromModernAward(PHARMACY_AWARD, "Experienced pharmacist", "Experienced pharmacist", "4+ years' community pharmacy experience"),
        rowFromModernAward(PHARMACY_AWARD, "Pharmacist in charge", "Pharmacist in charge", "Runs the pharmacy day to day"),
        rowFromModernAward(PHARMACY_AWARD, "Pharmacist manager", "Pharmacist manager", "Responsible to the owner for the whole business"),
      ],
    },
    {
      id: "interns",
      title: "Pharmacy student and intern rates",
      intro: "The same Table 3 rates for pharmacy students and for interns completing their supervised practice.",
      rows: [
        rowFromModernAward(PHARMACY_AWARD, "Pharmacy student — 1st year of course"),
        rowFromModernAward(PHARMACY_AWARD, "Pharmacy student — 2nd year of course"),
        rowFromModernAward(PHARMACY_AWARD, "Pharmacy student — 3rd year of course"),
        rowFromModernAward(PHARMACY_AWARD, "Pharmacy student — 4th year of course"),
        rowFromModernAward(PHARMACY_AWARD, "Pharmacy intern — 1st half of training"),
        rowFromModernAward(PHARMACY_AWARD, "Pharmacy intern — 2nd half of training"),
      ],
    },
  ],
  penalties: [
    { when: "Monday–Friday, 7 am to 8 am", permanent: "150%", casual: "175%" },
    { when: "Monday–Friday, 7 pm to 9 pm", permanent: "125%", casual: "150%" },
    { when: "Monday–Friday, 9 pm to midnight", permanent: "150%", casual: "175%" },
    { when: "Saturday, 8 am to 6 pm", permanent: "125%", casual: "150%" },
    { when: "Saturday, 7 am to 8 am", permanent: "200%", casual: "225%" },
    { when: "Saturday, 6 pm to 9 pm", permanent: "150%", casual: "175%" },
    { when: "Saturday, 9 pm to midnight", permanent: "175%", casual: "200%" },
    { when: "Sunday, 7 am to 9 pm", permanent: "150%", casual: "175%" },
    { when: "Sunday, before 7 am or after 9 pm", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "225%", casual: "250%" },
  ],
  penaltiesNote:
    "Percentages of the minimum hourly rate (clause 22.3, Table 6). Casual percentages already include the 25% casual loading. Penalty rates are not added on top of overtime rates (cl 22.2).",
  overtime: [
    "Monday to Saturday: 150% for the first 2 hours, then 200% (cl 21.4, Table 5).",
    "Sunday: 200% all day. Public holiday: 250% all day.",
    "Overtime applies to hours over 38 a week (or 76 over two weeks), over 12 hours in a day, between midnight and 7 am, or outside the agreed roster.",
    "A casual working overtime is paid the overtime rate without the 25% casual loading (cl 21.4(c)).",
  ],
  allowances: [
    {
      name: "Home medicines review / residential medication management review allowance",
      amount: "$106.40 per week",
      note: "For a pharmacist of any classification who is required by the employer to perform HMRs or RMMRs (cl 19).",
    },
  ],
  median: MEDIAN,
  notices: [
    "These are legal minimums. An employer can pay more, and hospital pharmacists are on separate state agreements.",
  ],
  notShown: [
    "Hospital and public-sector pharmacist salaries, which come from state health agreements rather than this award.",
    "Pharmacy assistant junior rates, which change from 1 December 2026 — see the pharmacy award page.",
    "Annualised salary arrangements under clause 18, which must be reconciled against the rates above.",
  ],
  faqs: [
    {
      q: "What is the minimum pay rate for a pharmacist in Australia in 2026?",
      a: "Under the Pharmacy Industry Award 2020, a registered pharmacist must be paid at least $41.74 an hour, or $1,586.30 for a full-time 38-hour week, from the first full pay period on or after 1 July 2026. That is $82,488 a year before tax.",
    },
    {
      q: "How much does an experienced pharmacist earn under the award?",
      a: "An Experienced pharmacist — 4 or more years' full-time experience in community pharmacy — has a minimum of $45.72 an hour or $1,737.40 a week, about $90,345 a year. A Pharmacist manager's minimum is $52.15 an hour or $1,981.60 a week.",
    },
    {
      q: "What is the casual pay rate for a pharmacist?",
      a: "A casual pharmacist earns at least $52.18 an hour for ordinary weekday hours between 8 am and 7 pm, which is the $41.74 minimum plus the 25% casual loading. Evenings, weekends and public holidays attract higher casual rates.",
    },
    {
      q: "What do pharmacists actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,956 a week for pharmacists (ABS Survey of Employee Earnings and Hours, May 2025). That is about $370 a week above the award minimum for a Pharmacist and about $220 above the Experienced pharmacist minimum. The median covers community and hospital pharmacists together.",
    },
    {
      q: "Are hospital pharmacists covered by the Pharmacy Industry Award?",
      a: "No. The award covers community pharmacy. Public hospital pharmacists are paid under their state's health enterprise agreement, which has its own classification structure and rates.",
    },
  ],
  sources: [
    { title: "Pharmacy Industry Award 2020 [MA000012] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000012") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/pharmacy-award-rates/", label: "Pharmacy Award Pay Rates" },
    { href: "/retail-award-rates/", label: "Retail Award Pay Rates" },
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
  ],
};
