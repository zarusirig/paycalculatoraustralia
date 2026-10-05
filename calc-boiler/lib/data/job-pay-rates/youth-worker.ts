// Youth worker — SCHADS Award [MA000100] (F4, 5 Oct 2026).
//
// "Youth work" is named in the award's definition of the social and community
// services sector ("including social work, recreation work, welfare work, youth
// work or community development work"), but the award has NO classification
// called "youth worker". Read from the consolidated award text on
// awards.fairwork.gov.au on 5 October 2026 (incorporates all amendments up to
// and including 1 September 2026, PR813674). A youth worker is therefore graded
// by qualification and responsibility in Schedule B:
//   Level 2 (B.2.1(e)–(f)) — a relevant certificate is appointed at this level
//     (pay point 2 for a level 4 certificate); a diploma commences at the second
//     pay point and advances after 12 full-time equivalent months.
//   Level 3 (B.3.1(d), (g)) — supervising staff or volunteers, including day-to-day
//     operation of a group of residential facilities; a three-year degree
//     commences no lower than pay point 3, a four-year degree no lower than
//     pay point 4.
//   Level 4 (B.4.1) — knowledge and skills gained through qualifications or
//     experience in a discipline, with supervision of various functions.
//
// Rates are NOT re-typed: they come from lib/constants/schads-award.ts, the
// same constants /schads-award-pay-rates/ and /job-pay-rates/disability-support-
// worker/ render. Re-read on 5 October 2026 against the consolidated award: the
// Equal Remuneration Order rates for Levels 2 and up form ordinary pay for all
// purposes.
//
// Jobs and Skills Australia publishes NO median for ANZSCO 411716 Youth Workers
// (the profile prints N/A, "high standard error"), so none is shown.

import {
  SCHADS_AWARD,
  SCHADS_PENALTIES,
  SCHADS_SACS,
  SCHADS_VEHICLE_ALLOWANCE,
  type SchadsRate,
} from "../../constants/schads-award";
import { ANNUAL_WAGE_REVIEW_2026, FWO_PAY_GUIDES, awardTextUrl } from "./common";
import type { Occupation, RateRow } from "./types";

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

const NOTES: Record<string, string> = {
  "Level 2 pay point 1": "Relevant certificate",
  "Level 2 pay point 2": "Certificate IV starts here; diploma commences here",
  "Level 3 pay point 1": "Supervising staff or volunteers",
  "Level 3 pay point 3": "Three-year degree commences here at the earliest",
  "Level 3 pay point 4": "Four-year degree commences here at the earliest",
  "Level 4 pay point 1": "Qualified in a discipline, supervising various functions",
};

const pct = (x: number) => `${Math.round(x * 1000) / 10}%`;

const rate = (classification: string) => {
  const r = SCHADS_SACS.find((x) => x.classification === classification);
  if (!r) throw new Error(`youth-worker: no ${classification}`);
  return r;
};
const L2P1 = rate("Level 2 pay point 1");
const L2P2 = rate("Level 2 pay point 2");
const L3P3 = rate("Level 3 pay point 3");
const L4P1 = rate("Level 4 pay point 1");
const money = (x: number) => `$${x.toFixed(2)}`;

