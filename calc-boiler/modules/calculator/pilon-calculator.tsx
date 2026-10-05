"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SUPER_GUARANTEE, formatAUD, formatPercent } from "@/lib/constants";
import { paymentInLieu } from "@/lib/constants/notice-pilon";
import { CALC_FONT, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow } from "./t3-calc-shared";

// Notice weeks and payment in lieu of notice. All arithmetic is in
// lib/constants/notice-pilon.ts (tested): NES notice table from the Fair Work
// Ombudsman, ETP tax and super treatment from the ATO.

export default function PilonCalculator() {
  const [years, setYears] = useState(6);
  const [over45, setOver45] = useState(false);
  const [weekly, setWeekly] = useState(1_800);
  const [worked, setWorked] = useState(0);
  const [other, setOther] = useState(90_000);
  const [preservation, setPreservation] = useState(false);

  const full = useMemo(() => paymentInLieu({ yearsOfService: years, over45, weeklyPay: weekly }), [years, over45, weekly]);
  const paidWeeks = Math.max(0, full.noticeWeeks - worked);
  const r = useMemo(
    () => paymentInLieu({ yearsOfService: years, over45, weeklyPay: weekly, weeksPaidOut: paidWeeks, otherTaxableIncome: other, reachedPreservationAge: preservation }),
    [years, over45, weekly, paidWeeks, other, preservation],
  );

  return (
    <Card className="shadow-md not-prose" id="pilon-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>Notice Period and Payment in Lieu Calculator</h2>
        <p className="text-sm text-warmgray mb-6">Work out the minimum notice the National Employment Standards give you, what a payment in lieu of notice is worth, the super on it, and an estimate of the tax.</p>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 content-start">
            <NumberField id="pl-years" label="Years of continuous service" hint="On the day notice is given. Counts unpaid leave; casual service usually does not count." value={years} onChange={setYears} step={0.25} max={50} />
            <NumberField id="pl-weekly" label="Normal weekly pay ($)" hint="Include regular overtime, penalties, allowances and loadings." value={weekly} onChange={setWeekly} step={50} max={100000} />
            <NumberField id="pl-worked" label="Weeks of notice worked" hint="Zero if you are paid out in full on the day." value={worked} onChange={setWorked} step={0.5} max={5} />
            <NumberField id="pl-other" label="Other taxable income this year ($)" hint="Salary before the payment. Reduces the $180,000 whole-of-income cap." value={other} onChange={setOther} step={5000} max={2_000_000} />
            <label className="flex items-center gap-2 text-sm text-navy sm:col-span-2">
              <input type="checkbox" checked={over45} onChange={(e) => setOver45(e.target.checked)} className="h-4 w-4 rounded border-sandstone-dark/30" />
              The employee is over 45 years old when notice is given
            </label>
            <label className="flex items-center gap-2 text-sm text-navy sm:col-span-2">
              <input type="checkbox" checked={preservation} onChange={(e) => setPreservation(e.target.checked)} className="h-4 w-4 rounded border-sandstone-dark/30" />
              The employee has reached preservation age (60 if born after 30 June 1964)
            </label>
          </form>

          <div className="space-y-4">
            <dl className={RESULT_LIST}>
              <ResultRow label="Minimum NES notice" value={`${full.noticeWeeks} week${full.noticeWeeks === 1 ? "" : "s"}`} bold />
              <ResultRow label="Weeks paid in lieu" value={`${r.weeksPaidOut}`} />
              <ResultRow label="Payment in lieu (gross)" value={formatAUD(r.gross, 2)} bold />
              <ResultRow label={`Estimated ETP tax (${formatPercent(r.concessionalRate, 0)} to the cap, 47% above)`} value={`−${formatAUD(r.tax, 0)}`} muted />
              <ResultRow label="After tax" value={formatAUD(r.net, 0)} bold />
              <ResultRow label={`Employer super on top (${formatPercent(SUPER_GUARANTEE.rate, 0)})`} value={formatAUD(r.superGuarantee, 2)} muted />
            </dl>
            {r.weeksPaidOut === 0 ? (
              <p className={NOTE_OK} role="status" aria-live="polite">You are working the whole notice period, so no payment in lieu is due. You are paid normal wages through to your last day.</p>
            ) : r.taxedAtTop > 0 ? (
              <p className={NOTE_WARN} role="status" aria-live="polite">
                Part of this payment ({formatAUD(r.taxedAtTop, 0)}) is above the concessional cap ({formatAUD(r.concessionalCap, 0)} left under the lower of the ETP cap and the whole-of-income cap), so it is taxed at the top rate.
              </p>
            ) : (
              <p className={NOTE_OK} role="status" aria-live="polite">
                The payment is within the cap ({formatAUD(r.concessionalCap, 0)} available), so it is taxed at the concessional ETP rate of {formatPercent(r.concessionalRate, 0)}, including Medicare levy.
              </p>
            )}
            <p className="text-xs text-warmgray-light">
              Minimum notice from the National Employment Standards (Fair Work Act s 117). An award, agreement or contract can require longer notice. Payment in lieu must equal what you would have been paid by working the notice period. Tax is the ATO&rsquo;s employment termination payment treatment, estimated for a resident; this does not include unused leave, long service leave or redundancy pay.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
