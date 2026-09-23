// =============================================================================
// Public holiday pay rates for the 14 modern awards this site publishes, READ
// FROM the award constants — nothing here re-types a percentage.
//
//   - 11 awards in lib/constants/modern-awards.ts (their `penalties` rows)
//   - General Retail and Hospitality (lib/constants/hospitality-award.ts)
//   - SCHADS (lib/constants/schads-award.ts)
//
// Every figure is normalised to a MULTIPLE OF THE PERMANENT (non-casual)
// MINIMUM HOURLY RATE, so awards can be compared on one scale:
//
//   - "additive" awards print the casual column already including the 25%
//     loading as a % of the minimum rate (Retail 250%) — used as is.
//   - "compounded" awards print the casual figure as a % of the CASUAL hourly
//     rate (Manufacturing cl 32/33, Nurses cl 28.2) — multiplied by 1.25 here,
//     so Manufacturing's "250% of the casual rate" shows as 312.5%.
//   - `casualTabulated` rows are transcribed straight from the award table and
//     are already of the minimum rate (Hair and Beauty 250%, Road Transport).
// =============================================================================

import {
  MODERN_AWARDS,
  type ModernAwardData,
  type PenaltyRow,
} from "../../constants/modern-awards";
import {
  HOSPITALITY_AWARD,
  HOSPITALITY_PENALTIES,
  RETAIL_AWARD,
  RETAIL_PENALTIES,
} from "../../constants/hospitality-award";
import { SCHADS_AWARD, SCHADS_PENALTIES } from "../../constants/schads-award";

export interface AwardPublicHolidayRate {
  key: string;
  name: string;
  shortName: string;
  code: string;
  href: string;
  /** Multiple of the minimum hourly rate for hours worked, full-time and part-time. */
  permanent: number;
  /** Multiple of the (non-casual) minimum hourly rate, casual loading included. */
  casual: number;
  /** True where the award prints the casual figure as a % of the casual rate. */
  casualCompounded: boolean;
  /** The award's own casual figure, e.g. 2.5 of the casual rate (Manufacturing). */
  casualAsPrinted: number;
  /** Award clause, where the site's award constants record it. */
  clause?: string;
  /** The award row the figures come from. */
  rowLabel: string;
  note?: string;
}

const ROUND = (n: number) => Math.round(n * 10000) / 10000;

/**
 * Which penalty row is "the" public holiday rate. The default is the first row
 * whose label mentions a public holiday; two awards split the rate by type of
 * worker and are pinned to the row that covers most employees.
 */
const ROW_PICK: Record<string, (p: PenaltyRow) => boolean> = {
  // Manufacturing: day workers are the default employment; shiftworkers are the same %.
  manufacturing: (p) => /^Day worker — public holiday/.test(p.label),
  // Road Transport: shiftworker row is expressed as a plain %; day workers get the
  // same total by a different route (see NOTES).
  "road-transport": (p) => p.label === "Public holiday — shiftworkers",
};

const NOTES: Record<string, string> = {
  "fast-food": "Casuals 250% (the 225% plus the 25% loading).",
  restaurant:
    "By agreement a permanent employee can take 125% plus a day added to annual leave or a day off within 28 days instead (cl 24.4(d)). Minimum engagement 4 hours (permanent) or 2 hours (casual).",
  nurses:
    "Casual rate is 200% of the casual hourly rate (cl 28.2), which is 250% of the minimum rate. Christmas Day on a weekend attracts an extra 50% in 7-day businesses (cl 28.2(b)).",
  manufacturing:
    "Casual rate is 250% of the casual hourly rate (cl 33), which is 312.5% of the minimum rate. Minimum 3 hours for day workers.",
  "aged-care":
    "Permanent employees can elect each year to have the hours added to annual leave instead of the extra 150% (cl 29.2(b)).",
  "hair-and-beauty": "Casuals are paid 250% — the same as permanent staff. The 25% loading is not added (Table 15).",
  cleaning: "Part-time employees are paid 265% because their 15% part-time allowance applies too (cl 10.2).",
  "road-transport":
    "Day workers get 150% on top of the weekly wage for hours worked (effectively 250%), and 200% on top (300%) on Good Friday and Christmas Day; casual day workers 275% and 325% (cl 23.2).",
  clerks: "Paid for at least 4 hours when required to work a public holiday (cl 24.4(d)).",
};

