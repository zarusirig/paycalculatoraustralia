// Lab technician — Health Professionals and Support Services Award 2020
// [MA000027] for pathology/medical labs, Manufacturing and Associated
// Industries and Occupations Award 2020 [MA000010] for industrial labs
// (T5, wave 3).
//
// Award coverage, read 23 September 2026 from the consolidated texts (both
// "up to and including 1 July 2026"):
//   - HPSS Schedule B lists "Medical Laboratory Technician" among the common
//     health professionals, so a pathology lab technician who meets the
//     requirement to practise is a Health Professional (level 1 on entry,
//     Schedule A.2.1). ROLLED 9 October 2026: from the first full pay period
//     starting on or after 1 October 2026, determination PR814029 sets
//     Medical Laboratory Technician at AQF Level 5 (Schedule B.3); rows are
//     the AQF Level 5 table in ./health-professionals-oct-2026.ts, read
//     9 October 2026 from
//     https://www.fwc.gov.au/documents/awardsandorders/pdf/pr814029.pdf
//   - HPSS Schedule A.1.1 and A.1.3 list "Laboratory assistant" as an
//     indicative Support Services level 1 and level 3 role. Rates: cl 16.2(a)
//     (level 1 $1,024.70 / $26.97; level 3 $1,106.20 / $29.11).
//   - Manufacturing Award Schedule A.3.1: Engineering/Laboratory Technician
//     Level I–V = C9–C5. Rows read from MANUFACTURING_AWARD in
//     lib/constants/modern-awards.ts.
//
// Median: Jobs and Skills Australia, ANZSCO 3112 Medical Technicians (which
// includes medical laboratory technicians), $1,539 a week / $39 an hour; ANZSCO
// 3114 Science Technicians $1,794 / $45 (ABS SEEH May 2025), read 23 Sep 2026.

import { MANUFACTURING_AWARD } from "../../constants/modern-awards";
import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  FWO_PAY_GUIDES,
  casualFromHourly,
  jsaSource,
  jsaUrl,
  rowFromModernAward,
} from "./common";
import { firstYear } from "./allied-health-g3";
import { HPSS_OVERTIME, HPSS_PENALTIES, HPSS_PENALTIES_NOTE } from "./health-professionals-common";
import {
  HPSS_AWARD_OCT_2026,
  HPSS_OCT_2026_NOTICES,
  HPSS_OCT_2026_SOURCES,
  HPSS_OCT_2026_VERIFIED_ON,
  hpssOct2026Label,
  hpssOct2026Level1Table,
} from "./health-professionals-oct-2026";
import type { MedianEarnings, Occupation, RateTable } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "3112",
  anzscoTitle: "Medical Technicians",
  medianWeekly: 1_539,
  medianHourly: 39,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("3112-medical-technicians"),
};

const SCIENCE_TECHNICIANS_MEDIAN_WEEKLY = 1_794;

/** Schedule B.3 (PR814029): Medical Laboratory Technician, AQF Level 5. */
const AQF = 5;
const F = firstYear(AQF);

const TABLES: RateTable[] = [
  {
    ...hpssOct2026Level1Table(AQF, "medical-lab"),
    title: "Medical laboratory technician pay rates — Health Professional level 1 (AQF Level 5)",
    intro:
      "Health Professionals and Support Services Award cl 17.1(a) as substituted by determination PR814029, from the first full pay period starting on or after 1 October 2026. Schedule B sets medical laboratory technicians at AQF Level 5; pay rises with years of experience at Level 1. Casual rates are Schedule C.2.3 exactly.",
  },
  {
    id: "lab-assistant",
    title: "Laboratory assistant — Health Professionals and Support Services Award",
    intro: "Clause 16.2(a), Support Services stream. The award lists laboratory assistant as an indicative role at level 1 and level 3 (Schedule A.1.1, A.1.3).",
    rows: [
      { label: "Support Services level 1 — laboratory assistant", weekly: 1024.7, hourly: 26.97, casualHourly: casualFromHourly(26.97), note: "Under 3 months' industry experience" },
      { label: "Support Services level 3 — laboratory assistant", weekly: 1106.2, hourly: 29.11, casualHourly: casualFromHourly(29.11) },
    ],
  },
  {
    id: "industrial-lab",
    title: "Laboratory technician pay rates in manufacturing — Manufacturing Award",
    intro:
      "Manufacturing Award cl 20.1(a), read from the same constants as the Manufacturing Award page. Engineering/Laboratory Technician Levels I to V are C9 to C5 (Schedule A.3.1).",
    rows: [
      rowFromModernAward(MANUFACTURING_AWARD, "C9 / V6", "C9 — Laboratory Technician Level I"),
      rowFromModernAward(MANUFACTURING_AWARD, "C8 / V7", "C8 — Laboratory Technician Level II"),
      rowFromModernAward(MANUFACTURING_AWARD, "C7", "C7 — Laboratory Technician Level III"),
      rowFromModernAward(MANUFACTURING_AWARD, "C6 / V9", "C6 — Laboratory Technician Level IV"),
      rowFromModernAward(MANUFACTURING_AWARD, "C5 / V10", "C5 — Laboratory Technician Level V"),
    ],
  },
];

