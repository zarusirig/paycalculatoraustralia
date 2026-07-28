"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import {
  ZONE_AREA_RATES,
  ZONE_OFFSET_INCOME_YEAR,
  ZONE_QUALIFYING_DAYS,
  ZONE_DAYS_IN_YEAR,
  INVALID_CARER_OFFSET,
  calculateZoneTaxOffset,
  type ZoneArea,
} from "@/lib/constants/zone-tax-offset";

const AREA_ORDER: ZoneArea[] = ["zoneA", "zoneB", "specialArea", "overseasForces"];

const AREA_HINTS: Record<ZoneArea, string> = {
  zoneA: "Remote areas including Darwin, Alice Springs, Katherine, Mount Isa and Broken Hill.",
  zoneB: "Less remote areas including Townsville, Cairns, Longreach, Kalgoorlie and Port Augusta.",
  specialArea: "Locations more than 250 km by road from a population centre of 2,500 or more.",
  overseasForces: "ADF or UN armed force service in a specified overseas locality.",
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));
}

function Row({
  label,
  value,
  bold,
  muted,
}: {
  label: string;
  value: string;
  bold?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className={muted ? "text-warmgray-light" : "text-warmgray"}>{label}</span>
      <span className={`tabular-nums ${bold ? "font-bold text-navy" : "text-navy"}`}>{value}</span>
    </div>
  );
}

