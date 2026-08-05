"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronUp, ExternalLink, TrendingUp, Building2, GraduationCap, Heart, DollarSign, Percent, PiggyBank, Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { HOME_FAQS, RATE_CUT_MAX_SAVING } from "@/modules/home/home-faqs";
import {
  calculatePayBreakdown,
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareSurcharge,
  calculateSuper,
  formatAUD,
  formatPercent,
  TAX_BRACKETS,
  TAX_BRACKETS_2025_26,
  SUPER_GUARANTEE,
  LITO,
  HECS_HELP,
  MEDICARE_LEVY,
  EMPLOYMENT,
  SOURCES,
  SITE_CONFIG,
  STATE_PAYROLL_TAX,
} from "@/lib/constants";

type PayBasis = "annual" | "hourly" | "daily" | "weekly" | "fortnightly" | "monthly";
type PayFrequency = "annual" | "monthly" | "fortnightly" | "weekly" | "hourly";

const FY = SITE_CONFIG.financialYear;

// ─── Engine-derived reference figures (computed once at module scope; this is
// a static export, so these can never stale-drift the way hardcoded dollar
// figures did) ───
const BD80 = calculatePayBreakdown({ grossSalary: 80_000 });
const BD90 = calculatePayBreakdown({ grossSalary: 90_000 });
const BD90_HECS = calculatePayBreakdown({ grossSalary: 90_000, includeHECS: true });
const BD100 = calculatePayBreakdown({ grossSalary: 100_000 });
const BD100_PKG = calculatePayBreakdown({ grossSalary: 100_000, superIncluded: true });
const LADDER = [40_000, 50_000, 60_000, 70_000, 80_000, 90_000, 100_000, 120_000, 150_000, 200_000].map(
  (gross) => ({ gross, bd: calculatePayBreakdown({ grossSalary: gross }) })
);
/** Tax on the full second bracket at the FY2026-27 rate ($4,020). */
const BRACKET2_TAX = Math.round((TAX_BRACKETS[1].max - TAX_BRACKETS[0].max) * TAX_BRACKETS[1].rate);
/** Tax on the $45,001–$80,000 slice at 30% ($10,500). */
const BRACKET3_TAX_80K = Math.round((80_000 - TAX_BRACKETS[1].max) * TAX_BRACKETS[2].rate);
const LITO_30K_TAX = Math.round(calculateIncomeTax(30_000));
const LITO_30K_NET = Math.round(calculateIncomeTax(30_000) - calculateLITO(30_000));
const MLS_120K = calculateMedicareSurcharge(120_000, false);
const CASUAL_MIN_WAGE = EMPLOYMENT.minimumWageHourly * (1 + EMPLOYMENT.casualLoading);

const pctX = (v: number) => `${Math.round(v * 100)}%`;

/** Approximate ABS-based average full-time salaries; presentational only —
 * payroll tax rates/thresholds come from STATE_PAYROLL_TAX. */
const STATE_AVG_SALARY: Record<string, string> = {
  NSW: "$102,000",
  VIC: "$97,000",
  QLD: "$95,000",
  WA: "$105,000",
  SA: "$89,000",
  TAS: "$84,000",
  ACT: "$103,000",
  NT: "$91,000",
};

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Super guarantee rate", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-contributions/how-much-super-to-pay", publisher: SOURCES.ato.name },
  { title: "HECS-HELP repayment thresholds", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: SOURCES.ato.name },
  { title: "National minimum wage", url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages", publisher: SOURCES.fwo.name },
];

