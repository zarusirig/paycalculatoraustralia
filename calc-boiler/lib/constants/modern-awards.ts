// =============================================================================
// Modern award rate data for the per-award pages added in the September 2026
// award cluster: Fast Food (MA000003), Pharmacy (MA000012), Security Services
// (MA000016) and Clerks—Private Sector (MA000002).
//
// Hospitality, Retail and SCHADS predate this file and keep their own
// constants (hospitality-award.ts, schads-award.ts). Nothing here re-states
// their figures.
//
// SOURCE. Every figure below was transcribed on 23 September 2026 from the
// Fair Work Commission consolidated award text hosted at
// awards.fairwork.gov.au, each of which reads "incorporates all amendments up
// to and including 1 July 2026" and carries the Annual Wage Review 2026
// determination ([2026] FWCFB 3500) marked "ppc 01Jul26". Clause numbers are
// cited against each figure so any one of them can be re-checked.
//
// Rates apply from the first full pay period starting on or after 1 July 2026.
//
// ⚠️ PENALTIES ARE ADDITIVE FOR CASUALS. In all four awards the casual column
// is the full-time percentage plus the 25% loading (e.g. Saturday 125% → 150%),
// not the full-time percentage multiplied by 1.25. The award tables say so in
// terms (FF Table 6 NOTE 1; Clerks Table 5 NOTE 2; Security Table 7 column 3
// "inclusive of casual loading"; Pharmacy Table 6 column 3).
//
// ⚠️ CASUAL OVERTIME DIFFERS BY AWARD. Fast Food and Clerks publish a casual
// overtime column that INCLUDES the loading (175% / 225% / 275%). Pharmacy
// says the opposite: "The casual loading is not payable on overtime" (cl 11.3
// NOTE). Security's Table 5 has a single column and no casual variant. Do not
// generalise one award's rule to another.
//
// ⚠️ FAST FOOD SUNDAY SPLITS BY LEVEL. Level 1 is 125% on a Sunday; Levels 2
// and 3 are 150% (Table 6). A single "Sunday rate" for the award is wrong.
//
// ⚠️ JUNIOR RATES ARE CHANGING FROM 1 DECEMBER 2026 for Fast Food and Pharmacy
// (and Retail). Determinations PR813654 (Fast Food) and PR813656 (Pharmacy),
// made 26 August 2026 under [2026] FWCFB 222 implementing [2026] FWCFB 75,
// replace the junior tables. The schedules are NOT the same: Fast Food and
// Retail move 5 points every July and December; Pharmacy moves 10 points each
// July (see JUNIOR_PHASE_IN below). Only employees aged 18–20 employed by the
// employer for MORE than 6 months move. Under-18 rates do not change.
//
// NEGATIVE FINDING: the Security Services Industry Award contains no junior
// rates clause (the word "junior" does not appear in the award text).
// =============================================================================

import type { AwardRate } from "./hospitality-award";

export type { AwardRate };

export interface AwardMeta {
  /** Full award title as it appears in the award. */
  name: string;
  /** Short name used in headings, e.g. "Fast Food Award". */
  shortName: string;
  code: string;
  /** Route on this site. */
  href: string;
  operativeFrom: string;
  effectiveNote: string;
  /** Consolidation line of the award text transcribed. */
  consolidatedTo: string;
  /** Determination giving effect to the 2026 Annual Wage Review. */
  determination: string;
  awardTextUrl: string;
  /** FWO award summary page (links to the pay guide). */
  summaryUrl: string;
  casualLoading: number;
  standardWeeklyHours: number;
  /** Where the casual loading is set. */
  casualLoadingClause: string;
  /** Date the figures were transcribed from the award text. */
  verifiedOn: string;
}

export interface PenaltyRow {
  /** When the hours are worked, as the award labels it. */
  label: string;
  /** Percentage of the minimum hourly rate (1.25 = 125%). */
  fullTime: number;
  /**
   * Casual percentage. For "additive" awards it is of the minimum hourly rate
   * and INCLUDES the loading; for "compounded" awards it is of the casual
   * ordinary hourly rate.
   */
  casual: number;
}

export interface OvertimeRow {
  label: string;
  fullTime: number;
  /** Null when the award publishes no separate casual overtime rate. */
  casual: number | null;
}

export interface AwardAllowance {
  name: string;
  amount: number;
  unit: string;
  clause: string;
  note?: string;
}

export interface JuniorBandPct {
  age: string;
  percentage: number;
}

export interface ClassificationNote {
  level: string;
  description: string;
}

/**
 * A matrix column: the multiplier applied to each classification's hourly
 * rate, for the level-by-level pay guide table. `levels` restricts a column
 * to the classifications it applies to (e.g. Fast Food Sunday).
 */
export interface MatrixColumn {
  label: string;
  fullTime: number;
  casual: number;
  appliesTo?: readonly string[];
}

export interface ModernAwardData {
  key: string;
  meta: AwardMeta;
  rates: readonly AwardRate[];
  ratesClause: string;
  /** The classification used as the headline "entry" rate on the hub. */
  entryLevel: string;
  classificationNotes: readonly ClassificationNote[];
  matrix: readonly MatrixColumn[];
  penalties: readonly PenaltyRow[];
  penaltiesClause: string;
  penaltyNotes: readonly string[];
  overtime: readonly OvertimeRow[];
  overtimeClause: string;
  overtimeNotes: readonly string[];
  /**
   * How casual penalties and overtime are built. "additive": the casual
   * column is a percentage of the MINIMUM hourly rate that already includes
   * the loading (125% Saturday + 25% = 150%). "compounded": the percentage is
   * applied to the CASUAL ordinary hourly rate (Manufacturing cl 11.1(d),
   * 32.1(f)), so a casual at 150% gets 150% x 125% = 187.5% of the base rate.
   */
  casualPenaltyBasis: "additive" | "compounded";
  junior: {
    scale: readonly JuniorBandPct[];
    clause: string;
    appliesTo: string;
    adultAge: number;
    /**
     * The classification whose weekly rate the percentages apply to, when the
     * award fixes it rather than using the employee's own classification
     * (Manufacturing: C13 / V2).
     */
    baseLevel?: string;
  } | null;
  /** Shown instead of the junior table when the award has none. */
  noJuniorNote?: string;
  /** Which PR813654–PR813656 phase-in schedule applies, if any. */
  juniorPhaseIn: "fast-food-retail" | "pharmacy" | null;
  allowances: readonly AwardAllowance[];
  allowancesClause: string;
  hoursNotes: readonly string[];
  /** Parts of the award we have NOT verified and so do not publish. */
  unverified: readonly string[];
}

