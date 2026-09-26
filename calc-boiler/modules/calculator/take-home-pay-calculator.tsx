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
import { AmountPresets, convertPeriod, PERIOD_NOUN, PERIODS_PER_YEAR, PeriodToggle, type EntryPeriod } from "@/modules/calculator/head-term-ui";

// Hero lead figure, computed from the tax engine.
const EX80 = calculatePayBreakdown({ grossSalary: 80_000 });

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const PRESETS: Record<EntryPeriod, readonly number[]> = {
  annual: [50_000, 75_000, 100_000, 150_000],
  monthly: [4_000, 6_000, 8_000, 10_000],
  fortnightly: [2_000, 3_000, 4_000, 5_000],
  weekly: [1_000, 1_500, 2_000, 2_500],
};
const MAX_BY_PERIOD: Record<EntryPeriod, number> = { annual: 500_000, monthly: 45_000, fortnightly: 20_000, weekly: 10_000 };

/**
 * The interactive part of /take-home-pay-calculator/: hero and calculator
 * card. The long-form content below the card is a server component
 * (take-home-pay-calculator-content.tsx) passed in as `children`, so it is not
 * part of this client bundle.
 */
export default function TakeHomePayCalculatorPage({ children, afterCalculator }: { children: React.ReactNode; afterCalculator?: React.ReactNode }) {
  // Net-pay calculators on page 1 (paycalculator.com.au, moneysmart,
  // wagecalculator) all accept the pay period the user actually knows.
  const [period, setPeriod] = useState<EntryPeriod>("annual");
  const [amount, setAmount] = useState(80_000);
  const salary = Math.round(amount * PERIODS_PER_YEAR[period]);
  const [includeHECS, setIncludeHECS] = useState(false);
  const [hasPrivateHealth, setHasPrivateHealth] = useState(true);

  const result = useMemo(
    () => calculatePayBreakdown({ grossSalary: salary, includeHECS, hasPrivateHealth }),
    [salary, includeHECS, hasPrivateHealth]
  );

  // The headline figure in the result card, in the period the visitor entered.
  const headline = period === "annual" ? result.takeHomePay : period === "monthly" ? result.monthly : period === "fortnightly" ? result.fortnightly : result.weekly;

  // Next steps carry the visitor's own salary so the next page answers the
  // follow-up question straight away.
  const nextSteps = useMemo<ResultNextStep[]>(() => {
    const takeHome = nearestSalary("take-home", salary);
    const taxOn = nearestSalary("tax-on", salary);
    const hourly = nearestSalary("salary-to-hourly", salary);
    return [
      { href: salaryHref("take-home", takeHome), label: `See the full breakdown for ${formatAUD(takeHome)}`, detail: "Weekly, fortnightly and monthly, with super" },
      { href: salaryHref("tax-on", taxOn), label: `How much tax you pay on ${formatAUD(taxOn)}` },
      { href: salaryHref("salary-to-hourly", hourly), label: `What ${formatAUD(hourly)} a year is per hour` },
      { href: "/fortnightly-pay-calculator/", label: "Work out your fortnightly pay after tax" },
    ];
  }, [salary]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-3 md:py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* HERO */}
        {/* Compact hero: the calculator must sit above the fold (intent map, Sep 2026).
            The "enter your own pay" sentence moved to take-home-pay-calculator-content.tsx. */}
        <section className="bg-eucalyptus-light/40 rounded-2xl p-4 md:p-6 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb"><ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-gray-400" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Take Home Pay Calculator</span></li>
          </ol></nav>
          <h1 className="text-2xl md:text-3xl font-bold text-navy mt-2 mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Take Home Pay Calculator Australia {SITE_CONFIG.financialYear}
            <span className="hidden md:inline"> — </span>
            <span className="block text-base font-semibold text-warmgray md:inline md:text-3xl md:font-bold md:text-navy">Net Pay After Tax</span>
          </h1>
          <p className="text-base md:text-lg text-navy">On <strong>$80,000</strong> you take home <strong>{formatAUD(EX80.takeHomePay)} a year</strong> ({formatAUD(EX80.fortnightly)} a fortnight) after income tax and Medicare in FY{SITE_CONFIG.financialYear}.</p>
          <TrustBar className="mt-2" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto mb-12">
          <Card className="shadow-md py-0">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <PeriodToggle periods={["annual", "monthly", "fortnightly", "weekly"]} value={period} label="I'm entering my gross pay"
                    onChange={(p) => { setAmount(convertPeriod(amount, period, p)); setPeriod(p); }} />
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-navy mb-1">Gross {period === "annual" ? "annual salary" : `${period} pay`} (before tax)</label>
                    <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="salary" min={0} max={MAX_BY_PERIOD[period]} step={period === "annual" ? 1000 : 1} value={amount}
                        onChange={(e) => setAmount(clamp(Number(e.target.value || 0), 0, MAX_BY_PERIOD[period]))}
                        className="block w-full rounded-md border-sandstone-dark/30 text-lg font-semibold shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    {period === "annual" && (
                      <input type="range" min={0} max={300000} step={5000} value={clamp(amount, 0, 300000)}
                        onChange={(e) => setAmount(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
                    )}
                    <AmountPresets values={PRESETS[period]} current={amount} onPick={setAmount} />
                    {period !== "annual" && <p className="mt-1 text-xs text-warmgray-light">= {formatAUD(salary)} a year</p>}
                    {/* Mobile: the result card stacks below the form, so surface the answer here too. */}
                    <p className="mt-3 rounded-lg bg-eucalyptus-light/40 px-3 py-2 text-sm text-navy md:hidden" aria-hidden="true">
                      Take-home: <strong className="text-eucalyptus-dark">{formatAUD(result.takeHomePay)}</strong>/yr · {formatAUD(result.fortnightly)}/fn · {formatAUD(result.weekly)}/wk
                    </p>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={includeHECS}
                    onChange={(e) => setIncludeHECS(e.target.checked)}
                    className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" /><span className="text-navy">Include HECS-HELP debt</span></label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={hasPrivateHealth}
                    onChange={(e) => setHasPrivateHealth(e.target.checked)}
                    className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" /><span className="text-navy">Private health insurance</span></label>
                  <button type="submit" className="w-full bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 rounded-lg shadow-md transition-all">Calculate Take-Home Pay</button>
                </form>

                <Card id="calc-result" className="bg-sandstone border-0 shadow-none" role="region" aria-live="polite">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-navy mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Your Net Pay After Tax</h2>
                    {/* Headline result first, moneysmart-style: the answer before the breakdown. */}
                    <div className="mb-4 rounded-xl bg-white p-4 text-center shadow-sm">
                      <p className="text-xs text-warmgray-light">You take home</p>
                      <p className="text-3xl font-extrabold text-eucalyptus-dark">{formatAUD(headline)}</p>
                      <p className="text-xs text-warmgray">per {PERIOD_NOUN[period]} · {formatPercent(result.effectiveTaxRate)} effective tax</p>
                      <ResultNextSteps links={nextSteps} />
                    </div>
                    <div className="space-y-2.5 text-sm">
                      <Row label="Gross Salary" value={formatAUD(salary)} bold />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Income Tax" value={formatNegAUD(result.netIncomeTax)} />
                      {result.litoOffset > 0 && <Row label="  LITO Offset" value={`+${formatAUD(result.litoOffset)}`} sub />}
                      <Row label="Medicare Levy" value={formatNegAUD(result.medicareLevy)} />
                      {result.medicareSurcharge > 0 && <Row label="Medicare Surcharge" value={formatNegAUD(result.medicareSurcharge)} />}
                      {includeHECS && <Row label="HECS Repayment" value={formatNegAUD(result.hecsRepayment)} />}
                      <div className="border-t border-sandstone-dark/20" />
                      <div className="flex justify-between items-baseline pt-1">
                        <span className="font-bold text-navy">Take-Home Pay</span>
                        <span className="text-2xl font-extrabold text-eucalyptus-dark">{formatAUD(result.takeHomePay)}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-center bg-sandstone rounded-lg p-2">
                        <div><div className="font-semibold text-navy">{formatAUD(result.weekly, 2)}</div><div className="text-warmgray-light">per week</div></div>
                        <div><div className="font-semibold text-navy">{formatAUD(result.fortnightly, 2)}</div><div className="text-warmgray-light">per fortnight</div></div>
                        <div><div className="font-semibold text-navy">{formatAUD(result.monthly, 2)}</div><div className="text-warmgray-light">per month</div></div>
                      </div>
                      <div className="border-t border-sandstone-dark/20 pt-2">
                        <Row label={`Super (${formatPercent(SUPER_GUARANTEE.rate, 0)})`} value={`+${formatAUD(result.superContribution)}`} />
                        <Row label="Total Package" value={formatAUD(result.totalPackage)} bold />
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-eucalyptus-light/30 p-2 text-xs">
                        <span className="text-warmgray">Effective tax rate</span>
                        <span className="font-semibold text-eucalyptus-dark">{formatPercent(result.effectiveTaxRate)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          {/* Rendered after the card so it never pushes the first input below the fold. */}
          <StickyResult targetId="calc-result" label="Take-home pay" value={formatAUD(headline)} hint={`per ${PERIOD_NOUN[period]}`} />
        </section>

        {afterCalculator}
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, bold, sub }: { label: string; value: string; bold?: boolean; sub?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${sub ? "pl-4 text-xs text-warmgray-light" : ""}`}>
      <span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span>
      <span className={bold ? "font-bold text-navy" : "font-medium text-navy"}>{value}</span>
    </div>
  );
}

