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
  TAX_BRACKETS,
  MEDICARE_LEVY,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "PAYG withholding fortnightly tax table", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-tables-overview", publisher: SOURCES.ato.name },
];

export default function FortnightlyPayCalculatorPage() {
  const [salary, setSalary] = useState(80_000);
  const [includeHECS, setIncludeHECS] = useState(false);

  const result = useMemo(
    () => calculatePayBreakdown({ grossSalary: salary, includeHECS, hasPrivateHealth: true }),
    [salary, includeHECS]
  );

  const workedExample = useMemo(
    () => calculatePayBreakdown({ grossSalary: 85_000, includeHECS: false, hasPrivateHealth: true }),
    []
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
              <li><span className="font-medium text-navy" aria-current="page">Fortnightly Pay Calculator</span></li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">Fortnightly Pay Calculator Australia 2025-26</h1>
          <p className="text-lg text-warmgray">
            Convert any salary or hourly rate to your fortnightly take-home pay. See exact tax, super, and the net amount paid every 2 weeks using FY2025-26 Australian rates.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-6 text-center">Calculate Your Fortnightly Take-Home Pay</h2>
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
                  <button type="submit" className="w-full bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 rounded-lg shadow-md transition-all">Calculate Fortnightly Pay</button>
                </form>

                <Card className="bg-sandstone border-eucalyptus/30 border-2 shadow-sm" role="region" aria-live="polite">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-navy mb-4">Your Fortnightly Breakdown</h3>
                    <div className="space-y-2.5 text-sm">
                      <Row label="Gross Fortnightly Pay" value={formatAUD(salary / 26, 2)} bold />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Income Tax" value={`-${formatAUD(result.netIncomeTax / 26, 2)}`} />
                      <Row label="Medicare Levy" value={`-${formatAUD(result.medicareLevy / 26, 2)}`} />
                      {result.medicareSurcharge > 0 && <Row label="Medicare Surcharge" value={`-${formatAUD(result.medicareSurcharge / 26, 2)}`} />}
                      {includeHECS && <Row label="HECS Repayment" value={`-${formatAUD(result.hecsRepayment / 26, 2)}`} />}
                      <div className="border-t border-sandstone-dark/20" />
                      <div className="flex justify-between items-baseline pt-2 pb-2">
                        <span className="font-bold text-navy">Fortnightly Take-Home</span>
                        <span className="text-3xl font-extrabold text-eucalyptus-dark">{formatAUD(result.fortnightly, 2)}</span>
                      </div>
                      <div className="border-t border-sandstone-dark/20 pt-2 text-xs">
                        <Row label="Annual Equivalent" value={formatAUD(result.takeHomePay)} />
                        <Row label={`Super (${formatPercent(SUPER_GUARANTEE.rate, 0)} - employer paid)`} value={`+${formatAUD(result.superContribution / 26, 2)}/fn`} sub />
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

          {/* --- HOW IS FORTNIGHTLY PAY CALCULATED? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Is Fortnightly Pay Calculated?</h2>
            <p className="text-warmgray mb-4">
              Fortnightly pay is calculated by dividing your gross annual salary by <strong>26</strong>, then subtracting PAYG tax, the Medicare levy, and any HECS-HELP repayments from each fortnightly amount.
            </p>
            <p className="text-warmgray mb-4">
              The Australian Taxation Office publishes a dedicated PAYG withholding <Link href="/fortnightly-tax-table/" className="text-eucalyptus-dark hover:underline">fortnightly tax table</Link> that employers use to determine the exact tax withheld from each pay. This table accounts for the {TAX_BRACKETS.length} income tax brackets for FY2026-27, the {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy, and the &quot;Low Income Tax Offset&quot; (LITO). Your employer divides your estimated annual taxation liability across 26 fortnights so the correct amount reaches the ATO throughout the year.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">Worked Example: $85,000 Salary</h3>
            <p className="text-warmgray mb-4">
              An employee earning <strong>$85,000</strong> per year receives a gross fortnightly pay of <strong>{formatAUD(85_000 / 26, 2)}</strong>. The calculation follows 4 steps:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-warmgray mb-4">
              <li><strong>Gross fortnightly pay:</strong> $85,000 / 26 = <strong>{formatAUD(85_000 / 26, 2)}</strong></li>
              <li><strong>Income tax per fortnight:</strong> {formatAUD(workedExample.netIncomeTax)} annual tax / 26 = <strong>{formatAUD(workedExample.netIncomeTax / 26, 2)}</strong></li>
              <li><strong>Medicare levy per fortnight:</strong> {formatAUD(workedExample.medicareLevy)} / 26 = <strong>{formatAUD(workedExample.medicareLevy / 26, 2)}</strong></li>
              <li><strong>Fortnightly take-home pay:</strong> {formatAUD(85_000 / 26, 2)} - {formatAUD(workedExample.netIncomeTax / 26, 2)} - {formatAUD(workedExample.medicareLevy / 26, 2)} = <strong>{formatAUD(workedExample.fortnightly, 2)}</strong></li>
            </ol>
            <p className="text-warmgray mb-4">
              The employer also contributes <strong>{formatAUD(workedExample.superContribution / 26, 2)}</strong> in superannuation per fortnight at the {formatPercent(SUPER_GUARANTEE.rate, 0)} SG rate. This amount does not reduce take-home pay. Use our <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to see how employer SG contributions grow over time.
            </p>
          </section>

          {/* --- FORTNIGHTLY PAY TABLE --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is the Fortnightly Pay for Each Annual Salary?</h2>
            <p className="text-warmgray mb-4">
              Fortnightly take-home pay ranges from <strong>{formatAUD(calculatePayBreakdown({ grossSalary: 50_000, includeHECS: false, hasPrivateHealth: true }).fortnightly, 2)}</strong> on a $50,000 salary to <strong>{formatAUD(calculatePayBreakdown({ grossSalary: 200_000, includeHECS: false, hasPrivateHealth: true }).fortnightly, 2)}</strong> on a $200,000 salary after tax and Medicare for FY2025-26.
            </p>
            <p className="text-warmgray mb-4">
              The table below shows fortnightly gross pay, fortnightly tax withheld, and fortnightly after-tax income at 8 common salary levels. All figures assume an Australian resident claiming the tax-free threshold, no HECS-HELP debt, and private health insurance held. Use the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> for a full annual breakdown at your exact salary.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Annual Salary</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Gross Fortnightly</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Fortnightly Tax</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Fortnightly Take-Home</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <ComparisonRow salary={50000} />
                  <ComparisonRow salary={60000} />
                  <ComparisonRow salary={75000} />
                  <ComparisonRow salary={90000} />
                  <ComparisonRow salary={100000} />
                  <ComparisonRow salary={120000} />
                  <ComparisonRow salary={150000} />
                </tbody>
              </table>
            </div>
          </section>

          {/* --- WHO USES THIS CALCULATOR? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Who Uses a Fortnightly Pay Calculator?</h2>
            <p className="text-warmgray mb-4">
              Approximately <strong>45%</strong> of Australian employees receive fortnightly pay, making it the most common pay cycle in the country ahead of monthly and weekly frequencies.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-warmgray mb-4">
              <li><strong>Full-time employees</strong> checking their fortnightly net pay against their payslip to verify PAYG withholding accuracy</li>
              <li><strong>Job seekers</strong> converting an advertised annual salary into a fortnightly take-home figure to assess a new offer</li>
              <li><strong>Part-time workers</strong> estimating their fortnightly income after proportional tax deductions</li>
              <li><strong>Budgeters</strong> aligning fortnightly income with rent, loan repayments, and utility bills that fall on a 2-week cycle</li>
              <li><strong>HR and payroll managers</strong> verifying ATO fortnightly tax table withholding amounts before processing payroll</li>
            </ul>
            <p className="text-warmgray mb-4">
              Employees receiving a job offer that quotes an annual package use this Australian tax calculator to convert gross salary into a fortnightly take-home pay figure. For offers quoting an hourly rate instead, use our <Link href="/hourly-to-annual-salary-calculator/" className="text-eucalyptus-dark hover:underline">Hourly to Annual Salary Calculator</Link> to convert the rate first.
            </p>
          </section>

          {/* --- FORTNIGHTLY VS WEEKLY VS MONTHLY --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Does Fortnightly Pay Compare to Weekly and Monthly Pay?</h2>
            <p className="text-warmgray mb-4">
              Annual take-home pay is identical regardless of pay frequency. The difference is timing: fortnightly pay delivers <strong>26</strong> paychecks per year, weekly pay delivers <strong>52</strong>, and monthly pay delivers <strong>12</strong>.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Feature</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">Weekly</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">Fortnightly</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">Monthly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Pay periods per year</td>
                    <td className="px-4 py-3 text-center text-warmgray">52</td>
                    <td className="px-4 py-3 text-center text-warmgray font-semibold">26</td>
                    <td className="px-4 py-3 text-center text-warmgray">12</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Gross per period ($85K salary)</td>
                    <td className="px-4 py-3 text-center text-warmgray">{formatAUD(85_000 / 52, 2)}</td>
                    <td className="px-4 py-3 text-center text-warmgray font-semibold">{formatAUD(85_000 / 26, 2)}</td>
                    <td className="px-4 py-3 text-center text-warmgray">{formatAUD(85_000 / 12, 2)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Take-home per period ($85K)</td>
                    <td className="px-4 py-3 text-center text-warmgray">{formatAUD(workedExample.weekly, 2)}</td>
                    <td className="px-4 py-3 text-center text-eucalyptus-dark font-semibold">{formatAUD(workedExample.fortnightly, 2)}</td>
                    <td className="px-4 py-3 text-center text-warmgray">{formatAUD(workedExample.monthly, 2)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">&quot;Bonus&quot; pay months per year</td>
                    <td className="px-4 py-3 text-center text-warmgray">4 months with 5 pays</td>
                    <td className="px-4 py-3 text-center text-warmgray font-semibold">2 months with 3 pays</td>
                    <td className="px-4 py-3 text-center text-warmgray">None</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Best for</td>
                    <td className="px-4 py-3 text-center text-warmgray">Casual, hourly workers</td>
                    <td className="px-4 py-3 text-center text-warmgray font-semibold">Full-time salaried employees</td>
                    <td className="px-4 py-3 text-center text-warmgray">Contractors, senior roles</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray mb-4">
              Fortnightly pay aligns well with common Australian billing cycles for rent, mortgage repayments, and insurance premiums. Two months each calendar year contain 3 fortnightly pay periods instead of 2, producing an effective &quot;bonus&quot; fortnight that many employees direct toward savings or debt reduction. Compare your net pay across all cycles with our <Link href="/weekly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Weekly Pay Calculator</Link> and <Link href="/monthly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Monthly Pay Calculator</Link>.
            </p>
          </section>

          {/* --- WHAT DEDUCTIONS APPLY? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Deductions Apply to Fortnightly Pay?</h2>
            <p className="text-warmgray mb-4">
              Three mandatory deductions reduce fortnightly take-home pay: PAYG income tax, the {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy, and HECS-HELP repayments for employees with a study debt above {formatAUD(HECS_HELP.minimumThreshold)}.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">PAYG Income Tax Withholding</h3>
            <p className="text-warmgray mb-4">
              Employers withhold income tax from each fortnightly pay using the ATO&apos;s PAYG fortnightly tax table. The withholding amount reflects the FY2025-26 marginal tax rates: <strong>0%</strong> on the first $18,200, <strong>16%</strong> from $18,201 to $45,000, <strong>30%</strong> from $45,001 to $135,000, <strong>37%</strong> from $135,001 to $190,000, and <strong>45%</strong> above $190,000. The &quot;Low Income Tax Offset&quot; reduces tax by up to <strong>$700</strong> for incomes below $66,667.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">Medicare Levy and Surcharge</h3>
            <p className="text-warmgray mb-4">
              The Medicare levy of {formatPercent(MEDICARE_LEVY.rate, 0)} applies to all taxable income above the low-income threshold of {formatAUD(MEDICARE_LEVY.lowIncomeThreshold)}. Employees without private hospital cover who earn above {formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)} also pay the &quot;Medicare Levy Surcharge&quot; of <strong>1% to 1.5%</strong> depending on income tier.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">HECS-HELP Repayments</h3>
            <p className="text-warmgray mb-4">
              HECS-HELP repayments are withheld from fortnightly pay once repayment income exceeds {formatAUD(HECS_HELP.minimumThreshold)}. The FY2025-26 system uses marginal rates: <strong>15%</strong> on income between $69,529 and $125,000, <strong>17%</strong> on income between $125,001 and $179,285, and <strong>10%</strong> of total income above $179,285. Use our <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> to estimate your fortnightly repayment.
            </p>

            <p className="text-warmgray mb-4">
              Superannuation is not deducted from fortnightly pay. Your employer pays the {formatPercent(SUPER_GUARANTEE.rate, 0)} SG contribution on top of your gross salary, up to {formatAUD(SUPER_GUARANTEE.maxSGAnnual)} a year for employees at or above the maximum super contribution base of {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}.
            </p>
          </section>

          {/* --- COMMON MISTAKES --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Are Common Mistakes When Calculating Fortnightly Pay?</h2>
            <p className="text-warmgray mb-4">
              The most common mistake is dividing the annual salary by <strong>24</strong> instead of <strong>26</strong>, which overstates each fortnightly paycheck by approximately 8.3%.
            </p>
            <ol className="list-decimal pl-5 space-y-3 text-warmgray mb-4">
              <li><strong>Dividing by 24 instead of 26.</strong> A year contains 26 fortnights (52 weeks / 2), not 24. Dividing $85,000 by 24 produces $3,541.67 per fortnight, which is <strong>$277.25 more</strong> than the correct gross of {formatAUD(85_000 / 26, 2)}.</li>
              <li><strong>Treating super as a deduction.</strong> The {formatPercent(SUPER_GUARANTEE.rate, 0)} superannuation guarantee is paid by the employer on top of gross salary. It does not reduce fortnightly take-home pay unless your contract specifies a &quot;total package inclusive of super.&quot;</li>
              <li><strong>Ignoring the tax-free threshold.</strong> The first $18,200 of annual income is tax-free. Employees who do not claim this threshold on their Tax File Number Declaration have a higher PAYG withholding rate applied to every fortnightly pay.</li>
              <li><strong>Forgetting the 27th pay period.</strong> Every 11 to 12 years, the calendar creates 27 fortnightly pay days in a single financial year. This affects PAYG withholding calculations and can cause a small tax shortfall or surplus at year-end.</li>
              <li><strong>Not accounting for salary sacrifice.</strong> Pre-tax salary sacrifice into super or a novated lease reduces assessable income and lowers the fortnightly tax withheld. Use our <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> to model the impact.</li>
            </ol>
          </section>

          {/* --- CONTEXT BORDER --- */}

          {/* --- RELATED CALCULATORS --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Related Calculators</h2>
            <p className="text-warmgray mb-4">
              Use these Australian tax calculators alongside the fortnightly pay calculator to get a complete picture of your income, deductions, and take-home pay for FY2025-26.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/weekly-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Weekly Pay Calculator</span>
                <span className="text-sm text-warmgray-light">See your after-tax income per week based on 52 weekly pay periods.</span>
              </Link>
              <Link href="/monthly-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Monthly Pay Calculator</span>
                <span className="text-sm text-warmgray-light">Convert your annual salary into monthly take-home pay across 12 periods.</span>
              </Link>
              <Link href="/take-home-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Take-Home Pay Calculator</span>
                <span className="text-sm text-warmgray-light">Full annual breakdown of income tax, Medicare, super, and net pay.</span>
              </Link>
              <Link href="/income-tax-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Income Tax Calculator</span>
                <span className="text-sm text-warmgray-light">Calculate your exact income tax liability across all 5 tax brackets.</span>
              </Link>
              <Link href="/hourly-to-annual-salary-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Hourly to Annual Salary Calculator</span>
                <span className="text-sm text-warmgray-light">Convert an hourly rate to annual, fortnightly, and weekly salary.</span>
              </Link>
              <Link href="/superannuation-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Superannuation Calculator</span>
                <span className="text-sm text-warmgray-light">See how employer SG contributions at {formatPercent(SUPER_GUARANTEE.rate, 0)} build your retirement fund.</span>
              </Link>
            </div>
          </section>

          <MethodologyDisclosure>
            <p>Calculations are based on 26 fortnights per year. We divide the annual figures by 26 to provide the fortnightly equivalent. This aligns with standard ATO PAYG withholding practices.</p>
          </MethodologyDisclosure>

          {/* --- FAQs --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <FAQItem value="how" question="How is fortnightly pay calculated in Australia?">
                Fortnightly pay is calculated by dividing your gross annual salary by 26 (the number of fortnights in a year). The employer then deducts PAYG income tax, the 2% Medicare levy, and any HECS-HELP repayments using the ATO&apos;s fortnightly tax table. The remaining amount is your fortnightly take-home pay.
              </FAQItem>
              <FAQItem value="super" question="Is superannuation deducted from my fortnightly pay?">
                No. Your employer pays superannuation at {formatPercent(SUPER_GUARANTEE.rate, 0)} on top of your gross salary. It is not deducted from your fortnightly take-home pay. The SG contribution is paid directly into your nominated super fund, typically quarterly within 28 days of each quarter&apos;s end.
              </FAQItem>
              <FAQItem value="periods" question="Are there 26 or 27 fortnightly pays in a year?">
                A standard year has 26 fortnightly pay periods (26 x 14 = 364 days). Because a calendar year has 365 or 366 days, every 11 to 12 years a financial year contains 27 fortnightly pay days. When this occurs, employers adjust PAYG withholding to avoid an end-of-year tax shortfall.
              </FAQItem>
              <FAQItem value="vs-monthly" question="Is fortnightly pay better than monthly pay?">
                Annual take-home pay is identical under both frequencies. Fortnightly pay provides 26 paychecks instead of 12, producing 2 months per year with 3 pay periods. This extra fortnight helps employees accelerate mortgage repayments, build savings, or manage cash flow more closely than a monthly cycle.
              </FAQItem>
              <FAQItem value="refund" question="Will I get a tax refund if I am paid fortnightly?">
                The PAYG system withholds the estimated correct amount of tax regardless of pay frequency. Refunds commonly occur when employees claim work-related deductions, work part of the year, or have income that fluctuates between fortnights. Lodge your tax return after 30 June to reconcile the actual tax owed against total PAYG withheld during the financial year.
              </FAQItem>
              <FAQItem value="hecs" question="How does HECS-HELP affect fortnightly take-home pay?">
                HECS-HELP repayments reduce fortnightly take-home pay once repayment income exceeds {formatAUD(HECS_HELP.minimumThreshold)} per year. The FY2025-26 marginal repayment rate starts at 15% on income above $69,528, increasing to 17% above $125,000 and 10% of total income above $179,285. The repayment is divided across 26 fortnights by the employer.
              </FAQItem>
              <FAQItem value="gross-net" question="What is the difference between gross fortnightly pay and net fortnightly pay?">
                Gross fortnightly pay is your annual salary divided by 26 before any deductions. Net fortnightly pay (also called take-home pay) is the amount deposited into your bank account after PAYG tax, Medicare levy, and any HECS repayments are withheld. On an $85,000 salary, gross fortnightly pay is {formatAUD(85_000 / 26, 2)} and net fortnightly pay is <strong>{formatAUD(workedExample.fortnightly, 2)}</strong>.
              </FAQItem>
              <FAQItem value="tax-free" question="Does the $18,200 tax-free threshold apply to fortnightly pay?">
                Yes. The $18,200 tax-free threshold is built into the ATO&apos;s fortnightly tax table. Employees who claim the threshold on their Tax File Number Declaration have the first $700 of each fortnightly gross pay ($18,200 / 26) effectively tax-free. Employees who do not claim the threshold pay tax on every dollar from the first fortnightly pay period.
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
  const fortnightlyGross = salary / 26;
  const fortnightlyTax = (result.netIncomeTax + result.medicareLevy) / 26;

  return (
    <tr>
      <td className="px-4 py-3 text-navy font-medium">{formatAUD(salary)}</td>
      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(fortnightlyGross, 2)}</td>
      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(fortnightlyTax, 2)}</td>
      <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">{formatAUD(result.fortnightly, 2)}</td>
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
