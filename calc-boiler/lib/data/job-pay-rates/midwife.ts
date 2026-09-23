// Midwife — Nurses Award 2020 [MA000034] (T5, wave 3).
//
// The Nurses Award has NO separate midwife classification. Its coverage clause
// (cl 4.1(b)) reaches "employers who employ a nurse/midwife, principally
// engaged in nursing/midwifery duties comprehended by the classifications
// listed in Schedule A", and Schedule A.2 says "nursing care also includes
// care provided by midwives". A registered midwife is therefore paid on the
// registered nurse ladder. Read from the consolidated award ("incorporates all
// amendments up to and including 1 August 2026 (PR812118)") on 23 September
// 2026.
//
// Rates are NOT re-typed: they come from lib/data/nursing-pay/nurses-award-2020.ts
// via nursesAwardRows() in ./nurse.ts, so this page and /job-pay-rates/nurse/
// cannot disagree.
//
// State public hospitals: the state figures quoted in prose are read from the
// state nursing-pay data files (NSW state award; Queensland EB12), which are
// the same objects the /healthcare-worker-pay/{state}/ pages render.
//
// Median: Jobs and Skills Australia, ANZSCO 2541 Midwives, $2,114 a week /
// $56 an hour (ABS SEEH May 2025), read 23 September 2026.

import { NURSES_AWARD, NURSES_AWARD_AGED_CARE, NURSES_AWARD_GENERAL } from "../nursing-pay/nurses-award-2020";
import { NSW_NURSING_PAY } from "../nursing-pay/nsw";
import { QLD_NURSING_PAY } from "../nursing-pay/qld";
import type { NursingStateData } from "../nursing-pay/types";
import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  jsaSource,
  jsaUrl,
} from "./common";
import { NURSE_STATE_PAGES, nursesAwardRows } from "./nurse";
import type { MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2541",
  anzscoTitle: "Midwives",
  medianWeekly: 2_114,
  medianHourly: 56,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2541-midwives"),
};

/** First pay point of a state's "Registered Nurse/Midwife" scale, straight from the state data file. */
function firstMidwifePoint(state: NursingStateData, label: string) {
  const scale = state.scales.find((s) => s.classification === "Registered Nurse/Midwife");
  const point = scale?.points.find((p) => p.label === label);
  if (!point) throw new Error(`midwife: ${state.code} has no Registered Nurse/Midwife point ${label}`);
  return point;
}

const NSW_FIRST_YEAR = firstMidwifePoint(NSW_NURSING_PAY, "1st year");
const QLD_PAY_POINT_1 = firstMidwifePoint(QLD_NURSING_PAY, "Pay point 1");

const fmt = (n: number) => n.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmt0 = (n: number) => n.toLocaleString("en-AU", { maximumFractionDigits: 0 });

