"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import { JUNIOR_BANDS } from "@/lib/constants/junior-rates";
import {
  basesFor,
  minimumWageTakeHome,
  type MwBasisKey,
  type MwEmployment,
  type MwStateSlug,
} from "@/lib/data/minimum-wage-state/calc";
import { CALC_FONT, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

// Take-home pay at the minimum wage, one instance per state page. All arithmetic
// lives in lib/data/minimum-wage-state/calc.ts (tested); tax comes from the same
// 2026-27 engine as /take-home-pay-calculator/.

const EMPLOYMENT_OPTIONS = [
  { value: "permanent", label: "Full-time or part-time" },
  { value: "casual", label: "Casual (25% loading)" },
] as const;

const AGE_OPTIONS = JUNIOR_BANDS.slice()
  .reverse()
  .map((b) => ({ value: b.age, label: b.age === "21 and over" ? "21 and over (adult rate)" : b.age === "Under 16" ? "Under 16" : `${b.age} years old` }));

const m = (n: number) => formatAUD(n, 2);

export default function MinimumWageStateCalculator({ state, stateName }: { state: MwStateSlug; stateName: string }) {
  const bases = useMemo(() => basesFor(state), [state]);
  const [basisKey, setBasisKey] = useState<MwBasisKey>("nmw");
  const [age, setAge] = useState("21 and over");
  const [employment, setEmployment] = useState<MwEmployment>("permanent");
  const [hours, setHours] = useState(38);

  const basis = bases.find((b) => b.key === basisKey) ?? bases[0];
  const r = useMemo(
    () => minimumWageTakeHome({ basis: basis.key, state, age, employment, hoursPerWeek: hours }),
    [basis.key, state, age, employment, hours],
  );
  const casual = employment === "casual";

  return (
    <Card className="not-prose shadow-md" id="calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="mb-1 text-xl font-semibold text-navy" style={CALC_FONT}>
          Take-home pay at the minimum wage in {stateName}
        </h2>
        <p className="mb-6 text-sm text-warmgray">
          Pick your hours and age to see what stays in your account after 2026-27 income tax and the Medicare levy.
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid content-start gap-4 sm:grid-cols-2">
            {bases.length > 1 && (
              <div className="sm:col-span-2">
                <SelectField
                  id="mw-basis"
                  label="Which minimum wage"
                  value={basisKey}
                  onChange={setBasisKey}
                  options={bases.map((b) => ({ value: b.key, label: b.label }))}
                  hint={basis.note}
                />
              </div>
            )}
            <div className="sm:col-span-2">
              <SelectField id="mw-employment" label="Employment type" value={employment} onChange={setEmployment} options={EMPLOYMENT_OPTIONS} />
            </div>
            {!basis.adultOnly && (
              <SelectField
                id="mw-age"
                label="Age"
                value={age}
                onChange={setAge}
                options={AGE_OPTIONS}
                hint="No award? Under-21s get a percentage of the adult rate."
              />
            )}
            <NumberField id="mw-hours" label="Hours a week" hint="A full-time week is 38." value={hours} onChange={setHours} step={0.5} max={80} />
          </form>

          <div className="space-y-4">
            <dl className={RESULT_LIST} aria-live="polite">
              <ResultRow label={casual ? "Casual hourly rate" : "Hourly rate"} value={m(r.hourly)} />
              <ResultRow label="Weekly before tax" value={m(r.weeklyGross)} />
              <ResultRow label="Annual before tax (52 weeks)" value={formatAUD(r.annualGross)} muted />
              <ResultRow label="Income tax" value={`−${formatAUD(r.incomeTax)}`} muted />
              <ResultRow label="Medicare levy" value={`−${formatAUD(r.medicareLevy)}`} muted />
              <ResultRow label="Take-home each week" value={m(r.weeklyNet)} bold />
              <ResultRow label="Take-home each fortnight" value={m(r.fortnightlyNet)} />
              <ResultRow label="Take-home each year" value={formatAUD(r.annualNet)} />
              <ResultRow label="Employer super on top (12%)" value={formatAUD(r.superAnnual)} muted />
            </dl>

            {casual ? (
              <p className={NOTE_WARN} role="status">
                Casuals get the 25% loading instead of paid leave, so there is no paid public holiday and no long service leave accrual shown. In {stateName}, check whether your state long service leave law covers casuals on the long service leave page.
              </p>
            ) : (
              <p className={NOTE_OK} role="status">
                In {stateName}, a year of service at this pay accrues {r.lslWeeksPerYear.toFixed(2)} weeks of long service leave, worth about {m(r.lslValuePerYear)}. One paid public holiday off on a normal working day is worth {m(r.publicHolidayDayPay)}.
              </p>
            )}
            <p className="text-xs text-warmgray-light">
              Resident claiming the tax-free threshold, no HECS-HELP debt. Under-21 rates use the national junior table; an award may differ. Estimate only.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
