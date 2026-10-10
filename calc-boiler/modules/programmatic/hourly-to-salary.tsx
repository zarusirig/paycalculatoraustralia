import Link from "next/link";
import { HOURLY_RATE_PAGES, hourlyRateFromSlug, hourlyRateSlug } from "@/lib/constants/hourly-rates";
// G5: after-tax section, prev/next links and band notes
import { casualAfterTax, hourlyAfterTax, prevNextRate, type HourlyAfterTax } from "@/lib/constants/hourly-rates";
import { hubHref, salaryFacts } from "@/lib/data/salary-pages";
import {
  calculatePayBreakdown,
  formatAUD,
  formatNegAUD,
  formatPercent,
  EMPLOYMENT,
  SITE_CONFIG,
} from "@/lib/constants/australian-tax";
import { nearestSalary } from "@/lib/data/salary-pages";
import { NMW } from "@/lib/constants/minimum-wage";
import { AWARD_RATE_MAX, AWARD_RATE_MIN } from "@/lib/data/award-rate-index";
import {
  HOURLY_PAGE_HALF_WINDOW,
  hourlyPageAwardRates,
  hourlyPagePayScalePoints,
} from "@/lib/data/hourly-rate-context";
import { AwardRatesNearSection, awardRatesHeading } from "@/modules/programmatic/award-rates-near";
import {
  BelowMinimumWageSection,
  CasualEquivalentSection,
  ContractorRateSection,
  EarningsLine,
  MinimumWageLine,
  PayScaleSection,
  aboveAwardsLead,
  PenaltyRatesSection,
  RatePositionSection,
} from "@/modules/programmatic/hourly-rate-context";
import FeaturedImage from "@/components/common/featured-image";

const WEEKS: number = EMPLOYMENT.weeksPerYear;
// Widened from the `as const` literal 38 so it can be used as a default
// parameter that callers may override with other hours-per-week values.
const STANDARD_HOURS: number = EMPLOYMENT.standardWeeklyHours;

/**
 * Hours-per-week rows in the "by hours worked" table. 38 is the standard
 * full-time week; 20 and 25 are the part-time rows the after-tax FAQ quotes
 * (AFTER_TAX_PART_TIME_HOURS).
 */
const HOURS_VARIANTS = [20, 25, 30, 38, 45];

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

interface HourlyToSalaryProps {
  rate: number;
}

/**
 * Second pass, 10 Oct 2026: sections now appear only where their fact applies
 * (modules/programmatic/hourly-rate-context.tsx) — the below-minimum warning
 * under $26.44, award rows only within 50c, casual equivalents, penalty and
 * overtime dollars on the nearest award classification, contractor context
 * from $60 — and the passages every rate repeated (the ABS paragraph, the
 * band notes, the separate part-time table) were cut to a line and a link.
 */
export function HourlyToSalary({ rate }: HourlyToSalaryProps) {
  const gross = annualFromHourly(rate);
  const label = perHourLabel(rate);
  const near = hourlyPageAwardRates(rate);
  const aboveAwards = rate > AWARD_RATE_MAX.hourly;
  const points = hourlyPagePayScalePoints(rate);
  const scales = points.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <FeaturedImage className="mt-0 mb-12" />
      {/* ── G5: after-tax breakdown (the answer table) ── */}
      <HourlyAfterTaxSection rate={rate} />

      {/* ── Under $26.44: warning, junior and apprentice minimums ── */}
      <BelowMinimumWageSection rate={rate} label={label} salary={gross} />

      {/* ── Award minimums within 50c, or where the rate sits against them ── */}
      {near.matches.length > 0 ? (
        <AwardRatesNearSection
          id="award-rates"
          heading={awardRatesHeading(near, label, "jobs")}
          label={label}
          near={near}
          showCasual
          intro={
            rate >= NMW.hourly ? (
              <>
                <MinimumWageLine rate={rate} label={label} />
                <EarningsLine salary={gross} />
              </>
            ) : null
          }
        />
      ) : rate >= AWARD_RATE_MIN.hourly && !(aboveAwards && scales) ? (
        <RatePositionSection rate={rate} label={label} salary={gross} />
      ) : null}

      {/* ── Public sector, defence, teaching, nursing and specialist pay points within $988;
             above every award it also carries the award ceiling and the ABS line ── */}
      <PayScaleSection
        points={points}
        annual={gross}
        halfWindow={HOURLY_PAGE_HALF_WINDOW}
        lead={aboveAwards ? aboveAwardsLead(rate, label, gross) : `${label} an hour full time is ${formatAUD(gross)} a year.`}
      >
        {aboveAwards ? <EarningsLine salary={gross} /> : null}
      </PayScaleSection>

      <CasualEquivalentSection rate={rate} label={label} />
      <PenaltyRatesSection rate={rate} label={label} />
      <ContractorRateSection rate={rate} label={label} />

      {/* ── Hours worked, part-time and casual (merged 10 Oct 2026) ── */}
      <HourlyHoursSection rate={rate} />

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
        <strong className="text-navy">{formatAUD(ft.perWeek, 2)} a week</strong> on a {ft.hoursPerWeek}-hour week:
        you keep {formatAUD(ft.perHour, 2)} of every hour. The effective tax rate is{" "}
        {formatPercent(breakdown.effectiveTaxRate)}, and the next dollar is taxed at{" "}
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
      {/* 10 Oct 2026: one line; the HECS sentence only where a repayment is due. */}
      <p className="text-xs text-warmgray-light mt-2">
        {SITE_CONFIG.financialYear} resident rates, tax-free threshold claimed;{" "}
        <Link href="/payg-withholding-tables/" className={LINK}>
          each pay&apos;s withholding
        </Link>{" "}
        can differ by a few dollars.
        {withHecs.hecsRepayment > 0
          ? ` With a HECS-HELP debt, the compulsory repayment of ${formatAUD(withHecs.hecsRepayment)} brings the year to ${formatAUD(withHecs.takeHomePay)}.`
          : ""}
      </p>
    </section>
  );
}

