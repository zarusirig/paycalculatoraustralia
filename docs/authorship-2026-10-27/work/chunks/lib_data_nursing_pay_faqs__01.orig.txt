// =============================================================================
// Per-state FAQ text.
//
// Kept out of the component so the page's FAQPage structured data and the
// on-page accordion are built from one array and cannot drift apart — the same
// arrangement the JobSeeker calculator uses.
//
// Every answer is built from figures in the state file. Nothing is written by
// hand that a source did not print. A question is asked only when its answer
// comes from this state's own data: rules that read the same in every state
// (the Nurses Award 2020 floor, salary packaging, how increments work) are on
// the /healthcare-worker-pay/ hub and the guides, not repeated per state.
// Relative imports so the node:test build can compile this file.
// =============================================================================

import { formatAUD } from "../../constants/australian-tax";
import {
  annualFor,
  annualIsPublished,
  baseRegisteredScale,
  fortnightlyFor,
  hourlyFor,
  keyGradeRows,
  registeredNurseLadder,
  WEEKS_PER_YEAR,
} from "./index";
import type { NursingStateData, PayPoint, UpcomingPayRow } from "./types";

export interface NursingFaq {
  q: string;
  a: string;
}

function moneyPhrase(state: NursingStateData, annual: number, hourly: number | null): string {
  const base = formatAUD(annual);
  const suffix = hourly !== null ? `, which the pay scale puts at ${formatAUD(hourly, 2)} an hour` : "";
  const derived = state.derivation.annual ? ` (${state.derivation.annual})` : "";
  return `${base}${derived}${suffix}`;
}

/**
 * "$87,790 a year ($44.28 an hour, $3,365.00 a fortnight)". Each unit is
 * printed only when the source publishes it or the state's derivation note
 * allows it; a derived annual figure says so.
 */
export function payPointPhrase(state: NursingStateData, point: PayPoint): string {
  const annual = annualFor(point);
  if (annual === null) return "no published rate";
  const parts: string[] = [];
  const hourly = hourlyFor(point, state);
  if (hourly !== null) parts.push(`${formatAUD(hourly, 2)} an hour`);
  const fortnightly = fortnightlyFor(point);
  if (fortnightly !== null) parts.push(`${formatAUD(fortnightly, 2)} a fortnight`);
  if (typeof point.weekly === "number") parts.push(`${formatAUD(point.weekly, 2)} a week`);
  const derived = annualIsPublished(point) ? "" : ", the weekly rate x 52";
  return `${formatAUD(annual)} a year${derived}${parts.length ? ` (${parts.join(", ")})` : ""}`;
}

/** Same phrase for a row of a future table the source has already printed. */
export function upcomingRowPhrase(row: UpcomingPayRow): string {
  const annual =
    typeof row.annual === "number"
      ? `${formatAUD(row.annual)} a year`
      : typeof row.weekly === "number"
        ? `${formatAUD(Math.round(row.weekly * WEEKS_PER_YEAR))} a year (weekly x 52)`
        : "";
  const parts: string[] = [];
  if (typeof row.weekly === "number") parts.push(`${formatAUD(row.weekly, 2)} a week`);
  if (typeof row.fortnightly === "number") parts.push(`${formatAUD(row.fortnightly, 2)} a fortnight`);
  if (typeof row.hourly === "number") parts.push(`${formatAUD(row.hourly, 2)} an hour`);
  return [annual, parts.join(", ")].filter(Boolean).join(", ");
}

