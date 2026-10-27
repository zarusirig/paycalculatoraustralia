"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { calculatePayBreakdown, formatAUD } from "@/lib/constants";
import { HIGH_INCOME_THRESHOLD, oteBreakdown } from "@/lib/constants/ote-salary";
import { CALC_FONT, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow } from "./t3-calc-shared";

// OTE (on-target earnings) calculator (G3, wave 4). Split, commission earned
// at a given attainment, SG on base + commission (commission is ordinary time
// earnings), take-home pay at target vs base only, and the high income
// threshold test (base only). Arithmetic: lib/constants/ote-salary.ts.

export default function OteSalaryCalculator() {
  const [base, setBase] = useState(80_000);
  const [target, setTarget] = useState(40_000);
  const [attainment, setAttainment] = useState(100);

  const r = useMemo(() => oteBreakdown({ base, targetVariable: target, attainmentPct: attainment }), [base, target, attainment]);
  const takeHome = useMemo(() => calculatePayBreakdown({ grossSalary: r.totalEarned }).takeHomePay, [r.totalEarned]);
  const baseOnly = useMemo(() => calculatePayBreakdown({ grossSalary: base }).takeHomePay, [base]);

  return (
    <Card className="shadow-md not-prose" id="ote-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>OTE Salary Calculator</h2>
        <p className="text-sm text-warmgray mb-6">Enter the base salary and the commission or bonus at 100% of target from your offer. See your OTE, what you earn if you hit more or less than target, the super on it, and your take-home pay.</p>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 content-start">
            <NumberField id="ote-base" label="Base salary (a year, excluding super)" value={base} onChange={setBase} step={1000} />
            <NumberField id="ote-target" label="Commission or bonus at 100% of target (a year)" value={target} onChange={setTarget} step={1000} />
            <NumberField id="ote-att" label="Target you actually hit (%)" hint="100 = exactly on target. Try 60 or 130 to see a bad or good year." value={attainment} onChange={setAttainment} step={5} max={500} />
          </form>

          <div className="space-y-4">
            <dl className={RESULT_LIST}>
              <ResultRow label="OTE (base + target commission)" value={formatAUD(r.ote)} bold />
              <ResultRow label="Split (base : variable)" value={`${r.basePct}% : ${Math.round((100 - r.basePct) * 10) / 10}%`} muted />
              <ResultRow label={`Commission earned at ${attainment}%`} value={formatAUD(r.variableEarned)} />
              <ResultRow label="Total earned before tax" value={formatAUD(r.totalEarned)} bold />
              <ResultRow label="Super guarantee on it (12%)" value={formatAUD(r.superGuarantee)} />
              <ResultRow label="Take-home pay a year" value={formatAUD(takeHome)} bold />
              <ResultRow label="Take-home on base alone (a 0% year)" value={formatAUD(baseOnly)} muted />
            </dl>
            <p className={r.aboveHighIncomeThreshold ? NOTE_WARN : NOTE_OK} role="status" aria-live="polite">
              {r.aboveHighIncomeThreshold
                ? `Your base of ${formatAUD(base)} is at or above the ${formatAUD(HIGH_INCOME_THRESHOLD.current)} high income threshold. If no award or enterprise agreement covers you, you can't make an unfair dismissal claim.`
                : `For the ${formatAUD(HIGH_INCOME_THRESHOLD.current)} high income threshold (unfair dismissal), only your base and other guaranteed pay count, not commission, so your ${formatAUD(r.ote)} OTE is assessed as ${formatAUD(base)}.`}
            </p>
            <p className="text-xs text-warmgray-light">
              Take-home uses 2026-27 resident tax rates, the Medicare levy and LITO, with no HECS. Commission paid in a lump sum can be withheld at a different rate on the payslip; the year&rsquo;s tax is the same.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
