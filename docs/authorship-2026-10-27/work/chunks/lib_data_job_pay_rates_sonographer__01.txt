// Sonographer — Health Professionals and Support Services Award 2020 [MA000027]
// (G3, wave 4). Keywords (DataForSEO, AU): sonographer salary 3,600; sonographer pay 3,600; sonographer salary australia 1,300.
// Coverage, headline choice and sources: see allied-health-g3.ts and
// health-professionals-oct-2026.ts. Rates rolled 9 October 2026 to PR814029
// (from 1 October 2026); Schedule B.3 AQF level(s): 8.
//
// Median: Jobs and Skills Australia, ANZSCO 2512 Medical Imaging Professionals, $2,360 a week /
// $60 an hour (ABS SEEH May 2025), read 24 September 2026.
//
// 23 October 2026: public hospital pay by state for VIC, QLD, WA and SA (NSW
// not verified: no sonographer classification in the NSW Health awards read),
// answer box and salary-led title. GSC, 28 days to 21 Oct 2026: 1,886
// impressions, 11 clicks, position 7.7; queries include "sonographer salary
// australia", "graduate sonographer salary" and "entry level sonographer
// salary australia". ATO: Taxation statistics 2023-24, Table 15A, 251214
// Sonographer, Total row, read 23 October 2026.

import { ATO_TABLE_15, ATO_TAXSTATS_INCOME_YEAR, ALL_OCCUPATIONS_MEDIAN_WEEKLY, jsaUrl } from "./common";
import {
  HOSPITAL_PAGES_MODIFIED,
  aud,
  hospitalMetaDescription,
  hospitalSalaryTitle,
  medianAnnual,
  startRangeWords,
  stateRangeWords,
  stepPay,
} from "./public-hospital-common";
import { IMAGING_HOURS_NOTICE, entryParagraph, firstYear, levelsParagraph, sharedFaqs } from "./allied-health-g3";
import {
  HPSS_OCT_2026_NOTICES,
  hpssOct2026Label,
  hpssOct2026Occupation,
  type HpssAqfLevel,
} from "./health-professionals-oct-2026";
import type { AtoOccupationStats, MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2512",
  anzscoTitle: "Medical Imaging Professionals",
  medianWeekly: 2_360,
  medianHourly: 60,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2512-medical-imaging-professionals"),
};

/** Schedule B.3 of the award as varied by PR814029 (read 9 October 2026). */
const AQF: readonly HpssAqfLevel[] = [8];

export const SONOGRAPHER_ATO: AtoOccupationStats = {
  incomeYear: ATO_TAXSTATS_INCOME_YEAR,
  intro: "The ATO codes sonographers separately from radiographers, who share the same Jobs and Skills Australia group.",
  rows: [
    { code: "251214", title: "Sonographer", individuals: 4_749, avgTaxableIncome: 112_903, medianTaxableIncome: 111_487, avgSalary: 108_440, medianSalary: 109_756 },
  ],
};

const MEDIAN_YEAR = medianAnnual(MEDIAN);
const FIRST_YEAR = firstYear(AQF[0]);

const BASE = hpssOct2026Occupation(AQF, {
  slug: "sonographer",
  name: "Sonographer",
  plural: "sonographers",
  headlineLabel: hpssOct2026Label(AQF[0]),
  why: "a first-year sonographer at AQF Level 8, the award's standard qualification level for the profession",
  coverage: [
    "Sonographers employed by private ultrasound and medical imaging practices, private hospitals and other national-system health employers are covered by the Health Professionals and Support Services Award 2020 [MA000027]. Schedule B lists \"Sonographer\" at AQF Level 8.",
    entryParagraph("sonographers", AQF),
    levelsParagraph("sonographers"),
    "Sonographers in state public hospitals are paid under that state's award or agreement, not this award; those rates are in the public hospital section above. A sonographer engaged as a genuine contractor has no award minimum.",
  ],
  median: MEDIAN,
  notices: [
    ...HPSS_OCT_2026_NOTICES,
    IMAGING_HOURS_NOTICE,
  ],
  faqs: [
    {
      q: "How much does a sonographer earn in Australia?",
      a: `Medical imaging professionals, the group that includes sonographers, earn a median of ${aud(MEDIAN.medianWeekly)} a week full-time, about ${aud(MEDIAN_YEAR)} a year (Jobs and Skills Australia, May 2025). On 2023-24 tax returns, sonographers had an average taxable income of ${aud(SONOGRAPHER_ATO.rows[0].avgTaxableIncome)}. In public hospitals, state scales start ${startRangeWords("sonographer")}. The award minimum for a first-year sonographer in private practice is ${FIRST_YEAR.hourly} an hour.`,
    },
    {
      q: "What is a graduate sonographer salary?",
      a: `Victoria's public hospitals pay sonographers on their own scale: ${stepPay("sonographer", "VIC", "Grade 1, year 1")} for a student sonographer (Grade 1), ${stepPay("sonographer", "VIC", "Grade 2, year 1")} for a trainee (Grade 2) and ${stepPay("sonographer", "VIC", "Grade 3, year 1")} once qualified (Grade 3, year 1). The shared allied health scales start at ${stepPay("sonographer", "QLD", "HP3.0")} in Queensland (HP3.0), ${stepPay("sonographer", "WA", "P-1.1")} in WA (P-1.1) and ${stepPay("sonographer", "SA", "AHP-1, increment 1 (3-year degree start)")} in SA (AHP-1). The private-sector award minimum for a first-year sonographer is ${FIRST_YEAR.hourly} an hour.`,
    },
    {
      q: "How much does a public hospital sonographer earn in each state?",
      a: `From the first qualified step to the top of the scale: Victoria ${stateRangeWords("sonographer", "VIC")}; Queensland ${stateRangeWords("sonographer", "QLD")}; WA ${stateRangeWords("sonographer", "WA")}; SA ${stateRangeWords("sonographer", "SA")}. NSW is not shown yet.`,
    },
    ...sharedFaqs("Sonographer", "sonographers", AQF),
  ],
  related: [
    { href: "/job-pay-rates/radiographer/", label: "Radiographer Pay Rates" },
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    { href: "/contractor-vs-employee-calculator/", label: "Contractor vs Employee Calculator" },
  ],
});

export const SONOGRAPHER: Occupation = {
  ...BASE,
  metaTitle: hospitalSalaryTitle("Sonographer", MEDIAN),
  heading: "Sonographer Salary Australia 2026: Hospital Pay by State and Award Rates",
  metaDescription: hospitalMetaDescription("Sonographer", "sonographer", MEDIAN),
  lede: `Medical imaging professionals, the group that includes sonographers, earn a median of ${aud(MEDIAN.medianWeekly)} a week full-time, about ${aud(MEDIAN_YEAR)} a year (Jobs and Skills Australia). In public hospitals each state sets the pay, on scales that start ${startRangeWords("sonographer")}. The award minimum for private practices is ${FIRST_YEAR.hourly} an hour.`,
  answerQuestion: "How much does a sonographer earn in Australia?",
  ato: SONOGRAPHER_ATO,
  publicHospital: {
    profession: "sonographer",
    intro:
      "Sonographers in public hospitals are paid under their state's award or agreement, not the federal award further down this page. Victoria has its own sonographer scale; Queensland, WA and SA pay sonographers on their shared allied health scales. These are the rates in force on 23 October 2026.",
  },
  sources: [...BASE.sources, ATO_TABLE_15],
  dateModified: HOSPITAL_PAGES_MODIFIED,
};
