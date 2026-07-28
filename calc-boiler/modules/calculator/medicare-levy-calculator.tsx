"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { MEDICARE_LEVY, formatAUD, formatPercent } from "@/lib/constants";
import {
  MEDICARE_LEVY_INCOME_YEAR,
  MEDICARE_LEVY_SENIORS,
  MLS_CHILD_INCREMENT,
  MLS_INCOME_YEAR,
  calculateMLS,
  calculateMedicareLevyDetailed,
  type MedicareLevyBand,
} from "@/lib/constants/medicare-levy-extra";

type Situation = "single" | "soleParent" | "couple";

const SITUATIONS: { value: Situation; label: string; hint: string }[] = [
  {
    value: "single",
    label: "Single, no dependants",
    hint: "No spouse on 30 June and no dependent children.",
  },
  {
    value: "soleParent",
    label: "Single with dependent children",
    hint: "No spouse, but you maintained a dependent child. The family threshold is tested on your own taxable income.",
  },
  {
    value: "couple",
    label: "Couple or family",
    hint: "Married or de facto on 30 June. The family threshold is tested on your combined taxable income.",
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));
}

/** The ATO quotes the levy in cents, so only drop them when there are none. */
function money(value: number) {
  return Number.isInteger(value) ? formatAUD(value) : formatAUD(value, 2);
}

function Row({
  label,
  value,
  bold,
  muted,
  negative,
}: {
  label: string;
  value: string;
  bold?: boolean;
  muted?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className={muted ? "text-warmgray-light" : "text-warmgray"}>{label}</span>
      <span
        className={`tabular-nums ${negative ? "text-eucalyptus-dark" : bold ? "font-bold text-navy" : "text-navy"}`}
      >
        {value}
      </span>
    </div>
  );
}

