"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Lodge your tax return", url: "https://www.ato.gov.au/individuals-and-families/your-tax-return", publisher: SOURCES.ato.name },
];

export default function TaxReturnCalculatorPage() {
  const [totalIncome, setTotalIncome] = useState(85_000);
  const [taxWithheld, setTaxWithheld] = useState(20_000);
  const [deductions, setDeductions] = useState(2_500);
  const [hasPrivateHealth, setHasPrivateHealth] = useState(true);
  const [includeHECS, setIncludeHECS] = useState(false);

  const taxableIncome = Math.max(0, totalIncome - deductions);

  const result = useMemo(
    () => calculatePayBreakdown({
      grossSalary: taxableIncome,
      includeHECS,
      hasPrivateHealth,
    }),
    [taxableIncome, includeHECS, hasPrivateHealth]
  );

  const actualTaxOwed = result.totalDeductions;
  const refundOrOwing = taxWithheld - actualTaxOwed;
  const isRefund = refundOrOwing >= 0;

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-eucalyptus-light/40 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Tax Return Estimator</span></li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">
            Tax Return Estimator Australia 2025-26
          </h1>
          <p className="text-lg text-warmgray">
            Estimate your tax refund or amount owing. Enter your income, tax withheld, and deductions
            to see if you can expect money back at tax time.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* DISCLAIMER */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-5 flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-ochre flex-shrink-0 mt-0.5" />
            <div>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="font-semibold text-navy mb-1">Estimation Only</h2>
              <p className="text-sm text-warmgray">
                This tool provides a <strong>rough estimate</strong> of your tax refund or liability. It is not tax advice.
                Your actual refund depends on your complete tax return including all income sources, deductions, and offsets.
                Lodge your return through <a href="https://my.gov.au" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">myGov / myTax</a> for an accurate result.
              </p>
            </div>
          </div>
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-6">Estimate Your Tax Refund</h2>
              <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                {/* Inputs */}
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="totalIncome" className="block text-sm font-medium text-navy mb-1">Total Gross Income</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="totalIncome" min={0} max={500000} step={1000} value={totalIncome}
                        onChange={(e) => setTotalIncome(clamp(Number(e.target.value || 0), 0, 500000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <p className="text-xs text-warmgray-light mt-1">From your payment summary or income statement</p>
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
                    <p className="text-xs text-warmgray-light mt-1">Work-related expenses, WFH, uniforms, etc.</p>
                  </div>

                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" checked={!hasPrivateHealth} onChange={(e) => setHasPrivateHealth(!e.target.checked)}
                      className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" />
                    <span className="text-navy">No private health insurance</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" checked={includeHECS} onChange={(e) => setIncludeHECS(e.target.checked)}
                      className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" />
                    <span className="text-navy">HECS-HELP debt</span>
                  </label>
                </form>

                {/* Results */}
                <div className="space-y-6">
                  <div className={`${isRefund ? "bg-eucalyptus-light/30 border-sandstone-dark/20" : "bg-sandstone border-sandstone-dark/20"} border rounded-xl p-6 text-center shadow-sm`}>
                    <div className={`text-sm font-semibold ${isRefund ? "text-eucalyptus-dark" : "text-ochre"} uppercase tracking-wider mb-2`}>
                      {isRefund ? "Estimated Refund" : "Estimated Amount Owing"}
                    </div>
                    <div className="text-4xl font-extrabold text-navy mb-1">
                      {formatAUD(Math.abs(refundOrOwing))}
                    </div>
                    <div className="text-sm text-warmgray mt-2">
                      {isRefund
                        ? "Your employer withheld more tax than your actual liability"
                        : "Your employer withheld less tax than your actual liability"
                      }
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                      <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">Tax Reconciliation</h3>
                    </div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Total Gross Income" value={formatAUD(totalIncome)} />
                      <Row label="Less: Deductions" value={`-${formatAUD(deductions)}`} />
                      <Row label="Taxable Income" value={formatAUD(taxableIncome)} bold />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label="Income Tax" value={formatAUD(result.netIncomeTax)} />
                      <Row label="Medicare Levy" value={formatAUD(result.medicareLevy)} />
                      {result.medicareSurcharge > 0 && <Row label="Medicare Surcharge" value={formatAUD(result.medicareSurcharge)} />}
                      {includeHECS && <Row label="HECS Repayment" value={formatAUD(result.hecsRepayment)} />}
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label="Total Tax Liability" value={formatAUD(actualTaxOwed)} bold />
                      <Row label="Tax Already Withheld (PAYG)" value={formatAUD(taxWithheld)} />
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label={isRefund ? "Estimated Refund" : "Amount Owing"} value={formatAUD(Math.abs(refundOrOwing))} bold highlight={isRefund} red={!isRefund} />
                    </div>
                  </div>

                  <div className="bg-sandstone rounded-xl border border-sandstone-dark/20 p-5">
                    <h3 className="font-semibold text-navy text-sm mb-3">Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center bg-white p-3 rounded-lg border border-sandstone-dark/10">
                        <div className="font-bold text-navy">{formatPercent(result.effectiveTaxRate)}</div>
                        <div className="text-xs text-warmgray-light">Effective Tax Rate</div>
                      </div>
                      <div className="text-center bg-white p-3 rounded-lg border border-sandstone-dark/10">
                        <div className="font-bold text-navy">{formatPercent(result.marginalTaxRate)}</div>
                        <div className="text-xs text-warmgray-light">Marginal Tax Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Is Your Tax Return Calculated?</h2>
            <p className="mb-4 text-warmgray">
              Your Australian tax return is calculated by comparing the total tax withheld by your employer against your actual tax liability for the 2025-26 financial year. The ATO uses your assessable income, allowable deductions, and applicable offsets to determine the precise amount you owe or receive back.
            </p>
            <p className="mb-4 text-warmgray">
              Throughout the year, your employer withholds tax from each pay under the <strong>PAYG withholding</strong> system. This withholding is based on standard tax tables that assume a single income source and no deductions beyond the tax-free threshold. When you lodge your tax return, the ATO recalculates your liability using the actual figures.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 mb-4">
              <div className="bg-white p-6 rounded-xl border border-sandstone-dark/20 shadow-sm border-t-4 border-t-eucalyptus">
                <h3 className="font-semibold text-navy mb-2">Over-Withheld = Refund</h3>
                <p className="text-sm text-warmgray">If your employer withheld <em>more</em> tax than your actual liability (common if you claimed deductions), you get the difference back as a refund.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-sandstone-dark/20 shadow-sm border-t-4 border-t-ochre">
                <h3 className="font-semibold text-navy mb-2">Under-Withheld = Bill</h3>
                <p className="text-sm text-warmgray">If not enough was withheld (e.g., multiple jobs, incorrect TFN declaration), you owe the ATO the shortfall when you lodge your return.</p>
              </div>
            </div>
            <p className="mb-4 text-warmgray">
              The calculation follows 4 steps:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>Determine assessable income</strong> &mdash; add all salary, wages, interest, dividends, and other income received during FY2025-26</li>
              <li><strong>Subtract allowable deductions</strong> &mdash; work-related expenses, self-education costs, and donation claims reduce your taxable income</li>
              <li><strong>Apply income tax brackets and offsets</strong> &mdash; the ATO calculates tax on your taxable income using marginal rates, then applies the &quot;Low Income Tax Offset&quot; (LITO) worth up to <strong>$700</strong> and the &quot;Medicare Levy&quot; at <strong>2%</strong></li>
              <li><strong>Compare to PAYG withheld</strong> &mdash; the difference between your total tax liability and tax already withheld determines your refund or amount owing</li>
            </ol>
            <p className="text-warmgray">
              Use our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to see the full breakdown of income tax brackets applied to your salary before estimating your return.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Deductions Increase Your Tax Refund?</h2>
            <p className="mb-4 text-warmgray">
              Claiming eligible deductions reduces your taxable income, which lowers your tax liability and increases your refund. Every <strong>$1</strong> of deductions saves between <strong>$0.19 and $0.45</strong> in tax depending on your marginal tax rate for FY2025-26.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Deduction Category</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">What You Claim</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Typical Claim</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Tax Saved (32.5%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">Work from home</td>
                    <td className="px-4 py-3 text-warmgray">Fixed rate of 67c per hour for electricity, internet, phone, and stationery</td>
                    <td className="px-4 py-3 text-right text-warmgray">$1,000 &ndash; $3,000</td>
                    <td className="px-4 py-3 text-right text-warmgray">$325 &ndash; $975</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">Car and travel</td>
                    <td className="px-4 py-3 text-warmgray">Work-related travel using cents-per-km (85c/km) or logbook method</td>
                    <td className="px-4 py-3 text-right text-warmgray">$500 &ndash; $5,000</td>
                    <td className="px-4 py-3 text-right text-warmgray">$163 &ndash; $1,625</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">Uniform and clothing</td>
                    <td className="px-4 py-3 text-warmgray">Purchasing and laundering occupation-specific clothing, protective gear</td>
                    <td className="px-4 py-3 text-right text-warmgray">$150 &ndash; $500</td>
                    <td className="px-4 py-3 text-right text-warmgray">$49 &ndash; $163</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">Self-education</td>
                    <td className="px-4 py-3 text-warmgray">Courses, textbooks, and conferences directly related to current employment</td>
                    <td className="px-4 py-3 text-right text-warmgray">$200 &ndash; $2,000</td>
                    <td className="px-4 py-3 text-right text-warmgray">$65 &ndash; $650</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">Tools and equipment</td>
                    <td className="px-4 py-3 text-warmgray">Items up to $300 claimed immediately; items over $300 depreciated over useful life</td>
                    <td className="px-4 py-3 text-right text-warmgray">$100 &ndash; $1,000</td>
                    <td className="px-4 py-3 text-right text-warmgray">$33 &ndash; $325</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">Union fees and subscriptions</td>
                    <td className="px-4 py-3 text-warmgray">Professional association memberships, union dues, trade journals</td>
                    <td className="px-4 py-3 text-right text-warmgray">$200 &ndash; $800</td>
                    <td className="px-4 py-3 text-right text-warmgray">$65 &ndash; $260</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">Donations</td>
                    <td className="px-4 py-3 text-warmgray">Gifts of $2 or more to registered deductible gift recipients (DGRs)</td>
                    <td className="px-4 py-3 text-right text-warmgray">$50 &ndash; $500</td>
                    <td className="px-4 py-3 text-right text-warmgray">$16 &ndash; $163</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-warmgray-light">You must have spent the money yourself, it must be directly related to earning your income, and you need records to prove it. Claims without receipts are limited to <strong>$300</strong> total.</p>
            <p className="mt-3 text-warmgray">
              Salary sacrifice arrangements reduce your assessable income before tax. Use our <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> to compare take-home pay with and without salary packaging.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Who Uses This Tax Return Calculator?</h2>
            <p className="mb-4 text-warmgray">
              This Australian tax return calculator is used by employees, freelancers, and retirees who want to estimate their refund before lodging through myTax. Over <strong>13.6 million</strong> individual tax returns are lodged in Australia each financial year.
            </p>
            <ul className="space-y-3 text-warmgray mb-4">
              <li className="flex items-start gap-3">
                <span className="bg-sandstone text-navy text-xs font-bold px-3 py-1 rounded-full mt-0.5">1</span>
                <span><strong>PAYG employees</strong> checking whether their employer withheld the correct amount of tax, especially after starting a new role, receiving a pay rise, or working overtime</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-sandstone text-navy text-xs font-bold px-3 py-1 rounded-full mt-0.5">2</span>
                <span><strong>Multiple-job holders</strong> who need to reconcile PAYG withheld across 2 or more employers &mdash; each employer withholds tax as if they are the sole income source</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-sandstone text-navy text-xs font-bold px-3 py-1 rounded-full mt-0.5">3</span>
                <span><strong>Contractors and sole traders</strong> estimating quarterly BAS obligations and year-end tax liability using our <Link href="/contractor-pay-calculator/" className="text-eucalyptus-dark hover:underline">Contractor Pay Calculator</Link></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-sandstone text-navy text-xs font-bold px-3 py-1 rounded-full mt-0.5">4</span>
                <span><strong>HECS-HELP debtors</strong> calculating whether their compulsory repayment reduces their refund &mdash; repayments start at incomes above <strong>$69,528</strong> for FY2025-26</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-sandstone text-navy text-xs font-bold px-3 py-1 rounded-full mt-0.5">5</span>
                <span><strong>Financial planners</strong> running scenarios for clients comparing deduction strategies, superannuation contributions, and salary sacrifice arrangements</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is the Average Tax Refund in Australia by Income Level?</h2>
            <p className="mb-4 text-warmgray">
              The average Australian tax refund is approximately <strong>$2,800</strong> per individual, though this varies significantly by income bracket. Higher earners typically receive larger refunds in absolute dollars because each dollar of deductions saves more tax at higher marginal rates.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Taxable Income</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Marginal Rate</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Avg Refund</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Avg Deductions Claimed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">$0 &ndash; $18,200</td>
                    <td className="px-4 py-3 text-right text-warmgray">0%</td>
                    <td className="px-4 py-3 text-right text-warmgray">$400</td>
                    <td className="px-4 py-3 text-right text-warmgray">$350</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">$18,201 &ndash; $45,000</td>
                    <td className="px-4 py-3 text-right text-warmgray">16%</td>
                    <td className="px-4 py-3 text-right text-warmgray">$1,200</td>
                    <td className="px-4 py-3 text-right text-warmgray">$1,100</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">$45,001 &ndash; $135,000</td>
                    <td className="px-4 py-3 text-right text-warmgray">30%</td>
                    <td className="px-4 py-3 text-right text-warmgray">$2,900</td>
                    <td className="px-4 py-3 text-right text-warmgray">$2,600</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">$135,001 &ndash; $190,000</td>
                    <td className="px-4 py-3 text-right text-warmgray">37%</td>
                    <td className="px-4 py-3 text-right text-warmgray">$4,100</td>
                    <td className="px-4 py-3 text-right text-warmgray">$4,500</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">$190,001+</td>
                    <td className="px-4 py-3 text-right text-warmgray">45%</td>
                    <td className="px-4 py-3 text-right text-warmgray">$5,600</td>
                    <td className="px-4 py-3 text-right text-warmgray">$8,200</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">
              A taxpayer earning <strong>$85,000</strong> with <strong>$2,500</strong> in deductions and standard PAYG withholding typically receives a refund between <strong>$1,500 and $3,500</strong>. Taxpayers without private health insurance pay an additional &quot;Medicare Levy Surcharge&quot; of <strong>1% to 1.5%</strong>, which reduces the refund. Use our <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> to see your after-tax income including the Medicare levy and surcharge.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is the Difference Between a Tax Return and a Tax Refund?</h2>
            <p className="mb-4 text-warmgray">
              A &quot;tax return&quot; is the form you lodge with the ATO reporting your income, deductions, and offsets. A &quot;tax refund&quot; is the money the ATO pays back to you when your employer withheld more tax than your actual liability.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Feature</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Tax Return</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Tax Refund</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">Definition</td>
                    <td className="px-4 py-3 text-warmgray">The annual form lodged with the ATO declaring income and deductions</td>
                    <td className="px-4 py-3 text-warmgray">The money returned when PAYG withheld exceeds actual tax owed</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">Who files it</td>
                    <td className="px-4 py-3 text-warmgray">Every Australian resident who earns above <strong>$18,200</strong></td>
                    <td className="px-4 py-3 text-warmgray">Automatically issued by the ATO after assessment</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">Deadline</td>
                    <td className="px-4 py-3 text-warmgray"><strong>31 October</strong> (self-lodging) or <strong>15 May</strong> (via tax agent)</td>
                    <td className="px-4 py-3 text-warmgray">Processed within <strong>2&ndash;4 weeks</strong> of lodgement</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">Outcome</td>
                    <td className="px-4 py-3 text-warmgray">Results in either a refund or an amount owing</td>
                    <td className="px-4 py-3 text-warmgray">Deposited directly into your nominated bank account</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">Guaranteed?</td>
                    <td className="px-4 py-3 text-warmgray">Mandatory for most income earners</td>
                    <td className="px-4 py-3 text-warmgray">Not guaranteed &mdash; you receive a bill if under-withheld</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">
              Lodging a tax return does not always produce a refund. Approximately <strong>25%</strong> of Australian taxpayers receive a bill rather than a refund, most commonly those with multiple income sources, investment income, or insufficient PAYG withholding.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Tax Return Deadlines for FY2025-26</h2>
            <p className="mb-4 text-warmgray">
              The FY2025-26 tax return covers income earned from <strong>1 July 2025 to 30 June 2026</strong>. Missing the lodgement deadline results in a failure-to-lodge penalty starting at <strong>$313</strong> for every 28-day period the return is overdue, up to a maximum of <strong>$1,565</strong>.
            </p>
            <ul className="space-y-3 text-warmgray">
              <li className="flex items-start gap-3">
                <span className="bg-sandstone text-navy text-xs font-bold px-3 py-1 rounded-full">1 Jul</span>
                <span>New financial year begins &mdash; income statements become available on myGov from mid-July as employers finalise payroll</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-sandstone text-navy text-xs font-bold px-3 py-1 rounded-full">14 Aug</span>
                <span>Most employers have finalised income statements in myGov &mdash; the ATO pre-fills deduction data from health insurers, banks, and government agencies</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-sandstone text-navy text-xs font-bold px-3 py-1 rounded-full">31 Oct</span>
                <span>Deadline to lodge your tax return if self-preparing through myTax</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-sandstone text-navy text-xs font-bold px-3 py-1 rounded-full">15 May</span>
                <span>Extended deadline if lodging through a registered tax agent (you must be registered with the agent before 31 October)</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Are the Most Common Tax Return Mistakes?</h2>
            <p className="mb-4 text-warmgray">
              The ATO adjusts approximately <strong>1.8 million</strong> tax returns each year due to errors, omissions, and incorrect claims. Avoiding these 5 common mistakes protects your refund and prevents penalties.
            </p>
            <ol className="list-decimal pl-6 space-y-3 text-warmgray mb-4">
              <li><strong>Forgetting to declare all income sources</strong> &mdash; the ATO receives data from banks, employers, government agencies, and share registries. Omitting interest income above <strong>$1</strong>, dividend income, or government payments triggers automatic data-matching reviews.</li>
              <li><strong>Claiming private expenses as work deductions</strong> &mdash; the home-to-work commute, personal phone usage, and general clothing are not deductible. The ATO flags claims that exceed industry benchmarks, such as car expenses above <strong>$3,500</strong> for office-based workers.</li>
              <li><strong>Not updating your tax file number (TFN) declaration</strong> &mdash; claiming the tax-free threshold from multiple employers simultaneously causes under-withholding. Only one employer applies the <strong>$18,200</strong> tax-free threshold; additional employers must withhold at the &quot;no tax-free threshold&quot; rate.</li>
              <li><strong>Missing the Medicare Levy Surcharge</strong> &mdash; singles earning above <strong>$93,000</strong> and families above <strong>$186,000</strong> without private hospital cover pay the surcharge at <strong>1% to 1.5%</strong>. Many taxpayers forget to account for this additional cost.</li>
              <li><strong>Lodging before employer data is finalised</strong> &mdash; lodging your return in early July before your employer has submitted income statements to the ATO results in missing pre-fill data. Waiting until mid-August ensures all income and deduction data is available.</li>
            </ol>
            <p className="text-warmgray">
              Taxpayers carrying a HECS-HELP debt face an additional risk: compulsory repayments are calculated on your &quot;Repayment Income&quot;, not your taxable income. Use our <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> to estimate your compulsory repayment amount before lodging.
            </p>
          </section>

          {/* --- CONTEXT BORDER --- */}

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Related Australian Tax Calculators</h2>
            <p className="mb-4 text-warmgray">
              Estimating your tax return is one part of understanding your total pay. These calculators cover superannuation, take-home pay, salary sacrifice, and income tax brackets for FY2025-26.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/income-tax-calculator/" className="block bg-white p-5 rounded-xl border border-sandstone-dark/20 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-navy mb-1">Income Tax Calculator</h3>
                <p className="text-sm text-warmgray">See the full breakdown of income tax brackets, LITO, and marginal rates applied to your salary.</p>
              </Link>
              <Link href="/take-home-pay-calculator/" className="block bg-white p-5 rounded-xl border border-sandstone-dark/20 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-navy mb-1">Take-Home Pay Calculator</h3>
                <p className="text-sm text-warmgray">Calculate your net pay after tax, Medicare levy, superannuation, and HECS-HELP deductions.</p>
              </Link>
              <Link href="/superannuation-calculator/" className="block bg-white p-5 rounded-xl border border-sandstone-dark/20 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-navy mb-1">Superannuation Calculator</h3>
                <p className="text-sm text-warmgray">Calculate your employer SG rate contribution at 12% and estimate your projected super balance.</p>
              </Link>
              <Link href="/salary-sacrifice-calculator/" className="block bg-white p-5 rounded-xl border border-sandstone-dark/20 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-navy mb-1">Salary Sacrifice Calculator</h3>
                <p className="text-sm text-warmgray">Compare pre-tax and post-tax salary packaging to maximise your take-home pay and super contributions.</p>
              </Link>
              <Link href="/hecs-help-calculator/" className="block bg-white p-5 rounded-xl border border-sandstone-dark/20 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-navy mb-1">HECS-HELP Calculator</h3>
                <p className="text-sm text-warmgray">Estimate your compulsory HECS-HELP repayment based on your repayment income and current thresholds.</p>
              </Link>
              <Link href="/gross-pay-calculator/" className="block bg-white p-5 rounded-xl border border-sandstone-dark/20 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-navy mb-1">Gross Pay Calculator</h3>
                <p className="text-sm text-warmgray">Reverse-calculate your gross salary from a target take-home pay amount including all deductions.</p>
              </Link>
            </div>
          </section>

          <MethodologyDisclosure>
            <p className="mb-2 text-sm">This estimator uses the following approach:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Calculates actual tax liability using FY2025-26 tax brackets, LITO offset, and Medicare levy</li>
              <li>Compares the result to your stated PAYG tax withheld to estimate your refund/liability</li>
              <li>Does not account for: private ruling offsets, foreign income, capital gains, rental income, dividend franking credits, or other income sources</li>
              <li>This is an estimate only — lodge through <a href="https://my.gov.au" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">myTax</a> for your actual result</li>
            </ul>
          </MethodologyDisclosure>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <AccordionItem value="how-much" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How much will my tax refund be?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Your refund equals the difference between tax withheld by your employer and your actual tax liability. The average Australian tax refund is approximately <strong>$2,800</strong>. A PAYG employee earning <strong>$85,000</strong> with <strong>$2,500</strong> in deductions and standard withholding typically receives a refund between <strong>$1,500 and $3,500</strong> depending on offsets, Medicare levy, and HECS-HELP status.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="when-refund" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>When will I get my tax refund?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Electronic returns lodged through myTax are processed within <strong>2 to 4 weeks</strong>. Paper returns take <strong>10 to 12 weeks</strong>. Returns selected for review or data-matching verification take up to <strong>30 business days</strong>. Lodging after mid-August (when pre-fill data is complete) reduces the chance of processing delays.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="no-deductions" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Do I get a refund if I have no deductions?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes, in many cases. A refund occurs whenever your employer withheld more tax than your actual liability. This happens when you started a job partway through the year, had irregular pay periods, or earned below <strong>$45,000</strong> where the &quot;Low Income Tax Offset&quot; reduces your actual tax below the PAYG withholding amount. The LITO provides up to <strong>$700</strong> in offset that is not factored into standard withholding tables.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="owe-money" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>What if I owe money to the ATO?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">If your tax withheld was less than your actual liability, you receive a bill from the ATO. Common causes include holding multiple jobs (each employer withholds as if it is your sole income source), receiving untaxed investment income, or submitting an incorrect TFN declaration. The ATO offers interest-free payment plans for debts under <strong>$100,000</strong> with terms up to <strong>24 months</strong>.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="hecs-refund" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Does HECS-HELP reduce my tax refund?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. Compulsory HECS-HELP repayments are calculated as part of your tax assessment and reduce your refund dollar-for-dollar. For FY2025-26, repayments start at <strong>1%</strong> of repayment income for earners above <strong>$69,528</strong> and increase to <strong>10%</strong> for incomes above <strong>$151,201</strong>. An employee earning <strong>$85,000</strong> with a HELP debt pays approximately <strong>$3,400</strong> in compulsory repayments.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="private-health" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How does private health insurance affect my tax return?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Singles earning above <strong>$93,000</strong> and families above <strong>$186,000</strong> without private hospital cover pay the &quot;Medicare Levy Surcharge&quot; at <strong>1%</strong>, <strong>1.25%</strong>, or <strong>1.5%</strong> depending on income tier. This surcharge is assessed at lodgement and reduces your refund or increases your bill. Holding compliant private hospital cover for the full financial year eliminates the surcharge entirely.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="multiple-jobs" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Why do I owe tax when I have two jobs?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Each employer withholds tax independently using PAYG tables that assume a single income source. Your primary employer applies the <strong>$18,200</strong> tax-free threshold, but if your second employer also applies the threshold (because you ticked &quot;claim tax-free threshold&quot; on both TFN declarations), insufficient tax is withheld across both roles. The solution is to claim the tax-free threshold from only one employer and select &quot;no tax-free threshold&quot; for all additional employers.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="lodge-early" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Is it better to lodge my tax return early or wait?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Waiting until mid-August produces the most accurate result. The ATO pre-fills your return with data from employers, banks, health insurers, and government agencies, but most of this data is not available until <strong>6 to 8 weeks</strong> after 30 June. Lodging in early July risks missing income sources, which triggers ATO amendments and potential penalties. The deadline for self-lodged returns is <strong>31 October</strong>.</p></AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
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
