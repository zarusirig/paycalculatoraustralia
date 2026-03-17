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
  { title: "Average Weekly Earnings (QLD)", url: "https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/average-weekly-earnings-australia", publisher: "Australian Bureau of Statistics" },
  { title: "QLD Payroll Tax", url: "https://qro.qld.gov.au/payroll-tax/", publisher: "Queensland Revenue Office" },
];

export default function PayCalculatorQLDPage() {
  const [salary, setSalary] = useState(85_000);
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
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Pay Calculator QLD</span></li>
            </ol>
          </nav>
          <div className="flex items-center gap-3 mt-4 mb-3">
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl md:text-4xl font-bold text-navy">Pay Calculator QLD 2025-26</h1>
            <span className="bg-eucalyptus-dark text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">QLD</span>
          </div>
          <p className="text-lg text-warmgray">Calculate your exact take-home pay in Queensland. Understand federal tax rates, local payroll taxes, and the average salary in Brisbane and regional QLD.</p>
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
                        <span className="text-2xl font-extrabold text-ochre">{formatAUD(result.takeHomePay)}</span>
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

          {/* H2: How Does the QLD Pay Calculator Work? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Does the QLD Pay Calculator Work?</h2>
            <p className="text-warmgray mb-4">This Australian tax calculator converts your gross Queensland salary into after-tax income by applying FY2025-26 federal income tax brackets, Medicare levy, and optional HECS-HELP repayments.</p>
            <p className="text-warmgray mb-4">Enter your gross annual salary, indicate whether you carry a HECS-HELP debt, and confirm your private health insurance status. The calculator deducts federal income tax using the current marginal rates, subtracts the <strong>2%</strong> Medicare levy, applies the Low Income Tax Offset where eligible, and returns your take-home pay as an annual, monthly, fortnightly, and weekly figure.</p>
            <p className="text-warmgray mb-4">Personal income tax is a federal responsibility administered by the ATO. Whether you work in Brisbane, the Gold Coast, Townsville, or Cairns, the <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">income tax brackets</Link> are identical across every state and territory. Queensland does not impose a separate state income tax on individuals.</p>
            <p className="text-warmgray mb-4">Superannuation is calculated at the current SG rate of <strong>12%</strong> on top of your gross salary. Use our <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to model employer contributions, salary sacrifice, and concessional contribution caps for the 2025-26 financial year.</p>
          </section>

          {/* H2: What Is the Average Salary in Queensland? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is the Average Salary in Queensland?</h2>
            <p className="text-warmgray mb-4">The average full-time salary in Queensland is <strong>$91,374 per year</strong>, based on ABS average weekly ordinary time earnings of $1,757.20.</p>
            <p className="text-warmgray mb-4">Queensland ranks as Australia&apos;s third-largest state economy. Strong demand in mining, construction, and healthcare pushes wages in regional hubs including Mackay, Gladstone, and Mount Isa above the Brisbane metro average. The national full-time average sits at approximately <strong>$98,218 per year</strong>, placing Queensland earnings roughly <strong>7% below</strong> the national figure. Workers in south-east Queensland typically earn higher salaries than those in Far North Queensland or the Darling Downs, reflecting the concentration of corporate and government roles in Brisbane.</p>

            {/* H3: Average Salary by Industry */}
            <h3 className="text-xl font-semibold text-navy mt-8 mb-4">Average Salary by Industry in Queensland</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border-sandstone-dark/20 rounded-xl overflow-hidden">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-navy">Industry</th>
                    <th className="px-4 py-3 font-semibold text-navy text-right">Avg. Annual Salary</th>
                    <th className="px-4 py-3 font-semibold text-navy text-right">vs QLD Average</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className="px-4 py-3 text-warmgray">Mining &amp; Resources</td><td className="px-4 py-3 text-navy font-medium text-right">$139,000</td><td className="px-4 py-3 text-emerald-600 text-right">+52%</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">Construction</td><td className="px-4 py-3 text-navy font-medium text-right">$102,000</td><td className="px-4 py-3 text-emerald-600 text-right">+12%</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">Professional &amp; Technical Services</td><td className="px-4 py-3 text-navy font-medium text-right">$105,000</td><td className="px-4 py-3 text-emerald-600 text-right">+15%</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">Healthcare &amp; Social Assistance</td><td className="px-4 py-3 text-navy font-medium text-right">$88,000</td><td className="px-4 py-3 text-red-500 text-right">-4%</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">Education &amp; Training</td><td className="px-4 py-3 text-navy font-medium text-right">$92,000</td><td className="px-4 py-3 text-emerald-600 text-right">+1%</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">Public Administration</td><td className="px-4 py-3 text-navy font-medium text-right">$96,000</td><td className="px-4 py-3 text-emerald-600 text-right">+5%</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">Retail Trade</td><td className="px-4 py-3 text-navy font-medium text-right">$58,000</td><td className="px-4 py-3 text-red-500 text-right">-37%</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">Accommodation &amp; Food Services</td><td className="px-4 py-3 text-navy font-medium text-right">$52,000</td><td className="px-4 py-3 text-red-500 text-right">-43%</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray text-sm mt-3">Mining remains the highest-paying sector in Queensland, driven by coal, gas, and critical minerals operations in the Bowen Basin, Surat Basin, and North West Minerals Province. To see how these salaries translate into net pay after tax, enter any figure into the calculator above or visit our <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link>.</p>
          </section>

          {/* H2: How Much Tax Do You Pay in Queensland? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Much Tax Do You Pay in Queensland?</h2>
            <p className="text-warmgray mb-4">A Queensland employee earning <strong>$88,000</strong> per year pays <strong>$18,067</strong> in federal income tax, <strong>$1,760</strong> in Medicare levy, and takes home <strong>$68,173</strong> after all deductions for FY2025-26.</p>
            <p className="text-warmgray mb-4">The calculation follows the ATO&apos;s resident individual income tax brackets. At $88,000 gross, the marginal tax rate on the last dollar earned is <strong>32.5%</strong>. The effective tax rate across the entire salary is <strong>20.5%</strong>. The Medicare levy adds a flat <strong>2%</strong> on assessable income. No &quot;Medicare Levy Surcharge&quot; applies if the employee holds private hospital cover.</p>

            <div className="bg-sandstone rounded-xl border border-sandstone-dark/20 p-6 mb-4">
              <h3 className="text-lg font-semibold text-navy mb-3">Worked Example: $88,000 Gross Salary in QLD</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-warmgray">Gross salary</span><span className="font-medium text-navy">$88,000</span></div>
                <div className="flex justify-between"><span className="text-warmgray">Income tax (federal)</span><span className="font-medium text-navy">-$18,067</span></div>
                <div className="flex justify-between"><span className="text-warmgray">LITO offset</span><span className="font-medium text-navy">+$0</span></div>
                <div className="flex justify-between"><span className="text-warmgray">Medicare levy (2%)</span><span className="font-medium text-navy">-$1,760</span></div>
                <div className="border-t border-sandstone-dark/20 pt-2 flex justify-between"><span className="font-bold text-navy">Take-home pay</span><span className="font-bold text-ochre">$68,173</span></div>
                <div className="border-t border-sandstone-dark/20 pt-2 flex justify-between"><span className="text-warmgray">Superannuation (12%)</span><span className="font-medium text-navy">+$10,560</span></div>
                <div className="flex justify-between"><span className="font-semibold text-navy">Total package</span><span className="font-semibold text-navy">$98,560</span></div>
              </div>
            </div>
            <p className="text-warmgray mb-4">The Low Income Tax Offset phases out entirely at <strong>$66,667</strong>, so it provides no reduction at the $88,000 level. Workers with a HECS-HELP debt at this income repay at a rate of <strong>4.5%</strong>, adding $3,960 in annual repayments. Check your exact obligation using our <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link>.</p>
          </section>

          {/* H2: What Is QLD Payroll Tax? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is QLD Payroll Tax?</h2>
            <p className="text-warmgray mb-4">Queensland payroll tax is a state tax paid by employers on total Australian taxable wages exceeding <strong>$1,300,000 per year</strong>, at a base rate of <strong>4.75%</strong>.</p>
            <p className="text-warmgray mb-4">The Queensland Revenue Office (QRO) administers payroll tax. Employers with an annual wage bill above $1.3 million pay <strong>4.75%</strong> on the amount exceeding the threshold. A higher rate of <strong>4.95%</strong> applies where total wages exceed <strong>$6.5 million</strong>. A mental health levy of <strong>0.25%</strong> applies to employers with wages above $10 million, increasing to <strong>0.5%</strong> above $100 million. Employees do not pay payroll tax. It does not reduce your gross salary or affect your take-home pay calculation.</p>

            {/* H3: QLD vs Other States Payroll Tax */}
            <h3 className="text-xl font-semibold text-navy mt-8 mb-4">How Does QLD Payroll Tax Compare to Other States?</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border-sandstone-dark/20 rounded-xl overflow-hidden">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-navy">State / Territory</th>
                    <th className="px-4 py-3 font-semibold text-navy text-right">Annual Threshold</th>
                    <th className="px-4 py-3 font-semibold text-navy text-right">Base Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="bg-eucalyptus/5"><td className="px-4 py-3 text-navy font-medium">Queensland</td><td className="px-4 py-3 text-navy text-right">$1,300,000</td><td className="px-4 py-3 text-navy text-right">4.75%</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">New South Wales</td><td className="px-4 py-3 text-navy text-right">$1,200,000</td><td className="px-4 py-3 text-navy text-right">5.45%</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">Victoria</td><td className="px-4 py-3 text-navy text-right">$900,000</td><td className="px-4 py-3 text-navy text-right">4.85%</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">Western Australia</td><td className="px-4 py-3 text-navy text-right">$1,000,000</td><td className="px-4 py-3 text-navy text-right">5.50%</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">South Australia</td><td className="px-4 py-3 text-navy text-right">$1,500,000</td><td className="px-4 py-3 text-navy text-right">4.95%</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">Tasmania</td><td className="px-4 py-3 text-navy text-right">$1,250,000</td><td className="px-4 py-3 text-navy text-right">4.00%</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">ACT</td><td className="px-4 py-3 text-navy text-right">$2,000,000</td><td className="px-4 py-3 text-navy text-right">6.85%</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">Northern Territory</td><td className="px-4 py-3 text-navy text-right">$1,500,000</td><td className="px-4 py-3 text-navy text-right">5.50%</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray text-sm mt-3">Queensland&apos;s $1.3 million threshold and 4.75% base rate position it as a competitive state for employers. Compared to <Link href="/pay-calculator-nsw/" className="text-eucalyptus-dark hover:underline">Pay Calculator NSW</Link> (5.45%) and <Link href="/pay-calculator-vic/" className="text-eucalyptus-dark hover:underline">Pay Calculator VIC</Link> (4.85%), Queensland offers a lower base rate, which benefits small-to-medium enterprises with wage bills just above the threshold.</p>
          </section>

          {/* --- CONTEXT BORDER --- */}

          {/* H2: What Is the Cost of Living in Brisbane? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is the Cost of Living in Brisbane?</h2>
            <p className="text-warmgray mb-4">Brisbane&apos;s cost of living is approximately <strong>15-20% lower</strong> than Sydney&apos;s, with the largest savings in housing, where median rent is <strong>$580 per week</strong> compared to Sydney&apos;s <strong>$750</strong>.</p>
            <p className="text-warmgray mb-4">Queensland&apos;s capital offers a lower cost base across rent, transport, and utilities than Sydney and Melbourne. Combined with no state income tax on individuals, Brisbane employees retain a higher proportion of their after-tax income as disposable salary. The 2032 Brisbane Olympics is driving infrastructure investment, which has increased property prices in inner-city suburbs including South Brisbane, Woolloongabba, and Kangaroo Point.</p>

            {/* H3: Brisbane vs Sydney Cost Comparison */}
            <h3 className="text-xl font-semibold text-navy mt-8 mb-4">Brisbane vs Sydney: Cost Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border-sandstone-dark/20 rounded-xl overflow-hidden">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-navy">Expense Category</th>
                    <th className="px-4 py-3 font-semibold text-navy text-right">Brisbane</th>
                    <th className="px-4 py-3 font-semibold text-navy text-right">Sydney</th>
                    <th className="px-4 py-3 font-semibold text-navy text-right">Difference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className="px-4 py-3 text-warmgray">Median weekly rent (2-bed unit)</td><td className="px-4 py-3 text-navy text-right">$580</td><td className="px-4 py-3 text-navy text-right">$750</td><td className="px-4 py-3 text-emerald-600 text-right">-23%</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">Monthly groceries (single person)</td><td className="px-4 py-3 text-navy text-right">$420</td><td className="px-4 py-3 text-navy text-right">$470</td><td className="px-4 py-3 text-emerald-600 text-right">-11%</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">Monthly public transport</td><td className="px-4 py-3 text-navy text-right">$150</td><td className="px-4 py-3 text-navy text-right">$200</td><td className="px-4 py-3 text-emerald-600 text-right">-25%</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">Quarterly utilities (electricity + gas)</td><td className="px-4 py-3 text-navy text-right">$520</td><td className="px-4 py-3 text-navy text-right">$480</td><td className="px-4 py-3 text-red-500 text-right">+8%</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">Childcare (daily, long day care)</td><td className="px-4 py-3 text-navy text-right">$115</td><td className="px-4 py-3 text-navy text-right">$140</td><td className="px-4 py-3 text-emerald-600 text-right">-18%</td></tr>
                </tbody>
              </table>
            </div>

            {/* H3: Regional QLD */}
            <h3 className="text-xl font-semibold text-navy mt-8 mb-4">Cost of Living in Regional Queensland</h3>
            <p className="text-warmgray mb-4">Regional Queensland cities including Townsville, Cairns, and Rockhampton offer median rents of <strong>$400-$480 per week</strong> for a two-bedroom unit, approximately <strong>20-30% below</strong> Brisbane levels. Groceries and fuel cost slightly more due to freight distances, adding roughly <strong>$30-$50 per week</strong> to household budgets in remote areas. Mining towns such as Moranbah and Emerald have rental markets heavily influenced by resource sector demand, with median rents fluctuating between <strong>$350 and $650</strong> depending on commodity cycles.</p>
          </section>

          {/* H2: Who Are the Major Employers in Queensland? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Who Are the Major Employers in Queensland?</h2>
            <p className="text-warmgray mb-4">The Queensland Government is the state&apos;s largest single employer with over <strong>250,000 public sector employees</strong> across health, education, police, and infrastructure.</p>
            <p className="text-warmgray mb-4">Queensland&apos;s diverse economy supports employment across several major sectors. The top employers span resources, healthcare, retail, and tourism.</p>
            <ul className="list-disc pl-6 text-warmgray space-y-2 mb-4 text-sm">
              <li><strong>Queensland Health</strong> - approximately 105,000 employees across hospitals, community health, and aged care facilities statewide</li>
              <li><strong>Department of Education</strong> - over 80,000 teachers, support staff, and administrators across 1,259 state schools</li>
              <li><strong>BHP / BMA (Bowen Basin)</strong> - approximately 15,000 employees and contractors in metallurgical coal mining</li>
              <li><strong>Woolworths Group</strong> - over 35,000 retail and logistics employees across Queensland stores and distribution centres</li>
              <li><strong>Suncorp Group</strong> - Brisbane-headquartered insurer and banking group employing approximately 13,000 nationally</li>
              <li><strong>Virgin Australia</strong> - headquartered in Bowen Hills, Brisbane, employing approximately 7,000 staff</li>
              <li><strong>The Star Entertainment Group</strong> - operating The Star Gold Coast and Treasury Brisbane with approximately 8,000 employees</li>
              <li><strong>Aurizon</strong> - Australia&apos;s largest rail freight operator, headquartered in Brisbane, employing approximately 5,000 staff</li>
            </ul>
            <p className="text-warmgray">Tourism contributes <strong>$28 billion</strong> annually to the Queensland economy. The Gold Coast, Whitsundays, and Cairns/Great Barrier Reef region collectively employ over <strong>200,000 workers</strong> in accommodation, food services, and recreation. To understand how employer costs differ, visit our <Link href="/employer-cost-calculator/" className="text-eucalyptus-dark hover:underline">Employer Cost Calculator</Link>.</p>
          </section>

          {/* H2: What State-Specific Benefits Apply in QLD? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What State-Specific Benefits Apply in QLD?</h2>
            <p className="text-warmgray mb-4">Queensland workers in remote and regional areas can claim a federal &quot;Zone Tax Offset&quot; of up to <strong>$1,173 per year</strong> (Zone A) or <strong>$78 per year</strong> (Zone B), directly reducing their taxable income.</p>
            <p className="text-warmgray mb-4">The Zone Tax Offset applies to residents of designated remote areas. In Queensland, Zone A covers towns including Mount Isa, Longreach, and Normanton. Zone B covers a broader area including Mackay, Townsville, Cairns, and parts of the Darling Downs. Special area designations provide an additional <strong>$338</strong> on top of the base zone offset. Learn more about eligibility in our <Link href="/zone-tax-offset/" className="text-eucalyptus-dark hover:underline">Zone Tax Offset</Link> guide.</p>
            <p className="text-warmgray mb-4">Additional state-specific benefits for Queensland residents include:</p>
            <ul className="list-disc pl-6 text-warmgray space-y-2 mb-4 text-sm">
              <li><strong>First Home Owner Grant (FHOG):</strong> Queensland provides a <strong>$30,000</strong> grant for purchasing or building a new home valued at less than $750,000</li>
              <li><strong>Electricity rebate:</strong> The Queensland Government provides a <strong>$1,000</strong> cost-of-living rebate on electricity bills for eligible households in FY2025-26</li>
              <li><strong>Stamp duty concessions:</strong> First home buyers pay no stamp duty on properties valued up to <strong>$700,000</strong>, with a sliding scale up to $800,000</li>
              <li><strong>No land tax on principal residence:</strong> Queensland does not levy land tax on owner-occupied homes, regardless of value</li>
              <li><strong>WorkCover QLD:</strong> Employer-funded workplace injury insurance that provides income replacement at <strong>85%</strong> of normal weekly earnings for the first 26 weeks of incapacity</li>
            </ul>
            <p className="text-warmgray">The <Link href="/medicare-levy/" className="text-eucalyptus-dark hover:underline">Medicare levy</Link> rate of <strong>2%</strong> and Medicare Levy Surcharge thresholds apply uniformly across all states. Queensland does not add any state-level health levy on top of the federal Medicare levy.</p>
          </section>

          {/* H2: Frequently Asked Questions */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <FAQItem value="federal" question="Is income tax different in QLD compared to other states?">
                No. Income tax in Australia is levied by the federal government through the ATO. The income tax brackets, Medicare levy, and HECS-HELP repayment rates are identical in Queensland, New South Wales, Victoria, and every other state and territory for FY2025-26.
              </FAQItem>
              <FAQItem value="payroll" question="What is the payroll tax threshold in QLD?">
                The Queensland payroll tax threshold is <strong>$1,300,000</strong> per year. Employers pay 4.75% on taxable wages above this threshold, rising to 4.95% when total wages exceed $6.5 million. Small businesses with wage bills below $1.3 million pay no payroll tax.
              </FAQItem>
              <FAQItem value="employee" question="Do employees pay for WorkCover in QLD?">
                No. WorkCover Queensland insurance premiums are an employer-only expense. They do not reduce your gross salary and do not affect your take-home pay or net pay after tax.
              </FAQItem>
              <FAQItem value="average" question="What is the average salary in Brisbane vs regional QLD?">
                Brisbane full-time workers earn an average of approximately <strong>$95,000 per year</strong>. Regional Queensland averages range from $80,000 in Cairns and Townsville to over $120,000 in mining-heavy regions like the Bowen Basin and Mount Isa.
              </FAQItem>
              <FAQItem value="zone" question="Can I claim a zone tax offset if I live in regional QLD?">
                Yes. Residents of designated Zone A areas (Mount Isa, Longreach, Normanton) can claim up to <strong>$1,173 per year</strong>. Zone B residents (Mackay, Townsville, Cairns) can claim up to <strong>$78 per year</strong>. The offset is claimed through your annual tax return.
              </FAQItem>
              <FAQItem value="super" question="How much superannuation does my QLD employer pay?">
                The superannuation guarantee rate is <strong>12%</strong> for FY2025-26, regardless of state. Your employer pays this on top of your gross salary. The maximum super contribution base is <strong>$65,070 per quarter</strong>, capping employer obligations for very high earners.
              </FAQItem>
              <FAQItem value="hecs" question="How does HECS-HELP affect my QLD take-home pay?">
                HECS-HELP repayments are a federal obligation applied identically in all states. Repayments start at <strong>1%</strong> of your income once you earn above <strong>$54,435</strong> and increase progressively. At $88,000 gross, the repayment rate is <strong>4.5%</strong>, reducing take-home pay by $3,960 per year.
              </FAQItem>
              <FAQItem value="fhog" question="What is Queensland's First Home Owner Grant?">
                Queensland offers a <strong>$30,000</strong> First Home Owner Grant for purchasing or building a brand-new home valued at under $750,000. The grant applies to Australian citizens and permanent residents buying their first home. It is not taxable and does not affect your income tax calculation.
              </FAQItem>
            </Accordion>
          </section>

          <MethodologyDisclosure>
            <p>Calculations use federal ATO individual income tax rates for FY2025-26. There are no state-specific individual income taxes in Australia. State payroll tax and workers compensation data are sourced from the Queensland Revenue Office and WorkCover QLD, but these only affect employers. Average salary figures are based on Australian Bureau of Statistics Average Weekly Earnings data. Cost-of-living comparisons draw on publicly available rental, transport, and utilities data for Queensland.</p>
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
