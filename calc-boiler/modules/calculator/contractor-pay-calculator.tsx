"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import {
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareLevy,
  formatAUD,
  formatPercent,
  SUPER_GUARANTEE,
  SITE_CONFIG,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

interface ContractorResult {
  grossAnnual: number;
  taxableIncome: number;
  gstAmount: number;
  superContribution: number;
  incomeTax: number;
  medicareLevy: number;
  litoOffset: number;
  netIncomeTax: number;
  totalDeductions: number;
  takeHomePay: number;
  daily: number;
  weekly: number;
  fortnightly: number;
  monthly: number;
}

function calculateContractorPay(
  hourlyRate: number,
  hoursPerWeek: number,
  weeksPerYear: number,
  includesGST: boolean,
  includesSuper: boolean,
): ContractorResult {
  const grossAnnual = Math.round(hourlyRate * hoursPerWeek * weeksPerYear);

  // If rate includes GST, strip the 10% to find the real income
  const incomeBeforeGST = includesGST ? Math.round(grossAnnual / 1.1) : grossAnnual;
  const gstAmount = includesGST ? grossAnnual - incomeBeforeGST : 0;

  // If rate includes super, strip the 12% SG
  const baseSalary = includesSuper
    ? Math.round(incomeBeforeGST / (1 + SUPER_GUARANTEE.rate))
    : incomeBeforeGST;

  const superContribution = includesSuper
    ? incomeBeforeGST - baseSalary
    : Math.round(baseSalary * SUPER_GUARANTEE.rate);

  const taxableIncome = baseSalary;

  // Tax calculations
  const rawTax = calculateIncomeTax(taxableIncome, true);
  const litoOffset = calculateLITO(taxableIncome);
  const netIncomeTax = Math.max(0, Math.round(rawTax - litoOffset));
  const medicareLevy = calculateMedicareLevy(taxableIncome);

  const totalDeductions = netIncomeTax + medicareLevy;
  const takeHomePay = taxableIncome - totalDeductions;

  const workDays = weeksPerYear * 5;

  return {
    grossAnnual,
    taxableIncome,
    gstAmount,
    superContribution,
    incomeTax: Math.round(rawTax),
    medicareLevy,
    litoOffset: Math.round(litoOffset),
    netIncomeTax,
    totalDeductions,
    takeHomePay,
    daily: Math.round((takeHomePay / workDays) * 100) / 100,
    weekly: Math.round((takeHomePay / weeksPerYear) * 100) / 100,
    fortnightly: Math.round((takeHomePay / (weeksPerYear / 2)) * 100) / 100,
    monthly: Math.round((takeHomePay / 12) * 100) / 100,
  };
}

/**
 * The interactive part of /contractor-pay-calculator/: hero and calculator
 * card. The long-form content below the hero is a server component
 * (contractor-pay-calculator-content.tsx) passed in as `children`, so it is
 * not part of this client bundle.
 */