const VERIFIED_ON = "23 September 2026";
const OPERATIVE = "1 July 2026";
const EFFECTIVE_NOTE =
  "Applies from the first full pay period starting on or after 1 July 2026, not universally 1 July.";

function parse(raw: string): AwardRate[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [level, weekly, hourly] = line.split("|");
      if (!level || !weekly || !hourly) {
        throw new Error(`malformed award row: ${JSON.stringify(line)}`);
      }
      return { level, weekly: Number(weekly), hourly: Number(hourly) };
    });
}

// -----------------------------------------------------------------------------
// Fast Food Industry Award 2020 (MA000003)
// Consolidated to 1 July 2026 (PR799280, PR799284 and PR799442).
// -----------------------------------------------------------------------------

export const FAST_FOOD_AWARD: ModernAwardData = {
  key: "fast-food",
  meta: {
    name: "Fast Food Industry Award 2020",
    shortName: "Fast Food Award",
    code: "MA000003",
    href: "/fast-food-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799280, PR799284 and PR799442)",
    determination: "PR799284",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000003.html",
    summaryUrl: "https://www.fairwork.gov.au/employment-conditions/awards/awards-summary/ma000003-summary",
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 11.2(b)",
    verifiedOn: VERIFIED_ON,
  },
  // cl 15.1 Table 3. NOTE 1: "The minimum hourly rate is 1/38th of the minimum weekly rate."
  rates: parse(`
Level 1|1056.80|27.81
Level 2|1119.10|29.45
Level 3 (in charge of one or no person)|1136.40|29.91
Level 3 (in charge of 2 or more people)|1150.40|30.27
`),
  ratesClause: "cl 15.1, Table 3",
  entryLevel: "Level 1",
  // cl 12.4, quoted closely.
  classificationNotes: [
    {
      level: "Level 1",
      description:
        "Preparation, receipt of orders, cooking, sale, serving or delivery of meals, snacks and/or beverages sold to the public primarily to take away or in food courts, including incidental cleaning.",
    },
    {
      level: "Level 2",
      description:
        "Has the major day-to-day responsibility for supervising Level 1 employees and/or training new employees, or is required to exercise trade skills.",
    },
    {
      level: "Level 3",
      description:
        "Appointed by the employer to be in charge of a shop, food outlet or delivery outlet. The rate depends on whether they are in charge of one or no person, or 2 or more people.",
    },
  ],
  matrix: [
    { label: "Mon–Fri", fullTime: 1, casual: 1.25 },
    { label: "Mon–Fri 10pm–midnight", fullTime: 1.1, casual: 1.35 },
    { label: "Mon–Fri midnight–6am", fullTime: 1.15, casual: 1.4 },
    { label: "Saturday", fullTime: 1.25, casual: 1.5 },
    { label: "Sunday (Level 1)", fullTime: 1.25, casual: 1.5, appliesTo: ["Level 1"] },
    {
      label: "Sunday (Levels 2–3)",
      fullTime: 1.5,
      casual: 1.75,
      appliesTo: ["Level 2", "Level 3 (in charge of one or no person)", "Level 3 (in charge of 2 or more people)"],
    },
    { label: "Public holiday", fullTime: 2.25, casual: 2.5 },
  ],
  // cl 21, Table 6.
  penalties: [
    { label: "Monday to Friday — between 10.00 pm and midnight", fullTime: 1.1, casual: 1.35 },
    { label: "Monday to Friday — between midnight and 6.00 am", fullTime: 1.15, casual: 1.4 },
    { label: "Saturday — any time of day", fullTime: 1.25, casual: 1.5 },
    { label: "Sunday (Level 1 employees) — any time of day", fullTime: 1.25, casual: 1.5 },
    { label: "Sunday (Level 2 and 3 employees) — any time of day", fullTime: 1.5, casual: 1.75 },
    { label: "Public holiday — any time of day", fullTime: 2.25, casual: 2.5 },
  ],
  penaltiesClause: "cl 21, Table 6",
  penaltyNotes: [
    "Sunday is paid differently by level: Level 1 employees receive 125% (casuals 150%), while Level 2 and Level 3 employees receive 150% (casuals 175%).",
    "Casual penalty rates are the full-time percentage plus the 25% casual loading — Table 6 NOTE 1 says so in terms.",
  ],
  // cl 20.6(a), Table 5.
  overtime: [
    { label: "Monday to Saturday — first 2 hours", fullTime: 1.5, casual: 1.75 },
    { label: "Monday to Saturday — after 2 hours", fullTime: 2.0, casual: 2.25 },
    { label: "Sunday — all overtime hours", fullTime: 2.0, casual: 2.25 },
    { label: "Public holiday — all overtime hours", fullTime: 2.5, casual: 2.75 },
  ],
  overtimeClause: "cl 20.6(a), Table 5",
  overtimeNotes: [
    "Casual overtime includes the 25% loading (Table 5 NOTE 1). Monday to Saturday overtime is calculated with each day's work standing alone (cl 20.6(b)).",
  ],
  casualPenaltyBasis: "additive",
  // cl 15.2, Table 4 — as it stands until the first full pay period on or after 1 December 2026.
  junior: {
    scale: [
      { age: "Under 16", percentage: 0.4 },
      { age: "16", percentage: 0.5 },
      { age: "17", percentage: 0.6 },
      { age: "18", percentage: 0.7 },
      { age: "19", percentage: 0.8 },
      { age: "20", percentage: 0.9 },
      { age: "21 and over", percentage: 1 },
    ],
    clause: "cl 15.2, Table 4",
    appliesTo: "all fast food classifications",
    adultAge: 21,
  },
  juniorPhaseIn: "fast-food-retail",
  // cl 17.
  allowances: [
    { name: "Meal allowance (overtime of more than 1 hour without 24 hours' notice)", amount: 17.33, unit: "per occasion", clause: "cl 17.4(a)", note: "Or the employer supplies a meal." },
    { name: "Further meal allowance (that overtime exceeds 4 hours)", amount: 15.66, unit: "per occasion", clause: "cl 17.4(b)" },
    { name: "Laundry of special clothing — full-time", amount: 6.42, unit: "per week", clause: "cl 17.5(b)(i)" },
    { name: "Laundry of special clothing — part-time or casual", amount: 1.28, unit: "per shift", clause: "cl 17.5(b)(ii)" },
    { name: "Own vehicle — engaged primarily to deliver the employer's products", amount: 0.53, unit: "per km", clause: "cl 17.8(a)" },
    { name: "Own vehicle — any other case", amount: 1.0, unit: "per km", clause: "cl 17.8(b)" },
    { name: "Cold work (cold chambers, refrigerated storage)", amount: 0.38, unit: "per hour", clause: "cl 17.3(a)", note: "Below 0°C a further $0.59 applies, $0.97 an hour in total (cl 17.3(b))." },
    { name: "Broken Hill allowance", amount: 47.9, unit: "per week", clause: "cl 17.2" },
  ],
  allowancesClause: "cl 17",
  hoursNotes: [
    "Casuals have a minimum daily engagement of 3 consecutive hours (cl 11.3), and part-time employees must be rostered for at least 3 consecutive hours a shift (cl 10.2).",
    "The maximum ordinary hours on any day is 11 (cl 13.5).",
  ],
  unverified: [
    "Split shift and broken shift arrangements",
    "Transport and travelling-time reimbursements (amounts are the actual cost, not a fixed figure)",
    "National Training Wage (Schedule E of the Miscellaneous Award) trainee rates",
  ],
};

