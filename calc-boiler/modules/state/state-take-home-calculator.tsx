"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
  EMPLOYMENT,
  SUPER_GUARANTEE,
  HECS_HELP,
} from "@/lib/constants";
import { STATE_PROFILES } from "@/lib/data/state-employee";

/**
 * The take-home pay calculator that sits above the fold on every
 * /pay-calculator-<state>/ page.
 *
 * There is no state-specific maths in here and there must never be: personal
 * income tax, the Medicare levy, HECS-HELP and super are federal, so the engine
 * is the same `calculatePayBreakdown` used by /take-home-pay-calculator/ and
 * every other calculator on the site. The state selector is a navigation
 * control — it is pre-selected to the page you are on and moves you to the
 * sibling page, so the answer never silently changes without the URL changing.
 */

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const STATE_ORDER = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as const;

const STATE_PATHS: Readonly<Record<string, string>> = {
  NSW: "/pay-calculator-nsw/",
  VIC: "/pay-calculator-vic/",
  QLD: "/pay-calculator-qld/",
  WA: "/pay-calculator-wa/",
  SA: "/pay-calculator-sa/",
  TAS: "/pay-calculator-tas/",
  ACT: "/pay-calculator-act/",
  NT: "/pay-calculator-nt/",
};

export interface StateTakeHomeCalculatorProps {
  /** Which state page this instance is on. Pre-selects the state input. */
  stateCode: keyof typeof STATE_PATHS;
  /** Starting salary — each page seeds this from its own ABS state figure. */
  defaultSalary: number;
}

