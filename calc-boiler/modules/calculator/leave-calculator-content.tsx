// The static long-form content on /leave-calculator/. A server component, so it
// ships as HTML; the client module (leave-calculator.tsx) renders it via
// `children` below the calculator card.

import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  formatAUD,
  formatPercent,
  EMPLOYMENT,
  SUPER_GUARANTEE,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";
import { TERMINATION_LOADING_WITHHOLDING } from "@/lib/constants/leave-loading";
import { LSL_TAX } from "@/lib/constants/long-service-leave";
import { COMPASSIONATE_LEAVE } from "@/lib/constants/compassionate-leave";
import { LEAVE_FAQS, LEAVE_LOADING_RATE } from "./leave-calculator-faqs";

// Figures rendered in the prose below, all from lib/constants.
const SG_RATE = formatPercent(SUPER_GUARANTEE.rate, 0);
/** ATO Schedule 7 flat withholding rate on unused annual leave and loading. */
const FLAT_RATE = formatPercent(TERMINATION_LOADING_WITHHOLDING.flatRate, 0);
const LSL_FLAT_RATE = formatPercent(LSL_TAX.flatRate, 0);
const LSL_PRE1978_SHARE = formatPercent(LSL_TAX.pre1978IncludedProportion, 0);
const CUTOVER_1978 = LSL_TAX.preAug1978Cutover; // "16 August 1978"
const CUTOVER_1993 = LSL_TAX.aug1993Cutover; // "17 August 1993"
const LEAVE_WEEKS = EMPLOYMENT.annualLeaveWeeks;
const LEAVE_HOURS = LEAVE_WEEKS * EMPLOYMENT.standardWeeklyHours; // 152
const WEEKLY_ACCRUAL = LEAVE_HOURS / EMPLOYMENT.weeksPerYear; // 2.923 hours
const FORTNIGHT_ACCRUAL = WEEKLY_ACCRUAL * 2; // 5.85 hours
const DAY_HOURS = EMPLOYMENT.standardWeeklyHours / 5; // 7.6 hours

const SOURCES_LIST: SourceLink[] = [
  { title: "Annual leave", url: "https://www.fairwork.gov.au/leave/annual-leave", publisher: SOURCES.fwo.name },
  { title: "Long service leave", url: "https://www.fairwork.gov.au/leave/long-service-leave", publisher: SOURCES.fwo.name },
  { title: "National Employment Standards", url: "https://www.fairwork.gov.au/employment-conditions/national-employment-standards", publisher: SOURCES.fwo.name },
  { title: "Long Service Leave Act 2018 FAQs (Victoria)", url: "https://business.vic.gov.au/business-information/staff-and-hr/long-service-leave-victoria/long-service-leave-act-2018-faqs", publisher: "Business Victoria" },
];

