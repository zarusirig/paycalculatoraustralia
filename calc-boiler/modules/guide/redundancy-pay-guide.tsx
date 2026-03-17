"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Banknote, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Redundancy Pay & Entitlements", url: "https://www.fairwork.gov.au/ending-employment/redundancy/redundancy-pay-and-entitlements", publisher: SOURCES.fwo.name },
  { title: "Tax on Redundancy Payments", url: "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-as-an-employee/leaving-your-job/redundancy-payments", publisher: SOURCES.ato.name },
  { title: "Employment Termination Payments", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/engaging-a-worker/when-a-worker-leaves-your-business/taxation-of-termination-payments", publisher: SOURCES.ato.name },
  { title: "Long Service Leave", url: "https://www.fairwork.gov.au/leave/long-service-leave", publisher: SOURCES.fwo.name },
];

export default function RedundancyPayGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Redundancy Pay Guide</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Redundancy Pay Rights Australia
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Losing your job is incredibly stressful. Understand exactly what your employer legally owes you, how the National Employment Standards (NES) dictate weeks of pay, and the crucial "Tax-Free" component rules.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* SECTION 1 */}
            <section id="what-is-redundancy-pay">
              <h2>What Is Redundancy Pay in Australia?</h2>
              <p>
                Redundancy pay is a <strong>lump-sum severance payment</strong> an employer owes an employee whose position is permanently eliminated due to operational changes. The Fair Work Act 2009 sets the minimum redundancy entitlement through the National Employment Standards (NES), which apply to all national-system employees across every Australian state and territory.
              </p>
              <p>
                Redundancy pay compensates workers for the loss of job security, seniority, and future earnings capacity. The payment is calculated as a set number of weeks of the employee&apos;s base pay rate, determined entirely by their length of continuous service. An employee with <strong>1 year of service receives 4 weeks</strong> of base pay; an employee with <strong>9 years receives the maximum of 16 weeks</strong>. Base pay excludes overtime, bonuses, loadings, and allowances.
              </p>
              <p>
                Redundancy pay is separate from notice pay, accrued annual leave, and long service leave. All four components stack together to form the total termination payout. Use our <Link href="/redundancy-pay-calculator/">Redundancy Pay Calculator</Link> to model the exact dollar breakdown for your salary and service length.
              </p>
            </section>

            {/* SECTION 2 */}
            <section id="how-is-redundancy-pay-calculated">
              <h2>How Is Redundancy Pay Calculated?</h2>
              <p>
                Redundancy pay is calculated by multiplying the employee&apos;s <strong>base weekly pay rate by the number of severance weeks</strong> prescribed in the NES table below. The base rate is the ordinary-hours rate excluding overtime, incentive payments, bonuses, loadings, monetary allowances, and penalty rates.
              </p>
              <p>
                The number of severance weeks increases with continuous service, starting at <strong>4 weeks for 1 year</strong> and peaking at <strong>16 weeks for 9&ndash;10 years</strong>. After 10 years, the entitlement drops to 12 weeks because the employee typically qualifies for long service leave, which serves as a separate compensation mechanism.
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Continuous Service Time...</th>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Redundancy Pay (Weeks)</th>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Example at $1,500/week</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr className="bg-sandstone"><td className="px-6 py-3">Less than 1 year</td><td className="px-6 py-3 font-semibold text-warmgray-light">Nil (0 weeks)</td><td className="px-6 py-3 text-warmgray-light">$0</td></tr>
                      <tr><td className="px-6 py-3">At least 1 yr, but less than 2 yrs</td><td className="px-6 py-3 font-semibold">4 weeks</td><td className="px-6 py-3">$6,000</td></tr>
                      <tr><td className="px-6 py-3">At least 2 yrs, but less than 3 yrs</td><td className="px-6 py-3 font-semibold">6 weeks</td><td className="px-6 py-3">$9,000</td></tr>
                      <tr><td className="px-6 py-3">At least 3 yrs, but less than 4 yrs</td><td className="px-6 py-3 font-semibold">7 weeks</td><td className="px-6 py-3">$10,500</td></tr>
                      <tr><td className="px-6 py-3">At least 4 yrs, but less than 5 yrs</td><td className="px-6 py-3 font-semibold">8 weeks</td><td className="px-6 py-3">$12,000</td></tr>
                      <tr><td className="px-6 py-3">At least 5 yrs, but less than 6 yrs</td><td className="px-6 py-3 font-semibold">10 weeks</td><td className="px-6 py-3">$15,000</td></tr>
                      <tr><td className="px-6 py-3">At least 6 yrs, but less than 7 yrs</td><td className="px-6 py-3 font-semibold">11 weeks</td><td className="px-6 py-3">$16,500</td></tr>
                      <tr><td className="px-6 py-3">At least 7 yrs, but less than 8 yrs</td><td className="px-6 py-3 font-semibold">13 weeks</td><td className="px-6 py-3">$19,500</td></tr>
                      <tr><td className="px-6 py-3">At least 8 yrs, but less than 9 yrs</td><td className="px-6 py-3 font-semibold">14 weeks</td><td className="px-6 py-3">$21,000</td></tr>
                      <tr className="bg-eucalyptus-light/40"><td className="px-6 py-3 font-semibold text-navy">At least 9 yrs, but less than 10 yrs</td><td className="px-6 py-3 font-bold text-eucalyptus-dark">16 weeks (Maximum Cap)</td><td className="px-6 py-3 font-bold text-eucalyptus-dark">$24,000</td></tr>
                      <tr><td className="px-6 py-3 italic">At least 10 yrs +</td><td className="px-6 py-3 italic">Drops to 12 weeks (assuming Long Service Leave unlocks)</td><td className="px-6 py-3 italic">$18,000</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p>
                The calculation formula is straightforward: <strong>Base weekly pay x NES weeks = gross redundancy payment</strong>. An employee earning $85,000 per year has a base weekly rate of approximately $1,634.62. With 6 years of continuous service, the NES prescribes 11 weeks, producing a gross redundancy payment of <strong>$17,980.77</strong>. This amount is separate from any accrued leave, notice pay, or above-NES contractual severance.
              </p>
              <p>
                Enterprise agreements, modern awards, and individual employment contracts frequently provide redundancy entitlements above the NES minimum. These enhanced terms override the NES only when they are more generous. Check your employment contract or applicable <Link href="/award-rates/">Award Rates</Link> to determine whether your entitlement exceeds the statutory floor.
              </p>
            </section>

            {/* SECTION 3 */}
            <section id="genuine-vs-nongenuine">
              <h2>What Is Genuine vs Non-Genuine Redundancy?</h2>
              <p>
                A &quot;Genuine Redundancy&quot; is a termination where the employer <strong>no longer requires the job to be performed by anyone</strong> and has complied with all consultation obligations in the applicable modern award or enterprise agreement. The distinction between genuine and non-genuine redundancy determines whether the tax-free component applies to the severance payment.
              </p>

              <div className="grid md:grid-cols-2 gap-4 not-prose my-6 text-sm">
                <div className="bg-eucalyptus-light/30 border border-sandstone-dark/20 rounded-lg p-5">
                  <h4 className="font-bold text-eucalyptus-dark mb-2 flex items-center gap-2">
                    Genuine Redundancy
                  </h4>
                  <ul className="space-y-1 text-eucalyptus-dark list-disc list-inside">
                    <li>The employer&apos;s business undergoes major operational changes (like adopting AI, merging with a rival, or going bankrupt).</li>
                    <li>The job you were doing simply does not need to be done by <em>anyone</em> anymore.</li>
                    <li>The employer followed all legal consultation requirements before pulling the trigger.</li>
                  </ul>
                </div>
                <div className="bg-sandstone border border-sandstone-dark/20 rounded-lg p-5">
                  <h4 className="font-bold text-ochre mb-2 flex items-center gap-2">
                    Non-Genuine Redundancy
                  </h4>
                  <ul className="space-y-1 text-ochre list-disc list-inside">
                    <li>You were fired for poor performance or gross misconduct.</li>
                    <li>They let you go, but immediately hired someone else to sit in your exact chair and do your exact job (this is grounds for Unfair Dismissal).</li>
                    <li>They could have redeployed you to a different department but chose not to.</li>
                  </ul>
                </div>
              </div>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Feature</th>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Genuine Redundancy</th>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Non-Genuine Redundancy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-3 font-medium">Tax-free component</td><td className="px-6 py-3">Yes &mdash; up to ATO limit</td><td className="px-6 py-3">No &mdash; fully taxable as ETP</td></tr>
                      <tr><td className="px-6 py-3 font-medium">Job still exists?</td><td className="px-6 py-3">No &mdash; role permanently eliminated</td><td className="px-6 py-3">Yes &mdash; someone else performs the role</td></tr>
                      <tr><td className="px-6 py-3 font-medium">Consultation required?</td><td className="px-6 py-3">Yes &mdash; per award/agreement</td><td className="px-6 py-3">Not met or not applicable</td></tr>
                      <tr><td className="px-6 py-3 font-medium">Redeployment attempted?</td><td className="px-6 py-3">Yes &mdash; reasonable efforts made</td><td className="px-6 py-3">No &mdash; employer skipped this step</td></tr>
                      <tr><td className="px-6 py-3 font-medium">Unfair dismissal claim?</td><td className="px-6 py-3">Generally not available</td><td className="px-6 py-3">Available &mdash; lodge within 21 days</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p>
                The ATO independently assesses whether a redundancy qualifies as genuine at tax time. An employer labelling a termination &quot;redundancy&quot; on the separation certificate does not guarantee genuine status. The employee must also be under age 65 at the time of dismissal to access the tax-free component. Employees over preservation age who receive a non-genuine redundancy have the entire payment taxed as an Employment Termination Payment at marginal or concessional ETP rates.
              </p>
            </section>

            {/* SECTION 4 */}
            <section id="step-by-step-redundancy">
              <h2>Step-by-Step: What Happens When You Are Made Redundant?</h2>
              <p>
                The redundancy process follows a <strong>legally mandated sequence</strong> under the Fair Work Act 2009 and applicable modern awards. Employers who skip steps expose themselves to unfair dismissal claims, penalties, and orders for compensation.
              </p>
              <ol>
                <li><strong>Consultation notice:</strong> The employer notifies affected employees and any union representatives that redundancies are being considered. The applicable award or enterprise agreement specifies minimum consultation periods, typically <strong>7&ndash;14 days</strong>.</li>
                <li><strong>Redeployment assessment:</strong> The employer assesses whether the employee can be redeployed to a suitable alternative position within the business or any associated entity. Failure to undertake this step converts a genuine redundancy into a non-genuine one.</li>
                <li><strong>Written notice of termination:</strong> The employer provides formal written notice. The minimum notice period is <strong>1 week</strong> for employees with less than 1 year of service, <strong>2 weeks</strong> for 1&ndash;3 years, <strong>3 weeks</strong> for 3&ndash;5 years, and <strong>4 weeks</strong> for 5+ years. Employees over 45 with at least 2 years of service receive an additional week.</li>
                <li><strong>Final pay calculation:</strong> The employer calculates all entitlements: redundancy pay (NES weeks), notice pay (or payment in lieu), accrued annual leave, accrued long service leave, and any outstanding wages or loadings.</li>
                <li><strong>Payment and separation certificate:</strong> Final payments must be made on or before the employee&apos;s last working day, or no later than <strong>7 days after termination</strong>. The employer issues a separation certificate and PAYG payment summary reflecting the tax-free component (if genuine) and any ETP amounts.</li>
                <li><strong>Centrelink waiting period:</strong> The employee may apply for JobSeeker Payment, but redundancy pay and leave payouts generate an &quot;Income Maintenance Period&quot; that delays eligibility by the number of weeks covered by the payout. Check our <Link href="/centrelink-income-test/">Centrelink Income Test</Link> guide for threshold details.</li>
              </ol>
            </section>

            {/* SECTION 5 */}
            <section id="how-is-redundancy-pay-taxed">
              <h2>How Is Redundancy Pay Taxed?</h2>
              <p>
                Genuine redundancy payments are <strong>tax-free up to a limit</strong> set annually by the ATO. For FY2025-26, the tax-free limit is a base amount of <strong>$12,524</strong> plus <strong>$6,263 for each completed year of continuous service</strong>. Any amount exceeding this limit is taxed as an Employment Termination Payment (ETP).
              </p>

              <h3>Tax-Free Limit Formula</h3>
              <p>
                The formula is: <strong>Tax-free amount = $12,524 + ($6,263 x completed years of service)</strong>. The ATO indexes these thresholds annually. Only whole completed years count &mdash; 4 years and 11 months rounds down to 4 years.
              </p>

              <h3>Worked Example: Taxing a $90,000 Redundancy Package</h3>
              <p>
                Sarah earns <strong>$95,000 per year</strong> and is made genuinely redundant after <strong>8 complete years</strong> of service. Her employer pays her a total redundancy package of <strong>$90,000</strong>, which includes 14 weeks of NES redundancy pay plus a contractual top-up.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Component</th>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Calculation</th>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-3">Tax-free base</td><td className="px-6 py-3">$12,524</td><td className="px-6 py-3 font-semibold">$12,524</td></tr>
                      <tr><td className="px-6 py-3">Tax-free service component</td><td className="px-6 py-3">$6,263 x 8 years</td><td className="px-6 py-3 font-semibold">$50,104</td></tr>
                      <tr className="bg-eucalyptus-light/40"><td className="px-6 py-3 font-semibold">Total tax-free limit</td><td className="px-6 py-3">$12,524 + $50,104</td><td className="px-6 py-3 font-bold text-eucalyptus-dark">$62,628</td></tr>
                      <tr><td className="px-6 py-3">Total redundancy payment</td><td className="px-6 py-3">&mdash;</td><td className="px-6 py-3 font-semibold">$90,000</td></tr>
                      <tr className="bg-sandstone"><td className="px-6 py-3 font-semibold">Taxable ETP component</td><td className="px-6 py-3">$90,000 &minus; $62,628</td><td className="px-6 py-3 font-bold text-ochre">$27,372</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Sarah receives <strong>$62,628 completely tax-free</strong>. The remaining <strong>$27,372</strong> is classified as an ETP. Because Sarah is under 65 and under preservation age, this ETP component is taxed at a maximum rate of <strong>32%</strong> (including the 2% Medicare levy) up to the ETP cap of <strong>$245,000</strong> for FY2025-26. Her tax on the ETP portion is approximately <strong>$8,759</strong>.
              </p>
              <p>
                Use the Australian tax calculator on our <Link href="/">Pay Calculator</Link> home page to model how your total income in the termination year affects your marginal tax rate and overall take-home pay after redundancy.
              </p>
            </section>

            {/* SECTION 6 */}
            <section id="etp-tax">
              <h2>What Are Employment Termination Payments (ETPs)?</h2>
              <p>
                An Employment Termination Payment is <strong>any lump sum paid to an employee because their employment ends</strong>, excluding the genuine redundancy tax-free component, accrued leave, and superannuation. ETPs include golden handshakes, gratuities, non-genuine redundancy payments, and any genuine redundancy amount that exceeds the ATO&apos;s tax-free limit.
              </p>
              <p>
                The ATO classifies ETPs into two types. A &quot;Life Benefit ETP&quot; is paid directly to the employee while alive. A &quot;Death Benefit ETP&quot; is paid to a dependant or the estate of a deceased employee. The tax treatment differs significantly between the two, and within life benefit ETPs, the rate varies based on whether the employee has reached preservation age.
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Employee Age</th>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">ETP Tax Rate (up to cap)</th>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Above ETP Cap</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-3">Below preservation age</td><td className="px-6 py-3 font-semibold">32% (including Medicare levy)</td><td className="px-6 py-3">Top marginal rate (47%)</td></tr>
                      <tr><td className="px-6 py-3">At or above preservation age</td><td className="px-6 py-3 font-semibold">17% (including Medicare levy)</td><td className="px-6 py-3">Top marginal rate (47%)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p>
                The ETP cap for FY2025-26 is <strong>$245,000</strong>. Any ETP amount exceeding this cap is taxed at the top marginal rate of <strong>47%</strong> (including Medicare levy). The whole-of-income cap also applies &mdash; if your total taxable income plus ETP exceeds <strong>$180,000</strong>, the portion above that threshold is taxed at 47%. Understanding these thresholds is critical for executives and long-tenured employees with large separation packages.
              </p>
            </section>

            {/* SECTION 7 */}
            <section id="other-termination-entitlements">
              <h2>What Other Entitlements Are Paid on Termination?</h2>
              <p>
                Redundancy pay is only one component of the total termination payout. Employees are entitled to <strong>at least 4 additional payments</strong> on top of their NES redundancy: notice pay, accrued annual leave, accrued long service leave (if eligible), and outstanding wages.
              </p>

              <h3>Notice Pay (Payment in Lieu of Notice)</h3>
              <p>
                Notice pay compensates the employee for the notice period they would have worked. The NES minimum notice period ranges from <strong>1 week</strong> (under 1 year of service) to <strong>5 weeks</strong> (over 45 years old with 5+ years of service). Payment in lieu of notice is <strong>taxed as ordinary income</strong> at the employee&apos;s marginal PAYG withholding rate, not at concessional ETP rates. Use our <Link href="/payg-withholding-tables/">PAYG Withholding Tables</Link> to check the applicable rate.
              </p>

              <h3>Accrued Annual Leave</h3>
              <p>
                All untaken annual leave must be paid out on termination regardless of the reason for ending employment. Annual leave is taxed at the employee&apos;s marginal rate. A <strong>17.5% annual leave loading</strong> applies under most modern awards, calculated on the base rate of pay for the accrued leave hours. Check our <Link href="/annual-leave-guide/">Annual Leave Guide</Link> for loading details by industry.
              </p>

              <h3>Outstanding Wages and Allowances</h3>
              <p>
                The employer must pay all wages earned up to the termination date, including shift loadings, penalty rates, overtime, commissions, and allowances. These amounts are taxed as ordinary income at the employee&apos;s marginal rate.
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Payment Type</th>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Tax Treatment</th>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">NES Minimum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-3">Redundancy pay (genuine)</td><td className="px-6 py-3">Tax-free up to ATO limit; excess taxed as ETP</td><td className="px-6 py-3">4&ndash;16 weeks by service</td></tr>
                      <tr><td className="px-6 py-3">Notice pay (in lieu)</td><td className="px-6 py-3">Ordinary income &mdash; marginal PAYG rate</td><td className="px-6 py-3">1&ndash;5 weeks by service/age</td></tr>
                      <tr><td className="px-6 py-3">Accrued annual leave</td><td className="px-6 py-3">Ordinary income &mdash; marginal rate</td><td className="px-6 py-3">All untaken balance</td></tr>
                      <tr><td className="px-6 py-3">Long service leave</td><td className="px-6 py-3">Concessional rate for pre-16/8/1978; otherwise marginal</td><td className="px-6 py-3">Varies by state</td></tr>
                      <tr><td className="px-6 py-3">Outstanding wages</td><td className="px-6 py-3">Ordinary income &mdash; marginal rate</td><td className="px-6 py-3">All earned wages</td></tr>
                      <tr><td className="px-6 py-3">Superannuation</td><td className="px-6 py-3">Contributed to super fund at SG rate</td><td className="px-6 py-3">12% of OTE</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p>
                The employer&apos;s superannuation guarantee obligation of <strong>12% for FY2025-26</strong> applies to ordinary time earnings up to and including the termination date. Super is not payable on the redundancy pay component itself, but it is payable on notice pay worked out. Read our <Link href="/superannuation-guide/">Superannuation Guide</Link> for detailed SG rate information.
              </p>
            </section>

            {/* SECTION 8 */}
            <section id="small-business-exemptions">
              <h2>Are Small Businesses Exempt from Redundancy Pay?</h2>
              <p>
                Small businesses with <strong>fewer than 15 employees</strong> at the time of termination are fully exempt from paying NES redundancy pay. This exemption is absolute &mdash; the employer pays zero weeks of severance regardless of how long the employee worked there.
              </p>

              <div className="bg-sandstone border border-sandstone-dark/20 p-6 rounded-xl not-prose my-6 text-sm">
                <div className="flex items-start gap-4">
                  <ShieldAlert className="h-6 w-6 text-warmgray mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Small Business Exemption</h3>
                    <p className="text-navy">If your employer is a &quot;Small Business&quot; (fewer than 15 total employees across the whole company), they are legally exempt from having to pay you any statutory redundancy pay at all under the base NES. Always verify headcount.</p>
                  </div>
                </div>
              </div>

              <p>
                The 15-employee threshold counts all employees including casual employees engaged on a regular and systematic basis. It includes employees across all locations, branches, and associated entities. Part-time employees count as one full headcount, not a fraction. The headcount is assessed at the exact time the termination notice is given, not at the start of employment or any earlier date.
              </p>
              <p>
                Even when the small business exemption applies, the employer still owes notice pay, accrued annual leave, accrued long service leave, and outstanding wages. Only the redundancy pay (severance weeks) component is exempt. Employees of small businesses who believe the headcount was artificially reduced to trigger the exemption can challenge the decision through the Fair Work Commission.
              </p>
              <p>
                Some enterprise agreements and employment contracts override the small business exemption by including redundancy clauses that apply regardless of employer size. Always check the specific terms of your agreement.
              </p>
            </section>

            {/* CONTEXT BORDER */}

            {/* SECTION 9 */}
            <section id="state-long-service-leave">
              <h2>How Does Long Service Leave on Redundancy Vary by State?</h2>
              <p>
                Long service leave entitlements on redundancy are governed by <strong>state and territory legislation</strong>, not the NES. Each jurisdiction sets different qualifying periods, accrual rates, and pro-rata access rules for employees terminated by redundancy.
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">State/Territory</th>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Full Entitlement</th>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Pro-Rata on Redundancy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-3 font-medium">NSW</td><td className="px-6 py-3">2 months after 10 years</td><td className="px-6 py-3">Available after 5 years</td></tr>
                      <tr><td className="px-6 py-3 font-medium">VIC</td><td className="px-6 py-3">8.67 weeks after 10 years</td><td className="px-6 py-3">Available after 7 years</td></tr>
                      <tr><td className="px-6 py-3 font-medium">QLD</td><td className="px-6 py-3">8.67 weeks after 10 years</td><td className="px-6 py-3">Available after 7 years</td></tr>
                      <tr><td className="px-6 py-3 font-medium">SA</td><td className="px-6 py-3">13 weeks after 10 years</td><td className="px-6 py-3">Available after 7 years</td></tr>
                      <tr><td className="px-6 py-3 font-medium">WA</td><td className="px-6 py-3">8.67 weeks after 10 years</td><td className="px-6 py-3">Available after 7 years</td></tr>
                      <tr><td className="px-6 py-3 font-medium">TAS</td><td className="px-6 py-3">8.67 weeks after 10 years</td><td className="px-6 py-3">Available after 7 years</td></tr>
                      <tr><td className="px-6 py-3 font-medium">NT</td><td className="px-6 py-3">13 weeks after 10 years</td><td className="px-6 py-3">Available after 7 years</td></tr>
                      <tr><td className="px-6 py-3 font-medium">ACT</td><td className="px-6 py-3">6.07 weeks after 7 years</td><td className="px-6 py-3">Available after 5 years</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p>
                In NSW, employees terminated by redundancy after <strong>5 years</strong> of continuous service receive a pro-rata long service leave payout, the most accessible threshold in Australia. South Australia and the Northern Territory provide the most generous full entitlement at <strong>13 weeks after 10 years</strong>. Victoria, Queensland, Western Australia, and Tasmania share the standard <strong>8.67 weeks after 10 years</strong> with pro-rata access after 7 years on redundancy.
              </p>
              <p>
                Long service leave payouts on redundancy are taxed differently depending on when the leave was accrued. Leave accrued before <strong>16 August 1978</strong> is entirely tax-free. Leave accrued between 16 August 1978 and 17 August 1993 is taxed at a flat <strong>32%</strong>. Leave accrued after 17 August 1993 is taxed at the employee&apos;s marginal rate.
              </p>
            </section>

            {/* SECTION 10 */}
            <section id="changes-fy2025-26">
              <h2>What Changed in FY2025-26?</h2>
              <p>
                The ATO indexed the genuine redundancy tax-free limits for FY2025-26, increasing the base limit to <strong>$12,524</strong> and the per-year-of-service amount to <strong>$6,263</strong>. These figures rose from $12,094 and $6,049 respectively in FY2024-25, reflecting CPI indexation.
              </p>
              <p>
                The ETP cap for FY2025-26 increased to <strong>$245,000</strong>, up from $235,000 in FY2024-25. The whole-of-income cap remains at <strong>$180,000</strong>. These caps determine at what point ETP taxation escalates to the top marginal rate of 47%.
              </p>
              <p>
                The superannuation guarantee rate remains at <strong>12%</strong> for FY2025-26, holding steady after the final legislated increase took effect on 1 July 2025. Employers must pay SG on ordinary time earnings up to the maximum super contribution base of <strong>$65,070 per quarter</strong>. This affects the superannuation component of termination payouts for high-income employees.
              </p>
              <p>
                Income tax brackets for FY2025-26 reflect the Stage 3 tax cuts implemented from 1 July 2024, with the 19% bracket applying to income between <strong>$18,201 and $45,000</strong>, the 30% bracket from <strong>$45,001 to $135,000</strong>, the 37% bracket from <strong>$135,001 to $190,000</strong>, and the 45% bracket above <strong>$190,000</strong>. These rates affect the marginal taxation of notice pay, accrued leave, and above-cap ETP amounts. Check our <Link href="/payg-withholding-tables/">PAYG Withholding Tables</Link> for the full FY2025-26 bracket structure.
              </p>
            </section>

            {/* SECTION 11 */}
            <section id="related-resources">
              <h2>Related Resources</h2>
              <p>
                These Australian tax and pay calculators provide detailed modelling for each component of a redundancy termination payout.
              </p>
              <ul>
                <li><Link href="/redundancy-pay-calculator/">Redundancy Pay Calculator</Link> &mdash; model the exact tax-free component, ETP tax, and net payout for your salary and service length</li>
                <li><Link href="/superannuation-guide/">Superannuation Guide</Link> &mdash; understand how the 12% SG rate applies to termination payments and ordinary time earnings</li>
                <li><Link href="/payg-withholding-tables/">PAYG Withholding Tables</Link> &mdash; check the withholding rates applied to notice pay and accrued leave payouts</li>
                <li><Link href="/annual-leave-guide/">Annual Leave Guide</Link> &mdash; calculate accrued annual leave balances and the 17.5% loading on payout</li>
                <li><Link href="/centrelink-income-test/">Centrelink Income Test</Link> &mdash; determine how redundancy payments affect JobSeeker eligibility and waiting periods</li>
                <li><Link href="/tax-refund-guide/">Tax Refund Guide</Link> &mdash; understand how a mid-year termination affects your annual tax refund calculation</li>
              </ul>
            </section>

            {/* SECTION 12: FAQ */}
            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="what-is" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is a genuine redundancy in Australia?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    A genuine redundancy occurs when the employer no longer needs the job to be done by anyone, usually due to restructuring, downsizing, or technology changes, and the employer has complied with all consultation obligations in the applicable modern award or enterprise agreement. The employee must also be under 65 years old at dismissal.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tax-free" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is my redundancy payout completely tax-free?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. The tax-free component is strictly capped at <strong>$12,524 plus $6,263 for each completed year of service</strong> in FY2025-26. Any amount exceeding this limit is taxed as an Employment Termination Payment, typically at <strong>32%</strong> for employees below preservation age or <strong>17%</strong> for those at or above preservation age.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="small" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Are small businesses exempt from redundancy pay?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Under the Fair Work Act, a business employing fewer than <strong>15 total employees</strong> at the time of the termination notice is exempt from paying statutory NES redundancy pay. The employer still owes notice pay, accrued annual leave, long service leave, and outstanding wages. Enterprise agreements may override this exemption.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="unfair" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What if my redundancy isn&apos;t genuine?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    If your employer makes your role &quot;redundant&quot; but immediately hires someone else to do the same job, it may be a case of <strong>unfair dismissal</strong>. You can lodge a complaint with the Fair Work Commission within <strong>21 days</strong> of being terminated. If the Commission finds the dismissal was not genuine, you may be entitled to reinstatement or compensation &mdash; potentially much more than the standard NES redundancy entitlement.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="unused-leave" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do I get paid out my unused leave when made redundant?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. On top of redundancy pay and notice pay, the employer must pay out all accrued but untaken annual leave including <strong>17.5% leave loading</strong> under most awards. Accrued long service leave is also payable if the employee meets the state-specific qualifying period, which is typically <strong>5&ndash;7 years</strong> on redundancy depending on the state.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="notice-vs-redundancy" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is notice pay the same as redundancy pay?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. Notice pay and redundancy pay are two entirely separate legal entitlements that stack on top of each other. Notice pay compensates for the minimum notice period (<strong>1&ndash;5 weeks</strong> depending on service and age) and is taxed as ordinary income at the employee&apos;s marginal PAYG rate. Redundancy pay compensates for the loss of the position (<strong>4&ndash;16 weeks</strong>) and the genuine component receives tax-free treatment up to the ATO limit.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="centrelink" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does redundancy pay affect my Centrelink payments?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Redundancy pay, notice pay, and leave payouts generate an &quot;Income Maintenance Period&quot; that delays JobSeeker Payment eligibility. The waiting period equals the number of weeks of pay received, calculated by dividing the total gross payout by the employee&apos;s weekly base rate. A <strong>$50,000 payout</strong> at a $1,500/week rate generates a waiting period of approximately <strong>33 weeks</strong>.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="super-on-redundancy" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is superannuation payable on redundancy pay?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. The <strong>12% superannuation guarantee</strong> for FY2025-26 is not payable on the redundancy pay (severance) component. SG is payable on ordinary time earnings up to the termination date, on notice pay if the notice period is worked out, and on accrued annual leave in some circumstances. SG is not payable on payment in lieu of notice, long service leave payouts, or ETPs.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="negotiate" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I negotiate a higher redundancy payout?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. The NES provides the <strong>minimum floor</strong>, not a maximum. Many employers offer above-NES redundancy packages, particularly for senior employees, long-tenured staff, or during mass retrenchments. Common negotiation points include additional weeks of pay, extended outplacement support, retention of company equipment, accelerated vesting of share options, and continued salary continuance insurance coverage for a defined period.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="preservation-age" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is preservation age and how does it affect redundancy tax?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Preservation age is the age at which you can access your superannuation. It is <strong>60 years</strong> for anyone born after 1 July 1964. For employees at or above preservation age at the time of redundancy, the ETP tax rate on amounts above the tax-free limit is a concessional <strong>17%</strong> (including Medicare levy) instead of the standard <strong>32%</strong>. This concessional rate applies up to the ETP cap of $245,000 for FY2025-26.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="casuals" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Are casual employees entitled to redundancy pay?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. Casual employees are <strong>not entitled to NES redundancy pay</strong>, regardless of how long they have worked for the employer. Only permanent full-time and part-time employees qualify. A casual employee who has been engaged on a regular and systematic basis for 12 months or more may have grounds to argue they are a permanent employee in substance, but this requires a formal conversion or Fair Work determination.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tax-return" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How do I report redundancy on my tax return?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The employer reports the tax-free redundancy component and ETP amount separately on the PAYG payment summary. The tax-free portion does not appear as assessable income on your tax return. The ETP component is reported at a specific label and taxed at the applicable ETP rate, not added to your ordinary income. Notice pay and leave payouts appear as regular salary and wages. Pre-fill data from the ATO typically populates these fields automatically in myTax.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl my-8">
                <div className="flex items-start gap-4">
                  <Banknote className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Calculate Your Exact Redundancy Payout</h3>
                    <p className="text-navy text-sm mb-3">Enter your salary, years of service, and accrued leave to see the complete tax-free breakdown, ETP tax, notice pay, and net amount deposited to your bank account.</p>
                    <Link href="/redundancy-pay-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Use Redundancy Pay Calculator <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Redundancy entitlements on this page are based on National Employment Standards (NES) under the Fair Work Act 2009. Tax-free component limits use current ATO Employment Termination Payment (ETP) rates for the FY2025-26 financial year. These thresholds are indexed annually by the ATO. Long service leave entitlements reflect state and territory legislation current as at March 2026. Income tax brackets reflect the Stage 3 tax cuts effective from 1 July 2024.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("redundancy-pay-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Guides</h3>
                  <div className="space-y-3">
                    <Link href="/redundancy-pay-calculator/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Redundancy Payout Calc</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/understanding-your-payslip/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Check Your Final Payslip</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/award-rates/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Check Industry Awards</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Check your ETP Trap</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">If your employer offers a cash payout vastly exceeding the NES grid, use our tool to see exactly how much the ATO will confiscate via ETP taxes.</p>
                  <Link href="/redundancy-pay-calculator/" className="block w-full py-2.5 px-4 bg-white text-ochre font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Calculate Payout
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
