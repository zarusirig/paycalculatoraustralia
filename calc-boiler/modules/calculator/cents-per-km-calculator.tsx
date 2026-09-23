"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import {
  CENTS_PER_KM_RATES,
  CPK_KM_CAP,
  CURRENT_CPK_YEAR,
  carAllowanceWithholding,
  centsPerKmDeduction,
} from "@/lib/constants/cents-per-km";
import { CALC_FONT, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

// Cents per km deduction and car allowance withholding. Arithmetic in
// lib/constants/cents-per-km.ts (tested against the ATO's own example).

const YEARS = Object.keys(CENTS_PER_KM_RATES);
const cents = (d: number) => `${Math.round(d * 100)}c`;

export default function CentsPerKmCalculator() {
  const [km, setKm] = useState(3_000);
  const [year, setYear] = useState(CURRENT_CPK_YEAR);
  const [allowanceRate, setAllowanceRate] = useState(0);
  const [purpose, setPurpose] = useState<"work" | "commute">("work");

  const deduction = useMemo(() => centsPerKmDeduction(km, year), [km, year]);
  const allowance = useMemo(
    () => (allowanceRate > 0 ? carAllowanceWithholding({ km, ratePerKm: allowanceRate / 100, deductibleTravel: purpose === "work", year }) : null),
    [km, allowanceRate, purpose, year],
  );
  const rate = CENTS_PER_KM_RATES[year];

  return (
    <Card className="shadow-md not-prose" id="cents-per-km-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>Cents per Kilometre Calculator</h2>
        <p className="text-sm text-warmgray mb-6">Your car expense deduction at the ATO rate, and, if your employer pays a car allowance per km, how much of it is paid tax-free and how much is withheld from.</p>
        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 content-start">
            <NumberField id="cpk-km" label="Work-related kilometres this year" hint="Per car. Home to work doesn't count as work travel." value={km} onChange={setKm} step={100} />
            <SelectField id="cpk-year" label="Income year" value={year} onChange={setYear} options={YEARS.map((y) => ({ value: y, label: `${y} (${cents(CENTS_PER_KM_RATES[y])}/km)` }))} />
            <NumberField id="cpk-allow" label="Car allowance your employer pays (cents per km)" hint="Leave at 0 if you don't get one." value={allowanceRate} onChange={setAllowanceRate} step={1} />
            <SelectField id="cpk-purpose" label="The allowance is for" value={purpose} onChange={setPurpose} options={[{ value: "work", label: "Work travel (deductible)" }, { value: "commute", label: "Home to work (not deductible)" }]} />
          </form>
          <div className="space-y-4">
            <dl className={RESULT_LIST}>
              <ResultRow label={`Kilometres you can claim (max ${CPK_KM_CAP.toLocaleString("en-AU")})`} value={Math.min(km, CPK_KM_CAP).toLocaleString("en-AU")} />
              <ResultRow label="ATO rate" value={`${cents(rate)} per km`} />
              <ResultRow label="Cents per km deduction" value={formatAUD(deduction, 2)} bold />
            </dl>
            {km > CPK_KM_CAP && <p className={NOTE_WARN}>Only {CPK_KM_CAP.toLocaleString("en-AU")} km per car can be claimed this way. For more, the logbook method may give a bigger deduction.</p>}
            {allowance && (
              <>
                <dl className="divide-y divide-sandstone-dark/20 rounded-xl border border-sandstone-dark/20 bg-white px-5 py-2">
                  <ResultRow label="Car allowance paid" value={formatAUD(allowance.allowance, 2)} />
                  <ResultRow label="Not withheld from" value={formatAUD(allowance.notWithheld, 2)} />
                  {allowance.fromExcessRate > 0 && <ResultRow label="Withheld from: rate above the ATO rate" value={formatAUD(allowance.fromExcessRate, 2)} muted />}
                  {allowance.fromExcessKm > 0 && <ResultRow label={`Withheld from: km over ${CPK_KM_CAP.toLocaleString("en-AU")}`} value={formatAUD(allowance.fromExcessKm, 2)} muted />}
                  <ResultRow label="Amount taxed through your pay" value={formatAUD(allowance.subjectToWithholding, 2)} bold />
                </dl>
                <p className={allowance.subjectToWithholding > 0 ? NOTE_WARN : NOTE_OK} role="status" aria-live="polite">
                  {allowance.reporting === "gross payments"
                    ? "A car allowance for home-to-work travel is treated like wages: added to your gross pay and taxed."
                    : allowance.subjectToWithholding > 0
                      ? "Tax is withheld only from the part above the ATO rate or beyond 5,000 km. The whole allowance is shown separately on your income statement."
                      : "Paid at or below the ATO rate for up to 5,000 km, so no tax is withheld. It's still income: it appears in the allowance box of your income statement."}
                </p>
              </>
            )}
            <p className="text-xs text-warmgray-light">
              The rate covers all car costs — fuel, registration, insurance, repairs and depreciation — so nothing is added on top. You need a record of how you worked out your kilometres, but no receipts.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
