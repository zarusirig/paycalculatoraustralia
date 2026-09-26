"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import {
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareLevy,
  formatAUD,
  formatNegAUD,
  formatPercent,
  SUPER_GUARANTEE,
  SITE_CONFIG,
} from "@/lib/constants";
import ResultNextSteps, { type ResultNextStep } from "@/components/common/result-next-steps";
import StickyResult from "@/components/common/sticky-result";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Client part of /backpay-calculator/: hero + calculator card. The static
 * long-form content (backpay-calculator-content.tsx) is passed in as
 * `children`, so it is not part of the client bundle.
 */
export default function BackpayCalculatorPage({ children, afterCalculator }: { children: React.ReactNode; afterCalculator?: React.ReactNode }) {
  const [correctRate, setCorrectRate] = useState(30);
  const [actualRate, setActualRate] = useState(24.1);
  const [hoursPerWeek, setHoursPerWeek] = useState(38);
  const [weeksUnderpaid, setWeeksUnderpaid] = useState(26);

  const result = useMemo(() => {
    const rateDiff = Math.max(0, correctRate - actualRate);
    const totalHours = hoursPerWeek * weeksUnderpaid;

    // Wage underpayment
    const wageShortfall = Math.round(rateDiff * totalHours * 100) / 100;

    // Unpaid super (12% on the wage difference)
    const unpaidSuper = Math.round(wageShortfall * SUPER_GUARANTEE.rate * 100) / 100;

    // Unpaid leave loading (annual leave accrues at ~7.7% of ordinary hours — 4 weeks / 52 weeks)
    const leaveAccrualRate = 4 / 52;
    const unpaidLeaveLoading = Math.round(wageShortfall * leaveAccrualRate * 100) / 100;

    // Total owed before tax
    const totalOwedBeforeTax = Math.round((wageShortfall + unpaidLeaveLoading) * 100) / 100;

    // Estimate tax on backpay lump sum (use Schedule 5 approach: marginal rate)
    // Approximate: assume worker earns ~$60k and back payment is additional income
    const approxAnnualIncome = correctRate * hoursPerWeek * 52;
    const rawTax = calculateIncomeTax(approxAnnualIncome);
    const lito = calculateLITO(approxAnnualIncome);
    const netTax = Math.max(0, rawTax - lito);
    const medicare = calculateMedicareLevy(approxAnnualIncome);
    const effectiveRate = approxAnnualIncome > 0 ? (netTax + medicare) / approxAnnualIncome : 0;

    // Marginal rate on the backpay (simplified)
    const taxOnBackpay = Math.round(totalOwedBeforeTax * effectiveRate);
    const netBackpay = Math.round(totalOwedBeforeTax - taxOnBackpay);

    // Grand total including super (super goes to fund, not employee directly)
    const grandTotal = totalOwedBeforeTax + unpaidSuper;

    return {
      rateDiff, totalHours, wageShortfall, unpaidSuper, unpaidLeaveLoading,
      totalOwedBeforeTax, taxOnBackpay, netBackpay, grandTotal, effectiveRate,
    };
  }, [correctRate, actualRate, hoursPerWeek, weeksUnderpaid]);

  // Next steps inside the result card: recover the money, then check the tax on it.
  const nextSteps = useMemo<ResultNextStep[]>(
    () => [
      { href: "/schedule-5-tax-table/", label: "See how tax is withheld on a back payment", detail: "ATO Schedule 5 spreads the lump sum over the period" },
      { href: "/award-rates/", label: "Check the award rate you should have been paid" },
      { href: "/super-guarantee-charge/", label: `Recover the ${formatAUD(result.unpaidSuper)} of unpaid super` },
      { href: "/hourly-to-annual-salary-calculator/", label: `Convert ${formatAUD(correctRate, 2)} an hour to a salary` },
    ],
    [result.unpaidSuper, correctRate],
  );

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-3 md:py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* HERO — compact so the first input sits above the phone fold (26 Sep 2026). */}
          <section className="bg-eucalyptus-light/40 rounded-2xl p-5 md:p-8">
            <div className="max-w-4xl mx-auto">
              <nav aria-label="breadcrumb">
                <ol className="flex items-center space-x-1 text-sm text-warmgray">
                  <li><Link className="hover:text-eucalyptus-dark hover:underline" href="/">Pay Calculator</Link></li>
                  <li className="flex items-center"><ChevronRight className="h-3 w-3 text-gray-400" /></li>
                  <li><span className="font-medium text-navy" aria-current="page">Backpay Calculator</span></li>
                </ol>
              </nav>
              <div className="flex justify-between items-start mb-2 mt-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  Backpay Calculator Australia — Underpayment Calculator
                </h1>
              </div>
              <p className="text-base md:text-lg text-warmgray">
                Enter your correct rate, the rate paid, hours and weeks to see what you are owed.
              </p>
              <TrustBar className="mt-2" />
            </div>
          </section>

          {/* CALCULATOR */}
          <section className="max-w-4xl mx-auto">
            <Card className="shadow-md py-0">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl font-semibold text-navy mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Calculate Your Backpay</h2>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                  {/* Inputs */}
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                    <div>
                      <label htmlFor="correctRate" className="block text-sm font-medium text-navy mb-1">Correct Hourly Rate</label>
                      <div className="flex items-center">
                        <span className="text-warmgray-light mr-2">$</span>
                        <input type="number" id="correctRate" min={0} max={200} step={0.01} value={correctRate}
                          onChange={(e) => setCorrectRate(clamp(Number(e.target.value || 0), 0, 200))}
                          className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm" />
                      </div>
                      <p className="text-xs text-warmgray-light mt-1">The rate you should have been paid. Check <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">Award Rates</Link>.</p>
                    </div>
                    <div>
                      <label htmlFor="actualRate" className="block text-sm font-medium text-navy mb-1">Actual Hourly Rate Paid</label>
                      <div className="flex items-center">
                        <span className="text-warmgray-light mr-2">$</span>
                        <input type="number" id="actualRate" min={0} max={200} step={0.01} value={actualRate}
                          onChange={(e) => setActualRate(clamp(Number(e.target.value || 0), 0, 200))}
                          className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="hours" className="block text-sm font-medium text-navy mb-1">Hours Per Week</label>
                      <input type="number" id="hours" min={1} max={60} step={1} value={hoursPerWeek}
                        onChange={(e) => setHoursPerWeek(clamp(Number(e.target.value || 1), 1, 60))}
                        className="block w-24 rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm" />
                    </div>
                    <div>
                      <label htmlFor="weeks" className="block text-sm font-medium text-navy mb-1">Number of Weeks Underpaid</label>
                      <input type="number" id="weeks" min={1} max={312} step={1} value={weeksUnderpaid}
                        onChange={(e) => setWeeksUnderpaid(clamp(Number(e.target.value || 1), 1, 312))}
                        className="block w-24 rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm" />
                      <input type="range" min={1} max={156} step={1} value={clamp(weeksUnderpaid, 1, 156)}
                        onChange={(e) => setWeeksUnderpaid(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
                      <p className="text-xs text-warmgray-light mt-1">You can claim up to 6 years (312 weeks) of underpayment.</p>
                    </div>
                  </form>

                  {/* Results */}
                  <div className="space-y-4">
                    <div id="calc-result" className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                      <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">Total Amount Owed</div>
                      <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(result.grandTotal)}</div>
                      <div className="text-sm text-warmgray mt-2">Including {formatAUD(result.unpaidSuper)} in unpaid super</div>
                      <ResultNextSteps links={nextSteps} />
                    </div>
                    <StickyResult targetId="calc-result" label="Total amount owed" value={formatAUD(result.grandTotal)} hint="incl. super" />

                    <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                      <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                        <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">Underpayment Breakdown</h3>
                      </div>
                      <div className="p-5 space-y-3 text-sm">
                        <Row label={`Rate Difference ($${result.rateDiff.toFixed(2)}/hr)`} value={formatAUD(result.wageShortfall)} />
                        <Row label={`Total Hours Underpaid`} value={`${result.totalHours.toLocaleString()} hrs`} />
                        <div className="border-t border-sandstone-dark/10 pt-3" />
                        <Row label="Wage Shortfall" value={formatAUD(result.wageShortfall)} bold />
                        <Row label="Unpaid Leave Accrual" value={formatAUD(result.unpaidLeaveLoading)} />
                        <Row label={`Unpaid Super (${formatPercent(SUPER_GUARANTEE.rate, 0)})`} value={formatAUD(result.unpaidSuper)} green />
                        <div className="border-t border-sandstone-dark/20 pt-3" />
                        <Row label="Total Before Tax (wages + leave)" value={formatAUD(result.totalOwedBeforeTax)} bold />
                        <Row label={`Est. Tax on Backpay (~${formatPercent(result.effectiveRate)})`} value={formatNegAUD(result.taxOnBackpay)} />
                        <div className="border-t border-sandstone-dark/20 pt-3" />
                        <Row label="Net Backpay to You" value={formatAUD(result.netBackpay)} bold highlight />
                        <Row label="Plus Unpaid Super (to fund)" value={formatAUD(result.unpaidSuper)} green />
                      </div>
                    </div>

                    {result.wageShortfall === 0 && (
                      <div className="bg-sandstone border-l-4 border-eucalyptus p-4 text-sm text-warmgray">
                        <strong>No underpayment detected.</strong> The correct rate must be higher than the actual rate paid to calculate backpay.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="bg-sandstone border-l-4 border-eucalyptus p-4 text-sm text-warmgray">
                    <p className="font-medium mb-1">Disclaimer:</p>
                    <p>This calculator provides estimates for wage underpayment claims. Actual amounts may vary based on overtime, penalty rates, allowances, and specific award conditions. Backpay tax is estimated using ATO Schedule 5 principles. For formal underpayment claims, consult the Fair Work Ombudsman or a workplace lawyer.</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-warmgray border-t border-sandstone-dark/20 pt-4">
                  <p className="flex items-center">
                    <ShieldCheck className="w-4 h-4 text-eucalyptus mr-2" />
                    <span>Based on Fair Work minimum entitlements and ATO rates for FY{SITE_CONFIG.financialYear}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {afterCalculator}
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
      <span className={`${bold ? "font-bold" : "font-medium"} ${green ? "text-eucalyptus-dark" : highlight ? "text-ochre" : "text-navy"}`}>{value}</span>
    </div>
  );
}
