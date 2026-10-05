"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD, formatNegAUD } from "@/lib/constants";
import { MAX_COMBINED_GAIN, RATE_2027_28, WATO, compareTakeHome } from "@/lib/constants/tax-2027-28";
import { CALC_FONT, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow } from "./t3-calc-shared";

// 2027-28 vs 2026-27 take-home on the same salary. All arithmetic is in
// lib/constants/tax-2027-28.ts (tested); sources are cited there.

export default function WorkingAustraliansTaxOffsetCalculator() {
  const [salary, setSalary] = useState(85_000);
  const c = useMemo(() => compareTakeHome(salary), [salary]);
  const a = c.y2026_27;
  const b = c.y2027_28;

  return (
    <Card className="shadow-md not-prose" id="wato-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>2027-28 Take-Home Pay vs 2026-27</h2>
        <p className="text-sm text-warmgray mb-6">
          Enter your annual salary before tax. The same salary is run through the 2026-27 law (15% rate, no offset) and the 2027-28 law ({Math.round(RATE_2027_28 * 100)}% rate plus the {formatAUD(WATO.maxOffset)} Working Australians Tax Offset).
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 content-start">
            <NumberField id="wato-salary" label="Annual salary (before tax)" hint="Treated as labour income, with no deductions, HECS or salary sacrifice." value={salary} onChange={setSalary} step={1000} />
          </form>

          <div className="space-y-4" role="status" aria-live="polite">
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 bg-sandstone/40">
              <table className="w-full text-sm">
                <caption className="sr-only">Tax and take-home pay on {formatAUD(c.salary)}, 2026-27 against 2027-28</caption>
                <thead>
                  <tr className="text-left text-navy">
                    <th scope="col" className="px-4 py-2 font-semibold"> </th>
                    <th scope="col" className="px-4 py-2 font-semibold text-right">2026-27</th>
                    <th scope="col" className="px-4 py-2 font-semibold text-right">2027-28</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/20 text-navy tabular-nums">
                  <tr><th scope="row" className="px-4 py-2 text-left font-normal">Income tax before offsets</th><td className="px-4 py-2 text-right">{formatAUD(a.taxBeforeOffsets)}</td><td className="px-4 py-2 text-right">{formatAUD(b.taxBeforeOffsets)}</td></tr>
                  <tr><th scope="row" className="px-4 py-2 text-left font-normal">Low income tax offset</th><td className="px-4 py-2 text-right">{formatNegAUD(a.lito)}</td><td className="px-4 py-2 text-right">{formatNegAUD(b.lito)}</td></tr>
                  <tr><th scope="row" className="px-4 py-2 text-left font-normal">Working Australians Tax Offset</th><td className="px-4 py-2 text-right text-warmgray">n/a</td><td className="px-4 py-2 text-right">{formatNegAUD(b.wato)}</td></tr>
                  <tr><th scope="row" className="px-4 py-2 text-left font-normal">Medicare levy</th><td className="px-4 py-2 text-right">{formatAUD(a.medicare)}</td><td className="px-4 py-2 text-right">{formatAUD(b.medicare)}</td></tr>
                  <tr className="font-bold"><th scope="row" className="px-4 py-2 text-left">Take-home pay a year</th><td className="px-4 py-2 text-right">{formatAUD(a.takeHome)}</td><td className="px-4 py-2 text-right">{formatAUD(b.takeHome)}</td></tr>
                  <tr className="text-warmgray"><th scope="row" className="px-4 py-2 text-left font-normal">Per fortnight</th><td className="px-4 py-2 text-right">{formatAUD(a.takeHome / 26)}</td><td className="px-4 py-2 text-right">{formatAUD(b.takeHome / 26)}</td></tr>
                </tbody>
              </table>
            </div>
            <dl className={RESULT_LIST}>
              <ResultRow label="From the 15% to 14% rate cut" value={formatAUD(c.fromRateCut)} />
              <ResultRow label="From the Working Australians Tax Offset" value={formatAUD(c.fromWato)} />
              <ResultRow label="Better off in 2027-28" value={`${formatAUD(c.gainPerYear)} a year`} bold />
            </dl>
            {c.gainPerYear >= MAX_COMBINED_GAIN ? (
              <p className={NOTE_OK}>You get the maximum: {formatAUD(MAX_COMBINED_GAIN)} a year, {formatAUD(MAX_COMBINED_GAIN / 26, 2)} a fortnight.</p>
            ) : c.gainPerYear > 0 ? (
              <p className={NOTE_OK}>Below $45,000 the rate cut is 1 cent for every dollar of income above $18,200, so you get less than the maximum.</p>
            ) : (
              <p className={NOTE_WARN}>No change at this income: the offset needs net labour income above the $18,200 tax-free threshold and some tax payable.</p>
            )}
            <p className="text-xs text-warmgray-light">
              Assumes the same salary, all labour income, and 2026-27 settings for LITO and the Medicare levy. Your actual result depends on your deductions and other income. General information, not advice.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
