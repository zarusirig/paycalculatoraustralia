"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EMPLOYMENT, formatAUD } from "@/lib/constants";
import {
  CASUAL_DEFAULTS,
  COMMON_LEAVE_LOADING,
  NES_ANNUAL_LEAVE_WEEKS,
  NES_PERSONAL_LEAVE_DAYS,
  compareCasualPermanent,
  type CasualComparisonInput,
} from "@/lib/constants/minimum-wage";

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

const pct = (v: number) => `${(Math.round(v * 1000) / 10).toFixed(1)}%`;

export default function CasualLoadingCalculator() {
  const [input, setInput] = useState<CasualComparisonInput>(CASUAL_DEFAULTS);
  const set = <K extends keyof CasualComparisonInput>(k: K, v: CasualComparisonInput[K]) => setInput((p) => ({ ...p, [k]: v }));
  const r = useMemo(() => compareCasualPermanent(input), [input]);
  const casualAhead = r.difference >= 0;

  return (
    <Card className="not-prose shadow-md">
      <CardContent className="p-6 md:p-8">
        <h2 className="mb-1 text-xl font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          Casual Loading Calculator
        </h2>
        <p className="mb-6 text-sm text-warmgray">
          Enter the permanent hourly rate to get the casual rate, then compare a year as a casual with a year as a permanent employee on the same hours.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div>
              <label htmlFor="cl-base" className="mb-1 block text-sm font-medium text-navy">Permanent (base) hourly rate</label>
              <div className="flex items-center">
                <span className="mr-2 text-warmgray-light">$</span>
                <input id="cl-base" type="number" min={0} max={500} step={0.01} value={input.baseHourly}
                  onChange={(e) => set("baseHourly", num(e.target.value, 0, 500))} className={inputClass} />
              </div>
              <p className="mt-1 text-xs text-warmgray-light">Your award or agreement rate before any loading. Default: the adult National Minimum Wage.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cl-loading" className="mb-1 block text-sm font-medium text-navy">Casual loading (%)</label>
                <input id="cl-loading" type="number" min={0} max={100} step={1} value={Math.round(input.loading * 100)}
                  onChange={(e) => set("loading", num(e.target.value, 0, 100) / 100)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="cl-hours" className="mb-1 block text-sm font-medium text-navy">Hours a week</label>
                <input id="cl-hours" type="number" min={0} max={60} step={0.5} value={input.hoursPerWeek}
                  onChange={(e) => set("hoursPerWeek", num(e.target.value, 0, 60))} className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="cl-sick" className="mb-1 block text-sm font-medium text-navy">Sick days a permanent employee would take (0&ndash;{NES_PERSONAL_LEAVE_DAYS})</label>
              <input id="cl-sick" type="number" min={0} max={NES_PERSONAL_LEAVE_DAYS} step={1} value={input.sickDaysUsed}
                onChange={(e) => set("sickDaysUsed", num(e.target.value, 0, NES_PERSONAL_LEAVE_DAYS))} className={inputClass} />
              <p className="mt-1 text-xs text-warmgray-light">Both employees take these days off. The permanent one is paid for them; the casual is not.</p>
            </div>

            <label className="flex items-start gap-2 text-sm text-navy">
              <input type="checkbox" checked={input.leaveLoading} onChange={(e) => set("leaveLoading", e.target.checked)}
                className="mt-1 rounded border-sandstone-dark/40 text-eucalyptus focus:ring-eucalyptus/20" />
              <span>
                The award pays {Math.round(COMMON_LEAVE_LOADING * 1000) / 10}% annual leave loading
                <span className="block text-xs text-warmgray-light">Many awards pay it; the National Employment Standards do not. Check your award or agreement.</span>
              </span>
            </label>
          </form>

          <div className="space-y-4">
            <div className="rounded-xl border border-sandstone-dark/20 bg-sandstone p-6 text-center shadow-sm">
              <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-ochre">Casual hourly rate</div>
              <div className="mb-1 text-4xl font-extrabold text-navy">{formatAUD(r.casualHourly, 2)}</div>
              <div className="mt-2 text-sm text-warmgray">
                {formatAUD(input.baseHourly, 2)} + {Math.round(input.loading * 100)}% loading ({formatAUD(r.casualHourly - input.baseHourly, 2)} an hour)
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 bg-white">
              <div className="border-b border-sandstone-dark/20 bg-sandstone px-5 py-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-navy">A year on the same hours</h3>
              </div>
              <div className="space-y-3 p-5 text-sm">
                <Row label="Weeks actually worked" value={String(Math.round(r.weeksWorked * 10) / 10)} muted />
                <Row label="Permanent weekly pay" value={formatAUD(r.permanentWeekly, 2)} />
                <Row label="Casual weekly pay" value={formatAUD(r.casualWeekly, 2)} />
                <div className="border-t border-sandstone-dark/10 pt-3" />
                <Row label={`Permanent: paid ${EMPLOYMENT.weeksPerYear} weeks`} value={formatAUD(r.permanentAnnual)} />
                <Row label="  of which paid annual leave" value={formatAUD(r.annualLeaveValue)} muted />
                <Row label="  of which paid sick leave used" value={formatAUD(r.personalLeaveValue)} muted />
                <Row label="Casual: paid for weeks worked" value={formatAUD(r.casualAnnual)} />
                <div className="border-t border-sandstone-dark/20 pt-3" />
                <Row label={casualAhead ? "Casual earns more by" : "Permanent earns more by"} value={formatAUD(Math.abs(r.difference))} bold />
                <Row label="Break-even loading" value={pct(r.breakEvenLoading)} />
                <Row label="Super (permanent / casual)" value={`${formatAUD(r.permanentSuper)} / ${formatAUD(r.casualSuper)}`} muted />
              </div>
            </div>

            <p className="text-xs text-warmgray-light">
              Both employees take {NES_ANNUAL_LEAVE_WEEKS} weeks&rsquo; holiday plus the sick days entered. Ordinary-hours pay only: penalty rates, overtime and public holidays are left out. Break-even is the loading at which the casual&rsquo;s pay equals the permanent employee&rsquo;s for the same work.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
