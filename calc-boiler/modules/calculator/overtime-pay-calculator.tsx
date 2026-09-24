"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import {
  formatAUD,
  formatNegAUD,
  formatPercent,
  EMPLOYMENT,
  MEDICARE_LEVY,
  SITE_CONFIG,
  TAX_BRACKETS,
} from "@/lib/constants";

// Bracket rates, MLS threshold and year labels come from lib/constants; the
// page previously hand-typed FY2025-26 values (16% bracket, $93,000 MLS).
const FY = SITE_CONFIG.financialYear;
const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const bracketRange = (b: (typeof TAX_BRACKETS)[number]) =>
  b.max === Infinity ? `${formatAUD(b.min)}+` : `${formatAUD(b.min === 0 ? 0 : b.min)} – ${formatAUD(b.max)}`;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const PENALTY_TYPES = [
  { label: "Time-and-a-half (1.5×)", value: 1.5 },
  { label: "Double time (2.0×)", value: 2.0 },
  { label: "Double-time-and-a-half (2.5×)", value: 2.5 },
  { label: "Saturday casual (1.25×)", value: 1.25 },
  { label: "Evening shift (1.15×)", value: 1.15 },
] as const;

/**
 * The interactive part of /overtime-pay-calculator/: hero and calculator card.
 * The long-form content below the card is a server component
 * (overtime-pay-calculator-content.tsx) passed in as `children`, so it is not
 * part of this client bundle.
 */
export default function OvertimePayCalculatorPage({ children }: { children: React.ReactNode }) {
  const [baseRate, setBaseRate] = useState(30);
  const [multiplier, setMultiplier] = useState(1.5);
  const [hoursWorked, setHoursWorked] = useState(8);
  const [marginalBracket, setMarginalBracket] = useState(0.30);

  const overtimeRate = baseRate * multiplier;
  const grossOvertimePay = overtimeRate * hoursWorked;
  const effectiveTaxRate = marginalBracket + MEDICARE_LEVY.rate;
  const estimatedTax = Math.round(grossOvertimePay * effectiveTaxRate);
  const netOvertimePay = grossOvertimePay - estimatedTax;

  // Weekly scenario: standard 38 hrs + overtime hours
  const weeklyBasePay = baseRate * EMPLOYMENT.standardWeeklyHours;
  const weeklyTotal = weeklyBasePay + grossOvertimePay;

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-eucalyptus-light/30 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Overtime Pay Calculator</span></li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">
            Overtime &amp; Penalty Rate Calculator {FY}
          </h1>
          <p className="text-lg text-warmgray">
            The overtime rate in Australia is a multiple of the ordinary hourly rate set by the award or
            agreement covering the job, most commonly {PENALTY_TYPES[0].value.toFixed(1)}x for the first two
            or three hours and {PENALTY_TYPES[1].value.toFixed(1)}x after that; there is no single national
            overtime rate. Overtime applies beyond {EMPLOYMENT.standardWeeklyHours} ordinary hours a week for
            full-time staff and is taxed at the {FY} marginal rates. Enter your base hourly rate and the
            penalty multiplier to see gross and net overtime earnings after tax.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-6">Calculate Your Overtime Pay</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                {/* Inputs */}
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="baseRate" className="block text-sm font-medium text-navy mb-1">Base Hourly Rate</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="baseRate" min={0} max={200} step={0.5} value={baseRate}
                        onChange={(e) => setBaseRate(clamp(Number(e.target.value || 0), 0, 200))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="multiplier" className="block text-sm font-medium text-navy mb-1">Penalty Type</label>
                    <select id="multiplier" value={multiplier}
                      onChange={(e) => setMultiplier(Number(e.target.value))}
                      className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20">
                      {PENALTY_TYPES.map((pt) => (
                        <option key={pt.value} value={pt.value}>{pt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="hoursWorked" className="block text-sm font-medium text-navy mb-1">Overtime Hours</label>
                    <input type="number" id="hoursWorked" min={0} max={80} step={0.5} value={hoursWorked}
                      onChange={(e) => setHoursWorked(clamp(Number(e.target.value || 0), 0, 80))}
                      className="block w-28 rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    <input type="range" min={0} max={40} step={1} value={clamp(hoursWorked, 0, 40)}
                      onChange={(e) => setHoursWorked(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
                  </div>

                  <div>
                    <label htmlFor="marginalBracket" className="block text-sm font-medium text-navy mb-1">Your Tax Bracket</label>
                    <select id="marginalBracket" value={marginalBracket}
                      onChange={(e) => setMarginalBracket(Number(e.target.value))}
                      className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20">
                      {TAX_BRACKETS.map((b) => (
                        <option key={b.min} value={b.rate}>{pct(b.rate)} ({bracketRange(b)})</option>
                      ))}
                    </select>
                  </div>
                </form>

                {/* Results */}
                <div className="space-y-6">
                  <div className="bg-eucalyptus-light/30 border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-eucalyptus-dark uppercase tracking-wider mb-2">Net Overtime Pay</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(netOvertimePay)}</div>
                    <div className="text-sm text-warmgray mt-2">
                      for <strong>{hoursWorked}</strong> hours at <strong>{multiplier}×</strong>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                      <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">Breakdown</h3>
                    </div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Base Rate" value={`${formatAUD(baseRate, 2)}/hr`} />
                      <Row label={`Penalty Rate (${multiplier}×)`} value={`${formatAUD(overtimeRate, 2)}/hr`} bold />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label={`Gross Overtime (${hoursWorked} hrs)`} value={formatAUD(grossOvertimePay)} bold />
                      <Row label={`Est. Tax (${formatPercent(effectiveTaxRate, 0)} incl. Medicare)`} value={formatNegAUD(estimatedTax)} />
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label="Net Overtime Pay" value={formatAUD(netOvertimePay)} bold highlight />
                    </div>
                  </div>

                  <div className="bg-sandstone rounded-xl border border-sandstone-dark/20 p-5">
                    <h3 className="font-semibold text-navy text-sm mb-3">Weekly Scenario</h3>
                    <div className="space-y-2 text-sm">
                      <Row label={`Standard Pay (${EMPLOYMENT.standardWeeklyHours}hrs × ${formatAUD(baseRate, 2)})`} value={formatAUD(weeklyBasePay)} />
                      <Row label="+ Overtime Pay" value={`+${formatAUD(grossOvertimePay)}`} />
                      <div className="border-t border-sandstone-dark/10 pt-2" />
                      <Row label="Total Weekly Gross" value={formatAUD(weeklyTotal)} bold />
                    </div>
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

function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span>
      <span className={`${bold ? "font-bold" : "font-medium"} ${highlight ? "text-eucalyptus-dark" : "text-navy"}`}>{value}</span>
    </div>
  );
}
