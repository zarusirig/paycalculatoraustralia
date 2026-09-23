"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FaqAccordion from "@/components/common/faq-accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
  SUPER_GUARANTEE,
  HECS_HELP,
  LITO,
  SOURCES,
  SITE_CONFIG,
  TAX_BRACKETS,
  TAX_BRACKETS_2025_26,
} from "@/lib/constants";
import { ANNUAL_PAY_FAQS } from "@/modules/calculator/annual-pay-calculator-faqs";
import { AmountPresets, HeadTermLinks } from "@/modules/calculator/head-term-ui";

// Every figure in the copy is derived from lib/constants. The page previously
// carried FY2025-26 prose (16% bracket, $63,933 on $80,000, $93,000 MLS
// threshold), an old-system HECS "5% repayment rate" and a claim that SG
// would rise to 12.5% on 1 July 2026 (12% is the legislated ceiling).
const FY = SITE_CONFIG.financialYear;
const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const net = (salary: number) => calculatePayBreakdown({ grossSalary: salary, includeHECS: false, hasPrivateHealth: true });
const effRate = (salary: number) => {
  const r = net(salary);
  return `${(((r.netIncomeTax + r.medicareLevy) / salary) * 100).toFixed(1)}%`;
};
const EX = net(85_000);
const EX_HECS = calculatePayBreakdown({ grossSalary: 85_000, includeHECS: true, hasPrivateHealth: true }).hecsRepayment;
const EX_BRACKET2_TAX = Math.round((TAX_BRACKETS[1].max - TAX_BRACKETS[0].max) * TAX_BRACKETS[1].rate);
const EX_BRACKET3_TAX = Math.round((85_000 - TAX_BRACKETS[1].max) * TAX_BRACKETS[2].rate);

