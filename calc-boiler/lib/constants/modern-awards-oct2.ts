// =============================================================================
// October 2026 award batch 2: Plumbing and Fire Sprinklers (MA000036),
// Pastoral (MA000035, Part 6 Broadacre Farming and Livestock only),
// Horticulture (MA000028), Health Professionals and Support Services
// (MA000027), Timber Industry (MA000071), Meat Industry (MA000059),
// Commercial Sales (MA000083) and Mining Industry (MA000011).
//
// SOURCE. Every figure below was transcribed on 5 October 2026 from the Fair
// Work Commission consolidated award text hosted at awards.fairwork.gov.au.
// Consolidation dates differ and are recorded in each award's `consolidatedTo`:
//   - Plumbing: 16 September 2026 (PR814392, corrected by PR814410). That
//     variation changed only clause 21.9(f), the mileage allowance for travel
//     beyond the defined radius ($0.55 a km after the correction). No rate moved.
//   - Health Professionals and Support Services: 1 October 2026 (PR814029),
//     which SUBSTITUTED clause 17 (Health Professional minimum rates) from the
//     first full pay period on or after 1 October 2026. Support Services rates
//     (cl 16.2) are unchanged by it and still operate from 1 July 2026.
//   - All others: 1 July 2026 (PR799280 and the award's own determination).
// Clause numbers are cited against each figure. Every table is pinned, cell for
// cell, against the award's own Summary of Hourly Rates schedule in
// lib/constants/__tests__/modern-awards-oct2.test.ts.
//
// ⚠️ THIS FILE DOES NOT IMPORT RUNTIME CODE FROM modern-awards.ts (type-only),
// so modern-awards.ts can register these awards without a require cycle.
//
// ⚠️ THE CASUAL RULE DIFFERS BY AWARD. Do not generalise:
//   - Plumbing, Pastoral, Horticulture, Commercial Sales: additive. A casual
//     penalty or overtime rate is the permanent percentage plus 25 points.
//   - Timber, Health Professionals, Mining: casual OVERTIME (and for Mining,
//     every penalty) is a percentage of the CASUAL hourly rate, so it compounds
//     (Timber D.3.3, HPSS cl 25.3, Mining B.2.3). Their casual ordinary, weekend
//     and public holiday columns are tabulated as percentages of the minimum
//     rate, so those rows carry casualBasis: "additive" overrides.
//   - HPSS casual weekends are 175% with NO loading (cl 26.1(b)).
//   - Meat: the casual loading is replaced by the weekend penalty (cl 24) and is
//     never paid on overtime (cl 22.1(c)).
//
// ⚠️ ALL-PURPOSE ALLOWANCES. Plumbing and Mining rows are the ORDINARY HOURLY
// RATE (minimum + all-purpose allowances, / 38), which is what every penalty
// percentage in those awards applies to. Pinned to Schedule C/D (Plumbing) and
// Schedule B (Mining).
// =============================================================================

import type { AwardRate, ModernAwardData } from "./modern-awards";

const VERIFIED_ON = "5 October 2026";
const OPERATIVE = "1 July 2026";
const EFFECTIVE_NOTE =
  "Applies from the first full pay period starting on or after 1 July 2026, not universally 1 July.";
const SUMMARY = (code: string) =>
  `https://www.fairwork.gov.au/employment-conditions/awards/awards-summary/${code.toLowerCase()}-summary`;

/** Round half up to the cent, as Fair Work publishes derived rates (see roundCents in modern-awards.ts). */
const cents = (v: number): number => Math.round(Number((v * 100).toFixed(6))) / 100;

function parse(raw: string): AwardRate[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [level, weekly, hourly] = line.split("|");
      if (!level || !weekly || !hourly) throw new Error(`malformed award row: ${JSON.stringify(line)}`);
      return { level, weekly: Number(weekly), hourly: Number(hourly) };
    });
}

// -----------------------------------------------------------------------------
// Plumbing and Fire Sprinklers Award 2020 (MA000036)
// Consolidated to 16 September 2026 (PR814392, corrected by PR814410).
//
// Rows are WEEKLY HIRE employees' ORDINARY HOURLY RATE (Schedule C.1.3 for
// plumbing and mechanical services, D.1.3 for sprinkler fitting): the cl 18.1
// minimum weekly rate plus the all-purpose allowances that classification gets
// (cl 21.2(b)), divided by 38 (ordinary hourly rate, cl 2). Daily hire adds a
// 3.17% lost time loading (cl 21.3(i)) and is NOT in the rows.
// -----------------------------------------------------------------------------

export const PLUMBING_ALLOWANCES = {
  industry: 41.41, // cl 21.3(a)
  plumbingTrade: 33.57, // cl 21.3(b)(ii)
  registration: 44.76, // cl 21.3(c)
  specialFixed: 7.7, // cl 21.3(d)(i)
  sprinklerTrade: 8.39, // cl 21.3(e)(ii)
  sprinklerIndustryDisability: 42.53, // cl 21.3(f)
  sprinklerSpaceHeightDirt: 39.17, // cl 21.3(f)
  sprinklerAdjustmentWorker1: 31.33, // cl 21.3(g), sprinkler fitting worker Level 1
  sprinklerAdjustmentOther: 36.93, // cl 21.3(g), worker Level 2 / tradesperson Level 1 and above
} as const;

/** cl 18.1 minimum weekly rates, in table order. `rank` 0 = Level 1 worker (no trade allowance). */
export const PLUMBING_MIN_WEEKLY: ReadonlyArray<{
  key: string;
  plumbing: string;
  sprinkler: string | null;
  minWeekly: number;
  group: "worker1" | "worker2" | "trade";
}> = [
  { key: "1a", plumbing: "Plumbing worker Level 1(a) — new entrant", sprinkler: "Sprinkler fitting worker Level 1(a) — new entrant", minWeekly: 1013.6, group: "worker1" },
  { key: "1b", plumbing: "Plumbing worker Level 1(b) — after 3 months", sprinkler: "Sprinkler fitting worker Level 1(b) — after 3 months", minWeekly: 1033.6, group: "worker1" },
  { key: "1c", plumbing: "Plumbing worker Level 1(c) — after 12 months", sprinkler: "Sprinkler fitting worker Level 1(c) — after 12 months", minWeekly: 1047.3, group: "worker1" },
  { key: "1d", plumbing: "Plumbing worker Level 1(d)", sprinkler: "Sprinkler fitting worker Level 1(d) / Fire Technician", minWeekly: 1062.9, group: "worker1" },
  { key: "w2", plumbing: "Plumbing worker Level 2", sprinkler: "Sprinkler fitting worker Level 2", minWeekly: 1119.1, group: "worker2" },
  { key: "t1", plumbing: "Plumbing tradesperson Level 1", sprinkler: "Sprinkler fitter tradesperson Level 1", minWeekly: 1119.1, group: "trade" },
  { key: "t2", plumbing: "Plumbing tradesperson Level 2", sprinkler: "Sprinkler fitter tradesperson Level 2", minWeekly: 1154.3, group: "trade" },
  { key: "s1", plumbing: "Plumbing special class Level 1", sprinkler: "Sprinkler fitter special class Level 1", minWeekly: 1189.4, group: "trade" },
  { key: "s2", plumbing: "Plumbing special class Level 2", sprinkler: "Sprinkler fitter special class Level 2", minWeekly: 1221.1, group: "trade" },
  { key: "a1", plumbing: "Plumbing advanced tradesperson Level 1", sprinkler: "Advanced sprinkler fitter Level 1", minWeekly: 1256.3, group: "trade" },
  { key: "a2", plumbing: "Plumbing advanced tradesperson Level 2", sprinkler: "Advanced sprinkler fitter Level 2", minWeekly: 1283.1, group: "trade" },
];

/** Plumbing and mechanical services all-purpose weekly total for one row (Schedule B.1). */
export function plumbingWeekly(group: "worker1" | "worker2" | "trade", minWeekly: number, registered: boolean): number {
  const A = PLUMBING_ALLOWANCES;
  let w = minWeekly + A.industry + A.specialFixed;
  if (group !== "worker1") w += A.plumbingTrade;
  if (group === "trade" && registered) w += A.registration;
  return cents(w);
}

/** Fire sprinkler fitting all-purpose weekly total for one row (Schedule B.3). */
export function sprinklerWeekly(group: "worker1" | "worker2" | "trade", minWeekly: number): number {
  const A = PLUMBING_ALLOWANCES;
  let w = minWeekly + A.sprinklerIndustryDisability + A.sprinklerSpaceHeightDirt;
  w += group === "worker1" ? A.sprinklerAdjustmentWorker1 : A.sprinklerAdjustmentOther;
  if (group === "trade") w += A.sprinklerTrade;
  return cents(w);
}

function plumbingRows(): AwardRate[] {
  const rows: AwardRate[] = [];
  const add = (level: string, weekly: number) => rows.push({ level, weekly, hourly: cents(weekly / 38) });
  for (const r of PLUMBING_MIN_WEEKLY) {
    if (r.group === "trade") continue;
    add(r.plumbing, plumbingWeekly(r.group, r.minWeekly, false));
  }
  for (const r of PLUMBING_MIN_WEEKLY) {
    if (r.group !== "trade") continue;
    add(`${r.plumbing} (registered)`, plumbingWeekly(r.group, r.minWeekly, true));
  }
  for (const r of PLUMBING_MIN_WEEKLY) {
    if (r.group !== "trade") continue;
    add(`${r.plumbing} (not registered)`, plumbingWeekly(r.group, r.minWeekly, false));
  }
  for (const r of PLUMBING_MIN_WEEKLY) {
    add(r.sprinkler as string, sprinklerWeekly(r.group, r.minWeekly));
  }
  return rows;
}

