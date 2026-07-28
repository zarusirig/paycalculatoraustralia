"use client";

import React from "react";
import {
  calculatePayBreakdown,
  formatAUD,
  HECS_HELP,
  SITE_CONFIG,
  EMPLOYMENT,
} from "@/lib/constants/australian-tax";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";

interface SalaryToHourlyProps {
  salary: number;
}

// Standard Australian working hours — single source of truth in EMPLOYMENT
// so the route and the module cannot drift (they previously did).
const HOURS_PER_WEEK = EMPLOYMENT.standardWeeklyHours;
const WEEKS_PER_YEAR = EMPLOYMENT.weeksPerYear;
const HOURS_PER_YEAR = EMPLOYMENT.hoursPerYear; // 1,976
const HOURS_PER_DAY = 7.6;
const WORKING_DAYS_PER_YEAR = 260;

const MINIMUM_WAGE_HOURLY = EMPLOYMENT.minimumWageHourly; // $26.44
const AVERAGE_WAGE_ANNUAL = 98_218; // ABS Average Weekly Earnings × 52

export function SalaryToHourly({ salary }: SalaryToHourlyProps) {
  const SOURCES_LIST: SourceLink[] = [
    { title: "National Minimum Wage", url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages", publisher: "Fair Work Ombudsman" },
    { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: "ATO" },
    { title: "Average Weekly Earnings", url: "https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/average-weekly-earnings-australia", publisher: "ABS" },
  ];

  const breakdown = calculatePayBreakdown({
    grossSalary: salary,
    includeHECS: salary >= HECS_HELP.minimumThreshold,
  });

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

  // Adjacent salary params for navigation
  const salaryList = [30000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000, 110000, 120000, 130000, 140000, 150000, 200000];
  const currentIndex = salaryList.indexOf(salary);
  const prevSalary = currentIndex > 0 ? salaryList[currentIndex - 1] : null;
  const nextSalary = currentIndex < salaryList.length - 1 ? salaryList[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Introduction */}
      <section className="prose prose-eucalyptus max-w-none">
        <p className="text-lg text-navy leading-relaxed">
          A <strong>{formattedSalary}</strong> annual salary in Australia equals <strong>{formatAUD(grossHourly, 2)}/hour</strong> before tax, based on a standard 38-hour work week (1,976 working hours per year).
          After income tax and Medicare levy, your effective hourly rate drops to <strong>{formatAUD(netHourly, 2)}/hour</strong>.
        </p>
        <p className="text-navy leading-relaxed">
          This calculation uses 52 weeks per year and a standard 38-hour week as defined by the Fair Work Act.
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
                  <td className="px-6 py-4 text-right">−{formatAUD(breakdown.netIncomeTax / HOURS_PER_YEAR, 2)}</td>
                  <td className="px-6 py-4 text-right">−{formatAUD(breakdown.netIncomeTax)}</td>
                </tr>
                <tr className="hover:bg-sandstone/30 transition-colors text-ochre">
                  <td className="px-6 py-4">Medicare Levy</td>
                  <td className="px-6 py-4 text-right">−{formatAUD(breakdown.medicareLevy / HOURS_PER_YEAR, 2)}</td>
                  <td className="px-6 py-4 text-right">−{formatAUD(breakdown.medicareLevy)}</td>
                </tr>
                {breakdown.hecsRepayment > 0 && (
                  <tr className="hover:bg-sandstone/30 transition-colors text-ochre">
                    <td className="px-6 py-4">HECS-HELP</td>
                    <td className="px-6 py-4 text-right">−{formatAUD(breakdown.hecsRepayment / HOURS_PER_YEAR, 2)}</td>
                    <td className="px-6 py-4 text-right">−{formatAUD(breakdown.hecsRepayment)}</td>
                  </tr>
                )}
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
          Your employer also contributes {formatAUD(breakdown.superContribution / HOURS_PER_YEAR, 2)}/hour ({formatAUD(breakdown.superContribution)}/year) in superannuation at the 12% SG rate.
        </p>
      </section>

      {/* Is This a Good Rate? */}
      <section className="bg-eucalyptus-light/20 rounded-xl p-8 border border-eucalyptus/20">
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-4">Is {formatAUD(grossHourly, 2)}/Hour a Good Rate?</h2>
        <p className="text-navy leading-relaxed mb-4">
          At {formatAUD(grossHourly, 2)} per hour ({formattedSalary} annually), your hourly rate is <strong>{hourlyVsMinimum.toFixed(1)}x the national minimum wage</strong> of ${MINIMUM_WAGE_HOURLY.toFixed(2)}/hour.
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
            ? `Your hourly rate is ${((hourlyVsAverage - 1) * 100).toFixed(0)}% above the average Australian full-time wage of ${formatAUD(averageHourly, 2)}/hour (${formatAUD(AVERAGE_WAGE_ANNUAL)}/year).`
            : `Your hourly rate is ${((1 - hourlyVsAverage) * 100).toFixed(0)}% below the average Australian full-time wage of ${formatAUD(averageHourly, 2)}/hour (${formatAUD(AVERAGE_WAGE_ANNUAL)}/year).`
          }
          {" "}Check <a href="/award-rates/" className="text-eucalyptus hover:text-navy transition-colors font-medium">Award Rates</a> to see the minimum pay for your specific industry and classification.
        </p>
      </section>

      {/* Compare With Other Salaries */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-6">Compare With Other Salaries</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prevSalary && (
            <a href={`/salary-to-hourly/${prevSalary}/`} className="block rounded-xl border border-sandstone-dark/20 p-5 hover:bg-sandstone transition-colors">
              <p className="font-semibold text-navy mb-1">{formatAUD(prevSalary)} Salary to Hourly</p>
              <p className="text-sm text-warmgray">= {formatAUD(prevSalary / HOURS_PER_YEAR, 2)}/hour before tax</p>
            </a>
          )}
          {nextSalary && (
            <a href={`/salary-to-hourly/${nextSalary}/`} className="block rounded-xl border border-sandstone-dark/20 p-5 hover:bg-sandstone transition-colors">
              <p className="font-semibold text-navy mb-1">{formatAUD(nextSalary)} Salary to Hourly</p>
              <p className="text-sm text-warmgray">= {formatAUD(nextSalary / HOURS_PER_YEAR, 2)}/hour before tax</p>
            </a>
          )}
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
              A {formattedSalary} annual salary equals <strong>{formatAUD(grossHourly, 2)} per hour</strong> before tax, based on a standard 38-hour work week and 52 weeks per year (1,976 working hours). After income tax and Medicare levy, the effective hourly rate is <strong>{formatAUD(netHourly, 2)}</strong>.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-white border rounded-lg px-4 shadow-sm">
            <AccordionTrigger className="text-left font-semibold text-navy py-4 hover:no-underline">
              How do you convert {formattedSalary} salary to hourly rate?
            </AccordionTrigger>
            <AccordionContent className="text-warmgray pb-4 leading-relaxed">
              Divide the annual salary by the total working hours per year. With a 38-hour week: {formattedSalary} / (38 hours x 52 weeks) = {formattedSalary} / 1,976 hours = <strong>{formatAUD(grossHourly, 2)}/hour</strong>.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="bg-white border rounded-lg px-4 shadow-sm">
            <AccordionTrigger className="text-left font-semibold text-navy py-4 hover:no-underline">
              Is {formatAUD(grossHourly, 2)}/hour above or below average in Australia?
            </AccordionTrigger>
            <AccordionContent className="text-warmgray pb-4 leading-relaxed">
              {hourlyVsAverage >= 1
                ? `At ${formatAUD(grossHourly, 2)}/hour, you earn ${((hourlyVsAverage - 1) * 100).toFixed(0)}% above the average full-time hourly rate of ${formatAUD(averageHourly, 2)}/hour (based on ABS Average Weekly Earnings). Your rate is also ${hourlyVsMinimum.toFixed(1)}x the national minimum wage of $${MINIMUM_WAGE_HOURLY.toFixed(2)}/hour.`
                : `At ${formatAUD(grossHourly, 2)}/hour, you earn ${((1 - hourlyVsAverage) * 100).toFixed(0)}% below the average full-time hourly rate of ${formatAUD(averageHourly, 2)}/hour (based on ABS Average Weekly Earnings). However, your rate is still ${hourlyVsMinimum.toFixed(1)}x the national minimum wage of $${MINIMUM_WAGE_HOURLY.toFixed(2)}/hour.`
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
          <li><strong>Working Hours:</strong> Standard 38-hour week as defined by the Fair Work Act, with 52 weeks per year, yielding 1,976 working hours annually.</li>
          <li><strong>Income Tax:</strong> Calculated using ATO progressive marginal tax rates for resident individuals for FY{SITE_CONFIG.financialYear}.</li>
          <li><strong>Medicare Levy:</strong> Standard 2% rate. Does not account for low-income reductions or Medicare Levy Surcharge.</li>
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
