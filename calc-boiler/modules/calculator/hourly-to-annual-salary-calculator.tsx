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

const SOURCES_LIST: SourceLink[] = [
  { title: "National Employment Standards", url: "https://www.fairwork.gov.au/employment-conditions/national-employment-standards", publisher: SOURCES.fwc.name },
  { title: "Maximum weekly hours", url: "https://www.fairwork.gov.au/tools-and-resources/fact-sheets/minimum-workplace-entitlements/maximum-weekly-hours", publisher: SOURCES.fwc.name },
];

export default function HourlyToAnnualCalculatorPage() {
  const [hourlyRate, setHourlyRate] = useState(45.50);
  const [hoursPerWeek, setHoursPerWeek] = useState(38);

  // Annual calculation: Rate * Hours * 52 weeks
  const annualGross = hourlyRate * hoursPerWeek * 52;
  const expectedSuper = annualGross * SUPER_GUARANTEE.rate;

  const breakdown = useMemo(() => calculatePayBreakdown({ grossSalary: annualGross }), [annualGross]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-eucalyptus-light/40 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Hourly Rate Converter</span></li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Hourly to Annual Salary Calculator
          </h1>
          <p className="text-lg text-warmgray">
            Convert your hourly wage directly to an annual gross salary. See exactly how much you earn
            and what you take home after ATO income tax and Medicare for FY{SITE_CONFIG.financialYear}.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md border-t-4 border-t-eucalyptus">
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-[1fr_1.5fr] gap-8 items-start">

                {/* Inputs */}
                <div className="space-y-6">
                  <div>
                    <label htmlFor="hourlyRate" className="block text-sm font-semibold text-navy mb-2">My Hourly Rate</label>
                    <div className="flex items-center relative">
                      <span className="absolute left-3 text-warmgray-light font-medium">$</span>
                      <input type="number" id="hourlyRate" min={0} max={1000} step={0.5} value={hourlyRate}
                        onChange={(e) => setHourlyRate(clamp(Number(e.target.value || 0), 0, 1000))}
                        className="block w-full pl-7 pr-12 py-3 text-lg font-bold text-navy rounded-xl border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                      <span className="absolute right-3 text-warmgray-light font-medium text-sm">/ hr</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="hoursPerWeek" className="block text-sm font-semibold text-navy mb-2">Hours Worked Per Week</label>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center relative">
                        <input type="number" id="hoursPerWeek" min={0} max={168} step={0.5} value={hoursPerWeek}
                          onChange={(e) => setHoursPerWeek(clamp(Number(e.target.value || 0), 0, 168))}
                          className="block w-full pr-14 py-3 text-lg font-bold text-navy rounded-xl border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                        <span className="absolute right-3 text-warmgray-light font-medium text-sm">hrs</span>
                      </div>

                      <div className="flex gap-2">
                        {[38, 40, 20].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setHoursPerWeek(preset)}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors border ${
                              hoursPerWeek === preset
                                ? "bg-eucalyptus-light/30 border-eucalyptus text-eucalyptus-dark"
                                : "bg-white border-sandstone-dark/20 text-warmgray hover:bg-sandstone/50"
                            }`}
                          >
                            {preset} hrs {preset === 38 ? "(Standard)" : ""}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-5">
                  <div className="bg-eucalyptus-light/30 rounded-2xl p-6 text-center shadow-sm border border-eucalyptus-light">
                    <div className="text-sm font-bold text-navy uppercase tracking-wider mb-1">Equivalent Annual Base Salary</div>
                    <div className="text-4xl md:text-5xl font-extrabold text-navy mb-1">
                      {formatAUD(annualGross)}
                    </div>
                    <div className="text-sm text-eucalyptus-dark font-medium mt-2">
                      Before tax, super, and deductions
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden shadow-sm">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                      <h3 className="font-semibold text-navy text-sm">Your True Take-Home Pay</h3>
                    </div>
                    <div className="p-0">
                      <table className="w-full text-sm">
                        <thead className="bg-white border-b border-sandstone-dark/10">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium text-warmgray-light">Frequency</th>
                            <th className="px-4 py-2 text-right font-medium text-warmgray-light">Gross</th>
                            <th className="px-4 py-2 text-right font-medium text-warmgray-light">Tax + Med</th>
                            <th className="px-4 py-2 text-right font-semibold text-navy">Take-Home</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-sandstone-dark/10">
                          {[
                            { label: "Weekly", d: 52 },
                            { label: "Fortnightly", d: 26 },
                            { label: "Monthly", d: 12 },
                            { label: "Annually", d: 1 },
                          ].map((row) => (
                            <tr key={row.label} className="hover:bg-sandstone/50">
                              <td className="px-4 py-3 font-medium text-gray-700">{row.label}</td>
                              <td className="px-4 py-3 text-right text-warmgray">{formatAUD(annualGross / row.d)}</td>
                              <td className="px-4 py-3 text-right text-red-500">-{formatAUD(breakdown.totalDeductions / row.d)}</td>
                              <td className="px-4 py-3 text-right font-bold text-eucalyptus-dark">{formatAUD(breakdown.takeHomePay / row.d)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-sandstone p-4 rounded-xl text-sm border border-sandstone-dark/20 flex justify-between items-center">
                    <div>
                      <span className="block font-medium text-navy">Employer Superannuation</span>
                      <span className="block text-xs text-warmgray-light">Paid on top of your hourly rate into your fund</span>
                    </div>
                    <div className="font-bold text-navy">
                      +{formatAUD(expectedSuper)} <span className="text-xs font-normal text-warmgray-light">/yr</span>
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">

          {/* H2: How Do You Convert Hourly Rate to Annual Salary? */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Do You Convert Hourly Rate to Annual Salary?</h2>
            <p className="mb-4 text-warmgray">
              An hourly rate converts to an annual salary by multiplying the rate by weekly hours and then by <strong>52 weeks</strong>.
            </p>
            <div className="bg-eucalyptus-light/30 border-l-4 border-eucalyptus p-4 text-navy font-medium font-mono text-sm max-w-lg mx-auto rounded-r-lg mb-4">
              Annual Salary = Hourly Rate &times; Hours per Week &times; 52
            </div>
            <p className="mb-4 text-warmgray">
              This Australian tax calculator formula applies to permanent full-time and part-time employees whose take-home pay is based on a fixed hourly wage. The 52-week multiplier accounts for all paid leave entitlements under the National Employment Standards, including 4 weeks of annual leave, 10 days of personal leave, and paid public holidays.
            </p>
            <p className="mb-4 text-warmgray">
              A worker earning <strong>$35 per hour</strong> at 38 hours per week has an annual gross salary of <strong>$69,160</strong>. The ATO taxes this assessable income across the FY{SITE_CONFIG.financialYear} income tax brackets, and the employer pays an additional <strong>12% superannuation guarantee</strong> on top. Use our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark underline hover:text-navy">Income Tax Calculator</Link> to see the exact tax withheld at any salary level.
            </p>

            <h3 className="text-xl font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked Example: $45.50 per Hour at 38 Hours</h3>
            <p className="mb-3 text-warmgray">
              The calculation follows 3 steps:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
              <li>Multiply the hourly rate by weekly hours: $45.50 &times; 38 = <strong>$1,729.00 per week</strong></li>
              <li>Multiply the weekly amount by 52 weeks: $1,729.00 &times; 52 = <strong>$89,908 per year</strong></li>
              <li>Calculate employer super at 12%: $89,908 &times; 0.12 = <strong>$10,789 paid into your super fund</strong></li>
            </ol>
            <p className="text-warmgray">
              The gross salary of <strong>$89,908</strong> is the figure used to calculate your income tax, Medicare levy, and any HECS-HELP repayments. Use the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark underline hover:text-navy">Take-Home Pay Calculator</Link> to see the net amount deposited into your bank account each pay cycle.
            </p>
          </section>

          {/* H2: Hourly to Annual Conversion Table */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Annual Salary for Common Hourly Rates?</h2>
            <p className="mb-4 text-warmgray">
              An hourly rate of <strong>$30 produces $59,280</strong> per year, while <strong>$60 per hour equals $118,560</strong>, both based on a standard 38-hour week across 52 weeks in FY{SITE_CONFIG.financialYear}.
            </p>
            <p className="mb-4 text-warmgray">
              The table below converts hourly wages from $20 to $80 into annual gross salary, weekly gross, and the employer superannuation guarantee contribution at the current SG rate of 12%.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Hourly Rate</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Weekly Gross</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Annual Salary</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Super (12%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {[20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80].map((rate) => {
                    const weekly = rate * 38;
                    const annual = weekly * 52;
                    const superAmt = annual * 0.12;
                    return (
                      <tr key={rate} className="hover:bg-sandstone/50">
                        <td className="px-4 py-2.5 font-medium text-gray-700">${rate}/hr</td>
                        <td className="px-4 py-2.5 text-right text-warmgray">{formatAUD(weekly)}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-navy">{formatAUD(annual)}</td>
                        <td className="px-4 py-2.5 text-right text-eucalyptus-dark">{formatAUD(superAmt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-warmgray-light">
              All figures assume 38 ordinary hours per week, 52 weeks per year. Overtime, penalty rates, and casual loading are excluded. The superannuation guarantee rate of 12% applies from 1 July 2025.
            </p>
          </section>

          {/* H2: Standard Working Hours */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Do Hours Per Week Affect Annual Salary?</h2>
            <p className="mb-4 text-warmgray">
              Weekly hours are the single largest variable in the hourly-to-annual calculation, and a difference of just 2 hours per week changes gross salary by <strong>$4,732</strong> at $45.50/hr.
            </p>
            <p className="mb-4 text-warmgray">
              Under the National Employment Standards (NES), the maximum ordinary hours for a full-time employee is <strong>38 hours per week</strong>, equal to 7.6 hours per day across a 5-day working week. Some Enterprise Agreements and older contracts specify 40 hours, producing 2,080 annual hours instead of the standard 1,976 hours.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-white border border-sandstone-dark/20 rounded-xl p-5 shadow-sm text-center">
                <div className="text-3xl font-bold text-navy mb-1">38</div>
                <div className="text-sm font-semibold text-eucalyptus-dark uppercase">Hours / Week</div>
                <div className="text-xs text-warmgray-light mt-2">NES standard</div>
              </div>
              <div className="bg-white border border-sandstone-dark/20 rounded-xl p-5 shadow-sm text-center">
                <div className="text-3xl font-bold text-navy mb-1">7.6</div>
                <div className="text-sm font-semibold text-eucalyptus-dark uppercase">Hours / Day</div>
                <div className="text-xs text-warmgray-light mt-2">Standard 5-day week</div>
              </div>
              <div className="bg-white border border-sandstone-dark/20 rounded-xl p-5 shadow-sm text-center">
                <div className="text-3xl font-bold text-navy mb-1">1,976</div>
                <div className="text-sm font-semibold text-eucalyptus-dark uppercase">Hours / Year</div>
                <div className="text-xs text-warmgray-light mt-2">Equivalent annual hours</div>
              </div>
            </div>
            <p className="mb-4 text-warmgray">
              Part-time employees typically work between 15 and 30 hours per week. The hourly rate itself does not change between part-time and full-time, but the annual salary differs proportionally. A worker at $40/hr working 20 hours per week earns <strong>$41,600</strong> annually, compared to <strong>$79,040</strong> at 38 hours. Use our <Link href="/weekly-pay-calculator/" className="text-eucalyptus-dark underline hover:text-navy">Weekly Pay Calculator</Link> to compare different weekly hour arrangements side by side.
            </p>

            <h3 className="text-xl font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Hours Per Week Comparison at $45.50/hr</h3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Hours/Week</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Annual Salary</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Employment Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {[
                    { hrs: 15, type: "Part-time (casual)" },
                    { hrs: 20, type: "Part-time" },
                    { hrs: 25, type: "Part-time" },
                    { hrs: 30, type: "Part-time" },
                    { hrs: 38, type: "Full-time (NES)" },
                    { hrs: 40, type: "Full-time (contract)" },
                  ].map((row) => (
                    <tr key={row.hrs} className="hover:bg-sandstone/50">
                      <td className="px-4 py-2.5 font-medium text-gray-700">{row.hrs} hrs</td>
                      <td className="px-4 py-2.5 text-right font-bold text-navy">{formatAUD(45.50 * row.hrs * 52)}</td>
                      <td className="px-4 py-2.5 text-right text-warmgray">{row.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* H2: Who Uses This Calculator? */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Uses This Calculator?</h2>
            <p className="mb-4 text-warmgray">
              Casual workers, contractors, shift workers, and part-time employees use this hourly to annual salary calculator to compare job offers, plan budgets, and understand their taxable income for the 2025-26 financial year.
            </p>
            <ul className="space-y-3 text-warmgray mb-4">
              <li className="flex gap-3">
                <span className="text-eucalyptus-dark font-bold mt-0.5">1.</span>
                <span><strong>Job seekers comparing offers</strong> &mdash; one employer quotes $42/hr casual, another offers $75,000 salary. This calculator converts both to the same annual basis so the comparison accounts for casual loading, leave entitlements, and superannuation.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-eucalyptus-dark font-bold mt-0.5">2.</span>
                <span><strong>Casual and shift workers</strong> &mdash; hospitality staff, nurses, and warehouse workers paid hourly need an annual figure to estimate their ATO tax return, HECS-HELP repayment threshold, and Medicare levy surcharge eligibility.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-eucalyptus-dark font-bold mt-0.5">3.</span>
                <span><strong>Part-time employees</strong> &mdash; workers doing 20 or 25 hours per week convert their hourly rate to a pro-rata annual salary for mortgage applications, rental inspections, and Centrelink income reporting.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-eucalyptus-dark font-bold mt-0.5">4.</span>
                <span><strong>Independent contractors</strong> &mdash; ABN holders comparing their contract rate against a permanent salary equivalent factor in the absence of paid leave, employer super, and workers compensation insurance. Our <Link href="/contractor-vs-employee-calculator/" className="text-eucalyptus-dark underline hover:text-navy">Contractor vs Employee Calculator</Link> quantifies this gap.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-eucalyptus-dark font-bold mt-0.5">5.</span>
                <span><strong>Employers and HR teams</strong> &mdash; hiring managers convert hourly award rates to annual salary packages when drafting employment contracts and calculating total cost of employment.</span>
              </li>
            </ul>
          </section>

          {/* H2: What Is the Minimum Wage Annually? */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Minimum Wage Annually?</h2>
            <p className="mb-4 text-warmgray">
              The national minimum wage is <strong>$24.10 per hour</strong>, which equals <strong>$47,605.60 per year</strong> for a full-time 38-hour week as of 1 July 2024.
            </p>
            <p className="mb-4 text-warmgray">
              The Fair Work Commission reviews the national minimum wage annually, with any increase taking effect from 1 July. At $24.10/hr, a full-time worker earns $916.30 per week before tax. After income tax and the 2% Medicare levy, the take-home pay on the minimum wage is approximately <strong>$40,934 per year</strong>, or <strong>$787 per week</strong>.
            </p>
            <p className="mb-4 text-warmgray">
              Casual employees on the minimum wage receive an additional 25% casual loading, bringing their minimum hourly rate to <strong>$30.13/hr</strong>. This loading compensates for the absence of paid annual leave, personal leave, and notice of termination. Use the <Link href="/annual-pay-calculator/" className="text-eucalyptus-dark underline hover:text-navy">Annual Pay Calculator</Link> to calculate take-home pay at any annual salary, including the minimum wage equivalent.
            </p>

            <h3 className="text-xl font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Minimum Wage Breakdown (FY{SITE_CONFIG.financialYear})</h3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Metric</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Permanent</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Casual (+25%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-2.5 font-medium text-gray-700">Hourly rate</td>
                    <td className="px-4 py-2.5 text-right text-warmgray">$24.10</td>
                    <td className="px-4 py-2.5 text-right text-warmgray">$30.13</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-2.5 font-medium text-gray-700">Weekly gross (38 hrs)</td>
                    <td className="px-4 py-2.5 text-right text-warmgray">$916.30</td>
                    <td className="px-4 py-2.5 text-right text-warmgray">$1,144.94</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-2.5 font-medium text-gray-700">Annual gross (52 wks)</td>
                    <td className="px-4 py-2.5 text-right font-bold text-navy">$47,607.60</td>
                    <td className="px-4 py-2.5 text-right font-bold text-navy">$59,536.88</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-2.5 font-medium text-gray-700">Employer super (12%)</td>
                    <td className="px-4 py-2.5 text-right text-eucalyptus-dark">$5,712.91</td>
                    <td className="px-4 py-2.5 text-right text-eucalyptus-dark">$7,144.43</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* H2: Leave Entitlements: Casual vs Permanent */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Do Leave Entitlements Affect the Conversion?</h2>
            <p className="mb-4 text-warmgray">
              Permanent employees receive paid leave, so the 52-week multiplier accurately reflects their annual earnings, while casual employees are only paid for weeks actually worked.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border text-warmgray border-sandstone-dark/20 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-navy mb-2">Permanent Employees (Full & Part-Time)</h3>
                <p className="text-sm mb-3">If you are perm on an hourly rate, you get paid for 52 weeks of the year, even when you aren&apos;t working, because you are legally entitled to:</p>
                <ul className="space-y-1 text-sm pl-4 list-disc">
                  <li>4 weeks of paid annual leave</li>
                  <li>10 days of paid personal/sick leave</li>
                  <li>Paid public holidays</li>
                </ul>
                <p className="text-sm mt-3 font-medium text-eucalyptus-dark">The 52-week multiplier exactly maps your rate.</p>
              </div>
              <div className="bg-white border text-warmgray border-sandstone-dark/20 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-navy mb-2">Casual Employees</h3>
                <p className="text-sm mb-3">Casuals do not get paid annual leave or sick leave. Their hourly rate normally includes a <strong>25% casual loading</strong> to compensate for this lack of security.</p>
                <p className="text-sm mb-3">If a casual takes 4 weeks of holiday, they only get paid for 48 weeks of the year.</p>
                <p className="text-sm font-medium text-ochre">You must adjust your annual salary down based on how much unpaid time off you plan to take.</p>
              </div>
            </div>
            <p className="mt-4 text-warmgray">
              A casual employee at $40/hr working 38 hours for 48 weeks earns <strong>$72,960</strong> per year, not the $79,040 that a permanent employee on the same rate receives for 52 weeks. The <strong>$6,080 difference</strong> represents the cost of 4 weeks of unpaid leave. Factor in the 25% casual loading, and the real comparison becomes $50/hr casual vs $40/hr permanent. Use the <Link href="/leave-calculator/" className="text-eucalyptus-dark underline hover:text-navy">Leave Calculator</Link> to estimate the dollar value of your leave entitlements.
            </p>
          </section>

          {/* CONTEXT BORDER */}

          {/* H2: Common Mistakes */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are Common Mistakes When Converting Hourly to Annual?</h2>
            <p className="mb-4 text-warmgray">
              The most common mistake is using 40 hours instead of 38 hours, which overstates the annual salary by <strong>$4,732</strong> at a rate of $45.50/hr.
            </p>
            <ul className="space-y-3 text-warmgray mb-4">
              <li className="flex gap-3">
                <span className="text-red-500 font-bold mt-0.5">1.</span>
                <span><strong>Using 40 instead of 38 hours</strong> &mdash; the NES standard full-time week is 38 hours, not 40. Using 40 hours inflates the calculated salary by 5.26% and misrepresents the job&apos;s actual value under most modern awards.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 font-bold mt-0.5">2.</span>
                <span><strong>Including overtime in the base calculation</strong> &mdash; overtime is paid at penalty rates of 1.5x or 2x and is not guaranteed. Calculate ordinary time earnings separately, then add overtime as a separate line item.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 font-bold mt-0.5">3.</span>
                <span><strong>Forgetting casual loading inflates the comparison</strong> &mdash; a casual rate of $50/hr includes 25% loading. The base-equivalent rate is only $40/hr. Comparing $50/hr casual directly against $40/hr permanent misrepresents which role pays more.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 font-bold mt-0.5">4.</span>
                <span><strong>Assuming super is included in the hourly rate</strong> &mdash; for employees, the employer pays the 12% superannuation guarantee on top of ordinary time earnings. Only some contractor arrangements bundle super into the quoted rate.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 font-bold mt-0.5">5.</span>
                <span><strong>Ignoring tax bracket impacts at the annual level</strong> &mdash; an hourly rate tells you gross income, not take-home pay. The marginal tax rate on <strong>$90,000</strong> is 32.5% plus the 2% Medicare levy. Use our <Link href="/gross-pay-calculator/" className="text-eucalyptus-dark underline hover:text-navy">Gross Pay Calculator</Link> to reverse-engineer the gross amount needed for a target net income.</span>
              </li>
            </ul>
          </section>

          {/* H2: Related Calculators */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Calculators</h2>
            <p className="mb-4 text-warmgray">
              These Australian tax calculators handle the next steps after converting your hourly rate to an annual salary for FY{SITE_CONFIG.financialYear}.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/take-home-pay-calculator/" className="block bg-white border border-sandstone-dark/20 rounded-xl p-5 shadow-sm hover:border-eucalyptus transition-colors">
                <h3 className="font-semibold text-navy mb-1">Take-Home Pay Calculator</h3>
                <p className="text-sm text-warmgray">Enter your annual gross salary to see your net pay after income tax, Medicare levy, and HECS-HELP repayments.</p>
              </Link>
              <Link href="/superannuation-calculator/" className="block bg-white border border-sandstone-dark/20 rounded-xl p-5 shadow-sm hover:border-eucalyptus transition-colors">
                <h3 className="font-semibold text-navy mb-1">Superannuation Calculator</h3>
                <p className="text-sm text-warmgray">Calculate employer SG contributions at 12% and project your super balance at retirement based on your annual salary.</p>
              </Link>
              <Link href="/overtime-pay-calculator/" className="block bg-white border border-sandstone-dark/20 rounded-xl p-5 shadow-sm hover:border-eucalyptus transition-colors">
                <h3 className="font-semibold text-navy mb-1">Overtime Pay Calculator</h3>
                <p className="text-sm text-warmgray">Calculate penalty rates at 1.5x and 2x your base hourly rate for overtime hours worked beyond 38 hours per week.</p>
              </Link>
              <Link href="/salary-sacrifice-calculator/" className="block bg-white border border-sandstone-dark/20 rounded-xl p-5 shadow-sm hover:border-eucalyptus transition-colors">
                <h3 className="font-semibold text-navy mb-1">Salary Sacrifice Calculator</h3>
                <p className="text-sm text-warmgray">See how pre-tax concessional contributions reduce your taxable income and boost your superannuation balance.</p>
              </Link>
            </div>
          </section>

          {/* H2: FAQs */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <AccordionItem value="calc" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How do you calculate annual salary from an hourly rate?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Multiply your hourly rate by the number of hours you work each week, then multiply that result by 52 (the number of weeks in a year). For example, $40/hr &times; 38 hours &times; 52 weeks = <strong>$79,040</strong> gross per year.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="nes" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>What is a standard working week in Australia?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">The National Employment Standards (NES) define maximum ordinary hours as <strong>38 hours per week</strong> for full-time employees. This equates to 7.6 hours per day over a 5-day working week, producing <strong>1,976</strong> ordinary hours per year.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="super" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Does my hourly rate include superannuation?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">No. For permanent employees, the employer pays an additional <strong>12%</strong> superannuation guarantee on top of your ordinary time earnings. Casual employees also receive the 12% SG rate on top of their hourly rate, which already includes 25% casual loading.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="overtime" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Should I include overtime in my annual salary calculation?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">The standard conversion (hourly &times; hours &times; 52) covers only ordinary time earnings. Overtime is paid at penalty rates of <strong>1.5x or 2x</strong> and is not guaranteed weekly. Calculate overtime separately and add it to your base annual salary. Superannuation is generally calculated on ordinary time earnings only, not on overtime hours.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="part-time" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How do I convert a part-time hourly rate to a full-time equivalent?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">The hourly rate does not change between part-time and full-time. To find the full-time equivalent (FTE) salary, multiply your hourly rate by 38 hours &times; 52 weeks. A part-time worker earning $35/hr at 20 hours per week has an actual annual salary of <strong>$36,400</strong>, but the FTE salary is <strong>$69,160</strong>.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="casual-loading" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How does casual loading affect the annual salary calculation?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Casual loading of <strong>25%</strong> is added to the base hourly rate to compensate for the absence of paid leave. A base rate of $30/hr becomes $37.50/hr with casual loading. The annual gross at 38 hours is <strong>$74,100</strong>, but this includes compensation for 4 weeks of annual leave and 10 days of personal leave that casuals do not receive as paid time off.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="tax-threshold" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>At what hourly rate do I start paying income tax?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">The tax-free threshold is <strong>$18,200</strong> per year. At 38 hours per week, you start paying income tax at an hourly rate above <strong>$9.21/hr</strong>. Every dollar of assessable income above $18,200 is taxed at the applicable marginal rate, starting at 16% for income between $18,201 and $45,000 in FY{SITE_CONFIG.financialYear}.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="hecs" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Does my HECS-HELP debt affect this conversion?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">The hourly-to-annual conversion itself is unaffected, but HECS-HELP repayments reduce your take-home pay once annual income exceeds the compulsory repayment threshold of <strong>$54,435</strong> for FY{SITE_CONFIG.financialYear}. At $30/hr (38 hours), your annual salary of <strong>$59,280</strong> triggers a repayment rate of <strong>2%</strong>, equal to $1,185.60 per year. Use our <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark underline hover:text-navy">HECS-HELP Calculator</Link> to see the exact repayment amount.</p></AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section className="bg-eucalyptus-light/30 rounded-2xl p-8 text-center mt-12">
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Have a HECS Debt?</h2>
            <p className="text-warmgray mb-6 max-w-lg mx-auto">See how your student loan impacts your new equivalent annual salary.</p>
            <Link href="/hecs-help-calculator/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all">Go to HECS-HELP Calculator &rarr;</Link>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
        </div>
      </div>
    </div>
  );
}