export const PLUMBING_AWARD: ModernAwardData = {
  key: "plumbing",
  meta: {
    name: "Plumbing and Fire Sprinklers Award 2020",
    shortName: "Plumbing Award",
    code: "MA000036",
    href: "/plumbing-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "16 September 2026 (PR814392, corrected by PR814410)",
    determination: "PR799317",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000036.html",
    summaryUrl: SUMMARY("MA000036"),
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 12.2",
    verifiedOn: VERIFIED_ON,
    ratesLabel: "Ordinary hourly rates (weekly hire; the minimum rate plus the all-purpose allowances)",
    hourlyDerivation:
      "Weekly = the cl 18.1 minimum weekly rate plus the all-purpose allowances that classification gets (cl 21.2(b)): for plumbing, the industry allowance $41.41, the special fixed allowance $7.70, the plumbing trade allowance $33.57 (worker Level 2 and tradespeople) and the registration allowance $44.76 (registered tradespeople); for sprinkler fitting, the $42.53 industry disability, $39.17 space, height and dirt and $36.93 ($31.33 at worker Level 1) adjustment allowances, plus the $8.39 sprinkler trade allowance for tradespeople. Hourly = that total divided by 38, which is the award's \"ordinary hourly rate\" and what Schedules C and D print. Weekly hire only; daily hire adds a 3.17% lost time loading.",
  },
  rates: plumbingRows(),
  ratesClause: "cl 18.1 + cl 21.3, calculated as the ordinary hourly rate (cl 2; Schedules B, C and D)",
  entryLevel: "Plumbing worker Level 1(a) — new entrant",
  classificationNotes: [
    { level: "Worker Levels 1(a) to 1(d)", description: "Entry grades. Level 1(a) is a new entrant; Level 1(b) after 3 months and Level 1(c) after 12 months in the industry; Level 1(d) once the substantive requirements of the classification are met (cl 18.1, Schedule A)." },
    { level: "Worker Level 2 and Tradesperson Level 1", description: "Level 2 is the first grade to receive the plumbing trade allowance. Tradesperson Level 1 holds the trade qualification (Schedule A). Both have the same minimum weekly rate." },
    { level: "Registered or not registered", description: "A tradesperson who holds the registration or licence the relevant State legislation requires also gets the $44.76 weekly registration allowance (cl 21.3(c)), which is why the registered rows are about $1.18 an hour higher than the not-registered rows." },
    { level: "Special class and Advanced", description: "Higher tradesperson grades (Level 1 and 2 of each) with progressively broader skills and responsibilities (Schedule A)." },
    { level: "Sprinkler fitting", description: "Fire sprinkler fitting has its own all-purpose allowances (Schedule B.3), so its ordinary hourly rate is not the same as the plumbing row of the same level. The Fire Technician sits at worker Level 1(d)." },
  ],
  matrix: [
    { label: "Mon–Fri ordinary hours", fullTime: 1, casual: 1.25 },
    { label: "Saturday — first 2 hrs", fullTime: 1.5, casual: 1.75 },
    { label: "Saturday — after 2 hrs", fullTime: 2.0, casual: 2.25 },
    { label: "Sunday", fullTime: 2.0, casual: 2.25 },
    { label: "Public holiday", fullTime: 2.5, casual: 2.75 },
  ],
  // cl 23.1(a), 23.2, 23.3 and Schedule C.1.3 / C.1.6 / D.1.3 / D.1.6.
  penalties: [
    { label: "Saturday ordinary hours — first 2 hours", fullTime: 1.5, casual: 1.75, note: "Where directed to work ordinary hours between midnight Friday and midnight Saturday (cl 23.2). Minimum 3 hours' work on a Saturday (cl 22.1(b))." },
    { label: "Saturday ordinary hours — after 2 hours", fullTime: 2.0, casual: 2.25 },
    { label: "Sunday ordinary hours", fullTime: 2.0, casual: 2.25, note: "Minimum 4 hours' work on a Sunday (cl 22.1(c))." },
    { label: "Public holiday (minimum 4 hours)", fullTime: 2.5, casual: 2.75, note: "Casuals are paid 275% (Schedule C.1.6). A plumbing and mechanical services employee required on a public holiday gets at least 4 hours' work or pay (cl 23.3(b))." },
    { label: "Shiftwork — 5 or more consecutive shifts and at least 48 hours' notice (Monday to Friday)", fullTime: 1.33, casual: 1.58, note: "With less than 48 hours' notice or fewer than 5 shifts the overtime rates of 150% then 200% apply instead (cl 23.1(b))." },
  ],
  penaltiesClause: "cl 23 and Schedules C.1.3–C.1.7, D.1.3–D.1.7",
  penaltyNotes: [
    "Ordinary hours are 7.00 am to 6.00 pm, Monday to Friday, in a 20-day, 4-week cycle of 8-hour days with 0.4 of an hour a day accruing towards a rostered day off (cl 15.2). By agreement the day can start between 6.00 am and 8.00 am (cl 15.3).",
    "Every percentage applies to the ordinary hourly rate, which already includes the all-purpose allowances. That is why the dollar figures on this page are higher than the percentages of the bare cl 18.1 minimum would give.",
    "Casual penalties are the permanent percentage plus the 25% loading: 150% becomes 175%, 200% becomes 225%, 250% becomes 275% (Schedule C.1.6, cl 22.1(a) NOTE). Penalty rates are not cumulative: only one applies at a time, and none applies where overtime is payable (cl 23.5).",
    "Sprinkler fitters are paid the same percentages on their own ordinary hourly rate, but Saturday work for sprinkler fitters outside ordinary hours is overtime at 200% from the first hour (cl 22.1(a)).",
  ],
  // cl 22.1(a) and Schedule C.1.5 / C.1.6.
  overtime: [
    { label: "Monday to Friday — first 2 hours", fullTime: 1.5, casual: 1.75 },
    { label: "Monday to Friday — after 2 hours", fullTime: 2.0, casual: 2.25 },
    { label: "Saturday — first 2 hours (plumbing and mechanical services)", fullTime: 1.5, casual: 1.75 },
    { label: "Saturday — after 2 hours or after 12 noon; all Saturday for sprinkler fitters", fullTime: 2.0, casual: 2.25 },
    { label: "Sunday — all day", fullTime: 2.0, casual: 2.25 },
    { label: "Public holiday — all day", fullTime: 2.5, casual: 2.75 },
    { label: "Work commenced after midnight and before the start of ordinary hours", fullTime: 2.0, casual: 2.25 },
  ],
  overtimeClause: "cl 22.1(a) and Schedule C.1.5",
  overtimeNotes: [
    "Casuals who work overtime are paid the casual column of the table, which adds the 25% loading to the permanent percentage (cl 12.3, cl 22.1(a) NOTE).",
    "An employee who has to resume work with less than 10 consecutive hours off is paid 200% until released for 10 hours (cl 16.5(c)). A fire sprinkler fitter on a service call-out outside ordinary hours is paid 200%, with at least 2 hours for the first call-back in a day (cl 17.1).",
    "Meal breaks on a Saturday, Sunday or public holiday: a paid 20-minute break after 4 hours at the overtime rate (cl 22.8).",
  ],
  casualPenaltyBasis: "additive",
  junior: null,
  noJuniorNote:
    "The Plumbing and Fire Sprinklers Award has no junior rates scale. Apprentices are paid a percentage of the rate by year of apprenticeship (cl 18.2, Schedule E), which this page does not reproduce.",
  juniorPhaseIn: null,
  // cl 17.2, 17.4, 21.3, 21.4, 21.8, 21.9, 21.10.
  allowances: [
    { name: "Industry allowance — plumbing and mechanical services", amount: 41.41, unit: "per week", clause: "cl 21.3(a)", note: "Paid for all purposes. Already in the plumbing rows above." },
    { name: "Plumbing trade allowance (worker Level 2 and tradespeople)", amount: 33.57, unit: "per week", clause: "cl 21.3(b)", note: "Paid for all purposes. Already in the plumbing rows above for those grades." },
    { name: "Registration allowance — registered tradespeople", amount: 44.76, unit: "per week", clause: "cl 21.3(c)", note: "Paid for all purposes. Already in the registered rows above." },
    { name: "Special fixed allowance (not apprentices)", amount: 7.7, unit: "per week", clause: "cl 21.3(d)", note: "Paid for all purposes and not adjusted. Already in the plumbing rows above." },
    { name: "Sprinkler fitting trade allowance (tradesperson and above)", amount: 8.39, unit: "per week", clause: "cl 21.3(e)(ii)", note: "Paid for all purposes. Already in the sprinkler rows above." },
    { name: "Fire sprinkler fitter — industry disability allowance", amount: 42.53, unit: "per week", clause: "cl 21.3(f)", note: "Paid for all purposes to adult fire sprinkler fitters. Already in the sprinkler rows above." },
    { name: "Fire sprinkler fitter — space, height and dirt money", amount: 39.17, unit: "per week", clause: "cl 21.3(f)", note: "Paid for all purposes. Already in the sprinkler rows above." },
    { name: "Sprinkler fitters adjustment — worker Level 2, tradesperson Level 1 and above", amount: 36.93, unit: "per week", clause: "cl 21.3(g)", note: "Paid for all purposes ($31.33 for sprinkler fitting worker Level 1). Already in the sprinkler rows above." },
    { name: "Leading hand — in charge of not more than 1 employee", amount: 26.86, unit: "per week", clause: "cl 21.3(h)", note: "Paid for all purposes. NOT in the rows above." },
    { name: "Leading hand — in charge of 2 to 5 employees", amount: 59.31, unit: "per week", clause: "cl 21.3(h)" },
    { name: "Leading hand — in charge of 6 to 10 employees", amount: 76.1, unit: "per week", clause: "cl 21.3(h)" },
    { name: "Leading hand — in charge of more than 10 employees", amount: 100.72, unit: "per week", clause: "cl 21.3(h)" },
    { name: "Acting on a plumber's licence (responsibility to statutory authorities)", amount: 1.53, unit: "per hour", clause: "cl 21.4(a)", note: "Paid for every hour whether or not the employee acts on the licence in that hour." },
    { name: "Tool allowance (where the employer requires you to supply tools)", amount: 22.96, unit: "per week", clause: "cl 21.8(a)" },
    { name: "Meal allowance (overtime of 1.5 hours or more after ordinary hours)", amount: 17.69, unit: "per occasion", clause: "cl 21.8(b)", note: "Plus $17.69 for each further 4 hours." },
    { name: "Fares allowance", amount: 16.24, unit: "per day", clause: "cl 21.9(b)" },
    { name: "Transfer between job sites — own vehicle", amount: 1.0, unit: "per km", clause: "cl 21.9(e)(ii)" },
    { name: "Mileage beyond the defined radius (50 km) — own vehicle", amount: 0.55, unit: "per km", clause: "cl 21.9(f)", note: "Varied on 16 September 2026 (PR814392, corrected by PR814410): the clause now cross-refers to the travelling time allowance in cl 21.9(d). The rate stayed $0.55." },
    { name: "Fire sprinkler fitter on-call — permanent stand-by on roster", amount: 76.1, unit: "per week", clause: "cl 17.2(a)" },
    { name: "Living away from home — in lieu of board and lodging", amount: 628.93, unit: "per week", clause: "cl 21.10(c)(i)", note: "$89.91 a day for broken parts of a week." },
  ],
  allowancesClause: "cl 17 and cl 21",
  hoursNotes: [
    "A casual must be engaged and paid for at least 3 hours (cl 12.2). A casual works less than an average of 38 ordinary hours or 5 days a week over any 2 successive weeks (cl 12.1).",
    "Ordinary hours average 38 a week over a 4-week cycle: 19 days of 8 hours with 0.4 of an hour each day accrued to a paid rostered day off (cl 15.1–15.2).",
    "A plumbing and mechanical services employee working on a Saturday gets at least 3 hours, on a Sunday or public holiday at least 4 hours (cl 22.1(b)–(c), 23.3(b)).",
  ],
  unverified: [
    "Daily hire employees: their hourly rate includes the 3.17% lost time loading (cl 21.3(i)) and is printed in Schedule C.2, which this page does not reproduce",
    "Apprentice, adult apprentice and trainee rates (cl 18.2–18.3, Schedule E)",
    "Casual and permanent shiftwork rates other than the Monday to Friday 133% (158% casual) rate above (cl 23.1, Schedules C.1.4, C.1.7, D.1.4, D.1.7)",
    "Irrigation installer, the other disability allowances in cl 21.6, and the tool allowance for apprentices",
    "The other all-purpose allowances you may also be owed on top of these rows, such as the leading hand allowance above",
  ],
};

