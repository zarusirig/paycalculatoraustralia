"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
const SOURCES_LIST: SourceLink[] = [{ title: "Key dates for individuals", url: "https://www.ato.gov.au/businesses-and-organisations/preparing-lodging-and-paying/reports-and-returns/due-dates-for-lodging-and-paying", publisher: SOURCES.ato.name }];

export default function TaxCalendarPage() {
  return (
    <div className="min-h-screen flex-grow bg-white"><div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Tax Calendar</span></li></ol></nav>
      <header className="mb-10 max-w-4xl"><h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Australian Tax Calendar 2025-26</h1><p className="text-xl text-warmgray leading-relaxed mb-6">Every key tax date you need to know: lodgment deadlines for individuals, quarterly BAS for businesses, super guarantee deadlines, and more. The Australian tax calendar for FY2025-26 runs from 1 July 2025 to 30 June 2026, with critical deadlines for income tax returns, PAYG instalments, superannuation guarantee payments, and business activity statements spread across all 12 months.</p><TrustBar className="!max-w-none" /></header>
      <div className="flex flex-col lg:flex-row gap-12">
        <article className="lg:w-2/3 prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

          {/* ===== SECTION 1: Key Tax Dates ===== */}
          <section><h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Key Tax Dates for FY2025-26?</h2>
            <p>The FY2025-26 Australian tax calendar contains <strong>over 20 critical deadlines</strong> spanning individual returns, business activity statements, PAYG instalments, and superannuation guarantee payments. The financial year starts on <strong>1 July 2025</strong> and ends on <strong>30 June 2026</strong>, with the single most important date for individuals being <strong>31 October 2025</strong> — the deadline for self-lodged tax returns for the prior year (FY2024-25).</p>
            <p>Employers face quarterly obligations for BAS lodgment, STP finalisation, and super guarantee contributions. Missing any of these dates triggers automatic penalties from the ATO, interest charges on unpaid amounts, and potential loss of tax deductibility for late super payments. Use our <Link href="/tax-return-calculator/">Tax Return Calculator</Link> to estimate your refund or liability before the lodgment deadline.</p>
            <div className="not-prose my-6 space-y-4">
              <DateCard date="1 Jul 2025" title="New FY begins" desc="FY2025-26 starts. New tax brackets and SG rate (12%) take effect." colour="green" />
              <DateCard date="14 Jul 2025" title="Income statements finalised" desc="Most employers finalise income statements in myGov by mid-July." colour="blue" />
              <DateCard date="31 Oct 2025" title="Tax return deadline" desc="Deadline for self-prepared individual tax returns for FY2024-25." colour="red" />
              <DateCard date="15 May 2026" title="Tax agent deadline" desc="Extended deadline for returns lodged through a registered tax agent." colour="amber" />
              <DateCard date="30 Jun 2026" title="End of FY" desc="Last day to make deductible purchases, super contributions, and charitable donations for FY2025-26." colour="red" />
            </div>
          </section>

          {/* ===== SECTION 2: Month-by-Month Tax Calendar Table ===== */}
          <section><h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Does the Full Tax Calendar Look Like Month by Month?</h2>
            <p>The Australian tax calendar spreads <strong>24 key deadlines</strong> across the 12-month financial year, with the busiest months being July, October, January, and April due to overlapping quarterly obligations.</p>
            <p>Each month carries at least one obligation for employers operating a business with employees. Individual taxpayers face fewer deadlines but carry heavier penalties for missed lodgments. The table below consolidates every major ATO deadline into a single month-by-month reference for the 2025-26 financial year.</p>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Month</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Deadline</th><th className="px-5 py-3">Who</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr><td className="px-5 py-3 font-medium">July 2025</td><td className="px-5 py-3">1 Jul</td><td className="px-5 py-3">FY2025-26 begins; new tax rates, SG 12% apply</td><td className="px-5 py-3">All</td></tr>
              <tr><td className="px-5 py-3 font-medium">July 2025</td><td className="px-5 py-3">14 Jul</td><td className="px-5 py-3">STP finalisation due (income statements)</td><td className="px-5 py-3">Employers</td></tr>
              <tr><td className="px-5 py-3 font-medium">July 2025</td><td className="px-5 py-3">21 Jul</td><td className="px-5 py-3">Monthly BAS due (June)</td><td className="px-5 py-3">Monthly lodgers</td></tr>
              <tr><td className="px-5 py-3 font-medium">July 2025</td><td className="px-5 py-3">28 Jul</td><td className="px-5 py-3">Q4 BAS &amp; SG due (Apr–Jun)</td><td className="px-5 py-3">Employers</td></tr>
              <tr><td className="px-5 py-3 font-medium">August 2025</td><td className="px-5 py-3">21 Aug</td><td className="px-5 py-3">Monthly BAS due (July)</td><td className="px-5 py-3">Monthly lodgers</td></tr>
              <tr><td className="px-5 py-3 font-medium">September 2025</td><td className="px-5 py-3">21 Sep</td><td className="px-5 py-3">Monthly BAS due (August)</td><td className="px-5 py-3">Monthly lodgers</td></tr>
              <tr><td className="px-5 py-3 font-medium">October 2025</td><td className="px-5 py-3">21 Oct</td><td className="px-5 py-3">Monthly BAS due (September); PAYG instalment Q1</td><td className="px-5 py-3">Monthly lodgers / PAYG</td></tr>
              <tr><td className="px-5 py-3 font-medium">October 2025</td><td className="px-5 py-3">28 Oct</td><td className="px-5 py-3">Q1 BAS &amp; SG due (Jul–Sep)</td><td className="px-5 py-3">Employers</td></tr>
              <tr className="bg-ochre/5"><td className="px-5 py-3 font-medium">October 2025</td><td className="px-5 py-3 font-bold">31 Oct</td><td className="px-5 py-3 font-bold">Self-lodged individual tax return deadline (FY2024-25)</td><td className="px-5 py-3">Individuals</td></tr>
              <tr><td className="px-5 py-3 font-medium">November 2025</td><td className="px-5 py-3">21 Nov</td><td className="px-5 py-3">Monthly BAS due (October)</td><td className="px-5 py-3">Monthly lodgers</td></tr>
              <tr><td className="px-5 py-3 font-medium">December 2025</td><td className="px-5 py-3">1 Dec</td><td className="px-5 py-3">Tax return deadline for prior-year late lodgers (penalty applies)</td><td className="px-5 py-3">Individuals</td></tr>
              <tr><td className="px-5 py-3 font-medium">January 2026</td><td className="px-5 py-3">28 Jan</td><td className="px-5 py-3">Q2 SG due (Oct–Dec)</td><td className="px-5 py-3">Employers</td></tr>
              <tr><td className="px-5 py-3 font-medium">February 2026</td><td className="px-5 py-3">28 Feb</td><td className="px-5 py-3">Q2 BAS due (Oct–Dec); PAYG instalment Q2</td><td className="px-5 py-3">Employers / PAYG</td></tr>
              <tr><td className="px-5 py-3 font-medium">March 2026</td><td className="px-5 py-3">31 Mar</td><td className="px-5 py-3">Tax agent-managed returns: March lodgment group due</td><td className="px-5 py-3">Tax agents</td></tr>
              <tr><td className="px-5 py-3 font-medium">April 2026</td><td className="px-5 py-3">28 Apr</td><td className="px-5 py-3">Q3 BAS &amp; SG due (Jan–Mar); PAYG instalment Q3</td><td className="px-5 py-3">Employers / PAYG</td></tr>
              <tr><td className="px-5 py-3 font-medium">May 2026</td><td className="px-5 py-3">15 May</td><td className="px-5 py-3">Tax agent-managed returns: final deadline (FY2024-25)</td><td className="px-5 py-3">Tax agents</td></tr>
              <tr><td className="px-5 py-3 font-medium">June 2026</td><td className="px-5 py-3">21 Jun</td><td className="px-5 py-3">Monthly BAS due (May)</td><td className="px-5 py-3">Monthly lodgers</td></tr>
              <tr className="bg-ochre/5"><td className="px-5 py-3 font-medium">June 2026</td><td className="px-5 py-3 font-bold">30 Jun</td><td className="px-5 py-3 font-bold">FY2025-26 ends — last day for deductions, super top-ups, donations</td><td className="px-5 py-3">All</td></tr>
            </tbody></table></div></div>
          </section>

          {/* ===== SECTION 3: Individual Tax Return Deadlines ===== */}
          <section><h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Individual Tax Return Deadlines?</h2>
            <p>Self-lodged individual tax returns for FY2024-25 are due by <strong>31 October 2025</strong>. Returns lodged through a registered tax agent receive an automatic extension to <strong>15 May 2026</strong>, provided the taxpayer is registered with that agent before 31 October.</p>
            <p>Approximately <strong>14.3 million</strong> individual tax returns are lodged in Australia each financial year. The ATO processes most electronically lodged returns within <strong>2 weeks</strong>, while paper returns take up to <strong>10 weeks</strong>. Taxpayers who owe a debt from their prior-year return must pay by the original due date (31 October) regardless of whether a tax agent lodges later.</p>
            <p>Key individual deadlines include:</p>
            <ul>
              <li><strong>1 July 2025</strong> — earliest date to lodge your FY2024-25 return via myTax</li>
              <li><strong>14 July 2025</strong> — most employers finalise income statements (previously called payment summaries) in myGov</li>
              <li><strong>31 October 2025</strong> — deadline for self-prepared returns</li>
              <li><strong>15 May 2026</strong> — deadline for tax-agent-prepared returns</li>
              <li><strong>5 June 2026</strong> — final date to amend a FY2022-23 return (2-year amendment period expires)</li>
            </ul>
            <p>Income tax brackets for FY2025-26 apply new thresholds with the Stage 3 tax cuts already in effect. Check the current rates on our <Link href="/tax-brackets/">Income Tax Brackets</Link> page, or use the <Link href="/tax-return-calculator/">Tax Return Calculator</Link> to estimate your refund.</p>
          </section>

          {/* ===== SECTION 4: Employer/Business Tax Deadlines ===== */}
          <section><h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Employer and Business Tax Deadlines?</h2>
            <p>Employers and businesses face <strong>quarterly BAS lodgments, STP finalisation by 14 July, and super guarantee payments within 28 days of each quarter end</strong>. Businesses with GST turnover above $20 million lodge BAS monthly rather than quarterly.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Business Activity Statement (BAS) Deadlines</h3>
            <p>Quarterly BAS covers GST, PAYG withholding, and PAYG instalments. The ATO pre-fills BAS data from STP reports, reducing manual entry for employers who report payroll through compliant software.</p>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Quarter</th><th className="px-5 py-3">Period</th><th className="px-5 py-3 text-right">Due Date</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr><td className="px-5 py-3">Q1</td><td className="px-5 py-3">Jul – Sep</td><td className="px-5 py-3 text-right font-medium">28 Oct</td></tr>
              <tr><td className="px-5 py-3">Q2</td><td className="px-5 py-3">Oct – Dec</td><td className="px-5 py-3 text-right font-medium">28 Feb</td></tr>
              <tr><td className="px-5 py-3">Q3</td><td className="px-5 py-3">Jan – Mar</td><td className="px-5 py-3 text-right font-medium">28 Apr</td></tr>
              <tr><td className="px-5 py-3">Q4</td><td className="px-5 py-3">Apr – Jun</td><td className="px-5 py-3 text-right font-medium">28 Jul</td></tr>
            </tbody></table></div></div>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Single Touch Payroll (STP) Finalisation</h3>
            <p>STP finalisation declarations are due by <strong>14 July</strong> each year. Employers with 20 or more employees have reported via STP Phase 2 since 1 January 2022. Closely held payees (directors, family members) receive a quarterly STP reporting concession, with finalisation also due 14 July. Late STP finalisation prevents employees from accessing their income statement in myGov, delaying their tax return lodgment.</p>
            <p>Businesses calculating employer costs — including super, payroll tax, and workers compensation — benefit from our <Link href="/employer-cost-calculator/">Employer Cost Calculator</Link> to estimate total employment expenses.</p>
          </section>

          {/* ===== SECTION 5: Late Lodgment Penalties ===== */}
          <section><h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Happens If You Lodge Late?</h2>
            <p>The ATO charges a "Failure to Lodge" (FTL) penalty of <strong>one penalty unit ($330 for FY2025-26) for each 28-day period</strong> the return remains outstanding, up to a maximum of 5 penalty units ($1,650) for individuals.</p>
            <p>Penalty unit values are indexed annually. The current penalty unit is <strong>$330</strong> (effective 1 July 2025). Companies and large entities face penalties calculated at higher multiples. The ATO issues a formal notice before applying penalties, giving taxpayers 21 days to lodge or respond.</p>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Delay Period</th><th className="px-5 py-3">Penalty Units</th><th className="px-5 py-3 text-right">Individual Penalty</th><th className="px-5 py-3 text-right">Company Penalty (medium)</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr><td className="px-5 py-3">1 – 28 days</td><td className="px-5 py-3">1</td><td className="px-5 py-3 text-right font-medium">$330</td><td className="px-5 py-3 text-right font-medium">$1,650</td></tr>
              <tr><td className="px-5 py-3">29 – 56 days</td><td className="px-5 py-3">2</td><td className="px-5 py-3 text-right font-medium">$660</td><td className="px-5 py-3 text-right font-medium">$3,300</td></tr>
              <tr><td className="px-5 py-3">57 – 84 days</td><td className="px-5 py-3">3</td><td className="px-5 py-3 text-right font-medium">$990</td><td className="px-5 py-3 text-right font-medium">$4,950</td></tr>
              <tr><td className="px-5 py-3">85 – 112 days</td><td className="px-5 py-3">4</td><td className="px-5 py-3 text-right font-medium">$1,320</td><td className="px-5 py-3 text-right font-medium">$6,600</td></tr>
              <tr><td className="px-5 py-3">113+ days</td><td className="px-5 py-3">5 (max)</td><td className="px-5 py-3 text-right font-medium">$1,650</td><td className="px-5 py-3 text-right font-medium">$8,250</td></tr>
            </tbody></table></div></div>
            <p>Late BAS lodgment carries the same FTL penalty structure. Late super guarantee payments attract the "Super Guarantee Charge" (SGC), which includes the original super amount, an interest charge of <strong>10% per annum</strong>, and an administration fee of <strong>$20 per employee per quarter</strong>. The SGC is not tax-deductible, unlike on-time SG payments. Learn more about superannuation obligations in our <Link href="/superannuation-guide/">Superannuation Guide</Link>.</p>
          </section>

          {/* ===== SECTION 6: How to Lodge ===== */}
          <section><h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Do You Lodge Your Tax Return?</h2>
            <p>Individual tax returns are lodged online through <strong>myTax (via myGov)</strong>, through a registered tax agent, or by paper form — with myTax being the fastest method, processing returns in approximately <strong>2 weeks</strong>.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Step-by-Step: Lodging via myTax</h3>
            <ol>
              <li><strong>Create or log in to your myGov account</strong> at my.gov.au and link the ATO service. You need a Tax File Number (TFN), your bank account details, and identity documents to link for the first time.</li>
              <li><strong>Wait for your income statement</strong> to appear as &quot;Tax ready&quot; — most employers finalise these by 14 July. Pre-fill data includes salary, interest income, dividends, private health insurance, and government payments.</li>
              <li><strong>Review pre-filled information</strong> — check that salary, employer super contributions, bank interest, and dividend income match your records. Add any missing income from investments, rental properties, or freelance work.</li>
              <li><strong>Claim deductions</strong> — enter work-related expenses (uniforms, tools, home office, travel), self-education expenses, charitable donations, and income protection insurance premiums. The ATO&apos;s $300 instant write-off for work-related expenses (no receipts required) has been replaced with full substantiation requirements.</li>
              <li><strong>Enter tax offsets</strong> — the <Link href="/low-income-tax-offset/">Low Income Tax Offset</Link> (LITO) is applied automatically. Other offsets like the &quot;Zone Tax Offset&quot; or spouse offset require manual entry.</li>
              <li><strong>Review your estimated refund or tax payable</strong> — myTax calculates your position based on PAYG withholding already deducted by your employer throughout the year. Use our <Link href="/tax-return-calculator/">Tax Return Calculator</Link> to cross-check.</li>
              <li><strong>Submit your return</strong> — once lodged electronically, most refunds arrive within <strong>2 weeks</strong>. Debts must be paid by the original due date to avoid interest (the General Interest Charge rate is <strong>11.36% per annum</strong> for Q1 FY2025-26).</li>
            </ol>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Using a Registered Tax Agent</h3>
            <p>Registered tax agents charge between <strong>$100 and $400</strong> for a standard individual return, depending on complexity. Agent-lodged returns receive an extended deadline of <strong>15 May 2026</strong> for FY2024-25 returns, provided the taxpayer registers with the agent before 31 October 2025. The agent fee is tax-deductible in the following financial year.</p>
          </section>

          {/* ===== SECTION 7: PAYG Instalments ===== */}
          <section><h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Key Dates for PAYG Instalments?</h2>
            <p>PAYG instalment due dates align with BAS quarters, falling on <strong>28 October, 28 February, 28 April, and 28 July</strong> for quarterly payers. Annual PAYG instalment payers lodge by <strong>21 October</strong>.</p>
            <p>The ATO issues PAYG instalment notices to individuals and businesses earning investment income, business income, or other non-salary income exceeding the threshold. The ATO calculates the instalment amount based on your most recent tax return and applies a GDP-adjusted instalment rate (currently around <strong>6%-8%</strong> depending on income level).</p>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Instalment</th><th className="px-5 py-3">Period Covered</th><th className="px-5 py-3 text-right">Due Date</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr><td className="px-5 py-3">Q1</td><td className="px-5 py-3">Jul – Sep 2025</td><td className="px-5 py-3 text-right font-medium">28 Oct 2025</td></tr>
              <tr><td className="px-5 py-3">Q2</td><td className="px-5 py-3">Oct – Dec 2025</td><td className="px-5 py-3 text-right font-medium">28 Feb 2026</td></tr>
              <tr><td className="px-5 py-3">Q3</td><td className="px-5 py-3">Jan – Mar 2026</td><td className="px-5 py-3 text-right font-medium">28 Apr 2026</td></tr>
              <tr><td className="px-5 py-3">Q4</td><td className="px-5 py-3">Apr – Jun 2026</td><td className="px-5 py-3 text-right font-medium">28 Jul 2026</td></tr>
              <tr className="bg-sandstone/50"><td className="px-5 py-3 font-medium">Annual</td><td className="px-5 py-3">Full FY2024-25</td><td className="px-5 py-3 text-right font-medium">21 Oct 2025</td></tr>
            </tbody></table></div></div>
            <p>Taxpayers who vary their PAYG instalment amount must lodge a variation on their BAS before the relevant due date. Underpaying by more than <strong>15%</strong> of the actual liability triggers a shortfall interest charge. The ATO publishes the PAYG instalment rate each February. For details on how PAYG withholding applies to employee wages, see the <Link href="/payg-withholding-tables/">PAYG Withholding Tables</Link> page.</p>
          </section>

          {/* ===== SECTION 8: Super Guarantee Due Dates ===== */}
          <section><h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>When Are Super Guarantee Payments Due?</h2>
            <p>Employers must pay the <strong>12% SG</strong> within 28 days of the end of each quarter. If the due date falls on a weekend or public holiday, payment must be received by the ATO by the next business day.</p>
            <p>The superannuation guarantee rate is <strong>12% of ordinary time earnings</strong> for FY2025-26. The rate is legislated to remain at 12% from 1 July 2025 onward. Employers pay SG on employees earning <strong>$450 or more per month</strong> (this threshold was effectively removed from 1 July 2022, meaning SG applies from the first dollar). The maximum super contribution base is <strong>$65,070 per quarter</strong> for FY2025-26, capping the SG obligation at <strong>$7,808.40 per quarter</strong> per employee.</p>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Quarter</th><th className="px-5 py-3">Period</th><th className="px-5 py-3">SG Due Date</th><th className="px-5 py-3 text-right">SGC Lodgment (if late)</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr><td className="px-5 py-3">Q1</td><td className="px-5 py-3">1 Jul – 30 Sep</td><td className="px-5 py-3 font-medium">28 Oct 2025</td><td className="px-5 py-3 text-right">28 Nov 2025</td></tr>
              <tr><td className="px-5 py-3">Q2</td><td className="px-5 py-3">1 Oct – 31 Dec</td><td className="px-5 py-3 font-medium">28 Jan 2026</td><td className="px-5 py-3 text-right">28 Feb 2026</td></tr>
              <tr><td className="px-5 py-3">Q3</td><td className="px-5 py-3">1 Jan – 31 Mar</td><td className="px-5 py-3 font-medium">28 Apr 2026</td><td className="px-5 py-3 text-right">28 May 2026</td></tr>
              <tr><td className="px-5 py-3">Q4</td><td className="px-5 py-3">1 Apr – 30 Jun</td><td className="px-5 py-3 font-medium">28 Jul 2026</td><td className="px-5 py-3 text-right">28 Aug 2026</td></tr>
            </tbody></table></div></div>
            <p>Late SG payments result in the &quot;Super Guarantee Charge&quot; (SGC), which adds a <strong>10% nominal interest component</strong> and a <strong>$20 administration fee per employee per quarter</strong>. The SGC is calculated on salary and wages (not ordinary time earnings), increasing the base amount. Critically, the SGC is <strong>not tax-deductible</strong>. Employers must self-report late payments using the SGC statement form.</p>
          </section>

          {/* ===== SECTION 9: EOFY Checklist ===== */}
          <section><h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Should You Do Before End of Financial Year?</h2>
            <p>The end-of-financial-year deadline of <strong>30 June 2026</strong> is the last day to take actions that reduce your taxable income for FY2025-26, including making concessional super contributions, prepaying deductible expenses, and realising capital losses.</p>
            <ul>
              <li>Review your deductions and receipts — the ATO requires written evidence for all work-related claims</li>
              <li>Make concessional super contributions up to the <strong>$32,500 annual cap</strong> before 30 June (employer SG counts toward this cap)</li>
              <li>Prepay deductible expenses for up to 12 months in advance: insurance premiums, professional subscriptions, income protection</li>
              <li>Check your private health insurance status for &quot;Medicare Levy Surcharge&quot; purposes — singles earning above <strong>$93,000</strong> and families above <strong>$186,000</strong> without hospital cover pay a surcharge of <strong>1% to 1.5%</strong></li>
              <li>Bring forward capital losses by selling underperforming investments before 30 June to offset capital gains</li>
              <li>Make charitable donations — tax-deductible if the recipient has DGR (Deductible Gift Recipient) status</li>
              <li>Consider salary sacrifice arrangements starting from 1 July — see our <Link href="/salary-sacrifice-guide/">Salary Sacrifice Guide</Link> for details</li>
            </ul>
          </section>

          {/* ===== SECTION 10: Changes in FY2025-26 ===== */}
          <section><h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Tax Changes Apply in FY2025-26?</h2>
            <p>FY2025-26 carries forward the Stage 3 tax cuts implemented on 1 July 2024, with <strong>no new income tax rate changes</strong> legislated for this year. The SG rate holds at <strong>12%</strong>, and the Medicare levy remains at <strong>2%</strong> of taxable income.</p>
            <p>Key indexation changes for FY2025-26 include:</p>
            <ul>
              <li><strong>Concessional super contributions cap</strong> — indexed to <strong>$32,500</strong> from 1 July 2026 (up from $30,000)</li>
              <li><strong>Non-concessional contributions cap</strong> — <strong>$130,000</strong> per year</li>
              <li><strong>Maximum super contribution base</strong> — <strong>$65,070</strong> per quarter</li>
              <li><strong>HELP/HECS repayment thresholds</strong> — minimum repayment threshold indexed upward to <strong>$69,528</strong></li>
              <li><strong>Medicare Levy Surcharge thresholds</strong> — <strong>$93,000</strong> for singles, <strong>$186,000</strong> for families</li>
              <li><strong>Penalty unit value</strong> — <strong>$330</strong> per unit</li>
            </ul>
            <p>For a complete breakdown of how your take-home pay is affected by current tax rates, use the Australian <Link href="/">Pay Calculator</Link> on the homepage.</p>
          </section>

          {/* ---- CONTEXT BORDER ---- */}

          {/* ===== SECTION 11: Related Resources ===== */}
          <section><h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Resources</h2>
            <p>Explore these guides and calculators for related Australian tax and payroll topics:</p>
            <ul>
              <li><Link href="/tax-return-calculator/">Tax Return Calculator</Link> — estimate your FY2024-25 refund or tax payable based on your income, deductions, and offsets</li>
              <li><Link href="/tax-brackets/">Income Tax Brackets 2025-26</Link> — full breakdown of marginal tax rates, thresholds, and worked examples at common salary levels</li>
              <li><Link href="/superannuation-guide/">Superannuation Guide</Link> — employer SG obligations, concessional contribution caps, and Division 293 tax explained</li>
              <li><Link href="/tax-refund-guide/">Tax Refund Guide</Link> — how refunds are calculated, processing times, and common reasons for ATO adjustments</li>
              <li><Link href="/hecs-help-guide/">HECS-HELP Repayment Guide</Link> — repayment thresholds, rates, and how HELP debt affects your take-home pay</li>
              <li><Link href="/payg-withholding-tables/">PAYG Withholding Tables</Link> — weekly, fortnightly, and monthly withholding amounts for employers and payroll processing</li>
            </ul>
          </section>

          {/* ===== SECTION 12: FAQs ===== */}
          <section><h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>When does the Australian financial year start and end?</h3>
                <p>The Australian financial year runs from <strong>1 July to 30 June</strong>. FY2025-26 starts on 1 July 2025 and ends on 30 June 2026. All income earned, deductions claimed, and tax obligations incurred within these dates belong to that financial year.</p>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Can I lodge my tax return before 14 July?</h3>
                <p>Yes, you can lodge from <strong>1 July</strong>, but the ATO recommends waiting until your employer finalises your income statement (typically by 14 July). Lodging before your income statement shows as &quot;Tax ready&quot; in myGov increases the risk of errors and ATO amendments.</p>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What is the penalty for not lodging a tax return?</h3>
                <p>The ATO applies a &quot;Failure to Lodge&quot; penalty of <strong>$330 per 28-day period</strong> the return is overdue, up to a maximum of <strong>$1,650</strong> (5 penalty units) for individuals. The ATO sends a formal notice before applying the penalty, giving 21 days to lodge.</p>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Do I get an extension if I use a tax agent?</h3>
                <p>Yes. Returns lodged through a registered tax agent receive an extended deadline of <strong>15 May 2026</strong> for FY2024-25 returns. You must be registered with the agent before 31 October 2025 to qualify. Any tax debt from the prior year is still due by the original 31 October deadline.</p>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>When are quarterly BAS due dates?</h3>
                <p>Quarterly BAS is due on <strong>28 October, 28 February, 28 April, and 28 July</strong>, covering Q1 through Q4 respectively. Monthly BAS lodgers submit by the 21st of the following month. Electronic lodgers of quarterly BAS receive an automatic 2-week extension.</p>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What happens if my employer pays super late?</h3>
                <p>Late super payments trigger the &quot;Super Guarantee Charge&quot; (SGC), which includes the original super amount calculated on total salary and wages (not just ordinary time earnings), a <strong>10% nominal interest charge</strong>, and a <strong>$20 per employee per quarter</strong> administration fee. The SGC is not tax-deductible.</p>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How long does the ATO take to process a tax refund?</h3>
                <p>Electronic returns lodged via myTax are processed within <strong>2 weeks</strong> in most cases. Paper returns take up to <strong>10 weeks</strong>. Returns selected for manual review or audit take <strong>30 days or longer</strong>. The ATO deposits refunds directly to the bank account nominated in the return.</p>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Is the 31 October deadline different if I owe tax?</h3>
                <p>No. The lodgment deadline is <strong>31 October 2025</strong> regardless of whether you expect a refund or owe a tax debt. Taxpayers who owe money must pay by the due date to avoid the &quot;General Interest Charge&quot; (GIC), which accrues daily at approximately <strong>11.36% per annum</strong>.</p>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What is the maximum super contribution base for FY2025-26?</h3>
                <p>The maximum super contribution base is <strong>$65,070 per quarter</strong> for FY2025-26. Employers are not required to pay SG on earnings above this threshold. At the 12% SG rate, the maximum quarterly SG obligation is <strong>$7,808.40</strong> per employee.</p>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Can I amend a previous year&apos;s tax return?</h3>
                <p>Yes. Individuals can amend a tax return within <strong>2 years</strong> of the original assessment date for simple returns, or <strong>4 years</strong> for more complex situations (business income, rental properties, capital gains). Amendments are lodged through myTax or a tax agent. The ATO reassesses the return and issues a revised notice of assessment.</p>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Do PAYG instalments reduce my end-of-year tax bill?</h3>
                <p>Yes. PAYG instalments are <strong>prepayments of your expected tax liability</strong>, credited against your final tax assessment. Taxpayers paying quarterly instalments throughout the year typically receive a smaller refund or owe less at lodgment time because the tax has already been paid progressively.</p>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What is the concessional super contributions cap for FY2025-26?</h3>
                <p>The concessional (before-tax) super contributions cap is <strong>$32,500 per year</strong> for FY2026-27. This cap includes employer SG contributions, salary sacrifice amounts, and personal deductible contributions. Exceeding the cap results in the excess being taxed at your marginal tax rate plus an interest charge.</p>
              </div>
            </div>
          </section>

          <div className="mt-12 not-prose"><MethodologyDisclosure title="How this guide works"><p>Key dates sourced from ATO key dates for individuals and businesses. BAS and SG deadlines per ATO quarterly reporting schedule. Penalty unit values and SGC components sourced from ATO penalty guidelines and Superannuation Guarantee legislation. All figures reflect FY2025-26 rates and thresholds.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("tax-calendar"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
        </article>
        <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6"><Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related</h3><div className="space-y-3"><SidebarLink href="/tax-return-calculator/" label="Tax Return Estimator" /><SidebarLink href="/tax-refund-guide/" label="Tax Refund Guide" /><SidebarLink href="/superannuation-guide/" label="Super Guide" /><SidebarLink href="/tax-brackets/" label="Tax Brackets" /></div></CardContent></Card></div></aside>
      </div>
    </div></div>
  );
}

function DateCard({ date, title, desc, colour }: { date: string; title: string; desc: string; colour: string }) {
  const colourMap: Record<string, string> = { green: "border-l-eucalyptus bg-eucalyptus-light/30", blue: "border-l-eucalyptus-dark bg-eucalyptus-light/40", red: "border-l-ochre bg-ochre/10", amber: "border-l-amber-500 bg-amber-50" };
  return (<div className={`border-l-4 rounded-r-lg p-4 ${colourMap[colour] || colourMap.blue}`}><div className="flex items-center justify-between mb-1"><span className="text-sm font-bold text-navy">{title}</span><span className="text-xs font-medium text-warmgray-light bg-white px-2 py-1 rounded-full border border-sandstone-dark/20">{date}</span></div><p className="text-sm text-warmgray">{desc}</p></div>);
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }
