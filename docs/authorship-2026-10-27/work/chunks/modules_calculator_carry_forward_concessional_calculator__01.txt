"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TAX_BRACKETS, formatAUD } from "@/lib/constants";
import { carryForwardPlan, deductionSaving } from "@/lib/constants/carry-forward";
import { CARRY_FORWARD } from "@/lib/constants/super-contributions";
import { CALC_FONT, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow } from "./t3-calc-shared";

// Year-by-year carry-forward position for 2026-27. All arithmetic is in
// lib/constants/carry-forward.ts (tested); sources are cited there.

const YEARS = ["2021-22", "2022-23", "2023-24", "2024-25", "2025-26"] as const;
// Placeholder starting values (an employee on a modest salary): replace with the figures from ATO online services.
const DEFAULTS: Record<string, number> = { "2021-22": 8_000, "2022-23": 9_000, "2023-24": 10_000, "2024-25": 11_500, "2025-26": 12_500 };

function marginalRate(taxableIncome: number): number {
  for (let i = TAX_BRACKETS.length - 1; i >= 0; i--) if (taxableIncome >= TAX_BRACKETS[i].min) return TAX_BRACKETS[i].rate;
  return 0;
}

export default function CarryForwardConcessionalCalculator() {
  const [contrib, setContrib] = useState<Record<string, number>>(DEFAULTS);
  const [tsb, setTsb] = useState(150_000);
  const [thisYear, setThisYear] = useState(14_000);
  const [income, setIncome] = useState(100_000);

  const plan = useMemo(
    () => carryForwardPlan({ contributedByYear: contrib, totalSuperBalance: tsb, contributionsThisYear: thisYear }),
    [contrib, tsb, thisYear],
  );
  const saving = deductionSaving(plan.headroom, marginalRate(income));

  return (
    <Card className="shadow-md not-prose" id="carry-forward-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>Carry-Forward Concessional Contributions Calculator</h2>
        <p className="text-sm text-warmgray mb-6">
          Enter the concessional (before-tax) contributions made for you in each of the last five years: employer super guarantee, salary sacrifice and personal contributions you claimed as a deduction. The starting figures are examples. Your real ones are in ATO online services under Super, Information, Carry forward concessional contributions.
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 content-start">
            {YEARS.map((y) => (
              <NumberField key={y} id={`cf-${y}`} label={`Contributions in ${y}`} value={contrib[y] ?? 0} onChange={(n) => setContrib((c) => ({ ...c, [y]: n }))} step={500} />
            ))}
            <NumberField id="cf-tsb" label="Total super balance at 30 June 2026" hint={`Must be under ${formatAUD(CARRY_FORWARD.totalSuperBalanceLimit)}.`} value={tsb} onChange={setTsb} step={5000} />
            <NumberField id="cf-this" label="Contributions in 2026-27 so far or planned" hint="Employer super plus salary sacrifice plus deductible personal." value={thisYear} onChange={setThisYear} step={500} />
            <NumberField id="cf-income" label="Taxable income (for the tax saving)" value={income} onChange={setIncome} step={1000} />
          </form>

          <div className="space-y-4" role="status" aria-live="polite">
            <dl className={RESULT_LIST}>
              <ResultRow label="General cap 2026-27" value={formatAUD(plan.generalCap)} muted />
              <ResultRow label="Unused cap from the last 5 years" value={formatAUD(plan.totalUnused)} />
              <ResultRow label="Usable this year" value={plan.eligible ? formatAUD(plan.available) : "Nil (balance too high)"} />
              <ResultRow label="Your cap for 2026-27" value={formatAUD(plan.availableCap)} bold />
              <ResultRow label="Still available to contribute" value={formatAUD(plan.headroom)} bold />
              <ResultRow label="Est. tax saved using all of it as a deduction" value={formatAUD(saving)} muted />
            </dl>
            {!plan.eligible ? (
              <p className={NOTE_WARN}>Your total super balance at 30 June 2026 is {formatAUD(CARRY_FORWARD.totalSuperBalanceLimit)} or more, so you cannot use carried-forward amounts this year. Only the general cap applies.</p>
            ) : plan.excess > 0 ? (
              <p className={NOTE_WARN}>Your contributions are {formatAUD(plan.excess)} over your cap for the year. Excess amounts are added to your taxable income with a 15% offset. See the cap guide.</p>
            ) : plan.expiringThisYear > 0 ? (
              <p className={NOTE_OK}>{formatAUD(plan.expiringThisYear)} of your 2021-22 cap expires at 30 June 2027 if you do not use it. The ATO uses the oldest amounts first.</p>
            ) : (
              <p className={NOTE_OK}>The ATO applies your oldest unused amounts first, once your contributions pass the general cap.</p>
            )}

            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 bg-sandstone/40">
              <table className="w-full text-sm">
                <caption className="sr-only">Unused concessional cap by year</caption>
                <thead>
                  <tr className="text-left text-navy">
                    <th scope="col" className="px-3 py-2 font-semibold">Year</th>
                    <th scope="col" className="px-3 py-2 font-semibold text-right">Cap</th>
                    <th scope="col" className="px-3 py-2 font-semibold text-right">Unused</th>
                    <th scope="col" className="px-3 py-2 font-semibold text-right">Expires after</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/20 text-navy tabular-nums">
                  {plan.rows.map((r) => (
                    <tr key={r.year}>
                      <th scope="row" className="px-3 py-2 text-left font-normal">{r.year}</th>
                      <td className="px-3 py-2 text-right">{formatAUD(r.cap)}</td>
                      <td className="px-3 py-2 text-right">{formatAUD(r.unused)}</td>
                      <td className="px-3 py-2 text-right">{r.usableUntil}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-warmgray-light">
              Estimate only. Contributions count in the year your fund receives them. The tax saving is a marginal-rate estimate that ignores Division 293 and other offsets. General information, not advice.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