// -----------------------------------------------------------------------------
// Pastoral Award 2020 (MA000035). Consolidated to 1 July 2026 (PR799280, PR799316
// and PR799473).
//
// ⚠️ SCOPE: PART 6 (BROADACRE FARMING AND LIVESTOCK OPERATIONS) HOURLY RATES ONLY.
// Shearers, crutchers and woolpressers are PIECE-RATE workers (Part 9), paid by
// the sheep shorn or the bale pressed with rates set in Schedule A, and are
// excluded. Pig breeding (Part 7), poultry farming (Part 8) and the shearing
// shed-hand hourly rates (Part 9) are also not reproduced.
// -----------------------------------------------------------------------------

export const PASTORAL_AWARD: ModernAwardData = {
  key: "pastoral",
  meta: {
    name: "Pastoral Award 2020",
    shortName: "Pastoral Award",
    code: "MA000035",
    href: "/pastoral-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799280, PR799316 and PR799473)",
    determination: "PR799316",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000035.html",
    summaryUrl: SUMMARY("MA000035"),
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 11.3(a)",
    verifiedOn: VERIFIED_ON,
    ratesLabel: "Farm and livestock hand adult minimum rates (Part 6, broadacre farming and livestock operations)",
  },
  // cl 32.1.
  rates: parse(`
FLH1|978.10|25.74
FLH2|1004.90|26.44
FLH3|1006.80|26.49
FLH4|1029.10|27.08
FLH5|1046.90|27.55
FLH6|1062.90|27.97
FLH7|1119.10|29.45
FLH8|1202.50|31.64
`),
  ratesClause: "cl 32.1",
  entryLevel: "FLH1",
  classificationNotes: [
    { level: "FLH1", description: "Station hand, station cook or station cook's offsider with less than 6 months' experience; cattle farm worker grade A; feedlot employee level 1 (under 3 months) (cl 31.1)." },
    { level: "FLH2", description: "Station hand with 6 to 12 months' experience; station cook or offsider with more than 6 months; cattle farm worker grade B (cl 31.2)." },
    { level: "FLH3", description: "Station hand with at least 12 months' experience who is not a senior station hand; dairy operator grade 1B (cl 31.3)." },
    { level: "FLH4", description: "Feedlot employee level 2 (2 years' feedlot experience, routine supervision) and similar (cl 31.4)." },
    { level: "FLH5", description: "Senior station hand; dairy operator grade 2 with 2 years' experience (cl 31.5)." },
    { level: "FLH6", description: "Feedlot employee level 3 (Certificate III, at least 2 years' feedlot experience, limited supervision) and similar (cl 31.6)." },
    { level: "FLH7", description: "Senior dairy operator grade 1, who coordinates a farm process or area of expertise (cl 31.7)." },
    { level: "FLH8", description: "Senior dairy operator grade 2, who supervises and maintains the operation of a dairy farm under the owner or manager (cl 31.8)." },
  ],
  matrix: [
    { label: "Ordinary hours (any day)", fullTime: 1, casual: 1.25 },
    { label: "Public holiday", fullTime: 2.0, casual: 2.25 },
  ],
  // cl 35.5 and Schedule B.2.1 / B.2.4.
  penalties: [
    { label: "Public holiday (all time worked)", fullTime: 2.0, casual: 2.25, note: "Casuals are paid 225%, the 200% plus the 25% loading (Schedule B.2.4). Calculated on the ordinary hourly rate before any deduction for keep (cl 35.4)." },
  ],
  penaltiesClause: "cl 35.5 and Schedule B.2.1 / B.2.4",
  penaltyNotes: [
    "The Pastoral Award has no Saturday or Sunday penalty rate for ordinary hours. Ordinary hours are fixed by agreement and average no more than 38 a week over 4 weeks (cl 34.1). What is paid at a higher rate is overtime: all time worked beyond ordinary hours (cl 35.1).",
    "Casual rates add the 25% loading to the permanent percentage: 200% becomes 225% on a public holiday (Schedule B.2.4).",
    "Where keep (board) is provided, the employer may deduct $165.86 a week from total weekly wages (cl 32.3). Overtime and public holiday rates are calculated on the rate before that deduction (cl 35.4).",
  ],
  // cl 35.2.
  overtime: [
    { label: "Monday to Saturday", fullTime: 1.5, casual: 1.75 },
    { label: "Sunday — feeding and watering stock", fullTime: 1.5, casual: 1.75 },
    { label: "Sunday — other than feeding and watering stock", fullTime: 2.0, casual: 2.25 },
  ],
  overtimeClause: "cl 35.2 and Schedule B.2.2",
  overtimeNotes: [
    "Overtime is all time beyond the ordinary hours agreed under cl 34 (cl 35.1). To be paid, an employee must claim it within 2 weeks of working it or by the next payday, whichever is later (cl 35.3).",
    "Station cooks who work more than 5.5 days in a week are not paid hourly overtime but an additional fraction of the weekly rate: 3/22 for 6 full days, 3/11 for 6 and a half days, 9/22 for 7 full days (cl 34.3).",
    "A casual who works overtime is paid the casual column of the table, which adds the 25% loading to the permanent percentage (cl 11.3(c), 35.2 NOTE).",
  ],
  casualPenaltyBasis: "additive",
  // cl 32.2, Schedule B.3.1.
  junior: {
    scale: [
      { age: "Under 16", percentage: 0.5 },
      { age: "16", percentage: 0.6 },
      { age: "17", percentage: 0.7 },
      { age: "18", percentage: 0.8 },
      { age: "19", percentage: 0.9 },
      { age: "20 and over", percentage: 1 },
    ],
    clause: "cl 32.2",
    appliesTo: "the adult rate for the farm and livestock hand level",
    adultAge: 20,
  },
  juniorPhaseIn: null,
  // cl 33 and 32.3.
  allowances: [
    { name: "Station hand supplying own horse", amount: 9.63, unit: "per week", clause: "cl 33.1(a)" },
    { name: "Station hand supplying own saddle", amount: 7.69, unit: "per week", clause: "cl 33.1(b)", note: "Not payable where the employer has reimbursed the cost of the saddle (cl 33.2)." },
    { name: "Jetting or spraying sheep (mixing poison or handling the nozzle), or swabbing for more than 3 days a week", amount: 4.49, unit: "per day", clause: "cl 33.4" },
    { name: "Deduction where keep is provided", amount: 165.86, unit: "per week (maximum)", clause: "cl 32.3", note: "A deduction the employer may make, not an allowance." },
  ],
  allowancesClause: "cl 33",
  hoursNotes: [
    "Ordinary hours of a farm and livestock hand average no more than 38 a week over 4 weeks and cannot exceed 152 hours in any 4 consecutive weeks (cl 34.1–34.2).",
    "Casuals are paid the 25% loading instead of annual leave, personal leave, notice and redundancy (cl 11.3(b)).",
    "Part 6 covers hourly farm and livestock hands. A shearer, crutcher or woolpresser is a piece-rate worker paid by the sheep shorn or bale pressed under Part 9, so no hourly rate here applies to that work.",
  ],
  unverified: [
    "Piece rates: shearers, crutchers and woolpressers (Part 9 and Schedule A) are paid by the sheep or bale, and are excluded from this page entirely",
    "Pig breeding and raising (Part 7) and poultry farming (Part 8) minimum rates, shiftwork rates and penalties",
    "Shed hands and woolpressers' hourly rates (Part 9, cl 56)",
    "Apprentice and trainee rates, the supported wage system and the other allowances in Schedule C",
  ],
};

// -----------------------------------------------------------------------------
// Horticulture Award 2020 (MA000028). Consolidated to 1 July 2026 (PR799280,
// PR799309 and PR799466).
//
// ⚠️ PIECEWORK: an employer MAY pay a piece rate (cl 15.2) and, for a pieceworker,
// the ordinary hours, overtime and meal allowance clauses do not apply. The rates
// below are HOURLY rates. A piece rate must be set so an average-productivity
// worker earns at least 15% more per hour than the hourly rate, and a pieceworker
// must be paid at least the hourly rate for every hour worked on the day.
// -----------------------------------------------------------------------------