// -----------------------------------------------------------------------------
// Pharmacy Industry Award 2020 (MA000012)
// Consolidated to 1 July 2026 (PR810422, PR799280, PR799293 and PR799450).
// -----------------------------------------------------------------------------

export const PHARMACY_AWARD: ModernAwardData = {
  key: "pharmacy",
  meta: {
    name: "Pharmacy Industry Award 2020",
    shortName: "Pharmacy Award",
    code: "MA000012",
    href: "/pharmacy-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR810422, PR799280, PR799293 and PR799450)",
    determination: "PR799293",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000012.html",
    summaryUrl: "https://www.fairwork.gov.au/employment-conditions/awards/awards-summary/ma000012-summary",
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 11.2",
    verifiedOn: VERIFIED_ON,
  },
  // cl 16.1 Table 3.
  rates: parse(`
Pharmacy assistant level 1|1056.80|27.81
Pharmacy assistant level 2|1081.00|28.45
Pharmacy assistant level 3|1119.10|29.45
Pharmacy assistant level 4|1165.10|30.66
Pharmacy student — 1st year of course|1056.80|27.81
Pharmacy student — 2nd year of course|1081.00|28.45
Pharmacy student — 3rd year of course|1119.10|29.45
Pharmacy student — 4th year of course|1165.10|30.66
Pharmacy intern — 1st half of training|1291.50|33.99
Pharmacy intern — 2nd half of training|1335.50|35.14
Pharmacist|1586.30|41.74
Experienced pharmacist|1737.40|45.72
Pharmacist in charge|1778.40|46.80
Pharmacist manager|1981.60|52.15
`),
  ratesClause: "cl 16.1, Table 3",
  entryLevel: "Pharmacy assistant level 1",
  classificationNotes: [
    {
      level: "Pharmacy students",
      description:
        "Paid by year of course, which begins on the first day of the academic term. A first-year Master of Pharmacy student is treated as being in the 3rd year of a course, and progression follows passing all subjects for the year (cl 16.3).",
    },
    {
      level: "Pharmacy interns",
      description: "Paid by half of training — the first and second halves of the internship carry different rates.",
    },
  ],
  // The main weekday/weekend bands for the level-by-level table. The full
  // time-of-day table is published separately in `penalties`.
  matrix: [
    { label: "Mon–Fri 8am–7pm", fullTime: 1, casual: 1.25 },
    { label: "Mon–Fri 7pm–9pm", fullTime: 1.25, casual: 1.5 },
    { label: "Sat 8am–6pm", fullTime: 1.25, casual: 1.5 },
    { label: "Sun 7am–9pm", fullTime: 1.5, casual: 1.75 },
    { label: "Public holiday", fullTime: 2.25, casual: 2.5 },
  ],
  // cl 22.3, Table 6. The 1 July 2019 – 30 June 2020 Sunday row is spent and omitted.
  penalties: [
    { label: "Monday to Friday — 7.00 am to 8.00 am", fullTime: 1.5, casual: 1.75 },
    { label: "Monday to Friday — 7.00 pm to 9.00 pm", fullTime: 1.25, casual: 1.5 },
    { label: "Monday to Friday — 9.00 pm to midnight", fullTime: 1.5, casual: 1.75 },
    { label: "Saturday — 7.00 am to 8.00 am", fullTime: 2.0, casual: 2.25 },
    { label: "Saturday — 8.00 am to 6.00 pm", fullTime: 1.25, casual: 1.5 },
    { label: "Saturday — 6.00 pm to 9.00 pm", fullTime: 1.5, casual: 1.75 },
    { label: "Saturday — 9.00 pm to midnight", fullTime: 1.75, casual: 2.0 },
    { label: "Sunday — 7.00 am to 9.00 pm", fullTime: 1.5, casual: 1.75 },
    { label: "Sunday — before 7.00 am and after 9.00 pm", fullTime: 2.0, casual: 2.25 },
    { label: "Public holidays — all day", fullTime: 2.25, casual: 2.5 },
  ],
  penaltiesClause: "cl 22.3, Table 6",
  penaltyNotes: [
    "Pharmacy penalties depend on the time of day as well as the day — a Saturday shift can cross three different rates.",
    "Ordinary hours can be worked on any day between 7.00 am and midnight (cl 13.1). Penalty rates are not cumulative on overtime rates (cl 22.2).",
  ],
  // cl 21.4, Table 5 — single column.
  overtime: [
    { label: "Monday to Saturday — first 2 hours", fullTime: 1.5, casual: null },
    { label: "Monday to Saturday — after 2 hours", fullTime: 2.0, casual: null },
    { label: "Sunday — all day", fullTime: 2.0, casual: null },
    { label: "Public holiday — all day", fullTime: 2.5, casual: null },
  ],
  overtimeClause: "cl 21.4, Table 5",
  overtimeNotes: [
    "The casual loading is not payable on overtime worked by a casual employee (cl 11.3 NOTE) — the opposite of the Fast Food and Clerks awards.",
  ],
  casualPenaltyBasis: "additive",
  // cl 16.2, Table 4 — pharmacy assistants levels 1 and 2 only.
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
    clause: "cl 16.2, Table 4",
    appliesTo: "pharmacy assistant levels 1 and 2 only",
    adultAge: 21,
  },
  juniorPhaseIn: "pharmacy",
  // cl 19.
  allowances: [
    { name: "Home medicine reviews / residential medication management reviews", amount: 106.4, unit: "per week", clause: "cl 19.2" },
    { name: "Meal allowance (overtime without notice on or before the previous day)", amount: 24.72, unit: "per occasion", clause: "cl 19.3(b)(i)" },
    { name: "Further meal allowance (that overtime exceeds 4 hours)", amount: 22.15, unit: "per occasion", clause: "cl 19.3(c)" },
    { name: "Laundry of clothing — full-time", amount: 6.42, unit: "per week", clause: "cl 19.5(b)(i)" },
    { name: "Laundry of clothing — part-time or casual", amount: 1.28, unit: "per shift", clause: "cl 19.5(b)(ii)" },
    { name: "Motor vehicle allowance", amount: 1.01, unit: "per km", clause: "cl 19.7" },
    { name: "Broken Hill allowance", amount: 47.9, unit: "per week", clause: "cl 19.9" },
  ],
  allowancesClause: "cl 19",
  hoursNotes: [
    "Casuals must be rostered for a minimum of 3 consecutive hours (cl 11.1), reduced to 2 hours for a full-time secondary school student working between 3.00 pm and 6.30 pm on a school day where the conditions in cl 11.5 are met.",
    "The maximum ordinary hours on any day is 12 (cl 13.3).",
  ],
  unverified: [
    "The pharmacist on-call and after-hours provisions in cl 19.4",
    "Annualised wage arrangements for pharmacists and pharmacy assistant level 4 (cl 18)",
    "National Training Wage (Schedule E of the Miscellaneous Award) trainee rates",
  ],
};

