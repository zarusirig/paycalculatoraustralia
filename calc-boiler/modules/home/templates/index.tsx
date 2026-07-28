"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronUp, ExternalLink, TrendingUp, Building2, GraduationCap, Heart, DollarSign, Percent, PiggyBank, Receipt, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
  TAX_BRACKETS,
  SUPER_GUARANTEE,
  LITO,
  HECS_HELP,
  MEDICARE_LEVY,
  EMPLOYMENT,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";

type PayFrequency = "annual" | "monthly" | "fortnightly" | "weekly" | "hourly";

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

const SALARY_TICKS = [30000, 50000, 60000, 75000, 90000, 100000, 120000, 150000, 200000, 250000, 300000];

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
  let accumulatedOffset = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {segments.map((segment, i) => {
          const percentage = segment.value / total;
          const dashLength = circumference * percentage;
          const dashOffset = circumference * accumulatedOffset;
          accumulatedOffset += percentage;

          return (
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
          );
        })}
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
function DollarGrid({ takeHome, tax, medicare, hecs, superAmount, total }: {
  takeHome: number; tax: number; medicare: number; hecs: number; superAmount: number; total: number;
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
  // Core inputs
  const [salary, setSalary] = useState(80_000);
  const [frequency, setFrequency] = useState<PayFrequency>("annual");
  const [includeHECS, setIncludeHECS] = useState(false);
  const [hasPrivateHealth, setHasPrivateHealth] = useState(true);

  // New toggles
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

  const result = useMemo(
    () =>
      calculatePayBreakdown({
        grossSalary: salary,
        includeHECS,
        hasPrivateHealth,
        superIncluded,
        proRataHours: proRataEnabled ? proRataHours : undefined,
        bonus,
        overtimeHours,
        overtimeRate,
        novatedLease,
        includeBonusInSG,
        includeOvertimeInSG,
      }),
    [salary, includeHECS, hasPrivateHealth, superIncluded, proRataEnabled, proRataHours, bonus, overtimeHours, overtimeRate, novatedLease, includeBonusInSG, includeOvertimeInSG]
  );

  // Pay rise result
  const payRiseResult = useMemo(
    () =>
      calculatePayBreakdown({
        grossSalary: salary + payRiseAmount,
        includeHECS,
        hasPrivateHealth,
        superIncluded,
        proRataHours: proRataEnabled ? proRataHours : undefined,
        bonus,
        overtimeHours,
        overtimeRate,
        novatedLease,
        includeBonusInSG,
        includeOvertimeInSG,
      }),
    [salary, payRiseAmount, includeHECS, hasPrivateHealth, superIncluded, proRataEnabled, proRataHours, bonus, overtimeHours, overtimeRate, novatedLease, includeBonusInSG, includeOvertimeInSG]
  );

  const displayTakeHome = useMemo(() => {
    switch (frequency) {
      case "weekly": return result.weekly;
      case "fortnightly": return result.fortnightly;
      case "monthly": return result.monthly;
      case "hourly": return Math.round((result.takeHomePay / 52 / (proRataEnabled ? proRataHours : EMPLOYMENT.standardWeeklyHours)) * 100) / 100;
      default: return result.takeHomePay;
    }
  }, [result, frequency, proRataEnabled, proRataHours]);

  const hourlyRate = useMemo(() => {
    const hours = proRataEnabled ? proRataHours : EMPLOYMENT.standardWeeklyHours;
    return result.grossSalary / 52 / hours;
  }, [result.grossSalary, proRataEnabled, proRataHours]);

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

  // Nearest salary tick for the slider
  const nearestTick = SALARY_TICKS.reduce((prev, curr) =>
    Math.abs(curr - salary) < Math.abs(prev - salary) ? curr : prev
  );

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
              Australian Pay Calculator 2025-26 — Take-Home Pay, Tax, Super &amp; HECS
            </h1>
            <p className="mx-auto mb-5 max-w-2xl text-lg text-sandstone-dark/60">
              Use Australia&apos;s most accurate free tax calculator australia to see exactly how much you take home from your salary. Our income tax calculator applies the current ATO brackets for FY{SITE_CONFIG.financialYear}, plus Medicare levy, superannuation, HECS/HELP repayments and LITO — giving you the real net pay number, not a rough estimate. Enter any annual, monthly, fortnightly, weekly or hourly figure in this pay calculator to get an instant take-home pay breakdown.
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
                  {/* Salary input */}
                  <div>
                    <label
                      htmlFor="salary"
                      className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-navy"
                      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                    >
                      {superIncluded ? "Total Package (inc. Super)" : "Your Annual Salary"}
                      <SourceBadge label="ATO" href="https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents" />
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-semibold text-warmgray-light">$</span>
                      <input
                        type="number"
                        id="salary"
                        name="salary"
                        min={0}
                        max={500000}
                        step={1000}
                        value={salary}
                        onChange={(e) => setSalary(clamp(Number(e.target.value || 0), 0, 500000))}
                        className="block w-full rounded-xl border-2 border-sandstone-dark/30 bg-sandstone/30 py-3.5 pl-9 pr-4 text-2xl font-bold text-navy shadow-sm transition-all focus:border-eucalyptus focus:bg-white focus:ring-2 focus:ring-eucalyptus/20"
                        aria-describedby="salary-hint"
                      />
                    </div>
                    {/* Slider with tick marks */}
                    <div className="relative mt-3">
                      <input
                        type="range"
                        id="salary-slider"
                        min={0}
                        max={300000}
                        step={1000}
                        value={clamp(salary, 0, 300000)}
                        onChange={(e) => setSalary(Number(e.target.value))}
                        className="mt-0 w-full accent-eucalyptus"
                        aria-hidden="true"
                      />
                      <div className="mt-0.5 flex justify-between text-[9px] text-warmgray-light/60">
                        {[0, 50000, 100000, 150000, 200000, 250000, 300000].map((tick) => (
                          <span key={tick} className={tick <= salary ? "text-eucalyptus-dark/50 font-medium" : ""}>
                            {tick === 0 ? "$0" : `$${tick / 1000}K`}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p id="salary-hint" className="mt-1 flex items-center gap-1.5 text-xs text-warmgray-light">
                      <span>Hourly rate: {formatAUD(hourlyRate, 2)}</span>
                      <span className="text-warmgray-light/30">|</span>
                      <span>Based on {proRataEnabled ? proRataHours : EMPLOYMENT.standardWeeklyHours}hr week</span>
                    </p>
                  </div>

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

                  {/* Pro-Rata / Part-Time */}
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
                    superAmount={result.superContribution}
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
                Tax Brackets 2025-26 <ArrowRight className="h-3.5 w-3.5" />
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
        {/* ===== 0a. HOW THE AUSTRALIAN TAX CALCULATOR WORKS ===== */}
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
            How the Australian Tax Calculator Works
          </h2>
          <p className="mb-5 text-warmgray">
            This Australian pay calculator and income tax calculator combines four FY{SITE_CONFIG.financialYear} components into a single instant take-home pay result. Each card links to its dedicated calculator and guide.
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
              <p className="text-xs text-warmgray">A 2% levy on your taxable income that funds Australia&apos;s public healthcare system.</p>
              <span className="mt-2 inline-block text-xs font-medium text-eucalyptus-dark group-hover:underline">Medicare Levy Guide &rarr;</span>
            </Link>
            <Link href="/superannuation-calculator/" className="group rounded-xl border border-sandstone-dark/20 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-eucalyptus/30 hover:shadow-md">
              <div className="mb-2 flex items-center gap-2">
                <PiggyBank className="h-4 w-4 text-sky-500" />
                <span className="font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>3. Super (12% SG)</span>
              </div>
              <p className="text-xs text-warmgray">Employer Superannuation Guarantee of 12% — paid on top of your salary, not deducted.</p>
              <span className="mt-2 inline-block text-xs font-medium text-eucalyptus-dark group-hover:underline">Superannuation Calculator &rarr;</span>
            </Link>
            <Link href="/hecs-help-calculator/" className="group rounded-xl border border-sandstone-dark/20 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-eucalyptus/30 hover:shadow-md">
              <div className="mb-2 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-violet-500" />
                <span className="font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>4. HECS/HELP</span>
              </div>
              <p className="text-xs text-warmgray">Income-contingent student loan repayments under the new marginal system.</p>
              <span className="mt-2 inline-block text-xs font-medium text-eucalyptus-dark group-hover:underline">HECS-HELP Calculator &rarr;</span>
            </Link>
          </div>
        </motion.section>

        {/* ===== 0b. CALCULATORS FOR EVERY AUSTRALIAN ===== */}
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
            Calculators for every Australian
          </h2>
          <p className="mb-5 text-warmgray">
            Beyond the headline pay calculator australia tool above, we maintain a dedicated calculator for every common Australian tax and payroll scenario. Each one uses the same FY{SITE_CONFIG.financialYear} ATO data as our income tax calculator.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <CalcLink href="/income-tax-calculator/" title="Income Tax Calculator" desc="Bracket-by-bracket Australian income tax" />
            <CalcLink href="/take-home-pay-calculator/" title="Take-Home Pay Calculator" desc="Net pay from any gross salary" />
            <CalcLink href="/superannuation-calculator/" title="Superannuation Calculator" desc="Employer SG contributions, 12% rate" />
            <CalcLink href="/salary-sacrifice-calculator/" title="Salary Sacrifice Calculator" desc="Pre-tax super contribution savings" />
            <CalcLink href="/hecs-help-calculator/" title="HECS-HELP Calculator" desc="Marginal student loan repayments" />
            <CalcLink href="/pay-rise-calculator/" title="Pay Rise Calculator" desc="Extra take-home pay from any raise" />
            <CalcLink href="/redundancy-pay-calculator/" title="Redundancy Pay Calculator" desc="NES entitlements and tax on redundancy" />
            <CalcLink href="/contractor-vs-employee-calculator/" title="Contractor vs Employee" desc="Side-by-side ABN vs PAYG comparison" />
            <CalcLink href="/gross-pay-calculator/" title="Gross Pay Calculator" desc="Reverse-calculate gross from net" />
            <CalcLink href="/hourly-to-annual-salary-calculator/" title="Hourly to Annual Salary" desc="Convert any pay frequency" />
            <CalcLink href="/bonus-tax-calculator/" title="Bonus Tax Calculator" desc="Tax withheld on bonuses & commissions" />
            <CalcLink href="/fortnightly-pay-calculator/" title="Fortnightly Pay Calculator" desc="Fortnightly take-home pay breakdown" />
          </div>
        </motion.section>

        {/* ===== 1. HOW DOES THE AUSTRALIAN PAY CALCULATOR WORK? ===== */}
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
            How Does the Australian Pay Calculator Work?
          </h2>
          <p className="mb-3 leading-relaxed text-warmgray">
            This Australian tax calculator converts your gross salary into exact take-home pay by applying the official ATO tax tables for FY{SITE_CONFIG.financialYear}. Every dollar of your salary is split into 5 components: income tax (progressive marginal rates from <strong>0% to 45%</strong>), the <strong>2%</strong> Medicare levy, any HECS-HELP repayments, the &quot;Low Income Tax Offset&quot; (LITO), and your employer&apos;s superannuation guarantee contribution.
          </p>
          <p className="mb-3 leading-relaxed text-warmgray">
            Your income tax is calculated in stages — not all at one rate. The first {formatAUD(TAX_BRACKETS[0].max)} is tax-free, then each portion above that threshold is taxed at progressively higher marginal rates: <strong>15%</strong> up to $45,000, <strong>30%</strong> up to $135,000, <strong>37%</strong> up to $190,000, and <strong>45%</strong> on every dollar above $190,000. This means a person earning $80,000 pays an effective tax rate of just <strong>20.5%</strong>, not the 30% marginal rate that applies to their top bracket.
          </p>
          <p className="leading-relaxed text-warmgray">
            Use our <Link href="/income-tax-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> for a detailed bracket-by-bracket breakdown, our <Link href="/superannuation-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to model your employer&apos;s SG contribution over time, or our <Link href="/take-home-pay-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> to compare net pay across different salary levels.
          </p>

          <MethodologyDisclosure className="mt-4">
            <ol className="list-decimal space-y-1 pl-4">
              <li>Calculate income tax using ATO resident tax brackets (progressive marginal rates). <SourceBadge label="ATO" href="https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents" /></li>
              <li>Apply the Low Income Tax Offset (up to {formatAUD(LITO.maxOffset)}) for qualifying incomes below {formatAUD(LITO.nilOffsetIncome)}.</li>
              <li>Add the 2% Medicare levy on taxable income. Apply the &quot;Medicare Levy Surcharge&quot; (1%–1.5%) for high earners without private health insurance.</li>
              <li>Calculate HECS-HELP repayment using the new marginal system (threshold: {formatAUD(HECS_HELP.minimumThreshold)}). <SourceBadge label="ATO" href="https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds" /></li>
              <li>Calculate employer superannuation at {formatPercent(SUPER_GUARANTEE.rate, 0)} of ordinary time earnings (paid on top, not deducted from salary).</li>
              <li>Take-home pay = Gross salary &minus; income tax &minus; Medicare levy &minus; HECS repayment.</li>
            </ol>
          </MethodologyDisclosure>
        </motion.section>

        {/* ===== 2. WHAT ARE THE AUSTRALIAN TAX BRACKETS FOR FY{SITE_CONFIG.financialYear}? ===== */}
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
            What Are the Australian Tax Brackets for FY{SITE_CONFIG.financialYear}?
          </h2>
          <p className="mb-4 text-warmgray">
            Australia uses <strong>5 income tax brackets</strong> for residents in the 2025-26 financial year. Each bracket taxes only the portion of income that falls within its range — not your entire salary.
          </p>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Income Range</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Tax Rate</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Tax on This Bracket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {TAX_BRACKETS.map((bracket, i) => (
                  <tr key={i} className="transition-colors hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-warmgray">
                      {formatAUD(bracket.min)} – {bracket.max === Infinity ? "+" : formatAUD(bracket.max)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-navy">{formatPercent(bracket.rate, 0)}</td>
                    <td className="px-4 py-3 text-warmgray-light">{bracket.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 flex items-center gap-2 text-sm text-warmgray-light">
            <SourceBadge label="ATO" href="https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents" />
            <Link href="/tax-brackets/" className="font-medium text-eucalyptus-dark hover:underline">Full tax brackets guide with worked examples &rarr;</Link>
          </p>

          {/* H3: How Does Marginal Tax Work? */}
          <h3
            className="mb-3 mt-8 text-xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            How Does Marginal Tax Work?
          </h3>
          <p className="mb-3 leading-relaxed text-warmgray">
            Marginal tax means each bracket&apos;s rate applies only to the income within that bracket. On an <strong>$80,000</strong> salary in FY{SITE_CONFIG.financialYear}, your tax is calculated across 3 separate brackets:
          </p>
          <ol className="mb-3 list-decimal space-y-1 pl-6 text-warmgray">
            <li>$0 – $18,200 at 0% = <strong>$0</strong></li>
            <li>$18,201 – $45,000 at 16% = <strong>$4,288</strong></li>
            <li>$45,001 – $80,000 at 30% = <strong>$10,500</strong></li>
          </ol>
          <p className="leading-relaxed text-warmgray">
            Total income tax: <strong>$14,788</strong>. Your effective tax rate is <strong>18.5%</strong> — far below the 30% marginal rate. The common mistake of applying 30% to the entire $80,000 would overstate your tax by <strong>$9,212</strong>. See the full <Link href="/tax-on/80000/" className="font-medium text-eucalyptus-dark hover:underline">tax on $80,000</Link> worked example or compare with <Link href="/tax-on/100000/" className="font-medium text-eucalyptus-dark hover:underline">tax on $100,000</Link>.
          </p>

          {/* H3: What Changed in the Stage 3 Tax Cuts? */}
          <h3
            className="mb-3 mt-8 text-xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            What Changed in the Stage 3 Tax Cuts?
          </h3>
          <p className="mb-3 leading-relaxed text-warmgray">
            The Stage 3 tax cuts took effect on <strong>1 July 2024</strong> and continue into FY{SITE_CONFIG.financialYear}. The 19% bracket rate dropped to <strong>16%</strong>, and the 30% bracket ceiling expanded from $120,000 to <strong>$135,000</strong>. A worker earning $100,000 saves <strong>$2,179</strong> per year compared to the pre-Stage-3 rates. A worker earning $60,000 saves <strong>$1,179</strong>. A worker earning $150,000 saves <strong>$3,729</strong>.
          </p>
          <p className="leading-relaxed text-warmgray">
            From <strong>1 July 2026</strong> (FY2026-27), the 16% bracket rate reduces further to <strong>15%</strong>, delivering an additional saving of up to $268 per year for workers in that bracket. Read the full <Link href="/tax-brackets/" className="font-medium text-eucalyptus-dark hover:underline">Australian tax brackets guide</Link> for stage 3 cut history and forward-looking changes, or see <Link href="/news/july-1-2026-money-changes/" className="font-medium text-eucalyptus-dark hover:underline">everything that changed on 1 July 2026</Link> across tax, super and wages.
          </p>
        </motion.section>

        {/* ===== 3. HOW MUCH TAX DO YOU PAY AT EVERY SALARY LEVEL? ===== */}
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
            How Much Tax Do You Pay at Every Salary Level?
          </h2>
          <p className="mb-4 text-warmgray">
            Take-home pay varies significantly across salary levels due to progressive taxation. The table below shows the exact tax, Medicare levy, and after-tax income for 10 common Australian salary levels in FY{SITE_CONFIG.financialYear}.
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
                  <th className="px-3 py-3 text-right font-semibold text-navy">Super (12%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {[
                  { gross: 40000, tax: 3088, medicare: 800, takeHome: 36112, effective: "9.7%", super_val: 4800 },
                  { gross: 50000, tax: 5788, medicare: 1000, takeHome: 43212, effective: "13.6%", super_val: 6000 },
                  { gross: 60000, tax: 8788, medicare: 1200, takeHome: 50012, effective: "16.6%", super_val: 7200 },
                  { gross: 70000, tax: 11788, medicare: 1400, takeHome: 56812, effective: "18.8%", super_val: 8400 },
                  { gross: 80000, tax: 14788, medicare: 1600, takeHome: 63612, effective: "20.5%", super_val: 9600 },
                  { gross: 90000, tax: 17788, medicare: 1800, takeHome: 70412, effective: "21.8%", super_val: 10800 },
                  { gross: 100000, tax: 20788, medicare: 2000, takeHome: 77212, effective: "22.8%", super_val: 12000 },
                  { gross: 120000, tax: 26788, medicare: 2400, takeHome: 90812, effective: "24.3%", super_val: 14400 },
                  { gross: 150000, tax: 36788, medicare: 3000, takeHome: 110212, effective: "26.5%", super_val: 18000 },
                  { gross: 200000, tax: 56288, medicare: 4000, takeHome: 139712, effective: "30.1%", super_val: 24000 },
                ].map((row) => (
                  <tr key={row.gross} className="transition-colors hover:bg-sandstone/50">
                    <td className="px-3 py-2.5 font-medium text-navy">
                      <Link href={`/tax-on/${row.gross}/`} className="hover:text-eucalyptus-dark hover:underline">{formatAUD(row.gross)}</Link>
                    </td>
                    <td className="px-3 py-2.5 text-right text-warmgray">{formatAUD(row.tax)}</td>
                    <td className="px-3 py-2.5 text-right text-warmgray">{formatAUD(row.medicare)}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-eucalyptus-dark">{formatAUD(row.takeHome)}</td>
                    <td className="px-3 py-2.5 text-right text-warmgray">{row.effective}</td>
                    <td className="px-3 py-2.5 text-right text-warmgray">{formatAUD(row.super_val)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-warmgray-light">
            Figures assume Australian resident, no HECS-HELP debt, and LITO applied where eligible. Use this Australian pay calculator above for your exact salary, or jump to <Link href="/take-home-pay-on/60000/" className="font-medium text-eucalyptus-dark hover:underline">take-home pay on $60K</Link>, <Link href="/take-home-pay-on/90000/" className="font-medium text-eucalyptus-dark hover:underline">$90K</Link>, or <Link href="/take-home-pay-on/120000/" className="font-medium text-eucalyptus-dark hover:underline">$120K</Link>.
          </p>
        </motion.section>

        {/* ===== 4. WHAT DEDUCTIONS REDUCE YOUR TAKE-HOME PAY? ===== */}
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
            What Deductions Reduce Your Take-Home Pay?
          </h2>
          <p className="mb-4 text-warmgray">
            Four compulsory deductions reduce your gross salary to net pay: income tax, the Medicare levy, the &quot;Medicare Levy Surcharge&quot; (for high earners without private health), and HECS-HELP repayments. Superannuation is paid separately by your employer and does not reduce your take-home pay.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <BreakdownCard
              title="Income Tax"
              description="Progressive marginal rates from 0% to 45%, applied in stages on your taxable income. The first $18,200 is tax-free."
              href="/income-tax-calculator/"
              linkText="Income Tax Calculator"
              icon={<Receipt className="h-5 w-5 text-ochre" />}
            />
            <BreakdownCard
              title="Medicare Levy"
              description={`A flat ${formatPercent(MEDICARE_LEVY.rate, 0)} levy on your taxable income that funds Australia's public healthcare system (Medicare).`}
              href="/medicare-levy/"
              linkText="Medicare Levy Guide"
              icon={<Heart className="h-5 w-5 text-rose-400" />}
            />
            <BreakdownCard
              title="HECS-HELP Repayment"
              description={`Compulsory repayments start at ${formatAUD(HECS_HELP.minimumThreshold)} under the new marginal system for FY${SITE_CONFIG.financialYear}.`}
              href="/hecs-help-calculator/"
              linkText="HECS-HELP Calculator"
              icon={<GraduationCap className="h-5 w-5 text-violet-500" />}
            />
            <BreakdownCard
              title="Superannuation"
              description={`Your employer pays ${formatPercent(SUPER_GUARANTEE.rate, 0)} of your salary into your super fund — on top of your salary, not deducted from it.`}
              href="/superannuation-calculator/"
              linkText="Superannuation Calculator"
              icon={<PiggyBank className="h-5 w-5 text-sky-500" />}
            />
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
            LITO raises the effective tax-free threshold from $18,200 to <strong>{formatAUD(LITO.effectiveTaxFreeThreshold)}</strong>. For example, a worker earning $30,000 receives the full $700 offset, reducing their tax bill from $1,888 to <strong>$1,188</strong>. Read our <Link href="/low-income-tax-offset/" className="font-medium text-eucalyptus-dark hover:underline">Low Income Tax Offset guide</Link> for full phase-out tables.
          </p>

          {/* H3: What Is the Medicare Levy Surcharge? */}
          <h3
            className="mb-3 mt-8 text-xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            What Is the Medicare Levy Surcharge?
          </h3>
          <p className="mb-3 leading-relaxed text-warmgray">
            The &quot;Medicare Levy Surcharge&quot; (MLS) is an additional levy of <strong>1% to 1.5%</strong> charged to high-income earners who do not hold private hospital cover. The MLS applies to singles earning above <strong>$93,000</strong> and families earning above <strong>$186,000</strong>. Three tiers apply:
          </p>
          <ul className="mb-3 list-disc space-y-1 pl-6 text-warmgray">
            <li>$93,001 – $108,000: surcharge of <strong>1.0%</strong></li>
            <li>$108,001 – $144,000: surcharge of <strong>1.25%</strong></li>
            <li>$144,001 and above: surcharge of <strong>1.5%</strong></li>
          </ul>
          <p className="leading-relaxed text-warmgray">
            A worker earning $120,000 without private health insurance pays an MLS of <strong>$1,500</strong> per year (1.25% of $120,000) — on top of the standard 2% Medicare levy. This makes the total health-related levy <strong>$3,900</strong> instead of $2,400. Holding any eligible private hospital cover eliminates the surcharge entirely. See our <Link href="/medicare-levy/" className="font-medium text-eucalyptus-dark hover:underline">Medicare Levy Guide</Link> for the full threshold tables.
          </p>
        </motion.section>

        {/* ===== 5. HOW IS SUPERANNUATION CALCULATED? ===== */}
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
            Your employer pays a &quot;Superannuation Guarantee&quot; (SG) of <strong>{formatPercent(SUPER_GUARANTEE.rate, 0)}</strong> of your Ordinary Time Earnings into your nominated super fund for FY{SITE_CONFIG.financialYear}. This is a compulsory employer obligation — the SG rate increased from 11.5% (FY2024-25) to 12% on 1 July 2025.
          </p>
          <p className="mb-3 leading-relaxed text-warmgray">
            On a salary of $80,000, your employer contributes <strong>$9,600 per year</strong> ($800 per month) into your super fund. On $100,000, the employer contributes <strong>$12,000</strong>. On $60,000, the contribution is <strong>$7,200</strong>. These amounts are paid on top of your gross salary and do not reduce your take-home pay.
          </p>
          <p className="mb-3 leading-relaxed text-warmgray">
            Employers pay super <strong>quarterly</strong>, within 28 days of each quarter&apos;s end (28 October, 28 January, 28 April, 28 July). Late payments trigger the Superannuation Guarantee Charge (SGC), which includes interest and an administration fee. The &quot;Maximum Super Contribution Base&quot; for FY{SITE_CONFIG.financialYear} is <strong>{formatAUD(SUPER_GUARANTEE.maxContributionBasePerQuarter)}</strong> per quarter ($250,000 annualised) — employers are not required to pay SG on earnings above this cap.
          </p>
          <p className="leading-relaxed text-warmgray">
            The &quot;concessional contributions&quot; cap (including employer SG, salary sacrifice, and personal deductible contributions) is <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong> per year. Exceeding this cap triggers additional tax at your marginal rate. Use our <Link href="/superannuation-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to model your exact employer contributions, or read the <Link href="/superannuation-guide/" className="font-medium text-eucalyptus-dark hover:underline">Superannuation Guide</Link> for a complete overview of contribution caps, investment options, and withdrawal rules.
          </p>
        </motion.section>

        {/* ===== 6. HOW DO HECS-HELP REPAYMENTS AFFECT TAKE-HOME PAY? ===== */}
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
            HECS-HELP repayments reduce take-home pay by <strong>$0 to 10%</strong> of income, depending on your salary. From FY{SITE_CONFIG.financialYear}, Australia uses a new marginal repayment system that replaces the previous flat-percentage model. Repayments start when &quot;Repayment Income&quot; exceeds <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong> — and you only pay on the amount above the threshold, not on your total income.
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
                <tr className="hover:bg-sandstone/50"><td className="px-4 py-2.5 text-warmgray">Below $69,528</td><td className="px-4 py-2.5 font-semibold text-navy">0%</td><td className="px-4 py-2.5 text-warmgray-light">No repayment required</td></tr>
                <tr className="hover:bg-sandstone/50"><td className="px-4 py-2.5 text-warmgray">$69,529 – $125,000</td><td className="px-4 py-2.5 font-semibold text-navy">15%</td><td className="px-4 py-2.5 text-warmgray-light">15c per $1 over $69,528</td></tr>
                <tr className="hover:bg-sandstone/50"><td className="px-4 py-2.5 text-warmgray">$125,001 – $179,285</td><td className="px-4 py-2.5 font-semibold text-navy">17%</td><td className="px-4 py-2.5 text-warmgray-light">$8,700 + 17c per $1 over $125,000</td></tr>
                <tr className="hover:bg-sandstone/50"><td className="px-4 py-2.5 text-warmgray">$179,286+</td><td className="px-4 py-2.5 font-semibold text-navy">10%</td><td className="px-4 py-2.5 text-warmgray-light">10% of total repayment income</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mb-3 leading-relaxed text-warmgray">
            <strong>At $65,000:</strong> Your income is below the $69,528 threshold, so your HECS repayment is <strong>$0</strong>. Your take-home pay is unaffected by your student debt.
          </p>
          <p className="mb-3 leading-relaxed text-warmgray">
            <strong>At $90,000:</strong> You pay 15% on the $23,000 above $69,528, equalling a HECS repayment of <strong>$3,450</strong> per year ($132.69 per fortnight). Your annual take-home pay drops from $70,412 to <strong>$66,962</strong>.
          </p>
          <p className="leading-relaxed text-warmgray">
            The new marginal system eliminates the cliff effect from the old model, where crossing a threshold by a single dollar triggered repayments on your entire income. Use our <Link href="/hecs-help-calculator/" className="font-medium text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> for your exact repayment figure, or read the <Link href="/hecs-help-guide/" className="font-medium text-eucalyptus-dark hover:underline">HECS-HELP Guide</Link> for the full threshold table.
          </p>
        </motion.section>

        {/* ===== 7. WHAT CHANGED IN AUSTRALIAN TAX FOR FY{SITE_CONFIG.financialYear}? ===== */}
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
            What Changed in Australian Tax for FY{SITE_CONFIG.financialYear}?
          </h2>
          <p className="mb-4 text-warmgray">
            Five major changes affect Australian workers&apos; pay calculations in the 2025-26 financial year, covering income tax rates, superannuation, student loans, Medicare, and contribution caps.
          </p>
          <ol className="list-decimal space-y-3 pl-6 text-warmgray">
            <li>
              <strong>Stage 3 tax cuts continue:</strong> The 16% bracket (down from 19%) and the expanded 30% bracket ceiling ($135,000, up from $120,000) remain in effect. Workers earning $80,000 save <strong>$1,279</strong> per year compared to pre-Stage-3 rates. Workers earning $45,000 save <strong>$804</strong>. Workers earning $200,000 save <strong>$4,529</strong>.
            </li>
            <li>
              <strong>SG rate increases to 12%:</strong> The employer superannuation guarantee rate rose from 11.5% to <strong>12%</strong> on 1 July 2025. On an $80,000 salary, this adds an extra <strong>$400 per year</strong> to your super balance compared to the previous rate.
            </li>
            <li>
              <strong>HECS-HELP reform (marginal system):</strong> The old flat-percentage repayment model is replaced by a new marginal system. The minimum repayment threshold increased from $69,528 to <strong>$69,528</strong>. Graduates earning between $69,528 and $69,528 now make <strong>zero compulsory repayments</strong>.
            </li>
            <li>
              <strong>Medicare levy low-income threshold:</strong> The individual threshold remains at <strong>{formatAUD(MEDICARE_LEVY.lowIncomeThreshold)}</strong> for FY{SITE_CONFIG.financialYear}. Earners below this amount receive a reduced Medicare levy or full exemption.
            </li>
            <li>
              <strong>Concessional contribution cap:</strong> The cap for concessional super contributions (including employer SG and salary sacrifice) remains at <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong> per year. The non-concessional cap remains at <strong>{formatAUD(SUPER_GUARANTEE.nonConcessionalCap)}</strong>.
            </li>
          </ol>
        </motion.section>

        {/* ══════════════ CONTEXT BORDER — SUPPLEMENTARY CONTENT ══════════════ */}

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
            The calculator above handles the most common scenario — converting a gross salary to take-home pay. For specialised situations (salary sacrifice, contractor rates, redundancy payouts, or reverse-calculating gross from net), use one of the dedicated calculators below.
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
            <CalcLink href="/hecs-help-calculator/" title="HECS-HELP Calculator" desc="Student loan repayments under the new marginal system" />
            <CalcLink href="/hourly-to-annual-salary-calculator/" title="Hourly to Annual Converter" desc="Convert between any pay frequency" />
            <CalcLink href="/gross-pay-calculator/" title="Gross Pay Calculator" desc="Reverse calculate gross from net take-home pay" />
            <CalcLink href="/redundancy-pay-calculator/" title="Redundancy Pay Calculator" desc="NES entitlements and tax on redundancy" />
            <CalcLink href="/bonus-tax-calculator/" title="Bonus Tax Calculator" desc="Tax withheld on bonuses and commissions" />
            <CalcLink href="/leave-calculator/" title="Leave Calculator" desc="Annual leave, personal leave, and long service leave" />
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
            <CalcLink href="/superannuation-calculator/" title="Superannuation Calculator" desc="Employer SG contributions and projected balance" />
            <CalcLink href="/overtime-pay-calculator/" title="Overtime Pay Calculator" desc="Time-and-a-half, double time, and public holiday rates" />
            <CalcLink href="/tax-return-calculator/" title="Tax Return Calculator" desc="Estimate your annual tax refund or liability" />
          </div>
        </motion.section>

        {/* ===== 9. HOW DOES PAY VARY ACROSS AUSTRALIAN STATES? ===== */}
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
            How Does Pay Vary Across Australian States?
          </h2>
          <p className="mb-4 text-warmgray">
            Income tax in Australia is <strong>federal</strong> — every state and territory uses the same tax brackets. State-level differences affect employers through payroll tax (a tax on total wages paid), which influences hiring costs but does not directly reduce employee take-home pay. Average salaries also vary by state due to industry composition, cost of living, and labour market conditions.
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
                {[
                  { state: "NSW", rate: "5.45%", threshold: "$1,200,000", avg: "$102,000" },
                  { state: "VIC", rate: "4.85%", threshold: "$900,000", avg: "$97,000" },
                  { state: "QLD", rate: "4.75%", threshold: "$1,300,000", avg: "$95,000" },
                  { state: "WA", rate: "5.50%", threshold: "$1,000,000", avg: "$105,000" },
                  { state: "SA", rate: "4.95%", threshold: "$1,500,000", avg: "$89,000" },
                  { state: "TAS", rate: "4.00%", threshold: "$1,250,000", avg: "$84,000" },
                  { state: "ACT", rate: "6.85%", threshold: "$2,000,000", avg: "$103,000" },
                  { state: "NT", rate: "5.50%", threshold: "$1,500,000", avg: "$91,000" },
                ].map((row) => (
                  <tr key={row.state} className="hover:bg-sandstone/50">
                    <td className="px-4 py-2.5 font-medium text-navy">{row.state}</td>
                    <td className="px-4 py-2.5 text-right text-warmgray">{row.rate}</td>
                    <td className="px-4 py-2.5 text-right text-warmgray">{row.threshold}</td>
                    <td className="px-4 py-2.5 text-right text-warmgray">{row.avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              <strong>Applying one flat tax rate to your entire salary.</strong> A worker earning $100,000 who assumes a 30% flat rate expects to pay <strong>$30,000</strong> in tax. The actual tax (using progressive marginal rates) is <strong>$20,788</strong> — an overestimate of $9,212. Tax is calculated in brackets, not as a single percentage.
            </li>
            <li>
              <strong>Confusing gross salary with a package that includes super.</strong> A &quot;$100,000 package including super&quot; means a base salary of <strong>$89,286</strong> ($100,000 / 1.12). The take-home pay on $89,286 is <strong>$69,710</strong> — not the $77,212 you receive on a $100,000 base salary. The difference is <strong>$7,502 per year</strong>.
            </li>
            <li>
              <strong>Forgetting the Medicare levy.</strong> The 2% Medicare levy adds <strong>$1,600</strong> in deductions on an $80,000 salary, <strong>$2,000</strong> on $100,000, and <strong>$3,000</strong> on $150,000. This is a separate charge from income tax and applies to all Australian residents above the low-income threshold.
            </li>
            <li>
              <strong>Not accounting for HECS-HELP repayments.</strong> An employee earning $90,000 with a HECS debt loses an additional <strong>$3,450</strong> per year in compulsory repayments. This is deducted from every pay cycle by your employer, reducing your fortnightly take-home by <strong>$132.69</strong>.
            </li>
            <li>
              <strong>Treating superannuation as a salary deduction.</strong> The 12% employer SG contribution is paid on top of your gross salary — it does not reduce your take-home pay. Workers who subtract super from their gross overstate their deductions by <strong>$9,600</strong> at the $80,000 salary level.
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
          <Accordion type="multiple" className="space-y-3">
            <FAQItem value="tax-80k" question="How much tax do I pay on $80,000 in Australia?">
              On an $80,000 salary in FY{SITE_CONFIG.financialYear}, you pay <strong>$14,788</strong> in income tax plus <strong>$1,600</strong> in Medicare levy — a total of $16,388. Your take-home pay is approximately <strong>$63,612 per year</strong>, or $1,223.31 per week. Your employer also pays $9,600 into your super fund on top of your salary.
            </FAQItem>
            <FAQItem value="tax-free" question="What is the tax-free threshold in Australia?">
              The tax-free threshold is <strong>$18,200</strong>. You pay no income tax on the first $18,200 you earn. With the Low Income Tax Offset (LITO), the effective tax-free threshold increases to <strong>{formatAUD(LITO.effectiveTaxFreeThreshold)}</strong>.
            </FAQItem>
            <FAQItem value="super" question="How much super does my employer pay?">
              From 1 July 2025, employers must pay <strong>{formatPercent(SUPER_GUARANTEE.rate, 0)}</strong> of your Ordinary Time Earnings into your super fund. On an $80,000 salary, that&apos;s <strong>$9,600 per year</strong>. This is paid on top of your salary — it doesn&apos;t reduce your take-home pay.
            </FAQItem>
            <FAQItem value="medicare" question="What is the Medicare levy?">
              The Medicare levy is <strong>{formatPercent(MEDICARE_LEVY.rate, 0)}</strong> of your taxable income, collected to help fund Australia&apos;s public healthcare system. On $80,000, that&apos;s <strong>$1,600 per year</strong>. Low-income earners below approximately {formatAUD(MEDICARE_LEVY.lowIncomeThreshold)} pay a reduced levy or are exempt.
            </FAQItem>
            <FAQItem value="hecs" question="How do HECS-HELP repayments work in 2025-26?">
              From FY{SITE_CONFIG.financialYear}, HECS-HELP uses a <strong>new marginal repayment system</strong>. Compulsory repayments start when your income reaches {formatAUD(HECS_HELP.minimumThreshold)}, and you only pay on the amount above the threshold — not on your total income.
            </FAQItem>
            <FAQItem value="gross-net" question="What&apos;s the difference between gross and net pay?">
              Gross pay is your total salary before any deductions. Net pay (or take-home pay) is what you actually receive after income tax, Medicare levy, and any HECS repayments are deducted. For example, $80,000 gross becomes approximately <strong>$63,612 net</strong>.
            </FAQItem>
            <FAQItem value="super-included" question="What does &apos;salary includes super&apos; mean?">
              Some job offers state a total package that includes superannuation. For example, a &quot;$90,000 package including super&quot; means your base salary is approximately <strong>$80,357</strong> ($90,000 / 1.12), and your employer pays the remaining $9,643 into your super fund. This is different from &quot;$90,000 + super&quot; where you receive $90,000 plus an additional 12%.
            </FAQItem>
            <FAQItem value="pro-rata" question="How is pro-rata pay calculated?">
              Pro-rata pay is proportional to the hours you work compared to full-time. If a full-time role (38 hours) pays $80,000 per year and you work 25 hours, your pro-rata salary is $80,000 x (25 / 38) = <strong>$52,632 per year</strong>. Enable the &quot;Pro-Rata / Part-Time&quot; option above to calculate yours.
            </FAQItem>
            <FAQItem value="tax-100k" question="How much tax do I pay on $100,000?">
              On a $100,000 salary in FY{SITE_CONFIG.financialYear}, you pay <strong>$20,788</strong> in income tax plus <strong>$2,000</strong> in Medicare levy — a total of $22,788. Your take-home pay is <strong>$77,212 per year</strong> ($1,484.85 per week). Your effective tax rate is <strong>22.8%</strong>, and your employer pays <strong>$12,000</strong> into your super fund.
            </FAQItem>
            <FAQItem value="non-resident" question="What is the tax-free threshold for non-residents?">
              Non-residents have <strong>no tax-free threshold</strong>. Every dollar earned in Australia is taxed from $1. The non-resident rate is <strong>30%</strong> on the first $135,000, <strong>37%</strong> on $135,001 to $190,000, and <strong>45%</strong> above $190,000. A non-resident earning $80,000 pays <strong>$24,000</strong> in tax — compared to $14,788 for a resident. See our <Link href="/non-resident-tax/" className="font-medium text-eucalyptus-dark hover:underline">non-resident tax guide</Link> for full details.
            </FAQItem>
            <FAQItem value="salary-sacrifice" question="How does salary sacrifice reduce my tax?">
              Salary sacrifice redirects part of your pre-tax salary into your super fund, reducing your taxable income. Sacrificing <strong>$10,000</strong> on an $80,000 salary reduces your taxable income to $70,000 — saving approximately <strong>$2,550</strong> in tax. The sacrificed amount is taxed at <strong>15%</strong> inside super instead of your marginal rate of 30%. Use our <Link href="/salary-sacrifice-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> to compare the before-and-after scenarios.
            </FAQItem>
            <FAQItem value="states" question="Do I pay tax differently in different states?">
              <strong>No.</strong> Income tax in Australia is a federal tax — all 8 states and territories use the same tax brackets and rates. State-level differences only affect employers through payroll tax. Your take-home pay on a given salary is identical in NSW, Victoria, Queensland, Western Australia, South Australia, Tasmania, the ACT, and the Northern Territory.
            </FAQItem>
            <FAQItem value="super-frequency" question="How often is super paid by my employer?">
              Employers pay superannuation <strong>quarterly</strong>, within 28 days of each quarter&apos;s end: 28 October, 28 January, 28 April, and 28 July. Some employers pay monthly or per pay cycle as a goodwill measure, but the legal minimum is quarterly. Late payments attract the Superannuation Guarantee Charge (SGC), including interest at 10% per annum.
            </FAQItem>
            <FAQItem value="mls" question="What is the Medicare Levy Surcharge?">
              The &quot;Medicare Levy Surcharge&quot; (MLS) is an additional <strong>1% to 1.5%</strong> levy on top of the standard 2% Medicare levy. It applies to singles earning above <strong>$93,000</strong> (or families above $186,000) who do not hold private hospital insurance. A single earner on $120,000 without private health pays <strong>$1,500</strong> per year in MLS. Holding any eligible hospital cover eliminates the surcharge entirely.
            </FAQItem>
            <FAQItem value="daily-rate" question="How do I calculate my daily rate from annual salary?">
              Divide your annual salary by <strong>260</strong> working days (52 weeks &times; 5 days). On an $80,000 salary, your daily rate is <strong>$307.69</strong>. For an hourly rate, divide the daily rate by your standard hours (typically 7.6 for a 38-hour week): $80,000 / 52 / 38 = <strong>$40.49/hour</strong>. Use our <Link href="/hourly-to-annual-salary-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Hourly to Annual Salary Calculator</Link> to convert between any pay frequency.
            </FAQItem>
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
            <CalcLink href="/tax-brackets/" title="Tax Brackets 2025-26" desc="Complete bracket table with worked examples at every income level" />
            <CalcLink href="/medicare-levy/" title="Medicare Levy Guide" desc="2% levy, low-income exemption, surcharge thresholds, and family rates" />
            <CalcLink href="/superannuation-guide/" title="Superannuation Guide" desc="SG rates, contribution caps, employer obligations, and withdrawal rules" />
            <CalcLink href="/salary-sacrifice-guide/" title="Salary Sacrifice Guide" desc="How pre-tax super contributions reduce your tax bill" />
            <CalcLink href="/hecs-help-guide/" title="HECS-HELP Guide" desc="New marginal repayment system, thresholds, and indexation rules" />
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

function BreakdownCard({ title, description, href, linkText, icon }: { title: string; description: string; href: string; linkText: string; icon?: React.ReactNode }) {
  return (
    <div className="group rounded-xl border border-sandstone-dark/20 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <h3 className="font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{title}</h3>
      </div>
      <p className="mb-2 text-sm leading-relaxed text-warmgray">{description}</p>
      <Link href={href} className="text-sm font-medium text-eucalyptus-dark hover:underline">
        {linkText} &rarr;
      </Link>
    </div>
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

function FAQItem({ value, question, children }: { value: string; question: string; children: React.ReactNode }) {
  return (
    <AccordionItem value={value} className="rounded-xl border border-sandstone-dark/20 px-5">
      <AccordionTrigger className="text-left text-base font-medium text-navy">{question}</AccordionTrigger>
      <AccordionContent>
        <p className="leading-relaxed text-warmgray">{children}</p>
      </AccordionContent>
    </AccordionItem>
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
