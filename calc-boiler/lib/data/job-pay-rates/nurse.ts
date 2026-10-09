// Nurse — national overview under the Nurses Award 2020 [MA000034].
//
// Rates are NOT re-typed: they come from lib/data/nursing-pay/nurses-award-2020.ts
// (the federal safety net the /healthcare-worker-pay/ pages already render).
// On 23 September 2026 we re-read the consolidated award ("incorporates all
// amendments up to and including 1 August 2026 (PR812118)") and every weekly
// and hourly figure used below appears in cl 15.1 / 15.3 and Schedule B
// unchanged. Casual = hourly x 1.25 in integer cents, which reproduces the
// Schedule B.1.3(c) casual hourly column (e.g. RN level 1 pay point 1: $40.11).
//
// ⚠️ THE AWARD IS A FLOOR, NOT A STATE PAY SCALE. Nurses in state public
// hospitals are paid under state awards or enterprise agreements that pay well
// above this award. The page says so up front and links every state page we
// publish rather than re-deriving state rates here.
//
// Penalties (Schedule B.1.3): afternoon 112.5%, night 115%, Saturday 150%,
// Sunday 175%, public holiday 200% of the minimum hourly rate. For casuals the
// weekend and public holiday percentages apply to the CASUAL hourly rate, so
// Saturday is 187.5%, Sunday 218.75% and a public holiday 250% of the minimum
// hourly rate — verified against the published dollars ($40.11 x 1.5 = $60.17).
//
// Median: Jobs and Skills Australia, ANZSCO 2544 Registered Nurses, $2,192 a
// week / $57 an hour (ABS SEEH May 2025), read 23 September 2026.

import {
  NURSES_AWARD,
  NURSES_AWARD_AGED_CARE,
  NURSES_AWARD_GENERAL,
} from "../nursing-pay/nurses-award-2020";
import type { AwardScale } from "../nursing-pay/types";
import { NURSING_PAY_STATES, annualFor, getNursingPay, instrumentFor } from "../nursing-pay";
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
import { annual52, money0, money2 } from "./j8-common";
import type { MedianEarnings, Occupation, OccupationSection, RateRow } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2544",
  anzscoTitle: "Registered Nurses",
  medianWeekly: 2_192,
  medianHourly: 57,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2544-registered-nurses"),
};

function scale(classification: string, source: readonly AwardScale[]): AwardScale {
  const s = source.find((x) => x.classification === classification);
  if (!s) throw new Error(`nurse: no Nurses Award scale named ${classification}`);
  return s;
}

/** Nurses Award pay points as rate rows (shared with the midwife page). */
export function nursesAwardRows(classification: string, source: readonly AwardScale[], prefix: string): RateRow[] {
  return scale(classification, source).points.map((p) => ({
    label: `${prefix} — ${p.label}`,
    weekly: p.weekly,
    hourly: p.hourly,
    casualHourly: casualFromHourly(p.hourly),
  }));
}

export const NURSE_STATE_PAGES = [
  { href: "/healthcare-worker-pay/nsw/", label: "Nurse pay NSW" },
  { href: "/healthcare-worker-pay/vic/", label: "Nurse pay Victoria" },
  { href: "/healthcare-worker-pay/qld/", label: "Nurse pay Queensland" },
  { href: "/healthcare-worker-pay/wa/", label: "Nurse pay WA" },
  { href: "/healthcare-worker-pay/sa/", label: "Nurse pay SA" },
  { href: "/healthcare-worker-pay/tas/", label: "Nurse pay Tasmania" },
  { href: "/healthcare-worker-pay/act/", label: "Nurse pay ACT" },
  { href: "/healthcare-worker-pay/nt/", label: "Nurse pay NT" },
];

// ---------------------------------------------------------------------------
// J8 (9 Oct 2026): "enrolled nurse salary" (1,600 a month) is answered here
// rather than on a new URL. Award figures come from the Nurses Award scales
// above; the state rows are the first "enrolled" scale in each state file in
// lib/data/nursing-pay/ (the data /healthcare-worker-pay/{state}/ renders),
// annualised by that module's annualFor() — published annual wins, otherwise
// fortnightly x 26 or weekly x 52. JSA median: ANZSCO 4114 Enrolled and
// Mothercraft Nurses, $1,777 a week / $46 an hour (ABS SEEH May 2025), read
// 9 October 2026.
// ---------------------------------------------------------------------------

