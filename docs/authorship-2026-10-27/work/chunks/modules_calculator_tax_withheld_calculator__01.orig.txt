"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { FREQUENCY_LABELS, type PayFrequency } from "@/lib/constants/payg-withholding";
import { estimateYearEnd } from "@/lib/constants/tax-rates-reference";

// Tax withheld calculator. Per-pay withholding is the ATO Schedule 1 / 8
// coefficient engine (payg-withholding.ts, verified against the ATO's sample
// data); the year-end comparison is estimateYearEnd() in
// tax-rates-reference.ts, which uses the sitewide 2026-27 tax engine.

const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const INPUT =
  "block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm";
const FY = SITE_CONFIG.financialYear;
const m = (n: number, d = 0) => formatAUD(n, d);

const TABLE_PAGE: Record<PayFrequency, { href: string; label: string }> = {
  weekly: { href: "/weekly-tax-table/", label: "weekly tax table" },
  fortnightly: { href: "/fortnightly-tax-table/", label: "fortnightly tax table" },
  monthly: { href: "/monthly-tax-table/", label: "monthly tax table" },
};

const DEFAULT_PAY: Record<PayFrequency, number> = { weekly: 1_400, fortnightly: 2_800, monthly: 6_000 };

export default function TaxWithheldCalculator() {
  const [frequency, setFrequency] = useState<PayFrequency>("fortnightly");
  const [gross, setGross] = useState(DEFAULT_PAY.fortnightly);
  const [tft, setTft] = useState(true);
  const [help, setHelp] = useState(false);
  const [foreign, setForeign] = useState(false);

  const e = useMemo(
    () => estimateYearEnd({ grossPerPeriod: gross, frequency, claimsTaxFreeThreshold: tft, hasStudyLoan: help, foreignResident: foreign }),
    [gross, frequency, tft, help, foreign],
  );
  const period = FREQUENCY_LABELS[frequency];
  const refund = e.difference >= 0;
  const close = Math.abs(e.difference) < 50;

  return (
    <Card className="shadow-md not-prose" id="calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={FONT}>Tax Withheld Calculator {FY}</h2>
        <p className="text-sm text-warmgray mb-6">
          Enter your gross pay (before tax) for one pay period. Uses the ATO&rsquo;s withholding formulas for payments from 1 July 2026.
        </p>

        <form onSubmit={(ev) => ev.preventDefault()} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="tw-freq" className="block text-sm font-medium text-navy mb-1">How often are you paid?</label>
            <select
              id="tw-freq"
              value={frequency}
              onChange={(ev) => {
                const f = ev.target.value as PayFrequency;
                setFrequency(f);
                setGross(DEFAULT_PAY[f]);
              }}
              className={INPUT}
            >
              <option value="weekly">Weekly</option>
              <option value="fortnightly">Fortnightly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label htmlFor="tw-gross" className="block text-sm font-medium text-navy mb-1">Gross pay per {period} ($)</label>
            <input
              id="tw-gross"
              type="number"
              inputMode="decimal"
              min={0}
              step={10}
              value={gross}
              onChange={(ev) => setGross(Math.max(0, Math.min(100_000, Number(ev.target.value || 0))))}
              className={INPUT}
            />
          </div>
          <fieldset>
            <legend className="text-sm font-medium text-navy mb-2">Residency</legend>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-navy">
              <label className="flex items-center gap-2"><input type="radio" name="tw-res" checked={!foreign} onChange={() => setForeign(false)} className="accent-eucalyptus" />Australian resident</label>
              <label className="flex items-center gap-2"><input type="radio" name="tw-res" checked={foreign} onChange={() => setForeign(true)} className="accent-eucalyptus" />Foreign resident</label>
            </div>
          </fieldset>
          <fieldset disabled={foreign} className={foreign ? "opacity-50" : ""}>
            <legend className="text-sm font-medium text-navy mb-2">Tax-free threshold claimed with this employer?</legend>
            <div className="flex gap-6 text-sm text-navy">
              <label className="flex items-center gap-2"><input type="radio" name="tw-tft" checked={tft} onChange={() => setTft(true)} className="accent-eucalyptus" />Yes</label>
              <label className="flex items-center gap-2"><input type="radio" name="tw-tft" checked={!tft} onChange={() => setTft(false)} className="accent-eucalyptus" />No</label>
            </div>
          </fieldset>
          <label className="sm:col-span-2 flex items-start gap-2 text-sm text-navy">
            <input type="checkbox" checked={help} onChange={(ev) => setHelp(ev.target.checked)} className="mt-1 accent-eucalyptus" />
            <span>I have a HECS-HELP or other study and training loan</span>
          </label>
        </form>

        <div role="status" aria-live="polite" className="mt-6">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-lg bg-eucalyptus-light/40 p-3">
              <dt className="text-xs text-warmgray">Tax withheld per {period}</dt>
              <dd className="text-2xl font-bold text-navy tabular-nums">{m(e.perPeriod.totalWithheld)}</dd>
              {help && <dd className="text-xs text-warmgray-light">incl. {m(e.perPeriod.stslWithheld)} study loan</dd>}
            </div>
            <div className="rounded-lg bg-sandstone p-3">
              <dt className="text-xs text-warmgray">Take-home per {period}</dt>
              <dd className="text-2xl font-bold text-navy tabular-nums">{m(e.perPeriod.netPerPeriod, e.perPeriod.netPerPeriod % 1 ? 2 : 0)}</dd>
            </div>
            <div className="rounded-lg bg-sandstone p-3">
              <dt className="text-xs text-warmgray">Withheld over the year</dt>
              <dd className="text-2xl font-bold text-navy tabular-nums">{m(e.annualWithheld)}</dd>
              <dd className="text-xs text-warmgray-light">{e.periods} pays of {m(e.perPeriod.totalWithheld)}</dd>
            </div>
            <div className="rounded-lg bg-sandstone p-3">
              <dt className="text-xs text-warmgray">Tax on {m(e.annualIncome)} a year</dt>
              <dd className="text-2xl font-bold text-navy tabular-nums">{m(e.liability)}</dd>
              <dd className="text-xs text-warmgray-light">{foreign ? "foreign resident rates" : "incl. Medicare levy"}{help ? " + HELP" : ""}</dd>
            </div>
          </dl>

          <div className={`mt-4 rounded-lg border-l-4 p-4 text-sm text-navy ${close || refund ? "border-eucalyptus bg-eucalyptus-light/30" : "border-ochre bg-sandstone"}`}>
            <p className="font-bold text-base mb-1">
              {close
                ? "Withholding is about right"
                : refund
                  ? `Likely refund of about ${m(e.difference)}`
                  : `Likely tax bill of about ${m(-e.difference)}`}
            </p>
            <p>
              If this is your only income for a full year and you have no deductions, your employer will withhold {m(e.annualWithheld)} and your {FY} tax {help ? "and HELP repayment " : ""}comes to {m(e.liability)}.
              {!tft && !foreign && " You haven't claimed the tax-free threshold here, so if this is your only job you're over-withholding and should claim it."}
              {!refund && !close && " Deductions or offsets would reduce the bill."}
            </p>
          </div>

          <div className="mt-4 overflow-x-auto rounded-lg border border-sandstone-dark/20">
            <table className="w-full text-sm text-left text-warmgray">
              <caption className="sr-only">Year-end estimate</caption>
              <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                <tr><td className="px-3 py-2">Income tax{e.lito > 0 ? ` (after ${m(e.lito)} low income tax offset)` : ""}</td><td className="px-3 py-2 text-right tabular-nums">{m(e.incomeTax)}</td></tr>
                <tr><td className="px-3 py-2">Medicare levy</td><td className="px-3 py-2 text-right tabular-nums">{m(e.medicareLevy)}</td></tr>
                {help && <tr><td className="px-3 py-2">Compulsory study loan repayment</td><td className="px-3 py-2 text-right tabular-nums">{m(e.studyLoanRepayment)}</td></tr>}
                <tr className="font-semibold text-navy"><td className="px-3 py-2">Total owed for the year</td><td className="px-3 py-2 text-right tabular-nums">{m(e.liability)}</td></tr>
                <tr><td className="px-3 py-2">Less: tax withheld ({m(e.annualPaygWithheld)} PAYG{help ? ` + ${m(e.annualStslWithheld)} study loan` : ""})</td><td className="px-3 py-2 text-right tabular-nums">{m(e.annualWithheld)}</td></tr>
                <tr className="font-semibold text-navy"><td className="px-3 py-2">{refund ? "Estimated refund" : "Estimated amount to pay"}</td><td className="px-3 py-2 text-right tabular-nums">{m(Math.abs(e.difference))}</td></tr>
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-warmgray-light">
            Estimate only. Assumes the same pay every {period} for all of {FY}, no deductions, no other income, single Medicare levy thresholds and no Medicare levy surcharge. See every pay amount in the full <Link href={TABLE_PAGE[frequency].href} className="underline">{TABLE_PAGE[frequency].label}</Link>; for a bonus or back pay use the <Link href="/schedule-5-tax-table/" className="underline">Schedule 5 calculator</Link>.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
