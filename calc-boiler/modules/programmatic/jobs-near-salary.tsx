/**
 * "Jobs that pay about $X" for /take-home-pay-on/[salary]/.
 *
 * The occupation groups whose Jobs and Skills Australia median full-time pay
 * (ABS Survey of Employee Earnings and Hours, May 2025, weekly × 52) is
 * closest to the salary, each with its take-home a fortnight from the same
 * engine as the rest of the page and a link to the site's page for the job.
 * Every figure comes from lib/data/occupation-medians; nothing is typed in.
 */
import React from "react";
import Link from "next/link";
import { EMPLOYMENT, formatAUD, SITE_CONFIG } from "@/lib/constants/australian-tax";
import {
  MEDIAN_SOURCE_NAME,
  MEDIAN_SOURCE_PERIOD,
  MEDIAN_SOURCE_SURVEY,
  OCCUPATION_MEDIANS,
  groupName,
  medianRank,
  occupationsNear,
  type NearbyOccupation,
} from "@/lib/data/occupation-medians";
import { Card } from "@/components/ui/card";

const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const LINK = "text-eucalyptus hover:text-navy transition-colors font-medium";

function signed(v: number): string {
  if (v === 0) return "same";
  return `${v > 0 ? "+" : "−"}${formatAUD(Math.abs(v))}`;
}

/** The lead paragraph: what the nearest medians say about this salary. */
function lead(salary: number, near: NearbyOccupation[]): string {
  const s = formatAUD(salary);
  const within = near.filter((o) => Math.abs(o.diff) <= salary * 0.1);
  const first = near[0];
  const lowest = OCCUPATION_MEDIANS[0];
  const highest = OCCUPATION_MEDIANS[OCCUPATION_MEDIANS.length - 1];
  if (salary < lowest.annual * 0.9) {
    const minimumWageYear = EMPLOYMENT.minimumWageHourly * EMPLOYMENT.hoursPerYear;
    const belowMinimum =
      salary < minimumWageYear
        ? ` It is also under the full-time national minimum wage (${formatAUD(EMPLOYMENT.minimumWageHourly, 2)} an hour, ${formatAUD(minimumWageYear)} a year), so it is less than an adult full-time employee must be paid (junior, apprentice and supported wages aside): at this level the figure is usually part-time or part-year pay.`
        : "";
    return `${s} is below the median full-time pay of every occupation group we track. The lowest, ${groupName(lowest.anzscoTitle)}, is ${formatAUD(lowest.annual)} (${formatAUD(lowest.medianWeekly)} a week), ${formatAUD(lowest.annual - salary)} more than ${s}.${belowMinimum}`;
  }
  if (salary > highest.annual * 1.1) {
    return `${s} is above the median full-time pay of every occupation group we track. The highest, ${groupName(highest.anzscoTitle)}, is ${formatAUD(highest.annual)} (${formatAUD(highest.medianWeekly)} a week), ${formatAUD(salary - highest.annual)} less than ${s}.`;
  }
  if (within.length === 0) {
    return `No occupation group we track has a median full-time pay within 10% of ${s}. The nearest is ${groupName(first.anzscoTitle)} at ${formatAUD(first.annual)}, ${formatAUD(Math.abs(first.diff))} ${first.diff > 0 ? "above" : "below"} it.`;
  }
  const exact = Math.abs(first.diff) < 1_000;
  return `${within.length === 1 ? "One occupation group has" : `${within.length} occupation groups have`} a median full-time pay within 10% of ${s}. The closest is ${groupName(first.anzscoTitle)} at ${formatAUD(first.annual)} (${formatAUD(first.medianWeekly)} a week)${exact ? `, almost exactly ${s}` : `, ${formatAUD(Math.abs(first.diff))} ${first.diff > 0 ? "above" : "below"} it`}.`;
}

export function JobsNearSalary({ salary }: { salary: number }) {
  const s = formatAUD(salary);
  const near = occupationsNear(salary);
  const rank = medianRank(salary);

  return (
    <section>
      <h2 style={H2} className="text-2xl font-bold text-navy mb-4">Jobs That Pay About {s}</h2>
      <p className="text-navy leading-relaxed mb-3">{lead(salary, near)}</p>
      <p className="text-navy leading-relaxed mb-6">
        {rank.below === 0 || rank.above === 0
          ? `The table shows the ${near.length} ${rank.below === 0 ? "lowest" : "highest"} of the ${rank.total} occupation groups on this site with a published median`
          : `Across the ${rank.total} occupation groups on this site with a published median, ${s} is above the median in ${rank.below} and below it in ${rank.above}. The table shows the nearest`}
        , with what each median comes to after tax on the same {SITE_CONFIG.financialYear} rates as this page.
      </p>
      <Card className="overflow-hidden border-sandstone-dark/20 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <caption className="sr-only">
              Occupation groups with a median full-time pay near {s}, {MEDIAN_SOURCE_NAME}, {MEDIAN_SOURCE_PERIOD}
            </caption>
            <thead className="bg-sandstone/30 text-navy font-semibold border-b border-sandstone-dark/20">
              <tr>
                <th className="px-4 py-3">Occupation group and our page</th>
                <th className="px-4 py-3 text-right">
                  Median full-time pay ({MEDIAN_SOURCE_NAME}, {MEDIAN_SOURCE_PERIOD})
                </th>
                <th className="px-4 py-3 text-right">vs {s}</th>
                <th className="px-4 py-3 text-right">Take-home a fortnight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {near.map((o) => (
                <tr key={o.anzscoCode}>
                  <td className="px-4 py-3 align-top">
                    {/* The group title links to the JSA profile the figure was read from. */}
                    <a
                      href={o.sourceUrl}
                      className="block font-medium text-navy underline decoration-sandstone-dark/40 underline-offset-4 hover:text-eucalyptus-dark"
                      rel="noopener noreferrer"
                      target="_blank"
                      title={`${o.sourceName} occupation profile, ANZSCO ${o.anzscoCode}, ${o.sourcePeriod}`}
                    >
                      {o.anzscoTitle}
                    </a>
                    <span className="block">
                      {o.pages.map((p, i) => (
                        <React.Fragment key={p.href}>
                          {i > 0 && " · "}
                          <Link href={p.href} className={LINK}>{p.name}</Link>
                        </React.Fragment>
                      ))}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right align-top">
                    <span className="block font-medium text-navy">{formatAUD(o.annual)}</span>
                    <span className="block text-xs text-warmgray">{formatAUD(o.medianWeekly)}/wk</span>
                  </td>
                  <td className="px-4 py-3 text-right align-top">{signed(o.diff)}</td>
                  <td className="px-4 py-3 text-right align-top font-medium text-navy">{formatAUD(o.fortnightlyTakeHome)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="mt-3 text-sm text-warmgray leading-relaxed">
        These are medians, not what everyone in the job earns: half the full-time employees in each group are paid more and half less. Each is
        the median weekly pay of full-time, non-managerial adult employees before tax ({MEDIAN_SOURCE_SURVEY}, {MEDIAN_SOURCE_PERIOD}) × 52, for
        the whole ANZSCO group, which can be wider than the job linked beside it; take-home assumes no HECS-HELP. Award minimums, where a job has one, are on its page and in{" "}
        <Link href="/job-pay-rates/" className={LINK}>pay rates by job</Link>.
      </p>
    </section>
  );
}
