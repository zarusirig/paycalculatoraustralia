"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import { TOIL_AWARD_RULES, compareToil, type ToilBasis } from "@/lib/constants/time-in-lieu";
import { CALC_FONT, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

// TOIL vs overtime pay. Arithmetic lives in compareToil() (lib/constants/
// time-in-lieu.ts, tested); the award list and each award's basis and window
// come from TOIL_AWARD_RULES, transcribed from the award text.

const OTHER_H4H = "other-h4h";
const OTHER_EQUIV = "other-equiv";

const AWARD_OPTIONS = [
  ...TOIL_AWARD_RULES.map((r) => ({ value: r.code, label: `${r.shortName} (${r.code})` })),
  { value: OTHER_H4H, label: "Agreement or contract: hour for hour" },
  { value: OTHER_EQUIV, label: "Agreement or contract: at the overtime rate" },
] as const;

const hrs = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(2).replace(/0$/, "")} hour${n === 1 ? "" : "s"}`;

export default function TimeInLieuCalculator() {
  const [award, setAward] = useState<string>(TOIL_AWARD_RULES[0].code);
  const [hourly, setHourly] = useState(30);
  const [h150, setH150] = useState(2);
  const [h200, setH200] = useState(1);
  const [h250, setH250] = useState(0);

  const rule = TOIL_AWARD_RULES.find((r) => r.code === award);
  const basis: ToilBasis = rule ? rule.basis : award === OTHER_EQUIV ? "overtime-equivalent" : "hour-for-hour";

  const blocks = useMemo(
    () => [
      { hours: h150, multiplier: 1.5 },
      { hours: h200, multiplier: 2 },
      { hours: h250, multiplier: 2.5 },
    ],
    [h150, h200, h250],
  );
  const selected = useMemo(() => compareToil(hourly, blocks, basis), [hourly, blocks, basis]);
  const other = useMemo(
    () => compareToil(hourly, blocks, basis === "hour-for-hour" ? "overtime-equivalent" : "hour-for-hour"),
    [hourly, blocks, basis],
  );

  return (
    <Card className="shadow-md not-prose" id="toil-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>TOIL vs Overtime Pay Calculator</h2>
        <p className="text-sm text-warmgray mb-6">Enter the overtime you worked. See what it pays as overtime, how many hours of time off it buys under your award, and what the time off is worth.</p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 gap-4 sm:grid-cols-2 content-start">
            <div className="sm:col-span-2">
              <SelectField id="toil-award" label="Your award or agreement" value={award} onChange={setAward} options={AWARD_OPTIONS} />
            </div>
            <NumberField id="toil-rate" label="Ordinary hourly rate" hint="Your base rate, before any penalty or loading." value={hourly} onChange={setHourly} step={0.01} />
            <NumberField id="toil-150" label="Overtime hours at 150%" value={h150} onChange={setH150} step={0.25} />
            <NumberField id="toil-200" label="Overtime hours at 200%" value={h200} onChange={setH200} step={0.25} />
            <NumberField id="toil-250" label="Overtime hours at 250%" hint="Usually public holiday overtime." value={h250} onChange={setH250} step={0.25} />
          </form>

          <div className="space-y-4">
            <dl className={RESULT_LIST}>
              <ResultRow label="Overtime worked" value={hrs(selected.overtimeHours)} />
              <ResultRow label="Paid as overtime" value={formatAUD(selected.overtimePay, 2)} bold />
              <ResultRow label={basis === "hour-for-hour" ? "Time off in lieu (hour for hour)" : "Time off in lieu (at the overtime rate)"} value={hrs(selected.toilHours)} bold />
              <ResultRow label="That time off pays, at your ordinary rate" value={formatAUD(selected.toilValueAtOrdinaryRate, 2)} />
              {selected.valueGivenUp > 0 && <ResultRow label="Worth less than the overtime pay by" value={formatAUD(selected.valueGivenUp, 2)} muted />}
              <ResultRow label="Paid out if not taken in time" value={formatAUD(selected.payoutIfUntaken, 2)} />
            </dl>
            <p className={basis === "hour-for-hour" && selected.valueGivenUp > 0 ? NOTE_WARN : NOTE_OK} role="status" aria-live="polite">
              {basis === "hour-for-hour"
                ? `Under an hour-for-hour clause, ${hrs(selected.overtimeHours)} of overtime buys ${hrs(selected.toilHours)} off. An overtime-rate clause would give ${hrs(other.toilHours)}.`
                : `Under this clause the time off matches the overtime payment: ${hrs(selected.toilHours)} off. An hour-for-hour clause would give only ${hrs(other.toilHours)}.`}
              {rule && ` ${rule.shortName} ${rule.clause}: take it within ${rule.windowMonths} months or it must be paid at the overtime rate.`}
            </p>
            <p className="text-xs text-warmgray-light">
              Multipliers are your award&rsquo;s overtime rates for full-time and part-time staff. Untaken time off is paid &ldquo;at the overtime rate applicable to the overtime when worked&rdquo;, which is why the payout equals the overtime pay. Casual overtime rates differ by award.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
