"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD, formatNegAUD } from "@/lib/constants";
import { calculateFifoPay, FIFO_DEFAULTS, ROSTER_PRESETS, type FifoInput } from "@/lib/constants/fifo-pay";
import { CALC_FONT, NOTE_OK, NumberField, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

// FIFO roster pay: hourly base × roster, overtime past the averaged ordinary
// hours, shift loading and site allowance → annual gross → FY2026-27 tax via
// the site-wide engine (lib/constants/fifo-pay.ts → calculatePayBreakdown).

const CUSTOM = "custom";

export default function FifoPayCalculator() {
  const [preset, setPreset] = useState<string>("2-1");
  const [input, setInput] = useState<FifoInput>(FIFO_DEFAULTS);
  const set = <K extends keyof FifoInput>(k: K) => (v: FifoInput[K]) => setInput((s) => ({ ...s, [k]: v }));

  const choosePreset = (id: string) => {
    setPreset(id);
    const p = ROSTER_PRESETS.find((r) => r.id === id);
    if (p) setInput((s) => ({ ...s, daysOn: p.daysOn, daysOff: p.daysOff }));
  };

  const r = useMemo(() => calculateFifoPay(input), [input]);
  const t = r.tax;

  return (
    <Card className="shadow-md not-prose" id="fifo-pay-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>FIFO Pay Calculator</h2>
        <p className="text-sm text-warmgray mb-6">Enter your hourly rate and roster. Hours past your ordinary hours (averaged over the roster cycle) are paid as overtime. Tax is worked out on the 2026-27 rates.</p>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 gap-4 sm:grid-cols-2 content-start">
            <div className="sm:col-span-2">
              <SelectField
                id="fifo-roster"
                label="Roster"
                value={preset}
                onChange={choosePreset}
                options={[...ROSTER_PRESETS.map((p) => ({ value: p.id, label: p.label })), { value: CUSTOM, label: "Custom" }]}
              />
            </div>
            <NumberField id="fifo-on" label="Days on site" value={input.daysOn} onChange={(n) => { setPreset(CUSTOM); set("daysOn")(Math.max(1, n)); }} min={1} max={60} />
            <NumberField id="fifo-off" label="Days off" value={input.daysOff} onChange={(n) => { setPreset(CUSTOM); set("daysOff")(n); }} max={60} />
            <NumberField id="fifo-rate" label="Base hourly rate ($)" value={input.hourlyRate} onChange={set("hourlyRate")} step={0.5} />
            <NumberField id="fifo-shift" label="Hours per shift" value={input.shiftHours} onChange={set("shiftHours")} step={0.5} max={24} />
            <NumberField id="fifo-ord" label="Ordinary hours per week" hint="Usually 38. Hours above this, averaged over the cycle, count as overtime." value={input.ordinaryHoursPerWeek} onChange={set("ordinaryHoursPerWeek")} step={1} max={60} />
            <NumberField id="fifo-ot" label="Overtime rate (× base)" hint="1.5 is time and a half." value={input.overtimeMultiplier} onChange={set("overtimeMultiplier")} step={0.25} min={1} max={3} />
            <NumberField id="fifo-load" label="Shift loading on ordinary hours (%)" hint="Average across the swing, e.g. half nights at 30% = 15%." value={input.shiftLoadingPct} onChange={set("shiftLoadingPct")} step={1} max={100} />
            <NumberField id="fifo-site" label="Site or remote allowance per day ($)" hint="Taxable allowances paid for each day on site." value={input.siteAllowancePerDay} onChange={set("siteAllowancePerDay")} step={5} />
            <NumberField id="fifo-lafha" label="Living-away-from-home allowance per week ($)" hint="Only if your employer pays one in cash. Not taxed as your income." value={input.lafhaPerWeek} onChange={set("lafhaPerWeek")} step={10} />
            <div className="sm:col-span-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={input.includeHECS} onChange={(e) => set("includeHECS")(e.target.checked)} /> HECS-HELP debt
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={input.hasPrivateHealth} onChange={(e) => set("hasPrivateHealth")(e.target.checked)} /> Private hospital cover
              </label>
            </div>
          </form>

          <div className="space-y-4">
            <dl className={RESULT_LIST}>
              <ResultRow label={`Hours per ${r.cycleDays}-day cycle`} value={`${r.hoursPerCycle.toLocaleString("en-AU")} (${r.ordinaryHoursPerCycle.toLocaleString("en-AU")} ordinary, ${r.overtimeHoursPerCycle.toLocaleString("en-AU")} overtime)`} muted />
              <ResultRow label="Gross pay per cycle" value={formatAUD(r.perCycle.gross, 2)} />
              <ResultRow label="Gross pay per year" value={formatAUD(r.annual.gross)} bold />
              <ResultRow label="Income tax (after LITO)" value={formatNegAUD(t.netIncomeTax, 0, "−")} muted />
              <ResultRow label="Medicare levy" value={formatNegAUD(t.medicareLevy, 0, "−")} muted />
              {t.medicareSurcharge > 0 && <ResultRow label="Medicare levy surcharge" value={formatNegAUD(t.medicareSurcharge, 0, "−")} muted />}
              {t.hecsRepayment > 0 && <ResultRow label="HECS-HELP repayment" value={formatNegAUD(t.hecsRepayment, 0, "−")} muted />}
              <ResultRow label="Take-home per year" value={formatAUD(t.takeHomePay)} bold />
              <ResultRow label="Take-home per fortnight" value={formatAUD(r.takeHomePerFortnight, 2)} />
              <ResultRow label={`Take-home per ${r.cycleDays}-day cycle`} value={formatAUD(r.takeHomePerCycle, 2)} />
              <ResultRow label="Employer super (on top)" value={`${formatAUD(r.employerSuper)}${r.superCapped ? " (capped)" : ""}`} muted />
              {r.lafhaAnnual > 0 && <ResultRow label="LAFHA per year (not in taxable income)" value={formatAUD(r.lafhaAnnual)} muted />}
            </dl>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm text-navy">
                <thead className="bg-sandstone text-left">
                  <tr><th className="px-3 py-2">Per year</th><th className="px-3 py-2 text-right">Amount</th></tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/20 tabular-nums">
                  <tr><td className="px-3 py-2">Ordinary hours</td><td className="px-3 py-2 text-right">{formatAUD(r.annual.ordinary)}</td></tr>
                  <tr><td className="px-3 py-2">Shift loading</td><td className="px-3 py-2 text-right">{formatAUD(r.annual.loading)}</td></tr>
                  <tr><td className="px-3 py-2">Overtime</td><td className="px-3 py-2 text-right">{formatAUD(r.annual.overtime)}</td></tr>
                  <tr><td className="px-3 py-2">Site allowances</td><td className="px-3 py-2 text-right">{formatAUD(r.annual.allowances)}</td></tr>
                </tbody>
              </table>
            </div>
            <p className={NOTE_OK} role="status" aria-live="polite">
              {`About ${r.daysOnSitePerYear} days on site and ${r.annual.hours.toLocaleString("en-AU")} hours a year. Every hour worked averages ${formatAUD(r.effectiveHourly, 2)} gross, and ${Math.round(t.effectiveTaxRate * 100)}% of your gross goes in ${t.hecsRepayment > 0 ? "tax, Medicare and HECS" : "tax and Medicare"}.`}
            </p>
            <p className="text-xs text-warmgray-light">
              Assumes you work every swing all year. Paid leave usually pays ordinary hours only, so a year with leave earns less overtime. FIFO workers who live outside a remote zone can&rsquo;t claim the <Link href="/zone-tax-offset/" className="underline">zone tax offset</Link>, so none is applied. Your employer withholds tax from each pay using the ATO tables; this is your full-year tax.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
