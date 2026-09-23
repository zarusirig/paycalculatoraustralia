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
  /**
   * Part-time loading, where the award pays part-timers more per hour than
   * full-timers (Cleaning Services cl 10.2: 15%). Omitted when part-time
   * employees get the full-time hourly rate, which is the usual case.
   */
  partTimeLoading?: number;
  partTimeLoadingClause?: string;
  /**
   * Set when the award publishes weekly rates only and the hourly figure is
   * derived (Aged Care cl 10.4(b): 1/38th of the weekly rate). Printed next to
   * the rate table.
   */
  hourlyDerivation?: string;
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
  /** Part-time percentage, where the award tabulates part-time separately (Cleaning). */
  partTime?: number;
  /**
   * Row applies to one employment type only (e.g. Hair and Beauty casuals
   * working outside the ordinary span). The other column is shown as a dash
   * and its number is ignored.
   */
  employment?: "permanent" | "casual";
  /** Overrides the award's casualPenaltyBasis for this row (Nurses shift loadings). */
  casualBasis?: "additive" | "compounded";
  /** Classifications the row is limited to; dollars are shown on the first. */
  appliesTo?: readonly string[];
  /** Flat dollars per hour on top of the percentage (Restaurant late-night). */
  flatPerHour?: number;
  /**
   * The casual figure is transcribed from the award table and is NOT the
   * full-time percentage plus 25 points (e.g. Restaurant Sunday for Levels
   * 1–2, Hair and Beauty public holidays). `note` must say why.
   */
  casualTabulated?: true;
  note?: string;
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
  /** Part-time percentage where tabulated separately (Cleaning). */
  partTime?: number;
  /** Column appears in one employment type's matrix only. */
  employment?: "permanent" | "casual";
  /** Overrides the award's casualPenaltyBasis for this column. */
  casualBasis?: "additive" | "compounded";
  /** Casual figure transcribed, not full-time + 25 points (see PenaltyRow). */
  casualTabulated?: true;
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
    /**
     * What the percentage is applied to. "weekly" (default): the adult weekly
     * rate, then divided by 38 — the order Fair Work's schedules use. "hourly":
     * the adult hourly rate, where the award says so in terms (Road Transport
     * cl 17.3: "% of applicable adult minimum hourly rate").
     */
    basis?: "weekly" | "hourly";
    /**
     * Rounding the award applies to the junior WEEKLY rate before it is
     * divided into an hourly rate (Restaurant cl 18.2(b): nearest $0.10).
     */
    weeklyRoundTo?: number;
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
  /**
   * One or two sentences on how the casual loading combines with penalties,
   * for awards where it is neither simply additive nor simply compounded
   * (Nurses: shift loadings add, weekends compound). Used in the FAQ.
   */
  casualRuleSummary?: string;
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

// =============================================================================
// T4 — awards batch 3 (23 September 2026): Restaurant (MA000119), Nurses
// (MA000034), Aged Care (MA000018), Hair and Beauty (MA000005), Cleaning
// Services (MA000022) and Road Transport and Distribution (MA000038).
//
// Same method as above: transcribed from the consolidated award text at
// awards.fairwork.gov.au on 23 September 2026, clause cited against each
// figure. Two of the six are consolidated past 1 July 2026:
//   - Nurses to 1 August 2026 (PR812118): the final aged care work value
//     increase for aged care registered and enrolled nurses.
//   - Aged Care to 1 September 2026 (PR813673): a temporary vehicle allowance
//     only. Its wage rates are the 1 July 2026 rates (PR799299); the aged care
//     work value increases finished on 1 October 2025.
//
// ⚠️ THESE AWARDS BREAK THE SIMPLE RULES THE FIRST FIVE FOLLOW.
//   - Restaurant: casual Sunday is 150% at Introductory–Level 2 (the same as a
//     full-timer) but 175% at Levels 3–6 (Table 8). Weeknight penalties are
//     flat dollars, not percentages. Casual overtime has no loading (B.1.4).
//   - Nurses: shift loadings are additive for casuals (cl 11.4) but weekend,
//     public holiday and overtime rates are a percentage of the CASUAL rate
//     (cl 19.2, 21, 28.2) — compounding. Two rate streams (cl 15.1 / 15.3).
//   - Aged Care: weekly rates only; hourly is weekly / 38 (cl 10.4(b)).
//     Casual overtime is 187.5% / 250% / 312.5% (cl 25.1(c)).
//   - Hair and Beauty: casual public holiday is 250%, not 275% (Table 15).
//   - Cleaning: part-timers get a 15% allowance on every ordinary hour
//     (cl 10.2), so part-time is its own column.
//   - Road Transport: juniors are a % of the HOURLY rate (cl 17.3); casual
//     overtime drops the 25% loading and adds 10% (cl 11.4); full-time public
//     holiday pay is "in addition to" the weekly wage (cl 23.2(b)).
// =============================================================================

/** Weekly-only tables (Aged Care): hourly is weekly / 38, rounded to the cent. */
function parseWeekly(raw: string): AwardRate[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [level, weekly] = line.split("|");
      if (!level || !weekly) throw new Error(`malformed award row: ${JSON.stringify(line)}`);
      const w = Number(weekly);
      return { level, weekly: w, hourly: roundCents(w / 38) };
    });
}

const levelsMatching = (rows: readonly AwardRate[], pick: (level: string) => boolean): string[] =>
  rows.filter((r) => pick(r.level)).map((r) => r.level);

// -----------------------------------------------------------------------------
// Restaurant Industry Award 2020 (MA000119)
// Consolidated to 1 July 2026 (PR799280, PR799399 and PR799554).
// -----------------------------------------------------------------------------

const RESTAURANT_RATES = parse(`
Introductory Level|978.10|25.74
Level 1|1004.90|26.44
Level 2|1029.10|27.08
Level 3|1062.90|27.97
Level 4|1119.10|29.45
Level 5|1189.40|31.30
Level 6|1221.10|32.13
`);
const RESTAURANT_LOW = ["Introductory Level", "Level 1", "Level 2"] as const;
const RESTAURANT_HIGH = ["Level 3", "Level 4", "Level 5", "Level 6"] as const;

