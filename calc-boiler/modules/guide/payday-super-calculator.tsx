"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { CalendarClock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import { SUPER_GUARANTEE, SUPER_GUARANTEE_CHARGE } from "@/lib/constants/australian-tax";
import {
  PAYS_PER_YEAR,
  earliestSgDueDate,
  formatDateAU,
  parseIsoDate,
  perPaySuper,
  type PayFrequency,
} from "@/lib/constants/payday-super";

/**
 * The interactive per-pay super calculator on /payday-super/. Split out so
 * the rest of payday-super.tsx renders on the server.
 */

const C = SUPER_GUARANTEE_CHARGE.current;
const RATE = `${SUPER_GUARANTEE.rate * 100}%`;
const H = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

const FREQUENCIES: { id: PayFrequency; label: string }[] = [
  { id: "weekly", label: "Weekly" },
  { id: "fortnightly", label: "Fortnightly" },
  { id: "monthly", label: "Monthly" },
];

// Today's date on the client, "" during prerender — avoids a hydration
// mismatch between the build date and the visitor's date.
const noopSubscribe = () => () => {};
function useTodayIso(): string {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      const now = new Date();
      return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10);
    },
    () => "",
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function PerPaySuperCalculator() {
  const [salary, setSalary] = useState(85_000);
  const [freq, setFreq] = useState<PayFrequency>("fortnightly");
  const [paydayInput, setPaydayInput] = useState<string | null>(null);
  const [firstContribution, setFirstContribution] = useState(false);
  const today = useTodayIso();
  const payday = paydayInput ?? today;

  const r = useMemo(() => perPaySuper(salary, freq), [salary, freq]);
  const paydayDate = parseIsoDate(payday);
  const due = paydayDate ? earliestSgDueDate(paydayDate, firstContribution) : null;
  const days = firstContribution ? C.businessDaysNewEmployee : C.businessDaysToPay;

  return (
    <Card className="shadow-md">
      <CardContent className="p-6 md:p-8">
        <h2 style={H} className="mb-6 text-xl font-semibold text-navy">Payday Super calculator: super on each pay</h2>
        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div>
              <label htmlFor="ps-salary" className="mb-1 block text-sm font-medium text-navy">Annual salary (qualifying earnings)</label>
              <div className="flex items-center">
                <span className="mr-2 text-warmgray-light">$</span>
                <input id="ps-salary" type="number" min={0} max={1_000_000} step={1000} value={salary}
                  onChange={(e) => setSalary(clamp(Number(e.target.value || 0), 0, 1_000_000))}
                  className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
              </div>
              <p className="mt-1 text-xs text-warmgray-light">Base pay before tax. Leave out overtime, which usually isn&rsquo;t qualifying earnings.</p>
            </div>
            <fieldset>
              <legend className="mb-1 block text-sm font-medium text-navy">Pay frequency</legend>
              <div className="grid grid-cols-3 gap-2">
                {FREQUENCIES.map((f) => (
                  <button key={f.id} type="button" onClick={() => setFreq(f.id)} aria-pressed={freq === f.id}
                    className={`rounded-md border px-3 py-2 text-sm font-medium ${freq === f.id ? "border-eucalyptus-dark bg-eucalyptus-dark text-white" : "border-sandstone-dark/30 bg-white text-navy hover:bg-sandstone"}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="ps-payday" className="mb-1 block text-sm font-medium text-navy">Payday</label>
              <input id="ps-payday" type="date" min="2026-07-01" value={payday}
                onChange={(e) => setPaydayInput(e.target.value)}
                className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
            </div>
            <label className="flex cursor-pointer items-start gap-2 text-sm">
              <input type="checkbox" checked={firstContribution} onChange={(e) => setFirstContribution(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" />
              <span className="text-navy">First contribution for a new employee or to a new fund ({C.businessDaysNewEmployee} business days)</span>
            </label>
          </form>

          <div className="space-y-4" aria-live="polite">
            <div className="rounded-xl border border-sandstone-dark/20 bg-eucalyptus-light/30 p-6 text-center">
              <div className="mb-1 text-sm font-semibold uppercase tracking-wider text-eucalyptus-dark">Super each {freq === "weekly" ? "week" : freq === "fortnightly" ? "fortnight" : "month"}</div>
              <div className="text-4xl font-extrabold text-navy">{formatAUD(r.sgPerPay, 2)}</div>
              <div className="mt-2 text-sm text-warmgray">{RATE} of {formatAUD(r.qualifyingEarningsPerPay, 2)} qualifying earnings &times; {PAYS_PER_YEAR[freq]} pays = {formatAUD(r.sgAnnual, 2)} a year</div>
            </div>
            <div className="rounded-xl border border-sandstone-dark/20 bg-white p-5">
              <div className="flex items-start gap-3">
                <CalendarClock className="mt-0.5 h-5 w-5 flex-shrink-0 text-eucalyptus-dark" aria-hidden="true" />
                <div>
                  <div className="text-sm font-semibold text-navy">Must reach your fund by</div>
                  <div className="text-2xl font-bold text-navy">{due ? formatDateAU(due) : "Pick a payday"}</div>
                  <p className="mt-1 text-xs text-warmgray">
                    {days} business days after payday, counting weekends only. Add one day for each public holiday in that window that covers a whole state or territory, in any state or territory.
                  </p>
                </div>
              </div>
            </div>
            {r.aboveMaxContributionBase && (
              <p className="rounded-lg border border-ochre/40 bg-sandstone p-3 text-sm text-navy">
                Your salary is above the {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} annual maximum contribution base. Your employer only has to pay SG up to {formatAUD(SUPER_GUARANTEE.maxSGAnnual, 2)} for the year. Your per-pay amount may stop once your year-to-date qualifying earnings reach the base.
              </p>
            )}
            {paydayDate && paydayDate.getTime() < Date.UTC(2026, 6, 1) && (
              <p className="rounded-lg border border-ochre/40 bg-sandstone p-3 text-sm text-navy">
                Earnings paid before {SUPER_GUARANTEE.paydaySuperStart} fall under the old quarterly rules, not Payday Super.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
