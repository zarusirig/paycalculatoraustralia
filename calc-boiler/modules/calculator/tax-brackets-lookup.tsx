"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_CONFIG, formatAUD, formatPercent } from "@/lib/constants";
import {
  RESIDENT_SCALES,
  analyseIncome,
  bracketRateAt,
  incomeTaxAfterLitoOnScale,
} from "@/lib/constants/tax-rates-reference";

// "Tax on $X" quick lookup + marginal rate. Every number comes from
// lib/constants/tax-rates-reference.ts, which composes australian-tax.ts, so
// it cannot disagree with the tables on the page.

const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const INPUT =
  "block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm";
const FY = SITE_CONFIG.financialYear;
const PREV = SITE_CONFIG.previousFinancialYear;
const QUICK = [45_000, 60_000, 80_000, 100_000, 135_000, 190_000];

/** /tax-on/{n}/ is generated for $30,000–$200,000 in $5,000 steps. */
function taxOnHref(income: number): string | null {
  return income >= 30_000 && income <= 200_000 && income % 5_000 === 0 ? `/tax-on/${income}/` : null;
}

export default function TaxBracketsLookup() {
  const [income, setIncome] = useState(80_000);
  const a = useMemo(() => analyseIncome(income), [income]);
  const prevTax = useMemo(() => Math.round(incomeTaxAfterLitoOnScale(a.income, RESIDENT_SCALES["2025-26"])), [a.income]);
  const nextTax = useMemo(() => Math.round(incomeTaxAfterLitoOnScale(a.income, RESIDENT_SCALES["2027-28"])), [a.income]);
  const href = taxOnHref(a.income);
  const lito = a.lito > 0 && a.grossTax > 0;
  const gap = Math.round((a.effectiveMarginalRate - a.marginalWithMedicare) * 1000) / 10;

  return (
    <Card className="shadow-md not-prose" id="tax-on-income">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={FONT}>
          How Much Tax on Your Income? Bracket &amp; Marginal Rate Lookup
        </h2>
        <p className="text-sm text-warmgray mb-5">
          Enter your taxable income for {FY}. Australian resident, full year, tax-free threshold. Includes the low income tax offset and the 2% Medicare levy.
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-[1fr_auto] items-end">
          <div>
            <label htmlFor="tb-income" className="block text-sm font-medium text-navy mb-1">Taxable income ($ a year)</label>
            <input
              id="tb-income"
              type="number"
              inputMode="numeric"
              min={0}
              step={1000}
              value={income}
              onChange={(e) => setIncome(Math.max(0, Math.min(10_000_000, Number(e.target.value || 0))))}
              className={INPUT}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setIncome(q)}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${q === income ? "border-eucalyptus bg-eucalyptus-light/50 text-navy" : "border-sandstone-dark/30 text-warmgray hover:border-eucalyptus"}`}
              >
                {formatAUD(q)}
              </button>
            ))}
          </div>
        </form>

        <div role="status" aria-live="polite" className="mt-6">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-lg bg-eucalyptus-light/40 p-3">
              <dt className="text-xs text-warmgray">Income tax {FY}</dt>
              <dd className="text-xl font-bold text-navy tabular-nums">{formatAUD(a.incomeTax)}</dd>
              <dd className="text-xs text-warmgray-light">{lito ? `after ${formatAUD(a.lito)} LITO` : "no LITO at this income"}</dd>
            </div>
            <div className="rounded-lg bg-sandstone p-3">
              <dt className="text-xs text-warmgray">Tax bracket (marginal rate)</dt>
              <dd className="text-xl font-bold text-navy tabular-nums">{formatPercent(a.bracketRate, 0)}</dd>
              <dd className="text-xs text-warmgray-light">{a.bracketRate > 0 ? `${formatPercent(a.marginalWithMedicare, 0)} with Medicare levy` : "tax-free threshold"}</dd>
            </div>
            <div className="rounded-lg bg-sandstone p-3">
              <dt className="text-xs text-warmgray">Average tax rate</dt>
              <dd className="text-xl font-bold text-navy tabular-nums">{formatPercent(a.averageIncomeTaxRate)}</dd>
              <dd className="text-xs text-warmgray-light">{formatPercent(a.averageTotalRate)} incl. Medicare</dd>
            </div>
            <div className="rounded-lg bg-sandstone p-3">
              <dt className="text-xs text-warmgray">Tax on your next $1,000</dt>
              <dd className="text-xl font-bold text-navy tabular-nums">{formatAUD(a.taxOnNext1000)}</dd>
              <dd className="text-xs text-warmgray-light">income tax + Medicare</dd>
            </div>
          </dl>

          <div className="mt-4 overflow-x-auto rounded-lg border border-sandstone-dark/20">
            <table className="w-full text-sm text-left text-warmgray">
              <thead className="bg-sandstone text-navy">
                <tr>
                  <th className="px-3 py-2 font-semibold">On {formatAUD(a.income)}</th>
                  <th className="px-3 py-2 text-right font-semibold">{PREV}</th>
                  <th className="px-3 py-2 text-right font-semibold">{FY}</th>
                  <th className="px-3 py-2 text-right font-semibold">2027-28 (legislated)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                <tr>
                  <td className="px-3 py-2">Income tax after LITO</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatAUD(prevTax)}</td>
                  <td className="px-3 py-2 text-right tabular-nums font-semibold text-navy">{formatAUD(a.incomeTax)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatAUD(nextTax)}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Tax bracket</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatPercent(bracketRateAt(a.income, RESIDENT_SCALES["2025-26"]), 0)}</td>
                  <td className="px-3 py-2 text-right tabular-nums font-semibold text-navy">{formatPercent(a.bracketRate, 0)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatPercent(bracketRateAt(a.income, RESIDENT_SCALES["2027-28"]), 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-sm text-navy">
            Take-home after income tax and Medicare: <strong className="tabular-nums">{formatAUD(a.takeHome)}</strong> a year ({formatAUD(a.takeHome / 52, 2)} a week).
            {gap > 0.05 && (
              <> Your next dollar costs <strong>{formatPercent(a.effectiveMarginalRate)}</strong>, more than the headline {formatPercent(a.marginalWithMedicare, 0)}, because {a.lito > 0 && a.income > 37_500 ? "the low income tax offset is withdrawn as income rises" : "the Medicare levy is phasing in"} (see <a href="#marginal-tax-rate" className="text-eucalyptus-dark underline">marginal tax rate</a>).</>
            )}
          </p>
          <p className="mt-2 text-sm">
            {href ? (
              <Link href={href} className="font-medium text-eucalyptus-dark hover:underline">Full breakdown: tax on {formatAUD(a.income)} &rarr;</Link>
            ) : (
              <Link href="/income-tax-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Full bracket-by-bracket breakdown in the income tax calculator &rarr;</Link>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