export const RESTAURANT_AWARD: ModernAwardData = {
  key: "restaurant",
  meta: {
    name: "Restaurant Industry Award 2020",
    shortName: "Restaurant Award",
    code: "MA000119",
    href: "/restaurant-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799280, PR799399 and PR799554)",
    determination: "PR799399",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000119.html",
    summaryUrl: "https://www.fairwork.gov.au/employment-conditions/awards/awards-summary/ma000119-summary",
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 11.1",
    verifiedOn: VERIFIED_ON,
  },
  // cl 18.1, Table 3.
  rates: RESTAURANT_RATES,
  ratesClause: "cl 18.1, Table 3",
  entryLevel: "Level 1",
  // Table 3 column 2 and Schedule A.
  classificationNotes: [
    { level: "Introductory Level", description: "A new starter in the restaurant industry who does not yet meet the Level 1 competencies. An employee stays at Introductory Level for up to 3 months while training, then moves to Level 1 unless both agree to up to 3 more months of training (Schedule A.1)." },
    { level: "Level 1", description: "Food and beverage attendant grade 1; kitchen attendant grade 1." },
    { level: "Level 2", description: "Food and beverage attendant grade 2; cook grade 1; kitchen attendant grade 2; clerical grade 1; storeperson grade 1; door person/security officer grade 1." },
    { level: "Level 3", description: "Food and beverage attendant grade 3; cook grade 2; kitchen attendant grade 3; clerical grade 2; storeperson grade 2; timekeeper/security officer grade 2; handyperson." },
    { level: "Level 4", description: "Food and beverage attendant grade 4 (tradesperson); cook grade 3 (tradesperson) — a commis chef or equivalent; clerical grade 3; storeperson grade 3." },
    { level: "Level 5", description: "Food and beverage supervisor; cook grade 4 (tradesperson) — a demi chef or equivalent; clerical supervisor." },
    { level: "Level 6", description: "Cook grade 5 (tradesperson) — a chef de partie or equivalent." },
  ],
  matrix: [
    { label: "Mon–Fri", fullTime: 1, casual: 1.25 },
    { label: "Saturday", fullTime: 1.25, casual: 1.5 },
    { label: "Sunday", fullTime: 1.5, casual: 1.5, employment: "permanent" },
    { label: "Sunday (Intro–Level 2)", fullTime: 1.5, casual: 1.5, employment: "casual", appliesTo: RESTAURANT_LOW, casualTabulated: true },
    { label: "Sunday (Levels 3–6)", fullTime: 1.5, casual: 1.75, employment: "casual", appliesTo: RESTAURANT_HIGH },
    { label: "Public holiday", fullTime: 2.25, casual: 2.5 },
  ],
  // cl 24.2, Table 8.
  penalties: [
    { label: "Monday to Friday — 10.00 pm to midnight", fullTime: 1, casual: 1.25, flatPerHour: 2.95 },
    { label: "Monday to Friday — midnight to 6.00 am", fullTime: 1, casual: 1.25, flatPerHour: 4.42 },
    { label: "Saturday", fullTime: 1.25, casual: 1.5 },
    {
      label: "Sunday — Introductory Level to Level 2",
      fullTime: 1.5,
      casual: 1.5,
      appliesTo: RESTAURANT_LOW,
      casualTabulated: true,
      note: "Table 8 column 3: a casual at Introductory Level to Level 2 gets 150% on a Sunday — the same percentage as a full-timer, with no extra loading.",
    },
    { label: "Sunday — Levels 3 to 6", fullTime: 1.5, casual: 1.75, appliesTo: RESTAURANT_HIGH },
    { label: "Public holiday", fullTime: 2.25, casual: 2.5 },
  ],
  penaltiesClause: "cl 24.2, Table 8",
  penaltyNotes: [
    "The weeknight penalty is a flat amount on top of the hourly rate, not a percentage: $2.95 for each hour or part of an hour between 10.00 pm and midnight, and $4.42 between midnight and 6.00 am, Monday to Friday. Both are set as 10% and 15% of the Level 4 standard hourly rate (Schedule C.3).",
    "Only the higher penalty is paid where two would apply at the same time (cl 24.3).",
    "By agreement, a full-time or part-time employee can instead be paid 125% on a public holiday and have the same number of hours added to annual leave or take a day off within 28 days (cl 24.4(d)). A public holiday shift is paid for at least 4 hours (full-time and part-time) or 2 hours (casual) (cl 24.4(a)–(b)).",
  ],
  // cl 23.4, Table 7. Schedule B.1.4 prints casual overtime at the same dollar figures as full-time.
  overtime: [
    { label: "Monday to Friday — first 2 hours", fullTime: 1.5, casual: 1.5 },
    { label: "Monday to Friday — after 2 hours", fullTime: 2.0, casual: 2.0 },
    { label: "Saturday — first 2 hours", fullTime: 1.75, casual: 1.75 },
    { label: "Saturday — after 2 hours", fullTime: 2.0, casual: 2.0 },
    { label: "Sunday — all time worked", fullTime: 2.0, casual: 2.0 },
    { label: "Rostered day off — all time worked", fullTime: 2.0, casual: null },
  ],
  overtimeClause: "cl 23.4, Table 7",
  overtimeNotes: [
    "Overtime percentages apply to the minimum hourly rate for casuals too — the award's Schedule B.1.4 prints casual overtime at exactly the full-time dollar figures, without the 25% loading.",
    "Work on a rostered day off is paid at the overtime rate for at least 4 hours (cl 23.1(d)–(e)). Each day's overtime stands alone (cl 23.3).",
  ],
  casualPenaltyBasis: "additive",
  // cl 18.2, Table 4. Weekly junior rates round to the nearest 10 cents (cl 18.2(b)).
  junior: {
    scale: [
      { age: "Under 17", percentage: 0.5 },
      { age: "17", percentage: 0.6 },
      { age: "18", percentage: 0.7 },
      { age: "19", percentage: 0.85 },
      { age: "20 and over", percentage: 1 },
    ],
    clause: "cl 18.2, Table 4",
    appliesTo: "every classification except liquor service, where a junior must be paid the adult rate (cl 13.5)",
    adultAge: 20,
    weeklyRoundTo: 0.1,
  },
  juniorPhaseIn: null,
  // cl 21 and Schedule C.
  allowances: [
    { name: "Meal allowance (overtime of more than 2 hours without notice the previous day)", amount: 17.42, unit: "per occasion", clause: "cl 21.2(a)", note: "Or the employer supplies a meal." },
    { name: "Split shift allowance — full-time and part-time", amount: 5.6, unit: "per separate work period of 2 hours or more", clause: "cl 21.3(b)" },
    { name: "Tool and equipment allowance — cook or apprentice cook using own tools", amount: 2.03, unit: "per day or part day", clause: "cl 21.4(a)", note: "Up to a maximum of $9.94 a week." },
  ],
  allowancesClause: "cl 21",
  hoursNotes: [
    "Casuals must be engaged and paid for at least 2 consecutive hours each time they attend work (cl 11.3).",
    "Part-time employees must not be rostered for fewer than 3 or more than 11.5 hours in a day, and must have 2 days off each week (cl 10.7).",
    "A full-time employee works at least 6 and at most 11.5 ordinary hours a day (cl 15.1). An employee under 18 must not be required to work more than 10 hours in a shift (cl 13.3).",
  ],
  unverified: [
    "Apprentice cook rates (cl 18.3 to 18.5, Table 5) and school-based apprentices (Schedule D)",
    "Annualised wage arrangements",
    "National Training Wage (Schedule E of the Miscellaneous Award) trainee rates",
  ],
};

// -----------------------------------------------------------------------------
// Nurses Award 2020 (MA000034)
// Consolidated to 1 August 2026 (PR812118). Clause 15.1 (other than aged
// care) is operative from 1 July 2026 (PR799315); the clause 15.3 aged care
// enrolled and registered nurse tables from 1 August 2026 (PR812118).
// -----------------------------------------------------------------------------

