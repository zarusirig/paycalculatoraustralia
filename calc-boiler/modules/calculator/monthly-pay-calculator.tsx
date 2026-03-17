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
  MEDICARE_LEVY,
  TAX_BRACKETS_2025_26,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "PAYG withholding monthly tax table", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-tables-overview", publisher: SOURCES.ato.name },
];

export default function MonthlyPayCalculatorPage() {
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
        <section className="bg-eucalyptus-light/40 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Monthly Pay Calculator</span></li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">Monthly Pay Calculator Australia — Net Salary Per Month</h1>
          <p className="text-lg text-warmgray">Enter your annual salary to see exactly what you take home every month after tax, super, and Medicare. Updated for FY2025-26.</p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-6 text-center">Calculate Your Monthly Take-Home Pay</h2>
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
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" checked={includeHECS} onChange={(e) => setIncludeHECS(e.target.checked)}
                      className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" />
                    <span className="text-navy">Include HECS-HELP debt</span>
                  </label>
                  <button type="submit" className="w-full bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 rounded-lg shadow-md transition-all">Calculate Monthly Pay</button>
                </form>

                <Card className="bg-sandstone border-eucalyptus/30 border-2 shadow-sm" role="region" aria-live="polite">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-navy mb-4">Your Monthly Breakdown</h3>
                    <div className="space-y-2.5 text-sm">
                      <Row label="Gross Monthly Pay" value={formatAUD(salary / 12, 2)} bold />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Income Tax" value={`-${formatAUD(result.netIncomeTax / 12, 2)}`} />
                      <Row label="Medicare Levy" value={`-${formatAUD(result.medicareLevy / 12, 2)}`} />
                      {result.medicareSurcharge > 0 && <Row label="Medicare Surcharge" value={`-${formatAUD(result.medicareSurcharge / 12, 2)}`} />}
                      {includeHECS && <Row label="HECS Repayment" value={`-${formatAUD(result.hecsRepayment / 12, 2)}`} />}
                      <div className="border-t border-sandstone-dark/20" />
                      <div className="flex justify-between items-baseline pt-2 pb-2">
                        <span className="font-bold text-navy">Monthly Take-Home</span>
                        <span className="text-3xl font-extrabold text-eucalyptus-dark">{formatAUD(result.monthly, 2)}</span>
                      </div>
                      <div className="border-t border-sandstone-dark/20 pt-2 text-xs">
                        <Row label="Annual Equivalent" value={formatAUD(result.takeHomePay)} />
                        <Row label={`Super (${formatPercent(SUPER_GUARANTEE.rate, 0)} - employer paid)`} value={`+${formatAUD(result.superContribution / 12, 2)}/mo`} sub />
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

          {/* --- H2: How Is Monthly Pay Calculated? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Is Monthly Pay Calculated in Australia?</h2>
            <p className="text-warmgray mb-4">
              Monthly take-home pay equals your gross annual salary divided by 12, minus PAYG income tax, the Medicare levy, and any HECS-HELP repayments withheld for that month. The Australian Taxation Office publishes a dedicated <strong>PAYG withholding monthly tax table</strong> that employers use to determine the exact amount withheld from each pay cycle in the 2025-26 financial year.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">Step-by-Step Monthly Pay Calculation</h3>
            <ol className="list-decimal pl-5 space-y-2 text-warmgray mb-4">
              <li><strong>Gross monthly pay:</strong> Divide your annual salary by <strong>12</strong>. An {formatAUD(80000)} salary produces a gross monthly figure of <strong>{formatAUD(80000 / 12, 2)}</strong>.</li>
              <li><strong>Income tax:</strong> Apply the FY2025-26 marginal tax rates to your annual income, then divide the annual tax by 12. The first <strong>{formatAUD(18200)}</strong> is tax-free. Income between {formatAUD(18201)} and {formatAUD(45000)} is taxed at <strong>16%</strong>. Income between {formatAUD(45001)} and {formatAUD(135000)} is taxed at <strong>30%</strong>.</li>
              <li><strong>Medicare levy:</strong> Add <strong>{formatPercent(MEDICARE_LEVY.rate, 0)}</strong> of your taxable income, divided by 12.</li>
              <li><strong>HECS-HELP:</strong> If you carry a study debt and earn above <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong>, a marginal repayment is withheld each month.</li>
              <li><strong>Net monthly pay:</strong> Subtract all deductions from your gross monthly figure. The remainder is your after-tax monthly income.</li>
            </ol>
            <p className="text-warmgray mb-4">
              Use our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to see the full annual breakdown before dividing by 12.
            </p>
          </section>

          {/* --- H2: Monthly Pay Table by Annual Salary --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is the Monthly Take-Home Pay at Different Salary Levels?</h2>
            <p className="text-warmgray mb-4">
              Monthly net pay ranges from <strong>{formatAUD(calculatePayBreakdown({ grossSalary: 50000, includeHECS: false, hasPrivateHealth: true }).monthly, 2)}</strong> on a {formatAUD(50000)} salary to <strong>{formatAUD(calculatePayBreakdown({ grossSalary: 180000, includeHECS: false, hasPrivateHealth: true }).monthly, 2)}</strong> on a {formatAUD(180000)} salary. The table below shows gross monthly pay, monthly tax withheld, and net monthly take-home for 6 common Australian salaries in FY2025-26.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Annual Salary</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Gross Monthly</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Monthly Tax</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Monthly Take-Home</th>
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
            <p className="text-warmgray mt-3 text-sm">
              All figures assume an Australian resident for tax purposes, no HECS-HELP debt, and private health insurance held. Superannuation at {formatPercent(SUPER_GUARANTEE.rate, 0)} is employer-paid and not deducted from take-home pay. Use our <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> for a personalised annual result.
            </p>
          </section>

          {/* --- H2: Who Uses This Calculator? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Who Uses a Monthly Pay Calculator?</h2>
            <p className="text-warmgray mb-4">
              Salaried employees paid on a monthly cycle, budgeters aligning expenses with a single monthly deposit, and HR professionals verifying payroll all use this Australian tax calculator. Monthly pay cycles are common in corporate, government, and professional-services roles.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-warmgray">
              <li><strong>Full-time salaried employees</strong> comparing a job offer against current net pay to assess real purchasing power.</li>
              <li><strong>Mortgage applicants</strong> who need to verify their net monthly income when lenders assess serviceability.</li>
              <li><strong>Budget planners</strong> matching rent, utilities, groceries, and loan repayments against a single monthly deposit.</li>
              <li><strong>Payroll officers</strong> cross-checking PAYG withholding amounts against the ATO monthly tax table.</li>
              <li><strong>Expatriates and new migrants</strong> estimating Australian take-home pay before relocating.</li>
            </ul>
          </section>

          {/* --- H2: Monthly vs Fortnightly vs Weekly Pay --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Does Monthly Pay Compare to Fortnightly and Weekly Pay?</h2>
            <p className="text-warmgray mb-4">
              Monthly pay delivers <strong>12 payments</strong> per year, fortnightly pay delivers <strong>26 payments</strong>, and weekly pay delivers <strong>52 payments</strong>. The annual take-home total is identical regardless of frequency, but the per-period amount and cash-flow timing differ. The table below illustrates each cycle for an {formatAUD(80000)} salary.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Pay Frequency</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Payments Per Year</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Gross Per Period</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Net Per Period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Weekly</td>
                    <td className="px-4 py-3 text-right text-warmgray">52</td>
                    <td className="px-4 py-3 text-right text-warmgray">{formatAUD(80000 / 52, 2)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">{formatAUD(result.weekly, 2)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Fortnightly</td>
                    <td className="px-4 py-3 text-right text-warmgray">26</td>
                    <td className="px-4 py-3 text-right text-warmgray">{formatAUD(80000 / 26, 2)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">{formatAUD(result.fortnightly, 2)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Monthly</td>
                    <td className="px-4 py-3 text-right text-warmgray">12</td>
                    <td className="px-4 py-3 text-right text-warmgray">{formatAUD(80000 / 12, 2)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">{formatAUD(result.monthly, 2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">
              Fortnightly pay produces 2 &quot;extra&quot; payments per year compared to a monthly cycle. Employees paid fortnightly receive 26 deposits, which equates to the value of roughly 13 monthly payments across 12 calendar months. Use our <Link href="/fortnightly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Fortnightly Pay Calculator</Link> or <Link href="/weekly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Weekly Pay Calculator</Link> to view those breakdowns.
            </p>
          </section>

          {/* --- H2: What Deductions Apply Monthly? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Deductions Apply to Monthly Pay?</h2>
            <p className="text-warmgray mb-4">
              Four deductions reduce monthly gross pay to net pay: PAYG income tax, the Medicare levy, the &quot;Medicare Levy Surcharge&quot; (if applicable), and HECS-HELP repayments. Superannuation is paid by the employer on top of salary and does not reduce your take-home pay.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">FY2025-26 Income Tax Brackets</h3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Taxable Income</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Marginal Rate</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Tax on This Bracket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {TAX_BRACKETS_2025_26.map((bracket, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 text-navy font-medium">
                        {bracket.max === Infinity
                          ? `${formatAUD(bracket.min)}+`
                          : `${formatAUD(bracket.min)} – ${formatAUD(bracket.max)}`}
                      </td>
                      <td className="px-4 py-3 text-right text-warmgray">{formatPercent(bracket.rate, 0)}</td>
                      <td className="px-4 py-3 text-right text-warmgray">{bracket.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">Medicare Levy and Surcharge</h3>
            <p className="text-warmgray mb-4">
              The standard Medicare levy is <strong>{formatPercent(MEDICARE_LEVY.rate, 0)}</strong> of taxable income for all residents earning above {formatAUD(MEDICARE_LEVY.lowIncomeThreshold)}. Taxpayers without private hospital cover who earn above {formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)} also pay the &quot;Medicare Levy Surcharge&quot; at rates between <strong>{formatPercent(MEDICARE_LEVY.surcharge.tier1.rate, 0)}</strong> and <strong>{formatPercent(MEDICARE_LEVY.surcharge.tier3.rate, 1)}</strong>. Use our <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to see how your employer SG rate of {formatPercent(SUPER_GUARANTEE.rate, 0)} adds to your total remuneration package.
            </p>
          </section>

          {/* --- H2: Common Mistakes --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Are Common Monthly Pay Calculation Mistakes?</h2>
            <p className="text-warmgray mb-4">
              The most frequent error is dividing an annual salary by 52 then multiplying by 4, which produces a 4-week figure, not a calendar-month figure. Dividing by 12 is the only correct method for monthly pay.
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-warmgray">
              <li><strong>Using 4 weeks instead of 1/12:</strong> Four weeks equals <strong>28 days</strong>. A calendar month averages <strong>30.44 days</strong>. Dividing annual pay by 13 (52/4) instead of 12 understates monthly income by approximately 7.7%.</li>
              <li><strong>Deducting super from take-home:</strong> The employer superannuation guarantee of {formatPercent(SUPER_GUARANTEE.rate, 0)} is paid on top of your salary. Subtracting it from gross pay double-counts the deduction and understates your net monthly pay.</li>
              <li><strong>Ignoring LITO:</strong> The &quot;Low Income Tax Offset&quot; reduces tax payable by up to <strong>$700</strong> for incomes under {formatAUD(66667)}. Omitting it overstates monthly tax on salaries between {formatAUD(18200)} and {formatAUD(66667)}.</li>
              <li><strong>Forgetting HECS-HELP:</strong> Employees with a study debt above {formatAUD(HECS_HELP.minimumThreshold)} have a compulsory repayment withheld each pay period. The marginal repayment starts at <strong>15%</strong> of every dollar above the threshold.</li>
              <li><strong>Applying the wrong financial year rates:</strong> The FY2025-26 income tax brackets differ from FY2024-25. The 16% bracket applies up to {formatAUD(45000)}, and the 30% bracket extends to {formatAUD(135000)} under the Stage 3 tax cuts.</li>
            </ol>
          </section>

          {/* ===== CONTEXT BORDER ===== */}

          {/* --- H2: Related Calculators --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Related Calculators</h2>
            <p className="text-warmgray mb-4">
              Explore other Australian tax calculators to convert your salary across pay frequencies, estimate deductions, or model salary sacrifice scenarios.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/weekly-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Weekly Pay Calculator</span>
                <span className="text-sm text-warmgray-light">View net pay per week</span>
              </Link>
              <Link href="/fortnightly-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Fortnightly Pay Calculator</span>
                <span className="text-sm text-warmgray-light">View net pay per fortnight</span>
              </Link>
              <Link href="/take-home-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Take-Home Pay Calculator</span>
                <span className="text-sm text-warmgray-light">Full annual breakdown</span>
              </Link>
              <Link href="/hourly-to-annual-salary-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Hourly to Annual Salary Calculator</span>
                <span className="text-sm text-warmgray-light">Convert hourly rate to yearly</span>
              </Link>
              <Link href="/salary-sacrifice-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Salary Sacrifice Calculator</span>
                <span className="text-sm text-warmgray-light">Pre-tax vs post-tax comparison</span>
              </Link>
              <Link href="/hecs-help-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">HECS-HELP Calculator</span>
                <span className="text-sm text-warmgray-light">Estimate study loan repayments</span>
              </Link>
            </div>
          </section>

          <MethodologyDisclosure>
            <p>Calculations are based on 12 months per year. We divide the annual figures by 12 to provide the exact monthly equivalent. This guarantees accuracy regardless of how many days are in a specific month.</p>
          </MethodologyDisclosure>

          {/* --- H2: FAQs --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <FAQItem value="how" question="How is monthly pay calculated in Australia?">
                Monthly pay is calculated by dividing your gross annual salary by <strong>12</strong>, then subtracting PAYG income tax, the Medicare levy, and any HECS-HELP repayments. The ATO publishes specific monthly withholding tables that employers apply during the FY2025-26 financial year.
              </FAQItem>
              <FAQItem value="super" question="Is super deducted from my monthly pay?">
                No. Your employer pays superannuation at <strong>{formatPercent(SUPER_GUARANTEE.rate, 0)}</strong> on top of your gross salary. The SG contribution does not reduce your monthly take-home pay. Employers remit super quarterly, within 28 days of each quarter&apos;s end.
              </FAQItem>
              <FAQItem value="days" question="Why is my monthly pay the same every month?">
                Salaried employees receive <strong>1/12 of their annual salary</strong> each month, regardless of whether the month has 28, 30, or 31 days. The calculation divides by 12 calendar months, not by the number of working days.
              </FAQItem>
              <FAQItem value="4weeks" question="Is monthly pay the same as 4 weeks' pay?">
                No. Four weeks equals <strong>28 days</strong>, but an average calendar month has <strong>30.44 days</strong>. Monthly gross pay is annual salary divided by 12, which is approximately 8.3% higher than 4 weeks&apos; pay (annual divided by 13).
              </FAQItem>
              <FAQItem value="hecs" question="How does HECS-HELP affect my monthly take-home?">
                HECS-HELP repayments reduce monthly take-home pay for employees earning above <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong> per year. The FY2025-26 system uses marginal rates starting at <strong>15%</strong> on every dollar above the threshold. Use our <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> to estimate your annual and monthly repayment.
              </FAQItem>
              <FAQItem value="mortgage" question="Should I align my mortgage repayments with my monthly pay?">
                Matching mortgage repayments to your pay cycle simplifies cash flow management. Employees paid monthly benefit from a single monthly mortgage debit. Switching to fortnightly mortgage repayments (even while paid monthly) produces <strong>26 half-payments</strong> — equivalent to 13 full payments per year — which reduces total interest over the life of the loan.
              </FAQItem>
              <FAQItem value="packaging" question="How does salary packaging affect my monthly take-home?">
                Salary packaging reduces your taxable income before PAYG withholding is calculated, resulting in less tax withheld and a higher net monthly deposit. Common packaged items include additional superannuation contributions, novated vehicle leases, and portable electronic devices. Check our <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> for a side-by-side comparison.
              </FAQItem>
              <FAQItem value="tax-return" question="Will I get a tax refund if I'm paid monthly?">
                A tax refund depends on the difference between PAYG tax withheld during the year and your actual tax liability at lodgement. Monthly PAYG withholding uses the ATO&apos;s monthly tax table, which assumes a constant income across all 12 months. Overtime, bonuses, or periods of leave without pay create discrepancies that result in either a refund or a balance owing.
              </FAQItem>
            </Accordion>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({ salary }: { salary: number }) {
  const result = calculatePayBreakdown({ grossSalary: salary, includeHECS: false, hasPrivateHealth: true });
  const monthlyGross = salary / 12;
  const monthlyTax = (result.netIncomeTax + result.medicareLevy) / 12;

  return (
    <tr>
      <td className="px-4 py-3 text-navy font-medium">{formatAUD(salary)}</td>
      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(monthlyGross, 2)}</td>
      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(monthlyTax, 2)}</td>
      <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">{formatAUD(result.monthly, 2)}</td>
    </tr>
  );
}

function Row({ label, value, bold, sub }: { label: string; value: string; bold?: boolean; sub?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${sub ? "text-warmgray-light text-xs" : ""}`}>
      <span className={bold ? "font-semibold text-navy" : (sub ? "" : "text-warmgray")}>{label}</span>
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
