import React from "react";
import {
  calculatePayBreakdown,
  formatAUD,
  formatNegAUD,
  SITE_CONFIG,
  EMPLOYMENT,
} from "@/lib/constants/australian-tax";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { salaryFacts, SALARY_TO_HOURLY_SALARIES } from "@/lib/data/salary-pages";
import { AWE_RELEASE } from "@/lib/data/average-salary";
import { HOURLY_RATE_MAX, HOURLY_RATE_MIN } from "@/lib/constants/hourly-rates";
import { NMW, NMW_DECISION } from "@/lib/constants/minimum-wage";
import { awardRatesNear } from "@/lib/data/award-rate-index";
import { AwardRatesNearSection, awardRatesHeading } from "@/modules/programmatic/award-rates-near";
import { EarningsPosition, NeighbourTable, SalaryNav } from "@/modules/programmatic/salary-page-sections";
import { FaqAnswer } from "@/components/common/faq-accordion";
import { salaryToHourlyFaqs } from "@/modules/programmatic/salary-to-hourly-faqs";
import FeaturedImage from "@/components/common/featured-image";

interface SalaryToHourlyProps {
  salary: number;
}

// Standard Australian working hours — single source of truth in EMPLOYMENT
// so the route and the module cannot drift (they previously did).
const HOURS_PER_WEEK = EMPLOYMENT.standardWeeklyHours;
const WEEKS_PER_YEAR = EMPLOYMENT.weeksPerYear;
const HOURS_PER_YEAR = EMPLOYMENT.hoursPerYear; // 1,976
const WORKING_DAYS_PER_YEAR = 260;