export const HORTICULTURE_AWARD: ModernAwardData = {
  key: "horticulture",
  meta: {
    name: "Horticulture Award 2020",
    shortName: "Horticulture Award",
    code: "MA000028",
    href: "/horticulture-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799280, PR799309 and PR799466)",
    determination: "PR799309",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000028.html",
    summaryUrl: SUMMARY("MA000028"),
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 11.2(a)",
    verifiedOn: VERIFIED_ON,
    ratesLabel: "Hourly adult minimum rates (the rate a time-paid worker, or a pieceworker's floor, must receive)",
  },
  // cl 15.1(a).
  rates: parse(`
Level 1|978.10|25.74
Level 2|1004.90|26.44
Level 3|1020.10|26.84
Level 4|1056.90|27.81
Level 5|1119.10|29.45
`),
  ratesClause: "cl 15.1(a)",
  entryLevel: "Level 1",
  // Schedule A.
  classificationNotes: [
    { level: "Level 1", description: "A new employee doing routine manual work under direct supervision, including general labouring and fruit or vegetable picking, thinning or pruning. Progresses to Level 2 after no more than 3 months' industry experience (Schedule A.1)." },
    { level: "Level 2", description: "Has 3 months' industry experience; works under general supervision with established routines and exercises limited discretion (Schedule A.2)." },
    { level: "Level 3", description: "Performs work above and beyond Level 2 under routine supervision and exercises discretion within their skills and training (Schedule A.3)." },
    { level: "Level 4", description: "Coordinates work in a team or works individually under general supervision, with knowledge of the production process (Schedule A.4)." },
    { level: "Level 5", description: "Works under minimal supervision, coordinates and schedules approved work in a team, and uses a trade qualification in their duties (Schedule A.5)." },
  ],
  matrix: [
    { label: "Ordinary hours", fullTime: 1, casual: 1.25 },
    { label: "Public holiday", fullTime: 2.0, casual: 2.25 },
  ],
  // cl 13.2, 27.3, 27.4.
  penalties: [
    { label: "Casual — ordinary hours between 8.31 pm and 4.59 am", fullTime: 1.0, casual: 1.4, employment: "casual", note: "A further 15% of the ordinary hourly rate on top of the 25% loading (cl 13.2(d))." },
    { label: "Public holiday (all time worked)", fullTime: 2.0, casual: 2.25, note: "Casuals get 225% inclusive of the loading, for both ordinary hours and overtime (cl 27.4). A pieceworker is paid 200% of the piece rate (cl 27.3)." },
    { label: "Afternoon or night shift (shiftworkers)", fullTime: 1.15, casual: 1.15, employment: "permanent", note: "115% of the ordinary hourly rate (cl 13.3(d)). The award sets no separate casual shift rate." },
  ],
  penaltiesClause: "cl 13.2, 13.3(d) and 27.3–27.4, and Schedule B.2–B.3",
  penaltyNotes: [
    "There is no Saturday or Sunday penalty for ordinary hours. Ordinary hours for full-time and part-time employees are worked Monday to Friday, or Monday to Saturday by agreement, between 6.00 am and 6.00 pm unless varied by agreement (cl 13.1). Work outside them is overtime.",
    "A casual's ordinary hourly rate is the minimum plus 25% for any hour worked on any day of the week (except public holidays) between 5.00 am and 8.30 pm (cl 13.2(b)), with a further 15% of the ordinary rate between 8.31 pm and 4.59 am.",
    "For a pieceworker the ordinary hours, meal allowance and overtime clauses do not apply (cl 15.2(b)); what applies instead is the hourly-rate floor on each day worked (cl 15.2(f)).",
  ],
  // cl 21.3–21.4.
  overtime: [
    { label: "Monday to Saturday", fullTime: 1.5, casual: null },
    { label: "Sunday — outside the harvest period", fullTime: 2.0, casual: null },
    { label: "Sunday — harvest period, first 5 hours within the first 8 overtime hours of the week", fullTime: 1.5, casual: null },
    { label: "Sunday — harvest period, beyond 8 overtime hours in the week or 5 hours on the Sunday", fullTime: 2.0, casual: null },
  ],
  overtimeClause: "cl 21.3–21.4 and Schedule B.2.3 / B.3.2",
  overtimeNotes: [
    "For full-time and part-time employees overtime is all time beyond ordinary hours or outside the 6.00 am to 6.00 pm span (cl 13.1(a)(iv), cl 21.1). Anyone required to work on a Sunday is paid for at least 3 hours (cl 21.3(e)).",
    "A casual's ordinary hours can be worked at any time and any day (cl 13.2(a)), so a casual is paid overtime only for hours beyond 12 in an engagement or day, or beyond 304 ordinary hours over 8 weeks. That overtime is 175% of the ordinary rate, inclusive of the loading (cl 21.4).",
    "Overtime on a public holiday is paid at the public holiday rate: 200% (casuals 225%) (cl 27.3–27.4).",
  ],
  casualPenaltyBasis: "additive",
  // cl 15.3(a), Schedule B.4.
  junior: {
    scale: [
      { age: "Under 16", percentage: 0.5 },
      { age: "16", percentage: 0.6 },
      { age: "17", percentage: 0.7 },
      { age: "18", percentage: 0.8 },
      { age: "19", percentage: 0.9 },
      { age: "20 and over", percentage: 1 },
    ],
    clause: "cl 15.3",
    appliesTo: "the adult rate for the classification",
    adultAge: 20,
    weeklyRoundTo: 0.1,
  },
  juniorPhaseIn: null,
  // cl 18.
  allowances: [
    { name: "Leading hand — in charge of 2 to 6 employees", amount: 30.41, unit: "per week", clause: "cl 18.2(b)", note: "Paid for all purposes. NOT in the rates above." },
    { name: "Leading hand — in charge of 7 to 10 employees", amount: 35.43, unit: "per week", clause: "cl 18.2(b)" },
    { name: "Leading hand — in charge of 11 to 20 employees", amount: 50.5, unit: "per week", clause: "cl 18.2(b)" },
    { name: "Leading hand — in charge of more than 20 employees", amount: 63.46, unit: "per week", clause: "cl 18.2(b)" },
    { name: "Wet work allowance (unless adequately protected)", amount: 2.64, unit: "per hour", clause: "cl 18.2(c)", note: "Paid for all purposes." },
    { name: "First aid allowance (appointed first aider)", amount: 13.48, unit: "per week", clause: "cl 18.2(d)", note: "Paid for all purposes." },
    { name: "Meal allowance (overtime of more than 2 hours, no previous-day notice)", amount: 16.69, unit: "per occasion", clause: "cl 18.3(c)", note: "Does not apply to a pieceworker." },
  ],
  allowancesClause: "cl 18",
  hoursNotes: [
    "A casual must be engaged and paid for at least 2 consecutive hours each time they attend work (cl 11.3).",
    "Full-time and part-time ordinary hours are up to 152 over 4 weeks, up to 8 a day (up to 12 by agreement) (cl 13.1). Casual ordinary hours are up to 304 over 8 weeks and 12 a day (cl 13.2).",
    "Pieceworkers: the employer must give a written piecework record before the task starts, stating the date, task, piece rate and the hourly rate for the pieceworker (cl 15.2(h)).",
  ],
  unverified: [
    "Piece rates: the award sets no dollar piece rate. It requires one that lets an average-productivity worker earn at least 15% more than the hourly rate (cl 15.2(d)), so what a picker is actually paid per bucket, punnet or kilogram is set by the employer and not published here",
    "Apprentice and trainee rates (the National Training Wage is in Schedule E to the Miscellaneous Award) and the supported wage system (Schedule D)",
    "Annualised wage arrangements (cl 17) and accident pay (cl 19)",
  ],
};

// -----------------------------------------------------------------------------
// Health Professionals and Support Services Award 2020 (MA000027).
// Consolidated to 1 October 2026 (PR814029).
//
// ⚠️ TWO DIFFERENT DATES. Support Services rates (cl 16.2(a)) are the 1 July
// 2026 rates (PR799308). Health Professional rates (cl 17) were SUBSTITUTED by
// PR814029 from the first full pay period starting on or after 1 October 2026:
// the FIRST STAGE of a phased increase (further stages on 30 June each year
// from 2027 to 2030). An employee classified as a Health Professional on
// 30 September 2026 is translated under clause J.4 and never receives less than
// their old rate. Dental assistants (Levels 3, 5, 6, 7) and pathology collectors
// (Levels 5, 6, 7) have separate transitional rates to 31 December 2026
// (cl 16.2(b)–(c)) and are not in the Support Services rows.
// -----------------------------------------------------------------------------

const HP_L1 = (aqf: number, w: [number, number, number, number], h: [number, number, number, number]): string =>
  ["1st year", "2nd–3rd year", "4th–6th year", "7th year+"]
    .map((y, i) => `Health Professional Level 1 — AQF ${aqf}, ${y}|${w[i].toFixed(2)}|${h[i].toFixed(2)}`)
    .join("\n");

export const HPSS_SUPPORT_LEVEL_1 = "Support Services Level 1";

