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
  annualToWeekly,
  HECS_HELP,
  SOURCES,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// ---------- FY2026-27 HECS-HELP repayment settings ----------
// Thresholds are indexed each financial year. FY2026-27 figures verified against the
// ATO "Study and training support loans rates and repayment thresholds" schedule.
// The sitewide constants (lib/constants) remain the FY2025-26 source of truth for
// other pages; this page targets the current repayment year.
const HECS_2026_27 = {
  financialYear: "2026-27",
  minimumThreshold: 69_528,
  previousThreshold: HECS_HELP.minimumThreshold, // $69,528 (FY2025-26)
  indexationDate: "1 June 2026",
  indexationRate: 0.028,
  bands: [
    { min: 0, max: 69_528, marginalRate: 0, base: 0, label: "No compulsory repayment" },
    { min: 69_529, max: 129_717, marginalRate: 0.15, base: 0, label: "15c per $1 over $69,528" },
    { min: 129_718, max: 186_050, marginalRate: 0.17, base: 9_028, label: "$9,028 + 17c per $1 over $129,717" },
    { min: 186_051, max: Infinity, marginalRate: 0.10, base: 0, label: "10% of total repayment income" },
  ],
} as const;

/** Compulsory HELP/HECS repayment for FY2026-27 (marginal system). */
function calculateHECS2627(income: number): number {
  const t = HECS_2026_27.minimumThreshold;
  if (income <= t) return 0;
  if (income <= 129_717) return Math.round((income - t) * 0.15);
  if (income <= 186_050) return Math.round(9_028 + (income - 129_717) * 0.17);
  return Math.round(income * 0.10);
}

