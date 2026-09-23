"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import {
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareLevy,
  formatAUD,
  EMPLOYMENT,
  SUPER_GUARANTEE,
  SITE_CONFIG,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function calcTakeHome(annualIncome: number) {
  if (annualIncome <= 0) return 0;
  const rawTax = calculateIncomeTax(annualIncome);
  const lito = calculateLITO(annualIncome);
  const netTax = Math.max(0, Math.round(rawTax - lito));
  const medicare = calculateMedicareLevy(annualIncome);
  return annualIncome - netTax - medicare;
}

/**
 * The interactive part of /employment-type-calculator/: hero and calculator
 * card. The static long-form content is server-rendered
 * (employment-type-calculator-content.tsx) and passed in as `children`, so it
 * is not part of this client bundle.
 */
export default function EmploymentTypeCalculatorPage({ children }: { children: React.ReactNode }) {
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
                <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label htmlFor="hourly" className="block text-sm font-medium text-navy mb-1">Base Hourly Rate</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="hourly" min={0} max={200} step={0.5} value={hourlyRate}
                        onChange={(e) => setHourlyRate(clamp(Number(e.target.value || 0), 0, 200))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm" />
                    </div>
                    <input type="range" min={20} max={100} step={1} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1}
                      value={clamp(hourlyRate, 20, 100)} onChange={(e) => setHourlyRate(Number(e.target.value))} />
                  </div>
                  <div>
                    <label htmlFor="hours" className="block text-sm font-medium text-navy mb-1">Hours Per Week (Part-Time / Casual)</label>
                    <input type="number" id="hours" min={1} max={38} step={1} value={hoursPerWeek}
                      onChange={(e) => setHoursPerWeek(clamp(Number(e.target.value || 1), 1, 38))}
                      className="block w-24 rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm" />
                    <input type="range" min={5} max={38} step={1} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1}
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
          {children}
        </div>
      </div>
    </div>
  );
}
