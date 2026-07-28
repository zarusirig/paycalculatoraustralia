"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import {
  SAPTO_BANDS,
  SAPTO_INCOME_YEAR,
  SAPTO_REDUCTION_RATE,
  calculateSAPTO,
  type SaptoStatus,
} from "@/lib/constants/sapto";

const STATUS_ORDER: SaptoStatus[] = ["single", "couple", "illnessSeparated"];

const STATUS_HINTS: Record<SaptoStatus, string> = {
  single: "You did not have a spouse at any point in the income year.",
  couple: "You and your spouse lived together.",
  illnessSeparated:
    "You lived apart because one of you has a continuing illness, or one of you is in a nursing home.",
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));
}

function Row({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className={muted ? "text-warmgray-light" : "text-warmgray"}>{label}</span>
      <span className={`tabular-nums ${bold ? "font-bold text-navy" : "text-navy"}`}>{value}</span>
    </div>
  );
}

export default function SaptoCalculator() {
  const [status, setStatus] = useState<SaptoStatus>("single");
  const [rebateIncome, setRebateIncome] = useState(35_000);
  const [spouseRebateIncome, setSpouseRebateIncome] = useState(25_000);
  const [eligibleForPension, setEligibleForPension] = useState(true);

  const result = useMemo(
    () =>
      calculateSAPTO({ status, rebateIncome, spouseRebateIncome, eligibleForPension }),
    [status, rebateIncome, spouseRebateIncome, eligibleForPension],
  );

  const band = SAPTO_BANDS[status];
  const isCouple = status !== "single";
  const inputClass =
    "block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm";

  return (
    <Card className="shadow-md not-prose">
      <CardContent className="p-6 md:p-8">
        <h2
          className="text-xl font-semibold text-navy mb-1"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          SAPTO Calculator
        </h2>
        <p className="text-sm text-warmgray mb-6">
          Works out your seniors and pensioners tax offset for the {SAPTO_INCOME_YEAR} income year,
          using the ATO&rsquo;s published rates and thresholds. Claim it at the tax offsets section
          of your return.
        </p>

        <div className="grid md:grid-cols-[1fr_1fr] gap-8">
          {/* Inputs */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div>
              <label htmlFor="sapto-status" className="block text-sm font-medium text-navy mb-1">
                Your situation
              </label>
              <select
                id="sapto-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as SaptoStatus)}
                className={inputClass}
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {SAPTO_BANDS[s].label} — up to {formatAUD(SAPTO_BANDS[s].maxOffset)}
                  </option>
                ))}
              </select>
              <p className="text-xs text-warmgray-light mt-1">{STATUS_HINTS[status]}</p>
            </div>

            <div>
              <label htmlFor="sapto-income" className="block text-sm font-medium text-navy mb-1">
                Your rebate income
              </label>
              <div className="flex items-center">
                <span className="text-warmgray-light mr-2">$</span>
                <input
                  type="number"
                  id="sapto-income"
                  min={0}
                  max={300_000}
                  step={100}
                  value={rebateIncome}
                  onChange={(e) => setRebateIncome(clamp(Number(e.target.value || 0), 0, 300_000))}
                  className={inputClass}
                />
              </div>
              <input
                type="range"
                min={0}
                max={100_000}
                step={500}
                value={clamp(rebateIncome, 0, 100_000)}
                onChange={(e) => setRebateIncome(Number(e.target.value))}
                className="mt-2 w-full accent-eucalyptus"
                aria-hidden="true"
              />
              <p className="text-xs text-warmgray-light mt-1">
                Taxable income plus reportable super contributions, total net investment loss and
                adjusted fringe benefits — not just your salary.
              </p>
            </div>

            {isCouple && (
              <div>
                <label htmlFor="sapto-spouse" className="block text-sm font-medium text-navy mb-1">
                  Your spouse&rsquo;s rebate income
                </label>
                <div className="flex items-center">
                  <span className="text-warmgray-light mr-2">$</span>
                  <input
                    type="number"
                    id="sapto-spouse"
                    min={0}
                    max={300_000}
                    step={100}
                    value={spouseRebateIncome}
                    onChange={(e) =>
                      setSpouseRebateIncome(clamp(Number(e.target.value || 0), 0, 300_000))
                    }
                    className={inputClass}
                  />
                </div>
                <p className="text-xs text-warmgray-light mt-1">
                  Eligibility is tested on half your combined income, so your spouse&rsquo;s income
                  can rule you out even when yours is low.
                </p>
              </div>
            )}

            <label className="flex items-start gap-2 text-sm text-navy">
              <input
                type="checkbox"
                checked={eligibleForPension}
                onChange={(e) => setEligibleForPension(e.target.checked)}
                className="mt-1 rounded border-sandstone-dark/40 text-eucalyptus focus:ring-eucalyptus/20"
              />
              <span>
                I receive, or qualify for, an Australian Government pension or allowance
                <span className="block text-xs text-warmgray-light">
                  Age Pension, Carer Payment, Parenting Payment (single), DVA service pensions and
                  similar. Without this you cannot claim SAPTO at any income.
                </span>
              </span>
            </label>
          </form>

          {/* Results */}
          <div className="space-y-4">
            <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
              <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">
                Your SAPTO
              </div>
              <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(result.offset)}</div>
              <div className="text-sm text-warmgray mt-2">
                {result.reason === "notPensionEligible"
                  ? "You must receive or qualify for a government pension or allowance."
                  : result.reason === "combinedIncomeTooHigh"
                    ? `Rebate income is at or above the ${formatAUD(band.cutOutThreshold)} cut-out.`
                    : result.offset === band.maxOffset
                      ? "Full entitlement"
                      : "Reduced by the shading-out taper"}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
              <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">
                  How this is worked out
                </h3>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <Row label="Maximum offset" value={formatAUD(band.maxOffset)} />
                <Row label="Shading-out threshold" value={formatAUD(band.shadingOutThreshold)} />
                <Row label="Cut-out threshold" value={formatAUD(band.cutOutThreshold)} />
                {isCouple && (
                  <>
                    <div className="border-t border-sandstone-dark/10 pt-3" />
                    <Row
                      label="Combined rebate income"
                      value={formatAUD(result.combinedRebateIncome)}
                    />
                    <Row
                      label="Assessed (half of combined)"
                      value={formatAUD(result.assessedRebateIncome)}
                      muted
                    />
                  </>
                )}
                {result.reduction > 0 && (
                  <>
                    <div className="border-t border-sandstone-dark/10 pt-3" />
                    <Row
                      label={`Reduction at ${SAPTO_REDUCTION_RATE * 100}c per $1 over`}
                      value={`−${formatAUD(result.reduction, 2)}`}
                    />
                  </>
                )}
                <div className="border-t border-sandstone-dark/20 pt-3" />
                <Row label="SAPTO" value={formatAUD(result.offset)} bold />
              </div>
            </div>

            <p className="text-xs text-warmgray-light">
              SAPTO is non-refundable — it reduces tax payable to a minimum of zero and does not
              create a refund on its own. It stacks with the{" "}
              <Link href="/low-income-tax-offset/" className="text-eucalyptus-dark hover:underline">
                Low Income Tax Offset
              </Link>{" "}
              and the{" "}
              <Link href="/zone-tax-offset/" className="text-eucalyptus-dark hover:underline">
                zone tax offset
              </Link>
              . If you are entitled to at least $1 of SAPTO you also qualify for a higher{" "}
              <Link href="/medicare-levy/" className="text-eucalyptus-dark hover:underline">
                Medicare levy
              </Link>{" "}
              low-income threshold.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
