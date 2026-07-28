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
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Average Weekly Earnings (NSW)", url: "https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/average-weekly-earnings-australia", publisher: "Australian Bureau of Statistics" },
  { title: "NSW Payroll Tax", url: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/payroll-tax", publisher: "Revenue NSW" },
];

export default function PayCalculatorNSWPage() {
  const [salary, setSalary] = useState(90_000);
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
        <section className="bg-eucalyptus-light/40 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Pay Calculator NSW</span></li>
            </ol>
          </nav>
          <div className="flex items-center gap-3 mt-4 mb-3">
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl md:text-4xl font-bold text-navy">Pay Calculator NSW 2025-26</h1>
            <span className="bg-eucalyptus-dark text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">NSW</span>
          </div>
          <p className="text-lg text-warmgray">Calculate your exact take-home pay in New South Wales. Understand federal tax rates, local payroll taxes, and the average salary in Sydney and regional NSW.</p>
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
                        <span className="text-2xl font-extrabold text-eucalyptus-dark">{formatAUD(result.takeHomePay)}</span>
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

          {/* H2: How Does the NSW Pay Calculator Work? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Does the NSW Pay Calculator Work?</h2>
            <p className="text-warmgray mb-4">The NSW pay calculator converts your gross annual salary into after-tax income by applying FY2025-26 federal income tax brackets, the <strong>2%</strong> Medicare levy, and any applicable HECS-HELP repayments.</p>
            <p className="text-warmgray mb-4">Personal income tax in Australia is a federal responsibility managed by the Australian Taxation Office. Whether you work in Sydney, Newcastle, or Wollongong, the <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">income tax brackets</Link> are identical to those in Victoria, Queensland, or any other state. This Australian tax calculator applies those uniform rates automatically.</p>
            <p className="text-warmgray mb-4">The calculator follows a 4-step process to determine your take-home pay:</p>
            <ol className="list-decimal list-inside text-warmgray space-y-2 mb-4">
              <li>Apply FY2025-26 marginal tax rates to your assessable income</li>
              <li>Subtract the Medicare levy (and "Medicare Levy Surcharge" if no private health cover for incomes above <strong>$93,000</strong>)</li>
              <li>Deduct any HECS-HELP repayment based on your repayment income threshold</li>
              <li>Calculate employer superannuation at the SG rate of <strong>12%</strong> on top of your gross salary</li>
            </ol>
            <p className="text-warmgray">Your net pay after tax is then displayed as annual, monthly, fortnightly, and weekly amounts. Use the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to model voluntary concessional contributions that reduce your taxable income further.</p>
            <p className="text-warmgray mt-4">Most NSW employees are covered by federal modern awards set by the Fair Work Commission, which dictate the legal minimum hourly rate before income tax applies. Find your industry-specific minimum pay in our <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">Australian award rates guide</Link> — the same rates apply across NSW, VIC, QLD and every other state, with limited carve-outs only for state public-sector employees.</p>
          </section>

          {/* H2: What Is the Average Salary in New South Wales? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is the Average Salary in New South Wales?</h2>
            <p className="text-warmgray mb-4">The average full-time salary in New South Wales is <strong>$95,337 per year</strong>, the highest of any Australian state and approximately 4% above the national average of $91,600.</p>
            <div className="bg-sandstone rounded-xl border border-sandstone-dark/20 p-6 flex flex-col sm:flex-row gap-6 items-center mb-6">
              <div className="text-center sm:w-1/3">
                <div className="text-3xl font-bold text-navy mb-1">$95,337</div>
                <div className="text-sm text-warmgray-light uppercase tracking-widest font-semibold">Average Annual</div>
              </div>
              <div className="text-warmgray text-sm sm:w-2/3">
                <p className="mb-2">Full-time adult ordinary time earnings in NSW average <strong>$1,833.40 per week</strong>. Sydney metro salaries exceed this average by 8-12%, while regional NSW salaries sit 10-15% below it.</p>
                <p className="text-xs text-warmgray-light italic">*Based on ABS Average Weekly Earnings data. Wages vary between Sydney metro and regional NSW.</p>
              </div>
            </div>

            {/* H3: Average Salary by Industry */}
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">Average Salary by Industry in NSW</h3>
            <p className="text-warmgray mb-4">Salaries across NSW vary dramatically by sector. Mining and financial services lead the state, while hospitality and retail sit at the lower end. The table below shows average full-time annual earnings for 8 major industries in New South Wales.</p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-sandstone-dark/20 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-sandstone text-navy">
                    <th className="text-left px-4 py-3 font-semibold">Industry</th>
                    <th className="text-right px-4 py-3 font-semibold">Avg. Salary (NSW)</th>
                    <th className="text-right px-4 py-3 font-semibold">vs National Avg.</th>
                  </tr>
                </thead>
                <tbody className="text-warmgray">
                  <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2.5">Mining &amp; Resources</td><td className="text-right px-4 py-2.5 font-medium text-navy">$139,000</td><td className="text-right px-4 py-2.5">+5%</td></tr>
                  <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2.5">Financial &amp; Insurance Services</td><td className="text-right px-4 py-2.5 font-medium text-navy">$125,000</td><td className="text-right px-4 py-2.5">+8%</td></tr>
                  <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2.5">Professional &amp; Technical Services</td><td className="text-right px-4 py-2.5 font-medium text-navy">$112,000</td><td className="text-right px-4 py-2.5">+4%</td></tr>
                  <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2.5">Information Technology</td><td className="text-right px-4 py-2.5 font-medium text-navy">$108,000</td><td className="text-right px-4 py-2.5">+6%</td></tr>
                  <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2.5">Construction</td><td className="text-right px-4 py-2.5 font-medium text-navy">$95,000</td><td className="text-right px-4 py-2.5">+3%</td></tr>
                  <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2.5">Healthcare &amp; Social Assistance</td><td className="text-right px-4 py-2.5 font-medium text-navy">$88,000</td><td className="text-right px-4 py-2.5">+2%</td></tr>
                  <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2.5">Education &amp; Training</td><td className="text-right px-4 py-2.5 font-medium text-navy">$84,000</td><td className="text-right px-4 py-2.5">+1%</td></tr>
                  <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2.5">Retail &amp; Hospitality</td><td className="text-right px-4 py-2.5 font-medium text-navy">$58,000</td><td className="text-right px-4 py-2.5">+2%</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray text-sm">Use the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> to see exactly how much after-tax income your industry salary delivers each fortnight.</p>
          </section>

          {/* H2: How Much Tax Do You Pay in NSW? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Much Tax Do You Pay in NSW?</h2>
            <p className="text-warmgray mb-4">A NSW resident earning <strong>$95,000</strong> pays <strong>$22,967</strong> in income tax for FY2025-26, resulting in an effective tax rate of <strong>24.2%</strong> and take-home pay of approximately <strong>$70,133</strong> per year.</p>
            <p className="text-warmgray mb-4">The FY2025-26 income tax brackets for Australian residents apply identically in NSW as in every other state and territory. Below is the full worked example at $95,000 gross salary.</p>

            <div className="bg-sandstone rounded-xl border border-sandstone-dark/20 p-6 mb-4">
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-lg font-semibold text-navy mb-3">Worked Example: $95,000 Salary in NSW</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-navy">
                      <th className="text-left py-2 font-semibold">Component</th>
                      <th className="text-right py-2 font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-warmgray">
                    <tr className="border-t border-sandstone-dark/10"><td className="py-2">Gross Salary</td><td className="text-right py-2 font-medium text-navy">$95,000</td></tr>
                    <tr className="border-t border-sandstone-dark/10"><td className="py-2">Income Tax (Federal)</td><td className="text-right py-2">-$22,967</td></tr>
                    <tr className="border-t border-sandstone-dark/10"><td className="py-2">Medicare Levy (2%)</td><td className="text-right py-2">-$1,900</td></tr>
                    <tr className="border-t border-sandstone-dark/10"><td className="py-2">LITO Offset</td><td className="text-right py-2">+$0</td></tr>
                    <tr className="border-t border-sandstone-dark/20 font-semibold text-navy"><td className="py-2">Take-Home Pay</td><td className="text-right py-2">$70,133</td></tr>
                    <tr className="border-t border-sandstone-dark/10"><td className="py-2">Superannuation (12%)</td><td className="text-right py-2">+$11,400</td></tr>
                    <tr className="border-t border-sandstone-dark/10 font-semibold text-navy"><td className="py-2">Total Package</td><td className="text-right py-2">$106,400</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-warmgray mb-2">At $95,000, the marginal tax rate is <strong>32.5 cents per dollar</strong> on income between $45,001 and $120,000. The "Low Income Tax Offset" phases out completely at $66,668, so earners at this level receive no LITO benefit. Read the full <Link href="/low-income-tax-offset/" className="text-eucalyptus-dark hover:underline">Low Income Tax Offset</Link> guide for phase-out thresholds.</p>
            <p className="text-warmgray">Employees with a HECS-HELP debt at this income level repay an additional <strong>$6,650</strong> per year (7% of repayment income). The employer superannuation guarantee of 12% adds <strong>$11,400</strong> on top of the gross salary as a concessional contribution to the employee&apos;s super fund.</p>
          </section>

          {/* H2: What Is NSW Payroll Tax? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is NSW Payroll Tax?</h2>
            <p className="text-warmgray mb-4">NSW payroll tax is a state tax that employers pay at a rate of <strong>5.45%</strong> on total annual wages exceeding the <strong>$1,200,000</strong> threshold, administered by Revenue NSW.</p>
            <p className="text-warmgray mb-4">Payroll tax is strictly an employer cost. It does not reduce employee take-home pay or appear on payslips. Employers with wage bills below the $1,200,000 annual threshold pay no payroll tax at all, which exempts most small businesses. The tax applies to wages, superannuation contributions, fringe benefits, and contractor payments in many cases.</p>

            {/* H3: NSW vs Other States Comparison */}
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">How Does NSW Payroll Tax Compare to Other States?</h3>
            <p className="text-warmgray mb-4">NSW has a mid-range payroll tax rate compared to other Australian states and territories. Queensland and Western Australia offer higher thresholds, while the ACT has the highest headline rate.</p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-sandstone-dark/20 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-sandstone text-navy">
                    <th className="text-left px-4 py-3 font-semibold">State / Territory</th>
                    <th className="text-right px-4 py-3 font-semibold">Rate</th>
                    <th className="text-right px-4 py-3 font-semibold">Annual Threshold</th>
                  </tr>
                </thead>
                <tbody className="text-warmgray">
                  <tr className="border-t border-sandstone-dark/10 bg-eucalyptus-light/20 font-medium"><td className="px-4 py-2.5 text-navy">New South Wales</td><td className="text-right px-4 py-2.5">5.45%</td><td className="text-right px-4 py-2.5">$1,200,000</td></tr>
                  <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2.5">Victoria</td><td className="text-right px-4 py-2.5">4.85%</td><td className="text-right px-4 py-2.5">$900,000</td></tr>
                  <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2.5">Queensland</td><td className="text-right px-4 py-2.5">4.75%</td><td className="text-right px-4 py-2.5">$1,300,000</td></tr>
                  <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2.5">Western Australia</td><td className="text-right px-4 py-2.5">5.50%</td><td className="text-right px-4 py-2.5">$1,000,000</td></tr>
                  <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2.5">South Australia</td><td className="text-right px-4 py-2.5">4.95%</td><td className="text-right px-4 py-2.5">$1,500,000</td></tr>
                  <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2.5">Tasmania</td><td className="text-right px-4 py-2.5">4.00%</td><td className="text-right px-4 py-2.5">$1,250,000</td></tr>
                  <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2.5">ACT</td><td className="text-right px-4 py-2.5">6.85%</td><td className="text-right px-4 py-2.5">$2,000,000</td></tr>
                  <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2.5">Northern Territory</td><td className="text-right px-4 py-2.5">5.50%</td><td className="text-right px-4 py-2.5">$1,500,000</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">Employers expanding into NSW from Victoria face a higher threshold ($1,200,000 vs $900,000) but a higher rate (5.45% vs 4.85%). Use the <Link href="/employer-cost-calculator/" className="text-eucalyptus-dark hover:underline">Employer Cost Calculator</Link> to model total employment costs including payroll tax, superannuation, and workers compensation premiums.</p>
          </section>

          {/* --- CONTEXT BORDER --- */}

          {/* H2: What Is the Cost of Living in Sydney? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is the Cost of Living in Sydney?</h2>
            <p className="text-warmgray mb-4">Sydney is Australia&apos;s most expensive city, with median weekly rent for a 2-bedroom apartment at <strong>$680</strong> and average monthly household expenses totalling approximately <strong>$4,800</strong> excluding rent.</p>
            <p className="text-warmgray mb-4">Higher salaries in NSW partially offset these costs, but the gap narrows for middle-income earners. A worker earning $95,000 takes home roughly <strong>$1,349 per week</strong> after tax, leaving approximately $669 per week after rent for a median 2-bedroom apartment. Transport, groceries, and utilities consume a further $500-600 per week for a typical household.</p>

            {/* H3: Sydney vs Melbourne Comparison */}
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">Sydney vs Melbourne Cost Comparison</h3>
            <p className="text-warmgray mb-4">Sydney costs approximately <strong>12-15% more</strong> than Melbourne across most major expense categories. The gap is widest in housing and narrowest in groceries.</p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border border-sandstone-dark/20 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-sandstone text-navy">
                    <th className="text-left px-4 py-3 font-semibold">Expense Category</th>
                    <th className="text-right px-4 py-3 font-semibold">Sydney (weekly)</th>
                    <th className="text-right px-4 py-3 font-semibold">Melbourne (weekly)</th>
                    <th className="text-right px-4 py-3 font-semibold">Difference</th>
                  </tr>
                </thead>
                <tbody className="text-warmgray">
                  <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2.5">Rent (2-bed apartment)</td><td className="text-right px-4 py-2.5 font-medium text-navy">$680</td><td className="text-right px-4 py-2.5">$520</td><td className="text-right px-4 py-2.5">+31%</td></tr>
                  <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2.5">Groceries</td><td className="text-right px-4 py-2.5 font-medium text-navy">$210</td><td className="text-right px-4 py-2.5">$195</td><td className="text-right px-4 py-2.5">+8%</td></tr>
                  <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2.5">Transport (public)</td><td className="text-right px-4 py-2.5 font-medium text-navy">$63</td><td className="text-right px-4 py-2.5">$50</td><td className="text-right px-4 py-2.5">+26%</td></tr>
                  <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2.5">Utilities</td><td className="text-right px-4 py-2.5 font-medium text-navy">$75</td><td className="text-right px-4 py-2.5">$70</td><td className="text-right px-4 py-2.5">+7%</td></tr>
                  <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2.5">Childcare (daily)</td><td className="text-right px-4 py-2.5 font-medium text-navy">$140</td><td className="text-right px-4 py-2.5">$125</td><td className="text-right px-4 py-2.5">+12%</td></tr>
                </tbody>
              </table>
            </div>

            {/* H3: Regional NSW */}
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">What About Regional NSW?</h3>
            <p className="text-warmgray mb-4">Regional NSW cities including Newcastle, Wollongong, and Coffs Harbour offer living costs <strong>25-40% lower</strong> than Sydney, particularly in housing. Median weekly rent for a 2-bedroom apartment in Newcastle is <strong>$450</strong>, compared to $680 in Sydney.</p>
            <p className="text-warmgray">Average salaries in regional NSW are <strong>10-15% below</strong> the Sydney metro average, but the lower cost of living often results in higher disposable salary. Workers in regional areas eligible for the <Link href="/zone-tax-offset/" className="text-eucalyptus-dark hover:underline">Zone Tax Offset</Link> receive an additional tax reduction of up to $338 per year in designated remote areas.</p>
          </section>

          {/* H2: Who Are the Major Employers in NSW? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Who Are the Major Employers in NSW?</h2>
            <p className="text-warmgray mb-4">The NSW Government is the single largest employer in New South Wales, with over <strong>400,000 employees</strong> across health, education, transport, and public administration.</p>
            <p className="text-warmgray mb-4">NSW&apos;s economy is the largest in Australia, contributing approximately <strong>$690 billion</strong> (33% of national GDP). The state hosts headquarters for 3 of Australia&apos;s 4 major banks (Commonwealth Bank, Westpac, and ANZ), the Australian Securities Exchange, and the majority of Australia&apos;s top-100 listed companies.</p>
            <ul className="list-disc list-inside text-warmgray space-y-2 mb-4">
              <li><strong>NSW Health</strong> — over 170,000 employees across 230 public hospitals and health facilities</li>
              <li><strong>NSW Department of Education</strong> — approximately 95,000 teachers and support staff</li>
              <li><strong>Commonwealth Bank of Australia</strong> — headquartered in Sydney with 42,000 employees nationally</li>
              <li><strong>Woolworths Group</strong> — head office in Bella Vista, employing over 190,000 staff Australia-wide</li>
              <li><strong>Westpac Banking Corporation</strong> — Sydney-based with approximately 32,000 employees</li>
              <li><strong>Telstra</strong> — major Sydney operations centre with over 28,000 national employees</li>
              <li><strong>University of Sydney &amp; UNSW</strong> — each employing over 10,000 academic and professional staff</li>
            </ul>
            <p className="text-warmgray">The construction sector employs over <strong>380,000 workers</strong> in NSW, driven by major infrastructure projects including Western Sydney Airport, Sydney Metro, and WestConnex. Many construction roles pay above-<Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">award rates</Link>, with overtime and penalty rates significantly increasing take-home pay.</p>
          </section>

          {/* H2: What State-Specific Benefits Apply in NSW? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What State-Specific Benefits Apply in NSW?</h2>
            <p className="text-warmgray mb-4">NSW offers several state-specific financial benefits including a first home buyer stamp duty exemption for properties up to <strong>$800,000</strong> and a seniors energy rebate of <strong>$200 per year</strong>.</p>
            <p className="text-warmgray mb-4">These benefits are administered by the NSW Government and operate independently of the federal tax system. They do not affect income tax calculations or take-home pay directly but reduce household expenses for eligible residents.</p>
            <ul className="list-disc list-inside text-warmgray space-y-2 mb-4">
              <li><strong>First Home Buyer Assistance Scheme</strong> — full stamp duty exemption on properties up to $800,000 and concessional rates for properties between $800,001 and $1,000,000</li>
              <li><strong>First Home Owner Grant (New Home)</strong> — a one-off payment of <strong>$10,000</strong> for newly built homes valued up to $600,000</li>
              <li><strong>Seniors Energy Rebate</strong> — <strong>$200 per year</strong> for eligible pensioners and self-funded retirees holding a Commonwealth Seniors Health Card</li>
              <li><strong>Active Kids Voucher</strong> — <strong>$100 voucher</strong> per school-enrolled child per year for sport and fitness activities</li>
              <li><strong>Creative Kids Voucher</strong> — <strong>$100 voucher</strong> per school-enrolled child per year for creative and cultural activities</li>
              <li><strong>Toll Relief Program</strong> — cashback of up to <strong>$750 per year</strong> for drivers spending more than $375 in tolls per quarter</li>
            </ul>
            <p className="text-warmgray">Workers considering salary sacrifice arrangements to reduce taxable income in NSW face the same federal rules as other states. The <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> models the tax savings from pre-tax super contributions and novated lease arrangements.</p>
          </section>

          {/* H2: Frequently Asked Questions */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <FAQItem value="federal" question="Is income tax different in NSW compared to other states?">
                No. Income tax in Australia is levied by the federal government through the ATO. The tax brackets, Medicare levy, and HECS-HELP repayment rates are exactly the same in NSW as they are in Victoria, Queensland, Western Australia, or any other state and territory. There is no state-level income tax anywhere in Australia.
              </FAQItem>
              <FAQItem value="payroll" question="What is the payroll tax threshold in NSW for FY2025-26?">
                The NSW payroll tax threshold is <strong>$1,200,000</strong> per year. Employers pay payroll tax at <strong>5.45%</strong> only on total wages exceeding this threshold. A business with an annual wage bill of $1,500,000 pays 5.45% on the $300,000 above the threshold, equalling <strong>$16,350</strong> in payroll tax. Small businesses with wage bills below $1,200,000 pay no payroll tax.
              </FAQItem>
              <FAQItem value="employee" question="Do employees pay payroll tax or workers compensation premiums?">
                No. Both payroll tax and workers compensation (iCare in NSW) are employer expenses. These costs do not appear on your payslip and do not reduce your gross salary or take-home pay. Employers factor these on-costs into total hiring budgets, which indirectly influences salary offers.
              </FAQItem>
              <FAQItem value="average" question="What is the average salary in Sydney vs regional NSW?">
                The average full-time salary in Sydney metro is approximately <strong>$102,000</strong> per year, while regional NSW averages closer to <strong>$82,000</strong>. The <strong>$20,000 gap</strong> reflects higher concentration of financial services, technology, and professional services roles in the Sydney CBD, North Sydney, and Parramatta.
              </FAQItem>
              <FAQItem value="super" question="How much superannuation does my NSW employer pay?">
                Every Australian employer pays superannuation at the SG rate of <strong>12%</strong> for FY2025-26, regardless of state. On a $95,000 salary, your employer contributes <strong>$11,400</strong> per year into your super fund. This is paid on top of your gross salary and does not reduce your take-home pay. The maximum super contribution base is <strong>$65,070 per quarter</strong> ($260,280 per year).
              </FAQItem>
              <FAQItem value="medicare" question="Do I pay the Medicare Levy Surcharge in NSW?">
                The Medicare levy surcharge applies identically across all states. Singles earning above <strong>$93,000</strong> who do not hold private hospital cover pay a surcharge of <strong>1% to 1.5%</strong> on top of the standard 2% Medicare levy. At $95,000 without private health insurance, the surcharge is <strong>1%</strong>, costing an additional <strong>$950 per year</strong>. Holding private health cover eliminates the surcharge entirely.
              </FAQItem>
              <FAQItem value="hecs" question="How are HECS-HELP repayments calculated in NSW?">
                HECS-HELP repayments are a federal obligation calculated on repayment income, not state of residence. The compulsory repayment threshold for FY2026-27 starts at <strong>$69,528</strong>. At a salary of $95,000, the repayment rate is <strong>7%</strong>, resulting in an annual repayment of <strong>$6,650</strong> deducted through PAYG withholding.
              </FAQItem>
              <FAQItem value="cost" question="Is it cheaper to live in Newcastle or Wollongong than Sydney?">
                Yes. Newcastle and Wollongong offer living costs <strong>25-35% lower</strong> than Sydney, with the largest savings in housing. Median weekly rent for a 2-bedroom apartment is <strong>$450 in Newcastle</strong> and <strong>$430 in Wollongong</strong>, compared to <strong>$680 in Sydney</strong>. Average salaries in these cities are 10-15% below Sydney levels, but the net disposable income after housing is often higher.
              </FAQItem>
            </Accordion>
          </section>

          <MethodologyDisclosure>
            <p>Calculations use federal ATO individual income tax rates for FY2025-26 Australian residents. There are no state-specific individual income taxes in Australia. State payroll tax and workers compensation data are sourced from Revenue NSW and iCare, but these only affect employers, not employee net pay. Average salary data is sourced from ABS Average Weekly Earnings publications. Cost of living estimates are based on publicly available data from the ABS Consumer Price Index and rental market reports.</p>
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
