// Psychologist — Health Professionals and Support Services Award 2020
// [MA000027]. Penalties live in health-professionals-common.ts; the rate
// tables are the 1 October 2026 structure in health-professionals-oct-2026.ts.
//
// Rolled 9 October 2026 to determination PR814029 (operative from the first
// full pay period starting on or after 1 October 2026), read 9 October 2026:
// https://www.fwc.gov.au/documents/awardsandorders/pdf/pr814029.pdf
// Schedule B.3 lists Psychologist at AQF Level 9 only (a masters-level
// qualification), so a newly qualified psychologist is "AQF Level 9—1st
// year": $1,444.90 a week, $38.02 an hour, casual $47.53 (cl 17.1(e),
// Schedule C.2.3).
//
// Median: Jobs and Skills Australia, ANZSCO 2723 Psychologists and
// Psychotherapists, $2,204 a week / $60 an hour (ABS SEEH May 2025), read
// 23 September 2026. The page slug on JSA is 2723-psychologists-and-psychotherapists.
//
// 23 October 2026: salary-led title, answer box and public hospital pay by
// state (lib/data/public-health-allied-pay). GSC, 28 days to 21 Oct 2026:
// 384 impressions, 11 clicks, CTR 2.86%, position 5.6. Queries seen: "how
// much do psychologists earn in australia", "hourly rate for psychologist",
// "psychologist pay rate", "starting salary". ATO: Taxation statistics
// 2023-24, Table 15A, Total rows for the five 2723 codes, read 23 October 2026.

import { ATO_TABLE_15, ATO_TAXSTATS_INCOME_YEAR, ALL_OCCUPATIONS_MEDIAN_WEEKLY, jsaUrl } from "./common";
import { HPSS_OCT_2026_NOTICES, hpssOct2026Occupation } from "./health-professionals-oct-2026";
import {
  HOSPITAL_PAGES_MODIFIED,
  aud,
  hospitalMetaDescription,
  hospitalSalaryTitle,
  medianAnnual,
  stateRangeWords,
  stepPay,
} from "./public-hospital-common";
import type { AtoOccupationStats, MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2723",
  anzscoTitle: "Psychologists and Psychotherapists",
  medianWeekly: 2_204,
  medianHourly: 60,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2723-psychologists-and-psychotherapists"),
};

export const PSYCHOLOGIST_ATO: AtoOccupationStats = {
  incomeYear: ATO_TAXSTATS_INCOME_YEAR,
  intro:
    "The ATO splits psychologists into five codes. \"Psychologist - other\" covers psychologists not coded to one of the four named types.",
  takeHomeRows: 2,
  rows: [
    { code: "272311", title: "Clinical psychologist", individuals: 8_342, avgTaxableIncome: 103_071, medianTaxableIncome: 97_043, avgSalary: 80_283, medianSalary: 77_858 },
    { code: "272399", title: "Psychologist - other", individuals: 14_141, avgTaxableIncome: 91_250, medianTaxableIncome: 84_065, avgSalary: 75_902, medianSalary: 74_152 },
    { code: "272312", title: "Educational psychologist", individuals: 2_321, avgTaxableIncome: 97_725, medianTaxableIncome: 94_452, avgSalary: 85_867, medianSalary: 86_658 },
    { code: "272313", title: "Organisational psychologist", individuals: 1_036, avgTaxableIncome: 137_226, medianTaxableIncome: 119_980, avgSalary: 123_090, medianSalary: 111_387 },
    { code: "272314", title: "Psychologist - psychotherapist", individuals: 1_198, avgTaxableIncome: 76_606, medianTaxableIncome: 69_099, avgSalary: 62_924, medianSalary: 59_620 },
  ],
};

const MEDIAN_YEAR = medianAnnual(MEDIAN);
const NSW_REGISTERED = stepPay("psychologist", "NSW", "Psychologist, year 3");
const VIC_REGISTERED = stepPay("psychologist", "VIC", "Grade 2, year 1");

