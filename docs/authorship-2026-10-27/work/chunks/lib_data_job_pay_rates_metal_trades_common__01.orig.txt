// Shared by the boilermaker and welder pages (F4, 5 Oct 2026): both are trades
// graded under the Manufacturing and Associated Industries and Occupations
// Award 2020 [MA000010], whose rates, penalties, overtime and allowances live
// in lib/constants/modern-awards.ts (MANUFACTURING_AWARD) — the same data
// /manufacturing-award-rates/ renders, so the three pages cannot disagree.
//
// Award text re-read on 5 October 2026 (consolidated to 1 July 2026, PR799280,
// PR799291 and PR799448):
//   - cl 2 defines "boilermaker" as a tradesperson who develops work from
//     drawings or makes templates in the fabrication, erection and repair of
//     steel or iron ships, boilers and pressure vessels, including riveting,
//     caulking, chipping and incidental marking off, welding or oxy burning.
//   - Schedule A.4.7, wage group C10: an Engineering/Manufacturing Tradesperson
//     — Level I holds a trade certificate or tradespersons rights certificate
//     as an Engineering Tradesperson (Fabrication) Level I, among other streams.
//   - Schedule A.5.2 (C13) lists "basic soldering or butt and spot welding
//     skills" and A.5.3 (C12) lists "welding which requires the exercise of
//     knowledge and skills above level C13" as indicative tasks.
//   - Schedule B.6.3 (vehicle industry, Level V5) names Boilermaker and Welder.
//
// Median: Jobs and Skills Australia, ANZSCO 3223 Structural Steel and Welding
// Trades Workers (the unit group containing metal fabricators, pressure welders
// and first-class welders), $1,688 a week / $44 an hour (ABS SEEH May 2025),
// read 5 October 2026. JSA prints no separate median for boilermakers.

import { MANUFACTURING_AWARD } from "../../constants/modern-awards";
import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, jsaUrl, rowFromModernAward } from "./common";
import type { Allowance, MedianEarnings, PenaltyRow, RateRow } from "./types";

export const METAL_MEDIAN: MedianEarnings = {
  anzscoCode: "3223",
  anzscoTitle: "Structural Steel and Welding Trades Workers",
  medianWeekly: 1_688,
  medianHourly: 44,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("3223-structural-steel-and-welding-trades-workers"),
};

/** One manufacturing classification row with a plain-language label. */
export function metalRow(level: string, label: string, note: string): RateRow {
  return rowFromModernAward(MANUFACTURING_AWARD, level, label, note);
}

const pct = (x: number) => `${Math.round(x * 1000) / 10}%`;

/**
 * Manufacturing casual penalties compound: the percentage applies to the casual
 * ordinary hourly rate, which already carries the 25% loading (cl 11.1(d),
 * 32.1(f)). So a casual Saturday at 150% is 187.5% of the base rate.
 */
function compound(x: number): string {
  return pct(x * 1.25);
}

export const METAL_PENALTIES: PenaltyRow[] = [
  { when: "Monday–Friday, 6 am–6 pm (ordinary hours)", permanent: "100%", casual: "125%" },
  { when: "Saturday ordinary hours (only where agreed)", permanent: pct(1.5), casual: compound(1.5) },
  { when: "Sunday ordinary hours (only where agreed)", permanent: pct(2), casual: compound(2) },
  { when: "Public holiday (minimum 3 hours)", permanent: pct(2.5), casual: compound(2.5) },
  { when: "Afternoon or night shift", permanent: pct(1.15), casual: compound(1.15) },
  { when: "Permanent night shift", permanent: pct(1.3), casual: compound(1.3) },
];

export const METAL_PENALTIES_NOTE =
  "Percentages of the minimum hourly rate (cl 33). Day workers' ordinary hours are Monday to Friday, 6 am to 6 pm; Saturday or Sunday ordinary hours need agreement, and without it weekend work is overtime. For casuals this award compounds: each percentage applies to the casual hourly rate that already includes the 25% loading, so a casual Saturday at 150% is 187.5% of the base rate.";

export const METAL_OVERTIME: string[] = [
  "First 3 hours of overtime at 150% of the minimum hourly rate, then 200% (cl 32). Continuous shiftworkers are paid 200% for all overtime.",
  "Saturday overtime for day workers is 150% for the first 3 hours (minimum 4 hours), then 200%; Sunday overtime is 200% with a 3-hour minimum; public holiday overtime is 250%.",
  "For casuals, overtime is a percentage of the casual hourly rate (cl 32.1(f)). A call back after leaving work is paid for at least 4 hours at overtime rates (cl 32.13).",
];

function allowance(name: string): Allowance {
  const a = MANUFACTURING_AWARD.allowances.find((x) => x.name === name);
  if (!a) throw new Error(`metal-trades: no allowance ${name}`);
  return {
    name: a.name,
    amount: `$${a.amount.toFixed(2)} ${a.unit}`,
    note: `${a.note ? `${a.note} ` : ""}(${a.clause})`,
  };
}

export const METAL_ALLOWANCES: Allowance[] = [
  allowance("Tool allowance — tradesperson"),
  allowance("Leading hand — in charge of 3 to 10 employees"),
  allowance("Leading hand — in charge of 11 to 20 employees"),
  allowance("Confined spaces"),
  allowance("Dirty work"),
  allowance("First aid allowance"),
];

export const METAL_NOT_SHOWN: string[] = [
  "Apprentice and adult apprentice rates (cl 21–24).",
  "Height money, ship repair and the other special rates in cl 30.4 not listed above.",
  "Rates under the Building and Construction General On-site Award, the Mining Industry Award and enterprise agreements, which can apply instead of this award.",
  "Vehicle manufacturing employees under Part 9 of the award, who have their own loadings and allowances.",
];
