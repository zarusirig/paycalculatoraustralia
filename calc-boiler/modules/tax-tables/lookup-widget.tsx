"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import {
  calculatePAYGWithholding,
  FREQUENCY_LABELS,
  PAYG_FINANCIAL_YEARS,
  PAYG_YEAR_INFO,
  type PayFrequency,
  type PaygFinancialYear,
} from "@/lib/constants/payg-withholding";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const MAX_GROSS: Record<PayFrequency, number> = {
  weekly: 20_000,
  fortnightly: 40_000,
  monthly: 90_000,
};

const NAT: Record<PayFrequency, string> = {
  weekly: "NAT 1005",
  fortnightly: "NAT 1006",
  monthly: "NAT 1007",
};

interface LookupWidgetProps {
  frequency: PayFrequency;
  defaultGross: number;
}

const toggleBase =
  "px-3 py-1.5 text-sm font-semibold rounded-md border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-eucalyptus/40";
const toggleOn = "bg-eucalyptus-dark text-white border-eucalyptus-dark";
const toggleOff = "bg-white text-navy border-sandstone-dark/30 hover:border-eucalyptus/50";

/**
 * Above-the-fold tax-table lookup: enter earnings for the pay period and read
 * the amount the ATO table says to withhold — both threshold columns, the
 * study-loan component, and either financial year the engine carries.
 */
export default function TaxTableLookupWidget({ frequency, defaultGross }: LookupWidgetProps) {
  const [gross, setGross] = useState(defaultGross);
  const [fy, setFy] = useState<PaygFinancialYear>(PAYG_FINANCIAL_YEARS[0]);
  const [claimsTFT, setClaimsTFT] = useState(true);
  const [hasSTSL, setHasSTSL] = useState(false);

  const stslAvailable = PAYG_YEAR_INFO[fy].stslSupported;
  const stslOn = hasSTSL && stslAvailable;

  const result = useMemo(
    () =>
      calculatePAYGWithholding(gross, frequency, {
        claimsTaxFreeThreshold: claimsTFT,
        hasSTSL: stslOn,
        financialYear: fy,
      }),
    [gross, frequency, claimsTFT, stslOn, fy]
  );
  const other = useMemo(
    () =>
      calculatePAYGWithholding(gross, frequency, {
        claimsTaxFreeThreshold: !claimsTFT,
        hasSTSL: stslOn,
        financialYear: fy,
      }),
    [gross, frequency, claimsTFT, stslOn, fy]
  );

  const periodLabel = FREQUENCY_LABELS[frequency];
  const inputId = `tax-table-gross-${frequency}`;

  return (
    <Card className="shadow-md not-prose border-eucalyptus/30 border-2">
      <CardContent className="p-5 md:p-7">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label htmlFor={inputId} className="block text-sm font-semibold text-navy mb-1">
                Enter your {periodLabel}ly earnings (before tax)
              </label>
              <div className="flex items-center">
                <span className="text-warmgray-light mr-2 text-lg">$</span>
                <input
                  type="number"
                  id={inputId}
                  inputMode="decimal"
                  min={0}
                  max={MAX_GROSS[frequency]}
                  step="any"
                  value={gross}
                  onChange={(e) => setGross(clamp(Number(e.target.value || 0), 0, MAX_GROSS[frequency]))}
                  className="block w-full rounded-md border-sandstone-dark/30 shadow-sm text-lg font-semibold focus:border-eucalyptus focus:ring-eucalyptus/20"
                />
              </div>
            </div>

            <fieldset>
              <legend className="block text-sm font-semibold text-navy mb-1.5">Tax-free threshold</legend>
              <div className="flex flex-wrap gap-2" role="group">
                <button type="button" aria-pressed={claimsTFT} onClick={() => setClaimsTFT(true)} className={`${toggleBase} ${claimsTFT ? toggleOn : toggleOff}`}>
                  Claimed
                </button>
                <button type="button" aria-pressed={!claimsTFT} onClick={() => setClaimsTFT(false)} className={`${toggleBase} ${!claimsTFT ? toggleOn : toggleOff}`}>
                  Not claimed
                </button>
              </div>
            </fieldset>

            <fieldset>
              <legend className="block text-sm font-semibold text-navy mb-1.5">Financial year</legend>
              <div className="flex flex-wrap gap-2" role="group">
                {PAYG_FINANCIAL_YEARS.map((y) => (
                  <button key={y} type="button" aria-pressed={fy === y} onClick={() => setFy(y)} className={`${toggleBase} ${fy === y ? toggleOn : toggleOff}`}>
                    {y}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className={`flex items-center gap-2 text-sm ${stslAvailable ? "cursor-pointer" : "opacity-60"}`}>
              <input
                type="checkbox"
                checked={stslOn}
                disabled={!stslAvailable}
                onChange={(e) => setHasSTSL(e.target.checked)}
                className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus"
              />
              <span className="text-navy">HECS-HELP / study loan (STSL)</span>
            </label>
            {!stslAvailable && (
              <p className="text-xs text-warmgray -mt-2">
                The ATO changed the {fy} study-loan formulas part-way through the year (24 September 2025), so this
                page shows the {fy} income-tax amount only.
              </p>
            )}
          </form>

          <div className="rounded-xl bg-sandstone p-5" role="region" aria-live="polite" aria-label="Tax withheld result">
            <p className="text-sm text-warmgray mb-1">
              Tax withheld from {formatAUD(gross, gross % 1 ? 2 : 0)} a {periodLabel} ({fy}, {NAT[frequency]})
            </p>
            <p className="text-4xl font-extrabold text-navy mb-4">{formatAUD(result.totalWithheld)}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-warmgray">PAYG income tax (incl. Medicare levy)</span>
                <span className="text-navy font-medium">{formatAUD(result.paygWithheld)}</span>
              </div>
              {stslOn && (
                <div className="flex justify-between gap-4">
                  <span className="text-warmgray">Study loan (STSL) component</span>
                  <span className="text-navy font-medium">{formatAUD(result.stslWithheld)}</span>
                </div>
              )}
              <div className="flex justify-between gap-4 border-t border-sandstone-dark/20 pt-2 text-base">
                <span className="font-bold text-navy">Take-home per {periodLabel}</span>
                <span className="font-bold text-eucalyptus-dark">{formatAUD(result.netPerPeriod, 2)}</span>
              </div>
              <div className="flex justify-between gap-4 text-warmgray">
                <span>{claimsTFT ? "If you did not claim the threshold" : "If you claimed the threshold"}</span>
                <span>{formatAUD(other.totalWithheld)}</span>
              </div>
            </div>
            <p className="text-xs text-warmgray pt-3">
              Same result as the ATO look-up table: cents are ignored and the Schedule 1 formula is applied
              exactly. Excludes tax offsets and Medicare levy adjustments claimed on a withholding declaration.{" "}
              <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark underline hover:text-navy">
                Full annual breakdown
              </Link>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
