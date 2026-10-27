// Occupational therapist — Health Professionals and Support Services Award
// 2020 [MA000027]. Penalties live in health-professionals-common.ts; the rate
// tables are the 1 October 2026 structure in health-professionals-oct-2026.ts.
//
// Rolled 9 October 2026 to determination PR814029 (operative from the first
// full pay period starting on or after 1 October 2026), read 9 October 2026:
// https://www.fwc.gov.au/documents/awardsandorders/pdf/pr814029.pdf
// Schedule B.3 lists Occupational Therapist at AQF Level 7 only, so a new
// graduate is "AQF Level 7—1st year": $1,308.80 a week, $34.44 an hour,
// casual $43.05 (cl 17.1(c), Schedule C.2.3). The old pay points 2–4 (by
// degree length) no longer set a new graduate's rate.
//
// Median: Jobs and Skills Australia, ANZSCO 2524 Occupational Therapists,
// $1,913 a week / $50 an hour (ABS SEEH May 2025), read 23 September 2026.
//
// 23 October 2026: public hospital pay by state (the same NSW, VIC, QLD, WA
// and SA allied health scales as the physiotherapist page), answer box and
// salary-led title. GSC, 28 days to 21 Oct 2026: 2,096 impressions, 47
// clicks, position 7.8; queries include "occupational therapist salary", "ot
// hourly rate" and "graduate occupational therapist salary australia". ATO:
// Taxation statistics 2023-24, Table 15A, 252411 Occupational therapist,
// Total row, read 23 October 2026.

import { ATO_TABLE_15, ATO_TAXSTATS_INCOME_YEAR, ALL_OCCUPATIONS_MEDIAN_WEEKLY, jsaUrl } from "./common";
import { HPSS_OCT_2026_NOTICES, hpssOct2026Occupation } from "./health-professionals-oct-2026";
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
import type { AtoOccupationStats, MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2524",
  anzscoTitle: "Occupational Therapists",
  medianWeekly: 1_913,
  medianHourly: 50,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2524-occupational-therapists"),
};

export const OCCUPATIONAL_THERAPIST_ATO: AtoOccupationStats = {
  incomeYear: ATO_TAXSTATS_INCOME_YEAR,
  intro:
    "The ATO codes occupational therapists as one occupation (252411). Tax-return figures count part-time and part-year therapists as well as full-timers.",
  rows: [
    { code: "252411", title: "Occupational therapist", individuals: 25_828, avgTaxableIncome: 80_845, medianTaxableIncome: 77_046, avgSalary: 72_306, medianSalary: 72_861 },
  ],
};

const MEDIAN_YEAR = medianAnnual(MEDIAN);

