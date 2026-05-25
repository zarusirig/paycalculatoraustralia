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
const SOURCES_LIST: SourceLink[] = [{ title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name }, { title: "NT Payroll Tax", url: "https://treasury.nt.gov.au/dtf/territory-revenue-office/payroll-tax", publisher: "NT Treasury" }];

export default function PayCalculatorNTPage() {
  const [salary, setSalary] = useState(88_000);
  const [includeHECS, setIncludeHECS] = useState(false);
  const [hasPrivateHealth, setHasPrivateHealth] = useState(true);
  const result = useMemo(() => calculatePayBreakdown({ grossSalary: salary, includeHECS, hasPrivateHealth }), [salary, includeHECS, hasPrivateHealth]);
  return (
    <div className="min-h-screen flex-grow"><div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      <section className="bg-eucalyptus-light/40 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-eucalyptus-light">
        <nav aria-label="breadcrumb"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Pay Calculator NT</span></li></ol></nav>
        <div className="flex items-center gap-3 mt-4 mb-3"><h1 className="text-3xl md:text-4xl font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Pay Calculator NT 2025-26</h1><span className="bg-eucalyptus-dark text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">NT</span></div>
        <p className="text-lg text-warmgray">Calculate your take-home pay in the Northern Territory. NT workers may qualify for the Zone Tax Offset — see how it affects your net pay alongside standard federal tax rates.</p>
        <TrustBar className="mt-4" />
      </section>
      <section className="max-w-4xl mx-auto"><Card className="shadow-md"><CardContent className="p-6 md:p-8"><div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div><label htmlFor="salary" className="block text-sm font-medium text-navy mb-1">Gross Annual Salary</label><div className="flex items-center"><span className="text-warmgray-light mr-2">$</span><input type="number" id="salary" min={0} max={500000} step={1000} value={salary} onChange={(e) => setSalary(clamp(Number(e.target.value || 0), 0, 500000))} className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" /></div><input type="range" min={0} max={300000} step={5000} value={clamp(salary, 0, 300000)} onChange={(e) => setSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" /></div>
          <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={includeHECS} onChange={(e) => setIncludeHECS(e.target.checked)} className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" /><span className="text-navy">Include HECS-HELP</span></label>
          <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={!hasPrivateHealth} onChange={(e) => setHasPrivateHealth(!e.target.checked)} className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" /><span className="text-navy">No private health insurance</span></label>
        </form>
        <div className="space-y-6">
          <div className="bg-eucalyptus-light/40 border border-eucalyptus-light rounded-xl p-6 text-center shadow-sm"><div className="text-sm font-semibold text-eucalyptus-dark uppercase tracking-wider mb-2">Take-Home Pay (NT)</div><div className="text-4xl font-extrabold text-navy">{formatAUD(result.takeHomePay)}</div><div className="text-sm text-warmgray mt-2">{formatAUD(result.monthly)}/month · {formatAUD(result.fortnightly)}/fortnight</div></div>
          <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden"><div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20"><h3 className="font-semibold text-navy text-sm uppercase tracking-wider">Deductions</h3></div><div className="p-5 space-y-3 text-sm"><Row label="Income Tax" value={`-${formatAUD(result.netIncomeTax)}`} /><Row label="Medicare Levy" value={`-${formatAUD(result.medicareLevy)}`} />{result.medicareSurcharge > 0 && <Row label="Medicare Surcharge" value={`-${formatAUD(result.medicareSurcharge)}`} />}{includeHECS && <Row label="HECS Repayment" value={`-${formatAUD(result.hecsRepayment)}`} />}<div className="border-t border-sandstone-dark/20 pt-3" /><Row label="Take-Home Pay" value={formatAUD(result.takeHomePay)} bold highlight /><Row label="Effective Tax Rate" value={formatPercent(result.effectiveTaxRate)} /><Row label="Super (employer-paid)" value={`+${formatAUD(result.superContribution)}`} /></div></div>
        </div>
      </div></CardContent></Card></section>
      <div className="max-w-4xl mx-auto space-y-10">

        {/* ── H2: How Does the NT Pay Calculator Work? ── */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does the NT Pay Calculator Work?</h2>
          <p className="mb-4 text-warmgray">This Australian tax calculator applies FY2025-26 federal income tax brackets, the Medicare levy, and HECS-HELP repayments to your gross salary to produce an accurate take-home pay estimate for Northern Territory workers.</p>
          <p className="mb-4 text-warmgray">Enter your gross annual salary, select whether you carry a HECS-HELP debt, and indicate your private health insurance status. The calculator deducts income tax using the same marginal rates that apply to every Australian resident, then subtracts the <strong>2%</strong> Medicare levy and any applicable &quot;Medicare Levy Surcharge&quot; for high earners without hospital cover. Your employer&apos;s superannuation guarantee contribution of <strong>12%</strong> for the 2025-26 financial year is displayed separately because it is paid on top of your gross salary. Use our <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to model concessional contributions and salary sacrifice scenarios specific to your situation.</p>
          <p className="text-warmgray">The NT pay calculator does not automatically include the &quot;Zone Tax Offset&quot; because zone classification varies by locality. After calculating your base net pay here, refer to the <Link href="/zone-tax-offset/" className="text-eucalyptus-dark hover:underline">Zone Tax Offset</Link> guide to determine the additional rebate available for your postcode.</p>
          <p className="text-warmgray mt-4">Most Northern Territory employees in mining, construction, healthcare and hospitality are covered by federal Fair Work modern awards that set their minimum hourly rate. The award rate is the baseline — many NT workers also receive remote-area district allowances and housing subsidies on top. Look up the FY2025-26 base rates in our <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">Australian award rates guide</Link>; the same federal awards apply in NT, WA, QLD and every other state.</p>
        </section>

        {/* ── H2: What Is the Average Salary in the Northern Territory? ── */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Average Salary in the Northern Territory?</h2>
          <p className="mb-4 text-warmgray">The average full-time salary in the Northern Territory is <strong>$93,000 per year</strong>, approximately 5% below the national average of $98,000 but significantly higher than states such as South Australia and Tasmania.</p>
          <p className="mb-4 text-warmgray">NT salaries are inflated by the dominance of mining, resources, defence, and government administration, all of which pay above-average wages. Many employers also add district allowances, remote-area housing subsidies, and attraction bonuses that push total compensation well above base salary figures. The smaller private sector and higher cost of goods in remote communities contribute to these elevated pay rates.</p>

          <h3 className="text-xl font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Average Salary by Industry in the NT</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border border-sandstone-dark/20 rounded-lg overflow-hidden">
              <thead><tr className="bg-sandstone text-navy"><th className="text-left px-4 py-3 font-semibold">Industry</th><th className="text-right px-4 py-3 font-semibold">Avg. Salary (NT)</th><th className="text-right px-4 py-3 font-semibold">National Avg.</th></tr></thead>
              <tbody className="text-warmgray">
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">Mining &amp; Resources</td><td className="text-right px-4 py-2 font-medium text-navy">$134,000</td><td className="text-right px-4 py-2">$139,000</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">Oil &amp; Gas (LNG)</td><td className="text-right px-4 py-2 font-medium text-navy">$142,000</td><td className="text-right px-4 py-2">$145,000</td></tr>
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">Public Administration &amp; Government</td><td className="text-right px-4 py-2 font-medium text-navy">$102,000</td><td className="text-right px-4 py-2">$96,000</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">Defence &amp; Military</td><td className="text-right px-4 py-2 font-medium text-navy">$98,000</td><td className="text-right px-4 py-2">$95,000</td></tr>
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">Healthcare &amp; Social Assistance</td><td className="text-right px-4 py-2 font-medium text-navy">$88,000</td><td className="text-right px-4 py-2">$82,000</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">Construction</td><td className="text-right px-4 py-2 font-medium text-navy">$95,000</td><td className="text-right px-4 py-2">$89,000</td></tr>
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">Tourism &amp; Hospitality</td><td className="text-right px-4 py-2 font-medium text-navy">$58,000</td><td className="text-right px-4 py-2">$55,000</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">Agriculture &amp; Pastoral</td><td className="text-right px-4 py-2 font-medium text-navy">$62,000</td><td className="text-right px-4 py-2">$60,000</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-warmgray">Mining, oil and gas, and government together account for over <strong>45%</strong> of NT employment. Use our <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> to convert any of these gross figures into after-tax income for your personal situation.</p>
        </section>

        {/* ── H2: How Much Tax Do You Pay in the NT? ── */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much Tax Do You Pay in the NT?</h2>
          <p className="mb-4 text-warmgray">A Northern Territory worker earning <strong>$90,000</strong> pays <strong>$19,717</strong> in income tax for FY2025-26, producing take-home pay of <strong>$68,483</strong> after the Medicare levy.</p>
          <p className="mb-4 text-warmgray">Income tax brackets are set by the federal government and apply identically across all states and territories. The NT does not impose a separate state income tax. The FY2025-26 income tax brackets for Australian residents are:</p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border border-sandstone-dark/20 rounded-lg overflow-hidden">
              <thead><tr className="bg-sandstone text-navy"><th className="text-left px-4 py-3 font-semibold">Taxable Income</th><th className="text-right px-4 py-3 font-semibold">Marginal Rate</th><th className="text-right px-4 py-3 font-semibold">Tax on Bracket</th></tr></thead>
              <tbody className="text-warmgray">
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">$0 &ndash; $18,200</td><td className="text-right px-4 py-2">0%</td><td className="text-right px-4 py-2">$0</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">$18,201 &ndash; $45,000</td><td className="text-right px-4 py-2">16%</td><td className="text-right px-4 py-2">$4,288</td></tr>
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">$45,001 &ndash; $135,000</td><td className="text-right px-4 py-2">30%</td><td className="text-right px-4 py-2">$27,000</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">$135,001 &ndash; $190,000</td><td className="text-right px-4 py-2">37%</td><td className="text-right px-4 py-2">$20,350</td></tr>
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">$190,001+</td><td className="text-right px-4 py-2">45%</td><td className="text-right px-4 py-2">&mdash;</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mb-2 text-warmgray">The worked example below shows how taxation is calculated on a <strong>$90,000</strong> gross salary in the NT:</p>
          <ol className="list-decimal list-inside space-y-1 text-warmgray mb-4">
            <li>First <strong>$18,200</strong> is tax-free: <strong>$0</strong></li>
            <li>Next <strong>$26,800</strong> ($18,201 &ndash; $45,000) taxed at 16%: <strong>$4,288</strong></li>
            <li>Remaining <strong>$45,000</strong> ($45,001 &ndash; $90,000) taxed at 30%: <strong>$13,500</strong></li>
            <li>Gross income tax: <strong>$17,788</strong></li>
            <li>Less &quot;Low Income Tax Offset&quot; (LITO): approximately <strong>-$525</strong></li>
            <li>Net income tax: approximately <strong>$17,263</strong></li>
            <li>Medicare levy at 2%: <strong>$1,800</strong></li>
            <li>Total deductions: approximately <strong>$19,063</strong></li>
            <li>Take-home pay: approximately <strong>$70,937</strong></li>
          </ol>
          <p className="text-warmgray">For a full breakdown at any salary level, see our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> or read the <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">Tax Brackets</Link> guide for FY2025-26 details.</p>
        </section>

        {/* ── H2: What Is NT Payroll Tax? ── */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is NT Payroll Tax?</h2>
          <p className="mb-4 text-warmgray">NT payroll tax is <strong>5.5%</strong> on taxable wages above a <strong>$1,500,000 annual threshold</strong>, payable by the employer only and not deducted from employee take-home pay.</p>
          <p className="mb-4 text-warmgray">The Northern Territory offers one of Australia&apos;s highest payroll tax thresholds, meaning small-to-medium businesses with total annual wages below $1.5 million pay no payroll tax at all. Employers with interstate operations must register and apportion wages across jurisdictions. Exempt categories include wages paid to apprentices during the first 2 years of a training contract, Commonwealth Government wages, and certain Indigenous community organisations.</p>

          <h3 className="text-xl font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does NT Payroll Tax Compare to Other States?</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border border-sandstone-dark/20 rounded-lg overflow-hidden">
              <thead><tr className="bg-sandstone text-navy"><th className="text-left px-4 py-3 font-semibold">State / Territory</th><th className="text-right px-4 py-3 font-semibold">Rate</th><th className="text-right px-4 py-3 font-semibold">Annual Threshold</th></tr></thead>
              <tbody className="text-warmgray">
                <tr className="border-t border-sandstone-dark/10 bg-eucalyptus-light/20 font-medium"><td className="px-4 py-2">Northern Territory</td><td className="text-right px-4 py-2">5.50%</td><td className="text-right px-4 py-2">$1,500,000</td></tr>
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">New South Wales</td><td className="text-right px-4 py-2">5.45%</td><td className="text-right px-4 py-2">$1,200,000</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">Victoria</td><td className="text-right px-4 py-2">4.85%</td><td className="text-right px-4 py-2">$900,000</td></tr>
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">Queensland</td><td className="text-right px-4 py-2">4.75%</td><td className="text-right px-4 py-2">$1,300,000</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">South Australia</td><td className="text-right px-4 py-2">4.95%</td><td className="text-right px-4 py-2">$1,500,000</td></tr>
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">Western Australia</td><td className="text-right px-4 py-2">5.50%</td><td className="text-right px-4 py-2">$1,000,000</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">Tasmania</td><td className="text-right px-4 py-2">4.00%</td><td className="text-right px-4 py-2">$1,250,000</td></tr>
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">ACT</td><td className="text-right px-4 py-2">6.85%</td><td className="text-right px-4 py-2">$2,000,000</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-warmgray">The NT&apos;s <strong>$1,500,000</strong> threshold matches South Australia as the joint-highest outside the ACT. Use our <Link href="/employer-cost-calculator/" className="text-eucalyptus-dark hover:underline">Employer Cost Calculator</Link> to see the total cost of employing staff including payroll tax, superannuation, and workers&apos; compensation.</p>
        </section>

        {/* ── CONTEXT BORDER ── */}

        {/* ── H2: What Is the Cost of Living in Darwin? ── */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Cost of Living in Darwin?</h2>
          <p className="mb-4 text-warmgray">Darwin&apos;s cost of living is <strong>12&ndash;18% lower</strong> than Sydney overall, though groceries and utilities cost more due to freight distances and tropical climate energy demands.</p>
          <p className="mb-4 text-warmgray">Housing is the largest cost difference. Median weekly rent for a 3-bedroom house in Darwin is approximately <strong>$580</strong>, compared to <strong>$750</strong> in Sydney. Median house prices in Darwin sit around <strong>$530,000</strong>, roughly <strong>55%</strong> of Sydney&apos;s $1,150,000 median. Petrol, fresh produce, and dining out are more expensive in Darwin due to supply chain logistics.</p>

          <h3 className="text-xl font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Darwin vs Sydney Cost Comparison</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border border-sandstone-dark/20 rounded-lg overflow-hidden">
              <thead><tr className="bg-sandstone text-navy"><th className="text-left px-4 py-3 font-semibold">Category</th><th className="text-right px-4 py-3 font-semibold">Darwin</th><th className="text-right px-4 py-3 font-semibold">Sydney</th><th className="text-right px-4 py-3 font-semibold">Difference</th></tr></thead>
              <tbody className="text-warmgray">
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">Median House Price</td><td className="text-right px-4 py-2">$530,000</td><td className="text-right px-4 py-2">$1,150,000</td><td className="text-right px-4 py-2 text-eucalyptus-dark font-medium">-54%</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">Weekly Rent (3-bed)</td><td className="text-right px-4 py-2">$580</td><td className="text-right px-4 py-2">$750</td><td className="text-right px-4 py-2 text-eucalyptus-dark font-medium">-23%</td></tr>
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">Monthly Groceries (family)</td><td className="text-right px-4 py-2">$1,050</td><td className="text-right px-4 py-2">$950</td><td className="text-right px-4 py-2 text-red-600 font-medium">+11%</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">Electricity (quarterly)</td><td className="text-right px-4 py-2">$520</td><td className="text-right px-4 py-2">$420</td><td className="text-right px-4 py-2 text-red-600 font-medium">+24%</td></tr>
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">Petrol (per litre)</td><td className="text-right px-4 py-2">$1.95</td><td className="text-right px-4 py-2">$1.85</td><td className="text-right px-4 py-2 text-red-600 font-medium">+5%</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">Monthly Transport</td><td className="text-right px-4 py-2">$120</td><td className="text-right px-4 py-2">$210</td><td className="text-right px-4 py-2 text-eucalyptus-dark font-medium">-43%</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What About Remote NT Locations?</h3>
          <p className="text-warmgray">Remote NT communities such as Alice Springs, Katherine, Tennant Creek, and Nhulunbuy face significantly higher living costs than Darwin. Groceries in remote stores cost <strong>30&ndash;60%</strong> more than Darwin supermarkets. Fuel prices in communities like Yuendumu and Wadeye regularly exceed <strong>$2.50 per litre</strong>. Housing in these locations is typically employer-provided or government-subsidised, offsetting the elevated costs. Workers stationed in remote NT areas qualify for higher &quot;Zone Tax Offset&quot; amounts and often receive district allowances of <strong>$3,000&ndash;$15,000</strong> per year on top of their base salary.</p>
        </section>

        {/* ── H2: Who Are the Major Employers in the Northern Territory? ── */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Are the Major Employers in the Northern Territory?</h2>
          <p className="mb-4 text-warmgray">The Northern Territory Government is the largest single employer in the NT, directly employing over <strong>21,000</strong> public servants across health, education, police, and infrastructure portfolios.</p>
          <p className="mb-4 text-warmgray">Other major employers span defence, resources, and services:</p>
          <ul className="list-disc list-inside space-y-1 text-warmgray mb-4">
            <li><strong>Australian Defence Force</strong> &ndash; Robertson Barracks (Darwin) and RAAF Base Tindal (Katherine) employ approximately <strong>12,000</strong> military and civilian personnel</li>
            <li><strong>INPEX (Ichthys LNG)</strong> &ndash; operates the Ichthys LNG facility near Darwin, employing over <strong>3,500</strong> workers</li>
            <li><strong>Santos</strong> &ndash; Barossa gas project and Darwin LNG plant</li>
            <li><strong>Newmont Mining</strong> &ndash; operates the Granites gold mine in the Tanami Desert</li>
            <li><strong>Royal Darwin Hospital</strong> &ndash; the NT&apos;s largest tertiary hospital with over <strong>2,500</strong> staff</li>
            <li><strong>Charles Darwin University</strong> &ndash; the sole university in the NT, employing approximately <strong>1,800</strong> academic and support staff</li>
            <li><strong>Voyages Indigenous Tourism</strong> &ndash; manages Ayers Rock Resort and employs over <strong>1,000</strong> workers, many in remote locations</li>
          </ul>
          <p className="text-warmgray">Government and defence together represent over <strong>40%</strong> of NT employment. The resources sector contributes approximately <strong>$7.8 billion</strong> annually to Gross Territory Product. Use our <Link href="/pay-calculator-wa/" className="text-eucalyptus-dark hover:underline">Pay Calculator WA</Link> to compare mining salary outcomes with Western Australia, the other major resources jurisdiction.</p>
        </section>

        {/* ── H2: What State-Specific Benefits Apply in the NT? ── */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What State-Specific Benefits Apply in the NT?</h2>
          <p className="mb-4 text-warmgray">The &quot;Zone Tax Offset&quot; is the most significant tax benefit for NT residents, reducing assessable income tax by up to <strong>$1,173</strong> per year for Zone A locations and <strong>$57&ndash;$338</strong> for Zone B areas including Darwin.</p>
          <p className="mb-4 text-warmgray">The Zone Tax Offset applies to anyone who lives or works in designated remote or isolated areas for at least 183 days in a financial year. The ATO classifies NT locations into two zones:</p>
          <ul className="list-disc list-inside space-y-1 text-warmgray mb-4">
            <li><strong>Zone A</strong> (higher offset) &ndash; Alice Springs, Katherine, Tennant Creek, Nhulunbuy, Jabiru, and most communities outside Darwin</li>
            <li><strong>Zone B</strong> (lower offset) &ndash; Darwin, Palmerston, and surrounding suburbs</li>
            <li><strong>Special Zone</strong> (highest offset) &ndash; particularly remote locations more than 250 km from a population centre of 2,500 people</li>
          </ul>
          <p className="mb-4 text-warmgray">Additional NT-specific benefits include:</p>
          <ul className="list-disc list-inside space-y-1 text-warmgray mb-4">
            <li><strong>First Home Owner Grant</strong> &ndash; the NT offers <strong>$10,000</strong> for purchasing or building a new home valued under $750,000</li>
            <li><strong>HomeNorth scheme</strong> &ndash; shared equity home loans for essential workers earning below $122,500</li>
            <li><strong>Territory stamp duty concessions</strong> &ndash; first home buyers pay no stamp duty on properties valued up to $650,000</li>
            <li><strong>Remote area electricity subsidies</strong> &ndash; the NT Government subsidises electricity in off-grid communities, reducing utility costs for remote workers</li>
          </ul>
          <p className="text-warmgray">The Zone Tax Offset is claimed through your annual tax return, not through PAYG withholding. Read our <Link href="/zone-tax-offset/" className="text-eucalyptus-dark hover:underline">Zone Tax Offset</Link> guide for the full schedule of offset amounts by zone classification.</p>
        </section>

        {/* ── H2: Frequently Asked Questions ── */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
          <Accordion type="multiple" className="space-y-3">
            <AccordionItem value="diff" className="rounded-xl border border-sandstone-dark/20 px-5"><AccordionTrigger>Is income tax different in the NT?</AccordionTrigger><AccordionContent><p className="text-warmgray">No. Federal income tax rates and brackets are identical across all Australian states and territories for FY2025-26. A worker earning $90,000 in Darwin pays the same income tax as a worker earning $90,000 in Sydney. The only NT-specific tax benefit is the Zone Tax Offset, which reduces your tax bill by up to <strong>$1,173</strong> depending on your location.</p></AccordionContent></AccordionItem>
            <AccordionItem value="remote" className="rounded-xl border border-sandstone-dark/20 px-5"><AccordionTrigger>What are remote area allowances in the NT?</AccordionTrigger><AccordionContent><p className="text-warmgray">Many NT employers offer district allowances of <strong>$3,000&ndash;$15,000</strong> per year for remote or isolated postings. These allowances cover higher living costs and typically include housing subsidies, airfare allowances, and attraction/retention bonuses. District allowances are assessable income and must be declared on your tax return.</p></AccordionContent></AccordionItem>
            <AccordionItem value="zone" className="rounded-xl border border-sandstone-dark/20 px-5"><AccordionTrigger>How do I claim the Zone Tax Offset?</AccordionTrigger><AccordionContent><p className="text-warmgray">Claim the Zone Tax Offset at Question T3 in your individual tax return. You must have lived or worked in a designated zone for <strong>183 days or more</strong> during the financial year. The offset is not applied through PAYG withholding, so it is received as a lump-sum reduction when you lodge your return.</p></AccordionContent></AccordionItem>
            <AccordionItem value="super" className="rounded-xl border border-sandstone-dark/20 px-5"><AccordionTrigger>How much superannuation does my NT employer pay?</AccordionTrigger><AccordionContent><p className="text-warmgray">Every Australian employer pays the superannuation guarantee at <strong>12%</strong> of ordinary time earnings for FY2025-26. This rate applies nationally. NT Government employees receive <strong>12%</strong> under the standard scheme. Superannuation is paid on top of your gross salary and does not reduce your take-home pay.</p></AccordionContent></AccordionItem>
            <AccordionItem value="payroll" className="rounded-xl border border-sandstone-dark/20 px-5"><AccordionTrigger>Do NT employees pay payroll tax?</AccordionTrigger><AccordionContent><p className="text-warmgray">No. Payroll tax is an employer obligation calculated on total taxable wages above <strong>$1,500,000</strong>. It does not appear on your payslip and has no impact on your gross or net pay. The NT payroll tax rate is <strong>5.5%</strong>.</p></AccordionContent></AccordionItem>
            <AccordionItem value="hecs" className="rounded-xl border border-sandstone-dark/20 px-5"><AccordionTrigger>Does HECS-HELP affect my NT take-home pay?</AccordionTrigger><AccordionContent><p className="text-warmgray">Yes. HECS-HELP repayments are compulsory once your repayment income exceeds <strong>$54,435</strong> for FY2025-26. The repayment rate ranges from <strong>1% to 10%</strong> of your total repayment income. Tick the HECS-HELP checkbox in the calculator above to see the impact on your after-tax income.</p></AccordionContent></AccordionItem>
            <AccordionItem value="medicare" className="rounded-xl border border-sandstone-dark/20 px-5"><AccordionTrigger>Is the Medicare levy different in the NT?</AccordionTrigger><AccordionContent><p className="text-warmgray">No. The Medicare levy is a federal charge of <strong>2%</strong> of taxable income, applied uniformly across Australia. NT residents without private hospital insurance and earning above <strong>$93,000</strong> (singles) also pay the &quot;Medicare Levy Surcharge&quot; of <strong>1&ndash;1.5%</strong>. Read our <Link href="/medicare-levy/" className="text-eucalyptus-dark hover:underline">Medicare Levy</Link> guide for full thresholds.</p></AccordionContent></AccordionItem>
            <AccordionItem value="compare" className="rounded-xl border border-sandstone-dark/20 px-5"><AccordionTrigger>How does NT take-home pay compare to other states?</AccordionTrigger><AccordionContent><p className="text-warmgray">Take-home pay on the same gross salary is identical across all states because income tax is federal. The difference is purchasing power: Darwin&apos;s lower housing costs mean a $90,000 salary stretches further than in Sydney or Melbourne, despite higher grocery and utility expenses. NT workers in remote zones also benefit from the Zone Tax Offset, which provides an additional <strong>$57&ndash;$1,173</strong> in annual tax savings that workers in major metro areas do not receive.</p></AccordionContent></AccordionItem>
          </Accordion>
        </section>

        <MethodologyDisclosure><p className="text-sm">This calculator uses FY2025-26 federal tax brackets, LITO, Medicare levy, and HECS-HELP repayment rates. Zone Tax Offset is not included in the automated calculation due to location-dependent classification. NT payroll tax and salary data are sourced from NT Treasury and ABS.</p></MethodologyDisclosure>
        <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
      </div>
    </div></div>
  );
}
function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) { return (<div className="flex items-center justify-between"><span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span><span className={`${bold ? "font-bold" : "font-medium"} ${highlight ? "text-eucalyptus-dark" : "text-navy"}`}>{value}</span></div>); }
