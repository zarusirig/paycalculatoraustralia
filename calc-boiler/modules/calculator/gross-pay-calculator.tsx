"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculatePayBreakdown,
  formatAUD,
  SUPER_GUARANTEE,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function findGrossForNet(annualTargetNet: number): number {
  if (annualTargetNet <= 0) return 0;

  let min = annualTargetNet;
  let max = annualTargetNet * 3; // Safe upper bound
  let mid = min;

  // Binary search to find the gross salary that results in the target net
  for (let i = 0; i < 50; i++) {
    mid = (min + max) / 2;
    const breakdown = calculatePayBreakdown({ grossSalary: mid });
    if (breakdown.takeHomePay < annualTargetNet) {
      min = mid;
    } else {
      max = mid;
    }
  }

  return mid;
}

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
];

const PERIOD_MULTIPLIERS = {
  weekly: 52,
  fortnightly: 26,
  monthly: 12,
  annually: 1,
};

type Period = keyof typeof PERIOD_MULTIPLIERS;

export default function GrossPayCalculatorPage() {
  const [targetNet, setTargetNet] = useState(1500);
  const [period, setPeriod] = useState<Period>("weekly");

  const annualTargetNet = targetNet * PERIOD_MULTIPLIERS[period];

  const requiredGross = useMemo(() => findGrossForNet(annualTargetNet), [annualTargetNet]);
  const finalBreakdown = useMemo(() => calculatePayBreakdown({ grossSalary: requiredGross }), [requiredGross]);

  const expectedSuper = requiredGross * SUPER_GUARANTEE.rate;

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-eucalyptus-light/40 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Gross Pay Calculator</span></li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Gross Pay Calculator — Reverse Calculate from Net
          </h1>
          <p className="text-lg text-warmgray">
            Need a specific amount hitting your bank account? Enter your target take-home pay to find exactly
            what annual gross salary you need to negotiate for FY{SITE_CONFIG.financialYear}.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">

                {/* Inputs */}
                <div className="bg-white p-6 rounded-2xl border border-sandstone-dark/10 shadow-sm md:w-80">
                  <h2 className="text-lg font-semibold text-navy mb-5" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Set Your Target</h2>
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                    <div>
                      <label htmlFor="targetNet" className="block text-sm font-medium text-gray-700 mb-1">I want to take home:</label>
                      <div className="flex items-center">
                        <span className="text-warmgray-light mr-2 font-medium">$</span>
                        <input type="number" id="targetNet" min={0} max={1000000} step={100} value={targetNet}
                          onChange={(e) => setTargetNet(clamp(Number(e.target.value || 0), 0, 1000000))}
                          className="block w-full text-lg font-bold text-navy rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">How often?</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(["weekly", "fortnightly", "monthly", "annually"] as Period[]).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPeriod(p)}
                            className={`py-2 px-3 border rounded-md text-sm font-medium transition-colors ${
                              period === p
                                ? "bg-eucalyptus-light/30 border-eucalyptus text-navy"
                                : "bg-white border-sandstone-dark/20 text-warmgray hover:bg-sandstone/50"
                            }`}
                          >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </form>
                </div>

                {/* Results */}
                <div className="space-y-6">
                  <div className="bg-eucalyptus-dark rounded-2xl p-6 text-center text-white shadow-lg relative overflow-hidden">
                    {/* Decorative background shape */}
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                    <div className="text-sm font-medium text-eucalyptus-light uppercase tracking-wider mb-2 relative z-10">Required Annual Gross Salary</div>
                    <div className="text-5xl font-extrabold mb-1 relative z-10">
                      {formatAUD(requiredGross)}
                    </div>
                    <div className="text-sm text-eucalyptus-light mt-2 relative z-10">
                      To take home exactly <strong>{formatAUD(targetNet)} {period}</strong>
                    </div>
                  </div>

                  {/* Breakdown Box */}
                  <div className="bg-sandstone rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone-dark/10 px-5 py-3 border-b border-sandstone-dark/20">
                      <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">How the math works out</h3>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 gap-y-3 text-sm">
                        <div className="font-semibold text-warmgray-light pb-2 border-b border-sandstone-dark/20">Component</div>
                        <div className="font-semibold text-warmgray-light text-right pb-2 border-b border-sandstone-dark/20 hidden sm:block">Annual</div>
                        <div className="font-semibold text-warmgray-light text-right pb-2 border-b border-sandstone-dark/20">{period.charAt(0).toUpperCase() + period.slice(1)}</div>

                        <div className="text-gray-700 font-medium">Gross Income</div>
                        <div className="text-right text-gray-700 font-medium hidden sm:block">{formatAUD(requiredGross)}</div>
                        <div className="text-right text-navy font-bold">{formatAUD(requiredGross / PERIOD_MULTIPLIERS[period])}</div>

                        <div className="text-warmgray">Income Tax</div>
                        <div className="text-right text-ochre hidden sm:block">-{formatAUD(finalBreakdown.netIncomeTax)}</div>
                        <div className="text-right text-ochre">-{formatAUD(finalBreakdown.netIncomeTax / PERIOD_MULTIPLIERS[period])}</div>

                        <div className="text-warmgray">Medicare Levy</div>
                        <div className="text-right text-ochre hidden sm:block">-{formatAUD(finalBreakdown.medicareLevy)}</div>
                        <div className="text-right text-ochre">-{formatAUD(finalBreakdown.medicareLevy / PERIOD_MULTIPLIERS[period])}</div>

                        <div className="border-t border-sandstone-dark/20 pt-2 font-bold text-navy">Net Take-Home</div>
                        <div className="border-t border-sandstone-dark/20 pt-2 text-right font-bold text-eucalyptus-dark hidden sm:block">{formatAUD(finalBreakdown.takeHomePay)}</div>
                        <div className="border-t border-sandstone-dark/20 pt-2 text-right font-extrabold text-eucalyptus-dark bg-eucalyptus-light/30 px-2 rounded">{formatAUD(targetNet)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-eucalyptus-light/30 border border-eucalyptus-light p-4 rounded-xl flex items-start text-sm">
                    <div className="mr-3 mt-0.5 text-eucalyptus">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </div>
                    <div className="text-navy">
                      <strong>Don&apos;t forget Super:</strong> On top of this base salary, your employer must also pay {SUPER_GUARANTEE.rate * 100}% into your super fund (an extra <strong>{formatAUD(expectedSuper)}</strong> annually), bringing your Total Package to <strong>{formatAUD(requiredGross + expectedSuper)}</strong>.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">

          {/* --- HOW IS GROSS PAY CALCULATED? --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Gross Pay Calculated in Australia?</h2>
            <p className="mb-4 text-warmgray">
              Gross pay is calculated by adding every pre-tax income component your employer pays you before income tax, Medicare levy, and other deductions are withheld. The Australian gross pay calculation for FY2025-26 starts with your base salary and adds allowances, overtime, bonuses, and commissions.
            </p>
            <p className="mb-4 text-warmgray">
              To reverse-calculate gross pay from a target net amount, follow these steps:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>Annualise your target net pay</strong> — multiply weekly by 52, fortnightly by 26, or monthly by 12. A target of $1,500 per week equals <strong>$78,000</strong> annually.</li>
              <li><strong>Identify the income tax brackets</strong> — the FY2025-26 rates are 0% up to $18,200, 16% from $18,201 to $45,000, 30% from $45,001 to $135,000, 37% from $135,001 to $190,000, and 45% above $190,000.</li>
              <li><strong>Add the Medicare levy</strong> — a flat <strong>2%</strong> of taxable income applies to most Australian residents.</li>
              <li><strong>Apply the Low Income Tax Offset</strong> — LITO reduces tax by up to <strong>$700</strong> for incomes below $66,667, effectively raising the tax-free threshold to <strong>$22,575</strong>.</li>
              <li><strong>Iterate to solve</strong> — because Australia uses progressive marginal rates, no single formula converts net to gross. This calculator uses binary search across the ATO tax tables to find the exact gross salary that produces your target net pay.</li>
            </ol>
            <p className="text-warmgray">
              Use our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to see the full bracket breakdown for any gross salary amount.
            </p>
          </section>

          {/* --- GROSS PAY VS NET PAY --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Gross Pay vs Net Pay — What Is the Difference?</h2>
            <p className="mb-4 text-warmgray">
              Gross pay is the total salary before deductions; net pay is the amount deposited into your bank account after income tax and the Medicare levy are withheld. On an <strong>$85,000</strong> gross salary in FY2025-26, net pay is approximately <strong>$67,368</strong> — a difference of <strong>$17,632</strong>.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-sandstone-dark/20 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-sandstone">
                    <th className="text-left px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">Attribute</th>
                    <th className="text-left px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">Gross Pay</th>
                    <th className="text-left px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">Net Pay</th>
                  </tr>
                </thead>
                <tbody className="text-warmgray">
                  <tr className="border-b border-sandstone-dark/10">
                    <td className="px-4 py-3 font-medium">Definition</td>
                    <td className="px-4 py-3">Total earnings before any deductions</td>
                    <td className="px-4 py-3">Take-home pay after all deductions</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                    <td className="px-4 py-3 font-medium">Includes income tax?</td>
                    <td className="px-4 py-3">Yes — tax is embedded</td>
                    <td className="px-4 py-3">No — tax already subtracted</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10">
                    <td className="px-4 py-3 font-medium">Includes Medicare levy?</td>
                    <td className="px-4 py-3">Yes — levy is embedded</td>
                    <td className="px-4 py-3">No — levy already subtracted</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                    <td className="px-4 py-3 font-medium">Includes superannuation?</td>
                    <td className="px-4 py-3">No — SG is paid on top</td>
                    <td className="px-4 py-3">No — SG goes to super fund</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10">
                    <td className="px-4 py-3 font-medium">Used for</td>
                    <td className="px-4 py-3">Employment contracts, job ads, ATO returns</td>
                    <td className="px-4 py-3">Budgeting, rent, mortgage applications</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Example at $85,000 gross</td>
                    <td className="px-4 py-3"><strong>$85,000</strong></td>
                    <td className="px-4 py-3"><strong>$67,368</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">
              To calculate your net pay from a known gross salary, use the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link>. The gross pay calculator on this page performs the reverse operation — converting net pay back to gross.
            </p>
          </section>

          {/* --- WHO USES THIS CALCULATOR? --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Uses This Gross Pay Calculator?</h2>
            <p className="mb-4 text-warmgray">
              The gross pay calculator serves anyone who knows what they need in their bank account and must work backwards to a pre-tax salary figure. Three primary user groups rely on this Australian tax calculator daily:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-warmgray mb-4">
              <li><strong>Salary negotiators</strong> — employees entering a new role or requesting a pay rise who need to translate living expenses into a gross salary figure. A worker who spends $1,200 per week on rent, bills, and essentials needs a gross salary of at least <strong>$80,216</strong> to cover those costs after tax.</li>
              <li><strong>Job seekers comparing offers</strong> — candidates who receive offers quoted as a "Total Remuneration Package" (gross plus super) and need to convert that figure to weekly take-home pay. A $100,000 TRP translates to a base salary of <strong>$89,286</strong> and net weekly pay of approximately <strong>$1,345</strong>.</li>
              <li><strong>Budgeters and mortgage applicants</strong> — individuals who know their monthly expenses and need to determine the minimum gross income required. Lenders assess borrowing capacity on gross salary, so converting net targets to gross figures is essential for pre-approval applications.</li>
            </ul>
            <p className="text-warmgray">
              Contractors and freelancers who set their own rates also benefit from reverse-calculating gross pay. Use the <Link href="/contractor-pay-calculator/" className="text-eucalyptus-dark hover:underline">Contractor Pay Calculator</Link> for scenarios involving GST, BAS, and business expenses.
            </p>
          </section>

          {/* --- GROSS PAY TABLE BY SALARY LEVEL --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Gross Salary Do You Need for Common Net Pay Targets?</h2>
            <p className="mb-4 text-warmgray">
              The table below shows the gross annual salary required to achieve common net take-home pay targets in FY2025-26. All figures assume an Australian resident with no HECS-HELP debt, no salary sacrifice, and no private health insurance surcharge.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-sandstone-dark/20 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-sandstone">
                    <th className="text-left px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">Target Net (Annual)</th>
                    <th className="text-left px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">Required Gross Salary</th>
                    <th className="text-left px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">Total Tax + Medicare</th>
                    <th className="text-left px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">Effective Tax Rate</th>
                  </tr>
                </thead>
                <tbody className="text-warmgray">
                  {[40000, 50000, 60000, 70000, 80000, 90000, 100000, 120000].map((netTarget, idx) => {
                    const gross = findGrossForNet(netTarget);
                    const bd = calculatePayBreakdown({ grossSalary: gross });
                    const totalTax = bd.netIncomeTax + bd.medicareLevy;
                    const effectiveRate = gross > 0 ? ((totalTax / gross) * 100).toFixed(1) : "0.0";
                    return (
                      <tr key={netTarget} className={idx % 2 === 1 ? "bg-sandstone/30" : ""}>
                        <td className="px-4 py-3 font-medium">{formatAUD(netTarget)}</td>
                        <td className="px-4 py-3"><strong>{formatAUD(Math.round(gross))}</strong></td>
                        <td className="px-4 py-3">{formatAUD(totalTax)}</td>
                        <td className="px-4 py-3">{effectiveRate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-warmgray-light">
              *Figures are calculated using FY2025-26 income tax brackets and the 2% Medicare levy. HECS-HELP repayments, salary sacrifice, and the Medicare Levy Surcharge are excluded.
            </p>
          </section>

          {/* --- WHAT COMPONENTS MAKE UP GROSS PAY? --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Components Make Up Gross Pay?</h2>
            <p className="mb-4 text-warmgray">
              Gross pay includes every form of assessable income your employer pays before tax is withheld. The ATO treats all of the following components as part of your gross earnings for PAYG withholding purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>Base salary</strong> — the fixed annual amount stated in your employment contract, paid weekly, fortnightly, or monthly</li>
              <li><strong>Overtime earnings</strong> — hours worked beyond the standard 38-hour week, paid at penalty rates of <strong>1.5x</strong> (time and a half) or <strong>2.0x</strong> (double time)</li>
              <li><strong>Bonuses and commissions</strong> — performance-based payments, sign-on bonuses, and sales commissions added to your taxable income in the period received</li>
              <li><strong>Allowances</strong> — travel allowances, tool allowances, uniform allowances, and meal allowances that are not otherwise exempt from tax</li>
              <li><strong>Leave loading</strong> — an extra <strong>17.5%</strong> paid on annual leave entitlements under many awards and enterprise agreements</li>
              <li><strong>Back pay and arrears</strong> — retrospective pay increases applied to prior periods, taxed in the period of payment</li>
            </ul>
            <p className="text-warmgray mb-4">
              Superannuation guarantee contributions are <strong>not</strong> included in gross pay. The employer SG rate of <strong>12%</strong> for FY2025-26 is paid on top of your gross salary into your nominated super fund. Use the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to calculate the exact employer contribution for any salary level.
            </p>
            <p className="text-warmgray">
              Salary sacrifice arrangements reduce your gross taxable income. Pre-tax contributions to super or novated lease payments lower the amount subject to income tax brackets, which changes the gross-to-net calculation. Model the impact using the <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link>.
            </p>
          </section>

          {/* --- COMMON GROSS PAY MISTAKES --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Most Common Gross Pay Mistakes?</h2>
            <p className="mb-4 text-warmgray">
              The most common gross pay mistake is confusing a "Total Remuneration Package" with base salary, which overstates take-home pay by up to <strong>$10,714</strong> on a $100,000 package. Avoid these 5 errors:
            </p>
            <ol className="list-decimal pl-6 space-y-3 text-warmgray mb-4">
              <li><strong>Treating TRP as base salary</strong> — a $100,000 TRP includes 12% super, so the actual base salary is only <strong>$89,286</strong>. Assuming the full $100,000 is your gross pay inflates your expected take-home by <strong>$157 per week</strong>.</li>
              <li><strong>Using a flat tax rate</strong> — dividing net by 0.7 to estimate gross assumes a flat 30% tax rate. Australia&apos;s progressive system means a $60,000 net actually requires a gross of approximately <strong>$73,547</strong>, not the $85,714 that a flat-rate formula produces.</li>
              <li><strong>Forgetting the Medicare levy</strong> — the <strong>2%</strong> Medicare levy applies on top of income tax. On a $90,000 gross salary, the levy adds <strong>$1,800</strong> to total deductions, reducing weekly take-home by <strong>$34.62</strong>.</li>
              <li><strong>Ignoring HECS-HELP repayments</strong> — under the new marginal repayment system for FY2025-26, a $90,000 income triggers a HECS repayment of <strong>$3,450</strong>. Workers with study debt need a higher gross salary to achieve the same net pay.</li>
              <li><strong>Comparing pre-tax and post-tax figures</strong> — comparing a $95,000 gross offer against your current $1,400 weekly net pay without converting both to the same basis leads to incorrect conclusions about whether the new role pays more.</li>
            </ol>
          </section>

          {/* --- EXAMPLE GROSS SALARY CALCULATIONS (EXISTING) --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Example Gross Salary Calculations</h2>
            <p className="mb-4 text-warmgray">
              Here are some common net take-home targets and the gross annual salary required to hit them under the FY25-26 tax brackets:
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { net: 1000, per: "week" },
                { net: 1500, per: "week" },
                { net: 5000, per: "month" },
                { net: 8000, per: "month" },
              ].map((target) => {
                const mult = target.per === "week" ? 52 : 12;
                const gross = findGrossForNet(target.net * mult);
                return (
                  <div key={`${target.net}-${target.per}`} className="bg-white border text-center border-sandstone-dark/20 rounded-xl p-5 shadow-sm">
                    <div className="text-warmgray-light text-sm mb-1 uppercase tracking-widest">Target net</div>
                    <div className="font-bold text-navy text-xl border-b border-sandstone-dark/10 pb-3 mb-3">
                      {formatAUD(target.net)} <span className="text-sm font-normal text-warmgray-light">/{target.per.charAt(0)}</span>
                    </div>
                    <div className="text-warmgray-light text-sm mb-1 uppercase tracking-widest">Needs Gross</div>
                    <div className="font-bold text-eucalyptus-dark text-2xl">
                      {formatAUD(gross)}
                    </div>
                    <div className="text-xs text-warmgray-light mt-1">annually</div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-warmgray-light">
              *Calculations are exact for standard income tax and Medicare levy. Note that if you have a HECS-HELP debt, you will need a higher gross salary to hit the same net target because loan repayments will also be deducted.
            </p>
          </section>

          {/* --- RELATED CALCULATORS --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Which Related Calculators Should You Use?</h2>
            <p className="mb-4 text-warmgray">
              The gross pay calculator answers one specific question: what gross salary produces a given net pay. These related Australian tax calculators address adjacent scenarios:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-warmgray">
              <li><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> — enter a gross salary and see the net pay after income tax, Medicare levy, and HECS-HELP deductions</li>
              <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> — view a full breakdown of income tax brackets, LITO, and marginal rates for FY2025-26</li>
              <li><Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> — calculate your employer&apos;s 12% SG contribution and project your super balance at retirement</li>
              <li><Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> — model the tax savings from pre-tax super contributions or novated lease arrangements</li>
              <li><Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> — calculate compulsory HECS-HELP repayments under the new marginal system introduced in FY2025-26</li>
              <li><Link href="/pay-rise-calculator/" className="text-eucalyptus-dark hover:underline">Pay Rise Calculator</Link> — compare your current and proposed salary to see the actual net pay increase after tax</li>
            </ul>
          </section>

          <MethodologyDisclosure>
            <p className="mb-2 text-sm">How this reverse calculation works:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Takes your target net amount and annualises it (e.g. weekly x 52).</li>
              <li>Uses a rapid iterative algorithm (binary search) against the standard ATO tax tables to find the exact gross salary that yields that exact net pay after income tax and Medicare levy.</li>
              <li>Does not include HECS debt deductions.</li>
            </ol>
          </MethodologyDisclosure>

          {/* --- FAQs --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <AccordionItem value="diff" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>What is the difference between gross and net pay?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Gross pay is the total amount you earn before any taxes or deductions are taken out. This is the big number on your employment contract. Net pay (or take-home pay) is the amount that actually lands in your bank account after income tax, Medicare levy, and other deductions are withheld by your employer.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="calc" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How do you calculate gross from net in Australia?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Because Australia has a progressive tax system with different marginal rates (increasing as you earn more), you cannot just multiply your net pay by a single fixed percentage. You have to &quot;reverse engineer&quot; the calculation by figuring out which tax brackets your required gross income falls into and adding the appropriate tax back on top of your net amount. Our calculator automates this complex math.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="super" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Does gross pay include superannuation?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Generally, no. When negotiating a salary in Australia, &quot;Gross Pay&quot; or &quot;Base Salary&quot; usually excludes the compulsory employer superannuation guarantee (currently 12% for FY2025-26). If a package includes super, it is normally called a &quot;Total Remuneration Package&quot; (TRP) or salary &quot;inclusive of super&quot;.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="hecs" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How does a HECS debt affect my gross pay target?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">If you have a HECS-HELP loan, your employer withholds additional money on top of income tax to cover your compulsory repayment. This means you need a higher gross salary to achieve the same take-home pay. For example, at $90,000, a 4.5% HECS repayment reduces your weekly take-home by approximately $78. Use our <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP calculator</Link> to model the exact impact.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="trp" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>What is a Total Remuneration Package (TRP)?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">A TRP includes your base salary <strong>plus</strong> the employer&apos;s 12% superannuation guarantee contribution. So a $100,000 base salary equates to a $112,000 TRP. Some job ads quote TRP instead of base salary, which can be misleading — always clarify which figure is being used during salary negotiations.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="tax-free" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>What is the tax-free threshold in Australia for FY2025-26?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">The statutory tax-free threshold is <strong>$18,200</strong> per year. Australian residents who earn below this amount pay zero income tax. The Low Income Tax Offset (LITO) effectively raises this to <strong>$22,575</strong> for eligible taxpayers, as the $700 offset fully eliminates the 16% tax on income between $18,201 and $22,575. Non-residents do not receive the tax-free threshold and pay 30% from the first dollar earned.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="weekly" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>What gross salary do I need to take home $1,000 per week?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">To take home <strong>$1,000 per week</strong> after tax in FY2025-26, you need a gross annual salary of approximately <strong>$64,697</strong>. This assumes you are an Australian resident, have no HECS-HELP debt, and claim the tax-free threshold. Your employer pays income tax and the 2% Medicare levy from this gross amount, leaving $52,000 net annually.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="changes" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Did the FY2025-26 tax changes affect gross pay calculations?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. The Stage 3 tax cuts (effective 1 July 2024) lowered the second bracket rate from 19% to <strong>16%</strong> and expanded the 30% bracket ceiling from $120,000 to <strong>$135,000</strong>. These changes mean you now need a slightly lower gross salary to achieve the same net take-home pay compared to FY2023-24. The SG rate also increased to <strong>12%</strong>, raising total remuneration packages without affecting your take-home calculation directly.</p></AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
        </div>
      </div>
    </div>
  );
}
