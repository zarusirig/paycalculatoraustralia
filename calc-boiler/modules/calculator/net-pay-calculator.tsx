"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SUPER_GUARANTEE, formatAUD, formatPercent } from "@/lib/constants";
import { netPay } from "@/lib/constants/net-pay";
import type { PayFrequency } from "@/lib/constants/payg-withholding";
import { CALC_FONT, NOTE_OK, NumberField, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

// Net pay from an hourly rate and hours, laid out as a payslip. All arithmetic
// is in lib/constants/net-pay.ts (tested), which sits on the ATO Schedule 1
// withholding engine, so the figure is what a payslip shows on payday.

const FREQ_OPTIONS = [
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
] as const;

const hrs = (n: number) => `${n.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")} h`;

export default function NetPayCalculator() {
  const [rate, setRate] = useState(40);
  const [hours, setHours] = useState(38);
  const [frequency, setFrequency] = useState<PayFrequency>("fortnightly");
  const [casual, setCasual] = useState(false);
  const [help, setHelp] = useState(false);
  const [tft, setTft] = useState(true);
  const [sacrifice, setSacrifice] = useState(0);
  const [post, setPost] = useState(0);

  const r = useMemo(
    () =>
      netPay({
        hourlyRate: rate,
        hoursPerWeek: hours,
        frequency,
        casualLoading: casual,
        salarySacrifice: sacrifice,
        postTaxDeductions: post,
        options: { hasSTSL: help, claimsTaxFreeThreshold: tft },
      }),
    [rate, hours, frequency, casual, help, tft, sacrifice, post],
  );

  return (
    <Card className="shadow-md not-prose" id="net-pay-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>Net Pay Calculator</h2>
        <p className="text-sm text-warmgray mb-6">Enter your hourly rate and hours to see your net pay as it appears on a payslip, line by line, and what each hour is worth after tax. 2026-27 ATO withholding.</p>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 content-start">
            <NumberField id="np-rate" label="Hourly rate ($)" hint="Base rate before any casual loading." value={rate} onChange={setRate} step={0.25} max={1000} />
            <NumberField id="np-hours" label="Hours a week" hint="Ordinary hours you are paid for." value={hours} onChange={setHours} step={0.5} max={100} />
            <div className="sm:col-span-2">
              <SelectField id="np-freq" label="Paid" value={frequency} onChange={setFrequency} options={FREQ_OPTIONS} />
            </div>
            <NumberField id="np-sac" label="Salary sacrifice each pay ($)" hint="Pre-tax, e.g. extra super." value={sacrifice} onChange={setSacrifice} step={10} />
            <NumberField id="np-post" label="Other deductions each pay ($)" hint="After tax, e.g. union fees." value={post} onChange={setPost} step={5} />
            <label className="flex items-center gap-2 text-sm text-navy sm:col-span-2">
              <input type="checkbox" checked={casual} onChange={(e) => setCasual(e.target.checked)} className="h-4 w-4 rounded border-sandstone-dark/30" />
              Add 25% casual loading to this rate
            </label>
            <label className="flex items-center gap-2 text-sm text-navy sm:col-span-2">
              <input type="checkbox" checked={tft} onChange={(e) => setTft(e.target.checked)} className="h-4 w-4 rounded border-sandstone-dark/30" />
              Claim the tax-free threshold here (your main job)
            </label>
            <label className="flex items-center gap-2 text-sm text-navy sm:col-span-2">
              <input type="checkbox" checked={help} onChange={(e) => setHelp(e.target.checked)} className="h-4 w-4 rounded border-sandstone-dark/30" />
              I have a HELP / study and training loan
            </label>
          </form>

          <div className="space-y-4">
            <div className="rounded-xl border border-sandstone-dark/20 bg-white p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-warmgray">Net pay each {frequency === "weekly" ? "week" : frequency === "fortnightly" ? "fortnight" : "month"}</p>
              <p className="text-4xl font-extrabold text-navy tabular-nums" style={CALC_FONT}>{formatAUD(r.net, 2)}</p>
              <p className="text-sm text-warmgray">{formatAUD(r.netPerHour, 2)} an hour after tax, from {formatAUD(r.paidHourlyRate, 2)} gross</p>
            </div>

            <dl className={RESULT_LIST} aria-label="Payslip lines">
              <ResultRow label={`Gross earnings (${hrs(r.hoursInPeriod)} × ${formatAUD(r.paidHourlyRate, 2)})`} value={formatAUD(r.gross, 2)} bold />
              {r.salarySacrifice > 0 && <ResultRow label="Salary sacrifice (pre-tax)" value={`−${formatAUD(r.salarySacrifice, 2)}`} muted />}
              <ResultRow label="PAYG withholding (tax + Medicare levy)" value={`−${formatAUD(r.paygWithheld, 2)}`} muted />
              {help && <ResultRow label="HELP / STSL withholding" value={`−${formatAUD(r.stslWithheld, 2)}`} muted />}
              {r.postTaxDeductions > 0 && <ResultRow label="Other deductions (after tax)" value={`−${formatAUD(r.postTaxDeductions, 2)}`} muted />}
              <ResultRow label="Net pay" value={formatAUD(r.net, 2)} bold />
              <ResultRow label={`Employer super (paid on top, ${formatPercent(SUPER_GUARANTEE.rate, 0)})`} value={formatAUD(r.employerSuper, 2)} muted />
            </dl>

            <p className={NOTE_OK} role="status" aria-live="polite">
              After tax you keep about {Math.round((1 - r.deductionRate) * 100)}c of each gross dollar. The same job nets {formatAUD(r.netWeekly, 2)} a week, {formatAUD(r.netFortnightly, 2)} a fortnight or {formatAUD(r.netMonthly, 2)} a month before other deductions.
            </p>
            <p className="text-xs text-warmgray-light">
              Resident, claiming or not claiming the tax-free threshold as set. Withholding follows the ATO&rsquo;s weekly, fortnightly and monthly tax tables, so it can differ slightly from your final tax for the year. Super is shown for reference and is not part of net pay.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
