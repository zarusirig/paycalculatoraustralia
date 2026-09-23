// Disability support worker — SCHADS Award [MA000100].
//
// The rates are NOT re-typed here. They are imported from
// lib/constants/schads-award.ts, which the /schads-award-pay-rates/ page also
// renders, so the two pages cannot disagree. That file was verified on
// 28 July 2026 against the FWO pay guide and the consolidated award; on
// 23 September 2026 we re-read the consolidated award (now "incorporates all
// amendments up to and including 1 September 2026 (PR813674)", a clause 20
// allowances variation) and every SACS and home-care-disability weekly rate
// used below still appears in it unchanged.
//
// Which stream: disability services in a community or residential setting
// (group homes, supported accommodation, respite and day services) is Schedule
// B, Social and community services. Care in the client's own home is Schedule
// E, Home care — disability. There is NO separate "disability services" pay
// table; see the header of schads-award.ts.
//
// Level 2 is the headline: Schedule B, B.2.1(e) — "Employees who have completed
// an appropriate certificate and are required to undertake work related to
// that certificate will be appointed to this level. Where the appropriate
// certificate is a level 4 certificate the minimum rate of pay will be pay
// point 2."
//
// SCHADS publishes no casual hourly column, so casual = ordinary hourly x 1.25
// rounded half-up to the cent, computed in integer cents.
//
// ALLOWANCES: PR813674 (ppc 1 September 2026) inserted a TEMPORARY vehicle
// allowance of $1.05/km for 1 Sep 2026 – 28 Feb 2027 (cl 20.7(aa)); the $1.01
// rate in schads-award.ts applies outside that window. The sleepover allowance
// is still 4.9% of the standard rate (cl 25.7(d)).

import {
  SCHADS_AWARD,
  SCHADS_HOME_CARE_DISABILITY,
  SCHADS_PENALTIES,
  SCHADS_SACS,
  type SchadsRate,
} from "../../constants/schads-award";
import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  jsaSource,
  jsaUrl,
} from "./common";
import type { MedianEarnings, Occupation, RateRow } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "4231",
  anzscoTitle: "Aged and Disabled Carers",
  medianWeekly: 1_761,
  medianHourly: 46,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("4231-aged-and-disabled-carers"),
};

/** Hourly x 1.25 in integer cents, so 36.22 -> 45.28 rather than a float-rounded 45.27. */
function casual(hourly: number): number {
  const cents = Math.round(hourly * 100);
  return Math.round((cents * (1 + SCHADS_AWARD.casualLoading) * 100) / 100) / 100;
}

function toRow(rate: SchadsRate, note?: string): RateRow {
  return {
    label: rate.classification,
    weekly: rate.weekly,
    hourly: rate.hourly,
    casualHourly: casual(rate.hourly),
    ...(note ? { note } : {}),
  };
}

const SACS_NOTES: Record<string, string> = {
  "Level 1 pay point 1": "Entry level, close direction",
  "Level 2 pay point 1": "Relevant certificate",
  "Level 2 pay point 2": "Certificate IV or diploma starts here",
};

const pct = (x: number) => `${Math.round(x * 1000) / 10}%`;

