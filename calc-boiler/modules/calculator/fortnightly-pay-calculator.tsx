"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import ResultNextSteps, { type ResultNextStep } from "@/components/common/result-next-steps";
import StickyResult from "@/components/common/sticky-result";
import { nearestSalary, salaryHref } from "@/lib/data/salary-pages";
import {
  calculatePayBreakdown,
  formatAUD,
  formatNegAUD,
  formatPercent,
  SUPER_GUARANTEE,
  SITE_CONFIG,
} from "@/lib/constants";
import { PeriodPayTable } from "@/modules/calculator/period-pay-table";
import { AmountPresets, convertPeriod, HeadTermLinks, PERIODS_PER_YEAR, PeriodToggle, type EntryPeriod } from "@/modules/calculator/head-term-ui";

const ANNUAL_PRESETS = [50_000, 75_000, 100_000, 150_000] as const;
const PERIOD_PRESETS = [2_000, 3_000, 4_000, 5_000] as const;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Hero + interactive calculator. The long-form article below the card is a
 * server component (fortnightly-pay-calculator-content.tsx) passed in as
 * `children`, so it is not part of the client bundle.
 */
export default function FortnightlyPayCalculatorPage({ children }: { children: React.ReactNode }) {
  // "fortnightly tax calculator" searchers know their fortnightly pay, not their salary
  // (the ATO tax withheld calculator and paycalculator.com.au both take a
  // fortnightly amount), so fortnightly entry is offered alongside annual salary.
  const [period, setPeriod] = useState<EntryPeriod>("annual");
  const [amount, setAmount] = useState(80_000);
  const salary = Math.round(amount * PERIODS_PER_YEAR[period]);
  const [includeHECS, setIncludeHECS] = useState(false);

  const result = useMemo(
    () => calculatePayBreakdown({ grossSalary: salary, includeHECS, hasPrivateHealth: true }),
    [salary, includeHECS]
  );

  // Answer-first lead: the default salary's take-home every fortnight.
  const lead = calculatePayBreakdown({ grossSalary: 80_000, includeHECS: false, hasPrivateHealth: true });

  // Next steps carry the visitor's own salary (annualised), so the salary page
  // they land on already shows their figure.
  const nextSteps = useMemo<ResultNextStep[]>(() => {
    const takeHome = nearestSalary("take-home", salary);
    return [
      { href: salaryHref("take-home", takeHome), label: `See the full year on ${formatAUD(takeHome)}`, detail: "Annual take-home with super and HECS" },
      { href: "/weekly-pay-calculator/", label: "Switch to weekly pay after tax" },
      { href: "/monthly-pay-calculator/", label: "Switch to monthly pay after tax" },
      { href: "/fortnightly-tax-table/", label: "Check the ATO fortnightly tax table" },
    ];
  }, [salary]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-3 md:py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* HERO */}
        {/* Compact hero: calculator above the fold (head-term intent map, Sep 2026).
            The "divided by 26" / "use as a tax calculator" sentences moved to the top of
            fortnightly-pay-calculator-content.tsx. */}
        <section className="bg-eucalyptus-light/40 rounded-2xl p-4 md:p-6 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Fortnightly Pay Calculator</span></li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl md:text-3xl font-bold text-navy mt-2 mb-2">Fortnightly Pay &amp; Tax Calculator Australia {SITE_CONFIG.financialYear}</h1>
          <p className="text-base md:text-lg text-navy">
            On <strong>$80,000</strong> you take home <strong>{formatAUD(lead.fortnightly, 2)} a fortnight</strong> ({formatAUD(80_000 / 26, 2)} gross)
            after income tax and Medicare in FY{SITE_CONFIG.financialYear}.
          </p>
          <TrustBar className="mt-2" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto mb-12">
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="sr-only md:not-sr-only md:block text-2xl font-semibold text-navy md:mb-3 text-center">Calculate Your Fortnightly Tax &amp; Take-Home Pay</h2>
          <Card className="shadow-md py-0">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <PeriodToggle periods={["fortnightly", "annual"]} value={period} label="I'm entering my gross"
                    onChange={(p) => { setAmount(convertPeriod(amount, period, p)); setPeriod(p); }} />
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-navy mb-1">{period === "annual" ? "Gross annual salary" : "Gross fortnightly pay (before tax)"}</label>
                    <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="salary" min={0} max={period === "annual" ? 500000 : Math.round(500000 / 26)} step={period === "annual" ? 1000 : 1} value={amount}
                        onChange={(e) => setAmount(clamp(Number(e.target.value || 0), 0, period === "annual" ? 500000 : Math.round(500000 / 26)))}
                        className="block w-full rounded-md border-sandstone-dark/30 text-lg font-semibold shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    {period === "annual" && (
                      <input type="range" min={0} max={300000} step={5000} value={clamp(amount, 0, 300000)}
                        onChange={(e) => setAmount(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
                    )}
                    <AmountPresets values={period === "annual" ? ANNUAL_PRESETS : PERIOD_PRESETS} current={amount} onPick={setAmount} />
                    {/* Mobile: the result card stacks below the form, so surface the answer here too. */}
                    <p className="mt-3 rounded-lg bg-eucalyptus-light/40 px-3 py-2 text-sm text-navy md:hidden" aria-hidden="true">
                      Tax: <strong className="text-ochre">{formatAUD((result.netIncomeTax + result.medicareLevy) / 26, 2)}</strong>/fortnight · take-home <strong className="text-eucalyptus-dark">{formatAUD(result.fortnightly, 2)}</strong>
                    </p>
                    <p className="mt-1 text-xs text-warmgray-light">{period === "annual" ? `= ${formatAUD(salary / 26, 2)} gross a fortnight` : `= ${formatAUD(salary)} a year`}</p>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" checked={includeHECS} onChange={(e) => setIncludeHECS(e.target.checked)}
                      className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" />
                    <span className="text-navy">Include HECS-HELP debt</span>
                  </label>
                  <button type="submit" className="w-full bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 rounded-lg shadow-md transition-all">Calculate Fortnightly Pay</button>
                </form>

                <Card id="calc-result" className="bg-sandstone border-eucalyptus/30 border-2 shadow-sm" role="region" aria-live="polite">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-navy mb-4">Your Fortnightly Breakdown</h3>
                    <div className="space-y-2.5 text-sm">
                      <Row label="Gross Fortnightly Pay" value={formatAUD(salary / 26, 2)} bold />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Income Tax" value={formatNegAUD(result.netIncomeTax / 26, 2)} />
                      <Row label="Medicare Levy" value={formatNegAUD(result.medicareLevy / 26, 2)} />
                      {result.medicareSurcharge > 0 && <Row label="Medicare Surcharge" value={formatNegAUD(result.medicareSurcharge / 26, 2)} />}
                      {includeHECS && <Row label="HECS Repayment" value={formatNegAUD(result.hecsRepayment / 26, 2)} />}
                      <div className="border-t border-sandstone-dark/20" />
                      <div className="flex justify-between items-baseline pt-2 pb-2">
                        <span className="font-bold text-navy">Fortnightly Take-Home</span>
                        <span className="text-3xl font-extrabold text-eucalyptus-dark">{formatAUD(result.fortnightly, 2)}</span>
                      </div>
                      <div className="border-t border-sandstone-dark/20 pt-2 text-xs">
                        <Row label="Annual Equivalent" value={formatAUD(result.takeHomePay)} />
                        <Row label={`Super (${formatPercent(SUPER_GUARANTEE.rate, 0)} - employer paid)`} value={`+${formatAUD(result.superContribution / 26, 2)}/fn`} sub />
                      </div>
                      <ResultNextSteps links={nextSteps} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          {/* Rendered after the card so it never pushes the first input below the fold. */}
          <StickyResult targetId="calc-result" label="Fortnightly take-home" value={formatAUD(result.fortnightly, 2)} hint="per fortnight" />
          {/* Period-specific table directly under the calculator: the value the
              homepage's all-periods calculator doesn't give (intent map, Sep 2026). */}
          <PeriodPayTable period="fortnightly" currentSalary={salary} />
        </section>

        <HeadTermLinks className="max-w-4xl mx-auto -mt-6" terms={["payCalculatorAustralia", "salaryCalculator", "takeHomePayCalculator", "incomeTaxCalculator", "weeklyTaxCalculator"]} />

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">
          {children}
        </div>
      </div>
    </div>
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