export function nursingStateFaqs(state: NursingStateData): NursingFaq[] {
  const range = registeredNurseLadder(state);
  const rnScale = baseRegisteredScale(state);
  const primary = state.instruments[0];
  const faqs: NursingFaq[] = [];

  if (range && rnScale) {
    const entryPoint = rnScale.points.find((p) => annualFor(p) === range.entry);
    const entryHourly = entryPoint ? hourlyFor(entryPoint, state) : null;

    faqs.push({
      q: `How much does a registered nurse earn in ${state.name}?`,
      a: `Under the ${primary.name}, a ${rnScale.classification} on the ${range.entryLabel} step is paid ${moneyPhrase(
        state,
        range.entry,
        entryHourly,
      )}. The same scale runs to ${formatAUD(range.top)} at ${range.topLabel}. Rates are the ones in force from ${primary.effectiveFrom}.`,
    });

    if (entryHourly !== null) {
      faqs.push({
        q: `What is the hourly rate for a registered nurse in ${state.shortName}?`,
        a: `${formatAUD(entryHourly, 2)} an hour at the ${range.entryLabel} step of the ${rnScale.classification} scale.${
          state.derivation.hourly
            ? ` This site shows an hourly figure because ${state.derivation.hourly}.`
            : ` ${state.employer.split(" (")[0]} publishes the hourly rate directly.`
        }`,
      });
    } else {
      faqs.push({
        q: `What is the hourly rate for a registered nurse in ${state.shortName}?`,
        a: `The ${state.shortName} pay scale does not set one. It is an annual salary with no hourly column, so this page does not print an hourly figure rather than publishing a number the source never set. The full-time week is ${state.ordinaryHoursPerWeek} hours.`,
      });
    }
  }

  // Search-shaped questions from the answer box rows (23 Oct 2026, GSC queries).
  for (const row of keyGradeRows(state)) {
    if (!row.grade.question) continue;
    const single = row.low === row.high;
    const a = single
      ? `Under the ${primary.name}, the ${row.scale.classification} rate at ${row.low.label} is ${payPointPhrase(
          state,
          row.low,
        )}. That is the rate from ${primary.effectiveFrom}, before shift penalties.`
      : `Under the ${primary.name}, ${row.scale.classification} pay runs from ${payPointPhrase(state, row.low)} at ${
          row.low.label
        } to ${payPointPhrase(state, row.high)} at ${row.high.label}. Rates are from ${primary.effectiveFrom}.`;
    faqs.push({ q: row.grade.question, a });
  }

  if (state.midwifeNote && range) {
    faqs.push({
      q: `How much does a midwife earn in ${state.shortName}?`,
      a: `${state.midwifeNote} On the rates from ${primary.effectiveFrom}, that is ${formatAUD(range.entry)} a year at ${
        range.entryLabel
      } and ${formatAUD(range.top)} at ${range.topLabel}.`,
    });
  }

  const upcoming = state.upcoming ?? [];
  if (upcoming.length > 0 && upcoming[0].rows.length > 0) {
    const next = upcoming[0];
    const rows = next.rows.slice(0, 2).map((r) => `${r.label}: ${upcomingRowPhrase(r)}`);
    const later = upcoming.length > 1 ? ` A further rise follows on ${upcoming[1].effectiveFrom}.` : "";
    faqs.push({
      q: `When is the next nurse pay rise in ${state.shortName}?`,
      a: `The next published rates under the ${primary.name} start on ${next.effectiveFrom}. ${rows.join(". ")}.${later}`,
    });
  }

  for (const extra of state.sourceFaqs ?? []) faqs.push(extra);

  faqs.push({
    q: `Which award or agreement covers ${state.name} public hospital nurses?`,
    a: `The ${primary.name}, made through the ${primary.tribunal}${
      primary.reference ? ` (${primary.reference})` : ""
    }. The rates on this page are the ones effective from ${primary.effectiveFrom}${
      primary.nextIncrease ? `, with the next change due ${primary.nextIncrease}` : ""
    }.`,
  });

  if (state.penalties.length > 0) {
    const rows = state.penalties[0].rows;
    const summary = rows
      .slice(0, 4)
      .map((r) => `${r.label.toLowerCase()} ${r.value.toLowerCase()}`)
      .join("; ");
    faqs.push({
      q: `What penalty rates do nurses get in ${state.name}?`,
      a: `Under ${state.penalties[0].clause} of the instrument: ${summary}. ${
        state.penalties[0].incomplete ?? ""
      }`.trim(),
    });
  }

  // Only Tasmania's data sets a progression rule of its own (gated steps).
  if (state.slug === "tas") {
    faqs.push({
      q: `How do you move up the ${state.shortName} nursing pay scale?`,
      a: "Tasmania gates its steps: progression into Grade 4 requires an application and Year 3 of Grade 4 carries a formal capability review.",
    });
  }

  return faqs;
}

/**
 * Rough annual value of a full-time year at a given weekly rate, used in copy
 * where the source publishes weekly only. Exported so the component and the
 * FAQs use identical arithmetic.
 */
export function weeklyToAnnual(weekly: number): number {
  return Math.round(weekly * WEEKS_PER_YEAR);
}
