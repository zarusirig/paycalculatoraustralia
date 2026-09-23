// Shared blocks for the Clerks—Private Sector Award 2020 [MA000002] occupation
// pages (T5, wave 3): receptionist and bookkeeper.
//
// Every figure is READ FROM lib/constants/modern-awards.ts (CLERKS_AWARD), the
// data behind /clerks-award-rates/. Coverage (cl 4) and the Schedule A duty
// lists quoted on the pages were read from the consolidated award ("incorporates
// all amendments up to and including 1 July 2026") on 23 September 2026.

import { CLERKS_AWARD } from "../../constants/modern-awards";
import { awardTextUrl, CONSOLIDATED_TO, rowFromModernAward } from "./common";
import type { Allowance, AwardRef, PenaltyRow, RateRow } from "./types";

export const CLERKS_AWARD_REF: AwardRef = {
  name: CLERKS_AWARD.meta.name,
  code: CLERKS_AWARD.meta.code,
  url: awardTextUrl(CLERKS_AWARD.meta.code),
  consolidatedTo: CONSOLIDATED_TO,
  awardPageHref: CLERKS_AWARD.meta.href,
};

export const CLERKS_SOURCE_TITLE = "Clerks—Private Sector Award 2020 [MA000002] — consolidated to 1 July 2026";

export function clerksRow(level: string, note?: string): RateRow {
  return rowFromModernAward(CLERKS_AWARD, level, level, note);
}

const pct = (x: number) => `${Math.round(x * 1000) / 10}%`;

export const CLERKS_PENALTY_ROWS: PenaltyRow[] = CLERKS_AWARD.penalties.map((p) => ({
  when: p.label,
  permanent: pct(p.fullTime),
  casual: pct(p.casual),
}));

export const CLERKS_PENALTIES_NOTE = `Percentages of the minimum hourly rate (${CLERKS_AWARD.penaltiesClause}). Casual percentages include the 25% loading. ${CLERKS_AWARD.penaltyNotes[0]}`;

export const CLERKS_OVERTIME_LINES: string[] = [
  `Full-time and part-time: ${CLERKS_AWARD.overtime.map((o) => `${o.label.toLowerCase()} ${pct(o.fullTime)}`).join("; ")} (${CLERKS_AWARD.overtimeClause}).`,
  `Casual: ${CLERKS_AWARD.overtime.map((o) => `${o.label.toLowerCase()} ${pct(o.casual ?? o.fullTime)}`).join("; ")} — the casual loading is included.`,
  ...CLERKS_AWARD.overtimeNotes.slice(0, 1).map((n) => n.replace(/^Casual overtime includes the loading \(Table 5 NOTE 2\)\. /, "")),
];

export const CLERKS_ALLOWANCES: Allowance[] = CLERKS_AWARD.allowances
  .filter((a) => /First aid|Meal allowance \(|Vehicle allowance — motor car/.test(a.name))
  .map((a) => ({
    name: a.name,
    amount: `$${a.amount.toFixed(2)} ${a.unit}`,
    note: `${a.note ? `${a.note} ` : ""}(${a.clause})`,
  }));

export const CLERKS_COVERAGE_EXCLUSION =
  "The Clerks—Private Sector Award is an occupational award: it covers private sector employees wholly or principally engaged in clerical work, but not where the employer is covered by an industry award that has its own clerical classifications (cl 4.3(a)) — for example health practices (Health Professionals and Support Services Award), hotels (Hospitality Award) or aged care. Public sector clerical staff are paid under public service agreements.";
