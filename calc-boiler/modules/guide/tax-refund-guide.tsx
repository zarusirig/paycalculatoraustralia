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
  { title: "Lodge your tax return", url: "https://www.ato.gov.au/individuals-and-families/your-tax-return", publisher: SOURCES.ato.name },
  { title: "Deductions you can claim", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim", publisher: SOURCES.ato.name },
  { title: "Income tax rates for individuals", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Processing times for tax returns", url: "https://www.ato.gov.au/businesses-and-organisations/preparing-lodging-and-paying/reports-and-returns/due-dates-for-lodging-and-paying", publisher: SOURCES.ato.name },
];

export default function TaxRefundGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Tax Refund Guide</span></li></ol></nav>
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tax Refund Guide — How Tax Returns Work in Australia</h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">Understand how tax refunds work, what deductions you can claim, and how to maximise your return. A complete guide to the Australian tax return process for FY2025-26.</p>
          <TrustBar className="!max-w-none" />
        </header>
        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* ───── SECTION 1: What Is a Tax Refund? ───── */}
            <section id="what-is-tax-refund">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is a Tax Refund?</h2>
              <p>
                A tax refund is the amount the Australian Taxation Office (ATO) returns to you when your employer withheld <strong>more PAYG tax than your actual liability</strong> for the financial year. The ATO calculates your refund after you lodge your tax return, comparing total tax withheld against your assessed tax on taxable income.
              </p>
              <p>
                Throughout each pay cycle, your employer deducts income tax based on PAYG withholding schedules. These schedules assume you earn the same amount every pay period for the full 12 months. Three common situations create a gap between tax withheld and tax owed: claiming work-related deductions that reduce taxable income, working for only part of the financial year, and receiving tax offsets such as the &quot;Low Income Tax Offset&quot; (LITO) worth up to <strong>$700</strong>.
              </p>
              <p>
                The refund is not free money from the government — it is your own income that was over-withheld. Use our <Link href="/tax-return-calculator/">Tax Return Estimator</Link> to calculate whether you are likely to receive a refund or owe additional tax for FY2025-26.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Estimate Your Tax Refund</h3>
                    <p className="text-navy text-sm mb-3">Enter your income, tax withheld, and deductions to see if you are getting money back or owe the ATO.</p>
                    <Link href="/tax-return-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Use our Tax Return Estimator <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* ───── SECTION 2: How Is Your Tax Refund Calculated? ───── */}
            <section id="how-calculated">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Your Tax Refund Calculated?</h2>
              <p>
                Your tax refund equals the difference between <strong>total PAYG tax withheld and your assessed tax liability</strong>. The ATO applies Australian income tax brackets, the Medicare levy, tax offsets, and allowable deductions to arrive at the final figure.
              </p>
              <p>
                The calculation follows a defined sequence. The ATO first determines gross income from all sources: salary, wages, interest, dividends, rental income, and capital gains. Allowable deductions are then subtracted from gross income to produce taxable income. Income tax is calculated on taxable income using the FY2025-26 resident tax brackets.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked Example at $85,000</h3>
              <p>
                An employee earning <strong>$85,000</strong> gross salary with <strong>$2,500</strong> in work-related deductions has a taxable income of <strong>$82,500</strong>. The income tax on $82,500 is <strong>$15,538</strong> (calculated as $4,288 base + 30% on the amount over $45,000). The Medicare levy adds <strong>$1,650</strong> (2% of $82,500). After applying the LITO of <strong>$0</strong> (phased out above $66,667), total tax liability is <strong>$17,188</strong>.
              </p>
              <p>
                If the employer withheld <strong>$19,717</strong> in PAYG tax (based on $85,000 without deductions), the refund is $19,717 minus $17,188 = <strong>$2,529</strong>. The deductions of $2,500 saved <strong>$750</strong> in tax at the 30% marginal rate. Use our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to model your own scenario with specific income and deduction amounts.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tax Refund Formula</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Step</th><th className="px-5 py-3">Calculation</th><th className="px-5 py-3 text-right">Example ($85k)</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">1. Gross income</td><td className="px-5 py-3">All assessable income sources</td><td className="px-5 py-3 text-right">$85,000</td></tr>
                      <tr><td className="px-5 py-3">2. Subtract deductions</td><td className="px-5 py-3">Gross income − allowable deductions</td><td className="px-5 py-3 text-right">$82,500</td></tr>
                      <tr><td className="px-5 py-3">3. Income tax on taxable income</td><td className="px-5 py-3">Apply FY2025-26 tax brackets</td><td className="px-5 py-3 text-right">$15,538</td></tr>
                      <tr><td className="px-5 py-3">4. Add Medicare levy</td><td className="px-5 py-3">2% of taxable income</td><td className="px-5 py-3 text-right">$1,650</td></tr>
                      <tr><td className="px-5 py-3">5. Subtract tax offsets</td><td className="px-5 py-3">LITO, SAPTO, other offsets</td><td className="px-5 py-3 text-right">$0</td></tr>
                      <tr><td className="px-5 py-3">6. Total tax liability</td><td className="px-5 py-3">Step 3 + Step 4 − Step 5</td><td className="px-5 py-3 text-right">$17,188</td></tr>
                      <tr className="font-semibold text-navy"><td className="px-5 py-3">7. Tax refund</td><td className="px-5 py-3">Total PAYG withheld − Total tax liability</td><td className="px-5 py-3 text-right">$2,529</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ───── SECTION 3: What Is the Average Tax Refund in Australia? ───── */}
            <section id="average-refund">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Average Tax Refund in Australia?</h2>
              <p>
                The average Australian tax refund is approximately <strong>$2,900</strong> based on ATO statistics from the most recent complete data year. Refund amounts vary significantly by income level, occupation, and the value of deductions claimed.
              </p>
              <p>
                Taxpayers in higher income tax brackets tend to receive larger refunds in dollar terms because deductions save tax at a higher marginal rate. A $3,000 deduction saves <strong>$480</strong> for someone in the 16% bracket but saves <strong>$1,350</strong> for someone in the 45% bracket. Part-year workers and those with multiple income sources also tend to receive above-average refunds due to withholding mismatches.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Average Refund by Income Level</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Taxable Income Range</th><th className="px-5 py-3">Tax Bracket</th><th className="px-5 py-3 text-right">Typical Refund</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">$0 – $18,200</td><td className="px-5 py-3">0% (tax-free threshold)</td><td className="px-5 py-3 text-right">$0 – $500</td></tr>
                      <tr><td className="px-5 py-3">$18,201 – $45,000</td><td className="px-5 py-3">16%</td><td className="px-5 py-3 text-right">$800 – $1,500</td></tr>
                      <tr><td className="px-5 py-3">$45,001 – $135,000</td><td className="px-5 py-3">30%</td><td className="px-5 py-3 text-right">$2,000 – $4,000</td></tr>
                      <tr><td className="px-5 py-3">$135,001 – $190,000</td><td className="px-5 py-3">37%</td><td className="px-5 py-3 text-right">$3,500 – $6,000</td></tr>
                      <tr><td className="px-5 py-3">$190,001+</td><td className="px-5 py-3">45%</td><td className="px-5 py-3 text-right">$4,000 – $10,000+</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Individuals below the <strong>$18,200</strong> tax-free threshold who had PAYG tax withheld receive a full refund of all tax paid. This commonly applies to students, part-time workers, and people who started employment partway through the year. Review the current <Link href="/tax-brackets/">Tax Brackets Guide</Link> to identify which marginal rate applies to your assessable income.
              </p>
            </section>

            {/* ───── SECTION 4: Top Tax Deductions That Increase Your Refund ───── */}
            <section id="top-deductions">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Top Tax Deductions That Increase Your Refund?</h2>
              <p>
                Work-related deductions are the primary driver of tax refunds for Australian employees, reducing taxable income and the tax owed on it. The ATO allows deductions for expenses directly related to earning your assessable income, provided you have records such as receipts, invoices, or diary entries.
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Deduction Category</th><th className="px-5 py-3">Method / Details</th><th className="px-5 py-3 text-right">Typical Claim Range</th><th className="px-5 py-3 text-right">Tax Saved (30% bracket)</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Work from home</td><td className="px-5 py-3">Fixed rate: 67c per hour</td><td className="px-5 py-3 text-right">$1,000 – $3,000</td><td className="px-5 py-3 text-right">$300 – $900</td></tr>
                      <tr><td className="px-5 py-3">Car / travel expenses</td><td className="px-5 py-3">Work-related travel (not home-to-work commuting)</td><td className="px-5 py-3 text-right">$500 – $5,000</td><td className="px-5 py-3 text-right">$150 – $1,500</td></tr>
                      <tr><td className="px-5 py-3">Uniforms / protective clothing</td><td className="px-5 py-3">Occupation-specific, compulsory, or protective clothing + laundry</td><td className="px-5 py-3 text-right">$150 – $500</td><td className="px-5 py-3 text-right">$45 – $150</td></tr>
                      <tr><td className="px-5 py-3">Self-education expenses</td><td className="px-5 py-3">Courses, textbooks, and conferences related to current employment</td><td className="px-5 py-3 text-right">$200 – $2,000</td><td className="px-5 py-3 text-right">$60 – $600</td></tr>
                      <tr><td className="px-5 py-3">Tools and equipment</td><td className="px-5 py-3">Items costing $300 or less: immediate deduction; over $300: depreciate</td><td className="px-5 py-3 text-right">$100 – $1,000</td><td className="px-5 py-3 text-right">$30 – $300</td></tr>
                      <tr><td className="px-5 py-3">Phone and internet</td><td className="px-5 py-3">Work-use percentage of personal plans</td><td className="px-5 py-3 text-right">$200 – $800</td><td className="px-5 py-3 text-right">$60 – $240</td></tr>
                      <tr><td className="px-5 py-3">Union / professional fees</td><td className="px-5 py-3">Membership of unions, professional associations, and registration boards</td><td className="px-5 py-3 text-right">$200 – $1,000</td><td className="px-5 py-3 text-right">$60 – $300</td></tr>
                      <tr><td className="px-5 py-3">Income protection insurance</td><td className="px-5 py-3">Premiums for policies covering loss of income</td><td className="px-5 py-3 text-right">$300 – $1,500</td><td className="px-5 py-3 text-right">$90 – $450</td></tr>
                      <tr><td className="px-5 py-3">Donations (DGR)</td><td className="px-5 py-3">Gifts of $2+ to deductible gift recipients</td><td className="px-5 py-3 text-right">$50 – $2,000</td><td className="px-5 py-3 text-right">$15 – $600</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Claims without receipts are limited to <strong>$300 total</strong> for work-related expenses under the no-receipt threshold. The ATO uses data matching to compare your claims against others in the same occupation and income bracket. Unusually high claims relative to peers trigger review. Salary sacrifice arrangements offer a separate pathway to reduce taxable income — see our <Link href="/salary-sacrifice-guide/">Salary Sacrifice Guide</Link> for details.
              </p>
            </section>

            {/* ───── SECTION 5: Step-by-Step: How to Lodge Your Tax Return ───── */}
            <section id="how-to-lodge">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Do You Lodge Your Tax Return?</h2>
              <p>
                Most Australians lodge their tax return through <strong>myTax</strong>, the ATO&apos;s free online tool accessible via myGov. The process takes <strong>15–30 minutes</strong> for straightforward returns with pre-filled employer data and no complex investments.
              </p>
              <ol>
                <li><strong>Log into myGov</strong> at <a href="https://my.gov.au" target="_blank" rel="noopener noreferrer">my.gov.au</a> and navigate to the ATO section. Link your ATO account if you have not done so previously.</li>
                <li><strong>Wait for pre-fill data.</strong> Your employer&apos;s income statement, bank interest, private health insurance details, and government payments auto-populate after 14 July. Lodging before pre-fill data is available increases the risk of errors.</li>
                <li><strong>Verify your income.</strong> Check that your salary, wages, allowances, and other income match your final payslip and payment summaries. Report all assessable income including interest above $1, dividends, rental income, and capital gains.</li>
                <li><strong>Add deductions.</strong> Enter work-related expenses, self-education costs, donations, and other allowable deductions. The ATO pre-fills some deductions such as income protection insurance and tax agent fees from the prior year.</li>
                <li><strong>Review offsets and levies.</strong> The system automatically applies the &quot;Low Income Tax Offset&quot; (LITO), the &quot;Medicare Levy&quot; at 2%, and the &quot;Medicare Levy Surcharge&quot; if applicable. Confirm your private health insurance status to avoid an incorrect MLS charge.</li>
                <li><strong>Submit and receive your Notice of Assessment.</strong> The ATO issues a Notice of Assessment confirming your refund amount or tax debt. Electronic lodgments processed within 14 business days receive refunds via direct deposit.</li>
              </ol>
              <p>
                Alternatively, a registered tax agent lodges on your behalf for a fee of <strong>$100–$400</strong> for standard individual returns. Tax agents access extended deadlines up to 15 May the following year. Complex returns involving investment properties, capital gains, foreign income, or business income benefit from professional preparation.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Key Deadlines for FY2025-26</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Date</th><th className="px-5 py-3">Event</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3 font-medium">1 July 2026</td><td className="px-5 py-3">FY2025-26 ends; income statements become available in myGov</td></tr>
                      <tr><td className="px-5 py-3 font-medium">14 July 2026</td><td className="px-5 py-3">Most employers finalise and submit income statements to the ATO</td></tr>
                      <tr><td className="px-5 py-3 font-medium">31 October 2026</td><td className="px-5 py-3">Deadline for self-prepared tax returns (lodging via myTax)</td></tr>
                      <tr><td className="px-5 py-3 font-medium">31 March 2027</td><td className="px-5 py-3">Extended deadline for most tax agent-lodged returns</td></tr>
                      <tr><td className="px-5 py-3 font-medium">15 May 2027</td><td className="px-5 py-3">Final extended deadline for complex tax agent-lodged returns</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Late lodgment attracts a &quot;Failure to Lodge&quot; (FTL) penalty of <strong>$313 per 28-day period</strong> up to a maximum of 5 periods ($1,565). The ATO waives penalties for first-time late lodgers who contact them proactively. Check our <Link href="/tax-calendar/">Tax Calendar</Link> for a complete schedule of Australian tax dates.
              </p>
            </section>

            {/* ───── SECTION 6: How Long Does a Tax Refund Take? ───── */}
            <section id="processing-time">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Long Does a Tax Refund Take?</h2>
              <p>
                Electronic tax returns lodged through myTax are processed within <strong>14 business days</strong>. Paper returns take <strong>10–12 weeks</strong>. The ATO deposits refunds directly into the bank account linked to your tax file number (TFN).
              </p>
              <p>
                Processing times increase during peak lodgment season in July and August. Returns flagged for review — due to unusual deductions, data mismatches, or random audits — take <strong>30–60 business days</strong> or longer. The ATO contacts you via myGov messages if additional information is required.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Processing Time by Lodgment Method</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Lodgment Method</th><th className="px-5 py-3">Typical Processing Time</th><th className="px-5 py-3">Refund Delivery</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">myTax (online)</td><td className="px-5 py-3"><strong>2–14 business days</strong></td><td className="px-5 py-3">Direct deposit</td></tr>
                      <tr><td className="px-5 py-3">Tax agent (electronic)</td><td className="px-5 py-3"><strong>14–21 business days</strong></td><td className="px-5 py-3">Direct deposit</td></tr>
                      <tr><td className="px-5 py-3">Paper return</td><td className="px-5 py-3"><strong>50–60 business days</strong></td><td className="px-5 py-3">Direct deposit or cheque</td></tr>
                      <tr><td className="px-5 py-3">Return under review</td><td className="px-5 py-3"><strong>30–60+ business days</strong></td><td className="px-5 py-3">Held until review complete</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Track your refund status by logging into myGov and checking the &quot;Tax&quot; section. The progress tracker shows four stages: received, processing, finalised, and paid. Outstanding debts to Centrelink, child support, or prior ATO balances are automatically offset against your refund before payment.
              </p>
            </section>

            {/* ───── SECTION 7: Tax Refund vs Tax Debt ───── */}
            <section id="refund-vs-debt">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Difference Between a Tax Refund and a Tax Debt?</h2>
              <p>
                A tax refund occurs when your employer withheld <strong>more tax than your assessed liability</strong>; a tax debt occurs when the total tax withheld is <strong>less than your assessed liability</strong>. The ATO&apos;s Notice of Assessment confirms which outcome applies.
              </p>
              <p>
                Tax debts arise from three primary causes: holding multiple jobs where each employer applies the tax-free threshold separately, earning untaxed investment income such as rental profits or capital gains, and incorrectly completing your TFN declaration (claiming the tax-free threshold at more than one employer). An employee earning <strong>$60,000</strong> from a primary job and <strong>$20,000</strong> from a second job where the tax-free threshold was incorrectly claimed at both employers accumulates a debt of approximately <strong>$2,912</strong> in under-withheld tax.
              </p>
              <p>
                The ATO charges interest on overdue tax debts at the &quot;General Interest Charge&quot; (GIC) rate, currently <strong>11.36% per annum</strong> (updated quarterly). Payment plans are available for debts you cannot pay in full. The ATO sets minimum instalment amounts based on the debt size — a $3,000 debt typically requires monthly payments of <strong>$250–$500</strong> over 6–12 months.
              </p>
              <p>
                Avoid unexpected debts by reviewing your PAYG withholding throughout the year. Use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to verify your employer is withholding the correct amount based on your current salary and tax circumstances.
              </p>
            </section>

            {/* ───── SECTION 8: Common Tax Refund Mistakes ───── */}
            <section id="common-mistakes">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Most Common Tax Refund Mistakes?</h2>
              <p>
                The most common tax return error is <strong>claiming deductions without adequate records</strong>, resulting in ATO adjustments, penalties, and reduced refunds. The ATO reviews approximately 2 million tax returns annually and adjusts around 350,000 claims.
              </p>
              <ul>
                <li><strong>Claiming personal expenses as work-related.</strong> Home-to-work commuting, conventional clothing, and personal phone usage are not deductible. The ATO disallows these claims in over 150,000 returns each year.</li>
                <li><strong>Forgetting to declare all income sources.</strong> Bank interest, dividends, Centrelink payments, foreign income, and gig economy earnings are all assessable. The ATO data-matches income from banks, share registries, government agencies, and ride-share platforms.</li>
                <li><strong>Double-claiming the tax-free threshold.</strong> Employees with 2 or more jobs sometimes claim the $18,200 tax-free threshold at each employer. This results in under-withholding and a tax debt at lodgment.</li>
                <li><strong>Lodging before pre-fill data is ready.</strong> Submitting your return before employers finalise income statements (typically by 14 July) increases the risk of reporting incorrect income figures. Amending a return after lodgment delays processing by 6–8 weeks.</li>
                <li><strong>Overlooking eligible offsets and rebates.</strong> The &quot;Low Income Tax Offset&quot;, the &quot;Seniors and Pensioners Tax Offset&quot; (SAPTO), and the &quot;Zone Tax Offset&quot; are automatically applied in myTax but require accurate personal details. Incorrect information causes the ATO to omit applicable offsets. Review the <Link href="/low-income-tax-offset/">Low Income Tax Offset Guide</Link> to confirm your eligibility.</li>
              </ul>
            </section>

            {/* ───── CONTEXT BORDER ───── */}

            {/* ───── SECTION 9: What Changed in FY2025-26? ───── */}
            <section id="changes-fy2025-26">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed for Tax Refunds in FY2025-26?</h2>
              <p>
                The FY2025-26 financial year retains the Stage 3 tax cuts introduced on 1 July 2024, keeping the <strong>30% marginal rate</strong> for incomes between $45,001 and $135,000. No new changes to individual income tax brackets apply for the 2025-26 year.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Item</th><th className="px-5 py-3">FY2024-25</th><th className="px-5 py-3">FY2025-26</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Tax-free threshold</td><td className="px-5 py-3">$18,200</td><td className="px-5 py-3">$18,200 (unchanged)</td></tr>
                      <tr><td className="px-5 py-3">16% bracket</td><td className="px-5 py-3">$18,201 – $45,000</td><td className="px-5 py-3">$18,201 – $45,000 (unchanged)</td></tr>
                      <tr><td className="px-5 py-3">30% bracket</td><td className="px-5 py-3">$45,001 – $135,000</td><td className="px-5 py-3">$45,001 – $135,000 (unchanged)</td></tr>
                      <tr><td className="px-5 py-3">37% bracket</td><td className="px-5 py-3">$135,001 – $190,000</td><td className="px-5 py-3">$135,001 – $190,000 (unchanged)</td></tr>
                      <tr><td className="px-5 py-3">45% bracket</td><td className="px-5 py-3">$190,001+</td><td className="px-5 py-3">$190,001+ (unchanged)</td></tr>
                      <tr><td className="px-5 py-3">Superannuation Guarantee (SG) rate</td><td className="px-5 py-3">11.5%</td><td className="px-5 py-3"><strong>12%</strong></td></tr>
                      <tr><td className="px-5 py-3">Concessional super contributions cap</td><td className="px-5 py-3">$30,000</td><td className="px-5 py-3">$30,000 (unchanged)</td></tr>
                      <tr><td className="px-5 py-3">Medicare levy</td><td className="px-5 py-3">2%</td><td className="px-5 py-3">2% (unchanged)</td></tr>
                      <tr><td className="px-5 py-3">Work from home fixed rate</td><td className="px-5 py-3">67c per hour</td><td className="px-5 py-3">67c per hour (unchanged)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The superannuation guarantee rate increased from <strong>11.5% to 12%</strong> on 1 July 2025. This affects employees who salary sacrifice into super — a higher compulsory SG contribution reduces the remaining cap space for voluntary concessional contributions. See our <Link href="/superannuation-guide/">Superannuation Guide</Link> for the full breakdown of SG rates, caps, and employer obligations.
              </p>
              <p>
                The ATO continues to invest in data-matching technology. Cryptocurrency exchanges, ride-share platforms, short-term rental platforms (Airbnb, Stayz), and the sharing economy reporting regime provide the ATO with third-party transaction data. Unreported income from these sources is increasingly detected during return processing.
              </p>
            </section>

            {/* ───── SECTION 10: Related Resources ───── */}
            <section id="related-resources">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Resources</h2>
              <p>
                The Australian tax system connects income tax, superannuation, Medicare, and PAYG withholding into a single framework assessed through your annual tax return. The following tools and guides cover each component in detail.
              </p>
              <ul>
                <li><Link href="/tax-return-calculator/">Tax Return Estimator</Link> — calculate your expected refund or tax debt based on income, deductions, and PAYG withheld.</li>
                <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> — compute income tax, Medicare levy, and take-home pay at any salary level for FY2025-26.</li>
                <li><Link href="/tax-brackets/">Tax Brackets Guide</Link> — view all Australian income tax brackets with marginal rates, base amounts, and worked examples.</li>
                <li><Link href="/salary-sacrifice-guide/">Salary Sacrifice Guide</Link> — learn how salary packaging into superannuation or novated leases reduces taxable income and increases your refund.</li>
                <li><Link href="/hecs-help-guide/">HECS-HELP Guide</Link> — understand how HECS-HELP repayments are calculated and how they affect your tax return and take-home pay.</li>
                <li><Link href="/superannuation-guide/">Superannuation Guide</Link> — review employer SG rate obligations, contribution caps, and the impact of super on your overall tax position.</li>
                <li><Link href="/low-income-tax-offset/">Low Income Tax Offset Guide</Link> — check whether LITO applies to your income and how it reduces your assessed tax liability.</li>
                <li><Link href="/medicare-levy/">Medicare Levy Guide</Link> — learn about the 2% Medicare levy, the surcharge thresholds, and exemptions for low-income earners.</li>
              </ul>
            </section>

            {/* ───── SECTION 11: FAQs ───── */}
            <section id="faqs">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">

                <AccordionItem value="what-is-refund" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is a tax refund?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">A tax refund is the amount the ATO returns to you when your employer withheld more PAYG tax during the year than your actual assessed tax liability. The refund represents over-withheld income, not a government payment.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="average" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the average tax refund in Australia?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">The average Australian tax refund is approximately <strong>$2,900</strong>. Refunds range from $0 for taxpayers with accurate withholding to $10,000+ for high-income earners with significant deductions, investment losses, or part-year employment.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="no-lodge" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What happens if I don&apos;t lodge a tax return?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Individuals who earn above the <strong>$18,200</strong> tax-free threshold are legally required to lodge. Failure to lodge attracts a penalty of <strong>$313 per 28-day period</strong> (up to $1,565). Even if you earned less than $18,200, lodging is beneficial when tax was withheld — you receive a full refund of all PAYG tax paid.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="owe" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What if I owe the ATO money?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">The ATO issues a Notice of Assessment showing the amount owed. Common causes include holding multiple jobs, earning investment income, or incorrectly claiming the tax-free threshold at more than one employer. Payment plans are available — the ATO charges interest at the General Interest Charge rate of <strong>11.36% per annum</strong> on overdue amounts.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="how-long" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How long does a tax refund take to arrive?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Electronic returns lodged through myTax are processed within <strong>14 business days</strong>. Many simple returns are processed within 2–5 business days. Paper returns take 50–60 business days. Returns selected for review take 30–60+ business days.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="deductions-no-receipts" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I claim deductions without receipts?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">The ATO requires records for all deduction claims. For work-related expenses under <strong>$300 in total</strong>, you are not required to provide written evidence, but you must be able to show how you calculated the amount. Laundry of eligible work clothing allows claims up to <strong>$150</strong> without written records. All claims above these thresholds require receipts, invoices, or bank/credit card statements.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="wfh" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How do I claim working from home expenses?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">The ATO&apos;s fixed rate method allows a deduction of <strong>67 cents per hour</strong> worked from home. This rate covers electricity, phone, internet, stationery, and computer consumables. You must keep a record of hours worked from home — either a timesheet, roster, diary, or similar document for the entire income year. An employee working from home 3 days per week (approximately 1,100 hours per year) claims approximately <strong>$737</strong>.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="multiple-jobs" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do I owe tax if I have two jobs?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Holding 2 or more jobs does not automatically create a tax debt, but it increases the risk. Claim the tax-free threshold at only <strong>one employer</strong> (usually the highest-paying job). Your second employer should withhold tax at the &quot;no tax-free threshold&quot; rate. If both employers apply the tax-free threshold, you accumulate under-withheld tax that results in a debt at lodgment.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="amendment" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I amend a tax return after lodging?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Yes. You can amend a tax return within <strong>2 years</strong> of the original assessment date for individuals (4 years for more complex affairs). Amendments are lodged through myTax or your tax agent. The ATO reprocesses your return and issues an amended assessment. If the amendment increases your refund, the additional amount is paid within 14 business days.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="hecs-impact" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does HECS-HELP affect my tax refund?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">HECS-HELP compulsory repayments reduce your tax refund. Repayments are calculated on your &quot;HELP Repayment Income&quot; (HRI) — essentially your taxable income plus certain other amounts. The minimum repayment threshold is <strong>$54,435</strong> for FY2025-26. Repayments start at <strong>1%</strong> of HRI and increase in increments up to <strong>10%</strong> at higher income levels. Your employer may already withhold HELP repayments from each pay, in which case the impact on your refund is already accounted for.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="private-health" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does private health insurance affect my tax refund?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Private hospital cover affects your tax in two ways. First, holding a compliant policy exempts you from the &quot;Medicare Levy Surcharge&quot; (MLS) of <strong>1%–1.5%</strong> on incomes above $93,000 (singles) or $186,000 (families). Second, the private health insurance rebate reduces your premium cost. You can receive the rebate as a reduction in premiums during the year or as a refundable tax offset at lodgment. The rebate is income-tested — it phases out for higher earners and reduces to 0% at incomes above $151,000 (singles under 65).</AccordionContent>
                </AccordionItem>

                <AccordionItem value="super-refund" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I get a tax deduction for superannuation contributions?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Employees can claim a tax deduction for <strong>personal super contributions</strong> made from after-tax income by submitting a &quot;Notice of Intent to Claim&quot; to their super fund before lodging. The total of employer SG contributions (12% in FY2025-26), salary sacrifice, and personal deductible contributions cannot exceed the <strong>$30,000</strong> concessional contributions cap. Contributions above this cap are taxed at your marginal rate instead of the concessional 15% rate.</AccordionContent>
                </AccordionItem>

              </Accordion>
            </section>

            <div className="mt-12 not-prose"><MethodologyDisclosure title="How this guide works"><p>Tax return information is sourced from the Australian Taxation Office (ATO). Deduction ranges are approximate and based on typical claims. Tax calculations use FY2025-26 resident tax brackets. Your individual circumstances, including applicable tax offsets, HECS-HELP obligations, and Medicare levy surcharge status, affect your actual refund amount. Use our Australian tax calculator tools for personalised estimates.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("tax-refund-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
          </article>
          <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6">
            <Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related Tools</h3><div className="space-y-3"><SidebarLink href="/tax-return-calculator/" label="Tax Return Estimator" /><SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" /><SidebarLink href="/tax-brackets/" label="Tax Brackets Guide" /><SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" /><SidebarLink href="/superannuation-calculator/" label="Superannuation Calculator" /></div></CardContent></Card>
            <Card className="bg-sky-600 border-none text-white shadow-md"><CardContent className="p-6"><h3 className="text-lg font-bold mb-2">Estimate your refund</h3><p className="text-sky-100 text-sm mb-4">Enter your income, tax withheld, and deductions to see if you&apos;re getting money back.</p><Link href="/tax-return-calculator/" className="block w-full py-2.5 px-4 bg-white text-sky-700 font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">Tax Return Estimator →</Link></CardContent></Card>
          </div></aside>
        </div>
      </div>
    </div>
  );
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }
