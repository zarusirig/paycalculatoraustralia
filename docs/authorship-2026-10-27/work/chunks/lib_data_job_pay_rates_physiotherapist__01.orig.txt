// Physiotherapist — Health Professionals and Support Services Award 2020
// [MA000027]. Penalties live in health-professionals-common.ts; the rate
// tables are the 1 October 2026 structure in health-professionals-oct-2026.ts.
//
// Rolled 9 October 2026 to determination PR814029 (operative from the first
// full pay period starting on or after 1 October 2026), read 9 October 2026:
// https://www.fwc.gov.au/documents/awardsandorders/pdf/pr814029.pdf
// Schedule B.3 lists Physiotherapist at AQF Level 7 only, so a new graduate —
// bachelor, entry-level masters or Doctor of Physiotherapy — is "AQF Level
// 7—1st year": $1,308.80 a week, $34.44 an hour, casual $43.05, unless the
// employer requires a higher qualification (cl B.2(d)).
//
// Median: Jobs and Skills Australia, ANZSCO 2525 Physiotherapists, $1,888 a
// week / $50 an hour (ABS SEEH May 2025), read 23 September 2026.
//
// 23 October 2026: salary-led title, answer box and public hospital pay by
// state (lib/data/public-health-allied-pay). GSC, 28 days to 21 Oct 2026:
// 1,052 impressions, 8 clicks, CTR 0.76%, position 8.1. Top queries: "salary
// of physiotherapist in australia per hour", "how much do physiotherapists
// earn in australia", "physio hourly rate", "average physiotherapist salary
// australia". ATO: Taxation statistics 2023-24, Table 15A, 252511
// Physiotherapist, Total row, read 23 October 2026.

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
  takeHome,
} from "./public-hospital-common";
import type { AtoOccupationStats, MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2525",
  anzscoTitle: "Physiotherapists",
  medianWeekly: 1_888,
  medianHourly: 50,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2525-physiotherapists"),
};

export const PHYSIOTHERAPIST_ATO: AtoOccupationStats = {
  incomeYear: ATO_TAXSTATS_INCOME_YEAR,
  intro:
    "The ATO codes physiotherapists as one occupation (252511). Tax-return figures count part-time and part-year physiotherapists as well as full-timers.",
  rows: [
    { code: "252511", title: "Physiotherapist", individuals: 32_906, avgTaxableIncome: 84_900, medianTaxableIncome: 80_635, avgSalary: 75_302, medianSalary: 76_527 },
  ],
};

const MEDIAN_YEAR = medianAnnual(MEDIAN);
const MEDIAN_NET = takeHome(MEDIAN_YEAR);

