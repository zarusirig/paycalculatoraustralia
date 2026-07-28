"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, SUPER_GUARANTEE, formatAUD } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Salary sacrificing for employees", url: "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-as-an-employee/salary-sacrificing-for-employees", publisher: SOURCES.ato.name },
  { title: "Fringe benefits tax (FBT)", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax", publisher: SOURCES.ato.name },
  { title: "Concessional contributions cap", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions/concessional-contributions-cap", publisher: SOURCES.ato.name },
  { title: "Division 293 tax", url: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/contributions-caps", publisher: SOURCES.ato.name },
];

export default function SalarySacrificeGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Salary Sacrifice Guide</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Salary Sacrifice Guide — How It Works in Australia
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Discover how entering into a salary packaging arrangement can legally reduce your taxable income, lower your PAYG withholding, and boost your long-term wealth.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="what-is">
              <h2>What Is Salary Sacrifice?</h2>
              <p>
                Salary sacrifice is a formal arrangement between an employee and employer where the employee agrees to receive a lower pre-tax salary in exchange for benefits of equivalent value. The Australian Taxation Office permits salary sacrificing — also called &quot;salary packaging&quot; — under the Income Tax Assessment Act 1997.
              </p>
              <p>
                By redirecting a portion of gross pay into benefits such as superannuation contributions, novated car leases, or portable electronic devices, the employee&apos;s assessable income decreases. A lower assessable income produces a lower income tax liability and reduced PAYG withholding from each pay cycle. The arrangement applies only to <strong>future</strong> earnings — employers cannot retrospectively sacrifice wages already earned.
              </p>
              <p>
                Salary sacrifice is available to full-time, part-time, and fixed-term contract employees across all industries. Casual employees are technically eligible, but few employers extend packaging arrangements to casual staff. Not-for-profit organisations, public hospitals, and charities offer the most generous packaging options because of FBT exemptions specific to those sectors.
              </p>
              <p>
                The tax savings from salary sacrifice depend on the employee&apos;s marginal tax rate. An employee earning <strong>$120,000</strong> in the 30% income tax bracket saves <strong>$0.30 in income tax for every $1.00</strong> sacrificed into super. Use our <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> to model the exact dollar impact at your specific salary level.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Interactive Tax Minimization Matrix</h3>
                    <p className="text-navy text-sm mb-3">Want to see the exact dollar amount of income tax you can save by sacrificing part of your wages?</p>
                    <Link href="/salary-sacrifice-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Use our Salary Sacrifice Calculator <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section id="how-it-works">
              <h2>How Does Salary Sacrifice Work?</h2>
              <p>
                Salary sacrifice works by diverting a nominated amount from an employee&apos;s gross pay to a benefit before PAYG income tax is calculated on the remaining salary. The process follows a specific sequence governed by the ATO and the employment contract.
              </p>

              <h3>Step-by-Step Process</h3>
              <ol>
                <li><strong>Agree with your employer</strong> — Confirm the arrangement in writing before the pay period begins. The agreement covers the benefit type, dollar amount per pay cycle, and start date.</li>
                <li><strong>Employer adjusts payroll</strong> — The payroll system reduces your gross salary by the sacrificed amount. Your employer directs that portion to the benefit provider (super fund, leasing company, or device supplier).</li>
                <li><strong>PAYG recalculation</strong> — Your employer calculates income tax on the <strong>reduced</strong> gross salary. Lower assessable income produces a lower PAYG withholding amount each pay period.</li>
                <li><strong>Payment summary reflects changes</strong> — At the end of the financial year, your income statement shows the reduced taxable income. Reportable employer super contributions or reportable fringe benefits appear as separate line items.</li>
                <li><strong>Lodge your tax return</strong> — Report the lower taxable income. The ATO uses your &quot;Repayment Income&quot; (which adds back reportable items) only for means-tested obligations like HECS-HELP and the Medicare Levy Surcharge.</li>
              </ol>
              <p>
                The entire salary sacrifice arrangement operates through payroll — the employee does not handle the funds directly. Your employer acts as the intermediary between you and the benefit provider. Check your take-home pay impact using our <Link href="/">Australian Tax Calculator</Link> before committing to an amount.
              </p>
            </section>

            <section id="tax-benefits">
              <h2>What Are the Tax Benefits of Salary Sacrifice?</h2>
              <p>
                The primary tax benefit is a reduction in assessable income, which lowers the amount of income tax payable at your marginal rate. For salary sacrificed into super, the contribution is taxed at a flat <strong>15%</strong> inside the super fund instead of the employee&apos;s marginal rate of 30%, 37%, or 45%.
              </p>

              <h3>Worked Example: $110,000 Salary With and Without Sacrifice</h3>
              <p>
                The following comparison table shows the FY2025-26 tax outcome for an employee earning $110,000 who salary sacrifices <strong>$10,000 per year</strong> into superannuation, versus taking the full salary as cash.
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <table className="min-w-full text-sm border border-sandstone-dark/20 rounded-lg">
                  <thead>
                    <tr className="bg-sandstone">
                      <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Component</th>
                      <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">No Sacrifice</th>
                      <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">$10,000 Sacrifice</th>
                      <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-sandstone-dark/10">
                      <td className="p-3 text-navy">Gross salary</td>
                      <td className="p-3 text-right text-navy">$110,000</td>
                      <td className="p-3 text-right text-navy">$110,000</td>
                      <td className="p-3 text-right text-navy">—</td>
                    </tr>
                    <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                      <td className="p-3 text-navy">Salary sacrifice to super</td>
                      <td className="p-3 text-right text-navy">$0</td>
                      <td className="p-3 text-right text-navy">$10,000</td>
                      <td className="p-3 text-right text-navy">−$10,000</td>
                    </tr>
                    <tr className="border-b border-sandstone-dark/10">
                      <td className="p-3 text-navy">Taxable income</td>
                      <td className="p-3 text-right text-navy">$110,000</td>
                      <td className="p-3 text-right text-navy">$100,000</td>
                      <td className="p-3 text-right text-navy">−$10,000</td>
                    </tr>
                    <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                      <td className="p-3 text-navy">Income tax (incl. LITO)</td>
                      <td className="p-3 text-right text-navy">$23,788</td>
                      <td className="p-3 text-right text-navy">$20,788</td>
                      <td className="p-3 text-right text-eucalyptus-dark font-semibold">−$3,000</td>
                    </tr>
                    <tr className="border-b border-sandstone-dark/10">
                      <td className="p-3 text-navy">Medicare levy (2%)</td>
                      <td className="p-3 text-right text-navy">$2,200</td>
                      <td className="p-3 text-right text-navy">$2,000</td>
                      <td className="p-3 text-right text-eucalyptus-dark font-semibold">−$200</td>
                    </tr>
                    <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                      <td className="p-3 text-navy">Super contributions tax (15%)</td>
                      <td className="p-3 text-right text-navy">$0</td>
                      <td className="p-3 text-right text-navy">$1,500</td>
                      <td className="p-3 text-right text-ochre font-semibold">+$1,500</td>
                    </tr>
                    <tr className="bg-eucalyptus-light/30 font-semibold">
                      <td className="p-3 text-navy">Net tax saving</td>
                      <td className="p-3 text-right text-navy">—</td>
                      <td className="p-3 text-right text-navy">—</td>
                      <td className="p-3 text-right text-eucalyptus-dark">$1,700</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                The employee saves <strong>$3,200</strong> in income tax and Medicare levy combined. After deducting the <strong>$1,500</strong> contributions tax paid inside the super fund, the net tax benefit is <strong>$1,700 per year</strong>. The sacrificed $10,000 lands in the super fund as $8,500 (after 15% tax), rather than arriving in the employee&apos;s bank account as approximately $6,800 (after 32% combined marginal tax and Medicare levy). That is an extra <strong>$1,700 toward retirement</strong> for every $10,000 sacrificed.
              </p>
              <p>
                Employees in the 37% income tax bracket (taxable income between $135,001 and $190,000) save even more — <strong>$2,200 per $10,000</strong> sacrificed. Those in the top 45% bracket save <strong>$3,000 per $10,000</strong>. Review the income tax brackets on our <Link href="/tax-brackets/">Income Tax Brackets</Link> page to identify your marginal rate.
              </p>
            </section>

            <section id="contribution-caps">
              <h2>What Are the Contribution Caps?</h2>
              <p>
                The concessional contributions cap for FY2026-27 is <strong>$32,500 per person per financial year</strong>. This single cap includes employer SG contributions, salary sacrifice contributions, and any personal deductible contributions combined.
              </p>

              <h3>How the $32,500 Cap Works in Practice</h3>
              <p>
                An employee earning $120,000 receives <strong>$14,400</strong> in employer SG contributions (12% of $120,000). The remaining cap space available for salary sacrifice is <strong>$18,100</strong> ($32,500 minus $14,400). Contributions exceeding the $32,500 cap are taxed at the individual&apos;s marginal rate instead of 15%, eliminating the tax advantage entirely.
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <table className="min-w-full text-sm border border-sandstone-dark/20 rounded-lg">
                  <thead>
                    <tr className="bg-sandstone">
                      <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Salary</th>
                      <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Employer SG (12%)</th>
                      <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Cap Space Remaining</th>
                      <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Max Sacrifice to Super</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-sandstone-dark/10">
                      <td className="p-3 text-navy">$60,000</td>
                      <td className="p-3 text-right text-navy">$7,200</td>
                      <td className="p-3 text-right text-navy">$22,800</td>
                      <td className="p-3 text-right text-navy font-semibold">$22,800</td>
                    </tr>
                    <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                      <td className="p-3 text-navy">$90,000</td>
                      <td className="p-3 text-right text-navy">$10,800</td>
                      <td className="p-3 text-right text-navy">$19,200</td>
                      <td className="p-3 text-right text-navy font-semibold">$19,200</td>
                    </tr>
                    <tr className="border-b border-sandstone-dark/10">
                      <td className="p-3 text-navy">$120,000</td>
                      <td className="p-3 text-right text-navy">$14,400</td>
                      <td className="p-3 text-right text-navy">$15,600</td>
                      <td className="p-3 text-right text-navy font-semibold">$15,600</td>
                    </tr>
                    <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                      <td className="p-3 text-navy">$150,000</td>
                      <td className="p-3 text-right text-navy">$18,000</td>
                      <td className="p-3 text-right text-navy">$12,000</td>
                      <td className="p-3 text-right text-navy font-semibold">$12,000</td>
                    </tr>
                    <tr className="border-b border-sandstone-dark/10">
                      <td className="p-3 text-navy">$200,000</td>
                      <td className="p-3 text-right text-navy">$24,000</td>
                      <td className="p-3 text-right text-navy">$6,000</td>
                      <td className="p-3 text-right text-navy font-semibold">$6,000</td>
                    </tr>
                    <tr className="bg-sandstone/30">
                      <td className="p-3 text-navy">$250,000+</td>
                      <td className="p-3 text-right text-navy">$30,000+</td>
                      <td className="p-3 text-right text-navy">$0</td>
                      <td className="p-3 text-right text-navy font-semibold">$0</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>Carry-Forward (Catch-Up) Contributions</h3>
              <p>
                Employees with a total super balance below <strong>$500,000</strong> on 30 June of the previous financial year can carry forward unused concessional cap space from up to 5 prior financial years. An employee who used only $20,000 of the $27,500 cap in FY2023-24 has $7,500 in unused cap space available to carry forward. This provision allows larger one-off salary sacrifice contributions in years when cash flow permits.
              </p>

              <h3>Division 293 Tax for High Earners</h3>
              <p>
                &quot;Division 293 tax&quot; is an additional <strong>15%</strong> tax on concessional super contributions for individuals whose income plus concessional contributions exceed <strong>$250,000</strong>. The tax effectively doubles the contributions tax rate from 15% to <strong>30%</strong> on the portion above the threshold.
              </p>
              <p>
                An employee earning $240,000 who makes $20,000 in concessional contributions (including employer SG and salary sacrifice) has a combined total of $260,000. Division 293 applies to the <strong>$10,000</strong> above the threshold, costing an additional <strong>$1,500</strong>. Even at an effective 30% super tax rate, the saving compared to the top marginal rate of 45% plus the 2% Medicare levy (totalling 47%) remains <strong>$1,700 per $10,000</strong>.
              </p>
              <p>
                The ATO issues Division 293 assessments separately after the end of the financial year. The employee can pay the amount from personal funds or elect to release the amount from their super fund. Use our <Link href="/superannuation-calculator/">Superannuation Calculator</Link> to model the long-term growth impact of Division 293 on your retirement balance.
              </p>
            </section>

            <section id="available-items">
              <h2>What Items Are Available for Salary Sacrifice?</h2>
              <p>
                Salary sacrifice benefits fall into 3 categories: superannuation contributions, FBT-exempt items, and FBT-liable items. The tax outcome differs significantly between categories.
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <table className="min-w-full text-sm border border-sandstone-dark/20 rounded-lg">
                  <thead>
                    <tr className="bg-sandstone">
                      <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Benefit</th>
                      <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">FBT Status</th>
                      <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Tax Outcome</th>
                      <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Cap / Limit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-sandstone-dark/10">
                      <td className="p-3 text-navy font-medium">Super contributions</td>
                      <td className="p-3 text-navy">Exempt</td>
                      <td className="p-3 text-navy">Taxed at 15% in fund</td>
                      <td className="p-3 text-navy">$30,000/year concessional cap</td>
                    </tr>
                    <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                      <td className="p-3 text-navy font-medium">Electric vehicle (novated lease)</td>
                      <td className="p-3 text-navy">Exempt (below LCT threshold)</td>
                      <td className="p-3 text-navy">No FBT, no income tax on sacrificed amount</td>
                      <td className="p-3 text-navy">Vehicle price below $91,387 (FY2025-26 LCT threshold for fuel-efficient vehicles)</td>
                    </tr>
                    <tr className="border-b border-sandstone-dark/10">
                      <td className="p-3 text-navy font-medium">Laptop / tablet (work use)</td>
                      <td className="p-3 text-navy">Exempt (if primarily for work)</td>
                      <td className="p-3 text-navy">No FBT, reduces taxable income</td>
                      <td className="p-3 text-navy">1 item per FBT year</td>
                    </tr>
                    <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                      <td className="p-3 text-navy font-medium">Mobile phone (work use)</td>
                      <td className="p-3 text-navy">Exempt (if primarily for work)</td>
                      <td className="p-3 text-navy">No FBT, reduces taxable income</td>
                      <td className="p-3 text-navy">1 item per FBT year</td>
                    </tr>
                    <tr className="border-b border-sandstone-dark/10">
                      <td className="p-3 text-navy font-medium">NFP meal entertainment</td>
                      <td className="p-3 text-navy">Exempt (NFP employers only)</td>
                      <td className="p-3 text-navy">Reduces taxable income</td>
                      <td className="p-3 text-navy">$2,650 grossed-up cap</td>
                    </tr>
                    <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                      <td className="p-3 text-navy font-medium">NFP living expenses</td>
                      <td className="p-3 text-navy">Exempt (NFP employers only)</td>
                      <td className="p-3 text-navy">Reduces taxable income</td>
                      <td className="p-3 text-navy">$15,900 or $30,000 depending on employer type</td>
                    </tr>
                    <tr className="border-b border-sandstone-dark/10">
                      <td className="p-3 text-navy font-medium">ICE vehicle (novated lease)</td>
                      <td className="p-3 text-navy">Liable</td>
                      <td className="p-3 text-navy">FBT at 47% — benefit reduced or eliminated</td>
                      <td className="p-3 text-navy">No cap, but FBT erodes savings</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                The &quot;Electric Car Discount&quot; (introduced 1 July 2022) makes battery electric vehicles, hydrogen fuel cell vehicles, and plug-in hybrids first held and used before 1 April 2025 FBT-exempt under a novated lease. This exemption turns EV salary sacrifice into one of the most tax-effective packaging arrangements available in Australia. Learn more about vehicle packaging in our <Link href="/novated-lease-guide/">Novated Lease Guide</Link>.
              </p>
            </section>

            <section id="who-benefits">
              <h2>Who Benefits Most from Salary Sacrifice?</h2>
              <p>
                Employees in higher income tax brackets benefit the most because the gap between their marginal tax rate and the 15% super contributions tax rate is largest. A taxpayer in the 45% bracket saves <strong>$0.30 per dollar</strong> sacrificed, while a taxpayer in the 16% bracket saves only <strong>$0.01 per dollar</strong>.
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <table className="min-w-full text-sm border border-sandstone-dark/20 rounded-lg">
                  <thead>
                    <tr className="bg-sandstone">
                      <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Income Range</th>
                      <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Marginal Rate</th>
                      <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Tax Saving per $1 Sacrificed</th>
                      <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-sandstone-dark/10">
                      <td className="p-3 text-navy">$0–$18,200</td>
                      <td className="p-3 text-right text-navy">0%</td>
                      <td className="p-3 text-right text-navy">−$0.15 (worse off)</td>
                      <td className="p-3 text-ochre font-medium">Not recommended</td>
                    </tr>
                    <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                      <td className="p-3 text-navy">$18,201–$45,000</td>
                      <td className="p-3 text-right text-navy">16%</td>
                      <td className="p-3 text-right text-navy">$0.01</td>
                      <td className="p-3 text-ochre font-medium">Minimal benefit</td>
                    </tr>
                    <tr className="border-b border-sandstone-dark/10">
                      <td className="p-3 text-navy">$45,001–$135,000</td>
                      <td className="p-3 text-right text-navy">30%</td>
                      <td className="p-3 text-right text-navy">$0.15</td>
                      <td className="p-3 text-eucalyptus-dark font-medium">Worthwhile</td>
                    </tr>
                    <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                      <td className="p-3 text-navy">$135,001–$190,000</td>
                      <td className="p-3 text-right text-navy">37%</td>
                      <td className="p-3 text-right text-navy">$0.22</td>
                      <td className="p-3 text-eucalyptus-dark font-medium">Highly beneficial</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-navy">$190,001+</td>
                      <td className="p-3 text-right text-navy">45%</td>
                      <td className="p-3 text-right text-navy">$0.30</td>
                      <td className="p-3 text-eucalyptus-dark font-medium">Maximum benefit</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                Three groups benefit the most from salary sacrifice arrangements:
              </p>
              <ul>
                <li><strong>High-income earners ($135,000+)</strong> — The 37% and 45% marginal rates create the largest gap above the 15% super tax rate, producing savings of $2,200 to $3,000 per $10,000 sacrificed</li>
                <li><strong>Employees approaching retirement (age 50–67)</strong> — Carry-forward rules allow lump-sum catch-up contributions to build super balances before retirement</li>
                <li><strong>Not-for-profit sector workers</strong> — Access to FBT-exempt packaging of everyday living expenses (rent, mortgage, groceries) up to $15,900 or $30,000 per year produces savings even at lower income levels</li>
              </ul>
              <p>
                Employees earning below the tax-free threshold of <strong>$18,200</strong> are worse off salary sacrificing into super because the 15% contributions tax exceeds their 0% income tax rate. Employees in the 16% bracket ($18,201–$45,000) receive only marginal benefit and are better served by claiming the <Link href="/low-income-tax-offset/">Low Income Tax Offset</Link> instead.
              </p>
            </section>

            <section id="risks-downsides">
              <h2>What Are the Risks and Downsides?</h2>
              <p>
                Salary sacrifice reduces take-home pay immediately. The tax savings are real, but the trade-off is lower disposable income each pay cycle. Employees must assess whether the reduced cash flow is sustainable before committing.
              </p>

              <div className="grid md:grid-cols-2 gap-4 not-prose mb-6 mt-4">
                <Card className="bg-eucalyptus-light/30 border-sandstone-dark/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-eucalyptus-dark mb-2">The Pros</h4>
                    <ul className="list-disc list-inside text-sm text-eucalyptus-dark space-y-1">
                      <li>Legally reduces your taxable income.</li>
                      <li>Turbocharges your retirement savings.</li>
                      <li>Can make expensive EVs surprisingly affordable.</li>
                      <li>Reduces your PAYG withholding immediately.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-sandstone border-sandstone-dark/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-ochre mb-2">The Cons</h4>
                    <ul className="list-disc list-inside text-sm text-ochre space-y-1">
                      <li>Reduces your immediately available cash flow.</li>
                      <li>Super contributions are locked away until age 60.</li>
                      <li>Does not reduce calculations for HECS repayments.</li>
                      <li>Subject to strict $30k concessional caps.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <p>
                Seven specific risks require consideration before entering a salary sacrifice arrangement:
              </p>
              <ol>
                <li><strong>Reduced cash flow</strong> — Every dollar sacrificed is a dollar removed from your take-home pay. Budget accordingly using a fortnightly or monthly breakdown from our <Link href="/">Pay Calculator</Link></li>
                <li><strong>Super preservation</strong> — Salary sacrificed into super is locked until a condition of release is met, typically reaching age 60 and retiring. Early access is restricted to severe financial hardship, terminal illness, or compassionate grounds</li>
                <li><strong>HECS-HELP is unaffected</strong> — The ATO calculates HECS repayments using &quot;Repayment Income&quot; which adds back reportable super contributions and reportable fringe benefits. Salary sacrifice does not reduce HECS obligations. See our <Link href="/hecs-help-guide/">HECS-HELP Guide</Link> for the full repayment structure</li>
                <li><strong>Exceeding the concessional cap</strong> — Contributions beyond $30,000 (including employer SG) are taxed at the employee&apos;s marginal rate plus an excess concessional contributions charge</li>
                <li><strong>Impact on government benefits</strong> — Centrelink assessments may use adjusted taxable income, which includes reportable super contributions, potentially reducing eligibility for Family Tax Benefit, childcare subsidies, or other income-tested payments</li>
                <li><strong>Employer insolvency risk</strong> — If your employer becomes insolvent before remitting salary sacrifice contributions to your super fund, those contributions may be treated as unpaid wages</li>
                <li><strong>No retrospective changes</strong> — Once a pay period passes, the sacrifice cannot be reversed. Only future pay periods can be adjusted</li>
              </ol>
            </section>

            <section id="how-to-set-up">
              <h2>Step-by-Step: How to Set Up Salary Sacrifice</h2>
              <p>
                Setting up a salary sacrifice arrangement requires a written agreement with your employer before the relevant pay period. The process takes <strong>1 to 4 weeks</strong> depending on your employer&apos;s payroll cycle and approval process.
              </p>
              <ol>
                <li><strong>Calculate your cap space</strong> — Check your current employer SG contributions (12% of your gross salary for FY2025-26) and subtract from the $30,000 concessional cap. The result is your maximum sacrifice amount for super</li>
                <li><strong>Determine the right amount</strong> — Model the impact on your take-home pay using the <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link>. Ensure the reduced fortnightly pay covers rent, mortgage repayments, groceries, and other essential expenses</li>
                <li><strong>Request the arrangement in writing</strong> — Submit a written request to your employer or HR department specifying the dollar amount per pay period, the benefit type (super, novated lease, device), and the desired start date</li>
                <li><strong>Employer approves and adjusts payroll</strong> — Your employer confirms the arrangement and updates the payroll system. The first adjusted pay slip reflects the lower gross salary and reduced PAYG withholding</li>
                <li><strong>Verify your pay slip</strong> — Check that the sacrificed amount, adjusted gross income, reduced PAYG, and super contribution match the agreed figures. Report discrepancies to payroll immediately</li>
                <li><strong>Review annually</strong> — Reassess the arrangement at the start of each financial year. Changes in salary, tax brackets, or the concessional cap (indexed to AWOTE in $2,500 increments) may require adjustment</li>
              </ol>
            </section>

            <section id="fbt-implications">
              <h2>How Does Fringe Benefits Tax Affect Salary Sacrifice?</h2>
              <p>
                Fringe Benefits Tax is a <strong>47%</strong> tax imposed on employers who provide non-cash benefits to employees. FBT applies to most salary sacrifice items except superannuation, certain portable electronic devices used primarily for work, and eligible electric vehicles.
              </p>
              <p>
                When an item attracts FBT, the employer bears the tax liability. In practice, most employers pass the FBT cost directly to the employee through payroll adjustments, eliminating any net tax benefit. An employee salary sacrificing a $40,000 internal combustion engine (ICE) vehicle through a novated lease faces approximately <strong>$18,800 in FBT</strong> annually, wiping out the income tax saving entirely.
              </p>
              <p>
                FBT-exempt items deliver the full tax benefit because no additional tax applies. The 3 most common FBT-exempt salary sacrifice categories are:
              </p>
              <ul>
                <li><strong>Superannuation contributions</strong> — Exempt from FBT, taxed at 15% inside the fund</li>
                <li><strong>Eligible electric vehicles</strong> — FBT-exempt under the Electric Car Discount when the vehicle value is below the fuel-efficient luxury car tax threshold of $91,387</li>
                <li><strong>Portable electronic devices</strong> — Laptops, tablets, and mobile phones used primarily for employment duties (limited to 1 device per FBT year per category)</li>
              </ul>
              <p>
                Read the full breakdown of FBT categories, rates, and exemptions on our <Link href="/fringe-benefits-tax/">Fringe Benefits Tax Guide</Link>.
              </p>
            </section>

            {/* --- CONTEXT BORDER --- */}

            <section id="fy2025-26-changes">
              <h2>What Changed for Salary Sacrifice in FY2025-26?</h2>
              <p>
                Three legislative changes in the 2025-26 financial year directly affect salary sacrifice arrangements: a higher SG rate, the continuation of the Stage 3 tax bracket structure, and maintained contribution caps.
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <table className="min-w-full text-sm border border-sandstone-dark/20 rounded-lg">
                  <thead>
                    <tr className="bg-sandstone">
                      <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Change</th>
                      <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">FY2024-25</th>
                      <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">FY2025-26</th>
                      <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Impact on Sacrifice</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-sandstone-dark/10">
                      <td className="p-3 text-navy font-medium">SG rate</td>
                      <td className="p-3 text-navy">11.5%</td>
                      <td className="p-3 text-navy">12%</td>
                      <td className="p-3 text-navy">Higher SG reduces available cap space by $500 per $100,000 salary</td>
                    </tr>
                    <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                      <td className="p-3 text-navy font-medium">Concessional cap</td>
                      <td className="p-3 text-navy">$30,000</td>
                      <td className="p-3 text-navy">$30,000</td>
                      <td className="p-3 text-navy">Unchanged — cap not indexed this year</td>
                    </tr>
                    <tr className="border-b border-sandstone-dark/10">
                      <td className="p-3 text-navy font-medium">Second tax bracket rate</td>
                      <td className="p-3 text-navy">16%</td>
                      <td className="p-3 text-navy">16%</td>
                      <td className="p-3 text-navy">Stage 3 rates continue; 30% bracket begins at $45,001</td>
                    </tr>
                    <tr className="bg-sandstone/30">
                      <td className="p-3 text-navy font-medium">Division 293 threshold</td>
                      <td className="p-3 text-navy">$250,000</td>
                      <td className="p-3 text-navy">$250,000</td>
                      <td className="p-3 text-navy">Unchanged — not indexed to inflation</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                The increase in the SG rate from 11.5% to <strong>12%</strong> is the most significant change for salary sacrifice planning. An employee earning $150,000 now receives $18,000 in employer SG (up from $17,250), leaving only <strong>$12,000</strong> of the $30,000 concessional cap available for salary sacrifice — a reduction of $750 compared to FY2024-25. Employees near the cap should recalculate their arrangements at the start of each financial year to avoid exceeding the concessional limit.
              </p>
              <p>
                Looking ahead to FY2026-27, the first income tax bracket rate is legislated to decrease from 16% to <strong>15%</strong>. This further narrows the benefit of salary sacrifice for employees earning between $18,201 and $45,000, reducing the saving from $0.01 to $0.00 per dollar sacrificed into super.
              </p>
            </section>

            <section id="related-resources">
              <h2>Related Resources</h2>
              <p>
                Salary sacrifice intersects with superannuation, income tax brackets, HECS-HELP, and fringe benefits tax. The following Australian tax calculator tools and guides provide additional context for optimising your salary packaging strategy.
              </p>
              <ul>
                <li><Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> — Model the exact take-home pay impact of different sacrifice amounts at your salary level</li>
                <li><Link href="/superannuation-calculator/">Superannuation Calculator</Link> — Project your retirement balance with employer SG and additional salary sacrifice contributions</li>
                <li><Link href="/tax-brackets/">Income Tax Brackets FY2025-26</Link> — View all marginal rates, base amounts, and the tax-free threshold for the current financial year</li>
                <li><Link href="/hecs-help-guide/">HECS-HELP Repayment Guide</Link> — Understand why salary sacrifice does not reduce your student loan repayments</li>
                <li><Link href="/novated-lease-guide/">Novated Lease Guide</Link> — Compare EV and ICE novated lease structures with FBT implications</li>
                <li><Link href="/fringe-benefits-tax/">Fringe Benefits Tax Guide</Link> — Full breakdown of FBT rates, exemptions, and reportable fringe benefits</li>
              </ul>
            </section>

            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="what-is" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is salary sacrificing?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Salary sacrificing is an ATO-approved arrangement where an employee agrees to receive a lower gross salary in exchange for the employer providing a benefit of equivalent value — such as additional super contributions, a novated car lease, or a portable electronic device. The arrangement reduces the employee&apos;s assessable income, resulting in lower income tax and PAYG withholding.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="hecs" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does salary sacrificing lower my HECS-HELP repayments?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. The ATO calculates HECS-HELP repayments against your <strong>Repayment Income (RI)</strong>, which includes taxable income plus reportable employer super contributions plus reportable fringe benefits. Salary sacrifice reduces taxable income but the sacrificed amounts are added back as reportable items. The net effect on HECS repayments is zero.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="super-tax" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do I pay tax on salary sacrificed super?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. The super fund deducts <strong>15%</strong> contributions tax on all concessional contributions, including salary sacrifice amounts. Because 15% is lower than the standard marginal income tax brackets of 30%, 37%, and 45%, the employee pays less total tax than receiving the same amount as cash salary.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="div293" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is Division 293 tax?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Division 293 tax is an additional <strong>15%</strong> tax on concessional super contributions for individuals whose income plus concessional contributions exceed $250,000. The extra tax applies only to the portion above the threshold. Even at 30% total super tax, the rate is lower than the top marginal rate of 47% (45% plus 2% Medicare levy), so salary sacrifice into super remains beneficial for high earners.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ev-lease" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I salary sacrifice a car?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes, through a <strong>novated lease</strong>. Your employer deducts lease payments and running costs (fuel, insurance, registration, servicing) from your pre-tax salary. Electric vehicles and plug-in hybrids below the luxury car tax threshold are FBT-exempt under the Electric Car Discount. For a $50,000 EV, salary packaging through a novated lease saves approximately <strong>$5,000–$8,000 per year</strong> compared to purchasing outright with after-tax income.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="cap" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the concessional contributions cap for FY2025-26?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The concessional contributions cap for FY2025-26 is <strong>$30,000</strong> per person per financial year. This cap covers all concessional contributions combined: employer SG (12%), salary sacrifice contributions, and personal deductible contributions. Exceeding the cap triggers taxation at the individual&apos;s marginal rate on the excess amount.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="carry-forward" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I carry forward unused concessional cap space?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Employees with a total super balance below <strong>$500,000</strong> on 30 June of the previous financial year can carry forward unused concessional cap space from up to <strong>5 prior financial years</strong>. This allows larger one-off salary sacrifice contributions in years when cash flow permits without exceeding the cap. Check your unused cap space via your myGov account linked to the ATO.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="min-wage" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can salary sacrifice reduce my pay below minimum wage?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. A salary sacrifice arrangement cannot reduce an employee&apos;s cash earnings below the national minimum wage of <strong>$26.44 per hour</strong> ($1,004.90 per 38-hour week) or the applicable award/enterprise agreement rate. If the proposed sacrifice would breach this threshold, the employer must reject or reduce the arrangement.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="centrelink" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does salary sacrifice affect Centrelink payments?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    It depends on the specific payment. Services Australia calculates eligibility for Family Tax Benefit, childcare subsidies, and other income-tested payments using <strong>adjusted taxable income (ATI)</strong>, which adds back reportable super contributions and reportable fringe benefits. Salary sacrifice reduces taxable income but increases reportable items, so ATI remains similar. The net impact on Centrelink eligibility is typically minimal.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="nfp" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do not-for-profit employees get extra salary sacrifice benefits?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Employees of public benevolent institutions (PBIs) — including charities and public hospitals — can salary package everyday living expenses such as rent, mortgage repayments, and groceries up to <strong>$15,900</strong> per FBT year without incurring FBT. Public hospital employees and certain ambulance services have a higher cap of <strong>$30,000</strong>. An additional meal entertainment exemption of <strong>$2,650</strong> (grossed-up) applies on top of these caps.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="laptop" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I salary sacrifice a laptop or phone?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Portable electronic devices used <strong>primarily for employment duties</strong> are FBT-exempt. Eligible items include laptops, tablets, mobile phones, and GPS devices. The exemption applies to 1 device per category per FBT year (1 April to 31 March). The employer purchases the device from your pre-tax salary, reducing your taxable income by the device cost. A $2,500 laptop at a 30% marginal rate saves <strong>$750</strong> in income tax.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="change-amount" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I change my salary sacrifice amount mid-year?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes, in most cases. The employee submits a written request to adjust the sacrifice amount, and the employer applies the change from the next available pay period. The adjustment applies only to future pay — previously processed pay periods cannot be reversed. Some employers restrict changes to quarterly or biannual intervals, so check your employer&apos;s salary packaging policy before requesting a mid-year adjustment.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>Tax minimization models discussed rely on accurate marginal tax brackets and the standard 15% concessional superannuation architecture outlined in the Income Tax Assessment Act 1997. Non-profit (PBI) fringe benefit exemptions are a highly specialized niche and vary greatly. All figures reflect FY2025-26 rates effective 1 July 2025.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("salary-sacrifice-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Calculators</h3>
                  <div className="space-y-3">
                    <Link href="/salary-sacrifice-calculator/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Salary Sacrifice Calc</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/superannuation-calculator/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Superannuation Calc</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/tax-brackets/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Tax Brackets Checker</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Build your package</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Input your target sacrifice amount to instantly see the tax savings and cashflow reduction impact.</p>
                  <Link href="/salary-sacrifice-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Model Concessions
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
