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
  formatPercent,
  SUPER_GUARANTEE,
  HECS_HELP,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Medicare levy", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy", publisher: SOURCES.ato.name },
];

export default function AnnualPayCalculatorPage() {
  const [salary, setSalary] = useState(80_000);
  const [includeHECS, setIncludeHECS] = useState(false);

  const result = useMemo(
    () => calculatePayBreakdown({ grossSalary: salary, includeHECS, hasPrivateHealth: true }),
    [salary, includeHECS]
  );

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Annual Pay Calculator</span></li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Annual Salary Calculator Australia — Yearly Take-Home Pay (2025-26)</h1>
          <p className="text-lg text-warmgray">Enter any gross annual salary to see exactly what it means as a single yearly take-home figure — after income tax, the Medicare levy, HECS-HELP and super for FY2025-26.</p>
          <div className="mt-5 rounded-xl border-l-4 border-eucalyptus-dark bg-white/80 p-4 shadow-sm">
            <p className="text-sm text-navy"><strong>Quick answer:</strong> a gross annual salary of <strong>$80,000</strong> in Australia for FY2025-26 delivers approximately <strong>$63,933 in annual take-home pay</strong> ($14,367 income tax + $1,600 Medicare levy). At <strong>$100,000</strong> the figure is roughly <strong>$76,633</strong>; at <strong>$120,000</strong> it is approximately <strong>$89,533</strong>. Use the calculator below to enter your exact yearly salary.</p>
          </div>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-navy mb-6 text-center" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Calculate Your Annual Take-Home Pay</h2>
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-warmgray mb-1">Gross Annual Salary</label>
                    <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="salary" min={0} max={500000} step={1000} value={salary}
                        onChange={(e) => setSalary(clamp(Number(e.target.value || 0), 0, 500000))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <input type="range" min={0} max={300000} step={5000} value={clamp(salary, 0, 300000)}
                      onChange={(e) => setSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" />
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" checked={includeHECS} onChange={(e) => setIncludeHECS(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-eucalyptus-dark" />
                    <span className="text-warmgray">Include HECS-HELP debt</span>
                  </label>
                  <button type="submit" className="w-full bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 rounded-lg shadow-md transition-all">Calculate Annual Pay</button>
                </form>

                <Card className="bg-sandstone border-eucalyptus-dark/20 border-2 shadow-sm" role="region" aria-live="polite">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-navy mb-4">Your Annual Breakdown</h3>
                    <div className="space-y-2.5 text-sm">
                      <Row label="Gross Annual Pay" value={formatAUD(salary)} bold />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Income Tax" value={`-${formatAUD(result.netIncomeTax)}`} />
                      {result.litoOffset > 0 && <Row label="LITO Offset" value={`+${formatAUD(result.litoOffset)}`} sub />}
                      <Row label="Medicare Levy" value={`-${formatAUD(result.medicareLevy)}`} />
                      {result.medicareSurcharge > 0 && <Row label="Medicare Surcharge" value={`-${formatAUD(result.medicareSurcharge)}`} />}
                      {includeHECS && <Row label="HECS Repayment" value={`-${formatAUD(result.hecsRepayment)}`} />}
                      <div className="border-t border-sandstone-dark/20" />
                      <div className="flex justify-between items-baseline pt-2 pb-2">
                        <span className="font-bold text-navy">Annual Take-Home</span>
                        <span className="text-3xl font-extrabold text-eucalyptus-dark">{formatAUD(result.takeHomePay)}</span>
                      </div>
                      <div className="border-t border-sandstone-dark/20 pt-2 text-xs">
                        <Row label={`Super (${formatPercent(SUPER_GUARANTEE.rate, 0)} - employer paid)`} value={`+${formatAUD(result.superContribution)}`} sub />
                        <Row label="Total Package" value={formatAUD(result.totalPackage)} bold />
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

          {/* --- HOW IS ANNUAL PAY CALCULATED --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Annual Pay Calculated in Australia?</h2>
            <p className="text-warmgray mb-4">
              Annual pay is calculated by subtracting income tax, Medicare levy, and any HECS-HELP repayments from your gross yearly salary for the Australian financial year running 1 July to 30 June. This annual salary calculator gives you a single yearly figure — if you need a per-cycle breakdown instead, use our <Link href="/fortnightly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Fortnightly Pay Calculator</Link>, <Link href="/monthly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Monthly Pay Calculator</Link>, or <Link href="/weekly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Weekly Pay Calculator</Link>. For a full per-payslip view, use the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link>.
            </p>
            <p className="text-warmgray mb-4">
              The Australian tax calculator applies the FY2025-26 income tax brackets progressively. The first <strong>$18,200</strong> of assessable income is tax-free. Each dollar above that threshold is taxed at the marginal rate for its bracket, ranging from <strong>16%</strong> up to <strong>45%</strong> on income above <strong>$190,000</strong>.
            </p>

            <h3 className="text-xl font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Step-by-Step Annual Pay Calculation</h3>
            <p className="text-warmgray mb-3">
              A worked example at <strong>$85,000</strong> gross annual salary illustrates the full calculation for FY2025-26:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-warmgray">
              <li><strong>Start with gross salary:</strong> $85,000 per year.</li>
              <li><strong>Calculate income tax:</strong> $0 on the first $18,200, then 16% on $18,201 to $45,000, 30% on $45,001 to $85,000. Total income tax is approximately <strong>$16,467</strong>.</li>
              <li><strong>Apply the LITO offset:</strong> The &quot;Low Income Tax Offset&quot; reduces your tax by up to $700 for incomes under $66,668. At $85,000, the LITO is <strong>$0</strong>.</li>
              <li><strong>Add the Medicare levy:</strong> A flat <strong>2%</strong> on taxable income = <strong>$1,700</strong>.</li>
              <li><strong>Subtract HECS-HELP (if applicable):</strong> At $85,000, the repayment rate is <strong>5%</strong>, which adds a deduction of <strong>$4,250</strong>.</li>
              <li><strong>Calculate take-home pay:</strong> $85,000 &minus; $16,467 &minus; $1,700 = <strong>$66,833</strong> per year (without HECS).</li>
            </ol>
            <p className="text-warmgray mt-4">
              Superannuation of <strong>{formatPercent(SUPER_GUARANTEE.rate, 0)}</strong> is paid by your employer on top of your gross salary. Use our <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to see the exact employer contribution amount.
            </p>
          </section>

          {/* --- ANNUAL PAY TABLE BY HOURLY RATE --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Annual Pay for Each Hourly Rate?</h2>
            <p className="text-warmgray mb-4">
              Annual pay for a standard 38-hour week equals the hourly rate multiplied by <strong>1,976 hours</strong> (38 hours x 52 weeks). The table below converts common hourly rates to annual gross salary and estimated take-home pay after tax for FY2025-26.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-warmgray">Hourly Rate</th>
                    <th className="px-4 py-3 text-right font-semibold text-warmgray">Annual Gross</th>
                    <th className="px-4 py-3 text-right font-semibold text-warmgray">Total Tax + Medicare</th>
                    <th className="px-4 py-3 text-right font-semibold text-warmgray">Annual Take-Home</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <HourlyToAnnualRow hourlyRate={25} />
                  <HourlyToAnnualRow hourlyRate={30} />
                  <HourlyToAnnualRow hourlyRate={35} />
                  <HourlyToAnnualRow hourlyRate={40} />
                  <HourlyToAnnualRow hourlyRate={50} />
                  <HourlyToAnnualRow hourlyRate={60} />
                  <HourlyToAnnualRow hourlyRate={75} />
                  <HourlyToAnnualRow hourlyRate={100} />
                </tbody>
              </table>
            </div>
            <p className="text-warmgray text-sm mt-3">
              For a precise conversion, use our <Link href="/hourly-to-annual-salary-calculator/" className="text-eucalyptus-dark hover:underline">Hourly to Annual Salary Calculator</Link> which accounts for overtime, penalty rates, and varying work hours.
            </p>
          </section>

          {/* --- WHO USES THIS CALCULATOR --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Uses This Annual Pay Calculator?</h2>
            <p className="text-warmgray mb-4">
              Full-time employees, part-time workers converting to annual figures, and job seekers comparing salary offers all use this Australian tax calculator to determine their yearly take-home pay.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-warmgray">
              <li><strong>Salaried employees</strong> verifying their annual net pay after tax matches their payslips across 26 fortnightly or 12 monthly pay cycles.</li>
              <li><strong>Job seekers</strong> comparing two or more salary offers by converting each to after-tax income and total package value including superannuation.</li>
              <li><strong>HR professionals and payroll managers</strong> running annual salary projections for staff budgeting, hiring forecasts, and remuneration benchmarking.</li>
              <li><strong>Freelancers and contractors</strong> estimating the equivalent annual salary they need to match an employee&apos;s take-home pay, accounting for the absence of employer-paid super and leave entitlements.</li>
              <li><strong>Tax return preparers</strong> cross-checking PAYG withholding summaries against estimated annual taxation before lodging with the ATO.</li>
            </ul>
            <p className="text-warmgray mt-4">
              Contractors comparing employee-equivalent salaries can also use the <Link href="/contractor-vs-employee-calculator/" className="text-eucalyptus-dark hover:underline">Contractor vs Employee Calculator</Link> for a side-by-side breakdown.
            </p>
          </section>

          {/* --- ANNUAL PAY VS TAKE-HOME PAY --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Difference Between Annual Pay and Take-Home Pay?</h2>
            <p className="text-warmgray mb-4">
              Annual pay (gross salary) is the total amount your employer pays you before any deductions, while take-home pay (net pay after tax) is the amount deposited into your bank account after income tax, Medicare levy, and other withholdings.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-warmgray">Gross Annual Salary</th>
                    <th className="px-4 py-3 text-right font-semibold text-warmgray">Income Tax</th>
                    <th className="px-4 py-3 text-right font-semibold text-warmgray">Medicare Levy</th>
                    <th className="px-4 py-3 text-right font-semibold text-warmgray">Take-Home Pay</th>
                    <th className="px-4 py-3 text-right font-semibold text-warmgray">Effective Tax Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <GrossVsNetRow salary={50000} />
                  <GrossVsNetRow salary={75000} />
                  <GrossVsNetRow salary={100000} />
                  <GrossVsNetRow salary={120000} />
                  <GrossVsNetRow salary={150000} />
                  <GrossVsNetRow salary={200000} />
                </tbody>
              </table>
            </div>
            <p className="text-warmgray mt-4">
              The effective tax rate rises from <strong>6.5%</strong> at $50,000 to approximately <strong>30%</strong> at $200,000 because Australia uses progressive income tax brackets. For a detailed view of each bracket, visit our <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">Australian Tax Brackets</Link> guide. To see your after-tax income on a per-pay-cycle basis, use the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link>.
            </p>
          </section>

          {/* --- WHAT CHANGED IN FY2025-26 --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed for Annual Pay in FY2025-26?</h2>
            <p className="text-warmgray mb-4">
              The Stage 3 tax cuts, revised from 1 July 2024, continue to apply in FY2025-26, delivering lower marginal rates across most income tax brackets and increasing after-tax income for every taxpayer earning above <strong>$18,200</strong>.
            </p>

            <h3 className="text-xl font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>FY2025-26 Income Tax Brackets</h3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-warmgray">Taxable Income</th>
                    <th className="px-4 py-3 text-right font-semibold text-warmgray">Marginal Rate</th>
                    <th className="px-4 py-3 text-right font-semibold text-warmgray">Tax on This Bracket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">$0 &ndash; $18,200</td>
                    <td className="px-4 py-3 text-right text-warmgray">0%</td>
                    <td className="px-4 py-3 text-right text-warmgray">$0</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">$18,201 &ndash; $45,000</td>
                    <td className="px-4 py-3 text-right text-warmgray">16%</td>
                    <td className="px-4 py-3 text-right text-warmgray">$4,288</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">$45,001 &ndash; $135,000</td>
                    <td className="px-4 py-3 text-right text-warmgray">30%</td>
                    <td className="px-4 py-3 text-right text-warmgray">$27,000</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">$135,001 &ndash; $190,000</td>
                    <td className="px-4 py-3 text-right text-warmgray">37%</td>
                    <td className="px-4 py-3 text-right text-warmgray">$20,350</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">$190,001+</td>
                    <td className="px-4 py-3 text-right text-warmgray">45%</td>
                    <td className="px-4 py-3 text-right text-warmgray">Uncapped</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray mt-4">
              The superannuation guarantee rate remains at <strong>{formatPercent(SUPER_GUARANTEE.rate, 0)}</strong> for FY2025-26, scheduled to increase to <strong>12.5%</strong> on 1 July 2026. The Medicare levy stays at a flat <strong>2%</strong> of taxable income. HECS-HELP repayment thresholds start at <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong>, with indexation now capped at the lower of CPI or the Wage Price Index.
            </p>
          </section>

          {/* --- COMMON MISTAKES --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Most Common Annual Pay Calculation Mistakes?</h2>
            <p className="text-warmgray mb-4">
              The most common mistake is confusing gross annual salary with total package, which inflates the expected take-home pay by the value of superannuation.
            </p>
            <ol className="list-decimal pl-5 space-y-3 text-warmgray">
              <li><strong>Including super in gross salary.</strong> Your total remuneration package includes employer super contributions, but your taxable income is calculated on the base salary alone. A $110,000 package with {formatPercent(SUPER_GUARANTEE.rate, 0)} super means the base salary is approximately <strong>$98,214</strong>, not $110,000.</li>
              <li><strong>Applying the top tax rate to the entire income.</strong> Australia uses marginal taxation, not a flat rate. At $100,000, the effective tax rate is approximately <strong>23%</strong>, not the 30% marginal rate that applies only to the portion between $45,001 and $135,000.</li>
              <li><strong>Forgetting the Medicare levy.</strong> The <strong>2%</strong> Medicare levy adds $1,000 in deductions for every $50,000 of taxable income. This is separate from income tax and is not optional for most Australian residents.</li>
              <li><strong>Ignoring the LITO offset.</strong> Taxpayers earning under <strong>$66,668</strong> receive the &quot;Low Income Tax Offset&quot; of up to $700, which reduces total tax owed. Omitting this offset overstates the annual tax calculation.</li>
              <li><strong>Using calendar-year figures instead of financial-year figures.</strong> The Australian financial year runs from 1 July to 30 June. Tax brackets, super rates, and HECS thresholds all reset at 1 July, not 1 January.</li>
            </ol>
          </section>

          {/* --- ANNUAL PAY AT DIFFERENT SALARY LEVELS (existing table) --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much Is Annual Take-Home Pay at Different Salary Levels?</h2>
            <p className="text-warmgray mb-4">
              Annual take-home pay ranges from <strong>$46,067</strong> at a $50,000 salary to approximately <strong>$126,668</strong> at $180,000, reflecting Australia&apos;s progressive tax system for FY2025-26.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-warmgray">Annual Salary</th>
                    <th className="px-4 py-3 text-right font-semibold text-warmgray">Gross Monthly</th>
                    <th className="px-4 py-3 text-right font-semibold text-warmgray">Total Annual Tax</th>
                    <th className="px-4 py-3 text-right font-semibold text-warmgray">Annual Take-Home</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <ComparisonRow salary={50000} />
                  <ComparisonRow salary={70000} />
                  <ComparisonRow salary={90000} />
                  <ComparisonRow salary={110000} />
                  <ComparisonRow salary={140000} />
                  <ComparisonRow salary={180000} />
                </tbody>
              </table>
            </div>
          </section>

          {/* --- EXPLORE OTHER FREQUENCIES --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Which Related Calculators Should You Use?</h2>
            <p className="text-warmgray mb-4">
              This annual pay calculator provides the full-year view. For per-cycle breakdowns, tax-specific tools, and salary comparison calculators, use the related tools below.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Link href="/weekly-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-sandstone/50 transition-colors">
                <span className="font-semibold text-navy block">Weekly Pay Calculator</span>
                <span className="text-sm text-warmgray-light">See your take-home pay per week</span>
              </Link>
              <Link href="/fortnightly-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-sandstone/50 transition-colors">
                <span className="font-semibold text-navy block">Fortnightly Pay Calculator</span>
                <span className="text-sm text-warmgray-light">Match your standard pay cycle</span>
              </Link>
              <Link href="/monthly-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-sandstone/50 transition-colors">
                <span className="font-semibold text-navy block">Monthly Pay Calculator</span>
                <span className="text-sm text-warmgray-light">Budget on a monthly basis</span>
              </Link>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-warmgray">
              <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> &mdash; view a detailed tax-only breakdown across all brackets and offsets.</li>
              <li><Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> &mdash; model concessional contributions to reduce your taxable income and increase your super balance.</li>
              <li><Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> &mdash; calculate your compulsory repayment amount based on your repayment income.</li>
              <li><Link href="/gross-pay-calculator/" className="text-eucalyptus-dark hover:underline">Gross Pay Calculator</Link> &mdash; reverse-calculate the gross salary required to achieve a target after-tax income.</li>
            </ul>
          </section>

          {/* --- CONTEXT BORDER --- */}

          <MethodologyDisclosure>
            <p>Calculations show an entire financial year&apos;s snapshot. If your income fluctuates, your total tax return may differ from a standard full-year projection. Based on standard PAYG estimates.</p>
          </MethodologyDisclosure>

          {/* --- EXPANDED FAQs --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <FAQItem value="how" question="How is annual pay calculated in Australia?">
                Annual take-home pay equals your gross yearly salary minus income tax, the 2% Medicare levy, and any HECS-HELP repayments for the financial year running 1 July to 30 June. The ATO applies progressive income tax brackets, meaning only the portion of income within each bracket is taxed at that bracket&apos;s marginal rate.
              </FAQItem>
              <FAQItem value="super" question="Does my annual pay include superannuation?">
                No. Your gross annual salary represents your &quot;Ordinary Time Earnings&quot; (OTE). Your employer pays an additional {formatPercent(SUPER_GUARANTEE.rate, 0)} superannuation guarantee on top of this into your nominated super fund. The total of gross salary plus super equals your total remuneration package.
              </FAQItem>
              <FAQItem value="return" question="Why does my annual pay differ from my tax return?">
                Your tax return includes work-related deductions, investment income, bank interest, rental income, and other assessable income sources. This calculator estimates standard PAYG withholding on salary income only. The ATO reconciles all income and deductions when you lodge your annual return.
              </FAQItem>
              <FAQItem value="average" question="What is the average annual salary in Australia?">
                The average full-time ordinary time earnings in Australia are approximately <strong>$100,000</strong> per year (ABS, late 2024). The median salary is closer to <strong>$75,000&ndash;$80,000</strong>, which better represents the typical Australian worker. At the median of $78,000, annual take-home pay is approximately <strong>$63,400</strong>.
              </FAQItem>
              <FAQItem value="part-year" question="How is tax calculated if I only worked part of the year?">
                The PAYG system withholds tax as if you earn that same salary for the full 12 months. Starting or leaving a job mid-year typically results in over-withholding. The ATO recalculates your actual tax based on your total income for the year when you lodge your return and refunds any excess.
              </FAQItem>
              <FAQItem value="package" question="What is the difference between base salary and total package?">
                Base salary is your gross annual pay before deductions. Total package (also called &quot;total remuneration&quot;) includes base salary plus employer superannuation contributions. A $100,000 base salary with {formatPercent(SUPER_GUARANTEE.rate, 0)} super has a total package of <strong>$112,000</strong>. Some packages also include car allowances, bonuses, and fringe benefits.
              </FAQItem>
              <FAQItem value="hecs-threshold" question="At what annual salary do HECS-HELP repayments start?">
                Compulsory HECS-HELP repayments begin when your repayment income exceeds <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong> for FY2025-26. Repayment income includes taxable income plus any net investment losses, reportable fringe benefits, and reportable super contributions. The minimum repayment rate is <strong>1%</strong>, increasing progressively up to <strong>10%</strong> at higher incomes.
              </FAQItem>
              <FAQItem value="medicare-surcharge" question="Do I pay the Medicare Levy Surcharge on top of the Medicare levy?">
                The &quot;Medicare Levy Surcharge&quot; (MLS) is a separate charge of <strong>1% to 1.5%</strong> applied to individuals earning over $93,000 (or $186,000 for families) who do not hold an eligible private hospital insurance policy. The standard 2% Medicare levy applies to all Australian residents regardless of private health insurance status.
              </FAQItem>
            </Accordion>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
        </div>
      </div>
    </div>
  );
}

/* --- HELPER COMPONENTS --- */

function HourlyToAnnualRow({ hourlyRate }: { hourlyRate: number }) {
  const annualGross = hourlyRate * 38 * 52;
  const result = calculatePayBreakdown({ grossSalary: annualGross, includeHECS: false, hasPrivateHealth: true });
  const totalTax = result.netIncomeTax + result.medicareLevy;

  return (
    <tr>
      <td className="px-4 py-3 text-navy font-medium">{formatAUD(hourlyRate)}/hr</td>
      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(annualGross)}</td>
      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(totalTax)}</td>
      <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">{formatAUD(result.takeHomePay)}</td>
    </tr>
  );
}

function GrossVsNetRow({ salary }: { salary: number }) {
  const result = calculatePayBreakdown({ grossSalary: salary, includeHECS: false, hasPrivateHealth: true });
  const totalTax = result.netIncomeTax + result.medicareLevy;
  const effectiveRate = ((totalTax / salary) * 100).toFixed(1);

  return (
    <tr>
      <td className="px-4 py-3 text-navy font-medium">{formatAUD(salary)}</td>
      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(result.netIncomeTax)}</td>
      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(result.medicareLevy)}</td>
      <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">{formatAUD(result.takeHomePay)}</td>
      <td className="px-4 py-3 text-right text-warmgray">{effectiveRate}%</td>
    </tr>
  );
}

function ComparisonRow({ salary }: { salary: number }) {
  const result = calculatePayBreakdown({ grossSalary: salary, includeHECS: false, hasPrivateHealth: true });
  const totalTax = result.netIncomeTax + result.medicareLevy;

  return (
    <tr>
      <td className="px-4 py-3 text-navy font-medium">{formatAUD(salary)}</td>
      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(salary / 12, 2)}</td>
      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(totalTax)}</td>
      <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">{formatAUD(result.takeHomePay)}</td>
    </tr>
  );
}

function Row({ label, value, bold, sub }: { label: string; value: string; bold?: boolean; sub?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${sub ? "text-warmgray-light text-xs" : ""}`}>
      <span className={bold ? "font-semibold text-navy" : (sub ? "" : "text-warmgray")}>{label}</span>
      <span className={bold ? "font-bold text-navy" : "font-medium text-warmgray"}>{value}</span>
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
