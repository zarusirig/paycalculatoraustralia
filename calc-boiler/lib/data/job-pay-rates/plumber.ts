// Plumber — Plumbing and Fire Sprinklers Award 2020 [MA000036].
//
// Source: FWC consolidated award text, awards.fairwork.gov.au/MA000036.html,
// "incorporates all amendments up to and including 16 September 2026
// (PR814392)". Rates varied by PR799317 ppc 01Jul26. Read 23 September 2026.
//
// ⚠️ SAME TRAP AS ELECTRICIANS: THE cl 18.1 RATE IS NOT THE MINIMUM.
// Schedule B lists the all-purpose allowances each classification carries,
// and Schedule C.1.1 says the ordinary hourly rate "includes the industry
// allowance (clause 21.3(a)), the special fixed allowance (clause 21.3(d)) and,
// where applicable, the plumbing trade allowance (clause 21.3(b)) and
// registration allowance (clause 21.3(c))". Per week:
//   industry $41.41 (all)  special fixed $7.70 (all but apprentices)
//   plumbing trade $33.57 (worker level 2 and tradespersons)
//   registration $44.76 (tradespersons registered under state legislation)
// A registered plumbing tradesperson level 1: 1119.10 + 41.41 + 33.57 + 44.76
// + 7.70 = $1,246.54 a week = $32.80 an hour — Schedule C.1.3 prints $32.80.
// The bare cl 18.1 figure ($29.45) understates it by $3.35 an hour.
//
// `weekly` = our sum of cl 18.1 + the Schedule B allowances; `hourly` and
// `casualHourly` = Schedule C.1.3 and C.1.6 exactly. Tests assert the sum / 38
// reproduces Schedule C to the cent for every row (it does).
//
// Median: Jobs and Skills Australia, ANZSCO 3341 Plumbers, $1,990 a week /
// $47 an hour (ABS SEEH May 2025), read 23 September 2026.

import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  jsaSource,
  jsaUrl,
  toCents,
} from "./common";
import type { MedianEarnings, Occupation, RateRow } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "3341",
  anzscoTitle: "Plumbers",
  medianWeekly: 1_990,
  medianHourly: 47,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("3341-plumbers"),
};

/** cl 21.3 all-purpose allowances, per week. */
export const PLUMBING_ALLOWANCES = {
  industry: 41.41,
  plumbingTrade: 33.57,
  registration: 44.76,
  specialFixed: 7.7,
} as const;

const A = PLUMBING_ALLOWANCES;
const WORKER_L1 = [A.industry, A.specialFixed];
const TRADE_UNREGISTERED = [A.industry, A.plumbingTrade, A.specialFixed];
const TRADE_REGISTERED = [A.industry, A.plumbingTrade, A.registration, A.specialFixed];

/** cl 18.1 base weekly + all-purpose allowances; hourly and casual as Schedule C prints them. */
function row(label: string, base: number, allowances: number[], hourly: number, casualHourly: number, note?: string): RateRow {
  const weekly = toCents(allowances.reduce((s, a) => s + a, base));
  return { label, weekly, hourly, casualHourly, ...(note ? { note } : {}) };
}