function pickRow(award: ModernAwardData): PenaltyRow {
  const pick = ROW_PICK[award.key] ?? ((p: PenaltyRow) => /public holiday/i.test(p.label));
  const row = award.penalties.find(pick);
  if (!row) throw new Error(`public holiday rate: no public holiday row in ${award.key}`);
  return row;
}

function fromModernAward(award: ModernAwardData): AwardPublicHolidayRate {
  const row = pickRow(award);
  const basis = row.casualBasis ?? award.casualPenaltyBasis;
  const compounded = basis === "compounded" && !row.casualTabulated;
  const loading = award.meta.casualLoading;
  return {
    key: award.key,
    name: award.meta.name,
    shortName: award.meta.shortName,
    code: award.meta.code,
    href: award.meta.href,
    permanent: row.fullTime,
    casual: ROUND(compounded ? row.casual * (1 + loading) : row.casual),
    casualCompounded: compounded,
    casualAsPrinted: row.casual,
    clause: award.penaltiesClause,
    rowLabel: row.label,
    note: NOTES[award.key],
  };
}

const RETAIL: AwardPublicHolidayRate = {
  key: "retail",
  name: RETAIL_AWARD.name,
  shortName: "General Retail Award",
  code: RETAIL_AWARD.code,
  href: "/retail-award-rates/",
  permanent: RETAIL_PENALTIES.publicHoliday,
  casual: RETAIL_PENALTIES.casualPublicHoliday,
  casualCompounded: false,
  casualAsPrinted: RETAIL_PENALTIES.casualPublicHoliday,
  rowLabel: "Public holiday",
};

const HOSPITALITY: AwardPublicHolidayRate = {
  key: "hospitality",
  name: HOSPITALITY_AWARD.name,
  shortName: "Hospitality Award",
  code: HOSPITALITY_AWARD.code,
  href: "/hospitality-award-rates/",
  permanent: HOSPITALITY_PENALTIES.publicHoliday,
  casual: HOSPITALITY_PENALTIES.casualPublicHoliday,
  casualCompounded: false,
  casualAsPrinted: HOSPITALITY_PENALTIES.casualPublicHoliday,
  clause: "cl 29.2(b), Table 14",
  rowLabel: "Public holiday",
};

const SCHADS: AwardPublicHolidayRate = {
  key: "schads",
  name: SCHADS_AWARD.name,
  shortName: "SCHADS Award",
  code: SCHADS_AWARD.code,
  href: "/schads-award-pay-rates/",
  permanent: SCHADS_PENALTIES.publicHoliday,
  casual: SCHADS_PENALTIES.casualPublicHoliday,
  casualCompounded: false,
  casualAsPrinted: SCHADS_PENALTIES.casualPublicHoliday,
  clause: "cl 34.2",
  rowLabel: "Public holiday",
  note: `The award says "${SCHADS_AWARD.publicHolidayAwardWording}". Public holiday pay replaces weekend rates and shift loadings (cl 34.2(b)).`,
};

/** All 14 awards, A–Z by short name. */
export const PUBLIC_HOLIDAY_AWARD_RATES: readonly AwardPublicHolidayRate[] = [
  ...Object.values(MODERN_AWARDS).map(fromModernAward),
  RETAIL,
  HOSPITALITY,
  SCHADS,
].sort((a, b) => a.shortName.localeCompare(b.shortName, "en-AU"));

export function getAwardPublicHolidayRate(key: string): AwardPublicHolidayRate | undefined {
  return PUBLIC_HOLIDAY_AWARD_RATES.find((r) => r.key === key);
}

/** Lowest and highest permanent / casual public holiday multiples across the 14 awards. */
export function publicHolidayRateRange() {
  const perm = PUBLIC_HOLIDAY_AWARD_RATES.map((r) => r.permanent);
  const cas = PUBLIC_HOLIDAY_AWARD_RATES.map((r) => r.casual);
  return {
    permanentMin: Math.min(...perm),
    permanentMax: Math.max(...perm),
    casualMin: Math.min(...cas),
    casualMax: Math.max(...cas),
  };
}
