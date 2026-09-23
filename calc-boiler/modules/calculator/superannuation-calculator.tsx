"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import {
  calculateSuper,
  formatAUD,
  formatPercent,
  SUPER_GUARANTEE,
  SITE_CONFIG,
  annualToWeekly,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * The interactive part of /superannuation-calculator/: hero, calculator card
 * and the two content sections that quote the entered salary. The static
 * long-form content is server-rendered (superannuation-calculator-content.tsx)
 * and passed in as `intro`, `middle` and `children`, so it is not part of this
 * client bundle.
 */
export default function SuperannuationCalculatorPage({
  intro,
  middle,
  children,
}: {
  intro: React.ReactNode;
  middle: React.ReactNode;
  children: React.ReactNode;
}) {
  const [salary, setSalary] = useState(80_000);

  const result = useMemo(() => {
    const superContrib = calculateSuper(salary);
    const totalPackage = salary + superContrib;
    const weeklySuper = annualToWeekly(superContrib);
    const concessionalCapRemaining = Math.max(0, SUPER_GUARANTEE.concessionalCap - superContrib);
    return { superContrib, totalPackage, weeklySuper, concessionalCapRemaining };
  }, [salary]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb"><ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-gray-400" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Superannuation Calculator</span></li>
          </ol></nav>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Superannuation Calculator Australia — How Much Super Your Employer Pays ({SITE_CONFIG.financialYear})</h1>
          <p className="text-lg text-navy">
            Your employer pays <strong>{formatPercent(SUPER_GUARANTEE.rate, 0)} super</strong> on top of your salary. On <strong>$80,000</strong> that is{" "}
            <strong>{formatAUD(calculateSuper(80_000))} a year</strong> ({formatAUD(annualToWeekly(calculateSuper(80_000)), 2)} a week), paid with every pay from{" "}
            {SUPER_GUARANTEE.paydaySuperStart} under Payday Super.
          </p>
          <p className="text-warmgray mt-2">Enter your salary to see your employer super, total package and concessional cap space.</p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
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
                  <button type="submit" className="w-full bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 rounded-lg shadow-md transition-all">Calculate Super</button>
                </form>

                <Card className="bg-sandstone border-0 shadow-none" role="region" aria-live="polite">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Super Breakdown</h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-warmgray">Base Salary</span><span className="font-bold text-navy">{formatAUD(salary)}</span></div>
                      <div className="border-t border-sandstone-dark/20" />
                      <div className="flex justify-between"><span className="text-warmgray">SG Rate</span><span className="font-medium text-navy">{formatPercent(SUPER_GUARANTEE.rate, 0)}</span></div>
                      <div className="flex justify-between"><span className="font-semibold text-navy">Employer Super Contribution</span><span className="text-xl font-bold text-ochre">{formatAUD(result.superContrib)}</span></div>
                      <div className="flex justify-between"><span className="text-warmgray-light text-xs">Per week</span><span className="text-warmgray-light text-xs">{formatAUD(result.weeklySuper, 2)}</span></div>
                      <div className="border-t border-sandstone-dark/20" />
                      <div className="flex justify-between"><span className="font-semibold text-navy">Total Package</span><span className="font-bold text-navy">{formatAUD(result.totalPackage)}</span></div>
                      <div className="rounded-lg bg-sandstone/50 p-2 text-xs text-center text-ochre">
                        Concessional cap remaining: {formatAUD(result.concessionalCapRemaining)} for salary sacrifice
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">

          {intro}

          {/* --- Superannuation vs Salary Sacrifice --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does Salary Sacrifice Into Super Compare to Standard SG?</h2>
            <p className="mb-4 text-warmgray">Salary sacrifice redirects pre-tax salary into your super fund at a concessional tax rate of <strong>15%</strong> instead of your marginal tax rate, which can be as high as 45% depending on income.</p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th className="px-4 py-3 text-left font-semibold text-navy">Feature</th><th className="px-4 py-3 text-left font-semibold text-navy">Employer SG (Mandatory)</th><th className="px-4 py-3 text-left font-semibold text-navy">Salary Sacrifice (Voluntary)</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy font-medium">Rate</td><td className="px-4 py-3 text-warmgray">12% of OTE</td><td className="px-4 py-3 text-warmgray">Any amount up to cap</td></tr>
                  <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy font-medium">Tax on contribution</td><td className="px-4 py-3 text-warmgray">15% in fund</td><td className="px-4 py-3 text-warmgray">15% in fund</td></tr>
                  <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy font-medium">Impact on take-home pay</td><td className="px-4 py-3 text-warmgray">None — paid on top of salary</td><td className="px-4 py-3 text-warmgray">Reduces gross salary</td></tr>
                  <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy font-medium">Concessional cap</td><td className="px-4 py-3 text-warmgray">Counts toward {formatAUD(SUPER_GUARANTEE.concessionalCap)}</td><td className="px-4 py-3 text-warmgray">Counts toward {formatAUD(SUPER_GUARANTEE.concessionalCap)}</td></tr>
                  <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy font-medium">Who initiates</td><td className="px-4 py-3 text-warmgray">Employer (legal obligation)</td><td className="px-4 py-3 text-warmgray">Employee (voluntary agreement)</td></tr>
                  <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy font-medium">Tax saving at $100K salary</td><td className="px-4 py-3 text-warmgray">N/A (employer cost)</td><td className="px-4 py-3 text-warmgray">$1,500 per $10,000 sacrificed</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray mb-3">On a salary of {formatAUD(salary)}, your employer pays {formatAUD(result.superContrib)} in mandatory SG, leaving <strong>{formatAUD(result.concessionalCapRemaining)}</strong> in concessional cap space. Sacrificing this full amount saves you tax at your marginal rate minus the 15% contributions tax.</p>
            <p className="text-sm text-warmgray-light"><Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Salary Sacrifice Calculator</Link> — model exact take-home pay differences before and after sacrifice.</p>
          </section>

          {middle}

          {/* --- Salary Sacrifice Into Super (existing, preserved) --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Salary Sacrifice Into Super</h2>
            <p className="mb-3 text-warmgray">You can voluntarily redirect part of your pre-tax salary into super through a salary sacrifice arrangement. These contributions are taxed at 15% inside the fund instead of your marginal rate (up to 45%), making it one of the most effective tax-saving strategies available.</p>
            <p className="mb-3 text-warmgray">Your salary sacrifice counts towards the {formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap along with your employer&apos;s SG contributions. On {formatAUD(salary)}, your employer pays {formatAUD(result.superContrib)} in SG, leaving you <strong>{formatAUD(result.concessionalCapRemaining)}</strong> in cap space for voluntary contributions.</p>
            <p className="text-sm text-warmgray-light"><Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Compare your pay before and after salary sacrifice</Link></p>
          </section>

          {children}
        </div>
      </div>
    </div>
  );
}
