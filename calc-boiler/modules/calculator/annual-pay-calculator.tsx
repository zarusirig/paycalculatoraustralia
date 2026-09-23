"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import {
  calculatePayBreakdown,
  formatAUD,
  formatNegAUD,
  formatPercent,
  SUPER_GUARANTEE,
  SITE_CONFIG,
} from "@/lib/constants";
import { AmountPresets, HeadTermLinks } from "@/modules/calculator/head-term-ui";

// Hero quick-answer figures from the tax engine (they had frozen at FY2025-26
// values under a FY2026-27 heading).
const QA80 = calculatePayBreakdown({ grossSalary: 80_000, includeHECS: false, hasPrivateHealth: true });
const QA100 = calculatePayBreakdown({ grossSalary: 100_000, includeHECS: false, hasPrivateHealth: true });
const QA120 = calculatePayBreakdown({ grossSalary: 120_000, includeHECS: false, hasPrivateHealth: true });
const SALARY_PRESETS = [50_000, 75_000, 100_000, 150_000] as const;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Hero + interactive calculator. The long-form article below the card is a
 * server component (annual-pay-calculator-content.tsx) passed in as
 * `children`, so it is not part of the client bundle.
 */
export default function AnnualPayCalculatorPage({ children }: { children: React.ReactNode }) {
  const [salary, setSalary] = useState(80_000);
  const [includeHECS, setIncludeHECS] = useState(false);

  const result = useMemo(
    () => calculatePayBreakdown({ grossSalary: salary, includeHECS, hasPrivateHealth: true }),
    [salary, includeHECS]
  );

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        {/* Compact hero: calculator above the fold (head-term intent map, Sep 2026). */}
        <section className="bg-sandstone rounded-2xl p-5 md:p-8 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Annual Pay Calculator</span></li>
            </ol>
          </nav>
          <h1 className="text-2xl md:text-4xl font-bold text-navy mt-3 mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Annual Salary After Tax Calculator Australia {SITE_CONFIG.financialYear}</h1>
          <p className="text-base md:text-lg text-navy">A gross salary of <strong>$80,000</strong> is <strong>{formatAUD(QA80.takeHomePay)} a year after tax</strong> in FY{SITE_CONFIG.financialYear} ({formatAUD(QA80.netIncomeTax)} income tax + {formatAUD(QA80.medicareLevy)} Medicare levy). At $100,000 it is {formatAUD(QA100.takeHomePay)}; at $120,000, {formatAUD(QA120.takeHomePay)}.</p>
          <p className="text-warmgray mt-2">Enter any yearly salary for your annual take-home pay after income tax, Medicare, HECS-HELP and super.</p>
          <TrustBar className="mt-3" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold text-navy mb-4 text-center" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Calculate Your Salary After Tax</h2>
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-warmgray mb-1">Gross Annual Salary</label>
                    <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="salary" min={0} max={500000} step={1000} value={salary}
                        onChange={(e) => setSalary(clamp(Number(e.target.value || 0), 0, 500000))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <input type="range" min={0} max={300000} step={5000} value={clamp(salary, 0, 300000)}
                      onChange={(e) => setSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
                    <AmountPresets values={SALARY_PRESETS} current={salary} onPick={setSalary} />
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" checked={includeHECS} onChange={(e) => setIncludeHECS(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-eucalyptus-dark" />
                    <span className="text-warmgray">Include HECS-HELP debt</span>
                  </label>
                  <button type="submit" className="w-full bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 rounded-lg shadow-md transition-all">Calculate Annual Pay</button>
                </form>

                <Card className="bg-sandstone border-eucalyptus-dark/20 border-2 shadow-sm" role="region" aria-live="polite">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-navy mb-4">Your Annual Breakdown</h3>
                    <div className="space-y-2.5 text-sm">
                      <Row label="Gross Annual Pay" value={formatAUD(salary)} bold />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Income Tax" value={formatNegAUD(result.netIncomeTax)} />
                      {result.litoOffset > 0 && <Row label="LITO Offset" value={`+${formatAUD(result.litoOffset)}`} sub />}
                      <Row label="Medicare Levy" value={formatNegAUD(result.medicareLevy)} />
                      {result.medicareSurcharge > 0 && <Row label="Medicare Surcharge" value={formatNegAUD(result.medicareSurcharge)} />}
                      {includeHECS && <Row label="HECS Repayment" value={formatNegAUD(result.hecsRepayment)} />}
                      <div className="border-t border-sandstone-dark/20" />
                      <div className="flex justify-between items-baseline pt-2 pb-2">
                        <span className="font-bold text-navy">Annual Take-Home</span>
                        <span className="text-3xl font-extrabold text-eucalyptus-dark">{formatAUD(result.takeHomePay)}</span>
                      </div>
                      <div className="border-t border-sandstone-dark/20 pt-2 text-xs">
                        <Row label={`Super (${formatPercent(SUPER_GUARANTEE.rate, 0)} - employer paid)`} value={`+${formatAUD(result.superContribution)}`} sub />
                        <Row label="Total Package" value={formatAUD(result.totalPackage)} bold />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        <HeadTermLinks className="max-w-4xl mx-auto -mt-6" terms={["salaryCalculator", "afterTaxIncomeCalculator", "incomeTaxCalculator", "weeklyTaxCalculator", "fortnightlyTaxCalculator"]} />

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">
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
      <span className={bold ? "font-bold text-navy" : "font-medium text-warmgray"}>{value}</span>
    </div>
  );
}
