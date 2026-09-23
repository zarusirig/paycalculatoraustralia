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

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * The interactive part of /contractor-vs-employee-calculator/: hero and
 * calculator card. The static long-form content is server-rendered
 * (contractor-vs-employee-calculator-content.tsx) and passed in as `children`,
 * so it is not part of this client bundle.
 */
export default function ContractorVsEmployeeCalculatorPage({ children }: { children: React.ReactNode }) {
  const [grossRate, setGrossRate] = useState(100_000);
  const [contractorExpenses, setContractorExpenses] = useState(3_000);
  const [fundSuper, setFundSuper] = useState(true);

  // Employee calcs
  const employeeBreakdown = useMemo(() => calculatePayBreakdown({ grossSalary: grossRate }), [grossRate]);
  const employerSuper = Math.round(grossRate * SUPER_GUARANTEE.rate);

  // Contractor calcs
  const contractorSuper = fundSuper ? Math.round(grossRate * SUPER_GUARANTEE.rate) : 0;
  // Taxable income is Gross minus deductible expenses and personal super contributions
  const contractorTaxable = clamp(grossRate - contractorExpenses - contractorSuper, 0, 9999999);
  const contractorTaxBreakdown = useMemo(() => calculatePayBreakdown({ grossSalary: contractorTaxable }), [contractorTaxable]);

  // Contractor actual cash in hand to spend:
  const contractorNetCash = grossRate - contractorExpenses - contractorSuper - contractorTaxBreakdown.totalDeductions;

  const gapToMatch = Math.round((grossRate + employerSuper + contractorExpenses) * 1.15); // Rough rule of thumb

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Contractor vs Employee</span></li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Contractor vs Employee Calculator — Compare Your Take-Home
          </h1>
          <p className="text-lg text-warmgray">
            See the real difference between working as an employee and as a contractor (ABN).
            Compare tax, super, and hidden costs side-by-side for FY{SITE_CONFIG.financialYear}.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-5xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl font-semibold text-navy mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Side-by-Side Pay Comparison on the Same Rate</h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inputs */}
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5 bg-sandstone p-5 rounded-xl border border-sandstone-dark/10">
                  <h3 className="font-medium text-navy">Your Equivalent Rate</h3>
                  <div>
                    <label htmlFor="grossRate" className="block text-sm font-medium text-gray-700 mb-1">Gross Annual Income / Package</label>
                    <div className="flex items-center mb-2">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="grossRate" min={0} max={1000000} step={1000} value={grossRate}
                        onChange={(e) => setGrossRate(clamp(Number(e.target.value || 0), 0, 1000000))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                  </div>

                  <h3 className="font-medium text-navy pt-3 border-t border-sandstone-dark/20">Contractor Assumptions</h3>
                  <div>
                    <label htmlFor="contractorExpenses" className="block text-sm font-medium text-gray-700 mb-1">Annual Business Expenses (Insurance, Admin, Tools)</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="contractorExpenses" min={0} max={100000} step={500} value={contractorExpenses}
                        onChange={(e) => setContractorExpenses(clamp(Number(e.target.value || 0), 0, 100000))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-start space-x-3 text-sm">
                      <input type="checkbox" checked={fundSuper} onChange={(e) => setFundSuper(e.target.checked)} className="mt-1 h-4 w-4 text-eucalyptus-dark border-gray-300 rounded focus:ring-eucalyptus/20" />
                      <span className="text-gray-700">Self-fund 12% Superannuation (Recommended for contractors)</span>
                    </label>
                  </div>
                </form>

                {/* Employee Card */}
                <Card className="border-sandstone-dark/20 shadow-none">
                  <div className="bg-sandstone p-4 border-b border-sandstone-dark/20 rounded-t-xl">
                    <h3 className="text-lg font-bold text-navy text-center">Employee</h3>
                  </div>
                  <CardContent className="p-5 text-sm space-y-3">
                    <Row label="Gross Salary" value={formatAUD(grossRate)} bold />
                    <Row label="Income Tax" value={formatNegAUD(employeeBreakdown.netIncomeTax)} />
                    <Row label="Medicare Levy" value={formatNegAUD(employeeBreakdown.medicareLevy)} />
                    <Row label="Business Expenses" value="$0" />
                    <div className="border-t border-sandstone-dark/20 pt-2" />
                    <Row label="Net Take-Home Cash" value={formatAUD(employeeBreakdown.takeHomePay)} bold green />
                    <div className="border-t border-sandstone-dark/20 pt-2" />
                    <Row label="Super (Paid by Employer)" value={`+${formatAUD(employerSuper)}`} highlight />
                    <Row label="Leave & Insurance" value="Provided" highlight />
                    <div className="bg-sandstone p-3 mt-4 rounded-lg">
                      <div className="text-xs text-warmgray-light mb-1">Total Package Value</div>
                      <div className="font-bold text-navy text-lg">{formatAUD(grossRate + employerSuper)}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contractor Card */}
                <Card className="border-eucalyptus/30 shadow-none bg-eucalyptus-light/30">
                  <div className="bg-eucalyptus-light p-4 border-b border-eucalyptus/30 rounded-t-xl">
                    <h3 className="text-lg font-bold text-navy text-center">Contractor (ABN)</h3>
                  </div>
                  <CardContent className="p-5 text-sm space-y-3">
                    <Row label="Gross Income (ex GST)" value={formatAUD(grossRate)} bold />
                    <Row label="Business Expenses" value={formatNegAUD(contractorExpenses)} />
                    <Row label="Self-Funded Super" value={fundSuper ? formatNegAUD(contractorSuper) : "$0"} />
                    <Row label="Taxable Income" value={formatAUD(contractorTaxable)} />
                    <div className="border-t border-eucalyptus/30 pt-2" />
                    <Row label="Income Tax" value={formatNegAUD(contractorTaxBreakdown.netIncomeTax)} />
                    <Row label="Medicare Levy" value={formatNegAUD(contractorTaxBreakdown.medicareLevy)} />
                    <div className="border-t border-eucalyptus/30 pt-2" />
                    <Row label="Net Take-Home Cash" value={formatAUD(contractorNetCash)} bold green />
                    <div className="border-t border-eucalyptus/30 pt-2" />
                    <Row label="Total Super" value={fundSuper ? formatAUD(contractorSuper) : "$0"} highlight={fundSuper} />
                    <Row label="Leave & Insurance" value="None" />
                    <div className="bg-eucalyptus-light p-3 mt-4 rounded-lg">
                      <div className="text-xs text-eucalyptus-dark mb-1">Value Equivalent required approx.</div>
                      <div className="font-bold text-navy text-lg">{formatAUD(gapToMatch)}</div>
                      <div className="text-[10px] text-eucalyptus-dark mt-1">To match the employee package above</div>
                    </div>
                  </CardContent>
                </Card>
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
      <span className={`${bold ? "font-bold" : "font-medium"} ${green ? "text-eucalyptus-dark" : highlight ? "text-eucalyptus-dark" : "text-gray-700"}`}>{value}</span>
    </div>
  );
}
