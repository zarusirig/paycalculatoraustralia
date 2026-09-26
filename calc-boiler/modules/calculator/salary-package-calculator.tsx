"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import { calculatePayBreakdown, formatAUD, formatNegAUD, formatPercent, SITE_CONFIG, SUPER_GUARANTEE } from "@/lib/constants";
import { packageFromBase, splitPackage, type PackageSplit } from "@/lib/constants/salary-package";

// Why this page exists (GSC to 27 Aug 2026): 281 distinct queries — "how to
// calculate superannuation from total package", "75k including super", "whats
// 90 plus super", "base salary calculator" — were landing on the super
// guarantee calculator (0.24% CTR) and the homepage. Nothing answered them.

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

type Mode = "package" | "base";
const RATE_PCT = formatPercent(SUPER_GUARANTEE.rate, 0);

const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };

function takeHome(base: number) {
  return calculatePayBreakdown({ grossSalary: base });
}

/**
 * The static long-form content lives in salary-package-calculator-content.tsx
 * (a server component) and is passed in as `children`, so it is not part of
 * this client bundle.
 */
export default function SalaryPackageCalculatorPage({ children, afterCalculator }: { children: React.ReactNode; afterCalculator?: React.ReactNode }) {
  const [amount, setAmount] = useState(100_000);
  const [mode, setMode] = useState<Mode>("package");

  const result = useMemo(() => {
    const split: PackageSplit = mode === "package" ? splitPackage(amount) : packageFromBase(amount);
    const pay = takeHome(split.base);
    return { split, pay };
  }, [amount, mode]);

  const { split, pay } = result;

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Salary Package Calculator</span></li>
            </ol>
          </nav>
          <h1 style={FONT} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">
            Salary Package Calculator — Including Super or Plus Super
          </h1>
          <p className="text-lg text-warmgray">
            &ldquo;{formatAUD(112_000)} package&rdquo;, &ldquo;{formatAUD(100_000)} plus super&rdquo; and &ldquo;{formatAUD(100_000)} including super&rdquo; are three different offers.
            Enter the number from the job ad and see the base salary, the {RATE_PCT} super, the total package and your {SITE_CONFIG.financialYear} take-home pay.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">Split a Package Into Base Salary, Super and Take-Home</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                  <fieldset>
                    <legend className="block text-sm font-medium text-navy mb-2">The figure in the offer is</legend>
                    <div className="space-y-2 text-sm text-navy">
                      <label className="flex items-start gap-2">
                        <input type="radio" name="mode" value="package" checked={mode === "package"} onChange={() => setMode("package")} className="mt-1 accent-eucalyptus" />
                        <span><strong>A package that includes super</strong><br /><span className="text-warmgray">&ldquo;{formatAUD(amount)} package&rdquo;, &ldquo;including super&rdquo;, &ldquo;total remuneration&rdquo;</span></span>
                      </label>
                      <label className="flex items-start gap-2">
                        <input type="radio" name="mode" value="base" checked={mode === "base"} onChange={() => setMode("base")} className="mt-1 accent-eucalyptus" />
                        <span><strong>A base salary, super on top</strong><br /><span className="text-warmgray">&ldquo;{formatAUD(amount)} plus super&rdquo;, &ldquo;excluding super&rdquo;</span></span>
                      </label>
                    </div>
                  </fieldset>
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-navy mb-1">Amount (annual)</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="amount" min={0} max={1_000_000} step={1000} value={amount}
                        onChange={(e) => setAmount(clamp(Number(e.target.value || 0), 0, 1_000_000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <input type="range" min={30_000} max={300_000} step={1000} value={clamp(amount, 30_000, 300_000)}
                      onChange={(e) => setAmount(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
                  </div>
                </form>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-5 text-center shadow-sm">
                      <div className="text-xs font-semibold text-ochre uppercase tracking-wider mb-2">Base salary</div>
                      <div className="text-2xl font-extrabold text-navy">{formatAUD(split.base)}</div>
                    </div>
                    <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-5 text-center shadow-sm">
                      <div className="text-xs font-semibold text-ochre uppercase tracking-wider mb-2">Super ({RATE_PCT})</div>
                      <div className="text-2xl font-extrabold text-navy">{formatAUD(split.superAmount)}</div>
                    </div>
                    <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-5 text-center shadow-sm">
                      <div className="text-xs font-semibold text-ochre uppercase tracking-wider mb-2">Total package</div>
                      <div className="text-2xl font-extrabold text-navy">{formatAUD(split.total)}</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                      <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">Take-home pay on the {formatAUD(split.base)} base ({SITE_CONFIG.financialYear})</h3>
                    </div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Income tax (after LITO)" value={formatNegAUD(pay.netIncomeTax)} />
                      <Row label="Medicare levy" value={formatNegAUD(pay.medicareLevy)} />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label="Per year" value={formatAUD(pay.takeHomePay)} bold highlight />
                      <Row label="Per month" value={formatAUD(pay.monthly)} />
                      <Row label="Per fortnight" value={formatAUD(pay.fortnightly)} />
                      <Row label="Per week" value={formatAUD(pay.weekly)} />
                      <Row label="Effective tax rate" value={formatPercent(pay.effectiveTaxRate)} />
                    </div>
                  </div>

                  {split.capApplied && (
                    <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-4 text-xs text-navy">
                      <strong>Super cap applied.</strong> Employers only have to pay SG on base salary up to the maximum contribution base ({formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} a year), so super is held at {formatAUD(SUPER_GUARANTEE.maxSGAnnual)} and the rest of the package is base.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">
          {afterCalculator}
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