const MINIMUM_WAGE_HOURLY = NMW.hourly; // $26.44

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

  // Comparisons (the ABS average and percentile come from EarningsPosition)
  const hourlyVsMinimum = grossHourly / MINIMUM_WAGE_HOURLY;

  // Engine-derived facts (SG capped at the maximum contribution base).
  const facts = salaryFacts(salary);
  const employerSuper = facts.employerSuper;
  const belowMinimum = grossHourly < MINIMUM_WAGE_HOURLY;
  // Hours a week this salary buys at the national minimum wage — the honest
  // reading of a salary that is below the full-time minimum.
  const hoursAtMinimum = salary / WEEKS_PER_YEAR / MINIMUM_WAGE_HOURLY;
  const fullTimeMinimumAnnual = NMW.weekly * WEEKS_PER_YEAR;
  // A $1,000-a-year rise, expressed per hour.
  const perHourGrossOf1k = 1_000 / HOURS_PER_YEAR;
  const perHourNetOf1k = facts.nextThousand.takeHome / HOURS_PER_YEAR;
  const isGridPage = SALARY_TO_HOURLY_SALARIES.includes(salary);
  const reverse = reverseHourlyRate(grossHourly);
  const near = awardRatesNear(grossHourly);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Introduction: only what the hero does not already say */}
      <section className="prose prose-eucalyptus max-w-none">
        <p className="text-lg text-navy leading-relaxed">
          At {formattedSalary}, every extra $1,000 a year is worth {formatAUD(perHourGrossOf1k, 2)} an hour before tax and{" "}
          <strong>{formatAUD(perHourNetOf1k, 2)} an hour after tax</strong>.
          {withHecs.hecsRepayment > 0
            ? ` With a HECS-HELP debt, the compulsory repayment takes the after-tax rate to ${formatAUD(withHecs.takeHomePay / HOURS_PER_YEAR, 2)} an hour.`
            : " A HECS-HELP debt would not change the after-tax rate: this salary is under the repayment threshold."}
        </p>
      </section>

      <TrustBar />
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
          Calculation: {formattedSalary} / (38 hours x 52 weeks) = {hourlyLabel}/hour. After-tax hourly rate accounts for {formatAUD(breakdown.netIncomeTax)} income tax and {formatAUD(breakdown.medicareLevy)} Medicare levy.
        </p>
      </section>

      {/* After-Tax Hourly Rate */}
      <section>
        <h2 style={H2} className="text-2xl font-bold text-navy mb-4">After-Tax Hourly Rate on {formattedSalary}</h2>
        <Card className="overflow-hidden border-sandstone-dark/10 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-sandstone text-navy font-semibold border-b border-sandstone-dark/10">
                <tr>
                  <th className="px-6 py-4">Component</th>
                  <th className="px-6 py-4 text-right">Per Hour</th>
                  <th className="px-6 py-4 text-right">Per Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                <tr className="hover:bg-sandstone/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy">Gross Pay</td>
                  <td className="px-6 py-4 text-right font-medium">{hourlyLabel}</td>
                  <td className="px-6 py-4 text-right">{formatAUD(salary)}</td>
                </tr>
                <tr className="hover:bg-sandstone/30 transition-colors text-ochre">
                  <td className="px-6 py-4">Income Tax</td>
                  <td className="px-6 py-4 text-right">{formatNegAUD(breakdown.netIncomeTax / HOURS_PER_YEAR, 2, "−")}</td>
                  <td className="px-6 py-4 text-right">{formatNegAUD(breakdown.netIncomeTax, 0, "−")}</td>
                </tr>
                <tr className="hover:bg-sandstone/30 transition-colors text-ochre">
                  <td className="px-6 py-4">Medicare Levy</td>
                  <td className="px-6 py-4 text-right">{formatNegAUD(breakdown.medicareLevy / HOURS_PER_YEAR, 2, "−")}</td>
                  <td className="px-6 py-4 text-right">{formatNegAUD(breakdown.medicareLevy, 0, "−")}</td>
                </tr>
                <tr className="bg-eucalyptus-dark text-white font-bold">
                  <td className="px-6 py-5">Net Take-Home</td>
                  <td className="px-6 py-5 text-right">{formatAUD(netHourly, 2)}</td>
                  <td className="px-6 py-5 text-right">{formatAUD(breakdown.takeHomePay)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-4 text-sm text-warmgray">
          Your employer also contributes {formatAUD(employerSuper / HOURS_PER_YEAR, 2)}/hour ({formatAUD(employerSuper)}/year) in superannuation{facts.superCapped ? ", the SG maximum because earnings above the maximum contribution base attract none" : " at the 12% SG rate"}.
        </p>
      </section>

      {/* Award minimums near this hourly figure (10 Oct 2026; replaces "Is this a good rate?") */}
      <AwardRatesNearSection
        id="award-rates"
        heading={awardRatesHeading(near, hourlyLabel, "rates")}
        label={hourlyLabel}
        near={near}
        intro={
          <>
            <p>
              {belowMinimum ? (
                <>
                  At {hourlyLabel} an hour, {formattedSalary} is <strong>below the national minimum wage</strong> of {formatAUD(MINIMUM_WAGE_HOURLY, 2)} an hour (from {NMW_DECISION.operativeFrom}) for a full-time {HOURS_PER_WEEK}-hour week, which is {formatAUD(fullTimeMinimumAnnual)} a year. It matches about {hoursAtMinimum.toFixed(1)} hours a week at the minimum wage, so it is usually a part-time or junior figure.
                </>
              ) : (
                <>
                  {hourlyLabel} an hour is <strong>{hourlyVsMinimum.toFixed(1)}x the national minimum wage</strong> of {formatAUD(MINIMUM_WAGE_HOURLY, 2)} (from {NMW_DECISION.operativeFrom}).
                </>
              )}
            </p>
            <EarningsPosition salary={salary} />
            <p>
              {near.position === "inside" || near.allInWindow
                ? `These are award minimums near ${hourlyLabel}, not what the jobs pay: actual pay can be higher.`
                : "Award minimums are legal floors, not salary benchmarks."}
            </p>
          </>
        }
      />

      {/* Compare With Other Salaries */}
      <NeighbourTable salary={salary} family="salary-to-hourly" />

      {isGridPage && <SalaryNav salary={salary} family="salary-to-hourly" />}

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

      <p className="text-sm text-warmgray">
        Method: salary ÷ {HOURS_PER_YEAR.toLocaleString("en-AU")} hours ({HOURS_PER_WEEK} × {WEEKS_PER_YEAR} weeks), FY{SITE_CONFIG.financialYear} resident tax rates and Medicare levy, no Medicare Levy Surcharge.{" "}
        <a href="/hourly-to-annual-salary-calculator/#salary-to-hourly" className={LINK}>
          The method in full
        </a>
        .
      </p>
      <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
    </div>
  );
}
