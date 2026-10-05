// =============================================================================
// October 2026 award batch: Miscellaneous (MA000104), Building and
// Construction General On-site (MA000020), Legal Services (MA000116),
// Electrical, Electronic and Communications Contracting (MA000025), Fitness
// Industry (MA000094), Real Estate Industry (MA000106), Local Government
// Industry (MA000112) and Live Performance (MA000081, Production and Support
// Staff classifications only).
//
// SOURCE. Every figure below was transcribed on 5 October 2026 from the Fair
// Work Commission consolidated award text hosted at awards.fairwork.gov.au,
// each of which reads "incorporates all amendments up to and including 1 July
// 2026" and carries the Annual Wage Review 2026 variation marked "ppc 01Jul26".
// Clause numbers are cited against each figure. Where the award publishes its
// own Schedule of hourly rates the numbers are pinned against it in
// lib/constants/__tests__/modern-awards-oct.test.ts.
//
// Rates apply from the first full pay period starting on or after 1 July 2026.
//
// ⚠️ THIS FILE DOES NOT IMPORT RUNTIME CODE FROM modern-awards.ts (type-only),
// so modern-awards.ts can register these awards without a require cycle.
//
// ⚠️ THE CASUAL RULE DIFFERS BY AWARD. Do not generalise:
//   - Misc, Fitness, Local Government: the casual loading is NOT paid on
//     overtime, so the casual overtime rate equals the permanent one (Misc
//     cl 11.1(b); Fitness cl 12.2; Local Gov cl 21.2(c)).
//   - Legal, Construction, Live Performance: casual overtime INCLUDES the
//     loading (175% / 225% / 275%).
//   - Electrical: casual penalties and overtime are the ordinary rate x 1.25 x
//     the permanent percentage (187.5%, 250%, 312.5%). Stored as additive
//     percentages of the ordinary rate so each cell rounds exactly as the
//     award's Schedule B does.
//   - Fitness: casual loading is 25% Monday to Friday but 30% on Saturday,
//     Sunday and public holidays (cl 12.1).
//   - Real Estate: ordinary hours are paid at the same rate on any day. The
//     only penalty is a public holiday, which is 200% of the casual rate.
//
// ⚠️ ELECTRICAL AND CONSTRUCTION PAY PERCENTAGES ON AN ALL-PURPOSE RATE, not
// on the table minimum. The rows for those two awards are the ordinary hourly
// rate: the minimum weekly rate plus the all-purpose industry allowance (and,
// for Electrical grade 5 and above, the tool allowance), divided by 38. For
// Electrical this is pinned to Schedule B.2.1 on every grade. For Construction
// it follows cl 19.3(b) and the "ordinary hourly rate" definition for weekly
// hire employees in the general building and construction sector.
// =============================================================================

import type { AwardRate, ModernAwardData } from "./modern-awards";

const VERIFIED_ON = "5 October 2026";
const OPERATIVE = "1 July 2026";
const EFFECTIVE_NOTE =
  "Applies from the first full pay period starting on or after 1 July 2026, not universally 1 July.";
const SUMMARY = (code: string) =>
  `https://www.fairwork.gov.au/employment-conditions/awards/awards-summary/${code.toLowerCase()}-summary`;

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

/** Rows given as level|weekly only: hourly is weekly / 38 to the cent (the award's own rule). */
function parseWeekly(raw: string): AwardRate[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [level, weekly] = line.split("|");
      if (!level || !weekly) throw new Error(`malformed award row: ${JSON.stringify(line)}`);
      const w = Number(weekly);
      return { level, weekly: w, hourly: Math.round((w / 38) * 100) / 100 };
    });
}

// -----------------------------------------------------------------------------
// Miscellaneous Award 2020 (MA000104)
// Consolidated to 1 July 2026 (PR799280, PR799384 and PR799539).
// -----------------------------------------------------------------------------

export const MISC_AWARD: ModernAwardData = {
  key: "miscellaneous",
  meta: {
    name: "Miscellaneous Award 2020",
    shortName: "Miscellaneous Award",
    code: "MA000104",
    href: "/miscellaneous-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799280, PR799384 and PR799539)",
    determination: "PR799384",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000104.html",
    summaryUrl: SUMMARY("MA000104"),
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 11.1(a)",
    verifiedOn: VERIFIED_ON,
  },
  // cl 15.1.
  rates: parse(`
Level 1|978.10|25.74
Level 2|1029.10|27.08
Level 3|1119.10|29.45
Level 4|1221.10|32.13
`),
  ratesClause: "cl 15.1",
  entryLevel: "Level 1",
  // cl 12.1.
  classificationNotes: [
    { level: "Level 1", description: "Employed for less than 3 months and not carrying out the duties of a Level 3 or Level 4 employee." },
    { level: "Level 2", description: "Employed for at least 3 months and not carrying out the duties of a Level 3 or Level 4 employee." },
    { level: "Level 3", description: "Has a trade qualification or equivalent and is carrying out duties requiring such qualifications." },
    { level: "Level 4", description: "Has advanced trade qualifications and is carrying out duties requiring them, or is a sub-professional employee." },
  ],
  matrix: [
    { label: "Mon–Fri 7am–7pm", fullTime: 1, casual: 1.25 },
    { label: "Mon–Fri outside 7am–7pm", fullTime: 1.2, casual: 1.45 },
    { label: "Saturday", fullTime: 1.2, casual: 1.45 },
    { label: "Sunday", fullTime: 1.5, casual: 1.75 },
    { label: "Public holiday", fullTime: 2.5, casual: 2.5, casualTabulated: true },
  ],
  // cl 20; Schedule A.1.1 and A.2.1.
  penalties: [
    { label: "Monday to Friday — outside 7.00 am to 7.00 pm", fullTime: 1.2, casual: 1.45 },
    { label: "Saturday — all day", fullTime: 1.2, casual: 1.45 },
    { label: "Sunday — all day", fullTime: 1.5, casual: 1.75 },
    {
      label: "Public holiday — all day",
      fullTime: 2.5,
      casual: 2.5,
      casualTabulated: true,
      note: "Casuals get the same 250% as permanent staff — the table has no extra 25% on a public holiday.",
    },
  ],
  penaltiesClause: "cl 20 and Schedule A.1.1 / A.2.1",
  penaltyNotes: [
    "Weekday hours outside 7.00 am to 7.00 pm and all Saturday hours are 120% for permanent staff and 145% for casuals — the casual figure is the permanent percentage plus the 25% loading. Sunday is 150% (casuals 175%).",
    "The public holiday rate is the exception: Schedule A.2.1 shows casuals at 250%, the same as permanent staff, not 275%.",
  ],
  // cl 19.1; Schedule A.1.2.
  overtime: [
    { label: "Overtime — first 3 hours", fullTime: 1.5, casual: 1.5 },
    { label: "Overtime — after 3 hours", fullTime: 2.0, casual: 2.0 },
    { label: "Overtime on a public holiday", fullTime: 2.5, casual: 2.5 },
  ],
  overtimeClause: "cl 19.1 and Schedule A.1.2",
  overtimeNotes: [
    "Overtime is time over an average of 38 hours a week or over the daily maximum, which is 10 ordinary hours (12 by agreement) under cl 13.5. For part-timers it is time over their agreed hours.",
    "The casual loading is not paid on overtime hours (cl 11.1(b)), so a casual's overtime is the same percentage of the minimum rate as a permanent employee's.",
  ],
  casualPenaltyBasis: "additive",
  // cl 15.4.
  junior: {
    scale: [
      { age: "Under 16", percentage: 0.368 },
      { age: "16", percentage: 0.473 },
      { age: "17", percentage: 0.578 },
      { age: "18", percentage: 0.683 },
      { age: "19", percentage: 0.825 },
      { age: "20", percentage: 0.977 },
      { age: "21 and over", percentage: 1 },
    ],
    clause: "cl 15.4",
    appliesTo: "the adult rate for the classification",
    adultAge: 21,
    // Schedule A.3.1 rounds the percentage of the adult HOURLY rate (16 years, Level 1: $12.18; of the weekly rate it would be $12.17).
    basis: "hourly",
  },
  juniorPhaseIn: null,
  // cl 17.
  allowances: [
    { name: "First aid allowance", amount: 22.38, unit: "per week", clause: "cl 17.2(a)" },
    { name: "Leading hand — in charge of 3 to 10 employees", amount: 49.24, unit: "per week", clause: "cl 17.2(b)" },
    { name: "Leading hand — in charge of 11 to 20 employees", amount: 72.74, unit: "per week", clause: "cl 17.2(b)" },
    { name: "Leading hand — in charge of more than 20 employees", amount: 92.89, unit: "per week", clause: "cl 17.2(b)" },
    { name: "Meal allowance (more than 1 hour of overtime, under 24 hours' notice)", amount: 24.56, unit: "per occasion", clause: "cl 17.3(b)(i)" },
    { name: "Further meal allowance (overtime over 4 hours)", amount: 22.27, unit: "per occasion", clause: "cl 17.3(b)(ii)" },
    { name: "Vehicle allowance", amount: 1.0, unit: "per km", clause: "cl 17.3(c)" },
  ],
  allowancesClause: "cl 17",
  hoursNotes: [
    "A casual must be engaged and paid for at least 2 consecutive hours each time they attend work (cl 11.2).",
    "Ordinary hours are not to exceed 10 on any day or shift, or 12 by agreement, and are worked over a maximum of 6 days a week and an average of no more than 20 days in 28 (cl 13.2 to 13.5).",
    "No one can be required to work more than 5 hours without an unpaid meal break of at least 30 minutes (cl 14).",
  ],
  unverified: [
    "Apprentice rates (cl 15.2) — percentages of the Level 3 rate by year, but no dollar table is published here",
    "National Training Wage (Schedule E) trainee rates and the Supported Wage System (Schedule D)",
    "Whether this award covers you at all — it only covers employees not covered by any other modern award, and excludes managerial and professional employees (cl 4)",
  ],
};

