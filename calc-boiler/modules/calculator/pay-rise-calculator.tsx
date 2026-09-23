"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RelatedSearches, type RelatedSearch } from "@/modules/seo/related-searches";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FaqAccordion from "@/components/common/faq-accordion";
import { CALCULATE_PAY_RISE_ANSWER, CPI_ANNUAL, PAY_RISE_FAQS, RAISE_BASE, RAISE_ROWS, WPI_ANNUAL } from "./pay-rise-calculator-faqs";
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
} from "@/lib/constants";
import { bracketRatesSentence } from "@/modules/calculator/fy-rate-copy";

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
const EX80 = calculatePayBreakdown({ grossSalary: 80_000 });
const EX90 = calculatePayBreakdown({ grossSalary: 90_000 });
const TRP_110K_BASE = Math.round(110_000 / (1 + SUPER_GUARANTEE.rate));
const B2 = TAX_BRACKETS[2];
// ABS Wage Price Index, June quarter 2026 (released 19 Aug 2026): 3.2% over
// the year, seasonally adjusted. ABS Average Weekly Earnings, May 2026:
// full-time adult ordinary time earnings $2,083.70 a week (seasonally adjusted).
// WPI_ANNUAL and CPI_ANNUAL now live in pay-rise-calculator-faqs.ts so the
// FAQ answers and this copy share one figure.
const AWOTE_ANNUAL = Math.round(2_083.7 * 52);

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// Google AU "related searches" for "pay rise calculator" and "salary increase
// calculator" (Sept 2026), each pointed at the page that answers it.
const RELATED_SEARCHES: readonly RelatedSearch[] = [
  { label: "Pay calculator after tax", href: "/take-home-pay-calculator/" },
  { label: "Pay calculator hourly rate", href: "/hourly-to-annual-salary-calculator/" },
  { label: "Back pay on a backdated pay rise", href: "/backpay-calculator/" },
  { label: "Minimum wage increase 2026", href: "/minimum-wage-australia/" },
  { label: "Average salary in Australia", href: "/average-salary-australia/" },
  { label: "Casual pay calculator", href: "/casual-loading-calculator/" },
];

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

              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
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
              Australia&apos;s progressive income tax system applies higher rates to each additional dollar earned above a threshold. An employee on $80,000 has an average tax rate of about {((EX80.netIncomeTax + EX80.medicareLevy) / 80_000 * 100).toFixed(0)}% (income tax plus Medicare levy), but the marginal rate on every extra dollar is <strong>{pct0(B2.rate)} plus 2% Medicare levy</strong>. That means for every $1,000 of gross pay rise, only <strong>{formatAUD(Math.round(keptPerDollar(80_000) * 1_000))}</strong> reaches the bank account. The remaining {formatAUD(1_000 - Math.round(keptPerDollar(80_000) * 1_000))} goes to the ATO as income tax and Medicare.
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

          {/* PAA: "How do I calculate my pay raise?" — formula + compact table */}
          <section id="calculate-pay-rise">
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Do I Calculate My Pay Rise?</h2>
            <p className="mb-4 text-warmgray">{CALCULATE_PAY_RISE_ANSWER.a}</p>
            <div className="bg-eucalyptus-light/30 border-l-4 border-eucalyptus p-4 text-navy font-medium font-mono text-sm max-w-lg mx-auto rounded-r-lg mb-4">
              Pay rise % = (New salary &minus; Old salary) &divide; Old salary &times; 100
            </div>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <caption className="sr-only">Percentage pay rises on {formatAUD(RAISE_BASE)}, FY{SITE_CONFIG.financialYear}</caption>
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Rise on {formatAUD(RAISE_BASE)}</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">New salary</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Extra before tax</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Extra after tax</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Per week</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {RAISE_ROWS.map((r) => (
                    <tr key={r.rate}>
                      <td className="px-4 py-3 text-navy font-medium">{Math.round(r.rate * 10_000) / 100}%</td>
                      <td className="px-4 py-3 text-right text-navy">{formatAUD(r.newSalary)}</td>
                      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(r.extra)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">{formatAUD(r.afterTax)}</td>
                      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(r.weekly, 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              Wages rose <strong>{(WPI_ANNUAL * 100).toFixed(1)}%</strong> over the year to the June quarter 2026, according to the Australian Bureau of Statistics Wage Price Index. On average full-time adult ordinary time earnings of about {formatAUD(AWOTE_ANNUAL)} a year (ABS, May 2026), that is roughly <strong>{formatAUD(Math.round(AWOTE_ANNUAL * WPI_ANNUAL))}</strong> before tax.
            </p>
            <p className="text-warmgray mb-4">
              Pay rises vary significantly by industry, role seniority, and location. Award-covered workers received the Fair Work Commission&apos;s annual increase from 1 July, while agreement and contract rises depend on the employer. The ABS publishes wage growth by industry and sector in each Wage Price Index release.
            </p>

            <h3 className="text-xl font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does Inflation Affect a Pay Rise?</h3>
            <p className="text-warmgray mb-4">
              A pay rise below the inflation rate results in a <strong>real wage decrease</strong>. With the CPI up <strong>{(CPI_ANNUAL * 100).toFixed(1)}%</strong> over the year to June 2026 (ABS), a 3% nominal pay rise is a real <strong>cut</strong> of about {((CPI_ANNUAL - 0.03) * 100).toFixed(1)}% in purchasing power &mdash; and the {(WPI_ANNUAL * 100).toFixed(1)}% average wage rise also trailed inflation. Use our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to compare your current and proposed salary in after-tax terms, then adjust for inflation to assess whether the offer genuinely improves your financial position.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

          <RelatedSearches items={RELATED_SEARCHES} />

          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <FaqAccordion faqs={PAY_RISE_FAQS} className="space-y-3" itemClassName="rounded-xl border border-sandstone-dark/20 px-5" contentClassName="text-warmgray" />
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
