"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import { FTL_RULES, ftlPenalty } from "@/lib/constants/late-lodgement";
import { formatIso, weekdayOf } from "@/lib/constants/tax-calendar-2026-27";
import { CALC_FONT, INPUT, LABEL, NOTE_OK, NOTE_WARN, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

// Failure-to-lodge penalty for an individual. All arithmetic is in
// lib/constants/late-lodgement.ts (tested); sources are cited there.

const RETURNS = [
  { value: "2026-10-31", label: "2025-26 return (due 31 October 2026)" },
  { value: "2025-10-31", label: "2024-25 return (due 31 October 2025)" },
] as const;

type ReturnValue = (typeof RETURNS)[number]["value"];

export default function LateTaxReturnPenaltyCalculator() {
  const [due, setDue] = useState<ReturnValue>("2026-10-31");
  const [lodged, setLodged] = useState("2026-12-15");
  const [refund, setRefund] = useState(false);

  const valid = /^\d{4}-\d{2}-\d{2}$/.test(lodged);
  const r = useMemo(() => (valid ? ftlPenalty({ dueIso: due, lodgedIso: lodged }) : null), [due, lodged, valid]);

  return (
    <Card className="shadow-md not-prose" id="late-lodgement-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>Failure-to-Lodge Penalty Calculator</h2>
        <p className="text-sm text-warmgray mb-6">
          Pick the return and the date you lodge (or plan to). The calculator counts the days after the due date, then charges one penalty unit for every {FTL_RULES.daysPerUnit} days or part of that, up to {FTL_RULES.maxUnits} units.
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 content-start">
            <SelectField id="ftl-return" label="Which return?" value={due} onChange={setDue} options={RETURNS} />
            <div>
              <label htmlFor="ftl-lodged" className={LABEL}>Date you lodge</label>
              <input id="ftl-lodged" type="date" value={lodged} onChange={(e) => setLodged(e.target.value)} className={INPUT} />
              <p className="mt-1 text-xs text-warmgray">Today&rsquo;s date works if you are lodging now.</p>
            </div>
            <label className="flex items-start gap-3 text-sm text-navy">
              <input type="checkbox" checked={refund} onChange={(e) => setRefund(e.target.checked)} className="mt-1 h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus focus:ring-eucalyptus/20" />
              <span>I expect a refund or a nil result (no tax to pay)</span>
            </label>
          </form>

          <div className="space-y-4" role="status" aria-live="polite">
            {!r ? (
              <p className={NOTE_WARN}>Enter the date you lodge to see the penalty.</p>
            ) : (
              <>
                <dl className={RESULT_LIST}>
                  <ResultRow label="Effective due date" value={`${weekdayOf(r.effectiveDueIso).slice(0, 3)} ${formatIso(r.effectiveDueIso)}`} />
                  <ResultRow label="Days overdue" value={String(r.daysOverdue)} />
                  <ResultRow label="Penalty units" value={`${r.units} of ${FTL_RULES.maxUnits}`} />
                  <ResultRow label="Value of a penalty unit" value={r.unitAmount === null ? "Not covered" : formatAUD(r.unitAmount)} muted />
                  <ResultRow label="Maximum the ATO can charge" value={r.penalty === null ? "Check the ATO" : formatAUD(r.penalty)} bold />
                </dl>
                {r.penalty === null ? (
                  <p className={NOTE_WARN}>This calculator covers due dates from 7 November 2024. For an older return, check the penalty unit on the ATO&rsquo;s penalty units page.</p>
                ) : r.daysOverdue === 0 ? (
                  <p className={NOTE_OK}>Lodged on or before the due date, so no failure-to-lodge penalty.</p>
                ) : refund ? (
                  <p className={NOTE_OK}>
                    The ATO says it generally will not issue a penalty notice for a late return that results in a refund or a nil result, unless it applied the penalty before you lodged. So the likely charge is <strong>$0</strong>, but the figure above is the most it can be if it does.
                  </p>
                ) : (
                  <p className={NOTE_WARN}>
                    {r.atMaximum
                      ? `You are past the point where the penalty stops growing (${formatIso(r.maximumReachedIso)}). The penalty cannot grow further, but lodging still matters: until you do, any refund waits and any tax owing is not assessed.`
                      : `Each extra ${FTL_RULES.daysPerUnit} days adds another unit until the maximum is reached on ${formatIso(r.maximumReachedIso)}. Lodging sooner caps the cost.`}
                  </p>
                )}
              </>
            )}
            <p className="text-xs text-warmgray-light">
              The ATO usually warns you by phone or letter before it applies a penalty, and can remit all or part of it. This is the maximum for an individual; it is not a bill. General information, not advice.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
