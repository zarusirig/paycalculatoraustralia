"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  formatAUD,
  formatPercent,
  EMPLOYMENT,
  MEDICARE_LEVY,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const PENALTY_TYPES = [
  { label: "Time-and-a-half (1.5×)", value: 1.5 },
  { label: "Double time (2.0×)", value: 2.0 },
  { label: "Double-time-and-a-half (2.5×)", value: 2.5 },
  { label: "Saturday casual (1.25×)", value: 1.25 },
  { label: "Evening shift (1.15×)", value: 1.15 },
] as const;

const SOURCES_LIST: SourceLink[] = [
  { title: "Overtime and penalty rates", url: "https://www.fairwork.gov.au/pay-and-wages/penalty-rates-allowances-and-other-payments/penalty-rates", publisher: SOURCES.fwo.name },
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
];

export default function OvertimePayCalculatorPage() {
  const [baseRate, setBaseRate] = useState(30);
  const [multiplier, setMultiplier] = useState(1.5);
  const [hoursWorked, setHoursWorked] = useState(8);
  const [marginalBracket, setMarginalBracket] = useState(0.30);

  const overtimeRate = baseRate * multiplier;
  const grossOvertimePay = overtimeRate * hoursWorked;
  const effectiveTaxRate = marginalBracket + MEDICARE_LEVY.rate;
  const estimatedTax = Math.round(grossOvertimePay * effectiveTaxRate);
  const netOvertimePay = grossOvertimePay - estimatedTax;

  // Weekly scenario: standard 38 hrs + overtime hours
  const weeklyBasePay = baseRate * EMPLOYMENT.standardWeeklyHours;
  const weeklyTotal = weeklyBasePay + grossOvertimePay;

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-eucalyptus-light/30 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Overtime Pay Calculator</span></li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">
            Overtime &amp; Penalty Rate Calculator 2025-26
          </h1>
          <p className="text-lg text-warmgray">
            Calculate your overtime, weekend, and public holiday pay. Enter your base hourly rate,
            select the penalty multiplier, and see your gross and net overtime earnings after tax.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-6">Calculate Your Overtime Pay</h2>
              <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                {/* Inputs */}
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="baseRate" className="block text-sm font-medium text-navy mb-1">Base Hourly Rate</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="baseRate" min={0} max={200} step={0.5} value={baseRate}
                        onChange={(e) => setBaseRate(clamp(Number(e.target.value || 0), 0, 200))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="multiplier" className="block text-sm font-medium text-navy mb-1">Penalty Type</label>
                    <select id="multiplier" value={multiplier}
                      onChange={(e) => setMultiplier(Number(e.target.value))}
                      className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20">
                      {PENALTY_TYPES.map((pt) => (
                        <option key={pt.value} value={pt.value}>{pt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="hoursWorked" className="block text-sm font-medium text-navy mb-1">Overtime Hours</label>
                    <input type="number" id="hoursWorked" min={0} max={80} step={0.5} value={hoursWorked}
                      onChange={(e) => setHoursWorked(clamp(Number(e.target.value || 0), 0, 80))}
                      className="block w-28 rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    <input type="range" min={0} max={40} step={1} value={clamp(hoursWorked, 0, 40)}
                      onChange={(e) => setHoursWorked(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" />
                  </div>

                  <div>
                    <label htmlFor="marginalBracket" className="block text-sm font-medium text-navy mb-1">Your Tax Bracket</label>
                    <select id="marginalBracket" value={marginalBracket}
                      onChange={(e) => setMarginalBracket(Number(e.target.value))}
                      className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20">
                      <option value={0}>0% ($0 – $18,200)</option>
                      <option value={0.16}>16% ($18,201 – $45,000)</option>
                      <option value={0.30}>30% ($45,001 – $135,000)</option>
                      <option value={0.37}>37% ($135,001 – $190,000)</option>
                      <option value={0.45}>45% ($190,001+)</option>
                    </select>
                  </div>
                </form>

                {/* Results */}
                <div className="space-y-6">
                  <div className="bg-eucalyptus-light/30 border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-eucalyptus-dark uppercase tracking-wider mb-2">Net Overtime Pay</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(netOvertimePay)}</div>
                    <div className="text-sm text-warmgray mt-2">
                      for <strong>{hoursWorked}</strong> hours at <strong>{multiplier}×</strong>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                      <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">Breakdown</h3>
                    </div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Base Rate" value={`${formatAUD(baseRate, 2)}/hr`} />
                      <Row label={`Penalty Rate (${multiplier}×)`} value={`${formatAUD(overtimeRate, 2)}/hr`} bold />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label={`Gross Overtime (${hoursWorked} hrs)`} value={formatAUD(grossOvertimePay)} bold />
                      <Row label={`Est. Tax (${formatPercent(effectiveTaxRate, 0)} incl. Medicare)`} value={`-${formatAUD(estimatedTax)}`} />
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label="Net Overtime Pay" value={formatAUD(netOvertimePay)} bold highlight />
                    </div>
                  </div>

                  <div className="bg-sandstone rounded-xl border border-sandstone-dark/20 p-5">
                    <h3 className="font-semibold text-navy text-sm mb-3">Weekly Scenario</h3>
                    <div className="space-y-2 text-sm">
                      <Row label={`Standard Pay (${EMPLOYMENT.standardWeeklyHours}hrs × ${formatAUD(baseRate, 2)})`} value={formatAUD(weeklyBasePay)} />
                      <Row label="+ Overtime Pay" value={`+${formatAUD(grossOvertimePay)}`} />
                      <div className="border-t border-sandstone-dark/10 pt-2" />
                      <Row label="Total Weekly Gross" value={formatAUD(weeklyTotal)} bold />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">

          {/* --- H2: How Is Overtime Pay Calculated in Australia? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Is Overtime Pay Calculated in Australia?</h2>
            <p className="mb-4 text-warmgray">
              Overtime pay in Australia is calculated by multiplying your base hourly rate by the penalty multiplier set in your Modern Award or enterprise agreement, then multiplying by the number of overtime hours worked. The formula is: <strong>Base Rate x Penalty Multiplier x Overtime Hours = Gross Overtime Pay</strong>.
            </p>
            <p className="mb-4 text-warmgray">
              Full-time employees on a standard {EMPLOYMENT.standardWeeklyHours}-hour week trigger overtime after exceeding {EMPLOYMENT.standardWeeklyHours} ordinary hours per week or 7.6 hours per day. Part-time employees trigger overtime after exceeding their agreed contracted hours. The Australian tax calculator applies the same income tax brackets to overtime earnings as it does to regular salary, meaning your take-home pay from overtime depends on your marginal rate.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">Worked Example: Overtime at $35/hr</h3>
            <p className="mb-4 text-warmgray">
              A warehouse worker earns a base rate of <strong>$35.00/hr</strong>. They work 6 overtime hours on a weekday at time-and-a-half (1.5x), and their taxable income places them in the <strong>30% marginal tax bracket</strong>.
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
              <li>Penalty rate: $35.00 x 1.5 = <strong>$52.50/hr</strong></li>
              <li>Gross overtime: $52.50 x 6 hours = <strong>$315.00</strong></li>
              <li>Estimated tax (30% + 2% Medicare levy): $315.00 x 0.32 = <strong>$100.80</strong></li>
              <li>Net overtime pay: $315.00 - $100.80 = <strong>$214.20</strong></li>
            </ol>
            <p className="text-warmgray">
              Use our <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> to see how overtime earnings affect your total weekly, fortnightly, or annual after-tax income.
            </p>
          </section>

          {/* --- H2: What Are the Overtime Penalty Rates? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Are the Overtime Penalty Rates?</h2>
            <p className="mb-4 text-warmgray">
              Overtime penalty rates range from <strong>1.5x to 2.5x</strong> the base hourly rate, depending on the day, time, and applicable Modern Award. The Fair Work Ombudsman sets minimum penalty rates across 122 modern awards covering industries including retail, hospitality, healthcare, manufacturing, and construction.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">When You Work</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">Full-Time / Part-Time</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">Casual</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Example ({formatAUD(EMPLOYMENT.minimumWageHourly, 2)}/hr base)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">Saturday</td>
                    <td className="px-4 py-3 text-center font-medium text-navy">1.25× – 1.5×</td>
                    <td className="px-4 py-3 text-center text-warmgray">1.5× – 1.75×</td>
                    <td className="px-4 py-3 text-right text-warmgray">{formatAUD(EMPLOYMENT.minimumWageHourly * 1.5, 2)}/hr</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">Sunday</td>
                    <td className="px-4 py-3 text-center font-medium text-navy">1.5× – 2.0×</td>
                    <td className="px-4 py-3 text-center text-warmgray">1.75× – 2.25×</td>
                    <td className="px-4 py-3 text-right text-warmgray">{formatAUD(EMPLOYMENT.minimumWageHourly * 2, 2)}/hr</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">Public Holiday</td>
                    <td className="px-4 py-3 text-center font-medium text-navy">2.0× – 2.5×</td>
                    <td className="px-4 py-3 text-center text-warmgray">2.25× – 2.75×</td>
                    <td className="px-4 py-3 text-right text-warmgray">{formatAUD(EMPLOYMENT.minimumWageHourly * 2.5, 2)}/hr</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">Overtime (first 2-3 hrs)</td>
                    <td className="px-4 py-3 text-center font-medium text-navy">1.5×</td>
                    <td className="px-4 py-3 text-center text-warmgray">1.5×</td>
                    <td className="px-4 py-3 text-right text-warmgray">{formatAUD(EMPLOYMENT.minimumWageHourly * 1.5, 2)}/hr</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">Overtime (after 2-3 hrs)</td>
                    <td className="px-4 py-3 text-center font-medium text-navy">2.0×</td>
                    <td className="px-4 py-3 text-center text-warmgray">2.0×</td>
                    <td className="px-4 py-3 text-right text-warmgray">{formatAUD(EMPLOYMENT.minimumWageHourly * 2, 2)}/hr</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-warmgray-light">Exact multipliers vary by Award. Use the <a href="https://calculate.fairwork.gov.au/" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">Fair Work PACT tool</a> to check your specific award penalties.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">Penalty Rates by Award Type</h3>
            <p className="mb-4 text-warmgray">
              Different Modern Awards set different penalty structures. The table below compares weekday overtime rates across 5 common awards for the FY2025-26 financial year.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Modern Award</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">First 2-3 Hrs</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">After 2-3 Hrs</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">Sunday</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">Public Holiday</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">General Retail Industry Award</td>
                    <td className="px-4 py-3 text-center">1.5×</td>
                    <td className="px-4 py-3 text-center">2.0×</td>
                    <td className="px-4 py-3 text-center">2.0×</td>
                    <td className="px-4 py-3 text-center">2.5×</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">Hospitality Industry (General) Award</td>
                    <td className="px-4 py-3 text-center">1.5×</td>
                    <td className="px-4 py-3 text-center">2.0×</td>
                    <td className="px-4 py-3 text-center">2.0×</td>
                    <td className="px-4 py-3 text-center">2.5×</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">Nurses Award</td>
                    <td className="px-4 py-3 text-center">1.5×</td>
                    <td className="px-4 py-3 text-center">2.0×</td>
                    <td className="px-4 py-3 text-center">2.0×</td>
                    <td className="px-4 py-3 text-center">2.5×</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">Building and Construction General On-site Award</td>
                    <td className="px-4 py-3 text-center">1.5×</td>
                    <td className="px-4 py-3 text-center">2.0×</td>
                    <td className="px-4 py-3 text-center">2.0×</td>
                    <td className="px-4 py-3 text-center">2.5×</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">Clerks Private Sector Award</td>
                    <td className="px-4 py-3 text-center">1.5×</td>
                    <td className="px-4 py-3 text-center">2.0×</td>
                    <td className="px-4 py-3 text-center">2.0×</td>
                    <td className="px-4 py-3 text-center">2.5×</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* --- H2: Who Uses This Calculator? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Who Uses This Calculator?</h2>
            <p className="mb-4 text-warmgray">
              This Australian overtime pay calculator serves employees, employers, and payroll professionals who calculate penalty rate earnings for FY2025-26. Common use cases include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>Shift workers</strong> in retail, hospitality, and healthcare verifying their weekend and public holiday pay on each payslip</li>
              <li><strong>Full-time employees</strong> estimating the net value of extra hours before agreeing to overtime requests</li>
              <li><strong>Part-time workers</strong> checking whether hours above their contracted agreement trigger overtime multipliers</li>
              <li><strong>Small business owners</strong> budgeting weekly labour costs when rostering staff across weekends and public holidays</li>
              <li><strong>Payroll managers</strong> cross-checking PAYG withholding on overtime payments against ATO tax tables</li>
            </ul>
            <p className="text-warmgray">
              Employees earning overtime frequently benefit from reviewing their total annual income using the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to confirm the correct marginal rate applies to their overtime earnings.
            </p>
          </section>

          {/* --- H2: Overtime Pay Table by Hourly Rate --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Overtime Pay Table by Hourly Rate</h2>
            <p className="mb-4 text-warmgray">
              The table below shows gross overtime pay for <strong>8 hours</strong> of overtime at common base hourly rates across 3 penalty multipliers. These figures represent gross pay before income tax and the 2% Medicare levy.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Base Hourly Rate</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">1.5× (8 hrs)</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">2.0× (8 hrs)</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">2.5× (8 hrs)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {[24.10, 28, 32, 36, 40, 45, 50, 60].map((rate) => (
                    <tr key={rate} className="hover:bg-sandstone">
                      <td className="px-4 py-3 text-navy font-medium">{formatAUD(rate, 2)}/hr</td>
                      <td className="px-4 py-3 text-center">{formatAUD(rate * 1.5 * 8)}</td>
                      <td className="px-4 py-3 text-center">{formatAUD(rate * 2.0 * 8)}</td>
                      <td className="px-4 py-3 text-center">{formatAUD(rate * 2.5 * 8)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-warmgray-light">
              The national minimum wage is {formatAUD(EMPLOYMENT.minimumWageHourly, 2)}/hr for FY2025-26. Rates above reflect common award classifications. Use our <Link href="/hourly-to-annual-salary-calculator/" className="text-eucalyptus-dark hover:underline">Hourly to Annual Salary Calculator</Link> to convert your hourly rate to an annual salary.
            </p>
          </section>

          {/* --- H2: How Is Overtime Taxed? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Is Overtime Taxed?</h2>
            <p className="mb-4 text-warmgray">
              Overtime earnings are taxed at your <strong>marginal tax rate</strong> because they are added on top of your regular assessable income. Every overtime dollar sits in your highest income tax bracket, identical to how <Link href="/bonus-tax-calculator/" className="text-eucalyptus-dark hover:underline">bonus payments are taxed</Link>.
            </p>
            <p className="mb-4 text-warmgray">
              Your employer withholds tax from overtime pay through PAYG withholding. The ATO provides Schedule 5 (tax table for back payments and lump sums) and the standard weekly/fortnightly tax tables to calculate withholding on pay periods that include overtime. The 2% Medicare levy surcharge also applies to overtime earnings, and employees without private health insurance earning above <strong>$93,000</strong> per year pay an additional "Medicare Levy Surcharge" of <strong>1% to 1.5%</strong>.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">FY2025-26 Tax Brackets on Overtime Income</h3>
            <p className="mb-4 text-warmgray">
              The income tax brackets below determine the marginal rate applied to your overtime. An employee earning <strong>$75,000</strong> in base salary pays <strong>30%</strong> plus <strong>2% Medicare levy</strong> on every overtime dollar, reducing each $1.00 of gross overtime to <strong>$0.68</strong> in take-home pay.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Taxable Income</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">Marginal Rate</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">+ Medicare Levy</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Overtime Keep Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">$0 – $18,200</td>
                    <td className="px-4 py-3 text-center">0%</td>
                    <td className="px-4 py-3 text-center">2%</td>
                    <td className="px-4 py-3 text-right font-medium">98c per $1</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">$18,201 – $45,000</td>
                    <td className="px-4 py-3 text-center">16%</td>
                    <td className="px-4 py-3 text-center">2%</td>
                    <td className="px-4 py-3 text-right font-medium">82c per $1</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">$45,001 – $135,000</td>
                    <td className="px-4 py-3 text-center">30%</td>
                    <td className="px-4 py-3 text-center">2%</td>
                    <td className="px-4 py-3 text-right font-medium">68c per $1</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">$135,001 – $190,000</td>
                    <td className="px-4 py-3 text-center">37%</td>
                    <td className="px-4 py-3 text-center">2%</td>
                    <td className="px-4 py-3 text-right font-medium">61c per $1</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">$190,001+</td>
                    <td className="px-4 py-3 text-center">45%</td>
                    <td className="px-4 py-3 text-center">2%</td>
                    <td className="px-4 py-3 text-right font-medium">53c per $1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* --- H2: Do I Get Super on Overtime? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Do I Get Super on Overtime?</h2>
            <p className="mb-4 text-warmgray">
              Overtime is generally <strong>not classified as Ordinary Time Earnings (OTE)</strong> and does not attract the 12% Superannuation Guarantee for FY2025-26. The ATO defines OTE as the earnings an employee receives for ordinary hours of work, and overtime hours fall outside that definition.
            </p>
            <p className="mb-4 text-warmgray">
              Some enterprise agreements or employment contracts include overtime in the superannuation calculation base. Check your employment agreement or contact your employer&apos;s payroll team to confirm. Use our <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to calculate the SG rate on your ordinary earnings separately.
            </p>
          </section>

          {/* --- H2: What Are Common Overtime Pay Mistakes? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Are Common Overtime Pay Mistakes?</h2>
            <p className="mb-4 text-warmgray">
              Underpayment of overtime is one of the most common payroll compliance issues in Australia, with the Fair Work Ombudsman recovering <strong>over $500 million</strong> in unpaid wages across the 2022-23 and 2023-24 financial years. These 5 mistakes occur most frequently:
            </p>
            <ol className="list-decimal pl-6 space-y-3 text-warmgray mb-4">
              <li><strong>Applying the wrong multiplier</strong> — Using 1.5x for all overtime hours instead of escalating to 2.0x after the first 2 or 3 hours as required by most awards</li>
              <li><strong>Calculating casual overtime on the loaded rate</strong> — The overtime multiplier applies to the base rate only, not the base rate plus the 25% casual loading</li>
              <li><strong>Ignoring part-time overtime triggers</strong> — Part-time employees earn overtime after exceeding their agreed hours, not after 38 hours per week</li>
              <li><strong>Missing public holiday penalties</strong> — Australia has 8 national public holidays and additional state-specific holidays, each attracting 2.0x to 2.5x penalty rates</li>
              <li><strong>Using the wrong tax bracket</strong> — Overtime sits on top of your base salary, so the marginal rate on overtime is typically higher than your average tax rate across all income</li>
            </ol>
            <p className="text-warmgray">
              Employees who suspect underpayment of overtime should compare their payslip against the calculations from this overtime pay calculator and review their applicable award on the <a href="https://www.fairwork.gov.au/pay-and-wages/minimum-wages/pay-guides" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">Fair Work Ombudsman website</a>.
            </p>
          </section>

          {/* --- CONTEXT BORDER --- */}

          {/* --- H2: Related Calculators --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Related Calculators</h2>
            <p className="mb-4 text-warmgray">
              Overtime pay interacts with income tax, superannuation, and total salary packaging. These calculators help you model the complete picture:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-warmgray">
              <li><Link href="/weekly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Weekly Pay Calculator</Link> — Convert your base salary plus overtime into a weekly after-tax amount</li>
              <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> — Calculate your total income tax liability including overtime in your assessable income for FY2025-26</li>
              <li><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> — See your net pay after tax, Medicare levy, and HECS-HELP on a salary that includes regular overtime</li>
              <li><Link href="/bonus-tax-calculator/" className="text-eucalyptus-dark hover:underline">Bonus Tax Calculator</Link> — Estimate tax on lump-sum payments, which follow the same marginal rate logic as overtime</li>
              <li><Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> — Calculate the 12% SG contribution on your ordinary time earnings, separate from overtime</li>
            </ul>
          </section>

          <MethodologyDisclosure>
            <p className="mb-2 text-sm">Overtime pay is estimated using:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Gross overtime = base hourly rate × multiplier × hours</li>
              <li>Tax estimated at your selected marginal bracket + 2% Medicare levy</li>
              <li>Actual withholding may vary based on your total annualised earnings</li>
              <li>Does not account for HECS, salary sacrifice, or other deductions</li>
            </ul>
          </MethodologyDisclosure>

          {/* --- H2: Frequently Asked Questions --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <AccordionItem value="how-calculated" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How is overtime pay calculated?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Overtime pay is your base hourly rate multiplied by the penalty rate set in your Award or agreement. For example, time-and-a-half on a $30/hr base rate = $45/hr. The first 2-3 overtime hours are typically at 1.5×, and hours beyond that at 2.0×.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="when-overtime" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>When does overtime start?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">For most full-time employees, overtime begins after 38 hours per week (or 7.6 hours per day). Part-time employees may earn overtime after exceeding their agreed hours. The exact threshold depends on your Award or enterprise agreement.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="casual-overtime" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Do casual workers get overtime?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. Casual employees are entitled to overtime rates when they exceed 38 hours per week. The overtime multiplier applies to the base rate (not the casual-loaded rate). However, weekend and public holiday penalties for casuals are usually higher than for permanent staff to compensate for the lack of leave.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="refuse-overtime" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Can I refuse to work overtime?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Under the National Employment Standards, an employer can request &quot;reasonable overtime.&quot; You can refuse if it is unreasonable — factors include your personal circumstances, the notice given, your role, and health and safety risks. The Fair Work Ombudsman provides guidance on what constitutes reasonable overtime.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="overtime-super" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Is superannuation paid on overtime hours?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">The 12% Superannuation Guarantee does not apply to overtime hours under the ATO&apos;s definition of &quot;Ordinary Time Earnings.&quot; Overtime pay falls outside OTE. Some enterprise agreements override this and include overtime in the super calculation base, so check your employment contract.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="overtime-tax-bracket" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Does overtime push me into a higher tax bracket?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Overtime increases your total assessable income for the financial year. If total earnings including overtime cross an income tax bracket threshold (e.g., from $45,000 to above $45,001), the portion above the threshold is taxed at the higher marginal rate of <strong>30%</strong> instead of <strong>16%</strong>. Only the portion above the threshold is taxed at the higher rate — not your entire income.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="toil" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Can I take time off instead of overtime pay?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">&quot;Time Off In Lieu&quot; (TOIL) allows employees to take paid time off instead of receiving overtime pay, provided the arrangement is agreed in writing. Under most Modern Awards, TOIL must be taken at the overtime rate — 1 hour of overtime at 1.5x entitles you to <strong>1.5 hours</strong> of paid time off. The employee must genuinely agree; an employer cannot unilaterally substitute TOIL for overtime payment.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="max-overtime" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Is there a maximum number of overtime hours per week?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">The National Employment Standards do not set a hard cap on overtime hours. However, an employer can only request &quot;reasonable&quot; additional hours. The Fair Work Act 2009 considers hours unreasonable if they pose a risk to health and safety, conflict with family responsibilities, or exceed the norms for the industry. An employee working regular overtime beyond 10 additional hours per week typically has grounds to refuse further requests.</p></AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span>
      <span className={`${bold ? "font-bold" : "font-medium"} ${highlight ? "text-eucalyptus-dark" : "text-navy"}`}>{value}</span>
    </div>
  );
}
