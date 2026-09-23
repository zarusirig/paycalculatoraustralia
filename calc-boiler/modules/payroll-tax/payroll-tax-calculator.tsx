"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD, formatNegAUD } from "@/lib/constants";
import {
  PAYROLL_TAX_FY,
  PAYROLL_TAX_STATE_CODES,
  PAYROLL_TAX_STATES,
  calculatePayrollTax,
  type PayrollTaxStateCode,
} from "@/lib/constants/payroll-tax";
import { parseMoneyInput } from "@/lib/money-input";
import { pctTrim } from "./format";

const inputClass =
  "block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm";

const errorInputClass = "border-red-400 focus:border-red-500 focus:ring-red-200";

function Row({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className={muted ? "text-warmgray-light" : "text-warmgray"}>{label}</span>
      <span className={`tabular-nums ${bold ? "font-bold text-navy" : "text-navy"}`}>{value}</span>
    </div>
  );
}

export interface PayrollTaxCalculatorProps {
  defaultState?: PayrollTaxStateCode;
  defaultWages?: number;
  /** Heading level text; the state pages pass "NSW payroll tax calculator" etc. */
  title?: string;
}

export default function PayrollTaxCalculator({
  defaultState = "nsw",
  defaultWages = 2_000_000,
  title,
}: PayrollTaxCalculatorProps) {
  const [state, setState] = useState<PayrollTaxStateCode>(defaultState);
  const [stateWagesText, setStateWagesText] = useState(String(defaultWages));
  const [interstate, setInterstate] = useState(false);
  const [ausWagesText, setAusWagesText] = useState(String(defaultWages * 2));
  const [regional, setRegional] = useState(false);

  const info = PAYROLL_TAX_STATES[state];
  const stateParsed = parseMoneyInput(stateWagesText);
  const ausParsed = parseMoneyInput(ausWagesText);
  const stateWages = stateParsed.value;
  const ausWages = ausParsed.value;
  const australianWages = interstate ? Math.max(ausWages, stateWages) : stateWages;
  const inputError = Boolean(stateParsed.error || (interstate && ausParsed.error));
  const regionalApplies = state === "vic" || state === "qld";

  const r = useMemo(
    () => calculatePayrollTax({ state, stateWages, australianWages, regional: regionalApplies && regional }),
    [state, stateWages, australianWages, regional, regionalApplies],
  );

  const ausBelowState = interstate && !ausParsed.error && ausWages > 0 && ausWages < stateWages;

  return (
    <Card className="not-prose shadow-md">
      <CardContent className="p-6 md:p-8">
        <h2 className="mb-1 text-xl font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          {title ?? `Payroll Tax Calculator ${PAYROLL_TAX_FY}`}
        </h2>
        <p className="mb-6 text-sm text-warmgray">
          Annual liability on {PAYROLL_TAX_FY} rates for a full year of wages. Enter taxable wages: salaries,
          super, taxable fringe benefits and taxable contractor payments, less exempt wages.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div>
              <label htmlFor="pt-state" className="mb-1 block text-sm font-medium text-navy">State or territory</label>
              <select
                id="pt-state"
                value={state}
                onChange={(e) => setState(e.target.value as PayrollTaxStateCode)}
                className={inputClass}
              >
                {PAYROLL_TAX_STATE_CODES.map((c) => (
                  <option key={c} value={c}>
                    {PAYROLL_TAX_STATES[c].name} ({PAYROLL_TAX_STATES[c].abbr})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="pt-wages" className="mb-1 block text-sm font-medium text-navy">
                Annual taxable wages paid in {info.abbr}
              </label>
              <div className="flex items-center">
                <span className="mr-2 text-warmgray-light">$</span>
                <input
                  id="pt-wages"
                  inputMode="decimal"
                  value={stateWagesText}
                  onChange={(e) => setStateWagesText(e.target.value)}
                  aria-invalid={stateParsed.error ? true : undefined}
                  aria-describedby={stateParsed.error ? "pt-wages-error pt-wages-hint" : "pt-wages-hint"}
                  className={`${inputClass} ${stateParsed.error ? errorInputClass : ""}`}
                />
              </div>
              {stateParsed.error && (
                <p id="pt-wages-error" className="mt-1 text-xs font-medium text-red-600">{stateParsed.message}</p>
              )}
              <p id="pt-wages-hint" className="mt-1 text-xs text-warmgray-light">For a group, the whole group&rsquo;s {info.abbr} wages.</p>
            </div>

            <label className="flex items-start gap-2 text-sm text-navy">
              <input
                type="checkbox"
                checked={interstate}
                onChange={(e) => setInterstate(e.target.checked)}
                className="mt-1 rounded border-sandstone-dark/40 text-eucalyptus focus:ring-eucalyptus/20"
              />
              <span>
                I (or my group) also pay wages in other states
                <span className="block text-xs text-warmgray-light">
                  The threshold is shared out by the {info.abbr} proportion of Australian wages.
                </span>
              </span>
            </label>

            {interstate && (
              <div>
                <label htmlFor="pt-aus" className="mb-1 block text-sm font-medium text-navy">
                  Total Australian taxable wages (all states, including {info.abbr})
                </label>
                <div className="flex items-center">
                  <span className="mr-2 text-warmgray-light">$</span>
                  <input
                    id="pt-aus"
                    inputMode="decimal"
                    value={ausWagesText}
                    onChange={(e) => setAusWagesText(e.target.value)}
                    aria-invalid={ausParsed.error ? true : undefined}
                    aria-describedby={ausParsed.error ? "pt-aus-error" : undefined}
                    className={`${inputClass} ${ausParsed.error ? errorInputClass : ""}`}
                  />
                </div>
                {ausParsed.error && (
                  <p id="pt-aus-error" className="mt-1 text-xs font-medium text-red-600">{ausParsed.message}</p>
                )}
                {ausBelowState && (
                  <p className="mt-1 text-xs text-ochre">Australian wages include the {info.abbr} wages, so they are treated as at least {formatAUD(stateWages)}.</p>
                )}
              </div>
            )}

            {regionalApplies && (
              <label className="flex items-start gap-2 text-sm text-navy">
                <input
                  type="checkbox"
                  checked={regional}
                  onChange={(e) => setRegional(e.target.checked)}
                  className="mt-1 rounded border-sandstone-dark/40 text-eucalyptus focus:ring-eucalyptus/20"
                />
                <span>
                  {state === "vic" ? "Regional Victorian employer (1.2125% rate)" : "Eligible regional Queensland employer (1% rate discount)"}
                  <span className="block text-xs text-warmgray-light">
                    {state === "vic"
                      ? "At least 85% of Victorian taxable wages paid to employees working mainly in regional Victoria."
                      : "Principal place of employment in regional Queensland and at least 85% of Queensland wages paid to regional employees."}
                  </span>
                </span>
              </label>
            )}
          </form>

          <div className="space-y-4" aria-live="polite">
            <div className="rounded-xl border border-sandstone-dark/20 bg-sandstone p-6 text-center shadow-sm">
              <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-ochre">
                {info.abbr} payroll tax for the year
              </div>
              <div className="mb-1 text-4xl font-extrabold text-navy">{inputError ? "—" : formatAUD(r.total)}</div>
              <div className="mt-2 text-sm text-warmgray">
                {inputError
                  ? "Check the wages figure to see the payroll tax."
                  : r.overThreshold
                    ? `about ${formatAUD(r.total / 12)} a month · ${pctTrim(r.effectiveRate, 2)} of ${info.abbr} wages`
                    : `Australian wages are under the ${formatAUD(info.annualThreshold)} threshold`}
              </div>
            </div>

            {!inputError && (
              <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 bg-white">
                <div className="border-b border-sandstone-dark/20 bg-sandstone px-5 py-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-navy">How it is worked out</h3>
                </div>
                <div className="space-y-3 p-5 text-sm">
                  <Row label={`${info.abbr} taxable wages`} value={formatAUD(r.stateWages)} />
                  {interstate && <Row label={`${info.abbr} share of Australian wages`} value={pctTrim(r.share, 1)} muted />}
                  <Row label="Less threshold / deduction" value={formatNegAUD(r.deduction, 0, "−")} />
                  <Row label="Wages taxed" value={formatAUD(r.taxableWages)} />
                  <Row
                    label={state === "tas" && r.rate === 0.061 ? "Rates (4% band, then 6.1%)" : "Rate"}
                    value={pctTrim(r.rate, 4)}
                    muted
                  />
                  <Row label="Payroll tax" value={formatAUD(r.payrollTax)} />
                  {r.surchargeLabel && (
                    <Row label={r.surchargeLabel} value={formatAUD(r.surcharge)} muted={r.surcharge === 0} />
                  )}
                  <div className="border-t border-sandstone-dark/20 pt-3" />
                  <Row label="Total for the year" value={formatAUD(r.total)} bold />
                </div>
              </div>
            )}

            <p className="text-xs text-warmgray-light">
              Full financial year only. Part-year employers get a smaller threshold, and monthly returns use the
              monthly threshold ({info.monthlyThresholdText}); the annual return trues it up. Payroll tax is an
              employer cost — to add super, leave and workers compensation, use the{" "}
              <Link href="/employer-cost-calculator/" className="text-eucalyptus-dark hover:underline">employer cost calculator</Link>.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
