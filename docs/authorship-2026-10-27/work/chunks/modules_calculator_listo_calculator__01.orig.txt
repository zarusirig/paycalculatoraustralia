"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SUPER_GUARANTEE, formatAUD } from "@/lib/constants";
import { LISTO_2027_28, LISTO_CURRENT, listoPayment } from "@/lib/constants/listo";
import { CALC_FONT, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow } from "./t3-calc-shared";

// LISTO today and from 1 July 2027. All arithmetic is in lib/constants/listo.ts
// (tested); sources are cited there.

const CHECK = "mt-1 h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus focus:ring-eucalyptus/20";

export default function ListoCalculator() {
  const [income, setIncome] = useState(32_000);
  // null = follow 12% super guarantee on the income above; a number = the user typed their own total.
  const [override, setOverride] = useState<number | null>(null);
  const [temp, setTemp] = useState(false);
  const [work, setWork] = useState(true);

  const contributions = override ?? Math.round(income * SUPER_GUARANTEE.rate);
  const input = { adjustedTaxableIncome: income, concessionalContributions: contributions, temporaryResident: temp, tenPercentFromWork: work };
  const now = listoPayment(input, LISTO_CURRENT);
  const next = listoPayment(input, LISTO_2027_28);

  return (
    <Card className="shadow-md not-prose" id="listo-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>LISTO Calculator</h2>
        <p className="text-sm text-warmgray mb-6">
          LISTO is 15% of the before-tax super contributions paid for you, up to {formatAUD(LISTO_CURRENT.maxPayment)} if your income is {formatAUD(LISTO_CURRENT.incomeThreshold)} or less. From 1 July 2027 the limits rise to {formatAUD(LISTO_2027_28.maxPayment)} and {formatAUD(LISTO_2027_28.incomeThreshold)}.
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 content-start">
            <NumberField id="listo-income" label="Adjusted taxable income for the year" hint="For most employees this is taxable income: salary less deductions." value={income} onChange={(n) => { setIncome(n); setOverride(null); }} step={500} />
            <NumberField id="listo-contrib" label="Concessional (before-tax) super contributions" hint={`Employer super plus any salary sacrifice. Starts at ${Math.round(SUPER_GUARANTEE.rate * 100)}% of your income.`} value={contributions} onChange={setOverride} step={100} />
            <label className="flex items-start gap-3 text-sm text-navy">
              <input type="checkbox" checked={temp} onChange={(e) => setTemp(e.target.checked)} className={CHECK} />
              <span>I held a temporary resident visa at any time in the year (New Zealand citizens do not count)</span>
            </label>
            <label className="flex items-start gap-3 text-sm text-navy">
              <input type="checkbox" checked={work} onChange={(e) => setWork(e.target.checked)} className={CHECK} />
              <span>At least 10% of my total income comes from employment or business</span>
            </label>
          </form>

          <div className="space-y-4" role="status" aria-live="polite">
            <dl className={RESULT_LIST}>
              <ResultRow label="15% of your contributions" value={formatAUD(now.uncapped, 2)} muted />
              <ResultRow label={`LISTO now (cap ${formatAUD(LISTO_CURRENT.maxPayment)}, income ${formatAUD(LISTO_CURRENT.incomeThreshold)})`} value={now.eligible ? formatAUD(now.payment, 2) : "Not eligible"} bold />
              <ResultRow label={`LISTO from 1 July 2027 (cap ${formatAUD(LISTO_2027_28.maxPayment)}, income ${formatAUD(LISTO_2027_28.incomeThreshold)})`} value={next.eligible ? formatAUD(next.payment, 2) : "Not eligible"} bold />
              {now.eligible && next.eligible ? <ResultRow label="Extra in 2027-28" value={formatAUD(next.payment - now.payment, 2)} /> : null}
            </dl>
            {!now.eligible && next.eligible ? (
              <p className={NOTE_OK}>You are not eligible today, but the higher income limit from 1 July 2027 would bring you in.</p>
            ) : !now.eligible && !next.eligible ? (
              <p className={NOTE_WARN}>{next.reasons[0]}</p>
            ) : now.hitCap ? (
              <p className={NOTE_OK}>Your contributions already reach the current {formatAUD(LISTO_CURRENT.maxPayment)} cap. The {formatAUD(LISTO_2027_28.maxPayment)} cap from 2027-28 needs contributions of at least {formatAUD(LISTO_2027_28.maxPayment / LISTO_2027_28.rate)}.</p>
            ) : (
              <p className={NOTE_OK}>The ATO pays LISTO into your super fund after your return is processed. You do not apply, but your fund needs your tax file number.</p>
            )}
            <p className="text-xs text-warmgray-light">
              Estimate only. The ATO works out LISTO from your return and fund data. 2027-28 figures are from the law as passed; the 15% rate is assumed to carry over. General information, not advice.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