const NURSES_RATES = parse(`
Nursing assistant — 1st year|1050.70|27.65
Nursing assistant — 2nd year|1067.30|28.09
Nursing assistant — 3rd year and thereafter|1084.40|28.54
Nursing assistant — experienced (Certificate III)|1119.10|29.45
Student enrolled nurse — under 21|976.20|25.69
Student enrolled nurse — 21 and over|1024.70|26.97
Enrolled nurse — pay point 1|1139.90|30.00
Enrolled nurse — pay point 2|1155.00|30.39
Enrolled nurse — pay point 3|1170.40|30.80
Enrolled nurse — pay point 4|1187.20|31.24
Enrolled nurse — pay point 5|1199.20|31.56
Registered nurse level 1 — pay point 1|1219.50|32.09
Registered nurse level 1 — pay point 2|1244.50|32.75
Registered nurse level 1 — pay point 3|1275.00|33.55
Registered nurse level 1 — pay point 4|1309.00|34.45
Registered nurse level 1 — pay point 5|1349.20|35.51
Registered nurse level 1 — pay point 6|1388.10|36.53
Registered nurse level 1 — pay point 7|1428.30|37.59
Registered nurse level 1 — pay point 8 and thereafter|1465.50|38.57
Registered nurse entry — 4-year degree|1273.40|33.51
Registered nurse entry — Masters degree|1317.20|34.66
Registered nurse level 2 — pay point 1|1504.40|39.59
Registered nurse level 2 — pay point 2|1528.30|40.22
Registered nurse level 2 — pay point 3|1554.80|40.92
Registered nurse level 2 — pay point 4 and thereafter|1580.30|41.59
Registered nurse level 3 — pay point 1|1631.20|42.93
Registered nurse level 3 — pay point 2|1661.10|43.71
Registered nurse level 3 — pay point 3|1689.80|44.47
Registered nurse level 3 — pay point 4 and thereafter|1720.10|45.27
Registered nurse level 4 — grade 1|1861.70|48.99
Registered nurse level 4 — grade 2|1995.10|52.50
Registered nurse level 4 — grade 3|2111.60|55.57
Registered nurse level 5 — grade 1|1878.60|49.44
Registered nurse level 5 — grade 2|1978.40|52.06
Registered nurse level 5 — grade 3|2111.60|55.57
Registered nurse level 5 — grade 4|2243.10|59.03
Registered nurse level 5 — grade 5|2474.10|65.11
Registered nurse level 5 — grade 6|2706.90|71.23
Nurse practitioner — 1st year|1877.00|49.39
Nurse practitioner — 2nd year|1932.70|50.86
Occupational health nurse level 1 — pay point 1|1309.00|34.45
Occupational health nurse level 1 — pay point 2|1349.20|35.51
Occupational health nurse level 1 — pay point 3|1388.10|36.53
Occupational health nurse level 1 — pay point 4|1428.30|37.59
Occupational health nurse level 1 — pay point 5|1465.50|38.57
Occupational health nurse level 2 — pay point 1|1504.40|39.59
Occupational health nurse level 2 — pay point 2|1528.30|40.22
Occupational health nurse level 2 — pay point 3|1554.80|40.92
Occupational health nurse level 2 — pay point 4|1580.30|41.59
Senior occupational health clinical nurse|1580.30|41.59
Occupational health nurse level 3 — pay point 1|1631.20|42.93
Occupational health nurse level 3 — pay point 2|1661.10|43.71
Occupational health nurse level 3 — pay point 3|1689.80|44.47
Occupational health nurse level 3 — pay point 4 and thereafter|1720.10|45.27
Aged care student enrolled nurse — under 21|1122.60|29.54
Aged care student enrolled nurse — 21 and over|1178.30|31.01
Aged care enrolled nurse supervising other direct care employees|1542.00|40.58
Aged care registered nurse level 1 — first year at level|1571.60|41.36
Aged care registered nurse level 1 — over 1 and up to 4 years|1654.30|43.53
Aged care registered nurse level 1 — over 4 years|1801.10|47.40
Aged care registered nurse level 2 — first 3 years at level|1947.70|51.26
Aged care registered nurse level 2 — over 3 years|2046.00|53.84
Aged care registered nurse level 3|2094.20|55.11
Aged care registered nurse level 4|2390.30|62.90
Aged care registered nurse level 5|2711.30|71.35
Aged care nurse practitioner — 1st year|2158.60|56.81
Aged care nurse practitioner — 2nd year|2222.70|58.49
`);

/** Registered nurse levels 4 and 5 get no shift loadings or overtime (cl 19.1(b), 20.2(e)). */
const isRnLevel4or5 = (level: string) => /registered nurse level [45]\b/i.test(level);
const NURSES_SHIFT_LEVELS = levelsMatching(NURSES_RATES, (l) => !isRnLevel4or5(l));

export const NURSES_AWARD: ModernAwardData = {
  key: "nurses",
  meta: {
    name: "Nurses Award 2020",
    shortName: "Nurses Award",
    code: "MA000034",
    href: "/nurses-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote:
      "Rates for employees other than aged care employees apply from the first full pay period starting on or after 1 July 2026. The aged care enrolled and registered nurse rates in clause 15.3 apply from the first full pay period starting on or after 1 August 2026.",
    consolidatedTo: "1 August 2026 (PR812118)",
    determination: "PR799315",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000034.html",
    summaryUrl: "https://www.fairwork.gov.au/employment-conditions/awards/awards-summary/ma000034-summary",
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 11.1",
    verifiedOn: VERIFIED_ON,
  },
  // cl 15.1 (other than aged care) and cl 15.3 (aged care employees).
  rates: NURSES_RATES,
  ratesClause: "cl 15.1 and 15.3",
  entryLevel: "Registered nurse level 1 — pay point 1",
  classificationNotes: [
    { level: "Two rate streams", description: "Clause 15.1 applies to every employee except aged care employees. Clause 15.3 applies to aged care employees — nurses providing services to aged persons in a nursing home, hostel, retirement village or other residential facility, or in an aged person's private home. Rows beginning “Aged care” are clause 15.3 rates." },
    { level: "Pay point progression", description: "Outside aged care, a full-time nurse moves up a pay point each year; a part-time or casual nurse after 1786 hours of experience (cl 15.2)." },
    { level: "Graduate entry", description: "A registered nurse entering with a 4-year degree starts on $1,273.40 a week and one with a Masters degree on $1,317.20, then progresses to level 1 pay point 4 and pay point 5 respectively (cl 15.1(c)(ii))." },
    { level: "Nursing assistants in aged care", description: "Since 1 January 2025, nursing assistants providing care to aged persons in aged care or home care are not covered by this award (cl 4.4). Residential aged care nursing assistants are paid under the Aged Care Award." },
  ],
  matrix: [
    { label: "Mon–Fri", fullTime: 1, casual: 1.25, casualBasis: "additive" },
    { label: "Afternoon shift", fullTime: 1.125, casual: 1.375, casualBasis: "additive", appliesTo: NURSES_SHIFT_LEVELS },
    { label: "Night shift", fullTime: 1.15, casual: 1.4, casualBasis: "additive", appliesTo: NURSES_SHIFT_LEVELS },
    { label: "Saturday", fullTime: 1.5, casual: 1.5 },
    { label: "Sunday", fullTime: 1.75, casual: 1.75 },
    { label: "Public holiday", fullTime: 2.0, casual: 2.0 },
  ],
  // cl 20.2 (shift), 21 (weekends), 28.2 (public holidays).
  penalties: [
    { label: "Afternoon shift, Monday to Friday (starts at or after noon, finishes after 6.00 pm)", fullTime: 1.125, casual: 1.375, casualBasis: "additive", appliesTo: NURSES_SHIFT_LEVELS },
    { label: "Night shift, Monday to Friday (starts at or after 6.00 pm, finishes before 7.30 am)", fullTime: 1.15, casual: 1.4, casualBasis: "additive", appliesTo: NURSES_SHIFT_LEVELS },
    { label: "Saturday (midnight Friday to midnight Saturday)", fullTime: 1.5, casual: 1.5 },
    { label: "Sunday (midnight Saturday to midnight Sunday)", fullTime: 1.75, casual: 1.75 },
    { label: "Public holiday", fullTime: 2.0, casual: 2.0 },
  ],
  penaltiesClause: "cl 20.2, 21 and 28.2",
  penaltyNotes: [
    "Casual shift loadings are worked out on the minimum hourly rate and the 25% casual loading is then added (cl 11.4), so a casual afternoon shift is 137.5% and a night shift 140%. Weekend and public holiday rates are the other way round: they are a percentage of the casual hourly rate (cl 21, 28.2), so a casual Saturday is 150% of the casual rate — 187.5% of the minimum rate.",
    "Shift loadings do not apply on a Saturday, Sunday or public holiday, where the weekend or public holiday rate is paid instead (cl 20.2(d)), and do not apply to registered nurse levels 4 and 5 (cl 20.2(e)).",
    "Christmas Day falling on a weekend attracts an extra 50% loading in businesses that operate 7 days a week (cl 28.2(b)).",
  ],
  // cl 19.1 (full-time and part-time) and 19.2 (casuals: % of the casual hourly rate).
  overtime: [
    { label: "Monday to Saturday — first 2 hours", fullTime: 1.5, casual: 1.5 },
    { label: "Monday to Saturday — after 2 hours", fullTime: 2.0, casual: 2.0 },
    { label: "Sunday", fullTime: 2.0, casual: 2.0 },
    { label: "Public holiday", fullTime: 2.5, casual: 2.5 },
  ],
  overtimeClause: "cl 19.1 and 19.2",
  overtimeNotes: [
    "Casual overtime is a percentage of the casual hourly rate (cl 19.2), so it includes the loading. Overtime replaces shift loadings and weekend penalties rather than adding to them (cl 19.1(c)). Overtime rates do not apply to registered nurse levels 4 and 5 (cl 19.1(b)).",
    "A nurse recalled to the workplace is paid for at least 3 hours at the overtime rate; recall handled by phone or electronically is paid for at least one hour (cl 19.6–19.7).",
  ],
  casualPenaltyBasis: "compounded",
  casualRuleSummary:
    "Casuals receive 25% on top of the minimum hourly rate. Afternoon and night shift loadings are calculated on the minimum rate and the 25% is then added (137.5% and 140%), but Saturday, Sunday, public holiday and overtime rates are a percentage of the casual hourly rate, so they compound — a casual Saturday is 150% of the casual rate, or 187.5% of the minimum rate.",
  junior: null,
  noJuniorNote:
    "The Nurses Award has no junior rates. The only age-based rates are for student enrolled nurses under 21, shown in the rate table; every other classification is paid the same at any age.",
  juniorPhaseIn: null,
  // cl 17. Not payable to registered nurse levels 4 and 5 (cl 17.1).
  allowances: [
    { name: "On-call — Monday to Friday", amount: 28.66, unit: "per 24 hours or part", clause: "cl 17.2(a)" },
    { name: "On-call — Saturday", amount: 43.17, unit: "per 24 hours or part", clause: "cl 17.2(a)" },
    { name: "On-call — Sunday, public holiday or non-rostered day", amount: 50.37, unit: "per 24 hours or part", clause: "cl 17.2(a)" },
    { name: "Uniform allowance (instead of supplied uniforms)", amount: 1.26, unit: "per shift", clause: "cl 17.3(a)(ii)", note: "Or $6.41 a week, whichever is less." },
    { name: "Laundry allowance", amount: 0.33, unit: "per shift", clause: "cl 17.3(a)(iii)", note: "Or $1.53 a week, whichever is less." },
    { name: "Meal allowance (overtime of more than one hour)", amount: 17.3, unit: "per occasion", clause: "cl 17.3(b)(i)", note: "A further $15.60 where the overtime exceeds 4 hours (cl 17.3(b)(ii))." },
    { name: "Motor vehicle allowance (own vehicle)", amount: 1.01, unit: "per km", clause: "cl 17.3(c)(i)" },
  ],
  allowancesClause: "cl 17",
  hoursNotes: [
    "A shift is at most 10 ordinary hours, excluding meal breaks (cl 13.1(d)). A day worker's ordinary hours fall between 6.00 am and 6.00 pm, Monday to Friday (cl 13.1(a)).",
    "A casual is paid for at least 2 hours each engagement (cl 11.3).",
    "Shiftworkers get the higher of the 17.5% annual leave loading or the shift and weekend penalties they would have earned (cl 22.5(b)).",
  ],
  unverified: [
    "Retained rates for aged care nurses translated on 1 March 2025 (Schedule F.3) — some are higher than the current table",
    "Higher duties (cl 15.4) and the Christmas Day weekend loading in dollars (cl 28.2(b))",
    "Allowances do not apply to registered nurse levels 4 and 5 (cl 17.1)",
  ],
};

