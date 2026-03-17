"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareLevy,
  formatAUD,
  formatPercent,
  EMPLOYMENT,
  SUPER_GUARANTEE,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const SOURCES_LIST: SourceLink[] = [
  { title: "Employment types", url: "https://www.fairwork.gov.au/starting-employment/employee-types", publisher: SOURCES.fwo.name },
  { title: "Casual loading and entitlements", url: "https://www.fairwork.gov.au/starting-employment/employee-types/casual-employees", publisher: SOURCES.fwo.name },
  { title: "National minimum wage", url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages", publisher: SOURCES.fwo.name },
];

function calcTakeHome(annualIncome: number) {
  if (annualIncome <= 0) return 0;
  const rawTax = calculateIncomeTax(annualIncome);
  const lito = calculateLITO(annualIncome);
  const netTax = Math.max(0, Math.round(rawTax - lito));
  const medicare = calculateMedicareLevy(annualIncome);
  return annualIncome - netTax - medicare;
}

export default function EmploymentTypeCalculatorPage() {
  const [hourlyRate, setHourlyRate] = useState(35);
  const [hoursPerWeek, setHoursPerWeek] = useState(38);

  const result = useMemo(() => {
    const fullTimeHours = EMPLOYMENT.standardWeeklyHours;
    const annualWeeks = 52;

    // Full-Time
    const ftAnnual = Math.round(hourlyRate * fullTimeHours * annualWeeks);
    const ftLeaveValue = Math.round(hourlyRate * fullTimeHours * EMPLOYMENT.annualLeaveWeeks);
    const ftPersonalLeaveValue = Math.round(hourlyRate * fullTimeHours * (EMPLOYMENT.personalLeaveDays / 5));
    const ftSuper = Math.round(ftAnnual * SUPER_GUARANTEE.rate);
    const ftTakeHome = calcTakeHome(ftAnnual);
    const ftTotalPackage = ftAnnual + ftSuper;

    // Part-Time
    const ptAnnual = Math.round(hourlyRate * hoursPerWeek * annualWeeks);
    const ptLeaveValue = Math.round(hourlyRate * hoursPerWeek * EMPLOYMENT.annualLeaveWeeks);
    const ptPersonalLeaveValue = Math.round(hourlyRate * hoursPerWeek * (EMPLOYMENT.personalLeaveDays / 5));
    const ptSuper = Math.round(ptAnnual * SUPER_GUARANTEE.rate);
    const ptTakeHome = calcTakeHome(ptAnnual);
    const ptTotalPackage = ptAnnual + ptSuper;

    // Casual
    const casualRate = hourlyRate * (1 + EMPLOYMENT.casualLoading);
    const casualAnnual = Math.round(casualRate * hoursPerWeek * annualWeeks);
    const casualLeaveValue = 0;
    const casualPersonalLeaveValue = 0;
    const casualSuper = Math.round(casualAnnual * SUPER_GUARANTEE.rate);
    const casualTakeHome = calcTakeHome(casualAnnual);
    const casualTotalPackage = casualAnnual + casualSuper;

    return {
      fullTime: { annual: ftAnnual, leaveValue: ftLeaveValue, personalLeave: ftPersonalLeaveValue, super: ftSuper, takeHome: ftTakeHome, totalPackage: ftTotalPackage, hourly: hourlyRate },
      partTime: { annual: ptAnnual, leaveValue: ptLeaveValue, personalLeave: ptPersonalLeaveValue, super: ptSuper, takeHome: ptTakeHome, totalPackage: ptTotalPackage, hourly: hourlyRate },
      casual: { annual: casualAnnual, leaveValue: casualLeaveValue, personalLeave: casualPersonalLeaveValue, super: casualSuper, takeHome: casualTakeHome, totalPackage: casualTotalPackage, hourly: casualRate },
    };
  }, [hourlyRate, hoursPerWeek]);

  const types = [
    { key: "fullTime" as const, label: "Full-Time", hours: `${EMPLOYMENT.standardWeeklyHours}h/wk` },
    { key: "partTime" as const, label: "Part-Time", hours: `${hoursPerWeek}h/wk` },
    { key: "casual" as const, label: "Casual", hours: `${hoursPerWeek}h/wk` },
  ];

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* HERO */}
          <section className="bg-eucalyptus-light/40 rounded-2xl p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <nav aria-label="breadcrumb">
                <ol className="flex items-center space-x-1 text-sm text-warmgray">
                  <li><Link className="hover:text-eucalyptus-dark hover:underline" href="/">Pay Calculator</Link></li>
                  <li className="flex items-center"><ChevronRight className="h-3 w-3 text-gray-400" /></li>
                  <li><span className="font-medium text-navy" aria-current="page">Employment Type Calculator</span></li>
                </ol>
              </nav>
              <div className="flex justify-between items-start mb-4 mt-4">
                <h1 className="text-3xl md:text-4xl font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  Part-Time vs Full-Time vs Casual Calculator
                </h1>
              </div>
              <p className="text-xl text-warmgray">
                Compare take-home pay and total entitlements across full-time, part-time, and casual employment. See the real value of leave, super, and casual loading side by side.
              </p>
              <TrustBar className="mt-4" />
            </div>
          </section>

          {/* CALCULATOR */}
          <section className="max-w-4xl mx-auto">
            <Card className="shadow-md">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl font-semibold text-navy mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Compare Employment Types</h2>

                {/* Inputs */}
                <form onSubmit={(e) => e.preventDefault()} className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label htmlFor="hourly" className="block text-sm font-medium text-navy mb-1">Base Hourly Rate</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="hourly" min={0} max={200} step={0.5} value={hourlyRate}
                        onChange={(e) => setHourlyRate(clamp(Number(e.target.value || 0), 0, 200))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm" />
                    </div>
                    <input type="range" min={20} max={100} step={1} className="mt-2 w-full accent-eucalyptus" aria-hidden="true"
                      value={clamp(hourlyRate, 20, 100)} onChange={(e) => setHourlyRate(Number(e.target.value))} />
                  </div>
                  <div>
                    <label htmlFor="hours" className="block text-sm font-medium text-navy mb-1">Hours Per Week (Part-Time / Casual)</label>
                    <input type="number" id="hours" min={1} max={38} step={1} value={hoursPerWeek}
                      onChange={(e) => setHoursPerWeek(clamp(Number(e.target.value || 1), 1, 38))}
                      className="block w-24 rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm" />
                    <input type="range" min={5} max={38} step={1} className="mt-2 w-full accent-eucalyptus" aria-hidden="true"
                      value={clamp(hoursPerWeek, 5, 38)} onChange={(e) => setHoursPerWeek(Number(e.target.value))} />
                    <p className="text-xs text-warmgray-light mt-1">Full-time is always {EMPLOYMENT.standardWeeklyHours} hours/week</p>
                  </div>
                </form>

                {/* 3-column comparison */}
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-sandstone font-semibold text-navy">
                        <tr>
                          <th className="px-4 py-3 text-left">Metric</th>
                          {types.map((t) => (
                            <th key={t.key} className="px-4 py-3 text-right">
                              <div>{t.label}</div>
                              <div className="text-xs font-normal text-warmgray">{t.hours}</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                        <tr className="hover:bg-sandstone">
                          <td className="px-4 py-3 text-navy">Effective Hourly Rate</td>
                          {types.map((t) => <td key={t.key} className="px-4 py-3 text-right text-navy">${result[t.key].hourly.toFixed(2)}/hr</td>)}
                        </tr>
                        <tr className="hover:bg-sandstone">
                          <td className="px-4 py-3 text-navy font-medium">Annual Earnings</td>
                          {types.map((t) => <td key={t.key} className="px-4 py-3 text-right font-medium text-navy">{formatAUD(result[t.key].annual)}</td>)}
                        </tr>
                        <tr className="hover:bg-sandstone">
                          <td className="px-4 py-3 text-navy">Annual Leave Value</td>
                          {types.map((t) => <td key={t.key} className="px-4 py-3 text-right text-navy">{result[t.key].leaveValue > 0 ? formatAUD(result[t.key].leaveValue) : <span className="text-warmgray-light">$0 (casual loading)</span>}</td>)}
                        </tr>
                        <tr className="hover:bg-sandstone">
                          <td className="px-4 py-3 text-navy">Personal/Sick Leave Value</td>
                          {types.map((t) => <td key={t.key} className="px-4 py-3 text-right text-navy">{result[t.key].personalLeave > 0 ? formatAUD(result[t.key].personalLeave) : <span className="text-warmgray-light">$0</span>}</td>)}
                        </tr>
                        <tr className="hover:bg-sandstone">
                          <td className="px-4 py-3 text-navy">Super Contribution (12%)</td>
                          {types.map((t) => <td key={t.key} className="px-4 py-3 text-right text-navy">{formatAUD(result[t.key].super)}</td>)}
                        </tr>
                        <tr className="hover:bg-sandstone bg-sandstone/30">
                          <td className="px-4 py-3 text-navy font-semibold">Total Package Value</td>
                          {types.map((t) => <td key={t.key} className="px-4 py-3 text-right font-bold text-navy">{formatAUD(result[t.key].totalPackage + result[t.key].leaveValue + result[t.key].personalLeave)}</td>)}
                        </tr>
                        <tr className="hover:bg-sandstone">
                          <td className="px-4 py-3 text-navy font-semibold">Take-Home Pay (after tax)</td>
                          {types.map((t) => <td key={t.key} className="px-4 py-3 text-right font-bold text-eucalyptus-dark">{formatAUD(result[t.key].takeHome)}</td>)}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="bg-sandstone border-l-4 border-eucalyptus p-4 text-sm text-warmgray">
                    <p className="font-medium mb-1">Disclaimer:</p>
                    <p>Calculations use standard employment conditions. Actual entitlements depend on your award, enterprise agreement, or employment contract. Casual loading of 25% compensates for the absence of paid leave. Tax estimates use ATO FY{SITE_CONFIG.financialYear} rates.</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-warmgray border-t border-sandstone-dark/20 pt-4">
                  <p className="flex items-center">
                    <ShieldCheck className="w-4 h-4 text-eucalyptus mr-2" />
                    <span>Based on Fair Work NES and ATO tax tables for FY{SITE_CONFIG.financialYear}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CONTENT */}
          <div className="max-w-4xl mx-auto space-y-10">

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Do Full-Time, Part-Time, and Casual Compare?</h2>
              <p className="mb-4 text-warmgray">The three main employment types in Australia differ in <strong>hours, entitlements, and pay structure</strong>. While casual employees receive a higher hourly rate through the 25% casual loading, permanent employees receive paid leave and greater job security.</p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-sandstone-dark/20 rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-navy mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Full-Time</h3>
                  <ul className="space-y-1 text-sm text-warmgray list-disc pl-4">
                    <li>38 hours per week (standard)</li>
                    <li>4 weeks annual leave</li>
                    <li>10 days personal/sick leave</li>
                    <li>Ongoing employment</li>
                    <li>Notice period required</li>
                  </ul>
                </div>
                <div className="bg-white border border-sandstone-dark/20 rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-navy mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Part-Time</h3>
                  <ul className="space-y-1 text-sm text-warmgray list-disc pl-4">
                    <li>Under 38 hours, regular schedule</li>
                    <li>Pro-rata annual leave</li>
                    <li>Pro-rata personal leave</li>
                    <li>Ongoing employment</li>
                    <li>Notice period required</li>
                  </ul>
                </div>
                <div className="bg-white border border-sandstone-dark/20 rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-navy mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Casual</h3>
                  <ul className="space-y-1 text-sm text-warmgray list-disc pl-4">
                    <li>No guaranteed hours</li>
                    <li>25% casual loading</li>
                    <li>No paid annual or sick leave</li>
                    <li>No notice period required</li>
                    <li>Can refuse shifts</li>
                  </ul>
                </div>
              </div>
              <p className="text-warmgray">Use the <Link href="/hourly-to-annual-salary-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Hourly to Annual Salary Calculator</Link> to convert your hourly rate to an annual figure, or check the <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline font-medium">Award Rates</Link> page for your industry&apos;s minimum pay rates.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Is the 25% Casual Loading Worth It?</h2>
              <p className="mb-4 text-warmgray">The 25% casual loading is designed to compensate for the absence of paid leave, notice of termination, and redundancy pay. To determine whether casual is better for you, consider the <strong>total value of permanent entitlements</strong>:</p>
              <ul className="list-disc pl-6 space-y-2 text-warmgray">
                <li><strong>Annual leave:</strong> 4 weeks paid leave = 7.7% of annual earnings</li>
                <li><strong>Personal/sick leave:</strong> 10 days = 3.8% of annual earnings</li>
                <li><strong>Public holidays:</strong> ~8 days paid = ~3.1% of annual earnings</li>
                <li><strong>Notice period:</strong> 1-5 weeks guaranteed = varies</li>
                <li><strong>Redundancy pay:</strong> 4-16 weeks after 1+ years = varies</li>
              </ul>
              <p className="mt-4 text-warmgray">The combined value of leave alone (annual + personal + public holidays) is approximately <strong>14.6%</strong> of annual earnings &mdash; meaning the 25% casual loading only provides a <strong>~10% premium</strong> over permanent employment once leave is accounted for. For long-term employment, permanent roles generally offer better total value.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Casual Conversion Rights</h2>
              <p className="mb-4 text-warmgray">Under the Fair Work Act, casual employees who have worked <strong>regular and systematic hours for 12 months</strong> with the same employer may request conversion to permanent employment. Employers with 15 or more employees must offer conversion if the employee meets the criteria, unless there are reasonable grounds to refuse.</p>
              <p className="text-warmgray">For a detailed comparison guide, see our <Link href="/full-time-vs-part-time-vs-casual/" className="text-eucalyptus-dark hover:underline font-medium">Full-Time vs Part-Time vs Casual</Link> guide. To calculate your superannuation entitlements under any employment type, use the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Superannuation Calculator</Link>.</p>
            </section>

            <MethodologyDisclosure>
              <ol className="list-decimal space-y-1 pl-4">
                <li>Full-time annual earnings = hourly rate x 38 hours x 52 weeks.</li>
                <li>Part-time annual earnings = hourly rate x selected hours x 52 weeks.</li>
                <li>Casual annual earnings = hourly rate x 1.25 (casual loading) x selected hours x 52 weeks.</li>
                <li>Leave value = hourly rate x weekly hours x 4 weeks (annual) or 2 weeks (personal/sick).</li>
                <li>Super = 12% of annual earnings for all employment types.</li>
                <li>Tax calculated using ATO FY{SITE_CONFIG.financialYear} progressive brackets with LITO and Medicare levy.</li>
              </ol>
              <p className="mt-2">Entitlements from <a className="text-eucalyptus-dark hover:underline" href="https://www.fairwork.gov.au/starting-employment/employee-types" target="_blank" rel="noreferrer noopener">Fair Work Ombudsman</a>, last verified {SITE_CONFIG.lastVerified}.</p>
            </MethodologyDisclosure>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="space-y-3">
                <AccordionItem value="loading-vs-leave" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Is casual loading better than annual leave?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">For most workers, no. The 25% casual loading sounds generous, but the combined value of annual leave (4 weeks), personal leave (10 days), and public holidays exceeds <strong>14%</strong> of earnings. Permanent employment also provides job security, notice periods, and potential redundancy pay.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="casual-super" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Do casual workers get superannuation?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Yes. All employees, including casuals, receive the <strong>12% superannuation guarantee</strong>. Super is calculated on the casual employee&apos;s ordinary time earnings, which includes the 25% casual loading.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="pt-vs-casual" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>What is the difference between part-time and casual?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Part-time employees work <strong>regular guaranteed hours</strong> (under 38 per week), receive paid annual and personal leave on a pro-rata basis, and have ongoing employment. Casual employees have <strong>no guaranteed hours</strong>, receive 25% casual loading instead of leave, and either party can end the arrangement without notice.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="conversion" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Can I convert from casual to permanent?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Yes. Under the Fair Work Act, casual employees who have worked <strong>regular hours for 12 months</strong> can request conversion to permanent employment. Employers with 15+ employees must offer conversion if criteria are met, unless there are reasonable business grounds to refuse.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="which-better" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Which employment type pays more overall?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Casual workers receive more cash in hand due to the 25% loading, but permanent employees receive a higher <strong>total package value</strong> when leave, job security, notice periods, and redundancy pay are included. The best option depends on whether you value flexibility (casual) or stability and entitlements (permanent).</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="tax-diff" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Do casual employees pay more tax?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Tax is based on <strong>total annual income</strong>, not employment type. A casual earning $70,000/year pays the same income tax as a full-time employee earning $70,000/year. However, casual employees earn more gross income (due to loading) for the same hours, which may place them in a higher tax bracket.</p></AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Related */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Calculators</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/award-rates/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Award Rates</h3>
                  <p className="text-sm text-warmgray">Check minimum pay rates for your industry and classification</p>
                </Link>
                <Link href="/leave-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Leave Calculator</h3>
                  <p className="text-sm text-warmgray">Calculate your annual leave and personal leave entitlements</p>
                </Link>
                <Link href="/hourly-to-annual-salary-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Hourly to Annual Salary Calculator</h3>
                  <p className="text-sm text-warmgray">Convert any hourly rate to annual, weekly, or fortnightly salary</p>
                </Link>
                <Link href="/superannuation-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Superannuation Calculator</h3>
                  <p className="text-sm text-warmgray">See the 12% SG contribution on any employment type</p>
                </Link>
              </div>
            </section>

            <section className="bg-eucalyptus-light/40 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>See Your Full Pay Breakdown</h2>
              <p className="text-warmgray mb-6 max-w-lg mx-auto">Get the complete picture with income tax, Medicare, HECS, and super for any employment type.</p>
              <Link href="/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200">
                Calculate Your Take-Home Pay →
              </Link>
            </section>

            <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
          </div>
        </div>
      </div>
    </div>
  );
}
