"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareLevy,
  formatAUD,
  formatPercent,
  HECS_HELP,
  LITO,
  MEDICARE_LEVY,
  NON_RESIDENT_TAX_BRACKETS,
  SITE_CONFIG,
  SOURCES,
  TAX_BRACKETS,
  TAX_BRACKETS_2025_26,
  TAX_FREE_THRESHOLD,
} from "@/lib/constants";
import { SAPTO_BANDS, SAPTO_INCOME_YEAR } from "@/lib/constants/sapto";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Tax rates – foreign residents", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-foreign-residents", publisher: SOURCES.ato.name },
  { title: "Tax rates – working holiday makers", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-working-holiday-makers", publisher: SOURCES.ato.name },
  { title: "Low Income Tax Offset", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/low-income-tax-offset", publisher: SOURCES.ato.name },
  { title: "Study and training support loans rates and thresholds", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: SOURCES.ato.name },
  { title: "PAYG withholding", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/payg-withholding", publisher: SOURCES.ato.name },
];

// ---------------------------------------------------------------------------
// All worked-example figures are computed from the engine at module scope.
// The page is statically exported, so this costs nothing at runtime and the
// prose can never disagree with the calculator the way the hardcoded
// 16%/$14,788 examples did after the 1 July 2026 rate cut.
// ---------------------------------------------------------------------------

const FY = SITE_CONFIG.financialYear; // "2026-27"
const PREV_FY = SITE_CONFIG.previousFinancialYear; // "2025-26"
const NEW_RATE = formatPercent(TAX_BRACKETS[1].rate, 0); // 15%
const OLD_RATE = formatPercent(TAX_BRACKETS_2025_26[1].rate, 0); // 16%
/** Maximum annual value of the 1 July 2026 cut: bracket-2 width × 1 point. */
const RATE_CUT_SAVING = Math.round(
  (TAX_BRACKETS[1].max - TAX_FREE_THRESHOLD) * (TAX_BRACKETS_2025_26[1].rate - TAX_BRACKETS[1].rate)
);
/** MLS starts above this income for singles without hospital cover. */
const MLS_START = MEDICARE_LEVY.surcharge.tier1.min - 1;

/** FY2025-26 gross income tax from the historical bracket constant — comparison only. */
function taxIn2025_26(income: number): number {
  for (let i = TAX_BRACKETS_2025_26.length - 1; i >= 0; i--) {
    const b = TAX_BRACKETS_2025_26[i];
    if (income >= b.min) return Math.round(b.base + (income - (b.min - 1)) * b.rate);
  }
  return 0;
}

/** Net-of-LITO annual pipeline for the ladder and prose. */
function taxSummary(salary: number) {
  const net = Math.max(0, Math.round(calculateIncomeTax(salary) - calculateLITO(salary)));
  const medicare = calculateMedicareLevy(salary);
  const total = net + medicare;
  return { net, medicare, total, takeHome: salary - total, effective: total / salary };
}

/** $80,000 step-by-step walkthrough, every line derived from TAX_BRACKETS. */
const EX = (() => {
  const salary = 80_000;
  const b2 = TAX_BRACKETS[1];
  const b3 = TAX_BRACKETS[2];
  const taxInB2 = Math.round((b2.max - TAX_FREE_THRESHOLD) * b2.rate);
  const taxInB3 = Math.round((salary - (b3.min - 1)) * b3.rate);
  const gross = Math.round(calculateIncomeTax(salary));
  const lito = Math.round(calculateLITO(salary));
  const net = Math.max(0, gross - lito);
  const medicare = calculateMedicareLevy(salary);
  const total = net + medicare;
  const takeHome = salary - total;
  return { salary, b2, b3, taxInB2, taxInB3, gross, lito, net, medicare, total, takeHome, weekly: takeHome / 52, effective: total / salary };
})();

/** Salaries for the tax ladder — every value has a /tax-on/ page (30k–200k in 5k steps). */
const LADDER = [30_000, 40_000, 45_000, 50_000, 60_000, 70_000, 80_000, 90_000, 100_000, 120_000, 150_000, 200_000];
const COMPARISON_SALARIES = [30_000, 45_000, 60_000, 80_000, 100_000, 150_000];

export default function IncomeTaxCalculatorPage({ faqs }: { faqs: readonly { q: string; a: string }[] }) {
  const [salary, setSalary] = useState(80_000);

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
          {/* HERO */}
          <section className="bg-eucalyptus-light/40 rounded-2xl p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <nav aria-label="breadcrumb">
                <ol className="flex items-center space-x-1 text-sm text-warmgray">
                  <li><Link className="hover:text-eucalyptus-dark hover:underline" href="/">Pay Calculator</Link></li>
                  <li className="flex items-center"><ChevronRight className="h-3 w-3 text-gray-400" /></li>
                  <li><span className="font-medium text-navy" aria-current="page">Income Tax Calculator</span></li>
                </ol>
              </nav>

              <div className="flex justify-between items-start mb-4 mt-4">
                <h1 className="text-3xl md:text-4xl font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  Income Tax Calculator Australia {FY}
                </h1>
              </div>
              <p className="text-xl text-warmgray">
                Work out exactly how much income tax you pay on any salary using the official ATO rates for FY{FY} — including the new {NEW_RATE} bracket that started on 1 July 2026 and the Low Income Tax Offset (LITO).
              </p>
              <div className="mt-6 bg-white/70 border-l-4 border-eucalyptus-dark rounded-lg p-5 text-warmgray">
                <p className="text-base leading-relaxed">
                  <strong className="text-navy">Australian income tax for FY{FY} uses 5 brackets:</strong> 0% up to {formatAUD(TAX_FREE_THRESHOLD)}, {NEW_RATE} to {formatAUD(TAX_BRACKETS[1].max)}, {formatPercent(TAX_BRACKETS[2].rate, 0)} to {formatAUD(TAX_BRACKETS[2].max)}, {formatPercent(TAX_BRACKETS[3].rate, 0)} to {formatAUD(TAX_BRACKETS[3].max)}, and {formatPercent(TAX_BRACKETS[4].rate, 0)} above. Most workers also pay the 2% <Link href="/medicare-levy/" className="text-eucalyptus-dark hover:underline font-medium">Medicare levy</Link> and may have <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline font-medium">HECS/HELP repayments</Link>. Lodging your {PREV_FY} return? The old {OLD_RATE} rate applied — see the <Link href="/tax-return-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Tax Return Calculator</Link>.
                </p>
              </div>
              <TrustBar className="mt-4" />
            </div>
          </section>

          {/* CALCULATOR */}
          <section className="max-w-4xl mx-auto">
            <Card className="shadow-md">
              <CardContent className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Input */}
                  <div className="space-y-6">
                    <form onSubmit={(e) => e.preventDefault()}>
                      <div>
                        <label htmlFor="salary" className="block text-sm font-medium text-navy mb-1">
                          Gross Annual Salary
                        </label>
                        <div className="flex items-center">
                          <span className="text-warmgray-light mr-2">$</span>
                          <input
                            type="number" id="salary" name="salary"
                            min={0} max={500000} step={1000}
                            className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm"
                            value={salary}
                            onChange={(e) => setSalary(clamp(Number(e.target.value || 0), 0, 500000))}
                          />
                        </div>
                        <input type="range" min={0} max={300000} step={5000} className="mt-2 w-full accent-eucalyptus" aria-hidden="true"
                          value={clamp(salary, 0, 300000)} onChange={(e) => setSalary(Number(e.target.value))} />
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
                      <h2 className="text-xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tax Breakdown</h2>
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

          {/* CONTENT SECTIONS */}
          <div className="max-w-4xl mx-auto space-y-10">

            {/* Tax brackets table */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Income Tax Brackets for FY{FY}?</h2>
              <p className="mb-4 text-warmgray">Australia has <strong>5 income tax brackets</strong> for resident taxpayers in FY{FY}, ranging from 0% on the first {formatAUD(TAX_FREE_THRESHOLD)} to {formatPercent(TAX_BRACKETS[4].rate, 0)} on income above {formatAUD(TAX_BRACKETS[3].max)}. The table below shows the full <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline font-medium">ATO tax brackets</Link> with cumulative tax at the top of each bracket.</p>
              <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
                <table className="w-full text-sm">
                  <thead className="bg-sandstone">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-navy">Income Range</th>
                      <th className="px-4 py-3 text-left font-semibold text-navy">Tax Rate</th>
                      <th className="px-4 py-3 text-left font-semibold text-navy">Tax on Range</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">Cumulative Tax</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {TAX_BRACKETS.map((bracket, i) => {
                      const rangeWidth = bracket.max === Infinity ? null : bracket.max - (bracket.min === 0 ? 0 : bracket.min - 1);
                      const taxOnRange = rangeWidth == null ? null : Math.round(rangeWidth * bracket.rate);
                      const cumulativeAtTop = bracket.max === Infinity ? null : Math.round(calculateIncomeTax(bracket.max));
                      return (
                        <tr key={i} className="hover:bg-sandstone">
                          <td className="px-4 py-3 text-navy">{formatAUD(bracket.min)} – {bracket.max === Infinity ? "+" : formatAUD(bracket.max)}</td>
                          <td className="px-4 py-3 font-medium text-navy">{formatPercent(bracket.rate, 0)}</td>
                          <td className="px-4 py-3 text-warmgray">{taxOnRange == null ? `+45c per $1 over ${formatAUD(TAX_BRACKETS[3].max)}` : formatAUD(taxOnRange)}</td>
                          <td className="px-4 py-3 text-right text-navy font-medium">{cumulativeAtTop == null ? "—" : formatAUD(cumulativeAtTop)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-warmgray">The {NEW_RATE} second rate is new: it dropped from {OLD_RATE} on <strong>1 July 2026</strong> under the legislated cost-of-living tax cuts, saving up to <strong>{formatAUD(RATE_CUT_SAVING)} a year</strong> for anyone earning over {formatAUD(TAX_BRACKETS[1].max)}. It is the only bracket change from {PREV_FY} — see the <Link href="/tax-bracket-history/" className="text-eucalyptus-dark hover:underline font-medium">tax bracket history</Link> for every year since 2018.</p>

              <h3 className="text-lg font-semibold text-navy mb-2 mt-6">Non-Resident and Working Holiday Maker Rates</h3>
              <p className="mb-3 text-warmgray">Different scales apply if you are not an Australian resident for tax purposes. Neither group receives the {formatAUD(TAX_FREE_THRESHOLD)} tax-free threshold or LITO, and neither pays the Medicare levy.</p>
              <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
                <table className="w-full text-sm">
                  <thead className="bg-sandstone">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-navy">Taxpayer Type</th>
                      <th className="px-4 py-3 text-left font-semibold text-navy">FY{FY} Rates</th>
                      <th className="px-4 py-3 text-left font-semibold text-navy">Full Guide</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-sandstone">
                      <td className="px-4 py-3 font-medium text-navy">Foreign resident</td>
                      <td className="px-4 py-3 text-warmgray">{formatPercent(NON_RESIDENT_TAX_BRACKETS[0].rate, 0)} from the first dollar to {formatAUD(NON_RESIDENT_TAX_BRACKETS[0].max)}, then {formatPercent(NON_RESIDENT_TAX_BRACKETS[1].rate, 0)} to {formatAUD(NON_RESIDENT_TAX_BRACKETS[1].max)} and {formatPercent(NON_RESIDENT_TAX_BRACKETS[2].rate, 0)} above</td>
                      <td className="px-4 py-3"><Link href="/non-resident-tax/" className="text-eucalyptus-dark hover:underline font-medium">Non-resident tax →</Link></td>
                    </tr>
                    <tr className="hover:bg-sandstone">
                      <td className="px-4 py-3 font-medium text-navy">Working holiday maker (417/462 visa)</td>
                      {/* WHM 15%/$45,000 per ATO Schedule 15 — unchanged since 2017; matches /working-holiday-tax/. No engine constant exists for the WHM scale. */}
                      <td className="px-4 py-3 text-warmgray">15% on the first $45,000, then foreign-resident rates apply above that</td>
                      <td className="px-4 py-3"><Link href="/working-holiday-tax/" className="text-eucalyptus-dark hover:underline font-medium">Working holiday tax →</Link></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* How Is Income Tax Calculated in Australia? */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Income Tax Calculated in Australia?</h2>
              <p className="mb-4 text-warmgray">Income tax is calculated with a progressive marginal system: your income is sliced across the brackets and each slice is taxed at that bracket&apos;s rate — your whole salary is never taxed at one rate. Here is the exact calculation for a gross salary of <strong>{formatAUD(EX.salary)}</strong> in FY{FY}:</p>
              <ol className="list-decimal pl-6 space-y-3 text-warmgray mb-4">
                <li><strong>Apply the tax-free threshold.</strong> The first {formatAUD(TAX_FREE_THRESHOLD)} is taxed at <strong>0%</strong> — tax on this slice is <strong>$0</strong>.</li>
                <li><strong>Tax each remaining slice at its bracket rate.</strong> {formatAUD(EX.b2.min)}–{formatAUD(EX.b2.max)} at {formatPercent(EX.b2.rate, 0)} = <strong>{formatAUD(EX.taxInB2)}</strong>. {formatAUD(EX.b3.min)}–{formatAUD(EX.salary)} at {formatPercent(EX.b3.rate, 0)} = <strong>{formatAUD(EX.taxInB3)}</strong>. Gross income tax totals <strong>{formatAUD(EX.gross)}</strong>.</li>
                <li><strong>Subtract tax offsets.</strong> At {formatAUD(EX.salary)}, LITO has fully phased out (it ends at {formatAUD(LITO.nilOffsetIncome)}), so the offset is <strong>{formatAUD(EX.lito)}</strong> and net income tax stays at <strong>{formatAUD(EX.net)}</strong>.</li>
                <li><strong>Add the Medicare levy.</strong> {formatPercent(MEDICARE_LEVY.rate, 0)} of {formatAUD(EX.salary)} = <strong>{formatAUD(EX.medicare)}</strong>. Total tax is <strong>{formatAUD(EX.total)}</strong>.</li>
              </ol>
              <p className="text-warmgray">Take-home pay on {formatAUD(EX.salary)} is <strong>{formatAUD(EX.takeHome)} per year</strong>, or <strong>{formatAUD(EX.weekly, 2)} per week</strong>. The effective rate is <strong>{formatPercent(EX.effective)}</strong> — well below the {formatPercent(EX.b3.rate, 0)} marginal rate, because the lower slices are taxed lightly. For take-home pay with super, HECS and salary sacrifice included, use the <Link href="/" className="text-eucalyptus-dark hover:underline font-medium">pay calculator on our homepage</Link>.</p>
            </section>

            {/* Tax on common salaries (with /tax-on/ links) */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much Tax Do You Pay at Every Salary?</h2>
              <p className="mb-4 text-warmgray">Quick reference for income tax, Medicare levy, take-home pay and effective tax rate across the salaries Australians most commonly search. Click any salary for the full <Link href="/tax-on/80000/" className="text-eucalyptus-dark hover:underline font-medium">tax on $80,000</Link>-style breakdown with weekly, fortnightly and monthly figures.</p>
              <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
                <table className="w-full text-sm">
                  <thead className="bg-sandstone">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-navy">Salary</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">Income Tax</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">Medicare Levy</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">Take-Home</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">Effective Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {LADDER.map((s) => {
                      const t = taxSummary(s);
                      return (
                        <tr key={s} className="hover:bg-sandstone">
                          <td className="px-4 py-3 font-medium">
                            <Link href={`/tax-on/${s}/`} className="text-eucalyptus-dark hover:underline">{formatAUD(s)}</Link>
                          </td>
                          <td className="px-4 py-3 text-right text-navy">{formatAUD(t.net)}</td>
                          <td className="px-4 py-3 text-right text-navy">{formatAUD(t.medicare)}</td>
                          <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(t.takeHome)}</td>
                          <td className="px-4 py-3 text-right text-warmgray-light">{formatPercent(t.effective)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-warmgray">Figures use FY{FY} resident rates with LITO applied where eligible and the Medicare levy&apos;s low-income reduction included. HECS-HELP and the <Link href="/medicare-levy/" className="text-eucalyptus-dark hover:underline font-medium">Medicare Levy Surcharge</Link> are excluded. Taxing a one-off payment instead? See the <Link href="/bonus-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Bonus Tax Calculator</Link>.</p>
            </section>

            {/* Offsets */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Tax Offsets Reduce Your Income Tax?</h2>
              <p className="mb-4 text-warmgray">Tax offsets reduce your final tax bill dollar-for-dollar, unlike deductions, which lower assessable income before the brackets apply. Two offsets matter to most taxpayers.</p>

              <h3 className="text-lg font-semibold text-navy mb-2">Low Income Tax Offset (LITO)</h3>
              <p className="mb-3 text-warmgray">Taxpayers earning under {formatAUD(LITO.nilOffsetIncome)} receive LITO automatically — up to <strong>{formatAUD(LITO.maxOffset)}</strong> — when their return is assessed. No form is required.</p>
              <ul className="list-disc pl-6 space-y-1 text-warmgray">
                <li>Income up to {formatAUD(LITO.fullOffsetCeiling)}: full {formatAUD(LITO.maxOffset)} offset</li>
                <li>{formatAUD(LITO.phaseOut1.start)} – {formatAUD(LITO.phaseOut1.end)}: reduces at 5c per dollar over {formatAUD(LITO.fullOffsetCeiling)}</li>
                <li>{formatAUD(LITO.phaseOut2.start)} – {formatAUD(LITO.nilOffsetIncome)}: reduces at 1.5c per dollar over {formatAUD(LITO.phaseOut1.end)}</li>
              </ul>
              <p className="mt-3 text-sm text-warmgray-light">
                Combined with the tax-free threshold, LITO means you pay no net income tax until your income passes <strong>{formatAUD(LITO.effectiveTaxFreeThreshold)}</strong> in FY{FY}.{" "}
                <Link href="/low-income-tax-offset/" className="text-eucalyptus-dark hover:underline font-medium">Full LITO guide →</Link>
              </p>

              <h3 className="text-lg font-semibold text-navy mb-2 mt-6">Seniors and Pensioners Tax Offset (SAPTO)</h3>
              <p className="mb-3 text-warmgray">Australians of Age Pension age who meet the rebate-income tests qualify for SAPTO (ATO figures for {SAPTO_INCOME_YEAR}, the year currently being lodged):</p>
              <ul className="list-disc pl-6 space-y-1 text-warmgray">
                <li><strong>Singles:</strong> up to {formatAUD(SAPTO_BANDS.single.maxOffset)}, shading out from {formatAUD(SAPTO_BANDS.single.shadingOutThreshold)} and cutting out at {formatAUD(SAPTO_BANDS.single.cutOutThreshold)}</li>
                <li><strong>Couples:</strong> up to {formatAUD(SAPTO_BANDS.couple.maxOffset)} each, with eligibility tested on combined rebate income up to {formatAUD(SAPTO_BANDS.couple.combinedCutOut)}</li>
                <li>SAPTO is non-refundable — it can reduce tax to zero but does not generate a refund</li>
              </ul>
              <p className="mt-3 text-sm text-warmgray-light">
                Model your exact offset with the <Link href="/sapto-calculator/" className="text-eucalyptus-dark hover:underline font-medium">SAPTO Calculator</Link>.
              </p>
            </section>

            {/* 2025-26 vs 2026-27 */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{PREV_FY} vs {FY}: What Changed on 1 July 2026?</h2>
              <p className="mb-4 text-warmgray">One bracket changed: the rate on income between {formatAUD(TAX_BRACKETS[1].min)} and {formatAUD(TAX_BRACKETS[1].max)} fell from <strong>{OLD_RATE} to {NEW_RATE}</strong>. Because that bracket sits under everyone&apos;s income, every taxpayer earning above {formatAUD(TAX_FREE_THRESHOLD)} gets the cut, capped at <strong>{formatAUD(RATE_CUT_SAVING)} a year</strong> once income passes {formatAUD(TAX_BRACKETS[1].max)}.</p>
              <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
                <table className="w-full text-sm">
                  <thead className="bg-sandstone">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-navy">Salary</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">Income Tax FY{PREV_FY}</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">Income Tax FY{FY}</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">You Save</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {COMPARISON_SALARIES.map((s) => {
                      const oldTax = taxIn2025_26(s);
                      const newTax = Math.round(calculateIncomeTax(s));
                      return (
                        <tr key={s} className="hover:bg-sandstone">
                          <td className="px-4 py-3 font-medium text-navy">{formatAUD(s)}</td>
                          <td className="px-4 py-3 text-right text-warmgray">{formatAUD(oldTax)}</td>
                          <td className="px-4 py-3 text-right text-navy">{formatAUD(newTax)}</td>
                          <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">−{formatAUD(oldTax - newTax)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-warmgray-light">Gross income tax before offsets; LITO and the Medicare levy are identical in both years, so the saving is unaffected. For the 2024 bracket overhaul that preceded this cut, see the <Link href="/stage-3-tax-cuts/" className="text-eucalyptus-dark hover:underline font-medium">Stage 3 tax cuts guide</Link>.</p>

              <div className="mt-6 bg-sandstone border-l-4 border-ochre rounded-lg p-5 text-warmgray">
                <p className="font-semibold text-navy mb-1">Lodging your {PREV_FY} tax return?</p>
                <p className="text-sm leading-relaxed">Returns lodged between July and October 2026 cover FY{PREV_FY}, which used the old {OLD_RATE} rate — income tax on {formatAUD(80_000)} was {formatAUD(taxIn2025_26(80_000))}, not {formatAUD(EX.net)}. Estimate your refund with the <Link href="/tax-return-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Tax Return Calculator</Link>, and see the <Link href="/tax-refund-guide/" className="text-eucalyptus-dark hover:underline font-medium">Tax Refund Guide</Link> for the deductions most people forget to claim.</p>
              </div>
            </section>

            {/* Tax withheld vs tax payable */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tax Withheld vs Tax Payable: Why Your Payslip Differs</h2>
              <p className="mb-4 text-warmgray">This calculator shows your <strong>annual tax liability</strong> — the amount the ATO actually assesses on your income. What comes out of each payslip is <strong>PAYG withholding</strong>: an estimate your employer deducts using the ATO&apos;s withholding schedules, which annualise each pay period in isolation.</p>
              <p className="mb-4 text-warmgray">The two rarely match to the dollar. Withholding can&apos;t see your deductions, a mid-year pay change, a second job, or weeks you didn&apos;t work — so most people end the year slightly over-withheld and receive the difference back as a refund after lodging. If you were under-withheld (common with two jobs both claiming the tax-free threshold), the same reconciliation produces a bill.</p>
              <p className="text-warmgray">To check the exact amount your employer should be withholding each pay, see the <Link href="/payg-withholding-tables/" className="text-eucalyptus-dark hover:underline font-medium">PAYG withholding tables</Link>, or jump straight to the <Link href="/weekly-tax-table/" className="text-eucalyptus-dark hover:underline font-medium">weekly</Link>, <Link href="/fortnightly-tax-table/" className="text-eucalyptus-dark hover:underline font-medium">fortnightly</Link> or <Link href="/monthly-tax-table/" className="text-eucalyptus-dark hover:underline font-medium">monthly tax table</Link>. Bonuses and back pay are withheld under a separate method — the <Link href="/schedule-5-tax-table/" className="text-eucalyptus-dark hover:underline font-medium">Schedule 5 tax table</Link>.</p>
            </section>

            {/* Beyond income tax */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Beyond Income Tax: Medicare, HECS and Residency</h2>
              <p className="mb-3 text-warmgray">Income tax is usually the biggest deduction from your pay, but it is not the only one:</p>
              <ul className="list-disc pl-6 space-y-2 text-warmgray">
                <li><Link href="/medicare-levy/" className="font-medium text-eucalyptus-dark hover:underline">Medicare levy</Link> — <strong>{formatPercent(MEDICARE_LEVY.rate, 0)}</strong> of taxable income for most taxpayers, with a reduction for low incomes. A Medicare Levy Surcharge of 1–1.5% applies above {formatAUD(MLS_START)} (singles) without private hospital cover.</li>
                <li><Link href="/hecs-help-calculator/" className="font-medium text-eucalyptus-dark hover:underline">HECS-HELP repayments</Link> — start at <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong> of repayment income in FY{FY}, at {formatPercent(HECS_HELP.bands[1].marginalRate, 0)} of every dollar above the threshold under the marginal repayment system.</li>
                <li><Link href="/non-resident-tax/" className="font-medium text-eucalyptus-dark hover:underline">Non-resident tax</Link> — foreign residents pay {formatPercent(NON_RESIDENT_TAX_BRACKETS[0].rate, 0)} from the first dollar with no tax-free threshold, while <Link href="/working-holiday-tax/" className="font-medium text-eucalyptus-dark hover:underline">working holiday makers</Link> have their own 15% schedule.</li>
              </ul>
              <p className="mt-3 text-sm text-warmgray-light">
                <Link href="/" className="text-eucalyptus-dark hover:underline font-medium">See your full pay breakdown with every deduction →</Link>{" "}
                Or use the <Link href="/gross-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Gross Pay Calculator</Link> to reverse-engineer a net pay target back to gross salary.
              </p>
            </section>

            <MethodologyDisclosure>
              <ol className="list-decimal space-y-1 pl-4">
                <li>Apply the FY{FY} resident tax brackets to gross income (progressive marginal rates).</li>
                <li>Subtract the Low Income Tax Offset (up to {formatAUD(LITO.maxOffset)} for incomes under {formatAUD(LITO.nilOffsetIncome)}).</li>
                <li>Add the {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy, with the low-income reduction applied.</li>
                <li>Take-home pay = gross salary − net income tax − Medicare levy.</li>
              </ol>
              <p className="mt-2">All rates from the <a className="text-eucalyptus-dark hover:underline" href="https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents" target="_blank" rel="noreferrer noopener">ATO</a>, last verified {SITE_CONFIG.lastVerified}.</p>
            </MethodologyDisclosure>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              {/*
                The Radix accordion unmounts closed content, so answers never
                reach the rendered HTML. This mirror makes them crawlable and
                AI-Overview eligible; the same array feeds the FAQPage JSON-LD
                in app/income-tax-calculator/page.tsx.
              */}
              <div className="sr-only">
                <h3>Income tax questions and answers</h3>
                {faqs.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
              </div>
              <Accordion type="multiple" className="space-y-3">
                {faqs.map((f) => (
                  <AccordionItem key={f.q} value={f.q} className="rounded-xl border border-sandstone-dark/20 px-5">
                    <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                    <AccordionContent><p className="text-warmgray">{f.a}</p></AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Related calculators */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Calculators</h2>
              <p className="mb-4 text-warmgray">Calculate specific components of your tax and pay with these tools:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/tax-return-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Tax Return Calculator</h3>
                  <p className="text-sm text-warmgray">Estimate your {PREV_FY} refund before you lodge this tax season</p>
                </Link>
                <Link href="/take-home-pay-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Take-Home Pay Calculator</h3>
                  <p className="text-sm text-warmgray">Net pay after income tax, Medicare levy, HECS and salary sacrifice</p>
                </Link>
                <Link href="/hecs-help-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">HECS-HELP Calculator</h3>
                  <p className="text-sm text-warmgray">Repayments under the marginal system from {formatAUD(HECS_HELP.minimumThreshold)}</p>
                </Link>
                <Link href="/salary-sacrifice-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Salary Sacrifice Calculator</h3>
                  <p className="text-sm text-warmgray">Model pre-tax super contributions and the income tax they save</p>
                </Link>
                <Link href="/superannuation-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Superannuation Calculator</h3>
                  <p className="text-sm text-warmgray">Your employer&apos;s 12% SG contribution on top of salary</p>
                </Link>
                <Link href="/gross-pay-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Gross Pay Calculator</h3>
                  <p className="text-sm text-warmgray">Reverse-engineer a net pay target back to the required gross salary</p>
                </Link>
              </div>
            </section>

            {/* CTA */}
            <section className="bg-eucalyptus-light/40 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>See Your Full Pay Breakdown</h2>
              <p className="text-warmgray mb-6 max-w-lg mx-auto">Get the complete picture with income tax, Medicare, HECS, and super — all in one calculation.</p>
              <Link href="/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200">
                Calculate Your Take-Home Pay →
              </Link>
            </section>

            <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
          </div>
        </div>
      </div>
    </div>
  );
}