const BASE = hpssOct2026Occupation(7, {
  slug: "physiotherapist",
  name: "Physiotherapist",
  plural: "physiotherapists",
  headlineLabel: "Level 1 — AQF 7 — 1st year",
  why: "a first-year physiotherapist (AQF Level 7, the award's standard qualification for the profession)",
  coverage: [
    "Physiotherapists employed in private practice, private hospitals, sports clinics, aged care and NDIS providers are covered by the Health Professionals and Support Services Award 2020 [MA000027]. The award lists physiotherapist in Schedule B and specifically sets ordinary hours for physiotherapy practices (cl 13.2).",
    "From the first full pay period starting on or after 1 October 2026, Level 1 pay depends on the AQF level of the profession's standard minimum qualification and your years of experience in the profession at Level 1. Schedule B sets physiotherapy at AQF Level 7, so a new graduate starts on the AQF Level 7 1st-year rate whether they hold a bachelor degree, an entry-level masters or a Doctor of Physiotherapy, then moves to the 2nd–3rd year, 4th–6th year and 7th year+ rates with experience.",
    "Level 2 is a senior clinician, specialist, supervisor or educator (Level 2.1 with under 5 years in that role, 2.2 with 5 or more); Level 3 is an advanced clinician, senior specialist or section manager; Level 4 is a manager.",
    "Physiotherapists employed by a state public hospital are paid under that state's allied health award or agreement, not this award; those rates are in the public hospital section above. A self-employed or contractor physiotherapist has no award minimum at all.",
  ],
  median: MEDIAN,
  notices: [
    ...HPSS_OCT_2026_NOTICES,
  ],
  faqs: [
    {
      q: "How much do physiotherapists earn in Australia?",
      a: `Full-time physiotherapists earn a median of ${aud(MEDIAN.medianWeekly)} a week, about ${aud(MEDIAN_YEAR)} a year (Jobs and Skills Australia, May 2025). On 2023-24 tax returns, which include part-time and self-employed physios, the average taxable income was ${aud(PHYSIOTHERAPIST_ATO.rows[0].avgTaxableIncome)}. In public hospitals, state scales start ${startRangeWords("physiotherapist")}. The award minimum for a first-year physio in private practice is $34.44 an hour.`,
    },
    {
      q: "What is a physiotherapist's salary per hour in Australia?",
      a: `Jobs and Skills Australia puts the median for physiotherapists at ${aud(MEDIAN.medianHourly)} an hour (May 2025). The award minimum is $34.44 an hour for a first-year physiotherapist, rising to $44.46 from the 7th year, and $43.05 for a casual in their first year. Public hospitals pay a weekly or yearly salary rather than an hourly rate.`,
    },
    {
      q: "What does a new graduate physiotherapist earn in a public hospital?",
      a: `A new graduate starts on ${stepPay("physiotherapist", "NSW", "Level 1, year 1")} in NSW Health (Level 1, year 1, or ${stepPay("physiotherapist", "NSW", "Level 1, year 2")} on year 2 with a degree of more than three years), ${stepPay("physiotherapist", "VIC", "Grade 1, year 1")} in Victoria (Grade 1, year 1), ${stepPay("physiotherapist", "QLD", "HP3.0")} in Queensland (HP3.0, or ${stepPay("physiotherapist", "QLD", "HP3.1")} where the job needs a four-year degree), ${stepPay("physiotherapist", "WA", "P-1.1")} in WA (P-1.1, or ${stepPay("physiotherapist", "WA", "P-1.2")} with a four-year degree) and ${stepPay("physiotherapist", "SA", "AHP-1, increment 1 (3-year degree start)")} in SA (or ${stepPay("physiotherapist", "SA", "AHP-1, increment 2 (4-year degree start)")} with a four-year degree).`,
    },
    {
      q: "How much does a physiotherapist earn in each state's public hospitals?",
      a: `From the first qualified step to the top of the scale: NSW ${stateRangeWords("physiotherapist", "NSW")}; Victoria ${stateRangeWords("physiotherapist", "VIC")}; Queensland ${stateRangeWords("physiotherapist", "QLD")}; WA ${stateRangeWords("physiotherapist", "WA")}; SA ${stateRangeWords("physiotherapist", "SA")}.`,
    },
    {
      q: "What is a physiotherapist's salary after tax?",
      a: `On the ${aud(MEDIAN_YEAR)} median, a full-time physiotherapist takes home about ${aud(MEDIAN_NET.year)} a year, or ${aud(MEDIAN_NET.fortnight)} a fortnight, at 2026-27 resident tax rates with the Medicare levy and no HECS-HELP. The public hospital tables on this page show take-home pay for every grade.`,
    },
    {
      q: "What is the award rate for a physiotherapist in 2026?",
      a: "A first-year physiotherapist must be paid at least $34.44 an hour, or $1,308.80 a week, under the Health Professionals and Support Services Award from the first full pay period starting on or after 1 October 2026. That is $68,058 a year full-time before tax. The award sets physiotherapy at AQF Level 7, so a masters or Doctor of Physiotherapy graduate starts on the same rate unless the employer requires the higher qualification.",
    },
    {
      q: "What is the casual rate for a physiotherapist?",
      a: "A casual first-year (AQF Level 7) physiotherapist earns at least $43.05 an hour including the 25% casual loading. Casuals get 175% on weekends and 275% on public holidays.",
    },
    {
      q: "Do physiotherapists get paid more on Saturdays?",
      a: "Yes. Ordinary hours between midnight Friday and midnight Sunday are paid at 150% of the minimum hourly rate for full-time and part-time physiotherapists, which is $51.66 an hour for a first-year physiotherapist (Schedule C.2.1).",
    },
    {
      q: "How much does a senior physiotherapist earn under the award?",
      a: "A Level 2 senior clinician, specialist, supervisor or educator earns at least $51.19 an hour ($1,945.40 a week) with under 5 years in the role and $52.19 ($1,983.20) with 5 years or more. Level 3, an advanced clinician, senior specialist or section manager, is $52.19 an hour, and Level 4 managers $65.77 ($2,499.10 a week).",
    },
  ],
  related: [
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    { href: "/salary-packaging-guide/", label: "Salary Packaging Guide" },
    { href: "/employee-vs-sole-trader-vs-company/", label: "Employee vs Sole Trader vs Company" },
    { href: "/health-professionals-award-rates/", label: "Health Professionals Award Rates" },
  ],
});

export const PHYSIOTHERAPIST: Occupation = {
  ...BASE,
  metaTitle: hospitalSalaryTitle("Physiotherapist", MEDIAN),
  heading: "Physiotherapist Salary Australia 2026: Hospital Pay by State and Award Rates",
  metaDescription: hospitalMetaDescription("Physiotherapist", "physiotherapist", MEDIAN),
  lede: `Full-time physiotherapists earn a median of ${aud(MEDIAN.medianWeekly)} a week, about ${aud(MEDIAN_YEAR)} a year, or ${aud(MEDIAN.medianHourly)} an hour (Jobs and Skills Australia). In public hospitals each state sets the pay, on scales that start ${startRangeWords("physiotherapist")} and rise through senior clinician and manager grades. The award minimum in private practice is $34.44 an hour.`,
  answerQuestion: "How much does a physiotherapist earn in Australia?",
  ato: PHYSIOTHERAPIST_ATO,
  publicHospital: {
    profession: "physiotherapist",
    intro:
      "Physiotherapists in public hospitals are paid under their state's allied health award or agreement, not the federal award further down this page. These are the rates in force on 23 October 2026.",
  },
  sources: [...BASE.sources, ATO_TABLE_15],
  dateModified: HOSPITAL_PAGES_MODIFIED,
};