// -----------------------------------------------------------------------------
// Building and Construction General On-site Award 2020 (MA000020)
// Consolidated to 1 July 2026 (PR799301 and PR799458).
//
// Rows are WEEKLY HIRE employees in the general building and construction,
// civil construction and metal and engineering construction sectors: minimum
// weekly rate (cl 19.1(a)) + industry allowance $67.15 (cl 22.1(a)), over 38
// (cl 19.3(b)). Residential sector ($53.72), daily hire (follow-the-job loading
// 52/50.4, cl 19.3(a)) and tool allowances are NOT in the rows.
// -----------------------------------------------------------------------------

const CONSTRUCTION_INDUSTRY_ALLOWANCE = 67.15;
const constructionRow = (level: string, minWeekly: number): string => {
  const weekly = Math.round((minWeekly + CONSTRUCTION_INDUSTRY_ALLOWANCE) * 100) / 100;
  const hourly = Math.round((weekly / 38) * 100) / 100;
  return `${level}|${weekly.toFixed(2)}|${hourly.toFixed(2)}`;
};

/** Minimum weekly rates, cl 19.1(a), before the industry allowance. */
export const CONSTRUCTION_MIN_WEEKLY: ReadonlyArray<readonly [string, number, number]> = [
  ["Level 1(a) (CW/ECW 1)", 1013.5, 26.67],
  ["Level 1(b) (CW/ECW 1)", 1033.5, 27.2],
  ["Level 1(c) (CW/ECW 1)", 1047.3, 27.56],
  ["Level 1(d) (CW/ECW 1)", 1066.0, 28.05],
  ["Level 2 (CW/ECW 2)", 1087.5, 28.62],
  ["Level 3 (CW/ECW 3)", 1119.1, 29.45],
  ["Level 4 (CW/ECW 4)", 1154.4, 30.38],
  ["Level 5 (CW/ECW 5)", 1189.6, 31.31],
  ["Level 6 (CW/ECW 6)", 1221.3, 32.14],
  ["Level 7 (CW/ECW 7)", 1256.3, 33.06],
  ["Level 8 (CW/ECW 8)", 1286.7, 33.86],
  ["Level 9 (ECW 9)", 1309.5, 34.46],
];

export const CONSTRUCTION_AWARD: ModernAwardData = {
  key: "building-construction",
  meta: {
    name: "Building and Construction General On-site Award 2020",
    shortName: "Building and Construction Award",
    code: "MA000020",
    href: "/building-and-construction-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799301 and PR799458)",
    determination: "PR799301",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000020.html",
    summaryUrl: SUMMARY("MA000020"),
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 12.4",
    verifiedOn: VERIFIED_ON,
    ratesLabel: "Ordinary hourly rates (weekly hire; the minimum rate plus the all-purpose industry allowance)",
    hourlyDerivation:
      "Weekly = the award's minimum weekly rate (cl 19.1(a)) plus the $67.15 industry allowance (cl 22.1(a)); hourly = that total divided by 38 (cl 19.3(b)). This is the \"ordinary hourly rate\" the award's percentages apply to. Weekly hire, general building, civil and metal and engineering construction sectors; before tool, leading hand and other all-purpose allowances.",
  },
  rates: parse(CONSTRUCTION_MIN_WEEKLY.map(([level, w]) => constructionRow(level, w)).join("\n")),
  ratesClause: "cl 19.1(a) + cl 22.1(a), calculated under cl 19.3(b)",
  entryLevel: "Level 1(a) (CW/ECW 1)",
  classificationNotes: [
    { level: "CW and ECW", description: "CW is a construction worker in general building and construction or civil construction; ECW is an engineering construction worker in the metal and engineering construction sector (cl 19.1(c))." },
    { level: "Minimum rates before the industry allowance", description: CONSTRUCTION_MIN_WEEKLY.map(([l, w, h]) => `${l} $${w.toFixed(2)} a week ($${h.toFixed(2)} an hour)`).join("; ") + " (cl 19.1(a))." },
  ],
  matrix: [
    { label: "Mon–Fri ordinary hours", fullTime: 1, casual: 1.25 },
    { label: "Saturday — first 2 hrs", fullTime: 1.5, casual: 1.75 },
    { label: "Saturday — after 2 hrs / after noon", fullTime: 2.0, casual: 2.25 },
    { label: "Sunday", fullTime: 2.0, casual: 2.25 },
    { label: "Public holiday", fullTime: 2.5, casual: 2.75 },
  ],
  // cl 30.1 and cl 12.5–12.6.
  penalties: [
    { label: "Saturday — first 2 hours (overtime)", fullTime: 1.5, casual: 1.75, note: "Saturday work is overtime for day workers; minimum 3 hours (cl 30.2(a))." },
    { label: "Saturday — after 2 hours, and all overtime after 12 noon", fullTime: 2.0, casual: 2.25 },
    { label: "Sunday — all time worked", fullTime: 2.0, casual: 2.25, note: "Minimum 4 hours for overtime on a Sunday (cl 30.2(c))." },
    { label: "Public holiday", fullTime: 2.5, casual: 2.75, note: "Minimum 4 hours (cl 30.2(d)). Casuals are paid 275% (cl 12.6)." },
    {
      label: "Saturday following Good Friday",
      fullTime: 2.5,
      casual: 2.5,
      employment: "permanent",
      note: "Minimum 4 hours (cl 30.2(b)). The award sets no separate casual rate for this day.",
    },
  ],
  penaltiesClause: "cl 30.1 and cl 12.5–12.6",
  penaltyNotes: [
    "Ordinary hours are Monday to Friday, 7.00 am to 6.00 pm (cl 16.1). All Saturday and Sunday work is therefore paid at the rates above rather than at ordinary rates.",
    "Casual penalties are the permanent percentage plus the 25% loading: 150% becomes 175%, 200% becomes 225%, and a public holiday is 275% (cl 12.5–12.6).",
    "Every percentage applies to the ordinary hourly rate, which includes the industry allowance. That is why the dollar figures here are higher than the percentage of the bare classification minimum.",
  ],
  // cl 29.4(a) and 12.5.
  overtime: [
    { label: "Monday to Friday — first 2 hours", fullTime: 1.5, casual: 1.75 },
    { label: "Monday to Friday — after 2 hours", fullTime: 2.0, casual: 2.25 },
    { label: "Saturday — first 2 hours", fullTime: 1.5, casual: 1.75 },
    { label: "Saturday — after 2 hours, or any time after noon", fullTime: 2.0, casual: 2.25 },
    { label: "Sunday — all day", fullTime: 2.0, casual: 2.25 },
    { label: "Public holiday — all day", fullTime: 2.5, casual: 2.75 },
  ],
  overtimeClause: "cl 29.4(a), cl 30.1 and cl 12.5–12.6",
  overtimeNotes: [
    "Overtime is all time beyond ordinary working hours, Monday to Friday, including time worked for RDO accrual purposes (cl 29.4(a)). Each day stands alone.",
    "An employee recalled to work overtime after leaving the premises is paid for a minimum of 3 hours (cl 29.5). No employee under 18 can be required to work overtime or shiftwork (cl 29.2).",
  ],
  casualPenaltyBasis: "additive",
  junior: null,
  noJuniorNote:
    "The Building and Construction General On-site Award has no junior rates scale for labourers or tradespeople. Apprentices are paid a percentage of the standard rate by stage of apprenticeship (cl 19.7), which this page does not reproduce.",
  juniorPhaseIn: null,
  // cl 21.1, 21.2, 22.1.
  allowances: [
    { name: "Industry allowance — general building, civil and metal and engineering construction", amount: 67.15, unit: "per week", clause: "cl 22.1(a)", note: "Paid for all purposes. Already included in the rates above." },
    { name: "Industry allowance — residential building and construction", amount: 53.72, unit: "per week", clause: "cl 22.1(b)", note: "Paid for all purposes. Replaces the general allowance for single and dual occupancy residential work." },
    { name: "Tool allowance — carpenter, joiner, tilelayer, stonemason and similar", amount: 41.22, unit: "per week", clause: "cl 21.1(a)", note: "Paid for all purposes. Not in the rates above." },
    { name: "Tool allowance — caster, fixer, floorlayer, plasterer", amount: 34.1, unit: "per week", clause: "cl 21.1(a)" },
    { name: "Tool allowance — bricklayer", amount: 29.26, unit: "per week", clause: "cl 21.1(a)" },
    { name: "Tool allowance — roof tiler, trades in metals and engineering construction", amount: 21.59, unit: "per week", clause: "cl 21.1(a)" },
    { name: "Tool allowance — painter, signwriter, glazier", amount: 9.89, unit: "per week", clause: "cl 21.1(a)" },
    { name: "Meal allowance (overtime of at least 1.5 hours after ordinary hours)", amount: 19.74, unit: "per occasion", clause: "cl 21.2(a)" },
  ],
  allowancesClause: "cl 21 and cl 22",
  hoursNotes: [
    "Ordinary hours are 38 a week averaged over a 20-day, 4-week cycle: 8 hours each day, of which 7.6 are paid and 0.4 accrue towards a rostered day off (cl 16.1–16.2).",
    "A casual must be paid for at least 4 hours each engagement (cl 12.3). Casuals are paid the 25% loading instead of annual leave, personal leave, notice and redundancy (cl 12.4).",
    "An employee working on a public holiday must be afforded at least 4 hours' work or paid for 4 hours (cl 29.10).",
  ],
  unverified: [
    "Daily hire employees: their hourly rate includes a follow-the-job loading (52 over 50.4) and a different divisor for carpenter-divers (cl 19.3(a))",
    "Leading hand percentages (cl 19.2), shiftwork rates (cl 17), forepersons and supervisors (cl 43), and the lift industry (cl 42)",
    "Apprentice and trainee rates (cl 19.7 and Schedule D) and the other site, height, towers, underground and multi-storey allowances in cl 23",
    "The weekly hire rate for the residential sector — use the $53.72 allowance in cl 22.1(b) instead of $67.15 and divide by 38",
  ],
};