const OVERTIME_RATES = [
  { value: 1.5, label: "Time & Half (1.5x)" },
  { value: 2.0, label: "Double Time (2x)" },
  { value: 2.5, label: "Public Holiday (2.5x)" },
];

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
function AnimatedNumber({ value, decimals = 0, prefix = "$", className = "" }: { value: number; decimals?: number; prefix?: string; className?: string }) {
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, { stiffness: 100, damping: 20, mass: 0.5 });
  const display = useTransform(spring, (v) => {
    const formatted = Math.abs(v).toLocaleString("en-AU", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${prefix}${formatted}`;
  });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return <motion.span className={className}>{display}</motion.span>;
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
          <motion.circle
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
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${dashLength} ${circumference - dashLength}` }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
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

// ─── Inline Source Badge ───
function SourceBadge({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="source-badge"
      title={`Source: ${label}`}
    >
      {label}
      <ExternalLink className="h-2.5 w-2.5" />
    </a>
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
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.008, duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`aspect-square rounded-[3px] ${cell.color}`}
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


export default function HomePageTemplate() {
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

  const frequencyLabel: Record<PayFrequency, string> = {
    annual: "per year",
    monthly: "per month",
    fortnightly: "per fortnight",
    weekly: "per week",
    hourly: "per hour",
  };

  // Donut chart segments
  const donutSegments = useMemo(() => [
    { label: "Take-Home Pay", value: result.takeHomePay, color: "#2d9e7c" },
    { label: "Income Tax", value: result.netIncomeTax, color: "#d4891c" },
    { label: "Medicare", value: result.medicareLevy + result.medicareSurcharge, color: "#f43f5e" },
    ...(result.hecsRepayment > 0 ? [{ label: "HECS", value: result.hecsRepayment, color: "#8b5cf6" }] : []),
  ], [result]);

  const extraWeeklyFromRise = payRiseResult.weekly - result.weekly;
  const basisMeta = BASIS_META[payBasis];

  return (
    <div className="flex-grow">
      {/* ===== HERO + CALCULATOR ===== */}
      <section className="grain-overlay relative overflow-hidden bg-navy pb-20 pt-24 lg:pt-28">
        {/* Background effects */}
        <div className="hero-pattern absolute inset-0" />
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-eucalyptus/8 blur-[100px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-ochre/6 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero Copy — centered above calculator on all screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 text-center"
          >
            <h1
              className="mb-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Australian Pay Calculator {FY} — Salary, Wage &amp; Take-Home Pay
            </h1>
            <p className="mx-auto mb-5 max-w-2xl text-lg text-sandstone-dark/60">
              Australia&apos;s free pay calculator and salary calculator for FY{FY}. Enter an annual salary or an hourly, daily, weekly, fortnightly or monthly wage — with casual loading if it applies — and see your exact take-home pay after ATO income tax, the Medicare levy, HECS-HELP repayments and {formatPercent(SUPER_GUARANTEE.rate, 0)} superannuation. Every figure uses the current FY{FY} rates, so the number you see is the number that lands in your bank account.
            </p>
            <TrustBar className="mx-auto" variant="dark" />
          </motion.div>

          {/* Calculator — centered, elevated */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl"
          >
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
                          aria-hidden="true"
                        />
                        <div className="mt-0.5 flex justify-between text-[9px] text-warmgray-light/60">
                          {[0, 50000, 100000, 150000, 200000, 250000, 300000].map((tick) => (
                            <span key={tick} className={tick <= amount ? "text-eucalyptus-dark/50 font-medium" : ""}>
                              {tick === 0 ? "$0" : `$${tick / 1000}K`}
                            </span>
                          ))}
                        </div>
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
                      <AnimatePresence>
                        {proRataEnabled && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
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
                          </motion.div>
                        )}
                      </AnimatePresence>
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
                    <AnimatePresence>
                      {showAdvanced && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
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
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </form>

                {/* ═══ LIVE RESULTS ═══ */}
                <motion.div
                  layout
                  className="mt-6 space-y-5"
                  role="region"
                  aria-live="polite"
                  aria-label="Pay breakdown results"
                >
                  {/* Big take-home number */}
                  <div className="rounded-2xl bg-gradient-to-br from-navy via-navy-light to-navy p-6 text-center">
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
                      {result.novatedLease > 0 && <ResultRow label="Novated Lease" value={`-${formatAUD(result.novatedLease)}`} />}
                      <ResultRow label="Taxable Income" value={formatAUD(result.taxableIncome)} bold />
                      <div className="border-t border-sandstone-dark/20" />
                      <ResultRow label="Income Tax" value={`-${formatAUD(result.netIncomeTax)}`} color="text-ochre" icon={<Receipt className="h-3.5 w-3.5" />} />
                      {result.litoOffset > 0 && <ResultRow label="LITO Offset" value={`+${formatAUD(result.litoOffset)}`} sub />}
                      <ResultRow label="Medicare Levy" value={`-${formatAUD(result.medicareLevy)}`} color="text-rose-500" icon={<Heart className="h-3.5 w-3.5" />} />
                      {result.medicareSurcharge > 0 && <ResultRow label="Medicare Surcharge" value={`-${formatAUD(result.medicareSurcharge)}`} color="text-rose-500" />}
                      {includeHECS && <ResultRow label="HECS Repayment" value={`-${formatAUD(result.hecsRepayment)}`} color="text-violet-500" icon={<GraduationCap className="h-3.5 w-3.5" />} />}
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
                </motion.div>
              </CardContent>
            </Card>

            {/* Quick CTA links below calculator */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/income-tax-calculator/"
                className="inline-flex items-center gap-2 rounded-lg bg-white/8 px-4 py-2.5 text-sm font-medium text-sandstone-dark/60 backdrop-blur-sm transition-all hover:bg-white/15 hover:text-white"
              >
                Income Tax Calculator <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/tax-brackets/"
                className="inline-flex items-center gap-2 rounded-lg bg-white/8 px-4 py-2.5 text-sm font-medium text-sandstone-dark/60 backdrop-blur-sm transition-all hover:bg-white/15 hover:text-white"
              >
                Tax Brackets {FY} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/superannuation-calculator/"
                className="inline-flex items-center gap-2 rounded-lg bg-white/8 px-4 py-2.5 text-sm font-medium text-sandstone-dark/60 backdrop-blur-sm transition-all hover:bg-white/15 hover:text-white"
              >
                Super Calculator <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CONTENT SECTIONS ═══ */}
      <div className="mx-auto max-w-4xl space-y-20 px-4 py-20 sm:px-6 lg:px-8">
        {/* ===== 1. WHAT CHANGED ON 1 JULY 2026 ===== */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            What Changed in Your Pay on 1 July 2026?
          </h2>
          <p className="mb-5 text-warmgray">
            Four changes hit Australian pay packets at the start of FY{FY}. This pay calculator already applies all of them.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-eucalyptus/20 bg-eucalyptus-light/20 p-4">
              <p className="mb-1 font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Income tax cut: {formatPercent(TAX_BRACKETS_2025_26[1].rate, 0)} &rarr; {formatPercent(TAX_BRACKETS[1].rate, 0)}</p>
              <p className="text-sm text-warmgray">
                The rate on income between {formatAUD(TAX_BRACKETS[0].max)} and {formatAUD(TAX_BRACKETS[1].max)} dropped one point — worth up to <strong>{formatAUD(RATE_CUT_MAX_SAVING)} a year</strong>, received in full once you earn {formatAUD(TAX_BRACKETS[1].max)} or more.
              </p>
            </div>
            <div className="rounded-xl border border-sky-200/60 bg-sky-50/60 p-4">
              <p className="mb-1 font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Super stays {formatPercent(SUPER_GUARANTEE.rate, 0)} — now paid every payday</p>
              <p className="text-sm text-warmgray">
                The SG rate is unchanged at its legislated ceiling, but Payday Super started on {SUPER_GUARANTEE.paydaySuperStart}: contributions must now reach your fund within 7 business days of each payday instead of quarterly.
              </p>
            </div>
            <div className="rounded-xl border border-violet-200/60 bg-violet-50/60 p-4">
              <p className="mb-1 font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>HECS-HELP threshold: {formatAUD(HECS_HELP.minimumThreshold)}</p>
              <p className="text-sm text-warmgray">
                Repayments are marginal — {formatPercent(HECS_HELP.bands[1].marginalRate, 0)} of income <em>above</em> {formatAUD(HECS_HELP.minimumThreshold)}, not a percentage of your whole salary. Below the threshold you repay nothing.
              </p>
            </div>
            <div className="rounded-xl border border-amber-200/60 bg-amber-50/60 p-4">
              <p className="mb-1 font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Super caps lifted</p>
              <p className="text-sm text-warmgray">
                The concessional contributions cap rose from {formatAUD(SUPER_GUARANTEE.concessionalCapPrevious)} to <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong>, and the non-concessional cap to {formatAUD(SUPER_GUARANTEE.nonConcessionalCap)}.
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-warmgray-light">
            Full details: <Link href="/tax-changes-2026-27/" className="font-medium text-eucalyptus-dark hover:underline">tax changes for {FY}</Link> and <Link href="/news/july-1-2026-money-changes/" className="font-medium text-eucalyptus-dark hover:underline">everything that changed on 1 July 2026</Link>.
          </p>
        </motion.section>

        {/* ===== 2. HOW IS TAKE-HOME PAY CALCULATED? ===== */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            How Is Take-Home Pay Calculated?
          </h2>
          <p className="mb-3 leading-relaxed text-warmgray">
            Take-home pay is your gross salary minus income tax, minus the {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy, minus any HECS-HELP repayment. Income tax is applied in stages — each marginal rate only taxes the slice of income inside its bracket, never your whole salary. Here is the full working for an <strong>$80,000</strong> salary in FY{FY}:
          </p>
          <ol className="mb-3 list-decimal space-y-1 pl-6 text-warmgray">
            <li>First {formatAUD(TAX_BRACKETS[0].max)} — tax-free = <strong>$0</strong></li>
            <li>{formatAUD(TAX_BRACKETS[1].min)} – {formatAUD(TAX_BRACKETS[1].max)} at {formatPercent(TAX_BRACKETS[1].rate, 0)} = <strong>{formatAUD(BRACKET2_TAX)}</strong></li>
            <li>{formatAUD(TAX_BRACKETS[2].min)} – $80,000 at {formatPercent(TAX_BRACKETS[2].rate, 0)} = <strong>{formatAUD(BRACKET3_TAX_80K)}</strong> — income tax totals <strong>{formatAUD(BD80.netIncomeTax)}</strong></li>
            <li>Medicare levy at {formatPercent(MEDICARE_LEVY.rate, 0)} = <strong>{formatAUD(BD80.medicareLevy)}</strong> (LITO is $0 above {formatAUD(LITO.nilOffsetIncome)})</li>
          </ol>
          <p className="mb-3 leading-relaxed text-warmgray">
            Total deductions come to {formatAUD(BD80.totalDeductions)}, leaving take-home pay of <strong>{formatAUD(BD80.takeHomePay)}</strong> a year — {formatAUD(BD80.weekly, 2)} a week or {formatAUD(BD80.monthly, 2)} a month. The effective rate on the whole salary is <strong>{formatPercent(BD80.effectiveTaxRate)}</strong>, far below the {formatPercent(BD80.marginalTaxRate)} marginal rate (including Medicare) on the next dollar earned. See the full working for <Link href="/tax-on/80000/" className="font-medium text-eucalyptus-dark hover:underline">tax on $80,000</Link> or <Link href="/tax-on/100000/" className="font-medium text-eucalyptus-dark hover:underline">tax on $100,000</Link>.
          </p>
          <p className="leading-relaxed text-warmgray">
            For a bracket-by-bracket breakdown of the tax side, use the <Link href="/income-tax-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Income Tax Calculator</Link>; to compare net pay across salaries, use the <Link href="/take-home-pay-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link>; and to decode each line of your payslip, read <Link href="/understanding-your-payslip/" className="font-medium text-eucalyptus-dark hover:underline">Understanding Your Payslip</Link>.
          </p>

          <MethodologyDisclosure className="mt-4">
            <ol className="list-decimal space-y-1 pl-4">
              <li>Calculate income tax using ATO resident tax brackets (progressive marginal rates). <SourceBadge label="ATO" href="https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents" /></li>
              <li>Apply the Low Income Tax Offset (up to {formatAUD(LITO.maxOffset)}) for qualifying incomes below {formatAUD(LITO.nilOffsetIncome)}.</li>
              <li>Add the {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy on taxable income. Apply the &quot;Medicare Levy Surcharge&quot; (1%–1.5%) for high earners without private health insurance.</li>
              <li>Calculate HECS-HELP repayment using the marginal system (threshold: {formatAUD(HECS_HELP.minimumThreshold)}). <SourceBadge label="ATO" href="https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds" /></li>
              <li>Calculate employer superannuation at {formatPercent(SUPER_GUARANTEE.rate, 0)} (paid on top, not deducted from salary).</li>
              <li>Take-home pay = Gross salary &minus; income tax &minus; Medicare levy &minus; HECS repayment.</li>
            </ol>
          </MethodologyDisclosure>
        </motion.section>

        {/* ===== 3. HOURLY, CASUAL & SHIFT PAY ===== */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Hourly, Casual &amp; Shift Pay
          </h2>
          <p className="mb-3 leading-relaxed text-warmgray">
            This wage calculator converts an hourly rate to an annual salary the same way every major Australian pay tool does: rate &times; weekly hours &times; {EMPLOYMENT.weeksPerYear} weeks. A standard {EMPLOYMENT.standardWeeklyHours}-hour week is <strong>{EMPLOYMENT.hoursPerYear.toLocaleString("en-AU")} hours a year</strong>, so {formatAUD(80_000 / EMPLOYMENT.hoursPerYear, 2)} an hour is roughly an $80,000 salary. Use the <strong>Hourly</strong> tab in the calculator above, or the dedicated <Link href="/hourly-to-annual-salary-calculator/" className="font-medium text-eucalyptus-dark hover:underline">hourly to annual salary calculator</Link> and <Link href="/salary-vs-hourly/" className="font-medium text-eucalyptus-dark hover:underline">salary vs hourly guide</Link>.
          </p>
          <p className="mb-3 leading-relaxed text-warmgray">
            <strong>Casual workers</strong> receive casual loading — an extra {pctX(EMPLOYMENT.casualLoading)} on the base hourly rate in place of paid leave and notice entitlements. On the {formatAUD(EMPLOYMENT.minimumWageHourly, 2)} national minimum wage, the casual rate is <strong>{formatAUD(CASUAL_MIN_WAGE, 2)} an hour</strong>. The loading is taxed as ordinary income, so tick the casual toggle above to see the after-tax difference. How casual work compares with permanent: <Link href="/full-time-vs-part-time-vs-casual/" className="font-medium text-eucalyptus-dark hover:underline">full-time vs part-time vs casual</Link>.
          </p>
          <p className="mb-3 leading-relaxed text-warmgray">
            <strong>Penalty rates</strong> are award-specific loadings for weekends, public holidays and late nights — commonly {pctX(EMPLOYMENT.penaltyRates.saturdayMin)}–{pctX(EMPLOYMENT.penaltyRates.saturdayMax)} on Saturdays, {pctX(EMPLOYMENT.penaltyRates.sundayMin)}–{pctX(EMPLOYMENT.penaltyRates.sundayMax)} on Sundays and {pctX(EMPLOYMENT.penaltyRates.publicHolidayMin)}–{pctX(EMPLOYMENT.penaltyRates.publicHolidayMax)} on public holidays, though every award sets its own percentages. This calculator deliberately doesn&apos;t guess them: check the <Link href="/overtime-penalty-rates-guide/" className="font-medium text-eucalyptus-dark hover:underline">penalty rates guide</Link> or your award — <Link href="/hospitality-award-rates/" className="font-medium text-eucalyptus-dark hover:underline">hospitality</Link>, <Link href="/retail-award-rates/" className="font-medium text-eucalyptus-dark hover:underline">retail</Link> or <Link href="/schads-award-pay-rates/" className="font-medium text-eucalyptus-dark hover:underline">SCHADS</Link> — for exact rates.
          </p>
          <p className="leading-relaxed text-warmgray">
            Workers under 21 may be on age-based percentages of the adult rate — see <Link href="/junior-pay-rates/" className="font-medium text-eucalyptus-dark hover:underline">junior pay rates</Link>. For overtime at time-and-a-half or double time, use the <Link href="/overtime-pay-calculator/" className="font-medium text-eucalyptus-dark hover:underline">overtime pay calculator</Link>, and for a week-by-week view of a casual income, the <Link href="/weekly-pay-calculator/" className="font-medium text-eucalyptus-dark hover:underline">weekly pay calculator</Link>.
          </p>
        </motion.section>

        {/* ===== 4. TAKE-HOME PAY ON COMMON SALARIES ===== */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Take-Home Pay on Common Salaries in FY{FY}
          </h2>
          <p className="mb-4 text-warmgray">
            The table below is computed live from the FY{FY} rates — income tax (after LITO), Medicare levy, take-home pay and employer super for 10 common Australian salary levels.
          </p>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold text-navy">Gross Salary</th>
                  <th className="px-3 py-3 text-right font-semibold text-navy">Income Tax</th>
                  <th className="px-3 py-3 text-right font-semibold text-navy">Medicare Levy</th>
                  <th className="px-3 py-3 text-right font-semibold text-navy">Take-Home Pay</th>
                  <th className="px-3 py-3 text-right font-semibold text-navy">Effective Rate</th>
                  <th className="px-3 py-3 text-right font-semibold text-navy">Super ({formatPercent(SUPER_GUARANTEE.rate, 0)})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {LADDER.map(({ gross, bd }) => (
                  <tr key={gross} className="transition-colors hover:bg-sandstone/50">
                    <td className="px-3 py-2.5 font-medium text-navy">
                      <Link href={`/tax-on/${gross}/`} className="hover:text-eucalyptus-dark hover:underline">{formatAUD(gross)}</Link>
                    </td>
                    <td className="px-3 py-2.5 text-right text-warmgray">{formatAUD(bd.netIncomeTax)}</td>
                    <td className="px-3 py-2.5 text-right text-warmgray">{formatAUD(bd.medicareLevy)}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-eucalyptus-dark">{formatAUD(bd.takeHomePay)}</td>
                    <td className="px-3 py-2.5 text-right text-warmgray">{formatPercent(bd.effectiveTaxRate)}</td>
                    <td className="px-3 py-2.5 text-right text-warmgray">{formatAUD(bd.superContribution)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-warmgray-light">
            Figures assume Australian resident, no HECS-HELP debt, private health insurance held, and LITO applied where eligible. Effective rate includes the Medicare levy. Use the pay calculator above for your exact salary, or jump to <Link href="/take-home-pay-on/60000/" className="font-medium text-eucalyptus-dark hover:underline">take-home pay on $60K</Link>, <Link href="/take-home-pay-on/90000/" className="font-medium text-eucalyptus-dark hover:underline">$90K</Link>, or <Link href="/take-home-pay-on/120000/" className="font-medium text-eucalyptus-dark hover:underline">$120K</Link>.
          </p>
        </motion.section>

        {/* ===== 5. WHAT COMES OUT OF YOUR PAY? ===== */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            What Comes Out of Your Pay?
          </h2>
          <p className="mb-5 text-warmgray">
            Four components decide what lands in your bank account. Three are deducted from your salary; superannuation is paid on top of it. Each card links to its dedicated calculator or guide.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/income-tax-calculator/" className="group rounded-xl border border-sandstone-dark/20 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-eucalyptus/30 hover:shadow-md">
              <div className="mb-2 flex items-center gap-2">
                <Receipt className="h-4 w-4 text-ochre" />
                <span className="font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>1. Income tax</span>
              </div>
              <p className="text-xs text-warmgray">Bracket-based progressive rates from 0% to 45%, applied to your taxable income.</p>
              <span className="mt-2 inline-block text-xs font-medium text-eucalyptus-dark group-hover:underline">Income Tax Calculator &rarr;</span>
            </Link>
            <Link href="/medicare-levy/" className="group rounded-xl border border-sandstone-dark/20 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-eucalyptus/30 hover:shadow-md">
              <div className="mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-400" />
                <span className="font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>2. Medicare levy</span>
              </div>
              <p className="text-xs text-warmgray">A {formatPercent(MEDICARE_LEVY.rate, 0)} levy on your taxable income that funds Australia&apos;s public healthcare system.</p>
              <span className="mt-2 inline-block text-xs font-medium text-eucalyptus-dark group-hover:underline">Medicare Levy Guide &rarr;</span>
            </Link>
            <Link href="/hecs-help-calculator/" className="group rounded-xl border border-sandstone-dark/20 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-eucalyptus/30 hover:shadow-md">
              <div className="mb-2 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-violet-500" />
                <span className="font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>3. HECS/HELP</span>
              </div>
              <p className="text-xs text-warmgray">Income-contingent student loan repayments under the marginal system — {formatPercent(HECS_HELP.bands[1].marginalRate, 0)} above {formatAUD(HECS_HELP.minimumThreshold)}.</p>
              <span className="mt-2 inline-block text-xs font-medium text-eucalyptus-dark group-hover:underline">HECS-HELP Calculator &rarr;</span>
            </Link>
            <Link href="/superannuation-calculator/" className="group rounded-xl border border-sandstone-dark/20 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-eucalyptus/30 hover:shadow-md">
              <div className="mb-2 flex items-center gap-2">
                <PiggyBank className="h-4 w-4 text-sky-500" />
                <span className="font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>4. Super ({formatPercent(SUPER_GUARANTEE.rate, 0)} SG)</span>
              </div>
              <p className="text-xs text-warmgray">Employer Superannuation Guarantee of {formatPercent(SUPER_GUARANTEE.rate, 0)} — paid on top of your salary, not deducted.</p>
              <span className="mt-2 inline-block text-xs font-medium text-eucalyptus-dark group-hover:underline">Superannuation Calculator &rarr;</span>
            </Link>
          </div>

          {/* H3: How Does the Low Income Tax Offset (LITO) Work? */}
          <h3
            className="mb-3 mt-8 text-xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            How Does the Low Income Tax Offset (LITO) Work?
          </h3>
          <p className="mb-3 leading-relaxed text-warmgray">
            The &quot;Low Income Tax Offset&quot; is a non-refundable tax offset of up to <strong>{formatAUD(LITO.maxOffset)}</strong> per year. Earners below {formatAUD(LITO.fullOffsetCeiling)} receive the full {formatAUD(LITO.maxOffset)} offset. The offset phases out in 2 stages: a 5-cent reduction for every dollar earned between {formatAUD(LITO.fullOffsetCeiling)} and {formatAUD(LITO.phaseOut1.end)}, followed by a 1.5-cent reduction for every dollar earned between {formatAUD(LITO.phaseOut1.end)} and {formatAUD(LITO.nilOffsetIncome)}. Earners above {formatAUD(LITO.nilOffsetIncome)} receive <strong>no LITO benefit</strong>.
          </p>
          <p className="leading-relaxed text-warmgray">
            LITO raises the effective tax-free threshold from {formatAUD(TAX_BRACKETS[0].max)} to <strong>{formatAUD(LITO.effectiveTaxFreeThreshold)}</strong>. For example, a worker earning $30,000 receives the full {formatAUD(LITO.maxOffset)} offset, reducing their tax bill from {formatAUD(LITO_30K_TAX)} to <strong>{formatAUD(LITO_30K_NET)}</strong>. Read our <Link href="/low-income-tax-offset/" className="font-medium text-eucalyptus-dark hover:underline">Low Income Tax Offset guide</Link> for full phase-out tables.
          </p>

          {/* H3: What Is the Medicare Levy Surcharge? */}
          <h3
            className="mb-3 mt-8 text-xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            What Is the Medicare Levy Surcharge?
          </h3>
          <p className="mb-3 leading-relaxed text-warmgray">
            The &quot;Medicare Levy Surcharge&quot; (MLS) is an additional levy of <strong>1% to 1.5%</strong> charged to high-income earners who do not hold private hospital cover. For FY{FY} it applies to singles earning above <strong>{formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)}</strong> and families above {formatAUD(MEDICARE_LEVY.surcharge.familyTier1.min - 1)}. Three tiers apply:
          </p>
          <ul className="mb-3 list-disc space-y-1 pl-6 text-warmgray">
            <li>{formatAUD(MEDICARE_LEVY.surcharge.tier1.min)} – {formatAUD(MEDICARE_LEVY.surcharge.tier1.max)}: surcharge of <strong>{formatPercent(MEDICARE_LEVY.surcharge.tier1.rate, 2)}</strong></li>
            <li>{formatAUD(MEDICARE_LEVY.surcharge.tier2.min)} – {formatAUD(MEDICARE_LEVY.surcharge.tier2.max)}: surcharge of <strong>{formatPercent(MEDICARE_LEVY.surcharge.tier2.rate, 2)}</strong></li>
            <li>{formatAUD(MEDICARE_LEVY.surcharge.tier3.min)} and above: surcharge of <strong>{formatPercent(MEDICARE_LEVY.surcharge.tier3.rate, 2)}</strong></li>
          </ul>
          <p className="leading-relaxed text-warmgray">
            A worker earning $120,000 without private hospital cover pays an MLS of <strong>{formatAUD(MLS_120K)}</strong> per year — on top of the standard {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy, taking the total health-related levy to {formatAUD(MLS_120K + Math.round(120_000 * MEDICARE_LEVY.rate))} instead of {formatAUD(Math.round(120_000 * MEDICARE_LEVY.rate))}. Holding any eligible private hospital cover eliminates the surcharge entirely. See our <Link href="/medicare-levy/" className="font-medium text-eucalyptus-dark hover:underline">Medicare Levy Guide</Link> for the full threshold tables.
          </p>
        </motion.section>

        {/* ===== 6. HOW IS SUPERANNUATION CALCULATED? ===== */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            How Is Superannuation Calculated?
          </h2>
          <p className="mb-3 leading-relaxed text-warmgray">
            Your employer pays a &quot;Superannuation Guarantee&quot; (SG) of <strong>{formatPercent(SUPER_GUARANTEE.rate, 0)}</strong> of your ordinary earnings into your nominated super fund. On a salary of $80,000 that is <strong>{formatAUD(BD80.superContribution)} per year</strong>; on $100,000 it is {formatAUD(BD100.superContribution)}; on $60,000, {formatAUD(calculateSuper(60_000))}. These amounts are paid on top of your gross salary and do not reduce your take-home pay. See the <Link href="/super-guarantee-rate-history/" className="font-medium text-eucalyptus-dark hover:underline">SG rate history</Link> for how the rate climbed to its {formatPercent(SUPER_GUARANTEE.rate, 0)} ceiling.
          </p>
          <p className="mb-3 leading-relaxed text-warmgray">
            Since {SUPER_GUARANTEE.paydaySuperStart}, Payday Super requires employers to pay super <strong>on every payday</strong> rather than quarterly, calculated on qualifying earnings. Late payments trigger the Superannuation Guarantee Charge, which adds daily-compounding interest and an administrative uplift. The &quot;Maximum Super Contribution Base&quot; for FY{FY} is <strong>{formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}</strong> per year — employers are not required to pay SG on earnings above this cap.
          </p>
          <p className="leading-relaxed text-warmgray">
            The concessional contributions cap (employer SG plus salary sacrifice and personal deductible contributions) is <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong> for FY{FY}. Use the <Link href="/superannuation-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> for your exact employer contributions, the <Link href="/salary-sacrifice-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> to model pre-tax contributions, or the <Link href="/superannuation-guide/" className="font-medium text-eucalyptus-dark hover:underline">Superannuation Guide</Link> for caps, options and withdrawal rules.
          </p>
        </motion.section>

        {/* ===== 7. HOW DO HECS-HELP REPAYMENTS AFFECT TAKE-HOME PAY? ===== */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            How Do HECS-HELP Repayments Affect Take-Home Pay?
          </h2>
          <p className="mb-3 leading-relaxed text-warmgray">
            HECS-HELP repayments are calculated under a marginal system for FY{FY}: repayments start when repayment income exceeds <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong>, and you only pay on the amount <em>above</em> the threshold — not on your total income.
          </p>
          <div className="mb-4 overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Repayment Income</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Marginal Rate</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Calculation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {HECS_HELP.bands.map((band) => (
                  <tr key={band.label} className="hover:bg-sandstone/50">
                    <td className="px-4 py-2.5 text-warmgray">
                      {band.min === 0 ? `Below ${formatAUD(band.max)}` : band.max === Infinity ? `${formatAUD(band.min)}+` : `${formatAUD(band.min)} – ${formatAUD(band.max)}`}
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-navy">{formatPercent(band.marginalRate, 0)}</td>
                    <td className="px-4 py-2.5 text-warmgray-light">{band.min === 0 ? "No repayment required" : band.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mb-3 leading-relaxed text-warmgray">
            <strong>At $65,000:</strong> Your income is below the {formatAUD(HECS_HELP.minimumThreshold)} threshold, so your HECS repayment is <strong>$0</strong>. Your take-home pay is unaffected by your student debt.
          </p>
          <p className="mb-3 leading-relaxed text-warmgray">
            <strong>At $90,000:</strong> You pay {formatPercent(HECS_HELP.bands[1].marginalRate, 0)} on the {formatAUD(90_000 - HECS_HELP.minimumThreshold)} above {formatAUD(HECS_HELP.minimumThreshold)}, a repayment of <strong>{formatAUD(BD90_HECS.hecsRepayment)}</strong> per year ({formatAUD(BD90_HECS.hecsRepayment / 26, 2)} per fortnight). Your annual take-home pay drops from {formatAUD(BD90.takeHomePay)} to <strong>{formatAUD(BD90_HECS.takeHomePay)}</strong>.
          </p>
          <p className="leading-relaxed text-warmgray">
            The marginal system eliminates the cliff effect of the old model, where crossing a threshold by a single dollar triggered repayments on your entire income. Use our <Link href="/hecs-help-calculator/" className="font-medium text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> for your exact repayment, check the <Link href="/hecs-repayment-threshold/" className="font-medium text-eucalyptus-dark hover:underline">current repayment thresholds</Link>, or read the <Link href="/hecs-help-guide/" className="font-medium text-eucalyptus-dark hover:underline">HECS-HELP Guide</Link>.
          </p>
        </motion.section>

        {/* ===== 8. WHICH PAY CALCULATOR SHOULD YOU USE? ===== */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Which Pay Calculator Should You Use?
          </h2>
          <p className="mb-4 text-warmgray">
            The calculator above handles the most common scenario — converting a salary or wage to take-home pay. For specialised situations, use one of the dedicated calculators below. Working holiday makers and non-residents are taxed differently: see the <Link href="/working-holiday-tax/" className="font-medium text-eucalyptus-dark hover:underline">working holiday tax guide</Link> and <Link href="/non-resident-tax/" className="font-medium text-eucalyptus-dark hover:underline">non-resident tax guide</Link>.
          </p>

          <h3
            className="mb-3 text-lg font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Calculators for Employees
          </h3>
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <CalcLink href="/income-tax-calculator/" title="Income Tax Calculator" desc="Bracket-by-bracket tax breakdown with LITO" />
            <CalcLink href="/take-home-pay-calculator/" title="Take-Home Pay Calculator" desc="Quick net pay from any gross salary" />
            <CalcLink href="/salary-sacrifice-calculator/" title="Salary Sacrifice Calculator" desc="Compare pay before and after sacrifice into super" />
            <CalcLink href="/pay-rise-calculator/" title="Pay Rise Calculator" desc="See how much extra take-home a raise gives you" />
            <CalcLink href="/hecs-help-calculator/" title="HECS-HELP Calculator" desc="Student loan repayments under the marginal system" />
            <CalcLink href="/hourly-to-annual-salary-calculator/" title="Hourly to Annual Converter" desc="Convert between any pay frequency" />
            <CalcLink href="/gross-pay-calculator/" title="Gross Pay Calculator" desc="Reverse calculate gross from net take-home pay" />
            <CalcLink href="/redundancy-pay-calculator/" title="Redundancy Pay Calculator" desc="NES entitlements and tax on redundancy" />
            <CalcLink href="/bonus-tax-calculator/" title="Bonus Tax Calculator" desc="The extra tax you'll owe on a bonus or commission" />
            <CalcLink href="/leave-calculator/" title="Leave Calculator" desc="Annual leave, leave loading, and long service leave" />
            <CalcLink href="/fortnightly-pay-calculator/" title="Fortnightly Pay Calculator" desc="Fortnightly take-home pay breakdown" />
            <CalcLink href="/weekly-pay-calculator/" title="Weekly Pay Calculator" desc="Weekly wage to take-home pay" />
            <CalcLink href="/monthly-pay-calculator/" title="Monthly Pay Calculator" desc="Monthly salary to take-home pay" />
            <CalcLink href="/second-job-tax-calculator/" title="Second Job Tax Calculator" desc="Withholding when you can't claim the tax-free threshold" />
          </div>

          <h3
            className="mb-3 text-lg font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Calculators for Employers and Contractors
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <CalcLink href="/employer-cost-calculator/" title="Employer Cost Calculator" desc="True cost of an employee beyond salary" />
            <CalcLink href="/contractor-pay-calculator/" title="Contractor Pay Calculator" desc="ABN workers, freelancers and gig economy rates" />
            <CalcLink href="/contractor-vs-employee-calculator/" title="Contractor vs Employee" desc="Side-by-side pay comparison for hiring decisions" />
            <CalcLink href="/superannuation-calculator/" title="Superannuation Calculator" desc={`Employer SG contributions at ${formatPercent(SUPER_GUARANTEE.rate, 0)}`} />
            <CalcLink href="/overtime-pay-calculator/" title="Overtime Pay Calculator" desc="Time-and-a-half, double time, and public holiday rates" />
            <CalcLink href="/tax-return-calculator/" title="Tax Return Calculator" desc="Estimate your annual tax refund or liability" />
            <CalcLink href="/annual-pay-calculator/" title="Annual Pay Calculator" desc="Full-year gross to net breakdown" />
            <CalcLink href="/employment-type-calculator/" title="Employment Type Calculator" desc="Compare full-time, part-time and casual pay" />
          </div>
        </motion.section>

        {/* ===== 9. PAY CALCULATOR BY STATE ===== */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Pay Calculator by State
          </h2>
          <p className="mb-4 text-warmgray">
            Income tax in Australia is <strong>federal</strong> — every state and territory uses the same tax brackets, so a pay calculator for NSW gives the same take-home pay as one for WA. State-level differences affect employers through payroll tax (a tax on total wages paid), which influences hiring costs but does not directly reduce employee take-home pay. Average salaries also vary by state due to industry composition, cost of living, and labour market conditions.
          </p>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { href: "/pay-calculator-nsw/", label: "NSW", sub: "New South Wales", color: "from-sky-50 to-sky-100/50" },
              { href: "/pay-calculator-qld/", label: "QLD", sub: "Queensland", color: "from-amber-50 to-amber-100/50" },
              { href: "/pay-calculator-vic/", label: "VIC", sub: "Victoria", color: "from-indigo-50 to-indigo-100/50" },
              { href: "/pay-calculator-wa/", label: "WA", sub: "Western Australia", color: "from-emerald-50 to-emerald-100/50" },
              { href: "/pay-calculator-sa/", label: "SA", sub: "South Australia", color: "from-rose-50 to-rose-100/50" },
              { href: "/pay-calculator-tas/", label: "TAS", sub: "Tasmania", color: "from-teal-50 to-teal-100/50" },
              { href: "/pay-calculator-act/", label: "ACT", sub: "Australian Capital Territory", color: "from-blue-50 to-blue-100/50" },
              { href: "/pay-calculator-nt/", label: "NT", sub: "Northern Territory", color: "from-orange-50 to-orange-100/50" },
            ].map((state) => (
              <Link
                key={state.href}
                href={state.href}
                className={`group flex flex-col items-center rounded-xl border border-sandstone-dark/20 bg-gradient-to-b ${state.color} p-5 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-1`}
              >
                <span className="text-xl font-bold text-navy group-hover:text-eucalyptus-dark" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{state.label}</span>
                <span className="text-xs text-warmgray-light">{state.sub}</span>
              </Link>
            ))}
          </div>

          {/* State comparison table */}
          <h3
            className="mb-3 text-lg font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            State Payroll Tax Comparison
          </h3>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-navy">State</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Payroll Tax Rate</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Tax-Free Threshold</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Avg. Full-Time Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {Object.entries(STATE_PAYROLL_TAX).map(([code, s]) => (
                  <tr key={code} className="hover:bg-sandstone/50">
                    <td className="px-4 py-2.5 font-medium text-navy">{code}</td>
                    <td className="px-4 py-2.5 text-right text-warmgray">{formatPercent(s.rate, 2)}{s.note ? "*" : ""}</td>
                    <td className="px-4 py-2.5 text-right text-warmgray">{formatAUD(s.threshold)}</td>
                    <td className="px-4 py-2.5 text-right text-warmgray">{STATE_AVG_SALARY[code]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-warmgray-light">
            *{" "}
            {Object.entries(STATE_PAYROLL_TAX)
              .filter(([, s]) => s.note)
              .map(([code, s]) => `${code}: ${s.note}`)
              .join(". ")}
            .
          </p>
          <p className="mt-3 text-xs text-warmgray-light">
            Payroll tax is paid by employers, not employees. Average salary figures are approximate and based on ABS data. Individual take-home pay uses the same federal income tax brackets in all states. Compare a state-specific pay calculator: <Link href="/pay-calculator-nsw/" className="font-medium text-eucalyptus-dark hover:underline">NSW</Link>, <Link href="/pay-calculator-vic/" className="font-medium text-eucalyptus-dark hover:underline">VIC</Link>, or <Link href="/pay-calculator-qld/" className="font-medium text-eucalyptus-dark hover:underline">QLD</Link>.
          </p>
        </motion.section>

        {/* ===== 10. WHAT ARE THE MOST COMMON PAY CALCULATION MISTAKES? ===== */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            What Are the Most Common Pay Calculation Mistakes?
          </h2>
          <p className="mb-4 text-warmgray">
            These 5 errors are the most frequent mistakes Australian workers make when estimating their take-home pay — each one leads to a materially wrong expectation of net income.
          </p>
          <ol className="list-decimal space-y-4 pl-6 text-warmgray">
            <li>
              <strong>Applying one flat tax rate to your entire salary.</strong> A worker earning $100,000 who assumes a {formatPercent(TAX_BRACKETS[2].rate, 0)} flat rate expects to pay <strong>{formatAUD(100_000 * TAX_BRACKETS[2].rate)}</strong> in tax. The actual income tax (using progressive marginal rates) is <strong>{formatAUD(BD100.netIncomeTax)}</strong> — an overestimate of {formatAUD(100_000 * TAX_BRACKETS[2].rate - BD100.netIncomeTax)}. Tax is calculated in brackets, not as a single percentage.
            </li>
            <li>
              <strong>Confusing gross salary with a package that includes super.</strong> A &quot;$100,000 package including super&quot; means a base salary of <strong>{formatAUD(BD100_PKG.grossSalary)}</strong> ($100,000 &divide; {(1 + SUPER_GUARANTEE.rate).toFixed(2)}). The take-home pay on that base is <strong>{formatAUD(BD100_PKG.takeHomePay)}</strong> — not the {formatAUD(BD100.takeHomePay)} you receive on a $100,000 base salary. The difference is <strong>{formatAUD(BD100.takeHomePay - BD100_PKG.takeHomePay)} per year</strong>.
            </li>
            <li>
              <strong>Forgetting the Medicare levy.</strong> The {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy adds <strong>{formatAUD(80_000 * MEDICARE_LEVY.rate)}</strong> in deductions on an $80,000 salary, <strong>{formatAUD(100_000 * MEDICARE_LEVY.rate)}</strong> on $100,000, and <strong>{formatAUD(150_000 * MEDICARE_LEVY.rate)}</strong> on $150,000. This is a separate charge from income tax and applies to most Australian residents above the low-income threshold.
            </li>
            <li>
              <strong>Not accounting for HECS-HELP repayments.</strong> An employee earning $90,000 with a HECS debt loses an additional <strong>{formatAUD(BD90_HECS.hecsRepayment)}</strong> per year in compulsory repayments. This is deducted from every pay cycle by your employer, reducing your fortnightly take-home by <strong>{formatAUD(BD90_HECS.hecsRepayment / 26, 2)}</strong>.
            </li>
            <li>
              <strong>Treating superannuation as a salary deduction.</strong> The {formatPercent(SUPER_GUARANTEE.rate, 0)} employer SG contribution is paid on top of your gross salary — it does not reduce your take-home pay. Workers who subtract super from their gross overstate their deductions by <strong>{formatAUD(calculateSuper(80_000))}</strong> at the $80,000 salary level.
            </li>
          </ol>
        </motion.section>

        {/* ===== 11. FREQUENTLY ASKED QUESTIONS ===== */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Frequently Asked Questions
          </h2>
          {/*
            The Radix accordion unmounts closed content, so answers never reach
            the rendered HTML. This mirror makes them crawlable and AI-Overview
            eligible. Same pattern as the award/guide pages (gap analysis §A4).
          */}
          <div className="sr-only">
            <h3>Australian pay calculator questions and answers</h3>
            {HOME_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
          </div>
          <Accordion type="multiple" className="space-y-3">
            {HOME_FAQS.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger className="text-left text-base font-medium text-navy">{f.q}</AccordionTrigger>
                <AccordionContent>
                  <p className="leading-relaxed text-warmgray">{f.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.section>

        {/* ===== 12. GUIDES AND RESOURCES ===== */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Guides and Resources
          </h2>
          <p className="mb-4 text-warmgray">
            These guides explain the rules behind the numbers. Each guide covers the legislation, worked examples, and edge cases for a specific area of Australian tax and payroll.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <CalcLink href="/tax-brackets/" title={`Tax Brackets ${FY}`} desc="Complete bracket table with worked examples at every income level" />
            <CalcLink href="/medicare-levy/" title="Medicare Levy Guide" desc="2% levy, low-income exemption, surcharge thresholds, and family rates" />
            <CalcLink href="/superannuation-guide/" title="Superannuation Guide" desc="SG rates, contribution caps, employer obligations, and withdrawal rules" />
            <CalcLink href="/salary-sacrifice-guide/" title="Salary Sacrifice Guide" desc="How pre-tax super contributions reduce your tax bill" />
            <CalcLink href="/hecs-help-guide/" title="HECS-HELP Guide" desc="Marginal repayment system, thresholds, and indexation rules" />
            <CalcLink href="/award-rates/" title="Award Rates Guide" desc="Minimum pay rates, penalty rates, and overtime rules by award" />
            <CalcLink href="/understanding-your-payslip/" title="Understanding Your Payslip" desc="Line-by-line explanation of every item on an Australian payslip" />
            <CalcLink href="/tax-calendar/" title="Tax Calendar" desc="Key dates for BAS, PAYG, super payments, and tax return lodgement" />
            <CalcLink href="/tax-refund-guide/" title="Tax Refund Guide" desc="How refunds are calculated, common deductions, and lodgement deadlines" />
            <CalcLink href="/novated-lease-guide/" title="Novated Lease Guide" desc="How novated leasing reduces taxable income through salary packaging" />
          </div>
        </motion.section>

        {/* ===== SOURCES ===== */}
        <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
      </div>
    </div>
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

function CalcLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="group flex items-start gap-3 rounded-xl border border-sandstone-dark/20 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-eucalyptus/30 hover:shadow-md">
      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-eucalyptus transition-transform group-hover:translate-x-1" />
      <div>
        <div className="font-medium text-navy">{title}</div>
        <div className="text-sm text-warmgray-light">{desc}</div>
      </div>
    </Link>
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
