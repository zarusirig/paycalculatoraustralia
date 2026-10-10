import React from "react";
import {
  calculatePayBreakdown,
  formatAUD,
  SITE_CONFIG,
  EMPLOYMENT,
} from "@/lib/constants/australian-tax";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SALARY_TO_HOURLY_SALARIES, hasPage, hubHref, prevNext, salaryHref } from "@/lib/data/salary-pages";
import { AWE_RELEASE } from "@/lib/data/average-salary";
import { HOURLY_RATE_MAX, HOURLY_RATE_MIN } from "@/lib/constants/hourly-rates";
import { NMW } from "@/lib/constants/minimum-wage";
import { AWARD_RATE_MAX, AWARD_RATE_MIN } from "@/lib/data/award-rate-index";
import {
  salaryPageAwardRates,
  salaryPageAwardWindow,
  salaryPageHalfWindow,
  salaryPagePayScalePoints,
} from "@/lib/data/hourly-rate-context";
import { AwardRatesNearSection, awardRatesHeading } from "@/modules/programmatic/award-rates-near";
import {
  BelowMinimumWageSection,
  EarningsLine,
  MinimumWageLine,
  PackageHourlySection,
  PartTimeHoursSection,
  PayScaleSection,
  RatePositionSection,
  aboveAwardsLead,
} from "@/modules/programmatic/hourly-rate-context";
import { FaqAnswer } from "@/components/common/faq-accordion";
import { salaryToHourlyFaqs } from "@/modules/programmatic/salary-to-hourly-faqs";
import FeaturedImage from "@/components/common/featured-image";

interface SalaryToHourlyProps {
  salary: number;
}

// Standard Australian working hours — single source of truth in EMPLOYMENT
// so the route and the module cannot drift (they previously did).
const HOURS_PER_YEAR = EMPLOYMENT.hoursPerYear; // 1,976
const WORKING_DAYS_PER_YEAR = 260;

const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const LINK = "text-eucalyptus hover:text-navy transition-colors font-medium";

/**
 * The whole-dollar /hourly-to-salary/ page for the reverse link, or null when
 * the hourly figure is outside the $20–$100 pages (a $30,000 or $200,000+
 * salary), where a "same conversion in reverse" link would mislead.
 */
export function reverseHourlyRate(hourly: number): number | null {
  const r = Math.round(hourly);
  return r >= HOURLY_RATE_MIN && r <= HOURLY_RATE_MAX ? r : null;
}

/**
 * Second pass, 10 Oct 2026: the after-tax table (a repeat of the breakdown's
 * hourly and annual rows), the ABS paragraph, the neighbour table and the
 * award disclaimer paragraph were cut to a line each; sections now depend on
 * the salary (modules/programmatic/hourly-rate-context.tsx): minimum-wage
 * hours under a full-time casual minimum, award rows only within 50c of the
 * hourly figure, super-inclusive hourly rate above it, contract day rate from
 * $60 an hour.
 */
