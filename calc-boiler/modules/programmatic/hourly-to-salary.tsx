import Link from "next/link";
import {
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
  EMPLOYMENT,
  HECS_HELP,
  SITE_CONFIG,
  SUPER_GUARANTEE,
} from "@/lib/constants/australian-tax";

const HOURS_PER_YEAR: number = EMPLOYMENT.hoursPerYear;
const WEEKS: number = EMPLOYMENT.weeksPerYear;
// Widened from the `as const` literal 38 so it can be used as a default
// parameter that callers may override with other hours-per-week values.
const STANDARD_HOURS: number = EMPLOYMENT.standardWeeklyHours;

/** Hours-per-week variants shown on every page. 38 is the standard full-time week. */
const HOURS_VARIANTS = [20, 25, 30, 35, 38, 40, 45, 50];

/** Neighbouring rates for the sibling link mesh. */
export const TIER_1_RATES = [30, 32, 33, 35, 36, 37, 38, 40, 45, 50, 55, 60];

export function annualFromHourly(hourly: number, hoursPerWeek = STANDARD_HOURS): number {
  return hourly * hoursPerWeek * WEEKS;
}

interface HourlyToSalaryProps {
  rate: number;
}

export function HourlyToSalary({ rate }: HourlyToSalaryProps) {
  const gross = annualFromHourly(rate);
  const breakdown = calculatePayBreakdown({
    grossSalary: gross,
    includeHECS: gross >= HECS_HELP.minimumThreshold,
  });
  const net = breakdown.takeHomePay;
  const netHourly = net / HOURS_PER_YEAR;
  const casual = rate * (1 + EMPLOYMENT.casualLoading);
  const aboveMinimum = rate - EMPLOYMENT.minimumWageHourly;

  const neighbours = TIER_1_RATES.filter((r) => r !== rate)
    .sort((a, b) => Math.abs(a - rate) - Math.abs(b - rate))
    .slice(0, 6)
    .sort((a, b) => a - b);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* ── Answer table ── */}
      <section>
        <h2
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          className="text-2xl font-bold text-navy mb-4"
        >
          {formatAUD(rate, 2)} an Hour Is How Much a Year?
        </h2>
        <p className="text-warmgray mb-4">
          At {formatAUD(rate, 2)} an hour on a {STANDARD_HOURS}-hour week, you earn{" "}
          <strong className="text-navy">{formatAUD(gross)}</strong> a year before tax and{" "}
          <strong className="text-navy">{formatAUD(net)}</strong> after tax — about{" "}
          {formatAUD(netHourly, 2)} an hour in the hand.
        </p>

        <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
          <table className="w-full text-sm text-left text-warmgray">
            <thead className="bg-sandstone font-semibold text-navy">
              <tr>
                <th className="px-5 py-3">Period</th>
                <th className="px-5 py-3 text-right">Gross</th>
                <th className="px-5 py-3 text-right">After tax</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr>
                <td className="px-5 py-3 font-medium">Hourly</td>
                <td className="px-5 py-3 text-right tabular-nums">{formatAUD(rate, 2)}</td>
                <td className="px-5 py-3 text-right tabular-nums">{formatAUD(netHourly, 2)}</td>
              </tr>
              <tr className="bg-eucalyptus-light/30">
                <td className="px-5 py-3 font-medium">Daily ({STANDARD_HOURS / 5} hrs)</td>
                <td className="px-5 py-3 text-right tabular-nums">{formatAUD(rate * (STANDARD_HOURS / 5), 2)}</td>
                <td className="px-5 py-3 text-right tabular-nums">{formatAUD(breakdown.daily, 2)}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">Weekly</td>
                <td className="px-5 py-3 text-right tabular-nums">{formatAUD(rate * STANDARD_HOURS, 2)}</td>
                <td className="px-5 py-3 text-right tabular-nums">{formatAUD(breakdown.weekly, 2)}</td>
              </tr>
              <tr className="bg-eucalyptus-light/30">
                <td className="px-5 py-3 font-medium">Fortnightly</td>
                <td className="px-5 py-3 text-right tabular-nums">{formatAUD(rate * STANDARD_HOURS * 2, 2)}</td>
                <td className="px-5 py-3 text-right tabular-nums">{formatAUD(breakdown.fortnightly, 2)}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">Monthly</td>
                <td className="px-5 py-3 text-right tabular-nums">{formatAUD(gross / 12, 2)}</td>
                <td className="px-5 py-3 text-right tabular-nums">{formatAUD(breakdown.monthly, 2)}</td>
              </tr>
              <tr className="bg-eucalyptus-light/30">
                <td className="px-5 py-3 font-medium">Annual</td>
                <td className="px-5 py-3 text-right font-bold tabular-nums text-navy">{formatAUD(gross)}</td>
                <td className="px-5 py-3 text-right font-bold tabular-nums text-navy">{formatAUD(net)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-warmgray-light mt-2">
          Based on {STANDARD_HOURS} hours a week over {WEEKS} weeks ({HOURS_PER_YEAR.toLocaleString()} hours a
          year), FY{SITE_CONFIG.financialYear} resident rates including the Medicare levy
          {gross >= HECS_HELP.minimumThreshold ? " and compulsory HECS-HELP repayments" : ""}.
        </p>
      </section>

      {/* ── Hours variants ── */}
      <section>
        <h2
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          className="text-2xl font-bold text-navy mb-4"
        >
          {formatAUD(rate, 2)} an Hour by Hours Worked
        </h2>
        <p className="text-warmgray mb-4">
          Most people searching this do not work a standard week. Part-time, casual and shift
          workers can read their own figure off this table.
        </p>
        <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
          <table className="w-full text-sm text-left text-warmgray">
            <thead className="bg-sandstone font-semibold text-navy">
              <tr>
                <th className="px-5 py-3">Hours a week</th>
                <th className="px-5 py-3 text-right">Weekly gross</th>
                <th className="px-5 py-3 text-right">Annual gross</th>
                <th className="px-5 py-3 text-right">Annual after tax</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {HOURS_VARIANTS.map((hours) => {
                const annual = annualFromHourly(rate, hours);
                const b = calculatePayBreakdown({
                  grossSalary: annual,
                  includeHECS: annual >= HECS_HELP.minimumThreshold,
                });
                const standard = hours === STANDARD_HOURS;
                return (
                  <tr key={hours} className={standard ? "bg-eucalyptus-light/40" : ""}>
                    <td className="px-5 py-3 font-medium">
                      {hours}
                      {standard && <span className="ml-2 text-xs text-eucalyptus-dark">full time</span>}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">{formatAUD(rate * hours, 2)}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{formatAUD(annual)}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{formatAUD(b.takeHomePay)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Context ── */}
      <section>
        <h2
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          className="text-2xl font-bold text-navy mb-4"
        >
          Is {formatAUD(rate, 2)} an Hour Good Pay in Australia?
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div className="rounded-xl border border-sandstone-dark/20 bg-white p-5">
            <div className="text-xs uppercase tracking-wider text-ochre font-semibold mb-1">
              vs minimum wage
            </div>
            <div className="text-2xl font-extrabold text-navy">
              {aboveMinimum >= 0 ? "+" : ""}
              {formatAUD(aboveMinimum, 2)}
            </div>
            <div className="text-xs text-warmgray mt-1">
              National minimum is {formatAUD(EMPLOYMENT.minimumWageHourly, 2)} an hour
            </div>
          </div>
          <div className="rounded-xl border border-sandstone-dark/20 bg-white p-5">
            <div className="text-xs uppercase tracking-wider text-ochre font-semibold mb-1">
              As a casual
            </div>
            <div className="text-2xl font-extrabold text-navy">{formatAUD(casual, 2)}</div>
            <div className="text-xs text-warmgray mt-1">
              With the {formatPercent(EMPLOYMENT.casualLoading, 0)} casual loading
            </div>
          </div>
          <div className="rounded-xl border border-sandstone-dark/20 bg-white p-5">
            <div className="text-xs uppercase tracking-wider text-ochre font-semibold mb-1">
              Super on top
            </div>
            <div className="text-2xl font-extrabold text-navy">
              {formatAUD(gross * SUPER_GUARANTEE.rate)}
            </div>
            <div className="text-xs text-warmgray mt-1">
              {formatPercent(SUPER_GUARANTEE.rate, 0)} guarantee, paid on top of your wage
            </div>
          </div>
        </div>
        <p className="text-warmgray">
          {aboveMinimum >= 0 ? (
            <>
              {formatAUD(rate, 2)} an hour is {formatAUD(aboveMinimum, 2)} above the national
              minimum wage of {formatAUD(EMPLOYMENT.minimumWageHourly, 2)}. Your effective tax rate
              at {formatAUD(gross)} is {formatPercent(breakdown.effectiveTaxRate)}, with a marginal
              rate of {formatPercent(breakdown.marginalTaxRate, 0)} on your next dollar.
            </>
          ) : (
            <>
              {formatAUD(rate, 2)} an hour is below the national minimum wage of{" "}
              {formatAUD(EMPLOYMENT.minimumWageHourly, 2)}. Unless you are a junior, an apprentice,
              or on a supported wage, this may be an underpayment — check your{" "}
              <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">
                award rate
              </Link>
              .
            </>
          )}{" "}
          Casual employees receive the {formatPercent(EMPLOYMENT.casualLoading, 0)} loading instead
          of paid leave, so {formatAUD(casual, 2)} an hour casual is not the same as{" "}
          {formatAUD(casual, 2)} permanent.
        </p>
      </section>

      {/* ── Sibling mesh ── */}
      <section>
        <h2
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          className="text-2xl font-bold text-navy mb-6"
        >
          Other Hourly Rates
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {neighbours.map((r) => (
            <Link
              key={r}
              href={`/hourly-to-salary/${r}/`}
              className="rounded-lg border border-sandstone-dark/20 bg-white p-4 hover:border-eucalyptus hover:shadow-sm transition-all"
            >
              <div className="font-semibold text-navy">{formatAUD(r, 2)} an hour</div>
              <div className="text-xs text-warmgray mt-1">
                {formatAUD(annualFromHourly(r))} a year
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Related ── */}
      <section>
        <h2
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          className="text-2xl font-bold text-navy mb-4"
        >
          Related Calculators
        </h2>
        <ul className="space-y-2 text-warmgray">
          <li>
            <Link href="/hourly-to-annual-salary-calculator/" className="text-eucalyptus-dark hover:underline">
              Hourly to Annual Salary Calculator
            </Link>{" "}
            — any rate and any number of hours
          </li>
          <li>
            <Link href={`/salary-to-hourly/${roundToSalaryStep(gross)}/`} className="text-eucalyptus-dark hover:underline">
              {formatAUD(roundToSalaryStep(gross))} salary to hourly rate
            </Link>{" "}
            — the same conversion in reverse
          </li>
          <li>
            <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">
              Take-Home Pay Calculator
            </Link>{" "}
            — net pay after tax, super and HECS-HELP
          </li>
          <li>
            <Link href="/overtime-pay-calculator/" className="text-eucalyptus-dark hover:underline">
              Overtime &amp; Penalty Rates Calculator
            </Link>{" "}
            — time-and-a-half, double time and weekend loadings
          </li>
          <li>
            <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">
              Award Rates
            </Link>{" "}
            — check the legal minimum for your classification
          </li>
        </ul>
      </section>
    </div>
  );
}

/** Nearest salary that has a /salary-to-hourly/ page, for the reverse link. */
const SALARY_STEPS = [
  30_000, 40_000, 45_000, 50_000, 55_000, 60_000, 65_000, 70_000, 75_000, 80_000, 85_000, 90_000,
  95_000, 100_000, 110_000, 120_000, 130_000, 140_000, 150_000, 200_000,
];

export function roundToSalaryStep(salary: number): number {
  return SALARY_STEPS.reduce((best, s) =>
    Math.abs(s - salary) < Math.abs(best - salary) ? s : best,
  );
}
