import Link from "next/link";
import { HOURLY_RATE_PAGES, hourlyRateFromSlug, hourlyRateSlug } from "@/lib/constants/hourly-rates";
// G5: after-tax section, prev/next links and band notes
import {
  AFTER_TAX_PART_TIME_HOURS,
  casualAfterTax,
  hourlyAfterTax,
  prevNextRate,
  type HourlyAfterTax,
} from "@/lib/constants/hourly-rates";
import { hubHref, salaryFacts } from "@/lib/data/salary-pages";
import { EarningsPosition, SalaryBandNotes } from "@/modules/programmatic/salary-page-sections";
import {
  calculatePayBreakdown,
  formatAUD,
  formatNegAUD,
  formatPercent,
  EMPLOYMENT,
  SITE_CONFIG,
  SUPER_GUARANTEE,
} from "@/lib/constants/australian-tax";
import { nearestSalary } from "@/lib/data/salary-pages";
import { NMW, NMW_DECISION } from "@/lib/constants/minimum-wage";
import { CASUAL_LOADING } from "@/lib/constants/junior-rates";
import { awardRatesNear } from "@/lib/data/award-rate-index";
import {
  AwardRatesNearSection,
  awardRatesFaqAnswer,
  awardRatesHeading,
} from "@/modules/programmatic/award-rates-near";
import type { FaqItem } from "@/lib/faq";
import FeaturedImage from "@/components/common/featured-image";

const WEEKS: number = EMPLOYMENT.weeksPerYear;
// Widened from the `as const` literal 38 so it can be used as a default
// parameter that callers may override with other hours-per-week values.
const STANDARD_HOURS: number = EMPLOYMENT.standardWeeklyHours;

/** Hours-per-week variants shown on every page. 38 is the standard full-time week. */
const HOURS_VARIANTS = [20, 25, 30, 35, 38, 40, 45, 50];

/**
 * The rate inventory lives in lib/constants/hourly-rates.ts (every whole
 * dollar $20–$100 since the 10 Oct 2026 prune). It is re-exported here under
 * the name the routes, sitemap and site directory already import.
 */
export const ALL_RATES: readonly number[] = HOURLY_RATE_PAGES;
export { hourlyRateSlug, hourlyRateFromSlug };

export function annualFromHourly(hourly: number, hoursPerWeek = STANDARD_HOURS): number {
  return hourly * hoursPerWeek * WEEKS;
}

const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const LINK = "text-eucalyptus-dark hover:underline";

/** "$35" for whole-dollar rates, "$26.44" otherwise. */
function perHourLabel(r: number): string {
  return Number.isInteger(r) ? formatAUD(r) : formatAUD(r, 2);
}

const pct0 = (v: number) => `${Math.round(v * 100)}%`;
const round2 = (n: number) => Math.round(n * 100) / 100;

interface HourlyToSalaryProps {
  rate: number;
}

export function HourlyToSalary({ rate }: HourlyToSalaryProps) {
  const gross = annualFromHourly(rate);
  const label = perHourLabel(rate);

  // 10 Oct 2026: the separate "by pay period" table repeated the gross and
  // take-home rows of the after-tax table, so the two were merged (a Day
  // column was added there) and the award section moved up.
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <FeaturedImage className="mt-0 mb-12" />
      {/* ── G5: after-tax breakdown (the answer table) ── */}
      <HourlyAfterTaxSection rate={rate} />

      {/* ── Award minimums near this rate (10 Oct 2026) ── */}
      <HourlyAwardSection rate={rate} />

      {/* ── G5: part-time and casual after tax, and what applies at this income ── */}
      <HourlyPartTimeSection rate={rate} />

      {/* ── Hours variants ── */}
      <section>
        <h2 style={H2} className="text-2xl font-bold text-navy mb-4">
          {label} an Hour by Hours Worked
        </h2>
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

      {/* ── G5: prev / next rate, the reverse pages and the salary hubs ── */}
      <RateNav rate={rate} gross={gross} />
    </div>
  );
}

/**
 * Nearest salary that has a /salary-to-hourly/ page, for the reverse link.
 * Reads the shared grid in lib/data/salary-pages ($5k steps since 10 Oct 2026).
 */
export function roundToSalaryStep(salary: number): number {
  return nearestSalary("salary-to-hourly", salary);
}