// -----------------------------------------------------------------------------
// Security Services Industry Award 2020 (MA000016)
// Consolidated to 1 July 2026 (PR799297 and PR799454).
// -----------------------------------------------------------------------------

export const SECURITY_AWARD: ModernAwardData = {
  key: "security",
  meta: {
    name: "Security Services Industry Award 2020",
    shortName: "Security Award",
    code: "MA000016",
    href: "/security-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799297 and PR799454)",
    determination: "PR799297",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000016.html",
    summaryUrl: "https://www.fairwork.gov.au/employment-conditions/awards/awards-summary/ma000016-summary",
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 11.1(a)",
    verifiedOn: VERIFIED_ON,
  },
  // cl 15.1 Table 4.
  rates: parse(`
Security Officer Level 1|1080.10|28.42
Security Officer Level 2|1111.00|29.24
Security Officer Level 3|1129.80|29.73
Security Officer Level 4|1148.70|30.23
Security Officer Level 5|1185.70|31.20
`),
  ratesClause: "cl 15.1, Table 4",
  entryLevel: "Security Officer Level 1",
  classificationNotes: [],
  matrix: [
    { label: "Mon–Fri 6am–6pm", fullTime: 1, casual: 1.25 },
    { label: "Mon–Fri night", fullTime: 1.217, casual: 1.467 },
    { label: "Saturday", fullTime: 1.5, casual: 1.75 },
    { label: "Sunday", fullTime: 2.0, casual: 2.25 },
    { label: "Public holiday", fullTime: 2.5, casual: 2.75 },
  ],
  // cl 20.2, Table 7.
  penalties: [
    { label: "Monday to Friday — midnight to 6.00 am and 6.00 pm to midnight", fullTime: 1.217, casual: 1.467 },
    { label: "Monday to Friday night work — employee on permanent night work", fullTime: 1.3, casual: 1.55 },
    { label: "Saturday", fullTime: 1.5, casual: 1.75 },
    { label: "Sunday", fullTime: 2.0, casual: 2.25 },
    { label: "Public holiday", fullTime: 2.5, casual: 2.75 },
  ],
  penaltiesClause: "cl 20.2, Table 7",
  penaltyNotes: [
    "Night work is 121.7%, not a round number — and 130% for an employee on permanent night work, meaning more than two-thirds of their ordinary shifts in a roster cycle include the period between midnight and 6.00 am (cl 20.3).",
    "The casual column in Table 7 is inclusive of the 25% casual loading, and cl 11.1(b) confirms the loading is paid in addition to any shift, weekend or public holiday penalty.",
  ],
  // cl 19.3(a), Table 5 — one column.
  overtime: [
    { label: "Monday to Saturday — first 2 hours", fullTime: 1.5, casual: null },
    { label: "Monday to Saturday — after 2 hours", fullTime: 2.0, casual: null },
    { label: "Sunday — all day", fullTime: 2.0, casual: null },
    { label: "Public holiday — all day", fullTime: 2.5, casual: null },
  ],
  overtimeClause: "cl 19.3(a), Table 5",
  overtimeNotes: [
    "Casuals are paid overtime for time worked beyond 10 hours a shift (12 by agreement) or beyond 38 hours a week, or an average of 38 across a roster of up to 8 weeks (cl 19.2(c)). An employer must not require more than 14 hours of work in a 24-hour period (cl 19.1).",
  ],
  casualPenaltyBasis: "additive",
  junior: null,
  noJuniorNote:
    "The Security Services Industry Award has no junior rates clause. An 18-year-old security officer is entitled to the full adult rate for their level.",
  juniorPhaseIn: null,
  // cl 17.
  allowances: [
    { name: "First aid allowance", amount: 7.68, unit: "per shift", clause: "cl 17.2(b)", note: "Up to a maximum of $38.19 per week." },
    { name: "Firearm allowance", amount: 3.84, unit: "per shift", clause: "cl 17.3", note: "Up to a maximum of $19.21 per week." },
    { name: "Broken shift allowance", amount: 18.3, unit: "per rostered shift", clause: "cl 17.4" },
    { name: "Supervision allowance — 1 to 5 employees", amount: 47.68, unit: "per week", clause: "cl 17.5(a)" },
    { name: "Supervision allowance — 6 to 10 employees", amount: 55.02, unit: "per week", clause: "cl 17.5(b)" },
    { name: "Supervision allowance — 11 to 20 employees", amount: 71.4, unit: "per week", clause: "cl 17.5(c)" },
    { name: "Supervision allowance — over 20 employees", amount: 84.28, unit: "per week", clause: "cl 17.5(d)" },
    { name: "Relieving officer allowance", amount: 47.23, unit: "per week", clause: "cl 17.6(a)" },
    { name: "Aviation allowance (security regulated airport)", amount: 2.11, unit: "per hour", clause: "cl 17.7" },
    { name: "Meal allowance (more than 1 hour after the shift, not advised the previous day)", amount: 22.14, unit: "per occasion", clause: "cl 17.8(b)" },
    { name: "Vehicle allowance — motor vehicle", amount: 1.0, unit: "per km", clause: "cl 17.9(b)(i)" },
    { name: "Vehicle allowance — motor cycle", amount: 0.34, unit: "per km", clause: "cl 17.9(b)(ii)" },
  ],
  allowancesClause: "cl 17",
  hoursNotes: [
    "Ordinary hours may be rostered as broken shifts of up to 2 periods of duty; each period must be paid for at least 3 hours even if the employee works a shorter time (cl 13.3(h)–(i)), and the broken shift allowance is payable on top.",
    "Call back: an employee required to return to work after finishing is paid for at least 2 hours (Monday to Saturday disciplinary or administrative attendance), 3 hours (Monday to Saturday for any other purpose) or 4 hours (Sunday) (cl 19.5, Table 6).",
  ],
  unverified: [
    "Classification definitions for Security Officer Levels 1 to 5 (Schedule A) — we publish the rate for each level but not the duties that place an officer at that level",
    "National Training Wage (Schedule E of the Miscellaneous Award) trainee rates",
  ],
};

