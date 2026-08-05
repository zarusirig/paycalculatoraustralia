"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { calculatePayBreakdown, formatAUD, formatPercent, SOURCES, SITE_CONFIG, STATE_PAYROLL_TAX } from "@/lib/constants";
function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)); }

/** Display order for the cross-state payroll tax comparison table (home state first). */
const PAYROLL_COMPARE_ORDER = ["TAS", "NSW", "VIC", "QLD", "SA", "WA", "ACT", "NT"] as const;
const SOURCES_LIST: SourceLink[] = [{ title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name }, { title: "TAS Payroll Tax", url: "https://www.sro.tas.gov.au/payroll-tax", publisher: "State Revenue Office Tasmania" }];

export default function PayCalculatorTASPage() {
  const [salary, setSalary] = useState(80_000);
  const [includeHECS, setIncludeHECS] = useState(false);
  const [hasPrivateHealth, setHasPrivateHealth] = useState(true);
  const result = useMemo(() => calculatePayBreakdown({ grossSalary: salary, includeHECS, hasPrivateHealth }), [salary, includeHECS, hasPrivateHealth]);
  return (
    <div className="min-h-screen flex-grow"><div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      <section className="bg-eucalyptus-light/40 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-eucalyptus-light">
        <nav aria-label="breadcrumb"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Pay Calculator TAS</span></li></ol></nav>
        <div className="flex items-center gap-3 mt-4 mb-3"><h1 className="text-3xl md:text-4xl font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Pay Calculator Tasmania 2025-26</h1><span className="bg-eucalyptus-dark text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">TAS</span></div>
        <p className="text-lg text-warmgray">Calculate your take-home pay in Tasmania. Federal income tax rates apply — see TAS payroll tax, average Hobart salaries, and cost of living context.</p>
        <TrustBar className="mt-4" />
      </section>
      <section className="max-w-4xl mx-auto"><Card className="shadow-md"><CardContent className="p-6 md:p-8"><div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div><label htmlFor="salary" className="block text-sm font-medium text-navy mb-1">Gross Annual Salary</label><div className="flex items-center"><span className="text-warmgray-light mr-2">$</span><input type="number" id="salary" min={0} max={500000} step={1000} value={salary} onChange={(e) => setSalary(clamp(Number(e.target.value || 0), 0, 500000))} className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" /></div><input type="range" min={0} max={300000} step={5000} value={clamp(salary, 0, 300000)} onChange={(e) => setSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" /></div>
          <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={includeHECS} onChange={(e) => setIncludeHECS(e.target.checked)} className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" /><span className="text-navy">Include HECS-HELP</span></label>
          <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={!hasPrivateHealth} onChange={(e) => setHasPrivateHealth(!e.target.checked)} className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" /><span className="text-navy">No private health insurance</span></label>
        </form>
        <div className="space-y-6">
          <div className="bg-eucalyptus-light/40 border border-eucalyptus-light rounded-xl p-6 text-center shadow-sm"><div className="text-sm font-semibold text-eucalyptus-dark uppercase tracking-wider mb-2">Take-Home Pay (TAS)</div><div className="text-4xl font-extrabold text-navy">{formatAUD(result.takeHomePay)}</div><div className="text-sm text-warmgray mt-2">{formatAUD(result.monthly)}/month · {formatAUD(result.fortnightly)}/fortnight</div></div>
          <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden"><div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20"><h3 className="font-semibold text-navy text-sm uppercase tracking-wider">Deductions</h3></div><div className="p-5 space-y-3 text-sm"><Row label="Income Tax" value={`-${formatAUD(result.netIncomeTax)}`} /><Row label="Medicare Levy" value={`-${formatAUD(result.medicareLevy)}`} />{result.medicareSurcharge > 0 && <Row label="Medicare Surcharge" value={`-${formatAUD(result.medicareSurcharge)}`} />}{includeHECS && <Row label="HECS Repayment" value={`-${formatAUD(result.hecsRepayment)}`} />}<div className="border-t border-sandstone-dark/20 pt-3" /><Row label="Take-Home Pay" value={formatAUD(result.takeHomePay)} bold highlight /><Row label="Effective Tax Rate" value={formatPercent(result.effectiveTaxRate)} /><Row label="Super (employer-paid)" value={`+${formatAUD(result.superContribution)}`} /></div></div>
        </div>
      </div></CardContent></Card></section>
      <div className="max-w-4xl mx-auto space-y-10">

        {/* --- H2: How Does the TAS Pay Calculator Work? --- */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does the TAS Pay Calculator Work?</h2>
          <p className="mb-4 text-warmgray">This Australian tax calculator applies FY2025-26 federal income tax brackets, the Medicare levy, and HECS-HELP repayment rates to estimate your take-home pay in Tasmania.</p>
          <p className="mb-4 text-warmgray">Enter your gross annual salary, toggle HECS-HELP and private health insurance options, and the calculator instantly returns your net pay after tax. The tool deducts income tax using the same marginal rates that apply in every Australian state, then subtracts the <strong>2%</strong> Medicare levy and any applicable &quot;Medicare Levy Surcharge&quot; for high earners without private hospital cover. Your employer-paid superannuation at the SG rate of <strong>12%</strong> is displayed separately because it does not reduce your assessable income.</p>
          <p className="text-warmgray">The results break down into monthly and fortnightly amounts, giving Tasmanian employees a clear picture of their disposable salary. Use the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark underline hover:text-eucalyptus">Income Tax Calculator</Link> for a detailed bracket-by-bracket breakdown, or the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark underline hover:text-eucalyptus">Superannuation Calculator</Link> to model concessional contributions and employer SG payments.</p>
          <p className="text-warmgray mt-4">Tasmanian employees in hospitality, healthcare, aquaculture and tourism are typically covered by Fair Work&apos;s federal modern awards, which lock in the legal minimum hourly rate before any income tax is applied. Our <Link href="/award-rates/" className="text-eucalyptus-dark underline hover:text-eucalyptus">Australian award rates guide</Link> covers every major industry award for FY2025-26 — these rates apply uniformly in TAS, with the only exception being Tasmanian state public-sector roles that fall under separate state instruments.</p>
        </section>

        {/* --- H2: What Is the Average Salary in Tasmania? --- */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Average Salary in Tasmania?</h2>
          <p className="mb-4 text-warmgray">The average full-time salary in Tasmania is <strong>$81,000 per year</strong>, the lowest of any Australian state and approximately 17% below the national average of $98,000.</p>
          <p className="mb-4 text-warmgray">Tasmania&apos;s smaller economy and concentration of public-sector, tourism, and primary-industry employment drive this gap. Median weekly earnings for full-time Tasmanian workers sit at approximately <strong>$1,558</strong>, compared to the national median of <strong>$1,888</strong>. The differential narrows when adjusted for the state&apos;s lower cost of living, particularly outside Hobart. Calculating your after-tax income with the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark underline hover:text-eucalyptus">Take-Home Pay Calculator</Link> reveals that Tasmanian workers retain a larger share of each dollar when housing costs are factored in.</p>

          <h3 className="text-xl font-semibold text-navy mt-6 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Average Salary by Industry in Tasmania</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border border-sandstone-dark/20 rounded-lg overflow-hidden">
              <thead><tr className="bg-sandstone text-navy"><th className="px-4 py-3 text-left font-semibold">Industry</th><th className="px-4 py-3 text-right font-semibold">Avg. Salary (TAS)</th><th className="px-4 py-3 text-right font-semibold">National Avg.</th></tr></thead>
              <tbody className="text-warmgray">
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">Mining &amp; Resources</td><td className="px-4 py-2 text-right font-medium text-navy">$115,000</td><td className="px-4 py-2 text-right">$139,000</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">Healthcare &amp; Social Assistance</td><td className="px-4 py-2 text-right font-medium text-navy">$82,000</td><td className="px-4 py-2 text-right">$88,000</td></tr>
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">Education &amp; Training</td><td className="px-4 py-2 text-right font-medium text-navy">$84,000</td><td className="px-4 py-2 text-right">$92,000</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">Public Administration</td><td className="px-4 py-2 text-right font-medium text-navy">$88,000</td><td className="px-4 py-2 text-right">$96,000</td></tr>
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">Agriculture, Forestry &amp; Fishing</td><td className="px-4 py-2 text-right font-medium text-navy">$62,000</td><td className="px-4 py-2 text-right">$68,000</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">Accommodation &amp; Food Services</td><td className="px-4 py-2 text-right font-medium text-navy">$55,000</td><td className="px-4 py-2 text-right">$58,000</td></tr>
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">Information Technology</td><td className="px-4 py-2 text-right font-medium text-navy">$92,000</td><td className="px-4 py-2 text-right">$115,000</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">Construction</td><td className="px-4 py-2 text-right font-medium text-navy">$78,000</td><td className="px-4 py-2 text-right">$90,000</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-warmgray">Public administration and healthcare together account for roughly <strong>30%</strong> of Tasmanian employment, a higher share than any mainland state. The IT sector in Hobart is growing but pays approximately <strong>20%</strong> less than the national IT average, reflecting Tasmania&apos;s smaller market size.</p>
        </section>

        {/* --- H2: How Much Tax Do You Pay in Tasmania? --- */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much Tax Do You Pay in Tasmania?</h2>
          <p className="mb-4 text-warmgray">A Tasmanian employee earning <strong>$75,000</strong> per year pays <strong>$14,842</strong> in income tax and <strong>$1,500</strong> in Medicare levy, leaving take-home pay of <strong>$58,658</strong>.</p>
          <p className="mb-4 text-warmgray">Income tax in Tasmania is identical to every other state because the ATO sets a single schedule of income tax brackets for all Australian residents. The FY2025-26 marginal rates are:</p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border border-sandstone-dark/20 rounded-lg overflow-hidden">
              <thead><tr className="bg-sandstone text-navy"><th className="px-4 py-3 text-left font-semibold">Taxable Income</th><th className="px-4 py-3 text-right font-semibold">Marginal Rate</th><th className="px-4 py-3 text-right font-semibold">Tax on Bracket</th></tr></thead>
              <tbody className="text-warmgray">
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">$0 &ndash; $18,200</td><td className="px-4 py-2 text-right font-medium text-navy">0%</td><td className="px-4 py-2 text-right">$0</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">$18,201 &ndash; $45,000</td><td className="px-4 py-2 text-right font-medium text-navy">16%</td><td className="px-4 py-2 text-right">$4,288</td></tr>
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">$45,001 &ndash; $135,000</td><td className="px-4 py-2 text-right font-medium text-navy">30%</td><td className="px-4 py-2 text-right">$27,000</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">$135,001 &ndash; $190,000</td><td className="px-4 py-2 text-right font-medium text-navy">37%</td><td className="px-4 py-2 text-right">$20,350</td></tr>
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">$190,001+</td><td className="px-4 py-2 text-right font-medium text-navy">45%</td><td className="px-4 py-2 text-right">varies</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 text-warmgray">At <strong>$75,000</strong>, the calculation proceeds as follows: the first $18,200 is tax-free, the next $26,800 is taxed at 16% (<strong>$4,288</strong>), and the remaining $30,000 is taxed at 30% (<strong>$9,000</strong>). Total gross tax is <strong>$13,288</strong>. After applying the &quot;Low Income Tax Offset&quot; (LITO), the net tax payable becomes approximately <strong>$14,842</strong> inclusive of the Medicare levy. The effective tax rate is <strong>19.8%</strong>, leaving a fortnightly after-tax income of approximately <strong>$2,256</strong>.</p>
          <p className="text-warmgray">Employees with a HECS-HELP debt face an additional repayment of <strong>4.5%</strong> at the $75,000 threshold, equalling <strong>$3,375</strong> per year. Use the <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark underline hover:text-eucalyptus">HECS-HELP Calculator</Link> to model the impact on your net pay after tax.</p>
        </section>

        {/* --- H2: What Is TAS Payroll Tax? --- */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is TAS Payroll Tax?</h2>
          <p className="mb-4 text-warmgray">Tasmania&apos;s payroll tax rate is <strong>{formatPercent(STATE_PAYROLL_TAX.TAS.rate, 0)}</strong> on taxable wages above a <strong>{formatAUD(STATE_PAYROLL_TAX.TAS.threshold)}</strong> annual threshold, increasing to <strong>6.1%</strong> for employers with Australian wages exceeding $2,000,000.</p>
          <p className="mb-4 text-warmgray">Payroll tax is an employer obligation and does not reduce an employee&apos;s gross or net pay. The State Revenue Office Tasmania administers the tax. Businesses with total Australian wages below the {formatAUD(STATE_PAYROLL_TAX.TAS.threshold)} threshold pay no payroll tax at all, which exempts most small businesses across Hobart, Launceston, and Devonport. Tasmania&apos;s threshold is among the lowest in Australia, meaning more employers cross it, but the base rate of {formatPercent(STATE_PAYROLL_TAX.TAS.rate, 0)} is the lowest of any state.</p>

          <h3 className="text-xl font-semibold text-navy mt-6 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does TAS Payroll Tax Compare to Other States?</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border border-sandstone-dark/20 rounded-lg overflow-hidden">
              <thead><tr className="bg-sandstone text-navy"><th className="px-4 py-3 text-left font-semibold">State / Territory</th><th className="px-4 py-3 text-right font-semibold">Base Rate</th><th className="px-4 py-3 text-right font-semibold">Annual Threshold</th></tr></thead>
              <tbody className="text-warmgray">
                {PAYROLL_COMPARE_ORDER.map((code, i) => {
                  const s = STATE_PAYROLL_TAX[code];
                  const isHome = code === "TAS";
                  const rowClass = isHome
                    ? "border-t border-sandstone-dark/10 bg-eucalyptus-light/20 font-medium"
                    : i % 2 === 0
                    ? "border-t border-sandstone-dark/10 bg-sandstone/30"
                    : "border-t border-sandstone-dark/10";
                  return (
                    <tr key={code} className={rowClass}>
                      <td className="px-4 py-2">{s.name}</td>
                      <td className={`px-4 py-2 text-right ${isHome ? "text-navy" : ""}`}>{formatPercent(s.rate, 2)}</td>
                      <td className={`px-4 py-2 text-right ${isHome ? "text-navy" : ""}`}>{formatAUD(s.threshold)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-warmgray">Tasmania&apos;s <strong>{formatPercent(STATE_PAYROLL_TAX.TAS.rate, 0)}</strong> base rate is the lowest in Australia, though its tiered structure increases the rate to <strong>6.1%</strong> for payrolls above $2,000,000. Employers comparing operating costs across states can use our <Link href="/pay-calculator-nsw/" className="text-eucalyptus-dark underline hover:text-eucalyptus">Pay Calculator NSW</Link> or <Link href="/pay-calculator-vic/" className="text-eucalyptus-dark underline hover:text-eucalyptus">Pay Calculator Victoria</Link> pages for state-specific context.</p>
        </section>

        {/* --- CONTEXT BORDER --- */}

        {/* --- H2: What Is the Cost of Living in Hobart? --- */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Cost of Living in Hobart?</h2>
          <p className="mb-4 text-warmgray">Hobart&apos;s cost of living is approximately <strong>18% lower</strong> than Sydney, with the largest savings in housing, where median rents are roughly 35% cheaper than comparable Sydney suburbs.</p>
          <p className="mb-4 text-warmgray">Despite strong price growth over the past decade, Hobart remains one of Australia&apos;s more affordable capital cities for both renters and buyers. The median house price in Greater Hobart sits at approximately <strong>$650,000</strong>, compared to <strong>$1,180,000</strong> in Sydney. Groceries, utilities, and transport costs are broadly comparable to mainland capitals, though Tasmania&apos;s island location adds a freight premium to some imported goods.</p>

          <h3 className="text-xl font-semibold text-navy mt-6 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Hobart vs Sydney Cost Comparison</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border border-sandstone-dark/20 rounded-lg overflow-hidden">
              <thead><tr className="bg-sandstone text-navy"><th className="px-4 py-3 text-left font-semibold">Category</th><th className="px-4 py-3 text-right font-semibold">Hobart</th><th className="px-4 py-3 text-right font-semibold">Sydney</th><th className="px-4 py-3 text-right font-semibold">Difference</th></tr></thead>
              <tbody className="text-warmgray">
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">Median House Price</td><td className="px-4 py-2 text-right font-medium text-navy">$650,000</td><td className="px-4 py-2 text-right">$1,180,000</td><td className="px-4 py-2 text-right text-eucalyptus-dark font-medium">-45%</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">Median Weekly Rent (2-bed unit)</td><td className="px-4 py-2 text-right font-medium text-navy">$450</td><td className="px-4 py-2 text-right">$680</td><td className="px-4 py-2 text-right text-eucalyptus-dark font-medium">-34%</td></tr>
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">Monthly Groceries (single)</td><td className="px-4 py-2 text-right font-medium text-navy">$420</td><td className="px-4 py-2 text-right">$440</td><td className="px-4 py-2 text-right text-eucalyptus-dark font-medium">-5%</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">Monthly Transport (public)</td><td className="px-4 py-2 text-right font-medium text-navy">$110</td><td className="px-4 py-2 text-right">$200</td><td className="px-4 py-2 text-right text-eucalyptus-dark font-medium">-45%</td></tr>
                <tr className="border-t border-sandstone-dark/10"><td className="px-4 py-2">Quarterly Utilities</td><td className="px-4 py-2 text-right font-medium text-navy">$580</td><td className="px-4 py-2 text-right">$520</td><td className="px-4 py-2 text-right text-red-500 font-medium">+12%</td></tr>
                <tr className="border-t border-sandstone-dark/10 bg-sandstone/30"><td className="px-4 py-2">Childcare (daily)</td><td className="px-4 py-2 text-right font-medium text-navy">$105</td><td className="px-4 py-2 text-right">$140</td><td className="px-4 py-2 text-right text-eucalyptus-dark font-medium">-25%</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 text-warmgray">Utilities are the one category where Hobart costs exceed Sydney, driven by higher heating demand during Tasmania&apos;s cooler winters. Overall, a Tasmanian worker earning <strong>$81,000</strong> retains more purchasing power than an equivalent earner in Sydney due to the <strong>$530-per-week</strong> housing saving alone.</p>

          <h3 className="text-xl font-semibold text-navy mt-6 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Regional Tasmania Cost of Living</h3>
          <p className="text-warmgray">Living costs drop further outside Hobart. Launceston&apos;s median house price is approximately <strong>$520,000</strong>, while Devonport and Burnie sit closer to <strong>$400,000</strong>. Regional Tasmanian towns offer median rents around <strong>$350 per week</strong> for a three-bedroom house, making them among the most affordable locations in Australia. Salaries in regional TAS average <strong>5-12%</strong> lower than Hobart for equivalent roles, but the cost-of-living differential more than compensates. Agricultural, aquaculture, and forestry workers in regional areas earn a comparable disposable salary to metro peers.</p>
        </section>

        {/* --- H2: Who Are the Major Employers in Tasmania? --- */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Are the Major Employers in Tasmania?</h2>
          <p className="mb-4 text-warmgray">The Tasmanian State Government is the largest employer in Tasmania, directly employing over <strong>28,000</strong> people across health, education, and public administration.</p>
          <p className="mb-4 text-warmgray">Tasmania&apos;s employment landscape is dominated by public-sector and service-industry employers. The top employers by workforce size include:</p>
          <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
            <li><strong>Tasmanian Health Service</strong> &mdash; approximately 12,000 employees across Royal Hobart Hospital, Launceston General Hospital, and regional facilities</li>
            <li><strong>Department of Education Tasmania</strong> &mdash; approximately 9,500 employees in public schools statewide</li>
            <li><strong>University of Tasmania (UTAS)</strong> &mdash; approximately 3,500 staff across Hobart, Launceston, and Cradle Coast campuses</li>
            <li><strong>Tassal Group / Petuna Aquaculture</strong> &mdash; Tasmania&apos;s salmon industry employs over 3,000 workers statewide</li>
            <li><strong>Federal Group</strong> &mdash; approximately 2,500 employees in hospitality, gaming, and tourism</li>
            <li><strong>Woolworths &amp; Coles (Tasmania operations)</strong> &mdash; combined workforce of approximately 4,000 across the state</li>
            <li><strong>Norske Skog (Boyer Mill)</strong> &mdash; one of the largest private manufacturing employers with approximately 600 workers</li>
            <li><strong>Hydro Tasmania</strong> &mdash; approximately 1,500 employees managing renewable energy generation</li>
          </ul>
          <p className="text-warmgray">Tourism contributes <strong>$2.8 billion</strong> annually to Tasmania&apos;s economy and supports approximately 38,000 jobs, making it the state&apos;s single largest employment sector when direct and indirect roles are combined. The growing defence sector, anchored by the Australian Antarctic Division in Kingston, adds further diversity to the employment base.</p>
        </section>

        {/* --- H2: What State-Specific Benefits Apply in TAS? --- */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What State-Specific Benefits Apply in TAS?</h2>
          <p className="mb-4 text-warmgray">Tasmania offers a <strong>$30,000</strong> First Home Owner Grant for new builds and a stamp duty concession for first-time buyers purchasing established homes under $600,000.</p>
          <p className="mb-4 text-warmgray">Key Tasmanian state-specific benefits and concessions include:</p>
          <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
            <li><strong>First Home Owner Grant (FHOG)</strong> &mdash; $30,000 for eligible first home buyers constructing or purchasing a new home valued up to $750,000</li>
            <li><strong>Stamp Duty Concession</strong> &mdash; a 50% duty discount for first home buyers purchasing existing properties valued at $600,000 or less</li>
            <li><strong>Pensioner Rate Remission</strong> &mdash; council rate rebates of up to $400 per year for eligible pensioners and concession card holders</li>
            <li><strong>TasNetworks Energy Concession</strong> &mdash; an annual electricity concession of approximately $495 for holders of a Pensioner Concession Card or Health Care Card</li>
            <li><strong>Student Assistance</strong> &mdash; the Tasmanian Government provides bursaries and fee support for TAFE and University of Tasmania students</li>
          </ul>
          <p className="text-warmgray">Federal offsets also benefit many Tasmanian workers. The &quot;Zone Tax Offset&quot; does not apply to metropolitan Hobart but is available to some workers in remote regional areas. Employees salary packaging fringe benefits can use our <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark underline hover:text-eucalyptus">Salary Sacrifice Calculator</Link> to model the tax savings on superannuation contributions, novated leases, or other eligible items.</p>
        </section>

        {/* --- H2: Frequently Asked Questions --- */}
        <section>
          <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
          <Accordion type="multiple" className="space-y-3">
            <AccordionItem value="diff" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>Is income tax different in Tasmania?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">No. Income tax is set by the federal ATO and applies identically across all Australian states and territories. A Tasmanian worker earning $90,000 pays exactly the same income tax brackets as someone in Sydney, Melbourne, or Brisbane.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="cost" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>Is Tasmania affordable to live in?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">Yes. Hobart&apos;s median house price is approximately <strong>$650,000</strong>, roughly 45% lower than Sydney&apos;s <strong>$1,180,000</strong>. Regional centres such as Launceston, Devonport, and Burnie are even more affordable, with median prices between <strong>$400,000 and $520,000</strong>. Utilities are slightly higher due to heating costs.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="payroll" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>Do TAS employees pay payroll tax?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">No. Payroll tax is an employer obligation. Tasmania&apos;s rate is <strong>{formatPercent(STATE_PAYROLL_TAX.TAS.rate, 0)}</strong> on wages above <strong>{formatAUD(STATE_PAYROLL_TAX.TAS.threshold)}</strong>. It does not appear on your payslip and does not reduce your gross or net pay.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="super" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>How much superannuation does my employer pay in TAS?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">Employers in Tasmania pay the same federally mandated superannuation guarantee rate of <strong>12%</strong> for FY2025-26. This is calculated on your ordinary time earnings, paid quarterly, and is on top of your gross salary. The maximum super contribution base is <strong>$65,070 per quarter</strong>.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="median" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>What is the median salary in Hobart?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">The median full-time salary in Hobart is approximately <strong>$83,000 per year</strong>, slightly above the Tasmanian state average of <strong>$81,000</strong> due to the concentration of government, university, and professional-services employment in the capital.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="fhog" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>What is the First Home Owner Grant in Tasmania?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">Tasmania offers a <strong>$30,000</strong> First Home Owner Grant for eligible buyers constructing or purchasing a new home valued at $750,000 or less. A 50% stamp duty concession also applies to first-time purchases of existing homes valued at $600,000 or below.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="hecs" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>How does HECS-HELP affect my take-home pay in Tasmania?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">HECS-HELP repayments are calculated on your taxable income using the same federal schedule regardless of state. At a salary of <strong>$75,000</strong>, the repayment rate is <strong>4.5%</strong>, equalling <strong>$3,375 per year</strong> or approximately <strong>$130 per fortnight</strong> deducted from your after-tax income.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="mls" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>Do I pay the Medicare Levy Surcharge in TAS?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">The &quot;Medicare Levy Surcharge&quot; applies to Australian residents earning above <strong>$93,000</strong> (singles) or <strong>$186,000</strong> (families) who do not hold private hospital cover. The surcharge ranges from <strong>1% to 1.5%</strong> depending on income tier. It is a federal charge, identical in Tasmania and all other states.</p></AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <MethodologyDisclosure><p className="text-sm">This calculator uses FY2025-26 federal tax brackets, LITO, Medicare levy, and HECS-HELP repayment rates. TAS-specific data (payroll tax, average salaries, cost of living) is sourced from the State Revenue Office Tasmania and ABS.</p></MethodologyDisclosure>
        <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
      </div>
    </div></div>
  );
}
function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) { return (<div className="flex items-center justify-between"><span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span><span className={`${bold ? "font-bold" : "font-medium"} ${highlight ? "text-eucalyptus-dark" : "text-navy"}`}>{value}</span></div>); }