export const HEALTH_PROFESSIONALS_AWARD: ModernAwardData = {
  key: "health-professionals",
  meta: {
    name: "Health Professionals and Support Services Award 2020",
    shortName: "Health Professionals Award",
    code: "MA000027",
    href: "/health-professionals-award-rates/",
    operativeFrom: "1 July 2026 (Support Services) and 1 October 2026 (Health Professionals)",
    effectiveNote:
      "Support Services rates apply from the first full pay period starting on or after 1 July 2026. Health Professional rates apply from the first full pay period starting on or after 1 October 2026.",
    consolidatedTo: "1 October 2026 (PR814029)",
    determination: "PR799308 (Support Services) and PR814029 (Health Professionals)",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000027.html",
    summaryUrl: SUMMARY("MA000027"),
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 11.4",
    verifiedOn: VERIFIED_ON,
    timingDetail:
      "Support Services rates (cl 16.2) are the 1 July 2026 rates under determination PR799308, following the Annual Wage Review 2026. Health Professional rates (cl 17) were substituted by determination PR814029 (decision [2026] FWCFB 231) from the first full pay period starting on or after 1 October 2026; if your pay period began before 1 October, your old rate lawfully applies for the whole of that period. These are the first stage of a phased increase, with further stages on 30 June in each of 2027, 2028, 2029 and 2030. If you have been paid below these rates, our backpay calculator works out what is owed.",
  },
  rates: parse(`
Support Services Level 1|1024.70|26.97
Support Services Level 2|1065.20|28.03
Support Services Level 3|1106.20|29.11
Support Services Level 4|1119.10|29.45
Support Services Level 5|1157.20|30.45
Support Services Level 6|1219.50|32.09
Support Services Level 7|1241.40|32.67
Support Services Level 8 — pay point 1|1283.50|33.78
Support Services Level 8 — pay point 2|1317.20|34.66
Support Services Level 8 — pay point 3|1409.70|37.10
Support Services Level 9 — pay point 1|1435.00|37.76
Support Services Level 9 — pay point 2|1485.90|39.10
Support Services Level 9 — pay point 3|1497.80|39.42
${HP_L1(5, [1232.7, 1308.8, 1426.0, 1541.3], [32.44, 34.44, 37.53, 40.56])}
${HP_L1(6, [1232.7, 1308.8, 1483.3, 1659.3], [32.44, 34.44, 39.03, 43.67])}
${HP_L1(7, [1308.8, 1409.0, 1565.3, 1689.5], [34.44, 37.08, 41.19, 44.46])}
${HP_L1(8, [1337.1, 1444.9, 1584.9, 1721.4], [35.19, 38.02, 41.71, 45.3])}
${HP_L1(9, [1444.9, 1545.2, 1659.3, 1755.0], [38.02, 40.66, 43.67, 46.18])}
Health Professional Level 2.1|1945.40|51.19
Health Professional Level 2.2|1983.20|52.19
Health Professional Level 3|1983.20|52.19
Health Professional Level 4|2499.10|65.77
`),
  ratesClause: "cl 16.2(a) (Support Services) and cl 17.1–17.2 (Health Professionals)",
  entryLevel: HPSS_SUPPORT_LEVEL_1,
  classificationNotes: [
    { level: "Support Services Levels 1 to 9", description: "Non-clinical and support roles across health: cleaners and orderlies, administration, cooks, pathology and dental support, technicians and managers (Schedule A.1). Levels 8 and 9 have three pay points; progression is by annual movement for full-time staff or 1,824 hours of similar experience for part-time and casual staff (cl 16.1). Dental assistants (Levels 3, 5, 6, 7) and pathology collectors (Levels 5, 6, 7) have their own transitional rates to 31 December 2026 and are not in these rows." },
    { level: "Health Professional Level 1", description: "Paid by the AQF level of the profession's standard minimum qualification (AQF 5 to 9, Schedule B) and years of experience in the profession: 1st year, 2nd–3rd year, 4th–6th year and 7th year or more (cl 17.1). For example, physiotherapists and occupational therapists sit at AQF 7; psychologists at AQF 9." },
    { level: "Health Professional Levels 2 to 4", description: "Level 2.1 and 2.2 are senior clinicians, specialists, supervisors or educators (under 5 years and 5 years or more at Level 2); Level 3 is an advanced clinician, senior specialist or section manager; Level 4 is a manager (cl 17.2, Schedule A.2)." },
  ],
  // Casual overtime compounds (basis compounded); every other casual column is tabulated as a % of the minimum rate.
  matrix: [
    { label: "Mon–Fri ordinary hours", fullTime: 1, casual: 1.25, casualBasis: "additive" },
    { label: "Saturday and Sunday", fullTime: 1.5, casual: 1.75, casualBasis: "additive" },
    { label: "Public holiday", fullTime: 2.5, casual: 2.75, casualBasis: "additive" },
    { label: "Shiftwork", fullTime: 1.15, casual: 1.4, casualBasis: "additive" },
  ],
  casualPenaltyBasis: "compounded",
  casualRuleSummary:
    "Casual weekend work is 175% of the minimum rate with no 25% loading on top (cl 26.1(b)); casual shiftwork is 140% (cl 26.3(b)); and a casual public holiday is 275%, the 250% plus the 25% loading (Schedule C.2.3). Casual overtime is different: the loading is added to the minimum rate first and the overtime percentage is then applied to that, so 150% becomes 187.5% and 200% becomes 250% of the minimum rate (cl 25.3).",
  // cl 26 and 33.2.
  penalties: [
    { label: "Saturday or Sunday ordinary hours", fullTime: 1.5, casual: 1.75, casualBasis: "additive", note: "Casuals get 175% for all time worked on a Saturday or Sunday and are NOT also paid the 25% loading (cl 26.1(b))." },
    { label: "Public holiday (all time worked)", fullTime: 2.5, casual: 2.75, casualBasis: "additive", note: "Casuals are paid 275% (Schedule C.2.3, C.1.7)." },
    { label: "Shiftwork — afternoon or night (finishing 6 pm to 8 am or starting 6 pm to 6 am)", fullTime: 1.15, casual: 1.4, casualBasis: "additive", note: "Casuals get 140% and not the 25% loading (cl 26.3(b)). The shift loading does not apply on a Saturday, Sunday or public holiday (cl 26.3(c))." },
  ],
  penaltiesClause: "cl 26, cl 33.2 and Schedule C",
  penaltyNotes: [
    "Ordinary hours for a day worker are 6.00 am to 6.00 pm Monday to Friday, but 7.30 am to 9.00 pm Monday to Friday and 8.00 am to 4.30 pm on Saturday in private medical, dental, pathology, physiotherapy, chiropractic and osteopathic practices, and longer spans in private medical imaging practices (cl 13.2). Hours outside the spread are overtime.",
    "The weekend rate is a flat 150% of the minimum rate for all ordinary hours between midnight Friday and midnight Sunday (cl 26.1(a)). It is not split into Saturday and Sunday and has no first-two-hours step.",
    "Overtime rates are paid in substitution for, not on top of, the penalty rates in cl 26 (cl 25.2(b), 25.3(b)).",
  ],
  // cl 25.2–25.3.
  overtime: [
    { label: "Monday to Saturday — first 2 hours", fullTime: 1.5, casual: 1.5 },
    { label: "Monday to Saturday — after 2 hours", fullTime: 2.0, casual: 2.0 },
    { label: "Sunday — all overtime", fullTime: 2.0, casual: 2.0 },
    { label: "Public holiday — all overtime", fullTime: 2.5, casual: 2.5 },
  ],
  overtimeClause: "cl 25.2–25.3 and Schedule C.1.4, C.2.2",
  overtimeNotes: [
    "Overtime is time over ordinary hours or 10 hours in a shift (cl 25.1). For casuals it is also time over 38 hours a week or 76 hours a fortnight (cl 25.1(c)).",
    "The casual column is a percentage of the casual hourly rate, which already includes the 25% loading: that is 187.5% of the minimum rate for the first 2 hours, 250% after that and on a Sunday, and 312.5% on a public holiday (cl 25.3(a)).",
    "An employee is entitled to 10 consecutive hours off between the end of work on one day and the start on the next (cl 25.4(a)).",
  ],
  junior: null,
  noJuniorNote:
    "Health Professional employees have no junior rates. Support Services juniors are paid a percentage of the adult rate by age (cl 16.3: under 17, 50%; 17, 60%; 18, 70%; 19, 80%; 20, 90%), which this page does not tabulate.",
  juniorPhaseIn: null,
  // cl 23.
  allowances: [
    { name: "On-call — Monday to Saturday", amount: 26.34, unit: "per 24 hours", clause: "cl 23.2(d)(i)" },
    { name: "On-call — Sunday or public holiday", amount: 52.56, unit: "per 24 hours", clause: "cl 23.2(d)(ii)" },
    { name: "Heat allowance — over 40°C up to 46°C", amount: 0.61, unit: "per hour", clause: "cl 23.2(a)", note: "Over 46°C it is $0.73 an hour." },
    { name: "Nauseous or offensive work", amount: 0.61, unit: "per hour", clause: "cl 23.2(b)", note: "At least $3.29 a week for any week in which such work is done." },
    { name: "Occasional interpreting", amount: 1.34, unit: "per occasion", clause: "cl 23.2(c)", note: "Capped at $15.49 a week." },
    { name: "Meal allowance (overtime of more than 1 hour after the usual finishing time)", amount: 17.3, unit: "per occasion", clause: "cl 23.3(e)(i)", note: "A further $15.60 where the overtime exceeds 4 hours." },
    { name: "Tool allowance — chefs and cooks not supplied with tools", amount: 13.41, unit: "per week", clause: "cl 23.3(g)" },
    { name: "Own motor vehicle (at least)", amount: 1.01, unit: "per km", clause: "cl 23.3(h)(i)" },
  ],
  allowancesClause: "cl 23",
  hoursNotes: [
    "A casual's minimum engagement is 3 hours, or 2 hours for cleaners in private medical practices (cl 11.2–11.3). A casual can work up to and including 38 ordinary hours a week (cl 11.1).",
    "A full-time employee's ordinary hours are an average of 38 a week over a fortnight or 4 weeks, with no more than 10 ordinary hours in a day (cl 13.1).",
    "Progression to the next Support Services pay point is by annual movement for full-time employees, or after 1,824 hours of similar experience for part-time and casual employees (cl 16.1).",
  ],
  unverified: [
    "Dental assistant (Levels 3, 5, 6, 7) and pathology collector (Levels 5, 6, 7) transitional rates to 31 December 2026 (cl 16.2(b)–(c))",
    "The classification translation rules for staff who were already employed on 30 September 2026 (Schedule J.4), which can leave an individual on a higher rate than the new table",
    "Later phase-in stages of the Health Professional rates (30 June 2027 to 2030). Do not assume this table is the rate you will be paid next year",
    "Support Services juniors, cooking, dental technician and gardening apprentices (cl 16.3–16.7) and other special rates",
  ],
};

// -----------------------------------------------------------------------------
// Timber Industry Award 2020 (MA000071). Consolidated to 1 July 2026 (PR799280
// and PR799351). Three streams, each with its own classification table.
// -----------------------------------------------------------------------------

const TS = (stream: string, raw: string): string =>
  raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => `${stream} — ${l}`)
    .join("\n");

export const TIMBER_STREAMS = {
  general: "General Timber",
  furniture: "Wood and Timber Furniture",
  pulp: "Pulp and Paper",
} as const;

const TIMBER_GENERAL_RAW = `
Level 1|978.10|25.74
Level 2|1004.90|26.44
Level 3|1029.10|27.08
Level 4|1062.90|27.97
Level 5|1119.10|29.45
Level 6|1154.30|30.38
Level 7|1221.10|32.13
`;

