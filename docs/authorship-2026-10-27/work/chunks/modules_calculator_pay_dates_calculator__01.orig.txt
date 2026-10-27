"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import {
  FY_2026_27,
  extraPayWithholding,
  financialYear,
  isValidIso,
  payYearSummary,
  weekdayName,
  type PayCycle,
} from "@/lib/constants/pay-periods";
import { CALC_FONT, INPUT, LABEL, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

// Pay-date calendar: one known pay day + frequency → every pay day in the
// chosen financial year, the count (flagging 53-weekly / 27-fortnightly
// years), months with an extra pay, and the ATO's optional extra withholding.
// Maths in lib/constants/pay-periods.ts.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${weekdayName(iso).slice(0, 3)} ${d} ${MONTHS[m - 1]} ${y}`;
};

const CYCLES: readonly { value: PayCycle; label: string }[] = [
  { value: "fortnightly", label: "Fortnightly" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const YEARS = [2026, 2027, 2028].map((y) => ({ value: String(y), label: financialYear(y).label }));

export default function PayDatesCalculator() {
  const [cycle, setCycle] = useState<PayCycle>("fortnightly");
  const [anchor, setAnchor] = useState(FY_2026_27.start);
  const [fyStart, setFyStart] = useState("2026");
  const [gross, setGross] = useState(3_000);

  const valid = isValidIso(anchor);
  const fy = useMemo(() => financialYear(Number(fyStart)), [fyStart]);
  const summary = useMemo(() => (valid ? payYearSummary(anchor, cycle, fy) : null), [anchor, cycle, fy, valid]);

  const byMonth = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const d of summary?.payDates ?? []) {
      const key = d.slice(0, 7);
      m.set(key, [...(m.get(key) ?? []), d]);
    }
    return m;
  }, [summary]);
  const threePayMonths = [...byMonth.entries()].filter(([, v]) => v.length >= (cycle === "weekly" ? 5 : 3));

  const extra = cycle === "monthly" ? 0 : extraPayWithholding(cycle, gross);

  return (
    <Card className="shadow-md not-prose" id="pay-dates-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>Pay Date Calculator</h2>
        <p className="text-sm text-warmgray mb-6">Enter any one pay day (a past payslip date works) and how often you&rsquo;re paid. You&rsquo;ll get every pay day in the financial year and whether it has an extra pay.</p>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 gap-4 sm:grid-cols-2 content-start">
            <SelectField id="pd-cycle" label="Paid" value={cycle} onChange={setCycle} options={CYCLES} />
            <div>
              <label htmlFor="pd-anchor" className={LABEL}>A pay day</label>
              <input id="pd-anchor" type="date" value={anchor} onChange={(e) => setAnchor(e.target.value)} className={INPUT} />
            </div>
            <SelectField id="pd-fy" label="Financial year" value={fyStart} onChange={setFyStart} options={YEARS} />
            {cycle !== "monthly" && (
              <NumberField id="pd-gross" label={`Gross pay per ${cycle === "weekly" ? "week" : "fortnight"} ($)`} hint="Optional: for the ATO's extra withholding amount." value={gross} onChange={setGross} step={50} />
            )}
          </form>

          <div className="space-y-4">
            {!summary ? (
              <p className={NOTE_WARN}>Enter a valid date.</p>
            ) : (
              <>
                <dl className={RESULT_LIST}>
                  <ResultRow label={`Pay days in ${fy.label}`} value={String(summary.count)} bold />
                  <ResultRow label="Normal year" value={String(summary.standard)} muted />
                  <ResultRow label="First and last pay day" value={summary.count ? `${fmt(summary.payDates[0])} – ${fmt(summary.payDates[summary.count - 1])}` : "—"} muted />
                  {cycle !== "monthly" && (
                    <ResultRow label={cycle === "weekly" ? "Months with 5 pays" : "Months with 3 pays"} value={threePayMonths.map(([k]) => `${MONTHS[Number(k.slice(5)) - 1]} ${k.slice(0, 4)}`).join(", ") || "None"} muted />
                  )}
                </dl>
                <p className={summary.extraPayYear ? NOTE_WARN : NOTE_OK} role="status" aria-live="polite">
                  {summary.extraPayYear
                    ? `${fy.label} has ${summary.count} ${cycle} pay days on this cycle, one more than the tax tables assume. ${extra > 0 ? `If you want to avoid a tax bill, you can ask your employer to withhold an extra ${formatAUD(extra)} from each pay (ATO table).` : "At this pay the ATO table doesn't list an extra amount."}`
                    : cycle === "monthly"
                      ? "Monthly pay always has 12 pay days, so there is never an extra pay."
                      : `A normal year: ${summary.count} pay days, matching the tax tables.`}
                </p>
                <details className="rounded-xl border border-sandstone-dark/20 bg-white">
                  <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-navy">All {summary.count} pay dates in {fy.label}</summary>
                  <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 px-4 pb-4 text-sm text-navy tabular-nums">
                    {summary.payDates.map((d, i) => (
                      <li key={d} className="py-0.5"><span className="text-warmgray">{i + 1}.</span> {fmt(d)}</li>
                    ))}
                  </ol>
                </details>
                <p className="text-xs text-warmgray-light">
                  Dates follow your cycle exactly. If your employer moves a pay that falls on a weekend or public holiday, it can land in a different month, and a pay moved across 30 June lands in a different financial year. Check your per-pay tax with the <Link href="/fortnightly-pay-calculator/" className="underline">fortnightly</Link> or <Link href="/weekly-pay-calculator/" className="underline">weekly</Link> pay calculator.
                </p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
