"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, HECS_HELP, calculateHECS, calculatePayBreakdown, formatAUD, annualToWeekly } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Study and training loan repayment thresholds and rates", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: SOURCES.ato.name },
  { title: "Changes to student loans (Indexation)", url: "https://www.education.gov.au/20-reduction-student-loan-debt", publisher: "Department of Education" },
  { title: "HELP information for 2025-26", url: "https://www.ato.gov.au/individuals-and-families/study-and-training-support-loans", publisher: SOURCES.ato.name },
  { title: "Universities Accord Final Report", url: "https://www.education.gov.au/australian-universities-accord", publisher: "Department of Education" },
];

export default function HecsHelpGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">HECS-HELP Repayment Guide</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            HECS-HELP Repayment Guide 2026-27 — Marginal System Explained
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Australia&apos;s student loan system is undergoing massive changes. Understand the new marginal rate system, the lowered indexation caps, and how it radically impacts your take-home pay.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-r-xl not-prose mb-8">
              <p className="text-navy text-sm font-medium">
                <strong>Attention: Major Legislation Changes</strong>
                <br />
                The Treasury has introduced the <em>Universities Accord (Student Support and Other Measures) Bill 2024</em>. The information below reflects the new Marginal Repayment system and the marginal repayment system, with the FY2026-27 minimum threshold at $69,528.
              </p>
            </div>

            {/* SECTION 1: What Is HECS-HELP? */}
            <section id="what-is-hecs-help">
              <h2>What Is HECS-HELP?</h2>
              <p>
                HECS-HELP is the Australian Government&apos;s income-contingent loan scheme that covers tuition fees for eligible Commonwealth-supported university students. The acronym stands for Higher Education Contribution Scheme &ndash; Higher Education Loan Program.
              </p>
              <p>
                Approximately <strong>3 million Australians</strong> hold an active HECS-HELP debt as of FY2025-26, with the average outstanding balance sitting at roughly <strong>$26,500</strong>. The loan carries no commercial interest rate. Instead, the balance is indexed annually to maintain its real value against inflation, using the lower of the Consumer Price Index (CPI) or the Wage Price Index (WPI).
              </p>
              <p>
                Repayments are compulsory once your &ldquo;Repayment Income&rdquo; (RI) exceeds <strong>$69,528</strong> in FY2026-27. Repayment Income includes your taxable income, total net investment losses, reportable fringe benefits, and reportable superannuation contributions. This broader definition prevents high earners from sheltering income through salary sacrifice or negative gearing to avoid HECS obligations.
              </p>
              <p>
                The scheme operates through the Australian tax system. Your employer withholds HECS repayments from each pay cycle via PAYG withholding, and the ATO reconciles the total when you lodge your annual tax return. Use our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to see how HECS fits alongside your income tax brackets and Medicare levy.
              </p>
            </section>

            {/* SECTION 2: How Do HECS Repayments Work? */}
            <section id="how-repayments-work">
              <h2>How Do HECS Repayments Work?</h2>
              <p>
                HECS repayments are deducted automatically from your salary through the PAYG withholding system, calculated as a percentage of income above the <strong>$69,528</strong> minimum threshold (FY2026-27).
              </p>
              <p>
                The repayment process follows 5 steps:
              </p>
              <ol>
                <li><strong>Notify your employer</strong> &mdash; Tick the &ldquo;HELP/SSL/TSL debt&rdquo; box on your Tax File Number (TFN) declaration when starting a new job. Your employer then applies additional withholding each pay cycle to cover compulsory repayments.</li>
                <li><strong>Employer withholds HECS</strong> &mdash; Your employer deducts HECS repayment amounts from your gross pay alongside PAYG tax. The exact weekly or fortnightly amount depends on your salary level and the ATO&apos;s PAYG withholding schedules.</li>
                <li><strong>Lodge your tax return</strong> &mdash; When you lodge your return after 30 June, the ATO calculates your actual Repayment Income for the financial year. This determines your true compulsory repayment obligation.</li>
                <li><strong>ATO reconciles</strong> &mdash; The ATO compares what your employer withheld against what you actually owe. Any shortfall is added to your tax bill. Any excess is refunded as part of your tax return.</li>
                <li><strong>Balance reduces</strong> &mdash; Confirmed repayments are applied to your HECS-HELP balance. You can track your remaining debt through your myGov account linked to the ATO.</li>
              </ol>
              <p>
                The PAYG withholding tables your employer uses are updated each financial year. See our <Link href="/payg-withholding-tables/">PAYG Withholding Tables</Link> guide for the current schedule. On your payslip, this extra withholding usually appears under the code STSL &mdash; our guide to <Link href="/stsl-on-payslip/">STSL on your payslip</Link> explains how the amount is worked out. If you earn income from multiple employers, each withholds independently, so you may end up under- or over-paying during the year.
              </p>
            </section>

            {/* SECTION 3: Repayment Thresholds */}
            <section id="thresholds">
              <h2>What Are the HECS-HELP Repayment Thresholds for FY2026-27?</h2>
              <p>
                The minimum repayment threshold for FY2026-27 is <strong>$69,528</strong>, indexed up from the {formatAUD(HECS_HELP.minimumThreshold)} threshold that launched the marginal system in FY2025-26 &mdash; itself a significant increase from the {formatAUD(HECS_HELP.previousThreshold)} threshold under the old flat-rate system. Use our <Link href="/hecs-help-calculator/">HECS repayment calculator</Link> to see your exact repayment at current-year rates.
              </p>
              <p>
                Under the new marginal system introduced from 1 July 2025, repayment rates apply only to income within each band &mdash; not to your entire salary. This structure mirrors how Australian income tax brackets work, eliminating the harsh &ldquo;cliff&rdquo; effects of the old system.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Repayment Income Range</th>
                        <th className="px-6 py-4">Marginal Repayment Rate</th>
                        <th className="px-6 py-4">Cumulative Maximum Repayment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-4">Below $69,528</td><td className="px-6 py-4 font-semibold">Nil (0%)</td><td className="px-6 py-4">$0</td></tr>
                      <tr><td className="px-6 py-4">$69,529 &ndash; $129,717</td><td className="px-6 py-4">15% on the amount above $69,528</td><td className="px-6 py-4">$9,028</td></tr>
                      <tr><td className="px-6 py-4">$129,718 &ndash; $186,050</td><td className="px-6 py-4">$9,028 + 17% on amount above $129,717</td><td className="px-6 py-4">$18,605</td></tr>
                      <tr><td className="px-6 py-4">$186,051 and above</td><td className="px-6 py-4">10% of total repayment income</td><td className="px-6 py-4">Varies</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The repayment threshold represents approximately <strong>75%</strong> of average graduate earnings, ensuring that lower-income graduates retain more take-home pay during the early years of their careers. Graduates earning below this threshold &mdash; including many teachers, nurses, and social workers in their first few years &mdash; make <strong>zero</strong> compulsory HECS repayments.
              </p>

              <h3>How Does the Marginal System Differ from the Old Flat-Rate System?</h3>
              <p>
                The old system applied a single percentage to your <em>entire</em> repayment income once you crossed a threshold. Earning <strong>$1 over the boundary</strong> triggered a repayment on your full salary, creating punishing cliff edges where a small pay rise resulted in a net pay <em>decrease</em>.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Feature</th>
                        <th className="px-6 py-4">Old Flat-Rate System (Pre-2025)</th>
                        <th className="px-6 py-4">New Marginal System (FY2025-26)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-4 font-medium">Minimum threshold</td><td className="px-6 py-4">{formatAUD(HECS_HELP.previousThreshold)}</td><td className="px-6 py-4 font-semibold">{formatAUD(HECS_HELP.minimumThreshold)}</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Rate application</td><td className="px-6 py-4">Percentage of entire income</td><td className="px-6 py-4">Percentage of income within each band only</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Cliff effect</td><td className="px-6 py-4">Yes &mdash; severe</td><td className="px-6 py-4 font-semibold">No &mdash; eliminated</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Repayment on $70,000</td><td className="px-6 py-4">~$3,150 (4.5% of $70k)</td><td className="px-6 py-4 font-semibold">{formatAUD(calculateHECS(70000))} (15% of $3k)</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Repayment on $80,000</td><td className="px-6 py-4">~$3,600 (4.5% of $80k)</td><td className="px-6 py-4 font-semibold">{formatAUD(calculateHECS(80000))} (15% of $13k)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* SECTION 4: How Repayments Are Calculated */}
            <section id="how-calculated">
              <h2>How Are HECS Repayments Calculated?</h2>
              <p>
                HECS repayments are calculated by applying the marginal rate to each dollar of repayment income above the <strong>$69,528</strong> threshold (FY2026-27), following the same band-based logic as Australian income tax.
              </p>

              <div className="bg-sandstone border border-sandstone-dark/20 p-6 rounded-xl not-prose my-6">
                <h3 className="font-bold text-navy mb-3 block text-lg">Example A: Salary of $80,000 (FY2026-27)</h3>
                <ol className="list-decimal list-inside space-y-2 text-navy text-sm">
                  <li>The first $69,528 is completely exempt from HECS repayments.</li>
                  <li>Calculate the amount over the threshold: $80,000 - $69,528 = $10,472.</li>
                  <li>Calculate 15% of that remaining chunk: 15% of $10,472 = $1,571 total yearly repayment.</li>
                </ol>
                <p className="mt-3 text-sm text-eucalyptus-dark font-semibold">Under the old flat-rate system, an $80k earner would have paid roughly $3,600/yr. The new system saves them ~$2,000 annually in take-home pay.</p>
              </div>

              <div className="bg-sandstone border border-sandstone-dark/20 p-6 rounded-xl not-prose my-6">
                <h3 className="font-bold text-navy mb-3 block text-lg">Example B: Salary of $130,000 (FY2026-27)</h3>
                <ol className="list-decimal list-inside space-y-2 text-navy text-sm">
                  <li>The first $69,528 is completely exempt.</li>
                  <li>The band from $69,528 up to $129,717 is fully utilised. Size of band: $60,189. Apply 15% here = $9,028.</li>
                  <li>The amount stretching over $129,717 is $283. Apply 17% to this = $48.</li>
                  <li>Total repayment = $9,028 + $48 = $9,076 total yearly repayment.</li>
                </ol>
              </div>

              <div className="bg-sandstone border border-sandstone-dark/20 p-6 rounded-xl not-prose my-6">
                <h3 className="font-bold text-navy mb-3 block text-lg">Example C: Salary of $60,000 (FY2026-27)</h3>
                <ol className="list-decimal list-inside space-y-2 text-navy text-sm">
                  <li>The entire $60,000 falls below the $69,528 threshold.</li>
                  <li>Compulsory HECS repayment = <strong>$0</strong>.</li>
                  <li>The full salary flows through to income tax, Medicare levy, and superannuation calculations only.</li>
                </ol>
                <p className="mt-3 text-sm text-eucalyptus-dark font-semibold">Under the old system with a ~$69,528 threshold, this earner would have owed roughly $1,200/yr. The raised threshold saves them the entire amount.</p>
              </div>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Interactive HECS Calculator</h3>
                    <p className="text-navy text-sm mb-3">Tired of doing the math? We have built an interactive calculator precisely tuned to the marginal repayment system, updated with FY2026-27 thresholds.</p>
                    <Link href="/hecs-help-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Use our HECS-HELP Calculator <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 5: Impact on Take-Home Pay */}
            <section id="take-home-impact">
              <h2>How Does HECS Affect Take-Home Pay?</h2>
              <p>
                HECS repayments reduce your after-tax income by <strong>{formatAUD(annualToWeekly(calculateHECS(80000)), 2)}</strong> per week at an $80,000 salary, scaling progressively as income rises under the new marginal system.
              </p>
              <p>
                The table below shows the full impact across 8 common salary levels, including the annual HECS obligation, weekly deduction, and resulting net take-home pay after income tax, Medicare levy, and HECS are all removed.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Annual Salary</th>
                        <th className="px-6 py-4">Annual HECS</th>
                        <th className="px-6 py-4">Weekly Cost</th>
                        <th className="px-6 py-4">Take-Home (with HECS)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {[60000, 67000, 70000, 80000, 90000, 100000, 120000, 150000].map((s) => {
                        const hecs = calculateHECS(s);
                        const bp = calculatePayBreakdown({ grossSalary: s, includeHECS: true });
                        return (
                          <tr key={s}>
                            <td className="px-6 py-4 font-medium">{formatAUD(s)}</td>
                            <td className="px-6 py-4">{formatAUD(hecs)}</td>
                            <td className="px-6 py-4">{formatAUD(annualToWeekly(hecs), 2)}</td>
                            <td className="px-6 py-4 font-semibold text-eucalyptus-dark">{formatAUD(bp.takeHomePay)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Notice how there&apos;s no sudden jump in repayments under the new marginal system. Under the FY2026-27 thresholds, moving from $69,528 to $70,000 only triggered <strong>{formatAUD(calculateHECS(70000))}</strong> in annual HECS &mdash; just <strong>{formatAUD(annualToWeekly(calculateHECS(70000)), 2)}</strong> per week. Under the old flat-rate system, that same earner would have faced a much larger cliff. Use our <Link href="/hecs-help-calculator/">HECS-HELP Calculator</Link> to model your exact scenario.
              </p>
              <p>
                For a full breakdown of how income tax, superannuation, and Medicare levy combine with HECS to determine your disposable salary, try our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link>. It handles all deductions in a single view and shows your net pay after tax on a weekly, fortnightly, monthly, and annual basis.
              </p>
            </section>

            {/* SECTION 6: Indexation */}
            <section id="indexation">
              <h2>How Is HECS Debt Indexed?</h2>
              <p>
                HECS debt is indexed on <strong>1 June each year</strong> at the lower of the Consumer Price Index (CPI) or the Wage Price Index (WPI), capping annual growth to prevent inflation spikes from ballooning student loan balances.
              </p>
              <p>
                The Australian Government does not charge commercial interest on study and training loans. Instead, debts are adjusted annually to maintain their real purchasing-power value. The indexation rate for the 12 months to March of the relevant year is applied to your outstanding balance on 1 June.
              </p>
              <p>
                In 2023, high inflation caused a historic indexation spike of <strong>7.1%</strong>, adding thousands of dollars to loan balances across the country. A graduate with a $30,000 debt saw it jump by $2,130 overnight. To protect graduates from this happening again, the government legislated a new capped formula:
              </p>
              <p className="text-lg font-medium text-navy border-l-4 border-eucalyptus pl-4 py-1">
                Indexation = the lower of CPI or WPI. This was backdated to 1 June 2023.
              </p>

              <h3>Historical Indexation Rates</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Year (Applied 1 June)</th>
                        <th className="px-6 py-4">CPI</th>
                        <th className="px-6 py-4">WPI</th>
                        <th className="px-6 py-4">Rate Applied</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-4">2023 (original)</td><td className="px-6 py-4">7.1%</td><td className="px-6 py-4">3.2%</td><td className="px-6 py-4 font-semibold">3.2% (backdated)</td></tr>
                      <tr><td className="px-6 py-4">2024</td><td className="px-6 py-4">4.7%</td><td className="px-6 py-4">4.1%</td><td className="px-6 py-4 font-semibold">4.1%</td></tr>
                      <tr><td className="px-6 py-4">2025</td><td className="px-6 py-4">~2.4%</td><td className="px-6 py-4">~3.4%</td><td className="px-6 py-4 font-semibold">~2.4% (lower of two)</td></tr>
                      <tr><td className="px-6 py-4">2026</td><td className="px-6 py-4">2.8%</td><td className="px-6 py-4">~3.3%</td><td className="px-6 py-4 font-semibold">2.8% (lower of two)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The backdated correction for 2023 wiped out the 7.1% spike and retroactively applied the lower 3.2% WPI rate. Graduates who overpaid as a result of the inflated 2023 indexation received credits to their HECS balance. This change benefited approximately <strong>3 million borrowers</strong> and reduced total outstanding HELP debt by roughly <strong>$3 billion</strong>.
              </p>
            </section>

            {/* SECTION 7: Is It Worth Paying Off HECS Early? */}
            <section id="voluntary-repayments">
              <h2>Is It Worth Paying Off HECS Early?</h2>
              <p>
                Voluntary HECS repayment is financially advantageous only when indexation exceeds the after-tax return you could earn by investing that money elsewhere &mdash; for most graduates in FY2026-27, this means early repayment is <strong>not the optimal strategy</strong>.
              </p>
              <p>
                HECS carries no commercial interest. The debt grows only by the indexation rate, which is capped at the lower of CPI or WPI &mdash; <strong>2.8%</strong> applied on 1 June 2026. A standard high-interest savings account offers <strong>4.5&ndash;5.0%</strong> returns before tax. Even after the 16&ndash;39% marginal tax on interest income, the net return exceeds HECS indexation in most scenarios.
              </p>

              <h3>When Voluntary Repayment Makes Sense</h3>
              <ul>
                <li><strong>Your balance is small</strong> &mdash; If you owe less than $5,000, clearing it removes the administrative burden and frees up cash flow permanently.</li>
                <li><strong>You are about to go overseas</strong> &mdash; HECS obligations still apply to Australian residents earning abroad. Clearing the debt before departure eliminates the need to lodge Australian returns for HECS purposes.</li>
                <li><strong>Indexation is high</strong> &mdash; In years where CPI exceeds 4&ndash;5%, early repayment provides a guaranteed &ldquo;return&rdquo; equal to the avoided indexation rate.</li>
                <li><strong>You have surplus cash with no higher-return use</strong> &mdash; If the money would otherwise sit in a 0% transaction account, paying down HECS avoids the guaranteed indexation cost.</li>
              </ul>
              <p>
                If you do make a voluntary repayment, lodge it via BPAY to the ATO <strong>before 1 June</strong> to reduce your balance before indexation is applied. There are currently no government bonuses or percentage discounts for voluntary payments &mdash; the sole benefit is principal reduction.
              </p>
              <p>
                Consider whether salary sacrifice into superannuation provides a better long-term outcome. Read our <Link href="/salary-sacrifice-guide/">Salary Sacrifice Guide</Link> for a comparison of pre-tax strategies.
              </p>
            </section>

            {/* SECTION 8: Types of Study Loans */}
            <section id="loan-types">
              <h2>What Types of Australian Study Loans Exist?</h2>
              <p>
                Australia operates <strong>4 distinct government study loan schemes</strong>: HECS-HELP, FEE-HELP, VET Student Loans, and SA-HELP, each covering different study types and fee structures.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Loan Type</th>
                        <th className="px-6 py-4">Who It Covers</th>
                        <th className="px-6 py-4">Fee Limit (FY2025-26)</th>
                        <th className="px-6 py-4">Loan Fee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-medium">HECS-HELP</td>
                        <td className="px-6 py-4">Commonwealth-supported university students</td>
                        <td className="px-6 py-4">No lifetime limit</td>
                        <td className="px-6 py-4 font-semibold">None</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">FEE-HELP</td>
                        <td className="px-6 py-4">Full-fee-paying students at universities and approved providers</td>
                        <td className="px-6 py-4">$178,134 (general); $356,268 (medicine, dentistry, veterinary)</td>
                        <td className="px-6 py-4">20% loan fee for undergraduate courses</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">VET Student Loans</td>
                        <td className="px-6 py-4">Vocational education &amp; training (diploma level and above)</td>
                        <td className="px-6 py-4">$5,000 &ndash; $15,000 depending on course</td>
                        <td className="px-6 py-4">20% loan fee</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">SA-HELP</td>
                        <td className="px-6 py-4">Student services and amenities fees at universities</td>
                        <td className="px-6 py-4">Capped at $326 per year</td>
                        <td className="px-6 py-4 font-semibold">None</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                All 4 loan types share the same repayment thresholds, marginal rates, and indexation rules. The ATO combines your HECS-HELP, FEE-HELP, VET Student Loan, and SA-HELP debts into a single &ldquo;HELP balance&rdquo; for repayment purposes. A graduate with a $20,000 HECS-HELP debt and a $5,000 SA-HELP debt makes repayments against the combined <strong>$25,000</strong> total.
              </p>
              <p>
                FEE-HELP carries a <strong>20% loan fee</strong> on undergraduate courses, meaning a $10,000 tuition charge results in a $12,000 debt. This fee does not apply to postgraduate courses, HECS-HELP, or SA-HELP. VET Student Loans also attract the 20% fee, capping the effective debt at <strong>$6,000 &ndash; $18,000</strong> depending on the course band.
              </p>
            </section>

            {/* CONTEXT BORDER */}

            {/* SECTION 9: What Changed in FY2025-26? */}
            <section id="whats-changed">
              <h2>What Changed in FY2025-26?</h2>
              <p>
                FY2025-26 introduced <strong>3 structural reforms</strong> to Australian study loans: the marginal repayment system, a raised minimum threshold, and permanently capped indexation.
              </p>
              <p>
                These changes stem from the <em>Universities Accord (Student Support and Other Measures) Bill 2024</em>, which passed Parliament following the Australian Universities Accord Final Report. The reforms represent the most significant overhaul of the student loan system since HECS was introduced in 1989. They followed the separately legislated <Link href="/news/hecs-20-percent-cut-status/">20% HECS debt cut</Link>, a one-off reduction applied to outstanding HELP balances.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Reform</th>
                        <th className="px-6 py-4">Before (FY2024-25)</th>
                        <th className="px-6 py-4">After (FY2025-26)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-medium">Repayment structure</td>
                        <td className="px-6 py-4">Flat rate on entire income</td>
                        <td className="px-6 py-4 font-semibold">Marginal rate on income within each band</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Minimum threshold</td>
                        <td className="px-6 py-4">{formatAUD(HECS_HELP.previousThreshold)}</td>
                        <td className="px-6 py-4 font-semibold">{formatAUD(HECS_HELP.minimumThreshold)}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Number of repayment tiers</td>
                        <td className="px-6 py-4">12 tiers</td>
                        <td className="px-6 py-4 font-semibold">4 bands</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Indexation cap</td>
                        <td className="px-6 py-4">CPI only (no cap)</td>
                        <td className="px-6 py-4 font-semibold">Lower of CPI or WPI</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Indexation backdating</td>
                        <td className="px-6 py-4">N/A</td>
                        <td className="px-6 py-4 font-semibold">Applied retrospectively to 1 June 2023</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The combined effect of these changes is that a graduate earning $80,000 saves approximately <strong>$1,650 per year</strong> in compulsory repayments compared to the old system. Graduates earning below {formatAUD(HECS_HELP.minimumThreshold)} &mdash; previously subject to repayments under the lower threshold &mdash; now pay <strong>nothing</strong>.
              </p>
              <p>
                These reforms also affect how HECS interacts with other elements of your pay. The reduced HECS withholding increases your net pay, which in turn changes your effective marginal tax rate calculations. Use our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> alongside the <Link href="/hecs-help-calculator/">HECS-HELP Calculator</Link> for a combined view.
              </p>
            </section>

            {/* SECTION 10: Key Dates & Deadlines */}
            <section id="key-dates">
              <h2>What Are the Key HECS-HELP Dates and Deadlines?</h2>
              <p>
                The most critical HECS date is <strong>1 June</strong>, when annual indexation is applied to all outstanding balances. Missing this date with a voluntary payment means your entire balance is indexed before any reduction.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Event</th>
                        <th className="px-6 py-4">Action Required</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-4 font-medium">1 July 2025</td><td className="px-6 py-4">New financial year begins; new marginal repayment system takes effect</td><td className="px-6 py-4">Confirm TFN declaration with employer</td></tr>
                      <tr><td className="px-6 py-4 font-medium">31 October 2025</td><td className="px-6 py-4">Tax return due for FY2024-25 (self-lodgers)</td><td className="px-6 py-4">Lodge return; ATO reconciles HECS</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Before 1 June 2026</td><td className="px-6 py-4">Last day for voluntary repayments to reduce balance before indexation</td><td className="px-6 py-4">Make BPAY payment to ATO</td></tr>
                      <tr><td className="px-6 py-4 font-medium">1 June 2026</td><td className="px-6 py-4">Annual indexation applied to all HELP balances</td><td className="px-6 py-4">No action &mdash; automatic</td></tr>
                      <tr><td className="px-6 py-4 font-medium">30 June 2026</td><td className="px-6 py-4">FY2025-26 ends</td><td className="px-6 py-4">Gather payment summaries for tax return</td></tr>
                      <tr><td className="px-6 py-4 font-medium">15 May 2027 (approx.)</td><td className="px-6 py-4">Tax agent lodgement deadline for FY2025-26</td><td className="px-6 py-4">Lodge via registered tax agent</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Census dates for university enrolment vary by institution and teaching period. Students who withdraw before the census date incur no HECS liability. Withdrawing <em>after</em> the census date means the full subject fee is added to your HELP balance. Check your university&apos;s academic calendar for specific census dates each semester.
              </p>
            </section>

            {/* SECTION 11: Related Resources */}
            <section id="related-resources">
              <h2>Related Resources</h2>
              <p>
                HECS repayments are one component of your total pay deductions. These Australian tax calculators and guides provide the full picture of your after-tax income, superannuation, and employer obligations.
              </p>
              <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/hecs-help-calculator/" className="group flex items-center justify-between p-4 rounded-xl bg-sandstone border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                  <div>
                    <span className="text-sm font-bold text-navy group-hover:text-eucalyptus-dark block">HECS-HELP Calculator</span>
                    <span className="text-xs text-warmgray">Calculate your exact repayment under the new marginal system</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus flex-shrink-0" />
                </Link>
                <Link href="/take-home-pay-calculator/" className="group flex items-center justify-between p-4 rounded-xl bg-sandstone border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                  <div>
                    <span className="text-sm font-bold text-navy group-hover:text-eucalyptus-dark block">Take-Home Pay Calculator</span>
                    <span className="text-xs text-warmgray">See your net pay after tax, HECS, Medicare, and super</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus flex-shrink-0" />
                </Link>
                <Link href="/superannuation-calculator/" className="group flex items-center justify-between p-4 rounded-xl bg-sandstone border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                  <div>
                    <span className="text-sm font-bold text-navy group-hover:text-eucalyptus-dark block">Superannuation Calculator</span>
                    <span className="text-xs text-warmgray">Check your employer SG rate contribution at 12% for FY2025-26</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus flex-shrink-0" />
                </Link>
                <Link href="/income-tax-calculator/" className="group flex items-center justify-between p-4 rounded-xl bg-sandstone border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                  <div>
                    <span className="text-sm font-bold text-navy group-hover:text-eucalyptus-dark block">Income Tax Calculator</span>
                    <span className="text-xs text-warmgray">Calculate income tax brackets and marginal rates for FY2025-26</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus flex-shrink-0" />
                </Link>
                <Link href="/salary-sacrifice-calculator/" className="group flex items-center justify-between p-4 rounded-xl bg-sandstone border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                  <div>
                    <span className="text-sm font-bold text-navy group-hover:text-eucalyptus-dark block">Salary Sacrifice Calculator</span>
                    <span className="text-xs text-warmgray">Model pre-tax contributions and their impact on HECS and take-home pay</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus flex-shrink-0" />
                </Link>
                <Link href="/tax-brackets/" className="group flex items-center justify-between p-4 rounded-xl bg-sandstone border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                  <div>
                    <span className="text-sm font-bold text-navy group-hover:text-eucalyptus-dark block">Australian Tax Brackets Guide</span>
                    <span className="text-xs text-warmgray">Full income tax bracket table for FY2025-26</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus flex-shrink-0" />
                </Link>
              </div>
            </section>

            {/* SECTION 12: FAQs */}
            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="what-is-hecs" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is HECS-HELP?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    HECS-HELP is the Australian Government&apos;s income-contingent loan scheme for Commonwealth-supported university students. It covers tuition fees with no upfront cost. Repayments are compulsory once your Repayment Income exceeds <strong>$69,528</strong> in FY2026-27. The debt carries no commercial interest &mdash; only annual indexation at the lower of CPI or WPI.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="new-system" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the new HECS marginal repayment system?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Starting from 1 July 2025, HECS-HELP repayments transition from a &ldquo;flat rate&rdquo; cliff system to a &ldquo;marginal rate&rdquo; system. You only apply the 15% repayment on the portion of your income that falls <em>above</em> the repayment threshold ($69,528 in FY2026-27), keeping more money in your standard pay packet compared to the old rules.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="index" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How is HECS-HELP indexation calculated?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The government has capped the indexation rate for student loans to the lower of either the Consumer Price Index (CPI) or the Wage Price Index (WPI). This means your debt never escalates faster than the current growth of average wages. The rate is applied to your outstanding balance on <strong>1 June</strong> each year. For 2025, the expected indexation rate is approximately <strong>2.4%</strong>.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="timing" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">When is the best time to make a voluntary HECS repayment?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    If you&apos;re going to make a voluntary payment, do it before <strong>1 June</strong> each year. That&apos;s when annual indexation is applied, so paying down your balance beforehand reduces the amount that gets indexed. There&apos;s currently no bonus or discount for voluntary repayments &mdash; the sole benefit is reducing your principal faster.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="write-off" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is my HECS debt ever written off?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Your HECS-HELP debt is written off if you pass away or become permanently incapacitated. It&apos;s also discharged through bankruptcy in some cases. However, HECS debts are <strong>not</strong> written off when you reach a certain age &mdash; the obligation remains for life unless one of the discharge conditions is met. If your income stays below the $69,528 threshold (FY2026-27), you simply don&apos;t make any compulsory repayments.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="repayment-income" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What counts as &ldquo;Repayment Income&rdquo; for HECS?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Repayment Income (RI) is broader than taxable income. It includes your taxable income, total net investment losses (including negative gearing), any reportable fringe benefits amounts, and reportable superannuation contributions above the standard employer SG rate of 12%. This prevents high earners from sheltering income to avoid HECS obligations. The ATO calculates your RI automatically when you lodge your tax return.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="multiple-jobs" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How does HECS work if I have multiple jobs?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Each employer withholds HECS independently based on the income they pay you. At tax time, the ATO combines your total Repayment Income from all sources and calculates the actual repayment owed. If combined income exceeds <strong>$69,528</strong> but individual jobs fall below, you may face an unexpected HECS bill. Ticking the HELP debt box on all TFN declarations helps minimise end-of-year surprises.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="overseas" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do I still pay HECS if I move overseas?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Australian residents living and working overseas with a HELP debt must report their worldwide income to the ATO if it exceeds the minimum repayment threshold of <strong>$69,528</strong> (FY2026-27). The ATO requires overseas debtors to lodge an &ldquo;overseas levy return&rdquo; annually. Failing to lodge can result in penalties and interest on unpaid amounts. Your debt continues to be indexed on 1 June regardless of your location.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="salary-sacrifice" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does salary sacrifice reduce my HECS repayment?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    <strong>No.</strong> Salary sacrifice into superannuation reduces your taxable income but <em>increases</em> your reportable superannuation contributions. Since Repayment Income includes reportable super contributions, salary sacrifice does not reduce your HECS obligation. The ATO designed RI specifically to prevent this strategy. Use our <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> to model the actual impact.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tax-deductible" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Are HECS repayments tax-deductible?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    <strong>No.</strong> HECS-HELP repayments &mdash; whether compulsory or voluntary &mdash; are not tax-deductible. They are treated as a repayment of a government loan, not an education expense. Self-education expenses related to your current employment may be deductible separately, but the HECS repayment itself is not claimable on your tax return.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="fee-help-difference" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the difference between HECS-HELP and FEE-HELP?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    HECS-HELP covers tuition for Commonwealth-supported students at subsidised rates with <strong>no loan fee</strong>. FEE-HELP covers full-fee-paying students and carries a <strong>20% loan fee</strong> on undergraduate courses (e.g., a $10,000 fee becomes a $12,000 debt). Both use the same repayment thresholds, marginal rates, and indexation rules. FEE-HELP has a lifetime borrowing limit of <strong>$178,134</strong> (or $356,268 for medicine, dentistry, and veterinary science).
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="check-balance" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How do I check my HECS-HELP balance?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Log in to your <strong>myGov account</strong> and navigate to the ATO section. Select &ldquo;Tax &gt; Study and training loans&rdquo; to view your current HELP balance, accumulated debt, repayments made, and indexation applied. Your balance is updated after your tax return is assessed each year. You can also call the ATO on <strong>13 28 61</strong> during business hours.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>Calculations and threshold information are modelled strictly on the incoming Universities Accord (Student Support and Other Measures) Bill parameters passing the threshold from roughly $54k to exactly $67k with a 15% marginal application. Indexation data sourced from the Department of Education and ATO published rates. Subject to continuous ATO legislative tracking.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("hecs-help-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Calculators</h3>
                  <div className="space-y-3">
                    <Link href="/hecs-help-calculator/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">HECS Repayment Calc</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/take-home-pay-calculator/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Take-Home Pay Calc</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Want to see your gap?</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Calculate instantly how much standard HECS is ripped out of your pay packet and what your true net take-home is.</p>
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