export const TIMBER_AWARD: ModernAwardData = {
  key: "timber",
  meta: {
    name: "Timber Industry Award 2020",
    shortName: "Timber Award",
    code: "MA000071",
    href: "/timber-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799280 and PR799351)",
    determination: "PR799351",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000071.html",
    summaryUrl: SUMMARY("MA000071"),
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 12.2",
    verifiedOn: VERIFIED_ON,
    ratesLabel: "Adult minimum rates for the General Timber, Wood and Timber Furniture and Pulp and Paper streams",
  },
  // cl 20.1(a)–(c).
  rates: parse(`
${TS(TIMBER_STREAMS.general, TIMBER_GENERAL_RAW)}
${TS(TIMBER_STREAMS.furniture, `
Level 1|978.10|25.74
Level 2|1004.90|26.44
Level 3|1029.10|27.08
Level 4|1062.90|27.97
Level 4A|1080.20|28.43
Level 5|1119.10|29.45
Level 6|1154.30|30.38
Level 7|1221.10|32.13
`)}
${TS(TIMBER_STREAMS.pulp, `
Level 1|1013.50|26.67
Level 2|1046.90|27.55
Level 3|1067.30|28.09
Level 4|1087.40|28.62
Level 5|1119.10|29.45
Level 6|1154.30|30.38
Level 7|1189.40|31.30
Level 8|1221.10|32.13
Level 9|1256.20|33.06
`)}
`),
  ratesClause: "cl 20.1(a)–(c)",
  entryLevel: "General Timber — Level 1",
  classificationNotes: [
    { level: "Three streams", description: "The General Timber stream (Schedule A), the Wood and Timber Furniture stream (Schedule B) and the Pulp and Paper stream (Schedule C) each have their own classification definitions and minimum rate table. Find your stream first, then your level." },
    { level: "Level 4A", description: "A Wood and Timber Furniture stream grade only, sitting between Level 4 and Level 5 (cl 20.1(b))." },
    { level: "Pulp and Paper", description: "Has nine levels and starts higher: Level 1 is $26.67 an hour against $25.74 in the other two streams (cl 20.1(c))." },
    { level: "Forest work", description: "A forest work allowance of $35.81 a week and a low loader allowance are paid for all purposes (cl 22.2) and raise the ordinary hourly rate for the employees who get them. They are not in the rows above." },
  ],
  matrix: [
    { label: "Mon–Fri ordinary hours", fullTime: 1, casual: 1.25, casualBasis: "additive" },
    { label: "Saturday — first 2 hrs", fullTime: 1.5, casual: 1.5, employment: "permanent" },
    { label: "Saturday — after 2 hrs", fullTime: 2.0, casual: 2.0, employment: "permanent" },
    { label: "Sunday", fullTime: 2.0, casual: 2.0, employment: "permanent" },
    { label: "Public holiday", fullTime: 2.5, casual: 2.5, employment: "permanent" },
    {
      label: "Public holiday (General Timber only)",
      fullTime: 2.5,
      casual: 2.75,
      casualBasis: "additive",
      employment: "casual",
      appliesTo: [
        "General Timber — Level 1",
        "General Timber — Level 2",
        "General Timber — Level 3",
        "General Timber — Level 4",
        "General Timber — Level 5",
        "General Timber — Level 6",
        "General Timber — Level 7",
      ],
    },
  ],
  casualPenaltyBasis: "compounded",
  casualRuleSummary:
    "A casual's ordinary rate is the minimum plus 25% (cl 12.2). Casual overtime is then a percentage of that casual rate, so 150% becomes 187.5% and 200% becomes 250% of the minimum rate (Schedule D.3.3). The casual public holiday rate of 275% (the 250% plus the 25% loading) is tabulated for the General Timber stream only (cl 27.1(d)); for the other streams no casual public holiday dollar rate is printed.",
  // cl 27.1, 27.3(c)–(d) and Schedule D.2.1 / D.3.1.
  penalties: [
    { label: "Day worker — Saturday, first 2 hours", fullTime: 1.5, casual: 1.5, employment: "permanent", note: "All Saturday work for weekly employees on the employer's instructions: minimum 3 hours (cl 27.1(a)). The casual overtime rates apply to a casual who works Saturday (see Overtime)." },
    { label: "Day worker — Saturday, after 2 hours", fullTime: 2.0, casual: 2.0, employment: "permanent" },
    { label: "Day worker — Sunday", fullTime: 2.0, casual: 2.0, employment: "permanent", note: "Minimum 3 hours (cl 27.1(b)). Pulp and Paper: 200% for a minimum of 4 hours (cl 27.3(c)(ii))." },
    { label: "Day worker — public holiday (minimum 3 hours)", fullTime: 2.5, casual: 2.75, casualBasis: "additive", note: "Casual 275% applies in the General Timber stream only (cl 27.1(d))." },
    { label: "Afternoon shift or rotating night shift", fullTime: 1.15, casual: 1.4, casualBasis: "additive", note: "Casual 140% (Schedule D.3.2)." },
    { label: "Night shift — non-rotating", fullTime: 1.3, casual: 1.55, casualBasis: "additive", note: "Casual 155% (Schedule D.3.2)." },
  ],
  penaltiesClause: "cl 27 and Schedule D",
  penaltyNotes: [
    "Day workers' ordinary hours are 6.30 am to 6.00 pm Monday to Friday (cl 17.2(a)), and can be worked on any day by agreement (cl 17.2(c)). Without that agreement, weekend work is paid at the Saturday and Sunday rates above.",
    "The award tabulates casual weekend rates for shiftworkers (Saturday 175%, Sunday 225%, Schedule D.3.2) but not for a casual day worker, who is paid the casual overtime rates for Saturday and Sunday work. We therefore publish no casual Saturday or Sunday dollar column for day work.",
    "Shift loadings: afternoon shift 115%, rotating night shift 115%, non-rotating night shift 130% (cl 27.3(b)). Saturday, Sunday and public holiday ordinary shifts are 150% (Saturday), 200% (Sunday and public holiday) in substitution for the shift loading (cl 27.3(d)).",
  ],
  // cl 26.2 and Schedule D.2.3 / D.3.3.
  overtime: [
    { label: "Day work — first 2 hours", fullTime: 1.5, casual: 1.5 },
    { label: "Day work — after 2 hours", fullTime: 2.0, casual: 2.0 },
    { label: "Sunday", fullTime: 2.0, casual: 2.0 },
    { label: "Public holiday", fullTime: 2.5, casual: null },
  ],
  overtimeClause: "cl 26.2 and Schedule D.2.3 / D.3.3",
  overtimeNotes: [
    "Overtime is all time worked outside the 6.30 am to 6.00 pm spread or in excess of the ordinary daily hours (cl 26.1). Each day stands alone, and the hourly rate for overtime is the weekly rate divided by 38 (cl 26.2(c)–(d)).",
    "For a casual day worker the percentages apply to the casual ordinary rate, so first-2-hours overtime is 187.5% and after-2-hours or Sunday overtime is 250% of the minimum rate (cl 12.3, Schedule D.3.3).",
    "Shiftworkers' overtime differs: 200% on continuous work, otherwise 150% for the first 2 hours and 200% after (cl 26.3(a)). Not reproduced in the table.",
  ],
  junior: null,
  noJuniorNote:
    "Unapprenticed juniors in the Timber Industry Award are paid a percentage of the Level 2 rate for their stream (age 16, 40%; 17, 55%; 18, 70%; 19, 85%; 20, 100%), calculated in multiples of 5 cents (cl 20.6–20.7). This page does not tabulate them. Apprentices are paid a percentage of Level 5 by year (cl 20.3).",
  juniorPhaseIn: null,
  // Schedule E (cl 22, 23).
  allowances: [
    { name: "Forest work allowance (not pieceworkers)", amount: 35.81, unit: "per week", clause: "cl 22.3", note: "Paid for all purposes. NOT in the rates above." },
    { name: "Low loader allowance", amount: 1.9, unit: "per extra tonne over 43 tonnes GCM", clause: "cl 22.4", note: "Paid for all purposes." },
    { name: "Leading hand — supervising 2 to 6 employees", amount: 36.93, unit: "per week", clause: "cl 22.5(a)" },
    { name: "Leading hand — supervising more than 6 employees", amount: 57.07, unit: "per week", clause: "cl 22.5(b)" },
    { name: "First aid allowance", amount: 22.38, unit: "per week", clause: "cl 22.9" },
    { name: "Dirty work allowance", amount: 3.69, unit: "per day", clause: "cl 22.11" },
    { name: "Height money", amount: 2.24, unit: "per day or shift", clause: "cl 22.16" },
    { name: "Meal allowance (overtime)", amount: 19.14, unit: "per meal", clause: "cl 23.3(a)" },
    { name: "Vehicle allowance", amount: 1.0, unit: "per km", clause: "cl 23.2(a)" },
    { name: "Camping allowance (including firefighters)", amount: 32.19, unit: "per working day", clause: "cl 23.5", note: "Maximum $225.36 a week." },
  ],
  allowancesClause: "cl 22 and cl 23",
  hoursNotes: [
    "A casual engaged for part of a day is paid for at least 4 hours (cl 12.1).",
    "Ordinary hours average 38 a week over a cycle of 1 to 4 weeks, worked between 6.30 am and 6.00 pm Monday to Friday (cl 17.2).",
    "Wood and Timber Furniture employees can be paid by results if the rates let an average worker earn at least 12.5% over the minimum weekly rate, with the weekly rate guaranteed (cl 20.2). General Timber pieceworkers are covered by cl 13 and are not in this table.",
  ],
  unverified: [
    "General Timber stream piecework and the district piece rates (cl 13 and Schedule H)",
    "Shiftworker overtime and shift Saturday, Sunday and public holiday dollar rates (Schedule D.2.2, D.2.4–D.2.5, D.3.2)",
    "Apprentice, saw doctor apprentice and unapprenticed junior rates (cl 20.3–20.7), fire fighting employees (cl 14) and watchpersons (cl 17.4)",
    "Casual Saturday and Sunday ordinary hours for day workers, and the casual public holiday rate in the Wood and Timber Furniture and Pulp and Paper streams, which the award does not tabulate",
    "Whether the forest work and low loader allowances (both for all purposes) apply to you, which would raise your ordinary hourly rate",
  ],
};

// -----------------------------------------------------------------------------
// Meat Industry Award 2020 (MA000059). Consolidated to 1 July 2026 (PR799280
// and PR799339). Three types of establishment carry different spans of hours and
// weekend penalties (processing, manufacturing, retail).
// -----------------------------------------------------------------------------

const MEAT_PROCESSING = ["MI 1", "MI 2", "MI 3", "MI 4", "MI 5", "MI 6", "MI 7"] as const;