export const EN_MEDIAN_WEEKLY = 1_777;
const EN_JSA_URL = jsaUrl("4114-enrolled-and-mothercraft-nurses");

const EN_AWARD = scale("Enrolled nurse", NURSES_AWARD_GENERAL).points;
const EN_AGED = scale("Enrolled nurse — aged care", NURSES_AWARD_AGED_CARE).points[0];

export interface EnrolledNurseStateRow {
  code: string;
  name: string;
  classification: string;
  entry: number;
  top: number;
  effectiveFrom: string;
}

/** The base enrolled nurse scale in each state's public health system, from the verified state files. */
export function enrolledNurseStateRows(): EnrolledNurseStateRow[] {
  const rows: EnrolledNurseStateRow[] = [];
  for (const slug of NURSING_PAY_STATES) {
    const st = getNursingPay(slug);
    const sc = st?.scales.find((x) => x.family === "enrolled");
    if (!st || !sc) continue;
    const annuals = sc.points.map(annualFor).filter((x): x is number => x !== null);
    if (annuals.length === 0) continue;
    rows.push({
      code: st.code,
      name: st.name,
      classification: sc.classification,
      entry: annuals[0],
      top: Math.max(...annuals),
      effectiveFrom: instrumentFor(st, sc.instrumentId)?.effectiveFrom ?? "",
    });
  }
  return rows;
}

const EN_STATES = enrolledNurseStateRows();
const EN_LOWEST = EN_STATES.reduce((a, b) => (b.entry < a.entry ? b : a));
const EN_HIGHEST = EN_STATES.reduce((a, b) => (b.entry > a.entry ? b : a));

const ENROLLED_NURSE_SECTION: OccupationSection = {
  id: "enrolled-nurse-pay",
  heading: "Enrolled nurse pay: award minimum and public hospital rates by state",
  paragraphs: [
    `An enrolled nurse (EN) has a separate, lower scale than a registered nurse. Under the Nurses Award the general-stream EN minimum runs from ${money2(EN_AWARD[0].weekly)} a week (${money2(EN_AWARD[0].hourly)} an hour) at pay point 1 to ${money2(EN_AWARD[EN_AWARD.length - 1].weekly)} at pay point 5 — ${money0(annual52(EN_AWARD[0].weekly))} to ${money0(annual52(EN_AWARD[EN_AWARD.length - 1].weekly))} a year full-time. In aged care, an enrolled nurse supervising other direct care employees gets at least ${money2(EN_AGED.weekly)} a week (${money2(EN_AGED.hourly)} an hour) from the first full pay period on or after 1 August 2026.`,
    "Enrolled nurses in state public hospitals are paid under each state's own award or agreement, which pays well above the Nurses Award. The table shows the base enrolled nurse scale in each state's public health system, from the same verified tables as our state nurse pay pages. Where an instrument publishes weekly or fortnightly rates, the annual figure is weekly x 52 or fortnightly x 26.",
    `Jobs and Skills Australia reports median full-time earnings of ${money0(EN_MEDIAN_WEEKLY)} a week for enrolled and mothercraft nurses (ANZSCO 4114, ABS Survey of Employee Earnings and Hours, May 2025), about ${money0(annual52(EN_MEDIAN_WEEKLY))} a year before tax.`,
  ],
  table: {
    caption: "Enrolled nurse base salary by state public health system",
    head: ["State", "Scale", "Entry (annual)", "Top of scale", "Rates from"],
    rows: [
      ["Nurses Award (private, aged care, agencies)", "Enrolled nurse, general stream", money0(annual52(EN_AWARD[0].weekly)), money0(annual52(EN_AWARD[EN_AWARD.length - 1].weekly)), "1 July 2026"],
      ...EN_STATES.map((r) => [r.code, r.classification, money0(r.entry), money0(r.top), r.effectiveFrom]),
    ],
    note: `Annual base salary before tax, shift penalties and super. State rows are the first enrolled nurse scale each state publishes; several states have further EN scales (advanced skills, certificate-only or mental health) on their state page.`,
  },
};

