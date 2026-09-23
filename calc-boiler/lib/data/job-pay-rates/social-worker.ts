// Social worker — SCHADS Award [MA000100], Social and community services stream.
//
// Rates are NOT re-typed: they come from lib/constants/schads-award.ts (the
// same data /schads-award-pay-rates/ renders), which already includes the
// Equal Remuneration Order uplift for Levels 2 and up. Casual = hourly x 1.25
// in integer cents, because SCHADS publishes no casual column.
//
// Headline: Level 3 pay point 4. Schedule B.3.3(b)(ii): "entry level for
// graduates with a relevant four year degree that undertake work related to
// the responsibilities under this level—pay point 4"; a 3-year degree enters
// at pay point 3 (B.3.3(b)(i)). An accredited Bachelor of Social Work is a
// four-year degree. Read from the consolidated award on 23 September 2026.
//
// Overtime for social and community services employees is time and a half for
// the first 3 hours (not 2) Monday to Saturday, then double time
// (cl 28.1(a)(ii), substituted by PR798459 ppc 01Jun26).
//
// Social workers in the health industry (hospitals, private health providers)
// are instead covered by the Health Professionals and Support Services Award,
// whose Schedule B lists "Social Worker"; that rate is quoted in the coverage
// text from health-professionals-common.ts.
//
// Median: Jobs and Skills Australia, ANZSCO 2725 Social Workers, $2,172 a week
// / $57 an hour (ABS SEEH May 2025), read 23 September 2026.

import { SCHADS_AWARD, SCHADS_PENALTIES, SCHADS_SACS } from "../../constants/schads-award";
import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  casualFromHourly,
  jsaSource,
  jsaUrl,
} from "./common";
import { HPSS_AWARD, HPSS_SOURCE_TITLE } from "./health-professionals-common";
import type { MedianEarnings, Occupation, RateRow } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2725",
  anzscoTitle: "Social Workers",
  medianWeekly: 2_172,
  medianHourly: 57,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2725-social-workers"),
};

const NOTES: Record<string, string> = {
  "Level 3 pay point 3": "Graduate entry — relevant 3-year degree",
  "Level 3 pay point 4": "Graduate entry — relevant 4-year degree (e.g. BSW)",
  "Level 4 pay point 1": "Four-year degree plus 1 year's experience, or 3-year degree plus 2",
};

const ROWS: RateRow[] = SCHADS_SACS.filter((r) => /^Level [3-6] /.test(r.classification)).map((r) => ({
  label: r.classification,
  weekly: r.weekly,
  hourly: r.hourly,
  casualHourly: casualFromHourly(r.hourly),
  ...(NOTES[r.classification] ? { note: NOTES[r.classification] } : {}),
}));

const pct = (x: number) => `${Math.round(x * 1000) / 10}%`;

