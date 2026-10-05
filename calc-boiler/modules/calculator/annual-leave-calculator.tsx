"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import { ANNUAL_LEAVE, annualLeave, leaveHoursPerPayPeriod, leavePayoutTax, type AnnualLeaveEmployment } from "@/lib/constants/annual-leave";
import { CALC_FONT, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

// Annual leave accrual, balance and value. All arithmetic is in
// lib/constants/annual-leave.ts (tested): 4 weeks a year on ordinary hours
// (Fair Work Ombudsman: 20 hours a week earns 80 hours a year; 38 earns 152).

const EMPLOYMENT_OPTIONS = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "casual", label: "Casual" },
] as const;

const SCENARIO_OPTIONS = [
  { value: "normal-termination", label: "Resigning or normal termination" },
  { value: "genuine-redundancy", label: "Genuine redundancy" },
] as const;

const h = (n: number) => `${n.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")} hours`;
const d = (n: number) => `${n.toFixed(1).replace(/\.0$/, "")} day${n === 1 ? "" : "s"}`;

export default function AnnualLeaveCalculator() {
  const [employment, setEmployment] = useState<AnnualLeaveEmployment>("full-time");
  const [hoursPerWeek, setHoursPerWeek] = useState(38);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [years, setYears] = useState(1);
  const [months, setMonths] = useState(0);
  const [taken, setTaken] = useState(0);
  const [rate, setRate] = useState(40);
  const [shiftworker, setShiftworker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState<"normal-termination" | "genuine-redundancy">("normal-termination");

  const weeksWorked = years * 52 + (months * 52) / 12;
  const r = useMemo(
    () => annualLeave({ employment, hoursPerWeek, daysPerWeek, weeksWorked, takenHours: taken, baseHourlyRate: rate, shiftworker, includeLoading: loading }),
    [employment, hoursPerWeek, daysPerWeek, weeksWorked, taken, rate, shiftworker, loading],
  );
  const salary = Math.round(rate * hoursPerWeek * ANNUAL_LEAVE.weeksInYear);
  const payout = useMemo(() => leavePayoutTax(salary, r.totalValue, scenario), [salary, r.totalValue, scenario]);
  const casual = employment === "casual";

  return (
    <Card className="shadow-md not-prose" id="annual-leave-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>Annual Leave Calculator</h2>
        <p className="text-sm text-warmgray mb-6">Work out how many hours of annual leave you have earned, your balance after leave taken, what it is worth, and the tax if it is paid out when you leave.</p>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 content-start">
            <div className="sm:col-span-2">
              <SelectField id="al-type" label="Employment type" value={employment} onChange={setEmployment} options={EMPLOYMENT_OPTIONS} />
            </div>
            <NumberField id="al-hours" label="Ordinary hours a week" hint="Average, excluding overtime. Full-time is usually 38." value={hoursPerWeek} onChange={setHoursPerWeek} step={0.5} max={60} />
            <NumberField id="al-days" label="Days worked a week" hint="Only used to show hours as days." value={daysPerWeek} onChange={setDaysPerWeek} step={0.5} max={7} />
            <NumberField id="al-years" label="Years of service" value={years} onChange={setYears} max={50} />
            <NumberField id="al-months" label="Plus months" hint="Leave out time on unpaid leave." value={months} onChange={setMonths} max={11} />
            <NumberField id="al-taken" label="Annual leave already taken (hours)" value={taken} onChange={setTaken} step={0.5} />
            <NumberField id="al-rate" label="Base hourly rate ($)" hint="Without penalties, loadings or allowances." value={rate} onChange={setRate} step={0.01} />
            <label className="flex items-center gap-2 text-sm text-navy sm:col-span-2">
              <input type="checkbox" checked={shiftworker} onChange={(e) => setShiftworker(e.target.checked)} className="h-4 w-4 rounded border-sandstone-dark/30" />
              Qualifying shiftworker (5 weeks a year under the NES)
            </label>
            <label className="flex items-center gap-2 text-sm text-navy sm:col-span-2">
              <input type="checkbox" checked={loading} onChange={(e) => setLoading(e.target.checked)} className="h-4 w-4 rounded border-sandstone-dark/30" />
              My award or agreement pays 17.5% leave loading
            </label>
          </form>

          <div className="space-y-4">
            {casual ? (
              <p className={NOTE_WARN} role="status" aria-live="polite">
                Casual employees do not accrue paid annual leave under the National Employment Standards. Instead they get a casual loading on their hourly rate (25% under most awards). See the <Link className="underline" href="/casual-loading-calculator/">casual loading calculator</Link>.
              </p>
            ) : (
              <>
                <dl className={RESULT_LIST}>
                  <ResultRow label="Leave earned per year" value={`${h(r.hoursPerYear)} (${r.weeksOfLeavePerYear} weeks)`} />
                  <ResultRow label="Earned so far" value={h(r.accruedHours)} />
                  <ResultRow label="Taken" value={`−${h(r.takenHours)}`} muted />
                  <ResultRow label="Balance" value={`${h(r.balanceHours)} (${d(r.balanceDays)})`} bold />
                  <ResultRow label="Balance at your base rate" value={formatAUD(r.baseValue, 2)} />
                  {loading && <ResultRow label="Leave loading (17.5%)" value={`+${formatAUD(r.loadingValue, 2)}`} />}
                  <ResultRow label="Value before tax" value={formatAUD(r.totalValue, 2)} bold />
                  <ResultRow label="Accrues each fortnight" value={h(leaveHoursPerPayPeriod(hoursPerWeek, 2, r.weeksOfLeavePerYear))} muted />
                </dl>

                <div className="rounded-xl border border-sandstone-dark/20 bg-white p-4">
                  <SelectField id="al-scenario" label="If the balance is paid out on leaving" value={scenario} onChange={setScenario} options={SCENARIO_OPTIONS} />
                  <dl className="mt-2 divide-y divide-sandstone-dark/20 text-sm">
                    <ResultRow label="Gross payout" value={formatAUD(payout.gross, 2)} />
                    <ResultRow label={scenario === "genuine-redundancy" ? "Tax withheld (32%)" : "Tax at marginal rates"} value={`−${formatAUD(payout.tax, 0)}`} muted />
                    <ResultRow label="After tax" value={formatAUD(payout.net, 0)} bold />
                  </dl>
                  <p className="mt-2 text-xs text-warmgray-light">{payout.method}. Your salary for the tax estimate is your hourly rate × hours × 52 = {formatAUD(salary)}.</p>
                </div>

                <p className={r.takenHours > r.accruedHours ? NOTE_WARN : NOTE_OK} role="status" aria-live="polite">
                  {r.takenHours > r.accruedHours
                    ? "You have taken more than you have earned. Leave you have not accrued yet is usually unpaid or must be agreed with your employer."
                    : `Annual leave builds at 1 hour for every 13 ordinary hours you work, or ${h(r.hoursPerYear)} a year at ${hoursPerWeek} hours a week. Unused leave carries over every year and is paid out when you leave.`}
                </p>
              </>
            )}
            <p className="text-xs text-warmgray-light">
              National Employment Standards minimum (Fair Work Act ss 86–90). Your award, agreement or contract can give more, never less. Leave keeps accruing on paid leave and long service leave but not on unpaid leave. The tax shown is an estimate for a single resident; actual withholding depends on your payroll.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
