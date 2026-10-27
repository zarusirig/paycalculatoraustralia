// Radiographer — Health Professionals and Support Services Award 2020 [MA000027]
// (G3, wave 4). Keywords (DataForSEO, AU): radiographer salary 3,600; radiographer salary australia 1,000.
// Coverage, headline choice and sources: see allied-health-g3.ts and
// health-professionals-oct-2026.ts. Rates rolled 9 October 2026 to PR814029
// (from 1 October 2026); Schedule B.3 AQF level(s): 7.
//
// Median: Jobs and Skills Australia, ANZSCO 2512 Medical Imaging Professionals, $2,360 a week /
// $60 an hour (ABS SEEH May 2025), read 24 September 2026.
//
// 23 October 2026: salary-led title, answer box and public hospital pay by
// state (lib/data/public-health-allied-pay). GSC, 28 days to 21 Oct 2026:
// 3,393 impressions, 38 clicks, CTR 1.12%, position 6.8. FAQs follow the
// queries seen: "graduate radiographer salary", "level 2 radiographer salary",
// "radiographer salary nsw / victoria", "senior radiographer salary".
// ATO: Taxation statistics 2023-24, Table 15A, 251211 Radiographer, Total row,
// read 23 October 2026.

import { ATO_TABLE_15, ATO_TAXSTATS_INCOME_YEAR, ALL_OCCUPATIONS_MEDIAN_WEEKLY, jsaUrl } from "./common";
import { IMAGING_HOURS_NOTICE, entryParagraph, firstYear, levelsParagraph, sharedFaqs } from "./allied-health-g3";
import { HPSS_OCT_2026_SENIOR } from "./health-professionals-common";
import {
  HPSS_OCT_2026_NOTICES,
  hpssOct2026Label,
  hpssOct2026Occupation,
  type HpssAqfLevel,
} from "./health-professionals-oct-2026";
import {
  HOSPITAL_PAGES_MODIFIED,
  aud,
  aud2,
  hospitalMetaDescription,
  hospitalSalaryTitle,
  medianAnnual,
  startRangeWords,
  stateRangeWords,
  stepPay,
  stepWeekly,
} from "./public-hospital-common";
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
const AQF: readonly HpssAqfLevel[] = [7];

export const RADIOGRAPHER_ATO: AtoOccupationStats = {
  incomeYear: ATO_TAXSTATS_INCOME_YEAR,
  intro:
    "The ATO codes radiographers separately from sonographers, radiation therapists and nuclear medicine technologists, who share the same Jobs and Skills Australia group.",
  rows: [
    { code: "251211", title: "Radiographer", individuals: 13_566, avgTaxableIncome: 104_270, medianTaxableIncome: 103_256, avgSalary: 101_067, medianSalary: 102_607 },
  ],
};

const MEDIAN_YEAR = medianAnnual(MEDIAN);
const FIRST_YEAR = firstYear(AQF[0]);