// -----------------------------------------------------------------------------
// Clerks—Private Sector Award 2020 (MA000002)
// Consolidated to 1 July 2026 (PR799280, PR799283 and PR799440).
// -----------------------------------------------------------------------------

export const CLERKS_AWARD: ModernAwardData = {
  key: "clerks",
  meta: {
    name: "Clerks—Private Sector Award 2020",
    shortName: "Clerks Award",
    code: "MA000002",
    href: "/clerks-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799280, PR799283 and PR799440)",
    determination: "PR799283",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000002.html",
    summaryUrl: "https://www.fairwork.gov.au/employment-conditions/awards/awards-summary/ma000002-summary",
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 11.1",
    verifiedOn: VERIFIED_ON,
  },
  // cl 16.1 Table 3 (adults, 21 and over).
  rates: parse(`
Level 1 — Year 1|1024.70|26.97
Level 1 — Year 2|1073.10|28.24
Level 1 — Year 3|1106.20|29.11
Level 2 — Year 1|1119.10|29.45
Level 2 — Year 2|1139.90|30.00
Level 3|1182.10|31.11
Call centre principal customer contact specialist|1190.40|31.33
Level 4|1241.40|32.67
Level 5|1291.80|33.99
Call centre technical associate|1415.10|37.24
`),
  ratesClause: "cl 16.1, Table 3",
  entryLevel: "Level 1 — Year 1",
  classificationNotes: [
    {
      level: "Years of service",
      description:
        "Level 1 and Level 2 progress by year. Any service at the classification level — including administrative and clerical experience with a previous employer — counts towards a year of service (cl 16.2).",
    },
  ],
  matrix: [
    { label: "Mon–Fri", fullTime: 1, casual: 1.25 },
    { label: "Saturday", fullTime: 1.25, casual: 1.5 },
    { label: "Sunday", fullTime: 2.0, casual: 2.25 },
    { label: "Public holiday", fullTime: 2.5, casual: 2.75 },
  ],
  // cl 24 (non-shiftworkers). Casual figures from Schedule B.3.1.
  penalties: [
    { label: "Saturday (ordinary hours)", fullTime: 1.25, casual: 1.5 },
    { label: "Sunday (ordinary hours, where cl 13.5 applies)", fullTime: 2.0, casual: 2.25 },
    { label: "Public holiday", fullTime: 2.5, casual: 2.75 },
  ],
  penaltiesClause: "cl 24 and Schedule B.3.1",
  penaltyNotes: [
    "Ordinary hours for non-shiftworkers run 7.00 am to 7.00 pm Monday to Friday and 7.00 am to 12.30 pm on Saturday (cl 13.3), movable by up to an hour by agreement. Sunday ordinary hours arise only where cl 13.5 applies — clerks working alongside employees under a different award.",
    "An employee required to work ordinary hours on a Sunday, or to work on a public holiday, is entitled to not less than 4 hours' pay (cl 24.3(c), 24.4(d)).",
    "Shiftworkers are paid under Part 6 (cl 31) instead; those rates are not reproduced here.",
  ],
  // cl 21.4(a), Table 5.
  overtime: [
    { label: "Monday to Saturday — first 2 hours", fullTime: 1.5, casual: 1.75 },
    { label: "Monday to Saturday — after 2 hours", fullTime: 2.0, casual: 2.25 },
    { label: "Sunday — all day", fullTime: 2.0, casual: 2.25 },
    { label: "Public holiday — all day", fullTime: 2.5, casual: 2.75 },
  ],
  overtimeClause: "cl 21.4(a), Table 5",
  overtimeNotes: [
    "Casual overtime includes the loading (Table 5 NOTE 2). Overtime is calculated daily, and is payable once weekly overtime reaches half an hour (cl 21.3).",
  ],
  casualPenaltyBasis: "additive",
  // cl 16.4, Table 4 — any classification.
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
    clause: "cl 16.4, Table 4",
    appliesTo: "the rate for the employee's classification",
    adultAge: 21,
  },
  juniorPhaseIn: null,
  // cl 19.
  allowances: [
    { name: "First aid allowance", amount: 16.79, unit: "per week", clause: "cl 19.2(b)" },
    { name: "Uniform laundry — full-time", amount: 3.64, unit: "per week", clause: "cl 19.4(d)(i)" },
    { name: "Uniform laundry — part-time or casual", amount: 0.73, unit: "per shift", clause: "cl 19.4(d)(ii)" },
    { name: "Meal allowance (overtime of more than 1.5 hours without 24 hours' notice)", amount: 20.75, unit: "per occasion", clause: "cl 19.5(b)(i)" },
    { name: "Further meal allowance (that overtime exceeds 4 hours)", amount: 16.62, unit: "per occasion", clause: "cl 19.5(c)" },
    { name: "Vehicle allowance — motor car", amount: 1.0, unit: "per km", clause: "cl 19.6(a)(i)", note: "Payable up to 400 km a week (cl 19.6(b))." },
    { name: "Vehicle allowance — motor cycle", amount: 0.34, unit: "per km", clause: "cl 19.6(a)(ii)" },
  ],
  allowancesClause: "cl 19",
  hoursNotes: [
    "The maximum ordinary hours on any day is 10, excluding unpaid meal breaks (cl 13.7).",
  ],
  unverified: [
    "Shiftwork penalty and overtime rates (Part 6, cl 28 and 31)",
    "Annualised wage arrangements (cl 18)",
    "National Training Wage (Schedule E of the Miscellaneous Award) trainee rates",
  ],
};

