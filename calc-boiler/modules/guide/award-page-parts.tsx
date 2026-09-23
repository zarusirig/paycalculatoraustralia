"use client";

// Shared building blocks for the per-award rate pages: the pay-guide style
// level x employment-type matrix, allowances, the 1 December 2026 junior
// phase-in, calculator links and a print button.
//
// Every dollar figure is computed from constants and rounded half up to the
// cent with roundCents (float-safe), the way Fair Work publishes derived rates.

import Link from "next/link";
import { ChevronRight, Printer } from "lucide-react";
import { formatAUD } from "@/lib/constants";
import { roundCents, type JuniorPhaseInSchedule } from "@/lib/constants/modern-awards";
import { HOURLY_RATE_PAGES, hourlyRateSlug } from "@/lib/constants/hourly-rates";
import { AWARD_DIRECTORY } from "@/lib/constants/award-directory";

const pctLabel = (v: number) => {
  const p = Math.round(v * 1000) / 10;
  return `${p % 1 === 0 ? p.toFixed(0) : p.toFixed(1)}%`;
};

export interface MatrixRow {
  level: string;
  hourly: number;
}

export interface MatrixCol {
  label: string;
  fullTime: number;
  casual: number;
  appliesTo?: readonly string[];
}

/**
 * The FWO pay-guide layout: one row per classification, one column per time
 * band, in dollars. Rendered twice — permanent (full-time and part-time) and
 * casual — so a reader can find their own cell without doing arithmetic.
 *
 * basis "additive": casual cell = hourly x casual% (casual% includes loading).
 * basis "compounded": casual cell = round(hourly x 1.25) x casual%.
 */