export const DISABILITY_SUPPORT_WORKER: Occupation = {
  slug: "disability-support-worker",
  name: "Disability Support Worker",
  plural: "disability support workers",
  award: {
    name: SCHADS_AWARD.name,
    code: SCHADS_AWARD.code,
    url: awardTextUrl(SCHADS_AWARD.code),
    consolidatedTo: "1 September 2026",
    awardPageHref: "/schads-award-pay-rates/",
  },
  headline: {
    tableId: "sacs",
    label: "Level 2 pay point 1",
    why: "a support worker in a group home or day program who holds a relevant certificate",
  },
  coverage: [
    "Disability support workers employed by NDIS providers and other disability services are covered by the Social, Community, Home Care and Disability Services Industry Award 2010 — the SCHADS Award [MA000100]. Which pay table applies depends on where the support is delivered.",
    "Support in a community or residential setting — group homes, supported accommodation, respite and day programs — falls under the Social and community services stream (Schedule B). Support delivered in the client's own home falls under Home care — disability (Schedule E), which has lower rates.",
    "In the Social and community services stream, a support worker who has completed a relevant certificate and does work related to it must be appointed at Level 2. With a Certificate IV (or a diploma) the minimum is Level 2 pay point 2. Level 1 covers entry-level work under close direction, including new recruits with limited experience.",
    "The Social and community services rates for Levels 2 and up already include the Equal Remuneration Order uplift, which the award says forms part of ordinary pay for all purposes. Level 1 receives no uplift.",
  ],
  tables: [
    {
      id: "sacs",
      title: "Disability support worker pay rates — group homes, day programs and residential settings",
      intro:
        "SCHADS Award Schedule B (Social and community services), Levels 1 to 4. Weekly and hourly rates as published, including the Equal Remuneration Order for Levels 2 and up. Casual is the hourly rate plus the 25% loading.",
      rows: SCHADS_SACS.filter((r) => /^Level [1-4] /.test(r.classification)).map((r) =>
        toRow(r, SACS_NOTES[r.classification]),
      ),
    },
    {
      id: "home-care",
      title: "Disability support worker pay rates — support in the client's home",
      intro:
        "SCHADS Award Schedule E (Home care — disability). These rates carry no Equal Remuneration Order uplift. Casual is the hourly rate plus the 25% loading.",
      rows: SCHADS_HOME_CARE_DISABILITY.map((r) => toRow(r)),
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
    "Disability services, home care and day care employees: time and a half for the first 2 hours of overtime Monday to Saturday, then double time (cl 28.1(a)(i)).",
    "Sunday overtime is double time and public holiday overtime is double time and a half.",
    "Overtime rates replace, rather than add to, shift premiums and weekend penalties.",
  ],
  allowances: [
    { name: "Sleepover allowance", amount: "$62.87 per sleepover", note: "4.9% of the standard rate (cl 25.7(d))." },
    { name: "Broken shift allowance", amount: "$21.81 (one break) or $28.87 (two breaks)", note: "Per broken shift." },
    {
      name: "Vehicle allowance",
      amount: "$1.05 per km (1 Sep 2026 – 28 Feb 2027)",
      note: "When you are required and authorised to use your own car for work. A temporary rate under cl 20.7(aa) (PR813674); the ordinary rate of $1.01 per km applies again from 1 March 2027.",
    },
  ],
  median: MEDIAN,
  notices: [
    "If your employer has a registered enterprise agreement, its rates apply instead of the award rates below (an agreement must leave you better off overall than the award).",
  ],
  notShown: [
    "Crisis accommodation and family day care streams, and trainee rates under Schedule I.",
    "Casual shift loadings, which follow different rules for casuals.",
  ],
  faqs: [
    {
      q: "What is the award rate for a disability support worker in 2026?",
      a: "A disability support worker with a relevant certificate working in a group home or day program is SCHADS Level 2, with a minimum of $36.22 an hour or $1,376.49 a week from the first full pay period on or after 1 July 2026. That is $71,577 a year before tax. Level 1, for entry-level work under close direction, starts at $27.55 an hour.",
    },
    {
      q: "What is the casual rate for a disability support worker?",
      a: "A casual SCHADS Level 2 pay point 1 support worker earns at least $45.28 an hour, which is $36.22 plus the 25% casual loading. Casual Saturday work is 175% and casual Sunday work 225% of the minimum hourly rate.",
    },
    {
      q: "Why is home care disability pay lower?",
      a: "Support delivered in a client's own home is covered by the Home care — disability stream, which carries no Equal Remuneration Order uplift. Its rates run from $27.28 to $35.81 an hour, compared with $36.22 for Level 2 in the social and community services stream.",
    },
    {
      q: "How much is the sleepover allowance?",
      a: "The SCHADS sleepover allowance is $62.87 per sleepover from 1 July 2026, which is 4.9% of the award's standard rate.",
    },
    {
      q: "What do disability support workers actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,761 a week for aged and disabled carers (ABS, May 2025). That group includes aged care workers as well as disability support workers.",
    },
  ],
  sources: [
    { title: "Social, Community, Home Care and Disability Services Industry Award 2010 [MA000100] — consolidated to 1 September 2026", publisher: "Fair Work Commission", url: SCHADS_AWARD.awardTextUrl },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/schads-award-pay-rates/", label: "SCHADS Award Pay Rates" },
    { href: "/overtime-penalty-rates-guide/", label: "Overtime & Penalty Rates Guide" },
    { href: "/salary-packaging-guide/", label: "Salary Packaging Guide" },
  ],
};
