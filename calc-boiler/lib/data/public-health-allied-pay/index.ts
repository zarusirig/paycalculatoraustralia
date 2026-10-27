// =============================================================================
// Public hospital pay by state — registry and derived figures.
//
// The job pages (/job-pay-rates/pharmacist/ and the allied health pages) read
// their "public hospital pay by state" tables and answer-box figures from
// here, so the box can only ever quote a figure the table below it prints.
//
// Derived figures are limited to two, and the page labels both:
//   - a yearly figure from a weekly rate: weekly x 52, rounded to the dollar
//     (the same rule as annualFromWeekly in lib/data/job-pay-rates);
//   - a fortnightly figure from a weekly rate: weekly x 2.
// An annual-only scale never gets a fortnightly gross figure: the instrument
// does not set one. Take-home pay comes from the site's tax engine on the page.
// =============================================================================

import { NSW_PUBLIC_HEALTH_PAY } from "./nsw";
import { QLD_PUBLIC_HEALTH_PAY } from "./qld";
import { SA_PUBLIC_HEALTH_PAY } from "./sa";
import { VIC_PUBLIC_HEALTH_PAY } from "./vic";
import { WA_PUBLIC_HEALTH_PAY } from "./wa";
import type {
  AlliedProfession,
  NotVerified,
  PublicPayInstrument,
  PublicPayScale,
  PublicPaySource,
  PublicPayStep,
  StatePublicHealthPay,
} from "./types";

export * from "./types";

/** Every verified state, in the order the pages list them. */
export const PUBLIC_HEALTH_PAY: readonly StatePublicHealthPay[] = [
  NSW_PUBLIC_HEALTH_PAY,
  VIC_PUBLIC_HEALTH_PAY,
  QLD_PUBLIC_HEALTH_PAY,
  WA_PUBLIC_HEALTH_PAY,
  SA_PUBLIC_HEALTH_PAY,
];

/** The date every table was read from its source. */
export const PUBLIC_HEALTH_PAY_VERIFIED_ON = "23 October 2026";

/** States and professions we did not publish, and why. Shown on the pages. */
export const NOT_VERIFIED: readonly NotVerified[] = [
  {
    state: "NSW",
    profession: "sonographer",
    reason:
      "Sonographer is not a classification in either NSW Health award we read (medical radiation scientists, and health professionals), so NSW public hospital sonographer pay is not shown until its source is confirmed.",
  },
  {
    state: "Tasmania, the ACT and the Northern Territory",
    profession: "all",
    reason: "Their public hospital pay scales have not been checked yet and will be added once they are read from the source.",
  },
];

/** Full-time yearly pay for a step: the published annual salary, else weekly x 52 to the dollar. */
export function annualOf(step: PublicPayStep): number {
  if (typeof step.annual === "number") return step.annual;
  if (typeof step.weekly === "number") return Math.round(step.weekly * 52);
  throw new Error(`annualOf: step "${step.label}" has no annual or weekly figure`);
}

/** True when the yearly figure is the instrument's own, not weekly x 52. */
export function annualIsPublished(step: PublicPayStep): boolean {
  return typeof step.annual === "number";
}

/**
 * Gross fortnightly pay: the published fortnightly rate, else weekly x 2 to
 * the cent. Null for a scale that publishes an annual salary only.
 */
export function fortnightlyOf(step: PublicPayStep): number | null {
  if (typeof step.fortnightly === "number") return step.fortnightly;
  if (typeof step.weekly === "number") return Math.round(step.weekly * 2 * 100) / 100;
  return null;
}

/** A step by label. Throws, so a broken pointer fails the build and the tests. */
export function stepOf(scale: PublicPayScale, label: string): PublicPayStep {
  const step = scale.steps.find((s) => s.label === label);
  if (!step) throw new Error(`stepOf: ${scale.id} has no step "${label}"`);
  return step;
}

export function instrumentOf(state: StatePublicHealthPay, scale: PublicPayScale): PublicPayInstrument {
  const instrument = state.instruments.find((i) => i.id === scale.instrumentId);
  if (!instrument) throw new Error(`instrumentOf: ${scale.id} points at missing instrument ${scale.instrumentId}`);
  return instrument;
}

/** Anchor for a state's table on a profession page. One scale per state per profession (tested). */
export function stateAnchor(state: StatePublicHealthPay): string {
  return `public-hospital-${state.state}`;
}

export interface StateScaleForProfession {
  state: StatePublicHealthPay;
  scale: PublicPayScale;
  instrument: PublicPayInstrument;
  anchor: string;
  entry: PublicPayStep;
  entryAnnual: number;
  top: PublicPayStep;
  topAnnual: number;
}

/** The verified public hospital scale for a profession in each state, in state order. */
export function publicPayFor(profession: AlliedProfession): StateScaleForProfession[] {
  const out: StateScaleForProfession[] = [];
  for (const state of PUBLIC_HEALTH_PAY) {
    const scale = state.scales.find((s) => s.professions.includes(profession));
    if (!scale) continue;
    const entry = stepOf(scale, scale.entry);
    const top = stepOf(scale, scale.top);
    out.push({
      state,
      scale,
      instrument: instrumentOf(state, scale),
      anchor: stateAnchor(state),
      entry,
      entryAnnual: annualOf(entry),
      top,
      topAnnual: annualOf(top),
    });
  }
  return out;
}

/** The scale for one state and profession. Throws when it is not verified. */
export function publicPayIn(profession: AlliedProfession, code: string): StateScaleForProfession {
  const hit = publicPayFor(profession).find((r) => r.state.code === code);
  if (!hit) throw new Error(`publicPayIn: no verified ${code} scale for ${profession}`);
  return hit;
}

/** A named step's yearly pay in one state, for FAQ text. Throws if the step does not exist. */
export function publicAnnual(profession: AlliedProfession, code: string, label: string): number {
  return annualOf(stepOf(publicPayIn(profession, code).scale, label));
}

/** The lowest and highest "from" figures across the verified states. */
export function entryRange(profession: AlliedProfession): { low: StateScaleForProfession; high: StateScaleForProfession } {
  const rows = publicPayFor(profession);
  if (rows.length === 0) throw new Error(`entryRange: no verified scale for ${profession}`);
  let low = rows[0];
  let high = rows[0];
  for (const r of rows) {
    if (r.entryAnnual < low.entryAnnual) low = r;
    if (r.entryAnnual > high.entryAnnual) high = r;
  }
  return { low, high };
}

/** Every source behind a profession's tables, de-duplicated by URL. */
export function publicPaySources(profession: AlliedProfession): PublicPaySource[] {
  const all = publicPayFor(profession).flatMap((r) => [r.instrument.source, ...(r.instrument.extraSources ?? [])]);
  return all.filter((s, i) => all.findIndex((o) => o.url === s.url) === i);
}

/** The not-verified lines that apply to a profession. */
export function notVerifiedFor(profession: AlliedProfession): NotVerified[] {
  return NOT_VERIFIED.filter((n) => n.profession === "all" || n.profession === profession);
}
