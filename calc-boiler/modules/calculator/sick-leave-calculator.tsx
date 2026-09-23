"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import { SICK_LEAVE, sickLeave, sickLeavePerPayPeriod, type SickLeaveEmployment } from "@/lib/constants/sick-leave";
import { CALC_FONT, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

// Personal/carer's leave accrual (G3, wave 4). All arithmetic is in
// lib/constants/sick-leave.ts (tested): 1/26 of ordinary hours, per the Fair
// Work Ombudsman's worked example (38 h a week → 76 hours a year).

const EMPLOYMENT_OPTIONS = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "casual", label: "Casual" },
] as const;

const h = (n: number) => `${n.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")} hours`;
const d = (n: number) => `${n.toFixed(1).replace(/\.0$/, "")} day${n === 1 ? "" : "s"}`;

export default function SickLeaveCalculator() {
  const [employment, setEmployment] = useState<SickLeaveEmployment>("full-time");
  const [hoursPerWeek, setHoursPerWeek] = useState(38);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [years, setYears] = useState(1);
  const [months, setMonths] = useState(0);
  const [taken, setTaken] = useState(0);
  const [rate, setRate] = useState(32);

  const weeksWorked = years * 52 + (months * 52) / 12;
  const r = useMemo(
    () => sickLeave({ employment, hoursPerWeek, daysPerWeek, weeksWorked, takenHours: taken, baseHourlyRate: rate }),
    [employment, hoursPerWeek, daysPerWeek, weeksWorked, taken, rate],
  );
  const casual = employment === "casual";

  return (
    <Card className="shadow-md not-prose" id="sick-leave-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>Sick Leave Calculator</h2>
        <p className="text-sm text-warmgray mb-6">Work out how much paid sick and carer&rsquo;s leave you have earned, your balance after leave you&rsquo;ve taken, and what that balance pays at your base rate.</p>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 content-start">
            <div className="sm:col-span-2">
              <SelectField id="sl-type" label="Employment type" value={employment} onChange={setEmployment} options={EMPLOYMENT_OPTIONS} />
            </div>
            <NumberField id="sl-hours" label="Ordinary hours a week" hint="Average, excluding overtime. Full-time is usually 38." value={hoursPerWeek} onChange={setHoursPerWeek} step={0.5} max={60} />
            <NumberField id="sl-days" label="Days worked a week" hint="Only used to show hours as days." value={daysPerWeek} onChange={setDaysPerWeek} step={0.5} max={7} />
            <NumberField id="sl-years" label="Years of service" value={years} onChange={setYears} max={50} />
            <NumberField id="sl-months" label="Plus months" hint="Leave out time on unpaid leave." value={months} onChange={setMonths} max={11} />
            <NumberField id="sl-taken" label="Sick or carer's leave already taken (hours)" value={taken} onChange={setTaken} step={0.5} />
            <NumberField id="sl-rate" label="Base hourly rate" hint="Without penalties, loadings or allowances." value={rate} onChange={setRate} step={0.01} />
          </form>

          <div className="space-y-4">
            {casual ? (
              <p className={NOTE_WARN} role="status" aria-live="polite">
                Casual employees don&rsquo;t accrue paid sick or carer&rsquo;s leave under the National Employment Standards. You can still take {SICK_LEAVE.unpaidCarersDaysPerOccasion} days of <strong>unpaid</strong> carer&rsquo;s leave each time a family or household member needs care, and unpaid compassionate leave.
              </p>
            ) : (
              <>
                <dl className={RESULT_LIST}>
                  <ResultRow label="Earned per year of service" value={`${h(r.annualHours)} (${d(r.annualDays)})`} />
                  <ResultRow label="Earned so far" value={h(r.accruedHours)} />
                  <ResultRow label="Taken" value={`−${h(r.takenHours)}`} muted />
                  <ResultRow label="Balance" value={`${h(r.balanceHours)} (${d(r.balanceDays)})`} bold />
                  <ResultRow label="Balance at your base rate" value={formatAUD(r.balanceValue, 2)} />
                  <ResultRow label="Accrues each fortnight" value={h(sickLeavePerPayPeriod(hoursPerWeek, 2))} muted />
                </dl>
                <p className={r.takenHours > r.accruedHours ? NOTE_WARN : NOTE_OK} role="status" aria-live="polite">
                  {r.takenHours > r.accruedHours
                    ? `You've taken more than you've earned. The NES only pays leave you have accumulated; once paid leave runs out, you can take ${SICK_LEAVE.unpaidCarersDaysPerOccasion} days of unpaid carer's leave per occasion to care for family.`
                    : `You earn 1 hour of paid sick and carer's leave for every 26 ordinary hours you work — ${h(r.annualHours)} a year at ${hoursPerWeek} hours a week. Unused leave carries over each year but isn't paid out when you leave.`}
                </p>
              </>
            )}
            <p className="text-xs text-warmgray-light">
              National Employment Standards minimum (Fair Work Act ss 95–96). Your award, enterprise agreement or contract can give more, never less. Leave keeps accruing while you&rsquo;re on paid leave or community service leave, but not on unpaid leave.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
