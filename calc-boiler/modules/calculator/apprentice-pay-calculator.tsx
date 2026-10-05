"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { calculatePayBreakdown, formatAUD } from "@/lib/constants";
import {
  APPRENTICE_RATES_FROM,
  APPRENTICE_TRADES,
  STAGE_LABELS,
  apprenticePay,
  getTrade,
  type ApprenticeStage,
  type ApprenticeTrack,
} from "@/lib/data/apprentice-pay";
import { CALC_FONT, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

// Apprentice award minimum + take-home. Rates and arithmetic live in
// lib/data/apprentice-pay (tested); take-home uses the site's single tax engine.

const TRADE_OPTIONS = APPRENTICE_TRADES.map((t) => ({ value: t.slug, label: t.name }));
const STAGE_OPTIONS = ([1, 2, 3, 4] as const).map((s) => ({ value: String(s), label: STAGE_LABELS[s] }));
const YEAR12_OPTIONS = [
  { value: "completed", label: "Completed Year 12" },
  { value: "not-completed", label: "Did not complete Year 12" },
] as const;

export default function ApprenticePayCalculator({
  defaultTrade = "building",
  lockTrade = false,
  heading = "Apprentice Wages Calculator",
}: {
  /** Data trade slug to start on (lib/data/apprentice-pay). */
  defaultTrade?: string;
  /** Hide the trade picker on single-trade pages. */
  lockTrade?: boolean;
  heading?: string;
} = {}) {
  const [tradeSlug, setTradeSlug] = useState(defaultTrade);
  const [track, setTrack] = useState<ApprenticeTrack>("junior");
  const [stage, setStage] = useState("1");
  const [year12, setYear12] = useState<"completed" | "not-completed">("completed");
  const [hours, setHours] = useState(38);
  const [actual, setActual] = useState(0);

  const trade = getTrade(tradeSlug)!;
  const adultAvailable = trade.adult !== null;
  const effectiveTrack: ApprenticeTrack = adultAvailable ? track : "junior";
  const trackOptions = [
    { value: "junior", label: "Started under 21 (junior apprentice)" },
    ...(adultAvailable ? [{ value: "adult", label: "Started over 21 (adult apprentice)" }] : []),
  ] as { value: ApprenticeTrack; label: string }[];
  const noYear12Split = trade.slug === "cookery" || effectiveTrack === "adult";

  const r = useMemo(
    () =>
      apprenticePay({
        tradeSlug,
        track: effectiveTrack,
        stage: Number(stage) as ApprenticeStage,
        year12,
        hoursPerWeek: hours,
        actualHourly: actual > 0 ? actual : undefined,
      }),
    [tradeSlug, effectiveTrack, stage, year12, hours, actual],
  );

  const take = useMemo(() => (r ? calculatePayBreakdown({ grossSalary: Math.round(r.minAnnual), hasPrivateHealth: true }) : null), [r]);

  return (
    <Card className="shadow-md not-prose" id="apprentice-wages-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>{heading}</h2>
        <p className="text-sm text-warmgray mb-6">
          {lockTrade ? "Pick your year" : "Pick your trade and year"} to see the award minimum, then check it against your payslip. Rates are the minimums in force from {APPRENTICE_RATES_FROM}; many employers pay more.
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 content-start">
            {!lockTrade && (
              <div className="sm:col-span-2">
                <SelectField id="ap-trade" label="Trade" value={tradeSlug} onChange={setTradeSlug} options={TRADE_OPTIONS} />
              </div>
            )}
            <div className="sm:col-span-2">
              <SelectField id="ap-track" label="Apprentice type" value={effectiveTrack} onChange={setTrack} options={trackOptions} />
            </div>
            <SelectField id="ap-stage" label="Year of apprenticeship" value={stage} onChange={setStage} options={STAGE_OPTIONS} />
            {!noYear12Split ? (
              <SelectField id="ap-y12" label="Year 12" value={year12} onChange={setYear12} options={YEAR12_OPTIONS} />
            ) : (
              <div className="text-xs text-warmgray self-end pb-2">
                {effectiveTrack === "adult" ? "Adult rates do not depend on Year 12." : "This award does not split rates by Year 12."}
              </div>
            )}
            <NumberField id="ap-hours" label="Ordinary hours a week" hint="38 is full-time." value={hours} onChange={setHours} step={0.5} max={60} />
            <NumberField id="ap-actual" label="Your hourly rate ($)" hint="Optional. From your payslip, to compare." value={actual} onChange={setActual} step={0.01} />
          </form>

          <div className="space-y-4">
            {r ? (
              <>
                <dl className={RESULT_LIST}>
                  <ResultRow label="Award minimum per hour" value={formatAUD(r.minHourly, 2)} bold />
                  <ResultRow label={`Award minimum per week (${hours} hrs)`} value={formatAUD(r.minWeekly, 2)} />
                  <ResultRow label="Same rate for a full year (x 52)" value={formatAUD(r.minAnnual, 0)} />
                  {take && <ResultRow label="Estimated tax and Medicare" value={`−${formatAUD(take.totalDeductions, 0)}`} muted />}
                  {take && <ResultRow label="Estimated take-home per week" value={formatAUD(take.weekly, 2)} bold />}
                </dl>
                {r.belowAward === null ? null : r.belowAward ? (
                  <p className={NOTE_WARN} role="status" aria-live="polite">
                    {formatAUD(actual, 2)} an hour is {formatAUD(Math.abs(r.hourlyDifference ?? 0), 2)} under the award minimum for this trade and year. On {hours} hours that is {formatAUD(r.weeklyShortfall, 2)} a week. Check which award or agreement covers you, then talk to your employer or the Fair Work Infoline (13 13 94).
                  </p>
                ) : (
                  <p className={NOTE_OK} role="status" aria-live="polite">
                    {formatAUD(actual, 2)} an hour is at or above the award minimum ({formatAUD(r.minHourly, 2)}).
                  </p>
                )}
                <p className="text-xs text-warmgray-light">
                  {r.trade.rateIncludes} Award: {r.trade.award.name} [{r.trade.award.code}], {r.trade.award.clause}.
                  {!r.trade.includesAllowances ? " Allowances are extra, so your actual minimum is higher." : ""} Take-home assumes a resident on the tax-free threshold for 2026-27, private hospital cover, and no HELP debt. An enterprise agreement can pay more.
                </p>
              </>
            ) : (
              <p className={NOTE_WARN}>No rate is published for that combination.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