// -----------------------------------------------------------------------------
// Legal Services Award 2020 (MA000116)
// Consolidated to 1 July 2026 (PR799280, PR799396 and PR799551).
// -----------------------------------------------------------------------------

export const LEGAL_AWARD: ModernAwardData = {
  key: "legal-services",
  meta: {
    name: "Legal Services Award 2020",
    shortName: "Legal Services Award",
    code: "MA000116",
    href: "/legal-services-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799280, PR799396 and PR799551)",
    determination: "PR799396",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000116.html",
    summaryUrl: SUMMARY("MA000116"),
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 11.1(a)",
    verifiedOn: VERIFIED_ON,
  },
  // cl 15.1.
  rates: parse(`
Level 1 — Legal clerical and administrative|1073.10|28.24
Level 2 — Legal clerical and administrative|1119.10|29.45
Level 3 — Legal clerical and administrative|1182.10|31.11
Level 4 — Legal clerical and administrative|1241.40|32.67
Level 5 — Legal clerical and administrative|1291.80|33.99
Level 5 — Law graduate|1291.80|33.99
Level 6 — Law clerk|1369.20|36.03
`),
  ratesClause: "cl 15.1",
  entryLevel: "Level 1 — Legal clerical and administrative",
  classificationNotes: [
    { level: "Level 5 — Law graduate", description: "Paid the same as Level 5 legal clerical and administrative staff, with special conditions of employment for law graduates in cl 28." },
    { level: "Higher duties", description: "An employee required to perform the duties of Levels 2 to 5 for one day or more is paid at least the rate for that level as if the duties were permanent (cl 15.3)." },
  ],
  matrix: [
    { label: "Day work Mon–Fri", fullTime: 1, casual: 1.25 },
    { label: "Early morning shift", fullTime: 1.1, casual: 1.35 },
    { label: "Afternoon / night shift", fullTime: 1.15, casual: 1.4 },
    { label: "Permanent night shift", fullTime: 1.3, casual: 1.55 },
    { label: "Saturday shift", fullTime: 1.5, casual: 1.75 },
    { label: "Sunday shift", fullTime: 2.0, casual: 2.25 },
    { label: "Public holiday shift", fullTime: 2.5, casual: 2.75 },
  ],
  // cl 21.3 and 21.4; Schedule B.
  penalties: [
    { label: "Shiftworker — early morning shift", fullTime: 1.1, casual: 1.35 },
    { label: "Shiftworker — afternoon or night shift", fullTime: 1.15, casual: 1.4 },
    { label: "Shiftworker — non-continuous afternoon or night, first 3 hours", fullTime: 1.5, casual: 1.75 },
    { label: "Shiftworker — non-continuous afternoon or night, after 3 hours", fullTime: 2.0, casual: 2.25 },
    { label: "Shiftworker — permanent night shift", fullTime: 1.3, casual: 1.55 },
    { label: "Shiftworker — Saturday", fullTime: 1.5, casual: 1.75 },
    { label: "Shiftworker (other than continuous) — Sunday", fullTime: 2.0, casual: 2.25 },
    { label: "Shiftworker (other than continuous) — public holiday", fullTime: 2.5, casual: 2.75 },
  ],
  penaltiesClause: "cl 21.3 and 21.4, Schedule B.1 and B.2",
  penaltyNotes: [
    "Day workers have no penalty rates. Their ordinary hours are Monday to Friday between 7.00 am and 6.30 pm (cl 13.1(c)); work outside that span, and all Saturday and Sunday work, is overtime and is in the overtime table below.",
    "The rows above are for shiftworkers (cl 21). The casual figure in each is the permanent percentage plus the 25% loading, as the award's own table says (cl 21.3). Weekend and public holiday shift rates replace the shift loadings; they are not added to them (cl 21.6).",
  ],
  // cl 20.2(a)(i).
  overtime: [
    { label: "Monday to Saturday until 12 noon — first 3 hours", fullTime: 1.5, casual: 1.75 },
    { label: "Monday to Saturday until 12 noon — after 3 hours", fullTime: 2.0, casual: 2.25 },
    { label: "Saturday after 12 noon and Sunday (minimum 3 hours)", fullTime: 2.0, casual: 2.25 },
    { label: "Public holiday (minimum 3 hours)", fullTime: 2.5, casual: 2.75 },
  ],
  overtimeClause: "cl 20.2(a)(i)",
  overtimeNotes: [
    "Casual overtime includes the 25% loading — the award's note says the casual rates are the loading added to the permanent rates (cl 20.2 NOTE).",
    "Overtime is worked out on the weekly rate divided by 38, even when more than 38 ordinary hours are worked, and part-hours are rounded up to the next 30 minutes (cl 20.3).",
    "Continuous shiftworkers are paid 200% for all overtime (casuals 225%) (cl 20.2(b)).",
  ],
  casualPenaltyBasis: "additive",
  // cl 15.2.
  junior: {
    scale: [
      { age: "Under 16", percentage: 0.45 },
      { age: "16", percentage: 0.5 },
      { age: "17", percentage: 0.6 },
      { age: "18", percentage: 0.7 },
      { age: "19", percentage: 0.8 },
      { age: "20", percentage: 0.9 },
      { age: "21 and over", percentage: 1 },
    ],
    clause: "cl 15.2",
    appliesTo: "the adult rate for the classification",
    adultAge: 21,
  },
  juniorPhaseIn: null,
  // cl 18.
  allowances: [
    { name: "Meal allowance (1 hour or more of weekday overtime)", amount: 20.75, unit: "per occasion", clause: "cl 18.2(a)(i)" },
    { name: "Meal allowance (more than 5 hours on a Saturday or Sunday)", amount: 20.75, unit: "per occasion", clause: "cl 18.2(a)(ii)" },
    { name: "Further meal allowance (more than 9 hours on such a day)", amount: 16.54, unit: "per occasion", clause: "cl 18.2(a)(ii)" },
    { name: "Uniform allowance", amount: 3.75, unit: "per week", clause: "cl 18.3" },
    { name: "Vehicle allowance — motor car", amount: 1.0, unit: "per km", clause: "cl 18.4(a)(i)" },
    { name: "Vehicle allowance — motorcycle", amount: 0.34, unit: "per km", clause: "cl 18.4(a)(ii)" },
  ],
  allowancesClause: "cl 18",
  hoursNotes: [
    "Day workers' ordinary hours average 38 a week, up to 152 in 28 days, worked Monday to Friday between 7.00 am and 6.30 pm (cl 13.1).",
    "A casual must be paid for a minimum of 4 hours each day they are engaged (cl 11.3).",
    "An employee working overtime gets a paid 20-minute rest break after each 4 hours of overtime if work continues (cl 20.4).",
  ],
  unverified: [
    "Annualised wage arrangements (cl 17) — many law firms pay an annualised salary that must still cover what the award would give for the hours actually worked",
    "Law graduate special conditions (cl 28)",
    "Classification definitions in Schedule A — we publish the rate for each level, not the duties that place someone in it",
    "National Training Wage (Schedule E of the Miscellaneous Award) trainee rates",
  ],
};

