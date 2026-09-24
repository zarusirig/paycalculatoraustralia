"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import {
  bonusTaxSplit,
  formatAUD,
  formatNegAUD,
  formatPercent,
  TAX_BRACKETS,
  MEDICARE_LEVY,
  SITE_CONFIG,
} from "@/lib/constants";

// Opening-paragraph example, computed by the same engine as the calculator.
const LEAD_BASE = 90_000;
const LEAD_BONUS = 10_000;
const LEAD_SPLIT = bonusTaxSplit(LEAD_BASE, LEAD_BONUS);

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Client part of /bonus-tax-calculator/: hero + calculator card. The static
 * long-form content (bonus-tax-calculator-content.tsx) is passed in as
 * `children`, so it is not part of the client bundle.
 */
export default function BonusTaxCalculatorPage({ children }: { children: React.ReactNode }) {
  const [baseSalary, setBaseSalary] = useState(90_000);
  const [bonusAmount, setBonusAmount] = useState(10_000);

  // Income tax and Medicare rows are each the with/without-bonus difference, so
  // they always add up to the total (QA 24 Sep 2026: "bonus × top marginal
  // rate" overstated the rows when the bonus crossed a bracket).
  const split = useMemo(() => bonusTaxSplit(baseSalary, bonusAmount), [baseSalary, bonusAmount]);

  const taxOnBonus = split.total;
  const netBonus = split.net;
  const effectiveBonusTaxRate = bonusAmount > 0 ? taxOnBonus / bonusAmount : 0;

  // Find marginal bracket for the combined income
  const combinedIncome = baseSalary + bonusAmount;
  let marginalRate = 0;
  for (const bracket of TAX_BRACKETS) {
    if (combinedIncome >= bracket.min) {
      marginalRate = bracket.rate;
    }
  }

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Bonus Tax Calculator</span></li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">
            Bonus Tax Calculator Australia
          </h1>
          <p className="text-lg text-warmgray">
            Tax on a bonus in Australia is the difference between the annual tax on salary alone and the annual tax on
            salary plus bonus, worked out on the {SITE_CONFIG.financialYear} scale; there is no flat bonus tax. For an
            employee on {formatAUD(LEAD_BASE)} receiving {formatAUD(LEAD_BONUS)}, that difference is{" "}
            {formatAUD(Math.round(LEAD_SPLIT.total))}, so {formatAUD(Math.round(LEAD_SPLIT.net))} of the bonus is kept.
            Employers withhold from bonus payments using ATO Schedule 5, and any over-withholding is refunded at tax time.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-6">How Much Tax on Your Bonus?</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                {/* Inputs */}
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                  <div>
                    <label htmlFor="baseSalary" className="block text-sm font-medium text-navy mb-1">Base Annual Salary</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="baseSalary" min={0} max={500000} step={1000} value={baseSalary}
                        onChange={(e) => setBaseSalary(clamp(Number(e.target.value || 0), 0, 500000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <input type="range" min={0} max={300000} step={5000} value={clamp(baseSalary, 0, 300000)}
                      onChange={(e) => setBaseSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
                  </div>

                  <div>
                    <label htmlFor="bonusAmount" className="block text-sm font-medium text-navy mb-1">Bonus / Commission Amount</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="bonusAmount" min={0} max={500000} step={500} value={bonusAmount}
                        onChange={(e) => setBonusAmount(clamp(Number(e.target.value || 0), 0, 500000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <input type="range" min={0} max={100000} step={1000} value={clamp(bonusAmount, 0, 100000)}
                      onChange={(e) => setBonusAmount(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
                  </div>
                </form>

                {/* Results */}
                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">Your Take-Home Bonus</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(netBonus)}</div>
                    <div className="text-sm text-warmgray mt-2">
                      from a <strong>{formatAUD(bonusAmount)}</strong> gross bonus
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                      <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">Tax Breakdown</h3>
                    </div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Gross Bonus" value={formatAUD(bonusAmount)} bold />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label={`Income Tax (${formatPercent(marginalRate, 0)} marginal rate)`} value={formatNegAUD(split.incomeTax)} />
                      <Row label={`Medicare Levy (${formatPercent(MEDICARE_LEVY.rate, 0)})`} value={formatNegAUD(split.medicare)} />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label="Total Tax on Bonus" value={formatNegAUD(taxOnBonus)} />
                      <Row label={`Effective Rate on Bonus`} value={formatPercent(effectiveBonusTaxRate)} />
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label="Net Bonus (Take-Home)" value={formatAUD(netBonus)} bold highlight />
                    </div>
                  </div>

                  <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-4 text-xs text-navy">
                    <strong>Note:</strong> Your bonus is taxed at your marginal rate because it sits on top of your regular salary. The combined total of <strong>{formatAUD(combinedIncome)}</strong> determines the tax bracket applied to the bonus portion.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {children}
      </div>
    </div>
  );
}

function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span>
      <span className={`${bold ? "font-bold" : "font-medium"} ${highlight ? "text-ochre" : "text-navy"}`}>{value}</span>
    </div>
  );
}