const BASE = hpssOct2026Occupation(7, {
  slug: "occupational-therapist",
  name: "Occupational Therapist",
  plural: "occupational therapists",
  headlineLabel: "Level 1 — AQF 7 — 1st year",
  why: "a first-year occupational therapist (AQF Level 7, the award's standard qualification for the profession)",
  coverage: [
    "Occupational therapists employed in private practice, private hospitals, NDIS providers and other health businesses are covered by the Health Professionals and Support Services Award 2020 [MA000027]. The award's Schedule B lists occupational therapist as one of the health professionals it covers.",
    "From the first full pay period starting on or after 1 October 2026, Level 1 pay depends on the AQF level of the profession's standard minimum qualification and your years of experience in the profession at Level 1. Schedule B sets occupational therapy at AQF Level 7, so a new graduate starts on the AQF Level 7 1st-year rate and moves to the 2nd–3rd year, 4th–6th year and 7th year+ rates with experience. An employer that requires a higher qualification must pay at that qualification's AQF level (cl B.2(d)).",
    "Level 2 is a senior clinician, specialist, supervisor or educator (Level 2.1 with under 5 years in that role, 2.2 with 5 or more); Level 3 is an advanced clinician, senior specialist or section manager; Level 4 is a manager.",
    "Occupational therapists employed by a state public health service are paid under that state's allied health award or agreement instead; those rates are in the public hospital section above.",
  ],
  median: MEDIAN,
  notices: [
    ...HPSS_OCT_2026_NOTICES,
  ],
  faqs: [
    {
      q: "How much does an occupational therapist earn in Australia?",
      a: `Full-time occupational therapists earn a median of ${aud(MEDIAN.medianWeekly)} a week, about ${aud(MEDIAN_YEAR)} a year (Jobs and Skills Australia, May 2025). On 2023-24 tax returns, which include part-timers, the average taxable income was ${aud(OCCUPATIONAL_THERAPIST_ATO.rows[0].avgTaxableIncome)}. In public hospitals, state scales start ${startRangeWords("occupational-therapist")}. The award minimum for a first-year OT in private practice is $34.44 an hour.`,
    },
    {
      q: "What is a graduate occupational therapist salary in Australia?",
      a: `In a public hospital a new graduate OT starts on ${stepPay("occupational-therapist", "NSW", "Level 1, year 1")} in NSW (Level 1, year 1, or ${stepPay("occupational-therapist", "NSW", "Level 1, year 2")} with a degree of more than three years), ${stepPay("occupational-therapist", "VIC", "Grade 1, year 1")} in Victoria, ${stepPay("occupational-therapist", "QLD", "HP3.0")} in Queensland (or ${stepPay("occupational-therapist", "QLD", "HP3.1")} on HP3.1 where the job needs a four-year degree), ${stepPay("occupational-therapist", "WA", "P-1.1")} in WA (or ${stepPay("occupational-therapist", "WA", "P-1.2")} with a four-year degree) and ${stepPay("occupational-therapist", "SA", "AHP-1, increment 1 (3-year degree start)")} in SA. In private practice the award minimum is $34.44 an hour, $68,058 a year.`,
    },
    {
      q: "What is an OT's hourly rate?",
      a: `Jobs and Skills Australia puts the median for occupational therapists at ${aud(MEDIAN.medianHourly)} an hour (May 2025). The award minimum is $34.44 an hour in the first year and $43.05 for a first-year casual. Public hospitals pay a weekly or yearly salary rather than an hourly rate.`,
    },
    {
      q: "How much does an occupational therapist earn in each state's public hospitals?",
      a: `From the first qualified step to the top of the scale: NSW ${stateRangeWords("occupational-therapist", "NSW")}; Victoria ${stateRangeWords("occupational-therapist", "VIC")}; Queensland ${stateRangeWords("occupational-therapist", "QLD")}; WA ${stateRangeWords("occupational-therapist", "WA")}; SA ${stateRangeWords("occupational-therapist", "SA")}.`,
    },
    {
      q: "What is the award rate for an occupational therapist in 2026?",
      a: "A first-year occupational therapist must be paid at least $34.44 an hour, or $1,308.80 a week, under the Health Professionals and Support Services Award from the first full pay period starting on or after 1 October 2026. That is $68,058 a year full-time before tax. The award sets occupational therapy at AQF Level 7, so the starting rate no longer depends on whether your degree took three, four or more years.",
    },
    {
      q: "What is the casual rate for an occupational therapist?",
      a: "A casual first-year (AQF Level 7) occupational therapist earns at least $43.05 an hour, the award rate plus the 25% casual loading. On a Saturday or Sunday a casual gets 175% of the minimum hourly rate and on a public holiday 275%.",
    },
    {
      q: "How fast does an occupational therapist's pay go up?",
      a: "At Level 1 the rate rises with years of experience in the profession: $34.44 an hour in the 1st year, $37.08 in the 2nd and 3rd years, $41.19 in the 4th to 6th years and $44.46 from the 7th year. Moving to Level 2 ($51.19 an hour at Level 2.1) depends on taking on a senior clinician, specialist, supervisor or educator role, not just time served.",
    },
    {
      q: "Do occupational therapists get penalty rates?",
      a: "Yes, under the award. Ordinary hours worked between midnight Friday and midnight Sunday are paid at 150%, shiftwork at 115% and public holidays at 250%. Overtime is 150% for the first 2 hours, then 200%.",
    },
  ],
  related: [
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    { href: "/salary-packaging-guide/", label: "Salary Packaging Guide" },
    { href: "/overtime-penalty-rates-guide/", label: "Overtime & Penalty Rates Guide" },
    { href: "/health-professionals-award-rates/", label: "Health Professionals Award Rates" },
  ],
});

export const OCCUPATIONAL_THERAPIST: Occupation = {
  ...BASE,
  metaTitle: hospitalSalaryTitle("Occupational Therapist", MEDIAN),
  heading: "Occupational Therapist Salary Australia 2026: Hospital Pay by State",
  metaDescription: hospitalMetaDescription("Occupational therapist", "occupational-therapist", MEDIAN),
  lede: `Full-time occupational therapists earn a median of ${aud(MEDIAN.medianWeekly)} a week, about ${aud(MEDIAN_YEAR)} a year, or ${aud(MEDIAN.medianHourly)} an hour (Jobs and Skills Australia). In public hospitals each state sets the pay, on scales that start ${startRangeWords("occupational-therapist")}. The award minimum in private practice is $34.44 an hour.`,
  answerQuestion: "How much does an occupational therapist earn in Australia?",
  ato: OCCUPATIONAL_THERAPIST_ATO,
  publicHospital: {
    profession: "occupational-therapist",
    intro:
      "Occupational therapists in public hospitals are paid under their state's allied health award or agreement, not the federal award further down this page. These are the rates in force on 23 October 2026.",
  },
  sources: [...BASE.sources, ATO_TABLE_15],
  dateModified: HOSPITAL_PAGES_MODIFIED,
};