// -----------------------------------------------------------------------------
// Electrical, Electronic and Communications Contracting Award 2020 (MA000025)
// Consolidated to 1 July 2026 (PR799280, PR799306 and PR799463).
//
// Rows are the ORDINARY HOURLY RATE (Schedule B.2.1): minimum weekly rate
// cl 16.2 + industry allowance $41.41 (cl 18.3(a)) + tool allowance $22.31
// (cl 18.3(g), grade 5 and above), divided by 38. Percentages apply to this.
// -----------------------------------------------------------------------------

const ELECTRICAL_INDUSTRY = 41.41;
const ELECTRICAL_TOOL = 22.31;
const ELECTRICAL_MIN: ReadonlyArray<readonly [string, number]> = [
  ["Electrical worker grade 1", 1004.9],
  ["Electrical worker grade 2", 1013.1],
  ["Electrical worker grade 3", 1046.9],
  ["Electrical worker grade 4", 1080.6],
  ["Electrical worker grade 5", 1119.1],
  ["Electrical worker grade 6", 1154.3],
  ["Electrical worker grade 7", 1221.1],
  ["Electrical worker grade 8", 1283.1],
  ["Electrical worker grade 9", 1309.5],
  ["Electrical worker grade 10", 1415.0],
];
export const ELECTRICAL_MIN_HOURLY: Readonly<Record<string, number>> = {
  "Electrical worker grade 1": 26.44,
  "Electrical worker grade 2": 26.66,
  "Electrical worker grade 3": 27.55,
  "Electrical worker grade 4": 28.44,
  "Electrical worker grade 5": 29.45,
  "Electrical worker grade 6": 30.38,
  "Electrical worker grade 7": 32.13,
  "Electrical worker grade 8": 33.77,
  "Electrical worker grade 9": 34.46,
  "Electrical worker grade 10": 37.24,
};
const electricalRow = (level: string, minWeekly: number): string => {
  const tool = /grade (5|6|7|8|9|10)$/.test(level) ? ELECTRICAL_TOOL : 0;
  const weekly = Math.round((minWeekly + ELECTRICAL_INDUSTRY + tool) * 100) / 100;
  return `${level}|${weekly.toFixed(2)}|${(Math.round((weekly / 38) * 100) / 100).toFixed(2)}`;
};

export const ELECTRICAL_AWARD: ModernAwardData = {
  key: "electrical",
  meta: {
    name: "Electrical, Electronic and Communications Contracting Award 2020",
    shortName: "Electrical Award",
    code: "MA000025",
    href: "/electrical-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799280, PR799306 and PR799463)",
    determination: "PR799306",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000025.html",
    summaryUrl: SUMMARY("MA000025"),
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 11.2",
    verifiedOn: VERIFIED_ON,
    ratesLabel: "Ordinary hourly rates (the minimum rate plus the all-purpose industry and tool allowances)",
    hourlyDerivation:
      "Weekly = the minimum weekly rate (cl 16.2) plus the $41.41 industry allowance (cl 18.3(a)) and, for grade 5 and above, the $22.31 tool allowance (cl 18.3(g)); hourly = that total divided by 38. This is the \"ordinary hourly rate\" in Schedule B.2.1, and every percentage in the award applies to it. The bare minimum rates are listed under \"Which grade am I?\".",
  },
  rates: parse(ELECTRICAL_MIN.map(([level, w]) => electricalRow(level, w)).join("\n")),
  ratesClause: "cl 16.2 + cl 18.3(a) and (g), Schedule B.2.1",
  entryLevel: "Electrical worker grade 1",
  classificationNotes: [
    {
      level: "Minimum rates before allowances",
      description:
        ELECTRICAL_MIN.map(([l, w]) => `${l.replace("Electrical worker ", "")}: $${w.toFixed(2)} a week ($${ELECTRICAL_MIN_HOURLY[l].toFixed(2)} an hour)`).join("; ") +
        " (cl 16.2).",
    },
    { level: "Grade 5", description: "A trade-qualified electrical, electronics, instrumentation, refrigeration or linework worker — holds a trade certificate or tradesperson's rights certificate, or an AQF Certificate III in Electrotechnology (Schedule A.2.5). The tool allowance starts here." },
    { level: "Grade 6", description: "A grade 5 worker with 3 further training modules (or equivalent in-house training) and at least a year's experience as a grade 5 (Schedule A.2.6)." },
    { level: "Grade 7", description: "A grade 5 worker with a Post Trade Certificate, 9 modules towards an Advanced Certificate or AQF Diploma, an AQF Certificate IV in Electrotechnology, or 2 years' experience in the industry (Schedule A.2.7)." },
  ],
  // Day workers only. casual = percentage OF THE CASUAL RATE (compounded).
  matrix: [
    { label: "Ordinary hours (day work)", fullTime: 1, casual: 1.25 },
    { label: "Public holiday", fullTime: 2.5, casual: 3.125, casualTabulated: true },
  ],
  casualPenaltyBasis: "additive",
  casualRuleSummary:
    "Casual penalties and overtime in this award are worked out on the casual rate, so they multiply rather than add: a permanent rate of 200% is 250% of the ordinary hourly rate for a casual, 250% becomes 312.5%, and 150% overtime becomes 187.5% (cl 20.1(b), 20.4).",
  // cl 20.4; Schedule B.2.1 and B.3.1.
  penalties: [
    { label: "Sunday (day worker)", fullTime: 2.0, casual: 2.5, casualTabulated: true, note: "All Sunday work is paid at 200%; casuals 250% of the ordinary rate (cl 20.4(a))." },
    { label: "Public holiday (day worker)", fullTime: 2.5, casual: 3.125, casualTabulated: true, note: "Casuals 312.5% of the ordinary rate (cl 20.4(b), Schedule B.3.1). Minimum 4 hours." },
  ],
  penaltiesClause: "cl 20.4 and Schedule B.2.1 / B.3.1",
  penaltyNotes: [
    "Day workers' ordinary hours are Monday to Friday between 6.00 am and 6.00 pm (cl 13.2–13.3). Saturday work is overtime. Sunday and public holiday work is paid at the flat rates above.",
    "For a casual, the permanent percentage is applied to the ordinary rate after adding the 25% loading — the award's own note says so. That is why a casual Sunday is 250% of the ordinary rate, not 225%, and a casual public holiday is 312.5%.",
    "The shiftwork loadings (afternoon, night, permanent night and shift weekend rates) are in cl 13.13–13.16 and Schedule B.2.3; this page does not reproduce them.",
  ],
  // cl 20.1(a)–(b).
  overtime: [
    { label: "Outside ordinary hours, Monday to Saturday — first 2 hours", fullTime: 1.5, casual: 1.875 },
    { label: "Outside ordinary hours, Monday to Saturday — after 2 hours", fullTime: 2.0, casual: 2.5 },
    { label: "Sunday — all day", fullTime: 2.0, casual: 2.5 },
    { label: "Public holiday — all day", fullTime: 2.5, casual: 3.125 },
  ],
  overtimeClause: "cl 20.1 and Schedule B.2.2",
  overtimeNotes: [
    "For a casual the overtime percentage is applied to the casual rate: 187.5% of the ordinary rate for the first 2 hours and 250% after that (cl 20.1(b)).",
    "A minimum of 4 hours at the overtime rate is paid for overtime on a Saturday, Sunday, rostered day off or public holiday, and for each call-back (cl 20.3, 20.5). Each day's work stands alone (cl 20.1(c)).",
  ],
  junior: null,
  noJuniorNote:
    "The Electrical, Electronic and Communications Contracting Award has no junior rates scale for non-apprentices. Apprentices are paid a percentage of the grade 5 minimum rate by year of apprenticeship (cl 16.4), which this page does not reproduce.",
  juniorPhaseIn: null,
  // cl 18.3, 18.4(c), 20.6; Schedule C.
  allowances: [
    { name: "Industry allowance", amount: 41.41, unit: "per week", clause: "cl 18.3(a)", note: "All-purpose. Already in the rates above." },
    { name: "Tool allowance (grade 5 and above)", amount: 22.31, unit: "per week", clause: "cl 18.3(g)", note: "All-purpose. Already in the rates above for grade 5 and up." },
    { name: "Electrician's licence allowance", amount: 40.29, unit: "per week", clause: "cl 18.3(b)", note: "All-purpose. NOT in the rates above — add it for an electrical mechanic who may be required to use an unrestricted licence." },
    { name: "Leading hand — in charge of 3 to 10 employees", amount: 48.12, unit: "per week", clause: "cl 18.3(c)" },
    { name: "Leading hand — in charge of 11 to 20 employees", amount: 67.15, unit: "per week", clause: "cl 18.3(c)" },
    { name: "Leading hand — in charge of more than 20 employees", amount: 90.65, unit: "per week", clause: "cl 18.3(c)" },
    { name: "Nominee allowance (at least)", amount: 102.96, unit: "per week", clause: "cl 18.3(d)" },
    { name: "First aid allowance", amount: 23.5, unit: "per week", clause: "cl 18.4(c)" },
    { name: "Availability for duty", amount: 98.48, unit: "per week", clause: "cl 20.6" },
    { name: "Meal allowance", amount: 20.6, unit: "per meal", clause: "cl 18.5(a)(i)" },
    { name: "Travel time allowance", amount: 8.69, unit: "per day", clause: "cl 18.6(c)" },
    { name: "Motor vehicle allowance", amount: 1.0, unit: "per km", clause: "cl 18.6(b)" },
  ],
  allowancesClause: "cl 18",
  hoursNotes: [
    "A casual must be engaged and paid for at least 2 consecutive hours each time they attend work (cl 11.6).",
    "Ordinary hours average 38 a week over a cycle of up to 28 days; ordinary hours of up to 12 a day can be worked by agreement (cl 13.4–13.5).",
    "A single call-out on availability duty is paid for a minimum of 2 hours at the appropriate rate (cl 20.6(b)).",
  ],
  unverified: [
    "Shiftwork rates (cl 13.13–13.16 and Schedule B.2.3)",
    "Apprentice rates (cl 16.4 and Schedule B.4) and the Schedule E National Training Wage",
    "Special wage-related allowances: multi-storey, towers, tree clearing and ordering materials (cl 18.3(e)–(f), 18.4)",
    "The all-purpose electrician's licence, leading hand and nominee allowances, which change the ordinary hourly rate for the people who get them",
  ],
};

