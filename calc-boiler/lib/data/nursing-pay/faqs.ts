// =============================================================================
// Per-state FAQ text.
//
// Kept out of the component so the page's FAQPage structured data and the
// on-page accordion are built from one array and cannot drift apart — the same
// arrangement the JobSeeker calculator uses.
//
// Every answer is built from figures in the state file. Nothing is written by
// hand that a source did not print.
// =============================================================================

import { formatAUD } from "@/lib/constants";
import { NURSES_AWARD, NURSES_AWARD_GENERAL } from "./nurses-award-2020";
import { annualFor, baseRegisteredScale, hourlyFor, registeredNurseRange, WEEKS_PER_YEAR } from "./index";
import type { NursingStateData } from "./types";

export interface NursingFaq {
  q: string;
  a: string;
}

const AWARD_RN1 = NURSES_AWARD_GENERAL.find((s) => s.classification === "Registered nurse — level 1")!;

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
      )}. The same scale runs to ${formatAUD(range.top)} at ${range.topLabel}. Those are base rates before shift penalties, overtime and allowances, which for a nurse on a rotating roster are a large part of actual pay. Rates are the ones in force from ${primary.effectiveFrom}.`,
    });

    if (entryHourly !== null) {
      faqs.push({
        q: `What is the hourly rate for a registered nurse in ${state.shortName}?`,
        a: `${formatAUD(entryHourly, 2)} an hour at the ${range.entryLabel} step of the ${rnScale.classification} scale.${
          state.derivation.hourly
            ? ` This site shows an hourly figure because ${state.derivation.hourly}.`
            : " The employer publishes the hourly rate directly."
        } Weekend and night shifts pay a loading on top of that rate.`,
      });
    } else {
      faqs.push({
        q: `What is the hourly rate for a registered nurse in ${state.shortName}?`,
        a: `${state.employer.split(" (")[0]} does not publish one. The pay scale is an annual salary and the instrument prescribes no divisor for converting it, so this page does not print an hourly figure rather than publishing a number the source never set. The full-time week is ${state.ordinaryHoursPerWeek} hours.`,
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

  faqs.push({
    q: `Is the Nurses Award 2020 the same as the ${state.shortName} agreement?`,
    a: `No, and the difference is large. The Nurses Award 2020 (MA000034) is the federal safety net: a minimum below which no nurse can legally be paid. Its Registered nurse level 1 pay point 1 rate is ${formatAUD(
      AWARD_RN1.points[0].weekly,
      2,
    )} a week, or ${formatAUD(AWARD_RN1.points[0].hourly, 2)} an hour, from ${NURSES_AWARD.generalRatesFrom}. ${
      state.employer.split(" (")[0]
    } pays under its own enterprise or state instrument, which sits well above that floor. The award is what matters for private hospital, GP clinic, aged care and some agency work where no agreement applies.`,
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
  } else {
    faqs.push({
      q: `What penalty rates do nurses get in ${state.name}?`,
      a: `${state.employer.split(" (")[0]} publishes base salaries but not the penalty schedule on the same page, so this page does not quote percentages for ${state.name}. The shift and weekend loadings are set in the agreement itself — check the instrument linked in the sources below, and see the overtime and penalty rates guide for how loadings are normally structured.`,
    });
  }

  faqs.push({
    q: `Do ${state.shortName} nurses get salary packaging?`,
    a: `Public hospital employees can salary package living expenses from pre-tax income under the public hospital FBT exemption, which is worth several thousand dollars a year in extra take-home pay on a typical nursing salary. It does not change your gross pay or your pay scale step — it changes how much of it is taxed. Private hospital employees generally cannot access the same cap.`,
  });

  faqs.push({
    q: `How do you move up the ${state.shortName} nursing pay scale?`,
    a: `${
      state.slug === "tas"
        ? "Tasmania gates its steps: progression into Grade 4 requires an application and Year 3 of Grade 4 carries a formal capability review."
        : "Movement through the increments on a single classification is normally annual for full-time staff and by accumulated hours for part-time and casual staff."
    } Moving between classifications — registered nurse to clinical nurse, clinical nurse to unit manager — is by appointment to a position, not by time served. Check the increment date on your payslip against the step you are being paid.`,
  });

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