export const SOCIAL_WORKER: Occupation = {
  slug: "social-worker",
  name: "Social Worker",
  plural: "social workers",
  award: {
    name: SCHADS_AWARD.name,
    code: SCHADS_AWARD.code,
    url: awardTextUrl(SCHADS_AWARD.code),
    consolidatedTo: "1 September 2026",
    awardPageHref: "/schads-award-pay-rates/",
  },
  headline: {
    tableId: "sacs",
    label: "Level 3 pay point 4",
    why: "a graduate social worker with a four-year degree in a community organisation",
  },
  coverage: [
    "Social workers employed by community organisations, charities, NDIS providers, family and youth services and other not-for-profits are covered by the Social, Community, Home Care and Disability Services Industry Award 2010 — the SCHADS Award [MA000100] — in the Social and community services stream (Schedule B). The award defines that sector as including social work.",
    "Schedule B makes Level 3 the graduate entry level: a relevant 3-year degree starts at pay point 3 and a relevant 4-year degree — such as an accredited Bachelor of Social Work — at pay point 4. Level 4 generally requires a 4-year degree plus a year's experience (or a 3-year degree plus two); levels 5 and above are senior practitioner, supervisory and management roles.",
    `Social workers in the health industry — private hospitals and health providers — are covered instead by the ${HPSS_AWARD.name} [${HPSS_AWARD.code}], which lists social worker as a health professional. There a 4-year degree graduate starts at Level 1 pay point 3: $33.51 an hour or $1,273.40 a week, well below the SCHADS rate.`,
    "The SCHADS rates for levels 2 and up include the Equal Remuneration Order, which the award says forms part of ordinary pay for all purposes. Social workers in state or Commonwealth government are paid under their public service agreement instead.",
  ],
  tables: [
    {
      id: "sacs",
      title: "Social worker pay rates — SCHADS social and community services, Levels 3 to 6",
      intro:
        "SCHADS Award Schedule B, weekly and hourly rates as published including the Equal Remuneration Order. Casual is the hourly rate plus the 25% loading (the award publishes no casual column).",
      rows: ROWS,
    },
  ],
  penalties: [
    { when: "Saturday", permanent: pct(SCHADS_PENALTIES.saturday), casual: pct(SCHADS_PENALTIES.casualSaturday) },
    { when: "Sunday", permanent: pct(SCHADS_PENALTIES.sunday), casual: pct(SCHADS_PENALTIES.casualSunday) },
    { when: "Public holiday", permanent: pct(SCHADS_PENALTIES.publicHoliday), casual: pct(SCHADS_PENALTIES.casualPublicHoliday) },
    { when: "Afternoon shift", permanent: pct(1 + SCHADS_PENALTIES.afternoonShiftLoading), casual: "—" },
    { when: "Night shift", permanent: pct(1 + SCHADS_PENALTIES.nightShiftLoading), casual: "—" },
  ],
  penaltiesNote:
    "Percentages of the minimum hourly rate. Casual weekend and public holiday rates include the 25% loading. Weekend rates replace shift loadings rather than adding to them (cl 26.2).",
  overtime: [
    "Social and community services employees: time and a half for the first 3 hours of overtime Monday to Saturday, then double time (cl 28.1(a)(ii)) — one hour longer at time and a half than disability and home care workers get.",
    "Sunday overtime is double time and public holiday overtime is double time and a half.",
    "Part-time and casual employees are paid overtime for work beyond 38 hours a week, 76 a fortnight or 10 hours in a day or shift (cl 28.1(b)).",
  ],
  allowances: [],
  median: MEDIAN,
  notices: [
    "If your employer has a registered enterprise agreement, its rates apply instead of the award rates below. Many large community sector employers have one.",
  ],
  notShown: [
    "SCHADS Levels 1–2 and 7–8, which rarely apply to qualified social workers; see the SCHADS award page for every level.",
    "State and Commonwealth public service social worker scales, and hospital social worker rates under state health agreements.",
    "Crisis accommodation and trainee rates.",
  ],
  faqs: [
    {
      q: "What is the award rate for a social worker in 2026?",
      a: "A graduate social worker with a four-year degree working for a community organisation is SCHADS Level 3 pay point 4, with a minimum of $43.42 an hour or $1,649.97 a week from the first full pay period on or after 1 July 2026 — $85,798 a year full-time before tax. A 3-year degree graduate starts at Level 3 pay point 3, $42.55 an hour.",
    },
    {
      q: "What is the casual rate for a social worker?",
      a: "A casual SCHADS Level 3 pay point 4 social worker earns at least $54.28 an hour, the $43.42 award rate plus the 25% casual loading.",
    },
    {
      q: "Which award covers social workers?",
      a: "It depends on the employer. Social workers in community organisations and not-for-profits are covered by the SCHADS Award. Social workers in hospitals and other health businesses are covered by the Health Professionals and Support Services Award, which pays a 4-year graduate a minimum of $33.51 an hour. Government social workers are paid under public sector agreements.",
    },
    {
      q: "How much overtime do social workers get?",
      a: "Under SCHADS, social and community services employees get time and a half for the first 3 hours of overtime Monday to Saturday and double time after that, double time on Sunday and double time and a half on public holidays.",
    },
    {
      q: "What do social workers actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $2,172 a week for social workers (ABS, May 2025), about $112,944 a year. The median includes government and hospital social workers on public sector agreements.",
    },
  ],
  sources: [
    { title: "Social, Community, Home Care and Disability Services Industry Award 2010 [MA000100] — consolidated to 1 September 2026", publisher: "Fair Work Commission", url: SCHADS_AWARD.awardTextUrl },
    { title: HPSS_SOURCE_TITLE, publisher: "Fair Work Commission", url: HPSS_AWARD.url },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/schads-award-pay-rates/", label: "SCHADS Award Pay Rates" },
    { href: "/public-service-pay-scales/", label: "Public Service Pay Scales" },
    { href: "/salary-packaging-guide/", label: "Salary Packaging Guide" },
  ],
};