/** Rows of the hours table: standard hour patterns, then the same rate as a casual. */
function hoursRows(rate: number): { label: string; f: HourlyAfterTax; note?: string }[] {
  const casual = casualAfterTax(rate);
  return [
    ...HOURS_VARIANTS.map((h) => ({
      label: h === STANDARD_HOURS ? `${h} (full time)` : String(h),
      f: hourlyAfterTax(rate, h),
    })),
    {
      label: `${STANDARD_HOURS} as a casual`,
      f: casual,
      note: `${formatAUD(casual.rate, 2)} an hour: ${perHourLabel(rate)} plus ${formatPercent(EMPLOYMENT.casualLoading, 0)}`,
    },
  ];
}

function HourlyHoursSection({ rate }: { rate: number }) {
  const label = perHourLabel(rate);
  const ft = hourlyAfterTax(rate);
  const pt25 = hourlyAfterTax(rate, 25);

  // The part-time line names what actually happens to the tax at 25 hours:
  // a lower top bracket, or (same bracket) the tax-free threshold and offsets
  // covering more of a smaller income.
  const grossCut = 1 - pt25.grossAnnual / ft.grossAnnual;
  const netCut = 1 - pt25.takeHomeAnnual / ft.takeHomeAnnual;
  const pt25Tax = pt25.incomeTax + pt25.medicareLevy;
  const ftFacts = salaryFacts(Math.round(ft.grossAnnual));
  const ptFacts = salaryFacts(Math.round(pt25.grossAnnual));
  const netCutReason =
    ptFacts.bracketIndex < ftFacts.bracketIndex
      ? `because the part-time income (${formatAUD(pt25.grossAnnual)}) tops out in the ${formatPercent(ptFacts.bracketRate, 0)} bracket and no longer reaches the ${formatPercent(ftFacts.bracketRate, 0)} rate`
      : `because the tax-free threshold${ptFacts.breakdown.litoOffset > 0 ? " and the Low Income Tax Offset cover" : " covers"} a bigger share of the smaller income (both sit in the ${formatPercent(ftFacts.bracketRate, 0)} bracket)`;

  // The tax that applies at full time, in one line; every threshold is on the take-home page.
  const takeHome = roundToTakeHomeStep(ft.grossAnnual);
  const nextStart = ftFacts.nextBracketStart;

  return (
    <section aria-labelledby="hours-heading">
      <h2 id="hours-heading" style={H2} className="text-2xl font-bold text-navy mb-4">
        {label} an Hour by Hours Worked
      </h2>
      <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
        <table className="w-full text-sm text-left text-warmgray">
          <thead className="bg-sandstone font-semibold text-navy">
            <tr>
              <th className="px-4 py-3" scope="col">Hours a week</th>
              <th className="px-4 py-3 text-right" scope="col">Week before tax</th>
              <th className="px-4 py-3 text-right" scope="col">Week after tax</th>
              <th className="px-4 py-3 text-right" scope="col">Year before tax</th>
              <th className="px-4 py-3 text-right" scope="col">Year after tax</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {hoursRows(rate).map(({ label: rowLabel, f, note }) => (
              <tr key={rowLabel} className={f.hoursPerWeek === STANDARD_HOURS && !note ? "bg-eucalyptus-light/40" : ""}>
                <th scope="row" className="px-4 py-3 font-medium">
                  {rowLabel}
                  {note && <span className="block text-xs font-normal text-warmgray-light">{note}</span>}
                </th>
                <td className="px-4 py-3 text-right tabular-nums">{formatAUD(f.rate * f.hoursPerWeek, 2)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatAUD(f.perWeek, 2)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatAUD(f.grossAnnual)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatAUD(f.takeHomeAnnual)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-warmgray mt-4">
        {pt25Tax === 0 ? (
          <>
            At {pt25.hoursPerWeek} hours a week ({formatAUD(pt25.grossAnnual)} a year) no income tax or Medicare
            levy is payable, so the whole {label} is kept.
          </>
        ) : (
          <>
            Dropping to {pt25.hoursPerWeek} hours a week cuts gross pay by {pct0(grossCut)} but take-home by only{" "}
            {pct0(netCut)}, {netCutReason}: you keep {formatAUD(pt25.perHour, 2)} of each hour, against{" "}
            {formatAUD(ft.perHour, 2)} full time.
          </>
        )}{" "}
        {nextStart !== null && ftFacts.nextBracketRate !== null
          ? `The ${formatPercent(ftFacts.nextBracketRate, 0)} rate starts above ${formatAUD(nextStart - 1)}, ${formatAUD((nextStart - 1) / EMPLOYMENT.hoursPerYear, 2)} an hour full time`
          : `Full time, the top slice is taxed at the ${formatPercent(ftFacts.bracketRate, 0)} top rate`}
        {ftFacts.mls.tier > 0
          ? `. Without private hospital cover the Medicare Levy Surcharge (tier ${ftFacts.mls.tier}) would add ${formatAUD(ftFacts.mls.amount)} a year`
          : ""}
        . Every threshold at this income:{" "}
        <Link href={`/take-home-pay-on/${takeHome}/`} className={LINK}>
          take-home pay on {formatAUD(takeHome)}
        </Link>
        .
      </p>
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