export default function LeaveCalculatorContent() {
  return (
    <>
      {/* H2: How Is 17.5% Annual Leave Loading Calculated? */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Is 17.5% Annual Leave Loading Calculated?</h2>
        <p className="mb-4 text-warmgray">
          Annual leave loading is an extra <strong>17.5% of your base weekly pay</strong>, paid on top of the ordinary rate for each week of annual leave taken or paid out. This annual leave loading calculator applies the same formula an employer uses: <strong>{EMPLOYMENT.annualLeaveWeeks} weeks × weekly pay × 17.5%</strong> for a full year of accrued leave.
        </p>
        <p className="mb-4 text-warmgray">
          The 17.5% rate originated in the 1970s to compensate workers who regularly earned overtime, penalty rates, or shift allowances. Without leave loading, these workers would receive less take-home pay during annual leave than during normal working weeks. Today, leave loading applies only where an Award, enterprise agreement, or employment contract explicitly provides for it.
        </p>

        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">Worked Example: Leave Loading at $80,000 Salary</h3>
        <p className="mb-4 text-warmgray">
          An employee earning <strong>$80,000 per year</strong> has a weekly base pay of <strong>{formatAUD(80000 / 52)}</strong>. The leave loading calculation follows 3 steps:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-warmgray mb-4">
          <li>Weekly pay: $80,000 / 52 = <strong>{formatAUD(80000 / 52)}</strong></li>
          <li>Leave loading per week: {formatAUD(80000 / 52)} x 17.5% = <strong>{formatAUD((80000 / 52) * LEAVE_LOADING_RATE)}</strong></li>
          <li>Total loading for {EMPLOYMENT.annualLeaveWeeks} weeks of leave: {formatAUD((80000 / 52) * LEAVE_LOADING_RATE)} x {EMPLOYMENT.annualLeaveWeeks} = <strong>{formatAUD((80000 / 52) * LEAVE_LOADING_RATE * EMPLOYMENT.annualLeaveWeeks)}</strong></li>
        </ol>
        <div className="bg-eucalyptus-light/30 border-l-4 border-eucalyptus p-4 text-sm text-navy mb-4">
          <strong>Award comparison clause:</strong> Some Awards require employers to pay the <em>higher of</em> 17.5% leave loading or the penalty rates/shift allowances the employee would have earned. The employer compares both amounts and pays whichever is greater.
        </div>

        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">Who Gets Leave Loading?</h3>
        <p className="mb-4 text-warmgray">
          Leave loading is not a universal NES entitlement. It applies to employees covered by Awards including the Clerks Award, Manufacturing Award, and Building Award. Award-free employees receive leave loading only if their contract or enterprise agreement provides for it. Check your specific Award on the Fair Work Commission website to confirm your entitlement.
        </p>

        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">Is Leave Loading Taxed?</h3>
        <p className="mb-4 text-warmgray">
          Yes. Leave loading is <strong>ordinary income</strong> when it is paid while you take leave: your employer applies PAYG withholding to it the same way as salary, and it is taxed at your marginal rate. Unused leave loading paid out on termination is taxed with the unused annual leave it comes with: at your marginal rate on a normal termination for leave accrued after {CUTOVER_1993}, and withheld at a flat {FLAT_RATE} for leave accrued on or before {CUTOVER_1993} or paid because of a genuine redundancy, invalidity or an early retirement scheme. Estimate the tax with the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link>.
        </p>
      </section>

      {/* H2: How Is Leave Calculated in Australia? */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Is Leave Calculated in Australia?</h2>
        <p className="mb-4 text-warmgray">
          Leave in Australia is calculated by accruing <strong>4 weeks (152 hours) of paid annual leave per year</strong> of continuous service for full-time employees under the National Employment Standards (NES).
        </p>
        <p className="mb-4 text-warmgray">
          Leave accrues progressively from the first day of employment, not as a lump sum at year-end. A full-time employee working a standard 38-hour week earns <strong>{WEEKLY_ACCRUAL.toFixed(3)} hours of leave per week</strong>, or {FORTNIGHT_ACCRUAL.toFixed(2)} hours per fortnight (about {(FORTNIGHT_ACCRUAL / DAY_HOURS).toFixed(2)} days of {DAY_HOURS} hours). This leave calculator uses the same ordinary hours figure to convert your accrued weeks of annual leave into hours.
        </p>
        <p className="mb-4 text-warmgray">
          Part-time employees get the same {LEAVE_WEEKS} weeks of annual leave, based on their own ordinary hours. An employee working 20 ordinary hours per week accrues <strong>{20 * LEAVE_WEEKS} hours</strong> of annual leave per year ({LEAVE_WEEKS} weeks of 20 hours), compared with {LEAVE_HOURS} hours for a full-time employee on {EMPLOYMENT.standardWeeklyHours} hours. Casual employees do not accrue annual leave and instead receive a <strong>{formatPercent(EMPLOYMENT.casualLoading, 0)} casual loading</strong> on their base hourly rate.
        </p>
        <p className="text-warmgray">
          Use the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> to convert your gross salary to after-tax income, then return here to calculate the value of your accrued leave entitlements for FY{SITE_CONFIG.financialYear}.
        </p>
      </section>

      {/* H2: What Types of Leave Are You Entitled To? */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Types of Leave Are You Entitled To?</h2>
        <p className="mb-4 text-warmgray">
          Australian employees are entitled to <strong>7 distinct types of leave</strong> under the National Employment Standards, enterprise agreements, and state legislation.
        </p>
        <p className="mb-4 text-warmgray">
          The table below summarises each leave type. Only 2 have cash value on termination: annual leave and long service leave. Entitlements vary between full-time, part-time, and shift workers. Super at the {SG_RATE} SG rate is paid on annual leave taken during employment and on leave loading (unless the award loading only compensates for lost overtime), but not on unused annual leave or long service leave paid out on termination. See the <Link href="/leave-loading-calculator/">leave loading calculator</Link> for award-by-award loading rules.
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full border border-sandstone-dark/20 text-sm">
            <thead>
              <tr className="bg-sandstone">
                <th className="border border-sandstone-dark/20 px-4 py-2 text-left text-navy font-semibold">Leave Type</th>
                <th className="border border-sandstone-dark/20 px-4 py-2 text-left text-navy font-semibold">Annual Entitlement (Full-Time)</th>
                <th className="border border-sandstone-dark/20 px-4 py-2 text-left text-navy font-semibold">Accrual Basis</th>
                <th className="border border-sandstone-dark/20 px-4 py-2 text-left text-navy font-semibold">Paid Out on Termination?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray font-medium">Annual Leave</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>4 weeks (152 hours)</strong></td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">Progressive, from day 1</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>Yes</strong>: all accrued untaken leave</td>
              </tr>
              <tr className="bg-sandstone/30">
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray font-medium">Annual Leave (Shift Workers)</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>5 weeks (190 hours)</strong></td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">Progressive, from day 1</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>Yes</strong>: all accrued untaken leave</td>
              </tr>
              <tr>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray font-medium">Personal/Carer&apos;s Leave</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>10 days (76 hours)</strong></td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">Progressive, cumulative carry-over</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>No</strong>: no cash value</td>
              </tr>
              <tr className="bg-sandstone/30">
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray font-medium">Long Service Leave</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>8.67 weeks after 10 years</strong></td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">Continuous service (state laws)</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>Yes</strong>: pro-rata after 7+ years in most states</td>
              </tr>
              <tr>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray font-medium">Compassionate Leave</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>2 days per occasion</strong></td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">Per qualifying event</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>No</strong></td>
              </tr>
              <tr className="bg-sandstone/30">
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray font-medium">Parental Leave</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>12 months unpaid</strong></td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">Per qualifying birth/adoption</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>No</strong></td>
              </tr>
              <tr>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray font-medium">Community Service Leave</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>Unpaid (except jury duty)</strong></td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">As required</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>No</strong></td>
              </tr>
              <tr className="bg-sandstone/30">
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray font-medium">Family and Domestic Violence Leave</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>{COMPASSIONATE_LEAVE.fdvDaysPerYear} days paid</strong></td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">Full amount from day 1, resets each work anniversary, does not accumulate</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>No</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-warmgray">
          On a normal termination, income tax brackets apply to unused annual leave accrued after {CUTOVER_1993} the same way they apply to regular salary. Use the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to determine the tax payable on your leave payout amount.
        </p>
      </section>

      {/* H2: 4-week annual leave value at common salaries */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">4-Week Annual Leave Value at Common Salaries (FY{SITE_CONFIG.financialYear})</h2>
        <p className="mb-4 text-warmgray">
          The gross value of <strong>4 weeks of accrued annual leave</strong> ranges from approximately <strong>{formatAUD((50000 / 52) * 4)}</strong> at a $50,000 salary to <strong>{formatAUD((120000 / 52) * 4)}</strong> at a $120,000 salary, before leave loading or tax. The table below shows the base payout, the 17.5% leave loading where applicable, and the total gross payout (pre-tax) at 6 common salary levels.
        </p>
        <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-sandstone">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-navy">Annual Salary</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">Weekly Base Pay</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">Base Payout (4 wks)</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">Leave Loading (17.5%)</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">Total Gross Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {[50000, 60000, 75000, 90000, 100000, 120000].map((annualSalary) => {
                const weekly = annualSalary / 52;
                const basePayout = weekly * 4;
                const loading = basePayout * LEAVE_LOADING_RATE;
                const total = basePayout + loading;
                return (
                  <tr key={annualSalary} className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">{formatAUD(annualSalary)}</td>
                    <td className="px-4 py-3 text-right text-warmgray">{formatAUD(weekly)}</td>
                    <td className="px-4 py-3 text-right text-navy">{formatAUD(basePayout)}</td>
                    <td className="px-4 py-3 text-right text-eucalyptus-dark">+{formatAUD(loading)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-navy">{formatAUD(total)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-warmgray-light">
          Figures show gross payout before income tax. On a normal termination, tax on leave accrued after {CUTOVER_1993} is applied at the employee&apos;s marginal rate in the financial year the payout is received. Leave loading is shown for reference and applies only if your Award or contract provides for it.
        </p>
      </section>

      {/* H2: Who Uses This Calculator? */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Who Uses This Calculator?</h2>
        <p className="mb-4 text-warmgray">
          This leave calculator serves <strong>3 primary user groups</strong>: employees planning resignation, HR professionals processing terminations, and workers budgeting for leave.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-warmgray mb-4">
          <li><strong>Employees resigning or changing jobs</strong>: calculating the expected leave payout in the final pay to plan finances between roles</li>
          <li><strong>HR managers and payroll officers</strong>: verifying leave payout calculations for terminating employees to ensure NES compliance</li>
          <li><strong>Workers planning extended leave</strong>: understanding how many weeks of paid annual leave have accrued and the dollar value of that balance</li>
          <li><strong>Employees facing redundancy</strong>: combining leave payouts with severance entitlements using this calculator alongside the <Link href="/redundancy-pay-calculator/" className="text-eucalyptus-dark hover:underline">Redundancy Pay Calculator</Link></li>
          <li><strong>Accountants preparing EOFY estimates</strong>: projecting leave liabilities on company balance sheets for the {SITE_CONFIG.financialYear} financial year</li>
        </ul>
      </section>

      {/* H2: How Is Unused Leave Paid Out on Termination? */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Is Unused Leave Paid Out on Termination?</h2>
        <p className="mb-4 text-warmgray">
          Unused annual leave is paid out at the employee&apos;s <strong>base pay rate (plus leave loading if applicable)</strong> as a lump sum in the final pay, regardless of whether the employee resigns, is made redundant, or is dismissed.
        </p>
        <p className="mb-4 text-warmgray">
          The NES makes leave payout mandatory. Employers cannot forfeit accrued annual leave under any circumstances. The payout amount equals the number of accrued weeks multiplied by the weekly base rate. Leave loading is included in the payout only where the employee&apos;s Award or agreement provides for it during employment.
        </p>

        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">Tax Treatment of Leave Payouts</h3>
        <p className="mb-4 text-warmgray">
          On a normal termination (such as resignation, termination for inefficiency or retirement), unused annual leave and leave loading accrued after {CUTOVER_1993} are taxed as <strong>ordinary income at the employee&apos;s marginal tax rate</strong>. Two cases are withheld at a flat <strong>{FLAT_RATE}</strong> under the ATO&apos;s Schedule 7: leave accrued on or before {CUTOVER_1993}, and all unused annual leave paid because of a genuine redundancy, invalidity or an early retirement scheme. Unused long service leave is split by service period: only <strong>{LSL_PRE1978_SHARE}</strong> of the part for service before {CUTOVER_1978} is added to your income and taxed at marginal rates, the part for service from {CUTOVER_1978} to {CUTOVER_1993} is withheld at {LSL_FLAT_RATE}, and the part for service after {CUTOVER_1993} is taxed at marginal rates on a normal termination or withheld at {LSL_FLAT_RATE} in a genuine redundancy, invalidity or early retirement scheme. Use the <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">Australian Tax Brackets</Link> page to find the applicable rate for your income level in FY{SITE_CONFIG.financialYear}.
        </p>

        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">Long Service Leave Payout by State</h3>
        <p className="mb-4 text-warmgray">
          Long service leave is governed by state and territory legislation, not the federal NES. The qualifying period and entitlement differ across jurisdictions.
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full border border-sandstone-dark/20 text-sm">
            <thead>
              <tr className="bg-sandstone">
                <th className="border border-sandstone-dark/20 px-4 py-2 text-left text-navy font-semibold">State / Territory</th>
                <th className="border border-sandstone-dark/20 px-4 py-2 text-left text-navy font-semibold">Full Entitlement</th>
                <th className="border border-sandstone-dark/20 px-4 py-2 text-left text-navy font-semibold">Pro-Rata Payout After</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">NSW</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>8.67 weeks</strong> after 10 years</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">5 years</td>
              </tr>
              <tr className="bg-sandstone/30">
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">VIC*</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>8.67 weeks</strong> (accrues continuously, weeks ÷ 60)</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">7 years (full entitlement, not just pro-rata)</td>
              </tr>
              <tr>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">QLD</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>8.67 weeks</strong> after 10 years</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">7 years</td>
              </tr>
              <tr className="bg-sandstone/30">
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">SA</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>13 weeks</strong> after 10 years</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">7 years</td>
              </tr>
              <tr>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">WA</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>8.67 weeks</strong> after 10 years</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">7 years</td>
              </tr>
              <tr className="bg-sandstone/30">
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">TAS</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>8.67 weeks</strong> after 10 years</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">7 years</td>
              </tr>
              <tr>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">NT</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>13 weeks</strong> after 10 years</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">7 years</td>
              </tr>
              <tr className="bg-sandstone/30">
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">ACT</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>6.07 weeks</strong> after 7 years</td>
                <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">5 years</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-warmgray-light">
          *Victoria is the outlier: under the Long Service Leave Act 2018 (Vic), leave accrues continuously from day one (weeks of service ÷ 60), and the entitlement to take it (or be paid out on termination) arises at 7 years, not 10. The other states and territories above vest the full 8.67-week (or equivalent) entitlement at their stated milestone.
        </p>
      </section>

      {/* H2: What Are Common Leave Calculation Mistakes? */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Are Common Leave Calculation Mistakes?</h2>
        <p className="mb-4 text-warmgray">
          The most common leave calculation mistake is <strong>using calendar days instead of business days</strong>, which overstates leave entitlements by 40%.
        </p>
        <ol className="list-decimal pl-5 space-y-3 text-warmgray mb-4">
          <li><strong>Confusing calendar days with working days</strong>: 4 weeks of annual leave equals <strong>20 working days</strong>, not 28 calendar days. Leave accrues based on ordinary working hours (38 hours per week for full-time), not 7-day weeks.</li>
          <li><strong>Including leave loading when the Award does not provide for it</strong>: Award-free employees on individual contracts get the {formatPercent(LEAVE_LOADING_RATE, 1)} leave loading only if the contract provides for it. Adding it incorrectly inflates the expected payout by <strong>{formatAUD((80000 / 52) * LEAVE_LOADING_RATE * EMPLOYMENT.annualLeaveWeeks)}</strong> per year at an $80,000 salary.</li>
          <li><strong>Forgetting to pro-rate for part-time hours</strong>: a part-time employee working 25 hours per week accrues {LEAVE_WEEKS} weeks of their own ordinary hours, which is <strong>{25 * LEAVE_WEEKS} hours</strong> of leave per year (25 x {LEAVE_WEEKS}), not the full-time {LEAVE_HOURS} hours.</li>
          <li><strong>Expecting sick leave to be paid out</strong>: Personal/carer&apos;s leave (10 days per year) carries over indefinitely but has <strong>zero cash value</strong> on termination. Only annual leave and long service leave are paid out.</li>
          <li><strong>Applying the wrong tax rate to leave payouts</strong>: on a normal termination, leave accrued after {CUTOVER_1993} is added to assessable income for the financial year and taxed at marginal rates. The flat {FLAT_RATE} applies only to annual leave accrued on or before {CUTOVER_1993}, long service leave for service from {CUTOVER_1978} to {CUTOVER_1993}, and leave accrued after {CUTOVER_1993} that is paid because of a genuine redundancy, invalidity or an early retirement scheme. A large payout taxed at marginal rates can push the employee into a higher <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">income tax bracket</Link>.</li>
        </ol>
      </section>

      {/* H2: Related Calculators */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Related Calculators</h2>
        <p className="mb-4 text-warmgray">
          Leave entitlements interact directly with <strong>5 other payroll calculations</strong> including tax, superannuation, and redundancy pay.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-warmgray">
          <li><Link href="/redundancy-pay-calculator/" className="text-eucalyptus-dark hover:underline">Redundancy Pay Calculator</Link>: calculate severance pay based on years of service and combine it with your leave payout total</li>
          <li><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link>: convert your gross annual salary to after-tax take-home pay for FY{SITE_CONFIG.financialYear}</li>
          <li><Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link>: calculate the employer SG rate of {SG_RATE} on your qualifying earnings and see the concessional cap space left for salary sacrifice</li>
          <li><Link href="/overtime-pay-calculator/" className="text-eucalyptus-dark hover:underline">Overtime Pay Calculator</Link>: determine penalty rates for overtime, weekend, and public holiday work under your Award</li>
          <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link>: estimate how much tax you pay on salary and leave payouts combined in the {SITE_CONFIG.financialYear} financial year</li>
        </ul>
      </section>

      {/* --- CONTEXT BORDER --- */}

      <MethodologyDisclosure>
        <p className="mb-2 text-sm">Leave calculations are based on:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>NES minimum: 4 weeks (152 hours) annual leave per year of service for full-time employees</li>
          <li>Leave loading at 17.5% of base weekly pay (where applicable)</li>
          <li>Assumes no leave has been taken, showing maximum accrued entitlement</li>
          <li>Tax on payout is not calculated here. Use the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">take-home pay calculator</Link> for that</li>
        </ul>
      </MethodologyDisclosure>

      {/* FAQs */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
        {/*
          The Radix accordion unmounts closed content, so answers never
          reach the rendered HTML. This mirror makes them crawlable and
          AI-Overview eligible — same pattern as the award guide pages.
        */}
        <div className="sr-only">
          <h3>Annual leave and leave loading questions and answers</h3>
          {LEAVE_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
        </div>
        <Accordion type="multiple" className="space-y-3">
          {LEAVE_FAQS.map((f) => (
            <AccordionItem key={f.q} value={f.q} className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">{f.a}</p></AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Sponsored mention (KMN id 11) */}
      <p className="kmn-mention text-sm text-warmgray" data-kmn-id="11">For small businesses managing leave entitlements, solutions like <a href="https://www.ptodesk.com" rel="sponsored" className="kmn-link text-eucalyptus-dark hover:underline">PTODesk</a> can simplify tracking employee time off and ensure compliance with leave policies.</p>

      <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
    </>
  );
}
