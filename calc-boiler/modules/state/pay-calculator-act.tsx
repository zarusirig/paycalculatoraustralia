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
const SOURCES_LIST: SourceLink[] = [{ title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name }, { title: "ACT Payroll Tax", url: "https://www.revenue.act.gov.au/payroll-tax", publisher: "ACT Revenue Office" }];

export default function PayCalculatorACTPage() {
  const [salary, setSalary] = useState(95_000);
  const [includeHECS, setIncludeHECS] = useState(false);
  const [hasPrivateHealth, setHasPrivateHealth] = useState(true);
  const result = useMemo(() => calculatePayBreakdown({ grossSalary: salary, includeHECS, hasPrivateHealth }), [salary, includeHECS, hasPrivateHealth]);
  return (
    <div className="min-h-screen flex-grow"><div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      <section className="bg-eucalyptus-light/40 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-eucalyptus-light">
        <nav aria-label="breadcrumb"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Pay Calculator ACT</span></li></ol></nav>
        <div className="flex items-center gap-3 mt-4 mb-3"><h1 className="text-3xl md:text-4xl font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Pay Calculator ACT 2025-26</h1><span className="bg-eucalyptus-dark text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">ACT</span></div>
        <p className="text-lg text-warmgray">Calculate your take-home pay in the ACT. Canberra has Australia&apos;s highest average salaries — see how federal tax rates apply to your ACT income.</p>
        <TrustBar className="mt-4" />
      </section>
      <section className="max-w-4xl mx-auto"><Card className="shadow-md"><CardContent className="p-6 md:p-8"><div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div><label htmlFor="salary" className="block text-sm font-medium text-navy mb-1">Gross Annual Salary</label><div className="flex items-center"><span className="text-warmgray-light mr-2">$</span><input type="number" id="salary" min={0} max={500000} step={1000} value={salary} onChange={(e) => setSalary(clamp(Number(e.target.value || 0), 0, 500000))} className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" /></div><input type="range" min={0} max={300000} step={5000} value={clamp(salary, 0, 300000)} onChange={(e) => setSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" /></div>
          <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={includeHECS} onChange={(e) => setIncludeHECS(e.target.checked)} className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" /><span className="text-navy">Include HECS-HELP</span></label>
          <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={!hasPrivateHealth} onChange={(e) => setHasPrivateHealth(!e.target.checked)} className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" /><span className="text-navy">No private health insurance</span></label>
        </form>
        <div className="space-y-6">
          <div className="bg-eucalyptus-light/40 border border-eucalyptus-light rounded-xl p-6 text-center shadow-sm"><div className="text-sm font-semibold text-eucalyptus-dark uppercase tracking-wider mb-2">Take-Home Pay (ACT)</div><div className="text-4xl font-extrabold text-navy">{formatAUD(result.takeHomePay)}</div><div className="text-sm text-warmgray mt-2">{formatAUD(result.monthly)}/month · {formatAUD(result.fortnightly)}/fortnight</div></div>
          <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden"><div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20"><h3 className="font-semibold text-navy text-sm uppercase tracking-wider">Deductions</h3></div><div className="p-5 space-y-3 text-sm"><Row label="Income Tax" value={`-${formatAUD(result.netIncomeTax)}`} /><Row label="Medicare Levy" value={`-${formatAUD(result.medicareLevy)}`} />{result.medicareSurcharge > 0 && <Row label="Medicare Surcharge" value={`-${formatAUD(result.medicareSurcharge)}`} />}{includeHECS && <Row label="HECS Repayment" value={`-${formatAUD(result.hecsRepayment)}`} />}<div className="border-t border-sandstone-dark/20 pt-3" /><Row label="Take-Home Pay" value={formatAUD(result.takeHomePay)} bold highlight /><Row label="Effective Tax Rate" value={formatPercent(result.effectiveTaxRate)} /><Row label="Super (employer-paid)" value={`+${formatAUD(result.superContribution)}`} /></div></div>
        </div>
      </div></CardContent></Card></section>
      <div className="max-w-4xl mx-auto space-y-10">

        {/* H2: How Does the ACT Pay Calculator Work? */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does the ACT Pay Calculator Work?</h2>
          <p className="mb-4 text-warmgray">This Australian tax calculator converts your gross annual salary into after-tax income using FY2025-26 federal tax rates, the <strong>2% Medicare levy</strong>, and optional HECS-HELP repayments.</p>
          <p className="mb-4 text-warmgray">Personal income tax in the ACT is identical to every other state and territory. The ATO sets one national schedule of <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">income tax brackets</Link> that applies whether you work in Canberra, Sydney, or Darwin. The ACT pay calculator applies those brackets to your gross salary, subtracts the Medicare levy and any applicable &quot;Medicare Levy Surcharge,&quot; then displays your take-home pay on an annual, monthly, and fortnightly basis.</p>
          <p className="text-warmgray">Superannuation of <strong>12%</strong> (the SG rate for FY2025-26) is shown separately because your employer pays it on top of your gross salary. Use our <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to model concessional contributions and salary sacrifice scenarios.</p>
          <p className="text-warmgray mt-4">A note on award coverage in the ACT: many Canberra workers are Australian Public Service employees covered by APS enterprise agreements rather than modern awards, but private-sector workers in retail, hospitality, construction and professional services in the ACT are still covered by federal Fair Work modern awards. See our <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">Australian award rates guide</Link> for the FY2025-26 minimum rates by industry — these rates apply identically across the ACT, NSW, VIC and every other state.</p>
        </section>

        {/* H2: What Is the Average Salary in the ACT? */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Average Salary in the ACT?</h2>
          <p className="mb-4 text-warmgray">The average full-time salary in the ACT is <strong>$105,000 per year</strong>, the highest of any state or territory and approximately 7% above the national average of $98,000.</p>
          <p className="mb-4 text-warmgray">Canberra&apos;s salary premium is driven by the concentration of Australian Public Service (APS) roles, which make up roughly 30% of all employment in the territory. APS positions offer structured pay scales, guaranteed annual increments, and superannuation contributions of <strong>15.4%</strong> under the PSSap scheme &mdash; significantly above the standard 12% SG rate. The defence, higher education, and cybersecurity sectors further elevate ACT earnings.</p>

          {/* H3: Average Salary by Industry */}
          <h3 className="text-xl font-semibold text-navy mt-8 mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Average Salary by Industry in the ACT</h3>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm text-left">
              <thead className="bg-sandstone text-navy uppercase tracking-wider text-xs">
                <tr><th className="px-4 py-3">Industry</th><th className="px-4 py-3 text-right">Avg. Salary (ACT)</th><th className="px-4 py-3 text-right">National Avg.</th></tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10 text-warmgray">
                <tr className="bg-eucalyptus-light/20"><td className="px-4 py-3 font-medium text-navy">Public Administration &amp; Safety</td><td className="px-4 py-3 text-right font-semibold">$115,000</td><td className="px-4 py-3 text-right">$92,000</td></tr>
                <tr><td className="px-4 py-3">Professional, Scientific &amp; Technical</td><td className="px-4 py-3 text-right font-semibold">$120,000</td><td className="px-4 py-3 text-right">$105,000</td></tr>
                <tr><td className="px-4 py-3">Information &amp; Communications Technology</td><td className="px-4 py-3 text-right font-semibold">$118,000</td><td className="px-4 py-3 text-right">$110,000</td></tr>
                <tr><td className="px-4 py-3">Defence &amp; National Security</td><td className="px-4 py-3 text-right font-semibold">$112,000</td><td className="px-4 py-3 text-right">$95,000</td></tr>
                <tr><td className="px-4 py-3">Education &amp; Training</td><td className="px-4 py-3 text-right font-semibold">$98,000</td><td className="px-4 py-3 text-right">$88,000</td></tr>
                <tr><td className="px-4 py-3">Health Care &amp; Social Assistance</td><td className="px-4 py-3 text-right font-semibold">$95,000</td><td className="px-4 py-3 text-right">$85,000</td></tr>
                <tr><td className="px-4 py-3">Construction</td><td className="px-4 py-3 text-right font-semibold">$92,000</td><td className="px-4 py-3 text-right">$88,000</td></tr>
                <tr><td className="px-4 py-3">Retail Trade</td><td className="px-4 py-3 text-right font-semibold">$58,000</td><td className="px-4 py-3 text-right">$55,000</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-warmgray-light italic">Source: ABS Average Weekly Earnings and APS Remuneration Reports. Figures are rounded full-time annual equivalents.</p>
        </section>

        {/* H2: How Much Tax Do You Pay in the ACT? */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much Tax Do You Pay in the ACT?</h2>
          <p className="mb-4 text-warmgray">A Canberra employee earning <strong>$100,000</strong> per year pays <strong>$22,967</strong> in federal income tax plus <strong>$2,000</strong> in Medicare levy for FY2025-26, leaving take-home pay of <strong>$75,033</strong>.</p>
          <p className="mb-4 text-warmgray">The calculation uses the same <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">FY2025-26 income tax brackets</Link> that apply in every state. Here is the step-by-step breakdown for a $100,000 gross salary with no HECS-HELP debt and private health insurance:</p>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm text-left">
              <thead className="bg-sandstone text-navy uppercase tracking-wider text-xs">
                <tr><th className="px-4 py-3">Component</th><th className="px-4 py-3 text-right">Amount</th></tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10 text-warmgray">
                <tr><td className="px-4 py-3">Gross Salary</td><td className="px-4 py-3 text-right font-semibold text-navy">$100,000</td></tr>
                <tr><td className="px-4 py-3">Tax on $18,201 &ndash; $45,000 (16%)</td><td className="px-4 py-3 text-right">-$4,288</td></tr>
                <tr><td className="px-4 py-3">Tax on $45,001 &ndash; $100,000 (30%)</td><td className="px-4 py-3 text-right">-$16,500</td></tr>
                <tr><td className="px-4 py-3">Gross Tax</td><td className="px-4 py-3 text-right">-$20,788</td></tr>
                <tr><td className="px-4 py-3">LITO Offset</td><td className="px-4 py-3 text-right text-eucalyptus-dark">+$0</td></tr>
                <tr><td className="px-4 py-3">Net Income Tax</td><td className="px-4 py-3 text-right font-semibold">-$22,967</td></tr>
                <tr><td className="px-4 py-3">Medicare Levy (2%)</td><td className="px-4 py-3 text-right">-$2,000</td></tr>
                <tr className="bg-eucalyptus-light/20"><td className="px-4 py-3 font-semibold text-navy">Take-Home Pay</td><td className="px-4 py-3 text-right font-bold text-eucalyptus-dark">$75,033</td></tr>
                <tr><td className="px-4 py-3">Effective Tax Rate</td><td className="px-4 py-3 text-right font-semibold">24.97%</td></tr>
                <tr><td className="px-4 py-3">Super (12%, employer-paid)</td><td className="px-4 py-3 text-right">+$12,000</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-warmgray">Employees without private health insurance who earn above <strong>$93,000</strong> (singles) also pay the &quot;Medicare Levy Surcharge&quot; of 1&ndash;1.5%, increasing total deductions. Use the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to model different salary levels.</p>
        </section>

        {/* H2: What Is ACT Payroll Tax? */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is ACT Payroll Tax?</h2>
          <p className="mb-4 text-warmgray">ACT payroll tax is <strong>6.85%</strong> on taxable wages above a <strong>$2,000,000 annual threshold</strong>, paid exclusively by employers and administered by the ACT Revenue Office.</p>
          <p className="mb-4 text-warmgray">The ACT threshold is the highest in Australia, exempting the majority of small and medium businesses. Payroll tax does not reduce your take-home pay &mdash; it is an employer-only obligation. However, larger employers factor payroll tax into total employment costs, which indirectly influences salary budgets and hiring capacity.</p>

          {/* H3: ACT vs Other States Payroll Tax */}
          <h3 className="text-xl font-semibold text-navy mt-8 mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does ACT Payroll Tax Compare to Other States?</h3>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm text-left">
              <thead className="bg-sandstone text-navy uppercase tracking-wider text-xs">
                <tr><th className="px-4 py-3">State / Territory</th><th className="px-4 py-3 text-right">Rate</th><th className="px-4 py-3 text-right">Annual Threshold</th></tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10 text-warmgray">
                <tr className="bg-eucalyptus-light/20"><td className="px-4 py-3 font-medium text-navy">ACT</td><td className="px-4 py-3 text-right font-semibold">6.85%</td><td className="px-4 py-3 text-right font-semibold">$2,000,000</td></tr>
                <tr><td className="px-4 py-3"><Link href="/pay-calculator-nsw/" className="text-eucalyptus-dark hover:underline">NSW</Link></td><td className="px-4 py-3 text-right">5.45%</td><td className="px-4 py-3 text-right">$1,200,000</td></tr>
                <tr><td className="px-4 py-3"><Link href="/pay-calculator-vic/" className="text-eucalyptus-dark hover:underline">VIC</Link></td><td className="px-4 py-3 text-right">4.85%</td><td className="px-4 py-3 text-right">$900,000</td></tr>
                <tr><td className="px-4 py-3"><Link href="/pay-calculator-qld/" className="text-eucalyptus-dark hover:underline">QLD</Link></td><td className="px-4 py-3 text-right">4.75%</td><td className="px-4 py-3 text-right">$1,300,000</td></tr>
                <tr><td className="px-4 py-3">WA</td><td className="px-4 py-3 text-right">5.50%</td><td className="px-4 py-3 text-right">$1,000,000</td></tr>
                <tr><td className="px-4 py-3">SA</td><td className="px-4 py-3 text-right">4.95%</td><td className="px-4 py-3 text-right">$1,500,000</td></tr>
                <tr><td className="px-4 py-3">TAS</td><td className="px-4 py-3 text-right">4.00%</td><td className="px-4 py-3 text-right">$1,250,000</td></tr>
                <tr><td className="px-4 py-3">NT</td><td className="px-4 py-3 text-right">5.50%</td><td className="px-4 py-3 text-right">$1,500,000</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-warmgray">The ACT&apos;s <strong>$2 million</strong> threshold means a business with a total annual wage bill under that amount pays zero payroll tax. In contrast, a Victorian employer exceeding $900,000 in wages already triggers liability at 4.85%.</p>
        </section>

        {/* --- CONTEXT BORDER --- */}

        {/* H2: What Is the Cost of Living in Canberra? */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Cost of Living in Canberra?</h2>
          <p className="mb-4 text-warmgray">Canberra&apos;s cost of living is <strong>8&ndash;12% lower than Sydney</strong> across housing, groceries, and transport, making the ACT&apos;s higher salaries stretch further in real purchasing power.</p>
          <p className="mb-4 text-warmgray">Median rent for a two-bedroom apartment in Canberra&apos;s inner suburbs (Braddon, Kingston, Barton) sits at approximately <strong>$550 per week</strong>, compared to $680 per week in inner Sydney. Mortgage repayments reflect a median house price of around <strong>$870,000</strong> in Canberra versus $1,150,000 in Sydney. Grocery and utility costs are comparable, though Canberra&apos;s electricity prices trend <strong>5&ndash;8%</strong> lower due to the ACT&apos;s 100% renewable electricity supply target.</p>

          {/* H3: Canberra vs Sydney Comparison */}
          <h3 className="text-xl font-semibold text-navy mt-8 mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does Canberra Compare to Sydney?</h3>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm text-left">
              <thead className="bg-sandstone text-navy uppercase tracking-wider text-xs">
                <tr><th className="px-4 py-3">Category</th><th className="px-4 py-3 text-right">Canberra</th><th className="px-4 py-3 text-right">Sydney</th></tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10 text-warmgray">
                <tr><td className="px-4 py-3">Avg. Full-Time Salary</td><td className="px-4 py-3 text-right font-semibold">$105,000</td><td className="px-4 py-3 text-right">$98,000</td></tr>
                <tr><td className="px-4 py-3">Median House Price</td><td className="px-4 py-3 text-right font-semibold">$870,000</td><td className="px-4 py-3 text-right">$1,150,000</td></tr>
                <tr><td className="px-4 py-3">2-Bed Apartment Rent (pw)</td><td className="px-4 py-3 text-right font-semibold">$550</td><td className="px-4 py-3 text-right">$680</td></tr>
                <tr><td className="px-4 py-3">Monthly Public Transport</td><td className="px-4 py-3 text-right font-semibold">$120</td><td className="px-4 py-3 text-right">$200</td></tr>
                <tr><td className="px-4 py-3">Weekly Groceries (2 adults)</td><td className="px-4 py-3 text-right font-semibold">$220</td><td className="px-4 py-3 text-right">$240</td></tr>
                <tr><td className="px-4 py-3">Childcare (daily)</td><td className="px-4 py-3 text-right font-semibold">$130</td><td className="px-4 py-3 text-right">$150</td></tr>
              </tbody>
            </table>
          </div>

          {/* H3: Surrounding NSW Regions */}
          <h3 className="text-xl font-semibold text-navy mt-8 mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What About Surrounding NSW Regions?</h3>
          <p className="text-warmgray">Many ACT workers live across the border in Queanbeyan, Yass, and Bungendore in New South Wales. Median house prices in Queanbeyan average <strong>$750,000</strong>, roughly 14% below Canberra. Yass and Murrumbateman offer prices closer to <strong>$650,000</strong>. Cross-border employees pay the same federal income tax rates regardless of which side they live on, but stamp duty on property purchases follows NSW rates (which differ from ACT rates). Use our <Link href="/pay-calculator-nsw/" className="text-eucalyptus-dark hover:underline">Pay Calculator NSW</Link> to compare net pay scenarios for employees based in surrounding regions.</p>
        </section>

        {/* H2: Who Are the Major Employers in the ACT? */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Are the Major Employers in the ACT?</h2>
          <p className="mb-4 text-warmgray">The Australian Public Service (APS) is the ACT&apos;s largest employer, with approximately <strong>95,000 federal public servants</strong> based in Canberra across departments including Defence, Home Affairs, and Services Australia.</p>
          <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
            <li><strong>Australian Public Service (APS)</strong> &mdash; 95,000+ employees across 100+ departments and agencies</li>
            <li><strong>Australian Defence Force (ADF)</strong> &mdash; Russell Offices, ADFA, and the Australian War Memorial</li>
            <li><strong>Australian National University (ANU)</strong> &mdash; 5,500 staff, the ACT&apos;s largest non-government employer</li>
            <li><strong>University of Canberra (UC)</strong> &mdash; 1,800 staff in teaching, research, and professional services</li>
            <li><strong>Canberra Health Services</strong> &mdash; 7,500+ employees across Canberra Hospital and Calvary Public Hospital</li>
            <li><strong>ACT Government</strong> &mdash; 25,000 employees in territory-level education, transport, and planning</li>
            <li><strong>Technology Sector</strong> &mdash; companies including Leidos, Accenture, and Northrop Grumman operate cybersecurity and IT hubs</li>
            <li><strong>National Institutions</strong> &mdash; the National Gallery, National Library, CSIRO, and Geoscience Australia</li>
          </ul>
          <p className="text-warmgray">The dominance of government and institutional employment means ACT salaries are less volatile during economic downturns compared to mining-dependent states like WA or QLD. For employees considering salary sacrifice arrangements common in the public sector, use the <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> to model the net pay impact.</p>
        </section>

        {/* H2: What State-Specific Benefits Apply in the ACT? */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What State-Specific Benefits Apply in the ACT?</h2>
          <p className="mb-4 text-warmgray">ACT residents access several territory-specific concessions that reduce living costs, including stamp duty abolition, energy rebates, and first home buyer grants worth up to <strong>$7,000</strong>.</p>
          <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
            <li><strong>Stamp Duty Reform</strong> &mdash; The ACT is progressively abolishing stamp duty on property purchases, replacing it with higher annual land tax (general rates). Buyers purchasing off-the-plan or newly built properties already benefit from reduced or zero stamp duty.</li>
            <li><strong>Home Buyer Concession Scheme</strong> &mdash; First home buyers purchasing properties valued up to $1,000,000 receive stamp duty concessions. The income threshold for eligibility is <strong>$160,000</strong> for individuals and $227,000 for couples.</li>
            <li><strong>Energy Efficiency Scheme</strong> &mdash; The ACT&apos;s 100% renewable electricity target delivers competitive energy pricing. Households may also access rebates for battery storage, rooftop solar, and energy-efficient appliances.</li>
            <li><strong>APS Superannuation</strong> &mdash; Federal public servants under the PSSap scheme receive employer super contributions of <strong>15.4%</strong>, compared to the standard SG rate of 12%. This adds <strong>$3,400 per year</strong> in additional super for an employee on $100,000. Learn more in our <Link href="/superannuation-guide/" className="text-eucalyptus-dark hover:underline">Superannuation Guide</Link>.</li>
            <li><strong>Utilities Concession</strong> &mdash; Eligible concession card holders in the ACT receive an annual rebate of up to <strong>$750</strong> on electricity, gas, and water bills.</li>
          </ul>
          <p className="text-warmgray">The ACT does not impose land tax on owner-occupied properties. Investment property owners pay land tax based on the &quot;Average Unimproved Value&quot; of the land, with marginal rates ranging from <strong>0.54% to 1.12%</strong>.</p>
        </section>

        {/* H2: Frequently Asked Questions */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
          <Accordion type="multiple" className="space-y-3">
            <AccordionItem value="diff" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger className="text-left text-base font-medium text-navy">Is income tax different in the ACT?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">No. Federal income tax rates apply uniformly across all states and territories. Your take-home pay in Canberra is calculated using the same <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">income tax brackets</Link> as in Sydney, Melbourne, or Brisbane. The ACT does not levy any additional state or territory income tax.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="aps" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger className="text-left text-base font-medium text-navy">Why are ACT salaries the highest in Australia?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">The concentration of Australian Public Service (APS) roles drives the ACT&apos;s salary premium. Government positions offer structured pay scales starting at APS Level 3 (approximately <strong>$72,000</strong>) up to Senior Executive Service Band 3 (over <strong>$350,000</strong>). The defence, cybersecurity, and higher education sectors further elevate the territory&apos;s average earnings above the national benchmark.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="payrolltax" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger className="text-left text-base font-medium text-navy">Does ACT payroll tax affect my take-home pay?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">No. Payroll tax is an employer-only obligation. The ACT rate of <strong>6.85%</strong> applies to businesses with total annual wages exceeding $2,000,000. It does not appear on your payslip and does not reduce your net pay after tax.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="super" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger className="text-left text-base font-medium text-navy">Do APS employees get higher superannuation?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">Yes. Most APS employees enrolled in the PSSap scheme receive employer superannuation contributions of <strong>15.4%</strong>, compared to the standard SG rate of 12% in FY2025-26. On a salary of $100,000, this equates to an extra <strong>$3,400 per year</strong> in super contributions. Employees in the older CSS or PSS defined-benefit schemes receive different entitlements.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="hecs" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger className="text-left text-base font-medium text-navy">How does HECS-HELP affect take-home pay in the ACT?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">HECS-HELP repayments are compulsory once your repayment income exceeds <strong>$69,528</strong> for FY2025-26. The repayment rate ranges from <strong>1% to 10%</strong> of your total income. On a Canberra salary of $100,000, the HECS repayment is <strong>$4,500</strong> per year, reducing take-home pay to approximately <strong>$70,533</strong>. Use the <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> for exact figures.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="crossborder" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger className="text-left text-base font-medium text-navy">Do I pay different tax if I live in Queanbeyan but work in Canberra?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">No. Your income tax, Medicare levy, and HECS-HELP obligations are determined by the ATO at the federal level and do not change based on your residential address. Cross-border commuters from Queanbeyan, Yass, or Bungendore pay the same taxation as Canberra residents. The difference applies to state-level charges like stamp duty (NSW rates) and vehicle registration (NSW rates).</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="medicare" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger className="text-left text-base font-medium text-navy">What is the Medicare Levy Surcharge in the ACT?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">The &quot;Medicare Levy Surcharge&quot; (MLS) is a federal charge of <strong>1&ndash;1.5%</strong> that applies to taxpayers without private hospital cover who earn above <strong>$93,000</strong> (singles) or $186,000 (families). It is separate from the standard 2% Medicare levy. In the ACT, where average salaries exceed $100,000, many employees are liable for the MLS unless they hold a compliant private health insurance policy.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="costliving" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger className="text-left text-base font-medium text-navy">Is Canberra expensive compared to other capital cities?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">Canberra&apos;s cost of living is <strong>8&ndash;12% lower than Sydney</strong> and comparable to Melbourne and Brisbane. Higher average salaries combined with lower housing costs mean Canberra workers retain more disposable salary. Median rent for a two-bedroom apartment is approximately <strong>$550 per week</strong>, and the median house price sits at <strong>$870,000</strong> &mdash; significantly below Sydney&apos;s $1,150,000.</p></AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <MethodologyDisclosure><p className="text-sm">This calculator uses FY2025-26 federal tax brackets. ACT data sourced from ACT Revenue Office and ABS.</p></MethodologyDisclosure>
        <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
      </div>
    </div></div>
  );
}
function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) { return (<div className="flex items-center justify-between"><span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span><span className={`${bold ? "font-bold" : "font-medium"} ${highlight ? "text-eucalyptus-dark" : "text-navy"}`}>{value}</span></div>); }
