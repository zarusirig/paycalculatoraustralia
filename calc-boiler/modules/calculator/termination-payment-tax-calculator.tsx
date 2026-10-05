"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD, formatPercent } from "@/lib/constants";
import { REDUNDANCY_TAX } from "@/lib/constants/redundancy";
import { WHOLE_OF_INCOME_CAP, terminationTax, type TerminationKind } from "@/lib/constants/termination-tax";
import { CALC_FONT, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

// Tax on a termination payment. All arithmetic is in
// lib/constants/termination-tax.ts and redundancy.ts (tested); sources are
// cited there.

const KINDS = [
  { value: "genuine-redundancy", label: "Genuine redundancy payment" },
  { value: "other-etp", label: "Other termination payment (golden handshake, severance, non-genuine redundancy)" },
] as const;

export default function TerminationPaymentTaxCalculator() {
  const [kind, setKind] = useState<TerminationKind>("genuine-redundancy");
  const [payment, setPayment] = useState(60_000);
  const [years, setYears] = useState(6);
  const [age, setAge] = useState(45);
  const [ageOut, setAgeOut] = useState(45);
  const [other, setOther] = useState(40_000);

  const genuineInput = kind === "genuine-redundancy";
  const r = useMemo(
    () =>
      terminationTax({
        kind,
        payment,
        completedYears: years,
        ageAtEndOfIncomeYear: age,
        ageAtDismissal: kind === "genuine-redundancy" ? ageOut : age,
        otherTaxableIncome: other,
      }),
    [kind, payment, years, age, ageOut, other],
  );

  return (
    <Card className="shadow-md not-prose" id="termination-tax-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>Termination Payment Tax Calculator</h2>
        <p className="text-sm text-warmgray mb-6">
          Enter only the termination payment itself. Leave out salary owed for work you have done and payouts of unused annual or long service leave, which are not employment termination payments. Figures are for payments made in {REDUNDANCY_TAX.incomeYear}.
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 content-start">
            <div className="sm:col-span-2">
              <SelectField id="tt-kind" label="Type of payment" value={kind} onChange={setKind} options={KINDS} />
            </div>
            <NumberField id="tt-payment" label="Termination payment" value={payment} onChange={setPayment} step={1000} />
            {genuineInput ? (
              <NumberField id="tt-years" label="Completed years of service" hint="Part years do not count." value={years} onChange={setYears} max={60} />
            ) : null}
            <NumberField id="tt-age" label="Your age at 30 June 2027" hint="Turning 60 by 30 June 2027 means the lower tax rate." value={age} onChange={setAge} max={100} />
            {genuineInput ? (
              <NumberField id="tt-age-out" label="Your age when dismissed" hint="A genuine redundancy needs this to be under 67." value={ageOut} onChange={setAgeOut} max={100} />
            ) : null}
            {!genuineInput ? (
              <NumberField id="tt-other" label="Other taxable income this financial year" hint="Salary before you left, accrued leave paid out, interest. Not super or salary sacrifice." value={other} onChange={setOther} step={1000} />
            ) : null}
          </form>

          <div className="space-y-4" role="status" aria-live="polite">
            <dl className={RESULT_LIST}>
              <ResultRow label="Payment" value={formatAUD(payment)} muted />
              {r.genuine ? <ResultRow label={`Tax-free limit (${formatAUD(REDUNDANCY_TAX.taxFreeBase)} + ${formatAUD(REDUNDANCY_TAX.taxFreePerYear)} × ${Math.floor(years)})`} value={formatAUD(r.taxFreeLimit)} muted /> : null}
              <ResultRow label="Tax-free part" value={formatAUD(r.taxFree)} />
              <ResultRow label="Taxable (ETP)" value={formatAUD(r.etpTaxable)} />
              <ResultRow label={`Taxed at ${formatPercent(r.rateWithinCap, 0)} up to`} value={formatAUD(r.capApplied)} muted />
              {r.aboveCap > 0 ? <ResultRow label={`Above the cap, taxed at 47%`} value={formatAUD(r.aboveCap)} /> : null}
              <ResultRow label="Tax withheld" value={formatAUD(r.tax)} bold />
              <ResultRow label="You receive" value={formatAUD(r.net)} bold />
              <ResultRow label="Effective tax rate" value={formatPercent(r.effectiveRate, 1)} muted />
            </dl>
            {r.downgradedReason ? <p className={NOTE_WARN}>{r.downgradedReason}</p> : null}
            {r.capBinding === "whole-of-income-cap" ? (
              <p className={NOTE_WARN}>
                Your other income cuts the {formatAUD(WHOLE_OF_INCOME_CAP)} whole-of-income cap to {formatAUD(r.wholeOfIncomeCapRemaining ?? 0)}, so {formatAUD(r.aboveCap)} is taxed at the top rate of 47%.
              </p>
            ) : r.tax === 0 && payment > 0 ? (
              <p className={NOTE_OK}>The whole payment is within the genuine redundancy tax-free limit, so no tax is withheld on it.</p>
            ) : (
              <p className={NOTE_OK}>
                {r.genuine
                  ? `Only the part above the tax-free limit is taxed, and it is tested against the ${formatAUD(r.etpCap)} ETP cap alone.`
                  : `This payment is tested against the lesser of the ${formatAUD(r.etpCap)} ETP cap and your ${formatAUD(WHOLE_OF_INCOME_CAP)} whole-of-income cap less other income.`}
              </p>
            )}
            <p className="text-xs text-warmgray-light">
              Rates include the 2% Medicare levy as the ATO quotes them. Your final tax is set when your return is assessed. Not modelled: tax-free amounts for pre-1983 service, earlier termination payments in the same year, death benefits. General information, not advice.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
