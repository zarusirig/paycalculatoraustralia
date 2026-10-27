"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Briefcase } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import TrustBar from "@/components/common/trust-bar";
import { STATE_PAYROLL_TAX, SUPER_GUARANTEE, formatAUD, formatPercent } from "@/lib/constants";
import { employerOnCosts } from "@/lib/constants/payroll-tax"; // T2

// Display order for the state-by-state payroll tax table (matches the previous hand-written order).
const PAYROLL_TABLE_ORDER = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as const;

/**
 * The interactive part of /employer-cost-calculator/: breadcrumbs, hero and
 * calculator. The guide article and sidebar are server-rendered
 * (employer-cost-calculator-content.tsx) and passed in as `children` and
 * `sidebar`, so they are not part of this client bundle.
 */
export default function EmployerCostCalculatorPage({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  const [baseSalary, setBaseSalary] = useState<number>(100000);
  const [payrollState, setPayrollState] = useState<string>("VIC");
  const [payrollTaxRate, setPayrollTaxRate] = useState<number>(Math.round(STATE_PAYROLL_TAX.VIC.rate * 10000) / 100);
  const [workcoverRate, setWorkcoverRate] = useState<number>(1.5); // Default average proxy

  // Inputs are clamped inside employerOnCosts (12% SG capped at the annual
  // maximum contribution base), so an empty/negative field can never show NaN.
  const { salary, superAmt, leaveProvision, payrollTaxAmt, workcoverAmt, trueCost, multiplier: costMultiplier } = employerOnCosts({
    baseSalary,
    payrollTaxPct: payrollTaxRate,
    workcoverPct: workcoverRate,
  });



  return (
    <div className="min-h-screen flex-grow bg-sandstone/30">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Employer Cost Calculator</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6 tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Employer Cost Calculator: The True Cost of Hiring
          </h1>
          <p className="text-xl text-warmgray leading-relaxed max-w-3xl">
            A staff member on a $100,000 salary costs a business far more than $100,000. Calculate the hidden on-costs including superannuation, payroll tax, workers comp, and mandatory leave provisions.
          </p>
          <TrustBar className="mt-8 !max-w-none" variant="light" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN COLUMN */}
          <div className="lg:w-2/3 space-y-12">

            {/* INTERACTIVE CALCULATOR SECTION */}
            <section id="calculate-total-cost" className="bg-white rounded-2xl shadow-sm border border-sandstone-dark/20 overflow-hidden">
              <div className="p-6 md:p-8 bg-navy border-b border-navy-light">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  <Briefcase className="h-6 w-6 text-eucalyptus" /> Calculate Total Employment Cost
                </h2>
                <p className="text-sandstone-dark/50">Adjust the parameters below to see the hidden multiplier effect.</p>
              </div>

              <div className="p-6 md:p-8 grid md:grid-cols-2 gap-10">

                {/* Inputs */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="base-salary" className="text-navy font-semibold text-base">Annual Base Salary Before Super</Label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <span className="text-warmgray-light font-medium text-lg">$</span>
                      </div>
                      <Input
                        id="base-salary"
                        type="number"
                        min={0}
                        value={baseSalary || ''}
                        onChange={(e) => setBaseSalary(Number(e.target.value))}
                        className="pl-9 h-14 text-lg font-medium border-sandstone-dark/30 bg-sandstone/30 focus:bg-white transition-colors rounded-xl focus:border-eucalyptus focus:ring-eucalyptus/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="prt" className="text-navy font-semibold text-sm">Est. Payroll Tax %</Label>
                      <select
                        aria-label="State or territory for payroll tax"
                        value={payrollState}
                        onChange={(e) => {
                          setPayrollState(e.target.value);
                          setPayrollTaxRate(Math.round(STATE_PAYROLL_TAX[e.target.value].rate * 10000) / 100);
                        }}
                        className="w-full rounded-lg border border-sandstone-dark/30 bg-white px-3 py-2 text-sm text-navy"
                      >
                        {PAYROLL_TABLE_ORDER.map((code) => (<option key={code} value={code}>{STATE_PAYROLL_TAX[code].name}</option>))}
                      </select>
                      <div className="relative">
                        <Input
                          id="prt"
                          type="number"
                          step="0.1"
                          value={payrollTaxRate}
                          onChange={(e) => setPayrollTaxRate(Number(e.target.value))}
                          className="pr-8 border-sandstone-dark/30 rounded-lg focus:ring-eucalyptus/20 focus:border-eucalyptus"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-warmgray-light text-sm">%</span>
                        </div>
                      </div>
                      <p className="text-xs text-warmgray-light leading-tight">{STATE_PAYROLL_TAX[payrollState].name} rate, payable only once total wages pass {formatAUD(STATE_PAYROLL_TAX[payrollState].threshold)}. Set 0 if you are under the threshold, or use the <Link href="/payroll-tax-calculator/" className="underline">payroll tax calculator</Link>.</p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="wc" className="text-navy font-semibold text-sm">WorkCover Premium %</Label>
                      <div className="relative">
                        <Input
                          id="wc"
                          type="number"
                          step="0.1"
                          value={workcoverRate}
                          onChange={(e) => setWorkcoverRate(Number(e.target.value))}
                          className="pr-8 border-sandstone-dark/30 rounded-lg focus:ring-eucalyptus/20 focus:border-eucalyptus"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-warmgray-light text-sm">%</span>
                        </div>
                      </div>
                      <p className="text-xs text-warmgray-light leading-tight">Varies wildly by industry risk (0.5% - 10%).</p>
                    </div>
                  </div>
                </div>

                {/* Outputs */}
                <div className="bg-sandstone/40 rounded-2xl p-6 border border-sandstone-dark/20">
                  <h3 className="text-lg font-bold text-navy mb-6 border-b border-sandstone-dark/20 pb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Breakdown</h3>

                  <div className="space-y-4 font-medium">
                    <div className="flex justify-between items-center text-warmgray">
                      <span>Base Salary:</span>
                      <span className="text-navy">${salary.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</span>
                    </div>

                    <div className="flex justify-between items-center text-ochre">
                      <span className="flex items-center gap-1">Superannuation ({formatPercent(SUPER_GUARANTEE.rate, 0)}): <span className="text-xs bg-ochre/10 text-ochre px-1.5 py-0.5 rounded leading-none border border-ochre/20">Owed required</span></span>
                      <span>+ ${superAmt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</span>
                    </div>

                    <div className="flex justify-between items-center text-ochre/80">
                      <span className="flex items-center gap-1">Leave Provision (4wks): <span className="text-xs bg-ochre/10 text-ochre px-1.5 py-0.5 rounded leading-none border border-ochre/20">Lost time cost</span></span>
                      <span>+ ${leaveProvision.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</span>
                    </div>

                    <div className="flex justify-between items-center text-warmgray-light text-sm">
                      <span>State Payroll Tax:</span>
                      <span>+ ${payrollTaxAmt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</span>
                    </div>

                    <div className="flex justify-between items-center text-warmgray-light text-sm border-b border-sandstone-dark/20 pb-4">
                      <span>WorkCover Premium:</span>
                      <span>+ ${workcoverAmt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</span>
                    </div>

                    <div className="flex justify-between items-end pt-2">
                      <div>
                        <span className="block text-warmgray-light text-sm font-semibold uppercase tracking-wider mb-1">True Commercial Cost</span>
                        <span className="text-4xl font-extrabold text-navy tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                          ${trueCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </span>
                      </div>
                      <div className="text-right pb-1">
                        <span className="text-sm font-semibold text-warmgray-light uppercase tracking-wider block">Real Multiplier</span>
                        <span className="text-xl font-bold text-eucalyptus-dark">{costMultiplier === null ? "—" : `${costMultiplier.toFixed(2)}x`}</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </section>

            {/* LONG FORM GUIDE CONTENT */}
            {children}

          </div>

          {/* SIDEBAR */}
          {sidebar}

        </div>
      </div>
    </div>
  );
}