export const YOUTH_WORKER: Occupation = {
  slug: "youth-worker",
  name: "Youth Worker",
  plural: "youth workers",
  award: {
    name: SCHADS_AWARD.name,
    code: SCHADS_AWARD.code,
    url: awardTextUrl(SCHADS_AWARD.code),
    consolidatedTo: "1 September 2026",
    awardPageHref: "/schads-award-pay-rates/",
  },
  headline: {
    tableId: "sacs",
    label: "Level 2 pay point 2",
    why: "a youth worker with a Certificate IV or a diploma in youth work or community services, the common entry qualification for the role",
  },
  coverage: [
    "Youth workers employed by community organisations, youth services, youth refuges and similar non-government providers are covered by the Social, Community, Home Care and Disability Services Industry Award 2010 — the SCHADS Award [MA000100]. The award's definition of the social and community services sector includes youth work by name.",
    "The award has no classification called youth worker. It grades roles in the Social and community services stream (Schedule B) by qualification and responsibility. A youth worker with a relevant certificate is appointed at Level 2; with a Certificate IV the minimum is pay point 2, and a diploma commences at pay point 2 too. A youth worker who supervises staff or volunteers, including managing the day-to-day operations of a group of residential facilities for persons with a disability, is at Level 3, where a three-year degree commences no lower than pay point 3 and a four-year degree no lower than pay point 4.",
    "Rates for Levels 2 and up already include the Equal Remuneration Order uplift, which the award says forms part of ordinary pay for all purposes. Level 1 carries no uplift and is for entry-level work under close direction.",
    "State government youth justice and child protection workers are generally employed under state public sector awards or agreements rather than this award, so use this page for community sector youth work only.",
  ],
  tables: [
    {
      id: "sacs",
      title: "Youth worker pay rates — Social and community services stream, 2026–27",
      intro:
        "SCHADS Award Schedule B, Levels 2 to 4, as published (including the Equal Remuneration Order). Casual is the hourly rate plus the 25% loading.",
      rows: SCHADS_SACS.filter((r) => /^Level [2-4] /.test(r.classification)).map((r) => toRow(r, NOTES[r.classification])),
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
    "Percentages of the minimum hourly rate. Casual weekend and public holiday rates include the 25% loading. Weekend rates replace shift loadings rather than adding to them (cl 26.2). Youth refuges and residential programs run around the clock, so these penalties matter more here than in most community roles.",
  overtime: [
    "Time and a half for the first 2 hours of overtime Monday to Saturday, then double time (cl 28.1(a)(i)).",
    "Sunday overtime is double time and public holiday overtime is double time and a half.",
    "Overtime rates replace, rather than add to, shift premiums and weekend penalties.",
  ],
  allowances: [
    { name: "Sleepover allowance", amount: "$62.87 per sleepover", note: "4.9% of the standard rate (cl 25.7(d)); relevant to residential youth programs." },
    { name: "Broken shift allowance", amount: "$21.81 (one break) or $28.87 (two breaks)", note: "Per broken shift." },
    {
      name: "Vehicle allowance",
      amount: `$${SCHADS_VEHICLE_ALLOWANCE.temporaryPerKm.toFixed(2)} per km (1 Sep 2026 – 28 Feb 2027)`,
      note: `When you are required and authorised to use your own car for work, such as outreach. A temporary rate under cl ${SCHADS_VEHICLE_ALLOWANCE.clause} (${SCHADS_VEHICLE_ALLOWANCE.determination}); the ordinary rate of $${SCHADS_VEHICLE_ALLOWANCE.ordinaryPerKm.toFixed(2)} per km applies again from ${SCHADS_VEHICLE_ALLOWANCE.ordinaryResumesLabel}.`,
    },
  ],
  median: null,
  notices: [
    "Jobs and Skills Australia does not publish a median earnings figure for youth workers (the profile is marked N/A because of high statistical error), so this page shows award minimums only. Many youth services pay under enterprise agreements, which must leave employees better off overall than the award.",
    "The SCHADS Award has no junior rates, so the age percentages that apply to some jobs do not apply here.",
  ],
  notShown: [
    "State government youth justice, youth detention and child protection pay, which comes from state public sector awards and agreements.",
    "Crisis accommodation and family day care streams, and trainee rates.",
    "Enterprise agreement rates at individual youth services.",
  ],
  faqs: [
    {
      q: "What is the award rate for a youth worker in 2026?",
      a: `A youth worker with a Certificate IV or diploma is SCHADS Level 2 pay point 2, with a minimum of ${money(L2P2.hourly)} an hour or ${money(L2P2.weekly)} a week from the first full pay period on or after 1 July 2026 — about $${Math.round(L2P2.weekly * 52).toLocaleString("en-AU")} a year before tax. A youth worker with a relevant certificate starts at Level 2 pay point 1: ${money(L2P1.hourly)} an hour.`,
    },
    {
      q: "Does the SCHADS Award have a youth worker classification?",
      a: "No. The award names youth work in its definition of the social and community services sector, but it classifies roles by qualification and responsibility under Level 1 to Level 8. Most youth workers sit at Level 2 or Level 3, depending on their qualification and whether they supervise others.",
    },
    {
      q: "What does a youth worker with a degree earn?",
      a: `Graduates with a three-year degree doing Level 3 work commence at no lower than Level 3 pay point 3: ${money(L3P3.hourly)} an hour, ${money(L3P3.weekly)} a week. A four-year degree commences no lower than pay point 4. A Level 4 position starts at ${money(L4P1.hourly)} an hour.`,
    },
    {
      q: "What is the casual rate for a youth worker?",
      a: `A casual Level 2 pay point 2 youth worker earns at least ${money(casual(L2P2.hourly))} an hour, which is ${money(L2P2.hourly)} plus the 25% casual loading. Casual Saturday work is 175% and casual Sunday work 225% of the minimum hourly rate.`,
    },
    {
      q: "Are youth justice and child protection workers on this award?",
      a: "Generally not. Government youth justice and child protection workers are usually employed under state public sector awards and agreements. This page covers community-sector youth work under the SCHADS Award.",
    },
  ],
  sources: [
    { title: "Social, Community, Home Care and Disability Services Industry Award 2010 [MA000100] — consolidated to 1 September 2026", publisher: "Fair Work Commission", url: SCHADS_AWARD.awardTextUrl },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
  ],
  verifiedOn: "5 October 2026",
  related: [
    { href: "/schads-award-pay-rates/", label: "SCHADS Award Pay Rates" },
    { href: "/job-pay-rates/disability-support-worker/", label: "Disability Support Worker Pay Rates" },
    { href: "/job-pay-rates/social-worker/", label: "Social Worker Pay Rates" },
  ],
};