export function SalaryToHourly({ salary }: SalaryToHourlyProps) {
  const SOURCES_LIST: SourceLink[] = [
    { title: "National Minimum Wage", url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages", publisher: "Fair Work Ombudsman" },
    { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: "ATO" },
    { title: `${AWE_RELEASE.title}, ${AWE_RELEASE.referencePeriod}`, url: AWE_RELEASE.url, publisher: "ABS" },
  ];

  // No HECS in the headline: the hero says "after tax", and the page title
  // quotes these figures. The loan case is stated separately from `withHecs`.
  const breakdown = calculatePayBreakdown({ grossSalary: salary });
  const withHecs = calculatePayBreakdown({ grossSalary: salary, includeHECS: true });

  const formattedSalary = formatAUD(salary);

  // Hourly rate calculations
  const grossHourly = salary / HOURS_PER_YEAR;
  const netHourly = breakdown.takeHomePay / HOURS_PER_YEAR;
  const hourlyLabel = formatAUD(grossHourly, 2);

  // Frequency breakdowns (gross)
  const grossDaily = salary / WORKING_DAYS_PER_YEAR;
  const grossWeekly = salary / 52;
  const grossFortnightly = salary / 26;
  const grossMonthly = salary / 12;

  // Frequency breakdowns (net)
  const netDaily = breakdown.takeHomePay / WORKING_DAYS_PER_YEAR;

  const isGridPage = SALARY_TO_HOURLY_SALARIES.includes(salary);
  const reverse = reverseHourlyRate(grossHourly);
  const awardWindow = salaryPageAwardWindow(salary);
  const near = salaryPageAwardRates(salary);
  const salaryWindow = salaryPageHalfWindow(salary);
  const aboveAwards = grossHourly > AWARD_RATE_MAX.hourly;
  const points = salaryPagePayScalePoints(salary);
  const scales = points.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 10 Oct 2026: the "$1,000 rise" intro (the take-home page has it) and the badge strip went, as on
          /hourly-to-salary/; HECS is in the calculation line where it applies */}
      <FeaturedImage lazy className="mt-0" />

      {/* Hourly Rate Breakdown */}
      <section>
        <h2 style={H2} className="text-2xl font-bold text-navy mb-4">Hourly Rate Breakdown for {formattedSalary}</h2>
        <Card className="overflow-hidden border-sandstone-dark/10 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-sandstone text-navy font-semibold border-b border-sandstone-dark/10">
                <tr>
                  <th className="px-6 py-4">Frequency</th>
                  <th className="px-6 py-4 text-right">Gross (Before Tax)</th>
                  <th className="px-6 py-4 text-right">Net (After Tax)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                <tr className="bg-eucalyptus-dark text-white font-bold">
                  <td className="px-6 py-5">Hourly (38 hrs/wk)</td>
                  <td className="px-6 py-5 text-right">{hourlyLabel}</td>
                  <td className="px-6 py-5 text-right">{formatAUD(netHourly, 2)}</td>
                </tr>
                <tr className="hover:bg-sandstone/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy">Daily (7.6 hrs)</td>
                  <td className="px-6 py-4 text-right">{formatAUD(grossDaily, 2)}</td>
                  <td className="px-6 py-4 text-right">{formatAUD(netDaily, 2)}</td>
                </tr>
                <tr className="hover:bg-sandstone/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy">Weekly</td>
                  <td className="px-6 py-4 text-right">{formatAUD(grossWeekly)}</td>
                  <td className="px-6 py-4 text-right">{formatAUD(breakdown.weekly)}</td>
                </tr>
                <tr className="hover:bg-sandstone/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy">Fortnightly</td>
                  <td className="px-6 py-4 text-right">{formatAUD(grossFortnightly)}</td>
                  <td className="px-6 py-4 text-right">{formatAUD(breakdown.fortnightly)}</td>
                </tr>
                <tr className="hover:bg-sandstone/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy">Monthly</td>
                  <td className="px-6 py-4 text-right">{formatAUD(grossMonthly)}</td>
                  <td className="px-6 py-4 text-right">{formatAUD(breakdown.monthly)}</td>
                </tr>
                <tr className="hover:bg-sandstone/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy">Annual</td>
                  <td className="px-6 py-4 text-right">{formatAUD(salary)}</td>
                  <td className="px-6 py-4 text-right">{formatAUD(breakdown.takeHomePay)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-4 text-sm text-warmgray">
          Of each {hourlyLabel} hour, {formatAUD(breakdown.netIncomeTax / HOURS_PER_YEAR, 2)} goes in income tax and{" "}
          {formatAUD(breakdown.medicareLevy / HOURS_PER_YEAR, 2)} in Medicare levy, leaving {formatAUD(netHourly, 2)}.
          {withHecs.hecsRepayment > 0
            ? ` With a HECS-HELP debt, the compulsory repayment takes that to ${formatAUD(withHecs.takeHomePay / HOURS_PER_YEAR, 2)}.`
            : ""}{" "}
          FY{SITE_CONFIG.financialYear} resident rates, no Medicare Levy Surcharge (
          <a href="/hourly-to-annual-salary-calculator/#salary-to-hourly" className={LINK}>
            method in full
          </a>
          ).
        </p>
      </section>

      {/* Under a full-time casual minimum: the hours a week this salary is at minimum rates */}
      <PartTimeHoursSection salary={salary} />
      {/* Under the adult minimum as a full-time rate: the junior and apprentice minimums it would meet */}
      <BelowMinimumWageSection rate={grossHourly} label={hourlyLabel} salary={salary} variant="salary" />

      {/* Award minimums within half the hourly gap to the neighbouring pages, or where it sits against them */}
      {near.matches.length > 0 ? (
        <AwardRatesNearSection
          id="award-rates"
          heading={awardRatesHeading(near, hourlyLabel, "rates")}
          label={hourlyLabel}
          near={near}
          intro={
            <>
              {grossHourly >= NMW.hourly ? <MinimumWageLine rate={grossHourly} label={hourlyLabel} /> : null}
              <EarningsLine salary={salary} />
            </>
          }
        />
      ) : aboveAwards && scales ? null : grossHourly >= AWARD_RATE_MIN.hourly ? (
        <RatePositionSection rate={grossHourly} label={hourlyLabel} salary={salary} window={awardWindow} />
      ) : (
        <div className="text-warmgray">
          <EarningsLine salary={salary} />
        </div>
      )}

      {/* Public sector, defence, teaching, nursing and specialist pay points between this page and its
          neighbours; above every award it also carries the award ceiling and the ABS line */}
      <PayScaleSection
        points={points}
        annual={salary}
        halfWindow={salaryWindow}
        lead={aboveAwards ? aboveAwardsLead(grossHourly, hourlyLabel) : undefined}
      >
        {aboveAwards ? <EarningsLine salary={salary} /> : null}
      </PayScaleSection>

      {/* Above it: the hourly rate including super, and the matching contract day rate from $60 an hour */}
      <PackageHourlySection salary={salary} />

      {isGridPage && <SalaryHourlyNav salary={salary} />}

      <p className="text-sm text-warmgray">
        {reverse !== null ? (
          <>
            Reverse:{" "}
            <a href={`/hourly-to-salary/${reverse}/`} className={LINK}>
              {formatAUD(reverse)} an hour is how much a year
            </a>
            .{" "}
          </>
        ) : null}
        Other figures:{" "}
        <a href="/hourly-to-annual-salary-calculator/" className={LINK}>
          hourly to annual salary calculator
        </a>
        .
      </p>

      {/* FAQs */}
      <section>
        <h2 style={H2} className="text-2xl font-bold text-navy mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {salaryToHourlyFaqs(salary).map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i + 1}`} className="bg-white border rounded-lg px-4 shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-navy py-4 hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-warmgray pb-4 leading-relaxed">
                <FaqAnswer faq={f} linkClassName="text-eucalyptus hover:text-navy transition-colors font-medium" />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
    </div>
  );
}

