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
  formatPercent,
  MEDICARE_LEVY,
  SITE_CONFIG,
  TAX_BRACKETS,
} from "@/lib/constants";
import {
  calculateSchedule5MethodB,
  FREQUENCY_LABELS,
  PAY_PERIODS,
  SCHEDULE_5_WITHHOLDING_LIMIT,
  type PayFrequency,
} from "@/lib/constants/payg-withholding";

// Why this page exists (GSC to 27 Aug 2026): "commission tax calculator" and
// its variants (96 queries, 655 impressions) were landing on the bonus
// calculator and converting at 14% — the strongest intent match on the site
// with no node of its own. It reuses the bonus engine (annual liability delta)
// and the Schedule 5 engine (per-payment withholding); nothing here is a new
// calculation.

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function annualTaxOn(base: number, commission: number, includeHECS = false) {
  const without = calculatePayBreakdown({ grossSalary: base, includeHECS });
  const withCommission = calculatePayBreakdown({ grossSalary: base, bonus: commission, includeHECS });
  return withCommission.totalDeductions - without.totalDeductions;
}

const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };

/**
 * The static long-form content lives in commission-tax-calculator-content.tsx
 * (a server component) and is passed in as `children`, so it is not part of
 * this client bundle.
 */
export default function CommissionTaxCalculatorPage({ children }: { children: React.ReactNode }) {
  const [baseSalary, setBaseSalary] = useState(80_000);
  const [commission, setCommission] = useState(5_000);
  const [frequency, setFrequency] = useState<PayFrequency>("fortnightly");
  const [hasSTSL, setHasSTSL] = useState(false);

  const result = useMemo(() => {
    const annualTax = annualTaxOn(baseSalary, commission, hasSTSL);
    const regularPerPeriod = baseSalary / PAY_PERIODS[frequency];
    const withholding = calculateSchedule5MethodB(regularPerPeriod, commission, frequency, { hasSTSL });
    const combined = baseSalary + commission;
    let marginalRate = 0;
    for (const b of TAX_BRACKETS) if (combined >= b.min) marginalRate = b.rate;
    return {
      annualTax,
      netAnnual: commission - annualTax,
      effectiveAnnual: commission > 0 ? annualTax / commission : 0,
      withholding,
      settlement: withholding.withheldFromAdditionalPayment - annualTax, // + refund, − bill
      marginalRate,
      combined,
    };
  }, [baseSalary, commission, frequency, hasSTSL]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Commission Tax Calculator</span></li>
            </ol>
          </nav>
          <h1 style={FONT} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">
            Commission Tax Calculator Australia
          </h1>
          <p className="text-lg text-warmgray">
            Two numbers people confuse: the tax a commission adds to your year, and the amount your employer
            withholds from the commission pay under ATO Schedule 5. This calculator shows both for {SITE_CONFIG.financialYear},
            and the refund or bill that settles the gap.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">How Much Tax on Your Commission?</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                  <div>
                    <label htmlFor="baseSalary" className="block text-sm font-medium text-navy mb-1">Base salary or retainer (annual)</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="baseSalary" min={0} max={500000} step={1000} value={baseSalary}
                        onChange={(e) => setBaseSalary(clamp(Number(e.target.value || 0), 0, 500000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <input type="range" min={0} max={300000} step={5000} value={clamp(baseSalary, 0, 300000)}
                      onChange={(e) => setBaseSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
                    <p className="text-xs text-warmgray-light mt-1">Commission-only? Enter $0.</p>
                  </div>

                  <div>
                    <label htmlFor="commission" className="block text-sm font-medium text-navy mb-1">Commission payment</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="commission" min={0} max={500000} step={250} value={commission}
                        onChange={(e) => setCommission(clamp(Number(e.target.value || 0), 0, 500000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <input type="range" min={0} max={100000} step={500} value={clamp(commission, 0, 100000)}
                      onChange={(e) => setCommission(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
                  </div>

                  <div>
                    <label htmlFor="frequency" className="block text-sm font-medium text-navy mb-1">How often you are paid</label>
                    <select id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value as PayFrequency)}
                      className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20">
                      {(Object.keys(PAY_PERIODS) as PayFrequency[]).map((f) => (
                        <option key={f} value={f}>{FREQUENCY_LABELS[f]}</option>
                      ))}
                    </select>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-navy">
                    <input type="checkbox" checked={hasSTSL} onChange={(e) => setHasSTSL(e.target.checked)} className="accent-eucalyptus" />
                    I have a HECS-HELP / study loan
                  </label>
                </form>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-5 text-center shadow-sm">
                      <div className="text-xs font-semibold text-ochre uppercase tracking-wider mb-2">Tax the commission adds to your year</div>
                      <div className="text-3xl font-extrabold text-navy">{formatAUD(result.annualTax)}</div>
                      <div className="text-xs text-warmgray mt-1">{formatPercent(result.effectiveAnnual)} of {formatAUD(commission)}</div>
                    </div>
                    <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-5 text-center shadow-sm">
                      <div className="text-xs font-semibold text-ochre uppercase tracking-wider mb-2">Withheld from the commission pay</div>
                      <div className="text-3xl font-extrabold text-navy">{formatAUD(result.withholding.withheldFromAdditionalPayment)}</div>
                      <div className="text-xs text-warmgray mt-1">{formatPercent(result.withholding.effectiveRate)} under Schedule 5</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                      <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">Breakdown</h3>
                    </div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Gross commission" value={formatAUD(commission)} bold />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label={`Marginal rate on combined ${formatAUD(result.combined)}`} value={`${formatPercent(result.marginalRate, 0)} + ${formatPercent(MEDICARE_LEVY.rate, 0)} Medicare`} />
                      <Row label="Tax added to the year" value={formatNegAUD(result.annualTax)} />
                      <Row label="Net commission for the year" value={formatAUD(result.netAnnual)} bold />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label={`Withheld on the ${FREQUENCY_LABELS[frequency].toLowerCase()} pay (Schedule 5)`} value={formatNegAUD(result.withholding.withheldFromAdditionalPayment)} />
                      <Row label="In hand on the day" value={formatAUD(result.withholding.netAdditionalPayment)} bold highlight />
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row
                        label={result.settlement >= 0 ? "Comes back at tax time" : "Owed at tax time"}
                        value={formatAUD(Math.abs(result.settlement))}
                      />
                    </div>
                  </div>

                  {result.withholding.withholdingLimitApplied && (
                    <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-4 text-xs text-navy">
                      <strong>Withholding limit applied.</strong> Schedule 5 caps withholding on a commission at {formatPercent(SCHEDULE_5_WITHHOLDING_LIMIT, 0)} of the payment; the uncapped figure was {formatAUD(result.withholding.uncappedWithholding)}.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">
          {children}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center gap-4 ${highlight ? "bg-eucalyptus-light/40 -mx-2 px-2 py-1 rounded" : ""}`}>
      <span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span>
      <span className={`tabular-nums ${bold ? "font-bold text-navy" : "text-navy"}`}>{value}</span>
    </div>
  );
}