// -----------------------------------------------------------------------------
// Fitness Industry Award 2020 (MA000094)
// Consolidated to 1 July 2026 (PR799280, PR799374 and PR799529).
// -----------------------------------------------------------------------------

export const FITNESS_AWARD: ModernAwardData = {
  key: "fitness",
  meta: {
    name: "Fitness Industry Award 2020",
    shortName: "Fitness Industry Award",
    code: "MA000094",
    href: "/fitness-industry-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799280, PR799374 and PR799529)",
    determination: "PR799374",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000094.html",
    summaryUrl: SUMMARY("MA000094"),
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 12.1(a); 30% on weekends, cl 12.1(b)",
    verifiedOn: VERIFIED_ON,
  },
  // cl 15.1.
  rates: parse(`
Level 1|978.10|25.74
Level 2|1004.90|26.44
Level 3|1062.90|27.97
Level 3A|1119.10|29.45
Level 4|1165.10|30.66
Level 4A|1221.10|32.13
Level 5|1287.20|33.87
Level 6|1276.00|33.58
Level 7|1325.70|34.89
`),
  ratesClause: "cl 15.1",
  entryLevel: "Level 1",
  // Schedule A, summarised.
  classificationNotes: [
    { level: "Level 1", description: "Works under direct supervision with specific instructions: counter and reception duties, tidying and cleaning, assisting higher grades, and structured training." },
    { level: "Level 2", description: "Has completed the lesser of 456 hours of training or 6 months at Level 1, or holds a swim and water safety teacher or coach qualification, or a Gymnastics Australia Coach Accreditation (Schedule A.2)." },
    { level: "Level 3 and 3A", description: "Works under general supervision within defined areas; includes qualified swimming teachers, pool lifeguards and gymnastics coaches. Level 3A is a Level 3 who holds an AQF Certificate III in Fitness or Sport Coaching." },
    { level: "Level 4 and 4A", description: "Works under limited supervision; includes senior pool lifeguards. Level 4A is a Level 4 with an AQF Certificate IV, employed as a tennis centre club professional." },
    { level: "Level 5", description: "Holds an AQF Diploma in Fitness, Management or Sport Coaching and works as a fitness trainer or fitness specialist, able to develop programs for special groups (Schedule A.7)." },
    { level: "Levels 6 and 7", description: "Supervisory roles: Level 6 supervises front desk and floor staff or oversees day-to-day operations; Level 7 supervises, trains and coordinates employees with substantial responsibility (Schedule A.8–A.9)." },
  ],
  matrix: [
    { label: "Mon–Fri ordinary", fullTime: 1, casual: 1.25 },
    { label: "Saturday", fullTime: 1.25, casual: 1.3, casualTabulated: true },
    { label: "Sunday", fullTime: 1.5, casual: 1.3, casualTabulated: true },
    { label: "Public holiday", fullTime: 2.5, casual: 1.3, employment: "permanent" },
  ],
  // cl 20, 26.3 and Schedule B.
  penalties: [
    { label: "Saturday — ordinary hours", fullTime: 1.25, casual: 1.3, casualTabulated: true, note: "Casual loading is 30% on weekends, not 25% (cl 12.1(b))." },
    { label: "Sunday — ordinary hours", fullTime: 1.5, casual: 1.3, casualTabulated: true, note: "A casual's Sunday rate in Schedule B.2 is below the permanent rate, because the casual loading is the only extra." },
    {
      label: "Public holiday (minimum 4 hours)",
      fullTime: 2.5,
      casual: 1.3,
      employment: "permanent",
      note: "The award text sends casuals to the 30% loading in cl 12.1(b) (cl 26.3(c)). We publish no casual dollar figure; check your pay guide.",
    },
  ],
  penaltiesClause: "cl 20.1, 26.3 and Schedule B.1.1 / B.2",
  penaltyNotes: [
    "Ordinary hours can be worked between 5.00 am and 11.00 pm Monday to Friday and 6.00 am and 9.00 pm on Saturday and Sunday (cl 13.1). Work outside those spans is overtime.",
    "Casual loadings differ by day: 25% Monday to Friday and 30% on Saturday, Sunday and public holidays (cl 12.1). Schedule B.2 therefore shows casuals at 125% on weekdays and 130% on weekends — and a casual's Sunday rate is lower than a permanent employee's 150%.",
    "The casual public holiday rate: cl 26.3(c) points casuals to the 30% loading in cl 12.1(b), and Schedule B.2 lists 130% for Saturday, Sunday and public holidays together. Because that sits so far below the permanent 250%, we do not print a dollar rate for it; confirm with Fair Work before relying on it.",
  ],
  // cl 19.2.
  overtime: [
    { label: "Monday to Saturday — first 2 hours", fullTime: 1.5, casual: 1.5 },
    { label: "Monday to Saturday — after 2 hours", fullTime: 2.0, casual: 2.0 },
    { label: "Sunday — all overtime", fullTime: 2.0, casual: 2.0 },
    { label: "Public holiday — all overtime", fullTime: 2.5, casual: 2.5 },
  ],
  casualPenaltyBasis: "additive",
  casualRuleSummary:
    "The loading is 25% on Monday to Friday ordinary hours and 30% on Saturday, Sunday and public holidays (cl 12.1), added to the minimum rate and not on top of a penalty rate, so a casual's weekend rate is 130%. No casual loading is paid on overtime (cl 12.2).",
  publicHolidayCasualUnpublished: true,
  overtimeClause: "cl 19.2 and Schedule B.1.2",
  overtimeNotes: [
    "Overtime is time outside the spread of hours, over an average of 38 a week over 4 weeks, or over 10 hours on any day (cl 19.1). Casual loadings are not paid on overtime (cl 19.2 NOTE / 12.2).",
    "An employee who has to resume work without a 10-hour break between shifts is paid 200% of the minimum hourly rate until they have had that break (cl 19.3).",
  ],
  // cl 15.2.
  junior: {
    scale: [
      { age: "Under 17", percentage: 0.55 },
      { age: "17", percentage: 0.65 },
      { age: "18", percentage: 0.75 },
      { age: "19", percentage: 0.85 },
      { age: "20 and over", percentage: 1 },
    ],
    clause: "cl 15.2",
    appliesTo: "the adult rate for the classification appropriate to the work performed",
    adultAge: 20,
  },
  juniorPhaseIn: null,
  // cl 17; Schedule C.
  allowances: [
    { name: "Leading hand — in charge of 1 to 5 employees", amount: 31.89, unit: "per week", clause: "cl 17.2(a)", note: "Level 4A or below." },
    { name: "Leading hand — in charge of 6 to 10 employees", amount: 43.58, unit: "per week", clause: "cl 17.2(a)" },
    { name: "Leading hand — in charge of more than 10 employees", amount: 58.46, unit: "per week", clause: "cl 17.2(a)" },
    { name: "Broken shift allowance", amount: 18.07, unit: "per day", clause: "cl 17.2(b)", note: "Plus $2.15 a day for excess fares." },
    { name: "First aid allowance", amount: 3.4, unit: "per day", clause: "cl 17.2(c)" },
    { name: "Meal allowance (more than 1.5 hours of overtime)", amount: 15.59, unit: "per occasion", clause: "cl 17.3(a)" },
    { name: "Vehicle allowance — own motor vehicle", amount: 1.0, unit: "per km", clause: "cl 17.3(b)(i)" },
    { name: "Vehicle allowance — own motorcycle", amount: 0.33, unit: "per km", clause: "cl 17.3(b)(ii)" },
  ],
  allowancesClause: "cl 17",
  hoursNotes: [
    "A casual must be engaged for a minimum of 3 hours, but a casual instructor, trainer or tennis coach at Level 2 to 5, or a trainee on practical work, can be engaged for as little as 1 hour (cl 12.3).",
    "Ordinary hours cannot exceed 10 in a day. A broken shift can have no more than 2 parts, must total at least 3 hours and span no more than 12 hours (cl 13.3–13.4).",
    "Level 6 is paid less than Level 5 in the award's own table ($1,276.00 against $1,287.20 a week). That is what cl 15.1 says; it reflects how the classifications were merged, not an error on this page.",
  ],
  unverified: [
    "The casual public holiday rate (see the penalty notes above)",
    "Sleepover and broken-shift arrangements beyond the allowance amounts shown (cl 17.3(e))",
    "National Training Wage (Schedule E of the Miscellaneous Award) trainee rates",
  ],
};