const BASE = hpssOct2026Occupation(9, {
  slug: "psychologist",
  name: "Psychologist",
  plural: "psychologists",
  headlineLabel: "Level 1 — AQF 9 — 1st year",
  why: "a first-year psychologist (AQF Level 9, the award's standard qualification for the profession)",
  coverage: [
    "Psychologists employed in private practice, private hospitals, community health, NDIS and EAP providers are covered by the Health Professionals and Support Services Award 2020 [MA000027], which lists psychologist in Schedule B.",
    "From the first full pay period starting on or after 1 October 2026, Level 1 pay depends on the AQF level of the profession's standard minimum qualification and your years of experience in the profession at Level 1. Schedule B sets psychology at AQF Level 9, so a newly qualified psychologist starts on the AQF Level 9 1st-year rate and moves to the 2nd–3rd year, 4th–6th year and 7th year+ rates with experience.",
    "Level 2 is a senior clinician, specialist, supervisor or educator (Level 2.1 with under 5 years in that role, 2.2 with 5 or more); Level 3 is an advanced clinician, senior specialist or section manager; Level 4 is a manager.",
    "Psychologists employed by a state health service, education department or the Australian Public Service are paid under their employer's agreement instead; the state public hospital scales are above. Psychologists who bill Medicare as contractors or sole traders have no award minimum.",
  ],
  median: MEDIAN,
  notices: [
    ...HPSS_OCT_2026_NOTICES,
    "The award does not set a separate rate for clinical psychologists or other area-of-practice endorsements. An endorsed psychologist's classification depends on the duties and responsibility of the role under Schedule A.2.",
  ],
  faqs: [
    {
      q: "How much do psychologists earn in Australia?",
      a: `Full-time psychologists and psychotherapists earn a median of ${aud(MEDIAN.medianWeekly)} a week, about ${aud(MEDIAN_YEAR)} a year (Jobs and Skills Australia, May 2025). On 2023-24 tax returns, clinical psychologists had an average taxable income of ${aud(PSYCHOLOGIST_ATO.rows[0].avgTaxableIncome)} and those coded \"Psychologist - other\" ${aud(PSYCHOLOGIST_ATO.rows[1].avgTaxableIncome)}. In public hospitals a fully registered psychologist starts on ${NSW_REGISTERED} in NSW and ${VIC_REGISTERED} in Victoria. The award minimum for private employers is $38.02 an hour.`,
    },
    {
      q: "What is the hourly rate for a psychologist?",
      a: `Jobs and Skills Australia puts the median at ${aud(MEDIAN.medianHourly)} an hour for psychologists and psychotherapists (May 2025). Under the award, an employed psychologist earns at least $38.02 an hour in the first year, rising to $46.18 from the 7th year, and a first-year casual $47.53. A psychologist who bills clients or Medicare as a contractor sets their own fees and has no award rate.`,
    },
    {
      q: "What is a psychologist's starting salary in a public hospital?",
      a: `In NSW Health a psychologist in training starts on ${stepPay("psychologist", "NSW", "Psychologist, year 1")} and one with full registration on ${NSW_REGISTERED} (year 3). In Victoria a provisional psychologist starts on ${stepPay("psychologist", "VIC", "Grade 1, year 1")} (Grade 1) and a registered psychologist on ${VIC_REGISTERED} (Grade 2, year 1). Queensland starts at ${stepPay("psychologist", "QLD", "HP3.0")} on HP3.0, or ${stepPay("psychologist", "QLD", "HP3.1")} on HP3.1 where the job needs a four-year degree or a two-year master's. WA starts at ${stepPay("psychologist", "WA", "P-1.2")} for a four-year degree (P-1.2). In SA a psychologist with a two-year master's in psychology starts on AHP-2, increment 1: ${stepPay("psychologist", "SA", "AHP-2, increment 1")}.`,
    },
    {
      q: "How much does a clinical psychologist earn in a public hospital?",
      a: `In NSW Health, clinical psychologists earn ${stepPay("psychologist", "NSW", "Clinical psychologist, year 1")} in year 1 to ${stepPay("psychologist", "NSW", "Clinical psychologist, year 5 and after")} from year 5, senior clinical psychologists up to ${stepPay("psychologist", "NSW", "Senior clinical psychologist, year 3 and after")}, and a principal clinical psychologist ${stepPay("psychologist", "NSW", "Principal clinical psychologist, year 1 and after")}. In WA a clinical psychologist registrar starts on P-1.5 (${stepPay("psychologist", "WA", "P-1.5")}) and a clinical psychologist on P-2.3 (${stepPay("psychologist", "WA", "P-2.3")}), rising to P-4.2 (${stepPay("psychologist", "WA", "P-4.2")}).`,
    },
    {
      q: "How much does a psychologist earn in each state's public hospitals?",
      a: `From the first step on each scale to the top: NSW ${stateRangeWords("psychologist", "NSW")}; Victoria ${stateRangeWords("psychologist", "VIC")}; Queensland ${stateRangeWords("psychologist", "QLD")}; WA ${stateRangeWords("psychologist", "WA")}; SA ${stateRangeWords("psychologist", "SA")}.`,
    },
    {
      q: "What is the award rate for a psychologist in 2026?",
      a: "A first-year psychologist must be paid at least $38.02 an hour, or $1,444.90 a week, under the Health Professionals and Support Services Award from the first full pay period starting on or after 1 October 2026. That is $75,135 a year full-time before tax. The rate rises to $40.66 an hour in the 2nd and 3rd years, $43.67 in the 4th to 6th years and $46.18 from the 7th year.",
    },
    {
      q: "What is the casual rate for a psychologist?",
      a: "A casual first-year (AQF Level 9) psychologist earns at least $47.53 an hour including the 25% casual loading, rising to 175% of the minimum hourly rate on weekends and 275% on public holidays.",
    },
    {
      q: "Is there a separate award rate for clinical psychologists?",
      a: "No. The award classifies health professionals by level, not by endorsement. An experienced clinical psychologist working as a senior clinician or specialist would typically fit Level 2 ($51.19 to $52.19 an hour) or, as an advanced clinician, Level 3 ($52.19), but the classification depends on the role's duties. State public hospitals do have their own clinical psychologist grades, shown above.",
    },
    {
      q: "Are psychologists covered by an award if they work in private practice?",
      a: "Employed psychologists in a private practice are covered by this award. Psychologists who work as independent contractors in a practice, billing their own clients or Medicare, are not employees and have no award minimum.",
    },
  ],
  related: [
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    { href: "/public-service-pay-scales/", label: "Public Service Pay Scales" },
    { href: "/salary-packaging-guide/", label: "Salary Packaging Guide" },
    { href: "/health-professionals-award-rates/", label: "Health Professionals Award Rates" },
  ],
});