const SOURCES_LIST: SourceLink[] = [
  { title: "HECS-HELP repayment thresholds and rates", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: SOURCES.ato.name },
  { title: "Indexation of HELP debts", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-indexation-rates", publisher: SOURCES.ato.name },
  { title: "Voluntary repayments", url: "https://www.ato.gov.au/individuals-and-families/study-and-training-support-loans/voluntary-repayments", publisher: SOURCES.ato.name },
];

export default function HECSHelpCalculatorPage() {
  const [salary, setSalary] = useState(80_000);

  const result = useMemo(() => {
    const hecsRepayment = calculateHECS2627(salary);
    // Income tax / Medicare per the site's shared engine; HECS applied from the
    // FY2026-27 schedule above so the repayment figure is always current-year.
    const breakdownNoHECS = calculatePayBreakdown({ grossSalary: salary, includeHECS: false });
    return {
      hecsRepayment,
      weeklyHECS: annualToWeekly(hecsRepayment),
      takeHomeWithHECS: breakdownNoHECS.takeHomePay - hecsRepayment,
      takeHomeWithoutHECS: breakdownNoHECS.takeHomePay,
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
              <li><span className="font-medium text-navy" aria-current="page">HECS Repayment Calculator</span></li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            HECS Repayment Calculator Australia 2026-27
          </h1>
          <p className="text-lg text-warmgray">
            Calculate your compulsory HECS-HELP repayment for the 2026-27 financial year. The repayment threshold has risen to {formatAUD(HECS_2026_27.minimumThreshold)},
            and under the marginal rate system you repay only on income above the threshold — not on your entire salary.
          </p>
          <p className="text-sm text-warmgray-light mt-2">Updated: 2 July 2026 — FY2026-27 thresholds applied.</p>
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
                    <h2 className="text-xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Your HECS Repayment (2026-27)</h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-warmgray">Gross Salary</span><span className="font-bold text-navy">{formatAUD(salary)}</span></div>
                      <div className="border-t border-sandstone-dark/20" />
                      {salary <= HECS_2026_27.minimumThreshold ? (
                        <div className="bg-eucalyptus-light/30 rounded-lg p-3 text-center">
                          <p className="text-eucalyptus-dark font-semibold">No compulsory HECS repayment</p>
                          <p className="text-xs text-warmgray-light mt-1">2026-27 threshold: {formatAUD(HECS_2026_27.minimumThreshold)}</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-warmgray">Income above threshold</span>
                            <span className="font-medium text-navy">{formatAUD(salary - HECS_2026_27.minimumThreshold)}</span>
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

          {/* How Are HECS Repayments Calculated? */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Are HECS Repayments Calculated?</h2>
            <p className="mb-3 text-warmgray">
              HECS repayments are calculated using a <strong>marginal rate system</strong> that applies tiered rates only to income above the {formatAUD(HECS_2026_27.minimumThreshold)} threshold in FY2026-27.
            </p>
            <p className="mb-3 text-warmgray">
              The Australian Tax Office determines your &quot;repayment income&quot; by adding your taxable income, net investment losses, reportable fringe benefits, reportable super contributions, and exempt foreign employment income. This repayment income figure &mdash; not your gross salary alone &mdash; dictates the HECS calculation applied to your tax return.
            </p>

            <h3 className="text-xl font-semibold text-navy mt-6 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Step-by-Step HECS Calculation (2026-27)</h3>
            <ol className="list-decimal pl-5 text-warmgray space-y-2 mb-4">
              <li>Determine your repayment income for the financial year (taxable income + add-back amounts).</li>
              <li>Compare it to the minimum threshold of <strong>{formatAUD(HECS_2026_27.minimumThreshold)}</strong>. At or below this amount, your compulsory repayment is <strong>$0</strong>.</li>
              <li>For income between {formatAUD(69_529)} and {formatAUD(129_717)}, apply a marginal rate of <strong>15 cents per dollar</strong> on the amount above {formatAUD(HECS_2026_27.minimumThreshold)}.</li>
              <li>For income between {formatAUD(129_718)} and {formatAUD(186_050)}, the repayment is <strong>{formatAUD(9_028)}</strong> plus <strong>17 cents per dollar</strong> above {formatAUD(129_717)}.</li>
              <li>For income of {formatAUD(186_051)} and above, the repayment is <strong>10% of total repayment income</strong>.</li>
            </ol>

            <h3 className="text-xl font-semibold text-navy mt-6 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked Example: HECS on {formatAUD(85_000)}</h3>
            <p className="mb-3 text-warmgray">
              A graduate earning <strong>{formatAUD(85_000)}</strong> per year has <strong>{formatAUD(85_000 - HECS_2026_27.minimumThreshold)}</strong> of income above the {formatAUD(HECS_2026_27.minimumThreshold)} threshold. The HECS repayment calculation is:
            </p>
            <div className="bg-sandstone rounded-xl p-5 mb-3">
              <p className="text-sm text-navy font-mono">
                ({formatAUD(85_000)} &minus; {formatAUD(HECS_2026_27.minimumThreshold)}) &times; 0.15 = <strong>{formatAUD(calculateHECS2627(85_000))}</strong> per year
              </p>
              <p className="text-sm text-warmgray mt-2">
                Weekly impact: <strong>{formatAUD(annualToWeekly(calculateHECS2627(85_000)), 2)}</strong> per week
              </p>
            </div>
            <p className="text-sm text-warmgray">
              Use our <Link href="/" className="text-eucalyptus-dark hover:underline font-medium">Pay Calculator</Link> to see how this HECS repayment fits into your complete after-tax income breakdown, including income tax brackets, the Medicare levy, and superannuation.
            </p>
          </section>

          {/* HECS Repayment Rates 2026-27 */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>HECS Repayment Rates 2026-27</h2>
            <p className="mb-4 text-warmgray">
              The HECS repayment threshold for FY2026-27 is <strong>{formatAUD(HECS_2026_27.minimumThreshold)}</strong>, up from {formatAUD(HECS_2026_27.previousThreshold)} in FY2025-26. Repayment thresholds are indexed at the start of each financial year. See our news coverage of the <Link href="/news/hecs-repayment-threshold-2026-27/" className="text-eucalyptus-dark hover:underline font-medium">2026-27 HECS repayment threshold</Link> for how it was set and what it means for borrowers.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Repayment Income (2026-27)</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Rate</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">How It&apos;s Calculated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {HECS_2026_27.bands.map((band, i) => (
                    <tr key={i} className="hover:bg-sandstone">
                      <td className="px-4 py-3 text-navy">
                        {band.max === Infinity ? `${formatAUD(band.min)} and over` : `${formatAUD(band.min === 0 ? 0 : band.min)} – ${formatAUD(band.max)}`}
                      </td>
                      <td className="px-4 py-3 font-medium text-navy">
                        {band.marginalRate === 0 ? "Nil" : `${Math.round(band.marginalRate * 100)}%`}
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

            <h3 className="text-xl font-semibold text-navy mt-6 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>HECS Repayment Threshold by Year</h3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Financial Year</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Minimum Repayment Threshold</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">System</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy">2024-25</td><td className="px-4 py-3 text-navy">{formatAUD(HECS_HELP.previousThreshold)}</td><td className="px-4 py-3 text-warmgray">Old flat-rate system (1% of entire income at threshold)</td></tr>
                  <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy">2025-26</td><td className="px-4 py-3 text-navy">{formatAUD(HECS_2026_27.previousThreshold)}</td><td className="px-4 py-3 text-warmgray">New marginal rate system introduced</td></tr>
                  <tr className="hover:bg-sandstone"><td className="px-4 py-3 font-bold text-navy">2026-27 (current)</td><td className="px-4 py-3 font-bold text-ochre">{formatAUD(HECS_2026_27.minimumThreshold)}</td><td className="px-4 py-3 text-warmgray">Marginal rate system, thresholds indexed</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* STSL vs assessment */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Why Your Payslip HECS Deduction Differs From Your Actual Repayment</h2>
            <p className="mb-3 text-warmgray">
              The HECS amount withheld from each pay is an <strong>estimate</strong>, not your final repayment. Employers withhold an additional PAYG component &mdash; labelled <strong>STSL</strong> on most payslips &mdash; using ATO withholding schedules based on that pay period&apos;s earnings.
            </p>
            <p className="mb-3 text-warmgray">
              Your <em>actual</em> compulsory repayment is only calculated when you lodge your tax return, using your full-year repayment income. If your pay varied during the year, or you had deductions, investment income, or reportable super, the amount withheld will not match the assessed amount &mdash; the difference is settled through your tax refund or bill.
            </p>
            <p className="text-sm text-warmgray">
              See our full guide to <Link href="/stsl-on-payslip/" className="text-eucalyptus-dark hover:underline font-medium">STSL on your payslip</Link> for how the withholding is calculated, a worked payslip example, and how to stop STSL deductions once your loan is paid off.
            </p>
          </section>

          {/* Who Uses This Calculator? */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Uses This HECS Repayment Calculator?</h2>
            <p className="mb-4 text-warmgray">
              Over <strong>3 million Australians</strong> hold a HELP debt, making this calculator relevant to a significant share of the workforce.
            </p>
            <ul className="list-disc pl-5 text-warmgray space-y-2">
              <li><strong>Recent graduates</strong> starting their first full-time job and estimating how HECS reduces their take-home pay after tax.</li>
              <li><strong>Mid-career professionals</strong> approaching a pay rise who want to understand how higher income increases their compulsory HECS repayment under the marginal rate system.</li>
              <li><strong>Mortgage applicants</strong> needing to calculate how HECS repayments reduce borrowing capacity &mdash; lenders subtract compulsory HECS from assessable income.</li>
              <li><strong>Salary negotiators</strong> comparing a job offer&apos;s gross salary to the actual net pay after income tax, Medicare levy, and HECS deductions.</li>
              <li><strong>Part-time workers and contractors</strong> with variable income who need to check whether they cross the {formatAUD(HECS_2026_27.minimumThreshold)} threshold in a given financial year.</li>
            </ul>
            <p className="mt-3 text-sm text-warmgray">
              Pair this tool with our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income Tax Calculator</Link> to see the combined effect of income tax brackets, the Medicare levy, and HECS on your after-tax income.
            </p>
          </section>

          {/* Impact on take-home */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does HECS Affect Your Take-Home Pay?</h2>
            <p className="mb-4 text-warmgray">
              HECS reduces your take-home pay by between <strong>{formatAUD(annualToWeekly(calculateHECS2627(75_000)), 2)}</strong> and <strong>{formatAUD(annualToWeekly(calculateHECS2627(120_000)), 2)}</strong> per week for salaries between {formatAUD(75_000)} and {formatAUD(120_000)}.
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
                  {[65_000, 69_528, 72_000, 75_000, 80_000, 90_000, 100_000, 120_000].map((s) => {
                    const hecs = calculateHECS2627(s);
                    const bpNo = calculatePayBreakdown({ grossSalary: s, includeHECS: false });
                    return (
                      <tr key={s} className="hover:bg-sandstone">
                        <td className="px-4 py-3 font-medium text-navy">{formatAUD(s)}</td>
                        <td className="px-4 py-3 text-right text-navy">{formatAUD(hecs)}</td>
                        <td className="px-4 py-3 text-right text-warmgray-light">{formatAUD(annualToWeekly(hecs), 2)}</td>
                        <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(bpNo.takeHomePay - hecs)}</td>
                        <td className="px-4 py-3 text-right text-warmgray">{formatAUD(bpNo.takeHomePay)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-warmgray-light">
              At {formatAUD(65_000)} and {formatAUD(69_528)}, no compulsory HECS repayment applies because income sits at or below the {formatAUD(HECS_2026_27.minimumThreshold)} threshold. The jump from {formatAUD(69_528)} to {formatAUD(72_000)} costs only {formatAUD(calculateHECS2627(72_000))} in HECS ({formatAUD(annualToWeekly(calculateHECS2627(72_000)), 2)}/week) &mdash; a key benefit of the marginal rate system.{" "}
              <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Take-Home Pay Calculator</Link> provides a full net pay breakdown at any salary. HECS figures use the FY2026-27 schedule; income tax and Medicare use the site&apos;s current tax engine.
            </p>
          </section>

          {/* What Changed */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Has Changed in HECS-HELP Recently?</h2>
            <p className="mb-4 text-warmgray">Two major reforms landed in the past two years: a <strong>one-off 20% reduction of all HELP debt balances</strong> (legislated in 2025 and applied automatically by the ATO), and the switch from flat-rate to <strong>marginal-rate repayments</strong> from FY2025-26 &mdash; the biggest reform to HECS repayments in 35 years.</p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy"></th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Old System (Before FY2025-26)</th>
                    <th className="px-4 py-3 text-left font-semibold text-ochre bg-sandstone/50">New System (FY2025-26 onwards)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="px-4 py-3 font-medium text-navy">How it worked</td><td className="px-4 py-3 text-warmgray">Flat % on total income</td><td className="px-4 py-3 text-ochre bg-sandstone/50 font-medium">Marginal rate on income above threshold</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-navy">Threshold</td><td className="px-4 py-3 text-warmgray">{formatAUD(HECS_HELP.previousThreshold)} (2024-25)</td><td className="px-4 py-3 text-ochre bg-sandstone/50 font-bold">{formatAUD(HECS_2026_27.previousThreshold)} (2025-26) → {formatAUD(HECS_2026_27.minimumThreshold)} (2026-27)</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-navy">Smallest repayment</td><td className="px-4 py-3 text-warmgray">1% of entire income</td><td className="px-4 py-3 text-ochre bg-sandstone/50">15c per $1 over the threshold</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-navy">Cliff effect</td><td className="px-4 py-3 text-warmgray">Earning $1 over threshold triggered repayment on entire income</td><td className="px-4 py-3 text-ochre bg-sandstone/50 font-medium">Gradual increase &mdash; no cliff edge</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-navy">Debt balance</td><td className="px-4 py-3 text-warmgray">Full balance carried</td><td className="px-4 py-3 text-ochre bg-sandstone/50 font-medium">One-off 20% reduction applied to balances (2025)</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-navy">Indexation cap</td><td className="px-4 py-3 text-warmgray">CPI only (hit 7.1% in 2023)</td><td className="px-4 py-3 text-ochre bg-sandstone/50 font-medium">Lower of CPI or WPI</td></tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-navy mt-6 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does the New Indexation Cap Work?</h3>
            <p className="mb-3 text-warmgray">
              HECS debts are indexed on <strong>1 June each year</strong> at the lower of CPI or the Wage Price Index (WPI). The government introduced this cap after CPI-based indexation hit <strong>7.1%</strong> in June 2023, adding thousands of dollars to outstanding balances overnight. The cap was backdated to June 2023, reducing that year&apos;s indexation to <strong>3.2%</strong>. On {HECS_2026_27.indexationDate}, HELP debts were indexed at <strong>2.8%</strong> &mdash; read more on <Link href="/news/hecs-indexation-2026/" className="text-eucalyptus-dark hover:underline font-medium">HECS indexation 2026</Link>.
            </p>
            <p className="text-sm text-warmgray">
              Voluntary repayments made before 1 June reduce the balance before indexation is applied. Use our <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Superannuation Calculator</Link> to compare whether extra super contributions or HECS repayments offer better long-term value.
            </p>
          </section>

          {/* Common HECS Mistakes */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are Common HECS Mistakes?</h2>
            <p className="mb-4 text-warmgray">
              The most common HECS mistake is <strong>not ticking the HELP debt box</strong> on the Tax File Number declaration, which causes a large tax bill at end of financial year instead of regular PAYG withholding.
            </p>
            <ol className="list-decimal pl-5 text-warmgray space-y-3">
              <li>
                <strong>Forgetting to declare the HELP debt to your employer.</strong> Your employer withholds HECS through PAYG (the <Link href="/stsl-on-payslip/" className="text-eucalyptus-dark hover:underline font-medium">STSL component on your payslip</Link>) only if you indicate a HELP debt on your TFN declaration. Failing to tick this box means zero withholding during the year and a lump-sum bill of {formatAUD(calculateHECS2627(80_000))} or more at tax time on an {formatAUD(80_000)} salary.
              </li>
              <li>
                <strong>Using gross salary instead of repayment income.</strong> Repayment income adds back net investment losses, reportable fringe benefits, and reportable super contributions. A salary of {formatAUD(66_000)} with {formatAUD(5_000)} in reportable super pushes repayment income to {formatAUD(71_000)} &mdash; above the {formatAUD(HECS_2026_27.minimumThreshold)} threshold.
              </li>
              <li>
                <strong>Assuming salary sacrifice eliminates HECS.</strong> Reportable employer super contributions are added back to calculate repayment income. <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Salary sacrificing into super</Link> reduces taxable income but has limited effect on HECS repayments.
              </li>
              <li>
                <strong>Making voluntary repayments while holding higher-interest debt.</strong> HECS is indexed at CPI or WPI (2.8% in 2026), which is lower than credit card rates (15% to 22%), car loans (6% to 9%), and personal loans (7% to 14%). Pay those debts first.
              </li>
              <li>
                <strong>Not timing voluntary repayments before 1 June.</strong> Indexation applies to the outstanding balance on 1 June. A voluntary repayment on 2 June reduces next year&apos;s balance but does nothing for the current year&apos;s indexation.
              </li>
            </ol>
          </section>

          {/* Voluntary repayments */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Should You Make Voluntary HECS Repayments?</h2>
            <p className="mb-3 text-warmgray">Voluntary repayments reduce your HECS debt faster, but the financial benefit is limited because HECS is indexed to CPI or WPI &mdash; not charged market-rate interest. The 2026 indexation rate was <strong>2.8%</strong>, well below a mortgage rate of 6% to 7%.</p>
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
              HECS is one component of your total pay deductions. These Australian tax calculators provide the full picture of your salary, tax, and net pay.
            </p>
            <ul className="list-disc pl-5 text-warmgray space-y-2">
              <li><Link href="/" className="text-eucalyptus-dark hover:underline font-medium">Pay Calculator</Link> &mdash; complete breakdown of gross salary to net pay including income tax, Medicare levy, superannuation, and HECS.</li>
              <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income Tax Calculator</Link> &mdash; see how income tax brackets apply to your salary and calculate your marginal tax rate.</li>
              <li><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Take-Home Pay Calculator</Link> &mdash; calculate your after-tax income with or without a HELP debt factored in.</li>
              <li><Link href="/hecs-help-guide/" className="text-eucalyptus-dark hover:underline font-medium">HECS-HELP Guide</Link> &mdash; how the loan system works, indexation history, and repayment strategies in full detail.</li>
              <li><Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Salary Sacrifice Calculator</Link> &mdash; estimate the tax savings of salary sacrificing into superannuation and its limited effect on HECS repayments.</li>
              <li><Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Superannuation Calculator</Link> &mdash; calculate your employer SG contributions at the <strong>12%</strong> rate.</li>
            </ul>
          </section>

          <MethodologyDisclosure>
            <ol className="list-decimal space-y-1 pl-4">
              <li>Check if repayment income exceeds the {formatAUD(HECS_2026_27.minimumThreshold)} threshold (FY2026-27).</li>
              <li>Apply marginal rates: 15c per $1 over {formatAUD(HECS_2026_27.minimumThreshold)} (up to {formatAUD(129_717)}).</li>
              <li>{formatAUD(9_028)} + 17c per $1 over {formatAUD(129_717)} (up to {formatAUD(186_050)}).</li>
              <li>10% of total repayment income above {formatAUD(186_050)}.</li>
            </ol>
          </MethodologyDisclosure>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <AccordionItem value="threshold" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>At what income do HECS repayments start in 2026-27?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Compulsory HECS repayments start when your repayment income exceeds <strong>{formatAUD(HECS_2026_27.minimumThreshold)}</strong> in FY2026-27 (up from {formatAUD(HECS_2026_27.previousThreshold)} in FY2025-26). At or below {formatAUD(HECS_2026_27.minimumThreshold)}, you make no compulsory repayment.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="80k" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How much is my HECS repayment on $80,000?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">On $80,000, your compulsory HECS repayment is <strong>{formatAUD(calculateHECS2627(80_000))}</strong> per year (<strong>{formatAUD(annualToWeekly(calculateHECS2627(80_000)), 2)}</strong> per week) in FY2026-27. Calculated at 15 cents per dollar on the {formatAUD(80_000 - HECS_2026_27.minimumThreshold)} above the {formatAUD(HECS_2026_27.minimumThreshold)} threshold.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="payg" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Do HECS repayments come out of my pay?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. Your employer deducts HECS repayments through the PAYG withholding system if you have indicated a HELP debt on your Tax File Number declaration. The deduction appears as <Link href="/stsl-on-payslip/" className="text-eucalyptus-dark hover:underline">STSL on your payslip</Link> and is withheld from each pay cycle, just like <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">income tax</Link>.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="stsl-diff" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Why is the HECS amount on my payslip different from this calculator?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Your payslip shows the <strong>STSL withholding</strong> &mdash; an estimate based on each pay period&apos;s earnings using ATO withholding schedules. Your actual repayment is calculated on your full-year repayment income when you lodge your tax return. Any difference is settled through your refund or tax bill. See our <Link href="/stsl-on-payslip/" className="text-eucalyptus-dark hover:underline">STSL on your payslip</Link> guide.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="salsac" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Can I reduce my HECS repayment with salary sacrifice?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray"><Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary sacrificing into super</Link> reduces your taxable income, which may reduce your HECS. However, reportable super contributions are added back to calculate repayment income, so the benefit is limited. A salary sacrifice of {formatAUD(10_000)} into super reduces taxable income but adds {formatAUD(10_000)} back as a reportable employer super contribution.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="indexation-rate" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>What is the current HECS indexation rate?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">HELP debts were indexed at <strong>2.8%</strong> on 1 June 2026. Indexation is applied annually on 1 June at the lower of CPI or WPI (Wage Price Index). This cap was introduced after the historic <strong>7.1%</strong> CPI spike in 2023 and backdated to June 2023, applying <strong>3.2%</strong> instead. The formula ensures your debt never grows faster than average wages.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="mortgage" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Does HECS affect my mortgage application?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. Lenders include your compulsory HECS repayment when assessing your borrowing capacity. On {formatAUD(100_000)}, your annual HECS repayment is <strong>{formatAUD(calculateHECS2627(100_000))}</strong> ({formatAUD(annualToWeekly(calculateHECS2627(100_000)), 2)}/week) in FY2026-27, which reduces how much you can borrow. Some borrowers make voluntary repayments before applying for a mortgage to increase their borrowing power.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="repayment-income" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>What counts as repayment income for HECS?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Repayment income equals your taxable income plus net investment losses, reportable fringe benefits, reportable employer super contributions, and exempt foreign employment income. This figure is higher than your taxable income alone. A graduate earning {formatAUD(66_000)} with {formatAUD(5_000)} in reportable super has a repayment income of <strong>{formatAUD(71_000)}</strong> &mdash; above the {formatAUD(HECS_2026_27.minimumThreshold)} threshold.</p></AccordionContent>
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

          <SourceAttribution sources={SOURCES_LIST} lastVerified="2 July 2026" />
        </div>
      </div>
    </div>
  );
}
