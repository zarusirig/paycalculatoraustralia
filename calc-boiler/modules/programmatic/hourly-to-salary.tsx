import Link from "next/link";
import { HOURLY_RATE_PAGES, hourlyRateFromSlug, hourlyRateSlug, notesForRate } from "@/lib/constants/hourly-rates";
// G5: after-tax section, prev/next links and band notes
import {
  AFTER_TAX_PART_TIME_HOURS,
  casualAfterTax,
  hourlyAfterTax,
  prevNextRate,
  type HourlyAfterTax,
} from "@/lib/constants/hourly-rates";
import { hubHref, salaryFacts } from "@/lib/data/salary-pages";
import { SalaryBandNotes } from "@/modules/programmatic/salary-page-sections";
import {
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
  EMPLOYMENT,
  SITE_CONFIG,
  SUPER_GUARANTEE,
} from "@/lib/constants/australian-tax";
import { nearestSalary } from "@/lib/data/salary-pages";

const HOURS_PER_YEAR: number = EMPLOYMENT.hoursPerYear;
const WEEKS: number = EMPLOYMENT.weeksPerYear;
// Widened from the `as const` literal 38 so it can be used as a default
// parameter that callers may override with other hours-per-week values.
const STANDARD_HOURS: number = EMPLOYMENT.standardWeeklyHours;

/** Hours-per-week variants shown on every page. 38 is the standard full-time week. */
const HOURS_VARIANTS = [20, 25, 30, 35, 38, 40, 45, 50];

/**
 * The rate inventory lives in lib/constants/hourly-rates.ts (whole dollars
 * $20–$100, half-dollars across the award band, plus every NMW and verified
 * award hourly rate). It is re-exported here under the name the routes,
 * sitemap and site directory already import.
 */
export const ALL_RATES: readonly number[] = HOURLY_RATE_PAGES;
export { hourlyRateSlug, hourlyRateFromSlug };

export function annualFromHourly(hourly: number, hoursPerWeek = STANDARD_HOURS): number {
  return hourly * hoursPerWeek * WEEKS;
}

interface HourlyToSalaryProps {
  rate: number;
}

export function HourlyToSalary({ rate }: HourlyToSalaryProps) {
  const gross = annualFromHourly(rate);
  // No HECS in the headline figures (the page title quotes them, and "after
  // tax" is asked for someone without a study loan); the loan case is noted.
  const breakdown = calculatePayBreakdown({ grossSalary: gross });
  const withHecs = calculatePayBreakdown({ grossSalary: gross, includeHECS: true });
  const net = breakdown.takeHomePay;
  const netHourly = net / HOURS_PER_YEAR;
  const casual = rate * (1 + EMPLOYMENT.casualLoading);
  const aboveMinimum = rate - EMPLOYMENT.minimumWageHourly;
  const awardNotes = notesForRate(rate);

  const neighbours = ALL_RATES.filter((r) => r !== rate)
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
          year), FY{SITE_CONFIG.financialYear} resident rates including the Medicare levy, with no HECS-HELP debt.
          {withHecs.hecsRepayment > 0
            ? ` With a HECS-HELP debt, the compulsory repayment of ${formatAUD(withHecs.hecsRepayment)} brings the annual figure to ${formatAUD(withHecs.takeHomePay)}.`
            : ""}
        </p>
      </section>

      {/* ── G5: after-tax breakdown ── */}
      <HourlyAfterTaxSection rate={rate} />

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
                const b = calculatePayBreakdown({ grossSalary: annual });
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


      {/* ── Who is paid exactly this rate ── */}
      {awardNotes.length > 0 && (
        <section>
          <h2
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            className="text-2xl font-bold text-navy mb-4"
          >
            Who Is Paid {formatAUD(rate, 2)} an Hour?
          </h2>
          <p className="text-warmgray mb-3">
            {formatAUD(rate, 2)} is not a round number by accident — it is a published minimum
            rate. On a {STANDARD_HOURS}-hour week it is {formatAUD(rate * STANDARD_HOURS, 2)} a
            week, which is the figure the Fair Work Commission sets; the hourly rate is that
            weekly amount divided by {STANDARD_HOURS}.
          </p>
          <ul className="space-y-2 text-warmgray">
            {awardNotes.map((n) => (
              <li key={`${n.code}-${n.classification}`}>
                <Link href={n.href} className="text-eucalyptus-dark hover:underline">
                  {n.award}
                </Link>
                {n.code !== "NMW" ? ` (${n.code})` : ""} — {n.classification}
              </li>
            ))}
          </ul>
        </section>
      )}

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
              href={`/hourly-to-salary/${hourlyRateSlug(r)}/`}
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

      {/* ── G5: prev / next rate and the salary hubs ── */}
      <RateNav rate={rate} />

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
            <Link href={`/take-home-pay-on/${roundToTakeHomeStep(gross)}/`} className="text-eucalyptus-dark hover:underline">
              Take-home pay on {formatAUD(roundToTakeHomeStep(gross))}
            </Link>{" "}
            — the nearest annual salary, broken down per week and fortnight
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

