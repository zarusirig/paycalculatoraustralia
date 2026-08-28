"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, formatAUD } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { buildWithholdingRows, PAYG_TABLES_UPDATED } from "@/lib/constants/payg-withholding";

const SOURCES_LIST: SourceLink[] = [
  { title: "ATO Tax tables", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-tables-overview", publisher: SOURCES.ato.name },
  { title: "Weekly tax table (NAT 1005)", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-table-weekly", publisher: SOURCES.ato.name },
  { title: "Fortnightly tax table (NAT 1006)", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-table-fortnightly", publisher: SOURCES.ato.name },
];

const WEEKLY_HUB_ROWS = buildWithholdingRows("weekly", [350, 500, 1_000, 1_500, 2_000, 3_000]);
const FORTNIGHTLY_HUB_ROWS = buildWithholdingRows("fortnightly", [1_000, 2_000, 3_000, 4_000, 6_000]);
const MONTHLY_HUB_ROWS = buildWithholdingRows("monthly", [4_000, 6_000, 8_000, 10_000, 15_000]);

export default function PAYGTablesGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">PAYG Withholding Tables</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            PAYG Withholding Tax Tables 2026-27
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-3">
            Understand how much tax your employer must legally deduct from your weekly, fortnightly, or monthly pay before it reaches your bank account.
          </p>
          <p className="text-sm font-semibold text-eucalyptus-dark mb-6">Updated: {PAYG_TABLES_UPDATED} — all tables reflect the FY2026-27 rate cut (15% on $18,201&ndash;$45,000)</p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="what-are-payg-withholding-tables">
              <h2>What Are PAYG Withholding Tables?</h2>
              <p>
                PAYG withholding tables are ATO-published lookup schedules that tell employers the <strong>exact dollar amount of income tax to deduct</strong> from each employee payment. The Australian Taxation Office updates these tables at the start of every financial year to reflect changes in income tax brackets, the Medicare levy, and any legislated offsets such as the &quot;Low Income Tax Offset&quot; (LITO) or the &quot;Low and Middle Income Tax Offset&quot; (LMITO, now expired).
              </p>
              <p>
                Every Australian employer, payroll software provider, and business accountant relies on these PAYG withholding tax tables to calculate the correct deduction for wages, salary, commissions, bonuses, and director fees. The tables cover weekly, fortnightly, and monthly pay cycles, and separate schedules exist for residents, non-residents, working holiday makers, and payments subject to study and training loan repayments. For FY2026-27, every table was reissued to incorporate the legislated cost-of-living tax cut that reduced the rate on $18,201&ndash;$45,000 from 16% to <strong>15%</strong> on 1 July 2026.
              </p>
              <p>
                Employees do not need to manually consult the tables themselves. Payroll systems apply the correct withholding automatically based on the employee&apos;s TFN declaration answers. However, understanding how the tables work helps you verify your payslip, estimate your take-home pay before accepting a job offer, and anticipate your annual tax refund or tax debt. Use our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to check your withholding against the ATO tables instantly.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Interactive PAYG Calculator</h3>
                    <p className="text-navy text-sm mb-3">Instead of checking static tables, enter your exact salary to see your PAYG withheld right now.</p>
                    <Link href="/take-home-pay-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Calculate exact PAYG Withholding <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section id="tables-by-pay-cycle">
              <h2>Official Tax Tables by Pay Cycle</h2>
              <p>
                Each pay cycle has its own dedicated ATO table. Open the one that matches how you are paid
                for the full 2026-27 withholding amounts, an instant lookup tool, and the STSL and
                no-threshold columns:
              </p>
              <div className="not-prose my-6 grid sm:grid-cols-2 gap-4">
                <Link href="/weekly-tax-table/" className="group p-5 rounded-xl border border-sandstone-dark/20 bg-white hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                  <span className="block text-base font-bold text-navy group-hover:text-eucalyptus-dark mb-1">Weekly tax table</span>
                  <span className="block text-sm text-warmgray">52 pays a year — NAT 1005</span>
                </Link>
                <Link href="/fortnightly-tax-table/" className="group p-5 rounded-xl border border-sandstone-dark/20 bg-white hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                  <span className="block text-base font-bold text-navy group-hover:text-eucalyptus-dark mb-1">Fortnightly tax table</span>
                  <span className="block text-sm text-warmgray">26 pays a year — NAT 1006</span>
                </Link>
                <Link href="/monthly-tax-table/" className="group p-5 rounded-xl border border-sandstone-dark/20 bg-white hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                  <span className="block text-base font-bold text-navy group-hover:text-eucalyptus-dark mb-1">Monthly tax table</span>
                  <span className="block text-sm text-warmgray">12 pays a year — NAT 1007</span>
                </Link>
                <Link href="/schedule-5-tax-table/" className="group p-5 rounded-xl border border-sandstone-dark/20 bg-white hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                  <span className="block text-base font-bold text-navy group-hover:text-eucalyptus-dark mb-1">Schedule 5 tax table</span>
                  <span className="block text-sm text-warmgray">Bonuses, commissions &amp; back pay — NAT 3348</span>
                </Link>
              </div>
            </section>

            <section id="how-payg-withholding-works">
              <h2>How Does PAYG Withholding Work?</h2>
              <p>
                PAYG withholding works by requiring employers to deduct estimated income tax from every payment and remit it to the ATO <strong>before the employee receives their net pay</strong>. The system ensures that taxation occurs incrementally throughout the year rather than as a single lump-sum bill in July.
              </p>
              <p>
                The withholding process follows a precise sequence from the moment an employee starts a new job through to the end of the financial year:
              </p>
              <ol>
                <li><strong>Employee submits a TFN declaration</strong> &mdash; The employee completes a Tax File Number declaration form (NAT 3092) providing their TFN, residency status, tax-free threshold claim, and study loan status. This form determines which withholding schedule the employer applies.</li>
                <li><strong>Employer identifies the correct schedule</strong> &mdash; Based on the declaration, the employer selects from Schedule 1 (standard), Schedule 2 (no TFN), Schedule 3 (actors/performers), Schedule 4 (return-to-work), or Schedule 15 (working holiday makers).</li>
                <li><strong>Payroll calculates gross earnings</strong> &mdash; The employer totals the employee&apos;s ordinary time earnings, overtime, allowances, bonuses, and commissions for that pay period.</li>
                <li><strong>Withholding amount is looked up or calculated</strong> &mdash; The employer uses the ATO coefficient formula or a direct lookup table to determine the exact PAYG withholding for that gross amount. The formula uses two coefficients (a and b) applied to weekly earnings brackets.</li>
                <li><strong>Net pay is deposited</strong> &mdash; The employer pays the employee the gross amount minus PAYG withholding, minus superannuation (paid separately to a super fund at the SG rate of <strong>12%</strong>), and minus any salary sacrifice or other deductions.</li>
                <li><strong>Employer remits withheld amounts to the ATO</strong> &mdash; Withheld tax is reported and paid to the ATO, either monthly (for businesses withholding over $25,000 per year) or quarterly (for smaller withholders), via the Business Activity Statement (BAS).</li>
                <li><strong>Annual reconciliation via tax return</strong> &mdash; At year-end, the employee lodges a tax return. The ATO compares total PAYG withheld against the actual tax liability. Any overpayment results in a tax refund; any shortfall results in a tax debt.</li>
              </ol>
              <p>
                The withholding tables assume you earn the same gross amount in every pay period for the full 52 weeks (or 26 fortnights, or 12 months). Employees with irregular income, multiple jobs, or mid-year start dates frequently receive a refund because the annualised projection overestimates their total taxable income. Use our <Link href="/tax-return-calculator/">Tax Return Calculator</Link> to estimate whether you are likely to receive a refund or owe additional tax.
              </p>
            </section>

            <section id="weekly-table">
              <h2>Weekly Tax Table Reference</h2>
              <p>
                The following shows approximate weekly PAYG withholding amounts for the 2026-27 year. <em>Assumes Australian resident claiming the tax-free threshold with no HECS debt.</em>
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Weekly Gross Pay</th>
                        <th className="px-6 py-4">Estimated PAYG Withheld</th>
                        <th className="px-6 py-4">Est. Weekly Take-Home</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {WEEKLY_HUB_ROWS.map((row) => (
                        <tr key={row.gross}>
                          <td className="px-6 py-4">{formatAUD(row.gross, 2)}</td>
                          <td className="px-6 py-4">{formatAUD(row.withTFT, 2)}</td>
                          <td className="px-6 py-4">{formatAUD(row.netWithTFT, 2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-sm text-warmgray-light mb-8 items-center">*See the full <Link href="/weekly-tax-table/">weekly tax table</Link> for every earnings band, STSL, and no-threshold columns, or <Link href="/weekly-pay-calculator/">calculate exact weekly pay here</Link>.</p>
            </section>

            <section id="fortnightly-table">
              <h2>Fortnightly Tax Table</h2>
              <p>
                A standard fortnightly pay cycle (26 pays per year) applies the following estimated withholding. <em>Assumes Australian resident claiming the tax-free threshold with no HECS debt.</em>
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Fortnightly Gross Pay</th>
                        <th className="px-6 py-4">Estimated PAYG Withheld</th>
                        <th className="px-6 py-4">Est. Fortnightly Take-Home</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {FORTNIGHTLY_HUB_ROWS.map((row) => (
                        <tr key={row.gross}>
                          <td className="px-6 py-4">{formatAUD(row.gross, 2)}</td>
                          <td className="px-6 py-4">{formatAUD(row.withTFT, 2)}</td>
                          <td className="px-6 py-4">{formatAUD(row.netWithTFT, 2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-sm text-warmgray-light mb-8">*See the full <Link href="/fortnightly-tax-table/">fortnightly tax table</Link> for every earnings band, or <Link href="/fortnightly-pay-calculator/">calculate exact fortnightly pay here</Link>.</p>
            </section>

            <section id="monthly-table">
              <h2>Monthly Tax Table</h2>
              <p>
                Monthly cycles (12 pays per year) apply the following estimated withholding. <em>Assumes Australian resident claiming the tax-free threshold with no HECS debt.</em>
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Monthly Gross Pay</th>
                        <th className="px-6 py-4">Estimated PAYG Withheld</th>
                        <th className="px-6 py-4">Est. Monthly Take-Home</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {MONTHLY_HUB_ROWS.map((row) => (
                        <tr key={row.gross}>
                          <td className="px-6 py-4">{formatAUD(row.gross, 2)}</td>
                          <td className="px-6 py-4">{formatAUD(row.withTFT, 2)}</td>
                          <td className="px-6 py-4">{formatAUD(row.netWithTFT, 2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-sm text-warmgray-light mb-8">*See the full <Link href="/monthly-tax-table/">monthly tax table</Link> for every earnings band, or <Link href="/monthly-pay-calculator/">calculate exact monthly pay here</Link>.</p>
            </section>

            <section id="what-schedules-exist">
              <h2>What Schedules Exist in the PAYG System?</h2>
              <p>
                The ATO publishes <strong>6 main withholding schedules</strong>, each targeting a specific payment type or employee category. The schedule your employer uses determines the withholding rate applied to your gross pay.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Schedule</th>
                        <th className="px-6 py-4">Applies To</th>
                        <th className="px-6 py-4">Key Feature</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-semibold">Schedule 1</td>
                        <td className="px-6 py-4">Regular wages and salary for residents</td>
                        <td className="px-6 py-4">Includes tax-free threshold option, Medicare levy built in</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold">Schedule 2</td>
                        <td className="px-6 py-4">Employees who have not provided a TFN</td>
                        <td className="px-6 py-4">Flat rate of <strong>47%</strong> from the first dollar</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold">Schedule 3</td>
                        <td className="px-6 py-4">Actors, performing artists, company directors</td>
                        <td className="px-6 py-4">Adjusted withholding rates for lump-sum or variable payments</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold">Schedule 4</td>
                        <td className="px-6 py-4">Return-to-work payments, compensation</td>
                        <td className="px-6 py-4">Separate coefficient formula for irregular income streams</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold"><Link href="/schedule-5-tax-table/" className="text-eucalyptus-dark hover:text-navy hover:underline">Schedule 5</Link></td>
                        <td className="px-6 py-4">Back payments, commissions, bonuses and similar payments</td>
                        <td className="px-6 py-4">Method A / Method B apportion the lump sum across the year&apos;s pay periods</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold">Schedule 15</td>
                        <td className="px-6 py-4">Working holiday makers (subclass 417 &amp; 462 visas)</td>
                        <td className="px-6 py-4">Flat <strong>15%</strong> rate on the first $45,000, then resident marginal rates above</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Schedule 1 applies to the vast majority of Australian employees. It contains sub-tables for claiming and not claiming the tax-free threshold, and additional coefficients for employees with HECS-HELP, VSL, SFSS, or TSL study and training debts. For more on study loan repayments and their withholding effect, see our <Link href="/hecs-help-calculator/">HECS-HELP Repayment Guide</Link>. Working holiday makers operate under a completely different tax regime &mdash; our <Link href="/working-holiday-tax/">Working Holiday Tax Guide</Link> explains the rates and thresholds in detail.
              </p>
            </section>

            <section id="how-to-use-tax-tables">
              <h2>How Do You Use the PAYG Tax Tables?</h2>
              <p>
                Employers use the PAYG tax tables by matching an employee&apos;s gross pay period earnings to a corresponding withholding amount using <strong>either a lookup table or a coefficient formula</strong>. Modern payroll software performs this calculation automatically, but manual users follow a specific process.
              </p>

              <h3>Lookup Table Method</h3>
              <p>
                The ATO publishes PDF and CSV tables listing the exact withholding amount for every dollar increment of weekly earnings from $1 to $3,461+. Employers find the row matching the employee&apos;s weekly gross pay and read the withholding amount in the applicable column (with tax-free threshold, without tax-free threshold, with HECS, etc.). For fortnightly pay, the employer doubles the weekly gross, looks up the withholding, and applies it. For monthly pay, the employer multiplies the weekly gross by 4.3333.
              </p>

              <h3>Coefficient Formula Method</h3>
              <p>
                For payroll software and employers processing high volumes, the ATO provides coefficient pairs (a and b) for each earnings bracket. The formula is:
              </p>
              <p className="bg-sandstone p-4 rounded-xl font-mono text-sm not-prose">
                Weekly withholding = (a &times; weekly earnings) &minus; b
              </p>
              <p>
                For an employee earning <strong>$1,500 per week</strong> and claiming the tax-free threshold, the FY2026-27 formulas produce a withholding of approximately <strong>$298</strong>. The resulting weekly take-home pay is <strong>$1,202</strong>. These coefficients already incorporate the 2% Medicare levy and the LITO reduction, so employers do not need to calculate those components separately. Look up any amount in the full <Link href="/weekly-tax-table/">weekly tax table</Link>.
              </p>
            </section>

            <section id="payg-vs-payg-instalments">
              <h2>PAYG Withholding vs PAYG Instalments &mdash; What Is the Difference?</h2>
              <p>
                PAYG withholding applies to <strong>employees receiving wages</strong>, while PAYG instalments apply to <strong>self-employed individuals, sole traders, and investors earning non-salary income</strong>. These are two separate ATO systems with different payment mechanisms, reporting obligations, and collection frequencies.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Feature</th>
                        <th className="px-6 py-4">PAYG Withholding</th>
                        <th className="px-6 py-4">PAYG Instalments</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-semibold">Who pays</td>
                        <td className="px-6 py-4">Employer deducts from employee wages</td>
                        <td className="px-6 py-4">Individual or business pays directly to the ATO</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold">Income type</td>
                        <td className="px-6 py-4">Salary, wages, commissions, bonuses</td>
                        <td className="px-6 py-4">Business income, investment income, rental income</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold">Frequency</td>
                        <td className="px-6 py-4">Every pay cycle (weekly, fortnightly, monthly)</td>
                        <td className="px-6 py-4">Quarterly (via BAS or instalment notice)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold">Rate basis</td>
                        <td className="px-6 py-4">ATO tax tables with coefficient formula</td>
                        <td className="px-6 py-4">ATO-issued instalment rate or fixed instalment amount</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold">Threshold to enter</td>
                        <td className="px-6 py-4">All employees earning $1+ per week</td>
                        <td className="px-6 py-4">Business/investment income that generates a tax liability of <strong>$1,000+</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Contractors and sole traders who do not have tax withheld from their invoices enter the PAYG instalments system instead. Our <Link href="/contractor-vs-employee/">Contractor vs Employee Guide</Link> explains the tax, super, and withholding differences between these two work arrangements. If you operate as a contractor, use our <Link href="/contractor-pay-calculator/">Contractor Pay Calculator</Link> to estimate your quarterly instalment obligations.
              </p>
            </section>

            <section id="tfn-declaration">
              <h2>How Do TFN Declarations and Withholding Variations Affect Your Tax?</h2>
              <p>
                The TFN declaration form is the <strong>single document that controls which withholding rate your employer applies</strong> to your pay. Every answer on this form shifts the calculation in a measurable way.
              </p>
              <ul>
                <li><strong>Tax-Free Threshold:</strong> Claiming this threshold (usually on your primary job) instructs your employer to use the standard table where the first <strong>$18,200</strong> of your annual income is untaxed. This reduces your weekly withholding by approximately <strong>$67</strong> compared to not claiming it.</li>
                <li><strong>No Tax-Free Threshold:</strong> For a second or third job, you do not claim the threshold. Your employer uses a higher withholding table, taxing you from the very first dollar at the <strong>15% marginal rate</strong> (plus 2% Medicare levy).</li>
                <li><strong>Study/Training Loans:</strong> Ticking &quot;Yes&quot; to having a HECS-HELP, VET Student Loan, or SSL debt triggers a combined table that deducts both PAYG tax and loan repayments simultaneously. Repayment rates range from <strong>1% to 10%</strong> depending on your assessable income bracket.</li>
                <li><strong>No TFN provided:</strong> Failing to supply a valid TFN within 28 days triggers the top marginal rate of <strong>47%</strong> from dollar one, with no tax-free threshold or offsets applied.</li>
              </ul>

              <h3>What Is a Withholding Variation?</h3>
              <p>
                A &quot;Withholding Variation&quot; (also called a Section 15-15 variation) is a formal ATO approval that allows your employer to withhold a <strong>different amount</strong> than the standard tax tables prescribe. Common reasons for applying include large work-related deductions (such as $5,000+ in tools or uniforms), significant rental property losses creating negative gearing, or salary sacrifice arrangements that reduce assessable income. The employee applies directly to the ATO, which issues a letter specifying the varied withholding rate. The employer then applies that rate instead of the standard tables until the variation expires at the end of the financial year.
              </p>
              <p>
                Salary sacrifice arrangements for superannuation, novated leases, and other pre-tax benefits also modify the withholding calculation. See our <Link href="/salary-sacrifice-guide/">Salary Sacrifice Guide</Link> for the impact on your take-home pay and taxable income.
              </p>
            </section>

            <section id="what-changed-fy2026-27">
              <h2>What Changed in the PAYG Withholding Tables for FY2026-27?</h2>
              <p>
                The FY2026-27 PAYG withholding tables reflect the legislated <strong>cost-of-living tax cut</strong> that
                took effect on 1 July 2026: the marginal rate on income between $18,201 and $45,000 fell from
                16% to <strong>15%</strong>, worth up to $268 a year. A further cut to <strong>14%</strong> follows on 1 July 2027.
                The tables also continue the Stage 3 bracket structure and the 12% superannuation guarantee rate.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Change</th>
                        <th className="px-6 py-4">Previous (FY2025-26)</th>
                        <th className="px-6 py-4">Current (FY2026-27)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-semibold">Second bracket rate ($18,201&ndash;$45,000)</td>
                        <td className="px-6 py-4">16%</td>
                        <td className="px-6 py-4"><strong>15%</strong></td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold">Middle rate ($45,001&ndash;$135,000)</td>
                        <td className="px-6 py-4">30%</td>
                        <td className="px-6 py-4"><strong>30%</strong> (unchanged)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold">37% bracket ceiling</td>
                        <td className="px-6 py-4">$190,000</td>
                        <td className="px-6 py-4"><strong>$190,000</strong> (unchanged)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold">Top marginal rate</td>
                        <td className="px-6 py-4">45% above $190,000</td>
                        <td className="px-6 py-4"><strong>45% above $190,000</strong> (unchanged)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold">Medicare levy</td>
                        <td className="px-6 py-4">2%</td>
                        <td className="px-6 py-4"><strong>2%</strong> (unchanged)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold">SG rate</td>
                        <td className="px-6 py-4">12%</td>
                        <td className="px-6 py-4"><strong>12%</strong> (unchanged)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The practical impact for anyone earning <strong>$45,000 or more</strong> is a reduction in annual tax of
                {" "}<strong>$268</strong> compared with FY2025-26 &mdash; roughly <strong>$5 more per week</strong> in take-home pay,
                delivered automatically through lower withholding from the first pay after 1 July 2026. The withholding
                coefficients in every ATO schedule have been recalculated accordingly. Check the full breakdown of each
                marginal rate in our <Link href="/tax-brackets/">Tax Brackets Guide</Link> and the year-by-year timeline in
                the <Link href="/tax-changes-2026-27/">2026-27 tax changes guide</Link>.
              </p>
              <p>
                The superannuation guarantee increase to 12% does not directly change the withholding tables, but it affects the total employer cost per employee. Your employer now contributes <strong>$10,800</strong> in super on a $90,000 salary. Our <Link href="/superannuation-calculator/">Superannuation Calculator</Link> shows the exact SG contribution based on your salary.
              </p>
            </section>

            {/* --- CONTEXT BORDER --- */}

            <section id="net-to-gross">
              <h2>How Do You Convert Net Pay Back to Gross Salary?</h2>
              <p>
                Reverse-engineering your gross salary from a known take-home figure requires working <strong>backwards through the PAYG withholding tables</strong>, adding back the tax, Medicare levy, and any HECS repayments that were deducted. Job advertisements increasingly quote &quot;take-home&quot; or &quot;net&quot; amounts, making this conversion essential for comparing offers.
              </p>
              <p>
                A net weekly pay of <strong>$1,202</strong> corresponds to a gross weekly salary of approximately <strong>$1,500</strong> (or $78,000 per year) for a resident claiming the tax-free threshold with no study loan. The relationship between net and gross is non-linear because of progressive marginal rates &mdash; each additional dollar of gross pay is taxed at a higher marginal rate. Use our <Link href="/gross-pay-calculator/">Gross Pay Calculator</Link> to reverse-engineer the PAYG withholding instantly from any net figure.
              </p>
            </section>

            <section id="related-resources">
              <h2>Related Resources</h2>
              <p>
                The PAYG withholding tables connect to several other Australian tax and payroll topics. The following resources provide deeper information on specific areas referenced in this guide.
              </p>
              <ul>
                <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> &mdash; Enter your gross salary and instantly see your PAYG withholding, Medicare levy, superannuation, and net pay for any pay cycle.</li>
                <li><Link href="/tax-brackets/">Tax Brackets Guide</Link> &mdash; Full breakdown of the current marginal tax rates, thresholds, and worked examples at 10 different salary levels.</li>
                <li><Link href="/hecs-help-calculator/">HECS-HELP Repayment Guide</Link> &mdash; How study and training loan debts interact with PAYG withholding, including the compulsory repayment thresholds and rates.</li>
                <li><Link href="/schedule-5-tax-table/">Schedule 5 Tax Table</Link> &mdash; The withholding method for bonuses, commissions, and back payments, with a Method B(ii) calculator.</li>
                <li><Link href="/bonus-tax-guide/">Bonus Tax Guide</Link> &mdash; How bonuses, commissions, and back-payments are withheld differently from regular salary under ATO Method B (Plan B).</li>
                <li><Link href="/superannuation-guide/">Superannuation Guide</Link> &mdash; The SG rate, contribution caps, employer obligations, and how super interacts with your gross-to-net calculation.</li>
                <li><Link href="/understanding-your-payslip/">Understanding Your Payslip</Link> &mdash; Line-by-line explanation of every item on an Australian payslip, including the PAYG withholding line.</li>
              </ul>
            </section>

            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="meaning" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What does PAYG mean in Australia?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    PAYG stands for &quot;Pay As You Go&quot;. It is the system where your employer automatically deducts your estimated income tax obligation from your gross wages and sends it to the Australian Taxation Office (ATO) on your behalf, ensuring you don&apos;t face a massive tax bill in July.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="higher" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Why does my PAYG withholding seem higher than my actual tax bracket?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    PAYG withholding tables are conservative by design. They incorporate the 2% Medicare Levy by default, and they assume you will earn that exact paycheck consistently for 52 weeks. If your income fluctuates, or excessive tax is withheld based on a one-off bonus, you will receive the overpaid amount back as a tax refund when you lodge your annual return.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="no-tfn" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What happens if I don&apos;t provide my Tax File Number?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    If you do not provide a valid TFN to your employer within 28 days of starting, they are legally required to withhold tax at the top marginal rate of 47% from the very first dollar you earn. This rate does not include the tax-free threshold or any offsets. You can reclaim the excess tax when you lodge your annual return, but it means significantly reduced take-home pay in the meantime.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="second-job" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do I claim the tax-free threshold on a second job?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. You claim the tax-free threshold on <strong>one job only</strong> &mdash; typically the job where you earn the most income. On your second (or third) job, you tick &quot;No&quot; to the tax-free threshold question on the TFN declaration. Your second employer then withholds tax from the first dollar at the 15% marginal rate plus 2% Medicare levy. Claiming the threshold on multiple jobs simultaneously results in under-withholding and a tax debt at end of year.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="bonus-withholding" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How are bonuses taxed under the PAYG withholding system?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Bonuses, commissions, and back-payments are classified as &quot;additional payments&quot; under the <Link href="/schedule-5-tax-table/" className="text-eucalyptus-dark underline hover:text-navy">Schedule 5 tax table</Link>. The ATO prescribes two methods: Method A adds the bonus to the regular pay and withholds on the combined amount; Method B (more common) apportions the bonus across the year&apos;s pay periods and applies your marginal rate. Method B typically results in a <strong>lower withholding amount</strong> and is the default in most payroll software.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="medicare-included" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is Medicare levy included in the PAYG withholding tables?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. The standard Schedule 1 withholding tables include the <strong>2% Medicare levy</strong> in the withholding coefficients. Employers do not need to calculate the Medicare levy separately. However, the tables do <strong>not</strong> include the Medicare Levy Surcharge (MLS) of 1%, 1.25%, or 1.5%, which applies to higher earners without private hospital cover. MLS is assessed at tax return time unless the employee requests a withholding variation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="hecs-withholding" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How does HECS-HELP affect my PAYG withholding?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Employees with a HECS-HELP, VET Student Loan, or other study/training debt must indicate this on their TFN declaration. The employer then uses a combined withholding table that deducts both income tax and a compulsory loan repayment. Under the marginal repayment system, you repay <strong>15c per dollar</strong> of repayment income above the minimum threshold of <strong>$69,528</strong>, stepping up above $129,717. The additional withholding means a lower take-home pay each period, but it reduces the remaining loan balance throughout the year. See the STSL columns in the <Link href="/weekly-tax-table/" className="text-eucalyptus-dark underline hover:text-navy">weekly tax table</Link>.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="foreign-resident" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What withholding rate applies to foreign residents?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Foreign residents (non-residents for tax purposes) do not receive the <strong>$18,200 tax-free threshold</strong> and are taxed from the first dollar at <strong>30%</strong> up to $135,000. The ATO publishes a separate &quot;Foreign resident&quot; column in Schedule 1 with higher withholding coefficients reflecting the absence of the threshold and LITO. Foreign residents also do not pay the 2% Medicare levy, which partially offsets the higher marginal rate. Working holiday makers (subclass 417 and 462 visas) use a different table &mdash; Schedule 15 &mdash; with a flat 15% rate on the first $45,000.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="employer-obligation" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is PAYG withholding the employer&apos;s or the employee&apos;s obligation?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    PAYG withholding is the <strong>employer&apos;s legal obligation</strong>. The employer must register as a withholder with the ATO, correctly calculate and deduct the withholding amount, report it on the BAS, and remit it to the ATO by the due date. Failure to withhold or remit attracts penalties under Division 16 of Schedule 1 to the Taxation Administration Act 1953. Employees are not liable for amounts the employer fails to withhold &mdash; the ATO pursues the employer directly.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="salary-sacrifice-effect" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does salary sacrifice reduce PAYG withholding?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Salary sacrifice arrangements reduce your assessable income before PAYG withholding is calculated. For example, sacrificing <strong>$10,000</strong> per year into superannuation on a $90,000 salary reduces the withholding base to <strong>$80,000</strong>, lowering weekly PAYG by approximately <strong>$58</strong>. The sacrificed amount is taxed at 15% inside the super fund rather than at your marginal rate. Pre-tax novated lease payments and portable electronic devices also reduce the withholding base.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="update-frequency" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How often are the PAYG withholding tables updated?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The ATO updates the PAYG withholding tables <strong>once per financial year</strong>, with new tables published by 1 July. Updated tables reflect any legislated changes to income tax rates, thresholds, offsets, or the Medicare levy. Employers and payroll providers must implement the updated tables for the first pay period on or after 1 July. Mid-year updates are rare but occur when Parliament passes legislation with an immediate effective date.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="overpaid-tax" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What happens if too much PAYG is withheld from my pay?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Excess PAYG withholding is refunded when you lodge your annual tax return. The ATO calculates your actual tax liability based on total assessable income, deductions, and offsets, then subtracts all PAYG amounts withheld during the year. If total withholding exceeds the liability, you receive the difference as a <strong>tax refund</strong>, typically within <strong>2 weeks</strong> for electronically lodged returns. Common causes of over-withholding include mid-year job starts, periods of leave without pay, and large work-related deductions not reflected in the withholding tables.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>Calculations and table estimates are derived from the annualised ATO withholding formulas for the 2026-27 financial year, incorporating the 15% rate on $18,201&ndash;$45,000 that applies from 1 July 2026, the Low Income Tax Offset, and the Medicare levy with low-income shading. Printed ATO tables may differ by small rounding amounts.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("payg-withholding-tables"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Calculators</h3>
                  <div className="space-y-3">
                    <Link href="/weekly-pay-calculator/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Weekly Pay Calc</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/fortnightly-pay-calculator/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Fortnightly Pay Calc</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/monthly-pay-calculator/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Monthly Pay Calc</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/tax-brackets/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Tax Brackets Guide</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Need an exact figure?</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Input your exact salary to see your PAYG withheld right down to the cent.</p>
                  <Link href="/take-home-pay-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Go to Calculator
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
