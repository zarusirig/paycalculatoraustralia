"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD, formatPercent } from "@/lib/constants";
import { raiseOutcome } from "@/lib/constants/marginal-rates";
import { CALC_FONT, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow } from "./t3-calc-shared";

// Raise / bonus tax calculator for /marginal-tax-rates/. All arithmetic is in
// lib/constants/marginal-rates.ts (tested): a difference of two runs of the
// site's 2026-27 tax engine, so bracket crossings, the low income tax offset,
// the Medicare levy and HELP all land where they really fall.

export default function MarginalRateCalculator() {
  const [salary, setSalary] = useState(85_000);
  const [raise, setRaise] = useState(10_000);
  const [help, setHelp] = useState(false);
  const [noPhi, setNoPhi] = useState(false);

  const r = useMemo(() => raiseOutcome({ salary, raise, hasHelpDebt: help, noPrivateHealth: noPhi }), [salary, raise, help, noPhi]);
  const pct = (n: number) => formatPercent(n, 1);

  return (
    <Card className="shadow-md not-prose" id="marginal-rate-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>Marginal vs Average Tax Rate on a Raise or Bonus</h2>
        <p className="text-sm text-warmgray mb-6">Enter your current taxable income and the extra you are about to earn. The calculator shows what share of that extra the tax system takes, set against your average rate. 2026-27 resident rates.</p>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 content-start">
            <NumberField id="mr-salary" label="Current taxable income ($)" hint="Annual, before tax and excluding super." value={salary} onChange={setSalary} step={1000} max={2_000_000} />
            <NumberField id="mr-raise" label="Extra income ($ a year)" hint="A raise, bonus, overtime or side income." value={raise} onChange={setRaise} step={500} max={2_000_000} />
            <label className="flex items-center gap-2 text-sm text-navy sm:col-span-2">
              <input type="checkbox" checked={help} onChange={(e) => setHelp(e.target.checked)} className="h-4 w-4 rounded border-sandstone-dark/30" />
              I have a HELP / HECS-HELP debt
            </label>
            <label className="flex items-center gap-2 text-sm text-navy sm:col-span-2">
              <input type="checkbox" checked={noPhi} onChange={(e) => setNoPhi(e.target.checked)} className="h-4 w-4 rounded border-sandstone-dark/30" />
              No private hospital cover (Medicare levy surcharge applies)
            </label>
          </form>

          <div className="space-y-4">
            <dl className={RESULT_LIST}>
              <ResultRow label="Extra income" value={formatAUD(r.raise)} />
              <ResultRow label="Extra tax, Medicare and HELP" value={`−${formatAUD(r.extraTax)}`} muted />
              <ResultRow label="You keep" value={formatAUD(r.netGain)} bold />
              <ResultRow label="Marginal rate on this extra" value={pct(r.marginalRateOnRaise)} bold />
              <ResultRow label="Average rate before" value={pct(r.averageBefore)} muted />
              <ResultRow label="Average rate after" value={pct(r.averageAfter)} muted />
              <ResultRow label="Extra take-home each fortnight" value={formatAUD(r.perFortnight, 2)} />
              <ResultRow label="Extra take-home each week" value={formatAUD(r.perWeek, 2)} />
            </dl>
            <p className={r.raiseIsTaxFree ? NOTE_OK : r.marginalRateOnRaise > r.scaleRateAfter + 0.0201 ? NOTE_WARN : NOTE_OK} role="status" aria-live="polite">
              {r.raise === 0
                ? "Enter an amount to see what it is worth after tax."
                : r.raiseIsTaxFree
                  ? "No extra tax: this extra income sits inside the tax-free threshold (or is absorbed by the low income tax offset)."
                  : `Of every extra $1 you earn, you keep about ${Math.round((1 - r.marginalRateOnRaise) * 100)}c. Your average rate moves from ${pct(r.averageBefore)} to ${pct(r.averageAfter)}, but only the extra income is taxed at the higher rate, so a raise never cuts your take-home pay.`}
            </p>
            <p className="text-xs text-warmgray-light">
              Resident, single, full-year, no other offsets or deductions. HELP uses the marginal repayment system; the Medicare levy surcharge uses the 2026-27 income tiers. Withholding on a one-off bonus or back payment can be more or less than the true annual figure shown here; the difference settles when you lodge your return.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
