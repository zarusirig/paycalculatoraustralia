"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import { COMPASSIONATE_LEAVE, compassionateLeavePay, type CompassionateEmployment } from "@/lib/constants/compassionate-leave";
import { CALC_FONT, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

// Compassionate leave pay (G3, wave 4). Arithmetic in
// lib/constants/compassionate-leave.ts (tested): base rate × ordinary hours
// you would have worked, up to 2 days per occasion; casuals unpaid.

const EMPLOYMENT_OPTIONS = [
  { value: "permanent", label: "Full-time or part-time" },
  { value: "casual", label: "Casual" },
] as const;

const DAY_OPTIONS = [
  { value: "2", label: "2 days" },
  { value: "1", label: "1 day" },
] as const;

export default function CompassionateLeaveCalculator() {
  const [employment, setEmployment] = useState<CompassionateEmployment>("permanent");
  const [rate, setRate] = useState(32);
  const [hoursPerDay, setHoursPerDay] = useState(7.6);
  const [days, setDays] = useState<"1" | "2">("2");

  const pay = useMemo(() => compassionateLeavePay(employment, rate, hoursPerDay, Number(days)), [employment, rate, hoursPerDay, days]);
  const casual = employment === "casual";

  return (
    <Card className="shadow-md not-prose" id="compassionate-leave-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>Compassionate Leave Pay Calculator</h2>
        <p className="text-sm text-warmgray mb-6">What your employer must pay for compassionate or bereavement leave under the National Employment Standards.</p>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 content-start">
            <div className="sm:col-span-2">
              <SelectField id="cl-type" label="Employment type" value={employment} onChange={setEmployment} options={EMPLOYMENT_OPTIONS} />
            </div>
            <NumberField id="cl-rate" label="Base hourly rate" hint="Without penalties, loadings or allowances." value={rate} onChange={setRate} step={0.01} />
            <NumberField id="cl-hours" label="Ordinary hours you'd have worked each day" hint="Your rostered hours, not overtime." value={hoursPerDay} onChange={setHoursPerDay} step={0.25} max={24} />
            <div className="sm:col-span-2">
              <SelectField id="cl-days" label="Days taken for this occasion" value={days} onChange={setDays} options={DAY_OPTIONS} />
            </div>
          </form>

          <div className="space-y-4">
            <dl className={RESULT_LIST}>
              <ResultRow label="Entitlement this occasion" value={`${COMPASSIONATE_LEAVE.daysPerOccasion} days`} />
              <ResultRow label={casual ? "Paid (casual: unpaid leave)" : "Compassionate leave pay, before tax"} value={formatAUD(pay, 2)} bold />
              {!casual && <ResultRow label="Worked out as" value={`${formatAUD(rate, 2)} × ${hoursPerDay} h × ${days}`} muted />}
            </dl>
            <p className={casual ? NOTE_WARN : NOTE_OK} role="status" aria-live="polite">
              {casual
                ? "Casual employees can take the same 2 days of compassionate leave each occasion, but it is unpaid under the NES. It is still a legal entitlement, not a favour."
                : "Paid at your base rate for the ordinary hours you would have worked. It isn't taken from your sick or annual leave, and a fresh 2 days applies to each new death, life-threatening illness or injury, stillbirth or miscarriage."}
            </p>
            <p className="text-xs text-warmgray-light">
              National Employment Standards minimum (Fair Work Act ss 104–106). Awards and enterprise agreements can provide additional compassionate leave entitlements.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
