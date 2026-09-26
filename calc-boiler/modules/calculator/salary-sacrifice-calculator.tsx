"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import {
  calculatePayBreakdown,
  formatAUD,
  formatNegAUD,
  SUPER_GUARANTEE,
  SITE_CONFIG,
} from "@/lib/constants";
import ResultNextSteps, { type ResultNextStep } from "@/components/common/result-next-steps";
import StickyResult from "@/components/common/sticky-result";
import { nearestSalary, salaryHref } from "@/lib/data/salary-pages";

// Lead example: $100,000 with $10,000 sacrificed, from the same engine the
// calculator uses, so the figures cannot drift from the results below.
const LEAD_SALARY = 100_000;
const LEAD_SACRIFICE = 10_000;
const LEAD_BEFORE = calculatePayBreakdown({ grossSalary: LEAD_SALARY });
const LEAD_AFTER = calculatePayBreakdown({ grossSalary: LEAD_SALARY, salarySacrifice: LEAD_SACRIFICE });
const LEAD_TAKE_HOME_DROP = LEAD_BEFORE.takeHomePay - LEAD_AFTER.takeHomePay;
const LEAD_TAX_SAVING = LEAD_BEFORE.totalDeductions - LEAD_AFTER.totalDeductions;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * The interactive part of /salary-sacrifice-calculator/: hero and calculator
 * card. The long-form content below the card is a server component
 * (salary-sacrifice-calculator-content.tsx) passed in as `children`, so it is
 * not part of this client bundle.
 */