// -----------------------------------------------------------------------------
// Aged Care Award 2010 (MA000018)
// Consolidated to 1 September 2026 (PR813673 — temporary vehicle allowance).
// Wage rates operative from 1 July 2026 (PR799299). The award sets weekly
// rates only; hourly = weekly / 38 (cl 10.4(b), 26.3), which reproduces every
// hourly figure in the FWO pay guide published 31 August 2026.
// -----------------------------------------------------------------------------

const AGED_CARE_RATES = parseWeekly(`
General — level 1|1055.40
General — level 2|1097.20
General — level 3|1139.40
General — level 4|1152.80
General — level 5|1191.80
General — level 6|1256.00
General — level 7|1278.60
General — level 4 (most senior food services employee)|1287.00
General — level 5 (most senior food services employee)|1330.70
General — level 6 (most senior food services employee)|1402.50
General — level 7 (most senior food services employee)|1427.50
Direct care — level 1 (Introductory)|1239.00
Direct care — level 2 (Direct Carer)|1307.80
Direct care — level 3 (Qualified)|1376.70
Direct care — level 4 (Senior)|1431.80
Direct care — level 5 (Specialist)|1486.80
Direct care — level 6 (Team Leader)|1541.90
`);

/** cl 3.1: the standard rate is the general level 6 weekly wage. */
export const AGED_CARE_STANDARD_RATE = 1256.0;

