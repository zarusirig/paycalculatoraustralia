"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LITO, SITE_CONFIG, formatAUD } from "@/lib/constants";
import { litoBreakdown, type LitoPhase } from "@/lib/constants/tax-rates-reference";

// LITO calculator. All maths is litoBreakdown() in
// lib/constants/tax-rates-reference.ts (ATO QC105020 formula on the current
// resident scale), so the calculator and the tables on the page agree.

const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const INPUT =
  "block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm";
const FY = SITE_CONFIG.financialYear;
const m = (n: number) => formatAUD(n, n % 1 === 0 ? 0 : 2);

function working(phase: LitoPhase, income: number): string {
  if (phase === "full") return `Income is ${m(LITO.fullOffsetCeiling)} or less, so you get the full ${m(LITO.maxOffset)}.`;
  if (phase === "phase1")
    return `${m(LITO.maxOffset)} − (${m(income)} − ${m(LITO.fullOffsetCeiling)}) × 5c = ${m(LITO.maxOffset - (income - LITO.fullOffsetCeiling) * LITO.phaseOut1.rate)}`;
  if (phase === "phase2") {
    const mid = LITO.maxOffset - (LITO.phaseOut1.end - LITO.fullOffsetCeiling) * LITO.phaseOut1.rate;
    return `${m(mid)} − (${m(income)} − ${m(LITO.phaseOut1.end)}) × 1.5c = ${m(Math.max(0, mid - (income - LITO.phaseOut1.end) * LITO.phaseOut2.rate))}`;
  }
  return `Income is over ${m(LITO.nilOffsetIncome)}, so no LITO applies.`;
}

export default function LitoCalculator() {
  const [income, setIncome] = useState(42_000);
  const r = useMemo(() => litoBreakdown(income), [income]);

  return (
    <Card className="shadow-md not-prose" id="lito-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={FONT}>LITO Calculator {FY}</h2>
        <p className="text-sm text-warmgray mb-5">
          Enter your taxable income (income minus deductions) for the year. Australian resident, {FY} rates.
        </p>
        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="lito-income" className="block text-sm font-medium text-navy mb-1">Taxable income ($ a year)</label>
          <input
            id="lito-income"
            type="number"
            inputMode="numeric"
            min={0}
            step={500}
            value={income}
            onChange={(e) => setIncome(Math.max(0, Math.min(1_000_000, Number(e.target.value || 0))))}
            className={INPUT}
          />
        </form>

        <div role="status" aria-live="polite" className="mt-6">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-lg bg-eucalyptus-light/40 p-3">
              <dt className="text-xs text-warmgray">Your LITO</dt>
              <dd className="text-xl font-bold text-navy tabular-nums">{m(r.offset)}</dd>
            </div>
            <div className="rounded-lg bg-sandstone p-3">
              <dt className="text-xs text-warmgray">Tax before LITO</dt>
              <dd className="text-xl font-bold text-navy tabular-nums">{m(r.taxBeforeLito)}</dd>
            </div>
            <div className="rounded-lg bg-sandstone p-3">
              <dt className="text-xs text-warmgray">Tax after LITO</dt>
              <dd className="text-xl font-bold text-navy tabular-nums">{m(r.taxAfterLito)}</dd>
            </div>
            <div className="rounded-lg bg-sandstone p-3">
              <dt className="text-xs text-warmgray">Tax saved by LITO</dt>
              <dd className="text-xl font-bold text-navy tabular-nums">{m(r.offsetUsed)}</dd>
            </div>
          </dl>
          <p className="mt-4 rounded-lg bg-sandstone/60 p-3 text-sm text-navy font-mono">{working(r.phase, r.income)}</p>
          {r.offsetWasted > 0 && (
            <p className="mt-3 text-sm text-warmgray">
              Your tax before the offset is only {m(r.taxBeforeLito)}, so {m(r.offsetWasted)} of the offset goes unused. LITO is non-refundable: it can reduce tax to nil but is never paid out.
            </p>
          )}
          <p className="mt-3 text-xs text-warmgray-light">
            Income tax only; the 2% Medicare levy is separate and LITO does not reduce it. You don&rsquo;t claim LITO: the ATO applies it when you lodge your return.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
