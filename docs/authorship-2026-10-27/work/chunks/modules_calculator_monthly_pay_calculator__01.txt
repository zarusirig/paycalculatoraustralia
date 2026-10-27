"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import ResultNextSteps, { type ResultNextStep } from "@/components/common/result-next-steps";
import StickyResult from "@/components/common/sticky-result";
import { nearestSalary, salaryHref } from "@/lib/data/salary-pages";
import {
  calculatePayBreakdown,
  formatAUD,
  formatNegAUD,
  formatPercent,
  SUPER_GUARANTEE,
  SITE_CONFIG,
} from "@/lib/constants";
import { HeadTermLinks } from "@/modules/calculator/head-term-ui";

// Answer-first lead, computed from the tax engine.
const LEAD = calculatePayBreakdown({ grossSalary: 80_000, includeHECS: false, hasPrivateHealth: true });

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Hero + interactive calculator + the result-driven pay-cycle comparison. The
 * static article sections are server components (monthly-pay-calculator-content.tsx)
 * passed in as `intro` and `children`, so they are not part of the client bundle.
 */
export default function MonthlyPayCalculatorPage({ intro, children, afterCalculator }: { intro: React.ReactNode; children: React.ReactNode; afterCalculator?: React.ReactNode }) {
  const [salary, setSalary] = useState(80_000);
  const [includeHECS, setIncludeHECS] = useState(false);

  const result = useMemo(
    () => calculatePayBreakdown({ grossSalary: salary, includeHECS, hasPrivateHealth: true }),
    [salary, includeHECS]
  );

  // Next steps carry the visitor's own salary, so the salary page they land on
  // already shows their figure.
  const nextSteps = useMemo<ResultNextStep[]>(() => {
    const takeHome = nearestSalary("take-home", salary);
    return [
      { href: salaryHref("take-home", takeHome), label: `See the full year on ${formatAUD(takeHome)}`, detail: "Annual take-home with super and HECS" },
      { href: "/fortnightly-pay-calculator/", label: "Switch to fortnightly pay after tax" },
      { href: "/weekly-pay-calculator/", label: "Switch to weekly pay after tax" },
      { href: "/monthly-tax-table/", label: "Check the ATO monthly tax table" },
    ];
  }, [salary]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-3 md:py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* HERO — compact so the first input sits above the phone fold (GA4 audit, Sep 2026).
            The "divided by 12" / "enter your salary" sentences moved to MonthlyPayCalculatorIntro. */}
        <section className="bg-eucalyptus-light/40 rounded-2xl p-4 md:p-6 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Monthly Pay Calculator</span></li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl md:text-3xl font-bold text-navy mt-2 mb-2">Monthly Pay Calculator Australia {SITE_CONFIG.financialYear}</h1>
          <p className="text-base md:text-lg text-navy">
            On <strong>$80,000</strong> you take home <strong>{formatAUD(LEAD.monthly, 2)} a month</strong> ({formatAUD(80_000 / 12, 2)} gross)
            after income tax and Medicare in FY{SITE_CONFIG.financialYear}.
          </p>
          <TrustBar className="mt-2" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto mb-12">
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="sr-only md:not-sr-only md:block text-2xl font-semibold text-navy md:mb-3 text-center">Calculate Your Monthly Take-Home Pay</h2>
          <Card className="shadow-md py-0">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-navy mb-1">Gross Annual Salary</label>
                    <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="salary" min={0} max={500000} step={1000} value={salary}
                        onChange={(e) => setSalary(clamp(Number(e.target.value || 0), 0, 500000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <input type="range" min={0} max={300000} step={5000} value={clamp(salary, 0, 300000)}
                      onChange={(e) => setSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" checked={includeHECS} onChange={(e) => setIncludeHECS(e.target.checked)}
                      className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" />
                    <span className="text-navy">Include HECS-HELP debt</span>
                  </label>
                  <button type="submit" className="w-full bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 rounded-lg shadow-md transition-all">Calculate Monthly Pay</button>
                </form>

                <Card id="calc-result" className="bg-sandstone border-eucalyptus/30 border-2 shadow-sm" role="region" aria-live="polite">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-navy mb-4">Your Monthly Breakdown</h3>
                    <div className="space-y-2.5 text-sm">
                      <Row label="Gross Monthly Pay" value={formatAUD(salary / 12, 2)} bold />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Income Tax" value={formatNegAUD(result.netIncomeTax / 12, 2)} />
                      <Row label="Medicare Levy" value={formatNegAUD(result.medicareLevy / 12, 2)} />
                      {result.medicareSurcharge > 0 && <Row label="Medicare Surcharge" value={formatNegAUD(result.medicareSurcharge / 12, 2)} />}
                      {includeHECS && <Row label="HECS Repayment" value={formatNegAUD(result.hecsRepayment / 12, 2)} />}
                      <div className="border-t border-sandstone-dark/20" />
                      <div className="flex justify-between items-baseline pt-2 pb-2">
                        <span className="font-bold text-navy">Monthly Take-Home</span>
                        <span className="text-3xl font-extrabold text-eucalyptus-dark">{formatAUD(result.monthly, 2)}</span>
                      </div>
                      <div className="border-t border-sandstone-dark/20 pt-2 text-xs">
                        <Row label="Annual Equivalent" value={formatAUD(result.takeHomePay)} />
                        <Row label={`Super (${formatPercent(SUPER_GUARANTEE.rate, 0)} - employer paid)`} value={`+${formatAUD(result.superContribution / 12, 2)}/mo`} sub />
                      </div>
                      <ResultNextSteps links={nextSteps} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          {/* Rendered after the card so it never pushes the first input below the fold. */}
          <StickyResult targetId="calc-result" label="Monthly take-home" value={formatAUD(result.monthly, 2)} hint="per month" />
        </section>
        <HeadTermLinks className="max-w-4xl mx-auto -mt-6" terms={["salaryCalculator", "netPayCalculator", "salaryAfterTaxCalculator", "fortnightlyTaxCalculator"]} />

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">

          {intro}

          {/* --- H2: Monthly vs Fortnightly vs Weekly Pay --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Does Monthly Pay Compare to Fortnightly and Weekly Pay?</h2>
            <p className="text-warmgray mb-4">
              Monthly pay delivers <strong>12 payments</strong> per year, fortnightly pay delivers <strong>26 payments</strong>, and weekly pay delivers <strong>52 payments</strong>. The annual take-home total is identical regardless of frequency, but the per-period amount and cash-flow timing differ. The table below illustrates each cycle for an {formatAUD(80000)} salary.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Pay Frequency</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Payments Per Year</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Gross Per Period</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Net Per Period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Weekly</td>
                    <td className="px-4 py-3 text-right text-warmgray">52</td>
                    <td className="px-4 py-3 text-right text-warmgray">{formatAUD(80000 / 52, 2)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">{formatAUD(result.weekly, 2)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Fortnightly</td>
                    <td className="px-4 py-3 text-right text-warmgray">26</td>
                    <td className="px-4 py-3 text-right text-warmgray">{formatAUD(80000 / 26, 2)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">{formatAUD(result.fortnightly, 2)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Monthly</td>
                    <td className="px-4 py-3 text-right text-warmgray">12</td>
                    <td className="px-4 py-3 text-right text-warmgray">{formatAUD(80000 / 12, 2)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">{formatAUD(result.monthly, 2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">
              Fortnightly pay produces 2 &quot;extra&quot; payments per year compared to a monthly cycle. Employees paid fortnightly receive 26 deposits, which equates to the value of roughly 13 monthly payments across 12 calendar months. Use our <Link href="/fortnightly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Fortnightly Pay Calculator</Link> or <Link href="/weekly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Weekly Pay Calculator</Link> to view those breakdowns.
            </p>
          </section>

          {afterCalculator}
          {children}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, sub }: { label: string; value: string; bold?: boolean; sub?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${sub ? "text-warmgray-light text-xs" : ""}`}>
      <span className={bold ? "font-semibold text-navy" : (sub ? "" : "text-warmgray")}>{label}</span>
      <span className={bold ? "font-bold text-navy" : "font-medium text-navy"}>{value}</span>
    </div>
  );
}
