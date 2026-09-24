"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import {
  formatAUD,
  formatPercent,
  EMPLOYMENT,
  SITE_CONFIG,
} from "@/lib/constants";
import { LEAVE_LOADING_RATE } from "./leave-calculator-faqs";

// NES accrual per ordinary week: 4 weeks x 38 hours / 52 weeks = 2.923 hours.
const ACCRUAL_HOURS_PER_WEEK = (
  (EMPLOYMENT.annualLeaveWeeks * EMPLOYMENT.standardWeeklyHours) / EMPLOYMENT.weeksPerYear
).toFixed(3);
const LEAD_LOADING_PCT = formatPercent(LEAVE_LOADING_RATE, 1);

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * The interactive part of /leave-calculator/: hero and calculator card. The
 * static long-form content is server-rendered (leave-calculator-content.tsx)
 * and passed in as `children`, so it is not part of this client bundle.
 */
export default function LeaveCalculatorPage({ children }: { children: React.ReactNode }) {
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

  // Leave loading (17.5% on base rate)
  const leaveLoadingPerWeek = includeLoading ? weeklyPay * LEAVE_LOADING_RATE : 0;

  // Payout value on termination
  const grossPayout = weeklyPay * totalLeaveWeeks;
  const loadingPayout = leaveLoadingPerWeek * totalLeaveWeeks;
  const totalPayout = grossPayout + loadingPayout;

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
            Annual Leave &amp; Leave Loading Calculator (17.5%) — {SITE_CONFIG.financialYear}
          </h1>
          <p className="text-lg text-warmgray">
            An annual leave calculation is {EMPLOYMENT.annualLeaveWeeks} weeks of paid leave per year of continuous
            full-time service under the NES, accrued at {ACCRUAL_HOURS_PER_WEEK} hours per {EMPLOYMENT.standardWeeklyHours}-hour
            week and pro rata for part-time hours. Casuals accrue none and receive a {formatPercent(EMPLOYMENT.casualLoading, 0)}{" "}
            loading instead. The calculator applies {SITE_CONFIG.financialYear} rates and adds {LEAD_LOADING_PCT} leave
            loading where it applies, including the tax on lump-sum payouts.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-6">Calculate Your Leave Entitlements</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
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
                      onChange={(e) => setSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
                  </div>

                  <div>
                    <label htmlFor="yearsService" className="block text-sm font-medium text-navy mb-1">Years of Service</label>
                    <input type="number" id="yearsService" min={0} max={40} step={1} value={yearsService}
                      onChange={(e) => setYearsService(clamp(Number(e.target.value || 0), 0, 40))}
                      className="block w-24 rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    <input type="range" min={0} max={20} step={1} value={clamp(yearsService, 0, 20)}
                      onChange={(e) => setYearsService(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
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

          {children}
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