export const MEAT_AWARD: ModernAwardData = {
  key: "meat-industry",
  meta: {
    name: "Meat Industry Award 2020",
    shortName: "Meat Industry Award",
    code: "MA000059",
    href: "/meat-industry-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799280 and PR799339)",
    determination: "PR799339",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000059.html",
    summaryUrl: SUMMARY("MA000059"),
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 12.4(a)",
    verifiedOn: VERIFIED_ON,
  },
  // cl 16.1.
  rates: parse(`
MI 1|978.10|25.74
MI 2|1004.90|26.44
MI 3|1010.90|26.60
MI 4|1034.60|27.23
MI 5|1052.90|27.71
MI 6|1074.50|28.28
MI 7|1119.10|29.45
MI 8|1160.20|30.53
`),
  ratesClause: "cl 16.1",
  entryLevel: "MI 1",
  classificationNotes: [
    { level: "MI 1 to MI 7", description: "Production, processing and trade classifications in meat processing, manufacturing and retail establishments, from entry-level labour (MI 1) to trade-qualified and advanced (MI 7) (cl 13, Schedule A)." },
    { level: "MI 8", description: "The highest classification. The award's own penalty tables for meat processing and manufacturing establishments stop at MI 7; MI 8 appears in the retail establishment tables (Schedule B.3), so the processing and manufacturing weekend columns below are not shown for MI 8." },
    { level: "Establishment type", description: "The spread of hours and weekend rates depend on whether you work in a meat processing, meat manufacturing or meat retail establishment (cl 14.3–14.5). Retail employees of a processing or manufacturing establishment are treated as retail." },
  ],
  matrix: [
    { label: "Mon–Fri ordinary hours", fullTime: 1, casual: 1.25 },
    { label: "Saturday — processing (if agreed)", fullTime: 1.5, casual: 1.5, casualTabulated: true, appliesTo: MEAT_PROCESSING },
    { label: "Sunday — processing (if agreed)", fullTime: 2.0, casual: 2.0, casualTabulated: true, appliesTo: MEAT_PROCESSING },
    { label: "Saturday — manufacturing / retail", fullTime: 1.25, casual: 1.25, casualTabulated: true },
    { label: "Sunday — retail", fullTime: 1.5, casual: 1.5, casualTabulated: true },
  ],
  // cl 24 and Schedule B.
  penalties: [
    { label: "Processing — Saturday ordinary hours (only if agreed under cl 14.3(b))", fullTime: 1.5, casual: 1.5, casualTabulated: true, note: "Casuals are paid the same 150%, not 150% plus a loading (Schedule B.1.3)." },
    { label: "Processing — Sunday ordinary hours (only if agreed under cl 14.3(b))", fullTime: 2.0, casual: 2.0, casualTabulated: true, note: "Casuals are paid the same 200%, with no loading on top (Schedule B.1.3)." },
    { label: "Manufacturing — Saturday, up to 4 ordinary hours between 6 am and 6 pm", fullTime: 1.25, casual: 1.25, casualTabulated: true, note: "A casual gets this 125% instead of the casual loading (cl 24.2(a)(ii))." },
    { label: "Retail — Saturday ordinary hours between 4 am and 6 pm", fullTime: 1.25, casual: 1.25, casualTabulated: true, note: "A casual gets this 125% instead of the casual loading (cl 24.3(c))." },
    { label: "Retail — Sunday ordinary hours between 8 am and 6 pm", fullTime: 1.5, casual: 1.5, casualTabulated: true, note: "Casuals are paid the weekend penalty instead of the casual loading (cl 24.3(c))." },
  ],
  penaltiesClause: "cl 24 and Schedule B.1–B.3",
  penaltyNotes: [
    "Weekend penalties are paid in place of the casual loading, not on top of it: a casual who works ordinary hours on a weekend gets the weekend rate shown (cl 24.1, 24.2(a)(ii), 24.3(c)). That is why a casual Saturday in a processing establishment is 150%, not 175%.",
    "Spreads of hours: processing, Monday to Friday 6.00 am to 8.00 pm (Saturday and Sunday only by agreement); manufacturing, Monday to Saturday 6.00 am to 6.00 pm with up to 4 ordinary hours on Saturday; retail, Monday to Friday 4.00 am to 9.00 pm, Saturday 4.00 am to 6.00 pm and Sunday 8.00 am to 6.00 pm (cl 14.3–14.5).",
    "Public holiday pay is not tabulated here. It is a different rate per holiday: Christmas Day and Anzac Day 200%, Good Friday 150% for the first 4 hours then 200%, any other public holiday 150% for the first 2 hours then 200%; and for employees other than casuals those rates are paid in addition to the ordinary pay for the day (cl 31.3).",
  ],
  // cl 22.1.
  overtime: [
    { label: "Monday to Saturday — first 3 hours", fullTime: 1.5, casual: 1.5 },
    { label: "Monday to Saturday — after 3 hours", fullTime: 2.0, casual: 2.0 },
    { label: "Sunday — all overtime in meat processing establishments", fullTime: 2.0, casual: 2.0 },
  ],
  overtimeClause: "cl 22.1 and Schedule B.1.2 / B.2.2 / B.3.2",
  overtimeNotes: [
    "Overtime is all time outside the ordinary spread of hours for the establishment type (cl 22.1(a)). Sunday overtime in a meat processing establishment has a minimum payment of 4 hours (cl 22.1(b)).",
    "The casual loading is not paid on overtime hours, so a casual's overtime percentages are the same as a permanent employee's (cl 22.1(c)).",
  ],
  casualPenaltyBasis: "additive",
  publicHolidayCasualUnpublished: true,
  // cl 16.2.
  junior: {
    scale: [
      { age: "Under 17", percentage: 0.5 },
      { age: "17", percentage: 0.6 },
      { age: "18", percentage: 0.75 },
      { age: "19", percentage: 0.85 },
      { age: "20 and over", percentage: 1 },
    ],
    clause: "cl 16.2",
    appliesTo: "the adult rate for the classification (full-time juniors: the weekly rate; part-time and casual juniors: the hourly rate)",
    adultAge: 20,
  },
  juniorPhaseIn: null,
  // Schedule C.
  allowances: [
    { name: "Leading hand — supervising 3 to 9 employees", amount: 17.91, unit: "per week", clause: "cl 20.2(c)(i)" },
    { name: "Leading hand — supervising 10 or more employees", amount: 25.74, unit: "per week", clause: "cl 20.2(c)(ii)" },
    { name: "Cold temperature — below zero but not below −16°C", amount: 0.77, unit: "per hour", clause: "cl 20.2(a)", note: "Higher bands: $1.33, $1.88 and $2.56 an hour as it gets colder (cl 20.2(a))." },
    { name: "First aid allowance", amount: 4.18, unit: "per day", clause: "cl 20.2(b)" },
    { name: "Clothing — meat processing establishments", amount: 3.7, unit: "per week", clause: "cl 20.3(a)(i)", note: "Or $0.74 a day." },
    { name: "Meal allowance (overtime of 1.5 hours or more)", amount: 19.14, unit: "per occasion", clause: "cl 20.3(b)" },
  ],
  allowancesClause: "cl 20 and Schedule C",
  hoursNotes: [
    "A casual's minimum engagement is 4 hours a day or shift (2 hours for casual cleaners and 3 hours for casual bookkeeping clerks) (cl 12.3, 12.2). A casual's ordinary hours cannot exceed 38 in a week (cl 14.1(c)).",
    "A full-time employee's ordinary hours are 38 a week, or an average of 38 within 152 hours in 28 days, and no more than 10 hours on any day or shift (cl 14.1).",
    "Cleaners can work ordinary hours from 6.30 am to midnight and get 105% for hours starting after 8.30 am and before noon, and 112.5% for hours starting at noon or later and finishing by midnight (cl 14.2, 24.4).",
  ],
  unverified: [
    "Public holiday dollar rates, which differ by holiday and are paid in addition to ordinary pay for non-casuals (cl 31.3)",
    "Daily hire employees (cl 11), payment by results (cl 18), and relieving inspection duties (cl 19)",
    "Shiftwork rates (cl 23), load out area and cleaner rates other than those described above, and annual leave for shiftworkers",
    "Apprentice and trainee rates (cl 16.3–16.5) and the supported wage system",
  ],
};

// -----------------------------------------------------------------------------
// Commercial Sales Award 2020 (MA000083). Consolidated to 1 July 2026 (PR799280
// and PR799363). An OCCUPATIONAL award: commercial travellers, merchandisers
// and advertising sales representatives, unless another modern award has a
// classification for the work.
// -----------------------------------------------------------------------------

export const COMMERCIAL_SALES_AWARD: ModernAwardData = {
  key: "commercial-sales",
  meta: {
    name: "Commercial Sales Award 2020",
    shortName: "Commercial Sales Award",
    code: "MA000083",
    href: "/commercial-sales-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799280 and PR799363)",
    determination: "PR799363",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000083.html",
    summaryUrl: SUMMARY("MA000083"),
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 11.1(a)",
    verifiedOn: VERIFIED_ON,
  },
  // cl 15.1.
  rates: parse(`
Probationary Traveller|1010.52|26.59
Merchandiser|1044.00|27.47
Commercial Traveller / Advertising Sales Representative|1122.80|29.55
`),
  ratesClause: "cl 15.1",
  entryLevel: "Probationary Traveller",
  classificationNotes: [
    { level: "Probationary Traveller", description: "Paid 90% of the Commercial Traveller / Advertising Sales Representative weekly rate (cl 15.1 footnote)." },
    { level: "Merchandiser", description: "Stocks, displays and promotes product in outlets (cl 4.1)." },
    { level: "Commercial Traveller / Advertising Sales Representative", description: "Sells goods or advertising to customers away from the employer's premises. A Commercial Traveller can never be paid solely by commission, salary or retainer below this minimum rate (cl 15.4)." },
  ],
  matrix: [
    { label: "Mon–Fri to 6 pm", fullTime: 1, casual: 1.25 },
    { label: "Saturday", fullTime: 1.5, casual: 1.75 },
    { label: "Sunday", fullTime: 2.0, casual: 2.25 },
    { label: "Public holiday", fullTime: 2.5, casual: 2.75 },
  ],
  // cl 19.1–19.2 and 25.3; Schedule A.1.1 / A.2.1.
  penalties: [
    { label: "Monday to Friday after 6.00 pm", fullTime: 1.5, casual: 1.75, note: "Also any work beyond ordinary hours (cl 19.1(a), 19.2(a))." },
    { label: "Saturday (minimum 2 hours)", fullTime: 1.5, casual: 1.75, note: "Cl 19.1(b), 19.2(b)." },
    { label: "Sunday (minimum 3 hours)", fullTime: 2.0, casual: 2.25, note: "Cl 19.1(c), 19.2(c)." },
    { label: "Public holiday (minimum 3 hours)", fullTime: 2.5, casual: 2.75, note: "Cl 25.3; casual 275% per Schedule A.2.1. Instead of this payment, 2.5 days' paid leave may be granted by agreement." },
    { label: "Travelling for work on a weekend or public holiday", fullTime: 1.5, casual: 1.75, note: "150% of the minimum hourly rate for travelling time, minimum 3 hours' travelling (cl 25.4; Schedule A.1.1)." },
  ],
  penaltiesClause: "cl 19, cl 25.3–25.4 and Schedule A",
  penaltyNotes: [
    "The Commercial Sales Award lets ordinary hours be worked on any day of the week (cl 13.3), but pays a higher rate for any work after 6.00 pm on a weekday, on a Saturday or on a Sunday. In practice these are the overtime-style rates the pay guide prints in its ordinary and penalty rates table.",
    "Casual rates are the permanent percentage plus the 25% loading: 150% becomes 175%, 200% becomes 225%, 250% becomes 275% (cl 19.2 NOTE, Schedule A.2.1).",
  ],
  // cl 19.1–19.2.
  overtime: [
    { label: "Monday to Friday — after 6.00 pm or beyond ordinary hours", fullTime: 1.5, casual: 1.75 },
    { label: "Saturday", fullTime: 1.5, casual: 1.75 },
    { label: "Sunday", fullTime: 2.0, casual: 2.25 },
    { label: "Public holiday", fullTime: 2.5, casual: 2.75 },
  ],
  overtimeClause: "cl 19 and Schedule A.1.2 / A.2.1",
  overtimeNotes: [
    "Full-time and part-time employees: 150% of the minimum hourly rate after 6.00 pm or beyond ordinary hours Monday to Friday, 150% on a Saturday and 200% on a Sunday (cl 19.1). Casuals: 175%, 175% and 225% (cl 19.2).",
    "Ordinary hours are an average of 38 a week with a maximum of 152 over 28 consecutive days and no more than 10 on any day (cl 13.2–13.4).",
  ],
  casualPenaltyBasis: "additive",
  // cl 15.3; Schedule A.3.1 is hourly (percentage of the adult hourly rate).
  junior: {
    scale: [
      { age: "Under 19", percentage: 0.675 },
      { age: "19", percentage: 0.8 },
      { age: "20", percentage: 0.9 },
      { age: "21 and over", percentage: 1 },
    ],
    clause: "cl 15.3",
    appliesTo: "the Commercial Traveller / Advertising Sales Representative rate",
    adultAge: 21,
    baseLevel: "Commercial Traveller / Advertising Sales Representative",
    basis: "hourly",
  },
  juniorPhaseIn: null,
  // cl 17.2; Schedule B.
  allowances: [
    { name: "Weekend allowance (required to be away from home or headquarters for a weekend)", amount: 66.55, unit: "per weekend", clause: "cl 17.2(a)" },
    { name: "Living away from home (2 or more consecutive nights in a week)", amount: 83.79, unit: "per week", clause: "cl 17.2(b)" },
    { name: "Own motor car", amount: 1.0, unit: "per km", clause: "cl 17.2(c)(i)" },
    { name: "Own motorcycle", amount: 0.34, unit: "per km", clause: "cl 17.2(c)(ii)" },
  ],
  allowancesClause: "cl 17.2",
  hoursNotes: [
    "A casual must be engaged and paid for at least 2 consecutive hours each time they attend work (cl 11.3).",
    "Employers must reimburse reasonable expenses actually and properly incurred, including parking, 3-star accommodation, meals when away overnight and the cost of garaging for an employee on the living-away allowance (cl 17.2(f)).",
    "A Commercial Traveller or Probationary Traveller cannot be paid solely by commission, salary or retainer lower than the minimum rate (cl 15.4).",
  ],
  unverified: [
    "Whether this award covers you: it does not cover employees under the Clerks—Private Sector, Contract Call Centres or Graphic Arts, Printing and Publishing awards, and it gives way to any other modern award with a classification for the work (cl 4)",
    "Trainee rates (Schedule E to the Miscellaneous Award) and the supported wage system (Schedule C)",
    "Commission arrangements, which sit above the minimum rate and are set by contract",
  ],
};

