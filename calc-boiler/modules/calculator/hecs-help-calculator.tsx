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
  calculateHECS,
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
  annualToWeekly,
  HECS_HELP,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const SOURCES_LIST: SourceLink[] = [
  { title: "HECS-HELP repayment thresholds and rates", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: SOURCES.ato.name },
  { title: "Indexation of HELP debts", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-indexation-rates", publisher: SOURCES.ato.name },
  { title: "Voluntary repayments", url: "https://www.ato.gov.au/individuals-and-families/study-and-training-support-loans/voluntary-repayments", publisher: SOURCES.ato.name },
];

export default function HECSHelpCalculatorPage() {
  const [salary, setSalary] = useState(80_000);

  const result = useMemo(() => {
    const hecsRepayment = calculateHECS(salary);
    const breakdown = calculatePayBreakdown({ grossSalary: salary, includeHECS: true });
    const breakdownNoHECS = calculatePayBreakdown({ grossSalary: salary, includeHECS: false });
    return {
      hecsRepayment,
      weeklyHECS: annualToWeekly(hecsRepayment),
      takeHomeWithHECS: breakdown.takeHomePay,
      takeHomeWithoutHECS: breakdownNoHECS.takeHomePay,
      weeklyTakeHome: breakdown.weekly,
    };
  }, [salary]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-gray-400" /></li>
              <li><span className="font-medium text-navy" aria-current="page">HECS-HELP Calculator</span></li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            HECS-HELP Repayment Calculator 2025-26
          </h1>
          <p className="text-lg text-warmgray">
            Calculate your HECS-HELP repayment under the new marginal rate system. The threshold has risen to {formatAUD(HECS_HELP.minimumThreshold)},
            and repayments are now calculated only on income above the threshold — not your entire salary.
          </p>
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
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="salary" min={0} max={500000} step={1000} value={salary}
                        onChange={(e) => setSalary(clamp(Number(e.target.value || 0), 0, 500000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <input type="range" min={0} max={300000} step={5000} value={clamp(salary, 0, 300000)}
                      onChange={(e) => setSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" />
                  </div>
                  <button type="submit" className="w-full bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 rounded-lg shadow-md transition-all">Calculate HECS Repayment</button>
                </form>

                <Card className="bg-sandstone border-0 shadow-none" role="region" aria-live="polite">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Your HECS Repayment</h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-warmgray">Gross Salary</span><span className="font-bold text-navy">{formatAUD(salary)}</span></div>
                      <div className="border-t border-sandstone-dark/20" />
                      {salary <= HECS_HELP.minimumThreshold ? (
                        <div className="bg-eucalyptus-light/30 rounded-lg p-3 text-center">
                          <p className="text-eucalyptus-dark font-semibold">No compulsory HECS repayment</p>
                          <p className="text-xs text-warmgray-light mt-1">Threshold: {formatAUD(HECS_HELP.minimumThreshold)}</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-warmgray">Income above threshold</span>
                            <span className="font-medium text-navy">{formatAUD(salary - HECS_HELP.minimumThreshold)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-navy">Annual HECS Repayment</span>
                            <span className="text-xl font-bold text-ochre">{formatAUD(result.hecsRepayment)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-warmgray-light">Per week impact</span>
                            <span className="text-warmgray-light">{formatAUD(result.weeklyHECS, 2)}/week</span>
                          </div>
                          <div className="border-t border-sandstone-dark/20" />
                          <div className="flex justify-between">
                            <span className="text-warmgray">Take-home (without HECS)</span>
                            <span className="font-medium text-navy">{formatAUD(result.takeHomeWithoutHECS)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-navy">Take-home (with HECS)</span>
                            <span className="font-bold text-eucalyptus-dark">{formatAUD(result.takeHomeWithHECS)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">

          {/* How Are HECS-HELP Repayments Calculated? */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Are HECS-HELP Repayments Calculated?</h2>
            <p className="mb-3 text-warmgray">
              HECS-HELP repayments are calculated using a <strong>marginal rate system</strong> that applies tiered rates only to income above the {formatAUD(HECS_HELP.minimumThreshold)} threshold in FY2025-26.
            </p>
            <p className="mb-3 text-warmgray">
              The Australian Tax Office determines your &quot;repayment income&quot; by adding your taxable income, net investment losses, reportable fringe benefits, reportable super contributions, and exempt foreign employment income. This repayment income figure &mdash; not your gross salary alone &mdash; dictates the HECS calculation applied to your tax return.
            </p>

            <h3 className="text-xl font-semibold text-navy mt-6 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Step-by-Step HECS Calculation</h3>
            <ol className="list-decimal pl-5 text-warmgray space-y-2 mb-4">
              <li>Determine your repayment income for the financial year (taxable income + add-back amounts).</li>
              <li>Compare it to the minimum threshold of <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong>. Below this amount, your compulsory repayment is <strong>$0</strong>.</li>
              <li>For income between {formatAUD(67_001)} and {formatAUD(125_000)}, apply a marginal rate of <strong>15 cents per dollar</strong> on the amount above {formatAUD(HECS_HELP.minimumThreshold)}.</li>
              <li>For income between {formatAUD(125_001)} and {formatAUD(179_285)}, the repayment is <strong>{formatAUD(8_700)}</strong> plus <strong>17 cents per dollar</strong> above {formatAUD(125_000)}.</li>
              <li>For income of {formatAUD(179_286)} and above, the repayment is <strong>10% of total repayment income</strong>.</li>
            </ol>

            <h3 className="text-xl font-semibold text-navy mt-6 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked Example: HECS on {formatAUD(85_000)}</h3>
            <p className="mb-3 text-warmgray">
              A graduate earning <strong>{formatAUD(85_000)}</strong> per year has <strong>{formatAUD(18_000)}</strong> of income above the {formatAUD(HECS_HELP.minimumThreshold)} threshold. The HECS repayment calculation is:
            </p>
            <div className="bg-sandstone rounded-xl p-5 mb-3">
              <p className="text-sm text-navy font-mono">
                ({formatAUD(85_000)} &minus; {formatAUD(67_000)}) &times; 0.15 = <strong>{formatAUD(calculateHECS(85_000))}</strong> per year
              </p>
              <p className="text-sm text-warmgray mt-2">
                Weekly impact: <strong>{formatAUD(annualToWeekly(calculateHECS(85_000)), 2)}</strong> per week
              </p>
            </div>
            <p className="text-sm text-warmgray">
              Use our <Link href="/" className="text-eucalyptus-dark hover:underline font-medium">Pay Calculator</Link> to see how this HECS repayment fits into your complete after-tax income breakdown, including income tax brackets, the Medicare levy, and superannuation.
            </p>
          </section>

          {/* HECS Repayment Thresholds */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the HECS Repayment Thresholds for FY2025-26?</h2>
            <p className="mb-4 text-warmgray">
              The HECS-HELP repayment threshold for FY2025-26 is <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong>, up from {formatAUD(HECS_HELP.previousThreshold)} in FY2024-25 &mdash; a <strong>{formatPercent((HECS_HELP.minimumThreshold - HECS_HELP.previousThreshold) / HECS_HELP.previousThreshold, 1)}</strong> increase.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Repayment Income</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Rate</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">How It&apos;s Calculated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {HECS_HELP.bands.map((band, i) => (
                    <tr key={i} className="hover:bg-sandstone">
                      <td className="px-4 py-3 text-navy">
                        {band.max === Infinity ? `${formatAUD(band.min)} and over` : `${formatAUD(band.min === 0 ? 0 : band.min)} – ${formatAUD(band.max)}`}
                      </td>
                      <td className="px-4 py-3 font-medium text-navy">
                        {band.marginalRate === 0 ? "Nil" : formatPercent(band.marginalRate, 0)}
                      </td>
                      <td className="px-4 py-3 text-warmgray">{band.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-warmgray-light">
              <strong>Repayment income</strong> includes your taxable income plus net investment losses, reportable fringe benefits, reportable super contributions, and exempt foreign employment income. These thresholds apply to all &quot;Study and Training Support Loans&quot; including HECS-HELP, FEE-HELP, VET Student Loans, and SA-HELP.
            </p>
          </section>

          {/* Who Uses This Calculator? */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Uses This HECS-HELP Calculator?</h2>
            <p className="mb-4 text-warmgray">
              Over <strong>3 million Australians</strong> hold a HELP debt as of 2025, making this calculator relevant to a significant share of the workforce.
            </p>
            <ul className="list-disc pl-5 text-warmgray space-y-2">
              <li><strong>Recent graduates</strong> starting their first full-time job and estimating how HECS reduces their take-home pay after tax.</li>
              <li><strong>Mid-career professionals</strong> approaching a pay rise who want to understand how higher income increases their compulsory HECS repayment under the marginal rate system.</li>
              <li><strong>Mortgage applicants</strong> needing to calculate how HECS repayments reduce borrowing capacity &mdash; lenders subtract compulsory HECS from assessable income.</li>
              <li><strong>Salary negotiators</strong> comparing a job offer&apos;s gross salary to the actual net pay after income tax, Medicare levy, and HECS deductions.</li>
              <li><strong>Part-time workers and contractors</strong> with variable income who need to check whether they cross the {formatAUD(HECS_HELP.minimumThreshold)} threshold in a given financial year.</li>
            </ul>
            <p className="mt-3 text-sm text-warmgray">
              Pair this tool with our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income Tax Calculator</Link> to see the combined effect of income tax brackets, the Medicare levy, and HECS on your after-tax income.
            </p>
          </section>

          {/* Impact on take-home */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does HECS Affect Your Take-Home Pay?</h2>
            <p className="mb-4 text-warmgray">
              HECS reduces your take-home pay by between <strong>{formatAUD(annualToWeekly(calculateHECS(70_000)), 2)}</strong> and <strong>{formatAUD(annualToWeekly(calculateHECS(120_000)), 2)}</strong> per week for salaries between {formatAUD(70_000)} and {formatAUD(120_000)}.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Gross Salary</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">HECS Repayment</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Per Week</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Take-Home (with HECS)</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Take-Home (no HECS)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[60_000, 67_000, 70_000, 75_000, 80_000, 90_000, 100_000, 120_000].map((s) => {
                    const hecs = calculateHECS(s);
                    const bp = calculatePayBreakdown({ grossSalary: s, includeHECS: true });
                    const bpNo = calculatePayBreakdown({ grossSalary: s, includeHECS: false });
                    return (
                      <tr key={s} className="hover:bg-sandstone">
                        <td className="px-4 py-3 font-medium text-navy">{formatAUD(s)}</td>
                        <td className="px-4 py-3 text-right text-navy">{formatAUD(hecs)}</td>
                        <td className="px-4 py-3 text-right text-warmgray-light">{formatAUD(annualToWeekly(hecs), 2)}</td>
                        <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(bp.takeHomePay)}</td>
                        <td className="px-4 py-3 text-right text-warmgray">{formatAUD(bpNo.takeHomePay)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-warmgray-light">
              At {formatAUD(60_000)} and {formatAUD(67_000)}, no compulsory HECS repayment applies because income sits below the {formatAUD(HECS_HELP.minimumThreshold)} threshold. The jump from {formatAUD(67_000)} to {formatAUD(70_000)} costs only {formatAUD(calculateHECS(70_000))} in HECS ({formatAUD(annualToWeekly(calculateHECS(70_000)), 2)}/week) &mdash; a key benefit of the new marginal rate system.{" "}
              <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Take-Home Pay Calculator</Link> provides a full net pay breakdown at any salary.
            </p>
          </section>

          {/* What Changed in FY2025-26 */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed in HECS-HELP for FY2025-26?</h2>
            <p className="mb-4 text-warmgray">The FY2025-26 financial year introduced the <strong>biggest reform to HECS repayments in 35 years</strong>, replacing the flat-rate system with marginal-rate calculations and capping indexation.</p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy"></th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Old System (Before FY2025-26)</th>
                    <th className="px-4 py-3 text-left font-semibold text-ochre bg-sandstone/50">New System (FY2025-26+)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="px-4 py-3 font-medium text-navy">How it worked</td><td className="px-4 py-3 text-warmgray">Flat % on total income</td><td className="px-4 py-3 text-ochre bg-sandstone/50 font-medium">Marginal rate on income above threshold</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-navy">Threshold</td><td className="px-4 py-3 text-warmgray">{formatAUD(HECS_HELP.previousThreshold)}</td><td className="px-4 py-3 text-ochre bg-sandstone/50 font-bold">{formatAUD(HECS_HELP.minimumThreshold)}</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-navy">Smallest repayment</td><td className="px-4 py-3 text-warmgray">1% of entire income ($544)</td><td className="px-4 py-3 text-ochre bg-sandstone/50">15c per $1 over {formatAUD(HECS_HELP.minimumThreshold)}</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-navy">Cliff effect</td><td className="px-4 py-3 text-warmgray">Earning $1 over threshold triggered repayment on entire income</td><td className="px-4 py-3 text-ochre bg-sandstone/50 font-medium">Gradual increase &mdash; no cliff edge</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-navy">Indexation cap</td><td className="px-4 py-3 text-warmgray">CPI only (hit 7.1% in 2023)</td><td className="px-4 py-3 text-ochre bg-sandstone/50 font-medium">Lower of CPI or WPI</td></tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-navy mt-6 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does the New Indexation Cap Work?</h3>
            <p className="mb-3 text-warmgray">
              HECS debts are indexed on <strong>1 June each year</strong> at the lower of CPI or the Wage Price Index (WPI). The government introduced this cap after CPI-based indexation hit <strong>7.1%</strong> in June 2023, adding thousands of dollars to outstanding balances overnight. The new cap was backdated to June 2023, reducing that year&apos;s indexation to <strong>3.2%</strong>. For FY2025-26, the indexation rate is expected to remain between <strong>2.5% and 3.5%</strong> based on forecast WPI growth.
            </p>
            <p className="text-sm text-warmgray">
              Voluntary repayments made before 1 June reduce the balance before indexation is applied. Use our <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Superannuation Calculator</Link> to compare whether extra super contributions or HECS repayments offer better long-term value.
            </p>
          </section>

          {/* Common HECS Mistakes */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are Common HECS-HELP Mistakes?</h2>
            <p className="mb-4 text-warmgray">
              The most common HECS mistake is <strong>not ticking the HELP debt box</strong> on the Tax File Number declaration, which causes a large tax bill at end of financial year instead of regular PAYG withholding.
            </p>
            <ol className="list-decimal pl-5 text-warmgray space-y-3">
              <li>
                <strong>Forgetting to declare the HELP debt to your employer.</strong> Your employer withholds HECS through PAYG only if you indicate a HELP debt on your TFN declaration. Failing to tick this box means zero withholding during the year and a lump-sum bill of {formatAUD(calculateHECS(80_000))} or more at tax time on an {formatAUD(80_000)} salary.
              </li>
              <li>
                <strong>Using gross salary instead of repayment income.</strong> Repayment income adds back net investment losses, reportable fringe benefits, and reportable super contributions. A salary of {formatAUD(65_000)} with {formatAUD(5_000)} in reportable super pushes repayment income to {formatAUD(70_000)} &mdash; above the {formatAUD(HECS_HELP.minimumThreshold)} threshold.
              </li>
              <li>
                <strong>Assuming salary sacrifice eliminates HECS.</strong> Reportable employer super contributions are added back to calculate repayment income. <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Salary sacrificing into super</Link> reduces taxable income but has limited effect on HECS repayments.
              </li>
              <li>
                <strong>Making voluntary repayments while holding higher-interest debt.</strong> HECS is indexed at CPI or WPI (typically <strong>2.5% to 3.5%</strong>), which is lower than credit card rates (15% to 22%), car loans (6% to 9%), and personal loans (7% to 14%). Pay those debts first.
              </li>
              <li>
                <strong>Not timing voluntary repayments before 1 June.</strong> Indexation applies to the outstanding balance on 1 June. A voluntary repayment on 2 June reduces next year&apos;s balance but does nothing for the current year&apos;s indexation.
              </li>
            </ol>
          </section>

          {/* Voluntary repayments */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Should You Make Voluntary HECS Repayments?</h2>
            <p className="mb-3 text-warmgray">Voluntary repayments reduce your HECS debt faster, but the financial benefit is limited because HECS is indexed to CPI or WPI &mdash; not charged market-rate interest. The effective rate is typically <strong>2.5% to 3.5%</strong>, well below a mortgage rate of 6% to 7%.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-eucalyptus-dark mb-2">Consider voluntary repayments if:</h3>
                <ul className="list-disc pl-5 text-warmgray space-y-1">
                  <li>You have no other debts with higher interest rates</li>
                  <li>You want to remove the HECS hit from your weekly take-home pay</li>
                  <li>You are planning a mortgage application and want to increase borrowing capacity</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-ochre mb-2">Do not prioritise if:</h3>
                <ul className="list-disc pl-5 text-warmgray space-y-1">
                  <li>You have credit card debt, car loans, or personal loans at higher rates</li>
                  <li>You would earn a higher return by investing the money (index funds historically return 7% to 10%)</li>
                  <li>Your HELP debt will be written off at age 67 or upon death</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Related Calculators */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Which Related Calculators Help with HECS Planning?</h2>
            <p className="mb-4 text-warmgray">
              HECS is one component of your total pay deductions. These Australian tax calculators provide the full picture of your salary, tax, and net pay for the 2025-26 financial year.
            </p>
            <ul className="list-disc pl-5 text-warmgray space-y-2">
              <li><Link href="/" className="text-eucalyptus-dark hover:underline font-medium">Pay Calculator</Link> &mdash; complete breakdown of gross salary to net pay including income tax, Medicare levy, superannuation, and HECS.</li>
              <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income Tax Calculator</Link> &mdash; see how income tax brackets apply to your salary and calculate your marginal tax rate.</li>
              <li><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Take-Home Pay Calculator</Link> &mdash; calculate your after-tax income with or without a HELP debt factored in.</li>
              <li><Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Salary Sacrifice Calculator</Link> &mdash; estimate the tax savings of salary sacrificing into superannuation and its limited effect on HECS repayments.</li>
              <li><Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Superannuation Calculator</Link> &mdash; calculate your employer SG contributions at the <strong>12%</strong> rate for FY2025-26.</li>
            </ul>
          </section>

          <MethodologyDisclosure>
            <ol className="list-decimal space-y-1 pl-4">
              <li>Check if salary exceeds the {formatAUD(HECS_HELP.minimumThreshold)} threshold.</li>
              <li>Apply marginal rates: 15c per $1 over {formatAUD(HECS_HELP.minimumThreshold)} (up to {formatAUD(125_000)}).</li>
              <li>{formatAUD(8_700)} + 17c per $1 over {formatAUD(125_000)} (up to {formatAUD(179_285)}).</li>
              <li>10% of total repayment income above {formatAUD(179_285)}.</li>
            </ol>
          </MethodologyDisclosure>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <AccordionItem value="threshold" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>At what income do HECS repayments start?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Compulsory HECS repayments start when your repayment income reaches <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong> in FY{SITE_CONFIG.financialYear} (up from {formatAUD(HECS_HELP.previousThreshold)} in FY2024-25). Below {formatAUD(HECS_HELP.minimumThreshold)}, you make no compulsory repayment.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="80k" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How much is my HECS repayment on $80,000?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">On $80,000, your compulsory HECS repayment is <strong>{formatAUD(calculateHECS(80_000))}</strong> per year (<strong>{formatAUD(annualToWeekly(calculateHECS(80_000)), 2)}</strong> per week). Calculated at 15 cents per dollar on the $13,000 above the {formatAUD(HECS_HELP.minimumThreshold)} threshold.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="payg" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Do HECS repayments come out of my pay?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. Your employer deducts HECS repayments through the PAYG withholding system if you have indicated a HELP debt on your Tax File Number declaration. The amount is withheld from each pay cycle, just like <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">income tax</Link>.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="salsac" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Can I reduce my HECS repayment with salary sacrifice?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray"><Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary sacrificing into super</Link> reduces your taxable income, which may reduce your HECS. However, reportable super contributions are added back to calculate repayment income, so the benefit is limited. A salary sacrifice of {formatAUD(10_000)} into super reduces taxable income but adds {formatAUD(10_000)} back as a reportable employer super contribution.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="indexation-rate" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>What is the current HECS indexation rate?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">HECS debts are indexed annually on 1 June based on the lower of CPI or WPI (Wage Price Index). This cap was introduced after the historic <strong>7.1%</strong> CPI spike in 2023 and backdated to June 2023, applying <strong>3.2%</strong> instead. The formula ensures your debt never grows faster than average wages.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="mortgage" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Does HECS affect my mortgage application?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. Lenders include your compulsory HECS repayment when assessing your borrowing capacity. On {formatAUD(100_000)}, your annual HECS repayment is <strong>{formatAUD(calculateHECS(100_000))}</strong> ({formatAUD(annualToWeekly(calculateHECS(100_000)), 2)}/week), which reduces how much you can borrow. Some borrowers make voluntary repayments before applying for a mortgage to increase their borrowing power.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="repayment-income" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>What counts as repayment income for HECS?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Repayment income equals your taxable income plus net investment losses, reportable fringe benefits, reportable employer super contributions, and exempt foreign employment income. This figure is higher than your taxable income alone. A graduate earning {formatAUD(65_000)} with {formatAUD(3_000)} in reportable super has a repayment income of <strong>{formatAUD(68_000)}</strong> &mdash; above the {formatAUD(HECS_HELP.minimumThreshold)} threshold.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="overseas" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Do I repay HECS if I move overseas?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. Australian residents living overseas for more than <strong>183 days</strong> must lodge an overseas HELP repayment assessment with the ATO. The repayment thresholds and rates are the same as for domestic residents, but you self-assess your worldwide income rather than having PAYG withholding through an Australian employer.</p></AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* CTA */}
          <section className="bg-sandstone rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>See your full pay breakdown</h2>
            <p className="text-warmgray mb-6 max-w-lg mx-auto">Get the complete picture with income tax, Medicare, HECS, and super — all in one calculation.</p>
            <Link href="/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all">Pay Calculator →</Link>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
        </div>
      </div>
    </div>
  );
}
