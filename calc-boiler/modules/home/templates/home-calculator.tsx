"use client";

// The homepage's interactive calculator card. Everything else on the page
// (hero copy, the long-form sections, FAQ) is rendered by the server template
// in ./index.tsx, so it ships as HTML instead of JavaScript.
//
// Animations are CSS (globals.css: .donut-segment, .dollar-cell, tw-animate
// utilities) plus a small requestAnimationFrame tween for the headline number.
// framer-motion used to cost ~130 KB of JS here for the same effects.

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, TrendingUp, Building2, GraduationCap, Heart, DollarSign, Percent, PiggyBank, Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AmountPresets } from "@/modules/calculator/head-term-ui";
import { HEAD_TERM_PRIMARY } from "@/modules/calculator/head-term-primary";
import { calculatePayBreakdown, formatAUD, formatNegAUD, formatPercent, SUPER_GUARANTEE, EMPLOYMENT } from "@/lib/constants";
import ResultNextSteps, { type ResultNextStep } from "@/components/common/result-next-steps";
import StickyResult from "@/components/common/sticky-result";
import { hasPage, nearestSalary, salaryHref } from "@/lib/data/salary-pages";
import { SourceBadge } from "./source-badge";

type PayBasis = "annual" | "hourly" | "daily" | "weekly" | "fortnightly" | "monthly";
type PayFrequency = "annual" | "monthly" | "fortnightly" | "weekly" | "hourly";

const pctX = (v: number) => `${Math.round(v * 100)}%`;

const SALARY_PRESETS = [50_000, 75_000, 100_000, 150_000] as const;

const OVERTIME_RATES = [
  { value: 1.5, label: "Time & Half (1.5x)" },
  { value: 2.0, label: "Double Time (2x)" },
  { value: 2.5, label: "Public Holiday (2.5x)" },
];

const frequencyLabel: Record<PayFrequency, string> = {
  annual: "per year",
  monthly: "per month",
  fortnightly: "per fortnight",
  weekly: "per week",
  hourly: "per hour",
};

/** The pay-frequency calculator page that matches the frequency picked (all routes exist under app/). */
const FREQUENCY_CALC: Record<PayFrequency, { href: string; label: string }> = {
  annual: { href: "/annual-pay-calculator/", label: "Annual pay calculator" },
  monthly: { href: "/monthly-pay-calculator/", label: "Monthly pay calculator" },
  fortnightly: { href: "/fortnightly-pay-calculator/", label: "Fortnightly pay calculator" },
  weekly: { href: "/weekly-pay-calculator/", label: "Weekly pay calculator" },
  hourly: { href: "/hourly-to-salary/", label: "Hourly rate to annual salary calculator" },
};

const BASIS_META: Record<PayBasis, { label: string; inputLabel: string; unit: string; default: number; max: number; step: number }> = {
  annual: { label: "Annual", inputLabel: "Your Annual Salary", unit: "/ yr", default: 80_000, max: 500_000, step: 1_000 },
  hourly: { label: "Hourly", inputLabel: "Your Hourly Rate", unit: "/ hr", default: 40, max: 1_000, step: 0.5 },
  daily: { label: "Daily", inputLabel: "Your Daily Rate", unit: "/ day", default: 320, max: 5_000, step: 10 },
  weekly: { label: "Weekly", inputLabel: "Your Weekly Pay", unit: "/ wk", default: 1_600, max: 10_000, step: 50 },
  fortnightly: { label: "Fortnightly", inputLabel: "Your Fortnightly Pay", unit: "/ fn", default: 3_100, max: 20_000, step: 100 },
  monthly: { label: "Monthly", inputLabel: "Your Monthly Pay", unit: "/ mo", default: 6_700, max: 45_000, step: 100 },
};

/**
 * Convert any pay basis to an annualised salary using the site's established
 * 52-week convention (EMPLOYMENT.weeksPerYear — matching the hourly-to-annual
 * calculator, wagecalculator, payly and the AI Overview). Casual loading adds
 * the standard 25% to the base rate before annualising.
 */
