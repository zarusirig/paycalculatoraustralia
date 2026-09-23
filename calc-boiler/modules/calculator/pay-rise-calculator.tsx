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
  calculatePayBreakdown,
  formatAUD,
  SUPER_GUARANTEE,
  SOURCES,
  SITE_CONFIG,
  HECS_HELP,
  MEDICARE_LEVY,
  TAX_BRACKETS,
  calculateMedicareSurcharge,
} from "@/lib/constants";
import { bracketRatesSentence, hecsBandsSentence } from "@/modules/calculator/fy-rate-copy";

// Worked figures computed from the tax engine. The copy had frozen at FY2025-26
// values (16% first bracket, 2023-24 MLS tiers, $30,000 cap) under a FY2026-27
// heading.
const net = (gross: number, includeHECS = false) => calculatePayBreakdown({ grossSalary: gross, includeHECS }).takeHomePay;
const raiseNet = (base: number, raise: number) => net(base + raise) - net(base);
/** Cents kept of the next $1,000, so LITO phase-out and Medicare are captured. */
const keptPerDollar = (gross: number) => (net(gross + 1_000) - net(gross)) / 1_000;
const pct0 = (r: number) => `${Math.round(r * 100)}%`;
const RAISE_10K_ON_80K = raiseNet(80_000, 10_000);
const RAISE_9K_ON_90K = raiseNet(90_000, 9_000);
const RAISE_5K_ON_80K = raiseNet(80_000, 5_000);
const RAISE_5K_ON_150K = raiseNet(150_000, 5_000);
const EX80 = calculatePayBreakdown({ grossSalary: 80_000 });
const EX90 = calculatePayBreakdown({ grossSalary: 90_000 });
const HECS_65_TO_70 =
  calculatePayBreakdown({ grossSalary: 70_000, includeHECS: true }).hecsRepayment -
  calculatePayBreakdown({ grossSalary: 65_000, includeHECS: true }).hecsRepayment;
const MLS = MEDICARE_LEVY.surcharge;
const MLS_110K = calculateMedicareSurcharge(110_000, false);
const TRP_110K_BASE = Math.round(110_000 / (1 + SUPER_GUARANTEE.rate));
const B2 = TAX_BRACKETS[2];
const B3 = TAX_BRACKETS[3];

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Marginal tax rates", url: "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-as-an-employee/tax-for-employees", publisher: SOURCES.ato.name },
];