/**
 * Nearest salary that has a /salary-to-hourly/ page, for the reverse link.
 * Reads the shared grid in lib/data/salary-pages ($1k steps from $40k).
 */
export function roundToSalaryStep(salary: number): number {
  return nearestSalary("salary-to-hourly", salary);
}

/** Nearest salary that has a /take-home-pay-on/ page (shared grid, lib/data/salary-pages). */
export function roundToTakeHomeStep(salary: number): number {
  return nearestSalary("take-home", salary);
}

// =============================================================================
// G5 — "$N an hour after tax" section and prev/next rate links.
//
// The after-tax phrasing gets ~170 searches a month across $20–$80 and Google
// ranks the rate's /hourly-to-salary/ page for it, so the after-tax view lives
// here instead of on a second URL family
// (docs/seo/2026-09-24-hourly-after-tax-demand.md).
// =============================================================================

const G5_H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const G5_LINK = "text-eucalyptus-dark hover:underline";

function perHourLabel(r: number): string {
  return Number.isInteger(r) ? formatAUD(r) : formatAUD(r, 2);
}

const pct0 = (v: number) => `${Math.round(v * 100)}%`;

function HourlyAfterTaxSection({ rate }: { rate: number }) {
  const ft = hourlyAfterTax(rate);
  const partTime = AFTER_TAX_PART_TIME_HOURS.map((h) => hourlyAfterTax(rate, h));
  const casual = casualAfterTax(rate);
  const hoursYear = ft.hoursPerWeek * WEEKS;
  const taxShare = (ft.incomeTax + ft.medicareLevy) / ft.grossAnnual;

  // Lines of the full-time breakdown, each shown per hour / week / fortnight / month / year.
  const lines: { label: string; annual: number; strong?: boolean }[] = [
    { label: "Gross pay", annual: ft.grossAnnual },
    { label: "Income tax (after LITO)", annual: -ft.incomeTax },
    { label: "Medicare levy", annual: -ft.medicareLevy },
    { label: "Take-home pay", annual: ft.takeHomeAnnual, strong: true },
  ];
  const per = (annual: number) => [annual / hoursYear, annual / WEEKS, annual / (WEEKS / 2), annual / 12, annual];
  const cell = (v: number) => (v < 0 ? `−${formatAUD(-v, 2)}` : formatAUD(v, 2));

  // Part-time copy branches on what actually happens to the tax at 25 hours.
  const pt25 = partTime[partTime.length - 1];
  const grossCut = 1 - pt25.grossAnnual / ft.grossAnnual;
  const netCut = 1 - pt25.takeHomeAnnual / ft.takeHomeAnnual;
  const pt25Tax = pt25.incomeTax + pt25.medicareLevy;
  // Name the actual reason: a lower top bracket, or (same bracket) the
  // tax-free threshold and offsets covering more of a smaller income.
  const ftFacts = salaryFacts(Math.round(ft.grossAnnual));
  const ptFacts = salaryFacts(Math.round(pt25.grossAnnual));
  const netCutReason =
    ptFacts.bracketIndex < ftFacts.bracketIndex
      ? `because the part-time income (${formatAUD(pt25.grossAnnual)}) tops out in the ${formatPercent(ptFacts.bracketRate, 0)} bracket and no longer reaches the ${formatPercent(ftFacts.bracketRate, 0)} rate`
      : `because the tax-free threshold${ptFacts.breakdown.litoOffset > 0 ? " and the Low Income Tax Offset cover" : " covers"} a bigger share of the smaller income (both sit in the ${formatPercent(ftFacts.bracketRate, 0)} bracket)`;

  const casualExtraWeek = casual.perWeek - ft.perWeek;
  const rows: { label: string; f: HourlyAfterTax; note?: string }[] = [
    { label: `Full time (${ft.hoursPerWeek} hrs)`, f: ft },
    ...partTime.map((p) => ({ label: `Part time (${p.hoursPerWeek} hrs)`, f: p })),
    {
      label: `Casual (${ft.hoursPerWeek} hrs at ${formatAUD(casual.rate, 2)})`,
      f: casual,
      note: `${perHourLabel(rate)} base + ${formatPercent(EMPLOYMENT.casualLoading, 0)} loading`,
    },
  ];

  return (
    <section aria-labelledby="after-tax-heading">
      <h2 id="after-tax-heading" style={G5_H2} className="text-2xl font-bold text-navy mb-4">
        {perHourLabel(rate)} an Hour After Tax
      </h2>
      <p className="text-warmgray mb-4">
        {perHourLabel(rate)} an hour after tax is{" "}
        <strong className="text-navy">{formatAUD(ft.perWeek, 2)} a week</strong>,{" "}
        {formatAUD(ft.perFortnight, 2)} a fortnight, {formatAUD(ft.perMonth, 2)} a month and{" "}
        {formatAUD(ft.takeHomeAnnual)} a year on a {ft.hoursPerWeek}-hour week in {SITE_CONFIG.financialYear}.
        You keep {formatAUD(ft.perHour, 2)} of every hour worked; {pct0(taxShare)} of gross pay goes to
        income tax and the Medicare levy.
      </p>

      <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
        <table className="w-full text-sm text-left text-warmgray">
          <caption className="sr-only">
            {perHourLabel(rate)} an hour after tax per hour, week, fortnight, month and year
          </caption>
          <thead className="bg-sandstone font-semibold text-navy">
            <tr>
              <th className="px-4 py-3" scope="col">
                {ft.hoursPerWeek} hrs a week
              </th>
              <th className="px-4 py-3 text-right" scope="col">Hour</th>
              <th className="px-4 py-3 text-right" scope="col">Week</th>
              <th className="px-4 py-3 text-right" scope="col">Fortnight</th>
              <th className="px-4 py-3 text-right" scope="col">Month</th>
              <th className="px-4 py-3 text-right" scope="col">Year</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {lines.map((l) => (
              <tr key={l.label} className={l.strong ? "bg-eucalyptus-light/40" : ""}>
                <th scope="row" className={`px-4 py-3 font-medium ${l.strong ? "text-navy" : ""}`}>
                  {l.label}
                </th>
                {per(l.annual).map((v, i) => (
                  <td
                    key={i}
                    className={`px-4 py-3 text-right tabular-nums ${l.strong ? "font-bold text-navy" : ""}`}
                  >
                    {cell(v)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row" className="px-4 py-3 font-medium">
                Employer super (on top)
              </th>
              {per(ft.employerSuper).map((v, i) => (
                <td key={i} className="px-4 py-3 text-right tabular-nums">
                  {cell(v)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-warmgray-light mt-2">
        Resident rates for {SITE_CONFIG.financialYear}, tax-free threshold claimed, no HECS-HELP debt and no
        Medicare Levy Surcharge. Super is the {formatPercent(SUPER_GUARANTEE.rate, 0)} Superannuation
        Guarantee, which your employer pays on top of your wage rather than taking it out. Weekly and
        fortnightly figures are the annual result spread evenly. The tax withheld from each pay follows the
        ATO schedules and rounds a little differently, and the difference comes out in your tax return.
      </p>

      <h3 style={G5_H2} className="text-xl font-bold text-navy mt-8 mb-3">
        {perHourLabel(rate)} an Hour After Tax: Part-Time and Casual
      </h3>
      <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
        <table className="w-full text-sm text-left text-warmgray">
          <thead className="bg-sandstone font-semibold text-navy">
            <tr>
              <th className="px-4 py-3" scope="col">Work pattern</th>
              <th className="px-4 py-3 text-right" scope="col">Per hour after tax</th>
              <th className="px-4 py-3 text-right" scope="col">Week</th>
              <th className="px-4 py-3 text-right" scope="col">Fortnight</th>
              <th className="px-4 py-3 text-right" scope="col">Year</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {rows.map(({ label, f, note }) => (
              <tr key={label}>
                <th scope="row" className="px-4 py-3 font-medium">
                  {label}
                  {note && <span className="block text-xs font-normal text-warmgray-light">{note}</span>}
                </th>
                <td className="px-4 py-3 text-right tabular-nums">{formatAUD(f.perHour, 2)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatAUD(f.perWeek, 2)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatAUD(f.perFortnight, 2)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatAUD(f.takeHomeAnnual)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-warmgray mt-4">
        {pt25Tax === 0 ? (
          <>
            At {pt25.hoursPerWeek} hours a week ({formatAUD(pt25.grossAnnual)} a year) no income tax or
            Medicare levy is payable, so the whole {perHourLabel(rate)} is kept.
          </>
        ) : (
          <>
            Dropping to {pt25.hoursPerWeek} hours a week cuts gross pay by {pct0(grossCut)} but take-home by
            only {pct0(netCut)}, {netCutReason}: you keep{" "}
            {formatAUD(pt25.perHour, 2)} of each hour, against {formatAUD(ft.perHour, 2)} full time.
          </>
        )}{" "}
        A casual on {formatAUD(casual.rate, 2)} an hour takes home {formatAUD(casual.perWeek, 2)} a week for{" "}
        {ft.hoursPerWeek} hours, {formatAUD(casualExtraWeek, 2)} more than a permanent employee on{" "}
        {perHourLabel(rate)}. The loading is paid instead of annual and personal leave. It is 25% in most
        modern awards, but an enterprise agreement can set a different figure, and some rates offered to
        casuals already include it. Check yours on the{" "}
        <Link href="/award-rates/" className={G5_LINK}>
          award rates
        </Link>{" "}
        page or with the{" "}
        <Link href="/casual-loading-calculator/" className={G5_LINK}>
          casual loading calculator
        </Link>
        .
      </p>

      <div className="mt-8">
        <SalaryBandNotes salary={Math.round(ft.grossAnnual)} />
      </div>
    </section>
  );
}

function RateNav({ rate }: { rate: number }) {
  const { prev, next } = prevNextRate(rate);
  const card =
    "block rounded-xl border border-sandstone-dark/20 bg-white p-4 hover:border-eucalyptus transition-colors";
  return (
    <nav aria-label="Neighbouring hourly rates" className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {prev !== null ? (
          <Link href={`/hourly-to-salary/${hourlyRateSlug(prev)}/`} rel="prev" className={card}>
            <span className="block text-xs text-warmgray">← Previous rate</span>
            <span className="font-semibold text-navy">{perHourLabel(prev)} an hour after tax</span>
            <span className="block text-xs text-warmgray mt-1">
              {formatAUD(hourlyAfterTax(prev).perWeek, 2)} a week
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next !== null ? (
          <Link href={`/hourly-to-salary/${hourlyRateSlug(next)}/`} rel="next" className={`${card} text-right`}>
            <span className="block text-xs text-warmgray">Next rate →</span>
            <span className="font-semibold text-navy">{perHourLabel(next)} an hour after tax</span>
            <span className="block text-xs text-warmgray mt-1">
              {formatAUD(hourlyAfterTax(next).perWeek, 2)} a week
            </span>
          </Link>
        ) : (
          <span />
        )}
      </div>
      <p className="text-sm text-warmgray">
        Know the annual figure instead? See{" "}
        <Link href={hubHref("take-home")} className={G5_LINK}>
          take-home pay on every salary
        </Link>
        ,{" "}
        <Link href={hubHref("tax-on")} className={G5_LINK}>
          tax on every salary
        </Link>{" "}
        or{" "}
        <Link href={hubHref("salary-to-hourly")} className={G5_LINK}>
          every salary as an hourly rate
        </Link>
        .
      </p>
    </nav>
  );
}