export const AGED_CARE_AWARD: ModernAwardData = {
  key: "aged-care",
  meta: {
    name: "Aged Care Award 2010",
    shortName: "Aged Care Award",
    code: "MA000018",
    href: "/aged-care-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 September 2026 (PR813673)",
    determination: "PR799299",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000018.html",
    summaryUrl: "https://www.fairwork.gov.au/employment-conditions/awards/awards-summary/ma000018-summary",
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 10.4(b)",
    verifiedOn: VERIFIED_ON,
    hourlyDerivation:
      "The Aged Care Award sets weekly rates only. A casual is paid 1/38th of the weekly rate for each hour plus the loading (cl 10.4(b)), and shift allowances use the weekly rate divided by 38 (cl 26.3), so the hourly figures here are that division rounded to the cent — the same figures as the Fair Work Ombudsman pay guide.",
  },
  // cl 14.1 (general), 14.2 (most senior food services employee), 14.3 (direct care).
  rates: AGED_CARE_RATES,
  ratesClause: "cl 14.1 to 14.3",
  entryLevel: "Direct care — level 1 (Introductory)",
  classificationNotes: [
    { level: "Direct care", description: "An employee whose primary responsibility is personal care of residents under the supervision of a registered or enrolled nurse, or recreational and lifestyle activities — personal care workers, assistants in nursing and lifestyle staff (cl 3.1). Levels run from Introductory through Direct Carer, Qualified, Senior and Specialist to Team Leader (Schedule B)." },
    { level: "General", description: "Everyone else in a residential aged care facility — administration, cleaning, laundry, food services, gardening and maintenance — on general levels 1 to 7 (cl 14.1)." },
    { level: "Most senior food services employee", description: "The single most senior food services employee at a facility, classified at general levels 4 to 7, is paid the higher clause 14.2 rate." },
    { level: "Who is not covered", description: "Registered and enrolled nurses are paid under the Nurses Award, and home care workers under the SCHADS Award." },
  ],
  matrix: [
    { label: "Mon–Fri day", fullTime: 1, casual: 1.25 },
    { label: "Afternoon (starts 10am–1pm)", fullTime: 1.1, casual: 1.35 },
    { label: "Afternoon (starts 1pm–4pm)", fullTime: 1.125, casual: 1.375 },
    { label: "Night (starts 4pm–4am)", fullTime: 1.15, casual: 1.4 },
    { label: "Night (starts 4am–6am)", fullTime: 1.1, casual: 1.35 },
    { label: "Saturday", fullTime: 1.5, casual: 1.75 },
    { label: "Sunday", fullTime: 1.75, casual: 2.0 },
    { label: "Public holiday", fullTime: 2.5, casual: 2.75 },
  ],
  // cl 26.1 (shifts), 23 (weekends), 29.2 (public holidays). Casual shift
  // figures (loading added to the shift %) match the FWO pay guide.
  penalties: [
    { label: "Afternoon shift starting 10.00 am and before 1.00 pm", fullTime: 1.1, casual: 1.35 },
    { label: "Afternoon shift starting 1.00 pm and before 4.00 pm", fullTime: 1.125, casual: 1.375 },
    { label: "Night shift starting 4.00 pm and before 4.00 am", fullTime: 1.15, casual: 1.4 },
    { label: "Night shift starting 4.00 am and before 6.00 am", fullTime: 1.1, casual: 1.35 },
    { label: "Saturday (midnight Friday to midnight Saturday)", fullTime: 1.5, casual: 1.75 },
    { label: "Sunday (midnight Saturday to midnight Sunday)", fullTime: 1.75, casual: 2.0 },
    { label: "Public holiday", fullTime: 2.5, casual: 2.75 },
  ],
  penaltiesClause: "cl 23, 26.1 and 29.2",
  penaltyNotes: [
    "A shift allowance is paid for the whole shift (cl 26.2). An employee working fewer than 38 hours a week gets it only if the shift starts before 6.00 am or finishes after 6.00 pm (cl 26.1).",
    "Weekend rates replace shift allowances (cl 23.1), and a casual's 175% Saturday and 200% Sunday replace the casual loading rather than adding to it (cl 23.3).",
    "On a public holiday a full-time or part-time employee is paid their ordinary pay plus an additional 150% for hours worked — 250% in all — or can elect each year to have the hours added to annual leave instead (cl 29.2(a)–(b)). Casuals are paid 275% (cl 29.2(c)).",
  ],
  // cl 25.1.
  overtime: [
    { label: "Monday to Friday — first 2 hours", fullTime: 1.5, casual: 1.875 },
    { label: "Monday to Friday — after 2 hours", fullTime: 2.0, casual: 2.5 },
    { label: "Saturday and Sunday", fullTime: 2.0, casual: 2.5 },
    { label: "Public holiday", fullTime: 2.5, casual: 3.125 },
  ],
  overtimeClause: "cl 25.1",
  overtimeNotes: [
    "Casual overtime is set in terms at 187.5%, 250% and 312.5% of the hourly rate (cl 25.1(c)) and applies to hours over 38 a week, 76 a fortnight or 10 a day. For part-timers working more than 10 hours in a day, Saturday counts with Monday to Friday (cl 25.1(b)(ii)).",
    "An employee recalled to work overtime is paid for at least 4 hours (cl 25.1(e)).",
  ],
  casualPenaltyBasis: "additive",
  junior: null,
  noJuniorNote:
    "The Aged Care Award has no junior rates for its general or direct care classifications — only apprentices are paid a percentage of an adult rate. A 17-year-old personal care worker is owed the full rate for their level.",
  juniorPhaseIn: null,
  // cl 15 and 22.9(d). Leading hand, nauseous work and sleepover allowances are
  // percentages of the standard rate ($1,256.00); the dollar figures are that
  // percentage, rounded to the cent, and match the FWO pay guide.
  allowances: [
    { name: "Uniform allowance (instead of supplied uniforms, by agreement)", amount: 1.26, unit: "per shift", clause: "cl 15.2(b)", note: "Or $6.41 a week, whichever is less." },
    { name: "Laundry allowance", amount: 0.33, unit: "per shift", clause: "cl 15.2(b)", note: "Or $1.53 a week, whichever is less." },
    { name: "Leading hand — in charge of 2 to 5 employees", amount: roundCents(AGED_CARE_STANDARD_RATE * 0.0267), unit: "per week", clause: "cl 15.3(b)", note: "2.67% of the standard rate. All-purpose (cl 15.3(c))." },
    { name: "Leading hand — in charge of 6 to 10 employees", amount: roundCents(AGED_CARE_STANDARD_RATE * 0.0381), unit: "per week", clause: "cl 15.3(b)", note: "3.81% of the standard rate. All-purpose." },
    { name: "Leading hand — in charge of 11 to 15 employees", amount: roundCents(AGED_CARE_STANDARD_RATE * 0.0481), unit: "per week", clause: "cl 15.3(b)", note: "4.81% of the standard rate. All-purpose." },
    { name: "Leading hand — in charge of 16 or more employees", amount: roundCents(AGED_CARE_STANDARD_RATE * 0.0588), unit: "per week", clause: "cl 15.3(b)", note: "5.88% of the standard rate. All-purpose." },
    { name: "Meal allowance (overtime of more than one hour)", amount: 17.3, unit: "per occasion", clause: "cl 15.4(a)", note: "A further $15.60 where the overtime exceeds 4 hours." },
    { name: "Nauseous work allowance", amount: roundCents(AGED_CARE_STANDARD_RATE * 0.0005), unit: "per hour or part", clause: "cl 15.5(a)", note: "0.05% of the standard rate." },
    { name: "Tool allowance — chefs and cooks not supplied with tools", amount: 13.41, unit: "per week", clause: "cl 15.6" },
    { name: "Vehicle allowance — 1 September 2026 to 28 February 2027", amount: 1.05, unit: "per km", clause: "cl 15.7(aa)", note: "Temporary rate. From 1 March 2027 it reverts to $1.01 per km (cl 15.7(a))." },
    { name: "Sleepover allowance", amount: roundCents(AGED_CARE_STANDARD_RATE * 0.052), unit: "per night", clause: "cl 22.9(d)", note: "5.20% of the standard rate, plus free board and lodging." },
  ],
  allowancesClause: "cl 15 and 22.9",
  hoursNotes: [
    "Minimum payment per engagement: 4 hours for full-time employees, 2 hours for part-time and casual employees (cl 22.7).",
    "A broken shift (part-time or casual, by agreement) can span at most 12 hours; work beyond that span is paid at double time (cl 22.8).",
    "Employees must get at least 10 hours off between shifts, or 8 by agreement (cl 22.4). Day workers' ordinary hours fall between 6.00 am and 6.00 pm, Monday to Friday (cl 22.2).",
  ],
  unverified: [
    "Cooking and gardening apprentice rates (cl 14.4 to 14.6)",
    "Classification translation and retained rates for employees reclassified on 1 January 2025 (Schedule I)",
    "National Training Wage (Schedule E of the Miscellaneous Award) trainee rates",
  ],
};

// -----------------------------------------------------------------------------
// Hair and Beauty Industry Award 2020 (MA000005)
// Consolidated to 1 July 2026 (PR799280, PR799286 and PR799444).
// -----------------------------------------------------------------------------