export const PSYCHOLOGIST: Occupation = {
  ...BASE,
  metaTitle: hospitalSalaryTitle("Psychologist", MEDIAN),
  heading: "Psychologist Salary Australia 2026: Hospital Pay by State and Award Rates",
  metaDescription: hospitalMetaDescription("Psychologist", "psychologist", MEDIAN),
  lede: `Full-time psychologists and psychotherapists earn a median of ${aud(MEDIAN.medianWeekly)} a week, about ${aud(MEDIAN_YEAR)} a year, or ${aud(MEDIAN.medianHourly)} an hour (Jobs and Skills Australia). In public hospitals a fully registered psychologist starts on ${NSW_REGISTERED} in NSW and ${VIC_REGISTERED} in Victoria, and clinical psychologists have their own higher grades. The award minimum for private employers is $38.02 an hour.`,
  answerQuestion: "How much do psychologists earn in Australia?",
  ato: PSYCHOLOGIST_ATO,
  publicHospital: {
    profession: "psychologist",
    intro:
      "Psychologists in public hospitals and state health services are paid under their state's award or agreement, not the federal award further down this page. NSW and Victoria have separate psychologist scales; Queensland, WA and SA pay psychologists on their shared allied health scales. These are the rates in force on 23 October 2026.",
  },
  sources: [...BASE.sources, ATO_TABLE_15],
  dateModified: HOSPITAL_PAGES_MODIFIED,
};
