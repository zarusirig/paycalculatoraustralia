/**
 * "Award jobs with a minimum rate near $X an hour" — the rate-specific section
 * on /hourly-to-salary/[rate]/ and /salary-to-hourly/[amount]/ (10 Oct 2026).
 *
 * Every row comes from lib/data/award-rate-index.ts (the verified award
 * constants). Copy always calls these minimum award rates from a stated date:
 * a legal floor, never what a job "pays".
 */
import React from "react";
import Link from "next/link";
import { formatAUD } from "@/lib/constants/australian-tax";
import {
  AWARD_RATE_MAX,
  AWARD_RATE_MIN,
  awardLabel,
  type AwardRateMatch,
  type AwardRatesNear,
} from "@/lib/data/award-rate-index";

const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const LINK = "text-eucalyptus-dark hover:underline";

const money = (n: number) => formatAUD(n, 2);
/** Occupation links per row; Health Professional Level 4 alone is on ten pay guides. */
const MAX_JOBS = 4;
const cents = (n: number) => Math.round(Number((n * 100).toFixed(6))) / 100;

export function casualMinimum(m: AwardRateMatch): number {
  return cents(m.hourly * (1 + m.casualLoading));
}

function signed(diff: number): string {
  if (Math.abs(diff) < 0.005) return "same";
  return `${diff > 0 ? "+" : "−"}${money(Math.abs(diff))}`;
}

/**
 * Section heading. "About $X" only when the rows really are within the window;
 * above or below every award minimum the heading says so instead.
 */
export function awardRatesHeading(near: AwardRatesNear, label: string, kind: "jobs" | "rates"): string {
  if (near.position !== "inside" && !near.allInWindow) return `${label} an Hour Against Award Minimum Rates`;
  if (!near.allInWindow) return `Award Minimum Rates Nearest ${label} an Hour`;
  return kind === "jobs"
    ? `Award Jobs With a Minimum Rate of About ${label} an Hour`
    : `Minimum Award Rates Near ${label} an Hour`;
}

/** The sentence that introduces the rows, plain text (also the FAQ's lead). */
export function awardRatesLead(near: AwardRatesNear, label: string): string {
  const w = money(near.window);
  if (near.allInWindow) {
    return `These award classifications have an adult minimum rate within ${w} of ${label} an hour.`;
  }
  if (near.position === "below-all") {
    return `${label} an hour is below every adult award minimum rate in our index; the lowest is ${money(AWARD_RATE_MIN.hourly)} an hour. These are the lowest, one per award.`;
  }
  if (near.position === "above-all") {
    return `${label} an hour is above every adult award minimum rate in our index (the highest is ${money(AWARD_RATE_MAX.hourly)}), so pay at this level is set by an enterprise agreement or contract, not an award minimum. These are the highest award minimums, one per award.`;
  }
  return `These are the adult award minimum rates nearest to ${label} an hour, one per award.`;
}

/** Plain-text FAQ answer listing the rows, with their date. */
export function awardRatesFaqAnswer(near: AwardRatesNear, label: string): string {
  const dates = [...new Set(near.matches.map((m) => m.effectiveLabel))];
  const oneDate = dates.length === 1 ? dates[0] : null;
  const items = near.matches.map(
    (m) =>
      `${awardLabel(m)} ${m.classifications.join(" and ")} at ${money(m.hourly)}${oneDate ? "" : ` from ${m.effectiveLabel}`}`,
  );
  const list = items.join("; ");
  const w = money(near.window);
  let lead: string;
  if (near.allInWindow) {
    lead = `${oneDate ? `From ${oneDate}, adult` : "Adult"} minimum rates within ${w} of ${label} an hour include: ${list}.`;
  } else if (near.position === "below-all") {
    lead = `${label} an hour is below every adult award minimum rate in our index. The lowest${oneDate ? ` from ${oneDate}` : ""}, one per award, are: ${list}.`;
  } else if (near.position === "above-all") {
    lead = `${label} an hour is above every adult award minimum rate in our index. The highest${oneDate ? ` from ${oneDate}` : ""}, one per award, are: ${list}.`;
  } else {
    lead = `The adult award minimum rates nearest to ${label} an hour${oneDate ? ` from ${oneDate}` : ""}, one per award, are: ${list}.`;
  }
  return `${lead} These are legal minimums for ordinary hours, not typical pay: many employees are paid more.`;
}

