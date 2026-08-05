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
  formatPercent,
  SUPER_GUARANTEE,
  HECS_HELP,
  SOURCES,
  SITE_CONFIG,
  STATE_PAYROLL_TAX,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Display order for the cross-state payroll tax comparison table (home state first). */
const PAYROLL_COMPARE_ORDER = ["VIC", "NSW", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as const;

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Average Weekly Earnings (VIC)", url: "https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/average-weekly-earnings-australia", publisher: "Australian Bureau of Statistics" },
  { title: "VIC Payroll Tax", url: "https://www.sro.vic.gov.au/businesses-and-organisations/payroll-tax", publisher: "State Revenue Office Victoria" },
];

export default function PayCalculatorVICPage() {
  const [salary, setSalary] = useState(92_000);
  const [includeHECS, setIncludeHECS] = useState(false);
  const [hasPrivateHealth, setHasPrivateHealth] = useState(true);

  const result = useMemo(
    () => calculatePayBreakdown({ grossSalary: salary, includeHECS, hasPrivateHealth }),
    [salary, includeHECS, hasPrivateHealth]
  );

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-eucalyptus-light/30 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Pay Calculator VIC</span></li>
            </ol>
          </nav>
          <div className="flex items-center gap-3 mt-4 mb-3">
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl md:text-4xl font-bold text-navy">Pay Calculator VIC 2025-26</h1>
            <span className="bg-eucalyptus-dark text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">VIC</span>
          </div>
          <p className="text-lg text-warmgray">Calculate your exact take-home pay in Victoria. Understand federal tax rates, local payroll taxes, and the average salary in Melbourne and regional Victoria.</p>
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
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" checked={includeHECS} onChange={(e) => setIncludeHECS(e.target.checked)}
                      className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" />
                    <span className="text-navy">Include HECS-HELP debt</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" checked={hasPrivateHealth} onChange={(e) => setHasPrivateHealth(e.target.checked)}
                      className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" />
                    <span className="text-navy">Private health insurance</span>
                  </label>
                  <button type="submit" className="w-full bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 rounded-lg shadow-md transition-all">Calculate Net Pay</button>
                </form>

                <Card className="bg-sandstone border-0 shadow-none" role="region" aria-live="polite">
                  <CardContent className="p-6">
                    <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-4">Your Pay Breakdown</h2>
                    <div className="space-y-2.5 text-sm">
                      <Row label="Gross Salary" value={formatAUD(salary)} bold />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Income Tax (Federal)" value={`-${formatAUD(result.netIncomeTax)}`} />
                      {result.litoOffset > 0 && <Row label="  LITO Offset" value={`+${formatAUD(result.litoOffset)}`} sub />}
                      <Row label="Medicare Levy" value={`-${formatAUD(result.medicareLevy)}`} />
                      {result.medicareSurcharge > 0 && <Row label="Medicare Surcharge" value={`-${formatAUD(result.medicareSurcharge)}`} />}
                      {includeHECS && <Row label="HECS Repayment" value={`-${formatAUD(result.hecsRepayment)}`} />}
                      <div className="border-t border-sandstone-dark/20" />
                      <div className="flex justify-between items-baseline pt-1">
                        <span className="font-bold text-navy">Take-Home Pay</span>
                        <span className="text-2xl font-extrabold text-navy">{formatAUD(result.takeHomePay)}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-center bg-sandstone rounded-lg p-2 mt-2">
                        <div><div className="font-semibold text-navy">{formatAUD(result.weekly, 2)}</div><div className="text-warmgray-light">weekly</div></div>
                        <div><div className="font-semibold text-navy">{formatAUD(result.fortnightly, 2)}</div><div className="text-warmgray-light">fortnightly</div></div>
                        <div><div className="font-semibold text-navy">{formatAUD(result.monthly, 2)}</div><div className="text-warmgray-light">monthly</div></div>
                      </div>
                      <div className="border-t border-sandstone-dark/20 pt-3">
                        <Row label={`Super (${formatPercent(SUPER_GUARANTEE.rate, 0)})`} value={`+${formatAUD(result.superContribution)}`} />
                        <Row label="Total Package" value={formatAUD(result.totalPackage)} bold />
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

          {/* H2: How Does the VIC Pay Calculator Work? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Does the VIC Pay Calculator Work?</h2>
            <p className="text-warmgray mb-4">The VIC pay calculator converts your gross annual salary into after-tax income by applying FY2025-26 federal income tax brackets, the 2% Medicare levy, and any applicable HECS-HELP repayments.</p>
            <p className="text-warmgray mb-4">Victoria has no state-level personal income tax. Every Australian resident pays the same federal <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">income tax brackets</Link> regardless of whether they work in Melbourne, Geelong, Ballarat, or Bendigo. The calculator applies these brackets automatically and subtracts the &quot;Low Income Tax Offset&quot; (LITO) for salaries below <strong>$66,668</strong>.</p>
            <div className="bg-sandstone border-l-4 border-eucalyptus p-4 mb-4 rounded-r-lg">
              <p className="text-navy mb-2 font-medium">How the calculation works:</p>
              <ol className="text-navy text-sm space-y-1 list-decimal list-inside">
                <li>Enter your gross annual salary (before tax)</li>
                <li>Federal income tax is calculated using ATO marginal rates for FY2025-26</li>
                <li>The Medicare levy of <strong>2%</strong> is deducted from assessable income</li>
                <li>HECS-HELP repayments are applied if selected (threshold starts at <strong>$69,528</strong>)</li>
                <li>Superannuation at <strong>12%</strong> is calculated on top of your gross salary</li>
              </ol>
            </div>
            <p className="text-warmgray">Your take-home pay equals gross salary minus income tax, minus the Medicare levy, minus any HECS repayment. Use the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to see how employer super contributions grow over time.</p>
            <p className="text-warmgray mt-4">Before tax is calculated, Victorian employees in the private sector are generally covered by federal modern awards that set their legal minimum hourly rate. See our <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">Australian award rates guide</Link> for the FY2025-26 rates by industry. Note that Victorian state public sector employees (teachers, nurses in public hospitals, public servants) are usually covered by separate Victorian state awards or enterprise agreements rather than the federal modern awards.</p>
          </section>

          {/* H2: What Is the Average Salary in Victoria? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is the Average Salary in Victoria?</h2>
            <p className="text-warmgray mb-4">The average full-time salary in Victoria is <strong>$93,250 per year</strong>, approximately 3% below the NSW average of $95,337 and 2% above the national average of $91,600.</p>
            <div className="bg-sandstone rounded-xl border border-sandstone-dark/20 p-6 flex flex-col sm:flex-row gap-6 items-center mb-6">
              <div className="text-center sm:w-1/3">
                <div className="text-3xl font-bold text-navy mb-1">$93,250</div>
                <div className="text-sm text-warmgray-light uppercase tracking-widest font-semibold">Average Annual</div>
              </div>
              <div className="text-warmgray text-sm sm:w-2/3">
                <p className="mb-2">ABS average weekly ordinary time earnings for full-time adults in Victoria sit at approximately <strong>$1,793.30 per week</strong>. Melbourne CBD salaries trend 8-15% higher than regional Victoria averages.</p>
                <p className="text-xs text-warmgray-light italic">*Based on ABS Average Weekly Earnings data. Individual earnings vary by industry, experience, and location.</p>
              </div>
            </div>

            {/* H3: Average Salary by Industry */}
            <h3 className="text-xl font-semibold text-navy mb-3">Average Salary by Industry in Victoria</h3>
            <p className="text-warmgray mb-4">Salary levels in Victoria vary significantly across sectors. Mining and professional services command the highest pay, while retail and hospitality sit at the lower end. The table below lists 8 major industries and their average annual earnings for full-time employees in VIC.</p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-sandstone-dark/20 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="text-left px-4 py-3 font-semibold">Industry</th>
                    <th className="text-right px-4 py-3 font-semibold">Average Salary (VIC)</th>
                    <th className="text-right px-4 py-3 font-semibold">vs National Average</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="bg-white"><td className="px-4 py-2.5 text-navy">Mining &amp; Resources</td><td className="px-4 py-2.5 text-right font-medium text-navy">$134,000</td><td className="px-4 py-2.5 text-right text-warmgray">-5%</td></tr>
                  <tr className="bg-sandstone/50"><td className="px-4 py-2.5 text-navy">Professional &amp; Financial Services</td><td className="px-4 py-2.5 text-right font-medium text-navy">$115,000</td><td className="px-4 py-2.5 text-right text-warmgray">+2%</td></tr>
                  <tr className="bg-white"><td className="px-4 py-2.5 text-navy">Information Technology</td><td className="px-4 py-2.5 text-right font-medium text-navy">$112,000</td><td className="px-4 py-2.5 text-right text-warmgray">+1%</td></tr>
                  <tr className="bg-sandstone/50"><td className="px-4 py-2.5 text-navy">Construction</td><td className="px-4 py-2.5 text-right font-medium text-navy">$98,500</td><td className="px-4 py-2.5 text-right text-warmgray">-2%</td></tr>
                  <tr className="bg-white"><td className="px-4 py-2.5 text-navy">Healthcare &amp; Social Assistance</td><td className="px-4 py-2.5 text-right font-medium text-navy">$92,000</td><td className="px-4 py-2.5 text-right text-warmgray">+3%</td></tr>
                  <tr className="bg-sandstone/50"><td className="px-4 py-2.5 text-navy">Education &amp; Training</td><td className="px-4 py-2.5 text-right font-medium text-navy">$88,500</td><td className="px-4 py-2.5 text-right text-warmgray">+1%</td></tr>
                  <tr className="bg-white"><td className="px-4 py-2.5 text-navy">Retail Trade</td><td className="px-4 py-2.5 text-right font-medium text-navy">$62,000</td><td className="px-4 py-2.5 text-right text-warmgray">0%</td></tr>
                  <tr className="bg-sandstone/50"><td className="px-4 py-2.5 text-navy">Accommodation &amp; Food Services</td><td className="px-4 py-2.5 text-right font-medium text-navy">$55,000</td><td className="px-4 py-2.5 text-right text-warmgray">-1%</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray text-sm">Workers in mining earn more than double those in hospitality. Use the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to compare net pay at different salary levels across these industries.</p>
          </section>

          {/* H2: How Much Tax Do You Pay in Victoria? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Much Tax Do You Pay in Victoria?</h2>
            <p className="text-warmgray mb-4">A Victorian employee earning <strong>$92,000</strong> pays <strong>$20,567</strong> in income tax, <strong>$1,840</strong> in Medicare levy, and takes home approximately <strong>$69,593 per year</strong> (or <strong>$1,338 per week</strong>).</p>
            <p className="text-warmgray mb-4">Income tax rates are identical across all Australian states and territories. The ATO applies marginal tax rates for FY2025-26, meaning each dollar is taxed at the rate for the bracket it falls into. The following worked example breaks down the taxation of a $92,000 salary step by step.</p>

            <div className="bg-sandstone rounded-xl border border-sandstone-dark/20 p-6 mb-4">
              <h3 className="text-lg font-semibold text-navy mb-3">Worked Example: $92,000 Salary in Victoria</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-sandstone-dark/20 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-navy text-white">
                      <th className="text-left px-4 py-3 font-semibold">Tax Bracket</th>
                      <th className="text-right px-4 py-3 font-semibold">Rate</th>
                      <th className="text-right px-4 py-3 font-semibold">Tax on Bracket</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/10">
                    <tr className="bg-white"><td className="px-4 py-2.5 text-navy">$0 - $18,200</td><td className="px-4 py-2.5 text-right text-warmgray">0%</td><td className="px-4 py-2.5 text-right font-medium text-navy">$0</td></tr>
                    <tr className="bg-sandstone/50"><td className="px-4 py-2.5 text-navy">$18,201 - $45,000</td><td className="px-4 py-2.5 text-right text-warmgray">16%</td><td className="px-4 py-2.5 text-right font-medium text-navy">$4,288</td></tr>
                    <tr className="bg-white"><td className="px-4 py-2.5 text-navy">$45,001 - $92,000</td><td className="px-4 py-2.5 text-right text-warmgray">30%</td><td className="px-4 py-2.5 text-right font-medium text-navy">$14,100</td></tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-eucalyptus-light/30 font-semibold"><td className="px-4 py-2.5 text-navy">Total Income Tax (before offsets)</td><td className="px-4 py-2.5"></td><td className="px-4 py-2.5 text-right text-navy">$18,388</td></tr>
                  </tfoot>
                </table>
              </div>
              <div className="mt-4 space-y-1 text-sm text-warmgray">
                <p>Gross income tax: <strong>$18,388</strong></p>
                <p>LITO offset: <strong>$0</strong> (income exceeds $66,668 threshold)</p>
                <p>Net income tax: <strong>$18,388</strong></p>
                <p>Medicare levy (2%): <strong>$1,840</strong></p>
                <p>Total deductions: <strong>$20,228</strong></p>
                <p className="font-semibold text-navy pt-2">Take-home pay: <strong>$71,772 per year</strong> | <strong>$1,380 per week</strong> | <strong>$5,981 per month</strong></p>
                <p>Superannuation (12% on top): <strong>$11,040</strong> | Total package: <strong>$103,040</strong></p>
              </div>
            </div>
            <p className="text-warmgray text-sm">The marginal tax rate at $92,000 is <strong>30%</strong>, meaning each additional dollar earned above $45,000 is taxed at 30 cents. The next bracket of 37% begins at $135,001. Review all <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">income tax brackets</Link> for FY2025-26 to understand how your marginal rate changes with a pay rise.</p>
          </section>

          {/* H2: What Is VIC Payroll Tax? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is VIC Payroll Tax?</h2>
            <p className="text-warmgray mb-4">VIC payroll tax is a state tax paid by employers at a rate of <strong>{formatPercent(STATE_PAYROLL_TAX.VIC.rate, 2)}</strong> on wages exceeding a <strong>{formatAUD(STATE_PAYROLL_TAX.VIC.threshold)}</strong> annual threshold, administered by the State Revenue Office Victoria.</p>
            <p className="text-warmgray mb-4">Payroll tax does not reduce your personal take-home pay. Employers pay it directly to the state government based on their total Australian wage bill. Regional Victorian employers benefit from a reduced rate of <strong>1.2125%</strong>, encouraging businesses to operate outside Melbourne. The threshold increases to <strong>$1,000,000</strong> from 1 July 2025. Victoria also applies the &quot;Mental Health and Wellbeing Surcharge&quot; on employers with national payrolls exceeding $10 million.</p>

            {/* H3: VIC vs Other States Payroll Tax */}
            <h3 className="text-xl font-semibold text-navy mb-3">How Does VIC Payroll Tax Compare to Other States?</h3>
            <p className="text-warmgray mb-4">Victorian payroll tax sits in the middle range nationally. Queensland and WA offer higher thresholds, while the ACT charges a higher rate. The following table compares payroll tax across all 8 states and territories for FY2025-26.</p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-sandstone-dark/20 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="text-left px-4 py-3 font-semibold">State/Territory</th>
                    <th className="text-right px-4 py-3 font-semibold">Rate</th>
                    <th className="text-right px-4 py-3 font-semibold">Annual Threshold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {PAYROLL_COMPARE_ORDER.map((code, i) => {
                    const s = STATE_PAYROLL_TAX[code];
                    const isHome = code === "VIC";
                    const rowClass = isHome ? "bg-eucalyptus-light/20 font-semibold" : i % 2 === 0 ? "bg-sandstone/50" : "bg-white";
                    return (
                      <tr key={code} className={rowClass}>
                        <td className="px-4 py-2.5 text-navy">{s.name}</td>
                        <td className={`px-4 py-2.5 text-right ${isHome ? "text-navy" : "text-warmgray"}`}>{formatPercent(s.rate, 2)}</td>
                        <td className={`px-4 py-2.5 text-right ${isHome ? "text-navy" : "text-warmgray"}`}>{formatAUD(s.threshold)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-warmgray text-sm">Victoria has the lowest threshold of any state, meaning more employers cross the payroll tax trigger point. Explore how employer costs differ using the <Link href="/employer-cost-calculator/" className="text-eucalyptus-dark hover:underline">Employer Cost Calculator</Link>. Compare VIC to the <Link href="/pay-calculator-nsw/" className="text-eucalyptus-dark hover:underline">Pay Calculator NSW</Link> or <Link href="/pay-calculator-qld/" className="text-eucalyptus-dark hover:underline">Pay Calculator QLD</Link> for interstate salary comparisons.</p>
          </section>

          {/* --- CONTEXT BORDER --- */}

          {/* H2: What Is the Cost of Living in Melbourne? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is the Cost of Living in Melbourne?</h2>
            <p className="text-warmgray mb-4">Melbourne&apos;s cost of living is approximately <strong>8-12% lower</strong> than Sydney, making it the most affordable major capital city on the eastern seaboard for housing, transport, and groceries.</p>
            <p className="text-warmgray mb-4">A single person in Melbourne requires roughly <strong>$2,400-$2,800 per month</strong> (excluding rent) to cover food, transport, utilities, and personal expenses. Rent for a 1-bedroom apartment in the CBD averages <strong>$1,800-$2,200 per month</strong>, while outer suburbs like Werribee, Cranbourne, and Pakenham drop to <strong>$1,200-$1,500 per month</strong>.</p>

            {/* H3: Melbourne vs Sydney */}
            <h3 className="text-xl font-semibold text-navy mb-3">Melbourne vs Sydney Cost Comparison</h3>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-sandstone-dark/20 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="text-left px-4 py-3 font-semibold">Expense Category</th>
                    <th className="text-right px-4 py-3 font-semibold">Melbourne</th>
                    <th className="text-right px-4 py-3 font-semibold">Sydney</th>
                    <th className="text-right px-4 py-3 font-semibold">Difference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="bg-white"><td className="px-4 py-2.5 text-navy">1-Bed Apartment (CBD)</td><td className="px-4 py-2.5 text-right text-warmgray">$2,000/mo</td><td className="px-4 py-2.5 text-right text-warmgray">$2,600/mo</td><td className="px-4 py-2.5 text-right font-medium text-eucalyptus-dark">-23%</td></tr>
                  <tr className="bg-sandstone/50"><td className="px-4 py-2.5 text-navy">Monthly Transport (Myki Pass)</td><td className="px-4 py-2.5 text-right text-warmgray">$165</td><td className="px-4 py-2.5 text-right text-warmgray">$200</td><td className="px-4 py-2.5 text-right font-medium text-eucalyptus-dark">-18%</td></tr>
                  <tr className="bg-white"><td className="px-4 py-2.5 text-navy">Groceries (Monthly)</td><td className="px-4 py-2.5 text-right text-warmgray">$450</td><td className="px-4 py-2.5 text-right text-warmgray">$480</td><td className="px-4 py-2.5 text-right font-medium text-eucalyptus-dark">-6%</td></tr>
                  <tr className="bg-sandstone/50"><td className="px-4 py-2.5 text-navy">Utilities (Monthly)</td><td className="px-4 py-2.5 text-right text-warmgray">$220</td><td className="px-4 py-2.5 text-right text-warmgray">$230</td><td className="px-4 py-2.5 text-right font-medium text-eucalyptus-dark">-4%</td></tr>
                  <tr className="bg-white"><td className="px-4 py-2.5 text-navy">Childcare (Daily)</td><td className="px-4 py-2.5 text-right text-warmgray">$130</td><td className="px-4 py-2.5 text-right text-warmgray">$150</td><td className="px-4 py-2.5 text-right font-medium text-eucalyptus-dark">-13%</td></tr>
                </tbody>
              </table>
            </div>

            {/* H3: Regional VIC */}
            <h3 className="text-xl font-semibold text-navy mb-3">Cost of Living in Regional Victoria</h3>
            <p className="text-warmgray mb-4">Regional Victoria offers significantly lower living costs than Melbourne. Median rents in cities like Geelong, Ballarat, and Bendigo range from <strong>$1,000-$1,400 per month</strong> for a 3-bedroom house. Shepparton and Warrnambool sit even lower at <strong>$850-$1,100 per month</strong>. Average salaries in regional VIC are <strong>10-18% lower</strong> than Melbourne, but the reduced housing and transport costs often result in comparable disposable salary after expenses.</p>
          </section>

          {/* H2: Who Are the Major Employers in Victoria? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Who Are the Major Employers in Victoria?</h2>
            <p className="text-warmgray mb-4">The Victorian Government is the largest employer in the state, with over <strong>300,000</strong> public sector employees across health, education, transport, and emergency services.</p>
            <p className="text-warmgray mb-4">Victoria&apos;s economy is the most diversified in Australia, spanning finance, manufacturing, healthcare, technology, and agriculture. Melbourne serves as the headquarters for 4 of the Big Four banks&apos; major operations and hosts the largest concentration of technology companies outside Sydney.</p>
            <ul className="text-warmgray space-y-2 mb-4 text-sm">
              <li><strong>Healthcare:</strong> Melbourne Health, Monash Health, Alfred Health, Austin Health, and Eastern Health collectively employ over <strong>80,000</strong> workers</li>
              <li><strong>Finance:</strong> ANZ, NAB, and BHP (headquartered in Melbourne) employ approximately <strong>35,000</strong> Victorians combined</li>
              <li><strong>Retail:</strong> Coles Group and Wesfarmers Kmart Group (both headquartered in Melbourne) employ over <strong>50,000</strong> in VIC</li>
              <li><strong>Technology:</strong> Atlassian, REA Group, SEEK, and Canva maintain significant Melbourne offices employing over <strong>8,000</strong> workers</li>
              <li><strong>Education:</strong> The University of Melbourne, Monash University, and RMIT employ over <strong>25,000</strong> staff combined</li>
              <li><strong>Manufacturing:</strong> Toyota (until 2017) has been replaced by defence and advanced manufacturing firms including BAE Systems and Thales Australia</li>
            </ul>
            <p className="text-warmgray text-sm">Many Victorian employers offer <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">salary sacrifice</Link> arrangements for superannuation, novated leases, and additional benefits that reduce taxable income.</p>
          </section>

          {/* H2: What State-Specific Benefits Apply in VIC? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What State-Specific Benefits Apply in VIC?</h2>
            <p className="text-warmgray mb-4">Victoria offers state-specific benefits including a <strong>$10,000</strong> First Home Owner Grant for new homes, stamp duty concessions for properties under <strong>$600,000</strong>, and the Victorian Energy Compare rebate of up to <strong>$250 per year</strong>.</p>
            <p className="text-warmgray mb-4">These benefits do not affect your income taxation or take-home pay calculation directly, but they improve the financial position of Victorian residents. Key state-level benefits include:</p>
            <ul className="text-warmgray space-y-2 mb-4 text-sm">
              <li><strong>First Home Owner Grant:</strong> A one-off payment of <strong>$10,000</strong> for first home buyers purchasing or building a new home valued at $750,000 or less</li>
              <li><strong>Stamp Duty Concessions:</strong> Full exemption for first home buyers on properties up to <strong>$600,000</strong>, with a sliding concession for properties between $600,001 and $750,000</li>
              <li><strong>Victorian Energy Compare:</strong> An annual electricity rebate of up to <strong>$250</strong> for households that compare energy deals through the state portal</li>
              <li><strong>Regional First Home Buyer Fund:</strong> Shared equity contributions of up to <strong>25%</strong> of the purchase price for regional buyers</li>
              <li><strong>WorkSafe Coverage:</strong> Employer-funded workplace injury insurance at no cost to the employee</li>
            </ul>
            <p className="text-warmgray text-sm">Federal benefits like the <Link href="/medicare-levy/" className="text-eucalyptus-dark hover:underline">Medicare levy</Link> reduction for low-income earners and the &quot;Low Income Tax Offset&quot; apply equally across all states. The superannuation guarantee of <strong>12%</strong> for FY2025-26 is also a federal requirement. Use the Australian tax calculator above to see your exact net pay after all applicable deductions.</p>
          </section>

          {/* H2: Frequently Asked Questions */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <FAQItem value="federal" question="Is income tax different in Victoria compared to other states?">
                No. Personal income tax in Australia is levied by the federal government through the ATO. The income tax brackets, Medicare levy, and HECS-HELP repayment thresholds are identical in Victoria, New South Wales, Queensland, and every other state and territory.
              </FAQItem>
              <FAQItem value="payroll" question="What is the payroll tax threshold in VIC for FY2025-26?">
                The payroll tax threshold in Victoria increases to $1,000,000 from 1 July 2025 (up from $900,000 in FY2024-25). Employers pay a rate of 4.85% on taxable wages above this threshold, while regional Victorian employers pay a reduced rate of 1.2125%.
              </FAQItem>
              <FAQItem value="employee" question="Do employees pay the Mental Health and Wellbeing Surcharge?">
                No. The Mental Health and Wellbeing Surcharge is paid exclusively by employers whose national payroll exceeds $10 million. It does not reduce your personal salary or affect your take-home pay calculation.
              </FAQItem>
              <FAQItem value="average" question="What is the average take-home pay in Victoria after tax?">
                A Victorian worker earning the average salary of $93,250 takes home approximately $72,700 per year after income tax and Medicare levy. This equates to roughly $1,398 per week or $6,058 per month in net pay after tax.
              </FAQItem>
              <FAQItem value="super" question="How much superannuation does my Victorian employer contribute?">
                Every employer in Australia, including those in Victoria, contributes 12% of your ordinary time earnings to your super fund for FY2025-26. On a $92,000 salary, this equals $11,040 per year paid on top of your gross salary. The maximum super contribution base is $65,070 per quarter.
              </FAQItem>
              <FAQItem value="melb-vs-syd" question="Is it better to earn $100,000 in Melbourne or Sydney?">
                A $100,000 salary produces the same take-home pay of approximately $75,988 in both cities because federal income tax is identical nationwide. Melbourne offers 8-12% lower living costs, particularly in rent and transport, resulting in greater disposable income than the same salary in Sydney.
              </FAQItem>
              <FAQItem value="regional" question="Do regional Victorian workers pay less tax?">
                No. Regional Victorian workers pay exactly the same federal income tax as Melbourne workers. Regional employers benefit from a reduced payroll tax rate of 1.2125% (compared to {formatPercent(STATE_PAYROLL_TAX.VIC.rate, 2)} in metro areas), but this employer saving does not affect employee tax deductions or net pay.
              </FAQItem>
              <FAQItem value="hecs" question="How does HECS-HELP affect my VIC take-home pay?">
                HECS-HELP repayments are a federal obligation applied identically across all states. Repayments commence when your income exceeds $69,528 per year. At the VIC average salary of $93,250, the HECS repayment rate is 7.0%, which means $6,528 per year is withheld in addition to income tax and Medicare levy.
              </FAQItem>
            </Accordion>
          </section>

          <MethodologyDisclosure>
            <p>Calculations use federal ATO individual income tax rates for FY2025-26. There are no state-specific individual income taxes in Australia. State payroll tax and WorkSafe data are sourced from the State Revenue Office Victoria and WorkSafe VIC, but these only outline employer obligations and do not affect employee net pay.</p>
          </MethodologyDisclosure>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
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

function FAQItem({ value, question, children }: { value: string; question: string; children: React.ReactNode }) {
  return (
    <AccordionItem value={value} className="rounded-xl border border-sandstone-dark/20 px-5">
      <AccordionTrigger className="text-left text-base font-medium text-navy">{question}</AccordionTrigger>
      <AccordionContent><p className="text-warmgray leading-relaxed">{children}</p></AccordionContent>
    </AccordionItem>
  );
}
