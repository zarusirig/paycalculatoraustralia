"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import { JURY_DUTY_PAID_DAYS, juryDutyPay, type CourtEvidence, type JuryEmployment } from "@/lib/constants/jury-duty";
import { CALC_FONT, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

// Jury duty make-up pay (G3, wave 4). Arithmetic: lib/constants/jury-duty.ts,
// tested against the Fair Work Ombudsman's Julie and Samuel examples.

const EMPLOYMENT_OPTIONS = [
  { value: "permanent", label: "Full-time or part-time" },
  { value: "casual", label: "Casual" },
] as const;

const EVIDENCE_OPTIONS = [
  { value: "requested-given", label: "Yes, and I gave it (make-up pay)" },
  { value: "not-requested", label: "No, they didn't ask" },
  { value: "requested-not-given", label: "Yes, but I didn't give it" },
] as const;

export default function JuryDutyPayCalculator() {
  const [employment, setEmployment] = useState<JuryEmployment>("permanent");
  const [base, setBase] = useState(250);
  const [court, setCourt] = useState(90);
  const [juryDays, setJuryDays] = useState(5);
  const [missed, setMissed] = useState(5);
  const [evidence, setEvidence] = useState<CourtEvidence>("requested-given");

  const r = useMemo(
    () => juryDutyPay({ employment, baseDailyPay: base, courtPerDay: court, juryDays, workdaysMissed: missed, evidence }),
    [employment, base, court, juryDays, missed, evidence],
  );
  const shortfall = Math.max(0, r.normalPay - r.total);

  return (
    <Card className="shadow-md not-prose" id="jury-duty-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>Jury Duty Pay Calculator</h2>
        <p className="text-sm text-warmgray mb-6">What your employer and the court pay while you are on a jury, under the National Employment Standards.</p>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 content-start">
            <div className="sm:col-span-2">
              <SelectField id="jd-type" label="Employment type" value={employment} onChange={setEmployment} options={EMPLOYMENT_OPTIONS} />
            </div>
            <NumberField id="jd-base" label="Your base pay for a normal workday" hint="Base rate × ordinary hours, no penalties." value={base} onChange={setBase} step={1} />
            <NumberField id="jd-court" label="Court payment per day" hint="From your summons or court. Leave out travel or meal allowances." value={court} onChange={setCourt} step={1} />
            <NumberField id="jd-days" label="Days of jury service" value={juryDays} onChange={setJuryDays} max={200} />
            <NumberField id="jd-missed" label="Workdays you miss" hint="Days you would normally have worked." value={missed} onChange={setMissed} max={200} />
            {employment === "permanent" && (
              <div className="sm:col-span-2">
                <SelectField id="jd-evidence" label="Did your employer ask for proof of the court payment?" value={evidence} onChange={setEvidence} options={EVIDENCE_OPTIONS} />
              </div>
            )}
          </form>

          <div className="space-y-4">
            <dl className={RESULT_LIST}>
              <ResultRow label={`Employer pays (${r.employerPaidDays} day${r.employerPaidDays === 1 ? "" : "s"} × ${formatAUD(r.employerPerDay, 2)})`} value={formatAUD(r.employerTotal, 2)} />
              <ResultRow label={`Court pays (${juryDays} day${juryDays === 1 ? "" : "s"} × ${formatAUD(court, 2)})`} value={formatAUD(r.courtTotal, 2)} />
              <ResultRow label="Total while on the jury" value={formatAUD(r.total, 2)} bold />
              <ResultRow label="Your normal pay for the missed days" value={formatAUD(r.normalPay, 2)} muted />
              {shortfall > 0 && <ResultRow label="Less than normal pay by" value={formatAUD(shortfall, 2)} muted />}
            </dl>
            <p className={employment === "casual" || evidence === "requested-not-given" || missed > JURY_DUTY_PAID_DAYS ? NOTE_WARN : NOTE_OK} role="status" aria-live="polite">
              {employment === "casual"
                ? "Casuals aren't paid by their employer for jury duty under the NES. Check your award, agreement or contract, and your state's jury law, which may pay more."
                : evidence === "requested-not-given"
                  ? "If your employer asks for evidence of the court payment and you don't give it, you aren't entitled to employer pay for the first 10 days."
                  : missed > JURY_DUTY_PAID_DAYS
                    ? `The NES only requires employer pay for the first ${JURY_DUTY_PAID_DAYS} days you are absent from work. After that, only the court pays, unless your award, agreement, contract or state law says otherwise.`
                    : evidence === "requested-given"
                      ? "Make-up pay tops the court payment up to your base pay for the ordinary hours you would have worked."
                      : "Your employer didn't ask for proof of the court payment, so it pays your full base pay for up to 10 days."}
            </p>
            <p className="text-xs text-warmgray-light">National Employment Standards (Fair Work Act ss 108–112). State and territory jury laws, awards and agreements can be more generous.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
