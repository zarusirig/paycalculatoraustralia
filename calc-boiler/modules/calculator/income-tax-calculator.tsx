"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import {
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareLevy,
  formatAUD,
  formatPercent,
  SITE_CONFIG,
  TAX_BRACKETS,
} from "@/lib/constants";
import { AmountPresets, convertPeriod, PERIOD_NOUN, PERIODS_PER_YEAR, PeriodToggle, type EntryPeriod } from "@/modules/calculator/head-term-ui";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const FY = SITE_CONFIG.financialYear; // "2026-27"
const NEW_RATE = formatPercent(TAX_BRACKETS[1].rate, 0); // 15%

const PRESETS: Record<EntryPeriod, readonly number[]> = {
  annual: [45_000, 80_000, 120_000, 190_000],
  monthly: [4_000, 6_000, 8_000, 10_000],
  fortnightly: [2_000, 3_000, 4_000, 5_000],
  weekly: [1_000, 1_500, 2_000, 2_500],
};
const MAX_BY_PERIOD: Record<EntryPeriod, number> = { annual: 500_000, monthly: 45_000, fortnightly: 20_000, weekly: 10_000 };

/**
 * The interactive part of /income-tax-calculator/: hero and calculator card.
 * The long-form content below the card is a server component
 * (income-tax-calculator-content.tsx) passed in as `children`, so it is not
 * part of this client bundle.
 */