/** Nearest salary that has a /take-home-pay-on/ page (shared grid, lib/data/salary-pages). */
export function roundToTakeHomeStep(salary: number): number {
  return nearestSalary("take-home", salary);
}

// =============================================================================
// Award minimums near the rate (10 Oct 2026). Rows from
// lib/data/award-rate-index.ts; the minimum wage from lib/constants/minimum-wage.ts.
// =============================================================================

/** The FAQ entry that goes with the award section (same text, so JSON-LD and page agree). */
export function hourlyAwardFaq(rate: number): FaqItem {
  const label = perHourLabel(rate);
  return {
    q: `Which award jobs have a minimum rate of about ${label} an hour?`,
    a: awardRatesFaqAnswer(awardRatesNear(rate), label),
  };
}

function HourlyAwardSection({ rate }: { rate: number }) {
  const label = perHourLabel(rate);
  const near = awardRatesNear(rate);
  const vsNmw = round2(rate - NMW.hourly);
  const casual = round2(rate * (1 + CASUAL_LOADING));
  const nmw = formatAUD(NMW.hourly, 2);
  return (
    <AwardRatesNearSection
      id="award-rates"
      heading={awardRatesHeading(near, label, "jobs")}
      label={label}
      near={near}
      showCasual
      intro={
        <>
        <p>
          {vsNmw >= 0 ? (
            <>
              {label} an hour is {formatAUD(vsNmw, 2)} ({pct0(vsNmw / NMW.hourly)}) above the{" "}
              <Link href="/minimum-wage-australia/" className={LINK}>
                national minimum wage
              </Link>{" "}
              of {nmw} an hour, the adult rate from {NMW_DECISION.operativeFrom} ({NMW_DECISION.name},{" "}
              {NMW_DECISION.citation}).
            </>
          ) : (
            <>
              {label} an hour is {formatAUD(-vsNmw, 2)} below the{" "}
              <Link href="/minimum-wage-australia/" className={LINK}>
                national minimum wage
              </Link>{" "}
              of {nmw} an hour that has applied to adults since {NMW_DECISION.operativeFrom}. Below that, check
              whether you are on an award entry rate (the lowest is listed below), a{" "}
              <Link href="/junior-pay-rates/" className={LINK}>
                junior
              </Link>
              , apprentice or trainee rate, or the supported wage; otherwise it may be an underpayment.
            </>
          )}{" "}
          As a casual, the {pct0(CASUAL_LOADING)} loading makes the same base rate {formatAUD(casual, 2)} an hour.
        </p>
        <EarningsPosition salary={annualFromHourly(rate)} />
        </>
      }
    />
  );
}

// =============================================================================
// G5 — "$N an hour after tax" section and prev/next rate links.
//
// The after-tax phrasing gets ~170 searches a month across $20–$80 and Google
// ranks the rate's /hourly-to-salary/ page for it, so the after-tax view lives
// here instead of on a second URL family
// (docs/seo/2026-09-24-hourly-after-tax-demand.md).
// =============================================================================

