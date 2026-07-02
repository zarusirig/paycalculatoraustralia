"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import {
  calculatePAYGWithholding,
  FREQUENCY_LABELS,
  type PayFrequency,
} from "@/lib/constants/payg-withholding";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const MAX_GROSS: Record<PayFrequency, number> = {
  weekly: 20_000,
  fortnightly: 40_000,
  monthly: 90_000,
};

interface LookupWidgetProps {
  frequency: PayFrequency;
  defaultGross: number;
}

/**
 * Interactive tax-table lookup: enter gross pay for the period and see the
 * PAYG withholding, STSL component, and take-home amount instantly.
 */
export default function TaxTableLookupWidget({ frequency, defaultGross }: LookupWidgetProps) {
  const [gross, setGross] = useState(defaultGross);
  const [claimsTFT, setClaimsTFT] = useState(true);
  const [hasSTSL, setHasSTSL] = useState(false);

  const result = useMemo(
    () => calculatePAYGWithholding(gross, frequency, { claimsTaxFreeThreshold: claimsTFT, hasSTSL }),
    [gross, frequency, claimsTFT, hasSTSL]
  );

  const periodLabel = FREQUENCY_LABELS[frequency];

  return (
    <Card className="shadow-md not-prose my-8">
      <CardContent className="p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label htmlFor="tax-table-gross" className="block text-sm font-medium text-navy mb-1">
                Gross pay per {periodLabel}
              </label>
              <div className="flex items-center">
                <span className="text-warmgray-light mr-2">$</span>
                <input
                  type="number"
                  id="tax-table-gross"
                  min={0}
                  max={MAX_GROSS[frequency]}
                  step={frequency === "monthly" ? 100 : 10}
                  value={gross}
                  onChange={(e) => setGross(clamp(Number(e.target.value || 0), 0, MAX_GROSS[frequency]))}
                  className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20"
                />
              </div>
              <input
                type="range"
                min={0}
                max={MAX_GROSS[frequency] / 4}
                step={frequency === "monthly" ? 250 : 50}
                value={clamp(gross, 0, MAX_GROSS[frequency] / 4)}
                onChange={(e) => setGross(Number(e.target.value))}
                className="mt-2 w-full accent-eucalyptus"
                aria-hidden="true"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={claimsTFT}
                onChange={(e) => setClaimsTFT(e.target.checked)}
                className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus"
              />
              <span className="text-navy">Claiming the tax-free threshold</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={hasSTSL}
                onChange={(e) => setHasSTSL(e.target.checked)}
                className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus"
              />
              <span className="text-navy">HECS-HELP / study loan (STSL)</span>
            </label>
            <p className="text-xs text-warmgray">
              FY2026-27 resident rates. Amounts are derived from the annualised ATO
              formulas and may differ from the printed ATO table by a few dollars.
            </p>
          </form>

          <Card className="bg-sandstone border-eucalyptus/30 border-2 shadow-sm" role="region" aria-live="polite">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-navy mb-4 capitalize">
                Your {frequency} withholding
              </h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-warmgray">Gross pay</span>
                  <span className="font-semibold text-navy">{formatAUD(gross, 2)}</span>
                </div>
                <div className="border-t border-sandstone-dark/20" />
                <div className="flex justify-between">
                  <span className="text-warmgray">PAYG withheld (incl. Medicare levy)</span>
                  <span className="text-navy">-{formatAUD(result.paygWithheld, 2)}</span>
                </div>
                {hasSTSL && (
                  <div className="flex justify-between">
                    <span className="text-warmgray">STSL component</span>
                    <span className="text-navy">-{formatAUD(result.stslWithheld, 2)}</span>
                  </div>
                )}
                <div className="border-t border-sandstone-dark/20" />
                <div className="flex justify-between text-base">
                  <span className="font-bold text-navy">Take-home per {periodLabel}</span>
                  <span className="font-bold text-eucalyptus-dark">{formatAUD(result.netPerPeriod, 2)}</span>
                </div>
                <p className="text-xs text-warmgray pt-2">
                  Annual equivalent: {formatAUD(result.annualEquivalent)} gross.{" "}
                  <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark underline hover:text-navy">
                    See the full annual breakdown
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
