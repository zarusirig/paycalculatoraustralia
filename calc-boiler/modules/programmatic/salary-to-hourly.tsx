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
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { salaryFacts, SALARY_TO_HOURLY_SALARIES } from "@/lib/data/salary-pages";
import { AWE_HEADLINE, AWE_RELEASE, annualise } from "@/lib/data/average-salary";
import { NeighbourTable, SalaryNav } from "@/modules/programmatic/salary-page-sections";

interface SalaryToHourlyProps {
  salary: number;
}

// Standard Australian working hours — single source of truth in EMPLOYMENT
// so the route and the module cannot drift (they previously did).
const HOURS_PER_WEEK = EMPLOYMENT.standardWeeklyHours;
const WEEKS_PER_YEAR = EMPLOYMENT.weeksPerYear;
const HOURS_PER_YEAR = EMPLOYMENT.hoursPerYear; // 1,976
const WORKING_DAYS_PER_YEAR = 260;

const MINIMUM_WAGE_HOURLY = EMPLOYMENT.minimumWageHourly; // $26.44
// ABS full-time adult AWOTE × 52, from lib/data/average-salary (was a
// hardcoded, stale 98_218).
const AVERAGE_WAGE_ANNUAL = annualise(AWE_HEADLINE.fullTimeOrdinaryWeekly);