/**
 * Previous / next salary, the same salary on the take-home and tax pages, and
 * the hub. (10 Oct 2026: replaces the shared SalaryNav here, whose six
 * neighbour chips repeated the previous and next links.)
 */
function SalaryHourlyNav({ salary }: { salary: number }) {
  const { prev, next } = prevNext("salary-to-hourly", salary);
  const card = "block rounded-xl border border-sandstone-dark/20 p-4 hover:bg-sandstone transition-colors";
  const s = formatAUD(salary);
  return (
    <nav aria-label="Nearby salaries" className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {prev !== null ? (
          <a href={salaryHref("salary-to-hourly", prev)} rel="prev" className={card}>
            <span className="block text-xs text-warmgray">← Previous</span>
            <span className="font-semibold text-navy">{formatAUD(prev)} a year to hourly</span>
          </a>
        ) : (
          <span />
        )}
        {next !== null ? (
          <a href={salaryHref("salary-to-hourly", next)} rel="next" className={`${card} text-right`}>
            <span className="block text-xs text-warmgray">Next →</span>
            <span className="font-semibold text-navy">{formatAUD(next)} a year to hourly</span>
          </a>
        ) : (
          <span />
        )}
      </div>
      <p className="text-sm text-warmgray">
        {hasPage("take-home", salary) ? (
          <>
            <a href={salaryHref("take-home", salary)} className={LINK}>
              {s} after tax
            </a>
            {" · "}
          </>
        ) : null}
        {hasPage("tax-on", salary) ? (
          <>
            <a href={salaryHref("tax-on", salary)} className={LINK}>
              Tax on {s}
            </a>
            {" · "}
          </>
        ) : null}
        <a href={hubHref("salary-to-hourly")} className={LINK}>
          Every salary as an hourly rate
        </a>
      </p>
    </nav>
  );
}
