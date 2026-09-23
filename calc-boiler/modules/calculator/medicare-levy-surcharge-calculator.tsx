"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD, formatPercent } from "@/lib/constants";
import {
  MLS_DAYS_IN_YEAR,
  MLS_INCOME_YEAR,
  MLS_SPOUSE_LOW_INCOME,
  PHI_REBATE,
  compareCoverWithSurcharge,
  estimateMls,
  formatMlsRate,
  type PhiAgeBracket,
} from "@/lib/constants/medicare-levy-surcharge";

// Every figure comes from lib/constants/medicare-levy-surcharge.ts, which cites
// the ATO pages it was verified against. The tier is decided on income for MLS
// purposes (combined for families); the rate is charged on taxable income plus
// reportable fringe benefits only (ATO QC71227).

const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const INPUT =
  "block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm";

type Status = "single" | "couple" | "singleParent";
type Cover = "none" | "part" | "full";

const money = (n: number) => formatAUD(n, n % 1 === 0 ? 0 : 2);
const num = (v: string) => Math.max(0, Number(v || 0));

function Field({ id, label, hint, value, onChange, step = 1_000 }: { id: string; label: string; hint?: string; value: number; onChange: (n: number) => void; step?: number }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-navy mb-1">{label}</label>
      <input id={id} type="number" min={0} step={step} value={value} onChange={(e) => onChange(num(e.target.value))} className={INPUT} />
      {hint && <p className="mt-1 text-xs text-warmgray">{hint}</p>}
    </div>
  );
}

function Row({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 py-2 text-sm ${muted ? "text-warmgray" : "text-navy"}`}>
      <dt>{label}</dt>
      <dd className={`tabular-nums text-right ${bold ? "font-bold text-base" : "font-medium"}`}>{value}</dd>
    </div>
  );
}

export default function MedicareLevySurchargeCalculator() {
  const [status, setStatus] = useState<Status>("single");
  const [children, setChildren] = useState(0);
  const [taxable, setTaxable] = useState(115_000);
  const [rfb, setRfb] = useState(0);
  const [losses, setLosses] = useState(0);
  const [resc, setResc] = useState(0);
  const [spouse, setSpouse] = useState(90_000);
  const [cover, setCover] = useState<Cover>("none");
  const [daysWithout, setDaysWithout] = useState(183);
  const [age, setAge] = useState<PhiAgeBracket>("under65");
  const [premium, setPremium] = useState(2_000);

  const hasSpouse = status === "couple";
  const kids = status === "single" ? 0 : children;

  const est = useMemo(
    () =>
      estimateMls({
        own: { taxableIncome: taxable, reportableFringeBenefits: rfb, netInvestmentLosses: losses, reportableSuperContributions: resc },
        hasSpouse,
        spouseMlsIncome: spouse,
        dependentChildren: kids,
        daysWithoutCover: cover === "full" ? 0 : cover === "none" ? MLS_DAYS_IN_YEAR : daysWithout,
      }),
    [taxable, rfb, losses, resc, hasSpouse, spouse, kids, cover, daysWithout],
  );
  const cmp = useMemo(() => compareCoverWithSurcharge(premium, est.tier, age, est.fullYearSurcharge), [premium, est.tier, age, est.fullYearSurcharge]);

  return (
    <Card className="shadow-md not-prose" id="mls-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={FONT}>Medicare Levy Surcharge Calculator {MLS_INCOME_YEAR}</h2>
        <p className="text-sm text-warmgray mb-6">Uses the ATO&rsquo;s {MLS_INCOME_YEAR} surcharge tiers. Enter income for the whole year, before any cover changes.</p>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="mls-status" className="block text-sm font-medium text-navy mb-1">For the whole year you were</label>
                <select id="mls-status" value={status} onChange={(e) => setStatus(e.target.value as Status)} className={INPUT}>
                  <option value="single">Single, no dependent children</option>
                  <option value="couple">Married or de facto</option>
                  <option value="singleParent">Single with dependent children</option>
                </select>
              </div>
              {status !== "single" && (
                <Field id="mls-kids" label="MLS dependent children" hint="Under 21, or 21–24 and studying full time." value={kids} onChange={(n) => setChildren(Math.min(12, Math.floor(n)))} step={1} />
              )}
            </div>

            <fieldset className="grid gap-4 sm:grid-cols-2">
              <legend className="text-sm font-semibold text-navy mb-2 sm:col-span-2">Your income for MLS purposes</legend>
              <Field id="mls-taxable" label="Taxable income" value={taxable} onChange={setTaxable} />
              <Field id="mls-rfb" label="Reportable fringe benefits" hint="From your income statement, e.g. a novated lease." value={rfb} onChange={setRfb} />
              <Field id="mls-losses" label="Net investment losses" hint="Rental and financial investment losses, as a positive number." value={losses} onChange={setLosses} />
              <Field id="mls-resc" label="Reportable super contributions" hint="Salary sacrifice plus personal contributions you claim a deduction for." value={resc} onChange={setResc} />
            </fieldset>

            {hasSpouse && (
              <Field id="mls-spouse" label="Your spouse's income for MLS purposes" hint="Their taxable income plus the same three add-backs." value={spouse} onChange={setSpouse} />
            )}

            <fieldset>
              <legend className="text-sm font-semibold text-navy mb-2">Private patient hospital cover{hasSpouse || kids > 0 ? " (for everyone in the family)" : ""}</legend>
              <div className="space-y-2 text-sm text-navy">
                <label className="flex items-center gap-2"><input type="radio" name="mls-cover" checked={cover === "none"} onChange={() => setCover("none")} className="accent-eucalyptus" />None all year</label>
                <label className="flex items-center gap-2"><input type="radio" name="mls-cover" checked={cover === "part"} onChange={() => setCover("part")} className="accent-eucalyptus" />Part of the year</label>
                <label className="flex items-center gap-2"><input type="radio" name="mls-cover" checked={cover === "full"} onChange={() => setCover("full")} className="accent-eucalyptus" />All year</label>
              </div>
              {cover === "part" && (
                <div className="mt-3 max-w-xs"><Field id="mls-days" label={`Days without cover (of ${MLS_DAYS_IN_YEAR})`} value={daysWithout} onChange={(n) => setDaysWithout(Math.min(MLS_DAYS_IN_YEAR, Math.floor(n)))} step={1} /></div>
              )}
            </fieldset>
          </form>

          <div>
            <dl className="divide-y divide-sandstone-dark/20 rounded-xl border border-sandstone-dark/20 bg-sandstone/40 px-5 py-2">
              <Row label="Your income for MLS purposes" value={formatAUD(est.ownMlsIncome)} />
              {est.usesFamilyThresholds && <Row label="Family income tested" value={formatAUD(est.testedIncome)} />}
              <Row label={`Surcharge-free up to (${est.usesFamilyThresholds ? "family" : "single"})`} value={formatAUD(est.baseThreshold)} muted />
              <Row label="Your tier" value={est.tier === 0 ? "Base tier (0%)" : `Tier ${est.tier} (${formatMlsRate(est.rate)})`} />
              <Row label="Charged on (taxable income + fringe benefits)" value={formatAUD(est.chargeBase)} muted />
              <Row label="Surcharge for a full year without cover" value={money(est.fullYearSurcharge)} />
              <Row label={cover === "part" ? `Your surcharge (${est.daysWithoutCover} days)` : "Your Medicare levy surcharge"} value={money(est.surcharge)} bold />
            </dl>
            <p className="mt-3 text-xs text-warmgray" role="status" aria-live="polite">
              {est.tier === 0
                ? `You're under the ${formatAUD(est.baseThreshold)} threshold, so no surcharge applies with or without cover.`
                : cover === "full"
                  ? "Your hospital cover means no surcharge. Without it, the full-year figure above would apply."
                  : `Charged at ${formatMlsRate(est.rate)} on ${formatAUD(est.chargeBase)}. It isn't withheld from your pay, so it's added when you lodge. This is on top of the 2% Medicare levy.`}
            </p>
            {hasSpouse && est.tier > 0 && (
              <p className="mt-2 text-xs text-warmgray">
                If your own income for MLS purposes is very low, you may not pay it at all: the ATO&rsquo;s {MLS_SPOUSE_LOW_INCOME.incomeYear} figure was {formatAUD(MLS_SPOUSE_LOW_INCOME.amount)} or less. It hasn&rsquo;t published the {MLS_INCOME_YEAR} figure, so this calculator doesn&rsquo;t apply it.
              </p>
            )}
          </div>
        </div>

        {est.tier > 0 && (
          <div className="mt-8 border-t border-sandstone-dark/20 pt-6">
            <h3 className="text-base font-semibold text-navy mb-1" style={FONT}>Is hospital cover cheaper than the surcharge?</h3>
            <p className="text-sm text-warmgray mb-4">Enter a real quote for private patient hospital cover. Your government rebate is worked out from the same tier.</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
              <Field id="mls-premium" label="Annual hospital premium, before rebate" value={premium} onChange={setPremium} step={100} />
              <div>
                <label htmlFor="mls-age" className="block text-sm font-medium text-navy mb-1">Oldest person on the policy</label>
                <select id="mls-age" value={age} onChange={(e) => setAge(e.target.value as PhiAgeBracket)} className={INPUT}>
                  <option value="under65">Under 65</option>
                  <option value="age65to69">65 to 69</option>
                  <option value="age70plus">70 or over</option>
                </select>
              </div>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-sandstone p-3"><dt className="text-xs text-warmgray">Surcharge, full year</dt><dd className="text-lg font-bold text-navy tabular-nums">{money(cmp.surcharge)}</dd></div>
              <div className="rounded-lg bg-sandstone p-3"><dt className="text-xs text-warmgray">Premium after {formatPercent(cmp.rebateRate, 3)} rebate</dt><dd className="text-lg font-bold text-navy tabular-nums">{money(cmp.netPremium)}</dd></div>
              <div className={`rounded-lg p-3 ${cmp.coverIsCheaper ? "bg-eucalyptus-light/40" : "bg-ochre/10"}`}><dt className="text-xs text-warmgray">{cmp.coverIsCheaper ? "Cover saves you" : "Cover costs you more by"}</dt><dd className="text-lg font-bold text-navy tabular-nums">{money(Math.abs(cmp.surchargeMinusPremium))}</dd></div>
            </dl>
            <p className="mt-3 text-xs text-warmgray-light">Rebate rates apply {PHI_REBATE.period}; new rates from 1 April 2027 aren&rsquo;t published yet. This compares cost only; it ignores what the policy covers and any lifetime health cover loading. To count, cover must be private patient hospital cover with an excess no higher than the ATO limit; extras-only cover doesn&rsquo;t.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
