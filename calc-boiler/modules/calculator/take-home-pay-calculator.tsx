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
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
  SUPER_GUARANTEE,
  HECS_HELP,
  MEDICARE_LEVY,
  LITO,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Medicare levy", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy", publisher: SOURCES.ato.name },
  { title: "HECS-HELP repayment thresholds", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: SOURCES.ato.name },
  { title: "Super guarantee rate", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-contributions/how-much-super-to-pay", publisher: SOURCES.ato.name },
];

export default function TakeHomePayCalculatorPage() {
  const [salary, setSalary] = useState(80_000);
  const [includeHECS, setIncludeHECS] = useState(false);
  const [hasPrivateHealth, setHasPrivateHealth] = useState(true);

  const result = useMemo(
    () => calculatePayBreakdown({ grossSalary: salary, includeHECS, hasPrivateHealth }),
    [salary, includeHECS, hasPrivateHealth]
  );

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-eucalyptus-light/40 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb"><ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-gray-400" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Take-Home Pay Calculator</span></li>
          </ol></nav>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Take-Home Pay Calculator Australia — Net Pay After Tax &amp; Super</h1>
          <p className="text-lg text-warmgray">Work out exactly what you take home after income tax, Medicare levy, HECS-HELP repayments, and super — the amount that actually hits your bank account.</p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-navy mb-1">Gross Annual Salary</label>
                    <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="salary" min={0} max={500000} step={1000} value={salary}
                        onChange={(e) => setSalary(clamp(Number(e.target.value || 0), 0, 500000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <input type="range" min={0} max={300000} step={5000} value={clamp(salary, 0, 300000)}
                      onChange={(e) => setSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" />
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={includeHECS}
                    onChange={(e) => setIncludeHECS(e.target.checked)}
                    className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" /><span className="text-navy">Include HECS-HELP debt</span></label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={hasPrivateHealth}
                    onChange={(e) => setHasPrivateHealth(e.target.checked)}
                    className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" /><span className="text-navy">Private health insurance</span></label>
                  <button type="submit" className="w-full bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 rounded-lg shadow-md transition-all">Calculate Take-Home Pay</button>
                </form>

                <Card className="bg-sandstone border-0 shadow-none" role="region" aria-live="polite">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Your Pay Breakdown</h2>
                    <div className="space-y-2.5 text-sm">
                      <Row label="Gross Salary" value={formatAUD(salary)} bold />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Income Tax" value={`-${formatAUD(result.netIncomeTax)}`} />
                      {result.litoOffset > 0 && <Row label="  LITO Offset" value={`+${formatAUD(result.litoOffset)}`} sub />}
                      <Row label="Medicare Levy" value={`-${formatAUD(result.medicareLevy)}`} />
                      {result.medicareSurcharge > 0 && <Row label="Medicare Surcharge" value={`-${formatAUD(result.medicareSurcharge)}`} />}
                      {includeHECS && <Row label="HECS Repayment" value={`-${formatAUD(result.hecsRepayment)}`} />}
                      <div className="border-t border-sandstone-dark/20" />
                      <div className="flex justify-between items-baseline pt-1">
                        <span className="font-bold text-navy">Take-Home Pay</span>
                        <span className="text-2xl font-extrabold text-eucalyptus-dark">{formatAUD(result.takeHomePay)}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-center bg-sandstone rounded-lg p-2">
                        <div><div className="font-semibold text-navy">{formatAUD(result.weekly, 2)}</div><div className="text-warmgray-light">per week</div></div>
                        <div><div className="font-semibold text-navy">{formatAUD(result.fortnightly, 2)}</div><div className="text-warmgray-light">per fortnight</div></div>
                        <div><div className="font-semibold text-navy">{formatAUD(result.monthly, 2)}</div><div className="text-warmgray-light">per month</div></div>
                      </div>
                      <div className="border-t border-sandstone-dark/20 pt-2">
                        <Row label={`Super (${formatPercent(SUPER_GUARANTEE.rate, 0)})`} value={`+${formatAUD(result.superContribution)}`} />
                        <Row label="Total Package" value={formatAUD(result.totalPackage)} bold />
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-eucalyptus-light/30 p-2 text-xs">
                        <span className="text-warmgray">Effective tax rate</span>
                        <span className="font-semibold text-eucalyptus-dark">{formatPercent(result.effectiveTaxRate)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">

          {/* ---- HOW IS TAKE-HOME PAY CALCULATED? ---- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Take-Home Pay Calculated in Australia?</h2>
            <p className="text-warmgray mb-4">Take-home pay is your gross salary minus income tax, the Medicare levy, and any compulsory HECS-HELP repayments — calculated using the ATO&apos;s progressive tax brackets for FY{SITE_CONFIG.financialYear}.</p>
            <p className="text-warmgray mb-4">Your employer withholds these deductions from every pay cycle through the &quot;Pay As You Go&quot; (PAYG) system and remits them directly to the Australian Taxation Office. The amount that reaches your bank account — your after-tax income — is what this Australian tax calculator computes.</p>

            <h3 className="text-lg font-semibold text-navy mb-3">Worked Example: Take-Home Pay on $80,000</h3>
            <p className="text-warmgray mb-3">A full-time employee earning <strong>$80,000</strong> gross in FY{SITE_CONFIG.financialYear} receives the following net pay after tax:</p>
            <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>Gross salary:</strong> $80,000</li>
              <li><strong>Income tax:</strong> The first $18,200 is tax-free. The next $26,800 (from $18,201 to $45,000) is taxed at 16%, producing $4,288. The remaining $35,000 (from $45,001 to $80,000) is taxed at 30%, producing $10,500. Total income tax = <strong>$14,788</strong>.</li>
              <li><strong>LITO offset:</strong> At $80,000, taxable income exceeds the $66,667 phase-out ceiling, so the &quot;Low Income Tax Offset&quot; is <strong>$0</strong>.</li>
              <li><strong>Medicare levy:</strong> 2% of $80,000 = <strong>$1,600</strong>.</li>
              <li><strong>Total deductions:</strong> $14,788 + $1,600 = <strong>$16,388</strong>.</li>
              <li><strong>Take-home pay:</strong> $80,000 &minus; $16,388 = <strong>$63,612 per year</strong> ($1,223.31 per week).</li>
            </ol>
            <p className="text-warmgray">Your employer also contributes <strong>$9,600</strong> in superannuation (12% SG rate) on top of your salary, bringing the total remuneration package to <strong>$89,600</strong>. Use our <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to model different SG scenarios.</p>
          </section>

          {/* ---- WHAT DEDUCTIONS REDUCE YOUR TAKE-HOME PAY? ---- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Deductions Reduce Your Take-Home Pay?</h2>
            <p className="text-warmgray mb-4">Three compulsory deductions reduce your take-home pay in Australia: income tax, the Medicare levy, and HECS-HELP repayments (if you hold a student loan).</p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Deduction</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Rate / Rule</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Amount on $80,000</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Who Pays</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">Income Tax</td>
                    <td className="px-4 py-3 text-warmgray">Progressive brackets: 0%, 16%, 30%, 37%, 45%</td>
                    <td className="px-4 py-3 text-right font-medium text-navy">$14,788</td>
                    <td className="px-4 py-3 text-warmgray">All residents above $18,200</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">Medicare Levy</td>
                    <td className="px-4 py-3 text-warmgray">Flat 2% of taxable income</td>
                    <td className="px-4 py-3 text-right font-medium text-navy">$1,600</td>
                    <td className="px-4 py-3 text-warmgray">All residents above $27,222</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">Medicare Levy Surcharge</td>
                    <td className="px-4 py-3 text-warmgray">1%&ndash;1.5% if no private health insurance</td>
                    <td className="px-4 py-3 text-right font-medium text-navy">$0 (below $93,001 threshold)</td>
                    <td className="px-4 py-3 text-warmgray">Singles earning $93,001+ without PHI</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">HECS-HELP Repayment</td>
                    <td className="px-4 py-3 text-warmgray">Marginal: 15% on income above $67,000</td>
                    <td className="px-4 py-3 text-right font-medium text-navy">$1,950 (if debt exists)</td>
                    <td className="px-4 py-3 text-warmgray">Graduates with study loan above $67,000</td>
                  </tr>
                  <tr className="bg-sandstone/50">
                    <td className="px-4 py-3 font-medium text-navy">Superannuation (SG)</td>
                    <td className="px-4 py-3 text-warmgray">12% of ordinary time earnings</td>
                    <td className="px-4 py-3 text-right font-medium text-navy">$9,600 (employer-paid)</td>
                    <td className="px-4 py-3 text-warmgray">Employer pays on top &mdash; does NOT reduce take-home</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray mb-4">The largest deduction is income tax, calculated using Australia&apos;s <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">progressive tax brackets</Link>. The &quot;Low Income Tax Offset&quot; (LITO) reduces tax for incomes below $66,667, providing up to <strong>$700</strong> in savings. The <Link href="/medicare-levy/" className="text-eucalyptus-dark hover:underline">Medicare levy</Link> is a flat 2% that funds Australia&apos;s public healthcare system.</p>

            <h3 className="text-lg font-semibold text-navy mb-2">How Does the Tax-Free Threshold Affect Net Pay?</h3>
            <p className="text-warmgray">Every Australian tax resident claiming the tax-free threshold pays <strong>$0</strong> income tax on the first $18,200 of annual earnings. This threshold saves <strong>$2,912</strong> compared to the non-resident rate (16% from dollar one). Employees who hold multiple jobs should claim the threshold on only one position &mdash; claiming it on two jobs results in under-withholding and a tax bill at lodgment. Non-residents forfeit the threshold entirely and pay 30% from the first dollar earned, producing a significantly lower after-tax income on the same gross salary.</p>
          </section>

          {/* ---- TAKE-HOME PAY TABLE BY SALARY LEVEL ---- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much Take-Home Pay at Every Salary Level?</h2>
            <p className="mb-4 text-warmgray">An Australian resident earning <strong>$80,000</strong> takes home <strong>$63,612</strong> per year after income tax and Medicare levy in FY{SITE_CONFIG.financialYear}. The table below shows take-home pay, weekly pay, and effective tax rates at 7 common salary levels:</p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Gross Salary</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Income Tax</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Medicare</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Total Tax</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Take-Home</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Weekly</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Eff. Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[40000, 60000, 80000, 100000, 120000, 150000, 200000].map((s) => {
                    const b = calculatePayBreakdown({ grossSalary: s });
                    return (
                      <tr key={s} className="hover:bg-sandstone">
                        <td className="px-4 py-3 font-medium text-navy">{formatAUD(s)}</td>
                        <td className="px-4 py-3 text-right text-navy">{formatAUD(b.netIncomeTax)}</td>
                        <td className="px-4 py-3 text-right text-navy">{formatAUD(b.medicareLevy)}</td>
                        <td className="px-4 py-3 text-right text-navy">{formatAUD(b.totalDeductions)}</td>
                        <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(b.takeHomePay)}</td>
                        <td className="px-4 py-3 text-right text-navy">{formatAUD(b.weekly, 2)}</td>
                        <td className="px-4 py-3 text-right text-warmgray-light">{formatPercent(b.effectiveTaxRate)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-warmgray-light mb-4">
              Figures exclude HECS-HELP repayments and Medicare Levy Surcharge. If you carry a HECS debt, your take-home decreases further &mdash;{" "}
              <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline font-medium">calculate your HECS repayment</Link> to see the impact.
            </p>

            <h3 className="text-lg font-semibold text-navy mb-2">Take-Home Pay on Part-Time and Casual Hours</h3>
            <p className="text-warmgray">Part-time and casual employees use the same income tax brackets as full-time workers &mdash; the ATO does not distinguish by employment type. A part-time worker earning <strong>$40,000</strong> per year takes home <strong>$36,287</strong>, identical to a full-time employee on the same gross salary. Casual employees receive a 25% loading in lieu of leave entitlements, which increases gross pay but also increases taxable income. A casual worker paid $30 per hour for 25 hours per week earns $39,000 gross and takes home approximately <strong>$35,353</strong> after taxation and the Medicare levy.</p>
          </section>

          {/* ---- WHO USES THIS CALCULATOR? ---- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Uses This Take-Home Pay Calculator?</h2>
            <p className="text-warmgray mb-4">This Australian take-home pay calculator serves 5 primary user groups, each needing an accurate net salary figure for a different reason.</p>
            <ul className="space-y-3 text-warmgray">
              <li className="flex gap-2"><span className="text-eucalyptus-dark font-bold">1.</span><span><strong>Job seekers comparing offers</strong> &mdash; A $90,000 offer at one company and a $95,000 package at another produce different take-home amounts depending on whether super is included. Enter both figures to compare net pay directly.</span></li>
              <li className="flex gap-2"><span className="text-eucalyptus-dark font-bold">2.</span><span><strong>Employees budgeting monthly expenses</strong> &mdash; Rent, groceries, and loan repayments require a precise monthly income figure. The calculator converts your annual take-home into weekly, fortnightly, and monthly amounts.</span></li>
              <li className="flex gap-2"><span className="text-eucalyptus-dark font-bold">3.</span><span><strong>Graduates with HECS-HELP debt</strong> &mdash; Compulsory repayments begin at $67,000 under the new marginal system. Toggling the HECS option shows the exact reduction in your after-tax income.</span></li>
              <li className="flex gap-2"><span className="text-eucalyptus-dark font-bold">4.</span><span><strong>Workers considering a pay rise</strong> &mdash; A $10,000 raise does not equal $10,000 more take-home. On $80,000, an extra $10,000 adds only <strong>$6,800</strong> after the 30% marginal rate and 2% Medicare levy. Use our <Link href="/pay-rise-calculator/" className="text-eucalyptus-dark hover:underline">Pay Rise Calculator</Link> for side-by-side comparisons.</span></li>
              <li className="flex gap-2"><span className="text-eucalyptus-dark font-bold">5.</span><span><strong>Employers explaining total remuneration</strong> &mdash; HR teams use net pay breakdowns to show candidates the full value of a salary package, including the employer&apos;s 12% super contribution and any salary sacrifice arrangements.</span></li>
            </ul>
          </section>

          {/* ---- TAKE-HOME PAY VS GROSS PAY ---- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Difference Between Take-Home Pay and Gross Pay?</h2>
            <p className="text-warmgray mb-4">Gross pay is the total salary stated in your employment contract before any deductions. Take-home pay (net pay) is the amount deposited into your bank account after the ATO&apos;s PAYG withholding removes income tax, Medicare levy, and HECS repayments.</p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Attribute</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Gross Pay</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Take-Home Pay (Net)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 text-warmgray">Definition</td>
                    <td className="px-4 py-3 text-navy">Total salary before deductions</td>
                    <td className="px-4 py-3 text-navy">Amount deposited to your bank</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-warmgray">Example on $100,000</td>
                    <td className="px-4 py-3 font-medium text-navy">$100,000</td>
                    <td className="px-4 py-3 font-medium text-eucalyptus-dark">$77,212</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-warmgray">Includes income tax?</td>
                    <td className="px-4 py-3 text-navy">Yes (not yet deducted)</td>
                    <td className="px-4 py-3 text-navy">No (already removed)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-warmgray">Includes Medicare levy?</td>
                    <td className="px-4 py-3 text-navy">Yes (not yet deducted)</td>
                    <td className="px-4 py-3 text-navy">No (already removed)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-warmgray">Includes super?</td>
                    <td className="px-4 py-3 text-navy">No (employer pays separately)</td>
                    <td className="px-4 py-3 text-navy">No (employer pays separately)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-warmgray">Used for</td>
                    <td className="px-4 py-3 text-navy">Employment contracts, ATO returns</td>
                    <td className="px-4 py-3 text-navy">Budgeting, mortgage applications</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">To convert a gross salary to its take-home equivalent, use the calculator above. To work in the opposite direction &mdash; entering a desired net figure and finding the gross salary required &mdash; use our <Link href="/gross-pay-calculator/" className="text-eucalyptus-dark hover:underline">Gross Pay Calculator</Link>.</p>
          </section>

          {/* ---- WHAT CHANGED IN FY2025-26? ---- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed for Take-Home Pay in FY2025-26?</h2>
            <p className="text-warmgray mb-4">Three legislative changes affect take-home pay calculations in the 2025-26 financial year: a higher super guarantee rate, a reformed HECS repayment system, and the continued application of Stage 3 tax cuts.</p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Change</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">FY2024-25</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">FY2025-26</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Impact on Take-Home</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">Super Guarantee Rate</td>
                    <td className="px-4 py-3 text-warmgray">11.5%</td>
                    <td className="px-4 py-3 text-warmgray">12%</td>
                    <td className="px-4 py-3 text-warmgray">No direct impact (employer-paid), but increases total package by <strong>$400</strong> on $80,000</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">HECS-HELP System</td>
                    <td className="px-4 py-3 text-warmgray">Tiered % of total income (threshold $54,435)</td>
                    <td className="px-4 py-3 text-warmgray">Marginal system (threshold $67,000, 15% marginal rate)</td>
                    <td className="px-4 py-3 text-warmgray">Graduates near old thresholds keep <strong>$1,000&ndash;$3,000</strong> more</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">Income Tax Brackets (Stage 3)</td>
                    <td className="px-4 py-3 text-warmgray">16% bracket to $45K; 30% to $135K</td>
                    <td className="px-4 py-3 text-warmgray">Same (applied from 1 July 2024)</td>
                    <td className="px-4 py-3 text-warmgray">Ongoing savings of <strong>$804&ndash;$4,529</strong> vs pre-Stage 3 rates</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">The HECS reform is the most significant change for graduates. Under the old system, crossing the $54,435 threshold triggered a repayment on total income. The new marginal system taxes only the portion above $67,000 at 15%, eliminating sudden &quot;cliff&quot; repayment jumps. Use our <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> to compare your repayment under both systems.</p>
          </section>

          {/* ---- COMMON TAKE-HOME PAY MISTAKES ---- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Most Common Take-Home Pay Mistakes?</h2>
            <p className="text-warmgray mb-4">Five errors cause Australian employees to miscalculate their net pay after tax, leading to budget shortfalls or incorrect salary expectations.</p>
            <ol className="list-decimal pl-6 space-y-3 text-warmgray mb-4">
              <li><strong>Confusing marginal rate with effective rate.</strong> An employee on $80,000 pays a 30% marginal rate on the top portion of income, but the effective rate across their entire salary is only <strong>20.5%</strong>. Assuming 30% of the full $80,000 goes to tax overestimates the deduction by <strong>$7,612</strong>.</li>
              <li><strong>Treating super as a take-home deduction.</strong> The 12% superannuation guarantee is paid by the employer on top of your gross salary. It does not reduce your take-home pay unless your contract specifies a &quot;total package inclusive of super&quot; arrangement.</li>
              <li><strong>Ignoring the LITO offset.</strong> Incomes below $66,667 receive a &quot;Low Income Tax Offset&quot; of up to $700 that directly reduces tax payable. Omitting LITO from manual calculations overstates tax at $60,000 by <strong>$325</strong>.</li>
              <li><strong>Using old HECS-HELP thresholds.</strong> The repayment threshold increased from $54,435 to $67,000 in FY2025-26, and the system shifted from tiered percentages to marginal rates. Using old thresholds overstates repayments for graduates earning between $54,435 and $67,000.</li>
              <li><strong>Forgetting the Medicare Levy Surcharge.</strong> Singles earning above $93,001 without private health insurance pay an additional 1%&ndash;1.5% surcharge. On $150,000 without cover, the &quot;Medicare Levy Surcharge&quot; adds <strong>$2,250</strong> in deductions beyond the standard 2% levy.</li>
            </ol>
          </section>

          {/* ---- HOW TO INCREASE YOUR TAKE-HOME PAY ---- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Can You Increase Your Take-Home Pay?</h2>
            <p className="text-warmgray mb-4">Two strategies legally reduce your taxable income and increase your after-tax pay: salary sacrifice and work-related deductions.</p>

            <h3 className="text-lg font-semibold text-navy mb-2">Salary Sacrifice Into Super</h3>
            <p className="text-warmgray mb-3">Redirecting part of your pre-tax salary into superannuation reduces your assessable income. On $100,000, sacrificing $10,000 into super saves approximately <strong>$1,500</strong> in income tax because that $10,000 is taxed at 15% inside super instead of your 30% marginal rate. The concessional contribution cap for FY2025-26 is <strong>$30,000</strong> (including employer SG).</p>
            <p className="text-sm text-warmgray-light mb-4"><Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Compare your pay before and after salary sacrifice</Link></p>

            <h3 className="text-lg font-semibold text-navy mb-2">Claim Work-Related Tax Deductions</h3>
            <p className="text-warmgray mb-3">Tax deductions reduce your taxable income at your <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">marginal tax rate</Link>. Common deductions include work-from-home expenses ($0.67 per hour fixed rate), uniforms and protective clothing, tools and equipment, and professional development courses. A $2,000 deduction at the 30% marginal rate reduces your tax by <strong>$600</strong>.</p>

            <h3 className="text-lg font-semibold text-navy mb-2">Obtain Private Health Insurance</h3>
            <p className="text-warmgray mb-4">Singles earning above $93,001 avoid the &quot;Medicare Levy Surcharge&quot; (1%&ndash;1.5%) by holding private hospital cover. On a $150,000 salary, the surcharge costs <strong>$2,250 per year</strong> &mdash; often more than a basic hospital policy. Obtaining cover increases your disposable salary by eliminating this surcharge.</p>

            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Strategy</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Tax Saved (on $100K)</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Increases Bank Deposit?</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Complexity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">Salary sacrifice $10K into super</td>
                    <td className="px-4 py-3 text-right font-medium text-navy">$1,500</td>
                    <td className="px-4 py-3 text-warmgray">No (funds go to super)</td>
                    <td className="px-4 py-3 text-warmgray">Low &mdash; employer sets up</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">$2,000 in work-related deductions</td>
                    <td className="px-4 py-3 text-right font-medium text-navy">$600</td>
                    <td className="px-4 py-3 text-warmgray">Yes (tax refund at lodgment)</td>
                    <td className="px-4 py-3 text-warmgray">Medium &mdash; receipts required</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">Private health insurance (avoiding MLS)</td>
                    <td className="px-4 py-3 text-right font-medium text-navy">$1,000</td>
                    <td className="px-4 py-3 text-warmgray">Net effect depends on premium cost</td>
                    <td className="px-4 py-3 text-warmgray">Low &mdash; buy a policy</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ---- RELATED CALCULATORS ---- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Which Other Calculators Help With Pay Planning?</h2>
            <p className="text-warmgray mb-4">This take-home pay calculator covers net income after tax. Five related tools on Pay Calculator Australia address adjacent payroll questions:</p>
            <ul className="space-y-2 text-warmgray">
              <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income Tax Calculator</Link> &mdash; See a bracket-by-bracket breakdown of your income tax, including marginal and effective rates.</li>
              <li><Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Salary Sacrifice Calculator</Link> &mdash; Compare take-home pay with and without pre-tax super contributions.</li>
              <li><Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline font-medium">HECS-HELP Calculator</Link> &mdash; Calculate your compulsory student loan repayment under the FY2025-26 marginal system.</li>
              <li><Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Superannuation Calculator</Link> &mdash; Model your employer SG contributions, salary sacrifice top-ups, and projected super balance.</li>
              <li><Link href="/gross-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Gross Pay Calculator</Link> &mdash; Reverse-calculate the gross salary required to achieve a target take-home amount.</li>
            </ul>
          </section>

          {/* ---- CONTEXT BORDER ---- */}

          <MethodologyDisclosure>
            <ol className="list-decimal space-y-1 pl-4">
              <li>Calculate income tax using ATO progressive brackets.</li>
              <li>Apply LITO offset for qualifying incomes.</li>
              <li>Add 2% Medicare levy.</li>
              <li>Add Medicare surcharge if applicable.</li>
              <li>Calculate HECS marginal repayment if opted in.</li>
              <li>Take-home = Gross &minus; all deductions.</li>
              <li>Super (12%) is calculated separately &mdash; employer-paid.</li>
            </ol>
          </MethodologyDisclosure>

          {/* ---- FAQS ---- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <FAQItem value="how" question="How is take-home pay calculated in Australia?">
                Take-home pay equals your gross salary minus income tax, the 2% Medicare levy, and any HECS-HELP repayments. Your employer withholds these amounts each pay cycle through the PAYG system and remits them to the ATO. Superannuation is paid separately by your employer and does not reduce your take-home.
              </FAQItem>
              <FAQItem value="percentage" question="What percentage of my salary do I actually take home?">
                The percentage varies by income level. At $40,000, you retain <strong>90.7%</strong> ($36,287). At $80,000, you retain <strong>79.5%</strong> ($63,612). At $150,000, you retain <strong>73.4%</strong> ($110,162). The percentage decreases as income rises because Australia&apos;s progressive tax brackets apply higher marginal rates to each additional dollar earned.
              </FAQItem>
              <FAQItem value="super" question="Is superannuation deducted from my take-home pay?">
                No. Your employer pays the 12% superannuation guarantee on top of your gross salary. It does not reduce the amount deposited into your bank account. If you voluntarily <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">salary sacrifice</Link> additional amounts into super, those pre-tax contributions reduce your taxable income and take-home pay.
              </FAQItem>
              <FAQItem value="100k-take-home" question="How much take-home pay do I get on $100,000?">
                On a $100,000 salary in FY{SITE_CONFIG.financialYear}, you take home <strong>{formatAUD(calculatePayBreakdown({ grossSalary: 100000 }).takeHomePay)}</strong> per year (<strong>{formatAUD(calculatePayBreakdown({ grossSalary: 100000 }).weekly, 2)}</strong> per week). Total deductions are {formatAUD(calculatePayBreakdown({ grossSalary: 100000 }).totalDeductions)}, comprising $20,788 in income tax and $2,000 in Medicare levy. Use our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> for a bracket-by-bracket view.
              </FAQItem>
              <FAQItem value="first-pay" question="Why is my first pay smaller than expected?">
                If you have not submitted a Tax File Number (TFN) declaration to your employer, PAYG withholding applies at the highest marginal rate of 45% plus the 2% Medicare levy. Submit your TFN declaration immediately to ensure the correct tax rate applies from your next pay cycle.
              </FAQItem>
              <FAQItem value="hecs-impact" question="How much does HECS-HELP reduce my take-home pay?">
                HECS-HELP repayments begin at $67,000 under the FY2025-26 marginal system. On $80,000, the compulsory repayment is <strong>$1,950</strong> per year ($37.50 per week), reducing take-home from $63,612 to <strong>$61,662</strong>. The marginal rate of 15% applies only to income above $67,000, not your entire salary.
              </FAQItem>
              <FAQItem value="salary-sacrifice-tax" question="Does salary sacrifice increase take-home pay?">
                Salary sacrifice reduces your taxable income and total income tax, but the sacrificed amount goes into super rather than your bank account. The net effect is a lower take-home pay combined with higher retirement savings. On $100,000, sacrificing $10,000 saves approximately <strong>$1,500</strong> in tax. The trade-off is that super funds are locked until preservation age (60 for most Australians).
              </FAQItem>
              <FAQItem value="medicare-surcharge" question="Do I pay the Medicare Levy Surcharge?">
                The &quot;Medicare Levy Surcharge&quot; (MLS) applies to singles earning above $93,001 who do not hold private hospital insurance. The surcharge is <strong>1%</strong> for incomes between $93,001 and $108,000, <strong>1.25%</strong> for $108,001 to $144,000, and <strong>1.5%</strong> for incomes above $144,000. Holding private hospital cover eliminates the MLS entirely.
              </FAQItem>
            </Accordion>
          </section>

          <section className="bg-eucalyptus-light/40 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>See how income tax is calculated</h2>
            <p className="text-warmgray mb-6 max-w-lg mx-auto">Get a bracket-by-bracket breakdown of your income tax.</p>
            <Link href="/income-tax-calculator/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all">Income Tax Calculator →</Link>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, sub }: { label: string; value: string; bold?: boolean; sub?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${sub ? "pl-4 text-xs text-warmgray-light" : ""}`}>
      <span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span>
      <span className={bold ? "font-bold text-navy" : "font-medium text-navy"}>{value}</span>
    </div>
  );
}

function FAQItem({ value, question, children }: { value: string; question: string; children: React.ReactNode }) {
  return (
    <AccordionItem value={value} className="rounded-xl border border-sandstone-dark/20 px-5">
      <AccordionTrigger className="text-left text-base font-medium text-navy">{question}</AccordionTrigger>
      <AccordionContent><p className="text-warmgray leading-relaxed">{children}</p></AccordionContent>
    </AccordionItem>
  );
}
