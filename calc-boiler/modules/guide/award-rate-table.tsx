"use client";

// Shared classification rate table for the per-award rate pages.
//
// Hospitality and retail publish the same shape (level, weekly, hourly) but
// diverge on casual overtime, so only the base table is shared — the overtime
// and penalty tables live on each page where the rules differ.

import { formatAUD } from "@/lib/constants";
import type { AwardRate } from "@/lib/constants/hospitality-award";
import { toCents } from "@/modules/guide/hospitality-award-faqs";

export function AwardRateTable({
  rows,
  casualLoading,
  caption,
  levelHeading = "Classification level",
}: {
  rows: readonly AwardRate[];
  casualLoading: number;
  caption: string;
  levelHeading?: string;
}) {
  const loadingLabel = `${(casualLoading * 100).toFixed(0)}%`;
  return (
    <div className="not-prose my-6">
      <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
        <table className="w-full min-w-[34rem] text-left text-sm text-navy">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-sandstone font-semibold text-navy">
            <tr>
              <th scope="col" className="px-5 py-4">{levelHeading}</th>
              <th scope="col" className="px-5 py-4">Weekly (38 hrs)</th>
              <th scope="col" className="px-5 py-4">Hourly</th>
              <th scope="col" className="px-5 py-4">Casual hourly (+{loadingLabel})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {rows.map((r) => (
              <tr key={r.level}>
                <th scope="row" className="px-5 py-3 text-left font-medium">{r.level}</th>
                <td className="px-5 py-3">{formatAUD(r.weekly, 2)}</td>
                <td className="px-5 py-3 font-medium">{formatAUD(r.hourly, 2)}</td>
                <td className="px-5 py-3">{formatAUD(toCents(r.hourly * (1 + casualLoading)), 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Junior percentage scale table, used by hospitality, retail and the junior hub.
 *
 * Derives from the adult WEEKLY rate, then divides by standard hours — the
 * order Fair Work uses. Applying the percentage to the hourly rate instead is
 * out by a cent at several bands; lib/constants/junior-rates.ts documents the
 * three ages where that happens on the National Minimum Wage.
 */
export function JuniorScaleTable({
  scale,
  adultWeekly,
  standardWeeklyHours,
  caption,
  adultLabel,
}: {
  scale: readonly { age: string; percentage: number }[];
  adultWeekly: number;
  standardWeeklyHours: number;
  caption: string;
  adultLabel: string;
}) {
  return (
    <div className="not-prose my-6">
      <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
        <table className="w-full min-w-[32rem] text-left text-sm text-navy">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-sandstone font-semibold text-navy">
            <tr>
              <th scope="col" className="px-5 py-4">Age</th>
              <th scope="col" className="px-5 py-4">% of adult rate</th>
              <th scope="col" className="px-5 py-4">Weekly on {adultLabel}</th>
              <th scope="col" className="px-5 py-4">Hourly</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {scale.map((band) => {
              const weekly = toCents(adultWeekly * band.percentage);
              const hourly = toCents((adultWeekly * band.percentage) / standardWeeklyHours);
              return (
                <tr key={band.age}>
                  <th scope="row" className="px-5 py-3 text-left font-medium">{band.age}</th>
                  <td className="px-5 py-3">{(band.percentage * 100).toFixed((band.percentage * 100) % 1 === 0 ? 0 : 1)}%</td>
                  <td className="px-5 py-3">{formatAUD(weekly, 2)}</td>
                  <td className="px-5 py-3 font-medium">{formatAUD(hourly, 2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
