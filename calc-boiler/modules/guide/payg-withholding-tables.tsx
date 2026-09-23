import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, formatAUD } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import {
  calculatePAYGWithholding,
  withholdingForPeriod,
  PAYG_FINANCIAL_YEAR,
  PAYG_TABLES_UPDATED,
  type PayFrequency,
} from "@/lib/constants/payg-withholding";
import TaxTableFaqSection from "@/modules/tax-tables/faq-section";
import { PAYG_HUB_FAQS } from "./payg-withholding-tables-faqs";

const SOURCES_LIST: SourceLink[] = [
  { title: "ATO Tax tables", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-tables-overview", publisher: SOURCES.ato.name },
  { title: "Weekly tax table (NAT 1005)", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-table-weekly", publisher: SOURCES.ato.name },
  { title: "Fortnightly tax table (NAT 1006)", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-table-fortnightly", publisher: SOURCES.ato.name },
  { title: "Monthly tax table (NAT 1007)", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-table-monthly", publisher: SOURCES.ato.name },
  { title: "Schedule 1 – Statement of formulas for calculating amounts to be withheld (NAT 1004)", url: "https://www.ato.gov.au/tax-rates-and-codes/payg-withholding-schedule-1-statement-of-formulas-for-calculating-amounts-to-be-withheld", publisher: SOURCES.ato.name },
];

// Exact-match anchors: this hub hands "weekly / fortnightly / monthly tax
// table" intent to the dedicated pages rather than competing with them.
const PAY_CYCLE_TABLES = [
  { href: "/fortnightly-tax-table/", label: `Fortnightly tax table ${PAYG_FINANCIAL_YEAR}`, detail: "26 pays a year — ATO NAT 1006" },
  { href: "/weekly-tax-table/", label: `Weekly tax table ${PAYG_FINANCIAL_YEAR}`, detail: "52 pays a year — ATO NAT 1005" },
  { href: "/monthly-tax-table/", label: `Monthly tax table ${PAYG_FINANCIAL_YEAR}`, detail: "12 pays a year — ATO NAT 1007" },
  { href: "/schedule-5-tax-table/", label: "Schedule 5 tax table", detail: "Bonuses, commissions & back pay — ATO NAT 3348" },
] as const;

// One representative figure per pay cycle — the full tables live on the
// dedicated pages. Computed from the Schedule 1 engine.
const GLANCE: { frequency: PayFrequency; label: string; href: string; gross: number }[] = [
  { frequency: "weekly", label: "Weekly", href: "/weekly-tax-table/", gross: 1_500 },
  { frequency: "fortnightly", label: "Fortnightly", href: "/fortnightly-tax-table/", gross: 3_000 },
  { frequency: "monthly", label: "Monthly", href: "/monthly-tax-table/", gross: 6_500 },
];

const example1500 = calculatePAYGWithholding(1_500, "weekly");

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
            PAYG Withholding Tax Tables {PAYG_FINANCIAL_YEAR}: Which ATO Table to Use
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-3">
            The ATO publishes a separate tax table for each pay cycle. Pick yours below for the full {PAYG_FINANCIAL_YEAR} table,
            an instant lookup and a CSV download &mdash; or read on for how the PAYG withholding schedules fit together.
          </p>
          <p className="text-sm font-semibold text-eucalyptus-dark mb-6">Updated: {PAYG_TABLES_UPDATED} — all tables reflect the {PAYG_FINANCIAL_YEAR} rate cut (15% on $18,201&ndash;$45,000)</p>

          <nav aria-label="Tax tables by pay cycle" id="tables-by-pay-cycle" className="grid sm:grid-cols-2 gap-4 mb-8">
            {PAY_CYCLE_TABLES.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group flex items-start justify-between gap-3 p-5 rounded-xl border-2 border-eucalyptus/30 bg-white hover:border-eucalyptus hover:shadow-md transition-all"
              >
                <span>
                  <span className="block text-lg font-bold text-navy group-hover:text-eucalyptus-dark mb-1">{t.label}</span>
                  <span className="block text-sm text-warmgray">{t.detail}</span>
                </span>
                <ArrowRight className="h-5 w-5 mt-1 flex-shrink-0 text-eucalyptus-dark" aria-hidden="true" />
              </Link>
            ))}
          </nav>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="what-are-payg-withholding-tables">
              <h2>What Are PAYG Withholding Tables?</h2>
              <p>
                PAYG withholding tables are ATO-published lookup schedules that tell employers the <strong>exact dollar amount of income tax to deduct</strong> from each employee payment. The Australian Taxation Office reissues these tables when income tax rates, the Medicare levy thresholds or offsets such as the Low Income Tax Offset (LITO) change &mdash; usually from 1 July. The regular tables applied unchanged from 1 July 2024 to 30 June 2026 and were reissued for payments from 1 July 2026.
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

            <section id="withholding-at-a-glance">
              <h2>PAYG Withholding at a Glance, {PAYG_FINANCIAL_YEAR}</h2>
              <p>
                One example per pay cycle, for an Australian resident with no study loan. Each tax table page has the full
                table in both threshold columns, a {PAYG_FINANCIAL_YEAR} / 2025-26 toggle and a lookup for your exact pay.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <caption className="sr-only">Example PAYG withholding by pay cycle, {PAYG_FINANCIAL_YEAR}</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-4 py-3">Pay cycle</th>
                        <th scope="col" className="px-4 py-3">Earnings</th>
                        <th scope="col" className="px-4 py-3">Tax-free threshold claimed</th>
                        <th scope="col" className="px-4 py-3">Not claimed</th>
                        <th scope="col" className="px-4 py-3">Full table</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {GLANCE.map((g) => (
                        <tr key={g.frequency}>
                          <th scope="row" className="px-4 py-3 font-semibold">{g.label}</th>
                          <td className="px-4 py-3">{formatAUD(g.gross)}</td>
                          <td className="px-4 py-3">{formatAUD(withholdingForPeriod(g.gross, g.frequency, "tft"))}</td>
                          <td className="px-4 py-3">{formatAUD(withholdingForPeriod(g.gross, g.frequency, "noTft"))}</td>
                          <td className="px-4 py-3">
                            <Link href={g.href} className="font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                              {g.label} tax table {PAYG_FINANCIAL_YEAR}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-sm text-warmgray-light">
                For an exact figure use the lookup on the <Link href="/weekly-tax-table/">weekly tax table</Link>,{" "}
                <Link href="/fortnightly-tax-table/">fortnightly tax table</Link> or{" "}
                <Link href="/monthly-tax-table/">monthly tax table</Link> page.
              </p>
            </section>

            <section id="what-schedules-exist">
              <h2>What Schedules Exist in the PAYG System?</h2>
              <p>
                The ATO publishes <strong>15 withholding schedules</strong>, each covering a specific payment type or payee category. These are the ones employers meet most often. The schedule your employer uses determines the withholding rate applied to your gross pay.
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
                        <td className="px-6 py-4 font-semibold">Schedule 1 (NAT 1004)</td>
                        <td className="px-6 py-4">Regular salary and wages paid weekly, fortnightly or monthly &mdash; the formulas behind the <Link href="/weekly-tax-table/" className="text-eucalyptus-dark hover:text-navy hover:underline">weekly</Link>, <Link href="/fortnightly-tax-table/" className="text-eucalyptus-dark hover:text-navy hover:underline">fortnightly</Link> and <Link href="/monthly-tax-table/" className="text-eucalyptus-dark hover:text-navy hover:underline">monthly</Link> tax tables</td>
                        <td className="px-6 py-4">Scales for threshold claimed / not claimed, foreign residents, no TFN (<strong>47%</strong> resident, <strong>45%</strong> foreign resident) and Medicare levy exemptions</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold">Schedule 2 (NAT 1013)</td>
                        <td className="px-6 py-4">Individuals employed in the horticultural or shearing industry</td>
                        <td className="px-6 py-4">Separate withholding rules for workers in these industries</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold">Schedule 3 (NAT 1023)</td>
                        <td className="px-6 py-4">Actors, variety artists and other entertainers</td>
                        <td className="px-6 py-4">Separate withholding rules for performers</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold">Schedule 4 (NAT 3347)</td>
                        <td className="px-6 py-4">Return to work payments</td>
                        <td className="px-6 py-4">Withholding on payments made to induce a person to return to work</td>
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
                Schedule 1 applies to the vast majority of Australian employees. It contains scales for claiming and not claiming the tax-free threshold, foreign residents and Medicare levy exemptions. Study and training support loan components (HELP, VSL, FS, SSL and AASL debts) come from a separate schedule, Schedule 8 (NAT 3539), and are added on top. For more on study loan repayments and their withholding effect, see our <Link href="/hecs-help-calculator/">HECS-HELP Repayment Guide</Link>. Working holiday makers operate under a completely different tax regime &mdash; our <Link href="/working-holiday-tax/">Working Holiday Tax Guide</Link> explains the rates and thresholds in detail.
              </p>
            </section>

            <section id="how-to-use-tax-tables">
              <h2>How Do You Use the PAYG Tax Tables?</h2>
              <p>
                Employers use the PAYG tax tables by matching an employee&apos;s gross pay period earnings to a corresponding withholding amount using <strong>either a lookup table or a coefficient formula</strong>. Modern payroll software performs this calculation automatically, but manual users follow a specific process.
              </p>

              <h3>Lookup Table Method</h3>
              <p>
                For each pay cycle the ATO publishes a printable PDF look-up table and an XLSX look-up tool. The employer adds allowances and irregular payments to normal earnings for the period, ignores the cents, finds that amount and reads across to the right column: column 2 if the payee claimed the tax-free threshold, column 3 if not. A study loan component comes from a separate table and is added on top. Use the <Link href="/weekly-tax-table/">weekly tax table</Link>, <Link href="/fortnightly-tax-table/">fortnightly tax table</Link> or <Link href="/monthly-tax-table/">monthly tax table</Link> that matches the pay cycle &mdash; the fortnightly and monthly amounts are derived from the weekly formula by the ATO, not by the employer.
              </p>

              <h3>Coefficient Formula Method</h3>
              <p>
                For payroll software, the ATO publishes Schedule 1 (NAT 1004): coefficient pairs (a and b) for each band of weekly earnings. Fortnightly pay is halved and monthly pay multiplied by 3 and divided by 13 to get weekly earnings (x), cents are ignored and 99 cents added, and the weekly result is converted back to the pay period. The formula is:
              </p>
              <p className="bg-sandstone p-4 rounded-xl font-mono text-sm not-prose">
                Weekly withholding = (a &times; weekly earnings) &minus; b
              </p>
              <p>
                For an employee earning <strong>{formatAUD(1_500)} per week</strong> and claiming the tax-free threshold, the {PAYG_FINANCIAL_YEAR} formula gives a withholding of <strong>{formatAUD(example1500.totalWithheld)}</strong>, leaving <strong>{formatAUD(example1500.netPerPeriod)}</strong> take-home. The coefficients already build in the 2% Medicare levy (with its low-income shading) and part of the Low Income Tax Offset, so employers do not calculate those separately. Look up any amount in the full <Link href="/weekly-tax-table/">weekly tax table</Link>.
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
                Contractors and sole traders who do not have tax withheld from their invoices enter the PAYG instalments system instead. Our <Link href="/contractor-vs-employee-calculator/">Contractor vs Employee Guide</Link> explains the tax, super, and withholding differences between these two work arrangements. If you operate as a contractor, use our <Link href="/contractor-pay-calculator/">Contractor Pay Calculator</Link> to estimate your quarterly instalment obligations.
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
                Salary sacrifice arrangements for superannuation, novated leases, and other pre-tax benefits also modify the withholding calculation. See our <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Guide</Link> for the impact on your take-home pay and taxable income.
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
                A net weekly pay of <strong>{formatAUD(example1500.netPerPeriod)}</strong> corresponds to a gross weekly salary of approximately <strong>$1,500</strong> (or $78,000 per year) for a resident claiming the tax-free threshold with no study loan. The relationship between net and gross is non-linear because of progressive marginal rates &mdash; each additional dollar of gross pay is taxed at a higher marginal rate. Use our <Link href="/gross-pay-calculator/">Gross Pay Calculator</Link> to reverse-engineer the PAYG withholding instantly from any net figure.
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
                <li><Link href="/bonus-tax-calculator/">Bonus Tax Guide</Link> &mdash; How bonuses, commissions, and back-payments are withheld differently from regular salary under ATO Schedule 5 (Method A or Method B(ii)).</li>
                <li><Link href="/superannuation-guide/">Superannuation Guide</Link> &mdash; The SG rate, contribution caps, employer obligations, and how super interacts with your gross-to-net calculation.</li>
                <li><Link href="/understanding-your-payslip/">Understanding Your Payslip</Link> &mdash; Line-by-line explanation of every item on an Australian payslip, including the PAYG withholding line.</li>
              </ul>
            </section>

            <TaxTableFaqSection
              heading="Frequently Asked Questions"
              mirrorHeading="PAYG withholding tax tables questions and answers"
              faqs={PAYG_HUB_FAQS}
            />

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>Every withholding figure on this page is computed from the ATO&apos;s Schedule 1 (NAT 1004) coefficient formulas for {PAYG_FINANCIAL_YEAR} &mdash; the same method that produces the printed weekly, fortnightly and monthly tax tables &mdash; and our engine is tested against every row of the ATO&apos;s published sample data. Figures assume no tax offset or Medicare levy adjustment claimed on a withholding declaration.</p>
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