export default function MedicareLevyCalculator() {
  const [situation, setSituation] = useState<Situation>("single");
  const [taxableIncome, setTaxableIncome] = useState(75_000);
  const [spouseIncome, setSpouseIncome] = useState(45_000);
  const [children, setChildren] = useState(0);
  const [seniorPensioner, setSeniorPensioner] = useState(false);
  const [hasCover, setHasCover] = useState(false);
  const [surchargeExtras, setSurchargeExtras] = useState(0);

  const hasSpouse = situation === "couple";
  const dependentChildren = situation === "single" ? 0 : children;

  const levy = useMemo(
    () =>
      calculateMedicareLevyDetailed({
        taxableIncome,
        hasSpouse,
        spouseTaxableIncome: spouseIncome,
        dependentChildren,
        seniorPensioner,
      }),
    [taxableIncome, hasSpouse, spouseIncome, dependentChildren, seniorPensioner],
  );

  const mls = useMemo(
    () =>
      calculateMLS({
        mlsIncome: taxableIncome + surchargeExtras,
        spouseMlsIncome: spouseIncome,
        hasSpouse,
        dependentChildren,
        hasPrivateHospitalCover: hasCover,
      }),
    [taxableIncome, surchargeExtras, spouseIncome, hasSpouse, dependentChildren, hasCover],
  );

  const total = levy.levy + mls.surcharge;

  // Every sentence below is generated from the engine result, so the
  // explanation cannot drift from the number above it.
  const BAND_REASON: Record<MedicareLevyBand, string> = {
    belowSingleThreshold: `Your taxable income is at or under the ${formatAUD(levy.singleLowerThreshold)} lower threshold${
      levy.usesSeniorThresholds ? " for seniors and pensioners" : ""
    }, so no levy is payable.`,
    belowFamilyThreshold: `Your family taxable income of ${formatAUD(levy.familyIncome)} is at or under the ${formatAUD(
      levy.familyLowerThreshold ?? 0,
    )} family threshold, so no levy is payable.`,
    singleShadeIn: `You are inside the shade-in band between ${formatAUD(levy.singleLowerThreshold)} and ${formatAUD(
      levy.singleUpperThreshold,
    )}, so you pay ${formatPercent(MEDICARE_LEVY.shadeInRate, 0)} of the amount over the lower threshold instead of the full ${formatPercent(
      MEDICARE_LEVY.rate,
      0,
    )}.`,
    familyReduced: `Your family taxable income of ${formatAUD(levy.familyIncome)} is between the ${formatAUD(
      levy.familyLowerThreshold ?? 0,
    )} family threshold and ${formatAUD(levy.familyUpperThreshold ?? 0)}, so the family reduction cuts your levy.`,
    full: `Your income is above every reduction threshold, so the full ${formatPercent(MEDICARE_LEVY.rate, 0)} applies.`,
  };

  const inputClass =
    "block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm";

  return (
    <Card className="shadow-md not-prose">
      <CardContent className="p-6 md:p-8">
        <h2
          className="text-xl font-semibold text-navy mb-1"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          Medicare Levy Calculator
        </h2>
        <p className="text-sm text-warmgray mb-6">
          Works out the {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy including the low-income
          shade-in, the family and seniors thresholds, and the separate Medicare levy surcharge.
          Levy thresholds are the ATO&rsquo;s {MEDICARE_LEVY_INCOME_YEAR} figures; surcharge tiers
          are {MLS_INCOME_YEAR}.
        </p>

        <div className="grid md:grid-cols-[1fr_1fr] gap-8">
          {/* Inputs */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div>
              <label htmlFor="ml-situation" className="block text-sm font-medium text-navy mb-1">
                Your situation
              </label>
              <select
                id="ml-situation"
                value={situation}
                onChange={(e) => setSituation(e.target.value as Situation)}
                className={inputClass}
              >
                {SITUATIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-warmgray-light mt-1">
                {SITUATIONS.find((s) => s.value === situation)?.hint}
              </p>
            </div>

            <div>
              <label htmlFor="ml-income" className="block text-sm font-medium text-navy mb-1">
                Your taxable income
              </label>
              <div className="flex items-center">
                <span className="text-warmgray-light mr-2">$</span>
                <input
                  type="number"
                  id="ml-income"
                  min={0}
                  max={1_000_000}
                  step={100}
                  value={taxableIncome}
                  onChange={(e) => setTaxableIncome(clamp(Number(e.target.value || 0), 0, 1_000_000))}
                  className={inputClass}
                />
              </div>
              <input
                type="range"
                min={0}
                max={250_000}
                step={500}
                value={clamp(taxableIncome, 0, 250_000)}
                onChange={(e) => setTaxableIncome(Number(e.target.value))}
                className="mt-2 w-full accent-eucalyptus"
                aria-hidden="true"
              />
              <p className="text-xs text-warmgray-light mt-1">
                Gross income less allowable deductions — not your gross salary.
              </p>
            </div>

            {hasSpouse && (
              <div>
                <label htmlFor="ml-spouse" className="block text-sm font-medium text-navy mb-1">
                  Your spouse&rsquo;s taxable income
                </label>
                <div className="flex items-center">
                  <span className="text-warmgray-light mr-2">$</span>
                  <input
                    type="number"
                    id="ml-spouse"
                    min={0}
                    max={1_000_000}
                    step={100}
                    value={spouseIncome}
                    onChange={(e) => setSpouseIncome(clamp(Number(e.target.value || 0), 0, 1_000_000))}
                    className={inputClass}
                  />
                </div>
                <p className="text-xs text-warmgray-light mt-1">
                  Family taxable income is the two combined, and it decides whether the family
                  reduction applies to either of you.
                </p>
              </div>
            )}

            {situation !== "single" && (
              <div>
                <label htmlFor="ml-children" className="block text-sm font-medium text-navy mb-1">
                  Dependent children
                </label>
                <input
                  type="number"
                  id="ml-children"
                  min={0}
                  max={12}
                  step={1}
                  value={children}
                  onChange={(e) => setChildren(clamp(Number(e.target.value || 0), 0, 12))}
                  className={inputClass}
                />
                <p className="text-xs text-warmgray-light mt-1">
                  Each one lifts the family levy threshold by {formatAUD(MEDICARE_LEVY.additionalChild)}.
                  For the surcharge, only children after the first count, at{" "}
                  {formatAUD(MLS_CHILD_INCREMENT)} each.
                </p>
              </div>
            )}

            <label className="flex items-start gap-2 text-sm text-navy">
              <input
                type="checkbox"
                checked={seniorPensioner}
                onChange={(e) => setSeniorPensioner(e.target.checked)}
                className="mt-1 rounded border-sandstone-dark/40 text-eucalyptus focus:ring-eucalyptus/20"
              />
              <span>
                I am entitled to the seniors and pensioners tax offset (SAPTO)
                <span className="block text-xs text-warmgray-light">
                  Entitlement to at least $1 of SAPTO lifts your levy threshold to{" "}
                  {formatAUD(MEDICARE_LEVY_SENIORS.singleThreshold)} single and{" "}
                  {formatAUD(MEDICARE_LEVY_SENIORS.familyThreshold)} family. Being of age-pension age
                  is not enough on its own — check with the{" "}
                  <Link href="/sapto-calculator/" className="text-eucalyptus-dark hover:underline">
                    SAPTO calculator
                  </Link>
                  .
                </span>
              </span>
            </label>

            <div className="border-t border-sandstone-dark/20 pt-5 space-y-5">
              <label className="flex items-start gap-2 text-sm text-navy">
                <input
                  type="checkbox"
                  checked={hasCover}
                  onChange={(e) => setHasCover(e.target.checked)}
                  className="mt-1 rounded border-sandstone-dark/40 text-eucalyptus focus:ring-eucalyptus/20"
                />
                <span>
                  I held private patient hospital cover all year
                  <span className="block text-xs text-warmgray-light">
                    Removes the surcharge only. It does not reduce the{" "}
                    {formatPercent(MEDICARE_LEVY.rate, 0)} levy by a cent.
                  </span>
                </span>
              </label>

              <div>
                <label htmlFor="ml-extras" className="block text-sm font-medium text-navy mb-1">
                  Other income counted for the surcharge
                </label>
                <div className="flex items-center">
                  <span className="text-warmgray-light mr-2">$</span>
                  <input
                    type="number"
                    id="ml-extras"
                    min={0}
                    max={1_000_000}
                    step={100}
                    value={surchargeExtras}
                    onChange={(e) => setSurchargeExtras(clamp(Number(e.target.value || 0), 0, 1_000_000))}
                    className={inputClass}
                  />
                </div>
                <p className="text-xs text-warmgray-light mt-1">
                  Reportable fringe benefits, reportable super contributions and total net investment
                  losses. These count for the surcharge but not for the levy, which is why salary
                  sacrificing does not get you under the surcharge threshold.
                </p>
              </div>
            </div>
          </form>

          {/* Results */}
          <div className="space-y-4">
            <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
              <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">
                Your Medicare levy
              </div>
              <div className="text-4xl font-extrabold text-navy mb-1">{money(levy.levy)}</div>
              <div className="text-sm text-warmgray mt-2">{BAND_REASON[levy.band]}</div>
            </div>

            <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
              <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">
                  How this is worked out
                </h3>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <Row
                  label={`${formatPercent(MEDICARE_LEVY.rate, 0)} of your taxable income`}
                  value={money(levy.fullRateLevy)}
                />
                <Row
                  label={`Lower threshold${levy.usesSeniorThresholds ? " (seniors)" : ""}`}
                  value={formatAUD(levy.singleLowerThreshold)}
                  muted
                />
                <Row
                  label="Full levy applies above"
                  value={formatAUD(levy.singleUpperThreshold)}
                  muted
                />
                {levy.levyAfterIndividualReduction < levy.fullRateLevy && (
                  <Row
                    label="Low-income reduction"
                    value={`−${money(levy.fullRateLevy - levy.levyAfterIndividualReduction)}`}
                    negative
                  />
                )}

                {levy.familyProvisionsApply && levy.familyLowerThreshold !== null && (
                  <>
                    <div className="border-t border-sandstone-dark/10 pt-3" />
                    <Row label="Family taxable income" value={formatAUD(levy.familyIncome)} />
                    <Row
                      label={`Family threshold${dependentChildren > 0 ? ` (${dependentChildren} ${dependentChildren === 1 ? "child" : "children"})` : ""}`}
                      value={formatAUD(levy.familyLowerThreshold)}
                      muted
                    />
                    <Row
                      label="Family reduction ends at"
                      value={formatAUD(levy.familyUpperThreshold ?? 0)}
                      muted
                    />
                    {levy.familyReduction > 0 && (
                      <Row
                        label="Family reduction"
                        value={`−${money(levy.familyReduction)}`}
                        negative
                      />
                    )}
                  </>
                )}

                <div className="border-t border-sandstone-dark/20 pt-3" />
                <Row label="Your Medicare levy" value={money(levy.levy)} bold />
                {hasSpouse && (
                  <>
                    <Row label="Your spouse’s levy" value={money(levy.spouseLevy)} muted />
                    <Row label="Household total" value={money(levy.householdLevy)} />
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
              <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">
                  Medicare levy surcharge — a separate charge
                </h3>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <Row
                  label={
                    mls.usesFamilyThresholds
                      ? "Combined income for surcharge purposes"
                      : "Your income for surcharge purposes"
                  }
                  value={formatAUD(mls.testedIncome)}
                />
                <Row label="Surcharge-free up to" value={formatAUD(mls.baseThreshold)} muted />
                <Row
                  label="Your tier"
                  value={
                    mls.tier === 0
                      ? "Base tier — nil"
                      : `Tier ${mls.tier} at ${formatPercent(mls.rate, 2)}`
                  }
                  muted
                />
                <div className="border-t border-sandstone-dark/20 pt-3" />
                <Row label="Medicare levy surcharge" value={money(mls.surcharge)} bold />
                <p className="text-xs text-warmgray-light pt-1">
                  {mls.avoidedByCover
                    ? "Your hospital cover is what makes this nil. Without it you would be in a surcharge tier on this income."
                    : mls.tier === 0
                      ? `You are under the ${formatAUD(mls.baseThreshold)} threshold, so no surcharge applies whether or not you hold cover.`
                      : `Charged on your own income for surcharge purposes at the tier set by your ${mls.usesFamilyThresholds ? "combined" : ""} income. Compliant hospital cover for the full year removes it entirely.`}
                </p>
              </div>
            </div>

            <div className="bg-navy text-white rounded-xl p-5 flex items-baseline justify-between gap-4">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Total Medicare cost
              </span>
              <span className="text-2xl font-extrabold tabular-nums">{money(total)}</span>
            </div>

            <p className="text-xs text-warmgray-light">
              An estimate for a full year of Australian residency, before any exemption. It does not
              include income tax — see the{" "}
              <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">
                income tax calculator
              </Link>{" "}
              or the{" "}
              <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">
                take-home pay calculator
              </Link>{" "}
              for your full position.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