export const HAIR_BEAUTY_AWARD: ModernAwardData = {
  key: "hair-and-beauty",
  meta: {
    name: "Hair and Beauty Industry Award 2020",
    shortName: "Hair and Beauty Award",
    code: "MA000005",
    href: "/hair-and-beauty-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799280, PR799286 and PR799444)",
    determination: "PR799286",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000005.html",
    summaryUrl: "https://www.fairwork.gov.au/employment-conditions/awards/awards-summary/ma000005-summary",
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 11.2",
    verifiedOn: VERIFIED_ON,
  },
  // cl 17.1, Table 4.
  rates: parse(`
Level 1|1056.80|27.81
Level 2|1081.00|28.45
Level 3|1119.10|29.45
Level 4|1139.90|30.00
Level 5|1174.00|30.89
Level 6|1215.90|32.00
`),
  ratesClause: "cl 17.1, Table 4",
  entryLevel: "Level 1",
  classificationNotes: [
    { level: "Level 3", description: "The standard rate: apprentice rates are a percentage of the Level 3 adult rate (Schedule B.5.1)." },
  ],
  matrix: [
    { label: "Mon–Fri 7am–9pm", fullTime: 1, casual: 1.25 },
    { label: "Sat 7am–6pm", fullTime: 1.33, casual: 1.58 },
    { label: "Sunday", fullTime: 2.0, casual: 2.25 },
    { label: "Public holiday", fullTime: 2.5, casual: 2.5, casualTabulated: true },
  ],
  // cl 23.1 Table 14 (full-time and part-time), 23.2 Table 15 (casuals).
  penalties: [
    { label: "Saturday — 7.00 am to 6.00 pm", fullTime: 1.33, casual: 1.58 },
    { label: "Sunday — 10.00 am to 5.00 pm (casuals: any time of day)", fullTime: 2.0, casual: 2.25 },
    {
      label: "Public holiday — any time of day",
      fullTime: 2.5,
      casual: 2.5,
      casualTabulated: true,
      note: "Table 15 sets casuals at 250% on a public holiday — the same as full-time and part-time employees. The 25% loading is not added on top.",
    },
    { label: "Rostered day off (worked by written agreement)", fullTime: 2.0, casual: 2.0, employment: "permanent", note: "Paid for at least 4 hours (cl 23.3(c))." },
    { label: "Casuals — Monday to Friday before 7.00 am or after 9.00 pm", fullTime: 1.5, casual: 1.5, employment: "casual", note: "Outside the span of ordinary hours; full-time and part-time employees are paid overtime for this time." },
    { label: "Casuals — Saturday before 7.00 am or after 6.00 pm", fullTime: 1.5, casual: 1.5, employment: "casual", note: "Outside the Saturday span; full-time and part-time employees are paid overtime." },
  ],
  penaltiesClause: "cl 23, Tables 14 and 15",
  penaltyNotes: [
    "Ordinary hours can only be worked Monday to Friday 7.00 am to 9.00 pm, Saturday 7.00 am to 6.00 pm and Sunday 10.00 am to 5.00 pm (cl 14.4, Table 2). Outside those spans a full-time or part-time employee is on overtime.",
    "The casual loading of 25% applies to ordinary hours between 7.00 am and 9.00 pm Monday to Friday (cl 11.2); the casual weekend and public holiday percentages in Table 15 already include it where it applies.",
  ],
  // cl 22.5, Table 13.
  overtime: [
    { label: "Monday to Saturday — first 3 hours", fullTime: 1.5, casual: 1.75 },
    { label: "Monday to Saturday — after 3 hours", fullTime: 2.0, casual: 2.25 },
    { label: "Sunday — all overtime hours", fullTime: 2.0, casual: 2.25 },
    { label: "Public holiday — all overtime hours", fullTime: 2.5, casual: 2.5 },
    { label: "Rostered day off — all overtime hours", fullTime: 2.0, casual: null },
  ],
  overtimeClause: "cl 22.5, Table 13",
  overtimeNotes: [
    "Casual overtime includes the 25% loading except on public holidays, where it is 250% (Table 13 NOTE 1). Casuals are on overtime after 38 ordinary hours a week or 10.5 hours in a day (cl 22.4).",
  ],
  casualPenaltyBasis: "additive",
  // cl 17.2, Table 5.
  junior: {
    scale: [
      { age: "Under 17", percentage: 0.5 },
      { age: "17", percentage: 0.75 },
      { age: "18 and over", percentage: 1 },
    ],
    clause: "cl 17.2, Table 5",
    appliesTo: "every classification (apprentices are paid under cl 18 instead)",
    adultAge: 18,
  },
  juniorPhaseIn: null,
  // cl 20.
  allowances: [
    { name: "Manager's allowance (in charge of an establishment for a full week)", amount: 55.96, unit: "per week", clause: "cl 20.2" },
    { name: "First aid allowance", amount: 14.55, unit: "per week", clause: "cl 20.3" },
    { name: "Tool allowance (own scissors and tools required)", amount: 10.52, unit: "per week", clause: "cl 20.8(a)" },
    { name: "Meal allowance (overtime of more than one hour without 24 hours' notice)", amount: 24.72, unit: "per occasion", clause: "cl 20.5(a)", note: "A further $24.72 where the overtime exceeds 4 hours (cl 20.5(b))." },
    { name: "Motor vehicle allowance", amount: 1.0, unit: "per km", clause: "cl 20.6" },
    { name: "Broken Hill allowance", amount: 47.9, unit: "per week", clause: "cl 20.4" },
  ],
  allowancesClause: "cl 20",
  hoursNotes: [
    "Casuals must be engaged for at least 3 consecutive hours (cl 11.5).",
    "No more than 9 ordinary hours a day, except that one day a week can be 10.5 hours — two by written agreement (cl 14.7 to 14.9).",
  ],
  unverified: [
    "Apprentice, pre-apprentice, trainee and graduate rates (cl 18, Tables 6 to 12)",
    "Classification definitions for Levels 1 to 6 (Schedule A) — we publish the rate for each level but not the duties that place an employee at that level",
    "National Training Wage (Schedule E of the Miscellaneous Award) trainee rates",
  ],
};

// -----------------------------------------------------------------------------
// Cleaning Services Award 2020 (MA000022)
// Consolidated to 1 July 2026 (PR799280, PR799303 and PR799460).
// -----------------------------------------------------------------------------

export const CLEANING_AWARD: ModernAwardData = {
  key: "cleaning",
  meta: {
    name: "Cleaning Services Award 2020",
    shortName: "Cleaning Award",
    code: "MA000022",
    href: "/cleaning-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799280, PR799303 and PR799460)",
    determination: "PR799303",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000022.html",
    summaryUrl: "https://www.fairwork.gov.au/employment-conditions/awards/awards-summary/ma000022-summary",
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 11.2",
    verifiedOn: VERIFIED_ON,
    partTimeLoading: 0.15,
    partTimeLoadingClause: "cl 10.2",
  },
  // cl 15.1, Table 2.
  rates: parse(`
Level 1|1028.90|27.08
Level 2|1062.90|27.97
Level 3|1119.10|29.45
`),
  ratesClause: "cl 15.1, Table 2",
  entryLevel: "Level 1",
  classificationNotes: [],
  matrix: [
    { label: "Day (Mon–Fri)", fullTime: 1, partTime: 1.15, casual: 1.25 },
    { label: "Early morning / afternoon / non-permanent night", fullTime: 1.15, partTime: 1.3, casual: 1.4 },
    { label: "Permanent night", fullTime: 1.3, partTime: 1.3, casual: 1.55 },
    { label: "Saturday", fullTime: 1.5, partTime: 1.65, casual: 1.75 },
    { label: "Sunday", fullTime: 2.0, partTime: 2.15, casual: 2.25 },
    { label: "Public holiday", fullTime: 2.5, partTime: 2.65, casual: 2.75 },
  ],
  // cl 20.2, Table 7 — three columns.
  penalties: [
    { label: "Monday to Friday shift starting before 6.00 am or finishing after 6.00 pm (whole shift)", fullTime: 1.15, partTime: 1.3, casual: 1.4 },
    { label: "Permanent night shift — finishes after midnight and by 8.00 am, and does not rotate with other shifts", fullTime: 1.3, partTime: 1.3, casual: 1.55 },
    { label: "Saturday (midnight Friday to midnight Saturday)", fullTime: 1.5, partTime: 1.65, casual: 1.75 },
    { label: "Sunday (midnight Saturday to midnight Sunday)", fullTime: 2.0, partTime: 2.15, casual: 2.25 },
    { label: "Public holiday", fullTime: 2.5, partTime: 2.65, casual: 2.75 },
  ],
  penaltiesClause: "cl 20.2, Table 7",
  penaltyNotes: [
    "Part-time employees are paid a 15% allowance on every ordinary hour (cl 10.2), and Table 7's part-time column already includes it. In exchange a part-timer can be rostered up to 7.6 hours a day, 5 days a week without overtime.",
    "The award's own worked example: a part-time Level 1 cleaner working 6.00 pm to 11.00 pm on a Friday, Saturday and Sunday is paid $35.20, $44.68 and $58.22 an hour — $690.50 for the three shifts (cl 20, Example 1).",
  ],
  // cl 19.3, Table 5. The part-time allowance is not added to overtime.
  overtime: [
    { label: "Monday to Saturday — first 2 hours", fullTime: 1.5, casual: 1.75 },
    { label: "Monday to Saturday — after 2 hours", fullTime: 2.0, casual: 2.25 },
    { label: "Sunday — all day", fullTime: 2.0, casual: 2.25 },
    { label: "Public holiday — all day", fullTime: 2.5, casual: 2.75 },
  ],
  overtimeClause: "cl 19.3, Table 5",
  overtimeNotes: [
    "Full-time and part-time employees share one overtime column; casual overtime includes the loading. For part-time and casual cleaners, everything over 7.6 hours a day, 5 days a week or 38 hours a week is overtime (cl 19.2(b)).",
    "A cleaner called back after leaving work is paid for at least 2 hours at the overtime rate (cl 19.6).",
  ],
  casualPenaltyBasis: "additive",
  // cl 15.2, Table 3 — shopping trolley collection contractors only.
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
    clause: "cl 15.2, Table 3",
    appliesTo: "employees of shopping trolley collection contractors only — every other cleaner is paid the adult rate at any age",
    adultAge: 21,
  },
  juniorPhaseIn: null,
  // cl 17.
  allowances: [
    { name: "Broken shift allowance", amount: 4.71, unit: "per day", clause: "cl 17.2(b)", note: "Up to $23.56 a week (cl 17.2(c))." },
    { name: "Leading hand — in charge of up to 10 employees", amount: 61.73, unit: "per week", clause: "cl 17.7, Table 4" },
    { name: "Leading hand — in charge of 11 to 20 employees", amount: 79.43, unit: "per week", clause: "cl 17.7, Table 4" },
    { name: "Leading hand — in charge of more than 20 employees", amount: 97.13, unit: "per week", clause: "cl 17.7, Table 4" },
    { name: "Toilet cleaning allowance (major portion of the shift)", amount: 3.69, unit: "per shift", clause: "cl 17.9", note: "Or $18.17 a week." },
    { name: "Refuse collection allowance", amount: 4.69, unit: "per shift", clause: "cl 17.8(b)" },
    { name: "First aid allowance", amount: 16.87, unit: "per week", clause: "cl 17.6(b)" },
    { name: "Height allowance — up to and including the 22nd floor", amount: 1.11, unit: "per hour", clause: "cl 17.5(b)(i)", note: "$2.27 an hour above the 22nd floor (cl 17.5(b)(ii))." },
    { name: "Cold work allowance (below 0°C for more than an hour)", amount: 0.69, unit: "per hour", clause: "cl 17.3(a)" },
    { name: "Hot work allowance (46°C to 54°C)", amount: 0.69, unit: "per hour", clause: "cl 17.4(a)", note: "$0.83 an hour above 54°C (cl 17.4(b))." },
    { name: "Meal allowance (2 hours or more extra without notice the previous day)", amount: 17.53, unit: "per occasion", clause: "cl 17.10(b)(i)" },
    { name: "Vehicle allowance — motor car", amount: 1.01, unit: "per km", clause: "cl 17.11(a)", note: "$0.34 per km for a motorcycle (cl 17.11(b))." },
  ],
  allowancesClause: "cl 17",
  hoursNotes: [
    "Minimum shift for part-time and casual cleaners depends on the size of the site: 1 hour for a lone cleaner at a stand-alone site of up to 300 square metres, 2 hours up to 2,000 square metres, 3 hours from 2,000 to 5,000, and 4 hours at 5,000 square metres or more (cl 13.5(c)).",
    "Every employee is entitled to 2 consecutive full days off in each 7 days (cl 13.7).",
  ],
  unverified: [
    "Classification definitions for Levels 1 to 3 (Schedule A) — we publish the rate for each level but not the duties that place a cleaner at that level",
    "National Training Wage (Schedule E of the Miscellaneous Award) trainee rates",
  ],
};

