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
import { annualFor, baseRegisteredScale, hourlyFor, registeredNurseRange, WEEKS_PER_YEAR } from "./index";
import type { NursingStateData } from "./types";

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

export function nursingStateFaqs(state: NursingStateData): NursingFaq[] {
  const range = registeredNurseRange(state);
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
        a: `${state.employer.split(" (")[0]} does not publish one. The pay scale is an annual salary with no hourly column, so this page does not print an hourly figure rather than publishing a number the source never set. The full-time week is ${state.ordinaryHoursPerWeek} hours.`,
      });
    }
  }

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
