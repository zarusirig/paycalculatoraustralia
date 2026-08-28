"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, formatAUD, formatPercent, MEDICARE_LEVY } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Schedule 5 – Tax table for back payments", url: "https://www.ato.gov.au/tax-rates-and-codes/schedule-5-tax-table-for-back-payments-commissions-bonuses-and-similar-payments", publisher: SOURCES.ato.name },
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
];

export default function BonusTaxGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Bonus Tax Guide</span></li>
          </ol>
        </nav>

        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            How Bonus Tax Works in Australia
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Understand how bonuses, commissions, and lump sum payments are taxed. Learn about
            ATO Schedule 5 withholding, marginal rate treatment, and why your bonus seems smaller than expected.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="how-bonuses-taxed">
              <h2>How Are Bonuses Taxed in Australia?</h2>
              <p>
                Bonuses in Australia are taxed as assessable income at your <strong>marginal tax rate</strong>, not at a separate &quot;bonus tax rate.&quot;
              </p>
              <p>
                The ATO treats every bonus, commission, incentive payment, and profit-share distribution as ordinary income. Your employer adds the bonus to your year-to-date earnings and withholds tax using either Schedule 5 (the supplementary payment method) or the standard PAYG withholding tables. The result is the same: the bonus is taxed at whatever income tax bracket your total earnings fall into for FY2025-26.
              </p>
              <p>
                Australia does not impose a flat bonus tax rate the way the United States allows a 22% supplemental withholding method. Every dollar of bonus income flows through the same progressive tax brackets as salary, wages, and overtime. Use our <Link href="/bonus-tax-calculator/">Bonus Tax Calculator</Link> to see the exact withholding on your payment.
              </p>
              <p>
                Three factors determine how much tax is deducted from your bonus:
              </p>
              <ol>
                <li>Your total gross income for the financial year (salary plus bonus)</li>
                <li>The marginal tax rate that applies to the income band your bonus falls into</li>
                <li>Whether your employer uses the Schedule 5 method or an annualised withholding approach</li>
              </ol>
              <p>
                The Medicare levy of <strong>2%</strong> also applies to bonus income, and high earners above $93,000 (singles without private hospital cover) face the &quot;Medicare Levy Surcharge&quot; of 1%–1.5% on top.
              </p>
            </section>

            <section id="marginal-rate">
              <h2>What Is the Marginal Tax Rate on Bonuses?</h2>
              <p>
                The marginal tax rate on a bonus is the rate that applies to your highest dollar of total income — <strong>16%, 30%, 37%, or 45%</strong> depending on your income tax bracket for FY2025-26.
              </p>
              <p>
                Your bonus is not taxed at a special &quot;bonus tax rate.&quot; Instead, it is taxed at your marginal tax rate — the rate that applies to your top dollar of income. Because the bonus sits on top of your regular salary, every dollar of it falls into your highest tax bracket. This is why many Australians feel their bonus is &quot;taxed more&quot; — the effective rate on the bonus is higher than the effective rate on their total salary because it hits the top bracket.
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-4">Taxable Income Bracket</th>
                        <th className="px-5 py-4">Marginal Rate</th>
                        <th className="px-5 py-4">Rate + Medicare Levy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">$0 – $18,200</td><td className="px-5 py-3">0%</td><td className="px-5 py-3 font-medium">0%</td></tr>
                      <tr><td className="px-5 py-3">$18,201 – $45,000</td><td className="px-5 py-3">16%</td><td className="px-5 py-3 font-medium">18%</td></tr>
                      <tr><td className="px-5 py-3">$45,001 – $135,000</td><td className="px-5 py-3">30%</td><td className="px-5 py-3 font-medium">32%</td></tr>
                      <tr><td className="px-5 py-3">$135,001 – $190,000</td><td className="px-5 py-3">37%</td><td className="px-5 py-3 font-medium">39%</td></tr>
                      <tr><td className="px-5 py-3">$190,001+</td><td className="px-5 py-3">45%</td><td className="px-5 py-3 font-medium">47%</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray-light mt-2">FY2025-26 Australian resident tax brackets. See our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> for a full breakdown.</p>
              </div>

              <p>
                A worker earning <strong>$90,000</strong> in base salary sits in the 30% bracket. A $10,000 bonus pushes total income to $100,000 — still within the 30% bracket — so the entire bonus is taxed at <strong>30% plus 2% Medicare levy</strong>, totalling $3,200 in tax. A worker on $130,000 receiving the same $10,000 bonus crosses from the 30% bracket into the 37% bracket. The first $5,000 is taxed at 32% and the remaining $5,000 at 39%, producing a blended withholding of approximately <strong>$3,550</strong>.
              </p>
            </section>

            <section id="schedule-5">
              <h2>How Does PAYG Withholding Apply to Bonuses?</h2>
              <p>
                Employers withhold tax on bonuses using <strong>ATO Schedule 5</strong>, which calculates the difference between tax on annual earnings with and without the bonus.
              </p>
              <p>
                The ATO provides Schedule 5 to employers for calculating tax on supplementary payments like bonuses, commissions, and back pay. The &quot;PAYG withholding&quot; method works as follows:
              </p>
              <ol>
                <li>Calculate tax on annual earnings <em>including</em> the bonus</li>
                <li>Calculate tax on annual earnings <em>excluding</em> the bonus</li>
                <li>The difference is the amount withheld from the bonus</li>
              </ol>
              <p>
                This approach ensures the withholding closely matches your actual tax liability, minimising the chance of a large bill or refund at tax time.
              </p>
              <h3>Why Schedule 5 Exists</h3>
              <p>
                Without Schedule 5, employers would need to annualise the pay period containing the bonus. A $5,000 fortnightly wage plus a $10,000 bonus in a single pay period would annualise to <strong>$390,000</strong>, triggering the 45% withholding rate on the entire payment. Schedule 5 prevents this over-withholding by isolating the bonus component and taxing it at the correct marginal rate based on your actual annual income.
              </p>
              <h3>When Schedule 5 Does Not Apply</h3>
              <p>
                Schedule 5 does not apply to &quot;Employment Termination Payments&quot; (ETPs) such as golden handshakes, genuine redundancy amounts above the tax-free limit, or unused annual leave paid on termination. These payments have separate withholding rules under Schedule 11. For more on termination payments, see our <Link href="/redundancy-pay-guide/">Redundancy Pay Guide</Link>.
              </p>
            </section>

            <section id="worked-example">
              <h2>Worked Example: Tax on a $10,000 Bonus</h2>
              <p>
                A worker earning $85,000 base salary who receives a $10,000 bonus pays approximately <strong>$3,200</strong> in tax on the bonus, netting <strong>$6,800</strong>.
              </p>
              <p>
                Here is the step-by-step Schedule 5 calculation:
              </p>
              <ol>
                <li><strong>Step 1 — Tax on salary only ($85,000):</strong> $0 on the first $18,200 + $4,288 on $18,201–$45,000 (16%) + $12,000 on $45,001–$85,000 (30%) = <strong>$16,288</strong> income tax + $1,700 Medicare levy = <strong>$17,988</strong> total</li>
                <li><strong>Step 2 — Tax on salary plus bonus ($95,000):</strong> $0 on the first $18,200 + $4,288 on $18,201–$45,000 (16%) + $15,000 on $45,001–$95,000 (30%) = <strong>$19,288</strong> income tax + $1,900 Medicare levy = <strong>$21,188</strong> total</li>
                <li><strong>Step 3 — Difference:</strong> $21,188 − $17,988 = <strong>$3,200</strong> withheld from the $10,000 bonus</li>
              </ol>
              <p>
                The effective tax rate on this bonus is <strong>32%</strong> (30% marginal rate plus 2% Medicare levy). The worker takes home <strong>$6,800</strong> of the $10,000 bonus. Use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to model your complete after-tax income including bonuses.
              </p>
            </section>

            <section id="bonus-tax-table">
              <h2>Bonus Tax Table by Income Level</h2>
              <p>
                The table below shows tax withheld on a $10,000 bonus at 5 common salary levels, covering every FY2025-26 income tax bracket from 16% through 45%.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-4">Base Salary</th>
                        <th className="px-5 py-4">Tax Bracket</th>
                        <th className="px-5 py-4 text-right">Tax on $10K Bonus</th>
                        <th className="px-5 py-4 text-right">Net Bonus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">$40,000</td><td className="px-5 py-3">16% + 2%</td><td className="px-5 py-3 text-right text-ochre">~$2,360</td><td className="px-5 py-3 text-right font-medium">~$7,640</td></tr>
                      <tr><td className="px-5 py-3">$80,000</td><td className="px-5 py-3">30% + 2%</td><td className="px-5 py-3 text-right text-ochre">~$3,200</td><td className="px-5 py-3 text-right font-medium">~$6,800</td></tr>
                      <tr><td className="px-5 py-3">$120,000</td><td className="px-5 py-3">30% + 2%</td><td className="px-5 py-3 text-right text-ochre">~$3,200</td><td className="px-5 py-3 text-right font-medium">~$6,800</td></tr>
                      <tr><td className="px-5 py-3">$150,000</td><td className="px-5 py-3">37% + 2%</td><td className="px-5 py-3 text-right text-ochre">~$3,900</td><td className="px-5 py-3 text-right font-medium">~$6,100</td></tr>
                      <tr><td className="px-5 py-3">$200,000</td><td className="px-5 py-3">45% + 2%</td><td className="px-5 py-3 text-right text-ochre">~$4,700</td><td className="px-5 py-3 text-right font-medium">~$5,300</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray-light mt-2">Approximate values for FY2025-26. Use our <Link href="/bonus-tax-calculator/" className="text-eucalyptus-dark hover:underline">bonus tax calculator</Link> for exact figures.</p>
              </div>
              <p>
                The jump between the 30% and 37% brackets occurs at $135,000. A worker on $130,000 who receives a $10,000 bonus has $5,000 taxed at 32% and $5,000 taxed at 39%, producing a blended rate of approximately <strong>35.5%</strong> across the bonus. The largest single jump happens at $190,000, where the marginal rate rises from 37% to 45% — an 8 percentage point increase that costs an extra <strong>$800</strong> per $10,000 of bonus income compared to the bracket below.
              </p>
            </section>

            <section id="tax-back-on-bonus">
              <h2>Do You Get Tax Back on Bonuses?</h2>
              <p>
                You receive a tax refund on your bonus only if your employer withheld more tax than your actual liability — the Schedule 5 method minimises this gap, so most refunds on bonus withholding are <strong>small or zero</strong>.
              </p>
              <p>
                Over-withholding happens in 3 common scenarios:
              </p>
              <ul>
                <li><strong>Bonus paid early in the financial year</strong> — the employer projects a full year of income, but you change jobs or reduce hours mid-year, lowering your actual taxable income</li>
                <li><strong>Employer uses flat-rate annualisation</strong> instead of Schedule 5 — some payroll systems annualise the pay period containing the bonus, producing a higher withholding rate</li>
                <li><strong>Significant tax deductions</strong> — work-related expenses, salary sacrifice contributions, or the &quot;Low Income Tax Offset&quot; reduce your assessable income below the projected amount</li>
              </ul>
              <p>
                When you lodge your tax return, the ATO calculates your actual tax liability on total income (salary plus bonus) and compares it to total PAYG withholding throughout the year. The difference is your refund or balance owing. See our <Link href="/tax-refund-guide/">Tax Refund Guide</Link> for a full explanation of how refunds are calculated.
              </p>
            </section>

            <section id="reduce-bonus-tax">
              <h2>How to Reduce Tax on Your Bonus</h2>
              <p>
                The most effective way to reduce tax on a bonus is to salary sacrifice it into superannuation, converting a marginal rate of up to <strong>47%</strong> into a flat <strong>15%</strong> contributions tax.
              </p>
              <h3>Strategy 1: Salary Sacrifice Into Super</h3>
              <p>
                Directing part or all of a bonus into superannuation as a concessional (before-tax) contribution reduces taxable income. The contribution is taxed at only <strong>15%</strong> inside the super fund, compared to marginal rates of 30%–47% outside super. A worker on $120,000 who sacrifices a $10,000 bonus saves approximately <strong>$1,700</strong> in tax ($3,200 at the marginal rate minus $1,500 in super contributions tax).
              </p>
              <p>
                The concessional contribution cap for FY2025-26 is <strong>$30,000</strong> per year, including employer SG contributions of 12%. A worker earning $120,000 receives $14,400 in SG, leaving <strong>$15,600</strong> of cap space for salary sacrifice. Workers with unused cap space from previous years (where their super balance was below $500,000 on 30 June) can carry forward up to 5 years of unused amounts. See our <Link href="/salary-sacrifice-guide/">Salary Sacrifice Guide</Link> for a detailed walkthrough.
              </p>

              <h3>Strategy 2: Time the Bonus Payment</h3>
              <p>
                A bonus is assessable income in the financial year it is <em>paid</em>, not the year it is earned. If you expect lower income next financial year — due to parental leave, career break, or part-time work — ask your employer to defer the bonus payment into the new financial year. A $10,000 bonus taxed at the 30% bracket costs <strong>$3,200</strong> in tax. The same bonus taxed at the 16% bracket (if income drops below $45,000) costs only <strong>$1,800</strong> — a saving of <strong>$1,400</strong>.
              </p>

              <h3>Strategy 3: Maximise Deductions</h3>
              <p>
                Work-related deductions reduce your taxable income, potentially pulling bonus income down into a lower tax bracket. Common deductions that offset bonus taxation include self-education expenses, home office costs, professional memberships, and income protection insurance premiums. Every $1,000 in deductions at the 37% marginal rate reduces tax by <strong>$370</strong>.
              </p>
            </section>

            <section id="super-on-bonus">
              <h2>Is Superannuation Paid on Bonuses?</h2>
              <p>
                Bonuses for work performed are generally classified as &quot;Ordinary Time Earnings&quot; (OTE) and attract the <strong>12% Superannuation Guarantee</strong> for FY2025-26.
              </p>
              <p>
                Your employer pays the SG rate of 12% on top of your bonus, depositing it into your super fund. A $10,000 performance bonus generates <strong>$1,200</strong> in additional super contributions. However, some bonus types are excluded from OTE:
              </p>
              <ul>
                <li><strong>Retention bonuses</strong> — excluded from OTE if the payment is conditional on staying for a set period rather than performing work</li>
                <li><strong>Sign-on bonuses</strong> — generally excluded because they relate to entering employment, not performing work</li>
                <li><strong>Referral bonuses</strong> — excluded when paid for recommending a candidate rather than productive work</li>
                <li><strong>Performance bonuses linked to work</strong> — classified as OTE and attract the full 12% SG</li>
              </ul>
              <p>
                The maximum super contribution base for FY2025-26 is <strong>$65,070 per quarter</strong>. Employers are not required to pay SG on earnings above this cap. For more detail on contribution limits and rates, see our <Link href="/superannuation-guide/">Superannuation Guide</Link>.
              </p>
            </section>

            <section id="commission">
              <h2>How Are Commissions Taxed Compared to Bonuses?</h2>
              <p>
                Commissions are taxed identically to bonuses — the ATO applies the same Schedule 5 withholding method and marginal tax rate treatment to both payment types.
              </p>
              <p>
                Whether your payment is called a &quot;performance bonus,&quot; &quot;sales commission,&quot; &quot;incentive payment,&quot; or &quot;profit share,&quot; the withholding method under Schedule 5 is the same. All supplementary payments above ordinary wages fall under the same PAYG withholding rules. The only distinction is reporting: commissions earned as a sole trader or independent contractor are reported as business income rather than employment income and are not subject to PAYG withholding.
              </p>
            </section>

            <section id="lump-sum-b">
              <h2>What Is Lump Sum B (Back Pay)?</h2>
              <p>
                &quot;Lump Sum B&quot; is a back payment relating to previous financial years, and the ATO spreads it across the relevant years to prevent an unfair tax bracket increase in the current year.
              </p>
              <p>
                Back payments relating to previous financial years are handled under Lump Sum B on your payment summary. The tax on these is calculated differently — the ATO spreads the payment across the relevant years to avoid unfairly pushing you into a higher bracket for the current year. Your employer reports the amount and the number of years it relates to. The ATO then calculates the correct tax at lodgment time.
              </p>
              <p>
                Common examples of Lump Sum B payments include retrospective pay rises under enterprise agreements, back-paid award rate increases, and settlement payments for underpayment claims. A $6,000 back payment covering 3 financial years is split as <strong>$2,000 per year</strong>, and the ATO calculates the marginal rate for each year independently.
              </p>
            </section>

            <section id="fy2025-26-changes">
              <h2>What Changed in FY2025-26?</h2>
              <p>
                The FY2025-26 tax cuts restructured the income tax brackets, reducing the 19% rate to <strong>16%</strong> and lowering the 32.5% rate to <strong>30%</strong>, which reduces bonus tax for most Australian workers.
              </p>
              <p>
                Key changes affecting bonus taxation in the 2025-26 financial year:
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-4">Change</th>
                        <th className="px-5 py-4">FY2023-24 (Old)</th>
                        <th className="px-5 py-4">FY2025-26 (Current)</th>
                        <th className="px-5 py-4">Impact on Bonus Tax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-5 py-3">Second bracket rate</td>
                        <td className="px-5 py-3">19%</td>
                        <td className="px-5 py-3 font-medium">16%</td>
                        <td className="px-5 py-3">Saves <strong>$300</strong> per $10K bonus for earners $18K–$45K</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-3">Third bracket rate</td>
                        <td className="px-5 py-3">32.5%</td>
                        <td className="px-5 py-3 font-medium">30%</td>
                        <td className="px-5 py-3">Saves <strong>$250</strong> per $10K bonus for earners $45K–$135K</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-3">Third bracket ceiling</td>
                        <td className="px-5 py-3">$120,000</td>
                        <td className="px-5 py-3 font-medium">$135,000</td>
                        <td className="px-5 py-3">Workers $120K–$135K drop from 37% to 30%</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-3">SG rate</td>
                        <td className="px-5 py-3">11%</td>
                        <td className="px-5 py-3 font-medium">12%</td>
                        <td className="px-5 py-3">Extra <strong>$100</strong> super per $10K bonus</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-3">Concessional super cap</td>
                        <td className="px-5 py-3">$27,500</td>
                        <td className="px-5 py-3 font-medium">$30,000</td>
                        <td className="px-5 py-3">More room to salary sacrifice bonuses</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The combined effect is meaningful. A worker on $100,000 receiving a $10,000 bonus now pays <strong>$3,200</strong> in bonus tax (including Medicare levy) compared to <strong>$3,450</strong> under the old rates — an annual saving of <strong>$250</strong>. Workers earning between $120,000 and $135,000 benefit the most: their bonus marginal rate dropped from 39% (including Medicare) to 32%, saving <strong>$700</strong> per $10,000 bonus. Use our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to compare your take-home pay across financial years.
              </p>
            </section>

            <section id="related-resources">
              <h2>Related Resources</h2>
              <p>
                These Australian tax calculators and guides provide additional context for understanding how bonuses affect your take-home pay, superannuation, and overall tax position.
              </p>
              <ul>
                <li><Link href="/bonus-tax-calculator/">Bonus Tax Calculator</Link> — enter your salary and bonus to see the exact withholding amount and net bonus</li>
                <li><Link href="/salary-sacrifice-guide/">Salary Sacrifice Guide</Link> — step-by-step explanation of how salary sacrifice reduces taxable income on bonuses</li>
                <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> — calculate your full income tax liability across all sources for FY2025-26</li>
                <li><Link href="/superannuation-guide/">Superannuation Guide</Link> — SG rates, contribution caps, and employer obligations</li>
                <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> — model your complete after-tax income including salary, bonus, and super</li>
                <li><Link href="/payg-withholding-tables/">PAYG Withholding Tables</Link> — full ATO withholding lookup tables for regular and supplementary payments</li>
              </ul>
            </section>

            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="tax-back" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Will I get the tax on my bonus back at tax time?</AccordionTrigger>
                  <AccordionContent className="text-navy">Potentially some of it. If your employer over-withheld (i.e., withheld more than your actual tax liability), you will receive a refund. The Schedule 5 method generally minimises this gap, so most people receive close to the correct amount.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="salary-sacrifice" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I salary sacrifice my bonus into super?</AccordionTrigger>
                  <AccordionContent className="text-navy">Yes, if your employer allows it. Directing your bonus into super as a concessional contribution means it is taxed at only 15% (instead of your marginal rate). However, the contribution counts towards your $30,000 concessional cap. See our <Link href="/salary-sacrifice-guide/" className="text-eucalyptus-dark hover:underline">salary sacrifice guide</Link> for details.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="timing" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does it matter which financial year my bonus is paid?</AccordionTrigger>
                  <AccordionContent className="text-navy">Yes. A bonus is assessable income in the year it is paid (not earned). If your employer pays a FY2025 bonus in July 2025, it falls into FY2025-26. If you have control over timing, consider whether deferring to a lower-income year could reduce tax.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="bonus-rate" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is there a flat bonus tax rate in Australia?</AccordionTrigger>
                  <AccordionContent className="text-navy">No. Australia does not have a flat bonus tax rate. Bonuses are taxed at your marginal tax rate, which ranges from <strong>0% to 45%</strong> (plus 2% Medicare levy) depending on your total taxable income for FY2025-26. The ATO treats bonus income identically to salary income for tax purposes.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="super-on-bonus" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does my employer pay super on my bonus?</AccordionTrigger>
                  <AccordionContent className="text-navy">Yes, for performance-related bonuses. Bonuses classified as &quot;Ordinary Time Earnings&quot; attract the <strong>12% Superannuation Guarantee</strong>. A $10,000 performance bonus generates $1,200 in additional super. Sign-on bonuses, retention bonuses, and referral bonuses are generally excluded from OTE and do not attract SG.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="hecs-help" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does my bonus affect HECS-HELP repayments?</AccordionTrigger>
                  <AccordionContent className="text-navy">Yes. Your bonus increases your &quot;repayment income&quot; for HECS-HELP purposes. If the bonus pushes your total income above a repayment threshold, your compulsory repayment rate increases. For FY2026-27, repayments start at 15c per dollar once income exceeds $69,528. See our <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Guide</Link> for the full threshold table.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="over-withholding" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Why was so much tax taken from my bonus?</AccordionTrigger>
                  <AccordionContent className="text-navy">Your bonus sits on top of your regular salary, so every dollar is taxed at your highest marginal rate. A worker earning $90,000 pays an average tax rate of about <strong>23%</strong> on total income but the bonus is taxed at <strong>32%</strong> (30% plus 2% Medicare levy) because it falls entirely in the top bracket. Some payroll systems also annualise the pay period containing the bonus, which can produce even higher withholding that is corrected when you lodge your return.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="commission-vs-bonus" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Are commissions taxed the same as bonuses?</AccordionTrigger>
                  <AccordionContent className="text-navy">Yes. The ATO treats commissions, bonuses, incentive payments, and profit-share distributions identically for PAYG withholding purposes. All are supplementary payments subject to Schedule 5 withholding at your marginal tax rate.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="two-bonuses" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What if I receive two bonuses in the same financial year?</AccordionTrigger>
                  <AccordionContent className="text-navy">Each bonus is taxed using Schedule 5 based on your year-to-date earnings at the time of payment. The second bonus sits on top of your salary <em>plus</em> the first bonus, so it is taxed at a potentially higher marginal rate. A worker on $120,000 who receives two $10,000 bonuses pays 32% on the first and 32% on the second (both within the $45K–$135K bracket). If the second bonus pushes total income above $135,000, the portion above $135,000 is taxed at <strong>39%</strong>.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="part-time" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How are bonuses taxed for part-time or casual workers?</AccordionTrigger>
                  <AccordionContent className="text-navy">The same way as full-time workers. The ATO does not differentiate between employment types for bonus taxation. A part-time worker earning $30,000 per year who receives a $5,000 bonus has the bonus taxed at the 16% marginal rate (plus 2% Medicare levy) because total income of $35,000 falls in the $18,201–$45,000 bracket. The lower income base means part-time workers typically face a lower marginal rate on bonuses than full-time workers.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="non-resident" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How are bonuses taxed for non-residents?</AccordionTrigger>
                  <AccordionContent className="text-navy">Non-residents do not receive the $18,200 tax-free threshold and pay tax from the first dollar. The non-resident marginal rate on bonuses starts at <strong>30%</strong> for income up to $135,000, then 37% up to $190,000, and 45% above $190,000. Non-residents do not pay the Medicare levy. See our <Link href="/non-resident-tax/" className="text-eucalyptus-dark hover:underline">Non-Resident Tax Guide</Link> for full rates.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="div293" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does Division 293 apply if my bonus pushes income above $250,000?</AccordionTrigger>
                  <AccordionContent className="text-navy">Yes. &quot;Division 293&quot; imposes an additional <strong>15% tax on concessional super contributions</strong> when income (including super contributions) exceeds $250,000. If a bonus pushes your combined income and super above this threshold, any concessional contributions — including salary-sacrificed bonus amounts — are taxed at 30% instead of 15% inside super.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Tax treatment information is sourced from ATO Schedule 5 documentation and current individual income tax rates for FY2025-26. Worked examples use approximate figures based on marginal rate calculations.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("bonus-tax-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3">Related Tools</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/bonus-tax-calculator/" label="Bonus Tax Calculator" />
                    <SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" />
                    <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
                    <SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Calculate your bonus tax</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Enter your salary and bonus to see exactly how much you take home.</p>
                  <Link href="/bonus-tax-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Bonus Tax Calculator →
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

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span>
      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
    </Link>
  );
}