export const PLUMBER: Occupation = {
  slug: "plumber",
  name: "Plumber",
  plural: "plumbers",
  award: {
    name: "Plumbing and Fire Sprinklers Award 2020",
    code: "MA000036",
    url: awardTextUrl("MA000036"),
    consolidatedTo: "16 September 2026",
  },
  headline: {
    tableId: "registered",
    label: "Plumbing and mechanical services tradesperson level 1 (registered)",
    why: "a qualified plumber registered under state plumbing legislation",
  },
  coverage: [
    "Plumbers employed by plumbing, gasfitting, drainage and mechanical services contractors are covered by the Plumbing and Fire Sprinklers Award 2020 [MA000036]. A qualified plumber is a plumbing and mechanical services tradesperson; levels 2, special class and advanced tradesperson recognise further qualifications set out in Schedule A.",
    "A plumber's minimum is more than the clause 18.1 rate. Every plumbing employee gets an industry allowance ($41.41 a week) and a special fixed allowance ($7.70); tradespersons also get the plumbing trade allowance ($33.57); and a tradesperson registered under state plumbing legislation gets a registration allowance ($44.76). All four are paid for all purposes, so they flow into overtime, penalties and leave.",
    "The table rates are for weekly hire employees. Daily hire employees receive an additional lost time loading (cl 21.3(i)) and have their own Schedule C.2 rates.",
    "Fire sprinkler fitters are covered by the same award but have different allowances; their rates are not shown here.",
  ],
  tables: [
    {
      id: "registered",
      title: "Registered plumber pay rates, 2026–27 (weekly hire)",
      intro:
        "Weekly = clause 18.1 minimum + industry, plumbing trade, registration and special fixed allowances ($127.44 a week in total). Hourly and casual rates are exactly as published in Schedule C.1.3 and C.1.6.",
      rows: [
        row("Plumbing and mechanical services tradesperson level 1 (registered)", 1119.1, TRADE_REGISTERED, 32.8, 41.0, "Qualified, registered plumber"),
        row("Plumbing and mechanical services tradesperson level 2 (registered)", 1154.3, TRADE_REGISTERED, 33.73, 42.16),
        row("Tradesperson special class level 1 (registered)", 1189.4, TRADE_REGISTERED, 34.65, 43.31),
        row("Tradesperson special class level 2 (registered)", 1221.1, TRADE_REGISTERED, 35.49, 44.36),
        row("Advanced tradesperson level 1 (registered)", 1256.3, TRADE_REGISTERED, 36.41, 45.51),
        row("Advanced tradesperson level 2 (registered)", 1283.1, TRADE_REGISTERED, 37.12, 46.4),
      ],
    },
    {
      id: "workers-unregistered",
      title: "Plumbing workers and unregistered tradespersons (weekly hire)",
      intro:
        "Workers get the industry and special fixed allowances (level 2 also gets the plumbing trade allowance); unregistered tradespersons get everything except the registration allowance. Hourly and casual rates are Schedule C.1.3 and C.1.6.",
      rows: [
        row("Plumbing worker level 1(a) — new entrant", 1013.6, WORKER_L1, 27.97, 34.96),
        row("Plumbing worker level 1(b) — after 3 months", 1033.6, WORKER_L1, 28.49, 35.61),
        row("Plumbing worker level 1(c) — after 12 months", 1047.3, WORKER_L1, 28.85, 36.06),
        row("Plumbing worker level 1(d)", 1062.9, WORKER_L1, 29.26, 36.58),
        row("Plumbing worker level 2", 1119.1, TRADE_UNREGISTERED, 31.63, 39.54),
        row("Tradesperson level 1 (not registered)", 1119.1, TRADE_UNREGISTERED, 31.63, 39.54),
        row("Tradesperson level 2 (not registered)", 1154.3, TRADE_UNREGISTERED, 32.55, 40.69),
        row("Tradesperson special class level 1 (not registered)", 1189.4, TRADE_UNREGISTERED, 33.48, 41.85),
        row("Tradesperson special class level 2 (not registered)", 1221.1, TRADE_UNREGISTERED, 34.31, 42.89),
        row("Advanced tradesperson level 1 (not registered)", 1256.3, TRADE_UNREGISTERED, 35.24, 44.05),
        row("Advanced tradesperson level 2 (not registered)", 1283.1, TRADE_UNREGISTERED, 35.94, 44.93),
      ],
    },
  ],
  penalties: [
    { when: "Ordinary hours (Monday–Friday)", permanent: "100%", casual: "125%" },
    { when: "Saturday — first 2 hours", permanent: "150%", casual: "175%" },
    { when: "Saturday after 2 hours; Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
    { when: "Shiftwork — 5+ consecutive shifts with 48 hours' notice", permanent: "133%", casual: "158%" },
  ],
  penaltiesNote:
    "Percentages of the ordinary hourly rate, which already includes the all-purpose allowances (Schedule C.1.3–C.1.7).",
  overtime: [
    "Monday to Saturday: 150% for the first 2 hours, then 200%; overtime after 12 noon Saturday, or starting after midnight before ordinary hours, is 200% (Schedule C.1.5).",
    "Sunday: 200%. Public holiday: 250%.",
    "Shifts worked on fewer than 5 consecutive days, or with less than 48 hours' notice, are paid at 150% for 2 hours then 200% (casual 175% then 225%).",
  ],
  allowances: [
    { name: "Industry allowance", amount: "$41.41 per week", note: "All purposes, all plumbing employees (cl 21.3(a)); included." },
    { name: "Plumbing trade allowance", amount: "$33.57 per week", note: "All purposes, worker level 2 and tradespersons (cl 21.3(b)); included." },
    { name: "Registration allowance", amount: "$44.76 per week", note: "All purposes, tradespersons registered under state legislation (cl 21.3(c)); included in the registered table." },
    { name: "Special fixed allowance", amount: "$7.70 per week", note: "All purposes, all employees except apprentices; not adjusted annually (cl 21.3(d)); included." },
  ],
  median: MEDIAN,
  notices: [
    "Check whether you are paid as registered. A registered plumber's minimum is $32.80 an hour; the same tradesperson paid as unregistered gets $31.63 — the $44.76 weekly registration allowance is the difference.",
  ],
  notShown: [
    "Apprentice plumber rates (cl 18.2) and adult apprentice rates, which have their own summary in Schedule E.",
    "Fire sprinkler fitter and irrigation installer rates.",
    "Daily hire rates with the lost time loading (Schedule C.2), and incidence allowances such as tool, travel and height money.",
  ],
  faqs: [
    {
      q: "What is the award rate for a plumber in 2026?",
      a: "A qualified plumber registered under state legislation (plumbing and mechanical services tradesperson level 1) must be paid at least $32.80 an hour, or $1,246.54 a week, under the Plumbing and Fire Sprinklers Award from the first full pay period on or after 1 July 2026. That includes the industry, plumbing trade, registration and special fixed allowances, and is $64,820 a year full-time before tax.",
    },
    {
      q: "What is the casual rate for a plumber?",
      a: "A casual registered plumber earns at least $41.00 an hour, the $32.80 ordinary hourly rate plus the 25% casual loading (Schedule C.1.6). On a Saturday a casual gets $57.40 for the first 2 hours and $73.80 after that.",
    },
    {
      q: "Why is a plumber's award rate higher than $29.45 an hour?",
      a: "$29.45 is the bare tradesperson rate in clause 18.1. The award adds four all-purpose allowances — industry, plumbing trade, registration and special fixed — worth $127.44 a week for a registered plumber, which the award's own hourly schedule builds into the $32.80 ordinary rate.",
    },
    {
      q: "Do plumbers get paid penalty rates on weekends?",
      a: "Yes. Saturday is paid at 150% for the first 2 hours and 200% after that, Sunday at 200% and public holidays at 250% of the ordinary hourly rate, which already includes the allowances.",
    },
    {
      q: "What do plumbers actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,990 a week for plumbers (ABS, May 2025), about $103,480 a year. That includes plumbers on enterprise agreements and above-award pay, so it is a market figure, not an entitlement.",
    },
  ],
  sources: [
    { title: "Plumbing and Fire Sprinklers Award 2020 [MA000036] — consolidated to 16 September 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000036") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/construction-trades-pay/", label: "Construction & Trades Pay" },
    { href: "/job-pay-rates/electrician/", label: "Electrician Pay Rates" },
    { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator" },
  ],
};