// -----------------------------------------------------------------------------
// Manufacturing and Associated Industries and Occupations Award 2020 (MA000010)
// Consolidated to 1 July 2026 (PR799280, PR799291 and PR799448).
//
// ⚠️ CASUAL PENALTIES COMPOUND IN THIS AWARD. cl 11.1(d) and 32.1(f): where a
// penalty, overtime rate or shift loading is a percentage of the ordinary
// hourly rate, for a casual it is a percentage of the CASUAL ordinary hourly
// rate. Schedule C.3.2 confirms it: C14 casual $32.18, casual 150% $48.27
// (= 32.18 x 1.5), not 25.74 x 1.75.
//
// ⚠️ WEEKENDS ARE NOT ORDINARY HOURS BY DEFAULT for day workers. Ordinary
// hours are Monday to Friday, 6.00 am to 6.00 pm (cl 17.2(c)–(d)); Saturday or
// Sunday ordinary hours need agreement, and then attract 150% / 200%
// (cl 33.1(a)). Without agreement weekend work is overtime.
//
// ⚠️ JUNIOR PERCENTAGES ATTACH TO C13, not to the junior's own classification
// (cl 25.1: "% of C13/V2 level"), and do not apply to foundry juniors or the
// heavy operations listed in cl 25.4.
// -----------------------------------------------------------------------------

