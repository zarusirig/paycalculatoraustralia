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
  SITE_CONFIG,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function getNoticeWeeks(years: number): number {
  if (years < 1) return 1;
  if (years < 3) return 2;
  if (years < 5) return 3;
  return 4;
}

/**
 * The static long-form content lives in final-pay-calculator-content.tsx
 * (a server component) and is passed in as `children`, so it is not part of
 * this client bundle.
 */
export default function FinalPayCalculatorPage({ children }: { children: React.ReactNode }) {
  const [annualSalary, setAnnualSalary] = useState(80_000);
  const [yearsService, setYearsService] = useState(3);
  const [unusedLeaveDays, setUnusedLeaveDays] = useState(15);
  const [noticeWeeks, setNoticeWeeks] = useState(2);
  const [reason, setReason] = useState<"resignation" | "redundancy">("resignation");

  const result = useMemo(() => {
    const dailyRate = annualSalary / 260;
    const weeklyRate = annualSalary / 52;

    // Outstanding wages (assume last week owed)
    const outstandingWages = Math.round(weeklyRate);

    // Unused annual leave payout with 17.5% loading
    const leavePayoutBase = Math.round(dailyRate * unusedLeaveDays);
    const leaveLoading = Math.round(leavePayoutBase * 0.175);
    const totalLeavePayout = leavePayoutBase + leaveLoading;

    // Notice period pay
    const noticePay = Math.round(weeklyRate * noticeWeeks);

    // Long service leave (7+ years in most states = 8.67 weeks per 10 years, pro-rata)
    let longServiceLeave = 0;
    if (yearsService >= 7) {
      const lslWeeks = (yearsService / 10) * 8.67;
      longServiceLeave = Math.round(weeklyRate * lslWeeks);
    }

    // Redundancy pay (NES entitlement)
    let redundancyPay = 0;
    if (reason === "redundancy" && yearsService >= 1) {
      const redWeeks = yearsService < 2 ? 4 : yearsService < 3 ? 6 : yearsService < 4 ? 7 : yearsService < 5 ? 8
        : yearsService < 6 ? 10 : yearsService < 7 ? 11 : yearsService < 8 ? 13 : yearsService < 9 ? 14
        : yearsService < 10 ? 16 : 12;
      redundancyPay = Math.round(weeklyRate * redWeeks);
    }

    const totalBeforeTax = outstandingWages + totalLeavePayout + noticePay + longServiceLeave + redundancyPay;

    // Estimated tax (marginal rate on non-redundancy components, simplified)
    const taxableComponents = outstandingWages + totalLeavePayout + noticePay + longServiceLeave;
    const annualTaxableIncome = annualSalary; // approximate: use annual salary to determine marginal rate
    const rawTax = calculateIncomeTax(annualTaxableIncome);
    const lito = calculateLITO(annualTaxableIncome);
    const netTax = Math.max(0, rawTax - lito);
    const medicare = calculateMedicareLevy(annualTaxableIncome);
    const effectiveRate = annualTaxableIncome > 0 ? (netTax + medicare) / annualTaxableIncome : 0;

    const estimatedTax = Math.round(taxableComponents * effectiveRate);
    const netFinalPay = totalBeforeTax - estimatedTax;

    return {
      dailyRate, weeklyRate, outstandingWages, leavePayoutBase, leaveLoading, totalLeavePayout,
      noticePay, longServiceLeave, redundancyPay, totalBeforeTax, estimatedTax, netFinalPay, effectiveRate,
    };
  }, [annualSalary, yearsService, unusedLeaveDays, noticeWeeks, reason]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* HERO */}
          <section className="bg-eucalyptus-light/40 rounded-2xl p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <nav aria-label="breadcrumb">
                <ol className="flex items-center space-x-1 text-sm text-warmgray">
                  <li><Link className="hover:text-eucalyptus-dark hover:underline" href="/">Pay Calculator</Link></li>
                  <li className="flex items-center"><ChevronRight className="h-3 w-3 text-gray-400" /></li>
                  <li><span className="font-medium text-navy" aria-current="page">Final Pay Calculator</span></li>
                </ol>
              </nav>
              <div className="flex justify-between items-start mb-4 mt-4">
                <h1 className="text-3xl md:text-4xl font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  Final Pay Calculator Australia {SITE_CONFIG.financialYear}
                </h1>
              </div>
              <p className="text-xl text-warmgray">
                Calculate your total final pay when leaving a job. Includes unused annual leave payout with loading, notice period pay, long service leave, and estimated tax on your final payment.
              </p>
              <TrustBar className="mt-4" />
            </div>
          </section>

          {/* CALCULATOR */}
          <section className="max-w-4xl mx-auto">
            <Card className="shadow-md">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl font-semibold text-navy mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Calculate Your Final Pay</h2>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                  {/* Inputs */}
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                    <div>
                      <label htmlFor="salary" className="block text-sm font-medium text-navy mb-1">Annual Salary</label>
                      <div className="flex items-center">
                        <span className="text-warmgray-light mr-2">$</span>
                        <input type="number" id="salary" min={0} max={500000} step={1000} value={annualSalary}
                          onChange={(e) => setAnnualSalary(clamp(Number(e.target.value || 0), 0, 500000))}
                          className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="years" className="block text-sm font-medium text-navy mb-1">Years of Service</label>
                      <input type="number" id="years" min={0} max={50} step={1} value={yearsService}
                        onChange={(e) => setYearsService(clamp(Number(e.target.value || 0), 0, 50))}
                        className="block w-24 rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm" />
                      <input type="range" min={0} max={30} step={1} value={clamp(yearsService, 0, 30)}
                        onChange={(e) => setYearsService(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
                    </div>
                    <div>
                      <label htmlFor="leave" className="block text-sm font-medium text-navy mb-1">Unused Annual Leave (days)</label>
                      <input type="number" id="leave" min={0} max={100} step={1} value={unusedLeaveDays}
                        onChange={(e) => setUnusedLeaveDays(clamp(Number(e.target.value || 0), 0, 100))}
                        className="block w-24 rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm" />
                    </div>
                    <div>
                      <label htmlFor="notice" className="block text-sm font-medium text-navy mb-1">Notice Period (weeks)</label>
                      <input type="number" id="notice" min={0} max={12} step={1} value={noticeWeeks}
                        onChange={(e) => setNoticeWeeks(clamp(Number(e.target.value || 0), 0, 12))}
                        className="block w-24 rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm" />
                      <p className="text-xs text-warmgray-light mt-1">NES minimum: {getNoticeWeeks(yearsService)} weeks for {yearsService} years service</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">Reason for Leaving</label>
                      <div className="flex gap-4">
                        <button type="button" onClick={() => setReason("resignation")}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${reason === "resignation" ? "bg-eucalyptus-dark text-white" : "bg-sandstone text-navy hover:bg-sandstone-dark/20"}`}>
                          Resignation
                        </button>
                        <button type="button" onClick={() => setReason("redundancy")}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${reason === "redundancy" ? "bg-eucalyptus-dark text-white" : "bg-sandstone text-navy hover:bg-sandstone-dark/20"}`}>
                          Redundancy
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Results */}
                  <div className="space-y-4">
                    <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                      <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">Estimated Net Final Pay</div>
                      <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(result.netFinalPay)}</div>
                      <div className="text-sm text-warmgray mt-2">After estimated tax of {formatAUD(result.estimatedTax)}</div>
                    </div>

                    <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                      <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                        <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">Breakdown</h3>
                      </div>
                      <div className="p-5 space-y-3 text-sm">
                        <Row label="Outstanding Wages (1 week)" value={formatAUD(result.outstandingWages)} />
                        <Row label={`Annual Leave Payout (${unusedLeaveDays} days)`} value={formatAUD(result.leavePayoutBase)} />
                        <Row label="Leave Loading (17.5%)" value={formatAUD(result.leaveLoading)} />
                        <Row label={`Notice Period Pay (${noticeWeeks} weeks)`} value={formatAUD(result.noticePay)} />
                        {result.longServiceLeave > 0 && <Row label="Long Service Leave" value={formatAUD(result.longServiceLeave)} green />}
                        {result.redundancyPay > 0 && <Row label="Redundancy Pay (NES)" value={formatAUD(result.redundancyPay)} green />}
                        <div className="border-t border-sandstone-dark/20 pt-3" />
                        <Row label="Total Before Tax" value={formatAUD(result.totalBeforeTax)} bold />
                        <Row label={`Estimated Tax (~${formatPercent(result.effectiveRate)})`} value={formatNegAUD(result.estimatedTax)} />
                        <div className="border-t border-sandstone-dark/20 pt-3" />
                        <Row label="Net Final Pay" value={formatAUD(result.netFinalPay)} bold highlight />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="bg-sandstone border-l-4 border-eucalyptus p-4 text-sm text-warmgray">
                    <p className="font-medium mb-1">Disclaimer:</p>
                    <p>This calculator provides estimates based on Fair Work NES minimums. Your award, enterprise agreement, or contract may provide higher entitlements. Tax estimates use your annual salary to approximate the effective rate. For precise calculations, consult your employer&apos;s payroll team or a registered tax agent.</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-warmgray border-t border-sandstone-dark/20 pt-4">
                  <p className="flex items-center">
                    <ShieldCheck className="w-4 h-4 text-eucalyptus mr-2" />
                    <span>Based on Fair Work NES entitlements and ATO tax tables for FY{SITE_CONFIG.financialYear}</span>
                  </p>
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