// Hero quick-answer figures from the tax engine (they had frozen at FY2025-26
// values under a FY2026-27 heading).
const QA80 = calculatePayBreakdown({ grossSalary: 80_000, includeHECS: false, hasPrivateHealth: true });
const QA100 = calculatePayBreakdown({ grossSalary: 100_000, includeHECS: false, hasPrivateHealth: true });
const QA120 = calculatePayBreakdown({ grossSalary: 120_000, includeHECS: false, hasPrivateHealth: true });
const SALARY_PRESETS = [50_000, 75_000, 100_000, 150_000] as const;

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
        {/* Compact hero: calculator above the fold (head-term intent map, Sep 2026). */}
        <section className="bg-sandstone rounded-2xl p-5 md:p-8 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Annual Pay Calculator</span></li>
            </ol>
          </nav>
          <h1 className="text-2xl md:text-4xl font-bold text-navy mt-3 mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Annual Salary After Tax Calculator Australia {SITE_CONFIG.financialYear}</h1>
          <p className="text-base md:text-lg text-navy">A gross salary of <strong>$80,000</strong> is <strong>{formatAUD(QA80.takeHomePay)} a year after tax</strong> in FY{SITE_CONFIG.financialYear} ({formatAUD(QA80.netIncomeTax)} income tax + {formatAUD(QA80.medicareLevy)} Medicare levy). At $100,000 it is {formatAUD(QA100.takeHomePay)}; at $120,000, {formatAUD(QA120.takeHomePay)}.</p>
          <p className="text-warmgray mt-2">Enter any yearly salary for your annual take-home pay after income tax, Medicare, HECS-HELP and super.</p>
          <TrustBar className="mt-3" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold text-navy mb-4 text-center" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Calculate Your Salary After Tax</h2>
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
                    <AmountPresets values={SALARY_PRESETS} current={salary} onPick={setSalary} />
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

        <HeadTermLinks className="max-w-4xl mx-auto -mt-6" terms={["salaryCalculator", "afterTaxIncomeCalculator", "incomeTaxCalculator", "weeklyTaxCalculator", "fortnightlyTaxCalculator"]} />

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">

          {/* --- HOW IS ANNUAL PAY CALCULATED --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Annual Pay Calculated in Australia?</h2>
            <p className="text-warmgray mb-4">
              Annual pay is calculated by subtracting income tax, Medicare levy, and any HECS-HELP repayments from your gross yearly salary for the Australian financial year running 1 July to 30 June. This annual salary calculator gives you a single yearly figure — if you need a per-cycle breakdown instead, use our <Link href="/fortnightly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Fortnightly Pay Calculator</Link>, <Link href="/monthly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Monthly Pay Calculator</Link>, or <Link href="/weekly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Weekly Pay Calculator</Link>. For a full per-payslip view, use the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link>.
            </p>
            <p className="text-warmgray mb-4">
              The Australian tax calculator applies the FY{FY} income tax brackets progressively. The first <strong>$18,200</strong> of assessable income is tax-free. Each dollar above that threshold is taxed at the marginal rate for its bracket, ranging from <strong>{pct(TAX_BRACKETS[1].rate)}</strong> up to <strong>{pct(TAX_BRACKETS[4].rate)}</strong> on income above <strong>{formatAUD(TAX_BRACKETS[4].min - 1)}</strong>.
            </p>

            <h3 className="text-xl font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Step-by-Step Annual Pay Calculation</h3>
            <p className="text-warmgray mb-3">
              A worked example at <strong>$85,000</strong> gross annual salary illustrates the full calculation for FY{FY}:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-warmgray">
              <li><strong>Start with gross salary:</strong> $85,000 per year.</li>
              <li><strong>Calculate income tax:</strong> $0 on the first $18,200, then {pct(TAX_BRACKETS[1].rate)} on $18,201 to $45,000 ({formatAUD(EX_BRACKET2_TAX)}), {pct(TAX_BRACKETS[2].rate)} on $45,001 to $85,000 ({formatAUD(EX_BRACKET3_TAX)}). Total income tax is <strong>{formatAUD(EX.incomeTax)}</strong>.</li>
              <li><strong>Apply the LITO offset:</strong> The &quot;Low Income Tax Offset&quot; reduces your tax by up to {formatAUD(LITO.maxOffset)} and phases out completely at {formatAUD(LITO.nilOffsetIncome)}. At $85,000, the LITO is <strong>$0</strong>.</li>
              <li><strong>Add the Medicare levy:</strong> A flat <strong>2%</strong> on taxable income = <strong>{formatAUD(EX.medicareLevy)}</strong>.</li>
              <li><strong>Subtract HECS-HELP (if applicable):</strong> Under the marginal system, only income above {formatAUD(HECS_HELP.minimumThreshold)} is counted: {pct(HECS_HELP.bands[1].marginalRate)} of the excess at $85,000 adds a deduction of <strong>{formatAUD(EX_HECS)}</strong>.</li>
              <li><strong>Calculate take-home pay:</strong> $85,000 &minus; {formatAUD(EX.netIncomeTax)} &minus; {formatAUD(EX.medicareLevy)} = <strong>{formatAUD(EX.takeHomePay)}</strong> per year (without HECS).</li>
            </ol>
            <p className="text-warmgray mt-4">
              Superannuation of <strong>{formatPercent(SUPER_GUARANTEE.rate, 0)}</strong> is paid by your employer on top of your gross salary. Use our <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to see the exact employer contribution amount.
            </p>
          </section>

          {/* --- ANNUAL PAY TABLE BY HOURLY RATE --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Annual Pay for Each Hourly Rate?</h2>
            <p className="text-warmgray mb-4">
              Annual pay for a standard 38-hour week equals the hourly rate multiplied by <strong>1,976 hours</strong> (38 hours x 52 weeks). The table below converts common hourly rates to annual gross salary and estimated take-home pay after tax for FY{FY}.
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
              The effective tax rate (income tax plus Medicare levy) rises from <strong>{effRate(50_000)}</strong> at $50,000 to <strong>{effRate(200_000)}</strong> at $200,000 because Australia uses progressive income tax brackets. For a detailed view of each bracket, visit our <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">Australian Tax Brackets</Link> guide. To see your after-tax income on a per-pay-cycle basis, use the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link>.
            </p>
          </section>

          {/* --- WHAT CHANGED THIS FINANCIAL YEAR --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed for Annual Pay in FY{FY}?</h2>
            <p className="text-warmgray mb-4">
              From 1 July 2026 the second tax rate fell from <strong>{pct(TAX_BRACKETS_2025_26[1].rate)}</strong> to <strong>{pct(TAX_BRACKETS[1].rate)}</strong> on income between $18,201 and $45,000, on top of the Stage 3 changes from 1 July 2024. Every resident taxpayer earning above <strong>$45,000</strong> saves <strong>{formatAUD(TAX_BRACKETS_2025_26[2].base - TAX_BRACKETS[2].base)}</strong> a year compared with FY{SITE_CONFIG.previousFinancialYear}.
            </p>

            <h3 className="text-xl font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>FY{FY} Income Tax Brackets</h3>
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
                  {TAX_BRACKETS.map((b) => (
                    <tr key={b.min}>
                      <td className="px-4 py-3 text-navy font-medium">
                        {b.max === Infinity ? `${formatAUD(b.min)}+` : <>{formatAUD(b.min)} &ndash; {formatAUD(b.max)}</>}
                      </td>
                      <td className="px-4 py-3 text-right text-warmgray">{pct(b.rate)}</td>
                      <td className="px-4 py-3 text-right text-warmgray">
                        {b.max === Infinity ? "Uncapped" : formatAUD(Math.round((b.max - Math.max(b.min - 1, 0)) * b.rate))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-warmgray mt-4">
              The superannuation guarantee rate stays at <strong>{formatPercent(SUPER_GUARANTEE.rate, 0)}</strong> for FY{FY} &mdash; the legislated ceiling, with no further scheduled increase &mdash; and since {SUPER_GUARANTEE.paydaySuperStart} employers must pay it each payday (Payday Super). The Medicare levy stays at a flat <strong>2%</strong> of taxable income. HECS-HELP repayment thresholds start at <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong>, with indexation now capped at the lower of CPI or the Wage Price Index.
            </p>
          </section>

          {/* --- COMMON MISTAKES --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Most Common Annual Pay Calculation Mistakes?</h2>
            <p className="text-warmgray mb-4">
              The most common mistake is confusing gross annual salary with total package, which inflates the expected take-home pay by the value of superannuation.
            </p>
            <ol className="list-decimal pl-5 space-y-3 text-warmgray">
              <li><strong>Including super in gross salary.</strong> Your total remuneration package includes employer super contributions, but your taxable income is calculated on the base salary alone. A $110,000 package with {formatPercent(SUPER_GUARANTEE.rate, 0)} super means the base salary is approximately <strong>{formatAUD(Math.round(110_000 / (1 + SUPER_GUARANTEE.rate)))}</strong>, not $110,000.</li>
              <li><strong>Applying the top tax rate to the entire income.</strong> Australia uses marginal taxation, not a flat rate. At $100,000, the effective rate of income tax plus the Medicare levy is <strong>{effRate(100_000)}</strong>, not the 30% marginal rate that applies only to the portion between $45,001 and $135,000.</li>
              <li><strong>Forgetting the Medicare levy.</strong> The <strong>2%</strong> Medicare levy adds $1,000 in deductions for every $50,000 of taxable income. This is separate from income tax and is not optional for most Australian residents.</li>
              <li><strong>Ignoring the LITO offset.</strong> Taxpayers earning up to <strong>{formatAUD(LITO.nilOffsetIncome)}</strong> receive the &quot;Low Income Tax Offset&quot; of up to {formatAUD(LITO.maxOffset)}, which reduces total tax owed. Omitting this offset overstates the annual tax calculation.</li>
              <li><strong>Using calendar-year figures instead of financial-year figures.</strong> The Australian financial year runs from 1 July to 30 June. Tax brackets, super rates, and HECS thresholds all reset at 1 July, not 1 January.</li>
            </ol>
          </section>

          {/* --- ANNUAL PAY AT DIFFERENT SALARY LEVELS (existing table) --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much Is Annual Take-Home Pay at Different Salary Levels?</h2>
            <p className="text-warmgray mb-4">
              Annual take-home pay ranges from <strong>{formatAUD(net(50_000).takeHomePay)}</strong> at a $50,000 salary to <strong>{formatAUD(net(180_000).takeHomePay)}</strong> at $180,000, reflecting Australia&apos;s progressive tax system for FY{FY}.
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
            <FaqAccordion faqs={ANNUAL_PAY_FAQS} className="space-y-3" itemClassName="rounded-xl border border-sandstone-dark/20 px-5" triggerClassName="text-left text-base font-medium text-navy" contentClassName="text-warmgray leading-relaxed" />
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
