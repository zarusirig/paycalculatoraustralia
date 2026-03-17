"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  formatAUD,
  EMPLOYMENT,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const LEAVE_LOADING_RATE = 0.175; // 17.5%

const SOURCES_LIST: SourceLink[] = [
  { title: "Annual leave", url: "https://www.fairwork.gov.au/leave/annual-leave", publisher: SOURCES.fwo.name },
  { title: "Long service leave", url: "https://www.fairwork.gov.au/leave/long-service-leave", publisher: SOURCES.fwo.name },
  { title: "National Employment Standards", url: "https://www.fairwork.gov.au/employment-conditions/national-employment-standards", publisher: SOURCES.fwo.name },
];

export default function LeaveCalculatorPage() {
  const [salary, setSalary] = useState(80_000);
  const [yearsService, setYearsService] = useState(3);
  const [includeLoading, setIncludeLoading] = useState(true);

  // Annual leave: 4 weeks per year (NES minimum for full-time)
  const weeksPerYear = EMPLOYMENT.annualLeaveWeeks; // 4
  const totalLeaveWeeks = weeksPerYear * yearsService;
  const totalLeaveDays = totalLeaveWeeks * 5;
  const totalLeaveHours = totalLeaveDays * 7.6;

  // Weekly pay
  const weeklyPay = salary / 52;
  const dailyPay = salary / 260;

  // Leave loading (17.5% on base rate)
  const leaveLoadingPerWeek = includeLoading ? weeklyPay * LEAVE_LOADING_RATE : 0;

  // Payout value on termination
  const grossPayout = weeklyPay * totalLeaveWeeks;
  const loadingPayout = leaveLoadingPerWeek * totalLeaveWeeks;
  const totalPayout = grossPayout + loadingPayout;

  // Accrued leave for current year (pro-rata)
  const accruedThisYear = (weeksPerYear / 12) * 12; // full year = 4 weeks
  const accruedWeeksPartial = weeksPerYear; // always shows 1 year accrual
  const accruedHoursPartial = accruedWeeksPartial * EMPLOYMENT.standardWeeklyHours; // 152 hours

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Leave Calculator</span></li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">
            Leave Entitlements Calculator 2025-26
          </h1>
          <p className="text-lg text-warmgray">
            Calculate your annual leave balance, leave loading at 17.5%, and payout value on termination.
            Enter your salary and years of service to see your full entitlements.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-6">Calculate Your Leave Entitlements</h2>
              <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                {/* Inputs */}
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-navy mb-1">Annual Base Salary</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="salary" min={0} max={500000} step={1000} value={salary}
                        onChange={(e) => setSalary(clamp(Number(e.target.value || 0), 0, 500000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <input type="range" min={0} max={250000} step={5000} value={clamp(salary, 0, 250000)}
                      onChange={(e) => setSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" />
                  </div>

                  <div>
                    <label htmlFor="yearsService" className="block text-sm font-medium text-navy mb-1">Years of Service</label>
                    <input type="number" id="yearsService" min={0} max={40} step={1} value={yearsService}
                      onChange={(e) => setYearsService(clamp(Number(e.target.value || 0), 0, 40))}
                      className="block w-24 rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    <input type="range" min={0} max={20} step={1} value={clamp(yearsService, 0, 20)}
                      onChange={(e) => setYearsService(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" />
                  </div>

                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" checked={includeLoading} onChange={(e) => setIncludeLoading(e.target.checked)}
                      className="h-4 w-4 rounded border-sandstone-dark/30 text-violet-600" />
                    <span className="text-navy">Include 17.5% leave loading</span>
                  </label>
                </form>

                {/* Results */}
                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-eucalyptus-dark uppercase tracking-wider mb-2">Total Leave Payout Value</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(totalPayout)}</div>
                    <div className="text-sm text-warmgray mt-2">
                      <strong>{totalLeaveWeeks} weeks</strong> ({totalLeaveDays} days) accrued over {yearsService} year{yearsService !== 1 ? "s" : ""}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                      <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">Leave Balance</h3>
                    </div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Leave Per Year (NES)" value={`${weeksPerYear} weeks (${weeksPerYear * 5} days)`} />
                      <Row label="Years of Service" value={`${yearsService}`} />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label="Total Accrued Leave" value={`${totalLeaveWeeks} weeks`} bold />
                      <Row label="In Days" value={`${totalLeaveDays} days`} />
                      <Row label="In Hours" value={`${totalLeaveHours.toFixed(1)} hours`} />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                      <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">Payout Breakdown</h3>
                    </div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Weekly Base Pay" value={formatAUD(weeklyPay)} />
                      <Row label={`Gross Leave Value (${totalLeaveWeeks} wks)`} value={formatAUD(grossPayout)} bold />
                      {includeLoading && (
                        <>
                          <div className="border-t border-sandstone-dark/10 pt-3" />
                          <Row label="Leave Loading (17.5%)" value={`+${formatAUD(loadingPayout)}`} green />
                        </>
                      )}
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label="Total Payout (Before Tax)" value={formatAUD(totalPayout)} bold highlight />
                    </div>
                  </div>

                  <div className="bg-sandstone border-l-4 border-eucalyptus p-4 text-xs text-navy">
                    <strong>Tax Note:</strong> Annual leave payouts on termination are taxed at your <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">marginal tax rate</Link>. Long service leave may qualify for concessional tax treatment.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">

          {/* H2: How Is Leave Calculated in Australia? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Is Leave Calculated in Australia?</h2>
            <p className="mb-4 text-warmgray">
              Leave in Australia is calculated by accruing <strong>4 weeks (152 hours) of paid annual leave per year</strong> of continuous service for full-time employees under the National Employment Standards (NES).
            </p>
            <p className="mb-4 text-warmgray">
              Leave accrues progressively from the first day of employment, not as a lump sum at year-end. A full-time employee working a standard 38-hour week earns <strong>2.923 hours of leave per week</strong>, or approximately 0.833 days per fortnight. The Australian tax calculator applies the same ordinary hours figure when converting between annual salary and weekly pay for leave calculations.
            </p>
            <p className="mb-4 text-warmgray">
              Part-time employees accrue leave on a pro-rata basis. An employee working 20 ordinary hours per week accrues <strong>80 hours (2.1 weeks)</strong> of annual leave per year instead of the full 152 hours. Casual employees do not accrue annual leave and instead receive a <strong>25% casual loading</strong> on their base hourly rate.
            </p>
            <p className="text-warmgray">
              Use the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> to convert your gross salary to after-tax income, then return here to calculate the value of your accrued leave entitlements for FY2025-26.
            </p>
          </section>

          {/* H2: What Types of Leave Are You Entitled To? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Types of Leave Are You Entitled To?</h2>
            <p className="mb-4 text-warmgray">
              Australian employees are entitled to <strong>7 distinct types of leave</strong> under the National Employment Standards, enterprise agreements, and state legislation.
            </p>
            <p className="mb-4 text-warmgray">
              The table below summarises the 3 leave types with cash value on termination: annual leave, personal/carer&apos;s leave, and long service leave. Entitlements vary between full-time, part-time, and shift workers. Superannuation at the employer SG rate of <strong>12%</strong> is not payable on annual leave loading or leave payouts in most cases.
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
                    <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>Yes</strong> — all accrued untaken leave</td>
                  </tr>
                  <tr className="bg-sandstone/30">
                    <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray font-medium">Annual Leave (Shift Workers)</td>
                    <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>5 weeks (190 hours)</strong></td>
                    <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">Progressive, from day 1</td>
                    <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>Yes</strong> — all accrued untaken leave</td>
                  </tr>
                  <tr>
                    <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray font-medium">Personal/Carer&apos;s Leave</td>
                    <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>10 days (76 hours)</strong></td>
                    <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">Progressive, cumulative carry-over</td>
                    <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>No</strong> — no cash value</td>
                  </tr>
                  <tr className="bg-sandstone/30">
                    <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray font-medium">Long Service Leave</td>
                    <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>8.67 weeks after 10 years</strong></td>
                    <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">Continuous service (state laws)</td>
                    <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>Yes</strong> — pro-rata after 7+ years in most states</td>
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
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">
              Income tax brackets apply to leave payouts the same way they apply to regular salary. Use the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to determine the tax payable on your leave payout amount.
            </p>
          </section>

          {/* H2: Who Uses This Calculator? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Who Uses This Calculator?</h2>
            <p className="mb-4 text-warmgray">
              This leave calculator serves <strong>3 primary user groups</strong>: employees planning resignation, HR professionals processing terminations, and workers budgeting for leave.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-warmgray mb-4">
              <li><strong>Employees resigning or changing jobs</strong> — calculating the expected leave payout in the final pay to plan finances between roles</li>
              <li><strong>HR managers and payroll officers</strong> — verifying leave payout calculations for terminating employees to ensure NES compliance</li>
              <li><strong>Workers planning extended leave</strong> — understanding how many weeks of paid annual leave have accrued and the dollar value of that balance</li>
              <li><strong>Employees facing redundancy</strong> — combining leave payouts with severance entitlements using this calculator alongside the <Link href="/redundancy-pay-calculator/" className="text-eucalyptus-dark hover:underline">Redundancy Pay Calculator</Link></li>
              <li><strong>Accountants preparing EOFY estimates</strong> — projecting leave liabilities on company balance sheets for the 2025-26 financial year</li>
            </ul>
          </section>

          {/* H2: How Is Leave Loading Calculated? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Is Leave Loading Calculated?</h2>
            <p className="mb-4 text-warmgray">
              Leave loading is calculated as <strong>17.5% of the employee&apos;s base weekly pay rate</strong>, paid on top of the ordinary rate for each week of annual leave taken or paid out.
            </p>
            <p className="mb-4 text-warmgray">
              The 17.5% rate originated in the 1970s to compensate workers who regularly earned overtime, penalty rates, or shift allowances. Without leave loading, these workers would receive less take-home pay during holidays than during normal working weeks. Today, leave loading applies only where an Award, enterprise agreement, or employment contract explicitly provides for it.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">Worked Example: Leave Loading at $80,000 Salary</h3>
            <p className="mb-4 text-warmgray">
              An employee earning <strong>$80,000 per year</strong> has a weekly base pay of <strong>{formatAUD(80000 / 52)}</strong>. The leave loading calculation follows 3 steps:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-warmgray mb-4">
              <li>Weekly pay: $80,000 / 52 = <strong>{formatAUD(80000 / 52)}</strong></li>
              <li>Leave loading per week: {formatAUD(80000 / 52)} x 17.5% = <strong>{formatAUD(80000 / 52 * 0.175)}</strong></li>
              <li>Total loading for 4 weeks of leave: {formatAUD(80000 / 52 * 0.175)} x 4 = <strong>{formatAUD(80000 / 52 * 0.175 * 4)}</strong></li>
            </ol>
            <div className="bg-eucalyptus-light/30 border-l-4 border-eucalyptus p-4 text-sm text-navy mb-4">
              <strong>Award comparison clause:</strong> Some Awards require employers to pay the <em>higher of</em> 17.5% leave loading or the penalty rates/shift allowances the employee would have earned. The employer compares both amounts and pays whichever is greater.
            </div>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">Who Gets Leave Loading?</h3>
            <p className="mb-4 text-warmgray">
              Leave loading is not a universal NES entitlement. It applies to employees covered by Awards including the Clerks Award, Manufacturing Award, and Building Award. Employees on Award-free contracts, common in professional services, banking, and technology, typically do not receive leave loading unless their contract specifies it. Check your specific Award on the Fair Work Commission website to confirm your entitlement.
            </p>
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
              Annual leave payouts are taxed as <strong>ordinary income at the employee&apos;s marginal tax rate</strong>. The ATO does not apply any concessional treatment to annual leave payouts. Long service leave payouts receive different treatment: the pre-16 August 1978 component is taxed at <strong>5%</strong>, and the post-1978 component is taxed at the marginal rate. Use the <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">Australian Tax Brackets</Link> page to find the applicable rate for your income level in FY2025-26.
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
                    <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">VIC</td>
                    <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray"><strong>8.67 weeks</strong> after 10 years</td>
                    <td className="border border-sandstone-dark/20 px-4 py-2 text-warmgray">7 years</td>
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
          </section>

          {/* H2: What Are Common Leave Calculation Mistakes? */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Are Common Leave Calculation Mistakes?</h2>
            <p className="mb-4 text-warmgray">
              The most common leave calculation mistake is <strong>using calendar days instead of business days</strong>, which overstates leave entitlements by 40%.
            </p>
            <ol className="list-decimal pl-5 space-y-3 text-warmgray mb-4">
              <li><strong>Confusing calendar days with working days</strong> — 4 weeks of annual leave equals <strong>20 working days</strong>, not 28 calendar days. Leave accrues based on ordinary working hours (38 hours per week for full-time), not 7-day weeks.</li>
              <li><strong>Including leave loading when the Award does not provide for it</strong> — Award-free employees on individual contracts rarely receive the 17.5% leave loading. Adding it incorrectly inflates the expected payout by <strong>$1,077</strong> per year at an $80,000 salary.</li>
              <li><strong>Forgetting to pro-rate for part-time hours</strong> — A part-time employee working 25 hours per week accrues <strong>2.63 weeks</strong> of leave per year (25/38 x 4 weeks), not the full 4 weeks.</li>
              <li><strong>Expecting sick leave to be paid out</strong> — Personal/carer&apos;s leave (10 days per year) carries over indefinitely but has <strong>zero cash value</strong> on termination. Only annual leave and long service leave are paid out.</li>
              <li><strong>Applying the wrong tax rate to leave payouts</strong> — Leave payouts are added to assessable income for the financial year and taxed at marginal rates, not at a flat rate. A large payout can push the employee into a higher <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">income tax bracket</Link>.</li>
            </ol>
          </section>

          {/* H2: Related Calculators */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Related Calculators</h2>
            <p className="mb-4 text-warmgray">
              Leave entitlements interact directly with <strong>5 other payroll calculations</strong> including tax, superannuation, and redundancy pay.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-warmgray">
              <li><Link href="/redundancy-pay-calculator/" className="text-eucalyptus-dark hover:underline">Redundancy Pay Calculator</Link> — calculate severance pay based on years of service and combine it with your leave payout total</li>
              <li><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> — convert your gross annual salary to after-tax take-home pay for FY2025-26</li>
              <li><Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> — calculate the employer SG rate of 12% on your ordinary time earnings and check the Medicare levy surcharge threshold</li>
              <li><Link href="/overtime-pay-calculator/" className="text-eucalyptus-dark hover:underline">Overtime Pay Calculator</Link> — determine penalty rates for overtime, weekend, and public holiday work under your Award</li>
              <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> — estimate how much tax you pay on salary and leave payouts combined in the 2025-26 financial year</li>
            </ul>
          </section>

          {/* --- CONTEXT BORDER --- */}

          <MethodologyDisclosure>
            <p className="mb-2 text-sm">Leave calculations are based on:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>NES minimum: 4 weeks (152 hours) annual leave per year of service for full-time employees</li>
              <li>Leave loading at 17.5% of base weekly pay (where applicable)</li>
              <li>Assumes no leave has been taken — showing maximum accrued entitlement</li>
              <li>Tax on payout is not calculated here — use the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">take-home pay calculator</Link> for that</li>
            </ul>
          </MethodologyDisclosure>

          {/* FAQs */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <AccordionItem value="how-much" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How much annual leave do I get in Australia?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Full-time employees get <strong>4 weeks (20 days or 152 hours)</strong> of paid annual leave per year under the NES. Part-time employees accrue leave on a pro-rata basis proportional to their ordinary hours. Shift workers who work a rotating roster including weekends and nights receive <strong>5 weeks (25 days or 190 hours)</strong> under their Award.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="pro-rata" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How is annual leave calculated pro-rata?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Leave accrues progressively throughout the year based on ordinary hours worked. A part-time employee working 20 hours per week accrues <strong>80 hours (2.1 weeks)</strong> of leave per year, calculated as 20/38 x 152 hours. The accrual rate is <strong>1.538 hours per week</strong> for that employee, compared to 2.923 hours per week for a full-time worker.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="loading-who" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Who gets leave loading?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Leave loading applies to employees covered by an Award or enterprise agreement that includes a 17.5% leave loading clause. Common Awards with leave loading include the Clerks Award, Manufacturing Award, and Building Award. Award-free employees on individual contracts typically do not receive leave loading. Check your payslip or employment contract to confirm your entitlement.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="sick-leave" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Can I cash out sick leave?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray"><strong>No.</strong> Personal/carer&apos;s leave (sick leave) cannot be cashed out and has no payout value on termination. Employees accrue <strong>10 days (76 hours)</strong> per year, and unused days carry over indefinitely, but the balance has zero cash value. Only annual leave and long service leave are paid out when employment ends.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="long-service" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>When do I qualify for long service leave?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Long service leave qualification depends on state legislation. In NSW, VIC, QLD, WA, and TAS, the full entitlement of <strong>8.67 weeks</strong> vests after 10 years of continuous service. SA and NT provide <strong>13 weeks</strong> after 10 years. The ACT provides <strong>6.07 weeks</strong> after 7 years. Pro-rata payouts on termination apply after 5 years in NSW and ACT, and after 7 years in all other states.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="tax-on-payout" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How is leave payout taxed?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Annual leave payouts are taxed as <strong>ordinary income at your marginal tax rate</strong>. The ATO treats the payout as assessable income in the financial year it is received. A large leave payout can push total income into a higher tax bracket — for example, a $12,000 payout on top of an $80,000 salary moves assessable income to $92,000, increasing the marginal rate from <strong>32.5% to 37%</strong> on income above $90,000 in FY2025-26.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="super-on-leave" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Is superannuation payable on leave payouts?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray"><strong>No.</strong> The employer SG rate of <strong>12%</strong> is not payable on annual leave payouts made on termination. Superannuation is payable on annual leave taken during employment (as it forms part of ordinary time earnings), but termination payouts for unused leave are excluded from the superannuation guarantee calculation.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="casual-leave" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Do casual employees get annual leave?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray"><strong>No.</strong> Casual employees do not accrue annual leave, personal leave, or long service leave under the NES. Instead, casuals receive a <strong>25% casual loading</strong> on top of their base hourly rate to compensate for the absence of paid leave, notice of termination, and redundancy pay entitlements.</p></AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, green, highlight }: { label: string; value: string; bold?: boolean; green?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span>
      <span className={`${bold ? "font-bold" : "font-medium"} ${green ? "text-eucalyptus-dark" : highlight ? "text-eucalyptus-dark" : "text-navy"}`}>{value}</span>
    </div>
  );
}
