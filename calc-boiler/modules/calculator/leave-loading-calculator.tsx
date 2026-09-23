"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import { LEAVE_LOADING_RULES, COMMON_LEAVE_LOADING, leaveLoading, type LoadingMethod } from "@/lib/constants/leave-loading";
import { MODERN_AWARDS } from "@/lib/constants/modern-awards";
import { RETAIL_AWARD, RETAIL_PENALTIES } from "@/lib/constants/hospitality-award";
import { SCHADS_AWARD, SCHADS_PENALTIES } from "@/lib/constants/schads-award";
import { calculateSchedule5MethodB } from "@/lib/constants/payg-withholding";
import { CALC_FONT, NOTE_OK, NumberField, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

// Leave pay + 17.5% loading, the award's "greater of" comparison, and the
// PAYG withheld if the loading is paid as a lump sum (Schedule 5 Method B(ii),
// the engine behind /schedule-5-tax-table/). Rules: LEAVE_LOADING_RULES.

const OTHER = "other";

/** Full-time weekend multipliers per award, read from the site's award constants. */
function weekendDefaults(code: string): { sat: number; sun: number } | null {
  if (code === RETAIL_AWARD.code) return { sat: RETAIL_PENALTIES.saturday, sun: RETAIL_PENALTIES.sunday };
  if (code === SCHADS_AWARD.code) return { sat: SCHADS_PENALTIES.saturday, sun: SCHADS_PENALTIES.sunday };
  const award = Object.values(MODERN_AWARDS).find((a) => a.meta.code === code);
  if (!award) return null;
  const sat = award.matrix.find((m) => /^Sat/.test(m.label));
  const sun = award.matrix.find((m) => /^Sun/.test(m.label));
  return sat && sun ? { sat: sat.fullTime, sun: sun.fullTime } : null;
}

const AWARD_OPTIONS = [
  ...LEAVE_LOADING_RULES.map((r) => ({ value: r.code, label: `${r.shortName} (${r.code})` })),
  { value: OTHER, label: "Enterprise agreement or contract with 17.5%" },
] as const;

const pct = (m: number) => `${Math.round(m * 100)}%`;

export default function LeaveLoadingCalculator() {
  const [code, setCode] = useState<string>(LEAVE_LOADING_RULES[0].code);
  const [shiftworker, setShiftworker] = useState<"day" | "shift">("day");
  const [hourly, setHourly] = useState(30);
  const [hours, setHours] = useState(38);
  const [weeks, setWeeks] = useState(4);
  const [satHours, setSatHours] = useState(0);
  const [sunHours, setSunHours] = useState(0);
  const [satPct, setSatPct] = useState(125);
  const [sunPct, setSunPct] = useState(150);
  const [shiftPremium, setShiftPremium] = useState(0);

  const rule = LEAVE_LOADING_RULES.find((r) => r.code === code);
  const method: LoadingMethod = rule ? (shiftworker === "shift" ? rule.shiftwork : rule.dayWork) : "flat";
  const compares = method !== "flat";

  const onAward = (next: string) => {
    setCode(next);
    const d = weekendDefaults(next);
    if (d) {
      setSatPct(Math.round(d.sat * 100));
      setSunPct(Math.round(d.sun * 100));
    }
  };

  const weeklyPremium = useMemo(
    () => satHours * hourly * Math.max(0, satPct / 100 - 1) + sunHours * hourly * Math.max(0, sunPct / 100 - 1) + (shiftworker === "shift" ? shiftPremium : 0),
    [satHours, sunHours, satPct, sunPct, hourly, shiftworker, shiftPremium],
  );

  const r = useMemo(
    () => leaveLoading({ hourlyRate: hourly, weeklyHours: hours, weeks, method, weeklyPenaltyPremium: weeklyPremium }),
    [hourly, hours, weeks, method, weeklyPremium],
  );

  const lumpSumTax = useMemo(() => {
    const fortnightly = hourly * hours * 2;
    if (fortnightly <= 0 || r.loadingPaid <= 0) return null;
    return calculateSchedule5MethodB(fortnightly, r.loadingPaid, "fortnightly");
  }, [hourly, hours, r.loadingPaid]);

  return (
    <Card className="shadow-md not-prose" id="leave-loading-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>Leave Loading Calculator</h2>
        <p className="text-sm text-warmgray mb-6">Works out your annual leave pay and 17.5% loading, and applies your award&rsquo;s &ldquo;whichever is higher&rdquo; test against the weekend or shift penalties you&rsquo;d normally earn.</p>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 content-start">
            <div className="sm:col-span-2">
              <SelectField id="ll-award" label="Your award or agreement" value={code} onChange={onAward} options={AWARD_OPTIONS} />
            </div>
            <SelectField
              id="ll-pattern"
              label="Had you not been on leave, you'd work"
              value={shiftworker}
              onChange={setShiftworker}
              options={[{ value: "day", label: "Day work" }, { value: "shift", label: "Shiftwork" }]}
            />
            <NumberField id="ll-rate" label="Base hourly rate" hint="Award or agreement ordinary rate." value={hourly} onChange={setHourly} step={0.01} />
            <NumberField id="ll-hours" label="Ordinary hours a week" value={hours} onChange={setHours} step={0.5} max={60} />
            <NumberField id="ll-weeks" label="Weeks of annual leave" hint="Taken, or paid out when you leave." value={weeks} onChange={setWeeks} step={0.2} />
            {compares && (
              <>
                <NumberField id="ll-sat" label="Saturday hours in a normal week" value={satHours} onChange={setSatHours} step={0.5} />
                <NumberField id="ll-satpct" label="Saturday rate (%)" value={satPct} onChange={setSatPct} step={5} />
                <NumberField id="ll-sun" label="Sunday hours in a normal week" value={sunHours} onChange={setSunHours} step={0.5} />
                <NumberField id="ll-sunpct" label="Sunday rate (%)" value={sunPct} onChange={setSunPct} step={5} />
                {shiftworker === "shift" && (
                  <div className="sm:col-span-2">
                    <NumberField id="ll-shift" label="Weekday shift loadings a week ($)" hint="Afternoon or night shift loading dollars above base." value={shiftPremium} onChange={setShiftPremium} step={10} />
                  </div>
                )}
              </>
            )}
          </form>

          <div className="space-y-4">
            <dl className={RESULT_LIST}>
              <ResultRow label="Leave pay at your base rate" value={formatAUD(r.basePay, 2)} />
              <ResultRow label={`${pct(COMMON_LEAVE_LOADING)} leave loading`} value={formatAUD(r.flatLoading, 2)} muted={r.paidAs === "penalty rates"} />
              {compares && <ResultRow label="Weekend / shift penalties you'd have earned" value={formatAUD(r.penaltyAlternative, 2)} muted={r.paidAs !== "penalty rates"} />}
              <ResultRow label="Loading paid" value={formatAUD(r.loadingPaid, 2)} bold />
              <ResultRow label="Total leave pay (before tax)" value={formatAUD(r.totalLeavePay, 2)} bold />
            </dl>
            <p className={NOTE_OK} role="status" aria-live="polite">
              {!compares
                ? `${rule ? `${rule.shortName} ${rule.clause}` : "A flat loading"}: 17.5% on top of your leave pay, with no comparison against penalty rates.`
                : r.paidAs === "penalty rates"
                  ? `Your weekend/shift penalties (${formatAUD(r.penaltyAlternative, 2)}) beat 17.5% (${formatAUD(r.flatLoading, 2)}), so ${rule?.clause ?? "the clause"} pays the penalties instead. Never both.`
                  : `17.5% (${formatAUD(r.flatLoading, 2)}) is higher than the penalties you'd have earned, so the 17.5% loading is paid.`}
            </p>
            {lumpSumTax && (
              <dl className="divide-y divide-sandstone-dark/20 rounded-xl border border-sandstone-dark/20 bg-white px-5 py-2">
                <ResultRow label="Tax withheld if the loading is paid as a lump sum" value={formatAUD(lumpSumTax.withheldFromAdditionalPayment)} />
                <ResultRow label="Loading in hand" value={formatAUD(lumpSumTax.netAdditionalPayment, 2)} bold />
              </dl>
            )}
            <p className="text-xs text-warmgray-light">
              Lump-sum withholding uses ATO Schedule 5 Method B(ii) on a fortnightly pay of {formatAUD(hourly * hours * 2, 2)}, with the tax-free threshold claimed. If the loading is paid with your leave, it is simply added to that pay&rsquo;s earnings. For leave paid out when you finish, see the <Link href="/final-pay-calculator/" className="underline">final pay calculator</Link>.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
