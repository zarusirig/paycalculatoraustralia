"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { EMPLOYMENT, SITE_CONFIG, formatAUD } from "@/lib/constants";
import {
  CASUAL_LOADING,
  OVERTIME_DEFAULTS,
  STANDARD_WEEKLY_HOURS,
  calculateTimesheet,
  calculateTimesheetPay,
  formatDecimalHours,
  minutesToDecimalHours,
  minutesToHm,
  type ShiftInput,
} from "@/lib/constants/work-hours";

// ---------------------------------------------------------------------------
// Shape
// ---------------------------------------------------------------------------

interface Row {
  id: string;
  label: string;
  /** 24-hour "HH:MM", or "" for a day not worked. */
  start: string;
  end: string;
  breakMinutes: number;
}

type PeriodKey = "week" | "fortnight";

interface SheetState {
  period: PeriodKey;
  rows: Row[];
  hourlyRate: number;
  casual: boolean;
  overtimeEnabled: boolean;
  threshold: number;
  firstTierHours: number;
  firstTierMultiplier: number;
  secondTierMultiplier: number;
}

const PERIODS: Record<PeriodKey, { label: string; days: number; weeks: number }> = {
  week: { label: "One week (7 days)", days: 7, weeks: 1 },
  fortnight: { label: "Fortnight (14 days)", days: 14, weeks: 2 },
};

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const STORAGE_KEY = "pca-work-hours-v1";
const MAX_ROWS = 21;

function defaultLabel(index: number): string {
  const day = DAY_NAMES[index % 7];
  const week = Math.floor(index / 7) + 1;
  return week > 1 ? `${day} (wk ${week})` : day;
}