// -----------------------------------------------------------------------------
// Road Transport and Distribution Award 2020 (MA000038)
// Consolidated to 1 July 2026 (PR799280, PR799318 and PR799475).
// Oil distribution workers (cl 17.2) work a 35-hour week and have their own
// hourly rates; they are not in this table.
// -----------------------------------------------------------------------------

const ROAD_TRANSPORT_RATES = parse(`
Transport Worker Grade 1|1021.00|26.87
Transport Worker Grade 2|1045.50|27.51
Transport Worker Grade 3|1057.60|27.83
Transport Worker Grade 4|1076.20|28.32
Transport Worker Grade 5|1089.60|28.67
Transport Worker Grade 6|1102.00|29.00
Transport Worker Grade 7|1118.00|29.42
Transport Worker Grade 8|1150.50|30.28
Transport Worker Grade 9|1169.70|30.78
Transport Worker Grade 10|1198.80|31.55
Distribution facility employee level 1|1057.60|27.83
Distribution facility employee level 2|1076.20|28.32
Distribution facility employee level 3|1118.00|29.42
Distribution facility employee level 4|1169.70|30.78
`);

export const ROAD_TRANSPORT_AWARD: ModernAwardData = {
  key: "road-transport",
  meta: {
    name: "Road Transport and Distribution Award 2020",
    shortName: "Road Transport Award",
    code: "MA000038",
    href: "/road-transport-award-rates/",
    operativeFrom: OPERATIVE,
    effectiveNote: EFFECTIVE_NOTE,
    consolidatedTo: "1 July 2026 (PR799280, PR799318 and PR799475)",
    determination: "PR799318",
    awardTextUrl: "https://awards.fairwork.gov.au/MA000038.html",
    summaryUrl: "https://www.fairwork.gov.au/employment-conditions/awards/awards-summary/ma000038-summary",
    casualLoading: 0.25,
    standardWeeklyHours: 38,
    casualLoadingClause: "cl 11.2",
    verifiedOn: VERIFIED_ON,
  },
  // cl 17.1(a) transport employees, 17.1(b) distribution facility employees.
  rates: ROAD_TRANSPORT_RATES,
  ratesClause: "cl 17.1",
  entryLevel: "Transport Worker Grade 1",
  // Schedule B, abridged.
  classificationNotes: [
    { level: "Grade 1", description: "General hand (greaser and cleaner, yardperson, vehicle washer, driver's or furniture remover's assistant), loader other than freight forwarder, foot or bicycle courier." },
    { level: "Grade 2", description: "Driver of a rigid vehicle (including a motorcycle) up to 4.5 tonnes GVM; tow motor driver; freight forwarder loader." },
    { level: "Grade 3", description: "Forklift driver up to 5 tonnes; driver of a two-axle rigid vehicle over 4.5 and up to 13.9 tonnes GVM; concrete mixer up to 2 cubic metres." },
    { level: "Grade 4", description: "Driver of a three-axle rigid vehicle over 13.9 tonnes GVM; forklift over 5 and up to 10 tonnes; weighbridge attendant; crane chaser/dogger." },
    { level: "Grade 5", description: "Driver of a rigid vehicle with 4 or more axles over 13.9 tonnes GVM, or an articulated vehicle or rigid-and-trailer combination with three axles up to 22.4 tonnes GCM; forklift over 10 and up to 34 tonnes." },
    { level: "Grade 6", description: "Driver of an articulated vehicle (semi-trailer) or rigid-and-trailer combination with more than three axles over 22.4 tonnes GCM; low loader up to 43 tonnes; mobile crane up to 25 tonnes; transport rigger." },
    { level: "Grade 7", description: "Driver of a double articulated vehicle, including B-doubles, up to 53.4 tonnes GCM; low loader over 43 tonnes." },
    { level: "Grade 8", description: "Driver of a double articulated vehicle or rigid vehicle and trailers over 53.4 tonnes GCM, including B-doubles; mobile crane over 25 and up to 50 tonnes." },
    { level: "Grades 9 and 10", description: "Combinations over 94 tonnes GCM, mobile cranes over 50 tonnes and gantry cranes (Grade 9); multi-axle platform trailing equipment over 70 tonnes (Grade 10)." },
    { level: "Distribution facility employees", description: "Levels 1 to 4 are paid the same as Transport Worker Grades 3, 4, 7 and 9 (Schedule B)." },
  ],
  matrix: [
    { label: "Ordinary hours", fullTime: 1, casual: 1.25 },
    { label: "Afternoon shift", fullTime: 1.175, casual: 1.425 },
    { label: "Night shift", fullTime: 1.3, casual: 1.55 },
    { label: "Saturday", fullTime: 1.5, casual: 1.75 },
    { label: "Sunday", fullTime: 2.0, casual: 2.25 },
  ],
  // cl 22 (shiftworkers), 23 (weekends and public holidays), Schedule C.
  penalties: [
    { label: "Afternoon shift — finishing after 6.30 pm and by 12.30 am (shiftworkers)", fullTime: 1.175, casual: 1.425 },
    { label: "Night shift — finishing after 12.30 am and by 8.30 am (shiftworkers)", fullTime: 1.3, casual: 1.55 },
    { label: "Non-continuous afternoon or night shift — first 3 hours", fullTime: 1.5, casual: 1.75 },
    { label: "Non-continuous afternoon or night shift — after 3 hours", fullTime: 2.0, casual: 2.25 },
    { label: "Saturday", fullTime: 1.5, casual: 1.75 },
    { label: "Sunday", fullTime: 2.0, casual: 2.25 },
    { label: "Public holiday — shiftworkers", fullTime: 2.5, casual: 2.75 },
    {
      label: "Public holiday — day workers (other than Good Friday and Christmas Day)",
      fullTime: 1.5,
      casual: 2.75,
      casualTabulated: true,
      note: "For full-time and part-time day workers the 150% is paid in addition to the weekly wage (cl 23.2(b)) — effectively 250% for the hours worked. Casuals get 250% plus the 25% loading (cl 23.2(e)).",
    },
    {
      label: "Public holiday — day workers, Good Friday and Christmas Day",
      fullTime: 2.0,
      casual: 3.25,
      casualTabulated: true,
      note: "Again paid in addition to the weekly wage for full-time and part-time day workers. Casuals get 300% plus the 25% loading.",
    },
  ],
  penaltiesClause: "cl 22.3, 22.8, 22.10, 23 and Schedule C",
  penaltyNotes: [
    "Day workers' ordinary hours are Monday to Friday between 5.30 am and 6.30 pm; ordinary hours on a weekend need an agreement (cl 13.4, 13.6). Anyone required to work on a Saturday or Sunday is paid for at least 4 hours (cl 23.1(c)).",
    "For shiftworkers, Saturday, Sunday and public holiday rates replace the shift rate (cl 22.8(b)). An afternoon or night shift roster that does not run for at least 5 consecutive shifts is paid at 150% for 3 hours and 200% after that (cl 22.10).",
    "Newspaper, meat, live poultry and fish, fruit or vegetable store drivers starting ordinary hours between 12.01 am and 6.00 am on a weekday are paid 130% (casuals 155%) for those hours (Schedule C.2.1 and C.4.1).",
  ],
  // cl 21.1 and 11.4; Schedule C.3.1 and C.5.1.
  overtime: [
    { label: "Overtime — first 2 hours", fullTime: 1.5, casual: 1.6 },
    { label: "Overtime — after 2 hours", fullTime: 2.0, casual: 2.1 },
    { label: "Public holiday overtime (other than Good Friday and Christmas Day)", fullTime: 2.5, casual: null },
    { label: "Good Friday and Christmas Day overtime", fullTime: 3.0, casual: null },
  ],
  overtimeClause: "cl 21.1, 11.4 and Schedule C",
  overtimeNotes: [
    "A casual on overtime does not get the 25% casual loading. Instead they get the overtime rate plus 10% of the minimum hourly rate — 160% and 210% (cl 11.4 and its example).",
    "Each day's overtime stands alone (cl 21.2), and an employee called back after leaving work is paid for at least 4 hours (cl 21.6).",
  ],
  casualPenaltyBasis: "additive",
  // cl 17.3 — a percentage of the adult HOURLY rate.
  junior: {
    scale: [
      { age: "Under 19", percentage: 0.7 },
      { age: "19", percentage: 0.8 },
      { age: "20 and over", percentage: 1 },
    ],
    clause: "cl 17.3(a)",
    appliesTo: "every classification, except that a junior aged 18 or over who drives a vehicle in sole charge must be paid the adult rate for that class of driving (cl 17.3(b))",
    adultAge: 20,
    basis: "hourly",
  },
  juniorPhaseIn: null,
  // cl 19.
  allowances: [
    { name: "Leading hand — in charge of 3 to 10 employees", amount: 49.92, unit: "per week", clause: "cl 19.3(c)" },
    { name: "Leading hand — in charge of 11 to 20 employees", amount: 74.35, unit: "per week", clause: "cl 19.3(c)" },
    { name: "Leading hand — in charge of more than 20 employees", amount: 94.44, unit: "per week", clause: "cl 19.3(c)" },
    { name: "Driving an over-length or over-width vehicle, or one with a truck loading or side-lifter crane", amount: 4.86, unit: "per day", clause: "cl 19.3(d)(i)–(iv)" },
    { name: "Bulk dangerous goods or explosives by public road", amount: 25.07, unit: "per day", clause: "cl 19.3(f)(i)" },
    { name: "Packaged dangerous goods requiring placards", amount: 10.47, unit: "per day", clause: "cl 19.3(f)(ii)" },
    { name: "First aid allowance", amount: 16.92, unit: "per week", clause: "cl 19.3(g)" },
    { name: "Travelling allowance (unable to return home at night)", amount: 41.03, unit: "per day", clause: "cl 19.5(a)", note: "At least this amount for personal expenses reasonably incurred." },
    { name: "Meal allowance (overtime of 2 continuous hours or more)", amount: 21.15, unit: "per meal", clause: "cl 19.5(f)(i)", note: "Also payable when starting 2 hours or more before the normal start time (cl 19.5(f)(ii))." },
    { name: "Dirty material allowance", amount: 0.63, unit: "per hour", clause: "cl 19.3(d)(xii)" },
  ],
  allowancesClause: "cl 19",
  hoursNotes: [
    "Casuals are paid for at least 4 hours each engagement (cl 11.3).",
    "Ordinary hours are at most 8 a day, worked continuously except for meal and fatigue breaks (cl 13.5), between 5.30 am and 6.30 pm — movable by an hour at each end by agreement (cl 13.6).",
  ],
  unverified: [
    "Oil distribution workers (cl 14 and 17.2), whose 35-hour week gives different hourly rates for the same weekly wage",
    "Casual overtime on public holidays",
    "Special vehicle all-purpose allowances (cl 19.3(b)), money-handling allowances (cl 19.3(e)) and the other miscellaneous allowances in cl 19.3(d)",
    "National Training Wage (Schedule E of the Miscellaneous Award) trainee rates",
  ],
};