function HourlyAfterTaxSection({ rate }: { rate: number }) {
  const ft = hourlyAfterTax(rate);
  const hoursYear = ft.hoursPerWeek * WEEKS;
  const label = perHourLabel(rate);
  // Effective and marginal rates and the HECS-HELP case, from the same engine.
  const breakdown = calculatePayBreakdown({ grossSalary: ft.grossAnnual });
  const withHecs = calculatePayBreakdown({ grossSalary: ft.grossAnnual, includeHECS: true });

  // Lines of the full-time breakdown, each shown per hour / day / week / fortnight / month / year.
  const lines: { label: string; annual: number; strong?: boolean }[] = [
    { label: "Gross pay", annual: ft.grossAnnual },
    { label: "Income tax (after LITO)", annual: -ft.incomeTax },
    { label: "Medicare levy", annual: -ft.medicareLevy },
    { label: "Take-home pay", annual: ft.takeHomeAnnual, strong: true },
  ];
  const per = (annual: number) => [
    annual / hoursYear,
    annual / (WEEKS * 5),
    annual / WEEKS,
    annual / (WEEKS / 2),
    annual / 12,
    annual,
  ];
  const cell = (v: number) => (v < 0 ? formatNegAUD(-v, 2, "−") : formatAUD(v, 2));

  return (
    <section aria-labelledby="after-tax-heading">
      <h2 id="after-tax-heading" style={H2} className="text-2xl font-bold text-navy mb-4">
        {label} an Hour After Tax
      </h2>
      <p className="text-warmgray mb-4">
        {label} an hour after tax is{" "}
        <strong className="text-navy">{formatAUD(ft.perWeek, 2)} a week</strong>,{" "}
        {formatAUD(ft.perFortnight, 2)} a fortnight, {formatAUD(ft.perMonth, 2)} a month and{" "}
        {formatAUD(ft.takeHomeAnnual)} a year on a {ft.hoursPerWeek}-hour week in {SITE_CONFIG.financialYear}.
        You keep {formatAUD(ft.perHour, 2)} of every hour worked. At {formatAUD(ft.grossAnnual)} a year the
        effective tax rate is {formatPercent(breakdown.effectiveTaxRate)}, and the next dollar is taxed at{" "}
        {formatPercent(breakdown.marginalTaxRate, 0)}.
      </p>

      <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
        <table className="w-full text-sm text-left text-warmgray">
          <caption className="sr-only">
            {label} an hour before and after tax per hour, day, week, fortnight, month and year
          </caption>
          <thead className="bg-sandstone font-semibold text-navy">
            <tr>
              <th className="px-4 py-3" scope="col">
                {ft.hoursPerWeek} hrs a week
              </th>
              <th className="px-4 py-3 text-right" scope="col">Hour</th>
              <th className="px-4 py-3 text-right" scope="col">Day</th>
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
        {SITE_CONFIG.financialYear} resident rates, tax-free threshold claimed, no Medicare Levy Surcharge; the{" "}
        {formatPercent(SUPER_GUARANTEE.rate, 0)} super is paid on top.
        {withHecs.hecsRepayment > 0
          ? ` With a HECS-HELP debt, the compulsory repayment of ${formatAUD(withHecs.hecsRepayment)} brings the year to ${formatAUD(withHecs.takeHomePay)}.`
          : " A HECS-HELP debt would not change these figures: the income is under the repayment threshold."}{" "}
        Each pay&apos;s withholding follows the{" "}
        <Link href="/payg-withholding-tables/" className={LINK}>
          ATO tax tables
        </Link>{" "}
        and can differ by a few dollars.
      </p>
    </section>
  );
}

function HourlyPartTimeSection({ rate }: { rate: number }) {
  const ft = hourlyAfterTax(rate);
  const partTime = AFTER_TAX_PART_TIME_HOURS.map((h) => hourlyAfterTax(rate, h));
  const casual = casualAfterTax(rate);

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
    <section aria-labelledby="part-time-heading">
      <h2 id="part-time-heading" style={H2} className="text-2xl font-bold text-navy mb-4">
        {perHourLabel(rate)} an Hour After Tax: Part-Time and Casual
      </h2>
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
        {perHourLabel(rate)}, in place of paid leave (
        <Link href="/casual-loading-calculator/" className={LINK}>
          how the loading works
        </Link>
        ).
      </p>

      <div className="mt-8">
        <SalaryBandNotes salary={Math.round(ft.grossAnnual)} />
      </div>
    </section>
  );
}

function RateNav({ rate, gross }: { rate: number; gross: number }) {
  const { prev, next } = prevNextRate(rate);
  const reverse = roundToSalaryStep(gross);
  const takeHome = roundToTakeHomeStep(gross);
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
        Nearest salaries:{" "}
        <Link href={`/salary-to-hourly/${reverse}/`} className={LINK}>
          {formatAUD(reverse)} a year as an hourly rate
        </Link>{" "}
        ·{" "}
        <Link href={`/take-home-pay-on/${takeHome}/`} className={LINK}>
          take-home pay on {formatAUD(takeHome)}
        </Link>
        . Any rate or hours:{" "}
        <Link href="/hourly-to-annual-salary-calculator/" className={LINK}>
          hourly to annual salary calculator
        </Link>
        . Every salary:{" "}
        <Link href={hubHref("take-home")} className={LINK}>
          take-home
        </Link>
        ,{" "}
        <Link href={hubHref("tax-on")} className={LINK}>
          tax
        </Link>
        ,{" "}
        <Link href={hubHref("salary-to-hourly")} className={LINK}>
          hourly
        </Link>
        .
      </p>
    </nav>
  );
}