export default function StateTakeHomeCalculator({
  stateCode,
  defaultSalary,
}: StateTakeHomeCalculatorProps) {
  const router = useRouter();
  const profile = STATE_PROFILES[stateCode];

  const [salary, setSalary] = useState(defaultSalary);
  const [includeHECS, setIncludeHECS] = useState(false);
  const [hasPrivateHealth, setHasPrivateHealth] = useState(true);
  const [superIncluded, setSuperIncluded] = useState(false);

  const result = useMemo(
    () =>
      calculatePayBreakdown({
        grossSalary: salary,
        includeHECS,
        hasPrivateHealth,
        superIncluded,
      }),
    [salary, includeHECS, hasPrivateHealth, superIncluded]
  );

  const hourly = result.takeHomePay / EMPLOYMENT.hoursPerYear;

  return (
    <Card className="shadow-md">
      <CardContent className="p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label htmlFor="state-select" className="mb-1 block text-sm font-medium text-navy">
                Where you work
              </label>
              <select
                id="state-select"
                value={stateCode}
                onChange={(e) => router.push(STATE_PATHS[e.target.value])}
                className="block w-full rounded-md border-sandstone-dark/30 bg-white py-2 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20"
              >
                {STATE_ORDER.map((code) => (
                  <option key={code} value={code}>
                    {STATE_PROFILES[code].name} ({code})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-warmgray-light">
                Income tax is federal, so the result is the same in every state — changing this
                takes you to that state&apos;s holidays, long service leave and payroll tax page.
              </p>
            </div>

            <div>
              <label htmlFor="salary" className="mb-1 block text-sm font-medium text-navy">
                Gross annual salary
              </label>
              <div className="flex items-center">
                <span className="mr-2 text-warmgray-light">$</span>
                <input
                  type="number"
                  id="salary"
                  min={0}
                  max={500000}
                  step={1000}
                  value={salary}
                  onChange={(e) => setSalary(clamp(Number(e.target.value || 0), 0, 500000))}
                  className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20"
                />
              </div>
              <input
                type="range"
                min={0}
                max={300000}
                step={1000}
                value={clamp(salary, 0, 300000)}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="mt-2 w-full accent-eucalyptus"
                aria-hidden="true"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={superIncluded}
                onChange={(e) => setSuperIncluded(e.target.checked)}
                className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus"
              />
              <span className="text-navy">
                That figure already includes super (a &quot;package&quot; offer)
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeHECS}
                onChange={(e) => setIncludeHECS(e.target.checked)}
                className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus"
              />
              <span className="text-navy">I have a HECS-HELP or student loan debt</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={hasPrivateHealth}
                onChange={(e) => setHasPrivateHealth(e.target.checked)}
                className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus"
              />
              <span className="text-navy">I hold private hospital cover</span>
            </label>

            <p className="text-xs text-warmgray-light">
              HECS-HELP repayments start at {formatAUD(HECS_HELP.minimumThreshold)}. Super is shown on top
              of your salary at {formatPercent(SUPER_GUARANTEE.rate, 0)} because your employer pays
              it, not you.
            </p>
          </form>

          <div className="space-y-4" role="region" aria-live="polite">
            <div className="rounded-xl border border-eucalyptus-light bg-eucalyptus-light/40 p-6 text-center shadow-sm">
              <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-eucalyptus-dark">
                Take-home pay · {profile.shortName}
              </div>
              <div className="text-4xl font-extrabold text-navy">
                {formatAUD(result.takeHomePay)}
              </div>
              <div className="mt-2 text-sm text-warmgray">a year, after tax</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4">
              <PayCycle label="weekly" value={formatAUD(result.weekly, 2)} />
              <PayCycle label="fortnightly" value={formatAUD(result.fortnightly, 2)} />
              <PayCycle label="monthly" value={formatAUD(result.monthly, 2)} />
              <PayCycle label="per hour" value={formatAUD(hourly, 2)} />
            </div>

            <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 bg-white">
              <div className="border-b border-sandstone-dark/20 bg-sandstone px-5 py-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-navy">
                  What comes out
                </h2>
              </div>
              <div className="space-y-2.5 p-5 text-sm">
                <Row label="Gross salary" value={formatAUD(result.grossSalary)} bold />
                <Row label="Income tax" value={`-${formatAUD(result.incomeTax)}`} />
                {result.litoOffset > 0 && (
                  <Row label="Low income tax offset" value={`+${formatAUD(result.litoOffset)}`} sub />
                )}
                <Row label="Medicare levy" value={`-${formatAUD(result.medicareLevy)}`} />
                {result.medicareSurcharge > 0 && (
                  <Row
                    label="Medicare levy surcharge"
                    value={`-${formatAUD(result.medicareSurcharge)}`}
                  />
                )}
                {includeHECS && (
                  <Row label="HECS-HELP repayment" value={`-${formatAUD(result.hecsRepayment)}`} />
                )}
                <div className="border-t border-sandstone-dark/20 pt-2.5">
                  <Row label="Take-home pay" value={formatAUD(result.takeHomePay)} bold />
                  <Row label="Effective tax rate" value={formatPercent(result.effectiveTaxRate)} />
                  <Row label="Marginal rate (incl. Medicare levy)" value={formatPercent(result.marginalTaxRate, 0)} />
                </div>
                <div className="border-t border-sandstone-dark/20 pt-2.5">
                  <Row
                    label={`Super (${formatPercent(SUPER_GUARANTEE.rate, 0)}, employer-paid)`}
                    value={`+${formatAUD(result.superContribution)}`}
                  />
                  <Row label="Total package" value={formatAUD(result.totalPackage)} bold />
                </div>
              </div>
            </div>

            <p className="text-xs text-warmgray">
              Checking a payslip? Compare the fortnightly figure above with the net pay on your
              slip — see{" "}
              <Link href="/understanding-your-payslip/" className="text-eucalyptus-dark hover:underline">
                how to read an Australian payslip
              </Link>
              .
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PayCycle({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-sandstone p-2">
      <div className="font-semibold text-navy">{value}</div>
      <div className="text-warmgray-light">{label}</div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  sub,
}: {
  label: string;
  value: string;
  bold?: boolean;
  sub?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between ${sub ? "text-xs text-warmgray-light" : ""}`}>
      <span className={bold ? "font-semibold text-navy" : sub ? "" : "text-warmgray"}>{label}</span>
      <span className={bold ? "font-bold text-navy" : "font-medium text-navy"}>{value}</span>
    </div>
  );
}
