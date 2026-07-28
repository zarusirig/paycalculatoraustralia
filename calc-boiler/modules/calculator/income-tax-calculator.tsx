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
  TAX_BRACKETS,
  LITO,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Low Income Tax Offset", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/low-income-tax-offset", publisher: SOURCES.ato.name },
  { title: "PAYG withholding", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/payg-withholding", publisher: SOURCES.ato.name },
];

export default function IncomeTaxCalculatorPage() {
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
    const bracketBreakdown = TAX_BRACKETS.map((bracket, i) => {
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
                  Income Tax Calculator Australia 2025-26
                </h1>
              </div>
              <p className="text-xl text-warmgray">
                Find out exactly how much income tax you pay on any salary. Uses the official ATO tax tables for FY{SITE_CONFIG.financialYear}, including the Low Income Tax Offset (LITO).
              </p>
              <div className="mt-6 bg-white/70 border-l-4 border-eucalyptus-dark rounded-lg p-5 text-warmgray">
                <p className="text-base leading-relaxed">
                  <strong className="text-navy">Australian income tax for FY{SITE_CONFIG.financialYear} uses 5 brackets:</strong> 0% up to $18,200, 15% to $45,000, 30% to $135,000, 37% to $190,000, and 45% above. Most workers also pay 2% <Link href="/medicare-levy/" className="text-eucalyptus-dark hover:underline font-medium">Medicare Levy</Link> and may have <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline font-medium">HECS/HELP repayments</Link>. Use the calculator below for your exact figure.
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
                    <span>Based on official ATO tax tables for FY{SITE_CONFIG.financialYear}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CONTENT SECTIONS */}
          <div className="max-w-4xl mx-auto space-y-10">

            {/* How Is Income Tax Calculated in Australia? */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Income Tax Calculated in Australia?</h2>
              <p className="mb-4 text-warmgray">Income tax in Australia is calculated using a progressive marginal rate system where each portion of your assessable income is taxed at the rate for that bracket, not at a single flat rate.</p>
              <p className="mb-4 text-warmgray">The Australian Tax Office applies 4 steps to arrive at your final tax liability. Here is the exact calculation for a gross salary of <strong>$80,000</strong> in FY{SITE_CONFIG.financialYear}:</p>
              <ol className="list-decimal pl-6 space-y-3 text-warmgray mb-4">
                <li><strong>Apply the tax-free threshold.</strong> The first $18,200 is taxed at <strong>0%</strong> — tax on this portion is <strong>$0</strong>.</li>
                <li><strong>Calculate tax on each bracket.</strong> $18,201–$45,000 at 16% = <strong>$4,288</strong>. $45,001–$80,000 at 30% = <strong>$10,500</strong>. Gross income tax totals <strong>$14,788</strong>.</li>
                <li><strong>Subtract the Low Income Tax Offset.</strong> At $80,000, LITO has fully phased out, so the offset is <strong>$0</strong>. Net income tax remains <strong>$14,788</strong>.</li>
                <li><strong>Add the Medicare levy.</strong> 2% of $80,000 = <strong>$1,600</strong>. Total taxation is <strong>$16,388</strong>.</li>
              </ol>
              <p className="text-warmgray">Take-home pay on $80,000 is <strong>$63,612 per year</strong>, or <strong>$1,223.31 per week</strong>. The effective tax rate is <strong>20.49%</strong>, well below the 30% marginal rate. Use our <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Take-Home Pay Calculator</Link> to include HECS repayments and salary sacrifice in the calculation.</p>
            </section>

            {/* Tax brackets table */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Income Tax Brackets for FY{SITE_CONFIG.financialYear}?</h2>
              <p className="mb-4 text-warmgray">Australia has <strong>5 income tax brackets</strong> for resident taxpayers in FY{SITE_CONFIG.financialYear}, ranging from 0% on the first $18,200 to 45% on income above $190,000. The table below shows the full <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline font-medium">ATO tax brackets</Link> with cumulative tax at the top of each bracket.</p>
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
                          <td className="px-4 py-3 text-warmgray">{taxOnRange == null ? "+45c per $1 over $190,000" : formatAUD(taxOnRange)}</td>
                          <td className="px-4 py-3 text-right text-navy font-medium">{cumulativeAtTop == null ? "—" : formatAUD(cumulativeAtTop)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-warmgray">These brackets apply to Australian residents for tax purposes. Non-residents pay <strong>30%</strong> from the first dollar with no tax-free threshold. The Stage 3 tax cuts, legislated in July 2024, reduced the 19% bracket to <strong>16%</strong> and raised the 37% threshold from $120,000 to <strong>$135,000</strong>.</p>
            </section>

            {/* Tax on common salaries (with /tax-on/ links) */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tax on Common Salaries (2025-26)</h2>
              <p className="mb-4 text-warmgray">Quick reference for income tax, Medicare levy, take-home pay, and effective tax rate across the salaries Australians most commonly search for. Click any salary to see the full <Link href="/tax-on/80000/" className="text-eucalyptus-dark hover:underline font-medium">tax on $80,000</Link>-style breakdown with weekly, fortnightly, and monthly figures.</p>
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
                    {[30000, 50000, 75000, 90000, 100000, 120000, 150000, 200000].map((s) => {
                      const raw = calculateIncomeTax(s);
                      const lito = calculateLITO(s);
                      const net = Math.max(0, Math.round(raw - lito));
                      const med = calculateMedicareLevy(s);
                      const total = net + med;
                      const take = s - total;
                      return (
                        <tr key={s} className="hover:bg-sandstone">
                          <td className="px-4 py-3 font-medium">
                            <Link href={`/tax-on/${s}/`} className="text-eucalyptus-dark hover:underline">{formatAUD(s)}</Link>
                          </td>
                          <td className="px-4 py-3 text-right text-navy">{formatAUD(net)}</td>
                          <td className="px-4 py-3 text-right text-navy">{formatAUD(med)}</td>
                          <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(take)}</td>
                          <td className="px-4 py-3 text-right text-warmgray-light">{formatPercent(total / s)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-warmgray">Figures use FY{SITE_CONFIG.financialYear} resident rates with LITO applied where eligible. The 2% Medicare levy is included; the <Link href="/medicare-levy/" className="text-eucalyptus-dark hover:underline font-medium">Medicare Levy Surcharge</Link> and HECS-HELP are excluded. For your bracket-specific result, see the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Take-Home Pay Calculator</Link> or compute a <Link href="/bonus-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">bonus tax</Link> alongside salary.</p>
            </section>

            {/* FY2024-25 vs FY{SITE_CONFIG.financialYear} Stage 3 savings */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much Less Tax Are You Paying Since Stage 3?</h2>
              <p className="mb-4 text-warmgray">The Stage 3 tax cuts that took effect on 1 July 2024 dropped the 19% rate to 16% and lifted the 37% threshold from $120,000 to $135,000. The table below compares income tax under the pre-Stage-3 settings (FY2023-24) against the current FY{SITE_CONFIG.financialYear} brackets for illustrative purposes — the FY{SITE_CONFIG.financialYear} brackets are unchanged from FY2024-25, so the saving is the cumulative reduction since the cuts.</p>
              <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
                <table className="w-full text-sm">
                  <thead className="bg-sandstone">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-navy">Salary</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">Tax (FY2023-24, illustrative)</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">Tax (FY{SITE_CONFIG.financialYear})</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">You Pay LESS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {/* FY2023-24 (pre-Stage-3) brackets used for the "old tax" column:
                        0% to $18,200; 19% $18,201–$45,000; 32.5% $45,001–$120,000;
                        37% $120,001–$180,000; 45% $180,001+ */}
                    {[60000, 80000, 100000, 120000].map((salary) => {
                      // Compute FY2023-24 (pre-Stage-3) tax exactly:
                      const old = (() => {
                        if (salary <= 18200) return 0;
                        if (salary <= 45000) return (salary - 18200) * 0.19;
                        if (salary <= 120000) return 5092 + (salary - 45000) * 0.325;
                        if (salary <= 180000) return 29467 + (salary - 120000) * 0.37;
                        return 51667 + (salary - 180000) * 0.45;
                      })();
                      const oldRounded = Math.round(old);
                      const newTax = Math.round(calculateIncomeTax(salary));
                      const saving = oldRounded - newTax;
                      return (
                        <tr key={salary} className="hover:bg-sandstone">
                          <td className="px-4 py-3 font-medium text-navy">{formatAUD(salary)}</td>
                          <td className="px-4 py-3 text-right text-warmgray">{formatAUD(oldRounded)}</td>
                          <td className="px-4 py-3 text-right text-navy">{formatAUD(newTax)}</td>
                          <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">−{formatAUD(saving)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-warmgray-light">Pre-Stage-3 figures are computed using the legislated FY2023-24 resident brackets and are shown for illustration; the LITO and Medicare levy are excluded from this comparison. A worker on $60,000 now pays around $804 less income tax, scaling to ~$2,679 less at $120,000 and up to $4,529 at $190,000+. See our <Link href="/stage-3-tax-cuts/" className="text-eucalyptus-dark hover:underline font-medium">Stage 3 tax cuts guide</Link> for the legislative history.</p>
            </section>

            {/* Who Uses This Calculator? */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Uses This Australian Tax Calculator?</h2>
              <p className="mb-4 text-warmgray">This income tax calculator serves <strong>5 primary user groups</strong> across employment types, career stages, and financial planning scenarios.</p>
              <ul className="list-disc pl-6 space-y-2 text-warmgray">
                <li><strong>Employees negotiating a pay rise</strong> — compare take-home pay at different gross salaries to understand the real value of a raise after taxation. A $10,000 raise from $80,000 to $90,000 adds <strong>$6,800</strong> to take-home pay, not $10,000.</li>
                <li><strong>Job seekers comparing offers</strong> — calculate the after-tax income on competing salary packages. An offer of $95,000 in one role versus $90,000 plus $5,000 in superannuation sacrifice in another produces different net pay outcomes.</li>
                <li><strong>Sole traders and freelancers</strong> — estimate quarterly PAYG instalment amounts based on projected annual income. Use the result alongside our <Link href="/contractor-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Contractor Pay Calculator</Link> for GST-inclusive calculations.</li>
                <li><strong>Graduates entering the workforce</strong> — understand how income tax brackets interact with <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline font-medium">HECS-HELP repayments</Link> that commence at $69,528 under the new marginal repayment system.</li>
                <li><strong>Financial planners and accountants</strong> — quickly model client scenarios across multiple salary levels without manual bracket calculations.</li>
              </ul>
            </section>

            {/* Income Tax vs Take-Home Pay */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does Income Tax Compare to Take-Home Pay at Different Salaries?</h2>
              <p className="mb-4 text-warmgray">Take-home pay increases at a diminishing rate as salary grows because each additional dollar is taxed at a higher marginal rate. The table below compares total taxation and net pay after tax across 9 common salary levels for FY{SITE_CONFIG.financialYear}.</p>
              <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
                <table className="w-full text-sm">
                  <thead className="bg-sandstone">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-navy">Gross Salary</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">Income Tax</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">Medicare</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">Total Tax</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">Take-Home Pay</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">Effective Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[50000, 60000, 70000, 80000, 90000, 100000, 120000, 150000, 200000].map((s) => {
                      const raw = calculateIncomeTax(s);
                      const lito = calculateLITO(s);
                      const net = Math.max(0, Math.round(raw - lito));
                      const med = calculateMedicareLevy(s);
                      const total = net + med;
                      return (
                        <tr key={s} className="hover:bg-sandstone">
                          <td className="px-4 py-3 font-medium text-navy">{formatAUD(s)}</td>
                          <td className="px-4 py-3 text-right text-navy">{formatAUD(net)}</td>
                          <td className="px-4 py-3 text-right text-navy">{formatAUD(med)}</td>
                          <td className="px-4 py-3 text-right text-navy">{formatAUD(total)}</td>
                          <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(s - total)}</td>
                          <td className="px-4 py-3 text-right text-warmgray-light">{formatPercent(total / s)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-warmgray">A worker earning $50,000 keeps <strong>87.3%</strong> of gross salary. At $200,000, the retention rate drops to <strong>67.7%</strong>. Superannuation at 12% is paid on top of these figures by your employer. Use the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Superannuation Calculator</Link> to see the exact super contribution on your salary.</p>
            </section>

            {/* What Changed in FY{SITE_CONFIG.financialYear}? */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed in FY{SITE_CONFIG.financialYear} for Income Tax?</h2>
              <p className="mb-4 text-warmgray">FY{SITE_CONFIG.financialYear} is the second year of the revised Stage 3 tax cuts. The bracket structure remains the same as FY2024-25, but other payroll settings have changed.</p>

              <h3 className="text-lg font-semibold text-navy mb-2">Stage 3 Tax Cut Brackets (Ongoing)</h3>
              <p className="mb-3 text-warmgray">The 19% rate dropped to <strong>16%</strong> from 1 July 2024. The 32.5% bracket was replaced with a <strong>30%</strong> rate. The 37% threshold lifted from $120,000 to <strong>$135,000</strong>. These changes delivered a tax cut of <strong>$804</strong> to every taxpayer earning between $18,201 and $45,000, scaling up to <strong>$4,529</strong> for incomes above $190,000.</p>

              <h3 className="text-lg font-semibold text-navy mb-2">Superannuation Guarantee Increase</h3>
              <p className="mb-3 text-warmgray">The SG rate increased from 11.5% to <strong>12%</strong> on 1 July 2025. Employers now contribute an additional 0.5% of ordinary time earnings to superannuation. On an $80,000 salary, the employer super contribution rises from $9,200 to <strong>$9,600</strong> per year.</p>

              <h3 className="text-lg font-semibold text-navy mb-2">HECS-HELP Repayment Overhaul</h3>
              <p className="mb-3 text-warmgray">The HECS repayment system moved from a tiered percentage model to a <strong>marginal rate system</strong> starting at $69,528. Repayments now apply at <strong>15 cents per dollar</strong> earned above $69,528, reducing the cliff-edge effect that previously caused large jumps in repayment obligations. Use the <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline font-medium">HECS-HELP Calculator</Link> to model your repayment under the new system.</p>
            </section>

            {/* Common Income Tax Mistakes */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Most Common Income Tax Mistakes?</h2>
              <p className="mb-4 text-warmgray">Australian taxpayers lose money through <strong>5 recurring errors</strong> when calculating income tax, claiming deductions, and lodging returns.</p>
              <ol className="list-decimal pl-6 space-y-3 text-warmgray">
                <li><strong>Confusing marginal rate with effective rate.</strong> An employee on $100,000 assumes they pay 30% on their entire salary. The actual effective rate is <strong>23.17%</strong>. The 30% marginal rate applies only to income between $45,001 and $135,000.</li>
                <li><strong>Forgetting to claim the tax-free threshold.</strong> Workers with multiple jobs sometimes fail to claim the $18,200 tax-free threshold on their primary employment. This results in over-withholding throughout the year and a large refund at tax time instead of consistent take-home pay.</li>
                <li><strong>Claiming the tax-free threshold on two jobs.</strong> The reverse error: claiming the threshold on both a primary and secondary job leads to under-withholding. The ATO issues a tax debt at the end of the financial year, often <strong>$2,000–$5,000</strong> for dual-income earners.</li>
                <li><strong>Ignoring the Medicare levy in net pay calculations.</strong> The 2% Medicare levy adds <strong>$1,600</strong> to tax on an $80,000 salary. Employees who budget only for income tax brackets underestimate their total deductions by this amount.</li>
                <li><strong>Not adjusting for salary sacrifice.</strong> Pre-tax salary sacrifice into superannuation reduces assessable income before tax brackets apply. An employee sacrificing $10,000 from a $100,000 salary drops from the 30% bracket ceiling into lower taxable income, saving up to <strong>$3,000</strong> in income tax. Use our <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Salary Sacrifice Calculator</Link> to model the savings.</li>
              </ol>
            </section>

            {/* Marginal tax example */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does Marginal Tax Work in Australia?</h2>
              <p className="mb-4 text-warmgray">Marginal tax means only the portion of income within each bracket is taxed at that bracket&apos;s rate. Your entire salary is never taxed at one single rate. Here is a worked example on <strong>$90,000</strong>:</p>
              <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
                <table className="w-full text-sm">
                  <thead className="bg-sandstone">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-navy">Bracket</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">Income</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">Rate</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">Tax</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr><td className="px-4 py-3">$0 – $18,200</td><td className="px-4 py-3 text-right">$18,200</td><td className="px-4 py-3 text-right">0%</td><td className="px-4 py-3 text-right">$0</td></tr>
                    <tr><td className="px-4 py-3">$18,201 – $45,000</td><td className="px-4 py-3 text-right">$26,800</td><td className="px-4 py-3 text-right">16%</td><td className="px-4 py-3 text-right">$4,288</td></tr>
                    <tr><td className="px-4 py-3">$45,001 – $90,000</td><td className="px-4 py-3 text-right">$45,000</td><td className="px-4 py-3 text-right">30%</td><td className="px-4 py-3 text-right">$13,500</td></tr>
                    <tr className="bg-eucalyptus-light/30 font-semibold"><td className="px-4 py-3">Total</td><td className="px-4 py-3 text-right">$90,000</td><td className="px-4 py-3 text-right">—</td><td className="px-4 py-3 text-right">$17,788</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-warmgray">The effective rate on $90,000 is <strong>19.76%</strong>. The marginal rate is <strong>30%</strong>. Each additional dollar earned above $90,000 is taxed at 30 cents until the $135,000 threshold, where the rate increases to 37%.</p>
            </section>

            {/* LITO */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Tax Offsets Reduce Your Income Tax?</h2>
              <p className="mb-4 text-warmgray">Tax offsets reduce your final tax bill dollar-for-dollar, unlike deductions which lower assessable income before brackets apply. Two offsets affect most Australian taxpayers.</p>

              <h3 className="text-lg font-semibold text-navy mb-2">Low Income Tax Offset (LITO)</h3>
              <p className="mb-3 text-warmgray">Taxpayers earning under {formatAUD(LITO.nilOffsetIncome)} receive LITO automatically — up to <strong>{formatAUD(LITO.maxOffset)}</strong> — when lodging a tax return or through PAYG withholding adjustments.</p>
              <ul className="list-disc pl-6 space-y-1 text-warmgray">
                <li>Income up to {formatAUD(LITO.fullOffsetCeiling)}: full {formatAUD(LITO.maxOffset)} offset</li>
                <li>{formatAUD(LITO.phaseOut1.start)} – {formatAUD(LITO.phaseOut1.end)}: reduces at 5c per dollar over {formatAUD(LITO.fullOffsetCeiling)}</li>
                <li>{formatAUD(LITO.phaseOut2.start)} – {formatAUD(LITO.nilOffsetIncome)}: reduces at 1.5c per dollar over {formatAUD(LITO.phaseOut1.end)}</li>
              </ul>
              <p className="mt-3 text-sm text-warmgray-light">
                Combined with the tax-free threshold, the LITO means you can earn up to <strong>{formatAUD(LITO.effectiveTaxFreeThreshold)}</strong> before paying any net income tax.{" "}
                <Link href="/low-income-tax-offset/" className="text-eucalyptus-dark hover:underline font-medium">Full LITO guide →</Link>
              </p>

              <h3 className="text-lg font-semibold text-navy mb-2 mt-6">Seniors and Pensioners Tax Offset (SAPTO)</h3>
              <p className="mb-3 text-warmgray">Australians of Age Pension age who meet income thresholds qualify for SAPTO, which increases the effective tax-free threshold:</p>
              <ul className="list-disc pl-6 space-y-1 text-warmgray">
                <li><strong>Singles:</strong> up to $2,230 offset — effective tax-free threshold increases to approximately $33,532</li>
                <li><strong>Couples (each):</strong> up to $1,602 offset — combined tax-free amount is higher than singles</li>
                <li>SAPTO is non-refundable — it reduces tax to zero but does not generate a refund</li>
              </ul>
              <p className="mt-3 text-sm text-warmgray-light">SAPTO eligibility is based on rebate income, which includes reportable superannuation contributions and exempt foreign employment income.</p>
            </section>

            {/* Other deductions */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Other Deductions Affect Your Take-Home Pay?</h2>
              <p className="mb-3 text-warmgray">Income tax is one of 3 mandatory deductions from your pay. The Medicare levy and HECS-HELP repayments also reduce your after-tax income:</p>
              <ul className="list-disc pl-6 space-y-2 text-warmgray">
                <li><Link href="/medicare-levy/" className="font-medium text-eucalyptus-dark hover:underline">Medicare Levy</Link> — <strong>2%</strong> of taxable income. An additional "Medicare Levy Surcharge" of 1–1.5% applies if you earn above $93,000 and do not hold private hospital cover.</li>
                <li><Link href="/hecs-help-calculator/" className="font-medium text-eucalyptus-dark hover:underline">HECS-HELP Repayment</Link> — begins at $69,528 under the new marginal system at <strong>15 cents per dollar</strong> above the threshold.</li>
                <li><Link href="/salary-sacrifice-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Salary Sacrifice</Link> — voluntarily redirecting pre-tax income to superannuation reduces taxable income and the associated income tax.</li>
              </ul>
              <p className="mt-3 text-sm text-warmgray-light">
                <Link href="/" className="text-eucalyptus-dark hover:underline font-medium">See your full pay breakdown with every deduction →</Link>{" "}
                Or use the <Link href="/gross-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Gross Pay Calculator</Link> to reverse-engineer net pay to gross salary.
              </p>
            </section>

            <MethodologyDisclosure>
              <ol className="list-decimal space-y-1 pl-4">
                <li>Apply resident tax brackets to gross income (progressive marginal rates).</li>
                <li>Subtract the Low Income Tax Offset (up to $700 for incomes under $66,667).</li>
                <li>Add the 2% Medicare levy.</li>
                <li>Take-home pay = Gross salary − net income tax − Medicare levy.</li>
              </ol>
              <p className="mt-2">All rates from the <a className="text-eucalyptus-dark hover:underline" href="https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents" target="_blank" rel="noreferrer noopener">ATO</a>, last verified {SITE_CONFIG.lastVerified}.</p>
            </MethodologyDisclosure>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="space-y-3">
                <AccordionItem value="tax-80k" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>How much tax do I pay on $80,000?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">On $80,000, you pay <strong>$14,788</strong> in income tax for FY{SITE_CONFIG.financialYear}. After the 2% Medicare levy ($1,600), your total tax deductions are <strong>$16,388</strong>. Your take-home pay is <strong>$63,612</strong> per year — $1,223.31 per week.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="marginal" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Do I pay my marginal rate on my entire salary?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">No. Australia uses a progressive system. You only pay the marginal rate on the portion of income within that bracket. On $80,000, your marginal rate is <strong>30%</strong>, but your effective rate is only <strong>18.49%</strong>.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="tax-free" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>What is the tax-free threshold in Australia?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">The tax-free threshold is <strong>$18,200</strong>. You pay no income tax on the first $18,200 you earn. With LITO, the effective threshold is <strong>{formatAUD(LITO.effectiveTaxFreeThreshold)}</strong> — below this amount, your tax offsets completely cancel out your tax liability.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="payg" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>How is income tax collected from my pay?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Your employer deducts income tax from each pay through the PAYG (Pay As You Go) withholding system. The amount withheld is based on the <Link href="/payg-withholding-tables/" className="text-eucalyptus-dark hover:underline">ATO&apos;s PAYG withholding tables</Link>. You reconcile any difference when you lodge your annual tax return by 31 October or through a registered tax agent.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="income-tax-free" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>What income is completely tax-free in Australia?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">The first $18,200 of your income is tax-free (the tax-free threshold). When combined with the <Link href="/low-income-tax-offset/" className="text-eucalyptus-dark hover:underline">Low Income Tax Offset</Link>, you can effectively earn up to <strong>{formatAUD(LITO.effectiveTaxFreeThreshold)}</strong> before paying any net income tax. Seniors eligible for SAPTO can earn tax-free income up to approximately <strong>$33,532</strong> for singles.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="employer-tax" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Does my employer pay income tax for me?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Your employer withholds income tax from your pay and sends it to the ATO on your behalf through the PAYG withholding system. The amounts withheld are estimates based on <Link href="/payg-withholding-tables/" className="text-eucalyptus-dark hover:underline">PAYG withholding tables</Link>. When you lodge your annual tax return, the ATO compares what was withheld against your actual tax liability — you either receive a refund or pay the difference.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="super-included" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Is superannuation included in the income tax calculation?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">No. The 12% superannuation guarantee is paid by your employer <strong>on top of</strong> your gross salary and is not included in your assessable income for income tax purposes. Concessional super contributions (including salary sacrifice) are taxed at <strong>15%</strong> inside your super fund, not at your marginal income tax rate. Use the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to see how much your employer contributes.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="two-jobs" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>How is income tax calculated if I have two jobs?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">You claim the tax-free threshold on <strong>one job only</strong> — your primary employment. Your second employer withholds tax at the &quot;no tax-free threshold&quot; rate, which starts at <strong>16%</strong> from the first dollar. At tax time, the ATO combines all income and calculates your total liability against the progressive brackets. Claiming the threshold on both jobs results in a tax debt.</p></AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Related calculators */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Calculators</h2>
              <p className="mb-4 text-warmgray">Calculate specific components of your pay using these Australian tax calculators:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/take-home-pay-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Take-Home Pay Calculator</h3>
                  <p className="text-sm text-warmgray">See your net pay after income tax, Medicare levy, HECS, and salary sacrifice</p>
                </Link>
                <Link href="/hecs-help-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">HECS-HELP Calculator</h3>
                  <p className="text-sm text-warmgray">Calculate your HECS repayment under the new marginal rate system from $69,528</p>
                </Link>
                <Link href="/superannuation-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Superannuation Calculator</h3>
                  <p className="text-sm text-warmgray">See your employer&apos;s 12% SG contribution and total super package value</p>
                </Link>
                <Link href="/salary-sacrifice-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Salary Sacrifice Calculator</h3>
                  <p className="text-sm text-warmgray">Model pre-tax super contributions and the income tax savings they produce</p>
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
