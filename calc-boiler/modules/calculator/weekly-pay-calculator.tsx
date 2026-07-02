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
  { title: "PAYG withholding weekly tax table", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-table-weekly", publisher: SOURCES.ato.name },
];

export default function WeeklyPayCalculatorPage() {
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
              <li><span className="font-medium text-navy" aria-current="page">Weekly Pay Calculator</span></li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">Weekly Pay Calculator Australia — Take-Home Pay Per Week</h1>
          <p className="text-lg text-warmgray">Enter your annual salary to see exactly what you take home every week after tax, super, and Medicare. Updated for FY2025-26.</p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-6 text-center">Calculate Your Weekly Take-Home Pay</h2>
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
                  <button type="submit" className="w-full bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 rounded-lg shadow-md transition-all">Calculate Weekly Pay</button>
                </form>

                <Card className="bg-sandstone border-eucalyptus/30 border-2 shadow-sm" role="region" aria-live="polite">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-navy mb-4">Your Weekly Breakdown</h3>
                    <div className="space-y-2.5 text-sm">
                      <Row label="Gross Weekly Pay" value={formatAUD(salary / 52, 2)} bold />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Income Tax" value={`-${formatAUD(result.netIncomeTax / 52, 2)}`} />
                      <Row label="Medicare Levy" value={`-${formatAUD(result.medicareLevy / 52, 2)}`} />
                      {result.medicareSurcharge > 0 && <Row label="Medicare Surcharge" value={`-${formatAUD(result.medicareSurcharge / 52, 2)}`} />}
                      {includeHECS && <Row label="HECS Repayment" value={`-${formatAUD(result.hecsRepayment / 52, 2)}`} />}
                      <div className="border-t border-sandstone-dark/20" />
                      <div className="flex justify-between items-baseline pt-2 pb-2">
                        <span className="font-bold text-navy">Weekly Take-Home</span>
                        <span className="text-3xl font-extrabold text-eucalyptus-dark">{formatAUD(result.weekly, 2)}</span>
                      </div>
                      <div className="border-t border-sandstone-dark/20 pt-2 text-xs">
                        <Row label="Annual Equivalent" value={formatAUD(result.takeHomePay)} />
                        <Row label={`Super (${formatPercent(SUPER_GUARANTEE.rate, 0)} - employer paid)`} value={`+${formatAUD(result.superContribution / 52, 2)}/wk`} sub />
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
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Is Weekly Pay Calculated in Australia?</h2>
            <p className="text-warmgray mb-4">
              Weekly take-home pay equals your gross annual salary divided by 52, minus PAYG income tax, the Medicare levy, and any HECS-HELP repayments withheld each week.
            </p>
            <p className="text-warmgray mb-4">
              The ATO requires employers to use PAYG (Pay As You Go) withholding tables that spread your total annual tax liability evenly across 52 pay periods. Your employer calculates the weekly amount using the published <Link href="/weekly-tax-table/" className="text-eucalyptus-dark hover:underline">weekly tax table</Link>, which accounts for the tax-free threshold of <strong>$18,200</strong>, the "Low Income Tax Offset" (LITO) of up to <strong>$700</strong>, and the applicable marginal tax rates.
            </p>
            <p className="text-warmgray mb-4">
              The calculation follows 4 steps:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-warmgray mb-4">
              <li><strong>Gross weekly pay:</strong> Divide your annual salary by 52. An <strong>$80,000</strong> salary produces gross weekly pay of <strong>$1,538.46</strong>.</li>
              <li><strong>Income tax:</strong> Apply the FY2025-26 income tax brackets to your annual salary, then divide the total tax by 52. At $80,000, annual income tax is approximately <strong>$14,788</strong>, or <strong>$284.38</strong> per week.</li>
              <li><strong>Medicare levy:</strong> Calculate <strong>2%</strong> of your gross weekly pay. At $80,000, the Medicare levy costs <strong>$30.77</strong> per week.</li>
              <li><strong>HECS-HELP:</strong> If you carry a student loan and earn above the minimum repayment threshold of <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong>, the repayment amount is withheld proportionally each week.</li>
            </ol>
            <p className="text-warmgray">
              Superannuation of {formatPercent(SUPER_GUARANTEE.rate, 0)} is paid by your employer on top of your salary and does not reduce your weekly take-home pay. Use our <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to see the exact dollar amount your employer contributes each week.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Weekly Pay Table by Annual Salary</h2>
            <p className="text-warmgray mb-4">
              An Australian resident earning <strong>$70,000</strong> per year takes home approximately <strong>$1,117</strong> per week after tax and Medicare in FY2025-26.
            </p>
            <p className="text-warmgray mb-4">
              The table below shows weekly gross pay, weekly tax withheld, and weekly take-home pay at 6 common salary levels. All figures assume an Australian resident claiming the tax-free threshold with no HECS-HELP debt and no salary sacrifice arrangements.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Annual Salary</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Gross Weekly</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Weekly Tax</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Weekly Take-Home</th>
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
            <p className="text-warmgray text-sm mt-3">
              Higher earners face steeper marginal rates. A worker on <strong>$180,000</strong> pays over <strong>30%</strong> more of each additional dollar in tax compared to someone earning $70,000. For a complete breakdown of income tax brackets, visit our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link>.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Who Uses a Weekly Pay Calculator?</h2>
            <p className="text-warmgray mb-4">
              Employees paid on a weekly cycle, casual workers, and budget planners use a weekly pay calculator to convert annual salary figures into usable weekly amounts.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-warmgray">
              <li><strong>Weekly-paid employees:</strong> Retail, hospitality, and construction workers are commonly paid each week under their Modern Award. A weekly calculator confirms the exact net amount expected on each pay slip.</li>
              <li><strong>Casual workers:</strong> Casuals receiving an hourly rate plus a 25% casual loading benefit from converting their expected hours into a weekly after-tax figure. Our <Link href="/hourly-to-annual-salary-calculator/" className="text-eucalyptus-dark hover:underline">Hourly to Annual Salary Calculator</Link> handles this conversion.</li>
              <li><strong>Budget planners:</strong> Many household expenses, including rent, groceries, and transport, are billed weekly. Knowing the precise weekly take-home amount makes allocating funds across those 3 cost categories straightforward.</li>
              <li><strong>Job seekers:</strong> Comparing job offers quoted as annual salaries becomes easier when broken down to a weekly net figure, particularly when evaluating roles across different pay frequencies.</li>
              <li><strong>Contractors considering PAYG employment:</strong> Sole traders transitioning to permanent roles use this calculator to compare their current invoiced income against a weekly after-tax salary. See our <Link href="/contractor-vs-employee-calculator/" className="text-eucalyptus-dark hover:underline">Contractor vs Employee Calculator</Link> for a side-by-side comparison.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Does Weekly Pay Compare to Fortnightly and Monthly Pay?</h2>
            <p className="text-warmgray mb-4">
              Weekly pay divides your annual salary into 52 payments, fortnightly pay into 26 payments, and monthly pay into 12 payments. The annual take-home total is identical regardless of frequency.
            </p>
            <p className="text-warmgray mb-4">
              The key difference lies in cash flow timing and budgeting. Weekly pay provides the most frequent income, which suits employees who manage expenses on a week-to-week basis. Fortnightly pay is the most common cycle in Australia, used by approximately 45% of employers. Monthly pay is standard for salaried professionals in corporate, government, and finance sectors.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Attribute</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">Weekly</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">Fortnightly</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">Monthly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Pay periods per year</td>
                    <td className="px-4 py-3 text-center text-warmgray"><strong>52</strong></td>
                    <td className="px-4 py-3 text-center text-warmgray"><strong>26</strong></td>
                    <td className="px-4 py-3 text-center text-warmgray"><strong>12</strong></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Gross per period ($80k salary)</td>
                    <td className="px-4 py-3 text-center text-warmgray">$1,538</td>
                    <td className="px-4 py-3 text-center text-warmgray">$3,077</td>
                    <td className="px-4 py-3 text-center text-warmgray">$6,667</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Best suited for</td>
                    <td className="px-4 py-3 text-center text-warmgray">Casual &amp; award workers</td>
                    <td className="px-4 py-3 text-center text-warmgray">Most PAYG employees</td>
                    <td className="px-4 py-3 text-center text-warmgray">Salaried professionals</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Budgeting ease</td>
                    <td className="px-4 py-3 text-center text-warmgray">Easiest (matches weekly bills)</td>
                    <td className="px-4 py-3 text-center text-warmgray">Moderate</td>
                    <td className="px-4 py-3 text-center text-warmgray">Harder (large gaps between pays)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">
              To view your pay at other frequencies, use our <Link href="/fortnightly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Fortnightly Pay Calculator</Link> or <Link href="/monthly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Monthly Pay Calculator</Link>.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Deductions Apply to Your Weekly Pay?</h2>
            <p className="text-warmgray mb-4">
              Three mandatory deductions reduce your gross weekly pay: PAYG income tax, the Medicare levy of <strong>2%</strong>, and HECS-HELP repayments if your income exceeds <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong>.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">PAYG Income Tax</h3>
            <p className="text-warmgray mb-4">
              PAYG withholding is the largest weekly deduction for most Australian workers. The FY2025-26 tax brackets apply marginal rates of <strong>16%</strong>, <strong>30%</strong>, <strong>37%</strong>, and <strong>45%</strong> to income above the tax-free threshold. Your employer withholds 1/52nd of your estimated annual tax each week. The "Low Income Tax Offset" reduces tax by up to <strong>$700</strong> for incomes below <strong>$66,667</strong>.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">Medicare Levy and Surcharge</h3>
            <p className="text-warmgray mb-4">
              The Medicare levy is <strong>2%</strong> of your taxable income, withheld weekly. Australians earning below the low-income threshold of <strong>$27,222</strong> receive a reduction or full exemption. The "Medicare Levy Surcharge" (MLS) adds an additional <strong>1% to 1.5%</strong> for high earners without private hospital cover: those earning between $93,001 and $108,000 pay <strong>1%</strong>, between $108,001 and $144,000 pay <strong>1.25%</strong>, and above $144,000 pay <strong>1.5%</strong>.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">HECS-HELP Repayments</h3>
            <p className="text-warmgray mb-4">
              HECS-HELP repayments are withheld weekly when your repayment income exceeds <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong> per year. The FY2025-26 system uses marginal repayment rates: <strong>15 cents</strong> per dollar between $67,001 and $125,000, and <strong>17 cents</strong> per dollar between $125,001 and $179,285. Above $179,285, the repayment rate is <strong>10%</strong> of total repayment income. Use our <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> to see your exact weekly repayment.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Are Common Mistakes When Calculating Weekly Pay?</h2>
            <p className="text-warmgray mb-4">
              The most common mistake is dividing an annual salary by 48 (assuming 4 weeks of leave are unpaid) instead of 52, which overstates weekly pay by approximately <strong>8.3%</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-warmgray">
              <li><strong>Dividing by 48 instead of 52:</strong> Full-time employees receive 4 weeks of paid annual leave. The salary already covers 52 weeks, so dividing by 52 is correct for calculating gross weekly pay.</li>
              <li><strong>Subtracting super from take-home pay:</strong> The super guarantee of {formatPercent(SUPER_GUARANTEE.rate, 0)} is paid by your employer on top of your salary. It does not reduce your weekly take-home amount unless you make voluntary salary sacrifice contributions.</li>
              <li><strong>Using the wrong financial year rates:</strong> Tax brackets, LITO thresholds, and HECS repayment rates change at the start of each financial year on 1 July. Calculations using the previous year&apos;s rates produce incorrect weekly figures. This Australian tax calculator uses the current FY2025-26 rates.</li>
              <li><strong>Ignoring the Medicare levy:</strong> Excluding the 2% Medicare levy understates total deductions by approximately <strong>$30.77</strong> per week on an $80,000 salary.</li>
              <li><strong>Confusing gross and net pay:</strong> Job advertisements quote gross (pre-tax) salaries. The actual weekly amount deposited into your bank account is the net pay after all deductions. At $80,000 gross, the difference between gross and net weekly pay is over <strong>$300</strong>.</li>
            </ul>
          </section>

          {/* CONTEXT BORDER */}

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Related Calculators</h2>
            <p className="text-warmgray mb-4">
              These Australian tax calculators complement the weekly pay calculator by handling different pay frequencies, deduction types, and employment scenarios.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/fortnightly-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Fortnightly Pay Calculator</span>
                <span className="text-sm text-warmgray-light">See your salary split into 26 fortnightly payments after tax, Medicare, and HECS.</span>
              </Link>
              <Link href="/monthly-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Monthly Pay Calculator</span>
                <span className="text-sm text-warmgray-light">Convert your annual salary into 12 monthly take-home pay amounts.</span>
              </Link>
              <Link href="/take-home-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Take-Home Pay Calculator</span>
                <span className="text-sm text-warmgray-light">Full annual breakdown of income tax, super, and net pay after all deductions.</span>
              </Link>
              <Link href="/hourly-to-annual-salary-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Hourly to Annual Salary Calculator</span>
                <span className="text-sm text-warmgray-light">Convert an hourly rate into annual, monthly, and weekly salary equivalents.</span>
              </Link>
              <Link href="/salary-sacrifice-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Salary Sacrifice Calculator</span>
                <span className="text-sm text-warmgray-light">Calculate the tax savings and take-home impact of pre-tax super contributions.</span>
              </Link>
              <Link href="/gross-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Gross Pay Calculator</span>
                <span className="text-sm text-warmgray-light">Reverse-calculate the gross salary needed to reach a target net pay amount.</span>
              </Link>
            </div>
          </section>

          <MethodologyDisclosure>
            <p>Calculations are based on 52 weeks per year. We divide the annual figures by 52 to provide the weekly equivalent. This aligns with standard ATO PAYG withholding practices.</p>
          </MethodologyDisclosure>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <FAQItem value="how" question="How is weekly pay calculated in Australia?">
                Weekly pay is calculated by dividing your gross annual salary by 52 weeks, then subtracting PAYG income tax, the Medicare levy (2%), and any HECS-HELP repayments. An employee earning $80,000 per year receives gross weekly pay of <strong>$1,538.46</strong>. After approximately $284 in income tax and $31 in Medicare levy, the weekly take-home pay is roughly <strong>$1,223</strong>.
              </FAQItem>
              <FAQItem value="super" question="Is superannuation deducted from my weekly pay?">
                No. Your employer pays the super guarantee of {formatPercent(SUPER_GUARANTEE.rate, 0)} on top of your salary. This amount does not reduce your weekly take-home pay. The only exception is voluntary salary sacrifice contributions, where you choose to redirect part of your pre-tax salary into super to reduce your taxable income.
              </FAQItem>
              <FAQItem value="change" question="Why did my weekly pay change on 1 July?">
                Weekly pay changes at the start of each financial year (1 July) because updated PAYG withholding tables take effect. For FY2025-26, changes to income tax brackets, the LITO phase-out thresholds, and HECS-HELP repayment rates all affect the amount your employer withholds from each weekly payment.
              </FAQItem>
              <FAQItem value="gross-vs-net" question="What is the difference between gross weekly pay and net weekly pay?">
                Gross weekly pay is your annual salary divided by 52 before any deductions. Net weekly pay (also called take-home pay) is the amount deposited into your bank account after PAYG tax, Medicare levy, and any HECS-HELP repayments are withheld. On an $80,000 salary, gross weekly pay is <strong>$1,538</strong> and net weekly pay is approximately <strong>$1,223</strong> — a difference of <strong>$315</strong> per week.
              </FAQItem>
              <FAQItem value="52-weeks" question="Why do we divide by 52 and not 48?">
                Full-time employees in Australia receive 4 weeks of paid annual leave and 10 days of paid personal leave per year. These paid leave entitlements are included in the annual salary, which covers all 52 weeks. Dividing by 48 would overstate weekly pay by approximately 8.3%.
              </FAQItem>
              <FAQItem value="casual" question="How do casual workers calculate weekly pay?">
                Casual workers multiply their hourly rate by the number of hours worked in the week. A casual loading of <strong>25%</strong> is already included in the hourly rate under most Modern Awards. Weekly PAYG tax is then calculated based on the annualised equivalent of that weekly gross amount. Casual income varies week to week, so the tax withheld each pay period also fluctuates.
              </FAQItem>
              <FAQItem value="threshold" question="Do I pay tax if my weekly pay is below $350?">
                Earning <strong>$350</strong> per week is equivalent to <strong>$18,200</strong> per year, which is the tax-free threshold. If your total annual income from all sources stays at or below $18,200, no income tax is payable. However, if you hold multiple jobs and your combined income exceeds the threshold, tax applies on the combined total. Only one employer can apply the tax-free threshold — your second job is taxed from the first dollar.
              </FAQItem>
              <FAQItem value="budget" question="How should I budget on weekly pay?">
                Financial advisors typically recommend the 50/30/20 rule: allocate <strong>50%</strong> of your after-tax weekly pay to needs (rent, groceries, transport), <strong>30%</strong> to wants (dining out, entertainment), and <strong>20%</strong> to savings and debt repayment. On a net weekly income of $1,223 (from an $80,000 salary), that equals $612 for needs, $367 for wants, and $244 for savings.
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
  const weeklyGross = salary / 52;
  const weeklyTax = (result.netIncomeTax + result.medicareLevy) / 52;

  return (
    <tr>
      <td className="px-4 py-3 text-navy font-medium">{formatAUD(salary)}</td>
      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(weeklyGross, 2)}</td>
      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(weeklyTax, 2)}</td>
      <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">{formatAUD(result.weekly, 2)}</td>
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
