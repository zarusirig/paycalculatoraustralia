"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import {
  calculatePayBreakdown,
  formatAUD,
  formatNegAUD,
  SITE_CONFIG,
} from "@/lib/constants";
import { PAY_PERIODS } from "@/lib/constants/payg-withholding";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const PERIOD_MULTIPLIERS = PAY_PERIODS;

type Frequency = keyof typeof PERIOD_MULTIPLIERS;
type Mode = "ytd" | "annualise";
type CountMethod = "periods" | "date";

/** 1 July of the financial year that the given date falls in. */
function fyStartFor(d: Date): Date {
  const year = d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1;
  return new Date(year, 6, 1);
}

/** Number of pays received between the FY start and the payslip date (inclusive of the first cycle). */
function periodsFromDate(dateStr: string, frequency: Frequency): number | null {
  if (!dateStr) return null;
  const payslip = new Date(`${dateStr}T00:00:00`);
  if (isNaN(payslip.getTime())) return null;
  const fyStart = fyStartFor(payslip);
  const max = PERIOD_MULTIPLIERS[frequency];

  if (frequency === "monthly") {
    const months = (payslip.getFullYear() - fyStart.getFullYear()) * 12 + (payslip.getMonth() - 6);
    return clamp(months + 1, 1, max);
  }

  const days = Math.floor((payslip.getTime() - fyStart.getTime()) / 86_400_000);
  const cycle = frequency === "weekly" ? 7 : 14;
  return clamp(Math.floor(days / cycle) + 1, 1, max);
}

/**
 * The interactive part of /ytd-income-calculator/: hero and calculator card.
 * The long-form content below the card is a server component
 * (ytd-income-calculator-content.tsx) passed in as `children`, so it is not
 * part of this client bundle.
 */