export function SalaryToHourly({ salary }: SalaryToHourlyProps) {
  const SOURCES_LIST: SourceLink[] = [
    { title: "National Minimum Wage", url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages", publisher: "Fair Work Ombudsman" },
    { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: "ATO" },
    { title: `${AWE_RELEASE.title}, ${AWE_RELEASE.referencePeriod}`, url: AWE_RELEASE.url, publisher: "ABS" },
  ];

  // No HECS in the headline: the intro says "after income tax and Medicare
  // levy", and the page title quotes these figures. The loan case is stated
  // separately from `withHecs`.
  const breakdown = calculatePayBreakdown({ grossSalary: salary });
  const withHecs = calculatePayBreakdown({ grossSalary: salary, includeHECS: true });

  const formattedSalary = formatAUD(salary);

  // Hourly rate calculations
  const grossHourly = salary / HOURS_PER_YEAR;
  const netHourly = breakdown.takeHomePay / HOURS_PER_YEAR;

  // Frequency breakdowns (gross)
  const grossDaily = salary / WORKING_DAYS_PER_YEAR;
  const grossWeekly = salary / 52;
  const grossFortnightly = salary / 26;
  const grossMonthly = salary / 12;

  // Frequency breakdowns (net)
  const netDaily = breakdown.takeHomePay / WORKING_DAYS_PER_YEAR;

  // Comparisons
  const averageHourly = AVERAGE_WAGE_ANNUAL / HOURS_PER_YEAR;
  const hourlyVsMinimum = grossHourly / MINIMUM_WAGE_HOURLY;
  const hourlyVsAverage = grossHourly / averageHourly;

  // Engine-derived facts (SG capped at the maximum contribution base).
  const facts = salaryFacts(salary);
  const employerSuper = facts.employerSuper;
  const belowMinimum = grossHourly < MINIMUM_WAGE_HOURLY;
  // Hours a week this salary buys at the national minimum wage — the honest
  // reading of a salary that is below the full-time minimum.
  const hoursAtMinimum = salary / WEEKS_PER_YEAR / MINIMUM_WAGE_HOURLY;
  const fullTimeMinimumAnnual = EMPLOYMENT.minimumWageWeekly * WEEKS_PER_YEAR;
  // A $1,000-a-year rise, expressed per hour.
  const perHourGrossOf1k = 1_000 / HOURS_PER_YEAR;
  const perHourNetOf1k = facts.nextThousand.takeHome / HOURS_PER_YEAR;
  const isGridPage = SALARY_TO_HOURLY_SALARIES.includes(salary);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Introduction */}
      <section className="prose prose-eucalyptus max-w-none">
        <p className="text-lg text-navy leading-relaxed">
          A <strong>{formattedSalary}</strong> annual salary in Australia equals <strong>{formatAUD(grossHourly, 2)}/hour</strong> before tax, based on a standard {HOURS_PER_WEEK}-hour work week ({HOURS_PER_YEAR.toLocaleString("en-AU")} working hours per year).
          After income tax and Medicare levy, your effective hourly rate drops to <strong>{formatAUD(netHourly, 2)}/hour</strong>.
          {withHecs.hecsRepayment > 0
            ? ` With a HECS-HELP debt, the compulsory repayment takes it to ${formatAUD(withHecs.takeHomePay / HOURS_PER_YEAR, 2)}/hour.`
            : ""}
        </p>
        <p className="text-navy leading-relaxed">
          This calculation uses {WEEKS_PER_YEAR} weeks per year and the standard {HOURS_PER_WEEK}-hour week in the National Employment Standards. Every extra $1,000 a year is worth {formatAUD(perHourGrossOf1k, 2)} an hour before tax and {formatAUD(perHourNetOf1k, 2)} an hour after tax at this income.
          Use our <a href="/hourly-to-annual-salary-calculator/" className="text-eucalyptus hover:text-navy transition-colors font-medium">Hourly to Annual Salary Calculator</a> to convert in the other direction.
        </p>
      </section>

      <TrustBar />

      {/* Hourly Rate Breakdown */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-4">Hourly Rate Breakdown for {formattedSalary}</h2>
        <p className="text-navy leading-relaxed mb-6">
          Your {formattedSalary} salary converted to an hourly rate and every common pay frequency, both before and after tax.
        </p>
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
                  <td className="px-6 py-5 text-right">{formatAUD(grossHourly, 2)}</td>
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
          Calculation: {formattedSalary} / (38 hours x 52 weeks) = {formatAUD(grossHourly, 2)}/hour. After-tax hourly rate accounts for {formatAUD(breakdown.netIncomeTax)} income tax and {formatAUD(breakdown.medicareLevy)} Medicare levy.
        </p>
      </section>

      {/* After-Tax Hourly Rate */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-4">After-Tax Hourly Rate on {formattedSalary}</h2>
        <p className="text-navy leading-relaxed mb-4">
          Your gross hourly rate of {formatAUD(grossHourly, 2)} drops to <strong>{formatAUD(netHourly, 2)}/hour</strong> after all compulsory deductions. Here is the breakdown of what comes out of each hour worked:
        </p>
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
                  <td className="px-6 py-4 text-right font-medium">{formatAUD(grossHourly, 2)}</td>
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

      {/* Is This a Good Rate? */}
      <section className="bg-eucalyptus-light/20 rounded-xl p-8 border border-eucalyptus/20">
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-4">Is {formatAUD(grossHourly, 2)}/Hour a Good Rate?</h2>
        <p className="text-navy leading-relaxed mb-4">
          {belowMinimum
            ? <>At {formatAUD(grossHourly, 2)} per hour, {formattedSalary} is <strong>below the national minimum wage</strong> of ${MINIMUM_WAGE_HOURLY.toFixed(2)}/hour for a full-time {HOURS_PER_WEEK}-hour week (a full-time adult minimum is {formatAUD(fullTimeMinimumAnnual)} a year). As a full-time salary it is less than an adult employee must be paid (junior, apprentice and supported wages aside); it matches about {hoursAtMinimum.toFixed(1)} hours a week at the minimum wage, so it is usually a part-time or junior figure.</>
            : <>At {formatAUD(grossHourly, 2)} per hour ({formattedSalary} annually), your hourly rate is <strong>{hourlyVsMinimum.toFixed(1)}x the national minimum wage</strong> of ${MINIMUM_WAGE_HOURLY.toFixed(2)}/hour.</>}
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-navy">Minimum Wage</span>
                <span className="text-sm text-warmgray">${MINIMUM_WAGE_HOURLY.toFixed(2)}/hr</span>
              </div>
              <div className="w-full bg-sandstone rounded-full h-3">
                <div className="bg-warmgray rounded-full h-3" style={{ width: `${Math.min(100, (MINIMUM_WAGE_HOURLY / grossHourly) * 100)}%` }} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-navy">Average Full-Time Wage</span>
                <span className="text-sm text-warmgray">{formatAUD(averageHourly, 2)}/hr</span>
              </div>
              <div className="w-full bg-sandstone rounded-full h-3">
                <div className="bg-warmgray rounded-full h-3" style={{ width: `${Math.min(100, (averageHourly / grossHourly) * 100)}%` }} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-navy">Your Rate ({formattedSalary})</span>
                <span className="text-sm text-eucalyptus font-medium">{formatAUD(grossHourly, 2)}/hr</span>
              </div>
              <div className="w-full bg-sandstone rounded-full h-3">
                <div className="bg-eucalyptus rounded-full h-3" style={{ width: "100%" }} />
              </div>
            </div>
          </div>
        </div>
        <p className="text-navy leading-relaxed mt-4">
          {hourlyVsAverage >= 1
            ? `Your hourly rate is ${((hourlyVsAverage - 1) * 100).toFixed(0)}% above the average Australian full-time wage of ${formatAUD(averageHourly, 2)}/hour (${formatAUD(AVERAGE_WAGE_ANNUAL)}/year, ABS ${AWE_RELEASE.referencePeriod}).`
            : `Your hourly rate is ${((1 - hourlyVsAverage) * 100).toFixed(0)}% below the average Australian full-time wage of ${formatAUD(averageHourly, 2)}/hour (${formatAUD(AVERAGE_WAGE_ANNUAL)}/year, ABS ${AWE_RELEASE.referencePeriod}).`
          }
          {" "}Check <a href="/award-rates/" className="text-eucalyptus hover:text-navy transition-colors font-medium">Award Rates</a> to see the minimum pay for your specific industry and classification.
        </p>
      </section>

      {/* Compare With Other Salaries */}
      <NeighbourTable salary={salary} family="salary-to-hourly" />

      {isGridPage && <SalaryNav salary={salary} family="salary-to-hourly" />}

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href={`/take-home-pay-on/${salary}/`} className="block rounded-xl border border-sandstone-dark/20 p-5 hover:bg-sandstone transition-colors">
            <p className="font-semibold text-navy mb-1">Take-Home Pay on {formattedSalary}</p>
            <p className="text-sm text-warmgray">Full net pay breakdown with tax, Medicare, and super.</p>
          </a>
          <a href="/hourly-to-annual-salary-calculator/" className="block rounded-xl border border-sandstone-dark/20 p-5 hover:bg-sandstone transition-colors">
            <p className="font-semibold text-navy mb-1">Hourly to Annual Salary Calculator</p>
            <p className="text-sm text-warmgray">Convert any hourly rate to an annual salary.</p>
          </a>
        </div>
      </section>

      {/* Related Calculators */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-4">Related Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/take-home-pay-calculator/" className="block rounded-xl border border-sandstone-dark/20 p-5 hover:bg-sandstone transition-colors">
            <p className="font-semibold text-navy mb-1">Take-Home Pay Calculator</p>
            <p className="text-sm text-warmgray">Calculate net pay on any salary with all deductions for FY{SITE_CONFIG.financialYear}.</p>
          </a>
          <a href="/award-rates/" className="block rounded-xl border border-sandstone-dark/20 p-5 hover:bg-sandstone transition-colors">
            <p className="font-semibold text-navy mb-1">Award Rates</p>
            <p className="text-sm text-warmgray">Find the minimum hourly rate for your industry and classification level.</p>
          </a>
          <a href={`/hourly-to-salary/${nearestHourlyRate(grossHourly)}/`} className="block rounded-xl border border-sandstone-dark/20 p-5 hover:bg-sandstone transition-colors">
            <p className="font-semibold text-navy mb-1">{formatAUD(nearestHourlyRate(grossHourly), 2)} an Hour Is How Much a Year?</p>
            <p className="text-sm text-warmgray">The same conversion in reverse, with part-time and casual hours.</p>
          </a>
        </div>
      </section>

      {/* FAQs */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="bg-white border rounded-lg px-4 shadow-sm">
            <AccordionTrigger className="text-left font-semibold text-navy py-4 hover:no-underline">
              How much is {formattedSalary} per hour in Australia?
            </AccordionTrigger>
            <AccordionContent className="text-warmgray pb-4 leading-relaxed">
              A {formattedSalary} annual salary equals <strong>{formatAUD(grossHourly, 2)} per hour</strong> before tax, based on a standard {HOURS_PER_WEEK}-hour work week and {WEEKS_PER_YEAR} weeks per year ({HOURS_PER_YEAR.toLocaleString("en-AU")} working hours). After income tax and Medicare levy, the effective hourly rate is <strong>{formatAUD(netHourly, 2)}</strong>.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-white border rounded-lg px-4 shadow-sm">
            <AccordionTrigger className="text-left font-semibold text-navy py-4 hover:no-underline">
              How do you convert {formattedSalary} salary to hourly rate?
            </AccordionTrigger>
            <AccordionContent className="text-warmgray pb-4 leading-relaxed">
              Divide the annual salary by the total working hours per year. With a {HOURS_PER_WEEK}-hour week: {formattedSalary} / ({HOURS_PER_WEEK} hours x {WEEKS_PER_YEAR} weeks) = {formattedSalary} / {HOURS_PER_YEAR.toLocaleString("en-AU")} hours = <strong>{formatAUD(grossHourly, 2)}/hour</strong>.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="bg-white border rounded-lg px-4 shadow-sm">
            <AccordionTrigger className="text-left font-semibold text-navy py-4 hover:no-underline">
              Is {formatAUD(grossHourly, 2)}/hour above or below average in Australia?
            </AccordionTrigger>
            <AccordionContent className="text-warmgray pb-4 leading-relaxed">
              {hourlyVsAverage >= 1
                ? `At ${formatAUD(grossHourly, 2)}/hour, you earn ${((hourlyVsAverage - 1) * 100).toFixed(0)}% above the average full-time hourly rate of ${formatAUD(averageHourly, 2)}/hour (based on ABS Average Weekly Earnings). Your rate is also ${hourlyVsMinimum.toFixed(1)}x the national minimum wage of $${MINIMUM_WAGE_HOURLY.toFixed(2)}/hour.`
                : `At ${formatAUD(grossHourly, 2)}/hour, you earn ${((1 - hourlyVsAverage) * 100).toFixed(0)}% below the average full-time hourly rate of ${formatAUD(averageHourly, 2)}/hour (based on ABS Average Weekly Earnings). ${belowMinimum ? `It is also below the national minimum wage of $${MINIMUM_WAGE_HOURLY.toFixed(2)}/hour, so as a full-time salary it is less than an adult employee must be paid (junior, apprentice and supported wages aside).` : `Your rate is ${hourlyVsMinimum.toFixed(1)}x the national minimum wage of $${MINIMUM_WAGE_HOURLY.toFixed(2)}/hour.`}`
              }
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="bg-white border rounded-lg px-4 shadow-sm">
            <AccordionTrigger className="text-left font-semibold text-navy py-4 hover:no-underline">
              What is {formattedSalary} per day before and after tax?
            </AccordionTrigger>
            <AccordionContent className="text-warmgray pb-4 leading-relaxed">
              On a {formattedSalary} salary working a standard 7.6-hour day, you earn <strong>{formatAUD(grossDaily, 2)} per day</strong> before tax and <strong>{formatAUD(netDaily, 2)} per day</strong> after tax. This is based on 260 working days per year (52 weeks x 5 days).
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <MethodologyDisclosure>
        <p className="mb-2 text-sm text-warmgray">Calculations are based on the following assumptions:</p>
        <ol className="list-decimal pl-4 space-y-1 text-sm text-warmgray">
          <li><strong>Working Hours:</strong> Standard {HOURS_PER_WEEK}-hour week (National Employment Standards), with {WEEKS_PER_YEAR} weeks per year, yielding {HOURS_PER_YEAR.toLocaleString("en-AU")} working hours annually.</li>
          <li><strong>Income Tax:</strong> Calculated using ATO progressive marginal tax rates for resident individuals for FY{SITE_CONFIG.financialYear}.</li>
          <li><strong>Medicare Levy:</strong> 2%, shaded in for low incomes using the {SITE_CONFIG.previousFinancialYear} low-income thresholds (the latest the ATO has published). Private hospital cover assumed, so no Medicare Levy Surcharge.</li>
        </ol>
      </MethodologyDisclosure>
      <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
    </div>
  );
}

/** Nearest hourly rate that has a /hourly-to-salary/ page, for the reverse link. */
const HOURLY_STEPS = [30, 32, 33, 35, 36, 37, 38, 40, 45, 50, 55, 60];
function nearestHourlyRate(hourly: number): number {
  return HOURLY_STEPS.reduce((best, r) =>
    Math.abs(r - hourly) < Math.abs(best - hourly) ? r : best,
  );
}
