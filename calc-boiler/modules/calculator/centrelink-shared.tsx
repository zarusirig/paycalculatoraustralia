"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES } from "@/lib/constants";
import {
  CENTRELINK_SOURCES,
  DEFAULT_RATE_SET_KEY,
  MARCH_2026,
  RATE_SET_LABELS,
  SEPTEMBER_2026,
  rateSetKeyOnDate,
  ratesOnDate,
  type CentrelinkRateSet,
  type RateSetKey,
} from "@/lib/constants/centrelink-income-test";

export const H2 = "text-2xl font-semibold text-navy mb-4";
export const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
export const P = "text-warmgray mb-4";
export const LINK = "text-eucalyptus-dark hover:underline font-medium";
export const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
export const TH = "px-4 py-3 text-left font-semibold text-navy";
export const TD = "px-4 py-3 text-navy tabular-nums";
export const INPUT = "block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20";
export const LABEL = "block text-sm font-medium text-navy mb-1";

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// ---------------------------------------------------------------------------
// Which dated Centrelink rate set is in force RIGHT NOW.
//
// The site is a static export, so a date read while rendering is frozen at
// build time: a page built in August would still be paying March rates in
// October. The fix is to resolve the date in the browser, after mount.
//
// Hydration: useSyncExternalStore is given a SERVER snapshot that is a plain
// constant (DEFAULT_RATE_SET_KEY, derived from the file's verified date, never
// from the clock) and a CLIENT snapshot that reads the real date. React uses
// the server snapshot for the server HTML and for the hydration pass, so the
// two always match; immediately after hydrating it re-renders with the client
// snapshot. Before 20 September the two are the same string and nothing
// re-renders at all; after it, the page quietly moves to the new rates.
//
// getSnapshot returns a plain string, so React's identity check is a value
// comparison — no store, no subscription, no setState in an effect.
// ---------------------------------------------------------------------------

/** No live updates: the answer can only change between page loads. */
const subscribeToNothing = () => () => {};
const rateKeyNow = (): RateSetKey => rateSetKeyOnDate(new Date());
const rateKeyOnServer = (): RateSetKey => DEFAULT_RATE_SET_KEY;

/** The rate set key in force today, resolved in the browser after hydration. */
export function useCentrelinkRateKey(): RateSetKey {
  return useSyncExternalStore(subscribeToNothing, rateKeyNow, rateKeyOnServer);
}

/** The JobSeeker and Age Pension figures in force today. */
export function useCentrelinkRates(): CentrelinkRateSet {
  const key = useCentrelinkRateKey();
  return useMemo(() => ratesOnDate(key), [key]);
}

export const RATE_SET_ORDER: readonly RateSetKey[] = [MARCH_2026, SEPTEMBER_2026];
export { MARCH_2026, RATE_SET_LABELS, SEPTEMBER_2026 };

/** Column heading for a dated rate set: "To 19 Sep 2026" / "From 20 Sep 2026". */
export function rateColumnHeading(key: RateSetKey): string {
  return key === MARCH_2026 ? "To 19 Sep 2026" : "From 20 Sep 2026";
}

/**
 * The banner that tells the reader which set the calculator is applying, and
 * that the other set exists. Both dates stay on the page: someone checking a
 * payslip dated before 20 September needs the March figures either way.
 */
export function RateChangeNote({ activeKey, payment }: { activeKey: RateSetKey; payment: string }) {
  const beforeChange = activeKey === MARCH_2026;
  return (
    <div className="rounded-xl border border-ochre/40 bg-ochre/10 p-4 text-sm text-navy">
      {beforeChange ? (
        <>
          <strong>Rates change on 20 September 2026.</strong> This calculator is applying the{" "}
          {RATE_SET_LABELS[MARCH_2026]} rates, which are what {payment} pays until 19 September 2026. The{" "}
          {RATE_SET_LABELS[SEPTEMBER_2026]} figures are published (DSS rates list, {CENTRELINK_SOURCES.dssRatesListPublished})
          and shown alongside every rate below — the calculator switches to them by itself on 20 September.
        </>
      ) : (
        <>
          <strong>Showing the {RATE_SET_LABELS[SEPTEMBER_2026]} rates</strong>, which apply from 20 September 2026. The{" "}
          {RATE_SET_LABELS[MARCH_2026]} figures are kept alongside them below, because they are the rates paid on any
          payslip or Centrelink letter dated before 20 September 2026.
        </>
      )}
    </div>
  );
}

/** A "current figure, with the other dated figure beneath" table cell. */
export function DatedFigures({ values, activeKey, align = "right" }: { values: Record<RateSetKey, string>; activeKey: RateSetKey; align?: "left" | "right" }) {
  const other: RateSetKey = activeKey === MARCH_2026 ? SEPTEMBER_2026 : MARCH_2026;
  return (
    <span className={`block ${align === "right" ? "text-right" : ""}`}>
      <span className="font-medium">{values[activeKey]}</span>
      <span className="block text-xs text-warmgray-light">
        {other === SEPTEMBER_2026 ? "from 20 Sep" : "to 19 Sep"} {values[other]}
      </span>
    </span>
  );
}

export function source(title: string, url: string): SourceLink {
  return { title, url, publisher: SOURCES.servicesAustralia.name };
}

export function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center gap-4 ${highlight ? "bg-eucalyptus-light/40 -mx-2 px-2 py-1 rounded" : ""}`}>
      <span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span>
      <span className={`tabular-nums ${bold ? "font-bold text-navy" : "text-navy"}`}>{value}</span>
    </div>
  );
}

/** The scope statement every Centrelink calculator carries. */
export function NotIncluded({ items }: { items: string[] }) {
  return (
    <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-4 text-xs text-navy">
      <strong>Income test only.</strong> Not modelled: {items.join("; ")}. Services Australia pays the lower of the income and assets test results, so treat this as the income-test ceiling, not a quote. Figures verified at Services Australia and in the DSS 20 September 2026 rates list on {CENTRELINK_SOURCES.verifiedOn}.
    </div>
  );
}

export function CentrelinkRelated({ current }: { current: "jobseeker" | "student" | "pension" }) {
  const items = [
    { key: "hub", href: "/centrelink-income-test/", label: "Centrelink income test guide", blurb: "how the free area, taper and cut-off work for every payment" },
    { key: "jobseeker", href: "/jobseeker-payment-calculator/", label: "JobSeeker payment calculator", blurb: "what you keep when you work part-time" },
    { key: "student", href: "/austudy-youth-allowance-calculator/", label: "Austudy and Youth Allowance calculator", blurb: "the $539 free area and the 50c/60c bands" },
    { key: "pension", href: "/age-pension-income-test-calculator/", label: "Age Pension income test calculator", blurb: "with the Work Bonus applied" },
    { key: "th", href: "/take-home-pay-calculator/", label: "Take-home pay calculator", blurb: "tax on your wages and payment together" },
    { key: "fn", href: "/fortnightly-pay-calculator/", label: "Fortnightly pay calculator", blurb: "convert your wage to the fortnightly gross Centrelink asks for" },
  ].filter((i) => i.key !== current);
  return (
    <ul className="space-y-2 text-warmgray">
      {items.map((i) => (
        <li key={i.key}><Link href={i.href} className={LINK}>{i.label}</Link> &mdash; {i.blurb}</li>
      ))}
    </ul>
  );
}
