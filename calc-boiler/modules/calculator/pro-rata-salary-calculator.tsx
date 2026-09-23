"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { EMPLOYMENT, calculatePayBreakdown, formatAUD, formatNegAUD } from "@/lib/constants";
import { PRO_RATA_DEFAULTS, calculateProRata, type ProRataInput } from "@/lib/constants/minimum-wage";

function num(v: string, min: number, max: number): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function Row({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className={muted ? "text-warmgray-light" : "text-warmgray"}>{label}</span>
      <span className={`tabular-nums ${bold ? "font-bold text-navy" : "text-navy"}`}>{value}</span>
    </div>
  );
}

const inputClass =
  "block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm";

export default function ProRataSalaryCalculator() {
  const [input, setInput] = useState<ProRataInput>(PRO_RATA_DEFAULTS);
  const set = <K extends keyof ProRataInput>(k: K, v: ProRataInput[K]) => setInput((p) => ({ ...p, [k]: v }));

  const result = useMemo(() => calculateProRata(input), [input]);
  const tax = useMemo(() => calculatePayBreakdown({ grossSalary: Math.round(result.annualSalary) }), [result.annualSalary]);
  const partYear = input.monthsWorked < 12;

  const afterTaxWeekly = tax.takeHomePay / EMPLOYMENT.weeksPerYear;

  return (
    <Card className="not-prose shadow-md">
      <CardContent className="p-6 md:p-8">
        <h2 className="mb-1 text-xl font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          Pro-Rata Salary Calculator
        </h2>
        <p className="mb-6 text-sm text-warmgray">
          Enter the full-time salary and the hours or days you work. The result updates as you type.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div>
              <label htmlFor="pr-fte" className="mb-1 block text-sm font-medium text-navy">Full-time (FTE) salary</label>
              <div className="flex items-center">
                <span className="mr-2 text-warmgray-light">$</span>
                <input id="pr-fte" type="number" min={0} max={1_000_000} step={1000} value={input.fteSalary}
                  onChange={(e) => set("fteSalary", num(e.target.value, 0, 1_000_000))} className={inputClass} />
              </div>
              <p className="mt-1 text-xs text-warmgray-light">The salary the job would pay full time, before tax and excluding super.</p>
            </div>

            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-navy">Work out the fraction by</legend>
              <div className="flex gap-2">
                {(["hours", "days"] as const).map((m) => (
                  <button key={m} type="button" onClick={() => set("mode", m)} aria-pressed={input.mode === m}
                    className={`rounded-md border px-4 py-2 text-sm font-medium ${input.mode === m ? "border-eucalyptus bg-eucalyptus text-white" : "border-sandstone-dark/30 bg-white text-navy hover:border-eucalyptus/50"}`}>
                    {m === "hours" ? "Hours per week" : "Days per week"}
                  </button>
                ))}
              </div>
            </fieldset>

            {input.mode === "hours" ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pr-hours" className="mb-1 block text-sm font-medium text-navy">Your hours a week</label>
                  <input id="pr-hours" type="number" min={0} max={80} step={0.5} value={input.hoursPerWeek}
                    onChange={(e) => set("hoursPerWeek", num(e.target.value, 0, 80))} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="pr-fthours" className="mb-1 block text-sm font-medium text-navy">Full-time hours</label>
                  <input id="pr-fthours" type="number" min={1} max={60} step={0.5} value={input.fullTimeHours}
                    onChange={(e) => set("fullTimeHours", num(e.target.value, 1, 60))} className={inputClass} />
                </div>
                <p className="col-span-2 -mt-2 text-xs text-warmgray-light">
                  {EMPLOYMENT.standardWeeklyHours} hours is the National Employment Standards maximum for full time. Some agreements use 35, 37.5 or 40.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pr-days" className="mb-1 block text-sm font-medium text-navy">Your days a week</label>
                  <input id="pr-days" type="number" min={0} max={7} step={0.5} value={input.daysPerWeek}
                    onChange={(e) => set("daysPerWeek", num(e.target.value, 0, 7))} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="pr-ftdays" className="mb-1 block text-sm font-medium text-navy">Full-time days</label>
                  <input id="pr-ftdays" type="number" min={1} max={7} step={0.5} value={input.fullTimeDays}
                    onChange={(e) => set("fullTimeDays", num(e.target.value, 1, 7))} className={inputClass} />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="pr-months" className="mb-1 block text-sm font-medium text-navy">Months of the year worked</label>
              <input id="pr-months" type="number" min={1} max={12} step={1} value={input.monthsWorked}
                onChange={(e) => set("monthsWorked", num(e.target.value, 1, 12))} className={inputClass} />
              <p className="mt-1 text-xs text-warmgray-light">Leave at 12 unless you are starting or leaving part-way through the year.</p>
            </div>
          </form>

          <div className="space-y-4">
            <div className="rounded-xl border border-sandstone-dark/20 bg-sandstone p-6 text-center shadow-sm">
              <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-ochre">Pro-rata salary</div>
              <div className="mb-1 text-4xl font-extrabold text-navy">{formatAUD(result.annualSalary)}</div>
              <div className="mt-2 text-sm text-warmgray">
                {(result.fraction * 100).toFixed(1).replace(/\.0$/, "")}% of {formatAUD(input.fteSalary)} ({result.fraction.toFixed(2)} FTE)
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 bg-white">
              <div className="border-b border-sandstone-dark/20 bg-sandstone px-5 py-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-navy">Per pay period</h3>
              </div>
              <div className="space-y-3 p-5 text-sm">
                <Row label="Weekly, before tax" value={formatAUD(result.weekly, 2)} />
                <Row label="Fortnightly, before tax" value={formatAUD(result.fortnightly, 2)} />
                <Row label="Monthly, before tax" value={formatAUD(result.monthly, 2)} />
                <Row label="Hourly rate (unchanged)" value={formatAUD(result.hourlyRate, 2)} muted />
                {partYear && (
                  <>
                    <div className="border-t border-sandstone-dark/10 pt-3" />
                    <Row label={`Paid for ${input.monthsWorked} month${input.monthsWorked === 1 ? "" : "s"}`} value={formatAUD(result.payableSalary)} bold />
                  </>
                )}
                <div className="border-t border-sandstone-dark/20 pt-3" />
                <Row label="Tax and Medicare levy (year)" value={formatNegAUD(tax.totalDeductions, 0, "−")} />
                <Row label="After tax, per year" value={formatAUD(tax.takeHomePay)} bold />
                <Row label="After tax, per fortnight" value={formatAUD(tax.takeHomePay / 26, 2)} />
                <Row label="After tax, per week" value={formatAUD(afterTaxWeekly, 2)} />
                <Row label="Employer super on top" value={formatAUD(tax.superContribution)} muted />
              </div>
            </div>

            <p className="text-xs text-warmgray-light">
              After-tax figures are for a full year at this pay, for an Australian resident claiming the tax-free threshold with no HECS-HELP debt. For HECS, salary sacrifice or a second job, use the{" "}
              <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">take-home pay calculator</Link>.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