export default function IncomeTaxCalculatorPage({ children }: { children: React.ReactNode }) {
  // moneysmart (#1 for "income tax calculator") takes income in the period the
  // user knows; salary below is always the annualised figure the engine needs.
  const [period, setPeriod] = useState<EntryPeriod>("annual");
  const [amount, setAmount] = useState(80_000);
  const salary = Math.round(amount * PERIODS_PER_YEAR[period]);

  const result = useMemo(() => {
    const rawTax = calculateIncomeTax(salary);
    const litoOffset = calculateLITO(salary);
    const netTax = Math.max(0, Math.round(rawTax - litoOffset));
    const medicare = calculateMedicareLevy(salary);
    const totalTax = netTax + medicare;
    const takeHome = salary - totalTax;
    const effectiveRate = salary > 0 ? totalTax / salary : 0;

    // Bracket breakdown
    const bracketBreakdown = TAX_BRACKETS.map((bracket) => {
      const lower = bracket.min === 0 ? 0 : bracket.min;
      const upper = bracket.max === Infinity ? salary : Math.min(bracket.max, salary);
      if (salary < lower) return { ...bracket, inBracket: 0, taxOnBracket: 0 };
      const inBracket = Math.max(0, upper - (lower === 0 ? 0 : lower - 1));
      const taxOnBracket = Math.round(inBracket * bracket.rate);
      return { ...bracket, inBracket, taxOnBracket };
    }).filter((b) => b.inBracket > 0);

    // Marginal rate
    let marginalRate = 0;
    for (const bracket of TAX_BRACKETS) {
      if (salary >= bracket.min) marginalRate = bracket.rate;
    }

    return { rawTax: Math.round(rawTax), litoOffset: Math.round(litoOffset), netTax, medicare, totalTax, takeHome, effectiveRate, bracketBreakdown, marginalRate };
  }, [salary]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* HERO — compact so the calculator is above the fold (intent map, Sep 2026).
              The 5-bracket summary box moved directly under the calculator. */}
          <section className="bg-eucalyptus-light/40 rounded-2xl p-5 md:p-8">
            <div className="max-w-4xl mx-auto">
              <nav aria-label="breadcrumb">
                <ol className="flex items-center space-x-1 text-sm text-warmgray">
                  <li><Link className="hover:text-eucalyptus-dark hover:underline" href="/">Pay Calculator</Link></li>
                  <li className="flex items-center"><ChevronRight className="h-3 w-3 text-gray-400" /></li>
                  <li><span className="font-medium text-navy" aria-current="page">Income Tax Calculator</span></li>
                </ol>
              </nav>

              <h1 className="mt-3 mb-2 text-2xl md:text-4xl font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Income Tax Calculator Australia {FY} — Simple Tax Calculator
              </h1>
              <p className="text-base md:text-lg text-warmgray">
                Work out exactly how much income tax you pay on any annual, monthly, fortnightly or weekly income using the official ATO rates for FY{FY} — including the new {NEW_RATE} bracket that started on 1 July 2026 and the Low Income Tax Offset (LITO).
              </p>
              <TrustBar className="mt-3" />
            </div>
          </section>

          {/* CALCULATOR */}
          <section className="max-w-4xl mx-auto">
            <Card className="shadow-md">
              <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Input */}
                  <div className="space-y-6">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                      <PeriodToggle periods={["annual", "monthly", "fortnightly", "weekly"]} value={period} label="Income frequency"
                        onChange={(p) => { setAmount(convertPeriod(amount, period, p)); setPeriod(p); }} />
                      <div>
                        <label htmlFor="salary" className="block text-sm font-medium text-navy mb-1">
                          Taxable income (per {PERIOD_NOUN[period]}, before tax)
                        </label>
                        <div className="flex items-center">
                          <span className="text-warmgray-light mr-2">$</span>
                          <input
                            type="number" id="salary" name="salary"
                            min={0} max={MAX_BY_PERIOD[period]} step={period === "annual" ? 1000 : 1}
                            className="block w-full rounded-md border-sandstone-dark/30 text-lg font-semibold shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20"
                            value={amount}
                            onChange={(e) => setAmount(clamp(Number(e.target.value || 0), 0, MAX_BY_PERIOD[period]))}
                          />
                        </div>
                        {period === "annual" && (
                          <input type="range" min={0} max={300000} step={5000} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1}
                            value={clamp(amount, 0, 300000)} onChange={(e) => setAmount(Number(e.target.value))} />
                        )}
                        <AmountPresets values={PRESETS[period]} current={amount} onPick={setAmount} />
                        {period !== "annual" && <p className="mt-1 text-xs text-warmgray-light">= {formatAUD(salary)} a year</p>}
                        {/* Mobile: the result card stacks below the form, so surface the answer here too. */}
                        <p className="mt-3 rounded-lg bg-eucalyptus-light/40 px-3 py-2 text-sm text-navy md:hidden" aria-hidden="true">
                          Tax: <strong className="text-ochre">{formatAUD(result.totalTax)}</strong> a year · take-home <strong className="text-eucalyptus-dark">{formatAUD(result.takeHome)}</strong>
                        </p>
                      </div>
                      <div className="pt-4">
                        <button type="submit" className="w-full bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200">
                          Calculate Income Tax
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Results */}
                  <Card className="bg-sandstone border-0 shadow-none" role="region" aria-live="polite">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold text-navy mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tax Breakdown</h2>
                      {/* Headline answer first (moneysmart: "The estimated tax on your taxable income is …"). */}
                      <div className="mb-4 rounded-xl bg-white p-4 text-center shadow-sm">
                        <p className="text-xs text-warmgray-light">Estimated tax on {formatAUD(salary)} a year</p>
                        <p className="text-3xl font-extrabold text-ochre">{formatAUD(result.totalTax)}</p>
                        <p className="text-xs text-warmgray">income tax + Medicare · {period === "annual" ? `${formatAUD(result.totalTax / 52)} per week` : `${formatAUD(result.totalTax / PERIODS_PER_YEAR[period])} per ${PERIOD_NOUN[period]}`}</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between"><span className="text-warmgray">Gross Income</span><span className="font-bold text-navy">{formatAUD(salary)}</span></div>
                        <div className="border-t border-sandstone-dark/20" />
                        <div className="flex justify-between"><span className="text-warmgray">Income Tax</span><span className="font-medium text-navy">-{formatAUD(result.rawTax)}</span></div>
                        {result.litoOffset > 0 && (
                          <div className="flex justify-between pl-4"><span className="text-warmgray-light text-sm">LITO Offset</span><span className="text-sm text-eucalyptus">+{formatAUD(result.litoOffset)}</span></div>
                        )}
                        <div className="flex justify-between"><span className="text-warmgray">Net Income Tax</span><span className="font-bold text-navy">-{formatAUD(result.netTax)}</span></div>
                        <div className="flex justify-between"><span className="text-warmgray">Medicare Levy (2%)</span><span className="font-medium text-navy">-{formatAUD(result.medicare)}</span></div>
                        <div className="border-t border-sandstone-dark/20" />
                        <div className="flex justify-between"><span className="font-semibold text-navy">Total Tax</span><span className="text-xl font-bold text-ochre">-{formatAUD(result.totalTax)}</span></div>
                        <div className="flex justify-between"><span className="font-semibold text-navy">Take-Home Pay</span><span className="text-xl font-bold text-eucalyptus-dark">{formatAUD(result.takeHome)}</span></div>
                        <div className="flex gap-4 mt-2 text-xs text-warmgray-light">
                          <span>Effective rate: <strong className="text-navy">{formatPercent(result.effectiveRate)}</strong></span>
                          <span>Marginal rate: <strong className="text-navy">{formatPercent(result.marginalRate)}</strong></span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bracket breakdown table */}
                {result.bracketBreakdown.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-navy mb-3">Your Tax by Bracket</h3>
                    <div className="overflow-x-auto rounded-lg border border-sandstone-dark/20">
                      <table className="w-full text-sm">
                        <thead className="bg-sandstone">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium text-warmgray">Bracket</th>
                            <th className="px-4 py-2 text-right font-medium text-warmgray">Income in Bracket</th>
                            <th className="px-4 py-2 text-right font-medium text-warmgray">Rate</th>
                            <th className="px-4 py-2 text-right font-medium text-warmgray">Tax</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {result.bracketBreakdown.map((b, i) => (
                            <tr key={i} className="hover:bg-sandstone">
                              <td className="px-4 py-2 text-navy">{formatAUD(b.min)} – {b.max === Infinity ? "+" : formatAUD(b.max)}</td>
                              <td className="px-4 py-2 text-right text-navy">{formatAUD(b.inBracket)}</td>
                              <td className="px-4 py-2 text-right text-navy">{formatPercent(b.rate, 0)}</td>
                              <td className="px-4 py-2 text-right font-medium text-navy">{formatAUD(b.taxOnBracket)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="mt-6">
                  <div className="bg-sandstone border-l-4 border-eucalyptus p-4 text-sm text-warmgray">
                    <p className="font-medium mb-1">Disclaimer:</p>
                    <p>Calculations are estimates based on current Australian tax rates published by the ATO. For personal tax advice, consult a registered tax agent.</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-warmgray border-t border-sandstone-dark/20 pt-4">
                  <p className="flex items-center">
                    <ShieldCheck className="w-4 h-4 text-eucalyptus mr-2" />
                    <span>Based on official ATO tax rates for FY{FY}, last verified {SITE_CONFIG.lastVerified}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
          {children}
        </div>
      </div>
    </div>
  );
}