export default function ZoneTaxOffsetCalculator() {
  const [area, setArea] = useState<ZoneArea>("zoneA");
  const [days, setDays] = useState(365);
  const [hasSecond, setHasSecond] = useState(false);
  const [secondArea, setSecondArea] = useState<ZoneArea>("zoneB");
  const [secondDays, setSecondDays] = useState(0);
  const [students, setStudents] = useState(0);
  const [otherChildren, setOtherChildren] = useState(0);
  const [soleParentDays, setSoleParentDays] = useState(0);
  const [invalidCarerOffset, setInvalidCarerOffset] = useState(0);
  const [remoteAreaAllowance, setRemoteAreaAllowance] = useState(0);

  const result = useMemo(
    () =>
      calculateZoneTaxOffset({
        places: hasSecond
          ? [
              { area, days },
              { area: secondArea, days: secondDays },
            ]
          : [{ area, days }],
        students,
        otherChildren,
        soleParentDays,
        invalidCarerOffset,
        remoteAreaAllowance,
      }),
    [
      area,
      days,
      hasSecond,
      secondArea,
      secondDays,
      students,
      otherChildren,
      soleParentDays,
      invalidCarerOffset,
      remoteAreaAllowance,
    ],
  );

  const qualifiesInFull = result.category === 1;
  const inputClass =
    "block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm";

  return (
    <Card className="shadow-md not-prose">
      <CardContent className="p-6 md:p-8">
        <h2
          className="text-xl font-semibold text-navy mb-1"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          Zone Tax Offset Calculator
        </h2>
        <p className="text-sm text-warmgray mb-6">
          Works out your zone or overseas forces tax offset for the {ZONE_OFFSET_INCOME_YEAR} income
          year, following the ATO&rsquo;s own worksheets. Claim it at question T4 in your tax return.
        </p>

        <div className="grid md:grid-cols-[1fr_1fr] gap-8">
          {/* ---------------- Inputs ---------------- */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div>
              <label htmlFor="zone-area" className="block text-sm font-medium text-navy mb-1">
                Where was your usual place of residence?
              </label>
              <select
                id="zone-area"
                value={area}
                onChange={(e) => setArea(e.target.value as ZoneArea)}
                className={inputClass}
              >
                {AREA_ORDER.map((a) => (
                  <option key={a} value={a}>
                    {ZONE_AREA_RATES[a].label} — {formatAUD(ZONE_AREA_RATES[a].fixedAmount)}
                  </option>
                ))}
              </select>
              <p className="text-xs text-warmgray-light mt-1">{AREA_HINTS[area]}</p>
            </div>

            <div>
              <label htmlFor="zone-days" className="block text-sm font-medium text-navy mb-1">
                Days there in {ZONE_OFFSET_INCOME_YEAR}
              </label>
              <input
                type="number"
                id="zone-days"
                min={0}
                max={ZONE_DAYS_IN_YEAR}
                step={1}
                value={days}
                onChange={(e) => setDays(clamp(Number(e.target.value || 0), 0, ZONE_DAYS_IN_YEAR))}
                className="block w-28 rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm"
              />
              <input
                type="range"
                min={0}
                max={ZONE_DAYS_IN_YEAR}
                step={1}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="mt-2 w-full accent-eucalyptus"
                aria-hidden="true"
              />
              <p className="text-xs text-warmgray-light mt-1">
                {ZONE_QUALIFYING_DAYS} days or more claims the full amount. They need not be
                consecutive.
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-navy">
                <input
                  type="checkbox"
                  checked={hasSecond}
                  onChange={(e) => setHasSecond(e.target.checked)}
                  className="rounded border-sandstone-dark/40 text-eucalyptus focus:ring-eucalyptus/20"
                />
                I also lived in a second zone
              </label>
              {hasSecond && (
                <div className="mt-3 space-y-3 pl-6 border-l-2 border-sandstone-dark/20">
                  <select
                    aria-label="Second zone"
                    value={secondArea}
                    onChange={(e) => setSecondArea(e.target.value as ZoneArea)}
                    className={inputClass}
                  >
                    {AREA_ORDER.map((a) => (
                      <option key={a} value={a}>
                        {ZONE_AREA_RATES[a].label} — {formatAUD(ZONE_AREA_RATES[a].fixedAmount)}
                      </option>
                    ))}
                  </select>
                  <div>
                    <label
                      htmlFor="zone-days-2"
                      className="block text-xs font-medium text-navy mb-1"
                    >
                      Days in the second zone
                    </label>
                    <input
                      type="number"
                      id="zone-days-2"
                      min={0}
                      max={ZONE_DAYS_IN_YEAR}
                      step={1}
                      value={secondDays}
                      onChange={(e) =>
                        setSecondDays(clamp(Number(e.target.value || 0), 0, ZONE_DAYS_IN_YEAR))
                      }
                      className="block w-28 rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="zone-students" className="block text-sm font-medium text-navy mb-1">
                  Students under 25
                </label>
                <input
                  type="number"
                  id="zone-students"
                  min={0}
                  max={12}
                  step={1}
                  value={students}
                  onChange={(e) => setStudents(clamp(Number(e.target.value || 0), 0, 12))}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="zone-children" className="block text-sm font-medium text-navy mb-1">
                  Children under 21
                </label>
                <input
                  type="number"
                  id="zone-children"
                  min={0}
                  max={12}
                  step={1}
                  value={otherChildren}
                  onChange={(e) => setOtherChildren(clamp(Number(e.target.value || 0), 0, 12))}
                  className={inputClass}
                />
              </div>
            </div>

            <details className="rounded-lg border border-sandstone-dark/20 bg-sandstone/40 p-4">
              <summary className="cursor-pointer text-sm font-medium text-navy">
                Sole parent, invalid carer or remote area allowance
              </summary>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="zone-sole" className="block text-sm font-medium text-navy mb-1">
                    Days with sole care of a child or student
                  </label>
                  <input
                    type="number"
                    id="zone-sole"
                    min={0}
                    max={ZONE_DAYS_IN_YEAR}
                    step={1}
                    value={soleParentDays}
                    onChange={(e) =>
                      setSoleParentDays(clamp(Number(e.target.value || 0), 0, ZONE_DAYS_IN_YEAR))
                    }
                    className="block w-28 rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm"
                  />
                  <p className="text-xs text-warmgray-light mt-1">
                    Only if you also claim a base amount for that child or student.
                  </p>
                </div>
                <div>
                  <label htmlFor="zone-invalid" className="block text-sm font-medium text-navy mb-1">
                    Invalid and invalid carer offset (question T5)
                  </label>
                  <div className="flex items-center">
                    <span className="text-warmgray-light mr-2">$</span>
                    <input
                      type="number"
                      id="zone-invalid"
                      min={0}
                      max={INVALID_CARER_OFFSET.fullYearMax}
                      step={1}
                      value={invalidCarerOffset}
                      onChange={(e) =>
                        setInvalidCarerOffset(
                          clamp(Number(e.target.value || 0), 0, INVALID_CARER_OFFSET.fullYearMax),
                        )
                      }
                      className={inputClass}
                    />
                  </div>
                  <p className="text-xs text-warmgray-light mt-1">
                    The amount you claim at T5 label B, up to{" "}
                    {formatAUD(INVALID_CARER_OFFSET.fullYearMax)}.
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="zone-allowance"
                    className="block text-sm font-medium text-navy mb-1"
                  >
                    Remote area allowance received
                  </label>
                  <div className="flex items-center">
                    <span className="text-warmgray-light mr-2">$</span>
                    <input
                      type="number"
                      id="zone-allowance"
                      min={0}
                      max={20000}
                      step={1}
                      value={remoteAreaAllowance}
                      onChange={(e) =>
                        setRemoteAreaAllowance(clamp(Number(e.target.value || 0), 0, 20000))
                      }
                      className={inputClass}
                    />
                  </div>
                  <p className="text-xs text-warmgray-light mt-1">
                    From Centrelink or DVA. This reduces your offset dollar for dollar.
                  </p>
                </div>
              </div>
            </details>
          </form>

          {/* ---------------- Results ---------------- */}
          <div className="space-y-4">
            <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
              <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">
                Your zone tax offset
              </div>
              <div className="text-4xl font-extrabold text-navy mb-1">
                {formatAUD(result.offset)}
              </div>
              <div className="text-sm text-warmgray mt-2">
                {result.ineligible
                  ? "Enter the days your usual place of residence was in a zone."
                  : qualifiesInFull
                    ? `Full ${ZONE_AREA_RATES[result.perPlace[0].area].label} entitlement`
                    : `Apportioned across ${result.perPlace.filter((p) => p.daysClaimed > 0).length} location(s)`}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
              <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">
                  How this is worked out
                </h3>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <Row
                  label="Fixed amount"
                  value={formatAUD(result.fixedAmount)}
                />
                <Row label="Total base amount" value={formatAUD(result.totalBaseAmount)} />
                <Row
                  label={`Base amount at ${Math.round(result.basePercentage * 100)}%`}
                  value={formatAUD(result.baseContribution)}
                />
                {result.category === 2 && (
                  <>
                    <div className="border-t border-sandstone-dark/10 pt-3" />
                    {result.perPlace
                      .filter((p) => p.daysClaimed > 0)
                      .map((p) => (
                        <Row
                          key={p.area}
                          label={`${ZONE_AREA_RATES[p.area].label} — ${p.daysClaimed}/${ZONE_QUALIFYING_DAYS} days`}
                          value={formatAUD(p.claimable)}
                        />
                      ))}
                  </>
                )}
                {result.remoteAreaAllowanceApplied > 0 && (
                  <Row
                    label="Less remote area allowance"
                    value={`−${formatAUD(result.remoteAreaAllowanceApplied)}`}
                  />
                )}
                <div className="border-t border-sandstone-dark/20 pt-3" />
                <Row label="Zone tax offset" value={formatAUD(result.offset)} bold />
                <Row
                  label="ATO worksheet"
                  value={result.category === 1 ? "Worksheet 5" : "Worksheets 6–7"}
                  muted
                />
              </div>
            </div>

            <p className="text-xs text-warmgray-light">
              The zone tax offset is non-refundable — it reduces tax payable to a minimum of zero
              and does not generate a refund on its own. Check your location on the{" "}
              <a
                href="https://www.ato.gov.au/calculators-and-tools/tax-offsets-australian-zones"
                target="_blank"
                rel="noopener noreferrer"
                className="text-eucalyptus-dark hover:underline"
              >
                ATO&rsquo;s Australian zone list
              </a>
              , then see how the offset affects your net pay with our{" "}
              <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">
                take-home pay calculator
              </Link>
              .
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