// -----------------------------------------------------------------------------
// Real Estate Industry Award 2020 (MA000106)
// Consolidated to 1 July 2026 (PR799280, PR799386 and PR799541).
// -----------------------------------------------------------------------------

export const REAL_ESTATE_AWARD: ModernAwardData = {
  key: "real-estate",
  meta: {
    name: "Real Estate Industry Award 2020",
    shortName: "Real Estate Award",
    code: "MA000106",
    href: "/real-estate-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799280, PR799386 and PR799541)",
    determination: "PR799386",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000106.html",
    summaryUrl: SUMMARY("MA000106"),
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 11.2(a)",
    verifiedOn: VERIFIED_ON,
    hourlyDerivation:
      "Weekly rates are the award's minimum weekly rates (cl 14.1); the hourly figure is the weekly rate divided by 38, as printed in Schedule B.",
  },
  // cl 14.1.
  rates: parseWeekly(`
Level 1 (Associate) — first 12 months|1010.60
Level 1 (Associate) — after 12 months|1063.90
Level 2 (Representative)|1119.10
Level 3 (Supervisory)|1231.00
Level 4 (In-Charge)|1287.30
`),
  ratesClause: "cl 14.1",
  entryLevel: "Level 1 (Associate) — first 12 months",
  classificationNotes: [
    { level: "Level 1 (Associate)", description: "The entry classification. The lower rate applies for the first 12 months at this level; past service as a Level 1 counts (cl 14.2 NOTE)." },
    { level: "Level 2 to Level 4", description: "Representative, Supervisory and In-Charge levels. The full definitions are in Schedule A." },
    { level: "Commission-only", description: "A salesperson at Level 2 or higher can agree to commission-only pay, in which case the weekly rates here do not apply (cl 14.3, 16.7). Strict conditions apply, including a minimum income threshold." },
  ],
  matrix: [
    { label: "Ordinary hours (any day)", fullTime: 1, casual: 1.25 },
    { label: "Public holiday", fullTime: 2.0, casual: 2.0, casualBasis: "compounded" },
  ],
  // cl 25.3; Schedule B.
  penalties: [
    {
      label: "Public holiday (minimum 3 hours)",
      fullTime: 2.0,
      casual: 2.0,
      casualBasis: "compounded",
      note: "Casuals are paid 200% of their casual hourly rate (Schedule B.2.2), which is 250% of the minimum rate.",
    },
  ],
  penaltiesClause: "cl 25.3 and Schedule B.1.1 / B.2.2",
  penaltyNotes: [
    "There are no Saturday, Sunday or evening penalty rates for ordinary hours in the Real Estate Industry Award. Ordinary hours are 38 a week and may be worked on any day (cl 13.1), so weekend open-for-inspection hours within a normal 38-hour week are paid at the ordinary rate.",
    "A public holiday is paid at 200% of the minimum hourly rate for hours worked, with a minimum payment of 3 hours (cl 25.3). For a casual it is 200% of the casual hourly rate.",
  ],
  // cl 19.1(a).
  overtime: [
    { label: "Hours over the ordinary hours, not on a rostered day off, at the employer's specific direction", fullTime: 1.0, casual: 1.25 },
    { label: "Rostered day or half day off — first 2 hours", fullTime: 1.5, casual: null },
    { label: "Rostered day or half day off — after 2 hours", fullTime: 2.0, casual: null },
  ],
  overtimeClause: "cl 19.1(a) and Schedule B.1.1",
  overtimeNotes: [
    "Overtime is only paid for hours worked at the specific direction of the employer. Work done on your own initiative, without an express instruction, is not payable under this clause (cl 19.1(b)–(c)).",
    "Hours over the ordinary 38 that are not on a rostered day off are paid at the ordinary hourly rate — 100% — not at 150%. The higher rates apply on a rostered day or half day off.",
    "The award sets no casual rate for overtime on a rostered day off, so none is printed. Time off instead of overtime can be agreed in writing (cl 19.2).",
  ],
  casualPenaltyBasis: "additive",
  casualRuleSummary:
    "The 25% loading is added to the minimum rate for every ordinary hour, on any day (cl 11.2(a)); the casual hourly rate includes it for all purposes (Schedule B.2.1). On a public holiday a casual is paid 200% of that casual rate, which is 250% of the minimum rate (Schedule B.2.2). The casual rate for overtime on a rostered day off is not published.",
  // cl 14.4. Level 1 weekly rate varies; the percentages are of the adult weekly rate.
  junior: {
    scale: [
      { age: "Under 19", percentage: 0.6 },
      { age: "19", percentage: 0.7 },
      { age: "20", percentage: 0.8 },
      { age: "21 and over", percentage: 1 },
    ],
    clause: "cl 14.4",
    appliesTo: "the adult weekly rate for the classification (junior employees cannot be commission-only)",
    adultAge: 21,
  },
  juniorPhaseIn: null,
  // cl 17; Schedule C.
  allowances: [
    { name: "Vehicle allowance (alternative to standing charges)", amount: 1.0, unit: "per km", clause: "cl 17.3(a)", note: "To a maximum of 400 km a week." },
    { name: "Motor cycle allowance", amount: 0.34, unit: "per km", clause: "cl 17.5(a)", note: "To a maximum of 400 km a week." },
    { name: "Mobile telephone allowance (maximum plan reimbursed)", amount: 100.0, unit: "per month", clause: "cl 17.7(a)(i)" },
  ],
  allowancesClause: "cl 17",
  hoursNotes: [
    "A casual must be engaged for at least 3 hours (cl 11.1). A casual cannot be employed on commission only (cl 11.4).",
    "Ordinary hours are 38 a week and may be worked on any day, averaged over up to 8 weeks. Employees other than casuals get 1.5 or 2 rostered days free of duty each week (cl 13.1–13.3).",
    "No employee can be required to work more than 5 hours without an unpaid meal break of at least 30 minutes (cl 13.4).",
  ],
  unverified: [
    "Commission and bonus arrangements (cl 16), including the commission-only minimum rate of 31.5% of gross commission and the minimum income threshold",
    "Vehicle standing-charge and per-kilometre allowances by engine size (cl 17.2(b)(iii))",
    "Stand-by and call-out compensation for property management and strata roles (cl 19.3)",
    "National Training Wage (Schedule E of the Miscellaneous Award) trainee rates",
  ],
};

