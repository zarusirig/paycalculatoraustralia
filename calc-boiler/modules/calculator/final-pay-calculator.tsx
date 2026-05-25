"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareLevy,
  formatAUD,
  formatPercent,
  SOURCES,
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

const SOURCES_LIST: SourceLink[] = [
  { title: "Final pay when employment ends", url: "https://www.fairwork.gov.au/ending-employment/final-pay", publisher: SOURCES.fwo.name },
  { title: "Leave entitlements on termination", url: "https://www.fairwork.gov.au/leave/annual-leave#ending-employment", publisher: SOURCES.fwo.name },
  { title: "Tax on unused leave payments", url: "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-as-an-employee/leaving-your-job", publisher: SOURCES.ato.name },
];

export default function FinalPayCalculatorPage() {
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
                  Final Pay Calculator Australia 2025-26
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
                <div className="grid md:grid-cols-[1fr_2fr] gap-8">
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
                        onChange={(e) => setYearsService(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" />
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
                        <Row label={`Estimated Tax (~${formatPercent(result.effectiveRate)})`} value={`-${formatAUD(result.estimatedTax)}`} />
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
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Final Pay Calculated in Australia?</h2>
              <p className="mb-4 text-warmgray">Your final pay when leaving a job comprises <strong>5 separate components</strong>, each calculated independently. Under the Fair Work Act, your employer must pay all outstanding entitlements within <strong>7 days</strong> of your employment ending or on the next regular pay day.</p>
              <ol className="list-decimal pl-6 space-y-3 text-warmgray">
                <li><strong>Outstanding wages.</strong> Any hours worked but not yet paid, including the final pay period up to your last day.</li>
                <li><strong>Unused annual leave.</strong> Calculated as (annual salary / 260) x unused leave days. Most awards require <strong>17.5% leave loading</strong> on the payout.</li>
                <li><strong>Notice period pay.</strong> If your employer asks you to leave immediately, they must pay you for the NES notice period (1-4 weeks depending on service). An additional week applies if you are over 45 with 2+ years service.</li>
                <li><strong>Long service leave.</strong> Available after 7+ years of continuous service in most states. Calculated at 8.67 weeks per 10 years of service on a pro-rata basis.</li>
                <li><strong>Redundancy pay.</strong> Only applies if your position is made redundant. NES entitlement ranges from 4-16 weeks based on years of service. Use the <Link href="/redundancy-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Redundancy Pay Calculator</Link> for a detailed breakdown.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Unused Annual Leave Taxed?</h2>
              <p className="mb-4 text-warmgray">Unused annual leave paid on termination is taxed at your <strong>marginal rate</strong> for leave accrued after 17 August 1993. Leave accrued before that date is taxed at a maximum rate of <strong>32%</strong> (including Medicare). The 17.5% leave loading is also taxable.</p>
              <p className="text-warmgray">For most employees, the leave payout is added to your assessable income for the financial year in which you receive it. If the lump sum pushes you into a higher tax bracket, you may be able to request the ATO to assess it separately. Use the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income Tax Calculator</Link> to estimate the bracket impact.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the NES Notice Period Requirements?</h2>
              <p className="mb-4 text-warmgray">The National Employment Standards set minimum notice periods based on length of service.</p>
              <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm max-w-xl mx-auto">
                <table className="w-full text-sm">
                  <thead className="bg-sandstone font-semibold text-navy">
                    <tr>
                      <th className="px-4 py-3 text-left">Period of Service</th>
                      <th className="px-4 py-3 text-right">Notice Period</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy">Up to 1 year</td><td className="px-4 py-3 text-right text-navy">1 week</td></tr>
                    <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy">1 to 3 years</td><td className="px-4 py-3 text-right text-navy">2 weeks</td></tr>
                    <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy">3 to 5 years</td><td className="px-4 py-3 text-right text-navy">3 weeks</td></tr>
                    <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy">5+ years</td><td className="px-4 py-3 text-right text-navy">4 weeks</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-warmgray text-center">Employees over 45 with 2+ years of service receive an additional week of notice.</p>
            </section>

            <MethodologyDisclosure>
              <ol className="list-decimal space-y-1 pl-4">
                <li>Leave payout = (annual salary / 260) x unused leave days x 1.175 (with 17.5% loading).</li>
                <li>Notice period = weekly rate x notice weeks.</li>
                <li>Long service leave = (years / 10) x 8.67 weeks x weekly rate (7+ years only).</li>
                <li>Redundancy uses NES entitlement table (4-16 weeks).</li>
                <li>Tax estimated at the effective rate derived from annual salary using ATO progressive brackets.</li>
              </ol>
              <p className="mt-2">Entitlements from <a className="text-eucalyptus-dark hover:underline" href="https://www.fairwork.gov.au/ending-employment/final-pay" target="_blank" rel="noreferrer noopener">Fair Work Ombudsman</a>, last verified {SITE_CONFIG.lastVerified}.</p>
            </MethodologyDisclosure>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="space-y-3">
                <AccordionItem value="when-paid" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>When must my employer pay my final pay?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Under the Fair Work Act, your employer must pay all outstanding entitlements within <strong>7 days</strong> of your employment ending, or on the next regular pay day &mdash; whichever comes first.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="leave-loading" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Is leave loading included in my final pay?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Yes, if your award or enterprise agreement provides for annual leave loading (typically <strong>17.5%</strong>), it must be paid on your unused annual leave balance when employment ends. Check your specific award for the applicable rate.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="lsl" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>When do I get long service leave in my final pay?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Long service leave entitlements vary by state. In most states, you become eligible after <strong>7-10 years</strong> of continuous service with the same employer. Some states provide a pro-rata entitlement if you are terminated after 5-7 years. Use the <Link href="/leave-calculator/" className="text-eucalyptus-dark hover:underline">Leave Calculator</Link> to estimate your balance.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="tax" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>How is my final pay taxed?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Outstanding wages and notice pay are taxed at your <strong>normal marginal rate</strong>. Unused annual leave is taxed at your marginal rate (or a max of 32% for pre-1993 leave). Long service leave has concessional treatment for pre-1978 accrual. Genuine redundancy pay receives a tax-free component.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="super-final" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Does my employer pay super on my final pay?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Employers must pay the <strong>12% SG</strong> on ordinary time earnings up to your last day. Super is <strong>not</strong> payable on unused leave payouts, redundancy payments, or payment in lieu of notice. Use the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to verify.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="dispute" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>What if my employer does not pay my final entitlements?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Contact the <strong>Fair Work Ombudsman</strong> on 13 13 94 or lodge a complaint online at fairwork.gov.au. The FWO can investigate, mediate, and take legal action against employers who fail to pay final entitlements. You have <strong>6 years</strong> from the date of underpayment to make a claim.</p></AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Related */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Calculators</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/redundancy-pay-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Redundancy Pay Calculator</h3>
                  <p className="text-sm text-warmgray">Calculate NES redundancy entitlement and tax-free components</p>
                </Link>
                <Link href="/leave-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Leave Calculator</h3>
                  <p className="text-sm text-warmgray">Estimate your annual leave and long service leave balance</p>
                </Link>
                <Link href="/income-tax-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Income Tax Calculator</h3>
                  <p className="text-sm text-warmgray">See how your final pay affects your total tax liability</p>
                </Link>
                <Link href="/award-rates/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Award Rates</h3>
                  <p className="text-sm text-warmgray">Check minimum entitlements under your specific award</p>
                </Link>
              </div>
            </section>

            <section className="bg-eucalyptus-light/40 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Starting a New Job?</h2>
              <p className="text-warmgray mb-6 max-w-lg mx-auto">Calculate your take-home pay at your new employer with our full pay calculator.</p>
              <Link href="/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200">
                Calculate Your Take-Home Pay →
              </Link>
            </section>

            <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
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