export function PayGuideMatrix({
  rows,
  columns,
  employment,
  casualLoading,
  basis = "additive",
  caption,
  levelHeading = "Classification",
}: {
  rows: readonly MatrixRow[];
  columns: readonly MatrixCol[];
  employment: "permanent" | "casual";
  casualLoading: number;
  basis?: "additive" | "compounded";
  caption: string;
  levelHeading?: string;
}) {
  const cell = (r: MatrixRow, c: MatrixCol): number | null => {
    if (c.appliesTo && !c.appliesTo.includes(r.level)) return null;
    if (employment === "permanent") return roundCents(r.hourly * c.fullTime);
    if (basis === "compounded") return roundCents(roundCents(r.hourly * (1 + casualLoading)) * c.casual);
    return roundCents(r.hourly * c.casual);
  };
  return (
    <div className="not-prose my-6">
      <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
        <table className="w-full min-w-[40rem] text-left text-sm text-navy">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-sandstone font-semibold text-navy">
            <tr>
              <th scope="col" className="px-4 py-3">{levelHeading}</th>
              {columns.map((c) => (
                <th key={c.label} scope="col" className="px-4 py-3">
                  {c.label}
                  <span className="block text-xs font-normal text-warmgray">
                    {employment === "permanent" ? pctLabel(c.fullTime) : basis === "compounded" ? `${pctLabel(c.casual)} of casual rate` : pctLabel(c.casual)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {rows.map((r) => (
              <tr key={r.level}>
                <th scope="row" className="px-4 py-2.5 text-left font-medium">{r.level}</th>
                {columns.map((c) => {
                  const v = cell(r, c);
                  return (
                    <td key={c.label} className="px-4 py-2.5">
                      {v === null ? <span className="text-warmgray-light" aria-label="not applicable">&ndash;</span> : formatAUD(v, 2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export interface AllowanceRow {
  name: string;
  amount: number;
  unit: string;
  clause: string;
  note?: string;
}

export function AllowanceTable({ allowances, caption }: { allowances: readonly AllowanceRow[]; caption: string }) {
  return (
    <div className="not-prose my-6">
      <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
        <table className="w-full min-w-[34rem] text-left text-sm text-navy">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-sandstone font-semibold text-navy">
            <tr>
              <th scope="col" className="px-5 py-4">Allowance</th>
              <th scope="col" className="px-5 py-4">Amount</th>
              <th scope="col" className="px-5 py-4">Clause</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {allowances.map((a) => (
              <tr key={`${a.clause}-${a.name}`}>
                <th scope="row" className="px-5 py-3 text-left font-medium">
                  {a.name}
                  {a.note && <span className="mt-1 block text-xs font-normal text-warmgray">{a.note}</span>}
                </th>
                <td className="whitespace-nowrap px-5 py-3 font-medium">{formatAUD(a.amount, 2)} {a.unit}</td>
                <td className="whitespace-nowrap px-5 py-3 text-warmgray">{a.clause}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * The PR813654–PR813656 schedule: percentages for 18–20 year olds employed by
 * the employer for MORE than 6 months, with dollar figures on a base rate.
 */
export function JuniorPhaseInTable({
  schedule,
  adultWeekly,
  baseLabel,
  caption,
}: {
  schedule: JuniorPhaseInSchedule;
  adultWeekly: number;
  baseLabel: string;
  caption: string;
}) {
  const ages: { label: string; values: readonly number[]; now: number }[] = [
    { label: "18", values: schedule.age18, now: schedule.present.age18 },
    { label: "19", values: schedule.age19, now: schedule.present.age19 },
    { label: "20", values: schedule.age20, now: schedule.present.age20 },
  ];
  const hourlyAt = (pct: number) => roundCents((adultWeekly * pct) / 100 / 38);
  return (
    <div className="not-prose my-6">
      <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
        <table className="w-full min-w-[40rem] text-left text-sm text-navy">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-sandstone font-semibold text-navy">
            <tr>
              <th scope="col" className="px-4 py-3">Age (more than 6 months with the employer)</th>
              <th scope="col" className="px-4 py-3">Now</th>
              {schedule.periods.map((p) => (
                <th key={p} scope="col" className="px-4 py-3">{p}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {ages.map((a) => (
              <tr key={a.label}>
                <th scope="row" className="px-4 py-2.5 text-left font-medium">{a.label}</th>
                <td className="px-4 py-2.5">
                  {a.now}%<span className="block text-xs text-warmgray">{formatAUD(hourlyAt(a.now), 2)}</span>
                </td>
                {a.values.map((v, i) => (
                  <td key={`${a.label}-${schedule.periods[i]}`} className="px-4 py-2.5">
                    {v}%<span className="block text-xs text-warmgray">{formatAUD(hourlyAt(v), 2)}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-warmgray">
        Dollar figures are the hourly rate on {baseLabel} ({formatAUD(adultWeekly, 2)} a week at current rates), before any future Annual Wage Review increase. Employees aged 18–20 with 6 months or less with the employer stay on {schedule.qualifyingPeriod.age18}%, {schedule.qualifyingPeriod.age19}% and {schedule.qualifyingPeriod.age20}%. Source: determination {schedule.determination}.
      </p>
    </div>
  );
}

/**
 * Print button. Print styles hide site chrome so the rate tables print as a
 * clean pay guide — the page's answer to "... pay rates pdf" searches.
 */
export function PrintButton({ label = "Print or save as PDF" }: { label?: string }) {
  return (
    <>
      <style media="print">{`
        body > :not(main), main aside, main nav, .no-print { display: none !important; }
        body { background: #fff !important; }
        table { page-break-inside: auto; }
        tr { page-break-inside: avoid; }
        .overflow-x-auto { overflow: visible !important; }
      `}</style>
      <button
        type="button"
        onClick={() => window.print()}
        className="no-print inline-flex items-center gap-2 rounded-md border border-eucalyptus-dark px-4 py-2 text-sm font-semibold text-eucalyptus-dark hover:bg-eucalyptus-dark hover:text-white"
      >
        <Printer className="h-4 w-4" aria-hidden="true" />
        {label}
      </button>
    </>
  );
}

const HOURLY_PAGES = new Set(HOURLY_RATE_PAGES.map((r) => Math.round(r * 100)));

/** Link to /hourly-to-salary/{rate}/ when that page is generated, else null. */
export function hourlyPageHref(rate: number): string | null {
  return HOURLY_PAGES.has(Math.round(rate * 100)) ? `/hourly-to-salary/${hourlyRateSlug(rate)}/` : null;
}

/**
 * "What does this rate take home?" — links from each award rate to the
 * after-tax pages and calculators. Only links pages that exist.
 */
export function TakeHomeLinks({ rows, heading }: { rows: readonly MatrixRow[]; heading: string }) {
  const linked = rows
    .map((r) => ({ ...r, href: hourlyPageHref(r.hourly) }))
    .filter((r): r is MatrixRow & { href: string } => r.href !== null);
  return (
    <div className="not-prose my-6 rounded-xl border border-sandstone-dark/20 bg-sandstone p-5">
      <h3 className="mb-3 text-base font-bold text-navy">{heading}</h3>
      {linked.length > 0 && (
        <ul className="mb-4 grid gap-2 sm:grid-cols-2">
          {linked.map((r) => (
            <li key={r.level}>
              <Link href={r.href} className="group flex items-center justify-between rounded-lg border border-sandstone-dark/20 bg-white px-3 py-2 text-sm text-navy hover:border-eucalyptus/40">
                <span>
                  Take-home on <strong>{formatAUD(r.hourly, 2)}/hr</strong> <span className="text-warmgray">({r.level})</span>
                </span>
                <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="text-sm text-navy">
        Working a mix of shifts? Enter your hours in the <Link href="/weekly-pay-calculator/" className="font-semibold text-eucalyptus-dark hover:underline">weekly pay calculator</Link>, or turn a salary into net pay with the <Link href="/take-home-pay-calculator/" className="font-semibold text-eucalyptus-dark hover:underline">take-home pay calculator</Link>.
      </p>
    </div>
  );
}

/** Sidebar list of every award page, the current one marked. */
export function AwardDirectorySidebar({ currentHref }: { currentHref: string }) {
  return (
    <div className="space-y-2">
      {AWARD_DIRECTORY.map((a) =>
        a.href === currentHref ? (
          <div key={a.href} aria-current="page" className="flex items-center justify-between rounded-lg border border-eucalyptus/40 bg-white p-3">
            <span className="text-sm font-semibold text-eucalyptus-dark">{a.name.replace(/ Award 20\d\d$/, "")}</span>
            <span className="text-xs text-warmgray">{formatAUD(a.headlineHourly, 2)}</span>
          </div>
        ) : (
          <Link key={a.href} href={a.href} className="group flex items-center justify-between rounded-lg border border-sandstone-dark/20 bg-white p-3 transition-all hover:border-eucalyptus/40 hover:shadow-sm">
            <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{a.name.replace(/ Award 20\d\d$/, "")}</span>
            <span className="text-xs text-warmgray">{formatAUD(a.headlineHourly, 2)}</span>
          </Link>
        ),
      )}
      <Link href="/award-rates/" className="group flex items-center justify-between rounded-lg border border-sandstone-dark/20 bg-white p-3 hover:border-eucalyptus/40">
        <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">All award rates (A–Z)</span>
        <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
      </Link>
    </div>
  );
}