// -----------------------------------------------------------------------------
// Local Government Industry Award 2020 (MA000112)
// Consolidated to 1 July 2026 (PR799280, PR799392 and PR799547).
// -----------------------------------------------------------------------------

export const LOCAL_GOVERNMENT_AWARD: ModernAwardData = {
  key: "local-government",
  meta: {
    name: "Local Government Industry Award 2020",
    shortName: "Local Government Award",
    code: "MA000112",
    href: "/local-government-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799280, PR799392 and PR799547)",
    determination: "PR799392",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000112.html",
    summaryUrl: SUMMARY("MA000112"),
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 11.1",
    verifiedOn: VERIFIED_ON,
  },
  // cl 16.1.
  rates: parse(`
Level 1|1030.10|27.11
Level 2|1062.90|27.97
Level 3|1103.00|29.03
Level 4|1119.10|29.45
Level 5|1189.40|31.30
Level 6|1287.20|33.87
Level 7|1309.50|34.46
Level 8|1415.00|37.24
Level 9|1513.70|39.83
Level 10|1654.40|43.54
Level 11|1865.60|49.09
`),
  ratesClause: "cl 16.1",
  entryLevel: "Level 1",
  classificationNotes: [
    { level: "How levels are set", description: "The employer decides the level from the skill level needed for the principal functions of the job, and must tell you your level in writing (cl 12.2–12.3). The full definitions are in Schedule A." },
  ],
  matrix: [
    { label: "Ordinary hours", fullTime: 1, casual: 1.25 },
    { label: "Mon–Fri outside the span", fullTime: 1.2, casual: 1.45 },
    { label: "Saturday (listed roles)", fullTime: 1.5, casual: 1.75 },
    { label: "Sunday (listed roles)", fullTime: 1.75, casual: 2.0 },
    { label: "Public holiday", fullTime: 2.5, casual: 2.5, employment: "permanent" },
  ],
  // cl 22 and cl 28; Schedule B.1.2 and B.2.1.
  penalties: [
    { label: "Monday to Friday — ordinary hours outside the span of hours", fullTime: 1.2, casual: 1.45, note: "Cl 22.1. Applies to ordinary hours worked outside the span for the role." },
    { label: "Saturday — roles in cl 13.1(e) to (g)", fullTime: 1.5, casual: 1.75, note: "Cl 22.2(a)(i). Not paid to community services and recreation centre staff between 5.00 am and 10.00 pm." },
    { label: "Sunday — roles in cl 13.1(e) to (g)", fullTime: 1.75, casual: 2.0, note: "Cl 22.2(a)(ii). Same exclusion for community services and recreation centres." },
    {
      label: "Public holiday",
      fullTime: 2.5,
      casual: 2.5,
      employment: "permanent",
      note: "Cl 28.2. Schedule B does not tabulate a casual public holiday rate, so none is printed.",
    },
  ],
  penaltiesClause: "cl 22, cl 28 and Schedule B.1 / B.2.1",
  penaltyNotes: [
    "Most employees work ordinary hours Monday to Friday, 6.00 am to 6.00 pm (cl 13.1(d)). Weekend ordinary hours exist only for the roles listed in cl 13.1(e) to (g): airports, caretakers and caravan parks, catering and hospitality, cleaners, community services, garbage and sanitary services, livestock and saleyards, local law enforcement, parking, recreation centres and golf courses, tourism, libraries and customer service centres. Everyone else's weekend work is overtime.",
    "Casual penalties are the permanent percentage plus the 25% loading: 120% becomes 145%, 150% becomes 175%, and 175% becomes 200% (Schedule B.2.1; cl 11.2).",
    "Different spans apply by role: 5.00 am to 10.00 pm Monday to Sunday for the cl 13.1(e) roles, 8.00 am to 9.00 pm for libraries, and 6.00 am to 7.00 pm for childcare. Work outside the span for your role attracts the 120% weekday rate (cl 22.1).",
  ],
  // cl 21.2; Schedule B.1.4.
  overtime: [
    { label: "Monday to Friday — first 2 hours", fullTime: 1.5, casual: 1.5 },
    { label: "Monday to Friday — after 2 hours", fullTime: 2.0, casual: 2.0 },
    { label: "Saturday before 12 noon — first 2 hours", fullTime: 1.5, casual: 1.5 },
    { label: "Saturday before 12 noon — after 2 hours", fullTime: 2.0, casual: 2.0 },
    { label: "Saturday from 12 noon and all of Sunday", fullTime: 2.0, casual: 2.0 },
    { label: "Public holiday", fullTime: 2.5, casual: 2.5 },
  ],
  overtimeClause: "cl 21.2 and Schedule B.1.4",
  overtimeNotes: [
    "The casual loading is not paid on overtime hours (cl 21.2(c)). A casual's overtime is the same percentage of the minimum rate as a permanent employee's.",
    "Call-back: an employee recalled to work overtime after leaving is paid for a minimum of 3 hours at the overtime rate (cl 21.5). An employee made to resume work without a 10-hour break is paid 200% until released (cl 21.4(b)(ii)).",
  ],
  casualPenaltyBasis: "additive",
  publicHolidayCasualUnpublished: true,
  // cl 16.2.
  junior: {
    scale: [
      { age: "Under 17", percentage: 0.55 },
      { age: "17", percentage: 0.65 },
      { age: "18", percentage: 0.75 },
      { age: "19", percentage: 0.85 },
      { age: "20", percentage: 0.95 },
      { age: "21 and over", percentage: 1 },
    ],
    clause: "cl 16.2",
    appliesTo: "the minimum rate for the employee's classification",
    adultAge: 21,
  },
  juniorPhaseIn: null,
  // cl 19; Schedule C.
  allowances: [
    { name: "First aid allowance", amount: 20.62, unit: "per week", clause: "cl 19.2(b)(i)" },
    { name: "Leading hand — supervising 1 to 5 employees (supervisor level 3 or 4)", amount: 32.4, unit: "per week", clause: "cl 19.2(a)" },
    { name: "Leading hand — supervising 6 to 15 employees (supervisor level 3 or 4)", amount: 44.18, unit: "per week", clause: "cl 19.2(a)" },
    { name: "Leading hand — supervising over 15 employees (supervisor level 3, 4 or 5)", amount: 55.96, unit: "per week", clause: "cl 19.2(a)" },
    { name: "On-call allowance — Monday to Friday", amount: 29.45, unit: "per day", clause: "cl 19.2(e)(i)" },
    { name: "On-call allowance — Saturday", amount: 44.18, unit: "per day", clause: "cl 19.2(e)(ii)" },
    { name: "On-call allowance — Sunday or public holiday", amount: 58.9, unit: "per day", clause: "cl 19.2(e)(iii)" },
    { name: "Sleepover (additional to the on-call allowance)", amount: 14.73, unit: "per hour", clause: "cl 21.7(a)" },
    { name: "Meal allowance (overtime of more than 2 hours)", amount: 20.75, unit: "per occasion", clause: "cl 19.3(a)(i)" },
    { name: "Tool allowance — tradespersons and apprentices", amount: 22.25, unit: "per week", clause: "cl 19.3(b)(i)" },
    { name: "Vehicle allowance — motor vehicle", amount: 1.0, unit: "per km", clause: "cl 19.3(c)(i)" },
  ],
  allowancesClause: "cl 19",
  hoursNotes: [
    "A casual must be engaged and paid for at least 2 consecutive hours each time they attend work (cl 11.3).",
    "An employee can work up to 10 ordinary hours a day, or 12 by agreement (cl 13.1(k)). Full-time ordinary hours average 38 a week over 28 days (cl 13.1(b)).",
    "Any employee can work ordinary hours outside the span for their role if they are paid the 120% weekday rate for those hours (cl 13.1(j)).",
  ],
  unverified: [
    "The casual public holiday rate — Schedule B.2.1 has no public holiday column",
    "Apprentice rates (cl 16.3, percentages of the Level 4 rate) and school-based apprentices (Schedule D)",
    "Community services and recreation centre weekend rates, beyond the outside-5am-to-10pm exception noted above (Schedule B.1.3)",
    "Annualised wage arrangements (cl 18) and the remaining allowances in cl 19.2",
  ],
};