export const MIDWIFE: Occupation = {
  slug: "midwife",
  name: "Midwife",
  plural: "midwives",
  award: {
    name: NURSES_AWARD.name,
    code: NURSES_AWARD.code,
    url: awardTextUrl(NURSES_AWARD.code),
    consolidatedTo: "1 August 2026",
    awardPageHref: "/nurses-award-rates/",
  },
  headline: {
    tableId: "registered-midwife",
    label: "Registered nurse level 1 — Pay point 1",
    why: "a newly registered midwife outside a state public hospital, who is paid on the award's registered nurse level 1 ladder",
  },
  coverage: [
    "Midwives employed by private hospitals, private obstetric and GP practices, agencies and other national-system employers are covered by the Nurses Award 2020 [MA000034]. The award covers \"a nurse/midwife, principally engaged in nursing/midwifery duties\" (cl 4.1(b)) and says nursing care \"includes care provided by midwives\" (Schedule A.2).",
    "There is no separate midwife pay scale in the award. A registered midwife is paid on the registered nurse classifications: level 1 for a midwife in clinical practice, moving up one pay point each year of experience to pay point 8, then level 2 (which the award says \"may also be known as a Clinical nurse\") and level 3 (Clinical nurse consultant, Nurse manager or Nurse educator) under Schedule A.5.2–A.5.3.",
    `Most Australian midwives work in state public hospitals, and they are not paid under this award. Each state sets midwives' pay in its own award or enterprise agreement, and those rates are well above the federal floor — a first-year registered nurse/midwife in NSW Health earns $${fmt(NSW_FIRST_YEAR.weekly ?? 0)} a week, and Queensland Health's Nurse Grade 5 pay point 1 is $${fmt0(QLD_PAY_POINT_1.annual ?? 0)} a year. The state pages linked below list every public-sector step.`,
    "NSW, Queensland, Western Australia and South Australia pay registered nurses and midwives on one shared scale. Victoria gives midwives their own classification codes (Midwife Grade 2, Year 1–8) but pays the same base rate as the equivalent registered nurse grade.",
  ],
  tables: [
    {
      id: "registered-midwife",
      title: "Midwife pay rates under the Nurses Award — registered nurse level 1",
      intro:
        "Clause 15.1, general stream, from the first full pay period on or after 1 July 2026 (PR799315). A registered midwife is paid on this ladder. Casual is the hourly rate plus the 25% loading, matching Schedule B.1.3.",
      rows: nursesAwardRows("Registered nurse — level 1", NURSES_AWARD_GENERAL, "Registered nurse level 1"),
    },
    {
      id: "clinical-midwife",
      title: "Senior midwife roles — registered nurse levels 2 and 3",
      intro: "Clause 15.1, general stream. Schedule A.5.2 says level 2 may be known as a Clinical nurse; A.5.3 says level 3 may be known as a Clinical nurse consultant, Nurse manager or Nurse educator.",
      rows: [
        ...nursesAwardRows("Registered nurse — level 2", NURSES_AWARD_GENERAL, "Registered nurse level 2"),
        ...nursesAwardRows("Registered nurse — level 3", NURSES_AWARD_GENERAL, "Registered nurse level 3"),
      ],
    },
    {
      id: "aged-care-stream",
      title: "Registered nurse/midwife in aged care — Nurses Award aged care stream",
      intro:
        "Clause 15.3, from the first full pay period on or after 1 August 2026 (PR812118). Applies only to aged care employees, and shown for completeness: a midwife working as a registered nurse in aged care is paid on this stream.",
      rows: nursesAwardRows("Registered nurse — aged care level 1", NURSES_AWARD_AGED_CARE, "Aged care RN level 1"),
    },
  ],
  penalties: [
    { when: "Afternoon shift, Monday–Friday", permanent: "112.5%", casual: "137.5%" },
    { when: "Night shift, Monday–Friday", permanent: "115%", casual: "140%" },
    { when: "Saturday", permanent: "150%", casual: "187.5%" },
    { when: "Sunday", permanent: "175%", casual: "218.75%" },
    { when: "Public holiday", permanent: "200%", casual: "250%" },
  ],
  penaltiesNote:
    "Percentages of the minimum hourly rate, from Schedule B.1.3 of the Nurses Award. A casual's weekend and public holiday rates are 150%, 175% and 200% of the casual hourly rate, which is why they sit higher than a simple +25%. State public hospital midwives have their own shift and weekend rates under their state agreement.",
  overtime: [
    "Full-time and part-time: 150% for the first 2 hours Monday to Saturday, then 200%; Sunday 200%; public holiday 250% (Schedule B.1.3(b)).",
    "On-call and recall rules for midwives in public hospitals are set by each state's agreement, not this award.",
  ],
  allowances: [],
  median: MEDIAN,
  notices: [
    "Work in a state public hospital or a public birthing unit? This award is not your pay scale. Use the state nurse and midwife pay pages linked on this page, which quote each state's own instrument.",
  ],
  notShown: [
    "Endorsed midwife, sole midwife and other state-specific midwifery allowances — these come from state agreements (for example Victoria's Appendix 2 Part 2), not the Nurses Award.",
    "Registered nurse levels 4 and 5 and nurse practitioner rates — see the nurse pay page and the healthcare worker pay hub.",
    "ACT and NT public sector midwife scales, which we have not yet verified.",
  ],
  faqs: [
    {
      q: "What is the award rate for a midwife in 2026?",
      a: "Midwives covered by the Nurses Award are paid on the registered nurse scale. A newly registered midwife (registered nurse level 1, pay point 1) must be paid at least $32.09 an hour, or $1,219.50 a week, from the first full pay period on or after 1 July 2026 — $63,414 a year full-time before tax. It rises to $38.57 an hour at pay point 8.",
    },
    {
      q: "Is there a separate pay scale for midwives?",
      a: "Not in the Nurses Award, which pays registered midwives on the registered nurse classifications. Among the states, Victoria gives midwives their own classification codes but at the same base rate as the equivalent registered nurse grade; NSW, Queensland, WA and SA use one shared nurse/midwife scale.",
    },
    {
      q: "How much do midwives earn in public hospitals?",
      a: `Far more than the award minimum. A first-year registered nurse/midwife in NSW Health earns $${fmt(NSW_FIRST_YEAR.weekly ?? 0)} a week under the state award, and Queensland Health's Nurse Grade 5 pay point 1 is $${fmt0(QLD_PAY_POINT_1.annual ?? 0)} a year. See the state pages for every step.`,
    },
    {
      q: "What is the casual rate for a midwife?",
      a: "A casual midwife on registered nurse level 1 pay point 1 earns at least $40.11 an hour under the Nurses Award — the $32.09 rate plus the 25% casual loading. On a Saturday a casual gets 150% of that casual rate, $60.17 an hour.",
    },
    {
      q: "What do midwives actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $2,114 a week for midwives (ABS, May 2025), about $109,928 a year. That reflects state public sector agreements and above-award pay, not the award minimum.",
    },
  ],
  sources: [
    { title: "Nurses Award 2020 [MA000034] — consolidated to 1 August 2026", publisher: "Fair Work Commission", url: awardTextUrl(NURSES_AWARD.code) },
    { title: NSW_NURSING_PAY.instruments[0].source.title, publisher: NSW_NURSING_PAY.instruments[0].source.publisher, url: NSW_NURSING_PAY.instruments[0].source.url },
    { title: QLD_NURSING_PAY.instruments[0].source.title, publisher: QLD_NURSING_PAY.instruments[0].source.publisher, url: QLD_NURSING_PAY.instruments[0].source.url },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/job-pay-rates/nurse/", label: "Nurse Pay Rates" },
    { href: "/nurses-award-rates/", label: "Nurses Award Pay Rates" },
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    ...NURSE_STATE_PAGES.map((p) => ({ href: p.href, label: p.label.replace("Nurse pay", "Nurse & midwife pay") })),
  ],
};
