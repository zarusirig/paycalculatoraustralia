"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, SUPER_GUARANTEE, formatAUD, formatPercent } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Super Guarantee percentage", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-contributions/how-much-super-to-pay", publisher: SOURCES.ato.name },
  { title: "Super contribution caps", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions", publisher: SOURCES.ato.name },
  { title: "Division 293 tax", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions/concessional-contributions-cap", publisher: SOURCES.ato.name },
  { title: "Super fund types and MySuper", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/choosing-a-super-fund", publisher: SOURCES.ato.name },
];

export default function SuperannuationGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Superannuation Guide</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Superannuation Guide — How Super Works in Australia (2025-26)
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Everything you need to know about the mandatory 12% retirement system, employer obligations, contribution caps, and how it impacts your take-home pay.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="what-is-super">
              <h2>What Is Superannuation?</h2>
              <p>
                Superannuation is Australia&apos;s compulsory retirement savings system, requiring every employer to deposit <strong>12% of an employee&apos;s ordinary time earnings</strong> into a registered super fund for the 2025-26 financial year. The system covers approximately <strong>16.5 million</strong> accounts and holds over <strong>$3.9 trillion</strong> in assets, making it the fourth-largest pension pool globally behind the United States, United Kingdom, and Canada.
              </p>
              <p>
                Commonly called &quot;super,&quot; the system was introduced under the Superannuation Guarantee (Administration) Act 1992 by the Keating Government. Employers pay contributions on top of gross salary, and the money is invested by the fund across asset classes including Australian equities, international shares, fixed interest, and property. The balance grows through a combination of employer contributions, voluntary contributions, and investment returns until the member reaches preservation age and retires.
              </p>
              <p>
                Super contributions directly reduce the income tax you pay today through concessional tax treatment. Employer super guarantee payments and salary sacrifice contributions are taxed at a flat <strong>15%</strong> inside the fund, compared to marginal rates of 30%, 37%, or 45% outside super. Use our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to see how your marginal rate compares to the 15% super rate.
              </p>
              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Interactive Calculation</h3>
                    <p className="text-navy text-sm mb-3">Want to see exactly how much super your employer must pay you based on your current salary?</p>
                    <Link href="/superannuation-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Use our Superannuation Calculator <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section id="sg-rate">
              <h2>How Much Super Does Your Employer Pay?</h2>
              <p>
                The Superannuation Guarantee (SG) rate is <strong>12%</strong>, paid on top of your earnings. Since <strong>Payday Super commenced on 1 July 2026</strong>, employers must pay it <strong>every payday</strong> rather than quarterly, and the contribution must be <em>received</em> by your fund within <strong>7 business days</strong> of each payday (20 business days for a new employee or a first contribution to a new fund).
              </p>
              <p>
                The SG rate increased by 0.5 percentage points each year from 2021 to reach the legislated ceiling of 12% on 1 July 2025. No further increases are currently legislated. On a salary of $85,000, the 12% SG adds <strong>$10,200 per year</strong> to your super balance. The previous rate of {formatPercent(SUPER_GUARANTEE.previousRate, 1)} applied during FY2024-25.
              </p>

              <h3>SG Rate History Table (FY2021-22 to FY2025-26)</h3>
              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Financial Year</th>
                        <th className="px-6 py-4">Required SG Rate</th>
                        <th className="px-6 py-4">Annual SG on $85K Salary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-4">1 July 2021 &ndash; 30 June 2022</td><td className="px-6 py-4">10.0%</td><td className="px-6 py-4">$8,500</td></tr>
                      <tr><td className="px-6 py-4">1 July 2022 &ndash; 30 June 2023</td><td className="px-6 py-4">10.5%</td><td className="px-6 py-4">$8,925</td></tr>
                      <tr><td className="px-6 py-4">1 July 2023 &ndash; 30 June 2024</td><td className="px-6 py-4">11.0%</td><td className="px-6 py-4">$9,350</td></tr>
                      <tr><td className="px-6 py-4 bg-yellow-50">1 July 2024 &ndash; 30 June 2025</td><td className="px-6 py-4 bg-yellow-50 font-bold text-black">11.5%</td><td className="px-6 py-4 bg-yellow-50">$9,775</td></tr>
                      <tr><td className="px-6 py-4 bg-eucalyptus-light/30">1 July 2025 onwards</td><td className="px-6 py-4 bg-eucalyptus-light/30 font-bold text-eucalyptus-dark">12.0%</td><td className="px-6 py-4 bg-eucalyptus-light/30 font-bold text-eucalyptus-dark">$10,200</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The SG is calculated on &quot;Ordinary Time Earnings&quot; (OTE), not total earnings. Overtime payments, expense reimbursements, and termination payouts are excluded from the SG calculation. The distinction between OTE and total earnings matters most for workers with significant overtime hours &mdash; use the <Link href="/overtime-pay-calculator/">Overtime Pay Calculator</Link> to separate ordinary and overtime components.
              </p>
            </section>

            <section id="who-pays">
              <h2>Who Has to Pay Super?</h2>
              <p>
                Every Australian employer must pay the 12% SG for <strong>all employees regardless of earnings level</strong>, employment type, or hours worked. The previous $450-per-month minimum threshold was abolished on 1 July 2022, extending super coverage to approximately 300,000 additional low-income and part-time workers.
              </p>
              <ul>
                <li><strong>Full-time, part-time, and casual workers:</strong> Entitled to super on every dollar of ordinary time earnings, with no minimum monthly income requirement.</li>
                <li><strong>Under 18s:</strong> Entitled to super if they work more than <strong>30 hours in a week</strong> for that employer.</li>
                <li><strong>Contractors:</strong> If you are hired wholly or principally for your labour (even with an ABN), you are an employee for superannuation purposes and entitled to the SG. Use our <Link href="/contractor-vs-employee-calculator/">Contractor vs Employee Calculator</Link> to compare the financial difference.</li>
                <li><strong>Temporary residents and working holiday makers:</strong> Entitled to SG on the same basis as permanent residents. Super is payable from the first dollar earned. See our <Link href="/working-holiday-tax/">Working Holiday Tax Guide</Link> for the tax treatment of departing temporary residents.</li>
                <li><strong>Company directors:</strong> Entitled to SG if they are also an employee of the company. Directors paid solely as officeholders (director&apos;s fees) are not covered unless an employment relationship exists.</li>
              </ul>
              <p>
                Self-employed sole traders and partners in a partnership have no obligation to pay themselves super, though they can make voluntary contributions and claim a tax deduction. Domestic workers employed for fewer than 30 hours per week are also exempt.
              </p>
            </section>

            <section id="ote-rules">
              <h2>What Counts as Ordinary Time Earnings for Super?</h2>
              <p>
                Employers calculate the 12% SG on <strong>Ordinary Time Earnings (OTE)</strong>, defined as the amount an employee earns for their ordinary hours of work. OTE includes base salary, allowances, shift loadings, and leave payments, but excludes overtime and termination payments.
              </p>
              <div className="grid md:grid-cols-2 gap-4 not-prose mb-6 mt-4">
                <Card className="bg-eucalyptus-light/30 border-sandstone-dark/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-eucalyptus-dark mb-2">Included in OTE (Super Paid)</h4>
                    <ul className="list-disc list-inside text-sm text-eucalyptus-dark space-y-1">
                      <li>Base salary and wages</li>
                      <li>Shift loading and casual loading</li>
                      <li>Allowances (e.g., danger, retention)</li>
                      <li>Bonuses related to performance</li>
                      <li>Annual leave and sick leave taken</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-sandstone border-sandstone-dark/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-ochre mb-2">Excluded from OTE (No Super)</h4>
                    <ul className="list-disc list-inside text-sm text-ochre space-y-1">
                      <li>Overtime hours</li>
                      <li>Expenses / reimbursement limits</li>
                      <li>Redundancy payouts</li>
                      <li>Annual leave paid out on termination</li>
                      <li>Maternity/paternity leave (unless guaranteed by employer)</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <p>
                The distinction between OTE and non-OTE payments is governed by Superannuation Guarantee Ruling SGR 2009/2 from the ATO. A common mistake is assuming all bonuses attract super &mdash; only bonuses paid for work performed during ordinary hours are OTE. Discretionary bonuses paid as a reward unrelated to specific ordinary-hours work are excluded. Use the <Link href="/bonus-tax-calculator/">Bonus Tax Calculator</Link> to calculate how a bonus is taxed and whether it attracts super.
              </p>
            </section>

            <section id="contribution-caps">
              <h2>What Are the Super Contribution Caps?</h2>
              <p>
                The ATO limits how much you can contribute to super at concessional tax rates each financial year. The concessional cap is <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong> and the non-concessional cap is <strong>{formatAUD(SUPER_GUARANTEE.nonConcessionalCap)}</strong> for FY2025-26. Exceeding either cap triggers additional tax on the excess amount.
              </p>

              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Cap Type</th>
                        <th className="px-6 py-4">Annual Limit (FY2025-26)</th>
                        <th className="px-6 py-4">Tax Rate Inside Super</th>
                        <th className="px-6 py-4">Penalty If Exceeded</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-medium">Concessional</td>
                        <td className="px-6 py-4 font-bold">{formatAUD(SUPER_GUARANTEE.concessionalCap)}</td>
                        <td className="px-6 py-4">15%</td>
                        <td className="px-6 py-4">Excess added to assessable income, taxed at marginal rate</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Non-concessional</td>
                        <td className="px-6 py-4 font-bold">{formatAUD(SUPER_GUARANTEE.nonConcessionalCap)}</td>
                        <td className="px-6 py-4">0% (already taxed)</td>
                        <td className="px-6 py-4">47% tax on excess, or withdraw and pay marginal rate</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Bring-forward (non-concessional)</td>
                        <td className="px-6 py-4 font-bold">$360,000 over 3 years</td>
                        <td className="px-6 py-4">0%</td>
                        <td className="px-6 py-4">Available only if total super balance is below $1.9 million</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3>Concessional Contributions Cap ($30,000)</h3>
              <p>
                The {formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap includes three contribution types: employer SG payments, <Link href="/salary-sacrifice-calculator/">salary sacrifice</Link> amounts, and personal contributions for which you claim a tax deduction. All three count toward the single cap. On an $85,000 salary, the employer SG of $10,200 leaves <strong>$19,800</strong> of unused cap space for voluntary concessional contributions.
              </p>
              <p>
                These contributions are taxed at <strong>15%</strong> within the super fund rather than your marginal tax rate. Unused concessional cap amounts carry forward for up to 5 years, provided your total super balance is below $500,000 at 30 June of the previous financial year. This &quot;carry-forward&quot; rule lets you contribute large lump sums in a single year &mdash; for example, after receiving a bonus or inheritance.
              </p>

              <h3>Non-Concessional Contributions Cap ({formatAUD(SUPER_GUARANTEE.nonConcessionalCap)})</h3>
              <p>
                Non-concessional contributions are amounts you deposit from after-tax income. These contributions attract <strong>no additional tax</strong> when entering the fund because income tax has already been paid. The annual cap is <strong>{formatAUD(SUPER_GUARANTEE.nonConcessionalCap)}</strong>.
              </p>
              <p>
                The &quot;bring-forward&quot; rule allows contributors under 75 to use up to 3 years of non-concessional cap in a single year (up to <strong>$360,000</strong>), provided total super balance is below $1.9 million at 30 June of the prior year. Exceeding the non-concessional cap results in the excess being taxed at <strong>47%</strong> (top marginal rate plus Medicare Levy), or you can elect to withdraw the excess and pay tax at your marginal rate plus an earnings component.
              </p>

              <h3>Division 293 Tax for High-Income Earners</h3>
              <p>
                &quot;Division 293&quot; imposes an additional <strong>15% tax</strong> on concessional super contributions for individuals with income plus concessional contributions exceeding <strong>$250,000</strong>. This brings the total tax on super contributions to <strong>30%</strong> for high earners, reducing the tax advantage of superannuation. Division 293 applies to approximately 390,000 taxpayers. The ATO issues Division 293 assessments automatically after tax returns are lodged &mdash; you can pay the assessment from your super fund or from personal funds.
              </p>
            </section>

            <section id="how-super-taxed">
              <h2>How Is Super Taxed?</h2>
              <p>
                Super is taxed at 3 distinct stages: contributions, investment earnings, and withdrawals. The combined tax treatment makes super the most tax-effective savings vehicle in Australia for retirement purposes, with rates of <strong>15% or less</strong> at each stage compared to marginal rates up to 47%.
              </p>

              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Stage</th>
                        <th className="px-6 py-4">Tax Rate</th>
                        <th className="px-6 py-4">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-medium">Concessional contributions</td>
                        <td className="px-6 py-4 font-bold">15%</td>
                        <td className="px-6 py-4">Employer SG, salary sacrifice, and deductible personal contributions. Division 293 adds 15% above $250K income.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Non-concessional contributions</td>
                        <td className="px-6 py-4 font-bold">0%</td>
                        <td className="px-6 py-4">After-tax money entering super. Already taxed at your marginal rate.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Investment earnings (accumulation)</td>
                        <td className="px-6 py-4 font-bold">15%</td>
                        <td className="px-6 py-4">Fund earnings taxed at 15%. Capital gains on assets held 12+ months taxed at 10% (one-third CGT discount).</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Investment earnings (pension phase)</td>
                        <td className="px-6 py-4 font-bold">0%</td>
                        <td className="px-6 py-4">Earnings on assets supporting income streams up to $1.9M transfer balance cap are tax-free.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Withdrawals (age 60+)</td>
                        <td className="px-6 py-4 font-bold">0%</td>
                        <td className="px-6 py-4">Lump sums and income streams from a taxed fund are entirely tax-free from age 60.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Withdrawals (preservation age to 59)</td>
                        <td className="px-6 py-4 font-bold">0% up to low-rate cap</td>
                        <td className="px-6 py-4">First $235,000 (FY2025-26) of taxable component is tax-free. Excess taxed at 15% plus Medicare Levy.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The &quot;Transfer Balance Cap&quot; limits how much super you can move into the tax-free pension phase. The general cap is <strong>$1.9 million</strong> for FY2025-26, indexed in $100,000 increments aligned with CPI. Amounts above this cap remain in the accumulation phase where earnings are taxed at 15%. Understanding how super taxation interacts with your income tax brackets is critical &mdash; use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to model your total after-tax position.
              </p>
            </section>

            <section id="max-contribution-base">
              <h2>Is There a Maximum Super Contribution Base?</h2>
              <p>
                With Payday Super from 1 July 2026, the maximum super contribution base is an annual figure: <strong>{formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} for FY{SITE_CONFIG.financialYear}</strong> (previously {formatAUD(SUPER_GUARANTEE.maxContributionBasePerQuarterUntil2026)} per quarter). Employers are not legally required to pay the 12% SG on earnings above this threshold.
              </p>
              <p>
                The maximum SG your employer must pay for the year is <strong>{formatAUD(SUPER_GUARANTEE.maxSGAnnual)}</strong> ({formatPercent(SUPER_GUARANTEE.rate, 0)} &times; {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}). This cap affects employees earning above {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} per year. Some employers voluntarily pay super on total salary including amounts above the maximum contribution base as part of an executive remuneration package.
              </p>
              <p>
                The maximum contribution base is indexed annually in line with Average Weekly Ordinary Time Earnings (AWOTE). For the previous year (FY2024-25), the quarterly maximum was $62,270. Use our <Link href="/superannuation-calculator/">Superannuation Calculator</Link> to determine whether the cap applies to your salary.
              </p>
            </section>

            <section id="check-super-balance">
              <h2>Step-by-Step: How to Check Your Super Balance</h2>
              <p>
                Every Australian with a super account can check their balance through <strong>myGov linked to the ATO</strong>, through their super fund&apos;s app or website, or by calling the fund directly. The ATO consolidates information from all funds, making myGov the single best tool for finding lost super across multiple accounts.
              </p>
              <ol>
                <li><strong>Log in to myGov</strong> at <a href="https://my.gov.au" target="_blank" rel="noreferrer noopener" className="text-eucalyptus-dark hover:underline">my.gov.au</a> using your credentials and link the ATO service if you have not already done so.</li>
                <li><strong>Navigate to &quot;Super&quot;</strong> in the ATO section. The dashboard displays all super accounts the ATO knows about, including active accounts, lost super, and unclaimed money.</li>
                <li><strong>Review your balances.</strong> Each account shows the fund name, ABN, account number, last reported balance, and date last updated. Employer-reported contributions appear within 2&ndash;4 weeks of the quarterly deadline.</li>
                <li><strong>Consolidate accounts.</strong> If you have multiple accounts, select the accounts you want to roll over and transfer them into a single fund. Consolidation eliminates duplicate insurance premiums and administration fees, which average <strong>$553 per year</strong> per account.</li>
                <li><strong>Check for unpaid super.</strong> Compare your payslips against the &quot;Contributions&quot; section. If employer SG payments are missing or short, lodge an &quot;Unpaid super enquiry&quot; through the ATO. The ATO investigates approximately 25,000 unpaid super complaints annually.</li>
              </ol>
              <p>
                Employers must report super contributions through Single Touch Payroll (STP), which feeds directly into the ATO&apos;s system. Reviewing your super at least once per quarter ensures contributions are being paid on time and at the correct rate of 12%.
              </p>
            </section>

            <section id="worked-example">
              <h2>Worked Example: Super on an $85,000 Salary</h2>
              <p>
                An employee earning <strong>$85,000 per year</strong> in base salary (base + super structure) receives SG contributions of <strong>$10,200</strong> for FY2025-26, bringing the total package to <strong>$95,200</strong>. Here is the complete breakdown of how super interacts with tax, take-home pay, and contribution caps.
              </p>

              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Component</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Calculation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4">Gross salary</td>
                        <td className="px-6 py-4 font-bold">$85,000</td>
                        <td className="px-6 py-4">Base annual salary</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">Employer SG (12%)</td>
                        <td className="px-6 py-4 font-bold">$10,200</td>
                        <td className="px-6 py-4">$85,000 &times; 12%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">Total package</td>
                        <td className="px-6 py-4 font-bold">$95,200</td>
                        <td className="px-6 py-4">$85,000 + $10,200</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">Tax on SG inside super (15%)</td>
                        <td className="px-6 py-4 font-bold">$1,530</td>
                        <td className="px-6 py-4">$10,200 &times; 15%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">Net SG added to super balance</td>
                        <td className="px-6 py-4 font-bold">$8,670</td>
                        <td className="px-6 py-4">$10,200 &minus; $1,530</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">Remaining concessional cap space</td>
                        <td className="px-6 py-4 font-bold">$19,800</td>
                        <td className="px-6 py-4">$30,000 &minus; $10,200</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">Income tax on $85K salary</td>
                        <td className="px-6 py-4 font-bold">$16,288</td>
                        <td className="px-6 py-4">$4,288 + ($85,000 &minus; $45,000) &times; 30%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">Medicare Levy (2%)</td>
                        <td className="px-6 py-4 font-bold">$1,700</td>
                        <td className="px-6 py-4">$85,000 &times; 2%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">Take-home pay (approx.)</td>
                        <td className="px-6 py-4 font-bold">$67,012</td>
                        <td className="px-6 py-4">$85,000 &minus; $16,288 &minus; $1,700</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                If this employee salary sacrifices $5,000 into super, taxable income drops to $80,000, reducing income tax by approximately <strong>$1,500</strong> (the $5,000 at the 30% marginal rate). The $5,000 is taxed at 15% inside super ($750), producing a net tax saving of <strong>$750</strong>. Read the full mechanics in our <Link href="/salary-sacrifice-guide/">Salary Sacrifice Guide</Link>.
              </p>
            </section>

            <section id="salary-sacrifice">
              <h2>How Does Salary Sacrifice Into Super Work?</h2>
              <p>
                Salary sacrifice redirects a portion of your pre-tax salary into your super fund, where it is taxed at <strong>15%</strong> instead of your marginal rate. The tax saving ranges from <strong>$150 per $1,000 sacrificed</strong> (at the 30% bracket) to <strong>$300 per $1,000</strong> (at the 45% bracket), making it one of the most effective legal tax-reduction strategies in Australia.
              </p>
              <p>
                Salary sacrifice contributions count toward the {formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap alongside employer SG payments. Exceeding the cap triggers additional tax at your marginal rate on the excess amount. Before arranging salary sacrifice with your employer, calculate your available cap space by subtracting your annual SG from $30,000.
              </p>

              <h3>Worked Example: Salary Sacrifice on $100,000</h3>
              <p>
                An employee earning $100,000 receives 12% SG ($12,000), leaving $18,000 of concessional cap space ({formatAUD(SUPER_GUARANTEE.concessionalCap)} &minus; $12,000). If they salary sacrifice $10,000:
              </p>
              <ul>
                <li>Taxable income drops from $100,000 to <strong>$90,000</strong></li>
                <li>Income tax saving at the 30% marginal rate: <strong>$3,000</strong></li>
                <li>The $10,000 is taxed at 15% inside super: <strong>$1,500 contributions tax</strong></li>
                <li><strong>Net benefit:</strong> $1,500 more in super than taking the income as salary</li>
                <li>Take-home pay reduces by approximately <strong>$7,000</strong> ($10,000 minus the $3,000 tax saving)</li>
              </ul>
              <p>
                Use the <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> to model your own scenario with exact dollar amounts.
              </p>
            </section>

            <section id="fy2025-26-changes">
              <h2>What Changed for Super in FY2025-26?</h2>
              <p>
                The SG rate increased from <strong>11.5% to 12%</strong> on 1 July 2025, marking the final scheduled increase in the legislated ramp-up from 9.5% that began in FY2021-22. This 0.5 percentage point rise adds approximately $425 per year in super contributions for every $85,000 of salary.
              </p>

              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Change</th>
                        <th className="px-6 py-4">FY2024-25 (Previous)</th>
                        <th className="px-6 py-4">FY2025-26 (Current)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-medium">SG rate</td>
                        <td className="px-6 py-4">11.5%</td>
                        <td className="px-6 py-4 font-bold text-eucalyptus-dark">12.0%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Maximum contribution base (quarterly)</td>
                        <td className="px-6 py-4">$62,270</td>
                        <td className="px-6 py-4 font-bold text-eucalyptus-dark">{formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Concessional cap</td>
                        <td className="px-6 py-4">$30,000</td>
                        <td className="px-6 py-4 font-bold">{formatAUD(SUPER_GUARANTEE.concessionalCap)} (unchanged)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Non-concessional cap</td>
                        <td className="px-6 py-4">$120,000</td>
                        <td className="px-6 py-4 font-bold">{formatAUD(SUPER_GUARANTEE.nonConcessionalCap)} (unchanged)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Transfer balance cap</td>
                        <td className="px-6 py-4">$1.9 million</td>
                        <td className="px-6 py-4 font-bold">$1.9 million (unchanged)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Division 293 threshold</td>
                        <td className="px-6 py-4">$250,000</td>
                        <td className="px-6 py-4 font-bold">$250,000 (unchanged)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The higher SG rate means employees on a &quot;total package&quot; structure see a slight reduction in take-home pay, because a larger share of the package goes to super. Employees on a &quot;base + super&quot; structure see no change to take-home pay &mdash; only higher super contributions from their employer. The Stage 3 income tax bracket changes that took effect on 1 July 2024 continue to apply in FY2025-26, including the 16% rate on income between $18,201 and $45,000 and the expanded 30% bracket up to $135,000.
              </p>
            </section>

            <section id="super-fund-types">
              <h2>What Are the Different Types of Super Funds?</h2>
              <p>
                Australian super funds fall into 5 main categories: industry funds, retail funds, corporate funds, public sector funds, and self-managed super funds (SMSFs). Each type differs in fee structures, investment options, insurance offerings, and governance.
              </p>

              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Fund Type</th>
                        <th className="px-6 py-4">Typical Fees (p.a.)</th>
                        <th className="px-6 py-4">Investment Options</th>
                        <th className="px-6 py-4">Best Suited For</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-medium">Industry fund</td>
                        <td className="px-6 py-4">0.5%&ndash;1.0%</td>
                        <td className="px-6 py-4">Pre-mixed and single-sector options</td>
                        <td className="px-6 py-4">Most employees; lower fees, profit-to-member</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Retail fund</td>
                        <td className="px-6 py-4">0.8%&ndash;1.5%</td>
                        <td className="px-6 py-4">Wide range including managed funds and shares</td>
                        <td className="px-6 py-4">Active investors wanting specific fund managers</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Corporate fund</td>
                        <td className="px-6 py-4">0.3%&ndash;0.7%</td>
                        <td className="px-6 py-4">Tailored options negotiated by employer</td>
                        <td className="px-6 py-4">Employees of large corporations with in-house funds</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Public sector fund</td>
                        <td className="px-6 py-4">0.3%&ndash;0.6%</td>
                        <td className="px-6 py-4">Pre-mixed options, some defined benefit schemes</td>
                        <td className="px-6 py-4">Federal, state, and local government employees</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">SMSF</td>
                        <td className="px-6 py-4">$2,000&ndash;$5,000 fixed</td>
                        <td className="px-6 py-4">Direct shares, property, crypto, collectibles</td>
                        <td className="px-6 py-4">Balances above $500K; experienced investors</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3>Stapled Super Funds</h3>
              <p>
                Since 1 November 2021, when you start a new job without nominating a fund, your employer must request your &quot;stapled fund&quot; details from the ATO. This is your existing super fund that follows you from job to job, preventing the creation of duplicate accounts with unnecessary fees. The ATO processes approximately 2.5 million stapled fund requests per year.
              </p>
              <h3>Default Funds (MySuper)</h3>
              <p>
                If you have no existing fund and do not nominate one, your employer opens an account in their default fund. All default funds must offer a &quot;MySuper&quot; product &mdash; a simple, low-cost option designed for members who do not make active investment choices. MySuper products are subject to annual performance testing by APRA; funds that fail 2 consecutive years are closed to new members.
              </p>
              <h3>Comparing Funds</h3>
              <p>
                When choosing a fund, compare investment fees (target under 1% p.a.), insurance premiums, investment performance over 5&ndash;10 year periods, and available tools such as salary sacrifice tracking and retirement projections. The ATO&apos;s YourSuper comparison tool at <a href="https://www.ato.gov.au/calculators-and-tools/super-yoursuper-comparison-tool" target="_blank" rel="noreferrer noopener" className="text-eucalyptus-dark hover:underline">ato.gov.au/yoursuper</a> ranks funds by fees and net returns over 7 years.
              </p>
            </section>

            <section id="key-dates">
              <h2>What Are the Key Super Dates and Deadlines?</h2>
              <p>
                Employers must pay SG contributions <strong>every payday</strong>, with the money received by the fund within <strong>7 business days</strong>. Missing that deadline triggers the Superannuation Guarantee Charge (SGC): the shortfall, notional earnings at the general interest charge rate compounded daily, and an administrative uplift of up to 60% that falls to nil on voluntary disclosure within 30 days. Unlike the old quarterly charge, the SGC is now <strong>tax-deductible</strong>.
              </p>

              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Quarter</th>
                        <th className="px-6 py-4">Period</th>
                        <th className="px-6 py-4">SG Payment Due</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4">Q1</td>
                        <td className="px-6 py-4">1 July &ndash; 30 September</td>
                        <td className="px-6 py-4 font-bold">28 October</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">Q2</td>
                        <td className="px-6 py-4">1 October &ndash; 31 December</td>
                        <td className="px-6 py-4 font-bold">28 January</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">Q3</td>
                        <td className="px-6 py-4">1 January &ndash; 31 March</td>
                        <td className="px-6 py-4 font-bold">28 April</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">Q4</td>
                        <td className="px-6 py-4">1 April &ndash; 30 June</td>
                        <td className="px-6 py-4 font-bold">28 July</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p>
                Other critical super dates for FY2025-26 include: <strong>30 June 2026</strong> as the deadline to make personal deductible contributions for the financial year, <strong>30 June 2026</strong> for the carry-forward concessional cap calculation date, and <strong>31 October 2026</strong> (or the lodgement due date if using a tax agent) to lodge your tax return and claim deductions for personal super contributions. The ATO&apos;s <Link href="/tax-calendar/">Australian Tax Calendar</Link> lists all key dates across the financial year. The quarterly payment schedule above will also change once the <Link href="/news/payday-super-starts-july-2026/">payday super rules from 1 July 2026</Link> require employers to pay SG on the same day as wages.
              </p>
            </section>

            <section id="related-resources">
              <h2>Related Resources</h2>
              <p>
                The superannuation system intersects with income tax brackets, salary packaging, and overall take-home pay calculations. These related tools and guides provide deeper analysis on specific aspects of Australian tax and payroll.
              </p>
              <ul>
                <li><Link href="/superannuation-calculator/">Superannuation Calculator</Link> &mdash; Calculate the exact SG amount your employer must pay based on your salary, including the maximum contribution base cap.</li>
                <li><Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> &mdash; Model the tax savings of redirecting pre-tax salary into super, with side-by-side before/after comparison.</li>
                <li><Link href="/salary-sacrifice-guide/">Salary Sacrifice Guide</Link> &mdash; Full explanation of salary sacrifice mechanics, FBT implications, and concessional cap interactions.</li>
                <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> &mdash; Calculate your after-tax income including super, Medicare Levy, HECS-HELP, and all deductions.</li>
                <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> &mdash; See exactly how the FY2025-26 tax brackets apply to your assessable income.</li>
                <li><Link href="/hecs-help-calculator/">HECS-HELP Guide</Link> &mdash; Understand the new marginal repayment system and how HECS interacts with super salary sacrifice strategies.</li>
              </ul>
            </section>

            {/* --- CONTEXT BORDER --- */}

            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="rate" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the Super Guarantee rate for FY2025-26?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The Superannuation Guarantee rate is <strong>12%</strong> from 1 July 2025. This is the legislated peak rate after annual 0.5% increases since FY2021-22. Employers must pay 12% of an employee&apos;s Ordinary Time Earnings into a nominated super fund quarterly.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="salary-deduction" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does superannuation come out of my salary?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    It depends on your contract structure. A &quot;Base Salary + Super&quot; contract means the employer pays 12% <strong>on top</strong> of your base pay, with no reduction to your salary. A &quot;Total Remuneration Package&quot; (TRP) contract includes super within the total figure &mdash; so 12% is deducted from the package to determine your base salary. On a $100,000 TRP, your base salary is approximately <strong>$89,286</strong> and super is <strong>$10,714</strong>.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="choice" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I choose my own super fund?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Most Australian employees have the legal right to choose their own superannuation fund by completing a Standard Choice Form. If you do not nominate a fund, your employer checks the ATO for your existing &quot;stapled fund.&quot; If no stapled fund exists, the employer opens an account in their default MySuper fund.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="exceed-cap" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What happens if I exceed the concessional cap?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Excess concessional contributions above {formatAUD(SUPER_GUARANTEE.concessionalCap)} are added to your assessable income and taxed at your marginal rate (instead of the 15% super rate). You receive a credit for the 15% tax already paid inside the fund. You can elect to withdraw up to 85% of the excess from your super fund to cover the additional tax bill.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="when-access" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">When can I access my super?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    You can access your super when you reach your <strong>preservation age</strong> (between 55 and 60, depending on date of birth) and have permanently retired, or when you turn <strong>65</strong> regardless of employment status. Early access is available only for severe financial hardship, terminal medical conditions, permanent incapacity, compassionate grounds, or under the First Home Super Saver Scheme (FHSSS) for up to $50,000.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="div293" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is Division 293 tax on super?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Division 293 imposes an additional <strong>15% tax</strong> on concessional super contributions for individuals whose income plus concessional contributions exceed <strong>$250,000</strong>. The total tax on super contributions for affected individuals is 30% (15% standard contributions tax + 15% Division 293). You can choose to pay the Division 293 assessment from your super fund or from personal funds.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="unpaid-super" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What do I do if my employer is not paying my super?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    First, check your payslips and myGov ATO portal to confirm contributions are missing. Raise the issue with your employer directly. If the employer does not resolve the shortfall, lodge an &quot;Unpaid super enquiry&quot; through the ATO website or by calling <strong>13 10 20</strong>. The ATO can audit the employer, impose the Superannuation Guarantee Charge (SGC), and direct payment including interest. You can lodge the complaint anonymously.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="lost-super" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How do I find lost super accounts?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Log in to <strong>myGov</strong> and link the ATO service. Navigate to the &quot;Super&quot; section, where the ATO displays all known accounts including lost and unclaimed super. The ATO holds approximately <strong>$16 billion</strong> in lost and unclaimed super across 6.3 million accounts. You can consolidate multiple accounts into a single fund directly through the myGov portal at no cost.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="contractor-super" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do contractors get superannuation?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Contractors hired wholly or principally for their labour are treated as employees for super purposes and <strong>are entitled to the 12% SG</strong>, even if they invoice with an ABN. Independent contractors who control how, when, and where work is performed and supply their own tools are generally not entitled to employer super. The distinction depends on the substance of the arrangement, not the label on the contract.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="super-on-bonus" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is super paid on bonuses?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Super is paid on bonuses that relate to work performed during ordinary hours &mdash; these are part of Ordinary Time Earnings (OTE). Discretionary bonuses, retention bonuses, and ex gratia payments that are not tied to specific ordinary-hours work are <strong>excluded from OTE</strong> and do not attract SG. The classification depends on the nature and purpose of the bonus, not its label.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="super-salary-sacrifice-vs-personal" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is salary sacrifice into super better than personal contributions?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Both methods receive the same 15% concessional tax rate inside super, and both count toward the {formatAUD(SUPER_GUARANTEE.concessionalCap)} cap. Salary sacrifice reduces your assessable income <strong>before PAYG withholding</strong>, giving you the tax benefit in every pay cycle. Personal deductible contributions require you to wait until you lodge your tax return to claim the deduction. Salary sacrifice also reduces the income used to calculate the Medicare Levy Surcharge threshold, providing an additional benefit for those without private health insurance.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="preservation-age" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is my preservation age?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Preservation age depends on your date of birth. Anyone born before 1 July 1960 has a preservation age of <strong>55</strong>. Born between 1 July 1960 and 30 June 1961: <strong>56</strong>. Between 1 July 1961 and 30 June 1962: <strong>57</strong>. Between 1 July 1962 and 30 June 1963: <strong>58</strong>. Between 1 July 1963 and 30 June 1964: <strong>59</strong>. Born on or after 1 July 1964: <strong>60</strong>.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>Information on this page is based on current ATO legislation and Superannuation Guarantee Administration Act parameters for the 2025-26 Australian financial year. Rules surrounding superannuation are subject to frequent federal updates.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("superannuation-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Calculators</h3>
                  <div className="space-y-3">
                    <Link href="/superannuation-calculator/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Super Calculator</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/take-home-pay-calculator/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Take-Home Pay Calculator</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/salary-sacrifice-calculator/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Salary Sacrifice Calc</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Need a tailored breakdown?</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Calculate how your super impacts your total package instantly.</p>
                  <Link href="/superannuation-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
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