export const LAB_TECHNICIAN: Occupation = {
  slug: "lab-technician",
  name: "Lab Technician",
  plural: "lab technicians",
  award: HPSS_AWARD_OCT_2026,
  headline: {
    tableId: "medical-lab",
    label: hpssOct2026Label(AQF),
    why: "a first-year medical laboratory technician at Health Professional level 1 (AQF Level 5, the award's standard qualification level for the role)",
  },
  coverage: [
    "Which award covers a lab technician depends on the lab. Pathology and medical laboratory technicians employed by private pathology companies, private hospitals and other national-system health employers are covered by the Health Professionals and Support Services Award 2020 [MA000027], which lists \"Medical Laboratory Technician\" among its health professionals (Schedule B).",
    `From the first full pay period starting on or after 1 October 2026, a health professional's level 1 rate depends on the AQF level Schedule B gives the profession — AQF Level 5 for a medical laboratory technician — and years of experience at Level 1: ${F.hourly} an hour in the 1st year, ${F.later[0]} in the 2nd and 3rd years, ${F.later[1]} in the 4th to 6th years and ${F.later[2]} from the 7th year. An employer that requires a higher qualification must pay at that qualification's AQF level (cl B.2(d)). Laboratory assistants without those qualifications are Support Services employees: the award lists them at level 1 and level 3.`,
    "Laboratory technicians employed by manufacturers covered by the Manufacturing and Associated Industries and Occupations Award 2020 [MA000010] are classified as Engineering/Laboratory Technicians at Levels I to V (wage groups C9 to C5). Some manufacturing sectors, such as food and beverage manufacturing, have their own awards.",
    "Lab technicians in public hospitals, universities, schools and government agencies are paid under state awards, enterprise agreements or public sector agreements rather than these awards.",
  ],
  tables: TABLES,
  penalties: HPSS_PENALTIES,
  penaltiesNote: `${HPSS_PENALTIES_NOTE} These are the Health Professionals Award rates. Under the Manufacturing Award, weekend work is overtime unless agreed as ordinary hours (150% Saturday, 200% Sunday), and a casual's penalties are calculated on the casual rate — see the Manufacturing Award page.`,
  overtime: HPSS_OVERTIME,
  allowances: [],
  median: MEDIAN,
  notices: [
    ...HPSS_OCT_2026_NOTICES,
    "The Health Professional rows are the PR814029 rates from 1 October 2026. The laboratory assistant (Support Services) and Manufacturing Award rows are unchanged 1 July 2026 rates; all were re-checked against the consolidated awards on 9 October 2026.",
    `The median shown is for medical technicians (ANZSCO 3112). Jobs and Skills Australia reports a higher median of $${SCIENCE_TECHNICIANS_MEDIAN_WEEKLY.toLocaleString("en-AU")} a week for science technicians (ANZSCO 3114), which covers laboratory technicians outside health.`,
  ],
  notShown: [
    "Health Professional levels 2 to 4 for senior technicians and medical scientists — the same table appears on the physiotherapist page.",
    "Manufacturing Award technical officer levels C4 to C2(b), and apprentice and trainee rates.",
    "State public health pathology pay scales.",
  ],
  faqs: [
    {
      q: "What is the award rate for a lab technician in 2026?",
      a: `A first-year medical laboratory technician under the Health Professionals and Support Services Award (Health Professional level 1, AQF Level 5) must be paid at least ${F.hourly} an hour, or ${F.weekly} a week, from the first full pay period starting on or after 1 October 2026 — ${F.annual} a year full-time. The rate rises to ${F.later[0]} an hour in the 2nd and 3rd years.`,
    },
    {
      q: "What is a laboratory assistant paid?",
      a: "Under the Health Professionals and Support Services Award, a laboratory assistant at Support Services level 1 earns at least $26.97 an hour and at level 3 $29.11 an hour. Casual rates add 25%.",
    },
    {
      q: "What does a lab technician earn in manufacturing?",
      a: "Under the Manufacturing Award, an Engineering/Laboratory Technician Level I (C9) earns at least $30.38 an hour, rising to $34.46 at Level V (C5).",
    },
    {
      q: "What is the casual rate for a lab technician?",
      a: `A casual first-year medical laboratory technician earns at least ${F.casual} an hour — the Health Professionals Award's published casual rate. On weekends a casual is paid 175% of the minimum hourly rate.`,
    },
    {
      q: "What do lab technicians actually earn?",
      a: `Jobs and Skills Australia reports median full-time earnings of $1,539 a week for medical technicians and $${SCIENCE_TECHNICIANS_MEDIAN_WEEKLY.toLocaleString("en-AU")} for science technicians (ABS Survey of Employee Earnings and Hours, May 2025).`,
    },
  ],
  sources: [
    ...HPSS_OCT_2026_SOURCES,
    { title: "Manufacturing and Associated Industries and Occupations Award 2020 [MA000010] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: MANUFACTURING_AWARD.meta.awardTextUrl },
    { title: "Science Technicians (ANZSCO 3114) occupation profile", publisher: "Jobs and Skills Australia", url: jsaUrl("3114-science-technicians") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: HPSS_OCT_2026_VERIFIED_ON,
  ratesFrom: "the first full pay period starting on or after 1 October 2026 for the Health Professional rows, and on or after 1 July 2026 for the others",
  related: [
    { href: "/manufacturing-award-rates/", label: "Manufacturing Award Pay Rates" },
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    { href: "/job-pay-rates/physiotherapist/", label: "Physiotherapist Pay Rates" },
    { href: "/job-pay-rates/engineer/", label: "Engineer Pay Rates" },
  ],
};