export const MODERN_AWARDS = {
  "fast-food": FAST_FOOD_AWARD,
  pharmacy: PHARMACY_AWARD,
  manufacturing: MANUFACTURING_AWARD,
  security: SECURITY_AWARD,
  clerks: CLERKS_AWARD,
  // --- T4 awards batch 3 (23 Sep 2026) ---
  restaurant: RESTAURANT_AWARD,
  nurses: NURSES_AWARD,
  "aged-care": AGED_CARE_AWARD,
  "hair-and-beauty": HAIR_BEAUTY_AWARD,
  cleaning: CLEANING_AWARD,
  "road-transport": ROAD_TRANSPORT_AWARD,
  // --- end T4 ---
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
  /** Rates today (before 1 Dec 2026) for employees with MORE than 6 months. */
  present: { age18: number; age19: number; age20: number };
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
    present: { age18: 70, age19: 80, age20: 90 },
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
    // Retail 20-year-olds with more than 6 months already receive 100%.
    present: { age18: 70, age19: 80, age20: 100 },
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
    present: { age18: 70, age19: 80, age20: 90 },
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

/** Round half up to a step such as $0.10 (Restaurant cl 18.2(c): 5 cents or more rounds up). */
export function roundToStep(value: number, step: number): number {
  const units = Math.round(Number((value / step).toFixed(6)));
  return Number((units * step).toFixed(2));
}

/**
 * Junior hourly rate for one classification, following the award's own
 * method: a percentage of the weekly rate (rounded where the award says so)
 * divided by the standard hours, or — where the award says so in terms — a
 * percentage of the hourly rate.
 */
export function juniorHourlyFor(award: ModernAwardData, adult: AwardRate, percentage: number): number {
  const j = award.junior;
  if (j?.basis === "hourly") return roundCents(adult.hourly * percentage);
  const weekly = j?.weeklyRoundTo ? roundToStep(adult.weekly * percentage, j.weeklyRoundTo) : adult.weekly * percentage;
  return roundCents(weekly / award.meta.standardWeeklyHours);
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
