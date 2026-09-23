// Aviation pay registry (F5, 24 Sep 2026): /air-traffic-controller-salary/ and
// /pilot-salary/. See types.ts for the sourcing rule.

import type { AviationPageSlug, AviationPayPage } from "./types";
import { ATC_PAY } from "./air-traffic-controller";
import { PILOT_PAY } from "./pilot";

export const AVIATION_PAY: Readonly<Record<AviationPageSlug, AviationPayPage>> = {
  "air-traffic-controller": ATC_PAY,
  pilot: PILOT_PAY,
};

/** Public route for each aviation page (trailing-slashed). */
export const AVIATION_PATHS: Readonly<Record<AviationPageSlug, string>> = {
  "air-traffic-controller": "/air-traffic-controller-salary/",
  pilot: "/pilot-salary/",
};

function row(page: AviationPayPage, label: string | undefined, fallback: "first" | "last"): number | null {
  const steps = page.scales[0]?.steps;
  if (!steps || steps.length === 0) return null;
  const named = label ? steps.find((s) => s.label === label) : undefined;
  if (named) return named.salary;
  return fallback === "first" ? steps[0].salary : steps[steps.length - 1].salary;
}

export function aviationEntrySalary(page: AviationPayPage): number | null {
  return row(page, page.entryStep, "first");
}

export function aviationTopSalary(page: AviationPayPage): number | null {
  return row(page, page.topStep, "last");
}

export function aviationRatesYear(page: AviationPayPage): string {
  return page.verifiedOn.match(/\b(20\d{2})\b/)?.[1] ?? "";
}

export * from "./types";
