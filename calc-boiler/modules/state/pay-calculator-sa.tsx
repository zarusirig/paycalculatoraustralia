"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { calculatePayBreakdown, formatAUD, formatPercent, SOURCES, SITE_CONFIG } from "@/lib/constants";

function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)); }

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "SA Payroll Tax", url: "https://www.revenuesa.sa.gov.au/payrolltax", publisher: "RevenueSA" },
  { title: "Average Weekly Earnings (SA)", url: "https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/average-weekly-earnings-australia", publisher: "Australian Bureau of Statistics" },
];

export default function PayCalculatorSAPage() {
  const [salary, setSalary] = useState(85_000);
  const [includeHECS, setIncludeHECS] = useState(false);
  const [hasPrivateHealth, setHasPrivateHealth] = useState(true);
  const result = useMemo(() => calculatePayBreakdown({ grossSalary: salary, includeHECS, hasPrivateHealth }), [salary, includeHECS, hasPrivateHealth]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <section className="bg-eucalyptus-light/40 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-eucalyptus-light">
          <nav aria-label="breadcrumb"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Pay Calculator SA</span></li></ol></nav>
          <div className="flex items-center gap-3 mt-4 mb-3"><h1 className="text-3xl md:text-4xl font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Pay Calculator SA 2025-26</h1><span className="bg-eucalyptus-dark text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">SA</span></div>
          <p className="text-lg text-warmgray">Calculate your take-home pay in South Australia. Federal income tax rates apply uniformly — see SA-specific payroll tax, average salaries, and cost of living context.</p>
          <TrustBar className="mt-4" />
        </section>

        <section className="max-w-4xl mx-auto"><Card className="shadow-md"><CardContent className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div><label htmlFor="salary" className="block text-sm font-medium text-navy mb-1">Gross Annual Salary</label><div className="flex items-center"><span className="text-warmgray-light mr-2">$</span><input type="number" id="salary" min={0} max={500000} step={1000} value={salary} onChange={(e) => setSalary(clamp(Number(e.target.value || 0), 0, 500000))} className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" /></div><input type="range" min={0} max={300000} step={5000} value={clamp(salary, 0, 300000)} onChange={(e) => setSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" /></div>
              <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={includeHECS} onChange={(e) => setIncludeHECS(e.target.checked)} className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" /><span className="text-navy">Include HECS-HELP</span></label>
              <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={!hasPrivateHealth} onChange={(e) => setHasPrivateHealth(!e.target.checked)} className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" /><span className="text-navy">No private health insurance</span></label>
            </form>
            <div className="space-y-6">
              <div className="bg-eucalyptus-light/40 border border-eucalyptus-light rounded-xl p-6 text-center shadow-sm"><div className="text-sm font-semibold text-eucalyptus-dark uppercase tracking-wider mb-2">Take-Home Pay (SA)</div><div className="text-4xl font-extrabold text-navy">{formatAUD(result.takeHomePay)}</div><div className="text-sm text-warmgray mt-2">{formatAUD(result.monthly)}/month · {formatAUD(result.fortnightly)}/fortnight</div></div>
              <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden"><div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20"><h3 className="font-semibold text-navy text-sm uppercase tracking-wider">Deductions</h3></div><div className="p-5 space-y-3 text-sm">
                <Row label="Income Tax" value={`-${formatAUD(result.netIncomeTax)}`} /><Row label="Medicare Levy" value={`-${formatAUD(result.medicareLevy)}`} />{result.medicareSurcharge > 0 && <Row label="Medicare Surcharge" value={`-${formatAUD(result.medicareSurcharge)}`} />}{includeHECS && <Row label="HECS Repayment" value={`-${formatAUD(result.hecsRepayment)}`} />}<div className="border-t border-sandstone-dark/20 pt-3" /><Row label="Take-Home Pay" value={formatAUD(result.takeHomePay)} bold highlight /><Row label="Effective Tax Rate" value={formatPercent(result.effectiveTaxRate)} /><Row label="Super (employer-paid)" value={`+${formatAUD(result.superContribution)}`} />
              </div></div>
            </div>
          </div>
        </CardContent></Card></section>

        <div className="max-w-4xl mx-auto space-y-10">

          {/* ── H2: How Does the SA Pay Calculator Work? ── */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does the SA Pay Calculator Work?</h2>
            <p className="mb-4 text-warmgray">The SA pay calculator applies Australia&apos;s federal income tax brackets to your gross salary and deducts the Medicare levy to produce your exact take-home pay for FY2025-26. South Australia has no state-level personal income tax, so every employee in Adelaide, Mount Gambier, or Port Augusta uses the same Australian tax calculator rates as workers in Sydney or Melbourne.</p>
            <p className="mb-4 text-warmgray">Enter your gross annual salary, toggle HECS-HELP if you carry a study debt, and indicate your private health insurance status. The calculator returns your net pay after tax broken down into annual, monthly, and fortnightly amounts. Superannuation at the current SG rate of <strong>12%</strong> is displayed separately because your employer pays it on top of your gross salary.</p>
            <p className="text-warmgray">For a deeper look at how each income tax bracket is applied, see our <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">Tax Brackets 2025-26</Link> guide. If you carry a HECS-HELP loan, our <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> shows the exact repayment amount at every income level.</p>
          </section>

          {/* ── H2: What Is the Average Salary in South Australia? ── */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Average Salary in South Australia?</h2>
            <p className="mb-4 text-warmgray">The average full-time salary in South Australia is <strong>$85,000 per year</strong>, approximately 13% below the national average of $98,000. This gap reflects SA&apos;s lower cost of living rather than lower labour productivity. ABS data shows average weekly ordinary-time earnings in SA sit at roughly <strong>$1,635 per week</strong>, translating to higher purchasing power once Adelaide&apos;s reduced housing costs are factored in.</p>
            <p className="mb-4 text-warmgray">Salaries vary sharply across industries. Defence and mining roles in SA regularly exceed <strong>$120,000</strong>, while retail and hospitality positions average closer to <strong>$55,000</strong>. Regional towns including Whyalla, Port Lincoln, and Murray Bridge typically pay <strong>5&ndash;10%</strong> less than metropolitan Adelaide for comparable roles.</p>

            <h3 className="text-xl font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Average Salary by Industry in SA</h3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-sandstone">
                    <th className="text-left px-4 py-3 font-semibold text-navy">Industry</th>
                    <th className="text-right px-4 py-3 font-semibold text-navy">Avg. Annual Salary</th>
                    <th className="text-right px-4 py-3 font-semibold text-navy">Est. Take-Home Pay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className="px-4 py-3 text-warmgray">Mining &amp; Resources</td><td className="px-4 py-3 text-right font-medium text-navy">$130,000</td><td className="px-4 py-3 text-right font-medium text-navy">$96,683</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">Defence &amp; Aerospace</td><td className="px-4 py-3 text-right font-medium text-navy">$125,000</td><td className="px-4 py-3 text-right font-medium text-navy">$93,433</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">Information Technology</td><td className="px-4 py-3 text-right font-medium text-navy">$105,000</td><td className="px-4 py-3 text-right font-medium text-navy">$80,683</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">Healthcare &amp; Social Assistance</td><td className="px-4 py-3 text-right font-medium text-navy">$90,000</td><td className="px-4 py-3 text-right font-medium text-navy">$71,183</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">Construction</td><td className="px-4 py-3 text-right font-medium text-navy">$88,000</td><td className="px-4 py-3 text-right font-medium text-navy">$69,883</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">Education &amp; Training</td><td className="px-4 py-3 text-right font-medium text-navy">$82,000</td><td className="px-4 py-3 text-right font-medium text-navy">$66,033</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">Agriculture &amp; Wine</td><td className="px-4 py-3 text-right font-medium text-navy">$68,000</td><td className="px-4 py-3 text-right font-medium text-navy">$57,233</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">Retail &amp; Hospitality</td><td className="px-4 py-3 text-right font-medium text-navy">$55,000</td><td className="px-4 py-3 text-right font-medium text-navy">$48,108</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-warmgray-light mt-2">Take-home estimates assume no HECS-HELP debt, private health insurance held, and FY2025-26 tax rates. Use the calculator above for your exact figure.</p>
            <p className="text-warmgray mt-4">Most South Australian employees in the private sector earn at or above their applicable modern award rate. The Fair Work Commission&apos;s federal modern awards apply nationally, so an SA worker in retail, wine production or hospitality earns the same award minimum as their counterparts in NSW or Victoria. Our <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">Australian award rates guide</Link> details the FY2025-26 rates by industry classification.</p>
          </section>

          {/* ── H2: How Much Tax Do You Pay in South Australia? ── */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much Tax Do You Pay in South Australia?</h2>
            <p className="mb-4 text-warmgray">An SA worker earning <strong>$85,000</strong> pays <strong>$16,967</strong> in federal income tax plus <strong>$1,700</strong> in Medicare levy, leaving a take-home pay of <strong>$66,333</strong> per year. Income tax in Australia is a federal obligation administered by the ATO, so the same income tax brackets apply in every state and territory.</p>
            <p className="mb-4 text-warmgray">The FY2025-26 calculation at $85,000 breaks down as follows:</p>

            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-sandstone">
                    <th className="text-left px-4 py-3 font-semibold text-navy">Step</th>
                    <th className="text-left px-4 py-3 font-semibold text-navy">Calculation</th>
                    <th className="text-right px-4 py-3 font-semibold text-navy">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className="px-4 py-3 text-warmgray">1. $0 &ndash; $18,200</td><td className="px-4 py-3 text-warmgray">Nil rate (tax-free threshold)</td><td className="px-4 py-3 text-right font-medium text-navy">$0</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">2. $18,201 &ndash; $45,000</td><td className="px-4 py-3 text-warmgray">$26,800 &times; 16%</td><td className="px-4 py-3 text-right font-medium text-navy">$4,288</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">3. $45,001 &ndash; $85,000</td><td className="px-4 py-3 text-warmgray">$40,000 &times; 30%</td><td className="px-4 py-3 text-right font-medium text-navy">$12,000</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">4. Gross income tax</td><td className="px-4 py-3 text-warmgray">Sum of brackets</td><td className="px-4 py-3 text-right font-medium text-navy">$16,288</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">5. LITO offset</td><td className="px-4 py-3 text-warmgray">Phased out at $85,000 (reduced from $700)</td><td className="px-4 py-3 text-right font-medium text-navy">&minus;$325</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">6. Net income tax</td><td className="px-4 py-3 text-warmgray">$16,288 &minus; $325 LITO</td><td className="px-4 py-3 text-right font-bold text-navy">$15,963</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">7. Medicare levy</td><td className="px-4 py-3 text-warmgray">$85,000 &times; 2%</td><td className="px-4 py-3 text-right font-medium text-navy">$1,700</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">8. Total deductions</td><td className="px-4 py-3 text-warmgray">Tax + Medicare</td><td className="px-4 py-3 text-right font-bold text-navy">$17,663</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">9. Take-home pay</td><td className="px-4 py-3 text-warmgray">$85,000 &minus; $17,663</td><td className="px-4 py-3 text-right font-bold text-eucalyptus-dark">$67,337</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">The effective tax rate at $85,000 is <strong>20.8%</strong>. Workers without private health insurance who earn above $93,000 (singles) also pay the <Link href="/medicare-levy/" className="text-eucalyptus-dark hover:underline">Medicare Levy Surcharge</Link> of 1&ndash;1.5% on top of the standard 2% Medicare levy. Use the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to model different salary scenarios instantly.</p>
          </section>

          {/* ── H2: What Is SA Payroll Tax? ── */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is SA Payroll Tax?</h2>
            <p className="mb-4 text-warmgray">SA payroll tax is a state levy charged to employers at a rate of <strong>4.95%</strong> on total Australian wages exceeding <strong>$1,500,000</strong> per year. Employees do not pay payroll tax. It does not appear on your payslip and has zero impact on your take-home pay. RevenueSA administers the tax and offers a monthly threshold deduction so only wages above the $1.5 million annual threshold attract the 4.95% rate.</p>
            <p className="mb-4 text-warmgray">SA&apos;s $1.5 million threshold is the second-highest in Australia after Queensland&apos;s $1.3 million (which uses a lower rate). This high threshold means fewer SA businesses pay payroll tax compared to NSW or Victoria, where lower thresholds capture more employers. For a full breakdown of employer on-costs including superannuation and workers compensation, see the <Link href="/employer-cost-calculator/" className="text-eucalyptus-dark hover:underline">Employer Cost Calculator</Link>.</p>

            <h3 className="text-xl font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does SA Payroll Tax Compare to Other States?</h3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-sandstone">
                    <th className="text-left px-4 py-3 font-semibold text-navy">State / Territory</th>
                    <th className="text-right px-4 py-3 font-semibold text-navy">Rate</th>
                    <th className="text-right px-4 py-3 font-semibold text-navy">Annual Threshold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="bg-eucalyptus-light/20"><td className="px-4 py-3 font-semibold text-navy">South Australia</td><td className="px-4 py-3 text-right font-bold text-navy">4.95%</td><td className="px-4 py-3 text-right font-bold text-navy">$1,500,000</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">New South Wales</td><td className="px-4 py-3 text-right font-medium text-navy">5.45%</td><td className="px-4 py-3 text-right font-medium text-navy">$1,200,000</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">Victoria</td><td className="px-4 py-3 text-right font-medium text-navy">4.85%</td><td className="px-4 py-3 text-right font-medium text-navy">$900,000</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">Queensland</td><td className="px-4 py-3 text-right font-medium text-navy">4.75%</td><td className="px-4 py-3 text-right font-medium text-navy">$1,300,000</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">Western Australia</td><td className="px-4 py-3 text-right font-medium text-navy">5.50%</td><td className="px-4 py-3 text-right font-medium text-navy">$1,000,000</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">Tasmania</td><td className="px-4 py-3 text-right font-medium text-navy">4.00%</td><td className="px-4 py-3 text-right font-medium text-navy">$1,250,000</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">ACT</td><td className="px-4 py-3 text-right font-medium text-navy">6.85%</td><td className="px-4 py-3 text-right font-medium text-navy">$2,000,000</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">Northern Territory</td><td className="px-4 py-3 text-right font-medium text-navy">5.50%</td><td className="px-4 py-3 text-right font-medium text-navy">$1,500,000</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-warmgray-light mt-2">Rates shown are the standard rate for each jurisdiction for FY2025-26. Some states apply tiered or additional mental-health surcharge rates above certain wage levels.</p>
          </section>

          {/* ── CONTEXT BORDER ── */}

          {/* ── H2: What Is the Cost of Living in Adelaide? ── */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Cost of Living in Adelaide?</h2>
            <p className="mb-4 text-warmgray">Adelaide ranks as the most affordable mainland capital city in Australia, with overall living costs <strong>15&ndash;20%</strong> below Sydney and <strong>10&ndash;15%</strong> below Melbourne. The median house price in Adelaide sits at approximately <strong>$750,000</strong> compared to Sydney&apos;s <strong>$1,400,000</strong>, giving SA workers significantly higher purchasing power from the same after-tax income.</p>
            <p className="mb-4 text-warmgray">Renters benefit equally. The median weekly rent for a 2-bedroom apartment in Adelaide CBD is <strong>$480</strong>, roughly half the equivalent figure in Sydney. Groceries, utilities, and public transport are all <strong>8&ndash;12%</strong> cheaper in Adelaide than in the eastern seaboard capitals.</p>

            <h3 className="text-xl font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Adelaide vs Sydney Cost Comparison</h3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-sandstone">
                    <th className="text-left px-4 py-3 font-semibold text-navy">Category</th>
                    <th className="text-right px-4 py-3 font-semibold text-navy">Adelaide</th>
                    <th className="text-right px-4 py-3 font-semibold text-navy">Sydney</th>
                    <th className="text-right px-4 py-3 font-semibold text-navy">Difference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className="px-4 py-3 text-warmgray">Median house price</td><td className="px-4 py-3 text-right font-medium text-navy">$750,000</td><td className="px-4 py-3 text-right font-medium text-navy">$1,400,000</td><td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">&minus;46%</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">2-bed apartment rent (week)</td><td className="px-4 py-3 text-right font-medium text-navy">$480</td><td className="px-4 py-3 text-right font-medium text-navy">$850</td><td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">&minus;44%</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">Monthly groceries (couple)</td><td className="px-4 py-3 text-right font-medium text-navy">$680</td><td className="px-4 py-3 text-right font-medium text-navy">$780</td><td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">&minus;13%</td></tr>
                  <tr className="bg-sandstone/30"><td className="px-4 py-3 text-warmgray">Monthly public transport</td><td className="px-4 py-3 text-right font-medium text-navy">$110</td><td className="px-4 py-3 text-right font-medium text-navy">$200</td><td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">&minus;45%</td></tr>
                  <tr><td className="px-4 py-3 text-warmgray">Quarterly electricity bill</td><td className="px-4 py-3 text-right font-medium text-navy">$520</td><td className="px-4 py-3 text-right font-medium text-navy">$480</td><td className="px-4 py-3 text-right font-medium text-warmgray">+8%</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-warmgray-light mb-4">Electricity costs in SA are among the highest in Australia due to the state&apos;s reliance on gas and renewables. SA government energy rebates partially offset this gap.</p>

            <h3 className="text-xl font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Regional SA Cost of Living</h3>
            <p className="text-warmgray">Regional centres including Mount Gambier, Port Augusta, and the Barossa Valley offer even lower housing costs than Adelaide. Median house prices in Mount Gambier sit at approximately <strong>$420,000</strong>, and in Port Augusta at <strong>$250,000</strong>. Rental prices in regional SA average <strong>30&ndash;40%</strong> below Adelaide. Workers in remote areas including Woomera, Coober Pedy, and Roxby Downs are eligible for the <Link href="/zone-tax-offset/" className="text-eucalyptus-dark hover:underline">Zone Tax Offset</Link>, which provides a federal tax reduction of up to <strong>$1,173</strong> per year for Zone A residents.</p>
          </section>

          {/* ── H2: Who Are the Major Employers in South Australia? ── */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Are the Major Employers in South Australia?</h2>
            <p className="mb-4 text-warmgray">The South Australian Government is the state&apos;s largest employer, with over <strong>100,000</strong> public sector workers across health, education, and emergency services. Defence is SA&apos;s fastest-growing sector following the federal government&apos;s commitment to build 12 Attack-class submarines and 9 Hunter-class frigates at the Osborne Naval Shipyard in Adelaide.</p>
            <p className="mb-4 text-warmgray">The top 10 employers shaping the SA job market are:</p>
            <ul className="list-disc list-inside space-y-1 text-warmgray mb-4">
              <li><strong>SA Government</strong> &mdash; health, education, police, public administration (100,000+ employees)</li>
              <li><strong>BAE Systems Australia</strong> &mdash; Hunter-class frigate program (5,000+ employees)</li>
              <li><strong>SA Health / Central Adelaide Local Health Network</strong> &mdash; public hospital system (30,000+ employees)</li>
              <li><strong>BHP</strong> &mdash; Olympic Dam copper-uranium mine in Roxby Downs (4,500+ employees)</li>
              <li><strong>University of Adelaide &amp; UniSA</strong> &mdash; higher education and research (6,000+ combined)</li>
              <li><strong>Santos</strong> &mdash; oil and gas, headquartered in Adelaide (3,500+ employees)</li>
              <li><strong>Woolworths &amp; Coles</strong> &mdash; retail supermarkets (12,000+ combined SA workforce)</li>
              <li><strong>Australian Space Agency</strong> &mdash; headquartered in Adelaide&apos;s Lot Fourteen precinct</li>
              <li><strong>Treasury Wine Estates / Penfolds</strong> &mdash; Barossa Valley wine production (2,000+ employees)</li>
              <li><strong>Flinders University</strong> &mdash; education and Tonsley Innovation District partnerships (3,000+ employees)</li>
            </ul>
            <p className="text-warmgray">SA&apos;s economy is diversifying rapidly. The space, cyber security, and renewable energy sectors added over <strong>8,000</strong> new roles between 2022 and 2025. Use our <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> to estimate your net pay after tax for any salary in these industries.</p>
          </section>

          {/* ── H2: What State-Specific Benefits Apply in SA? ── */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What State-Specific Benefits Apply in SA?</h2>
            <p className="mb-4 text-warmgray">South Australia provides <strong>3 key state-level financial benefits</strong> that directly increase disposable income for eligible residents: first home buyer assistance, energy bill relief, and cost-of-living concessions for low-income earners.</p>
            <ul className="list-disc list-inside space-y-2 text-warmgray mb-4">
              <li><strong>First Home Owner Grant (FHOG):</strong> SA offers a <strong>$15,000</strong> grant for first home buyers purchasing or building a new home valued at $650,000 or less. Stamp duty concessions apply to homes valued under $650,000.</li>
              <li><strong>Energy Bill Relief:</strong> The SA Government provides an electricity concession of up to <strong>$285</strong> per year for eligible concession card holders. The federal Energy Bill Relief Fund adds a further <strong>$300</strong> rebate for all households in FY2025-26.</li>
              <li><strong>Cost of Living Concession:</strong> SA residents holding a Centrelink Pensioner Concession Card, Health Care Card, or DVA Gold Card receive an annual payment of up to <strong>$449.60</strong> to offset essential living costs.</li>
              <li><strong>Zone Tax Offset:</strong> Federal tax offset for SA residents in designated remote zones including Coober Pedy (Zone A &mdash; up to <strong>$1,173</strong>) and Woomera, Leigh Creek, and parts of the APY Lands (special area &mdash; up to <strong>$1,423</strong>).</li>
              <li><strong>SA Ambulance Cover:</strong> Unlike other states, SA charges a flat annual ambulance cover fee of <strong>$98</strong> for individuals or <strong>$196</strong> for families, deducted via council rates or voluntary subscription. This replaces per-trip charges exceeding $1,000 in uncovered states.</li>
            </ul>
            <p className="text-warmgray">These benefits operate alongside federal taxation. Your income tax, Medicare levy, and superannuation calculations remain identical to every other Australian state. Use the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to see how employer SG contributions build your retirement balance over time.</p>
          </section>

          {/* ── H2: Frequently Asked Questions ── */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <AccordionItem value="diff" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Is income tax different in South Australia?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">No. Income tax is levied by the federal government through the ATO and is <strong>identical in all 6 states and 2 territories</strong>. Your income tax brackets, LITO, and Medicare levy are the same whether you live in Adelaide, Sydney, or Perth. There is no state-level personal income tax anywhere in Australia.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="avg" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>What is the average salary in Adelaide?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">The average full-time salary in Adelaide is approximately <strong>$87,000 per year</strong>. This is slightly above the overall SA state average of $85,000 because Adelaide&apos;s defence, IT, and government sectors pay higher wages than regional industries including agriculture and wine production.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="payroll" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Do SA employees pay payroll tax?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">No. Payroll tax is an employer obligation. In SA, employers pay <strong>4.95%</strong> on wages above <strong>$1,500,000</strong> annually. This tax does not reduce your gross or net pay and does not appear on your payslip.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="cost" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Is Adelaide cheaper to live in than Sydney?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. Adelaide&apos;s overall cost of living is <strong>15&ndash;20% lower</strong> than Sydney&apos;s. The largest difference is housing: Adelaide&apos;s median house price of $750,000 is 46% below Sydney&apos;s $1,400,000. Weekly rent for a 2-bedroom apartment averages $480 in Adelaide versus $850 in Sydney.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="super" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How much super does my SA employer pay?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Every Australian employer pays the superannuation guarantee at <strong>12% of your ordinary time earnings</strong> for FY2025-26. This is a federal requirement and applies equally in SA, NSW, Victoria, and every other jurisdiction. Your employer pays super on top of your gross salary into your nominated super fund.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="zone" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Can SA workers claim the Zone Tax Offset?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes, if they reside in an ATO-designated remote zone. SA Zone A locations include Coober Pedy, Woomera, Andamooka, and Roxby Downs. The offset provides up to <strong>$1,173</strong> for Zone A and up to <strong>$1,423</strong> for special areas including parts of the APY Lands. The offset reduces your taxable income at lodgement time.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="fhog" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>What is the First Home Owner Grant in SA?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">SA&apos;s First Home Owner Grant is a one-off payment of <strong>$15,000</strong> for eligible first home buyers purchasing or building a new residential property valued at $650,000 or less. The grant is administered by RevenueSA and is separate from stamp duty concessions, which apply to homes under $650,000.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="electricity" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Why are electricity costs higher in South Australia?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">SA&apos;s electricity prices are among Australia&apos;s highest due to the state&apos;s early closure of coal-fired power stations and transition to wind, solar, and gas generation. Average quarterly bills in SA are approximately <strong>$520</strong>, compared to $480 in NSW and $460 in Queensland. Government rebates of up to <strong>$585</strong> (combining state and federal programs) reduce the net impact for eligible households.</p></AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <MethodologyDisclosure><p className="text-sm">This calculator uses federal ATO income tax brackets, LITO, Medicare levy, and HECS-HELP rates for FY2025-26. SA-specific information (payroll tax, average salaries, cost of living) is sourced from RevenueSA, ABS, and SA Government publications.</p></MethodologyDisclosure>
          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
        </div>
      </div>
    </div>
  );
}
function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) { return (<div className="flex items-center justify-between"><span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span><span className={`${bold ? "font-bold" : "font-medium"} ${highlight ? "text-eucalyptus-dark" : "text-navy"}`}>{value}</span></div>); }
