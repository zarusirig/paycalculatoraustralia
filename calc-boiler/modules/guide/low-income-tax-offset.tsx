"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Low Income Tax Offset", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/low-income-tax-offset", publisher: SOURCES.ato.name },
];

export default function LowIncomeTaxOffsetPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Low Income Tax Offset (LITO)</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Low Income Tax Offset (LITO)
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Discover how the LITO automatically slashes your tax bill by up to $700 if you earn under $66,667, and why the "real" tax-free threshold is higher than you think.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* SECTION 1 */}
            <section id="what-is">
              <h2>What Is the Low Income Tax Offset (LITO)?</h2>
              <p>
                The "Low Income Tax Offset" is a non-refundable Australian tax offset that reduces income tax by up to <strong>$700</strong> for residents earning <strong>$66,667 or less</strong> in FY2025-26.
              </p>
              <p>
                LITO operates as a direct dollar-for-dollar reduction of your calculated income tax liability. The Australian Taxation Office (ATO) applies it automatically when you lodge your tax return &mdash; no separate application, no special form, no eligibility test beyond your taxable income figure. Every Australian tax resident whose assessable income falls under the $66,667 cut-off receives some amount of LITO.
              </p>
              <p>
                Because LITO is non-refundable, it reduces your tax bill to a minimum of <strong>$0</strong> but never generates a cash refund on its own. A taxpayer who owes $400 in income tax and qualifies for the full $700 LITO receives a $400 reduction, not a $300 payment. This distinguishes LITO from refundable offsets such as the franking credit refund available to shareholders.
              </p>
              <p>
                LITO affects approximately <strong>7.2 million</strong> Australian tax returns each year, covering part-time workers, entry-level employees, retirees drawing modest superannuation pensions, and sole traders with lower assessable income. Use our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to see how LITO interacts with your marginal tax rate and total taxation for the 2025-26 financial year.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Check Your LITO Calculation</h3>
                    <p className="text-navy text-sm mb-3">Our calculator automatically detects if you are eligible for the LITO and instantly factors the $700 deduction into your take-home pay.</p>
                    <Link href="/take-home-pay-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      See your exact LITO deduction <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2 */}
            <section id="how-calculated">
              <h2>How Is LITO Calculated?</h2>
              <p>
                LITO is calculated using a two-stage phase-out formula that reduces the offset from <strong>$700 to $0</strong> as taxable income rises from $37,500 to $66,667.
              </p>
              <p>
                The calculation uses two distinct phase-out rates across two income bands. The first phase-out reduces the offset at <strong>5 cents per dollar</strong> earned above $37,500, lowering the LITO from $700 to $325 by the time income reaches $45,000. The second phase-out applies a gentler rate of <strong>1.5 cents per dollar</strong> above $45,000, tapering the remaining $325 down to $0 at $66,667.
              </p>

              <h3>LITO Phase-Out Thresholds for FY2025-26</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Your Taxable Income</th>
                        <th className="px-6 py-4">LITO Amount</th>
                        <th className="px-6 py-4">Phase-Out Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-4 font-semibold">$0 &ndash; $37,500</td><td className="px-6 py-4 text-eucalyptus-dark font-bold">$700 (maximum)</td><td className="px-6 py-4">No phase-out</td></tr>
                      <tr><td className="px-6 py-4">$37,501 &ndash; $45,000</td><td className="px-6 py-4">$700 minus 5c per $1 over $37,500</td><td className="px-6 py-4">5 cents per dollar</td></tr>
                      <tr><td className="px-6 py-4">$45,001 &ndash; $66,667</td><td className="px-6 py-4">$325 minus 1.5c per $1 over $45,000</td><td className="px-6 py-4">1.5 cents per dollar</td></tr>
                      <tr><td className="px-6 py-4 bg-sandstone">$66,668 or more</td><td className="px-6 py-4 bg-sandstone text-warmgray-light font-semibold">$0</td><td className="px-6 py-4 bg-sandstone">Not applicable</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3>Step-by-Step LITO Formula</h3>
              <ol>
                <li>Determine your taxable income for the financial year (gross income minus allowable deductions).</li>
                <li>If taxable income is <strong>$37,500 or less</strong>, your LITO is the full <strong>$700</strong>.</li>
                <li>If taxable income falls between $37,501 and $45,000, calculate: $700 &minus; (taxable income &minus; $37,500) &times; 0.05.</li>
                <li>If taxable income falls between $45,001 and $66,667, calculate: $325 &minus; (taxable income &minus; $45,000) &times; 0.015.</li>
                <li>If taxable income exceeds $66,667, LITO equals <strong>$0</strong>.</li>
                <li>Subtract the LITO amount from your calculated income tax. The result cannot go below $0.</li>
              </ol>
              <p>
                The two-stage phase-out prevents a sharp cliff where the offset disappears overnight. A taxpayer earning $50,000 still receives a LITO of <strong>$250</strong>, softening the transition into higher income tax brackets. You can verify these calculations instantly using our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link>.
              </p>
            </section>

            {/* SECTION 3 */}
            <section id="eligibility">
              <h2>Who Is Eligible for LITO?</h2>
              <p>
                Every Australian resident for tax purposes with taxable income of <strong>$66,667 or less</strong> is eligible for the Low Income Tax Offset in FY2025-26.
              </p>
              <p>
                Eligibility is determined solely by two criteria: tax residency status and taxable income. The ATO does not impose age restrictions, employment type requirements, or asset tests. The following groups commonly qualify:
              </p>
              <ul>
                <li><strong>Part-time and casual employees</strong> earning below the $66,667 threshold</li>
                <li><strong>Full-time workers</strong> in entry-level, retail, hospitality, and aged care roles</li>
                <li><strong>Self-employed sole traders</strong> with net business income under $66,667</li>
                <li><strong>Retirees</strong> receiving taxable superannuation pensions or annuities</li>
                <li><strong>Working holiday makers</strong> who qualify as Australian residents for tax purposes</li>
                <li><strong>Students</strong> with part-time employment income</li>
              </ul>
              <p>
                Non-residents are <strong>not eligible</strong> for LITO. Temporary residents classified as non-residents for tax purposes pay tax from the first dollar with no tax-free threshold and no LITO. Learn more about non-resident taxation in our <Link href="/non-resident-tax/">Non-Resident Tax Guide</Link>.
              </p>
            </section>

            {/* SECTION 4 */}
            <section id="lito-amount-table">
              <h2>LITO Amount Table by Income Level</h2>
              <p>
                The LITO ranges from <strong>$700 at $20,000</strong> down to <strong>$0 at $66,668</strong>, with the sharpest reduction occurring between $37,500 and $45,000.
              </p>
              <p>
                The table below shows the exact LITO amount and effective tax saving at representative income levels from $20,000 to $80,000 for the 2025-26 financial year.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-4">Taxable Income</th>
                        <th className="px-5 py-4">LITO Amount</th>
                        <th className="px-5 py-4">Income Tax Before LITO</th>
                        <th className="px-5 py-4">Income Tax After LITO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3 font-semibold">$20,000</td><td className="px-5 py-3 text-eucalyptus-dark font-bold">$700</td><td className="px-5 py-3">$288</td><td className="px-5 py-3 font-bold">$0</td></tr>
                      <tr><td className="px-5 py-3 font-semibold">$25,000</td><td className="px-5 py-3 text-eucalyptus-dark font-bold">$700</td><td className="px-5 py-3">$1,088</td><td className="px-5 py-3 font-bold">$388</td></tr>
                      <tr><td className="px-5 py-3 font-semibold">$30,000</td><td className="px-5 py-3 text-eucalyptus-dark font-bold">$700</td><td className="px-5 py-3">$1,888</td><td className="px-5 py-3 font-bold">$1,188</td></tr>
                      <tr><td className="px-5 py-3 font-semibold">$37,500</td><td className="px-5 py-3 text-eucalyptus-dark font-bold">$700</td><td className="px-5 py-3">$3,088</td><td className="px-5 py-3 font-bold">$2,388</td></tr>
                      <tr><td className="px-5 py-3 font-semibold">$40,000</td><td className="px-5 py-3 text-eucalyptus-dark font-bold">$575</td><td className="px-5 py-3">$3,488</td><td className="px-5 py-3 font-bold">$2,913</td></tr>
                      <tr><td className="px-5 py-3 font-semibold">$45,000</td><td className="px-5 py-3 text-eucalyptus-dark font-bold">$325</td><td className="px-5 py-3">$4,288</td><td className="px-5 py-3 font-bold">$3,963</td></tr>
                      <tr><td className="px-5 py-3 font-semibold">$50,000</td><td className="px-5 py-3 text-eucalyptus-dark font-bold">$250</td><td className="px-5 py-3">$5,788</td><td className="px-5 py-3 font-bold">$5,538</td></tr>
                      <tr><td className="px-5 py-3 font-semibold">$55,000</td><td className="px-5 py-3 text-eucalyptus-dark font-bold">$175</td><td className="px-5 py-3">$7,288</td><td className="px-5 py-3 font-bold">$7,113</td></tr>
                      <tr><td className="px-5 py-3 font-semibold">$60,000</td><td className="px-5 py-3 text-eucalyptus-dark font-bold">$100</td><td className="px-5 py-3">$8,788</td><td className="px-5 py-3 font-bold">$8,688</td></tr>
                      <tr><td className="px-5 py-3 font-semibold">$66,667</td><td className="px-5 py-3 text-eucalyptus-dark font-bold">$0</td><td className="px-5 py-3">$10,788</td><td className="px-5 py-3 font-bold">$10,788</td></tr>
                      <tr><td className="px-5 py-3 bg-sandstone font-semibold">$80,000</td><td className="px-5 py-3 bg-sandstone text-warmgray-light font-semibold">$0</td><td className="px-5 py-3 bg-sandstone">$14,788</td><td className="px-5 py-3 bg-sandstone font-bold">$14,788</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-sm text-warmgray-light mt-2 italic">
                Note: Income tax figures use FY2025-26 tax brackets for Australian residents claiming the tax-free threshold. Medicare levy is excluded from this table. Check our <Link href="/tax-brackets/">Australian Tax Brackets</Link> page for the full rate schedule.
              </p>
            </section>

            {/* SECTION 5 */}
            <section id="take-home-pay">
              <h2>How Does LITO Affect Take-Home Pay?</h2>
              <p>
                LITO increases take-home pay by reducing the income tax withheld from each pay cycle, adding up to <strong>$700 per year</strong> or <strong>$13.46 per week</strong> for eligible workers.
              </p>
              <p>
                Your employer does not apply LITO as a separate line item on your payslip. Instead, the ATO&rsquo;s <Link href="/payg-withholding-tables/">PAYG Withholding Tables</Link> incorporate the LITO into the standard withholding amounts. When your employer withholds tax each pay cycle, the LITO reduction is already baked into the lower withholding figure.
              </p>

              <h3>Worked Example: $42,000 Annual Salary</h3>
              <p>
                An employee earning a gross salary of <strong>$42,000</strong> in FY2025-26 receives the following treatment:
              </p>
              <ol>
                <li>Taxable income: <strong>$42,000</strong> (assuming no deductions for simplicity).</li>
                <li>Income tax on $42,000: the first $18,200 is tax-free; the next $23,800 ($18,201 to $42,000) is taxed at 16% = <strong>$3,808</strong>.</li>
                <li>LITO calculation: $42,000 falls between $37,501 and $45,000. LITO = $700 &minus; ($42,000 &minus; $37,500) &times; 0.05 = $700 &minus; $225 = <strong>$475</strong>.</li>
                <li>Tax after LITO: $3,808 &minus; $475 = <strong>$3,333</strong>.</li>
                <li>Medicare levy at 2%: $42,000 &times; 0.02 = <strong>$840</strong>.</li>
                <li>Superannuation (SG at 12%): $42,000 &times; 0.12 = <strong>$5,040</strong> (paid by employer on top of salary).</li>
                <li>Annual take-home pay: $42,000 &minus; $3,333 &minus; $840 = <strong>$37,827</strong>.</li>
                <li>Weekly take-home pay: $37,827 &divide; 52 = <strong>$727.44</strong>.</li>
              </ol>
              <p>
                Without LITO, this employee would pay $3,808 in income tax instead of $3,333, reducing take-home pay by <strong>$475 per year</strong> or <strong>$9.13 per week</strong>. Verify your own scenario using the <Link href="/weekly-pay-calculator/">Weekly Pay Calculator</Link>.
              </p>
            </section>

            {/* SECTION 6 */}
            <section id="lito-vs-sapto">
              <h2>LITO vs SAPTO &mdash; What Is the Difference?</h2>
              <p>
                LITO is available to all Australian residents earning under $66,667, while the "Seniors and Pensioners Tax Offset" (SAPTO) is restricted to taxpayers who meet Age Pension age and income requirements.
              </p>
              <p>
                Both offsets are non-refundable and reduce income tax to a minimum of $0. The critical difference is that SAPTO and LITO can <strong>stack together</strong>, creating an even larger effective tax-free threshold for eligible seniors. A single senior who qualifies for both receives up to $700 (LITO) plus up to $2,230 (SAPTO), for a combined maximum offset of <strong>$2,930</strong>.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-4">Feature</th>
                        <th className="px-5 py-4">LITO</th>
                        <th className="px-5 py-4">SAPTO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3 font-semibold">Maximum amount (single)</td><td className="px-5 py-3">$700</td><td className="px-5 py-3">$2,230</td></tr>
                      <tr><td className="px-5 py-3 font-semibold">Age requirement</td><td className="px-5 py-3">None</td><td className="px-5 py-3">Age Pension age (67+)</td></tr>
                      <tr><td className="px-5 py-3 font-semibold">Income cut-off (single)</td><td className="px-5 py-3">$66,667</td><td className="px-5 py-3">$50,119</td></tr>
                      <tr><td className="px-5 py-3 font-semibold">Refundable?</td><td className="px-5 py-3">No</td><td className="px-5 py-3">No</td></tr>
                      <tr><td className="px-5 py-3 font-semibold">Application required?</td><td className="px-5 py-3">No (automatic)</td><td className="px-5 py-3">No (automatic)</td></tr>
                      <tr><td className="px-5 py-3 font-semibold">Can stack with other offsets?</td><td className="px-5 py-3">Yes (stacks with SAPTO)</td><td className="px-5 py-3">Yes (stacks with LITO)</td></tr>
                      <tr><td className="px-5 py-3 font-semibold">Effective tax-free threshold (single)</td><td className="px-5 py-3">$22,575</td><td className="px-5 py-3">$33,089 (with LITO)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The combined effect of LITO plus SAPTO means a single Australian pensioner pays <strong>$0 income tax</strong> on the first $33,089 of taxable income. Couples where each member qualifies receive separate SAPTO amounts, each capped at $1,602. This stacking arrangement makes the Australian tax offset system one of the most generous for seniors among OECD countries.
              </p>
            </section>

            {/* SECTION 7 */}
            <section id="effective-threshold">
              <h2>How Does LITO Interact with the Tax-Free Threshold?</h2>
              <p>
                LITO raises the effective tax-free threshold from the official <strong>$18,200</strong> to <strong>$22,575</strong>, meaning no income tax is payable on the first $22,575 of earnings.
              </p>
              <p>
                The official <Link href="/tax-brackets/">Australian tax brackets</Link> set the tax-free threshold at $18,200. Income between $18,201 and $45,000 is taxed at <strong>16%</strong> under the FY2025-26 rate schedule. LITO then offsets a portion of this tax, effectively extending the zero-tax zone.
              </p>
              <p>
                Here is the mathematical proof:
              </p>
              <ol>
                <li>An individual earns exactly <strong>$22,575</strong>.</li>
                <li>The first $18,200 is tax-free.</li>
                <li>The remaining $4,375 falls into the 16% tax bracket.</li>
                <li>$4,375 &times; 16% = <strong>$700</strong> in raw tax owed.</li>
                <li>The ATO applies the full $700 LITO offset because income is under $37,500.</li>
                <li>$700 tax owed &minus; $700 LITO = <strong>$0 total tax</strong>.</li>
              </ol>
              <p className="text-lg font-medium text-navy border-l-4 border-eucalyptus pl-4 py-1 mt-6">
                Because of LITO, you don&rsquo;t pay a single cent of income tax until you earn over $22,575.
              </p>
              <p>
                This effective threshold changed on 1 July 2024 when the Stage 3 tax cuts reduced the lowest marginal rate from 19% to 16%. Before that date, the effective tax-free threshold was $21,884. The $691 increase benefits every Australian earning between $21,884 and $22,575 who previously owed a small amount of income tax.
              </p>
            </section>

            {/* SECTION 8 */}
            <section id="how-applied">
              <h2>How Is LITO Applied During the Year?</h2>
              <p>
                LITO is applied incrementally through the PAYG withholding system, spreading the offset across every pay cycle rather than delivering a lump sum at tax time.
              </p>
              <p>
                Your employer&rsquo;s payroll software follows the ATO&rsquo;s <Link href="/payg-withholding-tables/">PAYG Withholding Tables</Link>, which already incorporate the LITO mathematics. When you see your weekly, fortnightly, or monthly tax deducted on your payslip, the LITO discount has been distributed across your pay periods. A full-time employee receiving 26 fortnightly pays sees approximately <strong>$26.92 less tax per fortnight</strong> from the maximum LITO of $700.
              </p>
              <p>
                This incremental application means most employees receive the correct net LITO benefit throughout the year. Discrepancies arise when an employee holds multiple jobs, changes income mid-year, or has other offsets. In those cases, any under-claimed LITO is reconciled as part of your annual tax return, and the ATO adjusts your refund or liability accordingly. Use our <Link href="/tax-return-calculator/">Tax Return Calculator</Link> to estimate whether you will receive a refund from LITO adjustments.
              </p>
            </section>

            {/* CONTEXT BORDER */}

            {/* SECTION 9 */}
            <section id="changes-fy2025-26">
              <h2>What Changed for LITO in FY2025-26?</h2>
              <p>
                The LITO thresholds and maximum amount of <strong>$700</strong> remain unchanged for FY2025-26, but the Stage 3 tax cuts alter how LITO interacts with the income tax brackets.
              </p>
              <p>
                The Stage 3 tax reform, effective from 1 July 2024, introduced three changes that affect LITO&rsquo;s practical impact:
              </p>
              <ul>
                <li>The 19% marginal rate dropped to <strong>16%</strong>, reducing raw tax on income between $18,201 and $45,000</li>
                <li>The 32.5% marginal rate dropped to <strong>30%</strong>, reducing tax on income between $45,001 and $135,000</li>
                <li>The $120,000 threshold for the 37% rate increased to <strong>$135,000</strong></li>
              </ul>
              <p>
                These bracket changes raised the effective tax-free threshold from $21,884 (under the old 19% rate) to <strong>$22,575</strong> (under the new 16% rate). The LITO itself did not change, but taxpayers in the $18,201&ndash;$45,000 band now owe less tax before LITO is applied, meaning the offset has a larger proportional impact. A worker earning $30,000 now pays <strong>$1,188</strong> after LITO (down from $1,540 under the old 19% bracket).
              </p>
              <p>
                The previous "Low and Middle Income Tax Offset" (LMITO), which provided up to $1,500 in additional relief, ended after FY2021-22 and has not been reinstated. LITO remains the sole broad-based low-income tax offset in the Australian tax system.
              </p>
            </section>

            {/* SECTION 10 */}
            <section id="related-resources">
              <h2>Related Resources</h2>
              <p>
                LITO intersects with multiple areas of Australian taxation and take-home pay calculations. The following resources provide detailed coverage of each related topic.
              </p>
              <div className="not-prose my-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href="/take-home-pay-calculator/" className="group flex items-center justify-between p-4 rounded-lg bg-sandstone border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                    <div>
                      <span className="text-sm font-bold text-navy group-hover:text-eucalyptus-dark block">Take-Home Pay Calculator</span>
                      <span className="text-xs text-warmgray">See LITO applied to your salary instantly</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                  </Link>
                  <Link href="/tax-brackets/" className="group flex items-center justify-between p-4 rounded-lg bg-sandstone border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                    <div>
                      <span className="text-sm font-bold text-navy group-hover:text-eucalyptus-dark block">Australian Tax Brackets</span>
                      <span className="text-xs text-warmgray">FY2025-26 marginal tax rates and thresholds</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                  </Link>
                  <Link href="/medicare-levy/" className="group flex items-center justify-between p-4 rounded-lg bg-sandstone border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                    <div>
                      <span className="text-sm font-bold text-navy group-hover:text-eucalyptus-dark block">Medicare Levy Guide</span>
                      <span className="text-xs text-warmgray">2% levy thresholds and exemptions</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                  </Link>
                  <Link href="/superannuation-guide/" className="group flex items-center justify-between p-4 rounded-lg bg-sandstone border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                    <div>
                      <span className="text-sm font-bold text-navy group-hover:text-eucalyptus-dark block">Superannuation Guide</span>
                      <span className="text-xs text-warmgray">SG rate, caps, and employer obligations</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                  </Link>
                  <Link href="/salary-sacrifice-guide/" className="group flex items-center justify-between p-4 rounded-lg bg-sandstone border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                    <div>
                      <span className="text-sm font-bold text-navy group-hover:text-eucalyptus-dark block">Salary Sacrifice Guide</span>
                      <span className="text-xs text-warmgray">Reduce taxable income to maximise LITO</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                  </Link>
                  <Link href="/hecs-help-guide/" className="group flex items-center justify-between p-4 rounded-lg bg-sandstone border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                    <div>
                      <span className="text-sm font-bold text-navy group-hover:text-eucalyptus-dark block">HECS-HELP Repayment Guide</span>
                      <span className="text-xs text-warmgray">How study debt interacts with LITO</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                  </Link>
                </div>
              </div>
            </section>

            {/* SECTION 11 */}
            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="what-is" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the Low Income Tax Offset (LITO)?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The LITO is a non-refundable tax offset provided by the Australian government to lower-income earners. It directly reduces the amount of income tax you have to pay, offering a maximum reduction of $700 for those earning under $37,500.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="how-claim" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How do I claim the LITO?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    You don't need to apply or tick a specific box to claim it. When you lodge your tax return at the end of the financial year, the ATO automatically calculates your eligibility based on your taxable income, applies the offset to reduce your overall tax bill, and issues any resulting refund.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="threshold" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the real tax-free threshold in Australia?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    While the official, heavily marketed tax-free threshold is $18,200, the addition of the maximum $700 LITO means you can effectively earn up to $22,575 before you actually have to pay a single cent of income tax to the ATO.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="lmito" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What happened to LMITO (the Low and Middle Income Tax Offset)?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The LMITO was a temporary additional offset worth up to $1,500 that applied from the 2018-19 to 2021-22 financial years. It was not extended beyond FY2021-22, so LITO is now the only broad low-income tax offset available. The Stage 3 tax cuts (effective from 1 July 2024) were partially designed to compensate for the removal of LMITO by lowering the 32.5% bracket to 30% and adjusting thresholds.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="multiple-jobs" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does LITO apply if I have multiple jobs?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. LITO is calculated on your total taxable income from all sources combined, not per job. If your combined income from two or more jobs stays under $66,667, you receive the LITO. Your secondary employer typically withholds tax at a higher rate (no tax-free threshold), but the ATO reconciles LITO across all jobs when you lodge your annual return.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="refund" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can LITO generate a tax refund?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    LITO alone cannot generate a cash refund because it is non-refundable &mdash; it reduces your tax to $0 but not below. However, LITO can indirectly contribute to a refund when combined with PAYG withholding. If your employer withheld more tax during the year than your final tax liability after LITO, the ATO refunds the excess withholding.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="part-year" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is LITO pro-rated if I work part of the year?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. LITO is not pro-rated based on how many months you worked. It is calculated on your total taxable income for the full financial year. If you worked 6 months and earned $25,000 total, you receive the full $700 LITO because your taxable income is below $37,500.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="self-employed" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do self-employed people get the LITO?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Sole traders, freelancers, and contractors who are Australian residents for tax purposes receive the LITO based on their net business income (assessable income minus allowable business deductions). The offset applies identically to employment income and business income.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="super-pension" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does LITO apply to superannuation pension income?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Taxable superannuation pension income (from a taxed super fund, for recipients aged 60 or under preservation age) counts toward your assessable income. If your total taxable income including the pension is under $66,667, you receive the LITO. Retirees aged 67 or older often also qualify for SAPTO, which stacks with LITO for a combined offset of up to $2,930.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="salary-sacrifice" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can salary sacrifice help me get a larger LITO?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Salary sacrificing into superannuation reduces your taxable income. If your pre-sacrifice income is above $66,667 but your post-sacrifice taxable income drops below that threshold, you become eligible for the LITO. For example, salary sacrificing $10,000 from a $72,000 salary brings taxable income down to $62,000, qualifying for a LITO of approximately $145.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="non-resident" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do non-residents get LITO?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. Non-residents for Australian tax purposes are not eligible for the LITO, the tax-free threshold, or SAPTO. Non-residents pay tax from the first dollar at a rate of 30% on income up to $135,000. Working holiday makers on 417 and 462 visas pay a flat 15% on the first $45,000 regardless of residency status.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="lito-vs-deduction" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the difference between a tax offset and a tax deduction?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    A tax deduction reduces your taxable income before tax is calculated, so the tax saving equals the deduction multiplied by your marginal rate. A $700 deduction at the 30% marginal rate saves $210. A tax offset (like LITO) reduces your calculated tax bill directly by the full dollar amount. A $700 offset saves exactly $700 in tax, making offsets more valuable dollar-for-dollar than deductions.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>Thresholds and offset rules conform to the ATO guidelines for the 2024–25 and 2025-26 income years following the implementation of the Stage 3 tax cuts (which lowered the primary bracket to 16%, adjusting the effective tax-free math up to $22,575).</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("low-income-tax-offset"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Guides</h3>
                  <div className="space-y-3">
                    <Link href="/tax-brackets/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Tax Brackets Checker</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/medicare-levy/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Medicare Levy Guide</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/understanding-your-payslip/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Read Your Payslip</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Are you eligible?</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Pop your gross wage into our calculator to see if the LITO applies to you, and how much it saves you.</p>
                  <Link href="/take-home-pay-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Calculate Tax
                  </Link>
                </CardContent>
              </Card>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
