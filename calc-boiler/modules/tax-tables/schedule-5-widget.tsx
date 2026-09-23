"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD, formatNegAUD, formatPercent } from "@/lib/constants";
import { calculateSchedule5MethodB, type PayFrequency } from "@/lib/constants/payg-withholding";
import { SCHEDULE_5_WITHHOLDING_LIMIT } from "./ato-schedules";

/**
 * The interactive bonus-withholding calculator on /schedule-5-tax-table/.
 * Split out so the rest of schedule-5-tax-table.tsx renders on the server.
 */

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** The ATO caps withholding on an additional payment at 47% of that payment. */
function withholdingLimitFor(additionalPayment: number): number {
  return Math.floor(additionalPayment * SCHEDULE_5_WITHHOLDING_LIMIT);
}

export default function Schedule5Widget() {
  const [regular, setRegular] = useState(2_000);
  const [bonus, setBonus] = useState(5_000);
  const [frequency, setFrequency] = useState<PayFrequency>("fortnightly");
  const [hasSTSL, setHasSTSL] = useState(false);

  const result = useMemo(
    () => calculateSchedule5MethodB(regular, bonus, frequency, { hasSTSL }),
    [regular, bonus, frequency, hasSTSL]
  );

  const limit = withholdingLimitFor(bonus);
  const exceedsLimit = result.withheldFromAdditionalPayment > limit;

  return (
    <Card className="shadow-md not-prose my-8">
      <CardContent className="p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label htmlFor="s5-frequency" className="block text-sm font-medium text-navy mb-1">Pay frequency</label>
              <select
                id="s5-frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as PayFrequency)}
                className="block w-full rounded-md border border-sandstone-dark/30 bg-white px-3 py-2 text-sm shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20"
              >
                <option value="weekly">Weekly</option>
                <option value="fortnightly">Fortnightly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label htmlFor="s5-regular" className="block text-sm font-medium text-navy mb-1">Regular gross pay per period</label>
              <div className="flex items-center">
                <span className="text-warmgray-light mr-2">$</span>
                <input
                  type="number" id="s5-regular" min={0} max={50_000} step={50} value={regular}
                  onChange={(e) => setRegular(clamp(Number(e.target.value || 0), 0, 50_000))}
                  className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20"
                />
              </div>
            </div>
            <div>
              <label htmlFor="s5-bonus" className="block text-sm font-medium text-navy mb-1">Bonus / back payment / commission</label>
              <div className="flex items-center">
                <span className="text-warmgray-light mr-2">$</span>
                <input
                  type="number" id="s5-bonus" min={0} max={500_000} step={100} value={bonus}
                  onChange={(e) => setBonus(clamp(Number(e.target.value || 0), 0, 500_000))}
                  className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20"
                />
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox" checked={hasSTSL} onChange={(e) => setHasSTSL(e.target.checked)}
                className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus"
              />
              <span className="text-navy">HECS-HELP / study loan (STSL)</span>
            </label>
            <p className="text-xs text-warmgray">
              Uses the ATO Schedule 5 apportionment arithmetic with FY2026-27 rates. Assumes the tax-free
              threshold is claimed and that pay is even across the year.
            </p>
          </form>

          <Card className="bg-sandstone border-eucalyptus/30 border-2 shadow-sm" role="region" aria-live="polite">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-navy mb-4">Withholding on your bonus</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-warmgray">Bonus amount</span>
                  <span className="font-semibold text-navy">{formatAUD(bonus, 2)}</span>
                </div>
                <div className="border-t border-sandstone-dark/20" />
                <div className="flex justify-between">
                  <span className="text-warmgray">Tax withheld (apportionment)</span>
                  <span className="text-navy">{formatNegAUD(result.withheldFromAdditionalPayment, 2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warmgray">Effective rate on bonus</span>
                  <span className="text-navy">{formatPercent(result.effectiveRate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warmgray">ATO withholding limit ({SCHEDULE_5_WITHHOLDING_LIMIT * 100}%)</span>
                  <span className="text-navy">{formatAUD(limit, 2)}</span>
                </div>
                <div className="border-t border-sandstone-dark/20" />
                <div className="flex justify-between text-base">
                  <span className="font-bold text-navy">Bonus in your pocket</span>
                  <span className="font-bold text-eucalyptus-dark">{formatAUD(result.netAdditionalPayment, 2)}</span>
                </div>
                {exceedsLimit && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" aria-hidden="true" />
                    <p className="text-xs text-navy">
                      The apportionment result is above the ATO&apos;s {SCHEDULE_5_WITHHOLDING_LIMIT * 100}% withholding
                      limit. Your employer must reduce the amount withheld from the additional payment to{" "}
                      <strong>{formatAUD(limit, 2)}</strong>, leaving <strong>{formatAUD(bonus - limit, 2)}</strong> in hand.
                    </p>
                  </div>
                )}
                <p className="text-xs text-warmgray pt-2">
                  Want the full breakdown including super?{" "}
                  <Link href="/bonus-tax-calculator/" className="text-eucalyptus-dark underline hover:text-navy">
                    Use the bonus tax calculator
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
