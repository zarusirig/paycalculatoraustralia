"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Annual leave", url: "https://www.fairwork.gov.au/leave/annual-leave", publisher: SOURCES.fwo.name },
  { title: "National Employment Standards", url: "https://www.fairwork.gov.au/employment-conditions/national-employment-standards", publisher: SOURCES.fwo.name },
  { title: "Long service leave", url: "https://www.fairwork.gov.au/leave/long-service-leave", publisher: SOURCES.fwo.name },
  { title: "Leave loading", url: "https://www.fairwork.gov.au/pay-and-wages/allowances-penalty-rates-and-other-penalties", publisher: SOURCES.fwo.name },
];

export default function AnnualLeaveGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Annual Leave Guide</span></li></ol></nav>
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Annual Leave Guide Australia</h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">Your complete guide to annual leave entitlements, 17.5% leave loading, pro-rata calculations, and payout rules when you leave your job. Updated for FY2025-26.</p>
          <TrustBar className="!max-w-none" />
        </header>
        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

            {/* ── H2 1: How Much Annual Leave Do You Get in Australia? ── */}
            <section id="entitlements">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much Annual Leave Do You Get in Australia?</h2>
              <p>Full-time and part-time employees in Australia receive <strong>4 weeks (20 days) of paid annual leave per year</strong> under the National Employment Standards (NES).</p>
              <p>The entitlement is set by the <em>Fair Work Act 2009</em> and applies to every permanent employee regardless of industry, state, or salary level. Shift workers covered by an Award or registered agreement receive <strong>5 weeks (25 days)</strong> per year. Annual leave accrues progressively from an employee&apos;s first day of work, meaning a new hire does not need to wait 12 months before requesting time off.</p>
              <p>Part-time employees receive the same 4-week entitlement on a pro-rata basis. An employee working 20 ordinary hours per week accrues <strong>80 hours</strong> of annual leave per year instead of the 152 hours a full-time employee on a 38-hour week accumulates. Casual employees do not accrue annual leave at all; their <strong>25% casual loading</strong> compensates for the absence of leave entitlements, redundancy pay, and notice periods. Use our <Link href="/leave-calculator/">Leave Calculator</Link> to determine your exact accrued balance based on your start date and ordinary hours.</p>
            </section>

            {/* ── H2 2: How Is Annual Leave Calculated? ── */}
            <section id="accrual">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Annual Leave Calculated?</h2>
              <p>Annual leave accrues at a rate of <strong>1/13 of an employee&apos;s ordinary hours each 4-week cycle</strong>, which equates to approximately 2.923 hours per week for a 38-hour full-time employee.</p>
              <p>The Fair Work Act prescribes progressive accrual, not lump-sum crediting. Every pay period, your leave balance increases by a fraction of your annual entitlement. Below is a step-by-step calculation for a full-time employee working 38 hours per week.</p>
              <ol>
                <li><strong>Determine ordinary weekly hours.</strong> Standard full-time hours are 38 per week under most Awards. Part-time employees use their contracted ordinary hours.</li>
                <li><strong>Calculate annual entitlement in hours.</strong> Multiply ordinary weekly hours by 4 weeks: 38 &times; 4 = <strong>152 hours</strong> per year.</li>
                <li><strong>Derive the per-week accrual rate.</strong> Divide the annual entitlement by 52: 152 &divide; 52 = <strong>2.923 hours per week</strong>.</li>
                <li><strong>Apply to pay period.</strong> For fortnightly payroll: 2.923 &times; 2 = <strong>5.846 hours per fortnight</strong>. For monthly payroll: 152 &divide; 12 = <strong>12.667 hours per month</strong>.</li>
                <li><strong>Check balance.</strong> Unused leave rolls over each year with no expiry under the NES. After 24 months without taking leave, a full-time employee holds <strong>304 hours (40 days)</strong>.</li>
              </ol>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked Example: Pro-Rata Accrual for a Part-Time Employee</h3>
              <p>A part-time employee works 24 ordinary hours per week. The annual leave entitlement is 24 &times; 4 = <strong>96 hours per year</strong>. After 7 months of employment, the accrued balance is 96 &times; (7 &divide; 12) = <strong>56 hours (7 days)</strong>. This accrual happens automatically regardless of whether the employee has requested leave.</p>
              <p>Accrual continues during periods of paid leave (annual leave, personal leave, long service leave) but does not accrue during unpaid leave, unpaid parental leave, or community service leave (except jury duty). Your employer&apos;s payroll system calculates accrual each pay cycle. Check your payslip &mdash; our <Link href="/understanding-your-payslip/">Payslip Guide</Link> explains where to find your leave balance.</p>
            </section>

            {/* ── H2 3: What Is Leave Loading? ── */}
            <section id="leave-loading">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is Leave Loading?</h2>
              <p>Leave loading is an additional <strong>17.5% payment on top of base pay</strong> that eligible employees receive when they take annual leave.</p>
              <p>The 17.5% rate originated in the 1970s to compensate shift workers, weekend workers, and overtime-dependent employees for the penalty rates and allowances they forgo while on leave. Today, leave loading is not a universal NES entitlement &mdash; it depends on the applicable Award, enterprise agreement, or individual employment contract. Approximately <strong>60% of Award-covered employees</strong> receive leave loading.</p>
              <p>Some modern enterprise agreements replace leave loading with a higher base hourly rate. Employees covered by the General Retail Industry Award, the Hospitality Industry Award, and the Clerks&mdash;Private Sector Award all receive 17.5% leave loading. Employees on individual contracts without Award coverage receive leave loading only if their contract specifically includes it.</p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Leave Loading Worked Example</h3>
              <div className="not-prose bg-eucalyptus-light/30 border-l-4 border-green-500 p-4 my-6 text-sm text-warmgray">
                <strong>Scenario:</strong> An employee earns a base salary of $80,000 per year and takes 2 weeks of annual leave.<br /><br />
                <strong>Step 1 &mdash; Weekly base pay:</strong> $80,000 &divide; 52 = <strong>$1,538.46</strong><br />
                <strong>Step 2 &mdash; Leave loading per week:</strong> $1,538.46 &times; 17.5% = <strong>$269.23</strong><br />
                <strong>Step 3 &mdash; Total per week on leave:</strong> $1,538.46 + $269.23 = <strong>$1,807.69</strong><br />
                <strong>Step 4 &mdash; Total for 2 weeks:</strong> $1,807.69 &times; 2 = <strong>$3,615.38</strong><br /><br />
                The employee receives an additional <strong>$538.46</strong> in leave loading across the 2-week period. This amount is taxable income and is included in gross pay for PAYG withholding purposes. Use the <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to estimate the tax impact.
              </div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Leave Loading vs Penalty Rates: Which Is Higher?</h3>
              <p>Some Awards contain a &quot;better off overall&quot; clause. The employee receives either 17.5% leave loading <strong>or</strong> the penalty rates and shift loadings they would have earned &mdash; whichever amount is higher. The employer calculates both scenarios and pays the greater sum. For a nurse regularly working Saturday and Sunday shifts at 150% and 175% penalty rates, the penalty-rate comparison often exceeds the 17.5% loading. For a Monday-to-Friday office worker, the 17.5% loading is typically the higher amount. Consult our <Link href="/overtime-penalty-rates-guide/">Overtime &amp; Penalty Rates Guide</Link> for a full breakdown of penalty rate calculations.</p>
            </section>

            {/* ── H2 4: How Is Annual Leave Paid Out on Termination? ── */}
            <section id="payout">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Annual Leave Paid Out on Termination?</h2>
              <p>All accrued but untaken annual leave <strong>must be paid out in the employee&apos;s final pay</strong>, regardless of whether the termination is a resignation, redundancy, dismissal, or end of contract.</p>
              <p>The payout covers every hour of accumulated leave at the employee&apos;s base rate of pay at the time of termination. Leave loading is also included in the payout if the employee&apos;s Award, enterprise agreement, or contract provides for it. The payout is calculated as follows:</p>
              <ol>
                <li><strong>Determine accrued hours.</strong> Include all carried-over leave plus pro-rata accrual for the current period.</li>
                <li><strong>Calculate hourly rate.</strong> For a $90,000 salary on 38 hours/week: $90,000 &divide; (52 &times; 38) = <strong>$45.53 per hour</strong>.</li>
                <li><strong>Multiply.</strong> If the employee has 156 accrued hours: 156 &times; $45.53 = <strong>$7,102.68</strong>.</li>
                <li><strong>Add leave loading (if applicable).</strong> $7,102.68 &times; 17.5% = $1,242.97, bringing the total payout to <strong>$8,345.65</strong>.</li>
              </ol>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is the Annual Leave Payout Taxed?</h3>
              <p>Annual leave payouts are taxed at the employee&apos;s <Link href="/tax-brackets/">marginal tax rate</Link>. The ATO treats the payout as ordinary income in the pay period it is received, which can push the employee into a higher income tax bracket for that period. PAYG withholding applies at the marginal rate, and the Medicare levy of <strong>2%</strong> is also deducted. Employees with redundancy may receive concessional treatment on certain payments, but the annual leave component itself remains fully taxable. Use the <Link href="/redundancy-pay-calculator/">Redundancy Pay Calculator</Link> to model your total final pay including leave, notice, and redundancy amounts.</p>
            </section>

            {/* ── H2 5: Can Your Employer Force You to Take Leave? ── */}
            <section id="directed-leave">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Can Your Employer Force You to Take Annual Leave?</h2>
              <p>Yes &mdash; employers can direct employees to take annual leave in <strong>two specific situations</strong>: during a business shutdown and when the employee has an excessive leave balance.</p>
              <p>Many Awards and enterprise agreements include shutdown clauses covering periods such as Christmas, Easter, and mid-year breaks. During a registered shutdown, the employer gives at least <strong>28 days&apos; written notice</strong> and the employee must take annual leave for the shutdown period. If the employee has insufficient accrued leave, the employer and employee can agree to take the time as unpaid leave or as leave in advance.</p>
              <p>Excessive leave provisions apply when an employee&apos;s balance exceeds <strong>8 weeks (304 hours for full-time)</strong> or <strong>10 weeks for shift workers</strong>. The employer must first genuinely attempt to reach agreement on reducing the balance. If agreement cannot be reached within a reasonable period, the employer can issue a written direction requiring the employee to take a specified amount of leave. The direction must not reduce the balance below <strong>6 weeks</strong>, must provide at least <strong>8 weeks&apos; notice</strong>, and must not require the employee to take fewer than <strong>1 week</strong> at a time.</p>
              <p>Outside these situations, an employer cannot unreasonably refuse a leave request. The Fair Work Act requires that requests and refusals be &quot;reasonable,&quot; considering business needs, the employee&apos;s personal circumstances, and the amount of notice given.</p>
            </section>

            {/* ── H2 6: Annual Leave Entitlements Table ── */}
            <section id="entitlements-table">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Annual Leave Entitlements for Each Employment Type?</h2>
              <p>Annual leave entitlements differ based on employment type, with <strong>casual employees receiving no annual leave</strong> and shift workers receiving an extra week compared to standard full-time employees.</p>
              <div className="not-prose overflow-x-auto my-6">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                  <thead className="bg-navy text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Employment Type</th>
                      <th className="px-4 py-3 text-left font-semibold">Annual Leave (Weeks)</th>
                      <th className="px-4 py-3 text-left font-semibold">Hours/Year (38hr week)</th>
                      <th className="px-4 py-3 text-left font-semibold">Leave Loading</th>
                      <th className="px-4 py-3 text-left font-semibold">Paid Out on Termination</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-warmgray">
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-medium text-navy">Full-time</td>
                      <td className="px-4 py-3"><strong>4 weeks</strong></td>
                      <td className="px-4 py-3">152 hours</td>
                      <td className="px-4 py-3">17.5% (if Award applies)</td>
                      <td className="px-4 py-3">Yes</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 font-medium text-navy">Part-time</td>
                      <td className="px-4 py-3"><strong>4 weeks (pro-rata)</strong></td>
                      <td className="px-4 py-3">Pro-rata (e.g., 80 hrs at 20hr/wk)</td>
                      <td className="px-4 py-3">17.5% (if Award applies)</td>
                      <td className="px-4 py-3">Yes</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-medium text-navy">Shift worker</td>
                      <td className="px-4 py-3"><strong>5 weeks</strong></td>
                      <td className="px-4 py-3">190 hours</td>
                      <td className="px-4 py-3">17.5% or penalty rate comparison</td>
                      <td className="px-4 py-3">Yes</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 font-medium text-navy">Casual</td>
                      <td className="px-4 py-3"><strong>0 weeks</strong></td>
                      <td className="px-4 py-3">0 hours</td>
                      <td className="px-4 py-3">N/A (25% casual loading instead)</td>
                      <td className="px-4 py-3">No</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-medium text-navy">Fixed-term contract</td>
                      <td className="px-4 py-3"><strong>4 weeks</strong></td>
                      <td className="px-4 py-3">152 hours</td>
                      <td className="px-4 py-3">Per contract/Award</td>
                      <td className="px-4 py-3">Yes (at contract end)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>Fixed-term contract employees accrue leave identically to permanent employees. If the contract ends and is not renewed, all accrued leave is paid out in the final pay. Employees transitioning from casual to permanent begin accruing annual leave from the date of conversion. Prior casual service does not count toward leave accrual, but it may count toward long service leave in some states.</p>
            </section>

            {/* ── H2 7: What Is the Difference Between Annual Leave and Personal Leave? ── */}
            <section id="annual-vs-personal">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Difference Between Annual Leave and Personal Leave?</h2>
              <p>Annual leave is <strong>paid time off for rest and recreation</strong>, while personal/carer&apos;s leave covers absences due to illness, injury, or caring for a family member.</p>
              <div className="not-prose overflow-x-auto my-6">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                  <thead className="bg-navy text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Feature</th>
                      <th className="px-4 py-3 text-left font-semibold">Annual Leave</th>
                      <th className="px-4 py-3 text-left font-semibold">Personal/Carer&apos;s Leave</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-warmgray">
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-medium text-navy">Full-time entitlement</td>
                      <td className="px-4 py-3"><strong>4 weeks (20 days)</strong></td>
                      <td className="px-4 py-3"><strong>10 days per year</strong></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 font-medium text-navy">Purpose</td>
                      <td className="px-4 py-3">Rest, recreation, holidays</td>
                      <td className="px-4 py-3">Illness, injury, caring responsibilities</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-medium text-navy">Accumulates</td>
                      <td className="px-4 py-3">Yes, no cap under NES</td>
                      <td className="px-4 py-3">Yes, no cap under NES</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 font-medium text-navy">Paid out on termination</td>
                      <td className="px-4 py-3"><strong>Yes</strong></td>
                      <td className="px-4 py-3"><strong>No</strong></td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-medium text-navy">Leave loading applies</td>
                      <td className="px-4 py-3">Yes (if Award provides)</td>
                      <td className="px-4 py-3">No</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 font-medium text-navy">Evidence required</td>
                      <td className="px-4 py-3">No</td>
                      <td className="px-4 py-3">Medical certificate or statutory declaration</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-medium text-navy">Casual employees</td>
                      <td className="px-4 py-3">Not entitled</td>
                      <td className="px-4 py-3">Not entitled (unpaid carer&apos;s leave only)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>Personal leave has no cash value at the end of employment. An employee with 45 accumulated sick days who resigns receives <strong>$0</strong> for that balance. Annual leave, by contrast, converts to a cash payment in the final pay. This distinction makes annual leave a more valuable financial entitlement. Employees should use personal leave when genuinely unwell rather than drawing on annual leave, which preserves the leave balance and its eventual payout value.</p>
              <p>Compassionate leave (2 days per occasion) and unpaid family and domestic violence leave (10 days per year) are separate NES entitlements that do not reduce annual or personal leave balances.</p>
            </section>

            {/* ── CONTEXT BORDER ── */}

            {/* ── H2 8: State-by-State Long Service Leave Comparison ── */}
            <section id="long-service">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does Long Service Leave Compare Across Australian States?</h2>
              <p>Long service leave is governed by <strong>state and territory legislation</strong>, not the federal NES, and the qualifying period ranges from 7 years in the ACT to 10 years in most other jurisdictions.</p>
              <p>Unlike annual leave, which is nationally uniform, long service leave rules vary significantly between states. The table below compares the key parameters across all 8 states and territories.</p>
              <div className="not-prose overflow-x-auto my-6">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                  <thead className="bg-navy text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">State/Territory</th>
                      <th className="px-4 py-3 text-left font-semibold">Qualifying Period</th>
                      <th className="px-4 py-3 text-left font-semibold">Entitlement</th>
                      <th className="px-4 py-3 text-left font-semibold">Pro-Rata on Termination</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-warmgray">
                    <tr className="bg-white"><td className="px-4 py-3 font-medium text-navy">NSW</td><td className="px-4 py-3">10 years</td><td className="px-4 py-3"><strong>8.667 weeks</strong></td><td className="px-4 py-3">After 5 years (some circumstances)</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-3 font-medium text-navy">VIC</td><td className="px-4 py-3">7 years</td><td className="px-4 py-3"><strong>8.667 weeks</strong> after 10 years</td><td className="px-4 py-3">After 7 years</td></tr>
                    <tr className="bg-white"><td className="px-4 py-3 font-medium text-navy">QLD</td><td className="px-4 py-3">10 years</td><td className="px-4 py-3"><strong>8.667 weeks</strong></td><td className="px-4 py-3">After 7 years</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-3 font-medium text-navy">WA</td><td className="px-4 py-3">10 years</td><td className="px-4 py-3"><strong>8.667 weeks</strong></td><td className="px-4 py-3">After 7 years (retrenchment)</td></tr>
                    <tr className="bg-white"><td className="px-4 py-3 font-medium text-navy">SA</td><td className="px-4 py-3">10 years</td><td className="px-4 py-3"><strong>13 weeks</strong></td><td className="px-4 py-3">After 7 years</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-3 font-medium text-navy">TAS</td><td className="px-4 py-3">10 years</td><td className="px-4 py-3"><strong>8.667 weeks</strong></td><td className="px-4 py-3">After 7 years</td></tr>
                    <tr className="bg-white"><td className="px-4 py-3 font-medium text-navy">ACT</td><td className="px-4 py-3">7 years</td><td className="px-4 py-3"><strong>6.07 weeks</strong></td><td className="px-4 py-3">After 5 years</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-3 font-medium text-navy">NT</td><td className="px-4 py-3">10 years</td><td className="px-4 py-3"><strong>13 weeks (3 months)</strong></td><td className="px-4 py-3">After 7 years</td></tr>
                  </tbody>
                </table>
              </div>
              <p>South Australia and the Northern Territory offer the most generous long service leave at <strong>13 weeks after 10 years</strong>. Victoria and the ACT have the shortest qualifying periods at <strong>7 years</strong>. Long service leave payouts on termination may qualify for concessional tax treatment &mdash; pre-16 August 1978 service is taxed at a flat <strong>5%</strong>, while post-1978 service is taxed at <strong>32%</strong> (up to the whole-of-income cap). The remaining long service leave balance is taxed at the employee&apos;s marginal rate. Use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to model how a long service leave payout affects your overall take-home pay.</p>
            </section>

            {/* ── H2 9: What Changed in FY2025-26? ── */}
            <section id="changes-2025-26">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed for Annual Leave in FY2025-26?</h2>
              <p>The core annual leave entitlement of 4 weeks per year remains <strong>unchanged for FY2025-26</strong>, but several related changes affect how leave interacts with pay, tax, and superannuation.</p>
              <ul>
                <li><strong>Stage 3 tax cuts (from 1 July 2024):</strong> Lower marginal rates mean annual leave payouts on termination now attract less tax. An employee with $10,000 of accrued leave at the $90,000 salary level saves approximately <strong>$350 in tax</strong> compared to FY2023-24 rates.</li>
                <li><strong>Superannuation guarantee increased to 12%:</strong> The SG rate rose to <strong>12%</strong> from 1 July 2025. Employers paying annual leave must also pay super on ordinary-hours leave payments. This increases the total cost of leave for employers but does not change the employee&apos;s take-home pay during leave.</li>
                <li><strong>National minimum wage increase:</strong> The Fair Work Commission&apos;s 2025 Annual Wage Review set the national minimum wage at <strong>$26.44 per hour</strong> ($1,004.90 per week). Leave loading calculations for minimum-wage workers now use this higher base.</li>
                <li><strong>Right to disconnect:</strong> From 26 August 2024 (small businesses from 26 August 2025), employees have the right to refuse contact outside working hours. This right extends to periods of annual leave, meaning employers cannot require employees to respond to emails or calls while on leave.</li>
                <li><strong>Casual conversion changes:</strong> Revised casual employment provisions clarify that casual employees who convert to permanent employment begin accruing annual leave from the conversion date. Prior casual service does not generate retrospective leave accrual.</li>
              </ul>
              <p>The income tax brackets for FY2025-26 remain as adjusted by the Stage 3 tax cuts. Consult the <Link href="/tax-brackets/">Tax Brackets Guide</Link> for the full schedule of rates and thresholds applicable to leave payouts.</p>
            </section>

            {/* ── H2 10: Related Resources ── */}
            <section id="related-resources">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Resources</h2>
              <p>These tools and guides cover topics closely connected to annual leave entitlements, payouts, and pay calculations in Australia.</p>
              <ul>
                <li><Link href="/leave-calculator/">Leave Calculator</Link> &mdash; Calculate your accrued annual leave balance and payout value based on salary, start date, and ordinary hours.</li>
                <li><Link href="/redundancy-pay-calculator/">Redundancy Pay Calculator</Link> &mdash; Model your total termination payment including redundancy, notice period, and accrued leave.</li>
                <li><Link href="/superannuation-calculator/">Superannuation Calculator</Link> &mdash; See how the 12% SG rate applies to your salary and leave payments for FY2025-26.</li>
                <li><Link href="/understanding-your-payslip/">Understanding Your Payslip</Link> &mdash; Identify your leave balance, leave loading, and year-to-date accrual on your pay statement.</li>
                <li><Link href="/award-rates/">Award Rates Guide</Link> &mdash; Find the minimum pay rates, penalty rates, and leave loading provisions for your industry Award.</li>
                <li><Link href="/overtime-penalty-rates-guide/">Overtime &amp; Penalty Rates Guide</Link> &mdash; Understand how penalty rates interact with leave loading under the &quot;better off overall&quot; test.</li>
              </ul>
            </section>

            {/* ── H2 11: FAQs ── */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">

                <AccordionItem value="casual" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do casual employees get annual leave?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">No. Casual employees do not accrue annual leave under the National Employment Standards. They receive a <strong>25% casual loading</strong> on their hourly rate to compensate for the absence of annual leave, personal leave, and other permanent entitlements. A casual employee who converts to permanent employment begins accruing leave from the date of conversion.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="direction" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can my employer force me to take annual leave?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Yes, in two circumstances. Employers can direct employees to take leave during a <strong>registered shutdown period</strong> (e.g., Christmas closure) with 28 days&apos; notice. Employers can also direct employees with an excessive balance exceeding <strong>8 weeks</strong> to take leave, provided the direction does not reduce the balance below 6 weeks and gives at least 8 weeks&apos; notice.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="cashing" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I cash out annual leave instead of taking it?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Some Awards and enterprise agreements permit cashing out, but only if the employee retains a minimum balance of <strong>4 weeks</strong> after the cash-out. The arrangement must be a genuine written agreement, and each cash-out requires a separate agreement. Not all Awards allow cashing out &mdash; check your specific Award or agreement.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="accrual-unpaid" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does annual leave accrue during unpaid leave?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">No. Annual leave does not accrue during periods of <strong>unpaid leave</strong>, including unpaid parental leave and unpaid personal leave. Leave continues to accrue during paid leave (annual, personal, long service), workers&apos; compensation, and jury duty.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="sick-on-annual" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What happens if I get sick while on annual leave?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">An employee who falls ill or is injured during annual leave can apply to have that period re-credited as <strong>personal/carer&apos;s leave</strong> instead. The employee must provide evidence such as a medical certificate. The annual leave balance is restored, and personal leave is deducted for the sick days. This provision exists in the NES and applies to all permanent employees.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="public-holiday" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do public holidays count as annual leave?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">No. If a public holiday falls during a period of annual leave, that day is treated as a <strong>public holiday, not annual leave</strong>. The employee&apos;s annual leave balance is not reduced for that day. Australia has <strong>8 national public holidays</strong> plus additional state-specific holidays (e.g., Melbourne Cup Day in metro VIC, Royal Queensland Show in Brisbane).</AccordionContent>
                </AccordionItem>

                <AccordionItem value="leave-advance" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I take annual leave in advance before it accrues?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Yes, if the employer agrees. Leave taken in advance is deducted from future accruals. If the employee resigns or is terminated before accruing enough leave to cover the advance, the employer can deduct the overpayment from the employee&apos;s final pay. The deduction must be authorised in writing and cannot reduce the final pay below zero.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="leave-loading-taxed" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is leave loading taxed?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Yes. Leave loading is classified as <strong>ordinary time earnings</strong> and is subject to PAYG withholding at the employee&apos;s marginal tax rate. It is included in assessable income for the financial year. The 12% superannuation guarantee also applies to leave loading payments, as they form part of ordinary time earnings.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="part-time-accrual" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How much annual leave does a part-time employee get?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Part-time employees receive <strong>4 weeks of annual leave on a pro-rata basis</strong>. An employee working 25 hours per week accrues 25 &times; 4 = <strong>100 hours</strong> of annual leave per year. The entitlement is calculated on contracted ordinary hours, not total hours including overtime.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="lsl-annual" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does annual leave continue to accrue during long service leave?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Yes. Annual leave accrues during any period of <strong>paid long service leave</strong>. An employee taking 8.667 weeks of long service leave accrues approximately <strong>1.33 weeks</strong> of annual leave during that period (8.667 &divide; 52 &times; 4 &times; 2 = 1.33 weeks). This is because long service leave is a period of paid leave and the NES provides for continuous accrual during paid leave.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="super-on-leave" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does my employer pay superannuation on annual leave?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Yes. Annual leave payments are classified as <strong>ordinary time earnings (OTE)</strong>, and the employer must pay the <strong>12% superannuation guarantee</strong> on these amounts. This applies to both leave taken during employment and leave paid out on termination. The same rule applies to leave loading &mdash; super is payable on the loading component as well.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="max-balance" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is there a maximum annual leave balance?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">No. The NES does not impose a cap on annual leave accumulation. Leave carries over indefinitely from year to year. However, balances exceeding <strong>8 weeks (10 weeks for shift workers)</strong> are classified as &quot;excessive,&quot; and the employer can take steps to direct the employee to reduce the balance. Some enterprise agreements may include specific cap provisions.</AccordionContent>
                </AccordionItem>

              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works"><p>Leave entitlement data is sourced from the Fair Work Ombudsman and the National Employment Standards. State-specific long service leave information is sourced from relevant state legislation. Tax rates and superannuation thresholds reflect FY2025-26 values published by the Australian Taxation Office.</p></MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("annual-leave-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>
          </article>
          <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6">
            <Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related Tools</h3><div className="space-y-3"><SidebarLink href="/leave-calculator/" label="Leave Calculator" /><SidebarLink href="/redundancy-pay-calculator/" label="Redundancy Calculator" /><SidebarLink href="/understanding-your-payslip/" label="Payslip Guide" /><SidebarLink href="/award-rates/" label="Award Rates Guide" /></div></CardContent></Card>
            <Card className="bg-violet-600 border-none text-white shadow-md"><CardContent className="p-6"><h3 className="text-lg font-bold mb-2">Calculate your leave balance</h3><p className="text-violet-100 text-sm mb-4">Enter your salary and years of service to see your full entitlements and payout value.</p><Link href="/leave-calculator/" className="block w-full py-2.5 px-4 bg-white text-violet-700 font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">Leave Calculator →</Link></CardContent></Card>
          </div></aside>
        </div>
      </div>
    </div>
  );
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }
