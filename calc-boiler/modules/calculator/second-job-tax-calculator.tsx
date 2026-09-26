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
import { withholdingForPeriod } from "@/lib/constants/payg-withholding";
import ResultNextSteps, { type ResultNextStep } from "@/components/common/result-next-steps";
import StickyResult from "@/components/common/sticky-result";
import { nearestSalary, salaryHref } from "@/lib/data/salary-pages";

// Lead example: what the no-tax-free-threshold scale takes from a $1,000 fortnight.
const LEAD_FORTNIGHT = 1_000;
const LEAD_NO_TFT = withholdingForPeriod(LEAD_FORTNIGHT, "fortnightly", "noTft");

/**
 * Annual PAYG withheld on a second job paid fortnightly with the tax-free
 * threshold NOT claimed — ATO Schedule 1 scale 1 (NAT 1006 coefficients),
 * which already includes the Medicare levy. Replaces a flat "30% + 2%"
 * approximation that overstated withholding on small second jobs.
 */
function noTftAnnualWithholding(annual: number): number {
  if (annual <= 0) return 0;
  return withholdingForPeriod(annual / 26, "fortnightly", "noTft") * 26;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Client part of /second-job-tax-calculator/: hero + calculator card. The
 * static long-form content (second-job-tax-calculator-content.tsx) is passed in
 * as `children`, so it is not part of the client bundle.
 */
export default function SecondJobTaxCalculatorPage({ children, afterCalculator }: { children: React.ReactNode; afterCalculator?: React.ReactNode }) {
  const [job1Salary, setJob1Salary] = useState(60_000);
  const [job2Salary, setJob2Salary] = useState(25_000);

  const result = useMemo(() => {
    // Job 1: WITH tax-free threshold (normal resident calculation)
    const job1RawTax = calculateIncomeTax(job1Salary);
    const job1LITO = calculateLITO(job1Salary);
    const job1NetTax = Math.max(0, Math.round(job1RawTax - job1LITO));
    const job1Medicare = calculateMedicareLevy(job1Salary);
    const job1TotalWithheld = job1NetTax + job1Medicare;
    const job1TakeHome = job1Salary - job1TotalWithheld;

    // Job 2: WITHOUT tax-free threshold (no TFT withholding)
    // Approximate: tax on combined income minus tax on job 1 income
    // This models the marginal tax effect of a second job
    const job2Withholding = noTftAnnualWithholding(job2Salary);
    const job2Medicare = 0; // included in the scale 1 withholding amount
    const job2TotalWithheld = job2Withholding + job2Medicare;
    const job2TakeHome = job2Salary - job2TotalWithheld;

    // Combined actual tax liability at EOFY
    const totalIncome = job1Salary + job2Salary;
    const combinedRawTax = calculateIncomeTax(totalIncome);
    const combinedLITO = calculateLITO(totalIncome);
    const combinedNetTax = Math.max(0, Math.round(combinedRawTax - combinedLITO));
    const combinedMedicare = calculateMedicareLevy(totalIncome);
    const actualTotalTax = combinedNetTax + combinedMedicare;
    const actualTakeHome = totalIncome - actualTotalTax;

    // Refund or debt
    const totalWithheld = job1TotalWithheld + job2TotalWithheld;
    const refundOrDebt = totalWithheld - actualTotalTax;

    // Effective rates
    const job1EffectiveRate = job1Salary > 0 ? job1TotalWithheld / job1Salary : 0;
    const job2EffectiveRate = job2Salary > 0 ? job2TotalWithheld / job2Salary : 0;
    const combinedEffectiveRate = totalIncome > 0 ? actualTotalTax / totalIncome : 0;

    return {
      job1NetTax, job1Medicare, job1TotalWithheld, job1TakeHome, job1EffectiveRate,
      job2Withholding, job2Medicare, job2TotalWithheld, job2TakeHome, job2EffectiveRate,
      totalIncome, combinedNetTax, combinedMedicare, actualTotalTax, actualTakeHome,
      totalWithheld, refundOrDebt, combinedEffectiveRate,
    };
  }, [job1Salary, job2Salary]);

  // Next steps inside the result card, carrying the visitor's combined income.
  const nextSteps = useMemo<ResultNextStep[]>(() => {
    const combined = nearestSalary("take-home", result.totalIncome);
    return [
      { href: salaryHref("take-home", combined), label: `See your take-home on ${formatAUD(combined)} combined`, detail: "Both jobs added together and taxed once" },
      { href: "/tax-free-threshold/", label: "Check which job should claim the tax-free threshold" },
      { href: "/payg-withholding-tables/", label: "See the no-tax-free-threshold withholding scale" },
      { href: "/tax-return-calculator/", label: "Estimate your tax return with both incomes" },
    ];
  }, [result.totalIncome]);

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
                  <li><span className="font-medium text-navy" aria-current="page">Second Job Tax Calculator</span></li>
                </ol>
              </nav>
              <div className="flex justify-between items-start mb-2 mt-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  Second Job Tax Calculator Australia {SITE_CONFIG.financialYear}
                </h1>
              </div>
              <p className="text-base md:text-lg text-warmgray">
                Both jobs are taxed once on combined income, but the second employer withholds {formatAUD(LEAD_NO_TFT)} (
                {formatPercent(LEAD_NO_TFT / LEAD_FORTNIGHT)}) from a {formatAUD(LEAD_FORTNIGHT)} fortnight without the tax-free threshold.
              </p>
              <TrustBar className="mt-2" />
            </div>
          </section>

          {/* CALCULATOR */}
          <section className="max-w-4xl mx-auto">
            <Card className="shadow-md py-0">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl font-semibold text-navy mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Calculate Tax on Two Jobs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Inputs */}
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    <div>
                      <label htmlFor="job1" className="block text-sm font-medium text-navy mb-1">Job 1 — Annual Salary (with tax-free threshold)</label>
                      <div className="flex items-center">
                        <span className="text-warmgray-light mr-2">$</span>
                        <input type="number" id="job1" min={0} max={300000} step={1000} value={job1Salary}
                          onChange={(e) => setJob1Salary(clamp(Number(e.target.value || 0), 0, 300000))}
                          className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm" />
                      </div>
                      <input type="range" min={0} max={200000} step={5000} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1}
                        value={clamp(job1Salary, 0, 200000)} onChange={(e) => setJob1Salary(Number(e.target.value))} />
                    </div>
                    <div>
                      <label htmlFor="job2" className="block text-sm font-medium text-navy mb-1">Job 2 — Annual Salary (no tax-free threshold)</label>
                      <div className="flex items-center">
                        <span className="text-warmgray-light mr-2">$</span>
                        <input type="number" id="job2" min={0} max={300000} step={1000} value={job2Salary}
                          onChange={(e) => setJob2Salary(clamp(Number(e.target.value || 0), 0, 300000))}
                          className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm" />
                      </div>
                      <input type="range" min={0} max={200000} step={5000} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1}
                        value={clamp(job2Salary, 0, 200000)} onChange={(e) => setJob2Salary(Number(e.target.value))} />
                    </div>
                    <button type="submit" className="w-full bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200">
                      Calculate Second Job Tax
                    </button>
                  </form>

                  {/* Results */}
                  <div className="space-y-4">
                    {/* Job 1 breakdown */}
                    <Card className="bg-sandstone border-0 shadow-none" role="region" aria-live="polite">
                      <CardContent className="p-4">
                        <h3 className="text-sm font-semibold text-navy mb-2">Job 1 — With Tax-Free Threshold</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between"><span className="text-warmgray">Gross</span><span className="font-medium text-navy">{formatAUD(job1Salary)}</span></div>
                          <div className="flex justify-between"><span className="text-warmgray">Tax + Medicare</span><span className="font-medium text-navy">{formatNegAUD(result.job1TotalWithheld)}</span></div>
                          <div className="flex justify-between"><span className="font-semibold text-navy">Take-Home</span><span className="font-bold text-eucalyptus-dark">{formatAUD(result.job1TakeHome)}</span></div>
                          <div className="text-xs text-warmgray-light">Effective rate: {formatPercent(result.job1EffectiveRate)}</div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Job 2 breakdown */}
                    <Card className="bg-sandstone border-0 shadow-none">
                      <CardContent className="p-4">
                        <h3 className="text-sm font-semibold text-navy mb-2">Job 2 — No Tax-Free Threshold</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between"><span className="text-warmgray">Gross</span><span className="font-medium text-navy">{formatAUD(job2Salary)}</span></div>
                          <div className="flex justify-between"><span className="text-warmgray">Tax + Medicare</span><span className="font-medium text-navy">{formatNegAUD(result.job2TotalWithheld)}</span></div>
                          <div className="flex justify-between"><span className="font-semibold text-navy">Take-Home</span><span className="font-bold text-eucalyptus-dark">{formatAUD(result.job2TakeHome)}</span></div>
                          <div className="text-xs text-warmgray-light">Effective rate: {formatPercent(result.job2EffectiveRate)}</div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Combined EOFY */}
                    <Card id="calc-result" className="bg-white border border-sandstone-dark/20 shadow-sm">
                      <CardContent className="p-4">
                        <h3 className="text-sm font-semibold text-navy mb-2">Combined — End of Financial Year</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between"><span className="text-warmgray">Combined Income</span><span className="font-medium text-navy">{formatAUD(result.totalIncome)}</span></div>
                          <div className="flex justify-between"><span className="text-warmgray">Total Withheld</span><span className="font-medium text-navy">{formatNegAUD(result.totalWithheld)}</span></div>
                          <div className="flex justify-between"><span className="text-warmgray">Actual Tax Liability</span><span className="font-medium text-navy">{formatNegAUD(result.actualTotalTax)}</span></div>
                          <div className="border-t border-sandstone-dark/20 my-2" />
                          <div className="flex justify-between">
                            <span className="font-semibold text-navy">{result.refundOrDebt >= 0 ? "Estimated Refund" : "Estimated Tax Debt"}</span>
                            <span className={`text-lg font-bold ${result.refundOrDebt >= 0 ? "text-eucalyptus-dark" : "text-ochre"}`}>
                              {result.refundOrDebt >= 0 ? "+" : ""}{formatAUD(result.refundOrDebt)}
                            </span>
                          </div>
                          <div className="text-xs text-warmgray-light">Combined effective rate: {formatPercent(result.combinedEffectiveRate)}</div>
                        </div>
                        <ResultNextSteps links={nextSteps} />
                      </CardContent>
                    </Card>
                    <StickyResult
                      targetId="calc-result"
                      label={result.refundOrDebt >= 0 ? "Estimated refund" : "Estimated tax debt"}
                      value={`${result.refundOrDebt >= 0 ? "+" : ""}${formatAUD(result.refundOrDebt)}`}
                      hint="at tax time"
                    />
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-6">
                  <div className="bg-sandstone border-l-4 border-eucalyptus p-4 text-sm text-warmgray">
                    <p className="font-medium mb-1">Disclaimer:</p>
                    <p>This calculator provides estimates based on current ATO PAYG withholding schedules. Job 2 withholding uses an approximate &quot;no tax-free threshold&quot; rate. Your actual refund or debt depends on deductions, offsets, and other income. For personal tax advice, consult a registered tax agent.</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-warmgray border-t border-sandstone-dark/20 pt-4">
                  <p className="flex items-center">
                    <ShieldCheck className="w-4 h-4 text-eucalyptus mr-2" />
                    <span>Based on official ATO tax tables for FY{SITE_CONFIG.financialYear}</span>
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