// -----------------------------------------------------------------------------
// Mining Industry Award 2020 (MA000011). Consolidated to 1 July 2026 (PR799280
// and PR799292).
//
// Rows are the ORDINARY HOURLY RATE: the cl 15.1 minimum weekly rate plus the
// $41.41 industry allowance paid for all purposes (cl 18.2(b)), divided by 38.
// Pinned to Schedule B.1.3. Every casual percentage in this award is a
// percentage of the CASUAL ordinary hourly rate (Schedule B.2.3), so the award
// is "compounded" throughout.
// -----------------------------------------------------------------------------

const MINING_INDUSTRY_ALLOWANCE = 41.41;
export const MINING_MIN_WEEKLY: ReadonlyArray<readonly [string, number]> = [
  ["Entry level (Introductory)", 1004.9],
  ["Level 1 (Basic)", 1047.3],
  ["Level 2 (Intermediate)", 1086.2],
  ["Level 3 (Competent)", 1119.1],
  ["Level 4 (Advanced)", 1193.9],
  ["Level 5 (Advanced specialist)", 1271.8],
  ["Level 6 (Dual trade)", 1334.1],
  ["Level 7 (Dual trade instrumentation)", 1388.1],
];

export const MINING_AWARD: ModernAwardData = {
  key: "mining",
  meta: {
    name: "Mining Industry Award 2020",
    shortName: "Mining Award",
    code: "MA000011",
    href: "/mining-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799280 and PR799292)",
    determination: "PR799292",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000011.html",
    summaryUrl: SUMMARY("MA000011"),
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 11.2(b)",
    verifiedOn: VERIFIED_ON,
    ratesLabel: "Ordinary hourly rates (the cl 15.1 minimum rate plus the $41.41 all-purpose industry allowance)",
    hourlyDerivation:
      "Weekly = the cl 15.1 minimum weekly rate plus the $41.41 industry allowance paid for all purposes (cl 18.2(b)); hourly = that total divided by 38. This is the \"ordinary hourly rate\" every percentage in the award applies to (Schedule B.1.1). Before the electrician's licence, leading hand, underground and other allowances.",
  },
  rates: MINING_MIN_WEEKLY.map(([level, min]) => {
    const weekly = cents(min + MINING_INDUSTRY_ALLOWANCE);
    return { level, weekly, hourly: cents(weekly / 38) };
  }),
  ratesClause: "cl 15.1(a) + cl 18.2(b), calculated as the ordinary hourly rate (Schedule B.1)",
  entryLevel: "Entry level (Introductory)",
  classificationNotes: [
    { level: "Entry level to Level 3", description: "Introductory, basic, intermediate and competent mining operations employees. Level 3 (competent) has a minimum weekly rate of $1,119.10 before the industry allowance (cl 15.1, Schedule A)." },
    { level: "Levels 4 and 5", description: "Advanced and advanced specialist operators and technicians with broader skills and responsibility (Schedule A)." },
    { level: "Levels 6 and 7", description: "Dual trade, and dual trade instrumentation, the highest classifications (Schedule A)." },
    { level: "Pay point arrangements", description: "The award has no pay points: you are paid by the level you are classified at (cl 15.1)." },
  ],
  matrix: [
    { label: "Day work", fullTime: 1, casual: 1 },
    { label: "Afternoon / night shift", fullTime: 1.15, casual: 1.15 },
    { label: "Permanent night shift", fullTime: 1.3, casual: 1.3 },
    { label: "Saturday before noon — first 3 hrs", fullTime: 1.5, casual: 1.5 },
    { label: "Saturday before noon — after 3 hrs", fullTime: 2.0, casual: 2.0 },
    { label: "Saturday after noon and Sunday", fullTime: 2.0, casual: 2.0 },
    { label: "Public holiday", fullTime: 2.5, casual: 2.5 },
  ],
  casualPenaltyBasis: "compounded",
  // cl 21.2–21.3 and Schedule B.1.3 / B.2.3.
  penalties: [
    { label: "Afternoon or night shift", fullTime: 1.15, casual: 1.15, note: "Afternoon shift finishes after 7 pm and up to midnight; night shift finishes after midnight and up to 8 am (cl 21.1)." },
    { label: "Permanent night shift", fullTime: 1.3, casual: 1.3 },
    { label: "Saturday before 12 noon — first 3 hours", fullTime: 1.5, casual: 1.5, note: "Ordinary hours on a Saturday (cl 21.3)." },
    { label: "Saturday before 12 noon — after 3 hours", fullTime: 2.0, casual: 2.0 },
    { label: "Saturday after 12 noon, and all Sunday hours", fullTime: 2.0, casual: 2.0 },
    { label: "Public holiday", fullTime: 2.5, casual: 2.5 },
  ],
  penaltiesClause: "cl 21 and Schedule B.1.3 / B.2.3",
  penaltyNotes: [
    "Ordinary hours of a day worker can be up to 10 a day, between 6.00 am and 6.00 pm, Monday to Sunday (cl 12.4(a)); shiftworkers can work a shift of up to 10 consecutive hours on any day (cl 12.5). The weekend and public holiday rates in cl 21.3 are paid in substitution for the other penalties (cl 21.4).",
    "For casuals EVERY percentage in this award applies to the casual ordinary hourly rate, which already includes the 25% loading and the industry allowance (Schedule B.2.1). So a casual Saturday first-3-hours rate is 150% of the casual rate, which is 187.5% of the minimum ordinary rate, and a casual public holiday is 250% of the casual rate, or 312.5%.",
    "The casual loading forms part of the all-purpose rate (cl 11.3).",
  ],
  // cl 20.1–20.2.
  overtime: [
    { label: "Monday to 12 noon Saturday — first 3 hours", fullTime: 1.5, casual: 1.5 },
    { label: "Monday to 12 noon Saturday — after 3 hours", fullTime: 2.0, casual: 2.0 },
    { label: "After 12 noon Saturday and all Sunday", fullTime: 2.0, casual: 2.0 },
    { label: "Public holiday", fullTime: 2.5, casual: 2.5 },
    { label: "Continuous shiftworkers — all overtime, Monday to Sunday", fullTime: 2.0, casual: 2.0 },
  ],
  overtimeClause: "cl 20.1–20.2 and Schedule B.1.4–B.1.5, B.2.4–B.2.5",
  overtimeNotes: [
    "A casual's overtime is a percentage of the casual ordinary hourly rate, which includes the 25% loading (cl 20.1 NOTE). A continuous shiftworker is an employee in a continuous process who is rostered regularly on Sundays and public holidays (cl 21.1).",
    "Meal allowance of $22.04 on each occasion an employee is entitled to a rest break during overtime, unless a meal was provided or notice was given by the previous day or shift (cl 18.3(a)).",
  ],
  junior: null,
  noJuniorNote:
    "The Mining Industry Award allows junior employees only where the law permits them to work in mining, at 75% of the adult rate for under 17s, 85% at 17 and 100% from 18 (cl 15.2). The award does not publish junior dollar rates and the interaction with the industry allowance is not tabulated, so this page does not either.",
  juniorPhaseIn: null,
  // cl 18; Schedule C.
  allowances: [
    { name: "Industry allowance", amount: 41.41, unit: "per week", clause: "cl 18.2(b)", note: "Paid for all purposes. Already in the rates above." },
    { name: "Licence allowance — electricians required to hold an Electrical Technician licence", amount: 50.92, unit: "per week", clause: "cl 18.2(c)", note: "Paid for all purposes. NOT in the rates above." },
    { name: "Cooks and cooks' assistants on broken shifts (drilling and prospecting)", amount: 11.97, unit: "per week", clause: "cl 18.2(d)(iii)", note: "Paid for all purposes." },
    { name: "Drilling and exploration camp allowance — no meals provided", amount: 37.94, unit: "per day", clause: "cl 18.2(d)(i)", note: "$20.93 a day where the employer provides meals." },
    { name: "First aid allowance (appointed first aider)", amount: 22.38, unit: "per week", clause: "cl 18.2(e)" },
    { name: "Leading hand — in charge of 3 to 10 employees", amount: 49.24, unit: "per week", clause: "cl 18.2(f)" },
    { name: "Leading hand — in charge of 11 to 20 employees", amount: 62.67, unit: "per week", clause: "cl 18.2(f)" },
    { name: "Leading hand — in charge of more than 20 employees", amount: 84.27, unit: "per week", clause: "cl 18.2(f)" },
    { name: "Underground allowance (other than underground miners)", amount: 2.06, unit: "per hour", clause: "cl 18.2(h)" },
    { name: "Meal allowance for overtime", amount: 22.04, unit: "per occasion", clause: "cl 18.3(a)" },
    { name: "Tool allowance (where the employer requires you to supply tools)", amount: 17.86, unit: "per week", clause: "cl 18.3(b)" },
  ],
  allowancesClause: "cl 18",
  hoursNotes: [
    "A casual must be engaged and paid for at least 2 consecutive hours each time they attend work (cl 11.6).",
    "A full-time employee's ordinary hours are an average of 38 a week, and can be averaged over up to 26 weeks (cl 12.1, 12.3). Day workers can be required to work up to 10 hours a day, 6.00 am to 6.00 pm, Monday to Sunday (cl 12.4).",
    "Where an employee is paid by the hour, a weekly allowance is paid as 1/38th of the weekly amount for each hour (cl 18.1).",
  ],
  unverified: [
    "Mainline locomotive drivers' rail allowance, which is 30% of the minimum rate (cl 18.2(g)), and any other all-purpose allowance you may be owed on top of these rows",
    "Recall to work for employees who are not continuous shiftworkers (cl 20.3) and rostering arrangements (cl 13)",
    "Apprentice, school-based apprentice and trainee rates (cl 15.4–15.5, Schedules D and E)",
    "Whether the award covers you at all: it covers mining operations and not, for example, ancillary work covered by another award",
  ],
};

export const OCT2_AWARDS = {
  plumbing: PLUMBING_AWARD,
  pastoral: PASTORAL_AWARD,
  horticulture: HORTICULTURE_AWARD,
  "health-professionals": HEALTH_PROFESSIONALS_AWARD,
  timber: TIMBER_AWARD,
  "meat-industry": MEAT_AWARD,
  "commercial-sales": COMMERCIAL_SALES_AWARD,
  mining: MINING_AWARD,
} as const;
