"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import ResultNextSteps, { type ResultNextStep } from "@/components/common/result-next-steps";
import StickyResult from "@/components/common/sticky-result";
import { nearestSalary, salaryHref } from "@/lib/data/salary-pages";
import { HOURLY_RATE_PAGES, hourlyRateSlug } from "@/lib/constants/hourly-rates";
import {
  calculatePayBreakdown,
  formatAUD,
  formatNegAUD,
  EMPLOYMENT,
  SUPER_GUARANTEE,
  SITE_CONFIG,
} from "@/lib/constants";

/** Example rate for the answer-first lead. Keep in step with HEADLINE_RATE in app/hourly-to-annual-salary-calculator/page.tsx and hourly-to-annual-salary-calculator-content.tsx (a "use client" module cannot export values to a server page). */
const HEADLINE_RATE = 30;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * The interactive part of /hourly-to-annual-salary-calculator/: hero and
 * calculator card. The long-form content below the card is a server component
 * (hourly-to-annual-salary-calculator-content.tsx) passed in as `children`, so
 * it is not part of this client bundle.
 */
export default function HourlyToAnnualCalculatorPage({ children }: { children: React.ReactNode }) {
  const [hourlyRate, setHourlyRate] = useState(45.50);
  const [hoursPerWeek, setHoursPerWeek] = useState(38);

  // Annual calculation: Rate * Hours * 52 weeks
  const annualGross = hourlyRate * hoursPerWeek * 52;
  const expectedSuper = annualGross * SUPER_GUARANTEE.rate;

  const breakdown = useMemo(() => calculatePayBreakdown({ grossSalary: annualGross }), [annualGross]);

  const headlineAnnual = HEADLINE_RATE * EMPLOYMENT.hoursPerYear;
  const headlineNet = calculatePayBreakdown({ grossSalary: headlineAnnual }).takeHomePay;

  // Next steps carry the visitor's own annual figure (and nearest hourly-rate
  // page), so the page they land on already answers the follow-up question.
  const nextSteps = useMemo<ResultNextStep[]>(() => {
    const annual = Math.round(annualGross);
    const takeHome = nearestSalary("take-home", annual);
    const taxOn = nearestSalary("tax-on", annual);
    const rate = HOURLY_RATE_PAGES.reduce((best, r) => (Math.abs(r - hourlyRate) < Math.abs(best - hourlyRate) ? r : best));
    return [
      { href: salaryHref("take-home", takeHome), label: `See your full take-home pay on ${formatAUD(takeHome)}`, detail: "Weekly, fortnightly and monthly, with super" },
      { href: salaryHref("tax-on", taxOn), label: `How much tax you pay on ${formatAUD(taxOn)}` },
      { href: `/hourly-to-salary/${hourlyRateSlug(rate)}/`, label: `Read the full guide to $${rate} an hour` },
      { href: "/weekly-pay-calculator/", label: "Work out your weekly pay after tax" },
    ];
  }, [annualGross, hourlyRate]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-3 md:py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* HERO — compact so the first input sits above the phone fold (GA4 audit, Sep 2026).
            The "multiply by 1,976" / "enter your own rate" sentences moved to the top of
            hourly-to-annual-salary-calculator-content.tsx. */}
        <section className="bg-eucalyptus-light/40 rounded-2xl p-4 md:p-6 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Hourly Rate Converter</span></li>
            </ol>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-navy mt-2 mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Hourly to Annual Salary Calculator
          </h1>
          <p className="text-base md:text-lg text-navy">
            ${HEADLINE_RATE} an hour is <strong>{formatAUD(headlineAnnual)} a year</strong> before tax ({EMPLOYMENT.standardWeeklyHours} hours &times;{" "}
            {EMPLOYMENT.weeksPerYear} weeks = {EMPLOYMENT.hoursPerYear.toLocaleString("en-AU")} hours) and {formatAUD(headlineNet)} after tax in FY{SITE_CONFIG.financialYear}.
          </p>
          <TrustBar className="mt-2" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto mb-12">
          <Card className="shadow-md py-0 border-t-4 border-t-eucalyptus">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8 items-start">

                {/* Inputs */}
                <div className="space-y-6">
                  <div>
                    <label htmlFor="hourlyRate" className="block text-sm font-semibold text-navy mb-2">My Hourly Rate</label>
                    <div className="flex items-center relative">
                      <span className="absolute left-3 text-warmgray-light font-medium">$</span>
                      <input type="number" id="hourlyRate" min={0} max={1000} step={0.5} value={hourlyRate}
                        onChange={(e) => setHourlyRate(clamp(Number(e.target.value || 0), 0, 1000))}
                        className="block w-full pl-7 pr-12 py-3 text-lg font-bold text-navy rounded-xl border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                      <span className="absolute right-3 text-warmgray-light font-medium text-sm">/ hr</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="hoursPerWeek" className="block text-sm font-semibold text-navy mb-2">Hours Worked Per Week</label>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center relative">
                        <input type="number" id="hoursPerWeek" min={0} max={168} step={0.5} value={hoursPerWeek}
                          onChange={(e) => setHoursPerWeek(clamp(Number(e.target.value || 0), 0, 168))}
                          className="block w-full pr-14 py-3 text-lg font-bold text-navy rounded-xl border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                        <span className="absolute right-3 text-warmgray-light font-medium text-sm">hrs</span>
                      </div>

                      <div className="flex gap-2">
                        {[38, 40, 20].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setHoursPerWeek(preset)}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors border ${
                              hoursPerWeek === preset
                                ? "bg-eucalyptus-light/30 border-eucalyptus text-eucalyptus-dark"
                                : "bg-white border-sandstone-dark/20 text-warmgray hover:bg-sandstone/50"
                            }`}
                          >
                            {preset} hrs {preset === 38 ? "(Standard)" : ""}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div id="calc-result" className="space-y-5">
                  <div className="bg-eucalyptus-light/30 rounded-2xl p-6 text-center shadow-sm border border-eucalyptus-light">
                    <div className="text-sm font-bold text-navy uppercase tracking-wider mb-1">Equivalent Annual Base Salary</div>
                    <div className="text-4xl md:text-5xl font-extrabold text-navy mb-1">
                      {formatAUD(annualGross)}
                    </div>
                    <div className="text-sm text-eucalyptus-dark font-medium mt-2">
                      Before tax, super, and deductions
                    </div>
                    <ResultNextSteps links={nextSteps} />
                  </div>

                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden shadow-sm">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                      <h3 className="font-semibold text-navy text-sm">Your True Take-Home Pay</h3>
                    </div>
                    <div className="p-0 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-white border-b border-sandstone-dark/10">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium text-warmgray-light">Frequency</th>
                            <th className="px-4 py-2 text-right font-medium text-warmgray-light">Gross</th>
                            <th className="px-4 py-2 text-right font-medium text-warmgray-light">Tax + Med</th>
                            <th className="px-4 py-2 text-right font-semibold text-navy">Take-Home</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-sandstone-dark/10">
                          {[
                            { label: "Weekly", d: 52 },
                            { label: "Fortnightly", d: 26 },
                            { label: "Monthly", d: 12 },
                            { label: "Annually", d: 1 },
                          ].map((row) => (
                            <tr key={row.label} className="hover:bg-sandstone/50">
                              <td className="px-4 py-3 font-medium text-gray-700">{row.label}</td>
                              <td className="px-4 py-3 text-right text-warmgray">{formatAUD(annualGross / row.d)}</td>
                              <td className="px-4 py-3 text-right text-red-500">{formatNegAUD(breakdown.totalDeductions / row.d)}</td>
                              <td className="px-4 py-3 text-right font-bold text-eucalyptus-dark">{formatAUD(breakdown.takeHomePay / row.d)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-sandstone p-4 rounded-xl text-sm border border-sandstone-dark/20 flex justify-between items-center">
                    <div>
                      <span className="block font-medium text-navy">Employer Superannuation</span>
                      <span className="block text-xs text-warmgray-light">Paid on top of your hourly rate into your fund</span>
                    </div>
                    <div className="font-bold text-navy">
                      +{formatAUD(expectedSuper)} <span className="text-xs font-normal text-warmgray-light">/yr</span>
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
          {/* Rendered after the card so it never pushes the first input below the fold. */}
          <StickyResult targetId="calc-result" label="Annual salary" value={formatAUD(annualGross)} hint="a year" />
        </section>

        {children}
      </div>
    </div>
  );
}
