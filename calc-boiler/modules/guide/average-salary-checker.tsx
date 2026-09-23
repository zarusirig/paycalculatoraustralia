"use client";

import { useId, useMemo, useState } from "react";
import {
  EE_RELEASE,
  HEADLINE,
  WEEKS_PER_YEAR,
  dollars,
  salaryPercentile,
  type Population,
} from "@/lib/data/average-salary";
import { parseMoneyInput } from "@/lib/money-input";

const POPULATIONS: { id: Population; label: string; median: number }[] = [
  { id: "fullTime", label: "Full-time employees", median: HEADLINE.medianFullTimeAnnual },
  { id: "all", label: "All employees (incl. part-time)", median: HEADLINE.medianAllAnnual },
];

function pct(share: number): string {
  return `${Math.round(share * 100)}%`;
}

/**
 * "Is my salary above average?" — places a salary in the ABS Employee
 * Earnings August 2025 distribution. The ABS publishes counts in $100-a-week
 * bands, so the answer is a range, never an interpolated point.
 */
export default function AverageSalaryChecker() {
  const inputId = useId();
  const [raw, setRaw] = useState("85000");
  const [population, setPopulation] = useState<Population>("fullTime");

  const parsed = parseMoneyInput(raw, { max: 99_999_999 });
  const salary = parsed.value;
  const valid = !parsed.error && salary > 0;
  const result = useMemo(() => (valid ? salaryPercentile(salary, population) : null), [salary, population, valid]);
  const pop = POPULATIONS.find((p) => p.id === population)!;

  return (
    <div className="not-prose my-8 rounded-2xl border border-eucalyptus/30 bg-eucalyptus-light/30 p-5 sm:p-6">
      <h3 className="mb-1 text-xl font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
        Is my salary above average?
      </h3>
      <p className="mb-4 text-sm text-warmgray">
        Compare your gross salary with every employee the ABS counted in August 2025.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor={inputId} className="mb-1 block text-sm font-semibold text-navy">
            Your salary before tax (per year)
          </label>
          <div className="flex items-center rounded-lg border border-sandstone-dark/40 bg-white px-3 focus-within:ring-2 focus-within:ring-eucalyptus">
            <span className="text-warmgray">$</span>
            <input
              id={inputId}
              inputMode="decimal"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              className="w-full bg-transparent px-2 py-2.5 text-lg text-navy outline-none"
              aria-invalid={parsed.error ? true : undefined}
              aria-describedby={parsed.error ? `${inputId}-error ${inputId}-help` : `${inputId}-help`}
            />
          </div>
          {parsed.error && (
            <p id={`${inputId}-error`} className="mt-1 text-xs font-medium text-red-600">{parsed.message}</p>
          )}
        </div>
        <fieldset className="flex-1">
          <legend className="mb-1 block text-sm font-semibold text-navy">Compare with</legend>
          <div className="flex flex-col gap-1.5">
            {POPULATIONS.map((p) => (
              <label key={p.id} className="flex items-center gap-2 text-sm text-navy">
                <input
                  type="radio"
                  name={`${inputId}-population`}
                  checked={population === p.id}
                  onChange={() => setPopulation(p.id)}
                  className="accent-eucalyptus-dark"
                />
                {p.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div aria-live="polite" className="mt-5 rounded-xl bg-white p-4 text-navy shadow-sm">
        {result ? (
          <>
            <p className="text-lg">
              You earn more than{" "}
              <strong className="text-eucalyptus-dark">
                {result.bandCeiling === null
                  ? `at least ${pct(result.shareBelowFloor)}`
                  : `${pct(result.shareBelowFloor)} to ${pct(result.shareBelowCeiling)}`}
              </strong>{" "}
              of {pop.label.toLowerCase()}.
            </p>
            <p className="mt-2 text-sm text-warmgray">
              {dollars(salary)} a year is {dollars(result.weekly)} a week. {pct(result.shareBelowFloor)} of{" "}
              {pop.label.toLowerCase()} earned under {dollars(result.bandFloor)} a week
              {result.bandCeiling !== null && (
                <>
                  {" "}and {pct(result.shareBelowCeiling)} earned under {dollars(result.bandCeiling)}
                </>
              )}
              . The median for this group is {dollars(pop.median)} a year —{" "}
              {salary >= pop.median ? "you are above it" : "you are below it"}.
            </p>
          </>
        ) : (
          <p className="text-sm text-warmgray">Enter a yearly salary to see where it sits.</p>
        )}
      </div>

      <p id={`${inputId}-help`} className="mt-3 text-xs text-warmgray">
        Source: ABS {EE_RELEASE.title}, {EE_RELEASE.referencePeriod} (Table 7), weekly earnings in main job
        before tax. Annual salary is divided by {WEEKS_PER_YEAR}. The ABS counts employees in $100-a-week
        bands, so the result is a range. Earnings have grown since August 2025, so treat it as a slight
        overstatement of where you sit today.
      </p>
    </div>
  );
}
