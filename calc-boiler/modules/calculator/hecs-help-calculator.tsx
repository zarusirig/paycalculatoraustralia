"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import {
  calculatePayBreakdown,
  calculateHECS,
  formatAUD,
  annualToWeekly,
  HECS_HELP,
  SITE_CONFIG,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// Thresholds, rates and the repayment engine all come from HECS_HELP in
// lib/constants. This page previously carried its own copy of the FY2026-27
// bands and its own calculateHECS2627(); the two drifted apart the moment the
// thresholds were indexed. Never reintroduce a local threshold here.
const T = HECS_HELP.minimumThreshold;
const [, B1, B2, B3] = HECS_HELP.bands;

const ATO_THRESHOLDS_URL =
  "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds";

const BAND_ROWS = [
  { range: `${formatAUD(0)} – ${formatAUD(T)}`, rate: "Nil", how: "No compulsory repayment" },
  { range: `${formatAUD(B1.min)} – ${formatAUD(B1.max)}`, rate: "15%", how: `15c for each $1 over ${formatAUD(T)}` },
  { range: `${formatAUD(B2.min)} – ${formatAUD(B2.max)}`, rate: "17%", how: `${formatAUD(B2.base)} plus 17c for each $1 over ${formatAUD(B2.min - 1)}` },
  { range: `${formatAUD(B3.min)} and over`, rate: `${B3.marginalRate * 100}%`, how: `${B3.marginalRate * 100}% of total repayment income` },
];

export interface CalculatorFaq {
  q: string;
  a: string;
}

/**
 * The interactive part of /hecs-help-calculator/: hero and calculator card.
 * The long-form content below the card is a server component
 * (hecs-help-calculator-content.tsx) passed in as `children`, so it is not
 * part of this client bundle.
 */
export default function HECSHelpCalculatorPage({ children, afterCalculator }: { children: React.ReactNode; afterCalculator?: React.ReactNode }) {
  const [salary, setSalary] = useState(80_000);

  const result = useMemo(() => {
    const hecsRepayment = calculateHECS(salary);
    // Income tax / Medicare come from the site's shared engine; the repayment
    // comes from calculateHECS, which is driven by HECS_HELP.bands.
    const breakdownNoHECS = calculatePayBreakdown({ grossSalary: salary, includeHECS: false });
    return {
      hecsRepayment,
      weeklyHECS: annualToWeekly(hecsRepayment),
      takeHomeWithHECS: breakdownNoHECS.takeHomePay - hecsRepayment,
      takeHomeWithoutHECS: breakdownNoHECS.takeHomePay,
    };
  }, [salary]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-gray-400" /></li>
              <li><span className="font-medium text-navy" aria-current="page">HECS Repayment Calculator</span></li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            HECS Repayment Calculator {SITE_CONFIG.financialYear}
          </h1>
          <p className="text-lg text-warmgray">
            Work out your compulsory repayment for {SITE_CONFIG.financialYear} on any study or training support loan — HELP, VSL, SFSS, SSL, ABSTUDY SSL or AASL. They all share one threshold of {formatAUD(T)}, and the marginal system charges only on the income above it.
          </p>
          {/* Above-the-fold answer for "hecs repayment thresholds" — the full table with context is #threshold below. */}
          <div className="mt-5 overflow-x-auto rounded-xl border border-sandstone-dark/20 bg-white">
            <table className="w-full text-sm">
              <caption className="px-4 pt-3 text-left text-sm font-semibold text-navy">HECS repayment thresholds {SITE_CONFIG.financialYear} (marginal system)</caption>
              <thead>
                <tr className="border-b border-sandstone-dark/20">
                  <th scope="col" className="px-4 py-2 text-left font-semibold text-navy">Repayment income</th>
                  <th scope="col" className="px-4 py-2 text-left font-semibold text-navy">Compulsory repayment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {BAND_ROWS.map((band) => (
                  <tr key={band.range}>
                    <td className="px-4 py-2 text-navy tabular-nums whitespace-nowrap">{band.range}</td>
                    <td className="px-4 py-2 text-warmgray">{band.how}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-warmgray-light mt-2">Updated {SITE_CONFIG.lastVerified} — {SITE_CONFIG.financialYear} thresholds applied. Source: <a href={ATO_THRESHOLDS_URL} target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">ATO</a>.</p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-navy mb-1">Repayment income (gross annual)</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="salary" min={0} max={500000} step={1000} value={salary}
                        onChange={(e) => setSalary(clamp(Number(e.target.value || 0), 0, 500000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <input type="range" min={0} max={300000} step={5000} value={clamp(salary, 0, 300000)}
                      onChange={(e) => setSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
                  </div>
                  <button type="submit" className="w-full bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 rounded-lg shadow-md transition-all">Calculate HECS Repayment</button>
                </form>

                <Card className="bg-sandstone border-0 shadow-none" role="region" aria-live="polite">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Your HECS Repayment ({SITE_CONFIG.financialYear})</h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-warmgray">Repayment income</span><span className="font-bold text-navy">{formatAUD(salary)}</span></div>
                      <div className="border-t border-sandstone-dark/20" />
                      {salary <= T ? (
                        <div className="bg-eucalyptus-light/30 rounded-lg p-3 text-center">
                          <p className="text-eucalyptus-dark font-semibold">No compulsory repayment</p>
                          <p className="text-xs text-warmgray-light mt-1">{SITE_CONFIG.financialYear} threshold: {formatAUD(T)}</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-warmgray">Income above threshold</span>
                            <span className="font-medium text-navy">{formatAUD(salary - T)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-navy">Annual compulsory repayment</span>
                            <span className="text-xl font-bold text-ochre">{formatAUD(result.hecsRepayment)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-warmgray-light">Per week impact</span>
                            <span className="text-warmgray-light">{formatAUD(result.weeklyHECS, 2)}/week</span>
                          </div>
                          <div className="border-t border-sandstone-dark/20" />
                          <div className="flex justify-between">
                            <span className="text-warmgray">Take-home (without HECS)</span>
                            <span className="font-medium text-navy">{formatAUD(result.takeHomeWithoutHECS)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-navy">Take-home (with HECS)</span>
                            <span className="font-bold text-eucalyptus-dark">{formatAUD(result.takeHomeWithHECS)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {afterCalculator}
        {children}
      </div>
    </div>
  );
}