function annualise(basis: PayBasis, amount: number, hoursPerWeek: number, casual: boolean): number {
  const loaded = casual ? amount * (1 + EMPLOYMENT.casualLoading) : amount;
  switch (basis) {
    case "hourly": return Math.round(loaded * hoursPerWeek * EMPLOYMENT.weeksPerYear);
    case "daily": return Math.round(loaded * 5 * EMPLOYMENT.weeksPerYear);
    case "weekly": return Math.round(loaded * EMPLOYMENT.weeksPerYear);
    case "fortnightly": return Math.round(loaded * 26);
    case "monthly": return Math.round(loaded * 12);
    default: return Math.round(loaded);
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// ─── Animated Number Component ───
/** Eases from the previous value to the new one (~0.5 s). The first render is
 * the final value, so the static HTML carries the real figure. */
function AnimatedNumber({ value, decimals = 0, prefix = "$", className = "" }: { value: number; decimals?: number; prefix?: string; className?: string }) {
  const [shown, setShown] = useState(value);
  const shownRef = useRef(value);

  useEffect(() => {
    const from = shownRef.current;
    if (from === value) return;
    let raf = 0;
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const duration = reduce ? 0 : 500;
    const tick = (now: number) => {
      const t = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = t === 1 ? value : from + (value - from) * eased;
      shownRef.current = v;
      setShown(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const formatted = Math.abs(shown).toLocaleString("en-AU", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return <span className={className}>{`${prefix}${formatted}`}</span>;
}

// ─── Donut Chart Component ───
function DonutChart({ segments, size = 200 }: { segments: { label: string; value: number; color: string; }[]; size?: number }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total <= 0) return null;

  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Precompute arc geometry so nothing is reassigned inside the JSX render.
  const arcs: { segment: { label: string; value: number; color: string }; dashLength: number; dashOffset: number }[] = [];
  for (const segment of segments) {
    const percentage = segment.value / total;
    const prev = arcs.length > 0 ? arcs[arcs.length - 1] : undefined;
    const accumulated = prev ? prev.dashOffset + prev.dashLength : 0;
    arcs.push({ segment, dashLength: circumference * percentage, dashOffset: accumulated });
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {arcs.map(({ segment, dashLength, dashOffset }, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={16}
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            strokeDashoffset={-dashOffset}
            strokeLinecap="round"
            className="donut-segment"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-warmgray-light">Take-home</span>
        <AnimatedNumber
          value={segments.find(s => s.label === "Take-Home Pay")?.value ?? 0}
          className="text-lg font-bold text-navy"
          prefix="$"
        />
      </div>
    </div>
  );
}

// ─── Dollar Grid Visualization ───
function DollarGrid({ takeHome, tax, medicare, hecs, total }: {
  takeHome: number; tax: number; medicare: number; hecs: number; total: number;
}) {
  if (total <= 0) return null;

  const cells = 100;
  const takeHomeCells = Math.round((takeHome / total) * cells);
  const taxCells = Math.round((tax / total) * cells);
  const medicareCells = Math.round((medicare / total) * cells);
  const hecsCells = Math.round((hecs / total) * cells);
  const superCells = cells - takeHomeCells - taxCells - medicareCells - hecsCells;

  const grid: { color: string; label: string }[] = [];
  for (let i = 0; i < takeHomeCells; i++) grid.push({ color: "bg-eucalyptus", label: "Take-home" });
  for (let i = 0; i < taxCells; i++) grid.push({ color: "bg-ochre", label: "Income Tax" });
  for (let i = 0; i < medicareCells; i++) grid.push({ color: "bg-rose-400", label: "Medicare" });
  for (let i = 0; i < hecsCells; i++) grid.push({ color: "bg-violet-400", label: "HECS" });
  for (let i = 0; i < Math.max(0, superCells); i++) grid.push({ color: "bg-sky-400", label: "Super" });

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-semibold text-warmgray" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
        Every $100 of your salary
      </p>
      <div className="grid grid-cols-10 gap-[3px]">
        {grid.slice(0, 100).map((cell, i) => (
          <div
            key={i}
            style={{ animationDelay: `${i * 8}ms` }}
            className={`dollar-cell aspect-square rounded-[3px] ${cell.color}`}
            title={cell.label}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-[10px]">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-eucalyptus" /> Take-home</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-ochre" /> Tax</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-rose-400" /> Medicare</span>
        {hecs > 0 && <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-violet-400" /> HECS</span>}
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-sky-400" /> Super</span>
      </div>
    </div>
  );
}

export default function HomeCalculator() {
  // Pay basis + amount
  const [payBasis, setPayBasis] = useState<PayBasis>("annual");
  const [amount, setAmount] = useState<number>(BASIS_META.annual.default);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(EMPLOYMENT.standardWeeklyHours);
  const [casual, setCasual] = useState(false);
  const [frequency, setFrequency] = useState<PayFrequency>("annual");
  const [includeHECS, setIncludeHECS] = useState(false);
  const [hasPrivateHealth, setHasPrivateHealth] = useState(true);

  // Toggles
  const [superIncluded, setSuperIncluded] = useState(false);
  const [proRataEnabled, setProRataEnabled] = useState(false);
  const [proRataHours, setProRataHours] = useState(25);

  // Advanced options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [bonus, setBonus] = useState(0);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [overtimeRate, setOvertimeRate] = useState(1.5);
  const [novatedLease, setNovatedLease] = useState(0);
  const [includeBonusInSG, setIncludeBonusInSG] = useState(false);
  const [includeOvertimeInSG, setIncludeOvertimeInSG] = useState(false);

  // Pay rise simulator
  const [payRiseAmount, setPayRiseAmount] = useState(5000);

  const switchBasis = (b: PayBasis) => {
    setPayBasis(b);
    setAmount(BASIS_META[b].default);
  };

  // Annualised salary from whichever basis was entered (52-week convention).
  const annualSalary = useMemo(
    () => annualise(payBasis, amount, hoursPerWeek, casual),
    [payBasis, amount, hoursPerWeek, casual]
  );

  // Pro-rata only applies where hours aren't already explicit (hourly basis).
  const effectiveProRataHours = proRataEnabled && payBasis !== "hourly" ? proRataHours : undefined;

  const result = useMemo(
    () =>
      calculatePayBreakdown({
        grossSalary: annualSalary,
        includeHECS,
        hasPrivateHealth,
        superIncluded,
        proRataHours: effectiveProRataHours,
        bonus,
        overtimeHours,
        overtimeRate,
        novatedLease,
        includeBonusInSG,
        includeOvertimeInSG,
      }),
    [annualSalary, includeHECS, hasPrivateHealth, superIncluded, effectiveProRataHours, bonus, overtimeHours, overtimeRate, novatedLease, includeBonusInSG, includeOvertimeInSG]
  );

  // Pay rise result
  const payRiseResult = useMemo(
    () =>
      calculatePayBreakdown({
        grossSalary: annualSalary + payRiseAmount,
        includeHECS,
        hasPrivateHealth,
        superIncluded,
        proRataHours: effectiveProRataHours,
        bonus,
        overtimeHours,
        overtimeRate,
        novatedLease,
        includeBonusInSG,
        includeOvertimeInSG,
      }),
    [annualSalary, payRiseAmount, includeHECS, hasPrivateHealth, superIncluded, effectiveProRataHours, bonus, overtimeHours, overtimeRate, novatedLease, includeBonusInSG, includeOvertimeInSG]
  );

  const hourlyDivisorHours = payBasis === "hourly"
    ? hoursPerWeek
    : (effectiveProRataHours ?? EMPLOYMENT.standardWeeklyHours);

  const displayTakeHome = useMemo(() => {
    switch (frequency) {
      case "weekly": return result.weekly;
      case "fortnightly": return result.fortnightly;
      case "monthly": return result.monthly;
      case "hourly": return Math.round((result.takeHomePay / EMPLOYMENT.weeksPerYear / Math.max(1, hourlyDivisorHours)) * 100) / 100;
      default: return result.takeHomePay;
    }
  }, [result, frequency, hourlyDivisorHours]);

  const hourlyRate = useMemo(
    () => result.grossSalary / EMPLOYMENT.weeksPerYear / Math.max(1, hourlyDivisorHours),
    [result.grossSalary, hourlyDivisorHours]
  );

  // Donut chart segments
  const donutSegments = useMemo(() => [
    { label: "Take-Home Pay", value: result.takeHomePay, color: "#2d9e7c" },
    { label: "Income Tax", value: result.netIncomeTax, color: "#d4891c" },
    { label: "Medicare", value: result.medicareLevy + result.medicareSurcharge, color: "#f43f5e" },
    ...(result.hecsRepayment > 0 ? [{ label: "HECS", value: result.hecsRepayment, color: "#8b5cf6" }] : []),
  ], [result]);

  const extraWeeklyFromRise = payRiseResult.weekly - result.weekly;
  const basisMeta = BASIS_META[payBasis];

  // Next-step links inside the result card, carrying the visitor's own salary
  // (GA4 Jan–Sep 2026: 1.10 pages/session; the answer card had no links).
  // Salary pages sit on a grid, so each link goes to the nearest page and says
  // so when it is not the exact figure entered.
  const nextSteps = useMemo<ResultNextStep[]>(() => {
    const gross = Math.round(result.grossSalary);
    const nearestOf = (family: "take-home" | "tax-on" | "salary-to-hourly") => {
      const n = nearestSalary(family, gross);
      return { n, detail: n === gross ? undefined : `Nearest salary page to ${formatAUD(gross)}` };
    };
    const th = nearestOf("take-home");
    const tx = nearestOf("tax-on");
    const links: ResultNextStep[] = [
      { href: salaryHref("take-home", th.n), label: `Full breakdown of ${formatAUD(th.n)} take-home`, detail: th.detail },
      { href: salaryHref("tax-on", tx.n), label: `How much tax on ${formatAUD(tx.n)}`, detail: tx.detail },
    ];
    if (payBasis === "hourly") {
      links.push({ href: "/hourly-to-salary/", label: "Convert your hourly rate to a salary" });
    } else {
      const sh = nearestOf("salary-to-hourly");
      // Only when a page exists within ~10% of the entered salary (the hourly grid starts at $30k).
      if (hasPage("salary-to-hourly", sh.n) && Math.abs(sh.n - gross) <= Math.max(5_000, gross * 0.1)) {
        links.push({ href: salaryHref("salary-to-hourly", sh.n), label: `${formatAUD(sh.n)} salary as an hourly rate`, detail: sh.detail });
      }
    }
    const fc = FREQUENCY_CALC[frequency];
    links.push({ href: fc.href, label: fc.label, detail: `Tax and super shown ${frequencyLabel[frequency]}` });
    // De-duplicate by href (hourly basis + hourly frequency both point at /hourly-to-salary/).
    const seen = new Set<string>();
    return links.filter((l) => (seen.has(l.href) ? false : (seen.add(l.href), true))).slice(0, 4);
  }, [result.grossSalary, payBasis, frequency]);

  const headlineFormatted = formatAUD(displayTakeHome, frequency === "hourly" ? 2 : 0);

  return (
    <>
    <StickyResult targetId="calc-result" label="Take-home pay" value={headlineFormatted} hint={frequencyLabel[frequency]} />
    <Card className="border-0 bg-white shadow-2xl">
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          {/* Pay basis tabs */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              I&apos;m paid
            </label>
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-sandstone p-1 sm:grid-cols-6">
              {(Object.keys(BASIS_META) as PayBasis[]).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => switchBasis(b)}
                  className={`rounded-lg px-2 py-2.5 text-xs font-semibold transition-all duration-200 ${
                    payBasis === b
                      ? "bg-navy text-white shadow-md"
                      : "text-warmgray hover:text-navy hover:bg-sandstone-dark/30"
                  }`}
                >
                  {BASIS_META[b].label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label
              htmlFor="salary"
              className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-navy"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              {superIncluded && payBasis === "annual" ? "Total Package (inc. Super)" : basisMeta.inputLabel}
              <SourceBadge label="ATO" href="https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents" />
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-semibold text-warmgray-light">$</span>
              <input
                type="number"
                id="salary"
                name="salary"
                min={0}
                max={basisMeta.max}
                step={basisMeta.step}
                value={amount}
                onChange={(e) => setAmount(clamp(Number(e.target.value || 0), 0, basisMeta.max))}
                className="block w-full rounded-xl border-2 border-sandstone-dark/30 bg-sandstone/30 py-3.5 pl-9 pr-14 text-2xl font-bold text-navy shadow-sm transition-all focus:border-eucalyptus focus:bg-white focus:ring-2 focus:ring-eucalyptus/20"
                aria-describedby="salary-hint"
              />
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-warmgray-light">{basisMeta.unit}</span>
            </div>
            {/* Live summary — visible above the fold before any toggles */}
            <div
              className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-eucalyptus-light/40 p-2 text-center"
              aria-live="polite"
              aria-label="Take-home pay summary"
            >
              <div>
                <div className="text-[10px] font-medium uppercase tracking-wide text-warmgray-light">Take-home / yr</div>
                <div className="text-sm font-bold text-eucalyptus-dark sm:text-base">{formatAUD(result.takeHomePay)}</div>
              </div>
              <div>
                <div className="text-[10px] font-medium uppercase tracking-wide text-warmgray-light">/ fortnight</div>
                <div className="text-sm font-bold text-navy sm:text-base">{formatAUD(result.fortnightly)}</div>
              </div>
              <div>
                <div className="text-[10px] font-medium uppercase tracking-wide text-warmgray-light">/ week</div>
                <div className="text-sm font-bold text-navy sm:text-base">{formatAUD(result.weekly)}</div>
              </div>
            </div>
            {/* Per-period primaries, right under the fortnight/week figures:
                the homepage was ranking for "fortnightly/weekly pay calculator"
                in place of the dedicated pages (intent map, Sep 2026). */}
            <p className="mt-2 text-center text-xs text-warmgray">
              Paid by the fortnight or week? Use the{" "}
              <Link href={HEAD_TERM_PRIMARY.fortnightlyPayCalculator.href} className="font-medium text-eucalyptus-dark hover:underline">{HEAD_TERM_PRIMARY.fortnightlyPayCalculator.anchor}</Link>
              {" "}or the{" "}
              <Link href={HEAD_TERM_PRIMARY.weeklyPayCalculator.href} className="font-medium text-eucalyptus-dark hover:underline">{HEAD_TERM_PRIMARY.weeklyPayCalculator.anchor}</Link>.
            </p>

            {/* Hours per week — hourly basis only */}
            {payBasis === "hourly" && (
              <div className="mt-3">
                <label htmlFor="hours-per-week" className="mb-1 block text-xs text-warmgray-light">
                  Hours per week (full-time = {EMPLOYMENT.standardWeeklyHours})
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="hours-per-week"
                    min={1}
                    max={80}
                    step={0.5}
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(clamp(Number(e.target.value || 1), 1, 80))}
                    className="block w-24 rounded-lg border border-sandstone-dark/30 bg-white px-3 py-2 text-sm shadow-sm focus:border-eucalyptus focus:ring-1 focus:ring-eucalyptus/20"
                  />
                  {[38, 40, 20].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setHoursPerWeek(preset)}
                      className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        hoursPerWeek === preset
                          ? "border-eucalyptus bg-eucalyptus-light/30 text-eucalyptus-dark"
                          : "border-sandstone-dark/20 bg-white text-warmgray hover:bg-sandstone/50"
                      }`}
                    >
                      {preset} hrs
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Slider — annual basis only */}
            {payBasis === "annual" && (
              <div className="relative mt-3">
                <input
                  type="range"
                  id="salary-slider"
                  min={0}
                  max={300000}
                  step={1000}
                  value={clamp(amount, 0, 300000)}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-0 w-full accent-eucalyptus"
                  aria-hidden="true" tabIndex={-1}
                />
                <div className="mt-0.5 flex justify-between text-[9px] text-warmgray-light/60">
                  {[0, 50000, 100000, 150000, 200000, 250000, 300000].map((tick) => (
                    <span key={tick} className={tick <= amount ? "text-eucalyptus-dark/50 font-medium" : ""}>
                      {tick === 0 ? "$0" : `$${tick / 1000}K`}
                    </span>
                  ))}
                </div>
                <AmountPresets values={SALARY_PRESETS} current={amount} onPick={setAmount} />
              </div>
            )}

            <p id="salary-hint" className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-warmgray-light">
              {payBasis === "annual" ? (
                <>
                  <span>Hourly rate: {formatAUD(hourlyRate, 2)}</span>
                  <span className="text-warmgray-light/30">|</span>
                  <span>Based on {hourlyDivisorHours}hr week</span>
                </>
              ) : (
                <span>
                  = {formatAUD(annualSalary)} a year
                  {casual ? ` incl. ${pctX(EMPLOYMENT.casualLoading)} casual loading` : ""}
                  {payBasis === "hourly" ? ` (${hoursPerWeek} hrs × ${EMPLOYMENT.weeksPerYear} weeks)` : ""}
                </span>
              )}
            </p>

          </div>

          {/* Casual loading toggle */}
          <div className="rounded-xl border border-sandstone-dark/30 bg-sandstone/20 p-3.5">
            <label className="flex cursor-pointer items-center justify-between text-sm">
              <span className="font-medium text-navy">Casual worker — add {pctX(EMPLOYMENT.casualLoading)} loading</span>
              <input
                type="checkbox"
                checked={casual}
                onChange={(e) => setCasual(e.target.checked)}
                className="h-4 w-4 rounded border-sandstone-dark text-eucalyptus focus:ring-eucalyptus"
              />
            </label>
            <p className="mt-1.5 text-xs text-warmgray-light">
              Adds the standard {pctX(EMPLOYMENT.casualLoading)} casual loading to your base rate. Your award may set a different figure — check the{" "}
              <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">award rates guide</Link>.
            </p>
          </div>

          {/* Core Toggles */}
          <div className="space-y-2">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={superIncluded}
                onChange={(e) => setSuperIncluded(e.target.checked)}
                className="h-4 w-4 rounded border-sandstone-dark text-eucalyptus focus:ring-eucalyptus"
              />
              <span className="text-warmgray">Salary includes superannuation</span>
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={includeHECS}
                  onChange={(e) => setIncludeHECS(e.target.checked)}
                  className="h-4 w-4 rounded border-sandstone-dark text-eucalyptus focus:ring-eucalyptus"
                />
                <span className="text-warmgray">Include HECS-HELP</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={hasPrivateHealth}
                  onChange={(e) => setHasPrivateHealth(e.target.checked)}
                  className="h-4 w-4 rounded border-sandstone-dark text-eucalyptus focus:ring-eucalyptus"
                />
                <span className="text-warmgray">Private health insurance</span>
              </label>
            </div>
          </div>

          {/* Pro-Rata / Part-Time (hidden on hourly basis — hours are explicit there) */}
          {payBasis !== "hourly" && (
            <div className="rounded-xl border border-sandstone-dark/30 bg-sandstone/20 p-3.5">
              <label className="flex cursor-pointer items-center justify-between text-sm">
                <span className="font-medium text-navy">Pro-Rata / Part-Time</span>
                <input
                  type="checkbox"
                  checked={proRataEnabled}
                  onChange={(e) => setProRataEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-sandstone-dark text-eucalyptus focus:ring-eucalyptus"
                />
              </label>
                {proRataEnabled && (
                  <div className="overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="mt-3">
                      <label htmlFor="pro-rata-hours" className="mb-1 block text-xs text-warmgray-light">
                        Hours per week (full-time = {EMPLOYMENT.standardWeeklyHours})
                      </label>
                      <input
                        type="number"
                        id="pro-rata-hours"
                        min={1}
                        max={EMPLOYMENT.standardWeeklyHours}
                        step={1}
                        value={proRataHours}
                        onChange={(e) => setProRataHours(clamp(Number(e.target.value || 1), 1, EMPLOYMENT.standardWeeklyHours))}
                        className="block w-full rounded-lg border border-sandstone-dark/30 bg-white px-3 py-2 text-sm shadow-sm focus:border-eucalyptus focus:ring-1 focus:ring-eucalyptus/20"
                      />
                      <p className="mt-1 text-xs text-warmgray-light">
                        Pro-rata salary: {formatAUD(result.grossSalary)} ({Math.round((proRataHours / EMPLOYMENT.standardWeeklyHours) * 100)}% of full-time)
                      </p>
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Frequency */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Show me take-home pay
            </label>
            <div className="grid grid-cols-5 gap-1 rounded-xl bg-sandstone p-1">
              {(["annual", "monthly", "fortnightly", "weekly", "hourly"] as PayFrequency[]).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFrequency(freq)}
                  className={`rounded-lg px-2 py-2.5 text-xs font-semibold capitalize transition-all duration-200 ${
                    frequency === freq
                      ? "bg-navy text-white shadow-md"
                      : "text-warmgray hover:text-navy hover:bg-sandstone-dark/30"
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Options */}
          <div className="rounded-xl border border-sandstone-dark/30">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-navy transition-colors hover:bg-sandstone/30"
            >
              <span>Advanced Options</span>
              {showAdvanced ? <ChevronUp className="h-4 w-4 text-warmgray-light" /> : <ChevronDown className="h-4 w-4 text-warmgray-light" />}
            </button>
              {showAdvanced && (
                <div className="overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="space-y-4 border-t border-sandstone-dark/20 px-4 py-4">
                    {/* Bonus */}
                    <div>
                      <label htmlFor="bonus" className="mb-1 block text-xs font-medium text-warmgray">Bonus (Annual $)</label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-warmgray-light">$</span>
                        <input type="number" id="bonus" min={0} step={500} value={bonus || ""} onChange={(e) => setBonus(Math.max(0, Number(e.target.value || 0)))} placeholder="0" className="block w-full rounded-lg border border-sandstone-dark/30 bg-white py-2 pl-7 pr-3 text-sm shadow-sm focus:border-eucalyptus focus:ring-1 focus:ring-eucalyptus/20" />
                      </div>
                      <label className="mt-1 flex cursor-pointer items-center gap-2 text-xs text-warmgray-light">
                        <input type="checkbox" checked={includeBonusInSG} onChange={(e) => setIncludeBonusInSG(e.target.checked)} className="h-3 w-3 rounded border-sandstone-dark text-eucalyptus" />
                        Include bonus in super
                      </label>
                    </div>

                    {/* Overtime */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-warmgray">Overtime (Hours/Week)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input type="number" id="overtime-hours" min={0} max={40} step={1} value={overtimeHours || ""} onChange={(e) => setOvertimeHours(clamp(Number(e.target.value || 0), 0, 40))} placeholder="0 hrs" className="block w-full rounded-lg border border-sandstone-dark/30 bg-white px-3 py-2 text-sm shadow-sm focus:border-eucalyptus focus:ring-1 focus:ring-eucalyptus/20" aria-label="Overtime hours per week" />
                        <select id="overtime-rate" value={overtimeRate} onChange={(e) => setOvertimeRate(Number(e.target.value))} className="block w-full rounded-lg border border-sandstone-dark/30 bg-white px-3 py-2 text-sm shadow-sm focus:border-eucalyptus focus:ring-1 focus:ring-eucalyptus/20" aria-label="Overtime rate">
                          {OVERTIME_RATES.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                      </div>
                      <label className="mt-1 flex cursor-pointer items-center gap-2 text-xs text-warmgray-light">
                        <input type="checkbox" checked={includeOvertimeInSG} onChange={(e) => setIncludeOvertimeInSG(e.target.checked)} className="h-3 w-3 rounded border-sandstone-dark text-eucalyptus" />
                        Include overtime in super
                      </label>
                    </div>

                    {/* Novated Lease */}
                    <div>
                      <label htmlFor="novated-lease" className="mb-1 block text-xs font-medium text-warmgray">Novated Lease (Annual $)</label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-warmgray-light">$</span>
                        <input type="number" id="novated-lease" min={0} step={500} value={novatedLease || ""} onChange={(e) => setNovatedLease(Math.max(0, Number(e.target.value || 0)))} placeholder="0" className="block w-full rounded-lg border border-sandstone-dark/30 bg-white py-2 pl-7 pr-3 text-sm shadow-sm focus:border-eucalyptus focus:ring-1 focus:ring-eucalyptus/20" />
                      </div>
                      <p className="mt-1 text-xs text-warmgray-light">
                        Reduces taxable income.{" "}
                        <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Learn more</Link>
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </form>

        {/* ═══ LIVE RESULTS ═══ */}
        <div
          className="mt-6 space-y-5"
          role="region"
          aria-live="polite"
          aria-label="Pay breakdown results"
        >
          {/* Big take-home number */}
          <div id="calc-result" className="rounded-2xl bg-gradient-to-br from-navy via-navy-light to-navy p-6 text-center">
            <p className="mb-1 text-sm font-medium text-sandstone-dark/50">Your take-home pay</p>
            <div className="flex items-baseline justify-center gap-2">
              <AnimatedNumber
                value={displayTakeHome}
                decimals={frequency === "hourly" ? 2 : 0}
                className="text-4xl font-extrabold text-white sm:text-5xl"
              />
              <span className="text-base text-sandstone-dark/40">{frequencyLabel[frequency]}</span>
            </div>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-sandstone-dark/40">
              <span>Effective tax rate: <span className="font-semibold text-ochre-light">{formatPercent(result.effectiveTaxRate)}</span></span>
              <span className="text-white/10">|</span>
              <span className="flex items-center gap-1">
                <span className="live-dot" style={{ width: 6, height: 6 }} />
                Live calculation
              </span>
            </div>
          </div>

          {/* Next-step links carrying the visitor's own number, directly under the headline figure. */}
          <ResultNextSteps links={nextSteps} />

          {/* Donut + Breakdown side by side */}
          <div className="grid items-start gap-6 sm:grid-cols-[auto_1fr]">
            <div className="flex justify-center">
              <DonutChart segments={donutSegments} size={180} />
            </div>

            <div className="space-y-2 text-sm">
              <h2 className="mb-3 text-base font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Your Pay Breakdown
              </h2>
              <ResultRow label="Gross Salary" value={formatAUD(result.grossSalary)} bold />
              {result.bonus > 0 && <ResultRow label="Bonus" value={`+${formatAUD(result.bonus)}`} />}
              {result.overtimeEarnings > 0 && <ResultRow label="Overtime" value={`+${formatAUD(result.overtimeEarnings)}`} />}
              {result.novatedLease > 0 && <ResultRow label="Novated Lease" value={formatNegAUD(result.novatedLease)} />}
              <ResultRow label="Taxable Income" value={formatAUD(result.taxableIncome)} bold />
              <div className="border-t border-sandstone-dark/20" />
              <ResultRow label="Income Tax" value={formatNegAUD(result.netIncomeTax)} color="text-ochre" icon={<Receipt className="h-3.5 w-3.5" />} />
              {result.litoOffset > 0 && <ResultRow label="LITO Offset" value={`+${formatAUD(result.litoOffset)}`} sub />}
              <ResultRow label="Medicare Levy" value={formatNegAUD(result.medicareLevy)} color="text-rose-500" icon={<Heart className="h-3.5 w-3.5" />} />
              {result.medicareSurcharge > 0 && <ResultRow label="Medicare Surcharge" value={formatNegAUD(result.medicareSurcharge)} color="text-rose-500" />}
              {includeHECS && <ResultRow label="HECS Repayment" value={formatNegAUD(result.hecsRepayment)} color="text-violet-500" icon={<GraduationCap className="h-3.5 w-3.5" />} />}
              <div className="border-t border-sandstone-dark/20" />
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-base font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Take-Home Pay</span>
                <div className="text-right">
                  <AnimatedNumber value={displayTakeHome} decimals={frequency === "hourly" ? 2 : 0} className="text-2xl font-extrabold text-eucalyptus-dark" />
                  <span className="ml-1 text-xs text-warmgray-light">{frequencyLabel[frequency]}</span>
                </div>
              </div>
              <div className="border-t border-sandstone-dark/20 pt-2">
                <ResultRow label={`Superannuation (${formatPercent(SUPER_GUARANTEE.rate, 0)})`} value={`+${formatAUD(result.superContribution)}`} icon={<PiggyBank className="h-3.5 w-3.5" />} color="text-sky-500" />
                <ResultRow label="Total Package" value={formatAUD(result.totalPackage)} bold />
              </div>
            </div>
          </div>

          {/* Dollar Grid Visualization */}
          <DollarGrid
            takeHome={result.takeHomePay}
            tax={result.netIncomeTax}
            medicare={result.medicareLevy + result.medicareSurcharge}
            hecs={result.hecsRepayment}
            total={result.taxableIncome + result.superContribution}
          />

          {/* ═══ PAY RISE SIMULATOR ═══ */}
          <div className="rounded-xl border border-eucalyptus/20 bg-eucalyptus-light/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-eucalyptus-dark" />
              <h3 className="text-sm font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Pay Rise Simulator
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-warmgray">If you got a</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setPayRiseAmount(Math.max(1000, payRiseAmount - 1000))} className="rounded-md bg-white px-2 py-1 text-sm font-medium text-navy shadow-sm transition-colors hover:bg-sandstone">-</button>
                <span className="min-w-[70px] text-center text-base font-bold text-eucalyptus-dark">{formatAUD(payRiseAmount)}</span>
                <button type="button" onClick={() => setPayRiseAmount(Math.min(50000, payRiseAmount + 1000))} className="rounded-md bg-white px-2 py-1 text-sm font-medium text-navy shadow-sm transition-colors hover:bg-sandstone">+</button>
              </div>
              <span className="text-sm text-warmgray">raise</span>
            </div>
            <p className="mt-2 text-sm text-warmgray">
              You&apos;d take home an extra{" "}
              <span className="font-bold text-eucalyptus-dark">{formatAUD(extraWeeklyFromRise, 2)}/week</span>
              {" "}({formatAUD(payRiseResult.takeHomePay - result.takeHomePay)}/year after tax).
            </p>
            <Link href="/pay-rise-calculator/" className="mt-1 inline-block text-xs font-medium text-eucalyptus-dark hover:underline">
              Full pay rise calculator &rarr;
            </Link>
          </div>

          {/* ═══ CONTEXTUAL "WHAT THIS MEANS" CARDS ═══ */}
          <div className="grid gap-3 sm:grid-cols-2">
            <ContextCard
              icon={<DollarSign className="h-4 w-4" />}
              title="Daily earnings"
              value={formatAUD(result.daily, 2)}
              detail={`That's ${formatAUD(result.daily / 8, 2)} per hour of work`}
              color="eucalyptus"
            />
            <ContextCard
              icon={<PiggyBank className="h-4 w-4" />}
              title="Super balance growth"
              value={`+${formatAUD(result.superContribution)}/yr`}
              detail="Paid by your employer on top of your salary"
              color="sky"
            />
            <ContextCard
              icon={<Percent className="h-4 w-4" />}
              title="Marginal rate"
              value={formatPercent(result.marginalTaxRate)}
              detail="Tax on your next dollar earned (inc. Medicare)"
              color="ochre"
            />
            <ContextCard
              icon={<Building2 className="h-4 w-4" />}
              title="Employer total cost"
              value={formatAUD(result.totalPackage)}
              detail="What it actually costs your employer"
              color="navy"
            />
          </div>

          {/* Multi-Frequency Summary Table */}
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-xs">
              <thead className="bg-sandstone">
                <tr>
                  <th className="px-2 py-2.5 text-left font-semibold text-navy sm:px-3">Component</th>
                  <th className="px-2 py-2.5 text-right font-semibold text-navy sm:px-3">Daily</th>
                  <th className="px-2 py-2.5 text-right font-semibold text-navy sm:px-3">Weekly</th>
                  <th className="px-2 py-2.5 text-right font-semibold text-navy sm:px-3">Fortnightly</th>
                  <th className="px-2 py-2.5 text-right font-semibold text-navy sm:px-3">Monthly</th>
                  <th className="px-2 py-2.5 text-right font-semibold text-navy sm:px-3">Annual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                <FrequencyRow label="Taxable Income" annual={result.taxableIncome} />
                <FrequencyRow label={`Super (${formatPercent(SUPER_GUARANTEE.rate, 0)})`} annual={result.superContribution} />
                <FrequencyRow label="Total Taxes" annual={result.totalDeductions} highlight />
                <FrequencyRow label="  Income Tax" annual={result.netIncomeTax} sub />
                <FrequencyRow label="  Medicare Levy" annual={result.medicareLevy} sub />
                {result.litoOffset > 0 && <FrequencyRow label="  LITO Offset" annual={-result.litoOffset} sub />}
                <FrequencyRow label="Take-Home Pay" annual={result.takeHomePay} bold />
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  );
}

// ---------- Small components ----------

function ResultRow({ label, value, bold, sub, color, icon }: { label: string; value: string; bold?: boolean; sub?: boolean; color?: string; icon?: React.ReactNode }) {
  return (
    <div className={`flex items-center justify-between py-0.5 ${sub ? "pl-4" : ""}`}>
      <span className={`flex items-center gap-1.5 ${bold ? "font-semibold text-navy" : sub ? "text-xs text-warmgray-light" : `text-warmgray ${color ?? ""}`}`}>
        {icon}
        {label}
      </span>
      <span className={bold ? "font-bold text-navy" : sub ? "text-xs text-warmgray-light font-medium" : `font-medium ${color ?? "text-warmgray"}`}>
        {value}
      </span>
    </div>
  );
}

function FrequencyRow({ label, annual, bold, sub, highlight }: { label: string; annual: number; bold?: boolean; sub?: boolean; highlight?: boolean }) {
  const daily = annual / 260;
  const weekly = annual / 52;
  const fortnightly = annual / 26;
  const monthly = annual / 12;

  const cellClass = bold ? "font-bold text-navy" : highlight ? "font-semibold text-ochre" : sub ? "text-warmgray-light" : "text-warmgray";
  const labelClass = bold ? "font-bold text-navy" : highlight ? "font-semibold text-ochre" : sub ? "pl-3 text-warmgray-light" : "text-warmgray";
  const fmt = (v: number) => formatAUD(Math.abs(v), v !== 0 && Math.abs(v) < 100 ? 2 : 0);

  return (
    <tr className={bold ? "bg-eucalyptus-light/30" : ""}>
      <td className={`whitespace-nowrap px-2 py-1.5 sm:px-3 ${labelClass}`}>{label}</td>
      <td className={`px-2 py-1.5 text-right sm:px-3 ${cellClass}`}>{fmt(daily)}</td>
      <td className={`px-2 py-1.5 text-right sm:px-3 ${cellClass}`}>{fmt(weekly)}</td>
      <td className={`px-2 py-1.5 text-right sm:px-3 ${cellClass}`}>{fmt(fortnightly)}</td>
      <td className={`px-2 py-1.5 text-right sm:px-3 ${cellClass}`}>{fmt(monthly)}</td>
      <td className={`px-2 py-1.5 text-right sm:px-3 ${cellClass}`}>{fmt(annual)}</td>
    </tr>
  );
}

function ContextCard({ icon, title, value, detail, color }: { icon: React.ReactNode; title: string; value: string; detail: string; color: string }) {
  const colorMap: Record<string, string> = {
    eucalyptus: "bg-eucalyptus-light/40 border-eucalyptus/15 text-eucalyptus-dark",
    sky: "bg-sky-50 border-sky-200/40 text-sky-700",
    ochre: "bg-amber-50 border-amber-200/40 text-amber-700",
    navy: "bg-sandstone/50 border-sandstone-dark/20 text-navy",
  };

  return (
    <div className={`rounded-xl border p-4 ${colorMap[color] ?? colorMap.eucalyptus}`}>
      <div className="mb-1 flex items-center gap-2 text-xs font-medium opacity-70">
        {icon}
        {title}
      </div>
      <div className="text-lg font-bold">{value}</div>
      <p className="mt-0.5 text-xs opacity-60">{detail}</p>
    </div>
  );
}