export default function YTDIncomeCalculatorPage({ children, afterCalculator }: { children: React.ReactNode; afterCalculator?: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("ytd");
  const [frequency, setFrequency] = useState<Frequency>("fortnightly");
  const [payPerPeriod, setPayPerPeriod] = useState(2000);
  const [ytdAmount, setYtdAmount] = useState(26000);
  const [countMethod, setCountMethod] = useState<CountMethod>("periods");
  const [periodsInput, setPeriodsInput] = useState(13);
  const [payslipDate, setPayslipDate] = useState("");

  const maxPeriods = PERIOD_MULTIPLIERS[frequency];

  const periodsElapsed = useMemo(() => {
    if (countMethod === "date") {
      const fromDate = periodsFromDate(payslipDate, frequency);
      if (fromDate !== null) return fromDate;
    }
    return clamp(periodsInput, 1, maxPeriods);
  }, [countMethod, payslipDate, frequency, periodsInput, maxPeriods]);

  const freqLabel = frequency === "weekly" ? "week" : frequency === "fortnightly" ? "fortnight" : "month";

  // Mode 1 — Calculate YTD from per-period pay
  const ytdGross = payPerPeriod * periodsElapsed;

  // Mode 2 — Annualise from a YTD figure
  const avgPerPeriod = periodsElapsed > 0 ? ytdAmount / periodsElapsed : 0;

  const projectedAnnual = mode === "ytd" ? payPerPeriod * maxPeriods : avgPerPeriod * maxPeriods;
  const breakdown = useMemo(() => calculatePayBreakdown({ grossSalary: projectedAnnual }), [projectedAnnual]);
  const pctOfYear = Math.round((periodsElapsed / maxPeriods) * 100);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-eucalyptus-light/40 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">YTD Calculator</span></li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            YTD Calculator — Year to Date Income Australia
          </h1>
          <p className="text-lg text-warmgray">
            A year to date calculator adds up gross pay from 1 July to the latest payslip, or converts that YTD
            figure into a projected annual salary: projected income = (YTD gross &divide; pays received) &times; pays
            per year, with {PERIOD_MULTIPLIERS.weekly} weekly, {PERIOD_MULTIPLIERS.fortnightly} fortnightly or{" "}
            {PERIOD_MULTIPLIERS.monthly} monthly pays in the {SITE_CONFIG.financialYear} financial year. Tax on the
            projected figure follows the ATO {SITE_CONFIG.financialYear} scale.
          </p>
          <p className="text-sm text-warmgray mt-3">Updated: July 2026.</p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">

                {/* Inputs */}
                <div className="bg-white p-6 rounded-2xl border border-sandstone-dark/10 shadow-sm md:w-80">
                  <h2 className="text-lg font-semibold text-navy mb-5" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Your Pay Details</h2>
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">What do you want to do?</label>
                      <div className="grid grid-cols-1 gap-2">
                        {([
                          { key: "ytd", label: "Calculate my YTD income" },
                          { key: "annualise", label: "Annualise my YTD figure" },
                        ] as { key: Mode; label: string }[]).map((m) => (
                          <button
                            key={m.key}
                            type="button"
                            onClick={() => setMode(m.key)}
                            className={`py-2 px-3 border rounded-md text-sm font-medium transition-colors text-left ${
                              mode === m.key
                                ? "bg-eucalyptus-light/30 border-eucalyptus text-navy"
                                : "bg-white border-sandstone-dark/20 text-warmgray hover:bg-sandstone/50"
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">How often are you paid?</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(Object.keys(PERIOD_MULTIPLIERS) as Frequency[]).map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setFrequency(f)}
                            className={`py-2 px-2 border rounded-md text-xs font-medium transition-colors ${
                              frequency === f
                                ? "bg-eucalyptus-light/30 border-eucalyptus text-navy"
                                : "bg-white border-sandstone-dark/20 text-warmgray hover:bg-sandstone/50"
                            }`}
                          >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {mode === "ytd" ? (
                      <div>
                        <label htmlFor="payPerPeriod" className="block text-sm font-medium text-gray-700 mb-1">Gross pay per {freqLabel}:</label>
                        <div className="flex items-center">
                          <span className="text-warmgray-light mr-2 font-medium">$</span>
                          <input type="number" id="payPerPeriod" min={0} max={1000000} step={50} value={payPerPeriod}
                            onChange={(e) => setPayPerPeriod(clamp(Number(e.target.value || 0), 0, 1000000))}
                            className="block w-full text-lg font-bold text-navy rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label htmlFor="ytdAmount" className="block text-sm font-medium text-gray-700 mb-1">YTD gross on your payslip:</label>
                        <div className="flex items-center">
                          <span className="text-warmgray-light mr-2 font-medium">$</span>
                          <input type="number" id="ytdAmount" min={0} max={10000000} step={500} value={ytdAmount}
                            onChange={(e) => setYtdAmount(clamp(Number(e.target.value || 0), 0, 10000000))}
                            className="block w-full text-lg font-bold text-navy rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Count pays by:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {([
                          { key: "periods", label: "Number of pays" },
                          { key: "date", label: "Payslip date" },
                        ] as { key: CountMethod; label: string }[]).map((c) => (
                          <button
                            key={c.key}
                            type="button"
                            onClick={() => setCountMethod(c.key)}
                            className={`py-2 px-2 border rounded-md text-xs font-medium transition-colors ${
                              countMethod === c.key
                                ? "bg-eucalyptus-light/30 border-eucalyptus text-navy"
                                : "bg-white border-sandstone-dark/20 text-warmgray hover:bg-sandstone/50"
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {countMethod === "periods" ? (
                      <div>
                        <label htmlFor="periodsInput" className="block text-sm font-medium text-gray-700 mb-1">Pays received this financial year:</label>
                        <input type="number" id="periodsInput" min={1} max={maxPeriods} step={1} value={periodsInput}
                          onChange={(e) => setPeriodsInput(clamp(Number(e.target.value || 1), 1, maxPeriods))}
                          className="block w-full text-lg font-bold text-navy rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                        <p className="text-xs text-warmgray-light mt-1">Max {maxPeriods} {frequency} pays per financial year.</p>
                      </div>
                    ) : (
                      <div>
                        <label htmlFor="payslipDate" className="block text-sm font-medium text-gray-700 mb-1">Date of your latest payslip:</label>
                        <input type="date" id="payslipDate" value={payslipDate}
                          onChange={(e) => setPayslipDate(e.target.value)}
                          className="block w-full text-sm font-medium text-navy rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                        <p className="text-xs text-warmgray-light mt-1">
                          {payslipDate && periodsFromDate(payslipDate, frequency) !== null
                            ? `≈ ${periodsFromDate(payslipDate, frequency)} ${frequency} pays since 1 July`
                            : "We count pay cycles from 1 July for you."}
                        </p>
                      </div>
                    )}
                  </form>
                </div>

                {/* Results */}
                <div className="space-y-6">
                  <div className="bg-eucalyptus-dark rounded-2xl p-6 text-center text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                    <div className="text-sm font-medium text-eucalyptus-light uppercase tracking-wider mb-2 relative z-10">
                      {mode === "ytd" ? "Your YTD Gross Income" : "Projected Annual Gross Income"}
                    </div>
                    <div className="text-5xl font-extrabold mb-1 relative z-10">
                      {formatAUD(mode === "ytd" ? ytdGross : projectedAnnual)}
                    </div>
                    <div className="text-sm text-eucalyptus-light mt-2 relative z-10">
                      {mode === "ytd" ? (
                        <>After <strong>{periodsElapsed}</strong> {frequency} pays of <strong>{formatAUD(payPerPeriod)}</strong> ({pctOfYear}% of the financial year)</>
                      ) : (
                        <>Based on <strong>{formatAUD(ytdAmount)}</strong> YTD across <strong>{periodsElapsed}</strong> {frequency} pays (avg {formatAUD(avgPerPeriod)}/{freqLabel})</>
                      )}
                    </div>
                  </div>

                  {/* Breakdown Box */}
                  <div className="bg-sandstone rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone-dark/10 px-5 py-3 border-b border-sandstone-dark/20">
                      <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">
                        {mode === "ytd" ? "If you keep earning at this rate" : "Projected full-year tax position"}
                      </h3>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-3 text-sm">
                        <div className="font-semibold text-warmgray-light pb-2 border-b border-sandstone-dark/20">Component</div>
                        <div className="font-semibold text-warmgray-light text-right pb-2 border-b border-sandstone-dark/20">Projected Annual</div>

                        <div className="text-gray-700 font-medium">Gross Income</div>
                        <div className="text-right text-navy font-bold">{formatAUD(projectedAnnual)}</div>

                        <div className="text-warmgray">Income Tax</div>
                        <div className="text-right text-ochre">{formatNegAUD(breakdown.netIncomeTax)}</div>

                        <div className="text-warmgray">Medicare Levy</div>
                        <div className="text-right text-ochre">{formatNegAUD(breakdown.medicareLevy)}</div>

                        <div className="border-t border-sandstone-dark/20 pt-2 font-bold text-navy">Net Take-Home</div>
                        <div className="border-t border-sandstone-dark/20 pt-2 text-right font-extrabold text-eucalyptus-dark bg-eucalyptus-light/30 px-2 rounded">{formatAUD(breakdown.takeHomePay)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-eucalyptus-light/30 border border-eucalyptus-light p-4 rounded-xl flex items-start text-sm">
                    <div className="mr-3 mt-0.5 text-eucalyptus">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </div>
                    <div className="text-navy">
                      <strong>New financial year note:</strong> YTD figures reset to zero on 1 July each year. If your
                      payslip is from early in the financial year, the YTD number will look small — that is normal.
                      Compare it against the projected annual figure above instead.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">
          {afterCalculator}
          {children}
        </div>
      </div>
    </div>
  );
}