// -----------------------------------------------------------------------------
// Live Performance Award 2020 (MA000081)
// Consolidated to 1 July 2026 (PR799280, PR799361 and PR799516).
//
// ⚠️ SCOPE: PRODUCTION AND SUPPORT STAFF ONLY (Part 8). Performers, company
// dancers, musicians and striptease artists are paid under separate parts with
// per-performance and per-call rates (Parts 5 to 7), not by the hour, and are
// not reproduced. Minimum hourly rates exist only for the Production and
// Support Staff classifications (cl 11.1 footnote 1).
// -----------------------------------------------------------------------------

export const LIVE_PERFORMANCE_AWARD: ModernAwardData = {
  key: "live-performance",
  meta: {
    name: "Live Performance Award 2020",
    shortName: "Live Performance Award",
    code: "MA000081",
    href: "/live-performance-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799280, PR799361 and PR799516)",
    determination: "PR799361",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000081.html",
    summaryUrl: SUMMARY("MA000081"),
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 57.3",
    verifiedOn: VERIFIED_ON,
  },
  // cl 11.1 — the Production and Support Staff categories only.
  rates: parse(`
Level 1 — Production and Support Staff 1 (induction/training)|978.10|25.74
Level 2 — Production and Support Staff 2|1046.90|27.55
Level 3 — Production and Support Staff 3|1098.00|28.89
Level 4 — Production and Support Staff 4|1119.10|29.45
Level 5 — Production and Support Staff 5|1154.20|30.37
Level 6 — Production and Support Staff 6|1189.40|31.30
Level 8 — Production and Support Staff 7|1265.70|33.31
Level 10 — Production and Support Staff 8|1309.40|34.46
`),
  ratesClause: "cl 11.1 (Production and Support Staff categories)",
  entryLevel: "Level 1 — Production and Support Staff 1 (induction/training)",
  classificationNotes: [
    { level: "Award levels 7, 9 and 11 to 15", description: "These levels cover company dancers, performers, musicians, vocalists, the opera principal, technical manager and conductor-leader. They have weekly rates but no hourly rate in the award, and are paid by the performance or call under Parts 5 and 6, so they are not tabled here." },
    { level: "Weekly rates for those levels", description: "Level 7 $1,221.10; Level 9 $1,283.10; Level 11 $1,350.60; Level 12 $1,396.00; Level 13 $1,446.70; Level 14 $1,506.70; Level 15 $1,635.10 a week (cl 11.1)." },
  ],
  matrix: [
    { label: "Ordinary hours Mon–Sun 7am–midnight", fullTime: 1, casual: 1.25 },
    { label: "Midnight to 7am", fullTime: 2.0, casual: 2.25 },
    { label: "Sunday (starting work)", fullTime: 2.0, casual: 2.25 },
    { label: "Public holiday", fullTime: 2.0, casual: 2.25 },
  ],
  // cl 63.3(c), 63.4, 21.5.
  penalties: [
    { label: "Work between 12 midnight and 7.00 am", fullTime: 2.0, casual: 2.25, note: "Cl 63.3(c). Cleaners rostered to work ordinary hours in that window get a 20% loading instead (cl 61.1(c))." },
    { label: "Sunday — all time worked once you start work on a Sunday", fullTime: 2.0, casual: 2.25, note: "Cl 63.4. Minimum payment of 4 hours; includes any overtime." },
    { label: "Public holiday (minimum 4 hours)", fullTime: 2.0, casual: 2.25, note: "Cl 21.5." },
  ],
  penaltiesClause: "cl 21.5, cl 63.3(c) and cl 63.4",
  penaltyNotes: [
    "Production and support staff ordinary hours can be worked Monday to Sunday between 7.00 am and midnight (cl 61.1(b)), so evenings and weekend daytime hours inside a normal week carry no loading. Saturday has no penalty rate.",
    "Casual penalties are the permanent percentage plus the 25% loading: 200% becomes 225% (the award's notes at cl 21.5 and 63.3 say so).",
    "Touring sound and lighting employees get a 17.5% loading instead of overtime and penalty rates (cl 63.6(a)), and crewing services employees get a 52.5% loading for work between 11.00 pm and 6.00 am (cl 63.7). Those special arrangements replace the table above.",
  ],
  // cl 63.1 and 63.2.
  overtime: [
    { label: "Beyond rostered daily hours (casuals: beyond 8 hours a day) — first 2 hours", fullTime: 1.5, casual: 1.75 },
    { label: "Beyond rostered daily hours (casuals: beyond 8 hours a day) — after 2 hours", fullTime: 2.0, casual: 2.25 },
    { label: "Rostered day off — first 4 hours", fullTime: 1.5, casual: null },
    { label: "Rostered day off — after 4 hours", fullTime: 2.0, casual: null },
    { label: "Over 38 hours in the week — weekly staff, all hours (casuals: first 4 hours)", fullTime: 1.5, casual: 1.75 },
  ],
  overtimeClause: "cl 63.1 and 63.2",
  overtimeNotes: [
    "Overtime is calculated to the nearest quarter of an hour (cl 63.1, 63.2(a)). A casual's overtime rates are the weekly employee's rates plus the 25% loading (cl 63.2 NOTE). For a casual working over 38 hours in a week the rate steps up to 225% after the first 4 hours (cl 63.2(c)).",
    "A full-time or part-time employee who works through the break between shifts without a 10-hour rest is paid 200% (casuals 225%) until released (cl 63.3(d)).",
  ],
  casualPenaltyBasis: "additive",
  junior: null,
  noJuniorNote:
    "The Live Performance Award has no junior rates scale for production and support staff on the hourly rates above.",
  juniorPhaseIn: null,
  // cl 60.
  allowances: [
    { name: "Transmission or recording allowance (single payment per performance)", amount: 177.94, unit: "per recorded or transmitted performance", clause: "cl 60.2(a)", note: "Not counted as ordinary pay for overtime and penalties." },
    { name: "Meal allowance (worked midnight to 8.00 am and beyond, or 2 back-to-back performances)", amount: 24.13, unit: "per meal", clause: "cl 60.3(a)" },
    { name: "Tools allowance — heads of department supplying their own tools", amount: 11.03, unit: "per week", clause: "cl 60.3(b)(i)" },
    { name: "Basic tools allowance — other staff supplying basic tools", amount: 1.14, unit: "per day", clause: "cl 60.3(b)(ii)" },
  ],
  allowancesClause: "cl 60",
  hoursNotes: [
    "Weekly staff are rostered 38 ordinary hours a week, between 4 and 12 hours a day in no more than 2 periods, with two rostered days off in each 7 days (cl 61.1).",
    "A casual may be engaged for a minimum of 3 consecutive hours (cl 57.1), and cannot be paid per performance (cl 61.2(c)). If a casual works 3 short performances in a day with a gap of 2 hours or more between two of them, they are paid at least 2 hours for each (cl 61.2(e)).",
    "An employee working more than 5 continuous hours without a meal break is paid 200% (casuals 225%) for the time the break should have been taken (cl 62.3(a)).",
  ],
  unverified: [
    "Performers and company dancers (Part 5), musicians (Part 6) and striptease artists (Part 7) — paid by the performance, call or week, not by an hourly table",
    "Hourly rates for award levels 7, 9 and 11 to 15, which the award does not publish",
    "Cyclic rostering arrangements (cl 61.1(g)) and the stage-production preparation meal-break rates (cl 62.3(b))",
    "National Training Wage (Schedule E of the Miscellaneous Award) trainee rates",
  ],
};

export const OCT_AWARDS = {
  miscellaneous: MISC_AWARD,
  "building-construction": CONSTRUCTION_AWARD,
  "legal-services": LEGAL_AWARD,
  electrical: ELECTRICAL_AWARD,
  fitness: FITNESS_AWARD,
  "real-estate": REAL_ESTATE_AWARD,
  "local-government": LOCAL_GOVERNMENT_AWARD,
  "live-performance": LIVE_PERFORMANCE_AWARD,
} as const;