function buildRows(count: number, startIndex = 0, idPrefix = "d"): Row[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${idPrefix}${startIndex + i}`,
    label: defaultLabel(startIndex + i),
    start: "",
    end: "",
    breakMinutes: 0,
  }));
}

function defaultState(): SheetState {
  return {
    period: "week",
    rows: buildRows(PERIODS.week.days),
    hourlyRate: EMPLOYMENT.minimumWageHourly,
    casual: false,
    overtimeEnabled: true,
    threshold: OVERTIME_DEFAULTS.thresholdHours,
    firstTierHours: OVERTIME_DEFAULTS.firstTierHours,
    firstTierMultiplier: OVERTIME_DEFAULTS.firstTierMultiplier,
    secondTierMultiplier: OVERTIME_DEFAULTS.secondTierMultiplier,
  };
}

function toNumber(value: string): number {
  if (value.trim() === "") return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

// ---------------------------------------------------------------------------
// Persistence
//
// Read through useSyncExternalStore rather than an effect, so the prerendered
// HTML (server snapshot: nothing saved) and the first client render agree, and
// React swaps in the saved timesheet as part of hydration instead of a second
// visible pass. The snapshot is read from localStorage exactly once and frozen
// — everything after that is ordinary React state.
// ---------------------------------------------------------------------------

let cachedRaw: string | null | undefined;

const noopSubscribe = () => () => {};

function getClientSnapshot(): string | null {
  if (cachedRaw === undefined) {
    try {
      cachedRaw = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Private browsing, disabled storage, blocked third-party context.
      cachedRaw = null;
    }
  }
  return cachedRaw;
}

function getServerSnapshot(): string | null {
  return null;
}

/** Rebuild a saved timesheet, defending against anything hand-edited or stale. */
function parseStored(raw: string | null): SheetState | null {
  if (!raw) return null;
  try {
    const saved = JSON.parse(raw) as Partial<SheetState>;
    if (!Array.isArray(saved.rows) || saved.rows.length === 0) return null;
    const base = defaultState();
    const rows: Row[] = saved.rows.slice(0, MAX_ROWS).map((r, i) => ({
      id: typeof r?.id === "string" && r.id ? r.id : `d${i}`,
      label: typeof r?.label === "string" ? r.label : defaultLabel(i),
      start: typeof r?.start === "string" ? r.start : "",
      end: typeof r?.end === "string" ? r.end : "",
      breakMinutes: Number.isFinite(r?.breakMinutes) ? clamp(Number(r.breakMinutes), 0, 720) : 0,
    }));
    return {
      period: saved.period === "fortnight" ? "fortnight" : "week",
      rows,
      hourlyRate: Number.isFinite(saved.hourlyRate)
        ? clamp(Number(saved.hourlyRate), 0, 1000)
        : base.hourlyRate,
      casual: typeof saved.casual === "boolean" ? saved.casual : base.casual,
      overtimeEnabled:
        typeof saved.overtimeEnabled === "boolean" ? saved.overtimeEnabled : base.overtimeEnabled,
      threshold: Number.isFinite(saved.threshold)
        ? clamp(Number(saved.threshold), 0, 200)
        : base.threshold,
      firstTierHours: Number.isFinite(saved.firstTierHours)
        ? clamp(Number(saved.firstTierHours), 0, 100)
        : base.firstTierHours,
      firstTierMultiplier: Number.isFinite(saved.firstTierMultiplier)
        ? clamp(Number(saved.firstTierMultiplier), 1, 5)
        : base.firstTierMultiplier,
      secondTierMultiplier: Number.isFinite(saved.secondTierMultiplier)
        ? clamp(Number(saved.secondTierMultiplier), 1, 5)
        : base.secondTierMultiplier,
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------

function SummaryRow({
  label,
  value,
  bold,
  muted,
}: {
  label: string;
  value: string;
  bold?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className={muted ? "text-warmgray-light" : "text-warmgray"}>{label}</span>
      <span className={`tabular-nums ${bold ? "font-bold text-navy" : "text-navy"}`}>{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------

export default function WorkHoursCalculator() {
  const uid = useId();
  const nextId = useRef(100);

  const storedRaw = useSyncExternalStore(noopSubscribe, getClientSnapshot, getServerSnapshot);
  const restored = useMemo(() => parseStored(storedRaw), [storedRaw]);
  const [edited, setEdited] = useState<SheetState | null>(null);
  const [copied, setCopied] = useState(false);

  const state = edited ?? restored ?? defaultState();

  const patch = useCallback(
    (changes: Partial<SheetState>) => {
      setEdited({ ...state, ...changes });
      setCopied(false);
    },
    [state],
  );

  // Persist every edit. Writing to an external system is what effects are for.
  useEffect(() => {
    if (edited === null) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(edited));
    } catch {
      // Quota or private browsing — persistence is a nicety, not a requirement.
    }
  }, [edited]);

  // --- Row editing ----------------------------------------------------------

  const updateRow = useCallback(
    (id: string, changes: Partial<Row>) => {
      patch({ rows: state.rows.map((r) => (r.id === id ? { ...r, ...changes } : r)) });
    },
    [patch, state.rows],
  );

  const addRow = useCallback(() => {
    if (state.rows.length >= MAX_ROWS) return;
    const row: Row = {
      id: `r${nextId.current++}`,
      label: defaultLabel(state.rows.length),
      start: "",
      end: "",
      breakMinutes: 0,
    };
    patch({ rows: [...state.rows, row] });
  }, [patch, state.rows]);

  const removeRow = useCallback(
    (id: string) => {
      if (state.rows.length <= 1) return;
      patch({ rows: state.rows.filter((r) => r.id !== id) });
    },
    [patch, state.rows],
  );

  const changePeriod = useCallback(
    (next: PeriodKey) => {
      const days = PERIODS[next].days;
      let rows = state.rows;
      if (state.rows.length > days) {
        rows = state.rows.slice(0, days);
      } else if (state.rows.length < days) {
        const extra = buildRows(days - state.rows.length, state.rows.length, `r${nextId.current++}-`);
        rows = [...state.rows, ...extra];
      }
      patch({
        period: next,
        rows,
        threshold: STANDARD_WEEKLY_HOURS * PERIODS[next].weeks,
      });
    },
    [patch, state.rows],
  );

  const reset = useCallback(() => {
    const fresh = defaultState();
    fresh.period = state.period;
    fresh.rows = buildRows(PERIODS[state.period].days);
    fresh.threshold = STANDARD_WEEKLY_HOURS * PERIODS[state.period].weeks;
    nextId.current = 100;
    setEdited(fresh);
    setCopied(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      cachedRaw = null;
    } catch {
      /* ignore */
    }
  }, [state.period]);

  // --- Maths ----------------------------------------------------------------

  const shifts: ShiftInput[] = useMemo(
    () => state.rows.map((r) => ({ start: r.start, end: r.end, breakMinutes: r.breakMinutes })),
    [state.rows],
  );

  const totals = useMemo(() => calculateTimesheet(shifts), [shifts]);

  const pay = useMemo(
    () =>
      calculateTimesheetPay({
        totalHours: totals.totalHours,
        hourlyRate: state.hourlyRate,
        casual: state.casual,
        overtime: {
          enabled: state.overtimeEnabled,
          thresholdHours: state.threshold,
          firstTierHours: state.firstTierHours,
          firstTierMultiplier: state.firstTierMultiplier,
          secondTierMultiplier: state.secondTierMultiplier,
        },
      }),
    [
      totals.totalHours,
      state.hourlyRate,
      state.casual,
      state.overtimeEnabled,
      state.threshold,
      state.firstTierHours,
      state.firstTierMultiplier,
      state.secondTierMultiplier,
    ],
  );

  // Per-week subtotals, so a fortnight still reports a weekly figure.
  const weekSubtotals = useMemo(() => {
    const chunks: number[] = [];
    for (let i = 0; i < totals.rows.length; i += 7) {
      chunks.push(
        totals.rows.slice(i, i + 7).reduce((sum, r) => sum + (r.valid ? r.paidMinutes : 0), 0),
      );
    }
    return chunks;
  }, [totals.rows]);

  // --- Copyable / printable summary ----------------------------------------

  const summaryText = useMemo(() => {
    const lines: string[] = [];
    lines.push(`Timesheet summary — ${PERIODS[state.period].label}`);
    lines.push("");
    state.rows.forEach((r, i) => {
      const res = totals.rows[i];
      if (!res?.valid) return;
      lines.push(
        `${r.label}: ${r.start}–${r.end}` +
          (res.overnight ? " (+1 day)" : "") +
          (res.breakMinutes > 0 ? `, ${res.breakMinutes} min unpaid break` : "") +
          ` = ${formatDecimalHours(res.paidHours)} h (${minutesToHm(res.paidMinutes)})`,
      );
    });
    lines.push("");
    lines.push(
      `Total paid hours: ${formatDecimalHours(totals.totalHours)} h (${minutesToHm(totals.paidMinutes)})`,
    );
    lines.push(`Unpaid breaks deducted: ${minutesToHm(totals.breakMinutes)}`);
    if (weekSubtotals.length > 1) {
      weekSubtotals.forEach((mins, i) => {
        lines.push(
          `Week ${i + 1}: ${formatDecimalHours(minutesToDecimalHours(mins))} h (${minutesToHm(mins)})`,
        );
      });
    }
    lines.push("");
    lines.push(
      `Hourly rate: ${formatAUD(state.hourlyRate, 2)}` +
        (state.casual
          ? ` + ${CASUAL_LOADING * 100}% casual loading = ${formatAUD(pay.effectiveRate, 2)}`
          : ""),
    );
    lines.push(
      `Ordinary: ${formatDecimalHours(pay.split.ordinaryHours)} h = ${formatAUD(pay.ordinaryPay, 2)}`,
    );
    if (pay.split.firstTierHours > 0) {
      lines.push(
        `Overtime at ${state.firstTierMultiplier}x: ${formatDecimalHours(pay.split.firstTierHours)} h = ${formatAUD(pay.firstTierPay, 2)}`,
      );
    }
    if (pay.split.secondTierHours > 0) {
      lines.push(
        `Overtime at ${state.secondTierMultiplier}x: ${formatDecimalHours(pay.split.secondTierHours)} h = ${formatAUD(pay.secondTierPay, 2)}`,
      );
    }
    lines.push(`Gross pay for the period: ${formatAUD(pay.gross, 2)}`);
    lines.push("");
    lines.push("Estimate only, before tax and super. Overtime thresholds depend on your award.");
    return lines.join("\n");
  }, [state, totals, weekSubtotals, pay]);

  const copySummary = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }, [summaryText]);

  // --- Styling --------------------------------------------------------------

  const inputClass =
    "block w-full rounded-md border border-sandstone-dark/30 bg-white px-2 py-1.5 text-sm text-navy shadow-sm focus:border-eucalyptus focus:outline-none focus:ring-2 focus:ring-eucalyptus/20";
  const numberClass = `${inputClass} tabular-nums`;

  const hasOvertime = pay.split.overtimeHours > 0;

  return (
    <Card className="shadow-md not-prose">
      <CardContent className="p-5 md:p-8">
        <h2
          className="text-xl font-semibold text-navy mb-1"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          Work Hours Calculator
        </h2>
        <p className="text-sm text-warmgray mb-6">
          Enter a start and finish time for each day. The calculator adds up your hours, takes out
          unpaid breaks and prices the period — including shifts that finish after midnight. Your
          entries stay in this browser; nothing is uploaded.
        </p>

        {/* ---------------- Period ---------------- */}
        <div className="mb-4 flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor={`${uid}-period`} className="mb-1 block text-sm font-medium text-navy">
              Pay period
            </label>
            <select
              id={`${uid}-period`}
              value={state.period}
              onChange={(e) => changePeriod(e.target.value as PeriodKey)}
              className={inputClass}
            >
              {(Object.keys(PERIODS) as PeriodKey[]).map((key) => (
                <option key={key} value={key}>
                  {PERIODS[key].label}
                </option>
              ))}
            </select>
          </div>
          <p className="max-w-sm text-xs text-warmgray-light">
            Times use the 24-hour clock. Leave a day blank if you did not work it.
          </p>
        </div>

        {/* Column headings, sm and up. Every input carries its own label as well. */}
        <div
          className="hidden gap-3 px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-warmgray-light sm:grid sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1.3fr)_2.5rem]"
          aria-hidden="true"
        >
          <span>Day</span>
          <span>Start</span>
          <span>Finish</span>
          <span>Break (min)</span>
          <span className="text-right">Daily total</span>
          <span />
        </div>

        <div className="space-y-3">
          {state.rows.map((row, index) => {
            const result = totals.rows[index];
            const rowId = `${uid}-${row.id}`;
            const rowName = row.label.trim() || `Day ${index + 1}`;
            return (
              <div
                key={row.id}
                className="grid gap-3 rounded-lg border border-sandstone-dark/20 bg-sandstone/30 p-3 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1.3fr)_2.5rem] sm:items-center sm:border-0 sm:bg-transparent sm:p-1"
              >
                <div>
                  <label htmlFor={`${rowId}-label`} className="sr-only">
                    Day {index + 1} name
                  </label>
                  <span
                    className="mb-1 block text-xs font-medium text-warmgray sm:hidden"
                    aria-hidden="true"
                  >
                    Day
                  </span>
                  <input
                    id={`${rowId}-label`}
                    type="text"
                    value={row.label}
                    maxLength={24}
                    onChange={(e) => updateRow(row.id, { label: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor={`${rowId}-start`} className="sr-only">
                    {rowName} start time
                  </label>
                  <span
                    className="mb-1 block text-xs font-medium text-warmgray sm:hidden"
                    aria-hidden="true"
                  >
                    Start
                  </span>
                  <input
                    id={`${rowId}-start`}
                    type="time"
                    value={row.start}
                    onChange={(e) => updateRow(row.id, { start: e.target.value })}
                    className={numberClass}
                  />
                </div>

                <div>
                  <label htmlFor={`${rowId}-end`} className="sr-only">
                    {rowName} finish time
                  </label>
                  <span
                    className="mb-1 block text-xs font-medium text-warmgray sm:hidden"
                    aria-hidden="true"
                  >
                    Finish
                  </span>
                  <input
                    id={`${rowId}-end`}
                    type="time"
                    value={row.end}
                    onChange={(e) => updateRow(row.id, { end: e.target.value })}
                    className={numberClass}
                  />
                </div>

                <div>
                  <label htmlFor={`${rowId}-break`} className="sr-only">
                    {rowName} unpaid break in minutes
                  </label>
                  <span
                    className="mb-1 block text-xs font-medium text-warmgray sm:hidden"
                    aria-hidden="true"
                  >
                    Break (min)
                  </span>
                  <input
                    id={`${rowId}-break`}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={720}
                    step={5}
                    value={row.breakMinutes}
                    onChange={(e) =>
                      updateRow(row.id, { breakMinutes: clamp(toNumber(e.target.value), 0, 720) })
                    }
                    className={numberClass}
                  />
                </div>

                <div className="text-sm sm:text-right">
                  <span className="mr-2 text-xs font-medium text-warmgray sm:hidden">
                    Daily total
                  </span>
                  <span className="font-semibold tabular-nums text-navy">
                    {result?.valid ? `${formatDecimalHours(result.paidHours)} h` : "—"}
                  </span>
                  {result?.valid && (
                    <span className="ml-2 text-xs tabular-nums text-warmgray-light">
                      {minutesToHm(result.paidMinutes)}
                    </span>
                  )}
                  {result?.overnight && (
                    <span className="ml-2 inline-block rounded bg-eucalyptus-light/50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-eucalyptus-dark">
                      +1 day
                    </span>
                  )}
                  {result?.breakExceedsShift && (
                    <span className="mt-1 block text-[11px] text-ochre">
                      Break is longer than the shift — capped at{" "}
                      {minutesToHm(result.elapsedMinutes)}.
                    </span>
                  )}
                </div>

                <div className="sm:text-right">
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    disabled={state.rows.length <= 1}
                    className="rounded-md border border-sandstone-dark/30 px-2 py-1 text-xs font-medium text-warmgray transition-colors hover:border-ochre hover:text-ochre focus:outline-none focus:ring-2 focus:ring-eucalyptus/20 disabled:cursor-not-allowed disabled:opacity-40 sm:border-0 sm:px-1"
                  >
                    <span aria-hidden="true">✕</span>
                    <span className="sr-only">Remove {rowName}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={addRow}
            disabled={state.rows.length >= MAX_ROWS}
            className="rounded-lg border border-eucalyptus/40 bg-eucalyptus-light/30 px-4 py-2 text-sm font-semibold text-eucalyptus-dark transition-colors hover:bg-eucalyptus-light/60 focus:outline-none focus:ring-2 focus:ring-eucalyptus/30 disabled:cursor-not-allowed disabled:opacity-40"
          >
            + Add a day
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-sandstone-dark/30 px-4 py-2 text-sm font-semibold text-warmgray transition-colors hover:border-ochre hover:text-ochre focus:outline-none focus:ring-2 focus:ring-eucalyptus/20"
          >
            Clear timesheet
          </button>
        </div>

        {/* ---------------- Pay settings ---------------- */}
        <div className="mt-8 grid gap-6 border-t border-sandstone-dark/20 pt-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-navy">
              Pay settings
            </h3>

            <div>
              <label htmlFor={`${uid}-rate`} className="mb-1 block text-sm font-medium text-navy">
                Base hourly rate
              </label>
              <div className="flex items-center">
                <span className="mr-2 text-warmgray-light">$</span>
                <input
                  id={`${uid}-rate`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={1000}
                  step={0.01}
                  value={state.hourlyRate}
                  onChange={(e) => patch({ hourlyRate: clamp(toNumber(e.target.value), 0, 1000) })}
                  className={numberClass}
                />
              </div>
              <p className="mt-1 text-xs text-warmgray-light">
                Defaults to the national minimum wage of{" "}
                {formatAUD(EMPLOYMENT.minimumWageHourly, 2)} an hour from{" "}
                {SITE_CONFIG.financialYearStart}. Enter your own award or contract rate before
                loading.
              </p>
            </div>

            <label className="flex items-start gap-2 text-sm text-navy">
              <input
                type="checkbox"
                checked={state.casual}
                onChange={(e) => patch({ casual: e.target.checked })}
                className="mt-1 rounded border-sandstone-dark/40 text-eucalyptus focus:ring-eucalyptus/20"
              />
              <span>
                Add {CASUAL_LOADING * 100}% casual loading
                <span className="block text-xs text-warmgray-light">
                  Lifts {formatAUD(state.hourlyRate, 2)} to{" "}
                  {formatAUD(state.hourlyRate * (1 + CASUAL_LOADING), 2)} an hour. Casuals receive
                  the loading instead of paid leave.
                </span>
              </span>
            </label>

            <label className="flex items-start gap-2 text-sm text-navy">
              <input
                type="checkbox"
                checked={state.overtimeEnabled}
                onChange={(e) => patch({ overtimeEnabled: e.target.checked })}
                className="mt-1 rounded border-sandstone-dark/40 text-eucalyptus focus:ring-eucalyptus/20"
              />
              <span>
                Apply overtime past a threshold
                <span className="block text-xs text-warmgray-light">
                  Turn this off if every hour is paid at the same flat rate.
                </span>
              </span>
            </label>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-navy">
              Overtime rules
            </h3>

            <fieldset disabled={!state.overtimeEnabled} className="space-y-4 disabled:opacity-50">
              <legend className="sr-only">Overtime thresholds and multipliers</legend>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor={`${uid}-threshold`}
                    className="mb-1 block text-sm font-medium text-navy"
                  >
                    Ordinary hours
                  </label>
                  <input
                    id={`${uid}-threshold`}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={200}
                    step={0.5}
                    value={state.threshold}
                    onChange={(e) => patch({ threshold: clamp(toNumber(e.target.value), 0, 200) })}
                    className={numberClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${uid}-band`}
                    className="mb-1 block text-sm font-medium text-navy"
                  >
                    First band (h)
                  </label>
                  <input
                    id={`${uid}-band`}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={100}
                    step={0.5}
                    value={state.firstTierHours}
                    onChange={(e) =>
                      patch({ firstTierHours: clamp(toNumber(e.target.value), 0, 100) })
                    }
                    className={numberClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${uid}-mult1`}
                    className="mb-1 block text-sm font-medium text-navy"
                  >
                    First band rate
                  </label>
                  <input
                    id={`${uid}-mult1`}
                    type="number"
                    inputMode="decimal"
                    min={1}
                    max={5}
                    step={0.25}
                    value={state.firstTierMultiplier}
                    onChange={(e) =>
                      patch({ firstTierMultiplier: clamp(toNumber(e.target.value) || 1, 1, 5) })
                    }
                    className={numberClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${uid}-mult2`}
                    className="mb-1 block text-sm font-medium text-navy"
                  >
                    After that
                  </label>
                  <input
                    id={`${uid}-mult2`}
                    type="number"
                    inputMode="decimal"
                    min={1}
                    max={5}
                    step={0.25}
                    value={state.secondTierMultiplier}
                    onChange={(e) =>
                      patch({ secondTierMultiplier: clamp(toNumber(e.target.value) || 1, 1, 5) })
                    }
                    className={numberClass}
                  />
                </div>
              </div>
            </fieldset>

            <p className="text-xs text-warmgray-light">
              The defaults — {STANDARD_WEEKLY_HOURS} ordinary hours a week, then{" "}
              {OVERTIME_DEFAULTS.firstTierMultiplier}× for the first{" "}
              {OVERTIME_DEFAULTS.firstTierHours} hours and{" "}
              {OVERTIME_DEFAULTS.secondTierMultiplier}× after that — are a common pattern, not a
              universal rule. <strong>Your award sets the real thresholds.</strong> Retail bands
              overtime differently from Monday to Saturday; hospitality pays the first two hours at
              time and a half then double time; many awards also trigger overtime on a daily limit.
              Check the{" "}
              <Link
                href="/overtime-penalty-rates-guide/"
                className="text-eucalyptus-dark hover:underline"
              >
                overtime and penalty rates guide
              </Link>{" "}
              before relying on a figure.
            </p>
          </div>
        </div>

        {/* ---------------- Results ---------------- */}
        <div className="mt-8 grid gap-6 border-t border-sandstone-dark/20 pt-6 md:grid-cols-2">
          <div
            className="rounded-xl border border-sandstone-dark/20 bg-sandstone p-6 text-center shadow-sm"
            aria-live="polite"
          >
            <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-ochre">
              Total hours worked
            </div>
            <div className="mb-1 text-4xl font-extrabold tabular-nums text-navy">
              {formatDecimalHours(totals.totalHours)}
            </div>
            <div className="text-sm text-warmgray">
              decimal hours &middot; {minutesToHm(totals.paidMinutes)} in h:mm
            </div>
            <div className="mt-4 space-y-3 border-t border-sandstone-dark/20 pt-4 text-left text-sm">
              <SummaryRow label="Days worked" value={String(totals.daysWorked)} />
              <SummaryRow
                label="Unpaid breaks deducted"
                value={minutesToHm(totals.breakMinutes)}
                muted
              />
              {weekSubtotals.length > 1 &&
                weekSubtotals.map((mins, i) => (
                  <SummaryRow
                    key={`wk${i}`}
                    label={`Week ${i + 1}`}
                    value={`${formatDecimalHours(minutesToDecimalHours(mins))} h · ${minutesToHm(mins)}`}
                    muted
                  />
                ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 bg-white">
            <div className="border-b border-sandstone-dark/20 bg-sandstone px-5 py-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-navy">
                Gross pay for the period
              </h3>
            </div>
            <div className="space-y-3 p-5 text-sm" aria-live="polite">
              <SummaryRow label="Base hourly rate" value={formatAUD(pay.baseRate, 2)} />
              {state.casual && (
                <SummaryRow
                  label={`With ${CASUAL_LOADING * 100}% casual loading`}
                  value={formatAUD(pay.effectiveRate, 2)}
                  muted
                />
              )}
              <div className="border-t border-sandstone-dark/10 pt-3" />
              <SummaryRow
                label={`Ordinary — ${formatDecimalHours(pay.split.ordinaryHours)} h`}
                value={formatAUD(pay.ordinaryPay, 2)}
              />
              {pay.split.firstTierHours > 0 && (
                <SummaryRow
                  label={`Overtime at ${state.firstTierMultiplier}× — ${formatDecimalHours(pay.split.firstTierHours)} h`}
                  value={formatAUD(pay.firstTierPay, 2)}
                />
              )}
              {pay.split.secondTierHours > 0 && (
                <SummaryRow
                  label={`Overtime at ${state.secondTierMultiplier}× — ${formatDecimalHours(pay.split.secondTierHours)} h`}
                  value={formatAUD(pay.secondTierPay, 2)}
                />
              )}
              <div className="border-t border-sandstone-dark/20 pt-3" />
              <SummaryRow label="Gross pay" value={formatAUD(pay.gross, 2)} bold />
              {!hasOvertime && state.overtimeEnabled && totals.totalHours > 0 && (
                <p className="text-xs text-warmgray-light">
                  Under the {formatDecimalHours(state.threshold)}-hour threshold, so every hour is
                  paid at the ordinary rate.
                </p>
              )}
              <p className="text-xs text-warmgray-light">
                Gross, before tax and super. Run the figure through the{" "}
                <Link
                  href="/take-home-pay-calculator/"
                  className="text-eucalyptus-dark hover:underline"
                >
                  take-home pay calculator
                </Link>{" "}
                to see what lands in your account.
              </p>
            </div>
          </div>
        </div>

        {/* ---------------- Copy / print ---------------- */}
        <div className="mt-6 flex flex-wrap items-center gap-3 print:hidden">
          <button
            type="button"
            onClick={copySummary}
            className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-eucalyptus/40"
          >
            Copy summary
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-sandstone-dark/30 px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-eucalyptus focus:outline-none focus:ring-2 focus:ring-eucalyptus/20"
          >
            Print timesheet
          </button>
          <span aria-live="polite" className="text-sm text-eucalyptus-dark">
            {copied ? "Copied to clipboard" : ""}
          </span>
        </div>

        <details className="mt-4 rounded-lg border border-sandstone-dark/20 bg-sandstone/30">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-navy">
            Plain-text summary
          </summary>
          <pre className="overflow-x-auto border-t border-sandstone-dark/20 px-4 py-3 text-xs leading-relaxed text-warmgray">
            {summaryText}
          </pre>
        </details>
      </CardContent>
    </Card>
  );
}
