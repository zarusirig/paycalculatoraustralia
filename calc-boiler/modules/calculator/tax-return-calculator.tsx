"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import { formatAUD, formatNegAUD, formatPercent } from "@/lib/constants";
import { MEDICARE_LEVY } from "@/lib/constants/australian-tax";
import { RETURN_2026, RETURN_2026_SOURCES } from "@/lib/constants/tax-return-2025-26";
import {
  DEFAULT_RETURN_YEAR,
  RETURN_YEARS,
  estimateReturn,
  type ReturnIncomeYear,
} from "@/lib/constants/tax-return-estimator";
import { EXAMPLE_INPUTS } from "@/modules/calculator/tax-return-calculator-faqs";

const H = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const R = RETURN_2026;
const THIS = RETURN_YEARS["2025-26"];
const NEXT = RETURN_YEARS["2026-27"];
const YEARS: ReturnIncomeYear[] = ["2025-26", "2026-27"];
const pct = (r: number) => `${Math.round(r * 10_000) / 100}%`;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}


/**
 * The interactive part of /tax-return-calculator/: hero, disclaimer and
 * calculator card. The long-form content below the card is a server component
 * (tax-return-calculator-content.tsx) passed in as `children`, so it is not
 * part of this client bundle.
 */
export default function TaxReturnCalculatorPage({ children }: { children: React.ReactNode }) {
  const [year, setYear] = useState<ReturnIncomeYear>(DEFAULT_RETURN_YEAR);
  const [totalIncome, setTotalIncome] = useState<number>(EXAMPLE_INPUTS.grossIncome);
  const [taxWithheld, setTaxWithheld] = useState<number>(EXAMPLE_INPUTS.taxWithheld);
  const [deductions, setDeductions] = useState<number>(EXAMPLE_INPUTS.deductions);
  const [hasPrivateHealth, setHasPrivateHealth] = useState(true);
  const [includeHECS, setIncludeHECS] = useState(false);

  const Y = RETURN_YEARS[year];
  const r = useMemo(
    () => estimateReturn(year, {
      grossIncome: totalIncome,
      deductions,
      taxWithheld,
      hasPrivateHospitalCover: hasPrivateHealth,
      hasStudyLoan: includeHECS,
    }),
    [year, totalIncome, deductions, taxWithheld, hasPrivateHealth, includeHECS]
  );
  const isRefund = r.refund >= 0;

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-eucalyptus-light/40 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Tax Return Calculator</span></li>
            </ol>
          </nav>
          <h1 style={H} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">
            Tax Return Calculator {THIS.returnName}: Estimate Your {THIS.incomeYear} Refund
          </h1>
          <p className="text-lg text-warmgray">
            An estimated tax return is the difference between the PAYG tax withheld from {THIS.incomeYearStart} to{" "}
            {THIS.incomeYearEnd} and the tax owed on the {THIS.incomeYear} scale: {formatAUD(THIS.brackets[0].max)}{" "}
            tax-free, then {pct(THIS.brackets[1].rate)} to {formatAUD(THIS.brackets[1].max)} and{" "}
            {pct(THIS.brackets[2].rate)} to {formatAUD(THIS.brackets[2].max)}, plus the {pct(MEDICARE_LEVY.rate)} Medicare
            levy. More withheld than owed is a refund; less is a bill. The return is due{" "}
            <strong>{R.selfLodgeDueDate}</strong> if self-lodged through{" "}
            <a href={RETURN_2026_SOURCES.myTax} target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">myTax</a>,
            or {R.agentDueDateMostPeople} through most tax agents. Switch to {NEXT.incomeYear} to plan next year&rsquo;s return.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* DISCLAIMER */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-5 flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-ochre flex-shrink-0 mt-0.5" />
            <div>
              <h2 style={H} className="font-semibold text-navy mb-1">Estimation Only</h2>
              <p className="text-sm text-warmgray">
                This tool gives a <strong>rough estimate</strong> of your refund or amount owing. It is not tax advice.
                Your actual result depends on your complete return, including all income, deductions and offsets.
                Lodge through <a href="https://my.gov.au" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">myGov / myTax</a> for the real figure.
              </p>
            </div>
          </div>
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={H} className="text-xl font-semibold text-navy mb-6">Estimate Your Tax Refund</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                {/* Inputs */}
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <fieldset>
                    <legend className="block text-sm font-medium text-navy mb-2">Income year</legend>
                    <div className="grid grid-cols-2 gap-2" role="radiogroup">
                      {YEARS.map((y) => (
                        <label
                          key={y}
                          className={`cursor-pointer rounded-md border px-3 py-2 text-center text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-eucalyptus ${year === y ? "border-eucalyptus bg-eucalyptus-light/40 text-navy" : "border-sandstone-dark/30 text-warmgray hover:border-eucalyptus"}`}
                        >
                          <input type="radio" name="income-year" value={y} checked={year === y} onChange={() => setYear(y)} className="sr-only" />
                          {y}
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-warmgray-light mt-1">{Y.purpose}.</p>
                  </fieldset>

                  <div>
                    <label htmlFor="totalIncome" className="block text-sm font-medium text-navy mb-1">Total Gross Income</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="totalIncome" min={0} max={500000} step={1000} value={totalIncome}
                        onChange={(e) => setTotalIncome(clamp(Number(e.target.value || 0), 0, 500000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <p className="text-xs text-warmgray-light mt-1">For {Y.incomeYearStart} to {Y.incomeYearEnd}, from your income statement</p>
                  </div>

                  <div>
                    <label htmlFor="taxWithheld" className="block text-sm font-medium text-navy mb-1">Tax Withheld (PAYG)</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="taxWithheld" min={0} max={250000} step={500} value={taxWithheld}
                        onChange={(e) => setTaxWithheld(clamp(Number(e.target.value || 0), 0, 250000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <p className="text-xs text-warmgray-light mt-1">Total tax your employer(s) withheld during the year</p>
                  </div>

                  <div>
                    <label htmlFor="deductions" className="block text-sm font-medium text-navy mb-1">Estimated Deductions</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="deductions" min={0} max={100000} step={100} value={deductions}
                        onChange={(e) => setDeductions(clamp(Number(e.target.value || 0), 0, 100000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <p className="text-xs text-warmgray-light mt-1">Work-related expenses, WFH, donations, tax agent fees</p>
                  </div>

                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" checked={!hasPrivateHealth} onChange={(e) => setHasPrivateHealth(!e.target.checked)}
                      className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" />
                    <span className="text-navy">No private hospital cover all year</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" checked={includeHECS} onChange={(e) => setIncludeHECS(e.target.checked)}
                      className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" />
                    <span className="text-navy">HECS-HELP or other study loan</span>
                  </label>
                </form>

                {/* Results */}
                <div className="space-y-6" aria-live="polite">
                  <div className={`${isRefund ? "bg-eucalyptus-light/30 border-sandstone-dark/20" : "bg-sandstone border-sandstone-dark/20"} border rounded-xl p-6 text-center shadow-sm`}>
                    <div className={`text-sm font-semibold ${isRefund ? "text-eucalyptus-dark" : "text-ochre"} uppercase tracking-wider mb-2`}>
                      {isRefund ? "Estimated Refund" : "Estimated Amount Owing"} · {year}
                    </div>
                    <div className="text-4xl font-extrabold text-navy mb-1">
                      {formatAUD(Math.abs(r.refund))}
                    </div>
                    <div className="text-sm text-warmgray mt-2">
                      {isRefund
                        ? "More tax was withheld than your estimated tax for the year"
                        : "Less tax was withheld than your estimated tax for the year"}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                      <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">Tax Reconciliation ({year})</h3>
                    </div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Total Gross Income" value={formatAUD(totalIncome)} />
                      <Row label="Less: Deductions" value={formatNegAUD(deductions)} />
                      <Row label="Taxable Income" value={formatAUD(r.taxableIncome)} bold />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label="Income Tax (before offsets)" value={formatAUD(r.incomeTax)} />
                      {r.lito > 0 && <Row label="Less: Low Income Tax Offset" value={formatNegAUD(r.lito)} />}
                      <Row label="Medicare Levy" value={formatAUD(r.medicareLevy)} />
                      {r.mls > 0 && <Row label="Medicare Levy Surcharge" value={formatAUD(r.mls)} />}
                      {includeHECS && <Row label="Study Loan Repayment" value={formatAUD(r.helpRepayment)} />}
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label="Total Tax Liability" value={formatAUD(r.totalLiability)} bold />
                      <Row label="Tax Already Withheld (PAYG)" value={formatAUD(taxWithheld)} />
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label={isRefund ? "Estimated Refund" : "Amount Owing"} value={formatAUD(Math.abs(r.refund))} bold highlight={isRefund} red={!isRefund} />
                    </div>
                  </div>

                  <div className="bg-sandstone rounded-xl border border-sandstone-dark/20 p-5">
                    <h3 className="font-semibold text-navy text-sm mb-3">Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center bg-white p-3 rounded-lg border border-sandstone-dark/10">
                        <div className="font-bold text-navy">{formatPercent(r.averageRate)}</div>
                        <div className="text-xs text-warmgray-light">Average Tax Rate</div>
                      </div>
                      <div className="text-center bg-white p-3 rounded-lg border border-sandstone-dark/10">
                        <div className="font-bold text-navy">{formatPercent(r.marginalRate)}</div>
                        <div className="text-xs text-warmgray-light">Marginal Rate (incl. Medicare)</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-warmgray">
                    {year === "2025-26"
                      ? `Uses the ${THIS.incomeYear} rates (second bracket ${pct(THIS.secondBracketRate)}), the ${THIS.incomeYear} Medicare levy surcharge tiers and study loan thresholds.`
                      : `Uses the ${NEXT.incomeYear} rates (second bracket ${pct(NEXT.secondBracketRate)}). The ATO has not yet published ${NEXT.incomeYear} Medicare levy low-income thresholds, so the ${THIS.incomeYear} ones are used; this only matters for taxable incomes up to ${formatAUD(MEDICARE_LEVY.shadeInThreshold)}.`}{" "}
                    Assumes a single Australian resident for the full year with no dependants.
                  </p>
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

function Row({ label, value, bold, highlight, red }: { label: string; value: string; bold?: boolean; highlight?: boolean; red?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span>
      <span className={`${bold ? "font-bold" : "font-medium"} ${highlight ? "text-eucalyptus-dark" : red ? "text-ochre" : "text-navy"}`}>{value}</span>
    </div>
  );
}
