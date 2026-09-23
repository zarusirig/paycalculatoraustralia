"use client";

/**
 * Above-the-fold helpers shared by the head-term calculator pages
 * (/, /take-home-pay-calculator/, /income-tax-calculator/, /weekly-pay-calculator/,
 * /fortnightly-pay-calculator/, /gross-pay-calculator/, /annual-pay-calculator/).
 *
 * See docs/seo/2026-09-23-head-term-intent-map.md — each head term has exactly
 * one primary URL, and every other page in the cluster links to that primary
 * with the exact-match anchor listed in HEAD_TERM_PRIMARY.
 */

import Link from "next/link";
import { formatAUD } from "@/lib/constants";

import { HEAD_TERM_PRIMARY } from "./head-term-primary";

export { HEAD_TERM_PRIMARY };

export type HeadTermKey = keyof typeof HEAD_TERM_PRIMARY;

/**
 * A single compact line of exact-match links to the primary URLs of the
 * sibling head terms. Rendered directly under the calculator card so it never
 * pushes the calculator down.
 */
export function HeadTermLinks({ terms, className = "" }: { terms: readonly HeadTermKey[]; className?: string }) {
  return (
    <nav aria-label="Related pay and tax calculators" className={`text-sm text-warmgray ${className}`}>
      <span className="font-medium text-navy">Other calculators: </span>
      {terms.map((t, i) => {
        const { href, anchor } = HEAD_TERM_PRIMARY[t];
        return (
          <span key={t}>
            {i > 0 && <span className="text-warmgray-light"> · </span>}
            <Link href={href} className="text-eucalyptus-dark hover:underline">
              {anchor}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}

/** One-tap example amounts (wagecalculator / paycalculator pattern). */
export function AmountPresets({
  values,
  current,
  onPick,
  suffix = "",
  label = "Try",
}: {
  values: readonly number[];
  current: number;
  onPick: (v: number) => void;
  suffix?: string;
  label?: string;
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
      <span className="text-warmgray-light">{label}:</span>
      {values.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onPick(v)}
          aria-pressed={current === v}
          className={`rounded-full border px-2.5 py-1 font-medium transition-colors ${
            current === v
              ? "border-eucalyptus bg-eucalyptus-light/40 text-eucalyptus-dark"
              : "border-sandstone-dark/30 bg-white text-warmgray hover:bg-sandstone/60"
          }`}
        >
          {formatAUD(v)}
          {suffix}
        </button>
      ))}
    </div>
  );
}

export type EntryPeriod = "annual" | "monthly" | "fortnightly" | "weekly";

export const PERIODS_PER_YEAR: Record<EntryPeriod, number> = {
  annual: 1,
  monthly: 12,
  fortnightly: 26,
  weekly: 52,
};

/** "year" / "month" / "fortnight" / "week" — for "per …" copy. */
export const PERIOD_NOUN: Record<EntryPeriod, string> = {
  annual: "year",
  monthly: "month",
  fortnightly: "fortnight",
  weekly: "week",
};

const PERIOD_LABEL: Record<EntryPeriod, string> = {
  annual: "Annual",
  monthly: "Monthly",
  fortnightly: "Fortnightly",
  weekly: "Weekly",
};

/** Segmented control for which pay period the user is typing in. */
export function PeriodToggle({
  periods,
  value,
  onChange,
  label = "I'm entering my",
}: {
  periods: readonly EntryPeriod[];
  value: EntryPeriod;
  onChange: (p: EntryPeriod) => void;
  label?: string;
}) {
  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-navy">{label}</span>
      <div
        role="group"
        aria-label={label}
        className="grid gap-1 rounded-lg bg-sandstone p-1"
        style={{ gridTemplateColumns: `repeat(${periods.length}, minmax(0, 1fr))` }}
      >
        {periods.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-pressed={value === p}
            className={`rounded-md px-2 py-2 text-xs font-semibold transition-colors ${
              value === p ? "bg-navy text-white shadow" : "text-warmgray hover:text-navy"
            }`}
          >
            {PERIOD_LABEL[p]}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Convert an amount between entry periods, rounded to cents. */
export function convertPeriod(amount: number, from: EntryPeriod, to: EntryPeriod): number {
  return Math.round(((amount * PERIODS_PER_YEAR[from]) / PERIODS_PER_YEAR[to]) * 100) / 100;
}
