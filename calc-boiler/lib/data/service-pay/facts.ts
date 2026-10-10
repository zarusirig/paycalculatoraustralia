// State-page facts for the service-pay family (/police-pay/, /firefighter-pay/,
// /paramedic-pay/, /prison-officer-pay/). The state page leads with these, so
// each one is read straight off the jurisdiction file: a row whose field is
// empty is left out rather than filled with a generic line. Kept free of "@/"
// imports so the node:test build can compile it.

import type { ServicePayJurisdiction, ServicePayStep } from "./types";

export interface ServiceKeyFact {
  label: string;
  value: string;
  /** External link for the value (the instrument itself). */
  href?: string;
}

function step(j: ServicePayJurisdiction, label: string | undefined, fallback: "first" | "last"): ServicePayStep | null {
  const steps = j.scales[0]?.steps;
  if (!steps || steps.length === 0) return null;
  const named = label ? steps.find((s) => s.label === label) : undefined;
  return named ?? (fallback === "first" ? steps[0] : steps[steps.length - 1]);
}

/** The row the headline entry salary comes from (`entryStep`, else the first row of scales[0]). */
export function entryRow(j: ServicePayJurisdiction): ServicePayStep | null {
  return step(j, j.entryStep, "first");
}

/** The row the headline top salary comes from (`topStep`, else the last row of scales[0]). */
export function topRow(j: ServicePayJurisdiction): ServicePayStep | null {
  return step(j, j.topStep, "last");
}

/** Every published row, in table order. */
export function allRows(j: ServicePayJurisdiction): ServicePayStep[] {
  return j.scales.flatMap((s) => s.steps);
}

/**
 * The fact rows at the top of a state page. Only rows the jurisdiction's own
 * data supports are returned: no next-increase row when the instrument prints
 * none, no "what the salary includes" row when there is no hub note.
 */
export function serviceKeyFacts(j: ServicePayJurisdiction): ServiceKeyFact[] {
  const facts: ServiceKeyFact[] = [
    { label: "Pay instrument", value: j.agreementName, href: j.agreementUrl },
    { label: "Employer", value: j.employer },
  ];
  if (j.ratesEffectiveFrom) facts.push({ label: "Rates in force from", value: j.ratesEffectiveFrom });
  if (j.nextIncrease) facts.push({ label: "Next scheduled increase", value: j.nextIncrease.date });
  if (j.hubNote) facts.push({ label: "What the salary includes", value: j.hubNote });

  const rows = allRows(j);
  if (rows.length > 0) {
    const tables = j.scales.filter((s) => s.steps.length > 0).length;
    facts.push({
      label: "Classifications shown",
      value: `${rows[0].label} to ${rows[rows.length - 1].label} (${rows.length} rows in ${tables} ${tables === 1 ? "table" : "tables"})`,
    });
  }
  facts.push({ label: "Checked against the source", value: j.verifiedOn });
  return facts;
}
