import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import {
  TAX_BRACKETS,
  NON_RESIDENT_TAX_BRACKETS,
  LITO,
  TAX_HISTORY,
  SOURCES,
  SITE_CONFIG,
  MEDICARE_LEVY,
  formatAUD,
  formatPercent,
  calculateIncomeTax,
  calculateLITO,
  annualToWeekly,
} from "@/lib/constants";

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates – residents", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Non-resident tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-foreign-residents", publisher: SOURCES.ato.name },
  { title: "Low Income Tax Offset", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/low-income-tax-offset", publisher: SOURCES.ato.name },
];

export default function TaxBracketsGuidePage() {
  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-eucalyptus-light/40 rounded-2xl p-8 md:p-12">
          <nav aria-label="breadcrumb"><ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Tax Brackets</span></li>
          </ol></nav>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">Australian Tax Brackets 2025-26 — Income Tax Rates &amp; Thresholds</h1>
          <p className="text-lg text-warmgray">Australia uses a progressive tax system — different portions of your income are taxed at different rates. You don&apos;t pay your top marginal rate on your entire salary.</p>
          <TrustBar className="mt-4" />
          <p className="mt-3 text-sm text-warmgray-light bg-white/60 rounded-lg p-3 inline-block">All rates sourced from the ATO. Applies 1 July 2025 to 30 June 2026.</p>
        </section>

        {/* What Are the Australian Tax Brackets for FY{SITE_CONFIG.financialYear}? */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Are the Australian Tax Brackets for FY{SITE_CONFIG.financialYear}?</h2>
          <p className="mb-4 text-warmgray">Australia has <strong>5 income tax brackets</strong> for FY{SITE_CONFIG.financialYear}, with a tax-free threshold of $18,200 and a top marginal rate of 45% on income above $190,000.</p>
          <p className="mb-4 text-warmgray">These rates apply to Australian residents for tax purposes. They do not include the 2% <Link href="/medicare-levy/" className="text-eucalyptus-dark hover:underline">Medicare levy</Link>, which is calculated separately on your taxable income. The Australian Taxation Office publishes these income tax brackets each financial year, and the FY{SITE_CONFIG.financialYear} rates remain unchanged from FY2024-25 following the Stage 3 tax cuts.</p>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone"><tr><th className="px-4 py-3 text-left font-semibold text-navy">Taxable Income</th><th className="px-4 py-3 text-left font-semibold text-navy">Tax On This Income</th></tr></thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {TAX_BRACKETS.map((b, i) => (
                  <tr key={i} className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">{formatAUD(b.min)} – {b.max === Infinity ? "and over" : formatAUD(b.max)}</td>
                    <td className="px-4 py-3 text-warmgray">{i === 0 ? "Nil" : (i === 1 ? b.label : `${formatAUD(b.base)} plus ${b.label.split("plus ")[1] || b.label}`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-warmgray-light">The tax-free threshold remains at $18,200. With the <Link href="/low-income-tax-offset/" className="text-eucalyptus-dark hover:underline">Low Income Tax Offset</Link>, the effective tax-free threshold increases to {formatAUD(LITO.effectiveTaxFreeThreshold)}.</p>
          <p className="mt-2 text-sm"><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Calculate your exact tax →</Link></p>
        </section>

        {/* How Does Marginal Tax Work? */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Does Marginal Tax Work?</h2>
          <p className="mb-4 text-warmgray">Marginal tax means each dollar of income is taxed only at the rate for the bracket it falls in, not the highest bracket rate on your entire salary.</p>
          <p className="mb-4 text-warmgray">The most common misunderstanding about Australian taxation is that earning more &quot;pushes all your income&quot; into a higher bracket. This is false. Australia&apos;s progressive system splits your assessable income into slices, and each slice is taxed independently. Only the dollars within each bracket are taxed at that bracket&apos;s rate.</p>

          <h3 className="text-lg font-semibold text-navy mb-2">Step-by-Step: How Progressive Tax Is Calculated</h3>
          <p className="mb-3 text-warmgray">The ATO calculates your income tax liability using these steps:</p>
          <ol className="list-decimal list-inside space-y-2 text-warmgray mb-4">
            <li><strong>$0 to $18,200</strong> — taxed at 0%. This is the tax-free threshold. Every resident pays $0 on this portion.</li>
            <li><strong>$18,201 to $45,000</strong> — taxed at 16 cents per dollar. The maximum tax in this bracket is <strong>$4,288</strong> (on $26,800 of income).</li>
            <li><strong>$45,001 to $135,000</strong> — taxed at 30 cents per dollar. The maximum tax in this bracket is <strong>$27,000</strong> (on $90,000 of income).</li>
            <li><strong>$135,001 to $190,000</strong> — taxed at 37 cents per dollar. The maximum tax in this bracket is <strong>$20,350</strong> (on $55,000 of income).</li>
            <li><strong>$190,001 and above</strong> — taxed at 45 cents per dollar. There is no upper limit on this bracket.</li>
          </ol>
          <p className="text-warmgray">Your total tax equals the sum of tax from each bracket. This total divided by your gross income gives your effective tax rate, which is always lower than your marginal rate. Use our <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> to see the bracket-by-bracket breakdown for your salary.</p>
        </section>

        {/* Tax Brackets Worked Example at $90,000 */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Much Tax Do You Pay on $90,000? — Worked Example</h2>
          <p className="mb-4 text-warmgray">On a salary of $90,000 in FY{SITE_CONFIG.financialYear}, total income tax is <strong>{formatAUD(Math.max(0, Math.round(calculateIncomeTax(90000) - calculateLITO(90000))))}</strong> before the Medicare levy, giving an effective tax rate of <strong>{formatPercent(Math.max(0, Math.round(calculateIncomeTax(90000) - calculateLITO(90000))) / 90000)}</strong>.</p>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone"><tr><th className="px-4 py-3 text-left">Tax Bracket</th><th className="px-4 py-3 text-right">Income in Bracket</th><th className="px-4 py-3 text-right">Rate</th><th className="px-4 py-3 text-right">Tax</th></tr></thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                <tr><td className="px-4 py-3">$0 – $18,200</td><td className="px-4 py-3 text-right">$18,200</td><td className="px-4 py-3 text-right">0%</td><td className="px-4 py-3 text-right">$0</td></tr>
                <tr><td className="px-4 py-3">$18,201 – $45,000</td><td className="px-4 py-3 text-right">$26,800</td><td className="px-4 py-3 text-right">16%</td><td className="px-4 py-3 text-right">$4,288</td></tr>
                <tr><td className="px-4 py-3">$45,001 – $90,000</td><td className="px-4 py-3 text-right">$45,000</td><td className="px-4 py-3 text-right">30%</td><td className="px-4 py-3 text-right">$13,500</td></tr>
                <tr className="bg-eucalyptus-light/40 font-semibold"><td className="px-4 py-3">Gross Income Tax</td><td className="px-4 py-3 text-right">$90,000</td><td className="px-4 py-3 text-right">—</td><td className="px-4 py-3 text-right">$17,788</td></tr>
                <tr><td className="px-4 py-3">Less: LITO</td><td className="px-4 py-3 text-right">—</td><td className="px-4 py-3 text-right">—</td><td className="px-4 py-3 text-right">−{formatAUD(Math.round(calculateLITO(90000)))}</td></tr>
                <tr className="bg-eucalyptus-light/40 font-semibold"><td className="px-4 py-3">Net Income Tax</td><td className="px-4 py-3 text-right">$90,000</td><td className="px-4 py-3 text-right">—</td><td className="px-4 py-3 text-right">{formatAUD(Math.max(0, Math.round(calculateIncomeTax(90000) - calculateLITO(90000))))}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-warmgray">Your <strong>marginal tax rate</strong> at $90,000 is 30% (the third bracket). Your <strong>effective tax rate</strong> is only {formatPercent(Math.max(0, Math.round(calculateIncomeTax(90000) - calculateLITO(90000))) / 90000)}. Add the 2% Medicare levy ({formatAUD(Math.round(90000 * 0.02))}) and your total deductions rise to <strong>{formatAUD(Math.max(0, Math.round(calculateIncomeTax(90000) - calculateLITO(90000))) + Math.round(90000 * 0.02))}</strong>, leaving take-home pay of approximately <strong>{formatAUD(90000 - Math.max(0, Math.round(calculateIncomeTax(90000) - calculateLITO(90000))) - Math.round(90000 * 0.02))}</strong> per year.</p>
          <p className="mt-2 text-warmgray">Your employer also pays <strong>{formatAUD(Math.round(90000 * 0.12))}</strong> in superannuation (12% SG rate) on top of your salary. This does not reduce your take-home pay. Use the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to see how super contributions grow over time.</p>
        </section>

        {/* How Did the Stage 3 Tax Cuts Change the Brackets? */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Did the Stage 3 Tax Cuts Change the Brackets?</h2>
          <p className="mb-4 text-warmgray">The Stage 3 tax cuts reduced the 19% bracket to <strong>16%</strong>, the 32.5% bracket to <strong>30%</strong>, and expanded the third bracket ceiling from $120,000 to <strong>$135,000</strong>, effective {TAX_HISTORY.stage3TaxCuts.effectiveDate}.</p>
          <p className="mb-4 text-warmgray">The revised Stage 3 cuts were announced in January 2024 and passed into law in March 2024. The original plan would have removed the 37% bracket entirely, but the revised version spread the tax relief more evenly across all income levels. Every taxpayer earning above $18,200 received a tax cut.</p>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone"><tr><th className="px-4 py-3 text-left">What Changed</th><th className="px-4 py-3 text-right">Before (FY2023-24)</th><th className="px-4 py-3 text-right">After (FY2024-25 onwards)</th><th className="px-4 py-3 text-right">Saving</th></tr></thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                <tr><td className="px-4 py-3">Second bracket rate</td><td className="px-4 py-3 text-right">19%</td><td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">16%</td><td className="px-4 py-3 text-right">3% lower</td></tr>
                <tr><td className="px-4 py-3">Third bracket rate</td><td className="px-4 py-3 text-right">32.5%</td><td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">30%</td><td className="px-4 py-3 text-right">2.5% lower</td></tr>
                <tr><td className="px-4 py-3">Third bracket ceiling</td><td className="px-4 py-3 text-right">$120,000</td><td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">$135,000</td><td className="px-4 py-3 text-right">$15,000 higher</td></tr>
                <tr><td className="px-4 py-3">Fourth bracket ceiling</td><td className="px-4 py-3 text-right">$180,000</td><td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">$190,000</td><td className="px-4 py-3 text-right">$10,000 higher</td></tr>
                <tr><td className="px-4 py-3">Tax-free threshold</td><td className="px-4 py-3 text-right">$18,200</td><td className="px-4 py-3 text-right">$18,200</td><td className="px-4 py-3 text-right">No change</td></tr>
                <tr><td className="px-4 py-3">Top rate (45%)</td><td className="px-4 py-3 text-right">$180,001+</td><td className="px-4 py-3 text-right">$190,001+</td><td className="px-4 py-3 text-right">$10,000 higher start</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-navy mt-6 mb-2">Dollar Savings by Salary Level</h3>
          <p className="mb-3 text-warmgray">The annual tax reduction under Stage 3 varies by income. Low and middle-income earners received proportionally larger percentage savings:</p>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone"><tr><th className="px-4 py-3 text-left">Salary</th><th className="px-4 py-3 text-right">Tax Before (FY2023-24)</th><th className="px-4 py-3 text-right">Tax After (FY{SITE_CONFIG.financialYear})</th><th className="px-4 py-3 text-right">Annual Saving</th></tr></thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {[
                  { salary: 40000, taxBefore: 4142 },
                  { salary: 60000, taxBefore: 9967 },
                  { salary: 80000, taxBefore: 16467 },
                  { salary: 100000, taxBefore: 22967 },
                  { salary: 120000, taxBefore: 29467 },
                  { salary: 150000, taxBefore: 40567 },
                  { salary: 200000, taxBefore: 60667 },
                ].map((row) => {
                  const rawAfter = calculateIncomeTax(row.salary);
                  const litoAfter = calculateLITO(row.salary);
                  const netAfter = Math.max(0, Math.round(rawAfter - litoAfter));
                  const saving = row.taxBefore - netAfter;
                  return (
                    <tr key={row.salary} className="hover:bg-sandstone">
                      <td className="px-4 py-3 font-medium text-navy">{formatAUD(row.salary)}</td>
                      <td className="px-4 py-3 text-right">{formatAUD(row.taxBefore)}</td>
                      <td className="px-4 py-3 text-right">{formatAUD(netAfter)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">{formatAUD(saving)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-warmgray-light">Savings are income tax only, before LITO variations between years. Use our <Link href="/pay-rise-calculator/" className="text-eucalyptus-dark hover:underline">Pay Rise Calculator</Link> to model how a salary increase interacts with these new brackets.</p>
        </section>

        {/* Tax Brackets Historical Comparison */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Have Tax Brackets Changed Over Three Years?</h2>
          <p className="mb-4 text-warmgray">The tax bracket rates decreased in FY2024-25 with the Stage 3 cuts and remain identical in FY{SITE_CONFIG.financialYear}, with no further changes until the 16% rate drops to <strong>15%</strong> in FY2026-27.</p>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Bracket</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">FY2023-24</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">FY2024-25</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">FY{SITE_CONFIG.financialYear}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                <tr><td className="px-4 py-3">$0 – $18,200</td><td className="px-4 py-3 text-right">0%</td><td className="px-4 py-3 text-right">0%</td><td className="px-4 py-3 text-right">0%</td></tr>
                <tr><td className="px-4 py-3">$18,201 – $45,000</td><td className="px-4 py-3 text-right">19%</td><td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">16%</td><td className="px-4 py-3 text-right">16%</td></tr>
                <tr><td className="px-4 py-3">$45,001 – $120,000</td><td className="px-4 py-3 text-right">32.5%</td><td className="px-4 py-3 text-right" colSpan={2}>Replaced by expanded bracket below</td></tr>
                <tr><td className="px-4 py-3">$45,001 – $135,000</td><td className="px-4 py-3 text-right">—</td><td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">30%</td><td className="px-4 py-3 text-right">30%</td></tr>
                <tr><td className="px-4 py-3">$120,001 – $180,000</td><td className="px-4 py-3 text-right">37%</td><td className="px-4 py-3 text-right" colSpan={2}>Replaced by expanded bracket below</td></tr>
                <tr><td className="px-4 py-3">$135,001 – $190,000</td><td className="px-4 py-3 text-right">—</td><td className="px-4 py-3 text-right">37%</td><td className="px-4 py-3 text-right">37%</td></tr>
                <tr><td className="px-4 py-3">$180,001+ / $190,001+</td><td className="px-4 py-3 text-right">45%</td><td className="px-4 py-3 text-right">45%</td><td className="px-4 py-3 text-right">45%</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-warmgray">The FY{SITE_CONFIG.financialYear} brackets are identical to FY2024-25. The next legislated change takes effect on {TAX_HISTORY.upcomingFY2026_27.effectiveDate}, when the second bracket rate drops from 16% to 15%. A further reduction to 14% is scheduled for 1 July 2027. These changes save <strong>$268 per year</strong> for every taxpayer earning above $45,000.</p>
        </section>

        {/* Effective Tax Rate vs Marginal Rate */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is the Difference Between Effective Tax Rate and Marginal Rate?</h2>
          <p className="mb-4 text-warmgray">Your effective tax rate is the average rate paid across all income (total tax divided by total income), while your marginal rate is the rate on the last dollar earned — these two figures diverge significantly at every income level.</p>
          <p className="mb-4 text-warmgray">Understanding the gap between these rates is critical for financial decisions. A worker earning $80,000 has a marginal rate of 30%, but their effective rate is only <strong>{formatPercent(Math.max(0, Math.round(calculateIncomeTax(80000) - calculateLITO(80000))) / 80000)}</strong>. This means a <Link href="/pay-rise-calculator/" className="text-eucalyptus-dark hover:underline">pay rise</Link> is never &quot;eaten by tax&quot; — only the additional dollars are taxed at the marginal rate.</p>

          <h3 className="text-lg font-semibold text-navy mb-2">Effective vs Marginal Rate at Common Salaries</h3>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone"><tr><th className="px-4 py-3 text-left">Salary</th><th className="px-4 py-3 text-right">Income Tax</th><th className="px-4 py-3 text-right">Eff. Rate</th><th className="px-4 py-3 text-right">Marginal</th><th className="px-4 py-3 text-right">Weekly Tax</th><th className="px-4 py-3 text-right">Take-Home</th></tr></thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {[40000, 50000, 60000, 70000, 80000, 90000, 100000, 120000, 150000, 200000].map((s) => {
                  const raw = calculateIncomeTax(s);
                  const lito = calculateLITO(s);
                  const net = Math.max(0, Math.round(raw - lito));
                  let marginal = 0;
                  for (const b of TAX_BRACKETS) { if (s >= b.min) marginal = b.rate; }
                  return (
                    <tr key={s} className="hover:bg-sandstone">
                      <td className="px-4 py-3 font-medium text-navy">{formatAUD(s)}</td>
                      <td className="px-4 py-3 text-right">{formatAUD(net)}</td>
                      <td className="px-4 py-3 text-right">{formatPercent(net / s)}</td>
                      <td className="px-4 py-3 text-right">{formatPercent(marginal, 0)}</td>
                      <td className="px-4 py-3 text-right text-warmgray-light">{formatAUD(annualToWeekly(net), 2)}</td>
                      <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(s - net)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-warmgray-light">These are income tax only. Actual take-home is also reduced by <Link href="/medicare-levy/" className="text-eucalyptus-dark hover:underline">Medicare levy</Link> (2%) and <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP repayments</Link>.</p>
          <p className="mt-1 text-sm"><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">See your exact take-home pay with all deductions →</Link></p>
        </section>

        {/* Non-Resident Tax Brackets Comparison */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Do Non-Resident Tax Brackets Compare to Resident Rates?</h2>
          <p className="mb-4 text-warmgray">Non-residents pay <strong>30% from the first dollar</strong> with no tax-free threshold, making their tax significantly higher at low-to-mid incomes and slightly lower at very high incomes due to no Medicare levy.</p>
          <p className="mb-4 text-warmgray">Residency for tax purposes is determined by domicile, length of stay, and ties to Australia — it is not the same as visa status. The ATO applies 4 tests: the resides test, domicile test, 183-day test, and Commonwealth superannuation test. Non-residents do not receive the $18,200 tax-free threshold, the <Link href="/low-income-tax-offset/" className="text-eucalyptus-dark hover:underline">Low Income Tax Offset</Link>, or SAPTO. They also do not pay the 2% Medicare levy.</p>

          <h3 className="text-lg font-semibold text-navy mb-2">Resident vs Non-Resident Bracket Comparison</h3>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Income Range</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Resident Rate</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Non-Resident Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                <tr><td className="px-4 py-3">$0 – $18,200</td><td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">0%</td><td className="px-4 py-3 text-right">30%</td></tr>
                <tr><td className="px-4 py-3">$18,201 – $45,000</td><td className="px-4 py-3 text-right">16%</td><td className="px-4 py-3 text-right">30%</td></tr>
                <tr><td className="px-4 py-3">$45,001 – $135,000</td><td className="px-4 py-3 text-right">30%</td><td className="px-4 py-3 text-right">30%</td></tr>
                <tr><td className="px-4 py-3">$135,001 – $190,000</td><td className="px-4 py-3 text-right">37%</td><td className="px-4 py-3 text-right">37%</td></tr>
                <tr><td className="px-4 py-3">$190,001+</td><td className="px-4 py-3 text-right">45%</td><td className="px-4 py-3 text-right">45%</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-navy mt-6 mb-2">Tax Comparison at Key Salary Levels</h3>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone"><tr><th className="px-4 py-3 text-left">Salary</th><th className="px-4 py-3 text-right">Resident Tax</th><th className="px-4 py-3 text-right">Non-Resident Tax</th><th className="px-4 py-3 text-right">Difference</th></tr></thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {[50000, 80000, 100000, 150000, 200000].map((s) => {
                  const resRaw = calculateIncomeTax(s, true);
                  const resLito = calculateLITO(s);
                  const resTax = Math.max(0, Math.round(resRaw - resLito));
                  const nonResTax = Math.round(calculateIncomeTax(s, false));
                  const diff = nonResTax - resTax;
                  return (
                    <tr key={s} className="hover:bg-sandstone">
                      <td className="px-4 py-3 font-medium text-navy">{formatAUD(s)}</td>
                      <td className="px-4 py-3 text-right">{formatAUD(resTax)}</td>
                      <td className="px-4 py-3 text-right">{formatAUD(nonResTax)}</td>
                      <td className="px-4 py-3 text-right font-semibold">{diff > 0 ? `+${formatAUD(diff)}` : formatAUD(diff)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-warmgray">Residents paying the 2% Medicare levy narrows the gap at higher incomes. For a detailed non-resident calculation, see our <Link href="/non-resident-tax/" className="text-eucalyptus-dark hover:underline">Non-Resident Tax Guide</Link>.</p>

          <h3 className="text-lg font-semibold text-navy mt-6 mb-2">Working Holiday Maker Rates</h3>
          <p className="text-warmgray">Working holiday makers (subclass 417 and 462 visas) pay a flat <strong>15%</strong> on the first $45,000, then standard non-resident rates on income above $45,000. Employers must register with the ATO as a working holiday maker employer to apply this rate correctly through PAYG withholding.</p>
        </section>

        {/* How Do Tax Offsets Interact with Brackets? */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Do Tax Offsets Interact with Tax Brackets?</h2>
          <p className="mb-4 text-warmgray">Tax offsets reduce your tax payable (not your taxable income), with the LITO providing up to <strong>{formatAUD(LITO.maxOffset)}</strong> and SAPTO up to <strong>$2,230</strong> for eligible taxpayers.</p>
          <p className="mb-4 text-warmgray">Offsets are applied after the ATO calculates your gross tax liability from the bracket table. They are &quot;non-refundable&quot; — they reduce tax to zero but do not generate a refund by themselves. This distinction matters: a tax deduction reduces assessable income (and shifts which bracket your top dollars fall in), while a tax offset directly reduces the final tax bill.</p>

          <h3 className="text-lg font-semibold text-navy mb-2">Low Income Tax Offset (LITO)</h3>
          <p className="mb-3 text-warmgray">The LITO provides a tax reduction of up to {formatAUD(LITO.maxOffset)} for lower-income earners:</p>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone"><tr><th className="px-4 py-3 text-left">Taxable Income</th><th className="px-4 py-3 text-left">LITO Amount</th></tr></thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                <tr><td className="px-4 py-3">Up to {formatAUD(LITO.fullOffsetCeiling)}</td><td className="px-4 py-3">{formatAUD(LITO.maxOffset)} (full offset)</td></tr>
                <tr><td className="px-4 py-3">{formatAUD(LITO.phaseOut1.start)} – {formatAUD(LITO.phaseOut1.end)}</td><td className="px-4 py-3">{formatAUD(LITO.maxOffset)} minus 5c per $1 over {formatAUD(LITO.fullOffsetCeiling)}</td></tr>
                <tr><td className="px-4 py-3">{formatAUD(LITO.phaseOut2.start)} – {formatAUD(LITO.nilOffsetIncome)}</td><td className="px-4 py-3">$325 minus 1.5c per $1 over {formatAUD(LITO.phaseOut1.end)}</td></tr>
                <tr><td className="px-4 py-3">{formatAUD(LITO.nilOffsetIncome)}+</td><td className="px-4 py-3">Nil</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-warmgray-light">Combined with the tax-free threshold, the LITO means you can earn up to <strong>{formatAUD(LITO.effectiveTaxFreeThreshold)}</strong> before paying any net income tax. <Link href="/low-income-tax-offset/" className="text-eucalyptus-dark hover:underline font-medium">Full LITO guide →</Link></p>

          <h3 className="text-lg font-semibold text-navy mb-2 mt-6">Seniors and Pensioners Tax Offset (SAPTO)</h3>
          <p className="text-warmgray mb-3">Eligible seniors of Age Pension age receive an additional offset of up to <strong>$2,230</strong> (singles) or <strong>$1,602</strong> (each member of a couple). SAPTO combined with LITO raises the effective tax-free threshold to <strong>$33,082</strong> for single seniors. To qualify, the taxpayer must meet the age requirement and satisfy the income test. SAPTO phases out at 12.5 cents per dollar over the shade-out threshold.</p>

          <h3 className="text-lg font-semibold text-navy mb-2 mt-6">Medicare Levy and Medicare Levy Surcharge</h3>
          <p className="text-warmgray">The <Link href="/medicare-levy/" className="text-eucalyptus-dark hover:underline">Medicare levy</Link> of 2% applies on top of income tax and is not reduced by LITO or SAPTO. Taxpayers earning above $93,000 (singles) without private hospital cover also pay the &quot;Medicare Levy Surcharge&quot; at rates of 1%, 1.25%, or 1.5% depending on income tier. This surcharge is separate from the standard 2% levy.</p>
        </section>

        {/* What Changed in FY{SITE_CONFIG.financialYear}? */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Changed in FY{SITE_CONFIG.financialYear}?</h2>
          <p className="mb-4 text-warmgray">The income tax brackets for FY{SITE_CONFIG.financialYear} are <strong>unchanged</strong> from FY2024-25 — the same rates, thresholds, and LITO structure apply for the second consecutive year under the Stage 3 framework.</p>
          <p className="mb-3 text-warmgray">While the tax brackets themselves did not change, several related settings were updated for FY{SITE_CONFIG.financialYear}:</p>
          <ul className="list-disc list-inside space-y-2 text-warmgray mb-4">
            <li>The <strong>superannuation guarantee rate</strong> increased from 11.5% to <strong>12%</strong>, raising employer super contributions but not affecting take-home pay directly</li>
            <li>The <strong>HECS-HELP repayment system</strong> switched from percentage-of-income tiers to a marginal model, with a new threshold of <strong>$69,528</strong></li>
            <li>The <strong>maximum super contribution base</strong> changed to $62,500 per quarter, capping employer SG obligations for very high earners</li>
            <li>The <strong>concessional contributions cap</strong> remains at $30,000 per year</li>
          </ul>
          <p className="text-warmgray">The next bracket change is legislated for {TAX_HISTORY.upcomingFY2026_27.effectiveDate}, when the second bracket rate drops from 16% to <strong>15%</strong>. A further reduction to 14% takes effect on 1 July 2027. Both changes save $268 per year for anyone earning above $45,000. Read our full coverage of the <Link href="/news/tax-cut-july-2026/" className="text-eucalyptus-dark hover:underline">July 2026 tax cut</Link> for what it means for your pay. Use the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to model your tax under the current brackets.</p>
        </section>

        {/* Related Resources */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Related Resources</h2>
          <p className="mb-4 text-warmgray">These Australian tax calculators and guides provide detailed breakdowns for specific tax topics covered on this page.</p>
          <ul className="space-y-3 text-warmgray">
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-1 text-eucalyptus-dark flex-shrink-0" />
              <span><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income Tax Calculator</Link> — enter your salary and see a bracket-by-bracket tax breakdown with LITO, Medicare levy, and HECS applied automatically</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-1 text-eucalyptus-dark flex-shrink-0" />
              <span><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Take-Home Pay Calculator</Link> — calculate your after-tax income including superannuation, salary sacrifice, and overtime</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-1 text-eucalyptus-dark flex-shrink-0" />
              <span><Link href="/medicare-levy/" className="text-eucalyptus-dark hover:underline font-medium">Medicare Levy Guide</Link> — understand the 2% levy, low-income exemptions, and surcharge tiers for taxpayers without private health insurance</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-1 text-eucalyptus-dark flex-shrink-0" />
              <span><Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline font-medium">HECS-HELP Calculator</Link> — model your student loan repayments under the new FY{SITE_CONFIG.financialYear} marginal repayment system</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-1 text-eucalyptus-dark flex-shrink-0" />
              <span><Link href="/low-income-tax-offset/" className="text-eucalyptus-dark hover:underline font-medium">Low Income Tax Offset (LITO) Guide</Link> — see how LITO reduces your tax and raises the effective tax-free threshold to {formatAUD(LITO.effectiveTaxFreeThreshold)}</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-1 text-eucalyptus-dark flex-shrink-0" />
              <span><Link href="/non-resident-tax/" className="text-eucalyptus-dark hover:underline font-medium">Non-Resident Tax Guide</Link> — compare resident and non-resident brackets and understand working holiday maker taxation</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-1 text-eucalyptus-dark flex-shrink-0" />
              <span><Link href="/weekly-tax-table/" className="text-eucalyptus-dark hover:underline font-medium">Weekly Tax Table</Link> — look up the exact PAYG amount your employer withholds from each weekly pay</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-1 text-eucalyptus-dark flex-shrink-0" />
              <span><Link href="/fortnightly-tax-table/" className="text-eucalyptus-dark hover:underline font-medium">Fortnightly Tax Table</Link> — see how these brackets translate into fortnightly PAYG withholding amounts</span>
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
          <Accordion type="multiple" className="space-y-3">
            <AccordionItem value="100k" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>How much tax do I pay on $100,000 in Australia?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">On $100,000, you pay <strong>{formatAUD(Math.max(0, Math.round(calculateIncomeTax(100000) - calculateLITO(100000))))}</strong> in income tax (effective rate {formatPercent(Math.max(0, Math.round(calculateIncomeTax(100000) - calculateLITO(100000))) / 100000)}). Add the 2% Medicare levy ({formatAUD(Math.round(100000 * 0.02))}) and your total tax is <strong>{formatAUD(Math.max(0, Math.round(calculateIncomeTax(100000) - calculateLITO(100000))) + Math.round(100000 * 0.02))}</strong>. Take-home: approximately <strong>{formatAUD(100000 - Math.max(0, Math.round(calculateIncomeTax(100000) - calculateLITO(100000))) - Math.round(100000 * 0.02))}</strong>/year or <strong>{formatAUD(annualToWeekly(100000 - Math.max(0, Math.round(calculateIncomeTax(100000) - calculateLITO(100000))) - Math.round(100000 * 0.02)), 2)}</strong>/week.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="highest" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>What is the highest tax rate in Australia?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">The highest marginal rate is <strong>45%</strong> on income over $190,000. Including the Medicare levy (2%), the effective top rate is <strong>47%</strong>. Taxpayers without private health insurance earning above $144,000 also pay the Medicare Levy Surcharge of 1.5%, bringing the total to <strong>48.5%</strong>.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="new-rates" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>When do the new tax rates start?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">Current FY{SITE_CONFIG.financialYear} rates have been in effect since 1 July 2025. The next change takes effect on <strong>1 July 2026</strong>, when the second bracket rate drops from 16% to <strong>15%</strong>. A further reduction to 14% is legislated for 1 July 2027.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="taxable" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>How is taxable income calculated?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">Taxable income equals your assessable income minus allowable deductions. Assessable income includes salary, wages, bonuses, interest, dividends, and rental income. Deductions include work-related expenses such as uniforms, tools, self-education, and professional memberships. Your employer withholds tax via PAYG throughout the year, and you reconcile the difference in your annual tax return.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="marginal-effective" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>What is the difference between marginal rate and effective rate?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">Your marginal rate is the tax rate on the last dollar you earn — it determines the bracket your next dollar falls into. Your effective rate is the average rate across all income (total tax divided by total income). On $80,000: marginal rate = <strong>30%</strong>, effective rate = <strong>{formatPercent(Math.max(0, Math.round(calculateIncomeTax(80000) - calculateLITO(80000))) / 80000)}</strong>. On $150,000: marginal rate = <strong>37%</strong>, effective rate = <strong>{formatPercent(Math.max(0, Math.round(calculateIncomeTax(150000) - calculateLITO(150000))) / 150000)}</strong>.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="30-percent" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>Do I pay 30% tax on my whole salary?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">No. Australia&apos;s tax system is progressive. If your salary is $80,000, the 30% rate only applies to the portion between $45,001 and $80,000 ($35,000). The first $18,200 is tax-free and the next $26,800 is taxed at 15%. Your total tax is <strong>{formatAUD(Math.max(0, Math.round(calculateIncomeTax(80000) - calculateLITO(80000))))}</strong> — an effective rate of <strong>{formatPercent(Math.max(0, Math.round(calculateIncomeTax(80000) - calculateLITO(80000))) / 80000)}</strong>, not 30%. Use our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to see your bracket-by-bracket breakdown.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="200k-tax" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>How much tax on $200,000 in Australia?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">On $200,000, you pay <strong>{formatAUD(Math.max(0, Math.round(calculateIncomeTax(200000) - calculateLITO(200000))))}</strong> in income tax (effective rate: {formatPercent(Math.max(0, Math.round(calculateIncomeTax(200000) - calculateLITO(200000))) / 200000)}). Your marginal rate is 45% on income above $190,000. Add the 2% Medicare levy ({formatAUD(Math.round(200000 * 0.02))}) and total deductions increase to <strong>{formatAUD(Math.max(0, Math.round(calculateIncomeTax(200000) - calculateLITO(200000))) + Math.round(200000 * 0.02))}</strong>. At this income level, check whether the <Link href="/medicare-levy/" className="text-eucalyptus-dark hover:underline">Medicare Levy Surcharge</Link> applies if you do not have private health insurance.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="non-res-threshold" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>Do non-residents get a tax-free threshold?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">No. Non-residents for tax purposes are taxed from the first dollar at <strong>30%</strong> (up to $135,000). They do not receive the $18,200 tax-free threshold, the LITO, or SAPTO. Non-residents also do not pay the Medicare levy. Working holiday makers (visa subclass 417 and 462) pay a flat <strong>15%</strong> on the first $45,000.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="tax-free-threshold" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>What is the tax-free threshold in Australia?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">The tax-free threshold is <strong>$18,200</strong> for Australian residents. Income up to this amount is taxed at 0%. With the Low Income Tax Offset (LITO), the effective tax-free threshold rises to <strong>{formatAUD(LITO.effectiveTaxFreeThreshold)}</strong>, meaning taxpayers earning below this amount pay zero net income tax. You claim the tax-free threshold by selecting &quot;yes&quot; on your TFN Declaration form when starting a new job.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="salary-sacrifice" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>Does salary sacrifice reduce my tax bracket?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">Salary sacrifice into superannuation reduces your taxable income, which lowers the bracket your top dollars fall into. A worker earning $140,000 who sacrifices $10,000 into super drops their taxable income to $130,000, moving from the 37% bracket to the 30% bracket. The sacrificed amount is taxed at <strong>15%</strong> inside super rather than your marginal rate. Use our <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> to model the savings.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="pay-rise-tax" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>Will a pay rise push me into a higher tax bracket?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">A pay rise increases your marginal tax rate only on the additional income, not on your existing salary. Earning $90,000 and receiving a $10,000 raise means the extra $10,000 is taxed at 30% (the third bracket rate). Your first $90,000 continues to be taxed exactly the same. You always take home more after a pay rise — the idea of &quot;losing money&quot; by moving into a higher bracket is a common misconception. See the <Link href="/pay-rise-calculator/" className="text-eucalyptus-dark hover:underline">Pay Rise Calculator</Link> for a detailed before-and-after comparison.</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="super-tax" className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>Is superannuation taxed at my income tax bracket rate?</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">No. Employer super contributions (the SG rate of <strong>12%</strong> in FY{SITE_CONFIG.financialYear}) are taxed at a flat <strong>15%</strong> inside the super fund, not at your marginal income tax rate. High-income earners with combined income and concessional contributions above $250,000 pay an additional 15% (Division 293 tax), bringing the effective super tax rate to 30%. Super contributions do not count toward your income tax bracket calculation.</p></AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* CTA */}
        <section className="bg-eucalyptus-light/40 rounded-2xl p-8 text-center">
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Calculate your exact tax and take-home pay</h2>
          <p className="text-warmgray mb-6 max-w-lg mx-auto">Use our free Australian tax calculator for a personalised breakdown of income tax brackets, Medicare levy, HECS-HELP, and superannuation.</p>
          <Link href="/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all">Pay Calculator →</Link>
        </section>

        <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("tax-brackets"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
      </div>
    </div>
  );
}
