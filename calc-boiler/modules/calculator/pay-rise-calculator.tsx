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
  SUPER_GUARANTEE,
  SITE_CONFIG,
} from "@/lib/constants";

// Worked figures computed from the tax engine. The copy had frozen at FY2025-26
// values (16% first bracket, 2023-24 MLS tiers, $30,000 cap) under a FY2026-27
// heading.
const net = (gross: number, includeHECS = false) => calculatePayBreakdown({ grossSalary: gross, includeHECS }).takeHomePay;
const raiseNet = (base: number, raise: number) => net(base + raise) - net(base);
const RAISE_10K_ON_80K = raiseNet(80_000, 10_000);

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Client part of /pay-rise-calculator/: hero + calculator card. The static
 * long-form content (pay-rise-calculator-content.tsx) is passed in as
 * `children`, so it is not part of the client bundle.
 */
export default function PayRiseCalculatorPage({ children }: { children: React.ReactNode }) {
  const [currentSalary, setCurrentSalary] = useState(80_000);
  const [increaseAmount, setIncreaseAmount] = useState(10_000);
  const [inputMode, setInputMode] = useState<"raise" | "new_salary">("raise");

  const newSalary = inputMode === "raise" ? currentSalary + increaseAmount : increaseAmount;
  const actualRaise = newSalary - currentSalary;

  const currentBreakdown = useMemo(() => calculatePayBreakdown({ grossSalary: currentSalary }), [currentSalary]);
  const newBreakdown = useMemo(() => calculatePayBreakdown({ grossSalary: Math.max(0, newSalary) }), [newSalary]);

  const takeHomeIncrease = newBreakdown.takeHomePay - currentBreakdown.takeHomePay;
  const taxIncrease = newBreakdown.totalDeductions - currentBreakdown.totalDeductions;

  // Guard against negative/zero raise divisions
  const keepPercent = actualRaise > 0 ? (takeHomeIncrease / actualRaise) * 100 : 0;
  const taxPercent = actualRaise > 0 ? (taxIncrease / actualRaise) * 100 : 0;

  const superIncrease = Math.round(actualRaise * SUPER_GUARANTEE.rate);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Pay Rise Calculator</span></li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Pay Rise Calculator Australia — How Much Extra Will You Take Home? ({SITE_CONFIG.financialYear})
          </h1>
          <p className="text-lg text-navy">
            A <strong>$10,000 pay rise on $80,000</strong> adds <strong>{formatAUD(RAISE_10K_ON_80K)} a year</strong> to your take-home pay
            ({formatAUD(RAISE_10K_ON_80K / 52, 2)} a week) in FY{SITE_CONFIG.financialYear}, because each extra dollar is taxed at your marginal rate.
          </p>
          <p className="text-warmgray mt-2">Enter your salary and raise (in dollars or as a new salary) to see what you keep.</p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl font-semibold text-navy mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>See Your Pay Before and After a Rise</h2>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                {/* Inputs */}
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="currentSalary" className="block text-sm font-medium text-gray-700 mb-1">Current Base Salary</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="currentSalary" min={0} max={1000000} step={1000} value={currentSalary}
                        onChange={(e) => setCurrentSalary(clamp(Number(e.target.value || 0), 0, 1000000))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-sandstone-dark/10">
                    <div className="flex bg-sandstone p-1 rounded-lg mb-4">
                      <button
                        type="button"
                        onClick={() => setInputMode("raise")}
                        className={`flex-1 text-sm py-1.5 rounded-md font-medium transition-colors ${inputMode === "raise" ? "bg-white text-navy shadow-sm" : "text-warmgray-light hover:text-gray-700"}`}
                      >
                        Raise Amount
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputMode("new_salary")}
                        className={`flex-1 text-sm py-1.5 rounded-md font-medium transition-colors ${inputMode === "new_salary" ? "bg-white text-navy shadow-sm" : "text-warmgray-light hover:text-gray-700"}`}
                      >
                        New Salary
                      </button>
                    </div>

                    <label htmlFor="increase" className="block text-sm font-medium text-gray-700 mb-1">
                      {inputMode === "raise" ? "Pay Rise Amount" : "New Base Salary"}
                    </label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="increase" min={0} max={1000000} step={1000} value={increaseAmount}
                        onChange={(e) => setIncreaseAmount(clamp(Number(e.target.value || 0), 0, 1000000))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                  </div>
                </form>

                {/* Results */}
                <div className="space-y-6">
                  {/* Big Number */}
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">Net Pay Increase</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">
                      {actualRaise >= 0 ? "+" : ""}{formatAUD(takeHomeIncrease)} <span className="text-lg font-medium text-warmgray-light">/ yr</span>
                    </div>
                    {actualRaise > 0 && (
                      <div className="text-sm text-warmgray mt-2">
                        You keep <strong>{keepPercent.toFixed(1)}%</strong> of your pay rise.
                        The other <strong>{taxPercent.toFixed(1)}%</strong> goes to tax.
                      </div>
                    )}
                  </div>

                  {/* Breakdown Tables */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-sandstone rounded-lg p-4 text-sm flex flex-col h-full">
                      <h3 className="font-semibold text-warmgray-light uppercase tracking-wider text-xs mb-3">Current Pay</h3>
                      <div className="space-y-2 flex-grow">
                        <Row label="Gross" value={formatAUD(currentSalary)} />
                        <Row label="Tax + Med" value={formatNegAUD(currentBreakdown.totalDeductions)} />
                      </div>
                      <div className="pt-2 mt-2 border-t border-sandstone-dark/20">
                        <Row label="Take-Home" value={formatAUD(currentBreakdown.takeHomePay)} bold />
                      </div>
                    </div>
                    <div className="bg-sandstone rounded-lg p-4 text-sm flex flex-col h-full ring-1 ring-sandstone-dark/20">
                      <h3 className="font-semibold text-ochre uppercase tracking-wider text-xs mb-3">New Pay</h3>
                      <div className="space-y-2 flex-grow">
                        <Row label="Gross" value={formatAUD(newSalary)} highlight />
                        <Row label="Tax + Med" value={formatNegAUD(newBreakdown.totalDeductions)} />
                      </div>
                      <div className="pt-2 mt-2 border-t border-sandstone-dark/20">
                        <Row label="Take-Home" value={formatAUD(newBreakdown.takeHomePay)} bold green />
                      </div>
                    </div>
                  </div>

                  {actualRaise > 0 && (
                    <div className="bg-eucalyptus-light/30 border border-eucalyptus-light rounded-lg p-4 flex items-center justify-between text-sm">
                      <span className="text-navy font-medium">Extra Employer Super ({SUPER_GUARANTEE.rate * 100}%)</span>
                      <span className="font-bold text-eucalyptus-dark">+{formatAUD(superIncrease)}</span>
                    </div>
                  )}

                  {/* Visual Bar */}
                  {actualRaise > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-warmgray-light uppercase mb-2">Where your {formatAUD(actualRaise)} pay rise goes:</h4>
                      <div className="h-6 w-full flex rounded-full overflow-hidden">
                        <div style={{ width: `${keepPercent}%` }} className="bg-green-500 flex items-center justify-center text-[10px] text-white font-bold px-1 overflow-hidden" title="Take-Home Pay">
                          {keepPercent > 15 ? "TAKE-HOME" : ""}
                        </div>
                        <div style={{ width: `${taxPercent}%` }} className="bg-red-400 flex items-center justify-center text-[10px] text-white font-bold px-1 overflow-hidden" title="Tax + Medicare">
                          {taxPercent > 15 ? "TAX" : ""}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {children}
      </div>
    </div>
  );
}

function Row({ label, value, bold, green, highlight }: { label: string; value: string; bold?: boolean; green?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-semibold text-navy" : highlight ? "font-semibold text-ochre" : "text-warmgray"}>{label}</span>
      <span className={`${bold ? "font-bold" : highlight ? "font-bold" : "font-medium"} ${green ? "text-eucalyptus-dark" : highlight ? "text-ochre" : "text-gray-700"}`}>{value}</span>
    </div>
  );
}