const BASE = hpssOct2026Occupation(AQF, {
  slug: "radiographer",
  name: "Radiographer",
  plural: "radiographers",
  headlineLabel: hpssOct2026Label(AQF[0]),
  why: "a first-year radiographer at AQF Level 7, the award's standard qualification level for the profession",
  coverage: [
    "Radiographers employed by private radiology and medical imaging practices, private hospitals and other national-system health employers are covered by the Health Professionals and Support Services Award 2020 [MA000027]. Schedule B lists the Medical Imaging Technologist, expressly including the medical radiographer.",
    entryParagraph("radiographers", AQF),
    levelsParagraph("radiographers"),
    "Radiographers in state public hospitals and health services are paid under that state's award or agreement, not this award. Those rates are in the public hospital section above.",
  ],
  median: MEDIAN,
  notices: [
    ...HPSS_OCT_2026_NOTICES,
    IMAGING_HOURS_NOTICE,
  ],
  faqs: [
    {
      q: "How much does a radiographer earn in Australia?",
      a: `Medical imaging professionals, the group that includes radiographers, earn a median of ${aud(MEDIAN.medianWeekly)} a week full-time, about ${aud(MEDIAN_YEAR)} a year (Jobs and Skills Australia, May 2025). On 2023-24 tax returns, radiographers had an average taxable income of ${aud(RADIOGRAPHER_ATO.rows[0].avgTaxableIncome)}. In public hospitals, state scales start ${startRangeWords("radiographer")}. The award minimum for private practices is ${FIRST_YEAR.hourly} an hour.`,
    },
    {
      q: "What is a graduate radiographer salary?",
      a: `In NSW Health a new graduate with full registration starts on Level 2, year 1: ${stepWeekly("radiographer", "NSW", "Level 2, year 1")} a week, ${stepPay("radiographer", "NSW", "Level 2, year 1")} a year (the supervised Level 1 year pays ${stepPay("radiographer", "NSW", "Level 1, year 1")}). A new graduate starts on ${stepPay("radiographer", "VIC", "Grade 1, year 1")} in Victoria (Grade 1, year 1), ${stepPay("radiographer", "QLD", "HP3.0")} in Queensland (HP3.0, or ${stepPay("radiographer", "QLD", "HP3.1")} on HP3.1 where the job needs a four-year degree), ${stepPay("radiographer", "WA", "P-1.1")} in WA (P-1.1, or ${stepPay("radiographer", "WA", "P-1.2")} with a four-year degree) and ${stepPay("radiographer", "SA", "AHP-1, increment 1 (3-year degree start)")} in SA. The private-sector award minimum for a first-year radiographer is ${FIRST_YEAR.hourly} an hour.`,
    },
    {
      q: "What does a level 2 radiographer earn?",
      a: `In NSW Health, Level 2 radiographers earn ${stepWeekly("radiographer", "NSW", "Level 2, year 1")} to ${stepWeekly("radiographer", "NSW", "Level 2, year 5")} a week, ${stepPay("radiographer", "NSW", "Level 2, year 1")} to ${stepPay("radiographer", "NSW", "Level 2, year 5")} a year, moving up one year at a time. In Victoria, Grade 2 pays ${stepPay("radiographer", "VIC", "Grade 2, year 1")} to ${stepPay("radiographer", "VIC", "Grade 2, year 4")}.`,
    },
    {
      q: "How much does a public hospital radiographer earn in each state?",
      a: `From the first qualified step to the top of the scale: NSW ${stateRangeWords("radiographer", "NSW")}; Victoria ${stateRangeWords("radiographer", "VIC")}; Queensland ${stateRangeWords("radiographer", "QLD")}; WA ${stateRangeWords("radiographer", "WA")}; SA ${stateRangeWords("radiographer", "SA")}. NSW rates are for a 35-hour week.`,
    },
    {
      q: "What is a senior radiographer salary?",
      a: `Senior roles start at Level 3 in NSW Health, where a specialist radiographer (Level 3, grade 1, year 1) earns ${stepPay("radiographer", "NSW", "Level 3, grade 1, year 1")}. In Queensland, HP4 (experienced clinicians who work with little supervision, and small-team managers) starts at HP4.1, ${stepPay("radiographer", "QLD", "HP4.1")}, and in Victoria Grade 3 starts at ${stepPay("radiographer", "VIC", "Grade 3, year 1")}. Under the federal award, a Level 2 senior clinician earns at least ${aud2(HPSS_OCT_2026_SENIOR[0].hourly)} an hour.`,
    },
    ...sharedFaqs("Radiographer", "radiographers", AQF),
  ],
  related: [
    { href: "/job-pay-rates/sonographer/", label: "Sonographer Pay Rates" },
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    { href: "/salary-packaging-guide/", label: "Salary Packaging Guide" },
  ],
});

export const RADIOGRAPHER: Occupation = {
  ...BASE,
  metaTitle: hospitalSalaryTitle("Radiographer", MEDIAN),
  heading: "Radiographer Salary Australia 2026: Hospital Pay by State and Award Rates",
  metaDescription: hospitalMetaDescription("Radiographer", "radiographer", MEDIAN),
  lede: `Medical imaging professionals, the group that includes radiographers, earn a median of ${aud(MEDIAN.medianWeekly)} a week full-time, about ${aud(MEDIAN_YEAR)} a year (Jobs and Skills Australia). In public hospitals each state sets the pay, on scales that start ${startRangeWords("radiographer")} and rise to chief radiographer rates. The award minimum for private practices is ${FIRST_YEAR.hourly} an hour.`,
  answerQuestion: "How much does a radiographer earn in Australia?",
  ato: RADIOGRAPHER_ATO,
  publicHospital: {
    profession: "radiographer",
    intro:
      "Radiographers in public hospitals are paid under their state's award or agreement, not the federal award further down this page. Each state has its own grades, from a new graduate to a chief radiographer. These are the rates in force on 23 October 2026.",
  },
  sources: [...BASE.sources, ATO_TABLE_15],
  dateModified: HOSPITAL_PAGES_MODIFIED,
};
