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
  { title: "Average Weekly Earnings (WA)", url: "https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/average-weekly-earnings-australia", publisher: "Australian Bureau of Statistics" },
  { title: "WA Payroll Tax", url: "https://www.wa.gov.au/organisation/department-of-finance/payroll-tax", publisher: "Department of Finance WA" },
];

export default function PayCalculatorWAPage() {
  const [salary, setSalary] = useState(105_000); // Standard higher default for WA
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
              <li><span className="font-medium text-navy" aria-current="page">Pay Calculator WA</span></li>
            </ol>
          </nav>
          <div className="flex items-center gap-3 mt-4 mb-3">
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl md:text-4xl font-bold text-navy">Pay Calculator WA 2025-26</h1>
            <span className="bg-sandstone0 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">WA</span>
          </div>
          <p className="text-lg text-warmgray">Calculate your exact take-home pay in Western Australia. Understand federal tax rates, local payroll taxes, and the impact of the booming resources sector on WA salaries.</p>
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
                  <button type="submit" className="w-full bg-sandstone0 hover:bg-eucalyptus-dark text-white font-semibold py-3 rounded-lg shadow-md transition-all">Calculate Net Pay</button>
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

          {/* H2: How Does the WA Pay Calculator Work? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Does the WA Pay Calculator Work?</h2>
            <p className="text-warmgray mb-4">The WA pay calculator applies <strong>federal ATO income tax rates</strong> to your gross salary and subtracts the Medicare levy to determine your after-tax income in Western Australia for FY2025-26.</p>
            <p className="text-warmgray mb-4">Enter your gross annual salary, indicate whether you carry a HECS-HELP debt, and confirm your private health insurance status. The Australian tax calculator then computes your income tax using the current <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">income tax brackets</Link>, deducts the 2% Medicare levy, and applies the Low Income Tax Offset (LITO) if eligible. The result is your net pay after tax, displayed as annual, monthly, fortnightly, and weekly amounts.</p>
            <p className="text-warmgray mb-4">Personal income tax in Australia is a federal obligation. Western Australia does not impose a state-level income tax, so the same tax brackets apply whether you earn your salary in Perth, Karratha, or Broome. The key difference for WA workers is the significantly higher average salary driven by the mining and resources sector, which directly affects the marginal rate applied to your assessable income.</p>
            <p className="text-warmgray">Your employer also pays superannuation at the SG rate of <strong>12%</strong> on top of your gross salary for FY2025-26. Use our <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to calculate the exact dollar amount flowing into your super fund.</p>
          </section>

          {/* H2: What Is the Average Salary in Western Australia? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is the Average Salary in Western Australia?</h2>
            <p className="text-warmgray mb-4">The average full-time salary in Western Australia is <strong>$107,317 per year</strong>, the highest of any Australian state and approximately 10% above the national average of $98,218.</p>
            <p className="text-warmgray mb-4">ABS Average Weekly Earnings data shows WA full-time adult ordinary time earnings at approximately $2,064 per week. This figure is heavily influenced by the resources sector, where FIFO (fly-in fly-out) roles in the Pilbara and Goldfields regions command base salaries of $130,000 to $200,000+. Perth metro salaries across non-mining industries align more closely with the national average.</p>
            <div className="bg-sandstone rounded-xl border border-sandstone-dark/20 p-6 flex flex-col sm:flex-row gap-6 items-center mb-6">
              <div className="text-center sm:w-1/3">
                <div className="text-3xl font-bold text-navy mb-1">$107,317</div>
                <div className="text-sm text-warmgray-light uppercase tracking-widest font-semibold">Average Annual</div>
              </div>
              <div className="text-warmgray text-sm sm:w-2/3">
                <p className="mb-2">WA&apos;s average full-time adult ordinary time earnings are approximately $2,064 per week ($107,317 annualised), based on the latest ABS data.</p>
                <p className="text-xs text-warmgray-light italic">*FIFO mining roles typically earn $150,000-$200,000+, pulling the state average well above the national figure.</p>
              </div>
            </div>

            {/* H3: Average Salary by Industry in WA */}
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">Average Salary by Industry in WA</h3>
            <p className="text-warmgray mb-4">Mining dominates WA&apos;s salary landscape, paying <strong>$139,000 per year</strong> on average. The table below shows average full-time salaries across 8 major industries in Western Australia, based on ABS and Seek data.</p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-sandstone">
                    <th className="text-left p-3 font-semibold text-navy border border-sandstone-dark/20">Industry</th>
                    <th className="text-right p-3 font-semibold text-navy border border-sandstone-dark/20">Average Salary (WA)</th>
                    <th className="text-right p-3 font-semibold text-navy border border-sandstone-dark/20">National Average</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-ochre/10">
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray font-semibold">Mining &amp; Resources</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right font-bold text-navy">$139,000</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$134,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">Construction</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right font-medium text-navy">$105,000</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$95,000</td>
                  </tr>
                  <tr className="bg-sandstone/50">
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">Healthcare &amp; Social Assistance</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right font-medium text-navy">$88,000</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$86,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">Professional &amp; Technical Services</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right font-medium text-navy">$110,000</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$105,000</td>
                  </tr>
                  <tr className="bg-sandstone/50">
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">Education &amp; Training</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right font-medium text-navy">$90,000</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$88,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">Public Administration</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right font-medium text-navy">$96,000</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$94,000</td>
                  </tr>
                  <tr className="bg-sandstone/50">
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">Retail Trade</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right font-medium text-navy">$62,000</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$58,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">Accommodation &amp; Food Services</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right font-medium text-navy">$55,000</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$52,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray text-sm">Mining &amp; Resources salaries in WA exceed every other industry by at least <strong>$29,000 per year</strong>. Construction and professional services also pay above national averages, reflecting the demand created by major resource projects across the Pilbara, Goldfields, and Mid West regions. Use our <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> to see how these salaries translate to net pay after tax.</p>
          </section>

          {/* H2: How Much Tax Do You Pay in WA? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Much Tax Do You Pay in WA?</h2>
            <p className="text-warmgray mb-4">A WA worker earning $95,000 per year pays <strong>$22,967 in income tax</strong> plus <strong>$1,900 in Medicare levy</strong>, leaving take-home pay of <strong>$70,133</strong>.</p>
            <p className="text-warmgray mb-4">Income tax in Western Australia follows the same federal income tax brackets that apply across all states and territories. There is no state income tax in Australia. The ATO taxes assessable income at progressive marginal rates for FY2025-26.</p>

            <div className="bg-sandstone rounded-xl border border-sandstone-dark/20 p-6 mb-4">
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-lg font-semibold text-navy mb-3">Worked Example: $95,000 Salary in WA</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-white">
                      <th className="text-left p-3 font-semibold text-navy border border-sandstone-dark/20">Component</th>
                      <th className="text-right p-3 font-semibold text-navy border border-sandstone-dark/20">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border border-sandstone-dark/20 text-warmgray">Gross Salary</td>
                      <td className="p-3 border border-sandstone-dark/20 text-right font-bold text-navy">$95,000</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-3 border border-sandstone-dark/20 text-warmgray">Income Tax (Federal)</td>
                      <td className="p-3 border border-sandstone-dark/20 text-right text-red-600">-$22,967</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-sandstone-dark/20 text-warmgray">Medicare Levy (2%)</td>
                      <td className="p-3 border border-sandstone-dark/20 text-right text-red-600">-$1,900</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-3 border border-sandstone-dark/20 text-warmgray font-semibold">Take-Home Pay</td>
                      <td className="p-3 border border-sandstone-dark/20 text-right font-bold text-navy">$70,133</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-sandstone-dark/20 text-warmgray">Effective Tax Rate</td>
                      <td className="p-3 border border-sandstone-dark/20 text-right font-medium text-navy">26.2%</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-3 border border-sandstone-dark/20 text-warmgray">Superannuation (12%)</td>
                      <td className="p-3 border border-sandstone-dark/20 text-right text-eucalyptus-dark">+$11,400</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-sandstone-dark/20 text-warmgray font-semibold">Total Package</td>
                      <td className="p-3 border border-sandstone-dark/20 text-right font-bold text-navy">$106,400</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-warmgray text-sm">The $95,000 earner&apos;s marginal tax rate is <strong>32.5%</strong>, meaning each additional dollar earned between $45,001 and $135,000 is taxed at that rate. Workers without private health insurance earning above $93,000 (singles) also pay the &quot;Medicare Levy Surcharge&quot; of 1-1.5%. Check the full rate schedule on our <Link href="/medicare-levy/" className="text-eucalyptus-dark hover:underline">Medicare Levy</Link> guide.</p>
          </section>

          {/* H2: What Is WA Payroll Tax? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is WA Payroll Tax?</h2>
            <p className="text-warmgray mb-4">WA payroll tax is a <strong>5.5% state tax</strong> levied on employers whose total Australian taxable wages exceed <strong>$1,000,000 per year</strong>.</p>
            <p className="text-warmgray mb-4">Payroll tax is an employer cost managed by the Department of Finance WA. Employees do not pay payroll tax, and it does not reduce your gross salary or take-home pay. The tax applies to the employer&apos;s total wage bill, not individual salaries. A tiered scale applies to larger employers with wages exceeding $100 million, where the rate increases to 6.5%.</p>

            {/* H3: WA vs Other States Payroll Tax Comparison */}
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">How Does WA Payroll Tax Compare to Other States?</h3>
            <p className="text-warmgray mb-4">WA&apos;s payroll tax threshold of $1,000,000 sits in the middle range nationally. The comparison table below shows rates and thresholds across all 8 Australian states and territories.</p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-sandstone">
                    <th className="text-left p-3 font-semibold text-navy border border-sandstone-dark/20">State / Territory</th>
                    <th className="text-right p-3 font-semibold text-navy border border-sandstone-dark/20">Rate</th>
                    <th className="text-right p-3 font-semibold text-navy border border-sandstone-dark/20">Annual Threshold</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-ochre/10">
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray font-semibold">Western Australia</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right font-bold text-navy">5.5%</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right font-bold text-navy">$1,000,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">New South Wales</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-navy">5.45%</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$1,200,000</td>
                  </tr>
                  <tr className="bg-sandstone/50">
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">Victoria</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-navy">4.85%</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$900,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">Queensland</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-navy">4.75%</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$1,300,000</td>
                  </tr>
                  <tr className="bg-sandstone/50">
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">South Australia</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-navy">4.95%</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$1,500,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">Tasmania</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-navy">4.0%</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$1,250,000</td>
                  </tr>
                  <tr className="bg-sandstone/50">
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">Northern Territory</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-navy">5.5%</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$1,500,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">ACT</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-navy">6.85%</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$2,000,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray text-sm">WA&apos;s payroll tax rate matches the Northern Territory at <strong>5.5%</strong> but carries a lower threshold than Queensland, SA, and the NT. For employers calculating total hiring costs including payroll tax, WorkCover, and superannuation, see our <Link href="/employer-cost-calculator/" className="text-eucalyptus-dark hover:underline">Employer Cost Calculator</Link>.</p>
          </section>

          {/* --- CONTEXT BORDER --- */}

          {/* H2: What Is the Cost of Living in Perth? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is the Cost of Living in Perth?</h2>
            <p className="text-warmgray mb-4">Perth is <strong>15-20% cheaper</strong> than Sydney across housing, groceries, and transport, making WA&apos;s higher salaries stretch further in real purchasing power.</p>
            <p className="text-warmgray mb-4">Perth residents benefit from lower median house prices, cheaper fuel, and comparable grocery costs relative to the eastern seaboard capitals. The median house price in Perth is approximately $650,000, compared to $1,150,000 in Sydney and $900,000 in Melbourne. Rental costs are also lower, with a median 3-bedroom house in Perth renting for approximately $580 per week versus $750 in Sydney.</p>

            {/* H3: Perth vs Sydney Cost Comparison */}
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">Perth vs Sydney: Cost Comparison</h3>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-sandstone">
                    <th className="text-left p-3 font-semibold text-navy border border-sandstone-dark/20">Expense</th>
                    <th className="text-right p-3 font-semibold text-navy border border-sandstone-dark/20">Perth</th>
                    <th className="text-right p-3 font-semibold text-navy border border-sandstone-dark/20">Sydney</th>
                    <th className="text-right p-3 font-semibold text-navy border border-sandstone-dark/20">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">Median House Price</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-navy">$650,000</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$1,150,000</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right font-semibold text-eucalyptus-dark">-43%</td>
                  </tr>
                  <tr className="bg-sandstone/50">
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">Rent (3-bed house, weekly)</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-navy">$580</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$750</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right font-semibold text-eucalyptus-dark">-23%</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">Monthly Groceries (family of 4)</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-navy">$1,100</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$1,250</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right font-semibold text-eucalyptus-dark">-12%</td>
                  </tr>
                  <tr className="bg-sandstone/50">
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">Monthly Public Transport Pass</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-navy">$160</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$200</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right font-semibold text-eucalyptus-dark">-20%</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">Petrol (per litre)</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-navy">$1.75</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$1.95</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right font-semibold text-eucalyptus-dark">-10%</td>
                  </tr>
                  <tr className="bg-sandstone/50">
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">Childcare (daily)</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-navy">$120</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right text-warmgray">$150</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right font-semibold text-eucalyptus-dark">-20%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* H3: Regional WA and FIFO Cost of Living */}
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">Regional WA and FIFO Living Costs</h3>
            <p className="text-warmgray mb-4">Regional Western Australia spans vastly different cost profiles depending on proximity to mining operations. Towns including Karratha, Port Hedland, and Newman experience elevated housing and grocery costs due to remoteness and resource-sector demand. A 3-bedroom house in Karratha rents for approximately <strong>$900-$1,200 per week</strong>, significantly higher than Perth metro.</p>
            <p className="text-warmgray mb-4">FIFO workers based in Perth avoid regional living costs entirely. These workers fly to remote mine sites on rosters (typically 2 weeks on, 1 week off or 8 days on, 6 days off), with accommodation and meals provided by the employer. FIFO arrangements are common across BHP, Rio Tinto, and Fortescue operations in the Pilbara. The disposable salary for a FIFO worker earning $160,000 is substantially higher than a Perth-based worker at the same salary, as housing and food costs at the mine site are employer-funded.</p>
          </section>

          {/* H2: Who Are the Major Employers in Western Australia? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Who Are the Major Employers in Western Australia?</h2>
            <p className="text-warmgray mb-4">The WA Government is the single largest employer in Western Australia with over <strong>110,000 employees</strong>, followed by mining giants BHP, Rio Tinto, and Fortescue.</p>
            <p className="text-warmgray mb-4">Western Australia&apos;s economy is anchored by the resources sector, which contributes approximately 40% of the state&apos;s gross state product. The major employers span mining, government, healthcare, and retail.</p>
            <ul className="list-disc list-inside text-warmgray space-y-2 mb-4">
              <li><strong>WA Government</strong> (including WA Health, Education, Police) &mdash; 110,000+ employees</li>
              <li><strong>BHP</strong> &mdash; 30,000+ WA-based employees across iron ore operations in the Pilbara</li>
              <li><strong>Rio Tinto</strong> &mdash; 20,000+ WA employees across iron ore, alumina, and lithium</li>
              <li><strong>Fortescue</strong> &mdash; 15,000+ employees, headquartered in Perth</li>
              <li><strong>Woodside Energy</strong> &mdash; 5,000+ employees in oil and gas, headquartered in Perth</li>
              <li><strong>Wesfarmers</strong> &mdash; Perth-headquartered conglomerate (Bunnings, Kmart, Officeworks) with 100,000+ nationally</li>
              <li><strong>Mineral Resources</strong> &mdash; 5,000+ employees in mining services and lithium</li>
              <li><strong>Curtin University &amp; UWA</strong> &mdash; two of WA&apos;s largest education employers with 5,000+ staff each</li>
            </ul>
            <p className="text-warmgray text-sm">Workers employed under national awards receive standardised pay rates &mdash; see our <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">Award Rates</Link> guide for minimum pay by industry classification.</p>
          </section>

          {/* H2: What State-Specific Benefits Apply in WA? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What State-Specific Benefits Apply in WA?</h2>
            <p className="text-warmgray mb-4">WA workers in remote or isolated areas qualify for the &quot;Zone Tax Offset&quot;, a federal tax rebate worth up to <strong>$1,173 per year</strong> for residents of Zone A localities including the Pilbara and Kimberley.</p>
            <p className="text-warmgray mb-4">The Zone Tax Offset is a federal concession (not a WA state benefit) designed to offset the higher living costs in remote Australia. WA has more Zone A and Zone B postcodes than any other state due to its vast geography. Zone A covers the Pilbara, Kimberley, and Gascoyne regions. Zone B covers areas including Kalgoorlie-Boulder and parts of the Midwest. The offset amount depends on the zone classification and how long you reside in the area during the financial year.</p>

            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-sandstone">
                    <th className="text-left p-3 font-semibold text-navy border border-sandstone-dark/20">Zone</th>
                    <th className="text-left p-3 font-semibold text-navy border border-sandstone-dark/20">WA Regions</th>
                    <th className="text-right p-3 font-semibold text-navy border border-sandstone-dark/20">Base Offset</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray font-semibold">Zone A</td>
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">Pilbara, Kimberley, Gascoyne, Goldfields (remote)</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right font-bold text-navy">$338</td>
                  </tr>
                  <tr className="bg-sandstone/50">
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray font-semibold">Zone B</td>
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">Kalgoorlie-Boulder, Midwest, parts of Wheatbelt</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right font-bold text-navy">$57</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray font-semibold">Special Area</td>
                    <td className="p-3 border border-sandstone-dark/20 text-warmgray">Specific remote communities (ATO-listed)</td>
                    <td className="p-3 border border-sandstone-dark/20 text-right font-bold text-navy">$1,173</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray mb-4">FIFO workers who maintain a home in Perth and fly to a Zone A site do not automatically qualify for the Zone Tax Offset. The ATO requires you to reside in the zone for more than 183 days in the financial year to claim the full offset. Workers who maintain a permanent residence in a qualifying zone and commute to site daily or on short rosters are eligible. Read the full eligibility criteria on our <Link href="/zone-tax-offset/" className="text-eucalyptus-dark hover:underline">Zone Tax Offset</Link> guide.</p>
            <p className="text-warmgray">WA also offers state-level concessions unrelated to income tax, including first home owner grants of <strong>$10,000</strong> for new builds, electricity credits for eligible pensioners and seniors, and stamp duty concessions for first home buyers on properties under $530,000.</p>
          </section>

          {/* H2: Frequently Asked Questions */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <FAQItem value="federal" question="Is income tax different in WA compared to other states?">
                No. Personal income tax in Australia is levied by the federal government through the ATO. The income tax brackets, Medicare levy, and HECS-HELP repayment thresholds are identical in Western Australia, New South Wales, Victoria, Queensland, and every other state and territory. Use our <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">income tax brackets</Link> page to see the full FY2025-26 rate schedule.
              </FAQItem>
              <FAQItem value="payroll" question="What is the payroll tax threshold in WA?">
                The WA payroll tax threshold is <strong>$1,000,000</strong> per year. Employers with total Australian taxable wages below this amount pay no payroll tax. The standard rate is <strong>5.5%</strong> on wages exceeding the threshold, with a higher rate of 6.5% applying to employers with wages above $100 million.
              </FAQItem>
              <FAQItem value="employee" question="Do WA employees pay for WorkCover?">
                No. WorkCover WA insurance premiums are entirely an employer expense. Premiums vary by industry risk classification, ranging from 0.5% of wages in low-risk office roles to over 7% in underground mining. These costs do not reduce your gross salary or take-home pay.
              </FAQItem>
              <FAQItem value="highest" question="Why are WA salaries the highest in Australia?">
                WA salaries are the highest in Australia due to the dominance of the mining and resources sector, which pays an average of <strong>$139,000 per year</strong>. Competition for skilled labour in remote Pilbara and Goldfields operations drives wages upward across all industries, including construction, engineering, and professional services. FIFO roles offering 2/1 rosters frequently exceed <strong>$180,000</strong> including allowances.
              </FAQItem>
              <FAQItem value="fifo" question="Do FIFO workers qualify for the Zone Tax Offset?">
                FIFO workers qualify for the &quot;Zone Tax Offset&quot; only if they reside in a qualifying zone for more than <strong>183 days</strong> in the financial year. Workers who live in Perth and fly to a remote site do not meet the residency requirement. Workers who maintain a permanent home in a zone locality (such as Karratha or Newman) are eligible.
              </FAQItem>
              <FAQItem value="super" question="How much superannuation does my WA employer pay?">
                Every WA employer pays superannuation at the &quot;Superannuation Guarantee&quot; rate of <strong>12%</strong> for FY2025-26. This is paid on top of your gross salary into your nominated super fund. The maximum super contribution base is <strong>$65,070 per quarter</strong> ($260,280 per year), above which employers are not required to pay additional super.
              </FAQItem>
              <FAQItem value="cost" question="Is Perth cheaper to live in than Sydney?">
                Yes. Perth is approximately <strong>15-20% cheaper</strong> than Sydney across major expenses. The median house price in Perth is $650,000 versus $1,150,000 in Sydney. Weekly rent for a 3-bedroom house in Perth averages $580 compared to $750 in Sydney. Groceries, transport, and childcare are also lower in Perth.
              </FAQItem>
              <FAQItem value="salary-sacrifice" question="Can WA workers use salary sacrifice to reduce tax?">
                Yes. Salary sacrifice arrangements are governed by federal tax law and apply equally in all states. WA workers frequently salary sacrifice into superannuation (concessional contributions up to <strong>$30,000 per year</strong>) or novated leases. Use our <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> to model the tax savings.
              </FAQItem>
            </Accordion>
          </section>

          <MethodologyDisclosure>
            <p>Calculations use federal ATO individual income tax rates, Medicare levy, LITO, and HECS-HELP repayment schedules for FY2025-26. There are no state-specific individual income taxes in Australia. State payroll tax and WorkCover data are sourced from the Department of Finance WA and WorkCover WA. Average salary figures are derived from ABS Average Weekly Earnings and Seek market data. Cost of living comparisons use Numbeo and CoreLogic median price data.</p>
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