export function AwardRatesNearSection({
  id,
  heading,
  label,
  near,
  intro,
  showCasual = false,
}: {
  id: string;
  heading: string;
  /** The target as printed, e.g. "$30" or "$40.49". */
  label: string;
  near: AwardRatesNear;
  /** Page-specific lead paragraph (minimum wage comparison etc.). */
  intro: React.ReactNode;
  showCasual?: boolean;
}) {
  const allowances = near.matches.some((m) => m.includesAllPurposeAllowances);
  const sources = [...new Map(near.matches.map((m) => [m.source.url, m])).values()];
  return (
    <section aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} style={H2} className="text-2xl font-bold text-navy mb-4">
        {heading}
      </h2>
      <div className="text-warmgray mb-4 space-y-3">{intro}</div>
      <p className="text-warmgray mb-3">{awardRatesLead(near, label)}</p>
      <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
        <table className="w-full text-sm text-left text-warmgray">
          <caption className="sr-only">{`Adult minimum award rates compared with ${label} an hour`}</caption>
          <thead className="bg-sandstone font-semibold text-navy">
            <tr>
              <th className="px-4 py-3" scope="col">Award and classification</th>
              <th className="px-4 py-3 text-right" scope="col">Minimum rate</th>
              <th className="px-4 py-3 text-right" scope="col">vs {label}</th>
              {showCasual && (
                <th className="px-4 py-3 text-right" scope="col">Casual minimum</th>
              )}
              <th className="px-4 py-3" scope="col">From</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {near.matches.map((m) => (
              <tr key={`${m.code}-${m.stream ?? ""}-${m.hourly}`}>
                <th scope="row" className="px-4 py-3 font-normal">
                  {m.href ? (
                    <Link href={m.href} className={`${LINK} font-medium`}>
                      {awardLabel(m)}
                    </Link>
                  ) : (
                    <span className="font-medium text-navy">{awardLabel(m)}</span>
                  )}
                  <span className="block text-xs text-warmgray">{m.classifications.join("; ")}</span>
                  {m.jobs.length > 0 && (
                    <span className="block text-xs text-warmgray mt-0.5">
                      {`${m.jobs.length > 1 ? "Pay guides" : "Pay guide"} with this rate: `}
                      {m.jobs.slice(0, MAX_JOBS).map((j, i) => (
                        <React.Fragment key={j.slug}>
                          {i > 0 && ", "}
                          <Link href={j.href} className={LINK}>
                            {j.name}
                          </Link>
                        </React.Fragment>
                      ))}
                      {m.jobs.length > MAX_JOBS ? ` and ${m.jobs.length - MAX_JOBS} more` : ""}
                    </span>
                  )}
                </th>
                <td className="px-4 py-3 text-right tabular-nums text-navy">
                  {money(m.hourly)}
                  {m.includesAllPurposeAllowances ? "*" : ""}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{signed(m.diff)}</td>
                {showCasual && (
                  <td className="px-4 py-3 text-right tabular-nums">{money(casualMinimum(m))}</td>
                )}
                <td className="px-4 py-3 whitespace-nowrap">{m.effectiveLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-warmgray-light mt-2">
        Adult minimums for ordinary hours from the first full pay period on or after the date shown; pay can be
        higher.{showCasual ? " Casual: plus the 25% loading." : ""}
        {allowances ? " * Includes all-purpose allowances." : ""} Sources:{" "}
        {sources.map((m, i) => (
          <React.Fragment key={m.source.url}>
            {i > 0 && "; "}
            <a href={m.source.url} className={LINK} rel="noopener noreferrer" target="_blank">
              {m.source.label}
            </a>
          </React.Fragment>
        ))}
        .
      </p>
    </section>
  );
}