export default function ContractorPayCalculator({ children }: { children: React.ReactNode }) {
  const [hourlyRate, setHourlyRate] = useState(50);
  const [hoursPerWeek, setHoursPerWeek] = useState(38);
  const [weeksPerYear, setWeeksPerYear] = useState(48);
  const [includesSuper, setIncludesSuper] = useState(false);
  const [includesGST, setIncludesGST] = useState(false);

  const result = useMemo(
    () => calculateContractorPay(hourlyRate, hoursPerWeek, weeksPerYear, includesGST, includesSuper),
    [hourlyRate, hoursPerWeek, weeksPerYear, includesGST, includesSuper]
  );

  return (
    <div className="flex-grow">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pb-16 pt-24 lg:pt-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDM5NTAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtNGgtNHYyaC00di00aDJ2LTJoLTR2MmgtMnY0aDJ2MmgtMnY0aDR2LTJoNHYyaDJ2LTRoLTJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            {/* Left copy */}
            <div>
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex items-center gap-1.5 text-sm text-blue-300">
                  <li><Link href="/" className="hover:text-white">Pay Calculator</Link></li>
                  <li>/</li>
                  <li className="text-white">Contractor Pay Calculator</li>
                </ol>
              </nav>
              <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Contractor Pay Calculator Australia
                <span className="mt-2 block text-lg font-normal text-blue-300 sm:text-xl">
                  What You Take Home as a Contractor — {SITE_CONFIG.financialYear}
                </span>
              </h1>
              <p className="mb-6 max-w-lg text-lg leading-relaxed text-sandstone-dark/50">
                Calculate your take-home as a contractor in Australia. See your net pay after GST, income tax, super self-contribution and deductions — ABN vs PAYG side-by-side for FY{SITE_CONFIG.financialYear}.
              </p>
              <TrustBar className="mb-6" />
            </div>

            {/* Right — Calculator */}
            <Card className="border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  {/* Hourly Rate */}
                  <div>
                    <label htmlFor="hourly-rate" className="mb-1.5 block text-sm font-semibold text-navy">
                      Hourly Rate
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg font-medium text-warmgray-light">$</span>
                      <input
                        type="number"
                        id="hourly-rate"
                        min={0}
                        max={500}
                        step={5}
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(clamp(Number(e.target.value || 0), 0, 500))}
                        className="block w-full rounded-xl border border-sandstone-dark/30 bg-white py-3 pl-8 pr-4 text-xl font-bold text-navy shadow-sm focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20"
                      />
                    </div>
                  </div>

                  {/* Hours per week */}
                  <div>
                    <label htmlFor="hours-per-week" className="mb-1.5 block text-sm font-semibold text-navy">
                      Hours per Week
                    </label>
                    <input
                      type="number"
                      id="hours-per-week"
                      min={1}
                      max={60}
                      step={1}
                      value={hoursPerWeek}
                      onChange={(e) => setHoursPerWeek(clamp(Number(e.target.value || 1), 1, 60))}
                      className="block w-full rounded-xl border border-sandstone-dark/30 bg-white px-4 py-3 text-lg font-bold text-navy shadow-sm focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20"
                    />
                  </div>

                  {/* Weeks per year */}
                  <div>
                    <label htmlFor="weeks-per-year" className="mb-1.5 block text-sm font-semibold text-navy">
                      Weeks per Year (1–52)
                    </label>
                    <input
                      type="number"
                      id="weeks-per-year"
                      min={1}
                      max={52}
                      step={1}
                      value={weeksPerYear}
                      onChange={(e) => setWeeksPerYear(clamp(Number(e.target.value || 1), 1, 52))}
                      className="block w-full rounded-xl border border-sandstone-dark/30 bg-white px-4 py-3 text-lg font-bold text-navy shadow-sm focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20"
                    />
                    <p className="mt-1 text-xs text-warmgray-light">
                      Most contractors work 46-48 weeks (allowing for holidays)
                    </p>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-2">
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={includesSuper}
                        onChange={(e) => setIncludesSuper(e.target.checked)}
                        className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus focus:ring-eucalyptus/20"
                      />
                      <span className="text-navy">Includes Superannuation ({formatPercent(SUPER_GUARANTEE.rate, 0)})</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={includesGST}
                        onChange={(e) => setIncludesGST(e.target.checked)}
                        className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus focus:ring-eucalyptus/20"
                      />
                      <span className="text-navy">Includes GST (10%)</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-eucalyptus-dark py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-navy hover:shadow-xl"
                  >
                    Calculate Contractor Pay →
                  </button>
                </form>

                {/* Summary Table */}
                <div className="mt-6 overflow-x-auto rounded-xl border border-sandstone-dark/20" role="region" aria-live="polite" aria-label="Contractor pay results">
                  <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="bg-sandstone px-3 py-3 text-base font-bold text-navy sm:px-4">Gross &amp; Net — Summary Table</h2>
                  <table className="w-full text-xs">
                    <thead className="bg-sandstone">
                      <tr>
                        <th className="px-2 py-2 text-left font-semibold text-navy sm:px-3">Component</th>
                        <th className="px-2 py-2 text-right font-semibold text-navy sm:px-3">Daily</th>
                        <th className="px-2 py-2 text-right font-semibold text-navy sm:px-3">Weekly</th>
                        <th className="px-2 py-2 text-right font-semibold text-navy sm:px-3">Fortnightly</th>
                        <th className="px-2 py-2 text-right font-semibold text-navy sm:px-3">Monthly</th>
                        <th className="px-2 py-2 text-right font-semibold text-navy sm:px-3">Annual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/10">
                      <SummaryRow label="Taxable Income" annual={result.taxableIncome} weeks={weeksPerYear} />
                      <SummaryRow label={`Super (${formatPercent(SUPER_GUARANTEE.rate, 0)})`} annual={result.superContribution} weeks={weeksPerYear} />
                      <SummaryRow label="Total Taxes" annual={result.totalDeductions} weeks={weeksPerYear} highlight />
                      <SummaryRow label="  Income Tax" annual={result.netIncomeTax} weeks={weeksPerYear} sub />
                      <SummaryRow label="  Medicare Levy" annual={result.medicareLevy} weeks={weeksPerYear} sub />
                      {result.litoOffset > 0 && (
                        <SummaryRow label="  LITO Offset" annual={-result.litoOffset} weeks={weeksPerYear} sub />
                      )}
                      <SummaryRow label="Take-Home Pay" annual={result.takeHomePay} weeks={weeksPerYear} bold />
                    </tbody>
                  </table>
                  <p className="px-3 py-2 text-xs text-warmgray-light sm:px-4">
                    Weekly/fortnightly tax &amp; Medicare use {weeksPerYear}/{Math.floor(weeksPerYear / 2)} periods. Daily uses ({weeksPerYear}×5) workdays.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {children}
    </div>
  );
}

