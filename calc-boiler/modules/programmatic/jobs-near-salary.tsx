/**
 * "Jobs that pay about $X" for /take-home-pay-on/[salary]/.
 *
 * Oct 2026: tightened so neighbouring pages rarely share a list. A figure is
 * shown only on the page it lands on (the nearest kept salary, within half the
 * gap either side), so each Jobs and Skills Australia occupation median and
 * each published pay point (public service, ADF, police, paramedics,
 * firefighters, prison officers, hospital specialists, pilots, air traffic
 * control, apprentices) appears on exactly one take-home page. The section
 * shows only where that gives at least three names, and never on the
 * low-salary pages, where the hours-a-week section replaces it.
 *
 * Every figure comes from lib/data; take-home is the same engine as the page.
 */
import React from "react";
import Link from "next/link";
import { formatAUD, calculatePayBreakdown } from "@/lib/constants/australian-tax";
import { NMW } from "@/lib/constants/minimum-wage";
import { MEDIAN_SOURCE_NAME, MEDIAN_SOURCE_PERIOD } from "@/lib/data/occupation-medians";
import { APPRENTICE_RATES_EFFECTIVE, jobsOnPage, minimumWageOnPage, takeHomeBand, type PublicPayOnPage } from "@/lib/data/salary-pages/take-home-sections";
import { ApprenticeTable } from "@/modules/programmatic/take-home-sections";
import { Card } from "@/components/ui/card";

const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const LINK = "text-eucalyptus hover:text-navy transition-colors font-medium";

/** "the first full pay period on or after 1 July 2026" -> "1 July 2026". */
const shortDate = (d: string) => d.replace(/^the first full pay (period|cycle) (starting )?(on or )?after /i, "").replace(/\s*\(.*\)\s*$/, "");

interface Row {
  key: string;
  annual: number;
  fortnightly: number;
  title: React.ReactNode;
  detail: React.ReactNode;
}

/** Rows keyed by id, except employer rows at the same rate and kind, which share a key. */
function groupEmployers(points: PublicPayOnPage[]): Map<string, PublicPayOnPage[]> {
  const groups = new Map<string, PublicPayOnPage[]>();
  for (const p of points) {
    const key = p.groupKey.startsWith("employer|") ? `employer|${p.point}|${p.annual}` : p.id;
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }
  return groups;
}

export function JobsNearSalary({ salary }: { salary: number }) {
  const s = formatAUD(salary);
  const { occupations, publicPay, apprentices, show } = jobsOnPage(salary);
  if (!show) return null;
  const mw = minimumWageOnPage(salary);

  const rows: Row[] = [
    ...occupations.map((o) => ({
      key: o.anzscoCode,
      annual: o.annual,
      fortnightly: o.fortnightlyTakeHome,
      title: (
        <a
          href={o.sourceUrl}
          className="font-medium text-navy underline decoration-sandstone-dark/40 underline-offset-4 hover:text-eucalyptus-dark"
          rel="noopener noreferrer"
          target="_blank"
          title={`${o.sourceName} occupation profile, ANZSCO ${o.anzscoCode}, ${o.sourcePeriod}`}
        >
          {o.anzscoTitle}
        </a>
      ),
      detail: (
        <>
          median ·{" "}
          {o.pages.map((p, i) => (
            <React.Fragment key={p.href}>
              {i > 0 && " · "}
              <Link href={p.href} className={LINK}>{p.name}</Link>
            </React.Fragment>
          ))}
        </>
      ),
    })),
    // Employers on the same award or agreement rate share one row.
    ...[...groupEmployers(publicPay).values()].map((group) => {
      const p = group[0];
      const age = /aged ([^,(]+)/.exec(p.classification)?.[1]?.trim();
      return {
        key: p.id,
        annual: p.annual,
        fortnightly: p.fortnightlyTakeHome,
        title: (
          <span className="font-medium text-navy">
            {group.length > 1 ? (p.point === "junior" && age ? `Junior, aged ${age}` : "Adult entry level") : p.classification}
            {p.code && !p.classification.includes(p.code) ? ` (${p.code})` : ""}
          </span>
        ),
        detail: (
          <>
            {group.map((g, i) => (
              <React.Fragment key={g.id}>
                {i > 0 && " · "}
                <Link href={g.href} className={LINK}>{g.service}</Link>
              </React.Fragment>
            ))}
            , {p.detail}, {shortDate(p.effectiveFrom)}
          </>
        ),
      };
    }),
  ].sort((a, b) => a.annual - b.annual);

  return (
    <section>
      <h2 style={H2} className="text-2xl font-bold text-navy mb-4">
        {takeHomeBand(salary) === "low" ? `Who Earns About ${s} Full-Time?` : `Jobs That Pay About ${s}`}
      </h2>
      <p className="text-navy leading-relaxed mb-6">
        Published pay closer to {s} than to any other salary on this site, with take-home a fortnight.
        {mw.adult ? ` A full-time adult on the minimum wage earns ${formatAUD(NMW.annual)} (${formatAUD(calculatePayBreakdown({ grossSalary: NMW.annual }).fortnightly)}).` : ""}
        {mw.juniors.map((j) => ` ${j.years < 16 ? "Under 16" : `${j.years === 18 ? "An" : "A"} ${j.age}-year-old`} on the junior minimum wage: ${formatAUD(j.annual)}.`).join("")}
      </p>

      {rows.length > 0 && (
        <Card className="overflow-hidden border-sandstone-dark/20 shadow-sm mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <caption className="sr-only">Jobs and pay scales near {s}</caption>
              <thead className="bg-sandstone/30 text-navy font-semibold border-b border-sandstone-dark/20">
                <tr>
                  <th className="px-4 py-3">Job or pay scale</th>
                  <th className="px-4 py-3 text-right">A year</th>
                  <th className="px-4 py-3 text-right">Take-home a fortnight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {rows.map((r) => (
                  <tr key={r.key}>
                    <td className="px-4 py-3 align-top">
                      <span className="block">{r.title}</span>
                      <span className="block text-xs text-warmgray">{r.detail}</span>
                    </td>
                    <td className="px-4 py-3 text-right align-top font-medium text-navy">{formatAUD(r.annual)}</td>
                    <td className="px-4 py-3 text-right align-top font-medium text-navy">{formatAUD(r.fortnightly)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {apprentices.length > 0 && (
        <>
          <p className="text-sm text-warmgray mb-2">Apprentice award minimums, {APPRENTICE_RATES_EFFECTIVE}:</p>
          <ApprenticeTable salary={salary} rows={apprentices} />
        </>
      )}

      <p className="mt-3 text-sm text-warmgray leading-relaxed">
        {occupations.length > 0 ? `Medians: full-time adults, ${MEDIAN_SOURCE_NAME}, ${MEDIAN_SOURCE_PERIOD}. ` : ""}
        Salary before super, from the date shown; no HECS-HELP. <Link href="/job-pay-rates/" className={LINK}>Pay rates by job</Link>.
      </p>
    </section>
  );
}