export const NURSE: Occupation = {
  slug: "nurse",
  name: "Nurse",
  plural: "nurses",
  award: {
    name: NURSES_AWARD.name,
    code: NURSES_AWARD.code,
    url: awardTextUrl(NURSES_AWARD.code),
    consolidatedTo: "1 August 2026",
    awardPageHref: "/nurses-award-rates/",
  },
  headline: {
    tableId: "registered-nurse-1",
    label: "Registered nurse level 1 — Pay point 1",
    why: "a newly registered nurse (RN level 1, pay point 1) outside a state public hospital",
  },
  coverage: [
    "The Nurses Award 2020 [MA000034] is the national minimum for nurses employed by private hospitals, GP and specialist clinics, aged care providers, agencies and other national-system employers. It covers nursing assistants, enrolled nurses, registered nurses and nurse practitioners.",
    "It is a safety net, not what most nurses are paid. Nurses in state public hospitals are covered by state awards and enterprise agreements that pay well above it — see the state nurse pay pages linked on this page for the rates that actually apply in each state's public health system.",
    "Since the aged care work value case, the award has two rate streams. Aged care nurses are paid under clause 15.3 at materially higher rates than the general stream in clause 15.1; both are shown below.",
    "A registered nurse at level 1 moves up one pay point a year to pay point 8. A graduate with a 4-year degree starts on a higher rate ($1,273.40 a week) and a masters graduate on $1,317.20, before moving to pay points 4 and 5.",
  ],
  tables: [
    {
      id: "registered-nurse-1",
      title: "Registered nurse level 1 pay rates — Nurses Award, general stream",
      intro:
        "Clause 15.1, from the first full pay period on or after 1 July 2026 (PR799315). Casual is the hourly rate plus the 25% loading, matching Schedule B.1.3.",
      rows: nursesAwardRows("Registered nurse — level 1", NURSES_AWARD_GENERAL, "Registered nurse level 1"),
    },
    {
      id: "registered-nurse-2-3",
      title: "Registered nurse levels 2 and 3 — clinical nurse and clinical nurse consultant roles",
      intro: "Clause 15.1, general stream.",
      rows: [
        ...nursesAwardRows("Registered nurse — level 2", NURSES_AWARD_GENERAL, "Registered nurse level 2"),
        ...nursesAwardRows("Registered nurse — level 3", NURSES_AWARD_GENERAL, "Registered nurse level 3"),
      ],
    },
    {
      id: "enrolled-nurse",
      title: "Nursing assistant and enrolled nurse pay rates",
      intro: "Clause 15.1, general stream.",
      rows: [
        ...nursesAwardRows("Nursing assistant", NURSES_AWARD_GENERAL, "Nursing assistant"),
        ...nursesAwardRows("Enrolled nurse", NURSES_AWARD_GENERAL, "Enrolled nurse"),
      ],
    },
    {
      id: "aged-care",
      title: "Aged care nurse pay rates — Nurses Award aged care stream",
      intro:
        "Clause 15.3, from the first full pay period on or after 1 August 2026 (PR812118). These apply only to aged care employees.",
      rows: [
        ...nursesAwardRows("Registered nurse — aged care level 1", NURSES_AWARD_AGED_CARE, "Aged care RN level 1"),
        ...nursesAwardRows("Registered nurse — aged care level 2", NURSES_AWARD_AGED_CARE, "Aged care RN level 2"),
      ],
    },
  ],
  penalties: [
    { when: "Afternoon shift, Monday–Friday", permanent: "112.5%", casual: "137.5%" },
    { when: "Night shift, Monday–Friday", permanent: "115%", casual: "140%" },
    { when: "Saturday", permanent: "150%", casual: "187.5%" },
    { when: "Sunday", permanent: "175%", casual: "218.75%" },
    { when: "Public holiday", permanent: "200%", casual: "250%" },
  ],
  penaltiesNote:
    "Percentages of the minimum hourly rate, from Schedule B.1.3. A casual's weekend and public holiday rates are 150%, 175% and 200% of the casual hourly rate, which is why they sit higher than a simple +25%.",
  overtime: [
    "Full-time and part-time: 150% for the first 2 hours Monday to Saturday, then 200%; Sunday 200%; public holiday 250% (Schedule B.1.3(b)).",
    "State public hospital nurses have their own overtime rules under their state agreement.",
  ],
  allowances: [],
  median: MEDIAN,
  notices: [
    "Work in a state public hospital? This award is not your pay scale. Use the state nurse pay pages linked in the sidebar, which quote each state's own agreement.",
  ],
  notShown: [
    "Registered nurse levels 4 and 5, nurse practitioners and student enrolled nurses — see the healthcare worker pay page for the full award.",
    "Aged care enrolled nurse and level 3–5 aged care rates.",
    "State public sector registered nurse and midwife scales, which are on the state nurse pay pages.",
  ],
  sections: [ENROLLED_NURSE_SECTION],
  faqs: [
    {
      q: "How much do nurses get paid in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $2,192 a week for registered nurses (ABS, May 2025), about $113,984 a year. The award minimum is lower: $1,219.50 a week for a registered nurse level 1 pay point 1 from 1 July 2026. State public hospital pay sits above the award.",
    },
    {
      q: "What is the award rate for a registered nurse in 2026?",
      a: "Under the Nurses Award, a registered nurse level 1 pay point 1 must be paid at least $32.09 an hour, or $1,219.50 a week, from the first full pay period on or after 1 July 2026 — $63,414 a year full-time before tax. It rises to $38.57 an hour at pay point 8. Aged care registered nurses start higher, at $41.36 an hour.",
    },
    {
      q: "Do public hospital nurses get paid the award rate?",
      a: "No. State public hospital nurses are paid under state awards or enterprise agreements, which pay considerably more than the Nurses Award. The award governs private hospitals, clinics, aged care and agency work where no agreement applies.",
    },
    {
      q: "What is the casual rate for a nurse?",
      a: "A casual registered nurse level 1 pay point 1 earns at least $40.11 an hour under the award, the $32.09 rate plus the 25% casual loading. On a Saturday a casual gets 150% of that casual rate — $60.17 an hour.",
    },
    {
      q: "How much is a nurse paid on a Sunday?",
      a: "Under the Nurses Award, Sunday ordinary hours are paid at 175% of the minimum hourly rate — $56.16 an hour for an RN level 1 pay point 1. Public holidays are 200%.",
    },
    {
      q: "How much does an enrolled nurse earn in Australia?",
      a: `Under the Nurses Award, an enrolled nurse earns at least ${money2(EN_AWARD[0].hourly)} an hour (${money2(EN_AWARD[0].weekly)} a week) at pay point 1 from 1 July 2026. In state public hospitals the starting enrolled nurse salary ranges from ${money0(EN_LOWEST.entry)} (${EN_LOWEST.code}) to ${money0(EN_HIGHEST.entry)} (${EN_HIGHEST.code}) a year on the base scale. Jobs and Skills Australia puts the median for enrolled and mothercraft nurses at ${money0(EN_MEDIAN_WEEKLY)} a week (ABS, May 2025).`,
    },
    {
      q: "What do registered nurses actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $2,192 a week for registered nurses (ABS, May 2025), about $113,984 a year. That reflects state public sector agreements and above-award pay, not the award minimum.",
    },
  ],
  sources: [
    { title: "Nurses Award 2020 [MA000034] — consolidated to 1 August 2026", publisher: "Fair Work Commission", url: awardTextUrl(NURSES_AWARD.code) },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
    {
      title: "Enrolled and Mothercraft Nurses (ANZSCO 4114) occupation profile — ABS Survey of Employee Earnings and Hours, May 2025",
      publisher: "Jobs and Skills Australia",
      url: EN_JSA_URL,
    },
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/nurses-award-rates/", label: "Nurses Award Pay Rates" },
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    ...NURSE_STATE_PAGES,
  ],
};