// ---------- Helper components ----------

function SummaryRow({
  label,
  annual,
  weeks,
  bold,
  sub,
  highlight,
}: {
  label: string;
  annual: number;
  weeks: number;
  bold?: boolean;
  sub?: boolean;
  highlight?: boolean;
}) {
  const workDays = weeks * 5;
  const daily = annual / workDays;
  const weekly = annual / weeks;
  const fortnightly = annual / (weeks / 2);
  const monthly = annual / 12;

  const cellClass = bold
    ? "font-bold text-navy"
    : highlight
      ? "font-semibold text-ochre"
      : sub
        ? "text-warmgray-light"
        : "text-navy";

  const labelClass = bold
    ? "font-bold text-navy"
    : highlight
      ? "font-semibold text-ochre"
      : sub
        ? "pl-3 text-warmgray-light"
        : "text-navy";

  const fmt = (v: number) => formatAUD(Math.abs(v), v !== 0 && Math.abs(v) < 100 ? 2 : 0);

  return (
    <tr className={bold ? "bg-eucalyptus-light/30" : ""}>
      <td className={`whitespace-nowrap px-2 py-1.5 sm:px-3 ${labelClass}`}>{label}</td>
      <td className={`px-2 py-1.5 text-right sm:px-3 ${cellClass}`}>{fmt(daily)}</td>
      <td className={`px-2 py-1.5 text-right sm:px-3 ${cellClass}`}>{fmt(weekly)}</td>
      <td className={`px-2 py-1.5 text-right sm:px-3 ${cellClass}`}>{fmt(fortnightly)}</td>
      <td className={`px-2 py-1.5 text-right sm:px-3 ${cellClass}`}>{fmt(monthly)}</td>
      <td className={`px-2 py-1.5 text-right sm:px-3 ${cellClass}`}>{fmt(annual)}</td>
    </tr>
  );
}
