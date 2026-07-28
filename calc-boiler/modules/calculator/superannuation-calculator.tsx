"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculateSuper,
  formatAUD,
  formatPercent,
  SUPER_GUARANTEE,
  SG_RATE_HISTORY,
  SOURCES,
  SITE_CONFIG,
  annualToWeekly,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const SOURCES_LIST: SourceLink[] = [
  { title: "Super guarantee rate", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-contributions/how-much-super-to-pay", publisher: SOURCES.ato.name },
  { title: "Maximum super contribution base", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-contributions/how-much-super-to-pay", publisher: SOURCES.ato.name },
  { title: "Contribution caps", url: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/contributions-caps", publisher: SOURCES.ato.name },
];

export default function SuperannuationCalculatorPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Superannuation Calculator Australia — Employer SG at 12% ({SITE_CONFIG.financialYear})</h1>
          <p className="text-lg text-warmgray">Calculate your superannuation contribution at the {formatPercent(SUPER_GUARANTEE.rate, 0)} Superannuation Guarantee rate. See how much your employer pays and your total package value.</p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-navy mb-1">Gross Annual Salary</label>
                    <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="salary" min={0} max={500000} step={1000} value={salary}
                        onChange={(e) => setSalary(clamp(Number(e.target.value || 0), 0, 500000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <input type="range" min={0} max={300000} step={5000} value={clamp(salary, 0, 300000)}
                      onChange={(e) => setSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" />
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

          {/* --- How Is Superannuation Calculated? --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Superannuation Calculated in Australia?</h2>
            <p className="mb-4 text-warmgray">Superannuation is calculated by multiplying your Ordinary Time Earnings (OTE) by the current SG rate of <strong>12%</strong> for FY2025-26. Your employer pays this amount on top of your gross salary directly into your nominated super fund.</p>
            <p className="mb-4 text-warmgray">The calculation follows 3 steps:</p>
            <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>Identify your OTE</strong> — base salary, commissions, shift loadings, and paid leave. Overtime payments, expense reimbursements, and workers&apos; compensation are excluded.</li>
              <li><strong>Apply the SG rate</strong> — multiply your OTE by <strong>0.12</strong> (12%).</li>
              <li><strong>Check the maximum super contribution base</strong> — employers are not required to pay SG on annual earnings above <strong>{formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}</strong>.</li>
            </ol>

            <h3 className="text-lg font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked Example: Superannuation on an $85,000 Salary</h3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th className="px-4 py-3 text-left font-semibold text-navy">Step</th><th className="px-4 py-3 text-left font-semibold text-navy">Calculation</th><th className="px-4 py-3 text-right font-semibold text-navy">Result</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy">1. Gross salary (OTE)</td><td className="px-4 py-3 text-warmgray">Base annual salary</td><td className="px-4 py-3 text-right font-medium text-navy">$85,000</td></tr>
                  <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy">2. SG contribution</td><td className="px-4 py-3 text-warmgray">$85,000 x 12%</td><td className="px-4 py-3 text-right font-bold text-navy">$10,200</td></tr>
                  <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy">3. Total package</td><td className="px-4 py-3 text-warmgray">$85,000 + $10,200</td><td className="px-4 py-3 text-right font-bold text-navy">$95,200</td></tr>
                  <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy">4. Weekly super</td><td className="px-4 py-3 text-warmgray">$10,200 / 52</td><td className="px-4 py-3 text-right text-navy">$196.15</td></tr>
                  <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy">5. Quarterly super</td><td className="px-4 py-3 text-warmgray">$10,200 / 4</td><td className="px-4 py-3 text-right text-navy">$2,550</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-warmgray">On an $85,000 salary, your employer contributes <strong>$10,200 per year</strong> into your super fund. This is not deducted from your take-home pay — use our <Link href="/" className="text-eucalyptus-dark hover:underline font-medium">Australian tax calculator</Link> to see your full net pay after income tax and Medicare levy deductions.</p>
          </section>

          {/* --- What Is the SG Rate for FY2025-26? --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the SG Rate for FY2025-26?</h2>
            <p className="mb-4 text-warmgray">The Superannuation Guarantee rate for FY2025-26 is <strong>12%</strong> of Ordinary Time Earnings, effective from 1 July 2025. This is the final increase in a series of legislated rises that began at 9.5% in FY2020-21.</p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th className="px-4 py-3 text-left font-semibold text-navy">Financial Year</th><th className="px-4 py-3 text-right font-semibold text-navy">SG Rate</th><th className="px-4 py-3 text-right font-semibold text-navy">Increase</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {SG_RATE_HISTORY.map((row, idx) => {
                    const prevRate = idx > 0 ? SG_RATE_HISTORY[idx - 1].rate : row.rate;
                    const increase = row.rate - prevRate;
                    return (
                      <tr key={row.year} className={row.year === "FY2025-26" ? "bg-eucalyptus-light/30 font-semibold" : "hover:bg-sandstone"}>
                        <td className="px-4 py-3 text-navy">{row.year}</td>
                        <td className="px-4 py-3 text-right text-navy">{formatPercent(row.rate, 1)}</td>
                        <td className="px-4 py-3 text-right text-navy">{increase > 0 ? `+${formatPercent(increase, 1)}` : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-warmgray-light">The 12% rate is now permanent — no further legislated increases are scheduled. Employers who fail to pay the full 12% face the "Super Guarantee Charge" (SGC), which includes the shortfall, a nominal interest component, and a $20 administration fee per employee per quarter.</p>
          </section>

          {/* --- Super on Common Salaries --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Super on Common Salaries</h2>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th className="px-4 py-3 text-left font-semibold text-navy">Gross Salary</th><th className="px-4 py-3 text-right font-semibold text-navy">Employer Super</th><th className="px-4 py-3 text-right font-semibold text-navy">Total Package</th><th className="px-4 py-3 text-right font-semibold text-navy">Per Week</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {[50000, 60000, 70000, 80000, 100000, 120000, 150000].map((s) => {
                    const sup = calculateSuper(s);
                    return (
                      <tr key={s} className="hover:bg-sandstone">
                        <td className="px-4 py-3 font-medium text-navy">{formatAUD(s)}</td>
                        <td className="px-4 py-3 text-right text-navy">{formatAUD(sup)}</td>
                        <td className="px-4 py-3 text-right text-navy">{formatAUD(s + sup)}</td>
                        <td className="px-4 py-3 text-right text-warmgray-light">{formatAUD(annualToWeekly(sup), 2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* --- Who Uses This Calculator? --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Uses This Superannuation Calculator?</h2>
            <p className="mb-4 text-warmgray">This superannuation calculator serves <strong>5 primary user groups</strong> across employment types, salary levels, and career stages.</p>
            <ul className="list-disc pl-6 space-y-3 text-warmgray">
              <li><strong>Full-time employees</strong> comparing job offers — a $90,000 &quot;plus super&quot; package is worth <strong>$100,800</strong> total, while a $100,800 &quot;including super&quot; package provides only $90,000 in base salary.</li>
              <li><strong>Casual and part-time workers</strong> verifying their employer pays the correct SG amount. Since 1 July 2022, all employees receive super regardless of monthly earnings.</li>
              <li><strong>Salary sacrifice planners</strong> calculating how much concessional cap space remains after employer SG contributions. Use the <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Salary Sacrifice Calculator</Link> to model specific arrangements.</li>
              <li><strong>Small business owners</strong> budgeting total employment costs including superannuation, payroll tax, and workers&apos; compensation. The <Link href="/employer-cost-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Employer Cost Calculator</Link> provides a complete breakdown.</li>
              <li><strong>Pre-retirees aged 55-67</strong> estimating final super balances and assessing whether additional voluntary contributions are needed to reach retirement targets.</li>
            </ul>
          </section>

          {/* --- What Counts as Ordinary Time Earnings --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Counts as Ordinary Time Earnings?</h2>
            <p className="mb-4 text-warmgray">&quot;Ordinary Time Earnings&quot; (OTE) is the earnings base your employer uses to calculate the 12% SG contribution. The ATO defines OTE as the amount your employer pays you for your ordinary hours of work.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div><h3 className="font-semibold text-eucalyptus-dark mb-2">Included in OTE</h3>
                <ul className="list-disc pl-5 text-warmgray space-y-1"><li>Base salary and wages</li><li>Commissions</li><li>Shift loadings</li><li>Paid leave (annual, personal, long service)</li><li>Some allowances and bonuses</li></ul>
              </div>
              <div><h3 className="font-semibold text-ochre mb-2">Not Included in OTE</h3>
                <ul className="list-disc pl-5 text-warmgray space-y-1"><li>Overtime payments</li><li>Unused leave on termination</li><li>Expense reimbursements</li><li>Workers compensation payments</li></ul>
              </div>
            </div>
            <p className="mt-4 text-sm text-warmgray">Understanding OTE directly affects how much super you receive. An employee earning $80,000 base salary plus $15,000 in overtime receives SG only on the $80,000 base — that is <strong>$9,600</strong> in super, not $11,400. Check your payslip against our calculator to confirm your employer&apos;s calculation is correct.</p>
          </section>

          {/* --- Superannuation vs Salary Sacrifice --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does Salary Sacrifice Into Super Compare to Standard SG?</h2>
            <p className="mb-4 text-warmgray">Salary sacrifice redirects pre-tax salary into your super fund at a concessional tax rate of <strong>15%</strong> instead of your marginal tax rate, which ranges from 16% to 45% depending on income.</p>
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

          {/* --- Maximum Super Contribution Base --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Maximum Super Contribution Base ({formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}/Year)</h2>
            <p className="mb-3 text-warmgray">There&apos;s an earnings limit above which your employer isn&apos;t legally required to pay super. With Payday Super, for FY{SITE_CONFIG.financialYear} this is an annual figure of <strong>{formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}</strong>.</p>
            <p className="mb-3 text-warmgray">This means the maximum SG your employer must pay is <strong>{formatAUD(SUPER_GUARANTEE.maxSGAnnual)} per year</strong> ({formatPercent(SUPER_GUARANTEE.rate, 0)} x {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}).</p>
            <p className="text-sm text-warmgray-light">If you earn above this threshold, check your employment agreement — some employers voluntarily pay super on your full salary as part of a total remuneration package. <Link href="/employer-cost-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Employer cost calculator</Link></p>
          </section>

          {/* --- Contribution Caps --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Contribution Caps</h2>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th className="px-4 py-3 text-left font-semibold text-navy">Cap Type</th><th className="px-4 py-3 text-right font-semibold text-navy">Annual Limit</th><th className="px-4 py-3 text-right font-semibold text-navy">Tax Rate</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="px-4 py-3 text-navy">Concessional (pre-tax)</td><td className="px-4 py-3 text-right text-navy">{formatAUD(SUPER_GUARANTEE.concessionalCap)}</td><td className="px-4 py-3 text-right text-navy">15%</td></tr>
                  <tr><td className="px-4 py-3 text-navy">Non-concessional (after-tax)</td><td className="px-4 py-3 text-right text-navy">{formatAUD(SUPER_GUARANTEE.nonConcessionalCap)}</td><td className="px-4 py-3 text-right text-navy">0%</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-warmgray-light"><Link href="/superannuation-guide/" className="text-eucalyptus-dark hover:underline font-medium">Full superannuation guide</Link> &mdash; see our news coverage of the <Link href="/news/super-contribution-caps-2026-27/" className="text-eucalyptus-dark hover:underline font-medium">super contribution caps for 2026-27</Link> for the latest indexed figures.</p>
          </section>

          {/* --- What Changed in FY2025-26? --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed for Superannuation in FY2025-26?</h2>
            <p className="mb-4 text-warmgray">The SG rate increased from <strong>11.5% to 12%</strong> on 1 July 2025, adding $500 per year in employer super contributions for every $100,000 of salary. This is the final step in the legislated increase schedule.</p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th className="px-4 py-3 text-left font-semibold text-navy">Change</th><th className="px-4 py-3 text-left font-semibold text-navy">FY2024-25</th><th className="px-4 py-3 text-left font-semibold text-navy">FY2025-26</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy font-medium">SG rate</td><td className="px-4 py-3 text-warmgray">11.5%</td><td className="px-4 py-3 font-bold text-navy">12%</td></tr>
                  <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy font-medium">SG on $80,000 salary</td><td className="px-4 py-3 text-warmgray">$9,200</td><td className="px-4 py-3 font-bold text-navy">$9,600</td></tr>
                  <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy font-medium">SG on $100,000 salary</td><td className="px-4 py-3 text-warmgray">$11,500</td><td className="px-4 py-3 font-bold text-navy">$12,000</td></tr>
                  <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy font-medium">Concessional cap</td><td className="px-4 py-3 text-warmgray">$30,000</td><td className="px-4 py-3 font-bold text-navy">$30,000</td></tr>
                  <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy font-medium">Max contribution base</td><td className="px-4 py-3 text-warmgray">{formatAUD(SUPER_GUARANTEE.maxContributionBasePerQuarterUntil2026)}/qtr</td><td className="px-4 py-3 font-bold text-navy">{formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}/yr</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">The 0.5 percentage point increase affects every Australian employee. A worker on the median full-time salary of $78,000 receives an extra <strong>$390 per year</strong> in super contributions compared to FY2024-25. The concessional cap remains at $30,000, which means salary sacrifice room narrows slightly for higher earners — use our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income Tax Calculator</Link> to see how the combined FY2025-26 changes affect your after-tax income.</p>
          </section>

          {/* --- Common Super Mistakes --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Most Common Superannuation Mistakes?</h2>
            <p className="mb-4 text-warmgray">Australian employees lose an estimated <strong>$5.9 billion</strong> in unpaid and underpaid super each year. These 5 mistakes account for the majority of lost retirement savings.</p>
            <ol className="list-decimal pl-6 space-y-4 text-warmgray">
              <li><strong>Not checking payslips against the 12% rate.</strong> Employers must pay SG quarterly, within 28 days of each quarter&apos;s end. Verify every payslip shows exactly 12% of your OTE going to super. Underpayment by even 0.5% on a $90,000 salary costs you <strong>$450 per year</strong> in lost contributions.</li>
              <li><strong>Confusing &quot;plus super&quot; with &quot;including super&quot; in job offers.</strong> A $100,000 &quot;plus super&quot; role provides $100,000 salary and $12,000 super ($112,000 total). A $100,000 &quot;including super&quot; role provides $89,286 salary and $10,714 super. The difference in base pay is <strong>$10,714</strong>.</li>
              <li><strong>Exceeding the concessional cap.</strong> Employer SG plus salary sacrifice contributions that exceed the {formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap are taxed at your marginal rate instead of 15%. On a $150,000 salary, the employer already contributes $18,000 in SG, leaving only $12,000 in cap space for salary sacrifice.</li>
              <li><strong>Holding multiple super accounts.</strong> The average Australian has <strong>1.4 super accounts</strong>. Duplicate accounts mean duplicate insurance premiums and administration fees that erode retirement balances. Consolidate via myGov or contact your fund directly.</li>
              <li><strong>Ignoring &quot;Division 293&quot; tax.</strong> Employees with combined income and concessional contributions above <strong>$250,000</strong> pay an additional 15% tax on concessional super contributions (30% total). High earners must factor this into salary sacrifice planning.</li>
            </ol>
          </section>

          {/* --- Salary Sacrifice Into Super (existing, preserved) --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Salary Sacrifice Into Super</h2>
            <p className="mb-3 text-warmgray">You can voluntarily redirect part of your pre-tax salary into super through a salary sacrifice arrangement. These contributions are taxed at 15% inside the fund instead of your marginal rate (up to 45%), making it one of the most effective tax-saving strategies available.</p>
            <p className="mb-3 text-warmgray">Your salary sacrifice counts towards the {formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap along with your employer&apos;s SG contributions. On {formatAUD(salary)}, your employer pays {formatAUD(result.superContrib)} in SG, leaving you <strong>{formatAUD(result.concessionalCapRemaining)}</strong> in cap space for voluntary contributions.</p>
            <p className="text-sm text-warmgray-light"><Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Compare your pay before and after salary sacrifice</Link></p>
          </section>

          {/* --- Related Calculators --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Calculators</h2>
            <p className="mb-4 text-warmgray">Superannuation is one component of your total pay package. These calculators cover income tax, take-home pay, and employer costs for a complete picture.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/" className="block rounded-xl border border-sandstone-dark/20 p-4 hover:bg-sandstone transition-colors">
                <h3 className="font-semibold text-navy mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Australian Tax Calculator</h3>
                <p className="text-sm text-warmgray">Full pay breakdown with income tax, Medicare levy, HECS-HELP, and superannuation for FY2025-26.</p>
              </Link>
              <Link href="/salary-sacrifice-calculator/" className="block rounded-xl border border-sandstone-dark/20 p-4 hover:bg-sandstone transition-colors">
                <h3 className="font-semibold text-navy mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Salary Sacrifice Calculator</h3>
                <p className="text-sm text-warmgray">Compare take-home pay before and after sacrificing pre-tax salary into superannuation.</p>
              </Link>
              <Link href="/employer-cost-calculator/" className="block rounded-xl border border-sandstone-dark/20 p-4 hover:bg-sandstone transition-colors">
                <h3 className="font-semibold text-navy mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Employer Cost Calculator</h3>
                <p className="text-sm text-warmgray">Total employment cost including SG, payroll tax, workers&apos; compensation, and leave provisions.</p>
              </Link>
              <Link href="/income-tax-calculator/" className="block rounded-xl border border-sandstone-dark/20 p-4 hover:bg-sandstone transition-colors">
                <h3 className="font-semibold text-navy mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Income Tax Calculator</h3>
                <p className="text-sm text-warmgray">Calculate income tax, marginal rates, and effective tax rates across all FY2025-26 brackets.</p>
              </Link>
              <Link href="/take-home-pay-calculator/" className="block rounded-xl border border-sandstone-dark/20 p-4 hover:bg-sandstone transition-colors">
                <h3 className="font-semibold text-navy mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Take-Home Pay Calculator</h3>
                <p className="text-sm text-warmgray">Calculate your net pay after all deductions including tax, Medicare, HECS, and salary sacrifice.</p>
              </Link>
            </div>
          </section>

          <MethodologyDisclosure>
            <ol className="list-decimal space-y-1 pl-4">
              <li>Super = Gross salary x {formatPercent(SUPER_GUARANTEE.rate, 0)}</li>
              <li>Total package = Gross salary + Super</li>
              <li>Maximum contribution base: {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} per year</li>
            </ol>
          </MethodologyDisclosure>

          {/* --- Expanded FAQs --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <AccordionItem value="included" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Is super included in my salary?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Typically, no. Most contracts quote base salary with super paid on top. Check your contract — &quot;plus super&quot; means it&apos;s additional; &quot;including super&quot; means it&apos;s already included. On a $90,000 &quot;including super&quot; contract, your actual base salary is <strong>$80,357</strong> ($90,000 / 1.12).</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="casual" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Do casual workers get super?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. Since 1 July 2022, all employees — including casuals — are entitled to SG regardless of how much they earn. The previous $450/month threshold has been abolished. A casual worker earning $200 per week receives <strong>$24 per week</strong> in super contributions at the 12% rate.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="less" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Can my employer pay super less than 12%?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">No. 12% SG is the legal minimum for FY2025-26. Employers who don&apos;t pay on time face the &quot;Super Guarantee Charge&quot; (SGC), which includes the unpaid amount, interest at 10% per annum, and a $20 administration fee per employee per quarter.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="age30" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How much super should I have at 30?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">A common benchmark is 1x your annual salary by age 30. For the median full-time salary of $78,000, that target is <strong>$78,000</strong> in super by age 30. If you&apos;re behind, <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">salary sacrifice</Link> and voluntary contributions can help you catch up using the carry-forward unused cap rule for balances under $500,000.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="overtime-super" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Is super paid on overtime?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">No. Overtime is excluded from Ordinary Time Earnings (OTE), so your employer doesn&apos;t have to pay super on overtime hours. Super is calculated on your base hourly rate for ordinary hours only. Shift loadings for ordinary hours are included in OTE. See our <Link href="/superannuation-guide/" className="text-eucalyptus-dark hover:underline">superannuation guide</Link> for a full breakdown of what counts.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="max-base" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>What is the maximum super contribution base?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">For FY{SITE_CONFIG.financialYear}, the maximum super contribution base is {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} per year. Payday Super replaced the old quarterly base ({formatAUD(SUPER_GUARANTEE.maxContributionBasePerQuarterUntil2026)} per quarter) with this annual figure from 1 July 2026. Your employer only has to pay the {formatPercent(SUPER_GUARANTEE.rate, 0)} SG rate on earnings up to this threshold, so the maximum SG for the year is <strong>{formatAUD(SUPER_GUARANTEE.maxSGAnnual)}</strong>.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="when-paid" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>When does my employer have to pay super?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Employers must pay SG contributions <strong>quarterly</strong>, within 28 days of the end of each quarter. The 4 deadlines are 28 October, 28 January, 28 April, and 28 July. Late payments trigger the &quot;Super Guarantee Charge,&quot; which is not tax-deductible for the employer.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="div293" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>What is Division 293 tax on super?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">&quot;Division 293&quot; is an additional <strong>15% tax</strong> on concessional super contributions for individuals with combined income and contributions above $250,000. This brings the total tax on super contributions to 30% for high-income earners. The ATO issues a Division 293 assessment after you lodge your tax return — use the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to check if your total income crosses this threshold.</p></AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section className="bg-sandstone rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>See your full pay breakdown</h2>
            <p className="text-warmgray mb-6 max-w-lg mx-auto">Get the complete picture with income tax, Medicare, HECS, and super.</p>
            <Link href="/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all">Calculate Take-Home Pay</Link>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
        </div>
      </div>
    </div>
  );
}
