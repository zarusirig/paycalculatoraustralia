// =============================================================================
// Zone and Overseas Forces Tax Offset — 2025-26 income year
//
// Sources, all retrieved from ato.gov.au on 28 July 2026:
//   T4 Zone or overseas forces 2026  QC106871  (last updated 30 May 2026)
//   Zone tax offset                  QC105018  (last updated  8 June 2026)
//   T5 Invalid and invalid carer 2026 QC106872 (last updated 30 May 2026)
//
// YEAR NOTE. These amounts govern the 2025-26 income year — the return being
// lodged now. The ATO has not published FY2026-27 zone amounts and will not
// until the 2027 instructions. The amounts have been unchanged since FY2015-16
// but that continuity is NOT asserted here as verified. Do not relabel this
// file to 2026-27 without a published ATO source.
//
// STRUCTURAL NOTE. A special area REPLACES the Zone A/Zone B fixed amount —
// it is not added to it. See ATO table 3. The maximum offset with no
// dependants is $1,173, not $1,511.
// =============================================================================

/** The income year these amounts apply to. */
export const ZONE_OFFSET_INCOME_YEAR = "2025-26";

/** Days of residence in a zone required to claim in full. ATO: "183 days or more". */
export const ZONE_QUALIFYING_DAYS = 183;

/** Days in the 2025-26 income year, used for part-year apportionment. */
export const ZONE_DAYS_IN_YEAR = 365;

export type ZoneArea = "zoneA" | "zoneB" | "specialArea" | "overseasForces";

export interface ZoneAreaRate {
  /** Human label as the ATO writes it. */
  label: string;
  /** Fixed amount, ATO table 3. */
  fixedAmount: number;
  /** Share of the total base amount that is added, ATO table 3. */
  basePercentage: number;
}

/**
 * ATO table 3 — "Zone fixed amount and percentage of base amount".
 * Special area is its own row; it does not stack with Zone A or Zone B.
 */
export const ZONE_AREA_RATES: Readonly<Record<ZoneArea, ZoneAreaRate>> = {
  zoneA: { label: "Zone A", fixedAmount: 338, basePercentage: 0.5 },
  zoneB: { label: "Zone B", fixedAmount: 57, basePercentage: 0.2 },
  specialArea: { label: "Special area", fixedAmount: 1_173, basePercentage: 0.5 },
  overseasForces: { label: "Overseas forces", fixedAmount: 338, basePercentage: 0.5 },
} as const;

/** Order used when apportioning days: highest fixed amount first, per ATO guidance. */
export const ZONE_AREAS_BY_BENEFIT: readonly ZoneArea[] = [
  "specialArea",
  "zoneA",
  "overseasForces",
  "zoneB",
] as const;

/** ATO table 2 — dependant child or student base amounts. */
export const DEPENDANT_BASE_AMOUNTS = {
  /** Each full-time student under 25 on 30 June. */
  studentUnder25: 376,
  /** The oldest non-student child under 21 on 30 June. */
  oldestChildUnder21: 376,
  /** Every other non-student child under 21. */
  otherChildUnder21: 282,
} as const;

/** Sole parent base amount. Full-year figure and the part-year daily rate. */
export const SOLE_PARENT_BASE = {
  fullYear: 1_607,
  perDay: 4.4,
} as const;

/**
 * Invalid and invalid carer offset (ATO T5). Included here only so the UI can
 * bound the input — the offset itself is supplied by the user, exactly as ATO
 * worksheet 4 row f takes it from question T5 label B.
 */
export const INVALID_CARER_OFFSET = {
  fullYearMax: 3_396,
  perDay: 9.3,
} as const;

/**
 * Reduction of a dependant's base amount by their adjusted taxable income.
 * ATO: reduced by $1 for every $4 of ATI over $282; a full claim requires ATI
 * under $286.
 */
export const DEPENDANT_ATI = {
  reductionThreshold: 282,
  reductionDivisor: 4,
  fullClaimCeiling: 286,
} as const;

export interface ZonePlace {
  area: ZoneArea;
  /** Days the usual place of residence was in this area (or days served overseas). */
  days: number;
}

export interface ZoneOffsetInput {
  places: ZonePlace[];
  /** Full-time students under 25 on 30 June. */
  students?: number;
  /** Non-student children under 21 on 30 June. */
  otherChildren?: number;
  /** Days of sole care of a dependent child or student. 365 claims the full-year amount. */
  soleParentDays?: number;
  /** Amount claimed at ATO question T5 label B. */
  invalidCarerOffset?: number;
  /** Remote area allowance received from Centrelink or DVA. Reduces the offset. */
  remoteAreaAllowance?: number;
  /**
   * Total reduction to the dependant base amount because a dependant's ATI
   * exceeded $282. Defaults to 0 — the ATO's "simple circumstances" path.
   * Use reduceBaseAmountForATI() to work this out per dependant.
   */
  dependantBaseReduction?: number;
}

export interface ZonePlaceClaim {
  area: ZoneArea;
  /** Days actually claimed, after the 183-day cap is shared across places. */
  daysClaimed: number;
  claimable: number;
}

export interface ZoneOffsetResult {
  /** The offset, in dollars, never negative. */
  offset: number;
  /** 1 = single qualifying place (ATO worksheet 5). 2 = apportioned (worksheets 6-7). */
  category: 1 | 2;
  /** Fixed amount used. For category 2 this is the highest-benefit place's amount. */
  fixedAmount: number;
  /** Total base amount, ATO worksheet 4 row g. */
  totalBaseAmount: number;
  /** Percentage of base applied. For category 2, the highest-benefit place's. */
  basePercentage: number;
  /** Base amount contribution before apportionment. */
  baseContribution: number;
  perPlace: ZonePlaceClaim[];
  remoteAreaAllowanceApplied: number;
  /** True when no place had any days, or no place was supplied. */
  ineligible: boolean;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * ATO worksheet 2 — reduce a dependant's base amount because their adjusted
 * taxable income exceeded $282. Reduced by $1 for every $4 over, cents dropped.
 * Never returns less than zero.
 */
export function reduceBaseAmountForATI(baseAmount: number, ati: number): number {
  if (ati < DEPENDANT_ATI.fullClaimCeiling) return baseAmount;
  const excess = ati - DEPENDANT_ATI.reductionThreshold;
  const reduction = Math.floor(excess / DEPENDANT_ATI.reductionDivisor);
  return Math.max(0, baseAmount - reduction);
}

/**
 * ATO table 2 — total base amount for dependent children and students.
 * Each student under 25 attracts the student amount. Among non-student children
 * under 21, the oldest attracts the higher amount and the rest the lower one.
 */
export function calculateDependantBaseAmount(students: number, otherChildren: number): number {
  const s = Math.max(0, Math.floor(students));
  const c = Math.max(0, Math.floor(otherChildren));
  const studentTotal = s * DEPENDANT_BASE_AMOUNTS.studentUnder25;
  const childTotal =
    c === 0
      ? 0
      : DEPENDANT_BASE_AMOUNTS.oldestChildUnder21 +
        (c - 1) * DEPENDANT_BASE_AMOUNTS.otherChildUnder21;
  return studentTotal + childTotal;
}

/** ATO worksheet 3 — sole parent base amount, full year or apportioned by day. */
export function calculateSoleParentBase(days: number): number {
  const d = Math.max(0, Math.min(ZONE_DAYS_IN_YEAR, Math.floor(days)));
  if (d === 0) return 0;
  if (d >= ZONE_DAYS_IN_YEAR) return SOLE_PARENT_BASE.fullYear;
  return round2(d * SOLE_PARENT_BASE.perDay);
}

/**
 * Zone or overseas forces tax offset, per ATO T4 worksheets 4-7.
 *
 * Category 1 (worksheet 5) applies when one place had 183 days or more AND has
 * the highest fixed amount of the places supplied — the ATO's "Neil" example.
 * Otherwise category 2 (worksheets 6-7) apportions each place by days/183, with
 * the total days claimed capped at 183 and allocated highest-benefit first.
 */
export function calculateZoneTaxOffset(input: ZoneOffsetInput): ZoneOffsetResult {
  const {
    places,
    students = 0,
    otherChildren = 0,
    soleParentDays = 0,
    invalidCarerOffset = 0,
    remoteAreaAllowance = 0,
    dependantBaseReduction = 0,
  } = input;

  // ---- Worksheet 4: total base amount -------------------------------------
  const dependantBase = Math.max(
    0,
    calculateDependantBaseAmount(students, otherChildren) - Math.max(0, dependantBaseReduction),
  );
  const totalBaseAmount = round2(
    dependantBase + calculateSoleParentBase(soleParentDays) + Math.max(0, invalidCarerOffset),
  );

  const active = (places ?? [])
    .filter((p) => p && p.days > 0 && ZONE_AREA_RATES[p.area])
    .map((p) => ({ area: p.area, days: Math.floor(p.days) }));

  if (active.length === 0) {
    return {
      offset: 0,
      category: 1,
      fixedAmount: 0,
      totalBaseAmount,
      basePercentage: 0,
      baseContribution: 0,
      perPlace: [],
      remoteAreaAllowanceApplied: 0,
      ineligible: true,
    };
  }

  // Highest fixed amount first — the ATO says to start there for the greatest benefit.
  const ordered = [...active].sort(
    (a, b) => ZONE_AREA_RATES[b.area].fixedAmount - ZONE_AREA_RATES[a.area].fixedAmount,
  );
  const best = ordered[0];

  // ---- Category 1: one place qualifies on its own and is the best available -
  const qualifier = ordered.find((p) => p.days >= ZONE_QUALIFYING_DAYS);
  if (qualifier && ZONE_AREA_RATES[qualifier.area].fixedAmount === ZONE_AREA_RATES[best.area].fixedAmount) {
    const rate = ZONE_AREA_RATES[qualifier.area];
    const baseContribution = round2(totalBaseAmount * rate.basePercentage);
    const beforeAllowance = round2(rate.fixedAmount + baseContribution);
    const allowance = Math.max(0, Math.min(remoteAreaAllowance, beforeAllowance));
    return {
      offset: round2(Math.max(0, beforeAllowance - Math.max(0, remoteAreaAllowance))),
      category: 1,
      fixedAmount: rate.fixedAmount,
      totalBaseAmount,
      basePercentage: rate.basePercentage,
      baseContribution,
      perPlace: [{ area: qualifier.area, daysClaimed: qualifier.days, claimable: beforeAllowance }],
      remoteAreaAllowanceApplied: allowance,
      ineligible: false,
    };
  }

  // ---- Category 2: apportion days/183, capped at 183 total ------------------
  let daysRemaining = ZONE_QUALIFYING_DAYS;
  const perPlace: ZonePlaceClaim[] = [];
  let total = 0;

  for (const place of ordered) {
    if (daysRemaining <= 0) {
      perPlace.push({ area: place.area, daysClaimed: 0, claimable: 0 });
      continue;
    }
    const rate = ZONE_AREA_RATES[place.area];
    const daysClaimed = Math.min(place.days, daysRemaining);
    const full = rate.fixedAmount + totalBaseAmount * rate.basePercentage;
    const claimable = round2((full * daysClaimed) / ZONE_QUALIFYING_DAYS);
    perPlace.push({ area: place.area, daysClaimed, claimable });
    total += claimable;
    daysRemaining -= daysClaimed;
  }

  const beforeAllowance = round2(total);
  const allowance = Math.max(0, Math.min(remoteAreaAllowance, beforeAllowance));
  const bestRate = ZONE_AREA_RATES[best.area];

  return {
    offset: round2(Math.max(0, beforeAllowance - Math.max(0, remoteAreaAllowance))),
    category: 2,
    fixedAmount: bestRate.fixedAmount,
    totalBaseAmount,
    basePercentage: bestRate.basePercentage,
    baseContribution: round2(totalBaseAmount * bestRate.basePercentage),
    perPlace,
    remoteAreaAllowanceApplied: allowance,
    ineligible: false,
  };
}