export default function PayRiseCalculatorPage() {
  const [currentSalary, setCurrentSalary] = useState(80_000);
  const [increaseAmount, setIncreaseAmount] = useState(10_000);
  const [inputMode, setInputMode] = useState<"raise" | "new_salary">("raise");

  const newSalary = inputMode === "raise" ? currentSalary + increaseAmount : increaseAmount;
  const actualRaise = newSalary - currentSalary;

  const currentBreakdown = useMemo(() => calculatePayBreakdown({ grossSalary: currentSalary }), [currentSalary]);
  const newBreakdown = useMemo(() => calculatePayBreakdown({ grossSalary: Math.max(0, newSalary) }), [newSalary]);

  const takeHomeIncrease = newBreakdown.takeHomePay - currentBreakdown.takeHomePay;
  const taxIncrease = newBreakdown.totalDeductions - currentBreakdown.totalDeductions;

  // Guard against negative/zero raise divisions
  const keepPercent = actualRaise > 0 ? (takeHomeIncrease / actualRaise) * 100 : 0;
  const taxPercent = actualRaise > 0 ? (taxIncrease / actualRaise) * 100 : 0;

  const superIncrease = Math.round(actualRaise * SUPER_GUARANTEE.rate);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Pay Rise Calculator</span></li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Pay Rise Calculator Australia — How Much Extra Will You Take Home? ({SITE_CONFIG.financialYear})
          </h1>
          <p className="text-lg text-navy">
            A <strong>$10,000 pay rise on $80,000</strong> adds <strong>{formatAUD(RAISE_10K_ON_80K)} a year</strong> to your take-home pay
            ({formatAUD(RAISE_10K_ON_80K / 52, 2)} a week) in FY{SITE_CONFIG.financialYear}, because each extra dollar is taxed at your marginal rate.
          </p>
          <p className="text-warmgray mt-2">Enter your salary and raise (in dollars or as a new salary) to see what you keep.</p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl font-semibold text-navy mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>See Your Pay Before and After a Rise</h2>

              <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                {/* Inputs */}
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="currentSalary" className="block text-sm font-medium text-gray-700 mb-1">Current Base Salary</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="currentSalary" min={0} max={1000000} step={1000} value={currentSalary}
                        onChange={(e) => setCurrentSalary(clamp(Number(e.target.value || 0), 0, 1000000))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-sandstone-dark/10">
                    <div className="flex bg-sandstone p-1 rounded-lg mb-4">
                      <button
                        type="button"
                        onClick={() => setInputMode("raise")}
                        className={`flex-1 text-sm py-1.5 rounded-md font-medium transition-colors ${inputMode === "raise" ? "bg-white text-navy shadow-sm" : "text-warmgray-light hover:text-gray-700"}`}
                      >
                        Raise Amount
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputMode("new_salary")}
                        className={`flex-1 text-sm py-1.5 rounded-md font-medium transition-colors ${inputMode === "new_salary" ? "bg-white text-navy shadow-sm" : "text-warmgray-light hover:text-gray-700"}`}
                      >
                        New Salary
                      </button>
                    </div>

                    <label htmlFor="increase" className="block text-sm font-medium text-gray-700 mb-1">
                      {inputMode === "raise" ? "Pay Rise Amount" : "New Base Salary"}
                    </label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="increase" min={0} max={1000000} step={1000} value={increaseAmount}
                        onChange={(e) => setIncreaseAmount(clamp(Number(e.target.value || 0), 0, 1000000))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                  </div>
                </form>

                {/* Results */}
                <div className="space-y-6">
                  {/* Big Number */}
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">Net Pay Increase</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">
                      {actualRaise >= 0 ? "+" : ""}{formatAUD(takeHomeIncrease)} <span className="text-lg font-medium text-warmgray-light">/ yr</span>
                    </div>
                    {actualRaise > 0 && (
                      <div className="text-sm text-warmgray mt-2">
                        You keep <strong>{keepPercent.toFixed(1)}%</strong> of your pay rise.
                        The other <strong>{taxPercent.toFixed(1)}%</strong> goes to tax.
                      </div>
                    )}
                  </div>

                  {/* Breakdown Tables */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-sandstone rounded-lg p-4 text-sm flex flex-col h-full">
                      <h3 className="font-semibold text-warmgray-light uppercase tracking-wider text-xs mb-3">Current Pay</h3>
                      <div className="space-y-2 flex-grow">
                        <Row label="Gross" value={formatAUD(currentSalary)} />
                        <Row label="Tax + Med" value={`-${formatAUD(currentBreakdown.totalDeductions)}`} />
                      </div>
                      <div className="pt-2 mt-2 border-t border-sandstone-dark/20">
                        <Row label="Take-Home" value={formatAUD(currentBreakdown.takeHomePay)} bold />
                      </div>
                    </div>
                    <div className="bg-sandstone rounded-lg p-4 text-sm flex flex-col h-full ring-1 ring-sandstone-dark/20">
                      <h3 className="font-semibold text-ochre uppercase tracking-wider text-xs mb-3">New Pay</h3>
                      <div className="space-y-2 flex-grow">
                        <Row label="Gross" value={formatAUD(newSalary)} highlight />
                        <Row label="Tax + Med" value={`-${formatAUD(newBreakdown.totalDeductions)}`} />
                      </div>
                      <div className="pt-2 mt-2 border-t border-sandstone-dark/20">
                        <Row label="Take-Home" value={formatAUD(newBreakdown.takeHomePay)} bold green />
                      </div>
                    </div>
                  </div>

                  {actualRaise > 0 && (
                    <div className="bg-eucalyptus-light/30 border border-eucalyptus-light rounded-lg p-4 flex items-center justify-between text-sm">
                      <span className="text-navy font-medium">Extra Employer Super ({SUPER_GUARANTEE.rate * 100}%)</span>
                      <span className="font-bold text-eucalyptus-dark">+{formatAUD(superIncrease)}</span>
                    </div>
                  )}

                  {/* Visual Bar */}
                  {actualRaise > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-warmgray-light uppercase mb-2">Where your {formatAUD(actualRaise)} pay rise goes:</h4>
                      <div className="h-6 w-full flex rounded-full overflow-hidden">
                        <div style={{ width: `${keepPercent}%` }} className="bg-green-500 flex items-center justify-center text-[10px] text-white font-bold px-1 overflow-hidden" title="Take-Home Pay">
                          {keepPercent > 15 ? "TAKE-HOME" : ""}
                        </div>
                        <div style={{ width: `${taxPercent}%` }} className="bg-red-400 flex items-center justify-center text-[10px] text-white font-bold px-1 overflow-hidden" title="Tax + Medicare">
                          {taxPercent > 15 ? "TAX" : ""}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does a Pay Rise Affect Take-Home Pay?</h2>
            <p className="mb-4 text-warmgray">
              A pay rise increases your take-home pay by <strong>less than the gross amount</strong> because the additional income is taxed at your marginal tax rate, not your average tax rate.
            </p>
            <p className="text-warmgray mb-4">
              Australia&apos;s progressive income tax system applies higher rates to each additional dollar earned above a threshold. An employee on $80,000 has an average tax rate of roughly 22%, but the marginal rate on every extra dollar is <strong>30% plus 2% Medicare levy</strong>. That means for every $1,000 of gross pay rise, only <strong>$680</strong> reaches the bank account. The remaining $320 goes to the ATO as income tax and Medicare.
            </p>
            <p className="text-warmgray mb-4">
              This pay rise calculator computes your exact before-and-after take-home pay for FY{SITE_CONFIG.financialYear} using the current Australian tax brackets. Enter your current base salary and the raise amount to see the net benefit broken down by week, fortnight, and year. For a full breakdown of your current pay, use our <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link>.
            </p>
            <div className="bg-sandstone border-l-4 border-ochre/70 p-4">
              <p className="text-navy font-medium">
                Example: A $10,000 pay rise on an $80,000 salary yields <strong>{formatAUD(RAISE_10K_ON_80K)}</strong> extra take-home pay per year, or <strong>{formatAUD(RAISE_10K_ON_80K / 52, 2)}</strong> extra per week after tax and Medicare.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Does the Pay Rise Impact Table Show?</h2>
            <p className="mb-4 text-warmgray">
              The table below shows how pay rises of different sizes translate into after-tax income across <strong>5 salary levels</strong> in the {SITE_CONFIG.financialYear} financial year. Each row calculates income tax, Medicare levy, and the resulting net weekly boost.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Base Salary</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Gross Raise</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Extra Tax + Med</th>
                    <th className="px-4 py-3 text-right font-semibold text-ochre">Net Annual Benefit</th>
                    <th className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">Net Weekly Boost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {[
                    [60_000, 5_000], [80_000, 10_000], [100_000, 15_000],
                    [120_000, 20_000], [150_000, 20_000],
                  ].map(([base, raise]) => {
                    const cb = calculatePayBreakdown({ grossSalary: base! });
                    const nb = calculatePayBreakdown({ grossSalary: base! + raise! });
                    const netAnn = nb.takeHomePay - cb.takeHomePay;
                    const taxAnn = nb.totalDeductions - cb.totalDeductions;
                    const netWk = netAnn / 52;
                    return (
                      <tr key={`${base}-${raise}`} className="hover:bg-sandstone/50">
                        <td className="px-4 py-3 font-medium text-navy">{formatAUD(base!)}</td>
                        <td className="px-4 py-3 text-right text-gray-700">+{formatAUD(raise!)}</td>
                        <td className="px-4 py-3 text-right text-ochre">-{formatAUD(taxAnn)}</td>
                        <td className="px-4 py-3 text-right font-medium text-ochre">+{formatAUD(netAnn)}</td>
                        <td className="px-4 py-3 text-right font-bold text-eucalyptus-dark">+{formatAUD(netWk)}/wk</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">
              *Calculations include income tax and Medicare levy for FY{SITE_CONFIG.financialYear} Australian residents. HECS-HELP repayments, salary sacrifice, and the &quot;Medicare Levy Surcharge&quot; are excluded. Use our <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> to model student loan repayment impact.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Why Doesn&apos;t a 10% Pay Rise Give 10% More Take-Home Pay?</h2>
            <p className="mb-4 text-warmgray">
              A 10% gross pay rise produces <strong>less than 10%</strong> additional take-home pay because the raise is taxed at the marginal rate, which is higher than the average rate applied to total income.
            </p>
            <p className="text-warmgray mb-4">
              The Australian Tax Office applies income tax brackets progressively. In FY{SITE_CONFIG.financialYear} the resident rates are {bracketRatesSentence()}. The 2% Medicare levy applies on top of all these rates.
            </p>

            <h3 className="text-xl font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked Example: 10% Rise on $90,000</h3>
            <p className="text-warmgray mb-4">
              An employee earning <strong>$90,000</strong> receives a 10% pay rise of <strong>$9,000</strong>, bringing the new gross salary to $99,000. The entire $9,000 falls within the {formatAUD(B2.min)}-{formatAUD(B2.max)} bracket, so the marginal rate is <strong>{pct0(B2.rate + MEDICARE_LEVY.rate)} ({pct0(B2.rate)} tax + 2% Medicare)</strong>. The additional tax is <strong>{formatAUD(9_000 - RAISE_9K_ON_90K)}</strong>. The net take-home increase is <strong>{formatAUD(RAISE_9K_ON_90K)} per year</strong>, or <strong>{formatAUD(RAISE_9K_ON_90K / 52, 2)} per week</strong>. That is a <strong>{((RAISE_9K_ON_90K / EX90.takeHomePay) * 100).toFixed(1)}% increase</strong> in take-home pay from a 10% gross rise. View the full tax bracket schedule on our <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">Australian Tax Brackets</Link> page.
            </p>

            <h3 className="text-xl font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Marginal vs Average Tax Rate</h3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Salary</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Average Tax Rate</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Marginal Rate (incl. Medicare)</th>
                    <th className="px-4 py-3 text-right font-semibold text-ochre">Cents Kept per Extra $1</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {[45_000, 80_000, 120_000, 150_000, 200_000].map((gross) => {
                    const kept = keptPerDollar(gross);
                    return {
                      salary: formatAUD(gross),
                      avg: `${(calculatePayBreakdown({ grossSalary: gross }).effectiveTaxRate * 100).toFixed(1)}%`,
                      marginal: `${Math.round((1 - kept) * 1000) / 10}%`,
                      kept: `${Math.round(kept * 1000) / 10}c`,
                    };
                  }).map((row) => (
                    <tr key={row.salary} className="hover:bg-sandstone/50">
                      <td className="px-4 py-3 font-medium text-navy">{row.salary}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{row.avg}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{row.marginal}</td>
                      <td className="px-4 py-3 text-right font-bold text-ochre">{row.kept}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-warmgray text-sm">
              An employee on $80,000 keeps <strong>{Math.round(keptPerDollar(80_000) * 100)} cents</strong> of every additional dollar earned. An employee on $200,000 keeps only <strong>{Math.round(keptPerDollar(200_000) * 100)} cents</strong>. On $45,000 the rate is higher than the bracket suggests because the Low Income Tax Offset shrinks as income rises. The gap between average and marginal rates widens as income increases.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Average Pay Rise in Australia?</h2>
            <p className="mb-4 text-warmgray">
              The average annual wage increase in Australia is <strong>3.5% to 4.0%</strong> as of late 2025, according to the Australian Bureau of Statistics Wage Price Index. This translates to roughly <strong>$3,430</strong> on the national average full-time salary of $98,000.
            </p>
            <p className="text-warmgray mb-4">
              Pay rises vary significantly by industry, role seniority, and location. The mining sector leads with average increases of <strong>5.2%</strong>, followed by technology at <strong>4.8%</strong>, and healthcare at <strong>4.1%</strong>. Retail and hospitality typically see smaller increases of <strong>2.5% to 3.0%</strong>. These figures represent base salary adjustments and exclude bonuses, overtime, and superannuation increases.
            </p>

            <h3 className="text-xl font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does Inflation Affect a Pay Rise?</h3>
            <p className="text-warmgray mb-4">
              A pay rise below the inflation rate results in a <strong>real wage decrease</strong>. With CPI running at approximately <strong>2.8%</strong> in early 2026, a 3% nominal pay rise delivers only <strong>0.2% real growth</strong> in purchasing power. Use our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to compare your current and proposed salary in after-tax terms, then adjust for inflation to assess whether the offer genuinely improves your financial position.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Uses This Calculator?</h2>
            <p className="mb-4 text-warmgray">
              This pay rise calculator serves <strong>3 primary groups</strong> of Australian workers: employees preparing for salary negotiations, job seekers comparing offers, and HR professionals modelling compensation changes.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-warmgray mb-4">
              <li><strong>Employees negotiating a raise</strong> &mdash; calculate the exact after-tax benefit before entering a salary review meeting. Knowing the net weekly impact strengthens the negotiation position.</li>
              <li><strong>Job seekers comparing offers</strong> &mdash; a $10,000 higher gross salary at a new company does not mean $10,000 more in the bank. This calculator reveals the true take-home difference between your current and offered salary.</li>
              <li><strong>HR and payroll professionals</strong> &mdash; model the cost-to-company impact of proposed raises, including employer superannuation obligations at the <strong>12% SG rate</strong>.</li>
              <li><strong>Contractors considering permanent roles</strong> &mdash; compare a contract day rate against a permanent salary offer. Use our <Link href="/contractor-vs-employee-calculator/" className="text-eucalyptus-dark hover:underline">Contractor vs Employee Calculator</Link> for a detailed side-by-side breakdown.</li>
              <li><strong>Part-time workers gaining extra hours</strong> &mdash; calculate the net pay increase from moving from 3 days per week to 4 days, or from part-time to full-time hours.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How to Negotiate a Pay Rise</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border text-warmgray border-sandstone-dark/20 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-eucalyptus-dark mb-3">1. Build Your Case</h3>
                <p className="text-sm">Don&apos;t just ask for more money because of inflation. Track your specific achievements over the last 6-12 months. Did you save the company money? Drive new revenue? Take on duties outside your job description?</p>
              </div>
              <div className="bg-white border text-warmgray border-sandstone-dark/20 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-eucalyptus-dark mb-3">2. Research the Market</h3>
                <p className="text-sm">Check current job listings and recruitment agency salary guides for your exact role and location. Knowing the &quot;market rate&quot; turns an emotional request into an objective business conversation.</p>
              </div>
              <div className="bg-white border text-warmgray border-sandstone-dark/20 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-eucalyptus-dark mb-3">3. Timing is Everything</h3>
                <p className="text-sm">The best time to ask is either 3-4 months before the end of the financial year (when budgets are being set) or immediately after successfully completing a major project.</p>
              </div>
              <div className="bg-white border text-warmgray border-sandstone-dark/20 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-eucalyptus-dark mb-3">4. Focus on the Gross</h3>
                <p className="text-sm">When negotiating, always talk in terms of the Total Package or Base Gross Salary. Do not negotiate based on what you want to &quot;take home&quot; every week, as your employer doesn&apos;t control the tax rates.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are Common Mistakes When Calculating a Pay Rise?</h2>
            <p className="mb-4 text-warmgray">
              Employees and employers make <strong>5 frequent errors</strong> when estimating the value of a pay rise. Each mistake leads to unrealistic expectations about after-tax income.
            </p>
            <ol className="list-decimal pl-5 space-y-3 text-warmgray mb-4">
              <li><strong>Dividing the gross raise by 52 weeks</strong> &mdash; this ignores tax entirely. A $10,000 raise is not {formatAUD(10_000 / 52)} per week; it is <strong>{formatAUD(RAISE_10K_ON_80K / 52)} per week</strong> after the {pct0(B2.rate + MEDICARE_LEVY.rate)} marginal rate on an $80,000 salary.</li>
              <li><strong>Using the average tax rate instead of the marginal rate</strong> &mdash; on $80,000 your overall effective rate of {(EX80.effectiveTaxRate * 100).toFixed(1)}% does not apply to the raise. The marginal rate of {pct0(B2.rate)} (plus 2% Medicare) applies to every additional dollar within the {formatAUD(B2.min)}-{formatAUD(B2.max)} bracket.</li>
              <li><strong>Forgetting the superannuation guarantee increase</strong> &mdash; a $10,000 base salary raise also adds <strong>{formatAUD(10_000 * SUPER_GUARANTEE.rate)}</strong> to superannuation at the {pct0(SUPER_GUARANTEE.rate)} SG rate. This is real compensation, but it does not appear in take-home pay. Model this with our <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link>.</li>
              <li><strong>Ignoring HECS-HELP threshold crossings</strong> &mdash; a pay rise that pushes repayment income above <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong> triggers student loan repayments of {Math.round(HECS_HELP.bands[1].marginalRate * 100)} cents per dollar above the threshold. This effectively adds {pct0(HECS_HELP.bands[1].marginalRate)} to the marginal rate on income in that first band.</li>
              <li><strong>Confusing gross salary with total package</strong> &mdash; some employment contracts quote &quot;total remuneration&quot; inclusive of superannuation. A $110,000 total package is only <strong>{formatAUD(TRP_110K_BASE)}</strong> in base salary after extracting {pct0(SUPER_GUARANTEE.rate)} super. Always confirm whether the quoted figure includes or excludes the employer SG contribution.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Which Related Calculators Help with Pay Rise Planning?</h2>
            <p className="mb-4 text-warmgray">
              Pay rise calculations connect to several other Australian tax and salary tools. Use the calculators below to model the full impact of a salary change on taxation, superannuation, and net pay.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-warmgray">
              <li><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> &mdash; see the complete breakdown of income tax, Medicare levy, and net pay at any gross salary.</li>
              <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> &mdash; calculate your total Australian income tax liability for FY{SITE_CONFIG.financialYear} including the &quot;Low Income Tax Offset&quot; (LITO).</li>
              <li><Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> &mdash; model how redirecting part of your pay rise into pre-tax super contributions reduces your taxable income.</li>
              <li><Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> &mdash; calculate the employer SG contribution on your new salary and project long-term super balance growth.</li>
              <li><Link href="/gross-pay-calculator/" className="text-eucalyptus-dark hover:underline">Gross Pay Calculator</Link> &mdash; reverse-calculate the gross salary required to achieve a specific take-home pay target after a raise.</li>
            </ul>
          </section>

          <MethodologyDisclosure>
            <p className="mb-2 text-sm">Calculations for the pay rise breakdown are based on:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Calculating your ATO income tax and Medicare levy before the raise.</li>
              <li>Re-calculating your ATO income tax and Medicare levy after the raise.</li>
              <li>Taking the exact difference to find the net financial benefit.</li>
              <li>Assuming the pay rise is added to Base Salary (not inclusive of Super).</li>
            </ul>
          </MethodologyDisclosure>

          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <AccordionItem value="tax" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Why is my pay rise taxed so highly?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Your pay rise is taxed at your &quot;marginal tax rate&quot;, which is the highest tax bracket your income falls into. This is often much higher than your average tax rate, meaning a larger percentage of your <em>extra</em> pay goes to the ATO. Between {formatAUD(B2.min)} and {formatAUD(B2.max)}, your marginal rate is <strong>{pct0(B2.rate)}</strong> plus 2% Medicare levy, totalling <strong>{pct0(B2.rate + MEDICARE_LEVY.rate)}</strong>. Between {formatAUD(B3.min)} and {formatAUD(B3.max)}, the combined marginal rate rises to <strong>{pct0(B3.rate + MEDICARE_LEVY.rate)}</strong>.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="super" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Does my employer pay extra super on my pay rise?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. Under the &quot;Superannuation Guarantee&quot;, your employer pays <strong>{pct0(SUPER_GUARANTEE.rate)}</strong> super on your qualifying earnings for FY{SITE_CONFIG.financialYear}. A $10,000 base pay rise generates an extra <strong>{formatAUD(10_000 * SUPER_GUARANTEE.rate)}</strong> deposited into your super fund per year. Under Payday Super the &quot;maximum super contribution base&quot; is an annual {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="bracket" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Can a pay rise push me into a higher tax bracket and leave me worse off?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">No. This is the most common tax myth in Australia. Progressive taxation means only the portion of income <em>above</em> each threshold is taxed at the higher rate. A pay rise that crosses from $134,000 to $136,000 applies the 37% rate only to the <strong>$1,000 above $135,000</strong>, not to the entire salary. You always take home more money after a pay rise.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="sacrifice" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Can salary sacrifice boost my pay rise benefit?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. Salary sacrificing part of your pay rise into super before tax avoids the marginal rate on that portion. Inside your super fund, contributions are taxed at only <strong>15%</strong> (or <strong>30%</strong> for earners above $250,000 under &quot;Division 293&quot; tax). Sacrificing $5,000 of a $10,000 pay rise saves roughly <strong>$850 to $1,600</strong> in tax depending on your bracket, while boosting retirement savings. The concessional contributions cap is <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong> for FY{SITE_CONFIG.financialYear}. Use our <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> to model the benefit.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="hecs" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How does a pay rise affect my HECS-HELP repayments?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">A pay rise increases your repayment income, which determines HECS-HELP obligations. The repayment threshold for FY{SITE_CONFIG.financialYear} is <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong>. Below this threshold, no repayment is required. Above it, you repay {hecsBandsSentence()}. A pay rise from $65,000 to $70,000 triggers a HECS repayment of <strong>{formatAUD(HECS_65_TO_70)} per year</strong>.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="weekly" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How much extra per week is a $5,000 pay rise?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">The net weekly increase from a $5,000 pay rise depends on your current salary and marginal tax rate. On an $80,000 salary ({pct0(B2.rate + MEDICARE_LEVY.rate)} combined marginal rate), a $5,000 raise yields <strong>{formatAUD(RAISE_5K_ON_80K)}</strong> extra after tax, or <strong>{formatAUD(RAISE_5K_ON_80K / 52, 2)} per week</strong>. On a $150,000 salary ({pct0(B3.rate + MEDICARE_LEVY.rate)} combined marginal rate), the same $5,000 raise yields <strong>{formatAUD(RAISE_5K_ON_150K)}</strong> after tax, or <strong>{formatAUD(RAISE_5K_ON_150K / 52, 2)} per week</strong>.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="mls" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Does a pay rise affect the Medicare Levy Surcharge?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes, if you do not hold private hospital cover. The &quot;Medicare Levy Surcharge&quot; applies to singles earning <strong>{formatAUD(MLS.tier1.min)}</strong> or more in FY{SITE_CONFIG.financialYear}. A pay rise crossing this threshold triggers an additional <strong>1.0%</strong> surcharge on total income ({formatAUD(MLS.tier1.min)}-{formatAUD(MLS.tier1.max)}), increasing to <strong>1.25%</strong> ({formatAUD(MLS.tier2.min)}-{formatAUD(MLS.tier2.max)}) and <strong>1.5%</strong> (above {formatAUD(MLS.tier3.min - 1)}). On a $110,000 salary without private health insurance, the MLS adds <strong>{formatAUD(MLS_110K)} per year</strong> in additional deductions.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="stage3" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Did the Stage 3 tax cuts change how pay rises are taxed?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. The Stage 3 tax cuts, effective 1 July 2024, reduced the first bracket rate from <strong>19% to 16%</strong> (and it fell again to <strong>{pct0(TAX_BRACKETS[1].rate)}</strong> from 1 July 2026) and expanded the 30% bracket ceiling from $120,000 to <strong>$135,000</strong>. Employees earning between $120,001 and $135,000 now keep more of a pay rise because their marginal rate dropped from <strong>37% to 30%</strong>. A $10,000 raise for someone on $125,000 now yields <strong>$700 more</strong> in take-home pay compared to pre-Stage 3 rates.</p></AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section className="bg-eucalyptus-light/30 rounded-2xl p-8 text-center mt-12">
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Understand the Tax Brackets</h2>
            <p className="text-warmgray mb-6 max-w-lg mx-auto">Want to see exactly where the tax rates change? View our guide on the current tax thresholds.</p>
            <Link href="/tax-brackets/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all">View Tax Brackets →</Link>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, green, highlight }: { label: string; value: string; bold?: boolean; green?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-semibold text-navy" : highlight ? "font-semibold text-ochre" : "text-warmgray"}>{label}</span>
      <span className={`${bold ? "font-bold" : highlight ? "font-bold" : "font-medium"} ${green ? "text-eucalyptus-dark" : highlight ? "text-ochre" : "text-gray-700"}`}>{value}</span>
    </div>
  );
}