export default function SalarySacrificeCalculatorPage({ children }: { children: React.ReactNode }) {
  const [salary, setSalary] = useState(100_000);
  const [sacrifice, setSacrifice] = useState(10_000);

  const without = useMemo(() => calculatePayBreakdown({ grossSalary: salary }), [salary]);
  const withSac = useMemo(
    () => calculatePayBreakdown({ grossSalary: salary, salarySacrifice: sacrifice }),
    [salary, sacrifice]
  );

  const taxSaved = without.totalDeductions - withSac.totalDeductions;
  const takeHomeReduction = without.takeHomePay - withSac.takeHomePay;
  const employerSuper = Math.round(salary * SUPER_GUARANTEE.rate);
  const capRoom = Math.max(0, SUPER_GUARANTEE.concessionalCap - employerSuper);

  // Next steps inside the result card, carrying the visitor's own figures.
  const nextSteps = useMemo<ResultNextStep[]>(() => {
    const taxable = nearestSalary("tax-on", Math.max(0, salary - sacrifice));
    const full = nearestSalary("take-home", salary);
    return [
      { href: salaryHref("tax-on", taxable), label: `How much tax on ${formatAUD(taxable)} taxable income`, detail: "Your salary after the sacrifice comes off" },
      { href: "/concessional-contributions-cap/", label: "Check your remaining concessional cap room" },
      { href: "/superannuation-calculator/", label: `Project what the extra ${formatAUD(sacrifice)} grows to` },
      { href: salaryHref("take-home", full), label: `See your full take-home on ${formatAUD(full)}` },
    ];
  }, [salary, sacrifice]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-3 md:py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* HERO — compact so the first input sits above the phone fold (26 Sep 2026). */}
        <section className="bg-sandstone rounded-2xl p-5 md:p-8 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-gray-400" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Salary Sacrifice Calculator</span></li>
            </ol>
          </nav>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy mt-2 mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Salary Sacrifice Calculator — How Much Will You Save?
          </h1>
          <p className="text-base md:text-lg text-warmgray">
            Sacrificing {formatAUD(LEAD_SACRIFICE)} from {formatAUD(LEAD_SALARY)} lowers take-home pay by {formatAUD(LEAD_TAKE_HOME_DROP)} but
            saves {formatAUD(LEAD_TAX_SAVING)} in income tax and Medicare levy in FY{SITE_CONFIG.financialYear}.
          </p>
          <TrustBar className="mt-2" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md py-0">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl font-semibold text-navy mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Compare Your Pay Before and After Salary Sacrifice</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Inputs */}
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
                      onChange={(e) => setSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
                  </div>
                  <div>
                    <label htmlFor="sacrifice" className="block text-sm font-medium text-navy mb-1">Salary Sacrifice Amount</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="sacrifice" min={0} max={capRoom} step={500} value={sacrifice}
                        onChange={(e) => setSacrifice(clamp(Number(e.target.value || 0), 0, Math.min(salary, capRoom)))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <p className="text-xs text-warmgray-light mt-1">Cap room: {formatAUD(capRoom)} (of {formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap). Carry-forward or other contributions? Use the <Link href="/concessional-contributions-cap/" className="text-eucalyptus-dark hover:underline">concessional cap calculator</Link>.</p>
                  </div>
                  <button type="submit" className="w-full bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 rounded-lg shadow-md transition-all">
                    Compare Pay
                  </button>
                </form>

                {/* Without Sacrifice */}
                <Card className="bg-sandstone border-0 shadow-none" role="region" aria-label="Pay without sacrifice">
                  <CardContent className="p-5">
                    <h3 className="text-sm font-semibold text-warmgray-light uppercase tracking-wider mb-3">Without Sacrifice</h3>
                    <div className="space-y-2 text-sm">
                      <Row label="Gross Salary" value={formatAUD(salary)} bold />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Income Tax" value={formatNegAUD(without.netIncomeTax)} />
                      <Row label="Medicare" value={formatNegAUD(without.medicareLevy)} />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Take-Home" value={formatAUD(without.takeHomePay)} bold green />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Employer Super" value={formatAUD(without.superContribution)} />
                      <Row label="Total Super" value={formatAUD(without.superContribution)} />
                    </div>
                  </CardContent>
                </Card>

                {/* With Sacrifice */}
                <Card className="bg-sandstone border-sandstone-dark/20 shadow-none" role="region" aria-label="Pay with sacrifice">
                  <CardContent className="p-5">
                    <h3 className="text-sm font-semibold text-eucalyptus-dark uppercase tracking-wider mb-3">With Sacrifice</h3>
                    <div className="space-y-2 text-sm">
                      <Row label="Gross Salary" value={formatAUD(salary)} bold />
                      <Row label="Sacrifice" value={formatNegAUD(sacrifice)} highlight />
                      <Row label="Taxable Income" value={formatAUD(salary - sacrifice)} />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Income Tax" value={formatNegAUD(withSac.netIncomeTax)} />
                      <Row label="Medicare" value={formatNegAUD(withSac.medicareLevy)} />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Take-Home" value={formatAUD(withSac.takeHomePay)} bold green />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Employer Super" value={formatAUD(employerSuper)} />
                      <Row label="Sacrifice to Super" value={`+${formatAUD(sacrifice)}`} highlight />
                      <Row label="Total Super" value={formatAUD(employerSuper + sacrifice)} bold />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Summary */}
              <div id="calc-result" className="mt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-eucalyptus-light/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-eucalyptus-dark">{formatAUD(taxSaved)}</div>
                  <div className="text-sm text-warmgray">Tax Saved</div>
                </div>
                <div className="bg-eucalyptus-light/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-eucalyptus-dark">{formatAUD(sacrifice)}</div>
                  <div className="text-sm text-warmgray">Extra Super</div>
                </div>
                <div className="bg-sandstone/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-ochre">{formatNegAUD(takeHomeReduction)}</div>
                  <div className="text-sm text-warmgray">Take-Home Reduction</div>
                </div>
              </div>

              <div className="mt-4 bg-sandstone border-l-4 border-eucalyptus/70 p-4 text-sm text-warmgray">
                <p>You receive <strong>{formatAUD(takeHomeReduction)}</strong> less in take-home pay, but <strong>{formatAUD(sacrifice)}</strong> goes to super — that&apos;s <strong>{formatAUD(taxSaved)}</strong> in tax savings.</p>
              </div>
              <ResultNextSteps links={nextSteps} />
              </div>
              <StickyResult targetId="calc-result" label="Tax saved" value={formatAUD(taxSaved)} hint="a year" />
            </CardContent>
          </Card>
        </section>

        {children}
      </div>
    </div>
  );
}

function Row({ label, value, bold, green, highlight }: { label: string; value: string; bold?: boolean; green?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span>
      <span className={`${bold ? "font-bold" : "font-medium"} ${green ? "text-eucalyptus-dark" : highlight ? "text-eucalyptus-dark" : "text-navy"}`}>{value}</span>
    </div>
  );
}
