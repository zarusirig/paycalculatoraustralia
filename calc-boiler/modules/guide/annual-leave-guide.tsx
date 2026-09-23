"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FaqAccordion from "@/components/common/faq-accordion";
import { ANNUAL_LEAVE_FAQS } from "./annual-leave-guide-faqs";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, EMPLOYMENT, TAX_BRACKETS, formatAUD } from "@/lib/constants";

// Payout example: $90,000 over 1,976 hours (38 x 52). The old copy used
// $45.53/hr; the correct figure is $45.55.
const PAYOUT_RATE = Math.round((90_000 / EMPLOYMENT.hoursPerYear) * 100) / 100;
const PAYOUT_BASE = Math.round(156 * PAYOUT_RATE * 100) / 100;
const PAYOUT_LOADING = Math.round(PAYOUT_BASE * 0.175 * 100) / 100;
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
          <p className="text-xl text-warmgray leading-relaxed mb-6">Your complete guide to annual leave entitlements, 17.5% leave loading, pro-rata calculations, and payout rules when you leave your job. Updated for FY{SITE_CONFIG.financialYear}.</p>
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
                <li><strong>Calculate hourly rate.</strong> For a $90,000 salary on 38 hours/week: $90,000 &divide; (52 &times; 38) = <strong>{formatAUD(PAYOUT_RATE, 2)} per hour</strong>.</li>
                <li><strong>Multiply.</strong> If the employee has 156 accrued hours: 156 &times; {formatAUD(PAYOUT_RATE, 2)} = <strong>{formatAUD(PAYOUT_BASE, 2)}</strong>.</li>
                <li><strong>Add leave loading (if applicable).</strong> {formatAUD(PAYOUT_BASE, 2)} &times; 17.5% = {formatAUD(PAYOUT_LOADING, 2)}, bringing the total payout to <strong>{formatAUD(PAYOUT_BASE + PAYOUT_LOADING, 2)}</strong>.</li>
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

            {/* ── H2 9: What Changed in FY2026-27? ── */}
            <section id="changes-2026-27">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed for Annual Leave in FY{SITE_CONFIG.financialYear}?</h2>
              <p>The core annual leave entitlement of 4 weeks per year is <strong>unchanged for FY{SITE_CONFIG.financialYear}</strong>, but several related changes from 1 July 2026 affect how leave interacts with pay, tax, and superannuation.</p>
              <ul>
                <li><strong>Lower tax on the second bracket:</strong> The rate on income from $18,201 to $45,000 fell from 16% to <strong>{Math.round(TAX_BRACKETS[1].rate * 100)}%</strong>, worth up to $268 a year. Leave payouts are taxed at your marginal rate, so the change reaches leave pay too.</li>
                <li><strong>Payday Super:</strong> The SG rate stays at <strong>12%</strong> (it reached 12% on 1 July 2025), but from 1 July 2026 super on leave payments is due with the pay that includes them and must reach the fund within 7 business days. Leave loading attracts super unless it is paid only to make up for lost overtime.</li>
                <li><strong>National minimum wage increase:</strong> The Fair Work Commission&apos;s 2026 Annual Wage Review set the national minimum wage at <strong>{formatAUD(EMPLOYMENT.minimumWageHourly, 2)} per hour</strong> ({formatAUD(EMPLOYMENT.minimumWageWeekly, 2)} per week) from 1 July 2026. Leave loading calculations for minimum-wage workers now use this higher base.</li>
                <li><strong>Right to disconnect:</strong> From 26 August 2024 (small businesses from 26 August 2025), employees have the right to refuse contact outside working hours unless the refusal is unreasonable, and that includes periods of annual leave.</li>
                <li><strong>Casual conversion:</strong> Casual employees who convert to permanent employment begin accruing annual leave from the conversion date. Prior casual service does not generate retrospective leave accrual.</li>
              </ul>
              <p>Consult the <Link href="/tax-brackets/">Tax Brackets Guide</Link> for the full FY{SITE_CONFIG.financialYear} schedule of rates and thresholds applicable to leave payouts.</p>
            </section>

            {/* ── H2 10: Related Resources ── */}
            <section id="related-resources">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Resources</h2>
              <p>These tools and guides cover topics closely connected to annual leave entitlements, payouts, and pay calculations in Australia.</p>
              <ul>
                <li><Link href="/leave-calculator/">Leave Calculator</Link> &mdash; Calculate your accrued annual leave balance and payout value based on salary, start date, and ordinary hours.</li>
                <li><Link href="/redundancy-pay-calculator/">Redundancy Pay Calculator</Link> &mdash; Model your total termination payment including redundancy, notice period, and accrued leave.</li>
                <li><Link href="/superannuation-calculator/">Superannuation Calculator</Link> &mdash; See how the 12% SG rate applies to your salary and leave payments for FY{SITE_CONFIG.financialYear}.</li>
                <li><Link href="/understanding-your-payslip/">Understanding Your Payslip</Link> &mdash; Identify your leave balance, leave loading, and year-to-date accrual on your pay statement.</li>
                <li><Link href="/award-rates/">Award Rates Guide</Link> &mdash; Find the minimum pay rates, penalty rates, and leave loading provisions for your industry Award.</li>
                <li><Link href="/overtime-penalty-rates-guide/">Overtime &amp; Penalty Rates Guide</Link> &mdash; Understand how penalty rates interact with leave loading under the &quot;better off overall&quot; test.</li>
              </ul>
            </section>

            {/* ── H2 11: FAQs ── */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <FaqAccordion faqs={ANNUAL_LEAVE_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-warmgray" />
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works"><p>Leave entitlement data is sourced from the Fair Work Ombudsman and the National Employment Standards. State-specific long service leave information is sourced from relevant state legislation. Tax rates and superannuation thresholds reflect FY{SITE_CONFIG.financialYear} values published by the Australian Taxation Office.</p></MethodologyDisclosure>
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