export const MANUFACTURING_AWARD: ModernAwardData = {
  key: "manufacturing",
  meta: {
    name: "Manufacturing and Associated Industries and Occupations Award 2020",
    shortName: "Manufacturing Award",
    code: "MA000010",
    href: "/manufacturing-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799280, PR799291 and PR799448)",
    determination: "PR799291",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000010.html",
    summaryUrl: "https://www.fairwork.gov.au/employment-conditions/awards/awards-summary/ma000010-summary",
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 11.1(a)",
    verifiedOn: VERIFIED_ON,
  },
  // cl 20.1(a). V levels are the vehicle manufacturing equivalents (Schedule B).
  rates: parse(`
C14 / V1|978.10|25.74
C13 / V2|1004.90|26.44
C12 / V3|1029.10|27.08
C11 / V4|1062.90|27.97
C10 / V5|1119.10|29.45
C9 / V6|1154.30|30.38
C8 / V7|1189.40|31.30
C7|1221.10|32.13
V8|1224.40|32.22
C6 / V9|1283.10|33.77
C5 / V10|1309.50|34.46
C4 / V11|1344.50|35.38
C3 / V12|1415.00|37.24
C2(a) / V13|1450.20|38.16
C2(b) / V14|1513.70|39.83
D1 (driver)|1076.60|28.33
D2 (driver)|1089.60|28.67
D3 (driver)|1102.60|29.02
D4 (driver)|1118.00|29.42
`),
  ratesClause: "cl 20.1(a)",
  entryLevel: "C14 / V1",
  // Schedule A.3.1 classification titles.
  classificationNotes: [
    { level: "C14", description: "Engineering/Manufacturing Employee — Level I (up to 38 hours' induction training)." },
    { level: "C13", description: "Engineering/Manufacturing Employee — Level II (in-house training)." },
    { level: "C12", description: "Engineering/Manufacturing Employee — Level III (Engineering Production Certificate I or Certificate II in Engineering, or equivalent)." },
    { level: "C11", description: "Engineering/Manufacturing Employee — Level IV (Engineering Production Certificate II or equivalent)." },
    { level: "C10", description: "Engineering/Manufacturing Tradesperson — Level I (a recognised trade certificate or Certificate III in Engineering), or Engineering/Manufacturing Systems Employee — Level V. The trade rate." },
    { level: "C9", description: "Engineering/Manufacturing Tradesperson — Level II, or Engineering/Laboratory Technician — Level I." },
    { level: "C8", description: "Engineering/Manufacturing Tradesperson — Special Class Level I, or Engineering/Laboratory Technician — Level II." },
    { level: "C7", description: "Engineering/Manufacturing Tradesperson — Special Class Level II, or Engineering/Laboratory Technician — Level III." },
    { level: "C6", description: "Advanced Engineering Tradesperson — Level I, or Engineering/Laboratory Technician — Level IV." },
    { level: "C5", description: "Advanced Engineering Tradesperson — Level II, or Engineering/Laboratory Technician — Level V." },
    { level: "C4 – C2(b)", description: "Engineering Associate / Laboratory Technical Officer levels through to Principal Technical Officer (Advanced Diploma level)." },
  ],
  matrix: [
    { label: "Mon–Fri day work", fullTime: 1, casual: 1 },
    { label: "Afternoon / night shift", fullTime: 1.15, casual: 1.15 },
    { label: "Permanent night shift", fullTime: 1.3, casual: 1.3 },
    { label: "Saturday", fullTime: 1.5, casual: 1.5 },
    { label: "Sunday", fullTime: 2.0, casual: 2.0 },
    { label: "Public holiday", fullTime: 2.5, casual: 2.5 },
  ],
  casualPenaltyBasis: "compounded",
  // cl 33.
  penalties: [
    { label: "Day worker — Saturday ordinary hours (only where agreed under cl 17.2(c))", fullTime: 1.5, casual: 1.5 },
    { label: "Day worker — Sunday ordinary hours (only where agreed under cl 17.2(c))", fullTime: 2.0, casual: 2.0 },
    { label: "Day worker — public holiday (minimum 3 hours)", fullTime: 2.5, casual: 2.5 },
    { label: "Afternoon or night shift", fullTime: 1.15, casual: 1.15 },
    { label: "Permanent night shift", fullTime: 1.3, casual: 1.3 },
    { label: "Shiftworker — Saturday", fullTime: 1.5, casual: 1.5 },
    { label: "Shiftworker (other than continuous) — Sunday", fullTime: 2.0, casual: 2.0 },
    { label: "Shiftworker (other than continuous) — public holiday", fullTime: 2.5, casual: 2.5 },
  ],
  penaltiesClause: "cl 33",
  penaltyNotes: [
    "Day workers' ordinary hours are Monday to Friday between 6.00 am and 6.00 pm (cl 17.2). Saturday and Sunday are ordinary hours only by agreement — without one, weekend work is paid as overtime.",
    "For casuals every percentage applies to the casual ordinary hourly rate, which already includes the 25% loading (cl 11.1(d)). A casual Saturday at 150% is therefore 187.5% of the base rate — this award compounds where most others add.",
    "Saturday, Sunday and public holiday shift rates replace the afternoon and night shift loadings rather than adding to them (cl 33.2(i)–(j)). Extra rates, other than special rates and public holiday rates, are not cumulative beyond double the ordinary hourly rate (cl 26).",
  ],
  // cl 32.
  overtime: [
    { label: "Overtime — first 3 hours (other than continuous shiftworkers)", fullTime: 1.5, casual: 1.5 },
    { label: "Overtime — after 3 hours", fullTime: 2.0, casual: 2.0 },
    { label: "Saturday overtime, day worker — first 3 hours (minimum 4 hours)", fullTime: 1.5, casual: 1.5 },
    { label: "Saturday overtime, day worker — after 3 hours", fullTime: 2.0, casual: 2.0 },
    { label: "Sunday overtime (minimum 3 hours)", fullTime: 2.0, casual: 2.0 },
    { label: "Public holiday overtime, day worker (minimum 3 hours)", fullTime: 2.5, casual: 2.5 },
    { label: "Continuous shiftworker — all overtime", fullTime: 2.0, casual: 2.0 },
  ],
  overtimeClause: "cl 32",
  overtimeNotes: [
    "Overtime for casuals is calculated on the casual ordinary hourly rate (cl 32.1(f)). Each day's overtime stands alone (cl 32.1(e)), and the hourly rate is the weekly rate divided by 38 even in a week of more than 38 ordinary hours (cl 32.1(d)).",
    "A call back after leaving work is paid for at least 4 hours at overtime rates, or 3 hours for an employee regularly required to be ready for call back (cl 32.13).",
  ],
  // cl 25.1 — unapprenticed juniors.
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
    clause: "cl 25.1",
    appliesTo: "unapprenticed juniors, as a percentage of the C13 / V2 rate — not foundry juniors (cl 25.3) or juniors on the heavy operations in cl 25.4, who have their own rules",
    adultAge: 21,
    baseLevel: "C13 / V2",
  },
  juniorPhaseIn: null,
  // cl 30.
  allowances: [
    { name: "Leading hand — in charge of 3 to 10 employees", amount: 48.98, unit: "per week", clause: "cl 30.2(a)(i)", note: "All-purpose: added to the rate before penalties and overtime are calculated." },
    { name: "Leading hand — in charge of 11 to 20 employees", amount: 73.15, unit: "per week", clause: "cl 30.2(a)(i)", note: "All-purpose." },
    { name: "Leading hand — in charge of more than 20 employees", amount: 93.12, unit: "per week", clause: "cl 30.2(a)(i)", note: "All-purpose." },
    { name: "Tool allowance — tradesperson", amount: 17.9, unit: "per week", clause: "cl 30.2(c)(ii)", note: "All-purpose. Not payable where the employer provides all tools (cl 30.2(c)(iii)–(iv))." },
    { name: "Tool allowance — carpenter, joiner or shipwright/boatbuilder", amount: 33.88, unit: "per week", clause: "cl 30.2(d)(ii)", note: "All-purpose." },
    { name: "Technical computing equipment allowance", amount: 57.87, unit: "per week", clause: "cl 30.2(e)(i)", note: "All-purpose." },
    { name: "First aid allowance", amount: 22.26, unit: "per week", clause: "cl 30.3(b)" },
    { name: "Overtime meal allowance", amount: 19.14, unit: "per occasion", clause: "cl 30.3(c)(ii)", note: "Payable at each overtime rest break unless notified the previous day, able to go home, or supplied a meal." },
    { name: "Vehicle allowance (own vehicle, by agreement)", amount: 1.0, unit: "per km", clause: "cl 30.3(a)" },
    { name: "Cold places (below 0°C for more than an hour)", amount: 0.82, unit: "per hour", clause: "cl 30.4(c)(i)" },
    { name: "Hot places — 46°C to 54°C", amount: 0.85, unit: "per hour", clause: "cl 30.4(d)(i)", note: "$1.12 an hour above 54°C." },
    { name: "Wet places", amount: 0.85, unit: "per hour", clause: "cl 30.4(e)(i)" },
    { name: "Confined spaces", amount: 1.12, unit: "per hour", clause: "cl 30.4(f)" },
    { name: "Dirty work", amount: 0.85, unit: "per hour", clause: "cl 30.4(g)(i)", note: "$1.12 an hour for certain ship repair work (cl 30.4(g)(ii))." },
  ],
  allowancesClause: "cl 30",
  hoursNotes: [
    "Casuals must be paid for a minimum of 4 consecutive hours each time they attend work, or 3 hours where the employee requests it and the employer agrees (cl 11.2).",
    "Day workers' ordinary hours average 38 a week, up to 152 in 28 days, and normally no more than 8 a day unless agreed (cl 17.2).",
  ],
  unverified: [
    "Vehicle manufacturing employees under Part 9 (cl 48–57), which carry their own loadings, allowances and overtime rules",
    "Apprentice, adult apprentice, cadet and trainee rates (cl 21–24)",
    "Supervisor/Trainer/Coordinator rates, which are a formula on the rate of the employees supervised (cl 20.1(g))",
    "Phased-in rates for employees without relevant work experience (cl 20.1(e)–(f))",
    "Height money, ship repair and the other special rates in cl 30.4 not listed here",
  ],
};

export const MODERN_AWARDS = {
  "fast-food": FAST_FOOD_AWARD,
  pharmacy: PHARMACY_AWARD,
  manufacturing: MANUFACTURING_AWARD,
  security: SECURITY_AWARD,
  clerks: CLERKS_AWARD,
} as const;

export type ModernAwardKey = keyof typeof MODERN_AWARDS;

// -----------------------------------------------------------------------------
// Junior rate phase-in from 1 December 2026 — determinations made 26 Aug 2026.
//
// Transcribed from the determinations themselves:
//   PR813654 Fast Food (cl 15.2 Table 4), PR813655 General Retail (cl 17.2
//   Table 5, levels 1–3 only), PR813656 Pharmacy (cl 16.2 Table 4, assistant
//   levels 1–2 only). Decision [2026] FWCFB 222, implementing [2026] FWCFB 75.
//
// Each column takes effect "from the start of the employee's first full pay
// period starting on or after the specified date". The 6-month qualifying
// period is employment WITH THE EMPLOYER (a transfer of business counts).
// Under-18 percentages do not change. Retail 20-year-olds with more than
// 6 months were already on 100% and stay there.
// -----------------------------------------------------------------------------

export interface JuniorPhaseInSchedule {
  determination: string;
  periods: readonly string[];
  /** Percentages (whole numbers) for employees employed MORE than 6 months. */
  age18: readonly number[];
  age19: readonly number[];
  age20: readonly number[];
  /** Unchanged rates for 6 months or less with the employer. */
  qualifyingPeriod: { age18: number; age19: number; age20: number };
}

export const JUNIOR_PHASE_IN = {
  decision: "[2026] FWCFB 222",
  principalDecision: "[2026] FWCFB 75",
  decidedOn: "26 August 2026",
  commences: "1 December 2026",
  fastFood: {
    determination: "PR813654",
    periods: [
      "1 Dec 2026 – 30 Jun 2027",
      "1 Jul 2027 – 30 Nov 2027",
      "1 Dec 2027 – 30 Jun 2028",
      "1 Jul 2028 – 30 Nov 2028",
      "1 Dec 2028 – 30 Jun 2029",
      "From 1 Jul 2029",
    ],
    age18: [75, 80, 85, 90, 95, 100],
    age19: [85, 90, 95, 100, 100, 100],
    age20: [95, 100, 100, 100, 100, 100],
    qualifyingPeriod: { age18: 70, age19: 80, age20: 90 },
  },
  retail: {
    determination: "PR813655",
    periods: [
      "1 Dec 2026 – 30 Jun 2027",
      "1 Jul 2027 – 30 Nov 2027",
      "1 Dec 2027 – 30 Jun 2028",
      "1 Jul 2028 – 30 Nov 2028",
      "1 Dec 2028 – 30 Jun 2029",
      "From 1 Jul 2029",
    ],
    age18: [75, 80, 85, 90, 95, 100],
    age19: [85, 90, 95, 100, 100, 100],
    age20: [100, 100, 100, 100, 100, 100],
    qualifyingPeriod: { age18: 70, age19: 80, age20: 90 },
  },
  pharmacy: {
    determination: "PR813656",
    periods: [
      "1 Dec 2026 – 30 Jun 2027",
      "1 Jul 2027 – 30 Jun 2028",
      "1 Jul 2028 – 30 Jun 2029",
      "From 1 Jul 2029",
    ],
    age18: [75, 85, 95, 100],
    age19: [85, 95, 100, 100],
    age20: [95, 100, 100, 100],
    qualifyingPeriod: { age18: 70, age19: 80, age20: 90 },
  },
} as const satisfies {
  decision: string;
  principalDecision: string;
  decidedOn: string;
  commences: string;
  fastFood: JuniorPhaseInSchedule;
  retail: JuniorPhaseInSchedule;
  pharmacy: JuniorPhaseInSchedule;
};

/**
 * Fair Work's own published junior dollars for Fast Food Level 1, transcribed
 * from Schedule A.3.2 / A.3.4 of the consolidated award (1 July 2026) and from
 * PR813654 item 2 (from 1 December 2026). Regression anchors for the
 * weekly-then-divide derivation used on the page.
 */
export const FAST_FOOD_PUBLISHED_JUNIOR_L1 = {
  current: [
    { age: "Under 16", hourly: 11.12, casual: 13.9 },
    { age: "16", hourly: 13.91, casual: 17.39 },
    { age: "17", hourly: 16.69 },
  ],
  fromDecember2026: [
    { age: "18, 6 months or less", percentage: 0.7, hourly: 19.47 },
    { age: "18, more than 6 months", percentage: 0.75, hourly: 20.86 },
    { age: "19, 6 months or less", percentage: 0.8, hourly: 22.25 },
    { age: "19, more than 6 months", percentage: 0.85, hourly: 23.64 },
    { age: "20, 6 months or less", percentage: 0.9, hourly: 25.03 },
    { age: "20, more than 6 months", percentage: 0.95, hourly: 26.42 },
  ],
} as const;

/**
 * Round half up to the cent, as Fair Work publishes derived rates.
 *
 * The intermediate toFixed(6) matters: 25.74 x 1.25 is 32.175 on paper but
 * 32.17499999… in floating point, and Fair Work publishes $32.18 (Manufacturing
 * Schedule C.3.2). Adding Number.EPSILON is too small to fix that at this scale.
 */
export function roundCents(value: number): number {
  return Math.round(Number((value * 100).toFixed(6))) / 100;
}

/** Junior hourly: percentage of the adult WEEKLY rate, divided by 38. */
export function juniorHourly(adultWeekly: number, percentage: number, hours = 38): number {
  return roundCents((adultWeekly * percentage) / hours);
}

/** A penalty dollar figure: hourly rate x multiplier, to the cent. */
export function penaltyDollars(hourly: number, multiplier: number): number {
  return roundCents(hourly * multiplier);
}

export function findAwardRate(award: ModernAwardData, level: string): AwardRate {
  const r = award.rates.find((x) => x.level === level);
  if (!r) throw new Error(`unknown ${award.meta.code} level: ${level}`);
  return r;
}
