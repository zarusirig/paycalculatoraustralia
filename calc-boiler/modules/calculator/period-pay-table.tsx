import Link from "next/link";
import { calculatePayBreakdown, formatAUD, SITE_CONFIG } from "@/lib/constants";
import { hasPage, salaryHref } from "@/lib/data/salary-pages";
import { FORTNIGHTLY_EXTRA_PAY, WEEKLY_EXTRA_PAY } from "@/modules/tax-tables/ato-schedules";

/**
 * "Weekly/fortnightly pay after tax at common salaries" — a period-specific
 * table rendered directly under the calculator on /weekly-pay-calculator/ and
 * /fortnightly-pay-calculator/. It is what those pages offer that the
 * homepage's all-periods calculator does not: one pay cycle, many salaries,
 * scannable before any input. Every figure comes from the tax engine.
 */

type Period = "weekly" | "fortnightly";

const SALARIES = [50_000, 60_000, 70_000, 80_000, 90_000, 100_000, 120_000, 150_000] as const;

const META: Record<Period, { pays: number; noun: string; extra: typeof WEEKLY_EXTRA_PAY }> = {
  weekly: { pays: 52, noun: "week", extra: WEEKLY_EXTRA_PAY },
  fortnightly: { pays: 26, noun: "fortnight", extra: FORTNIGHTLY_EXTRA_PAY },
};

export function periodPayRows(period: Period) {
  const { pays } = META[period];
  return SALARIES.map((salary) => {
    const b = calculatePayBreakdown({ grossSalary: salary, includeHECS: false, hasPrivateHealth: true });
    const gross = salary / pays;
    const net = period === "weekly" ? b.weekly : b.fortnightly;
    return { salary, gross, tax: gross - net, net };
  });
}

export function PeriodPayTable({ period, currentSalary }: { period: Period; currentSalary?: number }) {
  const { noun, extra } = META[period];
  const Noun = noun[0].toUpperCase() + noun.slice(1);
  const rows = periodPayRows(period);
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 bg-white shadow-sm">
      <table className="w-full text-sm">
        <caption className="px-4 pt-3 text-left text-base font-semibold text-navy">
          {Noun}ly pay after tax at common salaries, FY{SITE_CONFIG.financialYear}
        </caption>
        <thead className="bg-sandstone">
          <tr>
            <th className="px-4 py-2.5 text-left font-semibold text-navy">Salary</th>
            <th className="px-4 py-2.5 text-right font-semibold text-navy">Gross per {noun}</th>
            <th className="px-4 py-2.5 text-right font-semibold text-navy">Tax + Medicare</th>
            <th className="px-4 py-2.5 text-right font-semibold text-navy">Take-home per {noun}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/10">
          {rows.map((r) => (
            <tr key={r.salary} className={r.salary === currentSalary ? "bg-eucalyptus-light/40" : undefined}>
              <td className="px-4 py-2 font-medium text-navy">
                {hasPage("take-home", r.salary) ? (
                  <Link href={salaryHref("take-home", r.salary)} className="text-eucalyptus-dark hover:underline">{formatAUD(r.salary)}</Link>
                ) : (
                  formatAUD(r.salary)
                )}
              </td>
              <td className="px-4 py-2 text-right text-warmgray">{formatAUD(r.gross, 2)}</td>
              <td className="px-4 py-2 text-right text-warmgray">{formatAUD(r.tax, 2)}</td>
              <td className="px-4 py-2 text-right font-semibold text-eucalyptus-dark">{formatAUD(r.net, 2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-4 py-2.5 text-xs text-warmgray">
        Resident rates with the tax-free threshold, no HECS-HELP. {extra.standardPayCount} {noun}ly pays in most years;{" "}
        {extra.extraPayCount} when an extra pay day falls in the financial year (same salary, spread over one more pay).
      </p>
    </div>
  );
}
